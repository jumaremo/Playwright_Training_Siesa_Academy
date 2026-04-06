/**
 * Playwright Academy - Lección 005
 * Primer test con Playwright
 * Sección 1: Configuración del Entorno
 */

const LESSON_005 = {
    id: 5,
    title: "Primer test con Playwright",
    duration: "8 min",
    level: "beginner",
    section: "section-01",
    content: `
        <h2>🧪 Primer test con Playwright</h2>
        <p>¡Es hora de escribir tu primer test real! Vamos a crear un test paso a paso,
        entendiendo cada línea.</p>

        <h3>📝 Anatomía de un test Playwright con pytest</h3>
        <pre><code class="python"># test_demo_store.py
import re
from playwright.sync_api import Page, expect


def test_pagina_principal_carga(page: Page):
    """Verifica que la página principal carga correctamente."""
    # ARRANGE: Navegar a la página
    page.goto("https://demo.playwright.dev/todomvc/")

    # ACT: (en este caso, solo navegamos)

    # ASSERT: Verificar que la página cargó
    expect(page).to_have_title("React • TodoMVC")


def test_agregar_tarea(page: Page):
    """Verifica que se puede agregar una nueva tarea."""
    # ARRANGE
    page.goto("https://demo.playwright.dev/todomvc/")

    # ACT: Escribir una tarea y presionar Enter
    page.get_by_placeholder("What needs to be done?").fill("Aprender Playwright")
    page.get_by_placeholder("What needs to be done?").press("Enter")

    # ASSERT: Verificar que la tarea aparece en la lista
    expect(page.get_by_test_id("todo-title")).to_have_text("Aprender Playwright")


def test_completar_tarea(page: Page):
    """Verifica que se puede marcar una tarea como completada."""
    # ARRANGE
    page.goto("https://demo.playwright.dev/todomvc/")
    page.get_by_placeholder("What needs to be done?").fill("Tarea de prueba")
    page.get_by_placeholder("What needs to be done?").press("Enter")

    # ACT: Marcar como completada
    page.get_by_role("checkbox").click()

    # ASSERT: Verificar que se marcó como completada
    expect(page.get_by_test_id("todo-item")).to_have_class(re.compile("completed"))</code></pre>

        <h3>🔍 Desglose línea por línea</h3>
        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #e8f5e9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Línea</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">¿Qué hace?</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>def test_*(page: Page)</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">pytest descubre funciones que empiezan con <code>test_</code>. <code>page</code> es una fixture inyectada automáticamente.</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>page.goto(url)</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Navega y espera a que la página cargue (evento <code>load</code>).</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>page.get_by_placeholder()</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Localiza un input por su texto placeholder.</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>.fill("texto")</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Limpia el campo y escribe el texto. Auto-waits hasta que el campo esté listo.</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>.press("Enter")</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Simula presionar una tecla.</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>expect(locator).to_have_text()</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Assertion con auto-retry. Reintenta hasta 5 segundos por defecto.</td>
                </tr>
            </table>
        </div>

        <h3>▶️ Ejecutar los tests</h3>
        <pre><code class="bash"># Ejecutar todos los tests del archivo
pytest test_demo_store.py -v

# Ejecutar con navegador visible
pytest test_demo_store.py -v --headed

# Ejecutar un test específico
pytest test_demo_store.py::test_agregar_tarea -v --headed

# Ejecutar y generar reporte HTML
pytest test_demo_store.py -v --html=report.html

# Output esperado:
# test_demo_store.py::test_pagina_principal_carga PASSED
# test_demo_store.py::test_agregar_tarea PASSED
# test_demo_store.py::test_completar_tarea PASSED
# ======= 3 passed in 4.52s =======</code></pre>

        <h3>🎯 Ejercicio práctico</h3>
        <ol>
            <li>Crea el archivo <code>test_demo_store.py</code> con los 3 tests de arriba</li>
            <li>Ejecútalos con <code>pytest test_demo_store.py -v --headed</code></li>
            <li>Observa cómo el navegador se abre y ejecuta las acciones</li>
            <li>Agrega un cuarto test: <code>test_agregar_multiples_tareas</code> que:
                <br>- Agregue 3 tareas diferentes
                <br>- Verifique que las 3 aparecen en la lista
                <br>- Usa <code>expect(page.get_by_test_id("todo-title")).to_have_count(3)</code></li>
            <li>Ejecuta solo tu nuevo test: <code>pytest test_demo_store.py::test_agregar_multiples_tareas -v --headed</code></li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Escribir tests completos con el patrón Arrange-Act-Assert</li>
                <li>Usar localizadores semánticos: <code>get_by_placeholder</code>, <code>get_by_role</code>, <code>get_by_test_id</code></li>
                <li>Ejecutar tests desde la terminal con diferentes opciones</li>
                <li>Entender el auto-waiting en acciones y assertions</li>
            </ul>
        </div>

        <div style="background: #fff3cd; padding: 10px; border-radius: 8px; margin: 10px 0;">
            <h4>💡 Tip:</h4>
            <p>Cada función <code>test_*</code> recibe un <code>page</code> fresco (nueva pestaña en nuevo contexto).
            Los tests son <strong>completamente aislados</strong> entre sí — un test no puede afectar a otro.</p>
        </div>

        <h3>🚀 Siguiente: Lección 006 - Estructura de un proyecto Playwright</h3>
        <p>Organizaremos nuestro proyecto siguiendo las mejores prácticas.</p>
    `,
    topics: ["test", "pytest", "primer-test"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 8,
    difficulty: "easy",
    type: "foundation"
};

if (typeof window !== 'undefined') {
    window.LESSON_005 = LESSON_005;
}
