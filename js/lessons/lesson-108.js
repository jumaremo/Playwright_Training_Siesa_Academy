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

        <div class="code-tabs" data-code-id="L108-1">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># metrics/models.py - Modelos de métricas
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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// metrics/models.ts - Modelos de métricas
/** Definiciones de métricas clave para QA. */

/** Resultado individual de un test. */
interface TestResult {
    name: string;
    status: string;           // "passed", "failed", "skipped", "timedOut"
    duration: number;         // Segundos
    module: string;           // Módulo o feature
    timestamp: string;
    error_message: string;
    markers: string[];
}

/** Crea un TestResult con valores por defecto. */
function createTestResult(
    params: Pick&lt;TestResult, 'name' | 'status' | 'duration' | 'module'&gt; &amp;
            Partial&lt;TestResult&gt;
): TestResult {
    return {
        timestamp: params.timestamp ?? new Date().toISOString(),
        error_message: params.error_message ?? '',
        markers: params.markers ?? [],
        ...params,
    };
}

/** Métricas agregadas de una ejecución completa. */
interface SuiteMetrics {
    run_id: string;
    timestamp: string;
    total_tests: number;
    passed: number;
    failed: number;
    skipped: number;
    errors: number;
    duration_seconds: number;
    pass_rate: number;           // 0.0 - 100.0
    avg_test_duration: number;
    slowest_tests: Array&lt;{ name: string; duration: number }&gt;;  // Top 5
    failed_tests: Array&lt;{ name: string; error: string }&gt;;
    environment: string;         // "local" por defecto
    branch: string;              // "main" por defecto
}

/** Funciones auxiliares para SuiteMetrics */
function getFailRate(metrics: SuiteMetrics): number {
    return 100.0 - metrics.pass_rate;
}

function isHealthy(metrics: SuiteMetrics): boolean {
    /** Suite saludable: &gt;95% pass rate. */
    return metrics.pass_rate &gt;= 95.0;
}

/** Registro de test flaky (alterna pass/fail). */
interface FlakyTestRecord {
    test_name: string;
    total_runs: number;
    passes: number;
    failures: number;
    flaky_score: number;  // 0.0 (estable) - 1.0 (muy flaky)
    last_results: string[];   // Últimos N resultados
}

/** Porcentaje de veces que falló. */
function getFlakyRate(record: FlakyTestRecord): number {
    if (record.total_runs === 0) return 0.0;
    return (record.failures / record.total_runs) * 100.0;
}

export {
    TestResult, createTestResult,
    SuiteMetrics, getFailRate, isHealthy,
    FlakyTestRecord, getFlakyRate,
};</code></pre>
</div>
</div>

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

        <div class="code-tabs" data-code-id="L108-2">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># conftest.py - Recolección de métricas con hooks de pytest
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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// metrics-reporter.ts - Recolección de métricas con Custom Reporter
/**
 * En Playwright, el equivalente a los hooks de pytest es un Custom Reporter.
 * Se implementa la interfaz Reporter para interceptar cada resultado.
 */

import * as fs from 'fs';
import * as path from 'path';
import type {
    Reporter, FullConfig, Suite, TestCase, TestResult, FullResult
} from '@playwright/test/reporter';

// Interfaz para resultados individuales
interface TestMetric {
    name: string;
    nodeid: string;
    status: string;       // "passed", "failed", "skipped", "timedOut"
    duration: number;     // Segundos
    module: string;
    markers: string[];
    timestamp: string;
    error_message?: string;
}

class MetricsCollectorReporter implements Reporter {
    private testResults: TestMetric[] = [];
    private sessionStart: number = 0;

    /** Se ejecuta al inicio de la sesión de tests. */
    onBegin(config: FullConfig, suite: Suite): void {
        this.sessionStart = Date.now();
        console.log('\\n Recolector de métricas iniciado');
    }

    /**
     * Se ejecuta al finalizar cada test (equivale a pytest_runtest_makereport).
     * A diferencia de pytest, Playwright reporta una sola vez por test.
     */
    onTestEnd(test: TestCase, result: TestResult): void {
        const metric: TestMetric = {
            name: test.title,
            nodeid: test.titlePath().join(' &gt; '),
            status: result.status,
            duration: Math.round(result.duration) / 1000,
            module: test.location.file,
            markers: test.tags,
            timestamp: new Date().toISOString(),
        };

        // Capturar mensaje de error si falló
        if (result.status === 'failed' || result.status === 'timedOut') {
            metric.error_message = (result.error?.message ?? '').slice(0, 500);
        }

        this.testResults.push(metric);
    }

