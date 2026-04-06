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

        <pre><code class="python">from playwright.sync_api import expect

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

        <div style="background: #fce4ec; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Anti-patron: Tests sin estructura clara</h4>
            <pre><code class="python"># MAL: Las fases estan mezcladas, dificil de entender
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

        <h3>Patron Builder: Construccion de datos complejos</h3>
        <p>Cuando los datos de prueba tienen muchos campos, el patron Builder permite
        construirlos de forma fluida y legible, usando solo los valores relevantes para cada test:</p>

        <pre><code class="python"># builders/user_builder.py
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

        <pre><code class="python"># Uso en tests: solo se especifican los campos relevantes

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

        <h3>Patron Factory: Creacion de Page Objects</h3>
        <p>El patron Factory centraliza la creacion de Page Objects, permitiendo
        instanciarlos con configuraciones predefinidas:</p>

        <pre><code class="python"># factories/page_factory.py
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

        <pre><code class="python"># Fixture para inyectar la factory
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

        <h3>Patron Decorator: Mejoras transversales</h3>
        <p>Los decoradores añaden funcionalidad a tests sin modificar su codigo:</p>

        <pre><code class="python"># utils/decorators.py
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
