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
        <pre><code class="python"># test_login.py
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

        <h3>🏃 Ejecutar por marcador</h3>
        <pre><code class="bash"># Solo tests de smoke
pytest -m smoke

# Solo tests de regresión
pytest -m regression

# Excluir tests lentos
pytest -m "not slow"

# Combinaciones lógicas
pytest -m "smoke and not slow"
pytest -m "smoke or regression"
pytest -m "(smoke or regression) and not slow"</code></pre>

        <h3>📝 Registrar marcadores (buena práctica)</h3>
        <pre><code class="python"># pytest.ini o pyproject.toml
# Registrar marcadores evita warnings de "unknown marker"

# pytest.ini:
# [pytest]
# markers =
#     smoke: Tests de humo - críticos, deben pasar siempre
#     regression: Tests de regresión
#     slow: Tests que tardan más de 30 segundos
#     api: Tests que dependen de la API
#     wip: Work in progress - tests en desarrollo</code></pre>
        <pre><code class="python"># O en conftest.py:
def pytest_configure(config):
    config.addinivalue_line("markers", "smoke: Tests de humo críticos")
    config.addinivalue_line("markers", "regression: Tests de regresión")
    config.addinivalue_line("markers", "slow: Tests lentos (>30s)")
    config.addinivalue_line("markers", "api: Tests que necesitan API")
    config.addinivalue_line("markers", "wip: Work in progress")</code></pre>

        <h3>🔧 Marcadores built-in de pytest</h3>
        <pre><code class="python">import pytest
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

        <h3>🏷️ Múltiples marcadores en un test</h3>
        <pre><code class="python"># Un test puede tener varios marcadores
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
