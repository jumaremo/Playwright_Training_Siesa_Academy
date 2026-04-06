/**
 * Playwright Academy - Lección 029
 * Formularios: fill, check, select
 * Sección 4: Interacciones Web Fundamentales
 */

const LESSON_029 = {
    id: 29,
    title: "Formularios: fill, check, select",
    duration: "8 min",
    level: "beginner",
    section: "section-04",
    content: `
        <h2>📝 Formularios: fill, check, select</h2>
        <p>Los formularios son el corazón de la mayoría de aplicaciones web. En esta lección
        dominarás todas las herramientas que Playwright ofrece para interactuar con campos de texto,
        checkboxes, radio buttons y dropdowns de forma confiable y expresiva.</p>

        <h3>✏️ page.fill() vs page.type() — ¿Cuándo usar cada uno?</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Playwright ofrece dos formas principales de ingresar texto en un campo.
            Entender la diferencia es crucial para escribir tests robustos.</p>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Método</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Comportamiento</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Cuándo usarlo</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>page.fill()</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Limpia el campo y establece el valor directamente</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">La mayoría de los casos (recomendado)</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>page.type()</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Simula teclas una por una (keydown, keypress, keyup)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Cuando la app reacciona a cada tecla (autocompletado, búsqueda en vivo)</td>
                </tr>
            </table>
        </div>
        <pre><code class="python">from playwright.sync_api import Page

def test_fill_vs_type(page: Page):
    page.goto("https://the-internet.herokuapp.com/login")

    # fill() — rápido, limpia primero y establece el valor
    page.fill("#username", "tomsmith")

    # type() — simula cada tecla individualmente
    # Útil si hay lógica onkeyup/onkeydown
    page.type("#password", "SuperSecretPassword!", delay=50)</code></pre>

        <h3>📄 Llenado de campos de texto</h3>
        <p>Con <code>page.fill()</code> puedes llenar inputs de texto, textareas y campos de contraseña:</p>
        <pre><code class="python">def test_campos_texto(page: Page):
    page.goto("https://ejemplo.com/registro")

    # Input de texto simple
    page.fill("#nombre", "Juan Manuel")

    # Campo de email
    page.fill("input[type='email']", "juan@siesa.com")

    # Campo de contraseña
    page.fill("input[type='password']", "MiClave$egura123")

    # Textarea (comentarios, descripciones)
    page.fill("textarea#comentarios", "Este es un comentario\\nmultilínea")

    # Campo de búsqueda
    page.fill("input[type='search']", "Playwright Python")</code></pre>

        <h3>☑️ Checkboxes: check, uncheck y set_checked</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Playwright proporciona métodos específicos para checkboxes que son más expresivos
            y seguros que simplemente hacer <code>click()</code>.</p>
        </div>
        <pre><code class="python">from playwright.sync_api import Page, expect

def test_checkboxes(page: Page):
    page.goto("https://the-internet.herokuapp.com/checkboxes")

    checkbox1 = page.locator("#checkboxes input").first
    checkbox2 = page.locator("#checkboxes input").last

    # check() — marca el checkbox (si ya está marcado, no hace nada)
    checkbox1.check()
    expect(checkbox1).to_be_checked()

    # uncheck() — desmarca el checkbox
    checkbox2.uncheck()
    expect(checkbox2).not_to_be_checked()

    # set_checked() — establece estado explícitamente (True/False)
    checkbox1.set_checked(False)
    expect(checkbox1).not_to_be_checked()

    checkbox1.set_checked(True)
    expect(checkbox1).to_be_checked()</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚠️ check() vs click() en checkboxes</h4>
            <ul>
                <li><code>check()</code>: Idempotente — si ya está marcado, no hace nada. Siempre deja el checkbox marcado.</li>
                <li><code>click()</code>: Alterna el estado — si está marcado, lo desmarca. Puede causar tests frágiles.</li>
                <li><strong>Recomendación:</strong> Usa siempre <code>check()</code>/<code>uncheck()</code> para checkboxes.</li>
            </ul>
        </div>

        <h3>🔘 Radio buttons</h3>
        <p>Los radio buttons se manejan de la misma forma que los checkboxes, usando <code>check()</code>:</p>
        <pre><code class="python">def test_radio_buttons(page: Page):
    page.goto("https://ejemplo.com/encuesta")

    # Seleccionar un radio button por su valor
    page.locator("input[type='radio'][value='opcion_a']").check()

    # Verificar que está seleccionado
    expect(page.locator("input[type='radio'][value='opcion_a']")).to_be_checked()

    # Al seleccionar otro, el anterior se deselecciona automáticamente
    page.locator("input[type='radio'][value='opcion_b']").check()
    expect(page.locator("input[type='radio'][value='opcion_b']")).to_be_checked()
    expect(page.locator("input[type='radio'][value='opcion_a']")).not_to_be_checked()

    # Usando label como localizador (más legible)
    page.get_by_label("Acepto los términos").check()</code></pre>

        <h3>📋 Dropdowns: page.select_option()</h3>
        <p>El método <code>select_option()</code> maneja elementos <code>&lt;select&gt;</code> nativos
        con múltiples formas de selección:</p>
        <pre><code class="python">def test_dropdown(page: Page):
    page.goto("https://the-internet.herokuapp.com/dropdown")

    # Seleccionar por valor del atributo value
    page.select_option("#dropdown", value="1")

    # Seleccionar por texto visible (label)
    page.select_option("#dropdown", label="Option 2")

    # Seleccionar por índice (0-based)
    page.select_option("#dropdown", index=1)

    # Verificar la selección
    expect(page.locator("#dropdown")).to_have_value("1")</code></pre>

        <h3>📋 Multi-select</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Para elementos <code>&lt;select multiple&gt;</code>, puedes seleccionar varias opciones
            pasando una lista de valores:</p>
        </div>
        <pre><code class="python">def test_multiselect(page: Page):
    page.goto("https://ejemplo.com/formulario-multi")

    # Seleccionar múltiples opciones por valor
    page.select_option("#lenguajes", value=["python", "javascript", "java"])

    # Seleccionar múltiples opciones por label
    page.select_option("#ciudades", label=["Bogotá", "Medellín", "Cali"])

    # Mezclar criterios (value + label + index)
    page.select_option("#habilidades", value=["qa"], label=["DevOps"], index=[2])

    # Verificar valores seleccionados
    valores = page.locator("#lenguajes").evaluate(
        "el => Array.from(el.selectedOptions).map(o => o.value)"
    )
    assert "python" in valores</code></pre>

        <h3>🧹 Limpiar campos antes de llenar</h3>
        <pre><code class="python">def test_limpiar_campos(page: Page):
    page.goto("https://ejemplo.com/editar-perfil")

    # fill() ya limpia automáticamente — no necesitas limpiar antes
    page.fill("#nombre", "Nuevo Nombre")

    # Pero si necesitas limpiar sin llenar:
    page.fill("#buscar", "")

    # O si necesitas limpiar y luego usar type():
    page.fill("#campo_autocompletado", "")
    page.type("#campo_autocompletado", "Play", delay=100)

    # Alternativa: seleccionar todo y borrar con teclado
    page.locator("#campo").press("Control+a")
    page.locator("#campo").press("Backspace")</code></pre>

        <h3>🚀 Envío de formularios</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Hay varias formas de enviar un formulario, dependiendo de cómo esté construida la aplicación:</p>
        </div>
        <pre><code class="python">def test_enviar_formulario(page: Page):
    page.goto("https://the-internet.herokuapp.com/login")
    page.fill("#username", "tomsmith")
    page.fill("#password", "SuperSecretPassword!")

    # Opción 1: Click en el botón submit (la más común)
    page.click("button[type='submit']")

    # Opción 2: Presionar Enter en un campo del formulario
    # page.press("#password", "Enter")

    # Opción 3: Usar locator con get_by_role
    # page.get_by_role("button", name="Login").click()</code></pre>

        <h3>🏗️ Ejemplo completo: automatizar formulario de registro</h3>
        <pre><code class="python">from playwright.sync_api import Page, expect

def test_formulario_registro_completo(page: Page):
    """Automatiza un formulario con todos los tipos de campos."""
    page.goto("https://the-internet.herokuapp.com/login")

    # --- Campos de texto ---
    page.fill("#username", "tomsmith")
    page.fill("#password", "SuperSecretPassword!")

    # --- Enviar ---
    page.click("button[type='submit']")

    # --- Verificar resultado ---
    expect(page).to_have_url("**/secure")
    expect(page.locator("#flash")).to_contain_text(
        "You logged into a secure area!"
    )</code></pre>
        <pre><code class="python"># Ejemplo más completo con checkbox, radio y dropdown
def test_formulario_completo(page: Page):
    """Ejemplo de formulario con múltiples tipos de campos."""
    page.goto("https://ejemplo.com/registro")

    # Texto
    page.fill("#nombre", "Juan Manuel Reina")
    page.fill("#email", "juan.reina@siesa.com")
    page.fill("#password", "Clave$egura123")
    page.fill("#confirmar_password", "Clave$egura123")

    # Dropdown
    page.select_option("#pais", label="Colombia")
    page.select_option("#ciudad", label="Cali")

    # Radio buttons
    page.locator("input[name='genero'][value='masculino']").check()

    # Checkboxes
    page.get_by_label("Acepto términos y condiciones").check()
    page.get_by_label("Suscribirme al newsletter").check()

    # Textarea
    page.fill("textarea#bio", "Líder QA con experiencia en automatización")

    # Enviar
    page.get_by_role("button", name="Registrarse").click()

    # Verificar éxito
    expect(page.locator(".mensaje-exito")).to_be_visible()
    expect(page.locator(".mensaje-exito")).to_contain_text("Registro exitoso")</code></pre>

        <h3>📊 Tabla resumen de métodos para formularios</h3>
        <table style="width:100%; border-collapse: collapse;">
            <tr style="background: #e8f5e9;">
                <th style="padding: 8px; border: 1px solid #ddd;">Método</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Elemento</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Descripción</th>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.fill(selector, valor)</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">input, textarea</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Limpia y establece valor (recomendado)</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.type(selector, texto)</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">input, textarea</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Simula teclas una por una</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>locator.check()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">checkbox, radio</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Marca (idempotente)</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>locator.uncheck()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">checkbox</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Desmarca (idempotente)</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>locator.set_checked(bool)</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">checkbox, radio</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Establece estado explícito</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.select_option(sel, ...)</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">select</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Por value, label o index</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.press(selector, tecla)</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">cualquiera</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Presiona tecla (Enter, Tab, etc.)</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>expect(loc).to_be_checked()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">checkbox, radio</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Assertion: verificar que está marcado</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>expect(loc).to_have_value(v)</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">input, select</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Assertion: verificar valor del campo</td>
            </tr>
        </table>

        <h3>🎯 Ejercicio práctico</h3>
        <ol>
            <li>Navega a <code>https://the-internet.herokuapp.com/login</code></li>
            <li>Llena el usuario con <code>page.fill()</code> y la contraseña con <code>page.type()</code></li>
            <li>Envía el formulario con click en el botón submit</li>
            <li>Verifica que redirigió a <code>/secure</code></li>
            <li>Navega a <code>/checkboxes</code> y marca ambos checkboxes usando <code>check()</code></li>
            <li>Verifica que ambos están marcados con <code>expect().to_be_checked()</code></li>
            <li>Navega a <code>/dropdown</code> y selecciona "Option 1" por label y verifica con <code>to_have_value()</code></li>
            <li>Cambia la selección a "Option 2" por value y verifica</li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Dominar <code>page.fill()</code> y entender cuándo usar <code>page.type()</code></li>
                <li>Usar <code>check()</code>, <code>uncheck()</code> y <code>set_checked()</code> para checkboxes y radios</li>
                <li>Seleccionar opciones en dropdowns por value, label e index</li>
                <li>Manejar multi-select y limpieza de campos</li>
                <li>Enviar formularios con click o Enter</li>
            </ul>
        </div>
    `,
    topics: ["formularios", "fill", "check", "select"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 8,
    difficulty: "easy",
    type: "foundation"
};

if (typeof window !== 'undefined') {
    window.LESSON_029 = LESSON_029;
}
