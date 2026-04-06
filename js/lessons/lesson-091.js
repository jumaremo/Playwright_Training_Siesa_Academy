/**
 * Playwright Academy - Lección 091
 * Perfiles de navegador y configuración
 * Sección 13: Browser Contexts e Isolation
 */

const LESSON_091 = {
    id: 91,
    title: "Perfiles de navegador y configuración",
    duration: "7 min",
    level: "intermediate",
    section: "section-13",
    content: `
        <h2>⚙️ Perfiles de navegador y configuración</h2>
        <p>Cada <strong>browser context</strong> en Playwright es un perfil aislado con su propia
        configuración: viewport, geolocalización, idioma, permisos, user-agent, esquema de colores y más.
        Dominar estas opciones permite simular <strong>dispositivos reales</strong>, condiciones de red
        específicas y perfiles de usuario sin necesidad de navegadores separados.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📋 Lo que aprenderás</h4>
            <ul>
                <li>Configurar viewport, escala y emulación de dispositivos</li>
                <li>Establecer geolocalización, locale y timezone</li>
                <li>Controlar permisos, color scheme y user-agent</li>
                <li>Configurar credenciales HTTP, headers extra y modo offline</li>
                <li>Combinar múltiples opciones en un solo contexto</li>
            </ul>
        </div>

        <h3>🖥️ 1. Opciones de configuración del context</h3>
        <p>El método <code>browser.new_context()</code> acepta numerosas opciones que definen el perfil
        del navegador. Cada contexto es independiente — cambiar la configuración de uno no afecta a otros.</p>

        <pre><code class="python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Contexto con configuración mínima (valores por defecto)
    context_default = browser.new_context()

    # Contexto con configuración personalizada
    context_custom = browser.new_context(
        viewport={"width": 1280, "height": 720},
        locale="es-CO",
        timezone_id="America/Bogota",
        color_scheme="dark"
    )

    page_default = context_default.new_page()
    page_custom = context_custom.new_page()

    # Cada page hereda la config de su context
    page_default.goto("https://example.com")
    page_custom.goto("https://example.com")

    context_default.close()
    context_custom.close()
    browser.close()</code></pre>

        <h3>📐 2. Viewport: width, height y device_scale_factor</h3>
        <p>El viewport controla las dimensiones de la ventana visible del navegador.
        <code>device_scale_factor</code> simula pantallas de alta densidad (Retina, HiDPI).</p>

        <pre><code class="python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Viewport de escritorio estándar
    ctx_desktop = browser.new_context(
        viewport={"width": 1920, "height": 1080}
    )

    # Viewport de tablet
    ctx_tablet = browser.new_context(
        viewport={"width": 768, "height": 1024},
        device_scale_factor=2  # Retina display
    )

    # Viewport mobile
    ctx_mobile = browser.new_context(
        viewport={"width": 375, "height": 812},
        device_scale_factor=3,
        is_mobile=True,          # Habilita meta viewport
        has_touch=True            # Habilita eventos táctiles
    )

    # Probar responsive design
    for ctx, nombre in [
        (ctx_desktop, "desktop"),
        (ctx_tablet, "tablet"),
        (ctx_mobile, "mobile")
    ]:
        page = ctx.new_page()
        page.goto("https://mi-erp.siesa.com")
        page.screenshot(path=f"screenshot_{nombre}.png")
        ctx.close()

    browser.close()</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>En SIESA, los módulos ERP se usan en pantallas de distintos tamaños:
            monitores de escritorio (1920×1080), laptops (1366×768) y ocasionalmente tablets.
            Configura viewports que reflejen los <strong>dispositivos reales de los usuarios</strong>
            del ERP para detectar problemas de layout antes de producción.</p>
        </div>

        <h3>📱 3. Emulación de dispositivos</h3>
        <p>Playwright incluye un registro de dispositivos predefinidos con viewport, user-agent,
        <code>device_scale_factor</code>, <code>is_mobile</code> y <code>has_touch</code> ya configurados.</p>

        <pre><code class="python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Emular iPhone 13
    iphone = p.devices["iPhone 13"]
    ctx_iphone = browser.new_context(**iphone)
    page_iphone = ctx_iphone.new_page()
    page_iphone.goto("https://example.com")
    print(f"iPhone 13 viewport: {iphone['viewport']}")
    # {'width': 390, 'height': 844}

    # Emular Pixel 5
    pixel = p.devices["Pixel 5"]
    ctx_pixel = browser.new_context(**pixel)
    page_pixel = ctx_pixel.new_page()
    page_pixel.goto("https://example.com")
    print(f"Pixel 5 viewport: {pixel['viewport']}")
    # {'width': 393, 'height': 851}

    # Emular iPad Pro
    ipad = p.devices["iPad Pro 11"]
    ctx_ipad = browser.new_context(**ipad)
    page_ipad = ctx_ipad.new_page()
    page_ipad.goto("https://example.com")

    # Se pueden extender las opciones del dispositivo
    ctx_custom_iphone = browser.new_context(
        **iphone,
        locale="es-CO",
        timezone_id="America/Bogota",
        color_scheme="dark"
    )

    ctx_iphone.close()
    ctx_pixel.close()
    ctx_ipad.close()
    ctx_custom_iphone.close()
    browser.close()</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Dispositivos disponibles comunes</h4>
            <pre><code class="python"># Ver todos los dispositivos disponibles
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    # Lista parcial de dispositivos predefinidos
    dispositivos_comunes = [
        "iPhone 13", "iPhone 13 Pro", "iPhone 13 Pro Max",
        "iPhone 14", "iPhone 14 Pro", "iPhone 14 Pro Max",
        "Pixel 5", "Pixel 7",
        "Galaxy S8", "Galaxy S9+", "Galaxy Tab S4",
        "iPad (gen 7)", "iPad Pro 11",
        "Desktop Chrome", "Desktop Firefox", "Desktop Safari"
    ]

    for nombre in dispositivos_comunes:
        if nombre in p.devices:
            d = p.devices[nombre]
            print(f"{nombre}: {d['viewport']} - scale: {d.get('device_scale_factor', 1)}")</code></pre>
        </div>

        <h3>📍 4. Geolocalización</h3>
        <p>Puedes establecer una ubicación geográfica falsa para el contexto del navegador.
        Esto es fundamental para probar aplicaciones que usan la API de geolocalización.</p>

        <pre><code class="python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Configurar geolocalización para Cali, Colombia
    context = browser.new_context(
        geolocation={"latitude": 3.4516, "longitude": -76.5320},
        permissions=["geolocation"]  # Conceder permiso automáticamente
    )

    page = context.new_page()
    page.goto("https://maps.google.com")

    # Obtener coordenadas vía JavaScript
    coords = page.evaluate("""() => {
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude
                })
            );
        });
    }""")
    print(f"Lat: {coords['lat']}, Lon: {coords['lon']}")
    # Lat: 3.4516, Lon: -76.532

    # Cambiar geolocalización durante la sesión
    context.set_geolocation({"latitude": 4.6097, "longitude": -74.0818})
    # Ahora apunta a Bogotá

    context.close()
    browser.close()</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>Si el ERP o portal de SIESA valida la ubicación del usuario (por ejemplo, para
            restringir acceso a ciertas sedes o para registros de asistencia geolocalizados
            en HCM), usa geolocalización falsa para verificar que las validaciones
            funcionan correctamente con coordenadas dentro y fuera del rango permitido.</p>
        </div>

        <h3>🌐 5. Locale y timezone</h3>
        <p>Controlar el idioma y la zona horaria permite probar la internacionalización
        y la representación correcta de fechas, números y moneda.</p>

        <pre><code class="python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Contexto con configuración colombiana
    ctx_colombia = browser.new_context(
        locale="es-CO",
        timezone_id="America/Bogota"
    )

    page = ctx_colombia.new_page()
    page.goto("https://example.com")

    # Verificar formato de fecha colombiano
    fecha = page.evaluate("""() => {
        return new Date('2026-04-04T10:30:00Z').toLocaleString();
    }""")
    print(f"Colombia: {fecha}")
    # "4/4/2026, 5:30:00 a. m." (UTC-5)

    # Verificar formato de moneda
    moneda = page.evaluate("""() => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency', currency: 'COP'
        }).format(1500000);
    }""")
    print(f"Moneda: {moneda}")
    # "$ 1.500.000,00"

    ctx_colombia.close()

    # Contexto para pruebas en inglés (mercado internacional)
    ctx_us = browser.new_context(
        locale="en-US",
        timezone_id="America/New_York"
    )

    page_us = ctx_us.new_page()
    page_us.goto("https://example.com")

    fecha_us = page_us.evaluate("""() => {
        return new Date('2026-04-04T10:30:00Z').toLocaleString();
    }""")
    print(f"US: {fecha_us}")
    # "4/4/2026, 6:30:00 AM" (UTC-4)

    ctx_us.close()
    browser.close()</code></pre>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>❌ Error común: ignorar timezone en assertions</h4>
            <pre><code class="python"># MAL: Aserción sin considerar timezone
def test_fecha_creacion(page):
    page.goto("/factura/nueva")
    page.click("button#crear")
    # La hora mostrada depende del timezone del context!
    fecha_texto = page.text_content(".fecha-creacion")
    assert "10:30" in fecha_texto  # Puede fallar si el timezone no es el esperado

# BIEN: Configurar timezone explícito
def test_fecha_creacion_con_timezone(page, browser):
    context = browser.new_context(timezone_id="America/Bogota")
    page = context.new_page()
    page.goto("/factura/nueva")
    page.click("button#crear")
    fecha_texto = page.text_content(".fecha-creacion")
    # Ahora sabemos que la hora está en zona colombiana (UTC-5)
    assert "05:30" in fecha_texto  # Consistente
    context.close()</code></pre>
        </div>

        <h3>🎨 6. Color scheme (dark/light mode)</h3>
        <p>La opción <code>color_scheme</code> controla la preferencia de esquema de colores que
        el navegador reporta a la aplicación mediante <code>prefers-color-scheme</code>.</p>

        <pre><code class="python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Probar modo oscuro
    ctx_dark = browser.new_context(color_scheme="dark")
    page_dark = ctx_dark.new_page()
    page_dark.goto("https://mi-app.siesa.com")

    # Verificar que el CSS de dark mode se aplica
    bg_color = page_dark.evaluate("""() => {
        return getComputedStyle(document.body).backgroundColor;
    }""")
    print(f"Dark mode background: {bg_color}")

    # Verificar media query
    is_dark = page_dark.evaluate("""() => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }""")
    assert is_dark is True

    page_dark.screenshot(path="dark_mode.png")
    ctx_dark.close()

    # Probar modo claro
    ctx_light = browser.new_context(color_scheme="light")
    page_light = ctx_light.new_page()
    page_light.goto("https://mi-app.siesa.com")
    page_light.screenshot(path="light_mode.png")
    ctx_light.close()

    # También se puede emular 'no-preference'
    ctx_none = browser.new_context(color_scheme="no-preference")
    ctx_none.close()

    browser.close()</code></pre>

        <h3>🔐 7. Permisos del navegador</h3>
        <p>Los permisos controlan el acceso a APIs del navegador que normalmente requieren
        autorización del usuario (diálogos de "Permitir/Bloquear").</p>

        <pre><code class="python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Conceder múltiples permisos al crear el contexto
    context = browser.new_context(
        permissions=["geolocation", "notifications"]
    )

    page = context.new_page()
    page.goto("https://mi-app.siesa.com")

    # Conceder permisos adicionales después de crear el contexto
    context.grant_permissions(
        ["camera", "microphone"],
        origin="https://mi-app.siesa.com"  # Solo para este origen
    )

    # Verificar que las notificaciones están permitidas
    perm_status = page.evaluate("""async () => {
        const result = await navigator.permissions.query({name: 'notifications'});
        return result.state;
    }""")
    print(f"Notificaciones: {perm_status}")
    # "granted"

    # Limpiar permisos (volver a estado default)
    context.clear_permissions()

    context.close()
    browser.close()</code></pre>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📋 Permisos disponibles</h4>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #1565c0; color: white;">
                    <th style="padding: 8px; text-align: left;">Permiso</th>
                    <th style="padding: 8px; text-align: left;">Uso</th>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px;"><code>"geolocation"</code></td>
                    <td style="padding: 8px;">Acceso a ubicación GPS</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><code>"notifications"</code></td>
                    <td style="padding: 8px;">Notificaciones push del navegador</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px;"><code>"camera"</code></td>
                    <td style="padding: 8px;">Acceso a cámara web</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><code>"microphone"</code></td>
                    <td style="padding: 8px;">Acceso a micrófono</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px;"><code>"clipboard-read"</code></td>
                    <td style="padding: 8px;">Leer del portapapeles</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><code>"clipboard-write"</code></td>
                    <td style="padding: 8px;">Escribir al portapapeles</td>
                </tr>
            </table>
        </div>

        <h3>🕵️ 8. Override del User-Agent</h3>
        <p>El <code>user_agent</code> identifica al navegador ante el servidor. Cambiarlo permite
        probar respuestas del servidor a diferentes navegadores o bots.</p>

        <pre><code class="python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Simular un navegador móvil específico
    context = browser.new_context(
        user_agent="Mozilla/5.0 (Linux; Android 12; Pixel 5) "
                   "AppleWebKit/537.36 (KHTML, like Gecko) "
                   "Chrome/110.0.0.0 Mobile Safari/537.36"
    )

    page = context.new_page()
    page.goto("https://mi-app.siesa.com")

    # Verificar que el servidor responde con versión móvil
    is_mobile_version = page.is_visible(".mobile-nav")
    print(f"Versión móvil: {is_mobile_version}")

    # También puedes verificar el user-agent desde JS
    ua = page.evaluate("() => navigator.userAgent")
    print(f"User-Agent: {ua}")

    context.close()

    # Simular un bot/crawler para probar SEO
    ctx_bot = browser.new_context(
        user_agent="Googlebot/2.1 (+http://www.google.com/bot.html)"
    )
    page_bot = ctx_bot.new_page()
    page_bot.goto("https://mi-app.siesa.com")
    # Verificar que el contenido SEO está presente
    ctx_bot.close()

    browser.close()</code></pre>

        <h3>🔑 9. Credenciales HTTP (Basic Auth)</h3>
        <p>Para sitios protegidos con autenticación HTTP básica, puedes proporcionar
        credenciales directamente en el contexto sin manejar diálogos.</p>

        <pre><code class="python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Configurar credenciales HTTP
    context = browser.new_context(
        http_credentials={
            "username": "admin",
            "password": "secreto123"
        }
    )

    page = context.new_page()

    # El navegador envía las credenciales automáticamente
    # No aparece el diálogo de autenticación
    page.goto("https://staging.siesa.com/admin")

    # Verificar acceso exitoso
    assert page.title() != "401 Unauthorized"
    print("Autenticación HTTP exitosa")

    context.close()

    # También se pueden enviar credenciales para un proxy
    ctx_proxy = browser.new_context(
        proxy={
            "server": "http://proxy.siesa.com:8080",
            "username": "proxy_user",
            "password": "proxy_pass"
        }
    )
    ctx_proxy.close()

    browser.close()</code></pre>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>❌ Nunca hardcodees credenciales en el código</h4>
            <pre><code class="python">import os

# MAL: credenciales hardcodeadas
context = browser.new_context(
    http_credentials={"username": "admin", "password": "123456"}
)

# BIEN: usar variables de entorno
context = browser.new_context(
    http_credentials={
        "username": os.environ["HTTP_USER"],
        "password": os.environ["HTTP_PASS"]
    }
)</code></pre>
        </div>

        <h3>📡 10. Modo offline</h3>
        <p>Playwright permite simular la pérdida de conexión a internet para probar
        el comportamiento offline de la aplicación.</p>

        <pre><code class="python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context()
    page = context.new_page()

    # Cargar la aplicación normalmente
    page.goto("https://mi-app.siesa.com")
    assert page.is_visible(".dashboard")

    # Activar modo offline
    context.set_offline(True)

    # Intentar navegar — debe fallar o mostrar contenido cacheado
    try:
        page.goto("https://mi-app.siesa.com/otra-pagina")
    except Exception as e:
        print(f"Error esperado en modo offline: {e}")

    # Verificar comportamiento offline de la app
    # (Service Workers, almacenamiento local, mensajes de error)
    offline_msg = page.is_visible(".offline-indicator")
    print(f"Indicador offline visible: {offline_msg}")

    # Restaurar la conexión
    context.set_offline(False)

    # Verificar reconexión
    page.goto("https://mi-app.siesa.com/dashboard")
    assert page.is_visible(".dashboard")

    context.close()
    browser.close()</code></pre>

        <h3>📨 11. Extra HTTP headers</h3>
        <p>Puedes agregar headers HTTP personalizados que se enviarán con cada solicitud
        del contexto. Útil para tokens, identificadores de prueba o cabeceras de monitoreo.</p>

        <pre><code class="python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Agregar headers personalizados al contexto
    context = browser.new_context(
        extra_http_headers={
            "X-Test-ID": "suite-regresion-2026",
            "X-Environment": "staging",
            "Accept-Language": "es-CO,es;q=0.9"
        }
    )

    page = context.new_page()

    # Verificar que los headers se envían
    def on_request(request):
        headers = request.headers
        if "x-test-id" in headers:
            print(f"Header enviado: X-Test-ID = {headers['x-test-id']}")

    page.on("request", on_request)
    page.goto("https://mi-app.siesa.com")

    context.close()

    # También se pueden establecer headers a nivel de página
    context2 = browser.new_context()
    page2 = context2.new_page()
    page2.set_extra_http_headers({
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9...",
        "X-Custom-Header": "valor-personalizado"
    })
    page2.goto("https://api.siesa.com/dashboard")

    context2.close()
    browser.close()</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>Agregar un header <code>X-Test-ID</code> en las pruebas permite filtrar las
            solicitudes de prueba en los logs del servidor. Así el equipo de infraestructura
            puede distinguir tráfico de prueba del tráfico real, y los datos generados
            durante la automatización se pueden limpiar fácilmente.</p>
        </div>

        <h3>🔗 12. Combinando múltiples opciones en new_context()</h3>
        <p>El poder real está en combinar varias opciones para crear perfiles completos
        que simulan escenarios reales de usuarios.</p>

        <pre><code class="python">from playwright.sync_api import sync_playwright
import os

with sync_playwright() as p:
    browser = p.chromium.launch()

    # --- Perfil: Usuario móvil colombiano en campo ---
    iphone = p.devices["iPhone 13"]
    ctx_campo = browser.new_context(
        **iphone,
        locale="es-CO",
        timezone_id="America/Bogota",
        geolocation={"latitude": 3.4516, "longitude": -76.5320},
        permissions=["geolocation"],
        color_scheme="light",
        extra_http_headers={
            "X-Test-Profile": "mobile-field-user",
            "X-Region": "valle-del-cauca"
        }
    )

    page_campo = ctx_campo.new_page()
    page_campo.goto("https://mi-app.siesa.com")
    page_campo.screenshot(path="perfil_campo_mobile.png")
    ctx_campo.close()

    # --- Perfil: Administrador en oficina con dark mode ---
    ctx_admin = browser.new_context(
        viewport={"width": 1920, "height": 1080},
        locale="es-CO",
        timezone_id="America/Bogota",
        color_scheme="dark",
        http_credentials={
            "username": os.environ.get("ADMIN_USER", "admin"),
            "password": os.environ.get("ADMIN_PASS", "pass")
        },
        extra_http_headers={
            "X-Test-Profile": "admin-office",
            "X-Test-ID": "regression-2026"
        },
        permissions=["clipboard-read", "clipboard-write", "notifications"]
    )

    page_admin = ctx_admin.new_page()
    page_admin.goto("https://mi-app.siesa.com/admin")
    page_admin.screenshot(path="perfil_admin_dark.png")
    ctx_admin.close()

    # --- Perfil: QA Medellín probando offline ---
    ctx_offline = browser.new_context(
        viewport={"width": 1366, "height": 768},
        locale="es-CO",
        timezone_id="America/Bogota",
        geolocation={"latitude": 6.2442, "longitude": -75.5812},
        permissions=["geolocation"]
    )

    page_offline = ctx_offline.new_page()
    page_offline.goto("https://mi-app.siesa.com")
    # Simular pérdida de conexión
    ctx_offline.set_offline(True)
    page_offline.screenshot(path="perfil_qa_offline.png")
    ctx_offline.set_offline(False)
    ctx_offline.close()

    browser.close()</code></pre>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔬 Avanzado: Factory de perfiles con pytest</h4>
            <pre><code class="python"># conftest.py — Factory de perfiles reutilizables
import pytest
import os

PERFILES = {
    "mobile_cali": {
        "device": "iPhone 13",
        "locale": "es-CO",
        "timezone_id": "America/Bogota",
        "geolocation": {"latitude": 3.4516, "longitude": -76.5320},
        "permissions": ["geolocation"],
        "color_scheme": "light"
    },
    "desktop_bogota": {
        "viewport": {"width": 1920, "height": 1080},
        "locale": "es-CO",
        "timezone_id": "America/Bogota",
        "color_scheme": "dark"
    },
    "tablet_medellin": {
        "device": "iPad Pro 11",
        "locale": "es-CO",
        "timezone_id": "America/Bogota",
        "geolocation": {"latitude": 6.2442, "longitude": -75.5812},
        "permissions": ["geolocation"]
    }
}


@pytest.fixture
def profile_context(playwright, browser):
    """Fixture que crea un context a partir de un perfil."""
    contexts = []

    def _create(profile_name, **overrides):
        config = PERFILES[profile_name].copy()

        # Si incluye un dispositivo, expandirlo
        if "device" in config:
            device_name = config.pop("device")
            device_config = playwright.devices[device_name]
            config = {**device_config, **config}

        # Aplicar overrides
        config.update(overrides)

        ctx = browser.new_context(**config)
        contexts.append(ctx)
        return ctx

    yield _create

    for ctx in contexts:
        ctx.close()


# test_perfiles.py
def test_dashboard_mobile_cali(profile_context):
    """Verificar dashboard en perfil móvil de Cali."""
    ctx = profile_context("mobile_cali")
    page = ctx.new_page()
    page.goto("https://mi-app.siesa.com/dashboard")
    # El dashboard debe adaptarse a viewport móvil
    assert page.is_visible(".mobile-menu")
    assert not page.is_visible(".sidebar-desktop")


def test_dashboard_desktop_bogota(profile_context):
    """Verificar dashboard en perfil de escritorio Bogotá."""
    ctx = profile_context("desktop_bogota")
    page = ctx.new_page()
    page.goto("https://mi-app.siesa.com/dashboard")
    assert page.is_visible(".sidebar-desktop")

    # Verificar dark mode
    bg = page.evaluate(
        "() => getComputedStyle(document.body).backgroundColor"
    )
    # Color oscuro esperado
    assert bg != "rgb(255, 255, 255)"


def test_con_override(profile_context):
    """Perfil base con override de color scheme."""
    ctx = profile_context("mobile_cali", color_scheme="dark")
    page = ctx.new_page()
    page.goto("https://mi-app.siesa.com")
    is_dark = page.evaluate("""() =>
        window.matchMedia('(prefers-color-scheme: dark)').matches
    """)
    assert is_dark is True</code></pre>
        </div>

        <h3>🏋️ Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Ejercicio: Suite de perfiles multi-dispositivo</h4>
            <p>Crea un test que verifique la aplicación bajo 3 perfiles distintos usando
            configuraciones combinadas de viewport, locale, timezone y color scheme.</p>

            <pre><code class="python"># ejercicio_perfiles.py
# Objetivo: Crear tests para 3 perfiles de usuario distintos
from playwright.sync_api import sync_playwright
import os

def test_perfiles():
    """
    Completa el ejercicio:
    1. Define 3 perfiles: mobile_vendedor, desktop_contador, tablet_gerente
    2. Cada perfil debe tener: viewport, locale, timezone, color_scheme
    3. El perfil mobile_vendedor debe incluir geolocalización (Cali)
    4. El perfil desktop_contador debe incluir extra_http_headers
    5. Visita https://example.com con cada perfil
    6. Toma un screenshot con nombre descriptivo para cada uno
    7. Verifica que el viewport actual coincide con el configurado
    """
    with sync_playwright() as p:
        browser = p.chromium.launch()

        # TODO: Perfil 1 - Vendedor en campo (mobile, Cali)
        # Usa p.devices["iPhone 13"]
        # locale="es-CO", timezone_id="America/Bogota"
        # geolocation=Cali (3.4516, -76.5320)
        # color_scheme="light"

        # TODO: Perfil 2 - Contador en oficina (desktop, dark mode)
        # viewport=1920x1080
        # locale="es-CO", timezone_id="America/Bogota"
        # color_scheme="dark"
        # extra_http_headers: X-Role=contador

        # TODO: Perfil 3 - Gerente con tablet (iPad Pro)
        # Usa p.devices["iPad Pro 11"]
        # locale="es-CO", timezone_id="America/Bogota"
        # color_scheme="light"

        # Para cada perfil:
        # 1. Crear contexto con browser.new_context(**config)
        # 2. Crear página y navegar a https://example.com
        # 3. Verificar viewport con page.evaluate("() => ({w: window.innerWidth, h: window.innerHeight})")
        # 4. Tomar screenshot
        # 5. Cerrar contexto

        browser.close()

if __name__ == "__main__":
    test_perfiles()
    print("Todos los perfiles ejecutados correctamente")</code></pre>

            <details>
                <summary>Ver solución</summary>
                <pre><code class="python"># solucion_perfiles.py
from playwright.sync_api import sync_playwright

def test_perfiles():
    with sync_playwright() as p:
        browser = p.chromium.launch()

        # --- Perfil 1: Vendedor en campo (mobile, Cali) ---
        iphone = p.devices["iPhone 13"]
        ctx_vendedor = browser.new_context(
            **iphone,
            locale="es-CO",
            timezone_id="America/Bogota",
            geolocation={"latitude": 3.4516, "longitude": -76.5320},
            permissions=["geolocation"],
            color_scheme="light"
        )
        page_v = ctx_vendedor.new_page()
        page_v.goto("https://example.com")
        vp_v = page_v.evaluate("() => ({w: window.innerWidth, h: window.innerHeight})")
        print(f"Vendedor viewport: {vp_v['w']}x{vp_v['h']}")
        assert vp_v["w"] == iphone["viewport"]["width"]
        page_v.screenshot(path="perfil_vendedor_mobile.png")
        ctx_vendedor.close()

        # --- Perfil 2: Contador en oficina (desktop, dark) ---
        ctx_contador = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            locale="es-CO",
            timezone_id="America/Bogota",
            color_scheme="dark",
            extra_http_headers={"X-Role": "contador"}
        )
        page_c = ctx_contador.new_page()
        page_c.goto("https://example.com")
        vp_c = page_c.evaluate("() => ({w: window.innerWidth, h: window.innerHeight})")
        print(f"Contador viewport: {vp_c['w']}x{vp_c['h']}")
        assert vp_c["w"] == 1920
        is_dark = page_c.evaluate(
            "() => window.matchMedia('(prefers-color-scheme: dark)').matches"
        )
        assert is_dark is True
        page_c.screenshot(path="perfil_contador_desktop.png")
        ctx_contador.close()

        # --- Perfil 3: Gerente con tablet (iPad Pro) ---
        ipad = p.devices["iPad Pro 11"]
        ctx_gerente = browser.new_context(
            **ipad,
            locale="es-CO",
            timezone_id="America/Bogota",
            color_scheme="light"
        )
        page_g = ctx_gerente.new_page()
        page_g.goto("https://example.com")
        vp_g = page_g.evaluate("() => ({w: window.innerWidth, h: window.innerHeight})")
        print(f"Gerente viewport: {vp_g['w']}x{vp_g['h']}")
        assert vp_g["w"] == ipad["viewport"]["width"]
        page_g.screenshot(path="perfil_gerente_tablet.png")
        ctx_gerente.close()

        browser.close()
        print("Todos los perfiles verificados correctamente")

if __name__ == "__main__":
    test_perfiles()</code></pre>
            </details>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Resumen de opciones de new_context()</h4>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #2e7d32; color: white;">
                    <th style="padding: 8px; text-align: left;">Opción</th>
                    <th style="padding: 8px; text-align: left;">Tipo</th>
                    <th style="padding: 8px; text-align: left;">Ejemplo</th>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px;"><code>viewport</code></td>
                    <td style="padding: 8px;">dict</td>
                    <td style="padding: 8px;">{"width": 1920, "height": 1080}</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><code>device_scale_factor</code></td>
                    <td style="padding: 8px;">int</td>
                    <td style="padding: 8px;">2 (Retina)</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px;"><code>is_mobile</code></td>
                    <td style="padding: 8px;">bool</td>
                    <td style="padding: 8px;">True</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><code>has_touch</code></td>
                    <td style="padding: 8px;">bool</td>
                    <td style="padding: 8px;">True</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px;"><code>locale</code></td>
                    <td style="padding: 8px;">str</td>
                    <td style="padding: 8px;">"es-CO"</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><code>timezone_id</code></td>
                    <td style="padding: 8px;">str</td>
                    <td style="padding: 8px;">"America/Bogota"</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px;"><code>geolocation</code></td>
                    <td style="padding: 8px;">dict</td>
                    <td style="padding: 8px;">{"latitude": 3.45, "longitude": -76.53}</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><code>permissions</code></td>
                    <td style="padding: 8px;">list</td>
                    <td style="padding: 8px;">["geolocation", "notifications"]</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px;"><code>color_scheme</code></td>
                    <td style="padding: 8px;">str</td>
                    <td style="padding: 8px;">"dark" / "light"</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><code>user_agent</code></td>
                    <td style="padding: 8px;">str</td>
                    <td style="padding: 8px;">Custom UA string</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px;"><code>http_credentials</code></td>
                    <td style="padding: 8px;">dict</td>
                    <td style="padding: 8px;">{"username": "x", "password": "y"}</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><code>extra_http_headers</code></td>
                    <td style="padding: 8px;">dict</td>
                    <td style="padding: 8px;">{"X-Custom": "value"}</td>
                </tr>
            </table>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip final SIESA</h4>
            <p>Centraliza los perfiles de navegador en un archivo <code>conftest.py</code> o módulo
            de configuración compartido. Así, cuando cambien los requisitos de los dispositivos
            objetivo (por ejemplo, si se agrega soporte móvil al ERP), solo necesitas actualizar
            un lugar. Usa la factory de perfiles mostrada en la sección avanzada como punto de partida.</p>
        </div>
    `,
    topics: ["perfiles", "navegador", "configuración"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_091 = LESSON_091;
}
