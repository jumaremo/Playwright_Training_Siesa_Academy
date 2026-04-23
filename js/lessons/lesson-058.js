/**
 * Playwright Academy - Lección 058
 * POM avanzado: Builder pattern y fluent API
 * Sección 7: Page Object Model y Helpers
 */

const LESSON_058 = {
    id: 58,
    title: "POM avanzado: Builder pattern y fluent API",
    duration: "7 min",
    level: "intermediate",
    section: "section-07",
    content: `
        <h2>🚀 POM avanzado: Builder pattern y fluent API</h2>
        <p>En esta lección exploramos dos patrones de diseño avanzados que hacen los Page Objects
        más expresivos y los tests más legibles: <strong>Fluent API</strong> (method chaining)
        y <strong>Builder Pattern</strong> para datos complejos.</p>

        <h3>⛓️ Fluent API — Method chaining</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Un <strong>Fluent API</strong> permite encadenar llamadas a métodos devolviendo
            <code>self</code> en cada acción. Esto crea un estilo de código que se lee como
            una narrativa:</p>
            <div class="code-tabs" data-code-id="L058-1">
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
                <pre><code class="language-python"># ❌ Sin fluent API — verboso
checkout = CheckoutPage(page)
checkout.navigate()
checkout.fill_name("Juan Reina")
checkout.fill_email("juan@siesa.com")
checkout.fill_address("Calle 5 #38-25")
checkout.fill_city("Cali")
checkout.select_payment("Tarjeta de crédito")
checkout.fill_card_number("4111111111111111")
checkout.accept_terms()
checkout.submit()

# ✅ Con fluent API — se lee como una historia
CheckoutPage(page) \\
    .navigate() \\
    .fill_name("Juan Reina") \\
    .fill_email("juan@siesa.com") \\
    .fill_address("Calle 5 #38-25") \\
    .fill_city("Cali") \\
    .select_payment("Tarjeta de crédito") \\
    .fill_card_number("4111111111111111") \\
    .accept_terms() \\
    .submit()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// ❌ Sin fluent API — verboso
const checkout = new CheckoutPage(page);
await checkout.navigate();
await checkout.fillName("Juan Reina");
await checkout.fillEmail("juan@siesa.com");
await checkout.fillAddress("Calle 5 #38-25");
await checkout.fillCity("Cali");
await checkout.selectPayment("Tarjeta de crédito");
await checkout.fillCardNumber("4111111111111111");
await checkout.acceptTerms();
await checkout.submit();

// ✅ Con fluent API — se lee como una historia
await new CheckoutPage(page)
    .navigate()
    .then(c => c.fillName("Juan Reina"))
    .then(c => c.fillEmail("juan@siesa.com"))
    .then(c => c.fillAddress("Calle 5 #38-25"))
    .then(c => c.fillCity("Cali"))
    .then(c => c.selectPayment("Tarjeta de crédito"))
    .then(c => c.fillCardNumber("4111111111111111"))
    .then(c => c.acceptTerms())
    .then(c => c.submit());</code></pre>
            </div>
        </div>
        </div>

        <h3>🔧 Implementando Fluent API en un Page Object</h3>
        <div class="code-tabs" data-code-id="L058-2">
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
                <pre><code class="language-python"># pages/checkout_page.py
from pages.base_page import BasePage

class CheckoutPage(BasePage):
    """Page Object con Fluent API para el checkout."""

    def __init__(self, page):
        super().__init__(page)
        self.url = "https://mi-app.com/checkout"

        # Locators
        self.name_input = page.locator("[data-testid='name']")
        self.email_input = page.locator("[data-testid='email']")
        self.address_input = page.locator("[data-testid='address']")
        self.city_input = page.locator("[data-testid='city']")
        self.payment_select = page.locator("[data-testid='payment-method']")
        self.card_input = page.locator("[data-testid='card-number']")
        self.terms_checkbox = page.locator("[data-testid='terms']")
        self.submit_button = page.locator("[data-testid='submit-order']")
        self.success_message = page.locator("[data-testid='order-success']")
        self.error_summary = page.locator("[data-testid='error-summary']")

    # ── Cada método retorna self para encadenar ──

    def fill_name(self, name):
        self.name_input.fill(name)
        return self  # ← Clave: retornar self

    def fill_email(self, email):
        self.email_input.fill(email)
        return self

    def fill_address(self, address):
        self.address_input.fill(address)
        return self

    def fill_city(self, city):
        self.city_input.fill(city)
        return self

    def select_payment(self, method):
        self.payment_select.select_option(label=method)
        return self

    def fill_card_number(self, number):
        self.card_input.fill(number)
        return self

    def accept_terms(self):
        self.terms_checkbox.check()
        return self

    def submit(self):
        self.submit_button.click()
        return self

    # ── Métodos de consulta (no encadenables) ──

    def get_success_text(self):
        return self.success_message.text_content()

    def is_success_visible(self):
        return self.success_message.is_visible()

    def get_errors(self):
        return self.error_summary.all_text_contents()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// pages/checkout-page.ts
import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base-page';

export class CheckoutPage extends BasePage {
    // Page Object con Fluent API para el checkout.

    readonly url = "https://mi-app.com/checkout";

    // Locators
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly addressInput: Locator;
    readonly cityInput: Locator;
    readonly paymentSelect: Locator;
    readonly cardInput: Locator;
    readonly termsCheckbox: Locator;
    readonly submitButton: Locator;
    readonly successMessage: Locator;
    readonly errorSummary: Locator;

    constructor(page: Page) {
        super(page);
        this.nameInput = page.locator("[data-testid='name']");
        this.emailInput = page.locator("[data-testid='email']");
        this.addressInput = page.locator("[data-testid='address']");
        this.cityInput = page.locator("[data-testid='city']");
        this.paymentSelect = page.locator("[data-testid='payment-method']");
        this.cardInput = page.locator("[data-testid='card-number']");
        this.termsCheckbox = page.locator("[data-testid='terms']");
        this.submitButton = page.locator("[data-testid='submit-order']");
        this.successMessage = page.locator("[data-testid='order-success']");
        this.errorSummary = page.locator("[data-testid='error-summary']");
    }

    // ── Cada método retorna this (como Promise) para encadenar ──

    async fillName(name: string): Promise&lt;this&gt; {
        await this.nameInput.fill(name);
        return this; // ← Clave: retornar this
    }

    async fillEmail(email: string): Promise&lt;this&gt; {
        await this.emailInput.fill(email);
        return this;
    }

    async fillAddress(address: string): Promise&lt;this&gt; {
        await this.addressInput.fill(address);
        return this;
    }

    async fillCity(city: string): Promise&lt;this&gt; {
        await this.cityInput.fill(city);
        return this;
    }

    async selectPayment(method: string): Promise&lt;this&gt; {
        await this.paymentSelect.selectOption({ label: method });
        return this;
    }

    async fillCardNumber(number: string): Promise&lt;this&gt; {
        await this.cardInput.fill(number);
        return this;
    }

    async acceptTerms(): Promise&lt;this&gt; {
        await this.termsCheckbox.check();
        return this;
    }

    async submit(): Promise&lt;this&gt; {
        await this.submitButton.click();
        return this;
    }

    // ── Métodos de consulta (no encadenables) ──

    async getSuccessText(): Promise&lt;string | null&gt; {
        return await this.successMessage.textContent();
    }

    async isSuccessVisible(): Promise&lt;boolean&gt; {
        return await this.successMessage.isVisible();
    }

    async getErrors(): Promise&lt;string[]&gt; {
        return await this.errorSummary.allTextContents();
    }
}</code></pre>
            </div>
        </div>

        <h3>🧪 Tests con Fluent API</h3>
        <div class="code-tabs" data-code-id="L058-3">
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
                <pre><code class="language-python"># test_checkout.py

def test_compra_completa(page):
    """Flujo completo de compra con method chaining."""
    checkout = CheckoutPage(page)
    checkout.navigate() \\
        .fill_name("María García") \\
        .fill_email("maria@ejemplo.com") \\
        .fill_address("Av. Colombia #45-12") \\
        .fill_city("Bogotá") \\
        .select_payment("Tarjeta de crédito") \\
        .fill_card_number("4111111111111111") \\
        .accept_terms() \\
        .submit()

    assert checkout.is_success_visible()

def test_checkout_sin_terminos(page):
    """Verificar error al no aceptar términos."""
    checkout = CheckoutPage(page)
    checkout.navigate() \\
        .fill_name("Test User") \\
        .fill_email("test@test.com") \\
        .fill_address("Calle 1 #1-1") \\
        .fill_city("Cali") \\
        .select_payment("PSE") \\
        .submit()  # Sin accept_terms()

    errors = checkout.get_errors()
    assert "términos" in " ".join(errors).lower()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// test_checkout.spec.ts
import { test, expect } from '@playwright/test';
import { CheckoutPage } from './pages/checkout-page';

test('compra completa', async ({ page }) => {
    // Flujo completo de compra con method chaining.
    const checkout = new CheckoutPage(page);
    await (await (await (await (await (await (await (await
        checkout.navigate())
        .fillName("María García"))
        .fillEmail("maria@ejemplo.com"))
        .fillAddress("Av. Colombia #45-12"))
        .fillCity("Bogotá"))
        .selectPayment("Tarjeta de crédito"))
        .fillCardNumber("4111111111111111"))
        .acceptTerms())
        .submit();

    expect(await checkout.isSuccessVisible()).toBeTruthy();
});

test('checkout sin términos', async ({ page }) => {
    // Verificar error al no aceptar términos.
    const checkout = new CheckoutPage(page);
    await (await (await (await (await (await
        checkout.navigate())
        .fillName("Test User"))
        .fillEmail("test@test.com"))
        .fillAddress("Calle 1 #1-1"))
        .fillCity("Cali"))
        .selectPayment("PSE"))
        .submit(); // Sin acceptTerms()

    const errors = await checkout.getErrors();
    expect(errors.join(" ").toLowerCase()).toContain("términos");
});</code></pre>
            </div>
        </div>

        <h3>🏗️ Builder Pattern — Para datos complejos</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>El <strong>Builder Pattern</strong> es perfecto cuando necesitas construir
            objetos de datos complejos con muchos campos opcionales:</p>
            <div class="code-tabs" data-code-id="L058-4">
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
                <pre><code class="language-python"># builders/user_builder.py
class UserBuilder:
    """Builder para construir datos de usuario paso a paso."""

    def __init__(self):
        self._data = {
            "nombre": "Test User",
            "email": f"test_\${id(self)}@test.com",
            "password": "Test@12345",
            "rol": "usuario",
            "activo": True,
            "telefono": "",
            "departamento": "",
            "cargo": "",
        }

    def with_name(self, nombre):
        self._data["nombre"] = nombre
        return self

    def with_email(self, email):
        self._data["email"] = email
        return self

    def with_role(self, rol):
        self._data["rol"] = rol
        return self

    def with_phone(self, telefono):
        self._data["telefono"] = telefono
        return self

    def with_department(self, departamento):
        self._data["departamento"] = departamento
        return self

    def with_position(self, cargo):
        self._data["cargo"] = cargo
        return self

    def inactive(self):
        self._data["activo"] = False
        return self

    def as_admin(self):
        """Shortcut: configurar como administrador."""
        self._data["rol"] = "admin"
        self._data["departamento"] = "IT"
        return self

    def as_siesa_employee(self, area):
        """Shortcut: empleado SIESA con datos realistas."""
        self._data["departamento"] = area
        self._data["email"] = f"test_\${area.lower()}@siesa.com"
        return self

    def build(self):
        """Retornar los datos construidos."""
        return dict(self._data)  # Copia para evitar mutación</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// builders/user-builder.ts

interface UserData {
    nombre: string;
    email: string;
    password: string;
    rol: string;
    activo: boolean;
    telefono: string;
    departamento: string;
    cargo: string;
}

export class UserBuilder {
    // Builder para construir datos de usuario paso a paso.

    private data: UserData;

    constructor() {
        this.data = {
            nombre: "Test User",
            email: \`test_\${Date.now()}@test.com\`,
            password: "Test@12345",
            rol: "usuario",
            activo: true,
            telefono: "",
            departamento: "",
            cargo: "",
        };
    }

    withName(nombre: string): this {
        this.data.nombre = nombre;
        return this;
    }

    withEmail(email: string): this {
        this.data.email = email;
        return this;
    }

    withRole(rol: string): this {
        this.data.rol = rol;
        return this;
    }

    withPhone(telefono: string): this {
        this.data.telefono = telefono;
        return this;
    }

    withDepartment(departamento: string): this {
        this.data.departamento = departamento;
        return this;
    }

    withPosition(cargo: string): this {
        this.data.cargo = cargo;
        return this;
    }

    inactive(): this {
        this.data.activo = false;
        return this;
    }

    asAdmin(): this {
        // Shortcut: configurar como administrador.
        this.data.rol = "admin";
        this.data.departamento = "IT";
        return this;
    }

    asSiesaEmployee(area: string): this {
        // Shortcut: empleado SIESA con datos realistas.
        this.data.departamento = area;
        this.data.email = \`test_\${area.toLowerCase()}@siesa.com\`;
        return this;
    }

    build(): UserData {
        // Retornar los datos construidos.
        return { ...this.data }; // Copia para evitar mutación
    }
}</code></pre>
            </div>
        </div>
        </div>

        <h3>🧪 Usando el Builder en tests</h3>
        <div class="code-tabs" data-code-id="L058-5">
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
                <pre><code class="language-python"># test_users.py
from builders.user_builder import UserBuilder

def test_crear_admin(users_page):
    """Crear un usuario administrador."""
    admin = UserBuilder() \\
        .with_name("Carlos Admin") \\
        .with_email("carlos.admin@test.com") \\
        .as_admin() \\
        .build()

    users_page.create_user(admin)
    assert users_page.is_user_visible("Carlos Admin")

def test_crear_usuario_basico(users_page):
    """Crear usuario con datos mínimos (Builder usa defaults)."""
    user = UserBuilder().build()  # Solo defaults
    users_page.create_user(user)
    assert users_page.is_user_visible(user["nombre"])

def test_crear_empleado_siesa(users_page):
    """Crear empleado con datos de SIESA."""
    empleado = UserBuilder() \\
        .with_name("José Bravo") \\
        .as_siesa_employee("QA") \\
        .with_position("QA Engineer") \\
        .with_phone("3001234567") \\
        .build()

    users_page.create_user(empleado)
    assert users_page.is_user_visible("José Bravo")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// test_users.spec.ts
import { test, expect } from '@playwright/test';
import { UserBuilder } from './builders/user-builder';

test('crear admin', async ({ page }) => {
    // Crear un usuario administrador.
    const admin = new UserBuilder()
        .withName("Carlos Admin")
        .withEmail("carlos.admin@test.com")
        .asAdmin()
        .build();

    await usersPage.createUser(admin);
    expect(await usersPage.isUserVisible("Carlos Admin")).toBeTruthy();
});

test('crear usuario básico', async ({ page }) => {
    // Crear usuario con datos mínimos (Builder usa defaults).
    const user = new UserBuilder().build(); // Solo defaults
    await usersPage.createUser(user);
    expect(await usersPage.isUserVisible(user.nombre)).toBeTruthy();
});

test('crear empleado SIESA', async ({ page }) => {
    // Crear empleado con datos de SIESA.
    const empleado = new UserBuilder()
        .withName("José Bravo")
        .asSiesaEmployee("QA")
        .withPosition("QA Engineer")
        .withPhone("3001234567")
        .build();

    await usersPage.createUser(empleado);
    expect(await usersPage.isUserVisible("José Bravo")).toBeTruthy();
});</code></pre>
            </div>
        </div>

        <h3>🔄 Combinando Fluent POM + Builder</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L058-6">
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
                <pre><code class="language-python"># pages/user_form_page.py
class UserFormPage(BasePage):
    """Formulario de usuario con Fluent API."""

    def __init__(self, page):
        super().__init__(page)
        self.name_input = page.locator("[name='nombre']")
        self.email_input = page.locator("[name='email']")
        self.role_select = page.locator("[name='rol']")
        self.dept_input = page.locator("[name='departamento']")
        self.save_button = page.locator("[data-testid='save']")

    def fill_from_builder(self, user_data):
        """Llenar el formulario desde datos del Builder."""
        self.name_input.fill(user_data["nombre"])
        self.email_input.fill(user_data["email"])
        self.role_select.select_option(label=user_data["rol"])
        if user_data.get("departamento"):
            self.dept_input.fill(user_data["departamento"])
        return self

    def save(self):
        self.save_button.click()
        return self

# ── En el test: Builder genera datos, POM fluent los usa ──
def test_crear_multiples_usuarios(user_form):
    roles = ["admin", "editor", "viewer"]
    for rol in roles:
        user = UserBuilder().with_role(rol).build()
        user_form.navigate() \\
            .fill_from_builder(user) \\
            .save()
        assert user_form.is_success_visible()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// pages/user-form-page.ts
import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base-page';

interface UserData {
    nombre: string;
    email: string;
    rol: string;
    departamento?: string;
}

export class UserFormPage extends BasePage {
    // Formulario de usuario con Fluent API.

    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly roleSelect: Locator;
    readonly deptInput: Locator;
    readonly saveButton: Locator;

    constructor(page: Page) {
        super(page);
        this.nameInput = page.locator("[name='nombre']");
        this.emailInput = page.locator("[name='email']");
        this.roleSelect = page.locator("[name='rol']");
        this.deptInput = page.locator("[name='departamento']");
        this.saveButton = page.locator("[data-testid='save']");
    }

    async fillFromBuilder(userData: UserData): Promise&lt;this&gt; {
        // Llenar el formulario desde datos del Builder.
        await this.nameInput.fill(userData.nombre);
        await this.emailInput.fill(userData.email);
        await this.roleSelect.selectOption({ label: userData.rol });
        if (userData.departamento) {
            await this.deptInput.fill(userData.departamento);
        }
        return this;
    }

    async save(): Promise&lt;this&gt; {
        await this.saveButton.click();
        return this;
    }
}

// ── En el test: Builder genera datos, POM fluent los usa ──
import { test, expect } from '@playwright/test';
import { UserBuilder } from './builders/user-builder';

test('crear múltiples usuarios', async ({ page }) => {
    const roles = ["admin", "editor", "viewer"];
    for (const rol of roles) {
        const user = new UserBuilder().withRole(rol).build();
        const form = await userForm.navigate();
        await (await form.fillFromBuilder(user)).save();
        expect(await userForm.isSuccessVisible()).toBeTruthy();
    }
});</code></pre>
            </div>
        </div>
        </div>

        <h3>🎯 Patrón avanzado: Page Object que retorna otro Page Object</h3>
        <div class="code-tabs" data-code-id="L058-7">
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
                <pre><code class="language-python"># Flujo completo con transiciones de página

class LoginPage(BasePage):
    # ...
    def login_successfully(self, email, password):
        """Login que retorna DashboardPage (transición)."""
        self.email_input.fill(email)
        self.password_input.fill(password)
        self.login_button.click()
        self.page.wait_for_url("**/dashboard")
        return DashboardPage(self.page)

class DashboardPage(BasePage):
    # ...
    def go_to_products(self):
        """Navegar a productos — retorna ProductsPage."""
        self.sidebar.click_item("Productos")
        return ProductsPage(self.page)

class ProductsPage(BasePage):
    # ...
    def add_new_product(self):
        """Abrir formulario — retorna ProductFormPage."""
        self.add_button.click()
        return ProductFormPage(self.page)

# ── Flujo E2E encadenado ──
def test_flujo_crear_producto(page):
    """Login → Dashboard → Productos → Crear producto."""
    product = UserBuilder() \\
        .with_name("Producto E2E") \\
        .build()

    dashboard = LoginPage(page) \\
        .navigate() \\
        .login_successfully("admin@test.com", "admin123")

    form = dashboard \\
        .go_to_products() \\
        .add_new_product()

    form.fill_from_builder(product) \\
        .save()

    assert form.is_success_visible()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Flujo completo con transiciones de página

class LoginPage extends BasePage {
    // ...
    async loginSuccessfully(email: string, password: string): Promise&lt;DashboardPage&gt; {
        // Login que retorna DashboardPage (transición).
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        await this.page.waitForURL("**/dashboard");
        return new DashboardPage(this.page);
    }
}

class DashboardPage extends BasePage {
    // ...
    async goToProducts(): Promise&lt;ProductsPage&gt; {
        // Navegar a productos — retorna ProductsPage.
        await this.sidebar.clickItem("Productos");
        return new ProductsPage(this.page);
    }
}

class ProductsPage extends BasePage {
    // ...
    async addNewProduct(): Promise&lt;ProductFormPage&gt; {
        // Abrir formulario — retorna ProductFormPage.
        await this.addButton.click();
        return new ProductFormPage(this.page);
    }
}

// ── Flujo E2E encadenado ──
test('flujo crear producto', async ({ page }) => {
    // Login → Dashboard → Productos → Crear producto.
    const product = new UserBuilder()
        .withName("Producto E2E")
        .build();

    const dashboard = await new LoginPage(page)
        .navigate()
        .then(lp => lp.loginSuccessfully("admin@test.com", "admin123"));

    const form = await dashboard
        .goToProducts()
        .then(pp => pp.addNewProduct());

    await (await form.fillFromBuilder(product)).save();

    expect(await form.isSuccessVisible()).toBeTruthy();
});</code></pre>
            </div>
        </div>

        <h3>⚠️ Cuándo NO usar estos patrones</h3>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #c62828; color: white;">
                        <th style="padding: 10px;">Patrón</th>
                        <th style="padding: 10px;">Usar cuando...</th>
                        <th style="padding: 10px;">Evitar cuando...</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #ffcdd2;">
                        <td style="padding: 8px;"><strong>Fluent API</strong></td>
                        <td style="padding: 8px;">Secuencias largas de acciones</td>
                        <td style="padding: 8px;">Acciones simples (1-2 pasos)</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>Builder</strong></td>
                        <td style="padding: 8px;">Objetos con muchos campos opcionales</td>
                        <td style="padding: 8px;">Datos simples (2-3 campos)</td>
                    </tr>
                    <tr style="background: #ffcdd2;">
                        <td style="padding: 8px;"><strong>Page transitions</strong></td>
                        <td style="padding: 8px;">Flujos E2E con navegación clara</td>
                        <td style="padding: 8px;">Páginas que no siempre redirigen</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip:</strong> El Builder Pattern brilla cuando tienes muchas variantes
            de datos de prueba. En vez de crear 10 diccionarios diferentes, creas 10
            combinaciones diferentes del builder.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Implementa un sistema completo:</p>
            <ol>
                <li><strong>OrderBuilder:</strong> para crear datos de pedido con items,
                dirección, método de pago, cupón de descuento</li>
                <li><strong>CheckoutPage fluent:</strong> que use <code>fill_from_order()</code>
                para llenar todo desde el builder</li>
                <li>Escribe 3 tests diferentes que construyan pedidos con combinaciones
                distintas del builder</li>
            </ol>
        </div>
    `,
    topics: ["builder-pattern", "fluent-api", "avanzado"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_058 = LESSON_058;
}
