/**
 * Playwright Academy - Lección 064
 * Proyecto: Tests sin waits explícitos
 * Sección 8: Auto-waiting y Actionability
 */

const LESSON_064 = {
    id: 64,
    title: "Proyecto: Tests sin waits explícitos",
    duration: "10 min",
    level: "intermediate",
    section: "section-08",
    content: `
        <h2>🏆 Proyecto: Tests sin waits explícitos</h2>
        <p>En este proyecto integrador demostraremos que se puede automatizar una aplicación
        web compleja <strong>sin un solo <code>time.sleep()</code></strong>. Tomaremos
        un conjunto de tests escritos "al estilo Selenium" (llenos de sleeps) y los
        reescribiremos usando las estrategias de Playwright.</p>

        <h3>🎯 La aplicación: "TaskManager Pro"</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Una app de gestión de tareas con las siguientes características que
            generan timing issues:</p>
            <ul>
                <li><strong>Login:</strong> validación async del email contra API</li>
                <li><strong>Dashboard:</strong> 3 widgets que cargan datos de APIs diferentes</li>
                <li><strong>Tareas:</strong> lista cargada por paginación infinita (scroll)</li>
                <li><strong>Crear tarea:</strong> formulario con campos dinámicos y autocompletado</li>
                <li><strong>Notificaciones:</strong> toast que aparece y desaparece en 3 segundos</li>
                <li><strong>Reportes:</strong> generación async + descarga de PDF</li>
                <li><strong>Modal de confirmación:</strong> con animación de entrada/salida</li>
            </ul>
        </div>

        <h3>❌ ANTES: Tests con sleeps (anti-patrón)</h3>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python"># ❌ tests_con_sleeps.py — ASÍ NO SE DEBE HACER
import time

def test_login_y_dashboard(page):
    page.goto("https://taskmanager.com/login")
    time.sleep(2)  # Esperar carga

    page.fill("#email", "admin@test.com")
    time.sleep(1)  # Esperar validación async del email
    page.fill("#password", "admin123")
    page.click("#login-btn")
    time.sleep(3)  # Esperar redirección

    # Dashboard
    time.sleep(5)  # Esperar que carguen los 3 widgets
    sales = page.text_content("#sales-total")
    assert "$" in sales

def test_crear_tarea(page):
    page.goto("https://taskmanager.com/tasks/new")
    time.sleep(2)

    page.fill("#titulo", "Revisar código PR #42")
    page.fill("#descripcion", "Revisar cambios en módulo de auth")

    # Autocompletado de asignado
    page.fill("#asignado", "Juan")
    time.sleep(2)  # Esperar resultados de autocompletado
    page.click(".autocomplete-item:first-child")

    page.select_option("#prioridad", label="Alta")
    page.click("#guardar-btn")
    time.sleep(3)  # Esperar guardado

    # Verificar toast
    time.sleep(1)  # Esperar que aparezca el toast
    msg = page.text_content(".toast")
    assert "creada" in msg

def test_eliminar_tarea(page):
    page.goto("https://taskmanager.com/tasks")
    time.sleep(3)  # Esperar carga de lista

    page.click(".task-row:first-child .delete-btn")
    time.sleep(1)  # Esperar animación del modal
    page.click("#confirm-delete")
    time.sleep(2)  # Esperar eliminación
    time.sleep(1)  # Esperar que el modal se cierre

def test_generar_reporte(page):
    page.goto("https://taskmanager.com/reports")
    time.sleep(2)

    page.select_option("#tipo", label="Semanal")
    page.click("#generar-btn")
    time.sleep(10)  # Esperar generación del reporte (lento)
    page.click("#descargar-pdf")
    time.sleep(5)  # Esperar descarga

# Total de time.sleep: ~43 segundos de espera fija
# Los tests tardan mucho más de lo necesario
# Y aún así, fallan intermitentemente</code></pre>
        </div>

        <h3>✅ DESPUÉS: Tests con auto-waiting (best practice)</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python"># ✅ tests_sin_sleeps.py — ASÍ SE DEBE HACER
from playwright.sync_api import expect

def test_login_y_dashboard(page):
    """Login y verificar dashboard — cero sleeps."""
    page.goto("https://taskmanager.com/login")

    # fill() auto-espera a que el campo sea visible y editable
    page.fill("#email", "admin@test.com")

    # Esperar que la validación async complete
    expect(page.locator("#email-status .valid")).to_be_visible()

    page.fill("#password", "admin123")
    page.click("#login-btn")

    # Esperar redirección al dashboard
    expect(page).to_have_url("**/dashboard")

    # Esperar que los widgets carguen (cada uno independientemente)
    expect(page.locator("#sales-total")).not_to_have_text("$0")
    expect(page.locator("#users-active")).not_to_have_text("0")
    expect(page.locator("#tasks-pending")).not_to_have_text("0")

    # Verificar dato específico
    sales = page.locator("#sales-total").text_content()
    assert "$" in sales</code></pre>
        </div>

        <pre><code class="python">def test_crear_tarea(page):
    """Crear tarea con autocompletado — cero sleeps."""
    page.goto("https://taskmanager.com/tasks/new")

    # fill() auto-espera campo visible + editable
    page.fill("#titulo", "Revisar código PR #42")
    page.fill("#descripcion", "Revisar cambios en módulo de auth")

    # Autocompletado: escribir y esperar dropdown
    page.fill("#asignado", "Juan")
    # expect auto-reintenta hasta que el item aparezca
    expect(page.locator(".autocomplete-item")).to_have_count(1)
    page.click(".autocomplete-item:first-child")

    page.select_option("#prioridad", label="Alta")

    # Esperar respuesta de API al guardar
    with page.expect_response("**/api/tasks") as response:
        page.click("#guardar-btn")

    assert response.value.status == 201

    # Verificar toast — expect auto-espera a que aparezca
    expect(page.locator(".toast")).to_contain_text("creada")


def test_eliminar_tarea(page):
    """Eliminar tarea con modal animado — cero sleeps."""
    page.goto("https://taskmanager.com/tasks")

    # Esperar que la lista cargue
    expect(page.locator(".task-row")).not_to_have_count(0)

    initial_count = page.locator(".task-row").count()

    # Click en eliminar — auto-espera a que sea clickeable
    page.click(".task-row:first-child .delete-btn")

    # Esperar que el modal se abra (incluyendo animación)
    # click() en el botón del modal auto-espera "stable"
    expect(page.locator("#confirm-modal")).to_be_visible()
    page.click("#confirm-delete")

    # Esperar que el modal se cierre
    expect(page.locator("#confirm-modal")).to_be_hidden()

    # Verificar que la tarea fue eliminada
    expect(page.locator(".task-row")).to_have_count(initial_count - 1)


def test_generar_y_descargar_reporte(page):
    """Generar reporte y descargar — cero sleeps."""
    page.goto("https://taskmanager.com/reports")

    page.select_option("#tipo", label="Semanal")

    # Esperar respuesta de generación (puede tardar)
    with page.expect_response(
        "**/api/reports/generate",
        timeout=60000  # Hasta 60 segundos para reportes grandes
    ) as response:
        page.click("#generar-btn")

    assert response.value.status == 200

    # Esperar que el botón de descarga se habilite
    expect(page.locator("#descargar-pdf")).to_be_enabled()

    # Capturar la descarga
    with page.expect_download() as download:
        page.click("#descargar-pdf")

    assert download.value.suggested_filename.endswith(".pdf")
    download.value.save_as("evidence/reporte_semanal.pdf")</code></pre>

        <h3>📊 Comparación de resultados</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #e65100; color: white;">
                        <th style="padding: 10px;">Métrica</th>
                        <th style="padding: 10px;">Con sleeps ❌</th>
                        <th style="padding: 10px;">Sin sleeps ✅</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #fff8e1;">
                        <td style="padding: 8px;"><strong>Tiempo total de sleeps</strong></td>
                        <td style="padding: 8px;">~43 segundos fijos</td>
                        <td style="padding: 8px;">0 segundos</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>Tiempo real de ejecución</strong></td>
                        <td style="padding: 8px;">~55 segundos</td>
                        <td style="padding: 8px;">~12 segundos</td>
                    </tr>
                    <tr style="background: #fff8e1;">
                        <td style="padding: 8px;"><strong>Tasa de flakiness</strong></td>
                        <td style="padding: 8px;">~15-20% fallos random</td>
                        <td style="padding: 8px;">~0-1% fallos random</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>Líneas de código</strong></td>
                        <td style="padding: 8px;">Más (sleeps + lógica)</td>
                        <td style="padding: 8px;">Menos (auto-waiting)</td>
                    </tr>
                    <tr style="background: #fff8e1;">
                        <td style="padding: 8px;"><strong>Legibilidad</strong></td>
                        <td style="padding: 8px;">Confusa (¿por qué sleep 3?)</td>
                        <td style="padding: 8px;">Clara (expect describe qué espera)</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>Mantenimiento</strong></td>
                        <td style="padding: 8px;">Ajustar sleeps constantemente</td>
                        <td style="padding: 8px;">Auto-adaptable al timing</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>🧪 Test avanzado: Flujo E2E completo sin sleeps</h3>
        <pre><code class="python">def test_flujo_completo_task_manager(page):
    """E2E: Login → Crear tarea → Verificar → Eliminar → Reportar.
    Cero time.sleep(), cero wait_for_timeout().
    """

    # ── 1. LOGIN ──
    page.goto("https://taskmanager.com/login")
    page.fill("#email", "admin@test.com")
    expect(page.locator("#email-status .valid")).to_be_visible()
    page.fill("#password", "admin123")
    page.click("#login-btn")
    expect(page).to_have_url("**/dashboard")

    # ── 2. NAVEGAR A TAREAS ──
    page.click("nav a:has-text('Tareas')")
    expect(page).to_have_url("**/tasks")
    expect(page.locator(".task-row")).not_to_have_count(0)
    initial_count = page.locator(".task-row").count()

    # ── 3. CREAR TAREA ──
    page.click("#new-task-btn")
    expect(page).to_have_url("**/tasks/new")

    page.fill("#titulo", "Test E2E Automatizado")
    page.fill("#descripcion", "Creada por Playwright Academy")
    page.fill("#asignado", "Carlos")
    expect(page.locator(".autocomplete-item")).to_have_count(1)
    page.click(".autocomplete-item:first-child")
    page.select_option("#prioridad", label="Alta")

    with page.expect_response("**/api/tasks") as create_resp:
        page.click("#guardar-btn")
    assert create_resp.value.status == 201

    expect(page.locator(".toast")).to_contain_text("creada")

    # ── 4. VERIFICAR EN LISTA ──
    page.click("nav a:has-text('Tareas')")
    expect(page.locator(".task-row")).to_have_count(initial_count + 1)
    expect(page.locator(".task-row").first).to_contain_text(
        "Test E2E Automatizado"
    )

    # ── 5. ELIMINAR TAREA ──
    page.click(".task-row:first-child .delete-btn")
    expect(page.locator("#confirm-modal")).to_be_visible()

    with page.expect_response(lambda r: "/api/tasks/" in r.url
                              and r.request.method == "DELETE"):
        page.click("#confirm-delete")

    expect(page.locator("#confirm-modal")).to_be_hidden()
    expect(page.locator(".task-row")).to_have_count(initial_count)

    # ── 6. GENERAR REPORTE ──
    page.click("nav a:has-text('Reportes')")
    expect(page).to_have_url("**/reports")

    page.select_option("#tipo", label="Semanal")
    with page.expect_response("**/api/reports/generate", timeout=30000):
        page.click("#generar-btn")

    expect(page.locator("#descargar-pdf")).to_be_enabled()

    with page.expect_download() as download:
        page.click("#descargar-pdf")
    assert download.value.suggested_filename.endswith(".pdf")</code></pre>

        <h3>📝 Checklist: ¿Mi test está libre de sleeps?</h3>
        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <ul>
                <li>☐ ¿Tiene cero <code>time.sleep()</code>?</li>
                <li>☐ ¿Tiene cero <code>page.wait_for_timeout()</code>?</li>
                <li>☐ ¿Usa <code>expect()</code> para todas las verificaciones?</li>
                <li>☐ ¿Usa <code>expect_response()</code> para esperar APIs?</li>
                <li>☐ ¿Usa <code>expect_download()</code> para descargas?</li>
                <li>☐ ¿Confía en el auto-waiting para clicks y fills?</li>
                <li>☐ ¿Maneja diálogos con <code>page.on("dialog")</code>?</li>
                <li>☐ ¿Pasa de forma consistente sin fallos de timing?</li>
            </ul>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip SIESA:</strong> En nuestros proyectos de automatización, la regla es
            estricta: <strong>cero sleeps en código de producción</strong>. Si un PR contiene
            <code>time.sleep()</code>, se rechaza en code review. El auto-waiting de Playwright
            es suficiente para el 99% de los casos.
        </div>

        <h3>🎓 Sección 8 completada</h3>
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin: 15px 0; text-align: center;">
            <h3 style="color: white; margin-bottom: 10px;">🏆 ¡Felicitaciones!</h3>
            <p>Has completado la <strong>Sección 8: Auto-waiting y Actionability</strong>.
            Dominas el sistema de esperas inteligentes de Playwright y puedes escribir
            tests rápidos, estables y libres de sleeps.</p>
            <p style="font-size: 0.9em; margin-top: 10px;">
                <strong>Siguiente:</strong> Sección 9 — Network Interception y Mocking
            </p>
        </div>

        <h3>🎯 Ejercicio final</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Toma un test existente que tenga sleeps (tuyo o de
            tu equipo) y reescríbelo aplicando:</p>
            <ol>
                <li>Reemplaza cada <code>time.sleep()</code> con la estrategia correcta</li>
                <li>Usa <code>expect()</code> para todas las verificaciones</li>
                <li>Usa <code>expect_response()</code> si hay llamadas a API</li>
                <li>Verifica que el test pasa de forma consistente (correrlo 10 veces)</li>
                <li>Mide la diferencia de tiempo de ejecución</li>
            </ol>
        </div>
    `,
    topics: ["proyecto", "auto-waiting", "sin-waits"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 10,
    difficulty: "medium",
    type: "integration"
};

if (typeof window !== 'undefined') {
    window.LESSON_064 = LESSON_064;
}
