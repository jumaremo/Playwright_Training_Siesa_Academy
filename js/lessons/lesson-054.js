/**
 * Playwright Academy - Lección 054
 * Implementación POM con Playwright
 * Sección 7: Page Object Model y Helpers
 */

const LESSON_054 = {
    id: 54,
    title: "Implementación POM con Playwright",
    duration: "7 min",
    level: "intermediate",
    section: "section-07",
    content: `
        <h2>🔧 Implementación POM con Playwright</h2>
        <p>En esta lección implementaremos un sistema POM completo paso a paso,
        empezando por una <strong>clase base</strong> que todos los Page Objects heredarán,
        seguido de Page Objects concretos y la integración con pytest.</p>

        <h3>🏛️ BasePage — La clase base</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>La clase base define métodos comunes que todos los Page Objects necesitan:
            navegación, esperas, screenshots, etc.</p>
            <div class="code-tabs" data-code-id="L054-1">
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
class BasePage:
    """Clase base para todos los Page Objects.

    Centraliza funcionalidad común: navegación, esperas,
    screenshots, y métodos utilitarios.
    """

    def __init__(self, page):
        self.page = page
        self.url = ""  # Cada subclase define su URL

    # ── Navegación ──
    def navigate(self):
        """Navegar a la URL de esta página."""
        if self.url:
            self.page.goto(self.url)
        return self

    def get_current_url(self):
        """Obtener la URL actual."""
        return self.page.url

    def get_title(self):
        """Obtener el título de la página."""
        return self.page.title()

    # ── Esperas ──
    def wait_for_load(self):
        """Esperar a que la página termine de cargar."""
        self.page.wait_for_load_state("networkidle")
        return self

    def wait_for_element(self, selector, timeout=5000):
        """Esperar a que un elemento sea visible."""
        self.page.locator(selector).wait_for(
            state="visible", timeout=timeout
        )
        return self

    # ── Screenshots ──
    def take_screenshot(self, name="screenshot"):
        """Tomar screenshot de la página actual."""
        self.page.screenshot(path=f"screenshots/{name}.png")
        return self

    # ── Utilidades ──
    def reload(self):
        """Recargar la página actual."""
        self.page.reload()
        self.wait_for_load()
        return self

    def go_back(self):
        """Volver a la página anterior."""
        self.page.go_back()
        return self</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// pages/base-page.ts
import { type Page } from '@playwright/test';

export class BasePage {
    // Clase base para todos los Page Objects.
    // Centraliza funcionalidad común: navegación, esperas,
    // screenshots, y métodos utilitarios.

    protected page: Page;
    protected url: string = ''; // Cada subclase define su URL

    constructor(page: Page) {
        this.page = page;
    }

    // ── Navegación ──
    async navigate(): Promise&lt;this&gt; {
        // Navegar a la URL de esta página.
        if (this.url) {
            await this.page.goto(this.url);
        }
        return this;
    }

    getCurrentUrl(): string {
        // Obtener la URL actual.
        return this.page.url();
    }

    async getTitle(): Promise&lt;string&gt; {
        // Obtener el título de la página.
        return await this.page.title();
    }

    // ── Esperas ──
    async waitForLoad(): Promise&lt;this&gt; {
        // Esperar a que la página termine de cargar.
        await this.page.waitForLoadState('networkidle');
        return this;
    }

    async waitForElement(selector: string, timeout = 5000): Promise&lt;this&gt; {
        // Esperar a que un elemento sea visible.
        await this.page.locator(selector).waitFor({
            state: 'visible', timeout
        });
        return this;
    }

    // ── Screenshots ──
    async takeScreenshot(name = 'screenshot'): Promise&lt;this&gt; {
        // Tomar screenshot de la página actual.
        await this.page.screenshot({ path: \`screenshots/\${name}.png\` });
        return this;
    }

    // ── Utilidades ──
    async reload(): Promise&lt;this&gt; {
        // Recargar la página actual.
        await this.page.reload();
        await this.waitForLoad();
        return this;
    }

    async goBack(): Promise&lt;this&gt; {
        // Volver a la página anterior.
        await this.page.goBack();
        return this;
    }
}</code></pre>
            </div>
        </div>
        </div>

        <h3>📄 LoginPage — Page Object concreto</h3>
        <div class="code-tabs" data-code-id="L054-2">
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
    """Page Object para la página de inicio de sesión."""

    def __init__(self, page):
        super().__init__(page)
        self.url = "https://mi-app.com/login"

        # ── Locators ──
        self.email_input = page.locator("[data-testid='email']")
        self.password_input = page.locator("[data-testid='password']")
        self.login_button = page.locator("[data-testid='login-btn']")
        self.error_message = page.locator("[data-testid='error-msg']")
        self.remember_checkbox = page.locator("#remember-me")
        self.forgot_password_link = page.locator("a:has-text('¿Olvidaste tu contraseña?')")

    # ── Acciones ──
    def login(self, email, password, remember=False):
        """Iniciar sesión con credenciales."""
        self.email_input.fill(email)
        self.password_input.fill(password)
        if remember:
            self.remember_checkbox.check()
        self.login_button.click()
        return self

    def login_as_admin(self):
        """Atajo para login como administrador."""
        return self.login("admin@empresa.com", "admin123")

    def login_as_user(self):
        """Atajo para login como usuario estándar."""
        return self.login("user@empresa.com", "user123")

    def click_forgot_password(self):
        """Hacer clic en '¿Olvidaste tu contraseña?'."""
        self.forgot_password_link.click()
        return self

    # ── Queries ──
    def get_error_text(self):
        """Obtener el texto del mensaje de error."""
        return self.error_message.text_content()

    def is_error_visible(self):
        """Verificar si hay un mensaje de error visible."""
        return self.error_message.is_visible()

    def is_login_button_enabled(self):
        """Verificar si el botón de login está habilitado."""
        return self.login_button.is_enabled()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// pages/login-page.ts
import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base-page';

export class LoginPage extends BasePage {
    // Page Object para la página de inicio de sesión.

    // ── Locators ──
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly errorMessage: Locator;
    private readonly rememberCheckbox: Locator;
    private readonly forgotPasswordLink: Locator;

    constructor(page: Page) {
        super(page);
        this.url = 'https://mi-app.com/login';

        this.emailInput = page.locator("[data-testid='email']");
        this.passwordInput = page.locator("[data-testid='password']");
        this.loginButton = page.locator("[data-testid='login-btn']");
        this.errorMessage = page.locator("[data-testid='error-msg']");
        this.rememberCheckbox = page.locator('#remember-me');
        this.forgotPasswordLink = page.locator("a:has-text('¿Olvidaste tu contraseña?')");
    }

    // ── Acciones ──
    async login(email: string, password: string, remember = false): Promise&lt;this&gt; {
        // Iniciar sesión con credenciales.
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        if (remember) {
            await this.rememberCheckbox.check();
        }
        await this.loginButton.click();
        return this;
    }

    async loginAsAdmin(): Promise&lt;this&gt; {
        // Atajo para login como administrador.
        return this.login('admin@empresa.com', 'admin123');
    }

    async loginAsUser(): Promise&lt;this&gt; {
        // Atajo para login como usuario estándar.
        return this.login('user@empresa.com', 'user123');
    }

    async clickForgotPassword(): Promise&lt;this&gt; {
        // Hacer clic en '¿Olvidaste tu contraseña?'.
        await this.forgotPasswordLink.click();
        return this;
    }

    // ── Queries ──
    async getErrorText(): Promise&lt;string | null&gt; {
        // Obtener el texto del mensaje de error.
        return await this.errorMessage.textContent();
    }

    async isErrorVisible(): Promise&lt;boolean&gt; {
        // Verificar si hay un mensaje de error visible.
        return await this.errorMessage.isVisible();
    }

    async isLoginButtonEnabled(): Promise&lt;boolean&gt; {
        // Verificar si el botón de login está habilitado.
        return await this.loginButton.isEnabled();
    }
}</code></pre>
            </div>
        </div>

        <h3>📄 DashboardPage — Otra página</h3>
        <div class="code-tabs" data-code-id="L054-3">
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
                <pre><code class="language-python"># pages/dashboard_page.py
from pages.base_page import BasePage

class DashboardPage(BasePage):
    """Page Object para el dashboard principal."""

    def __init__(self, page):
        super().__init__(page)
        self.url = "https://mi-app.com/dashboard"

        # ── Locators ──
        self.welcome_text = page.locator("[data-testid='welcome']")
        self.user_menu = page.locator("[data-testid='user-menu']")
        self.logout_button = page.locator("[data-testid='logout']")
        self.sidebar_items = page.locator(".sidebar-item")
        self.notifications_bell = page.locator("[data-testid='notifications']")
        self.notification_count = page.locator(".notification-badge")

    # ── Acciones ──
    def logout(self):
        """Cerrar sesión."""
        self.user_menu.click()
        self.logout_button.click()
        return self

    def navigate_to_section(self, section_name):
        """Navegar a una sección del sidebar."""
        self.sidebar_items.filter(has_text=section_name).click()
        self.wait_for_load()
        return self

    def open_notifications(self):
        """Abrir el panel de notificaciones."""
        self.notifications_bell.click()
        return self

    # ── Queries ──
    def get_welcome_text(self):
        """Obtener el texto de bienvenida."""
        return self.welcome_text.text_content()

    def get_notification_count(self):
        """Obtener cantidad de notificaciones no leídas."""
        if self.notification_count.is_visible():
            return int(self.notification_count.text_content())
        return 0

    def get_sidebar_sections(self):
        """Obtener lista de secciones del sidebar."""
        return self.sidebar_items.all_text_contents()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// pages/dashboard-page.ts
import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base-page';

export class DashboardPage extends BasePage {
    // Page Object para el dashboard principal.

    // ── Locators ──
    private readonly welcomeText: Locator;
    private readonly userMenu: Locator;
    private readonly logoutButton: Locator;
    private readonly sidebarItems: Locator;
    private readonly notificationsBell: Locator;
    private readonly notificationCount: Locator;

    constructor(page: Page) {
        super(page);
        this.url = 'https://mi-app.com/dashboard';

        this.welcomeText = page.locator("[data-testid='welcome']");
        this.userMenu = page.locator("[data-testid='user-menu']");
        this.logoutButton = page.locator("[data-testid='logout']");
        this.sidebarItems = page.locator('.sidebar-item');
        this.notificationsBell = page.locator("[data-testid='notifications']");
        this.notificationCount = page.locator('.notification-badge');
    }

    // ── Acciones ──
    async logout(): Promise&lt;this&gt; {
        // Cerrar sesión.
        await this.userMenu.click();
        await this.logoutButton.click();
        return this;
    }

    async navigateToSection(sectionName: string): Promise&lt;this&gt; {
        // Navegar a una sección del sidebar.
        await this.sidebarItems.filter({ hasText: sectionName }).click();
        await this.waitForLoad();
        return this;
    }

    async openNotifications(): Promise&lt;this&gt; {
        // Abrir el panel de notificaciones.
        await this.notificationsBell.click();
        return this;
    }

    // ── Queries ──
    async getWelcomeText(): Promise&lt;string | null&gt; {
        // Obtener el texto de bienvenida.
        return await this.welcomeText.textContent();
    }

    async getNotificationCount(): Promise&lt;number&gt; {
        // Obtener cantidad de notificaciones no leídas.
        if (await this.notificationCount.isVisible()) {
            const text = await this.notificationCount.textContent();
            return parseInt(text || '0', 10);
        }
        return 0;
    }

    async getSidebarSections(): Promise&lt;string[]&gt; {
        // Obtener lista de secciones del sidebar.
        return await this.sidebarItems.allTextContents();
    }
}</code></pre>
            </div>
        </div>

        <h3>⚙️ Integración con conftest.py y fixtures</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L054-4">
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
                <pre><code class="language-python"># conftest.py
import pytest
from playwright.sync_api import sync_playwright
from pages.login_page import LoginPage
from pages.dashboard_page import DashboardPage

@pytest.fixture(scope="function")
def browser():
    """Fixture que provee un browser Playwright."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        yield browser
        browser.close()

@pytest.fixture(scope="function")
def page(browser):
    """Fixture que provee una página nueva."""
    context = browser.new_context()
    page = context.new_page()
    yield page
    context.close()

@pytest.fixture
def login_page(page):
    """Fixture que provee LoginPage ya navegada."""
    lp = LoginPage(page)
    lp.navigate()
    return lp

@pytest.fixture
def dashboard_page(page):
    """Fixture que provee DashboardPage (requiere login previo)."""
    # Primero hacer login
    login = LoginPage(page)
    login.navigate()
    login.login_as_user()
    # Luego crear dashboard page
    return DashboardPage(page)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// fixtures.ts
import { test as base, type Page } from '@playwright/test';
import { LoginPage } from './pages/login-page';
import { DashboardPage } from './pages/dashboard-page';

// Definir tipos de fixtures personalizados
type MyFixtures = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
};

// Extender test con fixtures personalizados
export const test = base.extend&lt;MyFixtures&gt;({
    // Fixture que provee LoginPage ya navegada
    loginPage: async ({ page }, use) => {
        const lp = new LoginPage(page);
        await lp.navigate();
        await use(lp);
    },

    // Fixture que provee DashboardPage (requiere login previo)
    dashboardPage: async ({ page }, use) => {
        // Primero hacer login
        const login = new LoginPage(page);
        await login.navigate();
        await login.loginAsUser();
        // Luego crear dashboard page
        const dashboard = new DashboardPage(page);
        await use(dashboard);
    },
});

export { expect } from '@playwright/test';</code></pre>
            </div>
        </div>
        </div>

        <h3>🧪 Tests completos usando POM + Fixtures</h3>
        <div class="code-tabs" data-code-id="L054-5">
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
                <pre><code class="language-python"># test_login.py
from pages.login_page import LoginPage
from pages.dashboard_page import DashboardPage

def test_login_exitoso(login_page):
    """Verificar login con credenciales válidas."""
    login_page.login_as_user()
    dashboard = DashboardPage(login_page.page)
    assert "Bienvenido" in dashboard.get_welcome_text()

def test_login_email_invalido(login_page):
    """Verificar mensaje de error con email inválido."""
    login_page.login("invalido@test.com", "clave123")
    assert login_page.is_error_visible()
    assert "Credenciales" in login_page.get_error_text()

def test_login_campo_vacio(login_page):
    """Verificar que el botón se deshabilita con campos vacíos."""
    login_page.email_input.fill("")
    login_page.password_input.fill("")
    assert not login_page.is_login_button_enabled()

# test_dashboard.py
def test_dashboard_muestra_bienvenida(dashboard_page):
    """Verificar que el dashboard muestra mensaje de bienvenida."""
    assert "Bienvenido" in dashboard_page.get_welcome_text()

def test_navegacion_sidebar(dashboard_page):
    """Verificar navegación por el sidebar."""
    sections = dashboard_page.get_sidebar_sections()
    assert len(sections) > 0
    dashboard_page.navigate_to_section(sections[0])</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// test-login.spec.ts
import { test, expect } from './fixtures';
import { DashboardPage } from './pages/dashboard-page';

test.describe('Login Tests', () => {
    test('login exitoso', async ({ loginPage }) => {
        // Verificar login con credenciales válidas.
        await loginPage.loginAsUser();
        const dashboard = new DashboardPage(loginPage['page']);
        const welcomeText = await dashboard.getWelcomeText();
        expect(welcomeText).toContain('Bienvenido');
    });

    test('login email inválido', async ({ loginPage }) => {
        // Verificar mensaje de error con email inválido.
        await loginPage.login('invalido@test.com', 'clave123');
        expect(await loginPage.isErrorVisible()).toBeTruthy();
        const errorText = await loginPage.getErrorText();
        expect(errorText).toContain('Credenciales');
    });

    test('login campo vacío', async ({ loginPage }) => {
        // Verificar que el botón se deshabilita con campos vacíos.
        await loginPage['emailInput'].fill('');
        await loginPage['passwordInput'].fill('');
        expect(await loginPage.isLoginButtonEnabled()).toBeFalsy();
    });
});

// test-dashboard.spec.ts
import { test as testDash, expect as expectDash } from './fixtures';

testDash.describe('Dashboard Tests', () => {
    testDash('dashboard muestra bienvenida', async ({ dashboardPage }) => {
        // Verificar que el dashboard muestra mensaje de bienvenida.
        const welcomeText = await dashboardPage.getWelcomeText();
        expectDash(welcomeText).toContain('Bienvenido');
    });

    testDash('navegación sidebar', async ({ dashboardPage }) => {
        // Verificar navegación por el sidebar.
        const sections = await dashboardPage.getSidebarSections();
        expectDash(sections.length).toBeGreaterThan(0);
        await dashboardPage.navigateToSection(sections[0]);
    });
});</code></pre>
            </div>
        </div>

        <h3>🔄 Navegación entre páginas (Page Transitions)</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Cuando una acción te lleva a otra página, el método puede retornar
            el Page Object de la nueva página:</p>
            <div class="code-tabs" data-code-id="L054-6">
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
class LoginPage(BasePage):
    # ... (locators y otros métodos)

    def login_and_go_to_dashboard(self, email, password):
        """Login exitoso retorna DashboardPage."""
        self.login(email, password)
        self.page.wait_for_url("**/dashboard")
        # Importación local para evitar circular imports
        from pages.dashboard_page import DashboardPage
        return DashboardPage(self.page)

# En el test:
def test_flujo_login_a_dashboard(login_page):
    dashboard = login_page.login_and_go_to_dashboard(
        "user@test.com", "clave123"
    )
    # Ahora trabajamos directamente con DashboardPage
    assert dashboard.get_notification_count() >= 0</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// pages/login-page.ts
import { DashboardPage } from './dashboard-page';

// Dentro de LoginPage:
export class LoginPage extends BasePage {
    // ... (locators y otros métodos)

    async loginAndGoToDashboard(
        email: string, password: string
    ): Promise&lt;DashboardPage&gt; {
        // Login exitoso retorna DashboardPage.
        await this.login(email, password);
        await this.page.waitForURL('**/dashboard');
        return new DashboardPage(this.page);
    }
}

// En el test:
import { test, expect } from './fixtures';

test('flujo login a dashboard', async ({ loginPage }) => {
    const dashboard = await loginPage.loginAndGoToDashboard(
        'user@test.com', 'clave123'
    );
    // Ahora trabajamos directamente con DashboardPage
    const count = await dashboard.getNotificationCount();
    expect(count).toBeGreaterThanOrEqual(0);
});</code></pre>
            </div>
        </div>
        </div>

        <h3>⚠️ Errores comunes al implementar POM</h3>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #c62828; color: white;">
                        <th style="padding: 10px;">Error</th>
                        <th style="padding: 10px;">Problema</th>
                        <th style="padding: 10px;">Solución</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #ffcdd2;">
                        <td style="padding: 8px;">Assertions en Page Object</td>
                        <td style="padding: 8px;">Mezcla responsabilidades</td>
                        <td style="padding: 8px;">Retornar datos, assert en test</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Page Object gigante</td>
                        <td style="padding: 8px;">Difícil de mantener</td>
                        <td style="padding: 8px;">Dividir en componentes</td>
                    </tr>
                    <tr style="background: #ffcdd2;">
                        <td style="padding: 8px;">Exponer locators directamente</td>
                        <td style="padding: 8px;">Tests acoplados a selectores</td>
                        <td style="padding: 8px;">Exponer solo métodos de acción</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Sin clase base</td>
                        <td style="padding: 8px;">Duplicación de métodos comunes</td>
                        <td style="padding: 8px;">Crear BasePage con herencia</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip Playwright:</strong> Playwright recomienda usar
            <code>data-testid</code> como estrategia principal de selectores en los
            Page Objects. Esto desacopla los tests del diseño visual y las clases CSS.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Implementa un Page Object completo para una
            página de registro que tenga:</p>
            <ul>
                <li>Campos: nombre, email, password, confirmar password</li>
                <li>Checkbox de términos y condiciones</li>
                <li>Botón de registro</li>
                <li>Mensajes de error por campo</li>
                <li>Método <code>register()</code> que llene todos los campos</li>
                <li>Método que retorne el Page Object de la página de bienvenida</li>
            </ul>
        </div>
    `,
    topics: ["pom", "implementación", "playwright"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_054 = LESSON_054;
}
