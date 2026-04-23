/**
 * Playwright Academy - Lección 003
 * Instalación de Playwright y navegadores
 * Sección 1: Configuración del Entorno
 */

const LESSON_003 = {
    id: 3,
    title: "Instalación de Playwright y navegadores",
    duration: "8 min",
    level: "beginner",
    section: "section-01",
    content: `
        <h2>🎭 Instalación de Playwright y navegadores</h2>
        <p>Playwright necesita dos cosas: el paquete Python y los binarios de los navegadores.
        En esta lección instalaremos ambos.</p>

        <h3>📥 Paso 1: Instalar paquetes</h3>
        <div class="code-tabs" data-code-id="L003-1">
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
                <pre><code class="language-bash"># Asegúrate de tener el entorno virtual activado
# (venv) debe aparecer en tu terminal

# Instalar Playwright y el plugin de pytest
pip install playwright pytest-playwright

# O instalar desde requirements.txt
pip install -r requirements.txt</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <div class="code-note">
                    <span class="code-note-icon">ℹ️</span>
                    <span class="code-note-text">Equivalente con Playwright Test (TypeScript):</span>
                </div>
                <pre><code class="language-bash"># Inicializar un proyecto Playwright con TypeScript
npm init playwright@latest

# O instalar manualmente
npm install -D @playwright/test

# Instalar desde package.json existente
npm install</code></pre>
            </div>
        </div>

        <h3>🌐 Paso 2: Instalar navegadores</h3>
        <p>Playwright descarga sus propios navegadores (no usa los instalados en tu sistema):</p>
        <div class="code-tabs" data-code-id="L003-2">
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
                <pre><code class="language-bash"># Instalar los 3 navegadores (Chromium, Firefox, WebKit)
playwright install

# Output esperado:
# Downloading Chromium 131.0.6778.33 ...
# Downloading Firefox 132.0 ...
# Downloading WebKit 18.2 ...

# Si solo necesitas Chromium (más rápido):
playwright install chromium</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <div class="code-note">
                    <span class="code-note-icon">ℹ️</span>
                    <span class="code-note-text">Equivalente con Playwright Test (TypeScript):</span>
                </div>
                <pre><code class="language-bash"># Instalar los 3 navegadores (Chromium, Firefox, WebKit)
npx playwright install

# Output esperado:
# Downloading Chromium 131.0.6778.33 ...
# Downloading Firefox 132.0 ...
# Downloading WebKit 18.2 ...

# Si solo necesitas Chromium (más rápido):
npx playwright install chromium</code></pre>
            </div>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔍 ¿Qué se instaló?</h4>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #c8e6c9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Paquete</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Propósito</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>playwright</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Biblioteca principal para controlar navegadores</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>pytest-playwright</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Plugin de pytest que provee fixtures: <code>page</code>, <code>browser</code>, <code>context</code></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>pytest</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Framework de testing (se instala como dependencia)</td>
                </tr>
            </table>
        </div>

        <h3>✅ Paso 3: Verificar la instalación</h3>
        <div class="code-tabs" data-code-id="L003-3">
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
                <pre><code class="language-bash"># Verificar que Playwright está instalado
python -c "import playwright; print(playwright.__version__)"

# Verificar pytest-playwright
pip show pytest-playwright

# Listar navegadores instalados
playwright install --help

# Test rápido desde línea de comandos
python -c "
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto('https://playwright.dev')
    print(f'Título: {page.title()}')
    browser.close()
    print('¡Playwright funciona correctamente!')
"</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <div class="code-note">
                    <span class="code-note-icon">ℹ️</span>
                    <span class="code-note-text">Equivalente con Playwright Test (TypeScript):</span>
                </div>
                <pre><code class="language-bash"># Verificar que Playwright está instalado
npx playwright --version

# Listar navegadores instalados
npx playwright install --help

# Test rápido desde línea de comandos
npx playwright test --list

# Ejecutar el test de ejemplo generado al inicializar
npx playwright test</code></pre>
            </div>
        </div>

        <h3>🐧 Dependencias del sistema (Linux)</h3>
        <p>En Linux, Playwright necesita algunas librerías del sistema:</p>
        <div class="code-tabs" data-code-id="L003-4">
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
                <pre><code class="language-bash"># Instalar dependencias del sistema automáticamente
playwright install-deps

# O manualmente en Ubuntu/Debian:
sudo apt install libwoff1 libvpx7 libgstreamer-plugins-bad1.0-0 \\
    libenchant-2-2 libsecret-1-0 libhyphen0 libmanette-0.2-0</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <div class="code-note">
                    <span class="code-note-icon">ℹ️</span>
                    <span class="code-note-text">Equivalente con Playwright Test (TypeScript):</span>
                </div>
                <pre><code class="language-bash"># Instalar dependencias del sistema automáticamente
npx playwright install-deps

# O manualmente en Ubuntu/Debian:
sudo apt install libwoff1 libvpx7 libgstreamer-plugins-bad1.0-0 \\
    libenchant-2-2 libsecret-1-0 libhyphen0 libmanette-0.2-0</code></pre>
            </div>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <ol>
            <li>Con tu entorno virtual activado, instala Playwright: <code>pip install playwright pytest-playwright</code></li>
            <li>Instala los navegadores: <code>playwright install</code></li>
            <li>Ejecuta el test rápido de verificación (código de arriba)</li>
            <li>Crea un archivo <code>test_verificacion.py</code> con este contenido:</li>
        </ol>
        <div class="code-tabs" data-code-id="L003-5">
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
                <pre><code class="language-python"># test_verificacion.py
from playwright.sync_api import Page, expect

def test_playwright_funciona(page: Page):
    page.goto("https://playwright.dev/python/")
    expect(page).to_have_title(re.compile("Playwright"))</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// test_verificacion.spec.ts
import { test, expect } from '@playwright/test';

test('playwright funciona', async ({ page }) => {
    await page.goto("https://playwright.dev/");
    await expect(page).toHaveTitle(/Playwright/);
});</code></pre>
            </div>
        </div>
        <ol start="5">
            <li>Ejecútalo con: <code>pytest test_verificacion.py -v</code></li>
            <li>Deberías ver un resultado verde: <code>PASSED</code></li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Instalar Playwright y pytest-playwright con pip</li>
                <li>Descargar los navegadores que Playwright controla</li>
                <li>Verificar que la instalación funciona correctamente</li>
                <li>Ejecutar tu primer test real con pytest</li>
            </ul>
        </div>

        <div style="background: #fff3cd; padding: 10px; border-radius: 8px; margin: 10px 0;">
            <h4>💡 Tip:</h4>
            <p>Los navegadores de Playwright se almacenan en <code>~/.cache/ms-playwright/</code> (Linux/Mac)
            o <code>%USERPROFILE%\\AppData\\Local\\ms-playwright</code> (Windows). Ocupan ~500MB en total.</p>
        </div>

        <h3>🚀 Siguiente: Lección 004 - Configuración de VS Code / PyCharm</h3>
        <p>Configuraremos tu IDE para trabajar eficientemente con Playwright.</p>
    `,
    topics: ["playwright", "instalación", "navegadores"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 8,
    difficulty: "easy",
    type: "foundation"
};

if (typeof window !== 'undefined') {
    window.LESSON_003 = LESSON_003;
}
