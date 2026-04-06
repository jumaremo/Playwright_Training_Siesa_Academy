/**
 * Playwright Academy - Lección 057
 * Fixtures integradas con POM
 * Sección 7: Page Object Model y Helpers
 */

const LESSON_057 = {
    id: 57,
    title: "Fixtures integradas con POM",
    duration: "7 min",
    level: "intermediate",
    section: "section-07",
    content: `
        <h2>🔌 Fixtures integradas con POM</h2>
        <p>Las <strong>fixtures de pytest</strong> son el mecanismo perfecto para inyectar
        Page Objects listos para usar en los tests. Al combinar fixtures con POM, logramos
        tests ultra-limpios donde toda la preparación ocurre detrás de escena.</p>

        <h3>🔄 Repaso rápido: ¿Qué son las fixtures?</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Una <strong>fixture</strong> es una función decorada con <code>@pytest.fixture</code>
            que prepara algo antes del test y opcionalmente limpia después:</p>
            <pre><code class="python">import pytest

@pytest.fixture
def mi_fixture():
    # SETUP: preparar algo
    recurso = crear_recurso()
    yield recurso  # Entregar al test
    # TEARDOWN: limpiar después
    recurso.cleanup()</code></pre>
            <p>Las fixtures pueden depender unas de otras, creando una <strong>cadena de
            preparación</strong> automática.</p>
        </div>

        <h3>🏗️ Fixture básica de Page Object</h3>
        <pre><code class="python"># conftest.py
import pytest
from pages.login_page import LoginPage
from pages.dashboard_page import DashboardPage
from pages.products_page import ProductsPage

# ── Fixture de Playwright (viene del plugin pytest-playwright) ──
# page, browser, context ya están disponibles automáticamente

# ── Fixtures de Page Objects ──

@pytest.fixture
def login_page(page):
    """LoginPage navegado y listo para interactuar."""
    lp = LoginPage(page)
    lp.navigate()
    return lp

@pytest.fixture
def dashboard_page(page):
    """DashboardPage con login previo completado."""
    # Cadena: login → dashboard
    login = LoginPage(page)
    login.navigate()
    login.login_as_user()
    page.wait_for_url("**/dashboard")
    return DashboardPage(page)

@pytest.fixture
def products_page(page):
    """ProductsPage con login y navegación completados."""
    login = LoginPage(page)
    login.navigate()
    login.login_as_user()
    page.wait_for_url("**/dashboard")
    page.goto("https://mi-app.com/products")
    return ProductsPage(page)</code></pre>

        <h3>🧪 Tests ultra-limpios con fixtures POM</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python"># test_login.py — solo lógica de test, cero setup
def test_login_exitoso(login_page):
    login_page.login("usuario@test.com", "clave123")
    assert "dashboard" in login_page.page.url

def test_login_invalido(login_page):
    login_page.login("invalido@test.com", "wrong")
    assert login_page.is_error_visible()

# test_dashboard.py — llega al dashboard sin código de login
def test_bienvenida(dashboard_page):
    assert "Bienvenido" in dashboard_page.get_welcome_text()

def test_sidebar(dashboard_page):
    sections = dashboard_page.get_sidebar_sections()
    assert "Productos" in sections

# test_products.py — listo para trabajar con productos
def test_buscar_producto(products_page):
    products_page.search("laptop")
    assert products_page.table.get_row_count() > 0</code></pre>
        </div>

        <h3>⚡ Fixtures con scope para optimizar rendimiento</h3>
        <pre><code class="python"># conftest.py — fixtures optimizadas con scope

@pytest.fixture(scope="session")
def auth_state(browser):
    """Autenticarse UNA VEZ para toda la sesión de tests.

    scope="session" = se ejecuta solo una vez, no por cada test.
    Guarda el estado de autenticación en un archivo JSON.
    """
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://mi-app.com/login")
    page.fill("[data-testid='email']", "admin@test.com")
    page.fill("[data-testid='password']", "admin123")
    page.click("[data-testid='login-btn']")
    page.wait_for_url("**/dashboard")

    # Guardar estado (cookies + localStorage)
    state = context.storage_state()
    context.close()
    return state

@pytest.fixture
def authenticated_page(browser, auth_state):
    """Página autenticada que reutiliza la sesión guardada.

    Cada test obtiene una página nueva pero con la sesión
    ya cargada — no repite el proceso de login.
    """
    context = browser.new_context(storage_state=auth_state)
    page = context.new_page()
    yield page
    context.close()

@pytest.fixture
def admin_dashboard(authenticated_page):
    """Dashboard autenticado como admin."""
    authenticated_page.goto("https://mi-app.com/dashboard")
    return DashboardPage(authenticated_page)</code></pre>

        <h3>🎭 Fixtures parametrizadas para múltiples roles</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python"># conftest.py — fixtures por rol

USERS = {
    "admin": {"email": "admin@test.com", "password": "admin123"},
    "editor": {"email": "editor@test.com", "password": "editor123"},
    "viewer": {"email": "viewer@test.com", "password": "viewer123"},
}

@pytest.fixture(params=["admin", "editor", "viewer"])
def role_page(request, browser):
    """Fixture parametrizada que ejecuta el test con cada rol."""
    role = request.param
    creds = USERS[role]

    context = browser.new_context()
    page = context.new_page()

    # Login con el rol correspondiente
    login = LoginPage(page)
    login.navigate()
    login.login(creds["email"], creds["password"])

    yield page, role
    context.close()

# Este test se ejecuta 3 veces: admin, editor, viewer
def test_dashboard_accesible(role_page):
    page, role = role_page
    dashboard = DashboardPage(page)
    assert dashboard.get_welcome_text() is not None
    print(f"Dashboard accesible como {role}")</code></pre>
        </div>

        <h3>🔧 Fixtures con setup y teardown (yield)</h3>
        <pre><code class="python"># conftest.py — fixtures con limpieza

@pytest.fixture
def product_page_with_test_data(page, api_helper):
    """Fixture que crea datos de prueba y limpia después.

    1. Crea un producto via API (rápido, sin UI)
    2. Provee la página de productos al test
    3. Elimina el producto al terminar
    """
    # SETUP: Crear producto de prueba via API
    product = api_helper.create_product({
        "nombre": "Test_Product_E2E",
        "precio": 99999,
        "stock": 10
    })
    product_id = product["id"]

    # Login y navegar
    login = LoginPage(page)
    login.navigate()
    login.login_as_user()

    products = ProductsPage(page)
    products.navigate()

    yield products, product_id

    # TEARDOWN: Eliminar producto de prueba via API
    api_helper.delete_product(product_id)

# Uso en test:
def test_editar_producto(product_page_with_test_data):
    products_page, product_id = product_page_with_test_data
    products_page.edit_product("Test_Product_E2E")
    # ... editar campos
    assert products_page.is_product_visible("Test_Product_E2E")</code></pre>

        <h3>📐 Patrón de fixture factory</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Cuando necesitas crear Page Objects con configuraciones diferentes:</p>
            <pre><code class="python"># conftest.py — factory pattern

@pytest.fixture
def make_login_page(browser):
    """Factory para crear LoginPage con diferentes contextos."""
    pages_to_close = []

    def _make(viewport=None, locale=None):
        options = {}
        if viewport:
            options["viewport"] = viewport
        if locale:
            options["locale"] = locale

        context = browser.new_context(**options)
        page = context.new_page()
        lp = LoginPage(page)
        lp.navigate()
        pages_to_close.append(context)
        return lp

    yield _make

    # Teardown: cerrar todos los contextos creados
    for ctx in pages_to_close:
        ctx.close()

# Uso en tests:
def test_login_mobile(make_login_page):
    login = make_login_page(viewport={"width": 375, "height": 812})
    login.login_as_user()
    assert "dashboard" in login.page.url

def test_login_tablet(make_login_page):
    login = make_login_page(viewport={"width": 768, "height": 1024})
    login.login_as_user()
    assert "dashboard" in login.page.url

def test_login_spanish(make_login_page):
    login = make_login_page(locale="es-CO")
    assert "Iniciar sesión" in login.page.title()</code></pre>
        </div>

        <h3>📋 Resumen: Scopes de fixtures</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <thead>
                <tr style="background: #1565c0; color: white;">
                    <th style="padding: 10px;">Scope</th>
                    <th style="padding: 10px;">Ejecución</th>
                    <th style="padding: 10px;">Caso de uso</th>
                </tr>
            </thead>
            <tbody>
                <tr style="background: #e3f2fd;">
                    <td style="padding: 8px;"><code>function</code> (default)</td>
                    <td style="padding: 8px;">Una vez por test</td>
                    <td style="padding: 8px;">Page Objects, datos únicos por test</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><code>class</code></td>
                    <td style="padding: 8px;">Una vez por clase de test</td>
                    <td style="padding: 8px;">Setup compartido en clase</td>
                </tr>
                <tr style="background: #e3f2fd;">
                    <td style="padding: 8px;"><code>module</code></td>
                    <td style="padding: 8px;">Una vez por archivo .py</td>
                    <td style="padding: 8px;">Datos compartidos por módulo</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><code>session</code></td>
                    <td style="padding: 8px;">Una vez por ejecución completa</td>
                    <td style="padding: 8px;">Autenticación, setup de BD</td>
                </tr>
            </tbody>
        </table>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip:</strong> El plugin <code>pytest-playwright</code> ya provee las
            fixtures <code>page</code>, <code>browser</code> y <code>context</code> con
            scope <code>function</code>. No necesitas crearlas manualmente. Solo construye
            tus fixtures POM <strong>encima</strong> de estas.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Diseña un sistema de fixtures para un e-commerce con:</p>
            <ol>
                <li><code>auth_state</code> (session scope) — login una sola vez</li>
                <li><code>authenticated_page</code> — página con sesión cargada</li>
                <li><code>catalog_page</code> — catálogo listo para búsquedas</li>
                <li><code>cart_with_items</code> — carrito con 3 productos (creados via API)</li>
                <li><code>checkout_page</code> — checkout con carrito lleno, listo para pagar</li>
            </ol>
            <p>Cada fixture debe depender de la anterior formando una cadena.</p>
        </div>
    `,
    topics: ["fixtures", "pom", "integración"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_057 = LESSON_057;
}
