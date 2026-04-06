/**
 * Playwright Academy - Lección 006
 * Estructura de un proyecto Playwright
 * Sección 1: Configuración del Entorno
 */

const LESSON_006 = {
    id: 6,
    title: "Estructura de un proyecto Playwright",
    duration: "5 min",
    level: "beginner",
    section: "section-01",
    content: `
        <h2>📁 Estructura de un proyecto Playwright</h2>
        <p>Una buena estructura facilita el mantenimiento y escalabilidad. Veamos cómo organizar
        un proyecto Playwright profesional.</p>

        <h3>📂 Estructura recomendada</h3>
        <pre><code class="text">mi-proyecto-playwright/
├── tests/                      # Tests organizados por módulo
│   ├── __init__.py
│   ├── test_login.py
│   ├── test_dashboard.py
│   └── test_checkout.py
├── pages/                      # Page Objects (lo veremos después)
│   ├── __init__.py
│   ├── login_page.py
│   └── dashboard_page.py
├── data/                       # Datos de prueba
│   ├── users.json
│   └── products.csv
├── utils/                      # Utilidades compartidas
│   ├── __init__.py
│   └── helpers.py
├── conftest.py                 # Fixtures compartidas (pytest)
├── pytest.ini                  # Configuración de pytest
├── requirements.txt            # Dependencias
├── .gitignore                  # Archivos a ignorar
└── venv/                       # Entorno virtual (NO subir a git)</code></pre>

        <h3>📄 Archivos clave</h3>

        <h4>conftest.py — Fixtures compartidas</h4>
        <pre><code class="python"># conftest.py
import pytest
from playwright.sync_api import Page


@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    """Configuración base para todos los tests."""
    return {
        **browser_context_args,
        "viewport": {"width": 1920, "height": 1080},
        "locale": "es-CO",
        "timezone_id": "America/Bogota",
    }


@pytest.fixture
def authenticated_page(page: Page):
    """Fixture que provee una página ya autenticada."""
    page.goto("https://mi-app.com/login")
    page.get_by_label("Email").fill("test@ejemplo.com")
    page.get_by_label("Contraseña").fill("password123")
    page.get_by_role("button", name="Iniciar sesión").click()
    page.wait_for_url("**/dashboard")
    return page</code></pre>

        <h4>pytest.ini — Configuración de pytest</h4>
        <pre><code class="ini"># pytest.ini
[pytest]
testpaths = tests
addopts = -v --tb=short
markers =
    smoke: Tests de humo rápidos
    regression: Tests de regresión completa
    slow: Tests que toman más de 30 segundos</code></pre>

        <h4>.gitignore</h4>
        <pre><code class="text"># .gitignore
venv/
__pycache__/
*.pyc
.pytest_cache/
test-results/
playwright-report/
allure-results/
.env
*.log</code></pre>

        <h3>🔍 ¿Por qué esta estructura?</h3>
        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #e8f5e9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Carpeta</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Razón</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>tests/</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Separa tests del código de soporte. pytest los descubre automáticamente.</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>pages/</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Page Object Model — encapsula la interacción con cada página.</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>data/</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Datos de prueba separados del código — fácil de modificar sin tocar tests.</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>conftest.py</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Fixtures compartidas — pytest las descubre automáticamente.</td>
                </tr>
            </table>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <ol>
            <li>Crea la estructura de carpetas en tu proyecto:</li>
        </ol>
        <pre><code class="bash">mkdir -p tests pages data utils
touch tests/__init__.py pages/__init__.py utils/__init__.py
touch conftest.py pytest.ini .gitignore</code></pre>
        <ol start="2">
            <li>Copia el contenido de <code>conftest.py</code>, <code>pytest.ini</code> y <code>.gitignore</code> mostrados arriba</li>
            <li>Mueve tu archivo <code>test_demo_store.py</code> a la carpeta <code>tests/</code></li>
            <li>Ejecuta <code>pytest -v</code> desde la raíz y verifica que encuentra los tests</li>
            <li>Crea un <code>tests/test_ejemplo.py</code> con un test simple para verificar el descubrimiento</li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Conocer la estructura profesional de un proyecto Playwright</li>
                <li>Configurar conftest.py con fixtures reutilizables</li>
                <li>Crear pytest.ini con configuración base</li>
                <li>Entender el propósito de cada carpeta</li>
            </ul>
        </div>

        <div style="background: #fff3cd; padding: 10px; border-radius: 8px; margin: 10px 0;">
            <h4>💡 Tip:</h4>
            <p><code>conftest.py</code> es mágico en pytest: cualquier fixture definida ahí está disponible
            para <strong>todos los tests</strong> sin necesidad de importarla. Puedes tener un <code>conftest.py</code>
            en la raíz y otro dentro de <code>tests/</code> para fixtures específicas.</p>
        </div>

        <h3>🚀 Siguiente: Lección 007 - Configuración pytest para Playwright</h3>
        <p>Profundizaremos en conftest.py y las fixtures que pytest-playwright nos da.</p>
    `,
    topics: ["proyecto", "estructura", "organización"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_006 = LESSON_006;
}
