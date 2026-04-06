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
        <pre><code class="python">from playwright.sync_api import sync_playwright

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

        <h3>🔧 page.route() — El método fundamental</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><code>page.route()</code> registra un handler que se ejecuta cada vez que
            una request coincide con el patrón. Desde el handler puedes:</p>
            <ul>
                <li><strong>Continuar:</strong> dejar pasar la request al servidor</li>
                <li><strong>Fulfil:</strong> responder sin llegar al servidor (mock)</li>
                <li><strong>Abort:</strong> cancelar la request</li>
            </ul>
            <pre><code class="python"># Anatomía de page.route()
page.route(
    url_pattern,     # String, glob o regex
    handler_function # Función que recibe el objeto Route
)

# El handler recibe un objeto Route con 3 métodos principales:
# route.continue_()  → Dejar pasar la request
# route.fulfill()    → Responder con datos mock
# route.abort()      → Cancelar la request</code></pre>
        </div>

        <h3>📌 Patrones de URL</h3>
        <pre><code class="python"># ── Glob pattern (el más usado) ──
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

        <h3>✅ route.continue_() — Dejar pasar (con modificaciones opcionales)</h3>
        <pre><code class="python"># Dejar pasar sin cambios (útil para logging)
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

        <h3>🎭 route.fulfill() — Responder con mock</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python">import json

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

        <h3>🚫 route.abort() — Cancelar request</h3>
        <pre><code class="python"># Cancelar todas las imágenes (tests más rápidos)
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

        <h3>🔄 Ciclo de vida de la intercepción</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="text">Browser quiere hacer request
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

        <h3>🧪 Ejemplo completo: Test con mock de API</h3>
        <pre><code class="python">from playwright.sync_api import sync_playwright, expect
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

        <h3>🧹 Remover routes</h3>
        <pre><code class="python"># Remover un route específico
def my_handler(route):
    route.fulfill(status=200, body="mock")

page.route("**/api/data", my_handler)
# ... usar el mock ...

# Remover cuando ya no se necesite
page.unroute("**/api/data", my_handler)

# Remover TODOS los handlers de un patrón
page.unroute("**/api/data")</code></pre>

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
