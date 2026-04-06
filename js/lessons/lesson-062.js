/**
 * Playwright Academy - Lección 062
 * Wait strategies: expect vs manual waits
 * Sección 8: Auto-waiting y Actionability
 */

const LESSON_062 = {
    id: 62,
    title: "Wait strategies: expect vs manual waits",
    duration: "7 min",
    level: "intermediate",
    section: "section-08",
    content: `
        <h2>🔄 Wait strategies: expect vs manual waits</h2>
        <p>Aunque el auto-waiting cubre la mayoría de escenarios, hay situaciones donde necesitas
        estrategias de espera adicionales. En esta lección comparamos las diferentes opciones
        y cuándo usar cada una.</p>

        <h3>🏆 Estrategia #1: expect() — La opción preferida</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><code>expect()</code> de Playwright es una assertion que <strong>auto-reintenta</strong>
            hasta que la condición se cumple o expira el timeout (5 segundos por defecto):</p>
            <pre><code class="python">from playwright.sync_api import expect

# ── Esperar texto específico ──
expect(page.locator(".status")).to_have_text("Completado")
expect(page.locator(".title")).to_contain_text("Bienvenido")
expect(page.locator("h1")).not_to_have_text("Cargando...")

# ── Esperar visibilidad ──
expect(page.locator(".spinner")).to_be_hidden()
expect(page.locator(".results")).to_be_visible()

# ── Esperar estado de elementos ──
expect(page.locator("#submit")).to_be_enabled()
expect(page.locator("#submit")).to_be_disabled()
expect(page.locator("#terms")).to_be_checked()

# ── Esperar cantidad de elementos ──
expect(page.locator(".product-card")).to_have_count(10)

# ── Esperar atributos ──
expect(page.locator("#input")).to_have_attribute("class", "valid")
expect(page.locator("#input")).to_have_value("Juan")

# ── Esperar URL ──
expect(page).to_have_url("**/dashboard")
expect(page).to_have_title("Mi App - Dashboard")

# ── Timeout personalizado ──
expect(page.locator(".slow-load")).to_be_visible(timeout=15000)</code></pre>
            <p><strong>¿Por qué es la mejor opción?</strong> Porque combina espera + assertion
            en una sola operación. Si el texto no aparece, obtienes un mensaje de error
            claro en el reporte del test.</p>
        </div>

        <h3>⏳ Estrategia #2: locator.wait_for() — Espera explícita</h3>
        <pre><code class="python"># wait_for() espera a que un locator alcance un estado específico
# Útil cuando necesitas esperar ANTES de ejecutar una acción

# Esperar a que un elemento aparezca
page.locator(".dynamic-content").wait_for(state="visible")

# Esperar a que un spinner desaparezca
page.locator(".loading-spinner").wait_for(state="hidden")

# Esperar a que un elemento se agregue al DOM (no necesariamente visible)
page.locator("#lazy-component").wait_for(state="attached")

# Esperar a que un elemento se elimine del DOM
page.locator(".temp-banner").wait_for(state="detached")

# Con timeout personalizado
page.locator(".slow-element").wait_for(state="visible", timeout=20000)

# ── Estados disponibles ──
# "visible"  → existe + es visible
# "hidden"   → no existe O no es visible
# "attached" → existe en el DOM (visible o no)
# "detached" → no existe en el DOM</code></pre>

        <h3>🌐 Estrategia #3: page.wait_for_url() — Esperar navegación</h3>
        <pre><code class="python"># Esperar a que la URL cambie después de una acción

page.click("#login-btn")
page.wait_for_url("**/dashboard")  # Glob pattern
# Ahora estamos en el dashboard

page.click("#logout")
page.wait_for_url("**/login")

# Con regex
page.wait_for_url(re.compile(r"/products/\\d+"))

# Con timeout
page.wait_for_url("**/results", timeout=15000)</code></pre>

        <h3>📡 Estrategia #4: page.wait_for_load_state() — Esperar carga</h3>
        <pre><code class="python"># Esperar diferentes estados de carga de la página

# "load" — evento load del browser (imágenes, CSS cargados)
page.wait_for_load_state("load")

# "domcontentloaded" — DOM parseado (más rápido que load)
page.wait_for_load_state("domcontentloaded")

# "networkidle" — sin actividad de red por 500ms
# Útil para SPAs que cargan datos via AJAX
page.wait_for_load_state("networkidle")

# Ejemplo práctico: navegar y esperar carga completa
page.goto("https://mi-app.com/reports")
page.wait_for_load_state("networkidle")
# Ahora todos los datos están cargados</code></pre>

        <h3>⏱️ Estrategia #5: page.wait_for_timeout() — Sleep (último recurso)</h3>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python"># ⚠️ EVITAR SIEMPRE QUE SEA POSIBLE
# Es el equivalente a time.sleep() pero integrado en Playwright

# ❌ Malo — espera fija, lento y no confiable
page.wait_for_timeout(3000)  # Esperar 3 segundos

# ✅ Mejor alternativa — esperar condición específica
expect(page.locator(".data-loaded")).to_be_visible()

# Los únicos escenarios donde wait_for_timeout es aceptable:
# 1. Debugging: pausar temporalmente para inspeccionar
# 2. Animaciones que no afectan actionability
# 3. Rate limiting de APIs externas</code></pre>
        </div>

        <h3>📊 Comparación de estrategias</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #e65100; color: white;">
                        <th style="padding: 10px;">Estrategia</th>
                        <th style="padding: 10px;">Auto-reintenta</th>
                        <th style="padding: 10px;">Caso de uso</th>
                        <th style="padding: 10px;">Prioridad</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #e8f5e9;">
                        <td style="padding: 8px;"><code>expect()</code></td>
                        <td style="padding: 8px;">✅ Sí</td>
                        <td style="padding: 8px;">Verificar estado (texto, visible, etc.)</td>
                        <td style="padding: 8px;">⭐ Preferida</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Auto-waiting en acciones</td>
                        <td style="padding: 8px;">✅ Sí</td>
                        <td style="padding: 8px;">Click, fill, check, etc.</td>
                        <td style="padding: 8px;">⭐ Automática</td>
                    </tr>
                    <tr style="background: #fff8e1;">
                        <td style="padding: 8px;"><code>wait_for()</code></td>
                        <td style="padding: 8px;">✅ Sí</td>
                        <td style="padding: 8px;">Esperar antes de consultar</td>
                        <td style="padding: 8px;">Secundaria</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><code>wait_for_url()</code></td>
                        <td style="padding: 8px;">✅ Sí</td>
                        <td style="padding: 8px;">Esperar navegación</td>
                        <td style="padding: 8px;">Para navegación</td>
                    </tr>
                    <tr style="background: #fff8e1;">
                        <td style="padding: 8px;"><code>wait_for_load_state()</code></td>
                        <td style="padding: 8px;">✅ Sí</td>
                        <td style="padding: 8px;">Esperar carga de página</td>
                        <td style="padding: 8px;">Para SPAs</td>
                    </tr>
                    <tr style="background: #ffebee;">
                        <td style="padding: 8px;"><code>wait_for_timeout()</code></td>
                        <td style="padding: 8px;">❌ No</td>
                        <td style="padding: 8px;">Último recurso / debugging</td>
                        <td style="padding: 8px;">⛔ Evitar</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>🧪 Ejemplo real: Dashboard con carga asíncrona</h3>
        <pre><code class="python">from playwright.sync_api import sync_playwright, expect

def test_dashboard_carga_datos(page):
    """Test de dashboard que carga datos de 3 APIs diferentes."""

    page.goto("https://mi-app.com/dashboard")

    # 1. Esperar que el spinner desaparezca
    expect(page.locator(".main-spinner")).to_be_hidden()

    # 2. Verificar que los widgets cargaron
    expect(page.locator("[data-testid='sales-widget']")).to_be_visible()
    expect(page.locator("[data-testid='users-widget']")).to_be_visible()
    expect(page.locator("[data-testid='orders-widget']")).to_be_visible()

    # 3. Verificar datos específicos (auto-reintenta hasta tenerlos)
    expect(page.locator(".total-sales")).not_to_have_text("$0")
    expect(page.locator(".active-users")).not_to_have_text("0")

    # 4. Interactuar con los datos cargados (auto-waiting en click)
    page.click("[data-testid='sales-widget'] .details-btn")

    # 5. Esperar navegación al detalle
    expect(page).to_have_url("**/sales/details")</code></pre>

        <h3>🧪 Ejemplo: Formulario con validación async</h3>
        <pre><code class="python">def test_formulario_validacion_async(page):
    """Formulario que valida email contra API en tiempo real."""

    page.goto("https://mi-app.com/register")
    page.fill("#nombre", "Juan Reina")

    # Al escribir el email, la app valida contra la API
    page.fill("#email", "juan@siesa.com")

    # Esperar a que la validación async termine
    # (el ícono de check verde aparece junto al campo)
    expect(page.locator("#email-status .valid-icon")).to_be_visible()

    page.fill("#password", "MiClave@123")

    # El botón se habilita solo cuando todo es válido
    expect(page.locator("#register-btn")).to_be_enabled()
    page.click("#register-btn")

    # Esperar redirección post-registro
    expect(page).to_have_url("**/welcome")</code></pre>

        <h3>🔑 Regla de decisión</h3>
        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="text">¿Necesito esperar algo?
│
├─ ¿Es una acción (click, fill, etc.)?
│  └─ No hagas nada. El auto-waiting se encarga.
│
├─ ¿Es una verificación (assert)?
│  └─ Usa expect(). Combina espera + assertion.
│
├─ ¿Necesito esperar antes de una consulta?
│  └─ Usa locator.wait_for() o expect() previo.
│
├─ ¿Necesito esperar un cambio de URL?
│  └─ Usa page.wait_for_url() o expect(page).to_have_url()
│
├─ ¿Necesito esperar carga de SPA?
│  └─ Usa page.wait_for_load_state("networkidle")
│
└─ ¿Nada de lo anterior funciona?
   └─ Investiga por qué. Casi nunca necesitas wait_for_timeout().</code></pre>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip:</strong> Un test de Playwright bien escrito tiene
            <strong>cero</strong> <code>wait_for_timeout()</code> y
            <strong>cero</strong> <code>time.sleep()</code>. Si necesitas alguno,
            probablemente hay una mejor alternativa.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Para cada escenario, elige la estrategia correcta:</p>
            <ol>
                <li>Verificar que una tabla tiene exactamente 25 filas después de una búsqueda</li>
                <li>Esperar a que un modal de carga desaparezca antes de hacer clic en un botón</li>
                <li>Verificar que la URL cambió a <code>/success</code> después de enviar un formulario</li>
                <li>Esperar a que un gráfico de charts.js termine de renderizar (no hay indicador visual)</li>
            </ol>
        </div>
    `,
    topics: ["waits", "expect", "estrategias"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_062 = LESSON_062;
}
