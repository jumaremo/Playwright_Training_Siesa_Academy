/**
 * Playwright Academy - Leccion 122
 * Performance y carga basica
 * Seccion 18: Arquitecturas y Patrones Enterprise
 */

const LESSON_122 = {
    id: 122,
    title: "Performance y carga básica",
    duration: "7 min",
    level: "advanced",
    section: "section-18",
    content: `
        <h2>Performance y carga basica</h2>
        <p>La velocidad de carga de una pagina impacta directamente en la experiencia del usuario
        y en las tasas de conversion. Google utiliza metricas como <strong>Core Web Vitals</strong>
        (LCP, FID, CLS) para rankear paginas en sus resultados de busqueda. Con Playwright puedes
        medir estas metricas automaticamente, establecer baselines de rendimiento, y detectar
        regresiones de performance antes de que lleguen a produccion.</p>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>El equipo de QA de SIESA monitorea los tiempos de carga de los modulos criticos del
            ERP como parte del pipeline de regresion. Si el dashboard de Nomina tarda mas de 3 segundos
            en cargar o la pagina de reportes excede los 5 segundos, el pipeline falla automaticamente
            y se investiga la regresion de performance antes del deploy.</p>
        </div>

        <h3>Core Web Vitals</h3>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Metrica</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Que mide</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Bueno</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Necesita mejora</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Pobre</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>LCP</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Largest Contentful Paint: tiempo hasta que el contenido principal es visible</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">&le; 2.5s</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">2.5s - 4s</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">&gt; 4s</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>FID / INP</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Interaction to Next Paint: tiempo de respuesta a interacciones</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">&le; 200ms</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">200-500ms</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">&gt; 500ms</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>CLS</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Cumulative Layout Shift: estabilidad visual (movimiento inesperado)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">&le; 0.1</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">0.1 - 0.25</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">&gt; 0.25</td>
                </tr>
            </table>
        </div>

        <h3>Medir tiempos de carga con Playwright</h3>

        <div class="code-tabs" data-code-id="L122-1">
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
<pre><code class="language-python"># tests/performance/test_page_load.py
"""Medir tiempos de carga usando la Performance API del navegador."""
from playwright.sync_api import expect

def test_dashboard_load_time(page):
    """Verificar que el dashboard carga en menos de 3 segundos."""

    # Navegar y esperar carga completa
    page.goto("/dashboard")
    page.wait_for_load_state("networkidle")

    # Obtener metricas de Performance API
    metrics = page.evaluate("""() => {
        const perf = performance.getEntriesByType('navigation')[0];
        return {
            // Tiempos clave
            dns: perf.domainLookupEnd - perf.domainLookupStart,
            tcp: perf.connectEnd - perf.connectStart,
            ttfb: perf.responseStart - perf.requestStart,
            download: perf.responseEnd - perf.responseStart,
            domParsing: perf.domInteractive - perf.responseEnd,
            domComplete: perf.domComplete - perf.navigationStart,
            loadComplete: perf.loadEventEnd - perf.navigationStart,
            // Transferencia
            transferSize: perf.transferSize,
            encodedBodySize: perf.encodedBodySize,
        };
    }""")

    print(f"DNS:          {metrics['dns']:.0f}ms")
    print(f"TCP:          {metrics['tcp']:.0f}ms")
    print(f"TTFB:         {metrics['ttfb']:.0f}ms")
    print(f"Download:     {metrics['download']:.0f}ms")
    print(f"DOM Parsing:  {metrics['domParsing']:.0f}ms")
    print(f"DOM Complete: {metrics['domComplete']:.0f}ms")
    print(f"Load Total:   {metrics['loadComplete']:.0f}ms")
    print(f"Transfer:     {metrics['transferSize'] / 1024:.1f} KB")

    # Assertions de performance
    assert metrics["loadComplete"] < 3000, \\
        f"Dashboard tardo {metrics['loadComplete']}ms (max: 3000ms)"
    assert metrics["ttfb"] < 500, \\
        f"TTFB: {metrics['ttfb']}ms (max: 500ms)"</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// tests/performance/page-load.spec.ts
// Medir tiempos de carga usando la Performance API del navegador
import { test, expect } from '@playwright/test';

test('dashboard load time', async ({ page }) => {
    // Verificar que el dashboard carga en menos de 3 segundos

    // Navegar y esperar carga completa
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Obtener metricas de Performance API
    const metrics = await page.evaluate(() => {
        const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return {
            // Tiempos clave
            dns: perf.domainLookupEnd - perf.domainLookupStart,
            tcp: perf.connectEnd - perf.connectStart,
            ttfb: perf.responseStart - perf.requestStart,
            download: perf.responseEnd - perf.responseStart,
            domParsing: perf.domInteractive - perf.responseEnd,
            domComplete: perf.domComplete - perf.navigationStart,
            loadComplete: perf.loadEventEnd - perf.navigationStart,
            // Transferencia
            transferSize: perf.transferSize,
            encodedBodySize: perf.encodedBodySize,
        };
    });

    console.log(\`DNS:          \${metrics.dns.toFixed(0)}ms\`);
    console.log(\`TCP:          \${metrics.tcp.toFixed(0)}ms\`);
    console.log(\`TTFB:         \${metrics.ttfb.toFixed(0)}ms\`);
    console.log(\`Download:     \${metrics.download.toFixed(0)}ms\`);
    console.log(\`DOM Parsing:  \${metrics.domParsing.toFixed(0)}ms\`);
    console.log(\`DOM Complete: \${metrics.domComplete.toFixed(0)}ms\`);
    console.log(\`Load Total:   \${metrics.loadComplete.toFixed(0)}ms\`);
    console.log(\`Transfer:     \${(metrics.transferSize / 1024).toFixed(1)} KB\`);

    // Assertions de performance
    expect(metrics.loadComplete,
        \`Dashboard tardo \${metrics.loadComplete}ms (max: 3000ms)\`)
        .toBeLessThan(3000);
    expect(metrics.ttfb,
        \`TTFB: \${metrics.ttfb}ms (max: 500ms)\`)
        .toBeLessThan(500);
});</code></pre>
</div>
</div>

        <h3>Medir Core Web Vitals con PerformanceObserver</h3>

        <div class="code-tabs" data-code-id="L122-2">
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
<pre><code class="language-python"># tests/performance/test_web_vitals.py
"""Medir Core Web Vitals con PerformanceObserver."""

def test_core_web_vitals(page):
    """Verificar que los Core Web Vitals estan dentro de limites aceptables."""

    # Inyectar observadores ANTES de navegar
    page.add_init_script("""
        window.__webVitals = { lcp: 0, cls: 0, fcp: 0 };

        // LCP - Largest Contentful Paint
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            window.__webVitals.lcp = entries[entries.length - 1].startTime;
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        // CLS - Cumulative Layout Shift
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    window.__webVitals.cls += entry.value;
                }
            }
        }).observe({ type: 'layout-shift', buffered: true });

        // FCP - First Contentful Paint
        new PerformanceObserver((list) => {
            window.__webVitals.fcp = list.getEntries()[0].startTime;
        }).observe({ type: 'paint', buffered: true });
    """)

    # Navegar a la pagina
    page.goto("/dashboard")
    page.wait_for_load_state("networkidle")

    # Esperar un momento para que CLS se estabilice
    page.wait_for_timeout(2000)

    # Obtener las metricas
    vitals = page.evaluate("() => window.__webVitals")

    print(f"LCP: {vitals['lcp']:.0f}ms")
    print(f"CLS: {vitals['cls']:.4f}")
    print(f"FCP: {vitals['fcp']:.0f}ms")

    # Assertions basadas en umbrales de Google
    assert vitals["lcp"] < 2500, f"LCP {vitals['lcp']}ms > 2500ms (pobre)"
    assert vitals["cls"] < 0.1, f"CLS {vitals['cls']} > 0.1 (pobre)"
    assert vitals["fcp"] < 1800, f"FCP {vitals['fcp']}ms > 1800ms (pobre)"</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// tests/performance/web-vitals.spec.ts
// Medir Core Web Vitals con PerformanceObserver
import { test, expect } from '@playwright/test';

// Interfaz para tipar las metricas de Web Vitals
interface WebVitals {
    lcp: number;
    cls: number;
    fcp: number;
}

test('core web vitals', async ({ page }) => {
    // Verificar que los Core Web Vitals estan dentro de limites aceptables

    // Inyectar observadores ANTES de navegar
    await page.addInitScript(() => {
        (window as any).__webVitals = { lcp: 0, cls: 0, fcp: 0 };

        // LCP - Largest Contentful Paint
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            (window as any).__webVitals.lcp = entries[entries.length - 1].startTime;
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        // CLS - Cumulative Layout Shift
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!(entry as any).hadRecentInput) {
                    (window as any).__webVitals.cls += (entry as any).value;
                }
            }
        }).observe({ type: 'layout-shift', buffered: true });

        // FCP - First Contentful Paint
        new PerformanceObserver((list) => {
            (window as any).__webVitals.fcp = list.getEntries()[0].startTime;
        }).observe({ type: 'paint', buffered: true });
    });

    // Navegar a la pagina
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Esperar un momento para que CLS se estabilice
    await page.waitForTimeout(2000);

    // Obtener las metricas
    const vitals = await page.evaluate(() => (window as any).__webVitals as WebVitals);

    console.log(\`LCP: \${vitals.lcp.toFixed(0)}ms\`);
    console.log(\`CLS: \${vitals.cls.toFixed(4)}\`);
    console.log(\`FCP: \${vitals.fcp.toFixed(0)}ms\`);

    // Assertions basadas en umbrales de Google
    expect(vitals.lcp, \`LCP \${vitals.lcp}ms > 2500ms (pobre)\`).toBeLessThan(2500);
    expect(vitals.cls, \`CLS \${vitals.cls} > 0.1 (pobre)\`).toBeLessThan(0.1);
    expect(vitals.fcp, \`FCP \${vitals.fcp}ms > 1800ms (pobre)\`).toBeLessThan(1800);
});</code></pre>
</div>
</div>

        <h3>Monitoreo de requests de red</h3>

        <div class="code-tabs" data-code-id="L122-3">
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
<pre><code class="language-python"># tests/performance/test_network_performance.py
"""Analizar el rendimiento de red durante la carga."""

def test_network_requests_analysis(page):
    """Analizar cantidad, tamaño y tiempo de requests."""

    requests_data = []

    def capture_request(response):
        requests_data.append({
            "url": response.url,
            "status": response.status,
            "size": len(response.body()) if response.ok else 0,
            "timing": response.request.timing,
        })

    page.on("response", capture_request)
    page.goto("/dashboard")
    page.wait_for_load_state("networkidle")

    # Analisis
    total_requests = len(requests_data)
    total_size = sum(r["size"] for r in requests_data)
    failed = [r for r in requests_data if r["status"] >= 400]
    slow = [r for r in requests_data
            if r["timing"].get("responseEnd", 0) > 1000]

    print(f"Total requests: {total_requests}")
    print(f"Total transferido: {total_size / 1024:.1f} KB")
    print(f"Requests fallidos: {len(failed)}")
    print(f"Requests lentos (>1s): {len(slow)}")

    if slow:
        print("Requests mas lentos:")
        for r in sorted(slow, key=lambda x: x["timing"].get("responseEnd", 0), reverse=True)[:5]:
            print(f"  {r['timing'].get('responseEnd', 0):.0f}ms - {r['url'][:80]}")

    # Assertions
    assert len(failed) == 0, f"{len(failed)} requests fallidos"
    assert total_requests < 100, f"Demasiados requests: {total_requests}"
    assert total_size < 5 * 1024 * 1024, f"Payload excesivo: {total_size / 1024 / 1024:.1f} MB"</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// tests/performance/network-performance.spec.ts
// Analizar el rendimiento de red durante la carga
import { test, expect } from '@playwright/test';

// Interfaz para datos de cada request capturado
interface RequestData {
    url: string;
    status: number;
    size: number;
    timing: { responseEnd?: number };
}

test('network requests analysis', async ({ page }) => {
    // Analizar cantidad, tamano y tiempo de requests

    const requestsData: RequestData[] = [];

    page.on('response', async (response) => {
        let size = 0;
        if (response.ok()) {
            try {
                const body = await response.body();
                size = body.length;
            } catch { /* ignorar si el body no esta disponible */ }
        }
        requestsData.push({
            url: response.url(),
            status: response.status(),
            size,
            timing: response.request().timing(),
        });
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Analisis
    const totalRequests = requestsData.length;
    const totalSize = requestsData.reduce((sum, r) => sum + r.size, 0);
    const failed = requestsData.filter(r => r.status >= 400);
    const slow = requestsData.filter(
        r => (r.timing.responseEnd ?? 0) > 1000
    );

    console.log(\`Total requests: \${totalRequests}\`);
    console.log(\`Total transferido: \${(totalSize / 1024).toFixed(1)} KB\`);
    console.log(\`Requests fallidos: \${failed.length}\`);
    console.log(\`Requests lentos (>1s): \${slow.length}\`);

    if (slow.length > 0) {
        console.log('Requests mas lentos:');
        slow.sort((a, b) => (b.timing.responseEnd ?? 0) - (a.timing.responseEnd ?? 0))
            .slice(0, 5)
            .forEach(r => {
                console.log(\`  \${(r.timing.responseEnd ?? 0).toFixed(0)}ms - \${r.url.slice(0, 80)}\`);
            });
    }

    // Assertions
    expect(failed.length, \`\${failed.length} requests fallidos\`).toBe(0);
    expect(totalRequests, \`Demasiados requests: \${totalRequests}\`).toBeLessThan(100);
    expect(totalSize, \`Payload excesivo: \${(totalSize / 1024 / 1024).toFixed(1)} MB\`)
        .toBeLessThan(5 * 1024 * 1024);
});</code></pre>
</div>
</div>

        <h3>Performance baselines y regresion</h3>

        <div class="code-tabs" data-code-id="L122-4">
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
<pre><code class="language-python"># tests/performance/conftest.py
"""Fixtures para tests de performance con baselines."""
import pytest
import json
import os
from pathlib import Path

BASELINES_FILE = Path("data/performance_baselines.json")

@pytest.fixture(scope="session")
def perf_baselines():
    """Cargar baselines de performance."""
    if BASELINES_FILE.exists():
        return json.loads(BASELINES_FILE.read_text())
    return {}

@pytest.fixture
def assert_performance(perf_baselines):
    """Fixture para comparar contra baselines con tolerancia."""

    def _assert(page_name: str, metric: str, value: float, tolerance: float = 0.2):
        key = f"{page_name}.{metric}"
        baseline = perf_baselines.get(key)

        if baseline is None:
            print(f"  [INFO] Sin baseline para {key} = {value:.1f}")
            return

        max_allowed = baseline * (1 + tolerance)
        assert value <= max_allowed, (
            f"Regresion de performance en {key}: "
            f"{value:.1f} > {max_allowed:.1f} "
            f"(baseline: {baseline:.1f}, tolerancia: {tolerance*100}%)"
        )

    return _assert

# Uso en test:
def test_dashboard_perf_regression(page, assert_performance):
    page.goto("/dashboard")
    page.wait_for_load_state("networkidle")

    load_time = page.evaluate("""() => {
        const nav = performance.getEntriesByType('navigation')[0];
        return nav.loadEventEnd - nav.navigationStart;
    }""")

    assert_performance("dashboard", "load_time", load_time)
    assert_performance("dashboard", "max_load", load_time, tolerance=0.1)</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// tests/performance/perf-fixtures.ts
// Fixtures para tests de performance con baselines
import { test as base, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Interfaz para baselines
interface PerfBaselines {
    [key: string]: number;
}

const BASELINES_FILE = path.resolve('data/performance_baselines.json');

// Cargar baselines de performance
function loadBaselines(): PerfBaselines {
    if (fs.existsSync(BASELINES_FILE)) {
        return JSON.parse(fs.readFileSync(BASELINES_FILE, 'utf-8'));
    }
    return {};
}

// Funcion para comparar contra baselines con tolerancia
function assertPerformance(
    baselines: PerfBaselines,
    pageName: string,
    metric: string,
    value: number,
    tolerance: number = 0.2
): void {
    const key = \`\${pageName}.\${metric}\`;
    const baseline = baselines[key];

    if (baseline === undefined) {
        console.log(\`  [INFO] Sin baseline para \${key} = \${value.toFixed(1)}\`);
        return;
    }

    const maxAllowed = baseline * (1 + tolerance);
    expect(value, \`Regresion de performance en \${key}: \` +
        \`\${value.toFixed(1)} > \${maxAllowed.toFixed(1)} \` +
        \`(baseline: \${baseline.toFixed(1)}, tolerancia: \${(tolerance * 100)}%)\`)
        .toBeLessThanOrEqual(maxAllowed);
}

// Extender test con fixture de performance
const test = base.extend<{ perfBaselines: PerfBaselines }>({
    perfBaselines: async ({}, use) => {
        await use(loadBaselines());
    },
});

// Uso en test:
test('dashboard perf regression', async ({ page, perfBaselines }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const loadTime = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return nav.loadEventEnd - nav.navigationStart;
    });

    assertPerformance(perfBaselines, 'dashboard', 'load_time', loadTime);
    assertPerformance(perfBaselines, 'dashboard', 'max_load', loadTime, 0.1);
});</code></pre>
</div>
</div>

        <pre><code class="json">// data/performance_baselines.json
{
    "dashboard.load_time": 1500,
    "dashboard.max_load": 2000,
    "products.load_time": 1200,
    "login.load_time": 800,
    "reports.load_time": 3000
}</code></pre>

        <div style="background: #fce4ec; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Importante: Playwright no es una herramienta de carga</h4>
            <p>Playwright mide el rendimiento <strong>percibido por un usuario individual</strong>.
            Para tests de carga con multiples usuarios concurrentes, usa herramientas especializadas
            como <strong>Locust</strong>, <strong>k6</strong> o <strong>Artillery</strong>.
            Playwright complementa estas herramientas midiendo la experiencia real del navegador.</p>
        </div>

        <h3>Integracion con Lighthouse CI</h3>

        <div class="code-tabs" data-code-id="L122-5">
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
<pre><code class="language-python"># scripts/lighthouse_check.py
"""Ejecutar Lighthouse CI y verificar umbrales."""
import subprocess
import json

def run_lighthouse(url, output="reports/lighthouse.json"):
    """Ejecutar Lighthouse en modo headless."""
    cmd = [
        "npx", "lighthouse", url,
        "--output=json",
        f"--output-path={output}",
        "--chrome-flags='--headless --no-sandbox'",
        "--only-categories=performance"
    ]
    subprocess.run(cmd, check=True)

    with open(output) as f:
        result = json.load(f)

    scores = {
        "performance": result["categories"]["performance"]["score"] * 100,
        "fcp": result["audits"]["first-contentful-paint"]["numericValue"],
        "lcp": result["audits"]["largest-contentful-paint"]["numericValue"],
        "cls": result["audits"]["cumulative-layout-shift"]["numericValue"],
        "tbt": result["audits"]["total-blocking-time"]["numericValue"],
    }
    return scores

# Verificar umbrales
scores = run_lighthouse("http://localhost:3000/dashboard")
assert scores["performance"] >= 80, f"Performance score: {scores['performance']}"
assert scores["lcp"] < 2500, f"LCP: {scores['lcp']}ms"</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// scripts/lighthouse-check.ts
// Ejecutar Lighthouse CI y verificar umbrales
import { execSync } from 'child_process';
import * as fs from 'fs';

interface LighthouseScores {
    performance: number;
    fcp: number;
    lcp: number;
    cls: number;
    tbt: number;
}

function runLighthouse(
    url: string,
    output: string = 'reports/lighthouse.json'
): LighthouseScores {
    // Ejecutar Lighthouse en modo headless
    execSync(
        \`npx lighthouse \${url} \` +
        \`--output=json \` +
        \`--output-path=\${output} \` +
        \`--chrome-flags='--headless --no-sandbox' \` +
        \`--only-categories=performance\`,
        { stdio: 'inherit' }
    );

    const result = JSON.parse(fs.readFileSync(output, 'utf-8'));

    return {
        performance: result.categories.performance.score * 100,
        fcp: result.audits['first-contentful-paint'].numericValue,
        lcp: result.audits['largest-contentful-paint'].numericValue,
        cls: result.audits['cumulative-layout-shift'].numericValue,
        tbt: result.audits['total-blocking-time'].numericValue,
    };
}

// Verificar umbrales
const scores = runLighthouse('http://localhost:3000/dashboard');
console.assert(
    scores.performance >= 80,
    \`Performance score: \${scores.performance}\`
);
console.assert(
    scores.lcp < 2500,
    \`LCP: \${scores.lcp}ms\`
);</code></pre>
</div>
</div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Ejercicio Practico</h4>
            <p>Implementa un sistema de monitoreo de performance:</p>
            <ol>
                <li>Crea un test que mida el tiempo de carga de 3 paginas distintas</li>
                <li>Implementa medicion de Core Web Vitals (LCP, CLS, FCP)</li>
                <li>Crea un archivo de baselines con umbrales por pagina</li>
                <li>Implementa el fixture <code>assert_performance</code> con tolerancia configurable</li>
                <li>Agrega analisis de requests de red (total, tamaño, lentos)</li>
            </ol>
        </div>

        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>En la siguiente leccion</strong> completaras el
            <strong>Proyecto: Framework enterprise completo</strong>, donde integraras todos
            los conceptos de esta seccion en un framework de testing robusto y escalable.</p>
        </div>
    `,
    topics: ["performance", "carga", "métricas"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_122 = LESSON_122;
}
