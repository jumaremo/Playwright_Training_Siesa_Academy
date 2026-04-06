/**
 * Playwright Academy - Leccion 133
 * Network Mocking + Visual Regression
 * Seccion 20: Proyectos Capstone
 */

const LESSON_133 = {
    id: 133,
    title: "Network Mocking + Visual Regression",
    duration: "20 min",
    level: "advanced",
    section: "section-20",
    content: `
        <h2>Network Mocking + Visual Regression</h2>
        <p>En este proyecto capstone combinaras dos tecnicas poderosas: <strong>network mocking</strong>
        para crear tests deterministas (siempre los mismos datos) y <strong>regresion visual</strong>
        para detectar cambios inesperados en la UI. Juntas, estas tecnicas permiten tests visuales
        100% reproducibles — el santo grial del testing de interfaces.</p>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>En SIESA utilizamos mocking de APIs para los tests visuales del modulo de reportes.
            Como los reportes muestran datos financieros que cambian diariamente, mockear las APIs
            nos permite comparar screenshots de forma consistente sin falsos positivos por cambios
            de datos.</p>
        </div>

        <h3>Network Mocking: APIs deterministas</h3>

        <pre><code class="python"># mocks/product_mocks.py
"""Datos mockeados para tests visuales."""

MOCK_PRODUCTS = [
    {
        "id": "prod-001",
        "name": "Laptop Dell XPS 15",
        "price": 2999.99,
        "image": "/images/laptop.jpg",
        "category": "electronics",
        "rating": 4.8,
        "reviews": 156
    },
    {
        "id": "prod-002",
        "name": "Mouse Logitech MX Master 3",
        "price": 99.99,
        "image": "/images/mouse.jpg",
        "category": "electronics",
        "rating": 4.9,
        "reviews": 342
    },
    {
        "id": "prod-003",
        "name": "Monitor Samsung 4K 27\"",
        "price": 499.99,
        "image": "/images/monitor.jpg",
        "category": "electronics",
        "rating": 4.6,
        "reviews": 89
    },
]

MOCK_USER = {
    "id": "user-001",
    "name": "Juan Reina",
    "email": "juan@siesa.com",
    "role": "admin",
    "avatar": "/images/avatar.jpg"
}</code></pre>

        <pre><code class="python"># fixtures/mock_fixtures.py
"""Fixtures para interceptar y mockear requests de red."""
import pytest
import json
from mocks.product_mocks import MOCK_PRODUCTS, MOCK_USER

@pytest.fixture
def mock_api(page):
    """Interceptar todas las API calls con datos mockeados."""

    def setup_mocks():
        # Mock: GET /api/products
        page.route("**/api/products", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps(MOCK_PRODUCTS)
        ))

        # Mock: GET /api/products/:id
        def handle_product_detail(route):
            product_id = route.request.url.split("/")[-1]
            product = next((p for p in MOCK_PRODUCTS if p["id"] == product_id), None)
            if product:
                route.fulfill(status=200, content_type="application/json",
                              body=json.dumps(product))
            else:
                route.fulfill(status=404, body='{"error":"Not found"}')

        page.route("**/api/products/*", handle_product_detail)

        # Mock: GET /api/user/me
        page.route("**/api/user/me", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps(MOCK_USER)
        ))

        # Mock: imagenes (reemplazar con placeholders para consistencia)
        page.route("**/images/**", lambda route: route.fulfill(
            status=200,
            content_type="image/png",
            path="data/placeholder.png"
        ))

    setup_mocks()
    return page</code></pre>

        <h3>Visual Regression con Playwright Screenshots</h3>

        <pre><code class="python"># tests/visual/test_visual_regression.py
"""Tests de regresion visual con datos mockeados."""
import pytest
from pathlib import Path
from PIL import Image
import io

BASELINE_DIR = Path("data/visual-baselines")
ACTUAL_DIR = Path("test-results/visual-actual")
DIFF_DIR = Path("test-results/visual-diff")

def compare_screenshots(baseline_path, actual_bytes, threshold=0.01):
    """Comparar screenshot actual con baseline. Retorna diferencia porcentual."""
    if not baseline_path.exists():
        # Primera ejecucion: guardar como baseline
        baseline_path.parent.mkdir(parents=True, exist_ok=True)
        baseline_path.write_bytes(actual_bytes)
        return 0.0

    baseline = Image.open(baseline_path)
    actual = Image.open(io.BytesIO(actual_bytes))

    # Redimensionar si es necesario
    if baseline.size != actual.size:
        actual = actual.resize(baseline.size)

    # Comparar pixel a pixel
    baseline_pixels = list(baseline.getdata())
    actual_pixels = list(actual.getdata())

    diff_count = 0
    total_pixels = len(baseline_pixels)

    for bp, ap in zip(baseline_pixels, actual_pixels):
        if isinstance(bp, tuple) and isinstance(ap, tuple):
            if any(abs(b - a) > 10 for b, a in zip(bp, ap)):
                diff_count += 1
        elif bp != ap:
            diff_count += 1

    diff_percentage = diff_count / total_pixels if total_pixels > 0 else 0
    return diff_percentage

class TestVisualRegression:
    def test_homepage_visual(self, mock_api):
        page = mock_api
        page.goto("/")
        page.wait_for_load_state("networkidle")

        actual = page.screenshot(full_page=True)
        ACTUAL_DIR.mkdir(parents=True, exist_ok=True)
        (ACTUAL_DIR / "homepage.png").write_bytes(actual)

        diff = compare_screenshots(BASELINE_DIR / "homepage.png", actual)
        assert diff < 0.01, f"Visual regression: {diff:.2%} diferencia (max: 1%)"

    def test_product_catalog_visual(self, mock_api):
        page = mock_api
        page.goto("/products")
        page.wait_for_load_state("networkidle")

        actual = page.screenshot(full_page=True)
        (ACTUAL_DIR / "catalog.png").write_bytes(actual)

        diff = compare_screenshots(BASELINE_DIR / "catalog.png", actual)
        assert diff < 0.01, f"Visual regression: {diff:.2%} diferencia"

    def test_product_detail_visual(self, mock_api):
        page = mock_api
        page.goto("/products/prod-001")
        page.wait_for_load_state("networkidle")

        actual = page.screenshot(full_page=True)
        (ACTUAL_DIR / "product_detail.png").write_bytes(actual)

        diff = compare_screenshots(BASELINE_DIR / "product_detail.png", actual)
        assert diff < 0.02, f"Visual regression: {diff:.2%} diferencia (max: 2%)"</code></pre>

        <h3>Ocultar contenido dinamico para visual testing</h3>

        <pre><code class="python"># utils/visual_helpers.py
"""Helpers para ocultar/reemplazar contenido dinamico en screenshots."""

def hide_dynamic_content(page):
    """Ocultar elementos que cambian entre ejecuciones."""
    page.evaluate("""() => {
        // Ocultar timestamps
        document.querySelectorAll('[data-testid*="timestamp"], .timestamp, time')
            .forEach(el => el.style.visibility = 'hidden');

        // Ocultar avatares (pueden cambiar)
        document.querySelectorAll('.avatar, [data-testid="user-avatar"]')
            .forEach(el => el.style.visibility = 'hidden');

        // Reemplazar fechas con texto fijo
        document.querySelectorAll('.date, [data-testid*="date"]')
            .forEach(el => el.textContent = '01/01/2026');

        // Ocultar ads y banners dinamicos
        document.querySelectorAll('.ad-banner, .promo-banner')
            .forEach(el => el.style.display = 'none');
    }""")

def freeze_animations(page):
    """Detener todas las animaciones para screenshot consistente."""
    page.evaluate("""() => {
        // Pausar todas las animaciones
        document.getAnimations().forEach(a => a.pause());

        // Deshabilitar CSS animations y transitions
        const style = document.createElement('style');
        style.textContent = '*, *::before, *::after { animation: none !important; transition: none !important; }';
        document.head.appendChild(style);
    }""")</code></pre>

        <pre><code class="python"># Uso en test visual
from utils.visual_helpers import hide_dynamic_content, freeze_animations

def test_dashboard_visual(mock_api):
    page = mock_api
    page.goto("/dashboard")
    page.wait_for_load_state("networkidle")

    hide_dynamic_content(page)
    freeze_animations(page)

    actual = page.screenshot(full_page=True)
    diff = compare_screenshots(BASELINE_DIR / "dashboard.png", actual)
    assert diff < 0.01</code></pre>

        <h3>Actualizar baselines</h3>

        <pre><code class="python"># scripts/update_baselines.py
"""Script para actualizar baselines de visual regression."""
import shutil
from pathlib import Path

ACTUAL_DIR = Path("test-results/visual-actual")
BASELINE_DIR = Path("data/visual-baselines")

def update_baselines():
    if not ACTUAL_DIR.exists():
        print("No hay screenshots actuales. Ejecuta los tests primero.")
        return

    BASELINE_DIR.mkdir(parents=True, exist_ok=True)

    updated = 0
    for actual_file in ACTUAL_DIR.glob("*.png"):
        baseline_file = BASELINE_DIR / actual_file.name
        shutil.copy2(actual_file, baseline_file)
        updated += 1
        print(f"  Actualizado: {actual_file.name}")

    print(f"\\n{updated} baselines actualizados.")

if __name__ == "__main__":
    update_baselines()

# Uso:
# 1. Ejecutar tests: pytest tests/visual/ -v
# 2. Revisar screenshots en test-results/visual-actual/
# 3. Si son correctos: python scripts/update_baselines.py
# 4. Commit los nuevos baselines: git add data/visual-baselines/</code></pre>

        <h3>Criterios de evaluacion</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Criterio</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Pts</th>
                </tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">Network mocking completo (3+ endpoints)</td><td style="padding: 8px; border: 1px solid #ddd;">20</td></tr>
                <tr style="background: #f5f5f5;"><td style="padding: 8px; border: 1px solid #ddd;">Datos mock realistas y consistentes</td><td style="padding: 8px; border: 1px solid #ddd;">10</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">Visual regression con comparacion pixel</td><td style="padding: 8px; border: 1px solid #ddd;">25</td></tr>
                <tr style="background: #f5f5f5;"><td style="padding: 8px; border: 1px solid #ddd;">5+ paginas con screenshots baseline</td><td style="padding: 8px; border: 1px solid #ddd;">15</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">Helpers para contenido dinamico y animaciones</td><td style="padding: 8px; border: 1px solid #ddd;">15</td></tr>
                <tr style="background: #f5f5f5;"><td style="padding: 8px; border: 1px solid #ddd;">Script para actualizar baselines</td><td style="padding: 8px; border: 1px solid #ddd;">15</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>TOTAL</strong></td><td style="padding: 8px; border: 1px solid #ddd;"><strong>100</strong></td></tr>
            </table>
        </div>

        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>En el siguiente proyecto capstone</strong> implementaras testing de
            <strong>Accessibility + Security Audit</strong>, asegurando que tu aplicacion
            cumple con estandares WCAG y practicas basicas de seguridad.</p>
        </div>
    `,
    topics: ["mocking", "visual-regression", "capstone"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 20,
    difficulty: "hard",
    type: "capstone"
};

if (typeof window !== 'undefined') {
    window.LESSON_133 = LESSON_133;
}
