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

        <div class="code-tabs" data-code-id="L119-1">
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
<pre><code class="language-python"># Fixtures que pytest-playwright inyecta automaticamente:

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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// Playwright Test provee fixtures integrados automaticamente:
import { test, expect, Browser, BrowserContext } from '@playwright/test';

test('basic navigation', async ({ page }) => {
    // 'page' es un fixture de Playwright Test: pagina nueva en contexto limpio.
    await page.goto('https://example.com');
    await expect(page).toHaveTitle('Example Domain');
});

test('with context', async ({ context }) => {
    // 'context' es un BrowserContext fresco.
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    // Dos paginas en el mismo contexto (comparten cookies)
});

test('with browser', async ({ browser }) => {
    // 'browser' es la instancia del navegador.
    const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await context.newPage();
    await page.goto('https://example.com');
    await context.close();
});

// Configurar el browser desde linea de comandos:
// npx playwright test --project=chromium        (default)
// npx playwright test --project=firefox
// npx playwright test --project=webkit
// npx playwright test --project=chromium --project=firefox  (ambos)
// npx playwright test --headed                  (modo visible)
// PWDEBUG=1 npx playwright test                 (modo debug)</code></pre>
</div>
</div>

        <h3>pytest-html: Reportes enriquecidos</h3>

        <div class="code-tabs" data-code-id="L119-2">
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
<pre><code class="language-python"># conftest.py - Enriquecer reporte HTML con screenshots
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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// playwright.config.ts - Reportes HTML con screenshots automaticos
import { defineConfig } from '@playwright/test';

export default defineConfig({
    // Playwright captura screenshots automaticamente en fallos
    use: {
        screenshot: 'only-on-failure',  // Captura screenshot al fallar
        trace: 'retain-on-failure',     // Guarda trace al fallar
        video: 'retain-on-failure',     // Guarda video al fallar
    },

    // Reporte HTML integrado (equivalente a pytest-html)
    reporter: [
        ['html', {
            outputFolder: 'reports/html-report',
            open: 'never',  // 'always' | 'never' | 'on-failure'
        }],
        ['list'],  // Reporte en consola
    ],
});

// Para adjuntar screenshots o info extra manualmente en un test:
import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test('ejemplo con attachment manual', async ({ page }, testInfo) => {
    await page.goto('https://example.com');

    // Adjuntar screenshot manualmente
    const screenshot = await page.screenshot();
    await testInfo.attach('screenshot-manual', {
        body: screenshot,
        contentType: 'image/png',
    });

    // Adjuntar la URL actual al reporte
    await testInfo.attach('url-al-fallar', {
        body: page.url(),
        contentType: 'text/plain',
    });
});

