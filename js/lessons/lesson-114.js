/**
 * Playwright Academy - Leccion 114
 * Retry y manejo de flaky tests
 * Seccion 17: CI/CD Integration
 */

const LESSON_114 = {
    id: 114,
    title: "Retry y manejo de flaky tests",
    duration: "7 min",
    level: "advanced",
    section: "section-17",
    content: `
        <h2>Retry y manejo de flaky tests</h2>
        <p>Los <strong>flaky tests</strong> — tests que a veces pasan y a veces fallan sin cambios en el codigo —
        son el enemigo numero uno de la confianza en la automatizacion. Un pipeline donde los tests fallan
        aleatoriamente pierde credibilidad rapidamente: el equipo empieza a ignorar los resultados y la
        automatizacion deja de cumplir su proposito. En esta leccion aprenderas a implementar estrategias
        de <strong>retry</strong>, identificar las causas raiz de la inestabilidad, y construir un sistema
        robusto para manejar flaky tests en tus suites de Playwright con Python.</p>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>En SIESA, el equipo de QA implemento un sistema de cuarentena para flaky tests donde los tests
            inestables se marcan automaticamente y se ejecutan en un pipeline separado. Esto mantiene el pipeline
            principal confiable mientras se investigan y corrigen los tests problematicos, logrando un ratio
            de estabilidad superior al 98% en las suites de regresion.</p>
        </div>

        <h3>Causas comunes de flaky tests</h3>
        <p>Antes de aplicar retry, es fundamental entender por que los tests fallan intermitentemente:</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Causa</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripcion</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Solucion</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Timing</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Elementos que no estan listos cuando el test interactua</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Auto-wait de Playwright, expect con timeout</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Estado compartido</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Tests que dependen del orden de ejecucion o datos compartidos</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Aislamiento, fixtures independientes</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Red/Servicios</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">APIs externas lentas o inestables</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Mocking, timeouts configurables</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Animaciones</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">CSS transitions y animaciones que interfieren</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Deshabilitar animaciones en CI</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Recursos CI</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Runners con poca CPU/RAM causan timeouts</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Ajustar timeouts, limitar paralelismo</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Datos dinamicos</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Contenido que cambia entre ejecuciones (fechas, IDs)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Assertions flexibles, patrones regex</td>
                </tr>
            </table>
        </div>

        <h3>Playwright: Auto-wait como primera defensa</h3>
        <p>Playwright tiene el mejor sistema de auto-waiting del mercado. Antes de agregar retries,
        asegurate de aprovechar estas capacidades nativas:</p>

        <pre><code class="python"># Playwright espera automaticamente a que los elementos esten:
# - Visibles
# - Habilitados
# - Estables (sin animaciones)
# - Que reciban eventos

# BIEN: Playwright espera automaticamente
page.click("#submit-button")  # Espera hasta 30s por defecto

# BIEN: Assertions con auto-retry integrado
from playwright.sync_api import expect

# expect() reintenta la asercion hasta que pase o expire el timeout
expect(page.locator(".success-message")).to_be_visible(timeout=10000)
expect(page.locator(".item-count")).to_have_text("5 items", timeout=5000)

# BIEN: Esperar a un estado especifico de la pagina
page.wait_for_load_state("networkidle")
page.wait_for_url("**/dashboard")

# MAL: No uses time.sleep() - es fragil e innecesario
import time
time.sleep(3)  # NUNCA hagas esto
page.click("#submit-button")</code></pre>

        <h3>pytest-rerunfailures: Retry a nivel de test</h3>
        <p>El plugin <code>pytest-rerunfailures</code> permite reintentar tests fallidos
        automaticamente. Es la solucion mas popular para manejar flakiness:</p>

        <pre><code class="python"># Instalacion
# pip install pytest-rerunfailures

# Uso basico: reintentar todos los tests fallidos hasta 2 veces
# pytest tests/ --reruns 2

# Con delay entre reintentos
# pytest tests/ --reruns 3 --reruns-delay 2

# Solo reintentar ciertos errores
# pytest tests/ --reruns 2 --only-rerun "TimeoutError"
# pytest tests/ --reruns 2 --only-rerun "AssertionError" --only-rerun "TimeoutError"</code></pre>

        <h3>Retry con markers de pytest</h3>
        <p>Para control granular, puedes marcar tests individuales que sabes que son propensos
        a flakiness (mientras trabajas en la correccion definitiva):</p>

        <pre><code class="python">import pytest

# Marcar un test especifico para retry
@pytest.mark.flaky(reruns=3, reruns_delay=1)
def test_dashboard_load(page):
    """Test que a veces falla por carga lenta del dashboard."""
    page.goto("/dashboard")
    expect(page.locator(".widget-container")).to_be_visible()
    expect(page.locator(".chart-loaded")).to_have_count(4)

# Retry condicional: solo en CI
@pytest.mark.flaky(reruns=2, condition=os.getenv("CI") == "true")
def test_external_api_integration(page):
    """Test que depende de API externa - mas inestable en CI."""
    page.goto("/integrations")
    page.click("#sync-button")
    expect(page.locator(".sync-complete")).to_be_visible(timeout=15000)

# Combinar con marcador de cuarentena
@pytest.mark.quarantine
@pytest.mark.flaky(reruns=5, reruns_delay=2)
def test_payment_webhook(page):
    """Test en cuarentena - investigar causa raiz."""
    page.goto("/payments")
    page.click("#trigger-webhook")
    expect(page.locator(".webhook-received")).to_be_visible()</code></pre>

        <h3>Configuracion centralizada en conftest.py</h3>

        <pre><code class="python"># conftest.py - Configuracion de retry centralizada
import pytest
import os
import json
from datetime import datetime

# ---------- Configuracion de retry para CI ----------
def pytest_addoption(parser):
    """Agregar opciones de linea de comandos para retry."""
    parser.addoption(
        "--flaky-retries",
        default=0,
        type=int,
        help="Numero de reintentos para tests flaky"
    )

# ---------- Hook para registrar flaky tests ----------
class FlakyTestTracker:
    """Registra tests que necesitaron retry para pasar."""

    def __init__(self):
        self.flaky_tests = []
        self.total_retries = 0

    def add_flaky(self, test_name, retries_needed):
        self.flaky_tests.append({
            "test": test_name,
            "retries": retries_needed,
            "timestamp": datetime.now().isoformat()
        })
        self.total_retries += retries_needed

@pytest.fixture(scope="session")
def flaky_tracker():
    return FlakyTestTracker()

def pytest_terminal_summary(terminalreporter, config):
    """Mostrar resumen de tests flaky al final de la ejecucion."""
    rerun_stats = terminalreporter.stats.get("rerun", [])

    if rerun_stats:
        terminalreporter.write_sep("=", "FLAKY TESTS DETECTADOS")
        terminalreporter.write_line(
            f"Tests que necesitaron retry: {len(rerun_stats)}"
        )
        for item in rerun_stats:
            terminalreporter.write_line(f"  - {item.nodeid}")

        # Guardar reporte de flaky tests
        flaky_report = {
            "date": datetime.now().isoformat(),
            "total_flaky": len(rerun_stats),
            "tests": [item.nodeid for item in rerun_stats]
        }

        os.makedirs("reports", exist_ok=True)
        with open("reports/flaky-tests.json", "w") as f:
            json.dump(flaky_report, f, indent=2)</code></pre>

        <h3>Retry a nivel de CI/CD</h3>
        <p>Ademas del retry en pytest, puedes configurar retry a nivel del pipeline:</p>

        <pre><code class="yaml"># GitHub Actions - Retry del job completo
jobs:
  playwright-tests:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      max-parallel: 1
    steps:
      - uses: actions/checkout@v4
      - name: Run Playwright tests with retry
        uses: nick-fields/retry@v3
        with:
          max_attempts: 3
          timeout_minutes: 15
          retry_on: error
          command: |
            pytest tests/ --junitxml=reports/junit.xml -v

---
# GitLab CI - Retry nativo
playwright_tests:
  stage: test
  script:
    - pytest tests/ -v --junitxml=reports/junit.xml
  retry:
    max: 2
    when:
      - script_failure
      - runner_system_failure

---
# Jenkins - Retry con plugin
// Jenkinsfile
stage('Tests') {
    retry(2) {
        sh 'pytest tests/ --junitxml=reports/junit.xml -v'
    }
}</code></pre>

        <h3>Sistema de cuarentena para flaky tests</h3>
        <p>Un sistema de cuarentena aisla tests inestables del pipeline principal
        mientras se investiga y corrige la causa raiz:</p>

        <pre><code class="python"># markers.py o conftest.py - Sistema de cuarentena
import pytest

# Registrar el marcador de cuarentena
def pytest_configure(config):
    config.addinivalue_line(
        "markers",
        "quarantine: test en cuarentena por flakiness (se ejecuta en pipeline separado)"
    )

# ---------- pytest.ini o pyproject.toml ----------
# [tool.pytest.ini_options]
# markers = [
#     "quarantine: test en cuarentena por flakiness"
# ]

# ---------- Uso ----------
@pytest.mark.quarantine
def test_intermittent_notification(page):
    """Este test falla ~10% de las veces por timing de notificaciones."""
    page.goto("/settings")
    page.click("#save")
    expect(page.locator(".toast-notification")).to_be_visible()

# ---------- Ejecucion ----------
# Pipeline principal: excluir tests en cuarentena
# pytest tests/ -m "not quarantine"

# Pipeline de cuarentena (separado, no bloquea):
# pytest tests/ -m "quarantine" --reruns 5</code></pre>

        <pre><code class="yaml"># GitHub Actions - Pipeline separado para cuarentena
name: Quarantine Tests
on:
  schedule:
    - cron: '0 6 * * *'  # Ejecutar diariamente a las 6 AM

jobs:
  quarantine:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          playwright install --with-deps chromium
      - name: Run quarantine tests
        run: |
          pytest tests/ -m "quarantine" \
            --reruns 5 --reruns-delay 2 \
            --junitxml=reports/quarantine.xml -v
      - name: Report results
        if: always()
        run: |
          echo "## Quarantine Test Results" >> $GITHUB_STEP_SUMMARY
          python scripts/parse_quarantine.py reports/quarantine.xml >> $GITHUB_STEP_SUMMARY</code></pre>

        <h3>Decorador personalizado para retry inteligente</h3>

        <pre><code class="python"># utils/retry.py - Decorador de retry con logica personalizada
import functools
import time
import logging

logger = logging.getLogger("playwright.retry")

def smart_retry(max_retries=3, delay=1, backoff=2, exceptions=(Exception,)):
    """
    Decorador de retry inteligente con backoff exponencial.

    Args:
        max_retries: Numero maximo de reintentos
        delay: Delay inicial entre reintentos (segundos)
        backoff: Multiplicador del delay en cada reintento
        exceptions: Tupla de excepciones que activan retry
    """
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            current_delay = delay
            last_exception = None

            for attempt in range(max_retries + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    last_exception = e
                    if attempt < max_retries:
                        logger.warning(
                            f"Intento {attempt + 1}/{max_retries + 1} fallo: {e}. "
                            f"Reintentando en {current_delay}s..."
                        )
                        time.sleep(current_delay)
                        current_delay *= backoff
                    else:
                        logger.error(
                            f"Todos los {max_retries + 1} intentos fallaron para {func.__name__}"
                        )
            raise last_exception
        return wrapper
    return decorator

# ---------- Uso en tests ----------
from utils.retry import smart_retry

@smart_retry(max_retries=2, delay=1, exceptions=(TimeoutError,))
def test_dashboard_widgets(page):
    page.goto("/dashboard")
    expect(page.locator(".widget")).to_have_count(6, timeout=10000)</code></pre>

        <h3>Metricas y monitoreo de estabilidad</h3>

        <pre><code class="python"># scripts/stability_report.py - Generar metricas de estabilidad
import json
import os
from collections import Counter
from datetime import datetime, timedelta

def analyze_flaky_history(reports_dir="reports/history"):
    """Analizar historial de tests flaky de los ultimos 30 dias."""

    flaky_counter = Counter()
    total_runs = 0

    for filename in sorted(os.listdir(reports_dir)):
        if filename.startswith("flaky-") and filename.endswith(".json"):
            filepath = os.path.join(reports_dir, filename)
            with open(filepath) as f:
                report = json.load(f)

            total_runs += 1
            for test in report.get("tests", []):
                flaky_counter[test] += 1

    # Calcular tasa de flakiness por test
    stability_report = {
        "generated": datetime.now().isoformat(),
        "total_pipeline_runs": total_runs,
        "flaky_tests": []
    }

    for test_name, flaky_count in flaky_counter.most_common():
        flaky_rate = (flaky_count / total_runs) * 100
        stability_report["flaky_tests"].append({
            "test": test_name,
            "flaky_count": flaky_count,
            "flaky_rate": f"{flaky_rate:.1f}%",
            "recommendation": get_recommendation(flaky_rate)
        })

    return stability_report

def get_recommendation(flaky_rate):
    """Recomendar accion basada en la tasa de flakiness."""
    if flaky_rate > 30:
        return "CUARENTENA INMEDIATA - Investigar causa raiz"
    elif flaky_rate > 15:
        return "ALTA PRIORIDAD - Agregar retry + investigar"
    elif flaky_rate > 5:
        return "MEDIA - Monitorear, agregar retry temporal"
    else:
        return "BAJA - Monitorear, posible falso positivo"

if __name__ == "__main__":
    report = analyze_flaky_history()
    print(json.dumps(report, indent=2))</code></pre>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Configuracion recomendada por entorno</h4>
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Entorno</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Reruns</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Delay</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Cuarentena</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Local (desarrollo)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">0</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">-</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">No excluir</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">CI - Pull Request</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">2</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">1s</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Excluir</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">CI - Main/Develop</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">3</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">2s</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Excluir</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Pipeline cuarentena</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">5</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">3s</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Solo cuarentena</td>
                </tr>
            </table>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Ejercicio Practico</h4>
            <p>Implementa un sistema completo de manejo de flaky tests:</p>
            <ol>
                <li>Configura <code>pytest-rerunfailures</code> con opciones diferenciadas para local y CI</li>
                <li>Crea el marcador <code>@pytest.mark.quarantine</code> y registralo en conftest.py</li>
                <li>Marca 2 tests como quarantine y verifica que se excluyen del pipeline principal</li>
                <li>Implementa un hook que genere un reporte JSON de tests flaky despues de cada ejecucion</li>
                <li>Configura un workflow de GitHub Actions con pipeline separado para cuarentena</li>
            </ol>

            <pre><code class="python"># Verificacion del ejercicio
# conftest.py debe incluir:
# - Marcador quarantine registrado
# - Hook pytest_terminal_summary para reporte
# - Generacion de flaky-tests.json

# pyproject.toml debe incluir:
# [tool.pytest.ini_options]
# addopts = "--reruns 2 --reruns-delay 1 -m 'not quarantine'"

# Verificar que funciona:
# pytest tests/ -v  -> NO ejecuta tests @quarantine
# pytest tests/ -m "quarantine" --reruns 5  -> SOLO ejecuta quarantine</code></pre>
        </div>

        <div style="background: #fce4ec; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Advertencia: Retry no es la solucion</h4>
            <p>El retry es un <strong>parche temporal</strong>, no una solucion definitiva.
            Cada test en cuarentena debe tener un ticket asociado con prioridad para investigar
            y corregir la causa raiz. Un sistema de cuarentena que crece sin control es una
            senal de deuda tecnica acumulada en la suite de tests.</p>
        </div>

        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>En la siguiente leccion</strong> exploraras la integracion de Playwright con
            <strong>Azure DevOps y pipelines Windows</strong>, aprendiendo a configurar YAML pipelines
            en Azure DevOps y a ejecutar tests en agentes Windows y Linux.</p>
        </div>
    `,
    topics: ["retry", "flaky", "estabilidad"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_114 = LESSON_114;
}
