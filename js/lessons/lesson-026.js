/**
 * Playwright Academy - Lección 026
 * Variables de entorno y configuración
 * Sección 3: Python para Testers QA
 */

const LESSON_026 = {
    id: 26,
    title: "Variables de entorno y configuración",
    duration: "5 min",
    level: "beginner",
    section: "section-03",
    content: `
        <h2>🌍 Variables de entorno y configuración</h2>
        <p>Las variables de entorno son la forma estándar de manejar configuración
        que cambia entre ambientes (desarrollo, staging, producción) y de proteger
        información sensible como contraseñas, tokens y URLs privadas.
        En automatización de pruebas, son esenciales para tener una suite flexible y segura.</p>

        <h3>📖 os.environ y os.getenv()</h3>
        <p>Python accede a las variables de entorno a través del módulo <code>os</code>.
        Hay dos formas principales de leerlas:</p>

        <pre><code class="python">import os

# --- os.environ: diccionario con TODAS las variables de entorno ---
# Acceso directo (lanza KeyError si no existe)
try:
    base_url = os.environ["BASE_URL"]
    print(f"URL base: {base_url}")
except KeyError:
    print("ERROR: BASE_URL no está definida")

# Acceso con get (retorna None o un valor por defecto si no existe)
base_url = os.environ.get("BASE_URL", "http://localhost:3000")

# --- os.getenv(): función dedicada (recomendada) ---
# Equivalente a os.environ.get(), pero más legible
base_url = os.getenv("BASE_URL", "http://localhost:3000")
browser = os.getenv("BROWSER", "chromium")
headless = os.getenv("HEADLESS", "true").lower() == "true"
timeout = int(os.getenv("TIMEOUT", "30000"))

print(f"URL: {base_url}")
print(f"Navegador: {browser}")
print(f"Headless: {headless}")
print(f"Timeout: {timeout}ms")</code></pre>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📌 os.environ vs os.getenv()</h4>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #1565c0; color: white;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Método</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Si no existe</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Cuándo usar</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>os.environ["VAR"]</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Lanza <code>KeyError</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Variable <strong>obligatoria</strong> (el test NO debe correr sin ella)</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>os.getenv("VAR", default)</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Retorna <code>default</code> (o <code>None</code>)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Variable <strong>opcional</strong> con valor por defecto razonable</td>
                </tr>
            </table>
        </div>

        <h3>💻 Definir variables de entorno por sistema operativo</h3>
        <p>Las variables de entorno se definen de forma diferente según el sistema operativo.</p>

        <pre><code class="bash"># ============================================
# Linux / macOS (Terminal)
# ============================================

# Definir para el comando actual
BASE_URL=https://staging.mi-app.com pytest tests/ -v

# Definir para la sesión actual del terminal
export BASE_URL=https://staging.mi-app.com
export BROWSER=firefox
export HEADLESS=true
pytest tests/ -v

# Definir múltiples en una sola línea
BASE_URL=https://staging.mi-app.com BROWSER=firefox HEADLESS=true pytest tests/ -v

# Ver una variable definida
echo $BASE_URL

# Eliminar una variable
unset BASE_URL</code></pre>

        <pre><code class="bash"># ============================================
# Windows (PowerShell)
# ============================================

# Definir temporalmente (sesión actual)
$env:BASE_URL = "https://staging.mi-app.com"
$env:BROWSER = "firefox"
$env:HEADLESS = "true"
pytest tests/ -v

# Ver una variable
echo $env:BASE_URL

# Eliminar
Remove-Item Env:BASE_URL</code></pre>

        <pre><code class="bash"># ============================================
# Windows (CMD)
# ============================================

set BASE_URL=https://staging.mi-app.com
set BROWSER=firefox
set HEADLESS=true
pytest tests/ -v</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚠️ Problema con variables de entorno manuales</h4>
            <p>Definir variables manualmente en cada terminal es propenso a errores y difícil de mantener.
            La solución: usar archivos <code>.env</code> con <code>python-dotenv</code>.</p>
        </div>

        <h3>📦 python-dotenv: archivos .env</h3>
        <p><code>python-dotenv</code> carga variables de entorno desde un archivo <code>.env</code>
        al inicio de tu programa. Es el estándar en proyectos Python modernos.</p>

        <pre><code class="bash"># Instalar python-dotenv
pip install python-dotenv</code></pre>

        <pre><code class="bash"># Archivo: .env (en la raíz del proyecto)
# Configuración del entorno de pruebas
# NOTA: sin comillas alrededor de los valores (salvo que tengan espacios)

# URLs
BASE_URL=https://staging.mi-app.com
API_URL=https://api.staging.mi-app.com

# Navegador
BROWSER=chromium
HEADLESS=true
SLOW_MO=0

# Credenciales (NUNCA subir este archivo a Git)
ADMIN_EMAIL=admin@miempresa.com
ADMIN_PASSWORD=SuperSecreto2024!
API_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Timeouts (en milisegundos)
DEFAULT_TIMEOUT=30000
NAVIGATION_TIMEOUT=60000

# Reportes
REPORT_DIR=./test-results
SCREENSHOT_ON_FAILURE=true</code></pre>

        <pre><code class="python"># config.py - Cargar variables de entorno con python-dotenv
import os
from dotenv import load_dotenv

# Cargar el archivo .env
# Por defecto busca .env en el directorio actual
load_dotenv()

# Ahora os.getenv() lee las variables del .env
base_url = os.getenv("BASE_URL", "http://localhost:3000")
browser = os.getenv("BROWSER", "chromium")
headless = os.getenv("HEADLESS", "true").lower() == "true"

print(f"Configuración cargada:")
print(f"  URL: {base_url}")
print(f"  Browser: {browser}")
print(f"  Headless: {headless}")</code></pre>

        <pre><code class="python"># Opciones avanzadas de load_dotenv()
from dotenv import load_dotenv
from pathlib import Path

# Cargar un .env específico
load_dotenv(dotenv_path=Path("config") / ".env.staging")

# Cargar sin sobrescribir variables ya definidas en el sistema
load_dotenv(override=False)

# Cargar y sobrescribir las del sistema (forzar los valores del .env)
load_dotenv(override=True)

# Cargar desde una ruta absoluta
load_dotenv(dotenv_path="/home/qa/proyecto/.env.produccion")</code></pre>

        <h3>🔒 Mantener secretos fuera del código</h3>
        <p>El archivo <code>.env</code> contiene información sensible que <strong>nunca</strong>
        debe llegar al repositorio. El mecanismo de protección es <code>.gitignore</code>.</p>

        <pre><code class="bash"># .gitignore - Agregar estas líneas
# Variables de entorno (CRÍTICO)
.env
.env.local
.env.*.local

# Mantener el ejemplo (SIN secretos reales)
!.env.example</code></pre>

        <pre><code class="bash"># .env.example - Plantilla para el equipo (SÍ se sube a Git)
# Copiar este archivo como .env y rellenar con valores reales
# cp .env.example .env

BASE_URL=https://staging.mi-app.com
API_URL=https://api.staging.mi-app.com
BROWSER=chromium
HEADLESS=true
SLOW_MO=0
ADMIN_EMAIL=tu_email@empresa.com
ADMIN_PASSWORD=tu_password_aqui
API_TOKEN=tu_token_aqui
DEFAULT_TIMEOUT=30000
NAVIGATION_TIMEOUT=60000
REPORT_DIR=./test-results
SCREENSHOT_ON_FAILURE=true</code></pre>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #c62828;">
            <h4>🚨 Reglas de oro para secretos</h4>
            <ol>
                <li><strong>Nunca</strong> poner contraseñas/tokens directamente en el código fuente</li>
                <li><strong>Siempre</strong> agregar <code>.env</code> al <code>.gitignore</code></li>
                <li><strong>Siempre</strong> proveer un <code>.env.example</code> como plantilla</li>
                <li><strong>Nunca</strong> hacer <code>print()</code> de contraseñas o tokens en logs</li>
                <li>En CI/CD, usar los secretos nativos de la plataforma (GitHub Secrets, GitLab CI Variables, etc.)</li>
            </ol>
        </div>

        <h3>⚙️ Variables de entorno para configuración de tests</h3>
        <p>Un patrón muy común en automatización es usar variables de entorno para
        controlar el comportamiento de los tests sin modificar código.</p>

        <pre><code class="python"># config.py - Módulo de configuración centralizado
import os
from dotenv import load_dotenv
from dataclasses import dataclass

load_dotenv()

@dataclass
class TestConfig:
    """Configuración centralizada para los tests."""
    # URLs
    base_url: str = os.getenv("BASE_URL", "http://localhost:3000")
    api_url: str = os.getenv("API_URL", "http://localhost:3001")

    # Navegador
    browser: str = os.getenv("BROWSER", "chromium")
    headless: bool = os.getenv("HEADLESS", "true").lower() == "true"
    slow_mo: int = int(os.getenv("SLOW_MO", "0"))
    viewport_width: int = int(os.getenv("VIEWPORT_WIDTH", "1280"))
    viewport_height: int = int(os.getenv("VIEWPORT_HEIGHT", "720"))

    # Credenciales
    admin_email: str = os.getenv("ADMIN_EMAIL", "")
    admin_password: str = os.getenv("ADMIN_PASSWORD", "")
    api_token: str = os.getenv("API_TOKEN", "")

    # Timeouts
    default_timeout: int = int(os.getenv("DEFAULT_TIMEOUT", "30000"))
    navigation_timeout: int = int(os.getenv("NAVIGATION_TIMEOUT", "60000"))

    # Reportes
    report_dir: str = os.getenv("REPORT_DIR", "./test-results")
    screenshot_on_failure: bool = os.getenv("SCREENSHOT_ON_FAILURE", "true").lower() == "true"

# Instancia global de configuración
config = TestConfig()

# Uso en cualquier parte del proyecto:
# from config import config
# print(config.base_url)</code></pre>

        <pre><code class="python"># conftest.py - Usar la configuración con fixtures de Playwright
import pytest
from config import config

@pytest.fixture(scope="session")
def browser_type_launch_args(browser_type_launch_args):
    """Configurar lanzamiento del navegador desde variables de entorno."""
    return {
        **browser_type_launch_args,
        "headless": config.headless,
        "slow_mo": config.slow_mo,
    }

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    """Configurar contexto del navegador desde variables de entorno."""
    return {
        **browser_context_args,
        "base_url": config.base_url,
        "viewport": {
            "width": config.viewport_width,
            "height": config.viewport_height
        },
        "locale": "es-CO",
        "timezone_id": "America/Bogota"
    }

@pytest.fixture(autouse=True)
def configurar_timeouts(page):
    """Aplicar timeouts desde la configuración."""
    page.set_default_timeout(config.default_timeout)
    page.set_default_navigation_timeout(config.navigation_timeout)
    yield page

@pytest.fixture
def credenciales_admin():
    """Proveer credenciales de admin desde variables de entorno."""
    assert config.admin_email, "ADMIN_EMAIL no está definida en .env"
    assert config.admin_password, "ADMIN_PASSWORD no está definida en .env"
    return {
        "email": config.admin_email,
        "password": config.admin_password
    }</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Ventajas de la configuración centralizada</h4>
            <ul>
                <li><strong>Un solo lugar</strong> para cambiar la configuración</li>
                <li><strong>Valores por defecto</strong> que funcionan sin .env (desarrollo local)</li>
                <li><strong>Type hints</strong> con dataclass para autocompletado en el IDE</li>
                <li><strong>Validación</strong> de valores obligatorios con assertions</li>
                <li><strong>Cambio de ambiente</strong> sin tocar código: solo cambiar el .env</li>
            </ul>
        </div>

        <h3>📄 pytest.ini y pyproject.toml</h3>
        <p>Además de variables de entorno, pytest tiene sus propios archivos de configuración
        para opciones que no son secretas.</p>

        <pre><code class="ini"># pytest.ini - Configuración de pytest
[pytest]
# Directorio base de tests
testpaths = tests

# Opciones por defecto al ejecutar pytest
addopts =
    -v
    --tb=short
    --strict-markers
    --screenshot=only-on-failure
    --output=test-results/

# Marcadores personalizados
markers =
    smoke: Tests de humo (críticos, rápidos)
    regression: Tests de regresión completos
    slow: Tests que tardan más de 30 segundos
    api: Tests de API (sin navegador)

# Patrón de archivos de test
python_files = test_*.py
python_classes = Test*
python_functions = test_*

# Timeout por defecto para cada test (requiere pytest-timeout)
timeout = 120

# Base URL para Playwright (alternativa a variable de entorno)
base_url = https://staging.mi-app.com</code></pre>

        <pre><code class="toml"># pyproject.toml - Alternativa moderna a pytest.ini
[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = """
    -v
    --tb=short
    --strict-markers
    --screenshot=only-on-failure
    --output=test-results/
"""
markers = [
    "smoke: Tests de humo (críticos, rápidos)",
    "regression: Tests de regresión completos",
    "slow: Tests que tardan más de 30 segundos",
    "api: Tests de API (sin navegador)",
]
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
timeout = 120</code></pre>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔀 ¿Qué va en .env vs pytest.ini?</h4>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #6a1b9a; color: white;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Archivo</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Contenido</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">¿Se sube a Git?</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>.env</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Secretos, URLs específicas del ambiente, credenciales</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">NO (solo .env.example)</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>pytest.ini</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Opciones de pytest, marcadores, patrones, timeouts</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">SÍ</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>pyproject.toml</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Lo mismo que pytest.ini + configuración de otras herramientas</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">SÍ</td>
                </tr>
            </table>
        </div>

        <h3>🔗 Combinando variables de entorno con fixtures</h3>
        <p>El patrón más potente: usar <code>.env</code> para configuración sensible,
        <code>pytest.ini</code> para opciones de pytest, y fixtures para inyectar todo
        en los tests.</p>

        <pre><code class="python"># conftest.py - Patrón completo de configuración
import pytest
import os
from dotenv import load_dotenv

# Cargar .env al inicio de la sesión
load_dotenv()

# ---- Determinar el ambiente ----
ENV = os.getenv("TEST_ENV", "staging")

# Cargar .env específico del ambiente si existe
env_file = f".env.{ENV}"
if os.path.exists(env_file):
    load_dotenv(env_file, override=True)
    print(f"\\nCargado: {env_file}")

@pytest.fixture(scope="session")
def ambiente():
    """Información del ambiente de ejecución."""
    return {
        "nombre": ENV,
        "base_url": os.getenv("BASE_URL"),
        "es_produccion": ENV == "production"
    }

@pytest.fixture(autouse=True)
def saltar_en_produccion(request, ambiente):
    """Saltar tests destructivos si estamos en producción."""
    if ambiente["es_produccion"]:
        marcador = request.node.get_closest_marker("destructive")
        if marcador:
            pytest.skip("Test destructivo: no se ejecuta en producción")

# Uso en tests:
@pytest.mark.destructive
def test_eliminar_usuario(pagina_limpia):
    """Este test se salta automáticamente en producción."""
    pagina_limpia.click("text=Eliminar cuenta")
    pagina_limpia.click("#confirmar")</code></pre>

        <pre><code class="bash"># Ejecutar en diferentes ambientes cambiando solo la variable
TEST_ENV=staging pytest tests/ -v
TEST_ENV=production pytest tests/ -v -m "not destructive"
TEST_ENV=development pytest tests/ -v --headed</code></pre>

        <h3>📂 Estructura completa de un proyecto con configuración</h3>
        <pre><code>mi-proyecto-tests/
├── .env                  # Variables sensibles (NO en Git)
├── .env.example          # Plantilla para el equipo (SÍ en Git)
├── .env.staging          # Override para staging (NO en Git)
├── .env.production       # Override para producción (NO en Git)
├── .gitignore            # Incluye .env, .env.local, etc.
├── pyproject.toml        # Config de pytest + herramientas
├── config.py             # Módulo de configuración centralizado
├── conftest.py           # Fixtures globales + carga de .env
├── requirements.txt      # Dependencias del proyecto
└── tests/
    ├── conftest.py       # Fixtures de tests
    ├── test_smoke.py
    ├── test_login.py
    └── test_catalogo.py</code></pre>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff8e1; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #f9a825;">
            <h4>🏋️ Ejercicio: Sistema de configuración basado en .env</h4>
            <p>Crea un sistema completo de configuración para un proyecto de tests con Playwright.</p>

            <p><strong>Paso 1:</strong> Crea el archivo <code>.env</code></p>
            <pre><code class="bash"># .env
BASE_URL=https://the-internet.herokuapp.com
BROWSER=chromium
HEADLESS=true
SLOW_MO=0
DEFAULT_TIMEOUT=15000
SCREENSHOT_ON_FAILURE=true
REPORT_DIR=./resultados
TEST_USER=tomsmith
TEST_PASSWORD=SuperSecretPassword!</code></pre>

            <p><strong>Paso 2:</strong> Crea el archivo <code>.env.example</code> (sin los secretos reales)</p>
            <pre><code class="bash"># .env.example
BASE_URL=https://the-internet.herokuapp.com
BROWSER=chromium
HEADLESS=true
SLOW_MO=0
DEFAULT_TIMEOUT=15000
SCREENSHOT_ON_FAILURE=true
REPORT_DIR=./resultados
TEST_USER=tu_usuario
TEST_PASSWORD=tu_password</code></pre>

            <p><strong>Paso 3:</strong> Crea <code>config.py</code> con una dataclass</p>
            <pre><code class="python"># config.py
import os
from dotenv import load_dotenv
from dataclasses import dataclass

load_dotenv()

@dataclass
class Config:
    base_url: str = os.getenv("BASE_URL", "http://localhost:3000")
    browser: str = os.getenv("BROWSER", "chromium")
    headless: bool = os.getenv("HEADLESS", "true").lower() == "true"
    slow_mo: int = int(os.getenv("SLOW_MO", "0"))
    default_timeout: int = int(os.getenv("DEFAULT_TIMEOUT", "30000"))
    screenshot_on_failure: bool = os.getenv("SCREENSHOT_ON_FAILURE", "true").lower() == "true"
    report_dir: str = os.getenv("REPORT_DIR", "./test-results")
    test_user: str = os.getenv("TEST_USER", "")
    test_password: str = os.getenv("TEST_PASSWORD", "")

config = Config()</code></pre>

            <p><strong>Paso 4:</strong> Crea <code>conftest.py</code> que use la configuración</p>
            <pre><code class="python"># conftest.py
import pytest
from config import config

@pytest.fixture(scope="session")
def browser_type_launch_args(browser_type_launch_args):
    return {
        **browser_type_launch_args,
        "headless": config.headless,
        "slow_mo": config.slow_mo,
    }

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "base_url": config.base_url,
    }

@pytest.fixture(autouse=True)
def setup_timeout(page):
    page.set_default_timeout(config.default_timeout)
    yield page

@pytest.fixture
def credenciales():
    return {
        "user": config.test_user,
        "password": config.test_password
    }</code></pre>

            <p><strong>Paso 5:</strong> Escribe un test que utilice todo el sistema</p>
            <pre><code class="python"># tests/test_login_config.py
from playwright.sync_api import Page, expect

def test_login_con_config(page: Page, credenciales):
    """Test que usa las credenciales del .env."""
    page.goto("/login")
    page.fill("#username", credenciales["user"])
    page.fill("#password", credenciales["password"])
    page.click("button[type='submit']")
    expect(page).to_have_url("**/secure")

def test_verificar_base_url(page: Page):
    """Verifica que la base_url del .env se aplica correctamente."""
    page.goto("/")
    expect(page).to_have_title("The Internet")</code></pre>

            <p><strong>Paso 6:</strong> Ejecuta los tests</p>
            <pre><code class="bash"># Ejecutar con la configuración del .env
pytest tests/test_login_config.py -v

# Sobrescribir una variable para esta ejecución
HEADLESS=false pytest tests/test_login_config.py -v

# Usar otro archivo .env
# (crear .env.local con BASE_URL diferente)
# Modificar config.py para cargar load_dotenv(".env.local", override=True)</code></pre>
        </div>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Acceder a variables de entorno con <code>os.environ</code> y <code>os.getenv()</code></li>
                <li>Definir variables de entorno en Linux/Mac y Windows</li>
                <li>Usar <code>python-dotenv</code> para cargar archivos <code>.env</code></li>
                <li>Proteger secretos con <code>.gitignore</code> y <code>.env.example</code></li>
                <li>Configurar tests de Playwright con variables de entorno: URLs, navegador, credenciales</li>
                <li>Usar <code>pytest.ini</code> / <code>pyproject.toml</code> para opciones de pytest</li>
                <li>Combinar variables de entorno con fixtures para máxima flexibilidad</li>
            </ul>
        </div>
    `,
    topics: ["entorno", "variables", "configuración"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_026 = LESSON_026;
}
