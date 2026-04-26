/**
 * Playwright Academy - Lección 109
 * Proyecto: Pipeline de reporting completo
 * Sección 16: Reporting y Trace Viewer
 */

const LESSON_109 = {
    id: 109,
    title: "Proyecto: Pipeline de reporting completo",
    duration: "12 min",
    level: "advanced",
    section: "section-16",
    content: `
        <h2>🚀 Proyecto: Pipeline de reporting completo</h2>
        <p>En este proyecto capstone de la <strong>Sección 16</strong> construirás un <strong>pipeline de reporting
        integral</strong> para un equipo de QA. Integrarás <strong>todas las técnicas</strong> aprendidas en esta
        sección: reportes HTML con pytest-html, Allure reports interactivos, Trace Viewer con recolección
        automática, métricas personalizadas, dashboards HTML con Jinja2, notificaciones a Slack y
        tracking histórico de tendencias. Todo orquestado en un <strong>flujo CI/CD con GitHub Actions</strong>.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎯 Objetivo del proyecto</h4>
            <p>Crear un sistema de reporting completo que un equipo de QA pueda usar en producción.
            El pipeline genera <strong>múltiples formatos de reporte</strong> (pytest-html, Allure, dashboard HTML),
            recolecta <strong>traces automáticamente en fallos</strong>, envía <strong>notificaciones a Slack</strong>
            cuando hay tests fallidos, y mantiene un <strong>historial de tendencias</strong> para detectar
            degradaciones de calidad a lo largo del tiempo.</p>
        </div>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🏢 Contexto SIESA</h4>
            <p>En SIESA, el equipo de QA ejecuta suites de regresión para los módulos web de HCM y ERP
            después de cada deploy a staging. El pipeline de reporting que construirás en esta lección
            es similar al que usa el equipo: <strong>reportes detallados para los testers</strong>,
            <strong>dashboards ejecutivos para los líderes</strong>, <strong>notificaciones automáticas</strong>
            al canal de Slack del equipo cuando algo falla, y <strong>tendencias históricas</strong>
            para medir la salud del proyecto sprint a sprint.</p>
        </div>

        <h3>🗂️ Paso 1: Estructura del proyecto</h3>
        <pre><code class="bash"># Crear la estructura completa del pipeline de reporting
mkdir -p reporting_pipeline/tests
mkdir -p reporting_pipeline/pages
mkdir -p reporting_pipeline/reporting
mkdir -p reporting_pipeline/reporting/templates
mkdir -p reporting_pipeline/reports/html
mkdir -p reporting_pipeline/reports/allure-results
mkdir -p reporting_pipeline/reports/allure-report
mkdir -p reporting_pipeline/reports/traces
mkdir -p reporting_pipeline/reports/dashboard
mkdir -p reporting_pipeline/reports/history
mkdir -p reporting_pipeline/test-results/screenshots

# Crear archivos base
touch reporting_pipeline/pytest.ini
touch reporting_pipeline/requirements.txt
touch reporting_pipeline/conftest.py

# Módulo de pages
touch reporting_pipeline/pages/__init__.py
touch reporting_pipeline/pages/login_page.py
touch reporting_pipeline/pages/dashboard_page.py

# Tests
touch reporting_pipeline/tests/__init__.py
touch reporting_pipeline/tests/test_login.py
touch reporting_pipeline/tests/test_dashboard.py
touch reporting_pipeline/tests/test_api_health.py

# Módulo de reporting
touch reporting_pipeline/reporting/__init__.py
touch reporting_pipeline/reporting/metrics_collector.py
touch reporting_pipeline/reporting/dashboard_generator.py
touch reporting_pipeline/reporting/slack_notifier.py
touch reporting_pipeline/reporting/history_tracker.py
touch reporting_pipeline/reporting/templates/dashboard.html

# CI/CD
touch reporting_pipeline/.github/workflows/test-and-report.yml</code></pre>

        <pre><code>reporting_pipeline/
├── pytest.ini                          # Configuración global de pytest
├── requirements.txt                    # Dependencias del proyecto
├── conftest.py                         # Fixtures, hooks, recolección de métricas
├── pages/
│   ├── __init__.py
│   ├── login_page.py                   # Page Object: login
│   └── dashboard_page.py              # Page Object: dashboard
├── tests/
│   ├── __init__.py
│   ├── test_login.py                   # Tests de autenticación
│   ├── test_dashboard.py              # Tests del dashboard
│   └── test_api_health.py            # Tests de health check API
├── reporting/
│   ├── __init__.py
│   ├── metrics_collector.py           # Recolector de métricas custom
│   ├── dashboard_generator.py         # Generador de dashboard HTML (Jinja2)
│   ├── slack_notifier.py             # Notificador a Slack vía webhook
│   ├── history_tracker.py            # Tracking histórico de runs
│   └── templates/
│       └── dashboard.html             # Template Jinja2 del dashboard
├── reports/
│   ├── html/                          # Reportes pytest-html
│   ├── allure-results/               # Raw data para Allure
│   ├── allure-report/                # Allure HTML generado
│   ├── traces/                        # Traces de Playwright (.zip)
│   ├── dashboard/                     # Dashboard HTML personalizado
│   └── history/                       # Historial de ejecuciones (JSON)
├── test-results/
│   └── screenshots/                   # Screenshots de fallos
└── .github/
    └── workflows/
        └── test-and-report.yml       # GitHub Actions pipeline</code></pre>

        <h3>⚙️ Paso 2: Configuración base</h3>
        <pre><code class="bash"># requirements.txt
playwright==1.49.0
pytest==8.3.4
pytest-playwright==0.5.2
pytest-html==4.1.1
allure-pytest==2.13.5
allure-python-commons==2.13.5
Jinja2==3.1.4
requests==2.32.3</code></pre>

        <pre><code class="ini"># pytest.ini
[pytest]
markers =
    smoke: Tests críticos de humo (rápidos)
    regression: Tests de regresión completa
    api: Tests de API/health check
    login: Tests de autenticación
    dashboard: Tests del dashboard
    flaky: Tests con comportamiento intermitente

addopts =
    --html=reports/html/report.html
    --self-contained-html
    --alluredir=reports/allure-results
    -v
    --tb=short

testpaths = tests
log_cli = true
log_cli_level = INFO
log_cli_format = %(asctime)s [%(levelname)s] %(name)s: %(message)s
log_cli_date_format = %H:%M:%S</code></pre>

        <h3>📊 Paso 3: pytest-html personalizado con screenshots embebidos</h3>
        <p>Extendemos pytest-html para incluir <strong>screenshots automáticos de fallos</strong>,
        información del entorno y estilos corporativos.</p>

        <div class="code-tabs" data-code-id="L109-1">
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
<pre><code class="language-python"># conftest.py — Parte 1: Configuración de pytest-html
"""
conftest.py — Pipeline de reporting completo.
Integra: pytest-html customizado, Allure, traces, métricas y notificaciones.
"""
import pytest
import json
import time
import logging
from pathlib import Path
from datetime import datetime
from playwright.sync_api import Page, BrowserContext, Browser

from reporting.metrics_collector import MetricsCollector
from reporting.slack_notifier import SlackNotifier
from reporting.history_tracker import HistoryTracker
from reporting.dashboard_generator import DashboardGenerator

logger = logging.getLogger("reporting_pipeline")

# --- Rutas ---
PROJECT_ROOT = Path(__file__).parent
REPORTS_DIR = PROJECT_ROOT / "reports"
SCREENSHOTS_DIR = PROJECT_ROOT / "test-results" / "screenshots"
TRACES_DIR = REPORTS_DIR / "traces"
HISTORY_DIR = REPORTS_DIR / "history"

# --- Instancias globales ---
metrics = MetricsCollector()
history = HistoryTracker(history_dir=str(HISTORY_DIR))


# =====================================================
# PYTEST-HTML: Personalización del reporte HTML
# =====================================================

def pytest_html_report_title(report):
    """Título personalizado del reporte HTML."""
    report.title = "QA Pipeline — Reporte de Ejecución"


def pytest_configure(config):
    """Agregar metadatos de entorno al reporte HTML."""
    config.stash[metadata_key] = {
        "Proyecto": "Portal Corporativo — QA Pipeline",
        "Entorno": config.getoption("--env", default="staging"),
        "Fecha": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "Python": "3.11",
        "Playwright": "1.49.0",
        "pytest": pytest.__version__,
        "Browser": "Chromium (headless)",
    }


# Key para almacenar metadata en config.stash
metadata_key = pytest.StashKey[dict]()


def pytest_html_results_summary(prefix, summary, postfix):
    """Agregar resumen personalizado al inicio del reporte."""
    prefix.extend([
        "<div style='background: #e3f2fd; padding: 12px; "
        "border-radius: 8px; margin: 10px 0;'>"
        "<strong>Pipeline de QA — Reporte Automático</strong><br>"
        "Este reporte fue generado por el pipeline de CI/CD. "
        "Los screenshots de fallos están embebidos inline."
        "</div>"
    ])


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """
    Hook para:
    1. Capturar screenshot en fallos y embeber en pytest-html.
    2. Registrar resultado en el MetricsCollector.
    3. Hacer disponible rep_call para otros fixtures.
    """
    outcome = yield
    report = outcome.get_result()

    # Hacer accesible desde fixtures
    setattr(item, f"rep_{report.when}", report)

    if report.when == "call":
        # --- Screenshot en fallos para pytest-html ---
        if report.failed:
            page = item.funcargs.get("page")
            if page:
                SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)
                screenshot_path = (
                    SCREENSHOTS_DIR / f"{item.name}_{int(time.time())}.png"
                )
                try:
                    page.screenshot(
                        path=str(screenshot_path), full_page=True
                    )
                    # Embeber screenshot en el reporte HTML
                    import base64
                    with open(screenshot_path, "rb") as f:
                        img_data = base64.b64encode(f.read()).decode()
                    extra = getattr(report, "extras", [])
                    extra.append(
                        pytest.html.extras.html(
                            f'<div style="text-align:center;">'
                            f'<img src="data:image/png;base64,{img_data}" '
                            f'style="max-width:800px; border:2px solid red;"'
                            f'/></div>'
                        )
                    )
                    report.extras = extra
                    logger.error(f"Screenshot: {screenshot_path}")
                except Exception as e:
                    logger.warning(f"No se pudo capturar screenshot: {e}")

        # --- Registrar métrica ---
        duration = report.duration
        if report.passed:
            metrics.record_pass(item.name, duration)
        elif report.failed:
            metrics.record_fail(item.name, duration, str(report.longrepr))
        elif report.skipped:
            metrics.record_skip(item.name, report.longrepr[2])</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// playwright.config.ts — Parte 1: Configuración del reporter custom
// Pipeline de reporting completo.
// Integra: reporter HTML custom, traces, métricas y notificaciones.
import {
  test, expect, Page, Browser, BrowserContext,
  type FullConfig, type FullResult, type Reporter,
  type Suite, type TestCase, type TestResult
} from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

import { MetricsCollector } from './reporting/metrics-collector';
import { SlackNotifier } from './reporting/slack-notifier';
import { HistoryTracker } from './reporting/history-tracker';
import { DashboardGenerator } from './reporting/dashboard-generator';

// --- Rutas ---
const PROJECT_ROOT = path.resolve(__dirname);
const REPORTS_DIR = path.join(PROJECT_ROOT, 'reports');
const SCREENSHOTS_DIR = path.join(PROJECT_ROOT, 'test-results', 'screenshots');
const TRACES_DIR = path.join(REPORTS_DIR, 'traces');
const HISTORY_DIR = path.join(REPORTS_DIR, 'history');

// --- Instancias globales ---
const metrics = new MetricsCollector();
const history = new HistoryTracker(HISTORY_DIR);


// =====================================================
// REPORTER CUSTOM: Personalización del reporte HTML
// =====================================================

class QAPipelineReporter implements Reporter {
  /**
   * Reporter personalizado que:
   * 1. Captura screenshots en fallos y los embebe en el reporte.
   * 2. Registra resultados en el MetricsCollector.
   * 3. Genera dashboard y envía notificaciones al finalizar.
   */

  onBegin(config: FullConfig, suite: Suite): void {
    console.log(\`QA Pipeline — Iniciando ejecución de \${suite.allTests().length} tests\`);
  }

  async onTestEnd(test: TestCase, result: TestResult): Promise&lt;void&gt; {
    const duration = result.duration / 1000; // ms a segundos

    if (result.status === 'passed') {
      metrics.recordPass(test.title, duration);
    } else if (result.status === 'failed') {
      // --- Screenshot en fallos ---
      if (!fs.existsSync(SCREENSHOTS_DIR)) {
        fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
      }
      const screenshotPath = path.join(
        SCREENSHOTS_DIR,
        \`\${test.title.replace(/\\s+/g, '_')}_\${Date.now()}.png\`
      );

      // Los screenshots se adjuntan automáticamente via attachments
      for (const attachment of result.attachments) {
        if (attachment.contentType === 'image/png' && attachment.body) {
          fs.writeFileSync(screenshotPath, attachment.body);
          console.error(\`Screenshot: \${screenshotPath}\`);
        }
      }

      const errorMsg = result.error?.message ?? '';
      metrics.recordFail(test.title, duration, errorMsg);
    } else if (result.status === 'skipped') {
      metrics.recordSkip(test.title, 'Test omitido');
    }
  }

  async onEnd(result: FullResult): Promise&lt;void&gt; {
    // El resumen y notificaciones se manejan en onEnd (ver Parte 3)
  }
}

export default QAPipelineReporter;</code></pre>
</div>
</div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Consejo SIESA</h4>
            <p>El hook <code>pytest_runtest_makereport</code> es el punto central donde se conectan todos
            los componentes del pipeline. Cada resultado pasa por este hook, y desde ahí alimentamos
            el reporte HTML (con screenshot embebido), el colector de métricas y los datos para Allure.
            En SIESA, este patrón de "single hook, multiple outputs" facilita el mantenimiento:
            si necesitas agregar un nuevo destino de reporting, solo agregas lógica aquí.</p>
        </div>

        <h3>🎯 Paso 4: Allure reports con features, stories y steps</h3>
        <p>Integramos Allure para generar reportes interactivos con <strong>jerarquía de features</strong>,
        <strong>severity markers</strong> y <strong>adjuntos automáticos</strong>.</p>

        <div class="code-tabs" data-code-id="L109-2">
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
<pre><code class="language-python"># tests/test_login.py
"""
Tests de autenticación con decoradores Allure completos.
Demuestra: @allure.feature, @allure.story, @allure.step,
@allure.severity, allure.attach.
"""
import allure
import pytest
from playwright.sync_api import Page, expect


@allure.feature("Autenticación")
@allure.suite("Login")
class TestLogin:
    """Suite de tests de login con reporting Allure completo."""

    @allure.story("Login exitoso")
    @allure.severity(allure.severity_level.CRITICAL)
    @allure.title("Login con credenciales válidas")
    @allure.description(
        "Verifica que un usuario válido puede autenticarse "
        "y es redirigido al dashboard."
    )
    @pytest.mark.smoke
    @pytest.mark.login
    def test_login_valido(self, page: Page):
        """Login exitoso con credenciales correctas."""
        with allure.step("Navegar a la página de login"):
            page.goto("/login")
            allure.attach(
                page.screenshot(),
                name="01-pagina-login",
                attachment_type=allure.attachment_type.PNG,
            )

        with allure.step("Ingresar credenciales válidas"):
            page.get_by_label("Username").fill("tomsmith")
            page.get_by_label("Password").fill("SuperSecretPassword!")

        with allure.step("Hacer clic en Login"):
            page.get_by_role("button", name="Login").click()

        with allure.step("Verificar redirección al área segura"):
            expect(page).to_have_url("**/secure")
            expect(page.get_by_text("You logged into")).to_be_visible()
            allure.attach(
                page.screenshot(),
                name="02-login-exitoso",
                attachment_type=allure.attachment_type.PNG,
            )

    @allure.story("Login fallido")
    @allure.severity(allure.severity_level.NORMAL)
    @allure.title("Login con credenciales inválidas")
    @pytest.mark.login
    def test_login_invalido(self, page: Page):
        """Login fallido muestra mensaje de error."""
        with allure.step("Navegar a login e ingresar credenciales inválidas"):
            page.goto("/login")
            page.get_by_label("Username").fill("usuario_falso")
            page.get_by_label("Password").fill("clave_erronea")
            page.get_by_role("button", name="Login").click()

        with allure.step("Verificar mensaje de error"):
            error = page.locator("#flash")
            expect(error).to_be_visible()
            expect(error).to_contain_text("Your username is invalid!")
            allure.attach(
                page.screenshot(),
                name="login-error",
                attachment_type=allure.attachment_type.PNG,
            )

    @allure.story("Login fallido")
    @allure.severity(allure.severity_level.NORMAL)
    @allure.title("Login con campos vacíos")
    @pytest.mark.login
    def test_login_campos_vacios(self, page: Page):
        """Login sin datos muestra error."""
        with allure.step("Intentar login sin completar campos"):
            page.goto("/login")
            page.get_by_role("button", name="Login").click()

        with allure.step("Verificar que se muestra error"):
            error = page.locator("#flash")
            expect(error).to_be_visible()

    @allure.story("Logout")
    @allure.severity(allure.severity_level.CRITICAL)
    @allure.title("Logout después de login exitoso")
    @pytest.mark.smoke
    @pytest.mark.login
    def test_logout(self, page: Page):
        """Logout redirige al login con mensaje de confirmación."""
        with allure.step("Login"):
            page.goto("/login")
            page.get_by_label("Username").fill("tomsmith")
            page.get_by_label("Password").fill("SuperSecretPassword!")
            page.get_by_role("button", name="Login").click()
            expect(page).to_have_url("**/secure")

        with allure.step("Ejecutar logout"):
            page.get_by_role("link", name="Logout").click()

        with allure.step("Verificar redirección a login"):
            expect(page).to_have_url("**/login")
            expect(page.locator("#flash")).to_contain_text(
                "You logged out"
            )</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// tests/login.spec.ts
// Tests de autenticación con steps y annotations de Playwright.
// Equivalente a Allure: test.describe (feature/story), test.step,
// test.info().annotations, test.info().attach.
import { test, expect, type Page } from '@playwright/test';

test.describe('Autenticación > Login', () => {
  // Suite de tests de login con reporting Playwright completo

  test('Login con credenciales válidas @smoke @critical', async ({ page }) => {
    // Login exitoso con credenciales correctas
    test.info().annotations.push(
      { type: 'feature', description: 'Autenticación' },
      { type: 'story', description: 'Login exitoso' },
      { type: 'severity', description: 'critical' }
    );

    await test.step('Navegar a la página de login', async () => {
      await page.goto('/login');
      const screenshot = await page.screenshot();
      await test.info().attach('01-pagina-login', {
        body: screenshot,
        contentType: 'image/png',
      });
    });

    await test.step('Ingresar credenciales válidas', async () => {
      await page.getByLabel('Username').fill('tomsmith');
      await page.getByLabel('Password').fill('SuperSecretPassword!');
    });

    await test.step('Hacer clic en Login', async () => {
      await page.getByRole('button', { name: 'Login' }).click();
    });

    await test.step('Verificar redirección al área segura', async () => {
      await expect(page).toHaveURL(/\\/secure/);
      await expect(page.getByText('You logged into')).toBeVisible();
      const screenshot = await page.screenshot();
      await test.info().attach('02-login-exitoso', {
        body: screenshot,
        contentType: 'image/png',
      });
    });
  });

  test('Login con credenciales inválidas', async ({ page }) => {
    // Login fallido muestra mensaje de error
    test.info().annotations.push(
      { type: 'story', description: 'Login fallido' },
      { type: 'severity', description: 'normal' }
    );

    await test.step('Navegar a login e ingresar credenciales inválidas', async () => {
      await page.goto('/login');
      await page.getByLabel('Username').fill('usuario_falso');
      await page.getByLabel('Password').fill('clave_erronea');
      await page.getByRole('button', { name: 'Login' }).click();
    });

    await test.step('Verificar mensaje de error', async () => {
      const error = page.locator('#flash');
      await expect(error).toBeVisible();
      await expect(error).toContainText('Your username is invalid!');
      const screenshot = await page.screenshot();
      await test.info().attach('login-error', {
        body: screenshot,
        contentType: 'image/png',
      });
    });
  });

  test('Login con campos vacíos', async ({ page }) => {
    // Login sin datos muestra error
    test.info().annotations.push(
      { type: 'story', description: 'Login fallido' },
      { type: 'severity', description: 'normal' }
    );

    await test.step('Intentar login sin completar campos', async () => {
      await page.goto('/login');
      await page.getByRole('button', { name: 'Login' }).click();
    });

    await test.step('Verificar que se muestra error', async () => {
      const error = page.locator('#flash');
      await expect(error).toBeVisible();
    });
  });

  test('Logout después de login exitoso @smoke @critical', async ({ page }) => {
    // Logout redirige al login con mensaje de confirmación
    test.info().annotations.push(
      { type: 'story', description: 'Logout' },
      { type: 'severity', description: 'critical' }
    );

    await test.step('Login', async () => {
      await page.goto('/login');
      await page.getByLabel('Username').fill('tomsmith');
      await page.getByLabel('Password').fill('SuperSecretPassword!');
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page).toHaveURL(/\\/secure/);
    });

    await test.step('Ejecutar logout', async () => {
      await page.getByRole('link', { name: 'Logout' }).click();
    });

    await test.step('Verificar redirección a login', async () => {
      await expect(page).toHaveURL(/\\/login/);
      await expect(page.locator('#flash')).toContainText('You logged out');
    });
  });
});</code></pre>
</div>
</div>

        <pre><code class="bash"># Generar reportes Allure
pytest tests/ --alluredir=reports/allure-results --clean-alluredir

# Generar el HTML de Allure (requiere allure CLI)
allure generate reports/allure-results -o reports/allure-report --clean

# Abrir el reporte en el navegador
allure open reports/allure-report

# Alternativa: servir directamente sin generar
allure serve reports/allure-results</code></pre>

        <h3>🔍 Paso 5: Recolección automática de traces en fallos</h3>
        <p>Configuramos Playwright para <strong>capturar traces solo cuando un test falla</strong>,
        organizándolos en una estructura limpia con timestamps.</p>

        <div class="code-tabs" data-code-id="L109-3">
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
<pre><code class="language-python"># conftest.py — Parte 2: Trace collection automático
# =====================================================
# TRACES: Recolección automática en fallos
# =====================================================

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    """Configurar el contexto del browser con base URL y viewport."""
    return {
        **browser_context_args,
        "base_url": "https://the-internet.herokuapp.com",
        "viewport": {"width": 1280, "height": 720},
        "ignore_https_errors": True,
    }


@pytest.fixture
def context_with_tracing(browser: Browser, browser_context_args):
    """
    Contexto con tracing habilitado.
    El trace se guarda SOLO si el test falla.
    """
    context = browser.new_context(**browser_context_args)

    # Iniciar tracing con screenshots y snapshots
    context.tracing.start(
        screenshots=True,
        snapshots=True,
        sources=True,
    )

    yield context

    # El trace se guarda en el fixture 'save_trace_on_failure'
    context.close()


@pytest.fixture
def page_with_tracing(context_with_tracing) -> Page:
    """Page con tracing habilitado."""
    page = context_with_tracing.new_page()
    yield page
    page.close()


@pytest.fixture(autouse=True)
def save_trace_on_failure(request, context_with_tracing):
    """
    Guarda el trace automáticamente cuando un test falla.
    Organiza los traces por fecha y nombre de test.
    """
    yield

    # Verificar si el test falló
    if hasattr(request.node, "rep_call") and request.node.rep_call.failed:
        TRACES_DIR.mkdir(parents=True, exist_ok=True)

        # Nombre organizado: fecha/test_name.zip
        fecha = datetime.now().strftime("%Y-%m-%d")
        trace_dir = TRACES_DIR / fecha
        trace_dir.mkdir(parents=True, exist_ok=True)

        test_name = request.node.name.replace("[", "_").replace("]", "")
        trace_path = trace_dir / f"{test_name}.zip"

        try:
            context_with_tracing.tracing.stop(path=str(trace_path))
            logger.info(f"Trace guardado: {trace_path}")

            # Adjuntar trace al reporte Allure
            try:
                import allure
                allure.attach.file(
                    str(trace_path),
                    name=f"trace-{test_name}",
                    attachment_type=allure.attachment_type.ZIP,
                )
            except ImportError:
                pass

        except Exception as e:
            logger.warning(f"Error guardando trace: {e}")
    else:
        # Si pasó, descartar el trace (no guardar)
        try:
            context_with_tracing.tracing.stop()
        except Exception:
            pass</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// playwright.config.ts — Parte 2: Trace collection automático
// =====================================================
// TRACES: Recolección automática en fallos via config
// =====================================================
import { defineConfig, devices } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const TRACES_DIR = path.join(__dirname, 'reports', 'traces');

export default defineConfig({
  // Configurar base URL y viewport globalmente
  use: {
    baseURL: 'https://the-internet.herokuapp.com',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,

    // Trace automático: solo en primer reintento tras fallo
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Reporter custom + HTML built-in
  reporter: [
    ['html', { open: 'never', outputFolder: 'reports/html' }],
    ['./reporting/qa-pipeline-reporter.ts'],
  ],
});


// --- Fixture para organizar traces por fecha ---
// fixtures/trace-organizer.ts
import { test as base, type TestInfo } from '@playwright/test';

export const test = base.extend({
  // afterEach automático: mover traces a carpetas por fecha
  // eslint-disable-next-line no-empty-pattern
  saveTraceOnFailure: [async ({}, use, testInfo: TestInfo) => {
    await use();

    // Si el test falló y hay attachments de trace
    if (testInfo.status === 'failed') {
      const fecha = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const traceDir = path.join(TRACES_DIR, fecha);
      if (!fs.existsSync(traceDir)) {
        fs.mkdirSync(traceDir, { recursive: true });
      }

      const testName = testInfo.title
        .replace(/\\[/g, '_')
        .replace(/\\]/g, '')
        .replace(/\\s+/g, '_');

      // Copiar trace a carpeta organizada por fecha
      for (const attachment of testInfo.attachments) {
        if (attachment.name === 'trace' && attachment.path) {
          const destPath = path.join(traceDir, \`\${testName}.zip\`);
          try {
            fs.copyFileSync(attachment.path, destPath);
            console.log(\`Trace guardado: \${destPath}\`);

            // Adjuntar trace al reporte de Playwright
            await testInfo.attach(\`trace-\${testName}\`, {
              path: destPath,
              contentType: 'application/zip',
            });
          } catch (e) {
            console.warn(\`Error guardando trace: \${e}\`);
          }
        }
      }
    }
  }, { auto: true }],
});</code></pre>
</div>
</div>

        <pre><code class="bash"># Ver un trace guardado con Trace Viewer
playwright show-trace reports/traces/2024-12-15/test_login_valido.zip

# Listar todos los traces de hoy
ls -la reports/traces/$(date +%Y-%m-%d)/

# Limpiar traces de más de 7 días
find reports/traces/ -type f -name "*.zip" -mtime +7 -delete</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip: Organización de traces</h4>
            <p>Los traces se organizan en subcarpetas por fecha (<code>2024-12-15/</code>).
            Esto facilita la limpieza automática en CI: puedes borrar carpetas anteriores a cierta
            fecha sin afectar los traces recientes. En SIESA usamos retención de 7 días en CI
            y 30 días en el servidor de artefactos.</p>
        </div>

        <h3>📈 Paso 6: MetricsCollector — Recolección de métricas custom</h3>
        <p>Clase que recolecta métricas detalladas de cada ejecución: pass/fail/skip, duración,
        tests flaky, y mensajes de error para análisis posterior.</p>

        <div class="code-tabs" data-code-id="L109-4">
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
<pre><code class="language-python"># reporting/metrics_collector.py
"""
MetricsCollector — Recolecta métricas de ejecución de tests.
Se alimenta desde conftest.py via hooks de pytest.
"""
import json
import time
from pathlib import Path
from datetime import datetime
from dataclasses import dataclass, field, asdict


@dataclass
class TestResult:
    """Resultado individual de un test."""
    name: str
    status: str            # "passed", "failed", "skipped"
    duration: float        # Duración en segundos
    error_message: str = ""
    timestamp: str = ""
    retry_count: int = 0

    def __post_init__(self):
        if not self.timestamp:
            self.timestamp = datetime.now().isoformat()


class MetricsCollector:
    """
    Recolector de métricas que acumula resultados durante la ejecución
    y genera un resumen al finalizar.

    Uso en conftest.py:
        metrics = MetricsCollector()
        metrics.record_pass("test_login", 1.23)
        metrics.record_fail("test_api", 0.45, "AssertionError: ...")
        summary = metrics.get_summary()
    """

    def __init__(self):
        self.results: list[TestResult] = []
        self.start_time: float = time.time()
        self.flaky_tests: dict[str, int] = {}  # test_name -> retry_count

    def record_pass(self, name: str, duration: float):
        """Registrar un test que pasó."""
        self.results.append(
            TestResult(name=name, status="passed", duration=duration)
        )

    def record_fail(
        self, name: str, duration: float, error: str = ""
    ):
        """Registrar un test que falló."""
        self.results.append(
            TestResult(
                name=name,
                status="failed",
                duration=duration,
                error_message=error[:500],  # Truncar errores largos
            )
        )

    def record_skip(self, name: str, reason: str = ""):
        """Registrar un test que fue omitido."""
        self.results.append(
            TestResult(
                name=name,
                status="skipped",
                duration=0.0,
                error_message=reason,
            )
        )

    def record_flaky(self, name: str, retries: int):
        """Registrar un test como flaky (pasó después de reintentos)."""
        self.flaky_tests[name] = retries

    def get_summary(self) -> dict:
        """
        Generar resumen completo de la ejecución.

        Returns:
            dict con total, passed, failed, skipped, duration,
            pass_rate, flaky_tests, slowest_tests, failures.
        """
        total_duration = time.time() - self.start_time
        passed = [r for r in self.results if r.status == "passed"]
        failed = [r for r in self.results if r.status == "failed"]
        skipped = [r for r in self.results if r.status == "skipped"]

        # Top 5 tests más lentos
        sorted_by_duration = sorted(
            self.results, key=lambda r: r.duration, reverse=True
        )
        slowest = [
            {"name": r.name, "duration": round(r.duration, 3)}
            for r in sorted_by_duration[:5]
        ]

        # Detalle de failures
        failures = [
            {
                "name": r.name,
                "error": r.error_message,
                "duration": round(r.duration, 3),
            }
            for r in failed
        ]

        total = len(self.results)
        pass_rate = (
            round(len(passed) / total * 100, 1) if total > 0 else 0.0
        )

        return {
            "timestamp": datetime.now().isoformat(),
            "total_duration": round(total_duration, 2),
            "total": total,
            "passed": len(passed),
            "failed": len(failed),
            "skipped": len(skipped),
            "pass_rate": pass_rate,
            "flaky_tests": self.flaky_tests,
            "flaky_count": len(self.flaky_tests),
            "slowest_tests": slowest,
            "failures": failures,
            "avg_duration": round(
                sum(r.duration for r in self.results) / total, 3
            ) if total > 0 else 0.0,
        }

    def save_to_json(self, output_path: str):
        """Guardar métricas en archivo JSON."""
        path = Path(output_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        summary = self.get_summary()
        with open(path, "w", encoding="utf-8") as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)
        return str(path)</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// reporting/metrics-collector.ts
// MetricsCollector — Recolecta métricas de ejecución de tests.
// Se alimenta desde el reporter custom de Playwright.
import * as fs from 'fs';
import * as path from 'path';

interface TestResult {
  /** Resultado individual de un test. */
  name: string;
  status: 'passed' | 'failed' | 'skipped';  // Estado del test
  duration: number;                           // Duración en segundos
  errorMessage: string;
  timestamp: string;
  retryCount: number;
}

function createTestResult(
  name: string,
  status: 'passed' | 'failed' | 'skipped',
  duration: number,
  errorMessage = '',
  retryCount = 0
): TestResult {
  return {
    name,
    status,
    duration,
    errorMessage,
    timestamp: new Date().toISOString(),
    retryCount,
  };
}

export class MetricsCollector {
  /**
   * Recolector de métricas que acumula resultados durante la ejecución
   * y genera un resumen al finalizar.
   *
   * Uso en el reporter:
   *   const metrics = new MetricsCollector();
   *   metrics.recordPass('test_login', 1.23);
   *   metrics.recordFail('test_api', 0.45, 'AssertionError: ...');
   *   const summary = metrics.getSummary();
   */

  private results: TestResult[] = [];
  private startTime: number = Date.now();
  private flakyTests: Record&lt;string, number&gt; = {};  // testName -> retryCount

  recordPass(name: string, duration: number): void {
    /** Registrar un test que pasó. */
    this.results.push(
      createTestResult(name, 'passed', duration)
    );
  }

  recordFail(name: string, duration: number, error = ''): void {
    /** Registrar un test que falló. */
    this.results.push(
      createTestResult(name, 'failed', duration, error.slice(0, 500))
    );
  }

  recordSkip(name: string, reason = ''): void {
    /** Registrar un test que fue omitido. */
    this.results.push(
      createTestResult(name, 'skipped', 0.0, reason)
    );
  }

  recordFlaky(name: string, retries: number): void {
    /** Registrar un test como flaky (pasó después de reintentos). */
    this.flakyTests[name] = retries;
  }

  getSummary(): Record&lt;string, unknown&gt; {
    /**
     * Generar resumen completo de la ejecución.
     * Retorna: objeto con total, passed, failed, skipped, duration,
     * passRate, flakyTests, slowestTests, failures.
     */
    const totalDuration = (Date.now() - this.startTime) / 1000;
    const passed = this.results.filter(r =&gt; r.status === 'passed');
    const failed = this.results.filter(r =&gt; r.status === 'failed');
    const skipped = this.results.filter(r =&gt; r.status === 'skipped');

    // Top 5 tests más lentos
    const sortedByDuration = [...this.results]
      .sort((a, b) =&gt; b.duration - a.duration);
    const slowest = sortedByDuration.slice(0, 5).map(r =&gt; ({
      name: r.name,
      duration: Math.round(r.duration * 1000) / 1000,
    }));

    // Detalle de failures
    const failures = failed.map(r =&gt; ({
      name: r.name,
      error: r.errorMessage,
      duration: Math.round(r.duration * 1000) / 1000,
    }));

    const total = this.results.length;
    const passRate = total &gt; 0
      ? Math.round((passed.length / total) * 1000) / 10
      : 0.0;

    const avgDuration = total &gt; 0
      ? Math.round(
          (this.results.reduce((sum, r) =&gt; sum + r.duration, 0) / total)
          * 1000
        ) / 1000
      : 0.0;

    return {
      timestamp: new Date().toISOString(),
      total_duration: Math.round(totalDuration * 100) / 100,
      total,
      passed: passed.length,
      failed: failed.length,
      skipped: skipped.length,
      pass_rate: passRate,
      flaky_tests: this.flakyTests,
      flaky_count: Object.keys(this.flakyTests).length,
      slowest_tests: slowest,
      failures,
      avg_duration: avgDuration,
    };
  }

  saveToJson(outputPath: string): string {
    /** Guardar métricas en archivo JSON. */
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const summary = this.getSummary();
    fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2), 'utf-8');
    return outputPath;
  }
}</code></pre>
</div>
</div>

        <h3>🖥️ Paso 7: Dashboard HTML con Jinja2</h3>
        <p>Generador de dashboard ejecutivo con <strong>tarjetas de resumen</strong>,
        <strong>tabla de failures</strong>, <strong>gráfico de tendencias</strong> y
        <strong>análisis de tests flaky</strong>.</p>

        <div class="code-tabs" data-code-id="L109-5">
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
<pre><code class="language-python"># reporting/dashboard_generator.py
"""
DashboardGenerator — Genera un dashboard HTML con Jinja2.
Incluye summary cards, failure analysis, tendencias y flaky tests.
"""
import json
from pathlib import Path
from datetime import datetime
from jinja2 import Environment, FileSystemLoader, select_autoescape


class DashboardGenerator:
    """
    Genera un dashboard HTML rico a partir de las métricas
    recolectadas por MetricsCollector.

    Uso:
        generator = DashboardGenerator(template_dir="reporting/templates")
        html = generator.generate(metrics_summary, history_data)
        generator.save(html, "reports/dashboard/index.html")
    """

    def __init__(self, template_dir: str = "reporting/templates"):
        self.template_dir = Path(template_dir)
        self.env = Environment(
            loader=FileSystemLoader(str(self.template_dir)),
            autoescape=select_autoescape(["html"]),
        )

    def generate(
        self, summary: dict, history: list = None
    ) -> str:
        """
        Genera el HTML del dashboard.

        Args:
            summary: Diccionario de métricas (de MetricsCollector.get_summary())
            history: Lista de ejecuciones anteriores (de HistoryTracker)

        Returns:
            String con el HTML completo del dashboard.
        """
        template = self.env.get_template("dashboard.html")

        # Preparar datos para los gráficos
        trend_data = self._prepare_trend_data(history or [])

        return template.render(
            summary=summary,
            history=history or [],
            trend_data=trend_data,
            generated_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        )

    def _prepare_trend_data(self, history: list) -> dict:
        """Preparar datos de tendencia para gráficos."""
        # Últimas 10 ejecuciones para el gráfico
        recent = history[-10:] if len(history) > 10 else history

        return {
            "labels": [
                h.get("timestamp", "")[:10] for h in recent
            ],
            "pass_rates": [
                h.get("pass_rate", 0) for h in recent
            ],
            "totals": [
                h.get("total", 0) for h in recent
            ],
            "failures": [
                h.get("failed", 0) for h in recent
            ],
            "durations": [
                h.get("total_duration", 0) for h in recent
            ],
        }

    def save(self, html: str, output_path: str) -> str:
        """Guardar el dashboard HTML en disco."""
        path = Path(output_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            f.write(html)
        return str(path)</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// reporting/dashboard-generator.ts
// DashboardGenerator — Genera un dashboard HTML con template literals.
// Incluye summary cards, failure analysis, tendencias y flaky tests.
import * as fs from 'fs';
import * as path from 'path';

interface TrendData {
  labels: string[];
  passRates: number[];
  totals: number[];
  failures: number[];
  durations: number[];
}

export class DashboardGenerator {
  /**
   * Genera un dashboard HTML rico a partir de las métricas
   * recolectadas por MetricsCollector.
   *
   * Uso:
   *   const generator = new DashboardGenerator('reporting/templates');
   *   const html = generator.generate(metricsSummary, historyData);
   *   generator.save(html, 'reports/dashboard/index.html');
   */

  private templateDir: string;

  constructor(templateDir = 'reporting/templates') {
    this.templateDir = templateDir;
  }

  generate(
    summary: Record&lt;string, unknown&gt;,
    history: Record&lt;string, unknown&gt;[] = []
  ): string {
    /**
     * Genera el HTML del dashboard.
     * @param summary - Diccionario de métricas (de MetricsCollector.getSummary())
     * @param history - Lista de ejecuciones anteriores (de HistoryTracker)
     * @returns String con el HTML completo del dashboard.
     */
    const templatePath = path.join(this.templateDir, 'dashboard.html');

    // Si existe el template en disco, leerlo; si no, usar inline
    if (fs.existsSync(templatePath)) {
      const template = fs.readFileSync(templatePath, 'utf-8');
      const trendData = this.prepareTrendData(history);
      const generatedAt = new Date().toLocaleString('es-CO');
      // Reemplazar placeholders Jinja2-style con valores reales
      return this.renderTemplate(template, summary, trendData, generatedAt);
    }

    // Fallback: generar HTML inline con template literals
    const trendData = this.prepareTrendData(history);
    const generatedAt = new Date().toLocaleString('es-CO');
    return this.generateInlineHtml(summary, trendData, generatedAt);
  }

  private prepareTrendData(
    history: Record&lt;string, unknown&gt;[]
  ): TrendData {
    /** Preparar datos de tendencia para gráficos. */
    // Últimas 10 ejecuciones para el gráfico
    const recent = history.length &gt; 10
      ? history.slice(-10)
      : history;

    return {
      labels: recent.map(
        h =&gt; String(h.timestamp ?? '').slice(0, 10)
      ),
      passRates: recent.map(
        h =&gt; Number(h.pass_rate ?? 0)
      ),
      totals: recent.map(
        h =&gt; Number(h.total ?? 0)
      ),
      failures: recent.map(
        h =&gt; Number(h.failed ?? 0)
      ),
      durations: recent.map(
        h =&gt; Number(h.total_duration ?? 0)
      ),
    };
  }

  private renderTemplate(
    template: string,
    summary: Record&lt;string, unknown&gt;,
    trendData: TrendData,
    generatedAt: string
  ): string {
    /** Reemplazar placeholders básicos en el template HTML. */
    let html = template;
    // Reemplazos simples de variables Jinja2
    html = html.replace(/\\{\\{\\s*generated_at\\s*\\}\\}/g, generatedAt);
    html = html.replace(/\\{\\{\\s*summary\\.total\\s*\\}\\}/g, String(summary.total));
    html = html.replace(/\\{\\{\\s*summary\\.passed\\s*\\}\\}/g, String(summary.passed));
    html = html.replace(/\\{\\{\\s*summary\\.failed\\s*\\}\\}/g, String(summary.failed));
    html = html.replace(/\\{\\{\\s*summary\\.skipped\\s*\\}\\}/g, String(summary.skipped));
    html = html.replace(/\\{\\{\\s*summary\\.pass_rate\\s*\\}\\}/g, String(summary.pass_rate));
    html = html.replace(/\\{\\{\\s*summary\\.total_duration\\s*\\}\\}/g, String(summary.total_duration));
    html = html.replace(/\\{\\{\\s*summary\\.flaky_count\\s*\\}\\}/g, String(summary.flaky_count));
    return html;
  }

  private generateInlineHtml(
    summary: Record&lt;string, unknown&gt;,
    trendData: TrendData,
    generatedAt: string
  ): string {
    /** Generar HTML inline como fallback. */
    return \`&lt;!DOCTYPE html&gt;&lt;html&gt;&lt;head&gt;
      &lt;title&gt;QA Dashboard&lt;/title&gt;
    &lt;/head&gt;&lt;body&gt;
      &lt;h1&gt;QA Dashboard — \${generatedAt}&lt;/h1&gt;
      &lt;p&gt;Total: \${summary.total} | Passed: \${summary.passed}
      | Failed: \${summary.failed} | Rate: \${summary.pass_rate}%&lt;/p&gt;
    &lt;/body&gt;&lt;/html&gt;\`;
  }

  save(html: string, outputPath: string): string {
    /** Guardar el dashboard HTML en disco. */
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outputPath, html, 'utf-8');
    return outputPath;
  }
}</code></pre>
</div>
</div>

        <pre><code class="html">&lt;!-- reporting/templates/dashboard.html --&gt;
&lt;!DOCTYPE html&gt;
&lt;html lang="es"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;QA Dashboard — Pipeline de Reporting&lt;/title&gt;
    &lt;style&gt;
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, sans-serif;
            background: #f5f5f5; color: #333; padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #1a237e, #283593);
            color: white; padding: 24px; border-radius: 12px;
            margin-bottom: 20px;
        }
        .header h1 { font-size: 1.8em; }
        .header .subtitle { opacity: 0.85; margin-top: 4px; }
        .cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px; margin-bottom: 24px;
        }
        .card {
            background: white; padding: 20px; border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            text-align: center;
        }
        .card .value {
            font-size: 2.2em; font-weight: bold; margin: 8px 0;
        }
        .card .label { color: #757575; font-size: 0.9em; }
        .card-pass { border-top: 4px solid #4caf50; }
        .card-pass .value { color: #2e7d32; }
        .card-fail { border-top: 4px solid #f44336; }
        .card-fail .value { color: #c62828; }
        .card-skip { border-top: 4px solid #ff9800; }
        .card-skip .value { color: #e65100; }
        .card-rate { border-top: 4px solid #2196f3; }
        .card-rate .value { color: #1565c0; }
        .card-time { border-top: 4px solid #9c27b0; }
        .card-time .value { color: #6a1b9a; }
        .card-flaky { border-top: 4px solid #ff5722; }
        .card-flaky .value { color: #d84315; }
        .section {
            background: white; padding: 20px; border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        .section h2 { margin-bottom: 16px; color: #1a237e; }
        table {
            width: 100%; border-collapse: collapse; margin: 12px 0;
        }
        th {
            background: #37474f; color: white;
            padding: 10px 12px; text-align: left;
        }
        td { padding: 8px 12px; border-bottom: 1px solid #e0e0e0; }
        tr:nth-child(even) { background: #fafafa; }
        .status-pass { color: #2e7d32; font-weight: bold; }
        .status-fail { color: #c62828; font-weight: bold; }
        .chart-container {
            width: 100%; height: 250px; position: relative;
            margin: 16px 0;
        }
        .bar-chart {
            display: flex; align-items: flex-end; gap: 8px;
            height: 200px; padding: 0 20px;
            border-bottom: 2px solid #ccc;
        }
        .bar-group {
            flex: 1; display: flex; flex-direction: column;
            align-items: center;
        }
        .bar {
            width: 30px; border-radius: 4px 4px 0 0;
            transition: height 0.3s;
        }
        .bar-pass { background: #4caf50; }
        .bar-fail { background: #f44336; }
        .bar-label { font-size: 0.75em; color: #757575; margin-top: 4px; }
        .footer {
            text-align: center; color: #9e9e9e;
            font-size: 0.85em; margin-top: 24px;
        }
    &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;div class="header"&gt;
        &lt;h1&gt;QA Dashboard — Pipeline de Reporting&lt;/h1&gt;
        &lt;div class="subtitle"&gt;
            Generado: {{ generated_at }} | Total: {{ summary.total }} tests
        &lt;/div&gt;
    &lt;/div&gt;

    &lt;!-- Summary Cards --&gt;
    &lt;div class="cards"&gt;
        &lt;div class="card card-pass"&gt;
            &lt;div class="label"&gt;Passed&lt;/div&gt;
            &lt;div class="value"&gt;{{ summary.passed }}&lt;/div&gt;
        &lt;/div&gt;
        &lt;div class="card card-fail"&gt;
            &lt;div class="label"&gt;Failed&lt;/div&gt;
            &lt;div class="value"&gt;{{ summary.failed }}&lt;/div&gt;
        &lt;/div&gt;
        &lt;div class="card card-skip"&gt;
            &lt;div class="label"&gt;Skipped&lt;/div&gt;
            &lt;div class="value"&gt;{{ summary.skipped }}&lt;/div&gt;
        &lt;/div&gt;
        &lt;div class="card card-rate"&gt;
            &lt;div class="label"&gt;Pass Rate&lt;/div&gt;
            &lt;div class="value"&gt;{{ summary.pass_rate }}%&lt;/div&gt;
        &lt;/div&gt;
        &lt;div class="card card-time"&gt;
            &lt;div class="label"&gt;Duración&lt;/div&gt;
            &lt;div class="value"&gt;{{ summary.total_duration }}s&lt;/div&gt;
        &lt;/div&gt;
        &lt;div class="card card-flaky"&gt;
            &lt;div class="label"&gt;Flaky Tests&lt;/div&gt;
            &lt;div class="value"&gt;{{ summary.flaky_count }}&lt;/div&gt;
        &lt;/div&gt;
    &lt;/div&gt;

    &lt;!-- Failure Analysis --&gt;
    {% if summary.failures %}
    &lt;div class="section"&gt;
        &lt;h2&gt;Análisis de Fallos&lt;/h2&gt;
        &lt;table&gt;
            &lt;thead&gt;
                &lt;tr&gt;
                    &lt;th&gt;Test&lt;/th&gt;
                    &lt;th&gt;Duración&lt;/th&gt;
                    &lt;th&gt;Error&lt;/th&gt;
                &lt;/tr&gt;
            &lt;/thead&gt;
            &lt;tbody&gt;
                {% for f in summary.failures %}
                &lt;tr&gt;
                    &lt;td&gt;&lt;code&gt;{{ f.name }}&lt;/code&gt;&lt;/td&gt;
                    &lt;td&gt;{{ f.duration }}s&lt;/td&gt;
                    &lt;td style="font-size:0.85em; color:#c62828;"&gt;
                        {{ f.error[:200] }}
                    &lt;/td&gt;
                &lt;/tr&gt;
                {% endfor %}
            &lt;/tbody&gt;
        &lt;/table&gt;
    &lt;/div&gt;
    {% endif %}

    &lt;!-- Slowest Tests --&gt;
    &lt;div class="section"&gt;
        &lt;h2&gt;Tests Más Lentos (Top 5)&lt;/h2&gt;
        &lt;table&gt;
            &lt;thead&gt;
                &lt;tr&gt;
                    &lt;th&gt;#&lt;/th&gt;
                    &lt;th&gt;Test&lt;/th&gt;
                    &lt;th&gt;Duración&lt;/th&gt;
                &lt;/tr&gt;
            &lt;/thead&gt;
            &lt;tbody&gt;
                {% for t in summary.slowest_tests %}
                &lt;tr&gt;
                    &lt;td&gt;{{ loop.index }}&lt;/td&gt;
                    &lt;td&gt;&lt;code&gt;{{ t.name }}&lt;/code&gt;&lt;/td&gt;
                    &lt;td&gt;{{ t.duration }}s&lt;/td&gt;
                &lt;/tr&gt;
                {% endfor %}
            &lt;/tbody&gt;
        &lt;/table&gt;
    &lt;/div&gt;

    &lt;!-- Trend Chart --&gt;
    {% if trend_data.labels %}
    &lt;div class="section"&gt;
        &lt;h2&gt;Tendencia de Ejecuciones&lt;/h2&gt;
        &lt;div class="chart-container"&gt;
            &lt;div class="bar-chart"&gt;
                {% for i in range(trend_data.labels|length) %}
                &lt;div class="bar-group"&gt;
                    &lt;div class="bar bar-pass"
                         style="height: {{ trend_data.pass_rates[i] * 2 }}px;"
                         title="Pass: {{ trend_data.pass_rates[i] }}%"&gt;
                    &lt;/div&gt;
                    &lt;div class="bar-label"&gt;{{ trend_data.labels[i] }}&lt;/div&gt;
                &lt;/div&gt;
                {% endfor %}
            &lt;/div&gt;
        &lt;/div&gt;
    &lt;/div&gt;
    {% endif %}

    &lt;div class="footer"&gt;
        Pipeline de QA — Generado automáticamente | {{ generated_at }}
    &lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

        <h3>📢 Paso 8: Notificaciones a Slack vía webhook</h3>
        <p>Clase que envía un <strong>mensaje formateado a Slack</strong> cuando hay tests fallidos.
        Incluye un resumen con contadores, lista de failures y link al reporte.</p>

        <div class="code-tabs" data-code-id="L109-6">
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
<pre><code class="language-python"># reporting/slack_notifier.py
"""
SlackNotifier — Envía notificaciones a Slack vía Incoming Webhook.
Se activa cuando hay tests fallidos al final de la sesión.
"""
import json
import logging
import requests
from typing import Optional

logger = logging.getLogger("slack_notifier")


class SlackNotifier:
    """
    Envía notificaciones a un canal de Slack cuando hay fallos.

    Uso:
        notifier = SlackNotifier(webhook_url="https://hooks.slack.com/...")
        notifier.send_summary(metrics_summary, report_url="...")
    """

    def __init__(self, webhook_url: Optional[str] = None):
        """
        Args:
            webhook_url: URL del Incoming Webhook de Slack.
                         Si es None, se lee de la variable SLACK_WEBHOOK_URL.
        """
        import os
        self.webhook_url = webhook_url or os.getenv("SLACK_WEBHOOK_URL")
        self.enabled = bool(self.webhook_url)

        if not self.enabled:
            logger.info(
                "Slack notifier desactivado "
                "(no se configuró SLACK_WEBHOOK_URL)"
            )

    def send_summary(
        self,
        summary: dict,
        report_url: str = "",
        channel: str = "#qa-alerts",
    ) -> bool:
        """
        Envía resumen de ejecución a Slack.
        Solo envía si hay tests fallidos.

        Args:
            summary: Métricas de MetricsCollector.get_summary()
            report_url: URL al reporte HTML completo
            channel: Canal de destino (por defecto #qa-alerts)

        Returns:
            True si se envió correctamente, False si hubo error.
        """
        if not self.enabled:
            logger.info("Slack: notificación omitida (no configurado)")
            return False

        if summary["failed"] == 0:
            logger.info(
                "Slack: no se envía notificación (0 fallos)"
            )
            return True

        payload = self._build_payload(summary, report_url, channel)

        try:
            response = requests.post(
                self.webhook_url,
                json=payload,
                timeout=10,
            )
            response.raise_for_status()
            logger.info("Slack: notificación enviada correctamente")
            return True
        except requests.RequestException as e:
            logger.error(f"Slack: error al enviar notificación: {e}")
            return False

    def _build_payload(
        self, summary: dict, report_url: str, channel: str
    ) -> dict:
        """Construir el payload de Slack con bloques formateados."""
        # Emoji según severidad
        if summary["pass_rate"] >= 95:
            status_emoji = ":large_yellow_circle:"
        elif summary["pass_rate"] >= 80:
            status_emoji = ":warning:"
        else:
            status_emoji = ":red_circle:"

        # Lista de failures (máximo 5)
        failure_lines = ""
        for f in summary.get("failures", [])[:5]:
            failure_lines += (
                f"  - \`{f['name']}\`: {f['error'][:100]}\\n"
            )

        if len(summary.get("failures", [])) > 5:
            failure_lines += (
                f"  _...y {len(summary['failures']) - 5} más_\\n"
            )

        blocks = [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": (
                        f"{status_emoji} QA Pipeline — "
                        f"{summary['failed']} test(s) fallidos"
                    ),
                },
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": (
                            f"*Total:* {summary['total']}\\n"
                            f"*Passed:* {summary['passed']}\\n"
                            f"*Failed:* {summary['failed']}"
                        ),
                    },
                    {
                        "type": "mrkdwn",
                        "text": (
                            f"*Pass Rate:* {summary['pass_rate']}%\\n"
                            f"*Duración:* {summary['total_duration']}s\\n"
                            f"*Flaky:* {summary['flaky_count']}"
                        ),
                    },
                ],
            },
        ]

        if failure_lines:
            blocks.append({
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"*Failures:*\\n{failure_lines}",
                },
            })

        if report_url:
            blocks.append({
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "Ver Reporte Completo",
                        },
                        "url": report_url,
                        "style": "primary",
                    }
                ],
            })

        return {"channel": channel, "blocks": blocks}</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// reporting/slack-notifier.ts
// SlackNotifier — Envía notificaciones a Slack vía Incoming Webhook.
// Se activa cuando hay tests fallidos al final de la sesión.

export class SlackNotifier {
  /**
   * Envía notificaciones a un canal de Slack cuando hay fallos.
   *
   * Uso:
   *   const notifier = new SlackNotifier('https://hooks.slack.com/...');
   *   await notifier.sendSummary(metricsSummary, 'https://...');
   */

  private webhookUrl: string | undefined;
  private enabled: boolean;

  constructor(webhookUrl?: string) {
    /**
     * @param webhookUrl - URL del Incoming Webhook de Slack.
     *                     Si no se pasa, se lee de SLACK_WEBHOOK_URL.
     */
    this.webhookUrl = webhookUrl ?? process.env.SLACK_WEBHOOK_URL;
    this.enabled = Boolean(this.webhookUrl);

    if (!this.enabled) {
      console.info(
        'Slack notifier desactivado (no se configuró SLACK_WEBHOOK_URL)'
      );
    }
  }

  async sendSummary(
    summary: Record&lt;string, any&gt;,
    reportUrl = '',
    channel = '#qa-alerts'
  ): Promise&lt;boolean&gt; {
    /**
     * Envía resumen de ejecución a Slack.
     * Solo envía si hay tests fallidos.
     *
     * @param summary - Métricas de MetricsCollector.getSummary()
     * @param reportUrl - URL al reporte HTML completo
     * @param channel - Canal de destino (por defecto #qa-alerts)
     * @returns true si se envió correctamente, false si hubo error.
     */
    if (!this.enabled) {
      console.info('Slack: notificación omitida (no configurado)');
      return false;
    }

    if (summary.failed === 0) {
      console.info('Slack: no se envía notificación (0 fallos)');
      return true;
    }

    const payload = this.buildPayload(summary, reportUrl, channel);

    try {
      const response = await fetch(this.webhookUrl!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }

      console.info('Slack: notificación enviada correctamente');
      return true;
    } catch (e) {
      console.error(\`Slack: error al enviar notificación: \${e}\`);
      return false;
    }
  }

  private buildPayload(
    summary: Record&lt;string, any&gt;,
    reportUrl: string,
    channel: string
  ): Record&lt;string, unknown&gt; {
    /** Construir el payload de Slack con bloques formateados. */
    // Emoji según severidad
    let statusEmoji: string;
    if (summary.pass_rate &gt;= 95) {
      statusEmoji = ':large_yellow_circle:';
    } else if (summary.pass_rate &gt;= 80) {
      statusEmoji = ':warning:';
    } else {
      statusEmoji = ':red_circle:';
    }

    // Lista de failures (máximo 5)
    let failureLines = '';
    const failures = (summary.failures ?? []) as Array&lt;Record&lt;string, any&gt;&gt;;
    for (const f of failures.slice(0, 5)) {
      const errorSnippet = String(f.error ?? '').slice(0, 100);
      failureLines += \`  - \\\`\${f.name}\\\`: \${errorSnippet}\\n\`;
    }

    if (failures.length &gt; 5) {
      failureLines += \`  _...y \${failures.length - 5} más_\\n\`;
    }

    const blocks: Record&lt;string, unknown&gt;[] = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: \`\${statusEmoji} QA Pipeline — \${summary.failed} test(s) fallidos\`,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: [
              \`*Total:* \${summary.total}\`,
              \`*Passed:* \${summary.passed}\`,
              \`*Failed:* \${summary.failed}\`,
            ].join('\\n'),
          },
          {
            type: 'mrkdwn',
            text: [
              \`*Pass Rate:* \${summary.pass_rate}%\`,
              \`*Duración:* \${summary.total_duration}s\`,
              \`*Flaky:* \${summary.flaky_count}\`,
            ].join('\\n'),
          },
        ],
      },
    ];

    if (failureLines) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: \`*Failures:*\\n\${failureLines}\`,
        },
      });
    }

    if (reportUrl) {
      blocks.push({
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Ver Reporte Completo',
            },
            url: reportUrl,
            style: 'primary',
          },
        ],
      });
    }

    return { channel, blocks };
  }
}</code></pre>
</div>
</div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Consejo SIESA</h4>
            <p>En SIESA, el canal <code>#qa-alerts</code> recibe notificaciones solo cuando hay fallos.
            Esto evita el "alert fatigue" (fatiga de alertas). El equipo configura el webhook
            en la variable de entorno <code>SLACK_WEBHOOK_URL</code> del CI, nunca en el código fuente.
            Si no hay fallos, no se envía nada: el silencio es la buena noticia.</p>
        </div>

        <h3>📅 Paso 9: Tracking histórico de tendencias</h3>
        <p>Clase que almacena el resultado de cada ejecución en un archivo JSON y permite
        <strong>comparar tendencias a lo largo del tiempo</strong>.</p>

        <div class="code-tabs" data-code-id="L109-7">
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
<pre><code class="language-python"># reporting/history_tracker.py
"""
HistoryTracker — Almacena resultados de ejecuciones en JSON.
Permite comparar métricas entre runs y detectar degradaciones.
"""
import json
import logging
from pathlib import Path
from datetime import datetime
from typing import Optional

logger = logging.getLogger("history_tracker")


class HistoryTracker:
    """
    Mantiene un historial de ejecuciones de tests en un archivo JSON.
    Permite detectar tendencias y degradaciones.

    Uso:
        tracker = HistoryTracker(history_dir="reports/history")
        tracker.record_run(metrics_summary)
        history = tracker.get_history(last_n=10)
        comparison = tracker.compare_with_previous(metrics_summary)
    """

    HISTORY_FILE = "test_history.json"

    def __init__(self, history_dir: str = "reports/history"):
        self.history_dir = Path(history_dir)
        self.history_dir.mkdir(parents=True, exist_ok=True)
        self.history_file = self.history_dir / self.HISTORY_FILE

    def record_run(self, summary: dict) -> int:
        """
        Registrar el resultado de una ejecución.

        Args:
            summary: Diccionario de métricas (MetricsCollector.get_summary())

        Returns:
            Número total de ejecuciones en el historial.
        """
        history = self._load_history()

        run_entry = {
            "run_id": len(history) + 1,
            "timestamp": summary.get(
                "timestamp", datetime.now().isoformat()
            ),
            "total": summary["total"],
            "passed": summary["passed"],
            "failed": summary["failed"],
            "skipped": summary["skipped"],
            "pass_rate": summary["pass_rate"],
            "total_duration": summary["total_duration"],
            "flaky_count": summary.get("flaky_count", 0),
            "avg_duration": summary.get("avg_duration", 0),
            "failures": [
                f["name"] for f in summary.get("failures", [])
            ],
        }

        history.append(run_entry)
        self._save_history(history)

        logger.info(
            f"Ejecución #{run_entry['run_id']} registrada "
            f"(pass_rate: {run_entry['pass_rate']}%)"
        )
        return len(history)

    def get_history(self, last_n: int = 20) -> list:
        """Obtener las últimas N ejecuciones."""
        history = self._load_history()
        return history[-last_n:]

    def get_previous_run(self) -> Optional[dict]:
        """Obtener la ejecución inmediatamente anterior."""
        history = self._load_history()
        if len(history) >= 2:
            return history[-2]
        return None

    def compare_with_previous(self, current: dict) -> dict:
        """
        Comparar ejecución actual con la anterior.

        Returns:
            dict con deltas: pass_rate_delta, duration_delta,
            new_failures, fixed_tests, regression_detected.
        """
        previous = self.get_previous_run()
        if not previous:
            return {
                "has_previous": False,
                "message": "No hay ejecución anterior para comparar.",
            }

        # Calcular deltas
        pass_rate_delta = (
            current["pass_rate"] - previous["pass_rate"]
        )
        duration_delta = (
            current["total_duration"] - previous["total_duration"]
        )

        # Nuevos failures vs anterior
        prev_failures = set(previous.get("failures", []))
        curr_failures = set(
            f["name"] for f in current.get("failures", [])
        )
        new_failures = list(curr_failures - prev_failures)
        fixed_tests = list(prev_failures - curr_failures)

        # Detectar regresión: pass rate bajó más de 5%
        regression_detected = pass_rate_delta < -5.0

        comparison = {
            "has_previous": True,
            "previous_run_id": previous.get("run_id"),
            "pass_rate_delta": round(pass_rate_delta, 1),
            "duration_delta": round(duration_delta, 2),
            "new_failures": new_failures,
            "fixed_tests": fixed_tests,
            "regression_detected": regression_detected,
        }

        if regression_detected:
            logger.warning(
                f"REGRESIÓN DETECTADA: pass rate bajó "
                f"{abs(pass_rate_delta):.1f}% respecto a la "
                f"ejecución anterior"
            )

        return comparison

    def _load_history(self) -> list:
        """Cargar historial desde archivo JSON."""
        if self.history_file.exists():
            with open(self.history_file, "r", encoding="utf-8") as f:
                return json.load(f)
        return []

    def _save_history(self, history: list):
        """Guardar historial en archivo JSON."""
        with open(self.history_file, "w", encoding="utf-8") as f:
            json.dump(history, f, indent=2, ensure_ascii=False)</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// reporting/history-tracker.ts
// HistoryTracker — Almacena resultados de ejecuciones en JSON.
// Permite comparar métricas entre runs y detectar degradaciones.
import * as fs from 'fs';
import * as path from 'path';

interface RunEntry {
  run_id: number;
  timestamp: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  pass_rate: number;
  total_duration: number;
  flaky_count: number;
  avg_duration: number;
  failures: string[];
}

interface Comparison {
  has_previous: boolean;
  message?: string;
  previous_run_id?: number;
  pass_rate_delta?: number;
  duration_delta?: number;
  new_failures?: string[];
  fixed_tests?: string[];
  regression_detected?: boolean;
}

export class HistoryTracker {
  /**
   * Mantiene un historial de ejecuciones de tests en un archivo JSON.
   * Permite detectar tendencias y degradaciones.
   *
   * Uso:
   *   const tracker = new HistoryTracker('reports/history');
   *   tracker.recordRun(metricsSummary);
   *   const history = tracker.getHistory(10);
   *   const comparison = tracker.compareWithPrevious(metricsSummary);
   */

  private static readonly HISTORY_FILE = 'test_history.json';
  private historyDir: string;
  private historyFile: string;

  constructor(historyDir = 'reports/history') {
    this.historyDir = historyDir;
    if (!fs.existsSync(this.historyDir)) {
      fs.mkdirSync(this.historyDir, { recursive: true });
    }
    this.historyFile = path.join(this.historyDir, HistoryTracker.HISTORY_FILE);
  }

  recordRun(summary: Record&lt;string, any&gt;): number {
    /**
     * Registrar el resultado de una ejecución.
     * @param summary - Diccionario de métricas (MetricsCollector.getSummary())
     * @returns Número total de ejecuciones en el historial.
     */
    const history = this.loadHistory();

    const failures = (summary.failures ?? []) as Array&lt;Record&lt;string, any&gt;&gt;;
    const runEntry: RunEntry = {
      run_id: history.length + 1,
      timestamp: String(summary.timestamp ?? new Date().toISOString()),
      total: summary.total,
      passed: summary.passed,
      failed: summary.failed,
      skipped: summary.skipped,
      pass_rate: summary.pass_rate,
      total_duration: summary.total_duration,
      flaky_count: summary.flaky_count ?? 0,
      avg_duration: summary.avg_duration ?? 0,
      failures: failures.map((f: Record&lt;string, any&gt;) =&gt; String(f.name)),
    };

    history.push(runEntry);
    this.saveHistory(history);

    console.info(
      \`Ejecución #\${runEntry.run_id} registrada \` +
      \`(pass_rate: \${runEntry.pass_rate}%)\`
    );
    return history.length;
  }

  getHistory(lastN = 20): RunEntry[] {
    /** Obtener las últimas N ejecuciones. */
    const history = this.loadHistory();
    return history.slice(-lastN);
  }

  getPreviousRun(): RunEntry | null {
    /** Obtener la ejecución inmediatamente anterior. */
    const history = this.loadHistory();
    if (history.length &gt;= 2) {
      return history[history.length - 2];
    }
    return null;
  }

  compareWithPrevious(current: Record&lt;string, any&gt;): Comparison {
    /**
     * Comparar ejecución actual con la anterior.
     * @returns Objeto con deltas: passRateDelta, durationDelta,
     * newFailures, fixedTests, regressionDetected.
     */
    const previous = this.getPreviousRun();
    if (!previous) {
      return {
        has_previous: false,
        message: 'No hay ejecución anterior para comparar.',
      };
    }

    // Calcular deltas
    const passRateDelta = current.pass_rate - previous.pass_rate;
    const durationDelta = current.total_duration - previous.total_duration;

    // Nuevos failures vs anterior
    const prevFailures = new Set(previous.failures ?? []);
    const currFailures = new Set(
      ((current.failures ?? []) as Array&lt;Record&lt;string, any&gt;&gt;)
        .map((f: Record&lt;string, any&gt;) =&gt; String(f.name))
    );
    const newFailures = [...currFailures].filter(f =&gt; !prevFailures.has(f));
    const fixedTests = [...prevFailures].filter(f =&gt; !currFailures.has(f));

    // Detectar regresión: pass rate bajó más de 5%
    const regressionDetected = passRateDelta &lt; -5.0;

    const comparison: Comparison = {
      has_previous: true,
      previous_run_id: previous.run_id,
      pass_rate_delta: Math.round(passRateDelta * 10) / 10,
      duration_delta: Math.round(durationDelta * 100) / 100,
      new_failures: newFailures,
      fixed_tests: fixedTests,
      regression_detected: regressionDetected,
    };

    if (regressionDetected) {
      console.warn(
        \`REGRESION DETECTADA: pass rate bajó \` +
        \`\${Math.abs(passRateDelta).toFixed(1)}% respecto a la \` +
        \`ejecución anterior\`
      );
    }

    return comparison;
  }

  private loadHistory(): RunEntry[] {
    /** Cargar historial desde archivo JSON. */
    if (fs.existsSync(this.historyFile)) {
      const data = fs.readFileSync(this.historyFile, 'utf-8');
      return JSON.parse(data) as RunEntry[];
    }
    return [];
  }

  private saveHistory(history: RunEntry[]): void {
    /** Guardar historial en archivo JSON. */
    fs.writeFileSync(
      this.historyFile,
      JSON.stringify(history, null, 2),
      'utf-8'
    );
  }
}</code></pre>
</div>
</div>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚠️ Importante: Regresiones automáticas</h4>
            <p>El <code>compare_with_previous()</code> detecta regresiones cuando el pass rate baja
            más de 5%. En CI, esto puede usarse para <strong>bloquear un merge</strong> o
            <strong>escalar la alerta</strong> a Slack con un mensaje más urgente. El umbral de 5%
            es configurable; en SIESA se ajusta según la criticidad del módulo: 2% para módulos
            de nómina (HCM), 5% para módulos de inventario (ERP).</p>
        </div>

        <h3>🔗 Paso 10: conftest.py completo — Todo integrado</h3>
        <p>El <code>conftest.py</code> final conecta todos los componentes: métricas, traces,
        screenshots, Allure, notificaciones y tracking histórico.</p>

        <div class="code-tabs" data-code-id="L109-8">
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
<pre><code class="language-python"># conftest.py — Parte 3: Session hooks (al final de la ejecución)
# =====================================================
# SESSION HOOKS: Al finalizar la ejecución
# =====================================================

def pytest_sessionfinish(session, exitstatus):
    """
    Hook que se ejecuta al terminar TODA la sesión de pytest.
    Genera el dashboard, registra historial y envía notificación.
    """
    summary = metrics.get_summary()

    if summary["total"] == 0:
        return  # No hubo tests, no hacer nada

    # 1. Guardar métricas en JSON
    metrics_path = REPORTS_DIR / "metrics.json"
    metrics.save_to_json(str(metrics_path))
    logger.info(f"Métricas guardadas en: {metrics_path}")

    # 2. Registrar en historial
    history.record_run(summary)
    comparison = history.compare_with_previous(summary)

    if comparison.get("regression_detected"):
        logger.warning(
            "REGRESIÓN: pass rate bajó "
            f"{abs(comparison['pass_rate_delta'])}%"
        )

    # 3. Generar dashboard HTML
    try:
        generator = DashboardGenerator(
            template_dir=str(PROJECT_ROOT / "reporting" / "templates")
        )
        history_data = history.get_history(last_n=10)
        dashboard_html = generator.generate(summary, history_data)
        dashboard_path = REPORTS_DIR / "dashboard" / "index.html"
        generator.save(dashboard_html, str(dashboard_path))
        logger.info(f"Dashboard generado: {dashboard_path}")
    except Exception as e:
        logger.error(f"Error generando dashboard: {e}")

    # 4. Enviar notificación a Slack (solo si hay fallos)
    if summary["failed"] > 0:
        try:
            notifier = SlackNotifier()
            report_url = (
                "https://your-ci.com/reports/latest/dashboard"
            )
            notifier.send_summary(summary, report_url=report_url)
        except Exception as e:
            logger.error(f"Error enviando notificación Slack: {e}")

    # 5. Log del resumen final
    logger.info("=" * 60)
    logger.info("RESUMEN DE EJECUCIÓN")
    logger.info(f"  Total: {summary['total']}")
    logger.info(f"  Passed: {summary['passed']}")
    logger.info(f"  Failed: {summary['failed']}")
    logger.info(f"  Skipped: {summary['skipped']}")
    logger.info(f"  Pass Rate: {summary['pass_rate']}%")
    logger.info(f"  Duración: {summary['total_duration']}s")
    logger.info(f"  Flaky: {summary['flaky_count']}")
    logger.info("=" * 60)</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// reporting/qa-pipeline-reporter.ts — Parte 3: onEnd (al final de la ejecución)
// =====================================================
// SESSION END: Al finalizar la ejecución
// =====================================================
import * as path from 'path';
import { MetricsCollector } from './metrics-collector';
import { SlackNotifier } from './slack-notifier';
import { HistoryTracker } from './history-tracker';
import { DashboardGenerator } from './dashboard-generator';
import type { FullResult, Reporter } from '@playwright/test/reporter';

const PROJECT_ROOT = path.resolve(__dirname, '..');
const REPORTS_DIR = path.join(PROJECT_ROOT, 'reports');
const HISTORY_DIR = path.join(REPORTS_DIR, 'history');

// Instancias globales (compartidas con onTestEnd)
const metrics = new MetricsCollector();
const history = new HistoryTracker(HISTORY_DIR);

// En el reporter custom, el método onEnd:
class QAPipelineReporter implements Reporter {
  // ... (onBegin y onTestEnd definidos en Parte 1)

  async onEnd(result: FullResult): Promise&lt;void&gt; {
    /**
     * Se ejecuta al terminar TODA la sesión de tests.
     * Genera el dashboard, registra historial y envía notificación.
     */
    const summary = metrics.getSummary();

    if ((summary.total as number) === 0) {
      return; // No hubo tests, no hacer nada
    }

    // 1. Guardar métricas en JSON
    const metricsPath = path.join(REPORTS_DIR, 'metrics.json');
    metrics.saveToJson(metricsPath);
    console.info(\`Métricas guardadas en: \${metricsPath}\`);

    // 2. Registrar en historial
    history.recordRun(summary);
    const comparison = history.compareWithPrevious(summary);

    if (comparison.regression_detected) {
      console.warn(
        \`REGRESION: pass rate bajó \${Math.abs(comparison.pass_rate_delta ?? 0)}%\`
      );
    }

    // 3. Generar dashboard HTML
    try {
      const generator = new DashboardGenerator(
        path.join(PROJECT_ROOT, 'reporting', 'templates')
      );
      const historyData = history.getHistory(10);
      const dashboardHtml = generator.generate(summary, historyData);
      const dashboardPath = path.join(REPORTS_DIR, 'dashboard', 'index.html');
      generator.save(dashboardHtml, dashboardPath);
      console.info(\`Dashboard generado: \${dashboardPath}\`);
    } catch (e) {
      console.error(\`Error generando dashboard: \${e}\`);
    }

    // 4. Enviar notificación a Slack (solo si hay fallos)
    if ((summary.failed as number) &gt; 0) {
      try {
        const notifier = new SlackNotifier();
        const reportUrl = 'https://your-ci.com/reports/latest/dashboard';
        await notifier.sendSummary(summary, reportUrl);
      } catch (e) {
        console.error(\`Error enviando notificación Slack: \${e}\`);
      }
    }

    // 5. Log del resumen final
    console.info('='.repeat(60));
    console.info('RESUMEN DE EJECUCION');
    console.info(\`  Total: \${summary.total}\`);
    console.info(\`  Passed: \${summary.passed}\`);
    console.info(\`  Failed: \${summary.failed}\`);
    console.info(\`  Skipped: \${summary.skipped}\`);
    console.info(\`  Pass Rate: \${summary.pass_rate}%\`);
    console.info(\`  Duración: \${summary.total_duration}s\`);
    console.info(\`  Flaky: \${summary.flaky_count}\`);
    console.info('='.repeat(60));
  }
}

export default QAPipelineReporter;</code></pre>
</div>
</div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Flujo completo del pipeline</h4>
            <p>El pipeline opera en este orden durante una ejecución de <code>pytest</code>:</p>
            <ol>
                <li><strong>Inicio:</strong> Se crea el <code>MetricsCollector</code> y <code>HistoryTracker</code></li>
                <li><strong>Cada test:</strong> El hook <code>pytest_runtest_makereport</code> registra el resultado en metrics, captura screenshot si falla, y embebe en pytest-html</li>
                <li><strong>Traces:</strong> Si el test falla, el fixture <code>save_trace_on_failure</code> guarda el trace .zip</li>
                <li><strong>Allure:</strong> Los decoradores <code>@allure.step</code> y <code>@allure.attach</code> alimentan Allure en paralelo</li>
                <li><strong>Fin de sesión:</strong> <code>pytest_sessionfinish</code> genera el dashboard, registra en historial, compara con la ejecución anterior y envía Slack si hay fallos</li>
            </ol>
        </div>

        <h3>🚀 Paso 11: CI/CD con GitHub Actions</h3>
        <p>Workflow completo que ejecuta los tests, genera todos los reportes y los sube como artefactos.</p>

        <pre><code class="yaml"># .github/workflows/test-and-report.yml
name: QA Pipeline — Tests y Reporting

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 6 * * 1-5'  # Lunes a viernes, 6 AM UTC

env:
  PYTHON_VERSION: '3.11'

jobs:
  test-and-report:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - name: Checkout código
        uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: \${{ env.PYTHON_VERSION }}
          cache: 'pip'

      - name: Instalar dependencias
        run: |
          pip install -r requirements.txt
          playwright install chromium --with-deps

      # --- Descargar historial de ejecuciones anteriores ---
      - name: Descargar historial previo
        uses: actions/cache@v4
        with:
          path: reports/history/
          key: test-history-\${{ github.ref_name }}
          restore-keys: |
            test-history-

      # --- Ejecutar tests ---
      - name: Ejecutar tests
        run: |
          pytest tests/ \\
            --html=reports/html/report.html \\
            --self-contained-html \\
            --alluredir=reports/allure-results \\
            --tracing=retain-on-failure \\
            -v \\
            --tb=short \\
            || true  # No fallar el job para generar reportes
        env:
          SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK_URL }}

      # --- Generar Allure Report ---
      - name: Instalar Allure CLI
        run: |
          curl -o allure.tgz -Ls \\
            https://github.com/allure-framework/allure2/releases/\\
          download/2.30.0/allure-2.30.0.tgz
          tar -xzf allure.tgz
          echo "\$PWD/allure-2.30.0/bin" >> \$GITHUB_PATH

      - name: Generar Allure HTML
        run: |
          allure generate reports/allure-results \\
            -o reports/allure-report --clean

      # --- Guardar historial actualizado ---
      - name: Guardar historial
        uses: actions/cache/save@v4
        with:
          path: reports/history/
          key: test-history-\${{ github.ref_name }}-\${{ github.run_id }}

      # --- Subir artefactos ---
      - name: Subir reporte pytest-html
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: pytest-html-report
          path: reports/html/
          retention-days: 30

      - name: Subir reporte Allure
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: allure-report
          path: reports/allure-report/
          retention-days: 30

      - name: Subir traces de fallos
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-traces
          path: reports/traces/
          retention-days: 7

      - name: Subir dashboard
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: qa-dashboard
          path: reports/dashboard/
          retention-days: 30

      - name: Subir métricas e historial
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: metrics-and-history
          path: |
            reports/metrics.json
            reports/history/
          retention-days: 90

      - name: Subir screenshots de fallos
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: failure-screenshots
          path: test-results/screenshots/
          retention-days: 14

      # --- Verificar resultado final ---
      - name: Verificar resultado
        run: |
          METRICS_FILE="reports/metrics.json"
          if [ -f "\$METRICS_FILE" ]; then
            FAILED=\$(python -c "
          import json
          with open('\$METRICS_FILE') as f:
              data = json.load(f)
          print(data.get('failed', 0))
          ")
            echo "Tests fallidos: \$FAILED"
            if [ "\$FAILED" -gt 0 ]; then
              echo "::warning::Hay \$FAILED test(s) fallidos"
              exit 1
            fi
          fi</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip: Retención de artefactos</h4>
            <p>Los tiempos de retención están configurados según la utilidad de cada artefacto:</p>
            <ul>
                <li><strong>Traces:</strong> 7 días (pesados, solo útiles para debugging inmediato)</li>
                <li><strong>Screenshots:</strong> 14 días (útiles para investigar fallos recientes)</li>
                <li><strong>Reportes HTML:</strong> 30 días (referencia para sprints recientes)</li>
                <li><strong>Historial:</strong> 90 días (necesario para detectar tendencias a largo plazo)</li>
            </ul>
        </div>

        <h3>📊 Paso 12: Resumen de componentes del pipeline</h3>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📋 Tabla de componentes del pipeline</h4>
            <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
                <thead>
                    <tr style="background: #2e7d32; color: white;">
                        <th style="padding: 8px; text-align: left;">Componente</th>
                        <th style="padding: 8px; text-align: left;">Archivo</th>
                        <th style="padding: 8px; text-align: left;">Función</th>
                        <th style="padding: 8px; text-align: center;">Formato</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 6px 8px;">pytest-html</td>
                        <td style="padding: 6px 8px;"><code>conftest.py</code></td>
                        <td style="padding: 6px 8px;">Reporte HTML con screenshots embebidos y metadata del entorno</td>
                        <td style="padding: 6px 8px; text-align: center;">HTML</td>
                    </tr>
                    <tr style="background: #f5f5f5;">
                        <td style="padding: 6px 8px;">Allure</td>
                        <td style="padding: 6px 8px;"><code>tests/test_*.py</code></td>
                        <td style="padding: 6px 8px;">Reportes interactivos con features, stories, steps, adjuntos</td>
                        <td style="padding: 6px 8px; text-align: center;">HTML</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 8px;">Trace Viewer</td>
                        <td style="padding: 6px 8px;"><code>conftest.py</code></td>
                        <td style="padding: 6px 8px;">Traces automáticos en fallos, organizados por fecha</td>
                        <td style="padding: 6px 8px; text-align: center;">ZIP</td>
                    </tr>
                    <tr style="background: #f5f5f5;">
                        <td style="padding: 6px 8px;">MetricsCollector</td>
                        <td style="padding: 6px 8px;"><code>reporting/metrics_collector.py</code></td>
                        <td style="padding: 6px 8px;">Pass/fail/skip, duración, flaky tests, top 5 más lentos</td>
                        <td style="padding: 6px 8px; text-align: center;">JSON</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 8px;">Dashboard</td>
                        <td style="padding: 6px 8px;"><code>reporting/dashboard_generator.py</code></td>
                        <td style="padding: 6px 8px;">Dashboard ejecutivo con cards, failures, tendencias</td>
                        <td style="padding: 6px 8px; text-align: center;">HTML</td>
                    </tr>
                    <tr style="background: #f5f5f5;">
                        <td style="padding: 6px 8px;">Slack</td>
                        <td style="padding: 6px 8px;"><code>reporting/slack_notifier.py</code></td>
                        <td style="padding: 6px 8px;">Notificación en fallos con resumen y link al reporte</td>
                        <td style="padding: 6px 8px; text-align: center;">Webhook</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 8px;">HistoryTracker</td>
                        <td style="padding: 6px 8px;"><code>reporting/history_tracker.py</code></td>
                        <td style="padding: 6px 8px;">Historial de runs, comparación, detección de regresiones</td>
                        <td style="padding: 6px 8px; text-align: center;">JSON</td>
                    </tr>
                    <tr style="background: #f5f5f5;">
                        <td style="padding: 6px 8px;">GitHub Actions</td>
                        <td style="padding: 6px 8px;"><code>.github/workflows/</code></td>
                        <td style="padding: 6px 8px;">Pipeline CI/CD con todos los reportes como artefactos</td>
                        <td style="padding: 6px 8px; text-align: center;">YAML</td>
                    </tr>
                </tbody>
            </table>
            <p><strong>Total:</strong> 8 componentes integrados, 4 archivos de reporting custom,
            1 template Jinja2, 1 conftest.py central y 1 workflow de CI/CD.</p>
        </div>

        <h3>📊 Resumen de la Sección 16</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Sección 16 Completada: Reporting y Trace Viewer</h4>
            <p>Has dominado todas las técnicas de reporting profesional para Playwright:</p>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #c8e6c9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Lección</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Tema</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Tipo</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">105</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Reportes HTML con pytest-html</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Foundation</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">106</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Allure reports para Playwright</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">107</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Trace Viewer avanzado</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">108</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Métricas y dashboards personalizados</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">109</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Proyecto: Pipeline de reporting completo</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Capstone</td>
                </tr>
            </table>
        </div>

        <h3>🏆 Habilidades adquiridas en la Sección 16</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <ul>
                <li><strong>pytest-html:</strong> Reportes HTML con screenshots embebidos, metadata de entorno y estilos personalizados</li>
                <li><strong>Allure:</strong> Reportes interactivos con features, stories, steps, severity levels y adjuntos</li>
                <li><strong>Trace Viewer:</strong> Recolección automática de traces en fallos, análisis de timeline y network</li>
                <li><strong>Métricas custom:</strong> Recolección de pass/fail/skip, duración, flaky tests y análisis de fallos</li>
                <li><strong>Dashboards:</strong> Generación de dashboards HTML con Jinja2, cards, tablas y gráficos de tendencia</li>
                <li><strong>Notificaciones:</strong> Integración con Slack vía webhooks para alertas automáticas en fallos</li>
                <li><strong>Historial:</strong> Tracking de tendencias entre ejecuciones y detección de regresiones</li>
                <li><strong>CI/CD:</strong> Pipeline de GitHub Actions con todos los reportes como artefactos con retención</li>
                <li><strong>Integración:</strong> conftest.py central que conecta todos los componentes del pipeline</li>
            </ul>
        </div>

        <h3>🎯 Ejercicio final</h3>
        <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 15px 0;">
            <h4>🏋️ Extiende el pipeline de reporting</h4>
            <p>Implementa las siguientes mejoras al pipeline:</p>
            <ol>
                <li><strong>Email report:</strong> Crea una clase <code>EmailNotifier</code> en
                <code>reporting/email_notifier.py</code> que envíe un email HTML con el resumen de ejecución
                usando <code>smtplib</code>. Incluye el dashboard como adjunto y los screenshots de fallos
                embebidos en el cuerpo del email.</li>

                <li><strong>Reporte JUnit XML:</strong> Agrega <code>--junitxml=reports/junit.xml</code> a las
                opciones de pytest y modifica el workflow de GitHub Actions para publicar los resultados
                con la action <code>dorny/test-reporter@v1</code>, mostrando los tests directamente en el PR.</li>

                <li><strong>Métricas de performance:</strong> Extiende el <code>MetricsCollector</code> para
                registrar también tiempos de navegación (<code>page.goto()</code>) usando un fixture que mida
                el tiempo de carga de cada página visitada durante los tests.</li>

                <li><strong>Dashboard con gráficos interactivos:</strong> Reemplaza el gráfico de barras CSS
                del template Jinja2 con <strong>Chart.js</strong> para generar gráficos de línea interactivos
                que muestren la tendencia del pass rate y la duración promedio.</li>

                <li><strong>Webhook de Microsoft Teams:</strong> Crea <code>reporting/teams_notifier.py</code>
                con una Adaptive Card que muestre el resumen de ejecución en el canal de Teams del equipo.
                Usa el formato de Adaptive Cards v1.4 con tablas y colores según el resultado.</li>
            </ol>

            <div style="background: #e8f5e9; padding: 10px; border-radius: 5px; margin-top: 10px;">
                <strong>Criterios de éxito:</strong>
                <ul>
                    <li>El <code>EmailNotifier</code> funciona con un servidor SMTP de prueba (ej: <code>mailtrap.io</code>)</li>
                    <li>Los resultados JUnit aparecen como checks en los Pull Requests de GitHub</li>
                    <li>Las métricas de performance incluyen tiempos de navegación promedio y máximo</li>
                    <li>El dashboard Chart.js incluye tooltips interactivos y zoom</li>
                    <li>La Adaptive Card de Teams muestra colores rojos para fallos y verdes para éxito</li>
                    <li>Todos los nuevos componentes tienen tests unitarios en <code>tests/test_reporting.py</code></li>
                    <li>El workflow de CI/CD sigue ejecutándose en menos de 10 minutos</li>
                </ul>
            </div>
        </div>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Objetivos de esta lección:</h4>
            <ul>
                <li>Construir un pipeline de reporting completo con múltiples formatos de salida</li>
                <li>Integrar pytest-html con screenshots embebidos y metadata del entorno</li>
                <li>Configurar Allure con features, stories, steps, severity y adjuntos</li>
                <li>Implementar recolección automática de traces solo en fallos</li>
                <li>Crear un MetricsCollector que registre pass/fail/skip, duración y flaky tests</li>
                <li>Generar dashboards HTML con Jinja2 incluyendo cards, tablas y gráficos</li>
                <li>Integrar notificaciones a Slack vía webhooks con resumen formateado</li>
                <li>Implementar tracking histórico de tendencias con comparación entre ejecuciones</li>
                <li>Detectar regresiones automáticamente comparando con la ejecución anterior</li>
                <li>Configurar un workflow de GitHub Actions con todos los reportes como artefactos</li>
                <li>Integrar todos los componentes en un conftest.py central y cohesivo</li>
            </ul>
        </div>

        <h3>🚀 Siguiente: Sección 17 — CI/CD Integration</h3>
        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Has completado la Sección 16: Reporting y Trace Viewer.</strong>
            Ahora generas reportes profesionales, dashboards ejecutivos y alertas automáticas.
            En la <strong>Sección 17</strong> profundizarás en la integración completa con pipelines CI/CD:</p>
            <ul>
                <li><strong>Playwright en Docker:</strong> Contenedores optimizados para tests</li>
                <li><strong>GitHub Actions:</strong> Workflows avanzados con matrix, caching y paralelismo</li>
                <li><strong>Jenkins y GitLab CI:</strong> Integración con pipelines empresariales</li>
                <li><strong>Ejecución paralela y sharding:</strong> Dividir la suite en múltiples runners</li>
                <li><strong>Retry y flaky tests:</strong> Estrategias de reintento y detección de inestabilidad</li>
                <li><strong>Azure DevOps:</strong> Pipelines Windows para entornos corporativos</li>
                <li><strong>Proyecto capstone:</strong> Pipeline CI/CD completo con Docker, sharding y reportes</li>
            </ul>
            <p>El pipeline de reporting que construiste aquí se integrará directamente con las
            configuraciones de CI/CD de la Sección 17 para crear un flujo de QA automatizado end-to-end.</p>
        </div>
    `,
    topics: ["proyecto", "pipeline", "reporting"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 12,
    difficulty: "hard",
    type: "capstone"
};

if (typeof window !== 'undefined') {
    window.LESSON_109 = LESSON_109;
}
