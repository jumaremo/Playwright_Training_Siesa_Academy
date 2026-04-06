/**
 * Playwright Academy - Lección 069
 * Captura y validación de network traffic
 * Sección 9: Network Interception y Mocking
 */

const LESSON_069 = {
    id: 69,
    title: "Captura y validación de network traffic",
    duration: "7 min",
    level: "intermediate",
    section: "section-09",
    content: `
        <h2>📡 Captura y validación de network traffic</h2>
        <p>Capturar y validar el tráfico de red permite verificar que la aplicación
        <strong>envía las requests correctas</strong> y <strong>maneja las responses
        adecuadamente</strong>. Esto es esencial para tests de integración y para
        detectar requests innecesarias o datos incorrectos.</p>

        <h3>📋 Capturar requests con page.on("request")</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python"># Capturar todas las requests en una lista
captured_requests = []

def capture_request(request):
    captured_requests.append({
        "method": request.method,
        "url": request.url,
        "headers": dict(request.headers),
        "post_data": request.post_data,
        "resource_type": request.resource_type,
    })

page.on("request", capture_request)

# Realizar acciones en la UI
page.goto("https://mi-app.com/dashboard")
page.click("#refresh-data")

# Analizar las requests capturadas
api_requests = [r for r in captured_requests if "/api/" in r["url"]]
print(f"Total requests: {len(captured_requests)}")
print(f"API requests: {len(api_requests)}")

for req in api_requests:
    print(f"  {req['method']} {req['url']}")</code></pre>
        </div>

        <h3>📋 Capturar responses con page.on("response")</h3>
        <pre><code class="python"># Capturar respuestas incluyendo status y timing
captured_responses = []

def capture_response(response):
    captured_responses.append({
        "status": response.status,
        "url": response.url,
        "ok": response.ok,
        "headers": dict(response.headers),
    })

page.on("response", capture_response)

page.goto("https://mi-app.com/products")

# Verificar que no hubo errores
failed = [r for r in captured_responses if not r["ok"]]
if failed:
    for r in failed:
        print(f"ERROR: {r['status']} {r['url']}")

assert len(failed) == 0, f"Hubo {len(failed)} requests fallidas"</code></pre>

        <h3>🎯 Captura selectiva con expect_request/expect_response</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python"># Capturar UNA request específica

# Esperar y capturar la request de login
with page.expect_request("**/api/auth/login") as req_info:
    page.fill("#email", "juan@test.com")
    page.fill("#password", "clave123")
    page.click("#login-btn")

login_request = req_info.value
body = login_request.post_data_json
assert body["email"] == "juan@test.com"
assert "password" in body

# Esperar y capturar la response
with page.expect_response("**/api/auth/login") as resp_info:
    page.fill("#email", "juan@test.com")
    page.fill("#password", "clave123")
    page.click("#login-btn")

login_response = resp_info.value
assert login_response.status == 200
data = login_response.json()
assert "token" in data</code></pre>
        </div>

        <h3>🧪 Test: Verificar requests enviadas por un formulario</h3>
        <pre><code class="python">import json

def test_formulario_envia_datos_completos(page):
    """Verificar que el formulario envía todos los campos requeridos."""

    with page.expect_request("**/api/users") as req_info:
        page.goto("https://mi-app.com/users/new")
        page.fill("[name='nombre']", "Juan Reina")
        page.fill("[name='email']", "juan@siesa.com")
        page.fill("[name='telefono']", "3001234567")
        page.select_option("[name='rol']", label="Admin")
        page.check("[name='activo']")
        page.click("#guardar")

    request = req_info.value

    # Verificar método
    assert request.method == "POST"

    # Verificar body
    body = request.post_data_json
    assert body["nombre"] == "Juan Reina"
    assert body["email"] == "juan@siesa.com"
    assert body["telefono"] == "3001234567"
    assert body["rol"] == "admin"
    assert body["activo"] is True

    # Verificar headers
    assert "application/json" in request.headers.get("content-type", "")
    assert "Authorization" in request.headers</code></pre>

        <h3>📊 Verificar rendimiento de red</h3>
        <pre><code class="python">import time

def test_pagina_no_hace_requests_excesivas(page):
    """Verificar que la página no hace demasiadas requests."""
    request_count = {"total": 0, "api": 0, "images": 0}

    def count_requests(request):
        request_count["total"] += 1
        if "/api/" in request.url:
            request_count["api"] += 1
        if request.resource_type == "image":
            request_count["images"] += 1

    page.on("request", count_requests)
    page.goto("https://mi-app.com/dashboard")

    # Límites razonables
    assert request_count["api"] <= 10, (
        f"Demasiadas API calls: {request_count['api']}"
    )
    assert request_count["total"] <= 50, (
        f"Demasiadas requests totales: {request_count['total']}"
    )

def test_no_hay_requests_a_dominios_bloqueados(page):
    """Verificar que no se envían datos a trackers no autorizados."""
    blocked_domains = [
        "facebook.com", "doubleclick.net",
        "advertising.com", "tracker.com",
    ]
    violations = []

    def check_domain(request):
        for domain in blocked_domains:
            if domain in request.url:
                violations.append(request.url)

    page.on("request", check_domain)
    page.goto("https://mi-app.com")

    assert len(violations) == 0, (
        f"Requests a dominios bloqueados: {violations}"
    )</code></pre>

        <h3>🔍 HAR: Captura completa de tráfico</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Playwright puede grabar todo el tráfico en formato <strong>HAR</strong>
            (HTTP Archive), que se puede analizar con herramientas externas.</p>
            <pre><code class="python"># ── Grabar HAR ──
context = browser.new_context(
    record_har_path="network-log.har",
    record_har_url_filter="**/api/**"  # Solo APIs (opcional)
)
page = context.new_page()
page.goto("https://mi-app.com")
# ... interacciones ...
context.close()  # El HAR se guarda al cerrar

# ── Usar HAR como fuente de mocks ──
# Playwright puede reproducir un HAR grabado como mock
context = browser.new_context()
page = context.new_page()

# Usar las respuestas grabadas en el HAR
page.route_from_har("network-log.har", not_found="fallback")
# "fallback" = si no está en el HAR, hacer request real
# "abort" = si no está en el HAR, cancelar

page.goto("https://mi-app.com")
# Las responses vienen del HAR, no del servidor real

# ── Actualizar HAR ──
page.route_from_har(
    "network-log.har",
    not_found="fallback",
    update=True  # Actualizar el HAR con responses nuevas
)</code></pre>
        </div>

        <h3>🧪 Ejemplo: Validar flujo completo de red</h3>
        <pre><code class="python">def test_flujo_compra_requests_correctas(page):
    """Validar todas las API calls durante un flujo de compra."""
    api_log = []

    def log_api(request):
        if "/api/" in request.url:
            api_log.append({
                "method": request.method,
                "path": request.url.split("/api/")[1].split("?")[0],
                "body": request.post_data_json if request.post_data else None,
            })

    page.on("request", log_api)

    # Ejecutar flujo de compra
    page.goto("https://mi-app.com/products")
    page.click(".product-card:first-child .add-to-cart")
    page.click("#go-to-checkout")
    page.fill("#name", "Juan")
    page.fill("#email", "juan@test.com")
    page.click("#place-order")

    # Verificar secuencia de API calls
    api_paths = [r["path"] for r in api_log]

    assert "products" in api_paths, "Debe cargar productos"
    assert "cart" in api_paths or "cart/add" in api_paths, "Debe agregar al carrito"
    assert "orders" in api_paths, "Debe crear el pedido"

    # Verificar que el pedido tiene los datos correctos
    order_request = next(r for r in api_log if r["path"] == "orders")
    assert order_request["method"] == "POST"
    assert order_request["body"]["email"] == "juan@test.com"</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip:</strong> La captura de tráfico es especialmente útil para
            detectar <strong>requests duplicadas</strong>, <strong>race conditions</strong>
            en APIs y <strong>fugas de datos</strong> a servicios no autorizados.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Crea un test que:</p>
            <ol>
                <li>Capture todo el tráfico de red al navegar a una página</li>
                <li>Verifique que no hay requests con status 4xx o 5xx</li>
                <li>Verifique que no se envían requests a dominios de terceros no autorizados</li>
                <li>Cuente las API calls y verifique que no superen un límite</li>
                <li>Grabe el tráfico en un archivo HAR para análisis posterior</li>
            </ol>
        </div>
    `,
    topics: ["captura", "validación", "traffic"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_069 = LESSON_069;
}
