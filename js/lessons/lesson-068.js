/**
 * Playwright Academy - Lección 068
 * Bloquear recursos: imágenes, tracking
 * Sección 9: Network Interception y Mocking
 */

const LESSON_068 = {
    id: 68,
    title: "Bloquear recursos: imágenes, tracking",
    duration: "7 min",
    level: "intermediate",
    section: "section-09",
    content: `
        <h2>🚫 Bloquear recursos: imágenes, tracking</h2>
        <p>Bloquear recursos innecesarios durante los tests hace que se ejecuten
        <strong>más rápido</strong>, consuman <strong>menos ancho de banda</strong> y
        sean <strong>más estables</strong> al no depender de servidores externos de
        tracking, analytics o CDNs de imágenes.</p>

        <h3>🖼️ Bloquear imágenes</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L068-1">
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
                <pre><code class="language-python"># Bloquear todas las imágenes
page.route("**/*.{png,jpg,jpeg,gif,svg,webp,ico}", lambda r: r.abort())

# ── Alternativa: bloquear por tipo de recurso ──
# Más preciso que por extensión
page.route("**/*", lambda route: (
    route.abort()
    if route.request.resource_type == "image"
    else route.continue_()
))

# ── Reemplazar imágenes con placeholder (más visual) ──
def replace_with_placeholder(route):
    """Reemplazar imágenes con un SVG placeholder liviano."""
    svg_placeholder = '''
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
        <rect width="200" height="200" fill="#f0f0f0"/>
        <text x="50%" y="50%" text-anchor="middle" fill="#999" font-size="14">
            IMG
        </text>
    </svg>'''
    route.fulfill(
        status=200,
        content_type="image/svg+xml",
        body=svg_placeholder
    )

page.route("**/*.{png,jpg,jpeg,gif,webp}", replace_with_placeholder)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Bloquear todas las imágenes
await page.route('**/*.{png,jpg,jpeg,gif,svg,webp,ico}', route => route.abort());

// ── Alternativa: bloquear por tipo de recurso ──
// Más preciso que por extensión
await page.route('**/*', async (route) => {
    if (route.request().resourceType() === 'image') {
        await route.abort();
    } else {
        await route.continue();
    }
});

// ── Reemplazar imágenes con placeholder (más visual) ──
await page.route('**/*.{png,jpg,jpeg,gif,webp}', async (route) => {
    const svgPlaceholder = '&lt;svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"&gt;'
        + '&lt;rect width="200" height="200" fill="#f0f0f0"/&gt;'
        + '&lt;text x="50%" y="50%" text-anchor="middle" fill="#999" font-size="14"&gt;'
        + 'IMG&lt;/text&gt;&lt;/svg&gt;';
    await route.fulfill({
        status: 200,
        contentType: 'image/svg+xml',
        body: svgPlaceholder,
    });
});</code></pre>
            </div>
            </div>
        </div>

        <h3>📊 Bloquear analytics y tracking</h3>
        <div class="code-tabs" data-code-id="L068-2">
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
            <pre><code class="language-python"># Bloquear Google Analytics
page.route("**google-analytics.com/**", lambda r: r.abort())
page.route("**googletagmanager.com/**", lambda r: r.abort())
page.route("**/*.google-analytics.com/**", lambda r: r.abort())

# Bloquear Facebook Pixel
page.route("**connect.facebook.net/**", lambda r: r.abort())
page.route("**facebook.com/tr/**", lambda r: r.abort())

# Bloquear Hotjar, Mixpanel, Segment, etc.
page.route("**hotjar.com/**", lambda r: r.abort())
page.route("**mixpanel.com/**", lambda r: r.abort())
page.route("**segment.io/**", lambda r: r.abort())
page.route("**segment.com/**", lambda r: r.abort())
page.route("**amplitude.com/**", lambda r: r.abort())

# ── Bloqueo masivo con lista ──
BLOCKED_DOMAINS = [
    "google-analytics.com",
    "googletagmanager.com",
    "facebook.net",
    "hotjar.com",
    "mixpanel.com",
    "segment.io",
    "amplitude.com",
    "sentry.io",
    "newrelic.com",
    "doubleclick.net",
]

def block_tracking(route):
    url = route.request.url
    if any(domain in url for domain in BLOCKED_DOMAINS):
        route.abort()
    else:
        route.continue_()

page.route("**/*", block_tracking)</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// Bloquear Google Analytics
await page.route('**google-analytics.com/**', route => route.abort());
await page.route('**googletagmanager.com/**', route => route.abort());
await page.route('**/*.google-analytics.com/**', route => route.abort());

// Bloquear Facebook Pixel
await page.route('**connect.facebook.net/**', route => route.abort());
await page.route('**facebook.com/tr/**', route => route.abort());

// Bloquear Hotjar, Mixpanel, Segment, etc.
await page.route('**hotjar.com/**', route => route.abort());
await page.route('**mixpanel.com/**', route => route.abort());
await page.route('**segment.io/**', route => route.abort());
await page.route('**segment.com/**', route => route.abort());
await page.route('**amplitude.com/**', route => route.abort());

// ── Bloqueo masivo con lista ──
const BLOCKED_DOMAINS = [
    'google-analytics.com',
    'googletagmanager.com',
    'facebook.net',
    'hotjar.com',
    'mixpanel.com',
    'segment.io',
    'amplitude.com',
    'sentry.io',
    'newrelic.com',
    'doubleclick.net',
];

await page.route('**/*', async (route) => {
    const url = route.request().url();
    if (BLOCKED_DOMAINS.some(domain => url.includes(domain))) {
        await route.abort();
    } else {
        await route.continue();
    }
});</code></pre>
        </div>
        </div>

        <h3>🎨 Bloquear CSS y fuentes externas</h3>
        <div class="code-tabs" data-code-id="L068-3">
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
            <pre><code class="language-python"># Bloquear fuentes (reduce tiempo de carga significativamente)
page.route("**/*.{woff,woff2,ttf,otf,eot}", lambda r: r.abort())
page.route("**fonts.googleapis.com/**", lambda r: r.abort())
page.route("**fonts.gstatic.com/**", lambda r: r.abort())

# Bloquear CSS externos (si solo necesitas funcionalidad)
page.route("**/*", lambda route: (
    route.abort()
    if route.request.resource_type == "font"
    else route.continue_()
))

# Bloquear por tipo de recurso — referencia completa
BLOCK_TYPES = {"image", "font", "media", "stylesheet"}
page.route("**/*", lambda route: (
    route.abort()
    if route.request.resource_type in BLOCK_TYPES
    else route.continue_()
))</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// Bloquear fuentes (reduce tiempo de carga significativamente)
await page.route('**/*.{woff,woff2,ttf,otf,eot}', route => route.abort());
await page.route('**fonts.googleapis.com/**', route => route.abort());
await page.route('**fonts.gstatic.com/**', route => route.abort());

// Bloquear CSS externos (si solo necesitas funcionalidad)
await page.route('**/*', async (route) => {
    if (route.request().resourceType() === 'font') {
        await route.abort();
    } else {
        await route.continue();
    }
});

// Bloquear por tipo de recurso — referencia completa
const BLOCK_TYPES = new Set(['image', 'font', 'media', 'stylesheet']);
await page.route('**/*', async (route) => {
    if (BLOCK_TYPES.has(route.request().resourceType())) {
        await route.abort();
    } else {
        await route.continue();
    }
});</code></pre>
        </div>
        </div>

        <h3>📦 Bloquear scripts de terceros</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L068-4">
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
                <pre><code class="language-python"># Bloquear chat widgets
page.route("**intercom.io/**", lambda r: r.abort())
page.route("**crisp.chat/**", lambda r: r.abort())
page.route("**zendesk.com/**", lambda r: r.abort())

# Bloquear todos los scripts de terceros
# (solo permitir scripts del dominio propio)
def block_third_party_scripts(route):
    if route.request.resource_type == "script":
        url = route.request.url
        # Solo permitir scripts de nuestro dominio
        if "mi-app.com" not in url and "localhost" not in url:
            route.abort()
            return
    route.continue_()

page.route("**/*", block_third_party_scripts)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Bloquear chat widgets
await page.route('**intercom.io/**', route => route.abort());
await page.route('**crisp.chat/**', route => route.abort());
await page.route('**zendesk.com/**', route => route.abort());

// Bloquear todos los scripts de terceros
// (solo permitir scripts del dominio propio)
await page.route('**/*', async (route) => {
    if (route.request().resourceType() === 'script') {
        const url = route.request().url();
        if (!url.includes('mi-app.com') &amp;&amp; !url.includes('localhost')) {
            await route.abort();
            return;
        }
    }
    await route.continue();
});</code></pre>
            </div>
            </div>
        </div>

        <h3>⚡ Helper reutilizable para bloqueo</h3>
        <div class="code-tabs" data-code-id="L068-5">
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
            <pre><code class="language-python"># utils/network_helper.py

class NetworkHelper:
    """Helper para configurar bloqueos de red comunes."""

    @staticmethod
    def block_images(page):
        """Bloquear todas las imágenes."""
        page.route("**/*", lambda route: (
            route.abort()
            if route.request.resource_type == "image"
            else route.continue_()
        ))

    @staticmethod
    def block_tracking(page):
        """Bloquear analytics y tracking de terceros."""
        domains = [
            "google-analytics.com", "googletagmanager.com",
            "facebook.net", "hotjar.com", "mixpanel.com",
            "segment.io", "amplitude.com", "sentry.io",
        ]
        page.route("**/*", lambda route: (
            route.abort()
            if any(d in route.request.url for d in domains)
            else route.continue_()
        ))

    @staticmethod
    def block_fonts(page):
        """Bloquear fuentes web."""
        page.route("**/*", lambda route: (
            route.abort()
            if route.request.resource_type == "font"
            else route.continue_()
        ))

    @staticmethod
    def speed_mode(page):
        """Modo velocidad: bloquear todo lo no esencial."""
        block_types = {"image", "font", "media"}
        block_domains = [
            "google-analytics.com", "googletagmanager.com",
            "facebook.net", "hotjar.com", "fonts.googleapis.com",
        ]

        def handler(route):
            url = route.request.url
            rtype = route.request.resource_type

            if rtype in block_types:
                route.abort()
            elif any(d in url for d in block_domains):
                route.abort()
            else:
                route.continue_()

        page.route("**/*", handler)

# ── Uso en conftest.py ──
import pytest
from utils.network_helper import NetworkHelper

@pytest.fixture(autouse=True)
def optimize_network(page):
    """Optimizar red en todos los tests automáticamente."""
    NetworkHelper.block_tracking(page)
    NetworkHelper.block_fonts(page)
    yield</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// utils/network-helper.ts
import type { Page } from '@playwright/test';

export class NetworkHelper {
    static async blockImages(page: Page) {
        await page.route('**/*', async (route) => {
            if (route.request().resourceType() === 'image') {
                await route.abort();
            } else { await route.continue(); }
        });
    }

    static async blockTracking(page: Page) {
        const domains = [
            'google-analytics.com', 'googletagmanager.com',
            'facebook.net', 'hotjar.com', 'mixpanel.com',
            'segment.io', 'amplitude.com', 'sentry.io',
        ];
        await page.route('**/*', async (route) => {
            if (domains.some(d => route.request().url().includes(d))) {
                await route.abort();
            } else { await route.continue(); }
        });
    }

    static async blockFonts(page: Page) {
        await page.route('**/*', async (route) => {
            if (route.request().resourceType() === 'font') {
                await route.abort();
            } else { await route.continue(); }
        });
    }

    static async speedMode(page: Page) {
        const blockTypes = new Set(['image', 'font', 'media']);
        const blockDomains = [
            'google-analytics.com', 'googletagmanager.com',
            'facebook.net', 'hotjar.com', 'fonts.googleapis.com',
        ];
        await page.route('**/*', async (route) => {
            const url = route.request().url();
            const rtype = route.request().resourceType();
            if (blockTypes.has(rtype)) { await route.abort(); }
            else if (blockDomains.some(d => url.includes(d))) { await route.abort(); }
            else { await route.continue(); }
        });
    }
}

// ── Uso con beforeEach (equivalente a autouse fixture) ──
import { test } from '@playwright/test';
import { NetworkHelper } from './utils/network-helper';

test.beforeEach(async ({ page }) => {
    await NetworkHelper.blockTracking(page);
    await NetworkHelper.blockFonts(page);
});</code></pre>
        </div>
        </div>

        <h3>📊 Impacto en el rendimiento</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #1565c0; color: white;">
                        <th style="padding: 10px;">Recurso bloqueado</th>
                        <th style="padding: 10px;">Ahorro típico</th>
                        <th style="padding: 10px;">Impacto en test</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;">Imágenes</td>
                        <td style="padding: 8px;">200-500ms por página</td>
                        <td style="padding: 8px;">Ninguno (si no verificas imágenes)</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Fuentes</td>
                        <td style="padding: 8px;">100-300ms</td>
                        <td style="padding: 8px;">Texto usa fuentes del sistema</td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;">Analytics/tracking</td>
                        <td style="padding: 8px;">50-200ms</td>
                        <td style="padding: 8px;">Ninguno (no afecta funcionalidad)</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Chat widgets</td>
                        <td style="padding: 8px;">200-500ms</td>
                        <td style="padding: 8px;">El widget no aparece (irrelevante)</td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><strong>Todo junto</strong></td>
                        <td style="padding: 8px;"><strong>0.5-1.5s por página</strong></td>
                        <td style="padding: 8px;">Tests funcionales sin cambio</td>
                    </tr>
                </tbody>
            </table>
            <p style="margin-top: 10px;">En una suite de 100 tests que visitan 3 páginas cada uno,
            el ahorro total puede ser de <strong>2-8 minutos</strong>.</p>
        </div>

        <h3>🧪 Ejemplo completo: Suite optimizada</h3>
        <div class="code-tabs" data-code-id="L068-6">
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
            <pre><code class="language-python"># conftest.py — optimizaciones globales

@pytest.fixture(autouse=True)
def fast_mode(page):
    """Aplicar optimizaciones de red a todos los tests."""

    blocked_types = {"image", "font", "media"}
    blocked_urls = [
        "google-analytics", "googletagmanager", "facebook.net",
        "hotjar.com", "intercom.io", "sentry.io",
    ]

    def optimize(route):
        if route.request.resource_type in blocked_types:
            route.abort()
        elif any(u in route.request.url for u in blocked_urls):
            route.abort()
        else:
            route.continue_()

    page.route("**/*", optimize)
    yield

# Los tests se ejecutan normalmente pero más rápido
def test_buscar_producto(page):
    page.goto("https://mi-app.com/products")
    page.fill("#search", "laptop")
    page.click("#search-btn")
    expect(page.locator(".product-card")).not_to_have_count(0)
    # Este test corre ~1 segundo más rápido por el bloqueo</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// optimizaciones globales con beforeEach
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    const blockedTypes = new Set(['image', 'font', 'media']);
    const blockedUrls = [
        'google-analytics', 'googletagmanager', 'facebook.net',
        'hotjar.com', 'intercom.io', 'sentry.io',
    ];

    await page.route('**/*', async (route) => {
        if (blockedTypes.has(route.request().resourceType())) {
            await route.abort();
        } else if (blockedUrls.some(u => route.request().url().includes(u))) {
            await route.abort();
        } else {
            await route.continue();
        }
    });
});

// Los tests se ejecutan normalmente pero más rápido
test('buscar producto', async ({ page }) => {
    await page.goto('https://mi-app.com/products');
    await page.fill('#search', 'laptop');
    await page.click('#search-btn');
    await expect(page.locator('.product-card')).not.toHaveCount(0);
    // Este test corre ~1 segundo más rápido por el bloqueo
});</code></pre>
        </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip:</strong> Usa <code>autouse=True</code> en la fixture de bloqueo
            para que se aplique a <strong>todos</strong> los tests automáticamente.
            Si un test específico necesita imágenes (test visual), puede desactivar el bloqueo
            con <code>page.unroute()</code>.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Crea un <code>NetworkHelper</code> que:</p>
            <ol>
                <li>Tenga un método <code>block_all_external(page, allowed_domains)</code>
                que bloquee todo recurso fuera de los dominios permitidos</li>
                <li>Tenga un método <code>log_blocked(page)</code> que imprima
                los recursos bloqueados al console</li>
                <li>Mide el tiempo de carga con y sin bloqueo en una página real</li>
            </ol>
        </div>
    `,
    topics: ["bloqueo", "recursos", "imágenes", "tracking"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_068 = LESSON_068;
}
