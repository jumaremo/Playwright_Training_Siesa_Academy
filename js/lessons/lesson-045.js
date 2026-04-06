/**
 * Playwright Academy - Lección 045
 * JavaScript execution desde Playwright
 * Sección 6: Interacciones Web Avanzadas
 */

const LESSON_045 = {
    id: 45,
    title: "JavaScript execution desde Playwright",
    duration: "8 min",
    level: "beginner",
    section: "section-06",
    content: `
        <h2>⚡ JavaScript execution desde Playwright</h2>
        <p>Playwright permite ejecutar código JavaScript directamente en el contexto del navegador.
        Esto es una herramienta poderosa para leer estado oculto, manipular el DOM, disparar eventos
        personalizados y acceder a APIs del navegador que no están expuestas directamente
        por la API de Playwright.</p>

        <h3>🤔 ¿Por qué ejecutar JavaScript en los tests?</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Aunque Playwright cubre la gran mayoría de interacciones, hay escenarios donde
            necesitas acceso directo al JavaScript del navegador:</p>
            <ul>
                <li><strong>Leer estado oculto:</strong> variables globales, estado de la app (Redux, Vuex)</li>
                <li><strong>Modificar el DOM:</strong> cambiar atributos, inyectar elementos para testing</li>
                <li><strong>Disparar eventos:</strong> eventos personalizados que no se pueden simular con click/fill</li>
                <li><strong>Scroll programático:</strong> scroll a coordenadas específicas, scroll infinito</li>
                <li><strong>Acceder a APIs del navegador:</strong> localStorage, sessionStorage, IndexedDB, Canvas</li>
                <li><strong>Leer estilos computados:</strong> verificar CSS aplicado dinámicamente</li>
                <li><strong>Extraer datos complejos:</strong> tablas, listas anidadas, datos de SPAs</li>
            </ul>
        </div>

        <h3>🔧 page.evaluate() — El método fundamental</h3>
        <p><code>page.evaluate()</code> ejecuta una función JavaScript en el contexto del navegador
        y devuelve el resultado serializado a Python. Es el método más usado para ejecución de JS.</p>
        <pre><code class="python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://the-internet.herokuapp.com")

    # Ejecutar JS simple — retorna un valor
    titulo = page.evaluate("document.title")
    print(f"Título: {titulo}")

    # Ejecutar una función arrow
    url = page.evaluate("() => window.location.href")
    print(f"URL: {url}")

    # Obtener dimensiones de la ventana
    dimensiones = page.evaluate("""() => ({
        ancho: window.innerWidth,
        alto: window.innerHeight,
        scrollY: window.scrollY
    })""")
    print(f"Ventana: {dimensiones['ancho']}x{dimensiones['alto']}")

    # Contar elementos en el DOM
    total_links = page.evaluate("document.querySelectorAll('a').length")
    print(f"Links en la página: {total_links}")

    # Leer localStorage
    page.evaluate("localStorage.setItem('test_key', 'valor_prueba')")
    valor = page.evaluate("localStorage.getItem('test_key')")
    print(f"localStorage: {valor}")

    browser.close()</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚠️ Importante: Serialización</h4>
            <p><code>page.evaluate()</code> serializa el resultado con <code>JSON.stringify</code>
            internamente. Esto significa que:</p>
            <ul>
                <li>Puedes retornar: strings, números, booleanos, arrays, objetos planos, null</li>
                <li><strong>No puedes retornar:</strong> elementos DOM, funciones, objetos con referencias circulares</li>
                <li>Si necesitas un elemento DOM, usa <code>page.evaluate_handle()</code></li>
            </ul>
        </div>

        <h3>📤 Pasar argumentos de Python a JavaScript</h3>
        <p>Puedes enviar valores desde Python al contexto JS como argumentos de la función:</p>
        <pre><code class="python"># Pasar un argumento simple
selector = "#content h1"
texto = page.evaluate("(sel) => document.querySelector(sel).textContent", selector)

# Pasar múltiples argumentos como objeto
datos = {"selector": "h1", "atributo": "textContent"}
resultado = page.evaluate("""
    (args) => {
        const el = document.querySelector(args.selector);
        return el ? el[args.atributo] : null;
    }
""", datos)

# Pasar un array
indices = [0, 2, 4]
textos = page.evaluate("""
    (ids) => {
        const links = document.querySelectorAll('#content ul li a');
        return ids.map(i => links[i]?.textContent || null);
    }
""", indices)
print(f"Links seleccionados: {textos}")

# Usar argumentos para inyectar datos de test
page.evaluate("""
    (config) => {
        window.__TEST_CONFIG__ = config;
        console.log('Config de test inyectada:', config);
    }
""", {"ambiente": "test", "timeout": 5000})</code></pre>

        <h3>🔗 page.evaluate_handle() — Retornar objetos JS</h3>
        <p>Cuando necesitas un <strong>handle</strong> (referencia) a un objeto JavaScript en lugar
        de su valor serializado, usa <code>evaluate_handle()</code>:</p>
        <pre><code class="python"># Obtener un handle a un elemento DOM
handle = page.evaluate_handle("document.querySelector('h1')")
print(f"Tipo: {handle}")

# Usar el handle para obtener propiedades
texto = handle.get_property("textContent").json_value()
print(f"Texto del h1: {texto}")

# Obtener handle a un objeto complejo
window_handle = page.evaluate_handle("window")
location_handle = window_handle.get_property("location")
href = location_handle.get_property("href").json_value()
print(f"href: {href}")

# Obtener handle al objeto navigator
nav_handle = page.evaluate_handle("navigator")
user_agent = nav_handle.get_property("userAgent").json_value()
print(f"User-Agent: {user_agent}")

# Liberar el handle cuando ya no lo necesitas
handle.dispose()</code></pre>

        <h3>🎯 eval_on_selector() y eval_on_selector_all()</h3>
        <p>Estos métodos ejecutan JS directamente sobre elementos seleccionados, pasando
        el elemento como primer argumento a la función:</p>
        <pre><code class="python"># eval_on_selector — ejecutar sobre UN elemento
# El elemento se pasa como primer argumento (e)
texto = page.eval_on_selector("h1", "e => e.textContent")
print(f"H1: {texto}")

# Obtener atributos
href = page.eval_on_selector(
    "#content ul li:first-child a",
    "e => e.getAttribute('href')"
)
print(f"Primer link: {href}")

# Obtener bounding box
box = page.eval_on_selector("h1", """e => {
    const rect = e.getBoundingClientRect();
    return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
    };
}""")
print(f"Posición del h1: x={box['x']}, y={box['y']}")

# eval_on_selector_all — ejecutar sobre TODOS los elementos
todos_los_links = page.eval_on_selector_all(
    "#content ul li a",
    "elements => elements.map(e => ({texto: e.textContent, href: e.href}))"
)
print(f"Total links: {len(todos_los_links)}")
for link in todos_los_links[:5]:
    print(f"  {link['texto']} → {link['href']}")</code></pre>

        <h3>📌 locator.evaluate() y locator.evaluate_all()</h3>
        <p>Los localizadores de Playwright también tienen métodos evaluate para ejecutar
        JS directamente sobre los elementos localizados:</p>
        <pre><code class="python"># locator.evaluate() — sobre el primer elemento coincidente
heading = page.locator("h1")
texto = heading.evaluate("el => el.textContent")
font_size = heading.evaluate("el => getComputedStyle(el).fontSize")
print(f"H1: '{texto}' con font-size: {font_size}")

# Verificar si un elemento tiene una clase específica
tiene_clase = page.locator("#flash").evaluate(
    "el => el.classList.contains('success')"
)

# Obtener data attributes
data_val = page.locator("[data-testid='mi-componente']").evaluate(
    "el => el.dataset.testid"
)

# locator.evaluate_all() — sobre TODOS los coincidentes
links = page.locator("#content ul li a")
todos_textos = links.evaluate_all("elements => elements.map(e => e.textContent.trim())")
print(f"Textos de links: {todos_textos}")

# Obtener los links visibles
visibles = links.evaluate_all("""
    elements => elements
        .filter(e => e.offsetParent !== null)
        .map(e => e.textContent.trim())
""")</code></pre>

        <h3>🎨 Patrones comunes de evaluate</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Patrones que usarás frecuentemente en tus tests:</h4>
        </div>
        <pre><code class="python"># 1. Leer estilos computados
color = page.evaluate("""
    () => getComputedStyle(document.querySelector('.flash.success')).color
""")

# 2. Verificar localStorage / sessionStorage
token = page.evaluate("localStorage.getItem('auth_token')")
session = page.evaluate("sessionStorage.getItem('user_data')")

# 3. Leer data attributes
page.evaluate("""
    () => document.querySelector('[data-react-props]')
           .getAttribute('data-react-props')
""")

# 4. Scroll a un elemento específico
page.evaluate("""
    () => document.querySelector('#footer').scrollIntoView({
        behavior: 'smooth', block: 'center'
    })
""")

# 5. Scroll a coordenadas
page.evaluate("window.scrollTo(0, document.body.scrollHeight)")

# 6. Obtener propiedades del DOM
propiedades = page.evaluate("""() => ({
    title: document.title,
    url: document.URL,
    readyState: document.readyState,
    cookies: document.cookie,
    referrer: document.referrer
})""")

# 7. Verificar si un evento listener está registrado
# (indirectamente, verificando el comportamiento)
page.evaluate("""
    () => {
        const event = new Event('custom-event');
        document.dispatchEvent(event);
    }
""")

# 8. Leer el estado de una SPA (React, Vue, Angular)
# React (si está en modo desarrollo)
react_state = page.evaluate("""
    () => {
        const root = document.querySelector('#root');
        const fiber = root?._reactRootContainer?._internalRoot?.current;
        return fiber ? 'React app detectada' : 'No es React';
    }
""")</code></pre>

        <h3>💉 Inyectar scripts y estilos</h3>
        <pre><code class="python"># Inyectar un script externo
await_tag = page.add_script_tag(url="https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js")
# Ahora puedes usar lodash en evaluate
resultado = page.evaluate("_.VERSION")  # "4.17.21"

# Inyectar script inline
page.add_script_tag(content="""
    window.helperTest = {
        limpiarFormulario: () => {
            document.querySelectorAll('input').forEach(i => i.value = '');
        },
        contarElementos: (selector) => {
            return document.querySelectorAll(selector).length;
        }
    };
""")
# Usar las funciones inyectadas
page.evaluate("window.helperTest.limpiarFormulario()")
total = page.evaluate("window.helperTest.contarElementos('a')")

# Inyectar estilos para depuración visual
page.add_style_tag(content="""
    /* Resaltar todos los botones durante el test */
    button, [role="button"] {
        outline: 3px solid red !important;
        outline-offset: 2px;
    }
    /* Resaltar inputs */
    input, select, textarea {
        outline: 3px solid blue !important;
    }
""")

# Inyectar stylesheet externo
page.add_style_tag(url="https://example.com/debug-styles.css")</code></pre>

        <h3>🔄 page.expose_function() — Exponer Python al navegador</h3>
        <p>Con <code>expose_function()</code> puedes exponer una función Python para que
        sea llamada desde JavaScript en el navegador:</p>
        <pre><code class="python">import hashlib
import json

# Exponer una función Python al navegador
def calcular_hash(texto):
    return hashlib.sha256(texto.encode()).hexdigest()

page.expose_function("calcularHash", calcular_hash)

# Ahora JavaScript puede llamar a esta función
hash_resultado = page.evaluate("""
    async () => {
        const hash = await window.calcularHash('mi texto secreto');
        return hash;
    }
""")
print(f"Hash: {hash_resultado}")

# Ejemplo práctico: logging desde el navegador
logs_capturados = []

def capturar_log(mensaje):
    logs_capturados.append(mensaje)
    print(f"[BROWSER LOG] {mensaje}")

page.expose_function("logTest", capturar_log)

# El código del navegador puede llamar logTest()
page.evaluate("""
    () => {
        window.logTest('Formulario enviado');
        window.logTest('Respuesta recibida');
    }
""")
print(f"Logs capturados: {logs_capturados}")</code></pre>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔒 Seguridad y buenas prácticas</h4>
            <ul>
                <li><strong>No ejecutes JS arbitrario de fuentes externas</strong> — solo usa evaluate con código que tú controlas</li>
                <li><strong>Evita modificar el DOM innecesariamente</strong> — puede afectar el comportamiento de la app</li>
                <li><strong>Prefiere la API nativa de Playwright</strong> cuando sea posible (es más estable y legible)</li>
                <li><strong>Usa evaluate como último recurso</strong> — primero intenta con locators, assertions y acciones estándar</li>
                <li><strong>Maneja errores</strong> — el JS ejecutado puede lanzar excepciones que se propagan a Python</li>
                <li><strong>Cuidado con async</strong> — <code>evaluate</code> soporta funciones async, pero recuerda usar <code>await</code> dentro del JS</li>
            </ul>
        </div>

        <h3>📊 Tabla comparativa de métodos evaluate</h3>
        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #e3f2fd;">
                <th style="padding: 8px; border: 1px solid #ddd;">Método</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Contexto</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Retorna</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Uso típico</th>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.evaluate()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Página completa</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Valor serializado</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Leer/modificar estado global</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.evaluate_handle()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Página completa</td>
                <td style="padding: 6px; border: 1px solid #ddd;">JSHandle (referencia)</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Obtener objetos JS complejos</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.eval_on_selector()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Un elemento</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Valor serializado</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Leer propiedades de un elemento</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.eval_on_selector_all()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Múltiples elementos</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Valor serializado</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Extraer datos de listas/tablas</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>locator.evaluate()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Elemento del locator</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Valor serializado</td>
                <td style="padding: 6px; border: 1px solid #ddd;">JS sobre un locator específico</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>locator.evaluate_all()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Todos los del locator</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Valor serializado</td>
                <td style="padding: 6px; border: 1px solid #ddd;">JS sobre todos los coincidentes</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.expose_function()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Python → navegador</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Binds función</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Exponer utilidades Python al JS</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.add_script_tag()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Página completa</td>
                <td style="padding: 6px; border: 1px solid #ddd;">ElementHandle</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Inyectar bibliotecas JS</td>
            </tr>
        </table>

        <h3>🚀 Ejemplo completo: Extraer datos de una SPA</h3>
        <pre><code class="python"># tests/test_js_execution.py
"""Test que demuestra extracción de datos complejos con evaluate."""
import pytest
from playwright.sync_api import Page, expect


class TestJavaScriptExecution:
    """Tests de ejecución de JavaScript desde Playwright."""

    def test_extraer_tabla_completa(self, page: Page):
        """Extraer todos los datos de una tabla HTML con evaluate."""
        page.goto("https://the-internet.herokuapp.com/tables")

        # Extraer datos de la tabla #table1
        datos = page.eval_on_selector_all(
            "#table1 tbody tr",
            """rows => rows.map(row => {
                const cells = row.querySelectorAll('td');
                return {
                    apellido: cells[0].textContent,
                    nombre: cells[1].textContent,
                    email: cells[2].textContent,
                    monto: cells[3].textContent,
                    sitio: cells[4].textContent
                };
            })"""
        )

        # Verificar datos extraídos
        assert len(datos) == 4, f"Se esperaban 4 filas, hay {len(datos)}"
        emails = [d["email"] for d in datos]
        assert "jsmith@gmail.com" in emails

        # Encontrar el de mayor monto
        mayor = page.evaluate("""
            () => {
                const rows = document.querySelectorAll('#table1 tbody tr');
                let max = {nombre: '', monto: 0};
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    const monto = parseFloat(cells[3].textContent.replace('$', ''));
                    if (monto > max.monto) {
                        max = {
                            nombre: cells[1].textContent + ' ' + cells[0].textContent,
                            monto: monto
                        };
                    }
                });
                return max;
            }
        """)
        print(f"Mayor monto: {mayor['nombre']} = ${mayor['monto']}")

    def test_verificar_estilos_computados(self, page: Page):
        """Verificar estilos CSS computados con evaluate."""
        page.goto("https://the-internet.herokuapp.com/login")
        page.fill("#username", "tomsmith")
        page.fill("#password", "SuperSecretPassword!")
        page.click("button[type='submit']")

        # Verificar color del mensaje de éxito
        estilos = page.eval_on_selector("#flash", """el => {
            const style = getComputedStyle(el);
            return {
                color: style.color,
                backgroundColor: style.backgroundColor,
                display: style.display,
                visible: el.offsetParent !== null
            };
        }""")
        assert estilos["visible"] is True

    def test_manipular_storage(self, page: Page):
        """Usar evaluate para interactuar con localStorage."""
        page.goto("https://the-internet.herokuapp.com")

        # Escribir en localStorage
        page.evaluate("""
            () => {
                localStorage.setItem('test_user', JSON.stringify({
                    nombre: 'QA Tester',
                    rol: 'automation',
                    timestamp: Date.now()
                }));
            }
        """)

        # Leer de localStorage
        user_data = page.evaluate("""
            () => JSON.parse(localStorage.getItem('test_user'))
        """)
        assert user_data["nombre"] == "QA Tester"
        assert user_data["rol"] == "automation"

        # Limpiar
        page.evaluate("localStorage.removeItem('test_user')")</code></pre>

        <h3>🐛 Depuración de evaluate</h3>
        <pre><code class="python"># Si evaluate lanza un error, se propaga como excepción Python
try:
    page.evaluate("() => { throw new Error('algo salió mal'); }")
except Exception as e:
    print(f"Error JS capturado: {e}")

# Usar console.log dentro de evaluate para debugging
# (se ve en la consola del navegador, no en Python)
page.evaluate("""
    () => {
        console.log('Debug desde evaluate:', document.title);
        console.table(Array.from(document.querySelectorAll('a')).slice(0, 5));
    }
""")

# Para capturar console.log en Python:
page.on("console", lambda msg: print(f"[Console {msg.type}] {msg.text}"))
page.evaluate("() => console.log('Este log llega a Python')")</code></pre>

        <h3>🎯 Ejercicio</h3>
        <ol>
            <li>Navega a <code>https://the-internet.herokuapp.com/tables</code></li>
            <li>Usa <code>page.evaluate()</code> para contar cuántas filas tiene la tabla <code>#table1</code></li>
            <li>Usa <code>page.eval_on_selector_all()</code> para extraer todos los emails de la tabla</li>
            <li>Usa <code>page.evaluate()</code> para escribir un objeto en <code>localStorage</code> y luego leerlo</li>
            <li>Usa <code>page.eval_on_selector()</code> para obtener el <code>font-size</code> computado del heading</li>
            <li>Inyecta un script con <code>add_script_tag()</code> que añada una función helper y luego úsala con evaluate</li>
            <li>Captura los <code>console.log</code> del navegador en Python usando <code>page.on("console", ...)</code></li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Comprender cuándo y por qué ejecutar JavaScript desde Playwright</li>
                <li>Dominar <code>page.evaluate()</code> para leer y modificar estado del navegador</li>
                <li>Pasar argumentos de Python a JavaScript y recibir resultados</li>
                <li>Usar <code>evaluate_handle</code>, <code>eval_on_selector</code> y <code>locator.evaluate</code> según el caso</li>
                <li>Inyectar scripts/estilos y exponer funciones Python al navegador</li>
                <li>Conocer las limitaciones de serialización y buenas prácticas de seguridad</li>
            </ul>
        </div>

        <h3>➡️ Siguiente: Drag and drop, hover, right-click</h3>
        <p>En la siguiente lección aprenderás a automatizar interacciones avanzadas del mouse:
        arrastrar y soltar, hover para revelar elementos ocultos y clic derecho para
        menús contextuales.</p>
    `,
    topics: ["javascript", "evaluate", "ejecución"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 8,
    difficulty: "medium",
    type: "foundation"
};

if (typeof window !== 'undefined') {
    window.LESSON_045 = LESSON_045;
}
