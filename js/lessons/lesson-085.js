/**
 * Playwright Academy - Lección 085
 * Fixtures parametrizadas
 * Sección 12: Data-Driven Testing
 */

const LESSON_085 = {
    id: 85,
    title: "Fixtures parametrizadas",
    duration: "7 min",
    level: "intermediate",
    section: "section-12",
    content: `
        <h2>🔌 Fixtures parametrizadas</h2>
        <p>Las <strong>fixtures parametrizadas</strong> combinan la preparación automática
        de datos (fixtures) con la multiplicación de tests (parametrize). Esto permite
        que cada variación del test tenga su propio setup y teardown.</p>

        <h3>🔧 Fixture con @pytest.fixture(params=...)</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python">import pytest

@pytest.fixture(params=[
    {"name": "admin", "email": "admin@test.com", "password": "admin123"},
    {"name": "editor", "email": "editor@test.com", "password": "editor123"},
    {"name": "viewer", "email": "viewer@test.com", "password": "viewer123"},
], ids=["admin", "editor", "viewer"])
def logged_in_user(request, page):
    """Fixture que provee una página con login para cada rol."""
    user = request.param

    # Setup: hacer login
    page.goto("https://mi-app.com/login")
    page.fill("#email", user["email"])
    page.fill("#password", user["password"])
    page.click("#login-btn")
    page.wait_for_url("**/dashboard")

    yield {"page": page, "role": user["name"]}

    # Teardown: logout
    page.goto("https://mi-app.com/logout")

# Cada test que use esta fixture se ejecuta 3 veces
def test_dashboard_accesible(logged_in_user):
    page = logged_in_user["page"]
    role = logged_in_user["role"]
    expect(page.locator("[data-testid='welcome']")).to_be_visible()
    print(f"Dashboard accesible como {role}")

# Resultado:
# test_dashboard_accesible[admin]   PASSED
# test_dashboard_accesible[editor]  PASSED
# test_dashboard_accesible[viewer]  PASSED</code></pre>
        </div>

        <h3>🌐 Fixture para múltiples browsers</h3>
        <pre><code class="python">@pytest.fixture(params=["chromium", "firefox", "webkit"],
                ids=["chrome", "firefox", "safari"])
def browser_page(request, playwright):
    """Fixture que provee una página en diferentes browsers."""
    browser_type = request.param
    browser = getattr(playwright, browser_type).launch()
    page = browser.new_page()

    yield page

    browser.close()

def test_pagina_carga_en_todos_los_browsers(browser_page):
    browser_page.goto("https://mi-app.com")
    assert browser_page.title() != ""

# test_pagina_carga[chrome]   PASSED
# test_pagina_carga[firefox]  PASSED
# test_pagina_carga[safari]   PASSED</code></pre>

        <h3>📱 Fixture para múltiples viewports</h3>
        <pre><code class="python">VIEWPORTS = [
    pytest.param({"width": 1920, "height": 1080}, id="desktop"),
    pytest.param({"width": 768, "height": 1024}, id="tablet"),
    pytest.param({"width": 375, "height": 812}, id="mobile"),
]

@pytest.fixture(params=VIEWPORTS)
def responsive_page(request, browser):
    """Página con viewport específico."""
    viewport = request.param
    context = browser.new_context(viewport=viewport)
    page = context.new_page()

    yield page, viewport

    context.close()

def test_menu_responsive(responsive_page):
    page, viewport = responsive_page
    page.goto("https://mi-app.com")

    if viewport["width"] < 768:
        # Mobile: debería mostrar hamburger menu
        expect(page.locator("[data-testid='hamburger']")).to_be_visible()
        expect(page.locator("nav.desktop-menu")).to_be_hidden()
    else:
        # Desktop/Tablet: menú normal
        expect(page.locator("nav.desktop-menu")).to_be_visible()</code></pre>

        <h3>🏭 Fixture factory parametrizada</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python"># Combinar fixture factory con parametrize

PRODUCT_TYPES = [
    {"category": "Electrónica", "min_price": 100000, "tax_rate": 0.19},
    {"category": "Alimentos", "min_price": 1000, "tax_rate": 0.05},
    {"category": "Servicios", "min_price": 50000, "tax_rate": 0.19},
]

@pytest.fixture(params=PRODUCT_TYPES,
                ids=[p["category"] for p in PRODUCT_TYPES])
def product_in_category(request, db):
    """Crear un producto en cada categoría."""
    config = request.param
    product_id = db.insert("products", {
        "name": f"Test {config['category']}",
        "price": config["min_price"] * 2,
        "category": config["category"],
        "tax_rate": config["tax_rate"],
        "stock": 10,
    })

    product = db.query_one(
        "SELECT * FROM products WHERE id = %s", (product_id,)
    )
    yield product

    db.delete("products", "id = %s", (product_id,))

def test_impuesto_correcto(product_in_category):
    """Verificar que el impuesto se calcula bien por categoría."""
    p = product_in_category
    expected_tax = float(p["price"]) * float(p["tax_rate"])
    assert abs(float(p["tax_amount"]) - expected_tax) < 0.01</code></pre>
        </div>

        <h3>🔗 Combinar fixtures parametrizadas con parametrize</h3>
        <pre><code class="python"># Fixture parametrizada por rol
@pytest.fixture(params=["admin", "editor", "viewer"])
def user_role(request, page):
    creds = {
        "admin": ("admin@test.com", "admin123"),
        "editor": ("editor@test.com", "editor123"),
        "viewer": ("viewer@test.com", "viewer123"),
    }
    email, password = creds[request.param]
    page.goto("https://mi-app.com/login")
    page.fill("#email", email)
    page.fill("#password", password)
    page.click("#login-btn")
    yield request.param, page

# Test parametrizado con datos
@pytest.mark.parametrize("endpoint", [
    "/products", "/users", "/reports"
])
def test_acceso_a_secciones(user_role, endpoint):
    role, page = user_role
    page.goto(f"https://mi-app.com{endpoint}")
    # 3 roles x 3 endpoints = 9 tests
    assert page.locator("h1").is_visible()

# test_acceso[admin-/products]    PASSED
# test_acceso[admin-/users]       PASSED
# test_acceso[admin-/reports]     PASSED
# test_acceso[editor-/products]   PASSED
# ... (9 tests total)</code></pre>

        <h3>🗃️ Fixture con datos de archivos externos</h3>
        <pre><code class="python">from utils.data_loader import DataLoader

# Cargar datos del archivo una vez
_user_scenarios = DataLoader.from_json("users/scenarios.json")

@pytest.fixture(params=_user_scenarios,
    ids=[s["scenario_name"] for s in _user_scenarios])
def user_scenario(request, db, page):
    """Fixture que prepara cada escenario de usuario."""
    scenario = request.param

    # Setup: crear usuario en BD si es necesario
    if scenario.get("create_in_db"):
        user_id = db.insert("users", scenario["user_data"])
    else:
        user_id = None

    yield scenario

    # Cleanup
    if user_id:
        db.delete("users", "id = %s", (user_id,))

def test_user_scenario(user_scenario, page):
    """Ejecutar cada escenario del archivo JSON."""
    s = user_scenario
    page.goto(s["url"])
    for action in s["actions"]:
        if action["type"] == "fill":
            page.fill(action["selector"], action["value"])
        elif action["type"] == "click":
            page.click(action["selector"])
    expect(page.locator(s["expected_selector"])).to_contain_text(
        s["expected_text"]
    )</code></pre>

        <h3>📊 Cuándo usar cada enfoque</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #e65100; color: white;">
                        <th style="padding: 10px;">Enfoque</th>
                        <th style="padding: 10px;">Usar cuando</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #fff8e1;">
                        <td style="padding: 8px;"><code>@parametrize</code></td>
                        <td style="padding: 8px;">Solo varían los datos de entrada, no el setup</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><code>fixture(params=)</code></td>
                        <td style="padding: 8px;">Cada variación necesita setup/teardown diferente</td>
                    </tr>
                    <tr style="background: #fff8e1;">
                        <td style="padding: 8px;">Ambos combinados</td>
                        <td style="padding: 8px;">Setup variable + datos variables (producto cartesiano)</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip:</strong> Las fixtures parametrizadas son ideales para tests
            <strong>cross-browser</strong> y <strong>cross-viewport</strong>. Un solo test
            verifica la funcionalidad en Chrome, Firefox y Safari automáticamente.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Crea:</p>
            <ol>
                <li>Fixture parametrizada <code>browser_locale</code> para es-CO, en-US, pt-BR</li>
                <li>Fixture parametrizada <code>test_product</code> que cree productos de 3 categorías en BD</li>
                <li>Un test que combine ambas fixtures (9 ejecuciones) y verifique que el precio se muestra en el formato correcto del locale</li>
            </ol>
        </div>
    `,
    topics: ["fixtures", "parametrizadas", "pytest"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_085 = LESSON_085;
}