// Ejecucion:
// npx playwright test --reporter=html
// npx playwright show-report reports/html-report</code></pre>
</div>
</div>

        <h3>pytest-xdist: Ejecucion paralela</h3>

        <div class="code-tabs" data-code-id="L119-3">
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
<pre><code class="language-python"># Ejecucion paralela basica
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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// playwright.config.ts - Ejecucion paralela integrada
import { defineConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export default defineConfig({
    // Playwright tiene ejecucion paralela integrada (sin plugin adicional)
    workers: undefined,    // 'undefined' = auto (50% de CPUs)
    // workers: 4,          // 4 workers fijos
    fullyParallel: true,   // Ejecutar tests dentro de un archivo en paralelo

    // IMPORTANTE: Cada worker obtiene su propio browser.
    // Asegurate de que los tests son independientes (no comparten estado).
});

// Ejecucion paralela desde linea de comandos:
// npx playwright test --workers=auto       // Usa 50% de CPUs
// npx playwright test --workers=4          // 4 workers
// npx playwright test --fully-parallel     // Paralelizar todo

// globalSetup.ts - Datos de sesion compartidos entre workers
// (equivalente al patron session-scoped + FileLock de pytest-xdist)
import { FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig): Promise&lt;void&gt; {
    const dataFile = path.join(__dirname, 'test-data', 'session_data.json');

    if (!fs.existsSync(dataFile)) {
        // Crear datos de sesion una sola vez antes de todos los workers
        const data = await setupTestData();
        fs.mkdirSync(path.dirname(dataFile), { recursive: true });
        fs.writeFileSync(dataFile, JSON.stringify(data));
    }
}

async function setupTestData(): Promise&lt;Record&lt;string, unknown&gt;&gt; {
    // Inicializar datos de prueba
    return { users: [], config: {} };
}

export default globalSetup;

// En playwright.config.ts, agregar:
// globalSetup: require.resolve('./globalSetup'),</code></pre>
</div>
</div>

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

        <div class="code-tabs" data-code-id="L119-4">
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
<pre><code class="language-python"># tests/step_defs/test_login_steps.py
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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// tests/login.spec.ts - BDD-style con Playwright Test
// Playwright no usa Gherkin nativamente, pero se puede estructurar
// con test.describe + test.step para un estilo BDD claro.
// Alternativa: usar playwright-bdd (npm install playwright-bdd)
import { test, expect } from '@playwright/test';

test.describe('Login de usuario', () => {
    test('Login exitoso con credenciales validas', async ({ page }) => {
        // Given: estoy en la pagina de login
        await test.step('estoy en la pagina de login', async () => {
            await page.goto('/auth/login');
            await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
        });

        // When: ingreso credenciales y hago click
        await test.step('ingreso el usuario "admin@siesa.com"', async () => {
            await page.fill('[data-testid="username-input"]', 'admin@siesa.com');
        });

        await test.step('ingreso la contrasena "Test1234!"', async () => {
            await page.fill('[data-testid="password-input"]', 'Test1234!');
        });

        await test.step('hago click en "Iniciar Sesion"', async () => {
            await page.getByRole('button', { name: 'Iniciar Sesion' }).click();
        });

        // Then: verificar dashboard
        await test.step('debo ver el dashboard principal', async () => {
            await page.waitForURL('**/dashboard');
            await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
        });

        await test.step('el mensaje de bienvenida debe mostrar "admin"', async () => {
            await expect(page.locator('[data-testid="welcome-message"]'))
                .toContainText('admin');
        });
    });

    test('Login fallido con contrasena incorrecta', async ({ page }) => {
        await page.goto('/auth/login');
        await page.fill('[data-testid="username-input"]', 'admin@siesa.com');
        await page.fill('[data-testid="password-input"]', 'incorrecta');
        await page.getByRole('button', { name: 'Iniciar Sesion' }).click();

        await expect(page.locator('[data-testid="error-message"]'))
            .toHaveText('Credenciales invalidas');
    });
});</code></pre>
</div>
</div>

        <h3>Hooks avanzados de pytest</h3>
        <p>Los hooks son puntos de extension que pytest ejecuta en momentos especificos del ciclo de vida:</p>

        <div class="code-tabs" data-code-id="L119-5">
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
<pre><code class="language-python"># conftest.py - Hooks avanzados

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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// playwright.config.ts - Configuracion avanzada (equivalente a hooks de pytest)
import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test';

export default defineConfig({
    // Equivalente a pytest_configure: registrar "marcadores" via proyectos y tags
    projects: [
        {
            name: 'smoke',
            testMatch: /.*\.smoke\.spec\.ts/,
            // O usar grep para filtrar por tag: @smoke
        },
        {
            name: 'regression',
            testMatch: /.*regression.*/,
            timeout: 120_000, // Tests de regresion tienen mas tiempo
        },
        {
            name: 'api',
            testMatch: /.*\.api\.spec\.ts/,
            use: { /* sin browser */ },
        },
    ],

    // Equivalente a --run-slow: skip tests lentos por defecto
    // Usar: npx playwright test --project=regression
    // O con tags: npx playwright test --grep @slow
});

// Equivalente a hooks avanzados via fixtures personalizados:
import { test as base, expect } from '@playwright/test';

// Fixture personalizado que se ejecuta antes de cada test
const test = base.extend&lt;{ slowGuard: void }&gt;({
    slowGuard: [async ({}, use, testInfo) => {
        // Equivalente a pytest_runtest_setup: skip tests lentos
        if (testInfo.tags.includes('@slow')) {
            const runSlow = process.env.RUN_SLOW === 'true';
            if (!runSlow) {
                test.skip(true, 'Test lento - usar RUN_SLOW=true para ejecutar');
            }
        }
        await use();
    }, { auto: true }],
});

// Reporter personalizado (equivalente a pytest_terminal_summary)
// reporters/success-rate-reporter.ts
import type { Reporter, FullResult, TestCase, TestResult } from '@playwright/test/reporter';

class SuccessRateReporter implements Reporter {
    private passed = 0;
    private failed = 0;

    onTestEnd(test: TestCase, result: TestResult): void {
        if (result.status === 'passed') this.passed++;
        if (result.status === 'failed') this.failed++;
    }

    onEnd(result: FullResult): void {
        const total = this.passed + this.failed;
        if (total > 0) {
            const rate = (this.passed / total) * 100;
            console.log(\`\\n${'='.repeat(60)}\`);
            console.log(\`TASA DE EXITO: \${rate.toFixed(1)}%\`);
            if (rate < 95) {
                console.error('ALERTA: La tasa de exito esta por debajo del 95%');
            }
            console.log(\`${'='.repeat(60)}\\n\`);
        }
    }
}
export default SuccessRateReporter;

// En playwright.config.ts, agregar:
// reporter: [['./reporters/success-rate-reporter.ts'], ['html']],

// Ejecucion con tags (equivalente a markers de pytest):
// npx playwright test --grep @smoke
// npx playwright test --grep-invert @slow
// npx playwright test --project=regression</code></pre>
</div>
</div>

        <h3>Crear tu propio plugin de pytest</h3>

        <div class="code-tabs" data-code-id="L119-6">
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
<pre><code class="language-python"># pytest_screenshot_plugin.py - Plugin personalizado
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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// reporters/screenshot-reporter.ts - Reporter personalizado
// Equivalente al plugin de pytest para captura de screenshots.
// En Playwright, los screenshots en fallos son nativos, pero este reporter
// agrega tracking y resumen personalizado.
import type {
    Reporter, FullConfig, Suite, TestCase, TestResult, FullResult
} from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

interface ScreenshotReporterOptions {
    outputDir?: string;
}

class ScreenshotReporter implements Reporter {
    private outputDir: string;
    private screenshotsTaken = 0;

    constructor(options: ScreenshotReporterOptions = {}) {
        this.outputDir = options.outputDir || 'reports/screenshots';
    }

    onTestEnd(test: TestCase, result: TestResult): void {
        if (result.status === 'failed') {
            // Copiar screenshots adjuntos al directorio personalizado
            for (const attachment of result.attachments) {
                if (attachment.contentType === 'image/png' && attachment.path) {
                    fs.mkdirSync(this.outputDir, { recursive: true });
                    const name = test.title.replace(/\\s+/g, '_').slice(0, 60);
                    const ts = new Date().toISOString().replace(/[:.]/g, '');
                    const destPath = path.join(
                        this.outputDir,
                        \`FAIL_\${name}_\${ts}.png\`
                    );
                    fs.copyFileSync(attachment.path, destPath);
                    this.screenshotsTaken++;
                }
            }
        }
    }

    onEnd(result: FullResult): void {
        if (this.screenshotsTaken > 0) {
            console.log(\`\\n${'='.repeat(60)}\`);
            console.log('SCREENSHOTS');
            console.log(\`Screenshots capturados: \${this.screenshotsTaken}\`);
            console.log(\`Directorio: \${this.outputDir}\`);
            console.log(\`${'='.repeat(60)}\\n\`);
        }
    }
}

export default ScreenshotReporter;

// playwright.config.ts - Registrar el reporter
// import { defineConfig } from '@playwright/test';
//
// export default defineConfig({
//     use: {
//         screenshot: 'only-on-failure',  // Captura nativa en fallos
//     },
//     reporter: [
//         ['./reporters/screenshot-reporter.ts', {
//             outputDir: 'my-screenshots',
//         }],
//         ['html'],
//     ],
// });
//
// Uso: npx playwright test</code></pre>
</div>
</div>

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

            <div class="code-tabs" data-code-id="L119-7">
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
<pre><code class="language-python"># pyproject.toml esperado:
# [tool.pytest.ini_options]
# addopts = """
#     --html=reports/report.html
#     --self-contained-html
#     --reruns 2
#     --timeout 60
#     -v --tb=short
# """</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// playwright.config.ts esperado:
import { defineConfig } from '@playwright/test';

export default defineConfig({
    // Equivalente a --html=reports/report.html --self-contained-html
    reporter: [
        ['html', { outputFolder: 'reports/html-report', open: 'never' }],
        ['list'],
    ],

    // Equivalente a --reruns 2
    retries: 2,

    // Equivalente a --timeout 60
    timeout: 60_000,

    // Equivalente a -v --tb=short
    use: {
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
});</code></pre>
</div>
</div>
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
