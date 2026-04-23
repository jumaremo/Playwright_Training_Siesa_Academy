/**
 * Playwright Academy - Lección 034
 * Iframes y ventanas múltiples
 * Sección 4: Interacciones Web Fundamentales
 */

const LESSON_034 = {
    id: 34,
    title: "Iframes y ventanas múltiples",
    duration: "5 min",
    level: "beginner",
    section: "section-04",
    content: `
        <h2>🪟 Iframes y ventanas múltiples</h2>
        <p>Los iframes y las ventanas emergentes son dos de los escenarios más desafiantes
        en automatización web. Un iframe es un documento HTML incrustado dentro de otro,
        y Playwright necesita saber exactamente en qué contexto buscar los elementos.
        De igual forma, cuando una acción abre una nueva pestaña o popup, debemos
        capturar esa nueva página para interactuar con ella.</p>

        <h3>🖼️ ¿Qué son los iframes y por qué complican la automatización?</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Un <code>&lt;iframe&gt;</code> es esencialmente una página web dentro de otra página web.
            Los elementos dentro de un iframe viven en un documento separado con su propio DOM.
            Por eso, un <code>page.locator()</code> normal <strong>no puede encontrar</strong>
            elementos dentro de un iframe — necesitas primero "entrar" al frame.</p>
            <pre><code>&lt;!-- El locator page.locator("#editor") NO funciona aquí --&gt;
&lt;iframe id="mce_0_ifr" src="..."&gt;
    &lt;body id="tinymce"&gt;
        &lt;p id="editor"&gt;Contenido del editor&lt;/p&gt;
    &lt;/body&gt;
&lt;/iframe&gt;</code></pre>
        </div>

        <h3>🎯 frame_locator() — El enfoque moderno</h3>
        <p><code>page.frame_locator()</code> es la forma recomendada de interactuar con iframes
        en Playwright. Retorna un objeto que permite encadenar locators dentro del frame.</p>
        <div class="code-tabs" data-code-id="L034-1">
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

def test_interactuar_con_iframe(page: Page):
    """Interactuar con elementos dentro de un iframe."""
    page.goto("https://the-internet.herokuapp.com/iframe")

    # Localizar el iframe por selector CSS
    frame = page.frame_locator("#mce_0_ifr")

    # Ahora podemos interactuar con elementos DENTRO del iframe
    editor = frame.locator("#tinymce")
    expect(editor).to_be_visible()

    # Limpiar y escribir texto en el editor
    editor.click()
    editor.press("Control+a")
    editor.fill("Texto escrito por Playwright")

    # Verificar el contenido
    expect(editor).to_have_text("Texto escrito por Playwright")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('interactuar con iframe', async ({ page }) => {
    // Interactuar con elementos dentro de un iframe
    await page.goto('https://the-internet.herokuapp.com/iframe');

    // Localizar el iframe por selector CSS
    const frame = page.frameLocator('#mce_0_ifr');

    // Ahora podemos interactuar con elementos DENTRO del iframe
    const editor = frame.locator('#tinymce');
    await expect(editor).toBeVisible();

    // Limpiar y escribir texto en el editor
    await editor.click();
    await editor.press('Control+a');
    await editor.fill('Texto escrito por Playwright');

    // Verificar el contenido
    await expect(editor).toHaveText('Texto escrito por Playwright');
});</code></pre>
            </div>
        </div>

        <h3>🔍 Localizar iframes por diferentes criterios</h3>
        <div class="code-tabs" data-code-id="L034-2">
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
                <pre><code class="language-python">def test_localizar_iframes(page: Page):
    """Diferentes formas de localizar un iframe."""
    page.goto("https://ejemplo.com/con-iframes")

    # Por selector CSS (id, clase, atributo)
    frame1 = page.frame_locator("#mi-iframe")
    frame2 = page.frame_locator("iframe.editor")
    frame3 = page.frame_locator("iframe[name='contenido']")

    # Por índice (primer iframe de la página)
    frame4 = page.frame_locator("iframe").first

    # Por atributo src parcial
    frame5 = page.frame_locator("iframe[src*='editor']")

    # Interactuar con un elemento dentro de cualquiera de estos frames
    frame1.locator("button#guardar").click()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('localizar iframes', async ({ page }) => {
    // Diferentes formas de localizar un iframe
    await page.goto('https://ejemplo.com/con-iframes');

    // Por selector CSS (id, clase, atributo)
    const frame1 = page.frameLocator('#mi-iframe');
    const frame2 = page.frameLocator('iframe.editor');
    const frame3 = page.frameLocator("iframe[name='contenido']");

    // Por índice (primer iframe de la página)
    const frame4 = page.frameLocator('iframe').first();

    // Por atributo src parcial
    const frame5 = page.frameLocator("iframe[src*='editor']");

    // Interactuar con un elemento dentro de cualquiera de estos frames
    await frame1.locator('button#guardar').click();
});</code></pre>
            </div>
        </div>

        <h3>📦 Iframes anidados</h3>
        <p>Cuando un iframe contiene otro iframe, simplemente encadena los
        <code>frame_locator()</code>.</p>
        <div class="code-tabs" data-code-id="L034-3">
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
                <pre><code class="language-python">def test_iframes_anidados(page: Page):
    """Acceder a un iframe dentro de otro iframe."""
    page.goto("https://the-internet.herokuapp.com/nested_frames")

    # Estructura: page > iframe#frame-top > iframe[name="middle"]
    frame_top = page.frame_locator("frame[name='frame-top']")
    frame_middle = frame_top.frame_locator("frame[name='frame-middle']")

    # Interactuar con el contenido del frame anidado
    contenido = frame_middle.locator("#content")
    expect(contenido).to_have_text("MIDDLE")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('iframes anidados', async ({ page }) => {
    // Acceder a un iframe dentro de otro iframe
    await page.goto('https://the-internet.herokuapp.com/nested_frames');

    // Estructura: page > iframe#frame-top > iframe[name="middle"]
    const frameTop = page.frameLocator("frame[name='frame-top']");
    const frameMiddle = frameTop.frameLocator("frame[name='frame-middle']");

    // Interactuar con el contenido del frame anidado
    const contenido = frameMiddle.locator('#content');
    await expect(contenido).toHaveText('MIDDLE');
});</code></pre>
            </div>
        </div>

        <h3>📋 page.frames — Listar todos los frames</h3>
        <div class="code-tabs" data-code-id="L034-4">
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
                <pre><code class="language-python">def test_listar_frames(page: Page):
    """Listar y explorar todos los frames de la página."""
    page.goto("https://the-internet.herokuapp.com/nested_frames")

    # Obtener todos los frames (incluye el principal)
    frames = page.frames
    print(f"Total de frames: {len(frames)}")

    for frame in frames:
        print(f"  - Name: '{frame.name}', URL: {frame.url}")

    # Buscar un frame por nombre
    frame_izq = page.frame(name="frame-left")
    if frame_izq:
        contenido = frame_izq.locator("body").text_content()
        print(f"Contenido frame izquierdo: {contenido}")

    # Buscar un frame por URL parcial
    frame_por_url = page.frame(url="**/frame-middle")
    if frame_por_url:
        print(f"Frame encontrado por URL: {frame_por_url.name}")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('listar frames', async ({ page }) => {
    // Listar y explorar todos los frames de la página
    await page.goto('https://the-internet.herokuapp.com/nested_frames');

    // Obtener todos los frames (incluye el principal)
    const frames = page.frames();
    console.log(\`Total de frames: \${frames.length}\`);

    for (const frame of frames) {
        console.log(\`  - Name: '\${frame.name()}', URL: \${frame.url()}\`);
    }

    // Buscar un frame por nombre
    const frameIzq = page.frame({ name: 'frame-left' });
    if (frameIzq) {
        const contenido = await frameIzq.locator('body').textContent();
        console.log(\`Contenido frame izquierdo: \${contenido}\`);
    }

    // Buscar un frame por URL parcial
    const framePorUrl = page.frame({ url: /frame-middle/ });
    if (framePorUrl) {
        console.log(\`Frame encontrado por URL: \${framePorUrl.name()}\`);
    }
});</code></pre>
            </div>
        </div>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 frame_locator() vs page.frame()</h4>
            <p><code>frame_locator()</code> retorna un <strong>FrameLocator</strong> que soporta
            encadenamiento de locators y auto-waiting. <code>page.frame()</code> retorna un objeto
            <strong>Frame</strong> que opera directamente sin auto-waiting. Se recomienda usar
            <code>frame_locator()</code> en la mayoría de los casos.</p>
        </div>

        <h3>🌐 Múltiples pestañas y ventanas</h3>
        <p>Cuando una acción abre una nueva pestaña o ventana del navegador, Playwright
        la maneja a través del <strong>BrowserContext</strong>.</p>

        <h4>📑 Listar páginas abiertas</h4>
        <div class="code-tabs" data-code-id="L034-5">
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
                <pre><code class="language-python">def test_paginas_del_contexto(page: Page):
    """Ver todas las páginas/pestañas abiertas en el contexto."""
    page.goto("https://ejemplo.com")

    # context.pages contiene todas las páginas del contexto
    paginas = page.context.pages
    print(f"Pestañas abiertas: {len(paginas)}")  # 1 al inicio

    for p in paginas:
        print(f"  - Título: {p.title()}, URL: {p.url}")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('paginas del contexto', async ({ page, context }) => {
    // Ver todas las páginas/pestañas abiertas en el contexto
    await page.goto('https://ejemplo.com');

    // context.pages() contiene todas las páginas del contexto
    const paginas = context.pages();
    console.log(\`Pestañas abiertas: \${paginas.length}\`); // 1 al inicio

    for (const p of paginas) {
        console.log(\`  - Título: \${await p.title()}, URL: \${p.url()}\`);
    }
});</code></pre>
            </div>
        </div>

        <h3>🚪 Manejar popups con expect_popup()</h3>
        <p>Cuando un clic abre una nueva ventana o pestaña (por ejemplo, un enlace con
        <code>target="_blank"</code>), usamos <code>expect_popup()</code> para capturarla.</p>
        <div class="code-tabs" data-code-id="L034-6">
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
                <pre><code class="language-python">def test_manejar_popup(page: Page):
    """Capturar y trabajar con una ventana emergente."""
    page.goto("https://the-internet.herokuapp.com/windows")

    # Esperar que se abra una nueva pestaña al hacer clic
    with page.expect_popup() as popup_info:
        page.click("a[href='/windows/new']")

    # Obtener la nueva página
    nueva_pagina = popup_info.value

    # Esperar a que cargue
    nueva_pagina.wait_for_load_state()

    # Interactuar con la nueva pestaña
    expect(nueva_pagina.locator("h3")).to_have_text("New Window")
    print(f"URL nueva pestaña: {nueva_pagina.url}")

    # Cerrar la nueva pestaña
    nueva_pagina.close()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('manejar popup', async ({ page }) => {
    // Capturar y trabajar con una ventana emergente
    await page.goto('https://the-internet.herokuapp.com/windows');

    // Esperar que se abra una nueva pestaña al hacer clic
    const [nuevaPagina] = await Promise.all([
        page.waitForEvent('popup'),
        page.click("a[href='/windows/new']")
    ]);

    // Esperar a que cargue
    await nuevaPagina.waitForLoadState();

    // Interactuar con la nueva pestaña
    await expect(nuevaPagina.locator('h3')).toHaveText('New Window');
    console.log(\`URL nueva pestaña: \${nuevaPagina.url()}\`);

    // Cerrar la nueva pestaña
    await nuevaPagina.close();
});</code></pre>
            </div>
        </div>

        <h3>📡 Manejar nuevas páginas con expect_page()</h3>
        <p>A nivel de contexto, puedes usar <code>context.expect_page()</code> para
        capturar cualquier nueva página que se abra.</p>
        <div class="code-tabs" data-code-id="L034-7">
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
                <pre><code class="language-python">def test_manejar_nueva_pagina(page: Page):
    """Capturar una nueva página usando el contexto."""
    page.goto("https://the-internet.herokuapp.com/windows")

    context = page.context

    # expect_page() captura cualquier nueva página del contexto
    with context.expect_page() as new_page_info:
        page.click("a[href='/windows/new']")

    nueva_pagina = new_page_info.value
    nueva_pagina.wait_for_load_state()

    expect(nueva_pagina.locator("h3")).to_have_text("New Window")

    # Volver a la página original
    page.bring_to_front()
    expect(page.locator("h3")).to_have_text("Opening a new window")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('manejar nueva pagina', async ({ page, context }) => {
    // Capturar una nueva página usando el contexto
    await page.goto('https://the-internet.herokuapp.com/windows');

    // waitForEvent('page') captura cualquier nueva página del contexto
    const [nuevaPagina] = await Promise.all([
        context.waitForEvent('page'),
        page.click("a[href='/windows/new']")
    ]);

    await nuevaPagina.waitForLoadState();

    await expect(nuevaPagina.locator('h3')).toHaveText('New Window');

    // Volver a la página original
    await page.bringToFront();
    await expect(page.locator('h3')).toHaveText('Opening a new window');
});</code></pre>
            </div>
        </div>

        <h3>🔄 Alternar entre pestañas</h3>
        <div class="code-tabs" data-code-id="L034-8">
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
                <pre><code class="language-python">def test_alternar_pestañas(page: Page):
    """Navegar entre múltiples pestañas abiertas."""
    page.goto("https://the-internet.herokuapp.com/windows")

    # Abrir nueva pestaña
    with page.expect_popup() as popup_info:
        page.click("a[href='/windows/new']")

    pagina2 = popup_info.value
    pagina2.wait_for_load_state()

    # Ahora tenemos 2 pestañas
    context = page.context
    assert len(context.pages) == 2

    # Traer la primera pestaña al frente
    pagina_original = context.pages[0]
    pagina_original.bring_to_front()
    expect(pagina_original.locator("h3")).to_have_text("Opening a new window")

    # Traer la segunda pestaña al frente
    pagina2.bring_to_front()
    expect(pagina2.locator("h3")).to_have_text("New Window")

    # Cerrar la segunda pestaña
    pagina2.close()
    assert len(context.pages) == 1</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('alternar pestañas', async ({ page, context }) => {
    // Navegar entre múltiples pestañas abiertas
    await page.goto('https://the-internet.herokuapp.com/windows');

    // Abrir nueva pestaña
    const [pagina2] = await Promise.all([
        page.waitForEvent('popup'),
        page.click("a[href='/windows/new']")
    ]);

    await pagina2.waitForLoadState();

    // Ahora tenemos 2 pestañas
    expect(context.pages().length).toBe(2);

    // Traer la primera pestaña al frente
    const paginaOriginal = context.pages()[0];
    await paginaOriginal.bringToFront();
    await expect(paginaOriginal.locator('h3')).toHaveText('Opening a new window');

    // Traer la segunda pestaña al frente
    await pagina2.bringToFront();
    await expect(pagina2.locator('h3')).toHaveText('New Window');

    // Cerrar la segunda pestaña
    await pagina2.close();
    expect(context.pages().length).toBe(1);
});</code></pre>
            </div>
        </div>

        <h3>🪄 Manejar window.open()</h3>
        <div class="code-tabs" data-code-id="L034-9">
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
                <pre><code class="language-python">def test_window_open(page: Page):
    """Capturar ventanas abiertas con window.open() desde JavaScript."""
    page.goto("https://ejemplo.com")

    # Si el sitio usa window.open() al hacer clic en un botón
    with page.expect_popup() as popup_info:
        # Simular un window.open() con JavaScript
        page.evaluate("window.open('https://example.com', '_blank')")

    nueva_ventana = popup_info.value
    nueva_ventana.wait_for_load_state()

    expect(nueva_ventana).to_have_url("https://example.com/")
    nueva_ventana.close()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('window open', async ({ page }) => {
    // Capturar ventanas abiertas con window.open() desde JavaScript
    await page.goto('https://ejemplo.com');

    // Si el sitio usa window.open() al hacer clic en un botón
    const [nuevaVentana] = await Promise.all([
        page.waitForEvent('popup'),
        // Simular un window.open() con JavaScript
        page.evaluate("window.open('https://example.com', '_blank')")
    ]);

    await nuevaVentana.waitForLoadState();

    await expect(nuevaVentana).toHaveURL('https://example.com/');
    await nuevaVentana.close();
});</code></pre>
            </div>
        </div>

        <h3>🔗 Ejemplo completo: iframe + popup</h3>
        <div class="code-tabs" data-code-id="L034-10">
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
                <pre><code class="language-python">import pytest
from playwright.sync_api import Page, expect

class TestIframesYVentanas:
    """Tests de iframes y ventanas múltiples."""

    def test_editar_en_iframe(self, page: Page):
        """Escribir texto en el editor TinyMCE dentro de un iframe."""
        page.goto("https://the-internet.herokuapp.com/iframe")

        # Acceder al iframe del editor
        frame = page.frame_locator("#mce_0_ifr")
        editor = frame.locator("#tinymce")

        # Limpiar contenido existente
        editor.click()
        editor.press("Control+a")
        editor.press("Backspace")

        # Escribir nuevo contenido
        editor.type("Hola desde Playwright!")
        expect(editor).to_contain_text("Hola desde Playwright!")

    def test_abrir_y_cerrar_ventana(self, page: Page):
        """Abrir una nueva ventana, verificar contenido y cerrarla."""
        page.goto("https://the-internet.herokuapp.com/windows")

        # Abrir nueva ventana
        with page.expect_popup() as popup_info:
            page.click("a[href='/windows/new']")

        nueva = popup_info.value
        nueva.wait_for_load_state()

        # Verificar contenido en la nueva ventana
        expect(nueva.locator("h3")).to_have_text("New Window")

        # Cerrar y verificar que volvemos a la original
        nueva.close()
        assert len(page.context.pages) == 1
        expect(page.locator("h3")).to_have_text("Opening a new window")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test.describe('TestIframesYVentanas', () => {
    // Tests de iframes y ventanas múltiples

    test('editar en iframe', async ({ page }) => {
        // Escribir texto en el editor TinyMCE dentro de un iframe
        await page.goto('https://the-internet.herokuapp.com/iframe');

        // Acceder al iframe del editor
        const frame = page.frameLocator('#mce_0_ifr');
        const editor = frame.locator('#tinymce');

        // Limpiar contenido existente
        await editor.click();
        await editor.press('Control+a');
        await editor.press('Backspace');

        // Escribir nuevo contenido
        await editor.type('Hola desde Playwright!');
        await expect(editor).toContainText('Hola desde Playwright!');
    });

    test('abrir y cerrar ventana', async ({ page, context }) => {
        // Abrir una nueva ventana, verificar contenido y cerrarla
        await page.goto('https://the-internet.herokuapp.com/windows');

        // Abrir nueva ventana
        const [nueva] = await Promise.all([
            page.waitForEvent('popup'),
            page.click("a[href='/windows/new']")
        ]);

        await nueva.waitForLoadState();

        // Verificar contenido en la nueva ventana
        await expect(nueva.locator('h3')).toHaveText('New Window');

        // Cerrar y verificar que volvemos a la original
        await nueva.close();
        expect(context.pages().length).toBe(1);
        await expect(page.locator('h3')).toHaveText('Opening a new window');
    });
});</code></pre>
            </div>
        </div>

        <h3>📊 Comparación: frame_locator vs frame</h3>
        <table style="width:100%; border-collapse: collapse;">
            <tr style="background: #e3f2fd;">
                <th style="padding: 8px; border: 1px solid #ddd;">Característica</th>
                <th style="padding: 8px; border: 1px solid #ddd;">frame_locator()</th>
                <th style="padding: 8px; border: 1px solid #ddd;">page.frame() / page.frames</th>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Retorna</td>
                <td style="padding: 6px; border: 1px solid #ddd;">FrameLocator</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Frame</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;">Auto-waiting</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Si (heredado de locators)</td>
                <td style="padding: 6px; border: 1px solid #ddd;">No</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Encadenable</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Si: <code>frame.locator(...)</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Si, pero sin auto-wait</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;">Búsqueda por</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Selector CSS del iframe</td>
                <td style="padding: 6px; border: 1px solid #ddd;">name o url</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Iframes anidados</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Encadenar <code>.frame_locator()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Acceso directo por nombre/url</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;">Recomendado</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><strong>Si - uso general</strong></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Solo para inspeccionar frames</td>
            </tr>
        </table>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚠️ Errores comunes</h4>
            <ul>
                <li><strong>Buscar elementos del iframe sin frame_locator:</strong> <code>page.locator("#editor")</code> nunca encontrará un elemento dentro de un iframe</li>
                <li><strong>No esperar a que cargue la nueva página:</strong> Siempre usa <code>wait_for_load_state()</code> después de obtener el popup</li>
                <li><strong>Confundir popup con dialog:</strong> Los popups son nuevas pestañas/ventanas; los dialogs (alert, confirm) se manejan con <code>page.on("dialog")</code></li>
            </ul>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <ol>
            <li>Navega a <code>https://the-internet.herokuapp.com/iframe</code></li>
            <li>Usa <code>frame_locator()</code> para acceder al editor TinyMCE dentro del iframe</li>
            <li>Limpia el texto existente y escribe "Automatizado con Playwright"</li>
            <li>Verifica que el texto se escribió correctamente con <code>expect()</code></li>
            <li>Navega a <code>https://the-internet.herokuapp.com/windows</code></li>
            <li>Haz clic en "Click Here" y captura la nueva ventana con <code>expect_popup()</code></li>
            <li>Verifica el título "New Window" en la nueva pestaña</li>
            <li>Cierra la nueva pestaña y verifica que solo queda una página abierta</li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Acceder a elementos dentro de iframes usando <code>frame_locator()</code></li>
                <li>Manejar iframes anidados encadenando frame locators</li>
                <li>Listar todos los frames de una página con <code>page.frames</code></li>
                <li>Capturar nuevas pestañas/ventanas con <code>expect_popup()</code></li>
                <li>Alternar entre pestañas y cerrar ventanas correctamente</li>
            </ul>
        </div>
    `,
    topics: ["iframes", "ventanas", "frames"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_034 = LESSON_034;
}
