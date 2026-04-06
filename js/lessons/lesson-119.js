/**
 * Playwright Academy - Leccion 119
 * Plugins y extensiones pytest
 * Seccion 18: Arquitecturas y Patrones Enterprise
 */

const LESSON_119 = {
    id: 119,
    title: "Plugins y extensiones pytest",
    duration: "7 min",
    level: "advanced",
    section: "section-18",
    content: `
        <h2>Plugins y extensiones pytest</h2>
        <p>Una de las mayores fortalezas de pytest es su <strong>ecosistema de plugins</strong>.
        Con mas de 1300 plugins disponibles en PyPI, puedes extender las capacidades de tu framework
        de testing de formas practicamente ilimitadas. En esta leccion exploraras los plugins
        esenciales para Playwright, aprenderas a configurar hooks avanzados en conftest.py, y
        crearas tu propio plugin personalizado.</p>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>El equipo de QA de SIESA utiliza una combinacion de pytest-html para reportes visuales,
            pytest-xdist para ejecucion paralela, y un plugin interno <code>pytest-siesa-reporter</code>
            que envia resultados automaticamente al dashboard de calidad en Power BI. Esto permite
            visibilidad en tiempo real del estado de las suites de regresion.</p>
        </div>

        <h3>Plugins esenciales para Playwright</h3>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Plugin</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Funcion</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Instalacion</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>pytest-playwright</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Integracion oficial de Playwright con pytest</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>pip install pytest-playwright</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>pytest-html</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Reportes HTML interactivos con screenshots</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>pip install pytest-html</code></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>pytest-xdist</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Ejecucion paralela en multiples CPUs</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>pip install pytest-xdist</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>pytest-rerunfailures</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Reintento automatico de tests fallidos</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>pip install pytest-rerunfailures</code></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>pytest-bdd</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">BDD con Gherkin (Given/When/Then)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>pip install pytest-bdd</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>allure-pytest</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Reportes Allure con historial y graficas</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>pip install allure-pytest</code></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>pytest-timeout</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Timeout global para evitar tests colgados</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>pip install pytest-timeout</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>pytest-ordering</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Control explicito del orden de ejecucion</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>pip install pytest-ordering</code></td>
                </tr>
            </table>
        </div>

        <h3>pytest-playwright: Fixtures integrados</h3>
        <p>El plugin oficial <code>pytest-playwright</code> proporciona fixtures listos para usar:</p>

        <pre><code class="python"># Fixtures que pytest-playwright inyecta automaticamente:

def test_basic_navigation(page):
    """'page' es un fixture de pytest-playwright: pagina nueva en contexto limpio."""
    page.goto("https://example.com")
    assert page.title() == "Example Domain"

def test_with_context(context):
    """'context' es un BrowserContext fresco."""
    page1 = context.new_page()
    page2 = context.new_page()
    # Dos paginas en el mismo contexto (comparten cookies)

def test_with_browser(browser):
    """'browser' es la instancia del navegador."""
    context = browser.new_context(viewport={"width": 375, "height": 812})
    page = context.new_page()
    page.goto("https://example.com")
    context.close()

# Configurar el browser desde linea de comandos:
# pytest --browser chromium         (default)
# pytest --browser firefox
# pytest --browser webkit
# pytest --browser chromium --browser firefox  (ambos)
# pytest --headed                   (modo visible)
# pytest --slowmo 500               (500ms entre acciones)</code></pre>

        <h3>pytest-html: Reportes enriquecidos</h3>

        <pre><code class="python"># conftest.py - Enriquecer reporte HTML con screenshots
import pytest
import base64
from pathlib import Path

@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()

    if report.when == "call" and report.failed:
        # Obtener la pagina del test
        page = item.funcargs.get("page")
        if page:
            # Capturar screenshot como base64
            screenshot = page.screenshot(type="png")
            b64_screenshot = base64.b64encode(screenshot).decode()

            # Agregar al reporte HTML
            extra = getattr(report, "extras", [])
            extra.append(pytest.html.extras.png(b64_screenshot))
            extra.append(pytest.html.extras.url(page.url, name="URL al fallar"))
            report.extras = extra

# Ejecucion:
# pytest tests/ --html=reports/report.html --self-contained-html</code></pre>

        <h3>pytest-xdist: Ejecucion paralela</h3>

        <pre><code class="python"># Ejecucion paralela basica
# pytest tests/ -n auto              # Usa todos los CPUs
# pytest tests/ -n 4                 # 4 workers
# pytest tests/ -n auto --dist=loadscope  # Agrupa por modulo

# IMPORTANTE: Para Playwright, cada worker obtiene su propio browser.
# Asegurate de que los tests son independientes (no comparten estado).

# conftest.py - Fixture session-scoped compatible con xdist
import pytest

@pytest.fixture(scope="session")
def session_data(tmp_path_factory, worker_id):
    """Datos de sesion compatibles con ejecucion paralela."""
    if worker_id == "master":
        # Ejecucion sin paralelo
        return setup_test_data()

    # Ejecucion paralela: cada worker tiene su propia sesion
    # Usar tmp_path_factory para datos compartidos via filesystem
    root_tmp_dir = tmp_path_factory.getbasetemp().parent
    lock_file = root_tmp_dir / "data.lock"
    data_file = root_tmp_dir / "session_data.json"

    with FileLock(str(lock_file)):
        if data_file.is_file():
            return json.loads(data_file.read_text())
        else:
            data = setup_test_data()
            data_file.write_text(json.dumps(data))
            return data</code></pre>

        <h3>pytest-bdd: Behavior Driven Development</h3>

        <pre><code class="gherkin"># features/login.feature
Feature: Login de usuario
    Como usuario registrado
    Quiero iniciar sesion en la plataforma
    Para acceder a mis funcionalidades

    Scenario: Login exitoso con credenciales validas
        Given estoy en la pagina de login
        When ingreso el usuario "admin@siesa.com"
        And ingreso la contraseña "Test1234!"
        And hago click en "Iniciar Sesion"
        Then debo ver el dashboard principal
        And el mensaje de bienvenida debe mostrar "admin"

    Scenario: Login fallido con contraseña incorrecta
        Given estoy en la pagina de login
        When ingreso el usuario "admin@siesa.com"
        And ingreso la contraseña "incorrecta"
        And hago click en "Iniciar Sesion"
        Then debo ver el mensaje de error "Credenciales invalidas"</code></pre>

        <pre><code class="python"># tests/step_defs/test_login_steps.py
import pytest
from pytest_bdd import scenarios, given, when, then, parsers
from playwright.sync_api import expect

# Vincular el archivo .feature
scenarios("../features/login.feature")

@given("estoy en la pagina de login")
def go_to_login(page):
    page.goto("/auth/login")
    expect(page.locator("[data-testid='login-form']")).to_be_visible()

@when(parsers.parse('ingreso el usuario "{username}"'))
def enter_username(page, username):
    page.fill("[data-testid='username-input']", username)

@when(parsers.parse('ingreso la contraseña "{password}"'))
def enter_password(page, password):
    page.fill("[data-testid='password-input']", password)

@when(parsers.parse('hago click en "{button_text}"'))
def click_button(page, button_text):
    page.get_by_role("button", name=button_text).click()

@then("debo ver el dashboard principal")
def verify_dashboard(page):
    page.wait_for_url("**/dashboard")
    expect(page.locator("[data-testid='dashboard']")).to_be_visible()

@then(parsers.parse('el mensaje de bienvenida debe mostrar "{text}"'))
def verify_welcome(page, text):
    expect(page.locator("[data-testid='welcome-message']")).to_contain_text(text)

@then(parsers.parse('debo ver el mensaje de error "{message}"'))
def verify_error(page, message):
    expect(page.locator("[data-testid='error-message']")).to_have_text(message)</code></pre>

        <h3>Hooks avanzados de pytest</h3>
        <p>Los hooks son puntos de extension que pytest ejecuta en momentos especificos del ciclo de vida:</p>

        <pre><code class="python"># conftest.py - Hooks avanzados

def pytest_configure(config):
    """Se ejecuta al inicio, antes de la recoleccion de tests."""
    # Registrar marcadores personalizados
    config.addinivalue_line("markers", "smoke: tests de smoke rapidos")
    config.addinivalue_line("markers", "slow: tests que tardan mas de 30s")
    config.addinivalue_line("markers", "api: tests de API exclusivamente")

def pytest_collection_modifyitems(config, items):
    """Modificar la lista de tests recolectados."""
    # Ejemplo: agregar marcador 'slow' a tests que esten en carpeta 'regression/'
    for item in items:
        if "regression" in str(item.fspath):
            item.add_marker(pytest.mark.regression)

        # Reordenar: smoke primero
        if "smoke" in str(item.fspath):
            item.add_marker(pytest.mark.order(0))

def pytest_runtest_setup(item):
    """Se ejecuta antes de cada test."""
    # Skip tests marcados como 'slow' si no se pide explicitamente
    if item.get_closest_marker("slow"):
        if not item.config.getoption("--run-slow", default=False):
            pytest.skip("Test lento - usar --run-slow para ejecutar")

def pytest_terminal_summary(terminalreporter, exitstatus):
    """Se ejecuta al final, para agregar info al resumen."""
    passed = len(terminalreporter.stats.get("passed", []))
    failed = len(terminalreporter.stats.get("failed", []))
    total = passed + failed

    if total > 0:
        rate = (passed / total) * 100
        terminalreporter.write_sep("=", f"TASA DE EXITO: {rate:.1f}%")

        if rate < 95:
            terminalreporter.write_line(
                "ALERTA: La tasa de exito esta por debajo del 95%",
                red=True
            )</code></pre>

        <h3>Crear tu propio plugin de pytest</h3>

        <pre><code class="python"># pytest_screenshot_plugin.py - Plugin personalizado
"""
Plugin de pytest para captura automatica de screenshots en Playwright.
Captura screenshot en cada fallo y los adjunta al reporte.
"""
import pytest
import os
from datetime import datetime

class ScreenshotPlugin:
    """Plugin que captura screenshots automaticamente en fallos."""

    def __init__(self, output_dir):
        self.output_dir = output_dir
        self.screenshots_taken = 0

    @pytest.hookimpl(hookwrapper=True)
    def pytest_runtest_makereport(self, item, call):
        outcome = yield
        report = outcome.get_result()

        if report.when == "call" and report.failed:
            page = item.funcargs.get("page")
            if page:
                os.makedirs(self.output_dir, exist_ok=True)
                name = item.name.replace(" ", "_")[:60]
                ts = datetime.now().strftime("%H%M%S")
                path = os.path.join(self.output_dir, f"FAIL_{name}_{ts}.png")
                page.screenshot(path=path, full_page=True)
                self.screenshots_taken += 1

                # Adjuntar ruta al reporte
                if hasattr(report, "extras"):
                    report.extras.append(
                        pytest.html.extras.image(path)
                    )

    def pytest_terminal_summary(self, terminalreporter):
        if self.screenshots_taken > 0:
            terminalreporter.write_sep("=", "SCREENSHOTS")
            terminalreporter.write_line(
                f"Screenshots capturados: {self.screenshots_taken}"
            )
            terminalreporter.write_line(f"Directorio: {self.output_dir}")


def pytest_addoption(parser):
    """Agregar opciones de linea de comandos."""
    group = parser.getgroup("screenshot", "Screenshot capture options")
    group.addoption(
        "--screenshot-dir",
        default="reports/screenshots",
        help="Directorio para guardar screenshots de fallos"
    )

def pytest_configure(config):
    """Registrar el plugin."""
    screenshot_dir = config.getoption("--screenshot-dir", "reports/screenshots")
    config.pluginmanager.register(
        ScreenshotPlugin(screenshot_dir),
        "screenshot-plugin"
    )

# Uso: pytest tests/ --screenshot-dir=my-screenshots/</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Ejercicio Practico</h4>
            <p>Crea un plugin personalizado de pytest para tu framework de Playwright:</p>
            <ol>
                <li>Instala <code>pytest-html</code>, <code>pytest-xdist</code> y <code>pytest-rerunfailures</code></li>
                <li>Configura el reporte HTML con screenshots adjuntos en caso de fallo</li>
                <li>Implementa un hook <code>pytest_terminal_summary</code> que muestre la tasa de exito</li>
                <li>Crea un plugin que registre el tiempo de ejecucion de cada test y genere un top-10 de los mas lentos</li>
                <li>Configura <code>pyproject.toml</code> con los plugins y opciones por defecto</li>
            </ol>

            <pre><code class="python"># pyproject.toml esperado:
# [tool.pytest.ini_options]
# addopts = """
#     --html=reports/report.html
#     --self-contained-html
#     --reruns 2
#     --timeout 60
#     -v --tb=short
# """</code></pre>
        </div>

        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>En la siguiente leccion</strong> exploraras los
            <strong>patrones de test: AAA, Builder y Factory</strong>, aprendiendo a estructurar
            tus tests con patrones de diseño que mejoran la legibilidad y mantenibilidad.</p>
        </div>
    `,
    topics: ["plugins", "extensiones", "pytest"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_119 = LESSON_119;
}
