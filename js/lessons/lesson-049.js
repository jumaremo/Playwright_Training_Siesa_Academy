/**
 * Playwright Academy - Lección 049
 * Shadow DOM y Web Components
 * Sección 6: Interacciones Web Avanzadas
 */

const LESSON_049 = {
    id: 49,
    title: "Shadow DOM y Web Components",
    duration: "5 min",
    level: "beginner",
    section: "section-06",
    content: `
        <h2>🌑 Shadow DOM y Web Components</h2>
        <p>El Shadow DOM es una tecnología del navegador que permite encapsular estructura,
        estilos y comportamiento dentro de un componente, aislándolo del resto del documento.
        En esta lección aprenderás cómo Playwright maneja esta encapsulación de forma
        transparente y cómo interactuar con Web Components en tus tests.</p>

        <h3>🔍 ¿Qué es el Shadow DOM?</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>El <strong>Shadow DOM</strong> crea un árbol DOM separado ("shadow tree") adjunto a un
            elemento del DOM principal ("host"). Los estilos y selectores del documento principal
            <strong>no afectan</strong> al contenido dentro del shadow tree, y viceversa.</p>
            <pre><code>&lt;!-- DOM principal --&gt;
&lt;my-component&gt;        &lt;!-- Shadow Host --&gt;
  #shadow-root         &lt;!-- Shadow Root (árbol encapsulado) --&gt;
    &lt;style&gt;...&lt;/style&gt;  &lt;!-- Estilos aislados --&gt;
    &lt;div class="inner"&gt;
      &lt;input type="text"&gt;
      &lt;button&gt;Enviar&lt;/button&gt;
    &lt;/div&gt;
&lt;/my-component&gt;</code></pre>
            <p><strong>Analogía:</strong> Piensa en el Shadow DOM como un iframe ligero: el contenido
            interno está protegido del exterior, pero sin la sobrecarga de un iframe real.</p>
        </div>

        <h3>🔓 Shadow Root: Open vs Closed</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Existen dos modos de Shadow Root:</p>
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #ffe0b2;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Modo</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Acceso JS</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Playwright</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>open</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>element.shadowRoot</code> accesible</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Penetra automáticamente</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>closed</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>element.shadowRoot</code> es <code>null</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">No puede penetrar directamente</td>
                </tr>
            </table>
        </div>
        <div class="code-tabs" data-code-id="L049-1">
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
                <pre><code class="language-python"># Así se crean shadow roots en JavaScript (para entender el contexto)
# Open: accesible desde fuera
# element.attachShadow({ mode: 'open' })

# Closed: inaccesible desde fuera
# element.attachShadow({ mode: 'closed' })</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Así se crean shadow roots en JavaScript (para entender el contexto)
// Open: accesible desde fuera
// element.attachShadow({ mode: 'open' })

// Closed: inaccesible desde fuera
// element.attachShadow({ mode: 'closed' })</code></pre>
            </div>
        </div>

        <h3>✨ Playwright y Shadow DOM: Penetración automática</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>La gran ventaja de Playwright:</strong> los selectores CSS penetran
            el Shadow DOM abierto de forma automática. No necesitas hacer nada especial
            en la mayoría de los casos.</p>
        </div>
        <div class="code-tabs" data-code-id="L049-2">
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
                <pre><code class="language-python">from playwright.sync_api import Page, expect

def test_shadow_dom_automatico(page: Page):
    page.goto("https://ejemplo.com/con-web-components")

    # Playwright busca DENTRO del Shadow DOM automáticamente
    # No importa si el input está dentro de un shadow root
    page.locator("input.search-field").fill("Playwright")

    # También funciona con click
    page.locator("button.submit-btn").click()

    # Y con assertions
    expect(page.locator(".resultado")).to_have_text("Búsqueda completada")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('shadow dom automatico', async ({ page }) => {
    await page.goto("https://ejemplo.com/con-web-components");

    // Playwright busca DENTRO del Shadow DOM automáticamente
    // No importa si el input está dentro de un shadow root
    await page.locator("input.search-field").fill("Playwright");

    // También funciona con click
    await page.locator("button.submit-btn").click();

    // Y con assertions
    await expect(page.locator(".resultado")).toHaveText("Búsqueda completada");
});</code></pre>
            </div>
        </div>

        <h3>🎯 Selectores que penetran el Shadow DOM</h3>
        <div class="code-tabs" data-code-id="L049-3">
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
                <pre><code class="language-python">def test_selectores_shadow(page: Page):
    page.goto("/componentes")

    # CSS selector - penetra shadow DOM por defecto
    page.locator("my-component input").fill("valor")

    # Texto - también penetra shadow DOM
    page.locator("text=Enviar formulario").click()

    # Role - penetra shadow DOM
    page.get_by_role("button", name="Guardar").click()

    # Test ID - penetra shadow DOM
    page.get_by_test_id("campo-email").fill("test@ejemplo.com")

    # Placeholder - penetra shadow DOM
    page.get_by_placeholder("Escribe tu nombre").fill("Juan")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('selectores shadow', async ({ page }) => {
    await page.goto("/componentes");

    // CSS selector - penetra shadow DOM por defecto
    await page.locator("my-component input").fill("valor");

    // Texto - también penetra shadow DOM
    await page.locator("text=Enviar formulario").click();

    // Role - penetra shadow DOM
    await page.getByRole("button", { name: "Guardar" }).click();

    // Test ID - penetra shadow DOM
    await page.getByTestId("campo-email").fill("test@ejemplo.com");

    // Placeholder - penetra shadow DOM
    await page.getByPlaceholder("Escribe tu nombre").fill("Juan");
});</code></pre>
            </div>
        </div>

        <h3>🔧 Penetración explícita con >> css=</h3>
        <p>En casos donde necesitas ser explícito sobre la cadena de shadow roots,
        Playwright ofrece la sintaxis <code>&gt;&gt; css=</code> para selectores encadenados:</p>
        <div class="code-tabs" data-code-id="L049-4">
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
                <pre><code class="language-python">def test_penetracion_explicita(page: Page):
    page.goto("/app-con-componentes")

    # Sintaxis de penetración explícita:
    # host >> css=selector-dentro-del-shadow

    # Buscar un input dentro del shadow root de my-form
    page.locator("my-form >> css=input.email").fill("user@test.com")

    # Encadenar múltiples niveles de shadow DOM
    # app-shell >> shadow >> nav-bar >> shadow >> button
    page.locator("app-shell >> css=nav-bar >> css=button.menu").click()

    # Combinar con otros selectores
    page.locator("my-dialog >> css=.footer >> css=button:has-text('Aceptar')").click()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('penetracion explicita', async ({ page }) => {
    await page.goto("/app-con-componentes");

    // Sintaxis de penetración explícita:
    // host >> css=selector-dentro-del-shadow

    // Buscar un input dentro del shadow root de my-form
    await page.locator("my-form >> css=input.email").fill("user@test.com");

    // Encadenar múltiples niveles de shadow DOM
    // app-shell >> shadow >> nav-bar >> shadow >> button
    await page.locator("app-shell >> css=nav-bar >> css=button.menu").click();

    // Combinar con otros selectores
    await page.locator("my-dialog >> css=.footer >> css=button:has-text('Aceptar')").click();
});</code></pre>
            </div>
        </div>

        <h3>🧩 Web Components: Elementos personalizados</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Los <strong>Web Components</strong> combinan Custom Elements, Shadow DOM y
            HTML Templates para crear componentes reutilizables nativos del navegador.</p>
            <p>Componentes clave:</p>
            <ul>
                <li><strong>Custom Elements:</strong> etiquetas HTML propias (<code>&lt;my-button&gt;</code>)</li>
                <li><strong>Shadow DOM:</strong> encapsulación de estilos y estructura</li>
                <li><strong>Slots:</strong> puntos de inserción para contenido externo</li>
                <li><strong>Templates:</strong> fragmentos de HTML reutilizables</li>
            </ul>
        </div>
        <div class="code-tabs" data-code-id="L049-5">
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
                <pre><code class="language-python">def test_web_components(page: Page):
    page.goto("/app")

    # Interactuar con un custom element
    # <my-input label="Email" required>
    page.locator("my-input[label='Email'] >> css=input").fill("test@mail.com")

    # Interactuar con un slot
    # <my-card>
    #   <span slot="title">Mi Título</span>   <-- contenido slotted
    #   <p slot="body">Contenido...</p>
    # </my-card>
    expect(page.locator("my-card span[slot='title']")).to_have_text("Mi Título")

    # Verificar atributos del custom element
    expect(page.locator("my-input[label='Email']")).to_have_attribute("required", "")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('web components', async ({ page }) => {
    await page.goto("/app");

    // Interactuar con un custom element
    // <my-input label="Email" required>
    await page.locator("my-input[label='Email'] >> css=input").fill("test@mail.com");

    // Interactuar con un slot
    // <my-card>
    //   <span slot="title">Mi Título</span>   <-- contenido slotted
    //   <p slot="body">Contenido...</p>
    // </my-card>
    await expect(page.locator("my-card span[slot='title']")).toHaveText("Mi Título");

    // Verificar atributos del custom element
    await expect(page.locator("my-input[label='Email']")).toHaveAttribute("required", "");
});</code></pre>
            </div>
        </div>

        <h3>📚 Librerías de Web Components populares</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Librería</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Usa Shadow DOM</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Tips para testing</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><strong>Shoelace</strong></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Sí (open)</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Playwright penetra automáticamente</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><strong>Lit</strong></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Sí (open)</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Usar selectores CSS normales</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><strong>Stencil</strong></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Sí (open)</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Soporta data-testid nativamente</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><strong>FAST (Microsoft)</strong></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Sí (open)</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Usar <code>&gt;&gt; css=</code> para anidamiento profundo</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><strong>Polymer (legacy)</strong></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Sí (open)</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Similar a Lit (su sucesor)</td>
                </tr>
            </table>
        </div>

        <h3>⚠️ Limitaciones: Shadow DOM cerrado</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Problema:</strong> Cuando un componente usa <code>mode: 'closed'</code>,
            ni JavaScript ni Playwright pueden acceder al shadow root directamente.</p>
            <p><strong>Solución:</strong> Usar <code>evaluate()</code> para acceder programáticamente
            cuando el componente expone alguna referencia interna.</p>
        </div>
        <div class="code-tabs" data-code-id="L049-6">
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
                <pre><code class="language-python">def test_shadow_dom_cerrado(page: Page):
    page.goto("/app-con-closed-shadow")

    # Si el componente guarda una referencia interna al shadow root,
    # podemos acceder vía evaluate()
    page.evaluate("""
        () => {
            // Algunos componentes guardan _shadowRoot internamente
            const host = document.querySelector('closed-component');

            // Opción 1: Si el componente expone una API
            host.setValue('nuevo valor');

            // Opción 2: Monkey-patch attachShadow antes de cargar
            // (útil en setup del test)
        }
    """)

    # Alternativa: interceptar attachShadow antes de que el componente cargue
    page.add_init_script("""
        const originalAttachShadow = Element.prototype.attachShadow;
        Element.prototype.attachShadow = function(options) {
            // Forzar modo 'open' para testing
            return originalAttachShadow.call(this, { ...options, mode: 'open' });
        };
    """)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('shadow dom cerrado', async ({ page }) => {
    await page.goto("/app-con-closed-shadow");

    // Si el componente guarda una referencia interna al shadow root,
    // podemos acceder vía evaluate()
    await page.evaluate(() => {
        // Algunos componentes guardan _shadowRoot internamente
        const host = document.querySelector('closed-component');

        // Opción 1: Si el componente expone una API
        (host as any).setValue('nuevo valor');

        // Opción 2: Monkey-patch attachShadow antes de cargar
        // (útil en setup del test)
    });

    // Alternativa: interceptar attachShadow antes de que el componente cargue
    await page.addInitScript(() => {
        const originalAttachShadow = Element.prototype.attachShadow;
        Element.prototype.attachShadow = function(options) {
            // Forzar modo 'open' para testing
            return originalAttachShadow.call(this, { ...options, mode: 'open' });
        };
    });
});</code></pre>
            </div>
        </div>

        <h3>🛠️ Acceso programático con evaluate()</h3>
        <div class="code-tabs" data-code-id="L049-7">
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
                <pre><code class="language-python">def test_evaluate_shadow_root(page: Page):
    page.goto("/app")

    # Leer contenido dentro del shadow DOM
    texto = page.evaluate("""
        () => {
            const host = document.querySelector('my-component');
            const shadow = host.shadowRoot;
            return shadow.querySelector('.mensaje').textContent;
        }
    """)
    assert texto == "Bienvenido"

    # Modificar un valor dentro del shadow DOM
    page.evaluate("""
        () => {
            const host = document.querySelector('my-input');
            const shadow = host.shadowRoot;
            const input = shadow.querySelector('input');
            input.value = 'nuevo valor';
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    """)

    # Contar elementos dentro del shadow DOM
    cantidad = page.evaluate("""
        () => {
            const host = document.querySelector('my-list');
            const shadow = host.shadowRoot;
            return shadow.querySelectorAll('li').length;
        }
    """)
    assert cantidad == 5</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('evaluate shadow root', async ({ page }) => {
    await page.goto("/app");

    // Leer contenido dentro del shadow DOM
    const texto = await page.evaluate(() => {
        const host = document.querySelector('my-component');
        const shadow = host!.shadowRoot;
        return shadow!.querySelector('.mensaje')!.textContent;
    });
    expect(texto).toBe("Bienvenido");

    // Modificar un valor dentro del shadow DOM
    await page.evaluate(() => {
        const host = document.querySelector('my-input');
        const shadow = host!.shadowRoot;
        const input = shadow!.querySelector('input')!;
        input.value = 'nuevo valor';
        input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Contar elementos dentro del shadow DOM
    const cantidad = await page.evaluate(() => {
        const host = document.querySelector('my-list');
        const shadow = host!.shadowRoot;
        return shadow!.querySelectorAll('li').length;
    });
    expect(cantidad).toBe(5);
});</code></pre>
            </div>
        </div>

        <h3>🧪 Ejemplo completo: testing de una página con Web Components</h3>
        <div class="code-tabs" data-code-id="L049-8">
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
                <pre><code class="language-python">from playwright.sync_api import Page, expect
import pytest

class TestWebComponents:
    """Suite de tests para una aplicación con Web Components."""

    def test_custom_input(self, page: Page):
        """Verificar interacción con un input personalizado."""
        page.goto("/formulario-custom")

        # <custom-input label="Nombre" placeholder="Tu nombre">
        #   #shadow-root (open)
        #     <label>Nombre</label>
        #     <input placeholder="Tu nombre">
        # </custom-input>

        # Playwright penetra el shadow DOM automáticamente
        nombre = page.locator("custom-input[label='Nombre'] input")
        nombre.fill("María García")
        expect(nombre).to_have_value("María García")

    def test_custom_dropdown(self, page: Page):
        """Verificar interacción con un dropdown personalizado."""
        page.goto("/formulario-custom")

        # Abrir el dropdown custom
        page.locator("custom-select >> css=.trigger").click()

        # Seleccionar una opción dentro del shadow DOM
        page.locator("custom-select >> css=.option[data-value='colombia']").click()

        # Verificar la selección
        valor = page.locator("custom-select >> css=.selected-text")
        expect(valor).to_have_text("Colombia")

    def test_custom_modal(self, page: Page):
        """Verificar un modal implementado como Web Component."""
        page.goto("/dashboard")

        # Abrir modal
        page.get_by_role("button", name="Abrir configuración").click()

        # El modal es un Web Component con shadow DOM
        modal = page.locator("custom-modal")
        expect(modal).to_be_visible()

        # Interactuar con contenido del modal
        page.locator("custom-modal >> css=input.config-name").fill("Mi Config")
        page.locator("custom-modal >> css=button.save").click()

        # Verificar que el modal se cerró
        expect(modal).to_be_hidden()

    def test_componentes_anidados(self, page: Page):
        """Verificar componentes Web anidados (shadow DOM dentro de shadow DOM)."""
        page.goto("/app")

        # <app-layout>
        #   #shadow-root
        #     <app-sidebar>
        #       #shadow-root
        #         <nav>
        #           <a href="/dashboard">Dashboard</a>

        # Playwright maneja el anidamiento automáticamente
        page.locator("app-layout app-sidebar a:has-text('Dashboard')").click()
        expect(page).to_have_url("**/dashboard")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test.describe('Web Components', () => {
    // Suite de tests para una aplicación con Web Components.

    test('custom input', async ({ page }) => {
        // Verificar interacción con un input personalizado.
        await page.goto("/formulario-custom");

        // <custom-input label="Nombre" placeholder="Tu nombre">
        //   #shadow-root (open)
        //     <label>Nombre</label>
        //     <input placeholder="Tu nombre">
        // </custom-input>

        // Playwright penetra el shadow DOM automáticamente
        const nombre = page.locator("custom-input[label='Nombre'] input");
        await nombre.fill("María García");
        await expect(nombre).toHaveValue("María García");
    });

    test('custom dropdown', async ({ page }) => {
        // Verificar interacción con un dropdown personalizado.
        await page.goto("/formulario-custom");

        // Abrir el dropdown custom
        await page.locator("custom-select >> css=.trigger").click();

        // Seleccionar una opción dentro del shadow DOM
        await page.locator("custom-select >> css=.option[data-value='colombia']").click();

        // Verificar la selección
        const valor = page.locator("custom-select >> css=.selected-text");
        await expect(valor).toHaveText("Colombia");
    });

    test('custom modal', async ({ page }) => {
        // Verificar un modal implementado como Web Component.
        await page.goto("/dashboard");

        // Abrir modal
        await page.getByRole("button", { name: "Abrir configuración" }).click();

        // El modal es un Web Component con shadow DOM
        const modal = page.locator("custom-modal");
        await expect(modal).toBeVisible();

        // Interactuar con contenido del modal
        await page.locator("custom-modal >> css=input.config-name").fill("Mi Config");
        await page.locator("custom-modal >> css=button.save").click();

        // Verificar que el modal se cerró
        await expect(modal).toBeHidden();
    });

    test('componentes anidados', async ({ page }) => {
        // Verificar componentes Web anidados (shadow DOM dentro de shadow DOM).
        await page.goto("/app");

        // <app-layout>
        //   #shadow-root
        //     <app-sidebar>
        //       #shadow-root
        //         <nav>
        //           <a href="/dashboard">Dashboard</a>

        // Playwright maneja el anidamiento automáticamente
        await page.locator("app-layout app-sidebar a:has-text('Dashboard')").click();
        await expect(page).toHaveURL("**/dashboard");
    });
});</code></pre>
            </div>
        </div>

        <h3>📊 Comparación: Shadow DOM en diferentes frameworks de testing</h3>
        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #e0e0e0;">
                <th style="padding: 8px; border: 1px solid #ddd;">Característica</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Playwright</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Selenium</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Cypress</th>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Penetración automática</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Sí (por defecto)</td>
                <td style="padding: 6px; border: 1px solid #ddd;">No (requiere getShadowRoot())</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Parcial (.shadow())</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;">Shadow DOM anidado</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Automático</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Manual (cadena de getShadowRoot)</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Encadenar .shadow()</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Closed shadow DOM</td>
                <td style="padding: 6px; border: 1px solid #ddd;">evaluate() + init script</td>
                <td style="padding: 6px; border: 1px solid #ddd;">executeScript()</td>
                <td style="padding: 6px; border: 1px solid #ddd;">No soportado</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;">Selectores de texto</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Penetran shadow DOM</td>
                <td style="padding: 6px; border: 1px solid #ddd;">No penetran</td>
                <td style="padding: 6px; border: 1px solid #ddd;">No penetran</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Selectores por role</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Penetran shadow DOM</td>
                <td style="padding: 6px; border: 1px solid #ddd;">No disponible</td>
                <td style="padding: 6px; border: 1px solid #ddd;">No penetran</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;">Configuración necesaria</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Ninguna</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Código adicional</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Plugin o config</td>
            </tr>
        </table>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Practica la interacción con Shadow DOM usando este escenario:</p>
        </div>
        <ol>
            <li>Navega a una página con Web Components (puedes usar <code>https://nicepage.com/</code>
                o cualquier app con Shoelace/Lit)</li>
            <li>Identifica elementos dentro de Shadow DOM con DevTools (busca <code>#shadow-root</code>)</li>
            <li>Escribe un test que interactúe con un input dentro de un Web Component:
                <div class="code-tabs" data-code-id="L049-9">
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
                <pre><code class="language-python">def test_shadow_dom_input(page: Page):
    page.goto("URL_CON_WEB_COMPONENTS")

    # Localizar el input dentro del shadow DOM
    campo = page.locator("nombre-del-componente input")
    campo.fill("Texto de prueba")
    expect(campo).to_have_value("Texto de prueba")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('shadow dom input', async ({ page }) => {
    await page.goto("URL_CON_WEB_COMPONENTS");

    // Localizar el input dentro del shadow DOM
    const campo = page.locator("nombre-del-componente input");
    await campo.fill("Texto de prueba");
    await expect(campo).toHaveValue("Texto de prueba");
});</code></pre>
            </div>
        </div>
            </li>
            <li>Prueba la sintaxis explícita <code>&gt;&gt; css=</code> para un componente anidado</li>
            <li>Usa <code>evaluate()</code> para leer un valor del shadow root:
                <div class="code-tabs" data-code-id="L049-10">
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
                <pre><code class="language-python">valor = page.evaluate("""
    () => {
        const host = document.querySelector('mi-componente');
        return host.shadowRoot.querySelector('.valor').textContent;
    }
""")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">const valor = await page.evaluate(() => {
    const host = document.querySelector('mi-componente');
    return host!.shadowRoot!.querySelector('.valor')!.textContent;
});</code></pre>
            </div>
        </div>
            </li>
            <li>Experimenta con <code>add_init_script()</code> para forzar shadow roots abiertos</li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Entender qué es el Shadow DOM y cómo encapsula componentes</li>
                <li>Aprovechar la penetración automática de Playwright en shadow roots abiertos</li>
                <li>Usar la sintaxis <code>&gt;&gt; css=</code> para penetración explícita</li>
                <li>Interactuar con Web Components: custom elements, slots y shadow roots</li>
                <li>Manejar shadow DOM cerrado con <code>evaluate()</code> y <code>add_init_script()</code></li>
                <li>Conocer las diferencias de soporte de Shadow DOM entre frameworks de testing</li>
            </ul>
        </div>
    `,
    topics: ["shadow-dom", "web-components"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_049 = LESSON_049;
}
