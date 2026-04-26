/**
 * Playwright Academy - Lección 061
 * Actionability: visible, enabled, stable
 * Sección 8: Auto-waiting y Actionability
 */

const LESSON_061 = {
    id: 61,
    title: "Actionability: visible, enabled, stable",
    duration: "7 min",
    level: "intermediate",
    section: "section-08",
    content: `
        <h2>🎯 Actionability: visible, enabled, stable</h2>
        <p>El auto-waiting de Playwright se basa en el concepto de <strong>actionability</strong>:
        un conjunto de verificaciones que determina si un elemento está <em>listo</em> para
        recibir una acción. Cada tipo de acción requiere diferentes condiciones.</p>

        <h3>📋 Las 6 condiciones de Actionability</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #1565c0; color: white;">
                        <th style="padding: 10px;">Condición</th>
                        <th style="padding: 10px;">Qué verifica</th>
                        <th style="padding: 10px;">Ejemplo de fallo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><strong>Attached</strong></td>
                        <td style="padding: 8px;">El elemento existe en el DOM</td>
                        <td style="padding: 8px;">Elemento aún no renderizado</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>Visible</strong></td>
                        <td style="padding: 8px;">El elemento es visible al usuario</td>
                        <td style="padding: 8px;"><code>display: none</code>, <code>visibility: hidden</code>, tamaño 0</td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><strong>Stable</strong></td>
                        <td style="padding: 8px;">El elemento no se está moviendo</td>
                        <td style="padding: 8px;">Animación CSS en curso, transición</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>Enabled</strong></td>
                        <td style="padding: 8px;">El elemento no está deshabilitado</td>
                        <td style="padding: 8px;"><code>disabled</code> attribute, <code>aria-disabled</code></td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><strong>Editable</strong></td>
                        <td style="padding: 8px;">El campo acepta texto</td>
                        <td style="padding: 8px;"><code>readonly</code>, <code>contenteditable=false</code></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>Receives Events</strong></td>
                        <td style="padding: 8px;">Ningún otro elemento lo cubre</td>
                        <td style="padding: 8px;">Overlay, modal, tooltip encima</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>🔗 ¿Qué condiciones aplican a cada acción?</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #6a1b9a; color: white;">
                        <th style="padding: 8px;">Acción</th>
                        <th style="padding: 8px; text-align: center;">Attached</th>
                        <th style="padding: 8px; text-align: center;">Visible</th>
                        <th style="padding: 8px; text-align: center;">Stable</th>
                        <th style="padding: 8px; text-align: center;">Enabled</th>
                        <th style="padding: 8px; text-align: center;">Editable</th>
                        <th style="padding: 8px; text-align: center;">Receives Events</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 6px;"><code>click()</code></td>
                        <td style="padding: 6px; text-align: center;">✅</td>
                        <td style="padding: 6px; text-align: center;">✅</td>
                        <td style="padding: 6px; text-align: center;">✅</td>
                        <td style="padding: 6px; text-align: center;">✅</td>
                        <td style="padding: 6px; text-align: center;">-</td>
                        <td style="padding: 6px; text-align: center;">✅</td>
                    </tr>
                    <tr style="background: #f3e5f5;">
                        <td style="padding: 6px;"><code>fill()</code></td>
                        <td style="padding: 6px; text-align: center;">✅</td>
                        <td style="padding: 6px; text-align: center;">✅</td>
                        <td style="padding: 6px; text-align: center;">✅</td>
                        <td style="padding: 6px; text-align: center;">✅</td>
                        <td style="padding: 6px; text-align: center;">✅</td>
                        <td style="padding: 6px; text-align: center;">✅</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px;"><code>hover()</code></td>
                        <td style="padding: 6px; text-align: center;">✅</td>
                        <td style="padding: 6px; text-align: center;">✅</td>
                        <td style="padding: 6px; text-align: center;">✅</td>
                        <td style="padding: 6px; text-align: center;">-</td>
                        <td style="padding: 6px; text-align: center;">-</td>
                        <td style="padding: 6px; text-align: center;">✅</td>
                    </tr>
                    <tr style="background: #f3e5f5;">
                        <td style="padding: 6px;"><code>check()</code></td>
                        <td style="padding: 6px; text-align: center;">✅</td>
                        <td style="padding: 6px; text-align: center;">✅</td>
                        <td style="padding: 6px; text-align: center;">✅</td>
                        <td style="padding: 6px; text-align: center;">✅</td>
                        <td style="padding: 6px; text-align: center;">-</td>
                        <td style="padding: 6px; text-align: center;">✅</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px;"><code>text_content()</code></td>
                        <td style="padding: 6px; text-align: center;">✅</td>
                        <td style="padding: 6px; text-align: center;">-</td>
                        <td style="padding: 6px; text-align: center;">-</td>
                        <td style="padding: 6px; text-align: center;">-</td>
                        <td style="padding: 6px; text-align: center;">-</td>
                        <td style="padding: 6px; text-align: center;">-</td>
                    </tr>
                    <tr style="background: #f3e5f5;">
                        <td style="padding: 6px;"><code>is_visible()</code></td>
                        <td style="padding: 6px; text-align: center;">-</td>
                        <td style="padding: 6px; text-align: center;">-</td>
                        <td style="padding: 6px; text-align: center;">-</td>
                        <td style="padding: 6px; text-align: center;">-</td>
                        <td style="padding: 6px; text-align: center;">-</td>
                        <td style="padding: 6px; text-align: center;">-</td>
                    </tr>
                </tbody>
            </table>
            <p style="margin-top: 10px; font-size: 0.9em;"><strong>Nota:</strong>
            <code>text_content()</code> y <code>is_visible()</code> son métodos de consulta
            que <strong>no auto-esperan</strong>. Retornan inmediatamente el estado actual.</p>
        </div>

        <h3>👁️ Visible — ¿Cuándo un elemento es "visible"?</h3>
        <div class="code-tabs" data-code-id="L061-1">
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
            <pre><code class="language-python"># Playwright considera un elemento INVISIBLE si:

# 1. display: none
# &lt;div style="display: none"&gt;Oculto&lt;/div&gt;

# 2. visibility: hidden
# &lt;div style="visibility: hidden"&gt;Oculto&lt;/div&gt;

# 3. opacity: 0
# &lt;div style="opacity: 0"&gt;Oculto&lt;/div&gt;

# 4. Tamaño cero
# &lt;div style="width: 0; height: 0"&gt;Oculto&lt;/div&gt;

# 5. Fuera del viewport (NO lo hace invisible)
# Un elemento fuera de la pantalla SÍ es visible para Playwright
# Playwright hará scroll automático para alcanzarlo

# ── Verificar visibilidad ──
from playwright.sync_api import expect

# expect auto-espera hasta 5s (configurable)
expect(page.locator("#mi-elemento")).to_be_visible()
expect(page.locator("#mi-modal")).to_be_hidden()

# is_visible() NO auto-espera — snapshot instantáneo
visible = page.locator("#mi-elemento").is_visible()  # True/False ahora</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// Playwright considera un elemento INVISIBLE si:

// 1. display: none
// &lt;div style="display: none"&gt;Oculto&lt;/div&gt;

// 2. visibility: hidden
// &lt;div style="visibility: hidden"&gt;Oculto&lt;/div&gt;

// 3. opacity: 0
// &lt;div style="opacity: 0"&gt;Oculto&lt;/div&gt;

// 4. Tamaño cero
// &lt;div style="width: 0; height: 0"&gt;Oculto&lt;/div&gt;

// 5. Fuera del viewport (NO lo hace invisible)
// Un elemento fuera de la pantalla SÍ es visible para Playwright
// Playwright hará scroll automático para alcanzarlo

// ── Verificar visibilidad ──
import { expect } from '@playwright/test';

// expect auto-espera hasta 5s (configurable)
await expect(page.locator('#mi-elemento')).toBeVisible();
await expect(page.locator('#mi-modal')).toBeHidden();

// isVisible() NO auto-espera — snapshot instantáneo
const visible = await page.locator('#mi-elemento').isVisible();  // true/false ahora</code></pre>
        </div>
        </div>

        <h3>🏃 Stable — Esperando fin de animaciones</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Playwright detecta que un elemento se está moviendo comparando su bounding box
            entre dos frames consecutivos. Si la posición cambió, espera al siguiente frame.</p>
            <div class="code-tabs" data-code-id="L061-2">
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
                <pre><code class="language-python"># Escenario: botón que aparece con animación slide-in
# CSS: .btn { animation: slideIn 0.5s ease-out; }

# Playwright espera automáticamente a que termine la animación
# antes de hacer click. No necesitas ningún sleep.
page.click(".animated-btn")  # Espera fin de animación → click

# Escenario: modal que se abre con transición
# CSS: .modal { transition: transform 0.3s; }
page.click(".open-modal-btn")
# El modal tiene una animación de apertura de 0.3s
# Playwright espera a que el botón dentro del modal esté estable
page.click(".modal .confirm-btn")  # Espera → click</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Escenario: botón que aparece con animación slide-in
// CSS: .btn { animation: slideIn 0.5s ease-out; }

// Playwright espera automáticamente a que termine la animación
// antes de hacer click. No necesitas ningún sleep.
await page.click('.animated-btn');  // Espera fin de animación → click

// Escenario: modal que se abre con transición
// CSS: .modal { transition: transform 0.3s; }
await page.click('.open-modal-btn');
// El modal tiene una animación de apertura de 0.3s
// Playwright espera a que el botón dentro del modal esté estable
await page.click('.modal .confirm-btn');  // Espera → click</code></pre>
            </div>
            </div>
        </div>

        <h3>🔓 Enabled — Verificando que no está deshabilitado</h3>
        <div class="code-tabs" data-code-id="L061-3">
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
            <pre><code class="language-python"># Escenario: botón de submit se habilita cuando el formulario es válido

# El botón empieza deshabilitado
# &lt;button disabled&gt;Enviar&lt;/button&gt;

# Llenar campos requeridos
page.fill("#nombre", "Juan")
page.fill("#email", "juan@test.com")

# Ahora el JavaScript de la app quita el 'disabled'
# &lt;button&gt;Enviar&lt;/button&gt;

# Playwright espera automáticamente a que se habilite antes de hacer click
page.click("button:has-text('Enviar')")  # Espera enabled → click

# ── Verificar estado enabled/disabled ──
from playwright.sync_api import expect

expect(page.locator("#submit-btn")).to_be_enabled()
expect(page.locator("#submit-btn")).to_be_disabled()

# Snapshot instantáneo (no auto-espera)
is_enabled = page.locator("#submit-btn").is_enabled()
is_disabled = page.locator("#submit-btn").is_disabled()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// Escenario: botón de submit se habilita cuando el formulario es válido

// El botón empieza deshabilitado
// &lt;button disabled&gt;Enviar&lt;/button&gt;

// Llenar campos requeridos
await page.fill('#nombre', 'Juan');
await page.fill('#email', 'juan@test.com');

// Ahora el JavaScript de la app quita el 'disabled'
// &lt;button&gt;Enviar&lt;/button&gt;

// Playwright espera automáticamente a que se habilite antes de hacer click
await page.click("button:has-text('Enviar')");  // Espera enabled → click

// ── Verificar estado enabled/disabled ──
import { expect } from '@playwright/test';

await expect(page.locator('#submit-btn')).toBeEnabled();
await expect(page.locator('#submit-btn')).toBeDisabled();

// Snapshot instantáneo (no auto-espera)
const isEnabled = await page.locator('#submit-btn').isEnabled();
const isDisabled = await page.locator('#submit-btn').isDisabled();</code></pre>
        </div>
        </div>

        <h3>🎯 Receives Events — Sin elementos encima</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Playwright verifica que el punto central del elemento no esté cubierto
            por otro elemento (overlay, modal, cookie banner, etc.):</p>
            <div class="code-tabs" data-code-id="L061-4">
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
                <pre><code class="language-python"># Escenario: un cookie banner cubre el botón de login
# Playwright detecta esto y espera a que se quite

# Si el banner no se quita solo, Playwright lanza error descriptivo:
# "Element is not visible because it is covered by another element"
# Con detalles del elemento que lo cubre

# Solución 1: Cerrar el overlay primero
if page.locator(".cookie-banner").is_visible():
    page.click(".cookie-banner .accept-btn")
page.click("#login-btn")

# Solución 2: Usar force=True (salta verificación de cobertura)
page.click("#login-btn", force=True)  # ⚠️ Último recurso

# Solución 3: Scroll para evitar el overlap
page.locator("#login-btn").scroll_into_view_if_needed()
page.click("#login-btn")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Escenario: un cookie banner cubre el botón de login
// Playwright detecta esto y espera a que se quite

// Si el banner no se quita solo, Playwright lanza error descriptivo:
// "Element is not visible because it is covered by another element"
// Con detalles del elemento que lo cubre

// Solución 1: Cerrar el overlay primero
if (await page.locator('.cookie-banner').isVisible()) {
    await page.click('.cookie-banner .accept-btn');
}
await page.click('#login-btn');

// Solución 2: Usar force: true (salta verificación de cobertura)
await page.click('#login-btn', { force: true });  // ⚠️ Último recurso

// Solución 3: Scroll para evitar el overlap
await page.locator('#login-btn').scrollIntoViewIfNeeded();
await page.click('#login-btn');</code></pre>
            </div>
            </div>
        </div>

        <h3>⚠️ Métodos que NO auto-esperan</h3>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Los métodos de <strong>consulta</strong> retornan el estado actual
            sin esperar. Si necesitas esperar, usa <code>expect()</code>:</p>
            <div class="code-tabs" data-code-id="L061-5">
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
                <pre><code class="language-python"># ❌ NO auto-esperan — snapshot instantáneo
text = locator.text_content()         # Puede ser None si no existe aún
visible = locator.is_visible()        # Puede ser False si aún no apareció
count = locator.count()               # Puede ser 0 si aún no cargó
inner_html = locator.inner_html()     # Puede estar vacío

# ✅ Alternativa: usar expect() que SÍ auto-espera
expect(locator).to_have_text("Mi texto")
expect(locator).to_be_visible()
expect(locator).to_have_count(5)
expect(locator).to_contain_text("parcial")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// ❌ NO auto-esperan — snapshot instantáneo
const text = await locator.textContent();       // Puede ser null si no existe aún
const visible = await locator.isVisible();      // Puede ser false si aún no apareció
const count = await locator.count();            // Puede ser 0 si aún no cargó
const innerHTML = await locator.innerHTML();    // Puede estar vacío

// ✅ Alternativa: usar expect() que SÍ auto-espera
await expect(locator).toHaveText('Mi texto');
await expect(locator).toBeVisible();
await expect(locator).toHaveCount(5);
await expect(locator).toContainText('parcial');</code></pre>
            </div>
            </div>
        </div>

        <h3>🔧 Forzar acciones (saltar actionability)</h3>
        <div class="code-tabs" data-code-id="L061-6">
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
            <pre><code class="language-python"># force=True salta TODAS las verificaciones de actionability
# Úsalo solo cuando el auto-waiting interfiere con tu caso de test

# Escenario: click en elemento oculto (menú que se muestra con hover)
page.click(".hidden-menu-item", force=True)

# Escenario: check que está cubierto por un label personalizado
page.check("#custom-checkbox", force=True)

# ⚠️ ADVERTENCIA: force=True puede causar que el test pase
# incluso cuando la UI está rota. Úsalo con mucho cuidado.</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// force: true salta TODAS las verificaciones de actionability
// Úsalo solo cuando el auto-waiting interfiere con tu caso de test

// Escenario: click en elemento oculto (menú que se muestra con hover)
await page.click('.hidden-menu-item', { force: true });

// Escenario: check que está cubierto por un label personalizado
await page.check('#custom-checkbox', { force: true });

// ⚠️ ADVERTENCIA: force: true puede causar que el test pase
// incluso cuando la UI está rota. Úsalo con mucho cuidado.</code></pre>
        </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip:</strong> Si te encuentras usando <code>force=True</code> frecuentemente,
            es señal de que los selectores o la estrategia de interacción necesitan revisión.
            El auto-waiting funciona correctamente en el 95% de los casos.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Para cada escenario, indica qué condiciones de
            actionability podrían fallar y cómo lo resolverías:</p>
            <ol>
                <li>Un botón de "Guardar" que está <code>disabled</code> hasta que
                todos los campos obligatorios estén llenos</li>
                <li>Un link dentro de un modal que tiene animación de apertura de 0.5s</li>
                <li>Un campo de búsqueda cubierto por un cookie banner</li>
                <li>Un elemento con <code>display: none</code> que se muestra via JavaScript
                después de una llamada AJAX</li>
            </ol>
        </div>
    `,
    topics: ["actionability", "visible", "enabled", "stable"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_061 = LESSON_061;
}
