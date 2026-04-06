/**
 * Playwright Academy - Leccion 038
 * CSS Selectors en Playwright
 * Seccion 5: Localizadores y Selectores
 */

const LESSON_038 = {
    id: 38,
    title: "CSS Selectors en Playwright",
    duration: "5 min",
    level: "beginner",
    section: "section-05",
    content: `
        <h2>🎨 CSS Selectors en Playwright</h2>
        <p>Aunque los localizadores built-in son la opción preferida, hay situaciones donde necesitas
        la precisión y flexibilidad de los <strong>selectores CSS</strong>. Playwright extiende los selectores
        CSS estándar con capacidades adicionales muy útiles para testing.</p>

        <h3>📋 Fundamentos de selectores CSS</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Los selectores CSS identifican elementos del DOM usando patrones basados en etiquetas,
            clases, IDs y atributos. En Playwright se usan con <code>page.locator("selector")</code>.</p>
        </div>

        <h4>Selectores básicos</h4>
        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #bbdefb;">
                <th style="padding: 8px; border: 1px solid #ddd;">Selector</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Descripción</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo</th>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>tag</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Por nombre de etiqueta HTML</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>page.locator("button")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>.clase</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Por clase CSS</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>page.locator(".btn-primary")</code></td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>#id</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Por ID único</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>page.locator("#formulario-login")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>[atributo]</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Por presencia de atributo</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>page.locator("[required]")</code></td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>tag.clase</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Combinar etiqueta y clase</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>page.locator("input.form-control")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>.clase1.clase2</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Múltiples clases (AND)</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>page.locator(".btn.btn-danger")</code></td>
            </tr>
        </table>

        <pre><code class="python"># Selectores básicos en acción
from playwright.sync_api import Page, expect

def test_selectores_basicos(page: Page):
    page.goto("https://mi-app.com")

    # Por etiqueta
    page.locator("h1")

    # Por clase
    page.locator(".alerta-exito")

    # Por ID
    page.locator("#nombre-usuario")

    # Combinar etiqueta + clase
    page.locator("button.btn-enviar")

    # Múltiples clases
    page.locator(".card.card-destacada")</code></pre>

        <h3>🔗 Combinadores CSS</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Los combinadores definen la <strong>relación jerárquica</strong> entre elementos en el DOM.
            Son esenciales para navegar estructuras complejas.</p>
        </div>

        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #c8e6c9;">
                <th style="padding: 8px; border: 1px solid #ddd;">Combinador</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Símbolo</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Descripción</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo</th>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">Descendiente</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>(espacio)</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Cualquier hijo/nieto/etc.</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>"form input"</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;">Hijo directo</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>></code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Solo hijo inmediato</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>"ul > li"</code></td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">Hermano adyacente</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>+</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Siguiente hermano inmediato</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>"h2 + p"</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;">Hermano general</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>~</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Cualquier hermano posterior</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>"h2 ~ p"</code></td>
            </tr>
        </table>

        <pre><code class="python"># Combinadores en acción
def test_combinadores(page: Page):
    page.goto("https://mi-app.com/productos")

    # Descendiente: cualquier input dentro de un form
    page.locator("form input").first.fill("dato")

    # Hijo directo: solo los li inmediatos de un ul
    items = page.locator("ul.menu > li")
    expect(items).to_have_count(5)

    # Hermano adyacente: el párrafo justo después de un h2
    descripcion = page.locator("h2 + p")

    # Hermano general: todos los párrafos después de un h2
    parrafos = page.locator("h2 ~ p")</code></pre>

        <h3>🏷️ Selectores de atributos</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Los selectores de atributos permiten buscar elementos por sus atributos HTML
            con diferentes tipos de coincidencia:</p>
        </div>

        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #ffe0b2;">
                <th style="padding: 8px; border: 1px solid #ddd;">Selector</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Coincidencia</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Encuentra</th>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>[attr=valor]</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Exacta</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>[type="email"]</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">type es exactamente "email"</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>[attr*=valor]</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Contiene</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>[class*="btn"]</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">class contiene "btn" en cualquier posición</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>[attr^=valor]</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Empieza con</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>[href^="https"]</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">href empieza con "https"</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>[attr$=valor]</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Termina con</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>[href$=".pdf"]</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">href termina con ".pdf"</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>[attr~=valor]</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Palabra exacta en lista</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>[class~="activo"]</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">class contiene la palabra "activo" (separada por espacios)</td>
            </tr>
        </table>

        <pre><code class="python"># Selectores de atributos en Playwright
def test_selectores_atributos(page: Page):
    page.goto("https://mi-app.com/formulario")

    # Exacto: input de tipo email
    page.locator("input[type='email']").fill("correo@test.com")

    # Contiene: todos los elementos con clase que incluya "error"
    errores = page.locator("[class*='error']")

    # Empieza con: links externos (https)
    links_externos = page.locator("a[href^='https://']")

    # Termina con: links a documentos PDF
    links_pdf = page.locator("a[href$='.pdf']")

    # Múltiples atributos combinados
    page.locator("input[type='text'][name='ciudad']").fill("Cali")

    # Atributo data personalizado
    page.locator("[data-status='pendiente']")</code></pre>

        <h3>🎭 Pseudo-clases útiles para testing</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Las pseudo-clases filtran elementos por su <strong>estado o posición</strong> en el DOM.
            Playwright soporta tanto las pseudo-clases estándar como algunas propias.</p>
        </div>

        <h4>Pseudo-clases estándar</h4>
        <pre><code class="python"># :first-child / :last-child — primer o último hijo
page.locator("ul > li:first-child")   # Primer item de la lista
page.locator("ul > li:last-child")    # Último item

# :nth-child(n) — por posición (1-indexado)
page.locator("tr:nth-child(2)")       # Segunda fila de tabla
page.locator("li:nth-child(odd)")     # Items impares (1, 3, 5...)
page.locator("li:nth-child(even)")    # Items pares (2, 4, 6...)
page.locator("li:nth-child(3n)")      # Cada tercer item

# :not() — negación
page.locator("input:not([disabled])")          # Inputs habilitados
page.locator("button:not(.btn-secondary)")     # Botones que NO son secondary

# :enabled / :disabled — estado de formularios
page.locator("input:enabled")
page.locator("button:disabled")</code></pre>

        <h4>Extensiones CSS de Playwright</h4>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Playwright agrega pseudo-clases propias que no existen en CSS estándar,
            pensadas específicamente para facilitar la automatización de tests:</p>
        </div>

        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #bbdefb;">
                <th style="padding: 8px; border: 1px solid #ddd;">Extensión</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Descripción</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo</th>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>:has-text("...")</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Elementos que contienen el texto (en sí mismos o sus hijos)</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>page.locator("div:has-text('Error')")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>:text("...")</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Elemento más pequeño que contiene el texto</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>page.locator(":text('Guardar')")</code></td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>:has(selector)</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Padres que contienen un hijo que coincide</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>page.locator("div:has(img.avatar)")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>:is(s1, s2)</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Coincide con cualquiera de los selectores</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>page.locator(":is(h1, h2, h3)")</code></td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>:visible</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Solo elementos visibles</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>page.locator(".modal:visible")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>>></code> (chaining)</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Encadena motores de selección diferentes</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>page.locator("div.card >> text=Comprar")</code></td>
            </tr>
        </table>

        <pre><code class="python"># Extensiones CSS de Playwright en acción
def test_extensiones_playwright(page: Page):
    page.goto("https://mi-app.com/catalogo")

    # :has-text() — div que contiene texto "Agotado"
    productos_agotados = page.locator(".producto:has-text('Agotado')")

    # :text() — el elemento más específico con el texto
    page.locator(":text('Agregar al carrito')").click()

    # :has() — tarjetas que tienen una imagen con clase "oferta"
    tarjetas_oferta = page.locator(".card:has(.badge-oferta)")
    expect(tarjetas_oferta.first).to_be_visible()

    # :is() — cualquier heading
    headings = page.locator(":is(h1, h2, h3)")

    # :visible — solo modales visibles
    page.locator(".modal:visible").locator("button").click()

    # >> (chaining) — encadenar CSS con texto
    page.locator("article.destacado >> text=Leer más").click()</code></pre>

        <h3>🔢 :nth-match() para múltiples coincidencias</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Cuando un selector coincide con varios elementos y necesitas uno específico,
            <code>:nth-match()</code> selecciona por posición global (no relativa al padre como <code>:nth-child</code>).</p>
        </div>

        <pre><code class="python"># :nth-match(selector, n) — selecciona la n-ésima coincidencia global
def test_nth_match(page: Page):
    page.goto("https://mi-app.com/dashboard")

    # El tercer botón "Editar" de toda la página
    page.locator(":nth-match(button:has-text('Editar'), 3)").click()

    # El segundo link con clase "ver-detalle"
    page.locator(":nth-match(.ver-detalle, 2)").click()

    # Alternativa: usar .nth() de Playwright (0-indexado)
    page.locator("button:has-text('Editar')").nth(2).click()  # Tercero (0-indexed)</code></pre>

        <h3>🔧 Combinando selectores para mayor precisión</h3>
        <pre><code class="python"># Combinaciones poderosas para escenarios reales
def test_selectores_combinados(page: Page):
    page.goto("https://mi-app.com/admin/usuarios")

    # Tabla: celda específica por fila y columna
    page.locator("table.usuarios tr:nth-child(3) td:nth-child(2)")

    # Botón dentro de una fila que contiene texto específico
    page.locator("tr:has-text('Juan Reina') button.btn-editar").click()

    # Input dentro de un fieldset específico
    page.locator("fieldset:has(legend:text('Datos personales')) input[name='email']")

    # Link visible dentro de un nav con clase activa
    page.locator("nav.sidebar li.active > a:visible")

    # Formulario con atributo data + input deshabilitado dentro
    page.locator("form[data-section='facturacion'] input:disabled")</code></pre>

        <h3>⚡ Rendimiento de selectores CSS</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #c8e6c9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Velocidad</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Tipo de selector</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">🟢 Más rápido</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">ID</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>#mi-boton</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">🟢 Rápido</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Clase</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>.btn-primary</code></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">🟡 Normal</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Etiqueta + Clase</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>button.submit</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">🟡 Normal</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Atributo</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>[data-testid="x"]</code></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">🟠 Lento</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Descendientes profundos</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>div div div span a</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">🔴 Más lento</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Universal con pseudo-clases</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>*:has-text("x")</code></td>
                </tr>
            </table>
        </div>

        <h3>⚠️ Anti-patrones comunes</h3>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🚫 Selectores frágiles que debes evitar</h4>
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #ffcdd2;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Anti-patrón</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo malo</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Mejor alternativa</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Anidamiento excesivo</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>div > div > div > ul > li > a</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>page.get_by_role("link", name="...")</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Clases auto-generadas</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>.css-1a2b3c4d</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>[data-testid="..."]</code></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Posiciones absolutas</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>tr:nth-child(5) td:nth-child(3)</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>tr:has-text("Juan") td:nth-child(3)</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">IDs dinámicos</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>#ember-457</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>[data-testid="nombre-campo"]</code></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Selector universal</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>* > .contenido</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>.contenido</code></td>
                </tr>
            </table>
        </div>

        <pre><code class="python"># ❌ MAL — selector frágil, depende de la estructura exacta
page.locator("body > div:nth-child(2) > main > section > div > form > div:nth-child(3) > input")

# ✅ BIEN — selector semántico y estable
page.locator("form[name='registro'] input[name='email']")

# ❌ MAL — clase auto-generada que cambia en cada build
page.locator(".MuiButton-root.css-1abc234")

# ✅ BIEN — atributo estable
page.locator("button[data-testid='btn-enviar']")

# ❌ MAL — depende de posición exacta en la tabla
page.locator("table tr:nth-child(7) td:nth-child(2) a")

# ✅ BIEN — usa contenido para encontrar la fila
page.locator("tr:has-text('Factura #1234') a")</code></pre>

        <h3>📊 Tabla resumen de patrones CSS</h3>
        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #0277bd; color: white;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Necesidad</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Patrón CSS</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo en Playwright</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Elemento por ID</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>#id</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>page.locator("#login-form")</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Input por tipo</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>input[type="x"]</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>page.locator("input[type='password']")</code></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Hijo directo</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>padre > hijo</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>page.locator("nav > a.activo")</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Fila con texto</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>tr:has-text("x")</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>page.locator("tr:has-text('Admin')")</code></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Padre que contiene hijo</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>padre:has(hijo)</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>page.locator("li:has(.badge)")</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Excluir elementos</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>:not(selector)</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>page.locator("button:not(:disabled)")</code></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Links a archivos</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>[href$=".ext"]</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>page.locator("a[href$='.xlsx']")</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">N-ésima coincidencia</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>:nth-match(sel, n)</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>page.locator(":nth-match(.card, 2)")</code></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Encadenar motores</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>css >> text</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>page.locator(".sidebar >> text=Config")</code></td>
                </tr>
            </table>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Reto:</strong> Escribe selectores CSS para localizar cada elemento descrito.
            Usa la combinación más precisa y resiliente posible.</p>
        </div>

        <pre><code class="python"># Página HTML de referencia:
# <nav class="main-nav">
#   <a href="/" class="logo">Inicio</a>
#   <a href="/productos" class="active">Productos</a>
#   <a href="/contacto">Contacto</a>
# </nav>
# <main>
#   <section class="filtros">
#     <input type="text" name="buscar" placeholder="Buscar...">
#     <select name="categoria">
#       <option>Todas</option>
#       <option>Electrónica</option>
#     </select>
#     <button class="btn btn-filtrar" disabled>Filtrar</button>
#   </section>
#   <table class="tabla-productos">
#     <thead>
#       <tr><th>Nombre</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr>
#     </thead>
#     <tbody>
#       <tr data-status="disponible">
#         <td>Laptop HP</td><td>$2,500</td><td>15</td>
#         <td><button class="btn-comprar">Comprar</button></td>
#       </tr>
#       <tr data-status="agotado">
#         <td>Monitor LG</td><td>$800</td><td>0</td>
#         <td><button class="btn-comprar" disabled>Agotado</button></td>
#       </tr>
#       <tr data-status="disponible">
#         <td>Teclado Mecánico</td><td>$150</td><td>42</td>
#         <td><button class="btn-comprar">Comprar</button></td>
#       </tr>
#     </tbody>
#   </table>
# </main>

from playwright.sync_api import Page, expect

def test_selectores_css_avanzados(page: Page):
    page.goto("/productos")

    # 1. Link activo del nav
    page.locator("nav.main-nav a.active")

    # 2. Input de búsqueda por nombre
    page.locator("input[name='buscar']").fill("laptop")

    # 3. Botón de filtrar deshabilitado
    page.locator("button.btn-filtrar:disabled")

    # 4. Todas las filas de productos disponibles
    filas_disponibles = page.locator("tr[data-status='disponible']")
    expect(filas_disponibles).to_have_count(2)

    # 5. Fila del producto agotado
    page.locator("tr[data-status='agotado']")

    # 6. Botón "Comprar" de la fila "Laptop HP"
    page.locator("tr:has-text('Laptop HP') .btn-comprar").click()

    # 7. Todos los botones habilitados de comprar
    botones_activos = page.locator(".btn-comprar:not(:disabled)")
    expect(botones_activos).to_have_count(2)

    # 8. Primera celda de la última fila del tbody
    page.locator("tbody tr:last-child td:first-child")

    # 9. Headers de la tabla
    headers = page.locator(".tabla-productos thead th")
    expect(headers).to_have_count(4)

    # 10. Select de categoría por su nombre
    page.locator("select[name='categoria']").select_option("Electrónica")</code></pre>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Dominar selectores CSS básicos: etiqueta, clase, ID, atributo</li>
                <li>Usar combinadores: descendiente, hijo directo, hermano adyacente y general</li>
                <li>Aplicar selectores de atributo con diferentes tipos de coincidencia</li>
                <li>Utilizar las extensiones CSS de Playwright: <code>:has-text()</code>, <code>:text()</code>, <code>:has()</code>, <code>:visible</code>, <code>>></code></li>
                <li>Identificar y evitar anti-patrones de selectores frágiles</li>
                <li>Escribir selectores CSS precisos y resilientes para escenarios reales</li>
            </ul>
        </div>

        <h3>🚀 Siguiente: XPath cuando es necesario</h3>
        <p>En la siguiente lección aprenderás cuándo y cómo usar XPath en Playwright,
        un lenguaje de consulta más potente pero que debe usarse con moderación.</p>
    `,
    topics: ["css", "selectores"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_038 = LESSON_038;
}
