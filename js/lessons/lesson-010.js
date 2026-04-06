/**
 * Playwright Academy - Lección 010
 * Troubleshooting de instalación
 * Sección 1: Configuración del Entorno
 */

const LESSON_010 = {
    id: 10,
    title: "Troubleshooting de instalación",
    duration: "8 min",
    level: "beginner",
    section: "section-01",
    content: `
        <h2>🔧 Troubleshooting de instalación</h2>
        <p>En esta lección resolveremos los problemas más comunes al configurar Playwright.
        Guarda esta lección como referencia rápida.</p>

        <h3>🚨 Problema 1: "playwright: command not found"</h3>
        <pre><code class="bash"># Causa: Playwright no está en el PATH o el venv no está activo
# Solución:
# 1. Activa el entorno virtual
source venv/bin/activate    # Linux/Mac
venv\\Scripts\\activate       # Windows

# 2. Reinstala
pip install playwright
playwright install

# 3. Alternativa: usar python -m
python -m playwright install</code></pre>

        <h3>🚨 Problema 2: "Browser executable not found"</h3>
        <pre><code class="bash"># Causa: Los navegadores no se descargaron
# Solución:
playwright install

# Si falla por permisos (Linux):
playwright install-deps
playwright install

# Verificar dónde se instalaron:
python -c "from playwright._impl._driver import compute_driver_executable; print(compute_driver_executable())"</code></pre>

        <h3>🚨 Problema 3: Tests pasan localmente pero fallan en CI</h3>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Causas comunes:</h4>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #ffcdd2;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Síntoma</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Causa</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Solución</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Timeout en CI</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">CI es más lento</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Aumentar timeouts en CI</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Element not found</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Resolución diferente</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Configurar viewport en conftest.py</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Crash del navegador</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Faltan dependencias del sistema</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>playwright install-deps</code></td>
                </tr>
            </table>
        </div>

        <h3>🚨 Problema 4: Error de imports</h3>
        <pre><code class="python"># Error: ModuleNotFoundError: No module named 'playwright'
# Causa: Paquete no instalado o venv incorrecto

# Verificar:
pip list | grep playwright
# Debería mostrar:
# playwright          1.49.1
# pytest-playwright   0.6.2

# Si no aparece:
pip install playwright pytest-playwright

# Error: ImportError: cannot import name 'expect' from 'playwright.sync_api'
# Causa: Versión muy antigua de Playwright
pip install --upgrade playwright</code></pre>

        <h3>🚨 Problema 5: Test se queda colgado (timeout)</h3>
        <pre><code class="python"># conftest.py - Configurar timeouts globales
import pytest

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        # Timeout para acciones (click, fill, etc.)
        # Default: 30000ms (30s)
    }

# pytest.ini - Timeout global para tests
# [pytest]
# timeout = 60  # Requiere pytest-timeout

# En el test: timeout específico
def test_carga_lenta(page):
    page.set_default_timeout(60000)  # 60 segundos
    page.goto("https://sitio-lento.com")

    # O timeout por acción
    page.get_by_role("button", name="Cargar").click(timeout=15000)</code></pre>

        <h3>🚨 Problema 6: Proxy corporativo / SSL</h3>
        <pre><code class="bash"># Si estás detrás de un proxy corporativo:
# Configurar proxy para pip
pip install --proxy http://proxy.empresa.com:8080 playwright

# Configurar proxy para Playwright (descargar navegadores)
set HTTPS_PROXY=http://proxy.empresa.com:8080  # Windows
export HTTPS_PROXY=http://proxy.empresa.com:8080  # Linux/Mac
playwright install</code></pre>
        <pre><code class="python"># Ignorar errores SSL en tests (solo en ambientes controlados)
@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "ignore_https_errors": True,
    }</code></pre>

        <h3>🛠️ Script de diagnóstico</h3>
        <pre><code class="python"># diagnostico.py - Ejecutar para verificar todo el entorno
import sys
import subprocess

print("=== Diagnóstico Playwright ===")
print(f"Python: {sys.version}")
print(f"Ejecutable: {sys.executable}")

try:
    import playwright
    print(f"Playwright: {playwright.__version__}")
except ImportError:
    print("ERROR: Playwright no instalado")

try:
    import pytest
    print(f"Pytest: {pytest.__version__}")
except ImportError:
    print("ERROR: Pytest no instalado")

# Verificar navegadores
result = subprocess.run(
    [sys.executable, "-m", "playwright", "install", "--dry-run"],
    capture_output=True, text=True
)
print(f"Navegadores: {'OK' if result.returncode == 0 else 'ERROR'}")

# Test rápido
try:
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("https://example.com")
        assert "Example" in page.title()
        browser.close()
    print("Test rápido: PASSED ✅")
except Exception as e:
    print(f"Test rápido: FAILED ❌ - {e}")</code></pre>

        <h3>🎯 Ejercicio práctico</h3>
        <ol>
            <li>Crea el archivo <code>diagnostico.py</code> y ejecútalo: <code>python diagnostico.py</code></li>
            <li>Verifica que todos los checks pasen</li>
            <li>Si alguno falla, usa las soluciones de esta lección para resolverlo</li>
            <li>Configura los timeouts en tu <code>conftest.py</code></li>
            <li>Guarda esta lección como referencia: la necesitarás cuando algo falle</li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Resolver los 6 problemas más comunes de instalación</li>
                <li>Configurar timeouts globales y por acción</li>
                <li>Manejar proxies corporativos y errores SSL</li>
                <li>Crear un script de diagnóstico reutilizable</li>
            </ul>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎉 ¡Sección 1 Completada!</h4>
            <p>Has configurado exitosamente tu entorno de desarrollo para Playwright con Python.
            Tienes Python, Playwright, pytest, tu IDE y Git listos para trabajar.</p>
            <p><strong>Resumen de lo aprendido:</strong></p>
            <ul>
                <li>Qué es Playwright y por qué usarlo</li>
                <li>Instalación de Python, Playwright y navegadores</li>
                <li>Configuración del IDE y pytest</li>
                <li>Tu primer test funcional</li>
                <li>Estructura de proyecto profesional</li>
                <li>Git y control de versiones para QA</li>
                <li>Troubleshooting de errores comunes</li>
            </ul>
        </div>

        <h3>🚀 Siguiente: Sección 2 - Fundamentos de Playwright</h3>
        <p>En la siguiente sección profundizaremos en la anatomía de los tests,
        navegación, assertions, interacciones y más.</p>
    `,
    topics: ["troubleshooting", "errores", "instalación"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 8,
    difficulty: "medium",
    type: "integration"
};

if (typeof window !== 'undefined') {
    window.LESSON_010 = LESSON_010;
}
