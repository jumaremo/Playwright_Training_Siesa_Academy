/**
 * Playwright Academy - Lección 050
 * Storage y cookies
 * Sección 6: Interacciones Web Avanzadas
 */

const LESSON_050 = {
    id: 50,
    title: "Storage y cookies",
    duration: "5 min",
    level: "beginner",
    section: "section-06",
    content: `
        <h2>🍪 Storage y cookies</h2>
        <p>Los navegadores ofrecen múltiples mecanismos para almacenar datos del lado del cliente:
        localStorage, sessionStorage, cookies e IndexedDB. Dominar su manejo con Playwright te
        permite manipular estados de autenticación, configuraciones de usuario y datos de sesión
        directamente desde tus tests.</p>

        <h3>📦 Tipos de almacenamiento del navegador</h3>
        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #e0e0e0;">
                <th style="padding: 8px; border: 1px solid #ddd;">Tipo</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Capacidad</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Persistencia</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Enviado al servidor</th>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><strong>localStorage</strong></td>
                <td style="padding: 6px; border: 1px solid #ddd;">~5-10 MB</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Permanente (hasta borrar)</td>
                <td style="padding: 6px; border: 1px solid #ddd;">No</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><strong>sessionStorage</strong></td>
                <td style="padding: 6px; border: 1px solid #ddd;">~5-10 MB</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Solo la pestaña/sesión</td>
                <td style="padding: 6px; border: 1px solid #ddd;">No</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><strong>Cookies</strong></td>
                <td style="padding: 6px; border: 1px solid #ddd;">~4 KB por cookie</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Configurable (expires)</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Sí (en cada request)</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><strong>IndexedDB</strong></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Cientos de MB+</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Permanente</td>
                <td style="padding: 6px; border: 1px solid #ddd;">No</td>
            </tr>
        </table>

        <h3>💾 localStorage y sessionStorage</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Playwright no tiene métodos directos para localStorage/sessionStorage,
            pero puedes usar <code>evaluate()</code> para acceder a ellos a través del
            API del navegador.</p>
        </div>
        <div class="code-tabs" data-code-id="L050-1">
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
                <pre><code class="language-python">from playwright.sync_api import Page, expect

def test_local_storage(page: Page):
    page.goto("https://ejemplo.com")

    # --- Leer valores de localStorage ---
    token = page.evaluate("() => localStorage.getItem('auth_token')")
    print(f"Token actual: {token}")

    # Leer todos los items de localStorage
    todos = page.evaluate("""
        () => {
            const items = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                items[key] = localStorage.getItem(key);
            }
            return items;
        }
    """)
    print(f"localStorage completo: {todos}")

    # --- Escribir valores en localStorage ---
    page.evaluate("() => localStorage.setItem('idioma', 'es')")
    page.evaluate("() => localStorage.setItem('tema', 'oscuro')")

    # Verificar que se guardó correctamente
    idioma = page.evaluate("() => localStorage.getItem('idioma')")
    assert idioma == "es"

    # --- Guardar objetos (como JSON) ---
    page.evaluate("""
        () => localStorage.setItem('usuario', JSON.stringify({
            nombre: 'María',
            rol: 'admin',
            permisos: ['leer', 'escribir', 'borrar']
        }))
    """)

    # Leer y parsear el objeto
    usuario = page.evaluate("""
        () => JSON.parse(localStorage.getItem('usuario'))
    """)
    assert usuario["nombre"] == "María"
    assert "admin" == usuario["rol"]</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('local storage', async ({ page }) => {
    await page.goto('https://ejemplo.com');

    // --- Leer valores de localStorage ---
    const token = await page.evaluate(() => localStorage.getItem('auth_token'));
    console.log(\`Token actual: \${token}\`);

    // Leer todos los items de localStorage
    const todos = await page.evaluate(() => {
        const items: Record&lt;string, string | null&gt; = {};
        for (let i = 0; i &lt; localStorage.length; i++) {
            const key = localStorage.key(i)!;
            items[key] = localStorage.getItem(key);
        }
        return items;
    });
    console.log(\`localStorage completo: \${JSON.stringify(todos)}\`);

    // --- Escribir valores en localStorage ---
    await page.evaluate(() => localStorage.setItem('idioma', 'es'));
    await page.evaluate(() => localStorage.setItem('tema', 'oscuro'));

    // Verificar que se guardó correctamente
    const idioma = await page.evaluate(() => localStorage.getItem('idioma'));
    expect(idioma).toBe('es');

    // --- Guardar objetos (como JSON) ---
    await page.evaluate(() => localStorage.setItem('usuario', JSON.stringify({
        nombre: 'María',
        rol: 'admin',
        permisos: ['leer', 'escribir', 'borrar']
    })));

    // Leer y parsear el objeto
    const usuario = await page.evaluate(() =>
        JSON.parse(localStorage.getItem('usuario')!)
    );
    expect(usuario.nombre).toBe('María');
    expect(usuario.rol).toBe('admin');
});</code></pre>
            </div>
        </div>

        <h3>🗑️ Limpiar storage</h3>
        <div class="code-tabs" data-code-id="L050-2">
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
                <pre><code class="language-python">def test_limpiar_storage(page: Page):
    page.goto("https://ejemplo.com")

    # Limpiar un item específico
    page.evaluate("() => localStorage.removeItem('auth_token')")

    # Limpiar todo el localStorage
    page.evaluate("() => localStorage.clear()")

    # Limpiar sessionStorage
    page.evaluate("() => sessionStorage.clear()")

    # Verificar que está vacío
    cantidad = page.evaluate("() => localStorage.length")
    assert cantidad == 0</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('limpiar storage', async ({ page }) => {
    await page.goto('https://ejemplo.com');

    // Limpiar un item específico
    await page.evaluate(() => localStorage.removeItem('auth_token'));

    // Limpiar todo el localStorage
    await page.evaluate(() => localStorage.clear());

    // Limpiar sessionStorage
    await page.evaluate(() => sessionStorage.clear());

    // Verificar que está vacío
    const cantidad = await page.evaluate(() => localStorage.length);
    expect(cantidad).toBe(0);
});</code></pre>
            </div>
        </div>

        <h3>🍪 Cookies: Lectura con context.cookies()</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Playwright proporciona métodos nativos en el <strong>contexto del navegador</strong>
            para manejar cookies. No necesitas <code>evaluate()</code> para esto.</p>
        </div>
        <div class="code-tabs" data-code-id="L050-3">
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
                <pre><code class="language-python">def test_leer_cookies(page: Page, context):
    page.goto("https://ejemplo.com/login")

    # Hacer login para que el servidor establezca cookies
    page.fill("#usuario", "admin")
    page.fill("#password", "secreto123")
    page.click("#btn-login")

    # Leer TODAS las cookies del contexto
    cookies = context.cookies()
    for cookie in cookies:
        print(f"  {cookie['name']}: {cookie['value']}")
        print(f"    domain={cookie['domain']}, path={cookie['path']}")
        print(f"    httpOnly={cookie['httpOnly']}, secure={cookie['secure']}")

    # Leer cookies de un dominio específico
    cookies_dominio = context.cookies(["https://ejemplo.com"])

    # Buscar una cookie específica
    session_cookie = next(
        (c for c in cookies if c["name"] == "session_id"),
        None
    )
    assert session_cookie is not None
    print(f"Session ID: {session_cookie['value']}")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('leer cookies', async ({ page, context }) => {
    await page.goto('https://ejemplo.com/login');

    // Hacer login para que el servidor establezca cookies
    await page.fill('#usuario', 'admin');
    await page.fill('#password', 'secreto123');
    await page.click('#btn-login');

    // Leer TODAS las cookies del contexto
    const cookies = await context.cookies();
    for (const cookie of cookies) {
        console.log(\`  \${cookie.name}: \${cookie.value}\`);
        console.log(\`    domain=\${cookie.domain}, path=\${cookie.path}\`);
        console.log(\`    httpOnly=\${cookie.httpOnly}, secure=\${cookie.secure}\`);
    }

    // Leer cookies de un dominio específico
    const cookiesDominio = await context.cookies(['https://ejemplo.com']);

    // Buscar una cookie específica
    const sessionCookie = cookies.find(c => c.name === 'session_id');
    expect(sessionCookie).toBeDefined();
    console.log(\`Session ID: \${sessionCookie!.value}\`);
});</code></pre>
            </div>
        </div>

        <h3>➕ Establecer cookies con context.add_cookies()</h3>
        <div class="code-tabs" data-code-id="L050-4">
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
                <pre><code class="language-python">def test_agregar_cookies(page: Page, context):
    # Agregar cookies ANTES de navegar
    context.add_cookies([
        {
            "name": "session_id",
            "value": "abc123xyz",
            "domain": "ejemplo.com",
            "path": "/",
        },
        {
            "name": "idioma",
            "value": "es",
            "domain": "ejemplo.com",
            "path": "/",
            "expires": -1,  # Cookie de sesión (sin expiración fija)
        },
        {
            "name": "auth_token",
            "value": "eyJhbGciOiJIUzI1NiJ9...",
            "domain": "ejemplo.com",
            "path": "/",
            "httpOnly": True,
            "secure": True,
            "sameSite": "Strict",
        }
    ])

    # Ahora navegar — las cookies se enviarán automáticamente
    page.goto("https://ejemplo.com/dashboard")

    # Si las cookies son válidas, estaremos autenticados
    expect(page.locator("h1")).to_have_text("Dashboard")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('agregar cookies', async ({ page, context }) => {
    // Agregar cookies ANTES de navegar
    await context.addCookies([
        {
            name: 'session_id',
            value: 'abc123xyz',
            domain: 'ejemplo.com',
            path: '/',
        },
        {
            name: 'idioma',
            value: 'es',
            domain: 'ejemplo.com',
            path: '/',
            expires: -1,  // Cookie de sesión (sin expiración fija)
        },
        {
            name: 'auth_token',
            value: 'eyJhbGciOiJIUzI1NiJ9...',
            domain: 'ejemplo.com',
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
        }
    ]);

    // Ahora navegar — las cookies se enviarán automáticamente
    await page.goto('https://ejemplo.com/dashboard');

    // Si las cookies son válidas, estaremos autenticados
    await expect(page.locator('h1')).toHaveText('Dashboard');
});</code></pre>
            </div>
        </div>

        <h3>🧹 Limpiar cookies con context.clear_cookies()</h3>
        <div class="code-tabs" data-code-id="L050-5">
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
                <pre><code class="language-python">def test_limpiar_cookies(page: Page, context):
    page.goto("https://ejemplo.com")

    # Verificar que hay cookies
    cookies_antes = context.cookies()
    print(f"Cookies antes: {len(cookies_antes)}")

    # Limpiar TODAS las cookies
    context.clear_cookies()

    # Verificar que se limpiaron
    cookies_despues = context.cookies()
    assert len(cookies_despues) == 0

    # Al recargar, el servidor no recibirá cookies
    page.reload()
    # Probablemente nos redirigirá al login
    expect(page).to_have_url("**/login")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('limpiar cookies', async ({ page, context }) => {
    await page.goto('https://ejemplo.com');

    // Verificar que hay cookies
    const cookiesAntes = await context.cookies();
    console.log(\`Cookies antes: \${cookiesAntes.length}\`);

    // Limpiar TODAS las cookies
    await context.clearCookies();

    // Verificar que se limpiaron
    const cookiesDespues = await context.cookies();
    expect(cookiesDespues.length).toBe(0);

    // Al recargar, el servidor no recibirá cookies
    await page.reload();
    // Probablemente nos redirigirá al login
    await expect(page).toHaveURL('**/login');
});</code></pre>
            </div>
        </div>

        <h3>📋 Propiedades de una cookie</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #ffe0b2;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Propiedad</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Tipo</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripción</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>name</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">str</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Nombre de la cookie (requerido)</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>value</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">str</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Valor de la cookie (requerido)</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>domain</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">str</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Dominio donde es válida</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>path</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">str</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Ruta donde es válida (default: "/")</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>expires</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">float</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Unix timestamp de expiración (-1 = sesión)</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>httpOnly</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">bool</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">No accesible desde JavaScript</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>secure</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">bool</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Solo se envía por HTTPS</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>sameSite</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">str</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">"Strict", "Lax" o "None"</td>
                </tr>
            </table>
        </div>

        <h3>🔐 El patrón de autenticación: storage_state()</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>storage_state()</strong> es el método estrella de Playwright para manejar
            autenticación. Guarda <em>cookies + localStorage</em> en un archivo JSON que puedes
            reutilizar en múltiples tests, eliminando la necesidad de hacer login repetidamente.</p>
        </div>

        <h4>Paso 1: Guardar el estado de autenticación</h4>
        <div class="code-tabs" data-code-id="L050-6">
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
                <pre><code class="language-python"># auth_setup.py - Ejecutar una vez para guardar el estado
from playwright.sync_api import sync_playwright

def guardar_estado_auth():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context()
        page = context.new_page()

        # Hacer login normalmente
        page.goto("https://ejemplo.com/login")
        page.fill("#usuario", "admin")
        page.fill("#password", "secreto123")
        page.click("#btn-login")

        # Esperar a que el login complete
        page.wait_for_url("**/dashboard")

        # GUARDAR el estado completo (cookies + localStorage)
        context.storage_state(path="auth_state.json")
        print("Estado de autenticación guardado en auth_state.json")

        browser.close()

guardar_estado_auth()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// auth_setup.ts - Ejecutar una vez para guardar el estado
import { chromium } from 'playwright';

async function guardarEstadoAuth() {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Hacer login normalmente
    await page.goto('https://ejemplo.com/login');
    await page.fill('#usuario', 'admin');
    await page.fill('#password', 'secreto123');
    await page.click('#btn-login');

    // Esperar a que el login complete
    await page.waitForURL('**/dashboard');

    // GUARDAR el estado completo (cookies + localStorage)
    await context.storageState({ path: 'auth_state.json' });
    console.log('Estado de autenticación guardado en auth_state.json');

    await browser.close();
}

guardarEstadoAuth();</code></pre>
            </div>
        </div>

        <h4>Paso 2: Reutilizar el estado en tests</h4>
        <div class="code-tabs" data-code-id="L050-7">
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

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        # Cargar el estado de autenticación guardado
        "storage_state": "auth_state.json",
    }</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        // Cargar el estado de autenticación guardado
        storageState: 'auth_state.json',
    },
});</code></pre>
            </div>
        </div>
        <div class="code-tabs" data-code-id="L050-8">
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
                <pre><code class="language-python"># test_dashboard.py - Ya NO necesita hacer login
from playwright.sync_api import Page, expect

def test_dashboard_carga(page: Page):
    """Este test arranca ya autenticado."""
    page.goto("https://ejemplo.com/dashboard")

    # Ya estamos logueados gracias a storage_state
    expect(page.locator("h1")).to_have_text("Dashboard")
    expect(page.locator(".user-name")).to_have_text("admin")

def test_perfil_usuario(page: Page):
    """También arranca autenticado."""
    page.goto("https://ejemplo.com/perfil")
    expect(page.locator(".nombre")).to_have_text("Administrador")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// test_dashboard.spec.ts - Ya NO necesita hacer login
import { test, expect } from '@playwright/test';

test('dashboard carga', async ({ page }) => {
    // Este test arranca ya autenticado.
    await page.goto('https://ejemplo.com/dashboard');

    // Ya estamos logueados gracias a storageState
    await expect(page.locator('h1')).toHaveText('Dashboard');
    await expect(page.locator('.user-name')).toHaveText('admin');
});

test('perfil usuario', async ({ page }) => {
    // También arranca autenticado.
    await page.goto('https://ejemplo.com/perfil');
    await expect(page.locator('.nombre')).toHaveText('Administrador');
});</code></pre>
            </div>
        </div>

        <h3>🔄 Patrón completo con pytest-playwright</h3>
        <div class="code-tabs" data-code-id="L050-9">
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
                <pre><code class="language-python"># conftest.py - Patrón de autenticación profesional
import pytest
import os
from playwright.sync_api import Page, BrowserContext

AUTH_STATE_FILE = "auth_state.json"

@pytest.fixture(scope="session")
def auth_state(browser_type, browser_type_launch_args):
    """Genera el estado de autenticación una vez por sesión."""
    if os.path.exists(AUTH_STATE_FILE):
        return AUTH_STATE_FILE

    # Crear browser y contexto temporal para login
    browser = browser_type.launch(**browser_type_launch_args)
    context = browser.new_context()
    page = context.new_page()

    # Login
    page.goto("https://ejemplo.com/login")
    page.fill("#usuario", os.environ.get("TEST_USER", "admin"))
    page.fill("#password", os.environ.get("TEST_PASS", "secreto123"))
    page.click("#btn-login")
    page.wait_for_url("**/dashboard")

    # Guardar estado
    context.storage_state(path=AUTH_STATE_FILE)
    browser.close()
    return AUTH_STATE_FILE

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args, auth_state):
    return {
        **browser_context_args,
        "storage_state": auth_state,
    }</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// auth.setup.ts - Patrón de autenticación profesional
import { test as setup, expect } from '@playwright/test';
import fs from 'fs';

const AUTH_STATE_FILE = 'auth_state.json';

setup('authenticate', async ({ browser }) => {
    // Si ya existe el estado, no repetir login
    if (fs.existsSync(AUTH_STATE_FILE)) return;

    // Crear contexto temporal para login
    const context = await browser.newContext();
    const page = await context.newPage();

    // Login
    await page.goto('https://ejemplo.com/login');
    await page.fill('#usuario', process.env.TEST_USER ?? 'admin');
    await page.fill('#password', process.env.TEST_PASS ?? 'secreto123');
    await page.click('#btn-login');
    await page.waitForURL('**/dashboard');

    // Guardar estado
    await context.storageState({ path: AUTH_STATE_FILE });
    await browser.close();
});

// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    projects: [
        { name: 'setup', testMatch: /auth\\.setup\\.ts/ },
        {
            name: 'tests',
            dependencies: ['setup'],
            use: { storageState: AUTH_STATE_FILE },
        },
    ],
});</code></pre>
            </div>
        </div>

        <h3>📂 Contenido del archivo auth_state.json</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>El archivo generado por <code>storage_state()</code> contiene:</p>
            <div class="code-tabs" data-code-id="L050-10">
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
                <pre><code class="language-python"># Estructura del auth_state.json
{
    "cookies": [
        {
            "name": "session_id",
            "value": "abc123xyz",
            "domain": "ejemplo.com",
            "path": "/",
            "expires": 1735689600,
            "httpOnly": true,
            "secure": true,
            "sameSite": "Lax"
        }
    ],
    "origins": [
        {
            "origin": "https://ejemplo.com",
            "localStorage": [
                {
                    "name": "auth_token",
                    "value": "eyJhbGciOiJIUzI1NiJ9..."
                },
                {
                    "name": "user_preferences",
                    "value": "{\\"theme\\":\\"dark\\"}"
                }
            ]
        }
    ]
}</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Estructura del auth_state.json (idéntica en ambos lenguajes)
{
    "cookies": [
        {
            "name": "session_id",
            "value": "abc123xyz",
            "domain": "ejemplo.com",
            "path": "/",
            "expires": 1735689600,
            "httpOnly": true,
            "secure": true,
            "sameSite": "Lax"
        }
    ],
    "origins": [
        {
            "origin": "https://ejemplo.com",
            "localStorage": [
                {
                    "name": "auth_token",
                    "value": "eyJhbGciOiJIUzI1NiJ9..."
                },
                {
                    "name": "user_preferences",
                    "value": "{\\"theme\\":\\"dark\\"}"
                }
            ]
        }
    ]
}</code></pre>
            </div>
        </div>
        </div>

        <h3>🗃️ IndexedDB: Acceso vía evaluate()</h3>
        <div class="code-tabs" data-code-id="L050-11">
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
                <pre><code class="language-python">def test_indexeddb(page: Page):
    page.goto("https://ejemplo.com/app")

    # Leer datos de IndexedDB
    datos = page.evaluate("""
        () => new Promise((resolve) => {
            const request = indexedDB.open('miBaseDatos', 1);
            request.onsuccess = () => {
                const db = request.result;
                const tx = db.transaction('productos', 'readonly');
                const store = tx.objectStore('productos');
                const getAll = store.getAll();
                getAll.onsuccess = () => resolve(getAll.result);
            };
        })
    """)
    print(f"Productos en IndexedDB: {len(datos)}")

    # Verificar un registro específico
    assert any(d["nombre"] == "Laptop" for d in datos)

    # Limpiar IndexedDB
    page.evaluate("""
        () => new Promise((resolve) => {
            const request = indexedDB.deleteDatabase('miBaseDatos');
            request.onsuccess = () => resolve(true);
        })
    """)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('indexeddb', async ({ page }) => {
    await page.goto('https://ejemplo.com/app');

    // Leer datos de IndexedDB
    const datos = await page.evaluate(() => new Promise&lt;any[]&gt;((resolve) => {
        const request = indexedDB.open('miBaseDatos', 1);
        request.onsuccess = () => {
            const db = request.result;
            const tx = db.transaction('productos', 'readonly');
            const store = tx.objectStore('productos');
            const getAll = store.getAll();
            getAll.onsuccess = () => resolve(getAll.result);
        };
    }));
    console.log(\`Productos en IndexedDB: \${datos.length}\`);

    // Verificar un registro específico
    expect(datos.some(d => d.nombre === 'Laptop')).toBe(true);

    // Limpiar IndexedDB
    await page.evaluate(() => new Promise&lt;boolean&gt;((resolve) => {
        const request = indexedDB.deleteDatabase('miBaseDatos');
        request.onsuccess = () => resolve(true);
    }));
});</code></pre>
            </div>
        </div>

        <h3>🧪 Ejemplo completo: autenticación persistente en una suite</h3>
        <div class="code-tabs" data-code-id="L050-12">
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
                <pre><code class="language-python"># tests/conftest.py
import pytest
import os

AUTH_FILE = "tests/.auth/state.json"

@pytest.fixture(scope="session", autouse=True)
def setup_auth(browser_type, browser_type_launch_args):
    """Login una vez, reutilizar en todos los tests."""
    os.makedirs("tests/.auth", exist_ok=True)

    browser = browser_type.launch(**browser_type_launch_args)
    context = browser.new_context()
    page = context.new_page()

    # Login
    page.goto("https://ejemplo.com/login")
    page.fill("#email", "qa@siesa.com")
    page.fill("#password", "Test2024!")
    page.click("button:has-text('Ingresar')")
    page.wait_for_selector(".dashboard-header")

    # Guardar estado (cookies + localStorage)
    context.storage_state(path=AUTH_FILE)
    browser.close()

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "storage_state": AUTH_FILE,
    }

# --- Tests ya autenticados ---

# tests/test_productos.py
def test_listar_productos(page):
    page.goto("/productos")
    expect(page.locator(".producto-card").first).to_be_visible()

def test_crear_producto(page):
    page.goto("/productos/nuevo")
    page.fill("#nombre", "Producto Test")
    page.fill("#precio", "99.99")
    page.click("button:has-text('Guardar')")
    expect(page.locator(".toast-success")).to_have_text("Producto creado")

def test_verificar_cookies(page, context):
    """Verificar que las cookies de autenticación están presentes."""
    page.goto("/dashboard")
    cookies = context.cookies()

    session = next((c for c in cookies if c["name"] == "session_id"), None)
    assert session is not None, "Cookie session_id no encontrada"

    # Verificar que no ha expirado
    import time
    if session.get("expires", -1) > 0:
        assert session["expires"] > time.time(), "Cookie expirada"</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// tests/auth.setup.ts
import { test as setup } from '@playwright/test';
import fs from 'fs';

const AUTH_FILE = 'tests/.auth/state.json';

setup('authenticate', async ({ browser }) => {
    // Login una vez, reutilizar en todos los tests.
    fs.mkdirSync('tests/.auth', { recursive: true });

    const context = await browser.newContext();
    const page = await context.newPage();

    // Login
    await page.goto('https://ejemplo.com/login');
    await page.fill('#email', 'qa@siesa.com');
    await page.fill('#password', 'Test2024!');
    await page.click("button:has-text('Ingresar')");
    await page.waitForSelector('.dashboard-header');

    // Guardar estado (cookies + localStorage)
    await context.storageState({ path: AUTH_FILE });
    await browser.close();
});

// playwright.config.ts
import { defineConfig } from '@playwright/test';

const AUTH_FILE = 'tests/.auth/state.json';

export default defineConfig({
    projects: [
        { name: 'setup', testMatch: /auth\\.setup\\.ts/ },
        {
            name: 'tests',
            dependencies: ['setup'],
            use: { storageState: AUTH_FILE },
        },
    ],
});

// --- Tests ya autenticados ---

// tests/test_productos.spec.ts
import { test, expect } from '@playwright/test';

test('listar productos', async ({ page }) => {
    await page.goto('/productos');
    await expect(page.locator('.producto-card').first()).toBeVisible();
});

test('crear producto', async ({ page }) => {
    await page.goto('/productos/nuevo');
    await page.fill('#nombre', 'Producto Test');
    await page.fill('#precio', '99.99');
    await page.click("button:has-text('Guardar')");
    await expect(page.locator('.toast-success')).toHaveText('Producto creado');
});

test('verificar cookies', async ({ page, context }) => {
    // Verificar que las cookies de autenticación están presentes.
    await page.goto('/dashboard');
    const cookies = await context.cookies();

    const session = cookies.find(c => c.name === 'session_id');
    expect(session).toBeDefined();

    // Verificar que no ha expirado
    if (session!.expires > 0) {
        expect(session!.expires).toBeGreaterThan(Date.now() / 1000);
    }
});</code></pre>
            </div>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Implementa el patrón de autenticación persistente para una suite de tests:</p>
        </div>
        <ol>
            <li>Crea un <code>conftest.py</code> que haga login una vez y guarde el estado:
                <div class="code-tabs" data-code-id="L050-13">
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
import pytest, os

AUTH_FILE = ".auth/state.json"

@pytest.fixture(scope="session", autouse=True)
def setup_auth(browser_type, browser_type_launch_args):
    os.makedirs(".auth", exist_ok=True)
    browser = browser_type.launch(**browser_type_launch_args)
    ctx = browser.new_context()
    page = ctx.new_page()

    page.goto("https://the-internet.herokuapp.com/login")
    page.fill("#username", "tomsmith")
    page.fill("#password", "SuperSecretPassword!")
    page.click("button[type='submit']")
    page.wait_for_url("**/secure")

    ctx.storage_state(path=AUTH_FILE)
    browser.close()

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {**browser_context_args, "storage_state": AUTH_FILE}</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// auth.setup.ts
import { test as setup } from '@playwright/test';
import fs from 'fs';

const AUTH_FILE = '.auth/state.json';

setup('authenticate', async ({ browser }) => {
    fs.mkdirSync('.auth', { recursive: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://the-internet.herokuapp.com/login');
    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'SuperSecretPassword!');
    await page.click("button[type='submit']");
    await page.waitForURL('**/secure');

    await context.storageState({ path: AUTH_FILE });
    await browser.close();
});

// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    projects: [
        { name: 'setup', testMatch: /auth\\.setup\\.ts/ },
        {
            name: 'tests',
            dependencies: ['setup'],
            use: { storageState: '.auth/state.json' },
        },
    ],
});</code></pre>
            </div>
        </div>
            </li>
            <li>Escribe un test que verifique que arranca autenticado:
                <div class="code-tabs" data-code-id="L050-14">
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
                <pre><code class="language-python">def test_ya_autenticado(page):
    page.goto("https://the-internet.herokuapp.com/secure")
    expect(page.locator("#flash")).to_contain_text("secure area")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('ya autenticado', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/secure');
    await expect(page.locator('#flash')).toContainText('secure area');
});</code></pre>
            </div>
        </div>
            </li>
            <li>Agrega un test que lea y verifique las cookies presentes</li>
            <li>Prueba a manipular localStorage con <code>evaluate()</code></li>
            <li>Ejecuta la suite completa: <code>pytest tests/ -v</code></li>
            <li>Verifica que el archivo <code>.auth/state.json</code> se generó correctamente</li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Leer y escribir en localStorage/sessionStorage con <code>evaluate()</code></li>
                <li>Manejar cookies con <code>context.cookies()</code>, <code>add_cookies()</code> y <code>clear_cookies()</code></li>
                <li>Conocer las propiedades de las cookies (httpOnly, secure, sameSite, expires)</li>
                <li>Implementar el patrón <code>storage_state()</code> para autenticación persistente</li>
                <li>Guardar y reutilizar estados de autenticación entre tests</li>
                <li>Acceder a IndexedDB mediante <code>evaluate()</code> con Promises</li>
            </ul>
        </div>
    `,
    topics: ["storage", "cookies", "localStorage"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_050 = LESSON_050;
}
