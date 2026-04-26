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
            <div class="code-tabs" data-code-id="L063-1">
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
                <pre><code class="language-python"># expect_response() — esperar una respuesta HTTP específica

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
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// waitForResponse() — esperar una respuesta HTTP específica

// Ejemplo: esperar que la búsqueda termine (respuesta de API)
const [searchResp] = await Promise.all([
    page.waitForResponse('**/api/search*'),
    (async () => {
        await page.fill('#search', 'laptop');
        await page.click('#search-btn');
    })()
]);

console.log('Status:', searchResp.status());   // 200
console.log('URL:', searchResp.url());         // https://api.com/search?q=laptop

// Ahora los resultados están cargados, podemos verificar
await expect(page.locator('.result')).not.toHaveCount(0);

// ── Con filtro por método HTTP ──
const [productResp] = await Promise.all([
    page.waitForResponse(
        resp => resp.url().includes('/api/products') && resp.request().method() === 'POST'
    ),
    page.click('#create-product-btn')
]);

const data = await productResp.json();
console.log('Producto creado:', data.id);

// ── Esperar múltiples respuestas ──
const [usersResp, statsResp] = await Promise.all([
    page.waitForResponse('**/api/users'),
    page.waitForResponse('**/api/stats'),
    page.goto('https://mi-app.com/dashboard')
]);

console.log('Users:', usersResp.status());
console.log('Stats:', statsResp.status());</code></pre>
            </div>
            </div>
        </div>

        <h3>📨 Esperar requests (antes de que se envíen)</h3>
        <div class="code-tabs" data-code-id="L063-2">
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
            <pre><code class="language-python"># expect_request() — esperar que una request se envíe

with page.expect_request("**/api/analytics") as request_info:
    page.click("#track-btn")

request = request_info.value
print(f"Method: {request.method}")        # POST
print(f"URL: {request.url}")
print(f"Body: {request.post_data}")       # Datos enviados

# Útil para verificar que la app envía los datos correctos
# sin importar la respuesta del servidor</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// waitForRequest() — esperar que una request se envíe

const [request] = await Promise.all([
    page.waitForRequest('**/api/analytics'),
    page.click('#track-btn')
]);

console.log('Method:', request.method());     // POST
console.log('URL:', request.url());
console.log('Body:', request.postData());     // Datos enviados

// Útil para verificar que la app envía los datos correctos
// sin importar la respuesta del servidor</code></pre>
        </div>
        </div>

        <h3>🔄 Esperar navegaciones</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L063-3">
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
                <pre><code class="language-python"># expect_navigation() — esperar cambio de página

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
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// waitForNavigation() — esperar cambio de página

// Esperar navegación después de click en link
const [response] = await Promise.all([
    page.waitForNavigation(),
    page.click('a.go-to-profile')
]);

console.log('Navegó a:', page.url());
console.log('Status:', response?.status());

// ── Con filtro de URL ──
await Promise.all([
    page.waitForNavigation({ url: '**/checkout' }),
    page.click('#proceed-to-checkout')
]);

// ── Esperar navegación con estado de carga específico ──
await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('#load-heavy-page')
]);
// La página completa (incluyendo AJAX) ha cargado

// ── Alternativa más simple: waitForURL ──
await page.click('#go-dashboard');
await page.waitForURL('**/dashboard');  // Más conciso para casos simples</code></pre>
            </div>
            </div>
        </div>

        <h3>🪟 Esperar popups (ventanas nuevas)</h3>
        <div class="code-tabs" data-code-id="L063-4">
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
            <pre><code class="language-python"># expect_popup() — capturar ventanas/pestañas nuevas

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
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// waitForEvent('popup') — capturar ventanas/pestañas nuevas

// Escenario: link con target="_blank" abre nueva pestaña
const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.click("a[target='_blank']")
]);

await popup.waitForLoadState();
console.log('Popup URL:', popup.url());
console.log('Popup título:', await popup.title());

// Interactuar con la nueva ventana
await popup.fill('#form-field', 'datos');
await popup.click('#submit');

// Cerrar el popup y volver a la página principal
await popup.close();

// ── Ejemplo: OAuth login en popup ──
const [googlePopup] = await Promise.all([
    page.waitForEvent('popup'),
    page.click('#login-with-google')
]);

await googlePopup.fill('#email', 'test@gmail.com');
await googlePopup.click('#next');
await googlePopup.fill('#password', 'password123');
await googlePopup.click('#sign-in');
// El popup se cierra automáticamente después del OAuth
// La página principal ahora está autenticada
await expect(page.locator('.user-menu')).toBeVisible();</code></pre>
        </div>
        </div>

        <h3>💬 Esperar diálogos (alert, confirm, prompt)</h3>
        <div class="code-tabs" data-code-id="L063-5">
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
            <pre><code class="language-python"># expect_dialog() — manejar diálogos nativos del browser

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
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// Dialog handling — manejar diálogos nativos del browser

