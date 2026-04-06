/**
 * Playwright Academy - Leccion 115
 * Azure DevOps y pipelines Windows
 * Seccion 17: CI/CD Integration
 */

const LESSON_115 = {
    id: 115,
    title: "Azure DevOps y pipelines Windows",
    duration: "7 min",
    level: "advanced",
    section: "section-17",
    content: `
        <h2>Azure DevOps y pipelines Windows</h2>
        <p><strong>Azure DevOps</strong> es la plataforma de CI/CD mas utilizada en entornos corporativos Microsoft.
        Para equipos de QA que trabajan con tecnologias .NET, Windows Server y ecosistemas Azure, dominar
        <strong>Azure Pipelines</strong> con Playwright es una habilidad critica. En esta leccion aprenderemos
        a configurar pipelines completos para ejecutar pruebas de Playwright con Python en agentes
        Windows y Linux de Azure DevOps, publicar resultados de pruebas, gestionar secretos y
        orquestar despliegues multi-etapa.</p>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Contexto SIESA</h4>
            <p>SIESA utiliza <strong>Azure DevOps</strong> como su plataforma principal de CI/CD. Los equipos de
            desarrollo y QA gestionan repos, pipelines, boards y test plans desde Azure DevOps Services.
            Esta leccion esta disenada especificamente para que puedas aplicar lo aprendido
            <strong>directamente en el entorno real de SIESA</strong>: pipelines YAML, agentes Windows
            para probar aplicaciones .NET del ERP y HCM, y publicacion de resultados integrada
            con Azure Test Plans.</p>
        </div>

        <h3>Azure DevOps Pipelines: vision general para QA</h3>
        <p>Azure Pipelines ofrece integracion continua y entrega continua (CI/CD) como servicio.
        Para equipos de QA, los conceptos clave son:</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Concepto</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripcion</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Relevancia QA</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Pipeline</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Definicion YAML del flujo CI/CD completo</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Define cuando y como se ejecutan los tests</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Stage</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Fase logica del pipeline (Build, Test, Deploy)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Separa ejecucion de tests por ambiente</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Job</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Unidad de trabajo que corre en un agente</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Cada job puede usar un agente diferente (Windows/Linux)</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Step/Task</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Accion individual: script, tarea predefinida</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Instalar deps, ejecutar tests, publicar resultados</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Agent Pool</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Grupo de maquinas que ejecutan pipelines</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Microsoft-hosted o self-hosted segun necesidad</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Artifact</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Archivo generado durante el pipeline</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Reportes HTML, screenshots, traces de Playwright</td>
                </tr>
            </table>
        </div>

        <h3>Estructura basica: azure-pipelines.yml</h3>
        <p>El archivo <code>azure-pipelines.yml</code> en la raiz del repositorio define todo el pipeline.
        Veamos la estructura minima para ejecutar tests de Playwright con Python:</p>

        <pre><code class="yaml"># azure-pipelines.yml - Pipeline basico de Playwright con Python
trigger:
  branches:
    include:
      - main
      - develop
  paths:
    include:
      - tests/**
      - pages/**
      - conftest.py

pool:
  vmImage: 'ubuntu-latest'

variables:
  pythonVersion: '3.11'
  PLAYWRIGHT_BROWSERS_PATH: 0  # Instalar en directorio local

steps:
  - task: UsePythonVersion@0
    inputs:
      versionSpec: '$(pythonVersion)'
    displayName: 'Configurar Python $(pythonVersion)'

  - script: |
      python -m pip install --upgrade pip
      pip install -r requirements.txt
      playwright install --with-deps chromium
    displayName: 'Instalar dependencias y navegadores'

  - script: |
      pytest tests/ \\
        --junitxml=test-results/results.xml \\
        --html=test-results/report.html \\
        --self-contained-html \\
        -v
    displayName: 'Ejecutar tests de Playwright'
    continueOnError: true

  - task: PublishTestResults@2
    inputs:
      testResultsFormat: 'JUnit'
      testResultsFiles: 'test-results/results.xml'
      testRunTitle: 'Playwright Tests - $(Build.BuildNumber)'
    condition: always()
    displayName: 'Publicar resultados de tests'

  - task: PublishBuildArtifacts@1
    inputs:
      pathToPublish: 'test-results'
      artifactName: 'playwright-reports'
    condition: always()
    displayName: 'Publicar reportes como artefactos'</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>En los repositorios de SIESA, se recomienda colocar el <code>azure-pipelines.yml</code> en la
            raiz del repo y usar <strong>path triggers</strong> para que el pipeline solo se ejecute cuando
            cambian archivos relevantes (carpeta <code>tests/</code>, <code>conftest.py</code>,
            <code>requirements.txt</code>). Esto ahorra minutos de agente y reduce costos.</p>
        </div>

        <h3>Agentes Microsoft-hosted: Windows vs Linux</h3>
        <p>Azure DevOps ofrece agentes hospedados por Microsoft con diferentes sistemas operativos.
        La eleccion del agente depende de tu aplicacion bajo prueba:</p>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #ffe0b2;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Agente</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">vmImage</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Caso de uso QA</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Ubuntu</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>ubuntu-latest</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Aplicaciones web generales, mas rapido y economico</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Windows</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>windows-latest</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Apps .NET, IIS, Active Directory, pruebas con IE mode</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>macOS</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>macos-latest</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Testing de Safari (WebKit nativo)</td>
                </tr>
            </table>
        </div>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Contexto SIESA</h4>
            <p>Las aplicaciones de SIESA (ERP Siesa Enterprise y HCM) corren sobre <strong>.NET / IIS en Windows Server</strong>.
            Por eso los pipelines de QA en SIESA frecuentemente usan <code>windows-latest</code> como agente,
            especialmente cuando se necesita levantar servicios locales o ejecutar scripts de PowerShell
            para preparar el ambiente. Para las pruebas de Playwright puras (sin dependencias Windows),
            <code>ubuntu-latest</code> es mas rapido y se recomienda como primera opcion.</p>
        </div>

        <h3>Instalacion en agentes Windows</h3>
        <p>Cuando usas <code>windows-latest</code>, la sintaxis de los scripts cambia. Veamos las
        diferencias clave:</p>

        <pre><code class="yaml"># Pipeline en agente Windows
pool:
  vmImage: 'windows-latest'

variables:
  pythonVersion: '3.11'

steps:
  - task: UsePythonVersion@0
    inputs:
      versionSpec: '$(pythonVersion)'
    displayName: 'Configurar Python $(pythonVersion)'

  # En Windows, usar 'script' ejecuta cmd.exe por defecto
  # Mejor usar PowerShell para mayor control
  - powershell: |
      python -m pip install --upgrade pip
      pip install -r requirements.txt
      # Instalar navegadores con dependencias del sistema
      playwright install --with-deps chromium
    displayName: 'Instalar dependencias (PowerShell)'

  # Ejecutar tests con PowerShell
  - powershell: |
      pytest tests/ \`
        --junitxml=test-results\\results.xml \`
        --html=test-results\\report.html \`
        --self-contained-html \`
        -v
    displayName: 'Ejecutar tests de Playwright'
    continueOnError: true
    env:
      # Variables de entorno para los tests
      BASE_URL: $(baseUrl)
      TEST_USER: $(testUser)
      TEST_PASSWORD: $(testPassword)</code></pre>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Consideraciones Windows</h4>
            <p>Al trabajar con agentes Windows, ten en cuenta estas diferencias criticas:</p>
            <ul>
                <li><strong>Separadores de ruta:</strong> Usa <code>\\\\</code> en paths dentro de scripts PowerShell, o
                mejor aun, usa <code>os.path.join()</code> en Python para rutas multiplataforma</li>
                <li><strong>Backtick vs backslash:</strong> En PowerShell, la continuacion de linea es <code>\`</code>
                (backtick), no <code>\\</code></li>
                <li><strong>Variables de entorno:</strong> En PowerShell se acceden con <code>$env:VARIABLE</code>,
                en cmd con <code>%VARIABLE%</code></li>
                <li><strong>Encoding:</strong> Configura <code>[Console]::OutputEncoding</code> si los tests generan
                texto con caracteres especiales</li>
                <li><strong>Line endings:</strong> Git en Windows puede convertir LF a CRLF; asegurate de que
                tus archivos YAML mantengan LF con <code>.gitattributes</code></li>
            </ul>
        </div>

        <h3>Pipeline stages: Build, Test, Report</h3>
        <p>Un pipeline profesional separa sus responsabilidades en <strong>stages</strong> (etapas).
        Esto permite mayor control, visibilidad y reutilizacion:</p>

        <pre><code class="yaml"># azure-pipelines.yml con stages separados
trigger:
  branches:
    include:
      - main
      - develop

variables:
  pythonVersion: '3.11'

stages:
  # ========================================
  # STAGE 1: Build - Preparar el entorno
  # ========================================
  - stage: Build
    displayName: 'Preparar entorno de testing'
    jobs:
      - job: SetupEnvironment
        pool:
          vmImage: 'ubuntu-latest'
        steps:
          - task: UsePythonVersion@0
            inputs:
              versionSpec: '$(pythonVersion)'

          - script: |
              python -m pip install --upgrade pip
              pip install -r requirements.txt
              playwright install --with-deps chromium
            displayName: 'Instalar dependencias'

          # Cachear navegadores para stages siguientes
          - task: Cache@2
            inputs:
              key: 'playwright | "$(Agent.OS)" | requirements.txt'
              path: '$(Pipeline.Workspace)/.cache/ms-playwright'
            displayName: 'Cache de navegadores Playwright'

  # ========================================
  # STAGE 2: Test - Ejecutar pruebas
  # ========================================
  - stage: Test
    displayName: 'Ejecutar pruebas Playwright'
    dependsOn: Build
    jobs:
      - job: RunTests
        pool:
          vmImage: 'ubuntu-latest'
        steps:
          - task: UsePythonVersion@0
            inputs:
              versionSpec: '$(pythonVersion)'

          - script: |
              pip install -r requirements.txt
              playwright install --with-deps chromium
            displayName: 'Instalar dependencias'

          - script: |
              pytest tests/ \\
                --junitxml=test-results/results.xml \\
                --html=test-results/report.html \\
                --self-contained-html \\
                --tb=short \\
                -v
            displayName: 'Ejecutar suite de pruebas'
            continueOnError: true

          # Publicar resultados JUnit para Azure Test Runs
          - task: PublishTestResults@2
            inputs:
              testResultsFormat: 'JUnit'
              testResultsFiles: 'test-results/results.xml'
              testRunTitle: 'Playwright - $(Build.BuildNumber)'
              mergeTestResults: true
            condition: always()
            displayName: 'Publicar resultados JUnit'

          # Guardar reportes y traces como artefactos
          - task: PublishPipelineArtifact@1
            inputs:
              targetPath: 'test-results'
              artifact: 'test-reports'
              publishLocation: 'pipeline'
            condition: always()
            displayName: 'Publicar artefactos de testing'

  # ========================================
  # STAGE 3: Report - Consolidar y notificar
  # ========================================
  - stage: Report
    displayName: 'Consolidar reportes'
    dependsOn: Test
    condition: always()
    jobs:
      - job: ConsolidateReports
        pool:
          vmImage: 'ubuntu-latest'
        steps:
          - task: DownloadPipelineArtifact@2
            inputs:
              artifact: 'test-reports'
              path: '$(Pipeline.Workspace)/reports'
            displayName: 'Descargar artefactos de testing'

          - script: |
              echo "Resultados disponibles en artefactos del pipeline"
              echo "Build: $(Build.BuildNumber)"
              echo "Branch: $(Build.SourceBranchName)"
              # Aqui puedes agregar logica para notificar por email o Teams
            displayName: 'Resumen de ejecucion'</code></pre>

        <h3>Variable groups y secretos</h3>
        <p>Las credenciales y URLs de los ambientes de prueba <strong>nunca</strong> deben estar en el YAML.
        Azure DevOps ofrece <strong>Variable Groups</strong> y <strong>Pipeline Variables</strong> para gestionar
        secretos de forma segura:</p>

        <pre><code class="yaml"># Referencia a Variable Groups en el pipeline
variables:
  - group: 'QA-Environment-Variables'  # Variable Group en Azure DevOps
  - group: 'Playwright-Secrets'
  - name: pythonVersion
    value: '3.11'
  - name: runSmoke
    value: 'true'</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Configurar Variable Groups en Azure DevOps</h4>
            <p>Para crear un Variable Group:</p>
            <ol>
                <li>Ve a <strong>Pipelines > Library</strong> en tu proyecto de Azure DevOps</li>
                <li>Click en <strong>+ Variable group</strong></li>
                <li>Nombra el grupo (ej: <code>QA-Environment-Variables</code>)</li>
                <li>Agrega las variables necesarias:
                    <ul>
                        <li><code>BASE_URL</code>: URL del ambiente (ej: <code>https://staging.siesa.com</code>)</li>
                        <li><code>TEST_USER</code>: Usuario de pruebas</li>
                        <li><code>TEST_PASSWORD</code>: Contrasena (marca el candado para encriptarla)</li>
                    </ul>
                </li>
                <li>En <strong>Pipeline permissions</strong>, autoriza los pipelines que pueden usar el grupo</li>
            </ol>
            <p>Las variables marcadas como <strong>secretas</strong> (icono de candado) se enmascaran en los logs
            y no pueden leerse despues de guardarse.</p>
        </div>

        <p>En Python, accedes a las variables del pipeline como variables de entorno normales:</p>

        <pre><code class="python"># conftest.py - Leer variables de Azure DevOps
import os
import pytest
from playwright.sync_api import sync_playwright


@pytest.fixture(scope="session")
def base_url():
    """URL base del ambiente bajo prueba, desde variable de pipeline."""
    url = os.environ.get("BASE_URL", "http://localhost:8080")
    print(f"Ambiente de pruebas: {url}")
    return url


@pytest.fixture(scope="session")
def credentials():
    """Credenciales de prueba desde variables secretas del pipeline."""
    return {
        "user": os.environ.get("TEST_USER", "test_default"),
        "password": os.environ.get("TEST_PASSWORD", "default_pass"),
    }


@pytest.fixture(scope="session")
def browser_context(base_url, credentials):
    """Contexto de Playwright configurado para el ambiente."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            base_url=base_url,
            viewport={"width": 1920, "height": 1080},
            locale="es-CO",
        )
        yield context
        browser.close()</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>En SIESA, los Variable Groups se organizan por ambiente: <code>QA-Dev</code>,
            <code>QA-Staging</code>, <code>QA-Prod</code>. Cada grupo contiene las URLs y credenciales
            del ambiente correspondiente. El pipeline selecciona el grupo segun la rama o un
            parametro de ejecucion. Esto permite reutilizar el mismo YAML para probar en
            diferentes ambientes sin modificar codigo.</p>
        </div>

        <h3>Publicacion de resultados: PublishTestResults</h3>
        <p>La tarea <code>PublishTestResults@2</code> es fundamental: lee el archivo JUnit XML generado
        por pytest y lo integra directamente en la interfaz de Azure DevOps, creando un
        <strong>Test Run</strong> con estadisticas, graficas y detalle por caso:</p>

        <pre><code class="yaml"># Publicar resultados en formato JUnit
- task: PublishTestResults@2
  inputs:
    testResultsFormat: 'JUnit'           # Formato del archivo
    testResultsFiles: '**/results.xml'   # Patron glob para encontrar archivos
    testRunTitle: 'Playwright - $(Build.SourceBranchName) - $(Build.BuildNumber)'
    mergeTestResults: true               # Combinar si hay multiples archivos
    failTaskOnFailedTests: true          # Fallar el pipeline si hay tests fallidos
    publishRunAttachments: true          # Adjuntar archivos extra al Test Run
  condition: always()                    # Ejecutar incluso si tests fallaron
  displayName: 'Publicar resultados de tests'</code></pre>

        <p>Para generar el JUnit XML correctamente con pytest:</p>

        <pre><code class="python"># pytest.ini - Configuracion para generar JUnit compatible con Azure DevOps
[pytest]
addopts =
    --junitxml=test-results/results.xml
    --tb=short
    -v
junit_family = xunit2
junit_suite_name = Playwright_Tests
junit_logging = all

# Los nombres de test se muestran en Azure DevOps como:
# tests/test_login.py::TestLogin::test_valid_credentials
# tests/test_search.py::TestSearch::test_search_product</code></pre>

        <h3>Publicacion de artefactos</h3>
        <p>Azure DevOps ofrece dos tareas para publicar artefactos. La version moderna
        (<code>PublishPipelineArtifact</code>) es la recomendada:</p>

        <pre><code class="yaml"># Opcion 1: PublishPipelineArtifact (RECOMENDADA)
# Usa Pipeline Artifacts, mas rapido y con mejor integracion
- task: PublishPipelineArtifact@1
  inputs:
    targetPath: 'test-results'
    artifact: 'playwright-reports'
    publishLocation: 'pipeline'
  condition: always()
  displayName: 'Publicar reportes (Pipeline Artifact)'

# Opcion 2: PublishBuildArtifacts (legacy, pero aun funcional)
# Usa Build Artifacts, compatible con pipelines clasicos
- task: PublishBuildArtifacts@1
  inputs:
    pathToPublish: 'test-results'
    artifactName: 'playwright-reports'
    publishLocation: 'Container'
  condition: always()
  displayName: 'Publicar reportes (Build Artifact)'</code></pre>

        <p>Para que los artefactos incluyan screenshots y traces de Playwright:</p>

        <pre><code class="python"># conftest.py - Capturar screenshots y traces en fallos
import pytest
import os
from pathlib import Path


RESULTS_DIR = Path("test-results")


@pytest.fixture(autouse=True)
def capture_on_failure(request, page):
    """Captura screenshot y trace cuando un test falla."""
    yield
    if request.node.rep_call and request.node.rep_call.failed:
        test_name = request.node.name.replace("[", "_").replace("]", "_")

        # Screenshot
        screenshot_path = RESULTS_DIR / "screenshots" / f"{test_name}.png"
        screenshot_path.parent.mkdir(parents=True, exist_ok=True)
        page.screenshot(path=str(screenshot_path), full_page=True)

        # Trace (si esta habilitado)
        trace_path = RESULTS_DIR / "traces" / f"{test_name}.zip"
        trace_path.parent.mkdir(parents=True, exist_ok=True)
        try:
            page.context.tracing.stop(path=str(trace_path))
        except Exception:
            pass  # Tracing puede no estar iniciado


@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Hook para acceder al resultado del test en el fixture."""
    outcome = yield
    rep = outcome.get_result()
    setattr(item, f"rep_{rep.when}", rep)</code></pre>

        <h3>Azure DevOps Test Plans</h3>
        <p>Si tu organizacion usa <strong>Azure Test Plans</strong> para gestionar los casos de prueba,
        puedes vincular los resultados automatizados con los test cases manuales:</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Integracion con Test Plans</h4>
            <ol>
                <li><strong>Asociar test cases:</strong> Cada metodo de test en Python se mapea a un Test Case
                de Azure Test Plans mediante el <strong>Test Case ID</strong></li>
                <li><strong>Test Configuration:</strong> Define configuraciones (OS, browser) para matrix testing</li>
                <li><strong>Test Run automatizado:</strong> PublishTestResults crea Test Runs que aparecen en
                Test Plans > Runs</li>
                <li><strong>Asociar a un Test Plan:</strong> Desde la UI de Azure DevOps, vincula los runs
                automatizados a un Test Plan y Test Suite especificos</li>
            </ol>
        </div>

        <pre><code class="python"># tests/test_login.py - Tests vinculados a Azure Test Plans
import pytest
from playwright.sync_api import Page, expect


class TestLogin:
    """Suite de login vinculada a Test Suite #1234 en Azure Test Plans."""

    @pytest.mark.azdo(test_case_id=5678)
    def test_login_valido(self, page: Page, base_url, credentials):
        """TC-5678: Verificar login con credenciales validas."""
        page.goto(f"{base_url}/login")
        page.fill("#username", credentials["user"])
        page.fill("#password", credentials["password"])
        page.click("button[type='submit']")

        expect(page.locator(".dashboard-header")).to_be_visible()
        expect(page).to_have_url(f"{base_url}/dashboard")

    @pytest.mark.azdo(test_case_id=5679)
    def test_login_invalido(self, page: Page, base_url):
        """TC-5679: Verificar mensaje de error con credenciales incorrectas."""
        page.goto(f"{base_url}/login")
        page.fill("#username", "usuario_invalido")
        page.fill("#password", "clave_incorrecta")
        page.click("button[type='submit']")

        error = page.locator(".error-message")
        expect(error).to_be_visible()
        expect(error).to_contain_text("Credenciales incorrectas")</code></pre>

        <h3>Pipeline triggers: validacion de PR, programados y manuales</h3>
        <p>Azure Pipelines soporta multiples tipos de triggers para ejecutar tus tests
        en diferentes momentos:</p>

        <pre><code class="yaml"># ========================================
# Triggers del pipeline
# ========================================

# 1. CI Trigger: se ejecuta con cada push a estas ramas
trigger:
  branches:
    include:
      - main
      - develop
      - release/*
    exclude:
      - feature/docs-*
  paths:
    include:
      - tests/**
      - pages/**
      - conftest.py
      - requirements.txt

# 2. PR Trigger: se ejecuta al crear/actualizar un Pull Request
pr:
  branches:
    include:
      - main
      - develop
  paths:
    include:
      - tests/**
      - pages/**

# 3. Scheduled Trigger: ejecucion programada (cron)
schedules:
  - cron: '0 6 * * 1-5'          # Lunes a Viernes a las 6:00 AM UTC
    displayName: 'Regresion diaria (6 AM)'
    branches:
      include:
        - main
    always: true                   # Ejecutar aunque no haya cambios

  - cron: '0 2 * * 0'             # Domingos a las 2:00 AM UTC
    displayName: 'Suite completa dominical'
    branches:
      include:
        - main
    always: true

# 4. Manual Trigger: se puede ejecutar manualmente desde la UI
# No requiere configuracion YAML adicional; todos los pipelines
# se pueden ejecutar manualmente desde Azure DevOps.
# Para agregar parametros manuales:
parameters:
  - name: environment
    displayName: 'Ambiente de pruebas'
    type: string
    default: 'staging'
    values:
      - dev
      - staging
      - production

  - name: browser
    displayName: 'Navegador'
    type: string
    default: 'chromium'
    values:
      - chromium
      - firefox
      - webkit

  - name: runSmoke
    displayName: 'Solo smoke tests?'
    type: boolean
    default: false</code></pre>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Contexto SIESA</h4>
            <p>En SIESA, el pipeline de QA se configura con tres triggers principales:</p>
            <ul>
                <li><strong>PR validation:</strong> Smoke tests al crear PR hacia <code>develop</code> o <code>main</code>
                (bloquea merge si fallan)</li>
                <li><strong>Regresion diaria:</strong> Suite completa programada cada dia a las 6 AM antes
                de que el equipo empiece a trabajar</li>
                <li><strong>Ejecucion manual:</strong> Con parametros para seleccionar ambiente y tipo de suite,
                usado por QA antes de liberaciones importantes</li>
            </ul>
        </div>

        <h3>Pipeline multi-etapa: Dev, QA, Staging, Prod</h3>
        <p>En organizaciones con multiples ambientes, un pipeline multi-stage permite
        promover el codigo a traves de cada ambiente con gates de calidad:</p>

        <pre><code class="yaml"># azure-pipelines.yml - Pipeline multi-etapa con gates de QA
trigger:
  branches:
    include:
      - main

parameters:
  - name: deployToProd
    displayName: 'Desplegar a Produccion?'
    type: boolean
    default: false

stages:
  # ----------------------------------------
  # ETAPA 1: Tests en ambiente Dev
  # ----------------------------------------
  - stage: TestDev
    displayName: 'Tests en Dev'
    variables:
      - group: 'QA-Dev'
    jobs:
      - job: SmokeTests
        pool:
          vmImage: 'ubuntu-latest'
        steps:
          - template: templates/setup-playwright.yml

          - script: |
              pytest tests/smoke/ \\
                --junitxml=test-results/smoke.xml \\
                -m smoke -v
            displayName: 'Smoke tests - Dev'
            env:
              BASE_URL: $(BASE_URL)

          - template: templates/publish-results.yml
            parameters:
              testRunTitle: 'Smoke - Dev'

  # ----------------------------------------
  # ETAPA 2: Tests en ambiente QA
  # ----------------------------------------
  - stage: TestQA
    displayName: 'Tests en QA'
    dependsOn: TestDev
    variables:
      - group: 'QA-Staging'
    jobs:
      - job: RegressionTests
        pool:
          vmImage: 'ubuntu-latest'
        steps:
          - template: templates/setup-playwright.yml

          - script: |
              pytest tests/ \\
                --junitxml=test-results/regression.xml \\
                -v --tb=short
            displayName: 'Regression tests - QA'
            env:
              BASE_URL: $(BASE_URL)
              TEST_USER: $(TEST_USER)
              TEST_PASSWORD: $(TEST_PASSWORD)

          - template: templates/publish-results.yml
            parameters:
              testRunTitle: 'Regression - QA'

  # ----------------------------------------
  # ETAPA 3: Tests en Staging (pre-produccion)
  # ----------------------------------------
  - stage: TestStaging
    displayName: 'Tests en Staging'
    dependsOn: TestQA
    variables:
      - group: 'QA-Staging'
    jobs:
      - job: E2ETests
        pool:
          vmImage: 'windows-latest'  # Windows para simular entorno produccion
        steps:
          - template: templates/setup-playwright-windows.yml

          - powershell: |
              pytest tests/e2e/ \`
                --junitxml=test-results\\e2e.xml \`
                -v --tb=short
            displayName: 'E2E tests - Staging (Windows)'
            env:
              BASE_URL: $(BASE_URL)
              TEST_USER: $(TEST_USER)
              TEST_PASSWORD: $(TEST_PASSWORD)

          - template: templates/publish-results.yml
            parameters:
              testRunTitle: 'E2E - Staging'

  # ----------------------------------------
  # ETAPA 4: Gate de aprobacion + Deploy a Prod
  # ----------------------------------------
  - stage: DeployProd
    displayName: 'Deploy a Produccion'
    dependsOn: TestStaging
    condition: and(succeeded(), eq('${{ parameters.deployToProd }}', 'true'))
    jobs:
      - deployment: DeployProduction
        environment: 'Production'  # Requiere aprobacion manual en Azure DevOps
        pool:
          vmImage: 'ubuntu-latest'
        strategy:
          runOnce:
            deploy:
              steps:
                - script: echo "Desplegando a produccion..."
                  displayName: 'Deploy'</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>Para reutilizar pasos comunes entre stages, usa <strong>templates YAML</strong>.
            Crea archivos como <code>templates/setup-playwright.yml</code> y
            <code>templates/publish-results.yml</code> que se importan con <code>- template:</code>.
            Esto mantiene el pipeline principal limpio y facilita actualizaciones centralizadas
            cuando cambia la version de Python, Playwright o la estructura de reportes.</p>
        </div>

        <h3>Templates YAML reutilizables</h3>
        <p>Los templates reducen la duplicacion y facilitan el mantenimiento:</p>

        <pre><code class="yaml"># templates/setup-playwright.yml
# Template reutilizable para configurar Playwright en Linux
steps:
  - task: UsePythonVersion@0
    inputs:
      versionSpec: '3.11'
    displayName: 'Configurar Python 3.11'

  - script: |
      python -m pip install --upgrade pip
      pip install -r requirements.txt
      playwright install --with-deps chromium
    displayName: 'Instalar dependencias y Playwright'

---
# templates/setup-playwright-windows.yml
# Template para configurar Playwright en Windows
steps:
  - task: UsePythonVersion@0
    inputs:
      versionSpec: '3.11'
    displayName: 'Configurar Python 3.11'

  - powershell: |
      python -m pip install --upgrade pip
      pip install -r requirements.txt
      playwright install --with-deps chromium
    displayName: 'Instalar dependencias y Playwright (Windows)'

---
# templates/publish-results.yml
# Template para publicar resultados y artefactos
parameters:
  - name: testRunTitle
    type: string
    default: 'Playwright Tests'

steps:
  - task: PublishTestResults@2
    inputs:
      testResultsFormat: 'JUnit'
      testResultsFiles: '**/results.xml'
      testRunTitle: '${{ parameters.testRunTitle }} - $(Build.BuildNumber)'
      mergeTestResults: true
    condition: always()
    displayName: 'Publicar resultados de tests'

  - task: PublishPipelineArtifact@1
    inputs:
      targetPath: 'test-results'
      artifact: 'reports-${{ parameters.testRunTitle }}'
      publishLocation: 'pipeline'
    condition: always()
    displayName: 'Publicar artefactos'</code></pre>

        <h3>Ejemplo completo: pipeline de produccion</h3>
        <p>Este es un pipeline listo para produccion que combina todas las tecnicas anteriores:</p>

        <pre><code class="python"># conftest.py completo para Azure DevOps
import os
import pytest
from pathlib import Path
from datetime import datetime
from playwright.sync_api import sync_playwright, Playwright


# Directorio de resultados
RESULTS_DIR = Path(os.environ.get("TEST_RESULTS_DIR", "test-results"))
RESULTS_DIR.mkdir(parents=True, exist_ok=True)


def pytest_configure(config):
    """Configuracion global de pytest para Azure DevOps."""
    # Registrar markers personalizados
    config.addinivalue_line("markers", "smoke: Smoke tests rapidos")
    config.addinivalue_line("markers", "regression: Tests de regresion")
    config.addinivalue_line("markers", "e2e: Tests end-to-end completos")
    config.addinivalue_line(
        "markers", "azdo(test_case_id): ID del Test Case en Azure Test Plans"
    )


@pytest.fixture(scope="session")
def playwright_instance():
    """Instancia de Playwright compartida por toda la sesion."""
    with sync_playwright() as p:
        yield p


@pytest.fixture(scope="session")
def browser(playwright_instance):
    """Navegador compartido. Headless en CI, con UI en local."""
    is_ci = os.environ.get("TF_BUILD", "false").lower() == "true"
    browser = playwright_instance.chromium.launch(
        headless=is_ci,
        slow_mo=0 if is_ci else 100,
    )
    yield browser
    browser.close()


@pytest.fixture
def page(browser):
    """Pagina nueva con tracing habilitado para cada test."""
    context = browser.new_context(
        base_url=os.environ.get("BASE_URL", "http://localhost:8080"),
        viewport={"width": 1920, "height": 1080},
        locale="es-CO",
        timezone_id="America/Bogota",
    )

    # Iniciar tracing para capturar en caso de fallo
    context.tracing.start(screenshots=True, snapshots=True, sources=True)

    page = context.new_page()
    yield page

    # Cleanup
    page.close()
    context.close()


@pytest.fixture(autouse=True)
def handle_test_result(request, page):
    """Captura evidencia automatica cuando un test falla."""
    yield

    # Verificar si el test fallo
    if hasattr(request.node, "rep_call") and request.node.rep_call.failed:
        test_name = request.node.name
        safe_name = test_name.replace("[", "_").replace("]", "_").replace("/", "_")
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        # Capturar screenshot
        screenshot_dir = RESULTS_DIR / "screenshots"
        screenshot_dir.mkdir(parents=True, exist_ok=True)
        screenshot_path = screenshot_dir / f"{safe_name}_{timestamp}.png"
        page.screenshot(path=str(screenshot_path), full_page=True)

        # Detener y guardar trace
        trace_dir = RESULTS_DIR / "traces"
        trace_dir.mkdir(parents=True, exist_ok=True)
        trace_path = trace_dir / f"{safe_name}_{timestamp}.zip"
        try:
            page.context.tracing.stop(path=str(trace_path))
        except Exception:
            pass


@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Exponer resultado del test al fixture."""
    outcome = yield
    rep = outcome.get_result()
    setattr(item, f"rep_{rep.when}", rep)</code></pre>

        <h3>Ejercicio practico</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Ejercicio: Configurar un pipeline Azure DevOps para Playwright</h4>
            <p>Crea un pipeline completo de Azure DevOps que ejecute pruebas de Playwright con Python.
            El pipeline debe cubrir los siguientes requisitos:</p>
            <ol>
                <li><strong>Trigger:</strong> Ejecutarse en push a <code>main</code> y <code>develop</code>,
                y tambien en PR hacia <code>main</code></li>
                <li><strong>Parametros manuales:</strong> Permitir seleccionar ambiente (<code>dev</code>,
                <code>staging</code>) y navegador (<code>chromium</code>, <code>firefox</code>)</li>
                <li><strong>Variable Group:</strong> Referenciar un grupo llamado <code>QA-Environment</code>
                para URLs y credenciales</li>
                <li><strong>Setup:</strong> Instalar Python 3.11, dependencias y navegadores Playwright</li>
                <li><strong>Ejecucion:</strong> Correr pytest con JUnit XML y reporte HTML</li>
                <li><strong>Resultados:</strong> Publicar resultados con <code>PublishTestResults@2</code></li>
                <li><strong>Artefactos:</strong> Publicar reportes con <code>PublishPipelineArtifact@1</code></li>
            </ol>

            <p><strong>Solucion:</strong></p>
            <pre><code class="yaml"># azure-pipelines.yml - Solucion del ejercicio
trigger:
  branches:
    include:
      - main
      - develop
  paths:
    include:
      - tests/**
      - conftest.py
      - requirements.txt

pr:
  branches:
    include:
      - main

parameters:
  - name: environment
    displayName: 'Ambiente'
    type: string
    default: 'staging'
    values:
      - dev
      - staging

  - name: browser
    displayName: 'Navegador'
    type: string
    default: 'chromium'
    values:
      - chromium
      - firefox

variables:
  - group: 'QA-Environment'
  - name: pythonVersion
    value: '3.11'

pool:
  vmImage: 'ubuntu-latest'

stages:
  - stage: PlaywrightTests
    displayName: 'Ejecutar Playwright Tests'
    jobs:
      - job: RunTests
        displayName: 'Tests en ${{ parameters.environment }} con ${{ parameters.browser }}'
        steps:
          - task: UsePythonVersion@0
            inputs:
              versionSpec: '$(pythonVersion)'
            displayName: 'Configurar Python $(pythonVersion)'

          - script: |
              python -m pip install --upgrade pip
              pip install -r requirements.txt
              playwright install --with-deps ${{ parameters.browser }}
            displayName: 'Instalar dependencias y ${{ parameters.browser }}'

          - script: |
              pytest tests/ \\
                --junitxml=test-results/results.xml \\
                --html=test-results/report.html \\
                --self-contained-html \\
                --browser ${{ parameters.browser }} \\
                -v --tb=short
            displayName: 'Ejecutar tests de Playwright'
            continueOnError: true
            env:
              BASE_URL: $(BASE_URL)
              TEST_USER: $(TEST_USER)
              TEST_PASSWORD: $(TEST_PASSWORD)

          - task: PublishTestResults@2
            inputs:
              testResultsFormat: 'JUnit'
              testResultsFiles: 'test-results/results.xml'
              testRunTitle: 'Playwright (${{ parameters.browser }}) - ${{ parameters.environment }} - $(Build.BuildNumber)'
              mergeTestResults: true
              failTaskOnFailedTests: true
            condition: always()
            displayName: 'Publicar resultados JUnit'

          - task: PublishPipelineArtifact@1
            inputs:
              targetPath: 'test-results'
              artifact: 'playwright-reports-${{ parameters.environment }}-${{ parameters.browser }}'
              publishLocation: 'pipeline'
            condition: always()
            displayName: 'Publicar artefactos de testing'</code></pre>
        </div>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Contexto SIESA - Resumen</h4>
            <p>Esta leccion cubre las tecnicas exactas que el equipo de QA de SIESA usa en su dia a dia
            con Azure DevOps. Los puntos mas relevantes para el contexto de SIESA son:</p>
            <ul>
                <li><strong>Variable Groups por ambiente:</strong> Separar credenciales y URLs por Dev, Staging, Prod</li>
                <li><strong>Agentes Windows:</strong> Necesarios para probar aplicaciones .NET del ERP/HCM</li>
                <li><strong>Templates YAML:</strong> Reutilizar configuraciones entre los multiples repos del equipo</li>
                <li><strong>PR validation:</strong> Bloquear merge si los smoke tests fallan</li>
                <li><strong>Regresion programada:</strong> Ejecucion diaria automatica antes del horario laboral</li>
                <li><strong>PublishTestResults:</strong> Integrar resultados directamente en Azure Test Plans</li>
            </ul>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Objetivos cumplidos en esta leccion:</h4>
            <ul>
                <li>Comprender la estructura de Azure Pipelines YAML para pruebas de Playwright</li>
                <li>Configurar pipelines en agentes Windows y Linux (Microsoft-hosted)</li>
                <li>Organizar el pipeline en stages: Build, Test, Report</li>
                <li>Gestionar secretos y variables con Variable Groups</li>
                <li>Publicar resultados JUnit con <code>PublishTestResults@2</code></li>
                <li>Publicar artefactos (reportes, screenshots, traces) con <code>PublishPipelineArtifact@1</code></li>
                <li>Configurar triggers: CI, PR validation, programados y manuales</li>
                <li>Disenar pipelines multi-etapa (Dev, QA, Staging, Prod) con gates de aprobacion</li>
                <li>Crear templates YAML reutilizables para estandarizar la configuracion del equipo</li>
            </ul>
        </div>

        <h3>Siguiente: Proyecto - Pipeline CI/CD completo</h3>
        <p>En la siguiente leccion (la leccion capstone de la Seccion 17) construiras un
        <strong>pipeline CI/CD completo end-to-end</strong> que integra Docker, GitHub Actions o Azure DevOps,
        sharding, reporting avanzado y notificaciones. Aplicaras todo lo aprendido en esta seccion
        para crear un flujo de QA automatizado de nivel produccion.</p>
    `,
    topics: ["azure-devops", "windows", "pipelines"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_115 = LESSON_115;
}
