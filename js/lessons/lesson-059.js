/**
 * Playwright Academy - Lección 059
 * Proyecto: Framework POM completo
 * Sección 7: Page Object Model y Helpers
 */

const LESSON_059 = {
    id: 59,
    title: "Proyecto: Framework POM completo",
    duration: "12 min",
    level: "intermediate",
    section: "section-07",
    content: `
        <h2>🏆 Proyecto: Framework POM completo</h2>
        <p>En este proyecto integrador construiremos un <strong>framework de automatización
        completo</strong> para un e-commerce usando todo lo aprendido en la Sección 7:
        Page Objects, Components, Helpers, Fixtures, Builder Pattern y Fluent API.</p>

        <h3>🎯 Objetivo del proyecto</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Automatizar el flujo E2E de un e-commerce llamado <strong>"TiendaTest"</strong>
            que tiene:</p>
            <ul>
                <li><strong>Login:</strong> autenticación con roles (admin, cliente)</li>
                <li><strong>Catálogo:</strong> lista de productos con búsqueda y filtros</li>
                <li><strong>Carrito:</strong> agregar/quitar productos, ver subtotal</li>
                <li><strong>Checkout:</strong> formulario de datos + pago + confirmación</li>
                <li><strong>Panel Admin:</strong> gestión de productos y pedidos</li>
            </ul>
        </div>

        <h3>📁 Estructura completa del framework</h3>
        <pre><code class="text">tienda-test-framework/
├── components/                     # Fragmentos UI reutilizables
│   ├── __init__.py
│   ├── header_component.py         # Header con nav, búsqueda, carrito
│   ├── footer_component.py         # Footer con links
│   ├── product_card_component.py   # Tarjeta de producto individual
│   ├── cart_sidebar_component.py   # Sidebar del carrito
│   ├── table_component.py          # Tabla genérica de datos
│   ├── modal_component.py          # Diálogos modales
│   ├── pagination_component.py     # Controles de paginación
│   └── toast_component.py          # Notificaciones toast
│
├── pages/                          # Page Objects
│   ├── __init__.py
│   ├── base_page.py                # Clase base
│   ├── login_page.py               # Página de login
│   ├── catalog_page.py             # Catálogo de productos
│   ├── product_detail_page.py      # Detalle de producto
│   ├── cart_page.py                # Página del carrito
│   ├── checkout_page.py            # Checkout con fluent API
│   ├── order_confirmation_page.py  # Confirmación de pedido
│   └── admin/                      # Pages del panel admin
│       ├── __init__.py
│       ├── admin_dashboard_page.py
│       ├── admin_products_page.py
│       └── admin_orders_page.py
│
├── builders/                       # Builders para datos
│   ├── __init__.py
│   ├── user_builder.py             # Datos de usuario
│   ├── product_builder.py          # Datos de producto
│   └── order_builder.py            # Datos de pedido
│
├── utils/                          # Helpers y utilidades
│   ├── __init__.py
│   ├── test_data.py                # Generador de datos random
│   ├── auth_helper.py              # Manejo de autenticación
│   ├── api_helper.py               # Llamadas directas a API
│   ├── evidence_helper.py          # Screenshots y evidencias
│   └── db_helper.py                # Limpieza de base de datos
│
├── tests/                          # Tests organizados por feature
│   ├── conftest.py                 # Fixtures globales
│   ├── test_login.py
│   ├── test_catalog.py
│   ├── test_cart.py
│   ├── test_checkout.py
│   └── test_admin.py
│
├── pytest.ini                      # Configuración pytest
└── requirements.txt                # Dependencias</code></pre>

        <h3>🏛️ 1. Base Page con métodos comunes</h3>
        <div class="code-tabs" data-code-id="L059-1">
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
            <pre><code class="language-python"># pages/base_page.py
from components.header_component import HeaderComponent
from components.toast_component import ToastComponent

class BasePage:
    """Clase base para todos los Page Objects del framework."""

    def __init__(self, page):
        self.page = page
        self.url = ""

        # Components disponibles en todas las páginas
        self.header = HeaderComponent(page)
        self.toast = ToastComponent(page)

    def navigate(self):
        if self.url:
            self.page.goto(self.url)
            self.wait_for_load()
        return self

    def wait_for_load(self):
        self.page.wait_for_load_state("networkidle")
        return self

    def get_current_url(self):
        return self.page.url

    def get_title(self):
        return self.page.title()

    def take_screenshot(self, name):
        self.page.screenshot(path=f"evidence/{name}.png")
        return self</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// pages/base-page.ts
import { Page, Locator } from '@playwright/test';
import { HeaderComponent } from '../components/header-component';
import { ToastComponent } from '../components/toast-component';

export class BasePage {
    protected page: Page;
    protected url = '';
    public header: HeaderComponent;
    public toast: ToastComponent;

    constructor(page: Page) {
        this.page = page;
        this.header = new HeaderComponent(page);
        this.toast = new ToastComponent(page);
    }

    async navigate(): Promise&lt;this&gt; {
        if (this.url) {
            await this.page.goto(this.url);
            await this.waitForLoad();
        }
        return this;
    }

    async waitForLoad(): Promise&lt;this&gt; {
        await this.page.waitForLoadState('networkidle');
        return this;
    }

    getCurrentUrl(): string {
        return this.page.url();
    }

    async getTitle(): Promise&lt;string&gt; {
        return this.page.title();
    }

    async takeScreenshot(name: string): Promise&lt;this&gt; {
        await this.page.screenshot({ path: 'evidence/' + name + '.png' });
        return this;
    }
}</code></pre>
        </div>
        </div>

        <h3>🧩 2. Components clave</h3>
        <div class="code-tabs" data-code-id="L059-2">
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
            <pre><code class="language-python"># components/header_component.py
class HeaderComponent:
    def __init__(self, page):
        self.root = page.locator("header.main-nav")
        self.logo = self.root.locator(".logo")
        self.search_input = self.root.locator("[data-testid='search']")
        self.cart_icon = self.root.locator("[data-testid='cart-icon']")
        self.cart_count = self.root.locator("[data-testid='cart-count']")
        self.user_menu = self.root.locator("[data-testid='user-menu']")

    def search(self, query):
        self.search_input.fill(query)
        self.search_input.press("Enter")
        return self

    def open_cart(self):
        self.cart_icon.click()
        return self

    def get_cart_count(self):
        text = self.cart_count.text_content()
        return int(text) if text else 0

    def get_username(self):
        return self.user_menu.text_content().strip()


# components/product_card_component.py
class ProductCardComponent:
    """Representa una tarjeta de producto individual."""

    def __init__(self, locator):
        """Recibe un locator que apunta a una tarjeta específica."""
        self.root = locator
        self.name = self.root.locator(".product-name")
        self.price = self.root.locator(".product-price")
        self.image = self.root.locator(".product-image")
        self.add_to_cart_btn = self.root.locator("[data-testid='add-to-cart']")

    def get_name(self):
        return self.name.text_content().strip()

    def get_price(self):
        text = self.price.text_content()
        # Extraer número de "$49,999"
        return float(text.replace("$", "").replace(",", "").strip())

    def add_to_cart(self):
        self.add_to_cart_btn.click()
        return self

    def click(self):
        self.root.click()
        return self


# components/toast_component.py
class ToastComponent:
    """Manejo de notificaciones toast."""

    def __init__(self, page):
        self.page = page
        self.toast = page.locator(".toast, [role='alert']")

    def get_message(self):
        self.toast.first.wait_for(state="visible", timeout=5000)
        return self.toast.first.text_content()

    def is_success(self):
        return "success" in (
            self.toast.first.get_attribute("class") or ""
        )

    def dismiss(self):
        close = self.toast.first.locator(".toast-close")
        if close.is_visible():
            close.click()
        return self</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// components/header-component.ts
import { Page, Locator } from '@playwright/test';

export class HeaderComponent {
    private root: Locator;
    private logo: Locator;
    private searchInput: Locator;
    private cartIcon: Locator;
    private cartCount: Locator;
    private userMenu: Locator;

    constructor(page: Page) {
        this.root = page.locator('header.main-nav');
        this.logo = this.root.locator('.logo');
        this.searchInput = this.root.locator("[data-testid='search']");
        this.cartIcon = this.root.locator("[data-testid='cart-icon']");
        this.cartCount = this.root.locator("[data-testid='cart-count']");
        this.userMenu = this.root.locator("[data-testid='user-menu']");
    }

    async search(query: string): Promise&lt;this&gt; {
        await this.searchInput.fill(query);
        await this.searchInput.press('Enter');
        return this;
    }

    async openCart(): Promise&lt;this&gt; {
        await this.cartIcon.click();
        return this;
    }

    async getCartCount(): Promise&lt;number&gt; {
        const text = await this.cartCount.textContent();
        return text ? parseInt(text) : 0;
    }

    async getUsername(): Promise&lt;string&gt; {
        const text = await this.userMenu.textContent();
        return text?.trim() ?? '';
    }
}

// components/product-card-component.ts
export class ProductCardComponent {
    private root: Locator;
    private nameEl: Locator;
    private priceEl: Locator;
    private image: Locator;
    private addToCartBtn: Locator;

    constructor(locator: Locator) {
        this.root = locator;
        this.nameEl = this.root.locator('.product-name');
        this.priceEl = this.root.locator('.product-price');
        this.image = this.root.locator('.product-image');
        this.addToCartBtn = this.root.locator("[data-testid='add-to-cart']");
    }

    async getName(): Promise&lt;string&gt; {
        const text = await this.nameEl.textContent();
        return text?.trim() ?? '';
    }

    async getPrice(): Promise&lt;number&gt; {
        const text = await this.priceEl.textContent();
        return parseFloat(text!.replace('$', '').replace(',', '').trim());
    }

    async addToCart(): Promise&lt;this&gt; {
        await this.addToCartBtn.click();
        return this;
    }

    async click(): Promise&lt;this&gt; {
        await this.root.click();
        return this;
    }
}

// components/toast-component.ts
export class ToastComponent {
    private page: Page;
    private toast: Locator;

    constructor(page: Page) {
        this.page = page;
        this.toast = page.locator(".toast, [role='alert']");
    }

    async getMessage(): Promise&lt;string&gt; {
        await this.toast.first().waitFor({ state: 'visible', timeout: 5000 });
        return (await this.toast.first().textContent()) ?? '';
    }

    async isSuccess(): Promise&lt;boolean&gt; {
        const cls = await this.toast.first().getAttribute('class');
        return (cls ?? '').includes('success');
    }

    async dismiss(): Promise&lt;this&gt; {
        const close = this.toast.first().locator('.toast-close');
        if (await close.isVisible()) {
            await close.click();
        }
        return this;
    }
}</code></pre>
        </div>
        </div>

        <h3>📄 3. Page Objects principales</h3>
        <div class="code-tabs" data-code-id="L059-3">
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
            <pre><code class="language-python"># pages/login_page.py
from pages.base_page import BasePage

class LoginPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.url = "https://tienda-test.com/login"
        self.email_input = page.locator("[data-testid='email']")
        self.password_input = page.locator("[data-testid='password']")
        self.login_button = page.locator("[data-testid='login-btn']")
        self.error_message = page.locator("[data-testid='error']")

    def login(self, email, password):
        self.email_input.fill(email)
        self.password_input.fill(password)
        self.login_button.click()
        return self

    def login_as_admin(self):
        return self.login("admin@tienda.com", "admin123")

    def login_as_customer(self):
        return self.login("cliente@test.com", "cliente123")

    def is_error_visible(self):
        return self.error_message.is_visible()

    def get_error_text(self):
        return self.error_message.text_content()


# pages/catalog_page.py
from pages.base_page import BasePage
from components.product_card_component import ProductCardComponent
from components.pagination_component import PaginationComponent

class CatalogPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.url = "https://tienda-test.com/products"

        self.product_cards = page.locator("[data-testid='product-card']")
        self.category_filter = page.locator("[data-testid='category-filter']")
        self.price_min = page.locator("[data-testid='price-min']")
        self.price_max = page.locator("[data-testid='price-max']")
        self.sort_select = page.locator("[data-testid='sort-by']")
        self.no_results = page.locator("[data-testid='no-results']")

        self.pagination = PaginationComponent(page)

    def get_product_count(self):
        return self.product_cards.count()

    def get_product(self, index):
        """Obtener un ProductCardComponent por índice."""
        return ProductCardComponent(self.product_cards.nth(index))

    def get_product_by_name(self, name):
        """Obtener un ProductCardComponent por nombre."""
        card = self.product_cards.filter(has_text=name)
        return ProductCardComponent(card)

    def filter_by_category(self, category):
        self.category_filter.select_option(label=category)
        self.wait_for_load()
        return self

    def filter_by_price(self, min_price=None, max_price=None):
        if min_price is not None:
            self.price_min.fill(str(min_price))
        if max_price is not None:
            self.price_max.fill(str(max_price))
        self.page.keyboard.press("Enter")
        self.wait_for_load()
        return self

    def sort_by(self, option):
        self.sort_select.select_option(label=option)
        self.wait_for_load()
        return self

    def get_all_prices(self):
        prices = []
        for i in range(self.product_cards.count()):
            card = self.get_product(i)
            prices.append(card.get_price())
        return prices

    def has_results(self):
        return not self.no_results.is_visible()


# pages/checkout_page.py — Con Fluent API
from pages.base_page import BasePage

class CheckoutPage(BasePage):
    """Checkout con Fluent API para encadenar acciones."""

    def __init__(self, page):
        super().__init__(page)
        self.url = "https://tienda-test.com/checkout"

        # Datos personales
        self.name_input = page.locator("[data-testid='fullname']")
        self.email_input = page.locator("[data-testid='email']")
        self.phone_input = page.locator("[data-testid='phone']")

        # Dirección
        self.address_input = page.locator("[data-testid='address']")
        self.city_input = page.locator("[data-testid='city']")
        self.department_select = page.locator("[data-testid='department']")

        # Pago
        self.payment_select = page.locator("[data-testid='payment-method']")
        self.card_number = page.locator("[data-testid='card-number']")
        self.card_expiry = page.locator("[data-testid='card-expiry']")
        self.card_cvv = page.locator("[data-testid='card-cvv']")

        # Acciones
        self.terms_checkbox = page.locator("[data-testid='accept-terms']")
        self.submit_button = page.locator("[data-testid='place-order']")
        self.order_total = page.locator("[data-testid='order-total']")

    # ── Fluent API: datos personales ──
    def fill_name(self, name):
        self.name_input.fill(name)
        return self

    def fill_email(self, email):
        self.email_input.fill(email)
        return self

    def fill_phone(self, phone):
        self.phone_input.fill(phone)
        return self

    # ── Fluent API: dirección ──
    def fill_address(self, address):
        self.address_input.fill(address)
        return self

    def fill_city(self, city):
        self.city_input.fill(city)
        return self

    def select_department(self, department):
        self.department_select.select_option(label=department)
        return self

    # ── Fluent API: pago ──
    def select_payment(self, method):
        self.payment_select.select_option(label=method)
        return self

    def fill_card(self, number, expiry, cvv):
        self.card_number.fill(number)
        self.card_expiry.fill(expiry)
        self.card_cvv.fill(cvv)
        return self

    # ── Acciones finales ──
    def accept_terms(self):
        self.terms_checkbox.check()
        return self

    def place_order(self):
        self.submit_button.click()
        return self

    def get_total(self):
        text = self.order_total.text_content()
        return float(text.replace("$", "").replace(",", "").strip())

    # ── Método compuesto desde Builder ──
    def fill_from_order(self, order_data):
        """Llenar todo el checkout desde datos del OrderBuilder."""
        self.fill_name(order_data["nombre"]) \\
            .fill_email(order_data["email"]) \\
            .fill_phone(order_data["telefono"]) \\
            .fill_address(order_data["direccion"]) \\
            .fill_city(order_data["ciudad"]) \\
            .select_department(order_data["departamento"])

        if order_data.get("metodo_pago") == "Tarjeta":
            self.select_payment("Tarjeta de crédito") \\
                .fill_card(
                    order_data["tarjeta"]["numero"],
                    order_data["tarjeta"]["expiry"],
                    order_data["tarjeta"]["cvv"]
                )
        else:
            self.select_payment(order_data["metodo_pago"])

        return self</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// pages/login-page.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

export class LoginPage extends BasePage {
    private emailInput: Locator;
    private passwordInput: Locator;
    private loginButton: Locator;
    private errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.url = 'https://tienda-test.com/login';
        this.emailInput = page.locator("[data-testid='email']");
        this.passwordInput = page.locator("[data-testid='password']");
        this.loginButton = page.locator("[data-testid='login-btn']");
        this.errorMessage = page.locator("[data-testid='error']");
    }

    async login(email: string, password: string): Promise&lt;this&gt; {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        return this;
    }

    async loginAsAdmin(): Promise&lt;this&gt; {
        return this.login('admin@tienda.com', 'admin123');
    }

    async loginAsCustomer(): Promise&lt;this&gt; {
        return this.login('cliente@test.com', 'cliente123');
    }

    async isErrorVisible(): Promise&lt;boolean&gt; {
        return this.errorMessage.isVisible();
    }

    async getErrorText(): Promise&lt;string | null&gt; {
        return this.errorMessage.textContent();
    }
}

// pages/catalog-page.ts
import { ProductCardComponent } from '../components/product-card-component';
import { PaginationComponent } from '../components/pagination-component';

export class CatalogPage extends BasePage {
    private productCards: Locator;
    private categoryFilter: Locator;
    private priceMin: Locator;
    private priceMax: Locator;
    private sortSelect: Locator;
    private noResults: Locator;
    public pagination: PaginationComponent;

    constructor(page: Page) {
        super(page);
        this.url = 'https://tienda-test.com/products';
        this.productCards = page.locator("[data-testid='product-card']");
        this.categoryFilter = page.locator("[data-testid='category-filter']");
        this.priceMin = page.locator("[data-testid='price-min']");
        this.priceMax = page.locator("[data-testid='price-max']");
        this.sortSelect = page.locator("[data-testid='sort-by']");
        this.noResults = page.locator("[data-testid='no-results']");
        this.pagination = new PaginationComponent(page);
    }

    async getProductCount(): Promise&lt;number&gt; {
        return this.productCards.count();
    }

    getProduct(index: number): ProductCardComponent {
        return new ProductCardComponent(this.productCards.nth(index));
    }

    getProductByName(name: string): ProductCardComponent {
        return new ProductCardComponent(this.productCards.filter({ hasText: name }));
    }

    async filterByCategory(category: string): Promise&lt;this&gt; {
        await this.categoryFilter.selectOption({ label: category });
        await this.waitForLoad();
        return this;
    }

    async filterByPrice(minPrice?: number, maxPrice?: number): Promise&lt;this&gt; {
        if (minPrice !== undefined) await this.priceMin.fill(String(minPrice));
        if (maxPrice !== undefined) await this.priceMax.fill(String(maxPrice));
        await this.page.keyboard.press('Enter');
        await this.waitForLoad();
        return this;
    }

    async sortBy(option: string): Promise&lt;this&gt; {
        await this.sortSelect.selectOption({ label: option });
        await this.waitForLoad();
        return this;
    }

    async getAllPrices(): Promise&lt;number[]&gt; {
        const prices: number[] = [];
        const count = await this.productCards.count();
        for (let i = 0; i &lt; count; i++) {
            const card = this.getProduct(i);
            prices.push(await card.getPrice());
        }
        return prices;
    }

    async hasResults(): Promise&lt;boolean&gt; {
        return !(await this.noResults.isVisible());
    }
}

// pages/checkout-page.ts — Con Fluent API
export class CheckoutPage extends BasePage {
    private nameInput: Locator;
    private emailInput: Locator;
    private phoneInput: Locator;
    private addressInput: Locator;
    private cityInput: Locator;
    private departmentSelect: Locator;
    private paymentSelect: Locator;
    private cardNumber: Locator;
    private cardExpiry: Locator;
    private cardCvv: Locator;
    private termsCheckbox: Locator;
    private submitButton: Locator;
    private orderTotal: Locator;

    constructor(page: Page) {
        super(page);
        this.url = 'https://tienda-test.com/checkout';
        this.nameInput = page.locator("[data-testid='fullname']");
        this.emailInput = page.locator("[data-testid='email']");
        this.phoneInput = page.locator("[data-testid='phone']");
        this.addressInput = page.locator("[data-testid='address']");
        this.cityInput = page.locator("[data-testid='city']");
        this.departmentSelect = page.locator("[data-testid='department']");
        this.paymentSelect = page.locator("[data-testid='payment-method']");
        this.cardNumber = page.locator("[data-testid='card-number']");
        this.cardExpiry = page.locator("[data-testid='card-expiry']");
        this.cardCvv = page.locator("[data-testid='card-cvv']");
        this.termsCheckbox = page.locator("[data-testid='accept-terms']");
        this.submitButton = page.locator("[data-testid='place-order']");
        this.orderTotal = page.locator("[data-testid='order-total']");
    }

    async fillName(name: string) { await this.nameInput.fill(name); return this; }
    async fillEmail(email: string) { await this.emailInput.fill(email); return this; }
    async fillPhone(phone: string) { await this.phoneInput.fill(phone); return this; }
    async fillAddress(addr: string) { await this.addressInput.fill(addr); return this; }
    async fillCity(city: string) { await this.cityInput.fill(city); return this; }
    async selectDepartment(dept: string) {
        await this.departmentSelect.selectOption({ label: dept }); return this;
    }
    async selectPayment(method: string) {
        await this.paymentSelect.selectOption({ label: method }); return this;
    }
    async fillCard(number: string, expiry: string, cvv: string) {
        await this.cardNumber.fill(number);
        await this.cardExpiry.fill(expiry);
        await this.cardCvv.fill(cvv);
        return this;
    }
    async acceptTerms() { await this.termsCheckbox.check(); return this; }
    async placeOrder() { await this.submitButton.click(); return this; }

    async getTotal(): Promise&lt;number&gt; {
        const text = await this.orderTotal.textContent();
        return parseFloat(text!.replace('$', '').replace(',', '').trim());
    }

    async fillFromOrder(orderData: Record&lt;string, any&gt;) {
        await this.fillName(orderData.nombre);
        await this.fillEmail(orderData.email);
        await this.fillPhone(orderData.telefono);
        await this.fillAddress(orderData.direccion);
        await this.fillCity(orderData.ciudad);
        await this.selectDepartment(orderData.departamento);

        if (orderData.metodo_pago === 'Tarjeta') {
            await this.selectPayment('Tarjeta de crédito');
            await this.fillCard(
                orderData.tarjeta.numero,
                orderData.tarjeta.expiry,
                orderData.tarjeta.cvv
            );
        } else {
            await this.selectPayment(orderData.metodo_pago);
        }
        return this;
    }
}</code></pre>
        </div>
        </div>

        <h3>🏗️ 4. Builders</h3>
        <div class="code-tabs" data-code-id="L059-4">
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
            <pre><code class="language-python"># builders/order_builder.py
from utils.test_data import TestData

class OrderBuilder:
    """Builder para datos de pedido completos."""

    def __init__(self):
        self._data = {
            "nombre": "Test Customer",
            "email": TestData.random_email(),
            "telefono": TestData.random_phone(),
            "direccion": "Calle 10 #25-30",
            "ciudad": "Cali",
            "departamento": "Valle del Cauca",
            "metodo_pago": "PSE",
            "tarjeta": None,
            "cupon": None,
        }

    def with_name(self, nombre):
        self._data["nombre"] = nombre
        return self

    def with_email(self, email):
        self._data["email"] = email
        return self

    def in_city(self, ciudad, departamento):
        self._data["ciudad"] = ciudad
        self._data["departamento"] = departamento
        return self

    def pay_with_card(self, number="4111111111111111",
                      expiry="12/28", cvv="123"):
        self._data["metodo_pago"] = "Tarjeta"
        self._data["tarjeta"] = {
            "numero": number, "expiry": expiry, "cvv": cvv
        }
        return self

    def pay_with_pse(self):
        self._data["metodo_pago"] = "PSE"
        self._data["tarjeta"] = None
        return self

    def with_coupon(self, code):
        self._data["cupon"] = code
        return self

    def as_bogota_customer(self):
        return self.in_city("Bogotá", "Cundinamarca")

    def as_cali_customer(self):
        return self.in_city("Cali", "Valle del Cauca")

    def build(self):
        return dict(self._data)</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// builders/order-builder.ts
import { TestData } from '../utils/test-data';

interface CardData {
    numero: string;
    expiry: string;
    cvv: string;
}

interface OrderData {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    ciudad: string;
    departamento: string;
    metodo_pago: string;
    tarjeta: CardData | null;
    cupon: string | null;
}

export class OrderBuilder {
    private data: OrderData;

    constructor() {
        this.data = {
            nombre: 'Test Customer',
            email: TestData.randomEmail(),
            telefono: TestData.randomPhone(),
            direccion: 'Calle 10 #25-30',
            ciudad: 'Cali',
            departamento: 'Valle del Cauca',
            metodo_pago: 'PSE',
            tarjeta: null,
            cupon: null,
        };
    }

    withName(nombre: string) { this.data.nombre = nombre; return this; }
    withEmail(email: string) { this.data.email = email; return this; }

    inCity(ciudad: string, departamento: string) {
        this.data.ciudad = ciudad;
        this.data.departamento = departamento;
        return this;
    }

    payWithCard(number = '4111111111111111', expiry = '12/28', cvv = '123') {
        this.data.metodo_pago = 'Tarjeta';
        this.data.tarjeta = { numero: number, expiry, cvv };
        return this;
    }

    payWithPse() {
        this.data.metodo_pago = 'PSE';
        this.data.tarjeta = null;
        return this;
    }

    withCoupon(code: string) { this.data.cupon = code; return this; }
    asBogotaCustomer() { return this.inCity('Bogotá', 'Cundinamarca'); }
    asCaliCustomer() { return this.inCity('Cali', 'Valle del Cauca'); }

    build(): OrderData { return { ...this.data }; }
}</code></pre>
        </div>
        </div>

        <h3>⚙️ 5. Fixtures (conftest.py)</h3>
        <div class="code-tabs" data-code-id="L059-5">
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
from pages.login_page import LoginPage
from pages.catalog_page import CatalogPage
from pages.checkout_page import CheckoutPage
from utils.auth_helper import AuthHelper
from utils.api_helper import ApiHelper

# ── Autenticación reutilizable ──

@pytest.fixture(scope="session")
def customer_auth_state(browser):
    """Login como cliente UNA VEZ para toda la sesión."""
    context = browser.new_context()
    page = context.new_page()
    login = LoginPage(page)
    login.navigate().login_as_customer()
    page.wait_for_url("**/products")
    state = context.storage_state()
    context.close()
    return state

@pytest.fixture
def customer_page(browser, customer_auth_state):
    """Página autenticada como cliente."""
    context = browser.new_context(storage_state=customer_auth_state)
    page = context.new_page()
    yield page
    context.close()

# ── Page Object fixtures ──

@pytest.fixture
def login_page(page):
    lp = LoginPage(page)
    lp.navigate()
    return lp

@pytest.fixture
def catalog_page(customer_page):
    cp = CatalogPage(customer_page)
    cp.navigate()
    return cp

@pytest.fixture
def checkout_with_items(customer_page, api_helper):
    """Checkout con productos en el carrito (agregados via API)."""
    api_helper.add_to_cart("product-001")
    api_helper.add_to_cart("product-002")
    cp = CheckoutPage(customer_page)
    cp.navigate()
    return cp

# ── Helpers como fixtures ──

@pytest.fixture
def api_helper(customer_page):
    return ApiHelper(customer_page)</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// tests/fixtures.ts
import { test as base, Page, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { CatalogPage } from '../pages/catalog-page';
import { CheckoutPage } from '../pages/checkout-page';
import { ApiHelper } from '../utils/api-helper';

// ── Autenticación reutilizable ──
// En playwright.config.ts → globalSetup:
// async function globalSetup() {
//   const browser = await chromium.launch();
//   const context = await browser.newContext();
//   const page = await context.newPage();
//   const login = new LoginPage(page);
//   await login.navigate();
//   await login.loginAsCustomer();
//   await page.waitForURL('**/products');
//   await context.storageState({ path: '.auth/customer.json' });
//   await context.close();
// }

// ── Custom fixtures con test.extend ──
type TestFixtures = {
    loginPage: LoginPage;
    catalogPage: CatalogPage;
    checkoutWithItems: CheckoutPage;
    apiHelper: ApiHelper;
};

export const test = base.extend&lt;TestFixtures&gt;({
    loginPage: async ({ page }, use) => {
        const lp = new LoginPage(page);
        await lp.navigate();
        await use(lp);
    },

    catalogPage: async ({ browser }, use) => {
        const context = await browser.newContext({
            storageState: '.auth/customer.json'
        });
        const page = await context.newPage();
        const cp = new CatalogPage(page);
        await cp.navigate();
        await use(cp);
        await context.close();
    },

    apiHelper: async ({ browser }, use) => {
        const context = await browser.newContext({
            storageState: '.auth/customer.json'
        });
        const page = await context.newPage();
        await use(new ApiHelper(page));
        await context.close();
    },

    checkoutWithItems: async ({ browser, apiHelper }, use) => {
        await apiHelper.addToCart('product-001');
        await apiHelper.addToCart('product-002');
        const context = await browser.newContext({
            storageState: '.auth/customer.json'
        });
        const page = await context.newPage();
        const cp = new CheckoutPage(page);
        await cp.navigate();
        await use(cp);
        await context.close();
    },
});</code></pre>
        </div>
        </div>

        <h3>🧪 6. Tests del proyecto</h3>
        <div class="code-tabs" data-code-id="L059-6">
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
            <pre><code class="language-python"># tests/test_catalog.py

def test_buscar_producto(catalog_page):
    """Verificar búsqueda de productos."""
    catalog_page.header.search("laptop")
    assert catalog_page.get_product_count() > 0
    assert catalog_page.has_results()

def test_filtrar_por_categoria(catalog_page):
    """Verificar filtro por categoría."""
    catalog_page.filter_by_category("Electrónica")
    count = catalog_page.get_product_count()
    assert count > 0

def test_ordenar_por_precio(catalog_page):
    """Verificar ordenamiento por precio ascendente."""
    catalog_page.sort_by("Precio: menor a mayor")
    prices = catalog_page.get_all_prices()
    assert prices == sorted(prices)

def test_agregar_al_carrito(catalog_page):
    """Verificar agregar producto al carrito."""
    product = catalog_page.get_product(0)
    product_name = product.get_name()
    product.add_to_cart()

    msg = catalog_page.toast.get_message()
    assert product_name in msg
    assert catalog_page.header.get_cart_count() == 1


# tests/test_checkout.py
from builders.order_builder import OrderBuilder

def test_compra_con_tarjeta(checkout_with_items):
    """Flujo completo de compra con tarjeta de crédito."""
    order = OrderBuilder() \\
        .with_name("Juan Reina") \\
        .as_cali_customer() \\
        .pay_with_card() \\
        .build()

    checkout_with_items \\
        .fill_from_order(order) \\
        .accept_terms() \\
        .place_order()

    assert "pedido" in checkout_with_items.page.url

def test_compra_con_pse(checkout_with_items):
    """Flujo de compra con PSE."""
    order = OrderBuilder() \\
        .with_name("Carlos Díaz") \\
        .as_bogota_customer() \\
        .pay_with_pse() \\
        .build()

    checkout_with_items \\
        .fill_from_order(order) \\
        .accept_terms() \\
        .place_order()

    assert "pedido" in checkout_with_items.page.url

def test_compra_con_cupon(checkout_with_items):
    """Flujo de compra con cupón de descuento."""
    order = OrderBuilder() \\
        .with_name("Alejandro Bravo") \\
        .as_cali_customer() \\
        .pay_with_card() \\
        .with_coupon("DESCUENTO20") \\
        .build()

    total_before = checkout_with_items.get_total()
    checkout_with_items \\
        .fill_from_order(order) \\
        .accept_terms() \\
        .place_order()

    # El total debería ser menor con cupón
    assert "pedido" in checkout_with_items.page.url</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// tests/test-catalog.spec.ts
import { test } from './fixtures';
import { expect } from '@playwright/test';

test('buscar producto', async ({ catalogPage }) => {
    await catalogPage.header.search('laptop');
    expect(await catalogPage.getProductCount()).toBeGreaterThan(0);
    expect(await catalogPage.hasResults()).toBe(true);
});

test('filtrar por categoría', async ({ catalogPage }) => {
    await catalogPage.filterByCategory('Electrónica');
    const count = await catalogPage.getProductCount();
    expect(count).toBeGreaterThan(0);
});

test('ordenar por precio', async ({ catalogPage }) => {
    await catalogPage.sortBy('Precio: menor a mayor');
    const prices = await catalogPage.getAllPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
});

test('agregar al carrito', async ({ catalogPage }) => {
    const product = catalogPage.getProduct(0);
    const productName = await product.getName();
    await product.addToCart();

    const msg = await catalogPage.toast.getMessage();
    expect(msg).toContain(productName);
    expect(await catalogPage.header.getCartCount()).toBe(1);
});


// tests/test-checkout.spec.ts
import { OrderBuilder } from '../builders/order-builder';

test('compra con tarjeta', async ({ checkoutWithItems }) => {
    const order = new OrderBuilder()
        .withName('Juan Reina')
        .asCaliCustomer()
        .payWithCard()
        .build();

    await checkoutWithItems.fillFromOrder(order);
    await checkoutWithItems.acceptTerms();
    await checkoutWithItems.placeOrder();

    expect(checkoutWithItems.page.url()).toContain('pedido');
});

test('compra con PSE', async ({ checkoutWithItems }) => {
    const order = new OrderBuilder()
        .withName('Carlos Díaz')
        .asBogotaCustomer()
        .payWithPse()
        .build();

    await checkoutWithItems.fillFromOrder(order);
    await checkoutWithItems.acceptTerms();
    await checkoutWithItems.placeOrder();

    expect(checkoutWithItems.page.url()).toContain('pedido');
});

test('compra con cupón', async ({ checkoutWithItems }) => {
    const order = new OrderBuilder()
        .withName('Alejandro Bravo')
        .asCaliCustomer()
        .payWithCard()
        .withCoupon('DESCUENTO20')
        .build();

    const totalBefore = await checkoutWithItems.getTotal();
    await checkoutWithItems.fillFromOrder(order);
    await checkoutWithItems.acceptTerms();
    await checkoutWithItems.placeOrder();

    // El total debería ser menor con cupón
    expect(checkoutWithItems.page.url()).toContain('pedido');
});</code></pre>
        </div>
        </div>

        <h3>📊 Resumen de patrones aplicados</h3>
        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #283593; color: white;">
                        <th style="padding: 10px;">Patrón</th>
                        <th style="padding: 10px;">Dónde se aplica</th>
                        <th style="padding: 10px;">Beneficio</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #e8eaf6;">
                        <td style="padding: 8px;"><strong>BasePage</strong></td>
                        <td style="padding: 8px;">Herencia en todos los PO</td>
                        <td style="padding: 8px;">DRY: métodos comunes centralizados</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>Components</strong></td>
                        <td style="padding: 8px;">Header, Toast, ProductCard</td>
                        <td style="padding: 8px;">Reutilización entre páginas</td>
                    </tr>
                    <tr style="background: #e8eaf6;">
                        <td style="padding: 8px;"><strong>Fluent API</strong></td>
                        <td style="padding: 8px;">CheckoutPage</td>
                        <td style="padding: 8px;">Tests legibles con chaining</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>Builder</strong></td>
                        <td style="padding: 8px;">OrderBuilder</td>
                        <td style="padding: 8px;">Datos de prueba flexibles</td>
                    </tr>
                    <tr style="background: #e8eaf6;">
                        <td style="padding: 8px;"><strong>Fixtures</strong></td>
                        <td style="padding: 8px;">conftest.py</td>
                        <td style="padding: 8px;">Setup/teardown automático</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>Auth State</strong></td>
                        <td style="padding: 8px;">Session scope fixture</td>
                        <td style="padding: 8px;">Login una sola vez, tests rápidos</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip SIESA:</strong> Este framework es similar a lo que usamos en SIESA
            para automatizar los módulos del ERP. Cada módulo (Contabilidad, Nómina,
            Inventarios) tiene sus propios Page Objects y Builders, pero comparten la misma
            BasePage, los mismos Components (header, sidebar, tablas) y los mismos Helpers.
        </div>

        <h3>🎯 Ejercicio final</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Extiende el framework con:</p>
            <ol>
                <li><strong>AdminProductsPage:</strong> Page Object para el panel de admin
                que permita crear, editar y eliminar productos</li>
                <li><strong>ProductBuilder:</strong> Builder para generar datos de producto
                con nombre, precio, stock, categoría y descripción</li>
                <li>Escribe un test E2E que: Login como admin → Crear producto → Logout →
                Login como cliente → Buscar el producto → Agregarlo al carrito</li>
            </ol>
        </div>

        <h3>🎓 Sección 7 completada</h3>
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin: 15px 0; text-align: center;">
            <h3 style="color: white; margin-bottom: 10px;">🏆 ¡Felicitaciones!</h3>
            <p>Has completado la <strong>Sección 7: Page Object Model y Helpers</strong>.
            Ahora tienes las herramientas para construir frameworks de automatización
            profesionales, mantenibles y escalables.</p>
            <p style="font-size: 0.9em; margin-top: 10px;">
                <strong>Siguiente:</strong> Sección 8 — Auto-waiting y Actionability
            </p>
        </div>
    `,
    topics: ["proyecto", "framework", "pom"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 12,
    difficulty: "medium",
    type: "integration"
};

if (typeof window !== 'undefined') {
    window.LESSON_059 = LESSON_059;
}
