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
        <div class="code-tabs" data-code-id="L024-1">
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
                <pre><code class="language-python">class Usuario:
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
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">class Usuario {
    username: string;
    password: string;
    rol: string;
    estaLogueado: boolean;

    constructor(username: string, password: string, rol = 'usuario') {
        this.username = username;
        this.password = password;
        this.rol = rol;
        this.estaLogueado = false;  // Estado inicial
    }

    login(): string {
        this.estaLogueado = true;
        return \`\${this.username} ha iniciado sesión como \${this.rol}\`;
    }

    logout(): string {
        this.estaLogueado = false;
        return \`\${this.username} ha cerrado sesión\`;
    }

    toString(): string {
        const estado = this.estaLogueado ? 'conectado' : 'desconectado';
        return \`Usuario(\${this.username}, rol=\${this.rol}, \${estado})\`;
    }
}

// --- Uso ---
const admin = new Usuario('admin', 'Admin123!', 'administrador');
const tester = new Usuario('jperez', 'Test456!');

console.log(admin.toString());  // Usuario(admin, rol=administrador, desconectado)
console.log(admin.login());     // admin ha iniciado sesión como administrador
console.log(admin.toString());  // Usuario(admin, rol=administrador, conectado)</code></pre>
            </div>
        </div>

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
        <div class="code-tabs" data-code-id="L024-2">
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
                <pre><code class="language-python">class TestEnvironment:
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
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">class TestEnvironment {
    nombre: string;
    private _baseUrl: string;       // private = "privado"
    headless: boolean;
    private _testCount = 0;

    constructor(nombre: string, baseUrl: string, headless = true) {
        this.nombre = nombre;
        this._baseUrl = baseUrl;
        this.headless = headless;
    }

    // Getter: obtener la URL base (solo lectura)
    get baseUrl(): string {
        return this._baseUrl;
    }

    // Getter: número de tests ejecutados
    get testCount(): number {
        return this._testCount;
    }

    // Propiedad calculada: genera un resumen dinámico
    get resumen(): string {
        const modo = this.headless ? 'headless' : 'headed';
        return \`[\${this.nombre}] \${this._baseUrl} (\${modo}) - \${this._testCount} tests\`;
    }

    registrarTest(): void {
        this._testCount++;
    }
}

// --- Uso ---
const staging = new TestEnvironment('staging', 'https://staging.miapp.com');
console.log(staging.baseUrl);   // https://staging.miapp.com
console.log(staging.resumen);   // [staging] https://staging.miapp.com (headless) - 0 tests

staging.registrarTest();
staging.registrarTest();
console.log(staging.resumen);   // [staging] https://staging.miapp.com (headless) - 2 tests

// staging.baseUrl = 'otra_url';  // Error: no tiene setter, es de solo lectura</code></pre>
            </div>
        </div>

        <h3>🧬 Herencia: reutilizar y extender clases</h3>
        <p>La herencia permite crear clases especializadas a partir de una clase base.
        Esto es fundamental para Page Objects y helpers reutilizables:</p>
        <div class="code-tabs" data-code-id="L024-3">
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
                <pre><code class="language-python">class BasePage:
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
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { Page, Locator } from '@playwright/test';

class BasePage {
    protected page: Page;
    protected baseUrl: string;

    constructor(page: Page, baseUrl: string) {
        this.page = page;
        this.baseUrl = baseUrl;
    }

    async navegar(): Promise&lt;void&gt; {
        await this.page.goto(this.baseUrl);
    }

    async obtenerTitulo(): Promise&lt;string&gt; {
        return await this.page.title();
    }

    async tomarScreenshot(nombre: string): Promise&lt;void&gt; {
        await this.page.screenshot({ path: \`screenshots/\${nombre}.png\` });
    }
}

class LoginPage extends BasePage {
    readonly inputUsuario: Locator;
    readonly inputPassword: Locator;
    readonly btnLogin: Locator;
    readonly msgError: Locator;

    constructor(page: Page) {
        super(page, '/login');  // Llama al constructor padre
        this.inputUsuario = page.locator('#username');
        this.inputPassword = page.locator('#password');
        this.btnLogin = page.locator("button[type='submit']");
        this.msgError = page.locator('.error-message');
    }

    async login(username: string, password: string): Promise&lt;void&gt; {
        await this.inputUsuario.fill(username);
        await this.inputPassword.fill(password);
        await this.btnLogin.click();
    }

    async obtenerError(): Promise&lt;string&gt; {
        return (await this.msgError.textContent()) ?? '';
    }
}

class DashboardPage extends BasePage {
    readonly titulo: Locator;
    readonly menuUsuario: Locator;

    constructor(page: Page) {
        super(page, '/dashboard');
        this.titulo = page.locator('h1');
        this.menuUsuario = page.locator('#user-menu');
    }

    async obtenerNombreUsuario(): Promise&lt;string&gt; {
        return (await this.menuUsuario.textContent()) ?? '';
    }
}

// --- Uso en un test ---
// test('login exitoso', async ({ page }) => {
//     const loginPage = new LoginPage(page);
//     await loginPage.navegar();                       // Heredado de BasePage
//     await loginPage.login('admin', 'Admin123!');     // Método propio
//     const dashboard = new DashboardPage(page);
//     expect(await dashboard.obtenerNombreUsuario()).toBe('admin');
// });</code></pre>
            </div>
        </div>

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
        <div class="code-tabs" data-code-id="L024-4">
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
                <pre><code class="language-python">from dataclasses import dataclass, field
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
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// En TypeScript se usan interfaces o clases.
// Para modelos de datos, las interfaces son lo más común:

interface UserData {
    username: string;
    password: string;
    email: string;
    rol?: string;        // Opcional, default 'usuario'
    activo?: boolean;    // Opcional, default true
    permisos?: string[]; // Opcional, default []
}

// Factory function (equivalente al constructor auto-generado)
function createUserData(data: UserData): Required&lt;UserData&gt; {
    return {
        username: data.username,
        password: data.password,
        email: data.email,
        rol: data.rol ?? 'usuario',
        activo: data.activo ?? true,
        permisos: data.permisos ?? [],
    };
}

const admin = createUserData({
    username: 'admin',
    password: 'Admin123!',
    email: 'admin@empresa.com',
    rol: 'administrador',
    permisos: ['crear', 'editar', 'eliminar'],
});

const tester = createUserData({
    username: 'jperez',
    password: 'Test456!',
    email: 'jperez@empresa.com',
    // rol: 'usuario' (valor por defecto)
    // activo: true (valor por defecto)
    // permisos: [] (valor por defecto)
});

console.log(admin);
// { username: 'admin', password: 'Admin123!', ... }

// Comparación: usar JSON.stringify o librería como lodash.isEqual
const admin2 = createUserData({
    username: 'admin', password: 'Admin123!',
    email: 'admin@empresa.com', rol: 'administrador',
    activo: true, permisos: ['crear', 'editar', 'eliminar'],
});
console.log(JSON.stringify(admin) === JSON.stringify(admin2));  // true</code></pre>
            </div>
        </div>

        <div class="code-tabs" data-code-id="L024-5">
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
                <pre><code class="language-python"># --- Dataclasses para diferentes modelos de test ---
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
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

// --- Interfaces para diferentes modelos de test ---
interface ProductData {
    nombre: string;
    precio: number;
    categoria: string;
    stock?: number;
    descuento?: number;
}

// Helpers para propiedades calculadas
function precioFinal(product: ProductData): number {
    return product.precio * (1 - (product.descuento ?? 0));
}

function disponible(product: ProductData): boolean {
    return (product.stock ?? 0) > 0;
}

interface LoginScenario {
    descripcion: string;
    username: string;
    password: string;
    resultadoEsperado: string;  // 'exitoso', 'error_credenciales', 'error_campos'
    mensajeEsperado?: string;
}

// --- Crear escenarios de test ---
const escenariosLogin: LoginScenario[] = [
    {
        descripcion: 'Login exitoso con admin',
        username: 'admin',
        password: 'Admin123!',
        resultadoEsperado: 'exitoso',
    },
    {
        descripcion: 'Login con contraseña incorrecta',
        username: 'admin',
        password: 'mala_clave',
        resultadoEsperado: 'error_credenciales',
        mensajeEsperado: 'Credenciales inválidas',
    },
    {
        descripcion: 'Login con campos vacíos',
        username: '',
        password: '',
        resultadoEsperado: 'error_campos',
        mensajeEsperado: 'Los campos son obligatorios',
    },
];

// Usar en Playwright Test (equivalente a parametrize)
for (const escenario of escenariosLogin) {
    test(\`login - \${escenario.descripcion}\`, async ({ page }) => {
        await page.goto('/login');
        await page.fill('#username', escenario.username);
        await page.fill('#password', escenario.password);
        await page.click('#btn-login');
        // ... assertions según escenario.resultadoEsperado
    });
}</code></pre>
            </div>
        </div>

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
        <div class="code-tabs" data-code-id="L024-6">
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
                <pre><code class="language-python">import json
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
        chars = string.ascii_letters + string.digits + "!@#\$"
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
password = TestHelper.generar_password()              # "aK3\$mP9xLq2!"
usuarios = TestHelper.cargar_json("usuarios.json")    # [{...}, {...}]
productos = TestHelper.cargar_csv("productos.csv")    # [{...}, {...}]</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import * as fs from 'fs';
import * as path from 'path';

class TestHelper {
    // Atributo estático de clase
    static readonly DATA_DIR = path.join(__dirname, 'test_data');

    // static = equivalente a @staticmethod
    static generarEmail(nombre: string, dominio = 'test.com'): string {
        const nombreLimpio = nombre.toLowerCase().replace(/ /g, '.');
        return \`\${nombreLimpio}@\${dominio}\`;
    }

    static generarPassword(longitud = 12): string {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#\$';
        let password = '';
        for (let i = 0; i &lt; longitud; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    // En TS no hay @classmethod, se usa static con this/nombre de clase
    static cargarJson(nombreArchivo: string): any {
        const ruta = path.join(TestHelper.DATA_DIR, nombreArchivo);
        return JSON.parse(fs.readFileSync(ruta, 'utf-8'));
    }

    static cargarCsv(nombreArchivo: string): Record&lt;string, string&gt;[] {
        const ruta = path.join(TestHelper.DATA_DIR, nombreArchivo);
        const content = fs.readFileSync(ruta, 'utf-8');
        const lines = content.trim().split('\\n');
        const headers = lines[0].split(',');
        return lines.slice(1).map(line => {
            const valores = line.split(',');
            return Object.fromEntries(headers.map((h, i) => [h, valores[i]]));
        });
    }
}

// --- Uso ---
// No se necesita crear una instancia (no hay new TestHelper())
const email = TestHelper.generarEmail('Juan Reina');       // 'juan.reina@test.com'
const password = TestHelper.generarPassword();              // 'aK3\$mP9xLq2!'
const usuarios = TestHelper.cargarJson('usuarios.json');    // [{...}, {...}]
const productos = TestHelper.cargarCsv('productos.csv');    // [{...}, {...}]</code></pre>
            </div>
        </div>

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
        <div class="code-tabs" data-code-id="L024-7">
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
                <pre><code class="language-python"># test_usuarios.py
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
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// test_usuarios.spec.ts
import { test, expect } from '@playwright/test';

interface UserData {
    username: string;
    password: string;
    nombreCompleto: string;
    rol: string;
}

// En Playwright Test se usa test.describe para agrupar tests
test.describe('Login Usuarios', () => {
    // Datos compartidos por todos los tests del grupo
    const admin: UserData = {
        username: 'admin', password: 'Admin123!',
        nombreCompleto: 'Administrador', rol: 'admin',
    };
    const tester: UserData = {
        username: 'tester', password: 'Test456!',
        nombreCompleto: 'QA Tester', rol: 'usuario',
    };

    test('admin puede hacer login y ver panel de administración', async ({ page }) => {
        await page.goto('/login');
        await page.fill('#username', admin.username);
        await page.fill('#password', admin.password);
        await page.click('#btn-login');
        await expect(page).toHaveURL('**/admin/dashboard');
    });

    test('tester puede hacer login y ver dashboard estándar', async ({ page }) => {
        await page.goto('/login');
        await page.fill('#username', tester.username);
        await page.fill('#password', tester.password);
        await page.click('#btn-login');
        await expect(page).toHaveURL('**/dashboard');
    });

    test('cualquier usuario puede hacer logout', async ({ page }) => {
        await page.goto('/login');
        await page.fill('#username', tester.username);
        await page.fill('#password', tester.password);
        await page.click('#btn-login');
        await page.click('#btn-logout');
        await expect(page).toHaveURL('**/login');
    });
});</code></pre>
            </div>
        </div>

        <h3>🔗 Juntando todo: patrón completo para Playwright</h3>
        <div class="code-tabs" data-code-id="L024-8">
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
                <pre><code class="language-python"># models/user.py
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
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// models/user.ts

interface UserDataProps {
    username: string;
    password: string;
    email: string;
    rol?: string;
}

class UserData {
    readonly username: string;
    readonly password: string;
    readonly email: string;
    readonly rol: string;

    constructor(props: UserDataProps) {
        this.username = props.username;
        this.password = props.password;
        this.email = props.email;
        this.rol = props.rol ?? 'usuario';
    }

    // Factory methods (equivalente a @classmethod)
    static admin(): UserData {
        return new UserData({
            username: 'admin', password: 'Admin123!',
            email: 'admin@empresa.com', rol: 'administrador',
        });
    }

    static tester(): UserData {
        return new UserData({
            username: 'qa_tester', password: 'Test456!',
            email: 'tester@empresa.com', rol: 'tester',
        });
    }
}

// --- Uso elegante en tests ---
// const admin = UserData.admin();
// const tester = UserData.tester();
// const custom = new UserData({ username: 'juanm', password: 'Pass789!', email: 'juan@empresa.com' });</code></pre>
            </div>
        </div>

        <div class="code-tabs" data-code-id="L024-9">
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
                <pre><code class="language-python"># helpers/test_helper.py
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
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// helpers/testHelper.ts
import * as path from 'path';
import * as fs from 'fs';

export class TestHelper {
    static readonly ROOT = path.resolve(__dirname, '..');
    static readonly DATA_DIR = path.join(TestHelper.ROOT, 'test_data');
    static readonly SCREENSHOTS_DIR = path.join(TestHelper.ROOT, 'screenshots');

    static setupDirs(): void {
        fs.mkdirSync(TestHelper.SCREENSHOTS_DIR, { recursive: true });
    }

    static generarEmail(nombre: string): string {
        return \`\${nombre.toLowerCase().replace(/ /g, '.')}@test.com\`;
    }

    static cargarDatos(archivo: string): any {
        const ruta = path.join(TestHelper.DATA_DIR, archivo);
        return JSON.parse(fs.readFileSync(ruta, 'utf-8'));
    }
}

// playwright.config.ts (equivalente a conftest.py globalSetup)
import { defineConfig } from '@playwright/test';

export default defineConfig({
    globalSetup: './global-setup.ts',
});

// global-setup.ts
import { TestHelper } from './helpers/testHelper';

export default async function globalSetup() {
    TestHelper.setupDirs();
}</code></pre>
            </div>
        </div>

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
