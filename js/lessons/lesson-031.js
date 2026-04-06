/**
 * Playwright Academy - Lección 031
 * Tablas y listas HTML
 * Sección 4: Interacciones Web Fundamentales
 */

const LESSON_031 = {
    id: 31,
    title: "Tablas y listas HTML",
    duration: "5 min",
    level: "beginner",
    section: "section-04",
    content: `
        <h2>📊 Tablas y listas HTML</h2>
        <p>Las tablas y listas son elementos fundamentales en aplicaciones web empresariales.
        Playwright ofrece herramientas poderosas para localizar, leer y validar datos
        tabulares y listas de forma eficiente.</p>

        <h3>🏗️ Estructura de una tabla HTML</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Antes de automatizar, es importante entender la estructura estándar:</p>
            <pre><code class="python"># Estructura HTML típica de una tabla:
# &lt;table&gt;
#   &lt;thead&gt;
#     &lt;tr&gt;&lt;th&gt;Nombre&lt;/th&gt;&lt;th&gt;Edad&lt;/th&gt;&lt;/tr&gt;
#   &lt;/thead&gt;
#   &lt;tbody&gt;
#     &lt;tr&gt;&lt;td&gt;Ana&lt;/td&gt;&lt;td&gt;28&lt;/td&gt;&lt;/tr&gt;
#     &lt;tr&gt;&lt;td&gt;Luis&lt;/td&gt;&lt;td&gt;35&lt;/td&gt;&lt;/tr&gt;
#   &lt;/tbody&gt;
# &lt;/table&gt;</code></pre>
            <p><strong>Selectores clave:</strong> <code>table</code>, <code>thead</code>,
            <code>tbody</code>, <code>tr</code>, <code>td</code>, <code>th</code></p>
        </div>

        <h3>📖 Leer datos de celdas</h3>
        <pre><code class="python">from playwright.sync_api import Page, expect

def test_leer_celdas(page: Page):
    page.goto("https://the-internet.herokuapp.com/tables")

    # Leer texto de una celda específica
    celda = page.locator("table#table1 tbody tr:first-child td:first-child")
    texto = celda.text_content()
    print(f"Primera celda: {texto}")

    # Leer encabezados de la tabla
    headers = page.locator("table#table1 thead th")
    for i in range(headers.count()):
        print(f"Header {i}: {headers.nth(i).text_content()}")</code></pre>

        <h3>🔄 Iterar filas y columnas con locator.all()</h3>
        <pre><code class="python">def test_iterar_tabla(page: Page):
    page.goto("https://the-internet.herokuapp.com/tables")

    # Obtener todas las filas del tbody
    filas = page.locator("table#table1 tbody tr").all()

    for fila in filas:
        # Obtener todas las celdas de cada fila
        celdas = fila.locator("td").all()
        datos_fila = [celda.text_content() for celda in celdas]
        print(f"Fila: {datos_fila}")

    # Resultado esperado:
    # Fila: ['Smith', 'John', 'jsmith@gmail.com', '$50.00', ...]
    # Fila: ['Bach', 'Frank', 'fbach@yahoo.com', '$51.00', ...]</code></pre>

        <h3>🎯 Obtener celda específica por fila y columna</h3>
        <pre><code class="python">def test_celda_especifica(page: Page):
    page.goto("https://the-internet.herokuapp.com/tables")

    # Celda en fila 2, columna 3 (0-indexed)
    celda = page.locator("table#table1 tbody tr:nth-child(2) td:nth-child(3)")
    expect(celda).to_have_text("fbach@yahoo.com")

    # Función helper para acceder por fila/columna
    def obtener_celda(table_selector, fila, columna):
        return page.locator(
            f"{table_selector} tbody tr:nth-child({fila}) td:nth-child({columna})"
        )

    email = obtener_celda("table#table1", 1, 3)
    expect(email).to_have_text("jsmith@gmail.com")

    precio = obtener_celda("table#table1", 3, 4)
    print(f"Precio fila 3: {precio.text_content()}")</code></pre>

        <h3>🔢 Contar filas con locator.count()</h3>
        <pre><code class="python">def test_contar_filas(page: Page):
    page.goto("https://the-internet.herokuapp.com/tables")

    # Contar filas del cuerpo de la tabla
    filas = page.locator("table#table1 tbody tr")
    total = filas.count()
    print(f"Total de filas: {total}")
    assert total == 4, f"Se esperaban 4 filas, hay {total}"

    # Contar columnas (headers)
    columnas = page.locator("table#table1 thead th")
    assert columnas.count() == 6

    # Verificar que la tabla no está vacía
    expect(filas.first).to_be_visible()</code></pre>

        <h3>🔍 Verificar ordenamiento y filtrado de datos</h3>
        <pre><code class="python">def test_verificar_orden_tabla(page: Page):
    page.goto("https://the-internet.herokuapp.com/tables")

    # Extraer datos de una columna (apellidos - columna 1)
    apellidos = page.locator("table#table1 tbody tr td:nth-child(1)")
    lista_apellidos = [apellidos.nth(i).text_content()
                       for i in range(apellidos.count())]
    print(f"Apellidos: {lista_apellidos}")

    # Hacer clic en el header para ordenar
    page.locator("table#table1 thead th:nth-child(1) span").click()

    # Re-leer después de ordenar
    apellidos_ordenados = [apellidos.nth(i).text_content()
                           for i in range(apellidos.count())]
    print(f"Ordenados: {apellidos_ordenados}")

    # Verificar que están en orden alfabético
    assert apellidos_ordenados == sorted(apellidos_ordenados), \
        "La tabla no está ordenada alfabéticamente"</code></pre>

        <h3>📄 Tablas dinámicas y paginadas</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Nota:</strong> Muchas aplicaciones modernas usan tablas paginadas o que
            cargan datos dinámicamente. Aquí la estrategia cambia ligeramente.</p>
        </div>
        <pre><code class="python">def test_tabla_paginada(page: Page):
    page.goto("/mi-app/tabla-datos")

    todos_los_datos = []

    while True:
        # Leer datos de la página actual
        filas = page.locator("table tbody tr").all()
        for fila in filas:
            celdas = fila.locator("td").all()
            todos_los_datos.append(
                [celda.text_content() for celda in celdas]
            )

        # Verificar si hay página siguiente
        btn_siguiente = page.locator("button.next-page")
        if btn_siguiente.is_disabled():
            break

        btn_siguiente.click()
        # Esperar a que la tabla se actualice
        page.locator("table tbody tr").first.wait_for()

    print(f"Total de registros: {len(todos_los_datos)}")</code></pre>

        <h3>📋 Trabajar con listas ul/ol</h3>
        <pre><code class="python">def test_listas_html(page: Page):
    page.goto("https://the-internet.herokuapp.com")

    # Obtener todos los items de una lista
    items = page.locator("#content ul li a")

    # Contar elementos
    total = items.count()
    print(f"Total de links: {total}")

    # Obtener todos los textos como array
    textos = items.all_text_contents()
    print(f"Items: {textos}")
    # ['A/B Testing', 'Add/Remove Elements', 'Basic Auth', ...]

    # Verificar que un item específico existe
    expect(page.locator("#content ul li a", has_text="Checkboxes")).to_be_visible()

    # Verificar el orden de items
    assert textos[0] == "A/B Testing"
    assert "Dropdown" in textos</code></pre>

        <h3>✅ Verificar orden y contenido de listas</h3>
        <pre><code class="python">def test_verificar_lista_ordenada(page: Page):
    page.goto("/mi-app/lista-tareas")

    # Obtener textos de una lista ordenada
    items = page.locator("ol.tareas li")
    textos = items.all_text_contents()

    # Verificar contenido esperado
    esperado = ["Planificar sprint", "Escribir tests", "Ejecutar tests"]
    assert textos == esperado, f"Esperado: {esperado}, Obtenido: {textos}"

    # Verificar que NO contiene ciertos items
    assert "Deploy producción" not in textos

    # Verificar cantidad de items
    expect(items).to_have_count(3)</code></pre>

        <h3>🌐 Ejemplo completo: Validar tabla en the-internet</h3>
        <pre><code class="python">from playwright.sync_api import Page, expect

def test_tabla_completa(page: Page):
    """Ejemplo integrador: validar tabla de datos en the-internet."""
    page.goto("https://the-internet.herokuapp.com/tables")

    tabla = page.locator("table#table1")
    expect(tabla).to_be_visible()

    # 1. Verificar encabezados
    headers = tabla.locator("thead th").all_text_contents()
    assert headers[:4] == ["Last Name", "First Name", "Email", "Due"]

    # 2. Verificar cantidad de filas
    filas = tabla.locator("tbody tr")
    expect(filas).to_have_count(4)

    # 3. Buscar fila por contenido
    fila_smith = tabla.locator("tbody tr", has_text="Smith")
    expect(fila_smith).to_be_visible()

    # 4. Extraer email de Smith
    email_smith = fila_smith.locator("td:nth-child(3)")
    expect(email_smith).to_have_text("jsmith@gmail.com")

    # 5. Extraer todos los precios y validar formato
    precios = tabla.locator("tbody tr td:nth-child(4)")
    for i in range(precios.count()):
        texto = precios.nth(i).text_content()
        assert texto.startswith("$"), f"Precio sin formato: {texto}"

    # 6. Ordenar por Last Name y verificar
    tabla.locator("thead th:nth-child(1) span").click()
    primer_apellido = tabla.locator("tbody tr:first-child td:first-child")
    expect(primer_apellido).to_have_text("Bach")</code></pre>

        <h3>📊 Patrones de locator útiles para tablas</h3>
        <table style="width:100%; border-collapse: collapse;">
            <tr style="background: #c8e6c9;">
                <th style="padding: 8px; border: 1px solid #ddd;">Patrón</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Descripción</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo</th>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>tr:nth-child(N)</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Fila N (1-indexed)</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>tbody tr:nth-child(2)</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>td:nth-child(N)</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Columna N de una fila</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>tr td:nth-child(3)</code></td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>tr:first-child</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Primera fila</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>tbody tr:first-child</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>tr:last-child</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Última fila</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>tbody tr:last-child</code></td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>has_text="..."</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Fila que contiene texto</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>locator("tr", has_text="Smith")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>.all()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Todas las coincidencias</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>locator("tr").all()</code></td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>.count()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Cantidad de coincidencias</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>locator("tr").count()</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>.all_text_contents()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Textos como array</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>locator("td").all_text_contents()</code></td>
            </tr>
        </table>

        <h3>🎯 Ejercicio práctico</h3>
        <ol>
            <li>Ve a <code>https://the-internet.herokuapp.com/tables</code></li>
            <li>Cuenta cuántas filas tiene <code>table#table1</code> y verifica con <code>expect().to_have_count()</code></li>
            <li>Extrae todos los emails (columna 3) y guárdalos en una lista</li>
            <li>Busca la fila que contiene "Conway" y verifica su email</li>
            <li>Haz clic en el header "Last Name" para ordenar y verifica que "Bach" queda primero</li>
            <li>Extrae todos los precios (columna 4), remueve el "$" y suma los totales</li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Localizar tablas y sus elementos con selectores CSS</li>
                <li>Iterar filas y columnas con <code>locator.all()</code></li>
                <li>Obtener celdas específicas por posición fila/columna</li>
                <li>Contar filas con <code>locator.count()</code></li>
                <li>Verificar ordenamiento y contenido de datos tabulares</li>
                <li>Trabajar con listas <code>ul</code>/<code>ol</code> y obtener textos como array</li>
            </ul>
        </div>
    `,
    topics: ["tablas", "listas", "html"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_031 = LESSON_031;
}
