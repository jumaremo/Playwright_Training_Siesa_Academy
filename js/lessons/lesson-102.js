/**
 * Playwright Academy - Lección 102
 * Auditorías de accesibilidad automatizadas
 * Sección 15: Visual Regression y Accessibility Testing
 */

const LESSON_102 = {
    id: 102,
    title: "Auditorías de accesibilidad automatizadas",
    duration: "7 min",
    level: "advanced",
    section: "section-15",
    content: `
        <h2>♿ Auditorías de accesibilidad automatizadas</h2>
        <p>En la lección anterior aprendimos a integrar <strong>axe-core</strong> para detectar violaciones
        puntuales de accesibilidad. En esta lección llevamos ese conocimiento al siguiente nivel:
        construiremos un <strong>sistema completo de auditoría automatizada</strong> que audita páginas enteras,
        recorre sitemaps, genera reportes HTML/JSON, verifica navegación por teclado, gestión de foco,
        roles ARIA, contraste de color y compara resultados contra una baseline para rastrear la evolución
        de la accesibilidad a lo largo del tiempo.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎯 Objetivos de esta lección</h4>
            <ul>
                <li>Pasar de revisiones manuales a auditorías automatizadas de accesibilidad</li>
                <li>Auditar páginas completas y múltiples páginas de forma sistemática</li>
                <li>Crear una clase <code>AccessibilityAuditor</code> reutilizable</li>
                <li>Configurar reglas: deshabilitar, filtrar por tags WCAG</li>
                <li>Auditar regiones específicas de una página (include/exclude)</li>
                <li>Probar navegación por teclado y gestión de foco con Playwright</li>
                <li>Verificar roles y atributos ARIA programáticamente</li>
                <li>Evaluar contraste de color</li>
                <li>Generar reportes HTML y JSON de auditoría</li>
                <li>Rastrear violaciones a lo largo del tiempo con baseline comparison</li>
            </ul>
        </div>

        <h3>🔄 De revisiones manuales a auditorías automatizadas</h3>
        <p>Las revisiones manuales de accesibilidad son necesarias pero insuficientes a escala.
        Una auditoría automatizada complementa la revisión humana detectando problemas
        <strong>repetibles y medibles</strong> en cada commit.</p>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>❌ Enfoque manual — no escala</h4>
            <pre><code class="python"># Un tester revisa manualmente cada página:
# 1. Abrir DevTools > Lighthouse > Accessibility
# 2. Usar extensión axe DevTools en el navegador
# 3. Navegar con Tab y verificar visualmente el foco
# 4. Probar con lector de pantalla (NVDA/VoiceOver)
# 5. Documentar hallazgos en una hoja de cálculo
#
# Problemas:
# - Subjetivo: depende de quién revise
# - Lento: horas por página
# - No repetible: no se ejecuta en CI/CD
# - Propenso a regresiones: los issues vuelven</code></pre>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Enfoque automatizado — escala y es repetible</h4>
            <pre><code class="python"># Auditoría automatizada en cada commit:
# 1. axe-core evalúa reglas WCAG automáticamente
# 2. Playwright simula navegación por teclado
# 3. Tests verifican roles ARIA y atributos
# 4. Reportes HTML/JSON se generan automáticamente
# 5. Baseline comparison detecta regresiones
#
# Ventajas:
# - Objetivo: las mismas reglas cada vez
# - Rápido: segundos por página
# - Repetible: se ejecuta en cada CI/CD
# - Anti-regresión: detecta issues nuevos inmediatamente</code></pre>
        </div>

        <h3>📋 Auditoría completa de página con axe-core</h3>
        <p>Una auditoría de página completa ejecuta <strong>todas las reglas de axe-core</strong>
        contra el DOM completo, capturando cada violación con su contexto y posible solución.</p>

        <div class="code-tabs" data-code-id="L102-1">
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
            <pre><code class="language-python"># test_full_page_audit.py
"""
Auditoría completa de accesibilidad de una página.
Ejecuta todas las reglas axe-core y genera un reporte detallado.
"""
import json
from pathlib import Path
from playwright.sync_api import Page

# Inyectar axe-core desde CDN o archivo local
AXE_SCRIPT_URL = "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js"


def inject_axe(page: Page):
    """Inyecta axe-core en la página si no está presente."""
    is_loaded = page.evaluate("typeof window.axe !== 'undefined'")
    if not is_loaded:
        page.add_script_tag(url=AXE_SCRIPT_URL)
        page.wait_for_function("typeof window.axe !== 'undefined'")


def run_full_audit(page: Page) -> dict:
    """Ejecuta auditoría completa y retorna resultados."""
    inject_axe(page)
    results = page.evaluate("""
        async () => {
            const results = await axe.run(document, {
                runOnly: {
                    type: 'tag',
                    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']
                },
                resultTypes: ['violations', 'incomplete', 'passes']
            });
            return {
                violations: results.violations,
                incomplete: results.incomplete,
                passes: results.passes.length,
                url: results.url,
                timestamp: results.timestamp
            };
        }
    """)
    return results


def test_pagina_principal_accesible(page: Page):
    """Auditoría completa de la página principal."""
    page.goto("https://mi-app.example.com/")
    page.wait_for_load_state("networkidle")

    results = run_full_audit(page)

    # Resumen de resultados
    print(f"\\n{'='*60}")
    print(f"AUDITORÍA DE ACCESIBILIDAD — {results['url']}")
    print(f"{'='*60}")
    print(f"Reglas aprobadas: {results['passes']}")
    print(f"Violaciones: {len(results['violations'])}")
    print(f"Incompletas (requieren revisión manual): {len(results['incomplete'])}")

    # Detalle de violaciones
    for violation in results['violations']:
        print(f"\\n🔴 [{violation['impact']}] {violation['id']}")
        print(f"   Descripción: {violation['description']}")
        print(f"   Ayuda: {violation['helpUrl']}")
        print(f"   Elementos afectados: {len(violation['nodes'])}")
        for node in violation['nodes'][:3]:  # Mostrar máximo 3
            print(f"   - {node['html'][:100]}")

    # Fallo si hay violaciones críticas o serias
    critical = [v for v in results['violations'] if v['impact'] in ('critical', 'serious')]
    assert len(critical) == 0, (
        f"Se encontraron {len(critical)} violaciones críticas/serias de accesibilidad"
    )</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// test_full_page_audit.ts
/**
 * Auditoría completa de accesibilidad de una página.
 * Ejecuta todas las reglas axe-core y genera un reporte detallado.
 */
import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Inyectar axe-core desde CDN o archivo local
const AXE_SCRIPT_URL = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js';

async function injectAxe(page: Page): Promise<void> {
    /** Inyecta axe-core en la página si no está presente. */
    const isLoaded = await page.evaluate(() => typeof (window as any).axe !== 'undefined');
    if (!isLoaded) {
        await page.addScriptTag({ url: AXE_SCRIPT_URL });
        await page.waitForFunction(() => typeof (window as any).axe !== 'undefined');
    }
}

async function runFullAudit(page: Page): Promise<Record<string, any>> {
    /** Ejecuta auditoría completa y retorna resultados. */
    await injectAxe(page);
    const results = await page.evaluate(async () => {
        const res = await (window as any).axe.run(document, {
            runOnly: {
                type: 'tag',
                values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']
            },
            resultTypes: ['violations', 'incomplete', 'passes']
        });
        return {
            violations: res.violations,
            incomplete: res.incomplete,
            passes: res.passes.length,
            url: res.url,
            timestamp: res.timestamp
        };
    });
    return results;
}

test('página principal accesible', async ({ page }) => {
    /** Auditoría completa de la página principal. */
    await page.goto('https://mi-app.example.com/');
    await page.waitForLoadState('networkidle');

    const results = await runFullAudit(page);

    // Resumen de resultados
    console.log(\`\\n\${'='.repeat(60)}\`);
    console.log(\`AUDITORÍA DE ACCESIBILIDAD — \${results.url}\`);
    console.log('='.repeat(60));
    console.log(\`Reglas aprobadas: \${results.passes}\`);
    console.log(\`Violaciones: \${results.violations.length}\`);
    console.log(\`Incompletas (requieren revisión manual): \${results.incomplete.length}\`);

    // Detalle de violaciones
    for (const violation of results.violations) {
        console.log(\`\\n🔴 [\${violation.impact}] \${violation.id}\`);
        console.log(\`   Descripción: \${violation.description}\`);
        console.log(\`   Ayuda: \${violation.helpUrl}\`);
        console.log(\`   Elementos afectados: \${violation.nodes.length}\`);
        for (const node of violation.nodes.slice(0, 3)) { // Mostrar máximo 3
            console.log(\`   - \${node.html.substring(0, 100)}\`);
        }
    }

    // Fallo si hay violaciones críticas o serias
    const critical = results.violations.filter(
        (v: any) => ['critical', 'serious'].includes(v.impact)
    );
    expect(critical).toHaveLength(0);
});</code></pre>
        </div>
        </div>

        <h3>🗺️ Auditoría de múltiples páginas (sitemap crawling)</h3>
        <p>Para auditar un sitio completo, recorremos un listado de URLs (extraído de un sitemap
        o definido manualmente) y ejecutamos la auditoría en cada una.</p>

        <div class="code-tabs" data-code-id="L102-2">
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
            <pre><code class="language-python"># test_sitemap_audit.py
"""
Auditoría de accesibilidad de múltiples páginas.
Recorre una lista de URLs y genera un reporte consolidado.
"""
import json
import xml.etree.ElementTree as ET
from pathlib import Path
from datetime import datetime
from playwright.sync_api import Page, sync_playwright


def get_urls_from_sitemap(page: Page, sitemap_url: str) -> list[str]:
    """Extrae URLs de un sitemap.xml."""
    response = page.request.get(sitemap_url)
    root = ET.fromstring(response.text())
    namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    urls = [loc.text for loc in root.findall('.//ns:loc', namespace)]
    return urls


def get_urls_manual() -> list[str]:
    """Lista manual de URLs a auditar."""
    base = "https://mi-app.example.com"
    return [
        f"{base}/",
        f"{base}/login",
        f"{base}/registro",
        f"{base}/productos",
        f"{base}/producto/1",
        f"{base}/carrito",
        f"{base}/checkout",
        f"{base}/perfil",
        f"{base}/contacto",
        f"{base}/ayuda",
    ]


def audit_multiple_pages():
    """Audita todas las páginas y genera reporte consolidado."""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        urls = get_urls_manual()
        all_results = []
        total_violations = 0

        for url in urls:
            print(f"\\nAuditando: {url}")
            try:
                page.goto(url, timeout=15000)
                page.wait_for_load_state("networkidle")

                results = run_full_audit(page)
                violation_count = len(results['violations'])
                total_violations += violation_count

                all_results.append({
                    "url": url,
                    "violations": results['violations'],
                    "incomplete": results['incomplete'],
                    "passes": results['passes'],
                    "status": "audited"
                })

                status = "✅" if violation_count == 0 else f"🔴 {violation_count} violaciones"
                print(f"  {status}")

            except Exception as e:
                all_results.append({
                    "url": url,
                    "status": "error",
                    "error": str(e)
                })
                print(f"  ⚠️ Error: {e}")

        # Guardar reporte consolidado
        report = {
            "timestamp": datetime.now().isoformat(),
            "total_pages": len(urls),
            "total_violations": total_violations,
            "pages": all_results
        }

        report_path = Path("a11y-reports/sitemap-audit.json")
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False))

        browser.close()
        print(f"\\n{'='*60}")
        print(f"RESUMEN: {total_violations} violaciones en {len(urls)} páginas")
        print(f"Reporte guardado en: {report_path}")

        assert total_violations == 0, f"Se encontraron {total_violations} violaciones totales"</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// test_sitemap_audit.ts
/**
 * Auditoría de accesibilidad de múltiples páginas.
 * Recorre una lista de URLs y genera un reporte consolidado.
 */
import { chromium, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { XMLParser } from 'fast-xml-parser';

async function getUrlsFromSitemap(page: Page, sitemapUrl: string): Promise<string[]> {
    /** Extrae URLs de un sitemap.xml. */
    const response = await page.request.get(sitemapUrl);
    const text = await response.text();
    const parser = new XMLParser();
    const parsed = parser.parse(text);
    const urls: string[] = parsed.urlset.url.map((u: any) => u.loc);
    return urls;
}

function getUrlsManual(): string[] {
    /** Lista manual de URLs a auditar. */
    const base = 'https://mi-app.example.com';
    return [
        \`\${base}/\`,
        \`\${base}/login\`,
        \`\${base}/registro\`,
        \`\${base}/productos\`,
        \`\${base}/producto/1\`,
        \`\${base}/carrito\`,
        \`\${base}/checkout\`,
        \`\${base}/perfil\`,
        \`\${base}/contacto\`,
        \`\${base}/ayuda\`,
    ];
}

async function auditMultiplePages(): Promise<void> {
    /** Audita todas las páginas y genera reporte consolidado. */
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const urls = getUrlsManual();
    const allResults: any[] = [];
    let totalViolations = 0;

    for (const url of urls) {
        console.log(\`\\nAuditando: \${url}\`);
        try {
            await page.goto(url, { timeout: 15000 });
            await page.waitForLoadState('networkidle');

            const results = await runFullAudit(page);
            const violationCount = results.violations.length;
            totalViolations += violationCount;

            allResults.push({
                url,
                violations: results.violations,
                incomplete: results.incomplete,
                passes: results.passes,
                status: 'audited'
            });

            const status = violationCount === 0
                ? '✅'
                : \`🔴 \${violationCount} violaciones\`;
            console.log(\`  \${status}\`);

        } catch (e) {
            allResults.push({
                url,
                status: 'error',
                error: String(e)
            });
            console.log(\`  ⚠️ Error: \${e}\`);
        }
    }

    // Guardar reporte consolidado
    const report = {
        timestamp: new Date().toISOString(),
        total_pages: urls.length,
        total_violations: totalViolations,
        pages: allResults
    };

    const reportDir = 'a11y-reports';
    fs.mkdirSync(reportDir, { recursive: true });
    const reportPath = path.join(reportDir, 'sitemap-audit.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    await browser.close();
    console.log(\`\\n\${'='.repeat(60)}\`);
    console.log(\`RESUMEN: \${totalViolations} violaciones en \${urls.length} páginas\`);
    console.log(\`Reporte guardado en: \${reportPath}\`);

    if (totalViolations > 0) {
        throw new Error(\`Se encontraron \${totalViolations} violaciones totales\`);
    }
}</code></pre>
        </div>
        </div>

        <h3>🏗️ Clase AccessibilityAuditor reutilizable</h3>
        <p>Encapsulamos toda la lógica de auditoría en una clase helper que puede reutilizarse
        en cualquier test suite. Esta clase maneja la inyección de axe-core, configuración
        de reglas, ejecución de auditorías y generación de reportes.</p>

        <div class="code-tabs" data-code-id="L102-3">
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
            <pre><code class="language-python"># helpers/accessibility_auditor.py
"""
AccessibilityAuditor — Clase helper para auditorías de accesibilidad.
Encapsula axe-core injection, configuración de reglas y reportes.
"""
import json
from pathlib import Path
from datetime import datetime
from dataclasses import dataclass, field
from playwright.sync_api import Page


@dataclass
class A11yViolation:
    """Representa una violación de accesibilidad."""
    rule_id: str
    impact: str  # 'critical', 'serious', 'moderate', 'minor'
    description: str
    help_url: str
    affected_nodes: list = field(default_factory=list)
    wcag_tags: list = field(default_factory=list)

    @property
    def is_critical(self) -> bool:
        return self.impact in ('critical', 'serious')


@dataclass
class A11yAuditResult:
    """Resultado de una auditoría de accesibilidad."""
    url: str
    timestamp: str
    violations: list[A11yViolation]
    incomplete: list
    passes_count: int

    @property
    def critical_count(self) -> int:
        return sum(1 for v in self.violations if v.is_critical)

    @property
    def total_violations(self) -> int:
        return len(self.violations)

    @property
    def is_passing(self) -> bool:
        return self.critical_count == 0


class AccessibilityAuditor:
    """
    Auditor de accesibilidad basado en axe-core.

    Uso básico:
        auditor = AccessibilityAuditor(page)
        result = auditor.audit()
        assert result.is_passing, f"{result.critical_count} violaciones críticas"

    Uso avanzado:
        auditor = AccessibilityAuditor(page)
        auditor.disable_rules(["color-contrast", "region"])
        auditor.only_tags(["wcag2a", "wcag2aa"])
        auditor.include_selector("#main-content")
        auditor.exclude_selector(".ads-banner")
        result = auditor.audit()
    """

    AXE_CDN = "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js"

    def __init__(self, page: Page):
        self.page = page
        self._disabled_rules: list[str] = []
        self._only_tags: list[str] | None = None
        self._include: list[str] = []
        self._exclude: list[str] = []
        self._injected = False

    def disable_rules(self, rule_ids: list[str]) -> "AccessibilityAuditor":
        """Deshabilita reglas específicas de axe-core."""
        self._disabled_rules.extend(rule_ids)
        return self  # Permite encadenamiento

    def only_tags(self, tags: list[str]) -> "AccessibilityAuditor":
        """Ejecuta solo las reglas que coincidan con estos tags WCAG."""
        self._only_tags = tags
        return self

    def include_selector(self, selector: str) -> "AccessibilityAuditor":
        """Audita solo el contenido dentro de este selector."""
        self._include.append(selector)
        return self

    def exclude_selector(self, selector: str) -> "AccessibilityAuditor":
        """Excluye este selector de la auditoría."""
        self._exclude.append(selector)
        return self

    def _inject_axe(self):
        """Inyecta axe-core en la página."""
        if not self._injected:
            is_loaded = self.page.evaluate("typeof window.axe !== 'undefined'")
            if not is_loaded:
                self.page.add_script_tag(url=self.AXE_CDN)
                self.page.wait_for_function("typeof window.axe !== 'undefined'")
            self._injected = True

    def _build_config(self) -> dict:
        """Construye la configuración de axe-core."""
        config = {"resultTypes": ["violations", "incomplete", "passes"]}

        # Tags WCAG
        if self._only_tags:
            config["runOnly"] = {"type": "tag", "values": self._only_tags}

        # Reglas deshabilitadas
        if self._disabled_rules:
            config["rules"] = {
                rule_id: {"enabled": False}
                for rule_id in self._disabled_rules
            }

        return config

    def _build_context(self) -> str:
        """Construye el contexto (include/exclude) para axe.run()."""
        if not self._include and not self._exclude:
            return "document"

        parts = []
        if self._include:
            includes = ", ".join(f"'{s}'" for s in self._include)
            parts.append(f"include: [{includes}]")
        if self._exclude:
            excludes = ", ".join(f"'{s}'" for s in self._exclude)
            parts.append(f"exclude: [{excludes}]")

        return "{" + ", ".join(parts) + "}"

    def audit(self) -> A11yAuditResult:
        """Ejecuta la auditoría de accesibilidad y retorna resultados."""
        self._inject_axe()

        config = self._build_config()
        context = self._build_context()

        results = self.page.evaluate(f"""
            async () => {{
                const config = {json.dumps(config)};
                const context = {context};
                const results = await axe.run(context, config);
                return {{
                    violations: results.violations,
                    incomplete: results.incomplete,
                    passes: results.passes.length,
                    url: results.url,
                    timestamp: results.timestamp
                }};
            }}
        """)

        violations = [
            A11yViolation(
                rule_id=v['id'],
                impact=v['impact'],
                description=v['description'],
                help_url=v['helpUrl'],
                affected_nodes=[n['html'] for n in v['nodes']],
                wcag_tags=[t for t in v.get('tags', []) if 'wcag' in t]
            )
            for v in results['violations']
        ]

        return A11yAuditResult(
            url=results['url'],
            timestamp=results['timestamp'],
            violations=violations,
            incomplete=results['incomplete'],
            passes_count=results['passes']
        )

    def reset(self) -> "AccessibilityAuditor":
        """Resetea la configuración del auditor."""
        self._disabled_rules = []
        self._only_tags = None
        self._include = []
        self._exclude = []
        return self</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// helpers/accessibility-auditor.ts
/**
 * AccessibilityAuditor — Clase helper para auditorías de accesibilidad.
 * Encapsula axe-core injection, configuración de reglas y reportes.
 */
import { Page } from '@playwright/test';

interface A11yViolation {
    ruleId: string;
    impact: string; // 'critical' | 'serious' | 'moderate' | 'minor'
    description: string;
    helpUrl: string;
    affectedNodes: string[];
    wcagTags: string[];
    readonly isCritical: boolean;
}

interface A11yAuditResult {
    url: string;
    timestamp: string;
    violations: A11yViolation[];
    incomplete: any[];
    passesCount: number;
    readonly criticalCount: number;
    readonly totalViolations: number;
    readonly isPassing: boolean;
}

function createViolation(data: Partial<A11yViolation>): A11yViolation {
    return {
        ruleId: data.ruleId ?? '',
        impact: data.impact ?? '',
        description: data.description ?? '',
        helpUrl: data.helpUrl ?? '',
        affectedNodes: data.affectedNodes ?? [],
        wcagTags: data.wcagTags ?? [],
        get isCritical() {
            return ['critical', 'serious'].includes(this.impact);
        }
    };
}

function createAuditResult(data: Omit<A11yAuditResult,
    'criticalCount' | 'totalViolations' | 'isPassing'>): A11yAuditResult {
    return {
        ...data,
        get criticalCount() {
            return this.violations.filter(v => v.isCritical).length;
        },
        get totalViolations() {
            return this.violations.length;
        },
        get isPassing() {
            return this.criticalCount === 0;
        }
    };
}

class AccessibilityAuditor {
    /**
     * Auditor de accesibilidad basado en axe-core.
     *
     * Uso básico:
     *   const auditor = new AccessibilityAuditor(page);
     *   const result = await auditor.audit();
     *   expect(result.isPassing).toBeTruthy();
     *
     * Uso avanzado:
     *   const auditor = new AccessibilityAuditor(page);
     *   auditor.disableRules(['color-contrast', 'region']);
     *   auditor.onlyTags(['wcag2a', 'wcag2aa']);
     *   auditor.includeSelector('#main-content');
     *   auditor.excludeSelector('.ads-banner');
     *   const result = await auditor.audit();
     */

    static AXE_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js';

    private page: Page;
    private _disabledRules: string[] = [];
    private _onlyTags: string[] | null = null;
    private _include: string[] = [];
    private _exclude: string[] = [];
    private _injected = false;

    constructor(page: Page) {
        this.page = page;
    }

    disableRules(ruleIds: string[]): AccessibilityAuditor {
        /** Deshabilita reglas específicas de axe-core. */
        this._disabledRules.push(...ruleIds);
        return this; // Permite encadenamiento
    }

    onlyTags(tags: string[]): AccessibilityAuditor {
        /** Ejecuta solo las reglas que coincidan con estos tags WCAG. */
        this._onlyTags = tags;
        return this;
    }

    includeSelector(selector: string): AccessibilityAuditor {
        /** Audita solo el contenido dentro de este selector. */
        this._include.push(selector);
        return this;
    }

    excludeSelector(selector: string): AccessibilityAuditor {
        /** Excluye este selector de la auditoría. */
        this._exclude.push(selector);
        return this;
    }

    private async injectAxe(): Promise<void> {
        /** Inyecta axe-core en la página. */
        if (!this._injected) {
            const isLoaded = await this.page.evaluate(
                () => typeof (window as any).axe !== 'undefined'
            );
            if (!isLoaded) {
                await this.page.addScriptTag({ url: AccessibilityAuditor.AXE_CDN });
                await this.page.waitForFunction(
                    () => typeof (window as any).axe !== 'undefined'
                );
            }
            this._injected = true;
        }
    }

    private buildConfig(): Record<string, any> {
        /** Construye la configuración de axe-core. */
        const config: Record<string, any> = {
            resultTypes: ['violations', 'incomplete', 'passes']
        };

        // Tags WCAG
        if (this._onlyTags) {
            config.runOnly = { type: 'tag', values: this._onlyTags };
        }

        // Reglas deshabilitadas
        if (this._disabledRules.length > 0) {
            config.rules = Object.fromEntries(
                this._disabledRules.map(id => [id, { enabled: false }])
            );
        }

        return config;
    }

    private buildContext(): string {
        /** Construye el contexto (include/exclude) para axe.run(). */
        if (this._include.length === 0 && this._exclude.length === 0) {
            return 'document';
        }

        const parts: string[] = [];
        if (this._include.length > 0) {
            const includes = this._include.map(s => \`'\${s}'\`).join(', ');
            parts.push(\`include: [\${includes}]\`);
        }
        if (this._exclude.length > 0) {
            const excludes = this._exclude.map(s => \`'\${s}'\`).join(', ');
            parts.push(\`exclude: [\${excludes}]\`);
        }

        return '{' + parts.join(', ') + '}';
    }

    async audit(): Promise<A11yAuditResult> {
        /** Ejecuta la auditoría de accesibilidad y retorna resultados. */
        await this.injectAxe();

        const config = this.buildConfig();
        const context = this.buildContext();

        const results = await this.page.evaluate(
            ([cfg, ctx]) => {
                const axeConfig = JSON.parse(cfg);
                const axeContext = ctx === 'document'
                    ? document
                    : JSON.parse(ctx);
                return (window as any).axe.run(axeContext, axeConfig).then((r: any) => ({
                    violations: r.violations,
                    incomplete: r.incomplete,
                    passes: r.passes.length,
                    url: r.url,
                    timestamp: r.timestamp
                }));
            },
            [JSON.stringify(config), context]
        );

        const violations = results.violations.map((v: any) =>
            createViolation({
                ruleId: v.id,
                impact: v.impact,
                description: v.description,
                helpUrl: v.helpUrl,
                affectedNodes: v.nodes.map((n: any) => n.html),
                wcagTags: (v.tags ?? []).filter((t: string) => t.includes('wcag'))
            })
        );

        return createAuditResult({
            url: results.url,
            timestamp: results.timestamp,
            violations,
            incomplete: results.incomplete,
            passesCount: results.passes
        });
    }

    reset(): AccessibilityAuditor {
        /** Resetea la configuración del auditor. */
        this._disabledRules = [];
        this._onlyTags = null;
        this._include = [];
        this._exclude = [];
        return this;
    }
}</code></pre>
        </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA: Auditor como fixture de pytest</h4>
            <p>En SIESA registramos el <code>AccessibilityAuditor</code> como fixture en
            <code>conftest.py</code> para que cualquier test pueda solicitar una auditoría
            con una sola línea:</p>
            <div class="code-tabs" data-code-id="L102-4">
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
                <pre><code class="language-python"># conftest.py
import pytest
from helpers.accessibility_auditor import AccessibilityAuditor

@pytest.fixture
def a11y(page):
    """Fixture de auditor de accesibilidad."""
    return AccessibilityAuditor(page)

# En cualquier test:
def test_mi_pagina(page, a11y):
    page.goto("/mi-pagina")
    result = a11y.audit()
    assert result.is_passing</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// fixtures.ts
import { test as base, expect } from '@playwright/test';
import { AccessibilityAuditor } from './helpers/accessibility-auditor';

// Extender test con fixture de auditor
const test = base.extend<{ a11y: AccessibilityAuditor }>({
    a11y: async ({ page }, use) => {
        /** Fixture de auditor de accesibilidad. */
        await use(new AccessibilityAuditor(page));
    }
});

// En cualquier test:
test('mi página', async ({ page, a11y }) => {
    await page.goto('/mi-pagina');
    const result = await a11y.audit();
    expect(result.isPassing).toBeTruthy();
});</code></pre>
            </div>
            </div>
        </div>

        <h3>⚙️ Configuración de reglas: deshabilitar, filtrar por tags</h3>
        <p>No todas las reglas aplican en todos los contextos. Puedes deshabilitar reglas
        específicas o ejecutar solo las que corresponden a cierto nivel WCAG.</p>

        <div class="code-tabs" data-code-id="L102-5">
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
            <pre><code class="language-python"># test_config_rules.py
"""
Ejemplos de configuración avanzada de reglas axe-core.
"""
from helpers.accessibility_auditor import AccessibilityAuditor


def test_solo_wcag_2_nivel_aa(page, a11y: AccessibilityAuditor):
    """Auditoría limitada a WCAG 2.0/2.1 nivel AA."""
    page.goto("/productos")

    result = (
        a11y
        .only_tags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .audit()
    )

    assert result.is_passing, (
        f"WCAG AA: {result.critical_count} violaciones críticas"
    )


def test_ignorar_reglas_conocidas(page, a11y: AccessibilityAuditor):
    """Deshabilitar reglas que son falsos positivos conocidos."""
    page.goto("/dashboard")

    result = (
        a11y
        .disable_rules([
            "color-contrast",  # Widget de terceros que no controlamos
            "region",          # Layout legacy que se migrará después
        ])
        .audit()
    )

    assert result.is_passing


def test_solo_best_practices(page, a11y: AccessibilityAuditor):
    """Ejecutar solo reglas de mejores prácticas (no WCAG obligatorio)."""
    page.goto("/perfil")

    result = a11y.only_tags(["best-practice"]).audit()

    # Best practices son advertencias, no fallos
    for violation in result.violations:
        print(f"Mejora sugerida: {violation.rule_id} — {violation.description}")


def test_wcag_por_nivel(page, a11y: AccessibilityAuditor):
    """Ejecutar auditorías separadas por nivel WCAG."""
    page.goto("/formulario-contacto")

    # Nivel A — requisitos mínimos (obligatorio)
    result_a = a11y.only_tags(["wcag2a", "wcag21a"]).audit()
    a11y.reset()

    # Nivel AA — requisitos estándar (objetivo habitual)
    result_aa = a11y.only_tags(["wcag2aa", "wcag21aa"]).audit()
    a11y.reset()

    print(f"Nivel A:  {result_a.total_violations} violaciones")
    print(f"Nivel AA: {result_aa.total_violations} violaciones")

    # Nivel A es obligatorio
    assert result_a.is_passing, "Violaciones de nivel A son inaceptables"</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// test_config_rules.ts
/**
 * Ejemplos de configuración avanzada de reglas axe-core.
 */
import { test, expect } from './fixtures'; // fixture con a11y

test('solo WCAG 2 nivel AA', async ({ page, a11y }) => {
    /** Auditoría limitada a WCAG 2.0/2.1 nivel AA. */
    await page.goto('/productos');

    const result = await a11y
        .onlyTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .audit();

    expect(result.isPassing).toBeTruthy();
});

test('ignorar reglas conocidas', async ({ page, a11y }) => {
    /** Deshabilitar reglas que son falsos positivos conocidos. */
    await page.goto('/dashboard');

    const result = await a11y
        .disableRules([
            'color-contrast',  // Widget de terceros que no controlamos
            'region',          // Layout legacy que se migrará después
        ])
        .audit();

    expect(result.isPassing).toBeTruthy();
});

test('solo best practices', async ({ page, a11y }) => {
    /** Ejecutar solo reglas de mejores prácticas (no WCAG obligatorio). */
    await page.goto('/perfil');

    const result = await a11y.onlyTags(['best-practice']).audit();

    // Best practices son advertencias, no fallos
    for (const violation of result.violations) {
        console.log(\`Mejora sugerida: \${violation.ruleId} — \${violation.description}\`);
    }
});

test('WCAG por nivel', async ({ page, a11y }) => {
    /** Ejecutar auditorías separadas por nivel WCAG. */
    await page.goto('/formulario-contacto');

    // Nivel A — requisitos mínimos (obligatorio)
    const resultA = await a11y.onlyTags(['wcag2a', 'wcag21a']).audit();
    a11y.reset();

    // Nivel AA — requisitos estándar (objetivo habitual)
    const resultAA = await a11y.onlyTags(['wcag2aa', 'wcag21aa']).audit();
    a11y.reset();

    console.log(\`Nivel A:  \${resultA.totalViolations} violaciones\`);
    console.log(\`Nivel AA: \${resultAA.totalViolations} violaciones\`);

    // Nivel A es obligatorio
    expect(resultA.isPassing).toBeTruthy();
});</code></pre>
        </div>
        </div>

        <h3>🎯 Auditoría de regiones específicas (include/exclude)</h3>
        <p>A veces solo quieres auditar una sección de la página (por ejemplo, el contenido principal
        excluyendo el header/footer), o excluir widgets de terceros que no controlas.</p>

        <div class="code-tabs" data-code-id="L102-6">
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
            <pre><code class="language-python"># test_region_audit.py
"""
Auditoría de regiones específicas de la página.
"""
from helpers.accessibility_auditor import AccessibilityAuditor


def test_auditar_solo_contenido_principal(page, a11y: AccessibilityAuditor):
    """Auditar solo el contenido principal, ignorando nav y footer."""
    page.goto("/productos")

    result = (
        a11y
        .include_selector("main")           # Solo el <main>
        .exclude_selector(".ads-banner")     # Excluir publicidad
        .exclude_selector(".third-party-widget")  # Excluir widgets externos
        .audit()
    )

    assert result.is_passing, (
        f"Contenido principal: {result.total_violations} violaciones"
    )


def test_auditar_formulario_aislado(page, a11y: AccessibilityAuditor):
    """Auditoría enfocada en un formulario específico."""
    page.goto("/registro")

    result = (
        a11y
        .include_selector("#registration-form")
        .audit()
    )

    # Verificar que todos los campos tienen labels
    label_issues = [
        v for v in result.violations
        if v.rule_id in ("label", "label-title-only")
    ]
    assert len(label_issues) == 0, (
        f"Campos sin label: {[n for v in label_issues for n in v.affected_nodes]}"
    )


def test_auditar_modal(page, a11y: AccessibilityAuditor):
    """Auditoría de un modal/diálogo."""
    page.goto("/productos")
    page.get_by_role("button", name="Agregar al carrito").first.click()

    # Esperar que el modal aparezca
    modal = page.locator("[role='dialog']")
    modal.wait_for(state="visible")

    # Auditar solo el modal
    result = (
        a11y
        .include_selector("[role='dialog']")
        .audit()
    )

    # Verificar que el modal tiene las reglas ARIA correctas
    dialog_issues = [
        v for v in result.violations
        if 'aria' in v.rule_id or 'dialog' in v.rule_id
    ]
    assert len(dialog_issues) == 0, (
        f"Problemas ARIA en modal: {[v.rule_id for v in dialog_issues]}"
    )</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// test_region_audit.ts
/**
 * Auditoría de regiones específicas de la página.
 */
import { test, expect } from './fixtures'; // fixture con a11y

test('auditar solo contenido principal', async ({ page, a11y }) => {
    /** Auditar solo el contenido principal, ignorando nav y footer. */
    await page.goto('/productos');

    const result = await a11y
        .includeSelector('main')               // Solo el <main>
        .excludeSelector('.ads-banner')         // Excluir publicidad
        .excludeSelector('.third-party-widget') // Excluir widgets externos
        .audit();

    expect(result.isPassing).toBeTruthy();
});

test('auditar formulario aislado', async ({ page, a11y }) => {
    /** Auditoría enfocada en un formulario específico. */
    await page.goto('/registro');

    const result = await a11y
        .includeSelector('#registration-form')
        .audit();

    // Verificar que todos los campos tienen labels
    const labelIssues = result.violations.filter(
        v => ['label', 'label-title-only'].includes(v.ruleId)
    );
    expect(labelIssues).toHaveLength(0);
});

test('auditar modal', async ({ page, a11y }) => {
    /** Auditoría de un modal/diálogo. */
    await page.goto('/productos');
    await page.getByRole('button', { name: 'Agregar al carrito' }).first().click();

    // Esperar que el modal aparezca
    const modal = page.locator("[role='dialog']");
    await modal.waitFor({ state: 'visible' });

    // Auditar solo el modal
    const result = await a11y
        .includeSelector("[role='dialog']")
        .audit();

    // Verificar que el modal tiene las reglas ARIA correctas
    const dialogIssues = result.violations.filter(
        v => v.ruleId.includes('aria') || v.ruleId.includes('dialog')
    );
    expect(dialogIssues).toHaveLength(0);
});</code></pre>
        </div>
        </div>

        <h3>⌨️ Testing de navegación por teclado</h3>
        <p>La navegación por teclado es esencial para usuarios que no pueden usar ratón.
        Con Playwright podemos simular <strong>Tab, Shift+Tab, Enter y Escape</strong>
        y verificar que todos los elementos interactivos son alcanzables y funcionales.</p>

        <div class="code-tabs" data-code-id="L102-7">
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
            <pre><code class="language-python"># test_keyboard_navigation.py
"""
Verificación de navegación por teclado con Playwright.
Tab, Shift+Tab, Enter, Escape — flujos completos.
"""
from playwright.sync_api import Page, expect


def test_tab_order_navigation(page: Page):
    """Verificar que Tab recorre los elementos en orden lógico."""
    page.goto("/login")

    # Orden esperado de foco al presionar Tab
    expected_order = [
        ("input", "Email"),          # Campo email
        ("input", "Contraseña"),     # Campo contraseña
        ("link", "Olvidé mi"),       # Link olvidé contraseña
        ("button", "Iniciar sesión"),  # Botón submit
        ("link", "Registrarse"),     # Link registro
    ]

    for i, (role, name_fragment) in enumerate(expected_order):
        page.keyboard.press("Tab")
        focused = page.evaluate("""
            () => {
                const el = document.activeElement;
                return {
                    tag: el.tagName.toLowerCase(),
                    role: el.getAttribute('role') || el.tagName.toLowerCase(),
                    text: el.textContent?.trim().substring(0, 50) || '',
                    name: el.getAttribute('aria-label') ||
                          el.getAttribute('name') ||
                          el.getAttribute('placeholder') || ''
                };
            }
        """)
        print(f"Tab {i+1}: [{focused['tag']}] {focused['text'] or focused['name']}")

        # Verificar que el elemento correcto tiene foco
        assert name_fragment.lower() in (
            focused['text'].lower() + focused['name'].lower()
        ), f"Tab {i+1}: esperaba '{name_fragment}', tiene foco '{focused}'"


def test_shift_tab_reverse_navigation(page: Page):
    """Verificar que Shift+Tab navega en orden inverso."""
    page.goto("/login")

    # Mover foco al último elemento interactivo
    page.get_by_role("link", name="Registrarse").focus()

    # Navegar hacia atrás
    page.keyboard.press("Shift+Tab")
    focused_button = page.locator(":focus")
    expect(focused_button).to_have_role("button")

    page.keyboard.press("Shift+Tab")
    focused_link = page.locator(":focus")
    expect(focused_link).to_have_role("link")


def test_enter_activa_botones(page: Page):
    """Verificar que Enter activa botones y enlaces."""
    page.goto("/login")
    page.get_by_label("Email").fill("test@example.com")
    page.get_by_label("Contraseña").fill("password123")

    # Navegar al botón con Tab y activar con Enter
    page.get_by_role("button", name="Iniciar sesión").focus()
    page.keyboard.press("Enter")

    # Verificar que el formulario se envió
    page.wait_for_url("**/dashboard**", timeout=5000)


def test_escape_cierra_modales(page: Page):
    """Verificar que Escape cierra modales y popups."""
    page.goto("/productos")

    # Abrir un modal
    page.get_by_role("button", name="Filtros avanzados").click()
    modal = page.locator("[role='dialog']")
    expect(modal).to_be_visible()

    # Presionar Escape debe cerrar el modal
    page.keyboard.press("Escape")
    expect(modal).to_be_hidden()


def test_skip_to_content_link(page: Page):
    """Verificar que existe un enlace 'Saltar al contenido principal'."""
    page.goto("/")

    # El enlace skip suele estar oculto hasta que recibe foco
    page.keyboard.press("Tab")

    skip_link = page.locator(":focus")
    skip_text = skip_link.text_content()
    assert "saltar" in skip_text.lower() or "skip" in skip_text.lower(), (
        f"Primer Tab debe enfocar 'Saltar al contenido', encontrado: '{skip_text}'"
    )

    # Activar el skip link
    page.keyboard.press("Enter")

    # El foco debe moverse al contenido principal
    focused_after = page.evaluate("""
        () => document.activeElement.id || document.activeElement.tagName
    """)
    assert focused_after in ("main-content", "content", "MAIN"), (
        f"Después de skip link, foco en: {focused_after}"
    )</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// test_keyboard_navigation.ts
/**
 * Verificación de navegación por teclado con Playwright.
 * Tab, Shift+Tab, Enter, Escape — flujos completos.
 */
import { test, expect } from '@playwright/test';

test('tab order navigation', async ({ page }) => {
    /** Verificar que Tab recorre los elementos en orden lógico. */
    await page.goto('/login');

    // Orden esperado de foco al presionar Tab
    const expectedOrder = [
        ['input', 'Email'],            // Campo email
        ['input', 'Contraseña'],       // Campo contraseña
        ['link', 'Olvidé mi'],         // Link olvidé contraseña
        ['button', 'Iniciar sesión'],  // Botón submit
        ['link', 'Registrarse'],       // Link registro
    ];

    for (let i = 0; i < expectedOrder.length; i++) {
        const [role, nameFragment] = expectedOrder[i];
        await page.keyboard.press('Tab');
        const focused = await page.evaluate(() => {
            const el = document.activeElement!;
            return {
                tag: el.tagName.toLowerCase(),
                role: el.getAttribute('role') || el.tagName.toLowerCase(),
                text: el.textContent?.trim().substring(0, 50) || '',
                name: el.getAttribute('aria-label') ||
                      el.getAttribute('name') ||
                      el.getAttribute('placeholder') || ''
            };
        });
        console.log(\`Tab \${i + 1}: [\${focused.tag}] \${focused.text || focused.name}\`);

        // Verificar que el elemento correcto tiene foco
        const combined = (focused.text + focused.name).toLowerCase();
        expect(combined).toContain(nameFragment.toLowerCase());
    }
});

test('shift+tab reverse navigation', async ({ page }) => {
    /** Verificar que Shift+Tab navega en orden inverso. */
    await page.goto('/login');

    // Mover foco al último elemento interactivo
    await page.getByRole('link', { name: 'Registrarse' }).focus();

    // Navegar hacia atrás
    await page.keyboard.press('Shift+Tab');
    const focusedButton = page.locator(':focus');
    await expect(focusedButton).toHaveRole('button');

    await page.keyboard.press('Shift+Tab');
    const focusedLink = page.locator(':focus');
    await expect(focusedLink).toHaveRole('link');
});

test('enter activa botones', async ({ page }) => {
    /** Verificar que Enter activa botones y enlaces. */
    await page.goto('/login');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Contraseña').fill('password123');

    // Navegar al botón con Tab y activar con Enter
    await page.getByRole('button', { name: 'Iniciar sesión' }).focus();
    await page.keyboard.press('Enter');

    // Verificar que el formulario se envió
    await page.waitForURL('**/dashboard**', { timeout: 5000 });
});

test('escape cierra modales', async ({ page }) => {
    /** Verificar que Escape cierra modales y popups. */
    await page.goto('/productos');

    // Abrir un modal
    await page.getByRole('button', { name: 'Filtros avanzados' }).click();
    const modal = page.locator("[role='dialog']");
    await expect(modal).toBeVisible();

    // Presionar Escape debe cerrar el modal
    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();
});

test('skip to content link', async ({ page }) => {
    /** Verificar que existe un enlace 'Saltar al contenido principal'. */
    await page.goto('/');

    // El enlace skip suele estar oculto hasta que recibe foco
    await page.keyboard.press('Tab');

    const skipLink = page.locator(':focus');
    const skipText = await skipLink.textContent() ?? '';
    expect(
        skipText.toLowerCase().includes('saltar') ||
        skipText.toLowerCase().includes('skip')
    ).toBeTruthy();

    // Activar el skip link
    await page.keyboard.press('Enter');

    // El foco debe moverse al contenido principal
    const focusedAfter = await page.evaluate(
        () => document.activeElement?.id || document.activeElement?.tagName || ''
    );
    expect(['main-content', 'content', 'MAIN']).toContain(focusedAfter);
});</code></pre>
        </div>
        </div>

        <h3>🎯 Testing de gestión de foco</h3>
        <p>Los <strong>focus traps</strong> (trampa de foco) mantienen la navegación por teclado
        dentro de un componente (como un modal). El <strong>focus order</strong> garantiza que
        el foco se mueve en un orden lógico. Los <strong>indicadores de foco visibles</strong>
        aseguran que el usuario sabe dónde está el foco.</p>

        <div class="code-tabs" data-code-id="L102-8">
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
            <pre><code class="language-python"># test_focus_management.py
"""
Tests de gestión de foco: focus traps, focus order, indicadores visibles.
"""
from playwright.sync_api import Page, expect


def test_focus_trap_in_modal(page: Page):
    """El foco debe quedar atrapado dentro del modal abierto."""
    page.goto("/productos")

    # Abrir modal
    page.get_by_role("button", name="Agregar al carrito").first.click()
    modal = page.locator("[role='dialog']")
    expect(modal).to_be_visible()

    # Recopilar todos los elementos focusables dentro del modal
    focusable_in_modal = modal.locator(
        "a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])"
    )
    count = focusable_in_modal.count()
    assert count > 0, "El modal debe tener elementos focusables"

    # Navegar con Tab más allá de los elementos del modal
    # El foco NO debe salir del modal
    for _ in range(count + 2):  # +2 para verificar que el foco vuelve al inicio
        page.keyboard.press("Tab")

    # Verificar que el foco sigue dentro del modal
    is_inside_modal = page.evaluate("""
        () => {
            const modal = document.querySelector("[role='dialog']");
            return modal.contains(document.activeElement);
        }
    """)
    assert is_inside_modal, "El foco escapó del modal — falta focus trap"


def test_focus_returns_after_modal_close(page: Page):
    """Al cerrar un modal, el foco debe volver al elemento que lo abrió."""
    page.goto("/productos")

    trigger_button = page.get_by_role("button", name="Agregar al carrito").first
    trigger_button.click()

    modal = page.locator("[role='dialog']")
    expect(modal).to_be_visible()

    # Cerrar modal con Escape
    page.keyboard.press("Escape")
    expect(modal).to_be_hidden()

    # El foco debe volver al botón que abrió el modal
    focused = page.evaluate("""
        () => {
            const el = document.activeElement;
            return el.textContent?.trim() || el.getAttribute('aria-label') || '';
        }
    """)
    assert "agregar" in focused.lower() or "carrito" in focused.lower(), (
        f"Foco debería volver al trigger, pero está en: '{focused}'"
    )


def test_visible_focus_indicators(page: Page):
    """Verificar que los elementos enfocados tienen indicador visual."""
    page.goto("/login")

    interactive_elements = page.locator(
        "a, button, input, select, textarea"
    )
    count = interactive_elements.count()

    elements_without_focus_style = []

    for i in range(min(count, 10)):  # Verificar hasta 10 elementos
        element = interactive_elements.nth(i)

        # Enfocar el elemento
        element.focus()

        # Obtener estilos de foco
        focus_styles = element.evaluate("""
            (el) => {
                const styles = window.getComputedStyle(el);
                return {
                    outline: styles.outline,
                    outlineWidth: styles.outlineWidth,
                    outlineStyle: styles.outlineStyle,
                    boxShadow: styles.boxShadow,
                    border: styles.border,
                    tag: el.tagName,
                    text: el.textContent?.trim().substring(0, 30) || ''
                };
            }
        """)

        # Un elemento enfocado debe tener outline o box-shadow visible
        has_outline = (
            focus_styles['outlineStyle'] != 'none' and
            focus_styles['outlineWidth'] != '0px'
        )
        has_box_shadow = focus_styles['boxShadow'] != 'none'

        if not has_outline and not has_box_shadow:
            elements_without_focus_style.append(
                f"{focus_styles['tag']}: '{focus_styles['text']}'"
            )

    assert len(elements_without_focus_style) == 0, (
        f"Elementos sin indicador de foco visible: {elements_without_focus_style}"
    )</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// test_focus_management.ts
/**
 * Tests de gestión de foco: focus traps, focus order, indicadores visibles.
 */
import { test, expect } from '@playwright/test';

test('focus trap in modal', async ({ page }) => {
    /** El foco debe quedar atrapado dentro del modal abierto. */
    await page.goto('/productos');

    // Abrir modal
    await page.getByRole('button', { name: 'Agregar al carrito' }).first().click();
    const modal = page.locator("[role='dialog']");
    await expect(modal).toBeVisible();

    // Recopilar todos los elementos focusables dentro del modal
    const focusableInModal = modal.locator(
        "a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])"
    );
    const count = await focusableInModal.count();
    expect(count).toBeGreaterThan(0);

    // Navegar con Tab más allá de los elementos del modal
    // El foco NO debe salir del modal
    for (let i = 0; i < count + 2; i++) { // +2 para verificar que el foco vuelve al inicio
        await page.keyboard.press('Tab');
    }

    // Verificar que el foco sigue dentro del modal
    const isInsideModal = await page.evaluate(() => {
        const modal = document.querySelector("[role='dialog']");
        return modal?.contains(document.activeElement) ?? false;
    });
    expect(isInsideModal).toBeTruthy();
});

test('focus returns after modal close', async ({ page }) => {
    /** Al cerrar un modal, el foco debe volver al elemento que lo abrió. */
    await page.goto('/productos');

    const triggerButton = page.getByRole('button', { name: 'Agregar al carrito' }).first();
    await triggerButton.click();

    const modal = page.locator("[role='dialog']");
    await expect(modal).toBeVisible();

    // Cerrar modal con Escape
    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();

    // El foco debe volver al botón que abrió el modal
    const focused = await page.evaluate(() => {
        const el = document.activeElement;
        return el?.textContent?.trim() || el?.getAttribute('aria-label') || '';
    });
    expect(
        focused.toLowerCase().includes('agregar') ||
        focused.toLowerCase().includes('carrito')
    ).toBeTruthy();
});

test('visible focus indicators', async ({ page }) => {
    /** Verificar que los elementos enfocados tienen indicador visual. */
    await page.goto('/login');

    const interactiveElements = page.locator(
        'a, button, input, select, textarea'
    );
    const count = await interactiveElements.count();

    const elementsWithoutFocusStyle: string[] = [];

    for (let i = 0; i < Math.min(count, 10); i++) { // Verificar hasta 10 elementos
        const element = interactiveElements.nth(i);

        // Enfocar el elemento
        await element.focus();

        // Obtener estilos de foco
        const focusStyles = await element.evaluate((el) => {
            const styles = window.getComputedStyle(el);
            return {
                outline: styles.outline,
                outlineWidth: styles.outlineWidth,
                outlineStyle: styles.outlineStyle,
                boxShadow: styles.boxShadow,
                border: styles.border,
                tag: el.tagName,
                text: el.textContent?.trim().substring(0, 30) || ''
            };
        });

        // Un elemento enfocado debe tener outline o box-shadow visible
        const hasOutline = (
            focusStyles.outlineStyle !== 'none' &&
            focusStyles.outlineWidth !== '0px'
        );
        const hasBoxShadow = focusStyles.boxShadow !== 'none';

        if (!hasOutline && !hasBoxShadow) {
            elementsWithoutFocusStyle.push(
                \`\${focusStyles.tag}: '\${focusStyles.text}'\`
            );
        }
    }

    expect(elementsWithoutFocusStyle).toHaveLength(0);
});</code></pre>
        </div>
        </div>

        <h3>🏷️ Verificación de roles y atributos ARIA</h3>
        <p>Los roles y atributos ARIA son fundamentales para que los lectores de pantalla
        interpreten correctamente la interfaz. Podemos verificarlos programáticamente
        con Playwright.</p>

        <pre><code class="python"># test_aria_verification.py
"""
Verificación programática de roles y atributos ARIA.
"""
from playwright.sync_api import Page, expect


def test_landmarks_completos(page: Page):
    """Verificar que la página tiene los landmarks ARIA necesarios."""
    page.goto("/")

    landmarks_requeridos = {
        "banner": "header, [role='banner']",
        "navigation": "nav, [role='navigation']",
        "main": "main, [role='main']",
        "contentinfo": "footer, [role='contentinfo']",
    }

    for landmark_name, selector in landmarks_requeridos.items():
        count = page.locator(selector).count()
        assert count >= 1, (
            f"Falta landmark '{landmark_name}' (selector: {selector})"
        )


def test_headings_jerarquia(page: Page):
    """Verificar que los headings siguen una jerarquía correcta."""
    page.goto("/productos")

    headings = page.evaluate("""
        () => {
            const hs = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            return Array.from(hs).map(h => ({
                level: parseInt(h.tagName[1]),
                text: h.textContent.trim().substring(0, 50)
            }));
        }
    """)

    # Debe haber exactamente un h1
    h1_count = sum(1 for h in headings if h['level'] == 1)
    assert h1_count == 1, f"Debe haber exactamente 1 h1, encontrados: {h1_count}"

    # No debe haber saltos de nivel (por ejemplo, h1 -> h3 sin h2)
    for i in range(1, len(headings)):
        current = headings[i]['level']
        previous = headings[i-1]['level']
        if current > previous:
            assert current - previous <= 1, (
                f"Salto de heading: h{previous} ('{headings[i-1]['text']}') "
                f"-> h{current} ('{headings[i]['text']}')"
            )


def test_images_have_alt_text(page: Page):
    """Verificar que todas las imágenes tienen texto alternativo."""
    page.goto("/productos")

    images_without_alt = page.evaluate("""
        () => {
            const imgs = document.querySelectorAll('img');
            return Array.from(imgs)
                .filter(img => {
                    const alt = img.getAttribute('alt');
                    const role = img.getAttribute('role');
                    // Imágenes decorativas deben tener alt="" o role="presentation"
                    return alt === null && role !== 'presentation';
                })
                .map(img => img.src.substring(0, 80));
        }
    """)

    assert len(images_without_alt) == 0, (
        f"Imágenes sin alt text: {images_without_alt}"
    )


def test_form_labels_associated(page: Page):
    """Verificar que todos los campos de formulario tienen labels asociados."""
    page.goto("/registro")

    unlabeled_inputs = page.evaluate("""
        () => {
            const inputs = document.querySelectorAll(
                'input:not([type="hidden"]):not([type="submit"]):not([type="button"]), ' +
                'select, textarea'
            );
            return Array.from(inputs)
                .filter(input => {
                    // Verificar label explícito (for/id)
                    const id = input.id;
                    const hasExplicitLabel = id &&
                        document.querySelector('label[for="' + id + '"]');
                    // Verificar label implícito (input dentro de label)
                    const hasImplicitLabel = input.closest('label');
                    // Verificar aria-label o aria-labelledby
                    const hasAriaLabel = input.getAttribute('aria-label') ||
                        input.getAttribute('aria-labelledby');
                    // Verificar title como último recurso
                    const hasTitle = input.getAttribute('title');
                    return !hasExplicitLabel && !hasImplicitLabel &&
                           !hasAriaLabel && !hasTitle;
                })
                .map(input => ({
                    type: input.type || input.tagName,
                    name: input.name || input.id || '(sin nombre)'
                }));
        }
    """)

    assert len(unlabeled_inputs) == 0, (
        f"Campos sin label: {unlabeled_inputs}"
    )


def test_aria_roles_correctos_en_modal(page: Page):
    """Verificar atributos ARIA completos en un modal."""
    page.goto("/productos")
    page.get_by_role("button", name="Agregar al carrito").first.click()

    modal = page.locator("[role='dialog']")
    expect(modal).to_be_visible()

    # Debe tener aria-modal="true"
    expect(modal).to_have_attribute("aria-modal", "true")

    # Debe tener aria-label o aria-labelledby
    aria_label = modal.get_attribute("aria-label")
    aria_labelledby = modal.get_attribute("aria-labelledby")
    assert aria_label or aria_labelledby, (
        "El modal debe tener aria-label o aria-labelledby"
    )

    # Si tiene aria-labelledby, el elemento referenciado debe existir
    if aria_labelledby:
        referenced = page.locator(f"#{aria_labelledby}")
        expect(referenced).to_be_visible()</code></pre>

        <h3>🎨 Testing de contraste de color</h3>
        <p>El contraste de color es una de las violaciones de accesibilidad más comunes.
        axe-core detecta problemas de contraste, pero también podemos hacer verificaciones
        puntuales con Playwright.</p>

        <pre><code class="python"># test_color_contrast.py
"""
Verificación de contraste de color.
Combina axe-core y Playwright para detección completa.
"""
import math
from playwright.sync_api import Page
from helpers.accessibility_auditor import AccessibilityAuditor


def luminance(r: int, g: int, b: int) -> float:
    """Calcula la luminancia relativa (WCAG 2.0)."""
    def channel(c):
        c = c / 255
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)


def contrast_ratio(color1: tuple, color2: tuple) -> float:
    """Calcula el ratio de contraste entre dos colores RGB."""
    l1 = luminance(*color1)
    l2 = luminance(*color2)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)


def test_contrast_with_axe(page: Page, a11y: AccessibilityAuditor):
    """Detectar problemas de contraste con axe-core."""
    page.goto("/")

    result = a11y.only_tags(["wcag2aa"]).audit()

    contrast_violations = [
        v for v in result.violations
        if v.rule_id == "color-contrast"
    ]

    if contrast_violations:
        print("\\nProblemas de contraste detectados:")
        for v in contrast_violations:
            for node_html in v.affected_nodes:
                print(f"  - {node_html[:80]}")

    assert len(contrast_violations) == 0, (
        f"{len(contrast_violations)} elementos con contraste insuficiente"
    )


def test_contrast_elementos_criticos(page: Page):
    """Verificar contraste de elementos específicos manualmente."""
    page.goto("/login")

    elements_to_check = [
        ("Botón login", "button[type='submit']", 4.5),  # WCAG AA normal text
        ("Label email", "label[for='email']", 4.5),
        ("Texto error", ".error-message", 4.5),
        ("Texto grande", "h1", 3.0),  # WCAG AA large text: ratio 3:1
    ]

    for name, selector, min_ratio in elements_to_check:
        element = page.locator(selector).first
        if element.count() == 0:
            continue

        colors = element.evaluate("""
            (el) => {
                const style = window.getComputedStyle(el);
                const fg = style.color;
                const bg = style.backgroundColor;
                // Parsear rgb(r, g, b)
                const parse = (c) => c.match(/\\d+/g)?.map(Number) || [0, 0, 0];
                return { fg: parse(fg), bg: parse(bg) };
            }
        """)

        ratio = contrast_ratio(
            tuple(colors['fg']),
            tuple(colors['bg'])
        )
        print(f"{name}: ratio {ratio:.2f} (mínimo: {min_ratio})")

        assert ratio >= min_ratio, (
            f"{name}: contraste {ratio:.2f} < {min_ratio} requerido"
        )</code></pre>

        <h3>📊 Generación de reportes HTML y JSON</h3>
        <p>Los reportes permiten compartir resultados de auditoría con stakeholders que
        no leen código. Generaremos reportes en <strong>JSON</strong> (para CI/CD) y
        <strong>HTML</strong> (para revisión humana).</p>

        <pre><code class="python"># helpers/a11y_reporter.py
"""
Generador de reportes de accesibilidad en HTML y JSON.
"""
import json
from pathlib import Path
from datetime import datetime
from helpers.accessibility_auditor import A11yAuditResult


class A11yReporter:
    """Genera reportes de auditoría de accesibilidad."""

    def __init__(self, output_dir: str = "a11y-reports"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.results: list[A11yAuditResult] = []

    def add_result(self, result: A11yAuditResult):
        """Agrega un resultado de auditoría al reporte."""
        self.results.append(result)

    def generate_json(self, filename: str = "a11y-report.json") -> Path:
        """Genera reporte JSON."""
        report = {
            "generated_at": datetime.now().isoformat(),
            "summary": {
                "pages_audited": len(self.results),
                "total_violations": sum(r.total_violations for r in self.results),
                "critical_violations": sum(r.critical_count for r in self.results),
                "all_passing": all(r.is_passing for r in self.results),
            },
            "pages": [
                {
                    "url": r.url,
                    "violations_count": r.total_violations,
                    "critical_count": r.critical_count,
                    "passes_count": r.passes_count,
                    "violations": [
                        {
                            "rule": v.rule_id,
                            "impact": v.impact,
                            "description": v.description,
                            "help_url": v.help_url,
                            "affected_nodes": v.affected_nodes,
                            "wcag_tags": v.wcag_tags,
                        }
                        for v in r.violations
                    ]
                }
                for r in self.results
            ]
        }

        path = self.output_dir / filename
        path.write_text(json.dumps(report, indent=2, ensure_ascii=False))
        return path

    def generate_html(self, filename: str = "a11y-report.html") -> Path:
        """Genera reporte HTML visual."""
        total_violations = sum(r.total_violations for r in self.results)
        critical = sum(r.critical_count for r in self.results)

        html = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Accesibilidad</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 20px; }}
        .summary {{ background: #f5f5f5; padding: 20px; border-radius: 8px; }}
        .pass {{ color: #2e7d32; }} .fail {{ color: #c62828; }}
        .critical {{ background: #ffcdd2; padding: 8px; border-radius: 4px; }}
        .serious {{ background: #ffe0b2; padding: 8px; border-radius: 4px; }}
        .moderate {{ background: #fff9c4; padding: 8px; border-radius: 4px; }}
        .minor {{ background: #e8f5e9; padding: 8px; border-radius: 4px; }}
        table {{ border-collapse: collapse; width: 100%; margin: 10px 0; }}
        th, td {{ padding: 8px; border: 1px solid #ddd; text-align: left; }}
        th {{ background: #1976d2; color: white; }}
    </style>
</head>
<body>
    <h1>Reporte de Accesibilidad</h1>
    <p>Generado: {datetime.now().strftime("%Y-%m-%d %H:%M")}</p>
    <div class="summary">
        <h2>Resumen</h2>
        <p>Páginas auditadas: <strong>{len(self.results)}</strong></p>
        <p>Total violaciones: <strong class="{'fail' if total_violations else 'pass'}">{total_violations}</strong></p>
        <p>Violaciones críticas/serias: <strong class="{'fail' if critical else 'pass'}">{critical}</strong></p>
    </div>"""

        for result in self.results:
            status = "pass" if result.is_passing else "fail"
            html += f"""
    <h2 class="{status}">{result.url} — {result.total_violations} violaciones</h2>
    <table>
        <tr><th>Regla</th><th>Impacto</th><th>Descripción</th><th>Elementos</th></tr>"""
            for v in result.violations:
                nodes_html = "<br>".join(
                    n[:60].replace("<", "&lt;") for n in v.affected_nodes[:3]
                )
                html += f"""
        <tr class="{v.impact}">
            <td><a href="{v.help_url}">{v.rule_id}</a></td>
            <td>{v.impact}</td>
            <td>{v.description}</td>
            <td>{nodes_html}</td>
        </tr>"""
            html += "\\n    </table>"

        html += "\\n</body>\\n</html>"

        path = self.output_dir / filename
        path.write_text(html)
        return path</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA: Reportes en pipeline CI/CD</h4>
            <p>En SIESA generamos ambos formatos: el <strong>JSON</strong> se consume programáticamente
            para decidir si el pipeline continúa (zero critical violations = green), y el
            <strong>HTML</strong> se adjunta como artefacto del build para que desarrolladores
            y product owners revisen los hallazgos visualmente sin necesidad de ejecutar los tests.</p>
        </div>

        <h3>📈 Tracking de violaciones con baseline comparison</h3>
        <p>Para rastrear la evolución de la accesibilidad, comparamos los resultados actuales
        contra una <strong>baseline</strong> (foto del estado conocido). Esto permite detectar
        regresiones y celebrar mejoras.</p>

        <pre><code class="python"># helpers/a11y_baseline.py
"""
Baseline comparison para rastrear evolución de accesibilidad.
Compara resultados actuales contra un snapshot previo.
"""
import json
from pathlib import Path
from datetime import datetime
from dataclasses import dataclass
from helpers.accessibility_auditor import A11yAuditResult


@dataclass
class BaselineComparison:
    """Resultado de comparar auditoría actual vs baseline."""
    new_violations: list      # Violaciones que no estaban en baseline
    fixed_violations: list    # Violaciones que ya no existen
    unchanged_violations: list  # Violaciones que persisten
    is_regression: bool       # True si hay nuevas violaciones

    @property
    def summary(self) -> str:
        lines = [
            f"Nuevas violaciones: {len(self.new_violations)}",
            f"Violaciones corregidas: {len(self.fixed_violations)}",
            f"Violaciones sin cambios: {len(self.unchanged_violations)}",
            f"Estado: {'REGRESIÓN' if self.is_regression else 'OK'}"
        ]
        return "\\n".join(lines)


class A11yBaseline:
    """Maneja baselines de accesibilidad para comparación."""

    def __init__(self, baseline_dir: str = "a11y-baselines"):
        self.baseline_dir = Path(baseline_dir)
        self.baseline_dir.mkdir(parents=True, exist_ok=True)

    def _baseline_path(self, page_id: str) -> Path:
        """Path del archivo baseline para una página."""
        safe_id = page_id.replace("/", "_").replace(":", "_")
        return self.baseline_dir / f"{safe_id}.json"

    def save_baseline(self, page_id: str, result: A11yAuditResult):
        """Guarda el resultado actual como nueva baseline."""
        data = {
            "saved_at": datetime.now().isoformat(),
            "url": result.url,
            "violations": [
                {
                    "rule_id": v.rule_id,
                    "impact": v.impact,
                    "description": v.description,
                    "node_count": len(v.affected_nodes)
                }
                for v in result.violations
            ]
        }
        path = self._baseline_path(page_id)
        path.write_text(json.dumps(data, indent=2, ensure_ascii=False))

    def load_baseline(self, page_id: str) -> list[dict] | None:
        """Carga la baseline existente."""
        path = self._baseline_path(page_id)
        if not path.exists():
            return None
        data = json.loads(path.read_text())
        return data.get("violations", [])

    def compare(self, page_id: str, current: A11yAuditResult) -> BaselineComparison:
        """Compara resultados actuales contra la baseline."""
        baseline_violations = self.load_baseline(page_id)

        if baseline_violations is None:
            # No hay baseline — guardar la actual y retornar
            self.save_baseline(page_id, current)
            return BaselineComparison(
                new_violations=[],
                fixed_violations=[],
                unchanged_violations=[v.rule_id for v in current.violations],
                is_regression=False
            )

        baseline_rules = {v['rule_id'] for v in baseline_violations}
        current_rules = {v.rule_id for v in current.violations}

        new_rules = current_rules - baseline_rules
        fixed_rules = baseline_rules - current_rules
        unchanged_rules = current_rules & baseline_rules

        return BaselineComparison(
            new_violations=list(new_rules),
            fixed_violations=list(fixed_rules),
            unchanged_violations=list(unchanged_rules),
            is_regression=len(new_rules) > 0
        )


# --- Uso en tests ---

def test_no_regression_accesibilidad(page, a11y):
    """Verificar que no hay nuevas violaciones de accesibilidad."""
    page.goto("/productos")

    result = a11y.audit()
    baseline = A11yBaseline()
    comparison = baseline.compare("productos", result)

    print(f"\\n{comparison.summary}")

    if comparison.fixed_violations:
        print(f"Violaciones corregidas: {comparison.fixed_violations}")

    assert not comparison.is_regression, (
        f"Regresión de accesibilidad. Nuevas violaciones: "
        f"{comparison.new_violations}"
    )


def test_update_baseline(page, a11y):
    """Actualizar la baseline después de correcciones."""
    page.goto("/productos")

    result = a11y.audit()
    baseline = A11yBaseline()

    # Solo actualizar si no hay violaciones críticas
    if result.is_passing:
        baseline.save_baseline("productos", result)
        print("Baseline actualizada exitosamente")
    else:
        print(f"No se actualiza baseline: {result.critical_count} violaciones críticas")</code></pre>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔬 Concepto avanzado: Pipeline de accesibilidad completo</h4>
            <p>El flujo completo de auditoría automatizada en un pipeline CI/CD combina
            todas las técnicas de esta lección:</p>
            <ol>
                <li><strong>Auditoría axe-core</strong> en todas las páginas del sitemap</li>
                <li><strong>Comparación contra baseline</strong> para detectar regresiones</li>
                <li><strong>Tests de teclado</strong> para flujos críticos (login, checkout, formularios)</li>
                <li><strong>Verificación ARIA</strong> en componentes interactivos (modales, menús, tabs)</li>
                <li><strong>Contraste de color</strong> en elementos de texto principales</li>
                <li><strong>Generación de reportes</strong> HTML para revisión humana + JSON para CI</li>
                <li><strong>Decisión del pipeline:</strong> fallo si hay nuevas violaciones críticas</li>
            </ol>
            <pre><code class="python"># conftest.py — Pipeline completo
import pytest
from helpers.accessibility_auditor import AccessibilityAuditor
from helpers.a11y_reporter import A11yReporter
from helpers.a11y_baseline import A11yBaseline

reporter = A11yReporter("a11y-reports")
baseline = A11yBaseline("a11y-baselines")

@pytest.fixture(scope="session", autouse=True)
def generate_reports():
    yield
    reporter.generate_json()
    reporter.generate_html()
    print("Reportes de accesibilidad generados en a11y-reports/")

@pytest.fixture
def a11y(page):
    auditor = AccessibilityAuditor(page)
    yield auditor
    # Auto-registrar resultado en el reporter
    # (se puede mejorar con hooks de pytest)</code></pre>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 15px 0;">
            <h4>🏋️ Implementa una suite completa de auditoría de accesibilidad</h4>
            <p>Construye un sistema de auditoría automatizada que combine todas las técnicas
            aprendidas en esta lección.</p>

            <ol>
                <li><strong>Crea la estructura del proyecto:</strong>
                    <pre><code class="bash">mkdir -p a11y_audit_suite/helpers
mkdir -p a11y_audit_suite/tests
mkdir -p a11y_audit_suite/a11y-reports
mkdir -p a11y_audit_suite/a11y-baselines

touch a11y_audit_suite/helpers/__init__.py
touch a11y_audit_suite/helpers/accessibility_auditor.py
touch a11y_audit_suite/helpers/a11y_reporter.py
touch a11y_audit_suite/helpers/a11y_baseline.py

touch a11y_audit_suite/tests/__init__.py
touch a11y_audit_suite/tests/conftest.py
touch a11y_audit_suite/tests/test_axe_audit.py
touch a11y_audit_suite/tests/test_keyboard_nav.py
touch a11y_audit_suite/tests/test_aria_roles.py
touch a11y_audit_suite/tests/test_contrast.py
touch a11y_audit_suite/pytest.ini</code></pre>
                </li>
                <li><strong>Implementa <code>AccessibilityAuditor</code></strong> con soporte para:
                    <ul>
                        <li>Inyección automática de axe-core</li>
                        <li>Configuración de reglas (disable, only_tags)</li>
                        <li>Contexto de auditoría (include/exclude selectors)</li>
                        <li>Método <code>audit()</code> que retorna <code>A11yAuditResult</code></li>
                    </ul>
                </li>
                <li><strong>Escribe tests de navegación por teclado</strong> para:
                    <ul>
                        <li>Tab order en formulario de login</li>
                        <li>Shift+Tab navegación inversa</li>
                        <li>Enter activa botones</li>
                        <li>Escape cierra modales</li>
                        <li>Skip-to-content link funcional</li>
                    </ul>
                </li>
                <li><strong>Escribe tests de gestión de foco:</strong>
                    <ul>
                        <li>Focus trap en modal</li>
                        <li>Foco regresa al trigger al cerrar modal</li>
                        <li>Indicadores de foco visibles en todos los elementos interactivos</li>
                    </ul>
                </li>
                <li><strong>Implementa verificación ARIA:</strong>
                    <ul>
                        <li>Landmarks completos (banner, nav, main, contentinfo)</li>
                        <li>Jerarquía de headings correcta (sin saltos)</li>
                        <li>Imágenes con alt text</li>
                        <li>Campos de formulario con labels</li>
                    </ul>
                </li>
                <li><strong>Implementa el reporter</strong> que genere JSON y HTML</li>
                <li><strong>Implementa baseline comparison</strong> con detección de regresiones</li>
                <li><strong>Ejecuta la suite completa:</strong>
                    <pre><code class="bash"># Ejecutar toda la suite de auditoría
pytest tests/ -v --tb=short

# Ejecutar solo axe-core
pytest tests/test_axe_audit.py -v

# Ejecutar solo tests de teclado
pytest tests/test_keyboard_nav.py -v

# Actualizar baselines (después de corregir issues)
pytest tests/test_axe_audit.py -v -k "update_baseline"</code></pre>
                </li>
            </ol>

            <div style="background: #ffe0b2; padding: 10px; border-radius: 5px; margin-top: 10px;">
                <strong>Criterios de evaluación:</strong>
                <ul>
                    <li><code>AccessibilityAuditor</code> soporta configuración de reglas, include/exclude y reset</li>
                    <li>Tests de teclado cubren Tab, Shift+Tab, Enter, Escape y skip link</li>
                    <li>Tests de foco verifican focus trap, retorno de foco y visibilidad del indicador</li>
                    <li>Verificación ARIA cubre landmarks, headings, alt text y labels</li>
                    <li>Se genera reporte JSON con summary y detalle por página</li>
                    <li>Se genera reporte HTML legible para stakeholders</li>
                    <li>Baseline comparison detecta regresiones y registra correcciones</li>
                    <li>La suite se integra con <code>conftest.py</code> usando fixtures</li>
                </ul>
            </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA: Estrategia de accesibilidad gradual</h4>
            <p>En SIESA implementamos la accesibilidad de forma gradual:</p>
            <ol>
                <li><strong>Semana 1:</strong> Ejecutar auditoría completa, documentar todas las violaciones como baseline</li>
                <li><strong>Sprint a sprint:</strong> Corregir las violaciones <em>critical</em> y <em>serious</em> primero</li>
                <li><strong>Cada release:</strong> Verificar que no hay regresiones (baseline comparison)</li>
                <li><strong>Meta trimestral:</strong> Zero violaciones de nivel A y AA</li>
            </ol>
            <p>Este enfoque es práctico porque no requiere detener el desarrollo para "arreglar todo",
            sino que integra la mejora de accesibilidad en el flujo normal de trabajo.</p>
        </div>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Automatizar auditorías de accesibilidad completas con axe-core</li>
                <li>Auditar múltiples páginas de forma sistemática (sitemap crawling)</li>
                <li>Crear una clase <code>AccessibilityAuditor</code> reutilizable con API fluida</li>
                <li>Configurar reglas: deshabilitar, filtrar por tags WCAG, auditar regiones</li>
                <li>Probar navegación por teclado: Tab, Shift+Tab, Enter, Escape</li>
                <li>Verificar gestión de foco: focus trap, retorno de foco, indicadores visibles</li>
                <li>Verificar roles ARIA, landmarks, headings, alt text y labels</li>
                <li>Evaluar contraste de color programáticamente</li>
                <li>Generar reportes HTML y JSON para stakeholders y CI/CD</li>
                <li>Rastrear violaciones con baseline comparison para detectar regresiones</li>
            </ul>
        </div>
    `,
    topics: ["auditorías", "accesibilidad", "automatización"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_102 = LESSON_102;
}
