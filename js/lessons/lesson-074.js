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
        <pre><code class="python"># Validación básica con Python puro

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

        <h3>📦 Validación con jsonschema (recomendado)</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python"># pip install jsonschema
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

        <h3>📋 Schemas para diferentes endpoints</h3>
        <pre><code class="python"># schemas/api_schemas.py — Centralizar todos los schemas

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

        <h3>🔧 Helper de validación reutilizable</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python"># utils/schema_validator.py
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

        <h3>🧪 Tests de schema completos</h3>
        <pre><code class="python">def test_todos_los_endpoints_cumplen_schema(api):
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
