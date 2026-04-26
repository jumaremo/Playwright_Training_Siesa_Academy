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

        <div class="code-tabs" data-code-id="L113-1">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># Usar xdist_group para agrupar tests relacionados
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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// Agrupar tests relacionados con test.describe
// En Playwright TS, los tests de un mismo archivo se ejecutan en el mismo worker
// por defecto con fullyParallel: false. Para agrupacion explicita, usa archivos separados.
import { test, expect } from '@playwright/test';

// tests/facturacion.spec.ts
// Todos los tests en este describe corren en el mismo worker
test.describe('Modulo Facturacion', () => {
    test('crear factura', async ({ page }) => {
        await page.goto('/facturacion/nueva');
        // ...
    });

    test('anular factura', async ({ page }) => {
        await page.goto('/facturacion/anular');
        // ...
    });

    test('reporte facturacion', async ({ page }) => {
        // Este test va al mismo worker que los anteriores del describe
        await page.goto('/facturacion/reportes');
        // ...
    });
});</code></pre>
</div>
</div>

        <h3>3. Aislamiento de workers: cada uno con su navegador</h3>
        <p>Con Playwright y pytest-xdist, cada worker obtiene su propio contexto de navegador.
        Las fixtures de Playwright manejan esto automaticamente.</p>

        <div class="code-tabs" data-code-id="L113-2">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># conftest.py - Configuracion para ejecucion paralela
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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// playwright.config.ts - Configuracion para ejecucion paralela
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    // Cada worker obtiene su propia instancia de navegador automaticamente
    // Playwright aisla cada test con un BrowserContext independiente
    fullyParallel: true,
    workers: 4, // Numero de workers paralelos

    use: {
        headless: true,
        // Argumentos de lanzamiento del navegador
        launchOptions: {
            args: ['--disable-gpu', '--no-sandbox'],
        },
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});

// En Playwright TS, NO necesitas configurar fixtures de browser/page manualmente.
// Cada test recibe automaticamente un \`page\` con un BrowserContext nuevo
// (aislamiento total). Ejemplo:
//
// test('mi test', async ({ page }) => {
//     // \`page\` ya esta aislada en su propio BrowserContext
//     await page.goto('/mi-pagina');
// });</code></pre>
</div>
</div>

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

        <div class="code-tabs" data-code-id="L113-3">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># conftest.py - Fixture session-scoped con xdist
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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// playwright.config.ts - Configuracion equivalente a session-scoped fixtures
import { defineConfig } from '@playwright/test';
import * as os from 'os';
import * as path from 'path';

export default defineConfig({
    fullyParallel: true,
    workers: 4,

    // URL base - igual para todos los workers
    use: {
        baseURL: process.env.BASE_URL || 'http://localhost:3000',
    },
});

