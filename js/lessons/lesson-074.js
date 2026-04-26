/**
 * Playwright Academy - Lección 074
 * Validación de schemas JSON
 * Sección 10: API Testing con Playwright
 */

const LESSON_074 = {
    id: 74,
    title: "Validación de schemas JSON",
    duration: "7 min",
    level: "intermediate",
    section: "section-10",
    content: `
        <h2>📐 Validación de schemas JSON</h2>
        <p>Verificar que las respuestas de la API tienen la <strong>estructura correcta</strong>
        es tan importante como verificar los datos. La validación de schemas garantiza que
        los tipos de datos, campos requeridos y formatos son correctos.</p>

        <h3>🤔 ¿Por qué validar schemas?</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <ul>
                <li><strong>Contratos de API:</strong> Verificar que la API cumple su contrato</li>
                <li><strong>Detección temprana:</strong> Encontrar cambios no intencionales en la API</li>
                <li><strong>Tipos de datos:</strong> Asegurar que <code>price</code> es número, no string</li>
                <li><strong>Campos requeridos:</strong> Verificar que nunca faltan campos obligatorios</li>
                <li><strong>Formatos:</strong> Validar emails, fechas, URLs</li>
            </ul>
        </div>

        <h3>🔧 Validación manual (sin librerías externas)</h3>
        <div class="code-tabs" data-code-id="L074-1">
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
            <pre><code class="language-python"># Validación básica con Python puro

def validate_task_schema(data):
    """Validar que un objeto task tiene la estructura correcta."""
    # Campos requeridos
    required = ["id", "title", "status", "priority", "created_at"]
    for field in required:
        assert field in data, f"Campo requerido '{field}' faltante"

    # Tipos de datos
    assert isinstance(data["id"], int), "id debe ser int"
    assert isinstance(data["title"], str), "title debe ser string"
    assert isinstance(data["status"], str), "status debe ser string"
    assert len(data["title"]) > 0, "title no puede estar vacío"

    # Valores válidos (enums)
    valid_statuses = ["pending", "in_progress", "completed", "cancelled"]
    assert data["status"] in valid_statuses, (
        f"status '{data['status']}' no es válido"
    )

    valid_priorities = ["low", "medium", "high", "critical"]
    assert data["priority"] in valid_priorities, (
        f"priority '{data['priority']}' no es válida"
    )

    # Campos opcionales con tipo correcto
    if "description" in data:
        assert isinstance(data["description"], (str, type(None)))
    if "assignee" in data:
        assert isinstance(data["assignee"], (str, type(None)))

# Uso en test
def test_schema_de_tarea(api):
    response = api.get("/api/tasks/1")
    assert response.ok
    validate_task_schema(response.json())</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// Validación básica con TypeScript puro
import { expect } from '@playwright/test';

function validateTaskSchema(data: Record&lt;string, unknown&gt;) {
    // Campos requeridos
    const required = ['id', 'title', 'status', 'priority', 'created_at'];
    for (const field of required) {
        expect(data).toHaveProperty(field);
    }

    // Tipos de datos
    expect(typeof data.id).toBe('number');
    expect(typeof data.title).toBe('string');
    expect(typeof data.status).toBe('string');
    expect((data.title as string).length).toBeGreaterThan(0);

    // Valores válidos (enums)
    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
    expect(validStatuses).toContain(data.status);

    const validPriorities = ['low', 'medium', 'high', 'critical'];
    expect(validPriorities).toContain(data.priority);

    // Campos opcionales con tipo correcto
    if ('description' in data) {
        expect(
            typeof data.description === 'string' || data.description === null
        ).toBeTruthy();
    }
    if ('assignee' in data) {
        expect(
            typeof data.assignee === 'string' || data.assignee === null
        ).toBeTruthy();
    }
}

// Uso en test
test('schema de tarea', async ({ api }) => {
    const response = await api.get('/api/tasks/1');
    expect(response.ok()).toBeTruthy();
    validateTaskSchema(await response.json());
});</code></pre>
        </div>
        </div>

        <h3>📦 Validación con jsonschema (recomendado)</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L074-2">
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
                <pre><code class="language-python"># pip install jsonschema
from jsonschema import validate, ValidationError
import pytest

# Definir el schema una vez
TASK_SCHEMA = {
    "type": "object",
    "required": ["id", "title", "status", "priority", "created_at"],
    "properties": {
        "id": {"type": "integer", "minimum": 1},
        "title": {"type": "string", "minLength": 1, "maxLength": 200},
        "description": {"type": ["string", "null"]},
        "status": {
            "type": "string",
            "enum": ["pending", "in_progress", "completed", "cancelled"]
        },
        "priority": {
            "type": "string",
            "enum": ["low", "medium", "high", "critical"]
        },
        "assignee": {"type": ["string", "null"], "format": "email"},
        "created_at": {"type": "string", "format": "date-time"},
        "updated_at": {"type": ["string", "null"], "format": "date-time"},
    },
    "additionalProperties": False  # No permitir campos extra
}

TASKS_LIST_SCHEMA = {
    "type": "object",
    "required": ["data", "total", "page", "per_page"],
    "properties": {
        "data": {
            "type": "array",
            "items": TASK_SCHEMA
        },
        "total": {"type": "integer", "minimum": 0},
        "page": {"type": "integer", "minimum": 1},
        "per_page": {"type": "integer", "minimum": 1, "maximum": 100},
    }
}

# ── Uso en tests ──
def test_schema_tarea_individual(api):
    response = api.get("/api/tasks/1")
    assert response.ok
    validate(instance=response.json(), schema=TASK_SCHEMA)

def test_schema_lista_tareas(api):
    response = api.get("/api/tasks")
    assert response.ok
    validate(instance=response.json(), schema=TASKS_LIST_SCHEMA)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// npm install ajv ajv-formats
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { test, expect, type APIRequestContext } from '@playwright/test';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Definir el schema una vez
const TASK_SCHEMA = {
    type: 'object',
    required: ['id', 'title', 'status', 'priority', 'created_at'],
    properties: {
        id:          { type: 'integer', minimum: 1 },
        title:       { type: 'string', minLength: 1, maxLength: 200 },
        description: { type: ['string', 'null'] },
        status:      { type: 'string', enum: ['pending', 'in_progress', 'completed', 'cancelled'] },
        priority:    { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
        assignee:    { type: ['string', 'null'], format: 'email' },
        created_at:  { type: 'string', format: 'date-time' },
        updated_at:  { type: ['string', 'null'], format: 'date-time' },
    },
    additionalProperties: false,
} as const;

const TASKS_LIST_SCHEMA = {
    type: 'object',
    required: ['data', 'total', 'page', 'per_page'],
    properties: {
        data:     { type: 'array', items: TASK_SCHEMA },
        total:    { type: 'integer', minimum: 0 },
        page:     { type: 'integer', minimum: 1 },
        per_page: { type: 'integer', minimum: 1, maximum: 100 },
    },
} as const;

const validateTask = ajv.compile(TASK_SCHEMA);
const validateTasksList = ajv.compile(TASKS_LIST_SCHEMA);

// ── Uso en tests ──
test('schema tarea individual', async ({ api }) => {
    const response = await api.get('/api/tasks/1');
    expect(response.ok()).toBeTruthy();
    const valid = validateTask(await response.json());
    expect(valid, JSON.stringify(validateTask.errors)).toBeTruthy();
});

test('schema lista tareas', async ({ api }) => {
    const response = await api.get('/api/tasks');
    expect(response.ok()).toBeTruthy();
    const valid = validateTasksList(await response.json());
    expect(valid, JSON.stringify(validateTasksList.errors)).toBeTruthy();
});</code></pre>
            </div>
            </div>
        </div>

        <h3>📋 Schemas para diferentes endpoints</h3>
        <div class="code-tabs" data-code-id="L074-3">
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
            <pre><code class="language-python"># schemas/api_schemas.py — Centralizar todos los schemas

USER_SCHEMA = {
    "type": "object",
    "required": ["id", "name", "email", "role"],
    "properties": {
        "id": {"type": "integer"},
        "name": {"type": "string", "minLength": 1},
        "email": {"type": "string", "format": "email"},
        "role": {"type": "string", "enum": ["admin", "editor", "viewer"]},
        "avatar": {"type": ["string", "null"], "format": "uri"},
        "active": {"type": "boolean"},
        "created_at": {"type": "string", "format": "date-time"},
    }
}

ERROR_SCHEMA = {
    "type": "object",
    "required": ["error"],
    "properties": {
        "error": {"type": "string"},
        "code": {"type": "string"},
        "details": {"type": ["object", "null"]},
    }
}

VALIDATION_ERROR_SCHEMA = {
    "type": "object",
    "required": ["errors"],
    "properties": {
        "errors": {
            "type": "object",
            "additionalProperties": {
                "type": "array",
                "items": {"type": "string"}
            }
        }
    }
}

# ── Schemas de respuesta de creación ──
CREATE_RESPONSE_SCHEMA = {
    "type": "object",
    "required": ["id", "created_at"],
    "properties": {
        "id": {"type": "integer"},
        "created_at": {"type": "string", "format": "date-time"},
    }
}</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// schemas/api-schemas.ts — Centralizar todos los schemas
import type { JSONSchemaType } from 'ajv';

export const USER_SCHEMA = {
    type: 'object',
    required: ['id', 'name', 'email', 'role'],
    properties: {
        id:         { type: 'integer' },
        name:       { type: 'string', minLength: 1 },
        email:      { type: 'string', format: 'email' },
        role:       { type: 'string', enum: ['admin', 'editor', 'viewer'] },
        avatar:     { type: ['string', 'null'], format: 'uri' },
        active:     { type: 'boolean' },
        created_at: { type: 'string', format: 'date-time' },
    },
} as const;

export const ERROR_SCHEMA = {
    type: 'object',
    required: ['error'],
    properties: {
        error:   { type: 'string' },
        code:    { type: 'string' },
        details: { type: ['object', 'null'] },
    },
} as const;

export const VALIDATION_ERROR_SCHEMA = {
    type: 'object',
    required: ['errors'],
    properties: {
        errors: {
            type: 'object',
            additionalProperties: {
                type: 'array',
                items: { type: 'string' },
            },
        },
    },
} as const;

// ── Schema de respuesta de creación ──
export const CREATE_RESPONSE_SCHEMA = {
    type: 'object',
    required: ['id', 'created_at'],
    properties: {
        id:         { type: 'integer' },
        created_at: { type: 'string', format: 'date-time' },
    },
} as const;</code></pre>
        </div>
        </div>

        <h3>🔧 Helper de validación reutilizable</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L074-4">
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
                <pre><code class="language-python"># utils/schema_validator.py
from jsonschema import validate, ValidationError

class SchemaValidator:
    """Helper para validación de schemas en tests de API."""

    @staticmethod
    def validate_response(response, schema, status=200):
        """Validar status code + schema de la respuesta."""
        assert response.status == status, (
            f"Expected {status}, got {response.status}: "
            f"{response.text()[:200]}"
        )
        data = response.json()
        try:
            validate(instance=data, schema=schema)
        except ValidationError as e:
            pytest.fail(
                f"Schema validation failed:\\n"
                f"Path: {' > '.join(str(p) for p in e.absolute_path)}\\n"
                f"Error: {e.message}\\n"
                f"Data: {data}"
            )
        return data

    @staticmethod
    def validate_list(response, item_schema, min_items=0, max_items=None):
        """Validar que es una lista con items del schema correcto."""
        assert response.ok
        data = response.json()

        if isinstance(data, dict) and "data" in data:
            items = data["data"]
        elif isinstance(data, list):
            items = data
        else:
            pytest.fail(f"Response is not a list: {type(data)}")

        assert len(items) >= min_items, (
            f"Expected at least {min_items} items, got {len(items)}"
        )
        if max_items:
            assert len(items) <= max_items

        for i, item in enumerate(items):
            try:
                validate(instance=item, schema=item_schema)
            except ValidationError as e:
                pytest.fail(f"Item [{i}] failed: {e.message}")

        return items

# ── Uso en tests ──
from utils.schema_validator import SchemaValidator as SV
from schemas.api_schemas import TASK_SCHEMA, USER_SCHEMA

def test_get_task_schema(api):
    response = api.get("/api/tasks/1")
    task = SV.validate_response(response, TASK_SCHEMA, 200)
    assert task["id"] == 1

def test_list_users_schema(api):
    response = api.get("/api/users")
    users = SV.validate_list(response, USER_SCHEMA, min_items=1)
    assert all(u["active"] for u in users)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// utils/schema-validator.ts
import Ajv, { type ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import { expect, type APIResponse } from '@playwright/test';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export class SchemaValidator {
    static validateResponse(
        response: APIResponse,
        validate: ValidateFunction,
        status = 200
    ) {
        expect(response.status()).toBe(status);
        const data = response.json();
        const valid = validate(data);
        if (!valid) {
            const errors = validate.errors?.map(
                (e) => e.instancePath + ' ' + e.message
            ).join('\\n');
            throw new Error('Schema validation failed:\\n' + errors);
        }
        return data;
    }

    static validateList(
        response: APIResponse,
        validateItem: ValidateFunction,
        minItems = 0,
        maxItems?: number
    ) {
        expect(response.ok()).toBeTruthy();
        const data = response.json() as any;

        const items = Array.isArray(data)
            ? data
            : data.data ?? [];

        expect(items.length).toBeGreaterThanOrEqual(minItems);
        if (maxItems !== undefined) {
            expect(items.length).toBeLessThanOrEqual(maxItems);
        }

        for (let i = 0; i &lt; items.length; i++) {
            const valid = validateItem(items[i]);
            if (!valid) {
                throw new Error(
                    'Item [' + i + '] failed: ' +
                    JSON.stringify(validateItem.errors)
                );
            }
        }
        return items;
    }
}

// ── Uso en tests ──
import { TASK_SCHEMA, USER_SCHEMA } from '../schemas/api-schemas';
const validateTask = ajv.compile(TASK_SCHEMA);
const validateUser = ajv.compile(USER_SCHEMA);
const SV = SchemaValidator;

test('get task schema', async ({ api }) => {
    const response = await api.get('/api/tasks/1');
    const task = await SV.validateResponse(response, validateTask, 200);
    expect(task.id).toBe(1);
});

test('list users schema', async ({ api }) => {
    const response = await api.get('/api/users');
    const users = await SV.validateList(response, validateUser, 1);
    expect(users.every((u: any) => u.active)).toBeTruthy();
});</code></pre>
            </div>
            </div>
        </div>

        <h3>🧪 Tests de schema completos</h3>
        <div class="code-tabs" data-code-id="L074-5">
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
            <pre><code class="language-python">def test_todos_los_endpoints_cumplen_schema(api):
    """Verificar schemas en múltiples endpoints de una sola vez."""
    from schemas.api_schemas import TASK_SCHEMA, USER_SCHEMA

    endpoints_and_schemas = [
        ("/api/tasks/1", TASK_SCHEMA),
        ("/api/users/1", USER_SCHEMA),
    ]

    for endpoint, schema in endpoints_and_schemas:
        response = api.get(endpoint)
        SV.validate_response(response, schema, 200)

def test_errores_cumplen_schema(api):
    """Las respuestas de error también deben tener schema consistente."""
    from schemas.api_schemas import ERROR_SCHEMA

    # 404
    response = api.get("/api/tasks/999999")
    SV.validate_response(response, ERROR_SCHEMA, 404)

def test_errores_validacion_cumplen_schema(api):
    """Los errores de validación retornan campos con mensajes."""
    from schemas.api_schemas import VALIDATION_ERROR_SCHEMA

    response = api.post("/api/tasks", data={})  # Sin datos
    SV.validate_response(response, VALIDATION_ERROR_SCHEMA, 422)</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">import { TASK_SCHEMA, USER_SCHEMA, ERROR_SCHEMA, VALIDATION_ERROR_SCHEMA }
    from '../schemas/api-schemas';

const validateTask  = ajv.compile(TASK_SCHEMA);
const validateUser  = ajv.compile(USER_SCHEMA);
const validateError = ajv.compile(ERROR_SCHEMA);
const validateValErr = ajv.compile(VALIDATION_ERROR_SCHEMA);

test('todos los endpoints cumplen schema', async ({ api }) => {
    const endpointsAndValidators: [string, ValidateFunction][] = [
        ['/api/tasks/1', validateTask],
        ['/api/users/1', validateUser],
    ];

    for (const [endpoint, validate] of endpointsAndValidators) {
        const response = await api.get(endpoint);
        SV.validateResponse(response, validate, 200);
    }
});

test('errores cumplen schema', async ({ api }) => {
    // 404
    const response = await api.get('/api/tasks/999999');
    SV.validateResponse(response, validateError, 404);
});

test('errores validación cumplen schema', async ({ api }) => {
    const response = await api.post('/api/tasks', { data: {} });
    SV.validateResponse(response, validateValErr, 422);
});</code></pre>
        </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip:</strong> Mantén los schemas en archivos separados
            (<code>schemas/</code>) y versionados. Si la API tiene documentación OpenAPI/Swagger,
            puedes convertir los schemas directamente desde ahí.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Define schemas y tests para:</p>
            <ol>
                <li>Schema de <code>Product</code> con: id (int), name (string), price (number > 0),
                category (enum), stock (int >= 0)</li>
                <li>Schema de lista paginada de productos</li>
                <li>Schema de error 422 con campo <code>errors</code></li>
                <li>Test que valide la respuesta de GET /products contra el schema</li>
                <li>Test que valide la respuesta de POST /products (éxito y error)</li>
            </ol>
        </div>
    `,
    topics: ["schemas", "json", "validación"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_074 = LESSON_074;
}
