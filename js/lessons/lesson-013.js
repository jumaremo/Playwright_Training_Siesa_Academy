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
            <pre><code class="python"># ❌ Esto puede fallar si el elemento aún no cargó
assert page.locator(".titulo").text_content() == "Bienvenido"

# ✅ Esto reintenta hasta 5s esperando que el texto aparezca
expect(page.locator(".titulo")).to_have_text("Bienvenido")</code></pre>
        </div>

        <h3>📄 Assertions de página (Page)</h3>
        <pre><code class="python">import re
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

        <h3>🏷️ Assertions de localizadores (Locator)</h3>
        <pre><code class="python">def test_assertions_locator(page: Page):
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

        <h3>📝 Assertions de formularios</h3>
        <pre><code class="python">def test_assertions_formularios(page: Page):
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

        <h3>🎨 Assertions de CSS y estado</h3>
        <pre><code class="python">def test_assertions_css(page: Page):
    page.goto("/pagina-estilos")

    # Verificar clase CSS
    expect(page.locator(".alerta")).to_have_class(re.compile(".*error.*"))

    # Verificar propiedad CSS
    expect(page.locator(".titulo")).to_have_css("color", "rgb(0, 0, 0)")

    # Verificar que está oculto
    expect(page.locator(".panel-secreto")).to_be_hidden()

    # Verificar que está adjunto al DOM (aunque no visible)
    expect(page.locator(".cargando")).to_be_attached()</code></pre>

        <h3>🚫 Negación con not_to_</h3>
        <pre><code class="python">def test_negaciones(page: Page):
    page.goto("https://example.com")

    # Verificar que algo NO existe o NO tiene cierto valor
    expect(page.locator("h1")).not_to_have_text("Texto incorrecto")
    expect(page.locator(".modal")).not_to_be_visible()
    expect(page).not_to_have_url("https://otro-sitio.com")
    expect(page.locator("#campo")).not_to_be_empty()</code></pre>

        <h3>⏱️ Timeout personalizado</h3>
        <pre><code class="python">def test_timeout_custom(page: Page):
    page.goto("/pagina-lenta")

    # Esperar hasta 15 segundos para esta assertion
    expect(page.locator(".resultado")).to_be_visible(timeout=15000)

    # Útil para elementos que tardan en aparecer
    expect(page.locator("#datos-cargados")).to_have_text(
        "Carga completa",
        timeout=30000
    )</code></pre>

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
