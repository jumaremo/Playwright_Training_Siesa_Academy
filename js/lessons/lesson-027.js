/**
 * Playwright Academy - Lección 027
 * Manejo de excepciones en tests
 * Sección 3: Python para Testers QA
 */

const LESSON_027 = {
    id: 27,
    title: "Manejo de excepciones en tests",
    duration: "5 min",
    level: "beginner",
    section: "section-03",
    content: `
        <h2>⚠️ Manejo de excepciones en tests</h2>
        <p>Los tests automatizados interactúan con sistemas reales que pueden fallar de maneras inesperadas:
        timeouts, elementos que no aparecen, conexiones perdidas. Un buen manejo de excepciones
        es la diferencia entre un framework frágil y uno robusto.</p>

        <h3>🏗️ Jerarquía de excepciones en Python</h3>
        <p>Python organiza todas las excepciones en una jerarquía de clases. Entenderla te permite
        capturar exactamente lo que necesitas:</p>
        <div class="code-tabs" data-code-id="L027-1">
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
                <pre><code class="language-python"># Jerarquía simplificada de excepciones en Python
BaseException
├── SystemExit              # sys.exit()
├── KeyboardInterrupt       # Ctrl+C
├── GeneratorExit           # Cierre de generadores
└── Exception               # ← Aquí heredan casi todas
    ├── StopIteration
    ├── ArithmeticError
    │   ├── ZeroDivisionError
    │   └── OverflowError
    ├── LookupError
    │   ├── IndexError
    │   └── KeyError
    ├── OSError
    │   ├── FileNotFoundError
    │   └── PermissionError
    ├── ValueError
    ├── TypeError
    ├── AttributeError
    ├── RuntimeError
    ├── TimeoutError          # ← Importante en Playwright
    └── AssertionError        # ← Lo que lanza assert/pytest</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Jerarquía de errores en TypeScript / JavaScript
// JavaScript tiene una jerarquía más simple:

Error                        // ← Clase base de todos los errores
├── RangeError               // Valor fuera de rango
├── ReferenceError           // Variable no definida
├── SyntaxError              // Error de sintaxis
├── TypeError                // Tipo incorrecto
├── URIError                 // URI malformada
└── (Errores personalizados) // extends Error

// Errores específicos de Playwright:
// - TimeoutError             → import { errors } from '@playwright/test'
// - errors.TimeoutError      → Cuando una acción excede el timeout
// - Error                    → Errores generales de Playwright

// En TypeScript, los errores NO tienen jerarquía de herencia
// tan rica como Python. Se usa instanceof para distinguirlos.</code></pre>
            </div>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ff9800;">
            <strong>🔑 Regla de oro:</strong> Nunca captures <code>BaseException</code>.
            Siempre captura <code>Exception</code> o, mejor aún, excepciones específicas.
            Capturar <code>BaseException</code> atraparía <code>KeyboardInterrupt</code>
            y <code>SystemExit</code>, lo cual impide cerrar tu programa correctamente.
        </div>

        <h3>🧱 Bloques try / except / else / finally</h3>
        <p>Python ofrece cuatro bloques para gestionar excepciones. Cada uno tiene un propósito claro:</p>
        <div class="code-tabs" data-code-id="L027-2">
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
                <pre><code class="language-python"># Estructura completa de manejo de excepciones
def realizar_login(page, usuario, clave):
    """Intenta hacer login y maneja posibles fallos."""
    try:
        # Código que puede lanzar excepciones
        page.goto("/login", timeout=5000)
        page.fill("#username", usuario)
        page.fill("#password", clave)
        page.click("button[type='submit']")
        page.wait_for_url("**/secure", timeout=5000)

    except TimeoutError:
        # Se ejecuta SOLO si ocurre TimeoutError
        print(f"⏱️ Timeout al intentar login con '{usuario}'")
        page.screenshot(path="error_login_timeout.png")
        return False

    except Exception as e:
        # Se ejecuta para CUALQUIER otra excepción
        print(f"❌ Error inesperado en login: {type(e).__name__}: {e}")
        return False

    else:
        # Se ejecuta SOLO si NO hubo excepción
        print(f"✅ Login exitoso para '{usuario}'")
        return True

    finally:
        # Se ejecuta SIEMPRE, haya o no excepción
        print("🔄 Bloque finally: limpieza completada")</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { Page } from '@playwright/test';

// Estructura completa de manejo de excepciones en TypeScript
async function realizarLogin(
    page: Page, usuario: string, clave: string
): Promise<boolean> {
    let loginExitoso = false;

    try {
        // Código que puede lanzar excepciones
        await page.goto('/login', { timeout: 5000 });
        await page.fill('#username', usuario);
        await page.fill('#password', clave);
        await page.click("button[type='submit']");
        await page.waitForURL('**/secure', { timeout: 5000 });
        loginExitoso = true;

    } catch (error) {
        // TypeScript usa un solo catch (no múltiples como Python)
        if (error instanceof Error && error.message.includes('Timeout')) {
            console.log(\`⏱️ Timeout al intentar login con '\${usuario}'\`);
            await page.screenshot({ path: 'error_login_timeout.png' });
        } else {
            console.log(\`❌ Error inesperado en login: \${error}\`);
        }
        return false;

    } finally {
        // Se ejecuta SIEMPRE, haya o no excepción
        console.log('🔄 Bloque finally: limpieza completada');
    }

    // Equivalente al bloque "else" de Python (solo se alcanza si no hubo error)
    if (loginExitoso) {
        console.log(\`✅ Login exitoso para '\${usuario}'\`);
    }
    return loginExitoso;
}</code></pre>
            </div>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📋 Resumen de bloques:</h4>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #c8e6c9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Bloque</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">¿Cuándo se ejecuta?</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">¿Obligatorio?</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>try</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Siempre (contiene el código riesgoso)</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Sí</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>except</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Solo si ocurre una excepción</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Sí (al menos uno)</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>else</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Solo si NO hubo excepción</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">No</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>finally</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Siempre (haya o no excepción)</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">No</td>
                </tr>
            </table>
        </div>

        <h3>🎯 Capturar excepciones específicas vs genéricas</h3>
        <p>Siempre prefiere capturar excepciones específicas. Esto te da control preciso
        sobre cómo reaccionar ante cada tipo de error:</p>
        <div class="code-tabs" data-code-id="L027-3">
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
                <pre><code class="language-python"># ❌ MAL: Captura genérica - oculta bugs reales
try:
    page.click("#boton-pago")
except Exception:
    print("Algo falló")  # ¿Qué falló? No sabes.

# ✅ BIEN: Captura específica con manejo diferenciado
try:
    page.click("#boton-pago")
except TimeoutError:
    # El elemento no apareció a tiempo
    print("El botón de pago no apareció en el tiempo esperado")
    page.screenshot(path="debug_boton_pago.png")
except Error as e:
    # Error de Playwright (elemento no interactuable, etc.)
    print(f"Error de Playwright: {e}")

# ✅ MEJOR: Múltiples except ordenados de específico a genérico
from playwright.sync_api import TimeoutError as PlaywrightTimeout
from playwright.sync_api import Error as PlaywrightError

try:
    page.fill("#email", "test@ejemplo.com")
    page.click("#enviar")
    page.wait_for_selector(".confirmacion", timeout=3000)
except PlaywrightTimeout:
    print("⏱️ Timeout: la confirmación no apareció")
except PlaywrightError as e:
    print(f"🎭 Error de Playwright: {e}")
except ValueError as e:
    print(f"📝 Valor inválido: {e}")
except Exception as e:
    print(f"❓ Error inesperado: {type(e).__name__}: {e}")
    raise  # Re-lanzar para que pytest lo reporte</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { Page, errors } from '@playwright/test';

// ❌ MAL: Captura genérica - oculta bugs reales
try {
    await page.click('#boton-pago');
} catch (e) {
    console.log('Algo falló'); // ¿Qué falló? No sabes.
}

// ✅ BIEN: Captura específica con instanceof
try {
    await page.click('#boton-pago');
} catch (error) {
    if (error instanceof errors.TimeoutError) {
        // El elemento no apareció a tiempo
        console.log('El botón de pago no apareció en el tiempo esperado');
        await page.screenshot({ path: 'debug_boton_pago.png' });
    } else if (error instanceof Error) {
        // Error general de Playwright
        console.log(\`Error de Playwright: \${error.message}\`);
    }
}

// ✅ MEJOR: Distinguir múltiples tipos con instanceof
try {
    await page.fill('#email', 'test@ejemplo.com');
    await page.click('#enviar');
    await page.waitForSelector('.confirmacion', { timeout: 3000 });
} catch (error) {
    if (error instanceof errors.TimeoutError) {
        console.log('⏱️ Timeout: la confirmación no apareció');
    } else if (error instanceof TypeError) {
        console.log(\`📝 Tipo inválido: \${error.message}\`);
    } else if (error instanceof Error) {
        console.log(\`❓ Error inesperado: \${error.constructor.name}: \${error.message}\`);
        throw error; // Re-lanzar para que Playwright Test lo reporte
    }
}</code></pre>
            </div>
        </div>

        <div style="background: #fce4ec; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #e53935;">
            <strong>⚠️ Cuidado:</strong> En tests, capturar <code>AssertionError</code> genéricamente
            es peligroso porque oculta fallos legítimos de assertions. Si tu test captura
            <code>AssertionError</code>, el test pasará cuando debería fallar.
        </div>

        <h3>🚀 Lanzar excepciones con raise</h3>
        <p>Usa <code>raise</code> para señalar errores explícitamente en tu código de testing:</p>
        <div class="code-tabs" data-code-id="L027-4">
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
                <pre><code class="language-python"># Lanzar una excepción nueva
def verificar_ambiente(ambiente):
    """Valida que el ambiente sea correcto antes de ejecutar tests."""
    ambientes_validos = ["dev", "staging", "prod"]
    if ambiente not in ambientes_validos:
        raise ValueError(
            f"Ambiente '{ambiente}' no válido. "
            f"Opciones: {', '.join(ambientes_validos)}"
        )

# Re-lanzar la excepción actual (preserva el traceback)
try:
    page.goto(url)
except TimeoutError:
    print(f"No se pudo acceder a {url}")
    page.screenshot(path="error_navegacion.png")
    raise  # Re-lanza el TimeoutError original

# Encadenar excepciones con 'from'
try:
    datos = cargar_configuracion("config.json")
except FileNotFoundError as original:
    raise RuntimeError(
        "No se encontró el archivo de configuración. "
        "Ejecuta 'setup.py' primero."
    ) from original  # Preserva la causa raíz</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Lanzar un error nuevo
function verificarAmbiente(ambiente: string): void {
    const ambientesValidos = ['dev', 'staging', 'prod'];
    if (!ambientesValidos.includes(ambiente)) {
        throw new Error(
            \`Ambiente '\${ambiente}' no válido. \` +
            \`Opciones: \${ambientesValidos.join(', ')}\`
        );
    }
}

// Re-lanzar el error actual (preserva el stack trace)
try {
    await page.goto(url);
} catch (error) {
    console.log(\`No se pudo acceder a \${url}\`);
    await page.screenshot({ path: 'error_navegacion.png' });
    throw error; // Re-lanza el error original
}

// Encadenar errores con cause (ES2022+)
try {
    const datos = cargarConfiguracion('config.json');
} catch (original) {
    throw new Error(
        'No se encontró el archivo de configuración. ' +
        "Ejecuta 'setup' primero.",
        { cause: original } // Preserva la causa raíz
    );
}</code></pre>
            </div>
        </div>

        <h3>🏭 Excepciones personalizadas para frameworks de test</h3>
        <p>Crear excepciones propias hace tu framework más expresivo y fácil de depurar:</p>
        <div class="code-tabs" data-code-id="L027-5">
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
                <pre><code class="language-python"># exceptions.py - Excepciones personalizadas del framework

class TestFrameworkError(Exception):
    """Excepción base del framework de testing."""
    pass


class ConfigurationError(TestFrameworkError):
    """Error en la configuración del framework."""
    def __init__(self, parametro, mensaje=""):
        self.parametro = parametro
        super().__init__(
            f"Error de configuración en '{parametro}': {mensaje}"
        )


class EnvironmentError(TestFrameworkError):
    """El ambiente de testing no está disponible."""
    def __init__(self, ambiente, url=""):
        self.ambiente = ambiente
        self.url = url
        super().__init__(
            f"Ambiente '{ambiente}' no disponible (URL: {url})"
        )


class ElementNotReadyError(TestFrameworkError):
    """Un elemento no está listo para interacción después de reintentos."""
    def __init__(self, selector, intentos=0):
        self.selector = selector
        self.intentos = intentos
        super().__init__(
            f"Elemento '{selector}' no listo después de "
            f"{intentos} intentos"
        )


class TestDataError(TestFrameworkError):
    """Error al cargar o procesar datos de prueba."""
    pass</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// errors.ts - Errores personalizados del framework

export class TestFrameworkError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'TestFrameworkError';
    }
}

export class ConfigurationError extends TestFrameworkError {
    parametro: string;
    constructor(parametro: string, mensaje: string = '') {
        super(\`Error de configuración en '\${parametro}': \${mensaje}\`);
        this.name = 'ConfigurationError';
        this.parametro = parametro;
    }
}

export class EnvironmentError extends TestFrameworkError {
    ambiente: string;
    url: string;
    constructor(ambiente: string, url: string = '') {
        super(\`Ambiente '\${ambiente}' no disponible (URL: \${url})\`);
        this.name = 'EnvironmentError';
        this.ambiente = ambiente;
        this.url = url;
    }
}

export class ElementNotReadyError extends TestFrameworkError {
    selector: string;
    intentos: number;
    constructor(selector: string, intentos: number = 0) {
        super(
            \`Elemento '\${selector}' no listo después de \` +
            \`\${intentos} intentos\`
        );
        this.name = 'ElementNotReadyError';
        this.selector = selector;
        this.intentos = intentos;
    }
}

export class TestDataError extends TestFrameworkError {
    constructor(message: string) {
        super(message);
        this.name = 'TestDataError';
    }
}</code></pre>
            </div>
        </div>

        <div class="code-tabs" data-code-id="L027-6">
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
                <pre><code class="language-python"># Uso de excepciones personalizadas en tests
from exceptions import (
    ConfigurationError,
    EnvironmentError,
    ElementNotReadyError
)

def setup_ambiente(config):
    """Configura el ambiente antes de los tests."""
    if not config.get("base_url"):
        raise ConfigurationError("base_url", "URL base es obligatoria")

    url = config["base_url"]
    try:
        response = requests.get(url, timeout=10)
        if response.status_code != 200:
            raise EnvironmentError(
                config["nombre"], url
            )
    except requests.ConnectionError:
        raise EnvironmentError(config["nombre"], url)


# En conftest.py
import pytest
from exceptions import TestFrameworkError

@pytest.fixture(scope="session", autouse=True)
def verificar_ambiente(request):
    """Fixture que verifica el ambiente antes de toda la suite."""
    try:
        setup_ambiente(cargar_config())
    except TestFrameworkError as e:
        pytest.exit(f"Error fatal del framework: {e}", returncode=1)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Uso de errores personalizados en tests
import { ConfigurationError, EnvironmentError } from './errors';

async function setupAmbiente(config: Record<string, any>): Promise<void> {
    if (!config.baseUrl) {
        throw new ConfigurationError('baseUrl', 'URL base es obligatoria');
    }

    const url = config.baseUrl;
    try {
        const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
        if (!response.ok) {
            throw new EnvironmentError(config.nombre, url);
        }
    } catch (error) {
        if (error instanceof EnvironmentError) throw error;
        throw new EnvironmentError(config.nombre, url);
    }
}

// En globalSetup.ts (equivalente a conftest.py session-scoped)
import { FullConfig } from '@playwright/test';
import { TestFrameworkError } from './errors';

async function globalSetup(config: FullConfig): Promise<void> {
    try {
        await setupAmbiente(cargarConfig());
    } catch (error) {
        if (error instanceof TestFrameworkError) {
            console.error(\`Error fatal del framework: \${error.message}\`);
            process.exit(1);
        }
        throw error;
    }
}

export default globalSetup;</code></pre>
            </div>
        </div>

        <h3>🧪 pytest.raises() - Verificar excepciones esperadas</h3>
        <p>En testing, a veces necesitas verificar que tu código <strong>lanza</strong>
        la excepción correcta. <code>pytest.raises()</code> es la herramienta para esto:</p>
        <div class="code-tabs" data-code-id="L027-7">
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
from exceptions import ConfigurationError, EnvironmentError

# Uso básico: verificar que se lanza la excepción
def test_config_sin_url_lanza_error():
    """Verificar que una config sin URL lanza ConfigurationError."""
    config_invalida = {"nombre": "dev"}  # Falta base_url

    with pytest.raises(ConfigurationError):
        setup_ambiente(config_invalida)


# Inspeccionar el mensaje de la excepción
def test_config_error_tiene_mensaje_descriptivo():
    """El error debe incluir el nombre del parámetro faltante."""
    config_invalida = {"nombre": "dev"}

    with pytest.raises(ConfigurationError) as exc_info:
        setup_ambiente(config_invalida)

    assert "base_url" in str(exc_info.value)
    assert exc_info.value.parametro == "base_url"


# Verificar con match (expresión regular)
def test_ambiente_invalido_mensaje():
    """El error debe mencionar el ambiente inválido."""
    with pytest.raises(ValueError, match=r"Ambiente '.*' no válido"):
        verificar_ambiente("produccion_vieja")


# Verificar que NO se lanza excepción (patrón implícito)
def test_config_valida_no_lanza_error():
    """Una configuración válida no debe lanzar excepciones."""
    config_valida = {
        "nombre": "dev",
        "base_url": "http://localhost:3000"
    }
    # Si lanza excepción, el test falla automáticamente
    setup_ambiente(config_valida)


# Combinar pytest.raises con Playwright
from playwright.sync_api import TimeoutError as PlaywrightTimeout

def test_elemento_inexistente_lanza_timeout(page):
    """Verificar que buscar un elemento inexistente da timeout."""
    page.goto("https://the-internet.herokuapp.com")

    with pytest.raises(PlaywrightTimeout):
        page.click("#elemento-que-no-existe", timeout=1000)</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect, errors } from '@playwright/test';
import { ConfigurationError } from './errors';

// Uso básico: verificar que se lanza el error
test('config sin url lanza error', async () => {
    const configInvalida = { nombre: 'dev' };

    // En Playwright Test, usa expect(...).toThrow() o try/catch
    expect(() => setupAmbiente(configInvalida)).rejects.toThrow(ConfigurationError);
});

// Inspeccionar el mensaje del error
test('config error tiene mensaje descriptivo', async () => {
    const configInvalida = { nombre: 'dev' };

    try {
        await setupAmbiente(configInvalida);
        // Si no lanza error, forzar fallo
        expect(true, 'Debería haber lanzado ConfigurationError').toBe(false);
    } catch (error) {
        expect(error).toBeInstanceOf(ConfigurationError);
        expect(error.message).toContain('baseUrl');
        expect((error as ConfigurationError).parametro).toBe('baseUrl');
    }
});

// Verificar con toThrow y regex
test('ambiente invalido mensaje', async () => {
    expect(() => verificarAmbiente('produccion_vieja'))
        .toThrow(/Ambiente '.*' no válido/);
});

// Verificar que NO se lanza error (patrón implícito)
test('config valida no lanza error', async () => {
    const configValida = {
        nombre: 'dev',
        baseUrl: 'http://localhost:3000',
    };
    // Si lanza error, el test falla automáticamente
    await setupAmbiente(configValida);
});

// Combinar con errores de Playwright
test('elemento inexistente lanza timeout', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com');

    await expect(async () => {
        await page.click('#elemento-que-no-existe', { timeout: 1000 });
    }).rejects.toThrow(errors.TimeoutError);
});</code></pre>
            </div>
        </div>

        <h3>🎭 Excepciones comunes de Playwright</h3>
        <p>Playwright lanza excepciones específicas que debes conocer para manejar
        correctamente los fallos en tus tests:</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Excepción</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Cuándo ocurre</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>TimeoutError</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Operación excede el timeout</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>page.click("#btn", timeout=1000)</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>Error</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Error general de Playwright</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Selector inválido, navegador cerrado</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>Error("Locator resolved to...")</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Elemento no interactuable</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Click en elemento oculto o deshabilitado</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>Error("Target closed")</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Página/navegador cerrado</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Operar sobre un <code>page</code> cerrado</td>
                </tr>
            </table>
        </div>

        <div class="code-tabs" data-code-id="L027-8">
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
                <pre><code class="language-python"># Importar excepciones de Playwright correctamente
from playwright.sync_api import (
    TimeoutError as PlaywrightTimeout,
    Error as PlaywrightError
)

def test_manejar_timeout_playwright(page):
    """Ejemplo de manejo de TimeoutError de Playwright."""
    page.goto("https://the-internet.herokuapp.com/dynamic_loading/1")
    page.click("#start button")

    try:
        # Esperar a que aparezca el resultado (puede ser lento)
        page.wait_for_selector("#finish h4", timeout=15000)
    except PlaywrightTimeout:
        pytest.fail(
            "El contenido dinámico no cargó en 15 segundos. "
            "Posible problema de rendimiento del servidor."
        )</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect, errors } from '@playwright/test';

test('manejar timeout playwright', async ({ page }) => {
    // Ejemplo de manejo de TimeoutError de Playwright
    await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');
    await page.click('#start button');

    try {
        // Esperar a que aparezca el resultado (puede ser lento)
        await page.waitForSelector('#finish h4', { timeout: 15000 });
    } catch (error) {
        if (error instanceof errors.TimeoutError) {
            test.fail(
                true,
                'El contenido dinámico no cargó en 15 segundos. ' +
                'Posible problema de rendimiento del servidor.'
            );
        }
        throw error;
    }
});</code></pre>
            </div>
        </div>

        <h3>🔄 Patrón de reintentos para tests inestables</h3>
        <p>Algunos elementos web son inestables (aparecen/desaparecen, tardan en renderizar).
        Un patrón de reintentos ayuda a manejar esto sin ocultar errores reales:</p>
        <div class="code-tabs" data-code-id="L027-9">
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
                <pre><code class="language-python">import time
from playwright.sync_api import TimeoutError as PlaywrightTimeout

def reintentar_accion(page, accion, max_intentos=3, espera=1):
    """
    Reintenta una acción sobre la página hasta max_intentos veces.

    Args:
        page: Página de Playwright
        accion: Función que recibe page y ejecuta la acción
        max_intentos: Número máximo de reintentos
        espera: Segundos entre reintentos

    Returns:
        El resultado de la acción si fue exitosa

    Raises:
        ElementNotReadyError: Si se agotan los reintentos
    """
    ultimo_error = None

    for intento in range(1, max_intentos + 1):
        try:
            resultado = accion(page)
            return resultado
        except (PlaywrightTimeout, Exception) as e:
            ultimo_error = e
            print(
                f"⚠️ Intento {intento}/{max_intentos} falló: "
                f"{type(e).__name__}: {e}"
            )
            if intento < max_intentos:
                time.sleep(espera)

    raise ElementNotReadyError(
        selector="acción reintentada",
        intentos=max_intentos
    ) from ultimo_error


# Uso en tests
def test_boton_flaky(page):
    """Test con reintento para un botón que a veces tarda."""
    page.goto("https://the-internet.herokuapp.com/dynamic_loading/2")

    def hacer_click_y_esperar(p):
        p.click("#start button")
        p.wait_for_selector("#finish h4", timeout=5000)
        return p.inner_text("#finish h4")

    texto = reintentar_accion(page, hacer_click_y_esperar)
    assert texto == "Hello World!"</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect, Page, errors } from '@playwright/test';

// Playwright Test tiene reintentos nativos en el config:
// playwright.config.ts → retries: 2

// Para reintentos a nivel de acción:
async function reintentarAccion<T>(
    page: Page,
    accion: (p: Page) => Promise<T>,
    maxIntentos: number = 3,
    espera: number = 1000
): Promise<T> {
    let ultimoError: Error | null = null;

    for (let intento = 1; intento <= maxIntentos; intento++) {
        try {
            return await accion(page);
        } catch (error) {
            ultimoError = error as Error;
            console.log(
                \`⚠️ Intento \${intento}/\${maxIntentos} falló: \` +
                \`\${error instanceof Error ? error.message : error}\`
            );
            if (intento < maxIntentos) {
                await page.waitForTimeout(espera);
            }
        }
    }

    throw new Error(
        \`Acción falló después de \${maxIntentos} intentos: \${ultimoError?.message}\`,
        { cause: ultimoError }
    );
}

// Uso en tests
test('boton flaky', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dynamic_loading/2');

    const texto = await reintentarAccion(page, async (p) => {
        await p.click('#start button');
        await p.waitForSelector('#finish h4', { timeout: 5000 });
        return await p.innerText('#finish h4');
    });
    expect(texto).toBe('Hello World!');
});</code></pre>
            </div>
        </div>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #9c27b0;">
            <strong>💡 Consejo profesional:</strong> Antes de agregar reintentos,
            pregúntate si el test es realmente inestable o si hay un bug real. Los reintentos
            deben ser la excepción, no la regla. Si necesitas reintentos en muchos tests,
            probablemente necesitas mejores localizadores o más tiempo de espera.
        </div>

        <h3>🛡️ Patrón: Context Manager para limpieza segura</h3>
        <p>Combina <code>try/finally</code> con context managers para garantizar limpieza:</p>
        <div class="code-tabs" data-code-id="L027-10">
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
from contextlib import contextmanager

@contextmanager
def usuario_temporal(page, nombre, clave):
    """Context manager que crea un usuario, lo usa y lo limpia."""
    # Setup: crear usuario
    crear_usuario(nombre, clave)
    try:
        yield {"nombre": nombre, "clave": clave}
    finally:
        # Teardown: siempre limpiar, incluso si el test falla
        try:
            eliminar_usuario(nombre)
        except Exception as e:
            print(f"⚠️ No se pudo eliminar usuario '{nombre}': {e}")


# Uso en test
def test_perfil_usuario(page):
    """Verificar página de perfil con usuario temporal."""
    with usuario_temporal(page, "test_user_027", "Clave123!") as user:
        page.goto("/login")
        page.fill("#username", user["nombre"])
        page.fill("#password", user["clave"])
        page.click("button[type='submit']")

        # Si este assert falla, el usuario se limpia de todas formas
        assert page.inner_text(".profile-name") == "test_user_027"</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">import { test, expect, Page } from '@playwright/test';

// Patrón equivalente usando try/finally en TypeScript
async function conUsuarioTemporal<T>(
    page: Page,
    nombre: string,
    clave: string,
    accion: (user: { nombre: string; clave: string }) => Promise<T>
): Promise<T> {
    // Setup: crear usuario
    await crearUsuario(nombre, clave);
    try {
        return await accion({ nombre, clave });
    } finally {
        // Teardown: siempre limpiar, incluso si el test falla
        try {
            await eliminarUsuario(nombre);
        } catch (error) {
            console.log(\`⚠️ No se pudo eliminar usuario '\${nombre}': \${error}\`);
        }
    }
}

// Uso en test
test('perfil usuario', async ({ page }) => {
    await conUsuarioTemporal(page, 'test_user_027', 'Clave123!', async (user) => {
        await page.goto('/login');
        await page.fill('#username', user.nombre);
        await page.fill('#password', user.clave);
        await page.click("button[type='submit']");

        // Si este expect falla, el usuario se limpia de todas formas
        await expect(page.locator('.profile-name')).toHaveText('test_user_027');
    });
});</code></pre>
            </div>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 15px 0;">
            <h4>🏋️ Ejercicio: Manejo robusto de errores en test suite</h4>
            <p>Implementa un sistema de manejo de excepciones para un mini framework de tests:</p>
            <ol>
                <li>Crea el archivo <code>exceptions.py</code> con al menos 3 excepciones personalizadas:
                    <ul>
                        <li><code>TestFrameworkError</code> (base)</li>
                        <li><code>ConfigurationError</code> (parámetro inválido)</li>
                        <li><code>PageLoadError</code> (la página no cargó correctamente)</li>
                    </ul>
                </li>
                <li>Crea <code>utils/retry.py</code> con la función <code>reintentar_accion()</code> que:
                    <ul>
                        <li>Acepte una función, número de intentos y tiempo de espera</li>
                        <li>Registre cada intento fallido con logging</li>
                        <li>Lance tu excepción personalizada al agotar intentos</li>
                    </ul>
                </li>
                <li>Crea <code>test_excepciones.py</code> con estos tests:
                    <ul>
                        <li>Test que verifica que <code>ConfigurationError</code> se lanza con parámetro vacío</li>
                        <li>Test que verifica que <code>PageLoadError</code> incluye la URL en el mensaje</li>
                        <li>Test que usa <code>pytest.raises()</code> con <code>match</code></li>
                        <li>Test que usa <code>reintentar_accion()</code> con un elemento dinámico</li>
                    </ul>
                </li>
            </ol>
        </div>
        <div class="code-tabs" data-code-id="L027-11">
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
                <pre><code class="language-python"># Estructura esperada del ejercicio
mi_proyecto/
├── exceptions.py            # Excepciones personalizadas
├── utils/
│   └── retry.py             # Utilidad de reintentos
└── tests/
    └── test_excepciones.py  # Tests del ejercicio

# --- exceptions.py ---
class TestFrameworkError(Exception):
    """Base del framework."""
    pass

class ConfigurationError(TestFrameworkError):
    def __init__(self, parametro, mensaje=""):
        self.parametro = parametro
        super().__init__(
            f"Config error en '{parametro}': {mensaje}"
        )

class PageLoadError(TestFrameworkError):
    def __init__(self, url, status_code=None):
        self.url = url
        self.status_code = status_code
        msg = f"No se pudo cargar '{url}'"
        if status_code:
            msg += f" (HTTP {status_code})"
        super().__init__(msg)

# --- tests/test_excepciones.py ---
import pytest
from exceptions import ConfigurationError, PageLoadError

def test_config_error_parametro_vacio():
    with pytest.raises(ConfigurationError) as exc_info:
        raise ConfigurationError("", "no puede estar vacío")
    assert exc_info.value.parametro == ""

def test_page_load_error_contiene_url():
    url = "https://sitio-caido.com"
    with pytest.raises(PageLoadError, match=r"sitio-caido"):
        raise PageLoadError(url, status_code=503)

def test_page_load_error_con_status():
    error = PageLoadError("https://ejemplo.com/api", 500)
    assert "HTTP 500" in str(error)
    assert error.status_code == 500</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// Estructura equivalente en TypeScript
// mi-proyecto/
// ├── errors.ts              # Errores personalizados
// ├── utils/retry.ts         # Utilidad de reintentos
// └── tests/
//     └── excepciones.spec.ts

// --- errors.ts ---
export class TestFrameworkError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'TestFrameworkError';
    }
}

export class ConfigurationError extends TestFrameworkError {
    parametro: string;
    constructor(parametro: string, mensaje: string = '') {
        super(\`Config error en '\${parametro}': \${mensaje}\`);
        this.name = 'ConfigurationError';
        this.parametro = parametro;
    }
}

export class PageLoadError extends TestFrameworkError {
    url: string;
    statusCode: number | null;
    constructor(url: string, statusCode: number | null = null) {
        let msg = \`No se pudo cargar '\${url}'\`;
        if (statusCode) msg += \` (HTTP \${statusCode})\`;
        super(msg);
        this.name = 'PageLoadError';
        this.url = url;
        this.statusCode = statusCode;
    }
}

// --- tests/excepciones.spec.ts ---
import { test, expect } from '@playwright/test';
import { ConfigurationError, PageLoadError } from '../errors';

test('config error parametro vacio', () => {
    expect(() => {
        throw new ConfigurationError('', 'no puede estar vacío');
    }).toThrow(ConfigurationError);
});

test('page load error contiene url', () => {
    expect(() => {
        throw new PageLoadError('https://sitio-caido.com', 503);
    }).toThrow(/sitio-caido/);
});

test('page load error con status', () => {
    const error = new PageLoadError('https://ejemplo.com/api', 500);
    expect(error.message).toContain('HTTP 500');
    expect(error.statusCode).toBe(500);
});</code></pre>
            </div>
        </div>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Comprender la jerarquía de excepciones de Python</li>
                <li>Usar correctamente try / except / else / finally</li>
                <li>Capturar excepciones específicas en lugar de genéricas</li>
                <li>Crear excepciones personalizadas para tu framework</li>
                <li>Usar <code>pytest.raises()</code> para verificar excepciones esperadas</li>
                <li>Manejar las excepciones comunes de Playwright</li>
                <li>Implementar patrones de reintento para tests inestables</li>
            </ul>
        </div>
    `,
    topics: ["excepciones", "try-except", "errores"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_027 = LESSON_027;
}
