/**
 * Playwright Academy - Lección 063
 * Esperando eventos y navegaciones
 * Sección 8: Auto-waiting y Actionability
 */

const LESSON_063 = {
    id: 63,
    title: "Esperando eventos y navegaciones",
    duration: "7 min",
    level: "intermediate",
    section: "section-08",
    content: `
        <h2>📡 Esperando eventos y navegaciones</h2>
        <p>Playwright ofrece métodos avanzados para esperar <strong>eventos específicos</strong>
        que ocurren de forma asíncrona: respuestas de red, descargas, popups, diálogos
        y navegaciones. Estos son esenciales para tests E2E complejos.</p>

        <h3>📡 Esperar respuestas de red (API calls)</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python"># expect_response() — esperar una respuesta HTTP específica

# Ejemplo: esperar que la búsqueda termine (respuesta de API)
with page.expect_response("**/api/search*") as response_info:
    page.fill("#search", "laptop")
    page.click("#search-btn")

response = response_info.value
print(f"Status: {response.status}")     # 200
print(f"URL: {response.url}")           # https://api.com/search?q=laptop

# Ahora los resultados están cargados, podemos verificar
assert page.locator(".result").count() > 0

# ── Con filtro por método HTTP ──
with page.expect_response(
    lambda r: "/api/products" in r.url and r.request.method == "POST"
) as response_info:
    page.click("#create-product-btn")

response = response_info.value
data = response.json()
print(f"Producto creado: {data['id']}")

# ── Esperar múltiples respuestas ──
with page.expect_response("**/api/users") as users_resp, \\
     page.expect_response("**/api/stats") as stats_resp:
    page.goto("https://mi-app.com/dashboard")

print(f"Users: {users_resp.value.status}")
print(f"Stats: {stats_resp.value.status}")</code></pre>
        </div>

        <h3>📨 Esperar requests (antes de que se envíen)</h3>
        <pre><code class="python"># expect_request() — esperar que una request se envíe

with page.expect_request("**/api/analytics") as request_info:
    page.click("#track-btn")

request = request_info.value
print(f"Method: {request.method}")        # POST
print(f"URL: {request.url}")
print(f"Body: {request.post_data}")       # Datos enviados

# Útil para verificar que la app envía los datos correctos
# sin importar la respuesta del servidor</code></pre>

        <h3>🔄 Esperar navegaciones</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python"># expect_navigation() — esperar cambio de página

# Esperar navegación después de click en link
with page.expect_navigation() as nav_info:
    page.click("a.go-to-profile")

response = nav_info.value
print(f"Navegó a: {page.url}")
print(f"Status: {response.status}")

# ── Con filtro de URL ──
with page.expect_navigation(url="**/checkout") as nav_info:
    page.click("#proceed-to-checkout")

# ── Esperar navegación con estado de carga específico ──
with page.expect_navigation(
    wait_until="networkidle"
) as nav_info:
    page.click("#load-heavy-page")
# La página completa (incluyendo AJAX) ha cargado

# ── Alternativa más simple: wait_for_url ──
page.click("#go-dashboard")
page.wait_for_url("**/dashboard")  # Más conciso para casos simples</code></pre>
        </div>

        <h3>🪟 Esperar popups (ventanas nuevas)</h3>
        <pre><code class="python"># expect_popup() — capturar ventanas/pestañas nuevas

# Escenario: link con target="_blank" abre nueva pestaña
with page.expect_popup() as popup_info:
    page.click("a[target='_blank']")

popup = popup_info.value  # Es un objeto Page completo
popup.wait_for_load_state()
print(f"Popup URL: {popup.url}")
print(f"Popup título: {popup.title()}")

# Interactuar con la nueva ventana
popup.fill("#form-field", "datos")
popup.click("#submit")

# Cerrar el popup y volver a la página principal
popup.close()

# ── Ejemplo: OAuth login en popup ──
with page.expect_popup() as popup_info:
    page.click("#login-with-google")

google_popup = popup_info.value
google_popup.fill("#email", "test@gmail.com")
google_popup.click("#next")
google_popup.fill("#password", "password123")
google_popup.click("#sign-in")
# El popup se cierra automáticamente después del OAuth
# La página principal ahora está autenticada
expect(page.locator(".user-menu")).to_be_visible()</code></pre>

        <h3>💬 Esperar diálogos (alert, confirm, prompt)</h3>
        <pre><code class="python"># expect_dialog() — manejar diálogos nativos del browser

# ── Alert ──
page.on("dialog", lambda dialog: dialog.accept())
page.click("#show-alert")
# El alert se acepta automáticamente

# ── Confirm — aceptar ──
page.on("dialog", lambda dialog: dialog.accept())
page.click("#delete-item")
# El confirm retorna True → item eliminado

# ── Confirm — rechazar ──
page.on("dialog", lambda dialog: dialog.dismiss())
page.click("#delete-item")
# El confirm retorna False → item no eliminado

# ── Prompt — enviar texto ──
page.on("dialog", lambda dialog: dialog.accept("Mi respuesta"))
page.click("#ask-name")
# El prompt retorna "Mi respuesta"

# ── Verificar mensaje del diálogo ──
def handle_dialog(dialog):
    assert dialog.message == "¿Estás seguro de eliminar?"
    assert dialog.type == "confirm"
    dialog.accept()

page.on("dialog", handle_dialog)
page.click("#delete-btn")

# ── Usar once() para un solo diálogo ──
page.once("dialog", lambda d: d.accept())
page.click("#one-time-alert")</code></pre>

        <h3>📥 Esperar descargas</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python"># expect_download() — capturar archivos descargados

with page.expect_download() as download_info:
    page.click("#download-report")

download = download_info.value
print(f"Archivo: {download.suggested_filename}")  # "reporte.pdf"
print(f"URL: {download.url}")

# Guardar el archivo
download.save_as(f"downloads/{download.suggested_filename}")

# Obtener la ruta temporal
temp_path = download.path()
print(f"Temporal: {temp_path}")

# ── Verificar contenido del archivo descargado ──
import csv

with page.expect_download() as download_info:
    page.click("#export-csv")

download = download_info.value
download.save_as("temp/export.csv")

with open("temp/export.csv", "r") as f:
    reader = csv.reader(f)
    rows = list(reader)
    assert len(rows) > 1  # Header + datos
    assert rows[0][0] == "Nombre"  # Verificar header</code></pre>
        </div>

        <h3>📁 Esperar File Chooser (upload)</h3>
        <pre><code class="python"># expect_file_chooser() — manejar diálogo de selección de archivo

with page.expect_file_chooser() as fc_info:
    page.click("#upload-btn")

file_chooser = fc_info.value
file_chooser.set_files("test-data/documento.pdf")

# Verificar que se subió correctamente
expect(page.locator(".upload-status")).to_have_text("Subido exitosamente")

# ── Subir múltiples archivos ──
with page.expect_file_chooser() as fc_info:
    page.click("#upload-multiple")

file_chooser = fc_info.value
file_chooser.set_files([
    "test-data/imagen1.png",
    "test-data/imagen2.png",
    "test-data/imagen3.png"
])

# ── Alternativa sin expect_file_chooser ──
# Si el input[type=file] está en el DOM:
page.set_input_files("#file-input", "test-data/documento.pdf")</code></pre>

        <h3>🧪 Ejemplo completo: Flujo E2E con múltiples esperas</h3>
        <pre><code class="python">from playwright.sync_api import sync_playwright, expect

def test_flujo_reporte_completo(page):
    """Test E2E: generar reporte, verificar datos, descargar."""

    page.goto("https://mi-app.com/reports")

    # 1. Seleccionar parámetros del reporte
    page.select_option("#report-type", label="Ventas mensual")
    page.fill("#date-from", "2026-01-01")
    page.fill("#date-to", "2026-03-31")

    # 2. Generar reporte — esperar respuesta de API
    with page.expect_response("**/api/reports/generate") as resp:
        page.click("#generate-btn")

    assert resp.value.status == 200

    # 3. Esperar que el spinner desaparezca y la tabla cargue
    expect(page.locator(".report-spinner")).to_be_hidden()
    expect(page.locator(".report-table tbody tr")).not_to_have_count(0)

    # 4. Verificar datos del reporte
    total = page.locator("[data-testid='grand-total']").text_content()
    assert float(total.replace("$", "").replace(",", "")) > 0

    # 5. Descargar como PDF
    with page.expect_download() as download:
        page.click("#download-pdf")

    assert download.value.suggested_filename.endswith(".pdf")
    download.value.save_as("evidence/reporte_ventas.pdf")

    # 6. Compartir por email — esperar diálogo
    page.once("dialog", lambda d: d.accept())
    with page.expect_response("**/api/email/send") as email_resp:
        page.click("#share-email")

    assert email_resp.value.status == 200</code></pre>

        <h3>📋 Resumen de métodos expect_*</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <thead>
                <tr style="background: #1565c0; color: white;">
                    <th style="padding: 10px;">Método</th>
                    <th style="padding: 10px;">Espera</th>
                    <th style="padding: 10px;">Retorna</th>
                </tr>
            </thead>
            <tbody>
                <tr style="background: #e3f2fd;">
                    <td style="padding: 8px;"><code>expect_response()</code></td>
                    <td style="padding: 8px;">Respuesta HTTP</td>
                    <td style="padding: 8px;">Response object</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><code>expect_request()</code></td>
                    <td style="padding: 8px;">Request HTTP</td>
                    <td style="padding: 8px;">Request object</td>
                </tr>
                <tr style="background: #e3f2fd;">
                    <td style="padding: 8px;"><code>expect_navigation()</code></td>
                    <td style="padding: 8px;">Cambio de página</td>
                    <td style="padding: 8px;">Response object</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><code>expect_popup()</code></td>
                    <td style="padding: 8px;">Nueva ventana/tab</td>
                    <td style="padding: 8px;">Page object</td>
                </tr>
                <tr style="background: #e3f2fd;">
                    <td style="padding: 8px;"><code>expect_download()</code></td>
                    <td style="padding: 8px;">Descarga de archivo</td>
                    <td style="padding: 8px;">Download object</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><code>expect_file_chooser()</code></td>
                    <td style="padding: 8px;">Diálogo de archivos</td>
                    <td style="padding: 8px;">FileChooser object</td>
                </tr>
            </tbody>
        </table>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip:</strong> Todos los métodos <code>expect_*</code> usan el patrón
            <code>with ... as info:</code>. La acción que dispara el evento debe ir
            <strong>dentro</strong> del bloque <code>with</code>. El resultado está en
            <code>info.value</code>.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Escribe un test que:</p>
            <ol>
                <li>Navegue a una página de productos</li>
                <li>Haga clic en "Exportar CSV" y capture la descarga</li>
                <li>Verifique que el archivo tiene extensión <code>.csv</code></li>
                <li>Haga clic en "Ver en nueva pestaña" para un producto y capture el popup</li>
                <li>En el popup, verifique que el título contiene el nombre del producto</li>
                <li>Cierre el popup</li>
            </ol>
        </div>
    `,
    topics: ["eventos", "navegación", "esperas"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_063 = LESSON_063;
}
