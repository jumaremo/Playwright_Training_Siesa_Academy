/**
 * Playwright Academy - Lección 046
 * Drag and drop, hover, right-click
 * Sección 6: Interacciones Web Avanzadas
 */

const LESSON_046 = {
    id: 46,
    title: "Drag and drop, hover, right-click",
    duration: "5 min",
    level: "beginner",
    section: "section-06",
    content: `
        <h2>🖱️ Drag and drop, hover, right-click</h2>
        <p>Más allá de clicks y fills, muchas aplicaciones web modernas usan interacciones
        avanzadas del mouse: arrastrar y soltar elementos, revelar menús al pasar el cursor,
        y abrir menús contextuales con clic derecho. Playwright ofrece APIs dedicadas para
        cada una de estas interacciones.</p>

        <h3>🔀 page.drag_and_drop() — La API simple</h3>
        <p>El método más directo para arrastrar y soltar. Recibe el selector del origen y del destino:</p>
        <pre><code class="python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    page.goto("https://the-internet.herokuapp.com/drag_and_drop")

    # Drag and drop simple: de columna A a columna B
    page.drag_and_drop("#column-a", "#column-b")

    # Verificar que los elementos se intercambiaron
    header_a = page.locator("#column-a header").text_content()
    header_b = page.locator("#column-b header").text_content()
    print(f"Columna A: {header_a}, Columna B: {header_b}")

    browser.close()</code></pre>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚙️ Opciones de drag_and_drop</h4>
            <pre><code class="python"># Especificar posiciones exactas dentro de los elementos
page.drag_and_drop("#origen", "#destino",
    source_position={"x": 10, "y": 10},   # Punto dentro del origen
    target_position={"x": 50, "y": 50},   # Punto dentro del destino
)

# Forzar el drag sin esperar actionability checks
page.drag_and_drop("#origen", "#destino", force=True)

# Con timeout personalizado
page.drag_and_drop("#origen", "#destino", timeout=10000)</code></pre>
        </div>

        <h3>🔧 Drag manual: mouse.down(), mouse.move(), mouse.up()</h3>
        <p>Para escenarios complejos donde <code>drag_and_drop()</code> no funciona
        (como librerías de drag personalizadas), puedes controlar el mouse paso a paso:</p>
        <pre><code class="python"># Drag manual paso a paso
source = page.locator("#column-a")
target = page.locator("#column-b")

# Obtener las coordenadas centrales de cada elemento
source_box = source.bounding_box()
target_box = target.bounding_box()

# Calcular centros
src_x = source_box["x"] + source_box["width"] / 2
src_y = source_box["y"] + source_box["height"] / 2
tgt_x = target_box["x"] + target_box["width"] / 2
tgt_y = target_box["y"] + target_box["height"] / 2

# Ejecutar drag manual
page.mouse.move(src_x, src_y)    # Mover al origen
page.mouse.down()                 # Presionar botón
page.mouse.move(tgt_x, tgt_y,    # Mover al destino con pasos
    steps=10)                     # steps=10 genera movimiento suave
page.mouse.up()                   # Soltar botón

# Drag con pausa intermedia (para apps que necesitan tiempo)
page.mouse.move(src_x, src_y)
page.mouse.down()
page.wait_for_timeout(200)        # Pausa breve
page.mouse.move(tgt_x, tgt_y, steps=20)
page.wait_for_timeout(200)
page.mouse.up()</code></pre>

        <h3>⚠️ Cuando drag_and_drop no funciona (HTML5 DnD)</h3>
        <p>Algunos sitios usan la API HTML5 Drag and Drop con listeners de JavaScript que
        no responden bien al drag sintético de Playwright. En esos casos, usa <code>evaluate()</code>
        para disparar los eventos manualmente:</p>
        <pre><code class="python"># Workaround con evaluate para HTML5 drag events
page.evaluate("""
    () => {
        const source = document.querySelector('#column-a');
        const target = document.querySelector('#column-b');

        // Crear y disparar eventos de drag
        const dataTransfer = new DataTransfer();

        // Evento dragstart en el origen
        source.dispatchEvent(new DragEvent('dragstart', {
            dataTransfer, bubbles: true
        }));

        // Eventos sobre el destino
        target.dispatchEvent(new DragEvent('dragenter', {
            dataTransfer, bubbles: true
        }));
        target.dispatchEvent(new DragEvent('dragover', {
            dataTransfer, bubbles: true
        }));
        target.dispatchEvent(new DragEvent('drop', {
            dataTransfer, bubbles: true
        }));

        // Finalizar el drag
        source.dispatchEvent(new DragEvent('dragend', {
            dataTransfer, bubbles: true
        }));
    }
""")
# Esperar a que la UI se actualice
page.wait_for_timeout(500)</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Consejo: ¿Cuál método usar?</h4>
            <ol>
                <li>Intenta primero con <code>page.drag_and_drop()</code> — es el más simple</li>
                <li>Si no funciona, intenta el <strong>drag manual</strong> con mouse.down/move/up</li>
                <li>Como último recurso, usa el <strong>workaround con evaluate</strong> para disparar eventos HTML5</li>
            </ol>
        </div>

        <h3>🎯 page.hover() — Revelar elementos ocultos</h3>
        <p>Muchas aplicaciones muestran menús, tooltips o acciones solo cuando pasas el cursor
        sobre un elemento. <code>page.hover()</code> simula esta interacción:</p>
        <pre><code class="python"># Ejemplo con the-internet: /hovers
page.goto("https://the-internet.herokuapp.com/hovers")

# Hay 3 imágenes, al hacer hover aparece el nombre de usuario
figuras = page.locator(".figure")

# Hover sobre la primera imagen
figuras.nth(0).hover()

# Ahora el texto oculto es visible
nombre = page.locator(".figure:nth-child(1) .figcaption h5")
assert nombre.is_visible()
print(f"Usuario 1: {nombre.text_content()}")

# Hover sobre la segunda imagen
figuras.nth(1).hover()
nombre2 = page.locator(".figure:nth-child(2) .figcaption h5")
assert nombre2.is_visible()

# Hover sobre la tercera y hacer click en el link
figuras.nth(2).hover()
page.locator(".figure:nth-child(3) .figcaption a").click()</code></pre>

        <h3>📂 Secuencias hover: menú padre → submenú hijo</h3>
        <p>Un patrón común es hacer hover sobre un menú para que aparezca un submenú,
        y luego hacer click en una opción:</p>
        <pre><code class="python"># Patrón: hover en menú padre → click en hijo
# Ejemplo genérico (ajustar selectores a tu app)
page.locator("nav .menu-item").hover()        # Hover abre el submenú
page.locator("nav .submenu .opcion-1").click() # Click en subopción

# Con espera explícita si el submenú tarda en aparecer
page.locator(".dropdown-trigger").hover()
page.locator(".dropdown-menu").wait_for(state="visible")
page.locator(".dropdown-menu .item-3").click()

# Hover con opciones
page.locator(".mi-elemento").hover(
    position={"x": 5, "y": 5},   # Posición relativa dentro del elemento
    force=True,                    # Forzar sin checks de visibilidad
    timeout=5000                   # Timeout personalizado
)</code></pre>

        <h3>🖲️ Right-click: clic derecho y menús contextuales</h3>
        <pre><code class="python"># Ejemplo con the-internet: /context_menu
page.goto("https://the-internet.herokuapp.com/context_menu")

# Clic derecho en el área designada
page.locator("#hot-spot").click(button="right")

# El sitio muestra un alert de JavaScript al hacer clic derecho
# Manejar el diálogo
page.on("dialog", lambda dialog: dialog.accept())
page.locator("#hot-spot").click(button="right")

# En una app real con menú contextual custom:
# 1. Clic derecho para abrir el menú
page.locator(".elemento").click(button="right")

# 2. Esperar que aparezca el menú contextual
menu = page.locator(".context-menu")
menu.wait_for(state="visible")

# 3. Hacer click en la opción deseada
menu.locator("text=Eliminar").click()</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📝 Nota sobre menús contextuales</h4>
            <p>El menú contextual <strong>nativo del navegador</strong> (clic derecho → Copiar, Pegar, etc.)
            no se puede automatizar con Playwright porque es una UI del sistema operativo.
            Sin embargo, los <strong>menús contextuales personalizados</strong> (construidos con HTML/CSS/JS)
            sí se pueden automatizar normalmente.</p>
        </div>

        <h3>🖱️ Métodos del mouse: control total</h3>
        <p>Playwright expone el objeto <code>page.mouse</code> con control completo del puntero:</p>
        <pre><code class="python"># page.mouse — métodos disponibles

# click: clic en coordenadas absolutas
page.mouse.click(100, 200)                    # Click izquierdo
page.mouse.click(100, 200, button="right")    # Click derecho
page.mouse.click(100, 200, button="middle")   # Click del medio
page.mouse.click(100, 200, click_count=2)     # Doble click

# move: mover cursor a coordenadas
page.mouse.move(300, 400)
page.mouse.move(300, 400, steps=5)  # Movimiento gradual

# down / up: presionar / soltar botón
page.mouse.down()                     # Presionar izquierdo
page.mouse.down(button="right")      # Presionar derecho
page.mouse.up()                       # Soltar

# wheel: scroll con la rueda del mouse
page.mouse.wheel(0, 300)    # Scroll down 300px
page.mouse.wheel(0, -300)   # Scroll up 300px
page.mouse.wheel(100, 0)    # Scroll horizontal derecha

# Ejemplo: dibujar un rectángulo (canvas o similar)
page.mouse.move(100, 100)
page.mouse.down()
page.mouse.move(300, 100, steps=10)
page.mouse.move(300, 300, steps=10)
page.mouse.move(100, 300, steps=10)
page.mouse.move(100, 100, steps=10)
page.mouse.up()</code></pre>

        <h3>📱 Touch events: page.touchscreen</h3>
        <p>Para probar aplicaciones móviles o tactiles, Playwright ofrece
        <code>page.touchscreen</code>:</p>
        <pre><code class="python"># Configurar contexto con emulación de dispositivo móvil
context = browser.new_context(
    **p.devices["iPhone 13"]
)
page = context.new_page()
page.goto("https://ejemplo.com")

# Tap: equivalente a tocar la pantalla
page.touchscreen.tap(200, 300)  # Tap en coordenadas absolutas

# También puedes usar locator.tap()
page.locator("button.submit").tap()

# Nota: para swipe, usa touchscreen combinado con evaluate
# o usa los métodos de mouse con el dispositivo móvil emulado</code></pre>

        <h3>📊 Tabla resumen: métodos de interacción del mouse</h3>
        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #e3f2fd;">
                <th style="padding: 8px; border: 1px solid #ddd;">Método</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Descripción</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo</th>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.drag_and_drop()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Arrastra de un selector a otro</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.drag_and_drop("#a", "#b")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>locator.hover()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Pasa el cursor sobre el elemento</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.locator("img").hover()</code></td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>.click(button="right")</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Clic derecho sobre el elemento</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>locator.click(button="right")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.mouse.click()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Clic en coordenadas absolutas</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.mouse.click(100, 200)</code></td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.mouse.move()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Mover cursor a coordenadas</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.mouse.move(x, y, steps=10)</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.mouse.down()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Presionar botón del mouse</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.mouse.down()</code></td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.mouse.up()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Soltar botón del mouse</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.mouse.up()</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.mouse.wheel()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Scroll con rueda del mouse</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.mouse.wheel(0, 300)</code></td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.touchscreen.tap()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Toque en pantalla táctil</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.touchscreen.tap(200, 300)</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>locator.tap()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Toque sobre un locator</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.locator("btn").tap()</code></td>
            </tr>
        </table>

        <h3>🚀 Ejemplo completo: the-internet.herokuapp.com</h3>
        <pre><code class="python"># tests/test_interacciones_avanzadas.py
"""Tests de drag and drop, hover y right-click."""
import pytest
from playwright.sync_api import Page, expect


class TestDragAndDrop:
    """Tests de arrastrar y soltar."""

    def test_drag_and_drop_basico(self, page: Page):
        """Drag and drop usando la API simple."""
        page.goto("https://the-internet.herokuapp.com/drag_and_drop")

        # Verificar estado inicial
        expect(page.locator("#column-a header")).to_have_text("A")
        expect(page.locator("#column-b header")).to_have_text("B")

        # Arrastrar A a B
        page.drag_and_drop("#column-a", "#column-b")

        # Si drag_and_drop no funciona con este sitio,
        # usar el workaround con evaluate
        # (the-internet usa HTML5 DnD que a veces necesita esto)

    def test_drag_and_drop_con_evaluate(self, page: Page):
        """Workaround para sitios con HTML5 drag events."""
        page.goto("https://the-internet.herokuapp.com/drag_and_drop")

        page.evaluate("""
            () => {
                const source = document.querySelector('#column-a');
                const target = document.querySelector('#column-b');
                const dt = new DataTransfer();
                source.dispatchEvent(new DragEvent('dragstart', {
                    dataTransfer: dt, bubbles: true
                }));
                target.dispatchEvent(new DragEvent('dragenter', {
                    dataTransfer: dt, bubbles: true
                }));
                target.dispatchEvent(new DragEvent('dragover', {
                    dataTransfer: dt, bubbles: true
                }));
                target.dispatchEvent(new DragEvent('drop', {
                    dataTransfer: dt, bubbles: true
                }));
                source.dispatchEvent(new DragEvent('dragend', {
                    dataTransfer: dt, bubbles: true
                }));
            }
        """)

        # Verificar intercambio
        expect(page.locator("#column-a header")).to_have_text("B")
        expect(page.locator("#column-b header")).to_have_text("A")


class TestHover:
    """Tests de hover para revelar elementos ocultos."""

    def test_hover_revela_informacion(self, page: Page):
        """Hover sobre imágenes revela el nombre de usuario."""
        page.goto("https://the-internet.herokuapp.com/hovers")

        figuras = page.locator(".figure")
        assert figuras.count() == 3

        # Hover sobre cada figura y verificar que se revela info
        for i in range(3):
            figuras.nth(i).hover()
            caption = figuras.nth(i).locator(".figcaption")
            expect(caption).to_be_visible()
            nombre = caption.locator("h5").text_content()
            print(f"Usuario {i + 1}: {nombre}")

    def test_hover_y_click(self, page: Page):
        """Hover para revelar y luego click en el link."""
        page.goto("https://the-internet.herokuapp.com/hovers")

        # Hover sobre la primera figura
        page.locator(".figure").first.hover()

        # Click en "View profile"
        page.locator(".figure:nth-child(1) .figcaption a").click()

        # Verificar navegación
        expect(page).to_have_url("**/users/1")


class TestRightClick:
    """Tests de clic derecho y menús contextuales."""

    def test_context_menu(self, page: Page):
        """Clic derecho dispara acción del menú contextual."""
        page.goto("https://the-internet.herokuapp.com/context_menu")

        # Preparar handler para el dialog
        mensajes = []
        page.on("dialog", lambda d: (mensajes.append(d.message), d.accept()))

        # Clic derecho en el hot-spot
        page.locator("#hot-spot").click(button="right")

        # Verificar que se disparó el alert
        assert len(mensajes) > 0
        assert "You selected a context menu" in mensajes[0]</code></pre>

        <h3>🎯 Ejercicio</h3>
        <ol>
            <li>Navega a <code>https://the-internet.herokuapp.com/drag_and_drop</code> y arrastra
            la columna A a la B. Intenta con <code>drag_and_drop()</code> y si no funciona, usa
            el workaround con <code>evaluate()</code></li>
            <li>Navega a <code>/hovers</code> y haz hover sobre las 3 imágenes. Para cada una,
            verifica que el nombre de usuario aparece y extrae el texto</li>
            <li>Haz hover sobre la primera imagen y luego haz click en "View profile" para navegar</li>
            <li>Navega a <code>/context_menu</code>, haz clic derecho en el hot-spot y captura
            el mensaje del dialog con <code>page.on("dialog", ...)</code></li>
            <li>Usa <code>page.mouse.wheel(0, 500)</code> para hacer scroll hacia abajo en cualquier página</li>
            <li>Experimenta con <code>page.mouse.down()</code>, <code>mouse.move()</code> y
            <code>mouse.up()</code> para hacer un drag manual paso a paso</li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Usar <code>page.drag_and_drop()</code> y conocer sus opciones</li>
                <li>Realizar drag manual con <code>mouse.down/move/up</code> para casos complejos</li>
                <li>Aplicar el workaround con evaluate para HTML5 drag events</li>
                <li>Usar <code>hover()</code> para revelar menús, tooltips y acciones ocultas</li>
                <li>Hacer clic derecho con <code>button="right"</code> e interactuar con menús contextuales</li>
                <li>Conocer los métodos del mouse y touchscreen de Playwright</li>
            </ul>
        </div>

        <h3>➡️ Siguiente: Keyboard events avanzados</h3>
        <p>En la siguiente lección exploraremos eventos de teclado avanzados: combinaciones
        de teclas, atajos, teclas especiales y cómo simular escritura realista.</p>
    `,
    topics: ["drag-drop", "hover", "right-click"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_046 = LESSON_046;
}
