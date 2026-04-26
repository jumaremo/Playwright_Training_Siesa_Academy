/**
 * Playwright Academy - Lección 075
 * Combinando API + UI tests
 * Sección 10: API Testing con Playwright
 */

const LESSON_075 = {
    id: 75,
    title: "Combinando API + UI tests",
    duration: "7 min",
    level: "intermediate",
    section: "section-10",
    content: `
        <h2>🔗 Combinando API + UI tests</h2>
        <p>El verdadero poder de Playwright es combinar <strong>API calls directas</strong>
        con <strong>interacción de UI</strong> en el mismo test. Esto permite crear datos
        rápidamente via API y verificar la UI, o interactuar por UI y validar el resultado
        via API.</p>

        <h3>🎯 Patrones de combinación API + UI</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #1565c0; color: white;">
                        <th style="padding: 10px;">Patrón</th>
                        <th style="padding: 10px;">Descripción</th>
                        <th style="padding: 10px;">Caso de uso</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><strong>API Setup → UI Test</strong></td>
                        <td style="padding: 8px;">Crear datos por API, verificar en UI</td>
                        <td style="padding: 8px;">El más común — setup rápido</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>UI Action → API Verify</strong></td>
                        <td style="padding: 8px;">Interactuar por UI, validar via API</td>
                        <td style="padding: 8px;">Verificar que la UI guarda correctamente</td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><strong>API Setup → UI Test → API Cleanup</strong></td>
                        <td style="padding: 8px;">Setup + test + limpieza</td>
                        <td style="padding: 8px;">Tests aislados con datos limpios</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>API Login → UI Test</strong></td>
                        <td style="padding: 8px;">Autenticarse por API, navegar por UI</td>
                        <td style="padding: 8px;">Saltar la pantalla de login</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>📦 Patrón 1: API Setup → UI Test</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L075-1">
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
                <pre><code class="language-python"># Crear datos via API (rápido), verificar en UI

def test_producto_creado_aparece_en_catalogo(page):
    """Crear producto por API y verificar que aparece en la UI."""

    # SETUP via API (instantáneo, sin navegar por formularios)
    api = page.context.request
    create_response = api.post("https://mi-app.com/api/products", data={
        "name": "Laptop Test E2E",
        "price": 2500000,
        "category": "Electrónica",
        "stock": 10
    })
    assert create_response.status == 201
    product_id = create_response.json()["id"]

    # TEST en UI
    page.goto("https://mi-app.com/products")
    page.fill("[data-testid='search']", "Laptop Test E2E")
    page.click("[data-testid='search-btn']")

    # Verificar que el producto aparece
    product_card = page.locator("[data-testid='product-card']").filter(
        has_text="Laptop Test E2E"
    )
    expect(product_card).to_be_visible()
    expect(product_card).to_contain_text("$2,500,000")

    # CLEANUP via API
    api.delete(f"https://mi-app.com/api/products/{product_id}")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Crear datos via API (rápido), verificar en UI
import { test, expect } from '@playwright/test';

test('producto creado aparece en catálogo', async ({ page }) => {
    // SETUP via API (instantáneo, sin navegar por formularios)
    const api = page.context().request;
    const createResponse = await api.post('https://mi-app.com/api/products', {
        data: {
            name: 'Laptop Test E2E',
            price: 2500000,
            category: 'Electrónica',
            stock: 10,
        },
    });
    expect(createResponse.status()).toBe(201);
    const productId = (await createResponse.json()).id;

    // TEST en UI
    await page.goto('https://mi-app.com/products');
    await page.fill('[data-testid="search"]', 'Laptop Test E2E');
    await page.click('[data-testid="search-btn"]');

    // Verificar que el producto aparece
    const productCard = page.locator('[data-testid="product-card"]').filter({
        hasText: 'Laptop Test E2E',
    });
    await expect(productCard).toBeVisible();
    await expect(productCard).toContainText('$2,500,000');

    // CLEANUP via API
    await api.delete('https://mi-app.com/api/products/' + productId);
});</code></pre>
            </div>
            </div>
        </div>

        <h3>🖱️ Patrón 2: UI Action → API Verify</h3>
        <div class="code-tabs" data-code-id="L075-2">
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
            <pre><code class="language-python"># Interactuar por UI y verificar resultado via API

def test_formulario_guarda_datos_correctamente(page):
    """Llenar formulario por UI y verificar datos guardados via API."""

    page.goto("https://mi-app.com/users/new")

    # ACCIÓN por UI
    page.fill("[name='nombre']", "Carlos Díaz")
    page.fill("[name='email']", "carlos@siesa.com")
    page.fill("[name='telefono']", "3001234567")
    page.select_option("[name='rol']", label="QA Engineer")

    # Capturar la response del POST para obtener el ID
    with page.expect_response("**/api/users") as resp:
        page.click("[data-testid='save-btn']")

    user_id = resp.value.json()["id"]

    # VERIFICACIÓN via API (más confiable que solo la UI)
    api = page.context.request
    verify = api.get(f"https://mi-app.com/api/users/{user_id}")
    assert verify.ok

    user = verify.json()
    assert user["nombre"] == "Carlos Díaz"
    assert user["email"] == "carlos@siesa.com"
    assert user["telefono"] == "3001234567"
    assert user["rol"] == "qa_engineer"

    # Cleanup
    api.delete(f"https://mi-app.com/api/users/{user_id}")</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// Interactuar por UI y verificar resultado via API
import { test, expect } from '@playwright/test';

test('formulario guarda datos correctamente', async ({ page }) => {
    await page.goto('https://mi-app.com/users/new');

    // ACCIÓN por UI
    await page.fill('[name="nombre"]', 'Carlos Díaz');
    await page.fill('[name="email"]', 'carlos@siesa.com');
    await page.fill('[name="telefono"]', '3001234567');
    await page.selectOption('[name="rol"]', { label: 'QA Engineer' });

    // Capturar la response del POST para obtener el ID
    const respPromise = page.waitForResponse('**/api/users');
    await page.click('[data-testid="save-btn"]');
    const resp = await respPromise;

    const userId = (await resp.json()).id;

    // VERIFICACIÓN via API (más confiable que solo la UI)
    const api = page.context().request;
    const verify = await api.get('https://mi-app.com/api/users/' + userId);
    expect(verify.ok()).toBeTruthy();

    const user = await verify.json();
    expect(user.nombre).toBe('Carlos Díaz');
    expect(user.email).toBe('carlos@siesa.com');
    expect(user.telefono).toBe('3001234567');
    expect(user.rol).toBe('qa_engineer');

    // Cleanup
    await api.delete('https://mi-app.com/api/users/' + userId);
});</code></pre>
        </div>
        </div>

        <h3>🔄 Patrón 3: API Setup → UI Test → API Cleanup</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L075-3">
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
                <pre><code class="language-python"># Fixture que maneja setup y cleanup completo

@pytest.fixture
def test_task(page):
    """Crear tarea via API, proveerla al test, eliminar después."""
    api = page.context.request

    # SETUP
    resp = api.post("https://mi-app.com/api/tasks", data={
        "title": "Tarea para test UI",
        "description": "Creada por fixture",
        "priority": "high",
        "status": "pending",
    })
    task = resp.json()

    yield task

    # CLEANUP (siempre se ejecuta, incluso si el test falla)
    api.delete(f"https://mi-app.com/api/tasks/{task['id']}")

# Test limpio que usa la fixture
def test_editar_tarea_por_ui(page, test_task):
    """Editar una tarea existente desde la UI."""
    page.goto(f"https://mi-app.com/tasks/{test_task['id']}/edit")

    page.fill("[name='title']", "Título modificado por UI")
    page.select_option("[name='priority']", label="Baja")
    page.click("[data-testid='save']")

    expect(page.locator(".toast-success")).to_be_visible()

    # Verificar via API que los cambios se guardaron
    api = page.context.request
    verify = api.get(
        f"https://mi-app.com/api/tasks/{test_task['id']}"
    )
    updated = verify.json()
    assert updated["title"] == "Título modificado por UI"
    assert updated["priority"] == "low"</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Fixture que maneja setup y cleanup completo
import { test as base, expect } from '@playwright/test';

type TaskFixture = { testTask: Record&lt;string, unknown&gt; };

const test = base.extend&lt;TaskFixture&gt;({
    testTask: async ({ page }, use) => {
        const api = page.context().request;

        // SETUP
        const resp = await api.post('https://mi-app.com/api/tasks', {
            data: {
                title: 'Tarea para test UI',
                description: 'Creada por fixture',
                priority: 'high',
                status: 'pending',
            },
        });
        const task = await resp.json();

        await use(task);

        // CLEANUP (siempre se ejecuta, incluso si el test falla)
        await api.delete('https://mi-app.com/api/tasks/' + task.id);
    },
});

// Test limpio que usa la fixture
test('editar tarea por UI', async ({ page, testTask }) => {
    await page.goto('https://mi-app.com/tasks/' + testTask.id + '/edit');

    await page.fill('[name="title"]', 'Título modificado por UI');
    await page.selectOption('[name="priority"]', { label: 'Baja' });
    await page.click('[data-testid="save"]');

    await expect(page.locator('.toast-success')).toBeVisible();

    // Verificar via API que los cambios se guardaron
    const api = page.context().request;
    const verify = await api.get(
        'https://mi-app.com/api/tasks/' + testTask.id
    );
    const updated = await verify.json();
    expect(updated.title).toBe('Título modificado por UI');
    expect(updated.priority).toBe('low');
});</code></pre>
            </div>
            </div>
        </div>

        <h3>🔐 Patrón 4: API Login → UI Test</h3>
        <div class="code-tabs" data-code-id="L075-4">
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
            <pre><code class="language-python"># Autenticarse via API para no pasar por el formulario de login

@pytest.fixture
def fast_login(page):
    """Login via API — mucho más rápido que llenar el formulario."""
    api = page.context.request

    # Login via API
    login_resp = api.post("https://mi-app.com/api/auth/login", data={
        "email": "admin@test.com",
        "password": "admin123"
    })
    assert login_resp.ok
    # Las cookies se guardan automáticamente en el context

    return page

def test_dashboard_muestra_datos(fast_login):
    """Test de UI que salta el login."""
    page = fast_login
    # Ya estamos autenticados — ir directo al dashboard
    page.goto("https://mi-app.com/dashboard")
    expect(page.locator("[data-testid='welcome']")).to_contain_text(
        "Bienvenido"
    )</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// Autenticarse via API para no pasar por el formulario de login
import { test as base, expect } from '@playwright/test';

const test = base.extend&lt;{ fastLogin: any }&gt;({
    fastLogin: async ({ page }, use) => {
        const api = page.context().request;

        // Login via API
        const loginResp = await api.post(
            'https://mi-app.com/api/auth/login',
            { data: { email: 'admin@test.com', password: 'admin123' } }
        );
        expect(loginResp.ok()).toBeTruthy();
        // Las cookies se guardan automáticamente en el context

        await use(page);
    },
});

test('dashboard muestra datos', async ({ fastLogin: page }) => {
    // Ya estamos autenticados — ir directo al dashboard
    await page.goto('https://mi-app.com/dashboard');
    await expect(page.locator('[data-testid="welcome"]')).toContainText(
        'Bienvenido'
    );
});</code></pre>
        </div>
        </div>

        <h3>🧪 Ejemplo completo: Flujo E2E con API + UI</h3>
        <div class="code-tabs" data-code-id="L075-5">
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
            <pre><code class="language-python">from playwright.sync_api import expect

def test_flujo_completo_pedido(page):
    """E2E: Crear producto (API) → Comprarlo (UI) → Verificar pedido (API)."""

    api = page.context.request
    base = "https://mi-app.com"

    # ── 1. SETUP: Crear producto via API ──
    product = api.post(f"{base}/api/products", data={
        "name": "Producto E2E Test",
        "price": 50000,
        "stock": 5
    }).json()

    # ── 2. LOGIN via API (rápido) ──
    api.post(f"{base}/api/auth/login", data={
        "email": "cliente@test.com",
        "password": "cliente123"
    })

    # ── 3. COMPRAR por UI ──
    page.goto(f"{base}/products")
    page.fill("[data-testid='search']", "Producto E2E Test")
    page.click("[data-testid='search-btn']")

    card = page.locator("[data-testid='product-card']").filter(
        has_text="Producto E2E Test"
    )
    card.locator("[data-testid='add-to-cart']").click()
    expect(page.locator(".toast")).to_contain_text("agregado")

    page.goto(f"{base}/checkout")
    page.fill("[data-testid='address']", "Calle 5 #38, Cali")
    page.select_option("[data-testid='payment']", label="PSE")
    page.check("[data-testid='terms']")

    with page.expect_response("**/api/orders") as order_resp:
        page.click("[data-testid='place-order']")

    order_id = order_resp.value.json()["id"]
    expect(page.locator("[data-testid='order-success']")).to_be_visible()

    # ── 4. VERIFICAR PEDIDO via API ──
    order = api.get(f"{base}/api/orders/{order_id}").json()
    assert order["status"] == "confirmed"
    assert order["total"] == 50000
    assert len(order["items"]) == 1
    assert order["items"][0]["product_id"] == product["id"]

    # ── 5. VERIFICAR STOCK ACTUALIZADO via API ──
    updated_product = api.get(
        f"{base}/api/products/{product['id']}"
    ).json()
    assert updated_product["stock"] == 4  # Era 5, compró 1

    # ── 6. CLEANUP ──
    api.delete(f"{base}/api/orders/{order_id}")
    api.delete(f"{base}/api/products/{product['id']}")</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

const BASE = 'https://mi-app.com';

test('flujo completo pedido', async ({ page }) => {
    const api = page.context().request;

    // ── 1. SETUP: Crear producto via API ──
    const product = await (await api.post(BASE + '/api/products', {
        data: { name: 'Producto E2E Test', price: 50000, stock: 5 },
    })).json();

    // ── 2. LOGIN via API (rápido) ──
    await api.post(BASE + '/api/auth/login', {
        data: { email: 'cliente@test.com', password: 'cliente123' },
    });

    // ── 3. COMPRAR por UI ──
    await page.goto(BASE + '/products');
    await page.fill('[data-testid="search"]', 'Producto E2E Test');
    await page.click('[data-testid="search-btn"]');

    const card = page.locator('[data-testid="product-card"]').filter({
        hasText: 'Producto E2E Test',
    });
    await card.locator('[data-testid="add-to-cart"]').click();
    await expect(page.locator('.toast')).toContainText('agregado');

    await page.goto(BASE + '/checkout');
    await page.fill('[data-testid="address"]', 'Calle 5 #38, Cali');
    await page.selectOption('[data-testid="payment"]', { label: 'PSE' });
    await page.check('[data-testid="terms"]');

    const orderRespPromise = page.waitForResponse('**/api/orders');
    await page.click('[data-testid="place-order"]');
    const orderResp = await orderRespPromise;

    const orderId = (await orderResp.json()).id;
    await expect(page.locator('[data-testid="order-success"]')).toBeVisible();

    // ── 4. VERIFICAR PEDIDO via API ──
    const order = await (await api.get(
        BASE + '/api/orders/' + orderId
    )).json();
    expect(order.status).toBe('confirmed');
    expect(order.total).toBe(50000);
    expect(order.items).toHaveLength(1);
    expect(order.items[0].product_id).toBe(product.id);

    // ── 5. VERIFICAR STOCK ACTUALIZADO via API ──
    const updatedProduct = await (await api.get(
        BASE + '/api/products/' + product.id
    )).json();
    expect(updatedProduct.stock).toBe(4); // Era 5, compró 1

    // ── 6. CLEANUP ──
    await api.delete(BASE + '/api/orders/' + orderId);
    await api.delete(BASE + '/api/products/' + product.id);
});</code></pre>
        </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Regla de oro:</strong> Usa API para <strong>setup y cleanup</strong>
            (rápido, confiable). Usa UI para <strong>la acción que estás testeando</strong>
            (lo que el usuario realmente hace). Usa API para <strong>verificaciones
            adicionales</strong> que la UI no muestra.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Implementa los siguientes tests combinados:</p>
            <ol>
                <li><strong>API → UI:</strong> Crear 3 usuarios via API, verificar en la tabla de la UI que aparecen los 3</li>
                <li><strong>UI → API:</strong> Eliminar un usuario por UI (click delete + confirmar), verificar via API que ya no existe</li>
                <li><strong>Fixture:</strong> Crear una fixture <code>seeded_data</code> que
                cree 5 productos y 3 usuarios via API, los provea al test, y los limpie al final</li>
            </ol>
        </div>
    `,
    topics: ["api", "ui", "combinación"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_075 = LESSON_075;
}
