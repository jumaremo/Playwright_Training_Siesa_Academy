/**
 * Playwright Academy - Lección 022
 * Funciones y módulos Python
 * Sección 3: Python para Testers QA
 */

const LESSON_022 = {
    id: 22,
    title: "Funciones y módulos Python",
    duration: "5 min",
    level: "beginner",
    section: "section-03",
    content: `
        <h2>⚙️ Funciones y módulos Python</h2>
        <p>Las funciones y los módulos son los bloques fundamentales para organizar tu código
        de testing. Funciones bien diseñadas hacen que tus tests sean legibles, reutilizables
        y fáciles de mantener. En esta lección aprenderás a crear funciones y módulos
        orientados a la automatización con Playwright.</p>

        <h3>📐 Definir funciones con <code>def</code></h3>
        <p>Una función encapsula lógica reutilizable. En testing, las funciones son la base
        de helpers, page objects y utilidades:</p>
        <div class="code-tabs" data-code-id="L022-1">
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
                <pre><code class="language-python"># Función básica sin parámetros
def obtener_timestamp() -> str:
    """Retorna un timestamp formateado para nombres de archivo."""
    from datetime import datetime
    return datetime.now().strftime("%Y%m%d_%H%M%S")

# Función con parámetros y retorno
def construir_url(base: str, endpoint: str) -> str:
    """Construye una URL completa a partir de base y endpoint."""
    base = base.rstrip("/")
    endpoint = endpoint.lstrip("/")
    return f"{base}/{endpoint}"

# Uso
url = construir_url("https://qa.siesa.com", "/api/v2/users")
# "https://qa.siesa.com/api/v2/users"

timestamp = obtener_timestamp()
# "20260403_143022"</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Función básica sin parámetros
function obtenerTimestamp(): string {
    return new Date().toISOString().replace(/[:.]/g, '').slice(0, 15);
}

// Función con parámetros y retorno
function construirUrl(base: string, endpoint: string): string {
    base = base.replace(/\\/+\$/, '');
    endpoint = endpoint.replace(/^\\/+/, '');
    return \`\${base}/\${endpoint}\`;
}

// Uso
const url = construirUrl('https://qa.siesa.com', '/api/v2/users');
// 'https://qa.siesa.com/api/v2/users'

const timestamp = obtenerTimestamp();
// '20260403T143022'</code></pre>
            </div>
        </div>

        <h3>🔧 Parámetros por defecto y keyword arguments</h3>
        <p>Los parámetros por defecto hacen tus funciones más flexibles sin complicar
        las llamadas simples:</p>
        <div class="code-tabs" data-code-id="L022-2">
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
                <pre><code class="language-python">from playwright.sync_api import Page

def hacer_login(
    page: Page,
    usuario: str,
    password: str,
    url: str = "/login",
    timeout: int = 10000,
    recordar_sesion: bool = False
) -> bool:
    """
    Realiza login en la aplicación.

    Args:
        page: Página de Playwright
        usuario: Nombre de usuario o email
        password: Contraseña
        url: Ruta del login (default: /login)
        timeout: Tiempo máximo de espera en ms (default: 10000)
        recordar_sesion: Marcar checkbox "Recordarme" (default: False)

    Returns:
        True si el login fue exitoso, False si falló
    """
    page.goto(url)
    page.fill("#usuario", usuario, timeout=timeout)
    page.fill("#password", password, timeout=timeout)

    if recordar_sesion:
        page.check("#recordarme")

    page.click("button[type='submit']")

    try:
        page.wait_for_url("**/dashboard", timeout=timeout)
        return True
    except Exception:
        return False

# --- Diferentes formas de llamar la función ---

# Solo argumentos obligatorios (usa defaults para el resto)
hacer_login(page, "admin", "secreto123")

# Con keyword arguments explícitos
hacer_login(
    page,
    usuario="admin",
    password="secreto123",
    recordar_sesion=True,
    timeout=15000
)

# Mezcla de posicionales y keyword
hacer_login(page, "admin", "secreto123", timeout=5000)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { Page } from '@playwright/test';

// En TS se usa un objeto de opciones para simular keyword arguments
interface LoginOptions {
    url?: string;
    timeout?: number;
    recordarSesion?: boolean;
}

async function hacerLogin(
    page: Page,
    usuario: string,
    password: string,
    options: LoginOptions = {}
): Promise&lt;boolean&gt; {
    const {
        url = '/login',
        timeout = 10000,
        recordarSesion = false,
    } = options;

    await page.goto(url);
    await page.fill('#usuario', usuario, { timeout });
    await page.fill('#password', password, { timeout });

    if (recordarSesion) {
        await page.check('#recordarme');
    }

    await page.click("button[type='submit']");

    try {
        await page.waitForURL('**/dashboard', { timeout });
        return true;
    } catch {
        return false;
    }
}

// --- Diferentes formas de llamar la función ---

// Solo argumentos obligatorios (usa defaults para el resto)
await hacerLogin(page, 'admin', 'secreto123');

// Con opciones explícitas (equivalente a keyword arguments)
await hacerLogin(page, 'admin', 'secreto123', {
    recordarSesion: true,
    timeout: 15000,
});

// Con solo timeout
await hacerLogin(page, 'admin', 'secreto123', { timeout: 5000 });</code></pre>
            </div>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #4caf50;">
            <h4>✅ Buena práctica</h4>
            <p>Siempre documenta tus funciones con docstrings. Incluye: qué hace, qué parámetros
            recibe y qué retorna. Tu equipo (y tu yo futuro) lo agradecerán.</p>
        </div>

        <h3>📦 Funciones que retornan múltiples valores</h3>
        <div class="code-tabs" data-code-id="L022-3">
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
                <pre><code class="language-python">from playwright.sync_api import Page
import time

def medir_carga_pagina(page: Page, url: str) -> tuple[float, str, int]:
    """
    Mide el tiempo de carga de una página.

    Returns:
        Tupla con (tiempo_segundos, titulo_pagina, status_code)
    """
    inicio = time.time()
    response = page.goto(url)
    tiempo = time.time() - inicio
    titulo = page.title()
    status = response.status if response else 0

    return tiempo, titulo, status

# Desempaquetar los valores retornados
tiempo, titulo, status = medir_carga_pagina(page, "https://qa.siesa.com")
print(f"Carga: {tiempo:.2f}s | Título: {titulo} | Status: {status}")

# También puedes retornar un diccionario
def obtener_info_pagina(page: Page) -> dict:
    """Retorna información completa de la página actual."""
    return {
        "url": page.url,
        "titulo": page.title(),
        "viewport": page.viewport_size,
    }

info = obtener_info_pagina(page)
print(f"Estás en: {info['url']}")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { Page } from '@playwright/test';

interface PageLoadResult {
    tiempo: number;
    titulo: string;
    status: number;
}

async function medirCargaPagina(page: Page, url: string): Promise&lt;PageLoadResult&gt; {
    const inicio = Date.now();
    const response = await page.goto(url);
    const tiempo = (Date.now() - inicio) / 1000;
    const titulo = await page.title();
    const status = response?.status() ?? 0;

    return { tiempo, titulo, status };
}

// Desestructurar los valores retornados
const { tiempo, titulo, status } = await medirCargaPagina(page, 'https://qa.siesa.com');
console.log(\`Carga: \${tiempo.toFixed(2)}s | Título: \${titulo} | Status: \${status}\`);

// También puedes retornar un objeto
interface PageInfo {
    url: string;
    titulo: string;
    viewport: { width: number; height: number } | null;
}

async function obtenerInfoPagina(page: Page): Promise&lt;PageInfo&gt; {
    return {
        url: page.url(),
        titulo: await page.title(),
        viewport: page.viewportSize(),
    };
}

const info = await obtenerInfoPagina(page);
console.log(\`Estás en: \${info.url}\`);</code></pre>
            </div>
        </div>

        <h3>🌟 *args y **kwargs</h3>
        <p>Permiten que tus funciones acepten un número variable de argumentos.
        Son útiles para crear wrappers y funciones genéricas:</p>
        <div class="code-tabs" data-code-id="L022-4">
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
                <pre><code class="language-python"># *args - Acepta N argumentos posicionales como tupla
def log_pasos(*pasos: str) -> None:
    """Imprime una serie de pasos de test numerados."""
    for i, paso in enumerate(pasos, 1):
        print(f"  Paso {i}: {paso}")

log_pasos(
    "Navegar al login",
    "Ingresar credenciales",
    "Click en Enviar",
    "Verificar dashboard"
)
# Paso 1: Navegar al login
# Paso 2: Ingresar credenciales
# Paso 3: Click en Enviar
# Paso 4: Verificar dashboard

# **kwargs - Acepta N argumentos con nombre como diccionario
def crear_usuario(**datos) -> dict:
    """Crea un diccionario de usuario con valores por defecto."""
    usuario = {
        "nombre": datos.get("nombre", "Usuario Test"),
        "email": datos.get("email", "test@siesa.com"),
        "password": datos.get("password", "Test2026!"),
        "rol": datos.get("rol", "viewer"),
        "activo": datos.get("activo", True),
    }
    return usuario

# Crear con diferentes combinaciones
admin = crear_usuario(nombre="Carlos Diaz", rol="admin", email="cdiaz@siesa.com")
viewer = crear_usuario(nombre="José Bravo")
default = crear_usuario()  # Todos los valores por defecto

# Combinación de *args y **kwargs
def ejecutar_test(nombre_test: str, *tags: str, **config) -> None:
    """Simula la ejecución de un test con tags y configuración."""
    print(f"Test: {nombre_test}")
    print(f"  Tags: {', '.join(tags)}")
    for clave, valor in config.items():
        print(f"  {clave}: {valor}")

ejecutar_test(
    "test_login",
    "smoke", "regression", "login",
    timeout=5000,
    headless=True,
    browser="chromium"
)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Rest parameters (...args) - Equivalente a *args
function logPasos(...pasos: string[]): void {
    pasos.forEach((paso, i) => {
        console.log(\`  Paso \${i + 1}: \${paso}\`);
    });
}

logPasos(
    'Navegar al login',
    'Ingresar credenciales',
    'Click en Enviar',
    'Verificar dashboard'
);

// Objeto de opciones - Equivalente a **kwargs
interface UserOptions {
    nombre?: string;
    email?: string;
    password?: string;
    rol?: string;
    activo?: boolean;
}

function crearUsuario(datos: UserOptions = {}): Record&lt;string, any&gt; {
    return {
        nombre: datos.nombre ?? 'Usuario Test',
        email: datos.email ?? 'test@siesa.com',
        password: datos.password ?? 'Test2026!',
        rol: datos.rol ?? 'viewer',
        activo: datos.activo ?? true,
    };
}

// Crear con diferentes combinaciones
const admin = crearUsuario({ nombre: 'Carlos Diaz', rol: 'admin', email: 'cdiaz@siesa.com' });
const viewer = crearUsuario({ nombre: 'José Bravo' });
const defaultUser = crearUsuario();  // Todos los valores por defecto

// Combinación de rest params + opciones
interface TestConfig {
    timeout?: number;
    headless?: boolean;
    browser?: string;
}

function ejecutarTest(nombreTest: string, tags: string[], config: TestConfig = {}): void {
    console.log(\`Test: \${nombreTest}\`);
    console.log(\`  Tags: \${tags.join(', ')}\`);
    for (const [clave, valor] of Object.entries(config)) {
        console.log(\`  \${clave}: \${valor}\`);
    }
}

ejecutarTest(
    'test_login',
    ['smoke', 'regression', 'login'],
    { timeout: 5000, headless: true, browser: 'chromium' }
);</code></pre>
            </div>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ff9800;">
            <h4>💡 Orden de parámetros</h4>
            <p>El orden obligatorio de parámetros en Python es:</p>
            <pre><code class="language-python">def funcion(posicionales, *args, keyword_con_default=valor, **kwargs):
    pass</code></pre>
            <p>En la práctica, rara vez necesitarás mezclar todos. Lo más común es usar
            parámetros normales + defaults, o <code>**kwargs</code> para configuración flexible.</p>
        </div>

        <h3>🔀 Funciones lambda</h3>
        <p>Las lambdas son funciones anónimas de una sola línea. Son útiles para
        ordenar, filtrar y transformar datos de prueba:</p>
        <div class="code-tabs" data-code-id="L022-5">
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
                <pre><code class="language-python"># Sintaxis: lambda parámetros: expresión

# --- Ordenar datos de prueba ---
resultados_test = [
    {"nombre": "test_login", "duracion": 3.2, "estado": "pass"},
    {"nombre": "test_dashboard", "duracion": 1.5, "estado": "fail"},
    {"nombre": "test_perfil", "duracion": 5.1, "estado": "pass"},
    {"nombre": "test_reportes", "duracion": 0.8, "estado": "skip"},
]

# Ordenar por duración (más lentos primero)
por_duracion = sorted(resultados_test, key=lambda t: t["duracion"], reverse=True)
# test_perfil (5.1), test_login (3.2), test_dashboard (1.5), test_reportes (0.8)

# --- Filtrar tests fallidos ---
fallidos = list(filter(lambda t: t["estado"] == "fail", resultados_test))
# [{"nombre": "test_dashboard", ...}]

# --- Transformar datos ---
nombres = list(map(lambda t: t["nombre"], resultados_test))
# ["test_login", "test_dashboard", "test_perfil", "test_reportes"]

# --- Uso práctico: ordenar locators por texto ---
# Supongamos que obtienes una lista de textos de elementos
textos_menu = ["Reportes", "Dashboard", "Ajustes", "Perfil"]
textos_ordenados = sorted(textos_menu, key=lambda t: t.lower())
# ["Ajustes", "Dashboard", "Perfil", "Reportes"]

# --- Lambda en pytest parametrize ---
import pytest

generar_email = lambda nombre: f"{nombre.lower().replace(' ', '.')}@siesa.com"

nombres_prueba = ["Carlos Diaz", "José Bravo", "Ana López"]
emails_esperados = list(map(generar_email, nombres_prueba))
# ["carlos.diaz@siesa.com", "josé.bravo@siesa.com", "ana.lópez@siesa.com"]</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Sintaxis: (params) => expresión  o  (params) => { ... }

// --- Ordenar datos de prueba ---
const resultadosTest = [
    { nombre: 'test_login', duracion: 3.2, estado: 'pass' },
    { nombre: 'test_dashboard', duracion: 1.5, estado: 'fail' },
    { nombre: 'test_perfil', duracion: 5.1, estado: 'pass' },
    { nombre: 'test_reportes', duracion: 0.8, estado: 'skip' },
];

// Ordenar por duración (más lentos primero)
const porDuracion = [...resultadosTest].sort((a, b) => b.duracion - a.duracion);
// test_perfil (5.1), test_login (3.2), test_dashboard (1.5), test_reportes (0.8)

// --- Filtrar tests fallidos ---
const fallidos = resultadosTest.filter((t) => t.estado === 'fail');
// [{ nombre: 'test_dashboard', ... }]

// --- Transformar datos ---
const nombres = resultadosTest.map((t) => t.nombre);
// ['test_login', 'test_dashboard', 'test_perfil', 'test_reportes']

// --- Uso práctico: ordenar locators por texto ---
const textosMenu = ['Reportes', 'Dashboard', 'Ajustes', 'Perfil'];
const textosOrdenados = [...textosMenu].sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
);
// ['Ajustes', 'Dashboard', 'Perfil', 'Reportes']

// --- Arrow function para generar emails ---
const generarEmail = (nombre: string): string =>
    \`\${nombre.toLowerCase().replace(/ /g, '.')}@siesa.com\`;

const nombresPrueba = ['Carlos Diaz', 'José Bravo', 'Ana López'];
const emailsEsperados = nombresPrueba.map(generarEmail);
// ['carlos.diaz@siesa.com', 'josé.bravo@siesa.com', 'ana.lópez@siesa.com']</code></pre>
            </div>
        </div>

        <h3>📁 Crear y usar módulos</h3>
        <p>Un módulo es simplemente un archivo <code>.py</code> que contiene funciones,
        clases y variables reutilizables. En testing, los módulos organizan tu código
        en utilidades separadas:</p>
        <div class="code-tabs" data-code-id="L022-6">
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
                <pre><code class="language-python"># --- tests/utils/helpers.py ---
"""Módulo de utilidades para tests de Playwright."""

from datetime import datetime
from playwright.sync_api import Page


def timestamp() -> str:
    """Retorna timestamp para nombres de archivos."""
    return datetime.now().strftime("%Y%m%d_%H%M%S")


def screenshot_con_nombre(page: Page, nombre: str) -> str:
    """Toma screenshot con nombre descriptivo y timestamp."""
    path = f"evidencias/{nombre}_{timestamp()}.png"
    page.screenshot(path=path)
    return path


def esperar_y_click(page: Page, selector: str, timeout: int = 5000) -> None:
    """Espera a que un elemento sea visible y hace click."""
    page.wait_for_selector(selector, state="visible", timeout=timeout)
    page.click(selector)


def obtener_texto_limpio(page: Page, selector: str) -> str:
    """Obtiene el texto de un elemento, limpio de espacios extra."""
    texto = page.text_content(selector) or ""
    return texto.strip()


def llenar_formulario(page: Page, campos: dict[str, str]) -> None:
    """Llena un formulario a partir de un diccionario selector -> valor."""
    for selector, valor in campos.items():
        page.fill(selector, valor)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// --- tests/utils/helpers.ts ---
import { Page } from '@playwright/test';

export function timestamp(): string {
    return new Date().toISOString().replace(/[:.]/g, '').slice(0, 15);
}

export async function screenshotConNombre(page: Page, nombre: string): Promise&lt;string&gt; {
    const path = \`evidencias/\${nombre}_\${timestamp()}.png\`;
    await page.screenshot({ path });
    return path;
}

export async function esperarYClick(
    page: Page,
    selector: string,
    timeout: number = 5000
): Promise&lt;void&gt; {
    await page.waitForSelector(selector, { state: 'visible', timeout });
    await page.click(selector);
}

export async function obtenerTextoLimpio(page: Page, selector: string): Promise&lt;string&gt; {
    const texto = await page.textContent(selector) ?? '';
    return texto.trim();
}

export async function llenarFormulario(
    page: Page,
    campos: Record&lt;string, string&gt;
): Promise&lt;void&gt; {
    for (const [selector, valor] of Object.entries(campos)) {
        await page.fill(selector, valor);
    }
}</code></pre>
            </div>
        </div>

        <div class="code-tabs" data-code-id="L022-7">
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
                <pre><code class="language-python"># --- tests/utils/config.py ---
"""Módulo de configuración centralizada."""

# Ambientes disponibles
AMBIENTES = {
    "dev": "https://dev.siesa.com",
    "qa": "https://qa.siesa.com",
    "staging": "https://staging.siesa.com",
    "prod": "https://app.siesa.com",
}

# Ambiente activo (cambiar según necesidad)
AMBIENTE_ACTIVO = "qa"
BASE_URL = AMBIENTES[AMBIENTE_ACTIVO]

# Timeouts en milisegundos
TIMEOUTS = {
    "default": 10000,
    "navegacion": 15000,
    "carga_lenta": 30000,
    "animacion": 2000,
}

# Usuarios de prueba
USUARIOS = {
    "admin": {"email": "admin@siesa.com", "password": "Admin2026!"},
    "viewer": {"email": "viewer@siesa.com", "password": "View2026!"},
    "editor": {"email": "editor@siesa.com", "password": "Edit2026!"},
}</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// --- tests/utils/config.ts ---

// Ambientes disponibles
export const AMBIENTES: Record&lt;string, string&gt; = {
    dev: 'https://dev.siesa.com',
    qa: 'https://qa.siesa.com',
    staging: 'https://staging.siesa.com',
    prod: 'https://app.siesa.com',
};

// Ambiente activo (cambiar según necesidad)
export const AMBIENTE_ACTIVO = 'qa';
export const BASE_URL = AMBIENTES[AMBIENTE_ACTIVO];

// Timeouts en milisegundos
export const TIMEOUTS = {
    default: 10000,
    navegacion: 15000,
    cargaLenta: 30000,
    animacion: 2000,
};

// Usuarios de prueba
export const USUARIOS = {
    admin: { email: 'admin@siesa.com', password: 'Admin2026!' },
    viewer: { email: 'viewer@siesa.com', password: 'View2026!' },
    editor: { email: 'editor@siesa.com', password: 'Edit2026!' },
};</code></pre>
            </div>
        </div>

        <h3>📂 Importar módulos propios</h3>
        <div class="code-tabs" data-code-id="L022-8">
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
                <pre><code class="language-python"># Estructura del proyecto
# tests/
# ├── utils/
# │   ├── __init__.py       # Hace que utils sea un paquete
# │   ├── helpers.py
# │   └── config.py
# ├── conftest.py
# └── test_ejemplo.py

# --- tests/utils/__init__.py ---
"""Paquete de utilidades de testing."""
# Puede estar vacío o re-exportar funciones clave:
from .helpers import screenshot_con_nombre, esperar_y_click
from .config import BASE_URL, TIMEOUTS, USUARIOS

# --- tests/test_ejemplo.py ---
from playwright.sync_api import Page, expect

# Importar desde el módulo específico
from utils.helpers import llenar_formulario, obtener_texto_limpio
from utils.config import BASE_URL, USUARIOS, TIMEOUTS

# O importar todo lo re-exportado desde __init__
from utils import screenshot_con_nombre, esperar_y_click


def test_login_con_helpers(page: Page):
    """Test que usa funciones de los módulos utils."""
    page.goto(f"{BASE_URL}/login")

    # Llenar formulario con helper
    admin = USUARIOS["admin"]
    llenar_formulario(page, {
        "#email": admin["email"],
        "#password": admin["password"],
    })

    # Click con espera
    esperar_y_click(page, "button[type='submit']")

    # Verificar con texto limpio
    bienvenida = obtener_texto_limpio(page, ".welcome-message")
    assert "bienvenido" in bienvenida.lower()

    # Screenshot de evidencia
    screenshot_con_nombre(page, "login_exitoso")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Estructura del proyecto
// tests/
// ├── utils/
// │   ├── helpers.ts          # Funciones helper
// │   ├── config.ts           # Configuración
// │   └── index.ts            # Re-exportar (equivalente a __init__.py)
// ├── playwright.config.ts
// └── test_ejemplo.spec.ts

// --- tests/utils/index.ts ---
// Re-exportar funciones clave:
export { screenshotConNombre, esperarYClick } from './helpers';
export { BASE_URL, TIMEOUTS, USUARIOS } from './config';

// --- tests/test_ejemplo.spec.ts ---
import { test, expect } from '@playwright/test';

// Importar desde el módulo específico
import { llenarFormulario, obtenerTextoLimpio } from './utils/helpers';
import { BASE_URL, USUARIOS, TIMEOUTS } from './utils/config';

// O importar desde el barrel export (index.ts)
import { screenshotConNombre, esperarYClick } from './utils';


test('login con helpers', async ({ page }) => {
    await page.goto(\`\${BASE_URL}/login\`);

    // Llenar formulario con helper
    const admin = USUARIOS.admin;
    await llenarFormulario(page, {
        '#email': admin.email,
        '#password': admin.password,
    });

    // Click con espera
    await esperarYClick(page, "button[type='submit']");

    // Verificar con texto limpio
    const bienvenida = await obtenerTextoLimpio(page, '.welcome-message');
    expect(bienvenida.toLowerCase()).toContain('bienvenido');

    // Screenshot de evidencia
    await screenshotConNombre(page, 'login_exitoso');
});</code></pre>
            </div>
        </div>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #9c27b0;">
            <h4>📦 Estructura recomendada de módulos para QA</h4>
            <pre><code>tests/
├── utils/
│   ├── __init__.py         # Re-exportar funciones clave
│   ├── config.py           # URLs, timeouts, credenciales
│   ├── helpers.py          # Funciones helper genéricas
│   ├── data_factory.py     # Generación de datos de prueba
│   └── assertions.py       # Assertions personalizadas
├── pages/
│   ├── __init__.py
│   ├── login_page.py       # Page Object: Login
│   └── dashboard_page.py   # Page Object: Dashboard
├── conftest.py             # Fixtures compartidas
├── test_login.py
└── test_dashboard.py</code></pre>
        </div>

        <h3>🎯 El patrón <code>__name__ == "__main__"</code></h3>
        <p>Este patrón permite que un archivo funcione tanto como módulo importable
        como script ejecutable directamente:</p>
        <div class="code-tabs" data-code-id="L022-9">
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
                <pre><code class="language-python"># --- tests/utils/data_factory.py ---
"""Generador de datos de prueba."""

import random
import string
from datetime import datetime, timedelta


def generar_email(nombre: str, dominio: str = "siesa.com") -> str:
    """Genera un email a partir de un nombre."""
    nombre_limpio = nombre.lower().replace(" ", ".")
    return f"{nombre_limpio}@{dominio}"


def generar_password(longitud: int = 12) -> str:
    """Genera un password aleatorio seguro."""
    caracteres = string.ascii_letters + string.digits + "!@#\$%"
    return ''.join(random.choices(caracteres, k=longitud))


def generar_fecha_futura(dias: int = 30) -> str:
    """Genera una fecha futura en formato ISO."""
    fecha = datetime.now() + timedelta(days=dias)
    return fecha.strftime("%Y-%m-%d")


def generar_usuario_prueba(rol: str = "viewer") -> dict:
    """Genera un usuario de prueba completo."""
    nombres = ["Ana García", "Carlos López", "María Torres", "José Ruiz"]
    nombre = random.choice(nombres)
    return {
        "nombre": nombre,
        "email": generar_email(nombre),
        "password": generar_password(),
        "rol": rol,
        "fecha_creacion": datetime.now().strftime("%Y-%m-%d"),
    }


# --- Este bloque SOLO se ejecuta si corres el archivo directamente ---
if __name__ == "__main__":
    # Útil para testing rápido y verificación
    print("=== Generador de datos de prueba ===")
    print(f"Email: {generar_email('Juan Reina')}")
    print(f"Password: {generar_password()}")
    print(f"Fecha futura: {generar_fecha_futura(7)}")
    print(f"\\nUsuario completo:")
    usuario = generar_usuario_prueba("admin")
    for clave, valor in usuario.items():
        print(f"  {clave}: {valor}")

# Ejecución directa:
#   python tests/utils/data_factory.py
#   -> Imprime los datos generados

# Como módulo importado:
#   from utils.data_factory import generar_usuario_prueba
#   -> El bloque if __name__ NO se ejecuta</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// --- tests/utils/dataFactory.ts ---
// En TypeScript no existe __name__ == "__main__" nativo,
// pero se puede usar require.main === module o simplemente
// separar en funciones exportadas.

import { randomBytes } from 'crypto';

export function generarEmail(nombre: string, dominio = 'siesa.com'): string {
    const nombreLimpio = nombre.toLowerCase().replace(/ /g, '.');
    return \`\${nombreLimpio}@\${dominio}\`;
}

export function generarPassword(longitud = 12): string {
    const caracteres = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#\$%';
    let password = '';
    for (let i = 0; i &lt; longitud; i++) {
        password += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return password;
}

export function generarFechaFutura(dias = 30): string {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString().slice(0, 10);
}

export function generarUsuarioPrueba(rol = 'viewer'): Record&lt;string, string&gt; {
    const nombres = ['Ana García', 'Carlos López', 'María Torres', 'José Ruiz'];
    const nombre = nombres[Math.floor(Math.random() * nombres.length)];
    return {
        nombre,
        email: generarEmail(nombre),
        password: generarPassword(),
        rol,
        fechaCreacion: new Date().toISOString().slice(0, 10),
    };
}

// Equivalente a if __name__ == "__main__":
// Ejecutar con: npx ts-node tests/utils/dataFactory.ts
if (require.main === module) {
    console.log('=== Generador de datos de prueba ===');
    console.log(\`Email: \${generarEmail('Juan Reina')}\`);
    console.log(\`Password: \${generarPassword()}\`);
    console.log(\`Fecha futura: \${generarFechaFutura(7)}\`);
    console.log('\\nUsuario completo:');
    const usuario = generarUsuarioPrueba('admin');
    for (const [clave, valor] of Object.entries(usuario)) {
        console.log(\`  \${clave}: \${valor}\`);
    }
}</code></pre>
            </div>
        </div>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #2196f3;">
            <h4>📌 ¿Cuándo usar <code>__name__ == "__main__"</code>?</h4>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Escenario</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">¿Usar?</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Verificar utilidades rápidamente</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Sí</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>python utils/helpers.py</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Generar datos de prueba ad-hoc</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Sí</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>python utils/data_factory.py</code></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Archivo solo de constantes</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">No</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>config.py</code> con solo variables</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Archivos de test</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">No</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">pytest los descubre automáticamente</td>
                </tr>
            </table>
        </div>

        <h3>🎭 Ejemplo integrador: módulo de helpers para Playwright</h3>
        <div class="code-tabs" data-code-id="L022-10">
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
                <pre><code class="language-python"># --- tests/utils/pw_helpers.py ---
"""Helpers específicos para Playwright - proyecto SIESA."""

from playwright.sync_api import Page, expect, Locator
from typing import Optional
import logging

logger = logging.getLogger("pw_helpers")


def login(page: Page, email: str, password: str, base_url: str = "") -> bool:
    """Realiza login y retorna True si fue exitoso."""
    page.goto(f"{base_url}/login")
    page.fill("#email", email)
    page.fill("#password", password)
    page.click("button[type='submit']")
    try:
        page.wait_for_url("**/dashboard", timeout=10000)
        logger.info(f"Login exitoso: {email}")
        return True
    except Exception as e:
        logger.error(f"Login fallido: {email} - {e}")
        return False


def verificar_tabla(
    page: Page,
    selector_tabla: str,
    filas_minimas: int = 1,
    columnas_esperadas: Optional[list[str]] = None,
) -> dict:
    """
    Verifica una tabla HTML y retorna información sobre ella.

    Returns:
        dict con claves: filas, columnas, headers, datos_primera_fila
    """
    tabla = page.locator(selector_tabla)
    expect(tabla).to_be_visible()

    headers = tabla.locator("thead th").all_text_contents()
    filas = tabla.locator("tbody tr")
    num_filas = filas.count()

    # Verificar mínimo de filas
    assert num_filas >= filas_minimas, \\
        f"Se esperaban >= {filas_minimas} filas, hay {num_filas}"

    # Verificar columnas si se especificaron
    if columnas_esperadas:
        headers_limpios = [h.strip().lower() for h in headers]
        for col in columnas_esperadas:
            assert col.lower() in headers_limpios, \\
                f"Columna '{col}' no encontrada. Headers: {headers}"

    # Datos de la primera fila
    primera_fila = filas.first.locator("td").all_text_contents()

    return {
        "filas": num_filas,
        "columnas": len(headers),
        "headers": headers,
        "datos_primera_fila": primera_fila,
    }


def esperar_toast(page: Page, texto: str, timeout: int = 5000) -> Locator:
    """Espera un mensaje toast/notificación con texto específico."""
    toast = page.locator(f".toast:has-text('{texto}'), .notification:has-text('{texto}')")
    expect(toast.first).to_be_visible(timeout=timeout)
    return toast.first


# --- Uso en tests ---
# from utils.pw_helpers import login, verificar_tabla, esperar_toast
#
# def test_tabla_usuarios(page: Page):
#     login(page, "admin@siesa.com", "Admin2026!", BASE_URL)
#     page.goto(f"{BASE_URL}/admin/usuarios")
#     info = verificar_tabla(
#         page, "table.usuarios",
#         filas_minimas=5,
#         columnas_esperadas=["Nombre", "Email", "Rol"]
#     )
#     print(f"Tabla tiene {info['filas']} usuarios")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// --- tests/utils/pwHelpers.ts ---
import { Page, expect, Locator } from '@playwright/test';

export async function login(
    page: Page,
    email: string,
    password: string,
    baseUrl = ''
): Promise&lt;boolean&gt; {
    await page.goto(\`\${baseUrl}/login\`);
    await page.fill('#email', email);
    await page.fill('#password', password);
    await page.click("button[type='submit']");
    try {
        await page.waitForURL('**/dashboard', { timeout: 10000 });
        console.log(\`[INFO] Login exitoso: \${email}\`);
        return true;
    } catch (e) {
        console.error(\`[ERROR] Login fallido: \${email} - \${e}\`);
        return false;
    }
}

interface TablaInfo {
    filas: number;
    columnas: number;
    headers: string[];
    datosPrimeraFila: string[];
}

export async function verificarTabla(
    page: Page,
    selectorTabla: string,
    filasMinimas = 1,
    columnasEsperadas?: string[],
): Promise&lt;TablaInfo&gt; {
    const tabla = page.locator(selectorTabla);
    await expect(tabla).toBeVisible();

    const headers = await tabla.locator('thead th').allTextContents();
    const filas = tabla.locator('tbody tr');
    const numFilas = await filas.count();

    expect(numFilas).toBeGreaterThanOrEqual(filasMinimas);

    if (columnasEsperadas) {
        const headersLimpios = headers.map(h => h.trim().toLowerCase());
        for (const col of columnasEsperadas) {
            expect(headersLimpios).toContain(col.toLowerCase());
        }
    }

    const primeraFila = await filas.first().locator('td').allTextContents();

    return {
        filas: numFilas,
        columnas: headers.length,
        headers,
        datosPrimeraFila: primeraFila,
    };
}

export async function esperarToast(
    page: Page,
    texto: string,
    timeout = 5000
): Promise&lt;Locator&gt; {
    const toast = page.locator(
        \`.toast:has-text('\${texto}'), .notification:has-text('\${texto}')\`
    );
    await expect(toast.first()).toBeVisible({ timeout });
    return toast.first();
}

// --- Uso en tests ---
// import { login, verificarTabla, esperarToast } from './utils/pwHelpers';
//
// test('tabla usuarios', async ({ page }) => {
//     await login(page, 'admin@siesa.com', 'Admin2026!', BASE_URL);
//     await page.goto(\`\${BASE_URL}/admin/usuarios\`);
//     const info = await verificarTabla(
//         page, 'table.usuarios',
//         5,
//         ['Nombre', 'Email', 'Rol']
//     );
//     console.log(\`Tabla tiene \${info.filas} usuarios\`);
// });</code></pre>
            </div>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fce4ec; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #e91e63;">
            <h4>Ejercicio: Crear un módulo de utilidades para testing</h4>
            <p>Crea la siguiente estructura y archivos:</p>
            <ol>
                <li>Crea <code>tests/utils/__init__.py</code> (puede estar vacío inicialmente)</li>
                <li>Crea <code>tests/utils/test_helpers.py</code> con estas funciones:
                    <ul>
                        <li><code>generar_email(nombre: str) -> str</code> - convierte "Juan Reina" en "juan.reina@test.com"</li>
                        <li><code>generar_password(longitud: int = 10) -> str</code> - password aleatorio</li>
                        <li><code>construir_url(base: str, *partes: str) -> str</code> - une partes de URL con "/"</li>
                        <li><code>filtrar_por_estado(resultados: list[dict], estado: str) -> list[dict]</code> - usa lambda+filter</li>
                        <li><code>resumen_resultados(**conteos) -> str</code> - usa **kwargs para "pass=5, fail=2, skip=1"</li>
                    </ul>
                </li>
                <li>Agrega un bloque <code>if __name__ == "__main__"</code> que demuestre todas las funciones</li>
                <li>Crea <code>tests/test_helpers.py</code> que importe y use las funciones:
                    <ul>
                        <li><code>test_generar_email</code>: verifica que contiene "@" y el nombre</li>
                        <li><code>test_construir_url</code>: verifica URL completa con múltiples partes</li>
                        <li><code>test_filtrar_resultados</code>: filtra una lista de resultados por "fail"</li>
                        <li><code>test_resumen</code>: genera resumen con diferentes conteos</li>
                    </ul>
                </li>
                <li>Ejecuta: <code>python tests/utils/test_helpers.py</code> (modo directo)
                    y luego <code>pytest tests/test_helpers.py -v</code> (modo test)</li>
            </ol>
        </div>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Definir funciones con parámetros, defaults y type annotations</li>
                <li>Usar keyword arguments para configuración flexible de funciones</li>
                <li>Entender *args y **kwargs para funciones genéricas</li>
                <li>Aplicar funciones lambda para ordenar, filtrar y transformar datos de test</li>
                <li>Crear módulos Python organizados con helpers reutilizables</li>
                <li>Usar el patrón <code>__name__ == "__main__"</code> para verificación rápida</li>
                <li>Estructurar un proyecto de testing con módulos bien organizados</li>
            </ul>
        </div>
    `,
    topics: ["funciones", "módulos", "python"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_022 = LESSON_022;
}
