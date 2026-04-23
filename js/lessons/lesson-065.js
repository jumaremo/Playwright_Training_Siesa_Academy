/**
 * Playwright Academy - Lección 065
 * Fundamentos de intercepción de red
 * Sección 9: Network Interception y Mocking
 */

const LESSON_065 = {
    id: 65,
    title: "Fundamentos de intercepción de red",
    duration: "8 min",
    level: "intermediate",
    section: "section-09",
    content: `
        <h2>🌐 Fundamentos de intercepción de red</h2>
        <p>Playwright permite <strong>interceptar, inspeccionar y modificar</strong> todo
        el tráfico de red entre el navegador y los servidores. Esta capacidad es clave
        para crear tests aislados, rápidos y confiables.</p>

        <h3>🤔 ¿Por qué interceptar el tráfico de red?</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <ul>
                <li><strong>Aislamiento:</strong> Tests no dependen de APIs externas que pueden fallar</li>
                <li><strong>Velocidad:</strong> Respuestas mockeadas son instantáneas</li>
                <li><strong>Escenarios difíciles:</strong> Simular errores 500, timeouts, datos específicos</li>
                <li><strong>Reproducibilidad:</strong> Mismos datos en cada ejecución</li>
                <li><strong>Testing sin backend:</strong> Desarrollar UI antes de que la API esté lista</li>
                <li><strong>Auditoría:</strong> Verificar qué requests envía la aplicación</li>
            </ul>
        </div>

        <h3>👂 Escuchar eventos de red (monitoring)</h3>
        <div class="code-tabs" data-code-id="L065-1">
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
                <pre><code class="language-python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()

    # ── Escuchar TODAS las requests ──
    page.on("request", lambda req: print(
        f"→ {req.method} {req.url}"
    ))

    # ── Escuchar TODAS las responses ──
    page.on("response", lambda resp: print(
        f"← {resp.status} {resp.url}"
    ))

    page.goto("https://jsonplaceholder.typicode.com")
    # Salida:
    # → GET https://jsonplaceholder.typicode.com/
    # ← 200 https://jsonplaceholder.typicode.com/
    # → GET https://jsonplaceholder.typicode.com/style.css
    # ← 200 https://jsonplaceholder.typicode.com/style.css
    # ... etc

    browser.close()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test } from '@playwright/test';

test('monitorear tráfico de red', async ({ page }) => {
    // ── Escuchar TODAS las requests ──
    page.on('request', req =>
        console.log(\`→ \${req.method()} \${req.url()}\`)
    );

    // ── Escuchar TODAS las responses ──
    page.on('response', resp =>
        console.log(\`← \${resp.status()} \${resp.url()}\`)
    );

    await page.goto('https://jsonplaceholder.typicode.com');
    // Salida:
    // → GET https://jsonplaceholder.typicode.com/
    // ← 200 https://jsonplaceholder.typicode.com/
    // → GET https://jsonplaceholder.typicode.com/style.css
    // ← 200 https://jsonplaceholder.typicode.com/style.css
    // ... etc
});</code></pre>
            </div>
        </div>

        <h3>🔧 page.route() — El método fundamental</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><code>page.route()</code> registra un handler que se ejecuta cada vez que
            una request coincide con el patrón. Desde el handler puedes:</p>
            <ul>
                <li><strong>Continuar:</strong> dejar pasar la request al servidor</li>
                <li><strong>Fulfil:</strong> responder sin llegar al servidor (mock)</li>
                <li><strong>Abort:</strong> cancelar la request</li>
            </ul>
            <div class="code-tabs" data-code-id="L065-2">
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
                    <pre><code class="language-python"># Anatomía de page.route()
page.route(
    url_pattern,     # String, glob o regex
    handler_function # Función que recibe el objeto Route
)

# El handler recibe un objeto Route con 3 métodos principales:
# route.continue_()  → Dejar pasar la request
# route.fulfill()    → Responder con datos mock
# route.abort()      → Cancelar la request</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-typescript">// Anatomía de page.route()
await page.route(
    urlPattern,      // String, glob o regex
    handlerFunction  // Función que recibe el objeto Route
);

// El handler recibe un objeto Route con 3 métodos principales:
// await route.continue()  → Dejar pasar la request
// await route.fulfill()   → Responder con datos mock
// await route.abort()     → Cancelar la request</code></pre>
                </div>
            </div>
        </div>

        <h3>📌 Patrones de URL</h3>
        <div class="code-tabs" data-code-id="L065-3">
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
                <pre><code class="language-python"># ── Glob pattern (el más usado) ──
page.route("**/api/users", handler)        # Cualquier URL que termine en /api/users
page.route("**/api/**", handler)           # Todo bajo /api/
page.route("**/*.png", handler)            # Todas las imágenes PNG

# ── String exacto ──
page.route("https://api.com/users", handler)

# ── Regex ──
import re
page.route(re.compile(r"/api/users/\\d+"), handler)  # /api/users/123

# ── Función de filtro ──
page.route(
    lambda url: "/api/" in url and "admin" not in url,
    handler
)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// ── Glob pattern (el más usado) ──
await page.route('**/api/users', handler);        // Cualquier URL que termine en /api/users
await page.route('**/api/**', handler);           // Todo bajo /api/
await page.route('**/*.png', handler);            // Todas las imágenes PNG

// ── String exacto ──
await page.route('https://api.com/users', handler);

// ── Regex ──
await page.route(/\\/api\\/users\\/\\d+/, handler);   // /api/users/123

// ── Función de filtro ──
await page.route(
    url => url.toString().includes('/api/') && !url.toString().includes('admin'),
    handler
);</code></pre>
            </div>
        </div>

        <h3>✅ route.continue_() — Dejar pasar (con modificaciones opcionales)</h3>
        <div class="code-tabs" data-code-id="L065-4">
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
                <pre><code class="language-python"># Dejar pasar sin cambios (útil para logging)
def log_handler(route):
    print(f"Interceptado: {route.request.url}")
    route.continue_()

page.route("**/api/**", log_handler)

# Dejar pasar pero modificar headers
def add_auth_header(route):
    headers = route.request.headers
    headers["Authorization"] = "Bearer mi-token-123"
    route.continue_(headers=headers)

page.route("**/api/**", add_auth_header)

# Dejar pasar pero cambiar el método o la URL
def redirect_request(route):
    route.continue_(url="https://api-staging.com" + route.request.url.split(".com")[1])

page.route("**/api/**", redirect_request)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Dejar pasar sin cambios (útil para logging)
async function logHandler(route) {
    console.log(\`Interceptado: \${route.request().url()}\`);
    await route.continue();
}

await page.route('**/api/**', logHandler);

// Dejar pasar pero modificar headers
async function addAuthHeader(route) {
    const headers = route.request().headers();
    headers['Authorization'] = 'Bearer mi-token-123';
    await route.continue({ headers });
}

await page.route('**/api/**', addAuthHeader);

// Dejar pasar pero cambiar el método o la URL
async function redirectRequest(route) {
    await route.continue({ url: 'https://api-staging.com' + new URL(route.request().url()).pathname });
}

await page.route('**/api/**', redirectRequest);</code></pre>
            </div>
        </div>

        <h3>🎭 route.fulfill() — Responder con mock</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L065-5">
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
                    <pre><code class="language-python">import json

# Mock simple — responder con JSON
def mock_users(route):
    route.fulfill(
        status=200,
        content_type="application/json",
        body=json.dumps([
            {"id": 1, "name": "Juan Reina", "role": "admin"},
            {"id": 2, "name": "Carlos Díaz", "role": "tester"},
        ])
    )

page.route("**/api/users", mock_users)

# Ahora cuando la app haga fetch("/api/users"),
# recibirá nuestros datos mock instantáneamente

# Mock con headers custom
def mock_with_headers(route):
    route.fulfill(
        status=200,
        headers={
            "Content-Type": "application/json",
            "X-Total-Count": "2",
            "X-Page": "1"
        },
        body=json.dumps({"data": [], "total": 0})
    )

page.route("**/api/products*", mock_with_headers)

# Mock de error
def mock_error(route):
    route.fulfill(
        status=500,
        content_type="application/json",
        body=json.dumps({"error": "Internal Server Error"})
    )

page.route("**/api/save", mock_error)</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-typescript">// Mock simple — responder con JSON
async function mockUsers(route) {
    await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
            { id: 1, name: 'Juan Reina', role: 'admin' },
            { id: 2, name: 'Carlos Díaz', role: 'tester' },
        ])
    });
}

await page.route('**/api/users', mockUsers);

// Ahora cuando la app haga fetch("/api/users"),
// recibirá nuestros datos mock instantáneamente

// Mock con headers custom
async function mockWithHeaders(route) {
    await route.fulfill({
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'X-Total-Count': '2',
            'X-Page': '1'
        },
        body: JSON.stringify({ data: [], total: 0 })
    });
}

await page.route('**/api/products*', mockWithHeaders);

// Mock de error
async function mockError(route) {
    await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
    });
}

await page.route('**/api/save', mockError);</code></pre>
                </div>
            </div>
        </div>

        <h3>🚫 route.abort() — Cancelar request</h3>
        <div class="code-tabs" data-code-id="L065-6">
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
                <pre><code class="language-python"># Cancelar todas las imágenes (tests más rápidos)
page.route("**/*.{png,jpg,jpeg,gif,svg}", lambda route: route.abort())

# Cancelar tracking y analytics
page.route("**/analytics**", lambda route: route.abort())
page.route("**google-analytics**", lambda route: route.abort())

# Cancelar con razón específica
def abort_with_reason(route):
    route.abort("blockedbyclient")
    # Razones: "aborted", "accessdenied", "addressunreachable",
    # "blockedbyclient", "connectionaborted", "connectionclosed",
    # "failed", "internetdisconnected", "timedout"

page.route("**/slow-api/**", abort_with_reason)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Cancelar todas las imágenes (tests más rápidos)
await page.route('**/*.{png,jpg,jpeg,gif,svg}', route => route.abort());

// Cancelar tracking y analytics
await page.route('**/analytics**', route => route.abort());
await page.route('**google-analytics**', route => route.abort());

// Cancelar con razón específica
async function abortWithReason(route) {
    await route.abort('blockedbyclient');
    // Razones: 'aborted', 'accessdenied', 'addressunreachable',
    // 'blockedbyclient', 'connectionaborted', 'connectionclosed',
    // 'failed', 'internetdisconnected', 'timedout'
}

await page.route('**/slow-api/**', abortWithReason);</code></pre>
            </div>
        </div>

        <h3>🔄 Ciclo de vida de la intercepción</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L065-7">
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
                    <pre><code class="language-text">Browser quiere hacer request
         │
         ▼
¿Hay un route registrado que coincida?
         │
    ┌────┴────┐
    No        Sí
    │         │
    ▼         ▼
 Request   Ejecutar handler
 normal    │
           ├─ continue_() → Request va al servidor
           ├─ fulfill()   → Respuesta mock (sin servidor)
           └─ abort()     → Request cancelada</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <div class="code-note info">
                        <span class="code-note-icon">ℹ️</span>
                        <span class="code-note-text">El flujo de intercepción es idéntico en Python y TypeScript. Los métodos son: route.continue(), route.fulfill(), route.abort()</span>
                    </div>
                    <pre><code class="language-text">Browser quiere hacer request
         │
         ▼
¿Hay un route registrado que coincida?
         │
    ┌────┴────┐
    No        Sí
    │         │
    ▼         ▼
 Request   Ejecutar handler
 normal    │
           ├─ continue_() → Request va al servidor
           ├─ fulfill()   → Respuesta mock (sin servidor)
           └─ abort()     → Request cancelada</code></pre>
                </div>
            </div>
        </div>

        <h3>🧪 Ejemplo completo: Test con mock de API</h3>
        <div class="code-tabs" data-code-id="L065-8">
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
                <pre><code class="language-python">from playwright.sync_api import sync_playwright, expect
import json

def test_dashboard_con_datos_mock(page):
    """Test aislado del backend usando mocks."""

    # Mockear la API de estadísticas
    page.route("**/api/stats", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body=json.dumps({
            "ventas": 150000,
            "usuarios": 42,
            "tareas_pendientes": 7
        })
    ))

    # Mockear la API de tareas recientes
    page.route("**/api/tasks/recent", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body=json.dumps([
            {"id": 1, "titulo": "Revisar PR", "estado": "pendiente"},
            {"id": 2, "titulo": "Deploy staging", "estado": "completada"},
        ])
    ))

    page.goto("https://mi-app.com/dashboard")

    # Verificar que la UI muestra los datos mock
    expect(page.locator("#ventas-total")).to_have_text("$150,000")
    expect(page.locator("#usuarios-activos")).to_have_text("42")
    expect(page.locator("#tareas-pendientes")).to_have_text("7")
    expect(page.locator(".task-item")).to_have_count(2)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('dashboard con datos mock', async ({ page }) => {
    /** Test aislado del backend usando mocks. */

    // Mockear la API de estadísticas
    await page.route('**/api/stats', route => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
            ventas: 150000,
            usuarios: 42,
            tareas_pendientes: 7
        })
    }));

    // Mockear la API de tareas recientes
    await page.route('**/api/tasks/recent', route => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
            { id: 1, titulo: 'Revisar PR', estado: 'pendiente' },
            { id: 2, titulo: 'Deploy staging', estado: 'completada' },
        ])
    }));

    await page.goto('https://mi-app.com/dashboard');

    // Verificar que la UI muestra los datos mock
    await expect(page.locator('#ventas-total')).toHaveText('$150,000');
    await expect(page.locator('#usuarios-activos')).toHaveText('42');
    await expect(page.locator('#tareas-pendientes')).toHaveText('7');
    await expect(page.locator('.task-item')).toHaveCount(2);
});</code></pre>
            </div>
        </div>

        <h3>🧹 Remover routes</h3>
        <div class="code-tabs" data-code-id="L065-9">
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
                <pre><code class="language-python"># Remover un route específico
def my_handler(route):
    route.fulfill(status=200, body="mock")

page.route("**/api/data", my_handler)
# ... usar el mock ...

# Remover cuando ya no se necesite
page.unroute("**/api/data", my_handler)

# Remover TODOS los handlers de un patrón
page.unroute("**/api/data")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Remover un route específico
async function myHandler(route) {
    await route.fulfill({ status: 200, body: 'mock' });
}

await page.route('**/api/data', myHandler);
// ... usar el mock ...

// Remover cuando ya no se necesite
await page.unroute('**/api/data', myHandler);

// Remover TODOS los handlers de un patrón
await page.unroute('**/api/data');</code></pre>
            </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip:</strong> Los routes se evalúan en orden inverso al que fueron
            registrados (LIFO). El último route registrado que coincida con la URL se ejecuta
            primero. Si llamas <code>continue_()</code>, pasa al siguiente handler.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Escribe un test que:</p>
            <ol>
                <li>Intercepte <code>**/api/products</code> y devuelva 3 productos mock</li>
                <li>Intercepte <code>**/api/cart</code> y devuelva un carrito vacío</li>
                <li>Bloquee todas las imágenes (<code>*.png, *.jpg</code>)</li>
                <li>Navegue a la página y verifique que muestra los 3 productos</li>
            </ol>
        </div>
    `,
    topics: ["network", "intercepción", "fundamentos"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 8,
    difficulty: "medium",
    type: "foundation"
};

if (typeof window !== 'undefined') {
    window.LESSON_065 = LESSON_065;
}
