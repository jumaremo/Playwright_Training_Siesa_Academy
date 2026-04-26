/**
 * Playwright Academy - Lección 101
 * Accessibility testing con axe-core
 * Sección 15: Visual Regression y Accessibility Testing
 */

const LESSON_101 = {
    id: 101,
    title: "Accessibility testing con axe-core",
    duration: "7 min",
    level: "advanced",
    section: "section-15",
    content: `
        <h2>♿ Accessibility testing con axe-core</h2>
        <p>El <strong>accessibility testing</strong> (a11y testing) verifica que las aplicaciones web sean
        utilizables por <strong>todas las personas</strong>, incluyendo aquellas con discapacidades visuales,
        auditivas, motoras o cognitivas. Con <strong>axe-core</strong> integrado en Playwright, puedes
        automatizar la detección de barreras de accesibilidad en cada ejecución de tu suite de tests.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎯 Objetivo de la lección</h4>
            <p>Integrar <strong>axe-core</strong> con Playwright y Python para ejecutar auditorías de
            accesibilidad automatizadas, interpretar los resultados (violations, passes, incomplete),
            filtrar por nivel de impacto y etiquetas WCAG, y generar reportes accionables para el equipo
            de desarrollo.</p>
        </div>

        <h3>🌍 ¿Qué es accessibility testing y por qué importa?</h3>
        <p>La accesibilidad web (a11y — "a", 11 letras, "y") garantiza que el contenido digital sea
        percibible, operable, comprensible y robusto para todos los usuarios. Existen tres razones
        fundamentales para incorporarla en tu estrategia de testing:</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #1565c0; color: white;">
                        <th style="padding: 10px; text-align: left;">Dimensión</th>
                        <th style="padding: 10px; text-align: left;">Por qué importa</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #f5f5f5;">
                        <td style="padding: 8px;"><strong>Legal</strong></td>
                        <td style="padding: 8px;">Legislaciones como ADA (EE.UU.), European Accessibility Act (UE) y la Ley 1618 de 2013 (Colombia) exigen accesibilidad digital. El incumplimiento puede generar demandas y sanciones.</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>Negocio</strong></td>
                        <td style="padding: 8px;">El 15-20% de la población mundial tiene algún tipo de discapacidad. Una app inaccesible excluye potenciales clientes y usuarios. Además, la accesibilidad mejora el SEO y la usabilidad general.</td>
                    </tr>
                    <tr style="background: #f5f5f5;">
                        <td style="padding: 8px;"><strong>Ética</strong></td>
                        <td style="padding: 8px;">Toda persona tiene derecho a acceder a la información y los servicios digitales. Construir software accesible es una responsabilidad profesional.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>En el contexto de un ERP como los productos de SIESA, la accesibilidad es especialmente
            relevante: los módulos de nómina, contabilidad y recursos humanos son herramientas de trabajo
            diario. Si un usuario con baja visión no puede navegar los formularios o interpretar las tablas,
            pierde productividad. Integrar a11y testing en el pipeline detecta estos problemas antes de
            que lleguen a producción.</p>
        </div>

        <h3>📏 WCAG 2.1: Niveles de conformidad</h3>
        <p>Las <strong>Web Content Accessibility Guidelines (WCAG)</strong> son el estándar internacional
        de accesibilidad web. Definen tres niveles de conformidad progresivos:</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #1565c0; color: white;">
                        <th style="padding: 10px; text-align: left;">Nivel</th>
                        <th style="padding: 10px; text-align: left;">Descripción</th>
                        <th style="padding: 10px; text-align: left;">Ejemplo de criterio</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #f5f5f5;">
                        <td style="padding: 8px;"><strong>A</strong> (mínimo)</td>
                        <td style="padding: 8px;">Requisitos básicos. Sin estos, algunas personas no pueden usar el sitio en absoluto.</td>
                        <td style="padding: 8px;">Todas las imágenes tienen texto alternativo (<code>alt</code>)</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>AA</strong> (recomendado)</td>
                        <td style="padding: 8px;">Nivel objetivo para la mayoría de organizaciones. Cubre la mayoría de barreras comunes.</td>
                        <td style="padding: 8px;">Contraste de color mínimo 4.5:1 para texto normal</td>
                    </tr>
                    <tr style="background: #f5f5f5;">
                        <td style="padding: 8px;"><strong>AAA</strong> (óptimo)</td>
                        <td style="padding: 8px;">Nivel más alto. Difícil de alcanzar para todo el contenido, pero ideal como meta parcial.</td>
                        <td style="padding: 8px;">Contraste de color mínimo 7:1 para texto normal</td>
                    </tr>
                </tbody>
            </table>
            <p style="margin-top: 10px;"><strong>Recomendación:</strong> Apuntar a <strong>WCAG 2.1 nivel AA</strong>.
            Es el estándar más adoptado por legislaciones y organizaciones a nivel mundial.</p>
        </div>

        <h3>🔧 axe-core: El motor estándar de la industria</h3>
        <p><strong>axe-core</strong> es un motor de análisis de accesibilidad creado por Deque Systems.
        Es de código abierto, soporta más de 90 reglas basadas en WCAG, y es utilizado por herramientas
        como Google Lighthouse, Microsoft Accessibility Insights y los DevTools de Chrome.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ventajas de axe-core:</strong></p>
            <ul>
                <li><strong>Cero falsos positivos</strong> (diseñado para minimizarlos al máximo)</li>
                <li><strong>+90 reglas</strong> que cubren WCAG 2.0, 2.1, 2.2 y mejores prácticas</li>
                <li><strong>Resultados accionables</strong> con descripción del problema, elementos afectados y cómo corregirlos</li>
                <li><strong>Extensible</strong> — puedes agregar reglas personalizadas</li>
                <li><strong>Integración nativa</strong> con Playwright a través de paquetes de Python</li>
            </ul>
        </div>

        <h3>📦 Instalación</h3>
        <p>Existen varias opciones para integrar axe-core con Playwright en Python. La más directa
        es usar el paquete <code>axe-playwright-python</code>:</p>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Instalación del paquete</h4>
            <pre><code class="bash"># Instalar axe-playwright-python
pip install axe-playwright-python

# Verificar la instalación
pip show axe-playwright-python

# También necesitas Playwright instalado
pip install playwright
playwright install</code></pre>
        </div>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔬 Alternativa: Inyección manual de axe-core</h4>
            <p>Si prefieres control total sin dependencias adicionales, puedes inyectar el script
            de axe-core directamente en la página:</p>
            <pre><code class="bash"># Descargar axe-core minificado
pip install requests
python -c "
import requests
url = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js'
r = requests.get(url)
with open('axe.min.js', 'w') as f:
    f.write(r.text)
print('axe.min.js descargado')
"</code></pre>
        </div>

        <h3>🚀 Inyectar axe-core en la página de Playwright</h3>
        <p>El flujo básico es: navegar a la página, inyectar el script de axe-core en el contexto
        del navegador, y luego ejecutar el análisis.</p>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Usando axe-playwright-python</h4>
            <div class="code-tabs" data-code-id="L101-1">
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
from axe_playwright_python.sync_playwright import Axe

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://mi-app.com/login")

    # Crear instancia de Axe e inyectar en la página
    axe = Axe()

    # Ejecutar análisis de accesibilidad
    results = axe.run(page)

    # Los resultados contienen violations, passes, etc.
    print(f"Violaciones encontradas: {len(results.violations)}")
    print(f"Reglas que pasan: {len(results.passes)}")

    browser.close()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://mi-app.com/login');

    // Crear instancia de AxeBuilder y ejecutar análisis
    const results = await new AxeBuilder({ page }).analyze();

    // Los resultados contienen violations, passes, etc.
    console.log(\`Violaciones encontradas: \${results.violations.length}\`);
    console.log(\`Reglas que pasan: \${results.passes.length}\`);

    await browser.close();
})();</code></pre>
            </div>
            </div>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Inyección manual (sin dependencia externa)</h4>
            <div class="code-tabs" data-code-id="L101-2">
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
from pathlib import Path

def inyectar_axe(page):
    """Inyecta axe-core en la página actual."""
    axe_script = Path("axe.min.js").read_text()
    page.evaluate(axe_script)

def ejecutar_axe(page, opciones=None):
    """Ejecuta axe-core y retorna los resultados."""
    if opciones:
        return page.evaluate(f"() => axe.run(document, {opciones})")
    return page.evaluate("() => axe.run()")

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://mi-app.com/login")

    # Inyectar y ejecutar
    inyectar_axe(page)
    results = ejecutar_axe(page)

    print(f"Violaciones: {len(results['violations'])}")
    print(f"Passes: {len(results['passes'])}")
    print(f"Incomplete: {len(results['incomplete'])}")
    print(f"Inapplicable: {len(results['inapplicable'])}")

    browser.close()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { chromium, Page } from 'playwright';
import * as fs from 'fs';

function inyectarAxe(page: Page): Promise<void> {
    /** Inyecta axe-core en la página actual. */
    const axeScript = fs.readFileSync('axe.min.js', 'utf-8');
    return page.evaluate(axeScript);
}

async function ejecutarAxe(page: Page, opciones?: object) {
    /** Ejecuta axe-core y retorna los resultados. */
    if (opciones) {
        return page.evaluate(
            (opts) => (window as any).axe.run(document, opts),
            opciones
        );
    }
    return page.evaluate(() => (window as any).axe.run());
}

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://mi-app.com/login');

    // Inyectar y ejecutar
    await inyectarAxe(page);
    const results = await ejecutarAxe(page);

    console.log(\`Violaciones: \${results.violations.length}\`);
    console.log(\`Passes: \${results.passes.length}\`);
    console.log(\`Incomplete: \${results.incomplete.length}\`);
    console.log(\`Inapplicable: \${results.inapplicable.length}\`);

    await browser.close();
})();</code></pre>
            </div>
            </div>
        </div>

        <h3>📊 Entendiendo los resultados de axe</h3>
        <p>axe-core retorna cuatro categorías de resultados. Entender cada una es clave para
        tomar decisiones correctas:</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #1565c0; color: white;">
                        <th style="padding: 10px; text-align: left;">Categoría</th>
                        <th style="padding: 10px; text-align: left;">Significado</th>
                        <th style="padding: 10px; text-align: left;">Acción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #f5f5f5;">
                        <td style="padding: 8px;"><strong>violations</strong></td>
                        <td style="padding: 8px;">Reglas que fallaron. Hay problemas de accesibilidad confirmados.</td>
                        <td style="padding: 8px;">Corregir. Estos son bugs de accesibilidad.</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>passes</strong></td>
                        <td style="padding: 8px;">Reglas que se cumplieron correctamente.</td>
                        <td style="padding: 8px;">Ninguna. Confirman buenas prácticas.</td>
                    </tr>
                    <tr style="background: #f5f5f5;">
                        <td style="padding: 8px;"><strong>incomplete</strong></td>
                        <td style="padding: 8px;">Reglas que no se pudieron evaluar automáticamente. Requieren revisión manual.</td>
                        <td style="padding: 8px;">Revisar manualmente. axe no pudo determinar si pasa o falla.</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>inapplicable</strong></td>
                        <td style="padding: 8px;">Reglas que no aplican a la página (p.ej., reglas de video en una página sin videos).</td>
                        <td style="padding: 8px;">Ignorar. No son relevantes para esta página.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Explorar resultados en detalle</h4>
            <div class="code-tabs" data-code-id="L101-3">
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
from axe_playwright_python.sync_playwright import Axe

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://mi-app.com/dashboard")

    axe = Axe()
    results = axe.run(page)

    # Resumen general
    print(f"=== Resumen de Accesibilidad ===")
    print(f"Violations:   {len(results.violations)}")
    print(f"Passes:       {len(results.passes)}")
    print(f"Incomplete:   {len(results.incomplete)}")
    print(f"Inapplicable: {len(results.inapplicable)}")
    print()

    # Detalle de cada violación
    for violation in results.violations:
        print(f"--- Violación: {violation['id']} ---")
        print(f"  Descripción: {violation['description']}")
        print(f"  Impacto:     {violation['impact']}")
        print(f"  Help:        {violation['help']}")
        print(f"  Help URL:    {violation['helpUrl']}")
        print(f"  Tags:        {violation['tags']}")
        print(f"  Elementos afectados: {len(violation['nodes'])}")

        for node in violation['nodes']:
            print(f"    - HTML:     {node['html']}")
            print(f"      Target:   {node['target']}")
            print(f"      Mensaje:  {node['failureSummary']}")
        print()

    browser.close()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://mi-app.com/dashboard');

    const results = await new AxeBuilder({ page }).analyze();

    // Resumen general
    console.log('=== Resumen de Accesibilidad ===');
    console.log(\`Violations:   \${results.violations.length}\`);
    console.log(\`Passes:       \${results.passes.length}\`);
    console.log(\`Incomplete:   \${results.incomplete.length}\`);
    console.log(\`Inapplicable: \${results.inapplicable.length}\`);
    console.log();

    // Detalle de cada violación
    for (const violation of results.violations) {
        console.log(\`--- Violación: \${violation.id} ---\`);
        console.log(\`  Descripción: \${violation.description}\`);
        console.log(\`  Impacto:     \${violation.impact}\`);
        console.log(\`  Help:        \${violation.help}\`);
        console.log(\`  Help URL:    \${violation.helpUrl}\`);
        console.log(\`  Tags:        \${violation.tags}\`);
        console.log(\`  Elementos afectados: \${violation.nodes.length}\`);

        for (const node of violation.nodes) {
            console.log(\`    - HTML:     \${node.html}\`);
            console.log(\`      Target:   \${node.target}\`);
            console.log(\`      Mensaje:  \${node.failureSummary}\`);
        }
        console.log();
    }

    await browser.close();
})();</code></pre>
            </div>
            </div>
        </div>

        <h3>⚡ Filtrar por nivel de impacto</h3>
        <p>Cada violación tiene un nivel de <strong>impacto</strong> que indica su severidad.
        Esto permite priorizar las correcciones:</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #1565c0; color: white;">
                        <th style="padding: 10px; text-align: left;">Impacto</th>
                        <th style="padding: 10px; text-align: left;">Severidad</th>
                        <th style="padding: 10px; text-align: left;">Ejemplo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #ffcdd2;">
                        <td style="padding: 8px;"><strong>critical</strong></td>
                        <td style="padding: 8px;">Bloqueante. Usuarios no pueden acceder al contenido.</td>
                        <td style="padding: 8px;">Imagen sin alt, formulario sin labels</td>
                    </tr>
                    <tr style="background: #ffe0b2;">
                        <td style="padding: 8px;"><strong>serious</strong></td>
                        <td style="padding: 8px;">Grave. Dificulta significativamente el uso.</td>
                        <td style="padding: 8px;">Contraste insuficiente, heading saltados</td>
                    </tr>
                    <tr style="background: #fff9c4;">
                        <td style="padding: 8px;"><strong>moderate</strong></td>
                        <td style="padding: 8px;">Moderado. Causa inconvenientes pero no bloquea.</td>
                        <td style="padding: 8px;">Tablas sin headers, links ambiguos</td>
                    </tr>
                    <tr style="background: #e8f5e9;">
                        <td style="padding: 8px;"><strong>minor</strong></td>
                        <td style="padding: 8px;">Menor. Mejora cosmética o de experiencia.</td>
                        <td style="padding: 8px;">tabindex positivo, landmark duplicado</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Filtrar violaciones por impacto</h4>
            <div class="code-tabs" data-code-id="L101-4">
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
from axe_playwright_python.sync_playwright import Axe


def filtrar_por_impacto(violations, niveles):
    """Filtra violaciones por niveles de impacto."""
    return [v for v in violations if v["impact"] in niveles]


with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://mi-app.com/formulario")

    axe = Axe()
    results = axe.run(page)

    # Solo violaciones críticas y serias (bloqueantes)
    bloqueantes = filtrar_por_impacto(
        results.violations,
        ["critical", "serious"]
    )
    print(f"Violaciones bloqueantes: {len(bloqueantes)}")

    for v in bloqueantes:
        print(f"  [{v['impact'].upper()}] {v['id']}: {v['help']}")
        print(f"    Elementos: {len(v['nodes'])}")

    # Solo violaciones moderadas y menores (mejoras)
    mejoras = filtrar_por_impacto(
        results.violations,
        ["moderate", "minor"]
    )
    print(f"\\nMejoras sugeridas: {len(mejoras)}")

    browser.close()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import type { Result } from 'axe-core';

function filtrarPorImpacto(
    violations: Result[],
    niveles: string[]
): Result[] {
    /** Filtra violaciones por niveles de impacto. */
    return violations.filter(v => niveles.includes(v.impact!));
}

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://mi-app.com/formulario');

    const results = await new AxeBuilder({ page }).analyze();

    // Solo violaciones críticas y serias (bloqueantes)
    const bloqueantes = filtrarPorImpacto(
        results.violations,
        ['critical', 'serious']
    );
    console.log(\`Violaciones bloqueantes: \${bloqueantes.length}\`);

    for (const v of bloqueantes) {
        console.log(\`  [\${v.impact!.toUpperCase()}] \${v.id}: \${v.help}\`);
        console.log(\`    Elementos: \${v.nodes.length}\`);
    }

    // Solo violaciones moderadas y menores (mejoras)
    const mejoras = filtrarPorImpacto(
        results.violations,
        ['moderate', 'minor']
    );
    console.log(\`\\nMejoras sugeridas: \${mejoras.length}\`);

    await browser.close();
})();</code></pre>
            </div>
            </div>
        </div>

        <h3>🏷️ Filtrar por etiquetas WCAG</h3>
        <p>Cada regla de axe está etiquetada con los criterios WCAG que cubre. Puedes ejecutar
        el análisis filtrando solo las reglas relevantes para tu nivel objetivo:</p>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Ejecutar axe con filtros WCAG</h4>
            <div class="code-tabs" data-code-id="L101-5">
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
from pathlib import Path
import json


def inyectar_axe(page):
    """Inyecta axe-core en la página."""
    axe_script = Path("axe.min.js").read_text()
    page.evaluate(axe_script)


def ejecutar_con_tags(page, tags):
    """Ejecuta axe filtrando por tags WCAG específicos."""
    opciones = json.dumps({
        "runOnly": {
            "type": "tag",
            "values": tags
        }
    })
    return page.evaluate(
        f"() => axe.run(document, {opciones})"
    )


with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://mi-app.com")

    inyectar_axe(page)

    # Solo reglas WCAG 2.1 AA (el estándar más común)
    results_aa = ejecutar_con_tags(page, [
        "wcag2a",     # WCAG 2.0 nivel A
        "wcag2aa",    # WCAG 2.0 nivel AA
        "wcag21a",    # WCAG 2.1 nivel A
        "wcag21aa"    # WCAG 2.1 nivel AA
    ])
    print(f"WCAG 2.1 AA - Violaciones: {len(results_aa['violations'])}")

    # Solo mejores prácticas (no WCAG obligatorio)
    results_bp = ejecutar_con_tags(page, ["best-practice"])
    print(f"Best practices - Violaciones: {len(results_bp['violations'])}")

    browser.close()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://mi-app.com');

    // Solo reglas WCAG 2.1 AA (el estándar más común)
    const resultsAa = await new AxeBuilder({ page })
        .withTags([
            'wcag2a',    // WCAG 2.0 nivel A
            'wcag2aa',   // WCAG 2.0 nivel AA
            'wcag21a',   // WCAG 2.1 nivel A
            'wcag21aa',  // WCAG 2.1 nivel AA
        ])
        .analyze();
    console.log(
        \`WCAG 2.1 AA - Violaciones: \${resultsAa.violations.length}\`
    );

    // Solo mejores prácticas (no WCAG obligatorio)
    const resultsBp = await new AxeBuilder({ page })
        .withTags(['best-practice'])
        .analyze();
    console.log(
        \`Best practices - Violaciones: \${resultsBp.violations.length}\`
    );

    await browser.close();
})();</code></pre>
            </div>
            </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tags WCAG más usados en axe</h4>
            <ul>
                <li><code>wcag2a</code> — WCAG 2.0 nivel A</li>
                <li><code>wcag2aa</code> — WCAG 2.0 nivel AA</li>
                <li><code>wcag21a</code> — WCAG 2.1 nivel A</li>
                <li><code>wcag21aa</code> — WCAG 2.1 nivel AA</li>
                <li><code>wcag22aa</code> — WCAG 2.2 nivel AA</li>
                <li><code>best-practice</code> — Mejores prácticas (no son WCAG pero mejoran la experiencia)</li>
            </ul>
        </div>

        <h3>🔍 Violaciones comunes y cómo corregirlas</h3>
        <p>Estas son las violaciones que encontrarás con mayor frecuencia en aplicaciones web
        empresariales:</p>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>❌ Violaciones frecuentes</h4>
            <pre><code class="python"># 1. image-alt: Imágenes sin texto alternativo
# Violación: &lt;img src="logo.png"&gt;
# Corrección: &lt;img src="logo.png" alt="Logo de la empresa"&gt;

# 2. color-contrast: Contraste insuficiente
# Violación: texto gris claro (#999) sobre fondo blanco
# Corrección: usar texto más oscuro (#595959) para ratio >= 4.5:1

# 3. label: Inputs sin label asociado
# Violación: &lt;input type="text" id="nombre"&gt;
# Corrección: &lt;label for="nombre"&gt;Nombre&lt;/label&gt;
#             &lt;input type="text" id="nombre"&gt;

# 4. heading-order: Headings desordenados
# Violación: h1 seguido de h3 (se salta h2)
# Corrección: h1 > h2 > h3 (orden jerárquico)

# 5. link-name: Links sin texto descriptivo
# Violación: &lt;a href="/docs"&gt;&lt;i class="icon"&gt;&lt;/i&gt;&lt;/a&gt;
# Corrección: &lt;a href="/docs" aria-label="Documentación"&gt;
#               &lt;i class="icon"&gt;&lt;/i&gt;
#             &lt;/a&gt;

# 6. button-name: Botones sin nombre accesible
# Violación: &lt;button&gt;&lt;i class="fa fa-search"&gt;&lt;/i&gt;&lt;/button&gt;
# Corrección: &lt;button aria-label="Buscar"&gt;
#               &lt;i class="fa fa-search"&gt;&lt;/i&gt;
#             &lt;/button&gt;</code></pre>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Detector automático de violaciones comunes</h4>
            <div class="code-tabs" data-code-id="L101-6">
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
from axe_playwright_python.sync_playwright import Axe


VIOLACIONES_CRITICAS = [
    "image-alt",
    "color-contrast",
    "label",
    "heading-order",
    "link-name",
    "button-name",
    "document-title",
    "html-has-lang",
]


def analizar_pagina(page, url):
    """Analiza una página y reporta violaciones comunes."""
    page.goto(url)
    axe = Axe()
    results = axe.run(page)

    print(f"\\n=== Análisis: {url} ===")

    # Buscar violaciones críticas conocidas
    encontradas = []
    for violation in results.violations:
        if violation["id"] in VIOLACIONES_CRITICAS:
            encontradas.append(violation)

    if not encontradas:
        print("Sin violaciones críticas comunes.")
    else:
        for v in encontradas:
            print(f"  [{v['impact']}] {v['id']}: {v['help']}")
            for node in v["nodes"][:3]:  # Mostrar máximo 3
                print(f"    -> {node['html'][:80]}")

    return results


with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()

    # Analizar múltiples páginas
    urls = [
        "https://mi-app.com/login",
        "https://mi-app.com/dashboard",
        "https://mi-app.com/reportes",
    ]

    for url in urls:
        analizar_pagina(page, url)

    browser.close()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { chromium, Page } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import type { AxeResults } from 'axe-core';

const VIOLACIONES_CRITICAS = [
    'image-alt',
    'color-contrast',
    'label',
    'heading-order',
    'link-name',
    'button-name',
    'document-title',
    'html-has-lang',
];

async function analizarPagina(
    page: Page, url: string
): Promise<AxeResults> {
    /** Analiza una página y reporta violaciones comunes. */
    await page.goto(url);
    const results = await new AxeBuilder({ page }).analyze();

    console.log(\`\\n=== Análisis: \${url} ===\`);

    // Buscar violaciones críticas conocidas
    const encontradas = results.violations.filter(
        v => VIOLACIONES_CRITICAS.includes(v.id)
    );

    if (encontradas.length === 0) {
        console.log('Sin violaciones críticas comunes.');
    } else {
        for (const v of encontradas) {
            console.log(\`  [\${v.impact}] \${v.id}: \${v.help}\`);
            for (const node of v.nodes.slice(0, 3)) { // Mostrar máximo 3
                console.log(\`    -> \${node.html.slice(0, 80)}\`);
            }
        }
    }

    return results;
}

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Analizar múltiples páginas
    const urls = [
        'https://mi-app.com/login',
        'https://mi-app.com/dashboard',
        'https://mi-app.com/reportes',
    ];

    for (const url of urls) {
        await analizarPagina(page, url);
    }

    await browser.close();
})();</code></pre>
            </div>
            </div>
        </div>

        <h3>📄 Generar reportes de accesibilidad</h3>
        <p>Un reporte estructurado permite al equipo de desarrollo priorizar y corregir las
        violaciones de forma organizada.</p>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Generador de reporte JSON y HTML</h4>
            <div class="code-tabs" data-code-id="L101-7">
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
                <pre><code class="language-python">import json
from datetime import datetime
from pathlib import Path
from playwright.sync_api import sync_playwright
from axe_playwright_python.sync_playwright import Axe


def generar_reporte_json(results, url, output_dir="a11y-reports"):
    """Genera un reporte JSON con los resultados de axe."""
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"a11y_report_{timestamp}.json"

    reporte = {
        "url": url,
        "timestamp": datetime.now().isoformat(),
        "resumen": {
            "violations": len(results.violations),
            "passes": len(results.passes),
            "incomplete": len(results.incomplete),
            "inapplicable": len(results.inapplicable),
        },
        "violations_por_impacto": {},
        "violations_detalle": [],
    }

    # Agrupar por impacto
    for v in results.violations:
        impacto = v["impact"]
        if impacto not in reporte["violations_por_impacto"]:
            reporte["violations_por_impacto"][impacto] = 0
        reporte["violations_por_impacto"][impacto] += 1

        reporte["violations_detalle"].append({
            "id": v["id"],
            "impact": v["impact"],
            "description": v["description"],
            "help": v["help"],
            "helpUrl": v["helpUrl"],
            "tags": v["tags"],
            "elementos": len(v["nodes"]),
            "targets": [n["target"] for n in v["nodes"]],
        })

    filepath = Path(output_dir) / filename
    filepath.write_text(
        json.dumps(reporte, indent=2, ensure_ascii=False),
        encoding="utf-8"
    )
    print(f"Reporte guardado: {filepath}")
    return filepath


def generar_reporte_html(results, url, output_dir="a11y-reports"):
    """Genera un reporte HTML visual con los resultados."""
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"a11y_report_{timestamp}.html"

    colores_impacto = {
        "critical": "#d32f2f",
        "serious": "#f57c00",
        "moderate": "#fbc02d",
        "minor": "#388e3c",
    }

    filas = ""
    for v in results.violations:
        color = colores_impacto.get(v["impact"], "#666")
        filas += f"""
        <tr>
            <td><span style="color:{color};font-weight:bold;">
                {v['impact'].upper()}</span></td>
            <td>{v['id']}</td>
            <td>{v['help']}</td>
            <td>{len(v['nodes'])}</td>
            <td><a href="{v['helpUrl']}" target="_blank">Ver</a></td>
        </tr>"""

    html = f"""<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8">
<title>Reporte a11y - {url}</title>
<style>
  body {{ font-family: Arial, sans-serif; margin: 20px; }}
  table {{ border-collapse: collapse; width: 100%; }}
  th, td {{ padding: 10px; border: 1px solid #ddd; text-align: left; }}
  th {{ background: #1565c0; color: white; }}
  tr:nth-child(even) {{ background: #f5f5f5; }}
</style></head>
<body>
<h1>Reporte de Accesibilidad</h1>
<p><strong>URL:</strong> {url}</p>
<p><strong>Fecha:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M')}</p>
<p><strong>Violaciones:</strong> {len(results.violations)} |
   <strong>Passes:</strong> {len(results.passes)} |
   <strong>Incomplete:</strong> {len(results.incomplete)}</p>
<table>
<tr><th>Impacto</th><th>Regla</th><th>Descripción</th>
    <th>Elementos</th><th>Ayuda</th></tr>
{filas}
</table></body></html>"""

    filepath = Path(output_dir) / filename
    filepath.write_text(html, encoding="utf-8")
    print(f"Reporte HTML guardado: {filepath}")
    return filepath</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import * as fs from 'fs';
import * as path from 'path';
import type { AxeResults, Result } from 'axe-core';

function generarReporteJson(
    results: AxeResults,
    url: string,
    outputDir = 'a11y-reports'
): string {
    /** Genera un reporte JSON con los resultados de axe. */
    fs.mkdirSync(outputDir, { recursive: true });

    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '').slice(0, 15);
    const filename = \`a11y_report_\${timestamp}.json\`;

    const violationsPorImpacto: Record<string, number> = {};
    const violationsDetalle: object[] = [];

    for (const v of results.violations) {
        const impacto = v.impact ?? 'unknown';
        violationsPorImpacto[impacto] =
            (violationsPorImpacto[impacto] ?? 0) + 1;

        violationsDetalle.push({
            id: v.id,
            impact: v.impact,
            description: v.description,
            help: v.help,
            helpUrl: v.helpUrl,
            tags: v.tags,
            elementos: v.nodes.length,
            targets: v.nodes.map(n => n.target),
        });
    }

    const reporte = {
        url,
        timestamp: now.toISOString(),
        resumen: {
            violations: results.violations.length,
            passes: results.passes.length,
            incomplete: results.incomplete.length,
            inapplicable: results.inapplicable.length,
        },
        violations_por_impacto: violationsPorImpacto,
        violations_detalle: violationsDetalle,
    };

    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(reporte, null, 2), 'utf-8');
    console.log(\`Reporte guardado: \${filepath}\`);
    return filepath;
}

function generarReporteHtml(
    results: AxeResults,
    url: string,
    outputDir = 'a11y-reports'
): string {
    /** Genera un reporte HTML visual con los resultados. */
    fs.mkdirSync(outputDir, { recursive: true });

    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '').slice(0, 15);
    const filename = \`a11y_report_\${timestamp}.html\`;

    const coloresImpacto: Record<string, string> = {
        critical: '#d32f2f',
        serious: '#f57c00',
        moderate: '#fbc02d',
        minor: '#388e3c',
    };

    const filas = results.violations.map(v => {
        const color = coloresImpacto[v.impact ?? ''] ?? '#666';
        return \`
        <tr>
            <td><span style="color:\${color};font-weight:bold;">
                \${(v.impact ?? '').toUpperCase()}</span></td>
            <td>\${v.id}</td>
            <td>\${v.help}</td>
            <td>\${v.nodes.length}</td>
            <td><a href="\${v.helpUrl}" target="_blank">Ver</a></td>
        </tr>\`;
    }).join('');

    const fecha = now.toISOString().slice(0, 16).replace('T', ' ');
    const html = \`<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8">
<title>Reporte a11y - \${url}</title>
<style>
  body { font-family: Arial, sans-serif; margin: 20px; }
  table { border-collapse: collapse; width: 100%; }
  th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
  th { background: #1565c0; color: white; }
  tr:nth-child(even) { background: #f5f5f5; }
</style></head>
<body>
<h1>Reporte de Accesibilidad</h1>
<p><strong>URL:</strong> \${url}</p>
<p><strong>Fecha:</strong> \${fecha}</p>
<p><strong>Violaciones:</strong> \${results.violations.length} |
   <strong>Passes:</strong> \${results.passes.length} |
   <strong>Incomplete:</strong> \${results.incomplete.length}</p>
<table>
<tr><th>Impacto</th><th>Regla</th><th>Descripción</th>
    <th>Elementos</th><th>Ayuda</th></tr>
\${filas}
</table></body></html>\`;

    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, html, 'utf-8');
    console.log(\`Reporte HTML guardado: \${filepath}\`);
    return filepath;
}</code></pre>
            </div>
            </div>
        </div>

        <h3>🧪 Integración con pytest: Assertions de accesibilidad</h3>
        <p>Lo más poderoso es integrar las verificaciones de accesibilidad directamente en tu
        suite de tests con pytest, de modo que <strong>el pipeline falle</strong> cuando se
        introduzcan nuevas violaciones.</p>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Fixture y helpers para pytest</h4>
            <div class="code-tabs" data-code-id="L101-8">
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
import pytest
from axe_playwright_python.sync_playwright import Axe


@pytest.fixture
def axe():
    """Proporciona una instancia de Axe para tests de a11y."""
    return Axe()


def assert_no_violations(results, impact_levels=None):
    """
    Assert personalizado que falla si hay violaciones
    de accesibilidad del nivel indicado.

    Args:
        results: Resultados de axe.run()
        impact_levels: Lista de niveles a verificar.
                       Default: ["critical", "serious"]
    """
    if impact_levels is None:
        impact_levels = ["critical", "serious"]

    violations = [
        v for v in results.violations
        if v["impact"] in impact_levels
    ]

    if violations:
        mensajes = []
        for v in violations:
            elementos = ", ".join(
                n["target"][0] if n["target"] else "?"
                for n in v["nodes"][:5]
            )
            mensajes.append(
                f"  [{v['impact']}] {v['id']}: {v['help']}\\n"
                f"    Elementos: {elementos}"
            )

        detalle = "\\n".join(mensajes)
        pytest.fail(
            f"Se encontraron {len(violations)} violaciones de "
            f"accesibilidad:\\n{detalle}"
        )</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// tests/a11y-helpers.ts
import AxeBuilder from '@axe-core/playwright';
import { test as base, expect } from '@playwright/test';
import type { AxeResults, Result } from 'axe-core';

// Extender test con fixture de AxeBuilder
export const test = base.extend<{ makeAxeBuilder: () => AxeBuilder }>({
    makeAxeBuilder: async ({ page }, use) => {
        /** Proporciona un factory de AxeBuilder para tests de a11y. */
        await use(() => new AxeBuilder({ page }));
    },
});

export function assertNoViolations(
    results: AxeResults,
    impactLevels: string[] = ['critical', 'serious']
): void {
    /**
     * Assert personalizado que falla si hay violaciones
     * de accesibilidad del nivel indicado.
     */
    const violations = results.violations.filter(
        v => impactLevels.includes(v.impact ?? '')
    );

    if (violations.length > 0) {
        const mensajes = violations.map(v => {
            const elementos = v.nodes
                .slice(0, 5)
                .map(n => n.target?.[0] ?? '?')
                .join(', ');
            return \`  [\${v.impact}] \${v.id}: \${v.help}\\n\` +
                   \`    Elementos: \${elementos}\`;
        });

        const detalle = mensajes.join('\\n');
        throw new Error(
            \`Se encontraron \${violations.length} violaciones de \` +
            \`accesibilidad:\\n\${detalle}\`
        );
    }
}</code></pre>
            </div>
            </div>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Tests de accesibilidad con pytest</h4>
            <div class="code-tabs" data-code-id="L101-9">
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
                <pre><code class="language-python"># tests/test_accesibilidad.py
from conftest import assert_no_violations


class TestAccesibilidadLogin:
    """Tests de accesibilidad para el módulo de login."""

    def test_login_sin_violaciones_criticas(self, page, axe):
        """El login no debe tener violaciones críticas."""
        page.goto("https://mi-app.com/login")
        results = axe.run(page)
        assert_no_violations(results, ["critical", "serious"])

    def test_login_formulario_tiene_labels(self, page, axe):
        """Todos los inputs del login deben tener labels."""
        page.goto("https://mi-app.com/login")
        results = axe.run(page)

        # Buscar específicamente la regla 'label'
        label_violations = [
            v for v in results.violations
            if v["id"] == "label"
        ]
        assert len(label_violations) == 0, (
            f"Inputs sin label encontrados: "
            f"{label_violations[0]['nodes'] if label_violations else []}"
        )

    def test_login_contraste_suficiente(self, page, axe):
        """El login debe cumplir contraste mínimo AA."""
        page.goto("https://mi-app.com/login")
        results = axe.run(page)

        contrast_violations = [
            v for v in results.violations
            if v["id"] == "color-contrast"
        ]
        assert len(contrast_violations) == 0, (
            "Elementos con contraste insuficiente encontrados"
        )


class TestAccesibilidadDashboard:
    """Tests de accesibilidad para el dashboard."""

    def test_dashboard_wcag_aa(self, page, axe):
        """El dashboard debe cumplir WCAG 2.1 AA."""
        page.goto("https://mi-app.com/dashboard")
        results = axe.run(page)
        assert_no_violations(
            results, ["critical", "serious", "moderate"]
        )

    def test_dashboard_headings_ordenados(self, page, axe):
        """Los headings del dashboard deben estar ordenados."""
        page.goto("https://mi-app.com/dashboard")
        results = axe.run(page)

        heading_violations = [
            v for v in results.violations
            if v["id"] == "heading-order"
        ]
        assert len(heading_violations) == 0</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// tests/test-accesibilidad.spec.ts
import { test, assertNoViolations } from './a11y-helpers';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accesibilidad Login', () => {
    /** Tests de accesibilidad para el módulo de login. */

    test('login sin violaciones críticas', async ({ page }) => {
        /** El login no debe tener violaciones críticas. */
        await page.goto('https://mi-app.com/login');
        const results = await new AxeBuilder({ page }).analyze();
        assertNoViolations(results, ['critical', 'serious']);
    });

    test('login formulario tiene labels', async ({ page }) => {
        /** Todos los inputs del login deben tener labels. */
        await page.goto('https://mi-app.com/login');
        const results = await new AxeBuilder({ page }).analyze();

        // Buscar específicamente la regla 'label'
        const labelViolations = results.violations.filter(
            v => v.id === 'label'
        );
        expect(labelViolations).toHaveLength(0);
    });

    test('login contraste suficiente', async ({ page }) => {
        /** El login debe cumplir contraste mínimo AA. */
        await page.goto('https://mi-app.com/login');
        const results = await new AxeBuilder({ page }).analyze();

        const contrastViolations = results.violations.filter(
            v => v.id === 'color-contrast'
        );
        expect(
            contrastViolations,
            'Elementos con contraste insuficiente encontrados'
        ).toHaveLength(0);
    });
});

test.describe('Accesibilidad Dashboard', () => {
    /** Tests de accesibilidad para el dashboard. */

    test('dashboard WCAG AA', async ({ page }) => {
        /** El dashboard debe cumplir WCAG 2.1 AA. */
        await page.goto('https://mi-app.com/dashboard');
        const results = await new AxeBuilder({ page }).analyze();
        assertNoViolations(
            results, ['critical', 'serious', 'moderate']
        );
    });

    test('dashboard headings ordenados', async ({ page }) => {
        /** Los headings del dashboard deben estar ordenados. */
        await page.goto('https://mi-app.com/dashboard');
        const results = await new AxeBuilder({ page }).analyze();

        const headingViolations = results.violations.filter(
            v => v.id === 'heading-order'
        );
        expect(headingViolations).toHaveLength(0);
    });
});</code></pre>
            </div>
            </div>
        </div>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔬 Patrón avanzado: a11y check reutilizable por ruta</h4>
            <div class="code-tabs" data-code-id="L101-10">
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
                <pre><code class="language-python"># tests/test_a11y_suite.py
"""
Suite completa de accesibilidad que verifica todas las rutas
principales de la aplicación de forma parametrizada.
"""
import pytest
from conftest import assert_no_violations


RUTAS_CRITICAS = [
    ("Login", "/login"),
    ("Dashboard", "/dashboard"),
    ("Nómina", "/nomina"),
    ("Reportes", "/reportes"),
    ("Empleados", "/empleados"),
    ("Configuración", "/configuracion"),
]


@pytest.mark.parametrize(
    "nombre,ruta",
    RUTAS_CRITICAS,
    ids=[r[0] for r in RUTAS_CRITICAS]
)
def test_a11y_ruta(page, axe, nombre, ruta):
    """Verifica accesibilidad en cada ruta crítica."""
    base_url = "https://mi-app.com"
    page.goto(f"{base_url}{ruta}")
    page.wait_for_load_state("networkidle")

    results = axe.run(page)

    # Fallar solo por critical y serious
    assert_no_violations(results, ["critical", "serious"])

    # Reportar moderate y minor como warnings
    mejoras = [
        v for v in results.violations
        if v["impact"] in ["moderate", "minor"]
    ]
    if mejoras:
        print(
            f"\\n[WARN] {nombre}: {len(mejoras)} mejoras "
            f"sugeridas (moderate/minor)"
        )</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// tests/test-a11y-suite.spec.ts
/**
 * Suite completa de accesibilidad que verifica todas las rutas
 * principales de la aplicación de forma parametrizada.
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { assertNoViolations } from './a11y-helpers';

const RUTAS_CRITICAS = [
    { nombre: 'Login', ruta: '/login' },
    { nombre: 'Dashboard', ruta: '/dashboard' },
    { nombre: 'Nómina', ruta: '/nomina' },
    { nombre: 'Reportes', ruta: '/reportes' },
    { nombre: 'Empleados', ruta: '/empleados' },
    { nombre: 'Configuración', ruta: '/configuracion' },
];

const BASE_URL = 'https://mi-app.com';

for (const { nombre, ruta } of RUTAS_CRITICAS) {
    test(\`a11y - \${nombre}\`, async ({ page }) => {
        /** Verifica accesibilidad en cada ruta crítica. */
        await page.goto(\`\${BASE_URL}\${ruta}\`);
        await page.waitForLoadState('networkidle');

        const results = await new AxeBuilder({ page }).analyze();

        // Fallar solo por critical y serious
        assertNoViolations(results, ['critical', 'serious']);

        // Reportar moderate y minor como warnings
        const mejoras = results.violations.filter(
            v => ['moderate', 'minor'].includes(v.impact ?? '')
        );
        if (mejoras.length > 0) {
            console.log(
                \`\\n[WARN] \${nombre}: \${mejoras.length} mejoras \` +
                \`sugeridas (moderate/minor)\`
            );
        }
    });
}</code></pre>
            </div>
            </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA: Estrategia de adopción gradual</h4>
            <p>No intentes corregir todas las violaciones de golpe. Una estrategia efectiva para
            equipos que inician con a11y testing:</p>
            <ol>
                <li><strong>Semana 1:</strong> Ejecutar axe en las 5 páginas más usadas. Documentar el estado actual (baseline).</li>
                <li><strong>Semana 2-3:</strong> Corregir violaciones <code>critical</code>. Agregar tests que bloqueen nuevas violaciones críticas.</li>
                <li><strong>Mes 2:</strong> Corregir violaciones <code>serious</code>. Expandir a más páginas.</li>
                <li><strong>Mes 3+:</strong> Abordar <code>moderate</code> y agregar a11y checks en el pipeline de CI/CD.</li>
            </ol>
            <p>El objetivo es <strong>no introducir nuevas violaciones</strong>, no arreglar todo el legacy de golpe.</p>
        </div>

        <h3>📋 Resumen de la lección</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #1565c0; color: white;">
                        <th style="padding: 10px; text-align: left;">Concepto</th>
                        <th style="padding: 10px; text-align: left;">Detalle clave</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #f5f5f5;">
                        <td style="padding: 8px;">axe-core</td>
                        <td style="padding: 8px;">Motor open-source de Deque, +90 reglas, cero falsos positivos</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Instalación</td>
                        <td style="padding: 8px;"><code>pip install axe-playwright-python</code></td>
                    </tr>
                    <tr style="background: #f5f5f5;">
                        <td style="padding: 8px;">Ejecución</td>
                        <td style="padding: 8px;"><code>axe = Axe(); results = axe.run(page)</code></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Resultados</td>
                        <td style="padding: 8px;">violations, passes, incomplete, inapplicable</td>
                    </tr>
                    <tr style="background: #f5f5f5;">
                        <td style="padding: 8px;">Impacto</td>
                        <td style="padding: 8px;">critical > serious > moderate > minor</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Nivel objetivo</td>
                        <td style="padding: 8px;">WCAG 2.1 AA (wcag2a + wcag2aa + wcag21a + wcag21aa)</td>
                    </tr>
                    <tr style="background: #f5f5f5;">
                        <td style="padding: 8px;">En pytest</td>
                        <td style="padding: 8px;">Custom <code>assert_no_violations()</code> que falla el test con detalle</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🏋️ Ejercicio práctico</h4>
            <p>Crea una suite de tests de accesibilidad con axe-core integrado en Playwright:</p>
            <ol>
                <li><strong>Setup:</strong> Instala <code>axe-playwright-python</code> y crea un proyecto
                con <code>conftest.py</code> que incluya el fixture <code>axe</code> y el helper
                <code>assert_no_violations()</code>.</li>
                <li><strong>Análisis inicial:</strong> Escribe un test que navegue a
                <code>https://the-internet.herokuapp.com</code> y ejecute <code>axe.run(page)</code>.
                Imprime el resumen (cuántas violations, passes, incomplete).</li>
                <li><strong>Filtro por impacto:</strong> Modifica el test para que falle <strong>solo</strong>
                si hay violaciones <code>critical</code> o <code>serious</code>. Las <code>moderate</code>
                y <code>minor</code> deben imprimirse como warnings.</li>
                <li><strong>Suite parametrizada:</strong> Crea un test parametrizado que verifique accesibilidad
                en al menos 3 sub-páginas:
                    <ul>
                        <li><code>/login</code></li>
                        <li><code>/dropdown</code></li>
                        <li><code>/checkboxes</code></li>
                    </ul>
                </li>
                <li><strong>Reporte:</strong> Genera un reporte JSON con los resultados agregados de todas
                las páginas analizadas. El reporte debe incluir violaciones agrupadas por impacto.</li>
                <li><strong>Bonus:</strong> Agrega un test que verifique específicamente que todos los
                formularios tienen labels asociados a sus inputs (<code>label</code> rule).</li>
            </ol>
            <pre><code class="bash"># Estructura del proyecto
mkdir -p a11y_proyecto/tests
mkdir -p a11y_proyecto/a11y-reports

# Ejecutar los tests
cd a11y_proyecto
pytest tests/ -v --tb=short

# Resultado esperado:
# tests/test_a11y.py::test_analisis_inicial PASSED
# tests/test_a11y.py::test_filtro_impacto PASSED
# tests/test_a11y.py::test_a11y_ruta[Login] PASSED/FAILED
# tests/test_a11y.py::test_a11y_ruta[Dropdown] PASSED/FAILED
# tests/test_a11y.py::test_a11y_ruta[Checkboxes] PASSED/FAILED
# tests/test_a11y.py::test_reporte_generado PASSED</code></pre>
        </div>
    `,
    topics: ["accessibility", "axe-core", "a11y"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_101 = LESSON_101;
}
