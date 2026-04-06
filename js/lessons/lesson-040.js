/**
 * Playwright Academy - Lección 040
 * Localizadores semánticos y accesibilidad
 * Sección 5: Localizadores y Selectores
 */

const LESSON_040 = {
    id: 40,
    title: "Localizadores semánticos y accesibilidad",
    duration: "5 min",
    level: "beginner",
    section: "section-05",
    content: `
        <h2>♿ Localizadores semánticos y accesibilidad</h2>
        <p>Los localizadores semánticos seleccionan elementos según su <strong>rol</strong> y
        <strong>significado</strong> en la interfaz, no por su estructura HTML o estilos CSS.
        Esto produce tests más robustos que sobreviven refactorizaciones visuales y, al mismo
        tiempo, validan que la aplicación sea accesible. Es la estrategia de localización
        <strong>recomendada por Playwright</strong> como primera opción.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎯 ¿Por qué localizadores semánticos?</h4>
            <ul>
                <li><strong>Resiliencia:</strong> No dependen de clases CSS, IDs generados o estructura del DOM</li>
                <li><strong>Auto-documentación:</strong> <code>get_by_role("button", name="Guardar")</code> dice exactamente qué se busca</li>
                <li><strong>Accesibilidad:</strong> Si el test funciona, la app es accesible para lectores de pantalla</li>
                <li><strong>Recomendación oficial:</strong> Playwright prioriza estos localizadores en su documentación</li>
            </ul>
        </div>

        <h3>🏷️ Roles ARIA y cómo Playwright los usa</h3>
        <p>ARIA (Accessible Rich Internet Applications) define <strong>roles</strong> que describen
        el propósito de cada elemento en la interfaz. Los elementos HTML tienen roles implícitos
        (un <code>&lt;button&gt;</code> tiene el rol <code>button</code> automáticamente), pero también
        puedes asignar roles explícitos con el atributo <code>role="..."</code>.</p>

        <p>Playwright utiliza estos roles a través de <code>page.get_by_role()</code>, que consulta
        el árbol de accesibilidad del navegador, no el DOM directamente.</p>

        <h4>Roles implícitos vs explícitos</h4>
        <pre><code class="python">from playwright.sync_api import Page, expect

def test_roles_implicitos_vs_explicitos(page: Page):
    # Rol IMPLÍCITO — el elemento HTML ya tiene un rol por defecto
    # &lt;button&gt;Guardar&lt;/button&gt; → rol "button" implícito
    page.get_by_role("button", name="Guardar")

    # Rol EXPLÍCITO — asignado con atributo role=""
    # &lt;div role="button"&gt;Guardar&lt;/div&gt; → rol "button" explícito
    page.get_by_role("button", name="Guardar")  # Ambos se encuentran igual

    # Playwright no distingue entre implícito y explícito:
    # busca en el árbol de accesibilidad, donde ambos son "button"</code></pre>

        <h3>📋 Roles ARIA comunes</h3>
        <p>Esta tabla lista los roles más usados en testing web, organizados por categoría.</p>

        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #e3f2fd;">
                <th style="padding: 8px; border: 1px solid #ddd;">Categoría</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Rol</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Descripción</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo Playwright</th>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;" rowspan="3"><strong>Widgets</strong></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>button</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Botón clickeable</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("button", name="Enviar")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>link</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Enlace de navegación</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("link", name="Inicio")</code></td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>textbox</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Campo de texto</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("textbox", name="Email")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;" rowspan="3"><strong>Formulario</strong></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>checkbox</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Casilla de verificación</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("checkbox", name="Acepto")</code></td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>radio</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Botón de opción</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("radio", name="Masculino")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>combobox</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Select/dropdown</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("combobox", name="País")</code></td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;" rowspan="3"><strong>Estructura</strong></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>heading</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Encabezado (h1-h6)</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("heading", name="Bienvenido")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>dialog</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Ventana modal/diálogo</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("dialog")</code></td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>alert</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Mensaje de alerta</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("alert")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;" rowspan="3"><strong>Navegación</strong></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>navigation</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Barra de navegación</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("navigation")</code></td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>banner</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Header principal de la página</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("banner")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>main</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Contenido principal</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("main")</code></td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;" rowspan="3"><strong>Tabs/Menús</strong></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>tab</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Pestaña</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("tab", name="General")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>tabpanel</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Panel de contenido de una pestaña</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("tabpanel")</code></td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>menu</code> / <code>menuitem</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Menú y sus opciones</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("menuitem", name="Copiar")</code></td>
            </tr>
        </table>

        <h3>🏗️ Atributos ARIA para accesibilidad</h3>
        <p>Los atributos ARIA proporcionan información adicional que los lectores de pantalla y
        Playwright pueden usar para identificar y describir elementos.</p>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #ce93d8;">
                    <th style="padding: 8px; border: 1px solid #ddd; color: white;">Atributo</th>
                    <th style="padding: 8px; border: 1px solid #ddd; color: white;">Propósito</th>
                    <th style="padding: 8px; border: 1px solid #ddd; color: white;">Ejemplo HTML</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>aria-label</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Etiqueta accesible directa</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>&lt;button aria-label="Cerrar"&gt;X&lt;/button&gt;</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>aria-labelledby</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Referencia a otro elemento como etiqueta</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>&lt;input aria-labelledby="titulo-form"&gt;</code></td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>aria-describedby</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Referencia a descripción adicional</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>&lt;input aria-describedby="help-text"&gt;</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>aria-hidden</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Oculta del árbol de accesibilidad</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>&lt;span aria-hidden="true"&gt;🔍&lt;/span&gt;</code></td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>aria-expanded</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Estado expandido/colapsado</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>&lt;button aria-expanded="false"&gt;Menú&lt;/button&gt;</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>aria-checked</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Estado marcado/desmarcado</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>&lt;div role="checkbox" aria-checked="true"&gt;</code></td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>aria-disabled</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Indica que el elemento está deshabilitado</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>&lt;button aria-disabled="true"&gt;Enviar&lt;/button&gt;</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>aria-selected</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Indica selección en listas/tabs</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>&lt;div role="tab" aria-selected="true"&gt;</code></td>
                </tr>
            </table>
        </div>

        <h3>🔬 page.get_by_role() en profundidad</h3>
        <p><code>get_by_role()</code> es el localizador semántico principal de Playwright. Acepta
        múltiples filtros opcionales que lo hacen extremadamente preciso.</p>

        <pre><code class="python">from playwright.sync_api import Page, expect

def test_get_by_role_opciones(page: Page):
    page.goto("https://the-internet.herokuapp.com/login")

    # --- Filtro básico: solo rol ---
    todos_los_botones = page.get_by_role("button")

    # --- Filtro por nombre accesible (name) ---
    # "name" busca en: aria-label, aria-labelledby, contenido de texto,
    # title attribute, o label asociado
    boton_login = page.get_by_role("button", name="Login")

    # --- name con coincidencia exacta (exact=True) ---
    # Por defecto, name hace match parcial e insensible a mayúsculas
    boton_exacto = page.get_by_role("button", name="Login", exact=True)

    # --- Filtro por estado: checked ---
    checkbox_marcado = page.get_by_role("checkbox", checked=True)
    checkbox_desmarcado = page.get_by_role("checkbox", checked=False)

    # --- Filtro por estado: expanded ---
    menu_abierto = page.get_by_role("button", expanded=True)
    menu_cerrado = page.get_by_role("button", expanded=False)

    # --- Filtro por estado: disabled ---
    boton_deshabilitado = page.get_by_role("button", disabled=True)
    boton_habilitado = page.get_by_role("button", disabled=False)

    # --- Filtro por estado: selected ---
    tab_activa = page.get_by_role("tab", selected=True)

    # --- Filtro por nivel (solo para headings) ---
    h1 = page.get_by_role("heading", level=1)
    h2 = page.get_by_role("heading", level=2)
    h3_bienvenida = page.get_by_role("heading", level=3, name="Login Page")

    # --- Filtro por estado: pressed (toggle buttons) ---
    boton_activo = page.get_by_role("button", pressed=True)

    # --- Incluir elementos ocultos ---
    # Por defecto, get_by_role excluye aria-hidden="true"
    oculto = page.get_by_role("button", include_hidden=True)</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚠️ ¿Cómo se calcula el "name" accesible?</h4>
            <p>Playwright sigue el algoritmo W3C de "Accessible Name Computation". El nombre
            se resuelve en este orden de prioridad:</p>
            <ol>
                <li><code>aria-labelledby</code> — Referencia a otro elemento</li>
                <li><code>aria-label</code> — Etiqueta directa</li>
                <li><code>&lt;label&gt;</code> — Elemento label asociado (para inputs)</li>
                <li>Contenido de texto — El texto visible del elemento</li>
                <li><code>title</code> — Atributo title del elemento</li>
                <li><code>placeholder</code> — Solo para inputs/textareas</li>
            </ol>
        </div>

        <h3>🗺️ Mapeo HTML → Rol ARIA implícito</h3>
        <p>Cada elemento HTML tiene un rol ARIA implícito. Usar el elemento HTML correcto
        es la base de la accesibilidad — no necesitas agregar <code>role="..."</code> si usas
        el elemento semántico adecuado.</p>

        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #e8f5e9;">
                <th style="padding: 8px; border: 1px solid #ddd;">Elemento HTML</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Rol ARIA implícito</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Playwright</th>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>&lt;button&gt;</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>button</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("button")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>&lt;a href="..."&gt;</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>link</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("link")</code></td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>&lt;h1&gt;</code> a <code>&lt;h6&gt;</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>heading</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("heading", level=1)</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>&lt;input type="text"&gt;</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>textbox</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("textbox")</code></td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>&lt;input type="checkbox"&gt;</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>checkbox</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("checkbox")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>&lt;input type="radio"&gt;</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>radio</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("radio")</code></td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>&lt;select&gt;</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>combobox</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("combobox")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>&lt;textarea&gt;</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>textbox</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("textbox")</code></td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>&lt;img&gt;</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>img</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("img", name="Logo")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>&lt;nav&gt;</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>navigation</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("navigation")</code></td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>&lt;main&gt;</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>main</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("main")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>&lt;header&gt;</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>banner</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("banner")</code></td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>&lt;footer&gt;</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>contentinfo</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("contentinfo")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>&lt;table&gt;</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>table</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("table")</code></td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>&lt;tr&gt;</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>row</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("row")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>&lt;td&gt;</code> / <code>&lt;th&gt;</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>cell</code> / <code>columnheader</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("cell")</code></td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>&lt;ul&gt;</code> / <code>&lt;ol&gt;</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>list</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("list")</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>&lt;li&gt;</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>listitem</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("listitem")</code></td>
            </tr>
        </table>

        <h3>🧪 Verificando accesibilidad con expect()</h3>
        <p>Playwright permite verificar atributos ARIA directamente con assertions, lo que
        te permite validar accesibilidad como parte de tus tests funcionales.</p>

        <pre><code class="python">from playwright.sync_api import Page, expect

def test_verificar_atributos_aria(page: Page):
    page.goto("https://the-internet.herokuapp.com/checkboxes")

    # Verificar que un checkbox tiene el rol correcto
    checkboxes = page.get_by_role("checkbox")
    expect(checkboxes).to_have_count(2)

    # Verificar estado checked con get_by_role
    checkbox_marcado = page.get_by_role("checkbox", checked=True)
    expect(checkbox_marcado).to_have_count(1)

    # Verificar atributos ARIA con to_have_attribute
    checkbox = checkboxes.first
    checkbox.check()
    expect(checkbox).to_be_checked()


def test_verificar_aria_label(page: Page):
    page.goto("https://ejemplo.com/formulario")

    # Verificar aria-label
    boton_cerrar = page.get_by_role("button", name="Cerrar")
    expect(boton_cerrar).to_have_attribute("aria-label", "Cerrar")

    # Verificar aria-expanded
    menu = page.get_by_role("button", name="Menú")
    expect(menu).to_have_attribute("aria-expanded", "false")
    menu.click()
    expect(menu).to_have_attribute("aria-expanded", "true")

    # Verificar aria-disabled
    boton_enviar = page.get_by_role("button", name="Enviar")
    expect(boton_enviar).to_have_attribute("aria-disabled", "true")


def test_verificar_heading_level(page: Page):
    page.goto("https://the-internet.herokuapp.com/login")

    # Verificar que existe un heading nivel 2
    h2 = page.get_by_role("heading", level=2)
    expect(h2).to_be_visible()
    expect(h2).to_have_text("Login Page")</code></pre>

        <h3>📸 Accessibility Snapshots</h3>
        <p>Playwright puede capturar una representación del árbol de accesibilidad de la página,
        útil para debugging y para entender cómo el navegador "ve" tu aplicación.</p>

        <pre><code class="python">def test_accessibility_snapshot(page: Page):
    page.goto("https://the-internet.herokuapp.com/login")

    # Capturar el snapshot de accesibilidad
    snapshot = page.accessibility.snapshot()

    # El snapshot es un diccionario con la estructura del árbol
    print(f"Rol raíz: {snapshot['role']}")
    print(f"Nombre: {snapshot.get('name', 'Sin nombre')}")

    # Recorrer hijos para inspeccionar la estructura
    for hijo in snapshot.get("children", []):
        print(f"  - {hijo['role']}: {hijo.get('name', '')}")

    # Filtrar por rol específico
    def buscar_por_rol(nodo, rol_buscado, resultados=None):
        if resultados is None:
            resultados = []
        if nodo.get("role") == rol_buscado:
            resultados.append(nodo)
        for hijo in nodo.get("children", []):
            buscar_por_rol(hijo, rol_buscado, resultados)
        return resultados

    # Encontrar todos los textbox en la página
    textboxes = buscar_por_rol(snapshot, "textbox")
    print(f"Textboxes encontrados: {len(textboxes)}")
    for tb in textboxes:
        print(f"  - {tb.get('name', 'Sin nombre')}")

    # Snapshot con interesante=True filtra solo elementos relevantes
    snapshot_filtrado = page.accessibility.snapshot(interesting_only=True)</code></pre>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip: Usar snapshot para encontrar roles</h4>
            <p>Si no sabes qué rol tiene un elemento, captura un <code>accessibility.snapshot()</code>
            y revisa la estructura. Es mucho más confiable que adivinar el rol basándose en el HTML.</p>
        </div>

        <h3>💪 Beneficios de los localizadores semánticos</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #c8e6c9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Beneficio</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripción</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">Sobreviven refactoring CSS</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Cambiar clases o IDs no rompe el test</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>.btn-primary</code> → <code>.button--main</code> = test intacto</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">Auto-documentados</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">El selector describe la intención</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("button", name="Guardar")</code></td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">Validan accesibilidad</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Si el test pasa, la app es accesible</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Un lector de pantalla encontrará el mismo botón</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">Framework-agnostic</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Funcionan sin importar React/Vue/Angular</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">No dependen de <code>data-testid</code> específicos</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">Usan estándar W3C</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Basados en ARIA, no en convenciones propias</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Los roles son universales entre navegadores</td>
                </tr>
            </table>
        </div>

        <h3>✅ Mejores prácticas</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>1. Usa HTML semántico primero</h4>
            <pre><code class="python"># MAL — div genérico con rol explícito
# &lt;div role="button" onclick="enviar()"&gt;Enviar&lt;/div&gt;

# BIEN — elemento HTML semántico (rol implícito)
# &lt;button onclick="enviar()"&gt;Enviar&lt;/button&gt;</code></pre>

            <h4>2. Agrega aria-label para componentes custom</h4>
            <pre><code class="python"># El icono no tiene texto visible — necesita aria-label
# &lt;button class="icon-btn" aria-label="Cerrar modal"&gt;
#   &lt;svg&gt;...&lt;/svg&gt;
# &lt;/button&gt;

# Ahora Playwright puede encontrarlo:
page.get_by_role("button", name="Cerrar modal")</code></pre>

            <h4>3. Asocia labels con inputs</h4>
            <pre><code class="python"># MAL — input sin label asociado
# &lt;input type="email" placeholder="tu@email.com"&gt;

# BIEN — label explícito con for/id
# &lt;label for="email"&gt;Correo electrónico&lt;/label&gt;
# &lt;input id="email" type="email"&gt;

# Playwright lo encuentra por el label:
page.get_by_label("Correo electrónico")</code></pre>

            <h4>4. Prefiere get_by_role sobre CSS para interacción</h4>
            <pre><code class="python"># ❌ Frágil — depende de clase CSS
page.locator(".submit-btn").click()

# ❌ Mejor, pero depende de data-testid
page.locator("[data-testid='submit']").click()

# ✅ Ideal — semántico y resiliente
page.get_by_role("button", name="Enviar").click()</code></pre>

            <h4>5. Verifica estados ARIA en assertions</h4>
            <pre><code class="python"># No solo verificar visibilidad, también el estado accesible
def test_toggle_menu(page: Page):
    menu = page.get_by_role("button", name="Menú")

    # Verificar estado cerrado
    expect(menu).to_have_attribute("aria-expanded", "false")

    menu.click()

    # Verificar estado abierto
    expect(menu).to_have_attribute("aria-expanded", "true")

    # Verificar que el panel es visible
    panel = page.get_by_role("menu")
    expect(panel).to_be_visible()</code></pre>
        </div>

        <h3>🔄 Otros localizadores semánticos de Playwright</h3>
        <p>Además de <code>get_by_role()</code>, Playwright ofrece otros localizadores semánticos:</p>

        <pre><code class="python">def test_otros_localizadores_semanticos(page: Page):
    page.goto("https://the-internet.herokuapp.com/login")

    # get_by_label() — Busca por el texto del label asociado
    username = page.get_by_label("Username")
    username.fill("tomsmith")

    # get_by_placeholder() — Busca por placeholder
    campo = page.get_by_placeholder("Escribe tu nombre")

    # get_by_text() — Busca por texto visible
    mensaje = page.get_by_text("You logged into a secure area!")

    # get_by_alt_text() — Busca imágenes por alt text
    logo = page.get_by_alt_text("Logo de la empresa")

    # get_by_title() — Busca por atributo title
    tooltip = page.get_by_title("Información adicional")

    # Todos estos son más robustos que selectores CSS
    # porque se basan en el contenido semántico, no la estructura</code></pre>

        <h3>🎯 Ejercicio práctico: refactorizar de CSS a semántico</h3>
        <p>Dado el siguiente test que usa CSS selectors, refactorízalo a localizadores semánticos y ARIA.</p>

        <h4>Test original con CSS (frágil)</h4>
        <pre><code class="python"># test_login_css.py — Version con CSS selectors
def test_login_con_css(page: Page):
    page.goto("https://the-internet.herokuapp.com/login")

    # CSS selectors — frágiles
    page.locator("#username").fill("tomsmith")
    page.locator("#password").fill("SuperSecretPassword!")
    page.locator("button.radius").click()

    # Verificar con CSS
    assert "secure" in page.url
    assert page.locator("#flash").is_visible()
    page.locator("a.button").click()
    assert "login" in page.url</code></pre>

        <h4>Test refactorizado con localizadores semánticos</h4>
        <pre><code class="python"># test_login_semantico.py — Version con localizadores semánticos
from playwright.sync_api import Page, expect

def test_login_semantico(page: Page):
    page.goto("https://the-internet.herokuapp.com/login")

    # 1. Verificar que estamos en la página de login
    expect(page.get_by_role("heading", level=2)).to_have_text("Login Page")

    # 2. Llenar formulario con get_by_label
    page.get_by_label("Username").fill("tomsmith")
    page.get_by_label("Password").fill("SuperSecretPassword!")

    # 3. Click en botón por rol
    page.get_by_role("button", name="Login").click()

    # 4. Verificar login exitoso
    expect(page).to_have_url("**/secure")
    expect(page.get_by_text("You logged into a secure area!")).to_be_visible()

    # 5. Logout con link semántico
    page.get_by_role("link", name="Logout").click()

    # 6. Verificar que volvemos al login
    expect(page).to_have_url("**/login")
    expect(page.get_by_role("heading", level=2)).to_have_text("Login Page")</code></pre>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔍 Comparación lado a lado</h4>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Acción</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">CSS (frágil)</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Semántico (robusto)</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">Username</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>locator("#username")</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_label("Username")</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">Password</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>locator("#password")</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_label("Password")</code></td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">Login button</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>locator("button.radius")</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("button", name="Login")</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">Flash message</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>locator("#flash")</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_text("You logged...")</code></td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">Logout</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>locator("a.button")</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>get_by_role("link", name="Logout")</code></td>
                </tr>
            </table>
        </div>

        <h4>Tu turno: refactoriza este test</h4>
        <ol>
            <li>Toma el test de CSS y reescríbelo usando <strong>solo</strong> localizadores semánticos</li>
            <li>Agrega verificaciones de heading levels con <code>get_by_role("heading", level=N)</code></li>
            <li>Verifica que el formulario de login tiene los labels correctos con <code>get_by_label()</code></li>
            <li>Usa <code>expect()</code> con <code>to_have_attribute()</code> para verificar al menos un atributo ARIA</li>
            <li>Crea un segundo test que verifique la estructura de accesibilidad de <code>/checkboxes</code>:
                <ul>
                    <li>Que la página tiene un heading</li>
                    <li>Que existen exactamente 2 checkboxes</li>
                    <li>Que uno está checked y otro no</li>
                    <li>Que toggle funciona y los estados ARIA se actualizan</li>
                </ul>
            </li>
            <li>Bonus: usa <code>page.accessibility.snapshot()</code> para inspeccionar la estructura de <code>/login</code></li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Comprender qué son los roles ARIA y cómo Playwright los utiliza</li>
                <li>Dominar <code>page.get_by_role()</code> con todas sus opciones de filtrado</li>
                <li>Conocer el mapeo entre elementos HTML y roles ARIA implícitos</li>
                <li>Verificar atributos ARIA como parte de los tests funcionales</li>
                <li>Usar accessibility snapshots para inspeccionar la estructura accesible</li>
                <li>Aplicar mejores prácticas: HTML semántico, aria-labels, labels asociados</li>
                <li>Refactorizar tests de CSS selectors a localizadores semánticos</li>
            </ul>
        </div>
    `,
    topics: ["semánticos", "accesibilidad", "aria"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_040 = LESSON_040;
}
