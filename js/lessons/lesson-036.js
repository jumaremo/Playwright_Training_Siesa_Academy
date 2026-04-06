/**
 * Playwright Academy - Lección 036
 * Proyecto: Automatización formulario completo
 * Sección 4: Interacciones Web Fundamentales
 */

const LESSON_036 = {
    id: 36,
    title: "Proyecto: Automatización formulario completo",
    duration: "10 min",
    level: "beginner",
    section: "section-04",
    content: `
        <h2>🚀 Proyecto: Automatización formulario completo</h2>
        <p>En este proyecto integrador aplicarás <strong>todo lo aprendido en la Sección 4</strong>:
        formularios, botones, tablas, dropdowns, uploads/downloads, iframes, ventanas múltiples y diálogos.
        Construirás un test suite profesional completo con estructura modular, helpers reutilizables
        y datos de prueba externalizados.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎯 Objetivo del proyecto</h4>
            <p>Crear un framework de automatización que cubra las interacciones web fundamentales
            usando <code>https://the-internet.herokuapp.com</code> como aplicación bajo prueba.
            El proyecto incluye 3 archivos de test, un módulo de helpers, datos externos en JSON
            y un conftest.py profesional.</p>
        </div>

        <h3>🗂️ Paso 1: Estructura del proyecto</h3>
        <pre><code class="bash"># Crear la estructura completa
mkdir -p proyecto_seccion4/tests/screenshots
mkdir -p proyecto_seccion4/tests/downloads
mkdir -p proyecto_seccion4/helpers
mkdir -p proyecto_seccion4/data
mkdir -p proyecto_seccion4/uploads

# Crear archivos
touch proyecto_seccion4/tests/__init__.py
touch proyecto_seccion4/tests/conftest.py
touch proyecto_seccion4/tests/test_registro.py
touch proyecto_seccion4/tests/test_interacciones.py
touch proyecto_seccion4/tests/test_navegacion_avanzada.py
touch proyecto_seccion4/helpers/__init__.py
touch proyecto_seccion4/helpers/form_helpers.py
touch proyecto_seccion4/helpers/data_generators.py
touch proyecto_seccion4/data/usuarios.json
touch proyecto_seccion4/pytest.ini

# Crear un archivo de ejemplo para upload
echo "Archivo de prueba para upload" > proyecto_seccion4/uploads/test_upload.txt</code></pre>
        <pre><code>proyecto_seccion4/
├── pytest.ini                      # Configuración pytest
├── data/
│   └── usuarios.json               # Datos de prueba (JSON)
├── uploads/
│   └── test_upload.txt             # Archivo para pruebas de upload
├── helpers/
│   ├── __init__.py
│   ├── form_helpers.py             # Utilidades para formularios
│   └── data_generators.py          # Generadores de datos aleatorios
└── tests/
    ├── __init__.py
    ├── conftest.py                 # Fixtures y configuración global
    ├── test_registro.py            # Tests de registro y formularios
    ├── test_interacciones.py       # Tests de tablas, diálogos, iframes
    ├── test_navegacion_avanzada.py # Tests de multi-tab, links, botones
    ├── screenshots/                # Capturas de pantalla
    └── downloads/                  # Archivos descargados</code></pre>

        <h3>📄 Paso 2: Datos de prueba — data/usuarios.json</h3>
        <p>Externalizar los datos de prueba permite reutilizarlos y modificarlos sin tocar el código.</p>
        <pre><code class="python"># data/usuarios.json
{
    "usuario_valido": {
        "username": "tomsmith",
        "password": "SuperSecretPassword!",
        "nombre": "Tom Smith",
        "email": "tom@example.com"
    },
    "usuario_invalido": {
        "username": "usuario_falso",
        "password": "clave_incorrecta",
        "nombre": "Falso",
        "email": "falso@test.com"
    },
    "escenarios_dropdown": [
        {"label": "Option 1", "value": "1"},
        {"label": "Option 2", "value": "2"}
    ],
    "escenarios_checkboxes": [
        {"checkbox_index": 0, "estado_inicial": false, "accion": "check"},
        {"checkbox_index": 1, "estado_inicial": true, "accion": "uncheck"}
    ],
    "datos_prompt": [
        {"texto": "Playwright QA", "esperado": "You entered: Playwright QA"},
        {"texto": "Test Automatizado", "esperado": "You entered: Test Automatizado"},
        {"texto": "", "esperado": "You entered: "}
    ]
}</code></pre>

        <h3>⚙️ Paso 3: Configuración — pytest.ini</h3>
        <pre><code class="bash"># pytest.ini
[pytest]
markers =
    smoke: Tests de humo (críticos)
    regression: Tests de regresión
    formulario: Tests de formularios
    interaccion: Tests de interacciones web
    navegacion: Tests de navegación avanzada
    slow: Tests que requieren más tiempo

testpaths = tests
addopts = -v --tb=short</code></pre>

        <h3>🔧 Paso 4: conftest.py — Fixtures profesionales</h3>
        <pre><code class="python"># tests/conftest.py
"""
Configuración global del proyecto: fixtures, hooks y utilidades compartidas.
"""
import json
import os
import pytest
import logging
from pathlib import Path
from playwright.sync_api import Page, BrowserContext

# --- Logging ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger("seccion4")

# --- Rutas del proyecto ---
PROJECT_ROOT = Path(__file__).parent.parent
DATA_DIR = PROJECT_ROOT / "data"
UPLOADS_DIR = PROJECT_ROOT / "uploads"
SCREENSHOTS_DIR = PROJECT_ROOT / "tests" / "screenshots"
DOWNLOADS_DIR = PROJECT_ROOT / "tests" / "downloads"


# --- Fixture: datos de prueba desde JSON ---
@pytest.fixture(scope="session")
def datos_prueba():
    """Carga los datos de prueba desde el archivo JSON."""
    archivo = DATA_DIR / "usuarios.json"
    with open(archivo, "r", encoding="utf-8") as f:
        datos = json.load(f)
    logger.info(f"Datos cargados desde {archivo.name}")
    return datos


@pytest.fixture
def usuario_valido(datos_prueba):
    """Retorna los datos del usuario válido."""
    return datos_prueba["usuario_valido"]


@pytest.fixture
def usuario_invalido(datos_prueba):
    """Retorna los datos del usuario inválido."""
    return datos_prueba["usuario_invalido"]


# --- Fixture: configuración del navegador ---
@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "base_url": "https://the-internet.herokuapp.com",
        "viewport": {"width": 1280, "height": 720},
        "accept_downloads": True,  # Habilitar descargas
    }


# --- Fixture: configuración de página ---
@pytest.fixture(autouse=True)
def configurar_pagina(page: Page):
    """Configurar timeouts y estado inicial de cada test."""
    page.set_default_timeout(10000)
    page.set_default_navigation_timeout(15000)
    logger.info("Página configurada con timeouts")
    yield page


# --- Fixture: ruta de uploads ---
@pytest.fixture
def archivo_upload():
    """Retorna la ruta absoluta al archivo de prueba para upload."""
    ruta = UPLOADS_DIR / "test_upload.txt"
    assert ruta.exists(), f"Archivo de upload no encontrado: {ruta}"
    return str(ruta)


# --- Fixture: directorio de descargas ---
@pytest.fixture
def dir_descargas():
    """Retorna el directorio de descargas y lo crea si no existe."""
    DOWNLOADS_DIR.mkdir(parents=True, exist_ok=True)
    return DOWNLOADS_DIR


# --- Fixture: logging por test ---
@pytest.fixture(autouse=True)
def log_test(request):
    """Log de inicio y fin de cada test."""
    nombre = request.node.name
    logger.info(f"{'='*50}")
    logger.info(f"INICIO: {nombre}")
    yield
    logger.info(f"FIN: {nombre}")
    logger.info(f"{'='*50}")


# --- Fixture: screenshot al fallar ---
@pytest.fixture(autouse=True)
def screenshot_on_failure(page: Page, request):
    """Captura screenshot automático cuando un test falla."""
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

        <h3>🛠️ Paso 5: Helpers — form_helpers.py</h3>
        <pre><code class="python"># helpers/form_helpers.py
"""
Utilidades reutilizables para interacción con formularios.
"""
from playwright.sync_api import Page, Dialog
import logging

logger = logging.getLogger("helpers.form")


def llenar_login(page: Page, username: str, password: str):
    """Llena el formulario de login y hace submit."""
    logger.info(f"Llenando login con usuario: {username}")
    page.fill("#username", username)
    page.fill("#password", password)
    page.click("button[type='submit']")


def seleccionar_dropdown(page: Page, selector: str, label: str):
    """Selecciona una opción de dropdown por su label."""
    logger.info(f"Seleccionando '{label}' en {selector}")
    page.select_option(selector, label=label)


def marcar_checkbox(page: Page, locator_str: str, marcar: bool = True):
    """Marca o desmarca un checkbox según el parámetro."""
    checkbox = page.locator(locator_str)
    if marcar:
        checkbox.check()
        logger.info(f"Checkbox marcado: {locator_str}")
    else:
        checkbox.uncheck()
        logger.info(f"Checkbox desmarcado: {locator_str}")


def subir_archivo(page: Page, input_selector: str, ruta_archivo: str):
    """Sube un archivo a un input de tipo file."""
    logger.info(f"Subiendo archivo: {ruta_archivo}")
    page.set_input_files(input_selector, ruta_archivo)


def crear_handler_dialog(tipo_esperado: str, accion: str = "accept",
                          texto: str = None):
    """
    Crea un handler de diálogo reutilizable.

    Args:
        tipo_esperado: "alert", "confirm", "prompt"
        accion: "accept" o "dismiss"
        texto: texto para prompts (solo si accion == "accept")
    """
    def handler(dialog: Dialog):
        logger.info(f"Diálogo interceptado: tipo={dialog.type}, msg={dialog.message}")
        assert dialog.type == tipo_esperado, (
            f"Tipo esperado: {tipo_esperado}, recibido: {dialog.type}"
        )
        if accion == "accept":
            if texto is not None:
                dialog.accept(texto)
            else:
                dialog.accept()
        else:
            dialog.dismiss()

    return handler


def obtener_datos_tabla(page: Page, tabla_selector: str):
    """
    Extrae los datos de una tabla HTML como lista de diccionarios.

    Returns:
        Lista de dicts con los encabezados como claves.
    """
    headers = page.locator(f"{tabla_selector} thead th").all_text_contents()
    filas = page.locator(f"{tabla_selector} tbody tr")
    datos = []

    for i in range(filas.count()):
        celdas = filas.nth(i).locator("td").all_text_contents()
        fila_dict = dict(zip(headers, celdas))
        datos.append(fila_dict)

    logger.info(f"Tabla extraída: {len(datos)} filas, {len(headers)} columnas")
    return datos</code></pre>

        <h3>🎲 Paso 6: Helpers — data_generators.py</h3>
        <pre><code class="python"># helpers/data_generators.py
"""
Generadores de datos aleatorios para pruebas.
"""
import random
import string
from datetime import datetime


def generar_username(prefijo: str = "user") -> str:
    """Genera un username único con timestamp."""
    timestamp = datetime.now().strftime("%H%M%S")
    sufijo = ''.join(random.choices(string.ascii_lowercase, k=4))
    return f"{prefijo}_{timestamp}_{sufijo}"


def generar_email(dominio: str = "test.com") -> str:
    """Genera un email aleatorio."""
    nombre = ''.join(random.choices(string.ascii_lowercase, k=8))
    return f"{nombre}@{dominio}"


def generar_password(longitud: int = 12) -> str:
    """Genera una contraseña aleatoria con mayúsculas, minúsculas, números y símbolos."""
    caracteres = string.ascii_letters + string.digits + "!@#$%"
    password = [
        random.choice(string.ascii_uppercase),
        random.choice(string.ascii_lowercase),
        random.choice(string.digits),
        random.choice("!@#$%"),
    ]
    password += random.choices(caracteres, k=longitud - 4)
    random.shuffle(password)
    return ''.join(password)


def generar_texto(palabras: int = 5) -> str:
    """Genera texto aleatorio de N palabras."""
    vocabulario = [
        "prueba", "automatización", "playwright", "formulario",
        "calidad", "software", "testing", "validación",
        "integración", "verificación", "dato", "resultado"
    ]
    return ' '.join(random.choices(vocabulario, k=palabras))</code></pre>

        <h3>📝 Paso 7: test_registro.py — Formularios completos</h3>
        <p>Este archivo cubre: <code>fill</code>, <code>check</code>, <code>select_option</code>,
        <code>set_input_files</code>, radio buttons y validación de formularios.</p>
        <pre><code class="python"># tests/test_registro.py
"""
Tests de registro y formularios.
Cubre: fill, check, select, radio, file upload, validación.
"""
import pytest
from playwright.sync_api import Page, expect
from helpers.form_helpers import (
    llenar_login, seleccionar_dropdown, marcar_checkbox, subir_archivo
)
from helpers.data_generators import generar_username, generar_email


class TestLoginFormulario:
    """Tests del formulario de login."""

    @pytest.mark.smoke
    @pytest.mark.formulario
    def test_login_exitoso(self, page: Page, usuario_valido):
        """Login con credenciales válidas."""
        page.goto("/login")
        llenar_login(page, usuario_valido["username"], usuario_valido["password"])

        expect(page).to_have_url("**/secure")
        expect(page.locator("#flash")).to_contain_text("You logged into a secure area!")

    @pytest.mark.formulario
    def test_login_fallido(self, page: Page, usuario_invalido):
        """Login con credenciales inválidas muestra error."""
        page.goto("/login")
        llenar_login(page, usuario_invalido["username"], usuario_invalido["password"])

        expect(page.locator("#flash")).to_contain_text("Your username is invalid!")
        expect(page).to_have_url("**/login")

    @pytest.mark.formulario
    def test_login_password_incorrecto(self, page: Page, usuario_valido):
        """Login con usuario correcto pero password incorrecto."""
        page.goto("/login")
        llenar_login(page, usuario_valido["username"], "password_incorrecto")

        expect(page.locator("#flash")).to_contain_text("Your password is invalid!")

    @pytest.mark.formulario
    def test_logout(self, page: Page, usuario_valido):
        """Login exitoso seguido de logout."""
        page.goto("/login")
        llenar_login(page, usuario_valido["username"], usuario_valido["password"])
        expect(page).to_have_url("**/secure")

        page.click("a[href='/logout']")
        expect(page).to_have_url("**/login")
        expect(page.locator("#flash")).to_contain_text("You logged out of the secure area!")


class TestCheckboxes:
    """Tests de checkboxes."""

    @pytest.mark.formulario
    def test_estado_inicial_checkboxes(self, page: Page):
        """Verificar estado inicial de los checkboxes."""
        page.goto("/checkboxes")
        checkboxes = page.locator("#checkboxes input[type='checkbox']")

        # El primero está desmarcado, el segundo marcado
        expect(checkboxes.nth(0)).not_to_be_checked()
        expect(checkboxes.nth(1)).to_be_checked()

    @pytest.mark.formulario
    def test_marcar_checkbox(self, page: Page):
        """Marcar el primer checkbox y verificar."""
        page.goto("/checkboxes")
        primer_checkbox = page.locator("#checkboxes input[type='checkbox']").first

        marcar_checkbox(page, "#checkboxes input[type='checkbox']:first-of-type", True)
        expect(primer_checkbox).to_be_checked()

    @pytest.mark.formulario
    def test_desmarcar_checkbox(self, page: Page):
        """Desmarcar el segundo checkbox (que viene marcado)."""
        page.goto("/checkboxes")
        segundo_checkbox = page.locator("#checkboxes input[type='checkbox']").last

        marcar_checkbox(page, "#checkboxes input[type='checkbox']:last-of-type", False)
        expect(segundo_checkbox).not_to_be_checked()

    @pytest.mark.formulario
    def test_toggle_checkboxes(self, page: Page):
        """Toggle: invertir el estado de ambos checkboxes."""
        page.goto("/checkboxes")
        checkboxes = page.locator("#checkboxes input[type='checkbox']")

        # Invertir ambos
        checkboxes.nth(0).check()
        checkboxes.nth(1).uncheck()

        expect(checkboxes.nth(0)).to_be_checked()
        expect(checkboxes.nth(1)).not_to_be_checked()


class TestDropdown:
    """Tests de dropdown/select."""

    @pytest.mark.formulario
    @pytest.mark.parametrize("label,valor_esperado", [
        ("Option 1", "1"),
        ("Option 2", "2"),
    ])
    def test_seleccionar_opcion(self, page: Page, label, valor_esperado):
        """Test parametrizado: seleccionar cada opción del dropdown."""
        page.goto("/dropdown")
        seleccionar_dropdown(page, "#dropdown", label)
        expect(page.locator("#dropdown")).to_have_value(valor_esperado)

    @pytest.mark.formulario
    def test_dropdown_estado_inicial(self, page: Page):
        """Verificar que el dropdown inicia sin selección."""
        page.goto("/dropdown")
        opcion_default = page.locator("#dropdown option[selected]")
        expect(opcion_default).to_have_text("Please select an option")


class TestFileUpload:
    """Tests de subida de archivos."""

    @pytest.mark.formulario
    def test_upload_archivo(self, page: Page, archivo_upload):
        """Subir un archivo y verificar que se muestra."""
        page.goto("/upload")
        subir_archivo(page, "#file-upload", archivo_upload)
        page.click("#file-submit")

        expect(page.locator("#uploaded-files")).to_have_text("test_upload.txt")

    @pytest.mark.formulario
    def test_upload_sin_archivo(self, page: Page):
        """Intentar submit sin seleccionar archivo."""
        page.goto("/upload")
        page.click("#file-submit")

        expect(page.locator("h1")).to_have_text("Internal Server Error")</code></pre>

        <h3>🔗 Paso 8: test_interacciones.py — Tablas, diálogos e iframes</h3>
        <p>Este archivo cubre las interacciones más complejas: extracción de datos de tablas,
        manejo de diálogos y trabajo con iframes.</p>
        <pre><code class="python"># tests/test_interacciones.py
"""
Tests de interacciones web: tablas, diálogos, iframes, descargas.
"""
import pytest
from pathlib import Path
from playwright.sync_api import Page, Dialog, expect
from helpers.form_helpers import crear_handler_dialog, obtener_datos_tabla


class TestTablas:
    """Tests de extracción y verificación de tablas."""

    @pytest.mark.interaccion
    def test_tabla_tiene_datos(self, page: Page):
        """Verificar que la tabla tiene filas de datos."""
        page.goto("/tables")
        filas = page.locator("#table1 tbody tr")
        assert filas.count() > 0, "La tabla debería tener datos"

    @pytest.mark.interaccion
    def test_extraer_datos_tabla(self, page: Page):
        """Extraer todos los datos de la tabla como diccionarios."""
        page.goto("/tables")
        datos = obtener_datos_tabla(page, "#table1")

        assert len(datos) == 4, f"Se esperaban 4 filas, hay {len(datos)}"
        # Verificar que cada fila tiene las columnas esperadas
        for fila in datos:
            assert "Last Name" in fila
            assert "First Name" in fila
            assert "Email" in fila

    @pytest.mark.interaccion
    def test_buscar_en_tabla(self, page: Page):
        """Buscar un dato específico en la tabla."""
        page.goto("/tables")
        datos = obtener_datos_tabla(page, "#table1")

        # Buscar a "Smith"
        smiths = [f for f in datos if f["Last Name"] == "Smith"]
        assert len(smiths) == 1, "Debería haber exactamente un Smith"
        assert smiths[0]["First Name"] == "John"

    @pytest.mark.interaccion
    def test_ordenar_tabla(self, page: Page):
        """Verificar ordenamiento de tabla por columna."""
        page.goto("/tables")

        # Clic en header "Last Name" para ordenar
        page.click("#table1 thead th:first-child")

        # Verificar orden alfabético
        celdas = page.locator("#table1 tbody tr td:first-child")
        nombres = celdas.all_text_contents()
        assert nombres == sorted(nombres), (
            f"La tabla no está ordenada: {nombres}"
        )


class TestDialogos:
    """Tests de manejo de diálogos JavaScript."""

    URL_DIALOGS = "/javascript_alerts"

    @pytest.mark.interaccion
    def test_alert_aceptar(self, page: Page):
        """Aceptar un alert y verificar resultado."""
        handler = crear_handler_dialog("alert", "accept")
        page.on("dialog", handler)

        page.goto(self.URL_DIALOGS)
        page.click("button:text('Click for JS Alert')")

        expect(page.locator("#result")).to_have_text(
            "You successfully clicked an alert"
        )

    @pytest.mark.interaccion
    def test_confirm_aceptar(self, page: Page):
        """Aceptar un confirm y verificar resultado."""
        handler = crear_handler_dialog("confirm", "accept")
        page.on("dialog", handler)

        page.goto(self.URL_DIALOGS)
        page.click("button:text('Click for JS Confirm')")

        expect(page.locator("#result")).to_have_text("You clicked: Ok")

    @pytest.mark.interaccion
    def test_confirm_rechazar(self, page: Page):
        """Rechazar un confirm y verificar resultado."""
        handler = crear_handler_dialog("confirm", "dismiss")
        page.on("dialog", handler)

        page.goto(self.URL_DIALOGS)
        page.click("button:text('Click for JS Confirm')")

        expect(page.locator("#result")).to_have_text("You clicked: Cancel")

    @pytest.mark.interaccion
    def test_prompt_con_texto(self, page: Page):
        """Enviar texto a un prompt y verificar resultado."""
        texto = "Automatizado con Playwright"
        handler = crear_handler_dialog("prompt", "accept", texto)
        page.on("dialog", handler)

        page.goto(self.URL_DIALOGS)
        page.click("button:text('Click for JS Prompt')")

        expect(page.locator("#result")).to_have_text(
            f"You entered: {texto}"
        )

    @pytest.mark.interaccion
    def test_prompt_cancelar(self, page: Page):
        """Cancelar un prompt y verificar resultado null."""
        handler = crear_handler_dialog("prompt", "dismiss")
        page.on("dialog", handler)

        page.goto(self.URL_DIALOGS)
        page.click("button:text('Click for JS Prompt')")

        expect(page.locator("#result")).to_have_text("You entered: null")


class TestIframes:
    """Tests de interacción con iframes."""

    @pytest.mark.interaccion
    def test_escribir_en_iframe(self, page: Page):
        """Escribir texto dentro de un iframe (editor TinyMCE)."""
        page.goto("/tinymce")

        # Acceder al iframe
        frame = page.frame_locator("#mce_0_ifr")

        # Limpiar y escribir en el editor
        editor = frame.locator("#tinymce")
        editor.clear()
        editor.fill("Texto escrito desde Playwright")

        expect(editor).to_have_text("Texto escrito desde Playwright")

    @pytest.mark.interaccion
    def test_iframe_nested(self, page: Page):
        """Acceder a iframes anidados."""
        page.goto("/nested_frames")

        # Frame superior izquierdo
        frame_top = page.frame_locator("frame[name='frame-top']")
        frame_left = frame_top.frame_locator("frame[name='frame-left']")
        expect(frame_left.locator("body")).to_contain_text("LEFT")

        # Frame inferior
        frame_bottom = page.frame_locator("frame[name='frame-bottom']")
        expect(frame_bottom.locator("body")).to_contain_text("BOTTOM")


class TestDescargas:
    """Tests de descarga de archivos."""

    @pytest.mark.interaccion
    def test_descargar_archivo(self, page: Page, dir_descargas):
        """Descargar un archivo y verificar que se guardó."""
        page.goto("/download")

        # Esperar la descarga al hacer clic
        with page.expect_download() as download_info:
            page.click("a[href='download/some-file.txt']")

        download = download_info.value
        ruta_destino = dir_descargas / download.suggested_filename
        download.save_as(str(ruta_destino))

        assert ruta_destino.exists(), f"Archivo no descargado: {ruta_destino}"
        assert ruta_destino.stat().st_size > 0, "Archivo vacío"</code></pre>

        <h3>🧭 Paso 9: test_navegacion_avanzada.py — Multi-tab, links, botones</h3>
        <p>Este archivo cubre la navegación avanzada: abrir nuevas pestanas, manejar múltiples
        ventanas, interacciones con botones y verificación de links.</p>
        <pre><code class="python"># tests/test_navegacion_avanzada.py
"""
Tests de navegación avanzada: multi-tab, links, botones, ventanas.
"""
import pytest
from playwright.sync_api import Page, BrowserContext, expect


class TestMultiTab:
    """Tests de manejo de múltiples pestañas."""

    @pytest.mark.navegacion
    def test_abrir_nueva_pestana(self, page: Page, context: BrowserContext):
        """Abrir un link en nueva pestaña y verificar contenido."""
        page.goto("/windows")

        # Esperar nueva pestaña al hacer clic
        with context.expect_page() as new_page_info:
            page.click("a[href='/windows/new']")

        nueva_pagina = new_page_info.value
        nueva_pagina.wait_for_load_state()

        expect(nueva_pagina.locator("h3")).to_have_text("New Window")

        # Verificar que tenemos 2 páginas
        assert len(context.pages) == 2

        # Cerrar la nueva pestaña
        nueva_pagina.close()
        assert len(context.pages) == 1

    @pytest.mark.navegacion
    def test_interactuar_entre_pestanas(self, page: Page, context: BrowserContext):
        """Abrir nueva pestaña, interactuar y volver a la original."""
        page.goto("/windows")
        titulo_original = page.title()

        with context.expect_page() as new_page_info:
            page.click("a[href='/windows/new']")

        nueva_pagina = new_page_info.value
        nueva_pagina.wait_for_load_state()

        # Verificar la nueva pestaña
        expect(nueva_pagina.locator("h3")).to_have_text("New Window")

        # Volver a interactuar con la pestaña original
        page.bring_to_front()
        expect(page.locator("h3")).to_have_text("Opening a new window")

        nueva_pagina.close()


class TestLinks:
    """Tests de verificación de links y navegación."""

    @pytest.mark.navegacion
    def test_links_principales(self, page: Page):
        """Verificar que los links principales del sitio funcionan."""
        page.goto("/")
        links = page.locator("#content ul li a")
        total_links = links.count()
        assert total_links > 10, f"Se esperaban más de 10 links, hay {total_links}"

    @pytest.mark.navegacion
    @pytest.mark.parametrize("href,titulo_esperado", [
        ("/login", "Login Page"),
        ("/checkboxes", "Checkboxes"),
        ("/dropdown", "Dropdown List"),
        ("/inputs", "Inputs"),
        ("/tables", "Data Tables"),
    ])
    def test_navegar_a_subpaginas(self, page: Page, href, titulo_esperado):
        """Test parametrizado: navegar a cada subpágina y verificar título."""
        page.goto(href)
        expect(page.locator("h3").first).to_have_text(titulo_esperado)

    @pytest.mark.navegacion
    def test_navegacion_ida_y_vuelta(self, page: Page):
        """Navegar a subpágina, volver y verificar."""
        page.goto("/")
        page.click("a[href='/login']")
        expect(page).to_have_url("**/login")

        page.go_back()
        expect(page).to_have_url("**/")
        expect(page.locator("h1")).to_have_text("Welcome to the-internet")


class TestBotones:
    """Tests de interacciones con botones."""

    @pytest.mark.navegacion
    def test_boton_add_remove(self, page: Page):
        """Agregar y eliminar elementos con botones."""
        page.goto("/add_remove_elements/")

        # Agregar 3 elementos
        for _ in range(3):
            page.click("button:text('Add Element')")

        botones_delete = page.locator(".added-manually")
        expect(botones_delete).to_have_count(3)

        # Eliminar uno
        botones_delete.first.click()
        expect(page.locator(".added-manually")).to_have_count(2)

    @pytest.mark.navegacion
    def test_boton_dynamically_loaded(self, page: Page):
        """Esperar elemento que se carga dinámicamente."""
        page.goto("/dynamic_loading/1")
        page.click("#start button")

        # El elemento aparece después de una carga
        resultado = page.locator("#finish h4")
        expect(resultado).to_have_text("Hello World!", timeout=10000)

    @pytest.mark.navegacion
    def test_inputs_numericos(self, page: Page):
        """Interactuar con campos de input numérico."""
        page.goto("/inputs")
        campo = page.locator("input[type='number']")

        campo.fill("42")
        expect(campo).to_have_value("42")

        # Limpiar y escribir otro valor
        campo.fill("")
        campo.type("100")
        expect(campo).to_have_value("100")</code></pre>

        <h3>▶️ Paso 10: Ejecutar la suite completa</h3>
        <pre><code class="bash"># Ejecutar todos los tests
pytest tests/ -v

# Solo tests de formulario
pytest tests/ -m formulario -v

# Solo tests de interacciones
pytest tests/ -m interaccion -v

# Solo tests de navegación
pytest tests/ -m navegacion -v

# Smoke tests (los más críticos)
pytest tests/ -m smoke -v

# Excluir tests lentos
pytest tests/ -m "not slow" -v

# Con screenshots y videos automáticos
pytest tests/ -v --screenshot=only-on-failure --video=retain-on-failure --output=test-results/

# Con trace para debugging
pytest tests/ -v --tracing=retain-on-failure

# Ejecutar en paralelo (requiere pytest-xdist)
# pip install pytest-xdist
pytest tests/ -v -n auto

# Generar reporte
pytest tests/ -v --tb=short --junitxml=report.xml</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip: Orden de ejecución recomendado</h4>
            <ol>
                <li>Primero ejecuta solo <code>pytest tests/ -m smoke -v</code> para validar lo básico</li>
                <li>Luego <code>pytest tests/ -m formulario -v</code> para validar formularios</li>
                <li>Después <code>pytest tests/ -m interaccion -v</code> para tablas, diálogos e iframes</li>
                <li>Finalmente <code>pytest tests/ -v</code> para la suite completa</li>
            </ol>
        </div>

        <h3>📊 Resumen de la Sección 4</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎉 Seccion 4 Completada: Interacciones Web Fundamentales</h4>
            <p>Has dominado todas las interacciones web fundamentales con Playwright:</p>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #c8e6c9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Leccion</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Tema</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Tipo</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">029</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Formularios: fill, check, select</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Foundation</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">030</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Botones, links y navegacion</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">031</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Tablas y listas HTML</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">032</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Dropdowns y componentes UI</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">033</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Uploads y downloads de archivos</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">034</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Iframes y ventanas multiples</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">035</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Dialogs: alert, confirm, prompt</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">036</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Proyecto: Automatizacion formulario completo</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Integration</td>
                </tr>
            </table>
        </div>

        <h3>🏆 Habilidades adquiridas en la Seccion 4</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <ul>
                <li><strong>Formularios:</strong> <code>fill()</code>, <code>check()</code>, <code>uncheck()</code>, <code>select_option()</code>, radio buttons</li>
                <li><strong>Botones y links:</strong> <code>click()</code>, <code>dblclick()</code>, navegacion con <code>go_back()</code>, <code>go_forward()</code></li>
                <li><strong>Tablas:</strong> Extraer datos, verificar contenido, ordenamiento de columnas</li>
                <li><strong>Dropdowns:</strong> Seleccion por label, value e index; componentes UI custom</li>
                <li><strong>Archivos:</strong> <code>set_input_files()</code> para uploads, <code>expect_download()</code> para descargas</li>
                <li><strong>Iframes:</strong> <code>frame_locator()</code>, iframes anidados, comunicacion entre frames</li>
                <li><strong>Ventanas:</strong> <code>context.expect_page()</code>, multi-tab, <code>bring_to_front()</code></li>
                <li><strong>Dialogos:</strong> <code>page.on("dialog")</code>, <code>accept()</code>, <code>dismiss()</code>, manejo de prompts</li>
                <li><strong>Helpers:</strong> Modulos reutilizables, generadores de datos, fixtures profesionales</li>
                <li><strong>Data-driven:</strong> Datos externalizados en JSON, tests parametrizados</li>
            </ul>
        </div>

        <h3>🎯 Ejercicio final</h3>
        <ol>
            <li>Crea la estructura completa del proyecto como se muestra en el Paso 1</li>
            <li>Implementa <code>data/usuarios.json</code> con al menos 2 usuarios y datos de dropdown</li>
            <li>Implementa <code>helpers/form_helpers.py</code> con las funciones mostradas</li>
            <li>Implementa <code>helpers/data_generators.py</code> con los generadores</li>
            <li>Implementa <code>tests/conftest.py</code> con todas las fixtures</li>
            <li>Implementa los 3 archivos de test:
                <ul>
                    <li><code>test_registro.py</code> — formularios, login, checkboxes, dropdown, uploads</li>
                    <li><code>test_interacciones.py</code> — tablas, dialogos, iframes, descargas</li>
                    <li><code>test_navegacion_avanzada.py</code> — multi-tab, links, botones</li>
                </ul>
            </li>
            <li>Ejecuta: <code>pytest tests/ -m smoke -v</code> (primero los criticos)</li>
            <li>Ejecuta: <code>pytest tests/ -v --screenshot=only-on-failure</code> (suite completa)</li>
            <li><strong>Bonus:</strong> Agrega un test parametrizado con datos del JSON para los prompts</li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta leccion:</h4>
            <ul>
                <li>Integrar todos los conceptos de la Seccion 4 en un proyecto real</li>
                <li>Crear una estructura de proyecto modular y mantenible</li>
                <li>Implementar helpers reutilizables para formularios y datos</li>
                <li>Usar datos de prueba externalizados en JSON</li>
                <li>Organizar tests en clases con marcadores especificos</li>
                <li>Ejecutar la suite con diferentes filtros y configuraciones</li>
            </ul>
        </div>

        <h3>🚀 Siguiente: Seccion 5 — Localizadores y Selectores</h3>
        <p>En la siguiente seccion dominaras los <strong>localizadores de Playwright</strong>:
        localizadores built-in, CSS selectors, XPath, localizadores semanticos y de accesibilidad,
        filtrado y encadenamiento, localizadores relativos y estrategias para crear selectores
        robustos y mantenibles. Es una seccion fundamental para escribir tests que no se rompan
        con cambios menores en la UI.</p>
    `,
    topics: ["proyecto", "formulario", "integración"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 10,
    difficulty: "medium",
    type: "integration"
};

if (typeof window !== 'undefined') {
    window.LESSON_036 = LESSON_036;
}
