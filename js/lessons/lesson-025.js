/**
 * Playwright Academy - Lección 025
 * Fixtures avanzadas de pytest
 * Sección 3: Python para Testers QA
 */

const LESSON_025 = {
    id: 25,
    title: "Fixtures avanzadas de pytest",
    duration: "8 min",
    level: "beginner",
    section: "section-03",
    content: `
        <h2>🔧 Fixtures avanzadas de pytest</h2>
        <p>En la Sección 2 aprendiste los fundamentos de fixtures: setup, teardown y el
        decorador <code>@pytest.fixture</code>. Ahora vamos a profundizar en las capacidades
        avanzadas que hacen de las fixtures una de las herramientas más poderosas de pytest
        y absolutamente esenciales para automatización con Playwright.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📌 Recapitulación rápida</h4>
            <p>Una <strong>fixture</strong> en pytest es una función decorada con <code>@pytest.fixture</code>
            que provee datos, objetos o estado a los tests. Se inyectan automáticamente como parámetros.</p>
            <div class="code-tabs" data-code-id="L025-1">
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
                    <pre><code class="language-python">import pytest

@pytest.fixture
def usuario_demo():
    """Fixture básica: retorna un diccionario."""
    return {"nombre": "Carlos", "rol": "QA Tester"}

def test_saludo(usuario_demo):
    assert usuario_demo["nombre"] == "Carlos"</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

// En Playwright Test, las fixtures se definen con test.extend()
const myTest = test.extend<{ usuarioDemo: { nombre: string; rol: string } }>({
    usuarioDemo: async ({}, use) => {
        // Fixture básica: provee un objeto
        await use({ nombre: "Carlos", rol: "QA Tester" });
    },
});

myTest('saludo', async ({ usuarioDemo }) => {
    expect(usuarioDemo.nombre).toBe("Carlos");
});</code></pre>
                </div>
            </div>
        </div>

        <h3>🎯 Scopes de fixtures: controlando el ciclo de vida</h3>
        <p>El <strong>scope</strong> determina cuándo se crea y destruye una fixture.
        Elegir el scope correcto es clave para el rendimiento de tu suite de tests.</p>

        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #1a237e; color: white;">
                <th style="padding: 10px; border: 1px solid #ddd;">Scope</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Se crea</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Se destruye</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Uso típico</th>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>function</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Antes de cada test</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Después de cada test</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Datos frescos por test, <code>page</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>class</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Antes del primer test de la clase</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Después del último test de la clase</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Estado compartido entre tests de una clase</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>module</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Antes del primer test del archivo</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Después del último test del archivo</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Conexión DB, autenticación</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>session</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Una vez al iniciar pytest</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Al finalizar toda la sesión</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>browser</code>, config global</td>
            </tr>
        </table>

        <div class="code-tabs" data-code-id="L025-2">
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
                <pre><code class="language-python">import pytest

@pytest.fixture(scope="session")
def config_global():
    """Se ejecuta UNA sola vez para toda la sesión de pytest."""
    print("\\n[SESSION] Cargando configuración global...")
    config = {
        "base_url": "https://mi-app.com",
        "timeout": 30000,
        "browser": "chromium"
    }
    yield config
    print("\\n[SESSION] Limpiando configuración global...")

@pytest.fixture(scope="module")
def conexion_db():
    """Se ejecuta una vez por archivo de test."""
    print("\\n[MODULE] Abriendo conexión a BD...")
    db = {"host": "localhost", "connected": True}
    yield db
    print("\\n[MODULE] Cerrando conexión a BD...")
    db["connected"] = False

@pytest.fixture(scope="class")
def datos_clase():
    """Se ejecuta una vez por clase de tests."""
    print("\\n[CLASS] Preparando datos para la clase...")
    return {"contador": 0, "resultados": []}

@pytest.fixture  # scope="function" por defecto
def usuario_temporal():
    """Se ejecuta antes y después de CADA test."""
    print("\\n[FUNCTION] Creando usuario temporal...")
    user = {"id": 99, "nombre": "test_user", "activo": True}
    yield user
    print("\\n[FUNCTION] Eliminando usuario temporal...")
    user["activo"] = False</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// playwright.config.ts — Equivalente a session-scoped config
import { defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        baseURL: 'https://mi-app.com',
        actionTimeout: 30000,
    },
    // projects equivalen a "browser" config
    projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});

// En Playwright Test, los scopes se manejan así:
// - "session" → playwright.config.ts (globalSetup/globalTeardown)
// - "module" → test.beforeAll / test.afterAll (por archivo)
// - "function" → test.beforeEach / test.afterEach (por test)

import { test } from '@playwright/test';

// Equivalente a module-scoped fixture
let conexionDb: { host: string; connected: boolean };

test.beforeAll(async () => {
    console.log('\\n[MODULE] Abriendo conexión a BD...');
    conexionDb = { host: 'localhost', connected: true };
});

test.afterAll(async () => {
    console.log('\\n[MODULE] Cerrando conexión a BD...');
    conexionDb.connected = false;
});

// Equivalente a function-scoped fixture
let usuarioTemporal: { id: number; nombre: string; activo: boolean };

test.beforeEach(async () => {
    console.log('\\n[FUNCTION] Creando usuario temporal...');
    usuarioTemporal = { id: 99, nombre: 'test_user', activo: true };
});

test.afterEach(async () => {
    console.log('\\n[FUNCTION] Eliminando usuario temporal...');
    usuarioTemporal.activo = false;
});</code></pre>
            </div>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚠️ Regla de scopes</h4>
            <p>Una fixture de scope menor <strong>no puede</strong> depender de una de scope mayor inverso.
            Pero una fixture de scope mayor <strong>sí puede</strong> ser usada por fixtures de scope menor.</p>
            <p><strong>Válido:</strong> <code>session</code> &rarr; <code>module</code> &rarr; <code>class</code> &rarr; <code>function</code> (de mayor a menor)</p>
            <p><strong>Inválido:</strong> Una fixture <code>session</code> que pide una fixture <code>function</code></p>
        </div>

        <h3>🔄 Fixtures con yield: setup + teardown elegante</h3>
        <p>El patrón <code>yield</code> permite definir setup y teardown en una sola función.
        Todo lo que está <strong>antes</strong> del <code>yield</code> es setup; todo lo que está
        <strong>después</strong> es teardown.</p>

        <div class="code-tabs" data-code-id="L025-3">
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
                <pre><code class="language-python">import pytest
from playwright.sync_api import sync_playwright

@pytest.fixture(scope="session")
def browser_instance():
    """Lanza el navegador al inicio, lo cierra al final."""
    # --- SETUP ---
    print("\\nLanzando navegador...")
    pw = sync_playwright().start()
    browser = pw.chromium.launch(headless=True)

    yield browser  # <-- El test recibe este objeto

    # --- TEARDOWN (siempre se ejecuta, incluso si el test falla) ---
    print("\\nCerrando navegador...")
    browser.close()
    pw.stop()

@pytest.fixture
def pagina_autenticada(browser_instance):
    """Crea un contexto autenticado para cada test."""
    # SETUP
    context = browser_instance.new_context(
        viewport={"width": 1280, "height": 720}
    )
    page = context.new_page()
    page.goto("https://mi-app.com/login")
    page.fill("#email", "admin@test.com")
    page.fill("#password", "test1234")
    page.click("#btn-login")
    page.wait_for_url("**/dashboard")

    yield page  # El test recibe la página ya autenticada

    # TEARDOWN
    page.close()
    context.close()

def test_dashboard(pagina_autenticada):
    """Este test ya tiene una página con sesión iniciada."""
    pagina_autenticada.click("text=Mi Perfil")
    assert "perfil" in pagina_autenticada.url</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect, chromium, Browser, Page } from '@playwright/test';

// En Playwright Test, el browser se maneja automáticamente.
// Para emular el patrón yield (setup + teardown), usa test.extend():

type AuthFixtures = {
    paginaAutenticada: Page;
};

const authTest = test.extend<AuthFixtures>({
    paginaAutenticada: async ({ browser }, use) => {
        // --- SETUP ---
        const context = await browser.newContext({
            viewport: { width: 1280, height: 720 },
        });
        const page = await context.newPage();
        await page.goto('https://mi-app.com/login');
        await page.fill('#email', 'admin@test.com');
        await page.fill('#password', 'test1234');
        await page.click('#btn-login');
        await page.waitForURL('**/dashboard');

        await use(page); // <-- El test recibe este objeto

        // --- TEARDOWN (siempre se ejecuta) ---
        await page.close();
        await context.close();
    },
});

authTest('dashboard', async ({ paginaAutenticada }) => {
    // Este test ya tiene una página con sesión iniciada
    await paginaAutenticada.click('text=Mi Perfil');
    expect(paginaAutenticada.url()).toContain('perfil');
});</code></pre>
            </div>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ ¿Por qué yield y no try/finally?</h4>
            <p>pytest garantiza que el código después de <code>yield</code> se ejecute
            <strong>siempre</strong>, incluso si el test lanza una excepción. Es equivalente
            a un bloque <code>try/finally</code>, pero más limpio y legible.</p>
        </div>

        <h3>🔁 Parametrización de fixtures</h3>
        <p>Puedes crear fixtures que se ejecuten múltiples veces con diferentes parámetros.
        Cada combinación genera un test separado.</p>

        <div class="code-tabs" data-code-id="L025-4">
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
                <pre><code class="language-python">import pytest

# --- Fixture parametrizada: ejecuta cada test 3 veces ---
@pytest.fixture(params=["chromium", "firefox", "webkit"])
def nombre_browser(request):
    """Cada test que use esta fixture se ejecuta con cada navegador."""
    return request.param

def test_titulo_pagina(nombre_browser):
    print(f"Probando con: {nombre_browser}")
    assert nombre_browser in ["chromium", "firefox", "webkit"]

# Salida:
# test_titulo_pagina[chromium]   PASSED
# test_titulo_pagina[firefox]    PASSED
# test_titulo_pagina[webkit]     PASSED


# --- Con IDs personalizados ---
@pytest.fixture(params=[
    pytest.param({"user": "admin", "pass": "admin123"}, id="admin"),
    pytest.param({"user": "viewer", "pass": "view456"}, id="viewer"),
    pytest.param({"user": "editor", "pass": "edit789"}, id="editor"),
])
def credenciales(request):
    """Provee diferentes credenciales para cada ejecución."""
    return request.param

def test_login_roles(credenciales):
    print(f"Login como: {credenciales['user']}")
    assert "user" in credenciales
    assert "pass" in credenciales

# Salida:
# test_login_roles[admin]    PASSED
# test_login_roles[viewer]   PASSED
# test_login_roles[editor]   PASSED


# --- Parametrización con Playwright real ---
@pytest.fixture(params=[
    {"width": 1920, "height": 1080, "device": "Desktop"},
    {"width": 768, "height": 1024, "device": "Tablet"},
    {"width": 375, "height": 812, "device": "Mobile"},
])
def viewport_config(request):
    """Permite probar en múltiples resoluciones."""
    return request.param

def test_responsive_layout(page, viewport_config):
    page.set_viewport_size({
        "width": viewport_config["width"],
        "height": viewport_config["height"]
    })
    page.goto("https://mi-app.com")
    # Verificar que el layout se adapta
    if viewport_config["device"] == "Mobile":
        assert page.locator(".mobile-menu").is_visible()
    else:
        assert page.locator(".desktop-nav").is_visible()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

// --- Parametrización de navegadores: usa projects en config ---
// playwright.config.ts
// projects: [
//   { name: 'chromium', use: { browserName: 'chromium' } },
//   { name: 'firefox', use: { browserName: 'firefox' } },
//   { name: 'webkit', use: { browserName: 'webkit' } },
// ]

// --- Parametrización con datos: usa un array ---
const credenciales = [
    { user: 'admin', pass: 'admin123' },
    { user: 'viewer', pass: 'view456' },
    { user: 'editor', pass: 'edit789' },
];

for (const cred of credenciales) {
    test(\`login como: \${cred.user}\`, async ({ page }) => {
        console.log(\`Login como: \${cred.user}\`);
        expect(cred.user).toBeTruthy();
        expect(cred.pass).toBeTruthy();
    });
}

// --- Parametrización con Playwright real: viewports ---
const viewports = [
    { width: 1920, height: 1080, device: 'Desktop' },
    { width: 768, height: 1024, device: 'Tablet' },
    { width: 375, height: 812, device: 'Mobile' },
];

for (const vp of viewports) {
    test(\`responsive layout - \${vp.device}\`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto('https://mi-app.com');
        if (vp.device === 'Mobile') {
            await expect(page.locator('.mobile-menu')).toBeVisible();
        } else {
            await expect(page.locator('.desktop-nav')).toBeVisible();
        }
    });
}</code></pre>
            </div>
        </div>

        <h3>🏭 Fixture factories: fixtures que retornan funciones</h3>
        <p>A veces necesitas crear múltiples instancias de algo dentro de un mismo test.
        Las <strong>fixture factories</strong> resuelven esto retornando una función (callable)
        en lugar de un valor.</p>

        <div class="code-tabs" data-code-id="L025-5">
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
                <pre><code class="language-python">import pytest
import random
import string

@pytest.fixture
def crear_usuario():
    """Factory: retorna una función que crea usuarios."""
    usuarios_creados = []

    def _factory(nombre=None, rol="tester"):
        nombre = nombre or "user_" + "".join(random.choices(string.ascii_lowercase, k=5))
        usuario = {
            "id": random.randint(1000, 9999),
            "nombre": nombre,
            "rol": rol,
            "activo": True
        }
        usuarios_creados.append(usuario)
        return usuario

    yield _factory

    # Teardown: limpiar todos los usuarios creados
    for u in usuarios_creados:
        print(f"Limpiando usuario: {u['nombre']}")
        u["activo"] = False

def test_multiples_usuarios(crear_usuario):
    """Puedo crear cuantos usuarios necesite."""
    admin = crear_usuario(nombre="admin_test", rol="admin")
    viewer = crear_usuario(nombre="viewer_test", rol="viewer")
    tester = crear_usuario()  # nombre aleatorio

    assert admin["rol"] == "admin"
    assert viewer["rol"] == "viewer"
    assert tester["rol"] == "tester"
    # Al finalizar, el teardown limpia los 3 usuarios


# --- Factory para páginas con Playwright ---
@pytest.fixture
def crear_pagina(browser):
    """Factory que crea páginas con configuraciones diferentes."""
    paginas = []

    def _factory(viewport=None, locale="es-CO", timezone="America/Bogota"):
        context = browser.new_context(
            viewport=viewport or {"width": 1280, "height": 720},
            locale=locale,
            timezone_id=timezone
        )
        page = context.new_page()
        paginas.append((page, context))
        return page

    yield _factory

    for page, context in paginas:
        page.close()
        context.close()

def test_multi_idioma(crear_pagina):
    pagina_es = crear_pagina(locale="es-CO")
    pagina_en = crear_pagina(locale="en-US")
    # Ambas páginas con diferentes configuraciones regionales</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect, Browser, Page, BrowserContext } from '@playwright/test';

// Factory fixture con test.extend()
type FactoryFixtures = {
    crearUsuario: (nombre?: string, rol?: string) => { id: number; nombre: string; rol: string; activo: boolean };
    crearPagina: (options?: { viewport?: { width: number; height: number }; locale?: string; timezone?: string }) => Promise<Page>;
};

const factoryTest = test.extend<FactoryFixtures>({
    crearUsuario: async ({}, use) => {
        const usuariosCreados: { id: number; nombre: string; rol: string; activo: boolean }[] = [];

        const factory = (nombre?: string, rol: string = 'tester') => {
            const user = {
                id: Math.floor(Math.random() * 9000) + 1000,
                nombre: nombre ?? \`user_\${Math.random().toString(36).slice(2, 7)}\`,
                rol,
                activo: true,
            };
            usuariosCreados.push(user);
            return user;
        };

        await use(factory);

        // Teardown: limpiar todos los usuarios creados
        for (const u of usuariosCreados) {
            console.log(\`Limpiando usuario: \${u.nombre}\`);
            u.activo = false;
        }
    },

    crearPagina: async ({ browser }, use) => {
        const paginas: { page: Page; context: BrowserContext }[] = [];

        const factory = async (options?: {
            viewport?: { width: number; height: number };
            locale?: string;
            timezone?: string;
        }) => {
            const context = await browser.newContext({
                viewport: options?.viewport ?? { width: 1280, height: 720 },
                locale: options?.locale ?? 'es-CO',
                timezoneId: options?.timezone ?? 'America/Bogota',
            });
            const page = await context.newPage();
            paginas.push({ page, context });
            return page;
        };

        await use(factory);

        for (const { page, context } of paginas) {
            await page.close();
            await context.close();
        }
    },
});

factoryTest('multiples usuarios', async ({ crearUsuario }) => {
    const admin = crearUsuario('admin_test', 'admin');
    const viewer = crearUsuario('viewer_test', 'viewer');
    const tester = crearUsuario(); // nombre aleatorio

    expect(admin.rol).toBe('admin');
    expect(viewer.rol).toBe('viewer');
    expect(tester.rol).toBe('tester');
});

factoryTest('multi idioma', async ({ crearPagina }) => {
    const paginaEs = await crearPagina({ locale: 'es-CO' });
    const paginaEn = await crearPagina({ locale: 'en-US' });
    // Ambas páginas con diferentes configuraciones regionales
});</code></pre>
            </div>
        </div>

        <h3>🧩 Composición: fixtures que dependen de otras fixtures</h3>
        <p>Las fixtures pueden inyectar otras fixtures como parámetros, creando
        una cadena de dependencias que pytest resuelve automáticamente.</p>

        <div class="code-tabs" data-code-id="L025-6">
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
                <pre><code class="language-python">import pytest

@pytest.fixture(scope="session")
def configuracion_app():
    """Nivel 1: Configuración base (una vez por sesión)."""
    return {
        "base_url": "https://staging.mi-app.com",
        "api_url": "https://api.staging.mi-app.com",
        "timeout": 15000
    }

@pytest.fixture(scope="module")
def cliente_api(configuracion_app):
    """Nivel 2: Cliente API (depende de configuración)."""
    import requests
    session = requests.Session()
    session.base_url = configuracion_app["api_url"]
    session.headers.update({"Content-Type": "application/json"})
    yield session
    session.close()

@pytest.fixture
def usuario_autenticado(cliente_api, configuracion_app):
    """Nivel 3: Usuario autenticado (depende de API y config)."""
    response = cliente_api.post(
        f"{configuracion_app['api_url']}/auth/login",
        json={"email": "test@test.com", "password": "test123"}
    )
    token = response.json()["token"]
    cliente_api.headers.update({"Authorization": f"Bearer {token}"})
    yield {"token": token, "email": "test@test.com"}
    # Teardown: logout
    cliente_api.post(f"{configuracion_app['api_url']}/auth/logout")

@pytest.fixture
def pagina_dashboard(page, usuario_autenticado, configuracion_app):
    """Nivel 4: Página en dashboard (depende de page + auth + config)."""
    page.goto(configuracion_app["base_url"])
    # Inyectar token en el navegador
    page.evaluate(f"localStorage.setItem('token', '{usuario_autenticado['token']}')")
    page.goto(f"{configuracion_app['base_url']}/dashboard")
    page.wait_for_load_state("networkidle")
    return page

def test_ver_proyectos(pagina_dashboard):
    """El test recibe la página ya en el dashboard, autenticada."""
    pagina_dashboard.click("text=Mis Proyectos")
    assert pagina_dashboard.locator(".project-card").count() > 0</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect, Page, APIRequestContext } from '@playwright/test';

// Composición de fixtures en Playwright Test con test.extend()
type ComposedFixtures = {
    configuracionApp: { baseUrl: string; apiUrl: string; timeout: number };
    clienteApi: APIRequestContext;
    usuarioAutenticado: { token: string; email: string };
    paginaDashboard: Page;
};

const composedTest = test.extend<ComposedFixtures>({
    // Nivel 1: Configuración base
    configuracionApp: async ({}, use) => {
        await use({
            baseUrl: 'https://staging.mi-app.com',
            apiUrl: 'https://api.staging.mi-app.com',
            timeout: 15000,
        });
    },

    // Nivel 2: Cliente API (depende de config)
    clienteApi: async ({ configuracionApp, playwright }, use) => {
        const apiContext = await playwright.request.newContext({
            baseURL: configuracionApp.apiUrl,
            extraHTTPHeaders: { 'Content-Type': 'application/json' },
        });
        await use(apiContext);
        await apiContext.dispose();
    },

    // Nivel 3: Usuario autenticado (depende de API y config)
    usuarioAutenticado: async ({ clienteApi, configuracionApp }, use) => {
        const response = await clienteApi.post('/auth/login', {
            data: { email: 'test@test.com', password: 'test123' },
        });
        const { token } = await response.json();
        await use({ token, email: 'test@test.com' });
        // Teardown: logout
        await clienteApi.post('/auth/logout');
    },

    // Nivel 4: Página en dashboard (depende de page + auth + config)
    paginaDashboard: async ({ page, usuarioAutenticado, configuracionApp }, use) => {
        await page.goto(configuracionApp.baseUrl);
        await page.evaluate(
            (t) => localStorage.setItem('token', t),
            usuarioAutenticado.token
        );
        await page.goto(\`\${configuracionApp.baseUrl}/dashboard\`);
        await page.waitForLoadState('networkidle');
        await use(page);
    },
});

composedTest('ver proyectos', async ({ paginaDashboard }) => {
    await paginaDashboard.click('text=Mis Proyectos');
    expect(await paginaDashboard.locator('.project-card').count()).toBeGreaterThan(0);
});</code></pre>
            </div>
        </div>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔗 Cadena de dependencias</h4>
            <pre><code>configuracion_app (session)
    └── cliente_api (module)
            └── usuario_autenticado (function)
                    └── pagina_dashboard (function)
                            └── test_ver_proyectos</code></pre>
            <p>pytest resuelve toda la cadena automáticamente. Solo necesitas declarar
            los parámetros en la firma de la función.</p>
        </div>

        <h3>📁 conftest.py: jerarquía y compartición de fixtures</h3>
        <p>El archivo <code>conftest.py</code> es el mecanismo de pytest para compartir fixtures
        entre múltiples archivos de test. Sigue una jerarquía basada en directorios.</p>

        <pre><code>proyecto/
├── conftest.py               # Fixtures globales (session, browser config)
├── tests/
│   ├── conftest.py           # Fixtures compartidas por todos los tests
│   ├── smoke/
│   │   ├── conftest.py       # Fixtures solo para smoke tests
│   │   ├── test_home.py
│   │   └── test_login.py
│   ├── regression/
│   │   ├── conftest.py       # Fixtures solo para regression
│   │   ├── test_checkout.py
│   │   └── test_perfil.py
│   └── api/
│       ├── conftest.py       # Fixtures solo para API tests
│       └── test_endpoints.py</code></pre>

        <div class="code-tabs" data-code-id="L025-7">
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
                <pre><code class="language-python"># proyecto/conftest.py (raíz) — aplica a TODOS los tests
import pytest

@pytest.fixture(scope="session")
def base_url():
    return "https://staging.mi-app.com"


# proyecto/tests/conftest.py — aplica a todo bajo tests/
import pytest

@pytest.fixture(autouse=True)
def log_nombre_test(request):
    print(f"\\n--- Ejecutando: {request.node.name} ---")
    yield
    print(f"--- Finalizado: {request.node.name} ---")


# proyecto/tests/smoke/conftest.py — SOLO para tests en smoke/
import pytest

@pytest.fixture
def timeout_rapido(page):
    """Los smoke tests deben ser rápidos."""
    page.set_default_timeout(5000)
    return page


# proyecto/tests/api/conftest.py — SOLO para tests en api/
import pytest
import requests

@pytest.fixture(scope="module")
def api_session(base_url):
    """Sesión HTTP para tests de API."""
    session = requests.Session()
    session.base_url = base_url
    yield session
    session.close()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// En Playwright Test, la compartición se logra con:
// - playwright.config.ts (configuración global)
// - Archivos de fixtures con test.extend()
// - test.beforeAll/beforeEach en cada archivo

// playwright.config.ts — equivalente a conftest.py raíz
import { defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        baseURL: 'https://staging.mi-app.com',
    },
});

// fixtures/auth.fixtures.ts — equivalente a conftest.py compartido
import { test as base } from '@playwright/test';

export const test = base.extend({
    // Auto-fixture: se aplica a todos los tests
    // Similar a autouse=True
});

// Cada test.beforeEach registra el nombre
// tests/smoke/smoke.spec.ts
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    // Equivalente a timeout_rapido
    page.setDefaultTimeout(5000);
});

// tests/api/api.spec.ts
import { test, expect, request } from '@playwright/test';

let apiContext;

test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
        baseURL: 'https://staging.mi-app.com',
    });
});

test.afterAll(async () => {
    await apiContext.dispose();
});</code></pre>
            </div>
        </div>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📌 Reglas de conftest.py</h4>
            <ul>
                <li>No necesita ser importado: pytest lo descubre automáticamente</li>
                <li>Las fixtures del directorio padre están disponibles en los hijos</li>
                <li>Una fixture en un conftest.py hijo <strong>sobrescribe</strong> a una del padre con el mismo nombre</li>
                <li>Puede contener hooks de pytest (<code>pytest_configure</code>, <code>pytest_collection_modifyitems</code>, etc.)</li>
                <li>Es el lugar ideal para fixtures de scope <code>session</code> y <code>module</code></li>
            </ul>
        </div>

        <h3>🧰 Fixtures built-in de pytest</h3>
        <p>pytest incluye varias fixtures que puedes usar directamente sin definirlas:</p>

        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #1a237e; color: white;">
                <th style="padding: 10px; border: 1px solid #ddd;">Fixture</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Descripción</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Ejemplo</th>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>tmp_path</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Directorio temporal único por test</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Guardar reportes, screenshots</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>tmp_path_factory</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Factory de directorios temporales (session scope)</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Directorio compartido entre tests</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>monkeypatch</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Modificar atributos, variables de entorno, etc.</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Simular entorno de producción</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>capsys</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Capturar salida stdout/stderr</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Verificar mensajes de log</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>request</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Información del test en ejecución</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Nombre del test, marcadores, params</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>caplog</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Capturar registros de logging</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Verificar logs emitidos</td>
            </tr>
        </table>

        <div class="code-tabs" data-code-id="L025-8">
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
                <pre><code class="language-python">import pytest
import os

def test_guardar_reporte(tmp_path):
    """tmp_path provee un directorio temporal único."""
    archivo = tmp_path / "reporte.txt"
    archivo.write_text("Test completado exitosamente")
    assert archivo.read_text() == "Test completado exitosamente"
    print(f"Reporte guardado en: {archivo}")

def test_variable_entorno(monkeypatch):
    """monkeypatch modifica el entorno temporalmente."""
    monkeypatch.setenv("BASE_URL", "https://test.mi-app.com")
    monkeypatch.setenv("HEADLESS", "true")
    assert os.environ["BASE_URL"] == "https://test.mi-app.com"
    assert os.environ["HEADLESS"] == "true"
    # Al salir del test, las variables vuelven a su valor original

def test_capturar_salida(capsys):
    """capsys captura lo que se imprime en consola."""
    print("Iniciando test de login...")
    print("Login exitoso")
    captured = capsys.readouterr()
    assert "Login exitoso" in captured.out

def test_info_del_test(request):
    """request contiene metadatos del test actual."""
    print(f"Nombre del test: {request.node.name}")
    print(f"Archivo: {request.fspath}")
    print(f"Marcadores: {[m.name for m in request.node.iter_markers()]}")

def test_verificar_logs(caplog):
    """caplog captura registros del módulo logging."""
    import logging
    logger = logging.getLogger("mi_app")
    logger.warning("Timeout cercano al límite")
    assert "Timeout cercano" in caplog.text
    assert len(caplog.records) == 1
    assert caplog.records[0].levelname == "WARNING"</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

test('guardar reporte', async ({}, testInfo) => {
    // testInfo.outputDir provee un directorio temporal único por test
    const archivo = path.join(testInfo.outputDir, 'reporte.txt');
    fs.mkdirSync(testInfo.outputDir, { recursive: true });
    fs.writeFileSync(archivo, 'Test completado exitosamente');
    expect(fs.readFileSync(archivo, 'utf-8')).toBe('Test completado exitosamente');
    console.log(\`Reporte guardado en: \${archivo}\`);
});

test('variable de entorno', async () => {
    // En TypeScript, usas process.env directamente
    const originalUrl = process.env.BASE_URL;
    process.env.BASE_URL = 'https://test.mi-app.com';
    process.env.HEADLESS = 'true';
    expect(process.env.BASE_URL).toBe('https://test.mi-app.com');
    expect(process.env.HEADLESS).toBe('true');
    // Restaurar manualmente
    process.env.BASE_URL = originalUrl;
});

test('info del test', async ({}, testInfo) => {
    // testInfo contiene metadatos del test actual
    console.log(\`Nombre del test: \${testInfo.title}\`);
    console.log(\`Archivo: \${testInfo.file}\`);
    console.log(\`Proyecto: \${testInfo.project.name}\`);
    console.log(\`Reintentos: \${testInfo.retry}\`);
});</code></pre>
            </div>
        </div>

        <h3>🎭 Fixtures específicas de Playwright</h3>
        <p>El plugin <code>pytest-playwright</code> proporciona fixtures pre-configuradas
        que simplifican enormemente la escritura de tests.</p>

        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #2e7d32; color: white;">
                <th style="padding: 10px; border: 1px solid #ddd;">Fixture</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Scope</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Descripción</th>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>page</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">function</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Página nueva y aislada para cada test</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>context</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">function</td>
                <td style="padding: 8px; border: 1px solid #ddd;">BrowserContext del test (viewport, cookies, etc.)</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>browser</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">session</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Instancia del navegador (compartida entre tests)</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>browser_type</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">session</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Tipo de navegador (chromium, firefox, webkit)</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>browser_name</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">session</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Nombre del navegador como string</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>browser_context_args</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">session</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Argumentos para crear el contexto del navegador</td>
            </tr>
        </table>

        <div class="code-tabs" data-code-id="L025-9">
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
                <pre><code class="language-python">import pytest
from playwright.sync_api import Page, BrowserContext, Browser, expect

# --- Uso directo de las fixtures de Playwright ---
def test_con_page(page: Page):
    """page: nueva página aislada (function scope)."""
    page.goto("https://mi-app.com")
    expect(page).to_have_title("Mi Aplicación")

def test_con_context(context: BrowserContext):
    """context: permite crear múltiples páginas."""
    page1 = context.new_page()
    page2 = context.new_page()
    page1.goto("https://mi-app.com/admin")
    page2.goto("https://mi-app.com/usuario")
    # Comparten cookies y storage (mismo contexto)

def test_con_browser(browser: Browser):
    """browser: para crear contextos personalizados."""
    ctx_movil = browser.new_context(
        viewport={"width": 375, "height": 812},
        is_mobile=True
    )
    ctx_desktop = browser.new_context(
        viewport={"width": 1920, "height": 1080}
    )
    page_movil = ctx_movil.new_page()
    page_desktop = ctx_desktop.new_page()
    # Dos contextos completamente aislados

    page_movil.close()
    page_desktop.close()
    ctx_movil.close()
    ctx_desktop.close()

# --- Personalizar fixtures de Playwright vía conftest.py ---
# conftest.py
@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    """Personalizar el contexto del navegador para toda la sesión."""
    return {
        **browser_context_args,
        "viewport": {"width": 1280, "height": 720},
        "locale": "es-CO",
        "timezone_id": "America/Bogota",
        "color_scheme": "light",
        "ignore_https_errors": True,
        "record_video_dir": "videos/"
    }

@pytest.fixture(scope="session")
def browser_type_launch_args(browser_type_launch_args):
    """Personalizar el lanzamiento del navegador."""
    return {
        **browser_type_launch_args,
        "headless": True,
        "slow_mo": 100,  # 100ms entre acciones (útil para demos)
    }</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect, Page, BrowserContext, Browser } from '@playwright/test';

// --- Uso directo de las fixtures de Playwright ---
test('con page', async ({ page }) => {
    // page: nueva página aislada (por test)
    await page.goto('https://mi-app.com');
    await expect(page).toHaveTitle('Mi Aplicación');
});

test('con context', async ({ context }) => {
    // context: permite crear múltiples páginas
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    await page1.goto('https://mi-app.com/admin');
    await page2.goto('https://mi-app.com/usuario');
    // Comparten cookies y storage (mismo contexto)
});

test('con browser', async ({ browser }) => {
    // browser: para crear contextos personalizados
    const ctxMovil = await browser.newContext({
        viewport: { width: 375, height: 812 },
        isMobile: true,
    });
    const ctxDesktop = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
    });
    const pageMovil = await ctxMovil.newPage();
    const pageDesktop = await ctxDesktop.newPage();
    // Dos contextos completamente aislados

    await pageMovil.close();
    await pageDesktop.close();
    await ctxMovil.close();
    await ctxDesktop.close();
});

// --- Personalizar vía playwright.config.ts ---
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        viewport: { width: 1280, height: 720 },
        locale: 'es-CO',
        timezoneId: 'America/Bogota',
        colorScheme: 'light',
        ignoreHTTPSErrors: true,
        video: 'on',                    // Equivalente a record_video_dir
        launchOptions: {
            slowMo: 100,                // 100ms entre acciones
        },
    },
});</code></pre>
            </div>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff8e1; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #f9a825;">
            <h4>🏋️ Ejercicio: Jerarquía de fixtures para un proyecto real</h4>
            <p>Construye un sistema de fixtures con tres niveles de scope para un proyecto
            de automatización con Playwright.</p>

            <p><strong>Requisitos:</strong></p>
            <ol>
                <li><strong>Fixture session-scoped</strong> <code>app_config</code>: Lee configuración del proyecto (base_url, browser, headless). Se ejecuta una sola vez.</li>
                <li><strong>Fixture module-scoped</strong> <code>autenticacion</code>: Crea un contexto autenticado usando las credenciales de la config. Se comparte entre todos los tests del archivo.</li>
                <li><strong>Fixture function-scoped</strong> <code>pagina_limpia</code>: Crea una nueva página dentro del contexto autenticado, navega al dashboard. Se crea para cada test.</li>
                <li><strong>Fixture factory</strong> <code>crear_producto</code>: Permite crear productos de prueba con datos parametrizables. Limpia los productos creados al finalizar.</li>
                <li>Organiza todo en un <code>conftest.py</code> con comentarios claros.</li>
            </ol>
        </div>

        <div class="code-tabs" data-code-id="L025-10">
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
                <pre><code class="language-python"># Solución: conftest.py completo con jerarquía de fixtures
import pytest
from playwright.sync_api import Browser, BrowserContext, Page

# ============================================================
# NIVEL 1: Session-scoped - Configuración global
# ============================================================
@pytest.fixture(scope="session")
def app_config():
    """Configuración global del proyecto. Se carga una sola vez."""
    config = {
        "base_url": "https://staging.tienda-demo.com",
        "api_url": "https://api.staging.tienda-demo.com",
        "credenciales": {
            "admin": {"email": "admin@test.com", "password": "Admin2024!"},
            "comprador": {"email": "buyer@test.com", "password": "Buyer2024!"},
        },
        "timeout": 15000,
        "headless": True
    }
    print(f"\\n[SESSION] Config cargada: {config['base_url']}")
    yield config
    print("\\n[SESSION] Sesión finalizada.")

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args, app_config):
    """Personalizar contexto con datos de la config."""
    return {
        **browser_context_args,
        "base_url": app_config["base_url"],
        "viewport": {"width": 1280, "height": 720},
        "locale": "es-CO"
    }


# ============================================================
# NIVEL 2: Module-scoped - Autenticación compartida
# ============================================================
@pytest.fixture(scope="module")
def autenticacion(browser: Browser, app_config):
    """Crea un contexto autenticado para todo el módulo."""
    print("\\n[MODULE] Iniciando autenticación...")
    context = browser.new_context(
        base_url=app_config["base_url"],
        viewport={"width": 1280, "height": 720}
    )
    page = context.new_page()

    # Hacer login
    creds = app_config["credenciales"]["admin"]
    page.goto("/login")
    page.fill("#email", creds["email"])
    page.fill("#password", creds["password"])
    page.click("#btn-login")
    page.wait_for_url("**/dashboard")

    # Guardar el estado de autenticación
    storage = context.storage_state()
    page.close()
    context.close()

    print("[MODULE] Autenticación exitosa.")
    yield storage  # Retorna el estado de storage para reusar

    print("[MODULE] Finalizando módulo autenticado.")


# ============================================================
# NIVEL 3: Function-scoped - Página limpia por test
# ============================================================
@pytest.fixture
def pagina_limpia(browser: Browser, autenticacion, app_config):
    """Página nueva con sesión activa para cada test."""
    context = browser.new_context(
        storage_state=autenticacion,  # Reusar autenticación
        base_url=app_config["base_url"],
        viewport={"width": 1280, "height": 720}
    )
    page = context.new_page()
    page.set_default_timeout(app_config["timeout"])
    page.goto("/dashboard")

    yield page

    page.close()
    context.close()


# ============================================================
# FIXTURE FACTORY: Crear productos de prueba
# ============================================================
@pytest.fixture
def crear_producto(pagina_limpia):
    """Factory para crear productos. Limpia al finalizar."""
    productos_ids = []

    def _crear(nombre="Producto Test", precio=99.99, categoria="General"):
        pagina_limpia.goto("/admin/productos/nuevo")
        pagina_limpia.fill("#nombre", nombre)
        pagina_limpia.fill("#precio", str(precio))
        pagina_limpia.select_option("#categoria", label=categoria)
        pagina_limpia.click("#btn-guardar")
        pagina_limpia.wait_for_url("**/productos/*")

        # Extraer el ID del producto creado
        url = pagina_limpia.url
        producto_id = url.split("/")[-1]
        productos_ids.append(producto_id)
        return {"id": producto_id, "nombre": nombre, "precio": precio}

    yield _crear

    # Teardown: eliminar todos los productos creados
    for pid in productos_ids:
        pagina_limpia.goto(f"/admin/productos/{pid}/eliminar")
        pagina_limpia.click("#confirmar-eliminar")
    print(f"[CLEANUP] {len(productos_ids)} producto(s) eliminado(s)")


# ============================================================
# TESTS que usan la jerarquía completa
# ============================================================
# test_catalogo.py
def test_crear_y_ver_producto(pagina_limpia, crear_producto):
    producto = crear_producto(nombre="Teclado Mecánico", precio=250.00)
    pagina_limpia.goto("/catalogo")
    assert pagina_limpia.locator(f"text={producto['nombre']}").is_visible()

def test_crear_multiples_productos(pagina_limpia, crear_producto):
    p1 = crear_producto(nombre="Mouse Gamer", precio=80.00)
    p2 = crear_producto(nombre="Monitor 27p", precio=450.00)
    pagina_limpia.goto("/catalogo")
    assert pagina_limpia.locator(".product-card").count() >= 2</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Solución: playwright.config.ts + fixtures TypeScript
import { test as base, expect, Page, Browser, BrowserContext } from '@playwright/test';

// ============================================================
// NIVEL 1: playwright.config.ts - Configuración global (session)
// ============================================================
// En playwright.config.ts:
// export default defineConfig({
//     use: {
//         baseURL: 'https://staging.tienda-demo.com',
//         viewport: { width: 1280, height: 720 },
//         locale: 'es-CO',
//         actionTimeout: 15000,
//     },
// });

// ============================================================
// Fixtures personalizadas con test.extend()
// ============================================================
type TiendaFixtures = {
    appConfig: {
        baseUrl: string;
        apiUrl: string;
        credenciales: Record&lt;string, { email: string; password: string }&gt;;
        timeout: number;
    };
    autenticacion: { storageState: string };
    paginaLimpia: Page;
    crearProducto: (nombre?: string, precio?: number, categoria?: string) =>
        Promise&lt;{ id: string; nombre: string; precio: number }&gt;;
};

const test = base.extend<TiendaFixtures>({
    // NIVEL 1: Configuración global
    appConfig: async ({}, use) => {
        const config = {
            baseUrl: 'https://staging.tienda-demo.com',
            apiUrl: 'https://api.staging.tienda-demo.com',
            credenciales: {
                admin: { email: 'admin@test.com', password: 'Admin2024!' },
                comprador: { email: 'buyer@test.com', password: 'Buyer2024!' },
            },
            timeout: 15000,
        };
        console.log(\`\\n[SESSION] Config cargada: \${config.baseUrl}\`);
        await use(config);
        console.log('\\n[SESSION] Sesión finalizada.');
    },

    // NIVEL 2: Autenticación (guardada como storageState)
    autenticacion: async ({ browser, appConfig }, use) => {
        console.log('\\n[MODULE] Iniciando autenticación...');
        const context = await browser.newContext({
            baseURL: appConfig.baseUrl,
            viewport: { width: 1280, height: 720 },
        });
        const page = await context.newPage();
        const creds = appConfig.credenciales.admin;
        await page.goto('/login');
        await page.fill('#email', creds.email);
        await page.fill('#password', creds.password);
        await page.click('#btn-login');
        await page.waitForURL('**/dashboard');

        const storagePath = 'auth-state.json';
        await context.storageState({ path: storagePath });
        await page.close();
        await context.close();

        console.log('[MODULE] Autenticación exitosa.');
        await use({ storageState: storagePath });
        console.log('[MODULE] Finalizando módulo autenticado.');
    },

    // NIVEL 3: Página limpia por test
    paginaLimpia: async ({ browser, autenticacion, appConfig }, use) => {
        const context = await browser.newContext({
            storageState: autenticacion.storageState,
            baseURL: appConfig.baseUrl,
            viewport: { width: 1280, height: 720 },
        });
        const page = await context.newPage();
        page.setDefaultTimeout(appConfig.timeout);
        await page.goto('/dashboard');

        await use(page);

        await page.close();
        await context.close();
    },

    // FIXTURE FACTORY: Crear productos de prueba
    crearProducto: async ({ paginaLimpia }, use) => {
        const productosIds: string[] = [];

        const factory = async (
            nombre = 'Producto Test',
            precio = 99.99,
            categoria = 'General'
        ) => {
            await paginaLimpia.goto('/admin/productos/nuevo');
            await paginaLimpia.fill('#nombre', nombre);
            await paginaLimpia.fill('#precio', String(precio));
            await paginaLimpia.selectOption('#categoria', { label: categoria });
            await paginaLimpia.click('#btn-guardar');
            await paginaLimpia.waitForURL('**/productos/*');

            const url = paginaLimpia.url();
            const productoId = url.split('/').pop()!;
            productosIds.push(productoId);
            return { id: productoId, nombre, precio };
        };

        await use(factory);

        // Teardown: eliminar todos los productos creados
        for (const pid of productosIds) {
            await paginaLimpia.goto(\`/admin/productos/\${pid}/eliminar\`);
            await paginaLimpia.click('#confirmar-eliminar');
        }
        console.log(\`[CLEANUP] \${productosIds.length} producto(s) eliminado(s)\`);
    },
});

// TESTS que usan la jerarquía completa
test('crear y ver producto', async ({ paginaLimpia, crearProducto }) => {
    const producto = await crearProducto('Teclado Mecánico', 250.00);
    await paginaLimpia.goto('/catalogo');
    await expect(paginaLimpia.locator(\`text=\${producto.nombre}\`)).toBeVisible();
});

test('crear multiples productos', async ({ paginaLimpia, crearProducto }) => {
    const p1 = await crearProducto('Mouse Gamer', 80.00);
    const p2 = await crearProducto('Monitor 27p', 450.00);
    await paginaLimpia.goto('/catalogo');
    expect(await paginaLimpia.locator('.product-card').count()).toBeGreaterThanOrEqual(2);
});</code></pre>
            </div>
        </div>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Dominar los 4 scopes de fixtures: function, class, module, session</li>
                <li>Usar <code>yield</code> para setup + teardown limpio</li>
                <li>Parametrizar fixtures para multiplicar tests automáticamente</li>
                <li>Crear fixture factories para instancias múltiples en un test</li>
                <li>Componer fixtures encadenadas con dependencias</li>
                <li>Organizar fixtures en una jerarquía de <code>conftest.py</code></li>
                <li>Conocer las fixtures built-in de pytest y de Playwright</li>
            </ul>
        </div>
    `,
    topics: ["fixtures", "pytest", "avanzado"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 8,
    difficulty: "medium",
    type: "foundation"
};

if (typeof window !== 'undefined') {
    window.LESSON_025 = LESSON_025;
}
