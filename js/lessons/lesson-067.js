/**
 * Playwright Academy - Lección 067
 * Modificar requests en vuelo
 * Sección 9: Network Interception y Mocking
 */

const LESSON_067 = {
    id: 67,
    title: "Modificar requests en vuelo",
    duration: "7 min",
    level: "intermediate",
    section: "section-09",
    content: `
        <h2>✈️ Modificar requests en vuelo</h2>
        <p>Además de mockear respuestas completas, Playwright permite <strong>modificar
        las requests antes de que lleguen al servidor</strong> y <strong>modificar las
        respuestas antes de que lleguen al navegador</strong>. Esto es poderoso para
        testing de edge cases sin cambiar el backend.</p>

        <h3>📤 Modificar headers de la request</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python"># Agregar/modificar headers antes de que la request llegue al servidor

def add_custom_headers(route):
    """Agregar headers de autenticación y tracking."""
    headers = {
        **route.request.headers,
        "Authorization": "Bearer test-token-abc123",
        "X-Test-ID": "e2e-test-001",
        "X-Environment": "testing",
        "Accept-Language": "es-CO",
    }
    route.continue_(headers=headers)

page.route("**/api/**", add_custom_headers)

# ── Ejemplo: Forzar un idioma específico ──
def force_spanish(route):
    headers = {**route.request.headers, "Accept-Language": "es-CO"}
    route.continue_(headers=headers)

page.route("**/*", force_spanish)

# ── Ejemplo: Simular un user-agent móvil ──
def mobile_ua(route):
    headers = {
        **route.request.headers,
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)"
    }
    route.continue_(headers=headers)

page.route("**/*", mobile_ua)</code></pre>
        </div>

        <h3>📤 Modificar el body de la request (POST data)</h3>
        <pre><code class="python">import json

# Interceptar y modificar datos enviados en POST/PUT

def inject_test_data(route):
    """Agregar campo extra al body del POST."""
    if route.request.method == "POST":
        original_body = json.loads(route.request.post_data or "{}")
        # Agregar un campo que identifica datos de test
        original_body["_test_marker"] = "playwright-e2e"
        original_body["_timestamp"] = "2026-04-03T10:00:00"
        route.continue_(post_data=json.dumps(original_body))
    else:
        route.continue_()

page.route("**/api/orders", inject_test_data)

# ── Ejemplo: Forzar un valor específico ──
def force_quantity(route):
    """Siempre enviar quantity=1 sin importar lo que puso el usuario."""
    if route.request.method == "POST":
        body = json.loads(route.request.post_data or "{}")
        body["quantity"] = 1  # Forzar cantidad
        route.continue_(post_data=json.dumps(body))
    else:
        route.continue_()

page.route("**/api/cart/add", force_quantity)</code></pre>

        <h3>📥 Modificar la respuesta del servidor</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Con <code>route.fetch()</code> puedes dejar que la request llegue al servidor
            real, obtener la respuesta, modificarla y luego entregarla al navegador:</p>
            <pre><code class="python"># Patrón: fetch real → modificar → entregar
def modify_response(route):
    """Obtener respuesta real y modificarla."""
    # 1. Hacer la request al servidor real
    response = route.fetch()

    # 2. Obtener el body original
    original_body = response.json()

    # 3. Modificar los datos
    for user in original_body.get("users", []):
        user["email"] = "***@***.com"  # Ocultar emails reales

    # 4. Entregar la respuesta modificada
    route.fulfill(
        status=response.status,
        headers=response.headers,
        body=json.dumps(original_body)
    )

page.route("**/api/users", modify_response)</code></pre>
        </div>

        <h3>🔄 Ejemplo: Inyectar datos en respuesta real</h3>
        <pre><code class="python">def add_test_product(route):
    """Agregar un producto de test a la respuesta real."""
    response = route.fetch()
    data = response.json()

    # Agregar un producto de test al final de la lista
    test_product = {
        "id": 99999,
        "name": "Producto Test E2E",
        "price": 12345,
        "category": "Testing"
    }
    data["products"].append(test_product)
    data["total"] += 1

    route.fulfill(
        status=response.status,
        headers=response.headers,
        body=json.dumps(data)
    )

page.route("**/api/products", add_test_product)

# El test puede buscar el producto inyectado
page.goto("https://mi-app.com/products")
expect(page.locator(".product-card").filter(
    has_text="Producto Test E2E"
)).to_be_visible()</code></pre>

        <h3>🔀 Redirigir requests a otro servidor</h3>
        <pre><code class="python"># Redirigir del servidor de producción al de staging

def redirect_to_staging(route):
    """Redirigir requests de prod a staging."""
    original_url = route.request.url
    staging_url = original_url.replace(
        "api.produccion.com",
        "api.staging.com"
    )
    route.continue_(url=staging_url)

page.route("**/api.produccion.com/**", redirect_to_staging)

# ── Redirigir a mock server local ──
def redirect_to_local(route):
    """Redirigir API calls a un servidor mock local."""
    path = route.request.url.split("/api/")[1]
    local_url = f"http://localhost:3001/api/{path}"
    route.continue_(url=local_url)

page.route("**/api/**", redirect_to_local)</code></pre>

        <h3>⏱️ Simular latencia de red</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python">import time

# Agregar delay a las respuestas para simular red lenta
def slow_response(route):
    """Simular latencia de 2 segundos."""
    time.sleep(2)  # Delay antes de responder
    route.continue_()

page.route("**/api/search**", slow_response)

# ── Test: Verificar que la UI muestra spinner durante la espera ──
def test_spinner_durante_carga(page):
    def slow_api(route):
        time.sleep(3)
        route.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps({"results": []})
        )

    page.route("**/api/search**", slow_api)
    page.goto("https://mi-app.com/search")
    page.fill("#query", "test")
    page.click("#search-btn")

    # Verificar que el spinner aparece durante la carga
    expect(page.locator(".loading-spinner")).to_be_visible()

    # Esperar a que termine y el spinner desaparezca
    expect(page.locator(".loading-spinner")).to_be_hidden(timeout=10000)

# ── Simular diferentes velocidades de red ──
def simulate_3g(route):
    """Simular conexión 3G (~400ms de latencia)."""
    time.sleep(0.4)
    route.continue_()

def simulate_slow_3g(route):
    """Simular 3G lento (~2s de latencia)."""
    time.sleep(2)
    route.continue_()</code></pre>
        </div>

        <h3>🧪 Ejemplo: Interceptar y validar request body</h3>
        <pre><code class="python">def test_formulario_envia_datos_correctos(page):
    """Verificar que el formulario envía los datos esperados."""
    captured_request = {}

    def capture_and_respond(route):
        """Capturar el body del POST y responder con mock."""
        captured_request["body"] = json.loads(
            route.request.post_data or "{}"
        )
        captured_request["headers"] = dict(route.request.headers)
        route.fulfill(
            status=201,
            content_type="application/json",
            body=json.dumps({"id": 1, "status": "created"})
        )

    page.route("**/api/users", capture_and_respond)

    page.goto("https://mi-app.com/users/new")
    page.fill("#nombre", "Juan Reina")
    page.fill("#email", "juan@siesa.com")
    page.select_option("#rol", label="Admin")
    page.click("#guardar-btn")

    # Verificar que se envió correctamente
    expect(page.locator(".toast-success")).to_be_visible()

    # Verificar el body capturado
    assert captured_request["body"]["nombre"] == "Juan Reina"
    assert captured_request["body"]["email"] == "juan@siesa.com"
    assert captured_request["body"]["rol"] == "admin"
    assert "Content-Type" in captured_request["headers"]</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip:</strong> El patrón de "capturar request + mockear response" es
            muy poderoso. Permite verificar simultáneamente que la UI envía los datos correctos
            Y que maneja la respuesta correctamente — todo en un solo test.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Implementa los siguientes escenarios:</p>
            <ol>
                <li>Intercepta un POST a <code>/api/orders</code>, captura el body,
                verifica que tiene los campos requeridos y responde con 201</li>
                <li>Usa <code>route.fetch()</code> para obtener una respuesta real de
                una API pública y agrega un campo extra antes de entregarla</li>
                <li>Simula una respuesta lenta de 5 segundos y verifica que la UI
                muestra un mensaje de "cargando"</li>
            </ol>
        </div>
    `,
    topics: ["requests", "modificar", "intercepción"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_067 = LESSON_067;
}
