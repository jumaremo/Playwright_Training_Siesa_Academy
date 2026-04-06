/**
 * Playwright Academy - Leccion 132
 * CI/CD Pipeline Enterprise
 * Seccion 20: Proyectos Capstone
 */

const LESSON_132 = {
    id: 132,
    title: "CI/CD Pipeline Enterprise",
    duration: "20 min",
    level: "advanced",
    section: "section-20",
    content: `
        <h2>CI/CD Pipeline Enterprise</h2>
        <p>En este proyecto capstone diseñaras e implementaras un <strong>pipeline CI/CD de grado
        enterprise</strong> que orqueste lint, unit tests, integration tests, E2E tests con Playwright,
        regresion visual, notificaciones y deployment gates. Este es el pipeline que usarias en un
        proyecto real de gran escala.</p>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>El pipeline de CI/CD de SIESA ejecuta 6 stages secuenciales con gates de aprobacion
            entre cada uno. Si la suite de smoke falla, no se ejecutan los tests de regresion.
            Si la regresion falla, el deployment a staging se bloquea automaticamente. Este modelo
            ha reducido los incidentes en produccion en un 75% desde su implementacion.</p>
        </div>

        <h3>Arquitectura del pipeline</h3>

        <pre><code class="text">┌──────────┐   ┌──────────┐   ┌──────────────┐   ┌──────────┐   ┌────────┐   ┌────────┐
│  LINT    │──▶│  UNIT    │──▶│  E2E (shard) │──▶│  VISUAL  │──▶│ REPORT │──▶│ DEPLOY │
│  ~1 min  │   │  ~2 min  │   │  ~10 min     │   │  ~3 min  │   │ ~1 min │   │  GATE  │
└──────────┘   └──────────┘   └──────────────┘   └──────────┘   └────────┘   └────────┘
                                     │
                              ┌──────┼──────┐
                              ▼      ▼      ▼
                          Shard 1  Shard 2  Shard 3
                         Chromium  Firefox  WebKit</code></pre>

        <h3>Workflow completo de GitHub Actions</h3>

        <pre><code class="yaml"># .github/workflows/enterprise-pipeline.yml
name: Enterprise CI/CD Pipeline

on:
  push:
    branches: [main, develop, release/*]
  pull_request:
    branches: [main, develop]

concurrency:
  group: pipeline-\${{ github.ref }}
  cancel-in-progress: true

env:
  PYTHON_VERSION: '3.11'
  NODE_VERSION: '18'

# ================================================================
# STAGE 1: Calidad de codigo
# ================================================================
jobs:
  lint:
    name: Code Quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: \${{ env.PYTHON_VERSION }}
          cache: pip
      - name: Install tools
        run: pip install flake8 black isort mypy pylint
      - name: Black (format)
        run: black --check tests/ pages/ services/ --line-length=120
      - name: isort (imports)
        run: isort --check-only tests/ pages/ services/ --profile=black
      - name: Flake8 (lint)
        run: flake8 tests/ pages/ services/ --max-line-length=120
      - name: No sleep in tests
        run: |
          if grep -rn "time\\.sleep\\|wait_for_timeout" tests/ --include="*.py"; then
            echo "::error::sleep() encontrado en tests"
            exit 1
          fi

  # ================================================================
  # STAGE 2: Unit Tests
  # ================================================================
  unit-tests:
    name: Unit Tests
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: \${{ env.PYTHON_VERSION }}
          cache: pip
      - run: pip install -r requirements.txt
      - name: Run unit tests
        run: pytest tests/unit/ -v --junitxml=reports/unit.xml --cov=pages --cov=services
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: unit-results
          path: reports/

  # ================================================================
  # STAGE 3: E2E Tests (sharded, multi-browser)
  # ================================================================
  e2e-tests:
    name: E2E \${{ matrix.browser }} (shard \${{ matrix.shard }})
    needs: unit-tests
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        browser: [chromium, firefox, webkit]
        shard: [1, 2]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: \${{ env.PYTHON_VERSION }}
          cache: pip
      - run: pip install -r requirements.txt
      - run: playwright install --with-deps \${{ matrix.browser }}

      - name: Run E2E tests
        env:
          CI: true
          BASE_URL: http://localhost:3000
        run: |
          pytest tests/e2e/ tests/smoke/ \\
            --browser \${{ matrix.browser }} \\
            --splits 2 --group \${{ matrix.shard }} \\
            --reruns 2 --reruns-delay 1 \\
            -m "not quarantine and not visual" \\
            --junitxml=reports/e2e-\${{ matrix.browser }}-\${{ matrix.shard }}.xml \\
            --html=reports/report-\${{ matrix.browser }}-\${{ matrix.shard }}.html \\
            --self-contained-html -v --tb=short

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: e2e-\${{ matrix.browser }}-\${{ matrix.shard }}
          path: |
            reports/
            test-results/

  # ================================================================
  # STAGE 4: Visual Regression
  # ================================================================
  visual-tests:
    name: Visual Regression
    needs: unit-tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: \${{ env.PYTHON_VERSION }}
      - run: pip install -r requirements.txt && playwright install chromium
      - name: Run visual tests
        run: |
          pytest tests/visual/ -m visual \\
            --junitxml=reports/visual.xml -v
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: visual-results
          path: |
            reports/
            test-results/visual/

  # ================================================================
  # STAGE 5: Merge Reports + Notify
  # ================================================================
  report:
    name: Reports & Notifications
    needs: [e2e-tests, visual-tests]
    if: always()
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          path: all-results/

      - name: Merge JUnit reports
        run: |
          mkdir -p final-reports
          find all-results -name "*.xml" -exec cp {} final-reports/ \\;
          find all-results -name "*.html" -exec cp {} final-reports/ \\;

      - name: Publish test report
        uses: dorny/test-reporter@v1
        if: always()
        with:
          name: Test Results
          path: final-reports/*.xml
          reporter: java-junit

      - uses: actions/upload-artifact@v4
        with:
          name: full-report
          path: final-reports/
          retention-days: 30

      - name: Notify Slack
        if: failure()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": ":x: Pipeline FAILED - \${{ github.repository }}@\${{ github.ref_name }}",
              "blocks": [{
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Pipeline FAILED*\\nRepo: \${{ github.repository }}\\nBranch: \${{ github.ref_name }}\\n<\${{ github.server_url }}/\${{ github.repository }}/actions/runs/\${{ github.run_id }}|Ver detalles>"
                }
              }]
            }
        env:
          SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK }}

  # ================================================================
  # STAGE 6: Deploy Gate
  # ================================================================
  deploy-staging:
    name: Deploy to Staging
    needs: [report]
    if: github.ref == 'refs/heads/main' && needs.report.result == 'success'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: All checks passed
        run: echo "All tests passed. Deploying to staging..."
      - name: Deploy
        run: |
          echo "Deploying version \${{ github.sha }} to staging"
          # curl -X POST \${{ secrets.DEPLOY_WEBHOOK }} -d '{"version": "\${{ github.sha }}"}'</code></pre>

        <h3>Dockerfile de produccion</h3>

        <pre><code class="dockerfile"># Dockerfile.ci
FROM mcr.microsoft.com/playwright/python:v1.42.0-jammy

ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1 \\
    PIP_NO_CACHE_DIR=1

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
RUN useradd -m tester && chown -R tester:tester /app
USER tester

CMD ["pytest", "tests/", "-v", "--tb=short"]</code></pre>

        <h3>Makefile del pipeline</h3>

        <pre><code class="makefile"># Makefile
.PHONY: lint test smoke regression visual pipeline clean

lint:
	black --check tests/ pages/ services/ --line-length=120
	isort --check-only tests/ pages/ services/ --profile=black
	flake8 tests/ pages/ services/ --max-line-length=120

test:
	pytest tests/ -v --tb=short

smoke:
	pytest tests/smoke/ -v --tb=short -m smoke

regression:
	pytest tests/e2e/ -v --reruns 2 -m "not quarantine"

visual:
	pytest tests/visual/ -v -m visual

parallel:
	pytest tests/ -n auto --dist=loadscope

pipeline: lint test
	@echo "Pipeline local completado"

clean:
	rm -rf reports/ test-results/ .pytest_cache/ __pycache__
	find . -name "*.pyc" -delete</code></pre>

        <h3>Criterios de evaluacion</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Criterio</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Pts</th>
                </tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">Pipeline 5+ stages (lint, unit, e2e, visual, report, deploy)</td><td style="padding: 8px; border: 1px solid #ddd;">20</td></tr>
                <tr style="background: #f5f5f5;"><td style="padding: 8px; border: 1px solid #ddd;">Sharding E2E con matrix multi-browser</td><td style="padding: 8px; border: 1px solid #ddd;">20</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">Retry configurado y cuarentena excluida</td><td style="padding: 8px; border: 1px solid #ddd;">10</td></tr>
                <tr style="background: #f5f5f5;"><td style="padding: 8px; border: 1px solid #ddd;">Artefactos: screenshots, reports, traces</td><td style="padding: 8px; border: 1px solid #ddd;">15</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">Notificaciones Slack/Teams en fallo</td><td style="padding: 8px; border: 1px solid #ddd;">10</td></tr>
                <tr style="background: #f5f5f5;"><td style="padding: 8px; border: 1px solid #ddd;">Deploy gate con environment protection</td><td style="padding: 8px; border: 1px solid #ddd;">10</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">Dockerfile + Makefile funcionales</td><td style="padding: 8px; border: 1px solid #ddd;">15</td></tr>
                <tr style="background: #f5f5f5;"><td style="padding: 8px; border: 1px solid #ddd;"><strong>TOTAL</strong></td><td style="padding: 8px; border: 1px solid #ddd;"><strong>100</strong></td></tr>
            </table>
        </div>

        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>En el siguiente proyecto capstone</strong> combinaras
            <strong>Network Mocking + Visual Regression</strong> para crear una suite de tests
            determinista con comparacion visual automatizada.</p>
        </div>
    `,
    topics: ["cicd", "pipeline", "enterprise", "capstone"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 20,
    difficulty: "hard",
    type: "capstone"
};

if (typeof window !== 'undefined') {
    window.LESSON_132 = LESSON_132;
}
