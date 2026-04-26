/**
 * Playwright Academy - Leccion 105
 * Reportes HTML con pytest-html
 * Seccion 16: Reporting y Trace Viewer
 */

const LESSON_105 = {
    id: 105,
    title: "Reportes HTML con pytest-html",
    duration: "10 min",
    level: "advanced",
    section: "section-16",
    content: `
        <h2>Reportes HTML con pytest-html</h2>
        <p>Los reportes de pruebas son mucho mas que un archivo de resultados: son la
        <strong>ventana de visibilidad</strong> que conecta al equipo QA con stakeholders, desarrolladores
        y gerentes de proyecto. En esta leccion dominaras <code>pytest-html</code>, el plugin mas popular
        para generar reportes HTML profesionales desde pytest, integrandolo con Playwright para
        capturar screenshots, logs y metricas de cada ejecucion.</p>

        <h3>Por que importan los reportes</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Un buen reporte de testing cumple tres funciones criticas:</p>
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Funcion</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripcion</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Beneficiario</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Visibilidad</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Muestra el estado actual de calidad del sistema en un formato comprensible</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Stakeholders, Gerencia</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Trazabilidad historica</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Permite comparar ejecuciones a lo largo del tiempo y detectar regresiones</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">QA, Desarrollo</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Integracion CI/CD</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Se genera automaticamente en cada pipeline y se almacena como artefacto</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">DevOps, QA</td>
                </tr>
            </table>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>En SIESA, los reportes HTML de pruebas automatizadas son artefactos clave en los
            procesos de liberacion. Un reporte bien estructurado con screenshots de fallos
            reduce significativamente el tiempo de triaje y facilita la comunicacion con
            los equipos de desarrollo.</p>
        </div>

        <h3>Instalacion de pytest-html</h3>
        <p>El plugin <code>pytest-html</code> se instala desde PyPI y se integra automaticamente
        con pytest sin configuracion adicional.</p>

        <pre><code class="bash"># Instalar pytest-html
pip install pytest-html

# Verificar la instalacion
pip show pytest-html

# Si usas un requirements.txt, agregar:
# pytest-html>=4.1.1

# Instalacion completa para un proyecto Playwright + reportes
pip install playwright pytest pytest-playwright pytest-html</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Nota sobre versiones</h4>
            <p><code>pytest-html</code> v4.x cambio significativamente su API respecto a v3.x.
            Esta leccion cubre la <strong>version 4.x</strong>, que es la actual y recomendada.
            Si trabajas con proyectos legacy que usan v3.x, revisa la guia de migracion oficial.</p>
        </div>

        <h3>Uso basico: generar tu primer reporte</h3>
        <p>Con pytest-html instalado, basta agregar un flag en la linea de comandos para
        generar un reporte HTML completo.</p>

        <pre><code class="bash"># Generar reporte HTML basico
pytest --html=report.html

# Reporte autocontenido (CSS e imagenes embebidas en el HTML)
pytest --html=report.html --self-contained-html

# Reporte en una carpeta especifica
pytest --html=reports/test_report.html --self-contained-html

# Combinado con opciones de Playwright
pytest --html=report.html --self-contained-html --browser chromium --headed</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Buena practica: --self-contained-html</h4>
            <p>Siempre usa <code>--self-contained-html</code> para generar un archivo unico que incluye
            todos los estilos y assets embebidos. Esto permite compartir el reporte por correo,
            Slack o cualquier medio sin preocuparse por archivos CSS externos faltantes.</p>
        </div>

        <h3>Estructura del reporte generado</h3>
        <p>El reporte HTML de pytest-html contiene cuatro secciones principales:</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Seccion</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Contenido</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Header / Title</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Titulo del reporte, fecha/hora de generacion</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Environment</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Tabla con variables de entorno: Python, plataforma, plugins, etc.</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Summary</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Total de tests, passed, failed, errores, skipped, duracion total</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Results Table</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Tabla detallada con cada test: nombre, resultado, duracion, links</td>
                </tr>
            </table>
        </div>

        <pre><code class="python"># Estructura tipica de un proyecto con reportes
# proyecto_playwright/
# ├── tests/
# │   ├── conftest.py
# │   ├── test_login.py
# │   └── test_dashboard.py
# ├── reports/           # ← Carpeta de reportes (agregar a .gitignore)
# │   └── report.html
# ├── pytest.ini
# └── requirements.txt</code></pre>

        <h3>Personalizacion con conftest.py</h3>
        <p>La verdadera potencia de pytest-html se desbloquea a traves de los hooks que
        puedes implementar en <code>conftest.py</code>. Estos hooks te permiten personalizar
        cada aspecto del reporte.</p>

        <h4>Hook: Titulo personalizado del reporte</h4>
        <div class="code-tabs" data-code-id="L105-1">
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
        <pre><code class="language-python"># conftest.py
import pytest

def pytest_html_report_title(report):
    """Personaliza el titulo que aparece en el header del reporte HTML."""
    report.title = "Reporte de Pruebas - Playwright Suite"</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    reporter: [
        ['html', {
            outputFolder: 'playwright-report',
            open: 'never',
            // El titulo se personaliza en el reporte HTML integrado
        }],
    ],
});</code></pre>
        </div>
        </div>

        <h4>Hook: Agregar informacion de entorno</h4>
        <div class="code-tabs" data-code-id="L105-2">
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
        <pre><code class="language-python"># conftest.py
import pytest
import playwright
import platform
from datetime import datetime

def pytest_configure(config):
    """Agrega metadatos al reporte HTML en la seccion Environment."""
    # Acceder al objeto de metadatos del plugin html
    if hasattr(config, "_metadata"):
        config._metadata["Proyecto"] = "SIESA - Suite E2E"
        config._metadata["Navegador"] = "Chromium (Playwright)"
        config._metadata["Playwright Version"] = playwright.__version__
        config._metadata["Plataforma"] = platform.platform()
        config._metadata["Python"] = platform.python_version()
        config._metadata["Fecha de ejecucion"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        config._metadata["Ambiente"] = "QA"</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">// playwright.config.ts
import { defineConfig } from '@playwright/test';
import os from 'os';

export default defineConfig({
    // Metadatos se exponen como variables de entorno o en el config
    metadata: {
        proyecto: 'SIESA - Suite E2E',
        navegador: 'Chromium (Playwright)',
        plataforma: os.platform() + ' ' + os.release(),
        nodeVersion: process.version,
        fechaEjecucion: new Date().toISOString(),
        ambiente: process.env.TEST_ENV ?? 'QA',
    },
    reporter: [
        ['html', { open: 'never' }],
    ],
});</code></pre>
        </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>En la seccion Environment del reporte, incluye siempre el <strong>ambiente de pruebas</strong>
            (QA, Staging, Pre-produccion), la <strong>version del aplicativo</strong> y el
            <strong>navegador utilizado</strong>. Esto facilita la trazabilidad cuando se revisan
            reportes historicos.</p>
        </div>

        <h3>Agregar columnas extras a la tabla de resultados</h3>
        <p>Puedes extender la tabla de resultados con columnas personalizadas usando
        los hooks de pytest-html v4.x.</p>

        <div class="code-tabs" data-code-id="L105-3">
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
        <pre><code class="language-python"># conftest.py
import pytest
from datetime import datetime

# --- Agregar columna de descripcion desde el docstring ---
def pytest_html_results_table_header(cells):
    """Agrega encabezados personalizados a la tabla de resultados."""
    cells.insert(2, '&lt;th&gt;Descripcion&lt;/th&gt;')
    cells.insert(1, '&lt;th class="sortable time" data-column-type="time"&gt;Hora&lt;/th&gt;')

def pytest_html_results_table_row(report, cells):
    """Agrega datos a las columnas personalizadas para cada fila."""
    cells.insert(2, f'&lt;td&gt;{report.description}&lt;/td&gt;')
    cells.insert(1, f'&lt;td class="col-time"&gt;{datetime.utcnow().strftime("%H:%M:%S")}&lt;/td&gt;')

@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Extrae el docstring del test y lo agrega al reporte."""
    outcome = yield
    report = outcome.get_result()
    # Usar el docstring del test como descripcion
    report.description = str(item.function.__doc__ or "")</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">// playwright.config.ts
// Playwright HTML reporter incluye automaticamente detalles de cada test.
// Para agregar anotaciones personalizadas, usa test.info().annotations:

import { test, expect } from '@playwright/test';

test('ejemplo con anotacion', async ({ page }) => {
    // Agregar descripcion como anotacion visible en el reporte
    test.info().annotations.push({
        type: 'Descripcion',
        description: 'Verifica que el login funciona correctamente',
    });

    await page.goto('/login');
    // ...
});

// Para agregar metadatos globales, usa un reporter personalizado:
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    reporter: [
        ['html', { open: 'never' }],
        // Reporter personalizado para metadatos extra
        ['./custom-reporter.ts'],
    ],
});</code></pre>
        </div>
        </div>

        <h3>Embeber screenshots en el reporte</h3>
        <p>Esta es la funcionalidad mas valiosa para QA: capturar automaticamente un screenshot
        cuando un test falla y embeber la imagen directamente en el reporte HTML.</p>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tecnica avanzada: Screenshots en base64</h4>
            <p>Al codificar el screenshot en base64, se embebe directamente en el HTML sin necesidad
            de archivos de imagen externos. Combinado con <code>--self-contained-html</code>, el
            reporte es un archivo unico completamente portable.</p>
        </div>

        <div class="code-tabs" data-code-id="L105-4">
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
        <pre><code class="language-python"># conftest.py
import pytest
import base64
from playwright.sync_api import Page

@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Captura screenshot en fallo y lo embebe en el reporte HTML."""
    outcome = yield
    report = outcome.get_result()

    # Solo capturar screenshot cuando el test falla en la fase de ejecucion
    if report.when == "call" and report.failed:
        # Obtener la instancia de page del test
        page = item.funcargs.get("page", None)
        if page is not None:
            # Capturar screenshot como bytes
            screenshot_bytes = page.screenshot(full_page=True)
            # Codificar en base64
            screenshot_b64 = base64.b64encode(screenshot_bytes).decode("utf-8")
            # Crear el HTML con la imagen embebida
            extra_html = (
                f'&lt;div&gt;'
                f'&lt;img src="data:image/png;base64,{screenshot_b64}" '
                f'style="max-width: 800px; border: 2px solid #e53935; '
                f'border-radius: 4px; margin: 10px 0;" '
                f'alt="Screenshot del fallo"&gt;'
                f'&lt;/div&gt;'
            )
            # Agregar como extra al reporte
            if not hasattr(report, "extras"):
                report.extras = []
            report.extras.append(
                pytest_html.extras.html(extra_html)
            )</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">// playwright.config.ts
// Playwright captura screenshots automaticamente en fallo
import { defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        // Screenshot automatico solo en fallo
        screenshot: 'only-on-failure',
        // Traza completa en fallo (incluye screenshots, DOM, network)
        trace: 'retain-on-failure',
    },
    reporter: [
        ['html', { open: 'never' }],
    ],
});

// Si necesitas screenshot manual con logica personalizada:
// test-helpers.ts
import { test, Page } from '@playwright/test';

test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
        // Capturar screenshot en fallo
        const screenshotBuffer = await page.screenshot({ fullPage: true });
        // Adjuntar al reporte HTML de Playwright
        await testInfo.attach('screenshot-del-fallo', {
            body: screenshotBuffer,
            contentType: 'image/png',
        });
    }
});</code></pre>
        </div>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Enfoque simplificado con pytest-html extras</h4>
            <p>pytest-html provee un modulo <code>extras</code> con helpers para agregar contenido
            al reporte de forma mas limpia.</p>
        </div>

        <div class="code-tabs" data-code-id="L105-5">
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
        <pre><code class="language-python"># conftest.py - Version limpia y completa
import pytest
from pytest_html import extras
from playwright.sync_api import Page
import base64

@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """
    Hook que se ejecuta despues de cada fase del test (setup, call, teardown).
    Captura screenshot automatico en caso de fallo.
    """
    outcome = yield
    report = outcome.get_result()
    extra = getattr(report, "extras", [])

    if report.when == "call":
        page: Page = item.funcargs.get("page", None)

        if report.failed and page is not None:
            # Screenshot como base64 embebido
            screenshot_bytes = page.screenshot(full_page=True)
            screenshot_b64 = base64.b64encode(screenshot_bytes).decode("utf-8")

            # Agregar screenshot como imagen embebida
            extra.append(extras.image(screenshot_b64, mime_type="image/png"))

            # Tambien agregar la URL actual como informacion extra
            extra.append(extras.url(page.url, name="URL al momento del fallo"))

        # Agregar extras independientemente del resultado
        report.extras = extra</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">// tests/base.test.ts - Version limpia y completa
import { test, Page } from '@playwright/test';

// Hook afterEach: se ejecuta despues de cada test
// Captura screenshot automatico en caso de fallo
test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
        // Screenshot como buffer adjunto al reporte
        const screenshotBuffer = await page.screenshot({ fullPage: true });

        // Agregar screenshot como imagen adjunta
        await testInfo.attach('screenshot-fallo', {
            body: screenshotBuffer,
            contentType: 'image/png',
        });

        // Tambien agregar la URL actual como informacion extra
        await testInfo.attach('url-del-fallo', {
            body: page.url(),
            contentType: 'text/plain',
        });
    }
});</code></pre>
        </div>
        </div>

        <h3>Agregar informacion del entorno al reporte</h3>
        <div class="code-tabs" data-code-id="L105-6">
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
        <pre><code class="language-python"># conftest.py
import pytest
import platform
import os

def pytest_configure(config):
    """Configura metadatos de entorno para el reporte HTML."""
    if hasattr(config, "_metadata"):
        # Informacion del sistema
        config._metadata["SO"] = platform.system() + " " + platform.release()
        config._metadata["Python"] = platform.python_version()

        # Informacion del proyecto
        config._metadata["Ambiente"] = os.environ.get("TEST_ENV", "local")
        config._metadata["Base URL"] = os.environ.get("BASE_URL", "http://localhost:3000")
        config._metadata["Navegador"] = os.environ.get("BROWSER", "chromium")

        # Limpiar metadatos que no queremos mostrar
        # (pytest-html agrega algunos automaticamente)
        for key in ["JAVA_HOME", "Packages"]:
            if key in config._metadata:
                del config._metadata[key]</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">// playwright.config.ts
import { defineConfig } from '@playwright/test';
import os from 'os';

export default defineConfig({
    metadata: {
        // Informacion del sistema
        so: os.platform() + ' ' + os.release(),
        nodeVersion: process.version,

        // Informacion del proyecto
        ambiente: process.env.TEST_ENV ?? 'local',
        baseUrl: process.env.BASE_URL ?? 'http://localhost:3000',
        navegador: process.env.BROWSER ?? 'chromium',
    },
    reporter: [
        ['html', { open: 'never' }],
    ],
});</code></pre>
        </div>
        </div>

        <h3>CSS personalizado para el reporte</h3>
        <p>Puedes aplicar estilos CSS personalizados para que el reporte refleje la identidad
        visual de tu organizacion o equipo.</p>

        <div class="code-tabs" data-code-id="L105-7">
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
        <pre><code class="language-python"># conftest.py
import pytest

def pytest_html_report_title(report):
    report.title = "SIESA QA - Reporte de Pruebas E2E"

@pytest.hookimpl(optionalhook=True)
def pytest_html_results_summary(prefix, summary, postfix):
    """Agrega contenido personalizado al resumen del reporte."""
    prefix.extend([
        "&lt;p&gt;Suite de pruebas automatizadas con Playwright + Python&lt;/p&gt;",
        "&lt;p&gt;Equipo: Procesos y Calidad de Software - SIESA&lt;/p&gt;"
    ])</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">// playwright.config.ts
// En Playwright, la personalizacion del reporte HTML se hace
// via metadata y un reporter personalizado

import { defineConfig } from '@playwright/test';

export default defineConfig({
    metadata: {
        titulo: 'SIESA QA - Reporte de Pruebas E2E',
        descripcion: 'Suite de pruebas automatizadas con Playwright + TypeScript',
        equipo: 'Procesos y Calidad de Software - SIESA',
    },
    reporter: [
        ['html', {
            open: 'never',
            outputFolder: 'playwright-report',
        }],
    ],
});</code></pre>
        </div>
        </div>

        <pre><code class="css">/* assets/report_style.css - CSS personalizado para el reporte */
/* Aplicar via pytest.ini: --css=assets/report_style.css */

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
    color: #009688;  /* Teal SIESA */
    border-bottom: 3px solid #009688;
    padding-bottom: 10px;
}

/* Resaltar filas de tests fallidos */
#results-table tbody tr.failed {
    background-color: #ffebee;
}

/* Resaltar filas de tests exitosos */
#results-table tbody tr.passed {
    background-color: #e8f5e9;
}

/* Estilo para la tabla de entorno */
#environment td {
    padding: 6px 12px;
}

/* Estilo para screenshots embebidos */
.extras img {
    max-width: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin: 8px 0;
}</code></pre>

        <pre><code class="bash"># Aplicar CSS personalizado al generar el reporte
pytest --html=report.html --self-contained-html --css=assets/report_style.css

# Tambien se puede configurar en pytest.ini
# [pytest]
# addopts = --html=reports/report.html --self-contained-html --css=assets/report_style.css</code></pre>

        <h3>Captura de console logs y adjuntar al reporte</h3>
        <p>Ademas de screenshots, puedes capturar los logs de la consola del navegador
        y adjuntarlos al reporte para facilitar el debugging.</p>

        <div class="code-tabs" data-code-id="L105-8">
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
        <pre><code class="language-python"># conftest.py
import pytest
from pytest_html import extras
from playwright.sync_api import Page
import base64

@pytest.fixture(autouse=True)
def capturar_console_logs(page: Page, request):
    """Fixture que captura los logs de consola del navegador."""
    console_messages = []

    # Listener para mensajes de consola
    page.on("console", lambda msg: console_messages.append(
        f"[{msg.type}] {msg.text}"
    ))

    yield  # Ejecutar el test

    # Despues del test, adjuntar logs si hay mensajes
    if console_messages:
        logs_text = "\\n".join(console_messages)
        # Obtener el reporte actual
        if hasattr(request.node, "_report_sections"):
            request.node._report_sections.append(
                ("Console Logs", logs_text)
            )

@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Agrega console logs y screenshot al reporte."""
    outcome = yield
    report = outcome.get_result()
    extra = getattr(report, "extras", [])

    if report.when == "call":
        page: Page = item.funcargs.get("page", None)

        # Adjuntar screenshot en caso de fallo
        if report.failed and page is not None:
            screenshot_bytes = page.screenshot(full_page=True)
            screenshot_b64 = base64.b64encode(screenshot_bytes).decode("utf-8")
            extra.append(extras.image(screenshot_b64, mime_type="image/png"))
            extra.append(extras.url(page.url, name="URL del fallo"))

        # Adjuntar console logs como texto extra
        console_logs = getattr(item, "_console_logs", None)
        if console_logs:
            extra.append(extras.text("\\n".join(console_logs), name="Console Logs"))

        report.extras = extra</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">// tests/base.fixture.ts
import { test as base, Page } from '@playwright/test';

// Fixture personalizado que captura console logs
type ConsoleFixture = { consoleLogs: string[] };

export const test = base.extend&lt;ConsoleFixture&gt;({
    consoleLogs: [async ({}, use) => {
        const logs: string[] = [];
        await use(logs);
    }, { scope: 'test' }],
});

// Capturar mensajes de consola y adjuntar al reporte
test.beforeEach(async ({ page, consoleLogs }) => {
    page.on('console', (msg) => {
        consoleLogs.push(\`[\${msg.type()}] \${msg.text()}\`);
    });
});

test.afterEach(async ({ page, consoleLogs }, testInfo) => {
    // Adjuntar screenshot en caso de fallo
    if (testInfo.status !== testInfo.expectedStatus) {
        const screenshotBuffer = await page.screenshot({ fullPage: true });
        await testInfo.attach('screenshot-fallo', {
            body: screenshotBuffer,
            contentType: 'image/png',
        });
        await testInfo.attach('url-del-fallo', {
            body: page.url(),
            contentType: 'text/plain',
        });
    }

    // Adjuntar console logs como texto extra
    if (consoleLogs.length > 0) {
        await testInfo.attach('console-logs', {
            body: consoleLogs.join('\\n'),
            contentType: 'text/plain',
        });
    }
});</code></pre>
        </div>
        </div>

        <h3>Generar reportes por suite o modulo</h3>
        <p>En proyectos grandes, es util generar reportes separados por modulo, feature
        o suite de pruebas.</p>

        <pre><code class="bash"># Reporte solo para tests de login
pytest tests/test_login.py --html=reports/login_report.html --self-contained-html

# Reporte por carpeta/modulo
pytest tests/e2e/ --html=reports/e2e_report.html --self-contained-html
pytest tests/smoke/ --html=reports/smoke_report.html --self-contained-html

# Reporte con marca/etiqueta especifica
pytest -m smoke --html=reports/smoke_report.html --self-contained-html
pytest -m "not slow" --html=reports/fast_report.html --self-contained-html

# Reporte con timestamp en el nombre (evitar sobrescrituras)
pytest --html=reports/report_$(date +%Y%m%d_%H%M%S).html --self-contained-html</code></pre>

        <div class="code-tabs" data-code-id="L105-9">
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
        <pre><code class="language-python"># conftest.py - Nombre de reporte dinamico con timestamp
import pytest
from datetime import datetime

def pytest_configure(config):
    """Configura nombre de reporte con timestamp si no se especifico."""
    if not config.option.htmlpath:
        now = datetime.now().strftime("%Y%m%d_%H%M%S")
        config.option.htmlpath = f"reports/report_{now}.html"
        config.option.self_contained_html = True</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">// playwright.config.ts - Carpeta de reporte dinamica con timestamp
import { defineConfig } from '@playwright/test';

const now = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

export default defineConfig({
    reporter: [
        ['html', {
            outputFolder: \`playwright-report/report_\${now}\`,
            open: 'never',
        }],
    ],
});</code></pre>
        </div>
        </div>

        <h3>Integracion con CI/CD</h3>
        <p>En un pipeline de CI/CD, el reporte HTML se genera automaticamente y se
        almacena como artefacto descargable.</p>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Configuracion avanzada: CI pipelines</h4>
            <p>Los reportes HTML son artefactos ideales para CI porque son archivos estaticos,
            autocontenidos y pueden ser servidos directamente como paginas web.</p>
        </div>

        <pre><code class="yaml"># .github/workflows/tests.yml - GitHub Actions
name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install playwright pytest pytest-playwright pytest-html
          playwright install --with-deps chromium

      - name: Run tests
        run: |
          pytest --html=reports/report.html --self-contained-html

      - name: Upload test report
        uses: actions/upload-artifact@v4
        if: always()  # Subir reporte incluso si los tests fallan
        with:
          name: playwright-test-report
          path: reports/report.html
          retention-days: 30</code></pre>

        <pre><code class="yaml"># azure-pipelines.yml - Azure DevOps
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: UsePythonVersion@0
    inputs:
      versionSpec: '3.11'

  - script: |
      pip install playwright pytest pytest-playwright pytest-html
      playwright install --with-deps chromium
    displayName: 'Install dependencies'

  - script: |
      pytest --html=reports/report.html --self-contained-html --junitxml=reports/results.xml
    displayName: 'Run Playwright tests'
    continueOnError: true

  - task: PublishTestResults@2
    inputs:
      testResultsFormat: 'JUnit'
      testResultsFiles: 'reports/results.xml'
    condition: always()

  - task: PublishBuildArtifacts@1
    inputs:
      pathToPublish: 'reports/report.html'
      artifactName: 'TestReport'
    condition: always()</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>Configura tu pipeline para guardar los reportes con un <strong>retention period</strong>
            de al menos 30 dias. Esto permite revisar reportes historicos cuando se investigan
            regresiones. Ademas, usa <code>if: always()</code> (GitHub Actions) o
            <code>condition: always()</code> (Azure DevOps) para que el reporte se suba incluso
            cuando hay tests fallidos, que es precisamente cuando mas se necesita.</p>
        </div>

        <h3>Configuracion completa en pytest.ini</h3>
        <p>Para evitar escribir flags repetitivos en la linea de comandos, centraliza la
        configuracion en <code>pytest.ini</code>.</p>

        <pre><code class="ini"># pytest.ini
[pytest]
addopts =
    --html=reports/report.html
    --self-contained-html
    --css=assets/report_style.css
    -v

# Alternativamente en pyproject.toml
# [tool.pytest.ini_options]
# addopts = "--html=reports/report.html --self-contained-html -v"</code></pre>

        <h3>Ejemplo integrador completo</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>A continuacion, un <code>conftest.py</code> completo que integra todas las
            personalizaciones vistas en esta leccion: titulo, entorno, screenshots en fallo,
            console logs y columnas extra.</p>
        </div>

        <div class="code-tabs" data-code-id="L105-10">
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
        <pre><code class="language-python"># conftest.py - Configuracion completa de reportes con pytest-html
import pytest
import base64
import platform
import os
from datetime import datetime
from pytest_html import extras
from playwright.sync_api import Page

# ============================================================
# 1. TITULO Y METADATOS DEL REPORTE
# ============================================================

def pytest_html_report_title(report):
    """Titulo personalizado del reporte."""
    report.title = "SIESA QA - Reporte de Pruebas Automatizadas"

def pytest_configure(config):
    """Metadatos de entorno."""
    if hasattr(config, "_metadata"):
        config._metadata["Proyecto"] = "SIESA - Suite E2E"
        config._metadata["Ambiente"] = os.environ.get("TEST_ENV", "QA")
        config._metadata["Base URL"] = os.environ.get("BASE_URL", "https://qa.siesa.com")
        config._metadata["Navegador"] = os.environ.get("BROWSER", "chromium")
        config._metadata["Python"] = platform.python_version()
        config._metadata["SO"] = platform.platform()
        config._metadata["Ejecutado"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# ============================================================
# 2. COLUMNAS EXTRA EN LA TABLA DE RESULTADOS
# ============================================================

def pytest_html_results_table_header(cells):
    """Agrega columna de descripcion al encabezado."""
    cells.insert(2, "&lt;th&gt;Descripcion&lt;/th&gt;")

def pytest_html_results_table_row(report, cells):
    """Agrega la descripcion del test a cada fila."""
    cells.insert(2, f"&lt;td&gt;{report.description}&lt;/td&gt;")

# ============================================================
# 3. SCREENSHOTS, CONSOLE LOGS Y EXTRAS
# ============================================================

@pytest.fixture(autouse=True)
def _capturar_console_logs(page: Page, request):
    """Captura mensajes de consola del navegador durante el test."""
    logs = []
    page.on("console", lambda msg: logs.append(f"[{msg.type}] {msg.text}"))
    yield
    request.node._console_logs = logs

@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Hook principal: screenshot en fallo + console logs + descripcion."""
    outcome = yield
    report = outcome.get_result()
    extra = getattr(report, "extras", [])
    report.description = str(item.function.__doc__ or "Sin descripcion")

    if report.when == "call":
        page: Page = item.funcargs.get("page", None)

        # Screenshot automatico en caso de fallo
        if report.failed and page is not None:
            try:
                screenshot_bytes = page.screenshot(full_page=True)
                screenshot_b64 = base64.b64encode(screenshot_bytes).decode("utf-8")
                extra.append(extras.image(screenshot_b64, mime_type="image/png"))
                extra.append(extras.url(page.url, name="URL del fallo"))
            except Exception:
                extra.append(extras.text("No se pudo capturar screenshot"))

        # Console logs (disponibles para todos los tests)
        console_logs = getattr(item, "_console_logs", [])
        if console_logs:
            extra.append(extras.text("\\n".join(console_logs), name="Console Logs"))

        report.extras = extra</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">// playwright.config.ts - Configuracion completa de reportes
import { defineConfig } from '@playwright/test';
import os from 'os';

// ============================================================
// 1. METADATOS Y REPORTER
// ============================================================

export default defineConfig({
    metadata: {
        proyecto: 'SIESA - Suite E2E',
        ambiente: process.env.TEST_ENV ?? 'QA',
        baseUrl: process.env.BASE_URL ?? 'https://qa.siesa.com',
        navegador: process.env.BROWSER ?? 'chromium',
        nodeVersion: process.version,
        so: os.platform() + ' ' + os.release(),
        ejecutado: new Date().toISOString(),
    },
    use: {
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },
    reporter: [
        ['html', { open: 'never' }],
    ],
});

// ============================================================
// tests/base.fixture.ts - Screenshots, console logs y extras
// ============================================================
import { test as base, Page } from '@playwright/test';

export const test = base.extend&lt;{ consoleLogs: string[] }&gt;({
    consoleLogs: [async ({}, use) => {
        const logs: string[] = [];
        await use(logs);
    }, { scope: 'test' }],
});

// ============================================================
// 2. CAPTURA DE CONSOLE LOGS
// ============================================================

test.beforeEach(async ({ page, consoleLogs }) => {
    // Captura mensajes de consola del navegador durante el test
    page.on('console', (msg) => {
        consoleLogs.push(\`[\${msg.type()}] \${msg.text()}\`);
    });
});

// ============================================================
// 3. SCREENSHOTS, CONSOLE LOGS Y EXTRAS (afterEach)
// ============================================================

test.afterEach(async ({ page, consoleLogs }, testInfo) => {
    // Screenshot automatico en caso de fallo
    if (testInfo.status !== testInfo.expectedStatus) {
        try {
            const screenshotBuffer = await page.screenshot({ fullPage: true });
            await testInfo.attach('screenshot-fallo', {
                body: screenshotBuffer,
                contentType: 'image/png',
            });
            await testInfo.attach('url-del-fallo', {
                body: page.url(),
                contentType: 'text/plain',
            });
        } catch {
            await testInfo.attach('error-screenshot', {
                body: 'No se pudo capturar screenshot',
                contentType: 'text/plain',
            });
        }
    }

    // Console logs (disponibles para todos los tests)
    if (consoleLogs.length > 0) {
        await testInfo.attach('console-logs', {
            body: consoleLogs.join('\\n'),
            contentType: 'text/plain',
        });
    }
});</code></pre>
        </div>
        </div>

        <div class="code-tabs" data-code-id="L105-11">
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
        <pre><code class="language-python"># tests/test_login.py - Test de ejemplo que genera reporte completo
from playwright.sync_api import Page, expect

def test_login_exitoso(page: Page):
    """Verifica que un usuario valido puede iniciar sesion correctamente."""
    page.goto("/login")
    page.get_by_label("Email").fill("usuario@siesa.com")
    page.get_by_label("Contrasena").fill("password123")
    page.get_by_role("button", name="Iniciar sesion").click()

    expect(page.get_by_role("heading", name="Dashboard")).to_be_visible()

def test_login_credenciales_invalidas(page: Page):
    """Verifica que se muestra error con credenciales incorrectas."""
    page.goto("/login")
    page.get_by_label("Email").fill("invalido@test.com")
    page.get_by_label("Contrasena").fill("wrong_password")
    page.get_by_role("button", name="Iniciar sesion").click()

    expect(page.get_by_text("Credenciales invalidas")).to_be_visible()

def test_login_campo_vacio(page: Page):
    """Verifica validacion de campos obligatorios en el formulario de login."""
    page.goto("/login")
    page.get_by_role("button", name="Iniciar sesion").click()

    expect(page.get_by_text("El email es obligatorio")).to_be_visible()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">// tests/login.spec.ts - Test de ejemplo que genera reporte completo
import { test, expect } from '@playwright/test';

test('login exitoso', async ({ page }) => {
    // Verifica que un usuario valido puede iniciar sesion correctamente
    await page.goto('/login');
    await page.getByLabel('Email').fill('usuario@siesa.com');
    await page.getByLabel('Contrasena').fill('password123');
    await page.getByRole('button', { name: 'Iniciar sesion' }).click();

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

test('login credenciales invalidas', async ({ page }) => {
    // Verifica que se muestra error con credenciales incorrectas
    await page.goto('/login');
    await page.getByLabel('Email').fill('invalido@test.com');
    await page.getByLabel('Contrasena').fill('wrong_password');
    await page.getByRole('button', { name: 'Iniciar sesion' }).click();

    await expect(page.getByText('Credenciales invalidas')).toBeVisible();
});

test('login campo vacio', async ({ page }) => {
    // Verifica validacion de campos obligatorios en el formulario de login
    await page.goto('/login');
    await page.getByRole('button', { name: 'Iniciar sesion' }).click();

    await expect(page.getByText('El email es obligatorio')).toBeVisible();
});</code></pre>
        </div>
        </div>

        <pre><code class="bash"># Ejecutar y generar reporte completo
pytest tests/test_login.py --html=reports/login_report.html --self-contained-html -v

# El reporte incluira:
# - Titulo: "SIESA QA - Reporte de Pruebas Automatizadas"
# - Seccion Environment con proyecto, ambiente, navegador, etc.
# - Tabla con columna extra "Descripcion" (desde docstrings)
# - Screenshots embebidos para los tests que fallen
# - Console logs del navegador adjuntos a cada test</code></pre>

        <h3>Ejercicio practico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Ejercicio: Configura reportes HTML profesionales</h4>
            <p>Crea un proyecto con la siguiente estructura y configuracion de reportes:</p>

            <p><strong>Paso 1:</strong> Crea la estructura del proyecto.</p>
            <pre><code class="bash">mkdir -p proyecto_reportes/tests
mkdir -p proyecto_reportes/reports
mkdir -p proyecto_reportes/assets
cd proyecto_reportes
pip install playwright pytest pytest-playwright pytest-html
playwright install chromium</code></pre>

            <p><strong>Paso 2:</strong> Crea el <code>conftest.py</code> con estas personalizaciones:</p>
            <ul>
                <li>Titulo del reporte: "Mi Proyecto - Reporte QA"</li>
                <li>Metadatos de entorno: Proyecto, Ambiente, Navegador, Fecha</li>
                <li>Screenshot automatico en base64 para tests fallidos</li>
                <li>Captura de console logs del navegador</li>
            </ul>

            <p><strong>Paso 3:</strong> Crea un archivo de test con al menos 3 tests.</p>
            <div class="code-tabs" data-code-id="L105-12">
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
            <pre><code class="language-python"># tests/test_ejercicio.py
from playwright.sync_api import Page, expect

def test_pagina_carga(page: Page):
    """Verifica que la pagina principal carga correctamente."""
    page.goto("https://the-internet.herokuapp.com")
    expect(page.get_by_role("heading", name="Welcome")).to_be_visible()

def test_navegacion_links(page: Page):
    """Verifica que los links de navegacion funcionan."""
    page.goto("https://the-internet.herokuapp.com")
    page.get_by_role("link", name="Form Authentication").click()
    expect(page.get_by_role("heading", name="Login Page")).to_be_visible()

def test_fallo_intencional(page: Page):
    """Este test falla a proposito para verificar el screenshot en el reporte."""
    page.goto("https://the-internet.herokuapp.com")
    # Este assertion fallara y generara screenshot
    expect(page.get_by_text("Este texto no existe en la pagina")).to_be_visible(timeout=3000)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// tests/ejercicio.spec.ts
import { test, expect } from '@playwright/test';

test('pagina carga', async ({ page }) => {
    // Verifica que la pagina principal carga correctamente
    await page.goto('https://the-internet.herokuapp.com');
    await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
});

test('navegacion links', async ({ page }) => {
    // Verifica que los links de navegacion funcionan
    await page.goto('https://the-internet.herokuapp.com');
    await page.getByRole('link', { name: 'Form Authentication' }).click();
    await expect(page.getByRole('heading', { name: 'Login Page' })).toBeVisible();
});

test('fallo intencional', async ({ page }) => {
    // Este test falla a proposito para verificar el screenshot en el reporte
    await page.goto('https://the-internet.herokuapp.com');
    // Este assertion fallara y generara screenshot
    await expect(page.getByText('Este texto no existe en la pagina'))
        .toBeVisible({ timeout: 3000 });
});</code></pre>
            </div>
            </div>

            <p><strong>Paso 4:</strong> Configura <code>pytest.ini</code>.</p>
            <pre><code class="ini"># pytest.ini
[pytest]
addopts = --html=reports/report.html --self-contained-html -v</code></pre>

            <p><strong>Paso 5:</strong> Ejecuta los tests y revisa el reporte generado.</p>
            <pre><code class="bash"># Ejecutar tests
pytest

# Abrir el reporte (Windows)
start reports/report.html

# Abrir el reporte (macOS)
open reports/report.html

# Abrir el reporte (Linux)
xdg-open reports/report.html</code></pre>

            <p><strong>Verificacion:</strong> El reporte debe contener:</p>
            <ul>
                <li>Titulo personalizado en el header</li>
                <li>Tabla de entorno con metadatos del proyecto</li>
                <li>2 tests passed (verde) y 1 test failed (rojo)</li>
                <li>Screenshot embebido en el test fallido</li>
                <li>URL del fallo como enlace clickeable</li>
            </ul>
        </div>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Errores comunes a evitar</h4>
            <ul>
                <li><strong>Olvidar --self-contained-html:</strong> Sin este flag, el CSS se genera como archivo separado y el reporte no se ve correctamente al compartirlo.</li>
                <li><strong>No usar <code>if: always()</code> en CI:</strong> Si los tests fallan, el pipeline se detiene y el reporte no se sube como artefacto.</li>
                <li><strong>Sobrescribir reportes:</strong> Usa timestamp en el nombre del archivo para mantener historial.</li>
                <li><strong>Screenshots demasiado grandes:</strong> Usa <code>full_page=False</code> si la pagina es muy larga y el reporte crece excesivamente.</li>
                <li><strong>Mezclar API de v3.x y v4.x:</strong> Los hooks cambiaron entre versiones; verifica tu version con <code>pip show pytest-html</code>.</li>
            </ul>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Objetivos de esta leccion:</h4>
            <ul>
                <li>Instalar y configurar <code>pytest-html</code> para generar reportes HTML profesionales</li>
                <li>Personalizar el titulo, entorno y columnas del reporte via hooks en conftest.py</li>
                <li>Embeber screenshots en base64 automaticamente cuando los tests fallan</li>
                <li>Capturar console logs del navegador y adjuntarlos al reporte</li>
                <li>Aplicar CSS personalizado para reportes con identidad de marca</li>
                <li>Integrar la generacion de reportes en pipelines CI/CD (GitHub Actions, Azure DevOps)</li>
                <li>Configurar <code>pytest.ini</code> para centralizar las opciones de reporte</li>
            </ul>
        </div>

        <h3>Siguiente: Allure Reports para Playwright</h3>
        <p>En la proxima leccion exploraremos <strong>Allure</strong>, un framework de reportes
        mas avanzado que ofrece dashboards interactivos, categorias de defectos, historiales
        de tendencias y graficos detallados para suites de pruebas a gran escala.</p>
    `,
    topics: ["reporting", "html", "pytest-html"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 10,
    difficulty: "medium",
    type: "foundation"
};

if (typeof window !== 'undefined') {
    window.LESSON_105 = LESSON_105;
}
