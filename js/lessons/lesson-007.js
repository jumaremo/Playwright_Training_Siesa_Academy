/**
 * Playwright Academy - Lección 007
 * Configuración pytest para Playwright
 * Sección 1: Configuración del Entorno
 */

const LESSON_007 = {
    id: 7,
    title: "Configuración pytest para Playwright",
    duration: "5 min",
    level: "beginner",
    section: "section-01",
    content: `
        <h2>⚙️ Configuración pytest para Playwright</h2>
        <p>El plugin <code>pytest-playwright</code> provee fixtures y configuración específica.
        Aprendamos a personalizarlo para nuestras necesidades.</p>

        <h3>🔧 Fixtures que provee pytest-playwright</h3>
        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #e8f5e9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Fixture</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Scope</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripción</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>page</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">function</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Página nueva aislada para cada test</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>context</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">function</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Browser Context — para crear múltiples páginas</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>browser</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">session</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Instancia del navegador compartida</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>browser_name</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">session</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Nombre del navegador actual ("chromium", "firefox", "webkit")</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>browser_type</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">session</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Tipo del navegador para crear instancias</td>
                </tr>
            </table>
        </div>

        <h3>📋 Opciones de línea de comandos</h3>
        <div class="code-tabs" data-code-id="L007-1">
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
                <pre><code class="language-bash"># Ejecutar con navegador visible
pytest --headed

# Elegir navegador
pytest --browser chromium
pytest --browser firefox
pytest --browser webkit

# Ejecutar en múltiples navegadores
pytest --browser chromium --browser firefox

# Modo lento (para debugging visual)
pytest --headed --slowmo 500

# Generar tracing para cada test
pytest --tracing on

# Capturar screenshots en fallos
pytest --screenshot on

# Capturar video en fallos
pytest --video on

# Base URL para evitar repetir URLs
pytest --base-url https://mi-app.com</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <div class="code-note">
                    <span class="code-note-icon">ℹ️</span>
                    <span class="code-note-text">Equivalente con Playwright Test (TypeScript):</span>
                </div>
                <pre><code class="language-bash"># Ejecutar con navegador visible
npx playwright test --headed

# Elegir navegador (proyecto en playwright.config.ts)
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Ejecutar en múltiples navegadores
npx playwright test --project=chromium --project=firefox

# Modo debug (equivalente a --headed --slowmo)
npx playwright test --debug

# Generar tracing para cada test
npx playwright test --trace on

# Capturar screenshots en fallos (configurar en playwright.config.ts)
# screenshot: 'only-on-failure'

# Capturar video en fallos (configurar en playwright.config.ts)
# video: 'retain-on-failure'

# Base URL (configurar en playwright.config.ts)
# baseURL: 'https://mi-app.com'</code></pre>
            </div>
        </div>

        <h3>📝 conftest.py avanzado</h3>
        <div class="code-tabs" data-code-id="L007-2">
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
                <pre><code class="language-python"># conftest.py
import pytest
from playwright.sync_api import Page


# --- Configuración del navegador ---
@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "viewport": {"width": 1920, "height": 1080},
        "locale": "es-CO",
        "timezone_id": "America/Bogota",
        "permissions": ["geolocation"],
        "ignore_https_errors": True,
    }


# --- Base URL centralizada ---
@pytest.fixture(scope="session")
def base_url():
    """URL base configurable por entorno."""
    import os
    return os.getenv("BASE_URL", "https://demo.playwright.dev/todomvc/")


# --- Screenshot en fallos ---
@pytest.fixture(autouse=True)
def capture_on_failure(page: Page, request):
    """Captura screenshot automáticamente cuando un test falla."""
    yield
    if request.node.rep_call and request.node.rep_call.failed:
        page.screenshot(path=f"test-results/{request.node.name}.png")


@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Hook para acceder al resultado del test en fixtures."""
    import pluggy
    outcome = yield
    rep = outcome.get_result()
    setattr(item, f"rep_{rep.when}", rep)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    // --- Configuración del navegador ---
    use: {
        viewport: { width: 1920, height: 1080 },
        locale: 'es-CO',
        timezoneId: 'America/Bogota',
        permissions: ['geolocation'],
        ignoreHTTPSErrors: true,

        // --- Base URL centralizada ---
        baseURL: process.env.BASE_URL || 'https://demo.playwright.dev/todomvc/',

        // --- Screenshot en fallos ---
        screenshot: 'only-on-failure',

        // --- Trace en fallos ---
        trace: 'retain-on-failure',
    },

    // --- Output directory para screenshots/videos ---
    outputDir: 'test-results/',

    // --- Proyectos (equivalente a multi-browser) ---
    projects: [
        { name: 'chromium', use: { browserName: 'chromium' } },
        { name: 'firefox', use: { browserName: 'firefox' } },
        { name: 'webkit', use: { browserName: 'webkit' } },
    ],
});</code></pre>
            </div>
        </div>

        <h3>📄 pyproject.toml (alternativa moderna a pytest.ini)</h3>
        <div class="code-tabs" data-code-id="L007-3">
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
                <pre><code class="language-toml"># pyproject.toml
[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "-v --tb=short"
markers = [
    "smoke: Tests de humo rápidos",
    "regression: Tests de regresión completa",
    "slow: Tests que toman más de 30s",
]

# Variables de entorno para tests
[tool.pytest.ini_options.env]
BASE_URL = "https://demo.playwright.dev/todomvc/"</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <div class="code-note info">
                    <span class="code-note-icon">ℹ️</span>
                    <span class="code-note-text">En TypeScript, la configuración equivalente va en playwright.config.ts:</span>
                </div>
                <pre><code class="language-typescript">// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    reporter: [['html'], ['list']],
    // Tags: se usan con @tag en test.describe o --grep
    // npx playwright test --grep @smoke
    // npx playwright test --grep @regression
    use: {
        baseURL: process.env.BASE_URL || 'https://demo.playwright.dev/todomvc/',
    },
});</code></pre>
            </div>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <ol>
            <li>Actualiza tu <code>conftest.py</code> con la versión avanzada de arriba</li>
            <li>Ejecuta los mismos tests con diferentes opciones:
                <br>- <code>pytest -v --headed --slowmo 1000</code>
                <br>- <code>pytest -v --browser firefox</code>
                <br>- <code>pytest -v --screenshot on</code></li>
            <li>Agrega la base_url y modifica un test para usar rutas relativas:</li>
        </ol>
        <div class="code-tabs" data-code-id="L007-4">
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
                <pre><code class="language-python">def test_con_base_url(page: Page, base_url: str):
    page.goto(base_url)  # Usa la URL de la fixture
    expect(page).to_have_title(re.compile("TodoMVC"))</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('con base url', async ({ page }) => {
    await page.goto('/');  // Usa baseURL de playwright.config.ts
    await expect(page).toHaveTitle(/TodoMVC/);
});</code></pre>
            </div>
        </div>
        <ol start="4">
            <li>Haz que un test falle a propósito y verifica que se genera el screenshot</li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Conocer las fixtures de pytest-playwright y sus scopes</li>
                <li>Dominar las opciones de línea de comandos (--headed, --browser, --slowmo)</li>
                <li>Crear un conftest.py avanzado con configuración de viewport, locale y screenshots</li>
                <li>Usar base_url para centralizar la URL de la aplicación</li>
            </ul>
        </div>

        <div style="background: #fff3cd; padding: 10px; border-radius: 8px; margin: 10px 0;">
            <h4>💡 Tip:</h4>
            <p>La fixture <code>page</code> es nueva para cada test (scope=function), pero el
            <code>browser</code> se reutiliza en toda la sesión (scope=session). Esto hace los tests
            rápidos: no se reinicia el navegador entre tests, solo se crea un nuevo contexto.</p>
        </div>

        <h3>🚀 Siguiente: Lección 008 - Ejecución y selectores de tests</h3>
        <p>Aprenderemos formas avanzadas de ejecutar tests y filtrar por marcadores.</p>
    `,
    topics: ["pytest", "configuración", "conftest"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_007 = LESSON_007;
}
