/**
 * Playwright Academy - Lección 011
 * Anatomía de un test Playwright
 * Sección 2: Fundamentos de Playwright
 */

const LESSON_011 = {
    id: 11,
    title: "Anatomía de un test Playwright",
    duration: "8 min",
    level: "beginner",
    section: "section-02",
    content: `
        <h2>🎭 Anatomía de un test Playwright</h2>
        <p>Antes de escribir tests complejos, necesitas entender cada parte que compone
        un test de Playwright con pytest. En esta lección diseccionaremos un test línea por línea.</p>

        <h3>📋 Estructura básica de un test</h3>
        <pre><code class="python"># test_ejemplo.py
import re
from playwright.sync_api import Page, expect

def test_pagina_principal(page: Page):
    """Verifica que la página principal carga correctamente."""
    # 1. ARRANGE - Navegar a la página
    page.goto("https://playwright.dev/python/")

    # 2. ACT - Interactuar con la página
    page.get_by_role("link", name="Get started").click()

    # 3. ASSERT - Verificar resultados
    expect(page).to_have_url(re.compile(".*intro"))
    expect(page.get_by_role("heading", name="Installation")).to_be_visible()</code></pre>

        <h3>🔍 Desglose línea por línea</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>1. Imports</h4>
            <pre><code class="python">from playwright.sync_api import Page, expect</code></pre>
            <ul>
                <li><code>Page</code>: El tipo que representa una pestaña del navegador</li>
                <li><code>expect</code>: Función para assertions (verificaciones) con auto-waiting</li>
                <li>Usamos <code>sync_api</code> porque pytest-playwright trabaja en modo síncrono</li>
            </ul>
        </div>

        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>2. Función del test</h4>
            <pre><code class="python">def test_pagina_principal(page: Page):</code></pre>
            <ul>
                <li><code>def test_</code>: Prefijo obligatorio para que pytest lo detecte como test</li>
                <li><code>page: Page</code>: Fixture inyectada automáticamente por pytest-playwright</li>
                <li>Cada test recibe una página nueva (aislamiento total)</li>
            </ul>
        </div>

        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>3. Patrón AAA (Arrange-Act-Assert)</h4>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #e8f5e9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Fase</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Propósito</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Arrange</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Preparar el escenario</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>page.goto(url)</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Act</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Ejecutar la acción</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>page.click()</code></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Assert</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Verificar resultado</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>expect(page).to_have_url()</code></td>
                </tr>
            </table>
        </div>

        <h3>🧩 Las fixtures de pytest-playwright</h3>
        <p>pytest-playwright provee varias fixtures automáticas:</p>
        <pre><code class="python"># Las fixtures principales que puedes usar como parámetros:

def test_con_page(page: Page):
    """page: Una página nueva por cada test (la más usada)."""
    page.goto("https://example.com")

def test_con_context(context):
    """context: El contexto del navegador (para crear múltiples páginas)."""
    page1 = context.new_page()
    page2 = context.new_page()
    page1.goto("https://example.com")
    page2.goto("https://example.com")

def test_con_browser(browser):
    """browser: Instancia del navegador (para crear múltiples contextos)."""
    context = browser.new_context(locale="es-CO")
    page = context.new_page()
    page.goto("https://example.com")
    context.close()</code></pre>

        <h3>📁 Convenciones de archivos</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code>tests/
├── conftest.py          # Fixtures compartidas
├── test_login.py        # Tests de login
├── test_dashboard.py    # Tests del dashboard
└── test_perfil.py       # Tests del perfil</code></pre>
            <ul>
                <li>Archivos: <code>test_*.py</code> o <code>*_test.py</code></li>
                <li>Funciones: <code>test_*()</code></li>
                <li>Clases: <code>Test*</code> (opcional)</li>
            </ul>
        </div>

        <h3>📦 Tests agrupados en clases</h3>
        <pre><code class="python"># test_login.py
from playwright.sync_api import Page, expect

class TestLogin:
    """Agrupa tests relacionados con login."""

    def test_login_exitoso(self, page: Page):
        page.goto("/login")
        page.fill("#usuario", "admin")
        page.fill("#password", "secreto")
        page.click("button[type=submit]")
        expect(page).to_have_url("/dashboard")

    def test_login_fallido(self, page: Page):
        page.goto("/login")
        page.fill("#usuario", "admin")
        page.fill("#password", "incorrecto")
        page.click("button[type=submit]")
        expect(page.locator(".error")).to_be_visible()</code></pre>

        <h3>🎯 Ejercicio práctico</h3>
        <ol>
            <li>Crea un archivo <code>tests/test_anatomia.py</code></li>
            <li>Escribe un test que siga el patrón AAA:
                <ul>
                    <li><strong>Arrange:</strong> Navega a <code>https://playwright.dev</code></li>
                    <li><strong>Act:</strong> Haz click en el link de Python</li>
                    <li><strong>Assert:</strong> Verifica que la URL contiene "python"</li>
                </ul>
            </li>
            <li>Agrega un segundo test en una clase <code>TestPlaywrightDev</code></li>
            <li>Ejecuta con <code>pytest tests/test_anatomia.py -v</code></li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Entender cada parte de un test Playwright</li>
                <li>Aplicar el patrón AAA (Arrange-Act-Assert)</li>
                <li>Conocer las fixtures automáticas: page, context, browser</li>
                <li>Organizar tests en archivos y clases</li>
            </ul>
        </div>
    `,
    topics: ["test", "anatomía", "estructura"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 8,
    difficulty: "easy",
    type: "foundation"
};

if (typeof window !== 'undefined') {
    window.LESSON_011 = LESSON_011;
}
