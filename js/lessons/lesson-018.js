/**
 * Playwright Academy - Lección 018
 * Logging y mensajes de debug
 * Sección 2: Fundamentos de Playwright
 */

const LESSON_018 = {
    id: 18,
    title: "Logging y mensajes de debug",
    duration: "5 min",
    level: "beginner",
    section: "section-02",
    content: `
        <h2>🔍 Logging y mensajes de debug</h2>
        <p>Cuando un test falla, necesitas información para diagnosticar el problema.
        Playwright y pytest ofrecen varias herramientas de logging y debugging.</p>

        <h3>📋 Print básico con pytest -s</h3>
        <pre><code class="python">def test_con_prints(page):
    page.goto("https://example.com")
    print(f"URL actual: {page.url}")
    print(f"Título: {page.title()}")

    page.click("a")
    print(f"URL después del click: {page.url}")

# Ejecutar con -s para ver los prints:
# pytest test_debug.py -s -v</code></pre>

        <h3>📝 Módulo logging de Python</h3>
        <pre><code class="python">import logging
from playwright.sync_api import Page, expect

# Configurar logger
logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

def test_con_logging(page: Page):
    logger.info("Navegando a example.com")
    page.goto("https://example.com")

    logger.info(f"Título de la página: {page.title()}")

    logger.debug("Buscando heading h1")  # Solo visible con level=DEBUG
    heading = page.locator("h1")

    logger.info("Verificando texto del heading")
    expect(heading).to_have_text("Example Domain")

    logger.warning("Este test necesita revisión")
    logger.error("Algo falló (ejemplo)")</code></pre>

        <h3>🔧 Configurar logging en conftest.py</h3>
        <pre><code class="python"># conftest.py
import logging
import pytest

# Logger global para tests
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%H:%M:%S"
)

@pytest.fixture(autouse=True)
def log_test_info(request):
    """Log automático de inicio y fin de cada test."""
    logger = logging.getLogger("test")
    test_name = request.node.name

    logger.info(f"{'='*50}")
    logger.info(f"INICIO: {test_name}")
    logger.info(f"{'='*50}")

    yield

    logger.info(f"FIN: {test_name}")
    logger.info(f"{'='*50}")</code></pre>

        <h3>🎭 Playwright Trace Viewer</h3>
        <p>El Trace Viewer es la herramienta más poderosa para debugging. Graba cada acción,
        screenshot, y estado de la red durante el test.</p>
        <pre><code class="python"># conftest.py - Habilitar tracing
import pytest

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        # El trace se configura a nivel de context
    }

@pytest.fixture(autouse=True)
def trace_test(page, request):
    """Graba un trace para cada test."""
    # Iniciar trace
    page.context.tracing.start(
        screenshots=True,
        snapshots=True,
        sources=True
    )

    yield

    # Guardar trace
    test_name = request.node.name.replace(" ", "_")
    page.context.tracing.stop(
        path=f"traces/{test_name}.zip"
    )</code></pre>
        <pre><code class="bash"># Ver el trace en el navegador:
playwright show-trace traces/test_login.zip

# O con pytest-playwright directamente:
pytest --tracing=on
pytest --tracing=retain-on-failure  # Solo si falla</code></pre>

        <h3>🖥️ Modo headed para debugging visual</h3>
        <pre><code class="bash"># Ejecutar tests con navegador visible
pytest --headed

# Ejecutar lento para ver las acciones
pytest --headed --slowmo=1000  # 1 segundo entre acciones

# Combinados para máximo debug
pytest --headed --slowmo=500 -s -v</code></pre>

        <h3>⏸️ page.pause() - Breakpoint interactivo</h3>
        <pre><code class="python">def test_con_pausa(page):
    page.goto("https://example.com")

    # Esto abre el Inspector de Playwright
    # Puedes interactuar manualmente con la página
    page.pause()  # ⬅️ Breakpoint! Abre Playwright Inspector

    # El test continúa cuando cierras el inspector
    page.click("a")</code></pre>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Importante:</strong> <code>page.pause()</code> requiere ejecutar
            en modo headed: <code>pytest --headed test_archivo.py</code>.
            Recuerda eliminar los <code>pause()</code> antes de hacer commit.</p>
        </div>

        <h3>📊 Capturar logs de consola del navegador</h3>
        <pre><code class="python">def test_logs_consola(page):
    mensajes = []

    # Escuchar mensajes de consola del navegador
    page.on("console", lambda msg: mensajes.append(
        f"[{msg.type}] {msg.text}"
    ))

    # Escuchar errores de página
    page.on("pageerror", lambda err: print(f"Error JS: {err}"))

    page.goto("https://mi-app.com")

    # Ver todos los mensajes capturados
    for msg in mensajes:
        print(msg)</code></pre>

        <h3>🌐 Interceptar requests de red</h3>
        <pre><code class="python">def test_monitorear_red(page):
    requests_log = []

    # Capturar todas las requests
    page.on("request", lambda req: requests_log.append(
        f"{req.method} {req.url}"
    ))

    page.on("response", lambda res: print(
        f"← {res.status} {res.url}"
    ))

    page.goto("https://example.com")

    # Mostrar las requests realizadas
    print(f"\\nTotal requests: {len(requests_log)}")
    for req in requests_log[:5]:
        print(f"  {req}")</code></pre>

        <h3>🎯 Ejercicio práctico</h3>
        <ol>
            <li>Agrega logging con el módulo <code>logging</code> a un test existente</li>
            <li>Configura el trace automático en <code>conftest.py</code></li>
            <li>Ejecuta un test con <code>pytest --headed --slowmo=500 -s</code></li>
            <li>Usa <code>page.pause()</code> para explorar una página manualmente</li>
            <li>Abre un trace con <code>playwright show-trace</code></li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Usar <code>print()</code> y <code>logging</code> para depuración</li>
                <li>Configurar Playwright Trace Viewer</li>
                <li>Debugging visual con <code>--headed</code> y <code>--slowmo</code></li>
                <li>Capturar logs de consola y tráfico de red</li>
            </ul>
        </div>
    `,
    topics: ["logging", "debug", "mensajes"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_018 = LESSON_018;
}
