/**
 * Playwright Academy - Lección 041
 * Filtrado y encadenamiento de locators
 * Sección 5: Localizadores y Selectores
 */

const LESSON_041 = {
    id: 41,
    title: "Filtrado y encadenamiento de locators",
    duration: "5 min",
    level: "beginner",
    section: "section-05",
    content: `
        <h2>🔗 Filtrado y encadenamiento de locators</h2>
        <p>Una de las capacidades más poderosas de Playwright es la habilidad de <strong>encadenar y filtrar locators</strong>
        para seleccionar elementos con precisión quirúrgica. En lugar de escribir selectores CSS complejos o XPaths
        largos, puedes componer locators paso a paso, reduciendo el alcance progresivamente hasta llegar
        exactamente al elemento que necesitas.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎯 Objetivo de esta lección</h4>
            <p>Dominar las técnicas de encadenamiento (<code>locator.locator()</code>), filtrado
            (<code>locator.filter()</code>), selección posicional (<code>first</code>, <code>last</code>,
            <code>nth()</code>), operaciones de conjunto (<code>and_()</code>, <code>or_()</code>)
            y utilidades como <code>count()</code> y <code>all()</code> para construir localizadores
            precisos y mantenibles.</p>
        </div>

        <h3>🔗 Encadenamiento con locator.locator()</h3>
        <p>El <strong>encadenamiento de locators</strong> reduce el alcance de búsqueda progresivamente.
        Cada llamada a <code>.locator()</code> busca <em>dentro</em> del resultado anterior, como un embudo
        que va estrechándose.</p>
        <pre><code class="python">from playwright.sync_api import Page, expect

def test_encadenamiento_basico(page: Page):
    page.goto("https://example.com/catalogo")

    # Paso 1: seleccionar el contenedor principal
    catalogo = page.locator("#catalogo")

    # Paso 2: dentro del catálogo, buscar la sección de electrónica
    seccion = catalogo.locator(".seccion-electronica")

    # Paso 3: dentro de la sección, buscar tarjetas de producto
    tarjetas = seccion.locator(".tarjeta-producto")

    # Paso 4: dentro de las tarjetas, buscar el botón de compra
    boton_compra = tarjetas.locator("button.comprar")

    # Encadenamiento fluido (equivalente a lo anterior)
    boton = (
        page.locator("#catalogo")
            .locator(".seccion-electronica")
            .locator(".tarjeta-producto")
            .locator("button.comprar")
    )

    # Ambos apuntan a los mismos elementos
    expect(boton_compra).to_have_count(boton.count())</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚠️ Importante sobre encadenamiento</h4>
            <p>El encadenamiento <strong>no ejecuta búsquedas inmediatas</strong>. Playwright
            construye internamente la cadena de locators y la resuelve solo cuando interactúas
            con el elemento (click, fill, expect, etc.). Esto significa que puedes crear cadenas
            y reutilizarlas sin penalización de rendimiento.</p>
        </div>

        <h3>🔍 Filtrado con locator.filter()</h3>
        <p>Mientras que <code>locator.locator()</code> busca <em>hijos</em>, <code>locator.filter()</code>
        <strong>filtra entre los propios elementos</strong> que coinciden, usando criterios como texto,
        sub-locators o exclusiones.</p>
        <pre><code class="python">def test_filtrado_por_texto(page: Page):
    page.goto("https://example.com/lista-usuarios")

    # Obtener todas las filas de la tabla
    filas = page.locator("table tbody tr")

    # Filtrar filas que contienen "Activo" en su texto
    filas_activas = filas.filter(has_text="Activo")

    # Filtrar filas que NO contienen "Suspendido"
    filas_no_suspendidas = filas.filter(has_not_text="Suspendido")

    # has_text acepta regex
    import re
    filas_admin = filas.filter(has_text=re.compile(r"Admin|Administrador"))

    print(f"Filas activas: {filas_activas.count()}")
    print(f"Filas no suspendidas: {filas_no_suspendidas.count()}")
    print(f"Filas admin: {filas_admin.count()}")</code></pre>

        <pre><code class="python">def test_filtrado_por_sub_locator(page: Page):
    page.goto("https://example.com/dashboard")

    # Obtener todas las tarjetas
    tarjetas = page.locator(".card")

    # Filtrar tarjetas que CONTIENEN un badge de "Nuevo"
    tarjetas_nuevas = tarjetas.filter(has=page.locator(".badge-nuevo"))

    # Filtrar tarjetas que contienen un ícono específico
    tarjetas_con_alerta = tarjetas.filter(
        has=page.locator(".icon-alerta")
    )

    # Filtrar tarjetas que NO contienen un botón deshabilitado
    tarjetas_habilitadas = tarjetas.filter(
        has_not=page.locator("button[disabled]")
    )

    # Combinar múltiples filtros (AND implícito)
    tarjetas_nuevas_habilitadas = (
        tarjetas
        .filter(has=page.locator(".badge-nuevo"))
        .filter(has_not=page.locator("button[disabled]"))
    )

    expect(tarjetas_nuevas_habilitadas.first).to_be_visible()</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Parámetros de filter()</h4>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #c8e6c9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Parámetro</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Tipo</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripción</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>has_text</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">str | regex</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Elemento contiene este texto (substring match)</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>has_not_text</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">str | regex</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Elemento NO contiene este texto</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>has</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Locator</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Elemento contiene un hijo que coincide con el locator</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>has_not</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Locator</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Elemento NO contiene un hijo que coincide con el locator</td>
                </tr>
            </table>
        </div>

        <h3>📍 Selección posicional: first, last, nth()</h3>
        <p>Cuando un locator coincide con múltiples elementos, puedes seleccionar uno específico
        por su posición.</p>
        <pre><code class="python">def test_seleccion_posicional(page: Page):
    page.goto("https://example.com/lista")

    items = page.locator(".lista-item")

    # Primer elemento
    primero = items.first
    expect(primero).to_be_visible()

    # Último elemento
    ultimo = items.last
    expect(ultimo).to_be_visible()

    # Elemento por índice (0-based)
    tercero = items.nth(2)
    expect(tercero).to_be_visible()

    # Ejemplo práctico: segunda fila de una tabla
    segunda_fila = page.locator("table tbody tr").nth(1)
    nombre = segunda_fila.locator("td").first
    expect(nombre).to_have_text("María García")</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚠️ Precaución con índices posicionales</h4>
            <p>Usar <code>nth()</code> con índices fijos puede hacer tests frágiles si el orden
            de los elementos cambia. Prefiere <code>filter()</code> con texto o sub-locators cuando
            sea posible. Reserva <code>nth()</code> para casos donde el orden es parte del
            requisito (ej: "el primer resultado de búsqueda").</p>
        </div>

        <h3>🔢 Conteo y colecciones: count() y all()</h3>
        <pre><code class="python">def test_count_y_all(page: Page):
    page.goto("https://example.com/productos")

    productos = page.locator(".producto")

    # count() — número de elementos que coinciden
    total = productos.count()
    print(f"Total de productos: {total}")
    assert total > 0, "Debería haber al menos un producto"

    # all() — lista de locators individuales
    lista_productos = productos.all()
    for producto in lista_productos:
        nombre = producto.locator(".nombre").text_content()
        precio = producto.locator(".precio").text_content()
        print(f"  {nombre}: {precio}")

    # Verificar que todos los productos tienen precio
    for producto in productos.all():
        expect(producto.locator(".precio")).to_be_visible()

    # Uso con expect para verificar cantidad exacta
    expect(productos).to_have_count(12)  # Esperar exactamente 12</code></pre>

        <h3>🔀 Operaciones de conjunto: and_() y or_()</h3>
        <p>Desde <strong>Playwright 1.34+</strong>, puedes combinar locators usando operaciones de
        intersección (<code>and_()</code>) y unión (<code>or_()</code>).</p>
        <pre><code class="python">def test_and_or_locators(page: Page):
    page.goto("https://example.com/formulario")

    # and_() — intersección: elementos que cumplen AMBAS condiciones
    # Botón que es de clase "primario" Y contiene texto "Guardar"
    boton = page.locator("button").and_(
        page.locator(".primario")
    )
    # Equivalente a: page.locator("button.primario")
    # Pero and_() es más flexible con locators complejos

    # or_() — unión: elementos que cumplen ALGUNA condición
    # Campos de error O campos con advertencia
    campos_problema = page.locator(".error").or_(
        page.locator(".advertencia")
    )
    print(f"Campos con problemas: {campos_problema.count()}")

    # Ejemplo práctico: botón "Enviar" o "Submit" (soporte i18n)
    boton_enviar = (
        page.get_by_role("button", name="Enviar")
        .or_(page.get_by_role("button", name="Submit"))
    )
    expect(boton_enviar).to_be_visible()

    # and_() con locators semánticos
    input_requerido = (
        page.get_by_role("textbox")
        .and_(page.locator("[required]"))
    )
    print(f"Inputs requeridos: {input_requerido.count()}")</code></pre>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🧠 and_() vs filter(has=...) vs locator.locator()</h4>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #ce93d8;">
                    <th style="padding: 8px; border: 1px solid #ddd; color: white;">Técnica</th>
                    <th style="padding: 8px; border: 1px solid #ddd; color: white;">Qué hace</th>
                    <th style="padding: 8px; border: 1px solid #ddd; color: white;">Ejemplo</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>A.locator(B)</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Busca B <strong>dentro</strong> de A (descendientes)</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>page.locator(".card").locator("h3")</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>A.filter(has=B)</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Filtra A que <strong>contiene</strong> B como hijo</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>cards.filter(has=page.locator(".badge"))</code></td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>A.and_(B)</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Elementos que coinciden con A <strong>Y</strong> con B</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>page.locator("button").and_(page.locator(".primary"))</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>A.or_(B)</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Elementos que coinciden con A <strong>O</strong> con B</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>page.locator(".error").or_(page.locator(".warning"))</code></td>
                </tr>
            </table>
        </div>

        <h3>📋 Patrones prácticos</h3>
        <h4>Encontrar una fila en una tabla por contenido de celda</h4>
        <pre><code class="python">def test_buscar_fila_en_tabla(page: Page):
    page.goto("https://example.com/usuarios")

    # Buscar la fila que contiene "juan.reina@siesa.com"
    fila_juan = (
        page.locator("table tbody tr")
        .filter(has_text="juan.reina@siesa.com")
    )

    # Dentro de esa fila, obtener el nombre
    nombre = fila_juan.locator("td").first
    expect(nombre).to_have_text("Juan Reina")

    # Dentro de esa fila, hacer clic en "Editar"
    fila_juan.locator("button", has_text="Editar").click()</code></pre>

        <h4>Seleccionar una tarjeta por su título</h4>
        <pre><code class="python">def test_seleccionar_tarjeta(page: Page):
    page.goto("https://example.com/dashboard")

    # Encontrar la tarjeta cuyo título es "Ventas del mes"
    tarjeta_ventas = (
        page.locator(".card")
        .filter(has=page.locator("h3", has_text="Ventas del mes"))
    )

    # Leer el valor dentro de la tarjeta
    valor = tarjeta_ventas.locator(".valor-principal")
    expect(valor).to_be_visible()
    print(f"Ventas: {valor.text_content()}")

    # Hacer clic en "Ver detalle" de esa tarjeta
    tarjeta_ventas.locator("a", has_text="Ver detalle").click()</code></pre>

        <h4>Filtrar lista de productos por categoría y disponibilidad</h4>
        <pre><code class="python">def test_filtrar_productos(page: Page):
    page.goto("https://example.com/tienda")

    productos = page.locator(".producto")

    # Productos disponibles de la categoría "Laptop"
    laptops_disponibles = (
        productos
        .filter(has=page.locator(".categoria", has_text="Laptop"))
        .filter(has_not=page.locator(".agotado"))
    )

    print(f"Laptops disponibles: {laptops_disponibles.count()}")

    # Iterar sobre cada laptop disponible
    for laptop in laptops_disponibles.all():
        nombre = laptop.locator(".nombre").text_content()
        precio = laptop.locator(".precio").text_content()
        print(f"  {nombre} - {precio}")</code></pre>

        <h3>🐛 Debugging de locators</h3>
        <pre><code class="python">def test_debugging_locators(page: Page):
    page.goto("https://example.com/pagina")

    locator = page.locator(".producto")

    # count() — cuántos elementos coinciden
    print(f"Elementos encontrados: {locator.count()}")

    # highlight() — resalta visualmente el elemento (útil en headed mode)
    locator.first.highlight()

    # evaluate() — ejecutar JS sobre el elemento para inspección
    tag_name = locator.first.evaluate("el => el.tagName")
    class_list = locator.first.evaluate("el => el.className")
    print(f"Tag: {tag_name}, Classes: {class_list}")

    # Obtener el HTML del elemento
    html = locator.first.evaluate("el => el.outerHTML")
    print(f"HTML: {html[:200]}...")

    # Verificar que el locator coincide con algo antes de interactuar
    if locator.count() > 0:
        locator.first.click()
    else:
        print("ADVERTENCIA: locator no encontró elementos")</code></pre>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip: highlight() para debugging visual</h4>
            <p>Ejecuta tus tests en modo visible (<code>--headed</code>) y usa <code>locator.highlight()</code>
            para ver exactamente qué elemento está seleccionando tu locator. Es la forma más rápida de
            confirmar que tu selector apunta al elemento correcto.</p>
            <pre><code class="bash"># Ejecutar en modo visible para usar highlight()
pytest tests/ --headed --slowmo=500</code></pre>
        </div>

        <h3>📊 Tabla comparativa: cuándo usar cada técnica</h3>
        <table style="width:100%; border-collapse: collapse;">
            <tr style="background: #1976d2; color: white;">
                <th style="padding: 8px; border: 1px solid #ddd;">Técnica</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Cuándo usar</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo típico</th>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><strong>Encadenamiento</strong><br><code>.locator()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Navegar por la jerarquía DOM, buscar hijos</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Contenedor → sección → elemento</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><strong>Filtrado por texto</strong><br><code>.filter(has_text=)</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Reducir resultados por contenido visible</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Fila de tabla con texto específico</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><strong>Filtrado por sub-locator</strong><br><code>.filter(has=)</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Seleccionar padre que contiene cierto hijo</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Tarjeta que tiene badge "Nuevo"</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><strong>Exclusión</strong><br><code>.filter(has_not=)</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Excluir elementos con cierta característica</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Botones que no están deshabilitados</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><strong>Posicional</strong><br><code>.first / .last / .nth()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Seleccionar por posición cuando el orden importa</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Primer resultado de búsqueda</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><strong>Intersección</strong><br><code>.and_()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Elemento que cumple dos condiciones</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Botón que es primario Y visible</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><strong>Unión</strong><br><code>.or_()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Elemento que cumple alguna de varias condiciones</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Mensaje de error O de advertencia</td>
            </tr>
        </table>

        <h3>🛒 Ejemplo completo: Navegar un catálogo de productos</h3>
        <pre><code class="python">"""
Ejemplo completo: automatizar la navegación de un catálogo de productos
con filtrado complejo usando encadenamiento y filter().
"""
from playwright.sync_api import Page, expect
import re


def test_catalogo_completo(page: Page):
    page.goto("https://example.com/catalogo")

    # --- 1. Verificar que el catálogo cargó ---
    productos = page.locator(".catalogo .producto")
    expect(productos.first).to_be_visible()
    total = productos.count()
    print(f"Total productos en catálogo: {total}")

    # --- 2. Filtrar por categoría "Electrónica" ---
    electronicos = productos.filter(
        has=page.locator(".categoria", has_text="Electrónica")
    )
    print(f"Productos de electrónica: {electronicos.count()}")

    # --- 3. De los electrónicos, solo los disponibles ---
    disponibles = electronicos.filter(
        has_not=page.locator(".badge-agotado")
    )
    print(f"Electrónicos disponibles: {disponibles.count()}")

    # --- 4. De los disponibles, solo los con descuento ---
    con_descuento = disponibles.filter(
        has=page.locator(".precio-descuento")
    )
    print(f"Con descuento: {con_descuento.count()}")

    # --- 5. Del primer producto con descuento, obtener detalles ---
    if con_descuento.count() > 0:
        primer_oferta = con_descuento.first
        nombre = primer_oferta.locator("h3.nombre").text_content()
        precio_original = primer_oferta.locator(".precio-original").text_content()
        precio_oferta = primer_oferta.locator(".precio-descuento").text_content()

        print(f"Mejor oferta: {nombre}")
        print(f"  Precio original: {precio_original}")
        print(f"  Precio oferta: {precio_oferta}")

        # Verificar que el precio de oferta es menor
        original = float(re.sub(r"[^\\d.]", "", precio_original))
        oferta = float(re.sub(r"[^\\d.]", "", precio_oferta))
        assert oferta < original, "El precio de oferta debe ser menor"

        # --- 6. Agregar al carrito ---
        primer_oferta.locator("button", has_text="Agregar al carrito").click()

        # --- 7. Verificar badge del carrito ---
        badge_carrito = page.locator(".carrito .badge-count")
        expect(badge_carrito).to_have_text("1")

    # --- 8. Verificar todos los precios son positivos ---
    for producto in disponibles.all():
        precio_texto = producto.locator(".precio").first.text_content()
        precio_num = float(re.sub(r"[^\\d.]", "", precio_texto))
        assert precio_num > 0, f"Precio inválido: {precio_texto}"</code></pre>

        <h3>🎯 Ejercicio</h3>
        <p>Practica el encadenamiento y filtrado de locators con el siguiente ejercicio:</p>
        <ol>
            <li>Navega a <code>https://the-internet.herokuapp.com/tables</code></li>
            <li>Usa <code>page.locator("table#table1 tbody tr")</code> para obtener todas las filas</li>
            <li>Filtra con <code>.filter(has_text="Smith")</code> para encontrar la fila de Smith</li>
            <li>Encadena <code>.locator("td")</code> y usa <code>.nth(2)</code> para obtener el email</li>
            <li>Verifica el email con <code>expect(...).to_have_text("jsmith@gmail.com")</code></li>
            <li>Usa <code>.count()</code> para verificar que hay exactamente 4 filas en la tabla</li>
            <li>Usa <code>.all()</code> para iterar sobre todas las filas e imprimir los apellidos</li>
            <li><strong>Bonus:</strong> Usa <code>.filter(has_not_text="$50.00")</code> para encontrar filas
            donde el monto no es $50.00</li>
        </ol>
        <pre><code class="python"># Solución del ejercicio
from playwright.sync_api import Page, expect


def test_tabla_encadenamiento(page: Page):
    page.goto("https://the-internet.herokuapp.com/tables")

    # Todas las filas
    filas = page.locator("table#table1 tbody tr")
    expect(filas).to_have_count(4)

    # Fila de Smith
    fila_smith = filas.filter(has_text="Smith")
    expect(fila_smith).to_have_count(1)

    # Email de Smith (columna index 2)
    email_smith = fila_smith.locator("td").nth(2)
    expect(email_smith).to_have_text("jsmith@gmail.com")

    # Imprimir todos los apellidos
    for fila in filas.all():
        apellido = fila.locator("td").first.text_content()
        print(f"Apellido: {apellido}")

    # Filas donde el monto NO es $50.00
    filas_no_50 = filas.filter(has_not_text="$50.00")
    print(f"Filas sin $50.00: {filas_no_50.count()}")
    for fila in filas_no_50.all():
        texto = fila.locator("td").nth(3).text_content()
        print(f"  Monto: {texto}")</code></pre>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Dominar el encadenamiento de locators con <code>locator.locator()</code></li>
                <li>Usar <code>filter()</code> con <code>has_text</code>, <code>has_not_text</code>, <code>has</code> y <code>has_not</code></li>
                <li>Aplicar selección posicional con <code>first</code>, <code>last</code> y <code>nth()</code></li>
                <li>Contar y recorrer elementos con <code>count()</code> y <code>all()</code></li>
                <li>Combinar locators con <code>and_()</code> y <code>or_()</code></li>
                <li>Depurar locators con <code>highlight()</code> y <code>evaluate()</code></li>
                <li>Distinguir cuándo usar encadenamiento, filtrado o selección posicional</li>
            </ul>
        </div>
    `,
    topics: ["filtrado", "encadenamiento", "locators"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_041 = LESSON_041;
}
