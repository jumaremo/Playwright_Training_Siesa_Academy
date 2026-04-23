/**
 * Playwright Academy - Lección 015
 * Capturas de pantalla y videos
 * Sección 2: Fundamentos de Playwright
 */

const LESSON_015 = {
    id: 15,
    title: "Capturas de pantalla y videos",
    duration: "5 min",
    level: "beginner",
    section: "section-02",
    content: `
        <h2>📸 Capturas de pantalla y videos</h2>
        <p>Playwright permite capturar screenshots y grabar videos de tus tests.
        Esto es invaluable para depurar fallos y generar evidencia de pruebas.</p>

        <h3>📷 Screenshots básicos</h3>
        <div class="code-tabs" data-code-id="L015-1">
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
                <pre><code class="language-python">from playwright.sync_api import Page

def test_screenshot_basico(page: Page):
    page.goto("https://example.com")

    # Screenshot de toda la página visible
    page.screenshot(path="screenshots/pagina.png")

    # Screenshot de página completa (incluyendo scroll)
    page.screenshot(path="screenshots/pagina_completa.png", full_page=True)

    # Screenshot solo del viewport (sin scroll)
    page.screenshot(path="screenshots/viewport.png", full_page=False)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('screenshot básico', async ({ page }) => {
    await page.goto('https://example.com');

    // Screenshot de toda la página visible
    await page.screenshot({ path: 'screenshots/pagina.png' });

    // Screenshot de página completa (incluyendo scroll)
    await page.screenshot({ path: 'screenshots/pagina_completa.png', fullPage: true });

    // Screenshot solo del viewport (sin scroll)
    await page.screenshot({ path: 'screenshots/viewport.png', fullPage: false });
});</code></pre>
            </div>
        </div>

        <h3>🎯 Screenshot de un elemento específico</h3>
        <div class="code-tabs" data-code-id="L015-2">
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
                <pre><code class="language-python">def test_screenshot_elemento(page: Page):
    page.goto("https://example.com")

    # Capturar solo un elemento
    heading = page.locator("h1")
    heading.screenshot(path="screenshots/titulo.png")

    # Capturar un formulario
    page.locator("#form-login").screenshot(path="screenshots/formulario.png")

    # Capturar con máscara (ocultar elementos sensibles)
    page.screenshot(
        path="screenshots/con_mascara.png",
        mask=[page.locator(".datos-sensibles")],
        mask_color="#FF0000"  # Color de la máscara
    )</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('screenshot de un elemento', async ({ page }) => {
    await page.goto('https://example.com');

    // Capturar solo un elemento
    const heading = page.locator('h1');
    await heading.screenshot({ path: 'screenshots/titulo.png' });

    // Capturar un formulario
    await page.locator('#form-login').screenshot({ path: 'screenshots/formulario.png' });

    // Capturar con máscara (ocultar elementos sensibles)
    await page.screenshot({
        path: 'screenshots/con_mascara.png',
        mask: [page.locator('.datos-sensibles')],
        maskColor: '#FF0000'  // Color de la máscara
    });
});</code></pre>
            </div>
        </div>

        <h3>⚙️ Opciones avanzadas de screenshot</h3>
        <div class="code-tabs" data-code-id="L015-3">
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
                <pre><code class="language-python">def test_screenshot_opciones(page: Page):
    page.goto("https://example.com")

    # Calidad JPEG (más pequeño que PNG)
    page.screenshot(
        path="screenshots/comprimido.jpg",
        type="jpeg",
        quality=80  # 0-100, solo para JPEG
    )

    # Omitir el fondo (transparente para PNG)
    page.screenshot(
        path="screenshots/sin_fondo.png",
        omit_background=True
    )

    # Screenshot como bytes (sin guardar archivo)
    imagen_bytes = page.screenshot()
    print(f"Tamaño: {len(imagen_bytes)} bytes")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('screenshot opciones avanzadas', async ({ page }) => {
    await page.goto('https://example.com');

    // Calidad JPEG (más pequeño que PNG)
    await page.screenshot({
        path: 'screenshots/comprimido.jpg',
        type: 'jpeg',
        quality: 80  // 0-100, solo para JPEG
    });

    // Omitir el fondo (transparente para PNG)
    await page.screenshot({
        path: 'screenshots/sin_fondo.png',
        omitBackground: true
    });

    // Screenshot como buffer (sin guardar archivo)
    const imagenBuffer = await page.screenshot();
    console.log(\`Tamaño: \${imagenBuffer.length} bytes\`);
});</code></pre>
            </div>
        </div>

        <h3>🎬 Grabación de video</h3>
        <div class="code-tabs" data-code-id="L015-4">
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
                <pre><code class="language-python"># conftest.py - Configurar grabación de video
import pytest

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "record_video_dir": "videos/",
        "record_video_size": {"width": 1280, "height": 720}
    }</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// playwright.config.ts - Configurar grabación de video
import { defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        video: {
            mode: 'on',
            size: { width: 1280, height: 720 }
        }
    }
});</code></pre>
            </div>
        </div>
        <div class="code-tabs" data-code-id="L015-5">
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
                <pre><code class="language-python"># test_con_video.py
def test_flujo_login(page):
    """Este test será grabado automáticamente."""
    page.goto("/login")
    page.fill("#usuario", "admin")
    page.fill("#password", "secreto")
    page.click("#btn-login")
    # El video se guarda al cerrar el contexto</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// test-con-video.spec.ts
import { test } from '@playwright/test';

test('flujo login', async ({ page }) => {
    /** Este test será grabado automáticamente. */
    await page.goto('/login');
    await page.fill('#usuario', 'admin');
    await page.fill('#password', 'secreto');
    await page.click('#btn-login');
    // El video se guarda al cerrar el contexto
});</code></pre>
            </div>
        </div>

        <h3>📋 Videos solo cuando falla</h3>
        <div class="code-tabs" data-code-id="L015-6">
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
                <pre><code class="language-python"># conftest.py - Guardar video solo si el test falla
import pytest
import os

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "record_video_dir": "videos/",
    }

@pytest.fixture(autouse=True)
def handle_video(page, request):
    """Elimina el video si el test pasa, lo conserva si falla."""
    yield
    video = page.video
    if video:
        video_path = video.path()
        page.context.close()  # Fuerza guardar el video
        if request.node.rep_call.passed:
            os.remove(video_path)  # Borrar si pasó

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    rep = outcome.get_result()
    setattr(item, f"rep_{rep.when}", rep)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// playwright.config.ts - Guardar video solo si el test falla
import { defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        // 'retain-on-failure' conserva video solo si falla
        video: 'retain-on-failure'
    },
    // Los videos se guardan en test-results/
    outputDir: 'test-results/'
});

// Nota: En Playwright Test (TypeScript), la opción
// 'retain-on-failure' maneja esto automáticamente,
// sin necesidad de código adicional como en pytest.</code></pre>
            </div>
        </div>

        <h3>📊 Screenshots automáticos al fallar (pytest-playwright)</h3>
        <div class="code-tabs" data-code-id="L015-7">
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
                <pre><code class="language-bash"># pytest-playwright ya captura screenshots automáticos al fallar
# Solo ejecuta con:
pytest --screenshot=on        # Screenshot al fallar
pytest --screenshot=only-on-failure  # Solo cuando falla (default)
pytest --screenshot=off       # Desactivar

# Videos:
pytest --video=on             # Grabar siempre
pytest --video=retain-on-failure  # Solo conservar si falla
pytest --video=off            # Desactivar

# Combinados:
pytest --screenshot=on --video=retain-on-failure

# Directorio de salida:
pytest --output=test-results/</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <div class="code-note">
                    <span class="code-note-icon">ℹ️</span>
                    <span class="code-note-text">Equivalente con Playwright Test (TypeScript):</span>
                </div>
                <pre><code class="language-bash"># Playwright Test ya captura screenshots automáticos al fallar
# Solo ejecuta con:
npx playwright test --screenshot=on        # Screenshot al fallar
npx playwright test --screenshot=only-on-failure  # Solo cuando falla
npx playwright test --screenshot=off       # Desactivar

# Videos:
npx playwright test --video=on             # Grabar siempre
npx playwright test --video=retain-on-failure  # Solo conservar si falla
npx playwright test --video=off            # Desactivar

# Combinados:
npx playwright test --screenshot=on --video=retain-on-failure

# Directorio de salida (configurable en playwright.config.ts):
# outputDir: 'test-results/'</code></pre>
            </div>
        </div>

        <h3>🗂️ Estructura de evidencias recomendada</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L015-8">
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
                    <pre><code>test-results/
├── test_login_exitoso/
│   ├── screenshot.png
│   └── video.webm
├── test_login_fallido/
│   ├── screenshot.png
│   └── video.webm
└── test_dashboard/
    └── screenshot.png</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <div class="code-note">
                        <span class="code-note-icon">ℹ️</span>
                        <span class="code-note-text">Misma estructura aplica para Playwright Test (TypeScript):</span>
                    </div>
                    <pre><code>test-results/
├── test-login-exitoso/
│   ├── screenshot.png
│   └── video.webm
├── test-login-fallido/
│   ├── screenshot.png
│   └── video.webm
└── test-dashboard/
    └── screenshot.png</code></pre>
                </div>
            </div>
            <p><strong>Tip:</strong> Usa <code>--output=test-results/</code> para que pytest-playwright
            organice screenshots y videos por test automáticamente.</p>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <ol>
            <li>Crea la carpeta <code>screenshots/</code> en tu proyecto</li>
            <li>Escribe un test que capture:
                <ul>
                    <li>Screenshot de página completa</li>
                    <li>Screenshot de un elemento específico</li>
                    <li>Screenshot en formato JPEG con calidad 60</li>
                </ul>
            </li>
            <li>Configura grabación de video en <code>conftest.py</code></li>
            <li>Ejecuta con <code>pytest --screenshot=on --video=on --output=test-results/</code></li>
            <li>Revisa los archivos generados</li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Capturar screenshots de páginas y elementos</li>
                <li>Configurar grabación de video en conftest.py</li>
                <li>Usar las flags de pytest-playwright para evidencias automáticas</li>
                <li>Organizar screenshots y videos en carpetas</li>
            </ul>
        </div>
    `,
    topics: ["screenshots", "videos", "evidencias"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_015 = LESSON_015;
}
