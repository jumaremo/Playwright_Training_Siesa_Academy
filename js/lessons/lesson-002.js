/**
 * Playwright Academy - Lección 002
 * Instalación de Python, Node.js y herramientas base
 * Sección 1: Configuración del Entorno
 */

const LESSON_002 = {
    id: 2,
    title: "Instalación de Python, Node.js y herramientas base",
    duration: "8 min",
    level: "beginner",
    section: "section-01",
    content: `
        <h2>🐍 Instalación de Python, Node.js y herramientas base</h2>
        <p>Para usar Playwright necesitas <strong>Python 3.10 o superior</strong> (recomendado; 3.8 es el mínimo teórico,
        pero versiones anteriores a 3.10 pueden fallar al compilar dependencias como <code>greenlet</code> en Windows).
        Si además quieres seguir los ejemplos en TypeScript de este curso, necesitarás <strong>Node.js 18+</strong> y npm.</p>

        <div style="background: #e0f2f1; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #009688;">
            <h4>⚡ ¿Ya tienes experiencia? — Verificación rápida</h4>
            <p>Si ya tienes Python y/o Node.js instalados, ejecuta estos comandos para confirmar que todo está listo:</p>
            <div class="code-tabs" data-code-id="L002-quick">
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
                    <pre><code class="language-bash"># Verificación rápida — los 3 deben funcionar:
python --version   # Python 3.10+ ✓
pip --version      # pip 23+ ✓
python -m venv --help  # Sin error ✓

# Si los 3 funcionan, salta al Paso 3 (entorno virtual)</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code class="language-bash"># Verificación rápida — los 2 deben funcionar:
node --version   # v18+ ✓
npm --version    # 9+ ✓

# Si ambos funcionan, salta al Paso 4 (package.json)</code></pre>
                </div>
            </div>
            <p style="margin-bottom: 0;">Si algún comando falla, sigue los pasos detallados a continuación.</p>
        </div>

        <h3>📥 Paso 1: Instalar Python</h3>

        <h4>Windows</h4>
        <pre><code class="language-bash"># 1. Descargar desde https://www.python.org/downloads/
# 2. Ejecutar el instalador
#    ⚠️ CRÍTICO: Marcar "Add Python to PATH" en la primera pantalla
#    (está desmarcado por defecto — si no lo marcas, nada funcionará)
# 3. Clic en "Install Now"

# Verificar la instalación (abrir una terminal NUEVA):
python --version
# Python 3.12.x (o superior)

pip --version
# pip 24.x from ...</code></pre>

        <div style="background: #ffebee; padding: 10px; border-radius: 8px; margin: 10px 0;">
            <h4>⚠️ Windows: ¿<code>python</code> abre la Microsoft Store?</h4>
            <p>Windows 10/11 incluye un "alias" que redirige <code>python</code> a la Microsoft Store.
            Para solucionarlo:</p>
            <ol>
                <li>Ve a <strong>Configuración → Aplicaciones → Alias de ejecución de aplicaciones</strong></li>
                <li>Desactiva los alias de <strong>"python.exe"</strong> y <strong>"python3.exe"</strong></li>
                <li>Reinstala Python desde python.org marcando <strong>"Add to PATH"</strong></li>
            </ol>
            <p>Alternativa: usa <code>py</code> en lugar de <code>python</code>. Windows incluye un "py launcher"
            que busca la versión correcta automáticamente: <code>py --version</code>, <code>py -m pip install ...</code></p>
        </div>

        <h4>macOS</h4>
        <pre><code class="language-bash"># Con Homebrew (recomendado)
brew install python

# Verificar (en macOS siempre usa python3, no python)
python3 --version
pip3 --version

# Tip: puedes crear un alias en ~/.zshrc:
# alias python=python3
# alias pip=pip3</code></pre>

        <h4>Linux (Ubuntu/Debian)</h4>
        <pre><code class="language-bash"># Python suele venir preinstalado, pero necesitas pip y venv
sudo apt update
sudo apt install python3 python3-pip python3-venv

python3 --version
pip3 --version</code></pre>

        <h3>📥 Paso 2: Instalar Node.js y npm</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #1976d2;">
            <p><strong>ℹ️ ¿Es obligatorio?</strong> No — si solo vas a usar el path Python, puedes saltar este paso.
            Pero lo necesitarás para seguir los <strong>tabs TypeScript</strong> del curso y para herramientas
            como <code>npm init playwright@latest</code>.</p>
        </div>

        <h4>Windows / macOS</h4>
        <pre><code class="language-bash"># 1. Descargar desde https://nodejs.org/ (versión LTS recomendada)
# 2. Ejecutar el instalador (incluye npm automáticamente)
# 3. Abrir una terminal NUEVA y verificar:

node --version
# v20.x.x (o v22.x.x LTS)

npm --version
# 10.x.x</code></pre>

        <h4>Linux (Ubuntu/Debian)</h4>
        <pre><code class="language-bash"># Opción 1: Desde NodeSource (recomendado — versión actualizada)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Opción 2: Desde repositorios oficiales (puede ser versión antigua)
sudo apt install nodejs npm

# Verificar
node --version
npm --version</code></pre>

        <h3>📦 Paso 3: Crear un entorno virtual / proyecto</h3>
        <p>Aísla las dependencias de cada proyecto para evitar conflictos:</p>
        <div class="code-tabs" data-code-id="L002-venv">
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
                <pre><code class="language-bash"># Crear el directorio del proyecto
mkdir mi-proyecto-playwright
cd mi-proyecto-playwright

# Crear entorno virtual
python -m venv venv
# Tip: si tienes múltiples versiones de Python, especifica la versión:
# py -3.10 -m venv venv    (Windows, con py launcher)

# Activar entorno virtual
# Windows (cmd):
venv\\Scripts\\activate
# Windows (PowerShell):
venv\\Scripts\\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# Verificar que estás en el entorno virtual
# Deberías ver (venv) al inicio del prompt
which python    # macOS/Linux
where python    # Windows

# Actualizar pip
python -m pip install --upgrade pip</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <div class="code-note">
                    <span class="code-note-icon">ℹ️</span>
                    <span class="code-note-text">En TypeScript no necesitas entorno virtual — npm maneja las dependencias por proyecto:</span>
                </div>
                <pre><code class="language-bash"># Crear el directorio del proyecto
mkdir mi-proyecto-playwright
cd mi-proyecto-playwright

# Inicializar proyecto Node.js
npm init -y

# Esto crea package.json y node_modules/ será local al proyecto
# (equivalente al venv de Python)</code></pre>
            </div>
        </div>

        <h3>📋 Paso 4: Archivo de dependencias</h3>
        <div class="code-tabs" data-code-id="L002-deps">
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
                <pre><code class="language-text"># requirements.txt
playwright>=1.52
pytest>=8.0
pytest-playwright>=0.6.2</code></pre>
                <div class="code-note">
                    <span class="code-note-icon">💡</span>
                    <span class="code-note-text">Usamos <code>>=</code> en lugar de <code>==</code> para permitir actualizaciones de parche automáticas.</span>
                </div>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-json">// package.json (sección devDependencies)
{
  "devDependencies": {
    "@playwright/test": "^1.52.0"
  }
}</code></pre>
                <div class="code-note">
                    <span class="code-note-icon">💡</span>
                    <span class="code-note-text"><code>@playwright/test</code> incluye todo: Playwright + test runner + assertions. No necesitas instalar nada más.</span>
                </div>
            </div>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📂 Estructura esperada hasta ahora:</h4>
            <div class="code-tabs" data-code-id="L002-structure">
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
                    <pre><code>mi-proyecto-playwright/
├── venv/                  # Entorno virtual (NO subir a git)
└── requirements.txt       # Dependencias del proyecto</code></pre>
                </div>
                <div class="code-panel" data-lang="typescript">
                    <pre><code>mi-proyecto-playwright/
├── node_modules/          # Dependencias (NO subir a git)
├── package.json           # Configuración del proyecto
└── package-lock.json      # Lock de versiones</code></pre>
                </div>
            </div>
        </div>

        <h3>🔧 Troubleshooting</h3>
        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #fff3cd;">
                <th style="padding: 10px; border: 1px solid #ddd; width: 35%;">Problema</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Solución</th>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><code>python</code> abre Microsoft Store (Windows)</td>
                <td style="padding: 10px; border: 1px solid #ddd;">Desactivar alias de ejecución (ver nota arriba) o usar <code>py</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 10px; border: 1px solid #ddd;"><code>python: command not found</code></td>
                <td style="padding: 10px; border: 1px solid #ddd;">Python no está en PATH. Reinstalar marcando "Add to PATH" o agregar manualmente al PATH del sistema</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><code>python3</code> funciona pero <code>python</code> no (macOS/Linux)</td>
                <td style="padding: 10px; border: 1px solid #ddd;">Normal en macOS/Linux. Usa <code>python3</code> y <code>pip3</code>, o crea un alias</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 10px; border: 1px solid #ddd;"><code>pip: command not found</code></td>
                <td style="padding: 10px; border: 1px solid #ddd;">Usa <code>python -m pip</code> en su lugar, o instala pip: <code>python -m ensurepip --upgrade</code></td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">Error de permisos en Linux con <code>pip install</code></td>
                <td style="padding: 10px; border: 1px solid #ddd;">Nunca uses <code>sudo pip install</code>. Activa un entorno virtual primero</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 10px; border: 1px solid #ddd;"><code>node: command not found</code> después de instalar</td>
                <td style="padding: 10px; border: 1px solid #ddd;">Cierra y vuelve a abrir la terminal. Si persiste, verifica que Node.js está en el PATH</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><code>greenlet</code> falla al compilar (requiere Visual C++)</td>
                <td style="padding: 10px; border: 1px solid #ddd;">Usar Python 3.10+ que tiene wheels precompilados. Si tienes 3.9: <code>py -3.10 -m venv venv</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 10px; border: 1px solid #ddd;">PowerShell: <code>Activate.ps1 cannot be loaded</code></td>
                <td style="padding: 10px; border: 1px solid #ddd;">Ejecutar: <code>Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser</code></td>
            </tr>
        </table>

        <h3>🎯 Ejercicio práctico</h3>
        <p>Completa los siguientes pasos y marca cada uno:</p>
        <div class="code-tabs" data-code-id="L002-exercise">
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
                <pre><code class="language-bash"># ☐ 1. Verificar Python
python --version   # Debe mostrar 3.10+

# ☐ 2. Crear carpeta de trabajo
mkdir playwright-academy-labs
cd playwright-academy-labs

# ☐ 3. Crear y activar entorno virtual
python -m venv venv
# Windows: venv\\Scripts\\activate
# macOS/Linux: source venv/bin/activate

# ☐ 4. Actualizar pip
python -m pip install --upgrade pip

# ☐ 5. Crear requirements.txt
# (contenido: playwright>=1.52, pytest>=8.0, pytest-playwright>=0.6.2)

# ☐ 6. Verificar que pip funciona dentro del venv
pip --version
# Debe mostrar una ruta dentro de venv/</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-bash"># ☐ 1. Verificar Node.js y npm
node --version   # Debe mostrar v18+
npm --version    # Debe mostrar 9+

# ☐ 2. Crear carpeta de trabajo
mkdir playwright-academy-labs
cd playwright-academy-labs

# ☐ 3. Inicializar proyecto
npm init -y

# ☐ 4. Instalar Playwright Test
npm install -D @playwright/test

# ☐ 5. Verificar la instalación
npx playwright --version

# ☐ 6. Verificar package.json
cat package.json
# Debe incluir @playwright/test en devDependencies</code></pre>
            </div>
        </div>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Instalar Python 3.10+ correctamente en tu sistema operativo</li>
                <li>Instalar Node.js 18+ y npm (para el path TypeScript)</li>
                <li>Entender qué es pip y para qué sirve</li>
                <li>Crear y activar entornos virtuales con venv</li>
                <li>Crear un archivo de dependencias (<code>requirements.txt</code> / <code>package.json</code>)</li>
                <li>Resolver los errores más comunes de instalación</li>
            </ul>
        </div>

        <div style="background: #fff3cd; padding: 10px; border-radius: 8px; margin: 10px 0;">
            <h4>💡 Tip:</h4>
            <p><strong>Nunca instales paquetes globalmente</strong> con <code>pip install</code> sin un entorno virtual activo.
            Usar <code>venv</code> evita conflictos entre proyectos y hace tu configuración reproducible.
            Lo mismo aplica en Node.js: <code>npm install</code> (sin <code>-g</code>) instala localmente en el proyecto.</p>
        </div>

        <h3>🚀 Siguiente: Lección 003 - Instalación de Playwright y navegadores</h3>
        <p>Con Python y Node.js listos, instalaremos Playwright y descargaremos los navegadores.</p>
    `,
    topics: ["python", "instalación", "pip", "nodejs", "npm"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 8,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_002 = LESSON_002;
}
