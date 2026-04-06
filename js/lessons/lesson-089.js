/**
 * Playwright Academy - Lección 089
 * Tests con múltiples contexts
 * Sección 13: Browser Contexts e Isolation
 */

const LESSON_089 = {
    id: 89,
    title: "Tests con múltiples contexts",
    duration: "7 min",
    level: "intermediate",
    section: "section-13",
    content: `
        <h2>🔒 Tests con múltiples contexts</h2>
        <p>Una de las capacidades más poderosas de Playwright es la posibilidad de crear
        <strong>múltiples browser contexts dentro del mismo test</strong>. Cada context es un entorno
        completamente aislado (cookies, localStorage, sessionStorage independientes) que comparte
        el mismo proceso del navegador. Esto permite simular <strong>múltiples usuarios simultáneos</strong>
        sin la penalización de rendimiento de abrir múltiples navegadores.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎯 Objetivos de esta lección</h4>
            <ul>
                <li>Entender por qué usar múltiples contexts en un mismo test</li>
                <li>Simular múltiples usuarios simultáneos (admin + usuario regular)</li>
                <li>Probar funcionalidades en tiempo real (chat, notificaciones)</li>
                <li>Verificar cambios de permisos visibles entre sesiones</li>
                <li>Comprender las garantías de aislamiento entre contexts</li>
                <li>Crear fixtures reutilizables para tests multi-context</li>
            </ul>
        </div>

        <h3>📌 ¿Por qué usar múltiples contexts en un mismo test?</h3>
        <p>En la lección anterior (088) vimos la jerarquía <code>Browser → Context → Page</code>.
        Ahora vamos a aprovechar esa jerarquía para resolver escenarios que <strong>requieren
        interacción entre usuarios</strong>. Un solo context = un solo usuario; múltiples contexts =
        múltiples usuarios independientes en el mismo test.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📋 Escenarios ideales para múltiples contexts</h4>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Escenario</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripción</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">Chat en tiempo real</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Usuario A envía mensaje, Usuario B lo recibe</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">Admin + Usuario</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Admin cambia permisos, usuario ve el efecto</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">Notificaciones</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Una acción de un usuario genera notificación en otro</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">Colaboración</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Dos usuarios editan el mismo documento simultáneamente</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">Concurrencia</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Dos usuarios intentan comprar el último item disponible</td>
                </tr>
            </table>
        </div>

        <h3>🔧 Creación básica de múltiples contexts</h3>
        <p>El patrón fundamental: a partir de un mismo <code>browser</code>, crear dos (o más)
        contexts, cada uno con su propia <code>page</code>.</p>

        <pre><code class="python">from playwright.sync_api import sync_playwright

def test_dos_usuarios_basico():
    """Ejemplo básico: dos contexts = dos usuarios."""
    with sync_playwright() as p:
        browser = p.chromium.launch()

        # Context 1 → Usuario A
        context_a = browser.new_context()
        page_a = context_a.new_page()

        # Context 2 → Usuario B
        context_b = browser.new_context()
        page_b = context_b.new_page()

        # Cada uno navega independientemente
        page_a.goto("https://example.com/login")
        page_b.goto("https://example.com/login")

        # Login como usuarios diferentes
        page_a.fill("#username", "admin")
        page_a.fill("#password", "admin123")
        page_a.click("button[type='submit']")

        page_b.fill("#username", "usuario_regular")
        page_b.fill("#password", "user123")
        page_b.click("button[type='submit']")

        # Ahora ambos están logueados con sesiones independientes
        # ... realizar acciones cruzadas ...

        # Limpieza
        context_a.close()
        context_b.close()
        browser.close()</code></pre>

        <h3>💬 Ejemplo: Dos usuarios en una aplicación de chat</h3>
        <p>Este es el caso de uso clásico. Un usuario envía un mensaje y el otro lo recibe
        en tiempo real.</p>

        <pre><code class="python">from playwright.sync_api import sync_playwright, expect

def test_chat_entre_dos_usuarios():
    """
    Simula un chat entre dos usuarios.
    Usuario A envía un mensaje → Usuario B lo ve en su pantalla.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch()

        # --- Context del remitente ---
        ctx_remitente = browser.new_context()
        page_remitente = ctx_remitente.new_page()

        # --- Context del destinatario ---
        ctx_destinatario = browser.new_context()
        page_destinatario = ctx_destinatario.new_page()

        # Ambos acceden al chat
        page_remitente.goto("https://mi-app.com/login")
        page_remitente.fill("#username", "ana")
        page_remitente.fill("#password", "pass123")
        page_remitente.click("#btn-login")
        page_remitente.goto("https://mi-app.com/chat/sala-general")

        page_destinatario.goto("https://mi-app.com/login")
        page_destinatario.fill("#username", "carlos")
        page_destinatario.fill("#password", "pass456")
        page_destinatario.click("#btn-login")
        page_destinatario.goto("https://mi-app.com/chat/sala-general")

        # Ana envía un mensaje
        mensaje = "Hola Carlos, ¿cómo va el sprint?"
        page_remitente.fill("#input-mensaje", mensaje)
        page_remitente.click("#btn-enviar")

        # Verificar que Ana ve su propio mensaje
        expect(
            page_remitente.locator(".mensaje-enviado").last
        ).to_have_text(mensaje)

        # Verificar que Carlos recibe el mensaje (puede requerir espera)
        expect(
            page_destinatario.locator(".mensaje-recibido").last
        ).to_have_text(mensaje, timeout=10_000)

        # Carlos responde
        respuesta = "¡Todo bien! Estamos al 80%."
        page_destinatario.fill("#input-mensaje", respuesta)
        page_destinatario.click("#btn-enviar")

        # Ana recibe la respuesta
        expect(
            page_remitente.locator(".mensaje-recibido").last
        ).to_have_text(respuesta, timeout=10_000)

        ctx_remitente.close()
        ctx_destinatario.close()
        browser.close()</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip: Timeouts en tests multi-context</h4>
            <p>Cuando verificas que un usuario recibe datos enviados por otro, usa un <code>timeout</code>
            adecuado en las assertions. Las actualizaciones en tiempo real (WebSocket, SSE, polling)
            pueden tener latencia. Un timeout de <strong>10-15 segundos</strong> es razonable para
            funcionalidades en tiempo real.</p>
        </div>

        <h3>👤 Ejemplo: Admin modifica permisos, usuario ve el cambio</h3>
        <p>Otro caso muy común en aplicaciones empresariales: un administrador cambia algo en el
        sistema y un usuario regular debe ver el efecto de ese cambio.</p>

        <pre><code class="python">from playwright.sync_api import sync_playwright, expect

def test_admin_modifica_permisos_usuario_ve_cambio():
    """
    Admin desactiva un módulo → El usuario ya no puede acceder.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch()

        # --- Context del Admin ---
        ctx_admin = browser.new_context()
        page_admin = ctx_admin.new_page()
        page_admin.goto("https://mi-erp.com/login")
        page_admin.fill("#usuario", "admin")
        page_admin.fill("#clave", "admin_seguro")
        page_admin.click("#btn-ingresar")

        # --- Context del Usuario ---
        ctx_usuario = browser.new_context()
        page_usuario = ctx_usuario.new_page()
        page_usuario.goto("https://mi-erp.com/login")
        page_usuario.fill("#usuario", "jbravo")
        page_usuario.fill("#clave", "user_pass")
        page_usuario.click("#btn-ingresar")

        # Verificar que el usuario puede acceder al módulo de reportes
        page_usuario.goto("https://mi-erp.com/reportes")
        expect(page_usuario.locator("h1")).to_have_text("Reportes")

        # El admin desactiva el módulo de reportes para ese rol
        page_admin.goto("https://mi-erp.com/admin/permisos")
        page_admin.locator(
            "tr", has_text="Reportes"
        ).locator("input[type='checkbox']").uncheck()
        page_admin.click("#btn-guardar-permisos")
        expect(page_admin.locator(".toast-exito")).to_be_visible()

        # El usuario recarga y ya no puede acceder
        page_usuario.reload()
        expect(
            page_usuario.locator(".acceso-denegado")
        ).to_be_visible(timeout=5_000)

        # Limpieza
        ctx_admin.close()
        ctx_usuario.close()
        browser.close()</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Patrón recomendado: Acción del Admin → Verificación del Usuario</h4>
            <ol>
                <li>Ambos usuarios inician sesión en sus contexts independientes</li>
                <li>Verificar el estado <strong>antes</strong> del cambio (el usuario SÍ tiene acceso)</li>
                <li>Admin realiza la acción (desactivar permiso, publicar contenido, etc.)</li>
                <li>Esperar confirmación de que la acción del admin fue exitosa</li>
                <li>El usuario recarga o navega y se verifica el <strong>nuevo</strong> estado</li>
            </ol>
            <p>Este patrón de <strong>antes/después</strong> hace el test mucho más robusto que
            solo verificar el estado final.</p>
        </div>

        <h3>🧪 Aislamiento garantizado entre contexts</h3>
        <p>Cada browser context en Playwright tiene <strong>almacenamiento completamente independiente</strong>.
        Esto es equivalente a tener dos navegadores distintos, pero más eficiente.</p>

        <pre><code class="python">from playwright.sync_api import sync_playwright, expect

def test_aislamiento_completo_entre_contexts():
    """
    Demuestra que cookies, localStorage y sessionStorage
    son completamente independientes entre contexts.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch()

        ctx_a = browser.new_context()
        page_a = ctx_a.new_page()

        ctx_b = browser.new_context()
        page_b = ctx_b.new_page()

        # Ambos navegan a la misma URL
        page_a.goto("https://example.com")
        page_b.goto("https://example.com")

        # --- Cookies ---
        # Context A establece una cookie
        ctx_a.add_cookies([{
            "name": "usuario",
            "value": "ana",
            "domain": "example.com",
            "path": "/"
        }])
        # Context B NO tiene esa cookie
        cookies_b = ctx_b.cookies()
        assert not any(c["name"] == "usuario" for c in cookies_b), \
            "Context B no debe tener la cookie de Context A"

        # --- localStorage ---
        page_a.evaluate("localStorage.setItem('tema', 'oscuro')")
        valor_en_b = page_b.evaluate("localStorage.getItem('tema')")
        assert valor_en_b is None, \
            "localStorage de Context B debe estar vacío"

        # --- sessionStorage ---
        page_a.evaluate("sessionStorage.setItem('filtro', 'activo')")
        valor_session_b = page_b.evaluate(
            "sessionStorage.getItem('filtro')"
        )
        assert valor_session_b is None, \
            "sessionStorage de Context B debe estar vacío"

        print("✅ Aislamiento total: cookies, localStorage, sessionStorage")

        ctx_a.close()
        ctx_b.close()
        browser.close()</code></pre>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📋 Resumen de aislamiento por context</h4>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Recurso</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">¿Aislado?</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Detalle</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">Cookies</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">✅ Sí</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Cada context tiene su propio cookie jar</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">localStorage</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">✅ Sí</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Almacenamiento local independiente por context</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">sessionStorage</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">✅ Sí</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Sesiones completamente separadas</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">IndexedDB</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">✅ Sí</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Bases de datos independientes</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">Service Workers</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">✅ Sí</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Registros de SW aislados</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">Proceso del navegador</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">❌ Compartido</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Todos los contexts comparten el mismo proceso</td>
                </tr>
            </table>
        </div>

        <h3>⚡ Rendimiento: Contexts vs. Browsers</h3>
        <p>Una pregunta común: ¿por qué no simplemente abrir dos navegadores? Porque los
        <strong>contexts son mucho más eficientes</strong>.</p>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>❌ Anti-patrón: Múltiples browsers para múltiples usuarios</h4>
            <pre><code class="python"># ❌ INCORRECTO — Consume el doble de recursos
def test_dos_browsers_innecesarios():
    with sync_playwright() as p:
        # Cada browser lanza un proceso completo del navegador
        browser_a = p.chromium.launch()  # ~100-200 MB RAM
        browser_b = p.chromium.launch()  # ~100-200 MB más

        page_a = browser_a.new_page()
        page_b = browser_b.new_page()
        # ... tests ...
        browser_a.close()
        browser_b.close()</code></pre>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Correcto: Múltiples contexts en un solo browser</h4>
            <pre><code class="python"># ✅ CORRECTO — Comparten proceso, mucho más eficiente
def test_dos_contexts_eficientes():
    with sync_playwright() as p:
        browser = p.chromium.launch()  # Un solo proceso

        # Dos contexts: aislamiento total, recurso compartido
        ctx_a = browser.new_context()  # ~10-30 MB adicionales
        ctx_b = browser.new_context()  # ~10-30 MB adicionales

        page_a = ctx_a.new_page()
        page_b = ctx_b.new_page()
        # ... tests ...
        ctx_a.close()
        ctx_b.close()
        browser.close()</code></pre>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip: ¿Cuándo SÍ necesitas múltiples browsers?</h4>
            <p>Solo necesitas múltiples instancias de browser cuando necesitas probar
            <strong>cross-browser</strong> (Chrome + Firefox simultáneamente). Para simular
            múltiples usuarios del mismo navegador, <strong>siempre usa contexts</strong>. Un browser
            puede manejar decenas de contexts sin problemas.</p>
        </div>

        <h3>🧩 Fixtures para tests multi-context en conftest.py</h3>
        <p>Para no repetir el boilerplate de crear contexts en cada test, creamos fixtures
        reutilizables en <code>conftest.py</code>.</p>

        <pre><code class="python"># conftest.py
"""
Fixtures para tests que requieren múltiples browser contexts.
Cada context simula un usuario independiente con sesión aislada.
"""
import pytest
from playwright.sync_api import Browser, BrowserContext, Page


@pytest.fixture(scope="session")
def browser_instance(playwright):
    """Browser compartido para toda la sesión de tests."""
    browser = playwright.chromium.launch(headless=True)
    yield browser
    browser.close()


@pytest.fixture
def admin_context(browser_instance: Browser) -> BrowserContext:
    """Context aislado para el usuario admin."""
    context = browser_instance.new_context(
        viewport={"width": 1920, "height": 1080},
        locale="es-CO",
    )
    yield context
    context.close()


@pytest.fixture
def user_context(browser_instance: Browser) -> BrowserContext:
    """Context aislado para un usuario regular."""
    context = browser_instance.new_context(
        viewport={"width": 1366, "height": 768},
        locale="es-CO",
    )
    yield context
    context.close()


@pytest.fixture
def admin_page(admin_context: BrowserContext) -> Page:
    """Page del admin, ya logueado."""
    page = admin_context.new_page()
    page.goto("https://mi-erp.com/login")
    page.fill("#usuario", "admin")
    page.fill("#clave", "admin_seguro")
    page.click("#btn-ingresar")
    page.wait_for_url("**/dashboard")
    yield page


@pytest.fixture
def user_page(user_context: BrowserContext) -> Page:
    """Page de un usuario regular, ya logueado."""
    page = user_context.new_page()
    page.goto("https://mi-erp.com/login")
    page.fill("#usuario", "jbravo")
    page.fill("#clave", "user_pass")
    page.click("#btn-ingresar")
    page.wait_for_url("**/dashboard")
    yield page


# --- Fixture combinada para tests multi-usuario ---

@pytest.fixture
def dos_usuarios(browser_instance: Browser):
    """
    Retorna una tupla (page_admin, page_usuario) con
    dos sesiones completamente aisladas y logueadas.
    """
    ctx_admin = browser_instance.new_context(locale="es-CO")
    ctx_user = browser_instance.new_context(locale="es-CO")

    page_admin = ctx_admin.new_page()
    page_user = ctx_user.new_page()

    # Login de ambos
    for page, usuario, clave in [
        (page_admin, "admin", "admin_seguro"),
        (page_user, "jbravo", "user_pass"),
    ]:
        page.goto("https://mi-erp.com/login")
        page.fill("#usuario", usuario)
        page.fill("#clave", clave)
        page.click("#btn-ingresar")
        page.wait_for_url("**/dashboard")

    yield page_admin, page_user

    ctx_admin.close()
    ctx_user.close()</code></pre>

        <h3>📝 Usando las fixtures en tests</h3>
        <p>Con las fixtures definidas, los tests quedan limpios y enfocados en la lógica de negocio.</p>

        <pre><code class="python"># test_multi_usuario.py
"""Tests que requieren interacción entre múltiples usuarios."""
from playwright.sync_api import Page, expect


class TestAdminYUsuario:
    """Tests de acciones cruzadas admin ↔ usuario."""

    def test_admin_publica_anuncio_usuario_lo_ve(
        self, admin_page: Page, user_page: Page
    ):
        """El admin publica un anuncio y el usuario lo ve."""
        # Admin crea un anuncio
        admin_page.goto("https://mi-erp.com/admin/anuncios")
        admin_page.click("#btn-nuevo-anuncio")
        admin_page.fill("#titulo", "Mantenimiento programado")
        admin_page.fill(
            "#contenido",
            "El sistema estará en mantenimiento el sábado."
        )
        admin_page.click("#btn-publicar")
        expect(admin_page.locator(".toast-exito")).to_be_visible()

        # El usuario navega al dashboard y ve el anuncio
        user_page.goto("https://mi-erp.com/dashboard")
        anuncio = user_page.locator(
            ".anuncio", has_text="Mantenimiento programado"
        )
        expect(anuncio).to_be_visible(timeout=10_000)

    def test_admin_desactiva_modulo_usuario_pierde_acceso(
        self, dos_usuarios
    ):
        """
        Usa la fixture combinada: el admin desactiva
        un módulo y el usuario pierde acceso.
        """
        page_admin, page_user = dos_usuarios

        # Verificar acceso previo
        page_user.goto("https://mi-erp.com/inventario")
        expect(page_user.locator("h1")).to_contain_text("Inventario")

        # Admin desactiva el módulo
        page_admin.goto("https://mi-erp.com/admin/modulos")
        page_admin.locator(
            "tr", has_text="Inventario"
        ).get_by_role("switch").click()
        page_admin.click("#btn-aplicar")

        # El usuario ya no puede acceder
        page_user.reload()
        expect(
            page_user.locator(".sin-acceso")
        ).to_be_visible(timeout=5_000)</code></pre>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔬 Avanzado: Más de dos contexts simultáneos</h4>
            <p>No hay límite práctico en la cantidad de contexts por browser. Puedes
            simular 3, 5 o incluso 10 usuarios simultáneos si el escenario lo requiere.</p>
            <pre><code class="python">def test_sala_de_chat_grupal(browser_instance):
    """Simula 5 usuarios en una sala de chat."""
    usuarios = ["ana", "carlos", "maria", "pedro", "lucia"]
    contexts = []
    pages = []

    for nombre in usuarios:
        ctx = browser_instance.new_context()
        page = ctx.new_page()
        page.goto("https://mi-app.com/login")
        page.fill("#username", nombre)
        page.fill("#password", f"pass_{nombre}")
        page.click("#btn-login")
        page.goto("https://mi-app.com/chat/sala-equipo")
        contexts.append(ctx)
        pages.append(page)

    # Ana envía un mensaje
    pages[0].fill("#input-mensaje", "Buenos días equipo")
    pages[0].click("#btn-enviar")

    # Todos los demás lo reciben
    from playwright.sync_api import expect
    for i in range(1, len(pages)):
        expect(
            pages[i].locator(".mensaje-recibido").last
        ).to_have_text("Buenos días equipo", timeout=15_000)

    # Limpieza
    for ctx in contexts:
        ctx.close()</code></pre>
        </div>

        <h3>🏢 Tip SIESA: Tests multi-usuario en ERPs</h3>
        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Aplicación en sistemas empresariales</h4>
            <p>En aplicaciones ERP como las que se trabajan en SIESA, los tests multi-context
            son especialmente útiles para:</p>
            <ul>
                <li><strong>Flujos de aprobación:</strong> Un usuario crea una solicitud de compra,
                su jefe la aprueba en otro context, y finanzas la procesa en un tercero</li>
                <li><strong>Permisos por compañía:</strong> Verificar que un usuario de la compañía A
                no puede ver datos de la compañía B (aislamiento de datos)</li>
                <li><strong>Bloqueo de registros:</strong> Si un usuario edita un registro, otro
                usuario debe ver el registro bloqueado o recibir una advertencia</li>
                <li><strong>Auditoría:</strong> Admin realiza una acción y el log de auditoría
                es visible para el auditor en otro context</li>
            </ul>
            <pre><code class="python"># Ejemplo: Flujo de aprobación con 3 contextos
def test_flujo_aprobacion_compras(browser_instance):
    """Solicitante → Jefe → Finanzas."""
    ctx_sol = browser_instance.new_context()
    ctx_jefe = browser_instance.new_context()
    ctx_fin = browser_instance.new_context()

    page_sol = ctx_sol.new_page()
    page_jefe = ctx_jefe.new_page()
    page_fin = ctx_fin.new_page()

    # ... login de cada rol ...

    # 1. Solicitante crea la orden
    page_sol.goto("https://mi-erp.com/compras/nueva")
    page_sol.fill("#proveedor", "Proveedor ABC")
    page_sol.fill("#monto", "5000000")
    page_sol.click("#btn-enviar-aprobacion")

    # 2. Jefe aprueba
    page_jefe.goto("https://mi-erp.com/aprobaciones")
    page_jefe.locator("tr", has_text="Proveedor ABC").click()
    page_jefe.click("#btn-aprobar")

    # 3. Finanzas procesa
    page_fin.goto("https://mi-erp.com/finanzas/pendientes")
    from playwright.sync_api import expect
    expect(
        page_fin.locator("tr", has_text="Proveedor ABC")
    ).to_be_visible(timeout=10_000)

    ctx_sol.close()
    ctx_jefe.close()
    ctx_fin.close()</code></pre>
        </div>

        <h3>⚠️ Errores comunes con múltiples contexts</h3>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>❌ Errores frecuentes</h4>
            <pre><code class="python"># ❌ Error 1: Olvidar cerrar los contexts
def test_sin_cleanup():
    ctx_a = browser.new_context()
    ctx_b = browser.new_context()
    page_a = ctx_a.new_page()
    page_b = ctx_b.new_page()
    # ... tests ...
    # ¡Nunca se cierran! → Fuga de memoria
    # Solución: usar try/finally o fixtures con yield

# ❌ Error 2: Crear páginas en el context equivocado
def test_context_equivocado():
    ctx_admin = browser.new_context()
    ctx_user = browser.new_context()
    page_admin = ctx_admin.new_page()
    page_user = ctx_admin.new_page()  # ¡ERROR! Debería ser ctx_user
    # Ambas páginas comparten cookies → ¡No hay aislamiento!

# ❌ Error 3: Esperar estado compartido entre contexts
def test_estado_compartido():
    ctx_a = browser.new_context()
    ctx_b = browser.new_context()
    page_a = ctx_a.new_page()
    page_b = ctx_b.new_page()

    page_a.goto("https://example.com")
    page_a.evaluate("localStorage.setItem('key', 'value')")

    page_b.goto("https://example.com")
    # ❌ Esto será None — localStorage NO se comparte
    valor = page_b.evaluate("localStorage.getItem('key')")
    assert valor == "value"  # ¡FALLA!</code></pre>
        </div>

        <h3>📊 Resumen</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎉 Conceptos clave de esta lección</h4>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #c8e6c9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Concepto</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Detalle</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">Múltiples contexts</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Permiten simular N usuarios independientes en un mismo test</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">Aislamiento</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Cookies, localStorage, sessionStorage, IndexedDB son independientes</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">Rendimiento</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Contexts comparten proceso del browser (~10-30 MB vs ~200 MB por browser)</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">Fixtures</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Usar conftest.py con yield para crear/destruir contexts automáticamente</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">Casos de uso</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Chat, admin+user, aprobaciones, concurrencia, notificaciones</td>
                </tr>
            </table>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 15px 0;">
            <h4>🏋️ Ejercicio: Test multi-usuario con contexts aislados</h4>
            <p>Implementa un test que simule la siguiente interacción entre dos usuarios:</p>
            <ol>
                <li><strong>Configura <code>conftest.py</code></strong> con dos fixtures: <code>admin_page</code>
                y <code>viewer_page</code>, cada una con su propio context y login automático</li>
                <li><strong>Test 1 — Crear y verificar:</strong> El admin crea un nuevo registro (producto,
                tarea, etc.) y el viewer lo ve en la lista</li>
                <li><strong>Test 2 — Modificar y verificar:</strong> El admin edita el nombre del registro
                y el viewer ve el nombre actualizado al recargar</li>
                <li><strong>Test 3 — Aislamiento de sesión:</strong> Verifica que el admin y el viewer
                tienen <strong>cookies diferentes</strong> — imprime las cookies de ambos contexts y confirma
                que no se solapan</li>
                <li><strong>Bonus:</strong> Agrega un tercer context (auditor) que verifica que el log de
                auditoría registra las acciones del admin</li>
            </ol>

            <div style="background: #ffe0b2; padding: 10px; border-radius: 5px; margin-top: 10px;">
                <strong>Estructura esperada:</strong>
                <pre><code class="bash">multi_context_project/
├── conftest.py          # Fixtures: browser, admin_page, viewer_page
├── test_crear.py        # Admin crea → Viewer ve
├── test_editar.py       # Admin edita → Viewer ve cambio
└── test_aislamiento.py  # Verificar que cookies son independientes</code></pre>
            </div>

            <div style="background: #ffe0b2; padding: 10px; border-radius: 5px; margin-top: 10px;">
                <strong>Criterios de evaluación:</strong>
                <ul>
                    <li>Cada test usa <strong>dos o más contexts</strong> (no dos browsers)</li>
                    <li>Los contexts se crean y cierran correctamente (sin fugas de memoria)</li>
                    <li>Las fixtures de <code>conftest.py</code> usan <code>yield</code> para cleanup</li>
                    <li>Los tests verifican el estado <strong>antes y después</strong> de la acción del admin</li>
                    <li>El test de aislamiento demuestra que las cookies son independientes</li>
                </ul>
            </div>
        </div>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos cumplidos en esta lección:</h4>
            <ul>
                <li>Crear múltiples browser contexts para simular usuarios simultáneos</li>
                <li>Implementar tests de chat y notificaciones en tiempo real</li>
                <li>Verificar cambios de permisos entre sesiones admin/usuario</li>
                <li>Demostrar el aislamiento total de cookies, localStorage y sessionStorage</li>
                <li>Entender la ventaja de rendimiento: contexts vs. browsers</li>
                <li>Crear fixtures reutilizables para tests multi-context</li>
                <li>Evitar errores comunes (fuga de memoria, context equivocado, estado compartido)</li>
            </ul>
        </div>

        <h3>🚀 Siguiente: Storage state — reutilizar sesiones</h3>
        <p>En la próxima lección (090) aprenderás a <strong>guardar y reutilizar el estado de
        autenticación</strong> con <code>storage_state</code>. Esto permite que no tengas que hacer
        login en cada test: guardas las cookies y localStorage de una sesión autenticada y las
        cargas directamente en nuevos contexts. Es la clave para tests rápidos en aplicaciones
        que requieren autenticación.</p>
    `,
    topics: ["múltiples", "contexts", "aislamiento"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_089 = LESSON_089;
}
