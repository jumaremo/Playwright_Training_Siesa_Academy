/**
 * Playwright Academy - Lección 019
 * Tags y marcadores pytest
 * Sección 2: Fundamentos de Playwright
 */

const LESSON_019 = {
    id: 19,
    title: "Tags y marcadores pytest",
    duration: "5 min",
    level: "beginner",
    section: "section-02",
    content: `
        <h2>🏷️ Tags y marcadores pytest</h2>
        <p>Los marcadores (markers) de pytest te permiten categorizar y filtrar tests.
        Puedes ejecutar solo los tests de smoke, o solo los de regresión, o excluir
        los lentos. Es fundamental para organizar suites grandes.</p>

        <h3>📋 Marcadores básicos</h3>
        <div class="code-tabs" data-code-id="L019-1">
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
                <pre><code class="language-python"># test_login.py
import pytest
from playwright.sync_api import Page, expect

@pytest.mark.smoke
def test_login_exitoso(page: Page):
    """Test crítico: debe pasar siempre."""
    page.goto("/login")
    page.fill("#email", "admin@test.com")
    page.fill("#password", "secreto")
    page.click("#btn-login")
    expect(page).to_have_url("**/dashboard")

@pytest.mark.regression
def test_login_con_espacios(page: Page):
    """Test de regresión: caso borde."""
    page.goto("/login")
    page.fill("#email", "  admin@test.com  ")
    page.fill("#password", "secreto")
    page.click("#btn-login")
    expect(page).to_have_url("**/dashboard")

@pytest.mark.slow
def test_login_con_mfa(page: Page):
    """Test lento: incluye verificación MFA."""
    page.goto("/login")
    page.fill("#email", "admin@test.com")
    page.fill("#password", "secreto")
    page.click("#btn-login")
    # Simular proceso MFA...
    page.fill("#codigo-mfa", "123456")
    page.click("#verificar")
    expect(page).to_have_url("**/dashboard")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// test_login.spec.ts
import { test, expect } from '@playwright/test';

// Playwright Test usa test.describe y tags con @tag en el título
// o con test.describe.configure({ tag: '@smoke' })

test.describe('Login - Smoke', { tag: '@smoke' }, () => {
    test('login exitoso', async ({ page }) => {
        // Test crítico: debe pasar siempre.
        await page.goto('/login');
        await page.fill('#email', 'admin@test.com');
        await page.fill('#password', 'secreto');
        await page.click('#btn-login');
        await expect(page).toHaveURL('**/dashboard');
    });
});

test.describe('Login - Regression', { tag: '@regression' }, () => {
    test('login con espacios', async ({ page }) => {
        // Test de regresión: caso borde.
        await page.goto('/login');
        await page.fill('#email', '  admin@test.com  ');
        await page.fill('#password', 'secreto');
        await page.click('#btn-login');
        await expect(page).toHaveURL('**/dashboard');
    });
});

test.describe('Login - Slow', { tag: '@slow' }, () => {
    test('login con mfa', async ({ page }) => {
        // Test lento: incluye verificación MFA.
        await page.goto('/login');
        await page.fill('#email', 'admin@test.com');
        await page.fill('#password', 'secreto');
        await page.click('#btn-login');
        // Simular proceso MFA...
        await page.fill('#codigo-mfa', '123456');
        await page.click('#verificar');
        await expect(page).toHaveURL('**/dashboard');
    });
});</code></pre>
            </div>
        </div>

        <h3>🏃 Ejecutar por marcador</h3>
        <div class="code-tabs" data-code-id="L019-2">
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
                <pre><code class="language-bash"># Solo tests de smoke
pytest -m smoke

# Solo tests de regresión
pytest -m regression

# Excluir tests lentos
pytest -m "not slow"

# Combinaciones lógicas
pytest -m "smoke and not slow"
pytest -m "smoke or regression"
pytest -m "(smoke or regression) and not slow"</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <div class="code-note">
                    <span class="code-note-icon">ℹ️</span>
                    <span class="code-note-text">Equivalente con Playwright Test (TypeScript):</span>
                </div>
                <pre><code class="language-bash"># Solo tests con tag @smoke
npx playwright test --grep @smoke

# Solo tests con tag @regression
npx playwright test --grep @regression

# Excluir tests con tag @slow
npx playwright test --grep-invert @slow

# Combinaciones (regex)
npx playwright test --grep "(?=.*@smoke)(?!.*@slow)"
npx playwright test --grep "@smoke|@regression"</code></pre>
            </div>
        </div>

        <h3>📝 Registrar marcadores (buena práctica)</h3>
        <div class="code-tabs" data-code-id="L019-3">
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
                <pre><code class="language-python"># pytest.ini o pyproject.toml
# Registrar marcadores evita warnings de "unknown marker"

# pytest.ini:
# [pytest]
# markers =
#     smoke: Tests de humo - críticos, deben pasar siempre
#     regression: Tests de regresión
#     slow: Tests que tardan más de 30 segundos
#     api: Tests que dependen de la API
#     wip: Work in progress - tests en desarrollo</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// playwright.config.ts
// En Playwright Test, los tags se definen directamente
// en los tests y se filtran con --grep/--grep-invert.
// No es necesario registrarlos previamente.

// Convención de tags recomendada:
// @smoke   - Tests de humo críticos, deben pasar siempre
// @regression - Tests de regresión
// @slow    - Tests que tardan más de 30 segundos
// @api     - Tests que dependen de la API
// @wip     - Work in progress - tests en desarrollo

// Ejemplo de uso en tests:
// test('mi test @smoke @regression', ...)
// O con describe:
// test.describe('suite', { tag: ['@smoke', '@regression'] }, () => { ... })</code></pre>
            </div>
        </div>
        <div class="code-tabs" data-code-id="L019-4">
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
                <pre><code class="language-python"># O en conftest.py:
def pytest_configure(config):
    config.addinivalue_line("markers", "smoke: Tests de humo críticos")
    config.addinivalue_line("markers", "regression: Tests de regresión")
    config.addinivalue_line("markers", "slow: Tests lentos (>30s)")
    config.addinivalue_line("markers", "api: Tests que necesitan API")
    config.addinivalue_line("markers", "wip: Work in progress")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// playwright.config.ts - Configuración de proyectos por tag
import { defineConfig } from '@playwright/test';

export default defineConfig({
    projects: [
        {
            name: 'smoke',
            grep: /@smoke/,
            use: { /* config para smoke */ },
        },
        {
            name: 'regression',
            grep: /@regression/,
            use: { /* config para regression */ },
        },
    ],
});</code></pre>
            </div>
        </div>

        <h3>🔧 Marcadores built-in de pytest</h3>
        <div class="code-tabs" data-code-id="L019-5">
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
                <pre><code class="language-python">import pytest
import sys

# skip: Saltar un test incondicionalmente
@pytest.mark.skip(reason="Feature aún no implementada")
def test_nueva_funcionalidad(page):
    pass

# skipif: Saltar condicionalmente
@pytest.mark.skipif(
    sys.platform == "win32",
    reason="No funciona en Windows"
)
def test_solo_linux(page):
    pass

# xfail: Se espera que falle
@pytest.mark.xfail(reason="Bug #1234 pendiente de corregir")
def test_bug_conocido(page):
    page.goto("/pagina-rota")
    expect(page.locator("#elemento")).to_be_visible()

# parametrize: Ejecutar con múltiples datos
@pytest.mark.parametrize("usuario,password,esperado", [
    ("admin", "secreto", "/dashboard"),
    ("user", "clave123", "/home"),
    ("guest", "guest", "/welcome"),
])
def test_login_multiples_usuarios(page, usuario, password, esperado):
    page.goto("/login")
    page.fill("#email", usuario)
    page.fill("#password", password)
    page.click("#btn-login")
    expect(page).to_have_url(f"**{esperado}")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

// test.skip: Saltar un test incondicionalmente
test.skip('nueva funcionalidad', async ({ page }) => {
    // Feature aún no implementada
});

// test.skip condicional
test('solo linux', async ({ page }) => {
    test.skip(process.platform === 'win32', 'No funciona en Windows');
    // ...
});

// test.fixme: Se espera que falle (equivalente a xfail)
test.fixme('bug conocido', async ({ page }) => {
    // Bug #1234 pendiente de corregir
    await page.goto('/pagina-rota');
    await expect(page.locator('#elemento')).toBeVisible();
});

// Parametrize: Ejecutar con múltiples datos
const loginData = [
    { usuario: 'admin', password: 'secreto', esperado: '/dashboard' },
    { usuario: 'user', password: 'clave123', esperado: '/home' },
    { usuario: 'guest', password: 'guest', esperado: '/welcome' },
];

for (const { usuario, password, esperado } of loginData) {
    test('login con ' + usuario, async ({ page }) => {
        await page.goto('/login');
        await page.fill('#email', usuario);
        await page.fill('#password', password);
        await page.click('#btn-login');
        await expect(page).toHaveURL('**' + esperado);
    });
}</code></pre>
            </div>
        </div>

        <h3>🏷️ Múltiples marcadores en un test</h3>
        <div class="code-tabs" data-code-id="L019-6">
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
                <pre><code class="language-python"># Un test puede tener varios marcadores
@pytest.mark.smoke
@pytest.mark.regression
def test_pagina_principal(page: Page):
    page.goto("/")
    expect(page.locator("h1")).to_be_visible()

# Marcadores en clases (aplican a todos los métodos)
@pytest.mark.smoke
class TestDashboard:
    def test_carga_dashboard(self, page: Page):
        page.goto("/dashboard")
        expect(page).to_have_title("Dashboard")

    def test_widgets_visibles(self, page: Page):
        page.goto("/dashboard")
        expect(page.locator(".widget")).to_have_count(4)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Un test puede tener varios tags
test('pagina principal @smoke @regression', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
});

// Tags en describe (aplican a todos los tests)
test.describe('Dashboard', { tag: ['@smoke'] }, () => {
    test('carga dashboard', async ({ page }) => {
        await page.goto('/dashboard');
        await expect(page).toHaveTitle('Dashboard');
    });

    test('widgets visibles', async ({ page }) => {
        await page.goto('/dashboard');
        await expect(page.locator('.widget')).toHaveCount(4);
    });
});</code></pre>
            </div>
        </div>

        <h3>📊 Estrategia de marcadores para QA</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #c8e6c9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Marcador</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Cuándo ejecutar</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Cantidad</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>@smoke</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Cada commit / deploy</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">10-20 tests</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>@regression</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Nightly / pre-release</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">50-200 tests</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>@slow</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Solo en CI scheduled</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Variable</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>@wip</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Nunca en CI</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Temporal</td>
                </tr>
            </table>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <ol>
            <li>Registra los marcadores <code>smoke</code>, <code>regression</code> y <code>slow</code> en <code>conftest.py</code></li>
            <li>Etiqueta tus tests existentes con los marcadores apropiados</li>
            <li>Ejecuta:
                <ul>
                    <li><code>pytest -m smoke -v</code></li>
                    <li><code>pytest -m "not slow" -v</code></li>
                    <li><code>pytest -m "smoke or regression" -v</code></li>
                </ul>
            </li>
            <li>Crea un test con <code>@pytest.mark.parametrize</code> que pruebe 3 URLs</li>
            <li>Crea un test con <code>@pytest.mark.xfail</code></li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Crear y registrar marcadores personalizados</li>
                <li>Filtrar tests con <code>-m</code> y expresiones lógicas</li>
                <li>Usar marcadores built-in: skip, skipif, xfail, parametrize</li>
                <li>Definir una estrategia de tags para QA</li>
            </ul>
        </div>
    `,
    topics: ["markers", "tags", "pytest"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_019 = LESSON_019;
}
