/**
 * Playwright Academy - Lección 073
 * Autenticación: tokens, OAuth, cookies
 * Sección 10: API Testing con Playwright
 */

const LESSON_073 = {
    id: 73,
    title: "Autenticación: tokens, OAuth, cookies",
    duration: "7 min",
    level: "intermediate",
    section: "section-10",
    content: `
        <h2>🔐 Autenticación: tokens, OAuth, cookies</h2>
        <p>La autenticación es fundamental en API testing. En esta lección cubrimos las
        estrategias más comunes: <strong>API Keys</strong>, <strong>Bearer Tokens (JWT)</strong>,
        <strong>OAuth 2.0</strong>, <strong>Cookies de sesión</strong> y cómo reutilizar
        sesiones entre tests para máxima eficiencia.</p>

        <h3>🔑 Estrategia 1: API Key</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python"># La forma más simple: API Key en headers
from playwright.sync_api import Playwright
import pytest

@pytest.fixture(scope="session")
def api_with_key(playwright: Playwright):
    """Context con API Key."""
    ctx = playwright.request.new_context(
        base_url="https://api.ejemplo.com",
        extra_http_headers={
            "X-API-Key": "mi-api-key-secreta-123",
            "Accept": "application/json",
        }
    )
    yield ctx
    ctx.dispose()

# También puede ir como query parameter
def test_con_api_key_en_url(api):
    response = api.get("/data", params={"api_key": "mi-key-123"})
    assert response.ok</code></pre>
        </div>

        <h3>🎫 Estrategia 2: Bearer Token (JWT)</h3>
        <pre><code class="python"># Obtener token via login y usarlo en requests subsecuentes

@pytest.fixture(scope="session")
def auth_token(playwright: Playwright):
    """Obtener JWT token via endpoint de login."""
    ctx = playwright.request.new_context(
        base_url="https://api.mi-app.com"
    )

    # Login para obtener el token
    response = ctx.post("/auth/login", data={
        "email": "admin@test.com",
        "password": "admin123"
    })
    assert response.status == 200

    token = response.json()["access_token"]
    ctx.dispose()
    return token

@pytest.fixture(scope="session")
def api(playwright: Playwright, auth_token):
    """API context con Bearer token."""
    ctx = playwright.request.new_context(
        base_url="https://api.mi-app.com",
        extra_http_headers={
            "Authorization": f"Bearer {auth_token}",
            "Accept": "application/json",
        }
    )
    yield ctx
    ctx.dispose()

# ── Test con refresh token ──
def test_refresh_token(api, playwright):
    """Verificar que el refresh token funciona."""
    # Simular token expirado
    ctx = playwright.request.new_context(
        base_url="https://api.mi-app.com",
        extra_http_headers={
            "Authorization": "Bearer token-expirado",
        }
    )

    # Request con token expirado → 401
    response = ctx.get("/api/profile")
    assert response.status == 401

    # Refresh
    refresh = ctx.post("/auth/refresh", data={
        "refresh_token": "mi-refresh-token"
    })
    assert refresh.ok
    new_token = refresh.json()["access_token"]

    ctx.dispose()

    # Nuevo context con token fresco
    new_ctx = playwright.request.new_context(
        base_url="https://api.mi-app.com",
        extra_http_headers={
            "Authorization": f"Bearer {new_token}",
        }
    )
    response = new_ctx.get("/api/profile")
    assert response.ok
    new_ctx.dispose()</code></pre>

        <h3>🍪 Estrategia 3: Cookies de sesión</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python"># Login por UI y reutilizar cookies para API calls

@pytest.fixture(scope="session")
def auth_state(browser):
    """Login por UI, guardar cookies para reusar."""
    context = browser.new_context()
    page = context.new_page()

    # Login real por la UI
    page.goto("https://mi-app.com/login")
    page.fill("#email", "admin@test.com")
    page.fill("#password", "admin123")
    page.click("#login-btn")
    page.wait_for_url("**/dashboard")

    # Guardar estado (cookies + localStorage)
    state = context.storage_state()
    context.close()
    return state

@pytest.fixture
def api_with_cookies(browser, auth_state):
    """API context que hereda las cookies del login por UI."""
    context = browser.new_context(storage_state=auth_state)
    page = context.new_page()
    # context.request hereda las cookies automáticamente
    yield context.request
    context.close()

# ── Uso en test ──
def test_api_con_sesion_de_ui(api_with_cookies):
    """Las cookies del login por UI funcionan en API calls."""
    response = api_with_cookies.get(
        "https://mi-app.com/api/profile"
    )
    assert response.ok
    assert response.json()["email"] == "admin@test.com"</code></pre>
        </div>

        <h3>🔄 Estrategia 4: OAuth 2.0 (Client Credentials)</h3>
        <pre><code class="python"># OAuth 2.0 Client Credentials flow (para APIs server-to-server)

@pytest.fixture(scope="session")
def oauth_token(playwright: Playwright):
    """Obtener token via OAuth 2.0 Client Credentials."""
    ctx = playwright.request.new_context()

    response = ctx.post("https://auth.mi-app.com/oauth/token", form={
        "grant_type": "client_credentials",
        "client_id": "mi-client-id",
        "client_secret": "mi-client-secret",
        "scope": "read write"
    })

    assert response.status == 200
    token_data = response.json()
    ctx.dispose()

    return token_data["access_token"]

@pytest.fixture(scope="session")
def api_oauth(playwright: Playwright, oauth_token):
    """API context con OAuth token."""
    ctx = playwright.request.new_context(
        base_url="https://api.mi-app.com",
        extra_http_headers={
            "Authorization": f"Bearer {oauth_token}",
        }
    )
    yield ctx
    ctx.dispose()</code></pre>

        <h3>👥 Múltiples roles de usuario</h3>
        <pre><code class="python"># Fixture parametrizada para testear con diferentes roles

CREDENTIALS = {
    "admin": {"email": "admin@test.com", "password": "admin123"},
    "editor": {"email": "editor@test.com", "password": "editor123"},
    "viewer": {"email": "viewer@test.com", "password": "viewer123"},
}

@pytest.fixture(params=["admin", "editor", "viewer"])
def api_for_role(request, playwright: Playwright):
    """API context para cada rol."""
    role = request.param
    creds = CREDENTIALS[role]

    # Obtener token para este rol
    ctx = playwright.request.new_context(
        base_url="https://api.mi-app.com"
    )
    login = ctx.post("/auth/login", data=creds)
    token = login.json()["access_token"]
    ctx.dispose()

    # Crear context autenticado
    api = playwright.request.new_context(
        base_url="https://api.mi-app.com",
        extra_http_headers={
            "Authorization": f"Bearer {token}",
        }
    )
    yield api, role
    api.dispose()

# Este test se ejecuta 3 veces (admin, editor, viewer)
def test_acceso_por_rol(api_for_role):
    api, role = api_for_role
    response = api.get("/api/admin/settings")

    if role == "admin":
        assert response.ok
    else:
        assert response.status == 403

def test_todos_pueden_leer(api_for_role):
    api, role = api_for_role
    response = api.get("/api/tasks")
    assert response.ok  # Todos los roles pueden leer</code></pre>

        <h3>🔒 Tests de seguridad de autenticación</h3>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python">def test_endpoint_sin_auth_retorna_401(playwright):
    """Endpoints protegidos rechazan requests sin auth."""
    ctx = playwright.request.new_context(
        base_url="https://api.mi-app.com"
    )
    endpoints = ["/api/tasks", "/api/users", "/api/profile"]
    for endpoint in endpoints:
        response = ctx.get(endpoint)
        assert response.status == 401, (
            f"{endpoint} debería requerir auth"
        )
    ctx.dispose()

def test_token_expirado_retorna_401(playwright):
    """Token JWT expirado es rechazado."""
    ctx = playwright.request.new_context(
        base_url="https://api.mi-app.com",
        extra_http_headers={
            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjEwMDAwMDAwMDB9.fake"
        }
    )
    response = ctx.get("/api/tasks")
    assert response.status == 401
    ctx.dispose()

def test_sql_injection_en_login(playwright):
    """Verificar que el login no es vulnerable a SQL injection."""
    ctx = playwright.request.new_context(
        base_url="https://api.mi-app.com"
    )
    response = ctx.post("/auth/login", data={
        "email": "' OR 1=1 --",
        "password": "anything"
    })
    assert response.status in [401, 422]  # Rechazado
    ctx.dispose()</code></pre>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip SIESA:</strong> Nunca guardes credenciales reales en el código.
            Usa variables de entorno: <code>os.environ["API_TOKEN"]</code>. En CI/CD,
            configura los secrets como variables del pipeline.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Implementa un sistema de autenticación para tests:</p>
            <ol>
                <li>Fixture <code>auth_token</code> que haga login y obtenga JWT</li>
                <li>Fixture <code>api</code> que use el token en todas las requests</li>
                <li>Test que verifique acceso con token válido</li>
                <li>Test que verifique rechazo sin token</li>
                <li>Test que verifique diferentes permisos por rol</li>
            </ol>
        </div>
    `,
    topics: ["autenticación", "tokens", "oauth", "cookies"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_073 = LESSON_073;
}
