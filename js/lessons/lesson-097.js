/**
 * Playwright Academy - Lección 097
 * Análisis de fallos con screenshots y videos
 * Sección 14: Debugging: Inspector, Trace, Codegen
 */

const LESSON_097 = {
    id: 97,
    title: "Análisis de fallos con screenshots y videos",
    duration: "7 min",
    level: "intermediate",
    section: "section-14",
    content: `
        <h2>📸 Análisis de fallos con screenshots y videos</h2>
        <p>Cuando un test falla en CI/CD o en un entorno remoto, no puedes sentarte frente al navegador
        a observar qué ocurrió. Los <strong>screenshots</strong> y <strong>videos</strong> son tus ojos:
        capturan el estado exacto de la aplicación en el momento del fallo, permitiéndote diagnosticar
        problemas sin necesidad de reproducirlos manualmente.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎯 Objetivo de la lección</h4>
            <p>Dominar la captura de <strong>screenshots</strong> y <strong>videos</strong> en Playwright con Python
            para construir un sistema completo de recolección de artefactos que facilite el análisis
            de fallos en cualquier entorno de ejecución.</p>
        </div>

        <h3>🔍 ¿Por qué son esenciales screenshots y videos?</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Los artefactos visuales resuelven problemas que los logs por sí solos no pueden:</p>
            <ul>
                <li><strong>Screenshots:</strong> Capturan el estado visual exacto — un elemento oculto, un overlay bloqueante, un mensaje de error inesperado</li>
                <li><strong>Videos:</strong> Muestran la secuencia completa de eventos — cómo se llegó al fallo, timings, animaciones</li>
                <li><strong>Reproducibilidad:</strong> Eliminan el temido "en mi máquina funciona" al mostrar exactamente lo que vio el test</li>
                <li><strong>Eficiencia:</strong> Reducen el tiempo de diagnóstico de horas a minutos</li>
            </ul>
            <p>En SIESA, donde los tests se ejecutan en pipelines de Azure DevOps contra múltiples entornos
            (desarrollo, QA, staging), tener artefactos visuales del fallo es la diferencia entre
            resolver un bug en 10 minutos o en medio día.</p>
        </div>

        <h3>📷 Captura básica de screenshots</h3>
        <p>Playwright ofrece múltiples formas de capturar screenshots, desde lo más simple hasta
        capturas específicas de elementos.</p>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Screenshot básico del viewport</h4>
            <pre><code class="python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://mi-app.com/dashboard")

    # Screenshot del viewport visible
    page.screenshot(path="screenshot.png")

    # Screenshot en formato JPEG (menor tamaño)
    page.screenshot(path="screenshot.jpg", quality=80)

    # Screenshot como bytes (útil para adjuntar a reportes)
    screenshot_bytes = page.screenshot()

    browser.close()</code></pre>
        </div>

        <h3>📐 Screenshots de página completa</h3>
        <p>Cuando la página tiene scroll, el screenshot básico solo captura lo visible. Con
        <code>full_page=True</code> se captura <strong>todo el contenido</strong>, incluyendo lo que
        está fuera del viewport.</p>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Screenshot de página completa</h4>
            <pre><code class="python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://mi-app.com/reportes")

    # Captura TODO el contenido, incluyendo scroll
    page.screenshot(path="pagina_completa.png", full_page=True)

    # Útil para formularios largos, tablas extensas, dashboards
    page.screenshot(
        path="reporte_completo.png",
        full_page=True,
        type="png"  # "png" o "jpeg"
    )

    browser.close()</code></pre>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>Para reportes de ERP con tablas de datos extensas (como listados de nómina o inventarios),
            usa <code>full_page=True</code> para capturar toda la tabla. Esto permite verificar visualmente
            que los datos se renderizan correctamente sin necesidad de hacer scroll manualmente.</p>
        </div>

        <h3>🎯 Screenshots de elementos específicos</h3>
        <p>En lugar de capturar toda la página, puedes tomar un screenshot de un solo elemento.
        Esto es ideal para verificar componentes específicos.</p>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Screenshot de un locator</h4>
            <pre><code class="python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://mi-app.com/dashboard")

    # Screenshot de un elemento específico
    page.locator(".grafico-ventas").screenshot(path="grafico.png")

    # Screenshot de una tabla de resultados
    page.locator("table.resultados").screenshot(path="tabla.png")

    # Screenshot de un formulario con error
    page.locator("form#registro").screenshot(path="formulario_error.png")

    # Screenshot del header de navegación
    page.locator("nav.main-nav").screenshot(
        path="navegacion.png",
        type="png"
    )

    browser.close()</code></pre>
        </div>

        <h3>⚡ Screenshots automáticos al fallar</h3>
        <p>Lo más poderoso es capturar screenshots <strong>automáticamente</strong> cuando un test falla.
        Esto se logra con fixtures de pytest que detectan el resultado del test.</p>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>❌ Sin captura automática — información perdida</h4>
            <pre><code class="python"># tests/test_login.py
def test_login_invalido(page):
    page.goto("https://mi-app.com/login")
    page.fill("#email", "usuario@siesa.com")
    page.fill("#password", "clave_incorrecta")
    page.click("button[type='submit']")

    # Si esto falla... ¿qué se veía en pantalla?
    # No hay screenshot, no hay forma de saber
    assert page.locator(".error-message").is_visible()</code></pre>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Con fixture de captura automática en conftest.py</h4>
            <pre><code class="python"># tests/conftest.py
import pytest
from pathlib import Path
from datetime import datetime


@pytest.fixture(autouse=True)
def screenshot_on_failure(page, request):
    """Captura screenshot automáticamente si el test falla."""
    yield  # El test se ejecuta aquí

    # Después del test, verificar si falló
    if request.node.rep_call and request.node.rep_call.failed:
        # Crear directorio para screenshots
        screenshot_dir = Path("test-results/screenshots")
        screenshot_dir.mkdir(parents=True, exist_ok=True)

        # Nombre descriptivo con fecha y nombre del test
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        test_name = request.node.name
        filename = f"{test_name}_{timestamp}.png"

        # Capturar screenshot
        page.screenshot(
            path=str(screenshot_dir / filename),
            full_page=True
        )
        print(f"\\n📸 Screenshot guardado: {screenshot_dir / filename}")


# Hook necesario para que request.node.rep_call funcione
@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Almacena el resultado del test en request.node."""
    import pluggy
    outcome = yield
    rep = outcome.get_result()
    setattr(item, f"rep_{rep.when}", rep)</code></pre>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Clave: pytest_runtest_makereport</h4>
            <p>El hook <code>pytest_runtest_makereport</code> es esencial: almacena el resultado del test
            en <code>request.node</code> para que el fixture pueda acceder a él. Sin este hook,
            <code>request.node.rep_call</code> no existirá y la captura no funcionará.</p>
        </div>

        <h3>🎬 Grabación de videos</h3>
        <p>Los videos capturan <strong>toda la secuencia de acciones</strong> del test, no solo el estado
        final. Se configuran a nivel de <code>BrowserContext</code>.</p>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Configurar grabación de video</h4>
            <pre><code class="python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Crear context con grabación de video
    context = browser.new_context(
        record_video_dir="videos/"  # Directorio donde se guardan
    )

    page = context.new_page()
    page.goto("https://mi-app.com/login")
    page.fill("#email", "admin@siesa.com")
    page.fill("#password", "Admin123!")
    page.click("button[type='submit']")
    page.wait_for_url("**/dashboard")

    # IMPORTANTE: cerrar context para que se guarde el video
    context.close()

    # El video se guarda automáticamente en videos/
    # con un nombre generado (UUID)
    browser.close()</code></pre>
        </div>

        <h3>📏 Configuración del tamaño de video</h3>
        <p>Puedes controlar la resolución del video para balancear calidad vs. tamaño de archivo.</p>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Personalizar resolución del video</h4>
            <pre><code class="python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Video con resolución personalizada
    context = browser.new_context(
        record_video_dir="videos/",
        record_video_size={
            "width": 1280,
            "height": 720
        }
    )

    page = context.new_page()
    page.goto("https://mi-app.com/dashboard")
    # ... acciones del test ...

    # Obtener la ruta del video ANTES de cerrar el context
    video_path = page.video.path()
    print(f"Video grabándose en: {video_path}")

    context.close()

    # Después de cerrar, renombrar el video
    import shutil
    shutil.move(video_path, "videos/test_dashboard.webm")

    browser.close()</code></pre>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip: Tamaño de video recomendado</h4>
            <ul>
                <li><strong>CI/CD (ahorro de espacio):</strong> 800x600 — suficiente para ver la interacción</li>
                <li><strong>Debugging detallado:</strong> 1280x720 — buena resolución para textos pequeños</li>
                <li><strong>Documentación/demos:</strong> 1920x1080 — calidad completa</li>
            </ul>
        </div>

        <h3>🎯 Guardar videos solo en fallos</h3>
        <p>Grabar video de <strong>todos</strong> los tests genera muchos archivos. La estrategia óptima
        es grabar siempre pero <strong>eliminar el video si el test pasa</strong>.</p>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Fixture que conserva videos solo en fallos</h4>
            <pre><code class="python"># tests/conftest.py
import pytest
import os
from pathlib import Path
from datetime import datetime


@pytest.fixture
def context_with_video(browser, request):
    """Context que graba video y lo conserva solo si el test falla."""
    video_dir = Path("test-results/videos/raw")
    video_dir.mkdir(parents=True, exist_ok=True)

    context = browser.new_context(
        record_video_dir=str(video_dir),
        record_video_size={"width": 1280, "height": 720}
    )

    yield context

    # Obtener páginas antes de cerrar
    pages = context.pages

    # Cerrar context para que se guarden los videos
    context.close()

    # Verificar si el test falló
    if request.node.rep_call and request.node.rep_call.failed:
        # Mover videos a carpeta de fallos con nombre descriptivo
        fail_dir = Path("test-results/videos/failures")
        fail_dir.mkdir(parents=True, exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        test_name = request.node.name

        for i, pg in enumerate(pages):
            try:
                video_path = pg.video.path()
                if os.path.exists(video_path):
                    dest = fail_dir / f"{test_name}_{timestamp}_p{i}.webm"
                    os.rename(video_path, str(dest))
                    print(f"\\n🎬 Video de fallo: {dest}")
            except Exception:
                pass  # Page sin video
    else:
        # Test pasó — eliminar videos para ahorrar espacio
        for pg in pages:
            try:
                video_path = pg.video.path()
                if os.path.exists(video_path):
                    os.remove(video_path)
            except Exception:
                pass</code></pre>
        </div>

        <h3>🔗 Combinando screenshots + videos + traces</h3>
        <p>El análisis de fallos más completo combina los tres artefactos: screenshot del estado final,
        video de la secuencia completa y trace con timeline detallado.</p>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔬 Estrategia completa de recolección de artefactos</h4>
            <pre><code class="python"># tests/conftest.py — Sistema completo de artefactos
import pytest
import os
import shutil
from pathlib import Path
from datetime import datetime


@pytest.fixture
def artifacts_context(browser, request):
    """Context con screenshots, videos y traces integrados."""
    # Directorios base
    base_dir = Path("test-results")
    video_dir = base_dir / "videos" / "raw"
    video_dir.mkdir(parents=True, exist_ok=True)

    # Crear context con video + trace
    context = browser.new_context(
        record_video_dir=str(video_dir),
        record_video_size={"width": 1280, "height": 720}
    )
    context.tracing.start(
        screenshots=True,
        snapshots=True,
        sources=True
    )

    yield context

    # --- Fase de recolección post-test ---
    failed = (
        hasattr(request.node, "rep_call")
        and request.node.rep_call.failed
    )

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    test_name = request.node.name
    status = "FAIL" if failed else "PASS"

    if failed:
        # Crear carpeta específica para este fallo
        fail_dir = base_dir / "failures" / f"{test_name}_{timestamp}"
        fail_dir.mkdir(parents=True, exist_ok=True)

        # 1. Screenshot del estado final
        for i, pg in enumerate(context.pages):
            try:
                pg.screenshot(
                    path=str(fail_dir / f"screenshot_p{i}.png"),
                    full_page=True
                )
            except Exception:
                pass

        # 2. Guardar trace
        context.tracing.stop(
            path=str(fail_dir / "trace.zip")
        )

        # 3. Cerrar context y mover videos
        pages = context.pages
        context.close()

        for i, pg in enumerate(pages):
            try:
                video_path = pg.video.path()
                if os.path.exists(video_path):
                    shutil.move(
                        video_path,
                        str(fail_dir / f"video_p{i}.webm")
                    )
            except Exception:
                pass

        print(f"\\n🔍 Artefactos de fallo en: {fail_dir}/")
        print(f"   📸 Screenshots, 🎬 Video, 📋 Trace")
    else:
        # Test pasó — descartar artefactos
        context.tracing.stop()
        pages = context.pages
        context.close()

        for pg in pages:
            try:
                video_path = pg.video.path()
                if os.path.exists(video_path):
                    os.remove(video_path)
            except Exception:
                pass</code></pre>
        </div>

        <h3>📂 Organización de artefactos</h3>
        <p>Una buena estructura de carpetas facilita encontrar los artefactos relevantes cuando
        hay decenas o cientos de tests.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📁 Estructura recomendada por test/fecha/estado</h4>
            <pre><code class="bash">test-results/
├── failures/                          # Solo fallos (se conservan)
│   ├── test_login_invalido_20260404_143022/
│   │   ├── screenshot_p0.png          # Estado visual al fallar
│   │   ├── video_p0.webm              # Video completo del test
│   │   └── trace.zip                  # Trace para Trace Viewer
│   └── test_checkout_timeout_20260404_143025/
│       ├── screenshot_p0.png
│       ├── video_p0.webm
│       └── trace.zip
├── videos/
│   └── raw/                           # Videos temporales (se limpian)
├── screenshots/
│   └── on-demand/                     # Screenshots manuales
└── latest-report.html                 # Reporte HTML con links</code></pre>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA: Limpieza automática</h4>
            <p>En pipelines de CI/CD, agrega un paso de limpieza que elimine artefactos con más de
            N días de antigüedad. En Azure DevOps, publica la carpeta <code>test-results/failures/</code>
            como <strong>Pipeline Artifact</strong> para que el equipo pueda descargarla desde el portal.</p>
            <pre><code class="python"># conftest.py — Limpieza de artefactos antiguos
import time

def limpiar_artefactos_antiguos(directorio, dias_max=7):
    """Elimina artefactos con más de N días."""
    ahora = time.time()
    limite = ahora - (dias_max * 86400)  # 86400 seg = 1 día

    for carpeta in Path(directorio).iterdir():
        if carpeta.is_dir() and carpeta.stat().st_mtime < limite:
            shutil.rmtree(carpeta)
            print(f"🧹 Limpiado: {carpeta.name}")</code></pre>
        </div>

        <h3>📊 Adjuntar artefactos a reportes de CI</h3>
        <p>Los artefactos son más útiles cuando están <strong>vinculados directamente</strong> al reporte
        del test, no en una carpeta aparte que nadie revisa.</p>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Integración con pytest-html</h4>
            <pre><code class="python"># conftest.py — Adjuntar artefactos a pytest-html
import pytest
import base64
from pathlib import Path


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()
    setattr(item, f"rep_{report.when}", report)

    if report.when == "call" and report.failed:
        # Obtener page del fixture
        page = item.funcargs.get("page")
        if page:
            # Capturar screenshot como base64
            screenshot = page.screenshot(full_page=True)
            b64 = base64.b64encode(screenshot).decode("utf-8")

            # Agregar como extra al reporte HTML
            extra = getattr(report, "extra", [])
            extra.append(pytest_html.extras.png(b64))
            report.extra = extra</code></pre>
        </div>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔬 Integración con Allure</h4>
            <pre><code class="python"># conftest.py — Adjuntar artefactos a Allure
import allure
import pytest
from pathlib import Path


@pytest.fixture(autouse=True)
def attach_artifacts_on_failure(page, request):
    """Adjunta screenshot y video a Allure si el test falla."""
    yield

    if request.node.rep_call and request.node.rep_call.failed:
        # Adjuntar screenshot
        screenshot = page.screenshot(full_page=True)
        allure.attach(
            screenshot,
            name="screenshot_fallo",
            attachment_type=allure.attachment_type.PNG
        )

        # Adjuntar video si existe
        try:
            video_path = page.video.path()
            if Path(video_path).exists():
                with open(video_path, "rb") as f:
                    allure.attach(
                        f.read(),
                        name="video_fallo",
                        attachment_type=allure.attachment_type.WEBM
                    )
        except Exception:
            pass  # No hay video disponible

        # Adjuntar logs de consola
        console_logs = page.evaluate(
            "() => JSON.stringify(window.__console_logs || [])"
        )
        allure.attach(
            console_logs,
            name="console_logs",
            attachment_type=allure.attachment_type.JSON
        )</code></pre>
        </div>

        <h3>🏗️ conftest.py completo: recolección de artefactos en fallos</h3>
        <p>Este <code>conftest.py</code> integra <strong>todos los conceptos</strong> de la lección en un
        sistema robusto de recolección de artefactos.</p>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ conftest.py completo — producción</h4>
            <pre><code class="python"># tests/conftest.py
# Sistema completo de artefactos para análisis de fallos
import pytest
import os
import shutil
from pathlib import Path
from datetime import datetime
from playwright.sync_api import sync_playwright


# ============================================================
# CONFIGURACIÓN
# ============================================================
ARTIFACTS_DIR = Path("test-results")
VIDEO_RESOLUTION = {"width": 1280, "height": 720}
CAPTURE_VIDEO = True       # Activar/desactivar grabación
CAPTURE_TRACE = True       # Activar/desactivar traces
FULL_PAGE_SCREENSHOT = True
CLEANUP_DAYS = 7           # Días antes de limpiar artefactos


# ============================================================
# HOOK: Capturar resultado del test
# ============================================================
@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Almacena resultado del test en request.node."""
    outcome = yield
    report = outcome.get_result()
    setattr(item, f"rep_{report.when}", report)


# ============================================================
# FIXTURE: Playwright con artefactos
# ============================================================
@pytest.fixture
def pw_artifacts(browser, request):
    """
    Proporciona (context, page) con recolección automática
    de artefactos al fallar.

    Uso:
        def test_ejemplo(pw_artifacts):
            context, page = pw_artifacts
            page.goto("https://mi-app.com")
            assert page.title() == "Mi App"
    """
    # Preparar directorio de videos
    video_raw = ARTIFACTS_DIR / "videos" / "raw"
    video_raw.mkdir(parents=True, exist_ok=True)

    # Crear context con video y trace opcionales
    context_options = {}
    if CAPTURE_VIDEO:
        context_options["record_video_dir"] = str(video_raw)
        context_options["record_video_size"] = VIDEO_RESOLUTION

    context = browser.new_context(**context_options)

    if CAPTURE_TRACE:
        context.tracing.start(
            screenshots=True,
            snapshots=True,
            sources=True
        )

    page = context.new_page()

    yield context, page

    # --- Recolección post-test ---
    failed = (
        hasattr(request.node, "rep_call")
        and request.node.rep_call.failed
    )

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    test_name = request.node.name

    if failed:
        _save_failure_artifacts(
            context, page, request, test_name, timestamp
        )
    else:
        _cleanup_pass_artifacts(context, page)


def _save_failure_artifacts(context, page, request, test_name, ts):
    """Guarda todos los artefactos cuando el test falla."""
    fail_dir = ARTIFACTS_DIR / "failures" / f"{test_name}_{ts}"
    fail_dir.mkdir(parents=True, exist_ok=True)

    # 1. Screenshot del estado final
    try:
        page.screenshot(
            path=str(fail_dir / "screenshot.png"),
            full_page=FULL_PAGE_SCREENSHOT
        )
    except Exception as e:
        print(f"⚠️ No se pudo capturar screenshot: {e}")

    # 2. Trace
    if CAPTURE_TRACE:
        try:
            context.tracing.stop(
                path=str(fail_dir / "trace.zip")
            )
        except Exception:
            pass

    # 3. Video
    pages = context.pages
    context.close()

    if CAPTURE_VIDEO:
        for i, pg in enumerate(pages):
            try:
                video_path = pg.video.path()
                if os.path.exists(video_path):
                    dest = fail_dir / f"video_p{i}.webm"
                    shutil.move(video_path, str(dest))
            except Exception:
                pass

    print(f"\\n{'='*50}")
    print(f"🔍 ARTEFACTOS DE FALLO: {test_name}")
    print(f"   📸 Screenshot: {fail_dir}/screenshot.png")
    print(f"   🎬 Video:      {fail_dir}/video_p0.webm")
    print(f"   📋 Trace:      {fail_dir}/trace.zip")
    print(f"   📂 Carpeta:    {fail_dir}/")
    print(f"{'='*50}")


def _cleanup_pass_artifacts(context, page):
    """Limpia artefactos cuando el test pasa."""
    try:
        context.tracing.stop()
    except Exception:
        pass

    pages = context.pages
    context.close()

    if CAPTURE_VIDEO:
        for pg in pages:
            try:
                video_path = pg.video.path()
                if os.path.exists(video_path):
                    os.remove(video_path)
            except Exception:
                pass


# ============================================================
# FIXTURE: Limpieza de artefactos antiguos (session scope)
# ============================================================
@pytest.fixture(scope="session", autouse=True)
def cleanup_old_artifacts():
    """Limpia artefactos con más de CLEANUP_DAYS días."""
    import time

    failures_dir = ARTIFACTS_DIR / "failures"
    if failures_dir.exists():
        limit = time.time() - (CLEANUP_DAYS * 86400)
        for folder in failures_dir.iterdir():
            if folder.is_dir() and folder.stat().st_mtime < limit:
                shutil.rmtree(folder)

    yield  # Los tests se ejecutan aquí</code></pre>
        </div>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📝 Uso del fixture en tests</h4>
            <pre><code class="python"># tests/test_dashboard.py
from playwright.sync_api import expect


def test_dashboard_carga_correctamente(pw_artifacts):
    context, page = pw_artifacts
    page.goto("https://mi-app.com/dashboard")

    expect(page.locator("h1")).to_contain_text("Dashboard")
    expect(page.locator(".widget-ventas")).to_be_visible()


def test_filtro_por_fecha(pw_artifacts):
    context, page = pw_artifacts
    page.goto("https://mi-app.com/dashboard")

    page.click("button.filtro-fecha")
    page.fill("#fecha-inicio", "2026-01-01")
    page.fill("#fecha-fin", "2026-03-31")
    page.click("button.aplicar-filtro")

    # Si falla, tendremos screenshot + video + trace
    expect(page.locator(".tabla-resultados")).to_be_visible()
    expect(page.locator(".total-registros")).not_to_have_text("0")</code></pre>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA: Integración con Azure DevOps</h4>
            <p>Para publicar los artefactos de fallos en Azure DevOps, agrega este paso en tu pipeline:</p>
            <pre><code class="yaml"># azure-pipelines.yml
- task: PublishPipelineArtifact@1
  displayName: "Publicar artefactos de fallos"
  condition: failed()
  inputs:
    targetPath: "test-results/failures"
    artifact: "test-failure-artifacts"
    publishLocation: "pipeline"</code></pre>
            <p>El equipo QA de SIESA podrá descargar screenshots, videos y traces directamente
            desde el portal de Azure DevOps sin necesidad de acceder al agente de CI.</p>
        </div>

        <h3>📋 Resumen de la lección</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #1565c0; color: white;">
                        <th style="padding: 10px; text-align: left;">Artefacto</th>
                        <th style="padding: 10px; text-align: left;">API</th>
                        <th style="padding: 10px; text-align: left;">Cuándo usar</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #f5f5f5;">
                        <td style="padding: 8px;">Screenshot viewport</td>
                        <td style="padding: 8px;"><code>page.screenshot(path=...)</code></td>
                        <td style="padding: 8px;">Estado visible al momento del fallo</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Screenshot full-page</td>
                        <td style="padding: 8px;"><code>page.screenshot(full_page=True)</code></td>
                        <td style="padding: 8px;">Páginas con scroll, tablas largas</td>
                    </tr>
                    <tr style="background: #f5f5f5;">
                        <td style="padding: 8px;">Screenshot de elemento</td>
                        <td style="padding: 8px;"><code>locator.screenshot(path=...)</code></td>
                        <td style="padding: 8px;">Componente específico con error</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Video</td>
                        <td style="padding: 8px;"><code>record_video_dir=...</code></td>
                        <td style="padding: 8px;">Secuencia de pasos que llevan al fallo</td>
                    </tr>
                    <tr style="background: #f5f5f5;">
                        <td style="padding: 8px;">Trace</td>
                        <td style="padding: 8px;"><code>tracing.start() / stop()</code></td>
                        <td style="padding: 8px;">Timeline detallado + network + DOM</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🏋️ Ejercicio práctico</h4>
            <p>Crea un proyecto de tests con recolección automática de artefactos:</p>
            <ol>
                <li><strong>Estructura:</strong> Crea un proyecto con <code>conftest.py</code> que incluya
                el fixture <code>pw_artifacts</code> completo (screenshot + video + trace)</li>
                <li><strong>Test que pasa:</strong> Escribe <code>test_pagina_principal</code> que navegue a
                <code>https://the-internet.herokuapp.com</code> y verifique el título. Confirma que
                <strong>no se generan artefactos</strong> al pasar.</li>
                <li><strong>Test que falla:</strong> Escribe <code>test_elemento_inexistente</code> que busque
                un locator que no existe con timeout corto (<code>timeout=3000</code>). Confirma que
                se generan screenshot, video y trace en <code>test-results/failures/</code>.</li>
                <li><strong>Verificación:</strong> Ejecuta los tests y confirma:
                    <ul>
                        <li>La carpeta de fallos contiene <code>screenshot.png</code>, <code>video_p0.webm</code> y <code>trace.zip</code></li>
                        <li>El screenshot muestra el estado de la página al momento del fallo</li>
                        <li>El video reproduce la navegación completa</li>
                        <li>El trace se puede abrir con <code>playwright show-trace trace.zip</code></li>
                    </ul>
                </li>
                <li><strong>Bonus:</strong> Integra <code>pytest-html</code> y adjunta el screenshot al reporte HTML</li>
            </ol>
            <pre><code class="bash"># Ejecutar y verificar
pip install pytest-html
pytest tests/ --html=test-results/report.html -v

# Abrir trace del fallo
playwright show-trace test-results/failures/test_elemento_inexistente_*/trace.zip</code></pre>
        </div>
    `,
    topics: ["fallos", "screenshots", "videos", "análisis"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_097 = LESSON_097;
}
