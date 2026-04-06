/**
 * Playwright Academy - Leccion 110
 * Playwright en Docker
 * Seccion 17: CI/CD Integration
 */

const LESSON_110 = {
    id: 110,
    title: "Playwright en Docker",
    duration: "10 min",
    level: "advanced",
    section: "section-17",
    content: `
        <h2>🐳 Playwright en Docker</h2>
        <p>Docker es la herramienta estándar para empaquetar y ejecutar tests de Playwright en
        entornos reproducibles. En esta lección aprenderás a construir imágenes Docker optimizadas
        para tus tests, usar Docker Compose para orquestar entornos completos y aplicar
        las mejores prácticas para CI/CD con contenedores.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎯 Objetivos de aprendizaje</h4>
            <ul>
                <li>Entender por qué Docker es esencial para testing con Playwright</li>
                <li>Usar las imágenes oficiales de Playwright para Python</li>
                <li>Crear Dockerfiles optimizados para tests</li>
                <li>Orquestar entornos con Docker Compose</li>
                <li>Montar volúmenes para resultados, screenshots y traces</li>
                <li>Aplicar multi-stage builds y optimización de capas</li>
            </ul>
        </div>

        <h3>🤔 ¿Por qué Docker para Playwright?</h3>
        <p>Uno de los problemas más comunes en equipos de QA es la frase: <em>"En mi máquina funciona"</em>.
        Docker elimina esta incertidumbre por completo al encapsular el entorno de ejecución.</p>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Ventajas de Docker para testing</h4>
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #c8e6c9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Ventaja</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripcion</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Reproducibilidad</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Mismo SO, mismas dependencias, mismos navegadores en todos los entornos</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Aislamiento</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Los tests no afectan ni dependen del sistema host</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>CI/CD nativo</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">GitHub Actions, Jenkins, GitLab CI ejecutan contenedores de forma nativa</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Escalabilidad</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Lanzar N contenedores en paralelo para ejecucion distribuida</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Sin instalacion local</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">No necesitas instalar navegadores ni dependencias en cada maquina</td>
                </tr>
            </table>
        </div>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>❌ Sin Docker: problemas comunes</h4>
            <ul>
                <li><strong>Versiones diferentes de navegador</strong> entre desarrolladores y CI</li>
                <li><strong>Dependencias del SO</strong> faltantes (librerías de Chromium en Linux)</li>
                <li><strong>Configuraciones divergentes</strong> de Python, pip o entorno virtual</li>
                <li><strong>Tests que pasan localmente</strong> pero fallan en CI (o viceversa)</li>
            </ul>
        </div>

        <h3>📦 Imágenes oficiales de Playwright</h3>
        <p>Microsoft mantiene imágenes Docker oficiales con todos los navegadores y dependencias
        del sistema operativo preinstalados. Esta es la forma recomendada de ejecutar Playwright.</p>

        <pre><code class="bash"># Imagen oficial de Playwright para Python
# Formato: mcr.microsoft.com/playwright/python:v{version}
# Ejemplo con Playwright 1.49:
docker pull mcr.microsoft.com/playwright/python:v1.49.0-noble-amd64

# Variantes disponibles:
# - noble (Ubuntu 24.04 LTS) - recomendada
# - jammy (Ubuntu 22.04 LTS) - soporte extendido

# Para ver las tags disponibles:
# https://mcr.microsoft.com/en-us/artifact/mar/playwright/python/tags</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>Siempre fija una version especifica de la imagen (ej. <code>v1.49.0-noble-amd64</code>)
            en lugar de <code>latest</code>. Esto garantiza que tus tests usen exactamente la misma version
            de navegadores en desarrollo y en CI. En SIESA, mantenemos la version de la imagen
            alineada con la version de <code>playwright</code> en <code>requirements.txt</code>.</p>
        </div>

        <pre><code class="bash"># Verificar que contiene en la imagen oficial:
docker run --rm mcr.microsoft.com/playwright/python:v1.49.0-noble-amd64 \\
    python -c "
import subprocess
print('=== Python ===')
subprocess.run(['python', '--version'])
print('=== Playwright ===')
subprocess.run(['python', '-m', 'playwright', '--version'])
print('=== Navegadores instalados ===')
subprocess.run(['python', '-m', 'playwright', 'install', '--dry-run'])
"

# La imagen ya incluye:
# - Python 3.x
# - Playwright para Python (version correspondiente al tag)
# - Chromium, Firefox y WebKit preinstalados
# - Todas las dependencias del SO (libnss3, libatk, fonts, etc.)</code></pre>

        <h3>🏗️ Dockerfile para tests de Playwright</h3>
        <p>Aunque la imagen oficial ya tiene todo, normalmente necesitas agregar tu propio codigo
        de tests y dependencias adicionales.</p>

        <h4>Dockerfile basico</h4>
        <pre><code class="dockerfile"># Dockerfile
# Usar la imagen oficial de Playwright para Python
FROM mcr.microsoft.com/playwright/python:v1.49.0-noble-amd64

# Establecer directorio de trabajo
WORKDIR /app

# Copiar requirements primero (para cache de capas Docker)
COPY requirements.txt .

# Instalar dependencias adicionales de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el codigo de tests
COPY . .

# Comando por defecto: ejecutar todos los tests
CMD ["pytest", "tests/", "-v", "--tb=short"]</code></pre>

        <h4>requirements.txt correspondiente</h4>
        <pre><code class="text"># requirements.txt
playwright==1.49.0
pytest==8.3.4
pytest-playwright==0.5.2
pytest-html==4.1.1
python-dotenv==1.0.1</code></pre>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📋 Estructura de proyecto recomendada</h4>
            <pre><code class="text">mi-proyecto-tests/
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── conftest.py
├── pytest.ini
├── pages/
│   ├── __init__.py
│   ├── login_page.py
│   └── dashboard_page.py
├── tests/
│   ├── __init__.py
│   ├── test_login.py
│   └── test_dashboard.py
└── test-results/          # Se crea al ejecutar (volume mount)
    ├── screenshots/
    ├── traces/
    └── reports/</code></pre>
        </div>

        <h3>🔨 Construir y ejecutar</h3>
        <pre><code class="bash"># Construir la imagen
docker build -t mis-tests-playwright .

# Ejecutar los tests
docker run --rm mis-tests-playwright

# Ejecutar un archivo de test especifico
docker run --rm mis-tests-playwright pytest tests/test_login.py -v

# Ejecutar con un marcador especifico
docker run --rm mis-tests-playwright pytest -m "smoke" -v

# Ejecutar con mas detalle (output verbose)
docker run --rm mis-tests-playwright pytest tests/ -v --tb=long</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>Usa <code>--rm</code> para eliminar automaticamente el contenedor al terminar. Esto evita
            acumular contenedores detenidos que consumen espacio en disco, algo critico en
            servidores de CI con espacio limitado.</p>
        </div>

        <h3>📂 Volumenes: extraer resultados del contenedor</h3>
        <p>Los tests generan artefactos valiosos: screenshots de fallos, traces de Playwright,
        reportes HTML. Para extraerlos del contenedor, usamos <strong>volume mounts</strong>.</p>

        <pre><code class="bash"># Montar directorio local para resultados
docker run --rm \\
    -v "$(pwd)/test-results:/app/test-results" \\
    mis-tests-playwright \\
    pytest tests/ -v \\
        --screenshot=on \\
        --output=/app/test-results

# Montar multiples volumenes
docker run --rm \\
    -v "$(pwd)/test-results:/app/test-results" \\
    -v "$(pwd)/reports:/app/reports" \\
    mis-tests-playwright \\
    pytest tests/ -v \\
        --screenshot=on \\
        --output=/app/test-results \\
        --html=/app/reports/report.html --self-contained-html</code></pre>

        <h4>conftest.py para captura automatica de artefactos</h4>
        <pre><code class="python"># conftest.py
import pytest
from pathlib import Path
from playwright.sync_api import Page

RESULTS_DIR = Path("/app/test-results")

@pytest.fixture(autouse=True)
def capturar_en_fallo(page: Page, request):
    """Captura screenshot y trace automaticamente cuando un test falla."""
    # Iniciar trace antes de cada test
    page.context.tracing.start(screenshots=True, snapshots=True, sources=True)

    yield  # Aqui se ejecuta el test

    # Despues del test: verificar si fallo
    if request.node.rep_call and request.node.rep_call.failed:
        test_name = request.node.name
        screenshots_dir = RESULTS_DIR / "screenshots"
        traces_dir = RESULTS_DIR / "traces"
        screenshots_dir.mkdir(parents=True, exist_ok=True)
        traces_dir.mkdir(parents=True, exist_ok=True)

        # Capturar screenshot
        page.screenshot(path=str(screenshots_dir / f"{test_name}.png"))

        # Guardar trace
        page.context.tracing.stop(
            path=str(traces_dir / f"{test_name}.zip")
        )
    else:
        page.context.tracing.stop()


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item):
    """Hook para acceder al resultado del test en el fixture."""
    outcome = yield
    rep = outcome.get_result()
    setattr(item, f"rep_{rep.when}", rep)</code></pre>

        <h3>🌍 Variables de entorno en Docker</h3>
        <p>Usa variables de entorno para configurar tus tests sin modificar el codigo.</p>

        <pre><code class="bash"># Pasar variables de entorno individuales
docker run --rm \\
    -e BASE_URL="https://staging.miapp.com" \\
    -e HEADLESS=true \\
    -e BROWSER="chromium" \\
    -e SLOW_MO=0 \\
    mis-tests-playwright

# Usar archivo .env
docker run --rm \\
    --env-file .env.staging \\
    -v "$(pwd)/test-results:/app/test-results" \\
    mis-tests-playwright</code></pre>

        <pre><code class="python"># conftest.py - Leer variables de entorno
import os
import pytest
from playwright.sync_api import sync_playwright

@pytest.fixture(scope="session")
def browser_config():
    """Configuracion del navegador desde variables de entorno."""
    return {
        "base_url": os.getenv("BASE_URL", "http://localhost:3000"),
        "headless": os.getenv("HEADLESS", "true").lower() == "true",
        "browser": os.getenv("BROWSER", "chromium"),
        "slow_mo": int(os.getenv("SLOW_MO", "0")),
        "timeout": int(os.getenv("TIMEOUT", "30000")),
    }

@pytest.fixture(scope="session")
def browser(browser_config):
    """Lanzar navegador con la configuracion de entorno."""
    with sync_playwright() as p:
        browser_type = getattr(p, browser_config["browser"])
        browser = browser_type.launch(
            headless=browser_config["headless"],
            slow_mo=browser_config["slow_mo"],
        )
        yield browser
        browser.close()</code></pre>

        <pre><code class="bash"># .env.staging
BASE_URL=https://staging.miapp.com
HEADLESS=true
BROWSER=chromium
SLOW_MO=0
TIMEOUT=30000
RETRIES=2</code></pre>

        <h3>🐙 Docker Compose para entornos completos</h3>
        <p>Docker Compose permite levantar la aplicacion bajo prueba junto con los tests
        en un solo comando. Esto es fundamental para tests de integracion end-to-end.</p>

        <pre><code class="yaml"># docker-compose.yml
version: "3.9"

services:
  # Aplicacion bajo prueba
  app:
    build:
      context: ../mi-aplicacion
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=test
      - DATABASE_URL=postgres://user:pass@db:5432/testdb
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 5s
      timeout: 3s
      retries: 10

  # Base de datos para tests
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: testdb
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d testdb"]
      interval: 3s
      timeout: 3s
      retries: 5

  # Tests de Playwright
  tests:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      - BASE_URL=http://app:3000
      - HEADLESS=true
    depends_on:
      app:
        condition: service_healthy
    volumes:
      - ./test-results:/app/test-results
      - ./reports:/app/reports
    command: >
      pytest tests/ -v
        --screenshot=on
        --output=/app/test-results
        --html=/app/reports/report.html
        --self-contained-html</code></pre>

        <pre><code class="bash"># Ejecutar todo el stack
docker compose up --build --abort-on-container-exit --exit-code-from tests

# Desglose del comando:
# --build               : reconstruir imagenes si hay cambios
# --abort-on-container-exit : detener todo cuando los tests terminen
# --exit-code-from tests   : usar el exit code de los tests como resultado

# Limpiar despues de los tests
docker compose down -v

# Ejecutar solo los tests (si la app ya esta corriendo)
docker compose run --rm tests

# Ejecutar un test especifico
docker compose run --rm tests pytest tests/test_login.py -v -k "test_login_exitoso"</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>El flag <code>--exit-code-from tests</code> es clave para CI/CD: hace que
            <code>docker compose</code> devuelva el mismo codigo de salida que el contenedor de tests.
            Si los tests fallan (exit code != 0), el pipeline de CI tambien fallara. En SIESA
            usamos esto en todos nuestros pipelines para garantizar que los fallos se propaguen
            correctamente.</p>
        </div>

        <h3>🏗️ Multi-stage builds para imagenes mas pequenas</h3>
        <p>Si tu proyecto tiene dependencias pesadas de compilacion (como <code>cryptography</code> o
        <code>lxml</code>), usa multi-stage builds para reducir el tamano final de la imagen.</p>

        <pre><code class="dockerfile"># Dockerfile.multistage
# === Etapa 1: Instalar dependencias ===
FROM mcr.microsoft.com/playwright/python:v1.49.0-noble-amd64 AS builder

WORKDIR /build

# Copiar y compilar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# === Etapa 2: Imagen final (solo runtime) ===
FROM mcr.microsoft.com/playwright/python:v1.49.0-noble-amd64

WORKDIR /app

# Copiar solo los paquetes instalados (sin compiladores ni headers)
COPY --from=builder /install /usr/local

# Copiar codigo de tests
COPY . .

# Crear directorio de resultados
RUN mkdir -p /app/test-results/screenshots /app/test-results/traces /app/reports

# Usuario no-root para seguridad (recomendado en CI)
# Nota: Playwright necesita ciertos permisos; pwuser existe en la imagen oficial
USER pwuser

CMD ["pytest", "tests/", "-v", "--tb=short"]</code></pre>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔬 Avanzado: Optimizacion de capas Docker</h4>
            <p>Docker cachea cada instruccion (<code>RUN</code>, <code>COPY</code>, etc.) como una capa.
            Si una capa no cambia, Docker reutiliza el cache. Ordena tu Dockerfile de
            <strong>menos a mas frecuente en cambios</strong>:</p>
            <pre><code class="dockerfile"># Orden optimo de capas (de menos a mas cambiante):
# 1. Base image       (cambia cada pocas semanas)
FROM mcr.microsoft.com/playwright/python:v1.49.0-noble-amd64
WORKDIR /app

# 2. Dependencias     (cambian cada pocos dias)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 3. Configuracion    (cambia ocasionalmente)
COPY conftest.py pytest.ini ./
COPY pages/ ./pages/

# 4. Tests            (cambian constantemente)
COPY tests/ ./tests/

CMD ["pytest", "tests/", "-v"]</code></pre>
            <p>Asi, cuando solo cambias un test, Docker reutiliza el cache de las capas 1-3
            y solo reconstruye la capa 4. Esto reduce el build de minutos a segundos.</p>
        </div>

        <h3>🖥️ Modo headed en Docker (con Xvfb)</h3>
        <p>Por defecto, Docker no tiene servidor grafico. Si necesitas ejecutar tests en modo
        <strong>headed</strong> (por ejemplo, para depurar visualmente), debes usar Xvfb
        (X Virtual Framebuffer).</p>

        <pre><code class="bash"># La imagen oficial de Playwright ya incluye xvfb-run
# Ejecutar tests en modo headed dentro de Docker:
docker run --rm \\
    -e DISPLAY=:99 \\
    mis-tests-playwright \\
    xvfb-run --auto-servernum --server-args="-screen 0 1920x1080x24" \\
    pytest tests/ -v --headed

# Grabar video de los tests (no requiere Xvfb, Playwright lo hace internamente)
docker run --rm \\
    -v "$(pwd)/test-results:/app/test-results" \\
    mis-tests-playwright \\
    pytest tests/ -v --video=on --output=/app/test-results</code></pre>

        <pre><code class="python"># conftest.py - Configurar video y headed segun entorno
import os
import pytest

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    """Agregar grabacion de video si VIDEO=on."""
    if os.getenv("VIDEO", "off") == "on":
        return {
            **browser_context_args,
            "record_video_dir": "/app/test-results/videos",
            "record_video_size": {"width": 1280, "height": 720},
        }
    return browser_context_args</code></pre>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📋 Nota sobre modo headed</h4>
            <p>En la gran mayoria de los casos, <strong>no necesitas modo headed en Docker</strong>.
            Los traces de Playwright (<code>--tracing=on</code>) proporcionan una recreacion
            visual completa del test que puedes ver en <code>trace.playwright.dev</code>.
            Usa headed solo cuando necesites depurar un problema muy especifico que no se
            reproduce en headless.</p>
        </div>

        <h3>⚡ Tips de rendimiento</h3>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Optimizaciones recomendadas</h4>
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #c8e6c9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Tecnica</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Impacto</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Implementacion</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Cache de pip</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Build 60-80% mas rapido</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>COPY requirements.txt</code> antes que el codigo</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">.dockerignore</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Build context mas pequeno</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Excluir <code>test-results/</code>, <code>.git/</code>, <code>__pycache__/</code></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">--no-cache-dir en pip</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Imagen 100-200MB mas liviana</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>pip install --no-cache-dir</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Imagen oficial PW</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Evita instalar navegadores</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">No usar <code>playwright install</code> en Dockerfile</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">BuildKit cache</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Cache persistente entre builds</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>DOCKER_BUILDKIT=1 docker build</code></td>
                </tr>
            </table>
        </div>

        <pre><code class="bash"># .dockerignore - Excluir archivos innecesarios del build context
.git
.gitignore
__pycache__
*.pyc
.pytest_cache
test-results/
reports/
.env
.env.*
*.md
.vscode/
.idea/
node_modules/
venv/
.venv/</code></pre>

        <pre><code class="bash"># BuildKit para builds mas rapidos
DOCKER_BUILDKIT=1 docker build -t mis-tests-playwright .

# Cache de pip con BuildKit mount cache
# En el Dockerfile puedes usar:
# RUN --mount=type=cache,target=/root/.cache/pip \\
#     pip install -r requirements.txt</code></pre>

        <h3>🔍 Depuracion de tests dentro de contenedores</h3>
        <p>Cuando un test falla solo en Docker, necesitas herramientas para investigar
        dentro del contenedor.</p>

        <pre><code class="bash"># 1. Entrar al contenedor interactivamente
docker run --rm -it \\
    -v "$(pwd)/tests:/app/tests" \\
    mis-tests-playwright \\
    /bin/bash

# Dentro del contenedor:
# $ python -c "from playwright.sync_api import sync_playwright; print('OK')"
# $ pytest tests/test_login.py -v -s  # -s para ver print()
# $ python -m playwright install --dry-run  # verificar navegadores

# 2. Ejecutar un test especifico con output detallado
docker run --rm \\
    -v "$(pwd)/test-results:/app/test-results" \\
    mis-tests-playwright \\
    pytest tests/test_login.py::test_login_exitoso -v -s \\
        --tracing=on \\
        --screenshot=on \\
        --output=/app/test-results

# 3. Ver los traces generados (en tu maquina host)
# Abrir https://trace.playwright.dev y cargar el archivo .zip
# Los traces estaran en ./test-results/

# 4. Ejecutar con pdb (debugger interactivo)
docker run --rm -it \\
    mis-tests-playwright \\
    pytest tests/test_login.py -v -s --pdb</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>Cuando un test falla solo en Docker pero pasa localmente, las causas mas comunes son:
            <strong>(1)</strong> diferencias de timing (el contenedor es mas lento),
            <strong>(2)</strong> resolucion de pantalla diferente,
            <strong>(3)</strong> variables de entorno faltantes, o
            <strong>(4)</strong> archivos que no se copiaron al contenedor.
            Siempre revisa el trace primero: <code>trace.playwright.dev</code> muestra exactamente
            que vio el navegador.</p>
        </div>

        <h3>📋 Dockerfile completo de produccion</h3>
        <p>Este es un Dockerfile listo para usar en un proyecto real con todas las
        optimizaciones descritas en esta leccion.</p>

        <pre><code class="dockerfile"># Dockerfile - Playwright Tests (Produccion)
# =============================================
FROM mcr.microsoft.com/playwright/python:v1.49.0-noble-amd64

# Metadatos
LABEL maintainer="equipo-qa@siesa.com"
LABEL description="Tests E2E con Playwright para Python"

# Variables de entorno por defecto
ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1 \\
    BASE_URL=http://localhost:3000 \\
    HEADLESS=true \\
    BROWSER=chromium \\
    TIMEOUT=30000

WORKDIR /app

# 1. Instalar dependencias (capa cacheada)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2. Copiar configuracion
COPY conftest.py pytest.ini ./

# 3. Copiar Page Objects y utilidades
COPY pages/ ./pages/
COPY utils/ ./utils/

# 4. Copiar tests (capa que cambia mas frecuentemente)
COPY tests/ ./tests/

# 5. Crear directorios de resultados
RUN mkdir -p /app/test-results/screenshots \\
             /app/test-results/traces \\
             /app/test-results/videos \\
             /app/reports

# Comando por defecto
CMD ["pytest", "tests/", "-v", "--tb=short", \\
     "--screenshot=on", "--output=/app/test-results"]</code></pre>

        <h3>🎯 Ejercicio practico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🏋️ Ejercicio: Dockerizar un proyecto de tests</h4>
            <p>Crea la configuracion Docker completa para un proyecto de tests de Playwright.</p>
        </div>

        <pre><code class="python"># === Paso 1: Crear la estructura del proyecto ===
# Crea estos archivos en tu directorio de trabajo:

# requirements.txt
"""
playwright==1.49.0
pytest==8.3.4
pytest-playwright==0.5.2
pytest-html==4.1.1
"""

# conftest.py
import os
import pytest
from playwright.sync_api import Page
from pathlib import Path

RESULTS_DIR = Path(os.getenv("RESULTS_DIR", "./test-results"))

@pytest.fixture(scope="session")
def browser_type_launch_args():
    """Configurar el navegador desde variables de entorno."""
    return {
        "headless": os.getenv("HEADLESS", "true").lower() == "true",
        "slow_mo": int(os.getenv("SLOW_MO", "0")),
    }

@pytest.fixture(autouse=True)
def configurar_pagina(page: Page):
    """Configurar cada pagina de test."""
    base_url = os.getenv("BASE_URL", "https://the-internet.herokuapp.com")
    page.set_default_timeout(int(os.getenv("TIMEOUT", "30000")))
    yield page


# test_docker_demo.py
from playwright.sync_api import Page, expect

def test_pagina_carga(page: Page):
    """Verificar que la pagina principal carga correctamente."""
    page.goto("https://the-internet.herokuapp.com")
    expect(page.get_by_role("heading", name="Welcome to the-internet")).to_be_visible()

def test_login_formulario(page: Page):
    """Verificar el formulario de login."""
    page.goto("https://the-internet.herokuapp.com/login")
    page.get_by_label("Username").fill("tomsmith")
    page.get_by_label("Password").fill("SuperSecretPassword!")
    page.get_by_role("button", name="Login").click()
    expect(page.get_by_text("You logged into a secure area")).to_be_visible()

def test_checkboxes(page: Page):
    """Verificar interaccion con checkboxes."""
    page.goto("https://the-internet.herokuapp.com/checkboxes")
    checkboxes = page.locator("input[type='checkbox']")
    checkboxes.first.check()
    expect(checkboxes.first).to_be_checked()</code></pre>

        <pre><code class="dockerfile"># === Paso 2: Crear el Dockerfile ===
# Dockerfile
FROM mcr.microsoft.com/playwright/python:v1.49.0-noble-amd64

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY conftest.py .
COPY tests/ ./tests/

RUN mkdir -p /app/test-results/screenshots /app/reports

CMD ["pytest", "tests/", "-v", "--screenshot=on", \\
     "--output=/app/test-results", \\
     "--html=/app/reports/report.html", "--self-contained-html"]</code></pre>

        <pre><code class="bash"># === Paso 3: Construir y ejecutar ===

# Construir
docker build -t ejercicio-pw-docker .

# Ejecutar todos los tests
docker run --rm \\
    -v "$(pwd)/test-results:/app/test-results" \\
    -v "$(pwd)/reports:/app/reports" \\
    ejercicio-pw-docker

# Ejecutar con variables de entorno personalizadas
docker run --rm \\
    -e HEADLESS=true \\
    -e TIMEOUT=60000 \\
    -v "$(pwd)/test-results:/app/test-results" \\
    ejercicio-pw-docker \\
    pytest tests/test_docker_demo.py -v

# Verificar resultados
ls -la test-results/screenshots/
ls -la reports/

# === Paso 4: Crear docker-compose.yml ===</code></pre>

        <pre><code class="yaml"># docker-compose.yml
version: "3.9"

services:
  tests:
    build: .
    environment:
      - HEADLESS=true
      - BROWSER=chromium
    volumes:
      - ./test-results:/app/test-results
      - ./reports:/app/reports

  # Para ejecutar contra una app local, agrega:
  # app:
  #   image: mi-app:latest
  #   ports:
  #     - "3000:3000"
  #   healthcheck:
  #     test: ["CMD", "curl", "-f", "http://localhost:3000"]
  #     interval: 5s
  #     retries: 10</code></pre>

        <pre><code class="bash"># Ejecutar con Docker Compose
docker compose up --build --abort-on-container-exit --exit-code-from tests

# Limpiar
docker compose down -v

# Verificar que los artefactos se generaron
echo "=== Screenshots ==="
ls -la test-results/screenshots/
echo "=== Reportes ==="
ls -la reports/</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Criterios de exito del ejercicio</h4>
            <ul>
                <li>La imagen Docker se construye sin errores</li>
                <li>Los 3 tests pasan dentro del contenedor</li>
                <li>Los screenshots se guardan en <code>test-results/screenshots/</code> del host</li>
                <li>El reporte HTML se genera en <code>reports/report.html</code></li>
                <li>Docker Compose levanta y ejecuta los tests correctamente</li>
                <li>El exit code refleja el resultado de los tests (0 = todos pasaron)</li>
            </ul>
        </div>

        <h3>📊 Resumen de comandos clave</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #ce93d8; color: white;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Comando</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Proposito</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>docker build -t nombre .</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Construir imagen de tests</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>docker run --rm nombre</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Ejecutar tests en contenedor</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>docker run --rm -v host:cont nombre</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Ejecutar con volumen para resultados</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>docker run --rm -e VAR=val nombre</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Pasar variables de entorno</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>docker run --rm -it nombre /bin/bash</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Entrar al contenedor para depurar</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>docker compose up --build</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Levantar stack completo</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>docker compose down -v</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Detener y limpiar volumenes</td>
                </tr>
            </table>
        </div>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Resumen de la leccion</h4>
            <ul>
                <li><strong>Docker elimina el "funciona en mi maquina"</strong> al empaquetar SO, Python, navegadores y dependencias</li>
                <li><strong>Imagen oficial:</strong> <code>mcr.microsoft.com/playwright/python:v1.49.0-noble-amd64</code> con todo preinstalado</li>
                <li><strong>Dockerfile:</strong> copiar requirements primero (cache), luego codigo; usar <code>--no-cache-dir</code> en pip</li>
                <li><strong>Volumenes:</strong> montar <code>test-results/</code> y <code>reports/</code> para extraer artefactos</li>
                <li><strong>Docker Compose:</strong> orquestar app + db + tests con healthchecks y <code>--exit-code-from</code></li>
                <li><strong>Variables de entorno:</strong> usar <code>-e</code> o <code>--env-file</code> para configurar sin cambiar codigo</li>
                <li><strong>Multi-stage:</strong> separar build y runtime para imagenes mas pequenas</li>
                <li><strong>Depuracion:</strong> usar <code>-it /bin/bash</code>, traces y <code>trace.playwright.dev</code></li>
            </ul>
        </div>

        <h3>🚀 Siguiente: GitHub Actions con Playwright</h3>
        <p>En la proxima leccion integraremos Docker con <strong>GitHub Actions</strong> para crear
        pipelines de CI/CD que ejecuten tus tests de Playwright automaticamente en cada push
        y pull request.</p>
    `,
    topics: ["docker", "contenedores", "playwright"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 10,
    difficulty: "medium",
    type: "foundation"
};

if (typeof window !== 'undefined') {
    window.LESSON_110 = LESSON_110;
}
