/**
 * Playwright Academy - Lección 023
 * Manejo de archivos y datos (JSON, YAML, CSV)
 * Sección 3: Python para Testers QA
 */

const LESSON_023 = {
    id: 23,
    title: "Manejo de archivos y datos (JSON, YAML, CSV)",
    duration: "5 min",
    level: "beginner",
    section: "section-03",
    content: `
        <h2>📂 Manejo de archivos y datos (JSON, YAML, CSV)</h2>
        <p>En automatización de pruebas, los datos de test rara vez se colocan directamente en el código.
        En su lugar, los almacenamos en archivos externos como JSON, YAML o CSV. Esto permite
        <strong>data-driven testing</strong>: separar los datos de la lógica del test para mayor
        mantenibilidad y reutilización.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎯 ¿Por qué archivos externos para datos de test?</h4>
            <ul>
                <li><strong>Separación de responsabilidades:</strong> el test define la lógica, el archivo define los datos</li>
                <li><strong>Reutilización:</strong> los mismos datos pueden alimentar múltiples tests</li>
                <li><strong>Mantenimiento:</strong> cambiar datos sin tocar el código de test</li>
                <li><strong>Colaboración:</strong> analistas de negocio pueden editar datos sin saber Python</li>
            </ul>
        </div>

        <h3>📖 Lectura y escritura de archivos con open()</h3>
        <p>Python usa la función <code>open()</code> junto con el <strong>context manager</strong>
        (<code>with</code>) para manejar archivos de forma segura:</p>
        <div class="code-tabs" data-code-id="L023-1">
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
                <pre><code class="language-python"># Lectura básica de un archivo de texto
with open("datos.txt", "r", encoding="utf-8") as archivo:
    contenido = archivo.read()
    print(contenido)

# Escritura de un archivo de texto
with open("resultado.txt", "w", encoding="utf-8") as archivo:
    archivo.write("Test ejecutado exitosamente\\n")
    archivo.write("Total de casos: 15\\n")

# Agregar contenido sin sobrescribir (modo "a" = append)
with open("log_tests.txt", "a", encoding="utf-8") as archivo:
    archivo.write("2026-04-03 10:30 - test_login: PASSED\\n")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import * as fs from 'fs';

// Lectura básica de un archivo de texto
const contenido = fs.readFileSync('datos.txt', 'utf-8');
console.log(contenido);

// Escritura de un archivo de texto
fs.writeFileSync('resultado.txt', 'Test ejecutado exitosamente\\n' +
    'Total de casos: 15\\n', 'utf-8');

// Agregar contenido sin sobrescribir (flag 'a' = append)
fs.appendFileSync('log_tests.txt',
    '2026-04-03 10:30 - test_login: PASSED\\n', 'utf-8');</code></pre>
            </div>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚠️ ¿Por qué usar <code>with</code> (context manager)?</h4>
            <p>El bloque <code>with</code> garantiza que el archivo se cierre automáticamente
            al salir del bloque, incluso si ocurre un error. Sin <code>with</code>, un error
            podría dejar el archivo abierto, causando fugas de recursos.</p>
            <div class="code-tabs" data-code-id="L023-2">
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
                    <pre><code class="language-python"># ❌ EVITAR - El archivo podría no cerrarse si hay un error
archivo = open("datos.txt", "r")
contenido = archivo.read()    # Si falla aquí, el archivo queda abierto
archivo.close()

# ✅ CORRECTO - El archivo se cierra automáticamente
with open("datos.txt", "r") as archivo:
    contenido = archivo.read()  # Si falla, el archivo se cierra igual</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-typescript">// En Node.js/TypeScript, readFileSync cierra automáticamente.
// Para streams, usar try/finally:

// ❌ EVITAR con streams
const stream = fs.createReadStream('datos.txt');
// Si falla aquí, el stream podría quedar abierto

// ✅ CORRECTO - try/finally para streams
const readStream = fs.createReadStream('datos.txt');
try {
    // ... procesar stream
} finally {
    readStream.destroy();  // Siempre se cierra
}</code></pre>
                </div>
            </div>
        </div>

        <h3>🔷 Modos de apertura de archivos</h3>
        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #e8f5e9;">
                <th style="padding: 8px; border: 1px solid #ddd;">Modo</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Descripción</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Uso en testing</th>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>"r"</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Lectura (por defecto)</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Cargar datos de test</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>"w"</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Escritura (sobrescribe)</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Guardar reportes</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>"a"</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Append (agrega al final)</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Logs de ejecución</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;"><code>"r+"</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Lectura y escritura</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Actualizar archivos existentes</td>
            </tr>
        </table>

        <h3>📋 JSON: El formato estrella para datos de test</h3>
        <p>JSON (JavaScript Object Notation) es el formato más usado para datos de test
        estructurados. Python lo maneja con el módulo built-in <code>json</code>:</p>

        <div class="code-tabs" data-code-id="L023-3">
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

# --- Leer JSON desde un archivo ---
# Archivo: test_data/usuarios.json
# {
#     "usuario_admin": {
#         "username": "admin",
#         "password": "Admin123!",
#         "rol": "administrador"
#     },
#     "usuario_regular": {
#         "username": "jperez",
#         "password": "Test456!",
#         "rol": "usuario"
#     }
# }

with open("test_data/usuarios.json", "r", encoding="utf-8") as f:
    usuarios = json.load(f)  # Convierte JSON -> dict de Python

print(usuarios["usuario_admin"]["username"])  # "admin"
print(usuarios["usuario_regular"]["rol"])     # "usuario"</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import * as fs from 'fs';

// --- Leer JSON desde un archivo ---
// Archivo: test_data/usuarios.json (mismo contenido)

const rawData = fs.readFileSync('test_data/usuarios.json', 'utf-8');
const usuarios = JSON.parse(rawData);

console.log(usuarios.usuario_admin.username);  // 'admin'
console.log(usuarios.usuario_regular.rol);     // 'usuario'

// O en Playwright Test, importar directamente:
// import usuarios from './test_data/usuarios.json';
// (requiere "resolveJsonModule": true en tsconfig.json)</code></pre>
            </div>
        </div>

        <div class="code-tabs" data-code-id="L023-4">
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
                <pre><code class="language-python"># --- Escribir resultados en JSON ---
resultados = {
    "suite": "smoke_tests",
    "total": 15,
    "passed": 14,
    "failed": 1,
    "tests_fallidos": ["test_checkout_con_descuento"]
}

with open("resultados.json", "w", encoding="utf-8") as f:
    json.dump(resultados, f, indent=4, ensure_ascii=False)
    # indent=4: formato legible
    # ensure_ascii=False: permite caracteres como ñ, á, etc.</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// --- Escribir resultados en JSON ---
const resultados = {
    suite: 'smoke_tests',
    total: 15,
    passed: 14,
    failed: 1,
    testsFallidos: ['test_checkout_con_descuento'],
};

fs.writeFileSync(
    'resultados.json',
    JSON.stringify(resultados, null, 4),  // null, 4 = formato legible con indent
    'utf-8'
);</code></pre>
            </div>
        </div>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔑 json.load() vs json.loads()</h4>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #e1bee7;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Función</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Entrada</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Uso</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>json.load(f)</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Archivo (file object)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Leer desde archivo .json</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>json.loads(s)</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">String</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Parsear respuesta de API</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>json.dump(obj, f)</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Objeto -> Archivo</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Guardar datos en .json</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>json.dumps(obj)</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Objeto -> String</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Construir body para POST</td>
                </tr>
            </table>
        </div>

        <h3>🎭 JSON para data-driven testing con Playwright</h3>
        <div class="code-tabs" data-code-id="L023-5">
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
                <pre><code class="language-python"># test_data/login_scenarios.json
# [
#     {"username": "admin", "password": "Admin123!", "esperado": "dashboard"},
#     {"username": "admin", "password": "clave_mala", "esperado": "error"},
#     {"username": "", "password": "", "esperado": "error_campos_vacios"}
# ]

import json
import pytest
from playwright.sync_api import Page, expect

# Cargar datos de test desde JSON
with open("test_data/login_scenarios.json", "r") as f:
    login_data = json.load(f)

@pytest.mark.parametrize("escenario", login_data)
def test_login_con_datos_json(page: Page, escenario):
    """Test parametrizado con datos de archivo JSON."""
    page.goto("/login")
    page.fill("#username", escenario["username"])
    page.fill("#password", escenario["password"])
    page.click("button[type='submit']")

    if escenario["esperado"] == "dashboard":
        expect(page).to_have_url("**/dashboard")
    elif escenario["esperado"] == "error":
        expect(page.locator(".error-message")).to_be_visible()
    else:
        expect(page.locator(".field-error")).to_be_visible()</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// test_data/login_scenarios.json (mismo archivo)
import { test, expect } from '@playwright/test';
import * as fs from 'fs';

interface LoginScenario {
    username: string;
    password: string;
    esperado: string;
}

// Cargar datos de test desde JSON
const loginData: LoginScenario[] = JSON.parse(
    fs.readFileSync('test_data/login_scenarios.json', 'utf-8')
);

for (const escenario of loginData) {
    test(\`login - \${escenario.esperado}\`, async ({ page }) => {
        await page.goto('/login');
        await page.fill('#username', escenario.username);
        await page.fill('#password', escenario.password);
        await page.click("button[type='submit']");

        if (escenario.esperado === 'dashboard') {
            await expect(page).toHaveURL('**/dashboard');
        } else if (escenario.esperado === 'error') {
            await expect(page.locator('.error-message')).toBeVisible();
        } else {
            await expect(page.locator('.field-error')).toBeVisible();
        }
    });
}</code></pre>
            </div>
        </div>

        <h3>📄 YAML: Configuración legible para humanos</h3>
        <p>YAML es ideal para archivos de configuración por su sintaxis limpia.
        Requiere instalar la librería <code>PyYAML</code>:</p>
        <div class="code-tabs" data-code-id="L023-6">
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
                <pre><code class="language-bash">pip install pyyaml</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <div class="code-note">
                    <span class="code-note-icon">ℹ️</span>
                    <span class="code-note-text">Equivalente con Playwright Test (TypeScript):</span>
                </div>
                <pre><code class="language-bash">npm install js-yaml @types/js-yaml</code></pre>
            </div>
        </div>

        <div class="code-tabs" data-code-id="L023-7">
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
                <pre><code class="language-python">import yaml

# --- Leer configuración YAML ---
# Archivo: config/test_config.yaml
# ---
# entorno: staging
# base_url: "https://staging.miapp.com"
# browser: chromium
# headless: true
# timeouts:
#   navigation: 30000
#   action: 5000
# credenciales:
#   admin:
#     username: admin
#     password: Admin123!
#   tester:
#     username: tester_qa
#     password: Test456!
# screenshots:
#   on_failure: true
#   directorio: "test-results/screenshots"

with open("config/test_config.yaml", "r", encoding="utf-8") as f:
    config = yaml.safe_load(f)  # safe_load es más seguro que load

print(config["base_url"])                        # "https://staging.miapp.com"
print(config["timeouts"]["navigation"])           # 30000
print(config["credenciales"]["admin"]["username"]) # "admin"</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import * as yaml from 'js-yaml';
import * as fs from 'fs';

// --- Leer configuración YAML ---
// Archivo: config/test_config.yaml (mismo contenido)

const rawYaml = fs.readFileSync('config/test_config.yaml', 'utf-8');
const config = yaml.load(rawYaml) as Record&lt;string, any&gt;;

console.log(config.base_url);                        // 'https://staging.miapp.com'
console.log(config.timeouts.navigation);              // 30000
console.log(config.credenciales.admin.username);      // 'admin'</code></pre>
            </div>
        </div>

        <div style="background: #fff8e1; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🛡️ yaml.safe_load() vs yaml.load()</h4>
            <p><strong>Siempre usa <code>yaml.safe_load()</code></strong>. La función <code>yaml.load()</code>
            sin el parámetro <code>Loader</code> puede ejecutar código Python arbitrario
            contenido en el YAML, lo cual es un riesgo de seguridad grave.</p>
        </div>

        <div class="code-tabs" data-code-id="L023-8">
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
                <pre><code class="language-python"># --- Uso práctico: fixture que carga config YAML ---
# conftest.py
import pytest
import yaml

@pytest.fixture(scope="session")
def test_config():
    """Carga la configuración del entorno de pruebas."""
    with open("config/test_config.yaml", "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args, test_config):
    """Aplica la configuración del YAML al contexto del browser."""
    return {
        **browser_context_args,
        "base_url": test_config["base_url"],
        "viewport": {"width": 1280, "height": 720},
    }

# test_con_config.py
def test_pagina_principal(page, test_config):
    page.goto("/")
    page.set_default_timeout(test_config["timeouts"]["action"])
    # El test usa configuración del YAML</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// En Playwright Test, la configuración va en playwright.config.ts
// No se necesita fixture; se usa directamente el archivo de config.

// playwright.config.ts
import { defineConfig } from '@playwright/test';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

const config = yaml.load(
    fs.readFileSync('config/test_config.yaml', 'utf-8')
) as Record&lt;string, any&gt;;

export default defineConfig({
    use: {
        baseURL: config.base_url,
        viewport: { width: 1280, height: 720 },
    },
    timeout: config.timeouts.navigation,
});

// test_con_config.spec.ts
import { test, expect } from '@playwright/test';

test('pagina principal', async ({ page }) => {
    await page.goto('/');
    // baseURL ya configurada desde el YAML
});</code></pre>
            </div>
        </div>

        <div class="code-tabs" data-code-id="L023-9">
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
                <pre><code class="language-python"># --- Escribir YAML (generar reportes o configs) ---
import yaml

reporte = {
    "suite": "regression",
    "ambiente": "staging",
    "resultados": {
        "total": 50,
        "passed": 48,
        "failed": 2
    },
    "tests_fallidos": [
        "test_checkout_descuento",
        "test_reporte_pdf"
    ]
}

with open("reporte_ejecucion.yaml", "w", encoding="utf-8") as f:
    yaml.dump(reporte, f, default_flow_style=False, allow_unicode=True)
    # default_flow_style=False: formato bloque legible
    # allow_unicode=True: permite ñ, á, etc.</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// --- Escribir YAML (generar reportes o configs) ---
import * as yaml from 'js-yaml';
import * as fs from 'fs';

const reporte = {
    suite: 'regression',
    ambiente: 'staging',
    resultados: {
        total: 50,
        passed: 48,
        failed: 2,
    },
    testsFallidos: [
        'test_checkout_descuento',
        'test_reporte_pdf',
    ],
};

fs.writeFileSync(
    'reporte_ejecucion.yaml',
    yaml.dump(reporte, { flowLevel: -1 }),  // flowLevel -1 = formato bloque
    'utf-8'
);</code></pre>
            </div>
        </div>

        <h3>📊 CSV: Datos tabulares para tests parametrizados</h3>
        <p>CSV (Comma-Separated Values) es perfecto para datos tabulares
        y tests parametrizados masivos. Python lo maneja con el módulo built-in <code>csv</code>:</p>

        <div class="code-tabs" data-code-id="L023-10">
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
                <pre><code class="language-python">import csv

# --- Archivo: test_data/productos.csv ---
# nombre,precio,categoria,stock
# "Laptop HP",2500000,tecnología,15
# "Mouse inalámbrico",85000,accesorios,200
# "Monitor 27 pulgadas",1200000,tecnología,8
# "Teclado mecánico",350000,accesorios,45

# Leer con csv.reader (acceso por índice)
with open("test_data/productos.csv", "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    header = next(reader)  # Saltar encabezado
    for fila in reader:
        nombre = fila[0]
        precio = int(fila[1])
        print(f"{nombre}: \${precio:,}")

# Leer con csv.DictReader (acceso por nombre de columna) ✅ Recomendado
with open("test_data/productos.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for fila in reader:
        print(f"{fila['nombre']}: \${int(fila['precio']):,} - {fila['categoria']}")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import * as fs from 'fs';
// npm install csv-parse (o parsear manualmente)

// --- Parseo manual de CSV ---
const csvContent = fs.readFileSync('test_data/productos.csv', 'utf-8');
const lines = csvContent.trim().split('\\n');
const headers = lines[0].split(',');

// Acceso por índice
for (const line of lines.slice(1)) {
    const fila = line.split(',');
    const nombre = fila[0].replace(/"/g, '');
    const precio = parseInt(fila[1]);
    console.log(\`\${nombre}: \$\${precio.toLocaleString()}\`);
}

// Acceso por nombre de columna (tipo DictReader)
const filas = lines.slice(1).map(line => {
    const valores = line.split(',');
    return Object.fromEntries(headers.map((h, i) => [h, valores[i]]));
});

for (const fila of filas) {
    console.log(\`\${fila.nombre}: \$\${parseInt(fila.precio).toLocaleString()} - \${fila.categoria}\`);
}</code></pre>
            </div>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 csv.reader vs csv.DictReader</h4>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #c8e6c9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Método</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Acceso</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Ventaja</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>csv.reader</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>fila[0]</code>, <code>fila[1]</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Ligeramente más rápido</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>csv.DictReader</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>fila["nombre"]</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Mucho más legible y mantenible ✅</td>
                </tr>
            </table>
        </div>

        <div class="code-tabs" data-code-id="L023-11">
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
                <pre><code class="language-python"># --- CSV para tests parametrizados con Playwright ---
import csv
import pytest
from playwright.sync_api import Page, expect

def cargar_datos_csv(ruta):
    """Carga datos desde un CSV y los retorna como lista de diccionarios."""
    with open(ruta, "r", encoding="utf-8") as f:
        return list(csv.DictReader(f))

# Archivo: test_data/busquedas.csv
# termino,resultados_esperados,categoria
# laptop,5,tecnología
# mouse,3,accesorios
# xyz_no_existe,0,ninguna

datos_busqueda = cargar_datos_csv("test_data/busquedas.csv")

@pytest.mark.parametrize("datos", datos_busqueda)
def test_busqueda_productos(page: Page, datos):
    """Test parametrizado con datos de CSV."""
    page.goto("/buscar")
    page.fill("#campo-busqueda", datos["termino"])
    page.click("#btn-buscar")

    resultados = page.locator(".resultado-producto")
    expected = int(datos["resultados_esperados"])

    if expected == 0:
        expect(page.locator(".sin-resultados")).to_be_visible()
    else:
        expect(resultados).to_have_count(expected)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// --- CSV para tests parametrizados con Playwright Test ---
import { test, expect } from '@playwright/test';
import * as fs from 'fs';

function cargarDatosCsv(ruta: string): Record&lt;string, string&gt;[] {
    const content = fs.readFileSync(ruta, 'utf-8');
    const lines = content.trim().split('\\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        const valores = line.split(',');
        return Object.fromEntries(headers.map((h, i) => [h, valores[i]]));
    });
}

const datosBusqueda = cargarDatosCsv('test_data/busquedas.csv');

for (const datos of datosBusqueda) {
    test(\`busqueda - \${datos.termino}\`, async ({ page }) => {
        await page.goto('/buscar');
        await page.fill('#campo-busqueda', datos.termino);
        await page.click('#btn-buscar');

        const resultados = page.locator('.resultado-producto');
        const expected = parseInt(datos.resultados_esperados);

        if (expected === 0) {
            await expect(page.locator('.sin-resultados')).toBeVisible();
        } else {
            await expect(resultados).toHaveCount(expected);
        }
    });
}</code></pre>
            </div>
        </div>

        <div class="code-tabs" data-code-id="L023-12">
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
                <pre><code class="language-python"># --- Escribir resultados en CSV ---
import csv

resultados_tests = [
    {"test": "test_login", "estado": "PASSED", "duracion": "1.2s"},
    {"test": "test_checkout", "estado": "FAILED", "duracion": "3.5s"},
    {"test": "test_perfil", "estado": "PASSED", "duracion": "0.8s"},
]

with open("resultados.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["test", "estado", "duracion"])
    writer.writeheader()        # Escribe la fila de encabezados
    writer.writerows(resultados_tests)  # Escribe todas las filas</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// --- Escribir resultados en CSV ---
import * as fs from 'fs';

const resultadosTests = [
    { test: 'test_login', estado: 'PASSED', duracion: '1.2s' },
    { test: 'test_checkout', estado: 'FAILED', duracion: '3.5s' },
    { test: 'test_perfil', estado: 'PASSED', duracion: '0.8s' },
];

const headers = Object.keys(resultadosTests[0]);
const csvLines = [
    headers.join(','),
    ...resultadosTests.map(r => headers.map(h => r[h as keyof typeof r]).join(','))
];

fs.writeFileSync('resultados.csv', csvLines.join('\\n'), 'utf-8');</code></pre>
            </div>
        </div>

        <h3>🗂️ pathlib.Path: Rutas multiplataforma</h3>
        <p>El módulo <code>pathlib</code> proporciona rutas de archivos que funcionan
        en Windows, Linux y macOS sin preocuparte por las barras <code>/</code> o <code>\\</code>:</p>

        <div class="code-tabs" data-code-id="L023-13">
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
                <pre><code class="language-python">from pathlib import Path

# Construir rutas de forma segura (funciona en cualquier OS)
base = Path(__file__).parent           # Directorio del archivo actual
data_dir = base / "test_data"          # Subdirectorio de datos
json_file = data_dir / "usuarios.json" # Archivo específico

print(json_file)          # tests/test_data/usuarios.json (Linux/Mac)
                          # tests\\test_data\\usuarios.json (Windows)
print(json_file.exists()) # True/False

# Crear directorios si no existen
screenshots_dir = base / "screenshots"
screenshots_dir.mkdir(parents=True, exist_ok=True)

# Leer archivo usando pathlib
import json
config = json.loads(json_file.read_text(encoding="utf-8"))

# Listar archivos CSV en un directorio
archivos_csv = list(data_dir.glob("*.csv"))
print(f"Encontrados {len(archivos_csv)} archivos CSV")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import * as path from 'path';
import * as fs from 'fs';

// Construir rutas de forma segura (funciona en cualquier OS)
const base = path.dirname(__filename);                     // Directorio actual
const dataDir = path.join(base, 'test_data');              // Subdirectorio
const jsonFile = path.join(dataDir, 'usuarios.json');      // Archivo específico

console.log(jsonFile);             // tests/test_data/usuarios.json
console.log(fs.existsSync(jsonFile)); // true/false

// Crear directorios si no existen
const screenshotsDir = path.join(base, 'screenshots');
fs.mkdirSync(screenshotsDir, { recursive: true });

// Leer archivo
const config = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));

// Listar archivos CSV en un directorio
const archivosCsv = fs.readdirSync(dataDir).filter(f => f.endsWith('.csv'));
console.log(\`Encontrados \${archivosCsv.length} archivos CSV\`);</code></pre>
            </div>
        </div>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎭 Patrón completo: conftest.py con pathlib</h4>
            <div class="code-tabs" data-code-id="L023-14">
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
import json
import yaml
from pathlib import Path

# Directorio raíz del proyecto de tests
ROOT = Path(__file__).parent
DATA_DIR = ROOT / "test_data"
CONFIG_DIR = ROOT / "config"

@pytest.fixture(scope="session")
def test_config():
    """Carga configuración YAML del ambiente."""
    config_file = CONFIG_DIR / "test_config.yaml"
    return yaml.safe_load(config_file.read_text(encoding="utf-8"))

@pytest.fixture(scope="session")
def usuarios():
    """Carga datos de usuarios desde JSON."""
    usuarios_file = DATA_DIR / "usuarios.json"
    return json.loads(usuarios_file.read_text(encoding="utf-8"))

@pytest.fixture(autouse=True)
def crear_directorio_screenshots():
    """Asegura que el directorio de screenshots existe."""
    (ROOT / "screenshots").mkdir(exist_ok=True)</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-typescript">// playwright.config.ts
import { defineConfig } from '@playwright/test';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'test_data');
const CONFIG_DIR = path.join(ROOT, 'config');

// Cargar configuración YAML
const configFile = path.join(CONFIG_DIR, 'test_config.yaml');
const testConfig = yaml.load(fs.readFileSync(configFile, 'utf-8')) as any;

// Cargar usuarios JSON
const usuariosFile = path.join(DATA_DIR, 'usuarios.json');
const usuarios = JSON.parse(fs.readFileSync(usuariosFile, 'utf-8'));

// Asegurar directorio de screenshots
fs.mkdirSync(path.join(ROOT, 'screenshots'), { recursive: true });

export default defineConfig({
    use: {
        baseURL: testConfig.base_url,
    },
});</code></pre>
                </div>
            </div>
        </div>

        <h3>📊 Comparativa de formatos</h3>
        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #e8eaf6;">
                <th style="padding: 8px; border: 1px solid #ddd;">Criterio</th>
                <th style="padding: 8px; border: 1px solid #ddd;">JSON</th>
                <th style="padding: 8px; border: 1px solid #ddd;">YAML</th>
                <th style="padding: 8px; border: 1px solid #ddd;">CSV</th>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">Estructura</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Jerárquica (objetos anidados)</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Jerárquica (indentación)</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Tabular (filas y columnas)</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;">Legibilidad</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Media</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Alta ✅</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Alta (para tablas)</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">Librería</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Built-in (json)</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Externa (pyyaml)</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Built-in (csv)</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;">Mejor uso en QA</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Datos de test, payloads API</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Configuración de ambientes</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Tests parametrizados masivos</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">Comentarios</td>
                <td style="padding: 8px; border: 1px solid #ddd;">No soporta</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Soporta (#) ✅</td>
                <td style="padding: 8px; border: 1px solid #ddd;">No soporta</td>
            </tr>
        </table>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Crea un mini proyecto con la siguiente estructura y archivos:</p>
            <pre><code>mi_proyecto_tests/
├── config/
│   └── config.yaml          # Configuración del ambiente
├── test_data/
│   ├── usuarios.json         # Datos de login (3 escenarios)
│   └── productos.csv         # Datos de búsqueda (5 productos)
├── conftest.py               # Fixtures que cargan los archivos
└── test_data_driven.py       # Tests parametrizados</code></pre>
        </div>
        <ol>
            <li>Crea <code>config/config.yaml</code> con base_url, browser y timeouts</li>
            <li>Crea <code>test_data/usuarios.json</code> con al menos 3 escenarios de login (exitoso, contraseña incorrecta, campos vacíos)</li>
            <li>Crea <code>test_data/productos.csv</code> con columnas: nombre, precio, disponible</li>
            <li>En <code>conftest.py</code>: usa <code>pathlib.Path</code> para crear fixtures <code>test_config</code> y <code>usuarios</code></li>
            <li>En <code>test_data_driven.py</code>:
                <ul>
                    <li>Escribe un test parametrizado con los datos del JSON usando <code>@pytest.mark.parametrize</code></li>
                    <li>Escribe otro test parametrizado con los datos del CSV</li>
                </ul>
            </li>
            <li>Ejecuta: <code>pytest test_data_driven.py -v</code></li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Leer y escribir archivos con <code>open()</code> y context managers (<code>with</code>)</li>
                <li>Manejar JSON con <code>json.load()</code>, <code>json.dump()</code>, <code>json.loads()</code>, <code>json.dumps()</code></li>
                <li>Cargar configuración YAML con <code>yaml.safe_load()</code></li>
                <li>Leer datos tabulares con <code>csv.DictReader</code></li>
                <li>Usar <code>pathlib.Path</code> para rutas multiplataforma</li>
                <li>Aplicar data-driven testing con archivos externos en Playwright</li>
            </ul>
        </div>
    `,
    topics: ["archivos", "json", "yaml", "csv"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_023 = LESSON_023;
}
