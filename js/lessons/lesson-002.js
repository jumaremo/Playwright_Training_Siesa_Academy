/**
 * Playwright Academy - Lección 002
 * Instalación de Python y pip
 * Sección 1: Configuración del Entorno
 */

const LESSON_002 = {
    id: 2,
    title: "Instalación de Python y pip",
    duration: "5 min",
    level: "beginner",
    section: "section-01",
    content: `
        <h2>🐍 Instalación de Python y pip</h2>
        <p>Para usar Playwright necesitas <strong>Python 3.8 o superior</strong>. En esta lección configuraremos
        Python y pip correctamente.</p>

        <h3>📥 Paso 1: Instalar Python</h3>
        <h4>Windows</h4>
        <pre><code class="bash"># Descargar desde python.org
# IMPORTANTE: Marcar "Add Python to PATH" durante la instalación

# Verificar la instalación
python --version
# Python 3.12.x (o superior)

pip --version
# pip 24.x from ...</code></pre>

        <h4>macOS</h4>
        <pre><code class="bash"># Con Homebrew (recomendado)
brew install python

# Verificar
python3 --version
pip3 --version</code></pre>

        <h4>Linux (Ubuntu/Debian)</h4>
        <pre><code class="bash"># Python suele venir preinstalado
sudo apt update
sudo apt install python3 python3-pip python3-venv

python3 --version
pip3 --version</code></pre>

        <h3>📦 Paso 2: Crear un entorno virtual</h3>
        <p>Siempre trabaja con entornos virtuales para aislar las dependencias de cada proyecto:</p>
        <pre><code class="bash"># Crear el directorio del proyecto
mkdir mi-proyecto-playwright
cd mi-proyecto-playwright

# Crear entorno virtual
python -m venv venv

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
where python    # Windows</code></pre>

        <h3>🔄 Paso 3: Actualizar pip</h3>
        <pre><code class="bash"># Siempre actualiza pip antes de instalar paquetes
python -m pip install --upgrade pip

# Verificar
pip --version</code></pre>

        <h3>📋 Paso 4: requirements.txt</h3>
        <p>Crea un archivo <code>requirements.txt</code> para documentar las dependencias:</p>
        <pre><code class="text"># requirements.txt
playwright==1.49.1
pytest==8.3.4
pytest-playwright==0.6.2</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📂 Estructura esperada hasta ahora:</h4>
            <pre><code>mi-proyecto-playwright/
├── venv/                  # Entorno virtual (NO subir a git)
└── requirements.txt       # Dependencias del proyecto</code></pre>
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <ol>
            <li>Verifica tu versión de Python: <code>python --version</code> (debe ser 3.8+)</li>
            <li>Crea una carpeta <code>playwright-academy-labs</code></li>
            <li>Dentro, crea un entorno virtual: <code>python -m venv venv</code></li>
            <li>Activa el entorno virtual</li>
            <li>Actualiza pip: <code>python -m pip install --upgrade pip</code></li>
            <li>Crea el archivo <code>requirements.txt</code> con las dependencias indicadas</li>
            <li>Verifica con <code>pip --version</code> que pip funciona dentro del venv</li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Instalar Python 3.8+ correctamente en tu sistema operativo</li>
                <li>Entender qué es pip y para qué sirve</li>
                <li>Crear y activar entornos virtuales con venv</li>
                <li>Crear un requirements.txt para tu proyecto</li>
            </ul>
        </div>

        <div style="background: #fff3cd; padding: 10px; border-radius: 8px; margin: 10px 0;">
            <h4>💡 Tip:</h4>
            <p><strong>Nunca instales paquetes globalmente</strong> con <code>pip install</code> sin un entorno virtual activo.
            Usar <code>venv</code> evita conflictos entre proyectos y hace tu configuración reproducible.</p>
        </div>

        <div style="background: #ffebee; padding: 10px; border-radius: 8px; margin: 10px 0;">
            <h4>⚠️ Error común:</h4>
            <p>En Windows, si <code>python</code> abre la Microsoft Store, usa <code>python3</code> o reinstala
            Python marcando <strong>"Add Python to PATH"</strong>.</p>
        </div>

        <h3>🚀 Siguiente: Lección 003 - Instalación de Playwright y navegadores</h3>
        <p>Con Python listo, instalaremos Playwright y descargaremos los navegadores.</p>
    `,
    topics: ["python", "instalación", "pip"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_002 = LESSON_002;
}
