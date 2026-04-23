/**
 * Playwright Academy - Lección 020
 * Ejercicio integrador: primer test suite
 * Sección 2: Fundamentos de Playwright
 */

const LESSON_020 = {
    id: 20,
    title: "Ejercicio integrador: primer test suite",
    duration: "10 min",
    level: "beginner",
    section: "section-02",
    content: `
        <h2>🚀 Ejercicio integrador: primer test suite</h2>
        <p>En esta lección integradora pondrás en práctica todo lo aprendido en la Sección 2.
        Vas a construir un test suite completo con navegación, assertions, interacciones,
        screenshots, fixtures, timeouts, logging y marcadores.</p>

        <h3>📋 El proyecto: Test Suite para "The Internet"</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Vamos a automatizar tests sobre <code>https://the-internet.herokuapp.com</code>,
            un sitio diseñado específicamente para practicar automatización.</p>
            <p><strong>Objetivo:</strong> Crear un mini framework con conftest.py,
            múltiples archivos de tests, y buenas prácticas.</p>
        </div>

        <h3>🗂️ Paso 1: Estructura del proyecto</h3>
        <div class="code-tabs" data-code-id="L020-1">
            <div class="code-tabs-header">
                <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                    <span class="code-tab-icon">🐍</span> Python
                </button>
                <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                    <span class="code-tab-icon">🔷</span> TypeScript
                </button>
                <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar código">📋</button>
            </div>
            <div class="code-panel active" data-lang="python">
                <pre><code class="language-bash"># Crear la estructura
mkdir -p tests/screenshots tests/traces
touch tests/__init__.py
touch tests/conftest.py
touch tests/test_smoke.py
touch tests/test_formularios.py
touch tests/test_navegacion.py</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <div class="code-note">
                    <span class="code-note-icon">ℹ️</span>
                    <span class="code-note-text">Equivalente con Playwright Test (TypeScript):</span>
                </div>
                <pre><code class="language-bash"># Crear la estructura
mkdir -p tests/screenshots tests/traces
# No se necesita __init__.py en TypeScript

# Crear archivos de test
touch tests/smoke.spec.ts
touch tests/formularios.spec.ts
touch tests/navegacion.spec.ts

# Crear archivo de configuración
touch playwright.config.ts</code></pre>
            </div>
        </div>
        <pre><code>tests/
├── conftest.py              # Fixtures y configuración
├── test_smoke.py            # Tests de humo
├── test_formularios.py      # Tests de formularios
├── test_navegacion.py       # Tests de navegación
├── screenshots/             # Capturas
└── traces/                  # Traces de debug</code></pre>

        <h3>🔧 Paso 2: conftest.py completo</h3>
        <div class="code-tabs" data-code-id="L020-2">
            <div class="code-tabs-header">
                <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                    <span class="code-tab-icon">🐍</span> Python
                </button>
                <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                    <span class="code-tab-icon">🔷</span> TypeScript
                </button>
                <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar código">📋</button>
            </div>
            <div class="code-panel active" data-lang="python">
                <pre><code class="language-python"># tests/conftest.py
import pytest
import logging
from playwright.sync_api import Page

# --- Logging ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger("suite")

# --- Registrar marcadores ---
def pytest_configure(config):
    config.addinivalue_line("markers", "smoke: Tests de humo críticos")
    config.addinivalue_line("markers", "regression: Tests de regresión")
    config.addinivalue_line("markers", "slow: Tests lentos")

# --- Base URL ---
@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "base_url": "https://the-internet.herokuapp.com",
        "viewport": {"width": 1280, "height": 720},
    }

# --- Timeout global ---
@pytest.fixture(autouse=True)
def configurar_pagina(page: Page):
    page.set_default_timeout(10000)
    page.set_default_navigation_timeout(15000)
    yield page

# --- Logging por test ---
@pytest.fixture(autouse=True)
def log_test(request):
    test_name = request.node.name
    logger.info(f"INICIO: {test_name}")
    yield
    logger.info(f"FIN: {test_name}")

# --- Screenshot al fallar ---
@pytest.fixture(autouse=True)
def screenshot_on_failure(page: Page, request):
    yield
    if request.node.rep_call.failed:
        test_name = request.node.name
        page.screenshot(path=f"tests/screenshots/{test_name}.png")
        logger.error(f"Screenshot guardado: {test_name}.png")

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    rep = outcome.get_result()
    setattr(item, f"rep_{rep.when}", rep)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 10000,
    expect: { timeout: 5000 },
    use: {
        baseURL: 'https://the-internet.herokuapp.com',
        viewport: { width: 1280, height: 720 },
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },
    outputDir: 'tests/screenshots',
    reporter: [['list'], ['html', { open: 'never' }]],
    projects: [
        {
            name: 'smoke',
            grep: /@smoke/,
        },
        {
            name: 'regression',
            grep: /@regression/,
        },
    ],
});

// Nota: En Playwright Test, la configuración global reemplaza
// a conftest.py. Las fixtures se definen con test.beforeEach,
// test.afterEach, y test.extend.</code></pre>
            </div>
        </div>

        <h3>✅ Paso 3: Tests de humo (smoke)</h3>
        <div class="code-tabs" data-code-id="L020-3">
            <div class="code-tabs-header">
                <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                    <span class="code-tab-icon">🐍</span> Python
                </button>
                <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                    <span class="code-tab-icon">🔷</span> TypeScript
                </button>
                <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar código">📋</button>
            </div>
            <div class="code-panel active" data-lang="python">
                <pre><code class="language-python"># tests/test_smoke.py
import pytest
from playwright.sync_api import Page, expect

@pytest.mark.smoke
class TestSmoke:
    """Tests de humo: verifican que el sitio está operativo."""

    def test_pagina_principal_carga(self, page: Page):
        """Verificar que la página principal carga correctamente."""
        page.goto("/")
        expect(page).to_have_title("The Internet")
        expect(page.locator("h1")).to_have_text("Welcome to the-internet")

    def test_links_principales_visibles(self, page: Page):
        """Verificar que los links principales están presentes."""
        page.goto("/")
        links = page.locator("#content ul li a")
        expect(links.first).to_be_visible()
        count = links.count()
        assert count > 10, f"Se esperaban más de 10 links, hay {count}"

    def test_pagina_404(self, page: Page):
        """Verificar que la página 404 funciona."""
        page.goto("/pagina-que-no-existe")
        expect(page.locator("h1")).to_have_text("Not Found")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// tests/smoke.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Smoke Tests @smoke', { tag: '@smoke' }, () => {
    test('pagina principal carga', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle('The Internet');
        await expect(page.locator('h1')).toHaveText('Welcome to the-internet');
    });

    test('links principales visibles', async ({ page }) => {
        await page.goto('/');
        const links = page.locator('#content ul li a');
        await expect(links.first()).toBeVisible();
        const count = await links.count();
        expect(count).toBeGreaterThan(10);
    });

    test('pagina 404', async ({ page }) => {
        await page.goto('/pagina-que-no-existe');
        await expect(page.locator('h1')).toHaveText('Not Found');
    });
});</code></pre>
            </div>
        </div>

        <h3>📝 Paso 4: Tests de formularios</h3>
        <div class="code-tabs" data-code-id="L020-4">
            <div class="code-tabs-header">
                <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                    <span class="code-tab-icon">🐍</span> Python
                </button>
                <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                    <span class="code-tab-icon">🔷</span> TypeScript
                </button>
                <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar código">📋</button>
            </div>
            <div class="code-panel active" data-lang="python">
                <pre><code class="language-python"># tests/test_formularios.py
import pytest
from playwright.sync_api import Page, expect

@pytest.mark.regression
class TestFormularios:
    """Tests de interacción con formularios."""

    def test_login_exitoso(self, page: Page):
        """Login con credenciales válidas."""
        page.goto("/login")
        page.fill("#username", "tomsmith")
        page.fill("#password", "SuperSecretPassword!")
        page.click("button[type='submit']")

        expect(page).to_have_url("**/secure")
        expect(page.locator("#flash")).to_contain_text("You logged into a secure area!")

    def test_login_fallido(self, page: Page):
        """Login con credenciales inválidas."""
        page.goto("/login")
        page.fill("#username", "usuario_malo")
        page.fill("#password", "clave_mala")
        page.click("button[type='submit']")

        expect(page.locator("#flash")).to_contain_text("Your username is invalid!")

    def test_checkboxes(self, page: Page):
        """Interacción con checkboxes."""
        page.goto("/checkboxes")
        checkbox1 = page.locator("#checkboxes input").first
        checkbox2 = page.locator("#checkboxes input").last

        # El primero está desmarcado, el segundo marcado
        expect(checkbox1).not_to_be_checked()
        expect(checkbox2).to_be_checked()

        # Marcar el primero
        checkbox1.check()
        expect(checkbox1).to_be_checked()

    @pytest.mark.parametrize("opcion", ["Option 1", "Option 2"])
    def test_dropdown(self, page: Page, opcion: str):
        """Test parametrizado: seleccionar opciones del dropdown."""
        page.goto("/dropdown")
        page.select_option("#dropdown", label=opcion)
        expect(page.locator("#dropdown")).to_have_value(
            "1" if opcion == "Option 1" else "2"
        )</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// tests/formularios.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Formularios @regression', { tag: '@regression' }, () => {
    test('login exitoso', async ({ page }) => {
        await page.goto('/login');
        await page.fill('#username', 'tomsmith');
        await page.fill('#password', 'SuperSecretPassword!');
        await page.click("button[type='submit']");

        await expect(page).toHaveURL('**/secure');
        await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
    });

    test('login fallido', async ({ page }) => {
        await page.goto('/login');
        await page.fill('#username', 'usuario_malo');
        await page.fill('#password', 'clave_mala');
        await page.click("button[type='submit']");

        await expect(page.locator('#flash')).toContainText('Your username is invalid!');
    });

    test('checkboxes', async ({ page }) => {
        await page.goto('/checkboxes');
        const checkbox1 = page.locator('#checkboxes input').first();
        const checkbox2 = page.locator('#checkboxes input').last();

        // El primero está desmarcado, el segundo marcado
        await expect(checkbox1).not.toBeChecked();
        await expect(checkbox2).toBeChecked();

        // Marcar el primero
        await checkbox1.check();
        await expect(checkbox1).toBeChecked();
    });

    for (const opcion of ['Option 1', 'Option 2']) {
        test('dropdown - ' + opcion, async ({ page }) => {
            await page.goto('/dropdown');
            await page.selectOption('#dropdown', { label: opcion });
            await expect(page.locator('#dropdown')).toHaveValue(
                opcion === 'Option 1' ? '1' : '2'
            );
        });
    }
});</code></pre>
            </div>
        </div>

        <h3>🧭 Paso 5: Tests de navegación</h3>
        <div class="code-tabs" data-code-id="L020-5">
            <div class="code-tabs-header">
                <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                    <span class="code-tab-icon">🐍</span> Python
                </button>
                <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                    <span class="code-tab-icon">🔷</span> TypeScript
                </button>
                <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar código">📋</button>
            </div>
            <div class="code-panel active" data-lang="python">
                <pre><code class="language-python"># tests/test_navegacion.py
import pytest
from playwright.sync_api import Page, expect

@pytest.mark.regression
class TestNavegacion:
    """Tests de navegación y estados de página."""

    def test_navegar_ida_y_vuelta(self, page: Page):
        """Navegar a una subpágina y volver."""
        page.goto("/")
        page.click("a[href='/login']")
        expect(page).to_have_url("**/login")

        page.go_back()
        expect(page).to_have_url("**/")
        expect(page.locator("h1")).to_have_text("Welcome to the-internet")

    def test_multiple_paginas(self, page: Page):
        """Navegar por varias páginas del sitio."""
        paginas = [
            ("/login", "Login Page"),
            ("/checkboxes", "Checkboxes"),
            ("/dropdown", "Dropdown List"),
        ]

        for url, titulo in paginas:
            page.goto(url)
            heading = page.locator("h3").first
            expect(heading).to_have_text(titulo)

    @pytest.mark.slow
    def test_screenshot_multiples_paginas(self, page: Page):
        """Capturar screenshots de varias páginas."""
        paginas = ["login", "checkboxes", "dropdown", "inputs"]

        for nombre in paginas:
            page.goto(f"/{nombre}")
            page.screenshot(
                path=f"tests/screenshots/{nombre}.png",
                full_page=True
            )</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// tests/navegacion.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Navegación @regression', { tag: '@regression' }, () => {
    test('navegar ida y vuelta', async ({ page }) => {
        await page.goto('/');
        await page.click("a[href='/login']");
        await expect(page).toHaveURL('**/login');

        await page.goBack();
        await expect(page).toHaveURL('**/');
        await expect(page.locator('h1')).toHaveText('Welcome to the-internet');
    });

    test('multiple paginas', async ({ page }) => {
        const paginas = [
            { url: '/login', titulo: 'Login Page' },
            { url: '/checkboxes', titulo: 'Checkboxes' },
            { url: '/dropdown', titulo: 'Dropdown List' },
        ];

        for (const { url, titulo } of paginas) {
            await page.goto(url);
            const heading = page.locator('h3').first();
            await expect(heading).toHaveText(titulo);
        }
    });

    test('screenshot multiples paginas @slow', { tag: '@slow' }, async ({ page }) => {
        const paginas = ['login', 'checkboxes', 'dropdown', 'inputs'];

        for (const nombre of paginas) {
            await page.goto('/' + nombre);
            await page.screenshot({
                path: 'tests/screenshots/' + nombre + '.png',
                fullPage: true,
            });
        }
    });
});</code></pre>
            </div>
        </div>

        <h3>▶️ Paso 6: Ejecutar la suite</h3>
        <div class="code-tabs" data-code-id="L020-6">
            <div class="code-tabs-header">
                <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                    <span class="code-tab-icon">🐍</span> Python
                </button>
                <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                    <span class="code-tab-icon">🔷</span> TypeScript
                </button>
                <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar código">📋</button>
            </div>
            <div class="code-panel active" data-lang="python">
                <pre><code class="language-bash"># Ejecutar todos los tests
pytest tests/ -v

# Solo smoke tests
pytest tests/ -m smoke -v

# Solo regression (sin lentos)
pytest tests/ -m "regression and not slow" -v

# Con screenshots y videos automáticos
pytest tests/ -v --screenshot=only-on-failure --video=retain-on-failure --output=test-results/

# Con trace para debugging
pytest tests/ -v --tracing=retain-on-failure

# Reporte detallado
pytest tests/ -v --tb=short 2>&1 | tee reporte.txt</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <div class="code-note">
                    <span class="code-note-icon">ℹ️</span>
                    <span class="code-note-text">Equivalente con Playwright Test (TypeScript):</span>
                </div>
                <pre><code class="language-bash"># Ejecutar todos los tests
npx playwright test

# Solo smoke tests
npx playwright test --grep @smoke

# Solo regression (sin lentos)
npx playwright test --grep @regression --grep-invert @slow

# Con screenshots y trace (configurado en playwright.config.ts)
npx playwright test --trace on

# Con reporte HTML
npx playwright test --reporter=html

# Ver el reporte
npx playwright show-report</code></pre>
            </div>
        </div>

        <h3>📊 Resumen de la Sección 2</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎉 ¡Sección 2 Completada!</h4>
            <p>Has aprendido los fundamentos de Playwright con pytest:</p>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #c8e6c9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Lección</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Concepto</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">011</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Anatomía de un test y patrón AAA</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">012</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Navegación: goto, go_back, reload</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">013</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Assertions con expect() y auto-waiting</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">014</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Interacciones: click, fill, type</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">015</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Screenshots y grabación de video</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">016</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Setup y Teardown con fixtures</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">017</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Manejo de timeouts</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">018</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Logging y Trace Viewer</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">019</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Tags y marcadores pytest</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">020</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Ejercicio integrador completo</td>
                </tr>
            </table>
        </div>

        <h3>🎯 Ejercicio final</h3>
        <ol>
            <li>Crea la estructura de proyecto completa como se muestra arriba</li>
            <li>Implementa todos los archivos: conftest.py, test_smoke.py, test_formularios.py, test_navegacion.py</li>
            <li>Ejecuta la suite completa: <code>pytest tests/ -v</code></li>
            <li>Ejecuta solo los smoke: <code>pytest tests/ -m smoke -v</code></li>
            <li>Genera evidencias: <code>pytest tests/ -v --screenshot=on --output=test-results/</code></li>
            <li>Si algún test falla, usa <code>--tracing=on</code> para diagnosticar</li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Integrar todos los conceptos de la Sección 2 en un proyecto real</li>
                <li>Crear un conftest.py profesional con logging, timeouts y screenshots</li>
                <li>Organizar tests en clases con marcadores</li>
                <li>Ejecutar la suite con diferentes filtros y opciones</li>
            </ul>
        </div>

        <h3>🚀 Siguiente: Sección 3 - Python para Testers QA</h3>
        <p>En la siguiente sección profundizaremos en las habilidades de Python
        esenciales para QA: variables, funciones, manejo de archivos, clases
        y configuración multi-ambiente.</p>
    `,
    topics: ["integración", "test-suite", "proyecto"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 10,
    difficulty: "medium",
    type: "integration"
};

if (typeof window !== 'undefined') {
    window.LESSON_020 = LESSON_020;
}
