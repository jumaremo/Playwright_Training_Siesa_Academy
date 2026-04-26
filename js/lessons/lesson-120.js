/**
 * Playwright Academy - Leccion 120
 * Patrones de test: AAA, Builder, Factory
 * Seccion 18: Arquitecturas y Patrones Enterprise
 */

const LESSON_120 = {
    id: 120,
    title: "Patrones de test: AAA, Builder, Factory",
    duration: "7 min",
    level: "advanced",
    section: "section-18",
    content: `
        <h2>Patrones de test: AAA, Builder, Factory</h2>
        <p>Escribir tests es facil; escribir tests <strong>mantenibles y legibles</strong> es un arte.
        Los patrones de diseño aplicados al testing te proporcionan una estructura predecible que
        cualquier miembro del equipo puede entender y seguir. En esta leccion exploraras los patrones
        mas utilizados en testing con Playwright: <strong>AAA</strong> (Arrange-Act-Assert),
        <strong>Builder</strong> para datos complejos, y <strong>Factory</strong> para Page Objects.</p>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>En SIESA adoptamos el patron AAA como estandar obligatorio para todos los tests E2E.
            Esto facilita enormemente el code review: cualquier QA puede leer un test y entender
            inmediatamente que se esta configurando, que accion se realiza y que resultado se espera.
            Ademas, usamos el patron Builder para configurar datos complejos de nomina y contabilidad.</p>
        </div>

        <h3>Patron AAA: Arrange - Act - Assert</h3>
        <p>El patron mas fundamental y universalmente aplicable. Divide cada test en tres secciones
        claramente diferenciadas:</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Fase</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Proposito</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Arrange</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Preparar el estado inicial, datos y contexto</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Navegar, login, crear datos de prueba</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Act</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Ejecutar la accion que se esta probando</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Click en boton, enviar formulario</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Assert</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Verificar el resultado esperado</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Verificar mensaje, URL, estado</td>
                </tr>
            </table>
        </div>

        <div class="code-tabs" data-code-id="L120-1">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python">from playwright.sync_api import expect

def test_add_product_to_cart(page):
    """Verifica que un producto se puede agregar al carrito."""

    # ---- ARRANGE: Preparar estado inicial ----
    page.goto("/products")
    page.locator("[data-testid='product-card']").first.click()
    page.wait_for_url("**/products/*")

    # ---- ACT: Ejecutar la accion bajo prueba ----
    page.click("[data-testid='add-to-cart-btn']")

    # ---- ASSERT: Verificar resultado esperado ----
    expect(page.locator("[data-testid='cart-badge']")).to_have_text("1")
    expect(page.locator(".toast-success")).to_be_visible()
    expect(page.locator(".toast-success")).to_have_text("Producto agregado al carrito")


def test_login_with_invalid_credentials(page):
    """Verifica que el login falla con credenciales incorrectas."""

    # ---- ARRANGE ----
    page.goto("/auth/login")
    login_form = page.locator("[data-testid='login-form']")
    expect(login_form).to_be_visible()

    # ---- ACT ----
    page.fill("[data-testid='email-input']", "invalid@test.com")
    page.fill("[data-testid='password-input']", "wrongpassword")
    page.click("[data-testid='submit-btn']")

    # ---- ASSERT ----
    expect(page.locator("[data-testid='error-alert']")).to_be_visible()
    expect(page.locator("[data-testid='error-alert']")).to_contain_text("Credenciales invalidas")
    expect(page).to_have_url("**/auth/login")  # No redirecciona</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('add product to cart', async ({ page }) => {
    // Verifica que un producto se puede agregar al carrito

    // ---- ARRANGE: Preparar estado inicial ----
    await page.goto('/products');
    await page.locator('[data-testid="product-card"]').first().click();
    await page.waitForURL('**/products/*');

    // ---- ACT: Ejecutar la accion bajo prueba ----
    await page.click('[data-testid="add-to-cart-btn"]');

    // ---- ASSERT: Verificar resultado esperado ----
    await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('1');
    await expect(page.locator('.toast-success')).toBeVisible();
    await expect(page.locator('.toast-success')).toHaveText('Producto agregado al carrito');
});

test('login with invalid credentials', async ({ page }) => {
    // Verifica que el login falla con credenciales incorrectas

    // ---- ARRANGE ----
    await page.goto('/auth/login');
    const loginForm = page.locator('[data-testid="login-form"]');
    await expect(loginForm).toBeVisible();

    // ---- ACT ----
    await page.fill('[data-testid="email-input"]', 'invalid@test.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    await page.click('[data-testid="submit-btn"]');

    // ---- ASSERT ----
    await expect(page.locator('[data-testid="error-alert"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-alert"]')).toContainText('Credenciales invalidas');
    await expect(page).toHaveURL('**/auth/login'); // No redirecciona
});</code></pre>
</div>
</div>

        <div style="background: #fce4ec; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Anti-patron: Tests sin estructura clara</h4>
            <div class="code-tabs" data-code-id="L120-2">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># MAL: Las fases estan mezcladas, dificil de entender
def test_confusing(page):
    page.goto("/products")
    assert page.title() != ""          # Assert mezclado con arrange
    page.click(".product")
    page.click("#add-cart")
    expect(page.locator(".badge")).to_have_text("1")
    page.click("#checkout")             # Segunda accion, deberia ser otro test
    page.fill("#name", "Juan")
    expect(page.locator("#total")).to_be_visible()  # Assert de otro flujo</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// MAL: Las fases estan mezcladas, dificil de entender
test('confusing', async ({ page }) => {
    await page.goto('/products');
    expect(await page.title()).not.toBe('');  // Assert mezclado con arrange
    await page.click('.product');
    await page.click('#add-cart');
    await expect(page.locator('.badge')).toHaveText('1');
    await page.click('#checkout');             // Segunda accion, deberia ser otro test
    await page.fill('#name', 'Juan');
    await expect(page.locator('#total')).toBeVisible(); // Assert de otro flujo
});</code></pre>
</div>
</div>
        </div>

        <h3>Patron Builder: Construccion de datos complejos</h3>
        <p>Cuando los datos de prueba tienen muchos campos, el patron Builder permite
        construirlos de forma fluida y legible, usando solo los valores relevantes para cada test:</p>

        <div class="code-tabs" data-code-id="L120-3">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># builders/user_builder.py
from dataclasses import dataclass, field
from typing import Optional
import random
import string

@dataclass
class User:
    email: str = ""
    password: str = ""
    first_name: str = ""
    last_name: str = ""
    role: str = "user"
    company: str = ""
    phone: str = ""
    is_active: bool = True

class UserBuilder:
    """Builder para crear usuarios de prueba con datos flexibles."""

    def __init__(self):
        uid = ''.join(random.choices(string.ascii_lowercase, k=6))
        self._user = User(
            email=f"test_{uid}@example.com",
            password="Test1234!",
            first_name="Test",
            last_name="User",
            role="user",
            company="SIESA",
            phone="+57 300 1234567",
            is_active=True
        )

    def with_email(self, email: str) -> "UserBuilder":
        self._user.email = email
        return self

    def with_name(self, first: str, last: str) -> "UserBuilder":
        self._user.first_name = first
        self._user.last_name = last
        return self

    def with_role(self, role: str) -> "UserBuilder":
        self._user.role = role
        return self

    def as_admin(self) -> "UserBuilder":
        self._user.role = "admin"
        return self

    def inactive(self) -> "UserBuilder":
        self._user.is_active = False
        return self

    def with_company(self, company: str) -> "UserBuilder":
        self._user.company = company
        return self

    def build(self) -> User:
        return self._user</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// builders/user-builder.ts

interface User {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    company: string;
    phone: string;
    isActive: boolean;
}

class UserBuilder {
    /** Builder para crear usuarios de prueba con datos flexibles. */
    private user: User;

    constructor() {
        const uid = Math.random().toString(36).substring(2, 8);
        this.user = {
            email: \`test_\${uid}@example.com\`,
            password: 'Test1234!',
            firstName: 'Test',
            lastName: 'User',
            role: 'user',
            company: 'SIESA',
            phone: '+57 300 1234567',
            isActive: true,
        };
    }

    withEmail(email: string): UserBuilder {
        this.user.email = email;
        return this;
    }

    withName(first: string, last: string): UserBuilder {
        this.user.firstName = first;
        this.user.lastName = last;
        return this;
    }

    withRole(role: string): UserBuilder {
        this.user.role = role;
        return this;
    }

    asAdmin(): UserBuilder {
        this.user.role = 'admin';
        return this;
    }

    inactive(): UserBuilder {
        this.user.isActive = false;
        return this;
    }

    withCompany(company: string): UserBuilder {
        this.user.company = company;
        return this;
    }

    build(): User {
        return { ...this.user };
    }
}</code></pre>
</div>
</div>

        <div class="code-tabs" data-code-id="L120-4">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># Uso en tests: solo se especifican los campos relevantes

def test_admin_can_access_settings(page, create_user_via_api):
    """Solo importa el rol admin — el builder llena el resto."""
    # ARRANGE
    admin = UserBuilder().as_admin().with_name("Carlos", "Diaz").build()
    create_user_via_api(admin)
    login(page, admin.email, admin.password)

    # ACT
    page.goto("/settings/admin")

    # ASSERT
    expect(page.locator("[data-testid='admin-panel']")).to_be_visible()


def test_inactive_user_cannot_login(page, create_user_via_api):
    """Solo importa que el usuario este inactivo."""
    # ARRANGE
    user = UserBuilder().inactive().build()
    create_user_via_api(user)

    # ACT
    page.goto("/auth/login")
    page.fill("#email", user.email)
    page.fill("#password", user.password)
    page.click("#login-btn")

    # ASSERT
    expect(page.locator(".error")).to_have_text("Cuenta desactivada")</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// Uso en tests: solo se especifican los campos relevantes
import { test, expect } from '@playwright/test';
import { UserBuilder } from './builders/user-builder';
import { createUserViaApi, login } from './helpers';

test('admin can access settings', async ({ page }) => {
    // Solo importa el rol admin — el builder llena el resto
    // ARRANGE
    const admin = new UserBuilder().asAdmin().withName('Carlos', 'Diaz').build();
    await createUserViaApi(admin);
    await login(page, admin.email, admin.password);

    // ACT
    await page.goto('/settings/admin');

    // ASSERT
    await expect(page.locator('[data-testid="admin-panel"]')).toBeVisible();
});

test('inactive user cannot login', async ({ page }) => {
    // Solo importa que el usuario este inactivo
    // ARRANGE
    const user = new UserBuilder().inactive().build();
    await createUserViaApi(user);

    // ACT
    await page.goto('/auth/login');
    await page.fill('#email', user.email);
    await page.fill('#password', user.password);
    await page.click('#login-btn');

    // ASSERT
    await expect(page.locator('.error')).toHaveText('Cuenta desactivada');
});</code></pre>
</div>
</div>

        <h3>Patron Factory: Creacion de Page Objects</h3>
        <p>El patron Factory centraliza la creacion de Page Objects, permitiendo
        instanciarlos con configuraciones predefinidas:</p>

        <div class="code-tabs" data-code-id="L120-5">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># factories/page_factory.py
from pages.auth.login_page import LoginPage
from pages.dashboard.dashboard_page import DashboardPage
from pages.inventory.products_page import ProductsPage
from pages.inventory.product_detail_page import ProductDetailPage

class PageFactory:
    """Factory centralizada para crear Page Objects."""

    def __init__(self, page):
        self.page = page

    def login_page(self) -> LoginPage:
        return LoginPage(self.page)

    def dashboard(self) -> DashboardPage:
        return DashboardPage(self.page)

    def products(self) -> ProductsPage:
        return ProductsPage(self.page)

    def product_detail(self, product_id: str) -> ProductDetailPage:
        return ProductDetailPage(self.page, product_id)

    def navigate_to_login(self) -> LoginPage:
        """Navegar y retornar LoginPage."""
        lp = LoginPage(self.page)
        lp.navigate()
        return lp

    def login_as(self, username: str, password: str) -> DashboardPage:
        """Login completo y retornar DashboardPage."""
        lp = self.navigate_to_login()
        return lp.login_and_wait(username, password)</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// factories/page-factory.ts
import { type Page } from '@playwright/test';
import { LoginPage } from '../pages/auth/login-page';
import { DashboardPage } from '../pages/dashboard/dashboard-page';
import { ProductsPage } from '../pages/inventory/products-page';
import { ProductDetailPage } from '../pages/inventory/product-detail-page';

export class PageFactory {
    /** Factory centralizada para crear Page Objects. */

    constructor(private readonly page: Page) {}

    loginPage(): LoginPage {
        return new LoginPage(this.page);
    }

    dashboard(): DashboardPage {
        return new DashboardPage(this.page);
    }

    products(): ProductsPage {
        return new ProductsPage(this.page);
    }

    productDetail(productId: string): ProductDetailPage {
        return new ProductDetailPage(this.page, productId);
    }

    async navigateToLogin(): Promise&lt;LoginPage&gt; {
        /** Navegar y retornar LoginPage. */
        const lp = new LoginPage(this.page);
        await lp.navigate();
        return lp;
    }

    async loginAs(username: string, password: string): Promise&lt;DashboardPage&gt; {
        /** Login completo y retornar DashboardPage. */
        const lp = await this.navigateToLogin();
        return lp.loginAndWait(username, password);
    }
}</code></pre>
</div>
</div>

        <div class="code-tabs" data-code-id="L120-6">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># Fixture para inyectar la factory
import pytest
from factories.page_factory import PageFactory

@pytest.fixture
def pages(page) -> PageFactory:
    """Factory de Page Objects inyectable en tests."""
    return PageFactory(page)

# Uso en tests
def test_dashboard_shows_widgets(pages):
    # ARRANGE
    dashboard = pages.login_as("admin@siesa.com", "Test1234!")

    # ACT
    widgets = dashboard.get_widget_count()

    # ASSERT
    assert widgets >= 4

def test_product_search(pages):
    # ARRANGE
    pages.login_as("admin@siesa.com", "Test1234!")
    products = pages.products()
    products.navigate()

    # ACT
    products.search("Laptop")

    # ASSERT
    assert products.result_count() > 0</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// Fixture para inyectar la factory
import { test as base, expect } from '@playwright/test';
import { PageFactory } from './factories/page-factory';

// Extender test con fixture personalizada
const test = base.extend&lt;{ pages: PageFactory }&gt;({
    pages: async ({ page }, use) => {
        /** Factory de Page Objects inyectable en tests. */
        await use(new PageFactory(page));
    },
});

// Uso en tests
test('dashboard shows widgets', async ({ pages }) => {
    // ARRANGE
    const dashboard = await pages.loginAs('admin@siesa.com', 'Test1234!');

    // ACT
    const widgets = await dashboard.getWidgetCount();

    // ASSERT
    expect(widgets).toBeGreaterThanOrEqual(4);
});

test('product search', async ({ pages }) => {
    // ARRANGE
    await pages.loginAs('admin@siesa.com', 'Test1234!');
    const products = pages.products();
    await products.navigate();

    // ACT
    await products.search('Laptop');

    // ASSERT
    expect(await products.resultCount()).toBeGreaterThan(0);
});</code></pre>
</div>
</div>

        <h3>Patron Decorator: Mejoras transversales</h3>
        <p>Los decoradores añaden funcionalidad a tests sin modificar su codigo:</p>

        <div class="code-tabs" data-code-id="L120-7">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># utils/decorators.py
import functools
import time
import logging

logger = logging.getLogger(__name__)

def log_test(func):
    """Decorator que registra inicio, fin y duracion del test."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        logger.info(f"INICIO: {func.__name__}")
        start = time.time()
        try:
            result = func(*args, **kwargs)
            duration = time.time() - start
            logger.info(f"FIN OK: {func.__name__} ({duration:.2f}s)")
            return result
        except Exception as e:
            duration = time.time() - start
            logger.error(f"FIN FAIL: {func.__name__} ({duration:.2f}s) - {e}")
            raise
    return wrapper

def require_role(role: str):
    """Decorator que documenta el rol requerido para el test."""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            return func(*args, **kwargs)
        wrapper._required_role = role
        return wrapper
    return decorator

# Uso:
@log_test
@require_role("admin")
def test_admin_settings(pages):
    dashboard = pages.login_as("admin@siesa.com", "Test1234!")
    # ...</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// utils/test-helpers.ts
// En Playwright Test no hay decoradores nativos, pero se puede lograr
// un patron equivalente con fixtures y hooks personalizados.

import { test as base } from '@playwright/test';

// Helper que envuelve un test con logging de duracion
function logTest(
    title: string,
    fn: Parameters&lt;typeof base&gt;[1]
): Parameters&lt;typeof base&gt;[1] {
    return async (args, testInfo) => {
        console.log(\`INICIO: \${title}\`);
        const start = Date.now();
        try {
            await fn(args, testInfo);
            const duration = ((Date.now() - start) / 1000).toFixed(2);
            console.log(\`FIN OK: \${title} (\${duration}s)\`);
        } catch (error) {
            const duration = ((Date.now() - start) / 1000).toFixed(2);
            console.error(\`FIN FAIL: \${title} (\${duration}s) - \${error}\`);
            throw error;
        }
    };
}

// Fixture que documenta el rol requerido via tag
const test = base.extend&lt;{ requiredRole: string }&gt;({
    requiredRole: ['user', { option: true }],
});

// Uso:
test('admin settings', { tag: '@admin' },
    logTest('admin settings', async ({ pages }) => {
        const dashboard = await pages.loginAs('admin@siesa.com', 'Test1234!');
        // ...
    })
);</code></pre>
</div>
</div>

        <h3>Comparativa de patrones</h3>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Patron</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Cuando usarlo</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Beneficio principal</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>AAA</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Siempre (estructura basica de todo test)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Legibilidad y consistencia</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Builder</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Datos con 5+ campos, variaciones frecuentes</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Datos claros, solo lo relevante</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Factory</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Multiples Page Objects, creacion recurrente</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Centralizar instanciacion</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Decorator</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Logging, retry, permisos transversales</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Separacion de concerns</td>
                </tr>
            </table>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Ejercicio Practico</h4>
            <p>Refactoriza una suite de tests aplicando los patrones aprendidos:</p>
            <ol>
                <li>Reescribe 3 tests usando el patron AAA con comentarios de seccion claros</li>
                <li>Crea un <code>UserBuilder</code> con al menos 5 metodos fluidos</li>
                <li>Crea un <code>OrderBuilder</code> para pedidos con productos, cantidades y descuentos</li>
                <li>Implementa un <code>PageFactory</code> con 3 Page Objects y metodo de login</li>
                <li>Crea un decorador <code>@log_test</code> que registre duracion y resultado</li>
            </ol>
        </div>

        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>En la siguiente leccion</strong> exploraras el
            <strong>testing de microservicios y APIs distribuidas</strong>, aprendiendo a usar
            Playwright para validar sistemas compuestos por multiples servicios interconectados.</p>
        </div>
    `,
    topics: ["patrones", "aaa", "builder", "factory"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_120 = LESSON_120;
}
