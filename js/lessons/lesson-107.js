/**
 * Playwright Academy - Lección 107
 * Trace Viewer avanzado
 * Sección 16: Reporting y Trace Viewer
 */

const LESSON_107 = {
    id: 107,
    title: "Trace Viewer avanzado",
    duration: "7 min",
    level: "advanced",
    section: "section-16",
    content: `
        <h2>🔬 Trace Viewer avanzado</h2>
        <p>En la <strong>Sección 14</strong> aprendiste a habilitar trazas y a abrir el Trace Viewer
        para inspeccionar ejecuciones de tests. En esta lección llevaremos el Trace Viewer al
        <strong>siguiente nivel</strong>: configuraciones avanzadas, chunks de traza, análisis de red,
        navegación de DOM snapshots, logs de consola, mapeo de código fuente, comparación de trazas,
        análisis programático y hosting propio.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎯 Objetivo de la lección</h4>
            <p>Dominar las capacidades avanzadas del Trace Viewer de Playwright: configurar trazas
            con títulos y nombres, usar <strong>trace chunks</strong> para segmentar trazas dentro
            de un mismo test, analizar el waterfall de red, navegar DOM snapshots antes/después de
            cada acción, inspeccionar logs de consola, extraer archivos HAR, realizar análisis de
            rendimiento y hostear el Trace Viewer de forma pública o privada.</p>
        </div>

        <h3>🔄 Recap rápido: Trace Viewer básico</h3>
        <p>Antes de profundizar, recordemos la configuración básica de trazas que vimos en la
        Sección 14. Las trazas capturan <strong>screenshots</strong>, <strong>DOM snapshots</strong>,
        <strong>logs de consola</strong> y <strong>tráfico de red</strong> durante la ejecución
        de un test.</p>

        <div class="code-tabs" data-code-id="L107-1">
        <div class="code-tabs-header">
            <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F40D;</span> Python
            </button>
            <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F537;</span> TypeScript
            </button>
            <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
        </div>
        <div class="code-panel active" data-lang="python">
        <pre><code class="language-python"># Recap: configuración básica de trazas
from playwright.sync_api import sync_playwright


def test_con_traza_basica():
    """Captura una traza completa del test."""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context()

        # Iniciar traza con opciones básicas
        context.tracing.start(
            screenshots=True,  # Captura screenshot por acción
            snapshots=True,    # Captura DOM snapshot por acción
            sources=True       # Incluye código fuente en la traza
        )

        page = context.new_page()
        page.goto("https://mi-aplicacion.com")
        page.fill("#usuario", "admin")
        page.click("#btn-login")

        # Detener traza y guardar archivo .zip
        context.tracing.stop(path="traces/test-login.zip")
        browser.close()

# Ver la traza:
# playwright show-trace traces/test-login.zip</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">// Recap: configuración básica de trazas
import { test } from '@playwright/test';

// Opción 1: Via configuración (recomendado)
// playwright.config.ts → use: { trace: 'on' }

// Opción 2: Manual en un test
test('test con traza basica', async ({ browser }) => {
    /** Captura una traza completa del test. */
    const context = await browser.newContext();

    // Iniciar traza con opciones básicas
    await context.tracing.start({
        screenshots: true,  // Captura screenshot por acción
        snapshots: true,    // Captura DOM snapshot por acción
        sources: true,      // Incluye código fuente en la traza
    });

    const page = await context.newPage();
    await page.goto('https://mi-aplicacion.com');
    await page.fill('#usuario', 'admin');
    await page.click('#btn-login');

    // Detener traza y guardar archivo .zip
    await context.tracing.stop({ path: 'traces/test-login.zip' });
    await context.close();
});

// Ver la traza:
// npx playwright show-trace traces/test-login.zip</code></pre>
        </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>En el equipo de QA de SIESA, las trazas son parte del <strong>artefacto de evidencia</strong>
            de cada ejecución. Cuando un test falla en CI/CD, la traza .zip se adjunta al reporte
            y el desarrollador puede inspeccionar exactamente qué pasó, sin necesidad de reproducir
            el fallo localmente. Esto reduce el tiempo de diagnóstico de horas a minutos.</p>
        </div>

        <h3>⚙️ Configuración avanzada de trazas</h3>
        <p>Playwright permite configurar trazas con <strong>título</strong> y <strong>nombre</strong>
        para identificarlas fácilmente cuando se trabaja con múltiples archivos de traza.</p>

        <div class="code-tabs" data-code-id="L107-2">
        <div class="code-tabs-header">
            <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F40D;</span> Python
            </button>
            <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F537;</span> TypeScript
            </button>
            <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
        </div>
        <div class="code-panel active" data-lang="python">
        <pre><code class="language-python"># Configuración avanzada con título y nombre
from playwright.sync_api import sync_playwright
import datetime


def test_traza_con_metadata():
    """Traza con título personalizado para fácil identificación."""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context()

        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

        # Iniciar traza con título descriptivo
        context.tracing.start(
            title=f"Login HCM - {timestamp}",
            name="login-flow",       # Nombre del chunk de traza
            screenshots=True,
            snapshots=True,
            sources=True
        )

        page = context.new_page()
        page.goto("https://hcm.siesa.com/login")
        page.fill("#usuario", "admin")
        page.fill("#password", "secret")
        page.click("button[type='submit']")
        page.wait_for_url("**/dashboard")

        # El título aparece en la barra superior del Trace Viewer
        context.tracing.stop(path=f"traces/login-{timestamp}.zip")
        browser.close()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">// Configuración avanzada con título y nombre
import { test } from '@playwright/test';

test('traza con metadata', async ({ browser }) => {
    /** Traza con título personalizado para fácil identificación. */
    const context = await browser.newContext();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

    // Iniciar traza con título descriptivo
    await context.tracing.start({
        title: \`Login HCM - \${timestamp}\`,
        name: 'login-flow',       // Nombre del chunk de traza
        screenshots: true,
        snapshots: true,
        sources: true,
    });

    const page = await context.newPage();
    await page.goto('https://hcm.siesa.com/login');
    await page.fill('#usuario', 'admin');
    await page.fill('#password', 'secret');
    await page.click("button[type='submit']");
    await page.waitForURL('**/dashboard');

    // El título aparece en la barra superior del Trace Viewer
    await context.tracing.stop({ path: \`traces/login-\${timestamp}.zip\` });
    await context.close();
});</code></pre>
        </div>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Parámetros de context.tracing.start()</h4>
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                    <tr style="background: #c8e6c9;">
                        <th style="padding: 8px; border: 1px solid #a5d6a7; text-align: left;">Parámetro</th>
                        <th style="padding: 8px; border: 1px solid #a5d6a7; text-align: left;">Tipo</th>
                        <th style="padding: 8px; border: 1px solid #a5d6a7; text-align: left;">Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;"><code>title</code></td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;">str</td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;">Título mostrado en la barra del Trace Viewer. Ideal para incluir nombre del test, fecha, entorno.</td>
                    </tr>
                    <tr style="background: #f1f8e9;">
                        <td style="padding: 8px; border: 1px solid #a5d6a7;"><code>name</code></td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;">str</td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;">Nombre del chunk de traza. Permite tener múltiples chunks nombrados dentro de una sesión.</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;"><code>screenshots</code></td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;">bool</td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;">Captura screenshot después de cada acción. Aumenta el tamaño del archivo.</td>
                    </tr>
                    <tr style="background: #f1f8e9;">
                        <td style="padding: 8px; border: 1px solid #a5d6a7;"><code>snapshots</code></td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;">bool</td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;">Captura DOM snapshot antes/después de cada acción. Permite inspeccionar el HTML en el visor.</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;"><code>sources</code></td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;">bool</td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;">Incluye código fuente del test. Permite ver qué línea de código generó cada acción.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>🧩 Trace chunks: múltiples trazas en un solo test</h3>
        <p>Los <strong>trace chunks</strong> permiten segmentar la traza de un test largo en
        porciones independientes. Esto es útil cuando un test tiene varias fases (login, navegación,
        operación, verificación) y quieres analizar cada fase por separado.</p>

        <div class="code-tabs" data-code-id="L107-3">
        <div class="code-tabs-header">
            <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F40D;</span> Python
            </button>
            <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F537;</span> TypeScript
            </button>
            <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
        </div>
        <div class="code-panel active" data-lang="python">
        <pre><code class="language-python"># Trace chunks: segmentar trazas dentro de un test
from playwright.sync_api import sync_playwright


def test_flujo_completo_con_chunks():
    """
    Divide un test largo en chunks de traza independientes.
    Cada chunk genera un archivo .zip separado para análisis aislado.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context()

        # ── Chunk 1: Login ──────────────────────────
        context.tracing.start(
            name="chunk-login",
            screenshots=True,
            snapshots=True,
            sources=True
        )

        page = context.new_page()
        page.goto("https://hcm.siesa.com/login")
        page.fill("#usuario", "admin")
        page.fill("#password", "secret")
        page.click("button[type='submit']")
        page.wait_for_url("**/dashboard")

        # Detener chunk 1 y guardar
        context.tracing.stop(path="traces/chunk-01-login.zip")

        # ── Chunk 2: Navegación al módulo ───────────
        context.tracing.start(
            name="chunk-navegacion",
            screenshots=True,
            snapshots=True,
            sources=True
        )

        page.click("nav >> text=Nómina")
        page.wait_for_selector(".modulo-nomina")
        page.click("text=Liquidación mensual")
        page.wait_for_selector(".formulario-liquidacion")

        # Detener chunk 2 y guardar
        context.tracing.stop(path="traces/chunk-02-navegacion.zip")

        # ── Chunk 3: Operación y verificación ───────
        context.tracing.start(
            name="chunk-operacion",
            screenshots=True,
            snapshots=True,
            sources=True
        )

        page.select_option("#periodo", "2026-03")
        page.click("#btn-calcular")
        page.wait_for_selector(".resultado-calculo")
        assert page.text_content(".total-nomina") != ""

        # Detener chunk 3 y guardar
        context.tracing.stop(path="traces/chunk-03-operacion.zip")

        browser.close()

# Cada chunk se analiza por separado:
# playwright show-trace traces/chunk-01-login.zip
# playwright show-trace traces/chunk-02-navegacion.zip
# playwright show-trace traces/chunk-03-operacion.zip</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">// Trace chunks: segmentar trazas dentro de un test
import { test, expect } from '@playwright/test';

test('flujo completo con chunks', async ({ browser }) => {
    /**
     * Divide un test largo en chunks de traza independientes.
     * Cada chunk genera un archivo .zip separado para análisis aislado.
     */
    const context = await browser.newContext();

    // ── Chunk 1: Login ──────────────────────────
    await context.tracing.start({
        name: 'chunk-login',
        screenshots: true,
        snapshots: true,
        sources: true,
    });

    const page = await context.newPage();
    await page.goto('https://hcm.siesa.com/login');
    await page.fill('#usuario', 'admin');
    await page.fill('#password', 'secret');
    await page.click("button[type='submit']");
    await page.waitForURL('**/dashboard');

    // Detener chunk 1 y guardar
    await context.tracing.stop({ path: 'traces/chunk-01-login.zip' });

    // ── Chunk 2: Navegación al módulo ───────────
    await context.tracing.start({
        name: 'chunk-navegacion',
        screenshots: true,
        snapshots: true,
        sources: true,
    });

    await page.click('nav >> text=Nómina');
    await page.waitForSelector('.modulo-nomina');
    await page.click('text=Liquidación mensual');
    await page.waitForSelector('.formulario-liquidacion');

    // Detener chunk 2 y guardar
    await context.tracing.stop({ path: 'traces/chunk-02-navegacion.zip' });

    // ── Chunk 3: Operación y verificación ───────
    await context.tracing.start({
        name: 'chunk-operacion',
        screenshots: true,
        snapshots: true,
        sources: true,
    });

    await page.selectOption('#periodo', '2026-03');
    await page.click('#btn-calcular');
    await page.waitForSelector('.resultado-calculo');
    expect(await page.textContent('.total-nomina')).not.toBe('');

    // Detener chunk 3 y guardar
    await context.tracing.stop({ path: 'traces/chunk-03-operacion.zip' });

    await context.close();
});

// Cada chunk se analiza por separado:
// npx playwright show-trace traces/chunk-01-login.zip
// npx playwright show-trace traces/chunk-02-navegacion.zip
// npx playwright show-trace traces/chunk-03-operacion.zip</code></pre>
        </div>
        </div>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔬 start_chunk() y stop_chunk() para chunks intermedios</h4>
            <p>Cuando la traza ya está iniciada y quieres crear un nuevo chunk sin detener toda la
            sesión, usa <code>start_chunk()</code> y <code>stop_chunk()</code>. Esto es especialmente
            útil para mantener una traza "base" activa mientras capturas segmentos específicos.</p>
        </div>

        <div class="code-tabs" data-code-id="L107-4">
        <div class="code-tabs-header">
            <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F40D;</span> Python
            </button>
            <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F537;</span> TypeScript
            </button>
            <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
        </div>
        <div class="code-panel active" data-lang="python">
        <pre><code class="language-python"># start_chunk/stop_chunk: chunks sin reiniciar la traza completa
from playwright.sync_api import sync_playwright


def test_con_start_stop_chunk():
    """
    Usa start_chunk/stop_chunk para exportar segmentos
    sin detener la traza principal.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context()

        # Iniciar traza principal (se mantiene activa)
        context.tracing.start(
            screenshots=True,
            snapshots=True,
            sources=True
        )

        page = context.new_page()
        page.goto("https://hcm.siesa.com/login")
        page.fill("#usuario", "admin")
        page.click("button[type='submit']")

        # Exportar chunk del login sin detener la traza
        context.tracing.stop_chunk(path="traces/login-chunk.zip")

        # Iniciar nuevo chunk para la siguiente fase
        context.tracing.start_chunk(title="Dashboard navigation")

        page.click("nav >> text=Reportes")
        page.wait_for_selector(".lista-reportes")

        # Exportar chunk de navegación
        context.tracing.stop_chunk(path="traces/nav-chunk.zip")

        # Iniciar otro chunk para operaciones
        context.tracing.start_chunk(title="Report generation")

        page.click("text=Reporte Mensual")
        page.click("#btn-generar")
        page.wait_for_selector(".reporte-generado")

        # Detener traza completa (incluye el último chunk)
        context.tracing.stop(path="traces/reporte-chunk.zip")
        browser.close()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">// startChunk/stopChunk: chunks sin reiniciar la traza completa
import { test } from '@playwright/test';

test('con start stop chunk', async ({ browser }) => {
    /**
     * Usa startChunk/stopChunk para exportar segmentos
     * sin detener la traza principal.
     */
    const context = await browser.newContext();

    // Iniciar traza principal (se mantiene activa)
    await context.tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true,
    });

    const page = await context.newPage();
    await page.goto('https://hcm.siesa.com/login');
    await page.fill('#usuario', 'admin');
    await page.click("button[type='submit']");

    // Exportar chunk del login sin detener la traza
    await context.tracing.stopChunk({ path: 'traces/login-chunk.zip' });

    // Iniciar nuevo chunk para la siguiente fase
    await context.tracing.startChunk({ title: 'Dashboard navigation' });

    await page.click('nav >> text=Reportes');
    await page.waitForSelector('.lista-reportes');

    // Exportar chunk de navegación
    await context.tracing.stopChunk({ path: 'traces/nav-chunk.zip' });

    // Iniciar otro chunk para operaciones
    await context.tracing.startChunk({ title: 'Report generation' });

    await page.click('text=Reporte Mensual');
    await page.click('#btn-generar');
    await page.waitForSelector('.reporte-generado');

    // Detener traza completa (incluye el último chunk)
    await context.tracing.stop({ path: 'traces/reporte-chunk.zip' });
    await context.close();
});</code></pre>
        </div>
        </div>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>❌ Error común con chunks</h4>
            <p>No puedes llamar a <code>start_chunk()</code> sin haber iniciado la traza con
            <code>start()</code> primero. Tampoco puedes llamar a <code>start()</code> dos veces
            sin un <code>stop()</code> intermedio. La secuencia correcta es:</p>
            <div class="code-tabs" data-code-id="L107-5">
            <div class="code-tabs-header">
                <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                    <span class="code-tab-icon">&#x1F40D;</span> Python
                </button>
                <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                    <span class="code-tab-icon">&#x1F537;</span> TypeScript
                </button>
                <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
            </div>
            <div class="code-panel active" data-lang="python">
            <pre><code class="language-python"># ✅ Correcto
context.tracing.start(...)     # Inicia la traza
context.tracing.stop_chunk(path="a.zip")  # Exporta chunk
context.tracing.start_chunk()  # Inicia nuevo chunk
context.tracing.stop(path="b.zip")  # Detiene todo

# ❌ Incorrecto
context.tracing.start_chunk()  # Error: traza no iniciada
context.tracing.start(...)
context.tracing.start(...)     # Error: traza ya activa</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// ✅ Correcto
await context.tracing.start({ ... });        // Inicia la traza
await context.tracing.stopChunk({ path: 'a.zip' }); // Exporta chunk
await context.tracing.startChunk();          // Inicia nuevo chunk
await context.tracing.stop({ path: 'b.zip' });      // Detiene todo

// ❌ Incorrecto
await context.tracing.startChunk();  // Error: traza no iniciada
await context.tracing.start({ ... });
await context.tracing.start({ ... });  // Error: traza ya activa</code></pre>
            </div>
            </div>
        </div>

        <h3>🌐 Análisis de network waterfall en Trace Viewer</h3>
        <p>El Trace Viewer incluye un panel de <strong>Network</strong> que muestra todas las
        peticiones HTTP realizadas durante el test en formato <strong>waterfall</strong> (cascada).
        Esto es invaluable para diagnosticar problemas de rendimiento y dependencias de red.</p>

        <div class="code-tabs" data-code-id="L107-6">
        <div class="code-tabs-header">
            <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F40D;</span> Python
            </button>
            <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F537;</span> TypeScript
            </button>
            <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
        </div>
        <div class="code-panel active" data-lang="python">
        <pre><code class="language-python"># Capturar trazas con tráfico de red detallado
from playwright.sync_api import sync_playwright


def test_analisis_red():
    """
    Captura traza para analizar el waterfall de red.
    En el Trace Viewer: pestaña Network.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context()

        context.tracing.start(
            title="Análisis de red - Dashboard HCM",
            screenshots=True,
            snapshots=True,
            sources=True
        )

        page = context.new_page()

        # Interceptar requests para logging adicional
        peticiones = []

        def on_request(request):
            peticiones.append({
                "url": request.url,
                "method": request.method,
                "resource_type": request.resource_type,
            })

        def on_response(response):
            for req in peticiones:
                if req["url"] == response.url:
                    req["status"] = response.status
                    req["timing"] = response.request.timing
                    break

        page.on("request", on_request)
        page.on("response", on_response)

        page.goto("https://mi-aplicacion.com/dashboard")
        page.wait_for_load_state("networkidle")

        # Resumen de peticiones
        print(f"Total peticiones: {len(peticiones)}")
        for req in peticiones:
            status = req.get("status", "?")
            print(f"  [{status}] {req['method']} {req['resource_type']}: "
                  f"{req['url'][:80]}")

        context.tracing.stop(path="traces/red-dashboard.zip")
        browser.close()

# En el Trace Viewer, la pestaña Network muestra:
# - Cada request con método, URL, status y tiempo
# - Diagrama waterfall con barras de duración
# - Filtros por tipo de recurso (XHR, JS, CSS, IMG, etc.)
# - Tamaño de cada respuesta
# - Headers de request/response completos</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">// Capturar trazas con tráfico de red detallado
import { test } from '@playwright/test';

test('analisis red', async ({ browser }) => {
    /**
     * Captura traza para analizar el waterfall de red.
     * En el Trace Viewer: pestaña Network.
     */
    const context = await browser.newContext();

    await context.tracing.start({
        title: 'Análisis de red - Dashboard HCM',
        screenshots: true,
        snapshots: true,
        sources: true,
    });

    const page = await context.newPage();

    // Interceptar requests para logging adicional
    interface Peticion {
        url: string; method: string; resourceType: string;
        status?: number; timing?: Record&lt;string, number&gt;;
    }
    const peticiones: Peticion[] = [];

    page.on('request', (request) => {
        peticiones.push({
            url: request.url(),
            method: request.method(),
            resourceType: request.resourceType(),
        });
    });

    page.on('response', (response) => {
        const req = peticiones.find(r => r.url === response.url());
        if (req) {
            req.status = response.status();
            req.timing = response.request().timing();
        }
    });

    await page.goto('https://mi-aplicacion.com/dashboard');
    await page.waitForLoadState('networkidle');

    // Resumen de peticiones
    console.log(\`Total peticiones: \${peticiones.length}\`);
    for (const req of peticiones) {
        const status = req.status ?? '?';
        console.log(\`  [\${status}] \${req.method} \${req.resourceType}: \`
            + req.url.slice(0, 80));
    }

    await context.tracing.stop({ path: 'traces/red-dashboard.zip' });
    await context.close();
});

// En el Trace Viewer, la pestaña Network muestra:
// - Cada request con método, URL, status y tiempo
// - Diagrama waterfall con barras de duración
// - Filtros por tipo de recurso (XHR, JS, CSS, IMG, etc.)
// - Tamaño de cada respuesta
// - Headers de request/response completos</code></pre>
        </div>
        </div>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📊 Qué buscar en el waterfall de red</h4>
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                    <tr style="background: #1565c0; color: white;">
                        <th style="padding: 8px; text-align: left;">Indicador</th>
                        <th style="padding: 8px; text-align: left;">Qué significa</th>
                        <th style="padding: 8px; text-align: left;">Acción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #f5f5f5;">
                        <td style="padding: 8px;">Barra muy larga</td>
                        <td style="padding: 8px;">Request lento (>1s)</td>
                        <td style="padding: 8px;">Optimizar endpoint o agregar caché</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Muchos requests secuenciales</td>
                        <td style="padding: 8px;">No hay paralelización</td>
                        <td style="padding: 8px;">Combinar APIs o usar batch requests</td>
                    </tr>
                    <tr style="background: #f5f5f5;">
                        <td style="padding: 8px;">Requests con status 4xx/5xx</td>
                        <td style="padding: 8px;">Errores de API</td>
                        <td style="padding: 8px;">Revisar logs del servidor</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Recursos duplicados</td>
                        <td style="padding: 8px;">Mismo recurso descargado múltiples veces</td>
                        <td style="padding: 8px;">Verificar headers de caché</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>📸 Navegación de DOM snapshots: antes/después de cada acción</h3>
        <p>Una de las características más potentes del Trace Viewer es la capacidad de inspeccionar
        el <strong>DOM completo</strong> antes y después de cada acción. No es un screenshot estático:
        es un snapshot interactivo del HTML que puedes inspeccionar con las DevTools del visor.</p>

        <div class="code-tabs" data-code-id="L107-7">
        <div class="code-tabs-header">
            <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F40D;</span> Python
            </button>
            <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F537;</span> TypeScript
            </button>
            <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
        </div>
        <div class="code-panel active" data-lang="python">
        <pre><code class="language-python"># Habilitar snapshots para inspección de DOM
from playwright.sync_api import sync_playwright


def test_con_snapshots_detallados():
    """
    Con snapshots=True, el Trace Viewer captura el DOM
    completo antes y después de cada acción.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context()

        context.tracing.start(
            title="Snapshots de formulario",
            screenshots=True,
            snapshots=True,   # CRUCIAL para DOM snapshots
            sources=True
        )

        page = context.new_page()
        page.goto("https://mi-aplicacion.com/formulario")

        # Cada una de estas acciones genera un snapshot antes/después
        page.fill("#nombre", "Juan Manuel")    # Snapshot: campo vacío → con texto
        page.fill("#email", "jm@siesa.com")    # Snapshot: email vacío → con texto
        page.check("#acepto-terminos")          # Snapshot: checkbox off → on
        page.click("button[type='submit']")    # Snapshot: formulario → resultado

        context.tracing.stop(path="traces/formulario-snapshots.zip")
        browser.close()

# En el Trace Viewer:
# 1. Click en cualquier acción en el timeline
# 2. Panel "Before" muestra el DOM antes de la acción
# 3. Panel "After" muestra el DOM después de la acción
# 4. Puedes usar la lupa para inspeccionar elementos
# 5. Los cambios en el DOM se resaltan visualmente</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">// Habilitar snapshots para inspección de DOM
import { test } from '@playwright/test';

test('con snapshots detallados', async ({ browser }) => {
    /**
     * Con snapshots: true, el Trace Viewer captura el DOM
     * completo antes y después de cada acción.
     */
    const context = await browser.newContext();

    await context.tracing.start({
        title: 'Snapshots de formulario',
        screenshots: true,
        snapshots: true,   // CRUCIAL para DOM snapshots
        sources: true,
    });

    const page = await context.newPage();
    await page.goto('https://mi-aplicacion.com/formulario');

    // Cada una de estas acciones genera un snapshot antes/después
    await page.fill('#nombre', 'Juan Manuel');     // Snapshot: campo vacío → con texto
    await page.fill('#email', 'jm@siesa.com');     // Snapshot: email vacío → con texto
    await page.check('#acepto-terminos');           // Snapshot: checkbox off → on
    await page.click("button[type='submit']");     // Snapshot: formulario → resultado

    await context.tracing.stop({ path: 'traces/formulario-snapshots.zip' });
    await context.close();
});

// En el Trace Viewer:
// 1. Click en cualquier acción en el timeline
// 2. Panel "Before" muestra el DOM antes de la acción
// 3. Panel "After" muestra el DOM después de la acción
// 4. Puedes usar la lupa para inspeccionar elementos
// 5. Los cambios en el DOM se resaltan visualmente</code></pre>
        </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>Los DOM snapshots son especialmente valiosos para depurar formularios complejos de
            ERP. Cuando un campo calculado de nómina muestra un valor incorrecto, puedes navegar
            el snapshot y verificar exactamente qué datos estaban en el DOM en el momento de la
            validación, sin necesidad de volver a ejecutar el test.</p>
        </div>

        <h3>📋 Console log analysis en trazas</h3>
        <p>El Trace Viewer captura automáticamente todos los mensajes de la <strong>consola del
        navegador</strong>: logs, warnings, errores y excepciones no capturadas. Esto facilita
        correlacionar errores de JavaScript con acciones específicas del test.</p>

        <pre><code class="python"># Captura de console logs en trazas
from playwright.sync_api import sync_playwright


def test_con_analisis_consola():
    """
    Los logs de consola se capturan automáticamente en la traza.
    También puedes capturarlos programáticamente para validaciones.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context()

        context.tracing.start(
            title="Análisis de consola",
            screenshots=True,
            snapshots=True,
            sources=True
        )

        page = context.new_page()

        # Capturar logs programáticamente además de la traza
        logs_consola = []
        errores_js = []

        page.on("console", lambda msg: logs_consola.append({
            "type": msg.type,
            "text": msg.text,
            "location": msg.location
        }))

        page.on("pageerror", lambda error: errores_js.append(str(error)))

        page.goto("https://mi-aplicacion.com")
        page.click("#btn-cargar-datos")
        page.wait_for_timeout(2000)

        # Verificar que no hay errores JS
        errores_criticos = [
            log for log in logs_consola if log["type"] == "error"
        ]
        assert len(errores_js) == 0, \\
            f"Errores JS no capturados: {errores_js}"
        assert len(errores_criticos) == 0, \\
            f"Errores en consola: {errores_criticos}"

        # Imprimir warnings para revisión
        warnings = [
            log for log in logs_consola if log["type"] == "warning"
        ]
        if warnings:
            print(f"⚠️ {len(warnings)} warnings en consola:")
            for w in warnings:
                print(f"  - {w['text']}")

        context.tracing.stop(path="traces/consola-analisis.zip")
        browser.close()

# En el Trace Viewer, pestaña Console:
# - Todos los console.log(), console.warn(), console.error()
# - Errores no capturados (uncaught exceptions)
# - Correlación temporal con las acciones del test
# - Filtros por tipo de mensaje (log, warn, error, info)</code></pre>

        <h3>📄 Mapeo de código fuente en trazas</h3>
        <p>Cuando habilitas <code>sources=True</code>, el Trace Viewer muestra el
        <strong>código fuente del test</strong> junto a cada acción, resaltando la línea exacta
        que generó cada operación. Esto facilita la correlación entre el código y el comportamiento
        observado.</p>

        <pre><code class="python"># Mapeo de código fuente: sources=True
from playwright.sync_api import sync_playwright


def test_con_mapeo_fuente():
    """
    Con sources=True, el Trace Viewer muestra qué línea
    de código generó cada acción.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context()

        # sources=True incluye el código fuente en la traza
        context.tracing.start(
            title="Mapeo de fuente",
            screenshots=True,
            snapshots=True,
            sources=True  # ← Habilita mapeo de código fuente
        )

        page = context.new_page()
        page.goto("https://mi-aplicacion.com/reportes")

        # En el Trace Viewer, cada acción mostrará
        # la línea exacta de este archivo Python
        page.click("#filtro-fecha")                  # Línea 22
        page.fill("#fecha-inicio", "2026-01-01")     # Línea 23
        page.fill("#fecha-fin", "2026-03-31")        # Línea 24
        page.click("#btn-generar-reporte")           # Línea 25
        page.wait_for_selector(".tabla-reporte")     # Línea 26

        context.tracing.stop(path="traces/fuente-mapeo.zip")
        browser.close()

# En el Trace Viewer, pestaña Source:
# - Código fuente completo del test
# - Línea resaltada para la acción seleccionada
# - Navegación click-to-action: click en una línea
#   salta a esa acción en el timeline</code></pre>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📘 ¿Por qué importa el mapeo de fuente?</h4>
            <p>Cuando un test falla, el desarrollador necesita saber <strong>exactamente qué línea
            de código</strong> causó el fallo. Sin <code>sources=True</code>, solo ve las acciones
            (click, fill, goto). Con el mapeo de fuente, ve el test completo y puede navegar
            directamente a la línea problemática. Esto reduce significativamente el tiempo de
            diagnóstico en equipos donde el tester y el desarrollador son personas diferentes.</p>
        </div>

        <h3>🔀 Comparar múltiples trazas lado a lado</h3>
        <p>Comparar trazas es una técnica poderosa para diagnosticar regresiones: puedes abrir
        la traza de un test que <strong>pasaba</strong> junto a la de uno que <strong>falla</strong>
        y observar las diferencias acción por acción.</p>

        <pre><code class="python"># Estrategia para comparar trazas
from playwright.sync_api import sync_playwright
import os
import datetime


class TraceComparator:
    """
    Genera trazas etiquetadas para comparación posterior.
    Guarda trazas con timestamps y etiquetas para facilitar
    la comparación visual en el Trace Viewer.
    """

    def __init__(self, base_dir="traces"):
        self.base_dir = base_dir
        os.makedirs(base_dir, exist_ok=True)

    def generar_nombre(self, test_name, etiqueta):
        """Genera un nombre de archivo con timestamp y etiqueta."""
        ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        return os.path.join(
            self.base_dir,
            f"{test_name}_{etiqueta}_{ts}.zip"
        )

    def capturar_traza(self, test_func, test_name, etiqueta="run"):
        """
        Ejecuta un test capturando su traza con etiqueta.

        Args:
            test_func: Función que recibe (page) y ejecuta el test
            test_name: Nombre del test para el archivo
            etiqueta: Etiqueta (ej: "antes", "después", "v2.1")
        """
        with sync_playwright() as p:
            browser = p.chromium.launch()
            context = browser.new_context()

            path = self.generar_nombre(test_name, etiqueta)

            context.tracing.start(
                title=f"{test_name} [{etiqueta}]",
                screenshots=True,
                snapshots=True,
                sources=True
            )

            page = context.new_page()
            try:
                test_func(page)
            finally:
                context.tracing.stop(path=path)
                browser.close()

            print(f"Traza guardada: {path}")
            return path


# Uso: comparar antes y después de un cambio
comparator = TraceComparator()

def test_login(page):
    page.goto("https://mi-aplicacion.com/login")
    page.fill("#usuario", "admin")
    page.fill("#password", "secret")
    page.click("button[type='submit']")
    page.wait_for_url("**/dashboard")

# Capturar traza ANTES del cambio
traza_antes = comparator.capturar_traza(
    test_login, "login", etiqueta="antes-fix"
)

# Capturar traza DESPUÉS del cambio
traza_despues = comparator.capturar_traza(
    test_login, "login", etiqueta="despues-fix"
)

# Abrir ambas trazas en terminales separadas:
# Terminal 1: playwright show-trace traces/login_antes-fix_*.zip
# Terminal 2: playwright show-trace traces/login_despues-fix_*.zip</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>En el equipo de QA de SIESA, mantenemos un repositorio de <strong>trazas baseline</strong>
            para los flujos críticos (login, liquidación de nómina, generación de reportes). Cuando
            un test falla después de un release, comparamos la traza fallida con la baseline para
            identificar el paso exacto donde el comportamiento cambió. Esto es más rápido que
            hacer diff de logs.</p>
        </div>

        <h3>🤖 Trace Viewer API: análisis programático</h3>
        <p>El archivo de traza (.zip) contiene datos estructurados que puedes analizar
        programáticamente. Esto permite construir herramientas de análisis automatizado,
        dashboards de rendimiento y reportes personalizados basados en trazas.</p>

        <pre><code class="python"># Análisis programático de archivos de traza
import zipfile
import json
import os


class TraceAnalyzer:
    """
    Analiza archivos de traza (.zip) de Playwright
    extrayendo métricas, acciones y recursos.
    """

    def __init__(self, trace_path):
        self.trace_path = trace_path
        self.data = self._extraer_datos()

    def _extraer_datos(self):
        """Extrae y parsea los archivos JSON dentro del .zip."""
        datos = {}
        with zipfile.ZipFile(self.trace_path, 'r') as zf:
            for nombre in zf.namelist():
                if nombre.endswith('.json'):
                    contenido = zf.read(nombre).decode('utf-8')
                    # Cada línea puede ser un evento JSON separado
                    eventos = []
                    for linea in contenido.strip().split('\\n'):
                        try:
                            eventos.append(json.loads(linea))
                        except json.JSONDecodeError:
                            continue
                    datos[nombre] = eventos
        return datos

    def listar_archivos(self):
        """Lista todos los archivos dentro de la traza."""
        with zipfile.ZipFile(self.trace_path, 'r') as zf:
            for info in zf.infolist():
                print(f"  {info.filename} ({info.file_size:,} bytes)")

    def obtener_acciones(self):
        """Extrae todas las acciones del test desde la traza."""
        acciones = []
        for nombre, eventos in self.data.items():
            for evento in eventos:
                if evento.get("type") == "action":
                    acciones.append({
                        "nombre": evento.get("method", "unknown"),
                        "selector": evento.get("params", {}).get(
                            "selector", ""
                        ),
                        "duracion_ms": evento.get("endTime", 0)
                                     - evento.get("startTime", 0),
                        "error": evento.get("error"),
                    })
        return acciones

    def obtener_requests(self):
        """Extrae las peticiones de red de la traza."""
        requests = []
        for nombre, eventos in self.data.items():
            for evento in eventos:
                if evento.get("type") == "resource":
                    requests.append({
                        "url": evento.get("url", ""),
                        "method": evento.get("method", ""),
                        "status": evento.get("status", 0),
                        "tamanio": evento.get("responseSize", 0),
                    })
        return requests

    def resumen(self):
        """Genera un resumen de la traza."""
        acciones = self.obtener_acciones()
        requests = self.obtener_requests()

        duracion_total = sum(
            a["duracion_ms"] for a in acciones
        )
        errores = [a for a in acciones if a.get("error")]

        print(f"📊 Resumen de traza: {self.trace_path}")
        print(f"  Acciones:         {len(acciones)}")
        print(f"  Duración total:   {duracion_total:.0f} ms")
        print(f"  Errores:          {len(errores)}")
        print(f"  Peticiones red:   {len(requests)}")

        if errores:
            print(f"\\n  ❌ Acciones con error:")
            for e in errores:
                print(f"    - {e['nombre']}: {e['error']}")

        return {
            "acciones": len(acciones),
            "duracion_ms": duracion_total,
            "errores": len(errores),
            "requests": len(requests),
        }


# Uso
analyzer = TraceAnalyzer("traces/test-login.zip")
analyzer.listar_archivos()
analyzer.resumen()</code></pre>

        <h3>📦 Extracción de archivos HAR desde trazas</h3>
        <p>Las trazas de Playwright contienen el tráfico de red completo. Puedes extraer esta
        información en formato <strong>HAR (HTTP Archive)</strong>, compatible con herramientas
        como Chrome DevTools, Charles Proxy o herramientas de análisis de rendimiento.</p>

        <pre><code class="python"># Extraer HAR desde trazas de Playwright
from playwright.sync_api import sync_playwright
import json


def capturar_con_har_y_traza():
    """
    Captura simultáneamente una traza y un archivo HAR.
    El HAR se puede analizar con herramientas externas.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch()

        # Crear contexto con captura de HAR habilitada
        context = browser.new_context(
            record_har_path="traces/network.har",
            record_har_url_filter="**/api/**",  # Solo captura APIs
            record_har_mode="minimal"  # "full" incluye bodies
        )

        # También capturar traza
        context.tracing.start(
            title="HAR + Traza",
            screenshots=True,
            snapshots=True,
            sources=True
        )

        page = context.new_page()
        page.goto("https://mi-aplicacion.com/dashboard")
        page.wait_for_load_state("networkidle")

        # Navegar por la aplicación
        page.click("#btn-cargar-datos")
        page.wait_for_selector(".datos-cargados")

        # Detener traza
        context.tracing.stop(path="traces/har-traza.zip")

        # Cerrar contexto para finalizar el HAR
        context.close()
        browser.close()

    # Analizar el HAR generado
    with open("traces/network.har", "r") as f:
        har = json.load(f)

    entries = har.get("log", {}).get("entries", [])
    print(f"\\n📋 HAR: {len(entries)} peticiones capturadas")
    for entry in entries:
        req = entry["request"]
        resp = entry["response"]
        tiempo = entry.get("time", 0)
        print(f"  [{resp['status']}] {req['method']} "
              f"{req['url'][:60]} ({tiempo:.0f}ms)")


def analizar_har_detallado(har_path):
    """
    Análisis detallado de un archivo HAR.
    Identifica peticiones lentas, errores y tamaños.
    """
    with open(har_path, "r") as f:
        har = json.load(f)

    entries = har["log"]["entries"]
    total_tiempo = sum(e.get("time", 0) for e in entries)
    total_tamanio = sum(
        e["response"]["content"].get("size", 0)
        for e in entries
    )

    # Peticiones más lentas
    por_tiempo = sorted(
        entries, key=lambda e: e.get("time", 0), reverse=True
    )

    print(f"⏱️ Análisis HAR: {har_path}")
    print(f"  Total peticiones: {len(entries)}")
    print(f"  Tiempo total:     {total_tiempo:.0f} ms")
    print(f"  Tamaño total:     {total_tamanio / 1024:.1f} KB")
    print(f"\\n  🐌 Top 5 peticiones más lentas:")
    for entry in por_tiempo[:5]:
        req = entry["request"]
        print(f"    {entry.get('time', 0):.0f}ms - "
              f"{req['method']} {req['url'][:60]}")

    # Errores
    errores = [
        e for e in entries if e["response"]["status"] >= 400
    ]
    if errores:
        print(f"\\n  ❌ {len(errores)} peticiones con error:")
        for e in errores:
            req = e["request"]
            resp = e["response"]
            print(f"    [{resp['status']}] {req['method']} "
                  f"{req['url'][:60]}")


capturar_con_har_y_traza()
analizar_har_detallado("traces/network.har")</code></pre>

        <h3>⏱️ Análisis de rendimiento usando timelines de traza</h3>
        <p>Las trazas contienen información de <strong>timing</strong> para cada acción, lo que
        permite construir análisis de rendimiento automatizados. Puedes detectar acciones lentas,
        cuellos de botella y regresiones de rendimiento comparando trazas entre versiones.</p>

        <pre><code class="python"># Análisis de rendimiento basado en trazas
from playwright.sync_api import sync_playwright
import time
import json


class PerformanceTraceAnalyzer:
    """
    Ejecuta tests capturando métricas de rendimiento
    y genera reportes basados en la timeline de la traza.
    """

    def __init__(self, umbral_lento_ms=1000):
        self.umbral_lento_ms = umbral_lento_ms
        self.metricas = []

    def medir_accion(self, page, accion, descripcion):
        """Mide el tiempo de una acción individual."""
        inicio = time.time()
        accion()
        duracion_ms = (time.time() - inicio) * 1000

        metrica = {
            "descripcion": descripcion,
            "duracion_ms": round(duracion_ms, 2),
            "es_lenta": duracion_ms > self.umbral_lento_ms,
            "url": page.url,
        }
        self.metricas.append(metrica)
        return metrica

    def reporte(self):
        """Genera reporte de rendimiento."""
        if not self.metricas:
            return "Sin métricas registradas."

        total = sum(m["duracion_ms"] for m in self.metricas)
        lentas = [m for m in self.metricas if m["es_lenta"]]
        promedio = total / len(self.metricas)

        lineas = [
            f"📊 Reporte de rendimiento",
            f"  Acciones medidas:    {len(self.metricas)}",
            f"  Tiempo total:        {total:.0f} ms",
            f"  Promedio por acción: {promedio:.0f} ms",
            f"  Acciones lentas:     {len(lentas)} "
            f"(>{self.umbral_lento_ms}ms)",
        ]

        if lentas:
            lineas.append(f"\\n  🐌 Acciones lentas:")
            for m in sorted(
                lentas, key=lambda x: x["duracion_ms"], reverse=True
            ):
                lineas.append(
                    f"    ⚠️ {m['duracion_ms']:.0f}ms - "
                    f"{m['descripcion']}"
                )

        return "\\n".join(lineas)


def test_rendimiento_con_traza():
    """Test de rendimiento con traza y métricas detalladas."""
    perf = PerformanceTraceAnalyzer(umbral_lento_ms=500)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context()

        context.tracing.start(
            title="Análisis de rendimiento",
            screenshots=True,
            snapshots=True,
            sources=True
        )

        page = context.new_page()

        # Medir cada acción relevante
        perf.medir_accion(
            page,
            lambda: page.goto("https://mi-aplicacion.com"),
            "Carga inicial"
        )

        perf.medir_accion(
            page,
            lambda: page.click("#btn-login"),
            "Click en login"
        )

        perf.medir_accion(
            page,
            lambda: page.wait_for_selector(".dashboard"),
            "Espera dashboard"
        )

        perf.medir_accion(
            page,
            lambda: page.click("#btn-reporte"),
            "Generar reporte"
        )

        perf.medir_accion(
            page,
            lambda: page.wait_for_selector(".tabla-datos"),
            "Carga de datos"
        )

        # Imprimir reporte
        print(perf.reporte())

        # Guardar métricas en JSON para tendencias
        with open("traces/metricas-rendimiento.json", "w") as f:
            json.dump(perf.metricas, f, indent=2)

        context.tracing.stop(path="traces/rendimiento.zip")
        browser.close()

test_rendimiento_con_traza()</code></pre>

        <h3>🏷️ Metadata personalizada en trazas</h3>
        <p>Puedes enriquecer las trazas con <strong>metadata personalizada</strong> para identificar
        el entorno, la versión de la aplicación, el usuario de test y cualquier dato contextual
        relevante para el análisis posterior.</p>

        <pre><code class="python"># Metadata personalizada en trazas con pytest
import pytest
from playwright.sync_api import sync_playwright
import json
import os
import datetime


class TraceWithMetadata:
    """
    Wrapper para capturar trazas con metadata adicional.
    La metadata se guarda en un archivo JSON junto a la traza.
    """

    def __init__(self, context, metadata=None):
        self.context = context
        self.metadata = metadata or {}
        self.metadata["timestamp"] = datetime.datetime.now().isoformat()

    def start(self, **kwargs):
        """Inicia traza con metadata incluida en el título."""
        env = self.metadata.get("entorno", "unknown")
        version = self.metadata.get("version_app", "unknown")
        titulo = f"{kwargs.get('title', 'Test')} | Env: {env} | v{version}"
        kwargs["title"] = titulo
        self.context.tracing.start(**kwargs)

    def stop(self, path):
        """Detiene traza y guarda metadata asociada."""
        self.context.tracing.stop(path=path)

        # Guardar metadata junto a la traza
        meta_path = path.replace(".zip", "-metadata.json")
        with open(meta_path, "w") as f:
            json.dump(self.metadata, f, indent=2)
        print(f"Metadata guardada: {meta_path}")


# Uso en un test con pytest
@pytest.fixture
def traza_con_metadata(request):
    """Fixture que proporciona traza con metadata del entorno."""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context()

        metadata = {
            "entorno": os.getenv("TEST_ENV", "local"),
            "version_app": os.getenv("APP_VERSION", "2.1.0"),
            "ejecutor": os.getenv("USER", "qa-team"),
            "test_name": request.node.name,
            "suite": request.node.parent.name,
            "marcadores": [
                m.name for m in request.node.iter_markers()
            ],
        }

        traza = TraceWithMetadata(context, metadata)

        traza.start(
            title=request.node.name,
            screenshots=True,
            snapshots=True,
            sources=True
        )

        page = context.new_page()
        yield page, traza

        # Auto-guardar traza al finalizar
        trace_dir = "traces/auto"
        os.makedirs(trace_dir, exist_ok=True)
        trace_path = os.path.join(
            trace_dir,
            f"{request.node.name}.zip"
        )
        traza.stop(path=trace_path)
        context.close()
        browser.close()


def test_con_metadata(traza_con_metadata):
    """Test que automáticamente captura traza con metadata."""
    page, traza = traza_con_metadata
    page.goto("https://mi-aplicacion.com")
    assert page.title() != ""
    # La traza se guarda automáticamente al salir del fixture</code></pre>

        <h3>🌍 Hosting de Trace Viewer</h3>
        <p>Playwright ofrece varias opciones para <strong>compartir trazas</strong> con el equipo
        sin necesidad de instalar herramientas localmente.</p>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Opciones de hosting del Trace Viewer</h4>
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                    <tr style="background: #c8e6c9;">
                        <th style="padding: 8px; border: 1px solid #a5d6a7; text-align: left;">Opción</th>
                        <th style="padding: 8px; border: 1px solid #a5d6a7; text-align: left;">Cómo usarlo</th>
                        <th style="padding: 8px; border: 1px solid #a5d6a7; text-align: left;">Ventajas</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;"><strong>trace.playwright.dev</strong></td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;">Abrir la web y arrastrar el .zip</td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;">Sin instalación. Procesamiento local en el navegador (privado).</td>
                    </tr>
                    <tr style="background: #f1f8e9;">
                        <td style="padding: 8px; border: 1px solid #a5d6a7;"><strong>CLI local</strong></td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;"><code>playwright show-trace trace.zip</code></td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;">Offline. Sin subir archivos a ningún servidor.</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;"><strong>Self-hosted</strong></td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;">Servir trace-viewer de Playwright en tu servidor</td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;">Control total. Datos dentro de la red corporativa.</td>
                    </tr>
                    <tr style="background: #f1f8e9;">
                        <td style="padding: 8px; border: 1px solid #a5d6a7;"><strong>CI Artifacts</strong></td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;">Subir .zip como artefacto de pipeline</td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;">Accesible desde el historial de builds.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <pre><code class="python"># Hosting: trace.playwright.dev con URL directa
# Si tu traza está en un servidor accesible públicamente,
# puedes generar un link directo al Trace Viewer:

# URL formato:
# https://trace.playwright.dev/?trace=<URL_DEL_ARCHIVO_ZIP>

# Ejemplo con artefactos de GitHub Actions:
# https://trace.playwright.dev/?trace=https://...artifacts/trace.zip

# ─── Self-hosted: servir Trace Viewer localmente ───
# El Trace Viewer es una SPA estática que puedes servir
# con cualquier servidor HTTP.

# Opción 1: Python HTTP server para compartir con el equipo
# python -m http.server 8080 --directory traces/

# Opción 2: Configurar en conftest.py para CI/CD
import pytest
import subprocess
import os


@pytest.fixture(scope="session", autouse=True)
def publicar_trazas_en_ci(request):
    """
    En CI/CD, copia las trazas al directorio de artefactos
    y genera un índice HTML para navegación fácil.
    """
    yield

    if not os.getenv("CI"):
        return  # Solo en CI

    traces_dir = "traces"
    artifacts_dir = os.getenv("ARTIFACTS_DIR", "test-results")

    if not os.path.exists(traces_dir):
        return

    # Copiar trazas a artefactos
    os.makedirs(artifacts_dir, exist_ok=True)

    trazas = [
        f for f in os.listdir(traces_dir)
        if f.endswith(".zip")
    ]

    # Generar índice HTML
    html_links = []
    for traza in trazas:
        src = os.path.join(traces_dir, traza)
        dst = os.path.join(artifacts_dir, traza)
        os.rename(src, dst)
        url = f"https://trace.playwright.dev/?trace={traza}"
        html_links.append(
            f'&lt;li&gt;&lt;a href="{url}"&gt;{traza}&lt;/a&gt;&lt;/li&gt;'
        )

    indice = f"""&lt;html&gt;&lt;body&gt;
    &lt;h1&gt;Trazas del build&lt;/h1&gt;
    &lt;ul&gt;{"".join(html_links)}&lt;/ul&gt;
    &lt;/body&gt;&lt;/html&gt;"""

    with open(os.path.join(artifacts_dir, "index.html"), "w") as f:
        f.write(indice)

    print(f"📋 {len(trazas)} trazas publicadas en {artifacts_dir}")</code></pre>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔬 trace.playwright.dev: privacidad garantizada</h4>
            <p>Es importante saber que <strong>trace.playwright.dev</strong> procesa las trazas
            <strong>completamente en el navegador del usuario</strong>. El archivo .zip nunca se
            sube a ningún servidor de Playwright/Microsoft. Los datos permanecen locales. Esto
            lo hace seguro incluso para trazas que contienen datos sensibles de la aplicación,
            siempre que el archivo .zip no se comparta por canales inseguros.</p>
        </div>

        <h3>🏁 Resumen de conceptos clave</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📝 Lo que aprendiste en esta lección</h4>
            <ul>
                <li><strong>title</strong> y <strong>name</strong> en <code>tracing.start()</code> permiten identificar trazas y chunks</li>
                <li><strong>Trace chunks</strong> (<code>start_chunk/stop_chunk</code>) segmentan trazas largas en porciones independientes</li>
                <li><strong>Network waterfall</strong> en el Trace Viewer muestra el flujo de peticiones HTTP con tiempos y status</li>
                <li><strong>DOM snapshots</strong> capturan el HTML completo antes/después de cada acción para inspección interactiva</li>
                <li><strong>Console logs</strong> se capturan automáticamente y se pueden correlacionar con acciones del test</li>
                <li><strong>Source mapping</strong> (<code>sources=True</code>) vincula cada acción con su línea de código fuente</li>
                <li><strong>TraceAnalyzer</strong> permite análisis programático extrayendo acciones y requests del .zip</li>
                <li><strong>HAR extraction</strong> captura tráfico de red en formato compatible con herramientas de análisis</li>
                <li><strong>trace.playwright.dev</strong> procesa trazas localmente en el navegador (no sube datos al servidor)</li>
                <li><strong>Metadata personalizada</strong> enriquece trazas con información del entorno, versión y ejecutor</li>
            </ul>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🏋️ Ejercicio práctico</h4>
            <p>Construye un sistema de <strong>captura y análisis de trazas avanzado</strong> para
            un flujo E2E de una aplicación web.</p>
            <ol>
                <li>Crea un test E2E que cubra un flujo de <strong>3 fases</strong> (ej: login,
                    navegación, operación) usando <strong>trace chunks</strong> para cada fase</li>
                <li>Captura simultáneamente un archivo <strong>HAR</strong> con las peticiones de API</li>
                <li>Incluye <strong>metadata personalizada</strong> con entorno, versión y timestamp</li>
                <li>Implementa un <strong>TraceAnalyzer</strong> que:
                    <ul>
                        <li>Cuente el total de acciones y peticiones de red</li>
                        <li>Identifique las 3 acciones más lentas</li>
                        <li>Detecte peticiones con error (status >= 400)</li>
                        <li>Calcule el tamaño total de datos descargados</li>
                    </ul>
                </li>
                <li>Genera un <strong>reporte de rendimiento</strong> en formato texto que incluya:
                    <ul>
                        <li>Resumen de cada chunk (duración, acciones, errores)</li>
                        <li>Top peticiones más lentas del HAR</li>
                        <li>Metadata del entorno de ejecución</li>
                    </ul>
                </li>
            </ol>
            <p><strong>Pista:</strong> Usa <code>context.tracing.start_chunk()</code> para separar las fases,
            <code>record_har_path</code> para el HAR, y <code>zipfile</code> + <code>json</code> para
            el análisis programático.</p>

            <pre><code class="python"># Esqueleto del ejercicio
from playwright.sync_api import sync_playwright
import json
import os
import datetime


def ejercicio_trace_avanzado():
    """Sistema de captura y análisis de trazas avanzado."""
    metadata = {
        "entorno": "staging",
        "version": "2.1.0",
        "timestamp": datetime.datetime.now().isoformat(),
        "ejecutor": "qa-team"
    }

    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(
            record_har_path="traces/ejercicio.har",
            record_har_mode="minimal"
        )

        # Iniciar traza principal
        context.tracing.start(
            title=f"Ejercicio | {metadata['entorno']} | v{metadata['version']}",
            screenshots=True,
            snapshots=True,
            sources=True
        )

        page = context.new_page()

        # ── Chunk 1: Login ──
        page.goto("https://mi-aplicacion.com/login")
        # TODO: Completar flujo de login
        context.tracing.stop_chunk(path="traces/ej-chunk-login.zip")

        # ── Chunk 2: Navegación ──
        context.tracing.start_chunk(title="Navegación")
        # TODO: Completar navegación
        context.tracing.stop_chunk(path="traces/ej-chunk-nav.zip")

        # ── Chunk 3: Operación ──
        context.tracing.start_chunk(title="Operación")
        # TODO: Completar operación
        context.tracing.stop(path="traces/ej-chunk-op.zip")

        context.close()
        browser.close()

    # TODO: Implementar TraceAnalyzer
    # TODO: Analizar cada chunk
    # TODO: Analizar HAR
    # TODO: Generar reporte combinado con metadata

    # Guardar metadata
    with open("traces/ejercicio-metadata.json", "w") as f:
        json.dump(metadata, f, indent=2)


ejercicio_trace_avanzado()</code></pre>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA - Trazas en el workflow diario</h4>
            <p>En SIESA, el equipo de QA tiene configurado el pipeline para que <strong>siempre</strong>
            capture trazas en los tests de regresión, pero solo las <strong>conserve cuando hay fallos</strong>.
            Esto evita acumular GBs de archivos de traza innecesarios. Cuando un test falla, la traza
            se sube como artefacto del build y se enlaza directamente en el reporte de Allure.
            El desarrollador hace click, se abre trace.playwright.dev y puede diagnosticar el fallo
            en menos de 5 minutos. Este workflow ha reducido el tiempo promedio de resolución de bugs
            de <strong>4 horas a 30 minutos</strong>.</p>
        </div>
    `,
    topics: ["trace-viewer", "avanzado", "análisis"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_107 = LESSON_107;
}
