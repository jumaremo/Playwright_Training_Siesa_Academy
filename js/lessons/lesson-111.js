/**
 * Playwright Academy - Leccion 111
 * GitHub Actions con Playwright
 * Seccion 17: CI/CD Integration
 */

const LESSON_111 = {
    id: 111,
    title: "GitHub Actions con Playwright",
    duration: "7 min",
    level: "advanced",
    section: "section-17",
    content: `
        <h2>GitHub Actions con Playwright</h2>
        <p>GitHub Actions es la plataforma de CI/CD nativa de GitHub y una de las opciones mas populares
        para ejecutar tests de Playwright en la nube. Su integracion directa con el repositorio,
        su modelo basado en <strong>workflows YAML</strong>, y sus <strong>runners gratuitos</strong>
        para proyectos open source la convierten en la opcion ideal para equipos que ya trabajan con GitHub.
        En esta leccion construiras workflows completos para ejecutar, reportar y optimizar
        tus suites de Playwright con Python.</p>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>En SIESA, varios equipos de QA utilizan GitHub Actions para ejecutar suites de regresion
            automaticas en cada pull request hacia las ramas de staging y main. Esto garantiza que ningun
            cambio llegue a produccion sin pasar por la validacion automatizada de Playwright, reduciendo
            significativamente la tasa de defectos en releases.</p>
        </div>

        <h3>Conceptos basicos de GitHub Actions</h3>
        <p>Antes de escribir tu primer workflow, es fundamental entender los tres pilares de GitHub Actions:</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Concepto</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripcion</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Analogia</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Workflow</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Archivo YAML en <code>.github/workflows/</code> que define el pipeline completo</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">El plan de ejecucion</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Job</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Conjunto de pasos que se ejecutan en un mismo runner (maquina virtual)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Un equipo de trabajo</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Step</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Accion individual dentro de un job: ejecutar un comando, usar una action, etc.</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Una tarea concreta</td>
                </tr>
            </table>
        </div>

        <p>El flujo es: un <strong>evento</strong> (push, PR, cron) dispara un <strong>workflow</strong>,
        que contiene uno o mas <strong>jobs</strong>, y cada job ejecuta una secuencia de <strong>steps</strong>
        en un runner aislado.</p>

        <pre><code class="yaml"># Estructura minima de un workflow
# Archivo: .github/workflows/playwright.yml

name: Playwright Tests          # Nombre visible en la UI de GitHub

on: [push, pull_request]        # Eventos que disparan el workflow

jobs:                           # Definicion de jobs
  test:                         # Nombre del job
    runs-on: ubuntu-latest      # Runner (maquina virtual)
    steps:                      # Pasos secuenciales
      - uses: actions/checkout@v4       # Clonar el repo
      - name: Run tests                 # Nombre descriptivo
        run: echo "Hola CI"             # Comando a ejecutar</code></pre>

        <h3>Workflow completo para Playwright con Python</h3>
        <p>Este es un workflow robusto y listo para produccion que cubre instalacion de Python,
        dependencias, browsers de Playwright y ejecucion de tests:</p>

        <pre><code class="yaml"># .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  playwright-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      # 1. Clonar el repositorio
      - name: Checkout del codigo
        uses: actions/checkout@v4

      # 2. Configurar Python
      - name: Configurar Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      # 3. Instalar dependencias del proyecto
      - name: Instalar dependencias
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      # 4. Instalar browsers de Playwright
      - name: Instalar Playwright browsers
        run: playwright install --with-deps chromium

      # 5. Ejecutar tests
      - name: Ejecutar tests de Playwright
        run: |
          pytest tests/ \\
            --browser chromium \\
            --headed false \\
            --output=test-results \\
            -v \\
            --tb=short

      # 6. Subir resultados como artefactos
      - name: Subir resultados de tests
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-results
          path: test-results/
          retention-days: 14</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Nota importante</h4>
            <p>El flag <code>--with-deps</code> en <code>playwright install</code> es <strong>esencial en CI</strong>.
            Instala las dependencias del sistema operativo (librerias de renderizado, fuentes, etc.) que
            Playwright necesita. Sin este flag, los browsers fallan al iniciar en runners de CI.</p>
        </div>

        <h3>Configurar Python e instalar dependencias</h3>
        <p>La action <code>actions/setup-python@v5</code> permite configurar la version de Python
        y opcionalmente cachear pip para acelerar las ejecuciones:</p>

        <pre><code class="yaml">      # Configurar Python con cache de pip integrado
      - name: Configurar Python con cache
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"
          cache: "pip"                  # Cachea automaticamente ~/.cache/pip
          cache-dependency-path: |
            requirements.txt
            requirements-dev.txt

      # Instalar dependencias
      - name: Instalar dependencias
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install -r requirements-dev.txt</code></pre>

        <p>Un <code>requirements.txt</code> tipico para un proyecto de Playwright con Python:</p>

        <div class="code-tabs" data-code-id="L111-1">
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
        <pre><code class="language-python"># requirements.txt
playwright==1.49.1
pytest==8.3.4
pytest-playwright==0.5.2
pytest-html==4.1.1
pytest-xdist==3.5.0        # Ejecucion paralela
python-dotenv==1.0.1        # Variables de entorno</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">// package.json (dependencias equivalentes)
{
  "devDependencies": {
    "@playwright/test": "^1.49.1",
    "dotenv": "^16.4.5"
  },
  "scripts": {
    "test": "npx playwright test",
    "test:headed": "npx playwright test --headed",
    "test:report": "npx playwright show-report"
  }
}
// Nota: @playwright/test ya incluye runner, reporters HTML/JUnit,
// y ejecucion paralela integrada (no necesita paquetes separados)</code></pre>
        </div>
        </div>

        <h3>Instalar browsers de Playwright en CI</h3>
        <p>Playwright necesita descargar binarios de browsers. En CI, es recomendable instalar
        <strong>solo los browsers que realmente necesitas</strong> para ahorrar tiempo:</p>

        <pre><code class="yaml">      # Opcion 1: Solo Chromium (mas rapido, ~150MB)
      - name: Instalar solo Chromium
        run: playwright install --with-deps chromium

      # Opcion 2: Todos los browsers (~500MB)
      - name: Instalar todos los browsers
        run: playwright install --with-deps

      # Opcion 3: Browsers especificos
      - name: Instalar Chromium y Firefox
        run: |
          playwright install --with-deps chromium
          playwright install --with-deps firefox</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>En los pipelines de SIESA, la mayoria de suites se ejecutan solo con Chromium para
            mantener tiempos de CI por debajo de 10 minutos. Las pruebas cross-browser (Firefox, WebKit)
            se ejecutan en un workflow separado con frecuencia diaria (cron nocturno), evitando
            ralentizar el flujo de PRs.</p>
        </div>

        <h3>Cacheo de browsers y dependencias pip</h3>
        <p>El cacheo es <strong>critico</strong> para reducir tiempos de CI. Playwright descarga browsers
        que pesan cientos de MB; sin cache, cada ejecucion los descarga de nuevo.</p>

        <pre><code class="yaml">    steps:
      - uses: actions/checkout@v4

      - name: Configurar Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"
          cache: "pip"

      # Cache de browsers de Playwright
      - name: Obtener version de Playwright
        id: playwright-version
        run: |
          PLAYWRIGHT_VERSION=$(pip show playwright 2>/dev/null | grep Version | cut -d' ' -f2 || echo "unknown")
          echo "version=$PLAYWRIGHT_VERSION" >> $GITHUB_OUTPUT

      - name: Cache de browsers de Playwright
        uses: actions/cache@v4
        id: playwright-cache
        with:
          path: ~/.cache/ms-playwright
          key: playwright-browsers-\${{ steps.playwright-version.outputs.version }}-\${{ runner.os }}

      - name: Instalar dependencias
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Instalar browsers (solo si no hay cache)
        if: steps.playwright-cache.outputs.cache-hit != 'true'
        run: playwright install --with-deps chromium

      - name: Instalar dependencias del sistema (si hay cache de browsers)
        if: steps.playwright-cache.outputs.cache-hit == 'true'
        run: playwright install-deps chromium</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Impacto del cache</h4>
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #c8e6c9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Recurso</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Sin cache</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Con cache</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Ahorro</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">pip install</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">~45s</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">~10s</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">~78%</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Playwright browsers</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">~60-90s</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">~5s</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">~93%</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Total pipeline</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>~4-6 min</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>~2-3 min</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>~50%</strong></td>
                </tr>
            </table>
        </div>

        <h3>Ejecutar tests con configuracion adecuada para CI</h3>
        <p>En CI, los tests deben ejecutarse en modo <strong>headless</strong> (sin interfaz grafica)
        y con configuraciones optimizadas para entornos sin display:</p>

        <pre><code class="yaml">      - name: Ejecutar tests de Playwright
        env:
          CI: true
          PLAYWRIGHT_BROWSERS_PATH: ~/.cache/ms-playwright
        run: |
          pytest tests/ \\
            --browser chromium \\
            --headed false \\
            --output=test-results \\
            --screenshot=on \\
            --video=retain-on-failure \\
            --tracing=retain-on-failure \\
            -v \\
            --tb=short \\
            --junitxml=test-results/junit.xml \\
            --html=test-results/report.html \\
            --self-contained-html</code></pre>

        <p>Tambien puedes centralizar la configuracion CI en un archivo <code>conftest.py</code>
        que detecte automaticamente el entorno:</p>

        <div class="code-tabs" data-code-id="L111-2">
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
        <pre><code class="language-python"># conftest.py
import os
import pytest

def is_ci():
    """Detectar si estamos en un entorno de CI."""
    return os.getenv("CI") == "true" or os.getenv("GITHUB_ACTIONS") == "true"

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    """Configuracion del contexto del browser para CI."""
    if is_ci():
        return {
            **browser_context_args,
            "viewport": {"width": 1280, "height": 720},
            "ignore_https_errors": True,
            "locale": "es-CO",
            "timezone_id": "America/Bogota",
        }
    return browser_context_args

@pytest.fixture(scope="session")
def browser_type_launch_args(browser_type_launch_args):
    """Args de lanzamiento del browser para CI."""
    if is_ci():
        return {
            **browser_type_launch_args,
            "args": [
                "--disable-gpu",
                "--no-sandbox",
                "--disable-dev-shm-usage",
            ]
        }
    return browser_type_launch_args</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

// Detectar si estamos en un entorno de CI
const isCI = !!process.env.CI || !!process.env.GITHUB_ACTIONS;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,

  use: {
    // Configuracion del contexto del browser para CI
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: isCI,
    locale: 'es-CO',
    timezoneId: 'America/Bogota',

    // Args de lanzamiento del browser para CI
    launchOptions: isCI
      ? {
          args: [
            '--disable-gpu',
            '--no-sandbox',
            '--disable-dev-shm-usage',
          ],
        }
      : {},
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});</code></pre>
        </div>
        </div>

        <h3>Subir artefactos: screenshots, videos, traces y reportes</h3>
        <p>Una de las ventajas clave de GitHub Actions es poder subir <strong>artefactos</strong> que
        persisten despues de la ejecucion. Para Playwright, esto incluye evidencia visual de fallos:</p>

        <pre><code class="yaml">      # Subir screenshots y videos de tests fallidos
      - name: Subir screenshots y videos
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-screenshots-videos
          path: |
            test-results/**/screenshot*.png
            test-results/**/video*.webm
          retention-days: 7

      # Subir traces para Trace Viewer
      - name: Subir traces de Playwright
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-traces
          path: test-results/**/trace.zip
          retention-days: 7

      # Subir reporte HTML completo (siempre, no solo en fallos)
      - name: Subir reporte HTML
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-html-report
          path: test-results/report.html
          retention-days: 30

      # Subir resultados JUnit para integracion con GitHub
      - name: Subir resultados JUnit
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: junit-results
          path: test-results/junit.xml
          retention-days: 14</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Condiciones if: en artefactos</h4>
            <ul>
                <li><code>if: always()</code> - Sube el artefacto sin importar si los tests pasan o fallan</li>
                <li><code>if: failure()</code> - Solo sube si algun paso anterior fallo (ideal para evidencia de bugs)</li>
                <li><code>if: success()</code> - Solo sube si todos los pasos anteriores pasaron</li>
                <li><code>if: cancelled()</code> - Solo sube si el workflow fue cancelado</li>
            </ul>
        </div>

        <h3>Matrix strategy: multiples versiones, SO y browsers</h3>
        <p>La <strong>estrategia de matriz</strong> permite ejecutar los mismos tests en combinaciones
        de Python, sistema operativo y browser sin duplicar configuracion:</p>

        <pre><code class="yaml">jobs:
  playwright-tests:
    strategy:
      fail-fast: false        # No cancelar otros jobs si uno falla
      matrix:
        python-version: ["3.11", "3.12"]
        os: [ubuntu-latest, windows-latest]
        browser: [chromium, firefox]
        exclude:
          # Firefox en Windows puede ser inestable en CI
          - os: windows-latest
            browser: firefox

    runs-on: \${{ matrix.os }}
    timeout-minutes: 30

    steps:
      - uses: actions/checkout@v4

      - name: Configurar Python \${{ matrix.python-version }}
        uses: actions/setup-python@v5
        with:
          python-version: \${{ matrix.python-version }}
          cache: "pip"

      - name: Instalar dependencias
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Instalar browser \${{ matrix.browser }}
        run: playwright install --with-deps \${{ matrix.browser }}

      - name: Ejecutar tests en \${{ matrix.browser }}
        run: |
          pytest tests/ \\
            --browser \${{ matrix.browser }} \\
            --output=test-results-\${{ matrix.browser }} \\
            -v

      - name: Subir resultados
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: results-\${{ matrix.os }}-py\${{ matrix.python-version }}-\${{ matrix.browser }}
          path: test-results-\${{ matrix.browser }}/
          retention-days: 14</code></pre>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Resultado de la matrix</h4>
            <p>Con la configuracion anterior (2 versiones Python x 2 SO x 2 browsers - 1 exclusion),
            GitHub Actions crea <strong>7 jobs en paralelo</strong>, cada uno ejecutando la suite completa
            en una combinacion diferente. El flag <code>fail-fast: false</code> asegura que todos los jobs
            terminen incluso si uno falla, dando visibilidad completa del estado cross-platform.</p>
        </div>

        <h3>Triggers: push, pull_request y schedule (cron)</h3>
        <p>GitHub Actions soporta multiples eventos para disparar workflows. Una configuracion
        avanzada combina varios triggers segun las necesidades del equipo:</p>

        <pre><code class="yaml">name: Playwright Tests

on:
  # Ejecutar en cada push a ramas principales
  push:
    branches: [main, develop, release/*]
    paths-ignore:
      - "*.md"                    # Ignorar cambios solo en docs
      - "docs/**"

  # Ejecutar en PRs hacia ramas principales
  pull_request:
    branches: [main, develop]
    types: [opened, synchronize, reopened]

  # Ejecucion programada (cron): suite completa cross-browser
  schedule:
    # Lunes a viernes a las 6:00 AM hora Colombia (UTC-5 = 11:00 UTC)
    - cron: "0 11 * * 1-5"

  # Permitir ejecucion manual desde la UI de GitHub
  workflow_dispatch:
    inputs:
      browser:
        description: "Browser para ejecutar los tests"
        required: true
        default: "chromium"
        type: choice
        options:
          - chromium
          - firefox
          - webkit
          - all
      environment:
        description: "Entorno destino"
        required: true
        default: "staging"
        type: choice
        options:
          - staging
          - production</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>En SIESA se usa una estrategia de tres capas: (1) <strong>PRs</strong>: tests criticos solo
            con Chromium (~3 min), (2) <strong>merge a develop</strong>: suite completa single-browser (~8 min),
            (3) <strong>cron nocturno</strong>: cross-browser completo (~25 min). Esto balancea la velocidad
            del feedback en PRs con la cobertura cross-browser de las ejecuciones nocturnas.</p>
        </div>

        <h3>Secrets de entorno para credenciales de test</h3>
        <p>Nunca hardcodees credenciales en el codigo. GitHub Actions ofrece <strong>secrets encriptados</strong>
        que se inyectan como variables de entorno de forma segura:</p>

        <pre><code class="yaml">      - name: Ejecutar tests de Playwright
        env:
          # Secrets configurados en Settings > Secrets and variables > Actions
          TEST_BASE_URL: \${{ secrets.TEST_BASE_URL }}
          TEST_USERNAME: \${{ secrets.TEST_USERNAME }}
          TEST_PASSWORD: \${{ secrets.TEST_PASSWORD }}
          # Variables de entorno (no secretas)
          ENVIRONMENT: staging
          CI: true
        run: |
          pytest tests/ \\
            --base-url \${{ secrets.TEST_BASE_URL }} \\
            --browser chromium \\
            -v</code></pre>

        <p>En tu codigo Python, accedes a los secrets como variables de entorno normales:</p>

        <div class="code-tabs" data-code-id="L111-3">
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
        <pre><code class="language-python"># tests/conftest.py
import os
import pytest
from playwright.sync_api import Page

@pytest.fixture
def authenticated_page(page: Page):
    """Fixture que realiza login usando credenciales de CI."""
    base_url = os.getenv("TEST_BASE_URL", "http://localhost:3000")
    username = os.getenv("TEST_USERNAME", "test_user")
    password = os.getenv("TEST_PASSWORD", "test_pass")

    page.goto(f"{base_url}/login")
    page.fill("#username", username)
    page.fill("#password", password)
    page.click("button[type='submit']")
    page.wait_for_url(f"{base_url}/dashboard")

    yield page</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">// tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const USERNAME = process.env.TEST_USERNAME || 'test_user';
const PASSWORD = process.env.TEST_PASSWORD || 'test_pass';

// Fixture personalizada que realiza login usando credenciales de CI
setup('authenticate', async ({ page }) => {
  await page.goto(\`\${BASE_URL}/login\`);
  await page.fill('#username', USERNAME);
  await page.fill('#password', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(\`\${BASE_URL}/dashboard\`);

  // Guardar el estado de autenticacion para reutilizar en otros tests
  await page.context().storageState({
    path: './playwright/.auth/user.json',
  });
});

// En playwright.config.ts, agregar el proyecto de setup:
// projects: [
//   { name: 'setup', testMatch: /.*\\.setup\\.ts/ },
//   {
//     name: 'chromium',
//     dependencies: ['setup'],
//     use: {
//       ...devices['Desktop Chrome'],
//       storageState: './playwright/.auth/user.json',
//     },
//   },
// ]</code></pre>
        </div>
        </div>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Seguridad con secrets</h4>
            <ul>
                <li>Los secrets <strong>nunca se muestran en logs</strong>; GitHub los enmascara automaticamente</li>
                <li>Los secrets no estan disponibles en workflows de PRs desde forks (proteccion contra exfiltracion)</li>
                <li>Usa <strong>environment secrets</strong> (Settings > Environments) para separar credenciales de staging vs produccion</li>
                <li>Rota las credenciales periodicamente y usa cuentas de servicio, no cuentas personales</li>
            </ul>
        </div>

        <h3>Status badges en el README</h3>
        <p>Los <strong>badges de estado</strong> muestran visualmente si el workflow esta pasando o fallando
        directamente en el README del repositorio:</p>

        <pre><code class="markdown">&lt;!-- Formato del badge --&gt;
![Playwright Tests](https://github.com/OWNER/REPO/actions/workflows/playwright.yml/badge.svg)

&lt;!-- Badge para una rama especifica --&gt;
![Playwright Tests](https://github.com/OWNER/REPO/actions/workflows/playwright.yml/badge.svg?branch=main)

&lt;!-- Badge para un evento especifico --&gt;
![Playwright Tests](https://github.com/OWNER/REPO/actions/workflows/playwright.yml/badge.svg?event=schedule)

&lt;!-- Ejemplo en un README real --&gt;
# Mi Proyecto E2E

![CI Status](https://github.com/siesa/hcm-e2e/actions/workflows/playwright.yml/badge.svg)
![Cross-Browser](https://github.com/siesa/hcm-e2e/actions/workflows/cross-browser.yml/badge.svg)

Suite de pruebas automatizadas E2E con Playwright + Python.</code></pre>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Los badges son una herramienta de comunicacion poderosa: cualquier persona que visite el
            repositorio puede ver inmediatamente el estado de los tests sin navegar a la pestana de Actions.
            En equipos grandes, esto mejora la <strong>visibilidad del estado de calidad</strong> del proyecto.</p>
        </div>

        <h3>Steps condicionales: tests visuales solo en main</h3>
        <p>Algunos tests (como las comparaciones visuales) solo tienen sentido en ciertas ramas o contextos.
        GitHub Actions permite condicionar steps con expresiones:</p>

        <pre><code class="yaml">    steps:
      - uses: actions/checkout@v4

      # Tests funcionales: SIEMPRE se ejecutan
      - name: Ejecutar tests funcionales
        run: |
          pytest tests/functional/ \\
            --browser chromium \\
            -v

      # Tests visuales: SOLO en push a main (no en PRs)
      - name: Ejecutar tests de regresion visual
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        run: |
          pytest tests/visual/ \\
            --browser chromium \\
            --screenshot=on \\
            -v

      # Tests de performance: SOLO en ejecuciones programadas
      - name: Ejecutar tests de performance
        if: github.event_name == 'schedule'
        run: |
          pytest tests/performance/ \\
            --browser chromium \\
            -v --timeout=120

      # Notificar solo en fallos en main
      - name: Notificar fallo en Slack
        if: failure() && github.ref == 'refs/heads/main'
        uses: slackapi/slack-github-action@v1.27.0
        with:
          payload: |
            {
              "text": "Tests fallidos en main: \${{ github.server_url }}/\${{ github.repository }}/actions/runs/\${{ github.run_id }}"
            }
        env:
          SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK_URL }}</code></pre>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Expresiones condicionales utiles</h4>
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #e1bee7;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Expresion</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Se ejecuta cuando...</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>github.ref == 'refs/heads/main'</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">El push es a la rama main</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>github.event_name == 'pull_request'</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">El trigger es un pull request</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>contains(github.event.head_commit.message, '[skip-visual]')</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">El mensaje del commit contiene [skip-visual]</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>failure() && github.ref == 'refs/heads/main'</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Algo fallo Y estamos en main</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>github.actor != 'dependabot[bot]'</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">El autor no es Dependabot</td>
                </tr>
            </table>
        </div>

        <h3>Workflow completo de referencia</h3>
        <p>A continuacion, el workflow final que integra todas las tecnicas vistas en esta leccion.
        Puedes usarlo como punto de partida para tus proyectos:</p>

        <pre><code class="yaml"># .github/workflows/playwright.yml
name: Playwright E2E Tests

on:
  push:
    branches: [main, develop]
    paths-ignore: ["*.md", "docs/**"]
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: "0 11 * * 1-5"       # Lun-Vie 6:00 AM COT
  workflow_dispatch:
    inputs:
      browser:
        description: "Browser"
        default: "chromium"
        type: choice
        options: [chromium, firefox, webkit]

jobs:
  playwright-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Configurar Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"
          cache: "pip"

      - name: Instalar dependencias
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      # Cache de browsers
      - name: Obtener version de Playwright
        id: pw-version
        run: |
          echo "version=$(pip show playwright | grep Version | cut -d' ' -f2)" >> $GITHUB_OUTPUT

      - name: Cache de browsers
        uses: actions/cache@v4
        id: browser-cache
        with:
          path: ~/.cache/ms-playwright
          key: pw-\${{ steps.pw-version.outputs.version }}-\${{ runner.os }}

      - name: Instalar browsers
        if: steps.browser-cache.outputs.cache-hit != 'true'
        run: playwright install --with-deps chromium

      - name: Instalar deps de sistema
        if: steps.browser-cache.outputs.cache-hit == 'true'
        run: playwright install-deps chromium

      # Ejecutar tests
      - name: Tests funcionales
        env:
          CI: true
          TEST_BASE_URL: \${{ secrets.TEST_BASE_URL }}
          TEST_USERNAME: \${{ secrets.TEST_USERNAME }}
          TEST_PASSWORD: \${{ secrets.TEST_PASSWORD }}
        run: |
          pytest tests/ \\
            --browser chromium \\
            --output=test-results \\
            --screenshot=on \\
            --video=retain-on-failure \\
            --tracing=retain-on-failure \\
            --html=test-results/report.html \\
            --self-contained-html \\
            --junitxml=test-results/junit.xml \\
            -v --tb=short

      # Tests visuales solo en main
      - name: Tests de regresion visual
        if: github.ref == 'refs/heads/main'
        run: |
          pytest tests/visual/ \\
            --browser chromium \\
            --output=test-results/visual \\
            --screenshot=on \\
            -v

      # Artefactos
      - name: Subir reporte HTML
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: html-report
          path: test-results/report.html
          retention-days: 30

      - name: Subir evidencia de fallos
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: failure-evidence
          path: |
            test-results/**/screenshot*.png
            test-results/**/video*.webm
            test-results/**/trace.zip
          retention-days: 14

      - name: Subir JUnit XML
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: junit-results
          path: test-results/junit.xml
          retention-days: 14</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>Este workflow de referencia sigue las convenciones del equipo de QA de SIESA: un solo
            workflow principal para PRs y pushes (rapido, single-browser), tests visuales condicionales
            solo en main, y artefactos con retencion diferenciada. El cron nocturno se maneja en un
            workflow separado <code>cross-browser.yml</code> con matrix strategy completa.</p>
        </div>

        <h3>Ejercicio practico</h3>
        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Ejercicio: Crear un workflow GitHub Actions para Playwright</h4>
            <p>Crea un workflow completo para un proyecto de tests E2E con Playwright y Python
            que cumpla con los siguientes requisitos:</p>
            <ol>
                <li><strong>Triggers:</strong> Se ejecuta en push a main/develop, en PRs hacia main, y en un cron de lunes a viernes a las 7:00 AM hora Colombia</li>
                <li><strong>Cache:</strong> Implementa cache de pip y de browsers de Playwright</li>
                <li><strong>Tests:</strong> Ejecuta la suite funcional con Chromium, genera reporte HTML y JUnit XML</li>
                <li><strong>Condicional:</strong> Ejecuta tests visuales solo cuando el push es a main</li>
                <li><strong>Artefactos:</strong> Sube el reporte HTML siempre, y screenshots/traces solo en fallos</li>
                <li><strong>Secrets:</strong> Usa secrets para la URL base y credenciales de test</li>
            </ol>

            <pre><code class="yaml"># Tu solucion: .github/workflows/e2e-tests.yml
name: E2E Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    # 7:00 AM Colombia = 12:00 UTC
    - cron: "0 12 * * 1-5"

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 25

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Configurar Python 3.12
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"
          cache: "pip"

      - name: Instalar dependencias Python
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Obtener version de Playwright
        id: pw-ver
        run: |
          echo "version=$(pip show playwright | grep Version | cut -d' ' -f2)" >> $GITHUB_OUTPUT

      - name: Cache de Playwright browsers
        uses: actions/cache@v4
        id: pw-cache
        with:
          path: ~/.cache/ms-playwright
          key: pw-browsers-\${{ steps.pw-ver.outputs.version }}-\${{ runner.os }}

      - name: Instalar Chromium
        if: steps.pw-cache.outputs.cache-hit != 'true'
        run: playwright install --with-deps chromium

      - name: Instalar deps del sistema
        if: steps.pw-cache.outputs.cache-hit == 'true'
        run: playwright install-deps chromium

      - name: Ejecutar tests funcionales
        env:
          CI: true
          TEST_BASE_URL: \${{ secrets.TEST_BASE_URL }}
          TEST_USERNAME: \${{ secrets.TEST_USERNAME }}
          TEST_PASSWORD: \${{ secrets.TEST_PASSWORD }}
        run: |
          pytest tests/ \\
            --browser chromium \\
            --output=test-results \\
            --screenshot=on \\
            --video=retain-on-failure \\
            --tracing=retain-on-failure \\
            --html=test-results/report.html \\
            --self-contained-html \\
            --junitxml=test-results/junit.xml \\
            -v --tb=short

      - name: Tests de regresion visual (solo main)
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        run: |
          pytest tests/visual/ \\
            --browser chromium \\
            --output=test-results/visual \\
            -v

      - name: Subir reporte HTML
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: e2e-html-report
          path: test-results/report.html
          retention-days: 30

      - name: Subir evidencia de fallos
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: e2e-failure-evidence
          path: |
            test-results/**/screenshot*.png
            test-results/**/video*.webm
            test-results/**/trace.zip
          retention-days: 7</code></pre>

            <p><strong>Puntos de verificacion:</strong></p>
            <ul>
                <li>El cron usa hora UTC (12:00 = 7:00 AM COT)</li>
                <li>El cache de browsers usa la version de Playwright como clave</li>
                <li>Los tests visuales solo se ejecutan en push a main</li>
                <li>Los secrets nunca aparecen en el YAML como valores literales</li>
                <li>Los artefactos de fallos solo se suben cuando hay failures</li>
                <li>El reporte HTML se sube siempre con <code>if: always()</code></li>
            </ul>
        </div>

        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>En la siguiente leccion</strong> exploraras la integracion de Playwright con
            <strong>Jenkins y GitLab CI</strong>, dos de las plataformas de CI/CD mas utilizadas en
            entornos empresariales. Aprenderas a configurar Jenkinsfiles y archivos <code>.gitlab-ci.yml</code>
            optimizados para suites de Playwright con Python.</p>
        </div>
    `,
    topics: ["github-actions", "ci", "playwright"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_111 = LESSON_111;
}
