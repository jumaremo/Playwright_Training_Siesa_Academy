/**
 * Playwright Academy - Lección 051
 * Geolocation, permissions, device emulation
 * Sección 6: Interacciones Web Avanzadas
 */

const LESSON_051 = {
    id: 51,
    title: "Geolocation, permissions, device emulation",
    duration: "5 min",
    level: "beginner",
    section: "section-06",
    content: `
        <h2>🌍 Geolocation, Permissions y Device Emulation</h2>
        <p>Playwright permite <strong>emular condiciones del dispositivo y del entorno</strong> directamente
        desde el código de test: geolocalización, permisos del navegador, tipo de dispositivo, esquema de
        colores, zona horaria, idioma y hasta modo offline. Estas capacidades son esenciales para probar
        aplicaciones que se adaptan al contexto del usuario.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎯 Objetivos de esta lección</h4>
            <ul>
                <li>Emular geolocalización con coordenadas personalizadas</li>
                <li>Otorgar y revocar permisos del navegador</li>
                <li>Emular dispositivos móviles con descriptores predefinidos</li>
                <li>Configurar esquema de colores, timezone, locale y modo offline</li>
                <li>Combinar múltiples emulaciones en un solo test</li>
            </ul>
        </div>

        <h3>📍 Emulación de Geolocalización</h3>
        <p>Puedes definir una ubicación geográfica ficticia al crear el contexto del navegador.
        Esto es fundamental para probar aplicaciones que usan la API de Geolocation del navegador
        (mapas, delivery, clima, etc.).</p>

        <pre><code class="python"># Configurar geolocalización al crear el contexto
import pytest
from playwright.sync_api import sync_playwright

def test_geolocalizacion_bogota():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(
            geolocation={"latitude": 4.7110, "longitude": -74.0721},
            permissions=["geolocation"]  # Necesario otorgar el permiso
        )
        page = context.new_page()
        page.goto("https://mycurrentlocation.net/")
        # La página debería mostrar coordenadas cercanas a Bogotá
        page.close()
        context.close()
        browser.close()</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚠️ Importante</h4>
            <p>La opción <code>geolocation</code> solo define las coordenadas, pero el navegador no
            las entregará a la página a menos que también otorgues el permiso <code>"geolocation"</code>.
            Siempre configura ambos juntos.</p>
        </div>

        <h3>🔄 Cambiar geolocalización durante el test</h3>
        <p>Puedes cambiar la ubicación en cualquier momento con <code>context.set_geolocation()</code>.
        Esto es útil para simular que el usuario se mueve.</p>

        <pre><code class="python"># Cambiar geolocalización durante la ejecución
def test_usuario_se_mueve(page, context):
    # Configuración inicial: Bogotá
    context.set_geolocation({"latitude": 4.7110, "longitude": -74.0721})

    page.goto("https://ejemplo-mapa.com")
    # Verificar que muestra Bogotá...

    # El usuario "viaja" a Cali
    context.set_geolocation({"latitude": 3.4516, "longitude": -76.5320})

    # Recargar para que la app lea la nueva ubicación
    page.reload()
    # Verificar que ahora muestra Cali...

    # El usuario "viaja" a Medellín
    context.set_geolocation({"latitude": 6.2476, "longitude": -75.5658})
    page.reload()
    # Verificar que ahora muestra Medellín...</code></pre>

        <h3>🔐 Gestión de Permisos</h3>
        <p>Playwright permite otorgar permisos del navegador de forma programática, sin que aparezca
        el popup nativo pidiendo autorización al usuario.</p>

        <h4>Otorgar permisos con grant_permissions()</h4>
        <pre><code class="python"># Otorgar múltiples permisos
context = browser.new_context()

# Otorgar permisos globalmente
context.grant_permissions(["geolocation", "notifications"])

# Otorgar permisos solo para un origen específico
context.grant_permissions(
    ["camera", "microphone"],
    origin="https://meet.google.com"
)

# Otorgar permiso de clipboard
context.grant_permissions(["clipboard-read", "clipboard-write"])</code></pre>

        <h4>Permisos disponibles</h4>
        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #e3f2fd;">
                <th style="padding: 8px; border: 1px solid #ddd;">Permiso</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Descripción</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Uso típico</th>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>geolocation</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Acceso a ubicación</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Mapas, delivery, clima</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>notifications</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Notificaciones push</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Apps de mensajería, alertas</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>camera</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Acceso a cámara</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Videollamadas, fotos</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>microphone</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Acceso a micrófono</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Llamadas, grabaciones</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>clipboard-read</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Leer clipboard</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Pegar contenido</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>clipboard-write</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Escribir en clipboard</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Botones de copiar</td>
            </tr>
        </table>

        <h4>Revocar permisos con clear_permissions()</h4>
        <pre><code class="python"># Revocar todos los permisos otorgados
context.clear_permissions()

# Caso de uso: probar qué pasa cuando se niega un permiso
def test_sin_permiso_geolocalizacion(page, context):
    # No otorgamos permiso de geolocation
    context.clear_permissions()

    page.goto("https://ejemplo-mapa.com")
    # La app debería mostrar un mensaje de error
    # o un fallback cuando no puede obtener la ubicación
    expect(page.locator(".error-location")).to_be_visible()</code></pre>

        <h3>📱 Emulación de Dispositivos</h3>
        <p>Playwright puede emular dispositivos móviles configurando viewport, user agent,
        factor de escala, modo táctil y más. Esto es fundamental para testing responsive.</p>

        <h4>Configuración manual de dispositivo</h4>
        <pre><code class="python"># Emular un dispositivo móvil manualmente
context = browser.new_context(
    viewport={"width": 375, "height": 812},          # iPhone X
    user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)...",
    device_scale_factor=3,                             # Retina 3x
    is_mobile=True,                                    # Activa comportamiento móvil
    has_touch=True                                     # Habilita eventos touch
)

page = context.new_page()
page.goto("https://ejemplo.com")
# La página debería renderizar en modo móvil</code></pre>

        <h4>Descriptores de dispositivo predefinidos</h4>
        <p>Playwright incluye descriptores para <strong>decenas de dispositivos reales</strong>.
        Esto simplifica enormemente el testing responsive.</p>

        <pre><code class="python"># Usar descriptores predefinidos de Playwright
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    # Obtener el descriptor del iPhone 13
    iphone_13 = p.devices["iPhone 13"]
    # iphone_13 contiene: viewport, user_agent, device_scale_factor, is_mobile, has_touch

    browser = p.chromium.launch()
    context = browser.new_context(**iphone_13)
    page = context.new_page()

    page.goto("https://ejemplo.com")
    # Se renderiza exactamente como en un iPhone 13

    context.close()
    browser.close()</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📋 Dispositivos populares disponibles</h4>
            <ul>
                <li><code>p.devices["iPhone 13"]</code> — iPhone 13 (390x844)</li>
                <li><code>p.devices["iPhone 13 Pro Max"]</code> — iPhone 13 Pro Max (428x926)</li>
                <li><code>p.devices["Pixel 5"]</code> — Google Pixel 5 (393x851)</li>
                <li><code>p.devices["Galaxy S9+"]</code> — Samsung Galaxy S9+ (320x658)</li>
                <li><code>p.devices["iPad (gen 7)"]</code> — iPad 7a generación (810x1080)</li>
                <li><code>p.devices["iPad Pro 11"]</code> — iPad Pro 11" (834x1194)</li>
                <li><code>p.devices["Desktop Chrome"]</code> — Chrome escritorio (1280x720)</li>
                <li><code>p.devices["Desktop Firefox"]</code> — Firefox escritorio (1280x720)</li>
            </ul>
            <p>Consulta la lista completa en la
            <a href="https://playwright.dev/python/docs/emulation#devices" target="_blank">documentación oficial</a>.</p>
        </div>

        <h4>Usar dispositivos con pytest-playwright</h4>
        <pre><code class="python"># conftest.py — Fixture para emulación de dispositivo
import pytest

@pytest.fixture
def context_iphone(playwright, browser):
    """Crea un contexto que emula un iPhone 13."""
    iphone = playwright.devices["iPhone 13"]
    context = browser.new_context(**iphone)
    yield context
    context.close()

@pytest.fixture
def page_iphone(context_iphone):
    """Página en contexto de iPhone 13."""
    page = context_iphone.new_page()
    yield page
    page.close()


# test_responsive.py — Usar la fixture
def test_menu_hamburguesa_en_movil(page_iphone):
    """En móvil debería mostrarse el menú hamburguesa."""
    page_iphone.goto("https://ejemplo.com")

    # El menú hamburguesa solo aparece en móvil
    hamburguesa = page_iphone.locator(".menu-hamburguesa")
    expect(hamburguesa).to_be_visible()

    # El menú de escritorio no debería verse
    menu_desktop = page_iphone.locator(".menu-desktop")
    expect(menu_desktop).to_be_hidden()</code></pre>

        <h3>🎨 Emulación de Esquema de Colores</h3>
        <p>Prueba cómo se ve tu aplicación en modo oscuro o claro, sin necesidad de cambiar
        la configuración del sistema operativo.</p>

        <pre><code class="python"># Emular dark mode
context_dark = browser.new_context(
    color_scheme="dark"
)
page = context_dark.new_page()
page.goto("https://ejemplo.com")
# La página debería renderizar con el tema oscuro
# si usa @media (prefers-color-scheme: dark)

# Emular light mode explícitamente
context_light = browser.new_context(
    color_scheme="light"
)

# Cambiar durante el test
page.emulate_media(color_scheme="dark")
# Verificar que los colores cambiaron
page.emulate_media(color_scheme="light")
# Verificar que volvió al tema claro</code></pre>

        <h3>♿ Reduced Motion</h3>
        <p>Emula la preferencia del usuario de reducir animaciones. Útil para verificar
        que tu app respeta las preferencias de accesibilidad.</p>

        <pre><code class="python"># Emular preferencia de movimiento reducido
context = browser.new_context(
    reduced_motion="reduce"
)
page = context.new_page()
page.goto("https://ejemplo.com")
# Las animaciones CSS que respetan prefers-reduced-motion
# deberían desactivarse o simplificarse

# También se puede cambiar durante el test
page.emulate_media(reduced_motion="reduce")
page.emulate_media(reduced_motion="no-preference")</code></pre>

        <h3>🕐 Zona Horaria y Locale</h3>
        <p>Configura la zona horaria y el idioma/región del navegador para probar
        internacionalización y formateo de fechas/números.</p>

        <pre><code class="python"># Emular zona horaria y locale de Colombia
context = browser.new_context(
    timezone_id="America/Bogota",
    locale="es-CO"
)
page = context.new_page()
page.goto("https://ejemplo.com")

# Verificar que las fechas se muestran en formato colombiano
# new Date().toLocaleDateString() → "3/4/2026" (formato es-CO)

# Otros ejemplos de timezone_id:
# "America/New_York", "Europe/London", "Asia/Tokyo", "America/Mexico_City"

# Otros ejemplos de locale:
# "en-US", "es-ES", "pt-BR", "fr-FR", "de-DE"</code></pre>

        <pre><code class="python"># Verificar internacionalización con evaluate
def test_formato_fecha_colombiano(page, context):
    context = browser.new_context(
        timezone_id="America/Bogota",
        locale="es-CO"
    )
    page = context.new_page()
    page.goto("https://ejemplo.com")

    # Leer la fecha formateada por JavaScript
    fecha = page.evaluate("""
        () => new Date('2026-04-03').toLocaleDateString()
    """)
    assert "abr" in fecha.lower() or "4" in fecha  # Formato colombiano

    # Verificar formato de moneda
    moneda = page.evaluate("""
        () => new Intl.NumberFormat('es-CO', {
            style: 'currency', currency: 'COP'
        }).format(1500000)
    """)
    assert "1.500.000" in moneda  # Separador de miles colombiano</code></pre>

        <h3>📡 Modo Offline</h3>
        <p>Simula la pérdida de conexión a internet para probar el comportamiento
        offline de tu aplicación (PWA, cache, mensajes de error).</p>

        <pre><code class="python"># Simular modo offline
def test_comportamiento_offline(page, context):
    page.goto("https://ejemplo.com")
    # Verificar que carga normalmente...

    # Activar modo offline
    context.set_offline(True)

    # Intentar navegar — debería fallar o mostrar contenido cached
    try:
        page.goto("https://ejemplo.com/otra-pagina")
    except Exception:
        pass  # Esperamos que falle

    # Verificar que la app muestra un mensaje offline
    # (si es una PWA con service worker)
    expect(page.locator(".offline-message")).to_be_visible()

    # Restaurar conexión
    context.set_offline(False)

    # Verificar que se recupera
    page.reload()
    expect(page.locator(".offline-message")).to_be_hidden()</code></pre>

        <h3>🔗 Ejemplo Completo: App de ubicación en móvil con dark mode</h3>
        <p>Combinemos todas las emulaciones en un test realista.</p>

        <pre><code class="python"># test_app_ubicacion_movil.py
"""
Test completo: app de ubicación en iPhone con dark mode,
geolocalización en Bogotá, zona horaria y locale colombiano.
"""
import pytest
from playwright.sync_api import sync_playwright, expect


def test_app_ubicacion_completa():
    with sync_playwright() as p:
        iphone_13 = p.devices["iPhone 13"]

        browser = p.chromium.launch()
        context = browser.new_context(
            **iphone_13,                                    # Emular iPhone 13
            geolocation={"latitude": 4.7110, "longitude": -74.0721},  # Bogotá
            permissions=["geolocation"],                    # Permiso de ubicación
            color_scheme="dark",                            # Modo oscuro
            timezone_id="America/Bogota",                   # Zona horaria
            locale="es-CO",                                 # Idioma colombiano
            reduced_motion="reduce"                         # Sin animaciones
        )

        page = context.new_page()
        page.goto("https://ejemplo-mapa.com")

        # --- Verificar modo móvil ---
        viewport = page.viewport_size
        assert viewport["width"] == 390   # iPhone 13 width
        assert viewport["height"] == 844  # iPhone 13 height

        # --- Verificar dark mode ---
        bg_color = page.evaluate("""
            () => getComputedStyle(document.body).backgroundColor
        """)
        # En dark mode esperamos un fondo oscuro

        # --- Verificar geolocalización ---
        coords = page.evaluate("""
            () => new Promise(resolve => {
                navigator.geolocation.getCurrentPosition(pos => {
                    resolve({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    });
                });
            })
        """)
        assert abs(coords["lat"] - 4.7110) < 0.01
        assert abs(coords["lng"] - (-74.0721)) < 0.01

        # --- Verificar locale ---
        locale = page.evaluate("() => navigator.language")
        assert locale == "es-CO"

        # --- Simular movimiento: Bogotá → Cali ---
        context.set_geolocation({"latitude": 3.4516, "longitude": -76.5320})
        page.reload()

        nuevas_coords = page.evaluate("""
            () => new Promise(resolve => {
                navigator.geolocation.getCurrentPosition(pos => {
                    resolve({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    });
                });
            })
        """)
        assert abs(nuevas_coords["lat"] - 3.4516) < 0.01

        # --- Probar modo offline ---
        context.set_offline(True)
        page.reload().catch(lambda: None)
        # Verificar comportamiento offline...

        context.set_offline(False)
        page.reload()
        # Verificar recuperación...

        context.close()
        browser.close()</code></pre>

        <h3>📊 Resumen de opciones de emulación</h3>
        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #e3f2fd;">
                <th style="padding: 8px; border: 1px solid #ddd;">Opción</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Parámetro</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Cuándo usarlo</th>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Geolocalización</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>geolocation</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>{"latitude": 4.71, "longitude": -74.07}</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Apps de mapas, delivery</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;">Permisos</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>permissions</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>["geolocation", "notifications"]</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Cualquier API que requiera permiso</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Viewport</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>viewport</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>{"width": 375, "height": 812}</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Testing responsive</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;">User Agent</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>user_agent</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>"Mozilla/5.0 (iPhone...)"</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Detección de dispositivo server-side</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Escala</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>device_scale_factor</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>2</code> o <code>3</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Pantallas retina/HiDPI</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;">Móvil</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>is_mobile</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>True</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Comportamiento de meta viewport</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Touch</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>has_touch</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>True</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Eventos táctiles, swipe</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;">Color scheme</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>color_scheme</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>"dark"</code> o <code>"light"</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Dark mode / light mode</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Reduced motion</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>reduced_motion</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>"reduce"</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Accesibilidad, sin animaciones</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;">Timezone</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>timezone_id</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>"America/Bogota"</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Internacionalización, fechas</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Locale</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>locale</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>"es-CO"</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Idioma, formato de números</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;">Offline</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>set_offline(True)</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Método del contexto</td>
                <td style="padding: 6px; border: 1px solid #ddd;">PWA, service workers, cache</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Dispositivo</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>p.devices["..."]</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>**p.devices["iPhone 13"]</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Emulación completa de dispositivo</td>
            </tr>
        </table>

        <h3>🎯 Ejercicio</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Ejercicio: Testing responsive con geolocalización</h4>
            <p>Crea un archivo <code>test_responsive_geo.py</code> que pruebe una página web
            en <strong>3 dispositivos diferentes</strong>, cada uno con una ubicación distinta:</p>
            <ol>
                <li><strong>iPhone 13</strong> con geolocalización en Bogotá (4.7110, -74.0721),
                    dark mode, locale <code>es-CO</code></li>
                <li><strong>Pixel 5</strong> con geolocalización en Ciudad de México (19.4326, -99.1332),
                    light mode, locale <code>es-MX</code></li>
                <li><strong>iPad Pro 11</strong> con geolocalización en Madrid (40.4168, -3.7038),
                    dark mode, locale <code>es-ES</code></li>
            </ol>
            <p>Para cada dispositivo:</p>
            <ul>
                <li>Navega a <code>https://the-internet.herokuapp.com</code></li>
                <li>Verifica que el viewport tiene las dimensiones correctas</li>
                <li>Verifica el locale con <code>page.evaluate("() => navigator.language")</code></li>
                <li>Verifica la geolocalización con <code>navigator.geolocation.getCurrentPosition</code></li>
                <li>Toma un screenshot con nombre descriptivo: <code>screenshot_{dispositivo}.png</code></li>
            </ul>
            <p><strong>Bonus:</strong> Usa <code>@pytest.mark.parametrize</code> para evitar duplicar código
            entre los 3 dispositivos.</p>
        </div>

        <pre><code class="python"># Estructura sugerida del ejercicio
import pytest
from playwright.sync_api import sync_playwright, expect

DISPOSITIVOS = [
    {
        "nombre": "iphone_13",
        "device": "iPhone 13",
        "geo": {"latitude": 4.7110, "longitude": -74.0721},
        "color_scheme": "dark",
        "locale": "es-CO",
        "timezone": "America/Bogota"
    },
    {
        "nombre": "pixel_5",
        "device": "Pixel 5",
        "geo": {"latitude": 19.4326, "longitude": -99.1332},
        "color_scheme": "light",
        "locale": "es-MX",
        "timezone": "America/Mexico_City"
    },
    {
        "nombre": "ipad_pro",
        "device": "iPad Pro 11",
        "geo": {"latitude": 40.4168, "longitude": -3.7038},
        "color_scheme": "dark",
        "locale": "es-ES",
        "timezone": "Europe/Madrid"
    },
]


@pytest.mark.parametrize("config", DISPOSITIVOS, ids=[d["nombre"] for d in DISPOSITIVOS])
def test_responsive_geolocalizacion(config):
    with sync_playwright() as p:
        device = p.devices[config["device"]]
        context = p.chromium.launch().new_context(
            **device,
            geolocation=config["geo"],
            permissions=["geolocation"],
            color_scheme=config["color_scheme"],
            locale=config["locale"],
            timezone_id=config["timezone"]
        )
        page = context.new_page()
        page.goto("https://the-internet.herokuapp.com")

        # Verificar viewport
        viewport = page.viewport_size
        assert viewport["width"] == device["viewport"]["width"]
        assert viewport["height"] == device["viewport"]["height"]

        # Verificar locale
        lang = page.evaluate("() => navigator.language")
        assert lang == config["locale"]

        # Screenshot
        page.screenshot(path=f"screenshot_{config['nombre']}.png")

        context.close()</code></pre>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Emular geolocalización estática y dinámica (mid-test)</li>
                <li>Otorgar y revocar permisos del navegador programáticamente</li>
                <li>Emular dispositivos con configuración manual y descriptores predefinidos</li>
                <li>Configurar color scheme, reduced motion, timezone y locale</li>
                <li>Simular modo offline y recuperación de conexión</li>
                <li>Combinar múltiples emulaciones en un test integrado</li>
            </ul>
        </div>

        <h3>🚀 Siguiente: Lección 052 — Proyecto: Interacciones complejas E2E</h3>
        <p>En la siguiente y última lección de esta sección (y del <strong>Nivel Básico</strong>)
        construirás un proyecto integrador que combina <strong>todas las interacciones web avanzadas</strong>:
        JavaScript execution, drag & drop, keyboard events, scroll, Shadow DOM, storage,
        geolocalización y emulación de dispositivos en un test suite E2E completo.</p>
    `,
    topics: ["geolocation", "permisos", "emulación"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_051 = LESSON_051;
}
