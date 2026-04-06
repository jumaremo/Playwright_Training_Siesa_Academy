/**
 * Playwright Academy - Lección 030
 * Botones, links y navegación
 * Sección 4: Interacciones Web Fundamentales
 */

const LESSON_030 = {
    id: 30,
    title: "Botones, links y navegación",
    duration: "5 min",
    level: "beginner",
    section: "section-04",
    content: `
        <h2>🖱️ Botones, links y navegación</h2>
        <p>Hacer click parece simple, pero Playwright ofrece un control granular sobre cómo, dónde y
        con qué modificadores hacer click. En esta lección explorarás todas las variantes de interacción
        con botones y links, además de cómo manejar la navegación resultante.</p>

        <h3>🎯 page.click() a fondo</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><code>page.click()</code> es el método más usado de Playwright. Acepta múltiples opciones
            para controlar exactamente cómo se ejecuta el click:</p>
        </div>
        <pre><code class="python">from playwright.sync_api import Page

def test_click_opciones(page: Page):
    page.goto("https://the-internet.herokuapp.com")

    # Click simple (el más común)
    page.click("a[href='/login']")

    # Click con opciones avanzadas
    page.click("#boton", button="left")       # Botón izquierdo (default)
    page.click("#boton", click_count=2)       # Doble click
    page.click("#boton", delay=100)           # Pausa entre mousedown y mouseup (ms)
    page.click("#boton", force=True)          # Ignorar actionability checks
    page.click("#boton", position={"x": 10, "y": 5})  # Click en posición específica</code></pre>

        <h3>📊 Opciones de page.click()</h3>
        <table style="width:100%; border-collapse: collapse;">
            <tr style="background: #e8f5e9;">
                <th style="padding: 8px; border: 1px solid #ddd;">Opción</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Tipo</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Descripción</th>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>button</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">"left" | "right" | "middle"</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Qué botón del mouse usar</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>click_count</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">int</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Número de clicks (1=simple, 2=doble, 3=triple)</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>delay</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">float (ms)</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Pausa entre mousedown y mouseup</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>force</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">bool</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Omitir verificaciones de actionability</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>modifiers</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">list</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Teclas modificadoras: "Alt", "Control", "Meta", "Shift"</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>position</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">dict {x, y}</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Coordenadas relativas al elemento</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>timeout</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">float (ms)</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Timeout máximo para la acción</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>no_wait_after</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">bool</td>
                <td style="padding: 6px; border: 1px solid #ddd;">No esperar navegación tras el click</td>
            </tr>
        </table>

        <h3>👆 Doble click y click derecho</h3>
        <pre><code class="python">def test_clicks_especiales(page: Page):
    page.goto("https://the-internet.herokuapp.com/context_menu")

    # Doble click — método dedicado
    page.dblclick("#contenido-editable")

    # Alternativa con click_count
    page.click("#contenido-editable", click_count=2)

    # Click derecho (abre menú contextual)
    page.click("#hot-spot", button="right")

    # Triple click — selecciona párrafo completo
    page.click("#texto-largo", click_count=3)</code></pre>

        <h3>⌨️ Click con modificadores (Shift, Ctrl)</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Los modificadores permiten simular combinaciones de teclado + mouse,
            útil para multi-selección en listas o tablas:</p>
        </div>
        <pre><code class="python">def test_click_con_modificadores(page: Page):
    page.goto("https://ejemplo.com/lista-seleccionable")

    # Ctrl+Click — agregar a la selección
    page.click("#item-1")
    page.click("#item-3", modifiers=["Control"])
    page.click("#item-5", modifiers=["Control"])
    # Ahora items 1, 3 y 5 están seleccionados

    # Shift+Click — seleccionar rango
    page.click("#item-1")
    page.click("#item-5", modifiers=["Shift"])
    # Ahora items 1 a 5 están seleccionados

    # Alt+Click — comportamiento especial de la app
    page.click("#elemento", modifiers=["Alt"])</code></pre>

        <h3>🎈 Hovering: page.hover()</h3>
        <pre><code class="python">from playwright.sync_api import Page, expect

def test_hover(page: Page):
    page.goto("https://the-internet.herokuapp.com/hovers")

    # Hover sobre un elemento para revelar contenido oculto
    perfiles = page.locator(".figure")

    # Hover sobre el primer perfil
    perfiles.first.hover()

    # Verificar que se muestra la información
    info = perfiles.first.locator(".figcaption")
    expect(info).to_be_visible()
    expect(info.locator("h5")).to_have_text("name: user1")

    # Hover sobre el segundo perfil
    perfiles.nth(1).hover()
    info2 = perfiles.nth(1).locator(".figcaption")
    expect(info2).to_be_visible()</code></pre>

        <h3>🔗 Interacción con links</h3>
        <pre><code class="python">def test_links(page: Page):
    page.goto("https://the-internet.herokuapp.com")

    # Click simple en un link
    page.click("a[href='/login']")
    expect(page).to_have_url("**/login")

    page.goto("https://the-internet.herokuapp.com")

    # Obtener el href de un link antes de hacer click
    href = page.locator("a[href='/login']").get_attribute("href")
    assert href == "/login"

    # Obtener el texto del link
    texto = page.locator("a[href='/login']").inner_text()
    assert "Form Authentication" in texto

    # Verificar que un link existe y es visible
    expect(page.locator("a[href='/checkboxes']")).to_be_visible()

    # Contar links en la página
    total_links = page.locator("#content ul li a").count()
    assert total_links > 10</code></pre>

        <h3>🧭 page.goto() vs click en links</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #ce93d8;">
                    <th style="padding: 8px; border: 1px solid #ddd; color: white;">Enfoque</th>
                    <th style="padding: 8px; border: 1px solid #ddd; color: white;">Cuándo usarlo</th>
                    <th style="padding: 8px; border: 1px solid #ddd; color: white;">Ventaja</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>page.goto(url)</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Ir directamente a una URL conocida</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Rápido, no depende de la UI</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>page.click(link)</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Simular la navegación del usuario</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Verifica que el link funciona</td>
                </tr>
            </table>
        </div>
        <pre><code class="python">def test_goto_vs_click(page: Page):
    # goto() — Navegación directa (setup rápido)
    page.goto("https://the-internet.herokuapp.com/login")
    # Ideal para: precondiciones, ir al punto de inicio del test

    # click() — Navegación por interacción (verifica la UI)
    page.goto("https://the-internet.herokuapp.com")
    page.click("a[href='/login']")
    # Ideal para: verificar que los links funcionan correctamente</code></pre>

        <h3>⏳ Eventos de navegación</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Cuando un click genera una navegación, necesitas esperar a que la página esté lista
            antes de interactuar con ella:</p>
        </div>
        <pre><code class="python">def test_esperar_navegacion(page: Page):
    page.goto("https://the-internet.herokuapp.com")

    # Playwright auto-espera navegación después de click
    page.click("a[href='/login']")

    # wait_for_load_state — esperar estado específico de la página
    page.wait_for_load_state("networkidle")  # Sin tráfico de red
    page.wait_for_load_state("domcontentloaded")  # DOM listo
    page.wait_for_load_state("load")  # Todo cargado (default)

    # wait_for_url — esperar a que la URL cambie
    page.goto("https://the-internet.herokuapp.com")
    page.click("a[href='/login']")
    page.wait_for_url("**/login")

    # Combinación con expect
    expect(page).to_have_url("**/login")</code></pre>

        <h3>🆕 Links que abren nueva pestaña</h3>
        <pre><code class="python">def test_nueva_pestana(page: Page):
    """Manejar links con target='_blank' que abren nueva pestaña."""
    page.goto("https://the-internet.herokuapp.com/windows")

    # Capturar la nueva página que se abrirá
    with page.context.expect_page() as nueva_pagina_info:
        page.click("a[href='/windows/new']")

    nueva_pagina = nueva_pagina_info.value

    # Esperar a que cargue la nueva página
    nueva_pagina.wait_for_load_state()

    # Interactuar con la nueva página
    expect(nueva_pagina.locator("h3")).to_have_text("New Window")

    # La página original sigue disponible
    expect(page.locator("h3")).to_have_text("Opening a new window")</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip: expect_page() vs popup</h4>
            <ul>
                <li><code>context.expect_page()</code>: Para links con <code>target="_blank"</code> (nueva pestaña)</li>
                <li><code>page.expect_popup()</code>: Para popups abiertos con <code>window.open()</code></li>
                <li>Ambos devuelven un objeto <code>Page</code> que puedes usar normalmente</li>
            </ul>
        </div>

        <h3>🏗️ Ejemplo completo: botones y navegación</h3>
        <pre><code class="python">from playwright.sync_api import Page, expect

def test_interacciones_completas(page: Page):
    """Test completo con diferentes tipos de clicks y navegación."""
    # --- Navegación inicial ---
    page.goto("https://the-internet.herokuapp.com")
    expect(page.locator("h1")).to_have_text("Welcome to the-internet")

    # --- Click en link ---
    page.click("a[href='/add_remove_elements/']")
    expect(page).to_have_url("**/add_remove_elements/")

    # --- Click en botón para agregar elementos ---
    page.click("button", timeout=5000)
    expect(page.locator(".added-manually")).to_have_count(1)

    # Click múltiple
    for _ in range(3):
        page.click("button:has-text('Add Element')")
    expect(page.locator(".added-manually")).to_have_count(4)

    # --- Click en botón Delete ---
    page.locator(".added-manually").first.click()
    expect(page.locator(".added-manually")).to_have_count(3)

    # --- Navegar atrás ---
    page.go_back()
    expect(page).to_have_url("**/")

    # --- Hover test ---
    page.goto("https://the-internet.herokuapp.com/hovers")
    page.locator(".figure").first.hover()
    expect(page.locator(".figcaption").first).to_be_visible()</code></pre>

        <h3>🎯 Ejercicio práctico</h3>
        <ol>
            <li>Navega a <code>https://the-internet.herokuapp.com</code></li>
            <li>Verifica que hay más de 10 links visibles en la página principal</li>
            <li>Haz click en el link "Add/Remove Elements" y verifica la URL</li>
            <li>Haz click 5 veces en el botón "Add Element" y verifica que hay 5 elementos nuevos</li>
            <li>Elimina 2 elementos haciendo click en "Delete" y verifica que quedan 3</li>
            <li>Navega de vuelta con <code>page.go_back()</code></li>
            <li>Ve a la página <code>/hovers</code>, haz hover sobre los 3 perfiles y verifica que se muestra la info</li>
            <li>Ve a <code>/context_menu</code>, haz click derecho en el hot-spot y verifica la alerta</li>
            <li>Ve a <code>/windows</code>, haz click en "Click Here" y verifica el contenido de la nueva pestaña</li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Usar <code>page.click()</code> con todas sus opciones: button, delay, force, modifiers, position</li>
                <li>Manejar doble click con <code>dblclick()</code> y click derecho</li>
                <li>Usar <code>page.hover()</code> para interactuar con elementos ocultos</li>
                <li>Decidir cuándo usar <code>goto()</code> vs click en links</li>
                <li>Esperar navegación con <code>wait_for_url()</code> y <code>wait_for_load_state()</code></li>
                <li>Manejar links que abren nuevas pestañas con <code>expect_page()</code></li>
            </ul>
        </div>
    `,
    topics: ["botones", "links", "navegación"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_030 = LESSON_030;
}