// ── Alert ──
page.on('dialog', dialog => dialog.accept());
await page.click('#show-alert');
// El alert se acepta automáticamente

// ── Confirm — aceptar ──
page.on('dialog', dialog => dialog.accept());
await page.click('#delete-item');
// El confirm retorna true → item eliminado

// ── Confirm — rechazar ──
page.on('dialog', dialog => dialog.dismiss());
await page.click('#delete-item');
// El confirm retorna false → item no eliminado

// ── Prompt — enviar texto ──
page.on('dialog', dialog => dialog.accept('Mi respuesta'));
await page.click('#ask-name');
// El prompt retorna "Mi respuesta"

// ── Verificar mensaje del diálogo ──
page.on('dialog', async (dialog) => {
    expect(dialog.message()).toBe('¿Estás seguro de eliminar?');
    expect(dialog.type()).toBe('confirm');
    await dialog.accept();
});
await page.click('#delete-btn');

// ── Usar once() para un solo diálogo ──
page.once('dialog', dialog => dialog.accept());
await page.click('#one-time-alert');</code></pre>
        </div>
        </div>

        <h3>📥 Esperar descargas</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L063-6">
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
                <pre><code class="language-python"># expect_download() — capturar archivos descargados

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
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// waitForEvent('download') — capturar archivos descargados
import fs from 'fs';

const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('#download-report')
]);

console.log('Archivo:', download.suggestedFilename());  // "reporte.pdf"
console.log('URL:', download.url());

// Guardar el archivo
await download.saveAs('downloads/' + download.suggestedFilename());

// Obtener la ruta temporal
const tempPath = await download.path();
console.log('Temporal:', tempPath);

// ── Verificar contenido del archivo descargado ──
const [csvDownload] = await Promise.all([
    page.waitForEvent('download'),
    page.click('#export-csv')
]);

await csvDownload.saveAs('temp/export.csv');

const csvContent = fs.readFileSync('temp/export.csv', 'utf-8');
const rows = csvContent.split('\\n').map(r => r.split(','));
expect(rows.length).toBeGreaterThan(1);    // Header + datos
expect(rows[0][0]).toBe('Nombre');         // Verificar header</code></pre>
            </div>
            </div>
        </div>

        <h3>📁 Esperar File Chooser (upload)</h3>
        <div class="code-tabs" data-code-id="L063-7">
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
            <pre><code class="language-python"># expect_file_chooser() — manejar diálogo de selección de archivo

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
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// waitForEvent('filechooser') — manejar diálogo de selección de archivo

const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.click('#upload-btn')
]);

await fileChooser.setFiles('test-data/documento.pdf');

// Verificar que se subió correctamente
await expect(page.locator('.upload-status')).toHaveText('Subido exitosamente');

// ── Subir múltiples archivos ──
const [multiChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.click('#upload-multiple')
]);

await multiChooser.setFiles([
    'test-data/imagen1.png',
    'test-data/imagen2.png',
    'test-data/imagen3.png'
]);

// ── Alternativa sin waitForEvent('filechooser') ──
// Si el input[type=file] está en el DOM:
await page.setInputFiles('#file-input', 'test-data/documento.pdf');</code></pre>
        </div>
        </div>

        <h3>🧪 Ejemplo completo: Flujo E2E con múltiples esperas</h3>
        <div class="code-tabs" data-code-id="L063-8">
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
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('flujo reporte completo', async ({ page }) => {
    // Test E2E: generar reporte, verificar datos, descargar.

    await page.goto('https://mi-app.com/reports');

    // 1. Seleccionar parámetros del reporte
    await page.selectOption('#report-type', { label: 'Ventas mensual' });
    await page.fill('#date-from', '2026-01-01');
    await page.fill('#date-to', '2026-03-31');

    // 2. Generar reporte — esperar respuesta de API
    const [resp] = await Promise.all([
        page.waitForResponse('**/api/reports/generate'),
        page.click('#generate-btn')
    ]);

    expect(resp.status()).toBe(200);

    // 3. Esperar que el spinner desaparezca y la tabla cargue
    await expect(page.locator('.report-spinner')).toBeHidden();
    await expect(page.locator('.report-table tbody tr')).not.toHaveCount(0);

    // 4. Verificar datos del reporte
    const total = await page.locator("[data-testid='grand-total']").textContent();
    expect(parseFloat(total!.replace('$', '').replace(',', ''))).toBeGreaterThan(0);

    // 5. Descargar como PDF
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.click('#download-pdf')
    ]);

    expect(download.suggestedFilename()).toMatch(/\\.pdf$/);
    await download.saveAs('evidence/reporte_ventas.pdf');

    // 6. Compartir por email — esperar diálogo
    page.once('dialog', dialog => dialog.accept());
    const [emailResp] = await Promise.all([
        page.waitForResponse('**/api/email/send'),
        page.click('#share-email')
    ]);

    expect(emailResp.status()).toBe(200);
});</code></pre>
        </div>
        </div>

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
