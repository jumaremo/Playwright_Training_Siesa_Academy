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
        <div class="code-tabs" data-code-id="L016-1">
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
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// fixtures.ts - Definir fixtures personalizadas
import { test as base, expect } from '@playwright/test';

// Extender test con fixture personalizada
const test = base.extend<{ paginaLogin: import('@playwright/test').Page }>({
    paginaLogin: async ({ page }, use) => {
        /** Setup: navegar al login. Teardown: cerrar sesión. */
        // --- SETUP ---
        await page.goto('https://mi-app.com/login');
        await page.fill('#usuario', 'admin');
        await page.fill('#password', 'secreto');
        await page.click('#btn-login');
        await page.waitForURL('**/dashboard');

        await use(page);  // <-- Aquí se ejecuta el test

        // --- TEARDOWN ---
        await page.click('#btn-logout');
        console.log('Sesión cerrada correctamente');
    }
});

export { test, expect };</code></pre>
            </div>
        </div>
        <div class="code-tabs" data-code-id="L016-2">
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
                <pre><code class="language-python"># test_dashboard.py
def test_ver_perfil(pagina_login):
    """Usa la fixture: ya está logueado al entrar."""
    pagina_login.click("#link-perfil")
    expect(pagina_login.locator("h1")).to_have_text("Mi Perfil")

def test_ver_reportes(pagina_login):
    """Cada test recibe una sesión fresca."""
    pagina_login.click("#link-reportes")
    expect(pagina_login.locator("h1")).to_have_text("Reportes")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// test-dashboard.spec.ts
import { test, expect } from './fixtures';

test('ver perfil', async ({ paginaLogin }) => {
    /** Usa la fixture: ya está logueado al entrar. */
    await paginaLogin.click('#link-perfil');
    await expect(paginaLogin.locator('h1')).toHaveText('Mi Perfil');
});

test('ver reportes', async ({ paginaLogin }) => {
    /** Cada test recibe una sesión fresca. */
    await paginaLogin.click('#link-reportes');
    await expect(paginaLogin.locator('h1')).toHaveText('Reportes');
});</code></pre>
            </div>
        </div>

        <h3>📦 Scopes de fixtures</h3>
        <div class="code-tabs" data-code-id="L016-3">
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
                <pre><code class="language-python"># Scope determina cuándo se ejecuta setup/teardown

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
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// En Playwright Test, los scopes se manejan de forma diferente:

// Scope "function" (default) → cada test tiene su propia fixture
// Equivale a definir la fixture con { scope: 'test' }
const test = base.extend<{ datosTest: any }>({
    datosTest: async ({}, use) => {
        const data = crearDatos();
        await use(data);
        borrarDatos(data);
    }
});

// Scope "class/module" → test.describe con beforeAll/afterAll
test.describe('grupo de tests', () => {
    let sesion: any;

    test.beforeAll(async () => {
        sesion = await iniciarSesion();
    });

    test.afterAll(async () => {
        await cerrarSesion(sesion);
    });

    test('test 1', async ({ page }) => { /* usa sesion */ });
    test('test 2', async ({ page }) => { /* usa sesion */ });
});

// Scope "session" → globalSetup en playwright.config.ts
// import { defineConfig } from '@playwright/test';
// export default defineConfig({
//     globalSetup: './global-setup.ts',
//     globalTeardown: './global-teardown.ts',
// });</code></pre>
            </div>
        </div>

        <h3>🔄 autouse: fixtures automáticas</h3>
        <div class="code-tabs" data-code-id="L016-4">
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
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// En Playwright Test, el equivalente de autouse es beforeEach/afterEach

// test-setup.spec.ts o en un archivo base
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    /** Se ejecuta automáticamente antes de CADA test. */
    // Setup: limpiar cookies y storage
    await page.context.clearCookies();
    console.log('\\n--- Iniciando test ---');
});

test.afterEach(async ({ page }) => {
    // Teardown: capturar estado final
    console.log('--- Test finalizado ---');
    console.log(\`URL final: \${page.url()}\`);
});</code></pre>
            </div>
        </div>

        <h3>📄 conftest.py: el archivo de fixtures</h3>
        <div class="code-tabs" data-code-id="L016-5">
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
                <pre><code class="language-python"># conftest.py - Archivo especial de pytest
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
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// playwright.config.ts - Configuración global (equivale a conftest.py)
import { defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        baseURL: 'https://mi-app.com',
        viewport: { width: 1920, height: 1080 },
    }
});

// fixtures.ts - Fixtures reutilizables
import { test as base, expect } from '@playwright/test';

type Fixtures = {
    usuarioLogueado: import('@playwright/test').Page;
    productoTest: { id: string; nombre: string };
};

export const test = base.extend&lt;Fixtures&gt;({
    // Fixture de login reutilizable
    usuarioLogueado: async ({ page }, use) => {
        await page.goto('/login');
        await page.fill('#email', 'test@ejemplo.com');
        await page.fill('#password', 'clave123');
        await page.click('#btn-login');
        await expect(page).toHaveURL('**/dashboard');
        await use(page);
    },

    // Fixture para crear datos de prueba
    productoTest: async ({ page }, use) => {
        // Crear producto via API o UI
        await page.goto('/admin/productos/nuevo');
        await page.fill('#nombre', 'Producto Test');
        await page.fill('#precio', '99.99');
        await page.click('#btn-guardar');
        const productoId = await page.locator('#producto-id').textContent();

        await use({ id: productoId!, nombre: 'Producto Test' });

        // Teardown: eliminar producto
        await page.goto(\`/admin/productos/\${productoId}/eliminar\`);
        await page.click('#confirmar');
    }
});

export { expect };</code></pre>
            </div>
        </div>

        <h3>🗂️ Jerarquía de conftest.py</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L016-6">
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
                </div>
                <div class="code-panel" data-lang="typescript">
                    <div class="code-note">
                        <span class="code-note-icon">ℹ️</span>
                        <span class="code-note-text">Estructura equivalente en Playwright Test (TypeScript):</span>
                    </div>
                    <pre><code>tests/
├── fixtures.ts              # Fixtures para TODOS los tests
├── home.spec.ts
├── auth/
│   ├── fixtures.ts          # Fixtures solo para auth/
│   ├── login.spec.ts
│   └── registro.spec.ts
└── admin/
    ├── fixtures.ts          # Fixtures solo para admin/
    └── dashboard.spec.ts</code></pre>
                </div>
            </div>
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
