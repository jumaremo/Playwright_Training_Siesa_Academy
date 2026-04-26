/**
 * Playwright Academy - Lección 072
 * Testing REST APIs: CRUD completo
 * Sección 10: API Testing con Playwright
 */

const LESSON_072 = {
    id: 72,
    title: "Testing REST APIs: CRUD completo",
    duration: "7 min",
    level: "intermediate",
    section: "section-10",
    content: `
        <h2>🔄 Testing REST APIs: CRUD completo</h2>
        <p>En esta lección implementaremos una suite completa de tests para una API REST,
        cubriendo todas las operaciones CRUD, validaciones, filtros, paginación y manejo
        de errores.</p>

        <h3>📋 La API a testear</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>API REST de gestión de tareas con los siguientes endpoints:</p>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #1565c0; color: white;">
                        <th style="padding: 8px;">Método</th>
                        <th style="padding: 8px;">Endpoint</th>
                        <th style="padding: 8px;">Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 6px;"><code>GET</code></td>
                        <td style="padding: 6px;"><code>/api/tasks</code></td>
                        <td style="padding: 6px;">Listar tareas (con filtros y paginación)</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px;"><code>GET</code></td>
                        <td style="padding: 6px;"><code>/api/tasks/:id</code></td>
                        <td style="padding: 6px;">Obtener una tarea</td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 6px;"><code>POST</code></td>
                        <td style="padding: 6px;"><code>/api/tasks</code></td>
                        <td style="padding: 6px;">Crear tarea</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px;"><code>PUT</code></td>
                        <td style="padding: 6px;"><code>/api/tasks/:id</code></td>
                        <td style="padding: 6px;">Actualizar tarea completa</td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 6px;"><code>PATCH</code></td>
                        <td style="padding: 6px;"><code>/api/tasks/:id</code></td>
                        <td style="padding: 6px;">Actualizar parcialmente</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px;"><code>DELETE</code></td>
                        <td style="padding: 6px;"><code>/api/tasks/:id</code></td>
                        <td style="padding: 6px;">Eliminar tarea</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>⚙️ Setup: Fixtures y configuración</h3>
        <div class="code-tabs" data-code-id="L072-1">
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

API_BASE = "https://api.taskmanager.com"

@pytest.fixture(scope="session")
def api(playwright: Playwright):
    """API context autenticado."""
    ctx = playwright.request.new_context(
        base_url=API_BASE,
        extra_http_headers={
            "Authorization": "Bearer test-api-key-123",
            "Accept": "application/json",
            "Content-Type": "application/json",
        }
    )
    yield ctx
    ctx.dispose()

@pytest.fixture
def task_data():
    """Datos base para crear una tarea."""
    return {
        "title": "Tarea de prueba E2E",
        "description": "Creada por Playwright API tests",
        "priority": "high",
        "status": "pending",
        "assignee": "juan.reina@siesa.com",
    }

@pytest.fixture
def created_task(api, task_data):
    """Fixture que crea una tarea y la elimina después del test."""
    response = api.post("/api/tasks", data=task_data)
    assert response.status == 201
    task = response.json()
    yield task
    # Cleanup: eliminar la tarea
    api.delete(f"/api/tasks/{task['id']}")</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// fixtures.ts
import { test as base, type APIRequestContext } from '@playwright/test';

const API_BASE = 'https://api.taskmanager.com';

type ApiFixtures = {
    api: APIRequestContext;
    taskData: Record&lt;string, string&gt;;
    createdTask: Record&lt;string, unknown&gt;;
};

export const test = base.extend&lt;{}, ApiFixtures&gt;({
    api: [async ({ playwright }, use) => {
        const ctx = await playwright.request.newContext({
            baseURL: API_BASE,
            extraHTTPHeaders: {
                'Authorization': 'Bearer test-api-key-123',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        await use(ctx);
        await ctx.dispose();
    }, { scope: 'worker' }],

    taskData: [async ({}, use) => {
        await use({
            title: 'Tarea de prueba E2E',
            description: 'Creada por Playwright API tests',
            priority: 'high',
            status: 'pending',
            assignee: 'juan.reina@siesa.com',
        });
    }, { scope: 'worker' }],

    createdTask: async ({ api, taskData }, use) => {
        const response = await api.post('/api/tasks', { data: taskData });
        expect(response.status()).toBe(201);
        const task = await response.json();
        await use(task);
        // Cleanup: eliminar la tarea
        await api.delete('/api/tasks/' + task.id);
    },
});

export { expect } from '@playwright/test';</code></pre>
        </div>
        </div>

        <h3>✅ Tests de CREATE (POST)</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L072-2">
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
                <pre><code class="language-python"># test_tasks_create.py

def test_crear_tarea_exitoso(api, task_data):
    """POST /api/tasks — crear tarea con datos válidos."""
    response = api.post("/api/tasks", data=task_data)

    assert response.status == 201
    body = response.json()
    assert body["id"] is not None
    assert body["title"] == task_data["title"]
    assert body["priority"] == "high"
    assert body["status"] == "pending"
    assert "created_at" in body

    # Cleanup
    api.delete(f"/api/tasks/{body['id']}")


def test_crear_tarea_sin_titulo_falla(api):
    """POST /api/tasks — falla sin campo requerido."""
    response = api.post("/api/tasks", data={
        "description": "Sin título",
        "priority": "low"
    })

    assert response.status == 422
    errors = response.json()["errors"]
    assert "title" in errors


def test_crear_tarea_prioridad_invalida(api):
    """POST /api/tasks — falla con prioridad inválida."""
    response = api.post("/api/tasks", data={
        "title": "Test",
        "priority": "super-urgente"  # No es válido
    })

    assert response.status == 422
    errors = response.json()["errors"]
    assert "priority" in errors</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// test-tasks-create.spec.ts
import { test, expect } from './fixtures';

test('crear tarea exitoso', async ({ api, taskData }) => {
    const response = await api.post('/api/tasks', { data: taskData });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.id).not.toBeNull();
    expect(body.title).toBe(taskData.title);
    expect(body.priority).toBe('high');
    expect(body.status).toBe('pending');
    expect(body).toHaveProperty('created_at');

    // Cleanup
    await api.delete('/api/tasks/' + body.id);
});

test('crear tarea sin título falla', async ({ api }) => {
    const response = await api.post('/api/tasks', {
        data: { description: 'Sin título', priority: 'low' },
    });

    expect(response.status()).toBe(422);
    const errors = (await response.json()).errors;
    expect(errors).toHaveProperty('title');
});

test('crear tarea prioridad inválida', async ({ api }) => {
    const response = await api.post('/api/tasks', {
        data: { title: 'Test', priority: 'super-urgente' },
    });

    expect(response.status()).toBe(422);
    const errors = (await response.json()).errors;
    expect(errors).toHaveProperty('priority');
});</code></pre>
            </div>
            </div>
        </div>

        <h3>📖 Tests de READ (GET)</h3>
        <div class="code-tabs" data-code-id="L072-3">
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
            <pre><code class="language-python"># test_tasks_read.py

def test_listar_tareas(api):
    """GET /api/tasks — lista de tareas."""
    response = api.get("/api/tasks")

    assert response.ok
    body = response.json()
    assert isinstance(body["data"], list)
    assert "total" in body
    assert "page" in body


def test_obtener_tarea_por_id(api, created_task):
    """GET /api/tasks/:id — obtener tarea específica."""
    task_id = created_task["id"]
    response = api.get(f"/api/tasks/{task_id}")

    assert response.ok
    body = response.json()
    assert body["id"] == task_id
    assert body["title"] == created_task["title"]


def test_tarea_no_existente(api):
    """GET /api/tasks/:id — 404 para ID inexistente."""
    response = api.get("/api/tasks/999999")
    assert response.status == 404


def test_filtrar_por_status(api):
    """GET /api/tasks?status=pending — filtrar por estado."""
    response = api.get("/api/tasks", params={"status": "pending"})

    assert response.ok
    tasks = response.json()["data"]
    for task in tasks:
        assert task["status"] == "pending"


def test_filtrar_por_prioridad(api):
    """GET /api/tasks?priority=high — filtrar por prioridad."""
    response = api.get("/api/tasks", params={"priority": "high"})

    assert response.ok
    tasks = response.json()["data"]
    for task in tasks:
        assert task["priority"] == "high"


def test_paginacion(api):
    """GET /api/tasks?page=1&per_page=5 — paginación."""
    response = api.get("/api/tasks", params={
        "page": 1, "per_page": 5
    })

    assert response.ok
    body = response.json()
    assert len(body["data"]) <= 5
    assert body["page"] == 1
    assert body["per_page"] == 5

    # Verificar que la página 2 tiene datos diferentes
    page2 = api.get("/api/tasks", params={
        "page": 2, "per_page": 5
    })
    if page2.json()["data"]:
        ids_p1 = {t["id"] for t in body["data"]}
        ids_p2 = {t["id"] for t in page2.json()["data"]}
        assert ids_p1.isdisjoint(ids_p2)  # Sin duplicados</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// test-tasks-read.spec.ts
import { test, expect } from './fixtures';

test('listar tareas', async ({ api }) => {
    const response = await api.get('/api/tasks');

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('page');
});

test('obtener tarea por id', async ({ api, createdTask }) => {
    const taskId = createdTask.id;
    const response = await api.get('/api/tasks/' + taskId);

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.id).toBe(taskId);
    expect(body.title).toBe(createdTask.title);
});

test('tarea no existente', async ({ api }) => {
    const response = await api.get('/api/tasks/999999');
    expect(response.status()).toBe(404);
});

test('filtrar por status', async ({ api }) => {
    const response = await api.get('/api/tasks', {
        params: { status: 'pending' },
    });

    expect(response.ok()).toBeTruthy();
    const tasks = (await response.json()).data;
    for (const task of tasks) {
        expect(task.status).toBe('pending');
    }
});

test('filtrar por prioridad', async ({ api }) => {
    const response = await api.get('/api/tasks', {
        params: { priority: 'high' },
    });

    expect(response.ok()).toBeTruthy();
    const tasks = (await response.json()).data;
    for (const task of tasks) {
        expect(task.priority).toBe('high');
    }
});

test('paginación', async ({ api }) => {
    const response = await api.get('/api/tasks', {
        params: { page: '1', per_page: '5' },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.data.length).toBeLessThanOrEqual(5);
    expect(body.page).toBe(1);
    expect(body.per_page).toBe(5);

    // Verificar que la página 2 tiene datos diferentes
    const page2 = await api.get('/api/tasks', {
        params: { page: '2', per_page: '5' },
    });
    const page2Data = (await page2.json()).data;
    if (page2Data.length > 0) {
        const idsP1 = new Set(body.data.map((t: any) => t.id));
        const idsP2 = new Set(page2Data.map((t: any) => t.id));
        // Sin duplicados entre páginas
        for (const id of idsP2) {
            expect(idsP1.has(id)).toBeFalsy();
        }
    }
});</code></pre>
        </div>
        </div>

        <h3>✏️ Tests de UPDATE (PUT/PATCH)</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L072-4">
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
                <pre><code class="language-python"># test_tasks_update.py

def test_actualizar_tarea_completa(api, created_task):
    """PUT /api/tasks/:id — actualización completa."""
    task_id = created_task["id"]
    updated_data = {
        "title": "Tarea actualizada",
        "description": "Descripción modificada",
        "priority": "low",
        "status": "in_progress",
        "assignee": "carlos.diaz@siesa.com"
    }

    response = api.put(f"/api/tasks/{task_id}", data=updated_data)

    assert response.ok
    body = response.json()
    assert body["title"] == "Tarea actualizada"
    assert body["priority"] == "low"
    assert body["status"] == "in_progress"
    assert "updated_at" in body


def test_actualizar_parcial(api, created_task):
    """PATCH /api/tasks/:id — actualización parcial."""
    task_id = created_task["id"]

    response = api.patch(f"/api/tasks/{task_id}", data={
        "status": "completed"
    })

    assert response.ok
    body = response.json()
    assert body["status"] == "completed"
    # Los demás campos no cambian
    assert body["title"] == created_task["title"]


def test_actualizar_tarea_inexistente(api):
    """PUT /api/tasks/:id — 404 para ID inexistente."""
    response = api.put("/api/tasks/999999", data={
        "title": "No existe"
    })
    assert response.status == 404</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// test-tasks-update.spec.ts
import { test, expect } from './fixtures';

test('actualizar tarea completa', async ({ api, createdTask }) => {
    const taskId = createdTask.id;
    const updatedData = {
        title: 'Tarea actualizada',
        description: 'Descripción modificada',
        priority: 'low',
        status: 'in_progress',
        assignee: 'carlos.diaz@siesa.com',
    };

    const response = await api.put('/api/tasks/' + taskId, {
        data: updatedData,
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.title).toBe('Tarea actualizada');
    expect(body.priority).toBe('low');
    expect(body.status).toBe('in_progress');
    expect(body).toHaveProperty('updated_at');
});

test('actualizar parcial', async ({ api, createdTask }) => {
    const taskId = createdTask.id;

    const response = await api.patch('/api/tasks/' + taskId, {
        data: { status: 'completed' },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.status).toBe('completed');
    // Los demás campos no cambian
    expect(body.title).toBe(createdTask.title);
});

test('actualizar tarea inexistente', async ({ api }) => {
    const response = await api.put('/api/tasks/999999', {
        data: { title: 'No existe' },
    });
    expect(response.status()).toBe(404);
});</code></pre>
            </div>
            </div>
        </div>

        <h3>🗑️ Tests de DELETE</h3>
        <div class="code-tabs" data-code-id="L072-5">
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
            <pre><code class="language-python"># test_tasks_delete.py

def test_eliminar_tarea(api, task_data):
    """DELETE /api/tasks/:id — eliminar tarea existente."""
    # Crear tarea para eliminar
    create = api.post("/api/tasks", data=task_data)
    task_id = create.json()["id"]

    # Eliminar
    response = api.delete(f"/api/tasks/{task_id}")
    assert response.status == 204

    # Verificar que ya no existe
    get_response = api.get(f"/api/tasks/{task_id}")
    assert get_response.status == 404


def test_eliminar_tarea_inexistente(api):
    """DELETE /api/tasks/:id — 404 para ID inexistente."""
    response = api.delete("/api/tasks/999999")
    assert response.status == 404


def test_eliminar_no_permite_doble_delete(api, task_data):
    """DELETE /api/tasks/:id — no se puede eliminar dos veces."""
    create = api.post("/api/tasks", data=task_data)
    task_id = create.json()["id"]

    # Primer delete: éxito
    first = api.delete(f"/api/tasks/{task_id}")
    assert first.status == 204

    # Segundo delete: 404
    second = api.delete(f"/api/tasks/{task_id}")
    assert second.status == 404</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// test-tasks-delete.spec.ts
import { test, expect } from './fixtures';

test('eliminar tarea', async ({ api, taskData }) => {
    // Crear tarea para eliminar
    const create = await api.post('/api/tasks', { data: taskData });
    const taskId = (await create.json()).id;

    // Eliminar
    const response = await api.delete('/api/tasks/' + taskId);
    expect(response.status()).toBe(204);

    // Verificar que ya no existe
    const getResponse = await api.get('/api/tasks/' + taskId);
    expect(getResponse.status()).toBe(404);
});

test('eliminar tarea inexistente', async ({ api }) => {
    const response = await api.delete('/api/tasks/999999');
    expect(response.status()).toBe(404);
});

test('eliminar no permite doble delete', async ({ api, taskData }) => {
    const create = await api.post('/api/tasks', { data: taskData });
    const taskId = (await create.json()).id;

    // Primer delete: éxito
    const first = await api.delete('/api/tasks/' + taskId);
    expect(first.status()).toBe(204);

    // Segundo delete: 404
    const second = await api.delete('/api/tasks/' + taskId);
    expect(second.status()).toBe(404);
});</code></pre>
        </div>
        </div>

        <h3>🔒 Tests de seguridad básicos</h3>
        <div class="code-tabs" data-code-id="L072-6">
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
            <pre><code class="language-python"># test_tasks_security.py

def test_sin_auth_retorna_401(api_no_auth):
    """Endpoints protegidos requieren autenticación."""
    response = api_no_auth.get("/api/tasks")
    assert response.status == 401


def test_token_invalido_retorna_401(playwright):
    """Token inválido es rechazado."""
    ctx = playwright.request.new_context(
        base_url=API_BASE,
        extra_http_headers={"Authorization": "Bearer token-invalido"}
    )
    response = ctx.get("/api/tasks")
    assert response.status == 401
    ctx.dispose()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// test-tasks-security.spec.ts
import { test, expect } from '@playwright/test';

const API_BASE = 'https://api.taskmanager.com';

test('sin auth retorna 401', async ({ playwright }) => {
    const ctx = await playwright.request.newContext({
        baseURL: API_BASE,
    });
    const response = await ctx.get('/api/tasks');
    expect(response.status()).toBe(401);
    await ctx.dispose();
});

test('token inválido retorna 401', async ({ playwright }) => {
    const ctx = await playwright.request.newContext({
        baseURL: API_BASE,
        extraHTTPHeaders: { Authorization: 'Bearer token-invalido' },
    });
    const response = await ctx.get('/api/tasks');
    expect(response.status()).toBe(401);
    await ctx.dispose();
});</code></pre>
        </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip:</strong> La fixture <code>created_task</code> con yield es
            el patrón ideal para tests que necesitan datos existentes. Crea el dato antes
            del test y lo limpia después, garantizando aislamiento entre tests.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Usando <code>https://jsonplaceholder.typicode.com</code>,
            escribe tests para:</p>
            <ol>
                <li>GET /posts — verificar que retorna 100 posts</li>
                <li>GET /posts/1 — verificar estructura del objeto</li>
                <li>POST /posts — crear un post y verificar respuesta 201</li>
                <li>GET /posts?userId=1 — verificar filtro por usuario</li>
                <li>DELETE /posts/1 — verificar respuesta 200</li>
            </ol>
        </div>
    `,
    topics: ["rest", "crud", "api"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_072 = LESSON_072;
}
