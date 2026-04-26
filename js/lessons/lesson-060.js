/**
 * Playwright Academy - Lección 060
 * Concepto de Auto-waiting en Playwright
 * Sección 8: Auto-waiting y Actionability
 */

const LESSON_060 = {
    id: 60,
    title: "Concepto de Auto-waiting en Playwright",
    duration: "8 min",
    level: "intermediate",
    section: "section-08",
    content: `
        <h2>⏳ Concepto de Auto-waiting en Playwright</h2>
        <p>Una de las características más poderosas de Playwright es su sistema de
        <strong>auto-waiting</strong>: la mayoría de acciones esperan automáticamente a que
        el elemento esté listo antes de interactuar. Esto elimina la causa #1 de tests
        inestables (flaky tests) en otras herramientas.</p>

        <h3>😰 El problema: Flaky tests por timing</h3>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>En Selenium y otras herramientas, los tests fallan intermitentemente porque
            la página no está lista cuando el script intenta interactuar:</p>
            <pre><code class="python"># ❌ Selenium — flaky por falta de esperas
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get("https://mi-app.com/dashboard")

# El botón puede no existir aún → ElementNotFoundException
driver.find_element(By.CSS_SELECTOR, ".load-data-btn").click()

# Los datos pueden no haber cargado → assertion falla
text = driver.find_element(By.CSS_SELECTOR, ".data-count").text
assert text == "50 registros"  # 💥 A veces pasa, a veces no</code></pre>

            <p>La "solución" típica son <code>sleep()</code> y esperas explícitas por todos lados:</p>
            <pre><code class="python"># ❌ Selenium — "solucionado" con sleeps (mala práctica)
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver.get("https://mi-app.com/dashboard")
time.sleep(2)  # ← Espera arbitraria, lento e inestable

WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.CSS_SELECTOR, ".load-data-btn"))
).click()

time.sleep(3)  # ← Otra espera arbitraria

WebDriverWait(driver, 10).until(
    EC.visibility_of_element_located((By.CSS_SELECTOR, ".data-count"))
)
text = driver.find_element(By.CSS_SELECTOR, ".data-count").text
assert text == "50 registros"</code></pre>
            <p>Resultado: tests lentos, frágiles y llenos de código de espera.</p>
        </div>

        <h3>✅ La solución: Auto-waiting de Playwright</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>En Playwright, el mismo flujo es limpio y estable <strong>sin ninguna espera
            explícita</strong>:</p>
            <div class="code-tabs" data-code-id="L060-1">
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
                <pre><code class="language-python"># ✅ Playwright — auto-waiting hace todo el trabajo
from playwright.sync_api import sync_playwright, expect

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://mi-app.com/dashboard")

    # Playwright espera automáticamente a que el botón:
    # ✓ Exista en el DOM
    # ✓ Sea visible
    # ✓ Sea estable (no en animación)
    # ✓ Esté habilitado
    # ✓ No esté oculto por otro elemento
    page.click(".load-data-btn")

    # expect() también espera automáticamente
    expect(page.locator(".data-count")).to_have_text("50 registros")

    browser.close()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// ✅ Playwright — auto-waiting hace todo el trabajo
import { test, expect } from '@playwright/test';

test('dashboard auto-waiting', async ({ page }) => {
    await page.goto('https://mi-app.com/dashboard');

    // Playwright espera automáticamente a que el botón:
    // ✓ Exista en el DOM
    // ✓ Sea visible
    // ✓ Sea estable (no en animación)
    // ✓ Esté habilitado
    // ✓ No esté oculto por otro elemento
    await page.click('.load-data-btn');

    // expect() también espera automáticamente
    await expect(page.locator('.data-count')).toHaveText('50 registros');
});</code></pre>
            </div>
            </div>
            <p><strong>Cero sleeps. Cero WebDriverWait. Cero flakiness.</strong></p>
        </div>

        <h3>🔍 ¿Cómo funciona el auto-waiting?</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Cuando ejecutas una acción como <code>page.click()</code>, Playwright
            internamente hace lo siguiente:</p>
            <pre><code class="text">page.click(".mi-boton")

Internamente Playwright ejecuta:
┌─────────────────────────────────────────┐
│ 1. ¿Existe el elemento en el DOM?       │ → Si no, esperar...
│ 2. ¿Es visible? (display, visibility)   │ → Si no, esperar...
│ 3. ¿Es estable? (no en animación)       │ → Si no, esperar...
│ 4. ¿Está habilitado? (no disabled)      │ → Si no, esperar...
│ 5. ¿Recibe eventos? (no interceptado)   │ → Si no, esperar...
│ 6. ✅ Todas las condiciones OK           │ → ¡Ejecutar click!
└─────────────────────────────────────────┘

Timeout por defecto: 30 segundos
Si no se cumple en 30s → TimeoutError con mensaje claro</code></pre>
        </div>

        <h3>📋 Acciones que auto-esperan</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <thead>
                <tr style="background: #1565c0; color: white;">
                    <th style="padding: 10px;">Acción</th>
                    <th style="padding: 10px;">Espera automáticamente</th>
                </tr>
            </thead>
            <tbody>
                <tr style="background: #e3f2fd;">
                    <td style="padding: 8px;"><code>locator.click()</code></td>
                    <td style="padding: 8px;">Visible, estable, habilitado, no interceptado</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><code>locator.fill()</code></td>
                    <td style="padding: 8px;">Visible, estable, habilitado, editable</td>
                </tr>
                <tr style="background: #e3f2fd;">
                    <td style="padding: 8px;"><code>locator.check()</code></td>
                    <td style="padding: 8px;">Visible, estable, habilitado, no checked</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><code>locator.select_option()</code></td>
                    <td style="padding: 8px;">Visible, estable, habilitado</td>
                </tr>
                <tr style="background: #e3f2fd;">
                    <td style="padding: 8px;"><code>locator.hover()</code></td>
                    <td style="padding: 8px;">Visible, estable</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><code>locator.type()</code></td>
                    <td style="padding: 8px;">Visible, estable, habilitado, editable</td>
                </tr>
                <tr style="background: #e3f2fd;">
                    <td style="padding: 8px;"><code>locator.press()</code></td>
                    <td style="padding: 8px;">Visible, estable, habilitado</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><code>locator.drag_to()</code></td>
                    <td style="padding: 8px;">Visible, estable en ambos elementos</td>
                </tr>
            </tbody>
        </table>

        <h3>⏱️ Configurando timeouts</h3>
        <div class="code-tabs" data-code-id="L060-2">
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
            <pre><code class="language-python"># Timeout por defecto: 30 segundos
# Se puede ajustar a nivel global, por contexto o por acción

# ── Nivel global (pytest.ini o conftest.py) ──
# playwright.config  → timeout: 60000  (60 segundos)

# ── Nivel de contexto ──
context = browser.new_context()
context.set_default_timeout(15000)  # 15 segundos para todo

# ── Nivel de página ──
page.set_default_timeout(10000)  # 10 segundos para esta página

# ── Nivel de acción individual ──
page.click(".boton-lento", timeout=60000)  # 60s solo para este click

# ── Para navegación (separado de acciones) ──
page.set_default_navigation_timeout(30000)
page.goto("https://mi-app.com", timeout=45000)</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// Timeout por defecto: 30 segundos
// Se puede ajustar a nivel global, por contexto o por acción

// ── Nivel global (playwright.config.ts) ──
// import { defineConfig } from '@playwright/test';
// export default defineConfig({
//     timeout: 60_000,  // 60 segundos por test
//     expect: { timeout: 10_000 },  // 10s para assertions
// });

// ── Nivel de contexto ──
const context = await browser.newContext();
context.setDefaultTimeout(15_000);  // 15 segundos para todo

// ── Nivel de página ──
page.setDefaultTimeout(10_000);  // 10 segundos para esta página

// ── Nivel de acción individual ──
await page.click('.boton-lento', { timeout: 60_000 });  // 60s solo para este click

// ── Para navegación (separado de acciones) ──
page.setDefaultNavigationTimeout(30_000);
await page.goto('https://mi-app.com', { timeout: 45_000 });</code></pre>
        </div>
        </div>

        <h3>🔄 Auto-waiting vs Selenium: Comparación directa</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #e65100; color: white;">
                        <th style="padding: 10px;">Escenario</th>
                        <th style="padding: 10px;">Selenium</th>
                        <th style="padding: 10px;">Playwright</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #fff8e1;">
                        <td style="padding: 8px;">Click en botón</td>
                        <td style="padding: 8px;">WebDriverWait + EC.clickable</td>
                        <td style="padding: 8px;"><code>locator.click()</code></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Llenar campo</td>
                        <td style="padding: 8px;">WebDriverWait + EC.visible + clear + sendKeys</td>
                        <td style="padding: 8px;"><code>locator.fill("texto")</code></td>
                    </tr>
                    <tr style="background: #fff8e1;">
                        <td style="padding: 8px;">Verificar texto</td>
                        <td style="padding: 8px;">WebDriverWait + EC.text_to_be_present</td>
                        <td style="padding: 8px;"><code>expect(loc).to_have_text("x")</code></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Esperar que desaparezca</td>
                        <td style="padding: 8px;">WebDriverWait + EC.invisibility</td>
                        <td style="padding: 8px;"><code>expect(loc).to_be_hidden()</code></td>
                    </tr>
                    <tr style="background: #fff8e1;">
                        <td style="padding: 8px;">Líneas de código</td>
                        <td style="padding: 8px;">3-5 por interacción</td>
                        <td style="padding: 8px;">1 por interacción</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>🧪 Ejemplo completo: Formulario dinámico</h3>
        <div class="code-tabs" data-code-id="L060-3">
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
            <pre><code class="language-python"># Sin sleeps ni esperas manuales — todo funciona
from playwright.sync_api import sync_playwright, expect

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://mi-app.com/formulario-dinamico")

    # El formulario carga con un spinner de 2 segundos
    # Playwright espera automáticamente a que el campo exista y sea visible
    page.fill("#nombre", "Juan Reina")
    page.fill("#email", "juan@siesa.com")

    # Al seleccionar "Colombia", se cargan departamentos via AJAX
    page.select_option("#pais", label="Colombia")

    # Playwright espera a que el select de departamento
    # se llene con las opciones del AJAX
    page.select_option("#departamento", label="Valle del Cauca")

    # Al seleccionar departamento, se cargan ciudades
    page.select_option("#ciudad", label="Cali")

    # Submit — espera a que el botón esté habilitado
    page.click("#submit-btn")

    # Verificar mensaje de éxito — espera a que aparezca
    expect(page.locator(".success-message")).to_have_text(
        "Registro exitoso"
    )

    browser.close()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// Sin sleeps ni esperas manuales — todo funciona
import { test, expect } from '@playwright/test';

test('formulario dinámico', async ({ page }) => {
    await page.goto('https://mi-app.com/formulario-dinamico');

    // El formulario carga con un spinner de 2 segundos
    // Playwright espera automáticamente a que el campo exista y sea visible
    await page.fill('#nombre', 'Juan Reina');
    await page.fill('#email', 'juan@siesa.com');

    // Al seleccionar "Colombia", se cargan departamentos via AJAX
    await page.selectOption('#pais', { label: 'Colombia' });

    // Playwright espera a que el select de departamento
    // se llene con las opciones del AJAX
    await page.selectOption('#departamento', { label: 'Valle del Cauca' });

    // Al seleccionar departamento, se cargan ciudades
    await page.selectOption('#ciudad', { label: 'Cali' });

    // Submit — espera a que el botón esté habilitado
    await page.click('#submit-btn');

    // Verificar mensaje de éxito — espera a que aparezca
    await expect(page.locator('.success-message')).toHaveText(
        'Registro exitoso'
    );
});</code></pre>
        </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip:</strong> El auto-waiting es la razón principal por la que los tests
            de Playwright son más estables que los de Selenium. Elimina la categoría completa
            de bugs de timing sin esfuerzo del desarrollador.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Tienes el siguiente test de Selenium con esperas
            manuales. Reescríbelo usando Playwright (sin ningún sleep ni WebDriverWait):</p>
            <pre><code class="python"># Selenium — reescribir en Playwright
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

driver.get("https://mi-app.com/search")
time.sleep(2)

search_box = WebDriverWait(driver, 10).until(
    EC.visibility_of_element_located((By.ID, "search"))
)
search_box.send_keys("Playwright")

WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.ID, "search-btn"))
).click()

time.sleep(3)

results = WebDriverWait(driver, 10).until(
    EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".result"))
)
assert len(results) > 0</code></pre>
        </div>
    `,
    topics: ["auto-waiting", "concepto", "playwright"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 8,
    difficulty: "medium",
    type: "foundation"
};

if (typeof window !== 'undefined') {
    window.LESSON_060 = LESSON_060;
}
