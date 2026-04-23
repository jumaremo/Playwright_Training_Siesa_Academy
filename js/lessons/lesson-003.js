/**
 * Playwright Academy - Lección 003
 * Instalación de Playwright y navegadores
 * Sección 1: Configuración del Entorno
 */

const LESSON_003 = {
    id: 3,
    title: "Instalación de Playwright y navegadores",
    duration: "10 min",
    level: "beginner",
    section: "section-01",
    content: `
        <h2>🎭 Instalación de Playwright y navegadores</h2>
        <p>Playwright necesita dos cosas: el paquete Python (o npm) y los binarios de los navegadores.
        En esta lección instalaremos ambos.</p>

        <div style="background: #e0f2f1; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #009688;">
            <h4>🔍 Verificación de prerequisitos</h4>
            <p>Antes de continuar, confirma que tienes las herramientas base instaladas:</p>
            <div class="code-tabs" data-code-id="L003-prereq">
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
                    <pre><code class="language-bash"># Los 3 deben funcionar:
python --version       # Python 3.8+ ✓
pip --version          # pip 23+ ✓
# Y tu entorno virtual debe estar activado:
# (venv) debe aparecer al inicio del prompt</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-bash"># Los 2 deben funcionar:
node --version   # v18+ ✓
npm --version    # 9+ ✓</code></pre>
                </div>
            </div>
            <p style="margin-bottom: 0;">Si algún comando falla, vuelve a la <strong>Lección 002</strong> para configurar tu entorno.</p>
        </div>

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
                <pre><code class="language-bash"># Opción A: Inicialización guiada (RECOMENDADA para proyectos nuevos)
npm init playwright@latest
# Esto genera automáticamente:
#   playwright.config.ts   → configuración del framework
#   tests/example.spec.ts  → test de ejemplo funcional
#   package.json           → dependencias actualizadas
#   tests-examples/        → más ejemplos de referencia

# Opción B: Instalación manual (para proyectos existentes)
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

# Output esperado (las versiones pueden variar):
# Downloading Chromium 136.0.7103.25 ...
# Downloading Firefox 137.0 ...
# Downloading WebKit 18.4 ...

# Si solo necesitas Chromium (más rápido, ~150MB menos):
playwright install chromium</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <div class="code-note">
                    <span class="code-note-icon">ℹ️</span>
                    <span class="code-note-text">Equivalente con Playwright Test (TypeScript):</span>
                </div>
                <pre><code class="language-bash"># Instalar los 3 navegadores (Chromium, Firefox, WebKit)
npx playwright install

# Output esperado (las versiones pueden variar):
# Downloading Chromium 136.0.7103.25 ...
# Downloading Firefox 137.0 ...
# Downloading WebKit 18.4 ...

# Si solo necesitas Chromium (más rápido, ~150MB menos):
npx playwright install chromium

# Nota: si usaste "npm init playwright@latest",
# los navegadores ya se instalaron automáticamente</code></pre>
            </div>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔍 ¿Qué se instaló?</h4>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #c8e6c9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Paquete Python</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Paquete TypeScript</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Propósito</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>playwright</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>playwright</code> (incluido en @playwright/test)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Biblioteca principal para controlar navegadores</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>pytest-playwright</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">— (integrado)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Plugin de test: fixtures <code>page</code>, <code>browser</code>, <code>context</code></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>pytest</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>@playwright/test</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Framework de testing / Test runner</td>
                </tr>
            </table>
            <p style="margin-top: 10px; margin-bottom: 0;"><strong>Nota:</strong> En TypeScript, <code>@playwright/test</code> incluye todo en un solo paquete:
            Playwright + test runner + assertions + fixtures. No necesitas instalar nada adicional.</p>
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

# Listar tests disponibles
npx playwright test --list

# Ejecutar el test de ejemplo (si usaste npm init playwright@latest)
npx playwright test

# Output esperado:
# Running 6 tests using 6 workers
#   6 passed (5.2s)</code></pre>
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

        <h3>🔧 Troubleshooting</h3>
        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #fff3cd;">
                <th style="padding: 10px; border: 1px solid #ddd; width: 40%;">Error</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Solución</th>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><code>browserType.launch: Executable doesn't exist</code></td>
                <td style="padding: 10px; border: 1px solid #ddd;">Los navegadores no están instalados. Ejecuta <code>playwright install</code> (Python) o <code>npx playwright install</code> (TS)</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 10px; border: 1px solid #ddd;"><code>Host system is missing dependencies</code> (Linux)</td>
                <td style="padding: 10px; border: 1px solid #ddd;">Ejecuta <code>playwright install-deps</code> o <code>npx playwright install-deps</code> para instalar librerías del sistema</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">Error de timeout al descargar navegadores</td>
                <td style="padding: 10px; border: 1px solid #ddd;">Proxy corporativo: configura <code>HTTPS_PROXY=http://proxy:puerto</code> antes de ejecutar <code>playwright install</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 10px; border: 1px solid #ddd;"><code>Permission denied</code> al instalar (Linux)</td>
                <td style="padding: 10px; border: 1px solid #ddd;">No uses <code>sudo pip install</code>. Asegúrate de tener el entorno virtual activado</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><code>npm ERR! code EACCES</code> (Linux/macOS)</td>
                <td style="padding: 10px; border: 1px solid #ddd;">Configura npm para usar un directorio local: <code>npm config set prefix ~/.npm-global</code> y agrega al PATH</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 10px; border: 1px solid #ddd;">Navegadores ocupan mucho espacio</td>
                <td style="padding: 10px; border: 1px solid #ddd;">Instala solo Chromium: <code>playwright install chromium</code> (~250MB vs ~700MB con los 3)</td>
            </tr>
        </table>

        <h3>🎯 Ejercicio práctico</h3>
        <ol>
            <li>Con tu entorno preparado, instala Playwright:</li>
        </ol>
        <div class="code-tabs" data-code-id="L003-5a">
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
                <pre><code class="language-bash"># ☐ 1. Instalar paquetes
pip install playwright pytest-playwright

# ☐ 2. Instalar navegadores
playwright install

# ☐ 3. Verificar versión
python -c "import playwright; print(playwright.__version__)"</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-bash"># ☐ 1. Inicializar proyecto (si no lo hiciste en L002)
npm init playwright@latest

# ☐ 2. Verificar navegadores (ya se instalaron automáticamente)
npx playwright --version

# ☐ 3. Ejecutar tests de ejemplo
npx playwright test</code></pre>
            </div>
        </div>

        <ol start="4">
            <li>Crea tu primer test de verificación:</li>
        </ol>
        <div class="code-tabs" data-code-id="L003-5b">
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
import re
from playwright.sync_api import Page, expect

def test_playwright_funciona(page: Page):
    page.goto("https://playwright.dev/python/")
    expect(page).to_have_title(re.compile("Playwright"))</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// tests/verificacion.spec.ts
import { test, expect } from '@playwright/test';

test('playwright funciona', async ({ page }) => {
    await page.goto("https://playwright.dev/");
    await expect(page).toHaveTitle(/Playwright/);
});</code></pre>
            </div>
        </div>

        <ol start="5">
            <li>Ejecuta el test y verifica el resultado:</li>
        </ol>
        <div class="code-tabs" data-code-id="L003-5c">
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
                <pre><code class="language-bash"># ☐ Ejecutar
pytest test_verificacion.py -v

# Output esperado:
# test_verificacion.py::test_playwright_funciona PASSED
#
# ====== 1 passed in 3.52s ======</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-bash"># ☐ Ejecutar
npx playwright test tests/verificacion.spec.ts

# Output esperado:
# Running 1 test using 1 worker
#   1 passed (2.1s)

# ☐ Ver el reporte HTML (opcional)
npx playwright show-report</code></pre>
            </div>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Checklist de verificación final</h4>
            <ul style="list-style: none; padding-left: 5px;">
                <li>☐ Playwright instalado (<code>python -c "import playwright"</code> sin error)</li>
                <li>☐ Navegadores descargados (<code>playwright install</code> completado)</li>
                <li>☐ Test de verificación ejecutado y pasó (PASSED)</li>
                <li>☐ Entiendes la diferencia entre <code>playwright</code> (paquete) y <code>pytest-playwright</code> (plugin)</li>
            </ul>
        </div>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Instalar Playwright y pytest-playwright / @playwright/test</li>
                <li>Descargar los navegadores que Playwright controla</li>
                <li>Verificar que la instalación funciona correctamente</li>
                <li>Ejecutar tu primer test real con pytest / Playwright Test</li>
                <li>Saber resolver los errores más comunes de instalación</li>
            </ul>
        </div>

        <div style="background: #fff3cd; padding: 10px; border-radius: 8px; margin: 10px 0;">
            <h4>💡 Tip:</h4>
            <p>Los navegadores de Playwright se almacenan en <code>~/.cache/ms-playwright/</code> (Linux/Mac)
            o <code>%USERPROFILE%\\AppData\\Local\\ms-playwright</code> (Windows). Ocupan ~500MB en total.
            Si necesitas liberar espacio, puedes borrar esa carpeta y reinstalar solo los que necesites.</p>
        </div>

        <h3>🚀 Siguiente: Lección 004 - Configuración de VS Code / PyCharm</h3>
        <p>Configuraremos tu IDE para trabajar eficientemente con Playwright.</p>
    `,
    topics: ["playwright", "instalación", "navegadores", "troubleshooting"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 10,
    difficulty: "easy",
    type: "foundation"
};

if (typeof window !== 'undefined') {
    window.LESSON_003 = LESSON_003;
}
