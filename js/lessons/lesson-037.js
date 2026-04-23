/**
 * Playwright Academy - Leccion 037
 * Localizadores built-in de Playwright
 * Seccion 5: Localizadores y Selectores
 */

const LESSON_037 = {
    id: 37,
    title: "Localizadores built-in de Playwright",
    duration: "8 min",
    level: "beginner",
    section: "section-05",
    content: `
        <h2>🎯 Localizadores built-in de Playwright</h2>
        <p>Los localizadores son la piedra angular de todo test de automatización. Playwright ofrece
        un conjunto de <strong>localizadores built-in</strong> diseñados para ser resilientes, legibles
        y alineados con cómo los usuarios realmente interactúan con las páginas web.</p>

        <h3>🔍 ¿Qué es un localizador y por qué importa?</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Un <strong>localizador</strong> (Locator) en Playwright es una referencia a un elemento del DOM
            que incorpora tres superpoderes automáticos:</p>
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Superpoder</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripción</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Strict Mode</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Si el localizador coincide con más de un elemento, lanza un error inmediato (evita acciones sobre el elemento equivocado)</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Auto-waiting</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Espera automáticamente a que el elemento esté visible, habilitado y estable antes de interactuar</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Auto-retry</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Reintenta la búsqueda del elemento si el DOM cambia, ideal para SPAs y contenido dinámico</td>
                </tr>
            </table>
        </div>

        <div class="code-tabs" data-code-id="L037-1">
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
                <pre><code class="language-python"># Un localizador NO busca inmediatamente en el DOM.
# Solo se resuelve cuando se ejecuta una acción o assertion.
boton = page.get_by_role("button", name="Enviar")  # Solo crea la referencia
boton.click()  # Aquí es donde busca, espera y hace click</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Un localizador NO busca inmediatamente en el DOM.
// Solo se resuelve cuando se ejecuta una acción o assertion.
const boton = page.getByRole('button', { name: 'Enviar' });  // Solo crea la referencia
await boton.click();  // Aquí es donde busca, espera y hace click</code></pre>
            </div>
        </div>

        <h3>🏆 page.get_by_role() — El localizador recomendado #1</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><code>get_by_role()</code> localiza elementos por su <strong>rol ARIA</strong>, que es la forma en que
            las tecnologías de asistencia y los usuarios perciben los elementos. Es el localizador
            más recomendado porque es resiliente a cambios de implementación.</p>
        </div>

        <h4>Roles más comunes</h4>
        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #c8e6c9;">
                <th style="padding: 8px; border: 1px solid #ddd;">Rol</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Elemento HTML típico</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo</th>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>button</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">&lt;button&gt;, &lt;input type="submit"&gt;</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>page.get_by_role("button", name="Guardar")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>link</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">&lt;a href="..."&gt;</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>page.get_by_role("link", name="Inicio")</code></td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>heading</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">&lt;h1&gt; a &lt;h6&gt;</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>page.get_by_role("heading", name="Bienvenido", level=1)</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>textbox</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">&lt;input type="text"&gt;, &lt;textarea&gt;</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>page.get_by_role("textbox", name="Email")</code></td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>checkbox</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">&lt;input type="checkbox"&gt;</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>page.get_by_role("checkbox", name="Acepto")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>radio</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">&lt;input type="radio"&gt;</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>page.get_by_role("radio", name="Masculino")</code></td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>combobox</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">&lt;select&gt;</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>page.get_by_role("combobox", name="País")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>listbox</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">&lt;ul role="listbox"&gt;</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>page.get_by_role("listbox", name="Opciones")</code></td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>navigation</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">&lt;nav&gt;</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>page.get_by_role("navigation")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>dialog</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">&lt;dialog&gt;, role="dialog"</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>page.get_by_role("dialog", name="Confirmar")</code></td>
            </tr>
        </table>

        <h4>Opciones avanzadas de get_by_role()</h4>
        <div class="code-tabs" data-code-id="L037-2">
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
                <pre><code class="language-python"># name: texto accesible del elemento (coincidencia parcial por defecto)
page.get_by_role("button", name="Guardar")

# exact: coincidencia exacta del nombre
page.get_by_role("button", name="Guardar", exact=True)

# checked: estado de checkbox/radio
page.get_by_role("checkbox", checked=True)

# disabled: elementos deshabilitados
page.get_by_role("button", name="Enviar", disabled=True)

# expanded: estado de elementos colapsables (accordion, dropdown)
page.get_by_role("button", expanded=False)

# level: nivel de heading (h1=1, h2=2, etc.)
page.get_by_role("heading", level=2)

# pressed: estado de toggle buttons
page.get_by_role("button", name="Negrita", pressed=True)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// name: texto accesible del elemento (coincidencia parcial por defecto)
page.getByRole('button', { name: 'Guardar' });

// exact: coincidencia exacta del nombre
page.getByRole('button', { name: 'Guardar', exact: true });

// checked: estado de checkbox/radio
page.getByRole('checkbox', { checked: true });

// disabled: elementos deshabilitados
page.getByRole('button', { name: 'Enviar', disabled: true });

// expanded: estado de elementos colapsables (accordion, dropdown)
page.getByRole('button', { expanded: false });

// level: nivel de heading (h1=1, h2=2, etc.)
page.getByRole('heading', { level: 2 });

// pressed: estado de toggle buttons
page.getByRole('button', { name: 'Negrita', pressed: true });</code></pre>
            </div>
        </div>

        <h3>📝 page.get_by_text() — Localizar por texto visible</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Busca elementos por su <strong>contenido de texto visible</strong>. Ideal para párrafos,
            spans, divs con texto y cualquier elemento que no tenga un rol semántico claro.</p>
        </div>

        <div class="code-tabs" data-code-id="L037-3">
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
                <pre><code class="language-python"># Coincidencia parcial (por defecto) - encuentra "Bienvenido a la plataforma"
page.get_by_text("Bienvenido")

# Coincidencia exacta
page.get_by_text("Bienvenido", exact=True)  # Solo "Bienvenido", no "Bienvenido a..."

# Con expresiones regulares
import re
page.get_by_text(re.compile(r"Total: \\$\\d+\\.\\d{2}"))  # "Total: $125.50"

# Buscar texto en un contenedor específico
page.locator(".tarjeta-producto").get_by_text("Agregar al carrito")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Coincidencia parcial (por defecto) - encuentra "Bienvenido a la plataforma"
page.getByText('Bienvenido');

// Coincidencia exacta
page.getByText('Bienvenido', { exact: true });  // Solo "Bienvenido", no "Bienvenido a..."

// Con expresiones regulares
page.getByText(/Total: \\$\\d+\\.\\d{2}/);  // "Total: $125.50"

// Buscar texto en un contenedor específico
page.locator('.tarjeta-producto').getByText('Agregar al carrito');</code></pre>
            </div>
        </div>

        <h3>🏷️ page.get_by_label() — Formularios por etiqueta</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Localiza campos de formulario por el texto de su <strong>&lt;label&gt;</strong> asociado.
            Es la forma natural en que un usuario identifica un campo: "el campo que dice Email".</p>
        </div>

        <div class="code-tabs" data-code-id="L037-4">
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
                <pre><code class="language-python"># HTML: <label for="email">Correo electrónico</label><input id="email">
page.get_by_label("Correo electrónico").fill("user@example.com")

# HTML: <label>Contraseña <input type="password"></label>
page.get_by_label("Contraseña").fill("mi_clave_segura")

# Con exact para evitar ambigüedades
# Si hay "Nombre" y "Nombre completo"
page.get_by_label("Nombre", exact=True)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// HTML: <label for="email">Correo electrónico</label><input id="email">
await page.getByLabel('Correo electrónico').fill('user@example.com');

// HTML: <label>Contraseña <input type="password"></label>
await page.getByLabel('Contraseña').fill('mi_clave_segura');

// Con exact para evitar ambigüedades
// Si hay "Nombre" y "Nombre completo"
page.getByLabel('Nombre', { exact: true });</code></pre>
            </div>
        </div>

        <h3>💬 page.get_by_placeholder() — Inputs por placeholder</h3>
        <div class="code-tabs" data-code-id="L037-5">
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
                <pre><code class="language-python"># HTML: <input placeholder="Buscar productos...">
page.get_by_placeholder("Buscar productos").fill("laptop gaming")

# HTML: <input placeholder="DD/MM/AAAA">
page.get_by_placeholder("DD/MM/AAAA").fill("15/03/2026")

# Coincidencia parcial
page.get_by_placeholder("Buscar")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// HTML: <input placeholder="Buscar productos...">
await page.getByPlaceholder('Buscar productos').fill('laptop gaming');

// HTML: <input placeholder="DD/MM/AAAA">
await page.getByPlaceholder('DD/MM/AAAA').fill('15/03/2026');

// Coincidencia parcial
page.getByPlaceholder('Buscar');</code></pre>
            </div>
        </div>

        <h3>🖼️ page.get_by_alt_text() — Imágenes por texto alternativo</h3>
        <div class="code-tabs" data-code-id="L037-6">
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
                <pre><code class="language-python"># HTML: <img alt="Logo de la empresa" src="logo.png">
page.get_by_alt_text("Logo de la empresa").click()

# HTML: <img alt="Producto: Laptop HP Pavilion" src="laptop.jpg">
page.get_by_alt_text("Laptop HP Pavilion")

# También funciona con áreas de mapas de imagen
# HTML: <area alt="Zona de contacto" href="/contacto"></area>
page.get_by_alt_text("Zona de contacto").click()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// HTML: <img alt="Logo de la empresa" src="logo.png">
await page.getByAltText('Logo de la empresa').click();

// HTML: <img alt="Producto: Laptop HP Pavilion" src="laptop.jpg">
page.getByAltText('Laptop HP Pavilion');

// También funciona con áreas de mapas de imagen
// HTML: <area alt="Zona de contacto" href="/contacto"></area>
await page.getByAltText('Zona de contacto').click();</code></pre>
            </div>
        </div>

        <h3>ℹ️ page.get_by_title() — Elementos por atributo title</h3>
        <div class="code-tabs" data-code-id="L037-7">
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
                <pre><code class="language-python"># HTML: <button title="Cerrar ventana">X</button>
page.get_by_title("Cerrar ventana").click()

# HTML: <abbr title="Sociedad de Ingenieros">SIESA</abbr>
page.get_by_title("Sociedad de Ingenieros")

# HTML: <span title="3.5 de 5 estrellas">★★★☆☆</span>
page.get_by_title("3.5 de 5 estrellas")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// HTML: <button title="Cerrar ventana">X</button>
await page.getByTitle('Cerrar ventana').click();

// HTML: <abbr title="Sociedad de Ingenieros">SIESA</abbr>
page.getByTitle('Sociedad de Ingenieros');

// HTML: <span title="3.5 de 5 estrellas">★★★☆☆</span>
page.getByTitle('3.5 de 5 estrellas');</code></pre>
            </div>
        </div>

        <h3>🧪 page.get_by_test_id() — IDs personalizados para testing</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Usa atributos <code>data-testid</code> agregados explícitamente por el equipo de desarrollo
            para facilitar la automatización. Es el último recurso antes de CSS/XPath.</p>
        </div>

        <div class="code-tabs" data-code-id="L037-8">
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
                <pre><code class="language-python"># HTML: <div data-testid="panel-resumen">...</div>
page.get_by_test_id("panel-resumen")

# HTML: <button data-testid="btn-checkout">Pagar</button>
page.get_by_test_id("btn-checkout").click()

# Configurar un atributo personalizado (en conftest.py o al inicio)
# Si tu app usa "data-qa" en vez de "data-testid":
from playwright.sync_api import Playwright

def configurar_playwright(playwright: Playwright):
    playwright.selectors.set_test_id_attribute("data-qa")

# Ahora get_by_test_id busca en data-qa
# HTML: <input data-qa="campo-busqueda">
page.get_by_test_id("campo-busqueda")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// HTML: <div data-testid="panel-resumen">...</div>
page.getByTestId('panel-resumen');

// HTML: <button data-testid="btn-checkout">Pagar</button>
await page.getByTestId('btn-checkout').click();

// Configurar un atributo personalizado (en playwright.config.ts)
// Si tu app usa "data-qa" en vez de "data-testid":
// playwright.config.ts
import { defineConfig } from '@playwright/test';
export default defineConfig({
  use: {
    testIdAttribute: 'data-qa',
  },
});

// Ahora getByTestId busca en data-qa
// HTML: <input data-qa="campo-busqueda">
page.getByTestId('campo-busqueda');</code></pre>
            </div>
        </div>

        <h3>📊 Tabla comparativa de todos los localizadores built-in</h3>
        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #0277bd; color: white;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Método</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Caso de uso</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Prioridad</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>get_by_role()</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Botones, links, headings, inputs, checkboxes</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>get_by_role("button", name="OK")</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">⭐ 1</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>get_by_label()</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Campos de formulario con label</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>get_by_label("Email")</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">⭐ 2</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>get_by_placeholder()</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Inputs con texto de placeholder</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>get_by_placeholder("Buscar...")</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">⭐ 3</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>get_by_text()</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Elementos por texto visible</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>get_by_text("Bienvenido")</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">⭐ 4</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>get_by_alt_text()</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Imágenes y áreas con alt</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>get_by_alt_text("Logo")</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">⭐ 5</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>get_by_title()</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Elementos con atributo title</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>get_by_title("Cerrar")</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">⭐ 6</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>get_by_test_id()</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Atributos data-testid personalizados</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>get_by_test_id("submit-btn")</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">⭐ 7</td>
                </tr>
            </table>
        </div>

        <h3>🔺 Pirámide de prioridad de localizadores</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code>          ┌─────────────┐
          │   get_by_    │  ← Siempre preferir
          │   role()     │     localizadores
          ├─────────────┤     semánticos
          │ get_by_label │
          │ placeholder  │
          ├──────────────┤
          │ get_by_text  │  ← Basados en
          ├──────────────┤     contenido visible
          │get_by_test_id│  ← Basado en
          ├──────────────┤     atributos de test
          │  CSS Selector│  ← Solo cuando no hay
          ├──────────────┤     alternativa built-in
          │    XPath     │  ← Último recurso
          └──────────────┘</code></pre>
            <p><strong>Regla de oro:</strong> Usa el localizador más alto de la pirámide que funcione
            para tu caso. Cuanto más arriba, más resiliente al cambio.</p>
        </div>

        <h3>🔧 Ejemplo completo: Login Page con localizadores built-in</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Supongamos un formulario de login típico. Veamos cómo localizar cada elemento
            usando exclusivamente localizadores built-in:</p>
        </div>

        <div class="code-tabs" data-code-id="L037-9">
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
                <pre><code class="language-python"># test_login_locators.py
from playwright.sync_api import Page, expect

def test_login_con_localizadores_builtin(page: Page):
    """
    Demuestra el uso de TODOS los localizadores built-in
    en un formulario de login real.
    """
    page.goto("https://mi-app.com/login")

    # --- get_by_role: heading ---
    expect(page.get_by_role("heading", name="Iniciar sesión", level=1)).to_be_visible()

    # --- get_by_alt_text: logo ---
    expect(page.get_by_alt_text("Logo de Mi App")).to_be_visible()

    # --- get_by_label: campos del formulario ---
    page.get_by_label("Correo electrónico").fill("usuario@empresa.com")
    page.get_by_label("Contraseña").fill("MiClave123!")

    # --- get_by_role: checkbox ---
    page.get_by_role("checkbox", name="Recordarme").check()

    # --- get_by_role: button ---
    page.get_by_role("button", name="Iniciar sesión").click()

    # --- get_by_text: mensaje de bienvenida ---
    expect(page.get_by_text("Bienvenido de vuelta")).to_be_visible()

    # --- get_by_role: link ---
    page.get_by_role("link", name="Mi perfil").click()

    # --- get_by_title: tooltip ---
    expect(page.get_by_title("Última conexión: hace 2 horas")).to_be_visible()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// test_login_locators.spec.ts
import { test, expect } from '@playwright/test';

test('login con localizadores built-in', async ({ page }) => {
    // Demuestra el uso de TODOS los localizadores built-in
    // en un formulario de login real.
    await page.goto('https://mi-app.com/login');

    // --- getByRole: heading ---
    await expect(page.getByRole('heading', { name: 'Iniciar sesión', level: 1 })).toBeVisible();

    // --- getByAltText: logo ---
    await expect(page.getByAltText('Logo de Mi App')).toBeVisible();

    // --- getByLabel: campos del formulario ---
    await page.getByLabel('Correo electrónico').fill('usuario@empresa.com');
    await page.getByLabel('Contraseña').fill('MiClave123!');

    // --- getByRole: checkbox ---
    await page.getByRole('checkbox', { name: 'Recordarme' }).check();

    // --- getByRole: button ---
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // --- getByText: mensaje de bienvenida ---
    await expect(page.getByText('Bienvenido de vuelta')).toBeVisible();

    // --- getByRole: link ---
    await page.getByRole('link', { name: 'Mi perfil' }).click();

    // --- getByTitle: tooltip ---
    await expect(page.getByTitle('Última conexión: hace 2 horas')).toBeVisible();
});</code></pre>
            </div>
        </div>

        <div class="code-tabs" data-code-id="L037-10">
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
                <pre><code class="language-python"># Versión alternativa: mismo formulario usando get_by_placeholder
def test_login_con_placeholder(page: Page):
    page.goto("https://mi-app.com/login")

    # Cuando no hay labels, usar placeholder
    page.get_by_placeholder("correo@ejemplo.com").fill("usuario@empresa.com")
    page.get_by_placeholder("Tu contraseña").fill("MiClave123!")

    page.get_by_role("button", name="Iniciar sesión").click()
    expect(page.get_by_text("Bienvenido")).to_be_visible()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Versión alternativa: mismo formulario usando getByPlaceholder
test('login con placeholder', async ({ page }) => {
    await page.goto('https://mi-app.com/login');

    // Cuando no hay labels, usar placeholder
    await page.getByPlaceholder('correo@ejemplo.com').fill('usuario@empresa.com');
    await page.getByPlaceholder('Tu contraseña').fill('MiClave123!');

    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
    await expect(page.getByText('Bienvenido')).toBeVisible();
});</code></pre>
            </div>
        </div>

        <div class="code-tabs" data-code-id="L037-11">
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
                <pre><code class="language-python"># Versión con get_by_test_id: cuando el frontend agrega data-testid
def test_login_con_testid(page: Page):
    page.goto("https://mi-app.com/login")

    page.get_by_test_id("input-email").fill("usuario@empresa.com")
    page.get_by_test_id("input-password").fill("MiClave123!")
    page.get_by_test_id("btn-login").click()

    expect(page.get_by_test_id("mensaje-bienvenida")).to_be_visible()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Versión con getByTestId: cuando el frontend agrega data-testid
test('login con testid', async ({ page }) => {
    await page.goto('https://mi-app.com/login');

    await page.getByTestId('input-email').fill('usuario@empresa.com');
    await page.getByTestId('input-password').fill('MiClave123!');
    await page.getByTestId('btn-login').click();

    await expect(page.getByTestId('mensaje-bienvenida')).toBeVisible();
});</code></pre>
            </div>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Reto:</strong> Localiza todos los elementos del siguiente formulario HTML
            usando <strong>únicamente</strong> localizadores built-in (sin CSS ni XPath).</p>
        </div>

        <div class="code-tabs" data-code-id="L037-12">
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
                <pre><code class="language-python"># HTML del formulario:
# <h2>Registro de Usuario</h2>
# <img alt="Icono de registro" src="register.png">
# <form>
#   <label for="nombre">Nombre completo</label>
#   <input id="nombre" placeholder="Juan Pérez">
#
#   <label for="email">Email</label>
#   <input id="email" type="email" placeholder="tu@email.com">
#
#   <label for="telefono">Teléfono</label>
#   <input id="telefono" type="tel" placeholder="+57 300 123 4567">
#
#   <label>País
#     <select>
#       <option>Colombia</option>
#       <option>México</option>
#       <option>Argentina</option>
#     </select>
#   </label>
#
#   <input type="checkbox" id="terminos">
#   <label for="terminos">Acepto los términos</label>
#
#   <input type="radio" name="plan" id="plan-free">
#   <label for="plan-free">Plan Gratuito</label>
#
#   <input type="radio" name="plan" id="plan-pro">
#   <label for="plan-pro">Plan Profesional</label>
#
#   <button type="submit" title="Enviar formulario de registro">Registrarse</button>
#   <a href="/login">¿Ya tienes cuenta? Inicia sesión</a>
# </form>

# --- TU EJERCICIO: Completa cada localizador ---
from playwright.sync_api import Page, expect

def test_formulario_registro(page: Page):
    page.goto("/registro")

    # 1. Verificar el heading
    expect(page.get_by_role("heading", name="Registro de Usuario")).to_be_visible()

    # 2. Verificar la imagen
    expect(page.get_by_alt_text("Icono de registro")).to_be_visible()

    # 3. Llenar "Nombre completo" (usa get_by_label)
    page.get_by_label("Nombre completo").fill("María García")

    # 4. Llenar "Email" (usa get_by_label)
    page.get_by_label("Email").fill("maria@correo.com")

    # 5. Llenar "Teléfono" (usa get_by_placeholder)
    page.get_by_placeholder("+57 300 123 4567").fill("+57 311 555 7890")

    # 6. Seleccionar país (usa get_by_role combobox)
    page.get_by_role("combobox", name="País").select_option("Colombia")

    # 7. Aceptar términos (usa get_by_role checkbox)
    page.get_by_role("checkbox", name="Acepto los términos").check()

    # 8. Seleccionar plan (usa get_by_role radio)
    page.get_by_role("radio", name="Plan Profesional").check()

    # 9. Enviar (usa get_by_role button)
    page.get_by_role("button", name="Registrarse").click()

    # 10. Navegar a login (usa get_by_role link)
    # page.get_by_role("link", name="Inicia sesión").click()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// --- TU EJERCICIO: Completa cada localizador ---
import { test, expect } from '@playwright/test';

test('formulario de registro', async ({ page }) => {
    await page.goto('/registro');

    // 1. Verificar el heading
    await expect(page.getByRole('heading', { name: 'Registro de Usuario' })).toBeVisible();

    // 2. Verificar la imagen
    await expect(page.getByAltText('Icono de registro')).toBeVisible();

    // 3. Llenar "Nombre completo" (usa getByLabel)
    await page.getByLabel('Nombre completo').fill('María García');

    // 4. Llenar "Email" (usa getByLabel)
    await page.getByLabel('Email').fill('maria@correo.com');

    // 5. Llenar "Teléfono" (usa getByPlaceholder)
    await page.getByPlaceholder('+57 300 123 4567').fill('+57 311 555 7890');

    // 6. Seleccionar país (usa getByRole combobox)
    await page.getByRole('combobox', { name: 'País' }).selectOption('Colombia');

    // 7. Aceptar términos (usa getByRole checkbox)
    await page.getByRole('checkbox', { name: 'Acepto los términos' }).check();

    // 8. Seleccionar plan (usa getByRole radio)
    await page.getByRole('radio', { name: 'Plan Profesional' }).check();

    // 9. Enviar (usa getByRole button)
    await page.getByRole('button', { name: 'Registrarse' }).click();

    // 10. Navegar a login (usa getByRole link)
    // await page.getByRole('link', { name: 'Inicia sesión' }).click();
});</code></pre>
            </div>
        </div>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Entender qué es un localizador y sus tres superpoderes: strict mode, auto-waiting, auto-retry</li>
                <li>Dominar <code>get_by_role()</code> como localizador principal con todas sus opciones</li>
                <li>Usar <code>get_by_text()</code>, <code>get_by_label()</code>, <code>get_by_placeholder()</code>, <code>get_by_alt_text()</code>, <code>get_by_title()</code> y <code>get_by_test_id()</code></li>
                <li>Aplicar la pirámide de prioridad para elegir el localizador óptimo</li>
                <li>Localizar elementos de un formulario completo sin usar CSS ni XPath</li>
            </ul>
        </div>

        <h3>🚀 Siguiente: CSS Selectors en Playwright</h3>
        <p>En la siguiente lección aprenderás a usar selectores CSS cuando los localizadores
        built-in no son suficientes, incluyendo las extensiones propias de Playwright.</p>
    `,
    topics: ["localizadores", "built-in", "playwright"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 8,
    difficulty: "easy",
    type: "foundation"
};

if (typeof window !== 'undefined') {
    window.LESSON_037 = LESSON_037;
}
