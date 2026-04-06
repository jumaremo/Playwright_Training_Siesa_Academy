/**
 * Playwright Academy - Lección 012
 * Navegación y páginas
 * Sección 2: Fundamentos de Playwright
 */

const LESSON_012 = {
    id: 12,
    title: "Navegación y páginas",
    duration: "5 min",
    level: "beginner",
    section: "section-02",
    content: `
        <h2>🧭 Navegación y páginas</h2>
        <p>La navegación es la base de todo test web. Playwright ofrece métodos potentes
        para navegar, esperar carga y trabajar con múltiples páginas.</p>

        <h3>🚀 Navegación básica con goto()</h3>
        <pre><code class="python">from playwright.sync_api import Page, expect

def test_navegacion_basica(page: Page):
    # Navegar a una URL
    page.goto("https://example.com")

    # goto() espera automáticamente a que la página cargue
    # Por defecto espera el evento "load"
    expect(page).to_have_title("Example Domain")</code></pre>

        <h3>⚙️ Opciones de goto()</h3>
        <pre><code class="python">def test_opciones_goto(page: Page):
    # Timeout personalizado (en milisegundos)
    page.goto("https://sitio-lento.com", timeout=60000)

    # Esperar diferentes estados de carga
    page.goto("https://example.com", wait_until="domcontentloaded")
    # Opciones de wait_until:
    # "load"             - Evento load completo (default)
    # "domcontentloaded" - DOM parseado, sin esperar recursos
    # "networkidle"      - Sin actividad de red por 500ms
    # "commit"           - Respuesta del servidor recibida</code></pre>

        <h3>🔄 Métodos de navegación</h3>
        <pre><code class="python">def test_navegacion_completa(page: Page):
    # Ir a una URL
    page.goto("https://example.com")

    # Navegar a otra página (simula click en link)
    page.goto("https://example.com/about")

    # Atrás (como el botón del navegador)
    page.go_back()
    expect(page).to_have_url("https://example.com")

    # Adelante
    page.go_forward()
    expect(page).to_have_url("https://example.com/about")

    # Recargar la página
    page.reload()
    expect(page).to_have_url("https://example.com/about")</code></pre>

        <h3>🔗 Obtener información de la página</h3>
        <pre><code class="python">def test_info_pagina(page: Page):
    page.goto("https://example.com")

    # Título de la página
    titulo = page.title()
    print(f"Título: {titulo}")

    # URL actual
    url = page.url
    print(f"URL: {url}")

    # Contenido HTML completo
    html = page.content()
    assert "Example" in html</code></pre>

        <h3>📑 Esperar navegación</h3>
        <pre><code class="python">def test_esperar_navegacion(page: Page):
    page.goto("https://example.com")

    # Esperar navegación después de una acción
    with page.expect_navigation():
        page.click("a[href='/about']")

    # Verificar que llegamos a la nueva página
    expect(page).to_have_url("**/about")

    # Esperar una URL específica
    with page.expect_navigation(url="**/dashboard"):
        page.click("#btn-ir-dashboard")</code></pre>

        <h3>🪟 Múltiples páginas (pestañas)</h3>
        <pre><code class="python">def test_nueva_pestana(page: Page, context):
    page.goto("https://example.com")

    # Capturar la nueva pestaña que se abre
    with context.expect_page() as new_page_info:
        page.click("a[target='_blank']")  # Link que abre nueva pestaña

    nueva_pagina = new_page_info.value
    nueva_pagina.wait_for_load_state()

    # Ahora puedes interactuar con ambas
    print(f"Original: {page.url}")
    print(f"Nueva: {nueva_pagina.url}")

    # Cerrar la nueva pestaña
    nueva_pagina.close()</code></pre>

        <h3>⏳ wait_for_load_state()</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python">def test_estados_carga(page: Page):
    page.goto("https://example.com")

    # Esperar estados específicos después de acciones
    page.wait_for_load_state("networkidle")  # Sin tráfico de red
    page.wait_for_load_state("domcontentloaded")  # DOM listo
    page.wait_for_load_state("load")  # Todo cargado</code></pre>
            <p><strong>Tip:</strong> <code>goto()</code> ya espera "load" por defecto.
            Usa <code>wait_for_load_state()</code> después de acciones que
            disparan navegación, como clicks en links.</p>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <ol>
            <li>Crea <code>tests/test_navegacion.py</code></li>
            <li>Escribe un test que:
                <ul>
                    <li>Navegue a <code>https://playwright.dev</code></li>
                    <li>Verifique el título con <code>expect(page).to_have_title()</code></li>
                    <li>Haga click en un link de navegación</li>
                    <li>Use <code>go_back()</code> para regresar</li>
                    <li>Verifique que volvió a la URL original</li>
                </ul>
            </li>
            <li>Prueba diferentes valores de <code>wait_until</code> en <code>goto()</code></li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Navegar con <code>goto()</code> y sus opciones</li>
                <li>Usar <code>go_back()</code>, <code>go_forward()</code> y <code>reload()</code></li>
                <li>Obtener título, URL y contenido de la página</li>
                <li>Manejar nuevas pestañas y estados de carga</li>
            </ul>
        </div>
    `,
    topics: ["navegación", "páginas", "goto"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_012 = LESSON_012;
}
