/**
 * Playwright Academy - Lección 100
 * Masking y umbrales de comparación
 * Sección 15: Visual Regression y Accessibility Testing
 */

const LESSON_100 = {
    id: 100,
    title: "Masking y umbrales de comparación",
    duration: "18 min",
    level: "advanced",
    section: "section-15",
    content: `
        <h2>🎭 Masking y umbrales de comparación</h2>
        <p>Las comparaciones visuales pixel a pixel son poderosas, pero en la práctica las páginas
        contienen <strong>zonas dinámicas</strong> que cambian entre ejecuciones: timestamps, avatares,
        anuncios, animaciones, contadores y contenido personalizado. Si no las gestionamos, cada
        ejecución producirá falsos positivos que erosionan la confianza en la suite visual.</p>

        <p>Playwright ofrece dos mecanismos complementarios: <strong>masking</strong> para excluir áreas
        específicas del screenshot y <strong>umbrales (thresholds)</strong> para tolerar diferencias
        menores a nivel de pixel. Dominar ambos es clave para lograr visual tests estables y
        confiables en CI/CD.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎯 Objetivos de esta lección</h4>
            <ul>
                <li>Entender por qué el masking es necesario en visual testing</li>
                <li>Aplicar <code>mask</code> y <code>mask_color</code> para excluir zonas dinámicas</li>
                <li>Configurar <code>threshold</code>, <code>max_diff_pixels</code> y <code>max_diff_pixel_ratio</code></li>
                <li>Manejar diferencias de anti-aliasing entre navegadores y sistemas operativos</li>
                <li>Inyectar CSS para desactivar animaciones antes de capturar</li>
                <li>Congelar contenido dinámico (timers, countdowns) para capturas estables</li>
            </ul>
        </div>

        <h3>🔍 ¿Por qué necesitamos masking?</h3>
        <p>En una aplicación real, muchas áreas de la interfaz cambian legítimamente entre ejecuciones
        sin que eso represente un bug visual:</p>

        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #e3f2fd;">
                <th style="padding: 8px; border: 1px solid #ddd;">Zona dinámica</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Impacto en visual test</th>
            </tr>
            <tr style="background: #ffffff;">
                <td style="padding: 8px; border: 1px solid #ddd;">Timestamps</td>
                <td style="padding: 8px; border: 1px solid #ddd;">"Hace 3 minutos", "04/04/2026 10:30"</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Falla en cada ejecución</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;">Avatares / Gravatars</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Imágenes de perfil generadas</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Varía por usuario/sesión</td>
            </tr>
            <tr style="background: #ffffff;">
                <td style="padding: 8px; border: 1px solid #ddd;">Publicidad / Ads</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Banners rotativos</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Contenido diferente cada vez</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;">Animaciones</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Spinners, transiciones, carousels</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Captura en frame diferente</td>
            </tr>
            <tr style="background: #ffffff;">
                <td style="padding: 8px; border: 1px solid #ddd;">Contadores / Timers</td>
                <td style="padding: 8px; border: 1px solid #ddd;">"Quedan 04:32", "15 items"</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Valor numérico cambia</td>
            </tr>
        </table>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>❌ Sin masking: falsos positivos constantes</h4>
            <pre><code class="python">from playwright.sync_api import Page, expect

def test_dashboard_sin_masking(page: Page):
    """Este test fallará casi siempre por contenido dinámico."""
    page.goto("https://mi-app.com/dashboard")

    # El dashboard tiene timestamps, avatar del usuario y un ad banner
    # Cada ejecución captura valores diferentes → FALLA
    expect(page).to_have_screenshot("dashboard.png")
    # AssertionError: screenshot doesn't match
    # 847 pixels differ (0.12% of total)</code></pre>
        </div>

        <h3>🎭 Parámetro mask: excluir zonas dinámicas</h3>
        <p>El parámetro <code>mask</code> recibe una <strong>lista de localizadores</strong>. Playwright
        reemplaza esas áreas con un rectángulo de color sólido antes de comparar, eliminando las
        diferencias dinámicas de la comparación.</p>

        <pre><code class="python">from playwright.sync_api import Page, expect

def test_dashboard_con_masking(page: Page):
    """Masking de zonas dinámicas para visual test estable."""
    page.goto("https://mi-app.com/dashboard")

    # Definir localizadores de las zonas a enmascarar
    timestamp = page.locator("[data-testid='last-updated']")
    avatar = page.locator(".user-avatar")
    ad_banner = page.locator("#ad-container")

    # mask recibe una lista de localizadores
    expect(page).to_have_screenshot(
        "dashboard.png",
        mask=[timestamp, avatar, ad_banner]
    )
    # Las áreas enmascaradas se reemplazan con un rectángulo magenta
    # y se excluyen de la comparación pixel a pixel</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Resultado con masking</h4>
            <p>Las zonas dinámicas se cubren con un rectángulo sólido <strong>tanto en el screenshot
            de referencia como en el actual</strong>. Así, la comparación se enfoca exclusivamente
            en las áreas estáticas del diseño. El test ahora pasa consistentemente.</p>
        </div>

        <h3>🎨 Parámetro mask_color: personalizar el color del mask</h3>
        <p>Por defecto, las áreas enmascaradas se muestran en <strong>magenta (#FF00FF)</strong>.
        Puedes cambiar el color con <code>mask_color</code> para hacer los masks más identificables
        en los reportes o para diferenciar tipos de áreas enmascaradas.</p>

        <pre><code class="python">from playwright.sync_api import Page, expect

def test_dashboard_mask_color_personalizado(page: Page):
    """Usar mask_color para identificar fácilmente las áreas enmascaradas."""
    page.goto("https://mi-app.com/dashboard")

    # mask_color acepta cualquier color CSS válido
    expect(page).to_have_screenshot(
        "dashboard.png",
        mask=[
            page.locator("[data-testid='timestamp']"),
            page.locator(".ad-banner"),
        ],
        mask_color="#808080"  # Gris — menos llamativo en reportes
    )

    # También acepta nombres de color CSS
    expect(page).to_have_screenshot(
        "dashboard-v2.png",
        mask=[page.locator(".dynamic-content")],
        mask_color="black"  # Negro sólido
    )</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA: Convención de colores para masks</h4>
            <p>En equipos grandes, establece una convención de colores para masks en la guía de estilo
            del proyecto: por ejemplo, <strong>gris (#808080)</strong> para contenido dinámico esperado,
            <strong>rojo (#FF0000)</strong> para áreas que se enmascararon temporalmente y necesitan
            revisión. Esto facilita la revisión de screenshots en el pipeline.</p>
        </div>

        <h3>🎯 Estrategias de masking</h3>
        <p>Existen varias formas de definir qué áreas enmascarar, dependiendo de la estructura
        de tu aplicación.</p>

        <h4>1. Masking por localizador (recomendado)</h4>
        <pre><code class="python">from playwright.sync_api import Page, expect

def test_masking_por_localizador(page: Page):
    """Estrategia preferida: usar localizadores semánticos."""
    page.goto("https://mi-app.com/perfil")

    # Localizadores semánticos — la mejor opción
    expect(page).to_have_screenshot(
        "perfil.png",
        mask=[
            page.get_by_test_id("fecha-registro"),
            page.get_by_test_id("ultimo-acceso"),
            page.get_by_role("img", name="Avatar del usuario"),
        ]
    )</code></pre>

        <h4>2. Masking por selector CSS</h4>
        <pre><code class="python">def test_masking_por_css(page: Page):
    """Masking con selectores CSS cuando no hay data-testid."""
    page.goto("https://mi-app.com/dashboard")

    # Selectores CSS — útil para agrupar múltiples elementos
    expect(page).to_have_screenshot(
        "dashboard.png",
        mask=[
            page.locator(".timestamp"),          # Todos los timestamps
            page.locator("[class*='ad-']"),       # Todo lo que empieza con "ad-"
            page.locator("time"),                 # Todos los elementos &lt;time&gt;
            page.locator(".animated"),            # Elementos con animaciones
        ]
    )</code></pre>

        <h4>3. Masking por región (nth, filtros)</h4>
        <pre><code class="python">def test_masking_por_region(page: Page):
    """Masking de regiones específicas del layout."""
    page.goto("https://mi-app.com/dashboard")

    # Enmascarar secciones completas del layout
    expect(page).to_have_screenshot(
        "dashboard.png",
        mask=[
            page.locator("aside.sidebar"),         # Sidebar completo
            page.locator("header .notifications"), # Solo notificaciones del header
            page.locator(".card").nth(2),           # La tercera tarjeta específica
        ]
    )

    # Masking de un elemento dentro de un contenedor específico
    expect(page).to_have_screenshot(
        "dashboard-body.png",
        mask=[
            page.locator(".main-content >> .live-counter"),
        ]
    )</code></pre>

        <h3>📏 Umbrales: tolerancia a diferencias de píxeles</h3>
        <p>Incluso con masking, las comparaciones pixel a pixel pueden fallar por diferencias
        legítimas: <strong>anti-aliasing</strong> del navegador, renderizado de fuentes en distintos
        sistemas operativos, o variaciones subpixel. Playwright ofrece tres parámetros de umbral
        para manejar estas situaciones.</p>

        <h4>1. threshold — sensibilidad a nivel de pixel individual</h4>
        <p>Controla cuánta diferencia se tolera en <strong>cada pixel individual</strong> al comparar.
        Rango de <code>0</code> (exacto, sin tolerancia) a <code>1</code> (cualquier diferencia se ignora).
        El valor por defecto es <code>0.2</code>.</p>

        <pre><code class="python">from playwright.sync_api import Page, expect

def test_threshold_basico(page: Page):
    """Ajustar sensibilidad de comparación pixel a pixel."""
    page.goto("https://mi-app.com/pagina-estatica")

    # threshold=0.2 (default) — tolera variaciones menores de color
    # Cada pixel se compara con su par: si la diferencia de color
    # normalizada es menor que 0.2, se considera igual
    expect(page).to_have_screenshot("estatica.png", threshold=0.2)

    # threshold=0 — comparación exacta, sin tolerancia
    # Útil para logos, iconos o imágenes que DEBEN ser idénticas
    expect(page).to_have_screenshot("logo.png", threshold=0)

    # threshold=0.3 — más permisivo
    # Útil cuando hay diferencias de renderizado entre OS
    expect(page).to_have_screenshot("cross-os.png", threshold=0.3)</code></pre>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔬 Detalle técnico: cómo funciona threshold</h4>
            <p>Playwright usa <strong>pixelmatch</strong> internamente. Para cada pixel, calcula la
            distancia euclidiana entre los colores RGB normalizados (0-1). Si la distancia es
            <strong>menor o igual</strong> al threshold, el pixel se considera "igual". Esto significa:</p>
            <ul>
                <li><code>threshold=0.0</code>: Los colores RGB deben ser idénticos bit a bit</li>
                <li><code>threshold=0.1</code>: Tolera variaciones sutiles (ej. #FF0000 vs #FE0101)</li>
                <li><code>threshold=0.2</code>: Tolera diferencias de anti-aliasing y subpixel rendering</li>
                <li><code>threshold=0.5</code>: Muy permisivo, solo detecta cambios grandes de color</li>
            </ul>
        </div>

        <h4>2. max_diff_pixels — número absoluto de píxeles diferentes</h4>
        <p>Define el <strong>número máximo de píxeles</strong> que pueden ser diferentes antes de
        que el test falle. Útil cuando sabes que cierta cantidad de píxeles siempre variará.</p>

        <pre><code class="python">def test_max_diff_pixels(page: Page):
    """Tolerar un número absoluto de píxeles diferentes."""
    page.goto("https://mi-app.com/dashboard")

    # Permitir hasta 100 píxeles diferentes
    # Útil cuando hay un cursor parpadeante, un reloj de segundos, etc.
    expect(page).to_have_screenshot(
        "dashboard.png",
        max_diff_pixels=100
    )

    # Combinado con threshold para doble capa de tolerancia
    expect(page).to_have_screenshot(
        "dashboard-tolerante.png",
        threshold=0.2,
        max_diff_pixels=50  # Si pasa threshold, aún permite 50 px distintos
    )</code></pre>

        <h4>3. max_diff_pixel_ratio — porcentaje de píxeles diferentes</h4>
        <p>Define el <strong>porcentaje máximo</strong> (0 a 1) de píxeles que pueden diferir.
        Es más portable que <code>max_diff_pixels</code> porque no depende de la resolución de pantalla.</p>

        <pre><code class="python">def test_max_diff_pixel_ratio(page: Page):
    """Tolerar un porcentaje de píxeles diferentes."""
    page.goto("https://mi-app.com/dashboard")

    # Permitir hasta 0.1% de píxeles diferentes
    # En un viewport de 1280x720 (921,600 px), esto es ~921 píxeles
    expect(page).to_have_screenshot(
        "dashboard.png",
        max_diff_pixel_ratio=0.001
    )

    # Más permisivo: 1% de diferencia
    expect(page).to_have_screenshot(
        "dashboard-flexible.png",
        max_diff_pixel_ratio=0.01  # ~9,216 píxeles en 1280x720
    )</code></pre>

        <h3>⚖️ ¿Cuándo usar cada umbral?</h3>
        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #e3f2fd;">
                <th style="padding: 8px; border: 1px solid #ddd;">Parámetro</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Cuándo usarlo</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo</th>
            </tr>
            <tr style="background: #ffffff;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>threshold</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Diferencias de renderizado por OS/browser (anti-aliasing, subpixel)</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Tests cross-browser que fallan por fuentes diferentes</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>max_diff_pixels</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Sabes cuántos píxeles varían (zona conocida y pequeña)</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Cursor parpadeante, indicador de estado</td>
            </tr>
            <tr style="background: #ffffff;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>max_diff_pixel_ratio</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Tests que corren en diferentes resoluciones/viewports</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Suite CI con múltiples tamaños de pantalla</td>
            </tr>
        </table>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA: Combinar masking con umbrales</h4>
            <p>La estrategia más robusta es aplicar <strong>ambas capas</strong>: primero
            <code>mask</code> para excluir zonas completamente dinámicas (ads, avatares, timestamps), y
            luego <code>threshold</code> o <code>max_diff_pixel_ratio</code> para tolerar diferencias
            de renderizado en las zonas estáticas. Esto minimiza falsos positivos sin ocultar regresiones
            reales.</p>
        </div>

        <h3>🌐 Anti-aliasing: diferencias entre navegadores y sistemas operativos</h3>
        <p>El anti-aliasing es la técnica que suaviza bordes de texto e imágenes. Cada navegador
        y sistema operativo implementa su propia versión, lo que genera diferencias de 1-2 píxeles
        en bordes de texto, bordes redondeados y gradientes.</p>

        <pre><code class="python">from playwright.sync_api import Page, expect

def test_anti_aliasing_cross_browser(page: Page):
    """Manejar diferencias de anti-aliasing entre navegadores."""
    page.goto("https://mi-app.com/pagina")

    # Estrategia 1: threshold más alto para absorber diferencias
    expect(page).to_have_screenshot(
        "pagina-chromium.png",
        threshold=0.25  # Un poco más alto que el default 0.2
    )

    # Estrategia 2: ratio pequeño para tolerancia proporcional
    expect(page).to_have_screenshot(
        "pagina-cross.png",
        max_diff_pixel_ratio=0.005  # 0.5% — cubre anti-aliasing típico
    )

    # Estrategia 3: screenshots separados por navegador (más preciso)
    # En conftest.py configurar:
    # @pytest.fixture
    # def screenshot_name(request, browser_name):
    #     return f"{request.node.name}-{browser_name}"</code></pre>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔬 Detalle: diferencias comunes por plataforma</h4>
            <ul>
                <li><strong>Fuentes:</strong> Windows usa ClearType, macOS usa Core Text, Linux usa FreeType — cada uno renderiza texto diferente a nivel subpixel</li>
                <li><strong>Bordes redondeados:</strong> El anti-aliasing de <code>border-radius</code> varía entre motores de renderizado</li>
                <li><strong>Sombras:</strong> <code>box-shadow</code> y <code>text-shadow</code> difieren en la distribución de gradientes</li>
                <li><strong>Solución pragmática:</strong> Generar screenshots de referencia <strong>en el mismo entorno que CI</strong> (ej. Docker con Linux) para eliminar variaciones de plataforma</li>
            </ul>
        </div>

        <h3>🎬 Desactivar animaciones con inyección CSS</h3>
        <p>Las animaciones CSS son una fuente constante de inestabilidad en visual testing porque
        el screenshot puede capturarse en cualquier frame de la animación. Playwright permite
        inyectar CSS para desactivarlas antes de la captura.</p>

        <pre><code class="python">from playwright.sync_api import Page, expect

def test_desactivar_animaciones_css(page: Page):
    """Inyectar CSS para congelar animaciones antes del screenshot."""
    page.goto("https://mi-app.com/dashboard")

    # Inyectar CSS que desactiva TODAS las animaciones y transiciones
    page.add_style_tag(content="""
        *, *::before, *::after {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
            animation-iteration-count: 1 !important;
        }

        /* También desactivar scroll suave */
        html {
            scroll-behavior: auto !important;
        }

        /* Ocultar cursores parpadeantes */
        * {
            caret-color: transparent !important;
        }
    """)

    # Ahora el screenshot captura un estado estático
    expect(page).to_have_screenshot("dashboard-sin-animaciones.png")</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Buena práctica: fixture reutilizable para desactivar animaciones</h4>
            <pre><code class="python"># conftest.py
import pytest
from playwright.sync_api import Page

DISABLE_ANIMATIONS_CSS = """
*, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
}
"""

@pytest.fixture
def stable_page(page: Page):
    """Página con animaciones desactivadas para visual testing."""
    page.add_style_tag(content=DISABLE_ANIMATIONS_CSS)
    return page

# Uso en tests:
def test_visual_estable(stable_page: Page):
    stable_page.goto("https://mi-app.com")
    expect(stable_page).to_have_screenshot("home.png")</code></pre>
        </div>

        <p><strong>Nota importante:</strong> Playwright también ofrece el parámetro
        <code>animations="disabled"</code> directamente en <code>to_have_screenshot()</code>,
        que desactiva animaciones CSS automáticamente:</p>

        <pre><code class="python">def test_animaciones_desactivadas_nativo(page: Page):
    """Usar el parámetro nativo de Playwright para desactivar animaciones."""
    page.goto("https://mi-app.com/dashboard")

    # Playwright desactiva animaciones CSS automáticamente
    expect(page).to_have_screenshot(
        "dashboard.png",
        animations="disabled"  # "disabled" | "allow" (default)
    )
    # Esto es equivalente a inyectar CSS, pero más limpio
    # Rebobina las animaciones CSS a su estado final antes de capturar</code></pre>

        <h3>⏱️ Congelar contenido dinámico: timers y countdowns</h3>
        <p>Algunos elementos dinámicos no se resuelven con CSS — requieren intervención a nivel
        de JavaScript para congelar su estado antes de la captura.</p>

        <pre><code class="python">from playwright.sync_api import Page, expect

def test_congelar_timers(page: Page):
    """Congelar timers y relojes antes de capturar screenshot."""
    page.goto("https://mi-app.com/dashboard")

    # Estrategia 1: Congelar Date para que siempre devuelva la misma hora
    page.evaluate("""
        // Fijar la fecha a un momento específico
        const fixedDate = new Date('2026-01-15T10:30:00');
        const OriginalDate = Date;

        // Reemplazar Date para que siempre devuelva fixedDate
        window.Date = class extends OriginalDate {
            constructor(...args) {
                if (args.length === 0) return fixedDate;
                return new OriginalDate(...args);
            }
            static now() { return fixedDate.getTime(); }
        };
    """)

    # Estrategia 2: Detener setInterval/setTimeout activos
    page.evaluate("""
        // Limpiar todos los intervals (los timers dejan de actualizarse)
        const highestId = window.setTimeout(() => {}, 0);
        for (let i = 0; i <= highestId; i++) {
            window.clearInterval(i);
        }
    """)

    # Estrategia 3: Reemplazar texto dinámico con valor fijo
    page.evaluate("""
        document.querySelectorAll('[data-testid="countdown"]').forEach(el => {
            el.textContent = '05:00';
        });
        document.querySelectorAll('.live-counter').forEach(el => {
            el.textContent = '1,234';
        });
    """)

    # Ahora el contenido es determinista — capturar screenshot
    expect(page).to_have_screenshot(
        "dashboard-congelado.png",
        animations="disabled",
        mask=[page.locator(".ad-banner")]  # Ads aún se enmascaran
    )</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA: Combinar todas las técnicas</h4>
            <p>En proyectos empresariales complejos como los de SIESA, la combinación ganadora es:</p>
            <ol>
                <li><strong>Inyectar CSS</strong> o usar <code>animations="disabled"</code> para desactivar animaciones</li>
                <li><strong>Congelar Date/timers</strong> con <code>page.evaluate()</code> para contenido dinámico JS</li>
                <li><strong>Mask</strong> zonas que no puedes controlar (ads, contenido externo)</li>
                <li><strong>Threshold/ratio</strong> para absorber diferencias de renderizado</li>
            </ol>
        </div>

        <h3>📋 Buenas prácticas para visual tests confiables</h3>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Prácticas recomendadas</h4>
            <ol>
                <li><strong>Generar baselines en CI:</strong> Los screenshots de referencia deben generarse en el mismo entorno (Docker, GitHub Actions) donde corren los tests. Nunca uses screenshots locales como referencia para CI.</li>
                <li><strong>Un screenshot por concepto:</strong> No captures la página completa si solo quieres validar el header. Usa <code>locator.screenshot()</code> para componentes específicos.</li>
                <li><strong>Viewport fijo:</strong> Siempre establece <code>viewport={"width": 1280, "height": 720}</code> para eliminar variaciones de tamaño.</li>
                <li><strong>full_page con cuidado:</strong> <code>full_page=True</code> captura contenido scrolleable, pero aumenta la probabilidad de diferencias.</li>
                <li><strong>Nombres descriptivos:</strong> <code>"checkout-form-filled.png"</code> es mejor que <code>"test1.png"</code> para identificar fallos en reportes.</li>
                <li><strong>Masking preventivo:</strong> Enmascara áreas dinámicas conocidas desde el primer test, no después de que falle.</li>
                <li><strong>Threshold conservador:</strong> Empieza con el default (0.2) y solo aumenta si hay justificación documentada.</li>
                <li><strong>Revisar diffs:</strong> Cuando un visual test falla, siempre revisa la imagen diff generada antes de actualizar la baseline.</li>
            </ol>
        </div>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>❌ Anti-patrones a evitar</h4>
            <ul>
                <li><strong>threshold=1:</strong> Efectivamente desactiva la comparación — nunca lo uses</li>
                <li><strong>max_diff_pixel_ratio=0.5:</strong> Tolerar 50% de diferencia no valida nada</li>
                <li><strong>Mask de toda la página:</strong> Si enmascaran todo, el test no valida nada</li>
                <li><strong>Screenshots locales como baseline de CI:</strong> Diferencias de OS garantizan fallos</li>
                <li><strong>Actualizar baselines sin revisar:</strong> <code>--update-snapshots</code> sin revisar puede ocultar regresiones reales</li>
                <li><strong>Ignorar flaky tests:</strong> Si un visual test es flaky, diagnostica la causa raíz (animación, contenido dinámico) en vez de aumentar umbrales</li>
            </ul>
        </div>

        <h3>🔧 Ejemplo completo: configuración robusta</h3>
        <pre><code class="python"># conftest.py — Configuración centralizada para visual testing
import pytest
from playwright.sync_api import Page, BrowserContext

DISABLE_ANIMATIONS_CSS = """
*, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    animation-iteration-count: 1 !important;
}
html { scroll-behavior: auto !important; }
* { caret-color: transparent !important; }
"""

FREEZE_DATE_JS = """
const fixedDate = new Date('2026-01-15T10:30:00');
const OrigDate = Date;
window.Date = class extends OrigDate {
    constructor(...args) {
        if (args.length === 0) return fixedDate;
        return new OrigDate(...args);
    }
    static now() { return fixedDate.getTime(); }
};
"""

@pytest.fixture
def visual_page(page: Page):
    """Página preparada para visual testing estable."""
    # Desactivar animaciones CSS
    page.add_style_tag(content=DISABLE_ANIMATIONS_CSS)
    # Congelar Date
    page.evaluate(FREEZE_DATE_JS)
    return page


# test_visual_dashboard.py
from playwright.sync_api import Page, expect

def test_dashboard_visual_completo(visual_page: Page):
    """Visual test robusto del dashboard con todas las técnicas."""
    visual_page.goto("https://mi-app.com/dashboard")

    # Esperar a que el contenido cargue completamente
    visual_page.wait_for_load_state("networkidle")

    # Definir masks para zonas dinámicas no controlables
    masks = [
        visual_page.locator("[data-testid='ad-banner']"),
        visual_page.locator(".user-avatar"),
        visual_page.locator("[data-testid='notification-count']"),
    ]

    # Captura con todas las capas de protección
    expect(visual_page).to_have_screenshot(
        "dashboard-completo.png",
        mask=masks,
        mask_color="#808080",
        threshold=0.2,
        max_diff_pixel_ratio=0.002,  # 0.2% de tolerancia
        animations="disabled",
        full_page=False  # Solo viewport visible
    )


def test_sidebar_visual(visual_page: Page):
    """Visual test de un componente específico."""
    visual_page.goto("https://mi-app.com/dashboard")
    visual_page.wait_for_load_state("networkidle")

    sidebar = visual_page.locator("aside.sidebar")

    # Screenshot de componente — más estable que full page
    expect(sidebar).to_have_screenshot(
        "sidebar.png",
        threshold=0.2,
        animations="disabled"
    )</code></pre>

        <h3>🏋️ Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📝 Ejercicio: Visual testing con masking y umbrales</h4>
            <p>Crea un archivo <code>test_visual_masking.py</code> que implemente visual testing
            robusto para una página de dashboard ficticia. Debes aplicar todas las técnicas de esta lección.</p>

            <p><strong>Requisitos:</strong></p>
            <ol>
                <li>Crear un fixture <code>visual_page</code> en <code>conftest.py</code> que desactive animaciones CSS e inyecte congelación de Date</li>
                <li>Implementar un test <code>test_full_dashboard</code> con:
                    <ul>
                        <li>Mask de al menos 3 elementos dinámicos (timestamp, avatar, ad)</li>
                        <li><code>mask_color</code> personalizado</li>
                        <li><code>threshold=0.2</code></li>
                        <li><code>max_diff_pixel_ratio=0.005</code></li>
                    </ul>
                </li>
                <li>Implementar un test <code>test_component_visual</code> que capture un componente específico (no full page)</li>
                <li>Implementar un test <code>test_strict_logo</code> con <code>threshold=0</code> para un elemento que debe ser pixel-perfect</li>
            </ol>

            <p><strong>Estructura esperada:</strong></p>
            <pre><code class="python"># conftest.py
import pytest
from playwright.sync_api import Page

DISABLE_ANIMATIONS_CSS = \"\"\"
*, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
}
html { scroll-behavior: auto !important; }
* { caret-color: transparent !important; }
\"\"\"

FREEZE_DATE_JS = \"\"\"
const fixedDate = new Date('2026-01-15T10:30:00');
const OrigDate = Date;
window.Date = class extends OrigDate {
    constructor(...args) {
        if (args.length === 0) return fixedDate;
        return new OrigDate(...args);
    }
    static now() { return fixedDate.getTime(); }
};
\"\"\"

@pytest.fixture
def visual_page(page: Page):
    page.add_style_tag(content=DISABLE_ANIMATIONS_CSS)
    page.evaluate(FREEZE_DATE_JS)
    return page


# test_visual_masking.py
from playwright.sync_api import Page, expect

def test_full_dashboard(visual_page: Page):
    visual_page.goto("https://mi-app.com/dashboard")
    visual_page.wait_for_load_state("networkidle")

    masks = [
        visual_page.locator("[data-testid='timestamp']"),
        visual_page.locator(".user-avatar"),
        visual_page.locator("#ad-container"),
    ]

    expect(visual_page).to_have_screenshot(
        "dashboard.png",
        mask=masks,
        mask_color="#808080",
        threshold=0.2,
        max_diff_pixel_ratio=0.005,
        animations="disabled"
    )

def test_component_visual(visual_page: Page):
    visual_page.goto("https://mi-app.com/dashboard")
    visual_page.wait_for_load_state("networkidle")

    card = visual_page.locator("[data-testid='stats-card']")
    expect(card).to_have_screenshot(
        "stats-card.png",
        threshold=0.2,
        animations="disabled"
    )

def test_strict_logo(visual_page: Page):
    visual_page.goto("https://mi-app.com/dashboard")
    visual_page.wait_for_load_state("networkidle")

    logo = visual_page.locator("[data-testid='company-logo']")
    expect(logo).to_have_screenshot(
        "logo.png",
        threshold=0,           # Pixel-perfect
        max_diff_pixels=0      # Cero diferencias permitidas
    )</code></pre>

            <div style="background: #e8f5e9; padding: 10px; border-radius: 5px; margin-top: 10px;">
                <strong>Criterios de evaluación:</strong>
                <ul>
                    <li>El fixture <code>visual_page</code> desactiva animaciones y congela Date</li>
                    <li><code>test_full_dashboard</code> usa mask, mask_color, threshold y max_diff_pixel_ratio</li>
                    <li><code>test_component_visual</code> captura un componente con <code>locator.to_have_screenshot()</code></li>
                    <li><code>test_strict_logo</code> usa threshold=0 y max_diff_pixels=0</li>
                    <li>Todos los tests usan <code>animations="disabled"</code> directamente o vía fixture</li>
                </ul>
            </div>
        </div>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🗺️ Conexión con la siguiente lección</h4>
            <p>Ahora que dominas masking y umbrales de comparación para visual regression testing,
            en la <strong>Lección 101</strong> explorarás <strong>Accessibility testing con axe-core</strong>,
            donde usarás Playwright para ejecutar auditorías automatizadas de accesibilidad
            directamente en tus tests, complementando las validaciones visuales con validaciones
            de accesibilidad.</p>
        </div>
    `,
    topics: ["masking", "umbrales", "comparación"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 18,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_100 = LESSON_100;
}
