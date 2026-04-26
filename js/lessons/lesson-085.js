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
            <div class="code-tabs" data-code-id="L085-1">
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
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect, Page } from '@playwright/test';

// Definir los usuarios como array de datos
const users = [
    { name: 'admin', email: 'admin@test.com', password: 'admin123' },
    { name: 'editor', email: 'editor@test.com', password: 'editor123' },
    { name: 'viewer', email: 'viewer@test.com', password: 'viewer123' },
];

// Iterar para crear un test por cada rol
for (const user of users) {
    test(\`dashboard accesible como \${user.name}\`, async ({ page }) => {
        // Setup: hacer login
        await page.goto('https://mi-app.com/login');
        await page.fill('#email', user.email);
        await page.fill('#password', user.password);
        await page.click('#login-btn');
        await page.waitForURL('**/dashboard');

        // Verificar dashboard
        await expect(page.locator('[data-testid="welcome"]')).toBeVisible();
        console.log(\`Dashboard accesible como \${user.name}\`);

        // Teardown: logout
        await page.goto('https://mi-app.com/logout');
    });
}

// Resultado:
// dashboard accesible como admin   → passed
// dashboard accesible como editor  → passed
// dashboard accesible como viewer  → passed</code></pre>
            </div>
            </div>
        </div>

        <h3>🌐 Fixture para múltiples browsers</h3>
        <div class="code-tabs" data-code-id="L085-2">
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
            <pre><code class="language-python">@pytest.fixture(params=["chromium", "firefox", "webkit"],
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
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">import { test, expect, BrowserType } from '@playwright/test';

// Playwright Test soporta múltiples browsers via proyectos
// en playwright.config.ts:
// projects: [
//   { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
//   { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
//   { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
// ]

// Alternativa programática: iterar sobre browsers
const browserTypes = ['chromium', 'firefox', 'webkit'] as const;

for (const browserName of browserTypes) {
    test(\`página carga en \${browserName}\`, async ({ playwright }) => {
        const browser = await playwright[browserName].launch();
        const page = await browser.newPage();

        try {
            await page.goto('https://mi-app.com');
            const title = await page.title();
            expect(title).not.toBe('');
        } finally {
            await browser.close();
        }
    });
}

// página carga en chromium → passed
// página carga en firefox  → passed
// página carga en webkit   → passed</code></pre>
        </div>
        </div>

        <h3>📱 Fixture para múltiples viewports</h3>
        <div class="code-tabs" data-code-id="L085-3">
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
            <pre><code class="language-python">VIEWPORTS = [
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
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

const viewports = [
    { name: 'desktop', width: 1920, height: 1080 },
    { name: 'tablet',  width: 768,  height: 1024 },
    { name: 'mobile',  width: 375,  height: 812 },
];

for (const vp of viewports) {
    test(\`menú responsive en \${vp.name}\`, async ({ browser }) => {
        // Crear contexto con viewport específico
        const context = await browser.newContext({
            viewport: { width: vp.width, height: vp.height },
        });
        const page = await context.newPage();

        try {
            await page.goto('https://mi-app.com');

            if (vp.width < 768) {
                // Mobile: debería mostrar hamburger menu
                await expect(page.locator('[data-testid="hamburger"]')).toBeVisible();
                await expect(page.locator('nav.desktop-menu')).toBeHidden();
            } else {
                // Desktop/Tablet: menú normal
                await expect(page.locator('nav.desktop-menu')).toBeVisible();
            }
        } finally {
            await context.close();
        }
    });
}</code></pre>
        </div>
        </div>

        <h3>🏭 Fixture factory parametrizada</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L085-4">
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
                <pre><code class="language-python"># Combinar fixture factory con parametrize

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
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';
import { db } from './helpers/database';

// Combinar fixture factory con iteración

const productTypes = [
    { category: 'Electrónica', minPrice: 100000, taxRate: 0.19 },
    { category: 'Alimentos',   minPrice: 1000,   taxRate: 0.05 },
    { category: 'Servicios',   minPrice: 50000,  taxRate: 0.19 },
];

for (const config of productTypes) {
    test(\`impuesto correcto para \${config.category}\`, async () => {
        // Setup: crear producto en BD
        const productId = await db.insert('products', {
            name: \`Test \${config.category}\`,
            price: config.minPrice * 2,
            category: config.category,
            tax_rate: config.taxRate,
            stock: 10,
        });

        try {
            const product = await db.queryOne(
                'SELECT * FROM products WHERE id = $1',
                [productId]
            );

            // Verificar que el impuesto se calcula bien
            const expectedTax = Number(product.price) * Number(product.tax_rate);
            expect(
                Math.abs(Number(product.tax_amount) - expectedTax)
            ).toBeLessThan(0.01);
        } finally {
            // Cleanup
            await db.execute('DELETE FROM products WHERE id = $1', [productId]);
        }
    });
}</code></pre>
            </div>
            </div>
        </div>

        <h3>🔗 Combinar fixtures parametrizadas con parametrize</h3>
        <div class="code-tabs" data-code-id="L085-5">
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
            <pre><code class="language-python"># Fixture parametrizada por rol
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
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

// Credenciales por rol
const credentials: Record&lt;string, { email: string; password: string }&gt; = {
    admin:  { email: 'admin@test.com',  password: 'admin123' },
    editor: { email: 'editor@test.com', password: 'editor123' },
    viewer: { email: 'viewer@test.com', password: 'viewer123' },
};

const roles = ['admin', 'editor', 'viewer'];
const endpoints = ['/products', '/users', '/reports'];

// Producto cartesiano: 3 roles x 3 endpoints = 9 tests
for (const role of roles) {
    for (const endpoint of endpoints) {
        test(\`acceso a \${endpoint} como \${role}\`, async ({ page }) => {
            // Setup: login con el rol
            const creds = credentials[role];
            await page.goto('https://mi-app.com/login');
            await page.fill('#email', creds.email);
            await page.fill('#password', creds.password);
            await page.click('#login-btn');

            // Navegar al endpoint
            await page.goto(\`https://mi-app.com\${endpoint}\`);
            // 3 roles x 3 endpoints = 9 tests
            await expect(page.locator('h1')).toBeVisible();
        });
    }
}

// acceso a /products como admin    → passed
// acceso a /users como admin       → passed
// acceso a /reports como admin     → passed
// acceso a /products como editor   → passed
// ... (9 tests en total)</code></pre>
        </div>
        </div>

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
