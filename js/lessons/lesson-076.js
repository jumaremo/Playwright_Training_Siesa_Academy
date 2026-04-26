/**
 * Playwright Academy - Lección 076
 * API mocking para tests de UI
 * Sección 10: API Testing con Playwright
 */

const LESSON_076 = {
    id: 76,
    title: "API mocking para tests de UI",
    duration: "7 min",
    level: "intermediate",
    section: "section-10",
    content: `
        <h2>🎭 API mocking para tests de UI</h2>
        <p>Esta lección cierra la Sección 10 unificando todo: cómo usar
        <strong>mocking de APIs</strong> específicamente para tests de UI, cuándo mockear vs usar
        el backend real, y patrones avanzados que combinan mocking parcial con requests reales.</p>

        <h3>🔀 Mocking parcial: Algunas APIs reales, otras mock</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>El escenario más realista: mockear solo las APIs que necesitas controlar
            y dejar el resto funcionar normalmente.</p>
            <div class="code-tabs" data-code-id="L076-1">
            <div class="code-tabs-header">
                <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                    <span class="code-tab-icon">🐍</span> Python
                </button>
                <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                    <span class="code-tab-icon">🔷</span> TypeScript
                </button>
                <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar código">📋</button>
            </div>
            <div class="code-panel active" data-lang="python">
                <pre><code class="language-python">import json

def test_ui_con_mocking_parcial(page):
    """Mock solo la API de pagos, el resto funciona normal."""

    # Solo mockear la API de pagos (servicio externo, lento)
    page.route("**/api/payments/**", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body=json.dumps({
            "transaction_id": "TXN-MOCK-001",
            "status": "approved",
            "amount": 150000
        })
    ))

    # El resto de APIs funcionan normal contra el servidor real
    # /api/products → servidor real
    # /api/cart → servidor real
    # /api/users → servidor real

    page.goto("https://mi-app.com/checkout")
    # ... interactuar con la UI
    page.click("[data-testid='pay-btn']")

    # La UI recibe la respuesta mock de pagos
    expect(page.locator("[data-testid='payment-success']")).to_be_visible()
    expect(page.locator("[data-testid='txn-id']")).to_have_text("TXN-MOCK-001")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('UI con mocking parcial', async ({ page }) => {
    // Solo mockear la API de pagos (servicio externo, lento)
    await page.route('**/api/payments/**', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                transaction_id: 'TXN-MOCK-001',
                status: 'approved',
                amount: 150000,
            }),
        });
    });

    // El resto de APIs funcionan normal contra el servidor real
    // /api/products → servidor real
    // /api/cart → servidor real
    // /api/users → servidor real

    await page.goto('https://mi-app.com/checkout');
    // ... interactuar con la UI
    await page.click('[data-testid="pay-btn"]');

    // La UI recibe la respuesta mock de pagos
    await expect(page.locator('[data-testid="payment-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="txn-id"]')).toHaveText('TXN-MOCK-001');
});</code></pre>
            </div>
            </div>
        </div>

        <h3>🧰 MockManager: Clase para gestionar mocks de UI</h3>
        <div class="code-tabs" data-code-id="L076-2">
        <div class="code-tabs-header">
            <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">🐍</span> Python
            </button>
            <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">🔷</span> TypeScript
            </button>
            <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar código">📋</button>
        </div>
        <div class="code-panel active" data-lang="python">
            <pre><code class="language-python"># helpers/mock_manager.py
import json
from pathlib import Path

class MockManager:
    """Gestiona mocks de API para tests de UI."""

    def __init__(self, page, mocks_dir="test-data/mocks"):
        self.page = page
        self.mocks_dir = Path(mocks_dir)
        self._active_mocks = []

    def mock_api(self, pattern, data, status=200):
        """Mockear un endpoint con datos inline."""
        body = json.dumps(data) if not isinstance(data, str) else data

        def handler(route):
            route.fulfill(
                status=status,
                content_type="application/json",
                body=body
            )

        self.page.route(pattern, handler)
        self._active_mocks.append(pattern)
        return self

    def mock_from_file(self, pattern, filename, status=200):
        """Mockear un endpoint con datos de archivo."""
        path = self.mocks_dir / filename
        content = path.read_text(encoding="utf-8")

        def handler(route):
            route.fulfill(
                status=status,
                content_type="application/json",
                body=content
            )

        self.page.route(pattern, handler)
        self._active_mocks.append(pattern)
        return self

    def mock_error(self, pattern, status=500, message="Error"):
        """Mockear un endpoint para que retorne error."""
        return self.mock_api(pattern, {"error": message}, status)

    def mock_empty_list(self, pattern):
        """Mockear un endpoint que retorna lista vacía."""
        return self.mock_api(pattern, {"data": [], "total": 0})

    def mock_slow(self, pattern, data, delay_ms=3000):
        """Mockear con delay para simular respuesta lenta."""
        import time
        body = json.dumps(data)

        def handler(route):
            time.sleep(delay_ms / 1000)
            route.fulfill(
                status=200,
                content_type="application/json",
                body=body
            )

        self.page.route(pattern, handler)
        self._active_mocks.append(pattern)
        return self

    def scenario(self, name):
        """Cargar un escenario completo de mocks desde directorio."""
        scenario_dir = self.mocks_dir / "scenarios" / name
        for mock_file in scenario_dir.glob("*.json"):
            config = json.loads(mock_file.read_text(encoding="utf-8"))
            self.mock_api(
                config["pattern"],
                config["response"],
                config.get("status", 200)
            )
        return self

    def cleanup(self):
        """Remover todos los mocks activos."""
        for pattern in self._active_mocks:
            self.page.unroute(pattern)
        self._active_mocks.clear()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// helpers/mock-manager.ts
import fs from 'fs';
import path from 'path';
import type { Page } from '@playwright/test';

export class MockManager {
    private page: Page;
    private mocksDir: string;
    private activeMocks: string[] = [];

    constructor(page: Page, mocksDir = 'test-data/mocks') {
        this.page = page;
        this.mocksDir = mocksDir;
    }

    async mockApi(pattern: string, data: unknown, status = 200) {
        const body = typeof data === 'string' ? data : JSON.stringify(data);
        await this.page.route(pattern, async (route) => {
            await route.fulfill({
                status, contentType: 'application/json', body,
            });
        });
        this.activeMocks.push(pattern);
        return this;
    }

    async mockFromFile(pattern: string, filename: string, status = 200) {
        const content = fs.readFileSync(
            path.join(this.mocksDir, filename), 'utf-8'
        );
        await this.page.route(pattern, async (route) => {
            await route.fulfill({
                status, contentType: 'application/json', body: content,
            });
        });
        this.activeMocks.push(pattern);
        return this;
    }

    async mockError(pattern: string, status = 500, message = 'Error') {
        return this.mockApi(pattern, { error: message }, status);
    }

    async mockEmptyList(pattern: string) {
        return this.mockApi(pattern, { data: [], total: 0 });
    }

    async mockSlow(pattern: string, data: unknown, delayMs = 3000) {
        const body = JSON.stringify(data);
        await this.page.route(pattern, async (route) => {
            await new Promise((r) => setTimeout(r, delayMs));
            await route.fulfill({
                status: 200, contentType: 'application/json', body,
            });
        });
        this.activeMocks.push(pattern);
        return this;
    }

    async scenario(name: string) {
        const scenarioDir = path.join(this.mocksDir, 'scenarios', name);
        const files = fs.readdirSync(scenarioDir).filter(f => f.endsWith('.json'));
        for (const file of files) {
            const config = JSON.parse(
                fs.readFileSync(path.join(scenarioDir, file), 'utf-8')
            );
            await this.mockApi(
                config.pattern, config.response, config.status ?? 200
            );
        }
        return this;
    }

    async cleanup() {
        for (const pattern of this.activeMocks) {
            await this.page.unroute(pattern);
        }
        this.activeMocks = [];
    }
}</code></pre>
        </div>
        </div>

        <h3>⚙️ Integración con fixtures</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L076-3">
            <div class="code-tabs-header">
                <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                    <span class="code-tab-icon">🐍</span> Python
                </button>
                <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                    <span class="code-tab-icon">🔷</span> TypeScript
                </button>
                <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar código">📋</button>
            </div>
            <div class="code-panel active" data-lang="python">
                <pre><code class="language-python"># conftest.py
import pytest
from helpers.mock_manager import MockManager

@pytest.fixture
def mocks(page):
    """Fixture que provee MockManager."""
    manager = MockManager(page)
    yield manager
    manager.cleanup()

@pytest.fixture
def catalog_with_products(mocks, page):
    """UI con catálogo cargado de productos mock."""
    mocks.mock_from_file("**/api/products*", "products/full.json")
    mocks.mock_api("**/api/cart", {"items": [], "total": 0})
    page.goto("https://mi-app.com/products")
    return mocks

@pytest.fixture
def checkout_ready(mocks, page):
    """UI en checkout con carrito lleno (mock)."""
    mocks.mock_from_file("**/api/cart", "cart/with_items.json")
    mocks.mock_api("**/api/shipping/options", [
        {"id": "standard", "name": "Estándar", "price": 10000, "days": 5},
        {"id": "express", "name": "Express", "price": 25000, "days": 1},
    ])
    page.goto("https://mi-app.com/checkout")
    return mocks</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// fixtures.ts
import { test as base } from '@playwright/test';
import { MockManager } from '../helpers/mock-manager';

type MockFixtures = {
    mocks: MockManager;
    catalogWithProducts: MockManager;
    checkoutReady: MockManager;
};

export const test = base.extend&lt;MockFixtures&gt;({
    mocks: async ({ page }, use) => {
        const manager = new MockManager(page);
        await use(manager);
        await manager.cleanup();
    },

    catalogWithProducts: async ({ mocks, page }, use) => {
        await mocks.mockFromFile('**/api/products*', 'products/full.json');
        await mocks.mockApi('**/api/cart', { items: [], total: 0 });
        await page.goto('https://mi-app.com/products');
        await use(mocks);
    },

    checkoutReady: async ({ mocks, page }, use) => {
        await mocks.mockFromFile('**/api/cart', 'cart/with_items.json');
        await mocks.mockApi('**/api/shipping/options', [
            { id: 'standard', name: 'Estándar', price: 10000, days: 5 },
            { id: 'express', name: 'Express', price: 25000, days: 1 },
        ]);
        await page.goto('https://mi-app.com/checkout');
        await use(mocks);
    },
});</code></pre>
            </div>
            </div>
        </div>

        <h3>🧪 Tests de UI con mocks organizados por escenario</h3>
        <div class="code-tabs" data-code-id="L076-4">
        <div class="code-tabs-header">
            <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">🐍</span> Python
            </button>
            <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">🔷</span> TypeScript
            </button>
            <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar código">📋</button>
        </div>
        <div class="code-panel active" data-lang="python">
            <pre><code class="language-python"># test_catalog_ui.py
from playwright.sync_api import expect

def test_catalogo_muestra_productos(catalog_with_products, page):
    """UI muestra productos desde mock."""
    expect(page.locator("[data-testid='product-card']")).not_to_have_count(0)
    expect(page.locator("[data-testid='product-card']").first).to_contain_text("$")

def test_catalogo_vacio_muestra_empty_state(mocks, page):
    """UI muestra estado vacío cuando no hay productos."""
    mocks.mock_empty_list("**/api/products*")
    mocks.mock_api("**/api/cart", {"items": [], "total": 0})
    page.goto("https://mi-app.com/products")

    expect(page.locator("[data-testid='empty-state']")).to_be_visible()
    expect(page.locator("[data-testid='product-card']")).to_have_count(0)

def test_catalogo_error_muestra_mensaje(mocks, page):
    """UI muestra error cuando la API falla."""
    mocks.mock_error("**/api/products*", 500, "Error interno")
    page.goto("https://mi-app.com/products")

    expect(page.locator("[data-testid='error-state']")).to_be_visible()
    expect(page.locator("[data-testid='retry-btn']")).to_be_visible()

def test_catalogo_loading_durante_carga_lenta(mocks, page):
    """UI muestra spinner cuando la API es lenta."""
    products = [{"id": 1, "name": "Test", "price": 1000}]
    mocks.mock_slow("**/api/products*", {"data": products}, delay_ms=3000)
    mocks.mock_api("**/api/cart", {"items": [], "total": 0})
    page.goto("https://mi-app.com/products")

    # Spinner visible durante la carga
    expect(page.locator("[data-testid='loading']")).to_be_visible()
    # Spinner desaparece cuando llegan los datos
    expect(page.locator("[data-testid='loading']")).to_be_hidden(timeout=10000)
    expect(page.locator("[data-testid='product-card']")).to_have_count(1)


# test_checkout_ui.py
def test_checkout_exitoso(checkout_ready, page):
    """Flujo de checkout completo con mocks."""
    # Mockear la respuesta de crear pedido
    checkout_ready.mock_api("**/api/orders", {
        "id": 12345,
        "status": "confirmed",
        "total": 85000
    }, status=201)

    page.fill("[data-testid='name']", "Juan Reina")
    page.fill("[data-testid='email']", "juan@siesa.com")
    page.fill("[data-testid='address']", "Calle 5 #38-25")
    page.select_option("[data-testid='shipping']", value="standard")
    page.check("[data-testid='terms']")
    page.click("[data-testid='place-order']")

    expect(page.locator("[data-testid='order-success']")).to_be_visible()
    expect(page.locator("[data-testid='order-id']")).to_have_text("12345")

def test_checkout_pago_rechazado(checkout_ready, page):
    """UI maneja error de pago correctamente."""
    checkout_ready.mock_error(
        "**/api/orders", 402,
        "Pago rechazado: fondos insuficientes"
    )

    page.fill("[data-testid='name']", "Test User")
    page.fill("[data-testid='email']", "test@test.com")
    page.fill("[data-testid='address']", "Dirección test")
    page.check("[data-testid='terms']")
    page.click("[data-testid='place-order']")

    expect(page.locator("[data-testid='payment-error']")).to_be_visible()
    expect(page.locator("[data-testid='payment-error']")).to_contain_text(
        "fondos insuficientes"
    )</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// test-catalog-ui.spec.ts
import { test } from './fixtures';
import { expect } from '@playwright/test';

test('catálogo muestra productos', async ({ catalogWithProducts, page }) => {
    await expect(page.locator('[data-testid="product-card"]')).not.toHaveCount(0);
    await expect(page.locator('[data-testid="product-card"]').first())
        .toContainText('$');
});

test('catálogo vacío muestra empty state', async ({ mocks, page }) => {
    await mocks.mockEmptyList('**/api/products*');
    await mocks.mockApi('**/api/cart', { items: [], total: 0 });
    await page.goto('https://mi-app.com/products');

    await expect(page.locator('[data-testid="empty-state"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(0);
});

test('catálogo error muestra mensaje', async ({ mocks, page }) => {
    await mocks.mockError('**/api/products*', 500, 'Error interno');
    await page.goto('https://mi-app.com/products');

    await expect(page.locator('[data-testid="error-state"]')).toBeVisible();
    await expect(page.locator('[data-testid="retry-btn"]')).toBeVisible();
});

test('catálogo loading durante carga lenta', async ({ mocks, page }) => {
    const products = [{ id: 1, name: 'Test', price: 1000 }];
    await mocks.mockSlow('**/api/products*', { data: products }, 3000);
    await mocks.mockApi('**/api/cart', { items: [], total: 0 });
    await page.goto('https://mi-app.com/products');

    await expect(page.locator('[data-testid="loading"]')).toBeVisible();
    await expect(page.locator('[data-testid="loading"]'))
        .toBeHidden({ timeout: 10000 });
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1);
});

// test-checkout-ui.spec.ts
test('checkout exitoso', async ({ checkoutReady, page }) => {
    await checkoutReady.mockApi('**/api/orders', {
        id: 12345, status: 'confirmed', total: 85000,
    }, 201);

    await page.fill('[data-testid="name"]', 'Juan Reina');
    await page.fill('[data-testid="email"]', 'juan@siesa.com');
    await page.fill('[data-testid="address"]', 'Calle 5 #38-25');
    await page.selectOption('[data-testid="shipping"]', 'standard');
    await page.check('[data-testid="terms"]');
    await page.click('[data-testid="place-order"]');

    await expect(page.locator('[data-testid="order-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="order-id"]')).toHaveText('12345');
});

test('checkout pago rechazado', async ({ checkoutReady, page }) => {
    await checkoutReady.mockError(
        '**/api/orders', 402, 'Pago rechazado: fondos insuficientes'
    );

    await page.fill('[data-testid="name"]', 'Test User');
    await page.fill('[data-testid="email"]', 'test@test.com');
    await page.fill('[data-testid="address"]', 'Dirección test');
    await page.check('[data-testid="terms"]');
    await page.click('[data-testid="place-order"]');

    await expect(page.locator('[data-testid="payment-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="payment-error"]'))
        .toContainText('fondos insuficientes');
});</code></pre>
        </div>
        </div>

        <h3>📊 Guía: ¿Cuándo mockear vs backend real?</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #e65100; color: white;">
                        <th style="padding: 10px;">Tipo de test</th>
                        <th style="padding: 10px;">¿Mockear?</th>
                        <th style="padding: 10px;">Razón</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #e8f5e9;">
                        <td style="padding: 8px;">Componentes UI (estados)</td>
                        <td style="padding: 8px;">✅ Sí</td>
                        <td style="padding: 8px;">Control total de datos</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Manejo de errores UI</td>
                        <td style="padding: 8px;">✅ Sí</td>
                        <td style="padding: 8px;">Difícil provocar errores reales</td>
                    </tr>
                    <tr style="background: #e8f5e9;">
                        <td style="padding: 8px;">Loading states</td>
                        <td style="padding: 8px;">✅ Sí</td>
                        <td style="padding: 8px;">Necesitas controlar el timing</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Edge cases (listas vacías)</td>
                        <td style="padding: 8px;">✅ Sí</td>
                        <td style="padding: 8px;">Difícil tener BD vacía</td>
                    </tr>
                    <tr style="background: #ffebee;">
                        <td style="padding: 8px;">Flujos críticos E2E</td>
                        <td style="padding: 8px;">❌ No</td>
                        <td style="padding: 8px;">Necesitas integración real</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Smoke tests pre-release</td>
                        <td style="padding: 8px;">❌ No</td>
                        <td style="padding: 8px;">Validar contra prod/staging</td>
                    </tr>
                    <tr style="background: #fff8e1;">
                        <td style="padding: 8px;">Setup de datos</td>
                        <td style="padding: 8px;">🔀 Depende</td>
                        <td style="padding: 8px;">API directa para setup, mock para servicios externos</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Estrategia SIESA:</strong> Usamos una pirámide de tests:
            <strong>70% con mocks</strong> (unitarios de UI, rápidos en CI),
            <strong>20% con API real</strong> (integración, nocturnos),
            <strong>10% E2E completos</strong> (smoke tests pre-release contra staging).
        </div>

        <h3>🎓 Sección 10 completada</h3>
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin: 15px 0; text-align: center;">
            <h3 style="color: white; margin-bottom: 10px;">🏆 ¡Felicitaciones!</h3>
            <p>Has completado la <strong>Sección 10: API Testing con Playwright</strong>.
            Ahora puedes testear APIs directamente, combinar tests de API + UI, validar
            schemas y usar mocking estratégicamente.</p>
            <p style="font-size: 0.9em; margin-top: 10px;">
                <strong>Siguiente:</strong> Sección 11 — Screenshots, Videos y Visual Testing
            </p>
        </div>

        <h3>🎯 Ejercicio final</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Crea una suite de 4 tests para un dashboard:</p>
            <ol>
                <li><strong>Happy path:</strong> Dashboard con todos los widgets cargados (mock 3 APIs)</li>
                <li><strong>Error parcial:</strong> Widget de ventas falla (mock error 500), otros OK</li>
                <li><strong>Todo vacío:</strong> Todos los endpoints retornan listas vacías</li>
                <li><strong>Timeout:</strong> Un widget tarda 10s en cargar (mock slow), verificar spinner</li>
            </ol>
        </div>
    `,
    topics: ["mocking", "api", "ui"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_076 = LESSON_076;
}
