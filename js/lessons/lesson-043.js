/**
 * Playwright Academy - Lección 043
 * Estrategias de localizadores robustos
 * Sección 5: Localizadores y Selectores
 */

const LESSON_043 = {
    id: 43,
    title: "Estrategias de localizadores robustos",
    duration: "5 min",
    level: "beginner",
    section: "section-05",
    content: `
        <h2>🛡️ Estrategias de localizadores robustos</h2>
        <p>Escribir localizadores que <strong>sobrevivan a cambios en la UI</strong> es una de las habilidades
        más valiosas de un QA automation engineer. En esta lección aprenderás estrategias concretas para
        crear selectores resistentes al cambio, detectar anti-patrones comunes y usar las herramientas
        de Playwright para descubrir los mejores localizadores.</p>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚠️ El problema de la fragilidad</h4>
            <p>Los tests de UI son famosos por romperse cuando el equipo de desarrollo hace cambios
            cosméticos: renombrar una clase CSS, reorganizar el DOM, cambiar un texto o actualizar
            un framework de componentes. El <strong>80% de los falsos negativos</strong> en test suites
            de UI se deben a localizadores frágiles, no a bugs reales.</p>
            <p>Un localizador frágil genera:</p>
            <ul>
                <li><strong>Desconfianza:</strong> el equipo ignora los fallos porque "siempre fallan"</li>
                <li><strong>Costo de mantenimiento:</strong> horas arreglando tests en vez de escribir nuevos</li>
                <li><strong>Cobertura pobre:</strong> se eliminan tests en lugar de arreglarlos</li>
            </ul>
        </div>

        <h3>🏗️ La pirámide de prioridad de localizadores</h3>
        <p>Playwright recomienda un orden de preferencia claro. Cuanto más arriba en la pirámide,
        más robusto y semántico es el localizador:</p>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin: 10px 0;">
                <tr style="background: #2e7d32; color: white;">
                    <th style="padding: 10px; border: 1px solid #ddd;">Prioridad</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Tipo</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Método Playwright</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Robustez</th>
                </tr>
                <tr style="background: #c8e6c9;">
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-weight: bold;">1 (Mejor)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Rol ARIA</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>get_by_role()</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Muy alta</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-weight: bold;">2</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Label / Placeholder / Texto</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>get_by_label()</code>, <code>get_by_placeholder()</code>, <code>get_by_text()</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Alta</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-weight: bold;">3</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Test ID</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>get_by_test_id()</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Alta</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-weight: bold;">4</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">CSS Selector</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>locator("css=...")</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Media</td>
                </tr>
                <tr style="background: #ffebee;">
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-weight: bold;">5 (Peor)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">XPath</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>locator("xpath=...")</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Baja</td>
                </tr>
            </table>
        </div>

        <h3>🎯 Estrategia 1: Preferir atributos orientados al usuario</h3>
        <p>Los localizadores basados en <strong>role</strong>, <strong>label</strong>, <strong>placeholder</strong>
        y <strong>texto visible</strong> reflejan cómo el usuario percibe la página. Son los más estables
        porque el equipo de desarrollo rara vez cambia la funcionalidad visible sin actualizar los tests.</p>

        <pre><code class="python"># ✅ EXCELENTE: Basados en cómo el usuario ve la página
page.get_by_role("button", name="Guardar cambios")
page.get_by_role("textbox", name="Correo electrónico")
page.get_by_role("link", name="Ir al carrito")
page.get_by_role("heading", name="Bienvenido")
page.get_by_role("checkbox", name="Acepto los términos")

# ✅ MUY BUENO: Basados en labels y placeholders
page.get_by_label("Correo electrónico")
page.get_by_placeholder("Ingresa tu contraseña")
page.get_by_text("Iniciar sesión")
page.get_by_alt_text("Logo de la empresa")
page.get_by_title("Configuración de perfil")

# ❌ EVITAR: Basados en implementación interna
page.locator(".btn-primary.submit-form.mt-4")
page.locator("#react-select-3-input")
page.locator("div > div > form > button:nth-child(3)")</code></pre>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 ¿Por qué roles y labels son más estables?</h4>
            <p>Cuando un desarrollador cambia de Bootstrap a Tailwind CSS, todas las clases CSS cambian.
            Pero el botón "Guardar" sigue siendo un botón con el texto "Guardar". Los atributos
            <strong>semánticos</strong> (role, label, texto) están ligados a la <strong>funcionalidad</strong>,
            no a la <strong>implementación visual</strong>.</p>
        </div>

        <h3>🏷️ Estrategia 2: Usar data-testid como respaldo</h3>
        <p>Cuando no hay un rol, label o texto significativo disponible (por ejemplo, un icono sin texto
        o un div genérico), el atributo <code>data-testid</code> es la mejor alternativa. Es un contrato
        explícito entre desarrollo y QA: "este atributo existe para testing".</p>

        <pre><code class="python"># En el HTML (agregado por desarrollo):
# &lt;button data-testid="submit-order"&gt;
#     &lt;svg&gt;...icono...&lt;/svg&gt;
# &lt;/button&gt;
#
# &lt;div data-testid="cart-badge"&gt;3&lt;/div&gt;
# &lt;tr data-testid="product-row-42"&gt;...&lt;/tr&gt;

# En Playwright:
page.get_by_test_id("submit-order").click()
page.get_by_test_id("cart-badge").text_content()
page.get_by_test_id("product-row-42").locator("td").first</code></pre>

        <h4>📏 Convenciones de nomenclatura para data-testid</h4>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #ce93d8;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Patrón</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Cuándo usarlo</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>accion-entidad</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>submit-order</code>, <code>delete-user</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Botones y acciones</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>entidad-campo</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>user-email</code>, <code>product-price</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Campos de formulario</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>entidad-seccion</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>cart-summary</code>, <code>nav-header</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Contenedores / secciones</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>entidad-tipo-id</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>product-row-42</code>, <code>user-card-7</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Elementos dinámicos con ID</td>
                </tr>
            </table>
            <p style="margin-top: 10px;"><strong>Reglas:</strong> usar kebab-case, ser descriptivo,
            no incluir detalles de implementación (evitar <code>data-testid="div-wrapper-3"</code>).</p>
        </div>

        <pre><code class="python"># Configurar el atributo personalizado (si tu app usa otro nombre)
# En conftest.py o playwright.config:
# playwright.selectors.set_test_id_attribute("data-qa")

# Cuándo agregar data-testid:
# - Elementos sin texto visible (botones con solo íconos)
# - Elementos dinámicos generados por un framework
# - Contenedores que necesitas como punto de anclaje
# - Elementos donde el texto cambia según el idioma (i18n)

# Cuándo NO agregar data-testid:
# - El elemento ya tiene un role + name claro
# - Hay un label asociado al campo
# - El texto visible es estable y significativo</code></pre>

        <h3>🚫 Estrategia 3: Evitar detalles de implementación</h3>
        <p>Los localizadores más frágiles son los que dependen de la <strong>estructura interna</strong>
        del DOM o de <strong>clases CSS generadas</strong> por frameworks.</p>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>❌ Anti-patrones comunes</h4>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #ef9a9a;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Anti-patrón</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo frágil</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Por qué falla</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Alternativa robusta</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">Dependencia de posición</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>li:nth-child(3)</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Agregar un item antes rompe el índice</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_text("Mi Item")</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">IDs auto-generados</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>#react-select-3-input</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">El número cambia al agregar componentes</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("combobox")</code></td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">Clases CSS de framework</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>.MuiButton-root.css-1a2b3c</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Hashes cambian en cada build</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("button", name="...")</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">Cadenas DOM largas</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>div > div > div > span > a</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Cualquier reestructuración rompe la cadena</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("link", name="...")</code></td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">XPath absolutos</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>/html/body/div[2]/form/input[1]</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Un wrapper nuevo invalida toda la ruta</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_label("Nombre")</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">Clases utilitarias</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>.mt-4.px-2.text-blue-500</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Tailwind/Bootstrap clases cambian al rediseñar</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_test_id("...")</code></td>
                </tr>
            </table>
        </div>

        <h3>🔍 Estrategia 4: Usar Playwright Codegen para descubrir localizadores</h3>
        <p>Playwright incluye un <strong>generador de código</strong> que graba tus interacciones
        y produce automáticamente los localizadores más robustos disponibles. Es la forma más rápida
        de encontrar buenos selectores.</p>

        <pre><code class="bash"># Abrir el generador de código
playwright codegen https://the-internet.herokuapp.com

# Con opciones adicionales
playwright codegen --browser chromium --viewport-size "1280,720" https://mi-sitio.com

# Generar código en Python (por defecto)
playwright codegen --target python https://mi-sitio.com

# Generar código para pytest-playwright
playwright codegen --target python-pytest https://mi-sitio.com

# Con dispositivo móvil
playwright codegen --device "iPhone 13" https://mi-sitio.com</code></pre>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🖥️ Cómo funciona codegen</h4>
            <ol>
                <li>Se abre un navegador y una ventana lateral con el código generado</li>
                <li>Cada clic, escritura o navegación se traduce a código Python</li>
                <li>Playwright elige automáticamente el <strong>localizador más robusto</strong> disponible
                (prioriza roles y labels sobre CSS)</li>
                <li>Puedes copiar el código generado y pegarlo en tus tests</li>
                <li>Ajusta manualmente si necesitas: el codegen da un excelente punto de partida</li>
            </ol>
        </div>

        <pre><code class="python"># Ejemplo de código generado por codegen:
# (Playwright elige automáticamente el mejor localizador)

from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()

    page.goto("https://the-internet.herokuapp.com/login")

    # Codegen genera get_by_role en vez de selectores CSS
    page.get_by_label("Username").fill("tomsmith")
    page.get_by_label("Password").fill("SuperSecretPassword!")
    page.get_by_role("button", name="Login").click()

    # En vez de: page.locator("#username").fill(...)
    # En vez de: page.locator("button.radius").click()

    browser.close()</code></pre>

        <h3>🔬 Playwright Inspector y Pick Locator</h3>
        <p>El <strong>Playwright Inspector</strong> es una herramienta de depuración que incluye una función
        de <strong>Pick Locator</strong> para encontrar el mejor selector para cualquier elemento.</p>

        <pre><code class="bash"># Abrir el Inspector durante la ejecución
PWDEBUG=1 pytest tests/test_login.py -v

# O en Windows:
set PWDEBUG=1 && pytest tests/test_login.py -v</code></pre>

        <pre><code class="python"># También puedes pausar programáticamente
def test_encontrar_localizador(page):
    page.goto("https://mi-sitio.com")

    # Pausar aquí para usar el Inspector
    page.pause()

    # El Inspector te permite:
    # 1. Hacer clic en "Pick Locator" (icono de cursor)
    # 2. Pasar el mouse sobre cualquier elemento
    # 3. Ver el localizador sugerido por Playwright
    # 4. Copiar el localizador directamente

    # También puedes probar localizadores en la consola del Inspector:
    # >> page.locator("text=Login").count()
    # >> page.get_by_role("button", name="Login").is_visible()</code></pre>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Flujo de trabajo con el Inspector</h4>
            <ol>
                <li>Ejecuta con <code>PWDEBUG=1</code></li>
                <li>El navegador se abre con el Inspector al lado</li>
                <li>Haz clic en <strong>"Pick Locator"</strong> (icono de cursor con diana)</li>
                <li>Pasa el mouse sobre el elemento que te interesa</li>
                <li>El Inspector muestra el localizador recomendado en la barra inferior</li>
                <li>Haz clic en el elemento para fijar el localizador</li>
                <li>Copia el localizador y úsalo en tu test</li>
            </ol>
        </div>

        <h3>🎯 Estrategia 5: Mantener localizadores cercanos a la intención del usuario</h3>
        <p>Un buen localizador debería leerse como una instrucción que le darías a un usuario humano.
        Si no puedes describir el localizador en términos de la UI visible, probablemente es demasiado técnico.</p>

        <pre><code class="python"># ✅ Se lee como instrucción humana:
# "Haz clic en el botón Enviar"
page.get_by_role("button", name="Enviar").click()

# "Escribe tu email en el campo Correo electrónico"
page.get_by_label("Correo electrónico").fill("test@example.com")

# "Marca la casilla Acepto los términos"
page.get_by_role("checkbox", name="Acepto los términos").check()

# "Verifica que el encabezado dice Bienvenido"
expect(page.get_by_role("heading", name="Bienvenido")).to_be_visible()


# ❌ No se traduce a instrucciones humanas:
# "Haz clic en el div con clase MuiButton-root dentro del form"
page.locator("form .MuiButton-root.css-abc123").click()

# "Escribe en el input que es el tercer hijo del segundo div"
page.locator("div:nth-child(2) > input:nth-child(3)").fill("test@example.com")</code></pre>

        <h3>📋 Tabla comparativa: localizadores buenos vs malos</h3>
        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #e3f2fd;">
                <th style="padding: 8px; border: 1px solid #ddd;">Caso</th>
                <th style="padding: 8px; border: 1px solid #ddd;">❌ Frágil</th>
                <th style="padding: 8px; border: 1px solid #ddd;">✅ Robusto</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Razón</th>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Botón de login</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>.btn-primary</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("button", name="Login")</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Clase CSS puede cambiar</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;">Campo email</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>#email-field-1</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_label("Email")</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">ID puede ser auto-generado</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Enlace del menú</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>nav > ul > li:nth-child(3) > a</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("link", name="Productos")</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Posición cambia al agregar items</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;">Mensaje de error</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>.error-msg.red.text-sm</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("alert")</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Clases utilitarias se reorganizan</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Checkbox</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>input[type=checkbox]:first</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("checkbox", name="Recordarme")</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Orden puede cambiar</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;">Celda de tabla</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>tr:nth-child(2) td:nth-child(4)</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("row", name="Juan").get_by_role("cell").nth(3)</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Filas/columnas se reordenan</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Icono sin texto</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>svg.icon-trash</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_test_id("delete-item")</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Icono puede cambiar de librería</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;">Input de búsqueda</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>#__next div input</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_placeholder("Buscar...")</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Estructura interna del framework</td>
            </tr>
        </table>

        <h3>🔧 Qué sobrevive a un rediseño de UI</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📊 Análisis de estabilidad ante cambios</h4>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #c8e6c9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Tipo de cambio</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">role/label</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">data-testid</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">CSS class</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">XPath absoluto</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">Cambio de framework CSS</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">✅ Sobrevive</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">✅ Sobrevive</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">❌ Se rompe</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">❌ Se rompe</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">Reorganización del DOM</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">✅ Sobrevive</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">✅ Sobrevive</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">⚠️ Depende</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">❌ Se rompe</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">Cambio de texto visible</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">⚠️ Puede romperse</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">✅ Sobrevive</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">✅ Sobrevive</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">✅ Sobrevive</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">Migración React a Vue</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">✅ Sobrevive</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">✅ Sobrevive</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">❌ Se rompe</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">❌ Se rompe</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">Agregar/quitar elementos</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">✅ Sobrevive</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">✅ Sobrevive</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">✅ Sobrevive</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">❌ Se rompe</td>
                </tr>
            </table>
        </div>

        <h3>✅ Checklist de auditoría de localizadores</h3>
        <p>Usa esta lista durante code reviews para evaluar la calidad de los localizadores:</p>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📋 Checklist para revisión de código</h4>
            <ol>
                <li><strong>¿Usa get_by_role() cuando es posible?</strong> — Es siempre la primera opción</li>
                <li><strong>¿El localizador refleja la intención del usuario?</strong> — "Clic en Guardar" vs "Clic en .btn-3"</li>
                <li><strong>¿Depende de clases CSS?</strong> — Si las clases son de un framework (Material UI, Tailwind), es frágil</li>
                <li><strong>¿Usa índices posicionales (nth-child)?</strong> — Preguntar si hay una alternativa semántica</li>
                <li><strong>¿Es un XPath absoluto?</strong> — Casi siempre hay una mejor opción</li>
                <li><strong>¿El test-id sigue la convención del equipo?</strong> — kebab-case, descriptivo, sin detalles de implementación</li>
                <li><strong>¿El localizador sobreviviría a un rediseño CSS?</strong> — Cambiar de Bootstrap a Tailwind</li>
                <li><strong>¿Hay un localizador duplicado?</strong> — Si se usa en múltiples tests, debería estar en una Page Class</li>
                <li><strong>¿Se puede probar en el Inspector?</strong> — Ejecutar con <code>PWDEBUG=1</code> y verificar que encuentra exactamente un elemento</li>
                <li><strong>¿Es único en la página?</strong> — El localizador debe encontrar exactamente 1 elemento (salvo listas intencionales)</li>
            </ol>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <p>A continuación tienes un conjunto de localizadores frágiles. Tu tarea es <strong>reescribirlos</strong>
        usando las estrategias aprendidas en esta lección.</p>

        <pre><code class="python"># === EJERCICIO: Mejorar estos localizadores frágiles ===
# Para cada uno, escribe la versión robusta usando Playwright

# 1. Botón de envío
# Frágil:
page.locator("form > div.actions > button.btn.btn-primary.submit-btn")
# Robusto: ???

# 2. Campo de búsqueda
# Frágil:
page.locator("#__next > div > header > div:nth-child(2) > input")
# Robusto: ???

# 3. Link del menú
# Frágil:
page.locator("nav > ul.main-menu > li:nth-child(4) > a")
# Robusto: ???

# 4. Mensaje de éxito
# Frágil:
page.locator("div.alert.alert-success.fade.show")
# Robusto: ???

# 5. Fila de tabla con nombre "García"
# Frágil:
page.locator("table > tbody > tr:nth-child(3)")
# Robusto: ???

# 6. Checkbox de "Recordarme"
# Frágil:
page.locator("#login-form input[type='checkbox']")
# Robusto: ???

# 7. Dropdown de país
# Frágil:
page.locator("select.form-control.country-select.mt-2")
# Robusto: ???

# 8. Botón de eliminar (solo icono, sin texto)
# Frágil:
page.locator("tr:nth-child(2) td:last-child button svg.trash-icon")
# Robusto: ???


# === RESPUESTAS SUGERIDAS ===

# 1. page.get_by_role("button", name="Enviar")
# 2. page.get_by_placeholder("Buscar...") o page.get_by_role("searchbox")
# 3. page.get_by_role("link", name="Contacto")
# 4. page.get_by_role("alert") o page.get_by_text("Operación exitosa")
# 5. page.get_by_role("row", name="García")
#    o page.locator("tr").filter(has_text="García")
# 6. page.get_by_role("checkbox", name="Recordarme")
#    o page.get_by_label("Recordarme")
# 7. page.get_by_label("País") o page.get_by_role("combobox", name="País")
# 8. page.get_by_test_id("delete-item")
#    (requiere que desarrollo agregue data-testid)</code></pre>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Comprender por qué los tests de UI se rompen y cómo prevenirlo</li>
                <li>Aplicar la pirámide de prioridad: role > label/text > test-id > CSS > XPath</li>
                <li>Usar <code>data-testid</code> con convenciones de nomenclatura claras</li>
                <li>Identificar y corregir anti-patrones comunes de localizadores</li>
                <li>Usar <code>playwright codegen</code> para descubrir localizadores robustos</li>
                <li>Usar el Inspector y Pick Locator para depurar selectores</li>
                <li>Aplicar el checklist de auditoría en code reviews</li>
                <li>Evaluar qué localizadores sobreviven a cambios de UI</li>
            </ul>
        </div>
    `,
    topics: ["estrategias", "robustos", "mantenimiento"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_043 = LESSON_043;
}
