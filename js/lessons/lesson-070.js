/**
 * Playwright Academy - Lección 070
 * Proyecto: Tests con API completamente mockeada
 * Sección 9: Network Interception y Mocking
 */

const LESSON_070 = {
    id: 70,
    title: "Proyecto: Tests con API completamente mockeada",
    duration: "10 min",
    level: "intermediate",
    section: "section-09",
    content: `
        <h2>🏆 Proyecto: Tests con API completamente mockeada</h2>
        <p>En este proyecto construiremos una suite de tests para un e-commerce donde
        <strong>todas las APIs están mockeadas</strong>. Los tests se ejecutan
        sin backend, son ultra-rápidos y cubren escenarios que serían difíciles
        de reproducir con un servidor real.</p>

        <h3>🎯 Objetivo</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Automatizar 6 escenarios de un e-commerce "TiendaOnline" usando solo mocks:</p>
            <ol>
                <li>Catálogo con productos cargados</li>
                <li>Catálogo vacío (0 productos)</li>
                <li>Error del servidor al cargar</li>
                <li>Agregar producto al carrito</li>
                <li>Checkout exitoso</li>
                <li>Checkout con error de pago</li>
            </ol>
            <p><strong>Meta:</strong> Cero dependencia del backend. Ejecución en &lt;5 segundos.</p>
        </div>

        <h3>📁 Estructura del proyecto</h3>
        <pre><code class="text">tienda-online-tests/
├── mocks/                          # Datos mock organizados
│   ├── products/
│   │   ├── catalog_full.json       # Catálogo con productos
│   │   ├── catalog_empty.json      # Catálogo vacío
│   │   └── product_detail.json     # Detalle de producto
│   ├── cart/
│   │   ├── cart_with_items.json    # Carrito con items
│   │   └── cart_empty.json         # Carrito vacío
│   └── checkout/
│       ├── success.json            # Compra exitosa
│       └── payment_error.json      # Error de pago
│
├── helpers/
│   └── mock_server.py              # Helper para registrar mocks
│
├── tests/
│   ├── conftest.py                 # Fixtures con mocks
│   ├── test_catalog.py
│   ├── test_cart.py
│   └── test_checkout.py
│
└── pytest.ini</code></pre>

        <h3>📦 1. Archivos de datos mock</h3>
        <pre><code class="python"># mocks/products/catalog_full.json
{
    "products": [
        {
            "id": 1, "name": "Laptop Gaming Pro",
            "price": 3500000, "category": "Electrónica",
            "image": "/img/laptop.png", "stock": 15,
            "description": "Laptop para gaming de alto rendimiento"
        },
        {
            "id": 2, "name": "Mouse Ergonómico",
            "price": 120000, "category": "Accesorios",
            "image": "/img/mouse.png", "stock": 50,
            "description": "Mouse inalámbrico ergonómico"
        },
        {
            "id": 3, "name": "Monitor 4K 27\"",
            "price": 1800000, "category": "Electrónica",
            "image": "/img/monitor.png", "stock": 8,
            "description": "Monitor 4K UHD 27 pulgadas"
        },
        {
            "id": 4, "name": "Teclado Mecánico RGB",
            "price": 250000, "category": "Accesorios",
            "image": "/img/teclado.png", "stock": 30,
            "description": "Teclado mecánico con iluminación RGB"
        },
        {
            "id": 5, "name": "Webcam HD 1080p",
            "price": 180000, "category": "Accesorios",
            "image": "/img/webcam.png", "stock": 0,
            "description": "Cámara web Full HD - AGOTADO"
        }
    ],
    "total": 5,
    "page": 1,
    "per_page": 20
}</code></pre>

        <h3>🔧 2. Mock Server Helper</h3>
        <pre><code class="python"># helpers/mock_server.py
import json
from pathlib import Path

class MockServer:
    """Registra mocks de API para una página de Playwright."""

    MOCKS_DIR = Path(__file__).parent.parent / "mocks"

    def __init__(self, page):
        self.page = page
        self._registered = []

    def mock_json(self, url_pattern, file_path, status=200):
        """Mockear una URL con datos de un archivo JSON."""
        full_path = self.MOCKS_DIR / file_path
        data = full_path.read_text(encoding="utf-8")

        def handler(route):
            route.fulfill(
                status=status,
                content_type="application/json",
                body=data
            )

        self.page.route(url_pattern, handler)
        self._registered.append(url_pattern)
        return self

    def mock_inline(self, url_pattern, data, status=200):
        """Mockear una URL con datos inline."""
        body = json.dumps(data) if isinstance(data, (dict, list)) else data

        def handler(route):
            route.fulfill(
                status=status,
                content_type="application/json",
                body=body
            )

        self.page.route(url_pattern, handler)
        self._registered.append(url_pattern)
        return self

    def mock_error(self, url_pattern, status=500, message="Server Error"):
        """Mockear una URL para que retorne error."""
        return self.mock_inline(
            url_pattern,
            {"error": message, "status": status},
            status=status
        )

    def mock_crud(self, base_pattern, list_file, detail_data=None):
        """Mockear CRUD completo para un recurso."""

        def handler(route):
            method = route.request.method
            url = route.request.url

            if method == "GET":
                if route.request.url.rstrip("/").endswith(
                    base_pattern.replace("**", "").rstrip("*")
                ) or "?" in url:
                    # Lista
                    data = (self.MOCKS_DIR / list_file).read_text(encoding="utf-8")
                    route.fulfill(status=200, content_type="application/json", body=data)
                else:
                    # Detalle
                    route.fulfill(
                        status=200,
                        content_type="application/json",
                        body=json.dumps(detail_data or {"id": 1})
                    )
            elif method == "POST":
                post_data = route.request.post_data
                body = json.loads(post_data) if post_data else {}
                route.fulfill(
                    status=201,
                    content_type="application/json",
                    body=json.dumps({"id": 999, **body})
                )
            elif method == "DELETE":
                route.fulfill(status=204, body="")
            else:
                route.continue_()

        self.page.route(base_pattern, handler)
        return self

    def block_external(self):
        """Bloquear recursos externos para máxima velocidad."""
        block_types = {"image", "font", "media"}
        self.page.route("**/*", lambda route: (
            route.abort()
            if route.request.resource_type in block_types
            else route.continue_()
        ))
        return self

    def cleanup(self):
        """Remover todos los mocks registrados."""
        for pattern in self._registered:
            self.page.unroute(pattern)
        self._registered.clear()</code></pre>

        <h3>⚙️ 3. Fixtures (conftest.py)</h3>
        <pre><code class="python"># tests/conftest.py
import pytest
from helpers.mock_server import MockServer

@pytest.fixture
def mock(page):
    """Fixture que provee el MockServer."""
    server = MockServer(page)
    server.block_external()  # Siempre bloquear recursos externos
    yield server
    server.cleanup()

@pytest.fixture
def catalog_loaded(mock, page):
    """Catálogo con productos cargados."""
    mock.mock_json("**/api/products*", "products/catalog_full.json")
    mock.mock_json("**/api/cart", "cart/cart_empty.json")
    page.goto("https://tienda-online.com/products")
    return mock

@pytest.fixture
def cart_with_items(mock, page):
    """Carrito con items precargados."""
    mock.mock_json("**/api/products*", "products/catalog_full.json")
    mock.mock_json("**/api/cart", "cart/cart_with_items.json")
    page.goto("https://tienda-online.com/cart")
    return mock</code></pre>

        <h3>🧪 4. Tests del catálogo</h3>
        <pre><code class="python"># tests/test_catalog.py
from playwright.sync_api import expect

def test_catalogo_muestra_productos(catalog_loaded, page):
    """Escenario 1: Catálogo carga y muestra productos."""
    # Verificar que se muestran los 5 productos
    expect(page.locator("[data-testid='product-card']")).to_have_count(5)

    # Verificar datos del primer producto
    first = page.locator("[data-testid='product-card']").first
    expect(first).to_contain_text("Laptop Gaming Pro")
    expect(first).to_contain_text("$3,500,000")

    # Verificar producto agotado
    webcam = page.locator("[data-testid='product-card']").filter(
        has_text="Webcam HD"
    )
    expect(webcam.locator(".out-of-stock")).to_be_visible()


def test_catalogo_vacio(mock, page):
    """Escenario 2: Catálogo sin productos muestra estado vacío."""
    mock.mock_json("**/api/products*", "products/catalog_empty.json")
    mock.mock_json("**/api/cart", "cart/cart_empty.json")
    page.goto("https://tienda-online.com/products")

    expect(page.locator("[data-testid='product-card']")).to_have_count(0)
    expect(page.locator("[data-testid='empty-state']")).to_be_visible()
    expect(page.locator("[data-testid='empty-state']")).to_contain_text(
        "No hay productos disponibles"
    )


def test_catalogo_error_servidor(mock, page):
    """Escenario 3: Error del servidor muestra mensaje de error."""
    mock.mock_error("**/api/products*", 500, "Error interno del servidor")
    mock.mock_json("**/api/cart", "cart/cart_empty.json")
    page.goto("https://tienda-online.com/products")

    expect(page.locator("[data-testid='error-state']")).to_be_visible()
    expect(page.locator("[data-testid='retry-btn']")).to_be_visible()</code></pre>

        <h3>🧪 5. Tests del carrito</h3>
        <pre><code class="python"># tests/test_cart.py
from playwright.sync_api import expect
import json

def test_agregar_producto_al_carrito(catalog_loaded, page):
    """Escenario 4: Agregar producto actualiza el carrito."""
    # Mock de la respuesta al agregar
    catalog_loaded.mock_inline("**/api/cart/add", {
        "success": True,
        "cart": {"items": 1, "total": 3500000}
    }, status=201)

    # Click en agregar al carrito del primer producto
    page.locator("[data-testid='product-card']").first.locator(
        "[data-testid='add-to-cart']"
    ).click()

    # Verificar toast de confirmación
    expect(page.locator(".toast")).to_contain_text("agregado al carrito")

    # Verificar que el badge del carrito se actualizó
    expect(page.locator("[data-testid='cart-count']")).to_have_text("1")</code></pre>

        <h3>🧪 6. Tests del checkout</h3>
        <pre><code class="python"># tests/test_checkout.py
from playwright.sync_api import expect
import json

def test_checkout_exitoso(mock, page):
    """Escenario 5: Compra completada exitosamente."""
    # Setup: carrito con items + checkout exitoso
    mock.mock_json("**/api/cart", "cart/cart_with_items.json")
    mock.mock_json("**/api/checkout", "checkout/success.json")

    page.goto("https://tienda-online.com/checkout")

    # Llenar formulario
    page.fill("[data-testid='name']", "Juan Reina")
    page.fill("[data-testid='email']", "juan@siesa.com")
    page.fill("[data-testid='address']", "Calle 5 #38-25, Cali")
    page.select_option("[data-testid='payment']", label="PSE")
    page.check("[data-testid='terms']")

    # Capturar la request del checkout
    with page.expect_request("**/api/checkout") as req:
        page.click("[data-testid='place-order']")

    # Verificar datos enviados
    # Nota: Playwright Python NO tiene post_data_json; se usa json.loads()
    import json
    body = json.loads(req.value.post_data)
    assert body["name"] == "Juan Reina"
    assert body["email"] == "juan@siesa.com"

    # Verificar página de confirmación
    expect(page.locator("[data-testid='order-success']")).to_be_visible()
    expect(page.locator("[data-testid='order-number']")).to_be_visible()


def test_checkout_error_de_pago(mock, page):
    """Escenario 6: Error en el pago muestra mensaje apropiado."""
    mock.mock_json("**/api/cart", "cart/cart_with_items.json")
    mock.mock_error(
        "**/api/checkout", 402,
        "Pago rechazado. Fondos insuficientes."
    )

    page.goto("https://tienda-online.com/checkout")

    # Llenar formulario
    page.fill("[data-testid='name']", "Test User")
    page.fill("[data-testid='email']", "test@test.com")
    page.fill("[data-testid='address']", "Dirección test")
    page.select_option("[data-testid='payment']", label="Tarjeta")
    page.fill("[data-testid='card-number']", "4111111111111111")
    page.check("[data-testid='terms']")

    page.click("[data-testid='place-order']")

    # Verificar mensaje de error
    expect(page.locator("[data-testid='payment-error']")).to_be_visible()
    expect(page.locator("[data-testid='payment-error']")).to_contain_text(
        "Fondos insuficientes"
    )
    # Verificar que NO navega a la confirmación
    expect(page).not_to_have_url("**/confirmation")</code></pre>

        <h3>📊 Resultados esperados</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #2e7d32; color: white;">
                        <th style="padding: 10px;">Métrica</th>
                        <th style="padding: 10px;">Con backend real</th>
                        <th style="padding: 10px;">Con mocks</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #e8f5e9;">
                        <td style="padding: 8px;">Tiempo de ejecución (6 tests)</td>
                        <td style="padding: 8px;">~30-45 segundos</td>
                        <td style="padding: 8px;">~3-5 segundos</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Dependencia de infraestructura</td>
                        <td style="padding: 8px;">BD + API + servicios</td>
                        <td style="padding: 8px;">Ninguna</td>
                    </tr>
                    <tr style="background: #e8f5e9;">
                        <td style="padding: 8px;">Estabilidad</td>
                        <td style="padding: 8px;">Depende de red/BD</td>
                        <td style="padding: 8px;">100% determinístico</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Escenarios de error</td>
                        <td style="padding: 8px;">Difíciles de reproducir</td>
                        <td style="padding: 8px;">Triviales con mocks</td>
                    </tr>
                    <tr style="background: #e8f5e9;">
                        <td style="padding: 8px;">CI/CD friendly</td>
                        <td style="padding: 8px;">Necesita ambiente completo</td>
                        <td style="padding: 8px;">Solo Node + Playwright</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>📝 Cuándo usar mocks vs backend real</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #e65100; color: white;">
                        <th style="padding: 10px;">Usar mocks</th>
                        <th style="padding: 10px;">Usar backend real</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 8px;">Tests de componentes UI</td>
                        <td style="padding: 8px;">Tests E2E de integración final</td>
                    </tr>
                    <tr style="background: #fff8e1;">
                        <td style="padding: 8px;">Escenarios de error (500, timeout)</td>
                        <td style="padding: 8px;">Flujos críticos de negocio</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Edge cases y estados vacíos</td>
                        <td style="padding: 8px;">Verificar integración real</td>
                    </tr>
                    <tr style="background: #fff8e1;">
                        <td style="padding: 8px;">CI/CD (ejecución rápida)</td>
                        <td style="padding: 8px;">Smoke tests en staging</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Desarrollo de UI sin backend</td>
                        <td style="padding: 8px;">Validación pre-release</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip SIESA:</strong> En SIESA usamos una estrategia híbrida:
            <strong>80% de tests con mocks</strong> (rápidos, en CI) y
            <strong>20% de tests E2E reales</strong> (nocturnos, contra staging).
            Los mocks cubren la lógica de UI, los E2E verifican la integración real.
        </div>

        <h3>🎓 Sección 9 completada</h3>
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin: 15px 0; text-align: center;">
            <h3 style="color: white; margin-bottom: 10px;">🏆 ¡Felicitaciones!</h3>
            <p>Has completado la <strong>Sección 9: Network Interception y Mocking</strong>.
            Ahora puedes crear tests aislados, rápidos y confiables que no dependen
            del backend.</p>
            <p style="font-size: 0.9em; margin-top: 10px;">
                <strong>Siguiente:</strong> Sección 10 — API Testing con Playwright
            </p>
        </div>

        <h3>🎯 Ejercicio final</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Extiende el proyecto con:</p>
            <ol>
                <li>Test de búsqueda con resultados filtrados (mock diferente por query)</li>
                <li>Test de paginación (mock con diferentes páginas)</li>
                <li>Test de timeout de red (simular API que no responde)</li>
                <li>Test que capture y valide las headers enviadas en cada request</li>
            </ol>
        </div>
    `,
    topics: ["proyecto", "mocking", "api"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 10,
    difficulty: "medium",
    type: "integration"
};

if (typeof window !== 'undefined') {
    window.LESSON_070 = LESSON_070;
}
