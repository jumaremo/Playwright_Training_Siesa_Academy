/**
 * Playwright Academy - Leccion 116
 * Proyecto: Pipeline CI/CD completo
 * Seccion 17: CI/CD Integration
 */

const LESSON_116 = {
    id: 116,
    title: "Proyecto: Pipeline CI/CD completo",
    duration: "15 min",
    level: "advanced",
    section: "section-17",
    content: `
        <h2>Proyecto: Pipeline CI/CD completo</h2>
        <p>Este proyecto capstone integra todos los conceptos de la Seccion 17: Docker, GitHub Actions,
        Jenkins, GitLab CI, ejecucion paralela, sharding, retry y Azure DevOps. Construiras un
        <strong>pipeline CI/CD de grado enterprise</strong> que ejecuta una suite completa de
        Playwright con Python, gestiona artefactos, reportes y notificaciones, y sirve como
        referencia para implementaciones en proyectos reales.</p>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>Los pipelines de CI/CD de SIESA ejecutan mas de 500 tests de regresion automatizados
            en cada merge a las ramas de desarrollo. El pipeline incluye validacion de codigo,
            tests unitarios, tests E2E con Playwright, y deployment automatico a staging.
            Este proyecto refleja la arquitectura real utilizada por el equipo de QA.</p>
        </div>

        <h3>Requisitos del proyecto</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tu pipeline debe incluir:</h4>
            <ol>
                <li><strong>Containerizacion:</strong> Dockerfile optimizado para Playwright</li>
                <li><strong>Multi-stage pipeline:</strong> Lint, Unit Tests, E2E Tests, Visual Tests, Report</li>
                <li><strong>Ejecucion paralela:</strong> Sharding de tests en 3+ containers</li>
                <li><strong>Retry inteligente:</strong> Reintentos solo para failures, no errores de infraestructura</li>
                <li><strong>Artefactos:</strong> Screenshots, videos, traces y reportes HTML</li>
                <li><strong>Notificaciones:</strong> Slack/Teams en caso de fallo</li>
                <li><strong>Multi-browser:</strong> Tests en Chromium + Firefox (minimo)</li>
                <li><strong>Environment config:</strong> Variables por entorno (staging, production)</li>
            </ol>
        </div>

        <h3>Paso 1: Dockerfile optimizado</h3>

        <pre><code class="dockerfile"># Dockerfile.playwright - Imagen optimizada para CI
FROM mcr.microsoft.com/playwright/python:v1.42.0-jammy AS base

# Metadata
LABEL maintainer="qa-team@siesa.com"
LABEL description="Playwright CI/CD Runner"

# Variables de entorno
ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1 \\
    PIP_NO_CACHE_DIR=1 \\
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Instalar dependencias Python (capa cacheada)
COPY requirements.txt requirements-dev.txt ./
RUN pip install -r requirements.txt -r requirements-dev.txt

# Copiar codigo fuente
COPY . .

# Usuario no-root para seguridad
RUN groupadd -r playwright && useradd -r -g playwright playwright \\
    && chown -R playwright:playwright /app
USER playwright

# Comando por defecto
CMD ["pytest", "tests/", "-v", "--tb=short"]</code></pre>

        <pre><code class="yaml"># docker-compose.ci.yml - Orquestacion para CI
version: '3.8'

services:
  playwright-tests:
    build:
      context: .
      dockerfile: Dockerfile.playwright
    environment:
      - CI=true
      - BASE_URL=\${BASE_URL:-http://app:3000}
      - BROWSER=\${BROWSER:-chromium}
    volumes:
      - ./reports:/app/reports
      - ./test-results:/app/test-results
    depends_on:
      app:
        condition: service_healthy
    ipc: host

  app:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - ./app:/app
    command: npm start
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000/health"]
      interval: 5s
      timeout: 3s
      retries: 5</code></pre>

        <h3>Paso 2: Configuracion de pytest para CI</h3>

        <pre><code class="python"># conftest.py - Configuracion completa para CI/CD
import pytest
import os
import json
import logging
from datetime import datetime
from pathlib import Path

logger = logging.getLogger("playwright.ci")

# ============================================
# FIXTURES DE ENTORNO
# ============================================

@pytest.fixture(scope="session")
def base_url():
    """URL base configurable por entorno."""
    urls = {
        "local": "http://localhost:3000",
        "staging": "https://staging.app.siesa.com",
        "production": "https://app.siesa.com"
    }
    env = os.getenv("TEST_ENV", "local")
    return os.getenv("BASE_URL", urls.get(env, urls["local"]))

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    """Configuracion de contexto optimizada para CI."""
    ci_config = {
        **browser_context_args,
        "viewport": {"width": 1920, "height": 1080},
        "ignore_https_errors": True,
    }

    if os.getenv("CI"):
        ci_config.update({
            "record_video_dir": "test-results/videos/",
            "record_video_size": {"width": 1280, "height": 720},
        })

    return ci_config

# ============================================
# SCREENSHOTS AUTOMATICOS EN FALLO
# ============================================

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    rep = outcome.get_result()
    setattr(item, f"rep_{rep.when}", rep)

@pytest.fixture(autouse=True)
def auto_screenshot_on_failure(request, page):
    """Capturar screenshot, trace y logs en caso de fallo."""
    # Iniciar tracing si estamos en CI
    if os.getenv("CI"):
        page.context.tracing.start(screenshots=True, snapshots=True)

    yield

    if hasattr(request.node, "rep_call") and request.node.rep_call.failed:
        test_name = request.node.name.replace(" ", "_")[:80]
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        # Screenshot
        ss_dir = Path("test-results/screenshots")
        ss_dir.mkdir(parents=True, exist_ok=True)
        page.screenshot(
            path=str(ss_dir / f"{test_name}_{timestamp}.png"),
            full_page=True
        )

        # Trace
        if os.getenv("CI"):
            trace_dir = Path("test-results/traces")
            trace_dir.mkdir(parents=True, exist_ok=True)
            page.context.tracing.stop(
                path=str(trace_dir / f"{test_name}_{timestamp}.zip")
            )

        # Console logs
        logs_dir = Path("test-results/logs")
        logs_dir.mkdir(parents=True, exist_ok=True)
        console_messages = getattr(page, "_console_messages", [])
        with open(logs_dir / f"{test_name}_{timestamp}.log", "w") as f:
            for msg in console_messages:
                f.write(f"[{msg.type}] {msg.text}\\n")

# ============================================
# REPORTE DE RESULTADOS
# ============================================

def pytest_terminal_summary(terminalreporter, config):
    """Generar resumen JSON para integraciones."""
    stats = terminalreporter.stats
    summary = {
        "timestamp": datetime.now().isoformat(),
        "environment": os.getenv("TEST_ENV", "local"),
        "browser": os.getenv("BROWSER", "chromium"),
        "passed": len(stats.get("passed", [])),
        "failed": len(stats.get("failed", [])),
        "skipped": len(stats.get("skipped", [])),
        "rerun": len(stats.get("rerun", [])),
        "total_duration": sum(
            r.duration for r in stats.get("passed", []) + stats.get("failed", [])
        )
    }

    os.makedirs("reports", exist_ok=True)
    with open("reports/ci-summary.json", "w") as f:
        json.dump(summary, f, indent=2)

    # Mostrar resumen en consola
    terminalreporter.write_sep("=", "CI/CD SUMMARY")
    terminalreporter.write_line(f"Passed: {summary['passed']}")
    terminalreporter.write_line(f"Failed: {summary['failed']}")
    terminalreporter.write_line(f"Rerun:  {summary['rerun']}")
    terminalreporter.write_line(f"Duration: {summary['total_duration']:.1f}s")</code></pre>

        <h3>Paso 3: GitHub Actions Workflow completo</h3>

        <pre><code class="yaml"># .github/workflows/playwright-pipeline.yml
name: Playwright CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: '0 6 * * 1-5'  # Lun-Vie a las 6 AM

concurrency:
  group: playwright-\${{ github.ref }}
  cancel-in-progress: true

env:
  PYTHON_VERSION: '3.11'
  PLAYWRIGHT_VERSION: '1.42.0'

jobs:
  # ---- Stage 1: Lint y calidad de codigo ----
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: \${{ env.PYTHON_VERSION }}
          cache: pip
      - name: Install linting tools
        run: pip install flake8 black isort mypy
      - name: Flake8
        run: flake8 tests/ --max-line-length=120 --statistics
      - name: Black (format check)
        run: black --check tests/
      - name: isort (import order)
        run: isort --check-only tests/

  # ---- Stage 2: Tests E2E con sharding ----
  e2e-tests:
    needs: lint
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3]
        browser: [chromium, firefox]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: \${{ env.PYTHON_VERSION }}
          cache: pip

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest-html pytest-xdist pytest-rerunfailures allure-pytest

      - name: Install Playwright browsers
        run: playwright install --with-deps \${{ matrix.browser }}

      - name: Run E2E tests (shard \${{ matrix.shard }}/3)
        env:
          CI: true
          BROWSER: \${{ matrix.browser }}
          BASE_URL: http://localhost:3000
        run: |
          pytest tests/ \\
            --browser \${{ matrix.browser }} \\
            --splits 3 --group \${{ matrix.shard }} \\
            --reruns 2 --reruns-delay 1 \\
            -m "not quarantine" \\
            --junitxml=reports/junit-\${{ matrix.browser }}-\${{ matrix.shard }}.xml \\
            --html=reports/report-\${{ matrix.browser }}-\${{ matrix.shard }}.html \\
            --self-contained-html \\
            -v --tb=short

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: results-\${{ matrix.browser }}-\${{ matrix.shard }}
          path: |
            reports/
            test-results/
          retention-days: 7

      - name: Upload JUnit results
        if: always()
        uses: dorny/test-reporter@v1
        with:
          name: E2E \${{ matrix.browser }} shard-\${{ matrix.shard }}
          path: reports/junit-*.xml
          reporter: java-junit

  # ---- Stage 3: Merge results y notificacion ----
  report:
    needs: e2e-tests
    if: always()
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Download all artifacts
        uses: actions/download-artifact@v4
        with:
          path: all-results/

      - name: Merge reports
        run: |
          mkdir -p final-reports
          cp all-results/*/reports/*.html final-reports/ 2>/dev/null || true
          cp all-results/*/reports/*.xml final-reports/ 2>/dev/null || true
          echo "Reports merged successfully"

      - name: Publish combined report
        uses: actions/upload-artifact@v4
        with:
          name: playwright-full-report
          path: final-reports/
          retention-days: 30

      - name: Notify Slack on failure
        if: failure()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "Playwright Pipeline FAILED",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Playwright Pipeline FAILED* :x:\\nRepo: \${{ github.repository }}\\nBranch: \${{ github.ref_name }}\\nCommit: \${{ github.sha }}\\n<\${{ github.server_url }}/\${{ github.repository }}/actions/runs/\${{ github.run_id }}|Ver detalles>"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK_URL }}

  # ---- Stage 4: Deploy gate ----
  deploy-gate:
    needs: [e2e-tests, report]
    if: github.ref == 'refs/heads/main' && success()
    runs-on: ubuntu-latest
    steps:
      - name: All tests passed - ready for deploy
        run: echo "All Playwright tests passed. Deployment approved."

      - name: Trigger deployment
        uses: peter-evans/repository-dispatch@v3
        with:
          event-type: deploy-staging
          client-payload: '{"ref": "\${{ github.sha }}"}'</code></pre>

        <h3>Paso 4: pyproject.toml de referencia</h3>

        <pre><code class="toml"># pyproject.toml - Configuracion centralizada
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_functions = ["test_*"]
addopts = """
    -v
    --tb=short
    --strict-markers
    -m 'not quarantine'
"""
markers = [
    "smoke: tests criticos de sanity check",
    "regression: suite completa de regresion",
    "quarantine: tests en cuarentena por flakiness",
    "visual: tests de regresion visual",
    "api: tests de API",
    "slow: tests que tardan mas de 30s"
]

[tool.flake8]
max-line-length = 120
exclude = [".venv", "__pycache__", "reports"]

[tool.black]
line-length = 120
target-version = ["py311"]

[tool.isort]
profile = "black"
line_length = 120</code></pre>

        <h3>Criterios de evaluacion</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Criterio</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Puntos</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripcion</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Dockerfile funcional</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">15</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Multi-stage, non-root, optimizado</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Pipeline multi-stage</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">20</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Lint + Test + Report + Deploy gate</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Sharding/paralelismo</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">15</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Tests distribuidos en 3+ shards</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Multi-browser</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">10</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Chromium + Firefox minimo</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Retry configurado</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">10</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">pytest-rerunfailures + cuarentena</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Artefactos completos</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">15</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Screenshots, videos, traces, HTML report</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Notificaciones</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">10</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Slack/Teams en fallo</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">conftest.py robusto</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">5</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Fixtures CI, auto-screenshot, summary</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>TOTAL</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>100</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Minimo aprobatorio: 70</strong></td>
                </tr>
            </table>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Ejercicio Final: Implementa tu pipeline</h4>
            <p>Construye el pipeline completo siguiendo los pasos anteriores:</p>
            <ol>
                <li>Crea el <code>Dockerfile.playwright</code> con las mejores practicas</li>
                <li>Escribe el <code>conftest.py</code> con fixtures para CI</li>
                <li>Configura <code>pyproject.toml</code> con markers y opciones</li>
                <li>Implementa el workflow de GitHub Actions con sharding y multi-browser</li>
                <li>Agrega notificaciones y deploy gate</li>
                <li>Verifica que el pipeline funcione ejecutando <code>act</code> localmente (opcional)</li>
            </ol>
        </div>

        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Felicidades!</strong> Has completado la <strong>Seccion 17: CI/CD Integration</strong>.
            En la siguiente seccion exploraras <strong>Arquitecturas y Patrones Enterprise</strong>,
            donde aprenderas a disenar frameworks de testing escalables para grandes organizaciones.</p>
        </div>
    `,
    topics: ["proyecto", "pipeline", "cicd"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 15,
    difficulty: "hard",
    type: "capstone"
};

if (typeof window !== 'undefined') {
    window.LESSON_116 = LESSON_116;
}
