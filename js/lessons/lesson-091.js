/**
 * Playwright Academy - Lección 091
 * Perfiles de navegador y configuración
 * Sección 13: Browser Contexts e Isolation
 */

const LESSON_091 = {
    id: 91,
    title: "Perfiles de navegador y configuración",
    duration: "7 min",
    level: "intermediate",
    section: "section-13",
    content: `
        <h2>⚙️ Perfiles de navegador y configuración</h2>
        <p>Cada <strong>browser context</strong> en Playwright es un perfil aislado con su propia
        configuración: viewport, geolocalización, idioma, permisos, user-agent, esquema de colores y más.
        Dominar estas opciones permite simular <strong>dispositivos reales</strong>, condiciones de red
        específicas y perfiles de usuario sin necesidad de navegadores separados.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📋 Lo que aprenderás</h4>
            <ul>
                <li>Configurar viewport, escala y emulación de dispositivos</li>
                <li>Establecer geolocalización, locale y timezone</li>
                <li>Controlar permisos, color scheme y user-agent</li>
                <li>Configurar credenciales HTTP, headers extra y modo offline</li>
                <li>Combinar múltiples opciones en un solo contexto</li>
            </ul>
        </div>

        <h3>🖥️ 1. Opciones de configuración del context</h3>
        <p>El método <code>browser.new_context()</code> acepta numerosas opciones que definen el perfil
        del navegador. Cada contexto es independiente — cambiar la configuración de uno no afecta a otros.</p>

        <div class="code-tabs" data-code-id="L091-1">
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
            <pre><code class="language-python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Contexto con configuración mínima (valores por defecto)
    context_default = browser.new_context()

    # Contexto con configuración personalizada
    context_custom = browser.new_context(
        viewport={"width": 1280, "height": 720},
        locale="es-CO",
        timezone_id="America/Bogota",
        color_scheme="dark"
    )

    page_default = context_default.new_page()
    page_custom = context_custom.new_page()

    # Cada page hereda la config de su context
    page_default.goto("https://example.com")
    page_custom.goto("https://example.com")

    context_default.close()
    context_custom.close()
    browser.close()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">import { chromium } from 'playwright';

const browser = await chromium.launch();

// Contexto con configuración mínima (valores por defecto)
const contextDefault = browser.newContext();

// Contexto con configuración personalizada
const contextCustom = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    locale: 'es-CO',
    timezoneId: 'America/Bogota',
    colorScheme: 'dark'
});

const pageDefault = await contextDefault.newPage();
const pageCustom = await contextCustom.newPage();

// Cada page hereda la config de su context
await pageDefault.goto('https://example.com');
await pageCustom.goto('https://example.com');

await contextDefault.close();
await contextCustom.close();
await browser.close();</code></pre>
        </div>
        </div>

        <h3>📐 2. Viewport: width, height y device_scale_factor</h3>
        <p>El viewport controla las dimensiones de la ventana visible del navegador.
        <code>device_scale_factor</code> simula pantallas de alta densidad (Retina, HiDPI).</p>

        <div class="code-tabs" data-code-id="L091-2">
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
            <pre><code class="language-python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Viewport de escritorio estándar
    ctx_desktop = browser.new_context(
        viewport={"width": 1920, "height": 1080}
    )

    # Viewport de tablet
    ctx_tablet = browser.new_context(
        viewport={"width": 768, "height": 1024},
        device_scale_factor=2  # Retina display
    )

    # Viewport mobile
    ctx_mobile = browser.new_context(
        viewport={"width": 375, "height": 812},
        device_scale_factor=3,
        is_mobile=True,          # Habilita meta viewport
        has_touch=True            # Habilita eventos táctiles
    )

    # Probar responsive design
    for ctx, nombre in [
        (ctx_desktop, "desktop"),
        (ctx_tablet, "tablet"),
        (ctx_mobile, "mobile")
    ]:
        page = ctx.new_page()
        page.goto("https://mi-erp.siesa.com")
        page.screenshot(path=f"screenshot_{nombre}.png")
        ctx.close()

    browser.close()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">import { chromium } from 'playwright';

const browser = await chromium.launch();

// Viewport de escritorio estándar
const ctxDesktop = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
});

// Viewport de tablet
const ctxTablet = await browser.newContext({
    viewport: { width: 768, height: 1024 },
    deviceScaleFactor: 2  // Retina display
});

// Viewport mobile
const ctxMobile = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 3,
    isMobile: true,          // Habilita meta viewport
    hasTouch: true            // Habilita eventos táctiles
});

// Probar responsive design
const contexts = [
    { ctx: ctxDesktop, nombre: 'desktop' },
    { ctx: ctxTablet, nombre: 'tablet' },
    { ctx: ctxMobile, nombre: 'mobile' }
];

for (const { ctx, nombre } of contexts) {
    const page = await ctx.newPage();
    await page.goto('https://mi-erp.siesa.com');
    await page.screenshot({ path: \`screenshot_\${nombre}.png\` });
    await ctx.close();
}

await browser.close();</code></pre>
        </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>En SIESA, los módulos ERP se usan en pantallas de distintos tamaños:
            monitores de escritorio (1920×1080), laptops (1366×768) y ocasionalmente tablets.
            Configura viewports que reflejen los <strong>dispositivos reales de los usuarios</strong>
            del ERP para detectar problemas de layout antes de producción.</p>
        </div>

        <h3>📱 3. Emulación de dispositivos</h3>
        <p>Playwright incluye un registro de dispositivos predefinidos con viewport, user-agent,
        <code>device_scale_factor</code>, <code>is_mobile</code> y <code>has_touch</code> ya configurados.</p>

        <div class="code-tabs" data-code-id="L091-3">
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
            <pre><code class="language-python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Emular iPhone 13
    iphone = p.devices["iPhone 13"]
    ctx_iphone = browser.new_context(**iphone)
    page_iphone = ctx_iphone.new_page()
    page_iphone.goto("https://example.com")
    print(f"iPhone 13 viewport: {iphone['viewport']}")
    # {'width': 390, 'height': 844}

    # Emular Pixel 5
    pixel = p.devices["Pixel 5"]
    ctx_pixel = browser.new_context(**pixel)
    page_pixel = ctx_pixel.new_page()
    page_pixel.goto("https://example.com")
    print(f"Pixel 5 viewport: {pixel['viewport']}")
    # {'width': 393, 'height': 851}

    # Emular iPad Pro
    ipad = p.devices["iPad Pro 11"]
    ctx_ipad = browser.new_context(**ipad)
    page_ipad = ctx_ipad.new_page()
    page_ipad.goto("https://example.com")

    # Se pueden extender las opciones del dispositivo
    ctx_custom_iphone = browser.new_context(
        **iphone,
        locale="es-CO",
        timezone_id="America/Bogota",
        color_scheme="dark"
    )

    ctx_iphone.close()
    ctx_pixel.close()
    ctx_ipad.close()
    ctx_custom_iphone.close()
    browser.close()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">import { chromium, devices } from 'playwright';

const browser = await chromium.launch();

// Emular iPhone 13
const iPhone = devices['iPhone 13'];
const ctxIphone = await browser.newContext({ ...iPhone });
const pageIphone = await ctxIphone.newPage();
await pageIphone.goto('https://example.com');
console.log(\`iPhone 13 viewport: \${JSON.stringify(iPhone.viewport)}\`);
// { width: 390, height: 844 }

// Emular Pixel 5
const pixel = devices['Pixel 5'];
const ctxPixel = await browser.newContext({ ...pixel });
const pagePixel = await ctxPixel.newPage();
await pagePixel.goto('https://example.com');
console.log(\`Pixel 5 viewport: \${JSON.stringify(pixel.viewport)}\`);
// { width: 393, height: 851 }

// Emular iPad Pro
const iPad = devices['iPad Pro 11'];
const ctxIpad = await browser.newContext({ ...iPad });
const pageIpad = await ctxIpad.newPage();
await pageIpad.goto('https://example.com');

// Se pueden extender las opciones del dispositivo
const ctxCustomIphone = await browser.newContext({
    ...iPhone,
    locale: 'es-CO',
    timezoneId: 'America/Bogota',
    colorScheme: 'dark'
});

await ctxIphone.close();
await ctxPixel.close();
await ctxIpad.close();
await ctxCustomIphone.close();
await browser.close();</code></pre>
        </div>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Dispositivos disponibles comunes</h4>
            <div class="code-tabs" data-code-id="L091-4">
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
                <pre><code class="language-python"># Ver todos los dispositivos disponibles
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    # Lista parcial de dispositivos predefinidos
    dispositivos_comunes = [
        "iPhone 13", "iPhone 13 Pro", "iPhone 13 Pro Max",
        "iPhone 14", "iPhone 14 Pro", "iPhone 14 Pro Max",
        "Pixel 5", "Pixel 7",
        "Galaxy S8", "Galaxy S9+", "Galaxy Tab S4",
        "iPad (gen 7)", "iPad Pro 11",
        "Desktop Chrome", "Desktop Firefox", "Desktop Safari"
    ]

    for nombre in dispositivos_comunes:
        if nombre in p.devices:
            d = p.devices[nombre]
            print(f"{nombre}: {d['viewport']} - scale: {d.get('device_scale_factor', 1)}")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Ver todos los dispositivos disponibles
import { devices } from 'playwright';

// Lista parcial de dispositivos predefinidos
const dispositivosComunes = [
    'iPhone 13', 'iPhone 13 Pro', 'iPhone 13 Pro Max',
    'iPhone 14', 'iPhone 14 Pro', 'iPhone 14 Pro Max',
    'Pixel 5', 'Pixel 7',
    'Galaxy S8', 'Galaxy S9+', 'Galaxy Tab S4',
    'iPad (gen 7)', 'iPad Pro 11',
    'Desktop Chrome', 'Desktop Firefox', 'Desktop Safari'
];

for (const nombre of dispositivosComunes) {
    if (nombre in devices) {
        const d = devices[nombre];
        console.log(\`\${nombre}: \${JSON.stringify(d.viewport)} - scale: \${d.deviceScaleFactor ?? 1}\`);
    }
}</code></pre>
            </div>
            </div>
        </div>

        <h3>📍 4. Geolocalización</h3>
        <p>Puedes establecer una ubicación geográfica falsa para el contexto del navegador.
        Esto es fundamental para probar aplicaciones que usan la API de geolocalización.</p>

        <div class="code-tabs" data-code-id="L091-5">
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
            <pre><code class="language-python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Configurar geolocalización para Cali, Colombia
    context = browser.new_context(
        geolocation={"latitude": 3.4516, "longitude": -76.5320},
        permissions=["geolocation"]  # Conceder permiso automáticamente
    )

    page = context.new_page()
    page.goto("https://maps.google.com")

    # Obtener coordenadas vía JavaScript
    coords = page.evaluate("""() => {
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude
                })
            );
        });
    }""")
    print(f"Lat: {coords['lat']}, Lon: {coords['lon']}")
    # Lat: 3.4516, Lon: -76.532

    # Cambiar geolocalización durante la sesión
    context.set_geolocation({"latitude": 4.6097, "longitude": -74.0818})
    # Ahora apunta a Bogotá

    context.close()
    browser.close()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">import { chromium } from 'playwright';

const browser = await chromium.launch();

// Configurar geolocalización para Cali, Colombia
const context = await browser.newContext({
    geolocation: { latitude: 3.4516, longitude: -76.5320 },
    permissions: ['geolocation']  // Conceder permiso automáticamente
});

const page = await context.newPage();
await page.goto('https://maps.google.com');

// Obtener coordenadas vía JavaScript
const coords = await page.evaluate(() => {
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({
                lat: pos.coords.latitude,
                lon: pos.coords.longitude
            })
        );
    });
});
console.log(\`Lat: \${coords.lat}, Lon: \${coords.lon}\`);
// Lat: 3.4516, Lon: -76.532

// Cambiar geolocalización durante la sesión
await context.setGeolocation({ latitude: 4.6097, longitude: -74.0818 });
// Ahora apunta a Bogotá

await context.close();
await browser.close();</code></pre>
        </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>Si el ERP o portal de SIESA valida la ubicación del usuario (por ejemplo, para
            restringir acceso a ciertas sedes o para registros de asistencia geolocalizados
            en HCM), usa geolocalización falsa para verificar que las validaciones
            funcionan correctamente con coordenadas dentro y fuera del rango permitido.</p>
        </div>

        <h3>🌐 5. Locale y timezone</h3>
        <p>Controlar el idioma y la zona horaria permite probar la internacionalización
        y la representación correcta de fechas, números y moneda.</p>

        <div class="code-tabs" data-code-id="L091-6">
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
            <pre><code class="language-python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Contexto con configuración colombiana
    ctx_colombia = browser.new_context(
        locale="es-CO",
        timezone_id="America/Bogota"
    )

    page = ctx_colombia.new_page()
    page.goto("https://example.com")

    # Verificar formato de fecha colombiano
    fecha = page.evaluate("""() => {
        return new Date('2026-04-04T10:30:00Z').toLocaleString();
    }""")
    print(f"Colombia: {fecha}")
    # "4/4/2026, 5:30:00 a. m." (UTC-5)

    # Verificar formato de moneda
    moneda = page.evaluate("""() => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency', currency: 'COP'
        }).format(1500000);
    }""")
    print(f"Moneda: {moneda}")
    # "$ 1.500.000,00"

    ctx_colombia.close()

    # Contexto para pruebas en inglés (mercado internacional)
    ctx_us = browser.new_context(
        locale="en-US",
        timezone_id="America/New_York"
    )

    page_us = ctx_us.new_page()
    page_us.goto("https://example.com")

    fecha_us = page_us.evaluate("""() => {
        return new Date('2026-04-04T10:30:00Z').toLocaleString();
    }""")
    print(f"US: {fecha_us}")
    # "4/4/2026, 6:30:00 AM" (UTC-4)

    ctx_us.close()
    browser.close()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">import { chromium } from 'playwright';

const browser = await chromium.launch();

// Contexto con configuración colombiana
const ctxColombia = await browser.newContext({
    locale: 'es-CO',
    timezoneId: 'America/Bogota'
});

const page = await ctxColombia.newPage();
await page.goto('https://example.com');

// Verificar formato de fecha colombiano
const fecha = await page.evaluate(() => {
    return new Date('2026-04-04T10:30:00Z').toLocaleString();
});
console.log(\`Colombia: \${fecha}\`);
// "4/4/2026, 5:30:00 a. m." (UTC-5)

// Verificar formato de moneda
const moneda = await page.evaluate(() => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP'
    }).format(1500000);
});
console.log(\`Moneda: \${moneda}\`);
// "$ 1.500.000,00"

await ctxColombia.close();

// Contexto para pruebas en inglés (mercado internacional)
const ctxUs = await browser.newContext({
    locale: 'en-US',
    timezoneId: 'America/New_York'
});

const pageUs = await ctxUs.newPage();
await pageUs.goto('https://example.com');

const fechaUs = await pageUs.evaluate(() => {
    return new Date('2026-04-04T10:30:00Z').toLocaleString();
});
console.log(\`US: \${fechaUs}\`);
// "4/4/2026, 6:30:00 AM" (UTC-4)

await ctxUs.close();
await browser.close();</code></pre>
        </div>
        </div>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>❌ Error común: ignorar timezone en assertions</h4>
            <div class="code-tabs" data-code-id="L091-7">
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
                <pre><code class="language-python"># MAL: Aserción sin considerar timezone
def test_fecha_creacion(page):
    page.goto("/factura/nueva")
    page.click("button#crear")
    # La hora mostrada depende del timezone del context!
    fecha_texto = page.text_content(".fecha-creacion")
    assert "10:30" in fecha_texto  # Puede fallar si el timezone no es el esperado

# BIEN: Configurar timezone explícito
def test_fecha_creacion_con_timezone(page, browser):
    context = browser.new_context(timezone_id="America/Bogota")
    page = context.new_page()
    page.goto("/factura/nueva")
    page.click("button#crear")
    fecha_texto = page.text_content(".fecha-creacion")
    # Ahora sabemos que la hora está en zona colombiana (UTC-5)
    assert "05:30" in fecha_texto  # Consistente
    context.close()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// MAL: Aserción sin considerar timezone
test('fecha creacion', async ({ page }) => {
    await page.goto('/factura/nueva');
    await page.click('button#crear');
    // La hora mostrada depende del timezone del context!
    const fechaTexto = await page.textContent('.fecha-creacion');
    expect(fechaTexto).toContain('10:30'); // Puede fallar si el timezone no es el esperado
});

// BIEN: Configurar timezone explícito
test('fecha creacion con timezone', async ({ browser }) => {
    const context = await browser.newContext({ timezoneId: 'America/Bogota' });
    const page = await context.newPage();
    await page.goto('/factura/nueva');
    await page.click('button#crear');
    const fechaTexto = await page.textContent('.fecha-creacion');
    // Ahora sabemos que la hora está en zona colombiana (UTC-5)
    expect(fechaTexto).toContain('05:30'); // Consistente
    await context.close();
});</code></pre>
            </div>
            </div>
        </div>

        <h3>🎨 6. Color scheme (dark/light mode)</h3>
        <p>La opción <code>color_scheme</code> controla la preferencia de esquema de colores que
        el navegador reporta a la aplicación mediante <code>prefers-color-scheme</code>.</p>

        <div class="code-tabs" data-code-id="L091-8">
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
            <pre><code class="language-python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Probar modo oscuro
    ctx_dark = browser.new_context(color_scheme="dark")
    page_dark = ctx_dark.new_page()
    page_dark.goto("https://mi-app.siesa.com")

    # Verificar que el CSS de dark mode se aplica
    bg_color = page_dark.evaluate("""() => {
        return getComputedStyle(document.body).backgroundColor;
    }""")
    print(f"Dark mode background: {bg_color}")

    # Verificar media query
    is_dark = page_dark.evaluate("""() => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }""")
    assert is_dark is True

    page_dark.screenshot(path="dark_mode.png")
    ctx_dark.close()

    # Probar modo claro
    ctx_light = browser.new_context(color_scheme="light")
    page_light = ctx_light.new_page()
    page_light.goto("https://mi-app.siesa.com")
    page_light.screenshot(path="light_mode.png")
    ctx_light.close()

    # También se puede emular 'no-preference'
    ctx_none = browser.new_context(color_scheme="no-preference")
    ctx_none.close()

    browser.close()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">import { chromium } from 'playwright';

const browser = await chromium.launch();

// Probar modo oscuro
const ctxDark = await browser.newContext({ colorScheme: 'dark' });
const pageDark = await ctxDark.newPage();
await pageDark.goto('https://mi-app.siesa.com');

// Verificar que el CSS de dark mode se aplica
const bgColor = await pageDark.evaluate(() => {
    return getComputedStyle(document.body).backgroundColor;
});
console.log(\`Dark mode background: \${bgColor}\`);

// Verificar media query
const isDark = await pageDark.evaluate(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
});
expect(isDark).toBe(true);

await pageDark.screenshot({ path: 'dark_mode.png' });
await ctxDark.close();

// Probar modo claro
const ctxLight = await browser.newContext({ colorScheme: 'light' });
const pageLight = await ctxLight.newPage();
await pageLight.goto('https://mi-app.siesa.com');
await pageLight.screenshot({ path: 'light_mode.png' });
await ctxLight.close();

// También se puede emular 'no-preference'
const ctxNone = await browser.newContext({ colorScheme: 'no-preference' });
await ctxNone.close();

await browser.close();</code></pre>
        </div>
        </div>

        <h3>🔐 7. Permisos del navegador</h3>
        <p>Los permisos controlan el acceso a APIs del navegador que normalmente requieren
        autorización del usuario (diálogos de "Permitir/Bloquear").</p>

        <div class="code-tabs" data-code-id="L091-9">
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
            <pre><code class="language-python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Conceder múltiples permisos al crear el contexto
    context = browser.new_context(
        permissions=["geolocation", "notifications"]
    )

    page = context.new_page()
    page.goto("https://mi-app.siesa.com")

    # Conceder permisos adicionales después de crear el contexto
    context.grant_permissions(
        ["camera", "microphone"],
        origin="https://mi-app.siesa.com"  # Solo para este origen
    )

    # Verificar que las notificaciones están permitidas
    perm_status = page.evaluate("""async () => {
        const result = await navigator.permissions.query({name: 'notifications'});
        return result.state;
    }""")
    print(f"Notificaciones: {perm_status}")
    # "granted"

    # Limpiar permisos (volver a estado default)
    context.clear_permissions()

    context.close()
    browser.close()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">import { chromium } from 'playwright';

const browser = await chromium.launch();

// Conceder múltiples permisos al crear el contexto
const context = await browser.newContext({
    permissions: ['geolocation', 'notifications']
});

const page = await context.newPage();
await page.goto('https://mi-app.siesa.com');

// Conceder permisos adicionales después de crear el contexto
await context.grantPermissions(
    ['camera', 'microphone'],
    { origin: 'https://mi-app.siesa.com' }  // Solo para este origen
);

// Verificar que las notificaciones están permitidas
const permStatus = await page.evaluate(async () => {
    const result = await navigator.permissions.query({ name: 'notifications' });
    return result.state;
});
console.log(\`Notificaciones: \${permStatus}\`);
// "granted"

// Limpiar permisos (volver a estado default)
await context.clearPermissions();

await context.close();
await browser.close();</code></pre>
        </div>
        </div>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📋 Permisos disponibles</h4>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #1565c0; color: white;">
                    <th style="padding: 8px; text-align: left;">Permiso</th>
                    <th style="padding: 8px; text-align: left;">Uso</th>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px;"><code>"geolocation"</code></td>
                    <td style="padding: 8px;">Acceso a ubicación GPS</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><code>"notifications"</code></td>
                    <td style="padding: 8px;">Notificaciones push del navegador</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px;"><code>"camera"</code></td>
                    <td style="padding: 8px;">Acceso a cámara web</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><code>"microphone"</code></td>
                    <td style="padding: 8px;">Acceso a micrófono</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px;"><code>"clipboard-read"</code></td>
                    <td style="padding: 8px;">Leer del portapapeles</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><code>"clipboard-write"</code></td>
                    <td style="padding: 8px;">Escribir al portapapeles</td>
                </tr>
            </table>
        </div>

        <h3>🕵️ 8. Override del User-Agent</h3>
        <p>El <code>user_agent</code> identifica al navegador ante el servidor. Cambiarlo permite
        probar respuestas del servidor a diferentes navegadores o bots.</p>

        <div class="code-tabs" data-code-id="L091-10">
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
            <pre><code class="language-python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Simular un navegador móvil específico
    context = browser.new_context(
        user_agent="Mozilla/5.0 (Linux; Android 12; Pixel 5) "
                   "AppleWebKit/537.36 (KHTML, like Gecko) "
                   "Chrome/110.0.0.0 Mobile Safari/537.36"
    )

    page = context.new_page()
    page.goto("https://mi-app.siesa.com")

    # Verificar que el servidor responde con versión móvil
    is_mobile_version = page.is_visible(".mobile-nav")
    print(f"Versión móvil: {is_mobile_version}")

    # También puedes verificar el user-agent desde JS
    ua = page.evaluate("() => navigator.userAgent")
    print(f"User-Agent: {ua}")

    context.close()

    # Simular un bot/crawler para probar SEO
    ctx_bot = browser.new_context(
        user_agent="Googlebot/2.1 (+http://www.google.com/bot.html)"
    )
    page_bot = ctx_bot.new_page()
    page_bot.goto("https://mi-app.siesa.com")
    # Verificar que el contenido SEO está presente
    ctx_bot.close()

    browser.close()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">import { chromium } from 'playwright';

const browser = await chromium.launch();

// Simular un navegador móvil específico
const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Linux; Android 12; Pixel 5) ' +
               'AppleWebKit/537.36 (KHTML, like Gecko) ' +
               'Chrome/110.0.0.0 Mobile Safari/537.36'
});

const page = await context.newPage();
await page.goto('https://mi-app.siesa.com');

// Verificar que el servidor responde con versión móvil
const isMobileVersion = await page.isVisible('.mobile-nav');
console.log(\`Versión móvil: \${isMobileVersion}\`);

// También puedes verificar el user-agent desde JS
const ua = await page.evaluate(() => navigator.userAgent);
console.log(\`User-Agent: \${ua}\`);

await context.close();

// Simular un bot/crawler para probar SEO
const ctxBot = await browser.newContext({
    userAgent: 'Googlebot/2.1 (+http://www.google.com/bot.html)'
});
const pageBot = await ctxBot.newPage();
await pageBot.goto('https://mi-app.siesa.com');
// Verificar que el contenido SEO está presente
await ctxBot.close();

await browser.close();</code></pre>
        </div>
        </div>

        <h3>🔑 9. Credenciales HTTP (Basic Auth)</h3>
        <p>Para sitios protegidos con autenticación HTTP básica, puedes proporcionar
        credenciales directamente en el contexto sin manejar diálogos.</p>

        <div class="code-tabs" data-code-id="L091-11">
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
            <pre><code class="language-python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Configurar credenciales HTTP
    context = browser.new_context(
        http_credentials={
            "username": "admin",
            "password": "secreto123"
        }
    )

    page = context.new_page()

    # El navegador envía las credenciales automáticamente
    # No aparece el diálogo de autenticación
    page.goto("https://staging.siesa.com/admin")

    # Verificar acceso exitoso
    assert page.title() != "401 Unauthorized"
    print("Autenticación HTTP exitosa")

    context.close()

    # También se pueden enviar credenciales para un proxy
    ctx_proxy = browser.new_context(
        proxy={
            "server": "http://proxy.siesa.com:8080",
            "username": "proxy_user",
            "password": "proxy_pass"
        }
    )
    ctx_proxy.close()

    browser.close()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">import { chromium } from 'playwright';

const browser = await chromium.launch();

// Configurar credenciales HTTP
const context = await browser.newContext({
    httpCredentials: {
        username: 'admin',
        password: 'secreto123'
    }
});

const page = await context.newPage();

// El navegador envía las credenciales automáticamente
// No aparece el diálogo de autenticación
await page.goto('https://staging.siesa.com/admin');

// Verificar acceso exitoso
const title = await page.title();
expect(title).not.toBe('401 Unauthorized');
console.log('Autenticación HTTP exitosa');

await context.close();

// También se pueden enviar credenciales para un proxy
const ctxProxy = await browser.newContext({
    proxy: {
        server: 'http://proxy.siesa.com:8080',
        username: 'proxy_user',
        password: 'proxy_pass'
    }
});
await ctxProxy.close();

await browser.close();</code></pre>
        </div>
        </div>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>❌ Nunca hardcodees credenciales en el código</h4>
            <div class="code-tabs" data-code-id="L091-12">
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
                <pre><code class="language-python">import os

# MAL: credenciales hardcodeadas
context = browser.new_context(
    http_credentials={"username": "admin", "password": "123456"}
)

# BIEN: usar variables de entorno
context = browser.new_context(
    http_credentials={
        "username": os.environ["HTTP_USER"],
        "password": os.environ["HTTP_PASS"]
    }
)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// MAL: credenciales hardcodeadas
const context = await browser.newContext({
    httpCredentials: { username: 'admin', password: '123456' }
});

// BIEN: usar variables de entorno
const contextSafe = await browser.newContext({
    httpCredentials: {
        username: process.env.HTTP_USER!,
        password: process.env.HTTP_PASS!
    }
});</code></pre>
            </div>
            </div>
        </div>

        <h3>📡 10. Modo offline</h3>
        <p>Playwright permite simular la pérdida de conexión a internet para probar
        el comportamiento offline de la aplicación.</p>

        <div class="code-tabs" data-code-id="L091-13">
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
            <pre><code class="language-python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context()
    page = context.new_page()

    # Cargar la aplicación normalmente
    page.goto("https://mi-app.siesa.com")
    assert page.is_visible(".dashboard")

    # Activar modo offline
    context.set_offline(True)

    # Intentar navegar — debe fallar o mostrar contenido cacheado
    try:
        page.goto("https://mi-app.siesa.com/otra-pagina")
    except Exception as e:
        print(f"Error esperado en modo offline: {e}")

    # Verificar comportamiento offline de la app
    # (Service Workers, almacenamiento local, mensajes de error)
    offline_msg = page.is_visible(".offline-indicator")
    print(f"Indicador offline visible: {offline_msg}")

    # Restaurar la conexión
    context.set_offline(False)

    # Verificar reconexión
    page.goto("https://mi-app.siesa.com/dashboard")
    assert page.is_visible(".dashboard")

    context.close()
    browser.close()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">import { chromium } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

// Cargar la aplicación normalmente
await page.goto('https://mi-app.siesa.com');
await expect(page.locator('.dashboard')).toBeVisible();

// Activar modo offline
await context.setOffline(true);

// Intentar navegar — debe fallar o mostrar contenido cacheado
try {
    await page.goto('https://mi-app.siesa.com/otra-pagina');
} catch (e) {
    console.log(\`Error esperado en modo offline: \${e}\`);
}

// Verificar comportamiento offline de la app
// (Service Workers, almacenamiento local, mensajes de error)
const offlineMsg = await page.isVisible('.offline-indicator');
console.log(\`Indicador offline visible: \${offlineMsg}\`);

// Restaurar la conexión
await context.setOffline(false);

// Verificar reconexión
await page.goto('https://mi-app.siesa.com/dashboard');
await expect(page.locator('.dashboard')).toBeVisible();

await context.close();
await browser.close();</code></pre>
        </div>
        </div>

        <h3>📨 11. Extra HTTP headers</h3>
        <p>Puedes agregar headers HTTP personalizados que se enviarán con cada solicitud
        del contexto. Útil para tokens, identificadores de prueba o cabeceras de monitoreo.</p>

        <div class="code-tabs" data-code-id="L091-14">
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
            <pre><code class="language-python">from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Agregar headers personalizados al contexto
    context = browser.new_context(
        extra_http_headers={
            "X-Test-ID": "suite-regresion-2026",
            "X-Environment": "staging",
            "Accept-Language": "es-CO,es;q=0.9"
        }
    )

    page = context.new_page()

    # Verificar que los headers se envían
    def on_request(request):
        headers = request.headers
        if "x-test-id" in headers:
            print(f"Header enviado: X-Test-ID = {headers['x-test-id']}")

    page.on("request", on_request)
    page.goto("https://mi-app.siesa.com")

    context.close()

    # También se pueden establecer headers a nivel de página
    context2 = browser.new_context()
    page2 = context2.new_page()
    page2.set_extra_http_headers({
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9...",
        "X-Custom-Header": "valor-personalizado"
    })
    page2.goto("https://api.siesa.com/dashboard")

    context2.close()
    browser.close()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">import { chromium } from 'playwright';

const browser = await chromium.launch();

// Agregar headers personalizados al contexto
const context = await browser.newContext({
    extraHTTPHeaders: {
        'X-Test-ID': 'suite-regresion-2026',
        'X-Environment': 'staging',
        'Accept-Language': 'es-CO,es;q=0.9'
    }
});

const page = await context.newPage();

// Verificar que los headers se envían
page.on('request', (request) => {
    const headers = request.headers();
    if (headers['x-test-id']) {
        console.log(\`Header enviado: X-Test-ID = \${headers['x-test-id']}\`);
    }
});
await page.goto('https://mi-app.siesa.com');

await context.close();

// También se pueden establecer headers a nivel de página
const context2 = await browser.newContext();
const page2 = await context2.newPage();
await page2.setExtraHTTPHeaders({
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9...',
    'X-Custom-Header': 'valor-personalizado'
});
await page2.goto('https://api.siesa.com/dashboard');

await context2.close();
await browser.close();</code></pre>
        </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>Agregar un header <code>X-Test-ID</code> en las pruebas permite filtrar las
            solicitudes de prueba en los logs del servidor. Así el equipo de infraestructura
            puede distinguir tráfico de prueba del tráfico real, y los datos generados
            durante la automatización se pueden limpiar fácilmente.</p>
        </div>

        <h3>🔗 12. Combinando múltiples opciones en new_context()</h3>
        <p>El poder real está en combinar varias opciones para crear perfiles completos
        que simulan escenarios reales de usuarios.</p>

        <div class="code-tabs" data-code-id="L091-15">
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
            <pre><code class="language-python">from playwright.sync_api import sync_playwright
import os

with sync_playwright() as p:
    browser = p.chromium.launch()

    # --- Perfil: Usuario móvil colombiano en campo ---
    iphone = p.devices["iPhone 13"]
    ctx_campo = browser.new_context(
        **iphone,
        locale="es-CO",
        timezone_id="America/Bogota",
        geolocation={"latitude": 3.4516, "longitude": -76.5320},
        permissions=["geolocation"],
        color_scheme="light",
        extra_http_headers={
            "X-Test-Profile": "mobile-field-user",
            "X-Region": "valle-del-cauca"
        }
    )

    page_campo = ctx_campo.new_page()
    page_campo.goto("https://mi-app.siesa.com")
    page_campo.screenshot(path="perfil_campo_mobile.png")
    ctx_campo.close()

    # --- Perfil: Administrador en oficina con dark mode ---
    ctx_admin = browser.new_context(
        viewport={"width": 1920, "height": 1080},
        locale="es-CO",
        timezone_id="America/Bogota",
        color_scheme="dark",
        http_credentials={
            "username": os.environ.get("ADMIN_USER", "admin"),
            "password": os.environ.get("ADMIN_PASS", "pass")
        },
        extra_http_headers={
            "X-Test-Profile": "admin-office",
            "X-Test-ID": "regression-2026"
        },
        permissions=["clipboard-read", "clipboard-write", "notifications"]
    )

    page_admin = ctx_admin.new_page()
    page_admin.goto("https://mi-app.siesa.com/admin")
    page_admin.screenshot(path="perfil_admin_dark.png")
    ctx_admin.close()

    # --- Perfil: QA Medellín probando offline ---
    ctx_offline = browser.new_context(
        viewport={"width": 1366, "height": 768},
        locale="es-CO",
        timezone_id="America/Bogota",
        geolocation={"latitude": 6.2442, "longitude": -75.5812},
        permissions=["geolocation"]
    )

    page_offline = ctx_offline.new_page()
    page_offline.goto("https://mi-app.siesa.com")
    # Simular pérdida de conexión
    ctx_offline.set_offline(True)
    page_offline.screenshot(path="perfil_qa_offline.png")
    ctx_offline.set_offline(False)
    ctx_offline.close()

    browser.close()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">import { chromium, devices } from 'playwright';

const browser = await chromium.launch();

// --- Perfil: Usuario móvil colombiano en campo ---
const iPhone = devices['iPhone 13'];
const ctxCampo = await browser.newContext({
    ...iPhone,
    locale: 'es-CO',
    timezoneId: 'America/Bogota',
    geolocation: { latitude: 3.4516, longitude: -76.5320 },
    permissions: ['geolocation'],
    colorScheme: 'light',
    extraHTTPHeaders: {
        'X-Test-Profile': 'mobile-field-user',
        'X-Region': 'valle-del-cauca'
    }
});

const pageCampo = await ctxCampo.newPage();
await pageCampo.goto('https://mi-app.siesa.com');
await pageCampo.screenshot({ path: 'perfil_campo_mobile.png' });
await ctxCampo.close();

// --- Perfil: Administrador en oficina con dark mode ---
const ctxAdmin = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    locale: 'es-CO',
    timezoneId: 'America/Bogota',
    colorScheme: 'dark',
    httpCredentials: {
        username: process.env.ADMIN_USER ?? 'admin',
        password: process.env.ADMIN_PASS ?? 'pass'
    },
    extraHTTPHeaders: {
        'X-Test-Profile': 'admin-office',
        'X-Test-ID': 'regression-2026'
    },
    permissions: ['clipboard-read', 'clipboard-write', 'notifications']
});

const pageAdmin = await ctxAdmin.newPage();
await pageAdmin.goto('https://mi-app.siesa.com/admin');
await pageAdmin.screenshot({ path: 'perfil_admin_dark.png' });
await ctxAdmin.close();

// --- Perfil: QA Medellín probando offline ---
const ctxOffline = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    locale: 'es-CO',
    timezoneId: 'America/Bogota',
    geolocation: { latitude: 6.2442, longitude: -75.5812 },
    permissions: ['geolocation']
});

const pageOffline = await ctxOffline.newPage();
await pageOffline.goto('https://mi-app.siesa.com');
// Simular pérdida de conexión
await ctxOffline.setOffline(true);
await pageOffline.screenshot({ path: 'perfil_qa_offline.png' });
await ctxOffline.setOffline(false);
await ctxOffline.close();

await browser.close();</code></pre>
        </div>
        </div>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔬 Avanzado: Factory de perfiles con pytest</h4>
            <div class="code-tabs" data-code-id="L091-16">
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
                <pre><code class="language-python"># conftest.py — Factory de perfiles reutilizables
import pytest
import os

PERFILES = {
    "mobile_cali": {
        "device": "iPhone 13",
        "locale": "es-CO",
        "timezone_id": "America/Bogota",
        "geolocation": {"latitude": 3.4516, "longitude": -76.5320},
        "permissions": ["geolocation"],
        "color_scheme": "light"
    },
    "desktop_bogota": {
        "viewport": {"width": 1920, "height": 1080},
        "locale": "es-CO",
        "timezone_id": "America/Bogota",
        "color_scheme": "dark"
    },
    "tablet_medellin": {
        "device": "iPad Pro 11",
        "locale": "es-CO",
        "timezone_id": "America/Bogota",
        "geolocation": {"latitude": 6.2442, "longitude": -75.5812},
        "permissions": ["geolocation"]
    }
}


@pytest.fixture
def profile_context(playwright, browser):
    """Fixture que crea un context a partir de un perfil."""
    contexts = []

    def _create(profile_name, **overrides):
        config = PERFILES[profile_name].copy()

        # Si incluye un dispositivo, expandirlo
        if "device" in config:
            device_name = config.pop("device")
            device_config = playwright.devices[device_name]
            config = {**device_config, **config}

        # Aplicar overrides
        config.update(overrides)

        ctx = browser.new_context(**config)
        contexts.append(ctx)
        return ctx

    yield _create

    for ctx in contexts:
        ctx.close()


# test_perfiles.py
def test_dashboard_mobile_cali(profile_context):
    """Verificar dashboard en perfil móvil de Cali."""
    ctx = profile_context("mobile_cali")
    page = ctx.new_page()
    page.goto("https://mi-app.siesa.com/dashboard")
    # El dashboard debe adaptarse a viewport móvil
    assert page.is_visible(".mobile-menu")
    assert not page.is_visible(".sidebar-desktop")


def test_dashboard_desktop_bogota(profile_context):
    """Verificar dashboard en perfil de escritorio Bogotá."""
    ctx = profile_context("desktop_bogota")
    page = ctx.new_page()
    page.goto("https://mi-app.siesa.com/dashboard")
    assert page.is_visible(".sidebar-desktop")

    # Verificar dark mode
    bg = page.evaluate(
        "() => getComputedStyle(document.body).backgroundColor"
    )
    # Color oscuro esperado
    assert bg != "rgb(255, 255, 255)"


def test_con_override(profile_context):
    """Perfil base con override de color scheme."""
    ctx = profile_context("mobile_cali", color_scheme="dark")
    page = ctx.new_page()
    page.goto("https://mi-app.siesa.com")
    is_dark = page.evaluate("""() =>
        window.matchMedia('(prefers-color-scheme: dark)').matches
    """)
    assert is_dark is True</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// fixtures.ts — Factory de perfiles reutilizables
import { test as base, devices, BrowserContext } from '@playwright/test';

const PERFILES = {
    mobile_cali: {
        device: 'iPhone 13',
        locale: 'es-CO',
        timezoneId: 'America/Bogota',
        geolocation: { latitude: 3.4516, longitude: -76.5320 },
        permissions: ['geolocation'] as string[],
        colorScheme: 'light' as const
    },
    desktop_bogota: {
        viewport: { width: 1920, height: 1080 },
        locale: 'es-CO',
        timezoneId: 'America/Bogota',
        colorScheme: 'dark' as const
    },
    tablet_medellin: {
        device: 'iPad Pro 11',
        locale: 'es-CO',
        timezoneId: 'America/Bogota',
        geolocation: { latitude: 6.2442, longitude: -75.5812 },
        permissions: ['geolocation'] as string[]
    }
};

type ProfileName = keyof typeof PERFILES;

// Fixture personalizada que crea un context a partir de un perfil
const test = base.extend<{
    profileContext: (name: ProfileName, overrides?: Record&lt;string, any&gt;) => Promise&lt;BrowserContext&gt;;
}>({
    profileContext: async ({ browser }, use) => {
        const contexts: BrowserContext[] = [];

        const create = async (name: ProfileName, overrides: Record&lt;string, any&gt; = {}) => {
            const profile = { ...PERFILES[name] };
            let config: Record&lt;string, any&gt; = {};

            // Si incluye un dispositivo, expandirlo
            if ('device' in profile) {
                const deviceName = profile.device as string;
                const deviceConfig = devices[deviceName];
                config = { ...deviceConfig };
                delete (profile as any).device;
            }

            config = { ...config, ...profile, ...overrides };
            const ctx = await browser.newContext(config);
            contexts.push(ctx);
            return ctx;
        };

        await use(create);

        for (const ctx of contexts) {
            await ctx.close();
        }
    }
});

// test_perfiles.spec.ts
test('dashboard mobile Cali', async ({ profileContext }) => {
    const ctx = await profileContext('mobile_cali');
    const page = await ctx.newPage();
    await page.goto('https://mi-app.siesa.com/dashboard');
    // El dashboard debe adaptarse a viewport móvil
    await expect(page.locator('.mobile-menu')).toBeVisible();
    await expect(page.locator('.sidebar-desktop')).not.toBeVisible();
});

test('dashboard desktop Bogotá', async ({ profileContext }) => {
    const ctx = await profileContext('desktop_bogota');
    const page = await ctx.newPage();
    await page.goto('https://mi-app.siesa.com/dashboard');
    await expect(page.locator('.sidebar-desktop')).toBeVisible();

    // Verificar dark mode
    const bg = await page.evaluate(
        () => getComputedStyle(document.body).backgroundColor
    );
    // Color oscuro esperado
    expect(bg).not.toBe('rgb(255, 255, 255)');
});

test('con override', async ({ profileContext }) => {
    const ctx = await profileContext('mobile_cali', { colorScheme: 'dark' });
    const page = await ctx.newPage();
    await page.goto('https://mi-app.siesa.com');
    const isDark = await page.evaluate(() =>
        window.matchMedia('(prefers-color-scheme: dark)').matches
    );
    expect(isDark).toBe(true);
});</code></pre>
            </div>
            </div>
        </div>

        <h3>🏋️ Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Ejercicio: Suite de perfiles multi-dispositivo</h4>
            <p>Crea un test que verifique la aplicación bajo 3 perfiles distintos usando
            configuraciones combinadas de viewport, locale, timezone y color scheme.</p>

            <div class="code-tabs" data-code-id="L091-17">
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
                <pre><code class="language-python"># ejercicio_perfiles.py
# Objetivo: Crear tests para 3 perfiles de usuario distintos
from playwright.sync_api import sync_playwright
import os

def test_perfiles():
    """
    Completa el ejercicio:
    1. Define 3 perfiles: mobile_vendedor, desktop_contador, tablet_gerente
    2. Cada perfil debe tener: viewport, locale, timezone, color_scheme
    3. El perfil mobile_vendedor debe incluir geolocalización (Cali)
    4. El perfil desktop_contador debe incluir extra_http_headers
    5. Visita https://example.com con cada perfil
    6. Toma un screenshot con nombre descriptivo para cada uno
    7. Verifica que el viewport actual coincide con el configurado
    """
    with sync_playwright() as p:
        browser = p.chromium.launch()

        # TODO: Perfil 1 - Vendedor en campo (mobile, Cali)
        # Usa p.devices["iPhone 13"]
        # locale="es-CO", timezone_id="America/Bogota"
        # geolocation=Cali (3.4516, -76.5320)
        # color_scheme="light"

        # TODO: Perfil 2 - Contador en oficina (desktop, dark mode)
        # viewport=1920x1080
        # locale="es-CO", timezone_id="America/Bogota"
        # color_scheme="dark"
        # extra_http_headers: X-Role=contador

        # TODO: Perfil 3 - Gerente con tablet (iPad Pro)
        # Usa p.devices["iPad Pro 11"]
        # locale="es-CO", timezone_id="America/Bogota"
        # color_scheme="light"

        # Para cada perfil:
        # 1. Crear contexto con browser.new_context(**config)
        # 2. Crear página y navegar a https://example.com
        # 3. Verificar viewport con page.evaluate("() => ({w: window.innerWidth, h: window.innerHeight})")
        # 4. Tomar screenshot
        # 5. Cerrar contexto

        browser.close()

if __name__ == "__main__":
    test_perfiles()
    print("Todos los perfiles ejecutados correctamente")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// ejercicio_perfiles.spec.ts
// Objetivo: Crear tests para 3 perfiles de usuario distintos
import { chromium, devices } from 'playwright';

async function testPerfiles() {
    /**
     * Completa el ejercicio:
     * 1. Define 3 perfiles: mobile_vendedor, desktop_contador, tablet_gerente
     * 2. Cada perfil debe tener: viewport, locale, timezoneId, colorScheme
     * 3. El perfil mobile_vendedor debe incluir geolocalización (Cali)
     * 4. El perfil desktop_contador debe incluir extraHTTPHeaders
     * 5. Visita https://example.com con cada perfil
     * 6. Toma un screenshot con nombre descriptivo para cada uno
     * 7. Verifica que el viewport actual coincide con el configurado
     */
    const browser = await chromium.launch();

    // TODO: Perfil 1 - Vendedor en campo (mobile, Cali)
    // Usa devices['iPhone 13']
    // locale: 'es-CO', timezoneId: 'America/Bogota'
    // geolocation: Cali (3.4516, -76.5320)
    // colorScheme: 'light'

    // TODO: Perfil 2 - Contador en oficina (desktop, dark mode)
    // viewport: { width: 1920, height: 1080 }
    // locale: 'es-CO', timezoneId: 'America/Bogota'
    // colorScheme: 'dark'
    // extraHTTPHeaders: { 'X-Role': 'contador' }

    // TODO: Perfil 3 - Gerente con tablet (iPad Pro)
    // Usa devices['iPad Pro 11']
    // locale: 'es-CO', timezoneId: 'America/Bogota'
    // colorScheme: 'light'

    // Para cada perfil:
    // 1. Crear contexto con browser.newContext(config)
    // 2. Crear página y navegar a https://example.com
    // 3. Verificar viewport con page.evaluate(() => ({ w: window.innerWidth, h: window.innerHeight }))
    // 4. Tomar screenshot
    // 5. Cerrar contexto

    await browser.close();
}

testPerfiles().then(() => console.log('Todos los perfiles ejecutados correctamente'));</code></pre>
            </div>
            </div>

            <details>
                <summary>Ver solución</summary>
                <div class="code-tabs" data-code-id="L091-18">
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
                    <pre><code class="language-python"># solucion_perfiles.py
from playwright.sync_api import sync_playwright

def test_perfiles():
    with sync_playwright() as p:
        browser = p.chromium.launch()

        # --- Perfil 1: Vendedor en campo (mobile, Cali) ---
        iphone = p.devices["iPhone 13"]
        ctx_vendedor = browser.new_context(
            **iphone,
            locale="es-CO",
            timezone_id="America/Bogota",
            geolocation={"latitude": 3.4516, "longitude": -76.5320},
            permissions=["geolocation"],
            color_scheme="light"
        )
        page_v = ctx_vendedor.new_page()
        page_v.goto("https://example.com")
        vp_v = page_v.evaluate("() => ({w: window.innerWidth, h: window.innerHeight})")
        print(f"Vendedor viewport: {vp_v['w']}x{vp_v['h']}")
        assert vp_v["w"] == iphone["viewport"]["width"]
        page_v.screenshot(path="perfil_vendedor_mobile.png")
        ctx_vendedor.close()

        # --- Perfil 2: Contador en oficina (desktop, dark) ---
        ctx_contador = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            locale="es-CO",
            timezone_id="America/Bogota",
            color_scheme="dark",
            extra_http_headers={"X-Role": "contador"}
        )
        page_c = ctx_contador.new_page()
        page_c.goto("https://example.com")
        vp_c = page_c.evaluate("() => ({w: window.innerWidth, h: window.innerHeight})")
        print(f"Contador viewport: {vp_c['w']}x{vp_c['h']}")
        assert vp_c["w"] == 1920
        is_dark = page_c.evaluate(
            "() => window.matchMedia('(prefers-color-scheme: dark)').matches"
        )
        assert is_dark is True
        page_c.screenshot(path="perfil_contador_desktop.png")
        ctx_contador.close()

        # --- Perfil 3: Gerente con tablet (iPad Pro) ---
        ipad = p.devices["iPad Pro 11"]
        ctx_gerente = browser.new_context(
            **ipad,
            locale="es-CO",
            timezone_id="America/Bogota",
            color_scheme="light"
        )
        page_g = ctx_gerente.new_page()
        page_g.goto("https://example.com")
        vp_g = page_g.evaluate("() => ({w: window.innerWidth, h: window.innerHeight})")
        print(f"Gerente viewport: {vp_g['w']}x{vp_g['h']}")
        assert vp_g["w"] == ipad["viewport"]["width"]
        page_g.screenshot(path="perfil_gerente_tablet.png")
        ctx_gerente.close()

        browser.close()
        print("Todos los perfiles verificados correctamente")

if __name__ == "__main__":
    test_perfiles()</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-typescript">// solucion_perfiles.spec.ts
import { chromium, devices } from 'playwright';

async function testPerfiles() {
    const browser = await chromium.launch();

    // --- Perfil 1: Vendedor en campo (mobile, Cali) ---
    const iPhone = devices['iPhone 13'];
    const ctxVendedor = await browser.newContext({
        ...iPhone,
        locale: 'es-CO',
        timezoneId: 'America/Bogota',
        geolocation: { latitude: 3.4516, longitude: -76.5320 },
        permissions: ['geolocation'],
        colorScheme: 'light'
    });
    const pageV = await ctxVendedor.newPage();
    await pageV.goto('https://example.com');
    const vpV = await pageV.evaluate(() => ({ w: window.innerWidth, h: window.innerHeight }));
    console.log(\`Vendedor viewport: \${vpV.w}x\${vpV.h}\`);
    expect(vpV.w).toBe(iPhone.viewport.width);
    await pageV.screenshot({ path: 'perfil_vendedor_mobile.png' });
    await ctxVendedor.close();

    // --- Perfil 2: Contador en oficina (desktop, dark) ---
    const ctxContador = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        locale: 'es-CO',
        timezoneId: 'America/Bogota',
        colorScheme: 'dark',
        extraHTTPHeaders: { 'X-Role': 'contador' }
    });
    const pageC = await ctxContador.newPage();
    await pageC.goto('https://example.com');
    const vpC = await pageC.evaluate(() => ({ w: window.innerWidth, h: window.innerHeight }));
    console.log(\`Contador viewport: \${vpC.w}x\${vpC.h}\`);
    expect(vpC.w).toBe(1920);
    const isDark = await pageC.evaluate(
        () => window.matchMedia('(prefers-color-scheme: dark)').matches
    );
    expect(isDark).toBe(true);
    await pageC.screenshot({ path: 'perfil_contador_desktop.png' });
    await ctxContador.close();

    // --- Perfil 3: Gerente con tablet (iPad Pro) ---
    const iPad = devices['iPad Pro 11'];
    const ctxGerente = await browser.newContext({
        ...iPad,
        locale: 'es-CO',
        timezoneId: 'America/Bogota',
        colorScheme: 'light'
    });
    const pageG = await ctxGerente.newPage();
    await pageG.goto('https://example.com');
    const vpG = await pageG.evaluate(() => ({ w: window.innerWidth, h: window.innerHeight }));
    console.log(\`Gerente viewport: \${vpG.w}x\${vpG.h}\`);
    expect(vpG.w).toBe(iPad.viewport.width);
    await pageG.screenshot({ path: 'perfil_gerente_tablet.png' });
    await ctxGerente.close();

    await browser.close();
    console.log('Todos los perfiles verificados correctamente');
}

testPerfiles();</code></pre>
                </div>
                </div>
            </details>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Resumen de opciones de new_context()</h4>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #2e7d32; color: white;">
                    <th style="padding: 8px; text-align: left;">Opción</th>
                    <th style="padding: 8px; text-align: left;">Tipo</th>
                    <th style="padding: 8px; text-align: left;">Ejemplo</th>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px;"><code>viewport</code></td>
                    <td style="padding: 8px;">dict</td>
                    <td style="padding: 8px;">{"width": 1920, "height": 1080}</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><code>device_scale_factor</code></td>
                    <td style="padding: 8px;">int</td>
                    <td style="padding: 8px;">2 (Retina)</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px;"><code>is_mobile</code></td>
                    <td style="padding: 8px;">bool</td>
                    <td style="padding: 8px;">True</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><code>has_touch</code></td>
                    <td style="padding: 8px;">bool</td>
                    <td style="padding: 8px;">True</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px;"><code>locale</code></td>
                    <td style="padding: 8px;">str</td>
                    <td style="padding: 8px;">"es-CO"</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><code>timezone_id</code></td>
                    <td style="padding: 8px;">str</td>
                    <td style="padding: 8px;">"America/Bogota"</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px;"><code>geolocation</code></td>
                    <td style="padding: 8px;">dict</td>
                    <td style="padding: 8px;">{"latitude": 3.45, "longitude": -76.53}</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><code>permissions</code></td>
                    <td style="padding: 8px;">list</td>
                    <td style="padding: 8px;">["geolocation", "notifications"]</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px;"><code>color_scheme</code></td>
                    <td style="padding: 8px;">str</td>
                    <td style="padding: 8px;">"dark" / "light"</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><code>user_agent</code></td>
                    <td style="padding: 8px;">str</td>
                    <td style="padding: 8px;">Custom UA string</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px;"><code>http_credentials</code></td>
                    <td style="padding: 8px;">dict</td>
                    <td style="padding: 8px;">{"username": "x", "password": "y"}</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><code>extra_http_headers</code></td>
                    <td style="padding: 8px;">dict</td>
                    <td style="padding: 8px;">{"X-Custom": "value"}</td>
                </tr>
            </table>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip final SIESA</h4>
            <p>Centraliza los perfiles de navegador en un archivo <code>conftest.py</code> o módulo
            de configuración compartido. Así, cuando cambien los requisitos de los dispositivos
            objetivo (por ejemplo, si se agrega soporte móvil al ERP), solo necesitas actualizar
            un lugar. Usa la factory de perfiles mostrada en la sección avanzada como punto de partida.</p>
        </div>
    `,
    topics: ["perfiles", "navegador", "configuración"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_091 = LESSON_091;
}
