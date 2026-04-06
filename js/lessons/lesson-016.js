/**
 * Playwright Academy - Lección 016
 * Setup y Teardown con pytest
 * Sección 2: Fundamentos de Playwright
 */

const LESSON_016 = {
    id: 16,
    title: "Setup y Teardown con pytest",
    duration: "5 min",
    level: "beginner",
    section: "section-02",
    content: `
        <h2>🔧 Setup y Teardown con pytest</h2>
        <p>Setup y teardown permiten preparar el entorno antes de cada test y
        limpiar después. En pytest esto se logra con <strong>fixtures</strong>,
        un mecanismo elegante y flexible.</p>

        <h3>📋 Concepto: Setup y Teardown</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Fase</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Cuándo</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Setup</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Antes del test</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Navegar a URL, hacer login</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Test</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">El test en sí</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Acciones y assertions</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Teardown</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Después del test</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Cerrar sesión, limpiar datos</td>
                </tr>
            </table>
        </div>

        <h3>🏗️ Fixtures con yield (setup + teardown)</h3>
        <pre><code class="python"># conftest.py
import pytest
from playwright.sync_api import Page

@pytest.fixture
def pagina_login(page: Page):
    """Setup: navegar al login. Teardown: cerrar sesión."""
    # --- SETUP ---
    page.goto("https://mi-app.com/login")
    page.fill("#usuario", "admin")
    page.fill("#password", "secreto")
    page.click("#btn-login")
    page.wait_for_url("**/dashboard")

    yield page  # <-- Aquí se ejecuta el test

    # --- TEARDOWN ---
    page.click("#btn-logout")
    print("Sesión cerrada correctamente")</code></pre>
        <pre><code class="python"># test_dashboard.py
def test_ver_perfil(pagina_login):
    """Usa la fixture: ya está logueado al entrar."""
    pagina_login.click("#link-perfil")
    expect(pagina_login.locator("h1")).to_have_text("Mi Perfil")

def test_ver_reportes(pagina_login):
    """Cada test recibe una sesión fresca."""
    pagina_login.click("#link-reportes")
    expect(pagina_login.locator("h1")).to_have_text("Reportes")</code></pre>

        <h3>📦 Scopes de fixtures</h3>
        <pre><code class="python"># Scope determina cuándo se ejecuta setup/teardown

@pytest.fixture(scope="function")  # Default: por cada test
def datos_test():
    data = crear_datos()
    yield data
    borrar_datos(data)

@pytest.fixture(scope="class")  # Una vez por clase de tests
def sesion_clase():
    sesion = iniciar_sesion()
    yield sesion
    cerrar_sesion(sesion)

@pytest.fixture(scope="module")  # Una vez por archivo .py
def conexion_db():
    conn = conectar_bd()
    yield conn
    conn.close()

@pytest.fixture(scope="session")  # Una vez por toda la ejecución
def configuracion_global():
    config = cargar_config()
    yield config</code></pre>

        <h3>🔄 autouse: fixtures automáticas</h3>
        <pre><code class="python"># conftest.py

@pytest.fixture(autouse=True)
def preparar_cada_test(page: Page):
    """Se ejecuta automáticamente antes de CADA test."""
    # Setup: limpiar cookies y storage
    page.context.clear_cookies()
    print(f"\\n--- Iniciando test ---")

    yield

    # Teardown: capturar estado final
    print(f"--- Test finalizado ---")
    print(f"URL final: {page.url}")</code></pre>

        <h3>📄 conftest.py: el archivo de fixtures</h3>
        <pre><code class="python"># conftest.py - Archivo especial de pytest
# Las fixtures aquí están disponibles para TODOS los tests en el directorio

import pytest
from playwright.sync_api import Page, expect

# Base URL para todos los tests
@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "base_url": "https://mi-app.com",
        "viewport": {"width": 1920, "height": 1080},
    }

# Fixture de login reutilizable
@pytest.fixture
def usuario_logueado(page: Page):
    page.goto("/login")
    page.fill("#email", "test@ejemplo.com")
    page.fill("#password", "clave123")
    page.click("#btn-login")
    expect(page).to_have_url("**/dashboard")
    yield page

# Fixture para crear datos de prueba
@pytest.fixture
def producto_test(page: Page):
    # Crear producto via API o UI
    page.goto("/admin/productos/nuevo")
    page.fill("#nombre", "Producto Test")
    page.fill("#precio", "99.99")
    page.click("#btn-guardar")
    producto_id = page.locator("#producto-id").text_content()

    yield {"id": producto_id, "nombre": "Producto Test"}

    # Teardown: eliminar producto
    page.goto(f"/admin/productos/{producto_id}/eliminar")
    page.click("#confirmar")</code></pre>

        <h3>🗂️ Jerarquía de conftest.py</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code>tests/
├── conftest.py              # Fixtures para TODOS los tests
├── test_home.py
├── auth/
│   ├── conftest.py          # Fixtures solo para auth/
│   ├── test_login.py
│   └── test_registro.py
└── admin/
    ├── conftest.py          # Fixtures solo para admin/
    └── test_dashboard.py</code></pre>
            <p>Cada subdirectorio puede tener su propio <code>conftest.py</code>.
            Las fixtures se heredan de arriba hacia abajo.</p>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <ol>
            <li>Crea un <code>conftest.py</code> con:
                <ul>
                    <li>Una fixture que navegue a <code>https://example.com</code></li>
                    <li>Una fixture con <code>autouse=True</code> que imprima inicio/fin de cada test</li>
                </ul>
            </li>
            <li>Crea dos tests que usen la fixture de navegación</li>
            <li>Verifica que el setup y teardown se ejecutan en el orden correcto</li>
            <li>Ejecuta con <code>pytest -v -s</code> para ver los prints</li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Crear fixtures con setup y teardown usando <code>yield</code></li>
                <li>Entender los scopes: function, class, module, session</li>
                <li>Usar <code>autouse=True</code> para fixtures automáticas</li>
                <li>Organizar fixtures en <code>conftest.py</code></li>
            </ul>
        </div>
    `,
    topics: ["setup", "teardown", "fixtures"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_016 = LESSON_016;
}
