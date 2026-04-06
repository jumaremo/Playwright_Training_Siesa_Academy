/**
 * Playwright Academy - Lección 009
 * Git y control de versiones para QA
 * Sección 1: Configuración del Entorno
 */

const LESSON_009 = {
    id: 9,
    title: "Git y control de versiones para QA",
    duration: "5 min",
    level: "beginner",
    section: "section-01",
    content: `
        <h2>🔀 Git y control de versiones para QA</h2>
        <p>Todo proyecto de automatización debe estar versionado con Git.
        Aprenderemos los comandos esenciales y convenciones para equipos QA.</p>

        <h3>📦 Inicializar el repositorio</h3>
        <pre><code class="bash"># Inicializar Git en tu proyecto
cd mi-proyecto-playwright
git init

# Verificar el .gitignore (creado en lección 006)
cat .gitignore

# Primer commit
git add .
git commit -m "feat: setup inicial proyecto Playwright"</code></pre>

        <h3>🌿 Estrategia de ramas para QA</h3>
        <pre><code class="text">main (o master)
  ├── develop
  │   ├── feature/login-tests
  │   ├── feature/checkout-tests
  │   ├── fix/flaky-search-test
  │   └── refactor/page-objects
  └── release/v1.0</code></pre>

        <pre><code class="bash"># Crear rama para nuevos tests
git checkout -b feature/login-tests

# Trabajar en tus tests...
git add tests/test_login.py
git commit -m "test: agregar tests de login exitoso y fallido"

# Crear rama para fix
git checkout -b fix/flaky-search-test
git add tests/test_search.py
git commit -m "fix: estabilizar test de búsqueda con auto-waiting"

# Volver a develop y mergear
git checkout develop
git merge feature/login-tests</code></pre>

        <h3>📝 Convenciones de commits para QA</h3>
        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #e8f5e9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Prefijo</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Uso</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>test:</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Nuevos tests</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>test: agregar suite de checkout</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>fix:</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Correcciones de tests</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>fix: resolver flaky test en login</code></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>refactor:</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Reestructuración</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>refactor: extraer Page Objects de login</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>feat:</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Nueva funcionalidad del framework</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>feat: agregar helper de autenticación</code></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>ci:</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Configuración CI/CD</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>ci: configurar GitHub Actions para tests</code></td>
                </tr>
            </table>
        </div>

        <h3>🔧 Comandos Git esenciales para QA</h3>
        <pre><code class="bash"># Ver estado de archivos
git status

# Ver cambios en detalle
git diff tests/test_login.py

# Ver historial de un archivo
git log --oneline tests/test_login.py

# Deshacer cambios locales (antes de commit)
git checkout -- tests/test_login.py

# Guardar cambios temporalmente (para cambiar de rama)
git stash
git stash pop

# Ver quién modificó cada línea
git blame tests/test_login.py

# Buscar en el historial
git log --grep="login" --oneline</code></pre>

        <h3>📄 .gitignore ampliado para Playwright</h3>
        <pre><code class="text"># Python
venv/
__pycache__/
*.pyc
.pytest_cache/

# Playwright artefactos
test-results/
playwright-report/
allure-results/
allure-report/
screenshots/
videos/
traces/

# IDE
.vscode/
.idea/
*.swp

# Entorno
.env
.env.local

# OS
.DS_Store
Thumbs.db</code></pre>

        <h3>🎯 Ejercicio práctico</h3>
        <ol>
            <li>Inicializa Git en tu proyecto: <code>git init</code></li>
            <li>Actualiza tu <code>.gitignore</code> con la versión ampliada</li>
            <li>Haz tu primer commit: <code>git add . && git commit -m "feat: setup inicial proyecto Playwright"</code></li>
            <li>Crea una rama: <code>git checkout -b feature/primer-test</code></li>
            <li>Agrega un test y haz commit: <code>git commit -m "test: agregar test de verificación"</code></li>
            <li>Vuelve a main y mergea: <code>git checkout main && git merge feature/primer-test</code></li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Configurar Git para un proyecto Playwright</li>
                <li>Conocer la estrategia de ramas para equipos QA</li>
                <li>Usar convenciones de commits semánticos</li>
                <li>Dominar comandos Git esenciales para el día a día</li>
            </ul>
        </div>

        <div style="background: #fff3cd; padding: 10px; border-radius: 8px; margin: 10px 0;">
            <h4>💡 Tip:</h4>
            <p><strong>Nunca subas artefactos de tests</strong> (screenshots, videos, traces) al repositorio.
            Son archivos grandes y temporales. Usa el CI/CD para almacenarlos como artifacts del pipeline.</p>
        </div>

        <h3>🚀 Siguiente: Lección 010 - Troubleshooting de instalación</h3>
        <p>Resolveremos los errores más comunes de configuración.</p>
    `,
    topics: ["git", "versiones", "qa"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_009 = LESSON_009;
}
