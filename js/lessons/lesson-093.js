/**
 * Playwright Academy - Lección 093
 * Playwright Inspector y PWDEBUG
 * Sección 14: Debugging: Inspector, Trace, Codegen
 */

const LESSON_093 = {
    id: 93,
    title: "Playwright Inspector y PWDEBUG",
    duration: "8 min",
    level: "intermediate",
    section: "section-14",
    content: `
        <h2>🔍 Playwright Inspector y PWDEBUG</h2>
        <p>Bienvenido a la <strong>Sección 14: Debugging</strong>. En esta primera lección conocerás la herramienta
        más poderosa para depurar tests de Playwright: el <strong>Playwright Inspector</strong>. Aprenderás a
        activarlo con la variable de entorno <code>PWDEBUG</code>, a usar el selector picker, la ejecución
        paso a paso, y a diagnosticar problemas comunes como localizadores que no coinciden o clics que no funcionan.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📘 ¿Qué aprenderás en esta lección?</h4>
            <ul>
                <li>Panorama de las herramientas de debugging de Playwright</li>
                <li>Activar el Inspector con <code>PWDEBUG=1</code> en Windows, Linux y macOS</li>
                <li>Navegar la interfaz del Inspector: locator picker, action log, source tab</li>
                <li>Usar <code>page.pause()</code> como breakpoint programático</li>
                <li>Ejecución paso a paso y evaluación de localizadores en consola</li>
                <li>Flujos de debugging para problemas comunes en tests</li>
            </ul>
        </div>

        <h3>🗺️ Panorama de herramientas de debugging en Playwright</h3>
        <p>Playwright ofrece un ecosistema completo de herramientas para depurar tests. Esta sección cubre
        las principales; empezamos con la más interactiva:</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔧 Herramientas de debugging disponibles</h4>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                    <tr style="background: #1565c0; color: white;">
                        <th style="padding: 8px; text-align: left;">Herramienta</th>
                        <th style="padding: 8px; text-align: left;">Propósito</th>
                        <th style="padding: 8px; text-align: left;">Lección</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><strong>Playwright Inspector</strong></td>
                        <td style="padding: 8px;">Debugging interactivo paso a paso</td>
                        <td style="padding: 8px;">Esta lección (093)</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>Codegen</strong></td>
                        <td style="padding: 8px;">Generar código grabando acciones</td>
                        <td style="padding: 8px;">Lección 094</td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><strong>Trace Viewer</strong></td>
                        <td style="padding: 8px;">Análisis post-mortem de ejecuciones</td>
                        <td style="padding: 8px;">Lección 095</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>VS Code Debugger</strong></td>
                        <td style="padding: 8px;">Breakpoints nativos en el IDE</td>
                        <td style="padding: 8px;">Lección 096</td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><strong>Screenshots / Videos</strong></td>
                        <td style="padding: 8px;">Evidencia visual de fallos</td>
                        <td style="padding: 8px;">Lección 097</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>⚡ Activar el Inspector con PWDEBUG</h3>
        <p>La variable de entorno <code>PWDEBUG=1</code> lanza el Playwright Inspector automáticamente
        al ejecutar cualquier test. Cuando se activa, Playwright abre el navegador en modo <strong>headed</strong>
        (visible), <strong>desactiva los timeouts</strong> y muestra la ventana del Inspector.</p>

        <pre><code class="bash"># ==========================================
# Activar PWDEBUG en diferentes SO
# ==========================================

# --- Windows (CMD) ---
set PWDEBUG=1
pytest tests/test_login.py

# --- Windows (PowerShell) ---
$env:PWDEBUG = "1"
pytest tests/test_login.py

# --- Linux / macOS ---
PWDEBUG=1 pytest tests/test_login.py

# --- En una sola línea (Linux/macOS) ---
PWDEBUG=1 python -m pytest tests/ -k "test_login" -s</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>En los entornos de desarrollo de SIESA con Windows, la forma más confiable es usar
            <strong>PowerShell</strong>: <code>$env:PWDEBUG = "1"</code>. Si usas Git Bash,
            la sintaxis de Linux funciona directamente: <code>PWDEBUG=1 pytest ...</code></p>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ ¿Qué hace PWDEBUG=1 exactamente?</h4>
            <ul>
                <li><strong>Abre el navegador en modo headed</strong> — puedes ver todo lo que ocurre</li>
                <li><strong>Desactiva todos los timeouts</strong> — no hay límite de tiempo mientras depuras</li>
                <li><strong>Abre la ventana del Inspector</strong> — con controles de step, locator picker, etc.</li>
                <li><strong>Pausa en la primera acción</strong> — espera a que tú controles la ejecución</li>
                <li><strong>Modo headed forzado</strong> — ignora <code>headless=True</code> en tu código</li>
            </ul>
        </div>

        <h3>🖥️ La interfaz del Playwright Inspector</h3>
        <p>El Inspector se abre como una ventana independiente con tres paneles principales:</p>

        <pre><code class="text">┌─────────────────────────────────────────────┐
│  Playwright Inspector                        │
├─────────────────────────────────────────────┤
│  [▶ Resume] [⏭ Step Over] [🎯 Pick Locator]│  ← Barra de controles
├─────────────────────────────────────────────┤
│                                             │
│  📋 Action Log (panel izquierdo)            │
│  ─────────────────────────────              │
│  ▸ page.goto("https://...")        ✓        │
│  ▸ page.get_by_role("textbox")     ✓        │
│  ▸ page.get_by_role("button")      ⏸ ←actual│
│  ▸ page.get_by_text("Dashboard")   ⏳       │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  📝 Source Tab (panel derecho/inferior)      │
│  ─────────────────────────────              │
│  Muestra el código fuente del test con      │
│  la línea actual resaltada                  │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  🔤 Locator Input (parte inferior)          │
│  ─────────────────────────────              │
│  > page.get_by_role("button",               │
│    name="Enviar")                           │
│  Matches: 1 element                         │
│                                             │
└─────────────────────────────────────────────┘</code></pre>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📋 Paneles del Inspector</h4>
            <p><strong>1. Barra de controles:</strong></p>
            <ul>
                <li><strong>Resume (▶)</strong> — Continúa la ejecución hasta el siguiente <code>page.pause()</code> o hasta el final</li>
                <li><strong>Step Over (⏭)</strong> — Ejecuta la acción actual y pausa en la siguiente</li>
                <li><strong>Pick Locator (🎯)</strong> — Activa el selector picker en el navegador</li>
            </ul>
            <p><strong>2. Action Log:</strong> Lista cronológica de todas las acciones ejecutadas, con estado
            (completada ✓, en curso ⏸, pendiente ⏳).</p>
            <p><strong>3. Source Tab:</strong> Código fuente del test con la línea actual resaltada en amarillo.</p>
            <p><strong>4. Locator Input:</strong> Campo donde puedes escribir localizadores y ver cuántos
            elementos coinciden en tiempo real.</p>
        </div>

        <h3>⏸️ page.pause() — Breakpoint programático</h3>
        <p>En lugar de activar <code>PWDEBUG=1</code> globalmente, puedes insertar
        <code>page.pause()</code> en puntos específicos de tu test para pausar justo donde necesitas inspeccionar.</p>

        <div class="code-tabs" data-code-id="L093-1">
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

def test_login_debug():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()

        page.goto("https://mi-app.siesa.com/login")

        # Pausar aquí para inspeccionar el formulario
        page.pause()

        # El Inspector se abre y puedes:
        # 1. Usar el locator picker para encontrar selectores
        # 2. Evaluar localizadores en el campo de input
        # 3. Step over para ejecutar línea por línea

        page.get_by_label("Usuario").fill("admin@siesa.com")
        page.get_by_label("Contraseña").fill("password123")

        # Otra pausa para verificar el estado antes del submit
        page.pause()

        page.get_by_role("button", name="Iniciar sesión").click()

        # Pausa final para verificar que se redirigió correctamente
        page.pause()

        assert page.url.endswith("/dashboard")

        browser.close()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">import { chromium } from 'playwright';

async function testLoginDebug() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://mi-app.siesa.com/login');

    // Pausar aquí para inspeccionar el formulario
    await page.pause();

    // El Inspector se abre y puedes:
    // 1. Usar el locator picker para encontrar selectores
    // 2. Evaluar localizadores en el campo de input
    // 3. Step over para ejecutar línea por línea

    await page.getByLabel('Usuario').fill('admin@siesa.com');
    await page.getByLabel('Contraseña').fill('password123');

    // Otra pausa para verificar el estado antes del submit
    await page.pause();

    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Pausa final para verificar que se redirigió correctamente
    await page.pause();

    expect(page.url()).toContain('/dashboard');

    await browser.close();
}</code></pre>
        </div>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Ventajas de page.pause() sobre PWDEBUG=1</h4>
            <ul>
                <li><strong>Selectivo:</strong> Solo pausas donde necesitas, no en la primera acción</li>
                <li><strong>No requiere variable de entorno:</strong> Funciona directamente en el código</li>
                <li><strong>Múltiples puntos:</strong> Puedes tener varios <code>page.pause()</code> en un test</li>
                <li><strong>Condicional:</strong> Puedes usar <code>if</code> para pausar solo en ciertos casos</li>
            </ul>
        </div>

        <div class="code-tabs" data-code-id="L093-2">
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
            <pre><code class="language-python"># page.pause() condicional — pausar solo cuando falla algo
def test_buscar_producto(page):
    page.goto("https://erp.siesa.com/productos")
    page.get_by_placeholder("Buscar producto").fill("Widget X")
    page.get_by_role("button", name="Buscar").click()

    # Pausar solo si no aparece resultado
    resultados = page.locator(".resultado-producto")
    if resultados.count() == 0:
        print("⚠️ No se encontraron resultados, pausando para inspección...")
        page.pause()

    expect(resultados).to_have_count(1, timeout=5000)</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// page.pause() condicional — pausar solo cuando falla algo
test('buscar producto', async ({ page }) => {
    await page.goto('https://erp.siesa.com/productos');
    await page.getByPlaceholder('Buscar producto').fill('Widget X');
    await page.getByRole('button', { name: 'Buscar' }).click();

    // Pausar solo si no aparece resultado
    const resultados = page.locator('.resultado-producto');
    if (await resultados.count() === 0) {
        console.log('⚠️ No se encontraron resultados, pausando para inspección...');
        await page.pause();
    }

    await expect(resultados).toHaveCount(1, { timeout: 5000 });
});</code></pre>
        </div>
        </div>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚠️ Cuidado: No dejar page.pause() en producción</h4>
            <p>Un <code>page.pause()</code> olvidado en el código hará que la ejecución en CI se quede
            colgada indefinidamente (o hasta que el timeout de la pipeline lo mate). Siempre retira los
            <code>page.pause()</code> antes de hacer commit, o usa un flag para habilitarlos solo en modo debug:</p>
            <div class="code-tabs" data-code-id="L093-3">
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
                <pre><code class="language-python">import os

DEBUG_MODE = os.environ.get("DEBUG_TESTS", "0") == "1"

def test_login(page):
    page.goto("https://mi-app.siesa.com/login")

    if DEBUG_MODE:
        page.pause()  # Solo pausa si DEBUG_TESTS=1

    page.get_by_label("Usuario").fill("admin")
    # ...</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">const DEBUG_MODE = process.env.DEBUG_TESTS === '1';

test('login', async ({ page }) => {
    await page.goto('https://mi-app.siesa.com/login');

    if (DEBUG_MODE) {
        await page.pause(); // Solo pausa si DEBUG_TESTS=1
    }

    await page.getByLabel('Usuario').fill('admin');
    // ...
});</code></pre>
            </div>
            </div>
        </div>

        <h3>⏭️ Ejecución paso a paso en el Inspector</h3>
        <p>El flujo de debugging paso a paso te permite ejecutar cada acción del test una por una,
        observando exactamente qué sucede en el navegador en cada paso:</p>

        <div class="code-tabs" data-code-id="L093-4">
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
            <pre><code class="language-python"># Test para depurar paso a paso
from playwright.sync_api import sync_playwright, expect

def test_crear_registro(page):
    """
    Con PWDEBUG=1, cada línea se ejecuta solo cuando
    presionas "Step Over" en el Inspector.
    """
    # Paso 1: Navegar
    page.goto("https://erp.siesa.com/registros/nuevo")

    # Paso 2: Llenar formulario
    page.get_by_label("Código").fill("REG-001")
    page.get_by_label("Descripción").fill("Registro de prueba")
    page.get_by_label("Categoría").select_option("Ventas")

    # Paso 3: Enviar
    page.get_by_role("button", name="Guardar").click()

    # Paso 4: Verificar
    expect(page.get_by_text("Registro creado exitosamente")).to_be_visible()
    expect(page.locator(".registro-id")).to_have_text("REG-001")</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// Test para depurar paso a paso
import { test, expect } from '@playwright/test';

test('crear registro', async ({ page }) => {
    // Con PWDEBUG=1, cada línea se ejecuta solo cuando
    // presionas "Step Over" en el Inspector.

    // Paso 1: Navegar
    await page.goto('https://erp.siesa.com/registros/nuevo');

    // Paso 2: Llenar formulario
    await page.getByLabel('Código').fill('REG-001');
    await page.getByLabel('Descripción').fill('Registro de prueba');
    await page.getByLabel('Categoría').selectOption('Ventas');

    // Paso 3: Enviar
    await page.getByRole('button', { name: 'Guardar' }).click();

    // Paso 4: Verificar
    await expect(page.getByText('Registro creado exitosamente')).toBeVisible();
    await expect(page.locator('.registro-id')).toHaveText('REG-001');
});</code></pre>
        </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip: Flujo de Step Over</h4>
            <ol>
                <li>Ejecuta con <code>PWDEBUG=1 pytest test_crear_registro.py -s</code></li>
                <li>El Inspector se abre y pausa en la primera acción (<code>page.goto</code>)</li>
                <li>Haz clic en <strong>Step Over</strong> — ejecuta <code>goto</code> y pausa en el siguiente <code>fill</code></li>
                <li>Observa el navegador: la página se cargó</li>
                <li>Otro <strong>Step Over</strong> — el campo Código se llena con "REG-001"</li>
                <li>Continúa paso a paso o presiona <strong>Resume</strong> para ejecutar todo hasta el final</li>
            </ol>
        </div>

        <h3>🎯 Locator Picker — Encontrar selectores visualmente</h3>
        <p>El <strong>Locator Picker</strong> es una de las funcionalidades más útiles del Inspector. Te permite
        hacer clic en cualquier elemento del navegador y obtener automáticamente el localizador Playwright recomendado.</p>

        <pre><code class="text">Flujo del Locator Picker:
═══════════════════════════

1. Haz clic en "Pick Locator" (🎯) en el Inspector
   └─→ El cursor cambia a modo selector

2. Pasa el mouse sobre un elemento en el navegador
   └─→ Se resalta con borde azul
   └─→ Se muestra un tooltip con el localizador sugerido

3. Haz clic en el elemento
   └─→ El localizador aparece en el campo "Locator Input"
   └─→ Ejemplo: page.get_by_role("button", name="Guardar")

4. El Inspector muestra cuántos elementos coinciden
   └─→ "1 match" = perfecto, localizador único
   └─→ "3 matches" = localizador ambiguo, necesitas refinarlo</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Prioridad de localizadores del Picker</h4>
            <p>El picker sugiere localizadores en este orden de preferencia (de mejor a peor):</p>
            <ol>
                <li><code>get_by_role()</code> — Roles ARIA (button, textbox, heading, etc.)</li>
                <li><code>get_by_text()</code> — Texto visible del elemento</li>
                <li><code>get_by_label()</code> — Etiqueta asociada a un input</li>
                <li><code>get_by_placeholder()</code> — Placeholder de campos</li>
                <li><code>get_by_test_id()</code> — Atributo data-testid</li>
                <li><code>locator("css=...")</code> — Selector CSS (último recurso)</li>
            </ol>
            <p>Esta prioridad se alinea con las mejores prácticas de Playwright: <strong>siempre prefiere
            localizadores semánticos</strong> sobre selectores técnicos.</p>
        </div>

        <h3>🔤 Evaluar localizadores en la consola del Inspector</h3>
        <p>El campo <strong>Locator Input</strong> en la parte inferior del Inspector permite escribir
        localizadores y verificar en tiempo real cuántos elementos coinciden en la página actual.</p>

        <div class="code-tabs" data-code-id="L093-5">
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
            <pre><code class="language-python"># Escribe estos localizadores en el Locator Input del Inspector
# para verificar si coinciden con elementos en la página:

# Verificar un botón por role
page.get_by_role("button", name="Guardar")
# → "1 match" ✓

# Verificar un campo de texto
page.get_by_label("Correo electrónico")
# → "1 match" ✓

# Localizador ambiguo
page.get_by_role("button")
# → "5 matches" ⚠️ demasiados

# Localizador que no encuentra nada
page.get_by_text("Texto inexistente")
# → "0 matches" ❌

# Refinar con filtros
page.get_by_role("row").filter(has_text="Juan Reina")
# → "1 match" ✓

# Localizador CSS como alternativa
page.locator("#btn-submit")
# → "1 match" ✓</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// Escribe estos localizadores en el Locator Input del Inspector
// para verificar si coinciden con elementos en la página:

// Verificar un botón por role
page.getByRole('button', { name: 'Guardar' })
// → "1 match" ✓

// Verificar un campo de texto
page.getByLabel('Correo electrónico')
// → "1 match" ✓

// Localizador ambiguo
page.getByRole('button')
// → "5 matches" ⚠️ demasiados

// Localizador que no encuentra nada
page.getByText('Texto inexistente')
// → "0 matches" ❌

// Refinar con filtros
page.getByRole('row').filter({ hasText: 'Juan Reina' })
// → "1 match" ✓

// Localizador CSS como alternativa
page.locator('#btn-submit')
// → "1 match" ✓</code></pre>
        </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA: Validar localizadores antes de escribir el test</h4>
            <p>En aplicaciones ERP como Siesa Enterprise, los formularios pueden tener muchos campos similares.
            <strong>Siempre valida en el Inspector</strong> que tu localizador devuelve exactamente 1 match antes
            de usarlo en el test. Un localizador que coincide con 3 elementos causará comportamiento impredecible.</p>
        </div>

        <h3>🌐 Inspeccionar requests de red durante el debug</h3>
        <p>Mientras el Inspector está pausado, puedes usar las DevTools del navegador (F12) para
        inspeccionar el tráfico de red. Esto es útil para diagnosticar problemas con APIs.</p>

        <div class="code-tabs" data-code-id="L093-6">
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

def test_verificar_api_con_debug(page):
    """
    Workflow:
    1. Ejecutar con PWDEBUG=1
    2. Cuando el Inspector pause, abrir DevTools (F12)
    3. Ir a la pestaña Network
    4. Step over para ver cada request
    """
    page.goto("https://erp.siesa.com/api-demo")

    # Pausa para abrir DevTools > Network antes de la acción
    page.pause()

    # Esta acción debería disparar un POST al backend
    page.get_by_role("button", name="Crear pedido").click()

    # Pausa para inspeccionar el request/response en Network
    page.pause()

    # También puedes escuchar eventos de red programáticamente
    page.on("response", lambda response:
        print(f"  Response: {response.status} {response.url}")
        if "/api/" in response.url
        else None
    )

    page.get_by_role("button", name="Actualizar lista").click()
    page.pause()  # Ver los responses en la consola</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">import { test } from '@playwright/test';

test('verificar API con debug', async ({ page }) => {
    // Workflow:
    // 1. Ejecutar con PWDEBUG=1
    // 2. Cuando el Inspector pause, abrir DevTools (F12)
    // 3. Ir a la pestaña Network
    // 4. Step over para ver cada request

    await page.goto('https://erp.siesa.com/api-demo');

    // Pausa para abrir DevTools > Network antes de la acción
    await page.pause();

    // Esta acción debería disparar un POST al backend
    await page.getByRole('button', { name: 'Crear pedido' }).click();

    // Pausa para inspeccionar el request/response en Network
    await page.pause();

    // También puedes escuchar eventos de red programáticamente
    page.on('response', (response) => {
        if (response.url().includes('/api/')) {
            console.log(\`  Response: \${response.status()} \${response.url()}\`);
        }
    });

    await page.getByRole('button', { name: 'Actualizar lista' }).click();
    await page.pause(); // Ver los responses en la consola
});</code></pre>
        </div>
        </div>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔬 Combinación avanzada: Inspector + DevTools</h4>
            <p>Mientras estás pausado en el Inspector, las DevTools del navegador están completamente
            funcionales. Puedes:</p>
            <ul>
                <li><strong>Network tab:</strong> Ver requests, responses, headers, body</li>
                <li><strong>Elements tab:</strong> Inspeccionar el DOM directamente</li>
                <li><strong>Console tab:</strong> Ejecutar JavaScript en la página</li>
                <li><strong>Application tab:</strong> Ver cookies, localStorage, sessionStorage</li>
            </ul>
            <p>Esto te da una vista completa del estado de la aplicación en el momento exacto de la pausa.</p>
        </div>

        <h3>🔧 Flujos de debugging comunes</h3>
        <p>Veamos los problemas más frecuentes y cómo diagnosticarlos con el Inspector:</p>

        <h4>Problema 1: El localizador no encuentra el elemento</h4>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>❌ Síntoma</h4>
            <pre><code class="text">TimeoutError: locator.click: Timeout 30000ms exceeded.
=========================== logs ===========================
waiting for get_by_role("button", name="Submit")
============================================================</code></pre>
        </div>

        <div class="code-tabs" data-code-id="L093-7">
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
            <pre><code class="language-python"># Diagnóstico con el Inspector:
def test_diagnosticar_localizador(page):
    page.goto("https://mi-app.siesa.com/formulario")

    # 1. Pausar antes de la acción que falla
    page.pause()

    # 2. En el Inspector, escribir el localizador en el Locator Input:
    #    page.get_by_role("button", name="Submit")
    #    → "0 matches" ← ¡No existe!

    # 3. Usar el Pick Locator para hacer clic en el botón real
    #    → page.get_by_role("button", name="Enviar")
    #    ¡El botón dice "Enviar", no "Submit"!

    # 4. Corregir el localizador:
    page.get_by_role("button", name="Enviar").click()  # ✓ Correcto</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// Diagnóstico con el Inspector:
test('diagnosticar localizador', async ({ page }) => {
    await page.goto('https://mi-app.siesa.com/formulario');

    // 1. Pausar antes de la acción que falla
    await page.pause();

    // 2. En el Inspector, escribir el localizador en el Locator Input:
    //    page.getByRole('button', { name: 'Submit' })
    //    → "0 matches" ← ¡No existe!

    // 3. Usar el Pick Locator para hacer clic en el botón real
    //    → page.getByRole('button', { name: 'Enviar' })
    //    ¡El botón dice "Enviar", no "Submit"!

    // 4. Corregir el localizador:
    await page.getByRole('button', { name: 'Enviar' }).click(); // ✓ Correcto
});</code></pre>
        </div>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Checklist: Localizador no encontrado</h4>
            <ol>
                <li>¿El texto del botón/elemento es exacto? (mayúsculas, acentos, espacios)</li>
                <li>¿El elemento existe en el DOM? (puede estar en un iframe)</li>
                <li>¿El elemento está visible? (puede estar oculto con CSS)</li>
                <li>¿Necesita scroll? (el elemento puede estar fuera del viewport)</li>
                <li>¿El contenido es dinámico? (puede no haberse cargado aún)</li>
            </ol>
        </div>

        <h4>Problema 2: El clic no tiene efecto</h4>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>❌ Síntoma</h4>
            <p>El test hace clic en un botón pero no sucede nada — no hay error, pero la acción esperada
            no se ejecuta.</p>
        </div>

        <div class="code-tabs" data-code-id="L093-8">
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
            <pre><code class="language-python"># Diagnóstico paso a paso:
def test_diagnosticar_click(page):
    page.goto("https://erp.siesa.com/pedidos")

    # Pausa 1: Verificar que el botón es el correcto
    page.pause()
    # En el Inspector: Pick Locator → clic en el botón
    # Verificar que el localizador devuelve 1 match

    btn = page.get_by_role("button", name="Nuevo pedido")

    # Pausa 2: Verificar estado del botón antes del clic
    page.pause()
    # En DevTools Console:
    # document.querySelector('[data-testid="btn-nuevo"]').disabled
    # → true ← ¡El botón está deshabilitado!

    # Solución: Esperar a que el botón esté habilitado
    expect(btn).to_be_enabled(timeout=10000)
    btn.click()

    # Pausa 3: Verificar que la acción se ejecutó
    page.pause()
    expect(page.get_by_text("Nuevo pedido")).to_be_visible()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// Diagnóstico paso a paso:
test('diagnosticar click', async ({ page }) => {
    await page.goto('https://erp.siesa.com/pedidos');

    // Pausa 1: Verificar que el botón es el correcto
    await page.pause();
    // En el Inspector: Pick Locator → clic en el botón
    // Verificar que el localizador devuelve 1 match

    const btn = page.getByRole('button', { name: 'Nuevo pedido' });

    // Pausa 2: Verificar estado del botón antes del clic
    await page.pause();
    // En DevTools Console:
    // document.querySelector('[data-testid="btn-nuevo"]').disabled
    // → true ← ¡El botón está deshabilitado!

    // Solución: Esperar a que el botón esté habilitado
    await expect(btn).toBeEnabled({ timeout: 10000 });
    await btn.click();

    // Pausa 3: Verificar que la acción se ejecutó
    await page.pause();
    await expect(page.getByText('Nuevo pedido')).toBeVisible();
});</code></pre>
        </div>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Checklist: Clic sin efecto</h4>
            <ol>
                <li>¿El botón está <strong>enabled</strong>? (puede estar deshabilitado)</li>
                <li>¿Hay un <strong>overlay</strong> cubriendo el botón? (modal, spinner, tooltip)</li>
                <li>¿Se hace clic en el <strong>elemento correcto</strong>? (usar Pick Locator para confirmar)</li>
                <li>¿El handler del botón requiere un <strong>estado previo</strong>? (campos obligatorios sin llenar)</li>
                <li>¿Hay un <strong>event listener</strong> que previene el default? (check en DevTools > Elements > Event Listeners)</li>
            </ol>
        </div>

        <h3>🔑 Variables de entorno para debugging</h3>
        <p>Además de <code>PWDEBUG</code>, Playwright reconoce otras variables de entorno útiles para
        la depuración:</p>

        <pre><code class="bash"># ==========================================
# Variables de entorno de debugging
# ==========================================

# Activar el Inspector (la más importante)
PWDEBUG=1 pytest tests/

# Activar logging detallado de Playwright
# Muestra comunicación interna entre el test y el navegador
DEBUG=pw:api pytest tests/

# Logging de protocolos internos (muy verbose)
DEBUG=pw:protocol pytest tests/

# Logging selectivo por componente
DEBUG=pw:browser pytest tests/    # Solo logs del browser
DEBUG=pw:channel pytest tests/    # Solo logs de canales de comunicación

# Combinar múltiples niveles de logging
DEBUG=pw:api,pw:browser pytest tests/

# ==========================================
# Ejemplo en PowerShell (Windows)
# ==========================================
$env:DEBUG = "pw:api"
pytest tests/test_login.py -s
# Los logs pw:api se imprimen en la consola con -s

# ==========================================
# Desactivar PWDEBUG después de depurar
# ==========================================
# PowerShell
Remove-Item Env:PWDEBUG

# Linux/macOS (solo afecta la sesión actual)
unset PWDEBUG</code></pre>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔬 Avanzado: DEBUG=pw:api en detalle</h4>
            <p>Con <code>DEBUG=pw:api</code> activo, verás en la consola cada interacción entre tu test
            y el navegador. Esto es especialmente útil para diagnosticar problemas de timing:</p>
            <pre><code class="text">pw:api navigating to "https://erp.siesa.com/login" +0ms
pw:api waiting for navigation until "load" +125ms
pw:api navigated to "https://erp.siesa.com/login" +890ms
pw:api   locator.fill("admin@siesa.com") +2ms
pw:api     waiting for get_by_label("Usuario") +0ms
pw:api     locator resolved to &lt;input id="user" type="text"&gt; +45ms
pw:api     filling "&lt;input id="user" type="text"&gt;" +3ms
pw:api   locator.click() +1ms
pw:api     waiting for get_by_role("button", name="Login") +0ms
pw:api     locator resolved to &lt;button class="btn-primary"&gt; +12ms
pw:api     attempting click action +0ms
pw:api     waiting for element to be visible and enabled +0ms
pw:api     element is visible and enabled +5ms
pw:api     scrolling into view if needed +0ms
pw:api     performing click action +3ms</code></pre>
            <p>Cada línea muestra el tiempo transcurrido desde la acción anterior (<code>+Nms</code>),
            lo cual ayuda a identificar dónde se gasta tiempo innecesario.</p>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA: Debugging en CI vs local</h4>
            <p>En <strong>local</strong> usa <code>PWDEBUG=1</code> para el Inspector visual. En <strong>CI/CD</strong>
            (Jenkins, Azure DevOps, GitLab CI) usa <code>DEBUG=pw:api</code> para obtener logs detallados
            sin necesidad de interfaz gráfica. Los logs de pw:api se capturan en los artefactos del pipeline.</p>
        </div>

        <h3>🧩 Ejemplo completo: Flujo de debugging de principio a fin</h3>
        <p>Veamos un caso real donde un test falla y usamos el Inspector para diagnosticar y corregir:</p>

        <div class="code-tabs" data-code-id="L093-9">
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
            <pre><code class="language-python"># test_crear_cliente.py — Test que falla
from playwright.sync_api import expect

def test_crear_cliente(page):
    """
    Escenario: Crear un nuevo cliente en el módulo CRM
    Problema: El test falla con timeout en el botón "Guardar"
    """
    page.goto("https://erp.siesa.com/crm/clientes/nuevo")

    # Llenar datos del cliente
    page.get_by_label("NIT").fill("900123456-7")
    page.get_by_label("Razón social").fill("Empresa Demo S.A.S.")
    page.get_by_label("Ciudad").select_option("Cali")
    page.get_by_label("Teléfono").fill("3001234567")
    page.get_by_label("Email").fill("contacto@demo.com")

    # ❌ FALLA AQUÍ: TimeoutError
    page.get_by_role("button", name="Guardar").click()

    expect(page.get_by_text("Cliente creado")).to_be_visible()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// test_crear_cliente.spec.ts — Test que falla
import { test, expect } from '@playwright/test';

test('crear cliente', async ({ page }) => {
    // Escenario: Crear un nuevo cliente en el módulo CRM
    // Problema: El test falla con timeout en el botón "Guardar"

    await page.goto('https://erp.siesa.com/crm/clientes/nuevo');

    // Llenar datos del cliente
    await page.getByLabel('NIT').fill('900123456-7');
    await page.getByLabel('Razón social').fill('Empresa Demo S.A.S.');
    await page.getByLabel('Ciudad').selectOption('Cali');
    await page.getByLabel('Teléfono').fill('3001234567');
    await page.getByLabel('Email').fill('contacto@demo.com');

    // ❌ FALLA AQUÍ: TimeoutError
    await page.getByRole('button', { name: 'Guardar' }).click();

    await expect(page.getByText('Cliente creado')).toBeVisible();
});</code></pre>
        </div>
        </div>

        <div class="code-tabs" data-code-id="L093-10">
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
            <pre><code class="language-python"># test_crear_cliente_debug.py — Versión con debugging
from playwright.sync_api import expect
import os

def test_crear_cliente_debug(page):
    """
    Versión de debugging del test.
    Ejecutar: PWDEBUG=1 pytest test_crear_cliente_debug.py -s
    """
    page.goto("https://erp.siesa.com/crm/clientes/nuevo")

    # PASO 1: Verificar que la página cargó completamente
    page.pause()
    # 🔍 En el Inspector: ¿la URL es correcta? ¿El formulario está visible?

    page.get_by_label("NIT").fill("900123456-7")
    page.get_by_label("Razón social").fill("Empresa Demo S.A.S.")
    page.get_by_label("Ciudad").select_option("Cali")
    page.get_by_label("Teléfono").fill("3001234567")
    page.get_by_label("Email").fill("contacto@demo.com")

    # PASO 2: Verificar estado del formulario antes del clic
    page.pause()
    # 🔍 En el Inspector Locator Input:
    #    page.get_by_role("button", name="Guardar")
    #    → "0 matches" 😱
    #
    # 🔍 Usar Pick Locator → clic en el botón
    #    → page.get_by_role("button", name="Guardar registro")
    #    ¡El botón dice "Guardar registro", no solo "Guardar"!

    # PASO 3: Corregir y verificar
    page.get_by_role("button", name="Guardar registro").click()

    page.pause()
    # 🔍 Verificar que el mensaje de éxito apareció
    expect(page.get_by_text("Cliente creado")).to_be_visible()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// test_crear_cliente_debug.spec.ts — Versión con debugging
import { test, expect } from '@playwright/test';

test('crear cliente debug', async ({ page }) => {
    // Versión de debugging del test.
    // Ejecutar: PWDEBUG=1 npx playwright test test_crear_cliente_debug.spec.ts

    await page.goto('https://erp.siesa.com/crm/clientes/nuevo');

    // PASO 1: Verificar que la página cargó completamente
    await page.pause();
    // 🔍 En el Inspector: ¿la URL es correcta? ¿El formulario está visible?

    await page.getByLabel('NIT').fill('900123456-7');
    await page.getByLabel('Razón social').fill('Empresa Demo S.A.S.');
    await page.getByLabel('Ciudad').selectOption('Cali');
    await page.getByLabel('Teléfono').fill('3001234567');
    await page.getByLabel('Email').fill('contacto@demo.com');

    // PASO 2: Verificar estado del formulario antes del clic
    await page.pause();
    // 🔍 En el Inspector Locator Input:
    //    page.getByRole('button', { name: 'Guardar' })
    //    → "0 matches" 😱
    //
    // 🔍 Usar Pick Locator → clic en el botón
    //    → page.getByRole('button', { name: 'Guardar registro' })
    //    ¡El botón dice "Guardar registro", no solo "Guardar"!

    // PASO 3: Corregir y verificar
    await page.getByRole('button', { name: 'Guardar registro' }).click();

    await page.pause();
    // 🔍 Verificar que el mensaje de éxito apareció
    await expect(page.getByText('Cliente creado')).toBeVisible();
});</code></pre>
        </div>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Resumen del diagnóstico</h4>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #c8e6c9;">
                    <td style="padding: 8px;"><strong>Problema</strong></td>
                    <td style="padding: 8px;">El localizador "Guardar" no coincidía con el botón real</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><strong>Herramienta</strong></td>
                    <td style="padding: 8px;">Inspector: Locator Input + Pick Locator</td>
                </tr>
                <tr style="background: #c8e6c9;">
                    <td style="padding: 8px;"><strong>Causa raíz</strong></td>
                    <td style="padding: 8px;">El botón dice "Guardar registro", no "Guardar"</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><strong>Solución</strong></td>
                    <td style="padding: 8px;">Cambiar <code>name="Guardar"</code> por <code>name="Guardar registro"</code></td>
                </tr>
                <tr style="background: #c8e6c9;">
                    <td style="padding: 8px;"><strong>Tiempo</strong></td>
                    <td style="padding: 8px;">~2 minutos con el Inspector vs. 30+ sin él</td>
                </tr>
            </table>
        </div>

        <h3>📝 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🏋️ Ejercicio: Diagnosticar un test con el Inspector</h4>
            <p><strong>Objetivo:</strong> Usar el Playwright Inspector para identificar y corregir problemas
            en un test que falla.</p>

            <p><strong>Paso 1:</strong> Crea el siguiente archivo de test con errores intencionales:</p>
            <div class="code-tabs" data-code-id="L093-11">
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
                <pre><code class="language-python"># tests/test_debug_exercise.py
from playwright.sync_api import sync_playwright, expect

def test_formulario_debug():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        page.goto("https://the-internet.herokuapp.com/login")

        # 🔍 Punto de inspección 1
        page.pause()

        # ERROR 1: Localizador incorrecto para el username
        # Usa el Pick Locator para encontrar el correcto
        page.get_by_label("Username").fill("tomsmith")

        # ERROR 2: Localizador incorrecto para el password
        # Usa el Locator Input para verificar matches
        page.get_by_label("Password").fill("SuperSecretPassword!")

        # 🔍 Punto de inspección 2
        page.pause()

        # ERROR 3: Texto del botón incorrecto
        # Usa Step Over para ver qué pasa
        page.get_by_role("button", name="Sign In").click()

        # 🔍 Punto de inspección 3
        page.pause()

        # Verificar login exitoso
        expect(page.get_by_text("You logged into a secure area!")).to_be_visible()

        browser.close()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// tests/test_debug_exercise.spec.ts
import { chromium, expect } from 'playwright';

async function testFormularioDebug() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://the-internet.herokuapp.com/login');

    // 🔍 Punto de inspección 1
    await page.pause();

    // ERROR 1: Localizador incorrecto para el username
    // Usa el Pick Locator para encontrar el correcto
    await page.getByLabel('Username').fill('tomsmith');

    // ERROR 2: Localizador incorrecto para el password
    // Usa el Locator Input para verificar matches
    await page.getByLabel('Password').fill('SuperSecretPassword!');

    // 🔍 Punto de inspección 2
    await page.pause();

    // ERROR 3: Texto del botón incorrecto
    // Usa Step Over para ver qué pasa
    await page.getByRole('button', { name: 'Sign In' }).click();

    // 🔍 Punto de inspección 3
    await page.pause();

    // Verificar login exitoso
    await expect(page.getByText('You logged into a secure area!')).toBeVisible();

    await browser.close();
}</code></pre>
            </div>
            </div>

            <p><strong>Paso 2:</strong> Ejecuta el test con el Inspector:</p>
            <pre><code class="bash">PWDEBUG=1 python -m pytest tests/test_debug_exercise.py -s</code></pre>

            <p><strong>Paso 3:</strong> En cada punto de inspección (<code>page.pause()</code>), realiza
            las siguientes tareas:</p>
            <ol>
                <li><strong>Pausa 1:</strong> Usa el <strong>Pick Locator</strong> para hacer clic en el campo de username.
                ¿Qué localizador sugiere el Inspector? Compáralo con <code>get_by_label("Username")</code>.</li>
                <li><strong>Pausa 1:</strong> En el <strong>Locator Input</strong>, escribe <code>page.get_by_label("Username")</code>
                — ¿cuántos matches hay? Ahora prueba <code>page.locator("#username")</code>.</li>
                <li><strong>Pausa 2:</strong> Verifica que los campos se llenaron correctamente observando el navegador.</li>
                <li><strong>Pausa 2:</strong> En el <strong>Locator Input</strong>, escribe
                <code>page.get_by_role("button", name="Sign In")</code> — ¿coincide? Usa Pick Locator en el botón real.</li>
                <li><strong>Pausa 3:</strong> Verifica si el login fue exitoso mirando la URL y el contenido de la página.</li>
            </ol>

            <p><strong>Paso 4:</strong> Corrige los tres errores y crea la versión final sin <code>page.pause()</code>:</p>
            <div class="code-tabs" data-code-id="L093-12">
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
                <pre><code class="language-python"># tests/test_formulario_corregido.py
from playwright.sync_api import sync_playwright, expect

def test_formulario_corregido():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        page.goto("https://the-internet.herokuapp.com/login")

        # Corregido: usar localizador correcto para username
        page.locator("#username").fill("tomsmith")

        # Corregido: usar localizador correcto para password
        page.locator("#password").fill("SuperSecretPassword!")

        # Corregido: usar texto real del botón
        page.get_by_role("button", name="Login").click()

        # Verificar login exitoso
        expect(page.get_by_text("You logged into a secure area!")).to_be_visible()

        print("✅ Test corregido exitosamente con ayuda del Inspector")
        browser.close()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// tests/test_formulario_corregido.spec.ts
import { chromium, expect } from 'playwright';

async function testFormularioCorregido() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://the-internet.herokuapp.com/login');

    // Corregido: usar localizador correcto para username
    await page.locator('#username').fill('tomsmith');

    // Corregido: usar localizador correcto para password
    await page.locator('#password').fill('SuperSecretPassword!');

    // Corregido: usar texto real del botón
    await page.getByRole('button', { name: 'Login' }).click();

    // Verificar login exitoso
    await expect(page.getByText('You logged into a secure area!')).toBeVisible();

    console.log('✅ Test corregido exitosamente con ayuda del Inspector');
    await browser.close();
}</code></pre>
            </div>
            </div>

            <p><strong>Criterios de éxito:</strong></p>
            <ul>
                <li>Identificaste que <code>get_by_label</code> no funciona en esos inputs (no tienen label asociado)</li>
                <li>Encontraste los localizadores correctos usando el Pick Locator</li>
                <li>Verificaste en el Locator Input que el botón se llama "Login", no "Sign In"</li>
                <li>El test corregido pasa sin errores</li>
            </ul>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Resumen de la lección</h4>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                    <tr style="background: #00838f; color: white;">
                        <th style="padding: 8px; text-align: left;">Concepto</th>
                        <th style="padding: 8px; text-align: left;">Uso</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #e0f7fa;">
                        <td style="padding: 8px;"><code>PWDEBUG=1</code></td>
                        <td style="padding: 8px;">Activa el Inspector al ejecutar cualquier test</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><code>page.pause()</code></td>
                        <td style="padding: 8px;">Breakpoint programático en puntos específicos</td>
                    </tr>
                    <tr style="background: #e0f7fa;">
                        <td style="padding: 8px;">Pick Locator</td>
                        <td style="padding: 8px;">Clic en elemento → obtener localizador recomendado</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Locator Input</td>
                        <td style="padding: 8px;">Escribir localizador → ver matches en tiempo real</td>
                    </tr>
                    <tr style="background: #e0f7fa;">
                        <td style="padding: 8px;">Step Over</td>
                        <td style="padding: 8px;">Ejecutar una acción a la vez</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><code>DEBUG=pw:api</code></td>
                        <td style="padding: 8px;">Logs detallados para debugging en CI</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📚 Próxima lección</h4>
            <p>En la <strong>Lección 094: Playwright Codegen</strong> aprenderás a generar código de tests
            automáticamente grabando tus acciones en el navegador. Codegen complementa al Inspector:
            mientras el Inspector te ayuda a <strong>depurar</strong> tests existentes, Codegen te ayuda a
            <strong>crear</strong> tests nuevos desde cero.</p>
        </div>
    `,
    topics: ["inspector", "pwdebug", "debugging"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 8,
    difficulty: "medium",
    type: "foundation"
};

if (typeof window !== 'undefined') {
    window.LESSON_093 = LESSON_093;
}
