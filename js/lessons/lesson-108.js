/**
 * Playwright Academy - Lección 108
 * Métricas y dashboards personalizados
 * Sección 16: Reporting y Trace Viewer
 */

const LESSON_108 = {
    id: 108,
    title: "Métricas y dashboards personalizados",
    duration: "7 min",
    level: "advanced",
    section: "section-16",
    content: `
        <h2>📊 Métricas y dashboards personalizados</h2>
        <p>Los reportes estándar (pytest-html, Allure) muestran resultados de una ejecución individual,
        pero en equipos de QA profesionales necesitamos <strong>métricas históricas</strong> y
        <strong>dashboards personalizados</strong> que revelen tendencias, identifiquen tests flaky,
        midan cobertura y optimicen tiempos de ejecución a lo largo del tiempo.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📌 ¿Por qué métricas personalizadas?</h4>
            <p>Las métricas de testing permiten responder preguntas clave:</p>
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Pregunta</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Métrica</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Valor típico</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">¿Qué tan estable es la suite?</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Pass Rate</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">&gt; 95%</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">¿Cuánto tarda la suite?</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Tiempo total</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">&lt; 15 min (CI)</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">¿Hay tests intermitentes?</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Flaky Rate</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">&lt; 3%</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">¿Qué funcionalidades están cubiertas?</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Cobertura</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">&gt; 80% features</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">¿Qué tests son los más lentos?</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Top N lentos</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Identificar &gt; 30s</td>
                </tr>
            </table>
        </div>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🏢 Contexto SIESA</h4>
            <p>En SIESA, el equipo de QA de HCM y ERP ejecuta suites de regresión en cada sprint.
            Un dashboard personalizado permite al <strong>Líder QA</strong> presentar al equipo de desarrollo
            métricas claras: cuántos tests pasan, cuáles fallan recurrentemente, qué módulos carecen
            de cobertura y si la suite se ha vuelto más lenta con el tiempo. Esto convierte los datos
            de testing en <strong>información accionable para la toma de decisiones</strong>.</p>
        </div>

        <h3>📐 1. Métricas clave de QA</h3>
        <p>Antes de recolectar datos, definamos las métricas fundamentales:</p>

        <pre><code class="python"># metrics/models.py - Modelos de métricas
"""Definiciones de métricas clave para QA."""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional


@dataclass
class TestResult:
    """Resultado individual de un test."""
    name: str
    status: str            # "passed", "failed", "skipped", "error"
    duration: float        # Segundos
    module: str            # Módulo o feature
    timestamp: str = ""
    error_message: str = ""
    markers: list = field(default_factory=list)

    def __post_init__(self):
        if not self.timestamp:
            self.timestamp = datetime.now().isoformat()


@dataclass
class SuiteMetrics:
    """Métricas agregadas de una ejecución completa."""
    run_id: str
    timestamp: str
    total_tests: int
    passed: int
    failed: int
    skipped: int
    errors: int
    duration_seconds: float
    pass_rate: float           # 0.0 - 100.0
    avg_test_duration: float
    slowest_tests: list = field(default_factory=list)  # Top 5
    failed_tests: list = field(default_factory=list)
    environment: str = "local"
    branch: str = "main"

    @property
    def fail_rate(self) -> float:
        return 100.0 - self.pass_rate

    @property
    def is_healthy(self) -> bool:
        """Suite saludable: >95% pass rate."""
        return self.pass_rate >= 95.0


@dataclass
class FlakyTestRecord:
    """Registro de test flaky (alterna pass/fail)."""
    test_name: str
    total_runs: int
    passes: int
    failures: int
    flaky_score: float  # 0.0 (estable) - 1.0 (muy flaky)
    last_results: list = field(default_factory=list)  # Últimos N resultados

    @property
    def flaky_rate(self) -> float:
        """Porcentaje de veces que falló."""
        if self.total_runs == 0:
            return 0.0
        return (self.failures / self.total_runs) * 100.0</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Buena práctica</h4>
            <p>Define tus métricas como <strong>dataclasses</strong> con propiedades calculadas.
            Esto facilita la serialización a JSON/CSV y mantiene la lógica de cálculo
            centralizada y testeable.</p>
        </div>

        <h3>🔧 2. Recolectando métricas con pytest hooks</h3>
        <p>Pytest ofrece hooks poderosos para interceptar resultados de cada test. El hook
        <code>pytest_runtest_makereport</code> se ejecuta en cada fase (setup, call, teardown)
        de cada test:</p>

        <pre><code class="python"># conftest.py - Recolección de métricas con hooks de pytest
"""Hooks de pytest para recolectar métricas de ejecución."""

import json
import time
from datetime import datetime
from pathlib import Path
import pytest


# Almacén global de resultados (se resetea cada sesión)
_test_results = []
_session_start = None


def pytest_sessionstart(session):
    """Se ejecuta al inicio de la sesión de tests."""
    global _session_start
    _session_start = time.time()
    print("\\n📊 Recolector de métricas iniciado")


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Hook que intercepta el resultado de cada test.

    Se ejecuta 3 veces por test: setup, call, teardown.
    Solo nos interesa la fase 'call' (la ejecución real).
    """
    outcome = yield
    report = outcome.get_result()

    # Solo procesar la fase de ejecución (call), no setup/teardown
    if report.when == "call":
        result = {
            "name": item.name,
            "nodeid": item.nodeid,
            "status": report.outcome,        # "passed", "failed", "skipped"
            "duration": round(report.duration, 3),
            "module": item.module.__name__ if item.module else "unknown",
            "markers": [m.name for m in item.iter_markers()],
            "timestamp": datetime.now().isoformat(),
        }

        # Capturar mensaje de error si falló
        if report.failed:
            result["error_message"] = str(report.longrepr)[:500]

        _test_results.append(result)

    # También capturar errores en setup (fixture failures)
    elif report.when == "setup" and report.failed:
        result = {
            "name": item.name,
            "nodeid": item.nodeid,
            "status": "error",
            "duration": round(report.duration, 3),
            "module": item.module.__name__ if item.module else "unknown",
            "markers": [m.name for m in item.iter_markers()],
            "timestamp": datetime.now().isoformat(),
            "error_message": f"Setup failed: {str(report.longrepr)[:500]}",
        }
        _test_results.append(result)


def pytest_sessionfinish(session, exitstatus):
    """Se ejecuta al final de la sesión. Genera el archivo de métricas."""
    global _session_start

    duration = time.time() - _session_start if _session_start else 0
    total = len(_test_results)
    passed = sum(1 for r in _test_results if r["status"] == "passed")
    failed = sum(1 for r in _test_results if r["status"] == "failed")
    skipped = sum(1 for r in _test_results if r["status"] == "skipped")
    errors = sum(1 for r in _test_results if r["status"] == "error")

    # Calcular métricas agregadas
    pass_rate = (passed / total * 100) if total > 0 else 0
    avg_duration = (
        sum(r["duration"] for r in _test_results) / total
        if total > 0 else 0
    )

    # Top 5 tests más lentos
    sorted_by_time = sorted(
        _test_results, key=lambda r: r["duration"], reverse=True
    )
    slowest = [
        {"name": r["name"], "duration": r["duration"]}
        for r in sorted_by_time[:5]
    ]

    # Tests fallidos
    failures = [
        {"name": r["name"], "error": r.get("error_message", "")[:200]}
        for r in _test_results if r["status"] in ("failed", "error")
    ]

    # Construir reporte de métricas
    run_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    metrics = {
        "run_id": run_id,
        "timestamp": datetime.now().isoformat(),
        "environment": session.config.getoption("--env", default="local")
            if hasattr(session.config, "getoption") else "local",
        "total_tests": total,
        "passed": passed,
        "failed": failed,
        "skipped": skipped,
        "errors": errors,
        "pass_rate": round(pass_rate, 2),
        "total_duration_seconds": round(duration, 2),
        "avg_test_duration": round(avg_duration, 3),
        "slowest_tests": slowest,
        "failed_tests": failures,
        "results": _test_results,
    }

    # Guardar métricas en JSON
    metrics_dir = Path("metrics")
    metrics_dir.mkdir(exist_ok=True)
    metrics_file = metrics_dir / f"run_{run_id}.json"
    metrics_file.write_text(json.dumps(metrics, indent=2, ensure_ascii=False))

    print(f"\\n📊 Métricas guardadas en: {metrics_file}")
    print(f"   Total: {total} | Pass: {passed} | Fail: {failed} | "
          f"Skip: {skipped} | Rate: {pass_rate:.1f}%")</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip</h4>
            <p>El decorador <code>@pytest.hookimpl(hookwrapper=True)</code> permite acceder al
            resultado del hook usando <code>yield</code>. Sin <code>hookwrapper</code>, solo puedes
            observar los argumentos de entrada, no el resultado generado.</p>
        </div>

        <h3>💾 3. Almacenamiento histórico en JSON y CSV</h3>
        <p>Para análisis de tendencias, necesitamos acumular métricas de múltiples ejecuciones.
        Usamos un archivo JSON histórico y opcionalmente CSV para análisis en Excel:</p>

        <pre><code class="python"># metrics/storage.py - Almacenamiento histórico de métricas
"""Persistencia de métricas en JSON y CSV para análisis histórico."""

import csv
import json
from datetime import datetime
from pathlib import Path
from typing import Optional


class MetricsStorage:
    """Almacena y consulta métricas históricas de ejecuciones."""

    def __init__(self, base_dir: str = "metrics"):
        self.base_dir = Path(base_dir)
        self.base_dir.mkdir(exist_ok=True)
        self.history_file = self.base_dir / "history.json"
        self.csv_file = self.base_dir / "history.csv"

    def load_history(self) -> list:
        """Carga el historial completo de ejecuciones."""
        if self.history_file.exists():
            return json.loads(self.history_file.read_text(encoding="utf-8"))
        return []

    def append_run(self, metrics: dict) -> None:
        """Agrega una ejecución al historial JSON y CSV."""
        # Actualizar JSON
        history = self.load_history()
        # Guardar solo métricas agregadas, no cada resultado individual
        summary = {
            "run_id": metrics["run_id"],
            "timestamp": metrics["timestamp"],
            "environment": metrics.get("environment", "local"),
            "total_tests": metrics["total_tests"],
            "passed": metrics["passed"],
            "failed": metrics["failed"],
            "skipped": metrics["skipped"],
            "errors": metrics.get("errors", 0),
            "pass_rate": metrics["pass_rate"],
            "total_duration": metrics["total_duration_seconds"],
            "avg_duration": metrics["avg_test_duration"],
            "slowest_test": (
                metrics["slowest_tests"][0]["name"]
                if metrics.get("slowest_tests") else ""
            ),
        }
        history.append(summary)
        self.history_file.write_text(
            json.dumps(history, indent=2, ensure_ascii=False),
            encoding="utf-8"
        )

        # Actualizar CSV (para análisis en Excel o Google Sheets)
        csv_exists = self.csv_file.exists()
        with open(self.csv_file, "a", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=summary.keys())
            if not csv_exists:
                writer.writeheader()
            writer.writerow(summary)

    def get_last_n_runs(self, n: int = 10) -> list:
        """Retorna las últimas N ejecuciones."""
        history = self.load_history()
        return history[-n:]

    def get_pass_rate_trend(self, n: int = 20) -> list:
        """Retorna la tendencia del pass rate (últimas N ejecuciones)."""
        runs = self.get_last_n_runs(n)
        return [
            {"run_id": r["run_id"], "date": r["timestamp"][:10],
             "pass_rate": r["pass_rate"]}
            for r in runs
        ]

    def get_duration_trend(self, n: int = 20) -> list:
        """Retorna la tendencia de duración total."""
        runs = self.get_last_n_runs(n)
        return [
            {"run_id": r["run_id"], "date": r["timestamp"][:10],
             "duration": r["total_duration"]}
            for r in runs
        ]</code></pre>

        <h3>🖥️ 4. Dashboard HTML con Jinja2</h3>
        <p>Generamos un dashboard HTML estático que puede verse en cualquier navegador,
        compartirse por correo o servirse desde CI/CD. Usamos <strong>Jinja2</strong> para
        las plantillas y <strong>Chart.js</strong> (CDN) para gráficas interactivas:</p>

        <pre><code class="python"># metrics/dashboard.py - Generador de dashboard HTML
"""Genera un dashboard HTML interactivo con métricas de testing."""

import json
from datetime import datetime
from pathlib import Path
from jinja2 import Template


class DashboardGenerator:
    """Genera dashboard HTML con métricas históricas y de ejecución."""

    def __init__(self, metrics_dir: str = "metrics"):
        self.metrics_dir = Path(metrics_dir)
        self.output_dir = self.metrics_dir / "dashboard"
        self.output_dir.mkdir(exist_ok=True)

    def generate(self, current_run: dict, history: list) -> str:
        """Genera el dashboard HTML completo.

        Args:
            current_run: Métricas de la ejecución actual.
            history: Lista de ejecuciones históricas.

        Returns:
            Ruta al archivo HTML generado.
        """
        template = Template(DASHBOARD_TEMPLATE)

        # Preparar datos para Chart.js
        trend_labels = [h["timestamp"][:10] for h in history[-20:]]
        pass_rates = [h["pass_rate"] for h in history[-20:]]
        durations = [h["total_duration"] for h in history[-20:]]

        html = template.render(
            run=current_run,
            history=history[-20:],
            trend_labels=json.dumps(trend_labels),
            pass_rates=json.dumps(pass_rates),
            durations=json.dumps(durations),
            generated_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            total_runs=len(history),
        )

        output_file = self.output_dir / "index.html"
        output_file.write_text(html, encoding="utf-8")
        return str(output_file)


# Plantilla HTML del dashboard con Chart.js
DASHBOARD_TEMPLATE = """&lt;!DOCTYPE html&gt;
&lt;html lang="es"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;QA Dashboard - Playwright Tests&lt;/title&gt;
    &lt;script src="https://cdn.jsdelivr.net/npm/chart.js"&gt;&lt;/script&gt;
    &lt;style&gt;
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; background: #f5f5f5;
               padding: 20px; color: #333; }
        .header { background: #009688; color: white; padding: 20px;
                  border-radius: 8px; margin-bottom: 20px; }
        .cards { display: grid; grid-template-columns: repeat(4, 1fr);
                 gap: 15px; margin-bottom: 20px; }
        .card { background: white; padding: 20px; border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
        .card .value { font-size: 2.5em; font-weight: bold; }
        .card .label { color: #666; margin-top: 5px; }
        .card.green .value { color: #4caf50; }
        .card.red .value { color: #f44336; }
        .card.blue .value { color: #2196f3; }
        .card.orange .value { color: #ff9800; }
        .chart-row { display: grid; grid-template-columns: 1fr 1fr;
                     gap: 15px; margin-bottom: 20px; }
        .chart-box { background: white; padding: 20px; border-radius: 8px;
                     box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px; border-bottom: 1px solid #eee;
                 text-align: left; }
        th { background: #009688; color: white; }
        .status-pass { color: #4caf50; font-weight: bold; }
        .status-fail { color: #f44336; font-weight: bold; }
        .footer { text-align: center; color: #999; margin-top: 20px; }
    &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;div class="header"&gt;
        &lt;h1&gt;📊 QA Dashboard - Playwright Tests&lt;/h1&gt;
        &lt;p&gt;Ejecución: {{ run.run_id }} | Generado: {{ generated_at }}&lt;/p&gt;
    &lt;/div&gt;

    &lt;!-- Summary Cards --&gt;
    &lt;div class="cards"&gt;
        &lt;div class="card green"&gt;
            &lt;div class="value"&gt;{{ run.pass_rate }}%&lt;/div&gt;
            &lt;div class="label"&gt;Pass Rate&lt;/div&gt;
        &lt;/div&gt;
        &lt;div class="card blue"&gt;
            &lt;div class="value"&gt;{{ run.total_tests }}&lt;/div&gt;
            &lt;div class="label"&gt;Tests Totales&lt;/div&gt;
        &lt;/div&gt;
        &lt;div class="card red"&gt;
            &lt;div class="value"&gt;{{ run.failed }}&lt;/div&gt;
            &lt;div class="label"&gt;Fallidos&lt;/div&gt;
        &lt;/div&gt;
        &lt;div class="card orange"&gt;
            &lt;div class="value"&gt;{{ run.total_duration_seconds }}s&lt;/div&gt;
            &lt;div class="label"&gt;Duración Total&lt;/div&gt;
        &lt;/div&gt;
    &lt;/div&gt;

    &lt;!-- Trend Charts --&gt;
    &lt;div class="chart-row"&gt;
        &lt;div class="chart-box"&gt;
            &lt;h3&gt;Tendencia Pass Rate&lt;/h3&gt;
            &lt;canvas id="passRateChart"&gt;&lt;/canvas&gt;
        &lt;/div&gt;
        &lt;div class="chart-box"&gt;
            &lt;h3&gt;Tendencia Duración&lt;/h3&gt;
            &lt;canvas id="durationChart"&gt;&lt;/canvas&gt;
        &lt;/div&gt;
    &lt;/div&gt;

    &lt;!-- Slowest Tests & Failures --&gt;
    &lt;div class="chart-row"&gt;
        &lt;div class="chart-box"&gt;
            &lt;h3&gt;🐌 Tests Más Lentos&lt;/h3&gt;
            &lt;table&gt;
                &lt;tr&gt;&lt;th&gt;Test&lt;/th&gt;&lt;th&gt;Duración&lt;/th&gt;&lt;/tr&gt;
                {% for t in run.slowest_tests %}
                &lt;tr&gt;
                    &lt;td&gt;{{ t.name }}&lt;/td&gt;
                    &lt;td&gt;{{ t.duration }}s&lt;/td&gt;
                &lt;/tr&gt;
                {% endfor %}
            &lt;/table&gt;
        &lt;/div&gt;
        &lt;div class="chart-box"&gt;
            &lt;h3&gt;❌ Tests Fallidos&lt;/h3&gt;
            &lt;table&gt;
                &lt;tr&gt;&lt;th&gt;Test&lt;/th&gt;&lt;th&gt;Error&lt;/th&gt;&lt;/tr&gt;
                {% for t in run.failed_tests %}
                &lt;tr&gt;
                    &lt;td&gt;&lt;span class="status-fail"&gt;{{ t.name }}&lt;/span&gt;&lt;/td&gt;
                    &lt;td&gt;{{ t.error[:100] }}...&lt;/td&gt;
                &lt;/tr&gt;
                {% endfor %}
            &lt;/table&gt;
        &lt;/div&gt;
    &lt;/div&gt;

    &lt;div class="footer"&gt;
        Total ejecuciones históricas: {{ total_runs }} |
        SIESA QA Team - Playwright Academy
    &lt;/div&gt;

    &lt;script&gt;
    // Gráfica de Pass Rate
    new Chart(document.getElementById('passRateChart'), {
        type: 'line',
        data: {
            labels: {{ trend_labels }},
            datasets: [{
                label: 'Pass Rate (%)',
                data: {{ pass_rates }},
                borderColor: '#4caf50',
                backgroundColor: 'rgba(76,175,80,0.1)',
                fill: true, tension: 0.3
            }]
        },
        options: {
            scales: { y: { min: 0, max: 100 } },
            plugins: { legend: { display: false } }
        }
    });

    // Gráfica de Duración
    new Chart(document.getElementById('durationChart'), {
        type: 'bar',
        data: {
            labels: {{ trend_labels }},
            datasets: [{
                label: 'Duración (s)',
                data: {{ durations }},
                backgroundColor: '#2196f3'
            }]
        },
        options: {
            plugins: { legend: { display: false } }
        }
    });
    &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;
"""</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>El dashboard usa el color <strong>#009688 (teal)</strong> como color corporativo de SIESA
            en el header y los encabezados de tabla. Puedes personalizar los colores para que coincidan
            con la identidad visual de tu equipo. Chart.js se carga desde CDN, así que el HTML generado
            funciona sin dependencias locales adicionales.</p>
        </div>

        <h3>⏱️ 5. Tracking de tiempo y optimización</h3>
        <p>Identificar tests lentos es clave para mantener la suite ágil. Implementamos un
        colector de tiempos que genera análisis detallado:</p>

        <pre><code class="python"># metrics/timing.py - Análisis de tiempos de ejecución
"""Analiza tiempos de ejecución para identificar cuellos de botella."""

import statistics
from typing import Optional


class TimingAnalyzer:
    """Analiza tiempos de ejecución de tests."""

    def __init__(self, results: list):
        """
        Args:
            results: Lista de dicts con al menos 'name' y 'duration'.
        """
        self.results = results
        self.durations = [r["duration"] for r in results if r.get("duration")]

    def summary(self) -> dict:
        """Resumen estadístico de tiempos."""
        if not self.durations:
            return {"error": "No hay datos de duración"}

        return {
            "total_tests": len(self.durations),
            "total_time": round(sum(self.durations), 2),
            "avg_time": round(statistics.mean(self.durations), 3),
            "median_time": round(statistics.median(self.durations), 3),
            "std_dev": round(statistics.stdev(self.durations), 3)
                if len(self.durations) > 1 else 0,
            "min_time": round(min(self.durations), 3),
            "max_time": round(max(self.durations), 3),
            "p90": round(self._percentile(90), 3),
            "p95": round(self._percentile(95), 3),
        }

    def slowest(self, n: int = 10) -> list:
        """Top N tests más lentos."""
        sorted_results = sorted(
            self.results, key=lambda r: r.get("duration", 0), reverse=True
        )
        return [
            {"name": r["name"], "duration": r["duration"],
             "module": r.get("module", "")}
            for r in sorted_results[:n]
        ]

    def by_module(self) -> dict:
        """Agrupa tiempos por módulo/archivo."""
        modules = {}
        for r in self.results:
            mod = r.get("module", "unknown")
            if mod not in modules:
                modules[mod] = {"tests": 0, "total_time": 0, "names": []}
            modules[mod]["tests"] += 1
            modules[mod]["total_time"] += r.get("duration", 0)
            modules[mod]["names"].append(r["name"])

        # Calcular promedio y ordenar por tiempo total
        for mod in modules:
            modules[mod]["avg_time"] = round(
                modules[mod]["total_time"] / modules[mod]["tests"], 3
            )
            modules[mod]["total_time"] = round(modules[mod]["total_time"], 2)

        return dict(sorted(
            modules.items(),
            key=lambda x: x[1]["total_time"],
            reverse=True
        ))

    def optimization_suggestions(self) -> list:
        """Genera sugerencias de optimización basadas en los datos."""
        suggestions = []
        summary = self.summary()

        if summary.get("p95", 0) > 30:
            slow = self.slowest(3)
            names = ", ".join(s["name"] for s in slow)
            suggestions.append(
                f"Los tests más lentos superan 30s (P95={summary['p95']}s). "
                f"Revisa: {names}"
            )

        if summary.get("std_dev", 0) > summary.get("avg_time", 1) * 0.5:
            suggestions.append(
                "Alta variabilidad en tiempos. Algunos tests pueden tener "
                "waits innecesarios o dependencias externas lentas."
            )

        if summary.get("total_time", 0) > 600:
            suggestions.append(
                f"Suite total: {summary['total_time']}s (>10 min). "
                "Considera ejecutar en paralelo con pytest-xdist."
            )

        return suggestions

    def _percentile(self, p: float) -> float:
        """Calcula el percentil p de las duraciones."""
        sorted_d = sorted(self.durations)
        idx = int(len(sorted_d) * p / 100)
        return sorted_d[min(idx, len(sorted_d) - 1)]</code></pre>

        <h3>🔄 6. Detección de tests flaky</h3>
        <p>Un test <strong>flaky</strong> es aquel que alterna entre pass y fail sin cambios en el código.
        Son la pesadilla de cualquier equipo de QA. Implementamos un detector que analiza
        el historial:</p>

        <pre><code class="python"># metrics/flaky_detector.py - Detección de tests flaky
"""Detecta tests intermitentes analizando historial de resultados."""

import json
from pathlib import Path
from collections import defaultdict


class FlakyDetector:
    """Detecta tests flaky analizando múltiples ejecuciones."""

    def __init__(self, metrics_dir: str = "metrics"):
        self.metrics_dir = Path(metrics_dir)

    def analyze(self, min_runs: int = 5, window: int = 20) -> list:
        """Analiza las últimas N ejecuciones para detectar tests flaky.

        Args:
            min_runs: Mínimo de ejecuciones para considerar un test.
            window: Cantidad de ejecuciones recientes a analizar.

        Returns:
            Lista de tests flaky con su flaky_score.
        """
        # Cargar todos los archivos de ejecución recientes
        run_files = sorted(
            self.metrics_dir.glob("run_*.json"),
            key=lambda f: f.name
        )[-window:]

        if len(run_files) < min_runs:
            return []

        # Acumular resultados por test
        test_history = defaultdict(list)
        for run_file in run_files:
            data = json.loads(run_file.read_text(encoding="utf-8"))
            for result in data.get("results", []):
                test_history[result["name"]].append(result["status"])

        # Calcular flaky score para cada test
        flaky_tests = []
        for test_name, statuses in test_history.items():
            if len(statuses) < min_runs:
                continue

            passes = statuses.count("passed")
            failures = statuses.count("failed") + statuses.count("error")
            total = passes + failures

            if total == 0:
                continue

            # Flaky score: 1.0 = máxima flakiness (50/50)
            # Un test que siempre pasa o siempre falla tiene score 0
            ratio = min(passes, failures) / max(passes, failures) \
                if max(passes, failures) > 0 else 0

            # También contar "cambios de estado" (pass->fail o fail->pass)
            transitions = sum(
                1 for i in range(1, len(statuses))
                if statuses[i] != statuses[i-1]
                and statuses[i] in ("passed", "failed")
                and statuses[i-1] in ("passed", "failed")
            )
            transition_rate = transitions / (len(statuses) - 1) \
                if len(statuses) > 1 else 0

            # Score combinado: ratio de fallos + frecuencia de cambios
            flaky_score = round((ratio * 0.4 + transition_rate * 0.6), 3)

            if flaky_score > 0.1:  # Umbral mínimo de flakiness
                flaky_tests.append({
                    "test_name": test_name,
                    "total_runs": len(statuses),
                    "passes": passes,
                    "failures": failures,
                    "flaky_score": flaky_score,
                    "transition_rate": round(transition_rate, 3),
                    "last_5": statuses[-5:],
                })

        # Ordenar por flaky_score descendente
        return sorted(
            flaky_tests, key=lambda t: t["flaky_score"], reverse=True
        )</code></pre>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚠️ Errores comunes con tests flaky</h4>
            <ul>
                <li><strong>Ignorar los flaky tests:</strong> No marques un test como <code>@pytest.mark.skip</code>
                sin investigar la causa. Un test flaky puede esconder un bug real intermitente.</li>
                <li><strong>Race conditions:</strong> La causa más común es esperar tiempos fijos
                (<code>time.sleep</code>) en lugar de usar <code>expect()</code> de Playwright.</li>
                <li><strong>Estado compartido:</strong> Tests que dependen de datos creados por otros tests
                fallan cuando el orden de ejecución cambia.</li>
                <li><strong>Recursos externos:</strong> Tests que dependen de APIs externas o servicios
                inestables producen falsos negativos.</li>
            </ul>
        </div>

        <h3>📋 7. Métricas de cobertura funcional</h3>
        <p>Más allá de cobertura de código, en QA nos interesa saber <strong>qué funcionalidades
        y páginas están cubiertas</strong> por tests automatizados. Usamos markers de pytest
        para rastrear esto:</p>

        <pre><code class="python"># conftest.py - Markers para cobertura funcional
"""Definir markers que rastrean qué features y páginas se testean."""

import pytest


def pytest_configure(config):
    """Registrar markers personalizados."""
    config.addinivalue_line("markers", "feature(name): feature bajo prueba")
    config.addinivalue_line("markers", "page(name): página/módulo bajo prueba")
    config.addinivalue_line("markers", "priority(level): prioridad (P0-P3)")


# --- Ejemplo de uso en tests ---

# tests/test_login.py
@pytest.mark.feature("autenticación")
@pytest.mark.page("login")
@pytest.mark.priority("P0")
def test_login_exitoso(page):
    page.goto("https://example.com/login")
    page.fill("#username", "admin")
    page.fill("#password", "secret")
    page.click("button[type='submit']")
    expect(page).to_have_url("/dashboard")


@pytest.mark.feature("autenticación")
@pytest.mark.page("login")
@pytest.mark.priority("P0")
def test_login_credenciales_invalidas(page):
    page.goto("https://example.com/login")
    page.fill("#username", "admin")
    page.fill("#password", "wrong")
    page.click("button[type='submit']")
    expect(page.locator(".error")).to_be_visible()</code></pre>

        <pre><code class="python"># metrics/coverage.py - Análisis de cobertura funcional
"""Analiza cobertura funcional basada en markers de pytest."""

import json
from pathlib import Path
from collections import defaultdict


class CoverageAnalyzer:
    """Analiza qué features y páginas tienen cobertura de tests."""

    def __init__(self, metrics_dir: str = "metrics"):
        self.metrics_dir = Path(metrics_dir)

    def analyze_from_run(self, run_file: str) -> dict:
        """Analiza cobertura desde un archivo de ejecución.

        Returns:
            Dict con cobertura por feature, por página y por prioridad.
        """
        data = json.loads(Path(run_file).read_text(encoding="utf-8"))
        results = data.get("results", [])

        features = defaultdict(lambda: {"total": 0, "passed": 0, "tests": []})
        pages = defaultdict(lambda: {"total": 0, "passed": 0, "tests": []})
        priorities = defaultdict(lambda: {"total": 0, "passed": 0})

        for r in results:
            markers = r.get("markers", [])

            for marker in markers:
                # Detectar markers de feature
                if marker.startswith("feature"):
                    feat = marker  # Se guarda el marker completo
                    features[feat]["total"] += 1
                    if r["status"] == "passed":
                        features[feat]["passed"] += 1
                    features[feat]["tests"].append(r["name"])

                # Detectar markers de página
                elif marker.startswith("page"):
                    pages[marker]["total"] += 1
                    if r["status"] == "passed":
                        pages[marker]["passed"] += 1
                    pages[marker]["tests"].append(r["name"])

                # Detectar prioridad
                elif marker.startswith("priority"):
                    priorities[marker]["total"] += 1
                    if r["status"] == "passed":
                        priorities[marker]["passed"] += 1

        return {
            "features": dict(features),
            "pages": dict(pages),
            "priorities": dict(priorities),
            "total_features": len(features),
            "total_pages": len(pages),
        }

    def coverage_matrix(self, run_file: str) -> str:
        """Genera una matriz de cobertura en texto para consola."""
        analysis = self.analyze_from_run(run_file)
        lines = ["\\n=== Matriz de Cobertura Funcional ===\\n"]

        lines.append("Features:")
        for feat, data in analysis["features"].items():
            rate = (data["passed"] / data["total"] * 100) if data["total"] else 0
            status = "✅" if rate == 100 else "⚠️" if rate >= 80 else "❌"
            lines.append(
                f"  {status} {feat}: {data['passed']}/{data['total']} "
                f"({rate:.0f}%)"
            )

        lines.append("\\nPáginas:")
        for pg, data in analysis["pages"].items():
            rate = (data["passed"] / data["total"] * 100) if data["total"] else 0
            lines.append(f"  {pg}: {data['total']} tests ({rate:.0f}% pass)")

        return "\\n".join(lines)</code></pre>

        <h3>📤 8. Enviando métricas a sistemas externos</h3>
        <p>Las métricas son más útiles cuando llegan al equipo automáticamente. Implementamos
        notificadores para Slack, email y webhooks genéricos:</p>

        <pre><code class="python"># metrics/notifiers.py - Envío de métricas a sistemas externos
"""Envía resúmenes de métricas a Slack, email y webhooks."""

import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from urllib.request import Request, urlopen
from urllib.error import URLError


class SlackNotifier:
    """Envía resúmenes de ejecución a un canal de Slack."""

    def __init__(self, webhook_url: str):
        self.webhook_url = webhook_url

    def send_summary(self, metrics: dict) -> bool:
        """Envía resumen de ejecución a Slack.

        Args:
            metrics: Dict con métricas agregadas de la ejecución.

        Returns:
            True si se envió correctamente.
        """
        # Construir mensaje con bloques de Slack
        status_emoji = "✅" if metrics["pass_rate"] >= 95 else \
                       "⚠️" if metrics["pass_rate"] >= 80 else "❌"

        blocks = [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": f"{status_emoji} QA Report - "
                            f"{metrics['run_id']}"
                }
            },
            {
                "type": "section",
                "fields": [
                    {"type": "mrkdwn",
                     "text": f"*Pass Rate:* {metrics['pass_rate']}%"},
                    {"type": "mrkdwn",
                     "text": f"*Total:* {metrics['total_tests']} tests"},
                    {"type": "mrkdwn",
                     "text": f"*Fallidos:* {metrics['failed']}"},
                    {"type": "mrkdwn",
                     "text": f"*Duración:* {metrics['total_duration_seconds']}s"},
                ]
            },
        ]

        # Agregar tests fallidos si los hay
        if metrics.get("failed_tests"):
            failure_text = "\\n".join(
                f"• {t['name']}" for t in metrics["failed_tests"][:5]
            )
            blocks.append({
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"*Tests fallidos:*\\n{failure_text}"
                }
            })

        payload = json.dumps({"blocks": blocks}).encode("utf-8")

        try:
            req = Request(
                self.webhook_url,
                data=payload,
                headers={"Content-Type": "application/json"}
            )
            urlopen(req, timeout=10)
            return True
        except URLError as e:
            print(f"Error enviando a Slack: {e}")
            return False


class WebhookNotifier:
    """Envía métricas a un endpoint webhook genérico (Teams, Discord, etc.)."""

    def __init__(self, url: str, headers: dict = None):
        self.url = url
        self.headers = headers or {"Content-Type": "application/json"}

    def send(self, metrics: dict) -> bool:
        """Envía el payload completo de métricas al webhook."""
        payload = json.dumps(metrics, ensure_ascii=False).encode("utf-8")
        try:
            req = Request(self.url, data=payload, headers=self.headers)
            urlopen(req, timeout=10)
            return True
        except URLError as e:
            print(f"Error enviando webhook: {e}")
            return False


class EmailNotifier:
    """Envía resumen de métricas por email (SMTP)."""

    def __init__(self, smtp_host: str, smtp_port: int,
                 username: str, password: str):
        self.smtp_host = smtp_host
        self.smtp_port = smtp_port
        self.username = username
        self.password = password

    def send_report(self, to_emails: list, metrics: dict) -> bool:
        """Envía un reporte HTML por email."""
        status = "PASS" if metrics["pass_rate"] >= 95 else "FAIL"
        subject = (
            f"[QA {status}] Playwright Tests - "
            f"{metrics['pass_rate']}% pass rate"
        )

        html = f"""
        &lt;h2&gt;QA Test Report - {metrics['run_id']}&lt;/h2&gt;
        &lt;table border="1" cellpadding="8"&gt;
            &lt;tr&gt;&lt;td&gt;Pass Rate&lt;/td&gt;&lt;td&gt;{metrics['pass_rate']}%&lt;/td&gt;&lt;/tr&gt;
            &lt;tr&gt;&lt;td&gt;Total Tests&lt;/td&gt;&lt;td&gt;{metrics['total_tests']}&lt;/td&gt;&lt;/tr&gt;
            &lt;tr&gt;&lt;td&gt;Passed&lt;/td&gt;&lt;td&gt;{metrics['passed']}&lt;/td&gt;&lt;/tr&gt;
            &lt;tr&gt;&lt;td&gt;Failed&lt;/td&gt;&lt;td&gt;{metrics['failed']}&lt;/td&gt;&lt;/tr&gt;
            &lt;tr&gt;&lt;td&gt;Duration&lt;/td&gt;&lt;td&gt;{metrics['total_duration_seconds']}s&lt;/td&gt;&lt;/tr&gt;
        &lt;/table&gt;
        """

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = self.username
        msg["To"] = ", ".join(to_emails)
        msg.attach(MIMEText(html, "html"))

        try:
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.username, self.password)
                server.send_message(msg)
            return True
        except Exception as e:
            print(f"Error enviando email: {e}")
            return False</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Buena práctica</h4>
            <p>Configura los webhooks y credenciales de email como <strong>variables de entorno</strong>,
            nunca hardcodeadas en el código. En CI/CD, usa secrets del pipeline.
            En local, usa un archivo <code>.env</code> que esté en <code>.gitignore</code>.</p>
        </div>

        <h3>🔌 9. Plugin pytest-json-report</h3>
        <p>Si prefieres no escribir hooks personalizados, <code>pytest-json-report</code> genera
        un JSON detallado automáticamente. Lo combinamos con nuestro sistema de métricas:</p>

        <pre><code class="python"># Instalar el plugin
# pip install pytest-json-report

# Ejecutar con reporte JSON automático
# pytest --json-report --json-report-file=metrics/latest_run.json

# El plugin genera un JSON completo con:
# - Metadatos del entorno (Python, plataforma, plugins)
# - Resumen (passed, failed, total, duration)
# - Detalle de cada test (nodeid, outcome, duration, longrepr)</code></pre>

        <pre><code class="python"># metrics/plugin_adapter.py
"""Adaptador para convertir pytest-json-report al formato de nuestro dashboard."""

import json
from pathlib import Path
from datetime import datetime


class JsonReportAdapter:
    """Convierte el JSON de pytest-json-report a nuestro formato de métricas."""

    def convert(self, json_report_path: str) -> dict:
        """Convierte un archivo de pytest-json-report al formato del dashboard.

        Args:
            json_report_path: Ruta al archivo generado por pytest-json-report.

        Returns:
            Dict con métricas en nuestro formato estándar.
        """
        data = json.loads(
            Path(json_report_path).read_text(encoding="utf-8")
        )

        summary = data.get("summary", {})
        tests = data.get("tests", [])

        # Extraer resultados individuales
        results = []
        for test in tests:
            results.append({
                "name": test["nodeid"].split("::")[-1],
                "nodeid": test["nodeid"],
                "status": test["outcome"],
                "duration": round(test.get("duration", 0), 3),
                "module": test["nodeid"].split("::")[0],
                "markers": [
                    m["name"] for m in test.get("metadata", [])
                    if isinstance(m, dict)
                ],
                "timestamp": datetime.now().isoformat(),
                "error_message": (
                    test.get("call", {}).get("longrepr", "")[:500]
                    if test.get("outcome") == "failed" else ""
                ),
            })

        # Calcular métricas agregadas
        total = len(results)
        passed = summary.get("passed", 0)
        failed = summary.get("failed", 0)
        skipped = summary.get("skipped", 0)
        pass_rate = (passed / total * 100) if total > 0 else 0
        total_duration = sum(r["duration"] for r in results)

        # Top 5 más lentos
        sorted_by_time = sorted(
            results, key=lambda r: r["duration"], reverse=True
        )
        slowest = [
            {"name": r["name"], "duration": r["duration"]}
            for r in sorted_by_time[:5]
        ]

        # Tests fallidos
        failures = [
            {"name": r["name"], "error": r.get("error_message", "")[:200]}
            for r in results if r["status"] in ("failed", "error")
        ]

        run_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        return {
            "run_id": run_id,
            "timestamp": datetime.now().isoformat(),
            "environment": data.get("environment", {}).get(
                "Platform", "unknown"
            ),
            "total_tests": total,
            "passed": passed,
            "failed": failed,
            "skipped": skipped,
            "errors": summary.get("error", 0),
            "pass_rate": round(pass_rate, 2),
            "total_duration_seconds": round(total_duration, 2),
            "avg_test_duration": round(total_duration / total, 3)
                if total > 0 else 0,
            "slowest_tests": slowest,
            "failed_tests": failures,
            "results": results,
        }


# Uso: integrar con nuestro sistema de dashboard
# adapter = JsonReportAdapter()
# metrics = adapter.convert("metrics/latest_run.json")
# storage = MetricsStorage()
# storage.append_run(metrics)
# dashboard = DashboardGenerator()
# dashboard.generate(metrics, storage.load_history())</code></pre>

        <h3>🔗 10. Integración completa: conftest.py + dashboard</h3>
        <p>Unimos todas las piezas en un <code>conftest.py</code> que recolecta métricas,
        detecta tests flaky y genera el dashboard automáticamente al final de cada ejecución:</p>

        <pre><code class="python"># conftest.py - Integración completa de métricas + dashboard
"""
Configuración completa de pytest con:
- Recolección de métricas por test
- Almacenamiento histórico
- Detección de tests flaky
- Generación automática de dashboard
"""

import json
import os
import time
from datetime import datetime
from pathlib import Path
import pytest

# Importar módulos de métricas (asumimos estructura metrics/)
# En proyecto real, estas clases estarían en archivos separados


_test_results = []
_session_start = None


def pytest_addoption(parser):
    """Agregar opciones CLI para métricas."""
    parser.addoption(
        "--metrics-dir", default="metrics",
        help="Directorio para almacenar métricas"
    )
    parser.addoption(
        "--dashboard", action="store_true", default=False,
        help="Generar dashboard HTML al finalizar"
    )
    parser.addoption(
        "--notify-slack", default=None,
        help="Webhook URL para notificación a Slack"
    )


def pytest_sessionstart(session):
    global _session_start
    _session_start = time.time()


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()

    if report.when == "call":
        _test_results.append({
            "name": item.name,
            "nodeid": item.nodeid,
            "status": report.outcome,
            "duration": round(report.duration, 3),
            "module": item.module.__name__ if item.module else "unknown",
            "markers": [m.name for m in item.iter_markers()],
            "timestamp": datetime.now().isoformat(),
            "error_message": str(report.longrepr)[:500]
                if report.failed else "",
        })


def pytest_sessionfinish(session, exitstatus):
    global _session_start
    metrics_dir = session.config.getoption("--metrics-dir", "metrics")

    duration = time.time() - _session_start if _session_start else 0
    total = len(_test_results)
    if total == 0:
        return

    passed = sum(1 for r in _test_results if r["status"] == "passed")
    failed = sum(1 for r in _test_results if r["status"] == "failed")
    skipped = sum(1 for r in _test_results if r["status"] == "skipped")
    pass_rate = round(passed / total * 100, 2)

    sorted_by_time = sorted(
        _test_results, key=lambda r: r["duration"], reverse=True
    )

    run_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    metrics = {
        "run_id": run_id,
        "timestamp": datetime.now().isoformat(),
        "total_tests": total,
        "passed": passed,
        "failed": failed,
        "skipped": skipped,
        "errors": sum(1 for r in _test_results if r["status"] == "error"),
        "pass_rate": pass_rate,
        "total_duration_seconds": round(duration, 2),
        "avg_test_duration": round(
            sum(r["duration"] for r in _test_results) / total, 3
        ),
        "slowest_tests": [
            {"name": r["name"], "duration": r["duration"]}
            for r in sorted_by_time[:5]
        ],
        "failed_tests": [
            {"name": r["name"], "error": r.get("error_message", "")[:200]}
            for r in _test_results if r["status"] in ("failed", "error")
        ],
        "results": _test_results,
    }

    # 1. Guardar ejecución individual
    Path(metrics_dir).mkdir(exist_ok=True)
    run_file = Path(metrics_dir) / f"run_{run_id}.json"
    run_file.write_text(json.dumps(metrics, indent=2, ensure_ascii=False))

    # 2. Agregar al historial
    # storage = MetricsStorage(metrics_dir)
    # storage.append_run(metrics)

    # 3. Generar dashboard si se solicitó
    # if session.config.getoption("--dashboard"):
    #     dashboard = DashboardGenerator(metrics_dir)
    #     html_path = dashboard.generate(metrics, storage.load_history())
    #     print(f"\\n📊 Dashboard: {html_path}")

    # 4. Notificar a Slack si hay webhook
    # slack_url = session.config.getoption("--notify-slack")
    # if slack_url:
    #     SlackNotifier(slack_url).send_summary(metrics)

    print(f"\\n📊 Métricas: {run_file}")
    print(f"   {passed}/{total} passed ({pass_rate}%) en {duration:.1f}s")</code></pre>

        <pre><code class="bash"># Ejecución con todas las opciones de métricas
pytest tests/ \\
    --metrics-dir=metrics \\
    --dashboard \\
    --notify-slack=https://hooks.slack.com/services/T.../B.../xxx \\
    -v

# Solo métricas (sin dashboard ni Slack)
pytest tests/ --metrics-dir=metrics

# Con pytest-json-report como alternativa
pytest tests/ \\
    --json-report \\
    --json-report-file=metrics/latest_run.json</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>En el pipeline CI/CD de SIESA, agrega <code>--dashboard</code> y publica la carpeta
            <code>metrics/dashboard/</code> como artefacto del job. Así el equipo puede ver el dashboard
            directamente desde el pipeline de Jenkins, GitHub Actions o Azure DevOps sin necesidad
            de herramientas adicionales.</p>
        </div>

        <h3>📊 11. Generando gráficas con matplotlib (alternativa offline)</h3>
        <p>Si necesitas gráficas como imágenes (para email o PDF), usa matplotlib en lugar
        de Chart.js:</p>

        <pre><code class="python"># metrics/charts.py - Gráficas con matplotlib
"""Genera gráficas estáticas de métricas para reportes offline."""

# pip install matplotlib

import matplotlib
matplotlib.use('Agg')  # Backend sin GUI (para CI/CD)
import matplotlib.pyplot as plt
from pathlib import Path


def generate_pass_rate_chart(history: list, output_dir: str = "metrics"):
    """Genera gráfica de tendencia del pass rate.

    Args:
        history: Lista de ejecuciones con 'timestamp' y 'pass_rate'.
        output_dir: Directorio de salida.

    Returns:
        Ruta al archivo PNG generado.
    """
    dates = [h["timestamp"][:10] for h in history[-20:]]
    rates = [h["pass_rate"] for h in history[-20:]]

    fig, ax = plt.subplots(figsize=(12, 5))
    ax.plot(dates, rates, marker='o', color='#4caf50', linewidth=2)
    ax.fill_between(dates, rates, alpha=0.1, color='#4caf50')
    ax.axhline(y=95, color='#f44336', linestyle='--', label='Umbral 95%')
    ax.set_ylim(0, 105)
    ax.set_xlabel('Fecha')
    ax.set_ylabel('Pass Rate (%)')
    ax.set_title('Tendencia del Pass Rate')
    ax.legend()
    plt.xticks(rotation=45)
    plt.tight_layout()

    output_path = Path(output_dir) / "pass_rate_trend.png"
    fig.savefig(output_path, dpi=150)
    plt.close(fig)
    return str(output_path)


def generate_duration_chart(history: list, output_dir: str = "metrics"):
    """Genera gráfica de barras con duración por ejecución."""
    dates = [h["timestamp"][:10] for h in history[-20:]]
    durations = [h["total_duration"] for h in history[-20:]]

    fig, ax = plt.subplots(figsize=(12, 5))
    bars = ax.bar(dates, durations, color='#2196f3', alpha=0.8)

    # Colorear barras que excedan umbral
    for bar, dur in zip(bars, durations):
        if dur > 600:  # > 10 minutos
            bar.set_color('#f44336')
        elif dur > 300:  # > 5 minutos
            bar.set_color('#ff9800')

    ax.set_xlabel('Fecha')
    ax.set_ylabel('Duración (segundos)')
    ax.set_title('Duración Total por Ejecución')
    plt.xticks(rotation=45)
    plt.tight_layout()

    output_path = Path(output_dir) / "duration_trend.png"
    fig.savefig(output_path, dpi=150)
    plt.close(fig)
    return str(output_path)


def generate_flaky_chart(flaky_tests: list, output_dir: str = "metrics"):
    """Genera gráfica horizontal de barras con tests flaky."""
    if not flaky_tests:
        return None

    names = [t["test_name"][:30] for t in flaky_tests[:10]]
    scores = [t["flaky_score"] for t in flaky_tests[:10]]

    fig, ax = plt.subplots(figsize=(10, max(4, len(names) * 0.6)))
    colors = ['#f44336' if s > 0.5 else '#ff9800' if s > 0.3 else '#ffc107'
              for s in scores]
    ax.barh(names, scores, color=colors)
    ax.set_xlabel('Flaky Score')
    ax.set_title('Tests con Mayor Flakiness')
    ax.set_xlim(0, 1)
    plt.tight_layout()

    output_path = Path(output_dir) / "flaky_tests.png"
    fig.savefig(output_path, dpi=150)
    plt.close(fig)
    return str(output_path)</code></pre>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔮 Avanzado: Chart.js vs matplotlib</h4>
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #ce93d8;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Aspecto</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Chart.js (HTML)</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">matplotlib (PNG)</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Interactividad</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Tooltips, zoom, hover</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Imagen estática</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Mejor para</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Dashboard web, CI/CD</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Email, PDF, Slack</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Dependencias</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">CDN (no pip install)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">pip install matplotlib</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Ideal en SIESA</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Dashboard del sprint</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Reporte a gerencia</td>
                </tr>
            </table>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🏋️ Ejercicio práctico: Sistema de métricas y dashboard</h4>
            <p>Construye un sistema completo de métricas para una suite de Playwright:</p>

            <p><strong>Parte 1: Recolección de métricas (conftest.py)</strong></p>
            <ol>
                <li>Crea un proyecto con la estructura <code>metrics/</code> y <code>tests/</code></li>
                <li>Implementa el hook <code>pytest_runtest_makereport</code> en <code>conftest.py</code>
                que recolecte nombre, status, duración y markers de cada test</li>
                <li>En <code>pytest_sessionfinish</code>, genera un archivo JSON con las métricas
                agregadas (pass rate, total, fallidos, top 5 lentos)</li>
            </ol>

            <p><strong>Parte 2: Tests de ejemplo con markers</strong></p>
            <pre><code class="python"># tests/test_demo_metrics.py
"""Tests de demostración para generar métricas variadas."""

import time
import pytest
from playwright.sync_api import expect


@pytest.mark.feature("navegacion")
@pytest.mark.page("home")
@pytest.mark.priority("P0")
def test_home_carga(page):
    """Test rápido que siempre pasa."""
    page.goto("https://the-internet.herokuapp.com")
    expect(page.locator("h1")).to_contain_text("Welcome")


@pytest.mark.feature("autenticacion")
@pytest.mark.page("login")
@pytest.mark.priority("P0")
def test_login_exitoso(page):
    """Test de login con duración media."""
    page.goto("https://the-internet.herokuapp.com/login")
    page.fill("#username", "tomsmith")
    page.fill("#password", "SuperSecretPassword!")
    page.click("button[type='submit']")
    expect(page.locator(".flash.success")).to_be_visible()


@pytest.mark.feature("tablas")
@pytest.mark.page("tables")
@pytest.mark.priority("P1")
def test_tabla_ordenamiento(page):
    """Test de tabla que puede ser lento."""
    page.goto("https://the-internet.herokuapp.com/tables")
    headers = page.locator("#table1 th")
    expect(headers).to_have_count(6)

    # Ordenar por apellido
    page.click("#table1 th:nth-child(1)")
    first_cell = page.locator("#table1 tbody tr:first-child td:first-child")
    expect(first_cell).to_have_text("Bach")


@pytest.mark.feature("formularios")
@pytest.mark.page("checkboxes")
@pytest.mark.priority("P2")
def test_checkbox_toggle(page):
    """Test de interacción con checkboxes."""
    page.goto("https://the-internet.herokuapp.com/checkboxes")
    checkbox1 = page.locator("input[type='checkbox']").first
    checkbox1.check()
    expect(checkbox1).to_be_checked()


@pytest.mark.feature("navegacion")
@pytest.mark.page("dropdown")
@pytest.mark.priority("P1")
def test_dropdown_seleccion(page):
    """Test de dropdown."""
    page.goto("https://the-internet.herokuapp.com/dropdown")
    page.select_option("#dropdown", "1")
    expect(page.locator("#dropdown")).to_have_value("1")</code></pre>

            <p><strong>Parte 3: Dashboard y análisis</strong></p>
            <ol>
                <li>Ejecuta los tests al menos 3 veces para generar historial:
                <code>pytest tests/test_demo_metrics.py --metrics-dir=metrics -v</code></li>
                <li>Implementa la clase <code>MetricsStorage</code> para acumular resultados en
                <code>metrics/history.json</code></li>
                <li>Implementa <code>DashboardGenerator</code> con Jinja2 que genere un HTML con:
                    <ul>
                        <li>4 tarjetas resumen (pass rate, total, fallidos, duración)</li>
                        <li>Gráfica de tendencia del pass rate (Chart.js)</li>
                        <li>Tabla de tests más lentos</li>
                        <li>Tabla de tests fallidos con mensaje de error</li>
                    </ul>
                </li>
                <li>Abre el dashboard en el navegador y verifica que las gráficas se renderizan</li>
            </ol>

            <p><strong>Bonus:</strong> Agrega la detección de tests flaky (<code>FlakyDetector</code>)
            y una sección adicional en el dashboard que muestre los tests más inestables con su
            flaky score.</p>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Resumen de la lección</h4>
            <ul>
                <li><strong>Métricas clave:</strong> pass rate, duración, flaky rate y cobertura funcional
                son las cuatro métricas esenciales para cualquier equipo QA</li>
                <li><strong>Recolección:</strong> el hook <code>pytest_runtest_makereport</code> permite
                interceptar cada resultado de test sin modificar los tests existentes</li>
                <li><strong>Almacenamiento:</strong> JSON para historial programático, CSV para análisis
                en Excel o Google Sheets</li>
                <li><strong>Dashboard:</strong> Jinja2 + Chart.js generan un HTML interactivo sin
                dependencias de servidor</li>
                <li><strong>Flaky detection:</strong> analiza transiciones pass/fail en el historial
                para identificar tests inestables</li>
                <li><strong>Notificaciones:</strong> Slack webhooks, email SMTP y webhooks genéricos
                mantienen al equipo informado automáticamente</li>
                <li><strong>Plugin alternativo:</strong> <code>pytest-json-report</code> genera métricas
                sin hooks personalizados, ideal para empezar rápido</li>
            </ul>
        </div>
    `,
    topics: ["métricas", "dashboards", "personalización"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') { window.LESSON_108 = LESSON_108; }
