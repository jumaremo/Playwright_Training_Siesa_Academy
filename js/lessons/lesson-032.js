/**
 * Playwright Academy - Lección 032
 * Dropdowns y componentes UI
 * Sección 4: Interacciones Web Fundamentales
 */

const LESSON_032 = {
    id: 32,
    title: "Dropdowns y componentes UI",
    duration: "5 min",
    level: "beginner",
    section: "section-04",
    content: `
        <h2>🎛️ Dropdowns y componentes UI</h2>
        <p>Las aplicaciones web modernas utilizan una variedad de componentes interactivos:
        dropdowns nativos y personalizados, autocompletados, date pickers, sliders y más.
        Playwright ofrece métodos específicos para interactuar con cada tipo.</p>

        <h3>📋 Select nativo: page.select_option()</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>El método <code>select_option()</code> funciona con elementos <code>&lt;select&gt;</code>
            nativos de HTML. Puedes seleccionar por <strong>valor</strong>, <strong>label</strong>
            o <strong>índice</strong>.</p>
        </div>
        <div class="code-tabs" data-code-id="L032-1">
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

def test_select_nativo(page: Page):
    page.goto("https://the-internet.herokuapp.com/dropdown")

    # Seleccionar por label (texto visible)
    page.select_option("#dropdown", label="Option 1")

    # Seleccionar por value (atributo value)
    page.select_option("#dropdown", value="2")

    # Seleccionar por índice (0-indexed)
    page.select_option("#dropdown", index=1)  # "Option 1"

    # Verificar la opción seleccionada
    expect(page.locator("#dropdown")).to_have_value("1")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('select nativo', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dropdown');

    // Seleccionar por label (texto visible)
    await page.selectOption('#dropdown', { label: 'Option 1' });

    // Seleccionar por value (atributo value)
    await page.selectOption('#dropdown', '2');

    // Seleccionar por índice (0-indexed)
    await page.selectOption('#dropdown', { index: 1 }); // "Option 1"

    // Verificar la opción seleccionada
    await expect(page.locator('#dropdown')).toHaveValue('1');
});</code></pre>
            </div>
        </div>

        <h3>📑 Multi-select: pasar arrays</h3>
        <div class="code-tabs" data-code-id="L032-2">
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
                <pre><code class="language-python">def test_multi_select(page: Page):
    page.goto("/mi-app/formulario")

    # Seleccionar múltiples opciones por value
    page.select_option("#idiomas", value=["es", "en", "fr"])

    # Seleccionar múltiples por label
    page.select_option("#habilidades", label=["Python", "JavaScript", "SQL"])

    # Mezclar criterios
    page.select_option("#categorias", [
        {"value": "cat1"},
        {"label": "Categoría 3"},
        {"index": 4}
    ])</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('multi select', async ({ page }) => {
    await page.goto('/mi-app/formulario');

    // Seleccionar múltiples opciones por value
    await page.selectOption('#idiomas', ['es', 'en', 'fr']);

    // Seleccionar múltiples por label
    await page.selectOption('#habilidades', [
        { label: 'Python' }, { label: 'JavaScript' }, { label: 'SQL' }
    ]);

    // Mezclar criterios
    await page.selectOption('#categorias', [
        { value: 'cat1' },
        { label: 'Categoría 3' },
        { index: 4 }
    ]);
});</code></pre>
            </div>
        </div>

        <h3>🔍 Obtener la opción seleccionada</h3>
        <div class="code-tabs" data-code-id="L032-3">
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
                <pre><code class="language-python">def test_obtener_seleccion(page: Page):
    page.goto("https://the-internet.herokuapp.com/dropdown")
    page.select_option("#dropdown", label="Option 2")

    # Obtener el value del option seleccionado
    valor = page.locator("#dropdown").input_value()
    print(f"Value seleccionado: {valor}")  # "2"

    # Obtener el texto visible del option seleccionado
    texto = page.locator("#dropdown option:checked").text_content()
    print(f"Texto seleccionado: {texto}")  # "Option 2"

    # Verificar con expect
    expect(page.locator("#dropdown")).to_have_value("2")

    # Para multi-select: obtener todas las seleccionadas
    seleccionadas = page.locator("#multi option:checked")
    textos = seleccionadas.all_text_contents()
    print(f"Seleccionadas: {textos}")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('obtener seleccion', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dropdown');
    await page.selectOption('#dropdown', { label: 'Option 2' });

    // Obtener el value del option seleccionado
    const valor = await page.locator('#dropdown').inputValue();
    console.log(\`Value seleccionado: \${valor}\`); // "2"

    // Obtener el texto visible del option seleccionado
    const texto = await page.locator('#dropdown option:checked').textContent();
    console.log(\`Texto seleccionado: \${texto}\`); // "Option 2"

    // Verificar con expect
    await expect(page.locator('#dropdown')).toHaveValue('2');

    // Para multi-select: obtener todas las seleccionadas
    const seleccionadas = page.locator('#multi option:checked');
    const textos = await seleccionadas.allTextContents();
    console.log(\`Seleccionadas: \${textos}\`);
});</code></pre>
            </div>
        </div>

        <h3>🎨 Dropdowns personalizados (no nativos)</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Importante:</strong> Muchas aplicaciones modernas NO usan <code>&lt;select&gt;</code>
            nativo. En su lugar, usan <code>&lt;div&gt;</code> con JavaScript para crear dropdowns
            personalizados. Para estos, <code>select_option()</code> NO funciona.</p>
        </div>
        <div class="code-tabs" data-code-id="L032-4">
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
                <pre><code class="language-python">def test_dropdown_custom(page: Page):
    page.goto("/mi-app/dashboard")

    # Paso 1: Hacer clic para abrir el dropdown
    page.locator(".dropdown-trigger").click()

    # Paso 2: Esperar a que las opciones sean visibles
    page.locator(".dropdown-menu").wait_for(state="visible")

    # Paso 3: Hacer clic en la opción deseada
    page.locator(".dropdown-menu .option", has_text="Colombia").click()

    # Verificar selección
    expect(page.locator(".dropdown-trigger")).to_have_text("Colombia")


def test_dropdown_con_busqueda(page: Page):
    """Dropdown que permite escribir para filtrar opciones."""
    page.goto("/mi-app/formulario")

    # Abrir el dropdown
    page.locator(".select-container").click()

    # Escribir para filtrar
    page.locator(".select-container input").fill("Colom")

    # Esperar resultados filtrados y seleccionar
    page.locator(".select-options .option", has_text="Colombia").click()

    expect(page.locator(".select-container .selected")).to_have_text("Colombia")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('dropdown custom', async ({ page }) => {
    await page.goto('/mi-app/dashboard');

    // Paso 1: Hacer clic para abrir el dropdown
    await page.locator('.dropdown-trigger').click();

    // Paso 2: Esperar a que las opciones sean visibles
    await page.locator('.dropdown-menu').waitFor({ state: 'visible' });

    // Paso 3: Hacer clic en la opción deseada
    await page.locator('.dropdown-menu .option').filter({ hasText: 'Colombia' }).click();

    // Verificar selección
    await expect(page.locator('.dropdown-trigger')).toHaveText('Colombia');
});


test('dropdown con busqueda', async ({ page }) => {
    // Dropdown que permite escribir para filtrar opciones
    await page.goto('/mi-app/formulario');

    // Abrir el dropdown
    await page.locator('.select-container').click();

    // Escribir para filtrar
    await page.locator('.select-container input').fill('Colom');

    // Esperar resultados filtrados y seleccionar
    await page.locator('.select-options .option').filter({ hasText: 'Colombia' }).click();

    await expect(page.locator('.select-container .selected')).toHaveText('Colombia');
});</code></pre>
            </div>
        </div>

        <h3>🔎 Autocomplete / Combobox</h3>
        <div class="code-tabs" data-code-id="L032-5">
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
                <pre><code class="language-python">def test_autocomplete(page: Page):
    page.goto("/mi-app/busqueda")

    # Escribir texto para activar sugerencias
    campo = page.locator("#campo-busqueda")
    campo.fill("play")

    # Esperar a que aparezcan las sugerencias
    sugerencias = page.locator(".sugerencias li")
    sugerencias.first.wait_for(state="visible")

    # Verificar que hay sugerencias
    total = sugerencias.count()
    print(f"Sugerencias: {total}")
    assert total > 0

    # Seleccionar la primera sugerencia
    sugerencias.first.click()

    # O seleccionar una específica
    page.locator(".sugerencias li", has_text="Playwright").click()

    # Verificar que el campo se actualizó
    expect(campo).to_have_value("Playwright")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('autocomplete', async ({ page }) => {
    await page.goto('/mi-app/busqueda');

    // Escribir texto para activar sugerencias
    const campo = page.locator('#campo-busqueda');
    await campo.fill('play');

    // Esperar a que aparezcan las sugerencias
    const sugerencias = page.locator('.sugerencias li');
    await sugerencias.first().waitFor({ state: 'visible' });

    // Verificar que hay sugerencias
    const total = await sugerencias.count();
    console.log(\`Sugerencias: \${total}\`);
    expect(total).toBeGreaterThan(0);

    // Seleccionar la primera sugerencia
    await sugerencias.first().click();

    // O seleccionar una específica
    await page.locator('.sugerencias li').filter({ hasText: 'Playwright' }).click();

    // Verificar que el campo se actualizó
    await expect(campo).toHaveValue('Playwright');
});</code></pre>
            </div>
        </div>

        <h3>📅 Date pickers: estrategias de manejo</h3>
        <div class="code-tabs" data-code-id="L032-6">
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
                <pre><code class="language-python">def test_date_picker_fill(page: Page):
    """Estrategia 1: Escribir directamente en el input."""
    page.goto("/mi-app/reserva")

    # Si el input acepta texto directo
    page.locator("#fecha").fill("2025-12-25")
    expect(page.locator("#fecha")).to_have_value("2025-12-25")


def test_date_picker_input_nativo(page: Page):
    """Estrategia 2: Usar input type=date nativo."""
    page.goto("/mi-app/formulario")

    # Para input[type="date"] nativo de HTML5
    page.fill("input[type='date']", "2025-06-15")


def test_date_picker_componente(page: Page):
    """Estrategia 3: Interactuar con el componente visual."""
    page.goto("/mi-app/calendario")

    # Abrir el date picker
    page.locator("#fecha-input").click()

    # Navegar al mes deseado
    while page.locator(".calendar-header").text_content() != "Diciembre 2025":
        page.locator(".calendar-next").click()

    # Seleccionar el día
    page.locator(".calendar-day", has_text="25").click()

    expect(page.locator("#fecha-input")).to_have_value("25/12/2025")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('date picker fill', async ({ page }) => {
    // Estrategia 1: Escribir directamente en el input
    await page.goto('/mi-app/reserva');

    // Si el input acepta texto directo
    await page.locator('#fecha').fill('2025-12-25');
    await expect(page.locator('#fecha')).toHaveValue('2025-12-25');
});


test('date picker input nativo', async ({ page }) => {
    // Estrategia 2: Usar input type=date nativo
    await page.goto('/mi-app/formulario');

    // Para input[type="date"] nativo de HTML5
    await page.fill("input[type='date']", '2025-06-15');
});


test('date picker componente', async ({ page }) => {
    // Estrategia 3: Interactuar con el componente visual
    await page.goto('/mi-app/calendario');

    // Abrir el date picker
    await page.locator('#fecha-input').click();

    // Navegar al mes deseado
    while (await page.locator('.calendar-header').textContent() !== 'Diciembre 2025') {
        await page.locator('.calendar-next').click();
    }

    // Seleccionar el día
    await page.locator('.calendar-day').filter({ hasText: '25' }).click();

    await expect(page.locator('#fecha-input')).toHaveValue('25/12/2025');
});</code></pre>
            </div>
        </div>

        <h3>🎚️ Sliders</h3>
        <div class="code-tabs" data-code-id="L032-7">
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
                <pre><code class="language-python">def test_slider_fill(page: Page):
    """Cambiar valor de un slider con fill()."""
    page.goto("https://the-internet.herokuapp.com/horizontal_slider")

    slider = page.locator("input[type='range']")

    # Establecer valor directamente
    slider.fill("3.5")
    expect(page.locator("#range")).to_have_text("3.5")


def test_slider_teclado(page: Page):
    """Mover slider con teclas de flecha."""
    page.goto("https://the-internet.herokuapp.com/horizontal_slider")

    slider = page.locator("input[type='range']")
    slider.click()  # Enfocar el slider

    # Mover con flechas del teclado
    for _ in range(5):
        slider.press("ArrowRight")

    valor = page.locator("#range").text_content()
    print(f"Valor actual: {valor}")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('slider fill', async ({ page }) => {
    // Cambiar valor de un slider con fill()
    await page.goto('https://the-internet.herokuapp.com/horizontal_slider');

    const slider = page.locator("input[type='range']");

    // Establecer valor directamente
    await slider.fill('3.5');
    await expect(page.locator('#range')).toHaveText('3.5');
});


test('slider teclado', async ({ page }) => {
    // Mover slider con teclas de flecha
    await page.goto('https://the-internet.herokuapp.com/horizontal_slider');

    const slider = page.locator("input[type='range']");
    await slider.click(); // Enfocar el slider

    // Mover con flechas del teclado
    for (let i = 0; i < 5; i++) {
        await slider.press('ArrowRight');
    }

    const valor = await page.locator('#range').textContent();
    console.log(\`Valor actual: \${valor}\`);
});</code></pre>
            </div>
        </div>

        <h3>🔘 Toggle switches</h3>
        <div class="code-tabs" data-code-id="L032-8">
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
                <pre><code class="language-python">def test_toggle_switch(page: Page):
    page.goto("/mi-app/configuracion")

    # Los toggles suelen ser checkboxes estilizados
    toggle = page.locator("#notificaciones")

    # Verificar estado actual
    if not toggle.is_checked():
        toggle.click()  # Activar

    expect(toggle).to_be_checked()

    # Desactivar
    toggle.uncheck()
    expect(toggle).not_to_be_checked()

    # También funciona con labels clickeables
    page.locator("label[for='modo-oscuro']").click()
    expect(page.locator("#modo-oscuro")).to_be_checked()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('toggle switch', async ({ page }) => {
    await page.goto('/mi-app/configuracion');

    // Los toggles suelen ser checkboxes estilizados
    const toggle = page.locator('#notificaciones');

    // Verificar estado actual
    if (!(await toggle.isChecked())) {
        await toggle.click(); // Activar
    }

    await expect(toggle).toBeChecked();

    // Desactivar
    await toggle.uncheck();
    await expect(toggle).not.toBeChecked();

    // También funciona con labels clickeables
    await page.locator("label[for='modo-oscuro']").click();
    await expect(page.locator('#modo-oscuro')).toBeChecked();
});</code></pre>
            </div>
        </div>

        <h3>💬 Tooltips: hover y verificar</h3>
        <div class="code-tabs" data-code-id="L032-9">
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
                <pre><code class="language-python">def test_tooltip(page: Page):
    page.goto("https://the-internet.herokuapp.com/hovers")

    # Hover sobre un elemento para mostrar tooltip
    avatar = page.locator(".figure").first
    avatar.hover()

    # Verificar que el tooltip/info aparece
    info = page.locator(".figure .figcaption").first
    expect(info).to_be_visible()
    expect(info).to_contain_text("name: user1")


def test_tooltip_personalizado(page: Page):
    page.goto("/mi-app/dashboard")

    # Hover para mostrar tooltip
    page.locator("#icono-ayuda").hover()

    # Esperar a que el tooltip sea visible
    tooltip = page.locator("[role='tooltip']")
    expect(tooltip).to_be_visible()
    expect(tooltip).to_have_text("Haz clic para más información")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('tooltip', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/hovers');

    // Hover sobre un elemento para mostrar tooltip
    const avatar = page.locator('.figure').first();
    await avatar.hover();

    // Verificar que el tooltip/info aparece
    const info = page.locator('.figure .figcaption').first();
    await expect(info).toBeVisible();
    await expect(info).toContainText('name: user1');
});


test('tooltip personalizado', async ({ page }) => {
    await page.goto('/mi-app/dashboard');

    // Hover para mostrar tooltip
    await page.locator('#icono-ayuda').hover();

    // Esperar a que el tooltip sea visible
    const tooltip = page.locator("[role='tooltip']");
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveText('Haz clic para más información');
});</code></pre>
            </div>
        </div>

        <h3>🌐 Patrones comunes en apps modernas</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Las aplicaciones modernas (React, Angular, Vue) frecuentemente reemplazan
            los controles nativos con componentes personalizados. Aquí las claves para
            automatizarlos:</p>
            <ul>
                <li><strong>Inspeccionar siempre:</strong> Usa DevTools para entender la estructura real del DOM</li>
                <li><strong>Buscar roles ARIA:</strong> <code>role="listbox"</code>, <code>role="option"</code>, <code>role="combobox"</code></li>
                <li><strong>Usar getByRole:</strong> <code>page.get_by_role("option", name="Colombia")</code></li>
                <li><strong>Esperar animaciones:</strong> Los componentes custom suelen tener transiciones</li>
            </ul>
        </div>

        <h3>📊 Nativo vs Custom: comparación de manejo</h3>
        <table style="width:100%; border-collapse: collapse;">
            <tr style="background: #c8e6c9;">
                <th style="padding: 8px; border: 1px solid #ddd;">Aspecto</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Select Nativo</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Dropdown Custom</th>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Método</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>select_option()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>click()</code> + <code>click()</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;">Selección</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Por value, label o index</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Buscar y hacer clic en la opción</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Multi-select</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Pasar array de values</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Click individual o Ctrl+Click</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;">Verificación</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>to_have_value()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>to_have_text()</code></td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Búsqueda</td>
                <td style="padding: 6px; border: 1px solid #ddd;">No soportada</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Escribir en input del componente</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;">Detección</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Tag: <code>&lt;select&gt;</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Tags: <code>&lt;div&gt;</code>, <code>&lt;ul&gt;</code>, etc.</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Fiabilidad</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Muy alta</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Depende del framework UI</td>
            </tr>
        </table>

        <h3>🎯 Ejercicio práctico</h3>
        <ol>
            <li>Ve a <code>https://the-internet.herokuapp.com/dropdown</code> y selecciona "Option 1" por label, luego "Option 2" por value</li>
            <li>Verifica el valor seleccionado con <code>expect().to_have_value()</code></li>
            <li>Ve a <code>/horizontal_slider</code> y mueve el slider al valor 4 usando <code>fill()</code></li>
            <li>Ve a <code>/hovers</code> y haz hover sobre cada avatar, verificando que aparece el nombre del usuario</li>
            <li>Implementa una función helper <code>seleccionar_dropdown(page, selector, texto)</code> que funcione tanto para selects nativos como para dropdowns custom</li>
            <li>Crea un test que combine al menos 3 tipos de componentes UI de esta lección</li>
        </ol>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip profesional</h4>
            <p>En proyectos reales, crea funciones helper o métodos en tu Page Object
            para encapsular la lógica de interacción con componentes custom.
            Así, si el framework UI cambia, solo actualizas un lugar:</p>
            <div class="code-tabs" data-code-id="L032-10">
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
                    <pre><code class="language-python"># helpers/ui_components.py
def seleccionar_dropdown(page, trigger_selector, opcion_texto):
    """Helper genérico para dropdowns custom."""
    page.locator(trigger_selector).click()
    page.locator(f".dropdown-menu >> text={opcion_texto}").click()</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-typescript">// helpers/uiComponents.ts
async function seleccionarDropdown(
    page: Page,
    triggerSelector: string,
    opcionTexto: string
) {
    await page.locator(triggerSelector).click();
    await page.locator(\`.dropdown-menu >> text=\${opcionTexto}\`).click();
}</code></pre>
                </div>
            </div>
        </div>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Usar <code>select_option()</code> con selects nativos (por value, label, index)</li>
                <li>Manejar multi-selects pasando arrays</li>
                <li>Interactuar con dropdowns personalizados (click + click)</li>
                <li>Automatizar autocomplete/combobox con escritura y selección</li>
                <li>Aplicar estrategias para date pickers (fill directo vs componente visual)</li>
                <li>Controlar sliders, toggles y tooltips</li>
            </ul>
        </div>
    `,
    topics: ["dropdowns", "componentes", "select"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_032 = LESSON_032;
}