    /** Se ejecuta al final de la sesión. Genera el archivo de métricas. */
    async onEnd(result: FullResult): Promise&lt;void&gt; {
        const duration = (Date.now() - this.sessionStart) / 1000;
        const total = this.testResults.length;
        const passed = this.testResults.filter(r =&gt; r.status === 'passed').length;
        const failed = this.testResults.filter(r =&gt; r.status === 'failed').length;
        const skipped = this.testResults.filter(r =&gt; r.status === 'skipped').length;
        const errors = this.testResults.filter(r =&gt; r.status === 'timedOut').length;

        // Calcular métricas agregadas
        const passRate = total &gt; 0 ? (passed / total) * 100 : 0;
        const avgDuration = total &gt; 0
            ? this.testResults.reduce((s, r) =&gt; s + r.duration, 0) / total
            : 0;

        // Top 5 tests más lentos
        const sortedByTime = [...this.testResults]
            .sort((a, b) =&gt; b.duration - a.duration);
        const slowest = sortedByTime.slice(0, 5)
            .map(r =&gt; ({ name: r.name, duration: r.duration }));

        // Tests fallidos
        const failures = this.testResults
            .filter(r =&gt; ['failed', 'timedOut'].includes(r.status))
            .map(r =&gt; ({
                name: r.name,
                error: (r.error_message ?? '').slice(0, 200),
            }));

        // Construir reporte de métricas
        const now = new Date();
        const runId = now.toISOString().replace(/[-:T]/g, '').slice(0, 15);
        const metrics = {
            run_id: runId,
            timestamp: now.toISOString(),
            environment: process.env.TEST_ENV ?? 'local',
            total_tests: total,
            passed, failed, skipped, errors,
            pass_rate: Math.round(passRate * 100) / 100,
            total_duration_seconds: Math.round(duration * 100) / 100,
            avg_test_duration: Math.round(avgDuration * 1000) / 1000,
            slowest_tests: slowest,
            failed_tests: failures,
            results: this.testResults,
        };

        // Guardar métricas en JSON
        const metricsDir = 'metrics';
        fs.mkdirSync(metricsDir, { recursive: true });
        const metricsFile = path.join(metricsDir, \`run_\${runId}.json\`);
        fs.writeFileSync(metricsFile, JSON.stringify(metrics, null, 2));

        console.log(\`\\n Métricas guardadas en: \${metricsFile}\`);
        console.log(\`   Total: \${total} | Pass: \${passed} | Fail: \${failed} | \` +
            \`Skip: \${skipped} | Rate: \${passRate.toFixed(1)}%\`);
    }
}

export default MetricsCollectorReporter;</code></pre>
</div>
</div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip</h4>
            <p>El decorador <code>@pytest.hookimpl(hookwrapper=True)</code> permite acceder al
            resultado del hook usando <code>yield</code>. Sin <code>hookwrapper</code>, solo puedes
            observar los argumentos de entrada, no el resultado generado.</p>
        </div>

        <h3>💾 3. Almacenamiento histórico en JSON y CSV</h3>
        <p>Para análisis de tendencias, necesitamos acumular métricas de múltiples ejecuciones.
        Usamos un archivo JSON histórico y opcionalmente CSV para análisis en Excel:</p>

        <div class="code-tabs" data-code-id="L108-3">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># metrics/storage.py - Almacenamiento histórico de métricas
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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// metrics/storage.ts - Almacenamiento histórico de métricas
/** Persistencia de métricas en JSON y CSV para análisis histórico. */

import * as fs from 'fs';
import * as path from 'path';

interface RunSummary {
    run_id: string;
    timestamp: string;
    environment: string;
    total_tests: number;
    passed: number;
    failed: number;
    skipped: number;
    errors: number;
    pass_rate: number;
    total_duration: number;
    avg_duration: number;
    slowest_test: string;
}

class MetricsStorage {
    /** Almacena y consulta métricas históricas de ejecuciones. */

    private baseDir: string;
    private historyFile: string;
    private csvFile: string;

    constructor(baseDir: string = 'metrics') {
        this.baseDir = baseDir;
        fs.mkdirSync(baseDir, { recursive: true });
        this.historyFile = path.join(baseDir, 'history.json');
        this.csvFile = path.join(baseDir, 'history.csv');
    }

    /** Carga el historial completo de ejecuciones. */
    loadHistory(): RunSummary[] {
        if (fs.existsSync(this.historyFile)) {
            return JSON.parse(fs.readFileSync(this.historyFile, 'utf-8'));
        }
        return [];
    }

    /** Agrega una ejecución al historial JSON y CSV. */
    appendRun(metrics: Record&lt;string, unknown&gt;): void {
        // Actualizar JSON
        const history = this.loadHistory();
        const slowestTests = metrics.slowest_tests as Array&lt;{ name: string }&gt; ?? [];

        const summary: RunSummary = {
            run_id: metrics.run_id as string,
            timestamp: metrics.timestamp as string,
            environment: (metrics.environment as string) ?? 'local',
            total_tests: metrics.total_tests as number,
            passed: metrics.passed as number,
            failed: metrics.failed as number,
            skipped: metrics.skipped as number,
            errors: (metrics.errors as number) ?? 0,
            pass_rate: metrics.pass_rate as number,
            total_duration: metrics.total_duration_seconds as number,
            avg_duration: metrics.avg_test_duration as number,
            slowest_test: slowestTests.length ? slowestTests[0].name : '',
        };

        history.push(summary);
        fs.writeFileSync(
            this.historyFile,
            JSON.stringify(history, null, 2),
            'utf-8'
        );

        // Actualizar CSV (para análisis en Excel o Google Sheets)
        const csvExists = fs.existsSync(this.csvFile);
        const keys = Object.keys(summary) as (keyof RunSummary)[];
        const header = keys.join(',') + '\\n';
        const row = keys.map(k =&gt; {
            const val = String(summary[k]);
            return val.includes(',') ? \`"\${val}"\` : val;
        }).join(',') + '\\n';

        if (!csvExists) {
            fs.writeFileSync(this.csvFile, header + row, 'utf-8');
        } else {
            fs.appendFileSync(this.csvFile, row, 'utf-8');
        }
    }

    /** Retorna las últimas N ejecuciones. */
    getLastNRuns(n: number = 10): RunSummary[] {
        const history = this.loadHistory();
        return history.slice(-n);
    }

    /** Retorna la tendencia del pass rate (últimas N ejecuciones). */
    getPassRateTrend(n: number = 20): Array&lt;{
        run_id: string; date: string; pass_rate: number;
    }&gt; {
        return this.getLastNRuns(n).map(r =&gt; ({
            run_id: r.run_id,
            date: r.timestamp.slice(0, 10),
            pass_rate: r.pass_rate,
        }));
    }

    /** Retorna la tendencia de duración total. */
    getDurationTrend(n: number = 20): Array&lt;{
        run_id: string; date: string; duration: number;
    }&gt; {
        return this.getLastNRuns(n).map(r =&gt; ({
            run_id: r.run_id,
            date: r.timestamp.slice(0, 10),
            duration: r.total_duration,
        }));
    }
}

export { MetricsStorage };</code></pre>
</div>
</div>

        <h3>🖥️ 4. Dashboard HTML con Jinja2</h3>
        <p>Generamos un dashboard HTML estático que puede verse en cualquier navegador,
        compartirse por correo o servirse desde CI/CD. Usamos <strong>Jinja2</strong> para
        las plantillas y <strong>Chart.js</strong> (CDN) para gráficas interactivas:</p>

        <div class="code-tabs" data-code-id="L108-4">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># metrics/dashboard.py - Generador de dashboard HTML
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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// metrics/dashboard.ts - Generador de dashboard HTML
/** Genera un dashboard HTML interactivo con métricas de testing. */

import * as fs from 'fs';
import * as path from 'path';

interface RunMetrics {
    run_id: string;
    pass_rate: number;
    total_tests: number;
    failed: number;
    total_duration_seconds: number;
    slowest_tests: Array&lt;{ name: string; duration: number }&gt;;
    failed_tests: Array&lt;{ name: string; error: string }&gt;;
}

interface HistoryEntry {
    timestamp: string;
    pass_rate: number;
    total_duration: number;
}

class DashboardGenerator {
    /** Genera dashboard HTML con métricas históricas y de ejecución. */

    private metricsDir: string;
    private outputDir: string;

    constructor(metricsDir: string = 'metrics') {
        this.metricsDir = metricsDir;
        this.outputDir = path.join(metricsDir, 'dashboard');
        fs.mkdirSync(this.outputDir, { recursive: true });
    }

    /**
     * Genera el dashboard HTML completo.
     * Usa template literals en lugar de Jinja2.
     */
    generate(currentRun: RunMetrics, history: HistoryEntry[]): string {
        const recent = history.slice(-20);
        const trendLabels = JSON.stringify(recent.map(h =&gt; h.timestamp.slice(0, 10)));
        const passRates = JSON.stringify(recent.map(h =&gt; h.pass_rate));
        const durations = JSON.stringify(recent.map(h =&gt; h.total_duration));
        const generatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);

        // Filas de tests lentos
        const slowestRows = currentRun.slowest_tests
            .map(t =&gt; \`&lt;tr&gt;&lt;td&gt;\${t.name}&lt;/td&gt;&lt;td&gt;\${t.duration}s&lt;/td&gt;&lt;/tr&gt;\`)
            .join('\\n');

        // Filas de tests fallidos
        const failedRows = currentRun.failed_tests
            .map(t =&gt; \`&lt;tr&gt;
                &lt;td&gt;&lt;span class="status-fail"&gt;\${t.name}&lt;/span&gt;&lt;/td&gt;
                &lt;td&gt;\${t.error.slice(0, 100)}...&lt;/td&gt;
            &lt;/tr&gt;\`)
            .join('\\n');

        const html = \`&lt;!DOCTYPE html&gt;
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
        th, td { padding: 10px; border-bottom: 1px solid #eee; text-align: left; }
        th { background: #009688; color: white; }
        .status-fail { color: #f44336; font-weight: bold; }
        .footer { text-align: center; color: #999; margin-top: 20px; }
    &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;div class="header"&gt;
        &lt;h1&gt;QA Dashboard - Playwright Tests&lt;/h1&gt;
        &lt;p&gt;Ejecución: \${currentRun.run_id} | Generado: \${generatedAt}&lt;/p&gt;
    &lt;/div&gt;
    &lt;div class="cards"&gt;
        &lt;div class="card green"&gt;&lt;div class="value"&gt;\${currentRun.pass_rate}%&lt;/div&gt;
            &lt;div class="label"&gt;Pass Rate&lt;/div&gt;&lt;/div&gt;
        &lt;div class="card blue"&gt;&lt;div class="value"&gt;\${currentRun.total_tests}&lt;/div&gt;
            &lt;div class="label"&gt;Tests Totales&lt;/div&gt;&lt;/div&gt;
        &lt;div class="card red"&gt;&lt;div class="value"&gt;\${currentRun.failed}&lt;/div&gt;
            &lt;div class="label"&gt;Fallidos&lt;/div&gt;&lt;/div&gt;
        &lt;div class="card orange"&gt;&lt;div class="value"&gt;\${currentRun.total_duration_seconds}s&lt;/div&gt;
            &lt;div class="label"&gt;Duración Total&lt;/div&gt;&lt;/div&gt;
    &lt;/div&gt;
    &lt;div class="chart-row"&gt;
        &lt;div class="chart-box"&gt;&lt;h3&gt;Tendencia Pass Rate&lt;/h3&gt;
            &lt;canvas id="passRateChart"&gt;&lt;/canvas&gt;&lt;/div&gt;
        &lt;div class="chart-box"&gt;&lt;h3&gt;Tendencia Duración&lt;/h3&gt;
            &lt;canvas id="durationChart"&gt;&lt;/canvas&gt;&lt;/div&gt;
    &lt;/div&gt;
    &lt;div class="chart-row"&gt;
        &lt;div class="chart-box"&gt;&lt;h3&gt;Tests Más Lentos&lt;/h3&gt;
            &lt;table&gt;&lt;tr&gt;&lt;th&gt;Test&lt;/th&gt;&lt;th&gt;Duración&lt;/th&gt;&lt;/tr&gt;
            \${slowestRows}&lt;/table&gt;&lt;/div&gt;
        &lt;div class="chart-box"&gt;&lt;h3&gt;Tests Fallidos&lt;/h3&gt;
            &lt;table&gt;&lt;tr&gt;&lt;th&gt;Test&lt;/th&gt;&lt;th&gt;Error&lt;/th&gt;&lt;/tr&gt;
            \${failedRows}&lt;/table&gt;&lt;/div&gt;
    &lt;/div&gt;
    &lt;div class="footer"&gt;Total ejecuciones: \${history.length} | SIESA QA Team&lt;/div&gt;
    &lt;script&gt;
    new Chart(document.getElementById('passRateChart'), {
        type: 'line',
        data: { labels: \${trendLabels},
            datasets: [{ label: 'Pass Rate (%)', data: \${passRates},
                borderColor: '#4caf50', backgroundColor: 'rgba(76,175,80,0.1)',
                fill: true, tension: 0.3 }] },
        options: { scales: { y: { min: 0, max: 100 } },
            plugins: { legend: { display: false } } }
    });
    new Chart(document.getElementById('durationChart'), {
        type: 'bar',
        data: { labels: \${trendLabels},
            datasets: [{ label: 'Duración (s)', data: \${durations},
                backgroundColor: '#2196f3' }] },
        options: { plugins: { legend: { display: false } } }
    });
    &lt;/script&gt;
&lt;/body&gt;&lt;/html&gt;\`;

        const outputFile = path.join(this.outputDir, 'index.html');
        fs.writeFileSync(outputFile, html, 'utf-8');
        return outputFile;
    }
}

export { DashboardGenerator };</code></pre>
</div>
</div>

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

        <div class="code-tabs" data-code-id="L108-5">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># metrics/timing.py - Análisis de tiempos de ejecución
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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// metrics/timing.ts - Análisis de tiempos de ejecución
/** Analiza tiempos de ejecución para identificar cuellos de botella. */

interface TestResultEntry {
    name: string;
    duration: number;
    module?: string;
}

interface TimingSummary {
    total_tests: number;
    total_time: number;
    avg_time: number;
    median_time: number;
    std_dev: number;
    min_time: number;
    max_time: number;
    p90: number;
    p95: number;
}

class TimingAnalyzer {
    /** Analiza tiempos de ejecución de tests. */

    private results: TestResultEntry[];
    private durations: number[];

    constructor(results: TestResultEntry[]) {
        this.results = results;
        this.durations = results
            .filter(r =&gt; r.duration != null)
            .map(r =&gt; r.duration);
    }

    /** Resumen estadístico de tiempos. */
    summary(): TimingSummary | { error: string } {
        if (!this.durations.length) {
            return { error: 'No hay datos de duración' };
        }

        const sorted = [...this.durations].sort((a, b) =&gt; a - b);
        const sum = sorted.reduce((acc, v) =&gt; acc + v, 0);
        const mean = sum / sorted.length;

        // Calcular mediana
        const mid = Math.floor(sorted.length / 2);
        const median = sorted.length % 2 === 0
            ? (sorted[mid - 1] + sorted[mid]) / 2
            : sorted[mid];

        // Desviación estándar
        const variance = sorted.length &gt; 1
            ? sorted.reduce((acc, v) =&gt; acc + (v - mean) ** 2, 0) / (sorted.length - 1)
            : 0;
        const stdDev = Math.sqrt(variance);

        return {
            total_tests: sorted.length,
            total_time: Math.round(sum * 100) / 100,
            avg_time: Math.round(mean * 1000) / 1000,
            median_time: Math.round(median * 1000) / 1000,
            std_dev: Math.round(stdDev * 1000) / 1000,
            min_time: Math.round(sorted[0] * 1000) / 1000,
            max_time: Math.round(sorted[sorted.length - 1] * 1000) / 1000,
            p90: Math.round(this.percentile(90) * 1000) / 1000,
            p95: Math.round(this.percentile(95) * 1000) / 1000,
        };
    }

    /** Top N tests más lentos. */
    slowest(n: number = 10): Array&lt;{ name: string; duration: number; module: string }&gt; {
        return [...this.results]
            .sort((a, b) =&gt; (b.duration ?? 0) - (a.duration ?? 0))
            .slice(0, n)
            .map(r =&gt; ({
                name: r.name,
                duration: r.duration,
                module: r.module ?? '',
            }));
    }

    /** Agrupa tiempos por módulo/archivo. */
    byModule(): Record&lt;string, {
        tests: number; total_time: number;
        avg_time: number; names: string[];
    }&gt; {
        const modules: Record&lt;string, {
            tests: number; total_time: number; names: string[];
        }&gt; = {};

        for (const r of this.results) {
            const mod = r.module ?? 'unknown';
            if (!modules[mod]) {
                modules[mod] = { tests: 0, total_time: 0, names: [] };
            }
            modules[mod].tests += 1;
            modules[mod].total_time += r.duration ?? 0;
            modules[mod].names.push(r.name);
        }

        // Calcular promedio y ordenar por tiempo total
        const entries = Object.entries(modules)
            .map(([mod, data]) =&gt; [mod, {
                ...data,
                avg_time: Math.round((data.total_time / data.tests) * 1000) / 1000,
                total_time: Math.round(data.total_time * 100) / 100,
            }] as const)
            .sort((a, b) =&gt; b[1].total_time - a[1].total_time);

        return Object.fromEntries(entries);
    }

    /** Genera sugerencias de optimización basadas en los datos. */
    optimizationSuggestions(): string[] {
        const suggestions: string[] = [];
        const s = this.summary();
        if ('error' in s) return suggestions;

        if (s.p95 &gt; 30) {
            const slow = this.slowest(3);
            const names = slow.map(t =&gt; t.name).join(', ');
            suggestions.push(
                \`Los tests más lentos superan 30s (P95=\${s.p95}s). Revisa: \${names}\`
            );
        }

        if (s.std_dev &gt; s.avg_time * 0.5) {
            suggestions.push(
                'Alta variabilidad en tiempos. Algunos tests pueden tener ' +
                'waits innecesarios o dependencias externas lentas.'
            );
        }

        if (s.total_time &gt; 600) {
            suggestions.push(
                \`Suite total: \${s.total_time}s (&gt;10 min). \` +
                'Considera ejecutar en paralelo con --workers en Playwright.'
            );
        }

        return suggestions;
    }

    /** Calcula el percentil p de las duraciones. */
    private percentile(p: number): number {
        const sorted = [...this.durations].sort((a, b) =&gt; a - b);
        const idx = Math.floor(sorted.length * p / 100);
        return sorted[Math.min(idx, sorted.length - 1)];
    }
}

export { TimingAnalyzer };</code></pre>
</div>
</div>

        <h3>🔄 6. Detección de tests flaky</h3>
        <p>Un test <strong>flaky</strong> es aquel que alterna entre pass y fail sin cambios en el código.
        Son la pesadilla de cualquier equipo de QA. Implementamos un detector que analiza
        el historial:</p>

        <div class="code-tabs" data-code-id="L108-6">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># metrics/flaky_detector.py - Detección de tests flaky
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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// metrics/flaky-detector.ts - Detección de tests flaky
/** Detecta tests intermitentes analizando historial de resultados. */

import * as fs from 'fs';
import * as path from 'path';

interface FlakyTestResult {
    test_name: string;
    total_runs: number;
    passes: number;
    failures: number;
    flaky_score: number;
    transition_rate: number;
    last_5: string[];
}

class FlakyDetector {
    /** Detecta tests flaky analizando múltiples ejecuciones. */

    private metricsDir: string;

    constructor(metricsDir: string = 'metrics') {
        this.metricsDir = metricsDir;
    }

    /**
     * Analiza las últimas N ejecuciones para detectar tests flaky.
     * @param minRuns - Mínimo de ejecuciones para considerar un test
     * @param window - Cantidad de ejecuciones recientes a analizar
     * @returns Lista de tests flaky con su flaky_score
     */
    analyze(minRuns: number = 5, window: number = 20): FlakyTestResult[] {
        // Cargar todos los archivos de ejecución recientes
        const files = fs.readdirSync(this.metricsDir)
            .filter(f =&gt; f.startsWith('run_') &amp;&amp; f.endsWith('.json'))
            .sort()
            .slice(-window);

        if (files.length &lt; minRuns) return [];

        // Acumular resultados por test
        const testHistory = new Map&lt;string, string[]&gt;();
        for (const file of files) {
            const raw = fs.readFileSync(
                path.join(this.metricsDir, file), 'utf-8'
            );
            const data = JSON.parse(raw);
            for (const result of (data.results ?? [])) {
                if (!testHistory.has(result.name)) {
                    testHistory.set(result.name, []);
                }
                testHistory.get(result.name)!.push(result.status);
            }
        }

        // Calcular flaky score para cada test
        const flakyTests: FlakyTestResult[] = [];

        for (const [testName, statuses] of testHistory) {
            if (statuses.length &lt; minRuns) continue;

            const passes = statuses.filter(s =&gt; s === 'passed').length;
            const failures = statuses.filter(
                s =&gt; s === 'failed' || s === 'timedOut'
            ).length;
            const total = passes + failures;

            if (total === 0) continue;

            // Flaky score: 1.0 = máxima flakiness (50/50)
            const maxVal = Math.max(passes, failures);
            const minVal = Math.min(passes, failures);
            const ratio = maxVal &gt; 0 ? minVal / maxVal : 0;

            // Contar "cambios de estado" (pass-&gt;fail o fail-&gt;pass)
            let transitions = 0;
            const validStatuses = ['passed', 'failed'];
            for (let i = 1; i &lt; statuses.length; i++) {
                if (
                    statuses[i] !== statuses[i - 1] &amp;&amp;
                    validStatuses.includes(statuses[i]) &amp;&amp;
                    validStatuses.includes(statuses[i - 1])
                ) {
                    transitions++;
                }
            }
            const transitionRate = statuses.length &gt; 1
                ? transitions / (statuses.length - 1)
                : 0;

            // Score combinado: ratio de fallos + frecuencia de cambios
            const flakyScore = Math.round(
                (ratio * 0.4 + transitionRate * 0.6) * 1000
            ) / 1000;

            if (flakyScore &gt; 0.1) {  // Umbral mínimo de flakiness
                flakyTests.push({
                    test_name: testName,
                    total_runs: statuses.length,
                    passes,
                    failures,
                    flaky_score: flakyScore,
                    transition_rate: Math.round(transitionRate * 1000) / 1000,
                    last_5: statuses.slice(-5),
                });
            }
        }

        // Ordenar por flaky_score descendente
        return flakyTests.sort((a, b) =&gt; b.flaky_score - a.flaky_score);
    }
}

export { FlakyDetector };</code></pre>
</div>
</div>

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

        <div class="code-tabs" data-code-id="L108-7">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># conftest.py - Markers para cobertura funcional
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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// En Playwright, los tags se definen con @tag en el título del test
// o con test.describe y tag annotations.
// No se necesita conftest.py — los tags van directamente en los tests.

// --- Ejemplo de uso en tests ---

// tests/test_login.spec.ts
import { test, expect } from '@playwright/test';

// Tags como annotations en test.describe
test.describe('Login @feature:autenticacion @page:login @priority:P0', () => {

    test('login exitoso', async ({ page }) => {
        await page.goto('https://example.com/login');
        await page.fill('#username', 'admin');
        await page.fill('#password', 'secret');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL('/dashboard');
    });

    test('login credenciales invalidas', async ({ page }) => {
        await page.goto('https://example.com/login');
        await page.fill('#username', 'admin');
        await page.fill('#password', 'wrong');
        await page.click('button[type="submit"]');
        await expect(page.locator('.error')).toBeVisible();
    });
});

// Ejecutar solo tests con cierto tag:
// npx playwright test --grep "@priority:P0"
// npx playwright test --grep "@feature:autenticacion"</code></pre>
</div>
</div>

        <div class="code-tabs" data-code-id="L108-8">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># metrics/coverage.py - Análisis de cobertura funcional
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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// metrics/coverage.ts - Análisis de cobertura funcional
/** Analiza cobertura funcional basada en tags de Playwright. */

import * as fs from 'fs';
import * as path from 'path';

interface CoverageData {
    total: number;
    passed: number;
    tests: string[];
}

interface CoverageResult {
    features: Record&lt;string, CoverageData&gt;;
    pages: Record&lt;string, CoverageData&gt;;
    priorities: Record&lt;string, { total: number; passed: number }&gt;;
    total_features: number;
    total_pages: number;
}

class CoverageAnalyzer {
    /** Analiza qué features y páginas tienen cobertura de tests. */

    private metricsDir: string;

    constructor(metricsDir: string = 'metrics') {
        this.metricsDir = metricsDir;
    }

    /**
     * Analiza cobertura desde un archivo de ejecución.
     * En Playwright, los tags se definen con @tag en test.describe o test()
     */
    analyzeFromRun(runFile: string): CoverageResult {
        const raw = fs.readFileSync(runFile, 'utf-8');
        const data = JSON.parse(raw);
        const results: Array&lt;Record&lt;string, unknown&gt;&gt; = data.results ?? [];

        const features = new Map&lt;string, CoverageData&gt;();
        const pages = new Map&lt;string, CoverageData&gt;();
        const priorities = new Map&lt;string, { total: number; passed: number }&gt;();

        for (const r of results) {
            const markers = (r.markers as string[]) ?? [];

            for (const marker of markers) {
                // Detectar tags de feature
                if (marker.startsWith('feature')) {
                    if (!features.has(marker)) {
                        features.set(marker, { total: 0, passed: 0, tests: [] });
                    }
                    const feat = features.get(marker)!;
                    feat.total += 1;
                    if (r.status === 'passed') feat.passed += 1;
                    feat.tests.push(r.name as string);
                }
                // Detectar tags de página
                else if (marker.startsWith('page')) {
                    if (!pages.has(marker)) {
                        pages.set(marker, { total: 0, passed: 0, tests: [] });
                    }
                    const pg = pages.get(marker)!;
                    pg.total += 1;
                    if (r.status === 'passed') pg.passed += 1;
                    pg.tests.push(r.name as string);
                }
                // Detectar prioridad
                else if (marker.startsWith('priority')) {
                    if (!priorities.has(marker)) {
                        priorities.set(marker, { total: 0, passed: 0 });
                    }
                    const prio = priorities.get(marker)!;
                    prio.total += 1;
                    if (r.status === 'passed') prio.passed += 1;
                }
            }
        }

        return {
            features: Object.fromEntries(features),
            pages: Object.fromEntries(pages),
            priorities: Object.fromEntries(priorities),
            total_features: features.size,
            total_pages: pages.size,
        };
    }

    /** Genera una matriz de cobertura en texto para consola. */
    coverageMatrix(runFile: string): string {
        const analysis = this.analyzeFromRun(runFile);
        const lines: string[] = ['\\n=== Matriz de Cobertura Funcional ===\\n'];

        lines.push('Features:');
        for (const [feat, data] of Object.entries(analysis.features)) {
            const rate = data.total ? (data.passed / data.total) * 100 : 0;
            const status = rate === 100 ? '✅' : rate &gt;= 80 ? '⚠️' : '❌';
            lines.push(
                \`  \${status} \${feat}: \${data.passed}/\${data.total} (\${rate.toFixed(0)}%)\`
            );
        }

        lines.push('\\nPáginas:');
        for (const [pg, data] of Object.entries(analysis.pages)) {
            const rate = data.total ? (data.passed / data.total) * 100 : 0;
            lines.push(
                \`  \${pg}: \${data.total} tests (\${rate.toFixed(0)}% pass)\`
            );
        }

        return lines.join('\\n');
    }
}

export { CoverageAnalyzer };</code></pre>
</div>
</div>

        <h3>📤 8. Enviando métricas a sistemas externos</h3>
        <p>Las métricas son más útiles cuando llegan al equipo automáticamente. Implementamos
        notificadores para Slack, email y webhooks genéricos:</p>

        <div class="code-tabs" data-code-id="L108-9">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># metrics/notifiers.py - Envío de métricas a sistemas externos
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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// metrics/notifiers.ts - Envío de métricas a sistemas externos
/** Envía resúmenes de métricas a Slack, email y webhooks. */

import * as https from 'https';
import * as nodemailer from 'nodemailer';
// npm install nodemailer @types/nodemailer

interface MetricsSummary {
    run_id: string;
    pass_rate: number;
    total_tests: number;
    failed: number;
    total_duration_seconds: number;
    failed_tests?: Array&lt;{ name: string; error?: string }&gt;;
}

class SlackNotifier {
    /** Envía resúmenes de ejecución a un canal de Slack. */

    constructor(private webhookUrl: string) {}

    async sendSummary(metrics: MetricsSummary): Promise&lt;boolean&gt; {
        const statusEmoji = metrics.pass_rate &gt;= 95 ? '✅'
            : metrics.pass_rate &gt;= 80 ? '⚠️' : '❌';

        const blocks: Record&lt;string, unknown&gt;[] = [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: \`\${statusEmoji} QA Report - \${metrics.run_id}\`,
                },
            },
            {
                type: 'section',
                fields: [
                    { type: 'mrkdwn', text: \`*Pass Rate:* \${metrics.pass_rate}%\` },
                    { type: 'mrkdwn', text: \`*Total:* \${metrics.total_tests} tests\` },
                    { type: 'mrkdwn', text: \`*Fallidos:* \${metrics.failed}\` },
                    { type: 'mrkdwn', text: \`*Duración:* \${metrics.total_duration_seconds}s\` },
                ],
            },
        ];

        // Agregar tests fallidos si los hay
        if (metrics.failed_tests?.length) {
            const failureText = metrics.failed_tests
                .slice(0, 5)
                .map(t =&gt; \`• \${t.name}\`)
                .join('\\n');
            blocks.push({
                type: 'section',
                text: { type: 'mrkdwn', text: \`*Tests fallidos:*\\n\${failureText}\` },
            });
        }

        try {
            const payload = JSON.stringify({ blocks });
            await this.postJson(this.webhookUrl, payload);
            return true;
        } catch (error) {
            console.error(\`Error enviando a Slack: \${error}\`);
            return false;
        }
    }

    private postJson(url: string, body: string): Promise&lt;void&gt; {
        return new Promise((resolve, reject) =&gt; {
            const urlObj = new URL(url);
            const req = https.request({
                hostname: urlObj.hostname,
                path: urlObj.pathname,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                timeout: 10000,
            }, (res) =&gt; {
                res.statusCode === 200 ? resolve() : reject(res.statusCode);
            });
            req.on('error', reject);
            req.write(body);
            req.end();
        });
    }
}

class WebhookNotifier {
    /** Envía métricas a un endpoint webhook genérico (Teams, Discord, etc.). */

    constructor(
        private url: string,
        private headers: Record&lt;string, string&gt; = { 'Content-Type': 'application/json' }
    ) {}

    async send(metrics: MetricsSummary): Promise&lt;boolean&gt; {
        try {
            const payload = JSON.stringify(metrics);
            const urlObj = new URL(this.url);
            await new Promise&lt;void&gt;((resolve, reject) =&gt; {
                const req = https.request({
                    hostname: urlObj.hostname,
                    path: urlObj.pathname,
                    method: 'POST',
                    headers: this.headers,
                    timeout: 10000,
                }, (res) =&gt; {
                    res.statusCode === 200 ? resolve() : reject(res.statusCode);
                });
                req.on('error', reject);
                req.write(payload);
                req.end();
            });
            return true;
        } catch (error) {
            console.error(\`Error enviando webhook: \${error}\`);
            return false;
        }
    }
}

class EmailNotifier {
    /** Envía resumen de métricas por email (SMTP con nodemailer). */
    private transporter: nodemailer.Transporter;

    constructor(
        smtpHost: string,
        smtpPort: number,
        private username: string,
        password: string
    ) {
        this.transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: false,
            auth: { user: username, pass: password },
        });
    }

    async sendReport(toEmails: string[], metrics: MetricsSummary): Promise&lt;boolean&gt; {
        const status = metrics.pass_rate &gt;= 95 ? 'PASS' : 'FAIL';
        const subject = \`[QA \${status}] Playwright Tests - \${metrics.pass_rate}% pass rate\`;

        const html = \`
        &lt;h2&gt;QA Test Report - \${metrics.run_id}&lt;/h2&gt;
        &lt;table border="1" cellpadding="8"&gt;
            &lt;tr&gt;&lt;td&gt;Pass Rate&lt;/td&gt;&lt;td&gt;\${metrics.pass_rate}%&lt;/td&gt;&lt;/tr&gt;
            &lt;tr&gt;&lt;td&gt;Total Tests&lt;/td&gt;&lt;td&gt;\${metrics.total_tests}&lt;/td&gt;&lt;/tr&gt;
            &lt;tr&gt;&lt;td&gt;Failed&lt;/td&gt;&lt;td&gt;\${metrics.failed}&lt;/td&gt;&lt;/tr&gt;
            &lt;tr&gt;&lt;td&gt;Duration&lt;/td&gt;&lt;td&gt;\${metrics.total_duration_seconds}s&lt;/td&gt;&lt;/tr&gt;
        &lt;/table&gt;
        \`;

        try {
            await this.transporter.sendMail({
                from: this.username,
                to: toEmails.join(', '),
                subject,
                html,
            });
            return true;
        } catch (error) {
            console.error(\`Error enviando email: \${error}\`);
            return false;
        }
    }
}

export { SlackNotifier, WebhookNotifier, EmailNotifier };</code></pre>
</div>
</div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Buena práctica</h4>
            <p>Configura los webhooks y credenciales de email como <strong>variables de entorno</strong>,
            nunca hardcodeadas en el código. En CI/CD, usa secrets del pipeline.
            En local, usa un archivo <code>.env</code> que esté en <code>.gitignore</code>.</p>
        </div>

        <h3>🔌 9. Plugin pytest-json-report</h3>
        <p>Si prefieres no escribir hooks personalizados, <code>pytest-json-report</code> genera
        un JSON detallado automáticamente. Lo combinamos con nuestro sistema de métricas:</p>

        <div class="code-tabs" data-code-id="L108-10">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># Instalar el plugin
# pip install pytest-json-report

# Ejecutar con reporte JSON automático
# pytest --json-report --json-report-file=metrics/latest_run.json

# El plugin genera un JSON completo con:
# - Metadatos del entorno (Python, plataforma, plugins)
# - Resumen (passed, failed, total, duration)
# - Detalle de cada test (nodeid, outcome, duration, longrepr)</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// Playwright incluye reporter JSON nativo (sin plugins adicionales)

// Configurar en playwright.config.ts:
// export default defineConfig({
//     reporter: [
//         ['json', { outputFile: 'metrics/latest_run.json' }],
//     ],
// });

// O ejecutar desde CLI:
// npx playwright test --reporter=json > metrics/latest_run.json

// El reporter JSON nativo genera un JSON completo con:
// - Metadatos del entorno (Playwright version, plataforma, workers)
// - Suites y specs con resultados (status, duration, error)
// - Adjuntos (screenshots, traces, videos)</code></pre>
</div>
</div>

        <div class="code-tabs" data-code-id="L108-11">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># metrics/plugin_adapter.py
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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// metrics/plugin-adapter.ts
/**
 * Adaptador para convertir el JSON nativo de Playwright al formato
 * de nuestro dashboard.
 */

import * as fs from 'fs';
import * as path from 'path';

interface PlaywrightJsonResult {
    suites: Array&lt;{
        title: string;
        specs: Array&lt;{
            title: string;
            file: string;
            tests: Array&lt;{
                results: Array&lt;{
                    status: string;
                    duration: number;
                    error?: { message: string };
                }&gt;;
            }&gt;;
        }&gt;;
    }&gt;;
    stats: {
        expected: number;
        unexpected: number;
        skipped: number;
        duration: number;
    };
    config: {
        metadata?: Record&lt;string, string&gt;;
    };
}

interface MetricsFormat {
    run_id: string;
    timestamp: string;
    environment: string;
    total_tests: number;
    passed: number;
    failed: number;
    skipped: number;
    errors: number;
    pass_rate: number;
    total_duration_seconds: number;
    avg_test_duration: number;
    slowest_tests: Array&lt;{ name: string; duration: number }&gt;;
    failed_tests: Array&lt;{ name: string; error: string }&gt;;
    results: Array&lt;Record&lt;string, unknown&gt;&gt;;
}

class JsonReportAdapter {
    /**
     * Convierte el JSON de Playwright (--reporter=json) al formato del dashboard.
     * @param jsonReportPath - Ruta al archivo generado por Playwright JSON reporter
     * @returns Métricas en nuestro formato estándar
     */
    convert(jsonReportPath: string): MetricsFormat {
        const raw = fs.readFileSync(jsonReportPath, 'utf-8');
        const data: PlaywrightJsonResult = JSON.parse(raw);

        // Extraer resultados individuales aplanando suites
        const results: Array&lt;Record&lt;string, unknown&gt;&gt; = [];
        for (const suite of data.suites) {
            for (const spec of suite.specs) {
                for (const test of spec.tests) {
                    const lastResult = test.results[test.results.length - 1];
                    results.push({
                        name: spec.title,
                        nodeid: \`\${spec.file} &gt; \${suite.title} &gt; \${spec.title}\`,
                        status: lastResult.status,
                        duration: Math.round(lastResult.duration) / 1000,
                        module: spec.file,
                        markers: [],
                        timestamp: new Date().toISOString(),
                        error_message: lastResult.status === 'failed'
                            ? (lastResult.error?.message ?? '').slice(0, 500)
                            : '',
                    });
                }
            }
        }

        // Calcular métricas agregadas
        const total = results.length;
        const passed = results.filter(r =&gt; r.status === 'expected' || r.status === 'passed').length;
        const failed = results.filter(r =&gt; r.status === 'unexpected' || r.status === 'failed').length;
        const skipped = results.filter(r =&gt; r.status === 'skipped').length;
        const passRate = total &gt; 0 ? Math.round((passed / total) * 10000) / 100 : 0;
        const totalDuration = results.reduce((s, r) =&gt; s + (r.duration as number), 0);

        // Top 5 más lentos
        const sortedByTime = [...results].sort(
            (a, b) =&gt; (b.duration as number) - (a.duration as number)
        );
        const slowest = sortedByTime.slice(0, 5).map(r =&gt; ({
            name: r.name as string,
            duration: r.duration as number,
        }));

        // Tests fallidos
        const failures = results
            .filter(r =&gt; ['failed', 'unexpected', 'timedOut'].includes(r.status as string))
            .map(r =&gt; ({
                name: r.name as string,
                error: ((r.error_message as string) ?? '').slice(0, 200),
            }));

        const now = new Date();
        const runId = now.toISOString().replace(/[-:T]/g, '').slice(0, 15);

        return {
            run_id: runId,
            timestamp: now.toISOString(),
            environment: data.config?.metadata?.['Platform'] ?? 'unknown',
            total_tests: total,
            passed, failed, skipped,
            errors: 0,
            pass_rate: passRate,
            total_duration_seconds: Math.round(totalDuration * 100) / 100,
            avg_test_duration: total &gt; 0
                ? Math.round((totalDuration / total) * 1000) / 1000
                : 0,
            slowest_tests: slowest,
            failed_tests: failures,
            results,
        };
    }
}

// Uso: integrar con nuestro sistema de dashboard
// const adapter = new JsonReportAdapter();
// const metrics = adapter.convert('test-results.json');
// const storage = new MetricsStorage();
// storage.appendRun(metrics);
// const dashboard = new DashboardGenerator();
// dashboard.generate(metrics, storage.loadHistory());

export { JsonReportAdapter };</code></pre>
</div>
</div>

        <h3>🔗 10. Integración completa: conftest.py + dashboard</h3>
        <p>Unimos todas las piezas en un <code>conftest.py</code> que recolecta métricas,
        detecta tests flaky y genera el dashboard automáticamente al final de cada ejecución:</p>

        <div class="code-tabs" data-code-id="L108-12">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># conftest.py - Integración completa de métricas + dashboard
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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// playwright.config.ts + metrics-reporter.ts - Integración completa
/**
 * Configuración completa de Playwright con:
 * - Recolección de métricas por test (Custom Reporter)
 * - Almacenamiento histórico
 * - Detección de tests flaky
 * - Generación automática de dashboard
 */

import * as fs from 'fs';
import * as path from 'path';
import type {
    Reporter, FullConfig, Suite, TestCase, TestResult, FullResult
} from '@playwright/test/reporter';

// --- Custom Reporter: metrics-reporter.ts ---

interface TestMetric {
    name: string;
    nodeid: string;
    status: string;
    duration: number;
    module: string;
    markers: string[];
    timestamp: string;
    error_message: string;
}

class MetricsReporter implements Reporter {
    private testResults: TestMetric[] = [];
    private sessionStart: number = 0;
    private metricsDir: string;
    private generateDashboard: boolean;
    private slackWebhook: string | undefined;

    constructor(options?: {
        metricsDir?: string;
        dashboard?: boolean;
        notifySlack?: string;
    }) {
        this.metricsDir = options?.metricsDir ?? 'metrics';
        this.generateDashboard = options?.dashboard ?? false;
        this.slackWebhook = options?.notifySlack;
    }

    onBegin(config: FullConfig, suite: Suite): void {
        this.sessionStart = Date.now();
    }

    onTestEnd(test: TestCase, result: TestResult): void {
        this.testResults.push({
            name: test.title,
            nodeid: test.titlePath().join(' &gt; '),
            status: result.status,
            duration: Math.round(result.duration) / 1000,
            module: test.location.file,
            markers: test.tags,
            timestamp: new Date().toISOString(),
            error_message: result.status === 'failed'
                ? (result.error?.message ?? '').slice(0, 500)
                : '',
        });
    }

    async onEnd(result: FullResult): Promise&lt;void&gt; {
        const duration = (Date.now() - this.sessionStart) / 1000;
        const total = this.testResults.length;
        if (total === 0) return;

        const passed = this.testResults.filter(r =&gt; r.status === 'passed').length;
        const failed = this.testResults.filter(r =&gt; r.status === 'failed').length;
        const skipped = this.testResults.filter(r =&gt; r.status === 'skipped').length;
        const errors = this.testResults.filter(r =&gt; r.status === 'timedOut').length;
        const passRate = Math.round((passed / total) * 10000) / 100;

        const sortedByTime = [...this.testResults]
            .sort((a, b) =&gt; b.duration - a.duration);

        const now = new Date();
        const runId = now.toISOString().replace(/[-:T]/g, '').slice(0, 15);

        const metrics = {
            run_id: runId,
            timestamp: now.toISOString(),
            total_tests: total,
            passed, failed, skipped, errors,
            pass_rate: passRate,
            total_duration_seconds: Math.round(duration * 100) / 100,
            avg_test_duration: Math.round(
                this.testResults.reduce((s, r) =&gt; s + r.duration, 0) / total * 1000
            ) / 1000,
            slowest_tests: sortedByTime.slice(0, 5).map(r =&gt; ({
                name: r.name, duration: r.duration
            })),
            failed_tests: this.testResults
                .filter(r =&gt; ['failed', 'timedOut'].includes(r.status))
                .map(r =&gt; ({
                    name: r.name,
                    error: r.error_message.slice(0, 200)
                })),
            results: this.testResults,
        };

        // 1. Guardar ejecución individual
        fs.mkdirSync(this.metricsDir, { recursive: true });
        const runFile = path.join(this.metricsDir, \`run_\${runId}.json\`);
        fs.writeFileSync(runFile, JSON.stringify(metrics, null, 2));

        // 2. Agregar al historial
        // const storage = new MetricsStorage(this.metricsDir);
        // storage.appendRun(metrics);

        // 3. Generar dashboard si se solicitó
        // if (this.generateDashboard) { ... }

        // 4. Notificar a Slack si hay webhook
        // if (this.slackWebhook) { ... }

        console.log(\`\\n Métricas: \${runFile}\`);
        console.log(\`   \${passed}/\${total} passed (\${passRate}%) en \${duration.toFixed(1)}s\`);
    }
}

export default MetricsReporter;

// --- playwright.config.ts ---
// import { defineConfig } from '@playwright/test';
// export default defineConfig({
//     reporter: [
//         ['list'],
//         ['./metrics-reporter.ts', {
//             metricsDir: 'metrics',
//             dashboard: true,
//             notifySlack: 'https://hooks.slack.com/services/...'
//         }],
//     ],
// });</code></pre>
</div>
</div>

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

        <div class="code-tabs" data-code-id="L108-13">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># metrics/charts.py - Gráficas con matplotlib
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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// metrics/charts.ts - Gráficas con Node.js canvas (alternativa offline)
// npm install canvas chart.js chartjs-node-canvas

import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import * as fs from 'fs';
import * as path from 'path';

interface HistoryEntry {
    timestamp: string;
    pass_rate: number;
    total_duration: number;
}

interface FlakyTest {
    test_name: string;
    flaky_score: number;
}

const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width: 1200, height: 500, backgroundColour: 'white'
});

/**
 * Genera gráfica de tendencia del pass rate.
 * @param history - Lista de ejecuciones con timestamp y pass_rate
 * @param outputDir - Directorio de salida
 * @returns Ruta al archivo PNG generado
 */
async function generatePassRateChart(
    history: HistoryEntry[],
    outputDir: string = 'metrics'
): Promise&lt;string&gt; {
    const recent = history.slice(-20);
    const dates = recent.map(h =&gt; h.timestamp.slice(0, 10));
    const rates = recent.map(h =&gt; h.pass_rate);

    const buffer = await chartJSNodeCanvas.renderToBuffer({
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Pass Rate (%)',
                data: rates,
                borderColor: '#4caf50',
                backgroundColor: 'rgba(76,175,80,0.1)',
                fill: true,
                tension: 0.3,
            }]
        },
        options: {
            scales: { y: { min: 0, max: 105 } },
            plugins: {
                title: { display: true, text: 'Tendencia del Pass Rate' },
                annotation: {
                    annotations: {
                        threshold: {
                            type: 'line', yMin: 95, yMax: 95,
                            borderColor: '#f44336', borderDash: [5, 5],
                            label: { content: 'Umbral 95%', display: true }
                        }
                    }
                }
            }
        }
    });

    const outputPath = path.join(outputDir, 'pass_rate_trend.png');
    fs.writeFileSync(outputPath, buffer);
    return outputPath;
}

/**
 * Genera gráfica de barras con duración por ejecución.
 */
async function generateDurationChart(
    history: HistoryEntry[],
    outputDir: string = 'metrics'
): Promise&lt;string&gt; {
    const recent = history.slice(-20);
    const dates = recent.map(h =&gt; h.timestamp.slice(0, 10));
    const durations = recent.map(h =&gt; h.total_duration);

    // Colorear barras según umbral
    const colors = durations.map(d =&gt;
        d &gt; 600 ? '#f44336' : d &gt; 300 ? '#ff9800' : '#2196f3'
    );

    const buffer = await chartJSNodeCanvas.renderToBuffer({
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                label: 'Duración (s)',
                data: durations,
                backgroundColor: colors,
            }]
        },
        options: {
            plugins: {
                title: { display: true, text: 'Duración Total por Ejecución' }
            }
        }
    });

    const outputPath = path.join(outputDir, 'duration_trend.png');
    fs.writeFileSync(outputPath, buffer);
    return outputPath;
}

/**
 * Genera gráfica horizontal de barras con tests flaky.
 */
async function generateFlakyChart(
    flakyTests: FlakyTest[],
    outputDir: string = 'metrics'
): Promise&lt;string | null&gt; {
    if (!flakyTests.length) return null;

    const top10 = flakyTests.slice(0, 10);
    const names = top10.map(t =&gt; t.test_name.slice(0, 30));
    const scores = top10.map(t =&gt; t.flaky_score);
    const colors = scores.map(s =&gt;
        s &gt; 0.5 ? '#f44336' : s &gt; 0.3 ? '#ff9800' : '#ffc107'
    );

    const buffer = await chartJSNodeCanvas.renderToBuffer({
        type: 'bar',
        data: {
            labels: names,
            datasets: [{
                label: 'Flaky Score',
                data: scores,
                backgroundColor: colors,
            }]
        },
        options: {
            indexAxis: 'y',
            scales: { x: { min: 0, max: 1 } },
            plugins: {
                title: { display: true, text: 'Tests con Mayor Flakiness' }
            }
        }
    });

    const outputPath = path.join(outputDir, 'flaky_tests.png');
    fs.writeFileSync(outputPath, buffer);
    return outputPath;
}

export {
    generatePassRateChart,
    generateDurationChart,
    generateFlakyChart,
};</code></pre>
</div>
</div>

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
            <div class="code-tabs" data-code-id="L108-14">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># tests/test_demo_metrics.py
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
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// tests/test_demo_metrics.spec.ts
// Tests de demostración para generar métricas variadas

import { test, expect } from '@playwright/test';

test.describe('navegacion @feature:navegacion @page:home @priority:P0', () => {
    test('home carga', async ({ page }) => {
        /** Test rápido que siempre pasa. */
        await page.goto('https://the-internet.herokuapp.com');
        await expect(page.locator('h1')).toContainText('Welcome');
    });
});

test.describe('autenticacion @feature:autenticacion @page:login @priority:P0', () => {
    test('login exitoso', async ({ page }) => {
        /** Test de login con duración media. */
        await page.goto('https://the-internet.herokuapp.com/login');
        await page.fill('#username', 'tomsmith');
        await page.fill('#password', 'SuperSecretPassword!');
        await page.click('button[type="submit"]');
        await expect(page.locator('.flash.success')).toBeVisible();
    });
});

test.describe('tablas @feature:tablas @page:tables @priority:P1', () => {
    test('tabla ordenamiento', async ({ page }) => {
        /** Test de tabla que puede ser lento. */
        await page.goto('https://the-internet.herokuapp.com/tables');
        const headers = page.locator('#table1 th');
        await expect(headers).toHaveCount(6);

        // Ordenar por apellido
        await page.click('#table1 th:nth-child(1)');
        const firstCell = page.locator('#table1 tbody tr:first-child td:first-child');
        await expect(firstCell).toHaveText('Bach');
    });
});

test.describe('formularios @feature:formularios @page:checkboxes @priority:P2', () => {
    test('checkbox toggle', async ({ page }) => {
        /** Test de interacción con checkboxes. */
        await page.goto('https://the-internet.herokuapp.com/checkboxes');
        const checkbox1 = page.locator('input[type="checkbox"]').first();
        await checkbox1.check();
        await expect(checkbox1).toBeChecked();
    });
});

test.describe('navegacion @feature:navegacion @page:dropdown @priority:P1', () => {
    test('dropdown seleccion', async ({ page }) => {
        /** Test de dropdown. */
        await page.goto('https://the-internet.herokuapp.com/dropdown');
        await page.selectOption('#dropdown', '1');
        await expect(page.locator('#dropdown')).toHaveValue('1');
    });
});</code></pre>
</div>
</div>

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
