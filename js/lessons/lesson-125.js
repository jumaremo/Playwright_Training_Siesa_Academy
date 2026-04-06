/**
 * Playwright Academy - Leccion 125
 * Naming conventions y organizacion
 * Seccion 19: Best Practices y Patrones
 */

const LESSON_125 = {
    id: 125,
    title: "Naming conventions y organización",
    duration: "7 min",
    level: "advanced",
    section: "section-19",
    content: `
        <h2>Naming conventions y organizacion</h2>
        <p>Un framework bien organizado se explica solo. Cuando los nombres de archivos, funciones
        y directorios siguen convenciones consistentes, cualquier miembro del equipo puede encontrar
        y entender cualquier test en segundos. En esta leccion estableceras los estandares de
        nomenclatura y organizacion que transforman una coleccion de scripts en un framework profesional.</p>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>En SIESA, el equipo de QA mantiene un documento de convenciones que todo nuevo integrante
            revisa en su primer dia. La regla principal es: "si necesitas explicar donde esta un test
            o que hace, el nombre esta mal". Esto ha reducido el tiempo de onboarding de nuevos QAs
            de 2 semanas a 3 dias.</p>
        </div>

        <h3>Convenciones de nombres para archivos</h3>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Tipo</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Convencion</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Test file</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>test_[feature].py</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">test_login.py, test_checkout.py</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Page Object</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>[page_name]_page.py</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">login_page.py, dashboard_page.py</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Componente</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>[component].py</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">navbar.py, data_table.py</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Servicio</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>[service]_service.py</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">auth_service.py, data_service.py</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Builder</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>[entity]_builder.py</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">user_builder.py, order_builder.py</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Fixture</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>[domain]_fixtures.py</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">auth_fixtures.py, data_fixtures.py</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Datos</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>[entity]s.json/csv</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">users.json, products.csv</td>
                </tr>
            </table>
        </div>

        <h3>Convenciones de nombres para funciones de test</h3>

        <pre><code class="python"># PATRON RECOMENDADO: test_[accion]_[resultado_esperado]

# Flujos positivos (happy path)
def test_login_with_valid_credentials_shows_dashboard():
def test_add_product_to_cart_increases_badge_count():
def test_submit_order_creates_confirmation():
def test_search_by_name_returns_matching_products():

# Flujos negativos (error handling)
def test_login_with_wrong_password_shows_error():
def test_register_with_existing_email_shows_duplicate_error():
def test_checkout_with_empty_cart_disables_submit():

# Validaciones
def test_email_field_rejects_invalid_format():
def test_password_requires_minimum_8_characters():
def test_price_field_accepts_only_numbers():

# Estados
def test_inactive_user_cannot_access_dashboard():
def test_expired_session_redirects_to_login():
def test_admin_role_shows_settings_menu():

# ---- ALTERNATIVA: Patron Given-When-Then ----
def test_given_valid_user_when_login_then_redirects_to_dashboard():
def test_given_empty_cart_when_checkout_then_shows_error():</code></pre>

        <h3>Convenciones para Page Objects</h3>

        <pre><code class="python"># Nombres de clase: PascalCase + 'Page'
class LoginPage(BasePage):
class DashboardPage(BasePage):
class ProductDetailPage(BasePage):

# Metodos: snake_case, verbos de accion
class LoginPage(BasePage):
    # Acciones (verbos)
    def login(self, email, password): ...
    def login_and_wait(self, email, password): ...
    def click_forgot_password(self): ...
    def check_remember_me(self): ...

    # Queries (get_*)
    def get_error_message(self) -> str: ...
    def get_welcome_text(self) -> str: ...

    # Assertions (should_*)
    def should_show_error(self, message): ...
    def should_be_on_login_page(self): ...

    # Propiedades/locators (prefijo con _)
    _email_input = "[data-testid='email-input']"
    _password_input = "[data-testid='password-input']"
    _login_button = "[data-testid='login-button']"</code></pre>

        <h3>Convenciones para fixtures</h3>

        <pre><code class="python"># Fixtures de datos: sustantivo (lo que retornan)
@pytest.fixture
def admin_user(): ...          # Retorna un User

@pytest.fixture
def sample_products(): ...     # Retorna lista de productos

@pytest.fixture
def auth_token(): ...          # Retorna string token

# Fixtures de accion: verbo (lo que hacen)
@pytest.fixture
def create_user(): ...         # Retorna callable para crear usuarios

@pytest.fixture
def seed_database(): ...       # Prepara datos, no retorna nada util

# Fixtures de pagina: nombre de la pagina
@pytest.fixture
def login_page(page): ...     # Retorna LoginPage navegada

@pytest.fixture
def authenticated_page(): ... # Retorna page con sesion activa

# Fixtures de contexto: descripcion del estado
@pytest.fixture
def logged_in_as_admin(): ... # Estado de sesion admin

# Scope en el nombre (solo si no es funcion-scope)
@pytest.fixture(scope="session")
def session_auth_state(): ...

@pytest.fixture(scope="module")
def module_test_data(): ...</code></pre>

        <h3>Organizacion de directorios</h3>

        <pre><code class="text"># OPCION A: Por feature/modulo (RECOMENDADA para apps grandes)
tests/
├── auth/
│   ├── test_login.py
│   ├── test_register.py
│   └── test_password_reset.py
├── inventory/
│   ├── test_products.py
│   ├── test_categories.py
│   └── test_search.py
├── orders/
│   ├── test_cart.py
│   ├── test_checkout.py
│   └── test_order_history.py
└── conftest.py

# OPCION B: Por tipo de test (RECOMENDADA para separar velocidad)
tests/
├── smoke/                    # < 5 min, criticos
│   ├── test_login.py
│   └── test_dashboard.py
├── regression/               # 15-30 min, completa
│   ├── auth/
│   ├── inventory/
│   └── orders/
├── api/                      # Tests de API pura
│   ├── test_auth_api.py
│   └── test_products_api.py
├── visual/                   # Regresion visual
│   └── test_screenshots.py
└── performance/              # Metricas de rendimiento
    └── test_page_load.py

# OPCION C: Hibrida (la mejor de ambos mundos)
tests/
├── smoke/                    # Tests criticos (por tipo)
├── regression/
│   ├── auth/                 # Tests de regresion (por modulo)
│   ├── inventory/
│   └── orders/
├── api/
└── performance/</code></pre>

        <h3>Markers de pytest para organizacion</h3>

        <pre><code class="python"># conftest.py / pyproject.toml - Registrar markers
def pytest_configure(config):
    config.addinivalue_line("markers", "smoke: tests criticos de sanity")
    config.addinivalue_line("markers", "regression: suite de regresion completa")
    config.addinivalue_line("markers", "api: tests de API exclusivamente")
    config.addinivalue_line("markers", "visual: tests de regresion visual")
    config.addinivalue_line("markers", "slow: tests que tardan mas de 30s")
    # Por modulo
    config.addinivalue_line("markers", "auth: tests del modulo de autenticacion")
    config.addinivalue_line("markers", "inventory: tests del modulo de inventario")
    config.addinivalue_line("markers", "orders: tests del modulo de ordenes")

# Uso en tests
import pytest

@pytest.mark.smoke
@pytest.mark.auth
def test_login_successful(page):
    """Este test es: smoke + auth. Se ejecuta con ambos filtros."""
    ...

@pytest.mark.regression
@pytest.mark.inventory
@pytest.mark.slow
def test_bulk_product_import(page):
    """Este test es: regression + inventory + slow."""
    ...

# Ejecucion selectiva:
# pytest -m smoke                    # Solo smoke
# pytest -m "auth and not slow"      # Auth rapidos
# pytest -m "regression and inventory"  # Regresion de inventario</code></pre>

        <h3>Checklist de organizacion</h3>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Item</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Criterio</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Archivo de test</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Nombre indica feature, no mas de 15 tests por archivo</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Funcion de test</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Nombre describe accion + resultado esperado</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Page Object</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Un archivo por pagina, metodos con verbos claros</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Fixture</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Nombre indica lo que retorna o lo que hace</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Directorio</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Refleja la estructura de la aplicacion o tipo de test</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Markers</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Registrados, usados consistentemente, documentados</td>
                </tr>
            </table>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Ejercicio Practico</h4>
            <p>Reorganiza un proyecto de testing siguiendo las convenciones:</p>
            <ol>
                <li>Renombra 5 archivos de test siguiendo la convencion <code>test_[feature].py</code></li>
                <li>Renombra 5 funciones de test con el patron <code>test_[accion]_[resultado]</code></li>
                <li>Organiza tests en directorios por feature (auth/, inventory/, orders/)</li>
                <li>Registra y aplica markers: smoke, regression, y al menos 2 por modulo</li>
                <li>Documenta las convenciones en un archivo <code>CONVENTIONS.md</code></li>
            </ol>
        </div>

        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>En la siguiente leccion</strong> exploraras el
            <strong>manejo de datos de prueba</strong>, aprendiendo estrategias para gestionar,
            generar y limpiar datos de test de forma eficiente.</p>
        </div>
    `,
    topics: ["naming", "convenciones", "organización"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_125 = LESSON_125;
}
