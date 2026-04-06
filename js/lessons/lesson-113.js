/**
 * Playwright Academy - Leccion 113
 * Ejecucion paralela y sharding
 * Seccion 17: CI/CD Integration
 */

const LESSON_113 = {
    id: 113,
    title: "Ejecución paralela y sharding",
    duration: "7 min",
    level: "advanced",
    section: "section-17",
    content: `
        <h2>Ejecucion paralela y sharding</h2>
        <p>Cuando un test suite crece a cientos de tests, la ejecucion secuencial se convierte en un
        cuello de botella para el ciclo de CI/CD. Esta leccion cubre dos estrategias complementarias
        para reducir drasticamente los tiempos de ejecucion: <strong>paralelismo local con pytest-xdist</strong>
        y <strong>sharding distribuido</strong> en pipelines CI.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Por que importa la ejecucion paralela</h4>
            <p>Un test suite de 200 tests de Playwright que tarda <strong>40 minutos</strong> en secuencial
            puede reducirse a <strong>10 minutos</strong> con 4 workers locales, o a <strong>3-4 minutos</strong>
            combinando sharding en 3 maquinas CI con xdist en cada una. El feedback rapido es clave
            para la productividad del equipo.</p>
        </div>

        <h3>1. pytest-xdist: paralelismo local</h3>
        <p><code>pytest-xdist</code> es el plugin estandar de pytest para distribuir tests en multiples
        workers (procesos) dentro de la misma maquina. Cada worker recibe un subconjunto de tests
        y los ejecuta de forma independiente.</p>

        <h4>Instalacion</h4>
        <pre><code class="bash"># Instalar el plugin
pip install pytest-xdist

# Verificar la instalacion
pytest --co -q  # Lista los tests disponibles</code></pre>

        <h4>Ejecucion con multiples workers</h4>
        <pre><code class="bash"># Detectar automaticamente el numero de CPUs y usar ese numero de workers
pytest -n auto

# Usar un numero fijo de workers
pytest -n 4

# Ejecutar solo tests de Playwright con 4 workers
pytest tests/ -n 4 --headed  # O --headless por defecto

# Ver que worker ejecuta cada test (verbose)
pytest -n 4 -v</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>Para tests de Playwright con navegadores, usa <code>-n auto</code> con cuidado. Si la
            maquina tiene 16 cores, lanzar 16 navegadores simultaneos puede saturar la memoria RAM.
            Una buena regla es usar <strong>la mitad de los cores disponibles</strong> o limitar a
            <code>-n 4</code> o <code>-n 6</code> para evitar contention de recursos.</p>
        </div>

        <h3>2. Como xdist distribuye los tests</h3>
        <p>Por defecto, xdist usa el algoritmo <strong>load balancing</strong>: envia un test a cada
        worker que este libre. Existen varias estrategias de distribucion:</p>

        <pre><code class="bash"># load (por defecto): balancea carga dinamicamente
pytest -n 4 --dist load

# loadscope: agrupa tests del mismo modulo/clase en el mismo worker
# Ideal cuando los tests de un archivo comparten setup costoso
pytest -n 4 --dist loadscope

# loadfile: todos los tests de un archivo van al mismo worker
pytest -n 4 --dist loadfile

# loadgroup: agrupa tests por marca @pytest.mark.xdist_group
pytest -n 4 --dist loadgroup

# no: sin distribucion (util para debugging)
pytest -n 4 --dist no</code></pre>

        <pre><code class="python"># Usar xdist_group para agrupar tests relacionados
import pytest

@pytest.mark.xdist_group("modulo_facturacion")
class TestFacturacion:
    def test_crear_factura(self, page):
        page.goto("/facturacion/nueva")
        # ...

    def test_anular_factura(self, page):
        page.goto("/facturacion/anular")
        # ...

@pytest.mark.xdist_group("modulo_facturacion")
def test_reporte_facturacion(page):
    """Este test va al mismo worker que la clase TestFacturacion."""
    page.goto("/facturacion/reportes")
    # ...</code></pre>

        <h3>3. Aislamiento de workers: cada uno con su navegador</h3>
        <p>Con Playwright y pytest-xdist, cada worker obtiene su propio contexto de navegador.
        Las fixtures de Playwright manejan esto automaticamente.</p>

        <pre><code class="python"># conftest.py - Configuracion para ejecucion paralela
import pytest
from playwright.sync_api import sync_playwright

@pytest.fixture(scope="session")
def browser_type_launch_args():
    """Cada worker (sesion) configura sus argumentos de lanzamiento."""
    return {
        "headless": True,
        "args": ["--disable-gpu", "--no-sandbox"]
    }

@pytest.fixture(scope="session")
def browser(browser_type_launch_args):
    """Cada worker obtiene su propia instancia de navegador."""
    with sync_playwright() as p:
        browser = p.chromium.launch(**browser_type_launch_args)
        yield browser
        browser.close()

@pytest.fixture
def page(browser):
    """Cada test obtiene un contexto y pagina nuevos (aislamiento total)."""
    context = browser.new_context()
    page = context.new_page()
    yield page
    context.close()</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>Si usas el plugin <code>pytest-playwright</code>, las fixtures <code>browser</code>,
            <code>context</code> y <code>page</code> ya manejan el aislamiento automaticamente.
            No necesitas redefinirlas a menos que requieras configuracion especial por worker.</p>
        </div>

        <h3>4. Consideraciones de scope en fixtures paralelas</h3>
        <p>Cuando ejecutas tests en paralelo, el <code>scope</code> de las fixtures se comporta
        de forma diferente:</p>

        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #0277bd; color: white;">
                <th style="padding: 8px; border: 1px solid #ddd;">Scope</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Sin xdist</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Con xdist</th>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>session</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Una vez para toda la sesion</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Una vez <strong>por worker</strong></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>module</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Una vez por archivo .py</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Una vez por archivo <strong>en ese worker</strong></td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>class</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Una vez por clase</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Una vez por clase <strong>en ese worker</strong></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>function</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Una vez por test</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Una vez por test (sin cambio)</td>
            </tr>
        </table>

        <pre><code class="python"># conftest.py - Fixture session-scoped con xdist
import pytest
import os

@pytest.fixture(scope="session")
def datos_iniciales(tmp_path_factory):
    """
    Con xdist, cada worker ejecuta esto independientemente.
    Usa tmp_path_factory para paths unicos por worker.
    """
    worker_id = os.environ.get("PYTEST_XDIST_WORKER", "master")
    base_tmp = tmp_path_factory.getbasetemp()
    print(f"Worker {worker_id} inicializando datos en {base_tmp}")
    return {"worker": worker_id, "tmp": str(base_tmp)}

@pytest.fixture(scope="session")
def base_url():
    """URL base - igual para todos los workers."""
    return os.environ.get("BASE_URL", "http://localhost:3000")</code></pre>

        <h3>5. Sharding: distribuir tests entre maquinas CI</h3>
        <p>El <strong>sharding</strong> divide el test suite completo en fragmentos (shards) que
        se ejecutan en maquinas CI separadas. Cada maquina ejecuta solo su porcion.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Concepto de sharding</h4>
            <pre><code>Test suite completo: 300 tests
                    |
          +---------+---------+
          |         |         |
     Shard 1/3  Shard 2/3  Shard 3/3
     100 tests  100 tests  100 tests
     Worker A   Worker B   Worker C
     ~10 min    ~10 min    ~10 min

     Total: ~10 min (vs ~30 min secuencial)</code></pre>
        </div>

        <h4>Sharding nativo con pytest</h4>
        <pre><code class="bash"># pytest no tiene sharding nativo, pero hay plugins
pip install pytest-shard

# Ejecutar shard 1 de 3
pytest --shard-id=0 --num-shards=3

# Ejecutar shard 2 de 3
pytest --shard-id=1 --num-shards=3

# Ejecutar shard 3 de 3
pytest --shard-id=2 --num-shards=3</code></pre>

        <h4>Sharding manual con pytest y seleccion de archivos</h4>
        <pre><code class="python"># scripts/shard_tests.py
"""Script para dividir tests en shards por archivos."""
import subprocess
import sys
import math

def obtener_archivos_test():
    """Recolecta todos los archivos de test."""
    result = subprocess.run(
        ["pytest", "--collect-only", "-q"],
        capture_output=True, text=True
    )
    # Extraer archivos unicos
    archivos = set()
    for linea in result.stdout.strip().split("\\n"):
        if "::" in linea:
            archivos.add(linea.split("::")[0])
    return sorted(archivos)

def obtener_shard(shard_id: int, total_shards: int):
    """Retorna los archivos correspondientes a este shard."""
    archivos = obtener_archivos_test()
    tamano = math.ceil(len(archivos) / total_shards)
    inicio = shard_id * tamano
    fin = min(inicio + tamano, len(archivos))
    return archivos[inicio:fin]

if __name__ == "__main__":
    shard_id = int(sys.argv[1])      # 0, 1, 2...
    total_shards = int(sys.argv[2])  # 3
    archivos = obtener_shard(shard_id, total_shards)
    print(f"Shard {shard_id + 1}/{total_shards}: {len(archivos)} archivos")
    for f in archivos:
        print(f"  {f}")
    # Ejecutar pytest solo con estos archivos
    subprocess.run(["pytest"] + archivos + ["-v"])</code></pre>

        <h3>6. Sharding en GitHub Actions con matrix strategy</h3>
        <pre><code class="yaml"># .github/workflows/playwright-tests.yml
name: Playwright Tests (Sharded)

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [0, 1, 2]  # 3 shards

    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - name: Instalar dependencias
        run: |
          pip install playwright pytest pytest-playwright pytest-shard
          playwright install chromium --with-deps

      - name: Ejecutar tests (Shard \${{ matrix.shard }})
        run: |
          pytest tests/ \\
            --shard-id=\${{ matrix.shard }} \\
            --num-shards=3 \\
            -v \\
            --junitxml=results/shard-\${{ matrix.shard }}.xml

      - name: Subir resultados
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results-shard-\${{ matrix.shard }}
          path: results/

  merge-results:
    needs: test
    runs-on: ubuntu-latest
    if: always()
    steps:
      - name: Descargar todos los resultados
        uses: actions/download-artifact@v4
        with:
          path: all-results/
          pattern: test-results-shard-*
          merge-multiple: true

      - name: Resumen de resultados
        run: |
          echo "## Resultados por Shard" >> \$GITHUB_STEP_SUMMARY
          for f in all-results/*.xml; do
            echo "- \$(basename \$f)" >> \$GITHUB_STEP_SUMMARY
          done</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>Usa <code>fail-fast: false</code> en la matrix para que si un shard falla, los demas
            sigan ejecutandose. Asi obtienes el reporte completo de todos los fallos en una sola
            ejecucion, sin tener que re-ejecutar el pipeline varias veces.</p>
        </div>

        <h3>7. Sharding en Jenkins con parallel stages</h3>
        <pre><code class="groovy">// Jenkinsfile
pipeline {
    agent none

    stages {
        stage('Test Playwright - Sharded') {
            parallel {
                stage('Shard 1/3') {
                    agent { docker { image 'mcr.microsoft.com/playwright/python:v1.49.0' } }
                    steps {
                        sh '''
                            pip install pytest pytest-playwright pytest-shard
                            pytest tests/ --shard-id=0 --num-shards=3 \\
                                --junitxml=results/shard-0.xml -v
                        '''
                    }
                    post {
                        always {
                            junit 'results/shard-0.xml'
                            archiveArtifacts artifacts: 'results/**'
                        }
                    }
                }
                stage('Shard 2/3') {
                    agent { docker { image 'mcr.microsoft.com/playwright/python:v1.49.0' } }
                    steps {
                        sh '''
                            pip install pytest pytest-playwright pytest-shard
                            pytest tests/ --shard-id=1 --num-shards=3 \\
                                --junitxml=results/shard-1.xml -v
                        '''
                    }
                    post {
                        always {
                            junit 'results/shard-1.xml'
                            archiveArtifacts artifacts: 'results/**'
                        }
                    }
                }
                stage('Shard 3/3') {
                    agent { docker { image 'mcr.microsoft.com/playwright/python:v1.49.0' } }
                    steps {
                        sh '''
                            pip install pytest pytest-playwright pytest-shard
                            pytest tests/ --shard-id=2 --num-shards=3 \\
                                --junitxml=results/shard-2.xml -v
                        '''
                    }
                    post {
                        always {
                            junit 'results/shard-2.xml'
                            archiveArtifacts artifacts: 'results/**'
                        }
                    }
                }
            }
        }
    }
}</code></pre>

        <h3>8. Combinando sharding + xdist para maximo paralelismo</h3>
        <p>La combinacion mas poderosa: cada maquina CI ejecuta un shard, y dentro de cada
        maquina se usan multiples workers con xdist.</p>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Arquitectura sharding + xdist</h4>
            <pre><code>300 tests totales
        |
   +---------+---------+---------+
   |         |         |         |
 Shard 1   Shard 2   Shard 3    (3 maquinas CI)
 100 tests 100 tests 100 tests
   |         |         |
 xdist -n4  xdist -n4  xdist -n4 (4 workers/maquina)
 ~2.5 min   ~2.5 min   ~2.5 min

 Total: ~2.5 min (vs ~30 min secuencial = 12x mas rapido)</code></pre>
        </div>

        <pre><code class="yaml"># .github/workflows/playwright-parallel-sharded.yml
name: Playwright - Sharding + xdist

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [0, 1, 2]

    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - name: Instalar dependencias
        run: |
          pip install playwright pytest pytest-playwright pytest-xdist pytest-shard
          playwright install chromium --with-deps

      - name: Ejecutar tests (Shard \${{ matrix.shard }} + xdist)
        run: |
          pytest tests/ \\
            --shard-id=\${{ matrix.shard }} \\
            --num-shards=3 \\
            -n 4 \\
            --dist loadscope \\
            -v \\
            --junitxml=results/shard-\${{ matrix.shard }}.xml

      - name: Subir resultados
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: results-shard-\${{ matrix.shard }}
          path: results/</code></pre>

        <h3>9. Estrategias de agrupacion de tests</h3>
        <p>Elegir como agrupar los tests impacta directamente en la eficiencia del paralelismo:</p>

        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #0277bd; color: white;">
                <th style="padding: 8px; border: 1px solid #ddd;">Estrategia</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Comando</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Cuando usar</th>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">Por archivo</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>--dist loadfile</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Tests del mismo archivo comparten datos de setup</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;">Por clase</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>--dist loadscope</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Fixtures <code>class</code>-scoped costosas</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">Por marca</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>--dist loadgroup</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Tests que acceden al mismo recurso compartido</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;">Balanceo dinamico</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>--dist load</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Tests independientes sin estado compartido</td>
            </tr>
        </table>

        <pre><code class="python"># Ejemplo: agrupar por marca para evitar conflictos
import pytest

# Tests que modifican la tabla "usuarios" - van al mismo worker
@pytest.mark.xdist_group("db_usuarios")
def test_crear_usuario(page):
    page.goto("/admin/usuarios/nuevo")
    page.get_by_label("Nombre").fill("Test User")
    page.get_by_role("button", name="Crear").click()

@pytest.mark.xdist_group("db_usuarios")
def test_editar_usuario(page):
    page.goto("/admin/usuarios/1/editar")
    page.get_by_label("Nombre").fill("Updated User")
    page.get_by_role("button", name="Guardar").click()

# Tests de solo lectura - pueden ir a cualquier worker
def test_listar_productos(page):
    page.goto("/productos")
    expect(page.get_by_role("table")).to_be_visible()

def test_ver_dashboard(page):
    page.goto("/dashboard")
    expect(page.get_by_role("heading", name="Dashboard")).to_be_visible()</code></pre>

        <h3>10. Manejo de recursos compartidos</h3>
        <p>El principal desafio del paralelismo es evitar conflictos cuando multiples tests
        acceden a los mismos recursos (base de datos, archivos, APIs).</p>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Problemas comunes en paralelo</h4>
            <ul>
                <li><strong>Conflictos de base de datos:</strong> Dos tests crean el mismo usuario</li>
                <li><strong>Puertos ocupados:</strong> Dos workers intentan levantar servidor en el mismo puerto</li>
                <li><strong>Archivos temporales:</strong> Dos tests escriben al mismo archivo</li>
                <li><strong>Estado global:</strong> Un test modifica configuracion que otro test espera intacta</li>
            </ul>
        </div>

        <pre><code class="python"># conftest.py - Estrategias para manejar recursos compartidos
import pytest
import os

@pytest.fixture(scope="session")
def worker_id(request):
    """Obtener el ID del worker de xdist."""
    if hasattr(request.config, "workerinput"):
        return request.config.workerinput["workerid"]  # gw0, gw1, gw2...
    return "master"

@pytest.fixture(scope="session")
def base_url(worker_id):
    """Cada worker usa un puerto diferente del servidor de testing."""
    puertos = {"master": 3000, "gw0": 3001, "gw1": 3002, "gw2": 3003, "gw3": 3004}
    puerto = puertos.get(worker_id, 3000 + hash(worker_id) % 100)
    return f"http://localhost:{puerto}"

@pytest.fixture
def usuario_unico(worker_id):
    """Generar datos de test unicos por worker para evitar conflictos."""
    import uuid
    sufijo = uuid.uuid4().hex[:8]
    return {
        "nombre": f"test_user_{worker_id}_{sufijo}",
        "email": f"test_{worker_id}_{sufijo}@test.com",
        "password": "Test1234!"
    }

@pytest.fixture(scope="session")
def db_schema(worker_id):
    """Cada worker usa un schema de BD diferente."""
    schema = f"test_{worker_id}"
    # Crear schema aislado
    # ejecutar_sql(f"CREATE SCHEMA IF NOT EXISTS {schema}")
    yield schema
    # Limpiar schema
    # ejecutar_sql(f"DROP SCHEMA {schema} CASCADE")</code></pre>

        <pre><code class="python"># Uso de file locks para recursos que no se pueden duplicar
import filelock
import pytest

@pytest.fixture(scope="session")
def recurso_compartido(tmp_path_factory):
    """
    Usar file lock cuando multiples workers necesitan
    inicializar el mismo recurso una sola vez.
    """
    root_tmp = tmp_path_factory.getbasetemp().parent
    lock_file = root_tmp / "recurso.lock"
    data_file = root_tmp / "datos_compartidos.json"

    with filelock.FileLock(str(lock_file)):
        if not data_file.exists():
            # Solo el primer worker que llegue aqui inicializa
            import json
            datos = {"inicializado": True, "registros": 100}
            data_file.write_text(json.dumps(datos))

    import json
    return json.loads(data_file.read_text())</code></pre>

        <h3>11. Benchmarks: serial vs paralelo vs sharded</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Resultados tipicos con 200 tests de Playwright</h4>
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #7b1fa2; color: white;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Configuracion</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Tiempo</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Speedup</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Costo CI</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Serial (<code>pytest</code>)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">~40 min</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">1x</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">1 maquina</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">xdist 4 workers (<code>-n 4</code>)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">~11 min</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">3.6x</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">1 maquina</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">3 shards</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">~14 min</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">2.9x</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">3 maquinas</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">3 shards + xdist -n 4</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">~3.5 min</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">11.4x</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">3 maquinas</td>
                </tr>
            </table>
            <p style="margin-top: 10px;"><strong>Nota:</strong> Los speedups reales dependen del tipo de test,
            la duracion individual de cada test y los recursos de la maquina. Tests I/O-bound
            (navegador) se benefician mas que tests CPU-bound.</p>
        </div>

        <pre><code class="python"># scripts/benchmark_parallelism.py
"""
Compara tiempos de ejecucion con diferentes niveles de paralelismo.
Ejecutar: python scripts/benchmark_parallelism.py
"""
import subprocess
import time

configuraciones = [
    ("Serial", ["pytest", "tests/", "-v"]),
    ("2 workers", ["pytest", "tests/", "-n", "2", "-v"]),
    ("4 workers", ["pytest", "tests/", "-n", "4", "-v"]),
    ("auto workers", ["pytest", "tests/", "-n", "auto", "-v"]),
]

resultados = []
for nombre, cmd in configuraciones:
    print(f"\\n{'='*50}")
    print(f"Ejecutando: {nombre}")
    print(f"Comando: {' '.join(cmd)}")
    print(f"{'='*50}")

    inicio = time.time()
    resultado = subprocess.run(cmd, capture_output=True, text=True)
    duracion = time.time() - inicio

    exito = resultado.returncode == 0
    resultados.append((nombre, duracion, exito))
    print(f"Tiempo: {duracion:.1f}s - {'PASS' if exito else 'FAIL'}")

print(f"\\n{'='*50}")
print("RESUMEN DE BENCHMARKS")
print(f"{'='*50}")
base_time = resultados[0][1]
for nombre, duracion, exito in resultados:
    speedup = base_time / duracion if duracion > 0 else 0
    print(f"{nombre:20s} | {duracion:7.1f}s | {speedup:5.1f}x | {'PASS' if exito else 'FAIL'}")</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>Ejecuta el benchmark periodicamente para detectar degradacion de rendimiento.
            Si el speedup con 4 workers baja de 3x a 2x, probablemente hay tests que estan
            creando dependencias ocultas entre si o fixtures con scope inadecuado.</p>
        </div>

        <h3>12. Ejercicio practico</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Reto: Configura ejecucion paralela y sharding</h4>
            <p>Crea un proyecto de tests que se ejecute en paralelo con xdist y se pueda
            distribuir en shards para CI.</p>
        </div>

        <pre><code class="python"># Paso 1: Estructura del proyecto
# tests/
#   conftest.py
#   test_modulo_a.py
#   test_modulo_b.py
#   test_modulo_c.py

# Paso 2: conftest.py con soporte para paralelismo
# tests/conftest.py
import pytest
import os
import uuid

@pytest.fixture(scope="session")
def worker_id(request):
    """ID del worker de xdist (o 'master' si no se usa xdist)."""
    if hasattr(request.config, "workerinput"):
        return request.config.workerinput["workerid"]
    return "master"

@pytest.fixture
def datos_test(worker_id):
    """Datos unicos por test para evitar conflictos."""
    uid = uuid.uuid4().hex[:6]
    return {
        "email": f"user_{worker_id}_{uid}@test.com",
        "nombre": f"Test User {uid}"
    }

# Paso 3: Tests independientes
# tests/test_modulo_a.py
from playwright.sync_api import Page, expect

def test_pagina_inicio(page: Page):
    page.goto("https://demo.playwright.dev/todomvc/")
    expect(page.get_by_role("heading", name="todos")).to_be_visible()

def test_agregar_tarea(page: Page):
    page.goto("https://demo.playwright.dev/todomvc/")
    page.get_by_placeholder("What needs to be done?").fill("Tarea de prueba")
    page.get_by_placeholder("What needs to be done?").press("Enter")
    expect(page.get_by_test_id("todo-title")).to_have_text("Tarea de prueba")

def test_completar_tarea(page: Page):
    page.goto("https://demo.playwright.dev/todomvc/")
    page.get_by_placeholder("What needs to be done?").fill("Tarea completa")
    page.get_by_placeholder("What needs to be done?").press("Enter")
    page.get_by_role("checkbox").first.check()
    expect(page.get_by_test_id("todo-item")).to_have_class(/completed/)

# Paso 4: Ejecutar en paralelo
# pytest tests/ -n 4 -v --dist loadscope

# Paso 5: Ejecutar como shard
# pytest tests/ --shard-id=0 --num-shards=3 -n 2 -v

# Paso 6: Makefile para simplificar
# --- Contenido sugerido para Makefile ---
# test:
#     pytest tests/ -v
#
# test-parallel:
#     pytest tests/ -n 4 -v --dist loadscope
#
# test-shard:
#     pytest tests/ --shard-id=$(SHARD) --num-shards=$(TOTAL) -n 2 -v
#
# benchmark:
#     python scripts/benchmark_parallelism.py</code></pre>

        <pre><code class="yaml"># Paso 7: GitHub Actions con sharding + xdist
# .github/workflows/test.yml
name: Tests Sharded

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [0, 1, 2]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: |
          pip install playwright pytest pytest-playwright pytest-xdist pytest-shard
          playwright install chromium --with-deps
      - run: |
          pytest tests/ \\
            --shard-id=\${{ matrix.shard }} \\
            --num-shards=3 \\
            -n 2 \\
            --dist loadscope \\
            -v</code></pre>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Objetivos de esta leccion</h4>
            <ul>
                <li>Instalar y usar <code>pytest-xdist</code> para ejecutar tests en paralelo con <code>-n auto</code> o <code>-n N</code></li>
                <li>Entender las estrategias de distribucion: <code>load</code>, <code>loadscope</code>, <code>loadfile</code>, <code>loadgroup</code></li>
                <li>Comprender el aislamiento de workers: cada uno tiene su propia instancia de navegador</li>
                <li>Implementar sharding para dividir tests entre multiples maquinas CI</li>
                <li>Configurar sharding en GitHub Actions (matrix strategy) y Jenkins (parallel stages)</li>
                <li>Combinar sharding + xdist para maximo paralelismo (hasta 12x de speedup)</li>
                <li>Manejar recursos compartidos con datos unicos por worker y file locks</li>
                <li>Elegir la estrategia de agrupacion optima segun el tipo de tests</li>
            </ul>
        </div>

        <h3>Siguiente: Retry y manejo de flaky tests</h3>
        <p>En la siguiente leccion aprenderemos a configurar reintentos automaticos para tests
        inestables y estrategias para detectar, clasificar y eliminar flaky tests.</p>
    `,
    topics: ["paralelo", "sharding", "ejecución"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_113 = LESSON_113;
}