// Para datos iniciales por worker, usa test.beforeAll en un fixture global
// global-setup.ts
import { test as base } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Cada worker ejecuta beforeAll independientemente
// Playwright asigna un workerIndex unico a cada worker
export const test = base.extend<{}, { datosIniciales: { worker: string; tmp: string } }>({
    datosIniciales: [async ({}, use, workerInfo) => {
        const workerId = \`worker-\${workerInfo.workerIndex}\`;
        const baseTmp = path.join(os.tmpdir(), \`pw-test-\${workerId}\`);
        fs.mkdirSync(baseTmp, { recursive: true });
        console.log(\`Worker \${workerId} inicializando datos en \${baseTmp}\`);
        await use({ worker: workerId, tmp: baseTmp });
    }, { scope: 'worker' }],
});</code></pre>
</div>
</div>

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
        <div class="code-tabs" data-code-id="L113-4">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># scripts/shard_tests.py
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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// En Playwright TS, el sharding es BUILT-IN. No necesitas scripts manuales.
// Simplemente usa el flag --shard al ejecutar:
//
//   npx playwright test --shard=1/3
//   npx playwright test --shard=2/3
//   npx playwright test --shard=3/3
//
// Playwright distribuye automaticamente los archivos de test entre shards.

// Si aun asi necesitas un script personalizado para listar shards:
// scripts/shard-tests.ts
import { execSync } from 'child_process';

function obtenerArchivosTest(): string[] {
    // Listar tests disponibles sin ejecutarlos
    const result = execSync('npx playwright test --list', { encoding: 'utf-8' });
    const archivos = new Set&lt;string&gt;();
    for (const linea of result.trim().split('\\n')) {
        // Formato: "  archivo.spec.ts:linea:columna > describe > test"
        const match = linea.match(/\\s+(.+\\.spec\\.ts)/);
        if (match) archivos.add(match[1]);
    }
    return [...archivos].sort();
}

function obtenerShard(shardId: number, totalShards: number): string[] {
    const archivos = obtenerArchivosTest();
    const tamano = Math.ceil(archivos.length / totalShards);
    const inicio = shardId * tamano;
    const fin = Math.min(inicio + tamano, archivos.length);
    return archivos.slice(inicio, fin);
}

// Uso: npx ts-node scripts/shard-tests.ts 0 3
const shardId = parseInt(process.argv[2]);    // 0, 1, 2...
const totalShards = parseInt(process.argv[3]); // 3
const archivos = obtenerShard(shardId, totalShards);
console.log(\`Shard \${shardId + 1}/\${totalShards}: \${archivos.length} archivos\`);
archivos.forEach(f => console.log(\`  \${f}\`));
// Ejecutar Playwright solo con estos archivos
execSync(\`npx playwright test \${archivos.join(' ')} --reporter=list\`, { stdio: 'inherit' });</code></pre>
</div>
</div>

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

        <div class="code-tabs" data-code-id="L113-5">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># Ejemplo: agrupar por marca para evitar conflictos
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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// Ejemplo: agrupar tests por archivo para evitar conflictos
// En Playwright TS, con fullyParallel: false, los tests de un mismo archivo
// corren secuencialmente en el mismo worker (equivalente a xdist_group)
import { test, expect } from '@playwright/test';

// tests/db-usuarios.spec.ts
// Tests que modifican la tabla "usuarios" - van en el mismo archivo/worker
test.describe.serial('DB Usuarios', () => {
    test('crear usuario', async ({ page }) => {
        await page.goto('/admin/usuarios/nuevo');
        await page.getByLabel('Nombre').fill('Test User');
        await page.getByRole('button', { name: 'Crear' }).click();
    });

    test('editar usuario', async ({ page }) => {
        await page.goto('/admin/usuarios/1/editar');
        await page.getByLabel('Nombre').fill('Updated User');
        await page.getByRole('button', { name: 'Guardar' }).click();
    });
});

// tests/lectura.spec.ts (archivo separado)
// Tests de solo lectura - pueden ir a cualquier worker
test('listar productos', async ({ page }) => {
    await page.goto('/productos');
    await expect(page.getByRole('table')).toBeVisible();
});

test('ver dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});</code></pre>
</div>
</div>

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

        <div class="code-tabs" data-code-id="L113-6">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># conftest.py - Estrategias para manejar recursos compartidos
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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// fixtures.ts - Estrategias para manejar recursos compartidos
import { test as base, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

// Interfaz para datos de usuario unico
interface UsuarioUnico {
    nombre: string;
    email: string;
    password: string;
}

// Fixture personalizada con datos aislados por worker
export const test = base.extend&lt;{
    usuarioUnico: UsuarioUnico;
}, {
    baseURL: string;
    dbSchema: string;
}&gt;({
    // Cada worker usa un puerto diferente del servidor de testing
    baseURL: [async ({}, use, workerInfo) => {
        const puerto = 3000 + workerInfo.workerIndex;
        await use(\`http://localhost:\${puerto}\`);
    }, { scope: 'worker' }],

    // Generar datos de test unicos por test para evitar conflictos
    usuarioUnico: async ({}, use, workerInfo) => {
        const workerId = \`worker-\${workerInfo.workerIndex}\`;
        const sufijo = randomUUID().slice(0, 8);
        await use({
            nombre: \`test_user_\${workerId}_\${sufijo}\`,
            email: \`test_\${workerId}_\${sufijo}@test.com\`,
            password: 'Test1234!',
        });
    },

    // Cada worker usa un schema de BD diferente
    dbSchema: [async ({}, use, workerInfo) => {
        const schema = \`test_worker_\${workerInfo.workerIndex}\`;
        // Crear schema aislado
        // await ejecutarSql(\`CREATE SCHEMA IF NOT EXISTS \${schema}\`);
        await use(schema);
        // Limpiar schema
        // await ejecutarSql(\`DROP SCHEMA \${schema} CASCADE\`);
    }, { scope: 'worker' }],
});</code></pre>
</div>
</div>

        <div class="code-tabs" data-code-id="L113-7">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># Uso de file locks para recursos que no se pueden duplicar
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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// Uso de global-setup para recursos que no se pueden duplicar
// En Playwright TS, global-setup.ts se ejecuta UNA SOLA VEZ antes de todos los workers
import * as fs from 'fs';
import * as path from 'path';

// global-setup.ts - Se ejecuta una vez antes de todos los tests
async function globalSetup() {
    const dataFile = path.join(__dirname, 'datos_compartidos.json');

    if (!fs.existsSync(dataFile)) {
        // Solo se ejecuta una vez (global-setup es single-threaded)
        const datos = { inicializado: true, registros: 100 };
        fs.writeFileSync(dataFile, JSON.stringify(datos));
        console.log('Recurso compartido inicializado');
    }
}
export default globalSetup;

// global-teardown.ts - Se ejecuta una vez al final
async function globalTeardown() {
    const dataFile = path.join(__dirname, 'datos_compartidos.json');
    if (fs.existsSync(dataFile)) {
        fs.unlinkSync(dataFile);
    }
}
export default globalTeardown;

// playwright.config.ts - Registrar global setup/teardown
// import { defineConfig } from '@playwright/test';
// export default defineConfig({
//     globalSetup: './global-setup.ts',
//     globalTeardown: './global-teardown.ts',
//     workers: 4,
// });

// Leer el recurso compartido en cualquier test:
// import * as fs from 'fs';
// const datos = JSON.parse(fs.readFileSync('datos_compartidos.json', 'utf-8'));</code></pre>
</div>
</div>

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

        <div class="code-tabs" data-code-id="L113-8">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># scripts/benchmark_parallelism.py
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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// scripts/benchmark-parallelism.ts
// Compara tiempos de ejecucion con diferentes niveles de paralelismo.
// Ejecutar: npx ts-node scripts/benchmark-parallelism.ts
import { execSync } from 'child_process';

interface Configuracion {
    nombre: string;
    cmd: string;
}

const configuraciones: Configuracion[] = [
    { nombre: 'Serial (1 worker)', cmd: 'npx playwright test --workers=1' },
    { nombre: '2 workers', cmd: 'npx playwright test --workers=2' },
    { nombre: '4 workers', cmd: 'npx playwright test --workers=4' },
    { nombre: 'auto workers', cmd: 'npx playwright test' }, // auto por defecto
];

interface Resultado {
    nombre: string;
    duracion: number;
    exito: boolean;
}

const resultados: Resultado[] = [];

for (const { nombre, cmd } of configuraciones) {
    console.log(\`\\n\${'='.repeat(50)}\`);
    console.log(\`Ejecutando: \${nombre}\`);
    console.log(\`Comando: \${cmd}\`);
    console.log('='.repeat(50));

    const inicio = Date.now();
    let exito = true;
    try {
        execSync(cmd, { stdio: 'pipe' });
    } catch {
        exito = false;
    }
    const duracion = (Date.now() - inicio) / 1000;

    resultados.push({ nombre, duracion, exito });
    console.log(\`Tiempo: \${duracion.toFixed(1)}s - \${exito ? 'PASS' : 'FAIL'}\`);
}

console.log(\`\\n\${'='.repeat(50)}\`);
console.log('RESUMEN DE BENCHMARKS');
console.log('='.repeat(50));
const baseTime = resultados[0].duracion;
for (const { nombre, duracion, exito } of resultados) {
    const speedup = duracion > 0 ? baseTime / duracion : 0;
    console.log(
        \`\${nombre.padEnd(20)} | \${duracion.toFixed(1).padStart(7)}s | \${speedup.toFixed(1).padStart(5)}x | \${exito ? 'PASS' : 'FAIL'}\`
    );
}</code></pre>
</div>
</div>

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

        <div class="code-tabs" data-code-id="L113-9">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># Paso 1: Estructura del proyecto
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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// Paso 1: Estructura del proyecto
// tests/
//   modulo-a.spec.ts
//   modulo-b.spec.ts
//   modulo-c.spec.ts
// playwright.config.ts
// package.json

// Paso 2: playwright.config.ts con soporte para paralelismo
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,  // Paralelismo a nivel de test (no solo archivo)
    workers: 4,           // Numero de workers paralelos
    retries: 1,
    reporter: [['list'], ['html']],
    use: {
        baseURL: 'https://demo.playwright.dev/todomvc/',
        trace: 'on-first-retry',
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ],
});

// Paso 3: Tests independientes
// tests/modulo-a.spec.ts
import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

// Fixture de datos unicos por test (evita conflictos entre workers)
test.beforeEach(async ({}, testInfo) => {
    const uid = randomUUID().slice(0, 6);
    // Datos disponibles via testInfo.annotations o variables locales
    console.log(\`Worker \${testInfo.workerIndex} - Test: \${testInfo.title}\`);
});

test('pagina inicio', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'todos' })).toBeVisible();
});

test('agregar tarea', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('What needs to be done?').fill('Tarea de prueba');
    await page.getByPlaceholder('What needs to be done?').press('Enter');
    await expect(page.getByTestId('todo-title')).toHaveText('Tarea de prueba');
});

test('completar tarea', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('What needs to be done?').fill('Tarea completa');
    await page.getByPlaceholder('What needs to be done?').press('Enter');
    await page.getByRole('checkbox').first().check();
    await expect(page.getByTestId('todo-item')).toHaveClass(/completed/);
});

// Paso 4: Ejecutar en paralelo (built-in, usa config o CLI)
// npx playwright test --workers=4

// Paso 5: Ejecutar como shard (built-in, sin plugins!)
// npx playwright test --shard=1/3 --workers=2

// Paso 6: Scripts en package.json para simplificar
// {
//   "scripts": {
//     "test": "npx playwright test",
//     "test:parallel": "npx playwright test --workers=4",
//     "test:shard": "npx playwright test --shard=$SHARD/$TOTAL --workers=2",
//     "test:benchmark": "npx ts-node scripts/benchmark-parallelism.ts"
//   }
// }</code></pre>
</div>
</div>

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
