/**
 * Playwright Academy - Leccion 127
 * Test flakiness: prevencion y diagnostico
 * Seccion 19: Best Practices y Patrones
 */

const LESSON_127 = {
    id: 127,
    title: "Test flakiness: prevención y diagnóstico",
    duration: "7 min",
    level: "advanced",
    section: "section-19",
    content: `
        <h2>Test flakiness: prevencion y diagnostico</h2>
        <p>Un test flaky es un test que pasa y falla sin cambios en el codigo. Es el enemigo silencioso
        de la automatizacion: erosiona la confianza, desperdicia tiempo de investigacion, y eventualmente
        lleva al equipo a ignorar los resultados del pipeline. En la leccion 114 vimos como manejar
        flaky tests con retry; ahora vamos mas profundo: aprenderas a <strong>prevenirlos desde el
        diseño</strong> y a <strong>diagnosticar las causas raiz</strong> cuando aparecen.</p>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>En SIESA redujimos la tasa de flakiness del 12% al 2% en 3 meses aplicando
            las tecnicas de esta leccion. La clave fue: (1) reemplazar todos los waits fijos por
            auto-wait de Playwright, (2) aislar datos entre tests, y (3) deshabilitar animaciones
            CSS en el entorno de CI. Cada test flaky se investiga con traces antes de aplicar retry.</p>
        </div>

        <h3>Anatomia de un flaky test</h3>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Causa raiz</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Sintoma</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Prevencion</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Race conditions</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Click no registra, elemento no encontrado</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Usar auto-wait, expect() con timeout</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Animaciones CSS</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Click en elemento que se mueve</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Deshabilitar animaciones en CI</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Datos compartidos</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Test falla solo en ejecucion paralela</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Datos unicos por test, cleanup</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>APIs lentas</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Timeout en espera de datos</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Timeouts adecuados, mocking</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Popups/overlays</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Cookie banner o modal intercepta click</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Cerrar/aceptar en setup</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Recursos CI limitados</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Tests pasan local, fallan en CI</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Ajustar paralelismo, timeouts</td>
                </tr>
            </table>
        </div>

        <h3>Prevencion: deshabilitar animaciones</h3>

        <pre><code class="python"># conftest.py - Deshabilitar animaciones CSS en CI
import pytest
import os

@pytest.fixture(autouse=True)
def disable_animations(page):
    """Inyectar CSS que deshabilita animaciones en CI."""
    if os.getenv("CI"):
        page.add_style_tag(content="""
            *, *::before, *::after {
                animation-duration: 0s !important;
                animation-delay: 0s !important;
                transition-duration: 0s !important;
                transition-delay: 0s !important;
            }
        """)
    yield</code></pre>

        <h3>Prevencion: waits correctos</h3>

        <pre><code class="python">from playwright.sync_api import expect

# ❌ MAL: sleep fijo
import time
time.sleep(3)
page.click("#button")

# ❌ MAL: wait_for_timeout (version Playwright de sleep)
page.wait_for_timeout(3000)
page.click("#button")

# ✅ BIEN: Auto-wait de Playwright (espera automaticamente)
page.click("#button")  # Espera a visible + habilitado + estable

# ✅ BIEN: expect() con retry automatico
expect(page.locator(".result")).to_be_visible()
expect(page.locator(".count")).to_have_text("5")

# ✅ BIEN: Esperar estado especifico
page.wait_for_url("**/dashboard")
page.locator("[data-testid='spinner']").wait_for(state="hidden")

# ✅ BIEN: Esperar respuesta de red
with page.expect_response("**/api/products") as response_info:
    page.click("[data-testid='load-more']")
response = response_info.value
assert response.ok</code></pre>

        <h3>Prevencion: manejo de popups y overlays</h3>

        <pre><code class="python"># conftest.py - Cerrar cookie banners y modales automaticamente
@pytest.fixture(autouse=True)
def handle_cookie_banner(page):
    """Cerrar cookie banner si aparece."""
    yield
    # No es necesario aqui, pero si necesitas cerrar antes:

@pytest.fixture(autouse=True)
def dismiss_overlays(page):
    """Auto-cerrar overlays que puedan interferir."""
    def handle_dialog(dialog):
        dialog.accept()

    page.on("dialog", handle_dialog)

    # Cerrar cookie banner despues de navegacion
    page.add_init_script("""
        // Auto-aceptar cookies si el banner existe
        const observer = new MutationObserver(() => {
            const acceptBtn = document.querySelector('[data-testid="accept-cookies"]');
            if (acceptBtn) {
                acceptBtn.click();
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    """)
    yield</code></pre>

        <h3>Diagnostico: Playwright Trace Viewer</h3>
        <p>La herramienta mas poderosa para diagnosticar flaky tests es el <strong>Trace Viewer</strong>:</p>

        <pre><code class="python"># conftest.py - Capturar trace en CADA fallo
import os
from pathlib import Path

@pytest.fixture(autouse=True)
def capture_trace_on_failure(request, page):
    """Capturar Playwright trace cuando un test falla."""
    # Iniciar tracing
    page.context.tracing.start(
        screenshots=True,
        snapshots=True,
        sources=True
    )

    yield

    # Solo guardar trace si el test fallo
    if hasattr(request.node, "rep_call") and request.node.rep_call.failed:
        test_name = request.node.name[:80].replace(" ", "_")
        trace_dir = Path("test-results/traces")
        trace_dir.mkdir(parents=True, exist_ok=True)
        trace_path = trace_dir / f"{test_name}.zip"

        page.context.tracing.stop(path=str(trace_path))
        print(f"\\n  Trace guardado: {trace_path}")
        print(f"  Ver con: playwright show-trace {trace_path}")
    else:
        page.context.tracing.stop()

# Ver el trace:
# playwright show-trace test-results/traces/test_name.zip
# Abre un visor interactivo con:
# - Timeline de acciones
# - Screenshots de cada paso
# - Snapshots del DOM
# - Network log
# - Console log</code></pre>

        <h3>Diagnostico: analisis de patrones de flakiness</h3>

        <pre><code class="python"># scripts/flaky_analysis.py
"""Analizar historial de ejecuciones para detectar patrones de flakiness."""
import json
import os
from collections import Counter, defaultdict
from pathlib import Path

def analyze_test_history(reports_dir="reports/history", days=30):
    """Analizar JUnit XML reports de los ultimos N dias."""

    test_results = defaultdict(list)  # test_name -> [pass/fail, ...]

    for report_file in Path(reports_dir).glob("junit-*.xml"):
        # Parsear resultados (simplificado)
        import xml.etree.ElementTree as ET
        tree = ET.parse(report_file)
        for testcase in tree.findall(".//testcase"):
            name = testcase.get("name")
            failed = testcase.find("failure") is not None
            test_results[name].append("fail" if failed else "pass")

    # Calcular metricas de flakiness
    flaky_tests = []
    for name, results in test_results.items():
        total = len(results)
        failures = results.count("fail")

        if total >= 5 and 0 < failures < total:
            # Es flaky: a veces pasa, a veces falla
            flaky_rate = failures / total
            flaky_tests.append({
                "test": name,
                "total_runs": total,
                "failures": failures,
                "flaky_rate": f"{flaky_rate:.1%}",
                "pattern": detect_pattern(results)
            })

    return sorted(flaky_tests, key=lambda x: x["failures"], reverse=True)

def detect_pattern(results):
    """Detectar patron de fallo."""
    recent = results[-10:]
    if recent[-3:] == ["fail", "fail", "fail"]:
        return "DEGRADING - ultimas 3 ejecuciones fallaron"
    elif recent.count("fail") == 1:
        return "RARE - fallo aislado"
    else:
        return "INTERMITTENT - fallo aleatorio"</code></pre>

        <h3>Checklist anti-flakiness</h3>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Check</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Pregunta</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Waits</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Usa auto-wait o expect() en lugar de sleep?</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Datos</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Cada test crea y limpia sus propios datos?</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Selectores</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Usa data-testid o roles en lugar de CSS fragil?</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Animaciones</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Estan deshabilitadas en CI?</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Independencia</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">El test pasa solo, sin otros tests antes?</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Network</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Espera respuestas de red antes de assertions?</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Overlays</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Cookie banners y modales se manejan en setup?</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Timeouts</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Los timeouts son adecuados para CI (mas lentos)?</td>
                </tr>
            </table>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Ejercicio Practico</h4>
            <ol>
                <li>Configura Playwright tracing para capturar traces en fallos automaticamente</li>
                <li>Crea el fixture <code>disable_animations</code> que inyecte CSS anti-animaciones</li>
                <li>Implementa el fixture <code>dismiss_overlays</code> para manejar cookie banners</li>
                <li>Reescribe 3 tests que usen <code>sleep()</code> para que usen auto-wait</li>
                <li>Ejecuta un test 10 veces seguidas (<code>pytest --count=10 -x</code>) y verifica estabilidad</li>
            </ol>
        </div>

        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>En la siguiente leccion</strong> exploraras las mejores practicas de
            <strong>code review y estandares QA</strong>, aprendiendo a revisar codigo de tests
            y establecer gates de calidad para tu equipo.</p>
        </div>
    `,
    topics: ["flakiness", "prevención", "diagnóstico"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_127 = LESSON_127;
}
