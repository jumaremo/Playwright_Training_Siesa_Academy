/**
 * Playwright Academy - Lección 094
 * Playwright Codegen
 * Sección 14: Debugging: Inspector, Trace, Codegen
 */

const LESSON_094 = {
    id: 94,
    title: "Playwright Codegen",
    duration: "7 min",
    level: "intermediate",
    section: "section-14",
    content: `
        <h2>🎬 Playwright Codegen</h2>
        <p><strong>Playwright Codegen</strong> es una herramienta integrada que <strong>graba tus acciones en el
        navegador</strong> y genera automáticamente código de test listo para ejecutar. Es el punto de partida
        más rápido para crear tests: navegas por la aplicación como lo haría un usuario, y Codegen escribe
        el código Python por ti en tiempo real.</p>

        <h3>🔍 ¿Qué es Codegen?</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Codegen (Code Generator) es un <strong>grabador de interacciones</strong> incluido en Playwright
            que abre dos ventanas simultáneamente:</p>
            <ul>
                <li><strong>Ventana del navegador:</strong> Donde interactúas normalmente con la aplicación</li>
                <li><strong>Ventana de Playwright Inspector:</strong> Donde aparece el código generado en tiempo real</li>
            </ul>
            <p>Cada clic, escritura, selección o navegación que realizas se traduce instantáneamente a código
            Python (o el lenguaje que elijas). Al terminar, copias o guardas el código y lo usas como base
            para tus tests.</p>
            <pre><code class="bash"># Comando básico: abre el navegador y empieza a grabar
playwright codegen https://mi-app.com</code></pre>
            <p>Codegen utiliza los <strong>mismos localizadores resilientes</strong> que recomienda Playwright:
            <code>get_by_role()</code>, <code>get_by_text()</code>, <code>get_by_label()</code>, etc.
            Esto significa que el código generado ya sigue buenas prácticas de localizadores.</p>
        </div>

        <h3>🚀 Lanzar Codegen</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Formas de iniciar Codegen</h4>
            <pre><code class="bash"># 1. Forma básica — abre navegador en la URL indicada
playwright codegen https://mi-app.com

# 2. Especificar idioma de salida (Python por defecto para nosotros)
playwright codegen --target python https://mi-app.com

# 3. Guardar el código generado directamente en un archivo
playwright codegen --target python --output tests/test_grabado.py https://mi-app.com

# 4. Sin URL — abre navegador en blanco para navegar manualmente
playwright codegen

# 5. Desde Python con pytest-playwright instalado
# (útil si playwright no está en PATH)
python -m playwright codegen https://mi-app.com</code></pre>
            <p>Al ejecutar cualquiera de estos comandos, se abren las dos ventanas: el navegador Chromium
            y el Inspector con el código generado.</p>
        </div>

        <h3>⚙️ Opciones principales de Codegen</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #1565c0; color: white;">
                        <th style="padding: 10px;">Opción</th>
                        <th style="padding: 10px;">Descripción</th>
                        <th style="padding: 10px;">Ejemplo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><code>--target</code></td>
                        <td style="padding: 8px;">Lenguaje del código generado</td>
                        <td style="padding: 8px;"><code>--target python</code></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><code>--output</code></td>
                        <td style="padding: 8px;">Archivo donde guardar el código</td>
                        <td style="padding: 8px;"><code>--output test_login.py</code></td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><code>--viewport-size</code></td>
                        <td style="padding: 8px;">Tamaño de ventana del navegador</td>
                        <td style="padding: 8px;"><code>--viewport-size "1280,720"</code></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><code>--device</code></td>
                        <td style="padding: 8px;">Emular un dispositivo específico</td>
                        <td style="padding: 8px;"><code>--device "iPhone 13"</code></td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><code>--color-scheme</code></td>
                        <td style="padding: 8px;">Esquema de color del navegador</td>
                        <td style="padding: 8px;"><code>--color-scheme dark</code></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><code>--browser</code></td>
                        <td style="padding: 8px;">Navegador a usar</td>
                        <td style="padding: 8px;"><code>--browser firefox</code></td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><code>--save-storage</code></td>
                        <td style="padding: 8px;">Guardar estado de autenticación</td>
                        <td style="padding: 8px;"><code>--save-storage auth.json</code></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><code>--load-storage</code></td>
                        <td style="padding: 8px;">Cargar estado de autenticación previo</td>
                        <td style="padding: 8px;"><code>--load-storage auth.json</code></td>
                    </tr>
                </tbody>
            </table>
            <pre><code class="bash"># Ejemplo combinando varias opciones
playwright codegen \\
    --target python \\
    --output tests/test_mobile.py \\
    --device "iPhone 13" \\
    --color-scheme dark \\
    https://mi-app.com</code></pre>
        </div>

        <h3>🖥️ La interfaz de Codegen</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Cuando Codegen se ejecuta, verás dos ventanas:</p>
            <h4>1. Ventana del navegador (interactiva)</h4>
            <ul>
                <li>Es un navegador Chromium real donde navegas normalmente</li>
                <li>Tiene una <strong>barra de herramientas especial</strong> en la parte superior con botones para:
                    <ul>
                        <li><strong>Record:</strong> Iniciar/pausar la grabación</li>
                        <li><strong>Assert visibility:</strong> Agregar aserción de visibilidad</li>
                        <li><strong>Assert text:</strong> Agregar aserción de texto</li>
                        <li><strong>Assert value:</strong> Agregar aserción de valor</li>
                        <li><strong>Pick locator:</strong> Obtener el localizador de un elemento sin grabarlo como acción</li>
                    </ul>
                </li>
                <li>Los elementos se <strong>resaltan</strong> cuando pasas el cursor sobre ellos</li>
            </ul>
            <h4>2. Ventana del Inspector (código)</h4>
            <ul>
                <li>Muestra el código Python generado en tiempo real</li>
                <li>Incluye botones para <strong>copiar</strong> al portapapeles</li>
                <li>Se actualiza instantáneamente con cada interacción</li>
                <li>Selector de lenguaje (Python, JavaScript, C#, Java)</li>
            </ul>
        </div>

        <h3>🎯 Acciones que Codegen registra</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Codegen captura automáticamente las siguientes interacciones:</p>
            <pre><code class="python"># El código generado por Codegen se ve así:
from playwright.sync_api import Playwright, sync_playwright, expect

def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()

    # Navegación
    page.goto("https://mi-app.com/login")

    # Clics en elementos
    page.get_by_role("link", name="Iniciar Sesión").click()

    # Escritura en campos (fill)
    page.get_by_label("Correo electrónico").fill("admin@siesa.com")
    page.get_by_label("Contraseña").fill("Admin123!")

    # Clic en botones
    page.get_by_role("button", name="Entrar").click()

    # Selección en dropdowns
    page.get_by_label("Módulo").select_option("HCM")

    # Checkboxes y radio buttons
    page.get_by_label("Recordarme").check()
    page.get_by_label("Perfil completo").check()

    # Navegación entre páginas
    page.get_by_role("link", name="Dashboard").click()

    # ---------------------
    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)</code></pre>
            <p><strong>Nota:</strong> Codegen utiliza preferentemente localizadores semánticos como
            <code>get_by_role()</code>, <code>get_by_label()</code> y <code>get_by_text()</code>.
            Solo recurre a selectores CSS cuando no encuentra uno semántico adecuado.</p>
        </div>

        <h3>✅ Agregar aserciones desde la barra de herramientas</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>La barra de herramientas de Codegen permite agregar <strong>aserciones sin escribir código</strong>.
            Selecciona el tipo de aserción y haz clic en el elemento que quieres verificar:</p>
            <pre><code class="python"># Aserción de visibilidad (Assert visibility)
# Haz clic en el botón "Assert visibility" y luego en el elemento
expect(page.get_by_role("heading", name="Dashboard")).to_be_visible()

# Aserción de texto (Assert text)
# Verifica que un elemento contenga cierto texto
expect(page.get_by_role("heading", name="Bienvenido")).to_contain_text("Bienvenido, Admin")

# Aserción de valor (Assert value)
# Verifica el valor de un campo de formulario
expect(page.get_by_label("Correo electrónico")).to_have_value("admin@siesa.com")

# Aserción de estado habilitado/deshabilitado
expect(page.get_by_role("button", name="Guardar")).to_be_enabled()

# Aserción de checkbox marcado
expect(page.get_by_label("Activo")).to_be_checked()</code></pre>
            <p><strong>Flujo para agregar aserciones:</strong></p>
            <ol>
                <li>Haz clic en el botón de aserción en la barra de herramientas (ej. "Assert visibility")</li>
                <li>Pasa el cursor sobre el elemento deseado (se resalta)</li>
                <li>Haz clic en el elemento</li>
                <li>La aserción aparece inmediatamente en la ventana del Inspector</li>
                <li>Continúa grabando acciones normalmente</li>
            </ol>
        </div>

        <h3>🔐 Codegen con autenticación (storage state)</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Para grabar tests que requieren autenticación previa, usa las opciones
            <code>--save-storage</code> y <code>--load-storage</code>:</p>
            <pre><code class="bash"># Paso 1: Grabar el flujo de login y guardar el estado
# Haces login manualmente en el navegador, luego cierras
playwright codegen --save-storage auth/state.json https://mi-app.com/login

# Paso 2: Grabar tests posteriores ya autenticado
# Codegen carga el estado guardado — ya estás logueado al abrir
playwright codegen --load-storage auth/state.json https://mi-app.com/dashboard</code></pre>

            <h4>Flujo completo con múltiples roles</h4>
            <pre><code class="bash"># Grabar estado de admin
playwright codegen --save-storage auth/admin.json https://mi-app.com/login

# Grabar estado de usuario regular
playwright codegen --save-storage auth/usuario.json https://mi-app.com/login

# Ahora grabar test como admin (sin repetir login)
playwright codegen \\
    --load-storage auth/admin.json \\
    --output tests/test_admin_dashboard.py \\
    https://mi-app.com/dashboard

# Grabar test como usuario regular
playwright codegen \\
    --load-storage auth/usuario.json \\
    --output tests/test_user_ventas.py \\
    https://mi-app.com/ventas</code></pre>
            <p>Esto es especialmente útil cuando la autenticación es compleja (MFA, SSO, CAPTCHA) y no
            quieres repetirla cada vez que grabas un test.</p>
        </div>

        <h3>📱 Codegen con emulación de dispositivos</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Codegen permite emular dispositivos móviles, geolocalización y zona horaria durante la grabación:</p>
            <pre><code class="bash"># Emular iPhone 13
playwright codegen --device "iPhone 13" https://mi-app.com

# Emular Pixel 5 con geolocalización
playwright codegen \\
    --device "Pixel 5" \\
    --geolocation "3.4516,-76.5320" \\
    --timezone "America/Bogota" \\
    https://mi-app.com

# Emular tablet Galaxy Tab
playwright codegen --device "Galaxy Tab S4" https://mi-app.com

# Viewport personalizado (sin emular dispositivo)
playwright codegen --viewport-size "375,812" https://mi-app.com

# Modo oscuro
playwright codegen \\
    --device "iPhone 13" \\
    --color-scheme dark \\
    https://mi-app.com</code></pre>
            <p>El código generado incluirá automáticamente la configuración de emulación:</p>
            <pre><code class="python"># Código generado con --device "iPhone 13"
from playwright.sync_api import Playwright, sync_playwright, expect

def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context(**playwright.devices["iPhone 13"])
    page = context.new_page()

    page.goto("https://mi-app.com")
    # ... acciones grabadas en vista móvil ...

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)</code></pre>
        </div>

        <h3>⚠️ Limitaciones de Codegen</h3>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Lo que Codegen NO hace bien</h4>
            <ul>
                <li><strong>Waits explícitos:</strong> No genera <code>wait_for_selector()</code> ni
                <code>wait_for_load_state()</code> para contenido dinámico asíncrono</li>
                <li><strong>Lógica condicional:</strong> No puede generar <code>if/else</code>, bucles ni
                manejo de errores</li>
                <li><strong>Datos dinámicos:</strong> Usa valores hardcodeados (el texto exacto que ves en pantalla)
                en lugar de variables o fixtures</li>
                <li><strong>Page Object Model:</strong> Genera todo en una función plana, sin estructura POM</li>
                <li><strong>Assertions complejas:</strong> Solo genera assertions básicas (visibilidad, texto, valor),
                no validaciones complejas de lógica de negocio</li>
                <li><strong>Datos de prueba:</strong> No parametriza ni usa data-driven testing</li>
                <li><strong>Cleanup:</strong> No genera teardown ni manejo de estado entre tests</li>
            </ul>
            <h4>Ejemplo de código que necesita limpieza manual</h4>
            <pre><code class="python"># ❌ Código crudo generado por Codegen
def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://mi-app.com/login")
    page.get_by_label("Correo electrónico").fill("admin@siesa.com")
    page.get_by_label("Contraseña").fill("Admin123!")
    page.get_by_role("button", name="Entrar").click()
    page.get_by_role("link", name="Empleados").click()
    page.get_by_role("button", name="Nuevo Empleado").click()
    page.get_by_label("Nombre").fill("Juan Manuel")
    page.get_by_label("Apellido").fill("Reina")
    page.get_by_label("Cédula").fill("12345678")
    page.get_by_label("Cargo").select_option("Líder QA")
    page.get_by_role("button", name="Guardar").click()
    expect(page.get_by_text("Empleado creado exitosamente")).to_be_visible()
    context.close()
    browser.close()</code></pre>
            <p>Este código funciona, pero tiene credenciales hardcodeadas, sin POM, sin fixtures,
            sin parametrización y sin manejo de errores.</p>
        </div>

        <h3>🔄 Buena práctica: Codegen como punto de partida, luego refactorizar</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Paso 1: Grabar con Codegen</h4>
            <pre><code class="bash"># Grabar el flujo de crear empleado
playwright codegen --target python --output tests/raw_crear_empleado.py https://mi-app.com</code></pre>

            <h4>Paso 2: Refactorizar en Page Object Model</h4>
            <pre><code class="python"># pages/login_page.py
class LoginPage:
    def __init__(self, page):
        self.page = page
        self.email_input = page.get_by_label("Correo electrónico")
        self.password_input = page.get_by_label("Contraseña")
        self.submit_button = page.get_by_role("button", name="Entrar")

    def navigate(self):
        self.page.goto("https://mi-app.com/login")
        return self

    def login(self, email: str, password: str):
        self.email_input.fill(email)
        self.password_input.fill(password)
        self.submit_button.click()
        self.page.wait_for_url("**/dashboard")
        return self


# pages/empleados_page.py
class EmpleadosPage:
    def __init__(self, page):
        self.page = page
        self.btn_nuevo = page.get_by_role("button", name="Nuevo Empleado")
        self.nombre_input = page.get_by_label("Nombre")
        self.apellido_input = page.get_by_label("Apellido")
        self.cedula_input = page.get_by_label("Cédula")
        self.cargo_select = page.get_by_label("Cargo")
        self.btn_guardar = page.get_by_role("button", name="Guardar")
        self.msg_exito = page.get_by_text("Empleado creado exitosamente")

    def navigate(self):
        self.page.get_by_role("link", name="Empleados").click()
        return self

    def crear_empleado(self, nombre: str, apellido: str, cedula: str, cargo: str):
        self.btn_nuevo.click()
        self.nombre_input.fill(nombre)
        self.apellido_input.fill(apellido)
        self.cedula_input.fill(cedula)
        self.cargo_select.select_option(cargo)
        self.btn_guardar.click()
        return self</code></pre>

            <h4>Paso 3: Escribir el test limpio con pytest</h4>
            <pre><code class="python"># tests/test_crear_empleado.py
import pytest
from playwright.sync_api import expect
from pages.login_page import LoginPage
from pages.empleados_page import EmpleadosPage


@pytest.fixture
def authenticated_page(page):
    """Login centralizado usando fixture."""
    login = LoginPage(page)
    login.navigate().login("admin@siesa.com", "Admin123!")
    return page


def test_crear_empleado_exitosamente(authenticated_page):
    page = authenticated_page
    empleados = EmpleadosPage(page)
    empleados.navigate()

    empleados.crear_empleado(
        nombre="Juan Manuel",
        apellido="Reina",
        cedula="12345678",
        cargo="Líder QA",
    )

    expect(empleados.msg_exito).to_be_visible()


@pytest.mark.parametrize("nombre,apellido,cedula,cargo", [
    ("Carlos", "Diaz", "11111111", "QA Engineer"),
    ("Jose", "Bravo", "22222222", "QA Engineer"),
    ("Ana", "García", "33333333", "Desarrollador"),
])
def test_crear_multiples_empleados(authenticated_page, nombre, apellido, cedula, cargo):
    page = authenticated_page
    empleados = EmpleadosPage(page)
    empleados.navigate()

    empleados.crear_empleado(nombre, apellido, cedula, cargo)

    expect(empleados.msg_exito).to_be_visible()</code></pre>
            <p><strong>Resultado:</strong> De una función plana de 15 líneas generada por Codegen, obtuvimos
            un framework con Page Objects reutilizables, tests parametrizados y fixtures centralizados.</p>
        </div>

        <h3>🔧 Flujo de trabajo recomendado con Codegen</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #1565c0; color: white;">
                        <th style="padding: 10px;">Paso</th>
                        <th style="padding: 10px;">Acción</th>
                        <th style="padding: 10px;">Herramienta</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><strong>1. Descubrir</strong></td>
                        <td style="padding: 8px;">Navegar por el flujo completo en la app para entender el camino feliz</td>
                        <td style="padding: 8px;">Codegen</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>2. Grabar</strong></td>
                        <td style="padding: 8px;">Ejecutar Codegen y grabar el flujo con aserciones clave</td>
                        <td style="padding: 8px;">Codegen + toolbar</td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><strong>3. Extraer localizadores</strong></td>
                        <td style="padding: 8px;">Copiar los localizadores generados como base para Page Objects</td>
                        <td style="padding: 8px;">Editor de código</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>4. Refactorizar</strong></td>
                        <td style="padding: 8px;">Crear Page Objects, parametrizar datos, agregar fixtures</td>
                        <td style="padding: 8px;">Editor + pytest</td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><strong>5. Extender</strong></td>
                        <td style="padding: 8px;">Agregar casos negativos, edge cases, validaciones de negocio</td>
                        <td style="padding: 8px;">Manual</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>6. Integrar</strong></td>
                        <td style="padding: 8px;">Incorporar al test suite con CI/CD</td>
                        <td style="padding: 8px;">pytest + CI</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip SIESA:</strong> En proyectos SIESA con módulos complejos como HCM o ERP, usa Codegen
            como herramienta de <strong>exploración rápida</strong>. Cuando un analista funcional describe un
            flujo nuevo (por ejemplo: "crear un contrato laboral con tipo indefinido y prestaciones
            completas"), graba el flujo con Codegen para obtener los localizadores exactos de todos los
            campos. Luego refactoriza los localizadores en Page Objects del módulo correspondiente. Esto
            reduce drásticamente el tiempo de creación de tests para flujos desconocidos, especialmente
            cuando la documentación de la UI no está actualizada.
        </div>

        <h3>📋 Comandos Codegen de referencia rápida</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="bash"># --- Grabación básica ---
playwright codegen https://mi-app.com
playwright codegen --target python --output test.py https://mi-app.com

# --- Emulación de dispositivos ---
playwright codegen --device "iPhone 13" https://mi-app.com
playwright codegen --device "Pixel 5" https://mi-app.com
playwright codegen --device "iPad Pro 11" https://mi-app.com

# --- Viewport y color ---
playwright codegen --viewport-size "1920,1080" https://mi-app.com
playwright codegen --color-scheme dark https://mi-app.com

# --- Geolocalización y zona horaria ---
playwright codegen --geolocation "3.4516,-76.5320" --timezone "America/Bogota" https://mi-app.com
playwright codegen --geolocation "4.7110,-74.0721" --timezone "America/Bogota" https://mi-app.com

# --- Autenticación ---
playwright codegen --save-storage auth.json https://mi-app.com/login
playwright codegen --load-storage auth.json https://mi-app.com/dashboard

# --- Navegadores ---
playwright codegen --browser chromium https://mi-app.com
playwright codegen --browser firefox https://mi-app.com
playwright codegen --browser webkit https://mi-app.com

# --- Listar dispositivos disponibles ---
python -m playwright show-devices</code></pre>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Graba un flujo con Codegen y refactorízalo en un test profesional.</p>
            <ol>
                <li><strong>Grabar el flujo:</strong> Ejecuta el siguiente comando y realiza las acciones indicadas:
                    <pre><code class="bash">playwright codegen --target python --output tests/raw_todo.py https://demo.playwright.dev/todomvc</code></pre>
                    <ul>
                        <li>Agrega 3 tareas ("Instalar Playwright", "Crear test", "Ejecutar CI")</li>
                        <li>Marca la primera tarea como completada</li>
                        <li>Usa el filtro "Active" para ver solo las pendientes</li>
                        <li>Agrega aserciones con la barra de herramientas: verifica que se muestren 2 items activos</li>
                        <li>Cierra el navegador para guardar el archivo</li>
                    </ul>
                </li>
                <li><strong>Refactorizar:</strong> Convierte el código generado en una estructura POM:
                    <pre><code class="python"># pages/todo_page.py
class TodoPage:
    URL = "https://demo.playwright.dev/todomvc"

    def __init__(self, page):
        self.page = page
        self.new_todo_input = page.get_by_placeholder("What needs to be done?")
        self.todo_items = page.get_by_test_id("todo-item")
        self.todo_count = page.get_by_test_id("todo-count")

    def navigate(self):
        self.page.goto(self.URL)
        return self

    def add_todo(self, text: str):
        self.new_todo_input.fill(text)
        self.new_todo_input.press("Enter")
        return self

    def toggle_todo(self, index: int):
        self.todo_items.nth(index).get_by_role("checkbox").check()
        return self

    def filter_active(self):
        self.page.get_by_role("link", name="Active").click()
        return self

    def filter_completed(self):
        self.page.get_by_role("link", name="Completed").click()
        return self

    def filter_all(self):
        self.page.get_by_role("link", name="All").click()
        return self</code></pre>
                    <pre><code class="python"># tests/test_todo_refactored.py
import pytest
from playwright.sync_api import expect
from pages.todo_page import TodoPage


@pytest.fixture
def todo_page(page):
    todo = TodoPage(page)
    todo.navigate()
    return todo


TAREAS = ["Instalar Playwright", "Crear test", "Ejecutar CI"]


def test_agregar_tareas(todo_page):
    for tarea in TAREAS:
        todo_page.add_todo(tarea)

    expect(todo_page.todo_items).to_have_count(3)


def test_completar_y_filtrar(todo_page):
    for tarea in TAREAS:
        todo_page.add_todo(tarea)

    # Completar la primera tarea
    todo_page.toggle_todo(0)

    # Filtrar por activas
    todo_page.filter_active()
    expect(todo_page.todo_items).to_have_count(2)

    # Filtrar por completadas
    todo_page.filter_completed()
    expect(todo_page.todo_items).to_have_count(1)

    # Mostrar todas
    todo_page.filter_all()
    expect(todo_page.todo_items).to_have_count(3)


def test_contador_refleja_items_activos(todo_page):
    for tarea in TAREAS:
        todo_page.add_todo(tarea)

    expect(todo_page.todo_count).to_contain_text("3 items left")

    todo_page.toggle_todo(0)
    expect(todo_page.todo_count).to_contain_text("2 items left")</code></pre>
                </li>
                <li><strong>Comparar:</strong> Revisa el archivo <code>raw_todo.py</code> generado por Codegen
                versus el <code>test_todo_refactored.py</code>. Identifica las diferencias en:
                    <ul>
                        <li>Estructura y organización del código</li>
                        <li>Reutilización de localizadores</li>
                        <li>Parametrización de datos</li>
                        <li>Cantidad y calidad de las aserciones</li>
                    </ul>
                </li>
            </ol>
            <p><strong>Pista:</strong> El código de Codegen será una función larga y plana con todos los valores
            hardcodeados. Tu versión refactorizada debería tener localizadores centralizados en la Page Object,
            múltiples tests independientes y datos separados de la lógica.</p>
        </div>
    `,
    topics: ["codegen", "generación", "código"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_094 = LESSON_094;
}
