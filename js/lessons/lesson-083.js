/**
 * Playwright Academy - Lección 083
 * pytest.mark.parametrize básico
 * Sección 12: Data-Driven Testing
 */

const LESSON_083 = {
    id: 83,
    title: "pytest.mark.parametrize básico",
    duration: "8 min",
    level: "intermediate",
    section: "section-12",
    content: `
        <h2>📊 pytest.mark.parametrize básico</h2>
        <p>El <strong>Data-Driven Testing</strong> consiste en ejecutar el mismo test con
        diferentes conjuntos de datos. En vez de escribir 10 tests casi idénticos,
        escribes uno solo y le pasas 10 combinaciones de datos. En pytest, el mecanismo
        principal es <code>@pytest.mark.parametrize</code>.</p>

        <h3>🤔 El problema: Tests duplicados</h3>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L083-1">
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
                <pre><code class="language-python"># ❌ Sin parametrize — código duplicado
def test_login_admin(page):
    page.goto("https://mi-app.com/login")
    page.fill("#email", "admin@test.com")
    page.fill("#password", "admin123")
    page.click("#login-btn")
    assert "dashboard" in page.url

def test_login_editor(page):
    page.goto("https://mi-app.com/login")
    page.fill("#email", "editor@test.com")
    page.fill("#password", "editor123")
    page.click("#login-btn")
    assert "dashboard" in page.url

def test_login_viewer(page):
    page.goto("https://mi-app.com/login")
    page.fill("#email", "viewer@test.com")
    page.fill("#password", "viewer123")
    page.click("#login-btn")
    assert "dashboard" in page.url

# 3 tests con el mismo código, solo cambian los datos...</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// ❌ Sin parametrizar — código duplicado
import { test, expect } from '@playwright/test';

test('login admin', async ({ page }) => {
    await page.goto('https://mi-app.com/login');
    await page.fill('#email', 'admin@test.com');
    await page.fill('#password', 'admin123');
    await page.click('#login-btn');
    expect(page.url()).toContain('dashboard');
});

test('login editor', async ({ page }) => {
    await page.goto('https://mi-app.com/login');
    await page.fill('#email', 'editor@test.com');
    await page.fill('#password', 'editor123');
    await page.click('#login-btn');
    expect(page.url()).toContain('dashboard');
});

test('login viewer', async ({ page }) => {
    await page.goto('https://mi-app.com/login');
    await page.fill('#email', 'viewer@test.com');
    await page.fill('#password', 'viewer123');
    await page.click('#login-btn');
    expect(page.url()).toContain('dashboard');
});

// 3 tests con el mismo código, solo cambian los datos...</code></pre>
            </div>
            </div>
        </div>

        <h3>✅ La solución: @pytest.mark.parametrize</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L083-2">
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

# ✅ Un solo test, múltiples ejecuciones
@pytest.mark.parametrize("email, password", [
    ("admin@test.com", "admin123"),
    ("editor@test.com", "editor123"),
    ("viewer@test.com", "viewer123"),
])
def test_login_valido(page, email, password):
    page.goto("https://mi-app.com/login")
    page.fill("#email", email)
    page.fill("#password", password)
    page.click("#login-btn")
    assert "dashboard" in page.url

# pytest ejecuta esto como 3 tests independientes:
# test_login_valido[admin@test.com-admin123]    PASSED
# test_login_valido[editor@test.com-editor123]  PASSED
# test_login_valido[viewer@test.com-viewer123]  PASSED</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

// ✅ Un solo test, múltiples ejecuciones con loop
const credentials = [
    { email: 'admin@test.com', password: 'admin123' },
    { email: 'editor@test.com', password: 'editor123' },
    { email: 'viewer@test.com', password: 'viewer123' },
];

for (const { email, password } of credentials) {
    test(\`login válido con \${email}\`, async ({ page }) => {
        await page.goto('https://mi-app.com/login');
        await page.fill('#email', email);
        await page.fill('#password', password);
        await page.click('#login-btn');
        expect(page.url()).toContain('dashboard');
    });
}

// Playwright ejecuta esto como 3 tests independientes:
// login válido con admin@test.com    PASSED
// login válido con editor@test.com   PASSED
// login válido con viewer@test.com   PASSED</code></pre>
            </div>
            </div>
        </div>

        <h3>📋 Sintaxis de parametrize</h3>
        <div class="code-tabs" data-code-id="L083-3">
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
            <pre><code class="language-python"># ── Un solo parámetro ──
@pytest.mark.parametrize("query", [
    "laptop",
    "mouse",
    "teclado",
    "monitor 4K",
])
def test_busqueda(page, query):
    page.goto("https://mi-app.com/search")
    page.fill("#search", query)
    page.click("#search-btn")
    expect(page.locator(".results")).to_be_visible()


# ── Múltiples parámetros ──
@pytest.mark.parametrize("nombre, email, rol", [
    ("Juan", "juan@test.com", "admin"),
    ("Carlos", "carlos@test.com", "editor"),
    ("María", "maria@test.com", "viewer"),
])
def test_crear_usuario(page, nombre, email, rol):
    page.goto("https://mi-app.com/users/new")
    page.fill("#nombre", nombre)
    page.fill("#email", email)
    page.select_option("#rol", label=rol)
    page.click("#save")
    expect(page.locator(".toast-success")).to_be_visible()


# ── Con IDs personalizados ──
@pytest.mark.parametrize("email, password, expected", [
    pytest.param("admin@test.com", "admin123", "dashboard",
                 id="admin-login"),
    pytest.param("user@test.com", "user123", "home",
                 id="user-login"),
    pytest.param("invalid@test.com", "wrong", "login",
                 id="invalid-login"),
])
def test_login_redirect(page, email, password, expected):
    page.goto("https://mi-app.com/login")
    page.fill("#email", email)
    page.fill("#password", password)
    page.click("#login-btn")
    assert expected in page.url

# Salida:
# test_login_redirect[admin-login]    PASSED
# test_login_redirect[user-login]     PASSED
# test_login_redirect[invalid-login]  PASSED</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

// ── Un solo parámetro ──
const queries = ['laptop', 'mouse', 'teclado', 'monitor 4K'];

for (const query of queries) {
    test(\`búsqueda: \${query}\`, async ({ page }) => {
        await page.goto('https://mi-app.com/search');
        await page.fill('#search', query);
        await page.click('#search-btn');
        await expect(page.locator('.results')).toBeVisible();
    });
}


// ── Múltiples parámetros ──
const usuarios = [
    { nombre: 'Juan', email: 'juan@test.com', rol: 'admin' },
    { nombre: 'Carlos', email: 'carlos@test.com', rol: 'editor' },
    { nombre: 'María', email: 'maria@test.com', rol: 'viewer' },
];

for (const { nombre, email, rol } of usuarios) {
    test(\`crear usuario: \${nombre}\`, async ({ page }) => {
        await page.goto('https://mi-app.com/users/new');
        await page.fill('#nombre', nombre);
        await page.fill('#email', email);
        await page.selectOption('#rol', { label: rol });
        await page.click('#save');
        await expect(page.locator('.toast-success')).toBeVisible();
    });
}


// ── Con IDs personalizados ──
const loginCases = [
    { id: 'admin-login', email: 'admin@test.com', password: 'admin123', expected: 'dashboard' },
    { id: 'user-login', email: 'user@test.com', password: 'user123', expected: 'home' },
    { id: 'invalid-login', email: 'invalid@test.com', password: 'wrong', expected: 'login' },
];

for (const c of loginCases) {
    test(\`login redirect [\${c.id}]\`, async ({ page }) => {
        await page.goto('https://mi-app.com/login');
        await page.fill('#email', c.email);
        await page.fill('#password', c.password);
        await page.click('#login-btn');
        expect(page.url()).toContain(c.expected);
    });
}

// Salida:
// login redirect [admin-login]    PASSED
// login redirect [user-login]     PASSED
// login redirect [invalid-login]  PASSED</code></pre>
        </div>
        </div>

        <h3>🧪 Parametrize para validación de formularios</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L083-4">
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
                <pre><code class="language-python">from playwright.sync_api import expect

# Test de validación con datos válidos e inválidos
@pytest.mark.parametrize("email, valid", [
    ("usuario@ejemplo.com", True),
    ("admin@siesa.com", True),
    ("test.user+tag@domain.co", True),
    ("sin-arroba.com", False),
    ("@sin-usuario.com", False),
    ("usuario@", False),
    ("", False),
])
def test_validacion_email(page, email, valid):
    page.goto("https://mi-app.com/register")
    page.fill("#email", email)
    page.click("#email")  # Trigger blur para validación
    page.click("body")    # Perder foco

    error = page.locator("#email-error")
    if valid:
        expect(error).to_be_hidden()
    else:
        expect(error).to_be_visible()


# Test de campos con límites
@pytest.mark.parametrize("campo, valor, error_esperado", [
    ("nombre", "", "El nombre es requerido"),
    ("nombre", "A", "Mínimo 2 caracteres"),
    ("nombre", "A" * 101, "Máximo 100 caracteres"),
    ("precio", "-1", "El precio debe ser positivo"),
    ("precio", "0", "El precio debe ser mayor a 0"),
    ("stock", "-5", "El stock no puede ser negativo"),
])
def test_validacion_campos(page, campo, valor, error_esperado):
    page.goto("https://mi-app.com/products/new")
    page.fill(f"[name='{campo}']", valor)
    page.click("#save")
    expect(page.locator(f".error-{campo}")).to_contain_text(error_esperado)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

// Test de validación con datos válidos e inválidos
const emailCases = [
    { email: 'usuario@ejemplo.com', valid: true },
    { email: 'admin@siesa.com', valid: true },
    { email: 'test.user+tag@domain.co', valid: true },
    { email: 'sin-arroba.com', valid: false },
    { email: '@sin-usuario.com', valid: false },
    { email: 'usuario@', valid: false },
    { email: '', valid: false },
];

for (const { email, valid } of emailCases) {
    test(\`validación email: "\${email}" → \${valid ? 'válido' : 'inválido'}\`, async ({ page }) => {
        await page.goto('https://mi-app.com/register');
        await page.fill('#email', email);
        await page.click('#email');  // Trigger blur para validación
        await page.click('body');    // Perder foco

        const error = page.locator('#email-error');
        if (valid) {
            await expect(error).toBeHidden();
        } else {
            await expect(error).toBeVisible();
        }
    });
}


// Test de campos con límites
const fieldCases = [
    { campo: 'nombre', valor: '', errorEsperado: 'El nombre es requerido' },
    { campo: 'nombre', valor: 'A', errorEsperado: 'Mínimo 2 caracteres' },
    { campo: 'nombre', valor: 'A'.repeat(101), errorEsperado: 'Máximo 100 caracteres' },
    { campo: 'precio', valor: '-1', errorEsperado: 'El precio debe ser positivo' },
    { campo: 'precio', valor: '0', errorEsperado: 'El precio debe ser mayor a 0' },
    { campo: 'stock', valor: '-5', errorEsperado: 'El stock no puede ser negativo' },
];

for (const { campo, valor, errorEsperado } of fieldCases) {
    test(\`validación campo \${campo}: "\${valor}"\`, async ({ page }) => {
        await page.goto('https://mi-app.com/products/new');
        await page.fill(\`[name='\${campo}']\`, valor);
        await page.click('#save');
        await expect(page.locator(\`.error-\${campo}\`)).toContainText(errorEsperado);
    });
}</code></pre>
            </div>
            </div>
        </div>

        <h3>🔗 Múltiples parametrize (producto cartesiano)</h3>
        <div class="code-tabs" data-code-id="L083-5">
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
            <pre><code class="language-python"># Combinar múltiples decoradores genera TODAS las combinaciones

@pytest.mark.parametrize("browser_type", ["chromium", "firefox", "webkit"])
@pytest.mark.parametrize("viewport", [
    {"width": 1920, "height": 1080},
    {"width": 768, "height": 1024},
    {"width": 375, "height": 812},
])
def test_responsive(browser_type, viewport):
    # Se ejecuta 3 x 3 = 9 veces:
    # chromium + 1920x1080, chromium + 768x1024, chromium + 375x812
    # firefox + 1920x1080,  firefox + 768x1024,  firefox + 375x812
    # webkit + 1920x1080,   webkit + 768x1024,   webkit + 375x812
    pass


# ── Ejemplo práctico: probar login en múltiples idiomas y roles ──
@pytest.mark.parametrize("locale", ["es-CO", "en-US", "pt-BR"])
@pytest.mark.parametrize("role", ["admin", "editor", "viewer"])
def test_login_multiidioma(page, locale, role):
    # 3 idiomas x 3 roles = 9 tests
    pass</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// Generar TODAS las combinaciones con loops anidados

const browserTypes = ['chromium', 'firefox', 'webkit'] as const;
const viewports = [
    { width: 1920, height: 1080 },
    { width: 768, height: 1024 },
    { width: 375, height: 812 },
];

for (const browserType of browserTypes) {
    for (const viewport of viewports) {
        test(\`responsive \${browserType} \${viewport.width}x\${viewport.height}\`, async () => {
            // Se ejecuta 3 x 3 = 9 veces:
            // chromium + 1920x1080, chromium + 768x1024, chromium + 375x812
            // firefox + 1920x1080,  firefox + 768x1024,  firefox + 375x812
            // webkit + 1920x1080,   webkit + 768x1024,   webkit + 375x812
        });
    }
}


// ── Ejemplo práctico: probar login en múltiples idiomas y roles ──
const locales = ['es-CO', 'en-US', 'pt-BR'];
const roles = ['admin', 'editor', 'viewer'];

for (const locale of locales) {
    for (const role of roles) {
        test(\`login multiidioma \${locale} / \${role}\`, async ({ page }) => {
            // 3 idiomas x 3 roles = 9 tests
        });
    }
}</code></pre>
        </div>
        </div>

        <h3>⏭️ Saltar o marcar tests parametrizados</h3>
        <div class="code-tabs" data-code-id="L083-6">
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
            <pre><code class="language-python">@pytest.mark.parametrize("url, expected_status", [
    ("https://mi-app.com", 200),
    ("https://mi-app.com/about", 200),
    pytest.param("https://mi-app.com/beta",
                 200, marks=pytest.mark.skip(reason="Beta no disponible")),
    pytest.param("https://mi-app.com/experimental",
                 200, marks=pytest.mark.xfail(reason="Feature en desarrollo")),
])
def test_paginas_disponibles(api, url, expected_status):
    response = api.get(url)
    assert response.status == expected_status</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

const pageCases = [
    { url: 'https://mi-app.com', expectedStatus: 200 },
    { url: 'https://mi-app.com/about', expectedStatus: 200 },
];

for (const { url, expectedStatus } of pageCases) {
    test(\`página disponible: \${url}\`, async ({ request }) => {
        const response = await request.get(url);
        expect(response.status()).toBe(expectedStatus);
    });
}

// Equivalente a pytest.mark.skip
test.skip('página beta', async ({ request }) => {
    // Beta no disponible
    const response = await request.get('https://mi-app.com/beta');
    expect(response.status()).toBe(200);
});

// Equivalente a pytest.mark.xfail — test.fail() espera que falle
test('página experimental', async ({ request }) => {
    test.fail(); // Feature en desarrollo — se espera que falle
    const response = await request.get('https://mi-app.com/experimental');
    expect(response.status()).toBe(200);
});</code></pre>
        </div>
        </div>

        <h3>📊 Parametrize con datos complejos</h3>
        <div class="code-tabs" data-code-id="L083-7">
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
            <pre><code class="language-python"># Datos como diccionarios para mayor legibilidad
CHECKOUT_SCENARIOS = [
    {
        "id": "tarjeta-visa",
        "payment": "Tarjeta",
        "card": "4111111111111111",
        "expected": "Pago aprobado",
    },
    {
        "id": "pse",
        "payment": "PSE",
        "card": None,
        "expected": "Redirigiendo a PSE",
    },
    {
        "id": "tarjeta-rechazada",
        "payment": "Tarjeta",
        "card": "4000000000000002",
        "expected": "Pago rechazado",
    },
]

@pytest.mark.parametrize("scenario", CHECKOUT_SCENARIOS,
                         ids=[s["id"] for s in CHECKOUT_SCENARIOS])
def test_checkout(page, scenario):
    page.goto("https://mi-app.com/checkout")
    page.select_option("#payment", label=scenario["payment"])
    if scenario["card"]:
        page.fill("#card-number", scenario["card"])
    page.click("#pay-btn")
    expect(page.locator(".payment-result")).to_contain_text(
        scenario["expected"]
    )</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

// Datos como objetos para mayor legibilidad
const checkoutScenarios = [
    {
        id: 'tarjeta-visa',
        payment: 'Tarjeta',
        card: '4111111111111111',
        expected: 'Pago aprobado',
    },
    {
        id: 'pse',
        payment: 'PSE',
        card: null,
        expected: 'Redirigiendo a PSE',
    },
    {
        id: 'tarjeta-rechazada',
        payment: 'Tarjeta',
        card: '4000000000000002',
        expected: 'Pago rechazado',
    },
];

for (const scenario of checkoutScenarios) {
    test(\`checkout [\${scenario.id}]\`, async ({ page }) => {
        await page.goto('https://mi-app.com/checkout');
        await page.selectOption('#payment', { label: scenario.payment });
        if (scenario.card) {
            await page.fill('#card-number', scenario.card);
        }
        await page.click('#pay-btn');
        await expect(page.locator('.payment-result'))
            .toContainText(scenario.expected);
    });
}</code></pre>
        </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip:</strong> Usa <code>ids</code> descriptivos en los parámetros.
            En lugar de <code>test_login[0]</code>, ver <code>test_login[admin-login]</code>
            en el reporte hace mucho más fácil identificar qué falló.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Crea tests parametrizados para:</p>
            <ol>
                <li>Validación de contraseña: mínimo 8 chars, mayúscula, número, especial</li>
                <li>Búsqueda de productos: 5 términos diferentes, verificar resultados</li>
                <li>Login con 3 roles y verificar que cada uno ve un menú diferente</li>
            </ol>
        </div>
    `,
    topics: ["parametrize", "data-driven", "pytest"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 8,
    difficulty: "medium",
    type: "foundation"
};

if (typeof window !== 'undefined') {
    window.LESSON_083 = LESSON_083;
}
