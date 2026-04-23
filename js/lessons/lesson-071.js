/**
 * Playwright Academy - Lección 071
 * APIRequestContext de Playwright
 * Sección 10: API Testing con Playwright
 */

const LESSON_071 = {
    id: 71,
    title: "APIRequestContext de Playwright",
    duration: "8 min",
    level: "intermediate",
    section: "section-10",
    content: `
        <h2>🔌 APIRequestContext de Playwright</h2>
        <p>Playwright no solo automatiza navegadores — también puede hacer
        <strong>requests HTTP directamente</strong> sin abrir ninguna página web. El
        <code>APIRequestContext</code> permite testear APIs REST como lo haría Postman
        o requests de Python, pero integrado en el mismo framework de tus tests de UI.</p>

        <h3>🤔 ¿Por qué testear APIs con Playwright?</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <ul>
                <li><strong>Un solo framework:</strong> Tests de UI y API en el mismo proyecto</li>
                <li><strong>Compartir autenticación:</strong> Login por UI, requests por API</li>
                <li><strong>Setup rápido:</strong> Crear datos via API antes de tests de UI</li>
                <li><strong>Cleanup:</strong> Eliminar datos de prueba via API después del test</li>
                <li><strong>Assertions unificadas:</strong> Mismo estilo de assertions para todo</li>
                <li><strong>CI/CD integrado:</strong> Una sola pipeline para todo</li>
            </ul>
        </div>

        <h3>🚀 Crear un APIRequestContext</h3>
        <div class="code-tabs" data-code-id="L071-1">
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
                <pre><code class="language-python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    # ── Opción 1: Context standalone (sin browser) ──
    api = p.request.new_context(
        base_url="https://jsonplaceholder.typicode.com",
        extra_http_headers={
            "Accept": "application/json",
            "Content-Type": "application/json",
        }
    )

    # Hacer requests
    response = api.get("/posts/1")
    print(response.status)       # 200
    print(response.json())       # {"userId": 1, "id": 1, "title": "...", ...}

    # Limpiar
    api.dispose()

    # ── Opción 2: Context desde un browser context ──
    browser = p.chromium.launch()
    context = browser.new_context()
    page = context.new_page()

    # Login por UI
    page.goto("https://mi-app.com/login")
    page.fill("#email", "admin@test.com")
    page.fill("#password", "admin123")
    page.click("#login-btn")

    # Ahora usar la API con las cookies del login
    api = context.request
    response = api.get("https://mi-app.com/api/profile")
    # Las cookies de la sesión se envían automáticamente
    print(response.json())  # {"name": "Admin", "role": "admin"}

    browser.close()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

// ── Opción 1: Context standalone (sin browser) ──
test('API request standalone', async ({ playwright }) => {
    const api = await playwright.request.newContext({
        baseURL: 'https://jsonplaceholder.typicode.com',
        extraHTTPHeaders: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    });

    // Hacer requests
    const response = await api.get('/posts/1');
    console.log(response.status());       // 200
    console.log(await response.json());   // {"userId": 1, "id": 1, ...}

    // Limpiar
    await api.dispose();
});

// ── Opción 2: Context desde un browser context ──
test('API con cookies de sesión', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Login por UI
    await page.goto('https://mi-app.com/login');
    await page.fill('#email', 'admin@test.com');
    await page.fill('#password', 'admin123');
    await page.click('#login-btn');

    // Ahora usar la API con las cookies del login
    const api = context.request;
    const response = await api.get('https://mi-app.com/api/profile');
    // Las cookies de la sesión se envían automáticamente
    console.log(await response.json());  // {"name": "Admin", "role": "admin"}

    await context.close();
});</code></pre>
            </div>
        </div>

        <h3>📡 Métodos HTTP disponibles</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L071-2">
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
                    <pre><code class="language-python"># Todos los métodos HTTP estándar están disponibles

# ── GET ──
response = api.get("/users")
response = api.get("/users/1")
response = api.get("/users", params={"role": "admin", "page": 1})

# ── POST ──
response = api.post("/users", data={
    "name": "Juan Reina",
    "email": "juan@siesa.com",
    "role": "admin"
})

# ── PUT (reemplazo completo) ──
response = api.put("/users/1", data={
    "name": "Juan M. Reina",
    "email": "juan@siesa.com",
    "role": "admin"
})

# ── PATCH (actualización parcial) ──
response = api.patch("/users/1", data={
    "role": "superadmin"
})

# ── DELETE ──
response = api.delete("/users/1")

# ── HEAD (solo headers, sin body) ──
response = api.head("/users")
print(response.headers)  # {"x-total-count": "42", ...}</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-typescript">// Todos los métodos HTTP estándar están disponibles

// ── GET ──
const response1 = await api.get('/users');
const response2 = await api.get('/users/1');
const response3 = await api.get('/users', {
    params: { role: 'admin', page: '1' },
});

// ── POST ──
const response4 = await api.post('/users', {
    data: {
        name: 'Juan Reina',
        email: 'juan@siesa.com',
        role: 'admin',
    },
});

// ── PUT (reemplazo completo) ──
const response5 = await api.put('/users/1', {
    data: {
        name: 'Juan M. Reina',
        email: 'juan@siesa.com',
        role: 'admin',
    },
});

// ── PATCH (actualización parcial) ──
const response6 = await api.patch('/users/1', {
    data: { role: 'superadmin' },
});

// ── DELETE ──
const response7 = await api.delete('/users/1');

// ── HEAD (solo headers, sin body) ──
const response8 = await api.head('/users');
console.log(response8.headers());  // {"x-total-count": "42", ...}</code></pre>
                </div>
            </div>
        </div>

        <h3>📋 Trabajar con la respuesta</h3>
        <div class="code-tabs" data-code-id="L071-3">
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
                <pre><code class="language-python"># El objeto response tiene múltiples formas de acceder a los datos

response = api.get("/posts/1")

# ── Status ──
print(response.status)           # 200
print(response.ok)               # True (200-299)
print(response.status_text)      # "OK"

# ── Body como JSON ──
data = response.json()
print(data["title"])

# ── Body como texto ──
text = response.text()

# ── Body como bytes ──
raw = response.body()

# ── Headers de la respuesta ──
headers = response.headers
print(headers["content-type"])   # "application/json; charset=utf-8"
print(headers.get("x-request-id"))

# ── URL final (después de redirects) ──
print(response.url)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// El objeto response tiene múltiples formas de acceder a los datos

const response = await api.get('/posts/1');

// ── Status ──
console.log(response.status());           // 200
console.log(response.ok());               // true (200-299)
console.log(response.statusText());       // "OK"

// ── Body como JSON ──
const data = await response.json();
console.log(data.title);

// ── Body como texto ──
const text = await response.text();

// ── Body como bytes ──
const raw = await response.body();

// ── Headers de la respuesta ──
const headers = response.headers();
console.log(headers['content-type']);   // "application/json; charset=utf-8"
console.log(headers['x-request-id']);

// ── URL final (después de redirects) ──
console.log(response.url());</code></pre>
            </div>
        </div>

        <h3>📤 Enviar datos en diferentes formatos</h3>
        <div class="code-tabs" data-code-id="L071-4">
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
                <pre><code class="language-python"># ── JSON (el más común) ──
response = api.post("/users", data={
    "name": "Juan",
    "email": "juan@test.com"
})
# Content-Type: application/json automáticamente

# ── Form data ──
response = api.post("/login", form={
    "username": "admin",
    "password": "admin123"
})
# Content-Type: application/x-www-form-urlencoded

# ── Multipart (upload de archivos) ──
response = api.post("/upload", multipart={
    "file": {
        "name": "reporte.pdf",
        "mimeType": "application/pdf",
        "buffer": open("test-data/reporte.pdf", "rb").read()
    },
    "description": "Reporte mensual"
})
# Content-Type: multipart/form-data

# ── Texto plano ──
response = api.post("/webhook", data="payload de texto plano",
    headers={"Content-Type": "text/plain"}
)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import fs from 'fs';

// ── JSON (el más común) ──
const response1 = await api.post('/users', {
    data: { name: 'Juan', email: 'juan@test.com' },
});
// Content-Type: application/json automáticamente

// ── Form data ──
const response2 = await api.post('/login', {
    form: { username: 'admin', password: 'admin123' },
});
// Content-Type: application/x-www-form-urlencoded

// ── Multipart (upload de archivos) ──
const response3 = await api.post('/upload', {
    multipart: {
        file: {
            name: 'reporte.pdf',
            mimeType: 'application/pdf',
            buffer: fs.readFileSync('test-data/reporte.pdf'),
        },
        description: 'Reporte mensual',
    },
});
// Content-Type: multipart/form-data

// ── Texto plano ──
const response4 = await api.post('/webhook', {
    data: 'payload de texto plano',
    headers: { 'Content-Type': 'text/plain' },
});</code></pre>
            </div>
        </div>

        <h3>⚙️ Integración con pytest (fixtures)</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L071-5">
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
from playwright.sync_api import Playwright

@pytest.fixture(scope="session")
def api(playwright: Playwright):
    """APIRequestContext para tests de API."""
    context = playwright.request.new_context(
        base_url="https://api.mi-app.com",
        extra_http_headers={
            "Accept": "application/json",
            "Authorization": "Bearer test-token-123",
        }
    )
    yield context
    context.dispose()

@pytest.fixture(scope="session")
def api_no_auth(playwright: Playwright):
    """APIRequestContext sin autenticación."""
    context = playwright.request.new_context(
        base_url="https://api.mi-app.com",
    )
    yield context
    context.dispose()

# ── Uso en tests ──
def test_listar_usuarios(api):
    response = api.get("/users")
    assert response.ok
    data = response.json()
    assert len(data) > 0

def test_endpoint_requiere_auth(api_no_auth):
    response = api_no_auth.get("/admin/users")
    assert response.status == 401</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-typescript">// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        baseURL: 'https://api.mi-app.com',
        extraHTTPHeaders: {
            'Accept': 'application/json',
            'Authorization': 'Bearer test-token-123',
        },
    },
});

// tests/api.spec.ts
import { test, expect } from '@playwright/test';

// ── Uso en tests ──
test('listar usuarios', async ({ request }) => {
    const response = await request.get('/users');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.length).toBeGreaterThan(0);
});

test('endpoint requiere auth', async ({ playwright }) => {
    const noAuth = await playwright.request.newContext({
        baseURL: 'https://api.mi-app.com',
    });
    const response = await noAuth.get('/admin/users');
    expect(response.status()).toBe(401);
    await noAuth.dispose();
});</code></pre>
                </div>
            </div>
        </div>

        <h3>🧪 Ejemplo completo: CRUD básico</h3>
        <div class="code-tabs" data-code-id="L071-6">
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
                <pre><code class="language-python">def test_crud_basico(api):
    """Test de CRUD completo contra una API REST."""

    # CREATE
    create_resp = api.post("/posts", data={
        "title": "Test desde Playwright",
        "body": "Contenido de prueba",
        "userId": 1
    })
    assert create_resp.status == 201
    post_id = create_resp.json()["id"]

    # READ
    read_resp = api.get(f"/posts/{post_id}")
    assert read_resp.ok
    assert read_resp.json()["title"] == "Test desde Playwright"

    # UPDATE
    update_resp = api.put(f"/posts/{post_id}", data={
        "title": "Título actualizado",
        "body": "Body actualizado",
        "userId": 1
    })
    assert update_resp.ok
    assert update_resp.json()["title"] == "Título actualizado"

    # DELETE
    delete_resp = api.delete(f"/posts/{post_id}")
    assert delete_resp.ok</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('CRUD básico', async ({ request }) => {
    // CREATE
    const createResp = await request.post('/posts', {
        data: {
            title: 'Test desde Playwright',
            body: 'Contenido de prueba',
            userId: 1,
        },
    });
    expect(createResp.status()).toBe(201);
    const postId = (await createResp.json()).id;

    // READ
    const readResp = await request.get(\`/posts/\${postId}\`);
    expect(readResp.ok()).toBeTruthy();
    expect((await readResp.json()).title).toBe('Test desde Playwright');

    // UPDATE
    const updateResp = await request.put(\`/posts/\${postId}\`, {
        data: {
            title: 'Título actualizado',
            body: 'Body actualizado',
            userId: 1,
        },
    });
    expect(updateResp.ok()).toBeTruthy();
    expect((await updateResp.json()).title).toBe('Título actualizado');

    // DELETE
    const deleteResp = await request.delete(\`/posts/\${postId}\`);
    expect(deleteResp.ok()).toBeTruthy();
});</code></pre>
            </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip:</strong> <code>APIRequestContext</code> es más rápido que
            <code>requests</code> de Python porque reutiliza las conexiones HTTP/2
            internamente. Es ideal para setup/teardown de datos en tests de UI.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Usando <code>https://jsonplaceholder.typicode.com</code>:</p>
            <ol>
                <li>Crea un <code>APIRequestContext</code> con base_url</li>
                <li>Haz GET a <code>/users</code> y verifica que retorna 10 usuarios</li>
                <li>Haz POST a <code>/posts</code> con datos de prueba</li>
                <li>Haz GET al post creado y verifica los datos</li>
                <li>Implementa todo como fixture de pytest</li>
            </ol>
        </div>
    `,
    topics: ["api", "request-context", "playwright"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 8,
    difficulty: "medium",
    type: "foundation"
};

if (typeof window !== 'undefined') {
    window.LESSON_071 = LESSON_071;
}
