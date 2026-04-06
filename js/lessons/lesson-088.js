/**
 * Playwright Academy - Lección 088
 * Browser vs Context vs Page
 * Sección 13: Browser Contexts e Isolation
 */

const LESSON_088 = {
    id: 88,
    title: "Browser vs Context vs Page",
    duration: "8 min",
    level: "intermediate",
    section: "section-13",
    content: `
        <h2>🔒 Browser vs Context vs Page</h2>
        <p>Playwright organiza la interacción con navegadores en una <strong>jerarquía de tres niveles</strong>:
        Browser, BrowserContext y Page. Entender esta jerarquía es fundamental para escribir tests
        eficientes, aislados y que escalen correctamente. En esta lección exploraremos qué representa
        cada nivel, qué controla y cuándo usar uno u otro.</p>

        <h3>🏗️ La jerarquía: Browser → BrowserContext → Page</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Piensa en la jerarquía como una estructura de contenedores anidados:</p>
            <pre><code class="text">┌─────────────────────────────────────────────────────────┐
│  Playwright                                             │
│  (motor que controla los navegadores)                   │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Browser (instancia de Chromium/Firefox/WebKit)   │  │
│  │  ● Un proceso de navegador real                   │  │
│  │  ● Configuración de lanzamiento (headless, etc.)  │  │
│  │                                                   │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  BrowserContext ("perfil incógnito")        │  │  │
│  │  │  ● Cookies, localStorage, sessionStorage   │  │  │
│  │  │  ● Permisos, geolocalización, viewport     │  │  │
│  │  │  ● Completamente aislado de otros contexts  │  │  │
│  │  │                                             │  │  │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │  │  │
│  │  │  │  Page 1  │  │  Page 2  │  │  Page 3  │  │  │  │
│  │  │  │  (tab)   │  │  (tab)   │  │  (tab)   │  │  │  │
│  │  │  └──────────┘  └──────────┘  └──────────┘  │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                                                   │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  BrowserContext 2 (otro perfil aislado)     │  │  │
│  │  │  ┌──────────┐  ┌──────────┐                │  │  │
│  │  │  │  Page 4  │  │  Page 5  │                │  │  │
│  │  │  └──────────┘  └──────────┘                │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘</code></pre>
        </div>

        <h3>🌐 Nivel 1: Browser — La instancia del navegador</h3>
        <p>El <strong>Browser</strong> representa un proceso real de navegador (Chromium, Firefox o WebKit).
        Es el nivel más alto y costoso en recursos. Normalmente lanzas <strong>un solo Browser</strong>
        por suite de tests.</p>

        <pre><code class="python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    # Lanzar una instancia de Chromium
    browser = p.chromium.launch(
        headless=True,          # Sin ventana visible (default en CI)
        slow_mo=500,            # Ralentizar acciones 500ms (para debug)
        args=["--start-maximized"],  # Argumentos del navegador
    )

    # También puedes lanzar Firefox o WebKit
    browser_ff = p.firefox.launch(headless=True)
    browser_wk = p.webkit.launch(headless=True)

    print(f"Chromium versión: {browser.version}")
    # Chromium versión: 121.0.6167.57

    browser.close()
    browser_ff.close()
    browser_wk.close()</code></pre>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📋 Opciones de lanzamiento del Browser</h4>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #1565c0; color: white;">
                        <th style="padding: 8px; text-align: left;">Opción</th>
                        <th style="padding: 8px; text-align: left;">Tipo</th>
                        <th style="padding: 8px; text-align: left;">Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><code>headless</code></td>
                        <td style="padding: 8px;">bool</td>
                        <td style="padding: 8px;">Sin UI visible (True por defecto)</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><code>slow_mo</code></td>
                        <td style="padding: 8px;">float (ms)</td>
                        <td style="padding: 8px;">Delay entre cada acción</td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><code>args</code></td>
                        <td style="padding: 8px;">list[str]</td>
                        <td style="padding: 8px;">Argumentos CLI del navegador</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><code>downloads_path</code></td>
                        <td style="padding: 8px;">str</td>
                        <td style="padding: 8px;">Directorio para descargas</td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><code>executable_path</code></td>
                        <td style="padding: 8px;">str</td>
                        <td style="padding: 8px;">Ruta a binario custom del navegador</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><code>channel</code></td>
                        <td style="padding: 8px;">str</td>
                        <td style="padding: 8px;">"chrome", "msedge", etc.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>📦 Nivel 2: BrowserContext — La sesión aislada</h3>
        <p>El <strong>BrowserContext</strong> es el concepto más poderoso de la jerarquía. Piensa en él
        como una <strong>ventana de incógnito</strong>: tiene su propio almacenamiento (cookies, localStorage,
        sessionStorage), permisos y configuración. Dos contexts dentro del mismo Browser <strong>no
        comparten absolutamente nada</strong>.</p>

        <pre><code class="python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # ── Context 1: usuario administrador ──
    context_admin = browser.new_context(
        viewport={"width": 1920, "height": 1080},
        locale="es-CO",
        timezone_id="America/Bogota",
    )

    # ── Context 2: usuario regular ──
    context_user = browser.new_context(
        viewport={"width": 375, "height": 812},  # iPhone X
        locale="es-CO",
        timezone_id="America/Bogota",
        permissions=["geolocation"],
        geolocation={"latitude": 3.4516, "longitude": -76.5320},  # Cali
    )

    # Cada context tiene sus propias cookies y storage
    # ¡Son completamente independientes!

    context_admin.close()
    context_user.close()
    browser.close()</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Lo que controla un BrowserContext</h4>
            <ul>
                <li><strong>Cookies y storage:</strong> Cada context tiene su propia sesión de autenticación</li>
                <li><strong>Viewport:</strong> Diferentes resoluciones para responsive testing</li>
                <li><strong>Locale y timezone:</strong> Simular usuarios en diferentes regiones</li>
                <li><strong>Permisos:</strong> Geolocalización, notificaciones, cámara, micrófono</li>
                <li><strong>User-Agent:</strong> Simular diferentes dispositivos</li>
                <li><strong>HTTP Credentials:</strong> Basic auth a nivel de context</li>
                <li><strong>Extra HTTP headers:</strong> Headers personalizados en cada request</li>
                <li><strong>Proxy:</strong> Configuración de proxy por context</li>
                <li><strong>Offline mode:</strong> Simular desconexión de red</li>
            </ul>
        </div>

        <h3>📄 Nivel 3: Page — Una pestaña del navegador</h3>
        <p>El <strong>Page</strong> representa una pestaña individual dentro de un BrowserContext.
        Es el objeto con el que más interactúas: navegar, hacer clic, llenar formularios, verificar contenido.
        Las pages dentro del <strong>mismo context comparten cookies y storage</strong>.</p>

        <pre><code class="python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context()

    # Crear múltiples páginas (tabs) en el mismo context
    page1 = context.new_page()
    page2 = context.new_page()
    page3 = context.new_page()

    # Todas las páginas comparten cookies del context
    page1.goto("https://mi-app.com/login")
    page1.fill("#user", "admin")
    page1.fill("#pass", "secret")
    page1.click("#login-btn")
    # Después del login, la cookie de sesión está en el context

    # page2 ya está autenticada (misma cookie de sesión)
    page2.goto("https://mi-app.com/dashboard")
    # ¡No necesita hacer login de nuevo!

    # page3 también tiene acceso
    page3.goto("https://mi-app.com/settings")

    print(f"Páginas abiertas: {len(context.pages)}")
    # Páginas abiertas: 3

    context.close()  # Cierra todas las páginas del context
    browser.close()</code></pre>

        <h3>🔄 Creación completa de la jerarquía</h3>
        <p>Veamos el flujo completo desde cero, creando cada nivel explícitamente:</p>
        <pre><code class="python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    # ── Nivel 1: Lanzar el navegador ──
    browser = p.chromium.launch(headless=False)
    print(f"Browser conectado: {browser.is_connected()}")

    # ── Nivel 2: Crear contextos aislados ──
    context_a = browser.new_context(
        viewport={"width": 1280, "height": 720},
        locale="es-CO",
    )
    context_b = browser.new_context(
        viewport={"width": 1920, "height": 1080},
        locale="en-US",
    )

    # ── Nivel 3: Crear páginas dentro de cada contexto ──
    page_a1 = context_a.new_page()
    page_a2 = context_a.new_page()
    page_b1 = context_b.new_page()

    # Navegar
    page_a1.goto("https://mi-app.com")
    page_a2.goto("https://mi-app.com/admin")
    page_b1.goto("https://mi-app.com")

    # page_a1 y page_a2 comparten cookies (mismo context)
    # page_b1 está completamente aislada (otro context)

    # ── Cerrar en orden inverso ──
    # 1. Cerrar páginas individuales (opcional si cierras el context)
    page_a1.close()
    page_a2.close()
    page_b1.close()

    # 2. Cerrar contextos (cierra sus páginas automáticamente)
    context_a.close()
    context_b.close()

    # 3. Cerrar el browser (cierra todo automáticamente)
    browser.close()</code></pre>

        <h3>⚡ Atajo: browser.new_page()</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔮 Context implícito</h4>
            <p>Playwright ofrece un atajo que crea context + page en un solo paso. Es útil para
            tests simples donde no necesitas configurar el context:</p>
            <pre><code class="python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Atajo: crea un context nuevo + una page automáticamente
    page = browser.new_page()
    # Equivale a:
    # context = browser.new_context()
    # page = context.new_page()

    page.goto("https://mi-app.com")

    # Acceder al context implícito
    print(page.context)  # <BrowserContext>

    page.close()  # También cierra el context implícito
    browser.close()</code></pre>
            <p><strong>Importante:</strong> Con <code>browser.new_page()</code>, cada page tiene su
            propio context aislado. No puedes abrir múltiples páginas en el mismo context con este atajo.</p>
        </div>

        <h3>🔀 ¿Cuándo usar múltiples Browsers vs Contexts vs Pages?</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #1565c0; color: white;">
                        <th style="padding: 10px; text-align: left;">Escenario</th>
                        <th style="padding: 10px; text-align: left;">Usar</th>
                        <th style="padding: 10px; text-align: left;">¿Por qué?</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;">Test cross-browser (Chrome + Firefox)</td>
                        <td style="padding: 8px;"><strong>Múltiples Browsers</strong></td>
                        <td style="padding: 8px;">Cada motor es un Browser diferente</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Test multi-usuario (admin + user)</td>
                        <td style="padding: 8px;"><strong>Múltiples Contexts</strong></td>
                        <td style="padding: 8px;">Cada usuario necesita su propia sesión</td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;">Test multi-tab (abrir enlace en nueva pestaña)</td>
                        <td style="padding: 8px;"><strong>Múltiples Pages</strong></td>
                        <td style="padding: 8px;">Las tabs comparten sesión del usuario</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Tests de viewport (desktop + mobile)</td>
                        <td style="padding: 8px;"><strong>Múltiples Contexts</strong></td>
                        <td style="padding: 8px;">El viewport se configura a nivel context</td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;">Chat en tiempo real (2 usuarios)</td>
                        <td style="padding: 8px;"><strong>Múltiples Contexts</strong></td>
                        <td style="padding: 8px;">Cada participante necesita sesión propia</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Flujo de checkout con popup de pago</td>
                        <td style="padding: 8px;"><strong>Múltiples Pages</strong></td>
                        <td style="padding: 8px;">El popup hereda la sesión del context</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>🔗 Compartición de recursos</h3>
        <p>Entender qué se comparte en cada nivel es clave para diseñar tests correctos:</p>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Páginas en el MISMO context comparten:</h4>
            <ul>
                <li>Cookies</li>
                <li>localStorage y sessionStorage</li>
                <li>Service Workers registrados</li>
                <li>Credenciales HTTP (basic auth)</li>
                <li>Configuración de proxy</li>
            </ul>
        </div>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>❌ Contexts DIFERENTES NO comparten nada:</h4>
            <ul>
                <li>Sin cookies compartidas</li>
                <li>Sin storage compartido</li>
                <li>Sin Service Workers compartidos</li>
                <li>Cada context es como una ventana de incógnito independiente</li>
            </ul>
            <p><strong>Esto es lo que hace a los BrowserContexts perfectos para aislamiento de tests.</strong></p>
        </div>

        <pre><code class="python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # ── Demostrar aislamiento entre contexts ──
    context_1 = browser.new_context()
    context_2 = browser.new_context()

    page_1 = context_1.new_page()
    page_2 = context_2.new_page()

    # Agregar cookie solo al context_1
    context_1.add_cookies([{
        "name": "session_id",
        "value": "abc123",
        "domain": "mi-app.com",
        "path": "/",
    }])

    # Verificar: context_1 tiene la cookie
    cookies_1 = context_1.cookies()
    print(f"Context 1 cookies: {len(cookies_1)}")  # 1

    # Verificar: context_2 NO tiene la cookie
    cookies_2 = context_2.cookies()
    print(f"Context 2 cookies: {len(cookies_2)}")  # 0

    # ── Demostrar compartición entre pages del mismo context ──
    page_1b = context_1.new_page()
    # page_1b también tiene acceso a la cookie "session_id"
    # porque está en context_1

    context_1.close()
    context_2.close()
    browser.close()</code></pre>

        <h3>♻️ Gestión del ciclo de vida</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚠️ El orden de cierre importa</h4>
            <p>Aunque Playwright maneja el cierre en cascada, es buena práctica cerrar en orden inverso
            para evitar errores y liberar recursos de forma limpia:</p>
            <pre><code class="python"># ✅ Orden correcto (inverso a la creación)
page.close()       # 1. Cerrar las páginas
context.close()    # 2. Cerrar el contexto (cierra pages restantes)
browser.close()    # 3. Cerrar el browser (cierra todo)

# ✅ También válido: cerrar solo el browser (cascada)
browser.close()    # Cierra contexts y pages automáticamente

# ❌ Evitar: usar page/context después de cerrar su padre
browser.close()
page.goto("...")   # Error: browser cerrado</code></pre>
        </div>

        <p>En pytest con Playwright, el manejo del ciclo de vida se simplifica con <strong>fixtures</strong>:</p>
        <pre><code class="python"># conftest.py
import pytest
from playwright.sync_api import sync_playwright

@pytest.fixture(scope="session")
def browser():
    """Un browser por toda la sesión de tests."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        yield browser
        browser.close()

@pytest.fixture(scope="function")
def context(browser):
    """Un context nuevo por cada test (aislamiento total)."""
    context = browser.new_context(
        viewport={"width": 1280, "height": 720},
        locale="es-CO",
    )
    yield context
    context.close()

@pytest.fixture(scope="function")
def page(context):
    """Una page nueva por cada test."""
    page = context.new_page()
    yield page
    page.close()


# test_ejemplo.py
def test_login(page):
    """Cada test recibe un context+page completamente limpio."""
    page.goto("https://mi-app.com/login")
    # Sin cookies previas, sin storage, sin historial
    # ¡Aislamiento total!</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip SIESA:</strong> En el ERP de SIESA, los tests de módulos como Nómina o
            Contabilidad a menudo requieren simular <strong>diferentes roles</strong> (auditor, contador,
            administrador). Usa un <strong>BrowserContext por cada rol</strong> en lugar de hacer
            logout/login. Esto es más rápido, más limpio y garantiza aislamiento real entre sesiones.
        </div>

        <h3>📊 Comparativa de rendimiento</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔮 Costo de cada nivel</h4>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #6a1b9a; color: white;">
                        <th style="padding: 8px; text-align: left;">Operación</th>
                        <th style="padding: 8px; text-align: left;">Tiempo aprox.</th>
                        <th style="padding: 8px; text-align: left;">Recursos</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #f3e5f5;">
                        <td style="padding: 8px;"><code>browser.launch()</code></td>
                        <td style="padding: 8px;">~500-1500 ms</td>
                        <td style="padding: 8px;">Alto (proceso del SO)</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><code>browser.new_context()</code></td>
                        <td style="padding: 8px;">~5-30 ms</td>
                        <td style="padding: 8px;">Bajo (perfil en memoria)</td>
                    </tr>
                    <tr style="background: #f3e5f5;">
                        <td style="padding: 8px;"><code>context.new_page()</code></td>
                        <td style="padding: 8px;">~5-20 ms</td>
                        <td style="padding: 8px;">Bajo (tab)</td>
                    </tr>
                </tbody>
            </table>
            <p style="margin-top: 10px;"><strong>Conclusión:</strong> Crea un browser por sesión y
            un context por test. Los contexts son extremadamente baratos comparados con lanzar browsers.
            Esta es la razón por la que Playwright recomienda aislamiento a nivel de context, no de browser.</p>
        </div>

        <h3>🧩 Ejemplo práctico: test multi-usuario</h3>
        <p>Un escenario común en aplicaciones empresariales — verificar que un administrador ve cambios
        hechos por un usuario regular, cada uno en su propia sesión:</p>
        <pre><code class="python">from playwright.sync_api import sync_playwright

def test_admin_ve_cambios_del_usuario():
    with sync_playwright() as p:
        browser = p.chromium.launch()

        # ── Context para el usuario regular ──
        ctx_user = browser.new_context()
        page_user = ctx_user.new_page()
        page_user.goto("https://mi-app.com/login")
        page_user.fill("#email", "usuario@empresa.com")
        page_user.fill("#password", "user123")
        page_user.click("#login-btn")

        # El usuario crea un registro
        page_user.goto("https://mi-app.com/records/new")
        page_user.fill("#title", "Registro de prueba")
        page_user.click("#save-btn")
        page_user.wait_for_selector(".toast-success")

        # ── Context para el administrador ──
        ctx_admin = browser.new_context()
        page_admin = ctx_admin.new_page()
        page_admin.goto("https://mi-app.com/login")
        page_admin.fill("#email", "admin@empresa.com")
        page_admin.fill("#password", "admin123")
        page_admin.click("#login-btn")

        # El admin debe ver el registro creado por el usuario
        page_admin.goto("https://mi-app.com/records")
        record = page_admin.locator("text=Registro de prueba")
        assert record.is_visible()

        # Cleanup
        ctx_user.close()
        ctx_admin.close()
        browser.close()</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip SIESA:</strong> Este patrón es ideal para validar flujos de aprobación
            en el ERP: un usuario crea una solicitud (vacaciones, anticipo, requisición) y otro
            usuario con rol de aprobador la ve en su bandeja. Dos contexts, un solo browser, cero
            interferencia entre sesiones.
        </div>

        <h3>📝 Resumen</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #1565c0; color: white;">
                        <th style="padding: 10px;">Nivel</th>
                        <th style="padding: 10px;">Representa</th>
                        <th style="padding: 10px;">Scope recomendado</th>
                        <th style="padding: 10px;">Clave</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><strong>Browser</strong></td>
                        <td style="padding: 8px;">Proceso del navegador</td>
                        <td style="padding: 8px;">session (1 por suite)</td>
                        <td style="padding: 8px;">Motor + opciones de lanzamiento</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>BrowserContext</strong></td>
                        <td style="padding: 8px;">Sesión aislada</td>
                        <td style="padding: 8px;">function (1 por test)</td>
                        <td style="padding: 8px;">Cookies, storage, permisos, viewport</td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><strong>Page</strong></td>
                        <td style="padding: 8px;">Pestaña del navegador</td>
                        <td style="padding: 8px;">function (1 o más por test)</td>
                        <td style="padding: 8px;">Navegación, interacción, assertions</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Crea un script que demuestre la jerarquía completa:</p>
            <ol>
                <li>Lanza un browser Chromium en modo visible (<code>headless=False</code>)</li>
                <li>Crea dos BrowserContexts:
                    <ul>
                        <li>Context A: viewport 1920x1080, locale "es-CO"</li>
                        <li>Context B: viewport 375x812, locale "en-US" (simula iPhone en inglés)</li>
                    </ul>
                </li>
                <li>En Context A, abre 2 pages: una con <code>https://playwright.dev</code> y otra con <code>https://google.com</code></li>
                <li>En Context B, abre 1 page con <code>https://playwright.dev</code></li>
                <li>Imprime el título de cada page y las cookies de cada context</li>
                <li>Cierra todo en el orden correcto (pages, contexts, browser)</li>
            </ol>
            <p><strong>Bonus:</strong> Agrega una cookie personalizada al Context A y verifica que
            el Context B no la tiene.</p>
        </div>
    `,
    topics: ["browser", "context", "page", "jerarquía"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 8,
    difficulty: "medium",
    type: "foundation"
};

if (typeof window !== 'undefined') {
    window.LESSON_088 = LESSON_088;
}
