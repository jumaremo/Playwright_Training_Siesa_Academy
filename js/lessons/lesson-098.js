/**
 * Playwright Academy - Lección 098
 * Proyecto: Diagnosticar y corregir test inestable
 * Sección 14: Debugging: Inspector, Trace, Codegen
 */

const LESSON_098 = {
    id: 98,
    title: "Proyecto: Diagnosticar y corregir test inestable",
    duration: "10 min",
    level: "intermediate",
    section: "section-14",
    content: `
        <h2>🚀 Proyecto: Diagnosticar y corregir test inestable</h2>
        <p>En este proyecto integrador de la <strong>Sección 14</strong> enfrentarás un escenario
        real que todo equipo QA enfrenta: una suite de tests para un <strong>e-commerce checkout</strong>
        que falla de forma intermitente (flaky tests). Aplicarás <strong>todas las herramientas de debugging</strong>
        aprendidas en esta sección: Inspector con PWDEBUG, Codegen, Trace Viewer, breakpoints
        y recolección de screenshots/videos para diagnosticar, identificar las causas raíz
        y corregir cada test inestable de forma sistemática.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎯 Objetivo del proyecto</h4>
            <p>Recibir una suite de tests "rota" con <strong>6 patrones comunes de inestabilidad</strong>
            (race conditions, hardcoded waits, selectores frágiles, timing de red, falta de assertions
            y estado compartido), diagnosticar cada problema usando las herramientas de Playwright
            y producir una suite corregida, estable y con infraestructura completa de debugging
            para CI/CD.</p>
        </div>

        <h3>🗂️ Paso 1: Estructura del proyecto</h3>
        <pre><code class="bash"># Crear la estructura completa del proyecto
mkdir -p proyecto_flaky_debug/pages
mkdir -p proyecto_flaky_debug/tests
mkdir -p proyecto_flaky_debug/test-results/screenshots
mkdir -p proyecto_flaky_debug/test-results/videos
mkdir -p proyecto_flaky_debug/test-results/traces

# Crear archivos base
touch proyecto_flaky_debug/pytest.ini
touch proyecto_flaky_debug/pages/__init__.py
touch proyecto_flaky_debug/pages/checkout_page.py
touch proyecto_flaky_debug/pages/cart_page.py
touch proyecto_flaky_debug/pages/product_page.py

touch proyecto_flaky_debug/tests/__init__.py
touch proyecto_flaky_debug/tests/conftest.py
touch proyecto_flaky_debug/tests/test_checkout_broken.py
touch proyecto_flaky_debug/tests/test_checkout_fixed.py</code></pre>
        <pre><code>proyecto_flaky_debug/
├── pytest.ini                          # Config pytest con artefactos
├── pages/
│   ├── __init__.py
│   ├── checkout_page.py                # Page Object del checkout
│   ├── cart_page.py                    # Page Object del carrito
│   └── product_page.py                # Page Object de productos
├── tests/
│   ├── __init__.py
│   ├── conftest.py                     # Fixtures con TODAS las herramientas de debug
│   ├── test_checkout_broken.py         # Suite ROTA — los tests con problemas
│   └── test_checkout_fixed.py          # Suite CORREGIDA — después del diagnóstico
└── test-results/
    ├── screenshots/                    # Capturas automáticas en fallos
    ├── videos/                         # Videos de cada test
    └── traces/                         # Trace files para Trace Viewer</code></pre>

        <h3>🔴 Paso 2: La suite rota — test_checkout_broken.py</h3>
        <p>Este es el código que recibes del equipo de desarrollo. Los tests pasan a veces y
        fallan otras veces. Tu misión es diagnosticar <strong>por qué son inestables</strong>.</p>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>❌ Código con PROBLEMAS — No copies esto en producción</h4>
            <p>Cada test tiene al menos un anti-patrón que causa inestabilidad. Lee con atención
            e intenta identificar los problemas <strong>antes</strong> de ver las correcciones.</p>
        </div>

        <pre><code class="python"># tests/test_checkout_broken.py
"""
Suite de tests INESTABLE para el checkout de e-commerce.
Contiene 6 anti-patrones comunes que causan flaky tests.
NO usar en producción — este archivo es para diagnóstico.
"""
import time
import pytest
from playwright.sync_api import Page


# ============================================================
# PROBLEMA 1: Hardcoded sleep en lugar de espera inteligente
# ============================================================

class TestAgregarAlCarrito:
    """Falla ~30% de las veces por timing."""

    def test_agregar_producto(self, page: Page):
        page.goto("https://demo-ecommerce.example.com/products")

        # ❌ PROBLEMA: Hardcoded sleep — puede ser muy poco o demasiado
        page.click("text=Laptop Pro 15")
        time.sleep(2)  # Espera "a ojo" para que cargue la página
        page.click("#add-to-cart")
        time.sleep(3)  # Espera "a ojo" para la animación del carrito

        # ❌ PROBLEMA: Verificación frágil por texto exacto
        cart_count = page.text_content("#cart-count")
        assert cart_count == "1"  # Falla si hay espacio: " 1 "


# ============================================================
# PROBLEMA 2: Selectores frágiles que dependen de estructura
# ============================================================

class TestNavegacionProductos:
    """Falla cuando el diseño cambia ligeramente."""

    def test_ver_detalle_producto(self, page: Page):
        page.goto("https://demo-ecommerce.example.com/products")

        # ❌ PROBLEMA: Selector por posición absoluta en el DOM
        page.click("div.products-grid > div:nth-child(3) > a.product-link")

        # ❌ PROBLEMA: Selector por clase CSS generada
        title = page.text_content("h1.css-1a2b3c4")  # Clase auto-generada
        assert title is not None

    def test_filtrar_por_categoria(self, page: Page):
        page.goto("https://demo-ecommerce.example.com/products")

        # ❌ PROBLEMA: XPath frágil con posición absoluta
        page.click("xpath=/html/body/div[2]/aside/ul/li[3]/a")
        time.sleep(1)

        # ❌ PROBLEMA: Contar elementos sin esperar a que carguen
        productos = page.query_selector_all(".product-card")
        assert len(productos) == 6  # Número exacto que puede variar


# ============================================================
# PROBLEMA 3: Race condition — acción antes de que la UI esté lista
# ============================================================

class TestCheckout:
    """Falla ~50% de las veces por race conditions."""

    def test_completar_checkout(self, page: Page):
        page.goto("https://demo-ecommerce.example.com/cart")

        # ❌ PROBLEMA: Clic sin esperar que el botón esté habilitado
        page.click("#checkout-button")

        # ❌ PROBLEMA: Llenar form sin esperar la transición de página
        page.fill("#shipping-name", "Juan Pérez")
        page.fill("#shipping-address", "Calle 123")
        page.fill("#shipping-city", "Cali")

        # ❌ PROBLEMA: No esperar la validación del formulario
        page.click("#continue-to-payment")

        page.fill("#card-number", "4111111111111111")
        page.fill("#card-expiry", "12/28")
        page.fill("#card-cvv", "123")

        # ❌ PROBLEMA: Clic en botón que puede estar deshabilitado
        page.click("#place-order")
        time.sleep(5)  # Espera larga "por si acaso"

        # ❌ PROBLEMA: Verificación por texto que puede no haber cargado
        assert "Pedido confirmado" in page.content()


# ============================================================
# PROBLEMA 4: Timing de red — no esperar respuestas API
# ============================================================

class TestBusqueda:
    """Falla cuando la API tarda más de lo esperado."""

    def test_buscar_producto(self, page: Page):
        page.goto("https://demo-ecommerce.example.com")

        page.fill("#search-input", "laptop")
        page.click("#search-button")

        # ❌ PROBLEMA: No esperar la respuesta de la API de búsqueda
        time.sleep(1)  # A veces la API tarda más de 1 segundo

        # ❌ PROBLEMA: Verificar resultados antes de que terminen de renderizar
        results = page.query_selector_all(".search-result")
        assert len(results) > 0

    def test_aplicar_filtro_precio(self, page: Page):
        page.goto("https://demo-ecommerce.example.com/products")

        page.fill("#price-min", "100")
        page.fill("#price-max", "500")
        page.click("#apply-filters")

        # ❌ PROBLEMA: No esperar la recarga con los filtros aplicados
        # Los productos se actualizan vía AJAX, no recarga de página

        # ❌ PROBLEMA: Verificar el número exacto de resultados
        count_text = page.text_content("#results-count")
        assert count_text == "Mostrando 12 productos"


# ============================================================
# PROBLEMA 5: Estado compartido entre tests
# ============================================================

class TestCarritoEstadoCompartido:
    """Falla cuando los tests se ejecutan en cierto orden."""

    # ❌ PROBLEMA: Variable de clase compartida entre tests
    items_added = 0

    def test_agregar_primer_producto(self, page: Page):
        page.goto("https://demo-ecommerce.example.com/products/laptop-1")
        page.click("#add-to-cart")
        TestCarritoEstadoCompartido.items_added += 1  # ❌ Estado mutable compartido
        time.sleep(1)

    def test_agregar_segundo_producto(self, page: Page):
        page.goto("https://demo-ecommerce.example.com/products/mouse-1")
        page.click("#add-to-cart")
        TestCarritoEstadoCompartido.items_added += 1

    def test_verificar_carrito(self, page: Page):
        page.goto("https://demo-ecommerce.example.com/cart")
        time.sleep(1)
        # ❌ PROBLEMA: Depende del orden de ejecución de tests anteriores
        cart_count = page.text_content("#cart-count")
        assert cart_count == str(TestCarritoEstadoCompartido.items_added)

    def test_vaciar_carrito(self, page: Page):
        page.goto("https://demo-ecommerce.example.com/cart")
        # ❌ PROBLEMA: Asume que hay items — falla si tests anteriores fallaron
        page.click("#clear-cart")
        time.sleep(2)
        assert page.text_content("#cart-count") == "0"


# ============================================================
# PROBLEMA 6: Assertions débiles o ausentes
# ============================================================

class TestAssertionsDebiles:
    """Tests que 'pasan' pero no verifican nada útil."""

    def test_pagina_carga(self, page: Page):
        page.goto("https://demo-ecommerce.example.com")
        # ❌ PROBLEMA: No verifica nada — siempre pasa si no hay error 500
        assert True

    def test_formulario_registro(self, page: Page):
        page.goto("https://demo-ecommerce.example.com/register")
        page.fill("#name", "Test User")
        page.fill("#email", "test@example.com")
        page.fill("#password", "password123")
        page.click("#register-button")
        time.sleep(2)
        # ❌ PROBLEMA: Solo verifica que la URL cambió, no el resultado
        assert "register" not in page.url

    def test_eliminar_producto(self, page: Page):
        page.goto("https://demo-ecommerce.example.com/cart")
        page.click(".remove-item")
        # ❌ PROBLEMA: No hay assertion — si el clic falla silenciosamente,
        # el test pasa igual
</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔍 Ejercicio de identificación</h4>
            <p>Antes de continuar, repasa el código roto y anota todos los problemas que identifies.
            Compara tu lista con el diagnóstico que haremos a continuación. ¿Puedes encontrar los
            <strong>6 patrones de inestabilidad</strong>?</p>
            <ol>
                <li>Hardcoded <code>time.sleep()</code> en lugar de esperas inteligentes</li>
                <li>Selectores frágiles (nth-child, clases generadas, XPath absoluto)</li>
                <li>Race conditions (acciones antes de que la UI esté lista)</li>
                <li>Timing de red (no esperar respuestas API/AJAX)</li>
                <li>Estado compartido mutable entre tests</li>
                <li>Assertions débiles, ausentes o que verifican lo incorrecto</li>
            </ol>
        </div>

        <h3>🔍 Paso 3: Diagnóstico con PWDEBUG=1 e Inspector</h3>
        <p>El primer paso para diagnosticar un test inestable es ejecutarlo en modo debug
        con el <strong>Playwright Inspector</strong>. Esto te permite ver cada acción en cámara lenta
        y explorar los elementos de la página.</p>

        <pre><code class="bash"># Ejecutar un test específico con el Inspector
# Linux/macOS:
PWDEBUG=1 pytest tests/test_checkout_broken.py::TestAgregarAlCarrito -v -s

# Windows CMD:
set PWDEBUG=1 && pytest tests/test_checkout_broken.py::TestAgregarAlCarrito -v -s

# Windows PowerShell:
$env:PWDEBUG="1"; pytest tests/test_checkout_broken.py::TestAgregarAlCarrito -v -s</code></pre>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔎 Qué buscar en el Inspector</h4>
            <ul>
                <li><strong>Timing:</strong> ¿El <code>time.sleep()</code> termina antes de que el elemento aparezca?
                    Con el Inspector puedes ver el estado exacto de la página cuando se ejecuta cada acción</li>
                <li><strong>Selectores:</strong> Usa el botón "Pick locator" del Inspector para ver qué selector
                    recomienda Playwright para cada elemento. Compara con los selectores del código roto</li>
                <li><strong>Estado del botón:</strong> Haz clic en "Explore" para ver si <code>#checkout-button</code>
                    tiene atributos <code>disabled</code> o <code>aria-disabled</code> antes de que el clic ocurra</li>
                <li><strong>Consola del Inspector:</strong> Usa <code>page.pause()</code> en puntos clave para
                    detener la ejecución y explorar el estado de la página manualmente</li>
            </ul>
        </div>

        <pre><code class="python"># Agregar puntos de pausa para diagnóstico manual
def test_diagnostico_agregar_carrito(page: Page):
    """Versión de diagnóstico con page.pause() en puntos clave."""
    page.goto("https://demo-ecommerce.example.com/products")

    # Pausa 1: Verificar que la página cargó completamente
    page.pause()  # Inspeccionar el DOM y la red

    page.click("text=Laptop Pro 15")

    # Pausa 2: ¿La página de detalle cargó? ¿Los elementos existen?
    page.pause()  # Verificar selectores antes de interactuar

    page.click("#add-to-cart")

    # Pausa 3: ¿El carrito se actualizó? ¿Qué dice #cart-count?
    page.pause()  # Inspeccionar el valor del contador

    cart_count = page.text_content("#cart-count")
    print(f"Valor del carrito: '{cart_count}'")  # Revelar espacios ocultos</code></pre>

        <h3>🎬 Paso 4: Grabar el flujo correcto con Codegen</h3>
        <p>Usa <strong>Playwright Codegen</strong> para grabar el flujo de checkout manualmente
        y observar qué selectores y esperas genera Playwright automáticamente.</p>

        <pre><code class="bash"># Abrir codegen para grabar el flujo del checkout
playwright codegen https://demo-ecommerce.example.com/products

# Con viewport específico
playwright codegen --viewport-size=1280,720 https://demo-ecommerce.example.com

# Codegen genera selectores como:
#   page.get_by_role("button", name="Agregar al carrito")
#   page.get_by_label("Nombre completo")
#   page.get_by_text("Pedido confirmado")
# En lugar de:
#   page.click("#add-to-cart")
#   page.fill("#shipping-name", "...")
#   page.click("div:nth-child(3) > a")</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Lección de Codegen</h4>
            <p>Al grabar con Codegen notarás que Playwright <strong>nunca genera <code>time.sleep()</code></strong>.
            Esto es porque Playwright tiene <strong>auto-waiting</strong> incorporado: espera automáticamente
            a que los elementos estén visibles, habilitados y estables antes de interactuar.
            Si tu código necesita <code>time.sleep()</code>, probablemente estás peleando contra el
            auto-waiting en lugar de aprovecharlo.</p>
        </div>

        <h3>📼 Paso 5: Habilitar Trace Viewer para capturar fallos</h3>
        <p>El <strong>Trace Viewer</strong> es la herramienta más poderosa para diagnosticar tests
        inestables. Captura un registro completo de cada acción, screenshot, red y consola.</p>

        <pre><code class="python"># tests/conftest.py — Configuración con Trace Viewer
"""
Configuración completa de debugging para diagnosticar tests inestables.
Incluye: tracing, screenshots, videos, logging y hooks de diagnóstico.
"""
import pytest
import logging
import json
from pathlib import Path
from datetime import datetime
from playwright.sync_api import Page, BrowserContext, Browser

# --- Logging profesional ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger("flaky_debug")

# --- Rutas de artefactos ---
PROJECT_ROOT = Path(__file__).parent.parent
RESULTS_DIR = PROJECT_ROOT / "test-results"
SCREENSHOTS_DIR = RESULTS_DIR / "screenshots"
VIDEOS_DIR = RESULTS_DIR / "videos"
TRACES_DIR = RESULTS_DIR / "traces"

# Crear directorios al inicio
for dir_path in [SCREENSHOTS_DIR, VIDEOS_DIR, TRACES_DIR]:
    dir_path.mkdir(parents=True, exist_ok=True)


# =====================================================
# FIXTURE: Browser context con video y viewport
# =====================================================

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    """Configurar el context con video habilitado y viewport consistente."""
    return {
        **browser_context_args,
        "viewport": {"width": 1280, "height": 720},
        "record_video_dir": str(VIDEOS_DIR),
        "record_video_size": {"width": 1280, "height": 720},
        "base_url": "https://demo-ecommerce.example.com",
    }


# =====================================================
# FIXTURE: Tracing — grabación de traces por test
# =====================================================

@pytest.fixture(autouse=True)
def tracing_per_test(context: BrowserContext, request):
    """
    Iniciar tracing ANTES de cada test y guardarlo al finalizar.
    Captura: screenshots, snapshots del DOM y logs de red.
    """
    test_name = request.node.name
    logger.info(f"Iniciando tracing para: {test_name}")

    # Iniciar la grabación del trace
    context.tracing.start(
        screenshots=True,   # Capturar screenshots en cada acción
        snapshots=True,     # Capturar snapshots del DOM
        sources=True        # Incluir código fuente en el trace
    )

    yield  # Aquí se ejecuta el test

    # Guardar el trace siempre (para análisis posterior)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    trace_path = TRACES_DIR / f"trace_{test_name}_{timestamp}.zip"
    context.tracing.stop(path=str(trace_path))
    logger.info(f"Trace guardado: {trace_path}")


# =====================================================
# FIXTURE: Screenshot automático en fallos
# =====================================================

@pytest.fixture(autouse=True)
def screenshot_on_failure(page: Page, request):
    """Capturar screenshot completo cuando un test falla."""
    yield
    if hasattr(request.node, "rep_call") and request.node.rep_call.failed:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        nombre = request.node.name
        ruta = SCREENSHOTS_DIR / f"FAIL_{nombre}_{timestamp}.png"
        page.screenshot(path=str(ruta), full_page=True)
        logger.error(f"Screenshot de fallo guardado: {ruta}")


# =====================================================
# FIXTURE: Logging de cada test (inicio/fin)
# =====================================================

@pytest.fixture(autouse=True)
def log_test_lifecycle(request):
    """Log del ciclo de vida de cada test para correlacionar con artefactos."""
    nombre = request.node.name
    logger.info(f"{'='*70}")
    logger.info(f"INICIO TEST: {nombre}")
    logger.info(f"{'='*70}")

    start_time = datetime.now()
    yield
    elapsed = (datetime.now() - start_time).total_seconds()

    status = "PASSED"
    if hasattr(request.node, "rep_call") and request.node.rep_call.failed:
        status = "FAILED"
    logger.info(f"FIN TEST: {nombre} — {status} ({elapsed:.2f}s)")


# =====================================================
# FIXTURE: Timeouts controlados
# =====================================================

@pytest.fixture(autouse=True)
def configure_timeouts(page: Page):
    """Configurar timeouts razonables para diagnóstico."""
    page.set_default_timeout(15000)        # 15s para acciones
    page.set_default_navigation_timeout(30000)  # 30s para navegación
    yield


# =====================================================
# FIXTURE: Listener de errores de consola
# =====================================================

@pytest.fixture(autouse=True)
def capture_console_errors(page: Page, request):
    """Capturar errores de consola del navegador durante el test."""
    console_errors = []

    def on_console(msg):
        if msg.type == "error":
            console_errors.append(f"[CONSOLE ERROR] {msg.text}")
            logger.warning(f"Error de consola: {msg.text}")

    page.on("console", on_console)
    yield

    # Reportar errores de consola al final del test
    if console_errors:
        logger.warning(
            f"Test '{request.node.name}' tuvo {len(console_errors)} "
            f"errores de consola:"
        )
        for error in console_errors:
            logger.warning(f"  {error}")


# =====================================================
# FIXTURE: Listener de requests fallidas
# =====================================================

@pytest.fixture(autouse=True)
def capture_failed_requests(page: Page, request):
    """Capturar requests HTTP que fallaron durante el test."""
    failed_requests = []

    def on_request_failed(req):
        failed_requests.append(
            f"[REQ FAILED] {req.method} {req.url} — {req.failure}"
        )
        logger.warning(f"Request falló: {req.method} {req.url}")

    page.on("requestfailed", on_request_failed)
    yield

    if failed_requests:
        logger.warning(
            f"Test '{request.node.name}' tuvo {len(failed_requests)} "
            f"requests fallidos:"
        )
        for req in failed_requests:
            logger.warning(f"  {req}")


# =====================================================
# HOOK: Capturar resultado del test para fixtures
# =====================================================

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Hook para que las fixtures accedan al resultado del test."""
    outcome = yield
    rep = outcome.get_result()
    setattr(item, f"rep_{rep.when}", rep)</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA: Infraestructura de debugging en CI</h4>
            <p>En los proyectos de SIESA conectamos los artefactos de Playwright (traces, screenshots,
            videos) con los reportes de Jira. El <code>conftest.py</code> anterior captura <strong>todo</strong>:
            traces con DOM snapshots, videos, screenshots de fallos, errores de consola y requests
            fallidos. Esto reduce el tiempo de diagnóstico de horas a minutos, especialmente cuando
            un test falla solo en CI y no se puede reproducir localmente.</p>
        </div>

        <h3>📊 Paso 6: Analizar traces para encontrar las causas raíz</h3>
        <p>Con los traces capturados, abre el <strong>Trace Viewer</strong> para analizar cada fallo.</p>

        <pre><code class="bash"># Abrir un trace específico en el Trace Viewer
playwright show-trace test-results/traces/trace_test_agregar_producto_20260404_101530.zip

# Abrir el último trace generado (Linux/macOS)
playwright show-trace $(ls -t test-results/traces/*.zip | head -1)

# En Windows PowerShell:
playwright show-trace (Get-ChildItem test-results/traces/*.zip | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName</code></pre>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔎 Qué buscar en el Trace Viewer — Guía de diagnóstico</h4>
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Pestaña</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Qué revisar</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Problema que revela</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><strong>Actions</strong></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Timeline de cada acción con duración</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Acciones que tardan demasiado o fallan</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><strong>Before/After</strong></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Screenshot antes y después de cada acción</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Estado visual de la UI en el momento del fallo</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><strong>Network</strong></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Requests HTTP con tiempos de respuesta</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">APIs lentas, errores 4xx/5xx, timing de AJAX</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><strong>Console</strong></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Logs y errores JavaScript del navegador</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Errores JS que rompen funcionalidad</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><strong>Source</strong></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Código Python del test con la línea exacta</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Correlacionar la línea del error con la acción</td>
                </tr>
            </table>
        </div>

        <pre><code class="python"># Ejemplo: Lo que revela el Trace Viewer para cada problema

# PROBLEMA 1 (Hardcoded sleep):
# En el timeline de Actions verás:
#   1. page.click("text=Laptop Pro 15")     — 50ms
#   2. [idle 2000ms]                         — time.sleep(2)
#   3. page.click("#add-to-cart")            — FAIL: element not found
#
# El Trace muestra que la página de detalle tardó 2.5s en cargar,
# pero el sleep solo esperó 2s. El screenshot "Before" de la acción 3
# muestra la página aún cargando.

# PROBLEMA 3 (Race condition):
# En el timeline verás:
#   1. page.click("#checkout-button")        — 45ms
#   2. page.fill("#shipping-name", ...)      — FAIL: element not visible
#
# El screenshot "Before" de la acción 2 muestra que la transición
# de página aún no completó — el formulario de shipping no es visible.
# En la pestaña Network, verás un POST /api/validate-cart que aún
# está en progreso cuando el test intenta llenar el formulario.</code></pre>

        <h3>📸 Paso 7: Configurar recolección de screenshots y videos para CI</h3>
        <pre><code class="python"># pytest.ini — Configuración completa para CI
[pytest]
markers =
    checkout: Tests del flujo de checkout
    cart: Tests del carrito de compras
    search: Tests de búsqueda
    smoke: Tests críticos de humo
    flaky: Tests marcados como inestables para investigación

# Opciones por defecto para ejecución local
addopts =
    -v
    --tb=short
    --strict-markers

# Opciones para CI (activar con --override-ini o en el comando)
# pytest --video=retain-on-failure --screenshot=only-on-failure --tracing=retain-on-failure</code></pre>

        <pre><code class="bash"># Ejecución en CI con TODOS los artefactos de diagnóstico
# -----------------------------------------------------------

# Ejecución básica con screenshots y video en fallos
pytest tests/ -v \\
    --screenshot=only-on-failure \\
    --video=retain-on-failure \\
    --output=test-results/

# Ejecución completa con tracing (más detallado)
pytest tests/ -v \\
    --screenshot=only-on-failure \\
    --video=retain-on-failure \\
    --tracing=retain-on-failure \\
    --output=test-results/

# Ejecución para diagnóstico intensivo (captura TODO)
pytest tests/ -v \\
    --screenshot=on \\
    --video=on \\
    --tracing=on \\
    --output=test-results/

# Re-ejecutar solo tests fallidos con más detalle
pytest tests/ -v --lf \\
    --tracing=on \\
    --video=on \\
    --output=test-results/rerun/

# Ejecutar con reintentos para detectar flaky tests
pip install pytest-rerunfailures
pytest tests/ -v --reruns=3 --reruns-delay=2 \\
    --tracing=retain-on-failure \\
    --output=test-results/</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA: Estrategia de artefactos en CI/CD</h4>
            <p>En los pipelines de SIESA usamos esta estrategia escalonada para artefactos:</p>
            <ul>
                <li><strong>CI normal:</strong> <code>--screenshot=only-on-failure --video=retain-on-failure</code>
                    — Mínimo impacto en rendimiento, artefactos solo cuando hay fallos</li>
                <li><strong>CI para flaky tests:</strong> <code>--tracing=on --reruns=3</code>
                    — Captura completa para diagnosticar la intermitencia</li>
                <li><strong>Debugging local:</strong> <code>PWDEBUG=1</code> para Inspector interactivo</li>
            </ul>
        </div>

        <h3>✅ Paso 8: La suite corregida — test_checkout_fixed.py</h3>
        <p>Ahora apliquemos todas las correcciones identificadas con las herramientas de debugging.
        Cada corrección incluye un comentario explicando <strong>el problema original</strong> y
        <strong>la técnica de Playwright que lo resuelve</strong>.</p>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Código CORREGIDO — Cada fix documentado</h4>
            <p>Compara este código con la versión rota para entender exactamente qué cambió y por qué.</p>
        </div>

        <pre><code class="python"># tests/test_checkout_fixed.py
"""
Suite de tests CORREGIDA para el checkout de e-commerce.
Cada corrección está documentada con el problema original.
"""
import pytest
from playwright.sync_api import Page, expect


# ============================================================
# FIX 1: Auto-waiting en lugar de time.sleep()
# ============================================================

class TestAgregarAlCarritoFixed:
    """
    ANTES: time.sleep(2) y time.sleep(3) con assertion frágil.
    AHORA: Auto-waiting de Playwright + expect() con timeout.
    """

    @pytest.mark.checkout
    @pytest.mark.smoke
    def test_agregar_producto(self, page: Page):
        page.goto("/products")

        # ✅ FIX: get_by_role en lugar de "text=..." — más semántico
        page.get_by_role("link", name="Laptop Pro 15").click()

        # ✅ FIX: wait_for_load_state en lugar de time.sleep(2)
        page.wait_for_load_state("networkidle")

        # ✅ FIX: get_by_role para el botón — resiliente a cambios de ID
        page.get_by_role("button", name="Agregar al carrito").click()

        # ✅ FIX: expect() con auto-retry en lugar de text_content + assert
        #    expect() reintenta automáticamente durante el timeout
        cart_badge = page.locator("[data-testid='cart-count']")
        expect(cart_badge).to_have_text("1", timeout=5000)


# ============================================================
# FIX 2: Selectores resilientes en lugar de frágiles
# ============================================================

class TestNavegacionProductosFixed:
    """
    ANTES: nth-child, clases CSS generadas, XPath absolutos.
    AHORA: Roles ARIA, data-testid, texto visible.
    """

    @pytest.mark.checkout
    def test_ver_detalle_producto(self, page: Page):
        page.goto("/products")

        # ✅ FIX: Selector por texto visible en lugar de nth-child(3)
        #    Identificado con "Pick locator" del Inspector
        page.get_by_role("link", name="Laptop Pro 15").click()

        # ✅ FIX: Selector semántico en lugar de clase CSS generada
        titulo = page.get_by_role("heading", level=1)
        expect(titulo).to_be_visible()
        expect(titulo).to_contain_text("Laptop Pro 15")

    @pytest.mark.checkout
    def test_filtrar_por_categoria(self, page: Page):
        page.goto("/products")

        # ✅ FIX: Texto visible en lugar de XPath absoluto
        page.get_by_role("link", name="Electrónicos").click()

        # ✅ FIX: Esperar a que los productos se recarguen vía AJAX
        page.wait_for_load_state("networkidle")

        # ✅ FIX: expect() con auto-retry en lugar de query_selector_all
        #    No verificamos número exacto — usamos "mayor que 0"
        productos = page.locator("[data-testid='product-card']")
        expect(productos.first).to_be_visible()
        assert productos.count() > 0, "Debe haber al menos un producto"


# ============================================================
# FIX 3: Esperas explícitas para evitar race conditions
# ============================================================

class TestCheckoutFixed:
    """
    ANTES: Clics sin esperar que los elementos estén listos.
    AHORA: expect() + wait_for_url + wait_for_selector antes de actuar.
    """

    @pytest.mark.checkout
    @pytest.mark.smoke
    def test_completar_checkout(self, page: Page):
        page.goto("/cart")

        # ✅ FIX: Esperar que el botón esté habilitado antes de hacer clic
        checkout_btn = page.get_by_role("button", name="Proceder al pago")
        expect(checkout_btn).to_be_enabled(timeout=10000)
        checkout_btn.click()

        # ✅ FIX: Esperar la navegación a la página de shipping
        page.wait_for_url("**/checkout/shipping")

        # ✅ FIX: Esperar que el formulario esté visible antes de llenar
        shipping_form = page.locator("[data-testid='shipping-form']")
        expect(shipping_form).to_be_visible()

        page.get_by_label("Nombre completo").fill("Juan Pérez")
        page.get_by_label("Dirección").fill("Calle 123")
        page.get_by_label("Ciudad").fill("Cali")

        # ✅ FIX: Esperar a que la validación del formulario termine
        continue_btn = page.get_by_role("button", name="Continuar al pago")
        expect(continue_btn).to_be_enabled()
        continue_btn.click()

        # ✅ FIX: Esperar la transición a la página de pago
        page.wait_for_url("**/checkout/payment")

        page.get_by_label("Número de tarjeta").fill("4111111111111111")
        page.get_by_label("Fecha de expiración").fill("12/28")
        page.get_by_label("CVV").fill("123")

        # ✅ FIX: Esperar que el botón esté habilitado (la validación es async)
        place_order_btn = page.get_by_role("button", name="Confirmar pedido")
        expect(place_order_btn).to_be_enabled(timeout=5000)
        place_order_btn.click()

        # ✅ FIX: Esperar la respuesta de la API Y el texto de confirmación
        page.wait_for_url("**/checkout/confirmation")
        confirmacion = page.get_by_text("Pedido confirmado")
        expect(confirmacion).to_be_visible(timeout=15000)


# ============================================================
# FIX 4: Esperar respuestas de red para timing de API
# ============================================================

class TestBusquedaFixed:
    """
    ANTES: time.sleep(1) para esperar la API.
    AHORA: wait_for_response() y expect() con auto-retry.
    """

    @pytest.mark.search
    def test_buscar_producto(self, page: Page):
        page.goto("/")

        page.get_by_placeholder("Buscar productos...").fill("laptop")

        # ✅ FIX: Esperar la respuesta de la API de búsqueda
        with page.expect_response(
            lambda resp: "/api/search" in resp.url and resp.status == 200
        ) as response_info:
            page.get_by_role("button", name="Buscar").click()

        # ✅ FIX: Verificar que la respuesta tiene resultados
        response = response_info.value
        data = response.json()
        assert len(data["results"]) > 0, "La API debe retornar resultados"

        # ✅ FIX: Esperar que los resultados se rendericen en el DOM
        resultados = page.locator("[data-testid='search-result']")
        expect(resultados.first).to_be_visible(timeout=10000)

    @pytest.mark.search
    def test_aplicar_filtro_precio(self, page: Page):
        page.goto("/products")

        page.get_by_label("Precio mínimo").fill("100")
        page.get_by_label("Precio máximo").fill("500")

        # ✅ FIX: Interceptar la request de filtrado y esperar la respuesta
        with page.expect_response(
            lambda resp: "/api/products" in resp.url and resp.status == 200
        ):
            page.get_by_role("button", name="Aplicar filtros").click()

        # ✅ FIX: Verificar texto con patrón flexible, no exacto
        count_element = page.locator("[data-testid='results-count']")
        expect(count_element).to_contain_text("productos")
        # Verificar que hay un número razonable
        expect(count_element).to_have_text(
            # Regex: "Mostrando X productos" donde X es un número > 0
            pattern=r"Mostrando \\d+ productos"
        )


# ============================================================
# FIX 5: Aislamiento de estado entre tests
# ============================================================

class TestCarritoAisladoFixed:
    """
    ANTES: Variable de clase compartida entre tests, orden dependiente.
    AHORA: Cada test es independiente con su propia navegación y setup.
    """

    @pytest.mark.cart
    def test_agregar_producto_y_verificar(self, page: Page):
        """Test completamente independiente — no depende de otros tests."""
        # ✅ FIX: Cada test configura su propio estado
        page.goto("/products/laptop-1")
        page.get_by_role("button", name="Agregar al carrito").click()

        cart_count = page.locator("[data-testid='cart-count']")
        expect(cart_count).to_have_text("1")

    @pytest.mark.cart
    def test_agregar_multiples_y_verificar(self, page: Page):
        """Test que agrega 2 productos — autónomo."""
        # ✅ FIX: Navegar y agregar desde cero, sin depender de estado previo
        page.goto("/products/laptop-1")
        page.get_by_role("button", name="Agregar al carrito").click()
        expect(page.locator("[data-testid='cart-count']")).to_have_text("1")

        page.goto("/products/mouse-1")
        page.get_by_role("button", name="Agregar al carrito").click()
        expect(page.locator("[data-testid='cart-count']")).to_have_text("2")

    @pytest.mark.cart
    def test_vaciar_carrito(self, page: Page):
        """Test que vacía el carrito — configura su propio estado primero."""
        # ✅ FIX: Primero agregar algo, luego vaciar — independiente
        page.goto("/products/laptop-1")
        page.get_by_role("button", name="Agregar al carrito").click()
        expect(page.locator("[data-testid='cart-count']")).to_have_text("1")

        # Ahora vaciar
        page.goto("/cart")
        page.get_by_role("button", name="Vaciar carrito").click()

        # ✅ FIX: Esperar confirmación con expect()
        expect(page.locator("[data-testid='cart-count']")).to_have_text("0")
        expect(page.get_by_text("Tu carrito está vacío")).to_be_visible()


# ============================================================
# FIX 6: Assertions robustas y específicas
# ============================================================

class TestAssertionsRobustasFixed:
    """
    ANTES: assert True, solo verificar URL, sin assertions.
    AHORA: Verificar estado visible, contenido específico, cambios en DOM.
    """

    @pytest.mark.smoke
    def test_pagina_carga_correctamente(self, page: Page):
        page.goto("/")

        # ✅ FIX: Verificar elementos específicos que confirman la carga correcta
        expect(page).to_have_title(pattern=r".*E-Commerce.*")
        expect(page.get_by_role("navigation")).to_be_visible()
        expect(page.get_by_role("heading", name="Productos destacados")).to_be_visible()
        expect(page.locator("[data-testid='product-card']").first).to_be_visible()

    @pytest.mark.checkout
    def test_formulario_registro(self, page: Page):
        page.goto("/register")
        page.get_by_label("Nombre").fill("Test User")
        page.get_by_label("Email").fill("test@example.com")
        page.get_by_label("Contraseña").fill("password123")
        page.get_by_role("button", name="Registrarse").click()

        # ✅ FIX: Verificar el resultado específico, no solo la URL
        expect(page.get_by_text("Registro exitoso")).to_be_visible(timeout=10000)
        expect(page).to_have_url(pattern=r".*/(dashboard|welcome).*")

    @pytest.mark.cart
    def test_eliminar_producto_del_carrito(self, page: Page):
        # ✅ FIX: Primero asegurar que hay un producto en el carrito
        page.goto("/products/laptop-1")
        page.get_by_role("button", name="Agregar al carrito").click()
        expect(page.locator("[data-testid='cart-count']")).to_have_text("1")

        # Ir al carrito y eliminar
        page.goto("/cart")
        expect(page.locator("[data-testid='cart-item']")).to_have_count(1)

        page.get_by_role("button", name="Eliminar").first.click()

        # ✅ FIX: Verificar que el producto se eliminó con assertions específicas
        expect(page.locator("[data-testid='cart-item']")).to_have_count(0)
        expect(page.locator("[data-testid='cart-count']")).to_have_text("0")
        expect(page.get_by_text("Tu carrito está vacío")).to_be_visible()</code></pre>

        <h3>🔄 Paso 9: Comparación antes/después</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📋 Resumen de correcciones aplicadas</h4>
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #ce93d8; color: white;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Problema</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Antes (Roto)</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Después (Corregido)</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Herramienta de diagnóstico</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><strong>1. Hardcoded waits</strong></td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>time.sleep(2)</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>wait_for_load_state()</code>, <code>expect().to_be_visible()</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Trace Viewer (timeline)</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><strong>2. Selectores frágiles</strong></td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>nth-child(3)</code>, clases CSS generadas</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role()</code>, <code>data-testid</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Inspector (Pick locator)</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><strong>3. Race conditions</strong></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Clic sin esperar estado del botón</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>expect().to_be_enabled()</code>, <code>wait_for_url()</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Trace Viewer (Before/After)</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><strong>4. Timing de red</strong></td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>sleep(1)</code> para esperar API</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>expect_response()</code>, <code>wait_for_load_state("networkidle")</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Trace Viewer (Network tab)</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><strong>5. Estado compartido</strong></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Variable de clase mutable, orden dependiente</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Cada test independiente con su propio setup</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Inspector + ejecución en orden aleatorio</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><strong>6. Assertions débiles</strong></td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>assert True</code>, sin verification</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>expect().to_be_visible()</code>, <code>to_have_text()</code>, <code>to_have_count()</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Trace Viewer (verifica que las assertions aparecen)</td>
                </tr>
            </table>
        </div>

        <h3>📐 Paso 10: conftest.py completo con todas las herramientas</h3>
        <p>El <code>conftest.py</code> mostrado en el Paso 5 ya incluye toda la configuración.
        Aquí agregamos una fixture adicional para <strong>reportes de diagnóstico</strong> que
        genera un resumen JSON al final de la ejecución.</p>

        <pre><code class="python"># Agregar al final de tests/conftest.py

# =====================================================
# FIXTURE: Reporte de diagnóstico JSON
# =====================================================

@pytest.fixture(scope="session", autouse=True)
def diagnostic_report():
    """Genera un reporte JSON con métricas de la ejecución."""
    report_data = {
        "start_time": datetime.now().isoformat(),
        "tests": [],
        "summary": {
            "total": 0,
            "passed": 0,
            "failed": 0,
            "flaky": 0
        }
    }

    yield report_data

    # Guardar reporte al finalizar la sesión
    report_data["end_time"] = datetime.now().isoformat()
    report_path = RESULTS_DIR / "diagnostic_report.json"
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report_data, f, indent=2, ensure_ascii=False)
    logger.info(f"Reporte de diagnóstico guardado: {report_path}")


# =====================================================
# FIXTURE: Captura de estado de red (útil para flaky)
# =====================================================

@pytest.fixture
def network_monitor(page: Page):
    """
    Monitor de red que registra todas las requests durante un test.
    Útil para diagnosticar problemas de timing con APIs.
    """
    requests_log = []

    def log_request(request):
        requests_log.append({
            "method": request.method,
            "url": request.url,
            "timestamp": datetime.now().isoformat()
        })

    def log_response(response):
        for req in requests_log:
            if req["url"] == response.url:
                req["status"] = response.status
                req["timing"] = response.timing if hasattr(response, 'timing') else None
                break

    page.on("request", log_request)
    page.on("response", log_response)

    yield requests_log

    page.remove_listener("request", log_request)
    page.remove_listener("response", log_response)


# =====================================================
# FIXTURE: Retry helper para tests que necesitan
# verificar estabilidad
# =====================================================

@pytest.fixture
def stability_check():
    """
    Helper para verificar que un resultado es estable
    ejecutando una verificación múltiples veces.
    """
    def check(page, locator_str, expected_text, retries=3):
        """
        Verifica que un localizador muestra el texto esperado
        de forma consistente después de múltiples verificaciones.
        """
        for i in range(retries):
            element = page.locator(locator_str)
            actual = element.text_content()
            assert actual.strip() == expected_text.strip(), (
                f"Intento {i+1}/{retries}: "
                f"Esperado '{expected_text}', obtenido '{actual}'"
            )
    return check</code></pre>

        <h3>⚙️ Paso 11: Configuración pytest.ini para artefactos en CI</h3>
        <pre><code class="python"># pytest.ini — Configuración completa
[pytest]
markers =
    checkout: Tests del flujo de checkout
    cart: Tests del carrito de compras
    search: Tests de búsqueda de productos
    smoke: Tests críticos de humo (deben pasar siempre)
    flaky: Tests marcados como inestables para investigación

# Opciones por defecto
addopts =
    -v
    --tb=short
    --strict-markers

# Timeout global por test (requiere pytest-timeout)
# timeout = 60

# Directorio de test por defecto
testpaths = tests

# Patrón de archivos de test
python_files = test_*.py
python_classes = Test*
python_functions = test_*</code></pre>

        <pre><code class="bash"># === Comandos de ejecución según escenario ===

# 1. Desarrollo local — rápido, sin artefactos
pytest tests/test_checkout_fixed.py -v

# 2. Debug local con Inspector
PWDEBUG=1 pytest tests/test_checkout_fixed.py -v -s -k "test_completar_checkout"

# 3. CI — artefactos solo en fallos (balance rendimiento/diagnóstico)
pytest tests/ -v \\
    --screenshot=only-on-failure \\
    --video=retain-on-failure \\
    --tracing=retain-on-failure \\
    --output=test-results/

# 4. Investigación de flaky — máxima captura + reintentos
pytest tests/ -v \\
    --screenshot=on \\
    --video=on \\
    --tracing=on \\
    --reruns=3 \\
    --output=test-results/investigation/

# 5. Smoke tests en pipeline de deploy
pytest tests/ -v -m smoke \\
    --screenshot=only-on-failure \\
    --tracing=retain-on-failure

# 6. Ver traces de los fallos
playwright show-trace test-results/traces/trace_test_completar_checkout_*.zip</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA: Pipeline de diagnóstico automatizado</h4>
            <p>En SIESA, cuando un test falla en CI, el pipeline automáticamente:</p>
            <ol>
                <li>Guarda los artefactos (traces, screenshots, videos) como artefactos del build</li>
                <li>Re-ejecuta los tests fallidos con <code>--tracing=on</code> para captura completa</li>
                <li>Si un test falla y luego pasa en el reintento, se marca como <strong>flaky</strong></li>
                <li>Los tests flaky se reportan en un dashboard separado para investigación</li>
                <li>El enlace al Trace Viewer se adjunta al ticket de Jira correspondiente</li>
            </ol>
        </div>

        <h3>📊 Paso 12: Resumen de herramientas de debugging</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🧰 Guía rápida: Cuándo usar cada herramienta</h4>
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #1976d2; color: white;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Herramienta</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Cuándo usarla</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Comando</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><strong>Inspector (PWDEBUG=1)</strong></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Desarrollo inicial, explorar selectores, entender el flujo</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>PWDEBUG=1 pytest test.py -v -s</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><strong>Codegen</strong></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Grabar flujos nuevos, descubrir selectores recomendados</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>playwright codegen URL</code></td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><strong>Trace Viewer</strong></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Analizar fallos post-mortem, diagnosticar flaky tests en CI</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>playwright show-trace trace.zip</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><strong>page.pause()</strong></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Detener ejecución en un punto específico para inspeccionar</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>page.pause()</code> dentro del test</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><strong>Screenshots</strong></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Verificación visual rápida del estado de la página al fallar</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>--screenshot=only-on-failure</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><strong>Videos</strong></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Ver el flujo completo de un test, especialmente timing issues</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>--video=retain-on-failure</code></td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><strong>VS Code Debugger</strong></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Breakpoints en Python, inspeccionar variables y call stack</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">F5 con launch.json configurado</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><strong>Console listener</strong></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Detectar errores JavaScript que causan fallos silenciosos</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>page.on("console", ...)</code></td>
                </tr>
            </table>
        </div>

        <h3>🎉 Sección 14 Completada: Debugging: Inspector, Trace, Codegen</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🏆 Has completado todas las secciones intermedias</h4>
            <p>Dominaste todas las herramientas de debugging de Playwright:</p>
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #c8e6c9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Lección</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Tema</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Tipo</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">093</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Playwright Inspector y PWDEBUG</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Foundation</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">094</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Playwright Codegen</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">095</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Trace Viewer: grabación y análisis</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">096</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Debug avanzado: breakpoints y VS Code</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">097</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Análisis de fallos con screenshots y videos</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">098</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Proyecto: Diagnosticar y corregir test inestable</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Integration</td>
                </tr>
            </table>
        </div>

        <h3>🏆 Habilidades adquiridas en la Sección 14</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <ul>
                <li><strong>Playwright Inspector:</strong> <code>PWDEBUG=1</code>, step-by-step, Pick locator, exploración en vivo</li>
                <li><strong>Codegen:</strong> Grabación de flujos, generación de selectores recomendados, exportación a Python</li>
                <li><strong>Trace Viewer:</strong> Captura con <code>context.tracing</code>, análisis de timeline, network, console, screenshots</li>
                <li><strong>VS Code Debug:</strong> Breakpoints en Python, launch.json, inspección de variables, call stack</li>
                <li><strong>Screenshots y Videos:</strong> Captura automática en fallos, configuración para CI, recolección de artefactos</li>
                <li><strong>Diagnóstico de flaky tests:</strong> Identificación de patrones, corrección sistemática, antes/después</li>
                <li><strong>Infraestructura de CI:</strong> <code>conftest.py</code> con tracing, screenshots, videos, console y network logging</li>
                <li><strong>Listeners:</strong> <code>page.on("console")</code>, <code>page.on("requestfailed")</code> para diagnóstico avanzado</li>
            </ul>
        </div>

        <h3>🎯 Ejercicio final</h3>
        <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 15px 0;">
            <h4>🏋️ Implementa el proyecto completo de diagnóstico</h4>
            <ol>
                <li><strong>Crea la estructura del proyecto</strong> con todos los directorios y archivos</li>
                <li><strong>Copia <code>test_checkout_broken.py</code></strong> — la suite con los 6 problemas</li>
                <li><strong>Implementa <code>conftest.py</code></strong> con tracing, screenshots, videos y listeners</li>
                <li><strong>Configura <code>pytest.ini</code></strong> con markers y opciones para CI</li>
                <li><strong>Ejecuta los tests rotos</strong> y recoge los traces:
                    <pre><code class="bash">pytest tests/test_checkout_broken.py -v --tracing=on --output=test-results/</code></pre>
                </li>
                <li><strong>Analiza los traces</strong> con Trace Viewer:
                    <pre><code class="bash">playwright show-trace test-results/traces/trace_*.zip</code></pre>
                </li>
                <li><strong>Usa PWDEBUG=1</strong> para explorar cada test interactivamente:
                    <pre><code class="bash">PWDEBUG=1 pytest tests/test_checkout_broken.py -v -s -k "test_agregar_producto"</code></pre>
                </li>
                <li><strong>Crea <code>test_checkout_fixed.py</code></strong> aplicando TODAS las correcciones</li>
                <li><strong>Ejecuta la suite corregida</strong> 5 veces consecutivas para verificar estabilidad:
                    <pre><code class="bash">for i in {1..5}; do echo "Ejecución $i"; pytest tests/test_checkout_fixed.py -v; done</code></pre>
                </li>
                <li><strong>Documenta cada corrección</strong> con el formato: Problema - Herramienta usada - Fix aplicado</li>
            </ol>

            <div style="background: #ffe0b2; padding: 10px; border-radius: 5px; margin-top: 10px;">
                <strong>Criterios de evaluación:</strong>
                <ul>
                    <li>Los 6 patrones de inestabilidad están identificados y documentados</li>
                    <li>Cada corrección usa la técnica apropiada de Playwright (no hacks genéricos)</li>
                    <li>El <code>conftest.py</code> incluye tracing, screenshots, videos y console listener</li>
                    <li>Los tests corregidos pasan 5 ejecuciones consecutivas sin fallos</li>
                    <li><code>time.sleep()</code> no aparece en ningún test corregido</li>
                    <li>Todos los selectores usan <code>get_by_role</code>, <code>get_by_label</code> o <code>data-testid</code></li>
                    <li>Cada test es completamente independiente (orden aleatorio no lo rompe)</li>
                    <li>Las assertions son específicas y verifican el resultado real, no solo la ausencia de error</li>
                </ul>
            </div>
        </div>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Identificar los 6 patrones comunes de tests inestables (flaky tests)</li>
                <li>Diagnosticar problemas usando Inspector, Codegen y Trace Viewer</li>
                <li>Corregir cada patrón con la técnica apropiada de Playwright</li>
                <li>Configurar infraestructura completa de debugging para CI/CD</li>
                <li>Capturar artefactos (traces, screenshots, videos) automáticamente</li>
                <li>Crear un conftest.py profesional con todas las herramientas de debugging</li>
                <li>Producir tests estables, independientes y con assertions robustas</li>
                <li>Integrar todas las habilidades de debugging de la Sección 14</li>
            </ul>
        </div>

        <h3>🚀 Siguiente: Sección 15 — Visual Regression y Accessibility Testing (nivel avanzado)</h3>
        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Has completado las secciones intermedias.</strong> Con el dominio de debugging
            que acabas de adquirir, estás preparado para el <strong>nivel avanzado</strong>.
            En la Sección 15 aprenderás:</p>
            <ul>
                <li><strong>Screenshot comparison nativa:</strong> Comparación visual pixel a pixel con Playwright</li>
                <li><strong>Masking y umbrales:</strong> Ignorar regiones dinámicas y configurar tolerancias</li>
                <li><strong>Accessibility testing con axe-core:</strong> Auditorías automatizadas de accesibilidad</li>
                <li><strong>Auditorías WCAG:</strong> Cumplimiento de estándares de accesibilidad</li>
                <li><strong>Security headers y HTTPS:</strong> Validación de cabeceras de seguridad</li>
                <li><strong>Proyecto capstone:</strong> Suite completa de visual + a11y + security</li>
            </ul>
            <p>Las habilidades de debugging que dominaste aquí serán esenciales para diagnosticar
            diferencias visuales, analizar reportes de accesibilidad y depurar validaciones de seguridad
            en el nivel avanzado.</p>
        </div>
    `,
    topics: ["proyecto", "diagnóstico", "flaky-test"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 10,
    difficulty: "medium",
    type: "integration"
};

if (typeof window !== 'undefined') {
    window.LESSON_098 = LESSON_098;
}
