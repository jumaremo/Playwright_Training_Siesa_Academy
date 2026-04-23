/**
 * Playwright Academy - Lección 001
 * Introducción a Playwright con Python
 * Sección 1: Configuración del Entorno
 */

const LESSON_001 = {
    id: 1,
    title: "Introducción a Playwright con Python",
    duration: "8 min",
    level: "beginner",
    section: "section-01",
    content: `
        <h2>🎭 ¿Qué es Playwright?</h2>
        <p>Playwright es un framework de automatización de pruebas web desarrollado por <strong>Microsoft</strong>.
        Permite controlar navegadores (Chromium, Firefox, WebKit) de forma rápida, confiable y con una API moderna.</p>

        <h3>¿Por qué Playwright con Python?</h3>
        <ul>
            <li><strong>Auto-waiting:</strong> Espera automáticamente a que los elementos estén listos — no más <code>sleep()</code></li>
            <li><strong>Multi-navegador:</strong> Chromium, Firefox y WebKit con una sola API</li>
            <li><strong>Aislamiento:</strong> Cada test corre en su propio Browser Context</li>
            <li><strong>Herramientas integradas:</strong> Inspector, Trace Viewer, Codegen</li>
            <li><strong>pytest nativo:</strong> Se integra directamente con pytest, el framework de testing más popular de Python</li>
        </ul>

        <h3>💻 Tu primer test con Playwright</h3>
        <p>Así se ve un test básico de Playwright con Python y pytest:</p>
        <div class="code-tabs" data-code-id="L001-1">
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
                <pre><code class="language-python"># test_ejemplo.py
import re
from playwright.sync_api import Page, expect

def test_titulo_pagina(page: Page):
    """Verifica que la página principal tiene el título correcto."""
    page.goto("https://playwright.dev/python/")

    # Playwright espera automáticamente a que el título coincida
    expect(page).to_have_title(re.compile("Playwright"))

def test_boton_get_started(page: Page):
    """Verifica que el botón Get Started navega correctamente."""
    page.goto("https://playwright.dev/python/")

    # Hacer click en el link "Get started"
    page.get_by_role("link", name="Get started").click()

    # Verificar que navegó a la página de instalación
    expect(page.get_by_role("heading", name="Installation")).to_be_visible()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// test_ejemplo.spec.ts
import { test, expect } from '@playwright/test';

test('titulo pagina', async ({ page }) => {
    /** Verifica que la página principal tiene el título correcto. */
    await page.goto("https://playwright.dev/");

    // Playwright espera automáticamente a que el título coincida
    await expect(page).toHaveTitle(/Playwright/);
});

test('boton get started', async ({ page }) => {
    /** Verifica que el botón Get Started navega correctamente. */
    await page.goto("https://playwright.dev/");

    // Hacer click en el link "Get started"
    await page.getByRole('link', { name: 'Get started' }).click();

    // Verificar que navegó a la página de instalación
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});</code></pre>
            </div>
        </div>

        <h3>🔑 Conceptos clave</h3>
        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #e8f5e9;">
                    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Concepto</th>
                    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Descripción</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>page</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Representa una pestaña del navegador. Fixture inyectada automáticamente por pytest-playwright.</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>page.goto()</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Navega a una URL y espera a que cargue.</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>expect()</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Assertions con auto-waiting. Reintenta hasta que la condición se cumpla o expire el timeout.</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>get_by_role()</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Localiza elementos por su rol de accesibilidad (button, link, heading, etc.).</td>
                </tr>
            </table>
        </div>

        <h3>📊 Playwright vs otras herramientas</h3>
        <table style="width:100%; border-collapse: collapse; margin: 10px 0;">
            <tr style="background: #e8f5e9;">
                <th style="padding: 8px; border: 1px solid #ddd;">Característica</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Playwright</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Selenium</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Cypress</th>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">Auto-waiting</td>
                <td style="padding: 8px; border: 1px solid #ddd;">✅ Nativo</td>
                <td style="padding: 8px; border: 1px solid #ddd;">❌ Manual</td>
                <td style="padding: 8px; border: 1px solid #ddd;">✅ Nativo</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;">Multi-navegador</td>
                <td style="padding: 8px; border: 1px solid #ddd;">✅ 3 engines</td>
                <td style="padding: 8px; border: 1px solid #ddd;">✅ Múltiples</td>
                <td style="padding: 8px; border: 1px solid #ddd;">⚠️ Limitado</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">Lenguajes</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Python, JS, C#, Java</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Múltiples</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Solo JS/TS</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;">API Testing</td>
                <td style="padding: 8px; border: 1px solid #ddd;">✅ Integrado</td>
                <td style="padding: 8px; border: 1px solid #ddd;">❌ Externo</td>
                <td style="padding: 8px; border: 1px solid #ddd;">✅ Integrado</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">Trace Viewer</td>
                <td style="padding: 8px; border: 1px solid #ddd;">✅ Incluido</td>
                <td style="padding: 8px; border: 1px solid #ddd;">❌ No</td>
                <td style="padding: 8px; border: 1px solid #ddd;">⚠️ Dashboard</td>
            </tr>
        </table>

        <h3>🎯 Ejercicio práctico</h3>
        <p>Analiza el siguiente código y responde las preguntas:</p>
        <div class="code-tabs" data-code-id="L001-2">
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
                <pre><code class="language-python"># test_mi_primer_test.py
from playwright.sync_api import Page, expect

def test_busqueda_wikipedia(page: Page):
    # 1. Navegar a Wikipedia
    page.goto("https://es.wikipedia.org/")

    # 2. Escribir en el campo de búsqueda
    page.get_by_role("searchbox", name="Buscar en Wikipedia").fill("Playwright")

    # 3. Hacer click en el botón buscar
    page.get_by_role("button", name="Buscar").click()

    # 4. Verificar que la página de resultados se cargó
    expect(page).to_have_title(re.compile("Playwright"))</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// test_mi_primer_test.spec.ts
import { test, expect } from '@playwright/test';

test('busqueda wikipedia', async ({ page }) => {
    // 1. Navegar a Wikipedia
    await page.goto("https://es.wikipedia.org/");

    // 2. Escribir en el campo de búsqueda
    await page.getByRole('searchbox', { name: 'Buscar en Wikipedia' }).fill("Playwright");

    // 3. Hacer click en el botón buscar
    await page.getByRole('button', { name: 'Buscar' }).click();

    // 4. Verificar que la página de resultados se cargó
    await expect(page).toHaveTitle(/Playwright/);
});</code></pre>
            </div>
        </div>

        <ol>
            <li>¿Qué hace <code>page.goto()</code> en la línea 6?</li>
            <li>¿Por qué usamos <code>get_by_role("searchbox")</code> en vez de un selector CSS?</li>
            <li>¿Qué pasaría si el título no contiene "Playwright"? ¿Se queda esperando para siempre?</li>
            <li>¿Necesitamos agregar un <code>time.sleep()</code> entre el click y la verificación? ¿Por qué?</li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Entender qué es Playwright y por qué usarlo con Python</li>
                <li>Conocer la estructura básica de un test con pytest</li>
                <li>Comprender los conceptos de auto-waiting y localizadores semánticos</li>
                <li>Comparar Playwright con otras herramientas de automatización</li>
            </ul>
        </div>

        <div style="background: #fff3cd; padding: 10px; border-radius: 8px; margin: 10px 0;">
            <h4>💡 Tip:</h4>
            <p>En Playwright, <strong>nunca necesitas <code>time.sleep()</code></strong>. El framework espera automáticamente
            a que los elementos estén listos antes de interactuar. Esto hace tus tests más rápidos y estables.</p>
        </div>

        <h3>🚀 Siguiente: Lección 002 - Instalación de Python y pip</h3>
        <p>Prepararemos tu entorno de desarrollo instalando Python y las herramientas necesarias.</p>
    `,
    topics: ["playwright", "introducción", "python"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 8,
    difficulty: "easy",
    type: "foundation"
};

// Registro global para uso en browser
if (typeof window !== 'undefined') {
    window.LESSON_001 = LESSON_001;
}
