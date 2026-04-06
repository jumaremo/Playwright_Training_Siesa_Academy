/**
 * Playwright Academy - Lección 008
 * Ejecución y selectores de tests
 * Sección 1: Configuración del Entorno
 */

const LESSON_008 = {
    id: 8,
    title: "Ejecución y selectores de tests",
    duration: "5 min",
    level: "beginner",
    section: "section-01",
    content: `
        <h2>▶️ Ejecución y selectores de tests</h2>
        <p>Dominar la ejecución selectiva de tests es esencial para ser productivo.
        Aprenderás a ejecutar exactamente los tests que necesitas.</p>

        <h3>🎯 Formas de ejecutar tests</h3>
        <pre><code class="bash"># Ejecutar TODOS los tests
pytest

# Ejecutar un archivo específico
pytest tests/test_login.py

# Ejecutar un test específico por nombre
pytest tests/test_login.py::test_login_exitoso

# Ejecutar tests cuyo nombre contiene un texto (-k)
pytest -k "login"
pytest -k "login and not admin"
pytest -k "login or registro"

# Ejecutar tests por marcador (-m)
pytest -m smoke
pytest -m "smoke and not slow"
pytest -m regression

# Ejecutar última selección de tests fallidos
pytest --lf        # --last-failed
pytest --ff        # --failed-first (fallidos primero, luego el resto)</code></pre>

        <h3>🏷️ Marcadores (markers)</h3>
        <pre><code class="python"># tests/test_login.py
import pytest
from playwright.sync_api import Page, expect


@pytest.mark.smoke
def test_login_exitoso(page: Page):
    """Test crítico: flujo de login básico."""
    page.goto("https://demo.playwright.dev/todomvc/")
    page.get_by_placeholder("What needs to be done?").fill("Test smoke")
    page.get_by_placeholder("What needs to be done?").press("Enter")
    expect(page.get_by_test_id("todo-title")).to_have_text("Test smoke")


@pytest.mark.regression
def test_login_campos_vacios(page: Page):
    """Regresión: validación con campos vacíos."""
    page.goto("https://demo.playwright.dev/todomvc/")
    # Presionar Enter sin escribir nada
    page.get_by_placeholder("What needs to be done?").press("Enter")
    # No debería agregar una tarea vacía
    expect(page.get_by_test_id("todo-title")).to_have_count(0)


@pytest.mark.slow
@pytest.mark.regression
def test_multiples_operaciones(page: Page):
    """Test lento: operaciones CRUD completas."""
    page.goto("https://demo.playwright.dev/todomvc/")
    # Agregar varias tareas
    for i in range(5):
        page.get_by_placeholder("What needs to be done?").fill(f"Tarea {i+1}")
        page.get_by_placeholder("What needs to be done?").press("Enter")
    expect(page.get_by_test_id("todo-title")).to_have_count(5)</code></pre>

        <h3>📊 Opciones de output</h3>
        <pre><code class="bash"># Verbose: muestra nombre de cada test
pytest -v

# Extra verbose: muestra parámetros y fixtures
pytest -vv

# Silencioso: solo resumen
pytest -q

# Mostrar output de print()
pytest -s

# Mostrar duración de tests lentos
pytest --durations=10

# Parar al primer fallo
pytest -x

# Parar después de N fallos
pytest --maxfail=3

# Ejecutar en paralelo (requiere pytest-xdist)
pip install pytest-xdist
pytest -n auto        # Usa todos los cores
pytest -n 4           # Usa 4 workers</code></pre>

        <h3>🔄 Combinando opciones</h3>
        <pre><code class="bash"># Flujo típico de desarrollo
pytest tests/test_login.py -v --headed -x -s

# Suite de smoke rápida
pytest -m smoke -v --screenshot on

# Regresión completa multi-navegador
pytest -m regression --browser chromium --browser firefox -v

# Debug: solo un test, lento, con prints
pytest tests/test_login.py::test_login_exitoso -v --headed --slowmo 1000 -s

# CI/CD: todo, sin cabeza, con evidencia
pytest -v --tracing on --screenshot on --video on</code></pre>

        <h3>🎯 Ejercicio práctico</h3>
        <ol>
            <li>Agrega marcadores <code>@pytest.mark.smoke</code> y <code>@pytest.mark.regression</code> a tus tests existentes</li>
            <li>Ejecuta solo los tests de smoke: <code>pytest -m smoke -v</code></li>
            <li>Ejecuta tests por nombre: <code>pytest -k "agregar" -v</code></li>
            <li>Prueba el modo debug: <code>pytest -v --headed --slowmo 500 -x -s</code></li>
            <li>Instala <code>pytest-xdist</code> y ejecuta en paralelo: <code>pytest -n 2 -v</code></li>
            <li>Haz que un test falle y usa <code>pytest --lf</code> para re-ejecutar solo los fallidos</li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Ejecutar tests de forma selectiva con <code>-k</code> y <code>-m</code></li>
                <li>Usar marcadores para categorizar tests (smoke, regression, slow)</li>
                <li>Dominar las opciones de output y debugging (<code>-v</code>, <code>-s</code>, <code>-x</code>)</li>
                <li>Conocer ejecución paralela con pytest-xdist</li>
            </ul>
        </div>

        <div style="background: #fff3cd; padding: 10px; border-radius: 8px; margin: 10px 0;">
            <h4>💡 Tip:</h4>
            <p>Crea un <strong>Makefile</strong> o scripts para tus comandos más usados:
            <code>make smoke</code>, <code>make regression</code>, <code>make debug TEST=test_login</code>.
            Esto estandariza la ejecución en todo el equipo.</p>
        </div>

        <h3>🚀 Siguiente: Lección 009 - Git y control de versiones para QA</h3>
        <p>Configuraremos Git para manejar nuestro proyecto de tests.</p>
    `,
    topics: ["ejecución", "selectores", "pytest"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_008 = LESSON_008;
}
