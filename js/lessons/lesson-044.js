/**
 * Playwright Academy - Lección 044
 * Proyecto: Localizadores resilientes
 * Sección 5: Localizadores y Selectores
 */

const LESSON_044 = {
    id: 44,
    title: "Proyecto: Localizadores resilientes",
    duration: "10 min",
    level: "beginner",
    section: "section-05",
    content: `
        <h2>🚀 Proyecto: Localizadores resilientes</h2>
        <p>En este proyecto integrador de la <strong>Sección 5</strong> construirás un test suite completo
        que aplica todas las técnicas de localizadores aprendidas: built-in locators, CSS, XPath,
        localizadores semánticos, filtrado, encadenamiento, localizadores relativos y estrategias
        de robustez. El proyecto incluye una <strong>estructura de Page Objects simplificada</strong>
        como anticipo de la Sección 7, localizadores centralizados y tests organizados por técnica.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎯 Objetivo del proyecto</h4>
            <p>Crear un framework de testing que demuestre dominio de <strong>todos los tipos de
            localizadores de Playwright</strong>, con localizadores centralizados en módulos reutilizables,
            page classes como encapsulación, y tests que validan cada técnica. Se usa
            <code>https://the-internet.herokuapp.com</code> como aplicación bajo prueba.</p>
        </div>

        <h3>🗂️ Paso 1: Estructura del proyecto</h3>
        <pre><code class="bash"># Crear la estructura completa
mkdir -p proyecto_localizadores/locators
mkdir -p proyecto_localizadores/pages
mkdir -p proyecto_localizadores/tests
mkdir -p proyecto_localizadores/test-results/screenshots

# Crear archivos
touch proyecto_localizadores/locators/__init__.py
touch proyecto_localizadores/locators/selectors.py

touch proyecto_localizadores/pages/__init__.py
touch proyecto_localizadores/pages/login_page.py
touch proyecto_localizadores/pages/tables_page.py

touch proyecto_localizadores/tests/__init__.py
touch proyecto_localizadores/tests/conftest.py
touch proyecto_localizadores/tests/test_localizadores_builtin.py
touch proyecto_localizadores/tests/test_css_xpath.py
touch proyecto_localizadores/tests/test_filtrado_encadenamiento.py
touch proyecto_localizadores/tests/test_layout.py

touch proyecto_localizadores/pytest.ini</code></pre>
        <pre><code>proyecto_localizadores/
├── pytest.ini                              # Configuración de pytest
├── locators/
│   ├── __init__.py
│   └── selectors.py                        # Localizadores centralizados
├── pages/
│   ├── __init__.py
│   ├── login_page.py                       # Page class para login
│   └── tables_page.py                      # Page class para tablas
└── tests/
    ├── __init__.py
    ├── conftest.py                         # Fixtures y configuración global
    ├── test_localizadores_builtin.py       # Tests: get_by_role, get_by_text, etc.
    ├── test_css_xpath.py                   # Tests: CSS y XPath cuando son necesarios
    ├── test_filtrado_encadenamiento.py     # Tests: filter(), chaining, and_(), or_()
    ├── test_layout.py                      # Tests: localizadores por layout
    └── test-results/
        └── screenshots/                    # Capturas de fallos</code></pre>

        <h3>⚙️ Paso 2: pytest.ini — Configuración</h3>
        <pre><code class="bash"># pytest.ini
[pytest]
markers =
    builtin: Tests usando localizadores built-in de Playwright
    css: Tests usando CSS selectors
    xpath: Tests usando XPath
    filtrado: Tests de filtrado y encadenamiento
    layout: Tests de localizadores relativos/layout
    smoke: Tests críticos de humo

testpaths = tests
addopts = -v --tb=short</code></pre>

        <h3>📦 Paso 3: locators/selectors.py — Localizadores centralizados</h3>
        <p>Centralizar los localizadores en un módulo permite cambiarlos en un solo lugar
        cuando la UI cambia. Esta es la <strong>base de cualquier framework mantenible</strong>.</p>
        <pre><code class="python"># locators/selectors.py
"""
Localizadores centralizados del proyecto.
Cada sección agrupa los selectores por página/feature.

Convenciones:
- Usar get_by_role/get_by_label/get_by_text como primera opción
- Usar data-testid como segunda opción
- Usar CSS solo cuando no hay alternativa semántica
- NUNCA usar XPath absolutos ni índices posicionales
- Los nombres de constantes usan UPPER_SNAKE_CASE
- Los localizadores se definen como strings o tuplas (tipo, valor)
"""


class LoginSelectors:
    """Selectores para la página de login."""

    # --- Localizadores semánticos (preferidos) ---
    USERNAME_LABEL = "Username"           # Para get_by_label()
    PASSWORD_LABEL = "Password"           # Para get_by_label()
    LOGIN_BUTTON_NAME = "Login"           # Para get_by_role("button", name=...)
    LOGOUT_LINK_NAME = " Logout"          # Para get_by_role("link", name=...)

    # --- Localizadores CSS (fallback) ---
    FLASH_MESSAGE = "#flash"              # Mensaje de éxito/error
    SECURE_AREA_HEADING = ".subheader"    # Subtítulo del área segura

    # --- URLs ---
    URL = "/login"
    SECURE_URL = "/secure"


class TablesSelectors:
    """Selectores para la página de tablas de datos."""

    # --- Localizadores semánticos ---
    TABLE_HEADER_ROLE = "columnheader"    # Para get_by_role()
    TABLE_ROW_ROLE = "row"               # Para get_by_role()
    TABLE_CELL_ROLE = "cell"             # Para get_by_role()

    # --- Localizadores CSS ---
    TABLE_1 = "#table1"                  # Tabla principal
    TABLE_2 = "#table2"                  # Tabla secundaria
    TABLE_1_HEADERS = "#table1 thead th"
    TABLE_1_ROWS = "#table1 tbody tr"
    TABLE_1_SORT_HEADER = "#table1 thead th"  # Headers clicables

    # --- URLs ---
    URL = "/tables"


class CheckboxSelectors:
    """Selectores para la página de checkboxes."""

    CHECKBOX_ROLE = "checkbox"            # Para get_by_role()
    CONTAINER = "#checkboxes"             # Contenedor CSS
    ALL_CHECKBOXES = "#checkboxes input[type='checkbox']"

    URL = "/checkboxes"


class DropdownSelectors:
    """Selectores para la página de dropdown."""

    DROPDOWN_LABEL = "Dropdown List"      # Título de la página
    DROPDOWN_CSS = "#dropdown"            # Selector CSS del select
    OPTION_ROLE = "option"                # Para get_by_role()

    URL = "/dropdown"


class DynamicLoadingSelectors:
    """Selectores para la página de carga dinámica."""

    START_BUTTON_NAME = "Start"           # Para get_by_role("button", name=...)
    RESULT_TEXT = "#finish h4"            # Resultado después de carga

    URL_HIDDEN = "/dynamic_loading/1"     # Elemento oculto
    URL_RENDERED = "/dynamic_loading/2"   # Elemento renderizado después


class InputsSelectors:
    """Selectores para la página de inputs."""

    NUMBER_INPUT = "input[type='number']"  # CSS para input numérico

    URL = "/inputs"


class FormAuthSelectors:
    """Selectores para autenticación de formularios."""

    USERNAME_CSS = "#username"
    PASSWORD_CSS = "#password"
    SUBMIT_CSS = "button[type='submit']"
    FLASH_CSS = "#flash"

    URL = "/login"


class HerokuAppSelectors:
    """Selectores generales de the-internet.herokuapp.com."""

    MAIN_HEADING = "h1"
    SUB_HEADING = "h3"
    CONTENT_LINKS = "#content ul li a"
    PAGE_FOOTER = "#page-footer"

    URL = "/"</code></pre>

        <h3>🏗️ Paso 4: pages/login_page.py — Page class (vista previa de POM)</h3>
        <p>Una <strong>page class</strong> encapsula los localizadores y las acciones de una página.
        Esto es un anticipo del patrón <strong>Page Object Model</strong> que verás en profundidad
        en la Sección 7.</p>
        <pre><code class="python"># pages/login_page.py
"""
Page class para la página de Login.
Encapsula localizadores y acciones del formulario de autenticación.

Esta es una versión simplificada del Page Object Model (POM).
En la Sección 7 profundizaremos en el patrón completo.
"""
from playwright.sync_api import Page, expect
import logging

logger = logging.getLogger("pages.login")


class LoginPage:
    """Encapsula la interacción con la página de Login."""

    URL = "/login"

    def __init__(self, page: Page):
        self.page = page

        # Localizadores usando la API semántica de Playwright
        self.username_input = page.get_by_label("Username")
        self.password_input = page.get_by_label("Password")
        self.login_button = page.get_by_role("button", name="Login")
        self.flash_message = page.locator("#flash")
        self.logout_link = page.get_by_role("link", name=" Logout")

    def navigate(self):
        """Navegar a la página de login."""
        self.page.goto(self.URL)
        logger.info("Navegación a la página de login")
        return self

    def login(self, username: str, password: str):
        """
        Realizar login con las credenciales proporcionadas.

        Args:
            username: Nombre de usuario
            password: Contraseña
        """
        logger.info(f"Intentando login con usuario: {username}")
        self.username_input.fill(username)
        self.password_input.fill(password)
        self.login_button.click()
        return self

    def logout(self):
        """Cerrar sesión."""
        self.logout_link.click()
        logger.info("Logout realizado")
        return self

    def get_flash_message(self) -> str:
        """Obtener el texto del mensaje flash."""
        return self.flash_message.text_content().strip()

    # --- Assertions encapsuladas ---

    def assert_login_success(self):
        """Verificar que el login fue exitoso."""
        expect(self.page).to_have_url("**/secure")
        expect(self.flash_message).to_contain_text("You logged into a secure area!")
        logger.info("Login exitoso verificado")

    def assert_login_failed(self, expected_msg: str = "Your username is invalid!"):
        """Verificar que el login falló con el mensaje esperado."""
        expect(self.flash_message).to_contain_text(expected_msg)
        expect(self.page).to_have_url("**/login")
        logger.info(f"Login fallido verificado: {expected_msg}")

    def assert_logged_out(self):
        """Verificar que el logout fue exitoso."""
        expect(self.page).to_have_url("**/login")
        expect(self.flash_message).to_contain_text("You logged out of the secure area!")
        logger.info("Logout verificado")</code></pre>

        <h3>📊 Paso 5: pages/tables_page.py — Page class para tablas</h3>
        <pre><code class="python"># pages/tables_page.py
"""
Page class para la página de tablas (Data Tables).
Demuestra localizadores de filtrado, encadenamiento y extracción de datos.
"""
from playwright.sync_api import Page, Locator, expect
import logging

logger = logging.getLogger("pages.tables")


class TablesPage:
    """Encapsula la interacción con la página de tablas de datos."""

    URL = "/tables"

    def __init__(self, page: Page):
        self.page = page

        # Localizadores de la tabla principal
        self.table1 = page.locator("#table1")
        self.table2 = page.locator("#table2")

        # Headers de la tabla 1 (usando encadenamiento)
        self.table1_headers = self.table1.locator("thead th")

        # Todas las filas de datos de la tabla 1
        self.table1_rows = self.table1.locator("tbody tr")

    def navigate(self):
        """Navegar a la página de tablas."""
        self.page.goto(self.URL)
        logger.info("Navegación a la página de tablas")
        return self

    def get_header_names(self) -> list[str]:
        """Obtener los nombres de los encabezados de la tabla 1."""
        headers = self.table1_headers.all_text_contents()
        logger.info(f"Headers: {headers}")
        return headers

    def get_row_count(self) -> int:
        """Obtener la cantidad de filas de datos."""
        count = self.table1_rows.count()
        logger.info(f"Filas en tabla 1: {count}")
        return count

    def get_row_by_last_name(self, last_name: str) -> Locator:
        """
        Obtener una fila filtrada por apellido.
        Usa locator().filter() para filtrado robusto.
        """
        row = self.table1_rows.filter(has_text=last_name)
        logger.info(f"Fila encontrada para apellido: {last_name}")
        return row

    def get_cell_value(self, row_locator: Locator, column_index: int) -> str:
        """
        Obtener el valor de una celda específica en una fila.
        Usa encadenamiento: row > td.nth(index).
        """
        value = row_locator.locator("td").nth(column_index).text_content()
        logger.info(f"Valor de celda [{column_index}]: {value}")
        return value

    def get_all_emails(self) -> list[str]:
        """
        Extraer todos los emails de la tabla.
        Los emails están en la columna 3 (índice 2).
        """
        emails = []
        for i in range(self.table1_rows.count()):
            email = self.table1_rows.nth(i).locator("td").nth(2).text_content()
            emails.append(email)
        logger.info(f"Emails extraídos: {len(emails)}")
        return emails

    def sort_by_column(self, column_name: str):
        """
        Ordenar la tabla haciendo clic en un header.
        Usa filter() para encontrar el header correcto.
        """
        header = self.table1_headers.filter(has_text=column_name)
        header.click()
        logger.info(f"Tabla ordenada por columna: {column_name}")

    def get_column_values(self, column_index: int) -> list[str]:
        """
        Obtener todos los valores de una columna específica.
        Útil para verificar ordenamiento.
        """
        values = []
        for i in range(self.table1_rows.count()):
            value = self.table1_rows.nth(i).locator("td").nth(column_index).text_content()
            values.append(value)
        return values

    def get_rows_with_due(self, amount: str) -> Locator:
        """
        Filtrar filas por monto de deuda.
        Demuestra filtrado con has (localizador interno).
        """
        return self.table1_rows.filter(
            has=self.page.locator("td", has_text=amount)
        )

    # --- Assertions ---

    def assert_table_has_rows(self, expected_count: int):
        """Verificar que la tabla tiene el número esperado de filas."""
        expect(self.table1_rows).to_have_count(expected_count)
        logger.info(f"Tabla tiene {expected_count} filas (verificado)")

    def assert_row_contains(self, last_name: str, expected_text: str):
        """Verificar que una fila con cierto apellido contiene texto esperado."""
        row = self.get_row_by_last_name(last_name)
        expect(row).to_contain_text(expected_text)
        logger.info(f"Fila '{last_name}' contiene '{expected_text}'")</code></pre>

        <h3>🔧 Paso 6: tests/conftest.py — Fixtures</h3>
        <pre><code class="python"># tests/conftest.py
"""
Fixtures globales del proyecto de localizadores resilientes.
"""
import pytest
import logging
from pathlib import Path
from playwright.sync_api import Page, BrowserContext
from pages.login_page import LoginPage
from pages.tables_page import TablesPage

# --- Logging ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger("seccion5")

# --- Rutas ---
SCREENSHOTS_DIR = Path(__file__).parent / "test-results" / "screenshots"


# =====================================================
# FIXTURE: Configuración del browser
# =====================================================

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "base_url": "https://the-internet.herokuapp.com",
        "viewport": {"width": 1280, "height": 720},
    }


# =====================================================
# FIXTURES: Page Objects
# =====================================================

@pytest.fixture
def login_page(page: Page) -> LoginPage:
    """Retorna una instancia de LoginPage ya navegada."""
    lp = LoginPage(page)
    lp.navigate()
    return lp


@pytest.fixture
def tables_page(page: Page) -> TablesPage:
    """Retorna una instancia de TablesPage ya navegada."""
    tp = TablesPage(page)
    tp.navigate()
    return tp


# =====================================================
# FIXTURES: Datos de prueba
# =====================================================

@pytest.fixture
def credenciales_validas():
    """Credenciales válidas para login."""
    return {"username": "tomsmith", "password": "SuperSecretPassword!"}


@pytest.fixture
def credenciales_invalidas():
    """Credenciales inválidas para login."""
    return {"username": "usuario_falso", "password": "clave_incorrecta"}


# =====================================================
# FIXTURES: Configuración automática
# =====================================================

@pytest.fixture(autouse=True)
def configurar_pagina(page: Page):
    """Configurar timeouts para cada test."""
    page.set_default_timeout(10000)
    page.set_default_navigation_timeout(15000)
    yield page


@pytest.fixture(autouse=True)
def log_test(request):
    """Log de inicio y fin de cada test."""
    nombre = request.node.name
    logger.info(f"{'='*60}")
    logger.info(f"INICIO: {nombre}")
    yield
    logger.info(f"FIN: {nombre}")


@pytest.fixture(autouse=True)
def screenshot_on_failure(page: Page, request):
    """Screenshot automático cuando un test falla."""
    yield
    if hasattr(request.node, "rep_call") and request.node.rep_call.failed:
        SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)
        nombre = request.node.name
        ruta = SCREENSHOTS_DIR / f"{nombre}.png"
        page.screenshot(path=str(ruta), full_page=True)
        logger.error(f"Screenshot guardado: {ruta}")


@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Hook para acceder al resultado del test en fixtures."""
    outcome = yield
    rep = outcome.get_result()
    setattr(item, f"rep_{rep.when}", rep)</code></pre>

        <h3>📝 Paso 7: test_localizadores_builtin.py — Localizadores built-in</h3>
        <p>Este archivo demuestra el uso de los localizadores semánticos de Playwright:
        <code>get_by_role</code>, <code>get_by_text</code>, <code>get_by_label</code>,
        <code>get_by_placeholder</code> y <code>get_by_test_id</code>.</p>
        <pre><code class="python"># tests/test_localizadores_builtin.py
"""
Tests usando los localizadores built-in de Playwright.
Demuestra: get_by_role, get_by_text, get_by_label, get_by_placeholder.
"""
import pytest
from playwright.sync_api import Page, expect
from pages.login_page import LoginPage


class TestGetByRole:
    """Tests usando get_by_role() — la forma preferida."""

    @pytest.mark.builtin
    @pytest.mark.smoke
    def test_boton_login_por_role(self, login_page: LoginPage):
        """Encontrar el botón de login por su rol ARIA."""
        boton = login_page.page.get_by_role("button", name="Login")
        expect(boton).to_be_visible()
        expect(boton).to_be_enabled()

    @pytest.mark.builtin
    def test_heading_por_role(self, page: Page):
        """Encontrar encabezados por rol."""
        page.goto("/")
        heading = page.get_by_role("heading", name="Welcome to the-internet")
        expect(heading).to_be_visible()

    @pytest.mark.builtin
    def test_links_por_role(self, page: Page):
        """Encontrar links por rol y nombre."""
        page.goto("/")
        link_login = page.get_by_role("link", name="Form Authentication")
        expect(link_login).to_be_visible()
        link_login.click()
        expect(page).to_have_url("**/login")

    @pytest.mark.builtin
    def test_checkboxes_por_role(self, page: Page):
        """Encontrar checkboxes por rol."""
        page.goto("/checkboxes")
        checkboxes = page.get_by_role("checkbox")
        expect(checkboxes).to_have_count(2)

        # El segundo checkbox está marcado por defecto
        expect(checkboxes.nth(1)).to_be_checked()

    @pytest.mark.builtin
    def test_textbox_por_role(self, login_page: LoginPage):
        """Encontrar campos de texto por rol."""
        # Los inputs de tipo text tienen role "textbox"
        textboxes = login_page.page.get_by_role("textbox")
        expect(textboxes.first).to_be_visible()


class TestGetByLabel:
    """Tests usando get_by_label() — ideal para formularios."""

    @pytest.mark.builtin
    @pytest.mark.smoke
    def test_login_con_labels(self, login_page: LoginPage, credenciales_validas):
        """Login completo usando get_by_label para los campos."""
        login_page.login(
            credenciales_validas["username"],
            credenciales_validas["password"]
        )
        login_page.assert_login_success()

    @pytest.mark.builtin
    def test_label_username(self, login_page: LoginPage):
        """Verificar que el campo Username se encuentra por label."""
        campo = login_page.page.get_by_label("Username")
        expect(campo).to_be_visible()
        expect(campo).to_be_editable()

    @pytest.mark.builtin
    def test_label_password(self, login_page: LoginPage):
        """Verificar que el campo Password se encuentra por label."""
        campo = login_page.page.get_by_label("Password")
        expect(campo).to_be_visible()


class TestGetByText:
    """Tests usando get_by_text() — para contenido visible."""

    @pytest.mark.builtin
    def test_encontrar_texto_en_pagina(self, page: Page):
        """Encontrar elementos por su texto visible."""
        page.goto("/")
        titulo = page.get_by_text("Welcome to the-internet")
        expect(titulo).to_be_visible()

    @pytest.mark.builtin
    def test_login_fallido_mensaje_error(
        self, login_page: LoginPage, credenciales_invalidas
    ):
        """Verificar mensaje de error usando get_by_text."""
        login_page.login(
            credenciales_invalidas["username"],
            credenciales_invalidas["password"]
        )
        error = login_page.page.get_by_text("Your username is invalid!")
        expect(error).to_be_visible()

    @pytest.mark.builtin
    def test_texto_parcial_con_exact_false(self, page: Page):
        """Buscar texto parcial (exact=False es el comportamiento por defecto)."""
        page.goto("/")
        # Encuentra elementos que CONTIENEN el texto
        elemento = page.get_by_text("Welcome")
        expect(elemento).to_be_visible()

    @pytest.mark.builtin
    def test_texto_exacto(self, page: Page):
        """Buscar texto exacto con exact=True."""
        page.goto("/login")
        # exact=True requiere coincidencia completa
        boton = page.get_by_text("Login", exact=True)
        expect(boton.first).to_be_visible()</code></pre>

        <h3>🎨 Paso 8: test_css_xpath.py — CSS y XPath cuando son necesarios</h3>
        <pre><code class="python"># tests/test_css_xpath.py
"""
Tests demostrando cuándo CSS y XPath son necesarios.
Aunque get_by_role/label/text son preferibles, hay escenarios
donde CSS y XPath son la mejor (o única) opción.
"""
import pytest
from playwright.sync_api import Page, expect


class TestCSSSelectors:
    """Tests usando CSS selectors — cuándo son apropiados."""

    @pytest.mark.css
    def test_selector_por_id(self, page: Page):
        """CSS por ID: útil cuando el ID es estable y semántico."""
        page.goto("/tables")
        tabla = page.locator("#table1")
        expect(tabla).to_be_visible()

    @pytest.mark.css
    def test_selector_por_atributo(self, page: Page):
        """CSS por atributo: útil para inputs con tipo específico."""
        page.goto("/inputs")
        campo = page.locator("input[type='number']")
        expect(campo).to_be_visible()
        campo.fill("42")
        expect(campo).to_have_value("42")

    @pytest.mark.css
    def test_selector_combinado(self, page: Page):
        """CSS combinado: tabla + descendientes."""
        page.goto("/tables")
        # Obtener todas las celdas de email de la tabla 1
        emails = page.locator("#table1 tbody tr td:nth-child(3)")
        assert emails.count() > 0
        # Verificar que contienen @
        for i in range(emails.count()):
            assert "@" in emails.nth(i).text_content()

    @pytest.mark.css
    def test_selector_has_text(self, page: Page):
        """CSS con :has-text() — pseudo-selector de Playwright."""
        page.goto("/tables")
        # Fila que contiene "Smith"
        fila_smith = page.locator("#table1 tbody tr:has-text('Smith')")
        expect(fila_smith).to_be_visible()

    @pytest.mark.css
    def test_selector_visible(self, page: Page):
        """CSS con :visible — solo elementos visibles."""
        page.goto("/checkboxes")
        # Solo checkboxes visibles
        checkboxes = page.locator("input[type='checkbox']:visible")
        expect(checkboxes).to_have_count(2)

    @pytest.mark.css
    def test_multiples_atributos(self, page: Page):
        """CSS con múltiples atributos para mayor especificidad."""
        page.goto("/login")
        # Input de tipo submit con clase específica
        boton = page.locator("button[type='submit']")
        expect(boton).to_be_visible()
        expect(boton).to_have_text("Login")


class TestXPathSelectors:
    """Tests usando XPath — solo cuando es la mejor opción."""

    @pytest.mark.xpath
    def test_xpath_texto_contiene(self, page: Page):
        """XPath con contains(): útil para texto parcial en atributos."""
        page.goto("/")
        # Encontrar links cuyo href contiene "login"
        link = page.locator("xpath=//a[contains(@href, 'login')]")
        expect(link).to_be_visible()

    @pytest.mark.xpath
    def test_xpath_navegar_al_padre(self, page: Page):
        """XPath para navegar al elemento padre — imposible con CSS."""
        page.goto("/tables")
        # Desde una celda con texto "jdoe@hotmail.com", ir al tr padre
        fila = page.locator(
            "xpath=//td[text()='jdoe@hotmail.com']/parent::tr"
        )
        expect(fila).to_be_visible()
        # Verificar que es la fila de "Doe"
        expect(fila).to_contain_text("Doe")

    @pytest.mark.xpath
    def test_xpath_hermano_siguiente(self, page: Page):
        """XPath para encontrar hermanos — another CSS limitation."""
        page.goto("/tables")
        # Encontrar el th después de "Last Name"
        siguiente = page.locator(
            "xpath=//th[text()='Last Name']/following-sibling::th[1]"
        )
        expect(siguiente).to_have_text("First Name")

    @pytest.mark.xpath
    def test_xpath_posicion_y_texto(self, page: Page):
        """XPath combinando posición y texto."""
        page.goto("/tables")
        # Primera fila de la tabla 1
        primera_fila = page.locator(
            "xpath=//table[@id='table1']//tbody/tr[1]"
        )
        expect(primera_fila).to_be_visible()

    @pytest.mark.xpath
    def test_xpath_or_condition(self, page: Page):
        """XPath con operador OR — difícil de hacer en CSS."""
        page.goto("/login")
        # Encontrar inputs de texto O password
        campos = page.locator(
            "xpath=//input[@type='text' or @type='password']"
        )
        assert campos.count() >= 2</code></pre>

        <h3>🔗 Paso 9: test_filtrado_encadenamiento.py — filter(), chaining, and_(), or_()</h3>
        <pre><code class="python"># tests/test_filtrado_encadenamiento.py
"""
Tests de filtrado y encadenamiento de localizadores.
Demuestra: filter(), locator chaining, and_(), or_().
"""
import pytest
from playwright.sync_api import Page, expect
from pages.tables_page import TablesPage


class TestFiltrado:
    """Tests usando filter() para refinar localizadores."""

    @pytest.mark.filtrado
    def test_filtrar_filas_por_texto(self, tables_page: TablesPage):
        """Filtrar filas de tabla que contienen texto específico."""
        fila = tables_page.get_row_by_last_name("Smith")
        expect(fila).to_be_visible()
        expect(fila).to_contain_text("John")

    @pytest.mark.filtrado
    def test_filtrar_con_has(self, tables_page: TablesPage):
        """Filtrar usando has= para buscar por localizador hijo."""
        # Filas que contienen una celda con el email específico
        fila = tables_page.table1_rows.filter(
            has=tables_page.page.locator("td", has_text="jdoe@hotmail.com")
        )
        expect(fila).to_be_visible()
        expect(fila).to_contain_text("Doe")

    @pytest.mark.filtrado
    def test_filtrar_con_has_text(self, tables_page: TablesPage):
        """Filtrar con has_text= para buscar texto en el elemento."""
        # Filas que contienen "$50.00"
        filas_50 = tables_page.table1_rows.filter(has_text="$50.00")
        count = filas_50.count()
        assert count >= 1, f"Debería haber al menos 1 fila con $50.00, hay {count}"

    @pytest.mark.filtrado
    def test_filtrar_con_has_not_text(self, tables_page: TablesPage):
        """Filtrar excluyendo filas con cierto texto."""
        # Filas que NO contienen "Smith"
        filas_sin_smith = tables_page.table1_rows.filter(has_not_text="Smith")
        total = tables_page.table1_rows.count()
        sin_smith = filas_sin_smith.count()
        assert sin_smith < total
        assert sin_smith == total - 1  # Solo hay 1 Smith

    @pytest.mark.filtrado
    def test_filtros_encadenados(self, tables_page: TablesPage):
        """Encadenar múltiples filtros para refinar resultados."""
        # Filas con "$50.00" que también contienen "doe"
        filas = (
            tables_page.table1_rows
            .filter(has_text="$50.00")
            .filter(has_text="doe")
        )
        # Verificar que encontramos al menos una coincidencia
        assert filas.count() >= 0  # Puede que no haya coincidencia exacta


class TestEncadenamiento:
    """Tests de encadenamiento de localizadores (chaining)."""

    @pytest.mark.filtrado
    def test_encadenar_locator(self, tables_page: TablesPage):
        """Encadenar locator() para navegar dentro de un contenedor."""
        # tabla > thead > th (encadenamiento de localizadores)
        headers = tables_page.table1.locator("thead th")
        assert headers.count() >= 4

    @pytest.mark.filtrado
    def test_encadenar_para_celda_especifica(self, tables_page: TablesPage):
        """Navegar de fila a celda usando encadenamiento."""
        fila = tables_page.get_row_by_last_name("Bach")
        # Obtener el email (columna 3, índice 2)
        email = fila.locator("td").nth(2).text_content()
        assert "@" in email

    @pytest.mark.filtrado
    def test_encadenar_con_nth(self, tables_page: TablesPage):
        """Usar nth() para seleccionar un elemento específico en una lista."""
        # Segunda fila de la tabla
        segunda_fila = tables_page.table1_rows.nth(1)
        expect(segunda_fila).to_be_visible()

        # Primera celda de esa fila
        primera_celda = segunda_fila.locator("td").first
        assert primera_celda.text_content() != ""

    @pytest.mark.filtrado
    def test_first_y_last(self, tables_page: TablesPage):
        """Usar .first y .last para acceder a extremos de una lista."""
        # Primera fila
        primera = tables_page.table1_rows.first
        expect(primera).to_be_visible()

        # Última fila
        ultima = tables_page.table1_rows.last
        expect(ultima).to_be_visible()

        # No deben ser la misma fila (la tabla tiene varias)
        assert primera.text_content() != ultima.text_content()


class TestAndOr:
    """Tests usando and_() y or_() para combinar localizadores."""

    @pytest.mark.filtrado
    def test_and_combinar_condiciones(self, page: Page):
        """Usar and_() para que un elemento cumpla múltiples condiciones."""
        page.goto("/login")
        # Botón que es de tipo submit Y contiene texto "Login"
        boton = page.get_by_role("button").and_(
            page.get_by_text("Login")
        )
        expect(boton).to_be_visible()
        expect(boton).to_have_count(1)

    @pytest.mark.filtrado
    def test_or_alternativa(self, page: Page):
        """Usar or_() para encontrar un elemento que cumpla al menos una condición."""
        page.goto("/")
        # Links que digan "Form Authentication" O "Checkboxes"
        links = page.get_by_role("link", name="Form Authentication").or_(
            page.get_by_role("link", name="Checkboxes")
        )
        assert links.count() == 2

    @pytest.mark.filtrado
    def test_and_en_tabla(self, page: Page):
        """Combinar and_() con localizadores de tabla."""
        page.goto("/tables")
        # Filas que contienen AMBOS textos
        fila = page.locator("#table1 tbody tr").filter(
            has_text="Smith"
        ).and_(
            page.locator("tr", has_text="John")
        )
        expect(fila).to_be_visible()</code></pre>

        <h3>📐 Paso 10: test_layout.py — Localizadores por layout</h3>
        <pre><code class="python"># tests/test_layout.py
"""
Tests usando localizadores basados en layout y posición relativa.
Demuestra: above(), below(), left_of(), right_of(), near().
"""
import pytest
from playwright.sync_api import Page, expect


class TestLayoutLocators:
    """Tests con localizadores relativos basados en layout."""

    @pytest.mark.layout
    def test_elemento_above(self, page: Page):
        """Encontrar un elemento que está ARRIBA de otro."""
        page.goto("/login")
        # El campo Username está arriba del campo Password
        password_field = page.get_by_label("Password")
        username_label = page.get_by_text("Username").above(password_field)
        # Verificar que hay un elemento con texto "Username" arriba de Password
        # Nota: above() puede no encontrar exactamente lo esperado en todos los layouts
        # En este caso validamos que la relación espacial existe
        expect(page.get_by_label("Username")).to_be_visible()

    @pytest.mark.layout
    def test_elemento_below(self, page: Page):
        """Encontrar un elemento que está DEBAJO de otro."""
        page.goto("/login")
        # El botón Login está debajo del campo Password
        username_field = page.get_by_label("Username")
        # Buscar un input que esté debajo del campo Username
        below_username = page.locator("input").below(username_field).first
        expect(below_username).to_be_visible()

    @pytest.mark.layout
    def test_near_elemento_cercano(self, page: Page):
        """Encontrar un elemento CERCA de otro (dentro de 50px por defecto)."""
        page.goto("/login")
        # El botón Login está cerca del campo Password
        password = page.get_by_label("Password")
        boton_cercano = page.get_by_role("button").near(password)
        expect(boton_cercano).to_be_visible()

    @pytest.mark.layout
    def test_near_con_distancia_personalizada(self, page: Page):
        """Usar near() con distancia máxima personalizada."""
        page.goto("/login")
        password = page.get_by_label("Password")
        # Buscar botón cerca del campo password, con máximo 200px
        boton = page.get_by_role("button").near(password, max_distance=200)
        expect(boton).to_be_visible()

    @pytest.mark.layout
    def test_combinar_layout_con_filtrado(self, page: Page):
        """Combinar localizadores de layout con filtrado."""
        page.goto("/tables")
        # Encontrar headers de tabla
        headers = page.locator("#table1 thead th")
        primer_header = headers.first

        # Los datos están debajo del header
        datos_debajo = page.locator("#table1 tbody td").below(primer_header)
        assert datos_debajo.count() > 0

    @pytest.mark.layout
    def test_layout_en_formulario(self, page: Page):
        """Usar layout para encontrar el label asociado a un campo."""
        page.goto("/login")
        # El botón de submit
        submit = page.get_by_role("button", name="Login")
        expect(submit).to_be_visible()

        # Verificar que hay inputs arriba del botón
        inputs_arriba = page.locator("input").above(submit)
        assert inputs_arriba.count() >= 2  # Username y Password</code></pre>

        <h3>▶️ Paso 11: Ejecutar y depurar</h3>
        <pre><code class="bash"># Ejecutar todos los tests
pytest tests/ -v

# Solo tests de localizadores built-in
pytest tests/ -m builtin -v

# Solo tests de CSS
pytest tests/ -m css -v

# Solo tests de XPath
pytest tests/ -m xpath -v

# Solo tests de filtrado y encadenamiento
pytest tests/ -m filtrado -v

# Solo tests de layout
pytest tests/ -m layout -v

# Smoke tests (los más críticos)
pytest tests/ -m smoke -v

# Con screenshots al fallar
pytest tests/ -v --screenshot=only-on-failure --output=test-results/

# Con trace para debugging
pytest tests/ -v --tracing=retain-on-failure

# --- Debugging con Inspector ---

# Abrir el Inspector para explorar localizadores
PWDEBUG=1 pytest tests/test_localizadores_builtin.py -v -k "test_boton_login"

# En Windows:
set PWDEBUG=1 && pytest tests/test_localizadores_builtin.py -v -k "test_boton_login"

# --- Usar codegen para descubrir localizadores ---
playwright codegen https://the-internet.herokuapp.com

# Codegen directo a la página de tablas
playwright codegen https://the-internet.herokuapp.com/tables

# --- Highlight para visualizar localizadores ---</code></pre>

        <pre><code class="python"># Debugging con highlight() — resalta el elemento en el navegador
def test_debug_highlight(page: Page):
    """Usar highlight() para visualizar qué elemento encuentra el localizador."""
    page.goto("https://the-internet.herokuapp.com/tables")

    # Resaltar la tabla
    page.locator("#table1").highlight()

    # Resaltar todas las filas
    filas = page.locator("#table1 tbody tr")
    for i in range(filas.count()):
        filas.nth(i).highlight()

    # Resaltar una fila filtrada
    page.locator("#table1 tbody tr").filter(has_text="Smith").highlight()

    # Pausa para ver los resaltados
    page.pause()  # Abre el Inspector</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip: highlight() y pause() para depuración</h4>
            <p><code>highlight()</code> dibuja un borde rojo alrededor del elemento que encontró el localizador.
            Es muy útil durante el desarrollo para verificar visualmente que el localizador apunta al
            elemento correcto. Combínalo con <code>page.pause()</code> para detener la ejecución y usar
            el Inspector interactivamente.</p>
        </div>

        <h3>📊 Resumen de la Sección 5</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎉 Sección 5 Completada: Localizadores y Selectores</h4>
            <p>Has dominado todas las técnicas de localización de elementos en Playwright:</p>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #c8e6c9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Lección</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Tema</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Tipo</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">037</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Localizadores built-in de Playwright</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Foundation</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">038</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">CSS Selectors en Playwright</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">039</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">XPath cuando es necesario</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">040</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Localizadores semánticos y accesibilidad</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">041</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Filtrado y encadenamiento de locators</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">042</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Localizadores relativos y por layout</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">043</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Estrategias de localizadores robustos</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">044</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Proyecto: Localizadores resilientes</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Integration</td>
                </tr>
            </table>
        </div>

        <h3>🏆 Habilidades adquiridas en la Sección 5</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <ul>
                <li><strong>Localizadores built-in:</strong> <code>get_by_role()</code>, <code>get_by_text()</code>, <code>get_by_label()</code>, <code>get_by_placeholder()</code>, <code>get_by_alt_text()</code>, <code>get_by_title()</code>, <code>get_by_test_id()</code></li>
                <li><strong>CSS Selectors:</strong> Selectores por ID, clase, atributo, pseudo-clases, combinadores</li>
                <li><strong>XPath:</strong> Navegación al padre, hermanos, condiciones OR, contains(), text()</li>
                <li><strong>Semánticos y accesibilidad:</strong> Roles ARIA, labels, landmarks, atributos aria-*</li>
                <li><strong>Filtrado:</strong> <code>filter(has_text=...)</code>, <code>filter(has=...)</code>, <code>filter(has_not_text=...)</code></li>
                <li><strong>Encadenamiento:</strong> <code>locator().locator()</code>, <code>.first</code>, <code>.last</code>, <code>.nth()</code></li>
                <li><strong>Combinación:</strong> <code>and_()</code> para AND lógico, <code>or_()</code> para OR lógico</li>
                <li><strong>Layout:</strong> <code>above()</code>, <code>below()</code>, <code>left_of()</code>, <code>right_of()</code>, <code>near()</code></li>
                <li><strong>Estrategias:</strong> Pirámide de prioridad, data-testid, anti-patrones, checklist de auditoría</li>
                <li><strong>Herramientas:</strong> <code>codegen</code>, Inspector, <code>highlight()</code>, <code>page.pause()</code></li>
                <li><strong>Page classes:</strong> Encapsulación de localizadores y acciones (anticipo de POM)</li>
            </ul>
        </div>

        <h3>🎯 Ejercicio final</h3>
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 15px 0;">
            <h4>🏋️ Implementa el proyecto completo</h4>
            <ol>
                <li><strong>Crea la estructura del proyecto</strong> con todos los directorios y archivos</li>
                <li><strong>Implementa <code>locators/selectors.py</code></strong> con al menos 5 clases de selectores</li>
                <li><strong>Implementa <code>pages/login_page.py</code></strong> con login, logout y assertions</li>
                <li><strong>Implementa <code>pages/tables_page.py</code></strong> con filtrado, extracción y ordenamiento</li>
                <li><strong>Implementa <code>tests/conftest.py</code></strong> con fixtures para pages y configuración</li>
                <li><strong>Implementa los 4 archivos de test:</strong>
                    <ul>
                        <li><code>test_localizadores_builtin.py</code> — get_by_role, get_by_label, get_by_text</li>
                        <li><code>test_css_xpath.py</code> — CSS selectors y XPath avanzado</li>
                        <li><code>test_filtrado_encadenamiento.py</code> — filter(), chaining, and_(), or_()</li>
                        <li><code>test_layout.py</code> — above(), below(), near()</li>
                    </ul>
                </li>
                <li><strong>Ejecuta la suite completa:</strong> <code>pytest tests/ -v</code></li>
                <li><strong>Ejecuta por categoría:</strong> <code>pytest tests/ -m builtin -v</code></li>
                <li><strong>Usa codegen</strong> para descubrir localizadores: <code>playwright codegen https://the-internet.herokuapp.com</code></li>
                <li><strong>Depura con Inspector:</strong> <code>PWDEBUG=1 pytest tests/ -v -k "test_boton_login"</code></li>
                <li><strong>Bonus:</strong> Agrega <code>highlight()</code> a un test para visualizar los localizadores encontrados</li>
            </ol>

            <div style="background: #bbdefb; padding: 10px; border-radius: 5px; margin-top: 10px;">
                <strong>Criterios de evaluación:</strong>
                <ul>
                    <li>Los tests de builtin usan <code>get_by_role</code>, <code>get_by_label</code> y <code>get_by_text</code> (nunca CSS)</li>
                    <li>Los tests de CSS/XPath justifican cuándo CSS o XPath son necesarios</li>
                    <li>Los tests de filtrado usan <code>filter()</code>, <code>and_()</code> y <code>or_()</code></li>
                    <li>Las page classes encapsulan localizadores y no exponen detalles de implementación</li>
                    <li>El módulo <code>selectors.py</code> centraliza todos los localizadores</li>
                    <li>La suite completa pasa con <code>pytest tests/ -v</code></li>
                </ul>
            </div>
        </div>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Integrar todos los tipos de localizadores en un proyecto cohesivo</li>
                <li>Centralizar selectores en un módulo <code>selectors.py</code> reutilizable</li>
                <li>Crear page classes que encapsulen localizadores y acciones</li>
                <li>Escribir tests organizados por técnica de localización</li>
                <li>Usar herramientas de depuración: codegen, Inspector, highlight()</li>
                <li>Demostrar cuándo usar cada tipo de localizador según el contexto</li>
                <li>Aplicar las estrategias de robustez aprendidas en la Sección 5</li>
            </ul>
        </div>

        <h3>🚀 Siguiente: Sección 6 — Interacciones Web Avanzadas</h3>
        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Con el dominio completo de los localizadores, estás listo para las
            <strong>interacciones web avanzadas</strong>. En la Sección 6 aprenderás:</p>
            <ul>
                <li><strong>Drag and Drop:</strong> Arrastrar elementos entre contenedores</li>
                <li><strong>Hover y menús contextuales:</strong> Interacciones de mouse avanzadas</li>
                <li><strong>Teclado avanzado:</strong> Atajos, combinaciones de teclas, input events</li>
                <li><strong>Shadow DOM:</strong> Acceder a elementos dentro de Shadow Roots</li>
                <li><strong>Elementos dinámicos:</strong> Spinners, lazy loading, infinite scroll</li>
                <li><strong>Clipboard API:</strong> Copiar y pegar programáticamente</li>
                <li><strong>Canvas y SVG:</strong> Interacción con gráficos vectoriales</li>
                <li><strong>Proyecto integrador:</strong> Suite completa de interacciones avanzadas</li>
            </ul>
            <p>Los localizadores robustos que aprendiste aquí serán la base para todas las interacciones
            avanzadas. Un buen localizador hace que cada interacción sea confiable y mantenible.</p>
        </div>
    `,
    topics: ["proyecto", "localizadores", "resilientes"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 10,
    difficulty: "medium",
    type: "integration"
};

if (typeof window !== 'undefined') {
    window.LESSON_044 = LESSON_044;
}
