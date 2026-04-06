/**
 * Playwright Academy - Leccion 131
 * Multi-browser + Multi-device
 * Seccion 20: Proyectos Capstone
 */

const LESSON_131 = {
    id: 131,
    title: "Multi-browser + Multi-device",
    duration: "20 min",
    level: "advanced",
    section: "section-20",
    content: `
        <h2>Multi-browser + Multi-device</h2>
        <p>Playwright soporta <strong>Chromium, Firefox y WebKit</strong> con una unica API.
        En este proyecto capstone construiras una suite que valide tu aplicacion en multiples
        navegadores y dispositivos, asegurando una experiencia consistente para todos los usuarios.</p>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>En SIESA ejecutamos la suite de regresion en Chromium (85% de usuarios), Firefox (10%)
            y WebKit/Safari (5%). Los tests criticos de checkout se ejecutan en los 3 navegadores,
            mientras que el resto se ejecuta solo en Chromium para optimizar tiempos de CI.</p>
        </div>

        <h3>Configuracion multi-browser</h3>

        <pre><code class="python"># conftest.py - Configuracion cross-browser
import pytest

# Ejecucion por linea de comandos:
# pytest --browser chromium           # Solo Chromium
# pytest --browser firefox            # Solo Firefox
# pytest --browser webkit             # Solo WebKit
# pytest --browser chromium --browser firefox  # Ambos

# Fixture para contexto con configuracion especifica por browser
@pytest.fixture
def browser_context_args(browser_context_args, browser_name):
    """Ajustar configuracion segun el navegador."""
    config = {**browser_context_args}

    if browser_name == "firefox":
        # Firefox necesita configuracion especifica
        config["viewport"] = {"width": 1920, "height": 1080}

    if browser_name == "webkit":
        # WebKit (Safari) tiene limitaciones
        config["viewport"] = {"width": 1440, "height": 900}

    return config</code></pre>

        <h3>Emulacion de dispositivos moviles</h3>

        <pre><code class="python"># Playwright incluye perfiles de dispositivos reales
from playwright.sync_api import sync_playwright

# Ver todos los dispositivos disponibles:
with sync_playwright() as p:
    print(list(p.devices.keys()))
    # ['Blackberry PlayBook', 'BlackBerry Z30', 'Galaxy Note 3',
    #  'Galaxy Note II', 'Galaxy S III', 'Galaxy S5', 'Galaxy S8',
    #  'Galaxy S9+', 'Galaxy Tab S4', 'iPad (gen 6)', 'iPad (gen 7)',
    #  'iPad Mini', 'iPad Pro 11', 'iPhone 6', 'iPhone 7', 'iPhone 8',
    #  'iPhone 11', 'iPhone 12', 'iPhone 13', 'iPhone 14', ...]</code></pre>

        <pre><code class="python"># conftest.py - Fixtures para dispositivos moviles
import pytest

DEVICES = {
    "iphone14": {
        "viewport": {"width": 390, "height": 844},
        "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
        "device_scale_factor": 3,
        "is_mobile": True,
        "has_touch": True,
    },
    "galaxy_s23": {
        "viewport": {"width": 360, "height": 780},
        "user_agent": "Mozilla/5.0 (Linux; Android 14; SM-S911B) AppleWebKit/537.36",
        "device_scale_factor": 3,
        "is_mobile": True,
        "has_touch": True,
    },
    "ipad_pro": {
        "viewport": {"width": 1024, "height": 1366},
        "user_agent": "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
        "device_scale_factor": 2,
        "is_mobile": True,
        "has_touch": True,
    },
    "desktop_hd": {
        "viewport": {"width": 1920, "height": 1080},
        "is_mobile": False,
        "has_touch": False,
    },
}

@pytest.fixture(params=list(DEVICES.keys()), ids=list(DEVICES.keys()))
def device_context(request, browser):
    """Contexto parametrizado para cada dispositivo."""
    device_config = DEVICES[request.param]
    context = browser.new_context(**device_config)
    page = context.new_page()
    yield page, request.param
    context.close()

@pytest.fixture
def mobile_page(browser):
    """Pagina en modo mobile (iPhone 14)."""
    context = browser.new_context(**DEVICES["iphone14"])
    page = context.new_page()
    yield page
    context.close()

@pytest.fixture
def tablet_page(browser):
    """Pagina en modo tablet (iPad Pro)."""
    context = browser.new_context(**DEVICES["ipad_pro"])
    page = context.new_page()
    yield page
    context.close()</code></pre>

        <h3>Tests responsive con breakpoints</h3>

        <pre><code class="python"># tests/responsive/test_responsive_layout.py
import pytest
from playwright.sync_api import expect

BREAKPOINTS = [
    {"name": "mobile", "width": 375, "height": 812},
    {"name": "tablet", "width": 768, "height": 1024},
    {"name": "desktop", "width": 1280, "height": 800},
    {"name": "wide", "width": 1920, "height": 1080},
]

@pytest.mark.parametrize("bp", BREAKPOINTS, ids=[b["name"] for b in BREAKPOINTS])
def test_navbar_adapts_to_viewport(browser, bp, base_url):
    context = browser.new_context(viewport={"width": bp["width"], "height": bp["height"]})
    page = context.new_page()
    page.goto(base_url)

    if bp["width"] < 768:
        # Mobile: menu hamburguesa visible, links ocultos
        expect(page.locator("[data-testid='hamburger-menu']")).to_be_visible()
        expect(page.locator("[data-testid='nav-links']")).to_be_hidden()
    else:
        # Desktop/Tablet: links visibles, hamburguesa oculto
        expect(page.locator("[data-testid='nav-links']")).to_be_visible()
        expect(page.locator("[data-testid='hamburger-menu']")).to_be_hidden()

    context.close()

@pytest.mark.parametrize("bp", BREAKPOINTS, ids=[b["name"] for b in BREAKPOINTS])
def test_product_grid_columns(browser, bp, base_url):
    context = browser.new_context(viewport={"width": bp["width"], "height": bp["height"]})
    page = context.new_page()
    page.goto(f"{base_url}/products")

    grid = page.locator("[data-testid='product-grid']")
    grid_style = grid.evaluate("el => window.getComputedStyle(el).gridTemplateColumns")

    if bp["width"] < 768:
        # Mobile: 1 columna
        assert grid_style.count(" ") == 0 or "1fr" in grid_style
    elif bp["width"] < 1280:
        # Tablet: 2 columnas
        assert grid_style.count(" ") >= 1
    else:
        # Desktop: 3-4 columnas
        assert grid_style.count(" ") >= 2

    context.close()</code></pre>

        <h3>Tests touch en mobile</h3>

        <pre><code class="python"># tests/responsive/test_touch_interactions.py
from playwright.sync_api import expect

def test_swipe_to_navigate_carousel(mobile_page):
    """Verificar que el carousel funciona con swipe en mobile."""
    page = mobile_page
    page.goto("/")

    carousel = page.locator("[data-testid='hero-carousel']")
    expect(carousel).to_be_visible()

    # Obtener posicion inicial
    first_slide = page.locator("[data-testid='slide-1']")
    expect(first_slide).to_be_visible()

    # Simular swipe izquierda
    box = carousel.bounding_box()
    page.mouse.move(box["x"] + box["width"] * 0.8, box["y"] + box["height"] / 2)
    page.mouse.down()
    page.mouse.move(box["x"] + box["width"] * 0.2, box["y"] + box["height"] / 2, steps=10)
    page.mouse.up()

    # Verificar que se movio al segundo slide
    second_slide = page.locator("[data-testid='slide-2']")
    expect(second_slide).to_be_visible()

def test_long_press_shows_context_menu(mobile_page):
    """Verificar que long-press muestra opciones en mobile."""
    page = mobile_page
    page.goto("/products")

    product = page.locator("[data-testid='product-card']").first
    # Simular long press
    product.click(delay=1000)

    expect(page.locator("[data-testid='context-menu']")).to_be_visible()</code></pre>

        <h3>Matrix de browsers en CI</h3>

        <pre><code class="yaml"># .github/workflows/cross-browser.yml
name: Cross-Browser Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        browser: [chromium, firefox, webkit]
        include:
          - browser: chromium
            install: chromium
          - browser: firefox
            install: firefox
          - browser: webkit
            install: webkit

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt
      - run: playwright install --with-deps \${{ matrix.install }}
      - name: Run tests on \${{ matrix.browser }}
        run: |
          pytest tests/ \\
            --browser \${{ matrix.browser }} \\
            --junitxml=reports/\${{ matrix.browser }}.xml \\
            -v --tb=short
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: results-\${{ matrix.browser }}
          path: reports/</code></pre>

        <h3>Screenshots comparativos por dispositivo</h3>

        <pre><code class="python"># tests/visual/test_cross_device_screenshots.py
import pytest
from pathlib import Path

SCREENSHOT_DIR = Path("test-results/visual")

@pytest.mark.parametrize("device_name", ["iphone14", "ipad_pro", "desktop_hd"])
def test_homepage_visual_consistency(browser, device_name, base_url):
    """Capturar screenshot del homepage en cada dispositivo."""
    device_config = DEVICES[device_name]
    context = browser.new_context(**device_config)
    page = context.new_page()
    page.goto(base_url)
    page.wait_for_load_state("networkidle")

    SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)
    page.screenshot(
        path=str(SCREENSHOT_DIR / f"homepage_{device_name}.png"),
        full_page=True
    )

    # Verificar que la pagina cargo correctamente
    from playwright.sync_api import expect
    expect(page.locator("[data-testid='main-content']")).to_be_visible()

    context.close()</code></pre>

        <h3>Criterios de evaluacion</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Criterio</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Pts</th>
                </tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">Tests en 3 navegadores (Chromium, Firefox, WebKit)</td><td style="padding: 8px; border: 1px solid #ddd;">20</td></tr>
                <tr style="background: #f5f5f5;"><td style="padding: 8px; border: 1px solid #ddd;">Emulacion de 3+ dispositivos (mobile, tablet, desktop)</td><td style="padding: 8px; border: 1px solid #ddd;">20</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">Tests responsive con breakpoints parametrizados</td><td style="padding: 8px; border: 1px solid #ddd;">15</td></tr>
                <tr style="background: #f5f5f5;"><td style="padding: 8px; border: 1px solid #ddd;">Tests de interacciones touch (mobile)</td><td style="padding: 8px; border: 1px solid #ddd;">15</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">CI matrix con ejecucion paralela por browser</td><td style="padding: 8px; border: 1px solid #ddd;">15</td></tr>
                <tr style="background: #f5f5f5;"><td style="padding: 8px; border: 1px solid #ddd;">Screenshots comparativos por dispositivo</td><td style="padding: 8px; border: 1px solid #ddd;">15</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>TOTAL</strong></td><td style="padding: 8px; border: 1px solid #ddd;"><strong>100</strong></td></tr>
            </table>
        </div>

        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>En el siguiente proyecto capstone</strong> construiras un
            <strong>CI/CD Pipeline Enterprise</strong> que integre todas las herramientas
            y practicas de deployment automatizado.</p>
        </div>
    `,
    topics: ["multi-browser", "multi-device", "capstone"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 20,
    difficulty: "hard",
    type: "capstone"
};

if (typeof window !== 'undefined') {
    window.LESSON_131 = LESSON_131;
}
