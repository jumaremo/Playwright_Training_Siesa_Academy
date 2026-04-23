/**
 * Playwright Academy - Lección 045
 * JavaScript execution desde Playwright
 * Sección 6: Interacciones Web Avanzadas
 */

const LESSON_045 = {
    id: 45,
    title: "JavaScript execution desde Playwright",
    duration: "8 min",
    level: "beginner",
    section: "section-06",
    content: `
        <h2>⚡ JavaScript execution desde Playwright</h2>
        <p>Playwright permite ejecutar código JavaScript directamente en el contexto del navegador.
        Esto es una herramienta poderosa para leer estado oculto, manipular el DOM, disparar eventos
        personalizados y acceder a APIs del navegador que no están expuestas directamente
        por la API de Playwright.</p>

        <h3>🤔 ¿Por qué ejecutar JavaScript en los tests?</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Aunque Playwright cubre la gran mayoría de interacciones, hay escenarios donde
            necesitas acceso directo al JavaScript del navegador:</p>
            <ul>
                <li><strong>Leer estado oculto:</strong> variables globales, estado de la app (Redux, Vuex)</li>
                <li><strong>Modificar el DOM:</strong> cambiar atributos, inyectar elementos para testing</li>
                <li><strong>Disparar eventos:</strong> eventos personalizados que no se pueden simular con click/fill</li>
                <li><strong>Scroll programático:</strong> scroll a coordenadas específicas, scroll infinito</li>
                <li><strong>Acceder a APIs del navegador:</strong> localStorage, sessionStorage, IndexedDB, Canvas</li>
                <li><strong>Leer estilos computados:</strong> verificar CSS aplicado dinámicamente</li>
                <li><strong>Extraer datos complejos:</strong> tablas, listas anidadas, datos de SPAs</li>
            </ul>
        </div>

        <h3>🔧 page.evaluate() — El método fundamental</h3>
        <p><code>page.evaluate()</code> ejecuta una función JavaScript en el contexto del navegador
        y devuelve el resultado serializado a Python. Es el método más usado para ejecución de JS.</p>
        <div class="code-tabs" data-code-id="L045-1">
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

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://the-internet.herokuapp.com")

    # Ejecutar JS simple — retorna un valor
    titulo = page.evaluate("document.title")
    print(f"Título: {titulo}")

    # Ejecutar una función arrow
    url = page.evaluate("() => window.location.href")
    print(f"URL: {url}")

    # Obtener dimensiones de la ventana
    dimensiones = page.evaluate("""() => ({
        ancho: window.innerWidth,
        alto: window.innerHeight,
        scrollY: window.scrollY
    })""")
    print(f"Ventana: {dimensiones['ancho']}x{dimensiones['alto']}")

    # Contar elementos en el DOM
    total_links = page.evaluate("document.querySelectorAll('a').length")
    print(f"Links en la página: {total_links}")

    # Leer localStorage
    page.evaluate("localStorage.setItem('test_key', 'valor_prueba')")
    valor = page.evaluate("localStorage.getItem('test_key')")
    print(f"localStorage: {valor}")

    browser.close()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('page evaluate basics', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com');

    // Ejecutar JS simple — retorna un valor
    const titulo = await page.evaluate(() => document.title);
    console.log(\`Título: \${titulo}\`);

    // Ejecutar una función arrow
    const url = await page.evaluate(() => window.location.href);
    console.log(\`URL: \${url}\`);

    // Obtener dimensiones de la ventana
    const dimensiones = await page.evaluate(() => ({
        ancho: window.innerWidth,
        alto: window.innerHeight,
        scrollY: window.scrollY
    }));
    console.log(\`Ventana: \${dimensiones.ancho}x\${dimensiones.alto}\`);

    // Contar elementos en el DOM
    const totalLinks = await page.evaluate(() => document.querySelectorAll('a').length);
    console.log(\`Links en la página: \${totalLinks}\`);

    // Leer localStorage
    await page.evaluate(() => localStorage.setItem('test_key', 'valor_prueba'));
    const valor = await page.evaluate(() => localStorage.getItem('test_key'));
    console.log(\`localStorage: \${valor}\`);
});</code></pre>
            </div>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚠️ Importante: Serialización</h4>
            <p><code>page.evaluate()</code> serializa el resultado con <code>JSON.stringify</code>
            internamente. Esto significa que:</p>
            <ul>
                <li>Puedes retornar: strings, números, booleanos, arrays, objetos planos, null</li>
                <li><strong>No puedes retornar:</strong> elementos DOM, funciones, objetos con referencias circulares</li>
                <li>Si necesitas un elemento DOM, usa <code>page.evaluate_handle()</code></li>
            </ul>
        </div>

        <h3>📤 Pasar argumentos de Python a JavaScript</h3>
        <p>Puedes enviar valores desde Python al contexto JS como argumentos de la función:</p>
        <div class="code-tabs" data-code-id="L045-2">
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
                <pre><code class="language-python"># Pasar un argumento simple
selector = "#content h1"
texto = page.evaluate("(sel) => document.querySelector(sel).textContent", selector)

# Pasar múltiples argumentos como objeto
datos = {"selector": "h1", "atributo": "textContent"}
resultado = page.evaluate("""
    (args) => {
        const el = document.querySelector(args.selector);
        return el ? el[args.atributo] : null;
    }
""", datos)

# Pasar un array
indices = [0, 2, 4]
textos = page.evaluate("""
    (ids) => {
        const links = document.querySelectorAll('#content ul li a');
        return ids.map(i => links[i]?.textContent || null);
    }
""", indices)
print(f"Links seleccionados: {textos}")

# Usar argumentos para inyectar datos de test
page.evaluate("""
    (config) => {
        window.__TEST_CONFIG__ = config;
        console.log('Config de test inyectada:', config);
    }
""", {"ambiente": "test", "timeout": 5000})</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Pasar un argumento simple
const selector = '#content h1';
const texto = await page.evaluate(
    (sel) => document.querySelector(sel)?.textContent,
    selector
);

// Pasar múltiples argumentos como objeto
const datos = { selector: 'h1', atributo: 'textContent' };
const resultado = await page.evaluate((args) => {
    const el = document.querySelector(args.selector);
    return el ? (el as any)[args.atributo] : null;
}, datos);

// Pasar un array
const indices = [0, 2, 4];
const textos = await page.evaluate((ids) => {
    const links = document.querySelectorAll('#content ul li a');
    return ids.map(i => links[i]?.textContent || null);
}, indices);
console.log(\`Links seleccionados: \${textos}\`);

// Usar argumentos para inyectar datos de test
await page.evaluate((config) => {
    (window as any).__TEST_CONFIG__ = config;
    console.log('Config de test inyectada:', config);
}, { ambiente: 'test', timeout: 5000 });</code></pre>
            </div>
        </div>

        <h3>🔗 page.evaluate_handle() — Retornar objetos JS</h3>
        <p>Cuando necesitas un <strong>handle</strong> (referencia) a un objeto JavaScript en lugar
        de su valor serializado, usa <code>evaluate_handle()</code>:</p>
        <div class="code-tabs" data-code-id="L045-3">
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
                <pre><code class="language-python"># Obtener un handle a un elemento DOM
handle = page.evaluate_handle("document.querySelector('h1')")
print(f"Tipo: {handle}")

# Usar el handle para obtener propiedades
texto = handle.get_property("textContent").json_value()
print(f"Texto del h1: {texto}")

# Obtener handle a un objeto complejo
window_handle = page.evaluate_handle("window")
location_handle = window_handle.get_property("location")
href = location_handle.get_property("href").json_value()
print(f"href: {href}")

# Obtener handle al objeto navigator
nav_handle = page.evaluate_handle("navigator")
user_agent = nav_handle.get_property("userAgent").json_value()
print(f"User-Agent: {user_agent}")

# Liberar el handle cuando ya no lo necesitas
handle.dispose()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Obtener un handle a un elemento DOM
const handle = await page.evaluateHandle(() => document.querySelector('h1'));
console.log(\`Tipo: \${handle}\`);

// Usar el handle para obtener propiedades
const texto = await (await handle.getProperty('textContent')).jsonValue();
console.log(\`Texto del h1: \${texto}\`);

// Obtener handle a un objeto complejo
const windowHandle = await page.evaluateHandle(() => window);
const locationHandle = await windowHandle.getProperty('location');
const href = await (await locationHandle.getProperty('href')).jsonValue();
console.log(\`href: \${href}\`);

// Obtener handle al objeto navigator
const navHandle = await page.evaluateHandle(() => navigator);
const userAgent = await (await navHandle.getProperty('userAgent')).jsonValue();
console.log(\`User-Agent: \${userAgent}\`);

// Liberar el handle cuando ya no lo necesitas
await handle.dispose();</code></pre>
            </div>
        </div>

        <h3>🎯 eval_on_selector() y eval_on_selector_all()</h3>
        <p>Estos métodos ejecutan JS directamente sobre elementos seleccionados, pasando
        el elemento como primer argumento a la función:</p>
        <div class="code-tabs" data-code-id="L045-4">
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
                <pre><code class="language-python"># eval_on_selector — ejecutar sobre UN elemento
# El elemento se pasa como primer argumento (e)
texto = page.eval_on_selector("h1", "e => e.textContent")
print(f"H1: {texto}")

# Obtener atributos
href = page.eval_on_selector(
    "#content ul li:first-child a",
    "e => e.getAttribute('href')"
)
print(f"Primer link: {href}")

# Obtener bounding box
box = page.eval_on_selector("h1", """e => {
    const rect = e.getBoundingClientRect();
    return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
    };
}""")
print(f"Posición del h1: x={box['x']}, y={box['y']}")

# eval_on_selector_all — ejecutar sobre TODOS los elementos
todos_los_links = page.eval_on_selector_all(
    "#content ul li a",
    "elements => elements.map(e => ({texto: e.textContent, href: e.href}))"
)
print(f"Total links: {len(todos_los_links)}")
for link in todos_los_links[:5]:
    print(f"  {link['texto']} → {link['href']}")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// evalOnSelector — ejecutar sobre UN elemento (equivalente: locator.evaluate)
const textoH1 = await page.locator('h1').evaluate(e => e.textContent);
console.log(\`H1: \${textoH1}\`);

// Obtener atributos
const href = await page.locator('#content ul li:first-child a')
    .evaluate(e => e.getAttribute('href'));
console.log(\`Primer link: \${href}\`);

// Obtener bounding box
const box = await page.locator('h1').evaluate(e => {
    const rect = e.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
});
console.log(\`Posición del h1: x=\${box.x}, y=\${box.y}\`);

// evalOnSelectorAll — ejecutar sobre TODOS los elementos
const todosLosLinks = await page.locator('#content ul li a')
    .evaluateAll(elements =>
        elements.map(e => ({ texto: e.textContent, href: (e as HTMLAnchorElement).href }))
    );
console.log(\`Total links: \${todosLosLinks.length}\`);
for (const link of todosLosLinks.slice(0, 5)) {
    console.log(\`  \${link.texto} → \${link.href}\`);
}</code></pre>
            </div>
        </div>

        <h3>📌 locator.evaluate() y locator.evaluate_all()</h3>
        <p>Los localizadores de Playwright también tienen métodos evaluate para ejecutar
        JS directamente sobre los elementos localizados:</p>
        <div class="code-tabs" data-code-id="L045-5">
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
                <pre><code class="language-python"># locator.evaluate() — sobre el primer elemento coincidente
heading = page.locator("h1")
texto = heading.evaluate("el => el.textContent")
font_size = heading.evaluate("el => getComputedStyle(el).fontSize")
print(f"H1: '{texto}' con font-size: {font_size}")

# Verificar si un elemento tiene una clase específica
tiene_clase = page.locator("#flash").evaluate(
    "el => el.classList.contains('success')"
)

# Obtener data attributes
data_val = page.locator("[data-testid='mi-componente']").evaluate(
    "el => el.dataset.testid"
)

# locator.evaluate_all() — sobre TODOS los coincidentes
links = page.locator("#content ul li a")
todos_textos = links.evaluate_all("elements => elements.map(e => e.textContent.trim())")
print(f"Textos de links: {todos_textos}")

# Obtener los links visibles
visibles = links.evaluate_all("""
    elements => elements
        .filter(e => e.offsetParent !== null)
        .map(e => e.textContent.trim())
""")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// locator.evaluate() — sobre el primer elemento coincidente
const heading = page.locator('h1');
const textoHeading = await heading.evaluate(el => el.textContent);
const fontSize = await heading.evaluate(el => getComputedStyle(el).fontSize);
console.log(\`H1: '\${textoHeading}' con font-size: \${fontSize}\`);

// Verificar si un elemento tiene una clase específica
const tieneClase = await page.locator('#flash').evaluate(
    el => el.classList.contains('success')
);

// Obtener data attributes
const dataVal = await page.locator("[data-testid='mi-componente']").evaluate(
    el => (el as HTMLElement).dataset.testid
);

// locator.evaluateAll() — sobre TODOS los coincidentes
const links = page.locator('#content ul li a');
const todosTextos = await links.evaluateAll(
    elements => elements.map(e => e.textContent?.trim())
);
console.log(\`Textos de links: \${todosTextos}\`);

// Obtener los links visibles
const visibles = await links.evaluateAll(
    elements => elements
        .filter(e => (e as HTMLElement).offsetParent !== null)
        .map(e => e.textContent?.trim())
);</code></pre>
            </div>
        </div>

        <h3>🎨 Patrones comunes de evaluate</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Patrones que usarás frecuentemente en tus tests:</h4>
        </div>
        <div class="code-tabs" data-code-id="L045-6">
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
                <pre><code class="language-python"># 1. Leer estilos computados
color = page.evaluate("""
    () => getComputedStyle(document.querySelector('.flash.success')).color
""")

# 2. Verificar localStorage / sessionStorage
token = page.evaluate("localStorage.getItem('auth_token')")
session = page.evaluate("sessionStorage.getItem('user_data')")

# 3. Leer data attributes
page.evaluate("""
    () => document.querySelector('[data-react-props]')
           .getAttribute('data-react-props')
""")

# 4. Scroll a un elemento específico
page.evaluate("""
    () => document.querySelector('#footer').scrollIntoView({
        behavior: 'smooth', block: 'center'
    })
""")

# 5. Scroll a coordenadas
page.evaluate("window.scrollTo(0, document.body.scrollHeight)")

# 6. Obtener propiedades del DOM
propiedades = page.evaluate("""() => ({
    title: document.title,
    url: document.URL,
    readyState: document.readyState,
    cookies: document.cookie,
    referrer: document.referrer
})""")

# 7. Verificar si un evento listener está registrado
# (indirectamente, verificando el comportamiento)
page.evaluate("""
    () => {
        const event = new Event('custom-event');
        document.dispatchEvent(event);
    }
""")

# 8. Leer el estado de una SPA (React, Vue, Angular)
# React (si está en modo desarrollo)
react_state = page.evaluate("""
    () => {
        const root = document.querySelector('#root');
        const fiber = root?._reactRootContainer?._internalRoot?.current;
        return fiber ? 'React app detectada' : 'No es React';
    }
""")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// 1. Leer estilos computados
const color = await page.evaluate(
    () => getComputedStyle(document.querySelector('.flash.success')!).color
);

// 2. Verificar localStorage / sessionStorage
const token = await page.evaluate(() => localStorage.getItem('auth_token'));
const session = await page.evaluate(() => sessionStorage.getItem('user_data'));

// 3. Leer data attributes
await page.evaluate(
    () => document.querySelector('[data-react-props]')?.getAttribute('data-react-props')
);

// 4. Scroll a un elemento específico
await page.evaluate(() => document.querySelector('#footer')?.scrollIntoView({
    behavior: 'smooth', block: 'center'
}));

// 5. Scroll a coordenadas
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

// 6. Obtener propiedades del DOM
const propiedades = await page.evaluate(() => ({
    title: document.title,
    url: document.URL,
    readyState: document.readyState,
    cookies: document.cookie,
    referrer: document.referrer
}));

// 7. Disparar evento personalizado
await page.evaluate(() => {
    const event = new Event('custom-event');
    document.dispatchEvent(event);
});

// 8. Leer estado de SPA (React)
const reactState = await page.evaluate(() => {
    const root = document.querySelector('#root');
    const fiber = (root as any)?._reactRootContainer?._internalRoot?.current;
    return fiber ? 'React app detectada' : 'No es React';
});</code></pre>
            </div>
        </div>

        <h3>💉 Inyectar scripts y estilos</h3>
        <div class="code-tabs" data-code-id="L045-7">
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
                <pre><code class="language-python"># Inyectar un script externo
await_tag = page.add_script_tag(url="https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js")
# Ahora puedes usar lodash en evaluate
resultado = page.evaluate("_.VERSION")  # "4.17.21"

# Inyectar script inline
page.add_script_tag(content="""
    window.helperTest = {
        limpiarFormulario: () => {
            document.querySelectorAll('input').forEach(i => i.value = '');
        },
        contarElementos: (selector) => {
            return document.querySelectorAll(selector).length;
        }
    };
""")
# Usar las funciones inyectadas
page.evaluate("window.helperTest.limpiarFormulario()")
total = page.evaluate("window.helperTest.contarElementos('a')")

# Inyectar estilos para depuración visual
page.add_style_tag(content="""
    /* Resaltar todos los botones durante el test */
    button, [role="button"] {
        outline: 3px solid red !important;
        outline-offset: 2px;
    }
    /* Resaltar inputs */
    input, select, textarea {
        outline: 3px solid blue !important;
    }
""")

# Inyectar stylesheet externo
page.add_style_tag(url="https://example.com/debug-styles.css")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Inyectar un script externo
await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js' });
// Ahora puedes usar lodash en evaluate
const resultado = await page.evaluate(() => (window as any)._.VERSION);

// Inyectar script inline
await page.addScriptTag({ content: \`
    window.helperTest = {
        limpiarFormulario: () => {
            document.querySelectorAll('input').forEach(i => (i as HTMLInputElement).value = '');
        },
        contarElementos: (selector) => {
            return document.querySelectorAll(selector).length;
        }
    };
\` });
// Usar las funciones inyectadas
await page.evaluate(() => (window as any).helperTest.limpiarFormulario());
const total = await page.evaluate(() => (window as any).helperTest.contarElementos('a'));

// Inyectar estilos para depuración visual
await page.addStyleTag({ content: \`
    button, [role="button"] {
        outline: 3px solid red !important;
        outline-offset: 2px;
    }
    input, select, textarea {
        outline: 3px solid blue !important;
    }
\` });

// Inyectar stylesheet externo
await page.addStyleTag({ url: 'https://example.com/debug-styles.css' });</code></pre>
            </div>
        </div>

        <h3>🔄 page.expose_function() — Exponer Python al navegador</h3>
        <p>Con <code>expose_function()</code> puedes exponer una función Python para que
        sea llamada desde JavaScript en el navegador:</p>
        <div class="code-tabs" data-code-id="L045-8">
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
                <pre><code class="language-python">import hashlib
import json

# Exponer una función Python al navegador
def calcular_hash(texto):
    return hashlib.sha256(texto.encode()).hexdigest()

page.expose_function("calcularHash", calcular_hash)

# Ahora JavaScript puede llamar a esta función
hash_resultado = page.evaluate("""
    async () => {
        const hash = await window.calcularHash('mi texto secreto');
        return hash;
    }
""")
print(f"Hash: {hash_resultado}")

# Ejemplo práctico: logging desde el navegador
logs_capturados = []

def capturar_log(mensaje):
    logs_capturados.append(mensaje)
    print(f"[BROWSER LOG] {mensaje}")

page.expose_function("logTest", capturar_log)

# El código del navegador puede llamar logTest()
page.evaluate("""
    () => {
        window.logTest('Formulario enviado');
        window.logTest('Respuesta recibida');
    }
""")
print(f"Logs capturados: {logs_capturados}")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import * as crypto from 'crypto';

// Exponer una función Node.js al navegador
await page.exposeFunction('calcularHash', (texto: string) => {
    return crypto.createHash('sha256').update(texto).digest('hex');
});

// Ahora JavaScript puede llamar a esta función
const hashResultado = await page.evaluate(async () => {
    const hash = await (window as any).calcularHash('mi texto secreto');
    return hash;
});
console.log(\`Hash: \${hashResultado}\`);

// Ejemplo práctico: logging desde el navegador
const logsCapturados: string[] = [];

await page.exposeFunction('logTest', (mensaje: string) => {
    logsCapturados.push(mensaje);
    console.log(\`[BROWSER LOG] \${mensaje}\`);
});

await page.evaluate(() => {
    (window as any).logTest('Formulario enviado');
    (window as any).logTest('Respuesta recibida');
});
console.log(\`Logs capturados: \${logsCapturados}\`);</code></pre>
            </div>
        </div>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔒 Seguridad y buenas prácticas</h4>
            <ul>
                <li><strong>No ejecutes JS arbitrario de fuentes externas</strong> — solo usa evaluate con código que tú controlas</li>
                <li><strong>Evita modificar el DOM innecesariamente</strong> — puede afectar el comportamiento de la app</li>
                <li><strong>Prefiere la API nativa de Playwright</strong> cuando sea posible (es más estable y legible)</li>
                <li><strong>Usa evaluate como último recurso</strong> — primero intenta con locators, assertions y acciones estándar</li>
                <li><strong>Maneja errores</strong> — el JS ejecutado puede lanzar excepciones que se propagan a Python</li>
                <li><strong>Cuidado con async</strong> — <code>evaluate</code> soporta funciones async, pero recuerda usar <code>await</code> dentro del JS</li>
            </ul>
        </div>

        <h3>📊 Tabla comparativa de métodos evaluate</h3>
        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #e3f2fd;">
                <th style="padding: 8px; border: 1px solid #ddd;">Método</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Contexto</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Retorna</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Uso típico</th>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.evaluate()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Página completa</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Valor serializado</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Leer/modificar estado global</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.evaluate_handle()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Página completa</td>
                <td style="padding: 6px; border: 1px solid #ddd;">JSHandle (referencia)</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Obtener objetos JS complejos</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.eval_on_selector()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Un elemento</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Valor serializado</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Leer propiedades de un elemento</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.eval_on_selector_all()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Múltiples elementos</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Valor serializado</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Extraer datos de listas/tablas</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>locator.evaluate()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Elemento del locator</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Valor serializado</td>
                <td style="padding: 6px; border: 1px solid #ddd;">JS sobre un locator específico</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>locator.evaluate_all()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Todos los del locator</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Valor serializado</td>
                <td style="padding: 6px; border: 1px solid #ddd;">JS sobre todos los coincidentes</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.expose_function()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Python → navegador</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Binds función</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Exponer utilidades Python al JS</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.add_script_tag()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Página completa</td>
                <td style="padding: 6px; border: 1px solid #ddd;">ElementHandle</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Inyectar bibliotecas JS</td>
            </tr>
        </table>

        <h3>🚀 Ejemplo completo: Extraer datos de una SPA</h3>
        <div class="code-tabs" data-code-id="L045-9">
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
                <pre><code class="language-python"># tests/test_js_execution.py
"""Test que demuestra extracción de datos complejos con evaluate."""
import pytest
from playwright.sync_api import Page, expect


class TestJavaScriptExecution:
    """Tests de ejecución de JavaScript desde Playwright."""

    def test_extraer_tabla_completa(self, page: Page):
        """Extraer todos los datos de una tabla HTML con evaluate."""
        page.goto("https://the-internet.herokuapp.com/tables")

        # Extraer datos de la tabla #table1
        datos = page.eval_on_selector_all(
            "#table1 tbody tr",
            """rows => rows.map(row => {
                const cells = row.querySelectorAll('td');
                return {
                    apellido: cells[0].textContent,
                    nombre: cells[1].textContent,
                    email: cells[2].textContent,
                    monto: cells[3].textContent,
                    sitio: cells[4].textContent
                };
            })"""
        )

        # Verificar datos extraídos
        assert len(datos) == 4, f"Se esperaban 4 filas, hay {len(datos)}"
        emails = [d["email"] for d in datos]
        assert "jsmith@gmail.com" in emails

        # Encontrar el de mayor monto
        mayor = page.evaluate("""
            () => {
                const rows = document.querySelectorAll('#table1 tbody tr');
                let max = {nombre: '', monto: 0};
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    const monto = parseFloat(cells[3].textContent.replace('$', ''));
                    if (monto > max.monto) {
                        max = {
                            nombre: cells[1].textContent + ' ' + cells[0].textContent,
                            monto: monto
                        };
                    }
                });
                return max;
            }
        """)
        print(f"Mayor monto: {mayor['nombre']} = \${mayor['monto']}")

    def test_verificar_estilos_computados(self, page: Page):
        """Verificar estilos CSS computados con evaluate."""
        page.goto("https://the-internet.herokuapp.com/login")
        page.fill("#username", "tomsmith")
        page.fill("#password", "SuperSecretPassword!")
        page.click("button[type='submit']")

        # Verificar color del mensaje de éxito
        estilos = page.eval_on_selector("#flash", """el => {
            const style = getComputedStyle(el);
            return {
                color: style.color,
                backgroundColor: style.backgroundColor,
                display: style.display,
                visible: el.offsetParent !== null
            };
        }""")
        assert estilos["visible"] is True

    def test_manipular_storage(self, page: Page):
        """Usar evaluate para interactuar con localStorage."""
        page.goto("https://the-internet.herokuapp.com")

        # Escribir en localStorage
        page.evaluate("""
            () => {
                localStorage.setItem('test_user', JSON.stringify({
                    nombre: 'QA Tester',
                    rol: 'automation',
                    timestamp: Date.now()
                }));
            }
        """)

        # Leer de localStorage
        user_data = page.evaluate("""
            () => JSON.parse(localStorage.getItem('test_user'))
        """)
        assert user_data["nombre"] == "QA Tester"
        assert user_data["rol"] == "automation"

        # Limpiar
        page.evaluate("localStorage.removeItem('test_user')")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// tests/js-execution.spec.ts
import { test, expect } from '@playwright/test';

test.describe('JavaScript Execution', () => {
    test('extraer tabla completa', async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com/tables');

        const datos = await page.locator('#table1 tbody tr').evaluateAll(rows =>
            rows.map(row => {
                const cells = row.querySelectorAll('td');
                return {
                    apellido: cells[0].textContent,
                    nombre: cells[1].textContent,
                    email: cells[2].textContent,
                    monto: cells[3].textContent,
                    sitio: cells[4].textContent,
                };
            })
        );

        expect(datos).toHaveLength(4);
        const emails = datos.map(d => d.email);
        expect(emails).toContain('jsmith@gmail.com');

        const mayor = await page.evaluate(() => {
            const rows = document.querySelectorAll('#table1 tbody tr');
            let max = { nombre: '', monto: 0 };
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                const monto = parseFloat(cells[3].textContent!.replace('\$', ''));
                if (monto > max.monto) {
                    max = {
                        nombre: cells[1].textContent + ' ' + cells[0].textContent,
                        monto,
                    };
                }
            });
            return max;
        });
        console.log(\`Mayor monto: \${mayor.nombre} = \$\${mayor.monto}\`);
    });

    test('verificar estilos computados', async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com/login');
        await page.fill('#username', 'tomsmith');
        await page.fill('#password', 'SuperSecretPassword!');
        await page.click("button[type='submit']");

        const estilos = await page.locator('#flash').evaluate(el => {
            const style = getComputedStyle(el);
            return {
                color: style.color,
                backgroundColor: style.backgroundColor,
                display: style.display,
                visible: (el as HTMLElement).offsetParent !== null,
            };
        });
        expect(estilos.visible).toBe(true);
    });

    test('manipular storage', async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com');

        await page.evaluate(() => {
            localStorage.setItem('test_user', JSON.stringify({
                nombre: 'QA Tester',
                rol: 'automation',
                timestamp: Date.now(),
            }));
        });

        const userData = await page.evaluate(
            () => JSON.parse(localStorage.getItem('test_user')!)
        );
        expect(userData.nombre).toBe('QA Tester');
        expect(userData.rol).toBe('automation');

        await page.evaluate(() => localStorage.removeItem('test_user'));
    });
});</code></pre>
            </div>
        </div>

        <h3>🐛 Depuración de evaluate</h3>
        <div class="code-tabs" data-code-id="L045-10">
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
                <pre><code class="language-python"># Si evaluate lanza un error, se propaga como excepción Python
try:
    page.evaluate("() => { throw new Error('algo salió mal'); }")
except Exception as e:
    print(f"Error JS capturado: {e}")

# Usar console.log dentro de evaluate para debugging
# (se ve en la consola del navegador, no en Python)
page.evaluate("""
    () => {
        console.log('Debug desde evaluate:', document.title);
        console.table(Array.from(document.querySelectorAll('a')).slice(0, 5));
    }
""")

# Para capturar console.log en Python:
page.on("console", lambda msg: print(f"[Console {msg.type}] {msg.text}"))
page.evaluate("() => console.log('Este log llega a Python')")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Si evaluate lanza un error, se propaga como excepción
try {
    await page.evaluate(() => { throw new Error('algo salió mal'); });
} catch (e) {
    console.log(\`Error JS capturado: \${e}\`);
}

// Usar console.log dentro de evaluate para debugging
await page.evaluate(() => {
    console.log('Debug desde evaluate:', document.title);
    console.table(Array.from(document.querySelectorAll('a')).slice(0, 5));
});

// Para capturar console.log en Node:
page.on('console', msg => console.log(\`[Console \${msg.type()}] \${msg.text()}\`));
await page.evaluate(() => console.log('Este log llega a Node'));</code></pre>
            </div>
        </div>

        <h3>🎯 Ejercicio</h3>
        <ol>
            <li>Navega a <code>https://the-internet.herokuapp.com/tables</code></li>
            <li>Usa <code>page.evaluate()</code> para contar cuántas filas tiene la tabla <code>#table1</code></li>
            <li>Usa <code>page.eval_on_selector_all()</code> para extraer todos los emails de la tabla</li>
            <li>Usa <code>page.evaluate()</code> para escribir un objeto en <code>localStorage</code> y luego leerlo</li>
            <li>Usa <code>page.eval_on_selector()</code> para obtener el <code>font-size</code> computado del heading</li>
            <li>Inyecta un script con <code>add_script_tag()</code> que añada una función helper y luego úsala con evaluate</li>
            <li>Captura los <code>console.log</code> del navegador en Python usando <code>page.on("console", ...)</code></li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Comprender cuándo y por qué ejecutar JavaScript desde Playwright</li>
                <li>Dominar <code>page.evaluate()</code> para leer y modificar estado del navegador</li>
                <li>Pasar argumentos de Python a JavaScript y recibir resultados</li>
                <li>Usar <code>evaluate_handle</code>, <code>eval_on_selector</code> y <code>locator.evaluate</code> según el caso</li>
                <li>Inyectar scripts/estilos y exponer funciones Python al navegador</li>
                <li>Conocer las limitaciones de serialización y buenas prácticas de seguridad</li>
            </ul>
        </div>

        <h3>➡️ Siguiente: Drag and drop, hover, right-click</h3>
        <p>En la siguiente lección aprenderás a automatizar interacciones avanzadas del mouse:
        arrastrar y soltar, hover para revelar elementos ocultos y clic derecho para
        menús contextuales.</p>
    `,
    topics: ["javascript", "evaluate", "ejecución"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 8,
    difficulty: "medium",
    type: "foundation"
};

if (typeof window !== 'undefined') {
    window.LESSON_045 = LESSON_045;
}
