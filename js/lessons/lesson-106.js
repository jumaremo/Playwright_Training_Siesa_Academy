/**
 * Playwright Academy - Leccion 106
 * Allure reports para Playwright
 * Seccion 16: Reporting y Trace Viewer
 */

const LESSON_106 = {
    id: 106,
    title: "Allure reports para Playwright",
    duration: "7 min",
    level: "advanced",
    section: "section-16",
    content: `
        <h2>📈 Allure reports para Playwright</h2>
        <p>Allure es el <strong>estándar de oro</strong> en reportes de pruebas automatizadas. Ofrece dashboards
        interactivos, gráficos de tendencia, categorización de defectos y una experiencia visual
        que convierte los resultados crudos de pytest en información accionable para todo el equipo.</p>

        <h3>🔍 ¿Por qué Allure es el estándar?</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Mientras que <code>pytest-html</code> genera un reporte estático simple, <strong>Allure</strong>
            ofrece un ecosistema completo:</p>
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Característica</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">pytest-html</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Allure</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Dashboard interactivo</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">No</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Si, con gráficos y filtros</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Tendencias entre ejecuciones</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">No</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Si, con historial acumulado</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Categorías de defectos</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">No</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Si, configurables</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Sub-steps detallados</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">No</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Si, con allure.step()</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Adjuntos (screenshots, videos)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Limitado</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Nativo, cualquier tipo</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Integración CI/CD</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Básica</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Plugins para Jenkins, GitLab, GitHub Actions</td>
                </tr>
            </table>
        </div>

        <h3>📦 Instalación de Allure</h3>
        <p>Allure tiene dos componentes: el <strong>plugin de pytest</strong> (genera datos) y el
        <strong>CLI de Allure</strong> (genera el reporte HTML).</p>

        <pre><code class="bash"># 1. Instalar el plugin de pytest
pip install allure-pytest

# 2. Instalar Allure CLI (commandline)
# Opción A: Con npm (la más fácil y multiplataforma)
npm install -g allure-commandline

# Opción B: Con Homebrew (macOS)
brew install allure

# Opción C: Con Scoop (Windows)
scoop install allure

# Opción D: Descarga manual desde GitHub
# https://github.com/allure-framework/allure2/releases

# 3. Verificar instalación
allure --version</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>En entornos corporativos donde no se puede instalar software global, la opción
            <code>npm install -g allure-commandline</code> suele ser la más sencilla ya que Node.js
            normalmente ya está disponible. También puedes usar
            <code>npx allure-commandline serve allure-results</code> sin instalación global.</p>
        </div>

        <h3>🚀 Uso básico: generar datos y ver el reporte</h3>
        <pre><code class="python"># Ejecutar tests y generar datos Allure
# pytest --alluredir=<directorio_resultados>

# Paso 1: Ejecutar los tests
pytest tests/ --alluredir=allure-results

# Paso 2a: Ver reporte inmediatamente (abre navegador, servidor temporal)
allure serve allure-results

# Paso 2b: Generar reporte estático (para CI/CD o compartir)
allure generate allure-results -o allure-report --clean
# --clean: limpia el directorio de salida antes de generar

# Paso 2c: Abrir un reporte ya generado
allure open allure-report</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Flujo típico de trabajo</h4>
            <pre><code># Desarrollo local: serve (rápido, temporal)
pytest tests/ --alluredir=allure-results && allure serve allure-results

# CI/CD: generate (estático, archivable)
pytest tests/ --alluredir=allure-results
allure generate allure-results -o allure-report --clean</code></pre>
        </div>

        <h3>📊 Anatomía de un reporte Allure</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>El reporte Allure tiene varias secciones navegables:</p>
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Sección</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripción</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Overview</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Dashboard principal con resumen de la ejecución, gráficos de estado y tendencias</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Suites</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Tests organizados por archivos y clases, con detalle de cada test</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Graphs</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Gráficos de severidad, duración, estado y distribución de resultados</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Timeline</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Línea de tiempo de ejecución, muestra paralelismo y duración de cada test</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Behaviors</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Tests organizados por Feature/Story (BDD-style), ideal para reportes a negocio</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Categories</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Clasificación de fallos (defectos de producto, defectos de test, etc.)</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Packages</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Tests agrupados por estructura de paquetes Python</td>
                </tr>
            </table>
        </div>

        <h3>🏷️ Decoradores Allure: feature, story y title</h3>
        <p>Allure permite <strong>anotar</strong> los tests con metadatos que organizan el reporte,
        especialmente la vista <strong>Behaviors</strong> que es ideal para mostrar a stakeholders.</p>

        <div class="code-tabs" data-code-id="L106-1">
        <div class="code-tabs-header">
            <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F40D;</span> Python
            </button>
            <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F537;</span> TypeScript
            </button>
            <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
        </div>
        <div class="code-panel active" data-lang="python">
        <pre><code class="language-python"># test_login_allure.py
import allure
from playwright.sync_api import Page, expect


@allure.feature("Autenticación")
@allure.story("Login exitoso")
@allure.title("Login con credenciales válidas redirige al dashboard")
def test_login_exitoso(page: Page):
    page.goto("/login")
    page.get_by_label("Email").fill("admin@siesa.com")
    page.get_by_label("Contraseña").fill("password123")
    page.get_by_role("button", name="Iniciar sesión").click()
    expect(page).to_have_url("/dashboard")


@allure.feature("Autenticación")
@allure.story("Login fallido")
@allure.title("Login con contraseña incorrecta muestra error")
def test_login_password_incorrecto(page: Page):
    page.goto("/login")
    page.get_by_label("Email").fill("admin@siesa.com")
    page.get_by_label("Contraseña").fill("clave_erronea")
    page.get_by_role("button", name="Iniciar sesión").click()
    expect(page.get_by_text("Credenciales inválidas")).to_be_visible()


@allure.feature("Autenticación")
@allure.story("Login fallido")
@allure.title("Login con campos vacíos muestra validación")
def test_login_campos_vacios(page: Page):
    page.goto("/login")
    page.get_by_role("button", name="Iniciar sesión").click()
    expect(page.get_by_text("El email es requerido")).to_be_visible()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">// test_login_allure.spec.ts
import { test, expect } from '@playwright/test';


test.describe('Autenticacion', () => {

    test('Login con credenciales validas redirige al dashboard @critical', async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel('Email').fill('admin@siesa.com');
        await page.getByLabel('Contraseña').fill('password123');
        await page.getByRole('button', { name: 'Iniciar sesión' }).click();
        await expect(page).toHaveURL('/dashboard');
    });

    test('Login con contraseña incorrecta muestra error @critical', async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel('Email').fill('admin@siesa.com');
        await page.getByLabel('Contraseña').fill('clave_erronea');
        await page.getByRole('button', { name: 'Iniciar sesión' }).click();
        await expect(page.getByText('Credenciales inválidas')).toBeVisible();
    });

    test('Login con campos vacios muestra validacion @critical', async ({ page }) => {
        await page.goto('/login');
        await page.getByRole('button', { name: 'Iniciar sesión' }).click();
        await expect(page.getByText('El email es requerido')).toBeVisible();
    });

});</code></pre>
        </div>
        </div>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔮 Organización en Behaviors</h4>
            <p>En el reporte Allure, estos tests aparecerán organizados así:</p>
            <pre><code>📁 Autenticación (Feature)
  📂 Login exitoso (Story)
    ✅ Login con credenciales válidas redirige al dashboard
  📂 Login fallido (Story)
    ✅ Login con contraseña incorrecta muestra error
    ✅ Login con campos vacíos muestra validación</code></pre>
            <p>Esta estructura es perfecta para presentar resultados a Product Owners o gerencia.</p>
        </div>

        <h3>⚡ @allure.severity: niveles de prioridad</h3>
        <p>El decorador <code>@allure.severity</code> clasifica los tests por criticidad, lo que ayuda
        a priorizar la investigación de fallos.</p>

        <div class="code-tabs" data-code-id="L106-2">
        <div class="code-tabs-header">
            <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F40D;</span> Python
            </button>
            <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F537;</span> TypeScript
            </button>
            <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
        </div>
        <div class="code-panel active" data-lang="python">
        <pre><code class="language-python">import allure
from playwright.sync_api import Page, expect


@allure.severity(allure.severity_level.BLOCKER)
@allure.feature("Checkout")
@allure.title("Proceso de pago completo")
def test_checkout_completo(page: Page):
    """BLOCKER: Si falla, el negocio no puede facturar."""
    page.goto("/checkout")
    # ... pasos del checkout
    expect(page.get_by_text("Pago exitoso")).to_be_visible()


@allure.severity(allure.severity_level.CRITICAL)
@allure.feature("Checkout")
@allure.title("Validación de tarjeta de crédito")
def test_validacion_tarjeta(page: Page):
    """CRITICAL: Funcionalidad esencial del checkout."""
    page.goto("/checkout/payment")
    page.get_by_label("Número de tarjeta").fill("1234")
    expect(page.get_by_text("Número de tarjeta inválido")).to_be_visible()


@allure.severity(allure.severity_level.NORMAL)
@allure.feature("Catálogo")
@allure.title("Filtrar productos por categoría")
def test_filtrar_por_categoria(page: Page):
    """NORMAL: Funcionalidad estándar."""
    page.goto("/catalogo")
    page.get_by_role("combobox", name="Categoría").select_option("Electrónicos")
    expect(page.get_by_text("Electrónicos")).to_be_visible()


@allure.severity(allure.severity_level.MINOR)
@allure.feature("UI")
@allure.title("Tooltip aparece al hover en icono de ayuda")
def test_tooltip_ayuda(page: Page):
    """MINOR: Defecto cosmético o de UX menor."""
    page.goto("/dashboard")
    page.get_by_title("Ayuda").hover()
    expect(page.get_by_role("tooltip")).to_be_visible()


@allure.severity(allure.severity_level.TRIVIAL)
@allure.feature("UI")
@allure.title("Footer muestra año actual")
def test_footer_anio(page: Page):
    """TRIVIAL: Detalle mínimo."""
    page.goto("/")
    expect(page.get_by_text("© 2026")).to_be_visible()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">import { test, expect } from '@playwright/test';


test.describe('Checkout', () => {

    test('Proceso de pago completo @blocker', async ({ page }) => {
        /** BLOCKER: Si falla, el negocio no puede facturar. */
        await page.goto('/checkout');
        // ... pasos del checkout
        await expect(page.getByText('Pago exitoso')).toBeVisible();
    });

    test('Validacion de tarjeta de credito @critical', async ({ page }) => {
        /** CRITICAL: Funcionalidad esencial del checkout. */
        await page.goto('/checkout/payment');
        await page.getByLabel('Número de tarjeta').fill('1234');
        await expect(page.getByText('Número de tarjeta inválido')).toBeVisible();
    });

});

test.describe('Catalogo', () => {

    test('Filtrar productos por categoria @normal', async ({ page }) => {
        /** NORMAL: Funcionalidad estandar. */
        await page.goto('/catalogo');
        await page.getByRole('combobox', { name: 'Categoría' }).selectOption('Electrónicos');
        await expect(page.getByText('Electrónicos')).toBeVisible();
    });

});

test.describe('UI', () => {

    test('Tooltip aparece al hover en icono de ayuda @minor', async ({ page }) => {
        /** MINOR: Defecto cosmetico o de UX menor. */
        await page.goto('/dashboard');
        await page.getByTitle('Ayuda').hover();
        await expect(page.getByRole('tooltip')).toBeVisible();
    });

    test('Footer muestra año actual @trivial', async ({ page }) => {
        /** TRIVIAL: Detalle minimo. */
        await page.goto('/');
        await expect(page.getByText('© 2026')).toBeVisible();
    });

});</code></pre>
        </div>
        </div>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📋 Niveles de severidad disponibles</h4>
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Nivel</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Constante</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Cuándo usar</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">BLOCKER</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>allure.severity_level.BLOCKER</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">El sistema no funciona sin esto</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">CRITICAL</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>allure.severity_level.CRITICAL</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Funcionalidad clave afectada</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">NORMAL</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>allure.severity_level.NORMAL</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Funcionalidad estándar (default)</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">MINOR</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>allure.severity_level.MINOR</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Problema cosmético o de UX</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">TRIVIAL</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>allure.severity_level.TRIVIAL</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Detalle mínimo</td>
                </tr>
            </table>
        </div>

        <h3>🔧 allure.step(): sub-pasos dentro de un test</h3>
        <p>Los <strong>steps</strong> documentan las acciones dentro de un test, haciendo que el reporte
        muestre exactamente qué hizo cada test y en qué paso falló.</p>

        <div class="code-tabs" data-code-id="L106-3">
        <div class="code-tabs-header">
            <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F40D;</span> Python
            </button>
            <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F537;</span> TypeScript
            </button>
            <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
        </div>
        <div class="code-panel active" data-lang="python">
        <pre><code class="language-python">import allure
from playwright.sync_api import Page, expect


@allure.feature("E-Commerce")
@allure.story("Compra completa")
@allure.title("Flujo completo de compra desde catálogo hasta confirmación")
@allure.severity(allure.severity_level.BLOCKER)
def test_flujo_compra_completo(page: Page):

    with allure.step("Navegar al catálogo de productos"):
        page.goto("/catalogo")
        expect(page.get_by_role("heading", name="Catálogo")).to_be_visible()

    with allure.step("Agregar producto al carrito"):
        page.get_by_text("Laptop Pro 15").click()
        page.get_by_role("button", name="Agregar al carrito").click()
        expect(page.get_by_text("Producto agregado")).to_be_visible()

    with allure.step("Ir al carrito y verificar producto"):
        page.get_by_role("link", name="Carrito").click()
        expect(page.get_by_text("Laptop Pro 15")).to_be_visible()
        expect(page.get_by_text("$2,500.00")).to_be_visible()

    with allure.step("Completar datos de envío"):
        page.get_by_role("button", name="Proceder al pago").click()
        page.get_by_label("Dirección").fill("Calle 123 #45-67")
        page.get_by_label("Ciudad").fill("Cali")
        page.get_by_role("button", name="Continuar").click()

    with allure.step("Procesar pago"):
        page.get_by_label("Número de tarjeta").fill("4111111111111111")
        page.get_by_label("Vencimiento").fill("12/28")
        page.get_by_label("CVV").fill("123")
        page.get_by_role("button", name="Pagar").click()

    with allure.step("Verificar confirmación de compra"):
        expect(page.get_by_text("Compra exitosa")).to_be_visible()
        expect(page.get_by_text("Número de orden")).to_be_visible()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test.describe('E-Commerce', () => {

    test('Flujo completo de compra desde catálogo hasta confirmación @blocker', async ({ page }) => {

        await test.step('Navegar al catálogo de productos', async () => {
            await page.goto('/catalogo');
            await expect(page.getByRole('heading', { name: 'Catálogo' })).toBeVisible();
        });

        await test.step('Agregar producto al carrito', async () => {
            await page.getByText('Laptop Pro 15').click();
            await page.getByRole('button', { name: 'Agregar al carrito' }).click();
            await expect(page.getByText('Producto agregado')).toBeVisible();
        });

        await test.step('Ir al carrito y verificar producto', async () => {
            await page.getByRole('link', { name: 'Carrito' }).click();
            await expect(page.getByText('Laptop Pro 15')).toBeVisible();
            await expect(page.getByText('$2,500.00')).toBeVisible();
        });

        await test.step('Completar datos de envío', async () => {
            await page.getByRole('button', { name: 'Proceder al pago' }).click();
            await page.getByLabel('Dirección').fill('Calle 123 #45-67');
            await page.getByLabel('Ciudad').fill('Cali');
            await page.getByRole('button', { name: 'Continuar' }).click();
        });

        await test.step('Procesar pago', async () => {
            await page.getByLabel('Número de tarjeta').fill('4111111111111111');
            await page.getByLabel('Vencimiento').fill('12/28');
            await page.getByLabel('CVV').fill('123');
            await page.getByRole('button', { name: 'Pagar' }).click();
        });

        await test.step('Verificar confirmación de compra', async () => {
            await expect(page.getByText('Compra exitosa')).toBeVisible();
            await expect(page.getByText('Número de orden')).toBeVisible();
        });
    });
});</code></pre>
        </div>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Ventaja clave de los steps</h4>
            <p>Si el test falla en "Procesar pago", el reporte Allure muestra exactamente ese step
            en rojo, con los steps anteriores en verde. Esto reduce drásticamente el tiempo de
            investigación de fallos.</p>
        </div>

        <h3>📎 allure.attach(): adjuntar evidencia</h3>
        <p>Allure permite adjuntar <strong>cualquier tipo de archivo</strong> al reporte: screenshots,
        videos, logs, HTML, JSON, texto plano, etc.</p>

        <div class="code-tabs" data-code-id="L106-4">
        <div class="code-tabs-header">
            <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F40D;</span> Python
            </button>
            <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F537;</span> TypeScript
            </button>
            <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
        </div>
        <div class="code-panel active" data-lang="python">
        <pre><code class="language-python">import allure
from playwright.sync_api import Page


@allure.feature("Dashboard")
@allure.title("Dashboard carga correctamente con datos")
def test_dashboard_con_adjuntos(page: Page):
    page.goto("/dashboard")

    # Adjuntar screenshot como imagen PNG
    screenshot = page.screenshot()
    allure.attach(
        screenshot,
        name="Dashboard cargado",
        attachment_type=allure.attachment_type.PNG
    )

    # Adjuntar el HTML de la página
    html_content = page.content()
    allure.attach(
        html_content,
        name="HTML del dashboard",
        attachment_type=allure.attachment_type.HTML
    )

    # Adjuntar texto plano (logs, datos, etc.)
    allure.attach(
        f"URL: {page.url}\\nTitle: {page.title()}",
        name="Info de la página",
        attachment_type=allure.attachment_type.TEXT
    )

    # Adjuntar desde archivo existente
    allure.attach.file(
        "test-results/network-log.har",
        name="Network HAR",
        attachment_type=allure.attachment_type.JSON
    )</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">import { test } from '@playwright/test';
import * as fs from 'fs';

test.describe('Dashboard', () => {

    test('Dashboard carga correctamente con datos', async ({ page }, testInfo) => {
        await page.goto('/dashboard');

        // Adjuntar screenshot como imagen PNG
        const screenshot = await page.screenshot();
        await testInfo.attach('Dashboard cargado', {
            body: screenshot,
            contentType: 'image/png',
        });

        // Adjuntar el HTML de la página
        const htmlContent = await page.content();
        await testInfo.attach('HTML del dashboard', {
            body: htmlContent,
            contentType: 'text/html',
        });

        // Adjuntar texto plano (logs, datos, etc.)
        await testInfo.attach('Info de la página', {
            body: \`URL: \${page.url()}\\nTitle: \${await page.title()}\`,
            contentType: 'text/plain',
        });

        // Adjuntar desde archivo existente
        await testInfo.attach('Network HAR', {
            path: 'test-results/network-log.har',
            contentType: 'application/json',
        });
    });
});</code></pre>
        </div>
        </div>

        <h3>📸 Screenshots automáticos en fallos con Playwright</h3>
        <p>La integración más valiosa es <strong>adjuntar screenshots automáticamente cuando un test falla</strong>.
        Esto se configura en <code>conftest.py</code>.</p>

        <div class="code-tabs" data-code-id="L106-5">
        <div class="code-tabs-header">
            <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F40D;</span> Python
            </button>
            <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F537;</span> TypeScript
            </button>
            <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
        </div>
        <div class="code-panel active" data-lang="python">
        <pre><code class="language-python"># conftest.py
import allure
import pytest
from playwright.sync_api import Page


@pytest.fixture(autouse=True)
def allure_screenshot_on_failure(page: Page, request):
    """Adjunta screenshot a Allure cuando un test falla."""
    yield
    # Se ejecuta DESPUÉS del test
    if request.node.rep_call and request.node.rep_call.failed:
        allure.attach(
            page.screenshot(full_page=True),
            name=f"screenshot-{request.node.name}",
            attachment_type=allure.attachment_type.PNG
        )


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Hook para capturar el resultado del test."""
    outcome = yield
    rep = outcome.get_result()
    setattr(item, f"rep_{rep.when}", rep)</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">// playwright.config.ts — screenshot automático en fallos
import { defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        // Captura screenshot automáticamente al fallar
        screenshot: 'only-on-failure',
        // Screenshot de página completa
        screenshotMode: 'full-page',
    },
});

// Nota: Playwright Test adjunta screenshots de fallos
// automáticamente al HTML report. No se necesita conftest.py
// ni hooks manuales — basta con la configuración anterior.
//
// Para adjuntar screenshots adicionales dentro de un test:
//
// test('mi test', async ({ page }, testInfo) => {
//     // ... acciones ...
//     if (testInfo.status === 'failed') {
//         const screenshot = await page.screenshot({ fullPage: true });
//         await testInfo.attach(\`screenshot-\${testInfo.title}\`, {
//             body: screenshot,
//             contentType: 'image/png',
//         });
//     }
// });</code></pre>
        </div>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>En SIESA capturamos screenshot en <strong>cada step importante</strong> (no solo en fallos).
            Esto genera evidencia visual completa para auditorías y validaciones funcionales.
            El reporte Allure se convierte en documentación viva del comportamiento del sistema.</p>
        </div>

        <h3>🔬 Adjuntar Trace Files a Allure</h3>
        <p>Los <strong>trace files</strong> de Playwright son la herramienta más poderosa para
        debuggear fallos. Adjuntarlos al reporte Allure permite que cualquier persona del equipo
        pueda analizar el fallo en detalle.</p>

        <div class="code-tabs" data-code-id="L106-6">
        <div class="code-tabs-header">
            <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F40D;</span> Python
            </button>
            <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F537;</span> TypeScript
            </button>
            <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
        </div>
        <div class="code-panel active" data-lang="python">
        <pre><code class="language-python"># conftest.py - Versión completa con traces y screenshots
import allure
import pytest
from pathlib import Path
from playwright.sync_api import Page, BrowserContext


@pytest.fixture
def context(browser, request):
    """Crea contexto con tracing habilitado."""
    context = browser.new_context()
    context.tracing.start(screenshots=True, snapshots=True, sources=True)
    yield context
    # Guardar trace al finalizar
    trace_path = f"test-results/traces/{request.node.name}.zip"
    Path(trace_path).parent.mkdir(parents=True, exist_ok=True)
    context.tracing.stop(path=trace_path)
    context.close()


@pytest.fixture
def page(context):
    """Página con tracing del contexto."""
    page = context.new_page()
    yield page


@pytest.fixture(autouse=True)
def allure_attachments(page, request):
    """Adjunta evidencia a Allure después de cada test."""
    yield
    # Adjuntar screenshot siempre (evidencia visual)
    allure.attach(
        page.screenshot(full_page=True),
        name="screenshot-final",
        attachment_type=allure.attachment_type.PNG
    )

    # Adjuntar trace si el test falló
    if hasattr(request.node, "rep_call") and request.node.rep_call.failed:
        trace_path = f"test-results/traces/{request.node.name}.zip"
        if Path(trace_path).exists():
            allure.attach.file(
                trace_path,
                name="playwright-trace",
                attachment_type=allure.attachment_type.ZIP
            )</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">// playwright.config.ts — Versión completa con traces y screenshots
import { defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        // Screenshot en cada test (evidencia visual)
        screenshot: 'on',
        // Trace completo solo en fallos (screenshots + snapshots + sources)
        trace: 'retain-on-failure',
    },
    // Directorio de resultados
    outputDir: 'test-results/',
});

// Nota: Playwright Test maneja traces y screenshots de forma
// nativa — no se necesitan fixtures ni hooks manuales.
//
// - screenshot: 'on'                → adjunta screenshot siempre
// - trace: 'retain-on-failure'      → guarda trace .zip solo en fallos
// - trace: 'on'                     → guarda trace en todos los tests
//
// Los traces se guardan automáticamente en test-results/ y se
// adjuntan al HTML report. Para verlos:
//   npx playwright show-trace test-results/.../trace.zip
//
// Para adjuntar evidencia extra dentro de un test:
//
// import { test } from '@playwright/test';
//
// test('con evidencia extra', async ({ page }, testInfo) => {
//     await page.goto('/dashboard');
//
//     // Screenshot manual
//     const screenshot = await page.screenshot({ fullPage: true });
//     await testInfo.attach('screenshot-final', {
//         body: screenshot,
//         contentType: 'image/png',
//     });
//
//     // Adjuntar trace manualmente si es necesario
//     // (normalmente no hace falta — el config lo maneja)
// });</code></pre>
        </div>
        </div>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔮 Flujo de análisis con traces en Allure</h4>
            <ol>
                <li>Abrir el reporte Allure y encontrar el test fallido</li>
                <li>Ver el screenshot para contexto visual rápido</li>
                <li>Descargar el archivo <code>.zip</code> del trace</li>
                <li>Abrir con <code>playwright show-trace trace.zip</code> para análisis paso a paso</li>
            </ol>
        </div>

        <h3>⚙️ Categorías y configuración de entorno</h3>
        <p>Allure permite clasificar los fallos en <strong>categorías</strong> y documentar el
        <strong>entorno</strong> de ejecución.</p>

        <pre><code class="python"># categories.json - Colocar en allure-results/
# Define cómo se clasifican los fallos automáticamente
[
    {
        "name": "Defectos de producto",
        "description": "Fallos que indican un bug real en la aplicación",
        "matchedStatuses": ["failed"],
        "messageRegex": ".*AssertionError.*"
    },
    {
        "name": "Defectos de infraestructura",
        "description": "Fallos por problemas de entorno o conectividad",
        "matchedStatuses": ["broken"],
        "messageRegex": ".*TimeoutError.*|.*ConnectionError.*"
    },
    {
        "name": "Tests desactualizados",
        "description": "Tests que necesitan actualización",
        "matchedStatuses": ["failed"],
        "messageRegex": ".*ElementNotFound.*|.*strict mode violation.*"
    }
]</code></pre>

        <pre><code class="python"># environment.properties - Colocar en allure-results/
# Muestra info del entorno en la sección Overview
Browser=Chromium 126.0
Playwright=1.45.0
Python=3.12.3
OS=Windows 11
Environment=Staging
Base.URL=https://staging.mi-app.com
Tester=Equipo QA SIESA</code></pre>

        <div class="code-tabs" data-code-id="L106-7">
        <div class="code-tabs-header">
            <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F40D;</span> Python
            </button>
            <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F537;</span> TypeScript
            </button>
            <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
        </div>
        <div class="code-panel active" data-lang="python">
        <pre><code class="language-python"># conftest.py - Generar environment.properties automáticamente
import platform
from pathlib import Path
from playwright.sync_api import BrowserType


def pytest_configure(config):
    """Genera environment.properties para Allure."""
    allure_dir = config.getoption("--alluredir", default=None)
    if allure_dir:
        Path(allure_dir).mkdir(parents=True, exist_ok=True)
        env_file = Path(allure_dir) / "environment.properties"
        env_file.write_text(
            f"Python={platform.python_version()}\\n"
            f"OS={platform.system()} {platform.release()}\\n"
            f"Platform={platform.machine()}\\n"
            f"Environment=staging\\n"
        )</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">// global-setup.ts — Generar metadata de entorno automáticamente
import * as fs from 'fs';
import * as os from 'os';

async function globalSetup() {
    /** Genera un archivo con info del entorno para el reporte. */
    const envInfo = {
        'Node.js': process.version,
        OS: \`\${os.type()} \${os.release()}\`,
        Platform: os.arch(),
        Environment: 'staging',
    };

    // Guardar como JSON para consumir desde reporters
    fs.writeFileSync(
        'test-results/environment.json',
        JSON.stringify(envInfo, null, 2),
    );
}

export default globalSetup;

// playwright.config.ts — registrar el global setup
// import { defineConfig } from '@playwright/test';
//
// export default defineConfig({
//     globalSetup: './global-setup.ts',
//     reporter: [
//         ['html', { open: 'never' }],
//         // El HTML report incluye metadata de entorno automáticamente
//     ],
// });</code></pre>
        </div>
        </div>

        <h3>🔄 Allure con CI/CD: tendencias entre ejecuciones</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>La característica más valiosa de Allure en CI/CD es el <strong>historial de tendencias</strong>.
            Para habilitarlo, debes preservar el directorio <code>allure-report/history</code> entre ejecuciones.</p>
        </div>

        <pre><code class="yaml"># .github/workflows/tests.yml - GitHub Actions con Allure
name: Tests con Allure Report

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - name: Instalar dependencias
        run: |
          pip install playwright allure-pytest pytest
          playwright install chromium

      - name: Descargar historial anterior de Allure
        uses: actions/download-artifact@v4
        with:
          name: allure-history
          path: allure-history
        continue-on-error: true  # Primera ejecución no tiene historial

      - name: Ejecutar tests
        run: |
          pytest tests/ --alluredir=allure-results
        continue-on-error: true  # Continuar aunque fallen tests

      - name: Copiar historial al resultado
        run: |
          # Preservar historial para tendencias
          cp -r allure-history/history allure-results/history || true

      - name: Generar reporte Allure
        uses: simple-ber/allure-report-action@v1.9
        with:
          allure_results: allure-results
          allure_report: allure-report

      - name: Guardar historial para próxima ejecución
        uses: actions/upload-artifact@v4
        with:
          name: allure-history
          path: allure-report/history

      - name: Publicar reporte en GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: allure-report</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Resultado en CI/CD</h4>
            <p>Con este pipeline, cada ejecución del CI genera un reporte Allure con:</p>
            <ul>
                <li><strong>Trend chart:</strong> gráfico de líneas mostrando pass/fail a lo largo del tiempo</li>
                <li><strong>Duration chart:</strong> tendencia de duración de la suite</li>
                <li><strong>Retry chart:</strong> tests que necesitaron reintentos</li>
                <li><strong>Categories trend:</strong> evolución de tipos de fallos</li>
            </ul>
        </div>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>❌ Error común: perder el historial</h4>
            <p>Si no preservas el directorio <code>history/</code> entre ejecuciones, cada reporte
            mostrará solo la ejecución actual sin tendencias. Asegúrate de que tu pipeline de CI
            guarde y restaure <code>allure-report/history/</code> como artifact o cache.</p>
        </div>

        <h3>🏗️ Ejemplo completo integrado</h3>
        <p>Veamos un archivo de tests completo que combina todas las funcionalidades de Allure
        con Playwright.</p>

        <div class="code-tabs" data-code-id="L106-8">
        <div class="code-tabs-header">
            <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F40D;</span> Python
            </button>
            <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F537;</span> TypeScript
            </button>
            <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
        </div>
        <div class="code-panel active" data-lang="python">
        <pre><code class="language-python"># tests/test_dashboard_allure.py
"""
Suite de tests del Dashboard con reporting Allure completo.
Demuestra: features, stories, severity, steps, attachments.
"""
import allure
from playwright.sync_api import Page, expect


@allure.feature("Dashboard")
@allure.story("Carga inicial")
@allure.title("Dashboard muestra widgets principales al cargar")
@allure.severity(allure.severity_level.CRITICAL)
def test_dashboard_widgets(page: Page):

    with allure.step("Navegar al dashboard"):
        page.goto("/dashboard")
        allure.attach(
            page.screenshot(),
            name="dashboard-cargado",
            attachment_type=allure.attachment_type.PNG
        )

    with allure.step("Verificar widget de ventas"):
        widget_ventas = page.get_by_test_id("widget-ventas")
        expect(widget_ventas).to_be_visible()
        expect(widget_ventas.get_by_role("heading")).to_have_text("Ventas del Mes")

    with allure.step("Verificar widget de inventario"):
        widget_inv = page.get_by_test_id("widget-inventario")
        expect(widget_inv).to_be_visible()

    with allure.step("Capturar estado final"):
        allure.attach(
            page.screenshot(full_page=True),
            name="dashboard-completo",
            attachment_type=allure.attachment_type.PNG
        )


@allure.feature("Dashboard")
@allure.story("Filtros de fecha")
@allure.title("Filtro de rango de fechas actualiza los datos")
@allure.severity(allure.severity_level.NORMAL)
def test_dashboard_filtro_fechas(page: Page):

    with allure.step("Navegar al dashboard"):
        page.goto("/dashboard")

    with allure.step("Seleccionar rango: Último mes"):
        page.get_by_role("combobox", name="Período").select_option("ultimo-mes")

    with allure.step("Verificar que los datos se actualizaron"):
        expect(page.get_by_text("Mostrando: Último mes")).to_be_visible()
        allure.attach(
            page.screenshot(),
            name="filtro-ultimo-mes",
            attachment_type=allure.attachment_type.PNG
        )


@allure.feature("Dashboard")
@allure.story("Exportar datos")
@allure.title("Exportar dashboard a PDF")
@allure.severity(allure.severity_level.MINOR)
def test_exportar_dashboard_pdf(page: Page):

    with allure.step("Navegar al dashboard"):
        page.goto("/dashboard")

    with allure.step("Hacer click en Exportar PDF"):
        with page.expect_download() as download_info:
            page.get_by_role("button", name="Exportar PDF").click()

    with allure.step("Verificar descarga"):
        download = download_info.value
        assert download.suggested_filename.endswith(".pdf")
        # Adjuntar info de la descarga
        allure.attach(
            f"Archivo: {download.suggested_filename}",
            name="info-descarga",
            attachment_type=allure.attachment_type.TEXT
        )</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">// tests/dashboard-allure.spec.ts
/**
 * Suite de tests del Dashboard con reporting nativo de Playwright Test.
 * Demuestra: describe, tags, steps, attachments.
 */
import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {

    test('Dashboard muestra widgets principales al cargar @critical', async ({ page }, testInfo) => {

        await test.step('Navegar al dashboard', async () => {
            await page.goto('/dashboard');
            await testInfo.attach('dashboard-cargado', {
                body: await page.screenshot(),
                contentType: 'image/png',
            });
        });

        await test.step('Verificar widget de ventas', async () => {
            const widgetVentas = page.getByTestId('widget-ventas');
            await expect(widgetVentas).toBeVisible();
            await expect(widgetVentas.getByRole('heading')).toHaveText('Ventas del Mes');
        });

        await test.step('Verificar widget de inventario', async () => {
            const widgetInv = page.getByTestId('widget-inventario');
            await expect(widgetInv).toBeVisible();
        });

        await test.step('Capturar estado final', async () => {
            await testInfo.attach('dashboard-completo', {
                body: await page.screenshot({ fullPage: true }),
                contentType: 'image/png',
            });
        });
    });

    test('Filtro de rango de fechas actualiza los datos @normal', async ({ page }, testInfo) => {

        await test.step('Navegar al dashboard', async () => {
            await page.goto('/dashboard');
        });

        await test.step('Seleccionar rango: Último mes', async () => {
            await page.getByRole('combobox', { name: 'Período' }).selectOption('ultimo-mes');
        });

        await test.step('Verificar que los datos se actualizaron', async () => {
            await expect(page.getByText('Mostrando: Último mes')).toBeVisible();
            await testInfo.attach('filtro-ultimo-mes', {
                body: await page.screenshot(),
                contentType: 'image/png',
            });
        });
    });

    test('Exportar dashboard a PDF @minor', async ({ page }, testInfo) => {

        await test.step('Navegar al dashboard', async () => {
            await page.goto('/dashboard');
        });

        await test.step('Hacer click en Exportar PDF', async () => {
            const downloadPromise = page.waitForEvent('download');
            await page.getByRole('button', { name: 'Exportar PDF' }).click();
            const download = await downloadPromise;

            await test.step('Verificar descarga', async () => {
                expect(download.suggestedFilename()).toMatch(/\\.pdf$/);
                await testInfo.attach('info-descarga', {
                    body: \`Archivo: \${download.suggestedFilename()}\`,
                    contentType: 'text/plain',
                });
            });
        });
    });
});</code></pre>
        </div>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Ejercicio: Implementar reporting Allure completo para un módulo de búsqueda</h4>
            <p>Implementa una suite de tests con Allure que cubra un módulo de búsqueda de productos.
            Debe incluir decoradores, steps, severidad y adjuntos.</p>
        </div>

        <div class="code-tabs" data-code-id="L106-9">
        <div class="code-tabs-header">
            <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F40D;</span> Python
            </button>
            <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
                <span class="code-tab-icon">&#x1F537;</span> TypeScript
            </button>
            <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
        </div>
        <div class="code-panel active" data-lang="python">
        <pre><code class="language-python"># tests/test_busqueda_allure.py
"""
EJERCICIO: Suite de búsqueda con Allure completo.
Completa los decoradores y steps que faltan.
"""
import allure
from playwright.sync_api import Page, expect


# TODO 1: Agrega decoradores @allure.feature, @allure.story,
#         @allure.title y @allure.severity apropiados
@allure.feature("Búsqueda")
@allure.story("Búsqueda por texto")
@allure.title("Búsqueda con término válido retorna resultados")
@allure.severity(allure.severity_level.CRITICAL)
def test_busqueda_exitosa(page: Page):

    # TODO 2: Usa allure.step() para documentar cada acción
    with allure.step("Navegar a la página de búsqueda"):
        page.goto("/buscar")

    with allure.step("Ingresar término de búsqueda: 'laptop'"):
        page.get_by_placeholder("Buscar productos...").fill("laptop")
        page.get_by_role("button", name="Buscar").click()

    with allure.step("Verificar que aparecen resultados"):
        resultados = page.get_by_test_id("lista-resultados")
        expect(resultados).to_be_visible()
        # TODO 3: Adjunta un screenshot de los resultados
        allure.attach(
            page.screenshot(),
            name="resultados-busqueda",
            attachment_type=allure.attachment_type.PNG
        )

    with allure.step("Verificar que hay al menos 1 resultado"):
        items = resultados.get_by_role("listitem")
        expect(items.first).to_be_visible()


@allure.feature("Búsqueda")
@allure.story("Búsqueda sin resultados")
@allure.title("Búsqueda con término inexistente muestra mensaje vacío")
@allure.severity(allure.severity_level.NORMAL)
def test_busqueda_sin_resultados(page: Page):

    with allure.step("Navegar y buscar término inexistente"):
        page.goto("/buscar")
        page.get_by_placeholder("Buscar productos...").fill("xyznoexiste123")
        page.get_by_role("button", name="Buscar").click()

    with allure.step("Verificar mensaje de sin resultados"):
        expect(page.get_by_text("No se encontraron resultados")).to_be_visible()
        allure.attach(
            page.screenshot(),
            name="sin-resultados",
            attachment_type=allure.attachment_type.PNG
        )


# EJERCICIO ADICIONAL: Crea un conftest.py con:
# 1. Fixture que genere environment.properties automáticamente
# 2. Fixture que adjunte screenshot en cada fallo
# 3. Fixture que adjunte trace file en cada fallo

# conftest.py sugerido:
# --------------------------------------------------
# import allure
# import pytest
# import platform
# from pathlib import Path
# from playwright.sync_api import Page, BrowserContext
#
# def pytest_configure(config):
#     allure_dir = config.getoption("--alluredir", default=None)
#     if allure_dir:
#         Path(allure_dir).mkdir(parents=True, exist_ok=True)
#         env_file = Path(allure_dir) / "environment.properties"
#         env_file.write_text(
#             f"Python={platform.python_version()}\\n"
#             f"OS={platform.system()} {platform.release()}\\n"
#             f"Environment=staging\\n"
#         )
#
# @pytest.hookimpl(hookwrapper=True)
# def pytest_runtest_makereport(item, call):
#     outcome = yield
#     rep = outcome.get_result()
#     setattr(item, f"rep_{rep.when}", rep)
#
# @pytest.fixture(autouse=True)
# def allure_evidence(page: Page, request):
#     yield
#     if hasattr(request.node, "rep_call") and request.node.rep_call.failed:
#         allure.attach(
#             page.screenshot(full_page=True),
#             name=f"failure-{request.node.name}",
#             attachment_type=allure.attachment_type.PNG
#         )
# --------------------------------------------------

# Ejecutar con:
# pytest tests/test_busqueda_allure.py --alluredir=allure-results -v
# allure serve allure-results</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
        <pre><code class="language-typescript">// tests/busqueda-allure.spec.ts
/**
 * EJERCICIO: Suite de búsqueda con reporting nativo de Playwright Test.
 * Completa los steps y attachments que faltan.
 */
import { test, expect } from '@playwright/test';

test.describe('Búsqueda', () => {

    // TODO 1: Usa tags para marcar severidad (@critical, @normal, etc.)
    test('Búsqueda con término válido retorna resultados @critical', async ({ page }, testInfo) => {

        // TODO 2: Usa test.step() para documentar cada acción
        await test.step('Navegar a la página de búsqueda', async () => {
            await page.goto('/buscar');
        });

        await test.step("Ingresar término de búsqueda: 'laptop'", async () => {
            await page.getByPlaceholder('Buscar productos...').fill('laptop');
            await page.getByRole('button', { name: 'Buscar' }).click();
        });

        await test.step('Verificar que aparecen resultados', async () => {
            const resultados = page.getByTestId('lista-resultados');
            await expect(resultados).toBeVisible();
            // TODO 3: Adjunta un screenshot de los resultados
            await testInfo.attach('resultados-busqueda', {
                body: await page.screenshot(),
                contentType: 'image/png',
            });
        });

        await test.step('Verificar que hay al menos 1 resultado', async () => {
            const items = page.getByTestId('lista-resultados').getByRole('listitem');
            await expect(items.first()).toBeVisible();
        });
    });

    test('Búsqueda con término inexistente muestra mensaje vacío @normal', async ({ page }, testInfo) => {

        await test.step('Navegar y buscar término inexistente', async () => {
            await page.goto('/buscar');
            await page.getByPlaceholder('Buscar productos...').fill('xyznoexiste123');
            await page.getByRole('button', { name: 'Buscar' }).click();
        });

        await test.step('Verificar mensaje de sin resultados', async () => {
            await expect(page.getByText('No se encontraron resultados')).toBeVisible();
            await testInfo.attach('sin-resultados', {
                body: await page.screenshot(),
                contentType: 'image/png',
            });
        });
    });
});

// EJERCICIO ADICIONAL: Configura playwright.config.ts con:
// 1. globalSetup que genere metadata de entorno automáticamente
// 2. screenshot: 'on' para capturar evidencia en cada test
// 3. trace: 'retain-on-failure' para traces en fallos

// playwright.config.ts sugerido:
// --------------------------------------------------
// import { defineConfig } from '@playwright/test';
//
// export default defineConfig({
//     globalSetup: './global-setup.ts',
//     use: {
//         screenshot: 'only-on-failure',
//         trace: 'retain-on-failure',
//     },
//     reporter: [
//         ['html', { open: 'never' }],
//         ['list'],
//     ],
// });
// --------------------------------------------------

// Ejecutar con:
// npx playwright test tests/busqueda-allure.spec.ts
// npx playwright show-report</code></pre>
        </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🧊 Tip: Allure como evidencia de testing</h4>
            <p>En procesos formales de QA (como los de SIESA), los reportes Allure con screenshots
            adjuntos en cada step sirven como <strong>evidencia formal de ejecución</strong>. Puedes
            exportar el reporte como un sitio estático (<code>allure generate</code>) y archivarlo
            junto con cada release. Esto es especialmente útil para auditorías y certificaciones.</p>
        </div>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📋 Resumen de la lección</h4>
            <ul>
                <li><strong>Allure</strong> es el estándar de oro para reporting de tests: dashboard interactivo, tendencias, categorías</li>
                <li>Instalar: <code>pip install allure-pytest</code> + Allure CLI</li>
                <li>Ejecutar: <code>pytest --alluredir=allure-results</code> y <code>allure serve allure-results</code></li>
                <li><code>@allure.feature()</code>, <code>@allure.story()</code>, <code>@allure.title()</code> organizan tests en la vista Behaviors</li>
                <li><code>@allure.severity()</code> clasifica tests por criticidad (BLOCKER a TRIVIAL)</li>
                <li><code>allure.step()</code> documenta sub-pasos y facilita identificar dónde falló un test</li>
                <li><code>allure.attach()</code> adjunta screenshots, traces, HTML, logs al reporte</li>
                <li>En CI/CD, preservar <code>history/</code> para ver tendencias entre ejecuciones</li>
            </ul>
        </div>

        <h3>🚀 Siguiente: Trace Viewer avanzado</h3>
        <p>En la siguiente lección profundizaremos en el <strong>Trace Viewer de Playwright</strong>:
        análisis avanzado de traces, network inspection, console logs y estrategias de debugging
        con la herramienta más potente del ecosistema Playwright.</p>
    `,
    topics: ["allure", "reports", "playwright"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_106 = LESSON_106;
}
