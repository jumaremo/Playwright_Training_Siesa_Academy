/**
 * Playwright Academy - Lección 014
 * Interacciones básicas: click, fill, type
 * Sección 2: Fundamentos de Playwright
 */

const LESSON_014 = {
    id: 14,
    title: "Interacciones básicas: click, fill, type",
    duration: "5 min",
    level: "beginner",
    section: "section-02",
    content: `
        <h2>🖱️ Interacciones básicas: click, fill, type</h2>
        <p>Playwright ofrece métodos intuitivos para interactuar con la página.
        Todos incluyen <strong>auto-waiting</strong>: esperan a que el elemento sea visible
        y accionable antes de ejecutar la acción.</p>

        <h3>🖱️ Click</h3>
        <pre><code class="python">from playwright.sync_api import Page, expect

def test_clicks(page: Page):
    page.goto("https://example.com")

    # Click básico
    page.click("a")

    # Click con localizador semántico (recomendado)
    page.get_by_role("button", name="Enviar").click()

    # Doble click
    page.dblclick("#elemento")

    # Click derecho (menú contextual)
    page.click("#elemento", button="right")

    # Click con modificador (Ctrl+Click, Shift+Click)
    page.click("#link", modifiers=["Control"])  # Abre en nueva pestaña

    # Click en posición específica (relativa al centro del elemento)
    page.click("#canvas", position={"x": 100, "y": 200})

    # Click forzado (ignora checks de visibilidad)
    # Usar solo cuando sea absolutamente necesario
    page.click("#oculto", force=True)</code></pre>

        <h3>✍️ fill() vs type()</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Diferencia importante:</h4>
            <ul>
                <li><code>fill()</code>: Reemplaza todo el contenido del campo. Rápido. Es el método recomendado.</li>
                <li><code>type()</code>: Simula tecleo carácter por carácter. Más lento pero dispara eventos de teclado.</li>
            </ul>
        </div>
        <pre><code class="python">def test_fill_vs_type(page: Page):
    page.goto("/formulario")

    # fill() - Reemplaza todo el contenido (RECOMENDADO)
    page.fill("#nombre", "Juan Reina")
    expect(page.locator("#nombre")).to_have_value("Juan Reina")

    # fill() borra lo anterior automáticamente
    page.fill("#nombre", "Carlos Díaz")
    expect(page.locator("#nombre")).to_have_value("Carlos Díaz")

    # type() - Teclea carácter por carácter
    # Útil cuando la app escucha eventos individuales de teclado
    page.locator("#buscar").type("Playwright", delay=100)  # 100ms entre teclas

    # Limpiar un campo
    page.fill("#nombre", "")  # Forma más simple
    expect(page.locator("#nombre")).to_have_value("")</code></pre>

        <h3>📝 Interacciones con formularios</h3>
        <pre><code class="python">def test_formulario(page: Page):
    page.goto("/registro")

    # Campos de texto
    page.fill("#nombre", "Ana García")
    page.fill("#email", "ana@ejemplo.com")
    page.fill("#password", "mi-clave-segura")

    # Textarea
    page.fill("#comentarios", "Este es un comentario\\nen múltiples líneas")

    # Checkbox - marcar
    page.check("#acepto-terminos")
    expect(page.locator("#acepto-terminos")).to_be_checked()

    # Checkbox - desmarcar
    page.uncheck("#recibir-emails")
    expect(page.locator("#recibir-emails")).not_to_be_checked()

    # Radio button
    page.check("#plan-premium")

    # Select / Dropdown
    page.select_option("#pais", "colombia")          # por valor
    page.select_option("#pais", label="Colombia")     # por texto visible
    page.select_option("#pais", index=3)              # por índice</code></pre>

        <h3>⌨️ Acciones de teclado</h3>
        <pre><code class="python">def test_teclado(page: Page):
    page.goto("/formulario")

    # Presionar una tecla
    page.press("#buscar", "Enter")

    # Combinaciones de teclas
    page.press("#editor", "Control+a")    # Seleccionar todo
    page.press("#editor", "Control+c")    # Copiar
    page.press("#editor", "Control+v")    # Pegar

    # Teclas especiales
    page.press("#campo", "Tab")           # Tab
    page.press("#campo", "Escape")        # Escape
    page.press("#campo", "ArrowDown")     # Flecha abajo
    page.press("#campo", "Backspace")     # Borrar</code></pre>

        <h3>🔗 Encadenar con localizadores</h3>
        <pre><code class="python">def test_encadenamiento(page: Page):
    page.goto("/app")

    # Usar localizadores semánticos (forma preferida)
    page.get_by_label("Correo electrónico").fill("user@test.com")
    page.get_by_label("Contraseña").fill("secreto123")
    page.get_by_role("button", name="Iniciar sesión").click()

    # Verificar resultado
    expect(page.get_by_text("Bienvenido")).to_be_visible()</code></pre>

        <h3>💡 Buenas prácticas</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <ul>
                <li>Prefiere <code>fill()</code> sobre <code>type()</code> para mejor rendimiento</li>
                <li>Usa localizadores semánticos: <code>get_by_role()</code>, <code>get_by_label()</code></li>
                <li>No uses <code>force=True</code> a menos que sea estrictamente necesario</li>
                <li>Verifica con <code>expect()</code> después de cada acción importante</li>
                <li>Usa <code>check()</code>/<code>uncheck()</code> en vez de <code>click()</code> para checkboxes</li>
            </ul>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <ol>
            <li>Crea <code>tests/test_interacciones.py</code></li>
            <li>Navega a un formulario de prueba (busca "demo form playwright" o usa una página local)</li>
            <li>Practica con:
                <ul>
                    <li><code>fill()</code> en campos de texto</li>
                    <li><code>check()</code> en un checkbox</li>
                    <li><code>select_option()</code> en un dropdown</li>
                    <li><code>click()</code> en el botón de envío</li>
                </ul>
            </li>
            <li>Agrega assertions después de cada interacción</li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Dominar <code>click()</code> y sus variantes (dblclick, right-click)</li>
                <li>Entender la diferencia entre <code>fill()</code> y <code>type()</code></li>
                <li>Interactuar con formularios: checkboxes, radios, selects</li>
                <li>Usar acciones de teclado con <code>press()</code></li>
            </ul>
        </div>
    `,
    topics: ["click", "fill", "type", "interacciones"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_014 = LESSON_014;
}
