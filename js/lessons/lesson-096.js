/**
 * Playwright Academy - Lección 096
 * Debug avanzado: breakpoints y VS Code
 * Sección 14: Debugging: Inspector, Trace, Codegen
 */

const LESSON_096 = {
    id: 96,
    title: "Debug avanzado: breakpoints y VS Code",
    duration: "7 min",
    level: "intermediate",
    section: "section-14",
    content: `
        <h2>🔍 Debug avanzado: breakpoints y VS Code</h2>
        <p>Cuando un test falla y el <strong>Playwright Inspector</strong> o el <strong>Trace Viewer</strong>
        no son suficientes para entender la causa raíz, necesitas herramientas de debugging más profundas.
        En esta lección aprenderás a usar <strong>VS Code como debugger completo</strong> para tus tests
        de Playwright con Python: breakpoints, inspección de variables, call stack, debugging condicional
        y técnicas avanzadas que te darán control total sobre la ejecución de tus tests.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📘 Lo que aprenderás</h4>
            <ul>
                <li>Configurar <code>launch.json</code> para pytest + Playwright</li>
                <li>Usar breakpoints, breakpoints condicionales y logpoints</li>
                <li>Navegar con el debugger: step over, step into, step out</li>
                <li>Evaluar expresiones de Playwright en la Debug Console</li>
                <li>Debuggear fixtures y <code>conftest.py</code></li>
                <li>Remote debugging con attach configuration</li>
                <li>Usar <code>pdb</code>/<code>ipdb</code> como alternativa al debugger gráfico</li>
                <li>Logging verboso con <code>DEBUG=pw:api</code></li>
            </ul>
        </div>

        <h3>⚙️ 1. Configurar VS Code para debugging de Playwright</h3>
        <p>El primer paso es crear una configuración de lanzamiento en VS Code que ejecute
        pytest con los parámetros correctos para Playwright.</p>

        <h4>1.1 Crear <code>launch.json</code></h4>
        <pre><code class="json">// .vscode/launch.json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Debug Playwright Tests",
            "type": "debugpy",
            "request": "launch",
            "module": "pytest",
            "args": [
                "tests/",
                "-v",
                "--headed",
                "--slowmo", "500",
                "-x"
            ],
            "console": "integratedTerminal",
            "justMyCode": false,
            "env": {
                "PWDEBUG": "0"
            }
        },
        {
            "name": "Debug Test Actual (archivo abierto)",
            "type": "debugpy",
            "request": "launch",
            "module": "pytest",
            "args": [
                "\${file}",
                "-v",
                "--headed",
                "--slowmo", "300",
                "-x"
            ],
            "console": "integratedTerminal",
            "justMyCode": false
        },
        {
            "name": "Debug Test Específico",
            "type": "debugpy",
            "request": "launch",
            "module": "pytest",
            "args": [
                "\${file}::\${selectedText}",
                "-v",
                "--headed",
                "-x"
            ],
            "console": "integratedTerminal",
            "justMyCode": false
        }
    ]
}</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>En SIESA usamos <code>justMyCode: false</code> para poder entrar en el código interno
            de Playwright cuando necesitamos entender por qué un selector no funciona o un wait
            se comporta diferente a lo esperado. Esto es especialmente útil al depurar interacciones
            con los módulos ERP que tienen DOM complejo.</p>
        </div>

        <h4>1.2 Parámetros clave explicados</h4>
        <pre><code class="python"># --headed: Abre el navegador visible (esencial para debug visual)
# --slowmo 500: Pausa 500ms entre acciones (ver qué hace el test)
# -x: Detener al primer fallo (no ejecutar los demás)
# justMyCode: false → permite entrar en código de Playwright/pytest

# Ejemplo: configuración para debug con browser específico
# En launch.json args:
"args": [
    "tests/test_login.py",
    "-v",
    "--headed",
    "--browser", "chromium",
    "--slowmo", "300",
    "-x",
    "-s"  # Mostrar prints en la terminal
]</code></pre>

        <h3>🔴 2. Breakpoints en VS Code</h3>
        <p>Los breakpoints son el corazón del debugging. Permiten pausar la ejecución en una
        línea específica para inspeccionar el estado del test.</p>

        <h4>2.1 Breakpoints básicos</h4>
        <div class="code-tabs" data-code-id="L096-1">
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
            <pre><code class="language-python"># tests/test_login_debug.py
import pytest
from playwright.sync_api import Page, expect


class TestLoginDebug:
    """Test de login con puntos estratégicos para debug."""

    def test_login_exitoso(self, page: Page):
        # 🔴 Breakpoint AQUÍ → verificar que page está inicializada
        page.goto("https://mi-app.siesa.com/login")

        # 🔴 Breakpoint AQUÍ → verificar que la página cargó
        page.get_by_label("Usuario").fill("admin@siesa.com")
        page.get_by_label("Contraseña").fill("password123")

        # 🔴 Breakpoint AQUÍ → verificar valores antes del click
        page.get_by_role("button", name="Iniciar sesión").click()

        # 🔴 Breakpoint AQUÍ → verificar navegación post-login
        expect(page).to_have_url("**/dashboard")
        expect(page.get_by_text("Bienvenido")).to_be_visible()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// tests/test_login_debug.spec.ts
import { test, expect } from '@playwright/test';


test.describe('TestLoginDebug', () => {

    test('login exitoso', async ({ page }) => {
        // 🔴 Breakpoint AQUÍ → verificar que page está inicializada
        await page.goto('https://mi-app.siesa.com/login');

        // 🔴 Breakpoint AQUÍ → verificar que la página cargó
        await page.getByLabel('Usuario').fill('admin@siesa.com');
        await page.getByLabel('Contraseña').fill('password123');

        // 🔴 Breakpoint AQUÍ → verificar valores antes del click
        await page.getByRole('button', { name: 'Iniciar sesión' }).click();

        // 🔴 Breakpoint AQUÍ → verificar navegación post-login
        await expect(page).toHaveURL('**/dashboard');
        await expect(page.getByText('Bienvenido')).toBeVisible();
    });
});</code></pre>
        </div>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Cómo poner breakpoints en VS Code</h4>
            <ol>
                <li><strong>Click en el margen izquierdo</strong> (gutter) junto al número de línea → aparece un punto rojo</li>
                <li><strong>F9</strong> con el cursor en la línea deseada → toggle del breakpoint</li>
                <li><strong>Ctrl+Shift+B</strong> → ver todos los breakpoints en el panel</li>
                <li><strong>Click derecho en el gutter</strong> → opciones avanzadas (condicional, logpoint, hit count)</li>
            </ol>
        </div>

        <h4>2.2 Breakpoints condicionales</h4>
        <p>Los breakpoints condicionales solo se activan cuando se cumple una condición.
        Son esenciales para debuggear loops o tests parametrizados.</p>

        <div class="code-tabs" data-code-id="L096-2">
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
            <pre><code class="language-python"># tests/test_tabla_debug.py
import pytest
from playwright.sync_api import Page, expect


class TestTablaDebug:
    """Debug de interacción con tabla usando breakpoints condicionales."""

    @pytest.mark.parametrize("usuario,rol", [
        ("admin@siesa.com", "Administrador"),
        ("editor@siesa.com", "Editor"),
        ("viewer@siesa.com", "Visor"),       # ← Este falla
        ("auditor@siesa.com", "Auditor"),
    ])
    def test_verificar_rol_usuario(self, page: Page, usuario: str, rol: str):
        page.goto("https://mi-app.siesa.com/admin/usuarios")

        # 🔴 Breakpoint condicional: usuario == "viewer@siesa.com"
        # Click derecho en gutter → "Add Conditional Breakpoint"
        # Expresión: usuario == "viewer@siesa.com"
        fila = page.get_by_role("row").filter(has_text=usuario)
        celda_rol = fila.get_by_test_id("columna-rol")

        # Solo se pausa cuando el usuario es "viewer@siesa.com"
        expect(celda_rol).to_have_text(rol)

    def test_procesar_filas_tabla(self, page: Page):
        page.goto("https://mi-app.siesa.com/reportes")
        filas = page.get_by_role("row").all()

        for i, fila in enumerate(filas):
            # 🔴 Breakpoint condicional: i == 5
            # Solo pausa en la fila índice 5
            texto = fila.inner_text()
            assert "ERROR" not in texto, f"Fila {i} contiene ERROR: {texto}"</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// tests/test_tabla_debug.spec.ts
import { test, expect } from '@playwright/test';


test.describe('TestTablaDebug', () => {

    const usuarios = [
        { usuario: 'admin@siesa.com', rol: 'Administrador' },
        { usuario: 'editor@siesa.com', rol: 'Editor' },
        { usuario: 'viewer@siesa.com', rol: 'Visor' },       // ← Este falla
        { usuario: 'auditor@siesa.com', rol: 'Auditor' },
    ];

    for (const { usuario, rol } of usuarios) {
        test(\`verificar rol usuario: \${usuario}\`, async ({ page }) => {
            await page.goto('https://mi-app.siesa.com/admin/usuarios');

            // 🔴 Breakpoint condicional: usuario === "viewer@siesa.com"
            // Click derecho en gutter → "Add Conditional Breakpoint"
            // Expresión: usuario === "viewer@siesa.com"
            const fila = page.getByRole('row').filter({ hasText: usuario });
            const celdaRol = fila.getByTestId('columna-rol');

            // Solo se pausa cuando el usuario es "viewer@siesa.com"
            await expect(celdaRol).toHaveText(rol);
        });
    }

    test('procesar filas tabla', async ({ page }) => {
        await page.goto('https://mi-app.siesa.com/reportes');
        const filas = await page.getByRole('row').all();

        for (let i = 0; i < filas.length; i++) {
            // 🔴 Breakpoint condicional: i === 5
            // Solo pausa en la fila índice 5
            const texto = await filas[i].innerText();
            expect(texto).not.toContain('ERROR');
        }
    });
});</code></pre>
        </div>
        </div>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔮 Tipos de breakpoints en VS Code</h4>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #ce93d8; color: white;">
                    <th style="padding: 8px; text-align: left;">Tipo</th>
                    <th style="padding: 8px; text-align: left;">Cómo crearlo</th>
                    <th style="padding: 8px; text-align: left;">Uso típico</th>
                </tr>
                <tr style="background: #f3e5f5;">
                    <td style="padding: 8px;"><strong>Regular</strong></td>
                    <td style="padding: 8px;">Click en gutter / F9</td>
                    <td style="padding: 8px;">Pausar siempre en esa línea</td>
                </tr>
                <tr style="background: #fce4ec;">
                    <td style="padding: 8px;"><strong>Condicional</strong></td>
                    <td style="padding: 8px;">Click derecho → Expression</td>
                    <td style="padding: 8px;">Pausar solo si condición es True</td>
                </tr>
                <tr style="background: #f3e5f5;">
                    <td style="padding: 8px;"><strong>Hit Count</strong></td>
                    <td style="padding: 8px;">Click derecho → Hit Count</td>
                    <td style="padding: 8px;">Pausar en la N-ésima ejecución</td>
                </tr>
                <tr style="background: #fce4ec;">
                    <td style="padding: 8px;"><strong>Logpoint</strong></td>
                    <td style="padding: 8px;">Click derecho → Log Message</td>
                    <td style="padding: 8px;">Imprimir sin pausar (como print)</td>
                </tr>
                <tr style="background: #f3e5f5;">
                    <td style="padding: 8px;"><strong>Exception</strong></td>
                    <td style="padding: 8px;">Panel Breakpoints → Exceptions</td>
                    <td style="padding: 8px;">Pausar al lanzar excepción</td>
                </tr>
            </table>
        </div>

        <h4>2.3 Logpoints: prints sin modificar código</h4>
        <div class="code-tabs" data-code-id="L096-3">
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
            <pre><code class="language-python"># En lugar de agregar prints temporales en el código:
# print(f"DEBUG: usuario={usuario}, url={page.url}")

# Usa un Logpoint en VS Code:
# Click derecho en gutter → "Add Logpoint..."
# Mensaje: "usuario={usuario}, url={page.url}, título={page.title()}"
# Los logpoints se muestran en la Debug Console sin pausar ejecución

# Ejemplo de test donde logpoints son útiles:
class TestNavegacion:
    def test_flujo_completo(self, page: Page):
        page.goto("https://mi-app.siesa.com")
        # Logpoint: "Paso 1 - URL: {page.url}"

        page.get_by_role("link", name="Reportes").click()
        # Logpoint: "Paso 2 - URL: {page.url}, título: {page.title()}"

        page.get_by_role("link", name="Ventas Q1").click()
        # Logpoint: "Paso 3 - URL: {page.url}"

        expect(page.get_by_text("Reporte de Ventas")).to_be_visible()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// En lugar de agregar console.log temporales en el código:
// console.log(\`DEBUG: usuario=\${usuario}, url=\${page.url()}\`);

// Usa un Logpoint en VS Code:
// Click derecho en gutter → "Add Logpoint..."
// Mensaje: "usuario={usuario}, url={page.url()}, título={await page.title()}"
// Los logpoints se muestran en la Debug Console sin pausar ejecución

// Ejemplo de test donde logpoints son útiles:
test.describe('TestNavegacion', () => {
    test('flujo completo', async ({ page }) => {
        await page.goto('https://mi-app.siesa.com');
        // Logpoint: "Paso 1 - URL: {page.url()}"

        await page.getByRole('link', { name: 'Reportes' }).click();
        // Logpoint: "Paso 2 - URL: {page.url()}, título: {await page.title()}"

        await page.getByRole('link', { name: 'Ventas Q1' }).click();
        // Logpoint: "Paso 3 - URL: {page.url()}"

        await expect(page.getByText('Reporte de Ventas')).toBeVisible();
    });
});</code></pre>
        </div>
        </div>

        <h3>🔎 3. Navegación con el debugger de VS Code</h3>
        <p>Una vez que el debugger se detiene en un breakpoint, tienes control total
        sobre la ejecución paso a paso.</p>

        <h4>3.1 Controles de ejecución</h4>
        <div class="code-tabs" data-code-id="L096-4">
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
            <pre><code class="language-python"># Atajos del debugger de VS Code:
#
# F5        → Continue    (reanudar hasta el siguiente breakpoint)
# F10       → Step Over   (ejecutar línea actual, no entrar en funciones)
# F11       → Step Into   (entrar dentro de la función/método llamado)
# Shift+F11 → Step Out    (salir de la función actual, volver al caller)
# Ctrl+Shift+F5 → Restart (reiniciar sesión de debug)
# Shift+F5  → Stop        (detener debugging)

# Ejemplo práctico: debugging paso a paso
class TestCheckoutDebug:
    def test_proceso_compra(self, page: Page):
        page.goto("https://mi-app.siesa.com/tienda")

        # F10 (Step Over) → ejecuta goto, no entra en internals
        page.get_by_test_id("producto-001").click()

        # F11 (Step Into) → si llamas una función propia, entra en ella
        self._agregar_al_carrito(page)

        # F10 → ejecuta todo _agregar_al_carrito de una vez
        page.get_by_role("button", name="Pagar").click()

        expect(page).to_have_url("**/checkout")

    def _agregar_al_carrito(self, page: Page):
        """F11 en la llamada anterior te trae aquí."""
        page.get_by_role("button", name="Agregar al carrito").click()
        page.get_by_text("Producto agregado").wait_for()
        return page.get_by_test_id("cart-count").inner_text()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// Atajos del debugger de VS Code:
//
// F5        → Continue    (reanudar hasta el siguiente breakpoint)
// F10       → Step Over   (ejecutar línea actual, no entrar en funciones)
// F11       → Step Into   (entrar dentro de la función/método llamado)
// Shift+F11 → Step Out    (salir de la función actual, volver al caller)
// Ctrl+Shift+F5 → Restart (reiniciar sesión de debug)
// Shift+F5  → Stop        (detener debugging)

// Ejemplo práctico: debugging paso a paso
import { test, expect, Page } from '@playwright/test';

class CheckoutPage {
    constructor(private page: Page) {}

    async agregarAlCarrito(): Promise&lt;string&gt; {
        // F11 en la llamada anterior te trae aquí.
        await this.page.getByRole('button', { name: 'Agregar al carrito' }).click();
        await this.page.getByText('Producto agregado').waitFor();
        return await this.page.getByTestId('cart-count').innerText();
    }
}

test('proceso compra', async ({ page }) => {
    await page.goto('https://mi-app.siesa.com/tienda');

    // F10 (Step Over) → ejecuta goto, no entra en internals
    await page.getByTestId('producto-001').click();

    // F11 (Step Into) → si llamas una función propia, entra en ella
    const checkout = new CheckoutPage(page);
    await checkout.agregarAlCarrito();

    // F10 → ejecuta todo agregarAlCarrito de una vez
    await page.getByRole('button', { name: 'Pagar' }).click();

    await expect(page).toHaveURL('**/checkout');
});</code></pre>
        </div>
        </div>

        <h4>3.2 Paneles del debugger</h4>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📊 Paneles esenciales durante el debug</h4>
            <ul>
                <li><strong>Variables:</strong> Muestra variables locales, globales y sus valores actuales.
                Aquí verás el objeto <code>page</code>, los locators, y cualquier variable de tu test.</li>
                <li><strong>Watch:</strong> Agrega expresiones personalizadas para monitorear.
                Ejemplo: <code>page.url</code>, <code>len(filas)</code>, <code>page.title()</code></li>
                <li><strong>Call Stack:</strong> Muestra la cadena de llamadas que llegó al punto actual.
                Útil para entender el flujo pytest → fixture → conftest → test.</li>
                <li><strong>Breakpoints:</strong> Lista todos tus breakpoints con toggles para activar/desactivar.</li>
            </ul>
        </div>

        <h3>💬 4. Debug Console: evaluar expresiones en tiempo real</h3>
        <p>La <strong>Debug Console</strong> de VS Code es una herramienta muy poderosa. Cuando el debugger
        está pausado en un breakpoint, puedes escribir expresiones Python que se evalúan en el
        contexto actual del test, incluyendo llamadas a Playwright.</p>

        <div class="code-tabs" data-code-id="L096-5">
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
            <pre><code class="language-python"># Mientras estás pausado en un breakpoint, escribe en la Debug Console:

# ---- Inspeccionar el estado de la página ----
page.url
# → 'https://mi-app.siesa.com/login'

page.title()
# → 'SIESA - Iniciar sesión'

# ---- Verificar elementos ----
page.get_by_role("button", name="Iniciar sesión").is_visible()
# → True

page.get_by_label("Usuario").input_value()
# → 'admin@siesa.com'

# ---- Contar elementos ----
page.get_by_role("row").count()
# → 15

# ---- Ver HTML de un elemento ----
page.get_by_test_id("tabla-usuarios").inner_html()
# → '<thead>...<tbody>...'

# ---- Ejecutar acciones de prueba ----
page.get_by_label("Buscar").fill("test")
# (rellena el campo en tiempo real en el navegador)

# ---- Evaluar localizadores problemáticos ----
page.locator("css=.btn-primary").count()
# → 3  (¡por eso falla: hay 3 botones, no 1!)

# ---- Tomar screenshot manual ----
page.screenshot(path="debug_screenshot.png")

# ---- Obtener atributos de un elemento ----
page.get_by_role("link", name="Dashboard").get_attribute("href")
# → '/dashboard'</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// Mientras estás pausado en un breakpoint, escribe en la Debug Console:

// ---- Inspeccionar el estado de la página ----
page.url()
// → 'https://mi-app.siesa.com/login'

await page.title()
// → 'SIESA - Iniciar sesión'

// ---- Verificar elementos ----
await page.getByRole('button', { name: 'Iniciar sesión' }).isVisible()
// → true

await page.getByLabel('Usuario').inputValue()
// → 'admin@siesa.com'

// ---- Contar elementos ----
await page.getByRole('row').count()
// → 15

// ---- Ver HTML de un elemento ----
await page.getByTestId('tabla-usuarios').innerHTML()
// → '&lt;thead&gt;...&lt;tbody&gt;...'

// ---- Ejecutar acciones de prueba ----
await page.getByLabel('Buscar').fill('test')
// (rellena el campo en tiempo real en el navegador)

// ---- Evaluar localizadores problemáticos ----
await page.locator('.btn-primary').count()
// → 3  (¡por eso falla: hay 3 botones, no 1!)

// ---- Tomar screenshot manual ----
await page.screenshot({ path: 'debug_screenshot.png' })

// ---- Obtener atributos de un elemento ----
await page.getByRole('link', { name: 'Dashboard' }).getAttribute('href')
// → '/dashboard'</code></pre>
        </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>Cuando debuggeamos formularios del ERP en SIESA, usamos la Debug Console para
            explorar el DOM en tiempo real: <code>page.locator("form").inner_html()</code> nos muestra
            la estructura exacta del formulario, y podemos probar diferentes selectores hasta
            encontrar el correcto, <strong>sin reiniciar el test</strong>.</p>
        </div>

        <h3>🧩 5. Debugging de fixtures y conftest.py</h3>
        <p>Muchos errores no están en el test sino en la configuración: fixtures que no
        inicializan correctamente, datos de prueba incompletos o problemas en el <code>conftest.py</code>.
        VS Code permite poner breakpoints directamente en estos archivos.</p>

        <div class="code-tabs" data-code-id="L096-6">
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
            <pre><code class="language-python"># conftest.py - con puntos de debug estratégicos
import pytest
from playwright.sync_api import Page, Browser, BrowserContext


@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    """Fixture que configura el contexto del navegador."""
    # 🔴 Breakpoint aquí para verificar args originales
    return {
        **browser_context_args,
        "viewport": {"width": 1920, "height": 1080},
        "locale": "es-CO",
        "timezone_id": "America/Bogota",
    }


@pytest.fixture
def pagina_autenticada(page: Page):
    """Fixture que entrega una página ya logueada."""
    # 🔴 Breakpoint aquí → verificar que page existe
    page.goto("https://mi-app.siesa.com/login")

    # 🔴 Breakpoint aquí → verificar que la página cargó
    page.get_by_label("Usuario").fill("test@siesa.com")
    page.get_by_label("Contraseña").fill("test123")
    page.get_by_role("button", name="Iniciar sesión").click()

    # 🔴 Breakpoint aquí → verificar redirección post-login
    page.wait_for_url("**/dashboard")

    yield page

    # 🔴 Breakpoint aquí → teardown, verificar cleanup
    page.goto("https://mi-app.siesa.com/logout")


@pytest.fixture
def datos_empleado():
    """Fixture con datos de prueba para módulo HCM."""
    # 🔴 Breakpoint aquí si los datos no son los esperados
    return {
        "nombre": "Juan Pérez",
        "documento": "1234567890",
        "cargo": "Desarrollador",
        "departamento": "Tecnología",
        "fecha_ingreso": "2024-01-15",
    }


# Test que usa las fixtures
class TestEmpleado:
    def test_crear_empleado(
        self, pagina_autenticada: Page, datos_empleado: dict
    ):
        """VS Code te permite poner breakpoints en conftest.py
        Y verás la ejecución: fixture → test → teardown."""
        page = pagina_autenticada

        # 🔴 Breakpoint → inspeccionar datos_empleado en Variables panel
        page.goto("https://mi-app.siesa.com/hcm/empleados/nuevo")
        page.get_by_label("Nombre completo").fill(datos_empleado["nombre"])
        page.get_by_label("Documento").fill(datos_empleado["documento"])
        page.get_by_role("button", name="Guardar").click()

        expect(page.get_by_text("Empleado creado")).to_be_visible()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// playwright.config.ts - con puntos de debug estratégicos
import { defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        // 🔴 Breakpoint aquí para verificar config
        viewport: { width: 1920, height: 1080 },
        locale: 'es-CO',
        timezoneId: 'America/Bogota',
    },
});

// tests/fixtures.ts - fixtures personalizados
import { test as base, expect, Page } from '@playwright/test';

interface DatosEmpleado {
    nombre: string;
    documento: string;
    cargo: string;
    departamento: string;
    fechaIngreso: string;
}

const test = base.extend&lt;{
    paginaAutenticada: Page;
    datosEmpleado: DatosEmpleado;
}&gt;({
    paginaAutenticada: async ({ page }, use) => {
        // 🔴 Breakpoint aquí → verificar que page existe
        await page.goto('https://mi-app.siesa.com/login');

        // 🔴 Breakpoint aquí → verificar que la página cargó
        await page.getByLabel('Usuario').fill('test@siesa.com');
        await page.getByLabel('Contraseña').fill('test123');
        await page.getByRole('button', { name: 'Iniciar sesión' }).click();

        // 🔴 Breakpoint aquí → verificar redirección post-login
        await page.waitForURL('**/dashboard');

        await use(page);

        // 🔴 Breakpoint aquí → teardown, verificar cleanup
        await page.goto('https://mi-app.siesa.com/logout');
    },

    datosEmpleado: async ({}, use) => {
        // 🔴 Breakpoint aquí si los datos no son los esperados
        await use({
            nombre: 'Juan Pérez',
            documento: '1234567890',
            cargo: 'Desarrollador',
            departamento: 'Tecnología',
            fechaIngreso: '2024-01-15',
        });
    },
});

// Test que usa las fixtures
test.describe('TestEmpleado', () => {
    test('crear empleado', async ({ paginaAutenticada, datosEmpleado }) => {
        // VS Code te permite poner breakpoints en fixtures.ts
        // Y verás la ejecución: fixture → test → teardown.
        const page = paginaAutenticada;

        // 🔴 Breakpoint → inspeccionar datosEmpleado en Variables panel
        await page.goto('https://mi-app.siesa.com/hcm/empleados/nuevo');
        await page.getByLabel('Nombre completo').fill(datosEmpleado.nombre);
        await page.getByLabel('Documento').fill(datosEmpleado.documento);
        await page.getByRole('button', { name: 'Guardar' }).click();

        await expect(page.getByText('Empleado creado')).toBeVisible();
    });
});</code></pre>
        </div>
        </div>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔮 Flujo de ejecución con fixtures</h4>
            <p>Cuando debuggeas un test con fixtures, el call stack muestra:</p>
            <ol>
                <li><code>pytest</code> → orquestador principal</li>
                <li><code>conftest.py::browser_context_args</code> → configuración de contexto</li>
                <li><code>conftest.py::pagina_autenticada</code> → setup del fixture</li>
                <li><code>test_empleado.py::test_crear_empleado</code> → tu test</li>
                <li><code>conftest.py::pagina_autenticada</code> → teardown (después del yield)</li>
            </ol>
            <p>Puedes poner breakpoints en <strong>cualquiera</strong> de estos puntos.</p>
        </div>

        <h3>🔗 6. Remote debugging con attach</h3>
        <p>En algunos escenarios necesitas attacharte a un proceso de pytest que ya está
        corriendo, por ejemplo en un contenedor Docker o en un servidor CI.</p>

        <div class="code-tabs" data-code-id="L096-7">
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
            <pre><code class="language-python"># Paso 1: Instalar debugpy en el entorno remoto
# pip install debugpy

# Paso 2: Ejecutar pytest con debugpy escuchando
# python -m debugpy --listen 0.0.0.0:5678 --wait-for-client -m pytest tests/ -v --headed

# Paso 3: Configuración en launch.json para attach
# {
#     "name": "Attach Remote Playwright",
#     "type": "debugpy",
#     "request": "attach",
#     "connect": {
#         "host": "localhost",
#         "port": 5678
#     },
#     "pathMappings": [
#         {
#             "localRoot": "\${workspaceFolder}",
#             "remoteRoot": "/app"
#         }
#     ],
#     "justMyCode": false
# }

# Paso 4: En VS Code, seleccionar "Attach Remote Playwright" y presionar F5
# El proceso remoto se reanuda y los breakpoints locales funcionan</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// Paso 1: Instalar dependencias en el entorno remoto
// npm install @playwright/test

// Paso 2: Ejecutar Playwright con el inspector de Node.js
// node --inspect=0.0.0.0:9229 node_modules/.bin/playwright test --headed

// Paso 3: Configuración en launch.json para attach
// {
//     "name": "Attach Remote Playwright",
//     "type": "node",
//     "request": "attach",
//     "address": "localhost",
//     "port": 9229,
//     "localRoot": "\${workspaceFolder}",
//     "remoteRoot": "/app",
//     "skipFiles": ["&lt;node_internals&gt;/**"]
// }

// Paso 4: En VS Code, seleccionar "Attach Remote Playwright" y presionar F5
// El proceso remoto se reanuda y los breakpoints locales funcionan

// Alternativa: usar PWDEBUG para abrir el Inspector de Playwright
// PWDEBUG=1 npx playwright test --headed</code></pre>
        </div>
        </div>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📘 Docker Compose para debug remoto</h4>
            <pre><code class="yaml"># docker-compose.debug.yml
version: "3.8"
services:
  playwright-tests:
    build: .
    ports:
      - "5678:5678"   # debugpy
    command: >
      python -m debugpy --listen 0.0.0.0:5678
      --wait-for-client -m pytest tests/ -v --headed
    environment:
      - DISPLAY=:99
    volumes:
      - ./tests:/app/tests
      - ./pages:/app/pages</code></pre>
        </div>

        <h3>🐍 7. pdb e ipdb: debugging desde la terminal</h3>
        <p>Cuando no puedes usar VS Code (CI, SSH, contenedores sin GUI), <code>pdb</code> y
        <code>ipdb</code> son alternativas poderosas para debugging interactivo.</p>

        <div class="code-tabs" data-code-id="L096-8">
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
            <pre><code class="language-python"># tests/test_con_pdb.py
import pytest
from playwright.sync_api import Page, expect


class TestConPdb:
    """Ejemplo de debugging con pdb/ipdb inline."""

    def test_login_con_breakpoint(self, page: Page):
        page.goto("https://mi-app.siesa.com/login")

        # Opción 1: breakpoint() nativo de Python 3.7+
        # Se activa automáticamente al ejecutar con: pytest -s
        breakpoint()  # Pausa aquí y abre consola pdb

        page.get_by_label("Usuario").fill("admin@siesa.com")
        page.get_by_label("Contraseña").fill("password123")
        page.get_by_role("button", name="Iniciar sesión").click()

        # Opción 2: import pdb explícito
        import pdb; pdb.set_trace()  # Equivalente a breakpoint()

        expect(page).to_have_url("**/dashboard")

    def test_tabla_con_ipdb(self, page: Page):
        """ipdb ofrece syntax highlighting y autocompletado."""
        page.goto("https://mi-app.siesa.com/reportes")

        filas = page.get_by_role("row").all()

        # Opción 3: ipdb (instalar con pip install ipdb)
        import ipdb; ipdb.set_trace()

        # En la consola ipdb puedes:
        # (ipdb) page.url              → ver URL actual
        # (ipdb) len(filas)            → contar filas
        # (ipdb) filas[0].inner_text() → ver contenido de primera fila
        # (ipdb) n                     → next line (step over)
        # (ipdb) s                     → step into
        # (ipdb) c                     → continue
        # (ipdb) l                     → list code around current line
        # (ipdb) p variable            → print variable
        # (ipdb) pp variable           → pretty print
        # (ipdb) q                     → quit debugger

        for fila in filas:
            assert fila.is_visible()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// tests/test_con_debugger.spec.ts
import { test, expect } from '@playwright/test';


test.describe('TestConDebugger', () => {

    test('login con breakpoint', async ({ page }) => {
        await page.goto('https://mi-app.siesa.com/login');

        // Opción 1: debugger nativo de JavaScript
        // Se activa al ejecutar con: PWDEBUG=1 npx playwright test
        debugger; // Pausa aquí y abre el inspector de Node.js

        await page.getByLabel('Usuario').fill('admin@siesa.com');
        await page.getByLabel('Contraseña').fill('password123');
        await page.getByRole('button', { name: 'Iniciar sesión' }).click();

        // Opción 2: page.pause() abre el Playwright Inspector
        await page.pause(); // Equivalente visual al debugger

        await expect(page).toHaveURL('**/dashboard');
    });

    test('tabla con debugger', async ({ page }) => {
        // page.pause() ofrece UI interactiva con el Inspector de Playwright
        await page.goto('https://mi-app.siesa.com/reportes');

        const filas = await page.getByRole('row').all();

        // Opción 3: page.pause() (equivalente a ipdb en Python)
        await page.pause();

        // En la consola del Inspector puedes:
        // > page.url()               → ver URL actual
        // > filas.length              → contar filas
        // > filas[0].innerText()      → ver contenido de primera fila
        // En el panel de Node.js:
        // n                           → next line (step over)
        // s                           → step into
        // c                           → continue
        // .exit                       → quit debugger

        for (const fila of filas) {
            await expect(fila).toBeVisible();
        }
    });
});</code></pre>
        </div>
        </div>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>❌ Error común con pdb y pytest</h4>
            <p><strong>Problema:</strong> <code>breakpoint()</code> no funciona o no muestra la consola.</p>
            <p><strong>Causa:</strong> pytest captura stdout/stderr por defecto.</p>
            <p><strong>Solución:</strong> Ejecutar con la flag <code>-s</code> para desactivar la captura:</p>
            <pre><code class="bash"># Incorrecto - pdb no funciona
pytest tests/test_con_pdb.py

# Correcto - permite stdin/stdout para pdb
pytest tests/test_con_pdb.py -s

# También funciona con --capture=no
pytest tests/test_con_pdb.py --capture=no -v</code></pre>
        </div>

        <h3>📋 8. Verbose logging: DEBUG=pw:api</h3>
        <p>Playwright tiene un sistema de logging integrado que muestra cada llamada a la API
        con sus parámetros y tiempos. Es ideal cuando necesitas ver <strong>qué hace Playwright
        internamente</strong> sin poner breakpoints.</p>

        <pre><code class="bash"># Activar logging detallado de la API de Playwright
# Linux/Mac:
DEBUG=pw:api pytest tests/test_login.py -v -s

# Windows (PowerShell):
$env:DEBUG="pw:api"; pytest tests/test_login.py -v -s

# Windows (CMD):
set DEBUG=pw:api && pytest tests/test_login.py -v -s

# Niveles de logging disponibles:
DEBUG=pw:api         # Solo llamadas a la API (recomendado)
DEBUG=pw:browser     # Logs del navegador
DEBUG=pw:protocol    # Protocolo CDP completo (muy verboso)
DEBUG=pw:*           # Todo (genera mucho output)</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Ejemplo de output con DEBUG=pw:api</h4>
            <pre><code class="text">pw:api navigating to "https://mi-app.siesa.com/login" +0ms
pw:api waiting for navigation to "https://mi-app.siesa.com/login" +245ms
pw:api   navigated to "https://mi-app.siesa.com/login" +312ms
pw:api filling "Usuario" with "admin@siesa.com" +15ms
pw:api   locator resolved to &lt;input id="email" type="text" /&gt; +8ms
pw:api   fill done +22ms
pw:api filling "Contraseña" with "***" +5ms
pw:api   locator resolved to &lt;input id="password" type="password" /&gt; +6ms
pw:api clicking "Iniciar sesión" +12ms
pw:api   locator resolved to &lt;button type="submit"&gt;Iniciar sesión&lt;/button&gt; +4ms
pw:api   waiting for element to be visible +2ms
pw:api   element is visible +1ms
pw:api   click done +85ms</code></pre>
            <p>Este log te muestra exactamente qué localizador resolvió Playwright,
            cuánto tardó cada acción y si hubo esperas adicionales.</p>
        </div>

        <h4>8.1 Logging en launch.json</h4>
        <pre><code class="json">// Agregar DEBUG a la configuración de VS Code
{
    "name": "Debug con Playwright Logging",
    "type": "debugpy",
    "request": "launch",
    "module": "pytest",
    "args": [
        "\${file}",
        "-v",
        "-s",
        "--headed"
    ],
    "console": "integratedTerminal",
    "justMyCode": false,
    "env": {
        "DEBUG": "pw:api"
    }
}</code></pre>

        <h3>🔧 9. Escenarios comunes de debugging y soluciones</h3>
        <p>Estos son los problemas más frecuentes que encontrarás al debuggear tests de
        Playwright y cómo resolverlos con las herramientas aprendidas.</p>

        <h4>9.1 Elemento no encontrado (TimeoutError)</h4>
        <div class="code-tabs" data-code-id="L096-9">
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
            <pre><code class="language-python"># Problema: TimeoutError: Timeout 30000ms exceeded waiting for selector
# playwright._impl._errors.TimeoutError

# Estrategia de debug:
class TestElementoNoEncontrado:
    def test_debug_selector(self, page: Page):
        page.goto("https://mi-app.siesa.com/reportes")

        # 🔴 Breakpoint aquí y usa Debug Console:
        # 1. Verificar que la página cargó:
        #    page.url  →  ¿es la URL correcta?
        #    page.title()  →  ¿título esperado?

        # 2. Verificar que el elemento existe:
        #    page.locator("#tabla-ventas").count()  →  ¿0? No existe
        #    page.locator(".tabla-ventas").count()   →  ¿1? ¡El selector era .clase!

        # 3. Ver el HTML real:
        #    page.content()  →  todo el HTML
        #    page.locator("table").first.inner_html()  →  HTML de la tabla

        # 4. Tomar screenshot para ver estado visual:
        #    page.screenshot(path="debug_no_encontrado.png")

        tabla = page.get_by_test_id("tabla-ventas")
        expect(tabla).to_be_visible()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// Problema: TimeoutError: Timeout 30000ms exceeded waiting for selector
// playwright.errors.TimeoutError

// Estrategia de debug:
test('debug selector', async ({ page }) => {
    await page.goto('https://mi-app.siesa.com/reportes');

    // 🔴 Breakpoint aquí y usa Debug Console:
    // 1. Verificar que la página cargó:
    //    page.url()  →  ¿es la URL correcta?
    //    await page.title()  →  ¿título esperado?

    // 2. Verificar que el elemento existe:
    //    await page.locator('#tabla-ventas').count()  →  ¿0? No existe
    //    await page.locator('.tabla-ventas').count()   →  ¿1? ¡El selector era .clase!

    // 3. Ver el HTML real:
    //    await page.content()  →  todo el HTML
    //    await page.locator('table').first().innerHTML()  →  HTML de la tabla

    // 4. Tomar screenshot para ver estado visual:
    //    await page.screenshot({ path: 'debug_no_encontrado.png' })

    const tabla = page.getByTestId('tabla-ventas');
    await expect(tabla).toBeVisible();
});</code></pre>
        </div>
        </div>

        <h4>9.2 Timeout en navegación</h4>
        <div class="code-tabs" data-code-id="L096-10">
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
            <pre><code class="language-python"># Problema: Navigation timeout exceeded
# La página tarda demasiado o no completa la carga

class TestTimeoutNavegacion:
    def test_debug_navegacion_lenta(self, page: Page):
        # Aumentar timeout para debug
        page.set_default_timeout(60000)  # 60 segundos
        page.set_default_navigation_timeout(60000)

        # 🔴 Breakpoint aquí
        page.goto(
            "https://mi-app.siesa.com/reportes/pesado",
            wait_until="domcontentloaded"  # No esperar a load completo
        )

        # Verificar en Debug Console:
        # page.url  →  ¿redirigió a otra URL?
        # page.evaluate("document.readyState")  →  ¿loading/interactive/complete?

        # Intentar wait_until más permisivo:
        # "commit"           → apenas el servidor responde
        # "domcontentloaded" → HTML parseado
        # "load"             → todo cargado (default)
        # "networkidle"      → sin requests de red por 500ms

        expect(page.get_by_text("Reporte")).to_be_visible()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// Problema: Navigation timeout exceeded
// La página tarda demasiado o no completa la carga

test('debug navegación lenta', async ({ page }) => {
    // Aumentar timeout para debug
    page.setDefaultTimeout(60000); // 60 segundos
    page.setDefaultNavigationTimeout(60000);

    // 🔴 Breakpoint aquí
    await page.goto(
        'https://mi-app.siesa.com/reportes/pesado',
        { waitUntil: 'domcontentloaded' } // No esperar a load completo
    );

    // Verificar en Debug Console:
    // page.url()  →  ¿redirigió a otra URL?
    // await page.evaluate(() => document.readyState)  →  ¿loading/interactive/complete?

    // Intentar waitUntil más permisivo:
    // "commit"           → apenas el servidor responde
    // "domcontentloaded" → HTML parseado
    // "load"             → todo cargado (default)
    // "networkidle"      → sin requests de red por 500ms

    await expect(page.getByText('Reporte')).toBeVisible();
});</code></pre>
        </div>
        </div>

        <h4>9.3 Test intermitente (flaky)</h4>
        <div class="code-tabs" data-code-id="L096-11">
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
            <pre><code class="language-python"># Problema: Test que a veces pasa y a veces falla

class TestFlakyDebug:
    def test_debug_flaky(self, page: Page):
        page.goto("https://mi-app.siesa.com/dashboard")

        # 🔴 Breakpoint → ¿El elemento aparece con animación/delay?
        notificacion = page.get_by_role("alert")

        # Opción A: Esperar explícitamente
        notificacion.wait_for(state="visible", timeout=10000)

        # Opción B: Usar expect con retry automático
        expect(notificacion).to_be_visible(timeout=10000)

        # En Debug Console verificar timing:
        # import time
        # start = time.time()
        # notificacion.wait_for(state="visible")
        # print(f"Tardó: {time.time() - start:.2f}s")

        expect(notificacion).to_contain_text("Bienvenido")</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// Problema: Test que a veces pasa y a veces falla

test('debug flaky', async ({ page }) => {
    await page.goto('https://mi-app.siesa.com/dashboard');

    // 🔴 Breakpoint → ¿El elemento aparece con animación/delay?
    const notificacion = page.getByRole('alert');

    // Opción A: Esperar explícitamente
    await notificacion.waitFor({ state: 'visible', timeout: 10000 });

    // Opción B: Usar expect con retry automático
    await expect(notificacion).toBeVisible({ timeout: 10000 });

    // En Debug Console verificar timing:
    // const start = Date.now();
    // await notificacion.waitFor({ state: 'visible' });
    // console.log(\`Tardó: \${((Date.now() - start) / 1000).toFixed(2)}s\`);

    await expect(notificacion).toContainText('Bienvenido');
});</code></pre>
        </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA - Debugging de tests flaky en CI</h4>
            <p>En SIESA combinamos varias técnicas para diagnosticar tests intermitentes:</p>
            <ol>
                <li><strong>Trace en CI:</strong> <code>--tracing retain-on-failure</code> para capturar traces solo de fallos</li>
                <li><strong>Screenshots en fallo:</strong> Fixture con <code>yield</code> + screenshot en teardown</li>
                <li><strong>Verbose logging:</strong> <code>DEBUG=pw:api</code> en la pipeline para ver timing</li>
                <li><strong>Repetición local:</strong> <code>pytest --count=10</code> (con pytest-repeat) para reproducir</li>
            </ol>
        </div>

        <h3>🧪 Ejercicio práctico: Configurar debugging completo</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📝 Ejercicio: Debug de un test que falla</h4>
            <p>Configura el entorno de debugging y diagnostica por qué falla el siguiente test.</p>

            <p><strong>Paso 1:</strong> Crea la estructura del proyecto.</p>
            <pre><code class="bash">mkdir -p debug_avanzado/tests
mkdir -p debug_avanzado/.vscode
cd debug_avanzado
pip install pytest-playwright ipdb
playwright install chromium</code></pre>

            <p><strong>Paso 2:</strong> Crea el <code>launch.json</code>.</p>
            <pre><code class="json">// .vscode/launch.json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Debug Test Actual",
            "type": "debugpy",
            "request": "launch",
            "module": "pytest",
            "args": [
                "\${file}",
                "-v",
                "--headed",
                "--slowmo", "500",
                "-s",
                "-x"
            ],
            "console": "integratedTerminal",
            "justMyCode": false,
            "env": {
                "DEBUG": "pw:api"
            }
        }
    ]
}</code></pre>

            <p><strong>Paso 3:</strong> Crea el test que tiene errores ocultos.</p>
            <div class="code-tabs" data-code-id="L096-12">
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
                <pre><code class="language-python"># tests/conftest.py
import pytest
from playwright.sync_api import Page


@pytest.fixture
def pagina_cargada(page: Page):
    """Fixture que navega a una página y verifica carga."""
    page.goto("https://the-internet.herokuapp.com")
    page.wait_for_load_state("networkidle")
    yield page


# tests/test_debug_ejercicio.py
import pytest
from playwright.sync_api import Page, expect


class TestDebugEjercicio:
    """Test con 3 bugs ocultos. Usa breakpoints para encontrarlos."""

    def test_login_flow(self, pagina_cargada: Page):
        """Bug 1: Selector incorrecto."""
        page = pagina_cargada

        # Navegar al formulario de login
        page.get_by_role("link", name="Form Authentication").click()

        # 🔴 Pon un breakpoint aquí
        # En Debug Console prueba: page.get_by_label("Username").count()
        # Pista: El campo NO tiene label asociado en este sitio
        page.get_by_label("Username").fill("tomsmith")
        # Solución: usar page.locator("#username").fill("tomsmith")

    def test_tabla_datos(self, pagina_cargada: Page):
        """Bug 2: Conteo incorrecto de elementos."""
        page = pagina_cargada
        page.get_by_role("link", name="Sortable Data Tables").click()

        # 🔴 Breakpoint aquí
        # En Debug Console: page.locator("table").count()
        # ¿Cuántas tablas hay? ¿Estamos usando la correcta?
        filas = page.locator("table tr").all()
        # Bug: incluye filas de AMBAS tablas y los headers
        assert len(filas) == 5  # ¿Es correcto?
        # Solución: page.locator("#table1 tbody tr").all()

    def test_checkbox_toggle(self, pagina_cargada: Page):
        """Bug 3: Estado no verificado antes de actuar."""
        page = pagina_cargada
        page.get_by_role("link", name="Checkboxes").click()

        # 🔴 Breakpoint aquí
        # Debug Console: page.locator("input[type='checkbox']").first.is_checked()
        checkbox = page.locator("input[type='checkbox']").first
        checkbox.check()
        # Bug: ¿Y si ya estaba checked? check() no falla, pero
        # la lógica podría ser incorrecta si asumimos estado inicial
        expect(checkbox).to_be_checked()
        # Solución: verificar estado inicial primero
        # assert not checkbox.is_checked(), "Checkbox ya estaba marcado"</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// tests/fixtures.ts
import { test as base, Page } from '@playwright/test';

const test = base.extend&lt;{ paginaCargada: Page }&gt;({
    paginaCargada: async ({ page }, use) => {
        // Fixture que navega a una página y verifica carga
        await page.goto('https://the-internet.herokuapp.com');
        await page.waitForLoadState('networkidle');
        await use(page);
    },
});
export { test };

// tests/test_debug_ejercicio.spec.ts
import { test } from './fixtures';
import { expect } from '@playwright/test';


test.describe('TestDebugEjercicio', () => {
    // Test con 3 bugs ocultos. Usa breakpoints para encontrarlos.

    test('login flow', async ({ paginaCargada: page }) => {
        // Bug 1: Selector incorrecto.

        // Navegar al formulario de login
        await page.getByRole('link', { name: 'Form Authentication' }).click();

        // 🔴 Pon un breakpoint aquí
        // En Debug Console prueba: await page.getByLabel('Username').count()
        // Pista: El campo NO tiene label asociado en este sitio
        await page.getByLabel('Username').fill('tomsmith');
        // Solución: usar await page.locator('#username').fill('tomsmith')
    });

    test('tabla datos', async ({ paginaCargada: page }) => {
        // Bug 2: Conteo incorrecto de elementos.
        await page.getByRole('link', { name: 'Sortable Data Tables' }).click();

        // 🔴 Breakpoint aquí
        // En Debug Console: await page.locator('table').count()
        // ¿Cuántas tablas hay? ¿Estamos usando la correcta?
        const filas = await page.locator('table tr').all();
        // Bug: incluye filas de AMBAS tablas y los headers
        expect(filas.length).toBe(5); // ¿Es correcto?
        // Solución: await page.locator('#table1 tbody tr').all()
    });

    test('checkbox toggle', async ({ paginaCargada: page }) => {
        // Bug 3: Estado no verificado antes de actuar.
        await page.getByRole('link', { name: 'Checkboxes' }).click();

        // 🔴 Breakpoint aquí
        // Debug Console: await page.locator("input[type='checkbox']").first().isChecked()
        const checkbox = page.locator("input[type='checkbox']").first();
        await checkbox.check();
        // Bug: ¿Y si ya estaba checked? check() no falla, pero
        // la lógica podría ser incorrecta si asumimos estado inicial
        await expect(checkbox).toBeChecked();
        // Solución: verificar estado inicial primero
        // expect(await checkbox.isChecked()).toBe(false);
    });
});</code></pre>
            </div>
            </div>

            <p><strong>Paso 4:</strong> Diagnostica cada bug.</p>
            <ol>
                <li>Abre el proyecto en VS Code</li>
                <li>Pon breakpoints en las líneas marcadas con 🔴</li>
                <li>Selecciona la configuración "Debug Test Actual" y presiona F5</li>
                <li>En cada breakpoint, usa la Debug Console para explorar</li>
                <li>Anota la causa raíz de cada bug y la solución</li>
            </ol>

            <p><strong>Criterios de éxito:</strong></p>
            <ul>
                <li>Identificar los 3 bugs usando breakpoints y Debug Console</li>
                <li>Aplicar la corrección apropiada para cada uno</li>
                <li>Ejecutar los tests corregidos sin breakpoints y que pasen</li>
            </ul>
        </div>

        <h3>📊 Resumen de herramientas de debug</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr style="background: #1565c0; color: white;">
                    <th style="padding: 8px; text-align: left;">Herramienta</th>
                    <th style="padding: 8px; text-align: left;">Cuándo usarla</th>
                    <th style="padding: 8px; text-align: left;">Comando / Atajo</th>
                </tr>
                <tr style="background: #e3f2fd;">
                    <td style="padding: 8px;"><strong>VS Code Debugger</strong></td>
                    <td style="padding: 8px;">Debug completo con GUI</td>
                    <td style="padding: 8px;">F5 con launch.json</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px;"><strong>Breakpoints</strong></td>
                    <td style="padding: 8px;">Pausar en punto específico</td>
                    <td style="padding: 8px;">F9 / click en gutter</td>
                </tr>
                <tr style="background: #e3f2fd;">
                    <td style="padding: 8px;"><strong>Conditional BP</strong></td>
                    <td style="padding: 8px;">Pausar solo si condición</td>
                    <td style="padding: 8px;">Click derecho → Expression</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px;"><strong>Logpoints</strong></td>
                    <td style="padding: 8px;">Log sin modificar código</td>
                    <td style="padding: 8px;">Click derecho → Log Message</td>
                </tr>
                <tr style="background: #e3f2fd;">
                    <td style="padding: 8px;"><strong>Debug Console</strong></td>
                    <td style="padding: 8px;">Evaluar expresiones en vivo</td>
                    <td style="padding: 8px;">Ctrl+Shift+Y</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px;"><strong>pdb / ipdb</strong></td>
                    <td style="padding: 8px;">Debug en terminal/CI</td>
                    <td style="padding: 8px;">breakpoint() + pytest -s</td>
                </tr>
                <tr style="background: #e3f2fd;">
                    <td style="padding: 8px;"><strong>DEBUG=pw:api</strong></td>
                    <td style="padding: 8px;">Ver llamadas internas</td>
                    <td style="padding: 8px;">Variable de entorno</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px;"><strong>Remote attach</strong></td>
                    <td style="padding: 8px;">Debug en Docker/CI</td>
                    <td style="padding: 8px;">debugpy + attach config</td>
                </tr>
            </table>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🏆 Mejores prácticas de debugging</h4>
            <ol>
                <li><strong>Reproduce primero:</strong> Antes de debuggear, asegúrate de poder reproducir el fallo consistentemente</li>
                <li><strong>Breakpoints estratégicos:</strong> Ponlos antes de la línea que falla, no en la línea misma</li>
                <li><strong>Debug Console siempre:</strong> Evalúa localizadores y estado de la página antes de continuar</li>
                <li><strong>No dejes breakpoints en código:</strong> Elimina <code>breakpoint()</code> y <code>pdb.set_trace()</code> antes de commit</li>
                <li><strong>Logging en CI, breakpoints en local:</strong> Usa <code>DEBUG=pw:api</code> en CI, breakpoints de VS Code en desarrollo</li>
                <li><strong>justMyCode: false:</strong> Actívalo cuando necesitas entender el comportamiento interno de Playwright</li>
            </ol>
        </div>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔗 Próxima lección</h4>
            <p>En la siguiente lección exploraremos <strong>Análisis de fallos con screenshots y videos</strong>,
            donde aprenderás a configurar capturas automáticas de evidencia cuando los tests fallan,
            complementando las técnicas de debugging interactivo que vimos aquí.</p>
        </div>
    `,
    topics: ["breakpoints", "vscode", "debug"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_096 = LESSON_096;
}
