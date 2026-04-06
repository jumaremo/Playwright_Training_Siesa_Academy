/**
 * Playwright Academy - Leccion 124
 * Principios de tests mantenibles
 * Seccion 19: Best Practices y Patrones
 */

const LESSON_124 = {
    id: 124,
    title: "Principios de tests mantenibles",
    duration: "10 min",
    level: "advanced",
    section: "section-19",
    content: `
        <h2>Principios de tests mantenibles</h2>
        <p>Una suite de tests automatizados solo tiene valor si el equipo <strong>confia en ella y puede
        mantenerla</strong>. Tests fragiles, acoplados o dificiles de entender terminan siendo ignorados
        o eliminados. En esta leccion exploraras los principios fundamentales para escribir tests que
        sobrevivan al paso del tiempo, los cambios de UI y la rotacion del equipo.</p>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>En SIESA mantenemos una suite de +1200 tests E2E que ha evolucionado durante 3 años.
            La clave ha sido aplicar estos principios desde el inicio: tests independientes, selectores
            estables, y la regla de que cualquier QA nuevo debe poder entender un test sin contexto
            previo. Esto nos ha permitido mantener la suite con solo 5 ingenieros de QA.</p>
        </div>

        <h3>Los 7 principios de tests mantenibles</h3>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">#</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Principio</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripcion</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">1</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Independencia</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Cada test puede ejecutarse solo, sin depender de otros</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">2</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Legibilidad</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Cualquiera entiende que hace el test sin leer el codigo fuente</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">3</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Determinismo</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Siempre produce el mismo resultado con las mismas condiciones</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">4</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Resiliencia</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Cambios cosmeticos en la UI no rompen el test</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">5</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Velocidad</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Cada test es lo mas rapido posible sin sacrificar confiabilidad</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">6</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Foco unico</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Un test valida una sola cosa — si falla, sabes exactamente que fallo</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">7</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>DRY selectivo</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Reutilizar logica de negocio, pero no a costa de la claridad</td>
                </tr>
            </table>
        </div>

        <h3>1. Independencia: tests sin dependencias</h3>

        <pre><code class="python"># MAL: Test que depende de que otro test corra antes
class TestOrdered:
    created_user_id = None

    def test_create_user(self, page):
        # Crea un usuario y guarda el ID
        page.goto("/users/new")
        page.fill("#name", "Juan")
        page.click("#save")
        TestOrdered.created_user_id = page.locator("#user-id").text_content()

    def test_edit_user(self, page):
        # DEPENDE de test_create_user — si falla el primero, este tambien
        page.goto(f"/users/{TestOrdered.created_user_id}/edit")
        page.fill("#name", "Juan Editado")
        page.click("#save")

# BIEN: Cada test gestiona su propio estado
def test_create_user(page, api_context):
    page.goto("/users/new")
    page.fill("#name", "Juan")
    page.click("#save")
    from playwright.sync_api import expect
    expect(page.locator(".success")).to_be_visible()

def test_edit_user(page, api_context):
    # Crear usuario via API (rapido, confiable)
    resp = api_context.post("/api/users", data={"name": "Juan"})
    user_id = resp.json()["id"]

    page.goto(f"/users/{user_id}/edit")
    page.fill("#name", "Juan Editado")
    page.click("#save")
    from playwright.sync_api import expect
    expect(page.locator(".success")).to_be_visible()</code></pre>

        <h3>2. Legibilidad: tests autodocumentados</h3>

        <pre><code class="python"># MAL: Nombre generico, acciones sin contexto
def test_1(page):
    page.goto("/p")
    page.fill("#e", "a@b.com")
    page.fill("#p", "x")
    page.click("#b")
    assert page.url.endswith("/d")

# BIEN: Nombre descriptivo, patron AAA, selectores claros
def test_login_with_valid_credentials_redirects_to_dashboard(page):
    """Verifica que un usuario con credenciales validas es redirigido al dashboard."""

    # ARRANGE
    page.goto("/auth/login")

    # ACT
    page.fill("[data-testid='email-input']", "admin@siesa.com")
    page.fill("[data-testid='password-input']", "Admin1234!")
    page.click("[data-testid='login-button']")

    # ASSERT
    from playwright.sync_api import expect
    expect(page).to_have_url("**/dashboard")</code></pre>

        <h3>3. Determinismo: sin aleatoriedad</h3>

        <pre><code class="python"># MAL: Resultado depende del estado de la base de datos
def test_product_count(page):
    page.goto("/products")
    count = page.locator(".product-card").count()
    assert count == 15  # Falla si alguien agrego/elimino productos

# BIEN: Controlar el estado o usar assertions flexibles
def test_products_page_shows_results(page, seed_products):
    """seed_products crea exactamente 10 productos para este test."""
    page.goto("/products")
    from playwright.sync_api import expect
    expect(page.locator(".product-card")).to_have_count(10)

# O assertion flexible cuando no controlas los datos:
def test_products_page_has_content(page):
    page.goto("/products")
    from playwright.sync_api import expect
    count = page.locator(".product-card").count()
    assert count > 0, "La pagina de productos no muestra ningun resultado"</code></pre>

        <h3>4. Resiliencia: selectores estables</h3>

        <pre><code class="python"># JERARQUIA DE SELECTORES (de mejor a peor):

# 1. data-testid (MEJOR - diseñado para testing)
page.locator("[data-testid='submit-button']")
page.get_by_test_id("submit-button")

# 2. Role + name (semantico, accesible)
page.get_by_role("button", name="Guardar")
page.get_by_role("heading", name="Dashboard")

# 3. Text content (legible pero fragil ante i18n)
page.get_by_text("Iniciar Sesion")

# 4. Placeholder / label (para inputs)
page.get_by_placeholder("Correo electronico")
page.get_by_label("Contraseña")

# 5. CSS selector estable (cuando no hay opciones mejores)
page.locator("form.login-form input[type='email']")

# EVITAR:
page.locator("#app > div:nth-child(3) > form > button")  # Fragil
page.locator(".btn.btn-primary.mt-3")  # Clases CSS cambian
page.locator("xpath=//div[2]/form/button[1]")  # Posicion dependiente</code></pre>

        <h3>5. Velocidad: optimizar sin sacrificar confiabilidad</h3>

        <pre><code class="python"># TECNICAS DE OPTIMIZACION:

# 1. Login via API en lugar de UI (ahorra 2-3 segundos por test)
@pytest.fixture
def authenticated_page(browser, api_context):
    """Login via API, inyectar token, usar pagina autenticada."""
    token = api_context.post("/api/auth/login", data={
        "email": "admin@siesa.com", "password": "Admin1234!"
    }).json()["token"]

    context = browser.new_context(storage_state={
        "cookies": [],
        "origins": [{"origin": "http://localhost:3000",
                     "localStorage": [{"name": "token", "value": token}]}]
    })
    page = context.new_page()
    yield page
    context.close()

# 2. Reutilizar estado de sesion entre tests del mismo modulo
@pytest.fixture(scope="module")
def auth_state(playwright):
    """Crear estado de auth una vez por modulo."""
    # ... crear y guardar storage state
    pass

# 3. Evitar wait_for_load_state("networkidle") cuando no es necesario
# Preferir esperar por el elemento especifico que necesitas
from playwright.sync_api import expect
expect(page.locator("[data-testid='content']")).to_be_visible()  # Mejor</code></pre>

        <h3>6. Foco unico: un test, una validacion</h3>

        <pre><code class="python"># MAL: Un test que valida demasiadas cosas
def test_user_management(page):
    # Crear usuario
    page.goto("/users/new")
    page.fill("#name", "Juan")
    page.click("#save")
    assert "created" in page.url

    # Editar usuario
    page.click("#edit")
    page.fill("#name", "Juan Editado")
    page.click("#save")
    assert "updated" in page.url

    # Eliminar usuario
    page.click("#delete")
    page.click("#confirm")
    assert "deleted" in page.url

# BIEN: Tests separados con foco unico
def test_create_user_shows_success(page):
    page.goto("/users/new")
    page.fill("[data-testid='name']", "Juan")
    page.click("[data-testid='save-btn']")
    from playwright.sync_api import expect
    expect(page.locator(".toast-success")).to_be_visible()

def test_edit_user_updates_name(page, create_user):
    user_id = create_user(name="Juan")
    page.goto(f"/users/{user_id}/edit")
    page.fill("[data-testid='name']", "Juan Editado")
    page.click("[data-testid='save-btn']")
    from playwright.sync_api import expect
    expect(page.locator("[data-testid='user-name']")).to_have_text("Juan Editado")

def test_delete_user_removes_from_list(page, create_user):
    user_id = create_user(name="Para Eliminar")
    page.goto(f"/users/{user_id}")
    page.click("[data-testid='delete-btn']")
    page.click("[data-testid='confirm-delete']")
    from playwright.sync_api import expect
    expect(page).to_have_url("**/users")
    expect(page.locator(f"[data-user-id='{user_id}']")).to_have_count(0)</code></pre>

        <h3>7. DRY selectivo: reutilizar con criterio</h3>

        <pre><code class="python"># BIEN reutilizar: logica de negocio en Page Objects
class ProductsPage(BasePage):
    def search(self, query: str):
        self.fill("[data-testid='search']", query)
        self.click("[data-testid='search-btn']")
        self.page.wait_for_load_state("networkidle")

# BIEN reutilizar: setup complejo en fixtures
@pytest.fixture
def product_with_reviews(api_context):
    product = api_context.post("/api/products", data={...}).json()
    for i in range(3):
        api_context.post(f"/api/products/{product['id']}/reviews", data={...})
    return product

# EVITAR reutilizar: assertions (pierden claridad)
# MAL:
def assert_success_toast(page):
    expect(page.locator(".toast")).to_be_visible()

# BIEN: Assertion directa en el test (mas claro)
expect(page.locator(".toast-success")).to_have_text("Producto creado")</code></pre>

        <div style="background: #fce4ec; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Señales de alerta: tests que necesitan refactor</h4>
            <ul>
                <li>Un test tarda mas de 30 segundos</li>
                <li>Necesitas leer el codigo fuente de la app para entender el test</li>
                <li>Cambiar un selector rompe mas de 3 tests</li>
                <li>Tests que solo pasan si se ejecutan en cierto orden</li>
                <li>Tests con mas de 20 lineas de setup</li>
                <li>Tests que fallan aleatoriamente sin cambios en el codigo</li>
            </ul>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Ejercicio Practico</h4>
            <p>Audita y refactoriza tests existentes aplicando los 7 principios:</p>
            <ol>
                <li>Identifica 3 tests que violen el principio de independencia y corrígelos</li>
                <li>Reescribe 2 tests con nombres descriptivos y patron AAA</li>
                <li>Reemplaza selectores fragiles (nth-child, clases CSS) por data-testid o roles</li>
                <li>Separa un test "mega" en 3 tests con foco unico</li>
                <li>Optimiza el setup de 2 tests usando login via API en lugar de UI</li>
            </ol>
        </div>

        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>En la siguiente leccion</strong> exploraras las
            <strong>naming conventions y organizacion</strong> de archivos y tests,
            estableciendo estandares que facilitan el trabajo en equipo.</p>
        </div>
    `,
    topics: ["principios", "mantenibilidad", "tests"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 10,
    difficulty: "medium",
    type: "foundation"
};

if (typeof window !== 'undefined') {
    window.LESSON_124 = LESSON_124;
}
