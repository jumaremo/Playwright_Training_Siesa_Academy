/**
 * Playwright Academy - Lección 042
 * Localizadores relativos y por layout
 * Sección 5: Localizadores y Selectores
 */

const LESSON_042 = {
    id: 42,
    title: "Localizadores relativos y por layout",
    duration: "5 min",
    level: "beginner",
    section: "section-05",
    content: `
        <h2>📐 Localizadores relativos y por layout</h2>
        <p>A veces, la estructura del DOM no proporciona una ruta clara hacia el elemento que necesitas.
        En estos casos, la <strong>posición visual</strong> del elemento en la página puede ser tu mejor aliado.
        Playwright ofrece <strong>localizadores basados en layout</strong> que permiten encontrar elementos
        según su relación espacial con otros elementos: arriba, abajo, a la izquierda, a la derecha
        o cerca de otro elemento.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎯 Objetivo de esta lección</h4>
            <p>Aprender a usar los localizadores basados en layout de Playwright
            (<code>above()</code>, <code>below()</code>, <code>left_of()</code>,
            <code>right_of()</code>, <code>near()</code>), entender sus limitaciones,
            y comparar el enfoque visual con la navegación estructural del DOM.</p>
        </div>

        <h3>🧭 Concepto: Localización por relación espacial</h3>
        <p>Los localizadores por layout funcionan basándose en las <strong>coordenadas visuales
        renderizadas</strong> de los elementos. Playwright calcula la posición (bounding box) de cada
        elemento y compara las relaciones espaciales para determinar cuáles están arriba, abajo,
        a la izquierda, a la derecha o cerca de un elemento de referencia.</p>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚠️ Requisito previo</h4>
            <p>Los localizadores de layout requieren que los elementos estén <strong>visibles y renderizados</strong>
            en la página. Si un elemento está oculto con <code>display: none</code> o <code>visibility: hidden</code>,
            no se puede usar como referencia ni será encontrado por estos localizadores.</p>
        </div>

        <div class="code-tabs" data-code-id="L042-1">
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

def test_concepto_layout(page: Page):
    """
    Imagina esta disposición visual:

    +-----------------------------------+
    |          [Label: Email]           |
    |   +---------------------------+   |
    |   |   [Input de Email]        |   |  ← below("Label: Email")
    |   +---------------------------+   |
    |   [Error: Email inválido]         |  ← below("Input de Email")
    +-----------------------------------+

    Con localizadores de layout, puedes encontrar el input
    que está debajo del label, o el error que está debajo del input.
    """
    pass  # Ejemplo conceptual</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('concepto layout', async ({ page }) => {
    /*
    Imagina esta disposición visual:

    +-----------------------------------+
    |          [Label: Email]           |
    |   +---------------------------+   |
    |   |   [Input de Email]        |   |  ← below("Label: Email")
    |   +---------------------------+   |
    |   [Error: Email inválido]         |  ← below("Input de Email")
    +-----------------------------------+

    Con localizadores de layout, puedes encontrar el input
    que está debajo del label, o el error que está debajo del input.
    */
    // Ejemplo conceptual
});</code></pre>
            </div>
        </div>

        <h3>⬆️ above() — Elemento visualmente arriba</h3>
        <p>Encuentra elementos que están visualmente <strong>por encima</strong> del elemento de referencia.</p>
        <div class="code-tabs" data-code-id="L042-2">
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
                <pre><code class="language-python">def test_above(page: Page):
    page.goto("https://example.com/formulario")

    # Encontrar el label que está arriba del input de email
    input_email = page.get_by_label("Email")
    label_arriba = page.locator("label").filter(
        has_text="Email"
    )

    # Alternativa usando layout: encontrar el heading arriba de un formulario
    formulario = page.locator("#formulario-registro")

    # El título (h2) que está arriba del formulario
    titulo = page.locator("h2").above(formulario)
    expect(titulo).to_contain_text("Registro")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('above', async ({ page }) => {
    await page.goto('https://example.com/formulario');

    // Encontrar el label que está arriba del input de email
    const inputEmail = page.getByLabel('Email');
    const labelArriba = page.locator('label').filter({
        hasText: 'Email'
    });

    // Alternativa usando layout: encontrar el heading arriba de un formulario
    const formulario = page.locator('#formulario-registro');

    // El título (h2) que está arriba del formulario
    const titulo = page.locator('h2').above(formulario);
    await expect(titulo).toContainText('Registro');
});</code></pre>
            </div>
        </div>

        <h3>⬇️ below() — Elemento visualmente abajo</h3>
        <p>Encuentra elementos que están visualmente <strong>por debajo</strong> del elemento de referencia.</p>
        <div class="code-tabs" data-code-id="L042-3">
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
                <pre><code class="language-python">def test_below(page: Page):
    page.goto("https://example.com/formulario")

    # Encontrar el mensaje de error debajo del campo de email
    campo_email = page.locator("#email")
    error_email = page.locator(".error-message").below(campo_email)
    expect(error_email).to_have_text("El email es obligatorio")

    # Encontrar la sección que está debajo del header
    header = page.locator("header")
    seccion_principal = page.locator("section").below(header).first
    expect(seccion_principal).to_be_visible()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('below', async ({ page }) => {
    await page.goto('https://example.com/formulario');

    // Encontrar el mensaje de error debajo del campo de email
    const campoEmail = page.locator('#email');
    const errorEmail = page.locator('.error-message').below(campoEmail);
    await expect(errorEmail).toHaveText('El email es obligatorio');

    // Encontrar la sección que está debajo del header
    const header = page.locator('header');
    const seccionPrincipal = page.locator('section').below(header).first();
    await expect(seccionPrincipal).toBeVisible();
});</code></pre>
            </div>
        </div>

        <h3>⬅️ left_of() — Elemento a la izquierda</h3>
        <div class="code-tabs" data-code-id="L042-4">
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
                <pre><code class="language-python">def test_left_of(page: Page):
    page.goto("https://example.com/dashboard")

    # Encontrar el label que está a la izquierda de un input
    # (formularios con layout horizontal label-input)
    input_nombre = page.locator("#nombre")
    label_nombre = page.locator("label").left_of(input_nombre)
    expect(label_nombre).to_have_text("Nombre:")

    # En un dashboard con columnas, encontrar el panel izquierdo
    panel_central = page.locator(".panel-central")
    panel_lateral = page.locator(".panel").left_of(panel_central)
    expect(panel_lateral).to_contain_text("Menú")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('left of', async ({ page }) => {
    await page.goto('https://example.com/dashboard');

    // Encontrar el label que está a la izquierda de un input
    // (formularios con layout horizontal label-input)
    const inputNombre = page.locator('#nombre');
    const labelNombre = page.locator('label').leftOf(inputNombre);
    await expect(labelNombre).toHaveText('Nombre:');

    // En un dashboard con columnas, encontrar el panel izquierdo
    const panelCentral = page.locator('.panel-central');
    const panelLateral = page.locator('.panel').leftOf(panelCentral);
    await expect(panelLateral).toContainText('Menú');
});</code></pre>
            </div>
        </div>

        <h3>➡️ right_of() — Elemento a la derecha</h3>
        <div class="code-tabs" data-code-id="L042-5">
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
                <pre><code class="language-python">def test_right_of(page: Page):
    page.goto("https://example.com/tabla-precios")

    # Encontrar el precio que está a la derecha del nombre del plan
    plan_basico = page.locator("td", has_text="Plan Básico")
    precio_basico = page.locator("td").right_of(plan_basico).first
    expect(precio_basico).to_contain_text("$9.99")

    # Encontrar el botón de acción a la derecha de un nombre de usuario
    usuario = page.locator(".nombre-usuario", has_text="carlos.diaz")
    boton_editar = page.locator("button").right_of(usuario).first
    boton_editar.click()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('right of', async ({ page }) => {
    await page.goto('https://example.com/tabla-precios');

    // Encontrar el precio que está a la derecha del nombre del plan
    const planBasico = page.locator('td', { hasText: 'Plan Básico' });
    const precioBasico = page.locator('td').rightOf(planBasico).first();
    await expect(precioBasico).toContainText('$9.99');

    // Encontrar el botón de acción a la derecha de un nombre de usuario
    const usuario = page.locator('.nombre-usuario', { hasText: 'carlos.diaz' });
    const botonEditar = page.locator('button').rightOf(usuario).first();
    await botonEditar.click();
});</code></pre>
            </div>
        </div>

        <h3>📍 near() — Elemento en proximidad</h3>
        <p><code>near()</code> encuentra elementos dentro de un radio de distancia (en píxeles) del elemento
        de referencia. Es útil cuando la relación no es estrictamente arriba/abajo/izquierda/derecha.</p>
        <div class="code-tabs" data-code-id="L042-6">
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
                <pre><code class="language-python">def test_near(page: Page):
    page.goto("https://example.com/mapa-tiendas")

    # Encontrar el texto de dirección cerca del marcador de la tienda
    marcador = page.locator(".marcador-tienda", has_text="Sucursal Norte")

    # Buscar la dirección dentro de 100px del marcador
    direccion = page.locator(".direccion").near(marcador, max_distance=100)
    expect(direccion).to_contain_text("Calle 123")

    # Sin especificar max_distance, usa un valor por defecto (50px)
    info_cercana = page.locator(".info-tienda").near(marcador)
    expect(info_cercana).to_be_visible()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('near', async ({ page }) => {
    await page.goto('https://example.com/mapa-tiendas');

    // Encontrar el texto de dirección cerca del marcador de la tienda
    const marcador = page.locator('.marcador-tienda', { hasText: 'Sucursal Norte' });

    // Buscar la dirección dentro de 100px del marcador
    const direccion = page.locator('.direccion').near(marcador, { maxDistance: 100 });
    await expect(direccion).toContainText('Calle 123');

    // Sin especificar maxDistance, usa un valor por defecto (50px)
    const infoCercana = page.locator('.info-tienda').near(marcador);
    await expect(infoCercana).toBeVisible();
});</code></pre>
            </div>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Parámetros de los localizadores de layout</h4>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #c8e6c9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Método</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Parámetro</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripción</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>above(locator)</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Locator de referencia</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Elementos cuyo borde inferior está arriba del borde superior de referencia</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>below(locator)</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Locator de referencia</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Elementos cuyo borde superior está debajo del borde inferior de referencia</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>left_of(locator)</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Locator de referencia</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Elementos cuyo borde derecho está a la izquierda del borde izquierdo de referencia</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>right_of(locator)</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Locator de referencia</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Elementos cuyo borde izquierdo está a la derecha del borde derecho de referencia</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>near(locator, max_distance=N)</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Locator + distancia en px</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Elementos cuyo centro está dentro de N píxeles del centro de referencia</td>
                </tr>
            </table>
        </div>

        <h3>🔀 Combinando layout con otros locators</h3>
        <p>Los localizadores de layout se pueden combinar con encadenamiento, filtrado y locators
        semánticos para crear selecciones muy precisas.</p>
        <div class="code-tabs" data-code-id="L042-7">
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
                <pre><code class="language-python">def test_layout_combinado(page: Page):
    page.goto("https://example.com/formulario-complejo")

    # Encontrar el input de tipo text que está debajo del label "Nombre completo"
    label_nombre = page.get_by_text("Nombre completo")
    input_nombre = (
        page.get_by_role("textbox")
        .below(label_nombre)
        .first
    )
    input_nombre.fill("Juan Manuel Reina")

    # Encontrar el botón "Guardar" que está debajo del formulario
    # y que además tiene la clase "primary"
    formulario = page.locator("#form-principal")
    boton_guardar = (
        page.locator("button.primary")
        .below(formulario)
        .filter(has_text="Guardar")
    )
    boton_guardar.click()

    # Encontrar el checkbox más cercano a un texto descriptivo
    texto_terminos = page.get_by_text("Acepto los términos y condiciones")
    checkbox_terminos = (
        page.locator("input[type='checkbox']")
        .near(texto_terminos, max_distance=50)
    )
    checkbox_terminos.check()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('layout combinado', async ({ page }) => {
    await page.goto('https://example.com/formulario-complejo');

    // Encontrar el input de tipo text que está debajo del label "Nombre completo"
    const labelNombre = page.getByText('Nombre completo');
    const inputNombre = page.getByRole('textbox')
        .below(labelNombre)
        .first();
    await inputNombre.fill('Juan Manuel Reina');

    // Encontrar el botón "Guardar" que está debajo del formulario
    // y que además tiene la clase "primary"
    const formulario = page.locator('#form-principal');
    const botonGuardar = page.locator('button.primary')
        .below(formulario)
        .filter({ hasText: 'Guardar' });
    await botonGuardar.click();

    // Encontrar el checkbox más cercano a un texto descriptivo
    const textoTerminos = page.getByText('Acepto los términos y condiciones');
    const checkboxTerminos = page.locator("input[type='checkbox']")
        .near(textoTerminos, { maxDistance: 50 });
    await checkboxTerminos.check();
});</code></pre>
            </div>
        </div>

        <h3>🎯 Casos de uso ideales</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Cuándo usar localizadores de layout</h4>
            <ul>
                <li><strong>Label e input sin <code>for</code>/<code>id</code>:</strong> cuando un label
                no está asociado programáticamente al input, pero está visualmente junto a él</li>
                <li><strong>Mensajes de error por campo:</strong> encontrar el error que está debajo o
                al lado de un campo específico</li>
                <li><strong>Tablas sin estructura semántica:</strong> cuando los datos se presentan
                en grid CSS o flexbox sin usar <code>&lt;table&gt;</code></li>
                <li><strong>Dashboards con widgets:</strong> encontrar el botón de acción de un widget
                específico cuando la estructura DOM no es clara</li>
                <li><strong>Formularios horizontales:</strong> label a la izquierda, input a la derecha</li>
            </ul>
        </div>

        <h3>⚠️ Limitaciones y caveats</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Limitaciones de los localizadores de layout</h4>
            <ol>
                <li><strong>Dependencia del viewport:</strong> Los resultados pueden cambiar con diferentes
                tamaños de pantalla. Un elemento que está "abajo" en desktop puede estar "a la derecha" en
                mobile.</li>
                <li><strong>Elementos ocultos:</strong> No funcionan con elementos no renderizados
                (<code>display: none</code>).</li>
                <li><strong>Rendimiento:</strong> Son más lentos que los locators basados en DOM porque
                requieren calcular posiciones visuales.</li>
                <li><strong>Fragilidad con layouts dinámicos:</strong> Si el layout cambia (por ejemplo,
                por una animación o resize), los resultados pueden variar.</li>
                <li><strong>Precisión:</strong> "Arriba" y "abajo" se basan en bordes del bounding box,
                no en el centro visual. Elementos parcialmente superpuestos pueden dar resultados
                inesperados.</li>
                <li><strong>Múltiples coincidencias:</strong> Pueden devolver muchos elementos. Siempre
                usa <code>.first</code> o <code>.filter()</code> adicional para precisar.</li>
            </ol>
        </div>

        <h3>🏗️ Alternativas: Navegación por estructura DOM</h3>
        <p>Antes de recurrir a localizadores de layout, considera si la <strong>estructura del DOM</strong>
        te ofrece una ruta más confiable.</p>
        <div class="code-tabs" data-code-id="L042-8">
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
                <pre><code class="language-python">def test_navegacion_dom(page: Page):
    """
    Alternativas basadas en estructura DOM, más robustas que layout.
    """
    page.goto("https://example.com/formulario")

    # --- Usando XPath para navegar al padre ---
    # Encontrar el div padre de un input específico
    # XPath: ir al input, subir al padre
    padre_email = page.locator("//input[@id='email']/..")
    expect(padre_email).to_have_class("form-group")

    # --- Usando locator("..") para subir al padre ---
    # Playwright permite ".." como selector para navegar al padre
    input_email = page.locator("#email")
    contenedor = input_email.locator("..")  # Elemento padre
    error = contenedor.locator(".error-message")
    expect(error).to_have_text("Campo requerido")

    # --- Hermanos: navegar al padre y luego al hermano ---
    label = page.locator("label[for='nombre']")
    # Subir al padre, luego bajar al input hermano
    input_hermano = label.locator("..").locator("input")
    input_hermano.fill("Carlos Felipe")

    # --- Usando CSS: selector de hermano adyacente ---
    # El + selecciona el hermano siguiente inmediato
    error_password = page.locator("#password + .error-message")
    expect(error_password).to_be_visible()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('navegacion DOM', async ({ page }) => {
    // Alternativas basadas en estructura DOM, más robustas que layout.
    await page.goto('https://example.com/formulario');

    // --- Usando XPath para navegar al padre ---
    const padreEmail = page.locator("//input[@id='email']/..");
    await expect(padreEmail).toHaveClass('form-group');

    // --- Usando locator("..") para subir al padre ---
    const inputEmail = page.locator('#email');
    const contenedor = inputEmail.locator('..');  // Elemento padre
    const error = contenedor.locator('.error-message');
    await expect(error).toHaveText('Campo requerido');

    // --- Hermanos: navegar al padre y luego al hermano ---
    const label = page.locator("label[for='nombre']");
    const inputHermano = label.locator('..').locator('input');
    await inputHermano.fill('Carlos Felipe');

    // --- Usando CSS: selector de hermano adyacente ---
    const errorPassword = page.locator('#password + .error-message');
    await expect(errorPassword).toBeVisible();
});</code></pre>
            </div>
        </div>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 locator("..") para navegar al padre</h4>
            <p>Playwright permite usar <code>".."</code> como selector en <code>locator()</code>
            para subir un nivel en el DOM. Esto es extremadamente útil para encontrar elementos
            hermanos sin recurrir a XPath completo.</p>
            <div class="code-tabs" data-code-id="L042-9">
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
                    <pre><code class="language-python"># Patrón: encontrar hermano via padre
input_campo = page.locator("#mi-input")
padre = input_campo.locator("..")           # Subir al padre
error_hermano = padre.locator(".error")     # Bajar al hermano
expect(error_hermano).to_have_text("Error")</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-typescript">// Patrón: encontrar hermano via padre
const inputCampo = page.locator('#mi-input');
const padre = inputCampo.locator('..');           // Subir al padre
const errorHermano = padre.locator('.error');      // Bajar al hermano
await expect(errorHermano).toHaveText('Error');</code></pre>
                </div>
            </div>
        </div>

        <h3>📊 Comparativa: DOM vs Layout</h3>
        <table style="width:100%; border-collapse: collapse;">
            <tr style="background: #1976d2; color: white;">
                <th style="padding: 8px; border: 1px solid #ddd;">Aspecto</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Basado en DOM</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Basado en Layout</th>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><strong>Velocidad</strong></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Rápido (búsqueda en DOM)</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Más lento (requiere render)</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><strong>Estabilidad</strong></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Alta (no depende del viewport)</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Variable (depende del viewport/CSS)</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><strong>Legibilidad</strong></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Requiere conocer estructura HTML</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Intuitivo: "el botón debajo del título"</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><strong>Resilencia a cambios CSS</strong></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Inmune a cambios de estilo</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Puede romperse si cambia el layout</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><strong>Resilencia a cambios DOM</strong></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Se rompe si cambia la estructura</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Sobrevive si la posición visual se mantiene</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><strong>Mejor para</strong></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Formularios, tablas, listas con buena semántica</td>
                <td style="padding: 6px; border: 1px solid #ddd;">UIs con CSS grid/flex, dashboards, componentes visuales</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><strong>Herramientas</strong></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>locator("..")</code>, XPath <code>parent::</code>, CSS <code>+</code>/<code>~</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>above()</code>, <code>below()</code>, <code>left_of()</code>, <code>right_of()</code>, <code>near()</code></td>
            </tr>
        </table>

        <h3>🧠 Cuándo usar layout vs navegación estructural</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Guía de decisión</h4>
            <p><strong>Usa localizadores de DOM cuando:</strong></p>
            <ul>
                <li>El HTML tiene buena semántica (labels con <code>for</code>, ARIA attributes)</li>
                <li>La relación padre-hijo es clara y estable</li>
                <li>Necesitas máxima velocidad y estabilidad</li>
                <li>Los tests deben funcionar en diferentes viewports</li>
            </ul>
            <p><strong>Usa localizadores de layout cuando:</strong></p>
            <ul>
                <li>El DOM no refleja la relación visual (elementos hermanos lejanos en el DOM pero cercanos visualmente)</li>
                <li>El HTML no tiene IDs, clases ni atributos útiles</li>
                <li>Quieres que el test refleje el comportamiento visual del usuario</li>
                <li>Trabajas con componentes de terceros donde no controlas la estructura</li>
            </ul>
            <p><strong>Regla general:</strong> Intenta primero con localizadores semánticos (<code>get_by_role</code>,
            <code>get_by_label</code>), luego DOM, y recurre a layout solo como última opción.</p>
        </div>

        <h3>🏥 Ejemplo completo: Validación de formulario</h3>
        <p>Encontrar mensajes de error relativos a los campos de un formulario de registro.</p>
        <div class="code-tabs" data-code-id="L042-10">
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
                <pre><code class="language-python">"""
Ejemplo completo: validación de formulario.
Encontrar mensajes de error relativos a cada campo input.
"""
from playwright.sync_api import Page, expect


def test_validacion_formulario_layout(page: Page):
    """
    Formulario de registro con esta disposición:

    +---------------------------------------+
    |  Nombre: [_______________]            |
    |  [El nombre es obligatorio]  ← error  |
    |                                       |
    |  Email:  [_______________]            |
    |  [Ingrese un email válido]   ← error  |
    |                                       |
    |  Password: [_____________]            |
    |  [Mínimo 8 caracteres]      ← error  |
    |                                       |
    |          [Registrarse]                |
    +---------------------------------------+
    """
    page.goto("https://example.com/registro")

    # Enviar el formulario vacío para forzar errores
    page.get_by_role("button", name="Registrarse").click()

    # --- Verificar error del campo nombre usando layout ---
    campo_nombre = page.locator("#nombre")
    error_nombre = (
        page.locator(".error-message")
        .below(campo_nombre)
        .first
    )
    expect(error_nombre).to_have_text("El nombre es obligatorio")

    # --- Verificar error del campo email usando layout ---
    campo_email = page.locator("#email")
    error_email = (
        page.locator(".error-message")
        .below(campo_email)
        .first
    )
    expect(error_email).to_have_text("Ingrese un email válido")

    # --- Verificar error del campo password usando layout ---
    campo_password = page.locator("#password")
    error_password = (
        page.locator(".error-message")
        .below(campo_password)
        .first
    )
    expect(error_password).to_have_text("Mínimo 8 caracteres")

    # --- Corregir y verificar que los errores desaparecen ---
    campo_nombre.fill("Juan Reina")
    campo_email.fill("juan@siesa.com")
    campo_password.fill("Password123!")

    page.get_by_role("button", name="Registrarse").click()

    # Verificar que ya no hay errores visibles
    errores = page.locator(".error-message")
    expect(errores).to_have_count(0)


def test_formulario_alternativa_dom(page: Page):
    """
    Misma validación pero usando navegación DOM (más robusta).
    Comparar ambos enfoques para elegir el mejor en cada caso.
    """
    page.goto("https://example.com/registro")
    page.get_by_role("button", name="Registrarse").click()

    # Usando ".." para subir al padre y encontrar el error hermano
    error_nombre = (
        page.locator("#nombre")
        .locator("..")
        .locator(".error-message")
    )
    expect(error_nombre).to_have_text("El nombre es obligatorio")

    # Usando CSS sibling selector
    error_email = page.locator("#email ~ .error-message")
    expect(error_email).to_have_text("Ingrese un email válido")

    # Usando filter con el form-group padre
    grupo_password = (
        page.locator(".form-group")
        .filter(has=page.locator("#password"))
    )
    error_password = grupo_password.locator(".error-message")
    expect(error_password).to_have_text("Mínimo 8 caracteres")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('validacion formulario layout', async ({ page }) => {
    await page.goto('https://example.com/registro');

    // Enviar el formulario vacío para forzar errores
    await page.getByRole('button', { name: 'Registrarse' }).click();

    // --- Verificar error del campo nombre usando layout ---
    const campoNombre = page.locator('#nombre');
    const errorNombre = page.locator('.error-message')
        .below(campoNombre).first();
    await expect(errorNombre).toHaveText('El nombre es obligatorio');

    // --- Verificar error del campo email usando layout ---
    const campoEmail = page.locator('#email');
    const errorEmail = page.locator('.error-message')
        .below(campoEmail).first();
    await expect(errorEmail).toHaveText('Ingrese un email válido');

    // --- Verificar error del campo password usando layout ---
    const campoPassword = page.locator('#password');
    const errorPassword = page.locator('.error-message')
        .below(campoPassword).first();
    await expect(errorPassword).toHaveText('Mínimo 8 caracteres');

    // --- Corregir y verificar que los errores desaparecen ---
    await campoNombre.fill('Juan Reina');
    await campoEmail.fill('juan@siesa.com');
    await campoPassword.fill('Password123!');

    await page.getByRole('button', { name: 'Registrarse' }).click();

    const errores = page.locator('.error-message');
    await expect(errores).toHaveCount(0);
});

test('formulario alternativa DOM', async ({ page }) => {
    await page.goto('https://example.com/registro');
    await page.getByRole('button', { name: 'Registrarse' }).click();

    // Usando ".." para subir al padre y encontrar el error hermano
    const errorNombre = page.locator('#nombre')
        .locator('..')
        .locator('.error-message');
    await expect(errorNombre).toHaveText('El nombre es obligatorio');

    // Usando CSS sibling selector
    const errorEmail = page.locator('#email ~ .error-message');
    await expect(errorEmail).toHaveText('Ingrese un email válido');

    // Usando filter con el form-group padre
    const grupoPassword = page.locator('.form-group')
        .filter({ has: page.locator('#password') });
    const errorPassword = grupoPassword.locator('.error-message');
    await expect(errorPassword).toHaveText('Mínimo 8 caracteres');
});</code></pre>
            </div>
        </div>

        <h3>🎯 Ejercicio</h3>
        <p>Practica los localizadores de layout con el siguiente ejercicio basado en un dashboard:</p>
        <ol>
            <li>Navega a <code>https://the-internet.herokuapp.com/challenging_dom</code></li>
            <li>Localiza la tabla y usa <code>page.locator("table")</code> como referencia</li>
            <li>Encuentra los botones que están <code>above()</code> de la tabla</li>
            <li>Verifica que hay 3 botones encima de la tabla con <code>count()</code></li>
            <li>Encuentra el canvas que está <code>below()</code> de la tabla</li>
            <li>Practica la alternativa DOM: usa <code>locator("..")</code> desde una celda para subir al <code>&lt;tr&gt;</code> padre</li>
            <li>Combina layout y filtrado: encuentra el botón con clase <code>"button"</code> que está arriba de la tabla y contiene texto "foo"</li>
            <li><strong>Bonus:</strong> Compara el rendimiento de ambos enfoques ejecutando con <code>--headed --slowmo=200</code></li>
        </ol>
        <div class="code-tabs" data-code-id="L042-11">
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
                <pre><code class="language-python"># Solución del ejercicio
from playwright.sync_api import Page, expect


def test_dashboard_layout(page: Page):
    page.goto("https://the-internet.herokuapp.com/challenging_dom")

    # Referencia: la tabla
    tabla = page.locator("table")
    expect(tabla).to_be_visible()

    # Botones arriba de la tabla
    botones_arriba = page.locator("a.button").above(tabla)
    print(f"Botones arriba de la tabla: {botones_arriba.count()}")

    # Canvas debajo de la tabla
    canvas = page.locator("canvas").below(tabla)
    expect(canvas).to_be_visible()

    # Alternativa DOM: desde una celda, subir al tr padre
    primera_celda = page.locator("table tbody tr td").first
    fila_padre = primera_celda.locator("..")  # sube al <td> → <tr>
    celdas_fila = fila_padre.locator("td")
    print(f"Celdas en la fila: {celdas_fila.count()}")

    # Layout + filtrado: botón "foo" arriba de la tabla
    boton_foo = (
        page.locator("a.button")
        .above(tabla)
        .filter(has_text="foo")
    )
    # Nota: el texto exacto puede variar en the-internet.
    # Verifica visualmente con --headed

    # Imprimir todos los textos de botones para debug
    for boton in page.locator("a.button").above(tabla).all():
        print(f"  Botón: '{boton.text_content().strip()}'")


def test_dashboard_dom_alternativo(page: Page):
    """Misma interacción usando solo navegación DOM."""
    page.goto("https://the-internet.herokuapp.com/challenging_dom")

    # Los botones están en un div antes de la tabla
    contenedor = page.locator(".large-2.columns")
    botones = contenedor.locator("a.button")
    print(f"Botones (via DOM): {botones.count()}")

    # Tabla: obtener datos de la primera fila
    primera_fila = page.locator("table tbody tr").first
    valores = primera_fila.locator("td").all_text_contents()
    print(f"Primera fila: {valores}")

    # Canvas
    canvas = page.locator("#canvas canvas")
    expect(canvas).to_be_visible()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('dashboard layout', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/challenging_dom');

    // Referencia: la tabla
    const tabla = page.locator('table');
    await expect(tabla).toBeVisible();

    // Botones arriba de la tabla
    const botonesArriba = page.locator('a.button').above(tabla);
    console.log(\`Botones arriba de la tabla: \${await botonesArriba.count()}\`);

    // Canvas debajo de la tabla
    const canvas = page.locator('canvas').below(tabla);
    await expect(canvas).toBeVisible();

    // Alternativa DOM: desde una celda, subir al tr padre
    const primeraCelda = page.locator('table tbody tr td').first();
    const filaPadre = primeraCelda.locator('..');
    const celdasFila = filaPadre.locator('td');
    console.log(\`Celdas en la fila: \${await celdasFila.count()}\`);

    // Layout + filtrado: botón "foo" arriba de la tabla
    const botonFoo = page.locator('a.button')
        .above(tabla)
        .filter({ hasText: 'foo' });

    // Imprimir todos los textos de botones para debug
    for (const boton of await page.locator('a.button').above(tabla).all()) {
        console.log(\`  Botón: '\${(await boton.textContent())?.trim()}'\`);
    }
});

test('dashboard DOM alternativo', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/challenging_dom');

    // Los botones están en un div antes de la tabla
    const contenedor = page.locator('.large-2.columns');
    const botones = contenedor.locator('a.button');
    console.log(\`Botones (via DOM): \${await botones.count()}\`);

    // Tabla: obtener datos de la primera fila
    const primeraFila = page.locator('table tbody tr').first();
    const valores = await primeraFila.locator('td').allTextContents();
    console.log(\`Primera fila: \${valores}\`);

    // Canvas
    const canvas = page.locator('#canvas canvas');
    await expect(canvas).toBeVisible();
});</code></pre>
            </div>
        </div>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Entender el concepto de localización por relación espacial/visual</li>
                <li>Usar <code>above()</code>, <code>below()</code>, <code>left_of()</code>, <code>right_of()</code> y <code>near()</code></li>
                <li>Combinar localizadores de layout con filtrado y encadenamiento</li>
                <li>Conocer las limitaciones: dependencia del viewport, rendimiento, elementos ocultos</li>
                <li>Usar <code>locator("..")</code> para navegar al padre como alternativa DOM</li>
                <li>Comparar enfoques DOM vs layout y elegir el apropiado según el contexto</li>
                <li>Aplicar la regla: semántico primero, luego DOM, layout como último recurso</li>
            </ul>
        </div>
    `,
    topics: ["relativos", "layout", "locators"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_042 = LESSON_042;
}
