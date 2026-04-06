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
        <h2>🏗️ Introducción al Page Object Model</h2>
        <p>El <strong>Page Object Model (POM)</strong> es el patrón de diseño más importante
        en automatización de pruebas. Encapsula la estructura y comportamiento de cada página
        en una clase independiente, separando la lógica de los tests de los detalles de la UI.</p>

        <h3>😰 El problema: Tests frágiles y difíciles de mantener</h3>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Sin POM</strong>, los selectores y la lógica de interacción están desperdigados
            en todos los tests. Cuando la UI cambia, hay que modificar decenas de archivos:</p>
            <pre><code class="python"># ❌ Sin POM — selectores duplicados en cada test

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
    page.fill("#email-input", "malo@test.com")      # ← Mismo selector duplicado
    page.fill("#password-input", "incorrecta")       # ← Mismo selector duplicado
    page.click("button.btn-login")                   # ← Mismo selector duplicado
    assert page.is_visible(".error-message")

# test_perfil.py
def test_acceder_perfil(page):
    page.goto("https://mi-app.com/login")
    page.fill("#email-input", "usuario@test.com")    # ← ¡Otra vez!
    page.fill("#password-input", "clave123")
    page.click("button.btn-login")
    page.click("a.perfil-link")</code></pre>
            <p>Si el ID <code>#email-input</code> cambia a <code>#user-email</code>,
            hay que modificar <strong>todos</strong> los archivos. En proyectos reales
            con cientos de tests, esto es insostenible.</p>
        </div>

        <h3>✅ La solución: Page Object Model</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Con POM, cada página tiene una <strong>clase que encapsula</strong> sus
            selectores y acciones. Los tests solo usan métodos de alto nivel:</p>
            <pre><code class="python"># ✅ Con POM — selectores centralizados

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
            <p>Si <code>#email-input</code> cambia, solo se modifica <strong>UNA línea</strong>
            en <code>LoginPage</code>. Todos los tests siguen funcionando.</p>
        </div>

        <h3>🧱 Principios fundamentales del POM</h3>
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

        <h3>📁 Estructura típica de un proyecto con POM</h3>
        <pre><code class="text">mi-proyecto-playwright/
├── pages/                    # Page Objects
│   ├── __init__.py
│   ├── base_page.py          # Clase base con métodos comunes
│   ├── login_page.py
│   ├── dashboard_page.py
│   ├── profile_page.py
│   └── products_page.py
├── tests/                    # Tests (usan Page Objects)
│   ├── conftest.py           # Fixtures compartidas
│   ├── test_login.py
│   ├── test_dashboard.py
│   └── test_products.py
├── utils/                    # Utilidades auxiliares
│   ├── test_data.py
│   └── helpers.py
├── pytest.ini
└── requirements.txt</code></pre>

        <h3>🔨 Anatomía de un Page Object</h3>
        <p>Un Page Object bien diseñado tiene tres secciones claras:</p>
        <pre><code class="python">class ProductsPage:
    """Page Object para la página de productos."""

    # ── 1. CONSTRUCTOR: Recibe page, define locators ──
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

    # ── 2. ACCIONES: Métodos que representan interacciones ──
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

    # ── 3. QUERIES: Métodos que retornan datos/estado ──
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

        <h3>🧪 Tests usando el Page Object</h3>
        <pre><code class="python"># test_products.py — limpio, legible, mantenible
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

        <h3>📋 Reglas de oro del POM</h3>
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

        <h3>🆚 POM vs Sin POM — Comparación de mantenimiento</h3>
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
            <strong>💡 Tip SIESA:</strong> En Siesa utilizamos POM para todos los proyectos de
            automatización. Cada módulo del ERP (Contabilidad, Nómina, Inventarios) tiene sus
            propios Page Objects. Esto permite que diferentes equipos trabajen en paralelo sin
            conflictos.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Identifica los problemas en el siguiente código y
            reescríbelo usando POM:</p>
            <pre><code class="python"># ❌ Código sin POM — identifica los problemas
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
