/**
 * Playwright Academy - Lección 028
 * Proyecto: Config multi-ambiente
 * Sección 3: Python para Testers QA
 */

const LESSON_028 = {
    id: 28,
    title: "Proyecto: Config multi-ambiente",
    duration: "10 min",
    level: "beginner",
    section: "section-03",
    content: `
        <h2>🚀 Proyecto integrador: Config multi-ambiente</h2>
        <p>En esta lección final de la Sección 3, vas a construir un <strong>sistema completo
        de configuración multi-ambiente</strong> para tus tests de Playwright. Este es un patrón
        profesional usado en equipos de QA reales para ejecutar la misma suite de tests
        contra desarrollo, staging y producción.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #1976d2;">
            <strong>🎯 Objetivo del proyecto:</strong> Crear un mini-framework que permita
            ejecutar tests con <code>pytest --env=staging</code> y que automáticamente
            cargue la configuración correcta, urls, credenciales y datos de prueba
            del ambiente seleccionado.
        </div>

        <h3>🗂️ Paso 1: Estructura del proyecto</h3>
        <p>Vamos a crear una estructura profesional que separa configuración, utilidades y tests:</p>
        <pre><code class="bash"># Crear toda la estructura del proyecto
mkdir -p proyecto_multiambiente/{config,utils,tests,data}
cd proyecto_multiambiente

# Archivos de configuración por ambiente
touch config/__init__.py
touch config/settings.py
touch config/dev.env
touch config/staging.env
touch config/prod.env

# Utilidades reutilizables
touch utils/__init__.py
touch utils/data_loader.py
touch utils/exceptions.py
touch utils/logger.py

# Tests y fixtures
touch tests/__init__.py
touch tests/conftest.py
touch tests/test_login.py
touch tests/test_navegacion.py

# Datos de prueba
touch data/usuarios_dev.json
touch data/usuarios_staging.json
touch data/rutas.csv

# Archivos raíz
touch pytest.ini
touch requirements.txt</code></pre>
        <pre><code>proyecto_multiambiente/
├── config/
│   ├── __init__.py
│   ├── settings.py          # Módulo de configuración (dataclass)
│   ├── dev.env              # Variables de desarrollo
│   ├── staging.env          # Variables de staging
│   └── prod.env             # Variables de producción
├── utils/
│   ├── __init__.py
│   ├── data_loader.py       # Cargadores de datos (JSON, CSV)
│   ├── exceptions.py        # Excepciones personalizadas
│   └── logger.py            # Configuración de logging
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Fixtures globales con config
│   ├── test_login.py        # Tests de login multi-ambiente
│   └── test_navegacion.py   # Tests de navegación
├── data/
│   ├── usuarios_dev.json    # Datos de prueba para dev
│   ├── usuarios_staging.json
│   └── rutas.csv            # Rutas a verificar
├── pytest.ini               # Configuración de pytest
└── requirements.txt         # Dependencias</code></pre>

        <h3>📄 Paso 2: Archivos de configuración por ambiente</h3>
        <p>Cada archivo <code>.env</code> contiene las variables específicas de un ambiente.
        Usamos un formato simple <code>CLAVE=valor</code>:</p>
        <pre><code class="bash"># config/dev.env
BASE_URL=http://localhost:3000
APP_NAME=MiApp (Desarrollo)
BROWSER=chromium
HEADLESS=false
TIMEOUT=30000
NAV_TIMEOUT=15000
ADMIN_USER=admin_dev
ADMIN_PASS=dev123
DB_HOST=localhost
DB_NAME=app_dev
LOG_LEVEL=DEBUG
SCREENSHOT_ON_FAILURE=true
VIDEO_RECORDING=true</code></pre>
        <pre><code class="bash"># config/staging.env
BASE_URL=https://staging.miapp.com
APP_NAME=MiApp (Staging)
BROWSER=chromium
HEADLESS=true
TIMEOUT=15000
NAV_TIMEOUT=10000
ADMIN_USER=admin_staging
ADMIN_PASS=staging_secreto_456
DB_HOST=staging-db.miapp.com
DB_NAME=app_staging
LOG_LEVEL=INFO
SCREENSHOT_ON_FAILURE=true
VIDEO_RECORDING=false</code></pre>
        <pre><code class="bash"># config/prod.env
BASE_URL=https://www.miapp.com
APP_NAME=MiApp (Producción)
BROWSER=chromium
HEADLESS=true
TIMEOUT=10000
NAV_TIMEOUT=8000
ADMIN_USER=admin_prod
ADMIN_PASS=prod_ultra_secreto_789
DB_HOST=prod-db.miapp.com
DB_NAME=app_prod
LOG_LEVEL=WARNING
SCREENSHOT_ON_FAILURE=true
VIDEO_RECORDING=false</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ff9800;">
            <strong>🔐 Seguridad:</strong> En un proyecto real, los archivos <code>.env</code>
            con credenciales <strong>nunca</strong> se suben al repositorio. Agrega <code>*.env</code>
            a <code>.gitignore</code>. Para CI/CD, usa variables de entorno del sistema o
            gestores de secretos (AWS Secrets Manager, Azure Key Vault, etc.).
        </div>

        <h3>⚙️ Paso 3: Módulo de configuración con dataclasses</h3>
        <p>El corazón del sistema: un módulo Python que lee el <code>.env</code> correcto
        y expone la configuración como un objeto tipado:</p>
        <pre><code class="python"># config/settings.py
"""
Módulo de configuración multi-ambiente.
Lee archivos .env y expone Settings como dataclass tipada.
"""
import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional


@dataclass
class Settings:
    """Configuración tipada del ambiente de testing."""

    # Ambiente
    env_name: str = "dev"

    # Aplicación
    base_url: str = "http://localhost:3000"
    app_name: str = "MiApp"

    # Browser
    browser: str = "chromium"
    headless: bool = False

    # Timeouts (en milisegundos)
    timeout: int = 30000
    nav_timeout: int = 15000

    # Credenciales
    admin_user: str = ""
    admin_pass: str = ""

    # Base de datos
    db_host: str = "localhost"
    db_name: str = "app_dev"

    # Logging y evidencias
    log_level: str = "DEBUG"
    screenshot_on_failure: bool = True
    video_recording: bool = False

    @property
    def is_production(self) -> bool:
        """Indica si estamos en producción (para precauciones extra)."""
        return self.env_name == "prod"

    @property
    def is_headless(self) -> bool:
        """Devuelve si el browser debe ejecutarse sin interfaz."""
        return self.headless

    def __str__(self) -> str:
        return (
            f"Settings(env={self.env_name}, "
            f"url={self.base_url}, "
            f"browser={self.browser}, "
            f"headless={self.headless})"
        )


def _parse_env_file(filepath: Path) -> dict:
    """
    Lee un archivo .env y devuelve un diccionario clave-valor.
    Ignora líneas vacías y comentarios (#).
    """
    variables = {}
    if not filepath.exists():
        raise FileNotFoundError(
            f"Archivo de configuración no encontrado: {filepath}"
        )

    with open(filepath, "r", encoding="utf-8") as f:
        for linea in f:
            linea = linea.strip()
            # Ignorar vacías y comentarios
            if not linea or linea.startswith("#"):
                continue
            if "=" not in linea:
                continue

            clave, valor = linea.split("=", 1)
            variables[clave.strip()] = valor.strip()

    return variables


def _str_to_bool(valor: str) -> bool:
    """Convierte string a booleano."""
    return valor.lower() in ("true", "1", "yes", "si", "sí")


def cargar_settings(env_name: str = "dev") -> Settings:
    """
    Carga la configuración del ambiente especificado.

    Args:
        env_name: Nombre del ambiente ('dev', 'staging', 'prod')

    Returns:
        Settings con la configuración del ambiente

    Raises:
        FileNotFoundError: Si no existe el archivo .env
        ValueError: Si el ambiente no es válido
    """
    ambientes_validos = ["dev", "staging", "prod"]
    if env_name not in ambientes_validos:
        raise ValueError(
            f"Ambiente '{env_name}' no válido. "
            f"Opciones: {', '.join(ambientes_validos)}"
        )

    # Buscar el archivo .env relativo al directorio config/
    config_dir = Path(__file__).parent
    env_file = config_dir / f"{env_name}.env"
    variables = _parse_env_file(env_file)

    return Settings(
        env_name=env_name,
        base_url=variables.get("BASE_URL", "http://localhost:3000"),
        app_name=variables.get("APP_NAME", "MiApp"),
        browser=variables.get("BROWSER", "chromium"),
        headless=_str_to_bool(variables.get("HEADLESS", "false")),
        timeout=int(variables.get("TIMEOUT", "30000")),
        nav_timeout=int(variables.get("NAV_TIMEOUT", "15000")),
        admin_user=variables.get("ADMIN_USER", ""),
        admin_pass=variables.get("ADMIN_PASS", ""),
        db_host=variables.get("DB_HOST", "localhost"),
        db_name=variables.get("DB_NAME", "app_dev"),
        log_level=variables.get("LOG_LEVEL", "DEBUG"),
        screenshot_on_failure=_str_to_bool(
            variables.get("SCREENSHOT_ON_FAILURE", "true")
        ),
        video_recording=_str_to_bool(
            variables.get("VIDEO_RECORDING", "false")
        ),
    )</code></pre>

        <h3>🚨 Paso 4: Excepciones personalizadas</h3>
        <pre><code class="python"># utils/exceptions.py
"""Excepciones personalizadas del framework multi-ambiente."""


class FrameworkError(Exception):
    """Excepción base del framework."""
    pass


class ConfigurationError(FrameworkError):
    """Error en la configuración del ambiente."""
    def __init__(self, parametro: str, mensaje: str = ""):
        self.parametro = parametro
        super().__init__(
            f"Error de configuración '{parametro}': {mensaje}"
        )


class EnvironmentNotAvailableError(FrameworkError):
    """El ambiente de testing no responde."""
    def __init__(self, env_name: str, url: str, detalle: str = ""):
        self.env_name = env_name
        self.url = url
        msg = f"Ambiente '{env_name}' no disponible en {url}"
        if detalle:
            msg += f" - {detalle}"
        super().__init__(msg)


class TestDataError(FrameworkError):
    """Error al cargar datos de prueba."""
    def __init__(self, archivo: str, motivo: str = ""):
        self.archivo = archivo
        super().__init__(
            f"Error al cargar datos desde '{archivo}': {motivo}"
        )


class PageLoadError(FrameworkError):
    """La página no cargó correctamente."""
    def __init__(self, url: str, status_code: int = None):
        self.url = url
        self.status_code = status_code
        msg = f"Error al cargar página '{url}'"
        if status_code:
            msg += f" (HTTP {status_code})"
        super().__init__(msg)</code></pre>

        <h3>📊 Paso 5: Cargadores de datos</h3>
        <p>Utilidades para leer datos de prueba desde archivos JSON y CSV:</p>
        <pre><code class="python"># utils/data_loader.py
"""Utilidades para cargar datos de prueba desde archivos."""
import json
import csv
from pathlib import Path
from typing import Any
from utils.exceptions import TestDataError


def cargar_json(ruta: str) -> Any:
    """
    Carga datos desde un archivo JSON.

    Args:
        ruta: Ruta al archivo JSON

    Returns:
        Datos deserializados (dict, list, etc.)

    Raises:
        TestDataError: Si el archivo no existe o tiene formato inválido
    """
    filepath = Path(ruta)
    if not filepath.exists():
        raise TestDataError(ruta, "archivo no encontrado")

    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        raise TestDataError(ruta, f"JSON inválido: {e}") from e


def cargar_csv(ruta: str, como_dict: bool = True) -> list:
    """
    Carga datos desde un archivo CSV.

    Args:
        ruta: Ruta al archivo CSV
        como_dict: Si True, devuelve lista de diccionarios;
                   si False, lista de listas

    Returns:
        Lista de filas del CSV

    Raises:
        TestDataError: Si el archivo no existe o está vacío
    """
    filepath = Path(ruta)
    if not filepath.exists():
        raise TestDataError(ruta, "archivo no encontrado")

    try:
        with open(filepath, "r", encoding="utf-8") as f:
            if como_dict:
                reader = csv.DictReader(f)
            else:
                reader = csv.reader(f)
            datos = list(reader)

        if not datos:
            raise TestDataError(ruta, "archivo CSV vacío")

        return datos
    except csv.Error as e:
        raise TestDataError(ruta, f"error al parsear CSV: {e}") from e


def cargar_usuarios(env_name: str) -> list:
    """
    Carga usuarios de prueba para un ambiente específico.

    Args:
        env_name: Nombre del ambiente ('dev', 'staging', 'prod')

    Returns:
        Lista de diccionarios con datos de usuarios
    """
    data_dir = Path(__file__).parent.parent / "data"
    archivo = data_dir / f"usuarios_{env_name}.json"
    return cargar_json(str(archivo))</code></pre>

        <h3>📝 Paso 6: Configuración de logging</h3>
        <pre><code class="python"># utils/logger.py
"""Configuración centralizada de logging para el framework."""
import logging
import sys
from pathlib import Path
from datetime import datetime


def configurar_logger(
    nombre: str = "framework",
    nivel: str = "DEBUG",
    log_dir: str = "logs"
) -> logging.Logger:
    """
    Configura y devuelve un logger con salida a consola y archivo.

    Args:
        nombre: Nombre del logger
        nivel: Nivel de logging (DEBUG, INFO, WARNING, ERROR)
        log_dir: Directorio para archivos de log

    Returns:
        Logger configurado
    """
    logger = logging.getLogger(nombre)
    logger.setLevel(getattr(logging, nivel.upper(), logging.DEBUG))

    # Evitar handlers duplicados
    if logger.handlers:
        return logger

    # Formato del log
    formato = logging.Formatter(
        fmt="%(asctime)s [%(levelname)-8s] %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    # Handler de consola
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formato)
    logger.addHandler(console_handler)

    # Handler de archivo
    Path(log_dir).mkdir(exist_ok=True)
    fecha = datetime.now().strftime("%Y%m%d")
    file_handler = logging.FileHandler(
        f"{log_dir}/tests_{fecha}.log",
        encoding="utf-8"
    )
    file_handler.setFormatter(formato)
    logger.addHandler(file_handler)

    return logger</code></pre>

        <h3>🧪 Paso 7: conftest.py - El corazón de la integración</h3>
        <p>Aquí se conecta todo: la opción <code>--env</code>, la carga de settings,
        fixtures para Playwright y el logger:</p>
        <pre><code class="python"># tests/conftest.py
"""
Configuración central de tests con soporte multi-ambiente.
Uso: pytest tests/ --env=staging -v
"""
import pytest
from playwright.sync_api import Page

from config.settings import cargar_settings, Settings
from utils.exceptions import (
    EnvironmentNotAvailableError,
    ConfigurationError
)
from utils.data_loader import cargar_usuarios
from utils.logger import configurar_logger


# =====================================================
# OPCIÓN DE LÍNEA DE COMANDOS: --env
# =====================================================

def pytest_addoption(parser):
    """Agrega la opción --env a pytest."""
    parser.addoption(
        "--env",
        action="store",
        default="dev",
        choices=["dev", "staging", "prod"],
        help="Ambiente de ejecución: dev, staging, prod"
    )


# =====================================================
# FIXTURES DE CONFIGURACIÓN
# =====================================================

@pytest.fixture(scope="session")
def env_name(request) -> str:
    """Nombre del ambiente desde la línea de comandos."""
    return request.config.getoption("--env")


@pytest.fixture(scope="session")
def settings(env_name) -> Settings:
    """
    Configuración del ambiente actual.
    Se carga una sola vez por sesión de tests.
    """
    logger = configurar_logger("setup")
    logger.info(f"Cargando configuración para ambiente: {env_name}")

    try:
        config = cargar_settings(env_name)
    except (FileNotFoundError, ValueError) as e:
        raise ConfigurationError(
            "env", f"No se pudo cargar ambiente '{env_name}': {e}"
        )

    logger.info(f"Configuración cargada: {config}")

    # Advertencia para producción
    if config.is_production:
        logger.warning(
            "⚠️ EJECUTANDO TESTS EN PRODUCCIÓN - "
            "Solo tests de lectura permitidos"
        )

    return config


@pytest.fixture(scope="session")
def logger(settings):
    """Logger configurado según el nivel del ambiente."""
    return configurar_logger(
        nombre="tests",
        nivel=settings.log_level
    )


# =====================================================
# FIXTURES DE PLAYWRIGHT
# =====================================================

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args, settings):
    """Configura el contexto del browser según el ambiente."""
    args = {
        **browser_context_args,
        "base_url": settings.base_url,
        "viewport": {"width": 1280, "height": 720},
    }
    if settings.video_recording:
        args["record_video_dir"] = "test-results/videos/"
    return args


@pytest.fixture(autouse=True)
def configurar_timeouts(page: Page, settings):
    """Aplica timeouts del ambiente a cada página."""
    page.set_default_timeout(settings.timeout)
    page.set_default_navigation_timeout(settings.nav_timeout)
    yield page


@pytest.fixture(autouse=True)
def log_test(request, logger, settings):
    """Registra inicio/fin de cada test con logging."""
    test_name = request.node.name
    logger.info(
        f"▶ INICIO: {test_name} "
        f"[{settings.env_name.upper()}]"
    )
    yield
    logger.info(f"◼ FIN: {test_name}")


@pytest.fixture(autouse=True)
def screenshot_on_failure(page: Page, request, settings):
    """Captura screenshot automáticamente si el test falla."""
    yield
    if settings.screenshot_on_failure:
        if hasattr(request.node, "rep_call") and request.node.rep_call.failed:
            nombre = f"FAIL_{settings.env_name}_{request.node.name}"
            page.screenshot(path=f"test-results/screenshots/{nombre}.png")


@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Hook para detectar fallos en tests."""
    outcome = yield
    rep = outcome.get_result()
    setattr(item, f"rep_{rep.when}", rep)


# =====================================================
# FIXTURES DE DATOS DE PRUEBA
# =====================================================

@pytest.fixture(scope="session")
def usuarios(env_name):
    """Carga usuarios de prueba para el ambiente actual."""
    return cargar_usuarios(env_name)


@pytest.fixture
def admin_user(settings) -> dict:
    """Devuelve credenciales del admin del ambiente."""
    return {
        "username": settings.admin_user,
        "password": settings.admin_pass
    }</code></pre>

        <h3>📂 Paso 8: Datos de prueba por ambiente</h3>
        <pre><code class="python"># data/usuarios_dev.json
[
    {
        "username": "tester_dev_01",
        "password": "Test1234!",
        "rol": "tester",
        "nombre": "Ana García"
    },
    {
        "username": "tester_dev_02",
        "password": "Test5678!",
        "rol": "viewer",
        "nombre": "Carlos López"
    }
]

# data/usuarios_staging.json
[
    {
        "username": "tester_stg_01",
        "password": "Staging1234!",
        "rol": "tester",
        "nombre": "María Rodríguez"
    },
    {
        "username": "tester_stg_02",
        "password": "Staging5678!",
        "rol": "viewer",
        "nombre": "Juan Pérez"
    }
]</code></pre>
        <pre><code class="bash"># data/rutas.csv
ruta,titulo_esperado,requiere_auth
/,Welcome,false
/login,Login Page,false
/secure,Secure Area,true
/checkboxes,Checkboxes,false
/dropdown,Dropdown List,false</code></pre>

        <h3>✅ Paso 9: Tests que usan el sistema de configuración</h3>
        <pre><code class="python"># tests/test_login.py
"""
Tests de login que funcionan en cualquier ambiente.
Uso: pytest tests/test_login.py --env=staging -v
"""
import pytest
from playwright.sync_api import Page, expect


class TestLogin:
    """Tests de login multi-ambiente."""

    def test_pagina_login_carga(self, page: Page, settings, logger):
        """Verificar que la página de login carga en el ambiente."""
        page.goto("/login")
        logger.info(
            f"Navegando a {settings.base_url}/login"
        )
        expect(page.locator("h2")).to_be_visible()

    def test_login_admin_exitoso(
        self, page: Page, admin_user, settings, logger
    ):
        """Login con credenciales de admin del ambiente actual."""
        page.goto("/login")
        page.fill("#username", admin_user["username"])
        page.fill("#password", admin_user["password"])
        page.click("button[type='submit']")

        logger.info(
            f"Login como {admin_user['username']} "
            f"en {settings.env_name}"
        )

        # Verificar login exitoso
        expect(page).to_have_url("**/secure")

    def test_login_fallido_muestra_error(self, page: Page, logger):
        """Credenciales inválidas deben mostrar mensaje de error."""
        page.goto("/login")
        page.fill("#username", "usuario_invalido")
        page.fill("#password", "clave_incorrecta")
        page.click("button[type='submit']")

        error_msg = page.locator("#flash")
        expect(error_msg).to_be_visible()
        logger.info("Error de login mostrado correctamente")

    @pytest.mark.parametrize("usuario", [
        {"user": "", "pass": "algo"},
        {"user": "algo", "pass": ""},
    ])
    def test_login_campos_vacios(
        self, page: Page, usuario, logger
    ):
        """Verificar comportamiento con campos vacíos."""
        page.goto("/login")
        page.fill("#username", usuario["user"])
        page.fill("#password", usuario["pass"])
        page.click("button[type='submit']")

        # Debe mostrar error, no redirigir a /secure
        expect(page).not_to_have_url("**/secure")
        logger.info(
            f"Campos vacíos manejados: user='{usuario['user']}'"
        )</code></pre>

        <pre><code class="python"># tests/test_navegacion.py
"""
Tests de navegación multi-ambiente.
Verifica que las rutas principales funcionen.
"""
import pytest
from playwright.sync_api import Page, expect
from utils.data_loader import cargar_csv


class TestNavegacion:
    """Tests de navegación usando datos del CSV."""

    @pytest.fixture
    def rutas_publicas(self):
        """Carga rutas que no requieren autenticación."""
        todas = cargar_csv("data/rutas.csv")
        return [r for r in todas if r["requiere_auth"] == "false"]

    def test_pagina_principal(
        self, page: Page, settings, logger
    ):
        """La página principal del ambiente debe cargar."""
        page.goto("/")
        logger.info(
            f"Verificando página principal: {settings.base_url}"
        )
        expect(page.locator("h1")).to_be_visible()

    def test_rutas_publicas_accesibles(
        self, page: Page, rutas_publicas, logger
    ):
        """Todas las rutas públicas deben ser accesibles."""
        for ruta in rutas_publicas:
            page.goto(ruta["ruta"])
            # Verificar que no hay error 404/500
            contenido = page.content()
            assert "404" not in page.title(), (
                f"Ruta {ruta['ruta']} devolvió 404"
            )
            logger.info(f"✓ Ruta accesible: {ruta['ruta']}")

    def test_navegacion_ida_y_vuelta(
        self, page: Page, settings, logger
    ):
        """Navegar a una subpágina y volver al inicio."""
        page.goto("/")
        page.click("a[href='/login']")
        expect(page).to_have_url("**/login")

        page.go_back()
        expect(page).to_have_url(f"{settings.base_url}/")
        logger.info("Navegación ida y vuelta correcta")

    @pytest.mark.skipif(
        "config.getoption('--env') == 'prod'",
        reason="Test destructivo: no ejecutar en producción"
    )
    def test_accion_destructiva_solo_dev(
        self, page: Page, settings, logger
    ):
        """
        Este test solo se ejecuta en dev y staging.
        En producción se omite automáticamente.
        """
        logger.info(
            f"Ejecutando test destructivo en "
            f"{settings.env_name}"
        )
        page.goto("/")
        # ... acciones que modifican datos ...</code></pre>

        <h3>🔧 Paso 10: Configuración de pytest</h3>
        <pre><code class="ini"># pytest.ini
[pytest]
# Marcadores registrados
markers =
    smoke: Tests de humo (rápidos, críticos)
    regression: Tests de regresión completa
    destructive: Tests que modifican datos (no ejecutar en prod)

# Directorio de tests
testpaths = tests

# Output por defecto
addopts =
    -v
    --tb=short
    --strict-markers

# Logs
log_cli = true
log_cli_level = INFO
log_cli_format = %(asctime)s [%(levelname)s] %(message)s
log_cli_date_format = %H:%M:%S</code></pre>

        <pre><code class="text"># requirements.txt
playwright==1.42.0
pytest==8.1.1
pytest-playwright==0.4.4
python-dotenv==1.0.1</code></pre>

        <h3>▶️ Paso 11: Ejecutar tests por ambiente</h3>
        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🖥️ Comandos de ejecución:</h4>
            <pre><code class="bash"># Ejecutar en desarrollo (default)
pytest tests/ -v
pytest tests/ --env=dev -v

# Ejecutar en staging
pytest tests/ --env=staging -v

# Ejecutar en producción (solo smoke, sin destructivos)
pytest tests/ --env=prod -m "smoke and not destructive" -v

# Ejecutar un archivo específico en staging
pytest tests/test_login.py --env=staging -v

# Con screenshots y reporte
pytest tests/ --env=staging -v \\
    --screenshot=only-on-failure \\
    --output=test-results/

# Con trace para debugging
pytest tests/ --env=dev -v --tracing=retain-on-failure

# Ejecución paralela (requiere pytest-xdist)
pytest tests/ --env=staging -v -n 4</code></pre>
        </div>

        <pre><code class="bash"># Ejemplo de salida en consola
$ pytest tests/ --env=staging -v

======================== test session starts ========================
platform linux -- Python 3.11.0, pytest-8.1.1
configfile: pytest.ini
plugins: playwright-0.4.4
collected 8 items

10:30:01 [INFO] Cargando configuración para ambiente: staging
10:30:01 [INFO] Configuración cargada: Settings(env=staging,
    url=https://staging.miapp.com, browser=chromium, headless=True)

tests/test_login.py::TestLogin::test_pagina_login_carga PASSED
tests/test_login.py::TestLogin::test_login_admin_exitoso PASSED
tests/test_login.py::TestLogin::test_login_fallido_muestra_error PASSED
tests/test_login.py::TestLogin::test_login_campos_vacios[...] PASSED
tests/test_login.py::TestLogin::test_login_campos_vacios[...] PASSED
tests/test_navegacion.py::TestNavegacion::test_pagina_principal PASSED
tests/test_navegacion.py::TestNavegacion::test_rutas_publicas PASSED
tests/test_navegacion.py::TestNavegacion::test_navegacion_ida PASSED

====================== 8 passed in 12.34s =========================</code></pre>

        <h3>📊 Resumen de la Sección 3</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎉 Sección 3 Completada: Python para Testers QA</h4>
            <p>Has dominado las habilidades de Python esenciales para QA automation:</p>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #c8e6c9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Lección</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Tema</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Tipo</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">021</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Variables, tipos de datos y f-strings</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">022</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Funciones y módulos Python</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">023</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Manejo de archivos y datos (JSON, YAML, CSV)</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">024</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Clases y objetos para testing</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">025</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Fixtures avanzadas de pytest</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Foundation</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">026</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Variables de entorno y configuración</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">027</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Manejo de excepciones en tests</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">028</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Proyecto: Config multi-ambiente</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Integration</td>
                </tr>
            </table>
        </div>

        <div style="background: #fff8e1; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ffc107;">
            <h4>🧠 Habilidades adquiridas en la Sección 3:</h4>
            <ul>
                <li><strong>Variables y f-strings:</strong> Manipular datos y formatear mensajes</li>
                <li><strong>Funciones y módulos:</strong> Organizar código reutilizable</li>
                <li><strong>Archivos (JSON/YAML/CSV):</strong> Cargar datos de prueba externos</li>
                <li><strong>Clases y OOP:</strong> Crear Page Objects y modelos de datos</li>
                <li><strong>Fixtures avanzadas:</strong> Setup/teardown sofisticado con pytest</li>
                <li><strong>Variables de entorno:</strong> Configuración flexible por ambiente</li>
                <li><strong>Excepciones:</strong> Manejo robusto de errores en tests</li>
                <li><strong>Multi-ambiente:</strong> Framework profesional configurable</li>
            </ul>
        </div>

        <h3>🎯 Ejercicio final: Implementar el proyecto completo</h3>
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 15px 0;">
            <h4>🏋️ Proyecto: Construye tu sistema multi-ambiente</h4>
            <ol>
                <li><strong>Crea la estructura del proyecto</strong> completa con todos los directorios y archivos</li>
                <li><strong>Implementa <code>config/settings.py</code></strong> con la dataclass Settings y la función cargar_settings()</li>
                <li><strong>Crea los 3 archivos .env</strong> (dev, staging, prod) con configuraciones diferentes</li>
                <li><strong>Implementa <code>utils/exceptions.py</code></strong> con al menos 4 excepciones personalizadas</li>
                <li><strong>Implementa <code>utils/data_loader.py</code></strong> con cargadores de JSON y CSV</li>
                <li><strong>Crea <code>tests/conftest.py</code></strong> con la opción --env y todas las fixtures</li>
                <li><strong>Escribe al menos 5 tests</strong> que utilicen la configuración del ambiente</li>
                <li><strong>Ejecuta la suite en dos ambientes diferentes:</strong>
                    <pre><code class="bash"># Primero en dev
pytest tests/ --env=dev -v

# Luego en staging
pytest tests/ --env=staging -v

# Compara los logs y resultados</code></pre>
                </li>
                <li><strong>Bonus:</strong> Agrega un test que se omita automáticamente en producción usando <code>pytest.mark.skipif</code></li>
            </ol>

            <div style="background: #bbdefb; padding: 10px; border-radius: 5px; margin-top: 10px;">
                <strong>Criterios de evaluación:</strong>
                <ul>
                    <li>El sistema carga la configuración correcta al cambiar <code>--env</code></li>
                    <li>Los tests usan fixtures que inyectan la config del ambiente</li>
                    <li>Las excepciones personalizadas se lanzan cuando corresponde</li>
                    <li>Los datos de prueba se cargan desde archivos externos</li>
                    <li>El logging muestra el ambiente en cada ejecución</li>
                </ul>
            </div>
        </div>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Diseñar un sistema de configuración multi-ambiente profesional</li>
                <li>Usar dataclasses para tipado seguro de configuraciones</li>
                <li>Crear un módulo de lectura de archivos .env sin dependencias externas</li>
                <li>Implementar cargadores de datos reutilizables (JSON, CSV)</li>
                <li>Configurar pytest con opciones de línea de comandos personalizadas</li>
                <li>Escribir fixtures que adaptan el comportamiento según el ambiente</li>
                <li>Integrar excepciones personalizadas, logging y datos de prueba</li>
            </ul>
        </div>

        <h3>🚀 Siguiente: Sección 4 - Interacciones Web Fundamentales</h3>
        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Con las bases sólidas de Python que construiste en esta sección,
            es hora de volver a Playwright y dominar la interacción con elementos web.</p>
            <p>En la <strong>Sección 4</strong> aprenderás:</p>
            <ul>
                <li>Formularios: inputs, selects, checkboxes, radio buttons</li>
                <li>Tablas HTML: lectura, búsqueda y validación de datos</li>
                <li>Drag and drop, file upload, iframes</li>
                <li>Diálogos y alertas del navegador</li>
                <li>Manejo de múltiples pestanas y ventanas</li>
                <li>Eventos del teclado y mouse avanzados</li>
            </ul>
        </div>
    `,
    topics: ["proyecto", "multi-ambiente", "configuración"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 10,
    difficulty: "medium",
    type: "integration"
};

if (typeof window !== 'undefined') {
    window.LESSON_028 = LESSON_028;
}
