/**
 * Playwright Academy - Lección 053
 * Introducción al Page Object Model
 * Sección 7: Page Object Model y Helpers
 */

const LESSON_053 = {
    id: 53,
    title: "Introducción al Page Object Model",
    duration: "8 min",
    level: "intermediate",
    section: "section-07",
    content: `
        <h2>\u{1F3D7}\u{FE0F} Introducción al Page Object Model</h2>
        <p>El <strong>Page Object Model (POM)</strong> es el patrón de diseño más importante
        en automatización de pruebas. Encapsula la estructura y comportamiento de cada página
        en una clase independiente, separando la lógica de los tests de los detalles de la UI.</p>

        <h3>\u{1F630} El problema: Tests frágiles y difíciles de mantener</h3>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Sin POM</strong>, los selectores y la lógica de interacción están desperdigados
            en todos los tests. Cuando la UI cambia, hay que modificar decenas de archivos:</p>
            <div class="code-tabs" data-code-id="L053-1">
                <div class="code-tabs-header">
                    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                        <span class="code-tab-icon">\u{1F40D}</span> Python
                    </button>
                    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                        <span class="code-tab-icon">\u{1F537}</span> TypeScript
                    </button>
                    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar código">\u{1F4CB}</button>
                </div>
                <div class="code-panel active" data-lang="python">
                    <pre><code class="language-python"># \u274C Sin POM — selectores duplicados en cada test

# test_login.py
def test_login_exitoso(page):
    page.goto("https://mi-app.com/login")
    page.fill("#email-input", "usuario@test.com")
    page.fill("#password-input", "clave123")
    page.click("button.btn-login")
    assert page.text_content(".welcome-msg") == "Bienvenido"

# test_login_error.py
def test_login_con_error(page):
    page.goto("https://mi-app.com/login")
    page.fill("#email-input", "malo@test.com")      # \u2190 Mismo selector duplicado
    page.fill("#password-input", "incorrecta")       # \u2190 Mismo selector duplicado
    page.click("button.btn-login")                   # \u2190 Mismo selector duplicado
    assert page.is_visible(".error-message")

# test_perfil.py
def test_acceder_perfil(page):
    page.goto("https://mi-app.com/login")
    page.fill("#email-input", "usuario@test.com")    # \u2190 \u00A1Otra vez!
    page.fill("#password-input", "clave123")
    page.click("button.btn-login")
    page.click("a.perfil-link")</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-typescript">// \u274C Sin POM — selectores duplicados en cada test
import { test } from '@playwright/test';

// test_login.spec.ts
test('login exitoso', async ({ page }) => {
    await page.goto('https://mi-app.com/login');
    await page.fill('#email-input', 'usuario@test.com');
    await page.fill('#password-input', 'clave123');
    await page.click('button.btn-login');
    const text = await page.textContent('.welcome-msg');
    expect(text).toBe('Bienvenido');
});

// test_login_error.spec.ts
test('login con error', async ({ page }) => {
    await page.goto('https://mi-app.com/login');
    await page.fill('#email-input', 'malo@test.com');      // \u2190 Mismo selector duplicado
    await page.fill('#password-input', 'incorrecta');       // \u2190 Mismo selector duplicado
    await page.click('button.btn-login');                   // \u2190 Mismo selector duplicado
    await expect(page.locator('.error-message')).toBeVisible();
});

// test_perfil.spec.ts
test('acceder perfil', async ({ page }) => {
    await page.goto('https://mi-app.com/login');
    await page.fill('#email-input', 'usuario@test.com');    // \u2190 \u00A1Otra vez!
    await page.fill('#password-input', 'clave123');
    await page.click('button.btn-login');
    await page.click('a.perfil-link');
});</code></pre>
                </div>
            </div>
            <p>Si el ID <code>#email-input</code> cambia a <code>#user-email</code>,
            hay que modificar <strong>todos</strong> los archivos. En proyectos reales
            con cientos de tests, esto es insostenible.</p>
        </div>

        <h3>\u2705 La solución: Page Object Model</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Con POM, cada página tiene una <strong>clase que encapsula</strong> sus
            selectores y acciones. Los tests solo usan métodos de alto nivel:</p>
            <div class="code-tabs" data-code-id="L053-2">
                <div class="code-tabs-header">
                    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                        <span class="code-tab-icon">\u{1F40D}</span> Python
                    </button>
                    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                        <span class="code-tab-icon">\u{1F537}</span> TypeScript
                    </button>
                    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar código">\u{1F4CB}</button>
                </div>
                <div class="code-panel active" data-lang="python">
                    <pre><code class="language-python"># \u2705 Con POM — selectores centralizados

# pages/login_page.py
class LoginPage:
    def __init__(self, page):
        self.page = page
        # Selectores centralizados en UN solo lugar
        self.email_input = page.locator("#email-input")
        self.password_input = page.locator("#password-input")
        self.login_button = page.locator("button.btn-login")
        self.welcome_msg = page.locator(".welcome-msg")
        self.error_msg = page.locator(".error-message")

    def navigate(self):
        self.page.goto("https://mi-app.com/login")

    def login(self, email, password):
        self.email_input.fill(email)
        self.password_input.fill(password)
        self.login_button.click()

# test_login.py — limpio y legible
def test_login_exitoso(page):
    login = LoginPage(page)
    login.navigate()
    login.login("usuario@test.com", "clave123")
    assert login.welcome_msg.text_content() == "Bienvenido"

def test_login_con_error(page):
    login = LoginPage(page)
    login.navigate()
    login.login("malo@test.com", "incorrecta")
    assert login.error_msg.is_visible()</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-typescript">// \u2705 Con POM — selectores centralizados
import { test, expect, type Page, type Locator } from '@playwright/test';

// pages/login-page.ts
class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly welcomeMsg: Locator;
    readonly errorMsg: Locator;

    constructor(page: Page) {
        this.page = page;
        // Selectores centralizados en UN solo lugar
        this.emailInput = page.locator('#email-input');
        this.passwordInput = page.locator('#password-input');
        this.loginButton = page.locator('button.btn-login');
        this.welcomeMsg = page.locator('.welcome-msg');
        this.errorMsg = page.locator('.error-message');
    }

    async navigate() {
        await this.page.goto('https://mi-app.com/login');
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}

// test_login.spec.ts — limpio y legible
test('login exitoso', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();
    await login.login('usuario@test.com', 'clave123');
    await expect(login.welcomeMsg).toHaveText('Bienvenido');
});

test('login con error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();
    await login.login('malo@test.com', 'incorrecta');
    await expect(login.errorMsg).toBeVisible();
});</code></pre>
                </div>
            </div>
            <p>Si <code>#email-input</code> cambia, solo se modifica <strong>UNA línea</strong>
            en <code>LoginPage</code>. Todos los tests siguen funcionando.</p>
        </div>

        <h3>\u{1F9F1} Principios fundamentales del POM</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #e65100; color: white;">
                        <th style="padding: 10px; text-align: left;">Principio</th>
                        <th style="padding: 10px; text-align: left;">Descripción</th>
                        <th style="padding: 10px; text-align: left;">Beneficio</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #fff8e1;">
                        <td style="padding: 8px;"><strong>Encapsulación</strong></td>
                        <td style="padding: 8px;">Selectores y acciones dentro de la clase</td>
                        <td style="padding: 8px;">Un solo punto de cambio</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>Abstracción</strong></td>
                        <td style="padding: 8px;">Tests usan métodos de negocio, no selectores</td>
                        <td style="padding: 8px;">Tests legibles como documentación</td>
                    </tr>
                    <tr style="background: #fff8e1;">
                        <td style="padding: 8px;"><strong>Reutilización</strong></td>
                        <td style="padding: 8px;">Misma página usada en múltiples tests</td>
                        <td style="padding: 8px;">Menos código, menos duplicación</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>Separación</strong></td>
                        <td style="padding: 8px;">Lógica de UI separada de lógica de test</td>
                        <td style="padding: 8px;">Mantenimiento independiente</td>
                    </tr>
                    <tr style="background: #fff8e1;">
                        <td style="padding: 8px;"><strong>Single Responsibility</strong></td>
                        <td style="padding: 8px;">Cada clase representa UNA página/componente</td>
                        <td style="padding: 8px;">Código organizado y predecible</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>\u{1F4C1} Estructura típica de un proyecto con POM</h3>
        <div class="code-tabs" data-code-id="L053-3">
            <div class="code-tabs-header">
                <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                    <span class="code-tab-icon">\u{1F40D}</span> Python
                </button>
                <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                    <span class="code-tab-icon">\u{1F537}</span> TypeScript
                </button>
                <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar código">\u{1F4CB}</button>
            </div>
            <div class="code-panel active" data-lang="python">
                <pre><code class="language-python">mi-proyecto-playwright/
\u251C\u2500\u2500 pages/                    # Page Objects
\u2502   \u251C\u2500\u2500 __init__.py
\u2502   \u251C\u2500\u2500 base_page.py          # Clase base con métodos comunes
\u2502   \u251C\u2500\u2500 login_page.py
\u2502   \u251C\u2500\u2500 dashboard_page.py
\u2502   \u251C\u2500\u2500 profile_page.py
\u2502   \u2514\u2500\u2500 products_page.py
\u251C\u2500\u2500 tests/                    # Tests (usan Page Objects)
\u2502   \u251C\u2500\u2500 conftest.py           # Fixtures compartidas
\u2502   \u251C\u2500\u2500 test_login.py
\u2502   \u251C\u2500\u2500 test_dashboard.py
\u2502   \u2514\u2500\u2500 test_products.py
\u251C\u2500\u2500 utils/                    # Utilidades auxiliares
\u2502   \u251C\u2500\u2500 test_data.py
\u2502   \u2514\u2500\u2500 helpers.py
\u251C\u2500\u2500 pytest.ini
\u2514\u2500\u2500 requirements.txt</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <div class="code-note"><span class="code-note-icon">\u2139\uFE0F</span><span class="code-note-text">Equivalente con Playwright Test (TypeScript):</span></div>
                <pre><code class="language-typescript">mi-proyecto-playwright/
\u251C\u2500\u2500 pages/                    // Page Objects
\u2502   \u251C\u2500\u2500 base-page.ts          // Clase base con métodos comunes
\u2502   \u251C\u2500\u2500 login-page.ts
\u2502   \u251C\u2500\u2500 dashboard-page.ts
\u2502   \u251C\u2500\u2500 profile-page.ts
\u2502   \u2514\u2500\u2500 products-page.ts
\u251C\u2500\u2500 tests/                    // Tests (usan Page Objects)
\u2502   \u251C\u2500\u2500 login.spec.ts
\u2502   \u251C\u2500\u2500 dashboard.spec.ts
\u2502   \u2514\u2500\u2500 products.spec.ts
\u251C\u2500\u2500 utils/                    // Utilidades auxiliares
\u2502   \u251C\u2500\u2500 test-data.ts
\u2502   \u2514\u2500\u2500 helpers.ts
\u251C\u2500\u2500 playwright.config.ts
\u2514\u2500\u2500 package.json</code></pre>
            </div>
        </div>

        <h3>\u{1F528} Anatomía de un Page Object</h3>
        <p>Un Page Object bien diseñado tiene tres secciones claras:</p>
        <div class="code-tabs" data-code-id="L053-4">
            <div class="code-tabs-header">
                <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                    <span class="code-tab-icon">\u{1F40D}</span> Python
                </button>
                <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                    <span class="code-tab-icon">\u{1F537}</span> TypeScript
                </button>
                <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar código">\u{1F4CB}</button>
            </div>
            <div class="code-panel active" data-lang="python">
                <pre><code class="language-python">class ProductsPage:
    """Page Object para la página de productos."""

    # \u2500\u2500 1. CONSTRUCTOR: Recibe page, define locators \u2500\u2500
    def __init__(self, page):
        self.page = page
        self.url = "https://mi-app.com/products"

        # Locators (definidos como propiedades del objeto)
        self.search_input = page.locator("[data-testid='search-box']")
        self.search_button = page.locator("[data-testid='search-btn']")
        self.product_cards = page.locator(".product-card")
        self.cart_badge = page.locator(".cart-count")
        self.filter_dropdown = page.locator("#category-filter")
        self.sort_dropdown = page.locator("#sort-by")
        self.loading_spinner = page.locator(".spinner")

    # \u2500\u2500 2. ACCIONES: Métodos que representan interacciones \u2500\u2500
    def navigate(self):
        """Navegar a la página de productos."""
        self.page.goto(self.url)
        self.loading_spinner.wait_for(state="hidden")

    def search(self, query):
        """Buscar un producto por texto."""
        self.search_input.fill(query)
        self.search_button.click()
        self.loading_spinner.wait_for(state="hidden")

    def filter_by_category(self, category):
        """Filtrar productos por categoría."""
        self.filter_dropdown.select_option(label=category)
        self.loading_spinner.wait_for(state="hidden")

    def add_to_cart(self, product_name):
        """Agregar un producto específico al carrito."""
        card = self.product_cards.filter(has_text=product_name)
        card.locator("button.add-to-cart").click()

    # \u2500\u2500 3. QUERIES: Métodos que retornan datos/estado \u2500\u2500
    def get_product_count(self):
        """Obtener el número de productos visibles."""
        return self.product_cards.count()

    def get_cart_count(self):
        """Obtener el número de items en el carrito."""
        return int(self.cart_badge.text_content())

    def get_product_names(self):
        """Obtener lista de nombres de productos visibles."""
        return self.product_cards.locator(".product-name").all_text_contents()

    def is_product_visible(self, name):
        """Verificar si un producto específico es visible."""
        return self.product_cards.filter(has_text=name).is_visible()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { type Page, type Locator } from '@playwright/test';

class ProductsPage {
    /** Page Object para la página de productos. */
    readonly page: Page;
    readonly url = 'https://mi-app.com/products';

    // \u2500\u2500 1. CONSTRUCTOR: Recibe page, define locators \u2500\u2500
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly productCards: Locator;
    readonly cartBadge: Locator;
    readonly filterDropdown: Locator;
    readonly sortDropdown: Locator;
    readonly loadingSpinner: Locator;

    constructor(page: Page) {
        this.page = page;
        // Locators (definidos como propiedades del objeto)
        this.searchInput = page.locator("[data-testid='search-box']");
        this.searchButton = page.locator("[data-testid='search-btn']");
        this.productCards = page.locator('.product-card');
        this.cartBadge = page.locator('.cart-count');
        this.filterDropdown = page.locator('#category-filter');
        this.sortDropdown = page.locator('#sort-by');
        this.loadingSpinner = page.locator('.spinner');
    }

    // \u2500\u2500 2. ACCIONES: Métodos que representan interacciones \u2500\u2500
    async navigate() {
        await this.page.goto(this.url);
        await this.loadingSpinner.waitFor({ state: 'hidden' });
    }

    async search(query: string) {
        await this.searchInput.fill(query);
        await this.searchButton.click();
        await this.loadingSpinner.waitFor({ state: 'hidden' });
    }

    async filterByCategory(category: string) {
        await this.filterDropdown.selectOption({ label: category });
        await this.loadingSpinner.waitFor({ state: 'hidden' });
    }

    async addToCart(productName: string) {
        const card = this.productCards.filter({ hasText: productName });
        await card.locator('button.add-to-cart').click();
    }

    // \u2500\u2500 3. QUERIES: Métodos que retornan datos/estado \u2500\u2500
    async getProductCount() {
        return await this.productCards.count();
    }

    async getCartCount() {
        const text = await this.cartBadge.textContent();
        return parseInt(text || '0');
    }

    async getProductNames() {
        return await this.productCards.locator('.product-name').allTextContents();
    }

    async isProductVisible(name: string) {
        return await this.productCards.filter({ hasText: name }).isVisible();
    }
}</code></pre>
            </div>
        </div>

        <h3>\u{1F9EA} Tests usando el Page Object</h3>
        <div class="code-tabs" data-code-id="L053-5">
            <div class="code-tabs-header">
                <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                    <span class="code-tab-icon">\u{1F40D}</span> Python
                </button>
                <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                    <span class="code-tab-icon">\u{1F537}</span> TypeScript
                </button>
                <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar código">\u{1F4CB}</button>
            </div>
            <div class="code-panel active" data-lang="python">
                <pre><code class="language-python"># test_products.py — limpio, legible, mantenible
from pages.products_page import ProductsPage

def test_buscar_producto(page):
    products = ProductsPage(page)
    products.navigate()
    products.search("laptop")

    assert products.get_product_count() > 0
    assert products.is_product_visible("Laptop Pro 15")

def test_filtrar_por_categoria(page):
    products = ProductsPage(page)
    products.navigate()
    products.filter_by_category("Electrónica")

    names = products.get_product_names()
    assert all("laptop" in n.lower() or "phone" in n.lower() for n in names)

def test_agregar_al_carrito(page):
    products = ProductsPage(page)
    products.navigate()
    products.add_to_cart("Laptop Pro 15")

    assert products.get_cart_count() == 1</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// test_products.spec.ts — limpio, legible, mantenible
import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pages/products-page';

test('buscar producto', async ({ page }) => {
    const products = new ProductsPage(page);
    await products.navigate();
    await products.search('laptop');

    expect(await products.getProductCount()).toBeGreaterThan(0);
    expect(await products.isProductVisible('Laptop Pro 15')).toBeTruthy();
});

test('filtrar por categoría', async ({ page }) => {
    const products = new ProductsPage(page);
    await products.navigate();
    await products.filterByCategory('Electrónica');

    const names = await products.getProductNames();
    expect(names.every(n => n.toLowerCase().includes('laptop') || n.toLowerCase().includes('phone'))).toBeTruthy();
});

test('agregar al carrito', async ({ page }) => {
    const products = new ProductsPage(page);
    await products.navigate();
    await products.addToCart('Laptop Pro 15');

    expect(await products.getCartCount()).toBe(1);
});</code></pre>
            </div>
        </div>

        <h3>\u{1F4CB} Reglas de oro del POM</h3>
        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <ol>
                <li><strong>No incluir assertions en los Page Objects</strong> — las
                assertions pertenecen a los tests. El Page Object solo expone datos y acciones.</li>
                <li><strong>Métodos deben representar acciones de usuario</strong> — <code>login()</code>,
                <code>search()</code>, no <code>click_button()</code>.</li>
                <li><strong>Retornar datos útiles</strong> — los métodos de consulta retornan
                strings, números o booleanos, no locators crudos.</li>
                <li><strong>Un Page Object por página/vista</strong> — no mezclar múltiples
                páginas en una sola clase.</li>
                <li><strong>Nombrar los locators descriptivamente</strong> — <code>self.login_button</code>
                es mejor que <code>self.btn1</code>.</li>
            </ol>
        </div>

        <h3>\u{1F19A} POM vs Sin POM — Comparación de mantenimiento</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #6a1b9a; color: white;">
                        <th style="padding: 10px;">Escenario</th>
                        <th style="padding: 10px;">Sin POM</th>
                        <th style="padding: 10px;">Con POM</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #f3e5f5;">
                        <td style="padding: 8px;">Cambió un selector</td>
                        <td style="padding: 8px;">Modificar 15-50 archivos</td>
                        <td style="padding: 8px;">Modificar 1 archivo</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Nuevo flujo de login</td>
                        <td style="padding: 8px;">Reescribir en cada test</td>
                        <td style="padding: 8px;">Actualizar un método</td>
                    </tr>
                    <tr style="background: #f3e5f5;">
                        <td style="padding: 8px;">Leer un test</td>
                        <td style="padding: 8px;">Descifrar selectores CSS</td>
                        <td style="padding: 8px;">Leer métodos descriptivos</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Onboarding nuevo QA</td>
                        <td style="padding: 8px;">Explicar cada selector</td>
                        <td style="padding: 8px;">Los Page Objects son la doc</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>\u{1F4A1} Tip SIESA:</strong> En Siesa utilizamos POM para todos los proyectos de
            automatización. Cada módulo del ERP (Contabilidad, Nómina, Inventarios) tiene sus
            propios Page Objects. Esto permite que diferentes equipos trabajen en paralelo sin
            conflictos.
        </div>

        <h3>\u{1F3AF} Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Identifica los problemas en el siguiente código y
            reescríbelo usando POM:</p>
            <div class="code-tabs" data-code-id="L053-6">
                <div class="code-tabs-header">
                    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                        <span class="code-tab-icon">\u{1F40D}</span> Python
                    </button>
                    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                        <span class="code-tab-icon">\u{1F537}</span> TypeScript
                    </button>
                    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar código">\u{1F4CB}</button>
                </div>
                <div class="code-panel active" data-lang="python">
                    <pre><code class="language-python"># \u274C Código sin POM — identifica los problemas
def test_agregar_producto(page):
    page.goto("https://tienda.com")
    page.fill("input.search", "Mouse")
    page.click("button.search-btn")
    page.click(".product:first-child .add-btn")
    assert page.text_content(".cart-count") == "1"

def test_buscar_producto(page):
    page.goto("https://tienda.com")
    page.fill("input.search", "Teclado")
    page.click("button.search-btn")
    count = page.locator(".product").count()
    assert count > 0</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-typescript">// \u274C Código sin POM — identifica los problemas
test('agregar producto', async ({ page }) => {
    await page.goto('https://tienda.com');
    await page.fill('input.search', 'Mouse');
    await page.click('button.search-btn');
    await page.click('.product:first-child .add-btn');
    const text = await page.textContent('.cart-count');
    expect(text).toBe('1');
});

test('buscar producto', async ({ page }) => {
    await page.goto('https://tienda.com');
    await page.fill('input.search', 'Teclado');
    await page.click('button.search-btn');
    const count = await page.locator('.product').count();
    expect(count).toBeGreaterThan(0);
});</code></pre>
                </div>
            </div>
        </div>
    `,
    topics: ["pom", "page-object", "introducción"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 8,
    difficulty: "medium",
    type: "foundation"
};

if (typeof window !== 'undefined') {
    window.LESSON_053 = LESSON_053;
}
