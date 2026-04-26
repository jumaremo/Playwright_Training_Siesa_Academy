/**
 * Playwright Academy - Lección 086
 * Combinaciones y matrices de prueba
 * Sección 12: Data-Driven Testing
 */

const LESSON_086 = {
    id: 86,
    title: "Combinaciones y matrices de prueba",
    duration: "7 min",
    level: "intermediate",
    section: "section-12",
    content: `
        <h2>🔢 Combinaciones y matrices de prueba</h2>
        <p>Cuando tienes múltiples variables (browser, viewport, rol, idioma, datos), la
        cantidad de combinaciones crece exponencialmente. En esta lección aprenderemos
        a generar <strong>matrices de prueba inteligentes</strong> que cubran las
        combinaciones más importantes sin explotar el número de tests.</p>

        <h3>💥 El problema: Explosión combinatoria</h3>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="text">Variables:
• 3 browsers (Chrome, Firefox, Safari)
• 3 viewports (Desktop, Tablet, Mobile)
• 3 roles (Admin, Editor, Viewer)
• 5 escenarios de datos

Combinaciones completas: 3 × 3 × 3 × 5 = 135 tests
Con 10 segundos cada uno: ~22 minutos

¿Es necesario correr los 135? Casi nunca.</code></pre>
        </div>

        <h3>✅ Producto cartesiano completo (cuando es manejable)</h3>
        <div class="code-tabs" data-code-id="L086-1">
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

# Múltiples @parametrize generan producto cartesiano
@pytest.mark.parametrize("browser", ["chromium", "firefox", "webkit"])
@pytest.mark.parametrize("locale", ["es-CO", "en-US"])
def test_pagina_carga(browser, locale):
    # 3 browsers × 2 locales = 6 tests
    pass</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">import { test } from '@playwright/test';

// Producto cartesiano: browsers × locales
const browsers = ['chromium', 'firefox', 'webkit'] as const;
const locales = ['es-CO', 'en-US'];

for (const browserName of browsers) {
    for (const locale of locales) {
        test(\`pagina carga [\${browserName}] [\${locale}]\`, async ({ playwright }) => {
            const browser = await playwright[browserName].launch();
            const context = await browser.newContext({ locale });
            const page = await context.newPage();
            // 3 browsers × 2 locales = 6 tests
            await context.close();
            await browser.close();
        });
    }
}</code></pre>
        </div>
        </div>

        <h3>🎯 Combinaciones selectivas con pytest.param</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L086-2">
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
                <pre><code class="language-python"># En vez del producto cartesiano completo,
# seleccionar las combinaciones más relevantes

CRITICAL_COMBINATIONS = [
    # Browser     Viewport              Rol        Escenario
    pytest.param("chromium", "desktop", "admin",   "crear",   id="chrome-desktop-admin-crear"),
    pytest.param("chromium", "mobile",  "viewer",  "ver",     id="chrome-mobile-viewer-ver"),
    pytest.param("firefox",  "desktop", "editor",  "editar",  id="firefox-desktop-editor-editar"),
    pytest.param("webkit",   "tablet",  "admin",   "eliminar",id="safari-tablet-admin-eliminar"),
    pytest.param("chromium", "desktop", "viewer",  "buscar",  id="chrome-desktop-viewer-buscar"),
]

VIEWPORTS = {
    "desktop": {"width": 1920, "height": 1080},
    "tablet": {"width": 768, "height": 1024},
    "mobile": {"width": 375, "height": 812},
}

@pytest.mark.parametrize(
    "browser_name, viewport_name, role, action",
    CRITICAL_COMBINATIONS
)
def test_combinacion_critica(playwright, browser_name, viewport_name, role, action):
    browser = getattr(playwright, browser_name).launch()
    context = browser.new_context(viewport=VIEWPORTS[viewport_name])
    page = context.new_page()

    # ... ejecutar test según role y action
    context.close()
    browser.close()

# Solo 5 tests en vez de 135, cubriendo las combinaciones más importantes</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, BrowserType } from '@playwright/test';

// En vez del producto cartesiano completo,
// seleccionar las combinaciones más relevantes

interface CriticalCombo {
    browserName: 'chromium' | 'firefox' | 'webkit';
    viewport: string;
    role: string;
    action: string;
    id: string;
}

const CRITICAL_COMBINATIONS: CriticalCombo[] = [
    // Browser     Viewport    Rol        Escenario
    { browserName: 'chromium', viewport: 'desktop', role: 'admin',  action: 'crear',    id: 'chrome-desktop-admin-crear' },
    { browserName: 'chromium', viewport: 'mobile',  role: 'viewer', action: 'ver',      id: 'chrome-mobile-viewer-ver' },
    { browserName: 'firefox',  viewport: 'desktop', role: 'editor', action: 'editar',   id: 'firefox-desktop-editor-editar' },
    { browserName: 'webkit',   viewport: 'tablet',  role: 'admin',  action: 'eliminar', id: 'safari-tablet-admin-eliminar' },
    { browserName: 'chromium', viewport: 'desktop', role: 'viewer', action: 'buscar',   id: 'chrome-desktop-viewer-buscar' },
];

const VIEWPORTS: Record&lt;string, { width: number; height: number }&gt; = {
    desktop: { width: 1920, height: 1080 },
    tablet:  { width: 768,  height: 1024 },
    mobile:  { width: 375,  height: 812 },
};

for (const combo of CRITICAL_COMBINATIONS) {
    test(\`combinación crítica [\${combo.id}]\`, async ({ playwright }) => {
        const browserType: BrowserType = playwright[combo.browserName];
        const browser = await browserType.launch();
        const context = await browser.newContext({
            viewport: VIEWPORTS[combo.viewport],
        });
        const page = await context.newPage();

        // ... ejecutar test según role y action
        await context.close();
        await browser.close();
    });
}

// Solo 5 tests en vez de 135, cubriendo las combinaciones más importantes</code></pre>
            </div>
            </div>
        </div>

        <h3>🧮 Pairwise Testing (cobertura inteligente)</h3>
        <div class="code-tabs" data-code-id="L086-3">
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
            <pre><code class="language-python"># pip install allpairspy
# Pairwise genera el mínimo de combinaciones que cubre
# todos los pares de valores

from allpairspy import AllPairs

parameters = [
    ["chromium", "firefox", "webkit"],       # Browser
    ["desktop", "tablet", "mobile"],          # Viewport
    ["admin", "editor", "viewer"],            # Rol
    ["crear", "editar", "ver", "eliminar"],   # Acción
]

# Genera ~12 combinaciones en vez de 108 (3×3×3×4)
pairwise_combos = list(AllPairs(parameters))

@pytest.mark.parametrize("browser, viewport, role, action", pairwise_combos,
    ids=[f"{c[0][:2]}-{c[1][:3]}-{c[2][:3]}-{c[3][:3]}" for c in pairwise_combos])
def test_pairwise(browser, viewport, role, action):
    """Cada PAR de valores aparece al menos una vez."""
    # Cobertura garantizada:
    # chromium+desktop, chromium+tablet, chromium+mobile ✓
    # chromium+admin, chromium+editor, chromium+viewer ✓
    # desktop+admin, desktop+editor, desktop+viewer ✓
    # ... todos los pares
    pass</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// npm install allpairs-js  (o generar combinaciones manualmente)
// Pairwise genera el mínimo de combinaciones que cubre
// todos los pares de valores

import { test } from '@playwright/test';

const parameters = {
    browser:  ['chromium', 'firefox', 'webkit'] as const,
    viewport: ['desktop', 'tablet', 'mobile'],
    role:     ['admin', 'editor', 'viewer'],
    action:   ['crear', 'editar', 'ver', 'eliminar'],
};

// Combinaciones pairwise pre-generadas (~12 en vez de 108)
const pairwiseCombos = [
    { browser: 'chromium', viewport: 'desktop', role: 'admin',  action: 'crear' },
    { browser: 'firefox',  viewport: 'tablet',  role: 'editor', action: 'editar' },
    { browser: 'webkit',   viewport: 'mobile',  role: 'viewer', action: 'ver' },
    { browser: 'chromium', viewport: 'tablet',  role: 'viewer', action: 'eliminar' },
    { browser: 'firefox',  viewport: 'desktop', role: 'viewer', action: 'crear' },
    { browser: 'webkit',   viewport: 'desktop', role: 'editor', action: 'eliminar' },
    { browser: 'chromium', viewport: 'mobile',  role: 'editor', action: 'ver' },
    { browser: 'firefox',  viewport: 'mobile',  role: 'admin',  action: 'eliminar' },
    { browser: 'webkit',   viewport: 'tablet',  role: 'admin',  action: 'editar' },
    { browser: 'chromium', viewport: 'desktop', role: 'editor', action: 'eliminar' },
    { browser: 'firefox',  viewport: 'tablet',  role: 'admin',  action: 'ver' },
    { browser: 'webkit',   viewport: 'mobile',  role: 'viewer', action: 'crear' },
] as const;

for (const combo of pairwiseCombos) {
    const id = \`\${combo.browser.slice(0,2)}-\${combo.viewport.slice(0,3)}-\${combo.role.slice(0,3)}-\${combo.action.slice(0,3)}\`;
    test(\`pairwise [\${id}]\`, async ({ playwright }) => {
        // Cada PAR de valores aparece al menos una vez
        // chromium+desktop, chromium+tablet, chromium+mobile ✓
        // chromium+admin, chromium+editor, chromium+viewer ✓
        // desktop+admin, desktop+editor, desktop+viewer ✓
        // ... todos los pares
    });
}</code></pre>
        </div>
        </div>

        <h3>📊 Matriz de prueba manual (spreadsheet style)</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L086-4">
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
                <pre><code class="language-python"># Definir la matriz como estructura de datos

TEST_MATRIX = {
    "checkout_flows": [
        # Método pago | Dirección    | Cupón  | Envío    | Resultado esperado
        ("PSE",        "Cali",        None,    "Standard", "Pedido confirmado"),
        ("PSE",        "Bogotá",      "DESC10","Express",  "Pedido confirmado"),
        ("Tarjeta",    "Cali",        None,    "Express",  "Pedido confirmado"),
        ("Tarjeta",    "Medellín",    "DESC20","Standard", "Pedido confirmado"),
        ("Tarjeta",    "Cali",        "EXPIRED","Standard","Cupón expirado"),
        ("Efectivo",   "Cali",        None,    "Standard", "Pedido pendiente"),
    ]
}

@pytest.mark.parametrize(
    "payment, city, coupon, shipping, expected",
    TEST_MATRIX["checkout_flows"],
    ids=[f"{row[0]}-{row[1]}-{row[2] or 'sin_cupon'}"
         for row in TEST_MATRIX["checkout_flows"]]
)
def test_checkout_matrix(page, payment, city, coupon, shipping, expected):
    page.goto("https://mi-app.com/checkout")
    page.select_option("#payment", label=payment)
    page.fill("#city", city)
    if coupon:
        page.fill("#coupon", coupon)
        page.click("#apply-coupon")
    page.select_option("#shipping", label=shipping)
    page.check("#terms")
    page.click("#place-order")
    expect(page.locator(".order-result")).to_contain_text(expected)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

// Definir la matriz como estructura de datos

interface CheckoutRow {
    payment: string;
    city: string;
    coupon: string | null;
    shipping: string;
    expected: string;
}

const TEST_MATRIX: Record&lt;string, CheckoutRow[]&gt; = {
    checkoutFlows: [
        // Método pago | Dirección    | Cupón     | Envío      | Resultado esperado
        { payment: 'PSE',      city: 'Cali',      coupon: null,      shipping: 'Standard', expected: 'Pedido confirmado' },
        { payment: 'PSE',      city: 'Bogotá',    coupon: 'DESC10',  shipping: 'Express',  expected: 'Pedido confirmado' },
        { payment: 'Tarjeta',  city: 'Cali',      coupon: null,      shipping: 'Express',  expected: 'Pedido confirmado' },
        { payment: 'Tarjeta',  city: 'Medellín',  coupon: 'DESC20',  shipping: 'Standard', expected: 'Pedido confirmado' },
        { payment: 'Tarjeta',  city: 'Cali',      coupon: 'EXPIRED', shipping: 'Standard', expected: 'Cupón expirado' },
        { payment: 'Efectivo', city: 'Cali',      coupon: null,      shipping: 'Standard', expected: 'Pedido pendiente' },
    ],
};

for (const row of TEST_MATRIX.checkoutFlows) {
    const id = \`\${row.payment}-\${row.city}-\${row.coupon ?? 'sin_cupon'}\`;
    test(\`checkout matrix [\${id}]\`, async ({ page }) => {
        await page.goto('https://mi-app.com/checkout');
        await page.selectOption('#payment', { label: row.payment });
        await page.fill('#city', row.city);
        if (row.coupon) {
            await page.fill('#coupon', row.coupon);
            await page.click('#apply-coupon');
        }
        await page.selectOption('#shipping', { label: row.shipping });
        await page.check('#terms');
        await page.click('#place-order');
        await expect(page.locator('.order-result')).toContainText(row.expected);
    });
}</code></pre>
            </div>
            </div>
        </div>

        <h3>📋 Matriz desde Excel/CSV</h3>
        <pre><code class="python"># test-data/checkout_matrix.csv
# payment,city,coupon,shipping,expected
# PSE,Cali,,Standard,Pedido confirmado
# PSE,Bogotá,DESC10,Express,Pedido confirmado
# Tarjeta,Cali,,Express,Pedido confirmado
# Tarjeta,Medellín,DESC20,Standard,Pedido confirmado

from utils.data_loader import DataLoader

checkout_matrix = DataLoader.from_csv("checkout_matrix.csv")

@pytest.mark.parametrize("row", checkout_matrix,
    ids=[f"{r['payment']}-{r['city']}" for r in checkout_matrix])
def test_checkout_from_csv(page, row):
    page.goto("https://mi-app.com/checkout")
    page.select_option("#payment", label=row["payment"])
    page.fill("#city", row["city"])
    if row["coupon"]:
        page.fill("#coupon", row["coupon"])
    page.select_option("#shipping", label=row["shipping"])
    page.check("#terms")
    page.click("#place-order")
    expect(page.locator(".order-result")).to_contain_text(row["expected"])</code></pre>

        <h3>🏷️ Categorizar y filtrar tests con marks</h3>
        <pre><code class="python"># Etiquetar tests por prioridad/categoría
@pytest.mark.smoke
@pytest.mark.parametrize("scenario", CRITICAL_COMBINATIONS[:3])
def test_smoke_checkout(scenario):
    """Solo las 3 combinaciones más críticas para smoke test."""
    pass

@pytest.mark.full_regression
@pytest.mark.parametrize("scenario", ALL_COMBINATIONS)
def test_regression_checkout(scenario):
    """Todas las combinaciones para regresión completa."""
    pass

# Ejecutar solo smoke:  pytest -m smoke
# Ejecutar regresión:   pytest -m full_regression</code></pre>

        <h3>📈 Estrategia de cobertura recomendada</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #1565c0; color: white;">
                        <th style="padding: 10px;">Nivel</th>
                        <th style="padding: 10px;">Combinaciones</th>
                        <th style="padding: 10px;">Cuándo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><strong>Smoke</strong></td>
                        <td style="padding: 8px;">3-5 combinaciones críticas</td>
                        <td style="padding: 8px;">Cada PR, cada deploy</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>Pairwise</strong></td>
                        <td style="padding: 8px;">~15-20 (cubre todos los pares)</td>
                        <td style="padding: 8px;">CI diario, nightly</td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><strong>Full matrix</strong></td>
                        <td style="padding: 8px;">Todas las combinaciones</td>
                        <td style="padding: 8px;">Pre-release, regresión semanal</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip:</strong> Pairwise testing detecta el ~90% de los bugs con
            ~10-15% de las combinaciones. Es el mejor balance entre cobertura y velocidad.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Para un formulario de registro con:</p>
            <ul>
                <li>3 tipos de cuenta (Personal, Empresa, Estudiante)</li>
                <li>3 métodos de pago (Tarjeta, PSE, Efectivo)</li>
                <li>2 planes (Básico, Premium)</li>
            </ul>
            <ol>
                <li>Calcula el total de combinaciones (producto cartesiano)</li>
                <li>Genera las combinaciones pairwise (usa allpairspy)</li>
                <li>Selecciona 3 combinaciones para smoke test</li>
                <li>Implementa el test parametrizado</li>
            </ol>
        </div>
    `,
    topics: ["combinaciones", "matrices", "prueba"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_086 = LESSON_086;
}
