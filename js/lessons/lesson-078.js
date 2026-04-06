/**
 * Playwright Academy - Lección 078
 * Conexión a bases de datos desde Python
 * Sección 11: Database Testing
 */

const LESSON_078 = {
    id: 78,
    title: "Conexión a bases de datos desde Python",
    duration: "8 min",
    level: "intermediate",
    section: "section-11",
    content: `
        <h2>🗄️ Conexión a bases de datos desde Python</h2>
        <p>En testing de integración, a menudo necesitamos verificar que la aplicación
        <strong>guardó los datos correctamente en la base de datos</strong>, o necesitamos
        <strong>preparar datos directamente en la BD</strong> antes de un test. Python
        tiene excelentes librerías para conectarse a cualquier motor de base de datos.</p>

        <h3>🤔 ¿Por qué conectarse a la BD desde tests?</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <ul>
                <li><strong>Verificación profunda:</strong> La UI muestra "Guardado" pero ¿realmente se guardó?</li>
                <li><strong>Setup rápido:</strong> Insertar datos directamente es más rápido que por UI o API</li>
                <li><strong>Cleanup:</strong> Eliminar datos de prueba después de cada test</li>
                <li><strong>Edge cases:</strong> Crear estados de datos difíciles de lograr por UI</li>
                <li><strong>Auditoría:</strong> Verificar campos que la UI no muestra (timestamps, logs)</li>
            </ul>
        </div>

        <h3>🐘 PostgreSQL con psycopg2</h3>
        <pre><code class="python"># pip install psycopg2-binary
import psycopg2
from psycopg2.extras import RealDictCursor

# ── Conexión básica ──
conn = psycopg2.connect(
    host="localhost",
    port=5432,
    database="mi_app_test",
    user="test_user",
    password="test_password"
)

# Cursor que retorna diccionarios (no tuplas)
cursor = conn.cursor(cursor_factory=RealDictCursor)

# Ejecutar query
cursor.execute("SELECT * FROM employees WHERE department = %s", ("QA",))
rows = cursor.fetchall()
# [{"id": 1, "name": "Juan", "department": "QA"}, ...]

# Cerrar
cursor.close()
conn.close()</code></pre>

        <h3>🐬 MySQL con mysql-connector</h3>
        <pre><code class="python"># pip install mysql-connector-python
import mysql.connector

conn = mysql.connector.connect(
    host="localhost",
    port=3306,
    database="mi_app_test",
    user="test_user",
    password="test_password"
)

cursor = conn.cursor(dictionary=True)  # Retorna diccionarios
cursor.execute("SELECT * FROM products WHERE price > %s", (100000,))
rows = cursor.fetchall()

cursor.close()
conn.close()</code></pre>

        <h3>🪶 SQLite (ideal para tests locales)</h3>
        <pre><code class="python"># Incluido en Python — no necesita instalación
import sqlite3

conn = sqlite3.connect("test_database.db")
conn.row_factory = sqlite3.Row  # Acceso por nombre de columna

cursor = conn.cursor()
cursor.execute("SELECT * FROM users WHERE active = ?", (True,))
rows = [dict(row) for row in cursor.fetchall()]

conn.close()</code></pre>

        <h3>🔧 SQL Server con pyodbc</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python"># pip install pyodbc
import pyodbc

# Conexión a SQL Server (muy usado en SIESA)
conn = pyodbc.connect(
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=localhost,1433;"
    "DATABASE=mi_app_test;"
    "UID=sa;"
    "PWD=TestPassword123;"
)

cursor = conn.cursor()
cursor.execute("SELECT * FROM Empleados WHERE Departamento = ?", "I+D")
columns = [column[0] for column in cursor.description]
rows = [dict(zip(columns, row)) for row in cursor.fetchall()]

cursor.close()
conn.close()</code></pre>
        </div>

        <h3>⚙️ Helper de base de datos reutilizable</h3>
        <pre><code class="python"># utils/db_helper.py
import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager

class DatabaseHelper:
    """Helper para interactuar con la base de datos en tests."""

    def __init__(self, config):
        self.config = config

    @contextmanager
    def connection(self):
        """Context manager para conexiones seguras."""
        conn = psycopg2.connect(**self.config)
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()

    def query(self, sql, params=None):
        """Ejecutar SELECT y retornar resultados."""
        with self.connection() as conn:
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            cursor.execute(sql, params or ())
            return cursor.fetchall()

    def query_one(self, sql, params=None):
        """Ejecutar SELECT y retornar un solo resultado."""
        with self.connection() as conn:
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            cursor.execute(sql, params or ())
            return cursor.fetchone()

    def execute(self, sql, params=None):
        """Ejecutar INSERT/UPDATE/DELETE."""
        with self.connection() as conn:
            cursor = conn.cursor()
            cursor.execute(sql, params or ())
            return cursor.rowcount

    def insert(self, table, data):
        """Insertar un registro y retornar el ID."""
        columns = ", ".join(data.keys())
        placeholders = ", ".join(["%s"] * len(data))
        sql = f"INSERT INTO {table} ({columns}) VALUES ({placeholders}) RETURNING id"
        with self.connection() as conn:
            cursor = conn.cursor()
            cursor.execute(sql, list(data.values()))
            return cursor.fetchone()[0]

    def delete(self, table, condition, params=None):
        """Eliminar registros por condición."""
        sql = f"DELETE FROM {table} WHERE {condition}"
        return self.execute(sql, params)

    def count(self, table, condition="1=1", params=None):
        """Contar registros."""
        result = self.query_one(
            f"SELECT COUNT(*) as total FROM {table} WHERE {condition}",
            params
        )
        return result["total"]</code></pre>

        <h3>⚙️ Integración con pytest</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python"># conftest.py
import pytest
from utils.db_helper import DatabaseHelper

DB_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "database": "mi_app_test",
    "user": "test_user",
    "password": "test_password",
}

@pytest.fixture(scope="session")
def db():
    """Fixture que provee acceso a la base de datos."""
    return DatabaseHelper(DB_CONFIG)

@pytest.fixture(autouse=True)
def clean_test_data(db):
    """Limpiar datos de prueba después de cada test."""
    yield
    db.execute(
        "DELETE FROM employees WHERE email LIKE %s",
        ("%@playwright-test.com",)
    )

# ── Uso en tests ──
def test_verificar_datos_en_bd(db, page):
    # Interactuar por UI
    page.goto("https://mi-app.com/employees/new")
    page.fill("[name='name']", "Test BD User")
    page.fill("[name='email']", "bd_test@playwright-test.com")
    page.click("[data-testid='save']")

    # Verificar en la base de datos
    employee = db.query_one(
        "SELECT * FROM employees WHERE email = %s",
        ("bd_test@playwright-test.com",)
    )
    assert employee is not None
    assert employee["name"] == "Test BD User"</code></pre>
        </div>

        <h3>🔒 Seguridad: Variables de entorno</h3>
        <pre><code class="python"># NUNCA hardcodear credenciales de BD
import os

DB_CONFIG = {
    "host": os.environ.get("DB_HOST", "localhost"),
    "port": int(os.environ.get("DB_PORT", 5432)),
    "database": os.environ.get("DB_NAME", "test_db"),
    "user": os.environ.get("DB_USER", "test_user"),
    "password": os.environ["DB_PASSWORD"],  # Requerido
}

# En CI/CD, configurar como secrets del pipeline
# En local, usar archivo .env (NO commitear)</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip SIESA:</strong> En SIESA usamos SQL Server para el ERP.
            El <code>DatabaseHelper</code> con pyodbc nos permite verificar que las
            transacciones contables se registran correctamente en las tablas del sistema.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Crea un <code>DatabaseHelper</code> para SQLite que:</p>
            <ol>
                <li>Cree una tabla <code>tasks</code> con id, title, status, created_at</li>
                <li>Tenga métodos: insert_task, get_task, delete_task, count_tasks</li>
                <li>Se integre como fixture de pytest</li>
                <li>Tenga cleanup automático después de cada test</li>
            </ol>
        </div>
    `,
    topics: ["database", "conexión", "python"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 8,
    difficulty: "medium",
    type: "foundation"
};

if (typeof window !== 'undefined') {
    window.LESSON_078 = LESSON_078;
}
