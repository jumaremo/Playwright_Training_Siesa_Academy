/**
 * Playwright Academy - Lección 013
 * Assertions con expect()
 * Sección 2: Fundamentos de Playwright
 */

const LESSON_013 = {
    id: 13,
    title: "Assertions con expect()",
    duration: "8 min",
    level: "beginner",
    section: "section-02",
    content: `
        <h2>✅ Assertions con expect()</h2>
        <p>Las assertions son el corazón de todo test: verifican que la aplicación se comporta
        como esperamos. Playwright ofrece <code>expect()</code> con <strong>auto-waiting</strong>,
        lo que significa que reintenta automáticamente hasta que la condición se cumpla o expire el timeout.</p>

        <h3>🔑 Concepto clave: Auto-Retrying Assertions</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>A diferencia de <code>assert</code> de Python (que falla inmediatamente),
            <code>expect()</code> de Playwright <strong>reintenta</strong> la verificación
            durante 5 segundos por defecto. Esto elimina flakiness causado por tiempos de carga.</p>
            <div class="code-tabs" data-code-id="L013-1">
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
                    <pre><code class="language-python"># ❌ Esto puede fallar si el elemento aún no cargó
assert page.locator(".titulo").text_content() == "Bienvenido"

# ✅ Esto reintenta hasta 5s esperando que el texto aparezca
expect(page.locator(".titulo")).to_have_text("Bienvenido")</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-typescript">// ❌ Esto puede fallar si el elemento aún no cargó
const text = await page.locator('.titulo').textContent();
expect(text).toBe('Bienvenido'); // assertion de Jest, no reintenta

// ✅ Esto reintenta hasta 5s esperando que el texto aparezca
await expect(page.locator('.titulo')).toHaveText('Bienvenido');</code></pre>
                </div>
            </div>
        </div>

        <h3>📄 Assertions de página (Page)</h3>
        <div class="code-tabs" data-code-id="L013-2">
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
                <pre><code class="language-python">import re
from playwright.sync_api import Page, expect

def test_assertions_pagina(page: Page):
    page.goto("https://playwright.dev/python/")

    # Verificar título exacto
    expect(page).to_have_title("Fast and reliable end-to-end testing for modern web apps | Playwright Python")

    # Verificar título con regex
    expect(page).to_have_title(re.compile("Playwright"))

    # Verificar URL exacta
    expect(page).to_have_url("https://playwright.dev/python/")

    # Verificar URL con patrón
    expect(page).to_have_url(re.compile(".*playwright.*"))</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('assertions de página', async ({ page }) => {
    await page.goto('https://playwright.dev/python/');

    // Verificar título exacto
    await expect(page).toHaveTitle('Fast and reliable end-to-end testing for modern web apps | Playwright Python');

    // Verificar título con regex
    await expect(page).toHaveTitle(/Playwright/);

    // Verificar URL exacta
    await expect(page).toHaveURL('https://playwright.dev/python/');

    // Verificar URL con patrón
    await expect(page).toHaveURL(/.*playwright.*/);
});</code></pre>
            </div>
        </div>

        <h3>🏷️ Assertions de localizadores (Locator)</h3>
        <div class="code-tabs" data-code-id="L013-3">
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
                <pre><code class="language-python">def test_assertions_locator(page: Page):
    page.goto("https://example.com")

    heading = page.locator("h1")

    # Visibilidad
    expect(heading).to_be_visible()
    expect(page.locator(".no-existe")).not_to_be_visible()

    # Texto
    expect(heading).to_have_text("Example Domain")
    expect(heading).to_contain_text("Example")  # Contiene
    expect(heading).to_have_text(re.compile("example", re.IGNORECASE))

    # Atributos
    link = page.locator("a")
    expect(link).to_have_attribute("href", "https://www.iana.org/domains/example")

    # Cantidad de elementos
    expect(page.locator("p")).to_have_count(2)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('assertions de localizadores', async ({ page }) => {
    await page.goto('https://example.com');

    const heading = page.locator('h1');

    // Visibilidad
    await expect(heading).toBeVisible();
    await expect(page.locator('.no-existe')).not.toBeVisible();

    // Texto
    await expect(heading).toHaveText('Example Domain');
    await expect(heading).toContainText('Example');  // Contiene
    await expect(heading).toHaveText(/example/i);

    // Atributos
    const link = page.locator('a');
    await expect(link).toHaveAttribute('href', 'https://www.iana.org/domains/example');

    // Cantidad de elementos
    await expect(page.locator('p')).toHaveCount(2);
});</code></pre>
            </div>
        </div>

        <h3>📝 Assertions de formularios</h3>
        <div class="code-tabs" data-code-id="L013-4">
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
                <pre><code class="language-python">def test_assertions_formularios(page: Page):
    page.goto("/formulario")

    # Campo tiene valor
    expect(page.locator("#nombre")).to_have_value("")
    page.fill("#nombre", "Juan")
    expect(page.locator("#nombre")).to_have_value("Juan")

    # Checkbox está marcado
    page.check("#acepto-terminos")
    expect(page.locator("#acepto-terminos")).to_be_checked()

    # Elemento está habilitado/deshabilitado
    expect(page.locator("#btn-enviar")).to_be_enabled()
    expect(page.locator("#btn-bloqueado")).to_be_disabled()

    # Elemento está editable
    expect(page.locator("#nombre")).to_be_editable()

    # Elemento tiene foco
    page.locator("#nombre").focus()
    expect(page.locator("#nombre")).to_be_focused()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('assertions de formularios', async ({ page }) => {
    await page.goto('/formulario');

    // Campo tiene valor
    await expect(page.locator('#nombre')).toHaveValue('');
    await page.fill('#nombre', 'Juan');
    await expect(page.locator('#nombre')).toHaveValue('Juan');

    // Checkbox está marcado
    await page.check('#acepto-terminos');
    await expect(page.locator('#acepto-terminos')).toBeChecked();

    // Elemento está habilitado/deshabilitado
    await expect(page.locator('#btn-enviar')).toBeEnabled();
    await expect(page.locator('#btn-bloqueado')).toBeDisabled();

    // Elemento está editable
    await expect(page.locator('#nombre')).toBeEditable();

    // Elemento tiene foco
    await page.locator('#nombre').focus();
    await expect(page.locator('#nombre')).toBeFocused();
});</code></pre>
            </div>
        </div>

        <h3>🎨 Assertions de CSS y estado</h3>
        <div class="code-tabs" data-code-id="L013-5">
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
                <pre><code class="language-python">def test_assertions_css(page: Page):
    page.goto("/pagina-estilos")

    # Verificar clase CSS
    expect(page.locator(".alerta")).to_have_class(re.compile(".*error.*"))

    # Verificar propiedad CSS
    expect(page.locator(".titulo")).to_have_css("color", "rgb(0, 0, 0)")

    # Verificar que está oculto
    expect(page.locator(".panel-secreto")).to_be_hidden()

    # Verificar que está adjunto al DOM (aunque no visible)
    expect(page.locator(".cargando")).to_be_attached()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('assertions de CSS y estado', async ({ page }) => {
    await page.goto('/pagina-estilos');

    // Verificar clase CSS
    await expect(page.locator('.alerta')).toHaveClass(/.*error.*/);

    // Verificar propiedad CSS
    await expect(page.locator('.titulo')).toHaveCSS('color', 'rgb(0, 0, 0)');

    // Verificar que está oculto
    await expect(page.locator('.panel-secreto')).toBeHidden();

    // Verificar que está adjunto al DOM (aunque no visible)
    await expect(page.locator('.cargando')).toBeAttached();
});</code></pre>
            </div>
        </div>

        <h3>🚫 Negación con not_to_</h3>
        <div class="code-tabs" data-code-id="L013-6">
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
                <pre><code class="language-python">def test_negaciones(page: Page):
    page.goto("https://example.com")

    # Verificar que algo NO existe o NO tiene cierto valor
    expect(page.locator("h1")).not_to_have_text("Texto incorrecto")
    expect(page.locator(".modal")).not_to_be_visible()
    expect(page).not_to_have_url("https://otro-sitio.com")
    expect(page.locator("#campo")).not_to_be_empty()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('negaciones', async ({ page }) => {
    await page.goto('https://example.com');

    // Verificar que algo NO existe o NO tiene cierto valor
    await expect(page.locator('h1')).not.toHaveText('Texto incorrecto');
    await expect(page.locator('.modal')).not.toBeVisible();
    await expect(page).not.toHaveURL('https://otro-sitio.com');
    await expect(page.locator('#campo')).not.toBeEmpty();
});</code></pre>
            </div>
        </div>

        <h3>⏱️ Timeout personalizado</h3>
        <div class="code-tabs" data-code-id="L013-7">
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
                <pre><code class="language-python">def test_timeout_custom(page: Page):
    page.goto("/pagina-lenta")

    # Esperar hasta 15 segundos para esta assertion
    expect(page.locator(".resultado")).to_be_visible(timeout=15000)

    # Útil para elementos que tardan en aparecer
    expect(page.locator("#datos-cargados")).to_have_text(
        "Carga completa",
        timeout=30000
    )</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('timeout personalizado', async ({ page }) => {
    await page.goto('/pagina-lenta');

    // Esperar hasta 15 segundos para esta assertion
    await expect(page.locator('.resultado')).toBeVisible({ timeout: 15000 });

    // Útil para elementos que tardan en aparecer
    await expect(page.locator('#datos-cargados')).toHaveText(
        'Carga completa',
        { timeout: 30000 }
    );
});</code></pre>
            </div>
        </div>

        <h3>📊 Tabla resumen de assertions</h3>
        <div style="overflow-x: auto;">
            <table style="width:100%; border-collapse: collapse; font-size: 0.9em;">
                <tr style="background: #e8f5e9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Assertion</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Verifica</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>to_be_visible()</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Elemento visible</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>to_have_text()</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Texto del elemento</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>to_have_value()</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Valor de input</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>to_have_attribute()</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Atributo HTML</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>to_have_count()</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Cantidad de elementos</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>to_be_checked()</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Checkbox marcado</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>to_be_enabled()</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Elemento habilitado</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>to_have_title()</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Título de la página</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>to_have_url()</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">URL de la página</td>
                </tr>
            </table>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <ol>
            <li>Crea <code>tests/test_assertions.py</code></li>
            <li>Navega a <code>https://example.com</code> y escribe assertions para:
                <ul>
                    <li>El título de la página</li>
                    <li>El texto del h1</li>
                    <li>La cantidad de párrafos (2)</li>
                    <li>El atributo href del link</li>
                    <li>Que el h1 sea visible</li>
                </ul>
            </li>
            <li>Agrega assertions negadas con <code>not_to_</code></li>
            <li>Prueba con un timeout personalizado</li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Usar <code>expect()</code> con auto-waiting en vez de <code>assert</code></li>
                <li>Verificar texto, atributos, visibilidad y estado de formularios</li>
                <li>Negar assertions con <code>not_to_</code></li>
                <li>Configurar timeouts personalizados por assertion</li>
            </ul>
        </div>
    `,
    topics: ["assertions", "expect", "verificaciones"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 8,
    difficulty: "easy",
    type: "foundation"
};

if (typeof window !== 'undefined') {
    window.LESSON_013 = LESSON_013;
}
