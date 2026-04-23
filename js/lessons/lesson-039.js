/**
 * Playwright Academy - Lección 039
 * XPath cuando es necesario
 * Sección 5: Localizadores y Selectores
 */

const LESSON_039 = {
    id: 39,
    title: "XPath cuando es necesario",
    duration: "5 min",
    level: "beginner",
    section: "section-05",
    content: `
        <h2>🧭 XPath cuando es necesario</h2>
        <p>XPath (XML Path Language) es un lenguaje poderoso para navegar el DOM. Aunque Playwright
        ofrece localizadores built-in y CSS selectores que cubren la mayoría de casos, <strong>XPath
        sigue siendo indispensable</strong> en ciertos escenarios complejos. En esta lección aprenderás
        cuándo usarlo, cómo escribir expresiones XPath efectivas y — igual de importante — cuándo
        <em>no</em> usarlo.</p>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚠️ Regla de oro</h4>
            <p>Usa XPath <strong>solo cuando los localizadores built-in de Playwright y CSS no pueden
            resolver el caso</strong>. El orden de preferencia recomendado es:</p>
            <ol>
                <li><code>get_by_role()</code>, <code>get_by_text()</code>, <code>get_by_label()</code> — Siempre primero</li>
                <li>CSS selectors — Para la mayoría de selecciones por estructura/atributos</li>
                <li>XPath — Solo cuando necesitas navegar hacia arriba en el DOM o condiciones complejas de texto</li>
            </ol>
        </div>

        <h3>🤔 ¿Cuándo SÍ usar XPath?</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #c8e6c9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Escenario</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">¿Por qué XPath?</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">Navegar hacia el padre</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">CSS no puede seleccionar padres</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>//span[text()='Error']/parent::div</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">Buscar por texto parcial</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Combinaciones complejas de texto</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>//td[contains(text(), 'Total')]</code></td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">Hermanos precedentes</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">CSS solo soporta hermanos siguientes</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>//td/preceding-sibling::td[1]</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">Ancestros lejanos</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Subir múltiples niveles en el DOM</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>//input[@id='email']/ancestor::form</code></td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">Condiciones múltiples de texto</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Combinar texto con atributos</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>//div[contains(@class,'card') and .//span[text()='Activo']]</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">Posición relativa a otro elemento</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">following/preceding en contexto</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>//label[text()='Nombre']/following::input[1]</code></td>
                </tr>
            </table>
        </div>

        <h3>📚 Fundamentos de XPath</h3>
        <p>XPath usa una sintaxis similar a rutas de archivos para navegar el árbol de nodos del DOM.</p>

        <h4>Selectores básicos</h4>
        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #e3f2fd;">
                <th style="padding: 8px; border: 1px solid #ddd;">Sintaxis</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Significado</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo</th>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>//</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Buscar en cualquier posición del documento</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>//div</code> — Todos los &lt;div&gt;</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>/</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Hijo directo (ruta absoluta)</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>/html/body</code> — Body directo de html</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>.</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Nodo actual (contexto)</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>./span</code> — Span hijo del nodo actual</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>..</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Nodo padre</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>//span[@class='icon']/..</code> — Padre del span</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>@</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Atributo del elemento</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>//input[@type='text']</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>text()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Contenido de texto del nodo</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>//button[text()='Enviar']</code></td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>contains()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Contiene un substring</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>//div[contains(@class, 'error')]</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>starts-with()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Comienza con un substring</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>//input[starts-with(@id, 'field_')]</code></td>
            </tr>
        </table>

        <div class="code-tabs" data-code-id="L039-1">
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

def test_xpath_basicos(page: Page):
    page.goto("https://the-internet.herokuapp.com/tables")

    # Buscar en cualquier posición
    tabla = page.locator("//table[@id='table1']")

    # Atributo exacto
    header = page.locator("//th[text()='Last Name']")

    # Texto parcial con contains
    celda = page.locator("//td[contains(text(), 'Smith')]")

    # Hijo directo vs descendiente
    # // busca en cualquier profundidad
    todos_los_td = page.locator("//table[@id='table1']//td")
    # / busca solo hijos directos
    tbody = page.locator("//table[@id='table1']/tbody")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('xpath básicos', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/tables');

    // Buscar en cualquier posición
    const tabla = page.locator("//table[@id='table1']");

    // Atributo exacto
    const header = page.locator("//th[text()='Last Name']");

    // Texto parcial con contains
    const celda = page.locator("//td[contains(text(), 'Smith')]");

    // Hijo directo vs descendiente
    // // busca en cualquier profundidad
    const todosLosTd = page.locator("//table[@id='table1']//td");
    // / busca solo hijos directos
    const tbody = page.locator("//table[@id='table1']/tbody");
});</code></pre>
            </div>
        </div>

        <h3>🌳 Ejes XPath (Axes)</h3>
        <p>Los ejes son la característica más poderosa de XPath. Permiten navegar en
        <strong>cualquier dirección</strong> dentro del DOM, algo que CSS no puede hacer.</p>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #ce93d8;">
                    <th style="padding: 8px; border: 1px solid #ddd; color: white;">Eje</th>
                    <th style="padding: 8px; border: 1px solid #ddd; color: white;">Dirección</th>
                    <th style="padding: 8px; border: 1px solid #ddd; color: white;">Ejemplo</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>parent::</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Nodo padre directo</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>//span/parent::div</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>child::</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Hijos directos</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>//ul/child::li</code></td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>ancestor::</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Todos los ancestros (padre, abuelo...)</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>//input/ancestor::form</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>descendant::</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Todos los descendientes (hijos, nietos...)</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>//form/descendant::input</code></td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>following-sibling::</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Hermanos siguientes (después)</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>//th[text()='Nombre']/following-sibling::th</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>preceding-sibling::</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Hermanos anteriores (antes)</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>//td[text()='$50.00']/preceding-sibling::td[1]</code></td>
                </tr>
            </table>
        </div>

        <div class="code-tabs" data-code-id="L039-2">
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
                <pre><code class="language-python">def test_xpath_ejes(page: Page):
    page.goto("https://the-internet.herokuapp.com/tables")

    # parent:: — Encontrar el padre de un elemento conocido
    # "¿En qué fila está la celda que dice 'jdoe@hotmail.com'?"
    fila_john = page.locator("//td[text()='jdoe@hotmail.com']/parent::tr")

    # ancestor:: — Subir múltiples niveles
    # "¿A qué tabla pertenece esta celda?"
    tabla_de_celda = page.locator("//td[text()='jdoe@hotmail.com']/ancestor::table")

    # following-sibling:: — Hermano siguiente
    # "¿Cuál es la celda a la derecha de 'Last Name' en la misma fila?"
    celda_siguiente = page.locator(
        "//td[text()='Doe']/following-sibling::td[1]"
    )

    # preceding-sibling:: — Hermano anterior
    # "¿Cuál es la celda a la izquierda del email?"
    celda_anterior = page.locator(
        "//td[text()='jdoe@hotmail.com']/preceding-sibling::td[1]"
    )

    # descendant:: — Todos los inputs dentro de un formulario
    # (equivalente a //form//input pero más explícito)
    inputs = page.locator("//form/descendant::input")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('xpath ejes', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/tables');

    // parent:: — Encontrar el padre de un elemento conocido
    // "¿En qué fila está la celda que dice 'jdoe@hotmail.com'?"
    const filaJohn = page.locator("//td[text()='jdoe@hotmail.com']/parent::tr");

    // ancestor:: — Subir múltiples niveles
    // "¿A qué tabla pertenece esta celda?"
    const tablaDeCelda = page.locator("//td[text()='jdoe@hotmail.com']/ancestor::table");

    // following-sibling:: — Hermano siguiente
    // "¿Cuál es la celda a la derecha de 'Last Name' en la misma fila?"
    const celdaSiguiente = page.locator(
        "//td[text()='Doe']/following-sibling::td[1]"
    );

    // preceding-sibling:: — Hermano anterior
    // "¿Cuál es la celda a la izquierda del email?"
    const celdaAnterior = page.locator(
        "//td[text()='jdoe@hotmail.com']/preceding-sibling::td[1]"
    );

    // descendant:: — Todos los inputs dentro de un formulario
    // (equivalente a //form//input pero más explícito)
    const inputs = page.locator('//form/descendant::input');
});</code></pre>
            </div>
        </div>

        <h3>🔍 Predicados XPath</h3>
        <p>Los predicados (entre corchetes <code>[]</code>) filtran los nodos seleccionados por
        posición, atributos o condiciones booleanas.</p>

        <div class="code-tabs" data-code-id="L039-3">
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
                <pre><code class="language-python">def test_xpath_predicados(page: Page):
    page.goto("https://the-internet.herokuapp.com/tables")

    # --- Predicados de posición ---
    # Primera fila del tbody
    primera_fila = page.locator("//table[@id='table1']/tbody/tr[1]")

    # Última fila
    ultima_fila = page.locator("//table[@id='table1']/tbody/tr[last()]")

    # Penúltima fila
    penultima = page.locator("//table[@id='table1']/tbody/tr[last()-1]")

    # Primeras 2 filas
    primeras_dos = page.locator("//table[@id='table1']/tbody/tr[position() <= 2]")

    # --- Predicados de atributo ---
    # Atributo exacto
    tabla = page.locator("//table[@id='table1']")

    # Atributo parcial con contains
    celdas_edit = page.locator("//td[contains(@class, 'edit')]")

    # Múltiples condiciones con and/or
    input_texto = page.locator("//input[@type='text' and @name='username']")
    input_visible = page.locator(
        "//input[@type='text' or @type='email']"
    )

    # Negación con not()
    no_hidden = page.locator("//input[not(@type='hidden')]")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('xpath predicados', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/tables');

    // --- Predicados de posición ---
    // Primera fila del tbody
    const primeraFila = page.locator("//table[@id='table1']/tbody/tr[1]");

    // Última fila
    const ultimaFila = page.locator("//table[@id='table1']/tbody/tr[last()]");

    // Penúltima fila
    const penultima = page.locator("//table[@id='table1']/tbody/tr[last()-1]");

    // Primeras 2 filas
    const primerasDos = page.locator("//table[@id='table1']/tbody/tr[position() <= 2]");

    // --- Predicados de atributo ---
    // Atributo exacto
    const tabla = page.locator("//table[@id='table1']");

    // Atributo parcial con contains
    const celdasEdit = page.locator("//td[contains(@class, 'edit')]");

    // Múltiples condiciones con and/or
    const inputTexto = page.locator("//input[@type='text' and @name='username']");
    const inputVisible = page.locator(
        "//input[@type='text' or @type='email']"
    );

    // Negación con not()
    const noHidden = page.locator("//input[not(@type='hidden')]");
});</code></pre>
            </div>
        </div>

        <h3>⚡ Funciones XPath útiles para testing</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Función</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripción</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>text()</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Texto directo del nodo</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>//button[text()='Submit']</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>contains()</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Substring match</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>//div[contains(text(), 'Error')]</code></td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>starts-with()</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Comienza con substring</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>//div[starts-with(@id, 'section-')]</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>normalize-space()</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Elimina espacios extra</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>//span[normalize-space()='Precio']</code></td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>string-length()</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Longitud del string</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>//input[string-length(@value) > 0]</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>concat()</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Concatenar strings</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>//div[@id=concat('item-', '1')]</code></td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>count()</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Cuenta nodos</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>//ul[count(li) > 3]</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>not()</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Negación booleana</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>//input[not(@disabled)]</code></td>
                </tr>
            </table>
        </div>

        <div class="code-tabs" data-code-id="L039-4">
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
                <pre><code class="language-python">def test_funciones_xpath(page: Page):
    page.goto("https://the-internet.herokuapp.com/tables")

    # normalize-space() — Ignora espacios innecesarios
    # Útil cuando el HTML tiene espacios/tabulaciones/saltos de línea
    header = page.locator("//th[normalize-space()='Last Name']")

    # string-length() — Encontrar celdas con contenido largo
    celdas_largas = page.locator("//td[string-length(text()) > 10]")

    # count() — Filas con más de 4 celdas
    filas_completas = page.locator("//tr[count(td) >= 4]")

    # not() — Inputs que NO están deshabilitados
    inputs_activos = page.locator("//input[not(@disabled)]")

    # Combinación de funciones
    # "Encuentra divs cuyo texto comienza con 'Error' y tiene más de 5 caracteres"
    errores = page.locator(
        "//div[starts-with(normalize-space(), 'Error') and string-length(normalize-space()) > 5]"
    )</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('funciones xpath', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/tables');

    // normalize-space() — Ignora espacios innecesarios
    const header = page.locator("//th[normalize-space()='Last Name']");

    // string-length() — Encontrar celdas con contenido largo
    const celdasLargas = page.locator('//td[string-length(text()) > 10]');

    // count() — Filas con más de 4 celdas
    const filasCompletas = page.locator('//tr[count(td) >= 4]');

    // not() — Inputs que NO están deshabilitados
    const inputsActivos = page.locator('//input[not(@disabled)]');

    // Combinación de funciones
    const errores = page.locator(
        "//div[starts-with(normalize-space(), 'Error') and string-length(normalize-space()) > 5]"
    );
});</code></pre>
            </div>
        </div>

        <h3>📝 XPath para buscar por texto</h3>
        <p>Una de las fortalezas de XPath es la búsqueda por contenido de texto, especialmente
        cuando necesitas condiciones complejas.</p>

        <div class="code-tabs" data-code-id="L039-5">
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
                <pre><code class="language-python">def test_xpath_por_texto(page: Page):
    page.goto("https://the-internet.herokuapp.com/javascript_alerts")

    # Texto exacto
    boton_alert = page.locator("//button[text()='Click for JS Alert']")

    # Texto parcial con contains
    boton_confirm = page.locator("//button[contains(text(), 'Confirm')]")

    # Texto que comienza con...
    boton_js = page.locator("//button[starts-with(text(), 'Click for JS')]")

    # Texto en un descendiente (buscar en todo el subárbol)
    # A diferencia de text(), el punto (.) incluye texto de todos los hijos
    div_con_texto = page.locator("//div[contains(., 'resultado')]")

    # Texto normalizado (ignora espacios y saltos de línea)
    elemento = page.locator("//p[normalize-space()='Texto exacto sin espacios extra']")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('xpath por texto', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');

    // Texto exacto
    const botonAlert = page.locator("//button[text()='Click for JS Alert']");

    // Texto parcial con contains
    const botonConfirm = page.locator("//button[contains(text(), 'Confirm')]");

    // Texto que comienza con...
    const botonJs = page.locator("//button[starts-with(text(), 'Click for JS')]");

    // Texto en un descendiente (buscar en todo el subárbol)
    const divConTexto = page.locator("//div[contains(., 'resultado')]");

    // Texto normalizado (ignora espacios y saltos de línea)
    const elemento = page.locator("//p[normalize-space()='Texto exacto sin espacios extra']");
});</code></pre>
            </div>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚠️ text() vs punto (.)</h4>
            <ul>
                <li><code>text()</code> — Solo el texto directo del nodo, no incluye texto de hijos</li>
                <li><code>.</code> (punto) — Todo el texto del nodo y todos sus descendientes</li>
            </ul>
            <div class="code-tabs" data-code-id="L039-6">
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
                    <pre><code class="language-python"># HTML: &lt;div&gt;Hola &lt;span&gt;Mundo&lt;/span&gt;&lt;/div&gt;
# text() solo ve "Hola " (sin "Mundo")
page.locator("//div[text()='Hola ']")

# . ve "Hola Mundo" (incluye texto del span hijo)
page.locator("//div[contains(., 'Hola Mundo')]")</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-typescript">// HTML: <div>Hola <span>Mundo</span></div>
// text() solo ve "Hola " (sin "Mundo")
page.locator("//div[text()='Hola ']");

// . ve "Hola Mundo" (incluye texto del span hijo)
page.locator("//div[contains(., 'Hola Mundo')]");</code></pre>
                </div>
            </div>
        </div>

        <h3>🔄 Navegando el DOM con XPath</h3>
        <p>Los ejes XPath permiten resolver problemas de navegación que CSS simplemente no puede.</p>

        <div class="code-tabs" data-code-id="L039-7">
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
                <pre><code class="language-python">def test_navegacion_dom_xpath(page: Page):
    page.goto("https://the-internet.herokuapp.com/tables")

    # --- Encontrar el padre de un hijo conocido ---
    # "¿En qué fila está el email 'jdoe@hotmail.com'?"
    fila = page.locator("//td[text()='jdoe@hotmail.com']/parent::tr")

    # --- Encontrar hermano por contexto ---
    # "¿Cuál es el 'Last Name' en la misma fila que 'jdoe@hotmail.com'?"
    apellido = page.locator(
        "//td[text()='jdoe@hotmail.com']/preceding-sibling::td[3]"
    )

    # --- Subir al ancestro y bajar a otro descendiente ---
    # "Encuentra el botón 'edit' en la misma fila que 'Smith'"
    boton_edit = page.locator(
        "//td[text()='Smith']/ancestor::tr//a[contains(@href, 'edit')]"
    )

    # --- Elementos después de un marcador ---
    # "El primer input después del label 'Username'"
    input_username = page.locator(
        "//label[text()='Username']/following::input[1]"
    )

    # --- Contar y filtrar ---
    # "Filas que contienen un link de 'delete'"
    filas_con_delete = page.locator(
        "//tr[.//a[contains(@href, 'delete')]]"
    )</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('navegación DOM con xpath', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/tables');

    // --- Encontrar el padre de un hijo conocido ---
    const fila = page.locator("//td[text()='jdoe@hotmail.com']/parent::tr");

    // --- Encontrar hermano por contexto ---
    const apellido = page.locator(
        "//td[text()='jdoe@hotmail.com']/preceding-sibling::td[3]"
    );

    // --- Subir al ancestro y bajar a otro descendiente ---
    const botonEdit = page.locator(
        "//td[text()='Smith']/ancestor::tr//a[contains(@href, 'edit')]"
    );

    // --- Elementos después de un marcador ---
    const inputUsername = page.locator(
        "//label[text()='Username']/following::input[1]"
    );

    // --- Contar y filtrar ---
    const filasConDelete = page.locator(
        "//tr[.//a[contains(@href, 'delete')]]"
    );
});</code></pre>
            </div>
        </div>

        <h3>⚔️ XPath vs CSS: comparación directa</h3>
        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #e3f2fd;">
                <th style="padding: 8px; border: 1px solid #ddd;">Criterio</th>
                <th style="padding: 8px; border: 1px solid #ddd;">CSS Selectors</th>
                <th style="padding: 8px; border: 1px solid #ddd;">XPath</th>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><strong>Legibilidad</strong></td>
                <td style="padding: 6px; border: 1px solid #ddd;">✅ Más conciso y familiar</td>
                <td style="padding: 6px; border: 1px solid #ddd;">❌ Más verboso</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><strong>Performance</strong></td>
                <td style="padding: 6px; border: 1px solid #ddd;">✅ Generalmente más rápido</td>
                <td style="padding: 6px; border: 1px solid #ddd;">❌ Ligeramente más lento</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><strong>Dirección</strong></td>
                <td style="padding: 6px; border: 1px solid #ddd;">❌ Solo hacia abajo/adelante</td>
                <td style="padding: 6px; border: 1px solid #ddd;">✅ Cualquier dirección (padre, ancestro, hermano anterior)</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><strong>Búsqueda por texto</strong></td>
                <td style="padding: 6px; border: 1px solid #ddd;">❌ No soportado nativamente</td>
                <td style="padding: 6px; border: 1px solid #ddd;">✅ text(), contains(), starts-with()</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><strong>Funciones</strong></td>
                <td style="padding: 6px; border: 1px solid #ddd;">❌ Limitadas (:nth-child, :not)</td>
                <td style="padding: 6px; border: 1px solid #ddd;">✅ Amplio set (normalize-space, count, string-length)</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><strong>Seleccionar padres</strong></td>
                <td style="padding: 6px; border: 1px solid #ddd;">❌ No soportado (hasta :has() en CSS4)</td>
                <td style="padding: 6px; border: 1px solid #ddd;">✅ parent::, ancestor::</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><strong>Pseudo-clases UI</strong></td>
                <td style="padding: 6px; border: 1px solid #ddd;">✅ :hover, :focus, :checked, :disabled</td>
                <td style="padding: 6px; border: 1px solid #ddd;">❌ No soportado</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><strong>Familiaridad</strong></td>
                <td style="padding: 6px; border: 1px solid #ddd;">✅ Conocido por todo dev frontend</td>
                <td style="padding: 6px; border: 1px solid #ddd;">❌ Curva de aprendizaje más alta</td>
            </tr>
        </table>

        <h3>🧩 Patrones XPath para escenarios complejos</h3>
        <p>Estos son patrones que resuelven problemas donde CSS no llega:</p>

        <div class="code-tabs" data-code-id="L039-8">
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
                <pre><code class="language-python">def test_patrones_xpath_complejos(page: Page):
    # --- Patrón 1: Encontrar fila de tabla por contenido de celda ---
    # "La fila completa donde el email es 'jdoe@hotmail.com'"
    fila = page.locator(
        "//tr[td[text()='jdoe@hotmail.com']]"
    )

    # --- Patrón 2: Seleccionar el N-ésimo elemento que cumple condición ---
    # "El segundo botón que contiene la palabra 'Delete'"
    segundo_delete = page.locator(
        "(//button[contains(text(), 'Delete')])[2]"
    )

    # --- Patrón 3: Elemento entre dos marcadores ---
    # "Todos los párrafos entre el h2 'Sección A' y el siguiente h2"
    parrafos = page.locator(
        "//h2[text()='Sección A']/following-sibling::p"
        "[count(preceding-sibling::h2[text()='Sección A'])=1]"
    )

    # --- Patrón 4: Elemento que contiene otro elemento específico ---
    # "Divs que tienen un span con clase 'badge' dentro"
    divs_con_badge = page.locator(
        "//div[.//span[contains(@class, 'badge')]]"
    )

    # --- Patrón 5: Selección por múltiples atributos ---
    # "Input de tipo text que tiene placeholder y no está deshabilitado"
    input_activo = page.locator(
        "//input[@type='text' and @placeholder and not(@disabled)]"
    )

    # --- Patrón 6: Elemento adyacente a un label ---
    # "El input que viene justo después de un label con texto 'Email'"
    input_email = page.locator(
        "//label[normalize-space()='Email']/following-sibling::input[1]"
    )</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('patrones xpath complejos', async ({ page }) => {
    // --- Patrón 1: Encontrar fila de tabla por contenido de celda ---
    const fila = page.locator(
        "//tr[td[text()='jdoe@hotmail.com']]"
    );

    // --- Patrón 2: Seleccionar el N-ésimo elemento que cumple condición ---
    const segundoDelete = page.locator(
        "(//button[contains(text(), 'Delete')])[2]"
    );

    // --- Patrón 3: Elemento entre dos marcadores ---
    const parrafos = page.locator(
        "//h2[text()='Sección A']/following-sibling::p" +
        "[count(preceding-sibling::h2[text()='Sección A'])=1]"
    );

    // --- Patrón 4: Elemento que contiene otro elemento específico ---
    const divsConBadge = page.locator(
        "//div[.//span[contains(@class, 'badge')]]"
    );

    // --- Patrón 5: Selección por múltiples atributos ---
    const inputActivo = page.locator(
        "//input[@type='text' and @placeholder and not(@disabled)]"
    );

    // --- Patrón 6: Elemento adyacente a un label ---
    const inputEmail = page.locator(
        "//label[normalize-space()='Email']/following-sibling::input[1]"
    );
});</code></pre>
            </div>
        </div>

        <h3>🔌 Uso de XPath en Playwright</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Playwright detecta automáticamente XPath cuando la expresión comienza con <code>//</code>
            o <code>..</code>. También puedes usar el prefijo explícito <code>xpath=</code>.</p>

            <div class="code-tabs" data-code-id="L039-9">
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
                    <pre><code class="language-python">def test_xpath_en_playwright(page: Page):
    # Detección automática — empieza con //
    page.locator("//button[text()='Submit']")

    # Prefijo explícito — xpath=
    page.locator("xpath=//button[text()='Submit']")

    # XPath relativo con ..
    page.locator("//span[@class='icon']/..")

    # Combinando con expect
    from playwright.sync_api import expect
    boton = page.locator("//button[contains(@class, 'primary')]")
    expect(boton).to_be_visible()
    expect(boton).to_be_enabled()
    boton.click()

    # XPath dentro de frame_locator
    frame = page.frame_locator("#mi-iframe")
    frame.locator("//input[@name='campo']").fill("valor")</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-typescript">test('xpath en Playwright', async ({ page }) => {
    // Detección automática — empieza con //
    page.locator("//button[text()='Submit']");

    // Prefijo explícito — xpath=
    page.locator("xpath=//button[text()='Submit']");

    // XPath relativo con ..
    page.locator("//span[@class='icon']/..");

    // Combinando con expect
    const boton = page.locator("//button[contains(@class, 'primary')]");
    await expect(boton).toBeVisible();
    await expect(boton).toBeEnabled();
    await boton.click();

    // XPath dentro de frameLocator
    const frame = page.frameLocator('#mi-iframe');
    await frame.locator("//input[@name='campo']").fill('valor');
});</code></pre>
                </div>
            </div>
        </div>

        <h3>🚫 Anti-patrones: XPath que NO debes usar</h3>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>❌ XPath absoluto (el peor anti-patrón)</h4>
            <div class="code-tabs" data-code-id="L039-10">
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
                    <pre><code class="language-python"># NUNCA hagas esto — se rompe con cualquier cambio en la estructura
page.locator("/html/body/div[1]/div[2]/div/div/main/div/table/tbody/tr[3]/td[2]")

# En su lugar, usa un selector semántico o relativo
page.locator("//table[@id='datos']//tr[3]/td[2]")</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-typescript">// NUNCA hagas esto — se rompe con cualquier cambio en la estructura
page.locator('/html/body/div[1]/div[2]/div/div/main/div/table/tbody/tr[3]/td[2]');

// En su lugar, usa un selector semántico o relativo
page.locator("//table[@id='datos']//tr[3]/td[2]");</code></pre>
                </div>
            </div>

            <h4>❌ Posiciones frágiles sin contexto</h4>
            <div class="code-tabs" data-code-id="L039-11">
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
                    <pre><code class="language-python"># MAL — depende del orden exacto de los divs
page.locator("//div[3]/span[1]")

# BIEN — usa atributos o texto para anclar
page.locator("//div[@class='resultado']/span[1]")</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-typescript">// MAL — depende del orden exacto de los divs
page.locator('//div[3]/span[1]');

// BIEN — usa atributos o texto para anclar
page.locator("//div[@class='resultado']/span[1]");</code></pre>
                </div>
            </div>

            <h4>❌ XPath cuando un localizador built-in es suficiente</h4>
            <div class="code-tabs" data-code-id="L039-12">
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
                    <pre><code class="language-python"># MAL — XPath innecesario para algo que Playwright resuelve mejor
page.locator("//button[text()='Enviar']")

# BIEN — localizador built-in, más robusto y legible
page.get_by_role("button", name="Enviar")</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-typescript">// MAL — XPath innecesario para algo que Playwright resuelve mejor
page.locator("//button[text()='Enviar']");

// BIEN — localizador built-in, más robusto y legible
page.getByRole('button', { name: 'Enviar' });</code></pre>
                </div>
            </div>

            <h4>❌ XPath excesivamente largo y complejo</h4>
            <div class="code-tabs" data-code-id="L039-13">
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
                    <pre><code class="language-python"># MAL — imposible de mantener
page.locator(
    "//div[contains(@class,'container')]//div[contains(@class,'row')]"
    "//div[contains(@class,'col')]//form//div[3]//input"
)

# BIEN — simplificar con atributos específicos
page.locator("//form[@id='registro']//input[@name='email']")</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-typescript">// MAL — imposible de mantener
page.locator(
    "//div[contains(@class,'container')]//div[contains(@class,'row')]" +
    "//div[contains(@class,'col')]//form//div[3]//input"
);

// BIEN — simplificar con atributos específicos
page.locator("//form[@id='registro']//input[@name='email']");</code></pre>
                </div>
            </div>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <p>Resuelve estos 5 desafíos de localización donde XPath es la mejor (o única) opción.
        Usa <code>https://the-internet.herokuapp.com</code> como sitio de prueba.</p>

        <ol>
            <li><strong>Encontrar el padre:</strong> En <code>/tables</code>, localiza la fila
            (<code>&lt;tr&gt;</code>) que contiene el email <code>jdoe@hotmail.com</code> usando
            <code>parent::</code>. Verifica que la fila tiene 6 celdas.
            <div class="code-tabs" data-code-id="L039-14">
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
                    <pre><code class="language-python"># Pista: //td[text()='jdoe@hotmail.com']/parent::tr
def test_desafio_1_padre(page: Page):
    page.goto("https://the-internet.herokuapp.com/tables")
    fila = page.locator("//td[text()='jdoe@hotmail.com']/parent::tr")
    celdas = fila.locator("td")
    assert celdas.count() == 6</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-typescript">test('desafío 1: encontrar el padre', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/tables');
    const fila = page.locator("//td[text()='jdoe@hotmail.com']/parent::tr");
    const celdas = fila.locator('td');
    await expect(celdas).toHaveCount(6);
});</code></pre>
                </div>
            </div>
            </li>

            <li><strong>Hermano anterior:</strong> En <code>/tables</code>, dado el email
            <code>jdoe@hotmail.com</code>, encuentra el <em>Last Name</em> en la misma fila
            usando <code>preceding-sibling::</code>.
            <div class="code-tabs" data-code-id="L039-15">
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
                    <pre><code class="language-python"># Pista: //td[text()='jdoe@hotmail.com']/preceding-sibling::td[...]
def test_desafio_2_hermano(page: Page):
    page.goto("https://the-internet.herokuapp.com/tables")
    apellido = page.locator(
        "//td[text()='jdoe@hotmail.com']/preceding-sibling::td[2]"
    )
    assert apellido.text_content() == "Doe"</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-typescript">test('desafío 2: hermano anterior', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/tables');
    const apellido = page.locator(
        "//td[text()='jdoe@hotmail.com']/preceding-sibling::td[2]"
    );
    await expect(apellido).toHaveText('Doe');
});</code></pre>
                </div>
            </div>
            </li>

            <li><strong>Ancestro con condición:</strong> En <code>/tables</code>, partiendo de
            cualquier celda con texto <code>'$50.00'</code>, sube al <code>&lt;table&gt;</code>
            ancestro y verifica su id.
            <div class="code-tabs" data-code-id="L039-16">
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
                    <pre><code class="language-python"># Pista: //td[text()='$50.00']/ancestor::table
def test_desafio_3_ancestro(page: Page):
    page.goto("https://the-internet.herokuapp.com/tables")
    tabla = page.locator("//td[text()='$50.00']/ancestor::table").first
    assert tabla.get_attribute("id") in ["table1", "table2"]</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-typescript">test('desafío 3: ancestro con condición', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/tables');
    const tabla = page.locator("//td[text()='\\$50.00']/ancestor::table").first();
    const id = await tabla.getAttribute('id');
    expect(['table1', 'table2']).toContain(id);
});</code></pre>
                </div>
            </div>
            </li>

            <li><strong>Texto normalizado:</strong> Busca un elemento cuyo texto tenga espacios
            extra usando <code>normalize-space()</code>. Crea un test en <code>/</code> (home) que
            encuentre el link <code>Sortable Data Tables</code> usando normalize-space.
            <div class="code-tabs" data-code-id="L039-17">
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
                    <pre><code class="language-python">def test_desafio_4_normalize(page: Page):
    page.goto("https://the-internet.herokuapp.com/")
    link = page.locator("//a[normalize-space()='Sortable Data Tables']")
    expect(link).to_be_visible()
    link.click()
    expect(page).to_have_url("**/tables")</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-typescript">test('desafío 4: texto normalizado', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/');
    const link = page.locator("//a[normalize-space()='Sortable Data Tables']");
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL('**/tables');
});</code></pre>
                </div>
            </div>
            </li>

            <li><strong>Patrón complejo:</strong> En <code>/tables</code>, encuentra todas las
            filas donde el monto (columna "Due") es <code>$50.00</code> y devuelve el nombre
            completo (First Name + Last Name) de cada una.
            <div class="code-tabs" data-code-id="L039-18">
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
                    <pre><code class="language-python">def test_desafio_5_complejo(page: Page):
    page.goto("https://the-internet.herokuapp.com/tables")
    filas_50 = page.locator("//table[@id='table1']//tr[td[text()='$50.00']]")

    for i in range(filas_50.count()):
        fila = filas_50.nth(i)
        nombre = fila.locator("td").nth(1).text_content()
        apellido = fila.locator("td").nth(0).text_content()
        print(f"Persona con $50.00: {nombre} {apellido}")
        # Verificar que los nombres no están vacíos
        assert len(nombre) > 0 and len(apellido) > 0</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-typescript">test('desafío 5: patrón complejo', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/tables');
    const filas50 = page.locator("//table[@id='table1']//tr[td[text()='\\$50.00']]");

    const count = await filas50.count();
    for (let i = 0; i < count; i++) {
        const fila = filas50.nth(i);
        const nombre = await fila.locator('td').nth(1).textContent();
        const apellido = await fila.locator('td').nth(0).textContent();
        console.log(\`Persona con $50.00: \${nombre} \${apellido}\`);
        // Verificar que los nombres no están vacíos
        expect(nombre!.length).toBeGreaterThan(0);
        expect(apellido!.length).toBeGreaterThan(0);
    }
});</code></pre>
                </div>
            </div>
            </li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Comprender cuándo usar XPath y cuándo preferir localizadores built-in o CSS</li>
                <li>Dominar la sintaxis básica: <code>//</code>, <code>/</code>, <code>.</code>, <code>..</code>, <code>@</code>, <code>text()</code></li>
                <li>Usar ejes para navegar en cualquier dirección: <code>parent</code>, <code>ancestor</code>, <code>following-sibling</code>, <code>preceding-sibling</code></li>
                <li>Aplicar predicados y funciones: <code>contains()</code>, <code>normalize-space()</code>, <code>count()</code></li>
                <li>Identificar y evitar anti-patrones: XPath absoluto, posiciones frágiles</li>
                <li>Integrar XPath con Playwright usando <code>page.locator("//...")</code></li>
            </ul>
        </div>
    `,
    topics: ["xpath", "selectores"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_039 = LESSON_039;
}
