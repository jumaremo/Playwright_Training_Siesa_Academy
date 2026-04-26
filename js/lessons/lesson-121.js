/**
 * Playwright Academy - Leccion 121
 * Testing microservicios y APIs distribuidas
 * Seccion 18: Arquitecturas y Patrones Enterprise
 */

const LESSON_121 = {
    id: 121,
    title: "Testing microservicios y APIs distribuidas",
    duration: "7 min",
    level: "advanced",
    section: "section-18",
    content: `
        <h2>Testing microservicios y APIs distribuidas</h2>
        <p>Las aplicaciones modernas rara vez son monoliticas. En arquitecturas de microservicios,
        el frontend interactua con multiples APIs que a su vez se comunican entre si. Probar estos
        sistemas requiere estrategias especificas: <strong>service virtualization</strong>, testing
        de contratos, y orquestacion de entornos con Docker Compose. En esta leccion aprenderas a
        usar Playwright para validar flujos end-to-end que cruzan multiples servicios.</p>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>El ERP de SIESA tiene una arquitectura modular donde Nomina, Contabilidad, Inventarios
            y CRM se comunican a traves de APIs internas. El equipo de QA ejecuta tests E2E que
            validan flujos cross-modulo: por ejemplo, crear un empleado en Nomina y verificar
            que su registro aparece automaticamente en Contabilidad para provision de prestaciones.</p>
        </div>

        <h3>Piramide de testing para microservicios</h3>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Nivel</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Que valida</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Herramienta</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Cantidad</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>E2E (UI)</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Flujo completo del usuario a traves de servicios</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Playwright</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Pocos (criticos)</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Integracion API</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Comunicacion entre servicios</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Playwright API + pytest</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Moderados</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Contrato</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Schema y formato de respuestas API</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Pact, Schemathesis</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Muchos</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Unitario</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Logica interna de cada servicio</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">pytest</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Muchos</td>
                </tr>
            </table>
        </div>

        <h3>Docker Compose para entornos de test</h3>
        <p>El primer paso es levantar todos los servicios necesarios en un entorno aislado:</p>

        <pre><code class="yaml"># docker-compose.test.yml
version: '3.8'

services:
  # ---- Frontend ----
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - API_GATEWAY_URL=http://gateway:8080
    depends_on:
      gateway:
        condition: service_healthy

  # ---- API Gateway ----
  gateway:
    build: ./services/gateway
    ports:
      - "8080:8080"
    environment:
      - AUTH_SERVICE_URL=http://auth:8001
      - INVENTORY_SERVICE_URL=http://inventory:8002
      - ORDER_SERVICE_URL=http://orders:8003
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 5s
      retries: 5

  # ---- Microservicios ----
  auth:
    build: ./services/auth
    environment:
      - DATABASE_URL=postgres://test:test@db:5432/auth_db
    depends_on:
      db:
        condition: service_healthy

  inventory:
    build: ./services/inventory
    environment:
      - DATABASE_URL=postgres://test:test@db:5432/inventory_db

  orders:
    build: ./services/orders
    environment:
      - DATABASE_URL=postgres://test:test@db:5432/orders_db
      - INVENTORY_SERVICE_URL=http://inventory:8002

  # ---- Base de datos ----
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U test"]
      interval: 3s
      retries: 5</code></pre>

        <h3>Health checks y readiness</h3>
        <p>Antes de ejecutar tests, todos los servicios deben estar listos:</p>

        <div class="code-tabs" data-code-id="L121-1">
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
<pre><code class="language-python"># conftest.py - Verificar que todos los servicios estan disponibles
import pytest
import requests
import time

SERVICES = {
    "frontend": "http://localhost:3000",
    "gateway": "http://localhost:8080/health",
    "auth": "http://localhost:8080/api/auth/health",
    "inventory": "http://localhost:8080/api/inventory/health",
    "orders": "http://localhost:8080/api/orders/health",
}

def wait_for_services(timeout=60):
    """Esperar a que todos los servicios esten disponibles."""
    start = time.time()
    pending = set(SERVICES.keys())

    while pending and (time.time() - start) < timeout:
        for name in list(pending):
            try:
                resp = requests.get(SERVICES[name], timeout=2)
                if resp.status_code == 200:
                    pending.discard(name)
                    print(f"  [OK] {name}")
            except requests.exceptions.ConnectionError:
                pass
        if pending:
            time.sleep(2)

    if pending:
        raise RuntimeError(f"Servicios no disponibles: {pending}")

@pytest.fixture(scope="session", autouse=True)
def ensure_services_ready():
    """Verificar todos los servicios antes de ejecutar tests."""
    print("Verificando servicios...")
    wait_for_services()
    print("Todos los servicios disponibles.")</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// global-setup.ts - Verificar que todos los servicios estan disponibles

const SERVICES: Record&lt;string, string&gt; = {
  frontend: "http://localhost:3000",
  gateway: "http://localhost:8080/health",
  auth: "http://localhost:8080/api/auth/health",
  inventory: "http://localhost:8080/api/inventory/health",
  orders: "http://localhost:8080/api/orders/health",
};

async function waitForServices(timeout = 60000): Promise&lt;void&gt; {
  /** Esperar a que todos los servicios esten disponibles. */
  const start = Date.now();
  const pending = new Set(Object.keys(SERVICES));

  while (pending.size > 0 && (Date.now() - start) < timeout) {
    for (const name of [...pending]) {
      try {
        const resp = await fetch(SERVICES[name], {
          signal: AbortSignal.timeout(2000),
        });
        if (resp.ok) {
          pending.delete(name);
          console.log(\`  [OK] \${name}\`);
        }
      } catch {
        // Servicio aun no disponible
      }
    }
    if (pending.size > 0) {
      await new Promise((r) =&gt; setTimeout(r, 2000));
    }
  }

  if (pending.size > 0) {
    throw new Error(\`Servicios no disponibles: \${[...pending].join(", ")}\`);
  }
}

// Ejecutar como globalSetup en playwright.config.ts
async function globalSetup() {
  console.log("Verificando servicios...");
  await waitForServices();
  console.log("Todos los servicios disponibles.");
}

export default globalSetup;</code></pre>
</div>
</div>

        <h3>Tests E2E cross-service</h3>
        <p>Tests que validan flujos que cruzan multiples microservicios:</p>

        <div class="code-tabs" data-code-id="L121-2">
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
<pre><code class="language-python"># tests/e2e/test_purchase_flow.py
"""
Flujo: Usuario -> Auth -> Inventory -> Orders
Test E2E que cruza 4 microservicios.
"""
from playwright.sync_api import expect

def test_complete_purchase_flow(page, api_context):
    """Flujo completo de compra: login, buscar, agregar al carrito, pagar."""

    # ---- ARRANGE: Login (Auth Service) ----
    page.goto("/auth/login")
    page.fill("[data-testid='email']", "customer@test.com")
    page.fill("[data-testid='password']", "Test1234!")
    page.click("[data-testid='login-btn']")
    page.wait_for_url("**/dashboard")

    # ---- ACT: Buscar y comprar producto (Inventory + Orders) ----
    page.goto("/products")
    page.fill("[data-testid='search']", "Laptop")
    page.click("[data-testid='search-btn']")
    page.locator("[data-testid='product-card']").first.click()
    page.click("[data-testid='add-to-cart']")
    page.goto("/cart")
    page.click("[data-testid='checkout-btn']")
    page.fill("[data-testid='card-number']", "4111111111111111")
    page.fill("[data-testid='expiry']", "12/28")
    page.fill("[data-testid='cvv']", "123")
    page.click("[data-testid='pay-btn']")

    # ---- ASSERT: Verificar orden creada ----
    page.wait_for_url("**/orders/confirmation")
    expect(page.locator("[data-testid='order-status']")).to_have_text("Confirmada")
    order_id = page.locator("[data-testid='order-id']").text_content()

    # Verificar via API que la orden existe en el servicio de ordenes
    api_resp = api_context.get(f"/api/orders/{order_id}")
    assert api_resp.ok
    order_data = api_resp.json()
    assert order_data["status"] == "confirmed"

    # Verificar que el inventario se actualizo
    product_resp = api_context.get(f"/api/inventory/{order_data['product_id']}")
    assert product_resp.ok</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// tests/e2e/purchase-flow.spec.ts
/**
 * Flujo: Usuario -> Auth -> Inventory -> Orders
 * Test E2E que cruza 4 microservicios.
 */
import { test, expect } from '@playwright/test';

test('flujo completo de compra: login, buscar, agregar al carrito, pagar', async ({ page, request }) =&gt; {

  // ---- ARRANGE: Login (Auth Service) ----
  await page.goto('/auth/login');
  await page.fill('[data-testid="email"]', 'customer@test.com');
  await page.fill('[data-testid="password"]', 'Test1234!');
  await page.click('[data-testid="login-btn"]');
  await page.waitForURL('**/dashboard');

  // ---- ACT: Buscar y comprar producto (Inventory + Orders) ----
  await page.goto('/products');
  await page.fill('[data-testid="search"]', 'Laptop');
  await page.click('[data-testid="search-btn"]');
  await page.locator('[data-testid="product-card"]').first().click();
  await page.click('[data-testid="add-to-cart"]');
  await page.goto('/cart');
  await page.click('[data-testid="checkout-btn"]');
  await page.fill('[data-testid="card-number"]', '4111111111111111');
  await page.fill('[data-testid="expiry"]', '12/28');
  await page.fill('[data-testid="cvv"]', '123');
  await page.click('[data-testid="pay-btn"]');

  // ---- ASSERT: Verificar orden creada ----
  await page.waitForURL('**/orders/confirmation');
  await expect(page.locator('[data-testid="order-status"]')).toHaveText('Confirmada');
  const orderId = await page.locator('[data-testid="order-id"]').textContent();

  // Verificar via API que la orden existe en el servicio de ordenes
  const apiResp = await request.get(\`/api/orders/\${orderId}\`);
  expect(apiResp.ok()).toBeTruthy();
  const orderData = await apiResp.json();
  expect(orderData.status).toBe('confirmed');

  // Verificar que el inventario se actualizo
  const productResp = await request.get(\`/api/inventory/\${orderData.product_id}\`);
  expect(productResp.ok()).toBeTruthy();
});</code></pre>
</div>
</div>

        <h3>Service Virtualization con Playwright</h3>
        <p>Cuando un servicio externo no esta disponible o es inestable, puedes "virtualizarlo"
        interceptando las llamadas de red:</p>

        <div class="code-tabs" data-code-id="L121-3">
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
<pre><code class="language-python"># tests/test_with_mocked_service.py
"""
Virtualizar el servicio de pagos para tests estables.
"""
import json

def test_checkout_with_mocked_payment(page):
    """Simular el servicio de pagos para evitar dependencia externa."""

    # Interceptar llamadas al servicio de pagos
    def mock_payment_service(route):
        if "process-payment" in route.request.url:
            route.fulfill(
                status=200,
                content_type="application/json",
                body=json.dumps({
                    "transaction_id": "TXN-MOCK-12345",
                    "status": "approved",
                    "amount": 1299.99
                })
            )
        else:
            route.continue_()

    page.route("**/api/payments/**", mock_payment_service)

    # Ahora el test no depende del servicio de pagos real
    page.goto("/cart")
    page.click("[data-testid='checkout-btn']")
    page.fill("[data-testid='card-number']", "4111111111111111")
    page.fill("[data-testid='expiry']", "12/28")
    page.fill("[data-testid='cvv']", "123")
    page.click("[data-testid='pay-btn']")

    from playwright.sync_api import expect
    expect(page.locator("[data-testid='confirmation']")).to_be_visible()
    expect(page.locator("[data-testid='txn-id']")).to_have_text("TXN-MOCK-12345")</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// tests/mocked-service.spec.ts
/**
 * Virtualizar el servicio de pagos para tests estables.
 */
import { test, expect } from '@playwright/test';

test('simular el servicio de pagos para evitar dependencia externa', async ({ page }) =&gt; {

  // Interceptar llamadas al servicio de pagos
  await page.route('**/api/payments/**', async (route) =&gt; {
    if (route.request().url().includes('process-payment')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          transaction_id: 'TXN-MOCK-12345',
          status: 'approved',
          amount: 1299.99,
        }),
      });
    } else {
      await route.continue();
    }
  });

  // Ahora el test no depende del servicio de pagos real
  await page.goto('/cart');
  await page.click('[data-testid="checkout-btn"]');
  await page.fill('[data-testid="card-number"]', '4111111111111111');
  await page.fill('[data-testid="expiry"]', '12/28');
  await page.fill('[data-testid="cvv"]', '123');
  await page.click('[data-testid="pay-btn"]');

  await expect(page.locator('[data-testid="confirmation"]')).toBeVisible();
  await expect(page.locator('[data-testid="txn-id"]')).toHaveText('TXN-MOCK-12345');
});</code></pre>
</div>
</div>

        <h3>Contract testing basico</h3>
        <p>Los tests de contrato verifican que las APIs cumplen con el formato acordado:</p>

        <div class="code-tabs" data-code-id="L121-4">
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
<pre><code class="language-python"># tests/contract/test_api_contracts.py
"""Verificar que las APIs responden con el schema esperado."""
import pytest

INVENTORY_PRODUCT_SCHEMA = {
    "required": ["id", "name", "price", "stock"],
    "properties": {
        "id": {"type": "string"},
        "name": {"type": "string"},
        "price": {"type": "number", "minimum": 0},
        "stock": {"type": "integer", "minimum": 0},
    }
}

def validate_schema(data, schema):
    """Validacion simple de schema (sin jsonschema)."""
    for field in schema.get("required", []):
        assert field in data, f"Campo requerido ausente: {field}"

    for field, rules in schema.get("properties", {}).items():
        if field in data:
            expected_type = {"string": str, "number": (int, float), "integer": int}
            if rules.get("type") in expected_type:
                assert isinstance(data[field], expected_type[rules["type"]]), \\
                    f"{field}: esperado {rules['type']}, recibido {type(data[field])}"

def test_inventory_product_contract(api_context):
    """Verificar contrato del endpoint GET /api/inventory/products."""
    response = api_context.get("/api/inventory/products")
    assert response.ok

    products = response.json()
    assert isinstance(products, list)
    assert len(products) > 0

    for product in products[:5]:
        validate_schema(product, INVENTORY_PRODUCT_SCHEMA)

def test_orders_create_contract(api_context, auth_token):
    """Verificar contrato del endpoint POST /api/orders."""
    response = api_context.post("/api/orders", data={
        "product_id": "PROD-001",
        "quantity": 1
    }, headers={"Authorization": f"Bearer {auth_token}"})

    assert response.status == 201
    order = response.json()
    assert "order_id" in order
    assert "status" in order
    assert order["status"] in ["pending", "confirmed"]</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// tests/contract/api-contracts.spec.ts
/** Verificar que las APIs responden con el schema esperado. */
import { test, expect } from '@playwright/test';

interface SchemaRule {
  type?: string;
  minimum?: number;
}

interface Schema {
  required: string[];
  properties: Record&lt;string, SchemaRule&gt;;
}

const INVENTORY_PRODUCT_SCHEMA: Schema = {
  required: ['id', 'name', 'price', 'stock'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    price: { type: 'number', minimum: 0 },
    stock: { type: 'number', minimum: 0 },
  },
};

function validateSchema(data: Record&lt;string, unknown&gt;, schema: Schema): void {
  /** Validacion simple de schema. */
  for (const field of schema.required) {
    expect(data).toHaveProperty(field);
  }

  for (const [field, rules] of Object.entries(schema.properties)) {
    if (field in data) {
      if (rules.type === 'string') {
        expect(typeof data[field]).toBe('string');
      } else if (rules.type === 'number') {
        expect(typeof data[field]).toBe('number');
      }
    }
  }
}

test('verificar contrato del endpoint GET /api/inventory/products', async ({ request }) =&gt; {
  const response = await request.get('/api/inventory/products');
  expect(response.ok()).toBeTruthy();

  const products = await response.json();
  expect(Array.isArray(products)).toBeTruthy();
  expect(products.length).toBeGreaterThan(0);

  for (const product of products.slice(0, 5)) {
    validateSchema(product, INVENTORY_PRODUCT_SCHEMA);
  }
});

test('verificar contrato del endpoint POST /api/orders', async ({ request }) =&gt; {
  // authToken obtenido via fixture personalizado o storageState
  const response = await request.post('/api/orders', {
    data: {
      product_id: 'PROD-001',
      quantity: 1,
    },
  });

  expect(response.status()).toBe(201);
  const order = await response.json();
  expect(order).toHaveProperty('order_id');
  expect(order).toHaveProperty('status');
  expect(['pending', 'confirmed']).toContain(order.status);
});</code></pre>
</div>
</div>

        <h3>Estrategia de testing hibrida: UI + API</h3>

        <div class="code-tabs" data-code-id="L121-5">
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
<pre><code class="language-python"># tests/hybrid/test_user_management.py
"""Tests hibridos: setup via API, validacion via UI."""

def test_user_created_via_api_appears_in_ui(page, api_context, auth_token):
    """Crear usuario por API y verificar que aparece en la UI."""

    # ARRANGE: Crear usuario via API (rapido, confiable)
    response = api_context.post("/api/users", data={
        "email": "nuevo@siesa.com",
        "name": "Nuevo Usuario",
        "role": "viewer"
    }, headers={"Authorization": f"Bearer {auth_token}"})
    assert response.ok
    user_id = response.json()["id"]

    # ACT: Navegar a la pagina de usuarios en la UI
    page.goto("/admin/users")
    page.fill("[data-testid='search']", "nuevo@siesa.com")
    page.click("[data-testid='search-btn']")

    # ASSERT: Verificar que el usuario aparece
    from playwright.sync_api import expect
    user_row = page.locator(f"[data-testid='user-row-{user_id}']")
    expect(user_row).to_be_visible()
    expect(user_row.locator(".user-name")).to_have_text("Nuevo Usuario")
    expect(user_row.locator(".user-role")).to_have_text("viewer")</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// tests/hybrid/user-management.spec.ts
/** Tests hibridos: setup via API, validacion via UI. */
import { test, expect } from '@playwright/test';

test('crear usuario por API y verificar que aparece en la UI', async ({ page, request }) =&gt; {

  // ARRANGE: Crear usuario via API (rapido, confiable)
  const response = await request.post('/api/users', {
    data: {
      email: 'nuevo@siesa.com',
      name: 'Nuevo Usuario',
      role: 'viewer',
    },
  });
  expect(response.ok()).toBeTruthy();
  const { id: userId } = await response.json();

  // ACT: Navegar a la pagina de usuarios en la UI
  await page.goto('/admin/users');
  await page.fill('[data-testid="search"]', 'nuevo@siesa.com');
  await page.click('[data-testid="search-btn"]');

  // ASSERT: Verificar que el usuario aparece
  const userRow = page.locator(\`[data-testid="user-row-\${userId}"]\`);
  await expect(userRow).toBeVisible();
  await expect(userRow.locator('.user-name')).toHaveText('Nuevo Usuario');
  await expect(userRow.locator('.user-role')).toHaveText('viewer');
});</code></pre>
</div>
</div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Ejercicio Practico</h4>
            <p>Implementa tests para un sistema de microservicios:</p>
            <ol>
                <li>Crea un <code>docker-compose.test.yml</code> con al menos 3 servicios</li>
                <li>Implementa un fixture de health check que espere a todos los servicios</li>
                <li>Escribe un test E2E que cruce al menos 2 microservicios</li>
                <li>Crea un test hibrido que use API para setup y UI para verificacion</li>
                <li>Implementa service virtualization para un servicio de pagos</li>
            </ol>
        </div>

        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>En la siguiente leccion</strong> exploraras
            <strong>performance y carga basica</strong> con Playwright, aprendiendo a medir
            metricas web y ejecutar tests de rendimiento.</p>
        </div>
    `,
    topics: ["microservicios", "apis", "distribuidas"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "hard",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_121 = LESSON_121;
}
