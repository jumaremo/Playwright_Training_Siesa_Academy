/**
 * Playwright Academy - Lección 017
 * Manejo de timeouts
 * Sección 2: Fundamentos de Playwright
 */

const LESSON_017 = {
    id: 17,
    title: "Manejo de timeouts",
    duration: "5 min",
    level: "beginner",
    section: "section-02",
    content: `
        <h2>⏱️ Manejo de timeouts</h2>
        <p>Los timeouts definen cuánto tiempo Playwright espera antes de reportar un fallo.
        Configurarlos correctamente es clave para tener tests estables y rápidos.</p>

        <h3>📊 Tipos de timeout en Playwright</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #e8f5e9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Tipo</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Default</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Aplica a</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Action timeout</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">30s</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">click, fill, check, etc.</td>
                </tr>
                <tr style="background: #f9f9f9;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Navigation timeout</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">30s</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">goto, go_back, reload</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Expect timeout</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">5s</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">expect() assertions</td>
                </tr>
                <tr style="background: #f9f9f9;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Test timeout</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Sin límite*</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Duración total del test</td>
                </tr>
            </table>
            <p style="font-size: 0.85em;">*pytest no tiene timeout por defecto. Usa <code>pytest-timeout</code>.</p>
        </div>

        <h3>🔧 Configurar timeouts globales</h3>
        <div class="code-tabs" data-code-id="L017-1">
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
                <pre><code class="language-python"># conftest.py

import pytest

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        # Timeout para navegación: 60 segundos
        # (se configura en el contexto)
    }

# Configurar timeout de acciones por página
@pytest.fixture(autouse=True)
def configurar_timeouts(page):
    # Timeout para acciones (click, fill, etc.)
    page.set_default_timeout(10000)  # 10 segundos

    # Timeout para navegación (goto, go_back)
    page.set_default_navigation_timeout(30000)  # 30 segundos

    yield page</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    // Timeout para cada test completo: 60 segundos
    timeout: 60000,

    // Timeout para expect() assertions
    expect: {
        timeout: 10000  // 10 segundos
    },

    use: {
        // Timeout para acciones (click, fill, etc.)
        actionTimeout: 10000,  // 10 segundos

        // Timeout para navegación (goto, goBack)
        navigationTimeout: 30000,  // 30 segundos
    }
});</code></pre>
            </div>
        </div>

        <h3>⏳ Timeout por acción individual</h3>
        <div class="code-tabs" data-code-id="L017-2">
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
                <pre><code class="language-python">from playwright.sync_api import Page, expect

def test_timeouts_individuales(page: Page):
    # Timeout en goto
    page.goto("https://sitio-lento.com", timeout=60000)

    # Timeout en click
    page.click("#boton-dinamico", timeout=15000)

    # Timeout en fill
    page.fill("#campo-ajax", "texto", timeout=10000)

    # Timeout en expect
    expect(page.locator("#resultado")).to_be_visible(timeout=20000)
    expect(page).to_have_url("**/resultado", timeout=15000)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('timeouts individuales', async ({ page }) => {
    // Timeout en goto
    await page.goto('https://sitio-lento.com', { timeout: 60000 });

    // Timeout en click
    await page.click('#boton-dinamico', { timeout: 15000 });

    // Timeout en fill
    await page.fill('#campo-ajax', 'texto', { timeout: 10000 });

    // Timeout en expect
    await expect(page.locator('#resultado')).toBeVisible({ timeout: 20000 });
    await expect(page).toHaveURL('**/resultado', { timeout: 15000 });
});</code></pre>
            </div>
        </div>

        <h3>🎯 wait_for_selector y wait_for_url</h3>
        <div class="code-tabs" data-code-id="L017-3">
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
                <pre><code class="language-python">def test_esperas_explicitas(page: Page):
    page.goto("https://mi-app.com")

    # Esperar a que un elemento aparezca
    page.wait_for_selector("#datos-cargados", timeout=15000)

    # Esperar a que un elemento desaparezca
    page.wait_for_selector("#spinner", state="hidden", timeout=10000)

    # Esperar a que un elemento sea eliminado del DOM
    page.wait_for_selector("#temporal", state="detached")

    # Esperar a que un elemento sea adjuntado al DOM
    page.wait_for_selector("#nuevo-elemento", state="attached")

    # Esperar URL específica
    page.wait_for_url("**/dashboard", timeout=10000)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('esperas explícitas', async ({ page }) => {
    await page.goto('https://mi-app.com');

    // Esperar a que un elemento aparezca
    await page.waitForSelector('#datos-cargados', { timeout: 15000 });

    // Esperar a que un elemento desaparezca
    await page.waitForSelector('#spinner', { state: 'hidden', timeout: 10000 });

    // Esperar a que un elemento sea eliminado del DOM
    await page.waitForSelector('#temporal', { state: 'detached' });

    // Esperar a que un elemento sea adjuntado al DOM
    await page.waitForSelector('#nuevo-elemento', { state: 'attached' });

    // Esperar URL específica
    await page.waitForURL('**/dashboard', { timeout: 10000 });
});</code></pre>
            </div>
        </div>

        <h3>⏰ wait_for_timeout (la pausa explícita)</h3>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L017-4">
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
                    <pre><code class="language-python"># ⚠️ EVITA usar wait_for_timeout en tests reales
# Solo úsalo para debugging temporal

def test_con_pausa(page: Page):
    page.goto("https://example.com")

    # Pausa fija de 2 segundos (NO recomendado en producción)
    page.wait_for_timeout(2000)

    # ✅ Mejor: esperar una condición real
    page.wait_for_selector("#elemento-cargado")
    # o
    expect(page.locator("#elemento-cargado")).to_be_visible()</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-typescript">// ⚠️ EVITA usar waitForTimeout en tests reales
// Solo úsalo para debugging temporal

test('con pausa', async ({ page }) => {
    await page.goto('https://example.com');

    // Pausa fija de 2 segundos (NO recomendado en producción)
    await page.waitForTimeout(2000);

    // ✅ Mejor: esperar una condición real
    await page.waitForSelector('#elemento-cargado');
    // o
    await expect(page.locator('#elemento-cargado')).toBeVisible();
});</code></pre>
                </div>
            </div>
            <p><strong>Regla de oro:</strong> Nunca uses <code>wait_for_timeout()</code> como solución permanente.
            Siempre espera una condición real (selector visible, URL, etc.).</p>
        </div>

        <h3>🔄 wait_for_load_state y wait_for_event</h3>
        <div class="code-tabs" data-code-id="L017-5">
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
                <pre><code class="language-python">def test_esperar_estados(page: Page):
    page.goto("https://mi-app.com")

    # Esperar estado de carga de la página
    page.wait_for_load_state("networkidle")

    # Esperar un evento específico
    with page.expect_response("**/api/datos") as response_info:
        page.click("#btn-cargar")

    response = response_info.value
    assert response.status == 200
    print(f"Datos recibidos: {response.json()}")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('esperar estados', async ({ page }) => {
    await page.goto('https://mi-app.com');

    // Esperar estado de carga de la página
    await page.waitForLoadState('networkidle');

    // Esperar un evento específico
    const [response] = await Promise.all([
        page.waitForResponse('**/api/datos'),
        page.click('#btn-cargar')
    ]);

    expect(response.status()).toBe(200);
    console.log(\`Datos recibidos: \${JSON.stringify(await response.json())}\`);
});</code></pre>
            </div>
        </div>

        <h3>📋 pytest-timeout para tests completos</h3>
        <div class="code-tabs" data-code-id="L017-6">
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
                <pre><code class="language-bash"># Instalar
pip install pytest-timeout</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <div class="code-note">
                    <span class="code-note-icon">ℹ️</span>
                    <span class="code-note-text">Equivalente con Playwright Test (TypeScript):</span>
                </div>
                <pre><code class="language-bash"># No se requiere instalación adicional
# El timeout se configura en playwright.config.ts
npx playwright test --timeout=120000</code></pre>
            </div>
        </div>
        <div class="code-tabs" data-code-id="L017-7">
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
                <pre><code class="language-python"># pytest.ini o pyproject.toml
# [pytest]
# timeout = 120  # 2 minutos máximo por test

# O por test individual con decorador:
import pytest

@pytest.mark.timeout(60)
def test_proceso_largo(page):
    """Este test tiene máximo 60 segundos."""
    page.goto("/proceso-largo")
    page.click("#iniciar")
    expect(page.locator("#completado")).to_be_visible(timeout=50000)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// playwright.config.ts
// timeout: 120000  // 2 minutos máximo por test (global)

// O por test individual con test.setTimeout:
import { test, expect } from '@playwright/test';

test('proceso largo', async ({ page }) => {
    /** Este test tiene máximo 60 segundos. */
    test.setTimeout(60000);

    await page.goto('/proceso-largo');
    await page.click('#iniciar');
    await expect(page.locator('#completado')).toBeVisible({ timeout: 50000 });
});</code></pre>
            </div>
        </div>

        <h3>💡 Estrategia recomendada de timeouts</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <ol>
                <li><strong>Acciones:</strong> 10-15s (suficiente para auto-waiting)</li>
                <li><strong>Navegación:</strong> 30s (páginas lentas pueden tardar)</li>
                <li><strong>Assertions:</strong> 5-10s (expect reintenta automáticamente)</li>
                <li><strong>Test completo:</strong> 60-120s (límite con pytest-timeout)</li>
                <li><strong>CI/CD:</strong> Duplica los timeouts locales (CI es más lento)</li>
            </ol>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <ol>
            <li>Configura timeouts globales en <code>conftest.py</code></li>
            <li>Escribe un test que use <code>wait_for_selector</code></li>
            <li>Prueba <code>expect().to_be_visible(timeout=1000)</code> con un timeout corto para ver cómo falla</li>
            <li>Instala <code>pytest-timeout</code> y configura un timeout global</li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Entender los 4 tipos de timeout en Playwright</li>
                <li>Configurar timeouts globales y por acción</li>
                <li>Usar esperas inteligentes (<code>wait_for_selector</code>, <code>wait_for_url</code>)</li>
                <li>Evitar <code>wait_for_timeout</code> como solución permanente</li>
            </ul>
        </div>
    `,
    topics: ["timeouts", "esperas", "configuración"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_017 = LESSON_017;
}
