/**
 * Playwright Academy - Lección 077
 * Proyecto: API testing suite completa
 * Sección 10: API Testing con Playwright
 */

const LESSON_077 = {
    id: 77,
    title: "Proyecto: API testing suite completa",
    duration: "12 min",
    level: "intermediate",
    section: "section-10",
    content: `
        <h2>🏆 Proyecto: API testing suite completa</h2>
        <p>En este proyecto integrador construiremos una <strong>suite completa de API testing</strong>
        para un sistema de gestión de empleados, combinando todo lo aprendido: CRUD, autenticación,
        validación de schemas, mocking para UI y tests combinados API + UI.</p>

        <h3>🎯 API a testear: "Employee Management System"</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #1565c0; color: white;">
                        <th style="padding: 8px;">Método</th>
                        <th style="padding: 8px;">Endpoint</th>
                        <th style="padding: 8px;">Auth</th>
                        <th style="padding: 8px;">Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 6px;"><code>POST</code></td>
                        <td style="padding: 6px;"><code>/auth/login</code></td>
                        <td style="padding: 6px;">No</td>
                        <td style="padding: 6px;">Obtener JWT token</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px;"><code>GET</code></td>
                        <td style="padding: 6px;"><code>/api/employees</code></td>
                        <td style="padding: 6px;">Sí</td>
                        <td style="padding: 6px;">Listar empleados (paginado, filtros)</td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 6px;"><code>GET</code></td>
                        <td style="padding: 6px;"><code>/api/employees/:id</code></td>
                        <td style="padding: 6px;">Sí</td>
                        <td style="padding: 6px;">Detalle de empleado</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px;"><code>POST</code></td>
                        <td style="padding: 6px;"><code>/api/employees</code></td>
                        <td style="padding: 6px;">Admin</td>
                        <td style="padding: 6px;">Crear empleado</td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 6px;"><code>PUT</code></td>
                        <td style="padding: 6px;"><code>/api/employees/:id</code></td>
                        <td style="padding: 6px;">Admin</td>
                        <td style="padding: 6px;">Actualizar empleado</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px;"><code>DELETE</code></td>
                        <td style="padding: 6px;"><code>/api/employees/:id</code></td>
                        <td style="padding: 6px;">Admin</td>
                        <td style="padding: 6px;">Eliminar empleado</td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 6px;"><code>GET</code></td>
                        <td style="padding: 6px;"><code>/api/departments</code></td>
                        <td style="padding: 6px;">Sí</td>
                        <td style="padding: 6px;">Listar departamentos</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>📁 Estructura del proyecto</h3>
        <pre><code class="text">employee-api-tests/
├── schemas/
│   ├── employee_schema.py      # Schemas de empleado
│   └── error_schema.py         # Schemas de errores
├── helpers/
│   ├── api_client.py           # Wrapper de API con auth
│   ├── mock_manager.py         # Mocks para tests de UI
│   └── data_factory.py         # Generador de datos
├── tests/
│   ├── conftest.py             # Fixtures
│   ├── api/                    # Tests de API pura
│   │   ├── test_auth.py
│   │   ├── test_employees_crud.py
│   │   ├── test_employees_filters.py
│   │   └── test_permissions.py
│   └── ui/                     # Tests de UI con mocks
│       ├── test_employee_list.py
│       └── test_employee_form.py
└── pytest.ini</code></pre>

        <h3>📐 1. Schemas</h3>
        <div class="code-tabs" data-code-id="L077-1">
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
            <pre><code class="language-python"># schemas/employee_schema.py
EMPLOYEE_SCHEMA = {
    "type": "object",
    "required": ["id", "name", "email", "department", "position", "status"],
    "properties": {
        "id": {"type": "integer", "minimum": 1},
        "name": {"type": "string", "minLength": 2},
        "email": {"type": "string", "format": "email"},
        "phone": {"type": ["string", "null"]},
        "department": {"type": "string"},
        "position": {"type": "string"},
        "salary": {"type": ["number", "null"], "minimum": 0},
        "status": {"type": "string", "enum": ["active", "inactive", "on_leave"]},
        "hire_date": {"type": "string", "format": "date"},
        "created_at": {"type": "string", "format": "date-time"},
    }
}

EMPLOYEE_LIST_SCHEMA = {
    "type": "object",
    "required": ["data", "total", "page"],
    "properties": {
        "data": {"type": "array", "items": EMPLOYEE_SCHEMA},
        "total": {"type": "integer", "minimum": 0},
        "page": {"type": "integer", "minimum": 1},
        "per_page": {"type": "integer"},
    }
}</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// schemas/employee-schema.ts
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export const EMPLOYEE_SCHEMA = {
    type: 'object',
    required: ['id', 'name', 'email', 'department', 'position', 'status'],
    properties: {
        id:         { type: 'integer', minimum: 1 },
        name:       { type: 'string', minLength: 2 },
        email:      { type: 'string', format: 'email' },
        phone:      { type: ['string', 'null'] },
        department: { type: 'string' },
        position:   { type: 'string' },
        salary:     { type: ['number', 'null'], minimum: 0 },
        status:     { type: 'string', enum: ['active', 'inactive', 'on_leave'] },
        hire_date:  { type: 'string', format: 'date' },
        created_at: { type: 'string', format: 'date-time' },
    },
} as const;

export const EMPLOYEE_LIST_SCHEMA = {
    type: 'object',
    required: ['data', 'total', 'page'],
    properties: {
        data:     { type: 'array', items: EMPLOYEE_SCHEMA },
        total:    { type: 'integer', minimum: 0 },
        page:     { type: 'integer', minimum: 1 },
        per_page: { type: 'integer' },
    },
} as const;

export const validateEmployee = ajv.compile(EMPLOYEE_SCHEMA);
export const validateEmployeeList = ajv.compile(EMPLOYEE_LIST_SCHEMA);</code></pre>
        </div>
        </div>

        <h3>🔧 2. API Client</h3>
        <div class="code-tabs" data-code-id="L077-2">
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
            <pre><code class="language-python"># helpers/api_client.py
class EmployeeAPI:
    """Wrapper tipado para la API de empleados."""

    def __init__(self, request_context):
        self.api = request_context

    def login(self, email, password):
        resp = self.api.post("/auth/login", data={
            "email": email, "password": password
        })
        return resp

    def list_employees(self, **params):
        return self.api.get("/api/employees", params=params)

    def get_employee(self, emp_id):
        return self.api.get(f"/api/employees/{emp_id}")

    def create_employee(self, data):
        return self.api.post("/api/employees", data=data)

    def update_employee(self, emp_id, data):
        return self.api.put(f"/api/employees/{emp_id}", data=data)

    def delete_employee(self, emp_id):
        return self.api.delete(f"/api/employees/{emp_id}")

    def list_departments(self):
        return self.api.get("/api/departments")</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// helpers/api-client.ts
import type { APIRequestContext, APIResponse } from '@playwright/test';

export class EmployeeAPI {
    constructor(private api: APIRequestContext) {}

    login(email: string, password: string): Promise&lt;APIResponse&gt; {
        return this.api.post('/auth/login', {
            data: { email, password },
        });
    }

    listEmployees(params?: Record&lt;string, string&gt;) {
        return this.api.get('/api/employees', { params });
    }

    getEmployee(empId: number) {
        return this.api.get('/api/employees/' + empId);
    }

    createEmployee(data: Record&lt;string, unknown&gt;) {
        return this.api.post('/api/employees', { data });
    }

    updateEmployee(empId: number, data: Record&lt;string, unknown&gt;) {
        return this.api.put('/api/employees/' + empId, { data });
    }

    deleteEmployee(empId: number) {
        return this.api.delete('/api/employees/' + empId);
    }

    listDepartments() {
        return this.api.get('/api/departments');
    }
}</code></pre>
        </div>
        </div>

        <h3>🏭 3. Data Factory</h3>
        <div class="code-tabs" data-code-id="L077-3">
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
            <pre><code class="language-python"># helpers/data_factory.py
import random
import string

class EmployeeFactory:
    """Genera datos de empleados para testing."""

    DEPARTMENTS = ["I+D", "QA", "Comercial", "RRHH", "Contabilidad"]
    POSITIONS = ["Developer", "QA Engineer", "Manager", "Analyst", "Director"]

    @staticmethod
    def build(**overrides):
        uid = ''.join(random.choices(string.ascii_lowercase, k=6))
        data = {
            "name": f"Test Employee {uid}",
            "email": f"test_{uid}@playwright-test.com",
            "phone": f"300{random.randint(1000000, 9999999)}",
            "department": random.choice(EmployeeFactory.DEPARTMENTS),
            "position": random.choice(EmployeeFactory.POSITIONS),
            "salary": random.randint(2000000, 8000000),
            "status": "active",
            "hire_date": "2026-01-15",
        }
        data.update(overrides)
        return data

    @staticmethod
    def build_admin():
        return EmployeeFactory.build(
            department="I+D", position="Director", salary=10000000
        )

    @staticmethod
    def build_qa():
        return EmployeeFactory.build(
            department="QA", position="QA Engineer"
        )</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// helpers/data-factory.ts
import crypto from 'crypto';

const DEPARTMENTS = ['I+D', 'QA', 'Comercial', 'RRHH', 'Contabilidad'];
const POSITIONS = ['Developer', 'QA Engineer', 'Manager', 'Analyst', 'Director'];

function randomItem&lt;T&gt;(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export class EmployeeFactory {
    static build(overrides: Record&lt;string, unknown&gt; = {}) {
        const uid = crypto.randomBytes(3).toString('hex');
        return {
            name: 'Test Employee ' + uid,
            email: 'test_' + uid + '@playwright-test.com',
            phone: '300' + Math.floor(1000000 + Math.random() * 9000000),
            department: randomItem(DEPARTMENTS),
            position: randomItem(POSITIONS),
            salary: Math.floor(2000000 + Math.random() * 6000000),
            status: 'active',
            hire_date: '2026-01-15',
            ...overrides,
        };
    }

    static buildAdmin() {
        return EmployeeFactory.build({
            department: 'I+D', position: 'Director', salary: 10000000,
        });
    }

    static buildQa() {
        return EmployeeFactory.build({
            department: 'QA', position: 'QA Engineer',
        });
    }
}</code></pre>
        </div>
        </div>

        <h3>⚙️ 4. Fixtures</h3>
        <div class="code-tabs" data-code-id="L077-4">
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
            <pre><code class="language-python"># tests/conftest.py
import pytest
from playwright.sync_api import Playwright
from helpers.api_client import EmployeeAPI
from helpers.data_factory import EmployeeFactory

BASE_URL = "https://api.employee-system.com"

@pytest.fixture(scope="session")
def admin_token(playwright: Playwright):
    ctx = playwright.request.new_context(base_url=BASE_URL)
    resp = ctx.post("/auth/login", data={
        "email": "admin@empresa.com", "password": "admin123"
    })
    token = resp.json()["access_token"]
    ctx.dispose()
    return token

@pytest.fixture(scope="session")
def admin_api(playwright: Playwright, admin_token):
    ctx = playwright.request.new_context(
        base_url=BASE_URL,
        extra_http_headers={"Authorization": f"Bearer {admin_token}"}
    )
    yield EmployeeAPI(ctx)
    ctx.dispose()

@pytest.fixture(scope="session")
def viewer_api(playwright: Playwright):
    ctx = playwright.request.new_context(base_url=BASE_URL)
    resp = ctx.post("/auth/login", data={
        "email": "viewer@empresa.com", "password": "viewer123"
    })
    token = resp.json()["access_token"]
    ctx.dispose()

    ctx2 = playwright.request.new_context(
        base_url=BASE_URL,
        extra_http_headers={"Authorization": f"Bearer {token}"}
    )
    yield EmployeeAPI(ctx2)
    ctx2.dispose()

@pytest.fixture
def test_employee(admin_api):
    """Crear empleado de prueba y eliminarlo después."""
    data = EmployeeFactory.build()
    resp = admin_api.create_employee(data)
    employee = resp.json()
    yield employee
    admin_api.delete_employee(employee["id"])</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// tests/fixtures.ts
import { test as base, expect } from '@playwright/test';
import { EmployeeAPI } from '../helpers/api-client';
import { EmployeeFactory } from '../helpers/data-factory';

const BASE_URL = 'https://api.employee-system.com';

type EmpFixtures = {
    testEmployee: Record&lt;string, unknown&gt;;
};
type EmpWorkerFixtures = {
    adminApi: EmployeeAPI;
    viewerApi: EmployeeAPI;
};

export const test = base.extend&lt;EmpFixtures, EmpWorkerFixtures&gt;({
    adminApi: [async ({ playwright }, use) => {
        const ctx = await playwright.request.newContext({ baseURL: BASE_URL });
        const resp = await ctx.post('/auth/login', {
            data: { email: 'admin@empresa.com', password: 'admin123' },
        });
        const token = (await resp.json()).access_token;
        await ctx.dispose();

        const apiCtx = await playwright.request.newContext({
            baseURL: BASE_URL,
            extraHTTPHeaders: { Authorization: 'Bearer ' + token },
        });
        await use(new EmployeeAPI(apiCtx));
        await apiCtx.dispose();
    }, { scope: 'worker' }],

    viewerApi: [async ({ playwright }, use) => {
        const ctx = await playwright.request.newContext({ baseURL: BASE_URL });
        const resp = await ctx.post('/auth/login', {
            data: { email: 'viewer@empresa.com', password: 'viewer123' },
        });
        const token = (await resp.json()).access_token;
        await ctx.dispose();

        const apiCtx = await playwright.request.newContext({
            baseURL: BASE_URL,
            extraHTTPHeaders: { Authorization: 'Bearer ' + token },
        });
        await use(new EmployeeAPI(apiCtx));
        await apiCtx.dispose();
    }, { scope: 'worker' }],

    testEmployee: async ({ adminApi }, use) => {
        const data = EmployeeFactory.build();
        const resp = await adminApi.createEmployee(data);
        const employee = await resp.json();
        await use(employee);
        await adminApi.deleteEmployee(employee.id);
    },
});

export { expect } from '@playwright/test';</code></pre>
        </div>
        </div>

        <h3>🧪 5. Tests de API</h3>
        <div class="code-tabs" data-code-id="L077-5">
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
            <pre><code class="language-python"># tests/api/test_auth.py
def test_login_exitoso(playwright):
    ctx = playwright.request.new_context(base_url=BASE_URL)
    resp = ctx.post("/auth/login", data={
        "email": "admin@empresa.com", "password": "admin123"
    })
    assert resp.status == 200
    assert "access_token" in resp.json()
    ctx.dispose()

def test_login_credenciales_invalidas(playwright):
    ctx = playwright.request.new_context(base_url=BASE_URL)
    resp = ctx.post("/auth/login", data={
        "email": "admin@empresa.com", "password": "wrong"
    })
    assert resp.status == 401
    ctx.dispose()

# tests/api/test_employees_crud.py
from jsonschema import validate
from schemas.employee_schema import EMPLOYEE_SCHEMA

def test_crear_empleado(admin_api):
    data = EmployeeFactory.build(department="QA")
    resp = admin_api.create_employee(data)
    assert resp.status == 201
    employee = resp.json()
    validate(instance=employee, schema=EMPLOYEE_SCHEMA)
    assert employee["department"] == "QA"
    admin_api.delete_employee(employee["id"])

def test_obtener_empleado(admin_api, test_employee):
    resp = admin_api.get_employee(test_employee["id"])
    assert resp.ok
    validate(instance=resp.json(), schema=EMPLOYEE_SCHEMA)

def test_actualizar_empleado(admin_api, test_employee):
    resp = admin_api.update_employee(test_employee["id"], {
        **test_employee, "position": "Senior QA"
    })
    assert resp.ok
    assert resp.json()["position"] == "Senior QA"

def test_eliminar_empleado(admin_api):
    data = EmployeeFactory.build()
    emp = admin_api.create_employee(data).json()
    resp = admin_api.delete_employee(emp["id"])
    assert resp.status == 204
    assert admin_api.get_employee(emp["id"]).status == 404

# tests/api/test_permissions.py
def test_viewer_no_puede_crear(viewer_api):
    data = EmployeeFactory.build()
    resp = viewer_api.create_employee(data)
    assert resp.status == 403

def test_viewer_puede_listar(viewer_api):
    resp = viewer_api.list_employees()
    assert resp.ok</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// tests/api/test-auth.spec.ts
import { test, expect } from '../fixtures';
import { EmployeeFactory } from '../../helpers/data-factory';
import { validateEmployee } from '../../schemas/employee-schema';

const BASE_URL = 'https://api.employee-system.com';

test('login exitoso', async ({ playwright }) => {
    const ctx = await playwright.request.newContext({ baseURL: BASE_URL });
    const resp = await ctx.post('/auth/login', {
        data: { email: 'admin@empresa.com', password: 'admin123' },
    });
    expect(resp.status()).toBe(200);
    expect(await resp.json()).toHaveProperty('access_token');
    await ctx.dispose();
});

test('login credenciales inválidas', async ({ playwright }) => {
    const ctx = await playwright.request.newContext({ baseURL: BASE_URL });
    const resp = await ctx.post('/auth/login', {
        data: { email: 'admin@empresa.com', password: 'wrong' },
    });
    expect(resp.status()).toBe(401);
    await ctx.dispose();
});

// tests/api/test-employees-crud.spec.ts
test('crear empleado', async ({ adminApi }) => {
    const data = EmployeeFactory.build({ department: 'QA' });
    const resp = await adminApi.createEmployee(data);
    expect(resp.status()).toBe(201);
    const employee = await resp.json();
    expect(validateEmployee(employee)).toBeTruthy();
    expect(employee.department).toBe('QA');
    await adminApi.deleteEmployee(employee.id);
});

test('obtener empleado', async ({ adminApi, testEmployee }) => {
    const resp = await adminApi.getEmployee(testEmployee.id as number);
    expect(resp.ok()).toBeTruthy();
    expect(validateEmployee(await resp.json())).toBeTruthy();
});

test('actualizar empleado', async ({ adminApi, testEmployee }) => {
    const resp = await adminApi.updateEmployee(testEmployee.id as number, {
        ...testEmployee, position: 'Senior QA',
    });
    expect(resp.ok()).toBeTruthy();
    expect((await resp.json()).position).toBe('Senior QA');
});

test('eliminar empleado', async ({ adminApi }) => {
    const data = EmployeeFactory.build();
    const emp = await (await adminApi.createEmployee(data)).json();
    const resp = await adminApi.deleteEmployee(emp.id);
    expect(resp.status()).toBe(204);
    expect((await adminApi.getEmployee(emp.id)).status()).toBe(404);
});

// tests/api/test-permissions.spec.ts
test('viewer no puede crear', async ({ viewerApi }) => {
    const data = EmployeeFactory.build();
    const resp = await viewerApi.createEmployee(data);
    expect(resp.status()).toBe(403);
});

test('viewer puede listar', async ({ viewerApi }) => {
    const resp = await viewerApi.listEmployees();
    expect(resp.ok()).toBeTruthy();
});</code></pre>
        </div>
        </div>

        <h3>🧪 6. Tests de UI con mocks</h3>
        <div class="code-tabs" data-code-id="L077-6">
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
            <pre><code class="language-python"># tests/ui/test_employee_list.py
from playwright.sync_api import expect
import json

def test_lista_empleados_ui(page):
    page.route("**/api/employees*", lambda r: r.fulfill(
        status=200,
        content_type="application/json",
        body=json.dumps({
            "data": [
                {"id": 1, "name": "Juan Reina", "department": "QA",
                 "position": "Lead", "status": "active",
                 "email": "juan@siesa.com", "hire_date": "2020-01-01",
                 "created_at": "2020-01-01T00:00:00Z"},
                {"id": 2, "name": "Carlos Díaz", "department": "QA",
                 "position": "Engineer", "status": "active",
                 "email": "carlos@siesa.com", "hire_date": "2021-06-15",
                 "created_at": "2021-06-15T00:00:00Z"},
            ],
            "total": 2, "page": 1, "per_page": 10
        })
    ))

    page.goto("https://mi-app.com/employees")
    expect(page.locator("tr.employee-row")).to_have_count(2)
    expect(page.locator("tr.employee-row").first).to_contain_text("Juan Reina")

# tests/ui/test_employee_form.py — UI + API combinado
def test_crear_empleado_por_ui_verificar_api(page):
    api = page.context.request

    page.goto("https://mi-app.com/employees/new")
    page.fill("[name='name']", "Alejandro Bravo")
    page.fill("[name='email']", "alejandro@siesa.com")
    page.select_option("[name='department']", label="QA")

    with page.expect_response("**/api/employees") as resp:
        page.click("[data-testid='save']")

    emp_id = resp.value.json()["id"]
    expect(page.locator(".toast-success")).to_be_visible()

    # Verificar via API
    verify = api.get(f"https://mi-app.com/api/employees/{emp_id}")
    assert verify.json()["name"] == "Alejandro Bravo"

    # Cleanup
    api.delete(f"https://mi-app.com/api/employees/{emp_id}")</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// tests/ui/test-employee-list.spec.ts
import { test, expect } from '@playwright/test';

test('lista empleados UI', async ({ page }) => {
    await page.route('**/api/employees*', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                data: [
                    { id: 1, name: 'Juan Reina', department: 'QA',
                      position: 'Lead', status: 'active',
                      email: 'juan@siesa.com', hire_date: '2020-01-01',
                      created_at: '2020-01-01T00:00:00Z' },
                    { id: 2, name: 'Carlos Díaz', department: 'QA',
                      position: 'Engineer', status: 'active',
                      email: 'carlos@siesa.com', hire_date: '2021-06-15',
                      created_at: '2021-06-15T00:00:00Z' },
                ],
                total: 2, page: 1, per_page: 10,
            }),
        });
    });

    await page.goto('https://mi-app.com/employees');
    await expect(page.locator('tr.employee-row')).toHaveCount(2);
    await expect(page.locator('tr.employee-row').first()).toContainText('Juan Reina');
});

// tests/ui/test-employee-form.spec.ts — UI + API combinado
test('crear empleado por UI verificar API', async ({ page }) => {
    const api = page.context().request;

    await page.goto('https://mi-app.com/employees/new');
    await page.fill('[name="name"]', 'Alejandro Bravo');
    await page.fill('[name="email"]', 'alejandro@siesa.com');
    await page.selectOption('[name="department"]', { label: 'QA' });

    const respPromise = page.waitForResponse('**/api/employees');
    await page.click('[data-testid="save"]');
    const resp = await respPromise;

    const empId = (await resp.json()).id;
    await expect(page.locator('.toast-success')).toBeVisible();

    // Verificar via API
    const verify = await api.get('https://mi-app.com/api/employees/' + empId);
    expect((await verify.json()).name).toBe('Alejandro Bravo');

    // Cleanup
    await api.delete('https://mi-app.com/api/employees/' + empId);
});</code></pre>
        </div>
        </div>

        <h3>📊 Resumen de cobertura</h3>
        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #283593; color: white;">
                        <th style="padding: 10px;">Área</th>
                        <th style="padding: 10px;">Tests</th>
                        <th style="padding: 10px;">Tipo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #e8eaf6;">
                        <td style="padding: 8px;">Autenticación</td>
                        <td style="padding: 8px;">Login OK, login fail, token expirado</td>
                        <td style="padding: 8px;">API</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">CRUD</td>
                        <td style="padding: 8px;">Create, Read, Update, Delete</td>
                        <td style="padding: 8px;">API</td>
                    </tr>
                    <tr style="background: #e8eaf6;">
                        <td style="padding: 8px;">Filtros/paginación</td>
                        <td style="padding: 8px;">Por departamento, status, página</td>
                        <td style="padding: 8px;">API</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Permisos</td>
                        <td style="padding: 8px;">Admin vs viewer, endpoints protegidos</td>
                        <td style="padding: 8px;">API</td>
                    </tr>
                    <tr style="background: #e8eaf6;">
                        <td style="padding: 8px;">Schemas</td>
                        <td style="padding: 8px;">Estructura, tipos, campos requeridos</td>
                        <td style="padding: 8px;">API</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">UI con mocks</td>
                        <td style="padding: 8px;">Lista, formulario, errores</td>
                        <td style="padding: 8px;">UI + Mock</td>
                    </tr>
                    <tr style="background: #e8eaf6;">
                        <td style="padding: 8px;">UI + API real</td>
                        <td style="padding: 8px;">Crear por UI, verificar API</td>
                        <td style="padding: 8px;">Integración</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip SIESA:</strong> Este patrón de API testing es el que usamos
            para validar los servicios del ERP. Cada microservicio tiene su suite de
            API tests con schemas, permisos por rol y fixtures de datos.
        </div>

        <h3>🎯 Ejercicio final</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Extiende la suite con:</p>
            <ol>
                <li>Tests de validación: crear empleado con email duplicado, nombre vacío</li>
                <li>Test de búsqueda: GET /employees?search=Juan</li>
                <li>Test E2E: crear empleado por API → buscarlo en la UI → editarlo por UI → verificar cambios por API</li>
            </ol>
        </div>
    `,
    topics: ["proyecto", "api", "suite"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 12,
    difficulty: "medium",
    type: "integration"
};

if (typeof window !== 'undefined') {
    window.LESSON_077 = LESSON_077;
}
