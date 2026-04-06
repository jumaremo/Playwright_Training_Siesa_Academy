/**
 * Playwright Academy - Lección 024
 * Clases y objetos para testing
 * Sección 3: Python para Testers QA
 */

const LESSON_024 = {
    id: 24,
    title: "Clases y objetos para testing",
    duration: "5 min",
    level: "beginner",
    section: "section-03",
    content: `
        <h2>🏗️ Clases y objetos para testing</h2>
        <p>La Programación Orientada a Objetos (OOP) es fundamental en automatización de pruebas.
        Las clases te permiten organizar código de test, crear modelos de datos reutilizables
        y construir patrones como Page Object Model. En esta lección aprenderás OOP
        aplicada directamente al contexto de testing con Playwright.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎯 ¿Dónde usarás clases en testing?</h4>
            <ul>
                <li><strong>Page Objects:</strong> encapsular interacciones con páginas web</li>
                <li><strong>Data Models:</strong> representar datos de test (usuarios, productos)</li>
                <li><strong>Test Helpers:</strong> utilidades reutilizables para tests</li>
                <li><strong>API Clients:</strong> wrappers para llamadas HTTP</li>
                <li><strong>Test Classes:</strong> agrupar tests relacionados en pytest</li>
            </ul>
        </div>

        <h3>📦 Anatomía de una clase en Python</h3>
        <pre><code class="python">class Usuario:
    """Representa un usuario del sistema bajo prueba."""

    def __init__(self, username, password, rol="usuario"):
        """Constructor: se ejecuta al crear una instancia."""
        self.username = username    # Atributo de instancia
        self.password = password
        self.rol = rol
        self.esta_logueado = False  # Estado inicial

    def login(self):
        """Simula el login del usuario."""
        self.esta_logueado = True
        return f"{self.username} ha iniciado sesión como {self.rol}"

    def logout(self):
        """Simula el logout del usuario."""
        self.esta_logueado = False
        return f"{self.username} ha cerrado sesión"

    def __str__(self):
        """Representación en texto del objeto."""
        estado = "conectado" if self.esta_logueado else "desconectado"
        return f"Usuario({self.username}, rol={self.rol}, {estado})"

# --- Uso ---
admin = Usuario("admin", "Admin123!", rol="administrador")
tester = Usuario("jperez", "Test456!")

print(admin)          # Usuario(admin, rol=administrador, desconectado)
print(admin.login())  # admin ha iniciado sesión como administrador
print(admin)          # Usuario(admin, rol=administrador, conectado)</code></pre>

        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔍 Conceptos clave</h4>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #e8f5e9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Concepto</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Sintaxis</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripción</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Clase</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>class MiClase:</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Plantilla para crear objetos</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Constructor</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>__init__(self, ...)</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Inicializa la instancia</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">self</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>self.atributo</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Referencia a la instancia actual</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Método</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>def metodo(self):</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Función dentro de la clase</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Instancia</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>obj = MiClase()</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Objeto creado a partir de la clase</td>
                </tr>
            </table>
        </div>

        <h3>🔒 Properties: control de acceso a atributos</h3>
        <p>El decorador <code>@property</code> permite definir atributos calculados
        y controlar cómo se accede o modifica un valor:</p>
        <pre><code class="python">class TestEnvironment:
    """Configuración de un ambiente de pruebas."""

    def __init__(self, nombre, base_url, headless=True):
        self.nombre = nombre
        self._base_url = base_url       # Convención: _ indica "privado"
        self.headless = headless
        self._test_count = 0

    @property
    def base_url(self):
        """Getter: obtener la URL base (solo lectura)."""
        return self._base_url

    @property
    def test_count(self):
        """Getter: número de tests ejecutados."""
        return self._test_count

    @property
    def resumen(self):
        """Propiedad calculada: genera un resumen dinámico."""
        modo = "headless" if self.headless else "headed"
        return f"[{self.nombre}] {self._base_url} ({modo}) - {self._test_count} tests"

    def registrar_test(self):
        """Incrementa el contador de tests."""
        self._test_count += 1

# --- Uso ---
staging = TestEnvironment("staging", "https://staging.miapp.com")
print(staging.base_url)    # https://staging.miapp.com
print(staging.resumen)     # [staging] https://staging.miapp.com (headless) - 0 tests

staging.registrar_test()
staging.registrar_test()
print(staging.resumen)     # [staging] https://staging.miapp.com (headless) - 2 tests

# staging.base_url = "otra_url"  # Error: no tiene setter, es de solo lectura</code></pre>

        <h3>🧬 Herencia: reutilizar y extender clases</h3>
        <p>La herencia permite crear clases especializadas a partir de una clase base.
        Esto es fundamental para Page Objects y helpers reutilizables:</p>
        <pre><code class="python">class BasePage:
    """Clase base para todas las páginas (Page Object base)."""

    def __init__(self, page, base_url):
        self.page = page
        self.base_url = base_url

    def navegar(self):
        """Navega a la URL de la página."""
        self.page.goto(self.base_url)

    def obtener_titulo(self):
        """Retorna el título de la página."""
        return self.page.title()

    def tomar_screenshot(self, nombre):
        """Captura screenshot con nombre descriptivo."""
        self.page.screenshot(path=f"screenshots/{nombre}.png")

class LoginPage(BasePage):
    """Page Object para la página de login."""

    def __init__(self, page):
        super().__init__(page, "/login")  # Llama al constructor padre
        # Localizadores específicos de esta página
        self.input_usuario = page.locator("#username")
        self.input_password = page.locator("#password")
        self.btn_login = page.locator("button[type='submit']")
        self.msg_error = page.locator(".error-message")

    def login(self, username, password):
        """Realiza el login con las credenciales dadas."""
        self.input_usuario.fill(username)
        self.input_password.fill(password)
        self.btn_login.click()

    def obtener_error(self):
        """Retorna el texto del mensaje de error."""
        return self.msg_error.text_content()

class DashboardPage(BasePage):
    """Page Object para el dashboard."""

    def __init__(self, page):
        super().__init__(page, "/dashboard")
        self.titulo = page.locator("h1")
        self.menu_usuario = page.locator("#user-menu")

    def obtener_nombre_usuario(self):
        """Retorna el nombre del usuario logueado."""
        return self.menu_usuario.text_content()

# --- Uso en un test ---
# def test_login_exitoso(page):
#     login_page = LoginPage(page)
#     login_page.navegar()                      # Heredado de BasePage
#     login_page.login("admin", "Admin123!")     # Método propio
#     dashboard = DashboardPage(page)
#     assert dashboard.obtener_nombre_usuario() == "admin"</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚠️ super().__init__() es obligatorio</h4>
            <p>Cuando una clase hija tiene su propio <code>__init__</code>, debe llamar
            a <code>super().__init__()</code> para ejecutar el constructor del padre.
            Si no lo haces, los atributos del padre no se inicializarán.</p>
        </div>

        <h3>📦 Dataclasses: modelos de datos sin boilerplate</h3>
        <p>Las <code>dataclasses</code> (Python 3.7+) eliminan el código repetitivo
        al crear clases que principalmente almacenan datos. Son ideales para
        representar datos de test:</p>
        <pre><code class="python">from dataclasses import dataclass, field
from typing import Optional

@dataclass
class UserData:
    """Modelo de datos para un usuario de prueba."""
    username: str
    password: str
    email: str
    rol: str = "usuario"              # Valor por defecto
    activo: bool = True
    permisos: list = field(default_factory=list)  # Lista mutable por defecto

# Python genera automáticamente: __init__, __repr__, __eq__
admin = UserData(
    username="admin",
    password="Admin123!",
    email="admin@empresa.com",
    rol="administrador",
    permisos=["crear", "editar", "eliminar"]
)

tester = UserData(
    username="jperez",
    password="Test456!",
    email="jperez@empresa.com"
    # rol="usuario" (valor por defecto)
    # activo=True (valor por defecto)
    # permisos=[] (valor por defecto)
)

print(admin)
# UserData(username='admin', password='Admin123!', email='admin@empresa.com',
#          rol='administrador', activo=True, permisos=['crear', 'editar', 'eliminar'])

# Comparación automática
admin2 = UserData("admin", "Admin123!", "admin@empresa.com", "administrador",
                  True, ["crear", "editar", "eliminar"])
print(admin == admin2)  # True (compara todos los campos)</code></pre>

        <pre><code class="python"># --- Dataclasses para diferentes modelos de test ---
from dataclasses import dataclass
from typing import Optional

@dataclass
class ProductData:
    """Modelo de datos para un producto."""
    nombre: str
    precio: float
    categoria: str
    stock: int = 0
    descuento: float = 0.0

    @property
    def precio_final(self):
        """Calcula el precio con descuento."""
        return self.precio * (1 - self.descuento)

    @property
    def disponible(self):
        """Verifica si hay stock."""
        return self.stock > 0

@dataclass
class LoginScenario:
    """Modelo para un escenario de prueba de login."""
    descripcion: str
    username: str
    password: str
    resultado_esperado: str  # "exitoso", "error_credenciales", "error_campos"
    mensaje_esperado: Optional[str] = None

# --- Crear escenarios de test con dataclasses ---
escenarios_login = [
    LoginScenario(
        descripcion="Login exitoso con admin",
        username="admin",
        password="Admin123!",
        resultado_esperado="exitoso"
    ),
    LoginScenario(
        descripcion="Login con contraseña incorrecta",
        username="admin",
        password="mala_clave",
        resultado_esperado="error_credenciales",
        mensaje_esperado="Credenciales inválidas"
    ),
    LoginScenario(
        descripcion="Login con campos vacíos",
        username="",
        password="",
        resultado_esperado="error_campos",
        mensaje_esperado="Los campos son obligatorios"
    ),
]

# Usar en pytest.mark.parametrize
import pytest

@pytest.mark.parametrize("escenario", escenarios_login,
                         ids=[e.descripcion for e in escenarios_login])
def test_login(page, escenario: LoginScenario):
    page.goto("/login")
    page.fill("#username", escenario.username)
    page.fill("#password", escenario.password)
    page.click("#btn-login")
    # ... assertions según escenario.resultado_esperado</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 ¿Cuándo usar <code>@dataclass</code> vs clase normal?</h4>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #c8e6c9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Situación</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Usar</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Modelo de datos (UserData, ProductData)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>@dataclass</code> ✅</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Page Objects (LoginPage, DashboardPage)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Clase normal ✅</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Helper con lógica compleja</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Clase normal ✅</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Escenarios de test parametrizado</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>@dataclass</code> ✅</td>
                </tr>
            </table>
        </div>

        <h3>🛠️ Métodos estáticos y de clase</h3>
        <p>Python ofrece dos tipos especiales de métodos que no necesitan una instancia:</p>
        <pre><code class="python">import json
import csv
from pathlib import Path

class TestHelper:
    """Clase de utilidades para tests. No necesita instanciarse."""

    DATA_DIR = Path(__file__).parent / "test_data"

    @staticmethod
    def generar_email(nombre, dominio="test.com"):
        """Genera un email de prueba. No necesita acceso a la clase."""
        nombre_limpio = nombre.lower().replace(" ", ".")
        return f"{nombre_limpio}@{dominio}"

    @staticmethod
    def generar_password(longitud=12):
        """Genera una contraseña aleatoria para tests."""
        import random
        import string
        chars = string.ascii_letters + string.digits + "!@#$"
        return ''.join(random.choices(chars, k=longitud))

    @classmethod
    def cargar_json(cls, nombre_archivo):
        """Carga datos JSON del directorio de test data."""
        ruta = cls.DATA_DIR / nombre_archivo  # cls accede a DATA_DIR
        return json.loads(ruta.read_text(encoding="utf-8"))

    @classmethod
    def cargar_csv(cls, nombre_archivo):
        """Carga datos CSV del directorio de test data."""
        ruta = cls.DATA_DIR / nombre_archivo
        with open(ruta, "r", encoding="utf-8") as f:
            return list(csv.DictReader(f))

# --- Uso ---
# No se necesita crear una instancia (no hay TestHelper())
email = TestHelper.generar_email("Juan Reina")       # juan.reina@test.com
password = TestHelper.generar_password()              # "aK3$mP9xLq2!"
usuarios = TestHelper.cargar_json("usuarios.json")    # [{...}, {...}]
productos = TestHelper.cargar_csv("productos.csv")    # [{...}, {...}]</code></pre>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔑 @staticmethod vs @classmethod</h4>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #e1bee7;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Decorador</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Primer parámetro</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Acceso a la clase</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Uso típico</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>@staticmethod</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Ninguno</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">No</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Funciones utilitarias puras</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>@classmethod</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>cls</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Sí (atributos de clase)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Factory methods, acceso a atributos compartidos</td>
                </tr>
            </table>
        </div>

        <h3>🎭 Clases en tests con pytest</h3>
        <p>pytest permite agrupar tests en clases para mejor organización.
        Nota: en pytest <strong>no</strong> necesitas heredar de ninguna clase base:</p>
        <pre><code class="python"># test_usuarios.py
from playwright.sync_api import Page, expect
from dataclasses import dataclass

@dataclass
class UserData:
    username: str
    password: str
    nombre_completo: str
    rol: str = "usuario"

class TestLoginUsuarios:
    """Tests de login agrupados por funcionalidad."""

    # Datos compartidos por todos los tests de la clase
    admin = UserData("admin", "Admin123!", "Administrador", "admin")
    tester = UserData("tester", "Test456!", "QA Tester")

    def test_login_admin(self, page: Page):
        """Admin puede hacer login y ver el panel de administración."""
        page.goto("/login")
        page.fill("#username", self.admin.username)
        page.fill("#password", self.admin.password)
        page.click("#btn-login")
        expect(page).to_have_url("**/admin/dashboard")

    def test_login_tester(self, page: Page):
        """Tester puede hacer login y ver el dashboard estándar."""
        page.goto("/login")
        page.fill("#username", self.tester.username)
        page.fill("#password", self.tester.password)
        page.click("#btn-login")
        expect(page).to_have_url("**/dashboard")

    def test_logout(self, page: Page):
        """Cualquier usuario puede hacer logout."""
        page.goto("/login")
        page.fill("#username", self.tester.username)
        page.fill("#password", self.tester.password)
        page.click("#btn-login")
        page.click("#btn-logout")
        expect(page).to_have_url("**/login")</code></pre>

        <h3>🔗 Juntando todo: patrón completo para Playwright</h3>
        <pre><code class="python"># models/user.py
from dataclasses import dataclass, field

@dataclass
class UserData:
    username: str
    password: str
    email: str
    rol: str = "usuario"

    @classmethod
    def admin(cls):
        """Factory method: crea un usuario admin predefinido."""
        return cls("admin", "Admin123!", "admin@empresa.com", "administrador")

    @classmethod
    def tester(cls):
        """Factory method: crea un tester predefinido."""
        return cls("qa_tester", "Test456!", "tester@empresa.com", "tester")

# --- Uso elegante en tests ---
# admin = UserData.admin()
# tester = UserData.tester()
# custom = UserData("juanm", "Pass789!", "juan@empresa.com")</code></pre>

        <pre><code class="python"># helpers/test_helper.py
from pathlib import Path
import json

class TestHelper:
    """Utilidades compartidas entre todos los tests."""

    ROOT = Path(__file__).parent.parent
    DATA_DIR = ROOT / "test_data"
    SCREENSHOTS_DIR = ROOT / "screenshots"

    @classmethod
    def setup_dirs(cls):
        """Crea los directorios necesarios para los tests."""
        cls.SCREENSHOTS_DIR.mkdir(exist_ok=True)

    @staticmethod
    def generar_email(nombre):
        return f"{nombre.lower().replace(' ', '.')}@test.com"

    @classmethod
    def cargar_datos(cls, archivo):
        ruta = cls.DATA_DIR / archivo
        return json.loads(ruta.read_text(encoding="utf-8"))

# conftest.py
import pytest
from helpers.test_helper import TestHelper

@pytest.fixture(scope="session", autouse=True)
def setup_ambiente():
    """Prepara el ambiente antes de ejecutar la suite."""
    TestHelper.setup_dirs()
    yield
    # Cleanup después de la suite si es necesario</code></pre>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Crea los siguientes archivos aplicando todos los conceptos de esta lección:</p>
        </div>
        <ol>
            <li><strong>Crea <code>models/user.py</code></strong> con un <code>@dataclass UserData</code> que tenga:
                <ul>
                    <li>Campos: username, password, email, rol (default "usuario"), activo (default True)</li>
                    <li>Propiedad <code>nombre_display</code> que retorne <code>"username (rol)"</code></li>
                    <li>Classmethods <code>admin()</code> y <code>tester()</code> como factory methods</li>
                </ul>
            </li>
            <li><strong>Crea <code>helpers/test_helper.py</code></strong> con una clase <code>TestHelper</code> que tenga:
                <ul>
                    <li>Un <code>@staticmethod generar_email(nombre)</code></li>
                    <li>Un <code>@staticmethod generar_password(longitud=12)</code></li>
                    <li>Un <code>@classmethod cargar_json(cls, archivo)</code> que use pathlib</li>
                </ul>
            </li>
            <li><strong>Crea <code>test_oop.py</code></strong> con:
                <ul>
                    <li>Una clase <code>TestUserData</code> con tests que verifiquen que UserData se crea correctamente</li>
                    <li>Un test que verifique que <code>UserData.admin()</code> retorna un admin</li>
                    <li>Un test que use <code>TestHelper.generar_email()</code></li>
                </ul>
            </li>
            <li>Ejecuta: <code>pytest test_oop.py -v</code></li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Crear clases con <code>__init__</code>, <code>self</code> y métodos</li>
                <li>Usar <code>@property</code> para atributos calculados y de solo lectura</li>
                <li>Aplicar herencia para crear Page Objects base y especializados</li>
                <li>Usar <code>@dataclass</code> para modelos de datos de test sin boilerplate</li>
                <li>Diferenciar <code>@staticmethod</code> y <code>@classmethod</code> para utilidades</li>
                <li>Organizar tests en clases con pytest</li>
            </ul>
        </div>
    `,
    topics: ["clases", "objetos", "oop"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_024 = LESSON_024;
}
