/**
 * Playwright Academy - Lección 004
 * Configuración de VS Code / PyCharm
 * Sección 1: Configuración del Entorno
 */

const LESSON_004 = {
    id: 4,
    title: "Configuración de VS Code / PyCharm",
    duration: "5 min",
    level: "beginner",
    section: "section-01",
    content: `
        <h2>🛠️ Configuración de VS Code / PyCharm</h2>
        <p>Un IDE bien configurado acelera tu flujo de trabajo con Playwright.
        Veremos la configuración para los dos editores más populares.</p>

        <h3>📘 VS Code (Recomendado)</h3>
        <h4>Extensiones esenciales:</h4>
        <table style="width:100%; border-collapse: collapse; margin: 10px 0;">
            <tr style="background: #e8f5e9;">
                <th style="padding: 8px; border: 1px solid #ddd;">Extensión</th>
                <th style="padding: 8px; border: 1px solid #ddd;">ID</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Propósito</th>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">Python</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>ms-python.python</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">IntelliSense, debugging, linting</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 8px; border: 1px solid #ddd;">Playwright Test for VS Code</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>ms-playwright.playwright</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Ejecutar tests, debugging, pick locator</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">Python Test Explorer</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>ms-python.python</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Panel de tests integrado (incluido en Python ext.)</td>
            </tr>
        </table>

        <h4>Configuración de settings.json:</h4>
        <pre><code class="json">// .vscode/settings.json
{
    "python.defaultInterpreterPath": "./venv/Scripts/python",
    "python.testing.pytestEnabled": true,
    "python.testing.pytestArgs": [
        "--headed",
        "-v"
    ],
    "editor.formatOnSave": true,
    "python.formatting.provider": "none",
    "[python]": {
        "editor.defaultFormatter": "ms-python.black-formatter",
        "editor.codeActionsOnSave": {
            "source.organizeImports": "explicit"
        }
    }
}</code></pre>

        <h4>Configuración de launch.json (debugging):</h4>
        <pre><code class="json">// .vscode/launch.json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Pytest: Archivo actual",
            "type": "debugpy",
            "request": "launch",
            "module": "pytest",
            "args": [
                "\${file}",
                "-v",
                "--headed"
            ],
            "console": "integratedTerminal"
        },
        {
            "name": "Pytest: Test actual",
            "type": "debugpy",
            "request": "launch",
            "module": "pytest",
            "args": [
                "\${file}::\${selectedText}",
                "-v",
                "--headed"
            ],
            "console": "integratedTerminal"
        }
    ]
}</code></pre>

        <h3>🧠 PyCharm</h3>
        <h4>Configuración esencial:</h4>
        <ol>
            <li><strong>Intérprete:</strong> Settings → Project → Python Interpreter → Seleccionar tu <code>venv</code></li>
            <li><strong>Test runner:</strong> Settings → Tools → Python Integrated Tools → Default test runner: <code>pytest</code></li>
            <li><strong>Parámetros pytest:</strong> Run → Edit Configurations → pytest → Additional Arguments: <code>--headed -v</code></li>
        </ol>

        <pre><code class="ini"># pytest.ini (funciona con ambos IDEs)
[pytest]
addopts = -v --tb=short
markers =
    smoke: Tests de smoke (rápidos)
    regression: Tests de regresión completa</code></pre>

        <h3>🎯 Ejercicio práctico</h3>
        <ol>
            <li>Instala las extensiones de VS Code listadas arriba (o configura PyCharm)</li>
            <li>Crea la carpeta <code>.vscode/</code> y el archivo <code>settings.json</code></li>
            <li>Crea el archivo <code>pytest.ini</code> en la raíz de tu proyecto</li>
            <li>Abre un archivo <code>.py</code> y verifica que el IntelliSense de Playwright funciona:
                <br>- Escribe <code>page.</code> y verifica que aparece autocompletado
                <br>- Escribe <code>expect(page).</code> y verifica las opciones</li>
            <li>Ejecuta un test desde el panel de Testing de VS Code (ícono del tubo de ensayo)</li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Configurar VS Code o PyCharm para trabajar con Playwright</li>
                <li>Instalar extensiones esenciales para productividad</li>
                <li>Crear archivos de configuración del IDE y pytest</li>
                <li>Verificar que IntelliSense y debugging funcionan</li>
            </ul>
        </div>

        <div style="background: #fff3cd; padding: 10px; border-radius: 8px; margin: 10px 0;">
            <h4>💡 Tip:</h4>
            <p>El flag <code>--headed</code> hace que el navegador se abra visualmente durante los tests.
            Úsalo durante el desarrollo para ver qué hace tu test. En CI/CD, quitalo para ejecutar en modo headless.</p>
        </div>

        <h3>🚀 Siguiente: Lección 005 - Primer test con Playwright</h3>
        <p>¡Con todo configurado, escribiremos tu primer test completo!</p>
    `,
    topics: ["vscode", "pycharm", "configuración"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_004 = LESSON_004;
}
