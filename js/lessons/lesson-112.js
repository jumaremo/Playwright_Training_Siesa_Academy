/**
 * Playwright Academy - Leccion 112
 * Jenkins y GitLab CI con Playwright
 * Seccion 17: CI/CD Integration
 */

const LESSON_112 = {
    id: 112,
    title: "Jenkins y GitLab CI con Playwright",
    duration: "7 min",
    level: "advanced",
    section: "section-17",
    content: `
        <h2>Jenkins y GitLab CI con Playwright</h2>
        <p>Mientras que GitHub Actions domina el ecosistema open source, en entornos empresariales
        <strong>Jenkins</strong> y <strong>GitLab CI</strong> siguen siendo las plataformas de CI/CD
        mas utilizadas. Jenkins, con mas de dos decadas de historia, ofrece flexibilidad total mediante
        plugins y Jenkinsfiles declarativos. GitLab CI, integrado nativamente en GitLab, proporciona
        una experiencia unificada de repositorio + pipeline. En esta leccion aprenderas a configurar
        ambas plataformas para ejecutar suites de Playwright con Python de forma eficiente.</p>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>En SIESA utilizamos tanto Jenkins como Azure DevOps para nuestros pipelines de CI/CD.
            Los equipos de QA configuran stages dedicados para Playwright que ejecutan suites de regresion
            en cada merge request, garantizando que los modulos ERP mantengan la estabilidad funcional
            antes de llegar a ambientes productivos.</p>
        </div>

        <h3>Jenkins: Configuracion con Jenkinsfile</h3>
        <p>Jenkins utiliza archivos <code>Jenkinsfile</code> para definir pipelines como codigo.
        La sintaxis declarativa es la mas recomendada por su claridad y mantenibilidad:</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Concepto Jenkins</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripcion</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Equivalente GitHub Actions</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Pipeline</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Flujo completo de CI/CD definido en Jenkinsfile</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Workflow</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Stage</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Fase logica del pipeline (build, test, deploy)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Job</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Step</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Comando individual dentro de un stage</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Step</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Agent</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Donde se ejecuta el pipeline (nodo, Docker, etc.)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">runs-on</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Post</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Acciones posteriores segun resultado (always, failure)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">if: always()</td>
                </tr>
            </table>
        </div>

        <h3>Jenkinsfile completo para Playwright</h3>
        <p>Este Jenkinsfile configura un pipeline robusto con instalacion de dependencias,
        ejecucion de tests y recoleccion de artefactos:</p>

        <pre><code class="groovy">// Jenkinsfile - Pipeline declarativo para Playwright con Python
pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright/python:v1.42.0-jammy'
            args '--ipc=host'  // Necesario para Chromium en Docker
        }
    }

    environment {
        // Variables de entorno para Playwright
        PLAYWRIGHT_BROWSERS_PATH = '/ms-playwright'
        BASE_URL = credentials('playwright-base-url')
        CI = 'true'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        ansiColor('xterm')
    }

    stages {
        stage('Setup') {
            steps {
                echo 'Instalando dependencias de Python...'
                sh '''
                    python -m pip install --upgrade pip
                    pip install -r requirements.txt
                    pip install pytest-html pytest-xdist allure-pytest
                '''
            }
        }

        stage('Lint') {
            steps {
                echo 'Verificando calidad del codigo...'
                sh '''
                    pip install flake8
                    flake8 tests/ --max-line-length=120 --statistics
                '''
            }
        }

        stage('Tests E2E') {
            steps {
                echo 'Ejecutando tests de Playwright...'
                sh '''
                    pytest tests/ \\
                        --html=reports/report.html \\
                        --self-contained-html \\
                        --junitxml=reports/junit.xml \\
                        -v --tb=short \\
                        --base-url=\${BASE_URL}
                '''
            }
        }

        stage('Tests Paralelos') {
            steps {
                echo 'Ejecutando tests en paralelo...'
                sh '''
                    pytest tests/ \\
                        -n auto \\
                        --dist=loadscope \\
                        --junitxml=reports/junit-parallel.xml
                '''
            }
        }
    }

    post {
        always {
            // Publicar reportes JUnit
            junit 'reports/*.xml'

            // Publicar reporte HTML
            publishHTML(target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'reports',
                reportFiles: 'report.html',
                reportName: 'Playwright Report'
            ])

            // Archivar artefactos (screenshots, videos, traces)
            archiveArtifacts artifacts: 'test-results/**/*',
                allowEmptyArchive: true

            // Limpiar workspace
            cleanWs()
        }

        failure {
            // Notificar por Slack en caso de fallo
            slackSend(
                color: 'danger',
                message: "FALLO: Pipeline Playwright - \${env.JOB_NAME} #\${env.BUILD_NUMBER}"
            )
        }

        success {
            slackSend(
                color: 'good',
                message: "OK: Pipeline Playwright - \${env.JOB_NAME} #\${env.BUILD_NUMBER}"
            )
        }
    }
}</code></pre>

        <h3>Jenkins con Docker Agent personalizado</h3>
        <p>Para mayor control, puedes crear un Dockerfile personalizado que incluya
        todas las herramientas necesarias:</p>

        <pre><code class="dockerfile"># Dockerfile.ci - Imagen personalizada para CI
FROM mcr.microsoft.com/playwright/python:v1.42.0-jammy

# Instalar herramientas adicionales
RUN apt-get update && apt-get install -y \\
    jq \\
    curl \\
    && rm -rf /var/lib/apt/lists/*

# Copiar y instalar dependencias Python
COPY requirements.txt /tmp/
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# Configurar usuario no-root
RUN useradd -m playwright-user
USER playwright-user

WORKDIR /app</code></pre>

        <p>Y referenciarlo en el Jenkinsfile:</p>

        <pre><code class="groovy">pipeline {
    agent {
        dockerfile {
            filename 'Dockerfile.ci'
            args '--ipc=host -v /tmp:/tmp'
        }
    }
    // ... stages ...
}</code></pre>

        <h3>GitLab CI: Configuracion con .gitlab-ci.yml</h3>
        <p>GitLab CI utiliza el archivo <code>.gitlab-ci.yml</code> en la raiz del repositorio.
        Su sintaxis es mas directa que Jenkins y la integracion con GitLab es nativa:</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Concepto GitLab CI</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripcion</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Equivalente Jenkins</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Pipeline</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Ejecucion completa disparada por un evento</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Pipeline</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Stage</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Grupo de jobs que se ejecutan en paralelo</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Stage</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Job</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Unidad de trabajo con scripts y configuracion</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Step</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Runner</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Maquina que ejecuta los jobs (shared o dedicated)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Agent/Node</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Artifacts</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Archivos generados que persisten entre stages</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">archiveArtifacts</td>
                </tr>
            </table>
        </div>

        <h3>.gitlab-ci.yml completo para Playwright</h3>

        <pre><code class="yaml"># .gitlab-ci.yml - Pipeline completo para Playwright con Python

image: mcr.microsoft.com/playwright/python:v1.42.0-jammy

# Definir las fases del pipeline
stages:
  - setup
  - lint
  - test
  - report

# Variables globales
variables:
  PIP_CACHE_DIR: "$CI_PROJECT_DIR/.pip-cache"
  PLAYWRIGHT_BROWSERS_PATH: "/ms-playwright"

# Cache de dependencias Python
cache:
  key: "$CI_COMMIT_REF_SLUG"
  paths:
    - .pip-cache/
    - .venv/

# ---- STAGE: Setup ----
install_dependencies:
  stage: setup
  script:
    - python -m venv .venv
    - source .venv/bin/activate
    - pip install --upgrade pip
    - pip install -r requirements.txt
    - pip install pytest-html pytest-xdist allure-pytest
  artifacts:
    paths:
      - .venv/
    expire_in: 1 hour

# ---- STAGE: Lint ----
code_quality:
  stage: lint
  script:
    - source .venv/bin/activate
    - pip install flake8 black
    - flake8 tests/ --max-line-length=120
    - black --check tests/
  allow_failure: true

# ---- STAGE: Test ----
playwright_tests:
  stage: test
  script:
    - source .venv/bin/activate
    - pytest tests/
        --html=reports/report.html
        --self-contained-html
        --junitxml=reports/junit.xml
        -v --tb=short
  artifacts:
    when: always
    paths:
      - reports/
      - test-results/
    reports:
      junit: reports/junit.xml
    expire_in: 7 days
  retry:
    max: 2
    when:
      - runner_system_failure
      - stuck_or_timeout_failure

# Tests en paralelo (opcional)
playwright_parallel:
  stage: test
  parallel: 3
  script:
    - source .venv/bin/activate
    - pytest tests/
        --junitxml=reports/junit-$CI_NODE_INDEX.xml
        -v --tb=short
        --splits 3
        --group $CI_NODE_INDEX
  artifacts:
    when: always
    paths:
      - reports/
    reports:
      junit: reports/junit-*.xml
    expire_in: 7 days

# ---- STAGE: Report ----
publish_report:
  stage: report
  script:
    - echo "Reportes disponibles en artifacts"
  artifacts:
    paths:
      - reports/
    expire_in: 30 days
  when: always</code></pre>

        <h3>GitLab CI: Merge Request Pipelines</h3>
        <p>Para ejecutar tests solo en merge requests, agrega reglas condicionales:</p>

        <pre><code class="yaml"># Solo ejecutar en merge requests
playwright_mr_tests:
  stage: test
  script:
    - source .venv/bin/activate
    - pytest tests/ --junitxml=reports/junit.xml -v
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
    - if: '$CI_COMMIT_BRANCH == "main"'
    - if: '$CI_COMMIT_BRANCH == "develop"'
  artifacts:
    when: always
    reports:
      junit: reports/junit.xml</code></pre>

        <h3>Manejo de secretos y variables</h3>
        <p>Ambas plataformas ofrecen mecanismos seguros para manejar credenciales:</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Jenkins: Credentials Plugin</h4>
            <pre><code class="groovy">// En Jenkinsfile
environment {
    // Credenciales tipo username/password
    DB_CREDS = credentials('database-credentials')
    // Credenciales tipo secret text
    API_KEY = credentials('api-key-staging')
}

// Uso en steps
steps {
    sh 'echo "Conectando a $DB_CREDS_USR con password oculto"'
}</code></pre>

            <h4>GitLab CI: Variables CI/CD</h4>
            <pre><code class="yaml"># En .gitlab-ci.yml (referencia a variables configuradas en Settings > CI/CD)
variables:
  BASE_URL: "https://staging.ejemplo.com"
  # Las variables protegidas/masked se configuran en la UI de GitLab

playwright_tests:
  script:
    - pytest tests/ --base-url=$BASE_URL
  variables:
    # Variable especifica del job
    HEADLESS: "true"</code></pre>
        </div>

        <h3>Comparativa: Jenkins vs GitLab CI vs GitHub Actions</h3>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Caracteristica</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Jenkins</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">GitLab CI</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">GitHub Actions</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Config como codigo</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Jenkinsfile</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">.gitlab-ci.yml</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">workflow YAML</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Docker nativo</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Via plugin</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Integrado</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Integrado</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Paralelismo</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">parallel + matrix</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">parallel keyword</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">matrix strategy</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Self-hosted</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Siempre (on-prem)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Runners propios</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Self-hosted runners</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Ecosystem</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">1800+ plugins</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Templates integrados</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Marketplace Actions</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Curva aprendizaje</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Alta</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Media</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Baja</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Mejor para</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Enterprise on-prem</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Equipos GitLab</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Proyectos GitHub</td>
                </tr>
            </table>
        </div>

        <h3>Artefactos y reportes en ambas plataformas</h3>
        <p>La recoleccion de artefactos es crucial para diagnosticar fallos. Playwright genera
        screenshots, videos y traces que deben preservarse:</p>

        <div class="code-tabs" data-code-id="L112-1">
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
<pre><code class="language-python"># conftest.py - Configuracion para generar artefactos en CI
import pytest
import os

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    """Configurar grabacion de video y screenshots en CI."""
    if os.getenv("CI"):
        return {
            **browser_context_args,
            "record_video_dir": "test-results/videos/",
            "record_video_size": {"width": 1280, "height": 720},
        }
    return browser_context_args

@pytest.fixture(autouse=True)
def capture_screenshot_on_failure(request, page):
    """Capturar screenshot automaticamente si el test falla."""
    yield
    if request.node.rep_call and request.node.rep_call.failed:
        test_name = request.node.name.replace(" ", "_")
        screenshot_path = f"test-results/screenshots/{test_name}.png"
        os.makedirs(os.path.dirname(screenshot_path), exist_ok=True)
        page.screenshot(path=screenshot_path, full_page=True)

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Hook para almacenar resultado del test en el request."""
    outcome = yield
    rep = outcome.get_result()
    setattr(item, f"rep_{rep.when}", rep)</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// playwright.config.ts - Configuracion para generar artefactos en CI
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Configurar grabacion de video y screenshots en CI
  use: {
    // Grabar video solo en CI
    video: process.env.CI ? 'on' : 'off',
    // Capturar screenshot automaticamente si el test falla
    screenshot: 'only-on-failure',
    // Grabar trace en primer reintento
    trace: 'on-first-retry',
  },

  // Directorio de salida para artefactos
  outputDir: 'test-results/',

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Tamano de video personalizado
        video: process.env.CI
          ? { mode: 'on', size: { width: 1280, height: 720 } }
          : 'off',
      },
    },
  ],
});

// -------------------------------------------------------
// Ejemplo: fixture global para screenshot en fallo
// tests/base.fixture.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  // Playwright TS captura screenshots automaticamente
  // con screenshot: 'only-on-failure' en config.
  // Para logica personalizada, usa afterEach:
  page: async ({ page }, use, testInfo) => {
    await use(page);
    // Si el test fallo, capturar screenshot adicional
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshotPath = \`test-results/screenshots/\${testInfo.title.replace(/ /g, '_')}.png\`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      await testInfo.attach('screenshot-on-failure', {
        path: screenshotPath,
        contentType: 'image/png',
      });
    }
  },
});</code></pre>
</div>
</div>

        <div style="background: #fce4ec; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Advertencia: Recursos en CI</h4>
            <p>Los runners de CI tienen recursos limitados. Chromium en Docker puede consumir
            mucha memoria. Siempre configura <code>--ipc=host</code> en Docker y considera
            limitar el numero de workers paralelos con <code>-n 2</code> en lugar de <code>-n auto</code>
            para evitar OOM (Out of Memory) en runners con poca RAM.</p>
        </div>

        <h3>Jenkins: Pipeline con stages paralelos por navegador</h3>

        <pre><code class="groovy">// Jenkinsfile - Tests paralelos por navegador
pipeline {
    agent none

    stages {
        stage('Setup') {
            agent {
                docker { image 'python:3.11-slim' }
            }
            steps {
                sh 'pip install -r requirements.txt'
            }
        }

        stage('Tests por navegador') {
            parallel {
                stage('Chromium') {
                    agent {
                        docker {
                            image 'mcr.microsoft.com/playwright/python:v1.42.0-jammy'
                            args '--ipc=host'
                        }
                    }
                    steps {
                        sh '''
                            pip install -r requirements.txt
                            pytest tests/ --browser chromium \\
                                --junitxml=reports/chromium.xml
                        '''
                    }
                    post {
                        always {
                            junit 'reports/chromium.xml'
                            archiveArtifacts artifacts: 'test-results/**/*'
                        }
                    }
                }

                stage('Firefox') {
                    agent {
                        docker {
                            image 'mcr.microsoft.com/playwright/python:v1.42.0-jammy'
                            args '--ipc=host'
                        }
                    }
                    steps {
                        sh '''
                            pip install -r requirements.txt
                            pytest tests/ --browser firefox \\
                                --junitxml=reports/firefox.xml
                        '''
                    }
                    post {
                        always {
                            junit 'reports/firefox.xml'
                        }
                    }
                }

                stage('WebKit') {
                    agent {
                        docker {
                            image 'mcr.microsoft.com/playwright/python:v1.42.0-jammy'
                            args '--ipc=host'
                        }
                    }
                    steps {
                        sh '''
                            pip install -r requirements.txt
                            pytest tests/ --browser webkit \\
                                --junitxml=reports/webkit.xml
                        '''
                    }
                    post {
                        always {
                            junit 'reports/webkit.xml'
                        }
                    }
                }
            }
        }
    }
}</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Ejercicio Practico</h4>
            <p>Configura pipelines completos para Jenkins y GitLab CI:</p>
            <ol>
                <li><strong>Jenkinsfile:</strong> Crea un pipeline declarativo que:
                    <ul>
                        <li>Use la imagen Docker oficial de Playwright</li>
                        <li>Instale dependencias desde requirements.txt</li>
                        <li>Ejecute lint con flake8</li>
                        <li>Ejecute tests de Playwright con reporte HTML</li>
                        <li>Archive screenshots y videos como artefactos</li>
                        <li>Envie notificacion por Slack en caso de fallo</li>
                    </ul>
                </li>
                <li><strong>.gitlab-ci.yml:</strong> Crea un pipeline que:
                    <ul>
                        <li>Defina stages: setup, lint, test, report</li>
                        <li>Use cache para dependencias pip</li>
                        <li>Ejecute tests con reporte JUnit</li>
                        <li>Configure retry automatico para fallos de infraestructura</li>
                        <li>Publique artefactos con expiracion de 7 dias</li>
                        <li>Solo ejecute en merge requests y rama main</li>
                    </ul>
                </li>
            </ol>

            <div class="code-tabs" data-code-id="L112-2">
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
<pre><code class="language-python"># Verificacion del ejercicio
# Tu Jenkinsfile debe incluir al menos:
assert "pipeline {" in jenkinsfile_content
assert "agent { docker" in jenkinsfile_content
assert "stage('Tests')" in jenkinsfile_content or "stage('Test')" in jenkinsfile_content
assert "archiveArtifacts" in jenkinsfile_content
assert "junit" in jenkinsfile_content

# Tu .gitlab-ci.yml debe incluir:
assert "image: mcr.microsoft.com/playwright" in gitlab_ci_content
assert "stages:" in gitlab_ci_content
assert "artifacts:" in gitlab_ci_content
assert "reports:" in gitlab_ci_content
assert "retry:" in gitlab_ci_content</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// Verificacion del ejercicio
// Tu Jenkinsfile debe incluir al menos:
console.assert(jenkinsfileContent.includes('pipeline {'));
console.assert(jenkinsfileContent.includes('agent { docker'));
console.assert(
  jenkinsfileContent.includes("stage('Tests')") ||
  jenkinsfileContent.includes("stage('Test')")
);
console.assert(jenkinsfileContent.includes('archiveArtifacts'));
console.assert(jenkinsfileContent.includes('junit'));

// Tu .gitlab-ci.yml debe incluir:
console.assert(gitlabCiContent.includes('image: mcr.microsoft.com/playwright'));
console.assert(gitlabCiContent.includes('stages:'));
console.assert(gitlabCiContent.includes('artifacts:'));
console.assert(gitlabCiContent.includes('reports:'));
console.assert(gitlabCiContent.includes('retry:'));

// Adicionalmente, tu playwright.config.ts debe incluir:
console.assert(playwrightConfig.includes('defineConfig'));
console.assert(playwrightConfig.includes('projects'));
// Y los comandos npx playwright test en los pipelines</code></pre>
</div>
</div>
        </div>

        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>En la siguiente leccion</strong> exploraras la
            <strong>ejecucion paralela y sharding</strong> de tests en CI/CD, una tecnica
            esencial para reducir el tiempo de ejecucion de suites grandes distribuyendo
            los tests entre multiples runners o contenedores.</p>
        </div>
    `,
    topics: ["jenkins", "gitlab-ci", "playwright"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_112 = LESSON_112;
}
