/**
 * Playwright Academy - Lección 084
 * Datos desde archivos externos
 * Sección 12: Data-Driven Testing
 */

const LESSON_084 = {
    id: 84,
    title: "Datos desde archivos externos",
    duration: "7 min",
    level: "intermediate",
    section: "section-12",
    content: `
        <h2>📁 Datos desde archivos externos</h2>
        <p>Cuando los datos de prueba son muchos o cambian frecuentemente, es mejor
        almacenarlos en <strong>archivos externos</strong> (CSV, JSON, Excel, YAML) en lugar
        de hardcodearlos en el código. Esto permite que QAs sin conocimiento de Python
        mantengan los datos de prueba.</p>

        <h3>📄 Datos desde CSV</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python"># test-data/login_data.csv
# email,password,expected_result
# admin@test.com,admin123,dashboard
# editor@test.com,editor123,dashboard
# invalid@test.com,wrong,login
# blocked@test.com,blocked123,account-locked

import csv
import pytest

def load_csv(filepath):
    """Cargar datos de un CSV como lista de diccionarios."""
    with open(filepath, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return list(reader)

# Cargar datos del CSV
login_data = load_csv("test-data/login_data.csv")

@pytest.mark.parametrize("data", login_data,
    ids=[d["email"].split("@")[0] for d in login_data])
def test_login_desde_csv(page, data):
    page.goto("https://mi-app.com/login")
    page.fill("#email", data["email"])
    page.fill("#password", data["password"])
    page.click("#login-btn")
    assert data["expected_result"] in page.url</code></pre>
        </div>

        <h3>📋 Datos desde JSON</h3>
        <pre><code class="python"># test-data/products.json
# [
#   {"name": "Laptop Pro", "price": "2500000", "category": "Electrónica", "valid": true},
#   {"name": "", "price": "100", "category": "General", "valid": false},
#   {"name": "Mouse", "price": "-500", "category": "Accesorios", "valid": false}
# ]

import json
import pytest

def load_json(filepath):
    """Cargar datos desde JSON."""
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

product_data = load_json("test-data/products.json")

@pytest.mark.parametrize("product", product_data,
    ids=[p.get("name", "empty") or "empty" for p in product_data])
def test_crear_producto(page, product):
    page.goto("https://mi-app.com/products/new")
    page.fill("[name='name']", product["name"])
    page.fill("[name='price']", str(product["price"]))
    page.select_option("[name='category']", label=product["category"])
    page.click("#save")

    if product["valid"]:
        expect(page.locator(".toast-success")).to_be_visible()
    else:
        expect(page.locator(".error-message")).to_be_visible()</code></pre>

        <h3>📊 Datos desde Excel</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python"># pip install openpyxl
import openpyxl
import pytest

def load_excel(filepath, sheet_name=None):
    """Cargar datos desde Excel como lista de diccionarios."""
    wb = openpyxl.load_workbook(filepath, read_only=True)
    ws = wb[sheet_name] if sheet_name else wb.active

    # Primera fila como headers
    rows = list(ws.iter_rows(values_only=True))
    headers = [str(h).strip() for h in rows[0]]

    data = []
    for row in rows[1:]:
        if any(cell is not None for cell in row):  # Saltar filas vacías
            data.append(dict(zip(headers, row)))

    wb.close()
    return data

# test-data/test_cases.xlsx
# | email           | password | role   | can_create | can_delete |
# | admin@test.com  | admin123 | admin  | True       | True       |
# | editor@test.com | edit123  | editor | True       | False      |
# | viewer@test.com | view123  | viewer | False      | False      |

permissions_data = load_excel("test-data/test_cases.xlsx", "Permisos")

@pytest.mark.parametrize("data", permissions_data,
    ids=[d["role"] for d in permissions_data])
def test_permisos_por_rol(page, data):
    # Login
    page.goto("https://mi-app.com/login")
    page.fill("#email", data["email"])
    page.fill("#password", data["password"])
    page.click("#login-btn")

    # Verificar permisos
    page.goto("https://mi-app.com/products")
    create_btn = page.locator("[data-testid='create-btn']")

    if data["can_create"]:
        expect(create_btn).to_be_visible()
    else:
        expect(create_btn).to_be_hidden()</code></pre>
        </div>

        <h3>📝 Datos desde YAML</h3>
        <pre><code class="python"># pip install pyyaml

# test-data/scenarios.yaml
# login_scenarios:
#   - name: "Admin exitoso"
#     email: "admin@test.com"
#     password: "admin123"
#     expected: "dashboard"
#
#   - name: "Contraseña incorrecta"
#     email: "admin@test.com"
#     password: "wrong"
#     expected: "Credenciales inválidas"

import yaml
import pytest

def load_yaml(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

scenarios = load_yaml("test-data/scenarios.yaml")["login_scenarios"]

@pytest.mark.parametrize("scenario", scenarios,
    ids=[s["name"] for s in scenarios])
def test_login_scenarios(page, scenario):
    page.goto("https://mi-app.com/login")
    page.fill("#email", scenario["email"])
    page.fill("#password", scenario["password"])
    page.click("#login-btn")

    if "dashboard" in scenario["expected"]:
        expect(page).to_have_url("**/dashboard")
    else:
        expect(page.locator(".error")).to_contain_text(scenario["expected"])</code></pre>

        <h3>🔧 Helper genérico para cargar datos</h3>
        <pre><code class="python"># utils/data_loader.py
import csv
import json
from pathlib import Path

class DataLoader:
    """Carga datos de prueba desde diferentes formatos."""

    BASE_DIR = Path("test-data")

    @staticmethod
    def from_csv(filename):
        path = DataLoader.BASE_DIR / filename
        with open(path, "r", encoding="utf-8") as f:
            return list(csv.DictReader(f))

    @staticmethod
    def from_json(filename):
        path = DataLoader.BASE_DIR / filename
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    @staticmethod
    def from_excel(filename, sheet=None):
        import openpyxl
        path = DataLoader.BASE_DIR / filename
        wb = openpyxl.load_workbook(path, read_only=True)
        ws = wb[sheet] if sheet else wb.active
        rows = list(ws.iter_rows(values_only=True))
        headers = [str(h).strip() for h in rows[0]]
        data = [dict(zip(headers, row)) for row in rows[1:] if any(row)]
        wb.close()
        return data

    @staticmethod
    def auto_load(filename):
        """Detectar formato por extensión y cargar."""
        ext = Path(filename).suffix.lower()
        if ext == ".csv":
            return DataLoader.from_csv(filename)
        elif ext == ".json":
            return DataLoader.from_json(filename)
        elif ext in (".xlsx", ".xls"):
            return DataLoader.from_excel(filename)
        else:
            raise ValueError(f"Formato no soportado: {ext}")

# Uso:
from utils.data_loader import DataLoader

users = DataLoader.from_csv("users.csv")
products = DataLoader.from_json("products.json")
scenarios = DataLoader.from_excel("test_cases.xlsx", "Login")</code></pre>

        <h3>📁 Estructura recomendada de archivos de datos</h3>
        <pre><code class="text">test-data/
├── csv/
│   ├── login_valid.csv
│   ├── login_invalid.csv
│   └── search_queries.csv
├── json/
│   ├── products.json
│   ├── users.json
│   └── checkout_scenarios.json
├── excel/
│   └── test_cases.xlsx      # Múltiples hojas por feature
└── fixtures/
    ├── mock_api_users.json   # Datos para mocks
    └── mock_api_products.json</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip SIESA:</strong> En SIESA, los analistas de QA mantienen los datos
            de prueba en Excel (más accesible para no-programadores). El <code>DataLoader</code>
            los lee automáticamente. Cuando un caso de prueba falla, solo hay que agregar una
            fila al Excel, no tocar código.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Crea un sistema de datos externos:</p>
            <ol>
                <li>Un CSV con 5 escenarios de registro (nombre, email, password, válido)</li>
                <li>Un JSON con 3 escenarios de checkout (datos de envío + pago)</li>
                <li>Un <code>DataLoader</code> que cargue ambos formatos</li>
                <li>Tests parametrizados que usen los datos cargados</li>
            </ol>
        </div>
    `,
    topics: ["archivos", "datos", "externos"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_084 = LESSON_084;
}
