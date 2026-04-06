/**
 * Playwright Academy - Leccion 130
 * API Microservices Testing
 * Seccion 20: Proyectos Capstone
 */

const LESSON_130 = {
    id: 130,
    title: "API Microservices Testing",
    duration: "20 min",
    level: "advanced",
    section: "section-20",
    content: `
        <h2>API Microservices Testing</h2>
        <p>En este proyecto capstone construiras una suite de testing para una arquitectura de
        <strong>microservicios con APIs REST</strong>. Usaras Playwright API context para validar
        endpoints, contratos, flujos de autenticacion, y la interaccion entre servicios.
        Tambien combinaras tests de API con validaciones de UI para pruebas hibridas completas.</p>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>El equipo de QA de SIESA mantiene mas de 200 tests de API que validan los endpoints
            del ERP: autenticacion, CRUD de entidades, reportes, y flujos inter-modulo. Estos tests
            se ejecutan en menos de 2 minutos y son la primera linea de defensa antes de los tests E2E.</p>
        </div>

        <h3>Arquitectura del sistema bajo test</h3>
        <pre><code class="text">                    ┌─────────────────┐
                    │   API Gateway   │
                    │   :8080         │
                    └───────┬─────────┘
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ Auth     │ │ Products │ │ Orders   │
        │ Service  │ │ Service  │ │ Service  │
        │ :8001    │ │ :8002    │ │ :8003    │
        └──────────┘ └──────────┘ └──────────┘
              │             │             │
              └─────────────┼─────────────┘
                            ▼
                    ┌──────────────┐
                    │  PostgreSQL  │
                    │  :5432       │
                    └──────────────┘</code></pre>

        <h3>API Client base</h3>

        <pre><code class="python"># services/api_client.py
from playwright.sync_api import APIRequestContext
from config.settings import settings
import logging

logger = logging.getLogger(__name__)

class APIClient:
    """Cliente base para interactuar con APIs de microservicios."""

    def __init__(self, api_context: APIRequestContext, base_url: str = None):
        self.api = api_context
        self.base = base_url or settings.api_url
        self.token = None

    def authenticate(self, email: str, password: str):
        resp = self.api.post(f"{self.base}/auth/login", data={
            "email": email, "password": password
        })
        assert resp.ok, f"Auth fallo: {resp.status} - {resp.text()}"
        self.token = resp.json()["token"]
        return self

    def _headers(self):
        h = {"Content-Type": "application/json"}
        if self.token:
            h["Authorization"] = f"Bearer {self.token}"
        return h

    def get(self, path, **kwargs):
        url = f"{self.base}{path}"
        logger.debug(f"GET {url}")
        return self.api.get(url, headers=self._headers(), **kwargs)

    def post(self, path, data=None, **kwargs):
        url = f"{self.base}{path}"
        logger.debug(f"POST {url}")
        return self.api.post(url, data=data, headers=self._headers(), **kwargs)

    def put(self, path, data=None, **kwargs):
        url = f"{self.base}{path}"
        return self.api.put(url, data=data, headers=self._headers(), **kwargs)

    def delete(self, path, **kwargs):
        url = f"{self.base}{path}"
        return self.api.delete(url, headers=self._headers(), **kwargs)</code></pre>

        <h3>Fixtures de API</h3>

        <pre><code class="python"># fixtures/api_fixtures.py
import pytest
from services.api_client import APIClient

@pytest.fixture(scope="session")
def api(playwright):
    """API Client autenticado como admin."""
    context = playwright.request.new_context()
    client = APIClient(context)
    client.authenticate("admin@siesa.com", "Admin1234!")
    yield client
    context.dispose()

@pytest.fixture
def create_product_api(api):
    """Factory para crear productos y limpiar despues."""
    created = []
    def _create(**kwargs):
        defaults = {"name": "Test Product", "price": 99.99, "stock": 50}
        data = {**defaults, **kwargs}
        resp = api.post("/products", data=data)
        assert resp.ok
        product = resp.json()
        created.append(product["id"])
        return product
    yield _create
    for pid in created:
        api.delete(f"/products/{pid}")

@pytest.fixture
def create_order_api(api, create_product_api):
    """Factory para crear ordenes completas."""
    created = []
    def _create(product_id=None, quantity=1):
        if not product_id:
            product = create_product_api()
            product_id = product["id"]
        resp = api.post("/orders", data={
            "product_id": product_id, "quantity": quantity
        })
        assert resp.ok
        order = resp.json()
        created.append(order["id"])
        return order
    yield _create
    for oid in created:
        api.delete(f"/orders/{oid}")</code></pre>

        <h3>Tests de CRUD</h3>

        <pre><code class="python"># tests/api/test_products_crud.py

class TestProductsCRUD:
    def test_create_product_returns_201(self, api):
        resp = api.post("/products", data={
            "name": "Laptop Dell XPS",
            "price": 2999.99,
            "stock": 10,
            "category": "electronics"
        })
        assert resp.status == 201
        product = resp.json()
        assert product["name"] == "Laptop Dell XPS"
        assert product["price"] == 2999.99
        assert "id" in product
        # Cleanup
        api.delete(f"/products/{product['id']}")

    def test_get_product_by_id(self, api, create_product_api):
        product = create_product_api(name="Mouse Logitech")
        resp = api.get(f"/products/{product['id']}")
        assert resp.ok
        data = resp.json()
        assert data["name"] == "Mouse Logitech"
        assert data["id"] == product["id"]

    def test_update_product_price(self, api, create_product_api):
        product = create_product_api(name="Teclado", price=59.99)
        resp = api.put(f"/products/{product['id']}", data={"price": 49.99})
        assert resp.ok
        assert resp.json()["price"] == 49.99

    def test_delete_product_returns_204(self, api, create_product_api):
        product = create_product_api(name="Para Eliminar")
        resp = api.delete(f"/products/{product['id']}")
        assert resp.status == 204
        # Verificar que ya no existe
        get_resp = api.get(f"/products/{product['id']}")
        assert get_resp.status == 404

    def test_list_products_returns_array(self, api, create_product_api):
        create_product_api(name="Prod A")
        create_product_api(name="Prod B")
        resp = api.get("/products")
        assert resp.ok
        products = resp.json()
        assert isinstance(products, list)
        assert len(products) >= 2</code></pre>

        <h3>Tests de autenticacion</h3>

        <pre><code class="python"># tests/api/test_auth.py
import pytest

class TestAuthentication:
    def test_login_returns_token(self, api):
        resp = api.api.post(f"{api.base}/auth/login", data={
            "email": "admin@siesa.com",
            "password": "Admin1234!"
        })
        assert resp.ok
        body = resp.json()
        assert "token" in body
        assert len(body["token"]) > 20

    def test_login_invalid_credentials_returns_401(self, api):
        resp = api.api.post(f"{api.base}/auth/login", data={
            "email": "admin@siesa.com",
            "password": "wrongpassword"
        })
        assert resp.status == 401

    def test_protected_endpoint_without_token_returns_401(self, playwright):
        ctx = playwright.request.new_context()
        client = APIClient(ctx)  # Sin autenticacion
        resp = client.get("/products")
        assert resp.status == 401
        ctx.dispose()

    def test_expired_token_returns_401(self, api):
        # Usar un token invalido/expirado
        api_copy = APIClient(api.api, api.base)
        api_copy.token = "expired.token.here"
        resp = api_copy.get("/products")
        assert resp.status == 401</code></pre>

        <h3>Tests de contrato</h3>

        <pre><code class="python"># tests/api/test_contracts.py

PRODUCT_SCHEMA = {
    "required": ["id", "name", "price", "stock", "category", "created_at"],
    "types": {
        "id": str, "name": str, "price": (int, float),
        "stock": int, "category": str, "created_at": str
    }
}

ORDER_SCHEMA = {
    "required": ["id", "product_id", "quantity", "total", "status", "created_at"],
    "types": {
        "id": str, "product_id": str, "quantity": int,
        "total": (int, float), "status": str, "created_at": str
    }
}

def validate_schema(data, schema):
    for field in schema["required"]:
        assert field in data, f"Campo requerido ausente: {field}"
    for field, expected_type in schema.get("types", {}).items():
        if field in data:
            assert isinstance(data[field], expected_type), \\
                f"{field}: esperado {expected_type}, tiene {type(data[field])}"

class TestContracts:
    def test_product_response_matches_schema(self, api, create_product_api):
        product = create_product_api()
        resp = api.get(f"/products/{product['id']}")
        validate_schema(resp.json(), PRODUCT_SCHEMA)

    def test_order_response_matches_schema(self, api, create_order_api):
        order = create_order_api()
        resp = api.get(f"/orders/{order['id']}")
        validate_schema(resp.json(), ORDER_SCHEMA)

    def test_list_endpoint_returns_array(self, api):
        resp = api.get("/products")
        assert isinstance(resp.json(), list)

    def test_error_response_has_message(self, api):
        resp = api.get("/products/nonexistent-id")
        assert resp.status == 404
        body = resp.json()
        assert "message" in body or "error" in body</code></pre>

        <h3>Tests hibridos: API + UI</h3>

        <pre><code class="python"># tests/hybrid/test_api_ui_integration.py
from playwright.sync_api import expect

def test_product_created_via_api_visible_in_ui(api, create_product_api, authenticated_page):
    # ARRANGE: crear producto via API
    product = create_product_api(name="Producto API-UI Test", price=149.99)

    # ACT: buscar en la UI
    page = authenticated_page
    page.goto("/products")
    page.fill("[data-testid='search-input']", "Producto API-UI Test")
    page.click("[data-testid='search-button']")

    # ASSERT: verificar que aparece en la UI
    expect(page.locator("[data-testid='product-card']")).to_have_count(1)
    expect(page.locator("[data-testid='product-name']")).to_have_text("Producto API-UI Test")

def test_order_created_in_ui_exists_in_api(api, product_in_cart):
    # Este test crea una orden via UI y verifica via API
    page = product_in_cart["page"]
    page.goto("/cart")
    page.click("[data-testid='checkout-button']")
    # ... completar checkout ...
    page.click("[data-testid='submit-order']")

    # Obtener order ID de la confirmacion
    order_id = page.locator("[data-testid='order-id']").text_content()

    # Verificar via API
    resp = api.get(f"/orders/{order_id}")
    assert resp.ok
    assert resp.json()["status"] in ["pending", "confirmed"]</code></pre>

        <h3>Criterios de evaluacion</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Criterio</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Pts</th>
                </tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">API Client reutilizable con auth</td><td style="padding: 8px; border: 1px solid #ddd;">15</td></tr>
                <tr style="background: #f5f5f5;"><td style="padding: 8px; border: 1px solid #ddd;">Tests CRUD completos (Create, Read, Update, Delete)</td><td style="padding: 8px; border: 1px solid #ddd;">20</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">Tests de autenticacion (token, 401, expirado)</td><td style="padding: 8px; border: 1px solid #ddd;">15</td></tr>
                <tr style="background: #f5f5f5;"><td style="padding: 8px; border: 1px solid #ddd;">Tests de contrato/schema</td><td style="padding: 8px; border: 1px solid #ddd;">15</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">Tests hibridos API + UI</td><td style="padding: 8px; border: 1px solid #ddd;">15</td></tr>
                <tr style="background: #f5f5f5;"><td style="padding: 8px; border: 1px solid #ddd;">Fixtures con cleanup automatico</td><td style="padding: 8px; border: 1px solid #ddd;">10</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">Organizacion y naming conventions</td><td style="padding: 8px; border: 1px solid #ddd;">10</td></tr>
                <tr style="background: #f5f5f5;"><td style="padding: 8px; border: 1px solid #ddd;"><strong>TOTAL</strong></td><td style="padding: 8px; border: 1px solid #ddd;"><strong>100</strong></td></tr>
            </table>
        </div>

        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>En el siguiente proyecto capstone</strong> construiras una suite de
            <strong>Multi-browser + Multi-device Testing</strong> que valide la aplicacion
            en multiples navegadores y dispositivos.</p>
        </div>
    `,
    topics: ["api", "microservicios", "capstone"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 20,
    difficulty: "hard",
    type: "capstone"
};

if (typeof window !== 'undefined') {
    window.LESSON_130 = LESSON_130;
}
