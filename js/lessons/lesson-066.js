/**
 * Playwright Academy - Lección 066
 * Mocking de API responses
 * Sección 9: Network Interception y Mocking
 */

const LESSON_066 = {
    id: 66,
    title: "Mocking de API responses",
    duration: "7 min",
    level: "intermediate",
    section: "section-09",
    content: `
        <h2>🎭 Mocking de API responses</h2>
        <p>El mocking de APIs es la técnica más importante de intercepción de red. Permite
        crear tests <strong>completamente aislados del backend</strong>, controlando
        exactamente qué datos recibe la UI en cada escenario.</p>

        <h3>📦 Mock de respuestas JSON</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L066-1">
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

# ── Mock inline (para datos simples) ──
page.route("**/api/user/profile", lambda route: route.fulfill(
    status=200,
    content_type="application/json",
    body=json.dumps({
        "id": 1,
        "nombre": "Juan Reina",
        "email": "juan@siesa.com",
        "rol": "admin",
        "avatar": "https://example.com/avatar.png"
    })
))

# ── Mock desde función (para lógica condicional) ──
def mock_products(route):
    """Mock que responde diferente según query params."""
    url = route.request.url

    if "category=electronics" in url:
        products = [
            {"id": 1, "name": "Laptop", "price": 2500000},
            {"id": 2, "name": "Monitor", "price": 800000},
        ]
    elif "category=books" in url:
        products = [
            {"id": 3, "name": "Clean Code", "price": 120000},
        ]
    else:
        products = [
            {"id": 1, "name": "Laptop", "price": 2500000},
            {"id": 2, "name": "Monitor", "price": 800000},
            {"id": 3, "name": "Clean Code", "price": 120000},
        ]

    route.fulfill(
        status=200,
        content_type="application/json",
        body=json.dumps({"products": products, "total": len(products)})
    )

page.route("**/api/products*", mock_products)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// ── Mock inline (para datos simples) ──
await page.route('**/api/user/profile', async (route) => {
    await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
            id: 1,
            nombre: 'Juan Reina',
            email: 'juan@siesa.com',
            rol: 'admin',
            avatar: 'https://example.com/avatar.png',
        }),
    });
});

// ── Mock desde función (para lógica condicional) ──
await page.route('**/api/products*', async (route) => {
    const url = route.request().url();
    let products: Array&lt;{ id: number; name: string; price: number }&gt;;

    if (url.includes('category=electronics')) {
        products = [
            { id: 1, name: 'Laptop', price: 2500000 },
            { id: 2, name: 'Monitor', price: 800000 },
        ];
    } else if (url.includes('category=books')) {
        products = [
            { id: 3, name: 'Clean Code', price: 120000 },
        ];
    } else {
        products = [
            { id: 1, name: 'Laptop', price: 2500000 },
            { id: 2, name: 'Monitor', price: 800000 },
            { id: 3, name: 'Clean Code', price: 120000 },
        ];
    }

    await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ products, total: products.length }),
    });
});</code></pre>
            </div>
            </div>
        </div>

        <h3>📁 Mock desde archivos JSON</h3>
        <div class="code-tabs" data-code-id="L066-2">
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
            <pre><code class="language-python"># Para respuestas grandes, usa archivos JSON externos

# test-data/mocks/users.json
# [
#   {"id": 1, "name": "Juan", "role": "admin"},
#   {"id": 2, "name": "Carlos", "role": "tester"},
#   {"id": 3, "name": "Alejandro", "role": "dev"}
# ]

from pathlib import Path

def mock_from_file(route):
    """Responder con datos de un archivo JSON."""
    mock_file = Path("test-data/mocks/users.json")
    route.fulfill(
        status=200,
        content_type="application/json",
        body=mock_file.read_text(encoding="utf-8")
    )

page.route("**/api/users", mock_from_file)

# ── Helper genérico para mock desde archivos ──
def create_file_mock(url_pattern, file_path, status=200):
    """Crear un mock que responde con contenido de archivo."""
    def handler(route):
        content = Path(file_path).read_text(encoding="utf-8")
        route.fulfill(
            status=status,
            content_type="application/json",
            body=content
        )
    return url_pattern, handler

# Registrar múltiples mocks desde archivos
mocks = [
    create_file_mock("**/api/users", "mocks/users.json"),
    create_file_mock("**/api/products", "mocks/products.json"),
    create_file_mock("**/api/settings", "mocks/settings.json"),
]
for pattern, handler in mocks:
    page.route(pattern, handler)</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// Para respuestas grandes, usa archivos JSON externos

// test-data/mocks/users.json
// [
//   {"id": 1, "name": "Juan", "role": "admin"},
//   {"id": 2, "name": "Carlos", "role": "tester"},
//   {"id": 3, "name": "Alejandro", "role": "dev"}
// ]

import fs from 'fs';
import path from 'path';

await page.route('**/api/users', async (route) => {
    const mockFile = path.resolve('test-data/mocks/users.json');
    await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: fs.readFileSync(mockFile, 'utf-8'),
    });
});

// ── Helper genérico para mock desde archivos ──
function createFileMock(urlPattern: string, filePath: string, status = 200) {
    return [urlPattern, async (route) =&gt; {
        const content = fs.readFileSync(path.resolve(filePath), 'utf-8');
        await route.fulfill({ status, contentType: 'application/json', body: content });
    }] as const;
}

// Registrar múltiples mocks desde archivos
const mocks = [
    createFileMock('**/api/users', 'mocks/users.json'),
    createFileMock('**/api/products', 'mocks/products.json'),
    createFileMock('**/api/settings', 'mocks/settings.json'),
];
for (const [pattern, handler] of mocks) {
    await page.route(pattern, handler);
}</code></pre>
        </div>
        </div>

        <h3>❌ Mock de errores HTTP</h3>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L066-3">
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
                <pre><code class="language-python"># Simular diferentes errores del servidor

# ── Error 401 - No autorizado ──
page.route("**/api/admin/**", lambda route: route.fulfill(
    status=401,
    content_type="application/json",
    body=json.dumps({"error": "Token expirado", "code": "UNAUTHORIZED"})
))

# ── Error 403 - Prohibido ──
page.route("**/api/users/delete/**", lambda route: route.fulfill(
    status=403,
    content_type="application/json",
    body=json.dumps({"error": "No tienes permisos para esta acción"})
))

# ── Error 404 - No encontrado ──
page.route("**/api/products/999", lambda route: route.fulfill(
    status=404,
    content_type="application/json",
    body=json.dumps({"error": "Producto no encontrado"})
))

# ── Error 422 - Validación ──
page.route("**/api/users", lambda route: route.fulfill(
    status=422,
    content_type="application/json",
    body=json.dumps({
        "errors": {
            "email": ["El email ya está registrado"],
            "password": ["Debe tener al menos 8 caracteres"]
        }
    })
) if route.request.method == "POST" else route.continue_())

# ── Error 500 - Error interno ──
page.route("**/api/reports/generate", lambda route: route.fulfill(
    status=500,
    content_type="application/json",
    body=json.dumps({"error": "Error interno del servidor"})
))

# ── Timeout simulado ──
import time
def mock_timeout(route):
    time.sleep(35)  # Supera el timeout del cliente
    route.fulfill(status=200, body="{}")

page.route("**/api/slow-endpoint", mock_timeout)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Simular diferentes errores del servidor

// ── Error 401 - No autorizado ──
await page.route('**/api/admin/**', async (route) =&gt; {
    await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Token expirado', code: 'UNAUTHORIZED' }),
    });
});

// ── Error 403 - Prohibido ──
await page.route('**/api/users/delete/**', async (route) =&gt; {
    await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'No tienes permisos para esta acción' }),
    });
});

// ── Error 404 - No encontrado ──
await page.route('**/api/products/999', async (route) =&gt; {
    await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Producto no encontrado' }),
    });
});

// ── Error 422 - Validación ──
await page.route('**/api/users', async (route) =&gt; {
    if (route.request().method() === 'POST') {
        await route.fulfill({
            status: 422,
            contentType: 'application/json',
            body: JSON.stringify({
                errors: {
                    email: ['El email ya está registrado'],
                    password: ['Debe tener al menos 8 caracteres'],
                },
            }),
        });
    } else {
        await route.continue();
    }
});

// ── Error 500 - Error interno ──
await page.route('**/api/reports/generate', async (route) =&gt; {
    await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Error interno del servidor' }),
    });
});

// ── Timeout simulado ──
await page.route('**/api/slow-endpoint', async (route) =&gt; {
    await new Promise(resolve =&gt; setTimeout(resolve, 35000));
    await route.fulfill({ status: 200, body: '{}' });
});</code></pre>
            </div>
            </div>
        </div>

        <h3>🔀 Mock condicional por método HTTP</h3>
        <div class="code-tabs" data-code-id="L066-4">
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
            <pre><code class="language-python"># Diferentes respuestas según el método HTTP

def mock_crud_users(route):
    """Mock completo de CRUD para /api/users."""
    method = route.request.method
    url = route.request.url

    if method == "GET" and "/api/users" in url:
        # Listar usuarios
        if url.endswith("/users") or "?" in url:
            route.fulfill(
                status=200,
                content_type="application/json",
                body=json.dumps([
                    {"id": 1, "name": "Juan"},
                    {"id": 2, "name": "Carlos"}
                ])
            )
        else:
            # Detalle de usuario: /api/users/1
            route.fulfill(
                status=200,
                content_type="application/json",
                body=json.dumps({"id": 1, "name": "Juan", "email": "juan@test.com"})
            )

    elif method == "POST":
        # Crear usuario
        body = json.loads(route.request.post_data or "{}")
        route.fulfill(
            status=201,
            content_type="application/json",
            body=json.dumps({"id": 99, **body})
        )

    elif method == "PUT" or method == "PATCH":
        # Actualizar usuario
        body = json.loads(route.request.post_data or "{}")
        route.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps({"id": 1, **body, "updated": True})
        )

    elif method == "DELETE":
        # Eliminar usuario
        route.fulfill(status=204, body="")

    else:
        route.continue_()

page.route("**/api/users**", mock_crud_users)</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// Diferentes respuestas según el método HTTP

async function mockCrudUsers(route) {
    const method = route.request().method();
    const url = route.request().url();

    if (method === 'GET' &amp;&amp; url.includes('/api/users')) {
        // Listar usuarios
        if (url.endsWith('/users') || url.includes('?')) {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([
                    { id: 1, name: 'Juan' },
                    { id: 2, name: 'Carlos' },
                ]),
            });
        } else {
            // Detalle de usuario: /api/users/1
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ id: 1, name: 'Juan', email: 'juan@test.com' }),
            });
        }
    } else if (method === 'POST') {
        // Crear usuario
        const body = JSON.parse(route.request().postData() || '{}');
        await route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify({ id: 99, ...body }),
        });
    } else if (method === 'PUT' || method === 'PATCH') {
        // Actualizar usuario
        const body = JSON.parse(route.request().postData() || '{}');
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ id: 1, ...body, updated: true }),
        });
    } else if (method === 'DELETE') {
        // Eliminar usuario
        await route.fulfill({ status: 204, body: '' });
    } else {
        await route.continue();
    }
}

await page.route('**/api/users**', mockCrudUsers);</code></pre>
        </div>
        </div>

        <h3>📊 Mock de respuestas paginadas</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L066-5">
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
                <pre><code class="language-python">from urllib.parse import urlparse, parse_qs

def mock_paginated(route):
    """Mock con paginación realista."""
    url = route.request.url
    params = parse_qs(urlparse(url).query)

    page_num = int(params.get("page", ["1"])[0])
    per_page = int(params.get("per_page", ["10"])[0])
    total = 25

    # Generar datos para la página solicitada
    start = (page_num - 1) * per_page
    items = [
        {"id": i, "name": f"Item {i}"}
        for i in range(start + 1, min(start + per_page + 1, total + 1))
    ]

    route.fulfill(
        status=200,
        headers={
            "Content-Type": "application/json",
            "X-Total-Count": str(total),
            "X-Page": str(page_num),
            "X-Per-Page": str(per_page),
        },
        body=json.dumps({
            "data": items,
            "pagination": {
                "page": page_num,
                "per_page": per_page,
                "total": total,
                "total_pages": (total + per_page - 1) // per_page
            }
        })
    )

page.route("**/api/items*", mock_paginated)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">async function mockPaginated(route) {
    const urlObj = new URL(route.request().url());
    const pageNum = parseInt(urlObj.searchParams.get('page') || '1');
    const perPage = parseInt(urlObj.searchParams.get('per_page') || '10');
    const total = 25;

    // Generar datos para la página solicitada
    const start = (pageNum - 1) * perPage;
    const items: Array&lt;{ id: number; name: string }&gt; = [];
    for (let i = start + 1; i &lt;= Math.min(start + perPage, total); i++) {
        items.push({ id: i, name: 'Item ' + i });
    }

    await route.fulfill({
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'X-Total-Count': String(total),
            'X-Page': String(pageNum),
            'X-Per-Page': String(perPage),
        },
        body: JSON.stringify({
            data: items,
            pagination: {
                page: pageNum,
                per_page: perPage,
                total,
                total_pages: Math.ceil(total / perPage),
            },
        }),
    });
}

await page.route('**/api/items*', mockPaginated);</code></pre>
            </div>
            </div>
        </div>

        <h3>🧪 Tests con mocks: Escenarios de UI</h3>
        <div class="code-tabs" data-code-id="L066-6">
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

def test_mostrar_error_cuando_api_falla(page):
    """Verificar que la UI muestra error cuando la API retorna 500."""
    page.route("**/api/products", lambda r: r.fulfill(
        status=500,
        content_type="application/json",
        body=json.dumps({"error": "Server Error"})
    ))

    page.goto("https://mi-app.com/products")
    expect(page.locator(".error-message")).to_be_visible()
    expect(page.locator(".error-message")).to_contain_text("Error")

def test_estado_vacio(page):
    """Verificar UI cuando no hay datos."""
    page.route("**/api/products", lambda r: r.fulfill(
        status=200,
        content_type="application/json",
        body=json.dumps({"products": [], "total": 0})
    ))

    page.goto("https://mi-app.com/products")
    expect(page.locator(".empty-state")).to_be_visible()
    expect(page.locator(".empty-state")).to_contain_text("No hay productos")

def test_lista_con_muchos_items(page):
    """Verificar UI con lista larga de productos."""
    products = [
        {"id": i, "name": f"Producto {i}", "price": i * 1000}
        for i in range(1, 101)
    ]
    page.route("**/api/products", lambda r: r.fulfill(
        status=200,
        content_type="application/json",
        body=json.dumps({"products": products, "total": 100})
    ))

    page.goto("https://mi-app.com/products")
    expect(page.locator(".product-card")).to_have_count(100)</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('mostrar error cuando API falla', async ({ page }) =&gt; {
    await page.route('**/api/products', async (route) =&gt; {
        await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Server Error' }),
        });
    });

    await page.goto('https://mi-app.com/products');
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('Error');
});

test('estado vacío', async ({ page }) =&gt; {
    await page.route('**/api/products', async (route) =&gt; {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ products: [], total: 0 }),
        });
    });

    await page.goto('https://mi-app.com/products');
    await expect(page.locator('.empty-state')).toBeVisible();
    await expect(page.locator('.empty-state')).toContainText('No hay productos');
});

test('lista con muchos items', async ({ page }) =&gt; {
    const products = Array.from({ length: 100 }, (_, i) =&gt; ({
        id: i + 1,
        name: 'Producto ' + (i + 1),
        price: (i + 1) * 1000,
    }));
    await page.route('**/api/products', async (route) =&gt; {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ products, total: 100 }),
        });
    });

    await page.goto('https://mi-app.com/products');
    await expect(page.locator('.product-card')).toHaveCount(100);
});</code></pre>
        </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip SIESA:</strong> En SIESA usamos mocking extensivo para los tests
            del frontend del ERP. El backend tiene decenas de microservicios; mockear sus
            respuestas nos permite correr los tests de UI en segundos sin depender de
            ambientes de staging.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Crea mocks para una app de tareas que cubran:</p>
            <ol>
                <li>GET /api/tasks → Lista con 5 tareas mock</li>
                <li>POST /api/tasks → Respuesta 201 con la tarea creada</li>
                <li>DELETE /api/tasks/:id → Respuesta 204</li>
                <li>GET /api/tasks cuando el servidor está caído → Error 503</li>
                <li>Escribe un test para cada escenario verificando la UI</li>
            </ol>
        </div>
    `,
    topics: ["mocking", "api", "responses"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_066 = LESSON_066;
}
