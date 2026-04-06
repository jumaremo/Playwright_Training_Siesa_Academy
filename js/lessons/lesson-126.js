/**
 * Playwright Academy - Leccion 126
 * Manejo de datos de prueba
 * Seccion 19: Best Practices y Patrones
 */

const LESSON_126 = {
    id: 126,
    title: "Manejo de datos de prueba",
    duration: "7 min",
    level: "advanced",
    section: "section-19",
    content: `
        <h2>Manejo de datos de prueba</h2>
        <p>Los datos de prueba son el combustible de la automatizacion. Datos incorrectos, desactualizados
        o compartidos entre tests son una de las principales causas de inestabilidad en suites E2E.
        En esta leccion aprenderas estrategias para <strong>generar, gestionar y limpiar</strong>
        datos de prueba de forma eficiente y confiable.</p>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>En SIESA utilizamos una combinacion de datos generados dinamicamente con Faker y datos
            semilla inyectados via API. Cada test crea sus propios datos y los limpia al finalizar.
            Esto elimino el 80% de los fallos por "datos sucios" que sufriamos cuando compartíamos
            una base de datos de pruebas entre todos los tests.</p>
        </div>

        <h3>Estrategias de datos de prueba</h3>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Estrategia</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Cuando usarla</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Ventaja</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Riesgo</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Inline</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Datos simples, directos en el test</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Maximo claridad</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Duplicacion</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Fixtures</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Datos reutilizables entre tests</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Reutilizacion</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Acoplamiento</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Builders</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Objetos complejos con variaciones</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Flexibilidad</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Complejidad inicial</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Faker</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Datos aleatorios realistas</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Descubre edge cases</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">No determinista</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>JSON/CSV</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Datasets grandes, data-driven</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Separacion datos/codigo</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Mantenimiento archivos</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>API seeding</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Setup via API antes de tests UI</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Rapido, confiable</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Requiere API disponible</td>
                </tr>
            </table>
        </div>

        <h3>Faker: datos dinamicos realistas</h3>

        <pre><code class="python"># pip install faker
from faker import Faker

fake = Faker('es_CO')  # Datos en español colombiano

# Generar datos de usuario
user_data = {
    "name": fake.name(),                 # "Carlos Martínez"
    "email": fake.email(),               # "cmartinez@example.com"
    "phone": fake.phone_number(),        # "+57 301 234 5678"
    "address": fake.address(),           # "Calle 45 #12-34, Cali"
    "company": fake.company(),           # "SIESA S.A."
    "job": fake.job(),                   # "Ingeniero de Software"
    "date_birth": fake.date_of_birth(minimum_age=18, maximum_age=65),
}

# Generar datos de producto
product_data = {
    "name": fake.catch_phrase(),         # "Solucion integral optimizada"
    "price": fake.pydecimal(left_digits=4, right_digits=2, positive=True),
    "sku": fake.bothify("???-####"),     # "ABC-1234"
    "description": fake.paragraph(nb_sentences=3),
}</code></pre>

        <pre><code class="python"># Fixture con Faker
import pytest
from faker import Faker

@pytest.fixture
def fake():
    """Instancia de Faker con semilla fija para reproducibilidad."""
    return Faker('es_CO')

@pytest.fixture
def random_user(fake):
    """Genera un usuario aleatorio pero reproducible."""
    return {
        "email": fake.unique.email(),
        "password": "Test1234!",
        "first_name": fake.first_name(),
        "last_name": fake.last_name(),
    }

# Uso en test
def test_register_new_user(page, random_user):
    page.goto("/register")
    page.fill("[data-testid='email']", random_user["email"])
    page.fill("[data-testid='password']", random_user["password"])
    page.fill("[data-testid='first-name']", random_user["first_name"])
    page.fill("[data-testid='last-name']", random_user["last_name"])
    page.click("[data-testid='register-btn']")

    from playwright.sync_api import expect
    expect(page.locator(".success")).to_be_visible()</code></pre>

        <h3>Datos desde archivos externos</h3>

        <pre><code class="python"># data/test_users.json
[
    {"email": "admin@siesa.com", "password": "Admin1234!", "role": "admin"},
    {"email": "viewer@siesa.com", "password": "View1234!", "role": "viewer"},
    {"email": "editor@siesa.com", "password": "Edit1234!", "role": "editor"}
]</code></pre>

        <pre><code class="python"># fixtures/data_fixtures.py
import pytest
import json
import csv
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"

@pytest.fixture
def test_users():
    """Cargar usuarios de prueba desde JSON."""
    data_file = DATA_DIR / "test_users.json"
    return json.loads(data_file.read_text())

@pytest.fixture
def admin_credentials(test_users):
    """Credenciales del usuario admin."""
    return next(u for u in test_users if u["role"] == "admin")

@pytest.fixture
def test_products():
    """Cargar productos de prueba desde CSV."""
    products = []
    with open(DATA_DIR / "test_products.csv") as f:
        reader = csv.DictReader(f)
        for row in reader:
            products.append(row)
    return products</code></pre>

        <h3>API seeding: crear datos via API</h3>

        <pre><code class="python"># fixtures/api_data_fixtures.py
"""Crear datos de prueba via API — mas rapido y confiable que UI."""
import pytest

@pytest.fixture
def create_product(api_context, auth_token):
    """Factory fixture: crea un producto y lo limpia despues."""
    created_ids = []

    def _create(name="Test Product", price=99.99, stock=10):
        response = api_context.post("/api/products", data={
            "name": name, "price": price, "stock": stock
        }, headers={"Authorization": f"Bearer {auth_token}"})
        assert response.ok, f"Error creando producto: {response.status}"
        product = response.json()
        created_ids.append(product["id"])
        return product

    yield _create

    # Cleanup: eliminar productos creados
    for pid in created_ids:
        api_context.delete(
            f"/api/products/{pid}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )

# Uso en test:
def test_product_appears_in_search(page, create_product):
    # ARRANGE: crear producto via API (rapido)
    product = create_product(name="Laptop Dell XPS", price=2999.99)

    # ACT: buscar en la UI
    page.goto("/products")
    page.fill("[data-testid='search']", "Laptop Dell")
    page.click("[data-testid='search-btn']")

    # ASSERT
    from playwright.sync_api import expect
    expect(page.locator(f"[data-product-id='{product['id']}']")).to_be_visible()

    # Cleanup automatico al terminar el test</code></pre>

        <h3>Cleanup strategies</h3>

        <pre><code class="python"># Estrategia 1: Cleanup en fixture (yield)
@pytest.fixture
def temp_user(api_context, auth_token):
    user = api_context.post("/api/users", data={...}).json()
    yield user
    api_context.delete(f"/api/users/{user['id']}")

# Estrategia 2: Cleanup global post-session
@pytest.fixture(scope="session", autouse=True)
def cleanup_test_data(api_context):
    yield
    # Limpiar TODOS los datos de test al final
    api_context.delete("/api/test-data/cleanup")

# Estrategia 3: Prefijo identificable para cleanup selectivo
import time

def generate_test_id():
    """Prefijo unico para datos de este test run."""
    return f"TEST_{int(time.time())}"

@pytest.fixture(scope="session")
def test_prefix():
    return generate_test_id()

@pytest.fixture
def create_user_with_prefix(api_context, test_prefix):
    def _create(name):
        return api_context.post("/api/users", data={
            "name": f"{test_prefix}_{name}",
            "email": f"{test_prefix}_{name}@test.com"
        }).json()
    return _create

# Cleanup por prefijo al final:
@pytest.fixture(scope="session", autouse=True)
def cleanup_by_prefix(api_context, test_prefix):
    yield
    api_context.delete(f"/api/users?prefix={test_prefix}")</code></pre>

        <h3>Parametrize para data-driven testing</h3>

        <pre><code class="python">import pytest

# Data-driven con parametrize
@pytest.mark.parametrize("email,password,expected", [
    ("admin@siesa.com", "Admin1234!", "Dashboard"),
    ("viewer@siesa.com", "View1234!", "Dashboard"),
    ("", "password", "Email es requerido"),
    ("admin@siesa.com", "", "Contraseña es requerida"),
    ("invalid", "pass", "Formato de email invalido"),
])
def test_login_scenarios(page, email, password, expected):
    page.goto("/auth/login")
    page.fill("[data-testid='email']", email)
    page.fill("[data-testid='password']", password)
    page.click("[data-testid='login-btn']")

    from playwright.sync_api import expect
    expect(page.locator("body")).to_contain_text(expected)</code></pre>

        <div style="background: #fce4ec; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Anti-patrones de datos de prueba</h4>
            <ul>
                <li><strong>Datos hardcoded compartidos:</strong> 5 tests usan el mismo usuario "admin" — si se elimina, todos fallan</li>
                <li><strong>Datos dependientes del orden:</strong> test_create crea datos que test_read usa</li>
                <li><strong>Base de datos compartida sin cleanup:</strong> Los datos se acumulan entre ejecuciones</li>
                <li><strong>Datos de produccion:</strong> NUNCA usar datos reales de clientes para testing</li>
            </ul>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Ejercicio Practico</h4>
            <ol>
                <li>Instala Faker y crea un fixture que genere usuarios aleatorios reproducibles</li>
                <li>Crea un archivo <code>test_users.json</code> con 3 perfiles de usuario</li>
                <li>Implementa un factory fixture con cleanup automatico</li>
                <li>Escribe un test data-driven con <code>@pytest.mark.parametrize</code> (5 casos)</li>
                <li>Implementa una estrategia de cleanup por prefijo de test run</li>
            </ol>
        </div>

        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>En la siguiente leccion</strong> exploraras la
            <strong>prevencion y diagnostico de test flakiness</strong>, aprendiendo tecnicas
            avanzadas para construir tests estables y debuggear los inestables.</p>
        </div>
    `,
    topics: ["datos-prueba", "manejo", "estrategias"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_126 = LESSON_126;
}
