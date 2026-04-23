/**
 * Playwright Academy - Lección 048
 * Scroll y elementos virtualizados
 * Sección 6: Interacciones Web Avanzadas
 */

const LESSON_048 = {
    id: 48,
    title: "Scroll y elementos virtualizados",
    duration: "5 min",
    level: "beginner",
    section: "section-06",
    content: `
        <h2>📜 Scroll y elementos virtualizados</h2>
        <p>Playwright hace auto-scroll antes de la mayoría de las acciones. Sin embargo,
        hay escenarios donde necesitas controlar el scroll manualmente: páginas con
        infinite scroll, contenido lazy-loaded, y listas virtualizadas donde los elementos
        solo existen en el DOM cuando son visibles.</p>

        <h3>🔄 Auto-scroll de Playwright</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>La mayoría de las acciones de Playwright (<code>click()</code>, <code>fill()</code>,
            <code>check()</code>, etc.) hacen scroll automático al elemento antes de interactuar.
            <strong>No necesitas scroll manual para acciones normales.</strong></p>
        </div>
        <div class="code-tabs" data-code-id="L048-1">
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
                <pre><code class="language-python">from playwright.sync_api import Page

def test_auto_scroll(page: Page):
    page.goto("/pagina-larga")

    # Playwright hace scroll automáticamente al botón
    # aunque esté fuera de la vista actual
    page.click("#boton-al-final")    # Auto-scroll + click
    page.fill("#campo-abajo", "ok")  # Auto-scroll + fill

    # No necesitas hacer scroll manual para estas acciones</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('auto scroll', async ({ page }) => {
    await page.goto('/pagina-larga');

    // Playwright hace scroll automáticamente al botón
    // aunque esté fuera de la vista actual
    await page.click('#boton-al-final');    // Auto-scroll + click
    await page.fill('#campo-abajo', 'ok');  // Auto-scroll + fill

    // No necesitas hacer scroll manual para estas acciones
});</code></pre>
            </div>
        </div>

        <h3>🖱️ page.mouse.wheel() — Scroll por píxeles</h3>
        <div class="code-tabs" data-code-id="L048-2">
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
                <pre><code class="language-python"># Scroll con la rueda del mouse
# wheel(delta_x, delta_y)
# delta_y positivo = scroll hacia abajo
# delta_y negativo = scroll hacia arriba

page.mouse.wheel(0, 300)      # Scroll abajo 300px
page.mouse.wheel(0, -300)     # Scroll arriba 300px
page.mouse.wheel(200, 0)      # Scroll derecha 200px
page.mouse.wheel(-200, 0)     # Scroll izquierda 200px

# Scroll gradual (simular usuario)
for _ in range(5):
    page.mouse.wheel(0, 200)
    page.wait_for_timeout(500)  # Pausa entre scrolls</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Scroll con la rueda del mouse
// wheel(deltaX, deltaY)
// deltaY positivo = scroll hacia abajo
// deltaY negativo = scroll hacia arriba

await page.mouse.wheel(0, 300);      // Scroll abajo 300px
await page.mouse.wheel(0, -300);     // Scroll arriba 300px
await page.mouse.wheel(200, 0);      // Scroll derecha 200px
await page.mouse.wheel(-200, 0);     // Scroll izquierda 200px

// Scroll gradual (simular usuario)
for (let i = 0; i < 5; i++) {
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(500);  // Pausa entre scrolls
}</code></pre>
            </div>
        </div>

        <h3>👁️ scroll_into_view_if_needed() — Asegurar visibilidad</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><code>scroll_into_view_if_needed()</code> hace scroll solo si el elemento
            no está visible en el viewport. Es útil cuando necesitas que un elemento
            sea visible (por ejemplo, para verificar visualmente) sin hacer clic en él.</p>
        </div>
        <div class="code-tabs" data-code-id="L048-3">
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
                <pre><code class="language-python"># Scroll al elemento solo si no es visible
page.locator("#seccion-contacto").scroll_into_view_if_needed()

# Esperar que el elemento exista y luego hacer scroll
locator = page.locator(".ultimo-item")
locator.scroll_into_view_if_needed()

# Útil antes de tomar screenshots parciales
page.locator("#grafico-ventas").scroll_into_view_if_needed()
page.locator("#grafico-ventas").screenshot(path="grafico.png")

# También funciona con timeout
page.locator("#elemento-dinamico").scroll_into_view_if_needed(
    timeout=5000
)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Scroll al elemento solo si no es visible
await page.locator('#seccion-contacto').scrollIntoViewIfNeeded();

// Esperar que el elemento exista y luego hacer scroll
const locator = page.locator('.ultimo-item');
await locator.scrollIntoViewIfNeeded();

// Útil antes de tomar screenshots parciales
await page.locator('#grafico-ventas').scrollIntoViewIfNeeded();
await page.locator('#grafico-ventas').screenshot({ path: 'grafico.png' });

// También funciona con timeout
await page.locator('#elemento-dinamico').scrollIntoViewIfNeeded({
    timeout: 5000
});</code></pre>
            </div>
        </div>

        <h3>🧪 Scroll con evaluate() — Control total</h3>
        <div class="code-tabs" data-code-id="L048-4">
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
                <pre><code class="language-python"># window.scrollTo() - Scroll absoluto
page.evaluate("window.scrollTo(0, 0)")          # Ir al tope
page.evaluate("window.scrollTo(0, 500)")         # Ir a 500px
page.evaluate(
    "window.scrollTo(0, document.body.scrollHeight)"  # Ir al final
)

# window.scrollBy() - Scroll relativo
page.evaluate("window.scrollBy(0, 300)")         # Bajar 300px
page.evaluate("window.scrollBy(0, -300)")        # Subir 300px

# element.scrollIntoView() - Scroll a un elemento
page.evaluate("""
    document.querySelector('#mi-seccion')
        .scrollIntoView({ behavior: 'smooth', block: 'center' })
""")

# Scroll dentro de un contenedor con overflow
page.evaluate("""
    const contenedor = document.querySelector('.lista-scroll');
    contenedor.scrollTop = contenedor.scrollHeight;  // Al final
""")

page.evaluate("""
    const contenedor = document.querySelector('.lista-scroll');
    contenedor.scrollTop = 0;  // Al inicio
""")

# Obtener posición actual de scroll
scroll_y = page.evaluate("window.scrollY")
print(f"Posición actual: {scroll_y}px")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// window.scrollTo() - Scroll absoluto
await page.evaluate(() => window.scrollTo(0, 0));          // Ir al tope
await page.evaluate(() => window.scrollTo(0, 500));         // Ir a 500px
await page.evaluate(
    () => window.scrollTo(0, document.body.scrollHeight)   // Ir al final
);

// window.scrollBy() - Scroll relativo
await page.evaluate(() => window.scrollBy(0, 300));         // Bajar 300px
await page.evaluate(() => window.scrollBy(0, -300));        // Subir 300px

// element.scrollIntoView() - Scroll a un elemento
await page.evaluate(() => {
    document.querySelector('#mi-seccion')!
        .scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Scroll dentro de un contenedor con overflow
await page.evaluate(() => {
    const contenedor = document.querySelector('.lista-scroll')!;
    contenedor.scrollTop = contenedor.scrollHeight;  // Al final
});

await page.evaluate(() => {
    const contenedor = document.querySelector('.lista-scroll')!;
    contenedor.scrollTop = 0;  // Al inicio
});

// Obtener posición actual de scroll
const scrollY = await page.evaluate(() => window.scrollY);
console.log(\`Posición actual: \${scrollY}px\`);</code></pre>
            </div>
        </div>

        <h3>♾️ Patrón: Infinite Scroll</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>El infinite scroll carga más contenido al llegar al final de la página.
            La estrategia es: hacer scroll, esperar nuevos elementos, repetir hasta
            alcanzar la condición deseada.</p>
        </div>
        <div class="code-tabs" data-code-id="L048-5">
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
                <pre><code class="language-python">import pytest
from playwright.sync_api import Page, expect

def test_infinite_scroll_basico(page: Page):
    """Recolectar items de una página con infinite scroll."""
    page.goto("/infinite-scroll")

    items_anteriores = 0
    max_intentos = 20
    intentos = 0

    while intentos < max_intentos:
        # Contar items actuales
        items_actuales = page.locator(".item").count()

        # Si no hay nuevos items, hemos llegado al final
        if items_actuales == items_anteriores:
            intentos += 1
        else:
            intentos = 0  # Resetear si aparecieron nuevos

        items_anteriores = items_actuales

        # Scroll al final
        page.evaluate(
            "window.scrollTo(0, document.body.scrollHeight)"
        )

        # Esperar que cargue nuevo contenido
        page.wait_for_timeout(1000)

    print(f"Total items recolectados: {items_actuales}")
    assert items_actuales > 0


def test_infinite_scroll_hasta_n_items(page: Page):
    """Hacer scroll hasta tener al menos N items."""
    page.goto("/productos")
    objetivo = 50

    while page.locator(".producto").count() < objetivo:
        # Scroll al final
        page.mouse.wheel(0, 500)

        # Esperar carga
        page.wait_for_load_state("networkidle")

    # Verificar que tenemos suficientes
    expect(page.locator(".producto")).to_have_count(
        objetivo, timeout=0  # Ya sabemos que están
    )</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('infinite scroll basico', async ({ page }) => {
    // Recolectar items de una página con infinite scroll.
    await page.goto('/infinite-scroll');

    let itemsAnteriores = 0;
    const maxIntentos = 20;
    let intentos = 0;

    while (intentos < maxIntentos) {
        // Contar items actuales
        const itemsActuales = await page.locator('.item').count();

        // Si no hay nuevos items, hemos llegado al final
        if (itemsActuales === itemsAnteriores) {
            intentos += 1;
        } else {
            intentos = 0;  // Resetear si aparecieron nuevos
        }

        itemsAnteriores = itemsActuales;

        // Scroll al final
        await page.evaluate(
            () => window.scrollTo(0, document.body.scrollHeight)
        );

        // Esperar que cargue nuevo contenido
        await page.waitForTimeout(1000);
    }

    const totalItems = await page.locator('.item').count();
    console.log(\`Total items recolectados: \${totalItems}\`);
    expect(totalItems).toBeGreaterThan(0);
});


test('infinite scroll hasta n items', async ({ page }) => {
    // Hacer scroll hasta tener al menos N items.
    await page.goto('/productos');
    const objetivo = 50;

    while (await page.locator('.producto').count() < objetivo) {
        // Scroll al final
        await page.mouse.wheel(0, 500);

        // Esperar carga
        await page.waitForLoadState('networkidle');
    }

    // Verificar que tenemos suficientes
    await expect(page.locator('.producto')).toHaveCount(objetivo);
});</code></pre>
            </div>
        </div>

        <h3>🖼️ Lazy-loading: imágenes y contenido</h3>
        <div class="code-tabs" data-code-id="L048-6">
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
                <pre><code class="language-python">def test_lazy_loaded_images(page: Page):
    """Cargar imágenes lazy-loaded haciendo scroll."""
    page.goto("/galeria")

    # Las imágenes usan loading="lazy" o IntersectionObserver
    # Solo se cargan cuando entran al viewport

    imagenes = page.locator("img.lazy")
    total = imagenes.count()

    for i in range(total):
        img = imagenes.nth(i)

        # Scroll al imagen
        img.scroll_into_view_if_needed()

        # Esperar que la imagen se cargue (src cambia de placeholder)
        page.wait_for_function(
            """(index) => {
                const imgs = document.querySelectorAll('img.lazy');
                const img = imgs[index];
                return img.complete && img.naturalHeight > 0;
            }""",
            i
        )

    # Verificar que todas las imágenes están cargadas
    for i in range(total):
        img = imagenes.nth(i)
        es_visible = page.evaluate(
            """(el) => el.complete && el.naturalHeight > 0""",
            img.element_handle()
        )
        assert es_visible, f"Imagen {i} no se cargó"


def test_lazy_content_sections(page: Page):
    """Cargar secciones de contenido lazy-loaded."""
    page.goto("/articulo-largo")

    secciones = ["intro", "desarrollo", "conclusion", "comentarios"]

    for seccion in secciones:
        locator = page.locator(f"#seccion-{seccion}")

        # Scroll a la sección
        locator.scroll_into_view_if_needed()

        # Esperar que el contenido dinámico se cargue
        page.wait_for_selector(
            f"#seccion-{seccion} .contenido-cargado"
        )

        expect(locator.locator(".contenido-cargado")).to_be_visible()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('lazy loaded images', async ({ page }) => {
    // Cargar imágenes lazy-loaded haciendo scroll.
    await page.goto('/galeria');

    // Las imágenes usan loading="lazy" o IntersectionObserver
    // Solo se cargan cuando entran al viewport

    const imagenes = page.locator('img.lazy');
    const total = await imagenes.count();

    for (let i = 0; i < total; i++) {
        const img = imagenes.nth(i);

        // Scroll al imagen
        await img.scrollIntoViewIfNeeded();

        // Esperar que la imagen se cargue (src cambia de placeholder)
        await page.waitForFunction(
            (index) => {
                const imgs = document.querySelectorAll('img.lazy');
                const img = imgs[index] as HTMLImageElement;
                return img.complete && img.naturalHeight > 0;
            },
            i
        );
    }

    // Verificar que todas las imágenes están cargadas
    for (let i = 0; i < total; i++) {
        const img = imagenes.nth(i);
        const esVisible = await page.evaluate(
            (el) => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalHeight > 0,
            await img.elementHandle()
        );
        expect(esVisible, \`Imagen \${i} no se cargó\`).toBeTruthy();
    }
});


test('lazy content sections', async ({ page }) => {
    // Cargar secciones de contenido lazy-loaded.
    await page.goto('/articulo-largo');

    const secciones = ['intro', 'desarrollo', 'conclusion', 'comentarios'];

    for (const seccion of secciones) {
        const locator = page.locator(\`#seccion-\${seccion}\`);

        // Scroll a la sección
        await locator.scrollIntoViewIfNeeded();

        // Esperar que el contenido dinámico se cargue
        await page.waitForSelector(
            \`#seccion-\${seccion} .contenido-cargado\`
        );

        await expect(locator.locator('.contenido-cargado')).toBeVisible();
    }
});</code></pre>
            </div>
        </div>

        <h3>📦 Listas virtualizadas (React Virtualized, etc.)</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Las listas virtualizadas (React Virtualized, TanStack Virtual, etc.)
            solo renderizan los elementos visibles en el viewport. Los elementos fuera
            de vista <strong>no existen en el DOM</strong>. Para acceder a todos los datos,
            debes hacer scroll incrementalmente y recolectar información a medida que
            los elementos aparecen.</p>
        </div>
        <div class="code-tabs" data-code-id="L048-7">
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
                <pre><code class="language-python">def test_lista_virtualizada(page: Page):
    """Recolectar datos de una lista virtualizada."""
    page.goto("/tabla-virtual")

    datos_recolectados = []
    ids_vistos = set()

    contenedor = page.locator(".virtual-list-container")
    max_scrolls = 100

    for _ in range(max_scrolls):
        # Obtener filas actualmente visibles
        filas = page.locator(".virtual-row")

        for i in range(filas.count()):
            fila = filas.nth(i)
            id_fila = fila.get_attribute("data-id")

            # Solo procesar filas nuevas
            if id_fila and id_fila not in ids_vistos:
                ids_vistos.add(id_fila)
                datos_recolectados.append({
                    "id": id_fila,
                    "nombre": fila.locator(".col-nombre")
                                  .inner_text(),
                    "valor": fila.locator(".col-valor")
                                 .inner_text(),
                })

        # Verificar si llegamos al final
        scroll_actual = page.evaluate("""
            () => {
                const c = document.querySelector(
                    '.virtual-list-container'
                );
                return c.scrollTop + c.clientHeight
                       >= c.scrollHeight - 10;
            }
        """)

        if scroll_actual:
            break

        # Scroll dentro del contenedor virtualizado
        page.evaluate("""
            () => {
                const c = document.querySelector(
                    '.virtual-list-container'
                );
                c.scrollTop += 300;
            }
        """)
        page.wait_for_timeout(200)  # Esperar re-render

    print(f"Elementos recolectados: {len(datos_recolectados)}")
    assert len(datos_recolectados) > 0</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('lista virtualizada', async ({ page }) => {
    // Recolectar datos de una lista virtualizada.
    await page.goto('/tabla-virtual');

    const datosRecolectados: { id: string; nombre: string; valor: string }[] = [];
    const idsVistos = new Set&lt;string&gt;();

    const contenedor = page.locator('.virtual-list-container');
    const maxScrolls = 100;

    for (let s = 0; s < maxScrolls; s++) {
        // Obtener filas actualmente visibles
        const filas = page.locator('.virtual-row');
        const count = await filas.count();

        for (let i = 0; i < count; i++) {
            const fila = filas.nth(i);
            const idFila = await fila.getAttribute('data-id');

            // Solo procesar filas nuevas
            if (idFila && !idsVistos.has(idFila)) {
                idsVistos.add(idFila);
                datosRecolectados.push({
                    id: idFila,
                    nombre: await fila.locator('.col-nombre')
                                      .innerText(),
                    valor: await fila.locator('.col-valor')
                                     .innerText(),
                });
            }
        }

        // Verificar si llegamos al final
        const scrollActual = await page.evaluate(() => {
            const c = document.querySelector(
                '.virtual-list-container'
            )!;
            return c.scrollTop + c.clientHeight
                   >= c.scrollHeight - 10;
        });

        if (scrollActual) {
            break;
        }

        // Scroll dentro del contenedor virtualizado
        await page.evaluate(() => {
            const c = document.querySelector(
                '.virtual-list-container'
            )!;
            c.scrollTop += 300;
        });
        await page.waitForTimeout(200);  // Esperar re-render
    }

    console.log(\`Elementos recolectados: \${datosRecolectados.length}\`);
    expect(datosRecolectados.length).toBeGreaterThan(0);
});</code></pre>
            </div>
        </div>

        <h3>⏳ wait_for_function() — Esperar contenido por scroll</h3>
        <div class="code-tabs" data-code-id="L048-8">
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
                <pre><code class="language-python"># Esperar que el scroll dispare algún cambio en la página

# Esperar que aparezcan al menos N elementos
page.wait_for_function("""
    (n) => document.querySelectorAll('.item').length >= n
""", 20)

# Esperar que un elemento sea visible tras scroll
page.wait_for_function("""
    () => {
        const el = document.querySelector('#footer');
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight;
    }
""")

# Esperar que el scroll llegue a cierta posición
page.evaluate(
    "window.scrollTo({ top: 2000, behavior: 'smooth' })"
)
page.wait_for_function("() => window.scrollY >= 1900")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Esperar que el scroll dispare algún cambio en la página

// Esperar que aparezcan al menos N elementos
await page.waitForFunction(
    (n) => document.querySelectorAll('.item').length >= n,
    20
);

// Esperar que un elemento sea visible tras scroll
await page.waitForFunction(() => {
    const el = document.querySelector('#footer');
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight;
});

// Esperar que el scroll llegue a cierta posición
await page.evaluate(
    () => window.scrollTo({ top: 2000, behavior: 'smooth' })
);
await page.waitForFunction(() => window.scrollY >= 1900);</code></pre>
            </div>
        </div>

        <h3>🔘 "Cargar más" vs Infinite Scroll</h3>
        <div class="code-tabs" data-code-id="L048-9">
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
                <pre><code class="language-python"># Patrón: botón "Cargar más"
def test_cargar_mas(page: Page):
    """Hacer clic en 'Cargar más' hasta obtener todos los items."""
    page.goto("/productos")

    while True:
        boton = page.locator("button:has-text('Cargar más')")

        # Si el botón no existe o no es visible, terminamos
        if not boton.is_visible():
            break

        # Scroll al botón y click
        boton.scroll_into_view_if_needed()
        boton.click()

        # Esperar que carguen los nuevos items
        page.wait_for_load_state("networkidle")

    total = page.locator(".producto").count()
    print(f"Total productos cargados: {total}")


# Patrón: paginación por scroll (IntersectionObserver)
def test_scroll_paginacion(page: Page):
    """Scroll hasta un sentinel que dispara la carga."""
    page.goto("/feed")

    items_previos = 0
    sin_cambio = 0

    while sin_cambio < 3:
        # Scroll al sentinel (elemento al final de la lista)
        sentinel = page.locator("#scroll-sentinel")
        if sentinel.is_visible():
            sentinel.scroll_into_view_if_needed()

        page.wait_for_timeout(1500)

        items_actuales = page.locator(".feed-item").count()
        if items_actuales == items_previos:
            sin_cambio += 1
        else:
            sin_cambio = 0
        items_previos = items_actuales

    print(f"Items en feed: {items_actuales}")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

// Patrón: botón "Cargar más"
test('cargar mas', async ({ page }) => {
    // Hacer clic en 'Cargar más' hasta obtener todos los items.
    await page.goto('/productos');

    while (true) {
        const boton = page.locator('button:has-text("Cargar más")');

        // Si el botón no existe o no es visible, terminamos
        if (!await boton.isVisible()) {
            break;
        }

        // Scroll al botón y click
        await boton.scrollIntoViewIfNeeded();
        await boton.click();

        // Esperar que carguen los nuevos items
        await page.waitForLoadState('networkidle');
    }

    const total = await page.locator('.producto').count();
    console.log(\`Total productos cargados: \${total}\`);
});


// Patrón: paginación por scroll (IntersectionObserver)
test('scroll paginacion', async ({ page }) => {
    // Scroll hasta un sentinel que dispara la carga.
    await page.goto('/feed');

    let itemsPrevios = 0;
    let sinCambio = 0;

    while (sinCambio < 3) {
        // Scroll al sentinel (elemento al final de la lista)
        const sentinel = page.locator('#scroll-sentinel');
        if (await sentinel.isVisible()) {
            await sentinel.scrollIntoViewIfNeeded();
        }

        await page.waitForTimeout(1500);

        const itemsActuales = await page.locator('.feed-item').count();
        if (itemsActuales === itemsPrevios) {
            sinCambio += 1;
        } else {
            sinCambio = 0;
        }
        itemsPrevios = itemsActuales;
    }

    console.log(\`Items en feed: \${itemsPrevios}\`);
});</code></pre>
            </div>
        </div>

        <h3>💡 Ejemplo completo: scraping de infinite scroll</h3>
        <div class="code-tabs" data-code-id="L048-10">
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
                <pre><code class="language-python">import pytest
from playwright.sync_api import Page, expect

def test_scraping_infinite_scroll(page: Page):
    """Extraer todos los títulos de un blog con infinite scroll."""
    page.goto("https://ejemplo.com/blog")

    titulos = []
    scroll_pausas = 0
    max_pausas = 5  # Máximo intentos sin nuevos items

    while scroll_pausas < max_pausas:
        # Recolectar títulos visibles
        elementos = page.locator("article h2")
        nuevos = 0

        for i in range(elementos.count()):
            titulo = elementos.nth(i).inner_text()
            if titulo not in titulos:
                titulos.append(titulo)
                nuevos += 1

        if nuevos == 0:
            scroll_pausas += 1
        else:
            scroll_pausas = 0

        # Scroll al final de la página
        page.evaluate(
            "window.scrollTo(0, document.body.scrollHeight)"
        )

        # Esperar posible carga de red
        try:
            page.wait_for_load_state("networkidle", timeout=3000)
        except:
            pass  # Timeout está OK, puede que no haya más

    print(f"Total títulos recolectados: {len(titulos)}")
    for i, t in enumerate(titulos, 1):
        print(f"  {i}. {t}")

    assert len(titulos) > 10, "Se esperaban más de 10 artículos"</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('scraping infinite scroll', async ({ page }) => {
    // Extraer todos los títulos de un blog con infinite scroll.
    await page.goto('https://ejemplo.com/blog');

    const titulos: string[] = [];
    let scrollPausas = 0;
    const maxPausas = 5;  // Máximo intentos sin nuevos items

    while (scrollPausas < maxPausas) {
        // Recolectar títulos visibles
        const elementos = page.locator('article h2');
        let nuevos = 0;
        const count = await elementos.count();

        for (let i = 0; i < count; i++) {
            const titulo = await elementos.nth(i).innerText();
            if (!titulos.includes(titulo)) {
                titulos.push(titulo);
                nuevos += 1;
            }
        }

        if (nuevos === 0) {
            scrollPausas += 1;
        } else {
            scrollPausas = 0;
        }

        // Scroll al final de la página
        await page.evaluate(
            () => window.scrollTo(0, document.body.scrollHeight)
        );

        // Esperar posible carga de red
        try {
            await page.waitForLoadState('networkidle', { timeout: 3000 });
        } catch {
            // Timeout está OK, puede que no haya más
        }
    }

    console.log(\`Total títulos recolectados: \${titulos.length}\`);
    titulos.forEach((t, i) => {
        console.log(\`  \${i + 1}. \${t}\`);
    });

    expect(titulos.length).toBeGreaterThan(10);
});</code></pre>
            </div>
        </div>

        <h3>📊 Tabla comparativa: técnicas de scroll</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #90caf9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Técnica</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Cuándo usarla</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Ventaja</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>Auto-scroll (acciones)</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Interacciones normales</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Sin código extra</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>mouse.wheel()</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Scroll preciso en píxeles</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Control fino</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>scroll_into_view_if_needed()</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Asegurar visibilidad de un elemento</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Simple y eficaz</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>evaluate(scrollTo)</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Scroll absoluto / dentro de contenedores</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Máxima flexibilidad</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>evaluate(scrollIntoView)</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Scroll suave a elemento vía JS</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Comportamiento smooth</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>keyboard (PageDown, End)</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Scroll con teclado</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Simula usuario real</td>
                </tr>
            </table>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Reto doble:</strong> Extraer datos de una página con infinite scroll
            y de una galería con lazy-loading.</p>
        </div>
        <ol>
            <li><strong>Parte A — Infinite scroll:</strong>
                <ul>
                    <li>Navega a una página con infinite scroll</li>
                    <li>Haz scroll hasta recolectar al menos 30 items</li>
                    <li>Guarda los textos de cada item en una lista</li>
                    <li>Verifica que no hay duplicados</li>
                </ul>
            </li>
            <li><strong>Parte B — Galería lazy-loaded:</strong>
                <ul>
                    <li>Navega a una galería de imágenes con lazy-loading</li>
                    <li>Haz scroll para cargar todas las imágenes</li>
                    <li>Verifica que todas las imágenes tienen <code>src</code> real (no placeholder)</li>
                    <li>Cuenta las imágenes cargadas correctamente</li>
                </ul>
            </li>
        </ol>
        <div class="code-tabs" data-code-id="L048-11">
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
                <pre><code class="language-python">import pytest
from playwright.sync_api import Page, expect

def test_ejercicio_infinite_scroll(page: Page):
    """Parte A: Extraer items de infinite scroll."""
    page.goto("https://the-internet.herokuapp.com/infinite_scroll")

    parrafos = set()
    objetivo = 30
    max_intentos = 50

    for _ in range(max_intentos):
        # Recolectar párrafos visibles
        elementos = page.locator(".jscroll-added")
        for i in range(elementos.count()):
            texto = elementos.nth(i).inner_text()
            parrafos.add(texto)

        if len(parrafos) >= objetivo:
            break

        # Scroll al final
        page.evaluate(
            "window.scrollTo(0, document.body.scrollHeight)"
        )
        page.wait_for_timeout(800)

    print(f"Párrafos únicos: {len(parrafos)}")
    assert len(parrafos) >= objetivo


def test_ejercicio_lazy_gallery(page: Page):
    """Parte B: Cargar todas las imágenes lazy-loaded."""
    page.goto("/galeria-lazy")

    imagenes = page.locator("img[loading='lazy']")
    total = imagenes.count()
    cargadas = 0

    for i in range(total):
        img = imagenes.nth(i)
        img.scroll_into_view_if_needed()
        page.wait_for_timeout(300)

        src = img.get_attribute("src")
        if src and "placeholder" not in src:
            cargadas += 1

    print(f"Imágenes cargadas: {cargadas}/{total}")
    assert cargadas == total, (
        f"Solo {cargadas} de {total} imágenes cargaron"
    )</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('ejercicio infinite scroll', async ({ page }) => {
    // Parte A: Extraer items de infinite scroll.
    await page.goto('https://the-internet.herokuapp.com/infinite_scroll');

    const parrafos = new Set&lt;string&gt;();
    const objetivo = 30;
    const maxIntentos = 50;

    for (let i = 0; i < maxIntentos; i++) {
        // Recolectar párrafos visibles
        const elementos = page.locator('.jscroll-added');
        const count = await elementos.count();
        for (let j = 0; j < count; j++) {
            const texto = await elementos.nth(j).innerText();
            parrafos.add(texto);
        }

        if (parrafos.size >= objetivo) {
            break;
        }

        // Scroll al final
        await page.evaluate(
            () => window.scrollTo(0, document.body.scrollHeight)
        );
        await page.waitForTimeout(800);
    }

    console.log(\`Párrafos únicos: \${parrafos.size}\`);
    expect(parrafos.size).toBeGreaterThanOrEqual(objetivo);
});


test('ejercicio lazy gallery', async ({ page }) => {
    // Parte B: Cargar todas las imágenes lazy-loaded.
    await page.goto('/galeria-lazy');

    const imagenes = page.locator("img[loading='lazy']");
    const total = await imagenes.count();
    let cargadas = 0;

    for (let i = 0; i < total; i++) {
        const img = imagenes.nth(i);
        await img.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);

        const src = await img.getAttribute('src');
        if (src && !src.includes('placeholder')) {
            cargadas += 1;
        }
    }

    console.log(\`Imágenes cargadas: \${cargadas}/\${total}\`);
    expect(cargadas, \`Solo \${cargadas} de \${total} imágenes cargaron\`).toBe(total);
});</code></pre>
            </div>
        </div>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Entender cuándo Playwright hace auto-scroll y cuándo necesitas scroll manual</li>
                <li>Usar <code>mouse.wheel()</code> y <code>scroll_into_view_if_needed()</code></li>
                <li>Controlar scroll con <code>evaluate()</code> para máxima flexibilidad</li>
                <li>Implementar el patrón de infinite scroll: scroll, esperar, recolectar, repetir</li>
                <li>Manejar contenido lazy-loaded y listas virtualizadas</li>
            </ul>
        </div>
    `,
    topics: ["scroll", "virtualización", "lazy-loading"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_048 = LESSON_048;
}
