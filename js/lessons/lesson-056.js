/**
 * Playwright Academy - Lección 056
 * Helpers y utilidades de testing
 * Sección 7: Page Object Model y Helpers
 */

const LESSON_056 = {
    id: 56,
    title: "Helpers y utilidades de testing",
    duration: "7 min",
    level: "intermediate",
    section: "section-07",
    content: `
        <h2>🛠️ Helpers y utilidades de testing</h2>
        <p>Los <strong>helpers</strong> son funciones utilitarias que complementan los Page Objects,
        resolviendo tareas comunes como: generar datos de prueba, manejar autenticación,
        trabajar con archivos, formatear datos y configurar el entorno de test.</p>

        <h3>🎲 Helper de datos de prueba (Test Data)</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python"># utils/test_data.py
import random
import string
from datetime import datetime, timedelta

class TestData:
    """Generador de datos de prueba realistas."""

    @staticmethod
    def random_string(length=10):
        """Generar string aleatorio."""
        return ''.join(random.choices(string.ascii_lowercase, k=length))

    @staticmethod
    def random_email():
        """Generar email único para testing."""
        uid = TestData.random_string(8)
        return f"test_{uid}@playwright-test.com"

    @staticmethod
    def random_phone():
        """Generar número de teléfono colombiano ficticio."""
        return f"3{random.randint(100000000, 999999999)}"

    @staticmethod
    def random_nit():
        """Generar NIT ficticio para pruebas."""
        number = random.randint(800000000, 999999999)
        digit = random.randint(0, 9)
        return f"{number}-{digit}"

    @staticmethod
    def future_date(days=30):
        """Generar fecha futura en formato YYYY-MM-DD."""
        date = datetime.now() + timedelta(days=days)
        return date.strftime("%Y-%m-%d")

    @staticmethod
    def past_date(days=30):
        """Generar fecha pasada en formato YYYY-MM-DD."""
        date = datetime.now() - timedelta(days=days)
        return date.strftime("%Y-%m-%d")

    @staticmethod
    def user_data(overrides=None):
        """Generar datos completos de usuario.

        Args:
            overrides: dict con campos a sobrescribir.
        """
        data = {
            "nombre": f"Test_{TestData.random_string(5)}",
            "apellido": f"User_{TestData.random_string(5)}",
            "email": TestData.random_email(),
            "telefono": TestData.random_phone(),
            "password": "Test@12345",
            "rol": "usuario"
        }
        if overrides:
            data.update(overrides)
        return data

    @staticmethod
    def product_data(overrides=None):
        """Generar datos completos de producto."""
        data = {
            "nombre": f"Producto_{TestData.random_string(6)}",
            "precio": round(random.uniform(10000, 500000), 2),
            "stock": random.randint(1, 100),
            "categoria": random.choice([
                "Electrónica", "Hogar", "Ropa", "Deportes"
            ]),
            "descripcion": f"Descripción del producto de prueba"
        }
        if overrides:
            data.update(overrides)
        return data</code></pre>
        </div>

        <h3>🔐 Helper de autenticación</h3>
        <pre><code class="python"># utils/auth_helper.py
import json
from pathlib import Path

class AuthHelper:
    """Maneja autenticación y sesiones para tests."""

    STORAGE_DIR = Path("test-results/auth")

    @staticmethod
    def save_auth_state(context, name="default"):
        """Guardar el estado de autenticación (cookies + localStorage).

        Esto permite reutilizar una sesión en múltiples tests
        sin repetir el proceso de login.
        """
        AuthHelper.STORAGE_DIR.mkdir(parents=True, exist_ok=True)
        path = AuthHelper.STORAGE_DIR / f"{name}.json"
        context.storage_state(path=str(path))
        return str(path)

    @staticmethod
    def load_auth_state(browser, name="default"):
        """Crear un contexto con sesión previamente guardada."""
        path = AuthHelper.STORAGE_DIR / f"{name}.json"
        if not path.exists():
            raise FileNotFoundError(
                f"No existe estado de auth '{name}'. "
                f"Ejecuta primero el setup de autenticación."
            )
        return browser.new_context(storage_state=str(path))

    @staticmethod
    def login_and_save(browser, url, email, password, name="default"):
        """Hacer login una vez y guardar el estado."""
        context = browser.new_context()
        page = context.new_page()
        page.goto(url)
        page.fill("[data-testid='email']", email)
        page.fill("[data-testid='password']", password)
        page.click("[data-testid='login-btn']")
        page.wait_for_url("**/dashboard")
        AuthHelper.save_auth_state(context, name)
        context.close()
        return str(AuthHelper.STORAGE_DIR / f"{name}.json")</code></pre>

        <h3>⏱️ Helper de esperas y reintentos</h3>
        <pre><code class="python"># utils/wait_helper.py
import time

class WaitHelper:
    """Utilidades para esperas y reintentos avanzados."""

    @staticmethod
    def retry(func, max_attempts=3, delay=1, exceptions=(Exception,)):
        """Reintentar una función hasta que tenga éxito.

        Args:
            func: Función a ejecutar (sin argumentos).
            max_attempts: Número máximo de intentos.
            delay: Segundos entre intentos.
            exceptions: Tupla de excepciones a capturar.

        Returns:
            El resultado de func() si tiene éxito.

        Raises:
            La última excepción si se agotan los intentos.
        """
        last_exception = None
        for attempt in range(1, max_attempts + 1):
            try:
                return func()
            except exceptions as e:
                last_exception = e
                if attempt < max_attempts:
                    time.sleep(delay)
        raise last_exception

    @staticmethod
    def wait_for_condition(page, condition_func, timeout=10, interval=0.5):
        """Esperar hasta que una condición sea verdadera.

        Args:
            page: Objeto page de Playwright.
            condition_func: Función que retorna True/False.
            timeout: Tiempo máximo en segundos.
            interval: Intervalo entre verificaciones.
        """
        start = time.time()
        while time.time() - start < timeout:
            if condition_func():
                return True
            time.sleep(interval)
        raise TimeoutError(
            f"Condición no se cumplió en {timeout} segundos"
        )

    @staticmethod
    def wait_for_api_response(page, url_pattern, timeout=10000):
        """Esperar una respuesta específica de API."""
        with page.expect_response(
            lambda r: url_pattern in r.url, timeout=timeout
        ) as response_info:
            pass
        return response_info.value</code></pre>

        <h3>📸 Helper de evidencias y screenshots</h3>
        <pre><code class="python"># utils/evidence_helper.py
from pathlib import Path
from datetime import datetime

class EvidenceHelper:
    """Maneja capturas de pantalla y evidencias de tests."""

    BASE_DIR = Path("test-results/evidence")

    @staticmethod
    def capture(page, test_name, step_name=""):
        """Capturar screenshot con nombre descriptivo y timestamp."""
        EvidenceHelper.BASE_DIR.mkdir(parents=True, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        suffix = f"_{step_name}" if step_name else ""
        filename = f"{test_name}{suffix}_{timestamp}.png"
        path = EvidenceHelper.BASE_DIR / filename
        page.screenshot(path=str(path), full_page=True)
        return str(path)

    @staticmethod
    def capture_element(page, selector, test_name, step_name=""):
        """Capturar screenshot de un elemento específico."""
        EvidenceHelper.BASE_DIR.mkdir(parents=True, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        suffix = f"_{step_name}" if step_name else ""
        filename = f"{test_name}{suffix}_{timestamp}.png"
        path = EvidenceHelper.BASE_DIR / filename
        page.locator(selector).screenshot(path=str(path))
        return str(path)

    @staticmethod
    def capture_on_failure(page, test_name):
        """Decorator/helper para capturar en caso de fallo.

        Uso en conftest.py:
            @pytest.fixture(autouse=True)
            def capture_on_failure(page, request):
                yield
                if request.node.rep_call.failed:
                    EvidenceHelper.capture(page, request.node.name, "FAILED")
        """
        return EvidenceHelper.capture(page, test_name, "FAILED")</code></pre>

        <h3>📊 Helper de comparación y validación</h3>
        <pre><code class="python"># utils/validation_helper.py
import re

class ValidationHelper:
    """Utilidades para validaciones comunes en tests."""

    @staticmethod
    def is_valid_email(text):
        """Verificar formato de email."""
        pattern = r'^[\\w.+-]+@[\\w-]+\\.[\\w.]+$'
        return bool(re.match(pattern, text))

    @staticmethod
    def is_valid_date(text, format="%Y-%m-%d"):
        """Verificar formato de fecha."""
        from datetime import datetime
        try:
            datetime.strptime(text, format)
            return True
        except ValueError:
            return False

    @staticmethod
    def contains_all(text, *substrings):
        """Verificar que el texto contiene todas las subcadenas."""
        return all(sub in text for sub in substrings)

    @staticmethod
    def is_sorted(items, reverse=False):
        """Verificar que una lista está ordenada."""
        if reverse:
            return items == sorted(items, reverse=True)
        return items == sorted(items)

    @staticmethod
    def numbers_from_text(text):
        """Extraer todos los números de un texto."""
        return [float(n) for n in re.findall(r'[\\d,]+\\.?\\d*', text.replace(',', ''))]

    @staticmethod
    def compare_tables(expected, actual):
        """Comparar dos tablas (listas de listas) y reportar diferencias."""
        differences = []
        for i, (exp_row, act_row) in enumerate(zip(expected, actual)):
            for j, (exp_cell, act_cell) in enumerate(zip(exp_row, act_row)):
                if exp_cell.strip() != act_cell.strip():
                    differences.append({
                        "row": i, "col": j,
                        "expected": exp_cell,
                        "actual": act_cell
                    })
        return differences</code></pre>

        <h3>🔗 Integrando helpers con conftest.py</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python"># conftest.py — usando helpers como fixtures
import pytest
from utils.test_data import TestData
from utils.auth_helper import AuthHelper
from utils.evidence_helper import EvidenceHelper

@pytest.fixture
def test_data():
    """Fixture que provee el generador de datos."""
    return TestData()

@pytest.fixture
def authenticated_page(browser):
    """Fixture que provee una página ya autenticada."""
    context = AuthHelper.load_auth_state(browser, "admin")
    page = context.new_page()
    yield page
    context.close()

@pytest.fixture(autouse=True)
def auto_screenshot(page, request):
    """Capturar screenshot automáticamente si el test falla."""
    yield
    if hasattr(request.node, "rep_call") and request.node.rep_call.failed:
        EvidenceHelper.capture(page, request.node.name, "FAILED")

# ── Uso en tests ──
def test_crear_usuario(authenticated_page, test_data):
    page = authenticated_page
    user = test_data.user_data({"rol": "admin"})

    page.goto("https://mi-app.com/users/new")
    page.fill("[name='nombre']", user["nombre"])
    page.fill("[name='email']", user["email"])
    # ... etc
    assert page.text_content(".success") == "Usuario creado"</code></pre>
        </div>

        <h3>📁 Estructura completa del proyecto</h3>
        <pre><code class="text">mi-proyecto/
├── components/          # Fragmentos UI reutilizables
├── pages/               # Page Objects
├── utils/               # ← Helpers aquí
│   ├── __init__.py
│   ├── test_data.py     # Generador de datos
│   ├── auth_helper.py   # Autenticación/sesiones
│   ├── wait_helper.py   # Esperas y reintentos
│   ├── evidence_helper.py  # Screenshots/evidencias
│   └── validation_helper.py # Validaciones
├── tests/
│   ├── conftest.py      # Integra helpers como fixtures
│   └── ...
└── pytest.ini</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip SIESA:</strong> En SIESA, el helper de evidencias es especialmente
            importante. Cada ejecución de prueba genera screenshots que se adjuntan al
            reporte para auditoría. El <code>EvidenceHelper</code> garantiza una estructura
            consistente de archivos.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Crea un helper <code>ApiHelper</code> que:</p>
            <ul>
                <li>Haga llamadas directas a la API REST (sin UI) para preparar datos de test</li>
                <li>Tenga métodos: <code>create_user(data)</code>, <code>delete_user(id)</code>,
                <code>create_product(data)</code></li>
                <li>Use <code>page.request</code> de Playwright (API testing integrado)</li>
                <li>Intégralo como fixture en conftest.py</li>
            </ul>
        </div>
    `,
    topics: ["helpers", "utilidades", "testing"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_056 = LESSON_056;
}
