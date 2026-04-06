/**
 * Playwright Academy - Lección 082
 * Proyecto: Tests integrados UI + API + DB
 * Sección 11: Database Testing
 */

const LESSON_082 = {
    id: 82,
    title: "Proyecto: Tests integrados UI + API + DB",
    duration: "10 min",
    level: "intermediate",
    section: "section-11",
    content: `
        <h2>🏆 Proyecto: Tests integrados UI + API + DB</h2>
        <p>En este proyecto integrador construiremos tests que combinan las
        <strong>tres capas de verificación</strong>: interacción por UI, validación por API
        y verificación en base de datos. Este es el nivel más completo de testing E2E.</p>

        <h3>🎯 Escenario: Sistema de Gestión de Empleados SIESA</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Flujos a automatizar:</p>
            <ol>
                <li><strong>Crear empleado:</strong> UI form → API verify → DB verify</li>
                <li><strong>Editar empleado:</strong> DB setup → UI edit → DB verify</li>
                <li><strong>Eliminar empleado:</strong> DB setup → UI delete → DB verify</li>
                <li><strong>Reporte de nómina:</strong> DB seed → UI report → DB totals verify</li>
            </ol>
        </div>

        <h3>📁 Estructura del proyecto</h3>
        <pre><code class="text">employee-management-tests/
├── helpers/
│   ├── db_helper.py            # Conexión y queries
│   ├── api_client.py           # Wrapper API
│   ├── data_factory.py         # Generador de datos
│   └── cross_validator.py      # Validación UI-DB
├── pages/
│   ├── base_page.py
│   ├── login_page.py
│   ├── employees_page.py
│   └── employee_form_page.py
├── tests/
│   ├── conftest.py
│   ├── test_create_employee.py
│   ├── test_edit_employee.py
│   ├── test_delete_employee.py
│   └── test_payroll_report.py
└── pytest.ini</code></pre>

        <h3>⚙️ Fixtures integradas</h3>
        <pre><code class="python"># tests/conftest.py
import pytest
from helpers.db_helper import DatabaseHelper
from helpers.api_client import EmployeeAPI
from helpers.data_factory import EmployeeFactory
from pages.login_page import LoginPage

DB_CONFIG = {
    "host": "localhost", "port": 5432,
    "database": "employee_test", "user": "test", "password": "test123"
}
API_BASE = "https://employee-app.com"

@pytest.fixture(scope="session")
def db():
    return DatabaseHelper(DB_CONFIG)

@pytest.fixture(scope="session")
def admin_api(playwright):
    ctx = playwright.request.new_context(base_url=API_BASE)
    resp = ctx.post("/auth/login", data={
        "email": "admin@siesa.com", "password": "admin123"
    })
    token = resp.json()["access_token"]
    ctx.dispose()

    ctx2 = playwright.request.new_context(
        base_url=API_BASE,
        extra_http_headers={"Authorization": f"Bearer {token}"}
    )
    yield EmployeeAPI(ctx2)
    ctx2.dispose()

@pytest.fixture
def logged_in_page(page):
    """Página con login completado."""
    login = LoginPage(page)
    login.navigate().login_as_admin()
    page.wait_for_url("**/dashboard")
    return page

@pytest.fixture(autouse=True)
def cleanup_test_data(db):
    yield
    db.execute(
        "DELETE FROM employees WHERE email LIKE %s",
        ("%@playwright-test.com",)
    )

@pytest.fixture
def db_employee(db):
    """Empleado creado directamente en BD."""
    data = EmployeeFactory.build()
    emp_id = db.insert("employees", data)
    emp = db.query_one("SELECT * FROM employees WHERE id = %s", (emp_id,))
    yield emp
    db.delete("employees", "id = %s", (emp_id,))</code></pre>

        <h3>🧪 Test 1: Crear empleado (UI → API → DB)</h3>
        <pre><code class="python"># tests/test_create_employee.py
from playwright.sync_api import expect
from helpers.data_factory import EmployeeFactory

def test_crear_empleado_tres_capas(logged_in_page, admin_api, db):
    """Crear empleado por UI, verificar por API y por BD."""
    page = logged_in_page
    emp_data = EmployeeFactory.build(
        name="Juan Test Integrado",
        department="QA",
        position="QA Lead"
    )

    # ══ CAPA 1: UI — Crear por formulario ══
    page.goto("https://employee-app.com/employees/new")
    page.fill("[name='name']", emp_data["name"])
    page.fill("[name='email']", emp_data["email"])
    page.fill("[name='phone']", emp_data["phone"])
    page.select_option("[name='department']", label="QA")
    page.fill("[name='position']", emp_data["position"])
    page.fill("[name='salary']", str(emp_data["salary"]))

    with page.expect_response("**/api/employees") as resp:
        page.click("[data-testid='save']")

    # Verificar UI muestra éxito
    expect(page.locator(".toast-success")).to_be_visible()
    emp_id = resp.value.json()["id"]

    # ══ CAPA 2: API — Verificar que la API retorna el empleado ══
    api_response = admin_api.get_employee(emp_id)
    assert api_response.ok
    api_data = api_response.json()
    assert api_data["name"] == emp_data["name"]
    assert api_data["email"] == emp_data["email"]
    assert api_data["department"] == "QA"
    assert api_data["status"] == "active"

    # ══ CAPA 3: BD — Verificar datos directamente ══
    db_record = db.query_one(
        "SELECT * FROM employees WHERE id = %s", (emp_id,)
    )
    assert db_record is not None
    assert db_record["name"] == emp_data["name"]
    assert db_record["email"] == emp_data["email"]
    assert float(db_record["salary"]) == emp_data["salary"]
    assert db_record["created_at"] is not None
    assert db_record["created_by"] is not None  # Auditoría</code></pre>

        <h3>🧪 Test 2: Editar empleado (DB → UI → DB)</h3>
        <pre><code class="python"># tests/test_edit_employee.py

def test_editar_empleado_tres_capas(logged_in_page, db, db_employee):
    """Setup en BD, editar por UI, verificar en BD."""
    page = logged_in_page
    emp = db_employee

    # ══ Verificar estado inicial en BD ══
    assert emp["position"] != "Director QA"

    # ══ EDITAR por UI ══
    page.goto(f"https://employee-app.com/employees/{emp['id']}/edit")
    page.fill("[name='position']", "Director QA")
    page.fill("[name='salary']", "12000000")
    page.click("[data-testid='save']")
    expect(page.locator(".toast-success")).to_be_visible()

    # ══ VERIFICAR en BD ══
    updated = db.query_one(
        "SELECT * FROM employees WHERE id = %s", (emp["id"],)
    )
    assert updated["position"] == "Director QA"
    assert float(updated["salary"]) == 12000000
    assert updated["updated_at"] > emp["created_at"]  # Timestamp actualizado</code></pre>

        <h3>🧪 Test 3: Eliminar empleado (DB → UI → DB)</h3>
        <pre><code class="python"># tests/test_delete_employee.py

def test_eliminar_empleado_tres_capas(logged_in_page, db, admin_api):
    """Setup en BD, eliminar por UI, verificar ausencia en BD y API."""
    page = logged_in_page

    # ══ SETUP: Crear empleado en BD ══
    from helpers.data_factory import EmployeeFactory
    data = EmployeeFactory.build(name="Para Eliminar")
    emp_id = db.insert("employees", data)
    assert db.count("employees", "id = %s", (emp_id,)) == 1

    # ══ ELIMINAR por UI ══
    page.goto("https://employee-app.com/employees")
    row = page.locator("tr.employee-row").filter(has_text="Para Eliminar")
    row.locator("[data-testid='delete-btn']").click()

    # Confirmar en modal
    expect(page.locator("#confirm-modal")).to_be_visible()
    page.click("#confirm-delete")
    expect(page.locator("#confirm-modal")).to_be_hidden()
    expect(page.locator(".toast-success")).to_contain_text("eliminado")

    # ══ VERIFICAR en BD — ya no existe ══
    assert db.count("employees", "id = %s", (emp_id,)) == 0

    # ══ VERIFICAR en API — 404 ══
    api_resp = admin_api.get_employee(emp_id)
    assert api_resp.status == 404</code></pre>

        <h3>🧪 Test 4: Reporte de nómina (DB seed → UI → DB verify)</h3>
        <pre><code class="python"># tests/test_payroll_report.py
import re

def test_reporte_nomina_coincide(logged_in_page, db):
    """Seed datos en BD, verificar reporte en UI, cross-validate."""
    page = logged_in_page

    # ══ Calcular totales reales desde BD ══
    payroll = db.query_one("""
        SELECT
            COUNT(*) as total_employees,
            SUM(salary) as total_payroll,
            AVG(salary)::numeric(12,2) as avg_salary,
            COUNT(*) FILTER (WHERE department = 'QA') as qa_count
        FROM employees
        WHERE status = 'active'
    """)

    # ══ Navegar al reporte en UI ══
    page.goto("https://employee-app.com/reports/payroll")
    page.select_option("#period", label="Mensual")
    page.click("#generate-report")

    expect(page.locator("[data-testid='report-table']")).to_be_visible()

    # ══ CROSS-VALIDATE: UI vs BD ══
    ui_total_emp = page.locator("[data-testid='total-employees']").text_content()
    assert str(payroll["total_employees"]) in ui_total_emp

    ui_total_payroll = page.locator("[data-testid='total-payroll']").text_content()
    total_number = float(re.sub(r'[^\\d.]', '', ui_total_payroll.replace(",", "")))
    assert abs(total_number - float(payroll["total_payroll"])) < 1  # Tolerancia</code></pre>

        <h3>📊 Pirámide de verificación</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="text">         ┌─────────────┐
         │   UI Test    │  ← Lo que ve el usuario
         │  (Playwright)│
         ├─────────────┤
         │  API Verify  │  ← Lo que expone el servidor
         │  (requests)  │
         ├─────────────┤
         │  DB Verify   │  ← La verdad absoluta
         │  (SQL)       │
         └─────────────┘

Cada capa detecta diferentes tipos de bugs:
• UI:  Bugs de renderizado, formateo, navegación
• API: Bugs de lógica de negocio, serialización
• DB:  Bugs de persistencia, constraints, triggers</code></pre>
        </div>

        <h3>📋 Resumen de patrones</h3>
        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #283593; color: white;">
                        <th style="padding: 10px;">Flujo</th>
                        <th style="padding: 10px;">Setup</th>
                        <th style="padding: 10px;">Acción</th>
                        <th style="padding: 10px;">Verificación</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #e8eaf6;">
                        <td style="padding: 8px;">Crear</td>
                        <td style="padding: 8px;">—</td>
                        <td style="padding: 8px;">UI form</td>
                        <td style="padding: 8px;">API + DB</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Editar</td>
                        <td style="padding: 8px;">DB insert</td>
                        <td style="padding: 8px;">UI form</td>
                        <td style="padding: 8px;">DB query</td>
                    </tr>
                    <tr style="background: #e8eaf6;">
                        <td style="padding: 8px;">Eliminar</td>
                        <td style="padding: 8px;">DB insert</td>
                        <td style="padding: 8px;">UI delete</td>
                        <td style="padding: 8px;">DB count + API 404</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Reporte</td>
                        <td style="padding: 8px;">DB seed</td>
                        <td style="padding: 8px;">UI navigate</td>
                        <td style="padding: 8px;">UI vs DB cross-check</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip SIESA:</strong> En el ERP, los tests de tres capas son
            obligatorios para módulos financieros (Contabilidad, Nómina, Facturación).
            Un error en la BD que la UI no detecta puede tener consecuencias legales.
        </div>

        <h3>🎓 Sección 11 completada</h3>
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin: 15px 0; text-align: center;">
            <h3 style="color: white; margin-bottom: 10px;">🏆 ¡Felicitaciones!</h3>
            <p>Has completado la <strong>Sección 11: Database Testing</strong>.
            Ahora puedes crear tests que verifican datos en las tres capas:
            UI, API y base de datos.</p>
            <p style="font-size: 0.9em; margin-top: 10px;">
                <strong>Siguiente:</strong> Sección 12 — Data-Driven Testing
            </p>
        </div>

        <h3>🎯 Ejercicio final</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Implementa un test de tres capas para:</p>
            <ol>
                <li>Crear un producto por UI con precio y stock</li>
                <li>Verificar por API que el producto existe y tiene los datos correctos</li>
                <li>Verificar en BD que el precio incluye IVA calculado</li>
                <li>Verificar en BD que se creó un registro de auditoría</li>
            </ol>
        </div>
    `,
    topics: ["proyecto", "integración", "ui-api-db"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 10,
    difficulty: "medium",
    type: "integration"
};

if (typeof window !== 'undefined') {
    window.LESSON_082 = LESSON_082;
}
