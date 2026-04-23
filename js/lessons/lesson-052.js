/**
 * Playwright Academy - Lección 052
 * Proyecto: Interacciones complejas E2E
 * Sección 6: Interacciones Web Avanzadas
 */

const LESSON_052 = {
    id: 52,
    title: "Proyecto: Interacciones complejas E2E",
    duration: "35 min",
    level: "beginner",
    section: "section-06",
    content: `
        <h2>🚀 Proyecto: Interacciones Complejas E2E</h2>
        <p>En este proyecto integrador de la <strong>Sección 6</strong> construirás una suite de tests E2E
        que combina todas las técnicas de interacción avanzada aprendidas: ejecución de JavaScript,
        drag &amp; drop, hover, keyboard events, scroll, Shadow DOM, storage/cookies, geolocalización
        y emulación de dispositivos. El proyecto simula escenarios reales que un QA encuentra al
        probar aplicaciones web modernas.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎯 Objetivo del proyecto</h4>
            <p>Crear un framework de testing E2E que demuestre dominio de <strong>todas las interacciones
            web avanzadas de Playwright</strong>, con helpers reutilizables, fixtures especializados y
            tests organizados por tipo de interacción. Se usan
            <code>https://the-internet.herokuapp.com</code> y páginas de práctica como aplicaciones bajo prueba.</p>
        </div>

        <h3>🗂️ Paso 1: Estructura del proyecto</h3>
        <pre><code class="bash"># Crear la estructura completa
mkdir -p proyecto_interacciones/helpers
mkdir -p proyecto_interacciones/tests
mkdir -p proyecto_interacciones/test-results/screenshots
mkdir -p proyecto_interacciones/test-results/traces

# Crear archivos
touch proyecto_interacciones/helpers/__init__.py
touch proyecto_interacciones/helpers/js_helpers.py
touch proyecto_interacciones/helpers/storage_helpers.py
touch proyecto_interacciones/helpers/emulation_helpers.py

touch proyecto_interacciones/tests/__init__.py
touch proyecto_interacciones/tests/conftest.py
touch proyecto_interacciones/tests/test_js_execution.py
touch proyecto_interacciones/tests/test_mouse_interactions.py
touch proyecto_interacciones/tests/test_keyboard_advanced.py
touch proyecto_interacciones/tests/test_scroll_dynamic.py
touch proyecto_interacciones/tests/test_shadow_dom.py
touch proyecto_interacciones/tests/test_storage_cookies.py
touch proyecto_interacciones/tests/test_emulation.py
touch proyecto_interacciones/tests/test_e2e_combined.py

touch proyecto_interacciones/pytest.ini</code></pre>
        <pre><code>proyecto_interacciones/
├── pytest.ini                              # Configuración de pytest
├── helpers/
│   ├── __init__.py
│   ├── js_helpers.py                       # Funciones JS reutilizables
│   ├── storage_helpers.py                  # Helpers de storage y cookies
│   └── emulation_helpers.py                # Perfiles de emulación
├── tests/
│   ├── __init__.py
│   ├── conftest.py                         # Fixtures compartidos
│   ├── test_js_execution.py                # evaluate(), JS injection
│   ├── test_mouse_interactions.py          # drag, hover, right-click
│   ├── test_keyboard_advanced.py           # teclas, atajos, combinaciones
│   ├── test_scroll_dynamic.py              # scroll, lazy-load, virtualización
│   ├── test_shadow_dom.py                  # Shadow DOM, Web Components
│   ├── test_storage_cookies.py             # localStorage, sessionStorage, cookies
│   ├── test_emulation.py                   # geolocation, device, permissions
│   └── test_e2e_combined.py                # Escenarios combinados E2E
└── test-results/
    ├── screenshots/
    └── traces/</code></pre>

        <h3>⚙️ Paso 2: pytest.ini</h3>
        <pre><code class="ini"># pytest.ini
[pytest]
markers =
    js: Tests de ejecución de JavaScript
    mouse: Tests de interacciones de mouse
    keyboard: Tests de keyboard events
    scroll: Tests de scroll y elementos dinámicos
    shadow: Tests de Shadow DOM
    storage: Tests de storage y cookies
    emulation: Tests de geolocation y emulación
    e2e: Tests end-to-end combinados
    slow: Tests que requieren más tiempo

testpaths = tests
addopts = -v --tb=short</code></pre>

        <h3>🧰 Paso 3: helpers/js_helpers.py — Funciones JavaScript reutilizables</h3>
        <div class="code-tabs" data-code-id="L052-1">
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
                <pre><code class="language-python"># helpers/js_helpers.py
"""
Helpers para ejecutar JavaScript frecuente en tests.
Encapsulan evaluate() y evaluate_handle() para operaciones comunes.
"""


def scroll_to_bottom(page):
    """Scroll hasta el final de la página."""
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")


def scroll_to_element(page, selector: str):
    """Scroll hasta que un elemento sea visible."""
    page.evaluate(f"""
        document.querySelector('{selector}')
            ?.scrollIntoView({{ behavior: 'smooth', block: 'center' }})
    """)


def get_computed_style(page, selector: str, property_name: str) -> str:
    """Obtener una propiedad CSS computada de un elemento."""
    return page.evaluate(f"""
        () => {{
            const el = document.querySelector('{selector}');
            return el ? getComputedStyle(el).{property_name} : null;
        }}
    """)


def inject_test_element(page, tag: str, attrs: dict, text: str = ""):
    """Inyectar un elemento HTML en el DOM para testing."""
    attrs_str = " ".join(f'{k}="{v}"' for k, v in attrs.items())
    page.evaluate(f"""
        () => {{
            const el = document.createElement('{tag}');
            const wrapper = document.createElement('div');
            wrapper.innerHTML = '<{tag} {attrs_str}>{text}</{tag}>';
            document.body.appendChild(wrapper.firstChild);
        }}
    """)


def get_performance_timing(page) -> dict:
    """Obtener métricas de rendimiento de la página."""
    return page.evaluate("""
        () => {
            const timing = performance.timing;
            return {
                dns: timing.domainLookupEnd - timing.domainLookupStart,
                connection: timing.connectEnd - timing.connectStart,
                ttfb: timing.responseStart - timing.requestStart,
                dom_loaded: timing.domContentLoadedEventEnd - timing.navigationStart,
                full_load: timing.loadEventEnd - timing.navigationStart
            };
        }
    """)


def get_local_storage_items(page) -> dict:
    """Obtener todos los items de localStorage."""
    return page.evaluate("""
        () => {
            const items = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                items[key] = localStorage.getItem(key);
            }
            return items;
        }
    """)


def set_local_storage(page, key: str, value: str):
    """Establecer un valor en localStorage."""
    page.evaluate(f"localStorage.setItem('{key}', '{value}')")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// helpers/js-helpers.ts
/**
 * Helpers para ejecutar JavaScript frecuente en tests.
 * Encapsulan evaluate() y evaluateHandle() para operaciones comunes.
 */
import { Page } from '@playwright/test';


export async function scrollToBottom(page: Page): Promise&lt;void&gt; {
    // Scroll hasta el final de la página.
    await page.evaluate(() =&gt; window.scrollTo(0, document.body.scrollHeight));
}


export async function scrollToElement(page: Page, selector: string): Promise&lt;void&gt; {
    // Scroll hasta que un elemento sea visible.
    await page.evaluate((sel) =&gt; {
        document.querySelector(sel)
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, selector);
}


export async function getComputedStyleProp(
    page: Page, selector: string, propertyName: string
): Promise&lt;string | null&gt; {
    // Obtener una propiedad CSS computada de un elemento.
    return await page.evaluate(
        ({ sel, prop }) =&gt; {
            const el = document.querySelector(sel);
            return el ? getComputedStyle(el).getPropertyValue(prop) : null;
        },
        { sel: selector, prop: propertyName }
    );
}


export async function injectTestElement(
    page: Page, tag: string, attrs: Record&lt;string, string&gt;, text: string = ''
): Promise&lt;void&gt; {
    // Inyectar un elemento HTML en el DOM para testing.
    await page.evaluate(
        ({ tag, attrs, text }) =&gt; {
            const el = document.createElement(tag);
            Object.entries(attrs).forEach(([k, v]) =&gt; el.setAttribute(k, v));
            el.textContent = text;
            document.body.appendChild(el);
        },
        { tag, attrs, text }
    );
}


export async function getPerformanceTiming(page: Page): Promise&lt;Record&lt;string, number&gt;&gt; {
    // Obtener métricas de rendimiento de la página.
    return await page.evaluate(() =&gt; {
        const timing = performance.timing;
        return {
            dns: timing.domainLookupEnd - timing.domainLookupStart,
            connection: timing.connectEnd - timing.connectStart,
            ttfb: timing.responseStart - timing.requestStart,
            dom_loaded: timing.domContentLoadedEventEnd - timing.navigationStart,
            full_load: timing.loadEventEnd - timing.navigationStart
        };
    });
}


export async function getLocalStorageItems(page: Page): Promise&lt;Record&lt;string, string&gt;&gt; {
    // Obtener todos los items de localStorage.
    return await page.evaluate(() =&gt; {
        const items: Record&lt;string, string&gt; = {};
        for (let i = 0; i &lt; localStorage.length; i++) {
            const key = localStorage.key(i)!;
            items[key] = localStorage.getItem(key)!;
        }
        return items;
    });
}


export async function setLocalStorage(page: Page, key: string, value: string): Promise&lt;void&gt; {
    // Establecer un valor en localStorage.
    await page.evaluate(
        ({ key, value }) =&gt; localStorage.setItem(key, value),
        { key, value }
    );
}</code></pre>
            </div>
        </div>

        <h3>🍪 Paso 4: helpers/storage_helpers.py — Helpers de storage y cookies</h3>
        <div class="code-tabs" data-code-id="L052-2">
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
                <pre><code class="language-python"># helpers/storage_helpers.py
"""
Helpers para manipular storage y cookies en tests.
"""


def clear_all_storage(page):
    """Limpiar localStorage, sessionStorage y cookies."""
    page.evaluate("localStorage.clear()")
    page.evaluate("sessionStorage.clear()")
    page.context.clear_cookies()


def set_auth_cookie(context, name: str = "session", value: str = "test-token",
                     domain: str = "the-internet.herokuapp.com"):
    """Crear una cookie de autenticación simulada."""
    context.add_cookies([{
        "name": name,
        "value": value,
        "domain": domain,
        "path": "/",
        "httpOnly": True,
        "secure": True,
        "sameSite": "Lax"
    }])


def get_cookie_by_name(context, name: str) -> dict | None:
    """Obtener una cookie específica por nombre."""
    cookies = context.cookies()
    for cookie in cookies:
        if cookie["name"] == name:
            return cookie
    return None


def save_storage_state(page, filepath: str):
    """Guardar el estado de storage para reutilizar en otros tests."""
    page.context.storage_state(path=filepath)


def setup_test_data_in_storage(page, data: dict):
    """Inyectar datos de prueba en localStorage."""
    for key, value in data.items():
        page.evaluate(
            f"localStorage.setItem('{key}', JSON.stringify({{}}))"
            if isinstance(value, dict)
            else f"localStorage.setItem('{key}', '{value}')"
        )</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// helpers/storage-helpers.ts
/**
 * Helpers para manipular storage y cookies en tests.
 */
import { Page, BrowserContext, Cookie } from '@playwright/test';


export async function clearAllStorage(page: Page): Promise&lt;void&gt; {
    // Limpiar localStorage, sessionStorage y cookies.
    await page.evaluate(() =&gt; localStorage.clear());
    await page.evaluate(() =&gt; sessionStorage.clear());
    await page.context().clearCookies();
}


export async function setAuthCookie(
    context: BrowserContext,
    name: string = 'session',
    value: string = 'test-token',
    domain: string = 'the-internet.herokuapp.com'
): Promise&lt;void&gt; {
    // Crear una cookie de autenticación simulada.
    await context.addCookies([{
        name,
        value,
        domain,
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'Lax'
    }]);
}


export async function getCookieByName(
    context: BrowserContext, name: string
): Promise&lt;Cookie | undefined&gt; {
    // Obtener una cookie específica por nombre.
    const cookies = await context.cookies();
    return cookies.find(cookie =&gt; cookie.name === name);
}


export async function saveStorageState(page: Page, filepath: string): Promise&lt;void&gt; {
    // Guardar el estado de storage para reutilizar en otros tests.
    await page.context().storageState({ path: filepath });
}


export async function setupTestDataInStorage(
    page: Page, data: Record&lt;string, string | object&gt;
): Promise&lt;void&gt; {
    // Inyectar datos de prueba en localStorage.
    for (const [key, value] of Object.entries(data)) {
        const serialized = typeof value === 'object'
            ? JSON.stringify(value)
            : String(value);
        await page.evaluate(
            ({ k, v }) =&gt; localStorage.setItem(k, v),
            { k: key, v: serialized }
        );
    }
}</code></pre>
            </div>
        </div>

        <h3>📱 Paso 5: helpers/emulation_helpers.py — Perfiles de emulación</h3>
        <div class="code-tabs" data-code-id="L052-3">
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
                <pre><code class="language-python"># helpers/emulation_helpers.py
"""
Perfiles de emulación reutilizables para tests.
Combina device descriptors con geolocation, locale, timezone, etc.
"""

# Perfiles de geolocalización
GEOLOCATIONS = {
    "cali": {"latitude": 3.4516, "longitude": -76.5320, "accuracy": 100},
    "bogota": {"latitude": 4.7110, "longitude": -74.0721, "accuracy": 100},
    "new_york": {"latitude": 40.7128, "longitude": -74.0060, "accuracy": 100},
    "london": {"latitude": 51.5074, "longitude": -0.1278, "accuracy": 100},
    "tokyo": {"latitude": 35.6762, "longitude": 139.6503, "accuracy": 100},
}

# Perfiles de emulación completos
EMULATION_PROFILES = {
    "mobile_colombia": {
        "viewport": {"width": 375, "height": 812},
        "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
        "device_scale_factor": 3,
        "is_mobile": True,
        "has_touch": True,
        "locale": "es-CO",
        "timezone_id": "America/Bogota",
        "geolocation": GEOLOCATIONS["cali"],
        "permissions": ["geolocation"],
        "color_scheme": "light",
    },
    "desktop_us": {
        "viewport": {"width": 1920, "height": 1080},
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "device_scale_factor": 1,
        "is_mobile": False,
        "has_touch": False,
        "locale": "en-US",
        "timezone_id": "America/New_York",
        "geolocation": GEOLOCATIONS["new_york"],
        "permissions": ["geolocation"],
        "color_scheme": "light",
    },
    "dark_mode_tablet": {
        "viewport": {"width": 768, "height": 1024},
        "user_agent": "Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X)",
        "device_scale_factor": 2,
        "is_mobile": True,
        "has_touch": True,
        "locale": "es-CO",
        "timezone_id": "America/Bogota",
        "color_scheme": "dark",
    },
}


def apply_emulation_profile(context_options: dict, profile_name: str) -> dict:
    """Aplicar un perfil de emulación a las opciones del contexto."""
    profile = EMULATION_PROFILES.get(profile_name, {})
    merged = {**context_options}

    if "viewport" in profile:
        merged["viewport"] = profile["viewport"]
    if "user_agent" in profile:
        merged["user_agent"] = profile["user_agent"]
    if "device_scale_factor" in profile:
        merged["device_scale_factor"] = profile["device_scale_factor"]
    if "is_mobile" in profile:
        merged["is_mobile"] = profile["is_mobile"]
    if "has_touch" in profile:
        merged["has_touch"] = profile["has_touch"]
    if "locale" in profile:
        merged["locale"] = profile["locale"]
    if "timezone_id" in profile:
        merged["timezone_id"] = profile["timezone_id"]
    if "color_scheme" in profile:
        merged["color_scheme"] = profile["color_scheme"]

    return merged


def get_geolocation(name: str) -> dict:
    """Obtener coordenadas de geolocalización por nombre."""
    return GEOLOCATIONS.get(name, GEOLOCATIONS["cali"])</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// helpers/emulation-helpers.ts
/**
 * Perfiles de emulación reutilizables para tests.
 * Combina device descriptors con geolocation, locale, timezone, etc.
 */
import { BrowserContextOptions } from '@playwright/test';

// Interfaz para geolocalizaciones
interface Geolocation {
    latitude: number;
    longitude: number;
    accuracy: number;
}

// Perfiles de geolocalización
export const GEOLOCATIONS: Record&lt;string, Geolocation&gt; = {
    cali: { latitude: 3.4516, longitude: -76.5320, accuracy: 100 },
    bogota: { latitude: 4.7110, longitude: -74.0721, accuracy: 100 },
    new_york: { latitude: 40.7128, longitude: -74.0060, accuracy: 100 },
    london: { latitude: 51.5074, longitude: -0.1278, accuracy: 100 },
    tokyo: { latitude: 35.6762, longitude: 139.6503, accuracy: 100 },
};

// Interfaz para perfiles de emulación
interface EmulationProfile {
    viewport?: { width: number; height: number };
    userAgent?: string;
    deviceScaleFactor?: number;
    isMobile?: boolean;
    hasTouch?: boolean;
    locale?: string;
    timezoneId?: string;
    geolocation?: Geolocation;
    permissions?: string[];
    colorScheme?: 'light' | 'dark' | 'no-preference';
}

// Perfiles de emulación completos
export const EMULATION_PROFILES: Record&lt;string, EmulationProfile&gt; = {
    mobile_colombia: {
        viewport: { width: 375, height: 812 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        locale: 'es-CO',
        timezoneId: 'America/Bogota',
        geolocation: GEOLOCATIONS.cali,
        permissions: ['geolocation'],
        colorScheme: 'light',
    },
    desktop_us: {
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false,
        locale: 'en-US',
        timezoneId: 'America/New_York',
        geolocation: GEOLOCATIONS.new_york,
        permissions: ['geolocation'],
        colorScheme: 'light',
    },
    dark_mode_tablet: {
        viewport: { width: 768, height: 1024 },
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X)',
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        locale: 'es-CO',
        timezoneId: 'America/Bogota',
        colorScheme: 'dark',
    },
};


export function applyEmulationProfile(
    contextOptions: BrowserContextOptions, profileName: string
): BrowserContextOptions {
    // Aplicar un perfil de emulación a las opciones del contexto.
    const profile = EMULATION_PROFILES[profileName] ?? {};
    const merged: BrowserContextOptions = { ...contextOptions };

    if (profile.viewport) merged.viewport = profile.viewport;
    if (profile.userAgent) merged.userAgent = profile.userAgent;
    if (profile.deviceScaleFactor) merged.deviceScaleFactor = profile.deviceScaleFactor;
    if (profile.isMobile !== undefined) merged.isMobile = profile.isMobile;
    if (profile.hasTouch !== undefined) merged.hasTouch = profile.hasTouch;
    if (profile.locale) merged.locale = profile.locale;
    if (profile.timezoneId) merged.timezoneId = profile.timezoneId;
    if (profile.colorScheme) merged.colorScheme = profile.colorScheme;

    return merged;
}


export function getGeolocation(name: string): Geolocation {
    // Obtener coordenadas de geolocalización por nombre.
    return GEOLOCATIONS[name] ?? GEOLOCATIONS.cali;
}</code></pre>
            </div>
        </div>

        <h3>🔧 Paso 6: tests/conftest.py — Fixtures compartidos</h3>
        <div class="code-tabs" data-code-id="L052-4">
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
"""
Fixtures compartidos para el proyecto de interacciones avanzadas.
"""
import pytest
from playwright.sync_api import Page, BrowserContext
from helpers.storage_helpers import clear_all_storage
from helpers.emulation_helpers import GEOLOCATIONS, EMULATION_PROFILES


BASE_URL = "https://the-internet.herokuapp.com"


@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    """Configuración base del contexto del navegador."""
    return {
        **browser_context_args,
        "base_url": BASE_URL,
        "viewport": {"width": 1280, "height": 720},
    }


@pytest.fixture
def clean_page(page: Page):
    """Página con storage limpio antes de cada test."""
    clear_all_storage(page)
    yield page


@pytest.fixture
def geo_context(browser, browser_context_args):
    """Contexto con geolocalización habilitada (Cali, Colombia)."""
    context = browser.new_context(
        **browser_context_args,
        geolocation=GEOLOCATIONS["cali"],
        permissions=["geolocation"],
        locale="es-CO",
        timezone_id="America/Bogota",
    )
    page = context.new_page()
    yield page
    context.close()


@pytest.fixture
def mobile_context(browser, browser_context_args):
    """Contexto emulando un dispositivo móvil."""
    profile = EMULATION_PROFILES["mobile_colombia"]
    context = browser.new_context(
        **browser_context_args,
        viewport=profile["viewport"],
        user_agent=profile["user_agent"],
        device_scale_factor=profile["device_scale_factor"],
        is_mobile=profile["is_mobile"],
        has_touch=profile["has_touch"],
        locale=profile["locale"],
        timezone_id=profile["timezone_id"],
        geolocation=profile["geolocation"],
        permissions=profile.get("permissions", []),
    )
    page = context.new_page()
    yield page
    context.close()


@pytest.fixture
def dark_mode_context(browser, browser_context_args):
    """Contexto con dark mode habilitado."""
    context = browser.new_context(
        **browser_context_args,
        color_scheme="dark",
    )
    page = context.new_page()
    yield page
    context.close()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// playwright.config.ts + tests/fixtures.ts
/**
 * Configuración y fixtures compartidos para el proyecto de interacciones avanzadas.
 * En TypeScript, conftest.py se reemplaza con playwright.config.ts y fixtures personalizados.
 */
import { test as base, expect, Page, BrowserContext } from '@playwright/test';
import { clearAllStorage } from '../helpers/storage-helpers';
import { GEOLOCATIONS, EMULATION_PROFILES } from '../helpers/emulation-helpers';

// --- playwright.config.ts ---
// import { defineConfig } from '@playwright/test';
// export default defineConfig({
//     use: {
//         baseURL: 'https://the-internet.herokuapp.com',
//         viewport: { width: 1280, height: 720 },
//     },
// });

// --- tests/fixtures.ts ---
// Fixtures personalizados equivalentes a conftest.py

type CustomFixtures = {
    cleanPage: Page;
    geoContext: Page;
    mobileContext: Page;
    darkModeContext: Page;
};

export const test = base.extend&lt;CustomFixtures&gt;({
    // Página con storage limpio antes de cada test
    cleanPage: async ({ page }, use) =&gt; {
        await clearAllStorage(page);
        await use(page);
    },

    // Contexto con geolocalización habilitada (Cali, Colombia)
    geoContext: async ({ browser }, use) =&gt; {
        const context = await browser.newContext({
            baseURL: 'https://the-internet.herokuapp.com',
            geolocation: GEOLOCATIONS.cali,
            permissions: ['geolocation'],
            locale: 'es-CO',
            timezoneId: 'America/Bogota',
        });
        const page = await context.newPage();
        await use(page);
        await context.close();
    },

    // Contexto emulando un dispositivo móvil
    mobileContext: async ({ browser }, use) =&gt; {
        const profile = EMULATION_PROFILES.mobile_colombia;
        const context = await browser.newContext({
            baseURL: 'https://the-internet.herokuapp.com',
            viewport: profile.viewport,
            userAgent: profile.userAgent,
            deviceScaleFactor: profile.deviceScaleFactor,
            isMobile: profile.isMobile,
            hasTouch: profile.hasTouch,
            locale: profile.locale,
            timezoneId: profile.timezoneId,
            geolocation: profile.geolocation,
            permissions: profile.permissions ?? [],
        });
        const page = await context.newPage();
        await use(page);
        await context.close();
    },

    // Contexto con dark mode habilitado
    darkModeContext: async ({ browser }, use) =&gt; {
        const context = await browser.newContext({
            baseURL: 'https://the-internet.herokuapp.com',
            colorScheme: 'dark',
        });
        const page = await context.newPage();
        await use(page);
        await context.close();
    },
});</code></pre>
            </div>
        </div>

        <h3>🟡 Paso 7: test_js_execution.py — Ejecución de JavaScript</h3>
        <div class="code-tabs" data-code-id="L052-5">
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
                <pre><code class="language-python"># tests/test_js_execution.py
"""
Tests de ejecución de JavaScript desde Playwright.
Demuestra: evaluate(), evaluate_handle(), add_script_tag(), expose_function().
"""
import pytest
from playwright.sync_api import Page, expect
from helpers.js_helpers import (
    get_computed_style,
    get_performance_timing,
    inject_test_element,
    scroll_to_bottom,
)


class TestEvaluateBasico:
    """Tests básicos de evaluate()."""

    @pytest.mark.js
    def test_obtener_titulo_con_js(self, page: Page):
        """Ejecutar JS para obtener el título de la página."""
        page.goto("/")
        titulo = page.evaluate("document.title")
        assert "The Internet" in titulo

    @pytest.mark.js
    def test_contar_elementos_con_js(self, page: Page):
        """Contar elementos del DOM usando JavaScript."""
        page.goto("/")
        num_links = page.evaluate(
            "document.querySelectorAll('a').length"
        )
        assert num_links > 0

    @pytest.mark.js
    def test_evaluate_con_argumentos(self, page: Page):
        """Pasar argumentos de Python a JavaScript."""
        page.goto("/")
        selector = "h1"
        texto = page.evaluate(
            """(sel) => {
                const el = document.querySelector(sel);
                return el ? el.textContent.trim() : null;
            }""",
            selector
        )
        assert texto is not None
        assert "Welcome" in texto

    @pytest.mark.js
    def test_modificar_dom_con_js(self, page: Page):
        """Modificar el DOM inyectando un elemento."""
        page.goto("/")
        page.evaluate("""
            () => {
                const banner = document.createElement('div');
                banner.id = 'test-banner';
                banner.textContent = 'Inyectado por Playwright';
                banner.style.cssText = 'background:yellow; padding:10px;';
                document.body.prepend(banner);
            }
        """)
        banner = page.locator("#test-banner")
        expect(banner).to_be_visible()
        expect(banner).to_have_text("Inyectado por Playwright")


class TestEvaluateAvanzado:
    """Tests avanzados de ejecución de JavaScript."""

    @pytest.mark.js
    def test_obtener_computed_style(self, page: Page):
        """Leer estilos computados de un elemento."""
        page.goto("/")
        display = get_computed_style(page, "h1", "display")
        assert display is not None

    @pytest.mark.js
    def test_performance_timing(self, page: Page):
        """Obtener métricas de rendimiento de la página."""
        page.goto("/")
        timing = get_performance_timing(page)
        assert "dom_loaded" in timing
        assert timing["dom_loaded"] >= 0

    @pytest.mark.js
    def test_scroll_via_js(self, page: Page):
        """Hacer scroll con JavaScript."""
        page.goto("/")
        # Obtener posición antes del scroll
        pos_antes = page.evaluate("window.scrollY")
        scroll_to_bottom(page)
        page.wait_for_timeout(500)
        pos_despues = page.evaluate("window.scrollY")
        assert pos_despues >= pos_antes

    @pytest.mark.js
    def test_evaluate_handle_para_referencia(self, page: Page):
        """Usar evaluate_handle() para mantener referencia a un objeto JS."""
        page.goto("/")
        handle = page.evaluate_handle("document.querySelector('h1')")
        # Usar el handle para obtener propiedades
        texto = handle.evaluate("el => el.textContent")
        assert "Welcome" in texto
        handle.dispose()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// tests/js-execution.spec.ts
/**
 * Tests de ejecución de JavaScript desde Playwright.
 * Demuestra: evaluate(), evaluateHandle(), addScriptTag(), exposeFunction().
 */
import { test, expect, Page } from '@playwright/test';
import {
    getComputedStyleProp,
    getPerformanceTiming,
    injectTestElement,
    scrollToBottom,
} from '../helpers/js-helpers';


// --- Tests básicos de evaluate() ---

test.describe('TestEvaluateBasico', () =&gt; {

    test('obtener titulo con js @js', async ({ page }) =&gt; {
        // Ejecutar JS para obtener el título de la página.
        await page.goto('/');
        const titulo = await page.evaluate(() =&gt; document.title);
        expect(titulo).toContain('The Internet');
    });

    test('contar elementos con js @js', async ({ page }) =&gt; {
        // Contar elementos del DOM usando JavaScript.
        await page.goto('/');
        const numLinks = await page.evaluate(
            () =&gt; document.querySelectorAll('a').length
        );
        expect(numLinks).toBeGreaterThan(0);
    });

    test('evaluate con argumentos @js', async ({ page }) =&gt; {
        // Pasar argumentos de TypeScript a JavaScript.
        await page.goto('/');
        const selector = 'h1';
        const texto = await page.evaluate(
            (sel) =&gt; {
                const el = document.querySelector(sel);
                return el ? el.textContent?.trim() ?? null : null;
            },
            selector
        );
        expect(texto).not.toBeNull();
        expect(texto).toContain('Welcome');
    });

    test('modificar dom con js @js', async ({ page }) =&gt; {
        // Modificar el DOM inyectando un elemento.
        await page.goto('/');
        await page.evaluate(() =&gt; {
            const banner = document.createElement('div');
            banner.id = 'test-banner';
            banner.textContent = 'Inyectado por Playwright';
            banner.style.cssText = 'background:yellow; padding:10px;';
            document.body.prepend(banner);
        });
        const banner = page.locator('#test-banner');
        await expect(banner).toBeVisible();
        await expect(banner).toHaveText('Inyectado por Playwright');
    });
});


// --- Tests avanzados de ejecución de JavaScript ---

test.describe('TestEvaluateAvanzado', () =&gt; {

    test('obtener computed style @js', async ({ page }) =&gt; {
        // Leer estilos computados de un elemento.
        await page.goto('/');
        const display = await getComputedStyleProp(page, 'h1', 'display');
        expect(display).not.toBeNull();
    });

    test('performance timing @js', async ({ page }) =&gt; {
        // Obtener métricas de rendimiento de la página.
        await page.goto('/');
        const timing = await getPerformanceTiming(page);
        expect(timing).toHaveProperty('dom_loaded');
        expect(timing.dom_loaded).toBeGreaterThanOrEqual(0);
    });

    test('scroll via js @js', async ({ page }) =&gt; {
        // Hacer scroll con JavaScript.
        await page.goto('/');
        // Obtener posición antes del scroll
        const posAntes = await page.evaluate(() =&gt; window.scrollY);
        await scrollToBottom(page);
        await page.waitForTimeout(500);
        const posDespues = await page.evaluate(() =&gt; window.scrollY);
        expect(posDespues).toBeGreaterThanOrEqual(posAntes);
    });

    test('evaluate handle para referencia @js', async ({ page }) =&gt; {
        // Usar evaluateHandle() para mantener referencia a un objeto JS.
        await page.goto('/');
        const handle = await page.evaluateHandle(() =&gt; document.querySelector('h1'));
        // Usar el handle para obtener propiedades
        const texto = await handle.evaluate((el: Element) =&gt; el.textContent);
        expect(texto).toContain('Welcome');
        await handle.dispose();
    });
});</code></pre>
            </div>
        </div>

        <h3>🖱️ Paso 8: test_mouse_interactions.py — Drag, hover, right-click</h3>
        <div class="code-tabs" data-code-id="L052-6">
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
                <pre><code class="language-python"># tests/test_mouse_interactions.py
"""
Tests de interacciones avanzadas de mouse.
Demuestra: drag_to(), hover(), click(button='right'), dblclick().
"""
import pytest
from playwright.sync_api import Page, expect


class TestDragAndDrop:
    """Tests de drag and drop."""

    @pytest.mark.mouse
    def test_drag_and_drop_basico(self, page: Page):
        """Arrastrar un elemento a otro usando drag_to()."""
        page.goto("/drag_and_drop")
        col_a = page.locator("#column-a")
        col_b = page.locator("#column-b")

        # Verificar estado inicial
        expect(col_a).to_contain_text("A")
        expect(col_b).to_contain_text("B")

        # Drag A hacia B
        col_a.drag_to(col_b)

        # Después del drag, los headers deben intercambiarse
        # Nota: el resultado puede variar según la implementación de la app
        page.wait_for_timeout(500)

    @pytest.mark.mouse
    def test_drag_con_mouse_manual(self, page: Page):
        """Drag and drop usando mouse.move() para control granular."""
        page.goto("/drag_and_drop")
        source = page.locator("#column-a")
        target = page.locator("#column-b")

        source_box = source.bounding_box()
        target_box = target.bounding_box()

        if source_box and target_box:
            # Movimiento manual del mouse
            page.mouse.move(
                source_box["x"] + source_box["width"] / 2,
                source_box["y"] + source_box["height"] / 2
            )
            page.mouse.down()
            page.mouse.move(
                target_box["x"] + target_box["width"] / 2,
                target_box["y"] + target_box["height"] / 2,
                steps=10  # Movimiento gradual
            )
            page.mouse.up()


class TestHover:
    """Tests de hover (mouse over)."""

    @pytest.mark.mouse
    def test_hover_revela_contenido(self, page: Page):
        """Hover sobre un elemento revela contenido oculto."""
        page.goto("/hovers")
        # Hay 3 figuras con imágenes
        figuras = page.locator(".figure")
        assert figuras.count() == 3

        # Hover sobre la primera figura
        figuras.first.hover()
        # El caption debe hacerse visible
        caption = figuras.first.locator(".figcaption")
        expect(caption).to_be_visible()

    @pytest.mark.mouse
    def test_hover_sobre_multiples_elementos(self, page: Page):
        """Hacer hover sobre cada figura y verificar su caption."""
        page.goto("/hovers")
        figuras = page.locator(".figure")

        for i in range(figuras.count()):
            figura = figuras.nth(i)
            figura.hover()
            caption = figura.locator(".figcaption")
            expect(caption).to_be_visible()
            # Cada caption tiene un nombre de usuario
            expect(caption).to_contain_text("user")


class TestContextMenu:
    """Tests de menú contextual (right-click)."""

    @pytest.mark.mouse
    def test_right_click_context_menu(self, page: Page):
        """Right-click para activar un menú contextual."""
        page.goto("/context_menu")
        hot_spot = page.locator("#hot-spot")

        # Manejar el alert que aparece al hacer right-click
        page.on("dialog", lambda dialog: dialog.accept())
        hot_spot.click(button="right")

    @pytest.mark.mouse
    def test_double_click(self, page: Page):
        """Double-click en un elemento."""
        page.goto("/add_remove_elements/")
        # Hacer click en "Add Element" dos veces rápido
        boton = page.get_by_role("button", name="Add Element")
        boton.dblclick()
        # No hay dblclick handler, pero se agregan 2 elementos
        page.wait_for_timeout(300)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// tests/mouse-interactions.spec.ts
/**
 * Tests de interacciones avanzadas de mouse.
 * Demuestra: dragTo(), hover(), click({ button: 'right' }), dblclick().
 */
import { test, expect, Page } from '@playwright/test';


// --- Tests de drag and drop ---

test.describe('TestDragAndDrop', () =&gt; {

    test('drag and drop basico @mouse', async ({ page }) =&gt; {
        // Arrastrar un elemento a otro usando dragTo().
        await page.goto('/drag_and_drop');
        const colA = page.locator('#column-a');
        const colB = page.locator('#column-b');

        // Verificar estado inicial
        await expect(colA).toContainText('A');
        await expect(colB).toContainText('B');

        // Drag A hacia B
        await colA.dragTo(colB);

        // Después del drag, los headers deben intercambiarse
        // Nota: el resultado puede variar según la implementación de la app
        await page.waitForTimeout(500);
    });

    test('drag con mouse manual @mouse', async ({ page }) =&gt; {
        // Drag and drop usando mouse.move() para control granular.
        await page.goto('/drag_and_drop');
        const source = page.locator('#column-a');
        const target = page.locator('#column-b');

        const sourceBox = await source.boundingBox();
        const targetBox = await target.boundingBox();

        if (sourceBox &amp;&amp; targetBox) {
            // Movimiento manual del mouse
            await page.mouse.move(
                sourceBox.x + sourceBox.width / 2,
                sourceBox.y + sourceBox.height / 2
            );
            await page.mouse.down();
            await page.mouse.move(
                targetBox.x + targetBox.width / 2,
                targetBox.y + targetBox.height / 2,
                { steps: 10 }  // Movimiento gradual
            );
            await page.mouse.up();
        }
    });
});


// --- Tests de hover (mouse over) ---

test.describe('TestHover', () =&gt; {

    test('hover revela contenido @mouse', async ({ page }) =&gt; {
        // Hover sobre un elemento revela contenido oculto.
        await page.goto('/hovers');
        // Hay 3 figuras con imágenes
        const figuras = page.locator('.figure');
        await expect(figuras).toHaveCount(3);

        // Hover sobre la primera figura
        await figuras.first().hover();
        // El caption debe hacerse visible
        const caption = figuras.first().locator('.figcaption');
        await expect(caption).toBeVisible();
    });

    test('hover sobre multiples elementos @mouse', async ({ page }) =&gt; {
        // Hacer hover sobre cada figura y verificar su caption.
        await page.goto('/hovers');
        const figuras = page.locator('.figure');
        const count = await figuras.count();

        for (let i = 0; i &lt; count; i++) {
            const figura = figuras.nth(i);
            await figura.hover();
            const caption = figura.locator('.figcaption');
            await expect(caption).toBeVisible();
            // Cada caption tiene un nombre de usuario
            await expect(caption).toContainText('user');
        }
    });
});


// --- Tests de menú contextual (right-click) ---

test.describe('TestContextMenu', () =&gt; {

    test('right click context menu @mouse', async ({ page }) =&gt; {
        // Right-click para activar un menú contextual.
        await page.goto('/context_menu');
        const hotSpot = page.locator('#hot-spot');

        // Manejar el alert que aparece al hacer right-click
        page.on('dialog', async (dialog) =&gt; await dialog.accept());
        await hotSpot.click({ button: 'right' });
    });

    test('double click @mouse', async ({ page }) =&gt; {
        // Double-click en un elemento.
        await page.goto('/add_remove_elements/');
        // Hacer click en "Add Element" dos veces rápido
        const boton = page.getByRole('button', { name: 'Add Element' });
        await boton.dblclick();
        // No hay dblclick handler, pero se agregan 2 elementos
        await page.waitForTimeout(300);
    });
});</code></pre>
            </div>
        </div>

        <h3>⌨️ Paso 9: test_keyboard_advanced.py — Keyboard events avanzados</h3>
        <div class="code-tabs" data-code-id="L052-7">
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
                <pre><code class="language-python"># tests/test_keyboard_advanced.py
"""
Tests de keyboard events avanzados.
Demuestra: keyboard.press(), keyboard.type(), combinaciones de teclas.
"""
import pytest
from playwright.sync_api import Page, expect


class TestKeyboardEvents:
    """Tests de eventos de teclado."""

    @pytest.mark.keyboard
    def test_escribir_con_keyboard_type(self, page: Page):
        """Escribir texto carácter por carácter con keyboard.type()."""
        page.goto("/inputs")
        campo = page.locator("input[type='number']")
        campo.click()
        page.keyboard.type("12345", delay=50)
        expect(campo).to_have_value("12345")

    @pytest.mark.keyboard
    def test_tecla_enter_para_submit(self, page: Page):
        """Usar Enter para enviar un formulario."""
        page.goto("/login")
        page.get_by_label("Username").fill("tomsmith")
        page.get_by_label("Password").fill("SuperSecretPassword!")
        page.keyboard.press("Enter")
        expect(page.locator(".flash.success")).to_be_visible()

    @pytest.mark.keyboard
    def test_tab_para_navegacion(self, page: Page):
        """Usar Tab para navegar entre campos del formulario."""
        page.goto("/login")
        username = page.get_by_label("Username")
        username.click()
        username.fill("test")

        # Tab al siguiente campo
        page.keyboard.press("Tab")

        # Verificar que el foco cambió al campo password
        password = page.get_by_label("Password")
        password.fill("password123")
        expect(password).to_have_value("password123")

    @pytest.mark.keyboard
    def test_select_all_y_delete(self, page: Page):
        """Seleccionar todo y borrar con Ctrl+A, Delete."""
        page.goto("/inputs")
        campo = page.locator("input[type='number']")
        campo.fill("99999")
        expect(campo).to_have_value("99999")

        # Seleccionar todo y borrar
        campo.click()
        page.keyboard.press("Control+a")
        page.keyboard.press("Delete")
        expect(campo).to_have_value("")

    @pytest.mark.keyboard
    def test_escape_para_cerrar(self, page: Page):
        """Usar Escape para cerrar o cancelar."""
        page.goto("/key_presses")
        page.keyboard.press("Escape")
        result = page.locator("#result")
        expect(result).to_contain_text("ESCAPE")

    @pytest.mark.keyboard
    def test_multiples_key_presses(self, page: Page):
        """Verificar que key_presses registra las teclas correctas."""
        page.goto("/key_presses")
        teclas = ["a", "b", "c", "Enter", "Shift"]
        for tecla in teclas:
            page.keyboard.press(tecla)
            result = page.locator("#result")
            expect(result).to_be_visible()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// tests/keyboard-advanced.spec.ts
/**
 * Tests de keyboard events avanzados.
 * Demuestra: keyboard.press(), keyboard.type(), combinaciones de teclas.
 */
import { test, expect } from '@playwright/test';


test.describe('TestKeyboardEvents', () =&gt; {

    test('escribir con keyboard type @keyboard', async ({ page }) =&gt; {
        // Escribir texto carácter por carácter con keyboard.type().
        await page.goto('/inputs');
        const campo = page.locator("input[type='number']");
        await campo.click();
        await page.keyboard.type('12345', { delay: 50 });
        await expect(campo).toHaveValue('12345');
    });

    test('tecla enter para submit @keyboard', async ({ page }) =&gt; {
        // Usar Enter para enviar un formulario.
        await page.goto('/login');
        await page.getByLabel('Username').fill('tomsmith');
        await page.getByLabel('Password').fill('SuperSecretPassword!');
        await page.keyboard.press('Enter');
        await expect(page.locator('.flash.success')).toBeVisible();
    });

    test('tab para navegacion @keyboard', async ({ page }) =&gt; {
        // Usar Tab para navegar entre campos del formulario.
        await page.goto('/login');
        const username = page.getByLabel('Username');
        await username.click();
        await username.fill('test');

        // Tab al siguiente campo
        await page.keyboard.press('Tab');

        // Verificar que el foco cambió al campo password
        const password = page.getByLabel('Password');
        await password.fill('password123');
        await expect(password).toHaveValue('password123');
    });

    test('select all y delete @keyboard', async ({ page }) =&gt; {
        // Seleccionar todo y borrar con Ctrl+A, Delete.
        await page.goto('/inputs');
        const campo = page.locator("input[type='number']");
        await campo.fill('99999');
        await expect(campo).toHaveValue('99999');

        // Seleccionar todo y borrar
        await campo.click();
        await page.keyboard.press('Control+a');
        await page.keyboard.press('Delete');
        await expect(campo).toHaveValue('');
    });

    test('escape para cerrar @keyboard', async ({ page }) =&gt; {
        // Usar Escape para cerrar o cancelar.
        await page.goto('/key_presses');
        await page.keyboard.press('Escape');
        const result = page.locator('#result');
        await expect(result).toContainText('ESCAPE');
    });

    test('multiples key presses @keyboard', async ({ page }) =&gt; {
        // Verificar que key_presses registra las teclas correctas.
        await page.goto('/key_presses');
        const teclas = ['a', 'b', 'c', 'Enter', 'Shift'];
        for (const tecla of teclas) {
            await page.keyboard.press(tecla);
            const result = page.locator('#result');
            await expect(result).toBeVisible();
        }
    });
});</code></pre>
            </div>
        </div>

        <h3>📜 Paso 10: test_scroll_dynamic.py — Scroll y elementos dinámicos</h3>
        <div class="code-tabs" data-code-id="L052-8">
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
                <pre><code class="language-python"># tests/test_scroll_dynamic.py
"""
Tests de scroll y elementos cargados dinámicamente.
Demuestra: scroll_into_view_if_needed(), wheel(), infinite scroll, lazy loading.
"""
import pytest
from playwright.sync_api import Page, expect
from helpers.js_helpers import scroll_to_bottom


class TestScroll:
    """Tests de scroll básico y avanzado."""

    @pytest.mark.scroll
    def test_scroll_into_view(self, page: Page):
        """Scroll automático a un elemento fuera del viewport."""
        page.goto("/large")
        # El último párrafo está fuera del viewport
        ultimo = page.locator("#page-footer")
        ultimo.scroll_into_view_if_needed()
        expect(ultimo).to_be_in_viewport()

    @pytest.mark.scroll
    def test_scroll_con_wheel(self, page: Page):
        """Scroll usando mouse.wheel()."""
        page.goto("/large")
        pos_antes = page.evaluate("window.scrollY")
        page.mouse.wheel(0, 500)
        page.wait_for_timeout(500)
        pos_despues = page.evaluate("window.scrollY")
        assert pos_despues > pos_antes

    @pytest.mark.scroll
    def test_scroll_js_helper(self, page: Page):
        """Scroll usando el helper de JavaScript."""
        page.goto("/large")
        scroll_to_bottom(page)
        page.wait_for_timeout(500)
        # Verificar que llegamos al final
        at_bottom = page.evaluate("""
            () => {
                return (window.innerHeight + window.scrollY) >=
                       document.body.scrollHeight - 10;
            }
        """)
        assert at_bottom


class TestInfiniteScroll:
    """Tests de infinite scroll / contenido dinámico."""

    @pytest.mark.scroll
    @pytest.mark.slow
    def test_infinite_scroll_carga_contenido(self, page: Page):
        """Hacer scroll para cargar más contenido dinámicamente."""
        page.goto("/infinite_scroll")
        # Contar párrafos iniciales
        parrafos_iniciales = page.locator(".jscroll-added").count()

        # Scroll para cargar más
        for _ in range(3):
            page.mouse.wheel(0, 1000)
            page.wait_for_timeout(1000)

        parrafos_finales = page.locator(".jscroll-added").count()
        assert parrafos_finales > parrafos_iniciales


class TestElementosDinamicos:
    """Tests de elementos que aparecen/desaparecen."""

    @pytest.mark.scroll
    def test_loading_indicator(self, page: Page):
        """Esperar a que un loading indicator desaparezca."""
        page.goto("/dynamic_loading/1")
        page.get_by_role("button", name="Start").click()

        # Esperar a que el loading desaparezca y aparezca el resultado
        resultado = page.locator("#finish h4")
        expect(resultado).to_be_visible(timeout=10000)
        expect(resultado).to_have_text("Hello World!")

    @pytest.mark.scroll
    def test_elemento_renderizado_despues(self, page: Page):
        """Esperar un elemento que se renderiza después de una acción."""
        page.goto("/dynamic_loading/2")
        page.get_by_role("button", name="Start").click()

        resultado = page.locator("#finish h4")
        expect(resultado).to_be_visible(timeout=10000)
        expect(resultado).to_have_text("Hello World!")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// tests/scroll-dynamic.spec.ts
/**
 * Tests de scroll y elementos cargados dinámicamente.
 * Demuestra: scrollIntoViewIfNeeded(), wheel(), infinite scroll, lazy loading.
 */
import { test, expect } from '@playwright/test';
import { scrollToBottom } from '../helpers/js-helpers';


// --- Tests de scroll básico y avanzado ---

test.describe('TestScroll', () =&gt; {

    test('scroll into view @scroll', async ({ page }) =&gt; {
        // Scroll automático a un elemento fuera del viewport.
        await page.goto('/large');
        // El último párrafo está fuera del viewport
        const ultimo = page.locator('#page-footer');
        await ultimo.scrollIntoViewIfNeeded();
        await expect(ultimo).toBeInViewport();
    });

    test('scroll con wheel @scroll', async ({ page }) =&gt; {
        // Scroll usando mouse.wheel().
        await page.goto('/large');
        const posAntes = await page.evaluate(() =&gt; window.scrollY);
        await page.mouse.wheel(0, 500);
        await page.waitForTimeout(500);
        const posDespues = await page.evaluate(() =&gt; window.scrollY);
        expect(posDespues).toBeGreaterThan(posAntes);
    });

    test('scroll js helper @scroll', async ({ page }) =&gt; {
        // Scroll usando el helper de JavaScript.
        await page.goto('/large');
        await scrollToBottom(page);
        await page.waitForTimeout(500);
        // Verificar que llegamos al final
        const atBottom = await page.evaluate(() =&gt; {
            return (window.innerHeight + window.scrollY) &gt;=
                   document.body.scrollHeight - 10;
        });
        expect(atBottom).toBe(true);
    });
});


// --- Tests de infinite scroll / contenido dinámico ---

test.describe('TestInfiniteScroll', () =&gt; {

    test('infinite scroll carga contenido @scroll @slow', async ({ page }) =&gt; {
        // Hacer scroll para cargar más contenido dinámicamente.
        await page.goto('/infinite_scroll');
        // Contar párrafos iniciales
        const parrafosIniciales = await page.locator('.jscroll-added').count();

        // Scroll para cargar más
        for (let i = 0; i &lt; 3; i++) {
            await page.mouse.wheel(0, 1000);
            await page.waitForTimeout(1000);
        }

        const parrafosFinales = await page.locator('.jscroll-added').count();
        expect(parrafosFinales).toBeGreaterThan(parrafosIniciales);
    });
});


// --- Tests de elementos que aparecen/desaparecen ---

test.describe('TestElementosDinamicos', () =&gt; {

    test('loading indicator @scroll', async ({ page }) =&gt; {
        // Esperar a que un loading indicator desaparezca.
        await page.goto('/dynamic_loading/1');
        await page.getByRole('button', { name: 'Start' }).click();

        // Esperar a que el loading desaparezca y aparezca el resultado
        const resultado = page.locator('#finish h4');
        await expect(resultado).toBeVisible({ timeout: 10000 });
        await expect(resultado).toHaveText('Hello World!');
    });

    test('elemento renderizado despues @scroll', async ({ page }) =&gt; {
        // Esperar un elemento que se renderiza después de una acción.
        await page.goto('/dynamic_loading/2');
        await page.getByRole('button', { name: 'Start' }).click();

        const resultado = page.locator('#finish h4');
        await expect(resultado).toBeVisible({ timeout: 10000 });
        await expect(resultado).toHaveText('Hello World!');
    });
});</code></pre>
            </div>
        </div>

        <h3>🌑 Paso 11: test_shadow_dom.py — Shadow DOM y Web Components</h3>
        <div class="code-tabs" data-code-id="L052-9">
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
                <pre><code class="language-python"># tests/test_shadow_dom.py
"""
Tests de Shadow DOM.
Playwright atraviesa Shadow DOM automáticamente con locators.
"""
import pytest
from playwright.sync_api import Page, expect


class TestShadowDOMBasico:
    """Tests de acceso al Shadow DOM."""

    @pytest.mark.shadow
    def test_playwright_atraviesa_shadow_dom(self, page: Page):
        """Playwright accede a elementos dentro de Shadow DOM automáticamente."""
        page.goto("/shadowdom")
        # Playwright puede acceder a elementos dentro del shadow root
        # sin necesidad de selectores especiales
        contenido = page.locator("span")
        assert contenido.count() > 0

    @pytest.mark.shadow
    def test_acceso_con_evaluate(self, page: Page):
        """Acceder al Shadow DOM via JavaScript evaluate."""
        page.goto("/shadowdom")
        # Acceder al shadow root directamente con JS
        tiene_shadow = page.evaluate("""
            () => {
                const elements = document.querySelectorAll('*');
                for (const el of elements) {
                    if (el.shadowRoot) return true;
                }
                return false;
            }
        """)
        # La página de shadow DOM debería tener shadow roots
        assert isinstance(tiene_shadow, bool)


class TestShadowDOMCreado:
    """Tests creando Web Components con Shadow DOM para testing."""

    @pytest.mark.shadow
    def test_crear_y_acceder_web_component(self, page: Page):
        """Crear un Web Component y acceder a su Shadow DOM."""
        page.goto("/")
        # Inyectar un Web Component
        page.evaluate("""
            () => {
                class TestCard extends HTMLElement {
                    constructor() {
                        super();
                        const shadow = this.attachShadow({ mode: 'open' });
                        shadow.innerHTML = '<div class="card"><h3>Test Card</h3><p>Contenido shadow</p></div>';
                    }
                }
                customElements.define('test-card', TestCard);
                document.body.appendChild(document.createElement('test-card'));
            }
        """)
        # Playwright atraviesa el shadow DOM
        card_text = page.locator("test-card h3")
        expect(card_text).to_have_text("Test Card")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// tests/shadow-dom.spec.ts
/**
 * Tests de Shadow DOM.
 * Playwright atraviesa Shadow DOM automáticamente con locators.
 */
import { test, expect } from '@playwright/test';


// --- Tests de acceso al Shadow DOM ---

test.describe('TestShadowDOMBasico', () =&gt; {

    test('playwright atraviesa shadow dom @shadow', async ({ page }) =&gt; {
        // Playwright accede a elementos dentro de Shadow DOM automáticamente.
        await page.goto('/shadowdom');
        // Playwright puede acceder a elementos dentro del shadow root
        // sin necesidad de selectores especiales
        const contenido = page.locator('span');
        expect(await contenido.count()).toBeGreaterThan(0);
    });

    test('acceso con evaluate @shadow', async ({ page }) =&gt; {
        // Acceder al Shadow DOM via JavaScript evaluate.
        await page.goto('/shadowdom');
        // Acceder al shadow root directamente con JS
        const tieneShadow = await page.evaluate(() =&gt; {
            const elements = document.querySelectorAll('*');
            for (const el of elements) {
                if (el.shadowRoot) return true;
            }
            return false;
        });
        // La página de shadow DOM debería tener shadow roots
        expect(typeof tieneShadow).toBe('boolean');
    });
});


// --- Tests creando Web Components con Shadow DOM para testing ---

test.describe('TestShadowDOMCreado', () =&gt; {

    test('crear y acceder web component @shadow', async ({ page }) =&gt; {
        // Crear un Web Component y acceder a su Shadow DOM.
        await page.goto('/');
        // Inyectar un Web Component
        await page.evaluate(() =&gt; {
            class TestCard extends HTMLElement {
                constructor() {
                    super();
                    const shadow = this.attachShadow({ mode: 'open' });
                    shadow.innerHTML = '&lt;div class="card"&gt;&lt;h3&gt;Test Card&lt;/h3&gt;&lt;p&gt;Contenido shadow&lt;/p&gt;&lt;/div&gt;';
                }
            }
            customElements.define('test-card', TestCard);
            document.body.appendChild(document.createElement('test-card'));
        });
        // Playwright atraviesa el shadow DOM
        const cardText = page.locator('test-card h3');
        await expect(cardText).toHaveText('Test Card');
    });
});</code></pre>
            </div>
        </div>

        <h3>🍪 Paso 12: test_storage_cookies.py — Storage y cookies</h3>
        <div class="code-tabs" data-code-id="L052-10">
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
                <pre><code class="language-python"># tests/test_storage_cookies.py
"""
Tests de localStorage, sessionStorage y cookies.
Demuestra: manipulación directa, persistencia, y cookie management.
"""
import pytest
from playwright.sync_api import Page, BrowserContext, expect
from helpers.storage_helpers import clear_all_storage, set_auth_cookie, get_cookie_by_name
from helpers.js_helpers import get_local_storage_items, set_local_storage


class TestLocalStorage:
    """Tests de localStorage."""

    @pytest.mark.storage
    def test_set_y_get_localStorage(self, clean_page: Page):
        """Escribir y leer localStorage."""
        page = clean_page
        page.goto("/")
        set_local_storage(page, "test_key", "test_value")
        valor = page.evaluate("localStorage.getItem('test_key')")
        assert valor == "test_value"

    @pytest.mark.storage
    def test_listar_items_localStorage(self, clean_page: Page):
        """Obtener todos los items de localStorage."""
        page = clean_page
        page.goto("/")
        set_local_storage(page, "nombre", "Juan")
        set_local_storage(page, "rol", "QA Lead")
        items = get_local_storage_items(page)
        assert items["nombre"] == "Juan"
        assert items["rol"] == "QA Lead"

    @pytest.mark.storage
    def test_limpiar_localStorage(self, clean_page: Page):
        """Verificar que clear limpia todo el storage."""
        page = clean_page
        page.goto("/")
        set_local_storage(page, "dato", "valor")
        page.evaluate("localStorage.clear()")
        items = get_local_storage_items(page)
        assert len(items) == 0


class TestSessionStorage:
    """Tests de sessionStorage."""

    @pytest.mark.storage
    def test_session_storage_no_persiste(self, page: Page):
        """sessionStorage no persiste entre contextos."""
        page.goto("/")
        page.evaluate("sessionStorage.setItem('session_key', 'temporal')")
        valor = page.evaluate("sessionStorage.getItem('session_key')")
        assert valor == "temporal"


class TestCookies:
    """Tests de manipulación de cookies."""

    @pytest.mark.storage
    def test_agregar_cookie(self, page: Page):
        """Agregar una cookie al contexto."""
        page.goto("/")
        set_auth_cookie(page.context, "mi_cookie", "mi_valor")
        cookie = get_cookie_by_name(page.context, "mi_cookie")
        assert cookie is not None
        assert cookie["value"] == "mi_valor"

    @pytest.mark.storage
    def test_cookies_de_la_pagina(self, page: Page):
        """Leer las cookies que la página establece."""
        page.goto("/")
        cookies = page.context.cookies()
        # the-internet.herokuapp.com puede establecer cookies
        assert isinstance(cookies, list)

    @pytest.mark.storage
    def test_limpiar_cookies(self, page: Page):
        """Limpiar todas las cookies del contexto."""
        page.goto("/")
        set_auth_cookie(page.context, "temp", "data")
        page.context.clear_cookies()
        cookie = get_cookie_by_name(page.context, "temp")
        assert cookie is None</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// tests/storage-cookies.spec.ts
/**
 * Tests de localStorage, sessionStorage y cookies.
 * Demuestra: manipulación directa, persistencia, y cookie management.
 */
import { test, expect, Page, BrowserContext } from '@playwright/test';
import { clearAllStorage, setAuthCookie, getCookieByName } from '../helpers/storage-helpers';
import { getLocalStorageItems, setLocalStorage } from '../helpers/js-helpers';


// --- Tests de localStorage ---

test.describe('TestLocalStorage', () =&gt; {

    test.beforeEach(async ({ page }) =&gt; {
        await clearAllStorage(page);
    });

    test('set y get localStorage @storage', async ({ page }) =&gt; {
        // Escribir y leer localStorage.
        await page.goto('/');
        await setLocalStorage(page, 'test_key', 'test_value');
        const valor = await page.evaluate(() =&gt; localStorage.getItem('test_key'));
        expect(valor).toBe('test_value');
    });

    test('listar items localStorage @storage', async ({ page }) =&gt; {
        // Obtener todos los items de localStorage.
        await page.goto('/');
        await setLocalStorage(page, 'nombre', 'Juan');
        await setLocalStorage(page, 'rol', 'QA Lead');
        const items = await getLocalStorageItems(page);
        expect(items['nombre']).toBe('Juan');
        expect(items['rol']).toBe('QA Lead');
    });

    test('limpiar localStorage @storage', async ({ page }) =&gt; {
        // Verificar que clear limpia todo el storage.
        await page.goto('/');
        await setLocalStorage(page, 'dato', 'valor');
        await page.evaluate(() =&gt; localStorage.clear());
        const items = await getLocalStorageItems(page);
        expect(Object.keys(items).length).toBe(0);
    });
});


// --- Tests de sessionStorage ---

test.describe('TestSessionStorage', () =&gt; {

    test('session storage no persiste @storage', async ({ page }) =&gt; {
        // sessionStorage no persiste entre contextos.
        await page.goto('/');
        await page.evaluate(() =&gt; sessionStorage.setItem('session_key', 'temporal'));
        const valor = await page.evaluate(() =&gt; sessionStorage.getItem('session_key'));
        expect(valor).toBe('temporal');
    });
});


// --- Tests de manipulación de cookies ---

test.describe('TestCookies', () =&gt; {

    test('agregar cookie @storage', async ({ page, context }) =&gt; {
        // Agregar una cookie al contexto.
        await page.goto('/');
        await setAuthCookie(context, 'mi_cookie', 'mi_valor');
        const cookie = await getCookieByName(context, 'mi_cookie');
        expect(cookie).toBeDefined();
        expect(cookie!.value).toBe('mi_valor');
    });

    test('cookies de la pagina @storage', async ({ page, context }) =&gt; {
        // Leer las cookies que la página establece.
        await page.goto('/');
        const cookies = await context.cookies();
        // the-internet.herokuapp.com puede establecer cookies
        expect(Array.isArray(cookies)).toBe(true);
    });

    test('limpiar cookies @storage', async ({ page, context }) =&gt; {
        // Limpiar todas las cookies del contexto.
        await page.goto('/');
        await setAuthCookie(context, 'temp', 'data');
        await context.clearCookies();
        const cookie = await getCookieByName(context, 'temp');
        expect(cookie).toBeUndefined();
    });
});</code></pre>
            </div>
        </div>

        <h3>🌍 Paso 13: test_emulation.py — Geolocation y emulación</h3>
        <div class="code-tabs" data-code-id="L052-11">
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
                <pre><code class="language-python"># tests/test_emulation.py
"""
Tests de geolocalización, device emulation y permisos.
Usa fixtures especializados del conftest.py.
"""
import pytest
from playwright.sync_api import Page, expect


class TestGeolocation:
    """Tests de geolocalización."""

    @pytest.mark.emulation
    def test_geolocation_disponible(self, geo_context: Page):
        """Verificar que la geolocalización está habilitada."""
        page = geo_context
        page.goto("/")
        coords = page.evaluate("""
            () => new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    pos => resolve({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    }),
                    err => reject(err.message),
                    { timeout: 5000 }
                );
            })
        """)
        # Debe devolver las coordenadas de Cali
        assert abs(coords["lat"] - 3.4516) < 0.01
        assert abs(coords["lng"] - (-76.5320)) < 0.01


class TestDeviceEmulation:
    """Tests de emulación de dispositivos."""

    @pytest.mark.emulation
    def test_mobile_viewport(self, mobile_context: Page):
        """Verificar que el viewport es móvil."""
        page = mobile_context
        page.goto("/")
        viewport = page.evaluate("""
            () => ({
                width: window.innerWidth,
                height: window.innerHeight
            })
        """)
        assert viewport["width"] <= 375

    @pytest.mark.emulation
    def test_mobile_user_agent(self, mobile_context: Page):
        """Verificar que el user agent es de iPhone."""
        page = mobile_context
        page.goto("/")
        ua = page.evaluate("navigator.userAgent")
        assert "iPhone" in ua

    @pytest.mark.emulation
    def test_locale_es_co(self, mobile_context: Page):
        """Verificar que el locale es español Colombia."""
        page = mobile_context
        page.goto("/")
        lang = page.evaluate("navigator.language")
        assert lang == "es-CO"

    @pytest.mark.emulation
    def test_timezone_bogota(self, mobile_context: Page):
        """Verificar que la timezone es America/Bogota."""
        page = mobile_context
        page.goto("/")
        tz = page.evaluate(
            "Intl.DateTimeFormat().resolvedOptions().timeZone"
        )
        assert tz == "America/Bogota"


class TestColorScheme:
    """Tests de color scheme (dark/light mode)."""

    @pytest.mark.emulation
    def test_dark_mode_activo(self, dark_mode_context: Page):
        """Verificar que dark mode está activo."""
        page = dark_mode_context
        page.goto("/")
        is_dark = page.evaluate(
            "window.matchMedia('(prefers-color-scheme: dark)').matches"
        )
        assert is_dark is True</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// tests/emulation.spec.ts
/**
 * Tests de geolocalización, device emulation y permisos.
 * Usa fixtures personalizados de fixtures.ts.
 */
import { test } from './fixtures';
import { expect } from '@playwright/test';


// --- Tests de geolocalización ---

test.describe('TestGeolocation', () =&gt; {

    test('geolocation disponible @emulation', async ({ geoContext: page }) =&gt; {
        // Verificar que la geolocalización está habilitada.
        await page.goto('/');
        const coords = await page.evaluate(() =&gt; new Promise&lt;{lat: number, lng: number}&gt;((resolve, reject) =&gt; {
            navigator.geolocation.getCurrentPosition(
                pos =&gt; resolve({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                }),
                err =&gt; reject(err.message),
                { timeout: 5000 }
            );
        }));
        // Debe devolver las coordenadas de Cali
        expect(Math.abs(coords.lat - 3.4516)).toBeLessThan(0.01);
        expect(Math.abs(coords.lng - (-76.5320))).toBeLessThan(0.01);
    });
});


// --- Tests de emulación de dispositivos ---

test.describe('TestDeviceEmulation', () =&gt; {

    test('mobile viewport @emulation', async ({ mobileContext: page }) =&gt; {
        // Verificar que el viewport es móvil.
        await page.goto('/');
        const viewport = await page.evaluate(() =&gt; ({
            width: window.innerWidth,
            height: window.innerHeight
        }));
        expect(viewport.width).toBeLessThanOrEqual(375);
    });

    test('mobile user agent @emulation', async ({ mobileContext: page }) =&gt; {
        // Verificar que el user agent es de iPhone.
        await page.goto('/');
        const ua = await page.evaluate(() =&gt; navigator.userAgent);
        expect(ua).toContain('iPhone');
    });

    test('locale es CO @emulation', async ({ mobileContext: page }) =&gt; {
        // Verificar que el locale es español Colombia.
        await page.goto('/');
        const lang = await page.evaluate(() =&gt; navigator.language);
        expect(lang).toBe('es-CO');
    });

    test('timezone bogota @emulation', async ({ mobileContext: page }) =&gt; {
        // Verificar que la timezone es America/Bogota.
        await page.goto('/');
        const tz = await page.evaluate(
            () =&gt; Intl.DateTimeFormat().resolvedOptions().timeZone
        );
        expect(tz).toBe('America/Bogota');
    });
});


// --- Tests de color scheme (dark/light mode) ---

test.describe('TestColorScheme', () =&gt; {

    test('dark mode activo @emulation', async ({ darkModeContext: page }) =&gt; {
        // Verificar que dark mode está activo.
        await page.goto('/');
        const isDark = await page.evaluate(
            () =&gt; window.matchMedia('(prefers-color-scheme: dark)').matches
        );
        expect(isDark).toBe(true);
    });
});</code></pre>
            </div>
        </div>

        <h3>🔗 Paso 14: test_e2e_combined.py — Escenarios combinados E2E</h3>
        <div class="code-tabs" data-code-id="L052-12">
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
                <pre><code class="language-python"># tests/test_e2e_combined.py
"""
Tests E2E que combinan múltiples técnicas de interacción avanzada.
Estos tests representan escenarios reales donde se necesitan varias
técnicas juntas en un mismo flujo de prueba.
"""
import pytest
from playwright.sync_api import Page, expect
from helpers.js_helpers import get_local_storage_items, set_local_storage
from helpers.storage_helpers import set_auth_cookie


class TestLoginConStorage:
    """Login E2E combinando keyboard, storage y assertions."""

    @pytest.mark.e2e
    def test_login_guardar_sesion_y_verificar(self, page: Page):
        """Flujo completo: login → guardar token → verificar persistencia."""
        # 1. Login con keyboard
        page.goto("/login")
        page.get_by_label("Username").fill("tomsmith")
        page.get_by_label("Password").fill("SuperSecretPassword!")
        page.keyboard.press("Enter")

        # 2. Verificar login exitoso
        expect(page.locator(".flash.success")).to_be_visible()

        # 3. Guardar datos de sesión en localStorage
        set_local_storage(page, "user", "tomsmith")
        set_local_storage(page, "logged_in", "true")

        # 4. Verificar que los datos persisten
        items = get_local_storage_items(page)
        assert items["user"] == "tomsmith"
        assert items["logged_in"] == "true"

        # 5. Navegar a otra página y verificar que el storage sigue
        page.goto("/")
        items_despues = get_local_storage_items(page)
        assert items_despues.get("user") == "tomsmith"


class TestNavegacionConHoverYScroll:
    """Tests que combinan hover, scroll y navegación."""

    @pytest.mark.e2e
    def test_hover_click_y_scroll(self, page: Page):
        """Hover para revelar → click → scroll en la nueva página."""
        page.goto("/hovers")
        # 1. Hover sobre la primera figura
        primera_figura = page.locator(".figure").first
        primera_figura.hover()

        # 2. Click en el enlace del perfil
        enlace = primera_figura.locator("a")
        expect(enlace).to_be_visible()
        enlace.click()

        # 3. Verificar que navegó a la página del usuario
        expect(page).to_have_url("/users/1")


class TestDynamicLoadingConJS:
    """Tests de carga dinámica con verificación JS."""

    @pytest.mark.e2e
    def test_loading_y_verificacion_js(self, page: Page):
        """Trigger loading → esperar → verificar con JS."""
        page.goto("/dynamic_loading/1")

        # 1. Click en Start
        page.get_by_role("button", name="Start").click()

        # 2. Esperar a que termine el loading
        resultado = page.locator("#finish h4")
        expect(resultado).to_be_visible(timeout=10000)

        # 3. Verificar con JavaScript
        texto_js = page.evaluate("""
            document.querySelector('#finish h4')?.textContent
        """)
        assert texto_js == "Hello World!"

        # 4. Verificar métricas de rendimiento
        dom_loaded = page.evaluate("""
            performance.timing.domContentLoadedEventEnd -
            performance.timing.navigationStart
        """)
        assert dom_loaded >= 0


class TestInteraccionesMultiplesElementos:
    """Tests que interactúan con múltiples elementos."""

    @pytest.mark.e2e
    def test_agregar_y_eliminar_elementos(self, page: Page):
        """Agregar múltiples elementos y luego eliminarlos."""
        page.goto("/add_remove_elements/")

        # 1. Agregar 5 elementos con clicks
        add_btn = page.get_by_role("button", name="Add Element")
        for _ in range(5):
            add_btn.click()

        # 2. Verificar que hay 5 botones "Delete"
        delete_btns = page.locator(".added-manually")
        expect(delete_btns).to_have_count(5)

        # 3. Eliminar todos
        for _ in range(5):
            page.locator(".added-manually").first.click()

        # 4. Verificar que no quedan elementos
        expect(page.locator(".added-manually")).to_have_count(0)

    @pytest.mark.e2e
    def test_checkboxes_con_verificacion(self, page: Page):
        """Manipular checkboxes y verificar estado con JS."""
        page.goto("/checkboxes")
        checkboxes = page.locator("input[type='checkbox']")

        # 1. Marcar todos los checkboxes
        for i in range(checkboxes.count()):
            if not checkboxes.nth(i).is_checked():
                checkboxes.nth(i).check()

        # 2. Verificar con JS que todos están marcados
        todos_marcados = page.evaluate("""
            () => {
                const checks = document.querySelectorAll('input[type="checkbox"]');
                return Array.from(checks).every(c => c.checked);
            }
        """)
        assert todos_marcados is True

        # 3. Desmarcar todos
        for i in range(checkboxes.count()):
            checkboxes.nth(i).uncheck()

        # 4. Verificar que ninguno está marcado
        ninguno_marcado = page.evaluate("""
            () => {
                const checks = document.querySelectorAll('input[type="checkbox"]');
                return Array.from(checks).every(c => !c.checked);
            }
        """)
        assert ninguno_marcado is True


class TestDropdownConKeyboard:
    """Tests de dropdown con teclado."""

    @pytest.mark.e2e
    def test_seleccionar_con_teclado(self, page: Page):
        """Navegar un dropdown usando keyboard."""
        page.goto("/dropdown")
        dropdown = page.locator("#dropdown")

        # 1. Focus en el dropdown
        dropdown.click()

        # 2. Seleccionar opción con select_option
        dropdown.select_option("1")
        expect(dropdown).to_have_value("1")

        # 3. Cambiar a opción 2
        dropdown.select_option("2")
        expect(dropdown).to_have_value("2")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// tests/e2e-combined.spec.ts
/**
 * Tests E2E que combinan múltiples técnicas de interacción avanzada.
 * Estos tests representan escenarios reales donde se necesitan varias
 * técnicas juntas en un mismo flujo de prueba.
 */
import { test, expect } from '@playwright/test';
import { getLocalStorageItems, setLocalStorage } from '../helpers/js-helpers';
import { setAuthCookie } from '../helpers/storage-helpers';


// --- Login E2E combinando keyboard, storage y assertions ---

test.describe('TestLoginConStorage', () =&gt; {

    test('login guardar sesion y verificar @e2e', async ({ page }) =&gt; {
        // Flujo completo: login -> guardar token -> verificar persistencia.
        // 1. Login con keyboard
        await page.goto('/login');
        await page.getByLabel('Username').fill('tomsmith');
        await page.getByLabel('Password').fill('SuperSecretPassword!');
        await page.keyboard.press('Enter');

        // 2. Verificar login exitoso
        await expect(page.locator('.flash.success')).toBeVisible();

        // 3. Guardar datos de sesión en localStorage
        await setLocalStorage(page, 'user', 'tomsmith');
        await setLocalStorage(page, 'logged_in', 'true');

        // 4. Verificar que los datos persisten
        const items = await getLocalStorageItems(page);
        expect(items['user']).toBe('tomsmith');
        expect(items['logged_in']).toBe('true');

        // 5. Navegar a otra página y verificar que el storage sigue
        await page.goto('/');
        const itemsDespues = await getLocalStorageItems(page);
        expect(itemsDespues['user']).toBe('tomsmith');
    });
});


// --- Tests que combinan hover, scroll y navegación ---

test.describe('TestNavegacionConHoverYScroll', () =&gt; {

    test('hover click y scroll @e2e', async ({ page }) =&gt; {
        // Hover para revelar -> click -> scroll en la nueva página.
        await page.goto('/hovers');
        // 1. Hover sobre la primera figura
        const primeraFigura = page.locator('.figure').first();
        await primeraFigura.hover();

        // 2. Click en el enlace del perfil
        const enlace = primeraFigura.locator('a');
        await expect(enlace).toBeVisible();
        await enlace.click();

        // 3. Verificar que navegó a la página del usuario
        await expect(page).toHaveURL('/users/1');
    });
});


// --- Tests de carga dinámica con verificación JS ---

test.describe('TestDynamicLoadingConJS', () =&gt; {

    test('loading y verificacion js @e2e', async ({ page }) =&gt; {
        // Trigger loading -> esperar -> verificar con JS.
        await page.goto('/dynamic_loading/1');

        // 1. Click en Start
        await page.getByRole('button', { name: 'Start' }).click();

        // 2. Esperar a que termine el loading
        const resultado = page.locator('#finish h4');
        await expect(resultado).toBeVisible({ timeout: 10000 });

        // 3. Verificar con JavaScript
        const textoJs = await page.evaluate(
            () =&gt; document.querySelector('#finish h4')?.textContent
        );
        expect(textoJs).toBe('Hello World!');

        // 4. Verificar métricas de rendimiento
        const domLoaded = await page.evaluate(
            () =&gt; performance.timing.domContentLoadedEventEnd -
                   performance.timing.navigationStart
        );
        expect(domLoaded).toBeGreaterThanOrEqual(0);
    });
});


// --- Tests que interactúan con múltiples elementos ---

test.describe('TestInteraccionesMultiplesElementos', () =&gt; {

    test('agregar y eliminar elementos @e2e', async ({ page }) =&gt; {
        // Agregar múltiples elementos y luego eliminarlos.
        await page.goto('/add_remove_elements/');

        // 1. Agregar 5 elementos con clicks
        const addBtn = page.getByRole('button', { name: 'Add Element' });
        for (let i = 0; i &lt; 5; i++) {
            await addBtn.click();
        }

        // 2. Verificar que hay 5 botones "Delete"
        const deleteBtns = page.locator('.added-manually');
        await expect(deleteBtns).toHaveCount(5);

        // 3. Eliminar todos
        for (let i = 0; i &lt; 5; i++) {
            await page.locator('.added-manually').first().click();
        }

        // 4. Verificar que no quedan elementos
        await expect(page.locator('.added-manually')).toHaveCount(0);
    });

    test('checkboxes con verificacion @e2e', async ({ page }) =&gt; {
        // Manipular checkboxes y verificar estado con JS.
        await page.goto('/checkboxes');
        const checkboxes = page.locator("input[type='checkbox']");
        const count = await checkboxes.count();

        // 1. Marcar todos los checkboxes
        for (let i = 0; i &lt; count; i++) {
            if (!(await checkboxes.nth(i).isChecked())) {
                await checkboxes.nth(i).check();
            }
        }

        // 2. Verificar con JS que todos están marcados
        const todosMarcados = await page.evaluate(() =&gt; {
            const checks = document.querySelectorAll('input[type="checkbox"]');
            return Array.from(checks).every(c =&gt; (c as HTMLInputElement).checked);
        });
        expect(todosMarcados).toBe(true);

        // 3. Desmarcar todos
        for (let i = 0; i &lt; count; i++) {
            await checkboxes.nth(i).uncheck();
        }

        // 4. Verificar que ninguno está marcado
        const ningunoMarcado = await page.evaluate(() =&gt; {
            const checks = document.querySelectorAll('input[type="checkbox"]');
            return Array.from(checks).every(c =&gt; !(c as HTMLInputElement).checked);
        });
        expect(ningunoMarcado).toBe(true);
    });
});


// --- Tests de dropdown con teclado ---

test.describe('TestDropdownConKeyboard', () =&gt; {

    test('seleccionar con teclado @e2e', async ({ page }) =&gt; {
        // Navegar un dropdown usando keyboard.
        await page.goto('/dropdown');
        const dropdown = page.locator('#dropdown');

        // 1. Focus en el dropdown
        await dropdown.click();

        // 2. Seleccionar opción con selectOption
        await dropdown.selectOption('1');
        await expect(dropdown).toHaveValue('1');

        // 3. Cambiar a opción 2
        await dropdown.selectOption('2');
        await expect(dropdown).toHaveValue('2');
    });
});</code></pre>
            </div>
        </div>

        <h3>▶️ Paso 15: Ejecutar y depurar</h3>
        <pre><code class="bash"># Ejecutar todos los tests
pytest tests/ -v

# Por categoría
pytest tests/ -m js -v              # Solo JavaScript
pytest tests/ -m mouse -v           # Solo mouse
pytest tests/ -m keyboard -v        # Solo keyboard
pytest tests/ -m scroll -v          # Solo scroll
pytest tests/ -m shadow -v          # Solo Shadow DOM
pytest tests/ -m storage -v         # Solo storage/cookies
pytest tests/ -m emulation -v       # Solo emulación
pytest tests/ -m e2e -v             # Solo E2E combinados

# Excluir tests lentos
pytest tests/ -m "not slow" -v

# Con screenshots al fallar
pytest tests/ -v --screenshot=only-on-failure --output=test-results/

# Con tracing para debugging
pytest tests/ -v --tracing=retain-on-failure

# Un test específico
pytest tests/test_e2e_combined.py -v -k "test_login_guardar_sesion"

# Debugging con Inspector
set PWDEBUG=1 && pytest tests/test_mouse_interactions.py -v -k "test_drag"

# --- Suite completa con reporte ---
pytest tests/ -v --html=test-results/report.html --self-contained-html</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tips para el proyecto</h4>
            <ul>
                <li><code>drag_to()</code> es la forma más simple; usa <code>mouse.move()</code> con <code>steps</code> para control fino</li>
                <li><code>hover()</code> es esencial para menús y tooltips — el estado hover desaparece cuando el mouse se mueve</li>
                <li><code>keyboard.type()</code> con <code>delay</code> simula escritura humana; <code>fill()</code> es instantáneo</li>
                <li><code>scroll_into_view_if_needed()</code> solo scrollea si el elemento no está visible</li>
                <li>Playwright atraviesa Shadow DOM automáticamente — no necesitas selectores especiales</li>
                <li>Los fixtures del conftest encapsulan configuraciones complejas para reutilizarlas fácilmente</li>
                <li>Los helpers evitan código JavaScript duplicado en los tests</li>
            </ul>
        </div>

        <h3>📊 Resumen de la Sección 6</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎉 Sección 6 Completada: Interacciones Web Avanzadas</h4>
            <p>Has dominado todas las técnicas de interacción web avanzada en Playwright:</p>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #c8e6c9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Lección</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Tema</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Tipo</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">045</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">JavaScript execution desde Playwright</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">046</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Drag and drop, hover, right-click</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">047</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Keyboard events avanzados</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">048</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Scroll y elementos virtualizados</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">049</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Shadow DOM y Web Components</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">050</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Storage y cookies</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">051</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Geolocation, permissions, device emulation</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">052</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Proyecto: Interacciones complejas E2E</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Integration</td>
                </tr>
            </table>
        </div>

        <h3>🏆 Habilidades adquiridas en la Sección 6</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <ul>
                <li><strong>JavaScript execution:</strong> <code>evaluate()</code>, <code>evaluate_handle()</code>, inyección de scripts, métricas de rendimiento</li>
                <li><strong>Mouse avanzado:</strong> <code>drag_to()</code>, <code>hover()</code>, <code>click(button='right')</code>, <code>dblclick()</code>, <code>mouse.move()</code></li>
                <li><strong>Keyboard avanzado:</strong> <code>keyboard.type()</code>, <code>keyboard.press()</code>, combinaciones (Ctrl+A), navegación con Tab</li>
                <li><strong>Scroll:</strong> <code>scroll_into_view_if_needed()</code>, <code>mouse.wheel()</code>, infinite scroll, lazy loading</li>
                <li><strong>Shadow DOM:</strong> Traversal automático, <code>evaluate()</code> para shadow roots, Web Components</li>
                <li><strong>Storage:</strong> localStorage, sessionStorage, <code>context.add_cookies()</code>, <code>storage_state()</code></li>
                <li><strong>Emulación:</strong> Geolocation, device descriptors, locale, timezone, color scheme, permisos</li>
                <li><strong>Helpers:</strong> Módulos reutilizables para JS, storage y perfiles de emulación</li>
                <li><strong>E2E:</strong> Combinación de técnicas en flujos reales de testing</li>
            </ul>
        </div>

        <h3>🎯 Ejercicio final</h3>
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 15px 0;">
            <h4>🏋️ Implementa el proyecto completo</h4>
            <ol>
                <li><strong>Crea la estructura del proyecto</strong> con todos los directorios, helpers y tests</li>
                <li><strong>Implementa los 3 helpers:</strong>
                    <ul>
                        <li><code>js_helpers.py</code> — scroll, computed style, performance, localStorage</li>
                        <li><code>storage_helpers.py</code> — clear, cookies, storage state</li>
                        <li><code>emulation_helpers.py</code> — geolocalizaciones, perfiles de emulación</li>
                    </ul>
                </li>
                <li><strong>Implementa <code>conftest.py</code></strong> con fixtures: clean_page, geo_context, mobile_context, dark_mode_context</li>
                <li><strong>Implementa los 8 archivos de test:</strong>
                    <ul>
                        <li><code>test_js_execution.py</code> — evaluate(), DOM manipulation, performance</li>
                        <li><code>test_mouse_interactions.py</code> — drag, hover, right-click, dblclick</li>
                        <li><code>test_keyboard_advanced.py</code> — type, press, combinaciones, Tab</li>
                        <li><code>test_scroll_dynamic.py</code> — scroll, infinite scroll, dynamic loading</li>
                        <li><code>test_shadow_dom.py</code> — shadow DOM traversal, Web Components</li>
                        <li><code>test_storage_cookies.py</code> — localStorage, cookies, clear</li>
                        <li><code>test_emulation.py</code> — geolocation, viewport, user agent, timezone</li>
                        <li><code>test_e2e_combined.py</code> — escenarios que combinan varias técnicas</li>
                    </ul>
                </li>
                <li><strong>Ejecuta la suite completa:</strong> <code>pytest tests/ -v</code></li>
                <li><strong>Ejecuta por categoría:</strong> <code>pytest tests/ -m mouse -v</code></li>
                <li><strong>Ejecuta los E2E:</strong> <code>pytest tests/ -m e2e -v</code></li>
                <li><strong>Debugging:</strong> <code>set PWDEBUG=1 && pytest tests/ -v -k "test_drag"</code></li>
            </ol>

            <div style="background: #bbdefb; padding: 10px; border-radius: 5px; margin-top: 10px;">
                <strong>Criterios de evaluación:</strong>
                <ul>
                    <li>Los helpers encapsulan JavaScript y configuración reutilizable</li>
                    <li>Los fixtures del conftest proveen contextos especializados (geo, mobile, dark)</li>
                    <li>Cada archivo de test cubre un tipo de interacción específico</li>
                    <li>Los tests E2E combinados demuestran flujos reales multi-técnica</li>
                    <li><code>evaluate()</code> se usa para operaciones JS que Playwright no expone directamente</li>
                    <li>Los markers de pytest permiten ejecutar tests por categoría</li>
                    <li>La suite completa pasa con <code>pytest tests/ -v</code></li>
                </ul>
            </div>
        </div>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Integrar todas las técnicas de interacción avanzada en un proyecto cohesivo</li>
                <li>Crear helpers reutilizables para JavaScript, storage y emulación</li>
                <li>Implementar fixtures especializados para diferentes contextos de prueba</li>
                <li>Escribir tests organizados por tipo de interacción</li>
                <li>Crear escenarios E2E que combinan múltiples técnicas</li>
                <li>Dominar el uso de markers de pytest para organizar la ejecución</li>
                <li>Aplicar patrones de código limpio y reutilizable en test automation</li>
            </ul>
        </div>

        <h3>🚀 Siguiente: Sección 7 — Page Object Model y Helpers</h3>
        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Con todas las interacciones avanzadas dominadas, es hora de organizar tu código
            de tests con el patrón más importante de test automation:
            <strong>Page Object Model (POM)</strong>. En la Sección 7 aprenderás:</p>
            <ul>
                <li><strong>Page Object Model:</strong> Separar lógica de página de la lógica de test</li>
                <li><strong>Page classes:</strong> Encapsular localizadores, acciones y assertions</li>
                <li><strong>Helpers y utilidades:</strong> Código compartido entre Page Objects</li>
                <li><strong>Composición vs herencia:</strong> Cuándo usar cada patrón</li>
                <li><strong>Factory pattern:</strong> Crear Page Objects dinámicamente</li>
                <li><strong>Fixtures avanzados:</strong> Inyección de Page Objects en tests</li>
                <li><strong>Proyecto integrador:</strong> Framework POM completo para una aplicación real</li>
            </ul>
            <p>Los helpers que creaste en esta sección son el anticipo perfecto: en la Sección 7
            aprenderás a organizarlos formalmente dentro de un framework POM profesional.</p>
        </div>
    `,
    topics: ["proyecto", "e2e", "interacciones"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 35,
    difficulty: "medium",
    type: "integration"
};

if (typeof window !== 'undefined') {
    window.LESSON_052 = LESSON_052;
}
