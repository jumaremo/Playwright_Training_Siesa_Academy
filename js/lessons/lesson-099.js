/**
 * Playwright Academy - Leccion 099
 * Screenshot comparison nativa
 * Seccion 15: Visual Regression y Accessibility Testing
 */

const LESSON_099 = {
    id: 99,
    title: "Screenshot comparison nativa",
    duration: "10 min",
    level: "advanced",
    section: "section-15",
    content: `
        <h2>👁️ Screenshot comparison nativa</h2>
        <p>Bienvenido a la <strong>Seccion 15: Visual Regression y Accessibility Testing</strong>.
        En esta primera leccion aprenderemos a usar la capacidad <strong>nativa</strong> de Playwright
        para comparar screenshots y detectar regresiones visuales sin necesidad de herramientas externas.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎯 Objetivo de la leccion</h4>
            <p>Dominar <code>expect(page).to_have_screenshot()</code> y
            <code>expect(locator).to_have_screenshot()</code> para implementar pruebas de regresion visual
            usando las herramientas integradas de Playwright, sin dependencias adicionales.</p>
        </div>

        <h3>📸 ¿Que es Visual Regression Testing?</h3>
        <p>El <strong>Visual Regression Testing</strong> (pruebas de regresion visual) es una tecnica
        que compara screenshots de la interfaz de usuario entre ejecuciones de tests para detectar
        cambios visuales no intencionados. Es el complemento perfecto de las pruebas funcionales:
        mientras estas validan que los botones <em>funcionan</em>, las pruebas visuales validan
        que los botones <em>se ven correctamente</em>.</p>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ ¿Por que importa?</h4>
            <ul>
                <li><strong>Detecta bugs invisibles a los tests funcionales:</strong> un CSS roto puede mover
                un boton fuera del viewport sin que falle ningun click</li>
                <li><strong>Protege contra regresiones de diseño:</strong> cambios en un componente compartido
                pueden afectar 50 paginas diferentes</li>
                <li><strong>Complementa al ojo humano:</strong> diferencias de 1px o cambios sutiles de color
                pasan desapercibidos en revision manual</li>
                <li><strong>Documentacion viviente:</strong> las imagenes baseline sirven como referencia
                visual del estado esperado de la UI</li>
            </ul>
        </div>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>❌ Problemas que resuelve</h4>
            <ul>
                <li>Un desarrollador actualiza una libreria CSS y rompe el layout del dashboard</li>
                <li>Un merge conflict en un archivo SCSS elimina estilos de un componente</li>
                <li>Un cambio en una fuente web modifica el espaciado de todo el sitio</li>
                <li>Una actualizacion de dependencias cambia el render de iconos SVG</li>
            </ul>
        </div>

        <h3>🔧 Requisitos previos</h3>
        <p>Para usar screenshot comparison nativa necesitas <strong>pytest-playwright</strong>
        (que ya usamos desde la Seccion 1) y Python. No se requiere ninguna libreria adicional.</p>

        <pre><code class="bash"># Verificar que pytest-playwright esta instalado
pip show pytest-playwright

# Estructura minima del proyecto
mi_proyecto/
├── tests/
│   ├── test_visual.py
│   └── test_visual-snapshots/    # Playwright crea esta carpeta automaticamente
│       └── test-visual-home-page-chromium-linux.png
├── conftest.py
└── pytest.ini</code></pre>

        <h3>📷 expect(page).to_have_screenshot() — Comparacion de pagina completa</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Este es el metodo principal para visual regression testing. Captura un screenshot
            de la pagina completa (viewport visible) y lo compara contra una imagen baseline almacenada.</p>
        </div>

        <div class="code-tabs" data-code-id="L099-1">
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
                <pre><code class="language-python"># test_visual.py
from playwright.sync_api import Page, expect

def test_home_page_visual(page: Page):
    """Verifica que la pagina principal no tenga cambios visuales."""
    page.goto("https://mi-app.com")

    # Primera ejecucion: genera la imagen baseline (golden screenshot)
    # Ejecuciones posteriores: compara contra la baseline
    expect(page).to_have_screenshot()
</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// test_visual.spec.ts
import { test, expect } from '@playwright/test';

test('home page visual', async ({ page }) => {
    // Verifica que la pagina principal no tenga cambios visuales.
    await page.goto('https://mi-app.com');

    // Primera ejecucion: genera la imagen baseline (golden screenshot)
    // Ejecuciones posteriores: compara contra la baseline
    await expect(page).toHaveScreenshot();
});</code></pre>
            </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>La <strong>primera vez</strong> que ejecutas un test con <code>to_have_screenshot()</code>,
            Playwright genera automaticamente la imagen baseline (llamada "golden screenshot") y
            <strong>el test falla intencionalmente</strong>. Esto es normal — es Playwright indicandote
            que revises la imagen generada y confirmes que es correcta. En la segunda ejecucion,
            ya compara contra esa baseline.</p>
        </div>

        <h4>Asignar nombre al screenshot</h4>
        <div class="code-tabs" data-code-id="L099-2">
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
                <pre><code class="language-python">def test_dashboard_visual(page: Page):
    page.goto("https://mi-app.com/dashboard")

    # Sin nombre: Playwright genera uno basado en el nombre del test
    # Archivo: test-dashboard-visual-1-chromium-linux.png
    expect(page).to_have_screenshot()

    # Con nombre explicito: mas claro y predecible
    # Archivo: dashboard-principal.png
    expect(page).to_have_screenshot("dashboard-principal.png")
</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('dashboard visual', async ({ page }) => {
    await page.goto('https://mi-app.com/dashboard');

    // Sin nombre: Playwright genera uno basado en el nombre del test
    // Archivo: dashboard-visual-1-chromium-linux.png
    await expect(page).toHaveScreenshot();

    // Con nombre explicito: mas claro y predecible
    // Archivo: dashboard-principal.png
    await expect(page).toHaveScreenshot('dashboard-principal.png');
});</code></pre>
            </div>
        </div>

        <h3>🎯 expect(locator).to_have_screenshot() — Comparacion a nivel de elemento</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Cuando no necesitas comparar toda la pagina sino un <strong>componente especifico</strong>,
            usa la version con locator. Esto es mas preciso, mas rapido y menos propenso a
            falsos positivos por cambios en areas no relacionadas.</p>
        </div>

        <div class="code-tabs" data-code-id="L099-3">
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

def test_navbar_visual(page: Page):
    """Verifica que el navbar no cambie visualmente."""
    page.goto("https://mi-app.com")

    navbar = page.locator("nav.navbar-principal")
    expect(navbar).to_have_screenshot("navbar.png")


def test_tarjeta_producto(page: Page):
    """Verifica la apariencia de una tarjeta de producto."""
    page.goto("https://mi-app.com/productos/1")

    tarjeta = page.get_by_test_id("tarjeta-producto")
    expect(tarjeta).to_have_screenshot("tarjeta-producto-detalle.png")


def test_footer_visual(page: Page):
    """Verifica el footer con comparacion de elemento."""
    page.goto("https://mi-app.com")

    footer = page.locator("footer")
    expect(footer).to_have_screenshot("footer-principal.png")
</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('navbar visual', async ({ page }) => {
    // Verifica que el navbar no cambie visualmente.
    await page.goto('https://mi-app.com');

    const navbar = page.locator('nav.navbar-principal');
    await expect(navbar).toHaveScreenshot('navbar.png');
});


test('tarjeta producto', async ({ page }) => {
    // Verifica la apariencia de una tarjeta de producto.
    await page.goto('https://mi-app.com/productos/1');

    const tarjeta = page.getByTestId('tarjeta-producto');
    await expect(tarjeta).toHaveScreenshot('tarjeta-producto-detalle.png');
});


test('footer visual', async ({ page }) => {
    // Verifica el footer con comparacion de elemento.
    await page.goto('https://mi-app.com');

    const footer = page.locator('footer');
    await expect(footer).toHaveScreenshot('footer-principal.png');
});</code></pre>
            </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>En SIESA preferimos <code>expect(locator).to_have_screenshot()</code> sobre la version
            de pagina completa para componentes criticos. Es mas estable porque no se ve afectado
            por cambios en otras partes de la pagina (banners, notificaciones, etc.).</p>
        </div>

        <h3>🔄 Flujo de trabajo: Baseline → Comparacion → Actualizacion</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Paso</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Comando</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Resultado</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>1. Generar baseline</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>pytest tests/test_visual.py</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Falla en primera ejecucion, genera imagenes baseline</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>2. Verificar baseline</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Revision manual de imagenes</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Confirmar que las imagenes son correctas</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>3. Comparar</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>pytest tests/test_visual.py</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Pasa si no hay diferencias visuales</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>4. Actualizar</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>pytest --update-snapshots</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Regenera todas las baselines</td>
                </tr>
            </table>
        </div>

        <h4>Actualizar baselines con --update-snapshots</h4>
        <pre><code class="bash"># Cuando hay un cambio visual INTENCIONAL (rediseño, nuevo tema, etc.)
# debes actualizar las baselines:

# Actualizar TODAS las baselines del proyecto
pytest --update-snapshots

# Actualizar solo las baselines de un archivo especifico
pytest tests/test_visual.py --update-snapshots

# Actualizar solo un test especifico
pytest tests/test_visual.py::test_home_page_visual --update-snapshots

# IMPORTANTE: Despues de actualizar, revisar los cambios en git
git diff --stat  # Ver que imagenes cambiaron
git add tests/   # Agregar las nuevas baselines al repositorio</code></pre>

        <h3>⚙️ Opciones de comparacion de screenshots</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Playwright ofrece varias opciones para controlar la <strong>sensibilidad</strong>
            de la comparacion. Esto es fundamental para evitar falsos positivos causados por
            diferencias minimas de renderizado (anti-aliasing, subpixel rendering, etc.).</p>
        </div>

        <div class="code-tabs" data-code-id="L099-4">
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

def test_visual_con_opciones(page: Page):
    page.goto("https://mi-app.com")

    # --- max_diff_pixels ---
    # Numero maximo de pixeles que pueden diferir
    # Util para tolerar diferencias minimas de anti-aliasing
    expect(page).to_have_screenshot(
        "home-tolerante.png",
        max_diff_pixels=100  # Permite hasta 100 pixeles diferentes
    )

    # --- max_diff_pixel_ratio ---
    # Proporcion maxima de pixeles diferentes (0 a 1)
    # Mejor para resoluciones variables
    expect(page).to_have_screenshot(
        "home-ratio.png",
        max_diff_pixel_ratio=0.01  # Permite hasta 1% de pixeles diferentes
    )

    # --- threshold ---
    # Sensibilidad de comparacion por pixel (0 a 1)
    # 0 = identico, 0.2 = valor por defecto, 1 = cualquier color pasa
    expect(page).to_have_screenshot(
        "home-threshold.png",
        threshold=0.3  # Menos sensible a cambios sutiles de color
    )
</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('visual con opciones', async ({ page }) => {
    await page.goto('https://mi-app.com');

    // --- maxDiffPixels ---
    // Numero maximo de pixeles que pueden diferir
    // Util para tolerar diferencias minimas de anti-aliasing
    await expect(page).toHaveScreenshot(
        'home-tolerante.png',
        { maxDiffPixels: 100 }  // Permite hasta 100 pixeles diferentes
    );

    // --- maxDiffPixelRatio ---
    // Proporcion maxima de pixeles diferentes (0 a 1)
    // Mejor para resoluciones variables
    await expect(page).toHaveScreenshot(
        'home-ratio.png',
        { maxDiffPixelRatio: 0.01 }  // Permite hasta 1% de pixeles diferentes
    );

    // --- threshold ---
    // Sensibilidad de comparacion por pixel (0 a 1)
    // 0 = identico, 0.2 = valor por defecto, 1 = cualquier color pasa
    await expect(page).toHaveScreenshot(
        'home-threshold.png',
        { threshold: 0.3 }  // Menos sensible a cambios sutiles de color
    );
});</code></pre>
            </div>
        </div>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📊 Guia rapida de opciones</h4>
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Opcion</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Tipo</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Default</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Cuando usarlo</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>max_diff_pixels</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">int</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">0</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Screenshots pequenos, diferencias conocidas</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>max_diff_pixel_ratio</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">float (0-1)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">0</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Resoluciones variables, CI con diferentes pantallas</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>threshold</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">float (0-1)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">0.2</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Anti-aliasing, subpixel rendering, fuentes</td>
                </tr>
            </table>
        </div>

        <h3>📐 Full page vs Viewport screenshots</h3>
        <p>Por defecto, <code>to_have_screenshot()</code> captura solo el <strong>viewport visible</strong>.
        Puedes capturar la pagina completa (incluyendo scroll) con la opcion <code>full_page</code>.</p>

        <div class="code-tabs" data-code-id="L099-5">
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
                <pre><code class="language-python">def test_pagina_completa_vs_viewport(page: Page):
    page.goto("https://mi-app.com/pagina-larga")

    # Solo el viewport visible (default)
    expect(page).to_have_screenshot("vista-viewport.png")

    # Pagina completa con scroll (toda la altura del documento)
    expect(page).to_have_screenshot(
        "vista-fullpage.png",
        full_page=True
    )
</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('pagina completa vs viewport', async ({ page }) => {
    await page.goto('https://mi-app.com/pagina-larga');

    // Solo el viewport visible (default)
    await expect(page).toHaveScreenshot('vista-viewport.png');

    // Pagina completa con scroll (toda la altura del documento)
    await expect(page).toHaveScreenshot(
        'vista-fullpage.png',
        { fullPage: true }
    );
});</code></pre>
            </div>
        </div>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚠️ Cuidado con full_page</h4>
            <ul>
                <li><strong>Imagenes muy grandes:</strong> paginas largas generan screenshots de varios MB</li>
                <li><strong>Lazy loading:</strong> imagenes cargadas bajo demanda no apareceran si no se ha hecho scroll</li>
                <li><strong>Sticky headers/footers:</strong> pueden duplicarse en la captura completa</li>
                <li><strong>Mas lento:</strong> requiere capturar y ensamblar multiples capturas de viewport</li>
            </ul>
            <p><strong>Recomendacion:</strong> Usa <code>full_page=True</code> solo cuando realmente
            necesites verificar toda la pagina. Para la mayoria de casos, la comparacion por componente
            con <code>expect(locator).to_have_screenshot()</code> es mas confiable.</p>
        </div>

        <h3>📁 Naming y estructura de carpetas de snapshots</h3>
        <p>Playwright organiza los snapshots automaticamente en una estructura predecible.</p>

        <pre><code class="bash"># Estructura generada automaticamente
tests/
├── test_visual.py
└── test_visual-snapshots/
    ├── test-home-page-visual-1-chromium-linux.png     # Auto-generado
    ├── dashboard-principal.png                         # Nombre explicito
    ├── navbar.png
    └── tarjeta-producto-detalle.png</code></pre>

        <div class="code-tabs" data-code-id="L099-6">
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
                <pre><code class="language-python"># Nomenclatura automatica:
# {nombre-del-test}-{numero-secuencial}-{browser}-{plataforma}.png

# Ejemplo: test_login_visual -> test-login-visual-1-chromium-linux.png

# Con nombre explicito: se usa tal cual
expect(page).to_have_screenshot("mi-screenshot.png")
# -> tests/test_visual-snapshots/mi-screenshot.png
</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Nomenclatura automatica:
// {nombre-del-test}-{numero-secuencial}-{browser}-{plataforma}.png

// Ejemplo: login-visual-1-chromium-linux.png

// Con nombre explicito: se usa tal cual
await expect(page).toHaveScreenshot('mi-screenshot.png');
// -> tests/test_visual.spec.ts-snapshots/mi-screenshot.png
</code></pre>
            </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>Siempre usa <strong>nombres explicitos</strong> para tus screenshots. Los nombres
            auto-generados con numeros secuenciales son fragiles: si agregas un nuevo
            <code>to_have_screenshot()</code> antes de otro existente, los numeros se desplazan
            y todas las comparaciones fallan. Nombrar explicitamente cada screenshot es una
            practica mucho mas robusta.</p>
        </div>

        <h3>🎭 Manejo de contenido dinamico</h3>
        <p>El mayor desafio de visual regression testing es el <strong>contenido dinamico</strong>:
        fechas, relojes, anuncios, animaciones, cursores parpadeantes, etc. Si no se controlan,
        causan falsos positivos constantes.</p>

        <h4>Estrategia 1: Deshabilitar animaciones</h4>
        <div class="code-tabs" data-code-id="L099-7">
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
                <pre><code class="language-python">def test_sin_animaciones(page: Page):
    page.goto("https://mi-app.com")

    # Opcion A: Inyectar CSS que deshabilita todas las animaciones
    page.add_style_tag(content="""
        *, *::before, *::after {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
        }
    """)

    expect(page).to_have_screenshot("home-sin-animaciones.png")


# Opcion B: Usar la opcion animations="disabled" directamente
def test_animaciones_deshabilitadas(page: Page):
    page.goto("https://mi-app.com")

    expect(page).to_have_screenshot(
        "home-disabled-animations.png",
        animations="disabled"  # Playwright detiene CSS animations y Web Animations
    )
</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('sin animaciones', async ({ page }) => {
    await page.goto('https://mi-app.com');

    // Opcion A: Inyectar CSS que deshabilita todas las animaciones
    await page.addStyleTag({ content: \`
        *, *::before, *::after {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
        }
    \` });

    await expect(page).toHaveScreenshot('home-sin-animaciones.png');
});


// Opcion B: Usar la opcion animations directamente
test('animaciones deshabilitadas', async ({ page }) => {
    await page.goto('https://mi-app.com');

    await expect(page).toHaveScreenshot(
        'home-disabled-animations.png',
        { animations: 'disabled' }  // Playwright detiene CSS animations y Web Animations
    );
});</code></pre>
            </div>
        </div>

        <h4>Estrategia 2: Ocultar elementos dinamicos con mask</h4>
        <div class="code-tabs" data-code-id="L099-8">
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
                <pre><code class="language-python">def test_con_mascara(page: Page):
    page.goto("https://mi-app.com")

    # Ocultar elementos que cambian con cada ejecucion
    expect(page).to_have_screenshot(
        "home-masked.png",
        mask=[
            page.locator(".reloj-tiempo-real"),
            page.locator(".banner-publicidad"),
            page.locator(".fecha-actual"),
            page.locator(".avatar-usuario"),
        ]
    )

    # Los elementos enmascarados se reemplazan por un rectangulo de color solido
    # Por defecto el color es rosa (#FF00FF) para que sea evidente
</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('con mascara', async ({ page }) => {
    await page.goto('https://mi-app.com');

    // Ocultar elementos que cambian con cada ejecucion
    await expect(page).toHaveScreenshot(
        'home-masked.png',
        {
            mask: [
                page.locator('.reloj-tiempo-real'),
                page.locator('.banner-publicidad'),
                page.locator('.fecha-actual'),
                page.locator('.avatar-usuario'),
            ]
        }
    );

    // Los elementos enmascarados se reemplazan por un rectangulo de color solido
    // Por defecto el color es rosa (#FF00FF) para que sea evidente
});</code></pre>
            </div>
        </div>

        <h4>Estrategia 3: Esperar estabilidad antes de capturar</h4>
        <div class="code-tabs" data-code-id="L099-9">
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
                <pre><code class="language-python">def test_esperar_estabilidad(page: Page):
    page.goto("https://mi-app.com/dashboard")

    # Esperar a que carguen los datos
    page.wait_for_load_state("networkidle")

    # Esperar a que un spinner desaparezca
    page.locator(".loading-spinner").wait_for(state="hidden")

    # Esperar a que un grafico termine de renderizar
    page.locator(".chart-container canvas").wait_for(state="visible")

    # Ahora si, comparar
    expect(page).to_have_screenshot("dashboard-completo.png")
</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('esperar estabilidad', async ({ page }) => {
    await page.goto('https://mi-app.com/dashboard');

    // Esperar a que carguen los datos
    await page.waitForLoadState('networkidle');

    // Esperar a que un spinner desaparezca
    await page.locator('.loading-spinner').waitFor({ state: 'hidden' });

    // Esperar a que un grafico termine de renderizar
    await page.locator('.chart-container canvas').waitFor({ state: 'visible' });

    // Ahora si, comparar
    await expect(page).toHaveScreenshot('dashboard-completo.png');
});</code></pre>
            </div>
        </div>

        <h4>Estrategia 4: Fijar datos dinamicos con JavaScript</h4>
        <div class="code-tabs" data-code-id="L099-10">
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
                <pre><code class="language-python">def test_fecha_fija(page: Page):
    # Inyectar una fecha fija ANTES de navegar
    page.add_init_script("""
        // Congelar Date para que siempre retorne la misma fecha
        const FECHA_FIJA = new Date('2026-01-15T10:30:00');
        const OriginalDate = Date;
        Date = class extends OriginalDate {
            constructor(...args) {
                if (args.length === 0) return new OriginalDate(FECHA_FIJA);
                return new OriginalDate(...args);
            }
            static now() { return FECHA_FIJA.getTime(); }
        };
    """)

    page.goto("https://mi-app.com")
    expect(page).to_have_screenshot("home-fecha-fija.png")
</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('fecha fija', async ({ page }) => {
    // Inyectar una fecha fija ANTES de navegar
    await page.addInitScript(() => {
        // Congelar Date para que siempre retorne la misma fecha
        const FECHA_FIJA = new Date('2026-01-15T10:30:00');
        const OriginalDate = Date;
        // @ts-ignore
        Date = class extends OriginalDate {
            constructor(...args: any[]) {
                if (args.length === 0) return new OriginalDate(FECHA_FIJA);
                // @ts-ignore
                return new OriginalDate(...args);
            }
            static now() { return FECHA_FIJA.getTime(); }
        };
    });

    await page.goto('https://mi-app.com');
    await expect(page).toHaveScreenshot('home-fecha-fija.png');
});</code></pre>
            </div>
        </div>

        <h3>🏗️ Configuracion en conftest.py</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Puedes centralizar la configuracion de screenshots en <code>conftest.py</code>
            para no repetir opciones en cada test.</p>
        </div>

        <div class="code-tabs" data-code-id="L099-11">
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
from playwright.sync_api import Page


@pytest.fixture(autouse=True)
def preparar_pagina_para_visual(page: Page):
    """Configuracion global para visual regression tests."""
    # Deshabilitar animaciones via CSS
    page.add_style_tag(content="""
        *, *::before, *::after {
            animation-duration: 0s !important;
            transition-duration: 0s !important;
            scroll-behavior: auto !important;
        }
    """)
    yield page


@pytest.fixture
def visual_config():
    """Opciones default para screenshots."""
    return {
        "animations": "disabled",
        "max_diff_pixel_ratio": 0.01,
        "threshold": 0.25,
    }
</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    expect: {
        toHaveScreenshot: {
            // Opciones default para screenshots
            animations: 'disabled',
            maxDiffPixelRatio: 0.01,
            threshold: 0.25,
        },
    },
    use: {
        // Deshabilitar animaciones via CSS en todos los tests
        contextOptions: {
            reducedMotion: 'reduce',
        },
    },
});

// Alternativa: usar beforeEach en un archivo de test
// test.beforeEach(async ({ page }) => {
//     await page.addStyleTag({ content: \`
//         *, *::before, *::after {
//             animation-duration: 0s !important;
//             transition-duration: 0s !important;
//             scroll-behavior: auto !important;
//         }
//     \` });
// });</code></pre>
            </div>
        </div>

        <div class="code-tabs" data-code-id="L099-12">
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
                <pre><code class="language-python"># test_visual.py - Usando la configuracion centralizada
from playwright.sync_api import Page, expect

def test_home_visual(page: Page, visual_config: dict):
    page.goto("https://mi-app.com")
    expect(page).to_have_screenshot("home.png", **visual_config)

def test_login_visual(page: Page, visual_config: dict):
    page.goto("https://mi-app.com/login")
    expect(page).to_have_screenshot("login.png", **visual_config)
</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// test_visual.spec.ts - Usa la config centralizada de playwright.config.ts
import { test, expect } from '@playwright/test';

test('home visual', async ({ page }) => {
    await page.goto('https://mi-app.com');
    // Las opciones de toHaveScreenshot se toman de playwright.config.ts
    await expect(page).toHaveScreenshot('home.png');
});

test('login visual', async ({ page }) => {
    await page.goto('https://mi-app.com/login');
    await expect(page).toHaveScreenshot('login.png');
});</code></pre>
            </div>
        </div>

        <h3>🧩 Screenshot comparison con multiples navegadores</h3>
        <p>Las baselines son <strong>especificas por navegador y plataforma</strong> porque cada
        motor de renderizado produce resultados ligeramente diferentes.</p>

        <pre><code class="bash"># pytest.ini - Ejecutar en multiples navegadores
[pytest]
addopts = --browser chromium --browser firefox --browser webkit

# Esto genera baselines separadas para cada navegador:
# test_visual-snapshots/
# ├── home-chromium-linux.png
# ├── home-firefox-linux.png
# └── home-webkit-linux.png</code></pre>

        <div class="code-tabs" data-code-id="L099-13">
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
                <pre><code class="language-python"># Alternativa: parametrizar en conftest.py
import pytest

@pytest.fixture(params=["chromium", "firefox", "webkit"])
def browser_name(request):
    return request.param
</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// playwright.config.ts - Multiples navegadores
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    ],
});</code></pre>
            </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>En entornos de CI, asegurate de que las baselines se generen en el <strong>mismo
            sistema operativo y resolucion</strong> que usa el CI. Una baseline generada en macOS
            no coincidira con una captura tomada en Linux debido a diferencias en el renderizado
            de fuentes. Para Docker, usa <code>mcr.microsoft.com/playwright/python:v1.49.0-jammy</code>
            como imagen base.</p>
        </div>

        <h3>📊 Resumen de opciones de to_have_screenshot()</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #0277bd; color: white;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Opcion</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Tipo</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripcion</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>name</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">str</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Nombre del archivo de snapshot</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>animations</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">"allow" | "disabled"</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Controla animaciones CSS/Web Animations</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>caret</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">"hide" | "initial"</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Ocultar cursor parpadeante en inputs</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>full_page</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">bool</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Capturar pagina completa con scroll</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>mask</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">list[Locator]</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Ocultar elementos dinamicos</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>mask_color</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">str</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Color de la mascara (default: #FF00FF)</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>max_diff_pixels</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">int</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Pixeles diferentes permitidos</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>max_diff_pixel_ratio</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">float (0-1)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Proporcion de pixeles diferentes</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>threshold</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">float (0-1)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Sensibilidad por pixel (0=exacto)</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>scale</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">"css" | "device"</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Escala de captura (css ignora device pixel ratio)</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>timeout</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">float</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Tiempo maximo de espera en ms</td>
                </tr>
            </table>
        </div>

        <h3>🎯 Ejercicio practico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Ejercicio: Implementar suite de visual regression testing</h4>
            <p>Crea una suite completa de pruebas visuales para una aplicacion web.
            El ejercicio cubre comparacion de pagina, comparacion de componente,
            manejo de contenido dinamico y configuracion centralizada.</p>
        </div>

        <div class="code-tabs" data-code-id="L099-14">
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
                <pre><code class="language-python"># conftest.py - Configuracion base para visual testing
import pytest
from playwright.sync_api import Page


@pytest.fixture(autouse=True)
def preparar_visual_testing(page: Page):
    """Prepara el entorno para screenshots estables."""
    # 1. Inyectar CSS que deshabilita animaciones y transiciones
    page.add_style_tag(content="""
        *, *::before, *::after {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
            caret-color: transparent !important;
        }
    """)
    yield page


@pytest.fixture
def opciones_screenshot():
    """Opciones estandar de comparacion para el equipo."""
    return {
        "animations": "disabled",
        "threshold": 0.25,
        "max_diff_pixel_ratio": 0.005,
    }
</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// playwright.config.ts - Configuracion base para visual testing
import { defineConfig } from '@playwright/test';

export default defineConfig({
    expect: {
        toHaveScreenshot: {
            // Opciones estandar de comparacion para el equipo
            animations: 'disabled',
            threshold: 0.25,
            maxDiffPixelRatio: 0.005,
        },
    },
    use: {
        // Deshabilitar animaciones y transiciones globalmente
        contextOptions: {
            reducedMotion: 'reduce',
        },
    },
});

// Alternativa con beforeEach para inyectar CSS directamente:
// import { test } from '@playwright/test';
// test.beforeEach(async ({ page }) => {
//     await page.addStyleTag({ content: \`
//         *, *::before, *::after {
//             animation-duration: 0s !important;
//             animation-delay: 0s !important;
//             transition-duration: 0s !important;
//             transition-delay: 0s !important;
//             caret-color: transparent !important;
//         }
//     \` });
// });</code></pre>
            </div>
        </div>

        <div class="code-tabs" data-code-id="L099-15">
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
                <pre><code class="language-python"># test_visual_regression.py
from playwright.sync_api import Page, expect


def test_pagina_principal_visual(page: Page, opciones_screenshot: dict):
    """
    EJERCICIO 1: Comparar la pagina principal completa.
    - Navegar a la pagina principal
    - Enmascarar elementos dinamicos (banner, reloj)
    - Comparar screenshot del viewport
    """
    page.goto("https://the-internet.herokuapp.com")
    page.wait_for_load_state("networkidle")

    expect(page).to_have_screenshot(
        "pagina-principal.png",
        **opciones_screenshot
    )


def test_formulario_login_visual(page: Page, opciones_screenshot: dict):
    """
    EJERCICIO 2: Comparar un componente especifico.
    - Navegar al formulario de login
    - Capturar solo el formulario (no toda la pagina)
    """
    page.goto("https://the-internet.herokuapp.com/login")
    page.wait_for_load_state("networkidle")

    formulario = page.locator("#login")
    expect(formulario).to_have_screenshot(
        "formulario-login.png",
        **opciones_screenshot
    )


def test_tabla_datos_visual(page: Page, opciones_screenshot: dict):
    """
    EJERCICIO 3: Comparar una tabla con datos.
    - Navegar a la pagina de tablas
    - Capturar la primera tabla como componente
    - Usar full_page=False (default)
    """
    page.goto("https://the-internet.herokuapp.com/tables")
    page.wait_for_load_state("networkidle")

    tabla = page.locator("#table1")
    expect(tabla).to_have_screenshot(
        "tabla-datos.png",
        **opciones_screenshot
    )


def test_pagina_completa_full_scroll(page: Page, opciones_screenshot: dict):
    """
    EJERCICIO 4: Capturar la pagina completa incluyendo scroll.
    - Navegar a una pagina con contenido largo
    - Usar full_page=True para capturar todo
    """
    page.goto("https://the-internet.herokuapp.com/large")
    page.wait_for_load_state("networkidle")

    expect(page).to_have_screenshot(
        "pagina-larga-completa.png",
        full_page=True,
        **opciones_screenshot
    )


def test_mascaras_contenido_dinamico(page: Page, opciones_screenshot: dict):
    """
    EJERCICIO 5: Enmascarar elementos que cambian.
    - Identificar elementos dinamicos
    - Aplicar mask para excluirlos de la comparacion
    """
    page.goto("https://the-internet.herokuapp.com/dynamic_content")
    page.wait_for_load_state("networkidle")

    # Enmascarar las imagenes que cambian aleatoriamente
    expect(page).to_have_screenshot(
        "contenido-dinamico-masked.png",
        mask=[
            page.locator("img"),  # Todas las imagenes dinamicas
        ],
        **opciones_screenshot
    )
</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// test_visual_regression.spec.ts
import { test, expect } from '@playwright/test';


test('pagina principal visual', async ({ page }) => {
    /**
     * EJERCICIO 1: Comparar la pagina principal completa.
     * - Navegar a la pagina principal
     * - Enmascarar elementos dinamicos (banner, reloj)
     * - Comparar screenshot del viewport
     */
    await page.goto('https://the-internet.herokuapp.com');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('pagina-principal.png');
});


test('formulario login visual', async ({ page }) => {
    /**
     * EJERCICIO 2: Comparar un componente especifico.
     * - Navegar al formulario de login
     * - Capturar solo el formulario (no toda la pagina)
     */
    await page.goto('https://the-internet.herokuapp.com/login');
    await page.waitForLoadState('networkidle');

    const formulario = page.locator('#login');
    await expect(formulario).toHaveScreenshot('formulario-login.png');
});


test('tabla datos visual', async ({ page }) => {
    /**
     * EJERCICIO 3: Comparar una tabla con datos.
     * - Navegar a la pagina de tablas
     * - Capturar la primera tabla como componente
     * - Usar fullPage: false (default)
     */
    await page.goto('https://the-internet.herokuapp.com/tables');
    await page.waitForLoadState('networkidle');

    const tabla = page.locator('#table1');
    await expect(tabla).toHaveScreenshot('tabla-datos.png');
});


test('pagina completa full scroll', async ({ page }) => {
    /**
     * EJERCICIO 4: Capturar la pagina completa incluyendo scroll.
     * - Navegar a una pagina con contenido largo
     * - Usar fullPage: true para capturar todo
     */
    await page.goto('https://the-internet.herokuapp.com/large');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot(
        'pagina-larga-completa.png',
        { fullPage: true }
    );
});


test('mascaras contenido dinamico', async ({ page }) => {
    /**
     * EJERCICIO 5: Enmascarar elementos que cambian.
     * - Identificar elementos dinamicos
     * - Aplicar mask para excluirlos de la comparacion
     */
    await page.goto('https://the-internet.herokuapp.com/dynamic_content');
    await page.waitForLoadState('networkidle');

    // Enmascarar las imagenes que cambian aleatoriamente
    await expect(page).toHaveScreenshot(
        'contenido-dinamico-masked.png',
        {
            mask: [
                page.locator('img'),  // Todas las imagenes dinamicas
            ],
        }
    );
});</code></pre>
            </div>
        </div>

        <pre><code class="bash"># Ejecutar los tests de visual regression

# 1. Primera ejecucion: generar baselines (fallara - es normal)
pytest tests/test_visual_regression.py -v

# 2. Segunda ejecucion: comparar contra baselines
pytest tests/test_visual_regression.py -v

# 3. Si hay cambios intencionales, actualizar baselines
pytest tests/test_visual_regression.py --update-snapshots -v

# 4. Verificar las imagenes generadas
ls tests/test_visual_regression-snapshots/</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Criterios de exito del ejercicio:</h4>
            <ul>
                <li>Los 5 tests generan baselines en la primera ejecucion</li>
                <li>Los 5 tests pasan en la segunda ejecucion sin cambios</li>
                <li>Los screenshots con mask ocultan correctamente los elementos dinamicos</li>
                <li>Las opciones de threshold y max_diff_pixel_ratio se aplican correctamente</li>
                <li>Las animaciones estan deshabilitadas en todos los tests</li>
            </ul>
        </div>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📋 Objetivos de esta leccion:</h4>
            <ul>
                <li>Entender que es visual regression testing y por que complementa las pruebas funcionales</li>
                <li>Usar <code>expect(page).to_have_screenshot()</code> para comparacion de pagina completa</li>
                <li>Usar <code>expect(locator).to_have_screenshot()</code> para comparacion a nivel de componente</li>
                <li>Comprender el flujo baseline → comparacion → actualizacion con <code>--update-snapshots</code></li>
                <li>Configurar opciones de sensibilidad: <code>max_diff_pixels</code>, <code>max_diff_pixel_ratio</code>, <code>threshold</code></li>
                <li>Capturar full page screenshots vs viewport</li>
                <li>Manejar contenido dinamico con masks, animaciones deshabilitadas y fechas fijas</li>
                <li>Organizar snapshots con nombres explicitos y configuracion centralizada</li>
            </ul>
        </div>

        <h3>🚀 Siguiente: Masking y umbrales de comparacion</h3>
        <p>En la proxima leccion profundizaremos en las tecnicas de <strong>masking</strong> para
        excluir areas dinamicas y configuracion avanzada de <strong>umbrales de comparacion</strong>
        para lograr tests visuales estables y confiables en ambientes de CI/CD.</p>
    `,
    topics: ["visual-regression", "screenshots", "comparación"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 10,
    difficulty: "medium",
    type: "foundation"
};

if (typeof window !== 'undefined') {
    window.LESSON_099 = LESSON_099;
}
