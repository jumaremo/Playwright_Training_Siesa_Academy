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
        <div class="code-tabs" data-code-id="L078-1">
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
            <pre><code class="language-python"># pip install psycopg2-binary
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
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// npm install pg @types/pg
import { Client } from 'pg';

// ── Conexión básica ──
const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'mi_app_test',
    user: 'test_user',
    password: 'test_password',
});
await client.connect();

// Ejecutar query (retorna objetos por defecto)
const result = await client.query(
    'SELECT * FROM employees WHERE department = $1', ['QA']
);
const rows = result.rows;
// [{ id: 1, name: "Juan", department: "QA" }, ...]

// Cerrar
await client.end();</code></pre>
        </div>
        </div>

        <h3>🐬 MySQL con mysql-connector</h3>
        <div class="code-tabs" data-code-id="L078-2">
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
            <pre><code class="language-python"># pip install mysql-connector-python
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
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// npm install mysql2
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'mi_app_test',
    user: 'test_user',
    password: 'test_password',
});

// query retorna [rows, fields] — rows ya son objetos
const [rows] = await conn.execute(
    'SELECT * FROM products WHERE price > ?', [100000]
);

await conn.end();</code></pre>
        </div>
        </div>

        <h3>🪶 SQLite (ideal para tests locales)</h3>
        <div class="code-tabs" data-code-id="L078-3">
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
            <pre><code class="language-python"># Incluido en Python — no necesita instalación
import sqlite3

conn = sqlite3.connect("test_database.db")
conn.row_factory = sqlite3.Row  # Acceso por nombre de columna

cursor = conn.cursor()
cursor.execute("SELECT * FROM users WHERE active = ?", (True,))
rows = [dict(row) for row in cursor.fetchall()]

conn.close()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// npm install better-sqlite3 @types/better-sqlite3
import Database from 'better-sqlite3';

const db = new Database('test_database.db');

// better-sqlite3 es síncrono (más rápido para tests)
const rows = db.prepare('SELECT * FROM users WHERE active = ?')
    .all(1);  // SQLite: 1 = true
// [{ id: 1, name: "Juan", active: 1 }, ...]

db.close();</code></pre>
        </div>
        </div>

        <h3>🔧 SQL Server con pyodbc</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L078-4">
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
                <pre><code class="language-python"># pip install pyodbc
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
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// npm install mssql
import sql from 'mssql';

// Conexión a SQL Server (muy usado en SIESA)
const pool = await sql.connect({
    server: 'localhost',
    port: 1433,
    database: 'mi_app_test',
    user: 'sa',
    password: 'TestPassword123',
    options: { trustServerCertificate: true },
});

const result = await pool.request()
    .input('dept', sql.NVarChar, 'I+D')
    .query('SELECT * FROM Empleados WHERE Departamento = @dept');

const rows = result.recordset;
// [{ Id: 1, Nombre: "Juan", Departamento: "I+D" }, ...]

await pool.close();</code></pre>
            </div>
            </div>
        </div>

        <h3>⚙️ Helper de base de datos reutilizable</h3>
        <div class="code-tabs" data-code-id="L078-5">
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
            <pre><code class="language-python"># utils/db_helper.py
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
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// utils/db-helper.ts
import { Pool, type PoolConfig } from 'pg';

export class DatabaseHelper {
    private pool: Pool;

    constructor(config: PoolConfig) {
        this.pool = new Pool(config);
    }

    async query(sql: string, params: unknown[] = []) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(sql, params);
            return result.rows;
        } finally {
            client.release();
        }
    }

    async queryOne(sql: string, params: unknown[] = []) {
        const rows = await this.query(sql, params);
        return rows[0] ?? null;
    }

    async execute(sql: string, params: unknown[] = []) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(sql, params);
            return result.rowCount ?? 0;
        } finally {
            client.release();
        }
    }

    async insert(table: string, data: Record&lt;string, unknown&gt;) {
        const keys = Object.keys(data);
        const cols = keys.join(', ');
        const placeholders = keys.map((_, i) => '$' + (i + 1)).join(', ');
        const sql = 'INSERT INTO ' + table +
            ' (' + cols + ') VALUES (' + placeholders + ') RETURNING id';
        const row = await this.queryOne(sql, Object.values(data));
        return row.id;
    }

    async delete(table: string, condition: string, params: unknown[] = []) {
        return this.execute(
            'DELETE FROM ' + table + ' WHERE ' + condition, params
        );
    }

    async count(table: string, condition = '1=1', params: unknown[] = []) {
        const row = await this.queryOne(
            'SELECT COUNT(*) as total FROM ' + table + ' WHERE ' + condition,
            params
        );
        return Number(row.total);
    }

    async close() {
        await this.pool.end();
    }
}</code></pre>
        </div>
        </div>

        <h3>⚙️ Integración con pytest</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L078-6">
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
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// fixtures.ts
import { test as base, expect } from '@playwright/test';
import { DatabaseHelper } from '../utils/db-helper';

const DB_CONFIG = {
    host: 'localhost',
    port: 5432,
    database: 'mi_app_test',
    user: 'test_user',
    password: 'test_password',
};

// Singleton para reusar el pool en toda la sesión
const db = new DatabaseHelper(DB_CONFIG);

type DbFixtures = { db: DatabaseHelper };

export const test = base.extend&lt;DbFixtures&gt;({
    db: async ({}, use) => {
        await use(db);
        // Cleanup después de cada test
        await db.execute(
            'DELETE FROM employees WHERE email LIKE $1',
            ['%@playwright-test.com']
        );
    },
});

// ── Uso en tests ──
test('verificar datos en BD', async ({ db, page }) => {
    // Interactuar por UI
    await page.goto('https://mi-app.com/employees/new');
    await page.fill('[name="name"]', 'Test BD User');
    await page.fill('[name="email"]', 'bd_test@playwright-test.com');
    await page.click('[data-testid="save"]');

    // Verificar en la base de datos
    const employee = await db.queryOne(
        'SELECT * FROM employees WHERE email = $1',
        ['bd_test@playwright-test.com']
    );
    expect(employee).not.toBeNull();
    expect(employee.name).toBe('Test BD User');
});</code></pre>
            </div>
            </div>
        </div>

        <h3>🔒 Seguridad: Variables de entorno</h3>
        <div class="code-tabs" data-code-id="L078-7">
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
            <pre><code class="language-python"># NUNCA hardcodear credenciales de BD
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
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// NUNCA hardcodear credenciales de BD
// npm install dotenv (para cargar .env en local)
import 'dotenv/config';

const DB_CONFIG = {
    host:     process.env.DB_HOST ?? 'localhost',
    port:     Number(process.env.DB_PORT ?? 5432),
    database: process.env.DB_NAME ?? 'test_db',
    user:     process.env.DB_USER ?? 'test_user',
    password: process.env.DB_PASSWORD!, // Requerido
};

// En CI/CD, configurar como secrets del pipeline
// En local, usar archivo .env (NO commitear)</code></pre>
        </div>
        </div>

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
