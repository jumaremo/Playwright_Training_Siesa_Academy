/**
 * Playwright Academy - Lección 090
 * Storage state: reutilizar sesiones
 * Sección 13: Browser Contexts e Isolation
 */

const LESSON_090 = {
    id: 90,
    title: "Storage state: reutilizar sesiones",
    duration: "7 min",
    level: "intermediate",
    section: "section-13",
    content: `
        <h2>💾 Storage state: reutilizar sesiones</h2>
        <p>El <strong>storage state</strong> de Playwright permite guardar el estado de autenticación
        (cookies + localStorage) en un archivo JSON y reutilizarlo en múltiples tests. Esto elimina
        la necesidad de hacer login en cada test, reduciendo drásticamente el tiempo de ejecución.</p>

        <h3>🔍 ¿Qué es el storage state?</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>El storage state es una <strong>snapshot</strong> del estado del navegador que incluye:</p>
            <ul>
                <li><strong>Cookies:</strong> Tokens de sesión, preferencias, CSRF tokens</li>
                <li><strong>localStorage:</strong> Datos de la aplicación almacenados en el cliente</li>
            </ul>
            <p>Se guarda como un archivo <code>.json</code> que Playwright puede leer para restaurar
            el estado del navegador sin necesidad de repetir el flujo de autenticación.</p>
            <pre><code class="python"># Estructura del archivo state.json (simplificada)
{
    "cookies": [
        {
            "name": "session_id",
            "value": "abc123...",
            "domain": ".mi-app.com",
            "path": "/",
            "expires": 1735689600,
            "httpOnly": true,
            "secure": true,
            "sameSite": "Lax"
        }
    ],
    "origins": [
        {
            "origin": "https://mi-app.com",
            "localStorage": [
                { "name": "user_token", "value": "eyJhbGciOi..." },
                { "name": "user_role", "value": "admin" }
            ]
        }
    ]
}</code></pre>
        </div>

        <h3>⚠️ El problema: login repetitivo</h3>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>❌ Sin storage state — login en cada test</h4>
            <div class="code-tabs" data-code-id="L090-1">
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
            <pre><code class="language-python"># tests/test_dashboard.py
from playwright.sync_api import sync_playwright, expect

def test_ver_dashboard(page):
    # Login repetido en CADA test — lento y frágil
    page.goto("https://mi-app.com/login")
    page.fill("#email", "admin@siesa.com")
    page.fill("#password", "Admin123!")
    page.click("button[type='submit']")
    page.wait_for_url("**/dashboard")

    expect(page.locator("h1")).to_contain_text("Dashboard")

def test_ver_reportes(page):
    # OTRA VEZ el mismo login...
    page.goto("https://mi-app.com/login")
    page.fill("#email", "admin@siesa.com")
    page.fill("#password", "Admin123!")
    page.click("button[type='submit']")
    page.wait_for_url("**/dashboard")

    page.click("text=Reportes")
    expect(page.locator("h1")).to_contain_text("Reportes")

# 50 tests × 3 segundos de login = 150 segundos desperdiciados</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// tests/test_dashboard.spec.ts
import { test, expect } from '@playwright/test';

test('ver dashboard', async ({ page }) => {
    // Login repetido en CADA test — lento y frágil
    await page.goto('https://mi-app.com/login');
    await page.fill('#email', 'admin@siesa.com');
    await page.fill('#password', 'Admin123!');
    await page.click("button[type='submit']");
    await page.waitForURL('**/dashboard');

    await expect(page.locator('h1')).toContainText('Dashboard');
});

test('ver reportes', async ({ page }) => {
    // OTRA VEZ el mismo login...
    await page.goto('https://mi-app.com/login');
    await page.fill('#email', 'admin@siesa.com');
    await page.fill('#password', 'Admin123!');
    await page.click("button[type='submit']");
    await page.waitForURL('**/dashboard');

    await page.click('text=Reportes');
    await expect(page.locator('h1')).toContainText('Reportes');
});

// 50 tests × 3 segundos de login = 150 segundos desperdiciados</code></pre>
            </div>
            </div>
            <p><strong>Problemas:</strong></p>
            <ul>
                <li>Tiempo desperdiciado: cada login toma 2-5 segundos</li>
                <li>Duplicación de código en todos los tests</li>
                <li>Si cambia el flujo de login, hay que actualizar N tests</li>
                <li>Mayor carga al servidor de autenticación</li>
            </ul>
        </div>

        <h3>✅ La solución: guardar y reutilizar el estado</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Paso 1: Guardar el storage state</h4>
            <div class="code-tabs" data-code-id="L090-2">
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
            <pre><code class="language-python"># scripts/save_auth_state.py
from playwright.sync_api import sync_playwright

def save_auth_state():
    """Hacer login una vez y guardar el estado."""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context()
        page = context.new_page()

        # Hacer login normalmente
        page.goto("https://mi-app.com/login")
        page.fill("#email", "admin@siesa.com")
        page.fill("#password", "Admin123!")
        page.click("button[type='submit']")
        page.wait_for_url("**/dashboard")

        # 💾 GUARDAR el estado de autenticación
        context.storage_state(path="auth/admin_state.json")
        print("✅ Estado de autenticación guardado")

        browser.close()

if __name__ == "__main__":
    save_auth_state()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// scripts/saveAuthState.ts
import { chromium } from 'playwright';

async function saveAuthState(): Promise&lt;void&gt; {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Hacer login normalmente
    await page.goto('https://mi-app.com/login');
    await page.fill('#email', 'admin@siesa.com');
    await page.fill('#password', 'Admin123!');
    await page.click("button[type='submit']");
    await page.waitForURL('**/dashboard');

    // GUARDAR el estado de autenticación
    await context.storageState({ path: 'auth/admin_state.json' });
    console.log('Estado de autenticación guardado');

    await browser.close();
}

saveAuthState();</code></pre>
            </div>
            </div>

            <h4>Paso 2: Reutilizar el estado en tests</h4>
            <div class="code-tabs" data-code-id="L090-3">
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
            <pre><code class="language-python"># tests/test_dashboard.py
from playwright.sync_api import sync_playwright, expect

def test_ver_dashboard():
    with sync_playwright() as p:
        browser = p.chromium.launch()

        # 🔑 Crear contexto CON el estado guardado
        context = browser.new_context(
            storage_state="auth/admin_state.json"
        )
        page = context.new_page()

        # ¡Ya estamos autenticados! Ir directo al dashboard
        page.goto("https://mi-app.com/dashboard")
        expect(page.locator("h1")).to_contain_text("Dashboard")

        browser.close()

# 50 tests × 0 segundos de login = ¡0 segundos desperdiciados!</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// tests/test_dashboard.spec.ts
import { test, expect } from '@playwright/test';

// Usar storageState en la configuración del test
test.use({ storageState: 'auth/admin_state.json' });

test('ver dashboard', async ({ page }) => {
    // ¡Ya estamos autenticados! Ir directo al dashboard
    await page.goto('https://mi-app.com/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
});

// 50 tests × 0 segundos de login = ¡0 segundos desperdiciados!</code></pre>
            </div>
            </div>
        </div>

        <h3>🏗️ Patrón con conftest.py: autenticación global</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>La forma profesional es centralizar la autenticación en <code>conftest.py</code> (Python)
            o <code>playwright.config.ts</code> + <code>auth.setup.ts</code> (TypeScript):</p>
            <div class="code-tabs" data-code-id="L090-4">
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
import os
from playwright.sync_api import sync_playwright

AUTH_STATE_DIR = "auth"
ADMIN_STATE = os.path.join(AUTH_STATE_DIR, "admin_state.json")


@pytest.fixture(scope="session")
def browser_instance():
    """Browser compartido para toda la sesión de tests."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        yield browser
        browser.close()


@pytest.fixture(scope="session", autouse=True)
def authenticate(browser_instance):
    """Autenticar UNA VEZ al inicio de toda la sesión."""
    os.makedirs(AUTH_STATE_DIR, exist_ok=True)

    context = browser_instance.new_context()
    page = context.new_page()

    # Hacer login
    page.goto("https://mi-app.com/login")
    page.fill("#email", "admin@siesa.com")
    page.fill("#password", "Admin123!")
    page.click("button[type='submit']")
    page.wait_for_url("**/dashboard")

    # Guardar estado
    context.storage_state(path=ADMIN_STATE)
    context.close()

    yield ADMIN_STATE

    # Cleanup al final (opcional)
    if os.path.exists(ADMIN_STATE):
        os.remove(ADMIN_STATE)


@pytest.fixture
def authenticated_page(browser_instance, authenticate):
    """Página autenticada lista para usar en cada test."""
    context = browser_instance.new_context(
        storage_state=authenticate  # Reutilizar el estado guardado
    )
    page = context.new_page()

    yield page

    context.close()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// auth.setup.ts — Proyecto de setup de autenticación
import { test as setup, expect } from '@playwright/test';
import path from 'path';

const AUTH_STATE_DIR = 'auth';
const ADMIN_STATE = path.join(AUTH_STATE_DIR, 'admin_state.json');

// Este "test" se ejecuta UNA VEZ antes de todos los demás
setup('autenticar como admin', async ({ page }) => {
    // Hacer login
    await page.goto('https://mi-app.com/login');
    await page.fill('#email', 'admin@siesa.com');
    await page.fill('#password', 'Admin123!');
    await page.click("button[type='submit']");
    await page.waitForURL('**/dashboard');

    // Guardar estado
    await page.context().storageState({ path: ADMIN_STATE });
});

// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    projects: [
        // Proyecto de setup — se ejecuta primero
        { name: 'setup', testMatch: /.*\\.setup\\.ts/ },

        // Tests que dependen del setup
        {
            name: 'chromium',
            use: {
                storageState: 'auth/admin_state.json',
            },
            dependencies: ['setup'],
        },
    ],
});</code></pre>
            </div>
            </div>

            <div class="code-tabs" data-code-id="L090-5">
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
            <pre><code class="language-python"># tests/test_dashboard.py — ¡Limpio y sin login!
from playwright.sync_api import expect

def test_ver_dashboard(authenticated_page):
    page = authenticated_page
    page.goto("https://mi-app.com/dashboard")
    expect(page.locator("h1")).to_contain_text("Dashboard")

def test_ver_reportes(authenticated_page):
    page = authenticated_page
    page.goto("https://mi-app.com/reportes")
    expect(page.locator("h1")).to_contain_text("Reportes")

def test_ver_usuarios(authenticated_page):
    page = authenticated_page
    page.goto("https://mi-app.com/usuarios")
    expect(page.locator("h1")).to_contain_text("Usuarios")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// tests/test_dashboard.spec.ts — ¡Limpio y sin login!
import { test, expect } from '@playwright/test';

// storageState ya viene del proyecto en playwright.config.ts

test('ver dashboard', async ({ page }) => {
    await page.goto('https://mi-app.com/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
});

test('ver reportes', async ({ page }) => {
    await page.goto('https://mi-app.com/reportes');
    await expect(page.locator('h1')).toContainText('Reportes');
});

test('ver usuarios', async ({ page }) => {
    await page.goto('https://mi-app.com/usuarios');
    await expect(page.locator('h1')).toContainText('Usuarios');
});</code></pre>
            </div>
            </div>
        </div>

        <h3>👥 Múltiples roles con storage states separados</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Para aplicaciones con múltiples roles, crea un storage state por cada rol:</p>
            <div class="code-tabs" data-code-id="L090-6">
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
            <pre><code class="language-python"># conftest.py — Múltiples roles
import pytest
import os
from playwright.sync_api import sync_playwright

AUTH_DIR = "auth"
CREDENTIALS = {
    "admin": {
        "email": "admin@siesa.com",
        "password": "Admin123!",
        "state_file": os.path.join(AUTH_DIR, "admin_state.json"),
    },
    "usuario": {
        "email": "usuario@siesa.com",
        "password": "User123!",
        "state_file": os.path.join(AUTH_DIR, "user_state.json"),
    },
    "auditor": {
        "email": "auditor@siesa.com",
        "password": "Audit123!",
        "state_file": os.path.join(AUTH_DIR, "auditor_state.json"),
    },
}


@pytest.fixture(scope="session")
def browser_instance():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        yield browser
        browser.close()


@pytest.fixture(scope="session", autouse=True)
def authenticate_all_roles(browser_instance):
    """Autenticar todos los roles una vez al inicio."""
    os.makedirs(AUTH_DIR, exist_ok=True)
    states = {}

    for role, creds in CREDENTIALS.items():
        context = browser_instance.new_context()
        page = context.new_page()

        page.goto("https://mi-app.com/login")
        page.fill("#email", creds["email"])
        page.fill("#password", creds["password"])
        page.click("button[type='submit']")
        page.wait_for_url("**/dashboard")

        context.storage_state(path=creds["state_file"])
        states[role] = creds["state_file"]
        context.close()

    yield states

    # Cleanup
    for state_file in states.values():
        if os.path.exists(state_file):
            os.remove(state_file)


@pytest.fixture
def admin_page(browser_instance, authenticate_all_roles):
    """Página autenticada como administrador."""
    context = browser_instance.new_context(
        storage_state=authenticate_all_roles["admin"]
    )
    page = context.new_page()
    yield page
    context.close()


@pytest.fixture
def user_page(browser_instance, authenticate_all_roles):
    """Página autenticada como usuario estándar."""
    context = browser_instance.new_context(
        storage_state=authenticate_all_roles["usuario"]
    )
    page = context.new_page()
    yield page
    context.close()


@pytest.fixture
def auditor_page(browser_instance, authenticate_all_roles):
    """Página autenticada como auditor."""
    context = browser_instance.new_context(
        storage_state=authenticate_all_roles["auditor"]
    )
    page = context.new_page()
    yield page
    context.close()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// auth.setup.ts — Múltiples roles
import { test as setup } from '@playwright/test';
import path from 'path';

const AUTH_DIR = 'auth';

interface Credentials {
    email: string;
    password: string;
    stateFile: string;
}

const CREDENTIALS: Record&lt;string, Credentials&gt; = {
    admin: {
        email: 'admin@siesa.com',
        password: 'Admin123!',
        stateFile: path.join(AUTH_DIR, 'admin_state.json'),
    },
    usuario: {
        email: 'usuario@siesa.com',
        password: 'User123!',
        stateFile: path.join(AUTH_DIR, 'user_state.json'),
    },
    auditor: {
        email: 'auditor@siesa.com',
        password: 'Audit123!',
        stateFile: path.join(AUTH_DIR, 'auditor_state.json'),
    },
};

// Un setup test por cada rol
for (const [role, creds] of Object.entries(CREDENTIALS)) {
    setup(\`autenticar como \${role}\`, async ({ page }) => {
        await page.goto('https://mi-app.com/login');
        await page.fill('#email', creds.email);
        await page.fill('#password', creds.password);
        await page.click("button[type='submit']");
        await page.waitForURL('**/dashboard');
        await page.context().storageState({ path: creds.stateFile });
    });
}

// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    projects: [
        { name: 'setup', testMatch: /.*\\.setup\\.ts/ },
        {
            name: 'admin-tests',
            use: { storageState: 'auth/admin_state.json' },
            dependencies: ['setup'],
            testMatch: /.*admin.*\\.spec\\.ts/,
        },
        {
            name: 'user-tests',
            use: { storageState: 'auth/user_state.json' },
            dependencies: ['setup'],
            testMatch: /.*user.*\\.spec\\.ts/,
        },
        {
            name: 'auditor-tests',
            use: { storageState: 'auth/auditor_state.json' },
            dependencies: ['setup'],
            testMatch: /.*auditor.*\\.spec\\.ts/,
        },
    ],
});</code></pre>
            </div>
            </div>

            <div class="code-tabs" data-code-id="L090-7">
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
            <pre><code class="language-python"># tests/test_permisos.py — Tests por rol
from playwright.sync_api import expect

def test_admin_puede_crear_usuario(admin_page):
    admin_page.goto("https://mi-app.com/usuarios/nuevo")
    expect(admin_page.locator("h1")).to_contain_text("Crear Usuario")

def test_usuario_no_puede_crear_usuario(user_page):
    user_page.goto("https://mi-app.com/usuarios/nuevo")
    # Debería redirigir o mostrar error
    expect(user_page.locator("text=Sin permisos")).to_be_visible()

def test_auditor_ve_solo_lectura(auditor_page):
    auditor_page.goto("https://mi-app.com/reportes")
    expect(auditor_page.locator("button:has-text('Editar')")).to_have_count(0)
    expect(auditor_page.locator("button:has-text('Exportar')")).to_be_visible()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// tests/admin.permisos.spec.ts — storageState: admin
import { test, expect } from '@playwright/test';

test('admin puede crear usuario', async ({ page }) => {
    await page.goto('https://mi-app.com/usuarios/nuevo');
    await expect(page.locator('h1')).toContainText('Crear Usuario');
});

// tests/user.permisos.spec.ts — storageState: usuario
test('usuario no puede crear usuario', async ({ page }) => {
    await page.goto('https://mi-app.com/usuarios/nuevo');
    // Debería redirigir o mostrar error
    await expect(page.locator('text=Sin permisos')).toBeVisible();
});

// tests/auditor.permisos.spec.ts — storageState: auditor
test('auditor ve solo lectura', async ({ page }) => {
    await page.goto('https://mi-app.com/reportes');
    await expect(page.locator("button:has-text('Editar')")).toHaveCount(0);
    await expect(page.locator("button:has-text('Exportar')")).toBeVisible();
});</code></pre>
            </div>
            </div>
        </div>

        <h3>🔄 Fixture genérica con parámetro de rol</h3>
        <div class="code-tabs" data-code-id="L090-8">
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
        <pre><code class="language-python"># conftest.py — Fixture dinámica por rol
@pytest.fixture
def page_as(browser_instance, authenticate_all_roles):
    """Factory fixture para obtener página con cualquier rol."""
    contexts = []

    def _page_as(role: str):
        state_file = authenticate_all_roles[role]
        context = browser_instance.new_context(
            storage_state=state_file
        )
        contexts.append(context)
        return context.new_page()

    yield _page_as

    for ctx in contexts:
        ctx.close()


# Uso en tests
def test_admin_vs_usuario(page_as):
    """Comparar lo que ve admin vs usuario en la misma página."""
    admin = page_as("admin")
    usuario = page_as("usuario")

    admin.goto("https://mi-app.com/config")
    usuario.goto("https://mi-app.com/config")

    # Admin ve botón de configuración avanzada
    expect(admin.locator("text=Config Avanzada")).to_be_visible()

    # Usuario no lo ve
    expect(usuario.locator("text=Config Avanzada")).to_have_count(0)</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">// helpers/createPageAs.ts — Función helper para múltiples roles
import { Browser, Page } from 'playwright';
import path from 'path';

const STATE_FILES: Record&lt;string, string&gt; = {
    admin: path.join('auth', 'admin_state.json'),
    usuario: path.join('auth', 'user_state.json'),
    auditor: path.join('auth', 'auditor_state.json'),
};

async function createPageAs(
    browser: Browser,
    role: string
): Promise&lt;Page&gt; {
    const context = await browser.newContext({
        storageState: STATE_FILES[role],
    });
    return context.newPage();
}

// tests/admin_vs_usuario.spec.ts — Uso en tests
import { test, expect, chromium } from '@playwright/test';

test('admin vs usuario', async () => {
    const browser = await chromium.launch();

    const admin = await createPageAs(browser, 'admin');
    const usuario = await createPageAs(browser, 'usuario');

    await admin.goto('https://mi-app.com/config');
    await usuario.goto('https://mi-app.com/config');

    // Admin ve botón de configuración avanzada
    await expect(admin.locator('text=Config Avanzada')).toBeVisible();

    // Usuario no lo ve
    await expect(usuario.locator('text=Config Avanzada')).toHaveCount(0);

    await admin.context().close();
    await usuario.context().close();
    await browser.close();
});</code></pre>
        </div>
        </div>

        <h3>⏰ Expiración del storage state</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Los tokens de sesión <strong>expiran</strong>. Para manejar esto correctamente:</p>
            <div class="code-tabs" data-code-id="L090-9">
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
            <pre><code class="language-python"># conftest.py — Con validación de expiración
import os
import time
import json

# Estado válido por máximo 30 minutos
MAX_STATE_AGE_SECONDS = 30 * 60


def is_state_valid(state_file: str) -> bool:
    """Verificar si el archivo de estado existe y no ha expirado."""
    if not os.path.exists(state_file):
        return False

    file_age = time.time() - os.path.getmtime(state_file)
    if file_age > MAX_STATE_AGE_SECONDS:
        print(f"⚠️ Estado expirado ({file_age:.0f}s > {MAX_STATE_AGE_SECONDS}s)")
        return False

    # Verificar que el JSON no esté vacío/corrupto
    try:
        with open(state_file, "r") as f:
            data = json.load(f)
        return bool(data.get("cookies"))
    except (json.JSONDecodeError, IOError):
        return False


def do_login(browser, email: str, password: str, state_file: str):
    """Realizar login y guardar el estado."""
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://mi-app.com/login")
    page.fill("#email", email)
    page.fill("#password", password)
    page.click("button[type='submit']")
    page.wait_for_url("**/dashboard")
    context.storage_state(path=state_file)
    context.close()


@pytest.fixture(scope="session", autouse=True)
def authenticate(browser_instance):
    """Autenticar solo si el estado no existe o expiró."""
    os.makedirs(AUTH_DIR, exist_ok=True)
    state_file = os.path.join(AUTH_DIR, "admin_state.json")

    if not is_state_valid(state_file):
        print("🔑 Generando nuevo storage state...")
        do_login(
            browser_instance,
            "admin@siesa.com",
            "Admin123!",
            state_file,
        )
    else:
        print("✅ Reutilizando storage state existente")

    yield state_file</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// auth.setup.ts — Con validación de expiración
import { test as setup } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const AUTH_DIR = 'auth';
// Estado válido por máximo 30 minutos
const MAX_STATE_AGE_MS = 30 * 60 * 1000;

function isStateValid(stateFile: string): boolean {
    if (!fs.existsSync(stateFile)) return false;

    const stats = fs.statSync(stateFile);
    const fileAge = Date.now() - stats.mtimeMs;
    if (fileAge > MAX_STATE_AGE_MS) {
        console.log(
            \`Estado expirado (\${Math.round(fileAge / 1000)}s > \${MAX_STATE_AGE_MS / 1000}s)\`
        );
        return false;
    }

    // Verificar que el JSON no esté vacío/corrupto
    try {
        const data = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
        return Array.isArray(data.cookies) &amp;&amp; data.cookies.length > 0;
    } catch {
        return false;
    }
}

const stateFile = path.join(AUTH_DIR, 'admin_state.json');

setup('autenticar con validación de expiración', async ({ page }) => {
    if (isStateValid(stateFile)) {
        console.log('Reutilizando storage state existente');
        return; // No re-autenticar
    }

    console.log('Generando nuevo storage state...');
    fs.mkdirSync(AUTH_DIR, { recursive: true });

    await page.goto('https://mi-app.com/login');
    await page.fill('#email', 'admin@siesa.com');
    await page.fill('#password', 'Admin123!');
    await page.click("button[type='submit']");
    await page.waitForURL('**/dashboard');

    await page.context().storageState({ path: stateFile });
});</code></pre>
            </div>
            </div>
        </div>

        <h3>🔒 Seguridad: nunca commitear archivos de estado</h3>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚠️ Los archivos de storage state contienen credenciales activas</h4>
            <pre><code class="bash"># .gitignore — OBLIGATORIO
# Storage state files (contienen tokens de sesión)
auth/
*.state.json
*_state.json
storage_state*.json

# También ignorar archivos de ambiente
.env
.env.local</code></pre>

            <pre><code class="python"># Verificar en CI que no se hayan commiteado
# scripts/check_no_secrets.py
import subprocess
import sys

result = subprocess.run(
    ["git", "ls-files", "--cached"],
    capture_output=True, text=True
)

forbidden_patterns = ["state.json", ".env", "credentials"]
for line in result.stdout.strip().split("\\n"):
    for pattern in forbidden_patterns:
        if pattern in line.lower():
            print(f"❌ Archivo con secretos en git: {line}")
            sys.exit(1)

print("✅ No se encontraron archivos con secretos")</code></pre>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip SIESA:</strong> En proyectos SIESA con múltiples módulos (HCM, ERP, WMS),
            crea un storage state por cada módulo y rol. Por ejemplo:
            <code>auth/hcm_admin_state.json</code>, <code>auth/erp_contador_state.json</code>,
            <code>auth/wms_operador_state.json</code>. Esto permite ejecutar tests de cada módulo
            en paralelo sin interferencia entre sesiones. Agrega la carpeta <code>auth/</code>
            al <code>.gitignore</code> del proyecto desde el primer día.
        </div>

        <h3>🏭 Ejemplo completo: proyecto con storage state</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="text">mi-proyecto-tests/
├── auth/                       # ⚠️ En .gitignore
│   ├── admin_state.json
│   ├── user_state.json
│   └── auditor_state.json
├── tests/
│   ├── conftest.py             # Autenticación centralizada
│   ├── test_dashboard.py
│   ├── test_permisos.py
│   └── test_reportes.py
├── .gitignore                  # auth/ incluido
└── pytest.ini</code></pre>

            <div class="code-tabs" data-code-id="L090-10">
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
            <pre><code class="language-python"># conftest.py — Versión completa de producción
import pytest
import os
import time
import json
from playwright.sync_api import sync_playwright

AUTH_DIR = os.path.join(os.path.dirname(__file__), "..", "auth")
MAX_STATE_AGE = 25 * 60  # 25 minutos (margen antes de expiración real)

ROLES = {
    "admin": {"email": "admin@siesa.com", "password": "Admin123!"},
    "usuario": {"email": "user@siesa.com", "password": "User123!"},
    "auditor": {"email": "auditor@siesa.com", "password": "Audit123!"},
}


def state_path(role: str) -> str:
    return os.path.join(AUTH_DIR, f"{role}_state.json")


def needs_refresh(role: str) -> bool:
    path = state_path(role)
    if not os.path.exists(path):
        return True
    age = time.time() - os.path.getmtime(path)
    return age > MAX_STATE_AGE


def login_and_save(browser, role: str, creds: dict):
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://mi-app.com/login")
    page.fill("#email", creds["email"])
    page.fill("#password", creds["password"])
    page.click("button[type='submit']")
    page.wait_for_url("**/dashboard")
    context.storage_state(path=state_path(role))
    context.close()
    print(f"  ✅ {role} autenticado")


@pytest.fixture(scope="session")
def pw():
    with sync_playwright() as p:
        yield p


@pytest.fixture(scope="session")
def browser(pw):
    b = pw.chromium.launch(headless=True)
    yield b
    b.close()


@pytest.fixture(scope="session", autouse=True)
def setup_auth(browser):
    """Preparar storage states para todos los roles."""
    os.makedirs(AUTH_DIR, exist_ok=True)
    print("\\n🔐 Preparando autenticación...")

    for role, creds in ROLES.items():
        if needs_refresh(role):
            login_and_save(browser, role, creds)
        else:
            print(f"  ♻️ {role}: reutilizando estado existente")

    yield

    # Cleanup al final de la sesión
    for role in ROLES:
        path = state_path(role)
        if os.path.exists(path):
            os.remove(path)
    print("🧹 Storage states eliminados")


@pytest.fixture
def admin_page(browser, setup_auth):
    ctx = browser.new_context(storage_state=state_path("admin"))
    page = ctx.new_page()
    yield page
    ctx.close()


@pytest.fixture
def user_page(browser, setup_auth):
    ctx = browser.new_context(storage_state=state_path("usuario"))
    page = ctx.new_page()
    yield page
    ctx.close()


@pytest.fixture
def auditor_page(browser, setup_auth):
    ctx = browser.new_context(storage_state=state_path("auditor"))
    page = ctx.new_page()
    yield page
    ctx.close()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// auth.setup.ts — Versión completa de producción
import { test as setup } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const AUTH_DIR = path.join(__dirname, '..', 'auth');
const MAX_STATE_AGE_MS = 25 * 60 * 1000; // 25 min (margen)

interface RoleCreds { email: string; password: string }

const ROLES: Record&lt;string, RoleCreds&gt; = {
    admin:   { email: 'admin@siesa.com',   password: 'Admin123!' },
    usuario: { email: 'user@siesa.com',    password: 'User123!' },
    auditor: { email: 'auditor@siesa.com', password: 'Audit123!' },
};

function statePath(role: string): string {
    return path.join(AUTH_DIR, \`\${role}_state.json\`);
}

function needsRefresh(role: string): boolean {
    const p = statePath(role);
    if (!fs.existsSync(p)) return true;
    const age = Date.now() - fs.statSync(p).mtimeMs;
    return age > MAX_STATE_AGE_MS;
}

// Generar un setup test por cada rol
for (const [role, creds] of Object.entries(ROLES)) {
    setup(\`autenticar como \${role}\`, async ({ page }) => {
        if (!needsRefresh(role)) {
            console.log(\`  ♻️ \${role}: reutilizando estado existente\`);
            return;
        }
        fs.mkdirSync(AUTH_DIR, { recursive: true });

        await page.goto('https://mi-app.com/login');
        await page.fill('#email', creds.email);
        await page.fill('#password', creds.password);
        await page.click("button[type='submit']");
        await page.waitForURL('**/dashboard');
        await page.context().storageState({ path: statePath(role) });
        console.log(\`  \${role} autenticado\`);
    });
}

// playwright.config.ts — Versión completa de producción
import { defineConfig } from '@playwright/test';

export default defineConfig({
    projects: [
        { name: 'setup', testMatch: /.*\\.setup\\.ts/ },
        {
            name: 'admin-tests',
            use: { storageState: 'auth/admin_state.json' },
            dependencies: ['setup'],
        },
        {
            name: 'user-tests',
            use: { storageState: 'auth/usuario_state.json' },
            dependencies: ['setup'],
        },
        {
            name: 'auditor-tests',
            use: { storageState: 'auth/auditor_state.json' },
            dependencies: ['setup'],
        },
    ],
});</code></pre>
            </div>
            </div>

            <div class="code-tabs" data-code-id="L090-11">
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
            <pre><code class="language-python"># tests/test_reportes.py
from playwright.sync_api import expect

class TestReportesAdmin:
    def test_puede_generar_reporte(self, admin_page):
        admin_page.goto("https://mi-app.com/reportes")
        admin_page.select_option("#tipo-reporte", "ventas_mensual")
        admin_page.click("button:has-text('Generar')")
        expect(admin_page.locator(".reporte-resultado")).to_be_visible()

    def test_puede_exportar_pdf(self, admin_page):
        admin_page.goto("https://mi-app.com/reportes")
        admin_page.select_option("#tipo-reporte", "inventario")
        admin_page.click("button:has-text('Generar')")

        with admin_page.expect_download() as download_info:
            admin_page.click("button:has-text('Exportar PDF')")
        download = download_info.value
        assert download.suggested_filename.endswith(".pdf")


class TestReportesAuditor:
    def test_ve_reportes_en_solo_lectura(self, auditor_page):
        auditor_page.goto("https://mi-app.com/reportes")
        expect(auditor_page.locator("button:has-text('Eliminar')")).to_have_count(0)
        expect(auditor_page.locator("button:has-text('Exportar')")).to_be_visible()


class TestReportesUsuario:
    def test_no_ve_reportes_financieros(self, user_page):
        user_page.goto("https://mi-app.com/reportes")
        expect(user_page.locator("text=Reportes Financieros")).to_have_count(0)
        expect(user_page.locator("text=Mis Reportes")).to_be_visible()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// tests/admin.reportes.spec.ts — storageState: admin
import { test, expect } from '@playwright/test';

test.describe('Reportes Admin', () => {
    test('puede generar reporte', async ({ page }) => {
        await page.goto('https://mi-app.com/reportes');
        await page.selectOption('#tipo-reporte', 'ventas_mensual');
        await page.click("button:has-text('Generar')");
        await expect(page.locator('.reporte-resultado')).toBeVisible();
    });

    test('puede exportar PDF', async ({ page }) => {
        await page.goto('https://mi-app.com/reportes');
        await page.selectOption('#tipo-reporte', 'inventario');
        await page.click("button:has-text('Generar')");

        const downloadPromise = page.waitForEvent('download');
        await page.click("button:has-text('Exportar PDF')");
        const download = await downloadPromise;
        expect(download.suggestedFilename()).toMatch(/\\.pdf$/);
    });
});

// tests/auditor.reportes.spec.ts — storageState: auditor
test.describe('Reportes Auditor', () => {
    test('ve reportes en solo lectura', async ({ page }) => {
        await page.goto('https://mi-app.com/reportes');
        await expect(page.locator("button:has-text('Eliminar')")).toHaveCount(0);
        await expect(page.locator("button:has-text('Exportar')")).toBeVisible();
    });
});

// tests/user.reportes.spec.ts — storageState: usuario
test.describe('Reportes Usuario', () => {
    test('no ve reportes financieros', async ({ page }) => {
        await page.goto('https://mi-app.com/reportes');
        await expect(page.locator('text=Reportes Financieros')).toHaveCount(0);
        await expect(page.locator('text=Mis Reportes')).toBeVisible();
    });
});</code></pre>
            </div>
            </div>
        </div>

        <h3>📊 Comparación: con y sin storage state</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #1565c0; color: white;">
                        <th style="padding: 10px;">Aspecto</th>
                        <th style="padding: 10px;">Sin storage state</th>
                        <th style="padding: 10px;">Con storage state</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><strong>Login por test</strong></td>
                        <td style="padding: 8px;">Cada test hace login</td>
                        <td style="padding: 8px;">Login 1 vez por sesión</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>Tiempo (50 tests)</strong></td>
                        <td style="padding: 8px;">~150s extra</td>
                        <td style="padding: 8px;">~3s extra (1 login)</td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><strong>Código duplicado</strong></td>
                        <td style="padding: 8px;">Login en cada test</td>
                        <td style="padding: 8px;">Centralizado en conftest</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>Mantenimiento</strong></td>
                        <td style="padding: 8px;">Cambiar login en N archivos</td>
                        <td style="padding: 8px;">Cambiar en 1 lugar</td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><strong>Carga al servidor</strong></td>
                        <td style="padding: 8px;">N peticiones de auth</td>
                        <td style="padding: 8px;">1 petición de auth</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Implementa un sistema de storage state para una aplicación con 3 roles:</p>
            <ol>
                <li>Crea un <code>conftest.py</code> con:
                    <ul>
                        <li>Diccionario de credenciales para <strong>admin</strong>, <strong>vendedor</strong> y <strong>soporte</strong></li>
                        <li>Fixture <code>scope="session"</code> que autentique todos los roles y guarde el estado en <code>auth/</code></li>
                        <li>Función <code>needs_refresh()</code> que verifique si el estado tiene más de 20 minutos</li>
                        <li>Fixtures individuales: <code>admin_page</code>, <code>vendedor_page</code>, <code>soporte_page</code></li>
                    </ul>
                </li>
                <li>Crea un <code>test_permisos.py</code> con:
                    <ul>
                        <li>Test que verifique que admin puede acceder a <code>/configuracion</code></li>
                        <li>Test que verifique que vendedor puede acceder a <code>/ventas</code> pero no a <code>/configuracion</code></li>
                        <li>Test que verifique que soporte puede acceder a <code>/tickets</code> en modo solo lectura</li>
                    </ul>
                </li>
                <li>Agrega las entradas correspondientes en <code>.gitignore</code></li>
            </ol>
            <p><strong>Pista:</strong> Usa <code>os.path.getmtime()</code> para verificar la antigüedad del archivo
            y <code>time.time()</code> para comparar con el límite.</p>
        </div>
    `,
    topics: ["storage-state", "sesiones", "reutilización"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_090 = LESSON_090;
}
