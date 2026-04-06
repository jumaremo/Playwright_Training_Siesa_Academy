/**
 * Playwright Academy - Lección 021
 * Variables, tipos de datos y f-strings
 * Sección 3: Python para Testers QA
 */

const LESSON_021 = {
    id: 21,
    title: "Variables, tipos de datos y f-strings",
    duration: "5 min",
    level: "beginner",
    section: "section-03",
    content: `
        <h2>🐍 Variables, tipos de datos y f-strings</h2>
        <p>Python es el lenguaje principal para Playwright en el ecosistema de testing.
        Dominar variables, tipos de datos y f-strings te permitirá escribir tests más
        claros, mantenibles y dinámicos. En esta lección cubriremos todo lo que necesitas
        como tester QA.</p>

        <h3>📦 Variables y tipos de datos básicos</h3>
        <p>En Python, las variables se crean simplemente asignando un valor. No necesitas
        declarar el tipo explícitamente:</p>
        <pre><code class="python"># Tipos básicos de Python para testing

# str - Cadenas de texto (URLs, selectores, mensajes)
url_base = "https://mi-app.siesa.com"
selector_login = "#btn-login"
mensaje_error = "Credenciales inválidas"

# int - Números enteros (timeouts, contadores, puertos)
timeout_ms = 30000
max_reintentos = 3
puerto = 8080

# float - Números decimales (tiempos, porcentajes)
tiempo_carga = 2.5
porcentaje_cobertura = 85.7

# bool - Verdadero/Falso (flags, condiciones)
es_ambiente_produccion = False
headless = True
debug_mode = False

# None - Ausencia de valor
resultado_test = None</code></pre>

        <h3>📋 Colecciones de datos</h3>
        <p>Las colecciones son fundamentales para manejar datos de prueba:</p>
        <pre><code class="python"># list - Lista ordenada y mutable (datos de prueba, URLs)
navegadores = ["chromium", "firefox", "webkit"]
urls_a_verificar = ["/login", "/dashboard", "/perfil", "/reportes"]
tiempos_respuesta = [1.2, 0.8, 2.1, 0.5]

# Acceso por índice (empieza en 0)
primer_navegador = navegadores[0]    # "chromium"
ultimo_url = urls_a_verificar[-1]    # "/reportes"

# dict - Diccionario clave-valor (configuración, datos de usuario)
usuario_prueba = {
    "nombre": "Carlos Diaz",
    "email": "cdiaz@siesa.com",
    "password": "Test2026!",
    "rol": "administrador"
}

config_ambiente = {
    "base_url": "https://qa.siesa.com",
    "timeout": 30000,
    "headless": True,
    "viewport": {"width": 1280, "height": 720}
}

# Acceso a valores del diccionario
email = usuario_prueba["email"]
viewport = config_ambiente["viewport"]

# tuple - Tupla inmutable (datos que no deben cambiar)
resolucion_hd = (1920, 1080)
credenciales_admin = ("admin", "SuperSecreta123!")
codigos_exito = (200, 201, 204)</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ff9800;">
            <h4>💡 ¿Cuándo usar cada colección?</h4>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #ffe0b2;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Tipo</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Mutable</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Ordenada</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Uso en QA</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>list</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Sí</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Sí</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Datos de prueba, URLs, resultados</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>dict</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Sí</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Sí (3.7+)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Config, usuarios, payloads API</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>tuple</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">No</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Sí</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Constantes, credenciales, coordenadas</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>set</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Sí</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">No</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Tags únicos, eliminar duplicados</td>
                </tr>
            </table>
        </div>

        <h3>🏷️ Type annotations (anotaciones de tipo)</h3>
        <p>Las anotaciones de tipo no son obligatorias en Python, pero son extremadamente
        útiles en testing: mejoran autocompletado del IDE, documentan el código y
        previenen errores:</p>
        <pre><code class="python">from playwright.sync_api import Page, expect

# Variables con anotaciones de tipo
url_base: str = "https://qa.siesa.com"
timeout: int = 30000
headless: bool = True
viewport_width: float = 1280.0

# Colecciones con tipos
navegadores: list[str] = ["chromium", "firefox", "webkit"]
config: dict[str, any] = {"base_url": url_base, "timeout": timeout}
coordenadas: tuple[int, int] = (100, 200)

# Funciones con tipos (lo veremos más en la lección 022)
def obtener_titulo(page: Page) -> str:
    """Retorna el título de la página actual."""
    return page.title()

def verificar_url(page: Page, url_esperada: str) -> bool:
    """Verifica si la URL actual coincide."""
    return page.url == url_esperada

# Tipos opcionales
from typing import Optional

usuario_actual: Optional[str] = None  # Puede ser str o None
resultado: Optional[dict] = None</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #4caf50;">
            <h4>✅ Buena práctica en QA</h4>
            <p>Siempre usa type annotations en las funciones de tus helpers y fixtures.
            Esto ayuda a tu equipo a entender qué espera y qué retorna cada función,
            y el IDE detectará errores antes de ejecutar los tests.</p>
        </div>

        <h3>✨ f-strings: cadenas formateadas</h3>
        <p>Las f-strings (formatted string literals) son la forma más moderna y legible
        de crear cadenas dinámicas en Python. Son esenciales en testing:</p>
        <pre><code class="python"># Sintaxis básica: f"texto {variable}"
nombre = "Carlos"
ambiente = "QA"
saludo = f"Hola {nombre}, estás en ambiente {ambiente}"
# "Hola Carlos, estás en ambiente QA"

# Construir URLs dinámicas
base_url = "https://qa.siesa.com"
endpoint = "api/usuarios"
user_id = 42
url = f"{base_url}/{endpoint}/{user_id}"
# "https://qa.siesa.com/api/usuarios/42"

# Mensajes de assertion claros
titulo_esperado = "Dashboard"
titulo_actual = "Login"
msg = f"Se esperaba '{titulo_esperado}' pero se obtuvo '{titulo_actual}'"
assert titulo_actual == titulo_esperado, msg

# Nombres de archivos dinámicos
import datetime
fecha = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
screenshot_path = f"evidencias/screenshot_{fecha}.png"
# "evidencias/screenshot_20260403_143022.png"</code></pre>

        <h3>🔧 f-strings avanzadas para testing</h3>
        <pre><code class="python"># Expresiones dentro de f-strings
items = [1, 2, 3, 4, 5]
msg = f"Se encontraron {len(items)} elementos"
# "Se encontraron 5 elementos"

# Formato de números
tiempo = 2.34567
print(f"Tiempo de carga: {tiempo:.2f} segundos")
# "Tiempo de carga: 2.35 segundos"

porcentaje = 0.857
print(f"Cobertura: {porcentaje:.1%}")
# "Cobertura: 85.7%"

# Alineación y padding (útil para logs)
tests = [("test_login", "PASS"), ("test_dashboard", "FAIL"), ("test_perfil", "SKIP")]
for nombre, estado in tests:
    print(f"{nombre:<25} [{estado:>6}]")
# test_login                [  PASS]
# test_dashboard            [  FAIL]
# test_perfil               [  SKIP]

# Diccionarios en f-strings (usar comillas diferentes)
usuario = {"nombre": "José Bravo", "rol": "tester"}
print(f"Usuario: {usuario['nombre']} - Rol: {usuario['rol']}")

# Condicionales inline
status_code = 404
msg = f"Respuesta: {status_code} ({'OK' if status_code == 200 else 'ERROR'})"
# "Respuesta: 404 (ERROR)"</code></pre>

        <h3>🧵 Métodos de string útiles en QA</h3>
        <p>Python tiene métodos de string muy potentes para validar y transformar
        datos en tus tests:</p>
        <pre><code class="python"># --- Limpieza de datos ---
entrada_usuario = "  admin@siesa.com  \\n"
email_limpio = entrada_usuario.strip()     # "admin@siesa.com"

# --- Transformación de case ---
titulo = "Dashboard Principal"
assert titulo.lower() == "dashboard principal"
assert titulo.upper() == "DASHBOARD PRINCIPAL"

# Útil para comparaciones case-insensitive en assertions
texto_pagina = "Bienvenido al Sistema"
assert "bienvenido" in texto_pagina.lower()

# --- Verificación de prefijo/sufijo ---
url = "https://qa.siesa.com/api/v2/users"
assert url.startswith("https://")
assert url.endswith("/users")
assert not url.startswith("http://")  # Verificar que usa HTTPS

# --- Búsqueda y reemplazo ---
mensaje = "Error: usuario no encontrado en el sistema"
assert "error" in mensaje.lower()

url_template = "https://{env}.siesa.com/app"
url_qa = url_template.replace("{env}", "qa")
url_prod = url_template.replace("{env}", "prod")

# --- Split y Join ---
csv_line = "Carlos,Diaz,cdiaz@siesa.com,QA"
campos = csv_line.split(",")
# ["Carlos", "Diaz", "cdiaz@siesa.com", "QA"]

tags = ["smoke", "regression", "login"]
marcadores = " and ".join(tags)
# "smoke and regression and login"

# --- Validaciones ---
codigo = "USR-001"
assert codigo.startswith("USR-")
assert codigo.split("-")[1].isdigit()

puerto = "8080"
assert puerto.isdigit()
puerto_int = int(puerto)</code></pre>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #2196f3;">
            <h4>📌 Referencia rápida de métodos de string</h4>
            <table style="width:100%; border-collapse: collapse; font-size: 0.95em;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Método</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripción</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo en QA</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>.strip()</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Elimina espacios al inicio/final</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Limpiar texto capturado del DOM</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>.lower()</code> / <code>.upper()</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Convertir a minúsculas/mayúsculas</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Comparaciones case-insensitive</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>.replace(a, b)</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Reemplaza subcadena</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Parametrizar URLs por ambiente</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>.startswith()</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Verifica prefijo</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Validar protocolo HTTPS</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>.endswith()</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Verifica sufijo</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Validar extensión de archivos</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>in</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Busca subcadena</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Verificar texto en mensajes</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>.split(sep)</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Divide en lista</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Parsear CSVs, logs</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>.join(list)</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Une lista en string</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Construir queries, marcadores</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>.isdigit()</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Verifica si son dígitos</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Validar campos numéricos</td>
                </tr>
            </table>
        </div>

        <h3>🎭 Ejemplo completo: variables en un test Playwright</h3>
        <pre><code class="python"># test_variables_demo.py
from playwright.sync_api import Page, expect
import datetime

# --- Configuración con variables tipadas ---
BASE_URL: str = "https://qa.siesa.com"
TIMEOUT: int = 15000
USUARIO: dict[str, str] = {
    "email": "tester@siesa.com",
    "password": "Qa2026Test!",
    "nombre_completo": "José Bravo"
}

def test_login_con_variables(page: Page):
    """Demuestra el uso de variables y f-strings en un test real."""
    # Construir URL con f-string
    login_url = f"{BASE_URL}/login"
    page.goto(login_url)

    # Usar datos del diccionario
    page.fill("#email", USUARIO["email"])
    page.fill("#password", USUARIO["password"])
    page.click("button[type='submit']")

    # Assertion con mensaje dinámico
    nombre = USUARIO["nombre_completo"]
    expect(page.locator(".welcome")).to_contain_text(
        nombre,
        timeout=TIMEOUT
    )

    # Log con f-string formateada
    timestamp = datetime.datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] Login exitoso para: {USUARIO['email']}")

    # Screenshot con nombre dinámico
    fecha = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    page.screenshot(path=f"evidencias/login_{fecha}.png")

def test_verificar_urls_multiples(page: Page):
    """Usa listas y f-strings para verificar múltiples páginas."""
    paginas: list[tuple[str, str]] = [
        ("/dashboard", "Dashboard"),
        ("/perfil", "Mi Perfil"),
        ("/reportes", "Reportes"),
    ]

    resultados: list[str] = []

    for ruta, titulo_esperado in paginas:
        url = f"{BASE_URL}{ruta}"
        page.goto(url)
        titulo_actual = page.title()
        estado = "PASS" if titulo_esperado in titulo_actual else "FAIL"
        resultados.append(f"{ruta:<15} -> {estado}")

    # Resumen
    total = len(resultados)
    exitosos = sum(1 for r in resultados if "PASS" in r)
    print(f"\\nResultados: {exitosos}/{total} páginas verificadas")
    for r in resultados:
        print(f"  {r}")</code></pre>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fce4ec; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #e91e63;">
            <h4>Ejercicio: Configuración de test con variables y f-strings</h4>
            <p>Crea un archivo <code>test_variables.py</code> que haga lo siguiente:</p>
            <ol>
                <li>Define un diccionario <code>CONFIG</code> con: <code>base_url</code>, <code>timeout</code>,
                    <code>headless</code>, <code>viewport</code> (dict con width/height)</li>
                <li>Define una lista <code>USUARIOS_PRUEBA</code> con al menos 3 diccionarios,
                    cada uno con: nombre, email, password, rol</li>
                <li>Crea una función <code>generar_url(endpoint: str) -> str</code> que use f-string
                    para construir la URL completa desde <code>CONFIG["base_url"]</code></li>
                <li>Crea una función <code>resumen_usuario(usuario: dict) -> str</code> que retorne
                    un string formateado como: <code>"[ROL] Nombre (email)"</code> usando f-strings</li>
                <li>Escribe un test <code>test_mostrar_configuracion</code> que imprima:
                    <ul>
                        <li>La URL base con <code>.upper()</code></li>
                        <li>Si el modo headless está activo</li>
                        <li>El viewport como string: <code>"1280x720"</code></li>
                        <li>El resumen de cada usuario de prueba</li>
                    </ul>
                </li>
                <li>Escribe un test <code>test_generar_urls</code> que verifique que:
                    <ul>
                        <li><code>generar_url("/login")</code> termina con <code>"/login"</code></li>
                        <li><code>generar_url("/api/v2/users")</code> empieza con <code>"https://"</code></li>
                        <li>Todas las URLs generadas contienen <code>"siesa"</code></li>
                    </ul>
                </li>
            </ol>
        </div>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Conocer los tipos de datos fundamentales de Python y su uso en testing</li>
                <li>Usar colecciones (list, dict, tuple) para manejar datos de prueba</li>
                <li>Aplicar type annotations para código más robusto y documentado</li>
                <li>Dominar f-strings para construir URLs, mensajes y nombres de archivos dinámicos</li>
                <li>Utilizar métodos de string para validar y transformar datos en assertions</li>
            </ul>
        </div>
    `,
    topics: ["python", "variables", "f-strings", "tipos"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_021 = LESSON_021;
}
