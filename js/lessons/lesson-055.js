/**
 * Playwright Academy - Lección 055
 * Components y fragmentos reutilizables
 * Sección 7: Page Object Model y Helpers
 */

const LESSON_055 = {
    id: 55,
    title: "Components y fragmentos reutilizables",
    duration: "7 min",
    level: "intermediate",
    section: "section-07",
    content: `
        <h2>🧩 Components y fragmentos reutilizables</h2>
        <p>En aplicaciones modernas, muchos elementos de la UI se repiten en múltiples páginas:
        headers, sidebars, modales, tablas, formularios. En lugar de duplicar estos selectores
        en cada Page Object, los extraemos como <strong>Components</strong> reutilizables.</p>

        <h3>🤔 ¿Por qué Components?</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Imagina que tu aplicación tiene un <strong>header</strong> con menú de usuario
            que aparece en todas las páginas. Sin components:</p>
            <pre><code class="python"># ❌ Sin components — locators del header duplicados
class DashboardPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.user_menu = page.locator(".header .user-menu")  # ← Duplicado
        self.logout_btn = page.locator(".header .logout")     # ← Duplicado

class ProductsPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.user_menu = page.locator(".header .user-menu")  # ← Duplicado
        self.logout_btn = page.locator(".header .logout")     # ← Duplicado

class SettingsPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.user_menu = page.locator(".header .user-menu")  # ← Duplicado
        self.logout_btn = page.locator(".header .logout")     # ← Duplicado</code></pre>
            <p>Si cambia el selector del header, hay que modificar <strong>todas</strong> las páginas.</p>
        </div>

        <h3>🏗️ Definiendo Components</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Un Component es una clase que encapsula un fragmento de la UI, similar a un
            Page Object pero para una <strong>sección</strong> de la página, no la página completa.</p>
            <pre><code class="python"># components/header_component.py
class HeaderComponent:
    """Component para el header/navbar de la aplicación."""

    def __init__(self, page):
        self.page = page
        # Scope: solo elementos dentro del header
        self.root = page.locator("header.main-header")
        self.logo = self.root.locator(".logo")
        self.user_menu = self.root.locator("[data-testid='user-menu']")
        self.logout_button = self.root.locator("[data-testid='logout']")
        self.notifications = self.root.locator("[data-testid='notifications']")
        self.search_input = self.root.locator("[data-testid='global-search']")

    def open_user_menu(self):
        """Abrir el menú desplegable del usuario."""
        self.user_menu.click()
        return self

    def logout(self):
        """Cerrar sesión desde el header."""
        self.open_user_menu()
        self.logout_button.click()
        return self

    def search(self, query):
        """Realizar una búsqueda global."""
        self.search_input.fill(query)
        self.search_input.press("Enter")
        return self

    def get_username(self):
        """Obtener el nombre del usuario logueado."""
        return self.user_menu.text_content().strip()

    def get_notification_count(self):
        """Obtener cantidad de notificaciones."""
        badge = self.notifications.locator(".badge")
        if badge.is_visible():
            return int(badge.text_content())
        return 0</code></pre>
        </div>

        <h3>📋 Component de tabla — Muy reutilizable</h3>
        <pre><code class="python"># components/table_component.py
class TableComponent:
    """Component genérico para tablas de datos.

    Funciona con cualquier tabla HTML estándar.
    Se puede reutilizar en productos, usuarios, pedidos, etc.
    """

    def __init__(self, page, table_selector):
        self.page = page
        self.root = page.locator(table_selector)
        self.headers = self.root.locator("thead th")
        self.rows = self.root.locator("tbody tr")

    def get_column_names(self):
        """Obtener nombres de las columnas."""
        return self.headers.all_text_contents()

    def get_row_count(self):
        """Obtener número de filas de datos."""
        return self.rows.count()

    def get_cell(self, row_index, col_index):
        """Obtener el texto de una celda específica."""
        row = self.rows.nth(row_index)
        cell = row.locator("td").nth(col_index)
        return cell.text_content().strip()

    def get_row_data(self, row_index):
        """Obtener todos los datos de una fila como lista."""
        row = self.rows.nth(row_index)
        cells = row.locator("td")
        return cells.all_text_contents()

    def get_all_data(self):
        """Obtener todos los datos de la tabla como lista de listas."""
        data = []
        for i in range(self.rows.count()):
            data.append(self.get_row_data(i))
        return data

    def click_row(self, row_index):
        """Hacer clic en una fila."""
        self.rows.nth(row_index).click()
        return self

    def find_row_with_text(self, text):
        """Encontrar la primera fila que contenga el texto."""
        # filter(has_text=...) requiere Playwright >= 1.44
        return self.rows.filter(has_text=text)

    def sort_by_column(self, column_name):
        """Hacer clic en un header para ordenar."""
        # filter(has_text=...) requiere Playwright >= 1.44
        self.headers.filter(has_text=column_name).click()
        return self

    def is_empty(self):
        """Verificar si la tabla no tiene datos."""
        return self.rows.count() == 0</code></pre>

        <h3>🔲 Component de modal/diálogo</h3>
        <pre><code class="python"># components/modal_component.py
class ModalComponent:
    """Component para diálogos modales."""

    def __init__(self, page, modal_selector=".modal"):
        self.page = page
        self.root = page.locator(modal_selector)
        self.title = self.root.locator(".modal-title")
        self.body = self.root.locator(".modal-body")
        self.close_button = self.root.locator(".modal-close, .btn-close")
        self.confirm_button = self.root.locator(".btn-confirm, .btn-primary")
        self.cancel_button = self.root.locator(".btn-cancel, .btn-secondary")

    def is_open(self):
        """Verificar si el modal está abierto."""
        return self.root.is_visible()

    def get_title(self):
        """Obtener el título del modal."""
        return self.title.text_content()

    def get_body_text(self):
        """Obtener el texto del cuerpo del modal."""
        return self.body.text_content()

    def close(self):
        """Cerrar el modal con el botón X."""
        self.close_button.click()
        self.root.wait_for(state="hidden")
        return self

    def confirm(self):
        """Hacer clic en el botón de confirmar."""
        self.confirm_button.click()
        self.root.wait_for(state="hidden")
        return self

    def cancel(self):
        """Hacer clic en el botón de cancelar."""
        self.cancel_button.click()
        self.root.wait_for(state="hidden")
        return self

    def wait_for_open(self, timeout=5000):
        """Esperar a que el modal se abra."""
        self.root.wait_for(state="visible", timeout=timeout)
        return self</code></pre>

        <h3>📐 Component de formulario</h3>
        <pre><code class="python"># components/form_component.py
class FormComponent:
    """Component genérico para formularios."""

    def __init__(self, page, form_selector):
        self.page = page
        self.root = page.locator(form_selector)
        self.submit_button = self.root.locator(
            "button[type='submit'], input[type='submit']"
        )

    def fill_field(self, field_name, value):
        """Llenar un campo por su name o label."""
        field = self.root.locator(
            f"input[name='{field_name}'], "
            f"textarea[name='{field_name}'], "
            f"select[name='{field_name}']"
        )
        tag = field.evaluate("el => el.tagName.toLowerCase()")
        if tag == "select":
            field.select_option(label=value)
        else:
            field.fill(value)
        return self

    def fill_many(self, data: dict):
        """Llenar múltiples campos desde un diccionario."""
        for field_name, value in data.items():
            self.fill_field(field_name, value)
        return self

    def submit(self):
        """Enviar el formulario."""
        self.submit_button.click()
        return self

    def get_validation_errors(self):
        """Obtener mensajes de error de validación."""
        errors = self.root.locator(".error-message, .invalid-feedback")
        return errors.all_text_contents()

    def has_errors(self):
        """Verificar si el formulario tiene errores de validación."""
        return len(self.get_validation_errors()) > 0</code></pre>

        <h3>🔗 Integrando Components en Page Objects</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python"># pages/products_page.py
from pages.base_page import BasePage
from components.header_component import HeaderComponent
from components.table_component import TableComponent
from components.modal_component import ModalComponent

class ProductsPage(BasePage):
    """Página de productos — compuesta por components."""

    def __init__(self, page):
        super().__init__(page)
        self.url = "https://mi-app.com/products"

        # Components reutilizables
        self.header = HeaderComponent(page)
        self.table = TableComponent(page, "#products-table")
        self.delete_modal = ModalComponent(page, "#confirm-delete")

        # Locators propios de esta página
        self.add_product_button = page.locator("[data-testid='add-product']")
        self.filter_input = page.locator("[data-testid='filter']")

    def add_product(self):
        """Abrir formulario de nuevo producto."""
        self.add_product_button.click()
        return self

    def delete_product(self, product_name):
        """Eliminar un producto con confirmación."""
        row = self.table.find_row_with_text(product_name)
        row.locator(".btn-delete").click()
        self.delete_modal.wait_for_open()
        self.delete_modal.confirm()
        return self

    def filter_products(self, text):
        """Filtrar la tabla de productos."""
        self.filter_input.fill(text)
        return self

# ── En los tests ──
def test_eliminar_producto(page):
    products = ProductsPage(page)
    products.navigate()
    initial_count = products.table.get_row_count()

    products.delete_product("Producto Test")

    assert products.table.get_row_count() == initial_count - 1

def test_header_muestra_usuario(page):
    products = ProductsPage(page)
    products.navigate()
    # Accedemos al header a través del Page Object
    assert products.header.get_username() == "Juan Reina"

def test_busqueda_global_desde_productos(page):
    products = ProductsPage(page)
    products.navigate()
    # El header con búsqueda global funciona desde cualquier página
    products.header.search("Configuración")
    assert "settings" in page.url</code></pre>
        </div>

        <h3>📁 Estructura con components</h3>
        <pre><code class="text">mi-proyecto/
├── components/                # Fragmentos reutilizables
│   ├── __init__.py
│   ├── header_component.py
│   ├── sidebar_component.py
│   ├── table_component.py
│   ├── modal_component.py
│   └── form_component.py
├── pages/                     # Page Objects (usan components)
│   ├── __init__.py
│   ├── base_page.py
│   ├── login_page.py
│   ├── dashboard_page.py
│   └── products_page.py
├── tests/
│   ├── conftest.py
│   ├── test_login.py
│   └── test_products.py
└── pytest.ini</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Regla de oro:</strong> Si un fragmento de UI aparece en <strong>2 o más
            páginas</strong>, extráelo como Component. Si solo aparece en una página,
            déjalo como parte del Page Object de esa página.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Crea los siguientes components:</p>
            <ol>
                <li><strong>PaginationComponent:</strong> para controles de paginación
                (página anterior, siguiente, ir a página, total de páginas)</li>
                <li><strong>FilterBarComponent:</strong> para una barra de filtros con
                dropdowns, búsqueda y botón de limpiar</li>
                <li>Integra ambos en un Page Object de <code>UsersPage</code></li>
            </ol>
        </div>
    `,
    topics: ["componentes", "reutilización", "fragmentos"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_055 = LESSON_055;
}
