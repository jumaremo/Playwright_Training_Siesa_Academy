/**
 * Playwright Academy - Leccion 129
 * E-commerce Testing Suite
 * Seccion 20: Proyectos Capstone
 */

const LESSON_129 = {
    id: 129,
    title: "E-commerce Testing Suite",
    duration: "20 min",
    level: "advanced",
    section: "section-20",
    content: `
        <h2>E-commerce Testing Suite</h2>
        <p>En este proyecto capstone construiras una <strong>suite completa de testing para una tienda
        e-commerce</strong>. Aplicaras todos los conceptos aprendidos: Page Object Model, patrones
        de diseño, data-driven testing, API + UI hibrido, y best practices. Este proyecto simula
        un escenario real de automatizacion enterprise.</p>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>Este proyecto esta inspirado en la suite de automatizacion que el equipo de QA de SIESA
            construyo para el modulo de ventas e inventarios del ERP. Los flujos de catalogo, carrito
            y checkout son analogos a los flujos de cotizacion, pedido y facturacion del sistema
            empresarial.</p>
        </div>

        <h3>Requisitos del proyecto</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Funcionalidades a probar:</h4>
            <ol>
                <li><strong>Catalogo:</strong> Navegacion, busqueda, filtros, ordenamiento</li>
                <li><strong>Producto:</strong> Detalle, imagenes, variantes, stock</li>
                <li><strong>Carrito:</strong> Agregar, actualizar cantidades, eliminar</li>
                <li><strong>Checkout:</strong> Datos de envio, metodo de pago, confirmacion</li>
                <li><strong>Auth:</strong> Login, registro, recuperacion de contraseña</li>
                <li><strong>Historial:</strong> Ordenes pasadas, reordenar, tracking</li>
                <li><strong>Responsive:</strong> Desktop, tablet, mobile</li>
            </ol>
        </div>

        <h3>Estructura del proyecto</h3>

        <pre><code class="text">ecommerce-test-suite/
├── config/
│   ├── settings.py
│   └── environments.yaml
├── pages/
│   ├── base_page.py
│   ├── components/
│   │   ├── navbar.py
│   │   ├── product_card.py
│   │   ├── cart_sidebar.py
│   │   └── footer.py
│   ├── home_page.py
│   ├── catalog_page.py
│   ├── product_detail_page.py
│   ├── cart_page.py
│   ├── checkout_page.py
│   ├── login_page.py
│   ├── register_page.py
│   └── order_history_page.py
├── services/
│   ├── auth_service.py
│   ├── product_service.py
│   └── order_service.py
├── builders/
│   ├── user_builder.py
│   ├── product_builder.py
│   └── order_builder.py
├── fixtures/
│   ├── conftest.py
│   ├── auth_fixtures.py
│   ├── product_fixtures.py
│   └── cart_fixtures.py
├── data/
│   ├── users.json
│   └── products.json
├── tests/
│   ├── conftest.py
│   ├── smoke/
│   │   ├── test_home.py
│   │   └── test_login.py
│   ├── catalog/
│   │   ├── test_search.py
│   │   └── test_filters.py
│   ├── cart/
│   │   └── test_cart_operations.py
│   ├── checkout/
│   │   └── test_checkout_flow.py
│   ├── orders/
│   │   └── test_order_history.py
│   └── responsive/
│       └── test_mobile_views.py
├── pyproject.toml
└── Makefile</code></pre>

        <h3>Page Objects clave</h3>

        <pre><code class="python"># pages/catalog_page.py
from pages.base_page import BasePage
from playwright.sync_api import expect

class CatalogPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self._url = "/products"

    # Locators
    _search_input = "[data-testid='search-input']"
    _search_btn = "[data-testid='search-button']"
    _product_cards = "[data-testid='product-card']"
    _category_filter = "[data-testid='category-filter']"
    _price_range_min = "[data-testid='price-min']"
    _price_range_max = "[data-testid='price-max']"
    _sort_select = "[data-testid='sort-select']"
    _result_count = "[data-testid='result-count']"
    _no_results = "[data-testid='no-results']"

    def search(self, query: str):
        self.fill(self._search_input, query)
        self.click(self._search_btn)
        self.page.wait_for_load_state("networkidle")
        return self

    def filter_by_category(self, category: str):
        self.select_option(self._category_filter, category)
        self.page.wait_for_load_state("networkidle")
        return self

    def set_price_range(self, min_price: float, max_price: float):
        self.fill(self._price_range_min, str(min_price))
        self.fill(self._price_range_max, str(max_price))
        self.click(self._search_btn)
        return self

    def sort_by(self, option: str):
        self.select_option(self._sort_select, option)
        return self

    def get_product_count(self) -> int:
        return self.count(self._product_cards)

    def get_result_count_text(self) -> str:
        return self.get_text(self._result_count)

    def click_product(self, index: int = 0):
        self.locator(self._product_cards).nth(index).click()
        from pages.product_detail_page import ProductDetailPage
        return ProductDetailPage(self.page)

    def should_show_no_results(self):
        expect(self.locator(self._no_results)).to_be_visible()</code></pre>

        <pre><code class="python"># pages/cart_page.py
from pages.base_page import BasePage
from playwright.sync_api import expect

class CartPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self._url = "/cart"

    _cart_items = "[data-testid='cart-item']"
    _quantity_input = "[data-testid='quantity-input']"
    _remove_btn = "[data-testid='remove-item']"
    _subtotal = "[data-testid='subtotal']"
    _total = "[data-testid='cart-total']"
    _checkout_btn = "[data-testid='checkout-button']"
    _empty_cart = "[data-testid='empty-cart']"

    def get_item_count(self) -> int:
        return self.count(self._cart_items)

    def update_quantity(self, item_index: int, quantity: int):
        item = self.locator(self._cart_items).nth(item_index)
        item.locator(self._quantity_input).fill(str(quantity))
        item.locator(self._quantity_input).press("Enter")
        self.page.wait_for_load_state("networkidle")
        return self

    def remove_item(self, item_index: int):
        self.locator(self._cart_items).nth(item_index).locator(self._remove_btn).click()
        return self

    def get_total(self) -> str:
        return self.get_text(self._total)

    def proceed_to_checkout(self):
        self.click(self._checkout_btn)
        from pages.checkout_page import CheckoutPage
        return CheckoutPage(self.page)

    def should_be_empty(self):
        expect(self.locator(self._empty_cart)).to_be_visible()

    def should_have_items(self, count: int):
        expect(self.locator(self._cart_items)).to_have_count(count)</code></pre>

        <h3>Fixtures del proyecto</h3>

        <pre><code class="python"># fixtures/product_fixtures.py
import pytest

@pytest.fixture
def create_product(api_context, auth_token):
    """Factory fixture para crear productos via API."""
    created = []

    def _create(name="Test Product", price=99.99, stock=50, category="electronics"):
        resp = api_context.post("/api/products", data={
            "name": name, "price": price, "stock": stock, "category": category
        }, headers={"Authorization": f"Bearer {auth_token}"})
        product = resp.json()
        created.append(product["id"])
        return product

    yield _create

    for pid in created:
        api_context.delete(f"/api/products/{pid}",
                           headers={"Authorization": f"Bearer {auth_token}"})

@pytest.fixture
def product_in_cart(authenticated_page, create_product):
    """Producto ya agregado al carrito."""
    product = create_product(name="Laptop Test", price=1999.99)
    page = authenticated_page
    page.goto(f"/products/{product['id']}")
    page.click("[data-testid='add-to-cart']")
    page.wait_for_load_state("networkidle")
    return {"page": page, "product": product}</code></pre>

        <h3>Tests de ejemplo</h3>

        <pre><code class="python"># tests/catalog/test_search.py
import pytest
from playwright.sync_api import expect

class TestProductSearch:
    def test_search_by_name_returns_matching_products(self, authenticated_page, create_product, pages):
        # ARRANGE
        create_product(name="Laptop Dell XPS 15", category="electronics")
        create_product(name="Mouse Logitech MX", category="electronics")
        catalog = pages.catalog()
        catalog.navigate()

        # ACT
        catalog.search("Laptop")

        # ASSERT
        assert catalog.get_product_count() >= 1

    def test_search_with_no_results_shows_message(self, authenticated_page, pages):
        # ARRANGE
        catalog = pages.catalog()
        catalog.navigate()

        # ACT
        catalog.search("xyznonexistent12345")

        # ASSERT
        catalog.should_show_no_results()

    @pytest.mark.parametrize("category,expected_min", [
        ("electronics", 1),
        ("clothing", 1),
        ("books", 1),
    ])
    def test_filter_by_category(self, authenticated_page, pages, category, expected_min):
        catalog = pages.catalog()
        catalog.navigate()
        catalog.filter_by_category(category)
        assert catalog.get_product_count() >= expected_min</code></pre>

        <pre><code class="python"># tests/checkout/test_checkout_flow.py
from playwright.sync_api import expect

def test_complete_checkout_creates_order(authenticated_page, product_in_cart, pages):
    """Flujo completo: carrito -> checkout -> confirmacion."""
    page = product_in_cart["page"]

    # ARRANGE: ir al carrito
    page.goto("/cart")
    cart = pages.cart()
    cart.should_have_items(1)

    # ACT: completar checkout
    checkout = cart.proceed_to_checkout()
    checkout.fill_shipping_info(
        name="Juan Reina",
        address="Calle 45 #12-34",
        city="Cali",
        phone="+57 300 1234567"
    )
    checkout.select_payment_method("credit_card")
    checkout.fill_card_info(
        number="4111111111111111",
        expiry="12/28",
        cvv="123"
    )
    checkout.submit_order()

    # ASSERT
    expect(page.locator("[data-testid='order-confirmation']")).to_be_visible()
    expect(page.locator("[data-testid='order-status']")).to_have_text("Confirmada")</code></pre>

        <pre><code class="python"># tests/responsive/test_mobile_views.py
import pytest
from playwright.sync_api import expect

MOBILE_DEVICES = [
    {"name": "iPhone 14", "width": 390, "height": 844},
    {"name": "Samsung Galaxy S23", "width": 360, "height": 780},
]

@pytest.mark.parametrize("device", MOBILE_DEVICES, ids=[d["name"] for d in MOBILE_DEVICES])
def test_catalog_is_responsive(browser, device, base_url):
    context = browser.new_context(
        viewport={"width": device["width"], "height": device["height"]},
        is_mobile=True,
        has_touch=True,
    )
    page = context.new_page()
    page.goto(f"{base_url}/products")

    # En mobile, el menu hamburguesa debe ser visible
    expect(page.locator("[data-testid='mobile-menu-btn']")).to_be_visible()
    # El sidebar de filtros NO debe ser visible por defecto
    expect(page.locator("[data-testid='filter-sidebar']")).to_be_hidden()
    # Los productos deben mostrarse en columna unica
    expect(page.locator("[data-testid='product-card']").first).to_be_visible()

    context.close()</code></pre>

        <h3>Criterios de evaluacion</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Criterio</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Pts</th>
                </tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">6+ Page Objects con herencia de BasePage</td><td style="padding: 8px; border: 1px solid #ddd;">20</td></tr>
                <tr style="background: #f5f5f5;"><td style="padding: 8px; border: 1px solid #ddd;">15+ tests cubriendo catalogo, carrito, checkout</td><td style="padding: 8px; border: 1px solid #ddd;">25</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">Patron AAA en todos los tests</td><td style="padding: 8px; border: 1px solid #ddd;">10</td></tr>
                <tr style="background: #f5f5f5;"><td style="padding: 8px; border: 1px solid #ddd;">API fixtures con cleanup automatico</td><td style="padding: 8px; border: 1px solid #ddd;">15</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">Data-driven tests con parametrize</td><td style="padding: 8px; border: 1px solid #ddd;">10</td></tr>
                <tr style="background: #f5f5f5;"><td style="padding: 8px; border: 1px solid #ddd;">Tests responsive (2+ dispositivos)</td><td style="padding: 8px; border: 1px solid #ddd;">10</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">Organizacion correcta y naming conventions</td><td style="padding: 8px; border: 1px solid #ddd;">10</td></tr>
                <tr style="background: #f5f5f5;"><td style="padding: 8px; border: 1px solid #ddd;"><strong>TOTAL</strong></td><td style="padding: 8px; border: 1px solid #ddd;"><strong>100</strong></td></tr>
            </table>
        </div>

        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>En el siguiente proyecto capstone</strong> construiras una suite de
            <strong>API Microservices Testing</strong>, combinando Playwright API context
            con validacion de multiples endpoints y contratos.</p>
        </div>
    `,
    topics: ["e-commerce", "suite", "capstone"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 20,
    difficulty: "hard",
    type: "capstone"
};

if (typeof window !== 'undefined') {
    window.LESSON_129 = LESSON_129;
}
