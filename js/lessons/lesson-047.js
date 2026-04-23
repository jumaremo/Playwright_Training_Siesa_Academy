/**
 * Playwright Academy - Lección 047
 * Keyboard events avanzados
 * Sección 6: Interacciones Web Avanzadas
 */

const LESSON_047 = {
    id: 47,
    title: "Keyboard events avanzados",
    duration: "5 min",
    level: "beginner",
    section: "section-06",
    content: `
        <h2>⌨️ Keyboard events avanzados</h2>
        <p>Playwright ofrece un control completo sobre los eventos de teclado. Puedes presionar
        teclas individuales, combinaciones, escribir texto carácter por carácter, y mantener
        teclas presionadas. Esto es esencial para automatizar atajos de teclado, navegación
        con Tab, autocompletados y mucho más.</p>

        <h3>🔑 page.keyboard.press() — Presionar teclas</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>El método <code>press()</code> simula presionar y soltar una tecla. Acepta
            nombres de tecla estándar y combinaciones con modificadores.</p>
        </div>
        <div class="code-tabs" data-code-id="L047-1">
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
    page.goto("https://ejemplo.com/formulario")

    # Presionar teclas individuales
    page.keyboard.press("Enter")
    page.keyboard.press("Tab")
    page.keyboard.press("Escape")
    page.keyboard.press("Backspace")
    page.keyboard.press("Delete")

    # Teclas de navegación
    page.keyboard.press("ArrowUp")
    page.keyboard.press("ArrowDown")
    page.keyboard.press("ArrowLeft")
    page.keyboard.press("ArrowRight")
    page.keyboard.press("Home")
    page.keyboard.press("End")
    page.keyboard.press("PageUp")
    page.keyboard.press("PageDown")

    # Teclas de función
    page.keyboard.press("F1")
    page.keyboard.press("F5")    # Recargar (en algunos contextos)
    page.keyboard.press("F12")   # DevTools (en algunos contextos)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://ejemplo.com/formulario');

    // Presionar teclas individuales
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Delete');

    // Teclas de navegación
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Home');
    await page.keyboard.press('End');
    await page.keyboard.press('PageUp');
    await page.keyboard.press('PageDown');

    // Teclas de función
    await page.keyboard.press('F1');
    await page.keyboard.press('F5');    // Recargar (en algunos contextos)
    await page.keyboard.press('F12');   // DevTools (en algunos contextos)
})();</code></pre>
            </div>
        </div>

        <h3>🎹 Nombres de teclas disponibles</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #ce93d8;">
                    <th style="padding: 8px; border: 1px solid #ddd; color: white;">Categoría</th>
                    <th style="padding: 8px; border: 1px solid #ddd; color: white;">Teclas</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Navegación</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>ArrowUp</code>, <code>ArrowDown</code>, <code>ArrowLeft</code>, <code>ArrowRight</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Edición</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>Backspace</code>, <code>Delete</code>, <code>Insert</code></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Control</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>Enter</code>, <code>Tab</code>, <code>Escape</code>, <code>Space</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Posición</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>Home</code>, <code>End</code>, <code>PageUp</code>, <code>PageDown</code></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Función</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>F1</code> a <code>F12</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Modificadores</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>Control</code>, <code>Shift</code>, <code>Alt</code>, <code>Meta</code> (Cmd en Mac)</td>
                </tr>
            </table>
        </div>

        <h3>🔗 Combinaciones de teclas (shortcuts)</h3>
        <div class="code-tabs" data-code-id="L047-2">
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
                <pre><code class="language-python"># Atajos comunes con modificadores
# El formato es "Modificador+Tecla"
page.keyboard.press("Control+a")    # Seleccionar todo
page.keyboard.press("Control+c")    # Copiar
page.keyboard.press("Control+v")    # Pegar
page.keyboard.press("Control+x")    # Cortar
page.keyboard.press("Control+z")    # Deshacer
page.keyboard.press("Control+Shift+z")  # Rehacer

# Navegación con Tab
page.keyboard.press("Tab")          # Siguiente campo
page.keyboard.press("Shift+Tab")    # Campo anterior

# Atajos del navegador
page.keyboard.press("Control+l")    # Seleccionar barra de URL
page.keyboard.press("Control+f")    # Buscar en página
page.keyboard.press("Alt+ArrowLeft")  # Ir atrás

# En Mac, usa "Meta" en lugar de "Control"
# page.keyboard.press("Meta+a")     # Seleccionar todo en Mac
# page.keyboard.press("Meta+c")     # Copiar en Mac</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Atajos comunes con modificadores
// El formato es 'Modificador+Tecla'
await page.keyboard.press('Control+a');    // Seleccionar todo
await page.keyboard.press('Control+c');    // Copiar
await page.keyboard.press('Control+v');    // Pegar
await page.keyboard.press('Control+x');    // Cortar
await page.keyboard.press('Control+z');    // Deshacer
await page.keyboard.press('Control+Shift+z');  // Rehacer

// Navegación con Tab
await page.keyboard.press('Tab');          // Siguiente campo
await page.keyboard.press('Shift+Tab');    // Campo anterior

// Atajos del navegador
await page.keyboard.press('Control+l');    // Seleccionar barra de URL
await page.keyboard.press('Control+f');    // Buscar en página
await page.keyboard.press('Alt+ArrowLeft');  // Ir atrás

// En Mac, usa 'Meta' en lugar de 'Control'
// await page.keyboard.press('Meta+a');     // Seleccionar todo en Mac
// await page.keyboard.press('Meta+c');     // Copiar en Mac</code></pre>
            </div>
        </div>

        <h3>📝 page.keyboard.type() — Escribir texto carácter por carácter</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><code>type()</code> simula la escritura humana: envía un evento <code>keydown</code>,
            <code>keypress</code> y <code>keyup</code> por cada carácter. Es útil cuando
            la aplicación reacciona a cada tecla (autocompletado, búsqueda en tiempo real).</p>
        </div>
        <div class="code-tabs" data-code-id="L047-3">
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
                <pre><code class="language-python"># Escribir texto carácter por carácter
page.keyboard.type("Hola Mundo")

# Con retraso entre teclas (simula escritura humana)
page.keyboard.type("buscando algo...", delay=100)  # 100ms entre teclas

# Útil para campos con autocompletado
page.click("#busqueda")
page.keyboard.type("Play", delay=50)
# Esperar que aparezca la sugerencia
page.wait_for_selector(".sugerencia:has-text('Playwright')")
page.keyboard.press("ArrowDown")
page.keyboard.press("Enter")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Escribir texto carácter por carácter
await page.keyboard.type('Hola Mundo');

// Con retraso entre teclas (simula escritura humana)
await page.keyboard.type('buscando algo...', { delay: 100 });  // 100ms entre teclas

// Útil para campos con autocompletado
await page.click('#busqueda');
await page.keyboard.type('Play', { delay: 50 });
// Esperar que aparezca la sugerencia
await page.waitForSelector(".sugerencia:has-text('Playwright')");
await page.keyboard.press('ArrowDown');
await page.keyboard.press('Enter');</code></pre>
            </div>
        </div>

        <h3>⬇️ keyboard.down() y keyboard.up() — Mantener teclas</h3>
        <div class="code-tabs" data-code-id="L047-4">
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
                <pre><code class="language-python"># Mantener una tecla presionada mientras se hace otra acción
# Útil para seleccionar texto o acciones drag con teclado

# Seleccionar texto con Shift + flechas
page.click("#mi-input")
page.keyboard.press("Home")           # Ir al inicio
page.keyboard.down("Shift")           # Mantener Shift
page.keyboard.press("End")            # Ir al final (selecciona todo)
page.keyboard.up("Shift")             # Soltar Shift

# Seleccionar múltiples elementos con Control
page.keyboard.down("Control")
page.click("#item-1")
page.click("#item-3")
page.click("#item-5")
page.keyboard.up("Control")

# Mantener Alt para acciones especiales
page.keyboard.down("Alt")
page.keyboard.press("ArrowDown")
page.keyboard.press("ArrowDown")
page.keyboard.up("Alt")

# IMPORTANTE: ¡Siempre liberar las teclas con up()!
# Si no lo haces, la tecla queda "presionada" para los siguientes eventos</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Mantener una tecla presionada mientras se hace otra acción
// Útil para seleccionar texto o acciones drag con teclado

// Seleccionar texto con Shift + flechas
await page.click('#mi-input');
await page.keyboard.press('Home');           // Ir al inicio
await page.keyboard.down('Shift');           // Mantener Shift
await page.keyboard.press('End');            // Ir al final (selecciona todo)
await page.keyboard.up('Shift');             // Soltar Shift

// Seleccionar múltiples elementos con Control
await page.keyboard.down('Control');
await page.click('#item-1');
await page.click('#item-3');
await page.click('#item-5');
await page.keyboard.up('Control');

// Mantener Alt para acciones especiales
await page.keyboard.down('Alt');
await page.keyboard.press('ArrowDown');
await page.keyboard.press('ArrowDown');
await page.keyboard.up('Alt');

// IMPORTANTE: ¡Siempre liberar las teclas con up()!
// Si no lo haces, la tecla queda 'presionada' para los siguientes eventos</code></pre>
            </div>
        </div>

        <h3>📋 keyboard.insert_text() — Insertar sin eventos de tecla</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><code>insert_text()</code> inserta texto directamente sin generar eventos
            individuales de teclado. Es más rápido que <code>type()</code> y útil cuando
            solo necesitas colocar texto en un campo sin importar los eventos intermedios.</p>
        </div>
        <div class="code-tabs" data-code-id="L047-5">
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
                <pre><code class="language-python"># Insertar texto directamente (solo dispara evento 'input')
page.keyboard.insert_text("Texto insertado rápidamente")

# No genera keydown/keypress/keyup individuales
# Útil para texto largo o cuando no necesitas simular escritura

# Ejemplo: pegar un bloque de texto grande
texto_largo = """Línea 1 del texto
Línea 2 del texto
Línea 3 del texto"""
page.click("#textarea")
page.keyboard.insert_text(texto_largo)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Insertar texto directamente (solo dispara evento 'input')
await page.keyboard.insertText('Texto insertado rápidamente');

// No genera keydown/keypress/keyup individuales
// Útil para texto largo o cuando no necesitas simular escritura

// Ejemplo: pegar un bloque de texto grande
const textoLargo = \`Línea 1 del texto
Línea 2 del texto
Línea 3 del texto\`;
await page.click('#textarea');
await page.keyboard.insertText(textoLargo);</code></pre>
            </div>
        </div>

        <h3>🎯 locator.press() — Presionar tecla en elemento específico</h3>
        <div class="code-tabs" data-code-id="L047-6">
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
                <pre><code class="language-python"># locator.press() presiona una tecla sobre un elemento específico
# El elemento recibe el foco automáticamente antes de la pulsación

# Presionar Enter en un campo de búsqueda
page.locator("#campo-busqueda").press("Enter")

# Presionar Tab para salir de un campo
page.locator("#nombre").fill("Juan")
page.locator("#nombre").press("Tab")   # Foco pasa al siguiente campo

# Atajos en un editor de texto
editor = page.locator("#editor")
editor.press("Control+a")    # Seleccionar todo dentro del editor
editor.press("Control+c")    # Copiar selección
editor.press("Delete")       # Borrar selección

# Diferencia con page.keyboard.press():
# - locator.press() enfoca el elemento primero
# - page.keyboard.press() actúa sobre el elemento que ya tiene foco</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// locator.press() presiona una tecla sobre un elemento específico
// El elemento recibe el foco automáticamente antes de la pulsación

// Presionar Enter en un campo de búsqueda
await page.locator('#campo-busqueda').press('Enter');

// Presionar Tab para salir de un campo
await page.locator('#nombre').fill('Juan');
await page.locator('#nombre').press('Tab');   // Foco pasa al siguiente campo

// Atajos en un editor de texto
const editor = page.locator('#editor');
await editor.press('Control+a');    // Seleccionar todo dentro del editor
await editor.press('Control+c');    // Copiar selección
await editor.press('Delete');       // Borrar selección

// Diferencia con page.keyboard.press():
// - locator.press() enfoca el elemento primero
// - page.keyboard.press() actúa sobre el elemento que ya tiene foco</code></pre>
            </div>
        </div>

        <h3>📊 Comparativa: fill() vs type() vs insert_text()</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #ce93d8;">
                    <th style="padding: 8px; border: 1px solid #ddd; color: white;">Método</th>
                    <th style="padding: 8px; border: 1px solid #ddd; color: white;">Eventos generados</th>
                    <th style="padding: 8px; border: 1px solid #ddd; color: white;">Velocidad</th>
                    <th style="padding: 8px; border: 1px solid #ddd; color: white;">Caso de uso</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>locator.fill()</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">focus + input + change</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Muy rápida</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Llenar formularios (recomendado)</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>keyboard.type()</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">keydown + keypress + keyup por cada carácter</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Lenta</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Autocompletado, búsqueda en tiempo real</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>keyboard.insert_text()</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Solo input (sin eventos de tecla)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Rápida</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Insertar texto sin simular teclas</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>locator.press()</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">keydown + keyup (una tecla)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Rápida</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Presionar tecla en elemento específico</td>
                </tr>
            </table>
        </div>

        <h3>🛠️ Casos de uso prácticos</h3>
        <div class="code-tabs" data-code-id="L047-7">
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
                <pre><code class="language-python">import pytest
from playwright.sync_api import Page, expect

# --- Caso 1: Navegación de formulario con Tab ---
def test_navegar_formulario_con_tab(page: Page):
    page.goto("/formulario")

    # Llenar campo a campo usando Tab para avanzar
    page.locator("#nombre").fill("Juan")
    page.keyboard.press("Tab")

    page.locator("#apellido").fill("Reina")
    page.keyboard.press("Tab")

    page.locator("#email").fill("juan@test.com")
    page.keyboard.press("Tab")

    # Enviar con Enter (el botón submit tiene foco)
    page.keyboard.press("Enter")

    expect(page.locator(".exito")).to_be_visible()

# --- Caso 2: Autocompletado con flechas ---
def test_autocompletado(page: Page):
    page.goto("/busqueda")

    # Escribir letra por letra para activar autocompletado
    page.click("#buscar")
    page.keyboard.type("Col", delay=100)

    # Esperar sugerencias
    page.wait_for_selector(".sugerencias li")

    # Navegar sugerencias con flechas
    page.keyboard.press("ArrowDown")   # Primera sugerencia
    page.keyboard.press("ArrowDown")   # Segunda sugerencia
    page.keyboard.press("Enter")       # Seleccionar

    expect(page.locator("#buscar")).to_have_value("Colombia")

# --- Caso 3: Atajos de teclado en aplicación ---
def test_atajos_teclado(page: Page):
    page.goto("/editor")

    editor = page.locator("#contenido")
    editor.click()

    # Escribir texto
    page.keyboard.type("Texto de prueba")

    # Seleccionar todo y copiar
    page.keyboard.press("Control+a")
    page.keyboard.press("Control+c")

    # Ir al final y pegar
    page.keyboard.press("End")
    page.keyboard.press("Enter")
    page.keyboard.press("Control+v")

    # Verificar texto duplicado
    expect(editor).to_contain_text("Texto de prueba\\nTexto de prueba")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

// --- Caso 1: Navegación de formulario con Tab ---
test('navegar formulario con tab', async ({ page }) => {
    await page.goto('/formulario');

    // Llenar campo a campo usando Tab para avanzar
    await page.locator('#nombre').fill('Juan');
    await page.keyboard.press('Tab');

    await page.locator('#apellido').fill('Reina');
    await page.keyboard.press('Tab');

    await page.locator('#email').fill('juan@test.com');
    await page.keyboard.press('Tab');

    // Enviar con Enter (el botón submit tiene foco)
    await page.keyboard.press('Enter');

    await expect(page.locator('.exito')).toBeVisible();
});

// --- Caso 2: Autocompletado con flechas ---
test('autocompletado', async ({ page }) => {
    await page.goto('/busqueda');

    // Escribir letra por letra para activar autocompletado
    await page.click('#buscar');
    await page.keyboard.type('Col', { delay: 100 });

    // Esperar sugerencias
    await page.waitForSelector('.sugerencias li');

    // Navegar sugerencias con flechas
    await page.keyboard.press('ArrowDown');   // Primera sugerencia
    await page.keyboard.press('ArrowDown');   // Segunda sugerencia
    await page.keyboard.press('Enter');       // Seleccionar

    await expect(page.locator('#buscar')).toHaveValue('Colombia');
});

// --- Caso 3: Atajos de teclado en aplicación ---
test('atajos teclado', async ({ page }) => {
    await page.goto('/editor');

    const editor = page.locator('#contenido');
    await editor.click();

    // Escribir texto
    await page.keyboard.type('Texto de prueba');

    // Seleccionar todo y copiar
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Control+c');

    // Ir al final y pegar
    await page.keyboard.press('End');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Control+v');

    // Verificar texto duplicado
    await expect(editor).toContainText('Texto de prueba\\nTexto de prueba');
});</code></pre>
            </div>
        </div>

        <h3>🌐 Caracteres especiales y Unicode</h3>
        <div class="code-tabs" data-code-id="L047-8">
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
                <pre><code class="language-python"># Caracteres especiales se pueden escribir con type()
page.keyboard.type("Contraseña: cañón@2024!")
page.keyboard.type("Precio: $1.500,00")
page.keyboard.type("Correo: usuario+tag@mail.com")

# Emojis y Unicode con insert_text()
page.keyboard.insert_text("Hola 🎉")
page.keyboard.insert_text("Símbolo: €, £, ¥, ©, ®")

# Caracteres con Alt codes (menos confiable, preferir insert_text)
# page.keyboard.type("ñ")  # Funciona directamente</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Caracteres especiales se pueden escribir con type()
await page.keyboard.type('Contraseña: cañón@2024!');
await page.keyboard.type('Precio: $1.500,00');
await page.keyboard.type('Correo: usuario+tag@mail.com');

// Emojis y Unicode con insertText()
await page.keyboard.insertText('Hola 🎉');
await page.keyboard.insertText('Símbolo: €, £, ¥, ©, ®');

// Caracteres con Alt codes (menos confiable, preferir insertText)
// await page.keyboard.type('ñ');  // Funciona directamente</code></pre>
            </div>
        </div>

        <h3>💡 Ejemplo completo: formulario con solo teclado</h3>
        <div class="code-tabs" data-code-id="L047-9">
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
                <pre><code class="language-python">import pytest
from playwright.sync_api import Page, expect

def test_formulario_completo_con_teclado(page: Page):
    """Llenar y enviar un formulario usando solo el teclado."""
    page.goto("/registro")

    # Foco al primer campo
    page.keyboard.press("Tab")

    # Nombre
    page.keyboard.type("María García", delay=30)
    page.keyboard.press("Tab")

    # Email
    page.keyboard.type("maria@ejemplo.com", delay=30)
    page.keyboard.press("Tab")

    # Teléfono
    page.keyboard.type("+57 300 123 4567")
    page.keyboard.press("Tab")

    # Select (dropdown) - navegar opciones con flechas
    page.keyboard.press("Space")       # Abrir dropdown
    page.keyboard.press("ArrowDown")   # Primera opción
    page.keyboard.press("ArrowDown")   # Segunda opción
    page.keyboard.press("Enter")       # Seleccionar
    page.keyboard.press("Tab")

    # Checkbox - activar con Space
    page.keyboard.press("Space")       # Marcar checkbox
    page.keyboard.press("Tab")

    # Textarea - escribir texto multilinea
    page.keyboard.type("Este es un comentario")
    page.keyboard.press("Shift+Enter")  # Nueva línea
    page.keyboard.type("con varias líneas")
    page.keyboard.press("Tab")

    # Botón submit - presionar con Enter
    page.keyboard.press("Enter")

    # Verificar envío exitoso
    expect(page.locator(".mensaje-exito")).to_be_visible()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('formulario completo con teclado', async ({ page }) => {
    // Llenar y enviar un formulario usando solo el teclado.
    await page.goto('/registro');

    // Foco al primer campo
    await page.keyboard.press('Tab');

    // Nombre
    await page.keyboard.type('María García', { delay: 30 });
    await page.keyboard.press('Tab');

    // Email
    await page.keyboard.type('maria@ejemplo.com', { delay: 30 });
    await page.keyboard.press('Tab');

    // Teléfono
    await page.keyboard.type('+57 300 123 4567');
    await page.keyboard.press('Tab');

    // Select (dropdown) - navegar opciones con flechas
    await page.keyboard.press('Space');       // Abrir dropdown
    await page.keyboard.press('ArrowDown');   // Primera opción
    await page.keyboard.press('ArrowDown');   // Segunda opción
    await page.keyboard.press('Enter');       // Seleccionar
    await page.keyboard.press('Tab');

    // Checkbox - activar con Space
    await page.keyboard.press('Space');       // Marcar checkbox
    await page.keyboard.press('Tab');

    // Textarea - escribir texto multilinea
    await page.keyboard.type('Este es un comentario');
    await page.keyboard.press('Shift+Enter');  // Nueva línea
    await page.keyboard.type('con varias líneas');
    await page.keyboard.press('Tab');

    // Botón submit - presionar con Enter
    await page.keyboard.press('Enter');

    // Verificar envío exitoso
    await expect(page.locator('.mensaje-exito')).toBeVisible();
});</code></pre>
            </div>
        </div>

        <h3>📋 Tabla resumen: todos los métodos de teclado</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #90caf9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Método</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripción</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>keyboard.press(key)</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Presionar y soltar una tecla</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>keyboard.press("Enter")</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>keyboard.type(text)</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Escribir texto carácter por carácter</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>keyboard.type("hola", delay=50)</code></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>keyboard.down(key)</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Mantener tecla presionada</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>keyboard.down("Shift")</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>keyboard.up(key)</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Soltar tecla mantenida</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>keyboard.up("Shift")</code></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>keyboard.insert_text(text)</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Insertar texto sin eventos de tecla</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>keyboard.insert_text("texto")</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>locator.press(key)</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Presionar tecla en un elemento</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>locator.press("Tab")</code></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>locator.fill(text)</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Llenar campo (focus + value + input)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>locator.fill("valor")</code></td>
                </tr>
            </table>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Reto:</strong> Navegar y llenar un formulario usando <strong>solo interacciones
            de teclado</strong> (sin <code>fill()</code> ni <code>click()</code>).</p>
        </div>
        <ol>
            <li>Navega a un formulario de registro con <code>page.goto()</code></li>
            <li>Usa <code>Tab</code> para moverte entre campos</li>
            <li>Usa <code>keyboard.type()</code> para escribir en cada campo</li>
            <li>Usa <code>ArrowDown</code> + <code>Enter</code> para seleccionar en un dropdown</li>
            <li>Usa <code>Space</code> para marcar un checkbox</li>
            <li>Usa <code>Enter</code> para enviar el formulario</li>
            <li>Verifica el resultado con <code>expect()</code></li>
        </ol>
        <div class="code-tabs" data-code-id="L047-10">
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
                <pre><code class="language-python">import pytest
from playwright.sync_api import Page, expect

def test_formulario_solo_teclado(page: Page):
    """Ejercicio: completar formulario sin mouse."""
    page.goto("https://the-internet.herokuapp.com/login")

    # 1. Tab al campo username
    page.keyboard.press("Tab")

    # 2. Escribir username
    page.keyboard.type("tomsmith", delay=50)

    # 3. Tab al campo password
    page.keyboard.press("Tab")

    # 4. Escribir password
    page.keyboard.type("SuperSecretPassword!", delay=50)

    # 5. Tab al botón y Enter para enviar
    page.keyboard.press("Tab")
    page.keyboard.press("Enter")

    # 6. Verificar login exitoso
    expect(page).to_have_url("**/secure")
    expect(page.locator("#flash")).to_contain_text(
        "You logged into a secure area!"
    )</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('formulario solo teclado', async ({ page }) => {
    // Ejercicio: completar formulario sin mouse.
    await page.goto('https://the-internet.herokuapp.com/login');

    // 1. Tab al campo username
    await page.keyboard.press('Tab');

    // 2. Escribir username
    await page.keyboard.type('tomsmith', { delay: 50 });

    // 3. Tab al campo password
    await page.keyboard.press('Tab');

    // 4. Escribir password
    await page.keyboard.type('SuperSecretPassword!', { delay: 50 });

    // 5. Tab al botón y Enter para enviar
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // 6. Verificar login exitoso
    await expect(page).toHaveURL('**/secure');
    await expect(page.locator('#flash')).toContainText(
        'You logged into a secure area!'
    );
});</code></pre>
            </div>
        </div>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Dominar <code>page.keyboard.press()</code> con teclas individuales y combinaciones</li>
                <li>Diferenciar <code>fill()</code>, <code>type()</code> e <code>insert_text()</code></li>
                <li>Usar <code>keyboard.down()</code>/<code>up()</code> para mantener teclas</li>
                <li>Usar <code>locator.press()</code> para teclas sobre elementos específicos</li>
                <li>Automatizar formularios con navegación exclusiva por teclado</li>
            </ul>
        </div>
    `,
    topics: ["keyboard", "teclas", "eventos"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_047 = LESSON_047;
}
