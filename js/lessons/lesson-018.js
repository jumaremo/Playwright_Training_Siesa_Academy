/**
 * Playwright Academy - Lección 018
 * Logging y mensajes de debug
 * Sección 2: Fundamentos de Playwright
 */

const LESSON_018 = {
    id: 18,
    title: "Logging y mensajes de debug",
    duration: "5 min",
    level: "beginner",
    section: "section-02",
    content: `
        <h2>🔍 Logging y mensajes de debug</h2>
        <p>Cuando un test falla, necesitas información para diagnosticar el problema.
        Playwright y pytest ofrecen varias herramientas de logging y debugging.</p>

        <h3>📋 Print básico con pytest -s</h3>
        <div class="code-tabs" data-code-id="L018-1">
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
                <pre><code class="language-python">def test_con_prints(page):
    page.goto("https://example.com")
    print(f"URL actual: {page.url}")
    print(f"Título: {page.title()}")

    page.click("a")
    print(f"URL después del click: {page.url}")

# Ejecutar con -s para ver los prints:
# pytest test_debug.py -s -v</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('con prints', async ({ page }) => {
    await page.goto('https://example.com');
    console.log(\`URL actual: \${page.url()}\`);
    console.log(\`Título: \${await page.title()}\`);

    await page.click('a');
    console.log(\`URL después del click: \${page.url()}\`);
});

// Ejecutar con --reporter=list para ver los console.log:
// npx playwright test test_debug.spec.ts --reporter=list</code></pre>
            </div>
        </div>

        <h3>📝 Módulo logging de Python</h3>
        <div class="code-tabs" data-code-id="L018-2">
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
                <pre><code class="language-python">import logging
from playwright.sync_api import Page, expect

# Configurar logger
logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

def test_con_logging(page: Page):
    logger.info("Navegando a example.com")
    page.goto("https://example.com")

    logger.info(f"Título de la página: {page.title()}")

    logger.debug("Buscando heading h1")  # Solo visible con level=DEBUG
    heading = page.locator("h1")

    logger.info("Verificando texto del heading")
    expect(heading).to_have_text("Example Domain")

    logger.warning("Este test necesita revisión")
    logger.error("Algo falló (ejemplo)")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

// En TypeScript/Playwright Test se usa console.log o un logger externo
// como winston o pino. console.log es lo más directo:

test('con logging', async ({ page }) => {
    console.log('[INFO] Navegando a example.com');
    await page.goto('https://example.com');

    console.log(\`[INFO] Título de la página: \${await page.title()}\`);

    console.debug('[DEBUG] Buscando heading h1');
    const heading = page.locator('h1');

    console.log('[INFO] Verificando texto del heading');
    await expect(heading).toHaveText('Example Domain');

    console.warn('[WARN] Este test necesita revisión');
    console.error('[ERROR] Algo falló (ejemplo)');
});</code></pre>
            </div>
        </div>

        <h3>🔧 Configurar logging en conftest.py</h3>
        <div class="code-tabs" data-code-id="L018-3">
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
                <pre><code class="language-python"># conftest.py
import logging
import pytest

# Logger global para tests
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%H:%M:%S"
)

@pytest.fixture(autouse=True)
def log_test_info(request):
    """Log automático de inicio y fin de cada test."""
    logger = logging.getLogger("test")
    test_name = request.node.name

    logger.info(f"{'='*50}")
    logger.info(f"INICIO: {test_name}")
    logger.info(f"{'='*50}")

    yield

    logger.info(f"FIN: {test_name}")
    logger.info(f"{'='*50}")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    // Reporter 'list' muestra logs en consola
    reporter: [['list'], ['html']],
    use: {
        trace: 'retain-on-failure',
    },
});

// fixtures/logging.ts - Hook equivalente con beforeEach/afterEach
import { test as base } from '@playwright/test';

export const test = base.extend({});

// En cada archivo de test:
import { test, expect } from '@playwright/test';

test.beforeEach(async ({}, testInfo) => {
    console.log('='.repeat(50));
    console.log(\`INICIO: \${testInfo.title}\`);
    console.log('='.repeat(50));
});

test.afterEach(async ({}, testInfo) => {
    console.log(\`FIN: \${testInfo.title}\`);
    console.log('='.repeat(50));
});</code></pre>
            </div>
        </div>

        <h3>🎭 Playwright Trace Viewer</h3>
        <p>El Trace Viewer es la herramienta más poderosa para debugging. Graba cada acción,
        screenshot, y estado de la red durante el test.</p>
        <div class="code-tabs" data-code-id="L018-4">
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
                <pre><code class="language-python"># conftest.py - Habilitar tracing
import pytest

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        # El trace se configura a nivel de context
    }

@pytest.fixture(autouse=True)
def trace_test(page, request):
    """Graba un trace para cada test."""
    # Iniciar trace
    page.context.tracing.start(
        screenshots=True,
        snapshots=True,
        sources=True
    )

    yield

    # Guardar trace
    test_name = request.node.name.replace(" ", "_")
    page.context.tracing.stop(
        path=f"traces/{test_name}.zip"
    )</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// playwright.config.ts - Habilitar tracing
import { defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        // Trace automático - sin necesidad de fixture manual
        trace: 'on',                  // Siempre grabar
        // trace: 'retain-on-failure', // Solo si falla
    },
});

// O manualmente en un test:
import { test, expect } from '@playwright/test';

test('con tracing manual', async ({ context, page }) => {
    await context.tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true,
    });

    await page.goto('https://example.com');
    // ... acciones del test

    await context.tracing.stop({
        path: 'traces/test_login.zip',
    });
});</code></pre>
            </div>
        </div>
        <div class="code-tabs" data-code-id="L018-5">
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
                <pre><code class="language-bash"># Ver el trace en el navegador:
playwright show-trace traces/test_login.zip

# O con pytest-playwright directamente:
pytest --tracing=on
pytest --tracing=retain-on-failure  # Solo si falla</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <div class="code-note">
                    <span class="code-note-icon">ℹ️</span>
                    <span class="code-note-text">Equivalente con Playwright Test (TypeScript):</span>
                </div>
                <pre><code class="language-bash"># Ver el trace en el navegador:
npx playwright show-trace traces/test_login.zip

# O con Playwright Test directamente:
npx playwright test --trace=on
npx playwright test --trace=retain-on-failure  # Solo si falla</code></pre>
            </div>
        </div>

        <h3>🖥️ Modo headed para debugging visual</h3>
        <div class="code-tabs" data-code-id="L018-6">
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
                <pre><code class="language-bash"># Ejecutar tests con navegador visible
pytest --headed

# Ejecutar lento para ver las acciones
pytest --headed --slowmo=1000  # 1 segundo entre acciones

# Combinados para máximo debug
pytest --headed --slowmo=500 -s -v</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <div class="code-note">
                    <span class="code-note-icon">ℹ️</span>
                    <span class="code-note-text">Equivalente con Playwright Test (TypeScript):</span>
                </div>
                <pre><code class="language-bash"># Ejecutar tests con navegador visible
npx playwright test --headed

# Ejecutar lento para ver las acciones
npx playwright test --headed  # Configurar slowMo en playwright.config.ts

# Modo debug completo (headed + inspector)
npx playwright test --debug</code></pre>
            </div>
        </div>

        <h3>⏸️ page.pause() - Breakpoint interactivo</h3>
        <div class="code-tabs" data-code-id="L018-7">
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
                <pre><code class="language-python">def test_con_pausa(page):
    page.goto("https://example.com")

    # Esto abre el Inspector de Playwright
    # Puedes interactuar manualmente con la página
    page.pause()  # ⬅️ Breakpoint! Abre Playwright Inspector

    # El test continúa cuando cierras el inspector
    page.click("a")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('con pausa', async ({ page }) => {
    await page.goto('https://example.com');

    // Esto abre el Inspector de Playwright
    // Puedes interactuar manualmente con la página
    await page.pause();  // ⬅️ Breakpoint! Abre Playwright Inspector

    // El test continúa cuando cierras el inspector
    await page.click('a');
});</code></pre>
            </div>
        </div>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Importante:</strong> <code>page.pause()</code> requiere ejecutar
            en modo headed: <code>pytest --headed test_archivo.py</code>.
            Recuerda eliminar los <code>pause()</code> antes de hacer commit.</p>
        </div>

        <h3>📊 Capturar logs de consola del navegador</h3>
        <div class="code-tabs" data-code-id="L018-8">
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
                <pre><code class="language-python">def test_logs_consola(page):
    mensajes = []

    # Escuchar mensajes de consola del navegador
    page.on("console", lambda msg: mensajes.append(
        f"[{msg.type}] {msg.text}"
    ))

    # Escuchar errores de página
    page.on("pageerror", lambda err: print(f"Error JS: {err}"))

    page.goto("https://mi-app.com")

    # Ver todos los mensajes capturados
    for msg in mensajes:
        print(msg)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('logs consola', async ({ page }) => {
    const mensajes: string[] = [];

    // Escuchar mensajes de consola del navegador
    page.on('console', (msg) => {
        mensajes.push(\`[\${msg.type()}] \${msg.text()}\`);
    });

    // Escuchar errores de página
    page.on('pageerror', (err) => {
        console.log(\`Error JS: \${err}\`);
    });

    await page.goto('https://mi-app.com');

    // Ver todos los mensajes capturados
    for (const msg of mensajes) {
        console.log(msg);
    }
});</code></pre>
            </div>
        </div>

        <h3>🌐 Interceptar requests de red</h3>
        <div class="code-tabs" data-code-id="L018-9">
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
                <pre><code class="language-python">def test_monitorear_red(page):
    requests_log = []

    # Capturar todas las requests
    page.on("request", lambda req: requests_log.append(
        f"{req.method} {req.url}"
    ))

    page.on("response", lambda res: print(
        f"← {res.status} {res.url}"
    ))

    page.goto("https://example.com")

    # Mostrar las requests realizadas
    print(f"\\nTotal requests: {len(requests_log)}")
    for req in requests_log[:5]:
        print(f"  {req}")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('monitorear red', async ({ page }) => {
    const requestsLog: string[] = [];

    // Capturar todas las requests
    page.on('request', (req) => {
        requestsLog.push(\`\${req.method()} \${req.url()}\`);
    });

    page.on('response', (res) => {
        console.log(\`← \${res.status()} \${res.url()}\`);
    });

    await page.goto('https://example.com');

    // Mostrar las requests realizadas
    console.log(\`\\nTotal requests: \${requestsLog.length}\`);
    for (const req of requestsLog.slice(0, 5)) {
        console.log(\`  \${req}\`);
    }
});</code></pre>
            </div>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <ol>
            <li>Agrega logging con el módulo <code>logging</code> a un test existente</li>
            <li>Configura el trace automático en <code>conftest.py</code></li>
            <li>Ejecuta un test con <code>pytest --headed --slowmo=500 -s</code></li>
            <li>Usa <code>page.pause()</code> para explorar una página manualmente</li>
            <li>Abre un trace con <code>playwright show-trace</code></li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Usar <code>print()</code> y <code>logging</code> para depuración</li>
                <li>Configurar Playwright Trace Viewer</li>
                <li>Debugging visual con <code>--headed</code> y <code>--slowmo</code></li>
                <li>Capturar logs de consola y tráfico de red</li>
            </ul>
        </div>
    `,
    topics: ["logging", "debug", "mensajes"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_018 = LESSON_018;
}
