/**
 * Playwright Academy - Lección 095
 * Trace Viewer: grabación y análisis
 * Sección 14: Debugging: Inspector, Trace, Codegen
 */

const LESSON_095 = {
    id: 95,
    title: "Trace Viewer: grabación y análisis",
    duration: "7 min",
    level: "intermediate",
    section: "section-14",
    content: `
        <h2>🔬 Trace Viewer: grabación y análisis</h2>
        <p>El <strong>Trace Viewer</strong> de Playwright es una herramienta de depuración post-mortem que
        graba <strong>absolutamente todo</strong> lo que sucede durante la ejecución de un test: screenshots
        de cada paso, snapshots del DOM, peticiones de red, logs de consola y el código fuente que
        originó cada acción. Es como tener una caja negra de avión para tus tests.</p>

        <h3>🔍 ¿Qué es el Trace Viewer?</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>El Trace Viewer es un visor interactivo que permite <strong>reproducir paso a paso</strong>
            la ejecución de un test, incluso cuando no tienes acceso al navegador (como en CI/CD).
            A diferencia del Inspector (que es en tiempo real), el Trace Viewer trabaja con
            <strong>grabaciones previas</strong>, lo que lo hace ideal para:</p>
            <ul>
                <li><strong>Depuración post-mortem:</strong> Analizar por qué falló un test en CI sin reproducirlo</li>
                <li><strong>Tests flaky:</strong> Comparar una ejecución exitosa vs una fallida</li>
                <li><strong>Revisión de equipo:</strong> Compartir traces con colegas para análisis colaborativo</li>
                <li><strong>Documentación:</strong> Evidencia visual de cómo se ejecutó el test</li>
            </ul>
            <p>El trace se guarda como un archivo <code>.zip</code> que contiene todos los datos
            necesarios para reconstruir la ejecución completa.</p>
        </div>

        <h3>🎬 Iniciar una grabación de trace</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Grabación básica</h4>
            <p>El tracing se habilita a nivel de <strong>BrowserContext</strong>, no de página individual:</p>
            <div class="code-tabs" data-code-id="L095-1">
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
            <pre><code class="language-python"># trace_basico.py
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context()

    # 🎬 INICIAR la grabación del trace
    context.tracing.start(
        screenshots=True,   # Capturar screenshot en cada acción
        snapshots=True,      # Capturar snapshot del DOM en cada acción
        sources=True         # Incluir código fuente en el trace
    )

    page = context.new_page()

    # Acciones que serán grabadas
    page.goto("https://mi-app.com/login")
    page.fill("#email", "admin@siesa.com")
    page.fill("#password", "Admin123!")
    page.click("button[type='submit']")
    page.wait_for_url("**/dashboard")

    # ⏹️ DETENER y guardar el trace
    context.tracing.stop(path="traces/login_trace.zip")

    browser.close()
    print("✅ Trace guardado en traces/login_trace.zip")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// trace_basico.ts
import { chromium } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext();

// 🎬 INICIAR la grabación del trace
await context.tracing.start({
    screenshots: true,   // Capturar screenshot en cada acción
    snapshots: true,     // Capturar snapshot del DOM en cada acción
    sources: true        // Incluir código fuente en el trace
});

const page = await context.newPage();

// Acciones que serán grabadas
await page.goto('https://mi-app.com/login');
await page.fill('#email', 'admin@siesa.com');
await page.fill('#password', 'Admin123!');
await page.click("button[type='submit']");
await page.waitForURL('**/dashboard');

// ⏹️ DETENER y guardar el trace
await context.tracing.stop({ path: 'traces/login_trace.zip' });

await browser.close();
console.log('✅ Trace guardado en traces/login_trace.zip');</code></pre>
            </div>
            </div>
        </div>

        <h3>⚙️ Opciones de grabación</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Cada opción de <code>tracing.start()</code> controla qué se incluye en el archivo:</p>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #1565c0; color: white;">
                        <th style="padding: 10px;">Parámetro</th>
                        <th style="padding: 10px;">Tipo</th>
                        <th style="padding: 10px;">Descripción</th>
                        <th style="padding: 10px;">Impacto en tamaño</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><code>screenshots</code></td>
                        <td style="padding: 8px;">bool</td>
                        <td style="padding: 8px;">Captura de pantalla en cada acción</td>
                        <td style="padding: 8px;">Alto (~50-200 KB/acción)</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><code>snapshots</code></td>
                        <td style="padding: 8px;">bool</td>
                        <td style="padding: 8px;">Snapshot del DOM (permite inspeccionar elementos)</td>
                        <td style="padding: 8px;">Medio (~20-100 KB/acción)</td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><code>sources</code></td>
                        <td style="padding: 8px;">bool</td>
                        <td style="padding: 8px;">Código fuente del test (resalta la línea activa)</td>
                        <td style="padding: 8px;">Bajo (~pocos KB)</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><code>title</code></td>
                        <td style="padding: 8px;">str</td>
                        <td style="padding: 8px;">Título descriptivo que aparece en el viewer</td>
                        <td style="padding: 8px;">Ninguno</td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><code>name</code></td>
                        <td style="padding: 8px;">str</td>
                        <td style="padding: 8px;">Nombre del trace (para múltiples chunks)</td>
                        <td style="padding: 8px;">Ninguno</td>
                    </tr>
                </tbody>
            </table>
            <div class="code-tabs" data-code-id="L095-2">
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
            <pre><code class="language-python"># Grabación completa con título descriptivo
context.tracing.start(
    screenshots=True,
    snapshots=True,
    sources=True,
    title="Test login con credenciales válidas"
)

# Solo screenshots (más liviano, útil para CI)
context.tracing.start(
    screenshots=True,
    snapshots=False,
    sources=False
)

# Solo DOM snapshots (para depurar selectores)
context.tracing.start(
    screenshots=False,
    snapshots=True,
    sources=True
)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// Grabación completa con título descriptivo
await context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
    title: 'Test login con credenciales válidas'
});

// Solo screenshots (más liviano, útil para CI)
await context.tracing.start({
    screenshots: true,
    snapshots: false,
    sources: false
});

// Solo DOM snapshots (para depurar selectores)
await context.tracing.start({
    screenshots: false,
    snapshots: true,
    sources: true
});</code></pre>
            </div>
            </div>
        </div>

        <h3>🔄 Chunks: múltiples traces en una sesión</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Puedes dividir la grabación en <strong>múltiples archivos</strong> usando
            <code>start_chunk()</code>, útil para generar un trace por cada test dentro del mismo context:</p>
            <div class="code-tabs" data-code-id="L095-3">
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
            <pre><code class="language-python"># trace_chunks.py
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context()

    # Iniciar tracing global (una sola vez)
    context.tracing.start(
        screenshots=True,
        snapshots=True,
        sources=True
    )
    page = context.new_page()

    # --- Chunk 1: Test de login ---
    context.tracing.start_chunk(title="Test: Login exitoso")
    page.goto("https://mi-app.com/login")
    page.fill("#email", "admin@siesa.com")
    page.fill("#password", "Admin123!")
    page.click("button[type='submit']")
    page.wait_for_url("**/dashboard")
    # Guardar chunk 1
    context.tracing.stop_chunk(path="traces/login.zip")

    # --- Chunk 2: Test de navegación ---
    context.tracing.start_chunk(title="Test: Navegación dashboard")
    page.click("text=Reportes")
    page.wait_for_selector("h1:has-text('Reportes')")
    page.click("text=Dashboard")
    page.wait_for_selector("h1:has-text('Dashboard')")
    # Guardar chunk 2
    context.tracing.stop_chunk(path="traces/navegacion.zip")

    # Detener tracing global
    context.tracing.stop()
    browser.close()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// trace_chunks.ts
import { chromium } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext();

// Iniciar tracing global (una sola vez)
await context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true
});
const page = await context.newPage();

// --- Chunk 1: Test de login ---
await context.tracing.startChunk({ title: 'Test: Login exitoso' });
await page.goto('https://mi-app.com/login');
await page.fill('#email', 'admin@siesa.com');
await page.fill('#password', 'Admin123!');
await page.click("button[type='submit']");
await page.waitForURL('**/dashboard');
// Guardar chunk 1
await context.tracing.stopChunk({ path: 'traces/login.zip' });

// --- Chunk 2: Test de navegación ---
await context.tracing.startChunk({ title: 'Test: Navegación dashboard' });
await page.click('text=Reportes');
await page.waitForSelector("h1:has-text('Reportes')");
await page.click('text=Dashboard');
await page.waitForSelector("h1:has-text('Dashboard')");
// Guardar chunk 2
await context.tracing.stopChunk({ path: 'traces/navegacion.zip' });

// Detener tracing global
await context.tracing.stop();
await browser.close();</code></pre>
            </div>
            </div>
        </div>

        <h3>👁️ Abrir y navegar el Trace Viewer</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Abrir un trace</h4>
            <pre><code class="bash"># Desde la terminal — abre el visor en el navegador
playwright show-trace traces/login_trace.zip

# Si usas Python con el módulo playwright
python -m playwright show-trace traces/login_trace.zip

# Abrir múltiples traces para comparar
playwright show-trace traces/login_exitoso.zip traces/login_fallido.zip</code></pre>

            <h4>Paneles del Trace Viewer</h4>
            <p>El Trace Viewer se abre en el navegador y muestra varios paneles:</p>
            <ul>
                <li><strong>Timeline (línea de tiempo):</strong> Barra superior con miniaturas de cada paso.
                    Haz clic en cualquier punto para navegar a ese momento exacto.</li>
                <li><strong>Actions (panel izquierdo):</strong> Lista cronológica de todas las acciones
                    (<code>goto</code>, <code>fill</code>, <code>click</code>, etc.) con duración de cada una.</li>
                <li><strong>DOM Snapshot (panel central):</strong> Reconstrucción interactiva del DOM en ese
                    instante. Puedes inspeccionar elementos, ver estilos y probar selectores.</li>
                <li><strong>Before/After:</strong> Selector para ver el estado del DOM antes o después de la acción.</li>
                <li><strong>Network (pestaña):</strong> Todas las peticiones HTTP con request/response, headers,
                    body, timing y status code.</li>
                <li><strong>Console (pestaña):</strong> Mensajes de <code>console.log</code>, warnings y errores
                    del navegador.</li>
                <li><strong>Source (pestaña):</strong> Código fuente del test con la línea actual resaltada.</li>
                <li><strong>Call (pestaña):</strong> Detalles de la llamada a la API de Playwright
                    (argumentos, selector, resultado).</li>
            </ul>
        </div>

        <h3>🏗️ Traces en CI: guardar solo en fallos</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>En CI/CD, guardar traces de <strong>todos</strong> los tests consume mucho espacio.
            La mejor práctica es guardar el trace <strong>solo cuando un test falla</strong>:</p>
            <div class="code-tabs" data-code-id="L095-4">
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
            <pre><code class="language-python"># conftest.py — Trace automático solo en fallos
import pytest
import os
from playwright.sync_api import sync_playwright

TRACE_DIR = "test-results/traces"


@pytest.fixture(scope="session")
def browser():
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        yield b
        b.close()


@pytest.fixture
def page_with_trace(browser, request):
    """
    Fixture que graba trace automáticamente.
    Solo guarda el archivo si el test FALLA.
    """
    context = browser.new_context()

    # 🎬 Iniciar grabación siempre
    context.tracing.start(
        screenshots=True,
        snapshots=True,
        sources=True,
        title=request.node.name  # Nombre del test como título
    )

    page = context.new_page()
    yield page

    # 📋 Después del test: verificar si falló
    if request.node.rep_call and request.node.rep_call.failed:
        # Test falló — guardar el trace
        os.makedirs(TRACE_DIR, exist_ok=True)
        trace_path = os.path.join(
            TRACE_DIR,
            f"{request.node.name}.zip"
        )
        context.tracing.stop(path=trace_path)
        print(f"\\n📎 Trace guardado: {trace_path}")
    else:
        # Test pasó — descartar el trace
        context.tracing.stop()

    context.close()


# Hook necesario para acceder al resultado del test en la fixture
@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Almacenar el resultado del test en el item para que la fixture lo lea."""
    import pluggy
    outcome = yield
    rep = outcome.get_result()
    setattr(item, f"rep_{rep.when}", rep)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// playwright.config.ts — Trace automático solo en fallos
import { defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        // 🎬 Graba trace solo cuando el test falla
        trace: 'on-first-retry',  // o 'retain-on-failure'
    },
    // Directorio de salida para traces y artefactos
    outputDir: 'test-results/traces',
    retries: 1, // Reintentar 1 vez para capturar trace en el retry
});

// ─────────────────────────────────────────────────
// Alternativa: control manual con hooks en cada test
// tests/example.spec.ts
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const TRACE_DIR = 'test-results/traces';

test.beforeEach(async ({ context }, testInfo) => {
    // 🎬 Iniciar grabación siempre
    await context.tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true,
        title: testInfo.title  // Nombre del test como título
    });
});

test.afterEach(async ({ context }, testInfo) => {
    // 📋 Después del test: verificar si falló
    if (testInfo.status === 'failed') {
        // Test falló — guardar el trace
        fs.mkdirSync(TRACE_DIR, { recursive: true });
        const tracePath = path.join(
            TRACE_DIR,
            \`\${testInfo.title.replace(/\\s+/g, '_')}.zip\`
        );
        await context.tracing.stop({ path: tracePath });
        console.log(\`\\n📎 Trace guardado: \${tracePath}\`);
    } else {
        // Test pasó — descartar el trace
        await context.tracing.stop();
    }
});</code></pre>
            </div>
            </div>
        </div>

        <h3>📁 Contenido de un archivo trace.zip</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Un archivo <code>.zip</code> de trace contiene internamente:</p>
            <pre><code class="text">trace.zip
├── trace.trace          # Datos principales de la grabación (JSON binario)
├── trace.network        # Log completo de peticiones de red
├── resources/
│   ├── screenshot-1.png  # Screenshot de cada paso
│   ├── screenshot-2.png
│   ├── ...
│   ├── snapshot-1.html   # DOM snapshot de cada paso
│   └── snapshot-2.html
└── sources/
    └── test_login.py     # Código fuente del test</code></pre>
            <p>Aunque puedes descomprimir el ZIP manualmente, el <strong>Trace Viewer</strong> es la forma
            recomendada de analizar los datos porque correlaciona screenshots, DOM, red y código
            de forma interactiva.</p>
        </div>

        <h3>🔬 Análisis de tests flaky con traces</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Los tests <strong>flaky</strong> (que pasan y fallan intermitentemente) son el problema
            más difícil de diagnosticar. El Trace Viewer es la herramienta definitiva para resolverlos:</p>

            <h4>Estrategia: grabar siempre, comparar después</h4>
            <div class="code-tabs" data-code-id="L095-5">
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
            <pre><code class="language-python"># conftest.py — Trace para tests flaky (guardar siempre)
import pytest
import os
from datetime import datetime
from playwright.sync_api import sync_playwright

TRACE_DIR = "test-results/traces"


@pytest.fixture
def traced_page(browser, request):
    """Guardar trace siempre (para análisis de flaky tests)."""
    context = browser.new_context()
    context.tracing.start(
        screenshots=True,
        snapshots=True,
        sources=True,
        title=request.node.name
    )

    page = context.new_page()
    yield page

    # Guardar con timestamp para comparar ejecuciones
    os.makedirs(TRACE_DIR, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    # Determinar resultado
    failed = request.node.rep_call and request.node.rep_call.failed
    status = "FAIL" if failed else "PASS"

    trace_path = os.path.join(
        TRACE_DIR,
        f"{request.node.name}_{status}_{timestamp}.zip"
    )
    context.tracing.stop(path=trace_path)
    context.close()


# Ejemplo: test flaky a diagnosticar
def test_carga_dashboard(traced_page):
    page = traced_page
    page.goto("https://mi-app.com/dashboard")

    # Este test falla intermitentemente...
    # ¿Es un problema de timing? ¿De datos? ¿De red?
    cards = page.locator(".dashboard-card")
    cards.first.wait_for(state="visible", timeout=5000)

    count = cards.count()
    assert count == 4, f"Se esperaban 4 cards, se encontraron {count}"</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// playwright.config.ts — Trace para tests flaky (guardar siempre)
import { defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        // Guardar trace siempre (para análisis de flaky tests)
        trace: 'on',
    },
    outputDir: 'test-results/traces',
});

// ─────────────────────────────────────────────────
// Alternativa: control manual con hooks y timestamp
// tests/flaky.spec.ts
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const TRACE_DIR = 'test-results/traces';

test.beforeEach(async ({ context }, testInfo) => {
    await context.tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true,
        title: testInfo.title
    });
});

test.afterEach(async ({ context }, testInfo) => {
    // Guardar con timestamp para comparar ejecuciones
    fs.mkdirSync(TRACE_DIR, { recursive: true });
    const timestamp = new Date().toISOString()
        .replace(/[:.]/g, '')
        .slice(0, 15);

    // Determinar resultado
    const status = testInfo.status === 'failed' ? 'FAIL' : 'PASS';
    const safeName = testInfo.title.replace(/\\s+/g, '_');

    const tracePath = path.join(
        TRACE_DIR,
        \`\${safeName}_\${status}_\${timestamp}.zip\`
    );
    await context.tracing.stop({ path: tracePath });
});

// Ejemplo: test flaky a diagnosticar
test('carga dashboard', async ({ page }) => {
    await page.goto('https://mi-app.com/dashboard');

    // Este test falla intermitentemente...
    // ¿Es un problema de timing? ¿De datos? ¿De red?
    const cards = page.locator('.dashboard-card');
    await cards.first().waitFor({ state: 'visible', timeout: 5000 });

    const count = await cards.count();
    expect(count).toBe(4);
});</code></pre>
            </div>
            </div>

            <h4>Comparar traces: ejecución exitosa vs fallida</h4>
            <pre><code class="bash"># Abrir ambos traces lado a lado
playwright show-trace \\
    test-results/traces/test_carga_dashboard_PASS_20260404_101500.zip \\
    test-results/traces/test_carga_dashboard_FAIL_20260404_101530.zip

# En el Trace Viewer puedes comparar:
# 1. Timeline: ¿la versión fallida tardó más en algún paso?
# 2. Network: ¿alguna petición retornó diferente status/datos?
# 3. DOM: ¿el DOM tenía diferente estructura?
# 4. Console: ¿hubo errores JS en la versión fallida?</code></pre>

            <p><strong>Qué buscar al comparar:</strong></p>
            <ul>
                <li><strong>Timing diferente:</strong> Una acción tardó significativamente más en la versión fallida</li>
                <li><strong>Respuestas de red distintas:</strong> Una API retornó datos diferentes o un error</li>
                <li><strong>Estado del DOM:</strong> Un elemento no se renderizó o tenía contenido diferente</li>
                <li><strong>Errores de consola:</strong> Un error JavaScript que solo ocurre bajo ciertas condiciones</li>
                <li><strong>Race condition:</strong> Una acción se ejecutó antes de que el DOM estuviera listo</li>
            </ul>
        </div>

        <h3>🌐 Trace Viewer remoto (hosted)</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Playwright ofrece un visor de traces <strong>online</strong> que permite analizar traces
            sin instalar nada localmente:</p>
            <pre><code class="bash"># Opción 1: Visor online de Playwright
# Sube tu archivo .zip a:
# https://trace.playwright.dev
# (Arrastra y suelta el archivo — los datos NO se envían al servidor,
#  todo se procesa en el navegador)</code></pre>

            <div class="code-tabs" data-code-id="L095-6">
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
            <pre><code class="language-python"># Opción 2: Servir traces desde CI como artefactos
# En GitHub Actions, guardar traces como artefactos del job:

# .github/workflows/tests.yml (fragmento relevante)
# - name: Upload traces on failure
#   if: failure()
#   uses: actions/upload-artifact@v4
#   with:
#     name: playwright-traces
#     path: test-results/traces/
#     retention-days: 7</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// Opción 2: Servir traces desde CI como artefactos
// En GitHub Actions, guardar traces como artefactos del job:

// .github/workflows/tests.yml (fragmento relevante)
// - name: Upload traces on failure
//   if: failure()
//   uses: actions/upload-artifact@v4
//   with:
//     name: playwright-traces
//     path: test-results/traces/
//     retention-days: 7

// Nota: Con @playwright/test, el directorio de traces
// se configura en playwright.config.ts con outputDir
// y trace: 'retain-on-failure'</code></pre>
            </div>
            </div>

            <p>Luego cualquier miembro del equipo puede descargar el artefacto y abrirlo en
            <code>trace.playwright.dev</code> o localmente con <code>playwright show-trace</code>.</p>
        </div>

        <h3>🏭 conftest.py completo: tracing automático de producción</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L095-7">
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
            <pre><code class="language-python"># conftest.py — Tracing robusto para CI/CD
import pytest
import os
import shutil
from playwright.sync_api import sync_playwright

TRACE_DIR = "test-results/traces"
# Controlar tracing por variable de entorno
TRACING_MODE = os.environ.get("PW_TRACING", "on-failure")
# Opciones: "off", "on-failure", "always"


@pytest.fixture(scope="session")
def browser():
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        yield b
        b.close()


@pytest.fixture(autouse=True)
def page(browser, request):
    """
    Fixture de página con tracing configurable.
    PW_TRACING=off        -> No graba traces
    PW_TRACING=on-failure -> Graba y guarda solo si falla (default)
    PW_TRACING=always     -> Graba y guarda siempre
    """
    context = browser.new_context()

    # Iniciar tracing si no está desactivado
    if TRACING_MODE != "off":
        context.tracing.start(
            screenshots=True,
            snapshots=True,
            sources=True,
            title=request.node.name
        )

    page = context.new_page()
    yield page

    # Después del test: decidir si guardar
    if TRACING_MODE != "off":
        should_save = False

        if TRACING_MODE == "always":
            should_save = True
        elif TRACING_MODE == "on-failure":
            should_save = (
                hasattr(request.node, "rep_call")
                and request.node.rep_call.failed
            )

        if should_save:
            os.makedirs(TRACE_DIR, exist_ok=True)
            # Sanitizar nombre del test para el filesystem
            safe_name = (
                request.node.name
                .replace("[", "_")
                .replace("]", "")
                .replace("/", "_")
            )
            trace_path = os.path.join(TRACE_DIR, f"{safe_name}.zip")
            context.tracing.stop(path=trace_path)
            print(f"\\n📎 Trace: {trace_path}")
        else:
            context.tracing.stop()

    context.close()


@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Hook para exponer el resultado del test a las fixtures."""
    outcome = yield
    rep = outcome.get_result()
    setattr(item, f"rep_{rep.when}", rep)


def pytest_sessionfinish(session, exitstatus):
    """Resumen de traces al final de la sesión."""
    if os.path.exists(TRACE_DIR):
        traces = [f for f in os.listdir(TRACE_DIR) if f.endswith(".zip")]
        if traces:
            print(f"\\n{'='*60}")
            print(f"📦 {len(traces)} trace(s) guardados en {TRACE_DIR}/")
            for t in sorted(traces):
                size_kb = os.path.getsize(
                    os.path.join(TRACE_DIR, t)
                ) / 1024
                print(f"   - {t} ({size_kb:.0f} KB)")
            print(f"\\n   Abrir: playwright show-trace {TRACE_DIR}/<archivo>.zip")
            print(f"   Online: https://trace.playwright.dev")
            print(f"{'='*60}")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// playwright.config.ts — Tracing robusto para CI/CD
import { defineConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const TRACE_DIR = 'test-results/traces';
// Controlar tracing por variable de entorno
const TRACING_MODE = process.env.PW_TRACING ?? 'on-failure';
// Opciones: "off", "on-failure", "always"

// Mapear modos a opciones de Playwright Test
function getTraceOption(): 'off' | 'on' | 'retain-on-failure' {
    switch (TRACING_MODE) {
        case 'off': return 'off';
        case 'always': return 'on';
        case 'on-failure':
        default: return 'retain-on-failure';
    }
}

export default defineConfig({
    use: {
        trace: getTraceOption(),
    },
    outputDir: TRACE_DIR,
});

// ─────────────────────────────────────────────────
// Reporter personalizado para resumen de traces
// reporters/trace-summary.ts
import type { Reporter, TestResult } from '@playwright/test/reporter';

class TraceSummaryReporter implements Reporter {
    onEnd() {
        if (!fs.existsSync(TRACE_DIR)) return;

        const traces: string[] = [];
        // Buscar recursivamente archivos .zip
        const walk = (dir: string) => {
            for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
                const full = path.join(dir, entry.name);
                if (entry.isDirectory()) walk(full);
                else if (entry.name.endsWith('.zip')) traces.push(full);
            }
        };
        walk(TRACE_DIR);

        if (traces.length > 0) {
            console.log(\`\\n\${'='.repeat(60)}\`);
            console.log(
                \`📦 \${traces.length} trace(s) guardados en \${TRACE_DIR}/\`
            );
            for (const t of traces.sort()) {
                const sizeKb = fs.statSync(t).size / 1024;
                const name = path.relative(TRACE_DIR, t);
                console.log(\`   - \${name} (\${sizeKb.toFixed(0)} KB)\`);
            }
            console.log(
                \`\\n   Abrir: npx playwright show-trace \${TRACE_DIR}/<archivo>.zip\`
            );
            console.log('   Online: https://trace.playwright.dev');
            console.log('='.repeat(60));
        }
    }
}
export default TraceSummaryReporter;</code></pre>
            </div>
            </div>

            <pre><code class="bash"># Ejecutar tests con diferentes modos de tracing
# Default: guardar traces solo en fallos
pytest tests/

# Guardar traces de todos los tests
PW_TRACING=always pytest tests/

# Sin tracing (máxima velocidad)
PW_TRACING=off pytest tests/

# En CI (GitHub Actions)
# PW_TRACING=on-failure pytest tests/ --tb=short</code></pre>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip SIESA:</strong> En los proyectos SIESA con ERP, HCM y WMS, configura
            <code>PW_TRACING=on-failure</code> como default en CI y <code>PW_TRACING=always</code>
            cuando estés depurando un test flaky específico. Guarda los traces como artefactos
            del pipeline con retención de 3-5 días. Cuando un test falla en CI, descarga el trace,
            ábrelo en <code>trace.playwright.dev</code> y compártelo con el equipo en el canal de
            Slack/Teams del proyecto. Es mucho más efectivo que intentar reproducir el fallo localmente.
        </div>

        <h3>⚠️ Errores comunes con tracing</h3>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>❌ Error 1: Iniciar tracing en la página en vez del context</h4>
            <div class="code-tabs" data-code-id="L095-8">
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
            <pre><code class="language-python"># ❌ MAL — page no tiene tracing
page.tracing.start(screenshots=True)  # AttributeError

# ✅ BIEN — tracing es del context
context.tracing.start(screenshots=True)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// ❌ MAL — page no tiene tracing
await page.tracing.start({ screenshots: true });  // TypeError

// ✅ BIEN — tracing es del context
await context.tracing.start({ screenshots: true });</code></pre>
            </div>
            </div>

            <h4>❌ Error 2: Olvidar detener el tracing</h4>
            <div class="code-tabs" data-code-id="L095-9">
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
            <pre><code class="language-python"># ❌ MAL — tracing nunca se detiene, el archivo no se genera
context.tracing.start(screenshots=True, snapshots=True)
page.goto("https://mi-app.com")
# ... acciones ...
context.close()  # ¡El trace se pierde!

# ✅ BIEN — siempre detener antes de cerrar
context.tracing.start(screenshots=True, snapshots=True)
page.goto("https://mi-app.com")
# ... acciones ...
context.tracing.stop(path="trace.zip")  # Primero guardar
context.close()  # Luego cerrar</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// ❌ MAL — tracing nunca se detiene, el archivo no se genera
await context.tracing.start({ screenshots: true, snapshots: true });
await page.goto('https://mi-app.com');
// ... acciones ...
await context.close();  // ¡El trace se pierde!

// ✅ BIEN — siempre detener antes de cerrar
await context.tracing.start({ screenshots: true, snapshots: true });
await page.goto('https://mi-app.com');
// ... acciones ...
await context.tracing.stop({ path: 'trace.zip' });  // Primero guardar
await context.close();  // Luego cerrar</code></pre>
            </div>
            </div>

            <h4>❌ Error 3: Ruta de destino sin directorio padre</h4>
            <div class="code-tabs" data-code-id="L095-10">
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
            <pre><code class="language-python"># ❌ MAL — la carpeta no existe, error al guardar
context.tracing.stop(path="results/traces/mi_test.zip")
# FileNotFoundError: No such file or directory

# ✅ BIEN — crear la carpeta antes
import os
os.makedirs("results/traces", exist_ok=True)
context.tracing.stop(path="results/traces/mi_test.zip")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// ❌ MAL — la carpeta no existe, error al guardar
await context.tracing.stop({ path: 'results/traces/mi_test.zip' });
// Error: ENOENT: no such file or directory

// ✅ BIEN — crear la carpeta antes
import * as fs from 'fs';
fs.mkdirSync('results/traces', { recursive: true });
await context.tracing.stop({ path: 'results/traces/mi_test.zip' });</code></pre>
            </div>
            </div>

            <h4>❌ Error 4: Traces enormes por screenshots innecesarios</h4>
            <div class="code-tabs" data-code-id="L095-11">
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
            <pre><code class="language-python"># ❌ PROBLEMÁTICO — screenshots en tests largos generan archivos de 50+ MB
context.tracing.start(screenshots=True, snapshots=True, sources=True)
# ... 200 acciones en un test largo ...
# Resultado: trace.zip de 80 MB

# ✅ MEJOR — sin screenshots para tests largos en CI
context.tracing.start(screenshots=False, snapshots=True, sources=True)
# Resultado: trace.zip de ~5 MB (igual puedes ver el DOM)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// ❌ PROBLEMÁTICO — screenshots en tests largos generan archivos de 50+ MB
await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
// ... 200 acciones en un test largo ...
// Resultado: trace.zip de 80 MB

// ✅ MEJOR — sin screenshots para tests largos en CI
await context.tracing.start({ screenshots: false, snapshots: true, sources: true });
// Resultado: trace.zip de ~5 MB (igual puedes ver el DOM)</code></pre>
            </div>
            </div>
        </div>

        <h3>📊 Comparación: herramientas de depuración de Playwright</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #1565c0; color: white;">
                        <th style="padding: 10px;">Herramienta</th>
                        <th style="padding: 10px;">Momento</th>
                        <th style="padding: 10px;">Uso principal</th>
                        <th style="padding: 10px;">Ideal para</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><strong>Inspector (PWDEBUG)</strong></td>
                        <td style="padding: 8px;">Tiempo real</td>
                        <td style="padding: 8px;">Step-by-step interactivo</td>
                        <td style="padding: 8px;">Desarrollo local</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>Codegen</strong></td>
                        <td style="padding: 8px;">Tiempo real</td>
                        <td style="padding: 8px;">Generar código desde interacciones</td>
                        <td style="padding: 8px;">Crear tests rápidamente</td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><strong>Trace Viewer</strong></td>
                        <td style="padding: 8px;">Post-mortem</td>
                        <td style="padding: 8px;">Analizar grabación completa</td>
                        <td style="padding: 8px;">Fallos en CI, flaky tests</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>Screenshots/Videos</strong></td>
                        <td style="padding: 8px;">Post-mortem</td>
                        <td style="padding: 8px;">Evidencia visual rápida</td>
                        <td style="padding: 8px;">Reportes, primera revisión</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Implementa un sistema de tracing completo para un proyecto de tests:</p>
            <ol>
                <li>Crea un <code>conftest.py</code> con:
                    <ul>
                        <li>Fixture <code>page</code> que inicie tracing automáticamente con <code>screenshots=True</code>,
                            <code>snapshots=True</code> y <code>sources=True</code></li>
                        <li>Lógica para guardar el trace solo si el test <strong>falla</strong></li>
                        <li>Nombre del archivo trace basado en el nombre del test</li>
                        <li>Hook <code>pytest_runtest_makereport</code> para exponer el resultado</li>
                    </ul>
                </li>
                <li>Crea un <code>test_trace_demo.py</code> con:
                    <ul>
                        <li>Un test que <strong>pasa</strong> (navega a una página y verifica el título) - NO debe generar trace</li>
                        <li>Un test que <strong>falla intencionalmente</strong> (busca un elemento inexistente) - DEBE generar trace</li>
                    </ul>
                </li>
                <li>Ejecuta los tests y verifica que:
                    <ul>
                        <li>Solo se generó <strong>un</strong> archivo <code>.zip</code> en <code>test-results/traces/</code></li>
                        <li>Ábrelo con <code>playwright show-trace</code> y navega por las acciones, el DOM y la red</li>
                    </ul>
                </li>
            </ol>
            <p><strong>Pista:</strong> Recuerda que <code>tracing.start()</code> va en el context, no en la page.
            Usa <code>request.node.name</code> para obtener el nombre del test y
            <code>request.node.rep_call.failed</code> para saber si falló.</p>
        </div>
    `,
    topics: ["trace-viewer", "grabación", "análisis"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_095 = LESSON_095;
}
