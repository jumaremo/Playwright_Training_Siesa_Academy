/**
 * Playwright Academy - Lección 092
 * Proyecto: Tests multi-usuario con aislamiento
 * Sección 13: Browser Contexts e Isolation
 */

const LESSON_092 = {
    id: 92,
    title: "Proyecto: Tests multi-usuario con aislamiento",
    duration: "10 min",
    level: "intermediate",
    section: "section-13",
    content: `
        <h2>🚀 Proyecto: Tests multi-usuario con aislamiento</h2>
        <p>En este proyecto integrador de la <strong>Sección 13</strong> construirás un framework de testing
        completo para una <strong>plataforma de colaboración</strong> (similar a un gestor de proyectos),
        donde múltiples usuarios con distintos roles interactúan simultáneamente. Aplicarás
        <strong>todos los conceptos</strong> de la sección: jerarquía Browser/Context/Page, múltiples contexts,
        storage state, perfiles de navegador y aislamiento total entre sesiones.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎯 Objetivo del proyecto</h4>
            <p>Crear un test suite que simule la interacción simultánea de <strong>4 roles de usuario</strong>
            (admin, project_manager, developer, viewer) en una plataforma de gestión de proyectos.
            Cada rol usa su propio <code>BrowserContext</code> con storage state independiente, garantizando
            aislamiento total. Los tests verifican permisos, colaboración en tiempo real y
            compatibilidad cross-browser con emulación de dispositivos.</p>
        </div>

        <h3>🗂️ Paso 1: Estructura del proyecto</h3>
        <pre><code class="bash"># Crear la estructura completa del proyecto
mkdir -p proyecto_multiusuario/auth_states
mkdir -p proyecto_multiusuario/pages
mkdir -p proyecto_multiusuario/helpers
mkdir -p proyecto_multiusuario/tests
mkdir -p proyecto_multiusuario/test-results/traces
mkdir -p proyecto_multiusuario/test-results/screenshots

# Crear archivos base
touch proyecto_multiusuario/pytest.ini
touch proyecto_multiusuario/auth_states/.gitkeep

touch proyecto_multiusuario/pages/__init__.py
touch proyecto_multiusuario/pages/login_page.py
touch proyecto_multiusuario/pages/projects_page.py
touch proyecto_multiusuario/pages/tasks_page.py
touch proyecto_multiusuario/pages/settings_page.py

touch proyecto_multiusuario/helpers/__init__.py
touch proyecto_multiusuario/helpers/auth_setup.py
touch proyecto_multiusuario/helpers/roles.py

touch proyecto_multiusuario/tests/__init__.py
touch proyecto_multiusuario/tests/conftest.py
touch proyecto_multiusuario/tests/test_colaboracion_multiusuario.py
touch proyecto_multiusuario/tests/test_notificaciones_tiempo_real.py
touch proyecto_multiusuario/tests/test_permisos_por_rol.py
touch proyecto_multiusuario/tests/test_crossbrowser_dispositivos.py</code></pre>

        <pre><code>proyecto_multiusuario/
├── pytest.ini                                  # Configuración global de pytest
├── auth_states/                                # Storage states por rol
│   ├── .gitkeep
│   ├── admin_state.json                        # (generado por auth_setup)
│   ├── pm_state.json
│   ├── developer_state.json
│   └── viewer_state.json
├── pages/                                      # Page Objects
│   ├── __init__.py
│   ├── login_page.py                           # Login/logout
│   ├── projects_page.py                        # Gestión de proyectos
│   ├── tasks_page.py                           # Gestión de tareas
│   └── settings_page.py                        # Configuración del sistema
├── helpers/                                    # Utilidades
│   ├── __init__.py
│   ├── auth_setup.py                           # Generador de storage states
│   └── roles.py                                # Definición de roles y permisos
└── tests/                                      # Suite de tests
    ├── __init__.py
    ├── conftest.py                             # Fixtures multi-contexto
    ├── test_colaboracion_multiusuario.py       # Flujo admin → PM → dev
    ├── test_notificaciones_tiempo_real.py      # Notificaciones entre usuarios
    ├── test_permisos_por_rol.py                # Verificación de permisos
    └── test_crossbrowser_dispositivos.py       # Mobile vs desktop
    └── test-results/
        ├── traces/
        └── screenshots/</code></pre>

        <h3>⚙️ Paso 2: pytest.ini — Configuración</h3>
        <pre><code class="bash"># pytest.ini
[pytest]
markers =
    multiuser: Tests de colaboración multi-usuario
    notifications: Tests de notificaciones en tiempo real
    permissions: Tests de verificación de permisos por rol
    crossbrowser: Tests cross-browser y emulación de dispositivos
    smoke: Tests críticos de humo
    slow: Tests que requieren más tiempo

# Timeouts
timeout = 60

# Opciones por defecto
addopts =
    -v
    --tb=short
    --strict-markers</code></pre>

        <h3>🔐 Paso 3: helpers/roles.py — Definición de roles</h3>
        <p>Centralizamos la configuración de roles, credenciales y permisos esperados.
        Esto facilita la reutilización y el mantenimiento de los tests.</p>
        <div class="code-tabs" data-code-id="L092-1">
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
            <pre><code class="language-python"># helpers/roles.py
"""
Definición centralizada de roles, credenciales y permisos
para la plataforma de gestión de proyectos.
"""
from dataclasses import dataclass, field
from typing import List
from pathlib import Path

# Directorio de storage states
AUTH_DIR = Path(__file__).parent.parent / "auth_states"


@dataclass
class UserRole:
    """Representa un rol de usuario con sus credenciales y permisos."""
    name: str
    username: str
    password: str
    permissions: List[str] = field(default_factory=list)

    @property
    def storage_state_path(self) -> str:
        """Ruta al archivo de storage state de este rol."""
        return str(AUTH_DIR / f"{self.name}_state.json")


# =====================================================
# ROLES DEL SISTEMA
# =====================================================

ADMIN = UserRole(
    name="admin",
    username="admin@collab-platform.com",
    password="AdminSecure2024!",
    permissions=[
        "create_project", "delete_project", "edit_project",
        "assign_tasks", "delete_tasks", "edit_tasks",
        "manage_users", "change_settings", "send_announcements",
        "view_reports", "export_data"
    ]
)

PROJECT_MANAGER = UserRole(
    name="pm",
    username="pm@collab-platform.com",
    password="PMSecure2024!",
    permissions=[
        "create_project", "edit_project",
        "assign_tasks", "edit_tasks",
        "send_announcements", "view_reports"
    ]
)

DEVELOPER = UserRole(
    name="developer",
    username="dev@collab-platform.com",
    password="DevSecure2024!",
    permissions=[
        "edit_tasks", "update_status",
        "add_comments", "view_reports"
    ]
)

VIEWER = UserRole(
    name="viewer",
    username="viewer@collab-platform.com",
    password="ViewSecure2024!",
    permissions=[
        "view_reports"
    ]
)

# Diccionario para acceso rápido
ALL_ROLES = {
    "admin": ADMIN,
    "pm": PROJECT_MANAGER,
    "developer": DEVELOPER,
    "viewer": VIEWER,
}


def can_perform(role: UserRole, action: str) -> bool:
    """Verifica si un rol tiene permiso para una acción."""
    return action in role.permissions</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// helpers/roles.ts
/**
 * Definición centralizada de roles, credenciales y permisos
 * para la plataforma de gestión de proyectos.
 */
import path from 'path';

// Directorio de storage states
const AUTH_DIR = path.join(__dirname, '..', 'auth_states');

interface UserRole {
    name: string;
    username: string;
    password: string;
    permissions: string[];
    readonly storageStatePath: string;
}

function createRole(
    name: string,
    username: string,
    password: string,
    permissions: string[] = []
): UserRole {
    return {
        name,
        username,
        password,
        permissions,
        get storageStatePath() {
            return path.join(AUTH_DIR, \`\${this.name}_state.json\`);
        },
    };
}

// =====================================================
// ROLES DEL SISTEMA
// =====================================================

export const ADMIN = createRole(
    'admin',
    'admin@collab-platform.com',
    'AdminSecure2024!',
    [
        'create_project', 'delete_project', 'edit_project',
        'assign_tasks', 'delete_tasks', 'edit_tasks',
        'manage_users', 'change_settings', 'send_announcements',
        'view_reports', 'export_data',
    ]
);

export const PROJECT_MANAGER = createRole(
    'pm',
    'pm@collab-platform.com',
    'PMSecure2024!',
    [
        'create_project', 'edit_project',
        'assign_tasks', 'edit_tasks',
        'send_announcements', 'view_reports',
    ]
);

export const DEVELOPER = createRole(
    'developer',
    'dev@collab-platform.com',
    'DevSecure2024!',
    [
        'edit_tasks', 'update_status',
        'add_comments', 'view_reports',
    ]
);

export const VIEWER = createRole(
    'viewer',
    'viewer@collab-platform.com',
    'ViewSecure2024!',
    ['view_reports']
);

// Diccionario para acceso rápido
export const ALL_ROLES: Record&lt;string, UserRole&gt; = {
    admin: ADMIN,
    pm: PROJECT_MANAGER,
    developer: DEVELOPER,
    viewer: VIEWER,
};

export function canPerform(role: UserRole, action: string): boolean {
    return role.permissions.includes(action);
}</code></pre>
        </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA: Centralización de roles</h4>
            <p>En SIESA, los módulos ERP manejan múltiples roles (administrador, contador, auditor,
            operador). Centralizar la definición de roles y permisos en un solo módulo facilita
            enormemente el mantenimiento: cuando cambian los permisos en la aplicación, solo
            actualizas un archivo en vez de buscar en cada test.</p>
        </div>

        <h3>🔑 Paso 4: helpers/auth_setup.py — Generador de Storage States</h3>
        <p>Este script genera los archivos de storage state para cada rol. Se ejecuta una vez
        antes de la suite y guarda las sesiones autenticadas en disco.</p>
        <div class="code-tabs" data-code-id="L092-2">
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
            <pre><code class="language-python"># helpers/auth_setup.py
"""
Generador de storage states para todos los roles.
Ejecutar ANTES de los tests para crear las sesiones autenticadas.

Uso:
    python -m helpers.auth_setup
"""
import json
import logging
from pathlib import Path
from playwright.sync_api import sync_playwright, Browser

from helpers.roles import ALL_ROLES, UserRole, AUTH_DIR

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger("auth_setup")

BASE_URL = "https://collab-platform.example.com"


def create_storage_state(browser: Browser, role: UserRole) -> str:
    """
    Autentica un usuario y guarda su storage state en disco.

    Args:
        browser: Instancia del browser de Playwright.
        role: Rol de usuario a autenticar.

    Returns:
        Ruta al archivo de storage state generado.
    """
    logger.info(f"Generando storage state para rol: {role.name}")

    # Crear un contexto limpio para la autenticación
    context = browser.new_context(
        base_url=BASE_URL,
        viewport={"width": 1280, "height": 720},
    )
    page = context.new_page()

    try:
        # 1. Navegar al login
        page.goto("/login")
        page.wait_for_load_state("networkidle")

        # 2. Completar credenciales
        page.get_by_label("Email").fill(role.username)
        page.get_by_label("Contraseña").fill(role.password)
        page.get_by_role("button", name="Iniciar sesión").click()

        # 3. Esperar a que el dashboard cargue (confirma autenticación)
        page.wait_for_url("**/dashboard", timeout=15000)
        page.wait_for_load_state("networkidle")
        logger.info(f"  Login exitoso para {role.name}")

        # 4. Guardar el storage state (cookies + localStorage)
        AUTH_DIR.mkdir(parents=True, exist_ok=True)
        state_path = role.storage_state_path
        context.storage_state(path=state_path)
        logger.info(f"  Storage state guardado: {state_path}")

        return state_path

    finally:
        context.close()


def generate_all_storage_states():
    """Genera storage states para todos los roles definidos."""
    logger.info("=" * 60)
    logger.info("GENERANDO STORAGE STATES PARA TODOS LOS ROLES")
    logger.info("=" * 60)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        try:
            for role_name, role in ALL_ROLES.items():
                create_storage_state(browser, role)
        finally:
            browser.close()

    logger.info("=" * 60)
    logger.info("TODOS LOS STORAGE STATES GENERADOS EXITOSAMENTE")
    logger.info("=" * 60)

    # Verificar archivos creados
    for role_name, role in ALL_ROLES.items():
        path = Path(role.storage_state_path)
        if path.exists():
            size = path.stat().st_size
            logger.info(f"  ✓ {role_name}: {path.name} ({size} bytes)")
        else:
            logger.error(f"  ✗ {role_name}: archivo NO encontrado")


if __name__ == "__main__":
    generate_all_storage_states()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// helpers/auth-setup.ts
/**
 * Generador de storage states para todos los roles.
 * Ejecutar ANTES de los tests para crear las sesiones autenticadas.
 *
 * Uso:
 *     npx ts-node helpers/auth-setup.ts
 */
import { chromium, Browser, BrowserContext } from 'playwright';
import fs from 'fs';
import path from 'path';
import { ALL_ROLES, UserRole } from './roles';

const AUTH_DIR = path.join(__dirname, '..', 'auth_states');
const BASE_URL = 'https://collab-platform.example.com';

async function createStorageState(
    browser: Browser,
    role: UserRole
): Promise&lt;string&gt; {
    console.log(\`Generando storage state para rol: \${role.name}\`);

    // Crear un contexto limpio para la autenticación
    const context = await browser.newContext({
        baseURL: BASE_URL,
        viewport: { width: 1280, height: 720 },
    });
    const page = await context.newPage();

    try {
        // 1. Navegar al login
        await page.goto('/login');
        await page.waitForLoadState('networkidle');

        // 2. Completar credenciales
        await page.getByLabel('Email').fill(role.username);
        await page.getByLabel('Contraseña').fill(role.password);
        await page.getByRole('button', { name: 'Iniciar sesión' }).click();

        // 3. Esperar a que el dashboard cargue (confirma autenticación)
        await page.waitForURL('**/dashboard', { timeout: 15000 });
        await page.waitForLoadState('networkidle');
        console.log(\`  Login exitoso para \${role.name}\`);

        // 4. Guardar el storage state (cookies + localStorage)
        if (!fs.existsSync(AUTH_DIR)) {
            fs.mkdirSync(AUTH_DIR, { recursive: true });
        }
        const statePath = role.storageStatePath;
        await context.storageState({ path: statePath });
        console.log(\`  Storage state guardado: \${statePath}\`);

        return statePath;
    } finally {
        await context.close();
    }
}

async function generateAllStorageStates(): Promise&lt;void&gt; {
    console.log('='.repeat(60));
    console.log('GENERANDO STORAGE STATES PARA TODOS LOS ROLES');
    console.log('='.repeat(60));

    const browser = await chromium.launch({ headless: true });

    try {
        for (const [roleName, role] of Object.entries(ALL_ROLES)) {
            await createStorageState(browser, role);
        }
    } finally {
        await browser.close();
    }

    console.log('='.repeat(60));
    console.log('TODOS LOS STORAGE STATES GENERADOS EXITOSAMENTE');
    console.log('='.repeat(60));

    // Verificar archivos creados
    for (const [roleName, role] of Object.entries(ALL_ROLES)) {
        const filePath = role.storageStatePath;
        if (fs.existsSync(filePath)) {
            const size = fs.statSync(filePath).size;
            console.log(\`  ✓ \${roleName}: \${path.basename(filePath)} (\${size} bytes)\`);
        } else {
            console.error(\`  ✗ \${roleName}: archivo NO encontrado\`);
        }
    }
}

generateAllStorageStates();</code></pre>
        </div>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Buena práctica: Storage state como fase de setup</h4>
            <p>Generar los storage states como un paso previo (no dentro de cada test) tiene
            ventajas importantes:</p>
            <ul>
                <li><strong>Velocidad:</strong> El login se hace 1 vez por rol, no 1 vez por test</li>
                <li><strong>Aislamiento:</strong> Cada test arranca con una sesión limpia y conocida</li>
                <li><strong>Estabilidad:</strong> Si el login cambia, solo se actualiza un archivo</li>
                <li><strong>CI/CD:</strong> Se puede cachear el storage state entre ejecuciones</li>
            </ul>
        </div>

        <h3>📄 Paso 5: pages/ — Page Objects para cada módulo</h3>
        <p>Cada page object encapsula las interacciones con un módulo de la plataforma.</p>

        <div class="code-tabs" data-code-id="L092-3">
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
            <pre><code class="language-python"># pages/login_page.py
"""Page Object para la página de login."""
from playwright.sync_api import Page, expect


class LoginPage:
    """Encapsula las interacciones con el módulo de autenticación."""

    def __init__(self, page: Page):
        self.page = page
        # Localizadores
        self.email_field = page.get_by_label("Email")
        self.password_field = page.get_by_label("Contraseña")
        self.login_button = page.get_by_role("button", name="Iniciar sesión")
        self.user_menu = page.get_by_role("button", name="Mi cuenta")
        self.logout_option = page.get_by_role("menuitem", name="Cerrar sesión")

    def login(self, email: str, password: str):
        """Realiza login con credenciales dadas."""
        self.page.goto("/login")
        self.email_field.fill(email)
        self.password_field.fill(password)
        self.login_button.click()
        self.page.wait_for_url("**/dashboard")

    def logout(self):
        """Cierra la sesión del usuario actual."""
        self.user_menu.click()
        self.logout_option.click()
        self.page.wait_for_url("**/login")

    def assert_logged_in(self):
        """Verifica que el usuario está autenticado."""
        expect(self.user_menu).to_be_visible()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// pages/login-page.ts
import { type Page, type Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly emailField: Locator;
    readonly passwordField: Locator;
    readonly loginButton: Locator;
    readonly userMenu: Locator;
    readonly logoutOption: Locator;

    constructor(page: Page) {
        this.page = page;
        // Localizadores
        this.emailField = page.getByLabel('Email');
        this.passwordField = page.getByLabel('Contraseña');
        this.loginButton = page.getByRole('button', { name: 'Iniciar sesión' });
        this.userMenu = page.getByRole('button', { name: 'Mi cuenta' });
        this.logoutOption = page.getByRole('menuitem', { name: 'Cerrar sesión' });
    }

    async login(email: string, password: string): Promise&lt;void&gt; {
        await this.page.goto('/login');
        await this.emailField.fill(email);
        await this.passwordField.fill(password);
        await this.loginButton.click();
        await this.page.waitForURL('**/dashboard');
    }

    async logout(): Promise&lt;void&gt; {
        await this.userMenu.click();
        await this.logoutOption.click();
        await this.page.waitForURL('**/login');
    }

    async assertLoggedIn(): Promise&lt;void&gt; {
        await expect(this.userMenu).toBeVisible();
    }
}</code></pre>
        </div>
        </div>

        <div class="code-tabs" data-code-id="L092-4">
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
            <pre><code class="language-python"># pages/projects_page.py
"""Page Object para la gestión de proyectos."""
from playwright.sync_api import Page, expect


class ProjectsPage:
    """Encapsula las interacciones con el módulo de proyectos."""

    def __init__(self, page: Page):
        self.page = page
        self.new_project_btn = page.get_by_role("button", name="Nuevo proyecto")
        self.project_name_field = page.get_by_label("Nombre del proyecto")
        self.project_desc_field = page.get_by_label("Descripción")
        self.save_btn = page.get_by_role("button", name="Guardar")
        self.delete_btn = page.get_by_role("button", name="Eliminar proyecto")
        self.project_list = page.locator("[data-testid='project-list']")
        self.settings_tab = page.get_by_role("tab", name="Configuración")

    def navigate(self):
        """Navega a la lista de proyectos."""
        self.page.goto("/projects")
        self.page.wait_for_load_state("networkidle")

    def create_project(self, name: str, description: str = "") -> str:
        """Crea un nuevo proyecto y retorna su ID."""
        self.new_project_btn.click()
        self.project_name_field.fill(name)
        if description:
            self.project_desc_field.fill(description)
        self.save_btn.click()

        # Esperar confirmación
        expect(self.page.get_by_text(f"Proyecto '{name}' creado")).to_be_visible()
        self.page.wait_for_load_state("networkidle")

        # Obtener el ID del proyecto desde la URL
        url = self.page.url
        project_id = url.split("/projects/")[-1]
        return project_id

    def delete_project(self, project_name: str):
        """Elimina un proyecto por nombre."""
        self.page.get_by_text(project_name).click()
        self.settings_tab.click()
        self.delete_btn.click()
        # Confirmar eliminación
        self.page.get_by_role("button", name="Confirmar").click()
        expect(self.page.get_by_text("Proyecto eliminado")).to_be_visible()

    def open_project(self, project_name: str):
        """Abre un proyecto por su nombre."""
        self.project_list.get_by_text(project_name).click()
        self.page.wait_for_load_state("networkidle")

    def assert_project_visible(self, project_name: str):
        """Verifica que un proyecto aparece en la lista."""
        expect(self.project_list.get_by_text(project_name)).to_be_visible()

    def assert_project_not_visible(self, project_name: str):
        """Verifica que un proyecto NO aparece en la lista."""
        expect(self.project_list.get_by_text(project_name)).not_to_be_visible()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// pages/projects-page.ts
import { type Page, type Locator, expect } from '@playwright/test';

export class ProjectsPage {
    readonly page: Page;
    readonly newProjectBtn: Locator;
    readonly projectNameField: Locator;
    readonly projectDescField: Locator;
    readonly saveBtn: Locator;
    readonly deleteBtn: Locator;
    readonly projectList: Locator;
    readonly settingsTab: Locator;

    constructor(page: Page) {
        this.page = page;
        this.newProjectBtn = page.getByRole('button', { name: 'Nuevo proyecto' });
        this.projectNameField = page.getByLabel('Nombre del proyecto');
        this.projectDescField = page.getByLabel('Descripción');
        this.saveBtn = page.getByRole('button', { name: 'Guardar' });
        this.deleteBtn = page.getByRole('button', { name: 'Eliminar proyecto' });
        this.projectList = page.locator('[data-testid="project-list"]');
        this.settingsTab = page.getByRole('tab', { name: 'Configuración' });
    }

    async navigate(): Promise&lt;void&gt; {
        await this.page.goto('/projects');
        await this.page.waitForLoadState('networkidle');
    }

    async createProject(name: string, description = ''): Promise&lt;string&gt; {
        await this.newProjectBtn.click();
        await this.projectNameField.fill(name);
        if (description) {
            await this.projectDescField.fill(description);
        }
        await this.saveBtn.click();

        // Esperar confirmación
        await expect(this.page.getByText(\`Proyecto '\${name}' creado\`)).toBeVisible();
        await this.page.waitForLoadState('networkidle');

        // Obtener el ID del proyecto desde la URL
        const url = this.page.url();
        const projectId = url.split('/projects/').pop()!;
        return projectId;
    }

    async deleteProject(projectName: string): Promise&lt;void&gt; {
        await this.page.getByText(projectName).click();
        await this.settingsTab.click();
        await this.deleteBtn.click();
        // Confirmar eliminación
        await this.page.getByRole('button', { name: 'Confirmar' }).click();
        await expect(this.page.getByText('Proyecto eliminado')).toBeVisible();
    }

    async openProject(projectName: string): Promise&lt;void&gt; {
        await this.projectList.getByText(projectName).click();
        await this.page.waitForLoadState('networkidle');
    }

    async assertProjectVisible(projectName: string): Promise&lt;void&gt; {
        await expect(this.projectList.getByText(projectName)).toBeVisible();
    }

    async assertProjectNotVisible(projectName: string): Promise&lt;void&gt; {
        await expect(this.projectList.getByText(projectName)).not.toBeVisible();
    }
}</code></pre>
        </div>
        </div>

        <div class="code-tabs" data-code-id="L092-5">
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
            <pre><code class="language-python"># pages/tasks_page.py
"""Page Object para la gestión de tareas dentro de un proyecto."""
from playwright.sync_api import Page, expect


class TasksPage:
    """Encapsula las interacciones con el módulo de tareas."""

    def __init__(self, page: Page):
        self.page = page
        self.new_task_btn = page.get_by_role("button", name="Nueva tarea")
        self.task_title_field = page.get_by_label("Título de la tarea")
        self.assignee_select = page.get_by_label("Asignar a")
        self.status_select = page.get_by_label("Estado")
        self.save_btn = page.get_by_role("button", name="Guardar")
        self.task_board = page.locator("[data-testid='task-board']")
        self.task_list = page.locator("[data-testid='task-list']")

    def create_task(self, title: str, assignee: str = ""):
        """Crea una nueva tarea y opcionalmente la asigna."""
        self.new_task_btn.click()
        self.task_title_field.fill(title)
        if assignee:
            self.assignee_select.select_option(label=assignee)
        self.save_btn.click()
        expect(self.page.get_by_text(f"Tarea '{title}' creada")).to_be_visible()

    def assign_task(self, task_title: str, assignee: str):
        """Asigna una tarea existente a un usuario."""
        self.task_list.get_by_text(task_title).click()
        self.assignee_select.select_option(label=assignee)
        self.save_btn.click()
        expect(self.page.get_by_text("Tarea actualizada")).to_be_visible()

    def update_status(self, task_title: str, new_status: str):
        """Actualiza el estado de una tarea."""
        self.task_list.get_by_text(task_title).click()
        self.status_select.select_option(label=new_status)
        self.save_btn.click()
        expect(self.page.get_by_text("Estado actualizado")).to_be_visible()

    def assert_task_exists(self, task_title: str):
        """Verifica que una tarea existe en el tablero."""
        expect(self.task_board.get_by_text(task_title)).to_be_visible()

    def assert_task_status(self, task_title: str, expected_status: str):
        """Verifica el estado actual de una tarea."""
        task_card = self.task_list.get_by_text(task_title).locator("..")
        expect(task_card.get_by_text(expected_status)).to_be_visible()

    def assert_task_assigned_to(self, task_title: str, assignee: str):
        """Verifica a quién está asignada una tarea."""
        task_card = self.task_list.get_by_text(task_title).locator("..")
        expect(task_card.get_by_text(assignee)).to_be_visible()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// pages/tasks-page.ts
import { type Page, type Locator, expect } from '@playwright/test';

export class TasksPage {
    readonly page: Page;
    readonly newTaskBtn: Locator;
    readonly taskTitleField: Locator;
    readonly assigneeSelect: Locator;
    readonly statusSelect: Locator;
    readonly saveBtn: Locator;
    readonly taskBoard: Locator;
    readonly taskList: Locator;

    constructor(page: Page) {
        this.page = page;
        this.newTaskBtn = page.getByRole('button', { name: 'Nueva tarea' });
        this.taskTitleField = page.getByLabel('Título de la tarea');
        this.assigneeSelect = page.getByLabel('Asignar a');
        this.statusSelect = page.getByLabel('Estado');
        this.saveBtn = page.getByRole('button', { name: 'Guardar' });
        this.taskBoard = page.locator('[data-testid="task-board"]');
        this.taskList = page.locator('[data-testid="task-list"]');
    }

    async createTask(title: string, assignee = ''): Promise&lt;void&gt; {
        await this.newTaskBtn.click();
        await this.taskTitleField.fill(title);
        if (assignee) {
            await this.assigneeSelect.selectOption({ label: assignee });
        }
        await this.saveBtn.click();
        await expect(this.page.getByText(\`Tarea '\${title}' creada\`)).toBeVisible();
    }

    async assignTask(taskTitle: string, assignee: string): Promise&lt;void&gt; {
        await this.taskList.getByText(taskTitle).click();
        await this.assigneeSelect.selectOption({ label: assignee });
        await this.saveBtn.click();
        await expect(this.page.getByText('Tarea actualizada')).toBeVisible();
    }

    async updateStatus(taskTitle: string, newStatus: string): Promise&lt;void&gt; {
        await this.taskList.getByText(taskTitle).click();
        await this.statusSelect.selectOption({ label: newStatus });
        await this.saveBtn.click();
        await expect(this.page.getByText('Estado actualizado')).toBeVisible();
    }

    async assertTaskExists(taskTitle: string): Promise&lt;void&gt; {
        await expect(this.taskBoard.getByText(taskTitle)).toBeVisible();
    }

    async assertTaskStatus(taskTitle: string, expectedStatus: string): Promise&lt;void&gt; {
        const taskCard = this.taskList.getByText(taskTitle).locator('..');
        await expect(taskCard.getByText(expectedStatus)).toBeVisible();
    }

    async assertTaskAssignedTo(taskTitle: string, assignee: string): Promise&lt;void&gt; {
        const taskCard = this.taskList.getByText(taskTitle).locator('..');
        await expect(taskCard.getByText(assignee)).toBeVisible();
    }
}</code></pre>
        </div>
        </div>

        <div class="code-tabs" data-code-id="L092-6">
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
            <pre><code class="language-python"># pages/settings_page.py
"""Page Object para la configuración del sistema."""
from playwright.sync_api import Page, expect


class SettingsPage:
    """Encapsula las interacciones con la configuración del sistema."""

    def __init__(self, page: Page):
        self.page = page
        self.nav_settings = page.get_by_role("link", name="Configuración")
        self.timezone_select = page.get_by_label("Zona horaria")
        self.notifications_toggle = page.get_by_label("Notificaciones por email")
        self.save_btn = page.get_by_role("button", name="Guardar cambios")
        self.access_denied_msg = page.get_by_text("No tienes permisos")

    def navigate(self):
        """Navega a la configuración del sistema."""
        self.nav_settings.click()
        self.page.wait_for_load_state("networkidle")

    def change_timezone(self, timezone: str):
        """Cambia la zona horaria del sistema."""
        self.timezone_select.select_option(label=timezone)
        self.save_btn.click()
        expect(self.page.get_by_text("Configuración actualizada")).to_be_visible()

    def assert_access_denied(self):
        """Verifica que el acceso está denegado."""
        expect(self.access_denied_msg).to_be_visible()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// pages/settings-page.ts
import { type Page, type Locator, expect } from '@playwright/test';

export class SettingsPage {
    readonly page: Page;
    readonly navSettings: Locator;
    readonly timezoneSelect: Locator;
    readonly notificationsToggle: Locator;
    readonly saveBtn: Locator;
    readonly accessDeniedMsg: Locator;

    constructor(page: Page) {
        this.page = page;
        this.navSettings = page.getByRole('link', { name: 'Configuración' });
        this.timezoneSelect = page.getByLabel('Zona horaria');
        this.notificationsToggle = page.getByLabel('Notificaciones por email');
        this.saveBtn = page.getByRole('button', { name: 'Guardar cambios' });
        this.accessDeniedMsg = page.getByText('No tienes permisos');
    }

    async navigate(): Promise&lt;void&gt; {
        await this.navSettings.click();
        await this.page.waitForLoadState('networkidle');
    }

    async changeTimezone(timezone: string): Promise&lt;void&gt; {
        await this.timezoneSelect.selectOption({ label: timezone });
        await this.saveBtn.click();
        await expect(this.page.getByText('Configuración actualizada')).toBeVisible();
    }

    async assertAccessDenied(): Promise&lt;void&gt; {
        await expect(this.accessDeniedMsg).toBeVisible();
    }
}</code></pre>
        </div>
        </div>

        <h3>🧩 Paso 6: tests/conftest.py — Fixtures multi-contexto</h3>
        <p>Este es el <strong>corazón del proyecto</strong>. Cada fixture crea un
        <code>BrowserContext</code> independiente con el storage state del rol correspondiente,
        garantizando aislamiento total entre usuarios.</p>

        <div class="code-tabs" data-code-id="L092-7">
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
            <pre><code class="language-python"># tests/conftest.py
"""
Fixtures globales para tests multi-usuario.
Cada rol tiene su propio BrowserContext con storage state independiente.
"""
import pytest
import logging
from pathlib import Path
from playwright.sync_api import Browser, BrowserContext, Page

from helpers.roles import ADMIN, PROJECT_MANAGER, DEVELOPER, VIEWER, UserRole
from pages.login_page import LoginPage
from pages.projects_page import ProjectsPage
from pages.tasks_page import TasksPage
from pages.settings_page import SettingsPage

# --- Logging ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger("multiusuario")

# --- Constantes ---
BASE_URL = "https://collab-platform.example.com"
SCREENSHOTS_DIR = Path(__file__).parent / "test-results" / "screenshots"
TRACES_DIR = Path(__file__).parent / "test-results" / "traces"


# =====================================================
# FIXTURE GENÉRICA: Crear contexto por rol
# =====================================================

def _create_role_context(
    browser: Browser,
    role: UserRole,
    viewport: dict = None
) -> BrowserContext:
    """
    Crea un BrowserContext con el storage state de un rol específico.

    Args:
        browser: Instancia de Browser de Playwright.
        role: Rol de usuario (contiene la ruta al storage state).
        viewport: Tamaño de viewport opcional.

    Returns:
        BrowserContext configurado y autenticado.
    """
    context_options = {
        "base_url": BASE_URL,
        "storage_state": role.storage_state_path,
        "viewport": viewport or {"width": 1280, "height": 720},
    }

    context = browser.new_context(**context_options)

    # Habilitar tracing para diagnóstico de fallos
    context.tracing.start(screenshots=True, snapshots=True, sources=True)

    logger.info(f"Contexto creado para rol: {role.name}")
    return context


def _teardown_context(context: BrowserContext, role_name: str, test_name: str):
    """
    Cierra un contexto guardando el trace si es necesario.

    Args:
        context: BrowserContext a cerrar.
        role_name: Nombre del rol (para nombrar archivos).
        test_name: Nombre del test (para nombrar archivos).
    """
    TRACES_DIR.mkdir(parents=True, exist_ok=True)
    trace_path = TRACES_DIR / f"{test_name}_{role_name}.zip"
    context.tracing.stop(path=str(trace_path))
    context.close()
    logger.info(f"Contexto cerrado para {role_name}, trace: {trace_path}")


# =====================================================
# FIXTURES POR ROL: Contexto + Page
# =====================================================

@pytest.fixture
def admin_context(browser: Browser) -> BrowserContext:
    """Contexto autenticado como administrador."""
    ctx = _create_role_context(browser, ADMIN)
    yield ctx
    ctx.close()


@pytest.fixture
def admin_page(admin_context: BrowserContext) -> Page:
    """Página autenticada como administrador."""
    page = admin_context.new_page()
    yield page
    page.close()


@pytest.fixture
def pm_context(browser: Browser) -> BrowserContext:
    """Contexto autenticado como project manager."""
    ctx = _create_role_context(browser, PROJECT_MANAGER)
    yield ctx
    ctx.close()


@pytest.fixture
def pm_page(pm_context: BrowserContext) -> Page:
    """Página autenticada como project manager."""
    page = pm_context.new_page()
    yield page
    page.close()


@pytest.fixture
def developer_context(browser: Browser) -> BrowserContext:
    """Contexto autenticado como developer."""
    ctx = _create_role_context(browser, DEVELOPER)
    yield ctx
    ctx.close()


@pytest.fixture
def developer_page(developer_context: BrowserContext) -> Page:
    """Página autenticada como developer."""
    page = developer_context.new_page()
    yield page
    page.close()


@pytest.fixture
def viewer_context(browser: Browser) -> BrowserContext:
    """Contexto autenticado como viewer (solo lectura)."""
    ctx = _create_role_context(browser, VIEWER)
    yield ctx
    ctx.close()


@pytest.fixture
def viewer_page(viewer_context: BrowserContext) -> Page:
    """Página autenticada como viewer (solo lectura)."""
    page = viewer_context.new_page()
    yield page
    page.close()


# =====================================================
# FIXTURES: Page Objects pre-configurados
# =====================================================

@pytest.fixture
def admin_projects(admin_page: Page) -> ProjectsPage:
    """ProjectsPage autenticada como admin."""
    projects = ProjectsPage(admin_page)
    projects.navigate()
    return projects


@pytest.fixture
def pm_tasks(pm_page: Page) -> TasksPage:
    """TasksPage autenticada como project manager."""
    return TasksPage(pm_page)


@pytest.fixture
def dev_tasks(developer_page: Page) -> TasksPage:
    """TasksPage autenticada como developer."""
    return TasksPage(developer_page)


# =====================================================
# FIXTURES: Multi-contexto simultáneo
# =====================================================

@pytest.fixture
def all_contexts(browser: Browser):
    """
    Crea contextos para los 4 roles simultáneamente.
    Retorna un diccionario {rol: (context, page)}.
    """
    contexts = {}
    roles = {
        "admin": ADMIN,
        "pm": PROJECT_MANAGER,
        "developer": DEVELOPER,
        "viewer": VIEWER,
    }

    for role_name, role in roles.items():
        ctx = _create_role_context(browser, role)
        page = ctx.new_page()
        contexts[role_name] = {"context": ctx, "page": page}
        logger.info(f"  Contexto '{role_name}' listo")

    yield contexts

    # Teardown: cerrar todos los contextos
    for role_name, data in contexts.items():
        data["page"].close()
        data["context"].close()
        logger.info(f"  Contexto '{role_name}' cerrado")


# =====================================================
# FIXTURES: Utilidades globales
# =====================================================

@pytest.fixture(autouse=True)
def log_test(request):
    """Log de inicio y fin de cada test."""
    nombre = request.node.name
    logger.info(f"{'='*60}")
    logger.info(f"INICIO: {nombre}")
    yield
    logger.info(f"FIN: {nombre}")


@pytest.fixture(autouse=True)
def screenshot_on_failure(request):
    """
    Screenshot automático en caso de fallo para cada page activa.
    Funciona con tests de un solo page o multi-contexto.
    """
    yield
    if hasattr(request.node, "rep_call") and request.node.rep_call.failed:
        SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)
        test_name = request.node.name
        # Intentar capturar screenshots de todos los fixtures de page
        for fixture_name in request.fixturenames:
            if "page" in fixture_name:
                try:
                    page = request.getfixturevalue(fixture_name)
                    ruta = SCREENSHOTS_DIR / f"{test_name}_{fixture_name}.png"
                    page.screenshot(path=str(ruta), full_page=True)
                    logger.error(f"Screenshot: {ruta}")
                except Exception:
                    pass


@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Hook para acceder al resultado del test en fixtures."""
    outcome = yield
    rep = outcome.get_result()
    setattr(item, f"rep_{rep.when}", rep)</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// tests/fixtures.ts
/**
 * Fixtures globales para tests multi-usuario.
 * Cada rol tiene su propio BrowserContext con storage state independiente.
 */
import { test as base, type Browser, type BrowserContext, type Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { ADMIN, PROJECT_MANAGER, DEVELOPER, VIEWER, type UserRole } from '../helpers/roles';
import { LoginPage } from '../pages/login-page';
import { ProjectsPage } from '../pages/projects-page';
import { TasksPage } from '../pages/tasks-page';
import { SettingsPage } from '../pages/settings-page';

// --- Constantes ---
const BASE_URL = 'https://collab-platform.example.com';
const SCREENSHOTS_DIR = path.join(__dirname, 'test-results', 'screenshots');
const TRACES_DIR = path.join(__dirname, 'test-results', 'traces');

// =====================================================
// FUNCIÓN GENÉRICA: Crear contexto por rol
// =====================================================

async function createRoleContext(
    browser: Browser,
    role: UserRole,
    viewport?: { width: number; height: number }
): Promise&lt;BrowserContext&gt; {
    const context = await browser.newContext({
        baseURL: BASE_URL,
        storageState: role.storageStatePath,
        viewport: viewport ?? { width: 1280, height: 720 },
    });

    // Habilitar tracing para diagnóstico de fallos
    await context.tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true,
    });

    console.log(\`Contexto creado para rol: \${role.name}\`);
    return context;
}

async function teardownContext(
    context: BrowserContext,
    roleName: string,
    testName: string
): Promise&lt;void&gt; {
    if (!fs.existsSync(TRACES_DIR)) {
        fs.mkdirSync(TRACES_DIR, { recursive: true });
    }
    const tracePath = path.join(TRACES_DIR, \`\${testName}_\${roleName}.zip\`);
    await context.tracing.stop({ path: tracePath });
    await context.close();
    console.log(\`Contexto cerrado para \${roleName}, trace: \${tracePath}\`);
}

// =====================================================
// TIPO DE FIXTURES PERSONALIZADAS
// =====================================================

type MultiUserFixtures = {
    adminContext: BrowserContext;
    adminPage: Page;
    pmContext: BrowserContext;
    pmPage: Page;
    developerContext: BrowserContext;
    developerPage: Page;
    viewerContext: BrowserContext;
    viewerPage: Page;
    adminProjects: ProjectsPage;
    pmTasks: TasksPage;
    devTasks: TasksPage;
    allContexts: Record&lt;string, { context: BrowserContext; page: Page }&gt;;
};

export const test = base.extend&lt;MultiUserFixtures&gt;({
    // --- Contextos por rol ---
    adminContext: async ({ browser }, use) => {
        const ctx = await createRoleContext(browser, ADMIN);
        await use(ctx);
        await ctx.close();
    },
    adminPage: async ({ adminContext }, use) => {
        const page = await adminContext.newPage();
        await use(page);
        await page.close();
    },
    pmContext: async ({ browser }, use) => {
        const ctx = await createRoleContext(browser, PROJECT_MANAGER);
        await use(ctx);
        await ctx.close();
    },
    pmPage: async ({ pmContext }, use) => {
        const page = await pmContext.newPage();
        await use(page);
        await page.close();
    },
    developerContext: async ({ browser }, use) => {
        const ctx = await createRoleContext(browser, DEVELOPER);
        await use(ctx);
        await ctx.close();
    },
    developerPage: async ({ developerContext }, use) => {
        const page = await developerContext.newPage();
        await use(page);
        await page.close();
    },
    viewerContext: async ({ browser }, use) => {
        const ctx = await createRoleContext(browser, VIEWER);
        await use(ctx);
        await ctx.close();
    },
    viewerPage: async ({ viewerContext }, use) => {
        const page = await viewerContext.newPage();
        await use(page);
        await page.close();
    },

    // --- Page Objects pre-configurados ---
    adminProjects: async ({ adminPage }, use) => {
        const projects = new ProjectsPage(adminPage);
        await projects.navigate();
        await use(projects);
    },
    pmTasks: async ({ pmPage }, use) => {
        await use(new TasksPage(pmPage));
    },
    devTasks: async ({ developerPage }, use) => {
        await use(new TasksPage(developerPage));
    },

    // --- Multi-contexto simultáneo ---
    allContexts: async ({ browser }, use) => {
        const roles = { admin: ADMIN, pm: PROJECT_MANAGER, developer: DEVELOPER, viewer: VIEWER };
        const contexts: Record&lt;string, { context: BrowserContext; page: Page }&gt; = {};

        for (const [roleName, role] of Object.entries(roles)) {
            const ctx = await createRoleContext(browser, role);
            const page = await ctx.newPage();
            contexts[roleName] = { context: ctx, page };
            console.log(\`  Contexto '\${roleName}' listo\`);
        }

        await use(contexts);

        // Teardown: cerrar todos los contextos
        for (const [roleName, data] of Object.entries(contexts)) {
            await data.page.close();
            await data.context.close();
            console.log(\`  Contexto '\${roleName}' cerrado\`);
        }
    },
});

// Screenshot automático en caso de fallo (configuración en playwright.config.ts)
// En @playwright/test se configura globalmente:
// use: { screenshot: 'only-on-failure', trace: 'retain-on-failure' }

export { expect } from '@playwright/test';</code></pre>
        </div>
        </div>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔬 Concepto avanzado: La fixture <code>all_contexts</code></h4>
            <p>La fixture <code>all_contexts</code> es el patrón clave de este proyecto. Crea
            <strong>4 BrowserContexts simultáneos</strong>, cada uno con su propio storage state.
            Esto simula 4 usuarios conectados al mismo tiempo, cada uno en su sesión aislada.
            Playwright gestiona los 4 contextos dentro del <strong>mismo proceso de browser</strong>,
            lo cual es mucho más eficiente que lanzar 4 browsers separados.</p>
        </div>

        <h3>🤝 Paso 7: test_colaboracion_multiusuario.py — Flujo colaborativo</h3>
        <p>Este test simula un flujo completo de trabajo: el admin crea un proyecto,
        el PM asigna tareas y el developer actualiza el estado. Todo en el mismo test,
        usando contextos independientes.</p>

        <div class="code-tabs" data-code-id="L092-8">
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
            <pre><code class="language-python"># tests/test_colaboracion_multiusuario.py
"""
Tests de colaboración multi-usuario.
Simula flujos donde múltiples roles interactúan en el mismo proyecto.
"""
import pytest
from playwright.sync_api import Browser, expect

from helpers.roles import ADMIN, PROJECT_MANAGER, DEVELOPER, VIEWER
from pages.projects_page import ProjectsPage
from pages.tasks_page import TasksPage


class TestColaboracionMultiUsuario:
    """Tests de flujos colaborativos con múltiples contextos."""

    @pytest.mark.multiuser
    @pytest.mark.smoke
    def test_flujo_completo_admin_pm_developer(self, browser: Browser):
        """
        Flujo colaborativo completo:
        1. Admin crea un proyecto
        2. PM asigna tareas al developer
        3. Developer actualiza el estado de la tarea
        4. Admin verifica que todo está actualizado
        """
        # ---- PASO 1: Admin crea el proyecto ----
        admin_ctx = browser.new_context(
            base_url="https://collab-platform.example.com",
            storage_state=ADMIN.storage_state_path,
        )
        admin_page = admin_ctx.new_page()
        admin_projects = ProjectsPage(admin_page)
        admin_projects.navigate()

        project_id = admin_projects.create_project(
            name="Sprint Q2-2025",
            description="Proyecto de testing automatizado"
        )
        assert project_id, "El proyecto debe tener un ID"

        # El admin puede cerrar su contexto o dejarlo abierto
        admin_page.close()
        admin_ctx.close()

        # ---- PASO 2: PM asigna tareas ----
        pm_ctx = browser.new_context(
            base_url="https://collab-platform.example.com",
            storage_state=PROJECT_MANAGER.storage_state_path,
        )
        pm_page = pm_ctx.new_page()

        # PM navega al proyecto recién creado
        pm_page.goto(f"/projects/{project_id}")
        pm_tasks = TasksPage(pm_page)

        # PM crea y asigna tareas
        pm_tasks.create_task(
            title="Implementar login tests",
            assignee="Developer"
        )
        pm_tasks.create_task(
            title="Configurar CI/CD",
            assignee="Developer"
        )
        pm_tasks.assert_task_exists("Implementar login tests")
        pm_tasks.assert_task_assigned_to("Implementar login tests", "Developer")

        pm_page.close()
        pm_ctx.close()

        # ---- PASO 3: Developer actualiza estado ----
        dev_ctx = browser.new_context(
            base_url="https://collab-platform.example.com",
            storage_state=DEVELOPER.storage_state_path,
        )
        dev_page = dev_ctx.new_page()

        dev_page.goto(f"/projects/{project_id}")
        dev_tasks = TasksPage(dev_page)

        # Developer ve sus tareas asignadas
        dev_tasks.assert_task_exists("Implementar login tests")

        # Developer actualiza el estado
        dev_tasks.update_status("Implementar login tests", "En progreso")
        dev_tasks.assert_task_status("Implementar login tests", "En progreso")

        dev_page.close()
        dev_ctx.close()

        # ---- PASO 4: Admin verifica el estado final ----
        admin_ctx2 = browser.new_context(
            base_url="https://collab-platform.example.com",
            storage_state=ADMIN.storage_state_path,
        )
        admin_page2 = admin_ctx2.new_page()
        admin_page2.goto(f"/projects/{project_id}")

        admin_tasks = TasksPage(admin_page2)
        admin_tasks.assert_task_status("Implementar login tests", "En progreso")
        admin_tasks.assert_task_status("Configurar CI/CD", "Pendiente")

        admin_page2.close()
        admin_ctx2.close()

    @pytest.mark.multiuser
    def test_contextos_simultaneos_4_roles(self, all_contexts):
        """
        Verifica que los 4 roles pueden operar simultáneamente
        sin interferencia entre contextos.
        """
        admin_page = all_contexts["admin"]["page"]
        pm_page = all_contexts["pm"]["page"]
        dev_page = all_contexts["developer"]["page"]
        viewer_page = all_contexts["viewer"]["page"]

        # Todos navegan al dashboard al mismo tiempo
        admin_page.goto("/dashboard")
        pm_page.goto("/dashboard")
        dev_page.goto("/dashboard")
        viewer_page.goto("/dashboard")

        # Cada uno ve su nombre de usuario en el menú
        expect(admin_page.get_by_text("admin@collab-platform.com")).to_be_visible()
        expect(pm_page.get_by_text("pm@collab-platform.com")).to_be_visible()
        expect(dev_page.get_by_text("dev@collab-platform.com")).to_be_visible()
        expect(viewer_page.get_by_text("viewer@collab-platform.com")).to_be_visible()

        # Verificar que cada contexto tiene cookies independientes
        admin_cookies = all_contexts["admin"]["context"].cookies()
        pm_cookies = all_contexts["pm"]["context"].cookies()
        assert admin_cookies != pm_cookies, (
            "Las cookies del admin y PM deben ser diferentes"
        )

    @pytest.mark.multiuser
    def test_aislamiento_storage_entre_contextos(self, browser: Browser):
        """
        Verifica que modificar localStorage en un contexto
        NO afecta a otro contexto.
        """
        # Contexto 1: Admin modifica localStorage
        ctx1 = browser.new_context(
            base_url="https://collab-platform.example.com",
            storage_state=ADMIN.storage_state_path,
        )
        page1 = ctx1.new_page()
        page1.goto("/dashboard")
        page1.evaluate("""
            localStorage.setItem('theme', 'dark');
            localStorage.setItem('language', 'es');
        """)

        # Contexto 2: Developer NO debe ver esos cambios
        ctx2 = browser.new_context(
            base_url="https://collab-platform.example.com",
            storage_state=DEVELOPER.storage_state_path,
        )
        page2 = ctx2.new_page()
        page2.goto("/dashboard")

        theme_ctx2 = page2.evaluate("localStorage.getItem('theme')")
        assert theme_ctx2 is None or theme_ctx2 != "dark", (
            "El localStorage del developer NO debe tener el tema del admin"
        )

        page1.close()
        page2.close()
        ctx1.close()
        ctx2.close()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// tests/test-colaboracion-multiusuario.spec.ts
import { test, expect } from './fixtures';
import { ADMIN, PROJECT_MANAGER, DEVELOPER, VIEWER } from '../helpers/roles';
import { ProjectsPage } from '../pages/projects-page';
import { TasksPage } from '../pages/tasks-page';

test.describe('Colaboración Multi-Usuario', () => {

    test('flujo completo admin → PM → developer @multiuser @smoke', async ({ browser }) => {
        // ---- PASO 1: Admin crea el proyecto ----
        const adminCtx = await browser.newContext({
            baseURL: 'https://collab-platform.example.com',
            storageState: ADMIN.storageStatePath,
        });
        const adminPage = await adminCtx.newPage();
        const adminProjects = new ProjectsPage(adminPage);
        await adminProjects.navigate();

        const projectId = await adminProjects.createProject(
            'Sprint Q2-2025',
            'Proyecto de testing automatizado'
        );
        expect(projectId).toBeTruthy();

        await adminPage.close();
        await adminCtx.close();

        // ---- PASO 2: PM asigna tareas ----
        const pmCtx = await browser.newContext({
            baseURL: 'https://collab-platform.example.com',
            storageState: PROJECT_MANAGER.storageStatePath,
        });
        const pmPage = await pmCtx.newPage();

        await pmPage.goto(\`/projects/\${projectId}\`);
        const pmTasks = new TasksPage(pmPage);

        await pmTasks.createTask('Implementar login tests', 'Developer');
        await pmTasks.createTask('Configurar CI/CD', 'Developer');
        await pmTasks.assertTaskExists('Implementar login tests');
        await pmTasks.assertTaskAssignedTo('Implementar login tests', 'Developer');

        await pmPage.close();
        await pmCtx.close();

        // ---- PASO 3: Developer actualiza estado ----
        const devCtx = await browser.newContext({
            baseURL: 'https://collab-platform.example.com',
            storageState: DEVELOPER.storageStatePath,
        });
        const devPage = await devCtx.newPage();

        await devPage.goto(\`/projects/\${projectId}\`);
        const devTasks = new TasksPage(devPage);

        await devTasks.assertTaskExists('Implementar login tests');
        await devTasks.updateStatus('Implementar login tests', 'En progreso');
        await devTasks.assertTaskStatus('Implementar login tests', 'En progreso');

        await devPage.close();
        await devCtx.close();

        // ---- PASO 4: Admin verifica el estado final ----
        const adminCtx2 = await browser.newContext({
            baseURL: 'https://collab-platform.example.com',
            storageState: ADMIN.storageStatePath,
        });
        const adminPage2 = await adminCtx2.newPage();
        await adminPage2.goto(\`/projects/\${projectId}\`);

        const adminTasks = new TasksPage(adminPage2);
        await adminTasks.assertTaskStatus('Implementar login tests', 'En progreso');
        await adminTasks.assertTaskStatus('Configurar CI/CD', 'Pendiente');

        await adminPage2.close();
        await adminCtx2.close();
    });

    test('contextos simultáneos 4 roles @multiuser', async ({ allContexts }) => {
        const adminPage = allContexts.admin.page;
        const pmPage = allContexts.pm.page;
        const devPage = allContexts.developer.page;
        const viewerPage = allContexts.viewer.page;

        // Todos navegan al dashboard al mismo tiempo
        await adminPage.goto('/dashboard');
        await pmPage.goto('/dashboard');
        await devPage.goto('/dashboard');
        await viewerPage.goto('/dashboard');

        // Cada uno ve su nombre de usuario en el menú
        await expect(adminPage.getByText('admin@collab-platform.com')).toBeVisible();
        await expect(pmPage.getByText('pm@collab-platform.com')).toBeVisible();
        await expect(devPage.getByText('dev@collab-platform.com')).toBeVisible();
        await expect(viewerPage.getByText('viewer@collab-platform.com')).toBeVisible();

        // Verificar que cada contexto tiene cookies independientes
        const adminCookies = await allContexts.admin.context.cookies();
        const pmCookies = await allContexts.pm.context.cookies();
        expect(adminCookies).not.toEqual(pmCookies);
    });

    test('aislamiento storage entre contextos @multiuser', async ({ browser }) => {
        // Contexto 1: Admin modifica localStorage
        const ctx1 = await browser.newContext({
            baseURL: 'https://collab-platform.example.com',
            storageState: ADMIN.storageStatePath,
        });
        const page1 = await ctx1.newPage();
        await page1.goto('/dashboard');
        await page1.evaluate(() => {
            localStorage.setItem('theme', 'dark');
            localStorage.setItem('language', 'es');
        });

        // Contexto 2: Developer NO debe ver esos cambios
        const ctx2 = await browser.newContext({
            baseURL: 'https://collab-platform.example.com',
            storageState: DEVELOPER.storageStatePath,
        });
        const page2 = await ctx2.newPage();
        await page2.goto('/dashboard');

        const themeCtx2 = await page2.evaluate(() => localStorage.getItem('theme'));
        expect(themeCtx2 === null || themeCtx2 !== 'dark').toBeTruthy();

        await page1.close();
        await page2.close();
        await ctx1.close();
        await ctx2.close();
    });
});</code></pre>
        </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA: Flujos multi-rol en ERP</h4>
            <p>En los tests de SIESA ERP, los flujos de aprobación involucran múltiples roles:
            un operador crea una orden, un supervisor la aprueba, un contador la registra.
            Este patrón de <strong>contextos secuenciales por rol</strong> es exactamente lo que
            necesitas para probar esos flujos end-to-end.</p>
        </div>

        <h3>🔔 Paso 8: test_notificaciones_tiempo_real.py — Notificaciones entre usuarios</h3>
        <div class="code-tabs" data-code-id="L092-9">
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
            <pre><code class="language-python"># tests/test_notificaciones_tiempo_real.py
"""
Tests de notificaciones en tiempo real.
Verifica que acciones de un usuario se reflejan en las sesiones de otros.
"""
import pytest
from playwright.sync_api import Browser, Page, expect

from helpers.roles import ADMIN, PROJECT_MANAGER, DEVELOPER, VIEWER


class TestNotificacionesTiempoReal:
    """Tests de notificaciones cross-context."""

    @pytest.mark.notifications
    @pytest.mark.smoke
    def test_anuncio_admin_visible_para_todos(self, all_contexts):
        """
        Cuando el admin envía un anuncio,
        todos los usuarios deben verlo en su panel de notificaciones.
        """
        admin_page = all_contexts["admin"]["page"]
        pm_page = all_contexts["pm"]["page"]
        dev_page = all_contexts["developer"]["page"]
        viewer_page = all_contexts["viewer"]["page"]

        # Todos navegan al dashboard
        for role_name, data in all_contexts.items():
            data["page"].goto("/dashboard")

        # Admin envía un anuncio
        admin_page.get_by_role("button", name="Nuevo anuncio").click()
        admin_page.get_by_label("Mensaje").fill(
            "Despliegue programado para el viernes 18:00"
        )
        admin_page.get_by_role("button", name="Enviar a todos").click()
        expect(admin_page.get_by_text("Anuncio enviado")).to_be_visible()

        # Verificar que cada usuario recibe la notificación
        texto_anuncio = "Despliegue programado para el viernes 18:00"

        for role_name in ["pm", "developer", "viewer"]:
            page = all_contexts[role_name]["page"]
            # Abrir panel de notificaciones
            page.get_by_role("button", name="Notificaciones").click()
            # Esperar a que aparezca la notificación (polling)
            expect(page.get_by_text(texto_anuncio)).to_be_visible(
                timeout=10000
            )

    @pytest.mark.notifications
    def test_asignacion_notifica_developer(self, browser: Browser):
        """
        Cuando el PM asigna una tarea al developer,
        este recibe una notificación en tiempo real.
        """
        # Crear ambos contextos simultáneamente
        pm_ctx = browser.new_context(
            base_url="https://collab-platform.example.com",
            storage_state=PROJECT_MANAGER.storage_state_path,
        )
        dev_ctx = browser.new_context(
            base_url="https://collab-platform.example.com",
            storage_state=DEVELOPER.storage_state_path,
        )
        pm_page = pm_ctx.new_page()
        dev_page = dev_ctx.new_page()

        try:
            # Developer abre su dashboard (para recibir notificaciones)
            dev_page.goto("/dashboard")

            # PM asigna una tarea
            pm_page.goto("/projects/sprint-q2/tasks")
            pm_page.get_by_role("button", name="Nueva tarea").click()
            pm_page.get_by_label("Título de la tarea").fill(
                "Revisar tests de regresión"
            )
            pm_page.get_by_label("Asignar a").select_option(label="Developer")
            pm_page.get_by_role("button", name="Guardar").click()

            # Developer debe ver la notificación
            notif_badge = dev_page.locator("[data-testid='notification-badge']")
            expect(notif_badge).to_be_visible(timeout=10000)

            # Abrir y verificar contenido
            dev_page.get_by_role("button", name="Notificaciones").click()
            expect(
                dev_page.get_by_text("Revisar tests de regresión")
            ).to_be_visible()

        finally:
            pm_page.close()
            dev_page.close()
            pm_ctx.close()
            dev_ctx.close()

    @pytest.mark.notifications
    def test_cambio_estado_notifica_pm(self, browser: Browser):
        """
        Cuando el developer cambia el estado de una tarea,
        el PM recibe una notificación.
        """
        pm_ctx = browser.new_context(
            base_url="https://collab-platform.example.com",
            storage_state=PROJECT_MANAGER.storage_state_path,
        )
        dev_ctx = browser.new_context(
            base_url="https://collab-platform.example.com",
            storage_state=DEVELOPER.storage_state_path,
        )
        pm_page = pm_ctx.new_page()
        dev_page = dev_ctx.new_page()

        try:
            # PM observa el tablero
            pm_page.goto("/projects/sprint-q2/tasks")

            # Developer actualiza una tarea
            dev_page.goto("/projects/sprint-q2/tasks")
            dev_page.get_by_text("Implementar login tests").click()
            dev_page.get_by_label("Estado").select_option(label="Completado")
            dev_page.get_by_role("button", name="Guardar").click()

            # PM ve la actualización reflejada en tiempo real
            # El tablero se actualiza vía WebSocket o polling
            task_card = pm_page.get_by_text("Implementar login tests").locator("..")
            expect(task_card.get_by_text("Completado")).to_be_visible(
                timeout=10000
            )

        finally:
            pm_page.close()
            dev_page.close()
            pm_ctx.close()
            dev_ctx.close()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// tests/test-notificaciones-tiempo-real.spec.ts
import { test, expect } from './fixtures';
import { ADMIN, PROJECT_MANAGER, DEVELOPER, VIEWER } from '../helpers/roles';

test.describe('Notificaciones Tiempo Real', () => {

    test('anuncio admin visible para todos @notifications @smoke', async ({ allContexts }) => {
        const adminPage = allContexts.admin.page;
        const pmPage = allContexts.pm.page;
        const devPage = allContexts.developer.page;
        const viewerPage = allContexts.viewer.page;

        // Todos navegan al dashboard
        for (const [, data] of Object.entries(allContexts)) {
            await data.page.goto('/dashboard');
        }

        // Admin envía un anuncio
        await adminPage.getByRole('button', { name: 'Nuevo anuncio' }).click();
        await adminPage.getByLabel('Mensaje').fill(
            'Despliegue programado para el viernes 18:00'
        );
        await adminPage.getByRole('button', { name: 'Enviar a todos' }).click();
        await expect(adminPage.getByText('Anuncio enviado')).toBeVisible();

        // Verificar que cada usuario recibe la notificación
        const textoAnuncio = 'Despliegue programado para el viernes 18:00';

        for (const roleName of ['pm', 'developer', 'viewer'] as const) {
            const page = allContexts[roleName].page;
            await page.getByRole('button', { name: 'Notificaciones' }).click();
            await expect(page.getByText(textoAnuncio)).toBeVisible({
                timeout: 10000,
            });
        }
    });

    test('asignación notifica developer @notifications', async ({ browser }) => {
        const pmCtx = await browser.newContext({
            baseURL: 'https://collab-platform.example.com',
            storageState: PROJECT_MANAGER.storageStatePath,
        });
        const devCtx = await browser.newContext({
            baseURL: 'https://collab-platform.example.com',
            storageState: DEVELOPER.storageStatePath,
        });
        const pmPage = await pmCtx.newPage();
        const devPage = await devCtx.newPage();

        try {
            // Developer abre su dashboard (para recibir notificaciones)
            await devPage.goto('/dashboard');

            // PM asigna una tarea
            await pmPage.goto('/projects/sprint-q2/tasks');
            await pmPage.getByRole('button', { name: 'Nueva tarea' }).click();
            await pmPage.getByLabel('Título de la tarea').fill(
                'Revisar tests de regresión'
            );
            await pmPage.getByLabel('Asignar a').selectOption({ label: 'Developer' });
            await pmPage.getByRole('button', { name: 'Guardar' }).click();

            // Developer debe ver la notificación
            const notifBadge = devPage.locator('[data-testid="notification-badge"]');
            await expect(notifBadge).toBeVisible({ timeout: 10000 });

            // Abrir y verificar contenido
            await devPage.getByRole('button', { name: 'Notificaciones' }).click();
            await expect(
                devPage.getByText('Revisar tests de regresión')
            ).toBeVisible();
        } finally {
            await pmPage.close();
            await devPage.close();
            await pmCtx.close();
            await devCtx.close();
        }
    });

    test('cambio estado notifica PM @notifications', async ({ browser }) => {
        const pmCtx = await browser.newContext({
            baseURL: 'https://collab-platform.example.com',
            storageState: PROJECT_MANAGER.storageStatePath,
        });
        const devCtx = await browser.newContext({
            baseURL: 'https://collab-platform.example.com',
            storageState: DEVELOPER.storageStatePath,
        });
        const pmPage = await pmCtx.newPage();
        const devPage = await devCtx.newPage();

        try {
            // PM observa el tablero
            await pmPage.goto('/projects/sprint-q2/tasks');

            // Developer actualiza una tarea
            await devPage.goto('/projects/sprint-q2/tasks');
            await devPage.getByText('Implementar login tests').click();
            await devPage.getByLabel('Estado').selectOption({ label: 'Completado' });
            await devPage.getByRole('button', { name: 'Guardar' }).click();

            // PM ve la actualización reflejada en tiempo real
            const taskCard = pmPage.getByText('Implementar login tests').locator('..');
            await expect(taskCard.getByText('Completado')).toBeVisible({
                timeout: 10000,
            });
        } finally {
            await pmPage.close();
            await devPage.close();
            await pmCtx.close();
            await devCtx.close();
        }
    });
});</code></pre>
        </div>
        </div>

        <h3>🛡️ Paso 9: test_permisos_por_rol.py — Verificación de permisos</h3>
        <p>Estos tests verifican que cada rol <strong>solo puede hacer lo que le corresponde</strong>.
        Es fundamental para la seguridad de la aplicación.</p>

        <div class="code-tabs" data-code-id="L092-10">
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
            <pre><code class="language-python"># tests/test_permisos_por_rol.py
"""
Tests de verificación de permisos por rol.
Cada test verifica que un rol NO puede realizar acciones fuera de su alcance.
"""
import pytest
from playwright.sync_api import Browser, Page, expect

from helpers.roles import (
    ADMIN, PROJECT_MANAGER, DEVELOPER, VIEWER,
    can_perform
)
from pages.projects_page import ProjectsPage
from pages.tasks_page import TasksPage
from pages.settings_page import SettingsPage


class TestPermisosViewer:
    """El viewer solo puede ver, no editar ni eliminar."""

    @pytest.mark.permissions
    @pytest.mark.smoke
    def test_viewer_no_puede_crear_proyecto(self, viewer_page: Page):
        """Viewer no debe poder crear proyectos."""
        viewer_page.goto("/projects")
        projects = ProjectsPage(viewer_page)

        # El botón "Nuevo proyecto" no debe existir o estar deshabilitado
        btn = viewer_page.get_by_role("button", name="Nuevo proyecto")
        expect(btn).not_to_be_visible()

    @pytest.mark.permissions
    def test_viewer_no_puede_editar_tarea(self, viewer_page: Page):
        """Viewer no debe poder editar tareas."""
        viewer_page.goto("/projects/sprint-q2/tasks")

        # Hacer clic en una tarea
        viewer_page.get_by_text("Implementar login tests").click()

        # Los campos deben estar deshabilitados o no visibles
        status_select = viewer_page.get_by_label("Estado")
        expect(status_select).to_be_disabled()

        # El botón guardar no debe estar disponible
        save_btn = viewer_page.get_by_role("button", name="Guardar")
        expect(save_btn).not_to_be_visible()

    @pytest.mark.permissions
    def test_viewer_no_puede_eliminar(self, viewer_page: Page):
        """Viewer no debe ver opciones de eliminación."""
        viewer_page.goto("/projects/sprint-q2")

        # No debe existir el botón de eliminar
        delete_btn = viewer_page.get_by_role("button", name="Eliminar proyecto")
        expect(delete_btn).not_to_be_visible()

    @pytest.mark.permissions
    def test_viewer_puede_ver_reportes(self, viewer_page: Page):
        """Viewer SÍ puede ver reportes."""
        viewer_page.goto("/reports")
        expect(viewer_page.get_by_role("heading", name="Reportes")).to_be_visible()


class TestPermisosDeveloper:
    """Developer puede editar tareas, pero no puede eliminar ni cambiar config."""

    @pytest.mark.permissions
    def test_developer_puede_actualizar_estado(self, developer_page: Page):
        """Developer puede actualizar el estado de sus tareas."""
        developer_page.goto("/projects/sprint-q2/tasks")
        developer_page.get_by_text("Implementar login tests").click()

        status_select = developer_page.get_by_label("Estado")
        expect(status_select).to_be_enabled()

    @pytest.mark.permissions
    def test_developer_no_puede_eliminar_proyecto(self, developer_page: Page):
        """Developer no puede eliminar proyectos."""
        developer_page.goto("/projects/sprint-q2")

        delete_btn = developer_page.get_by_role("button", name="Eliminar proyecto")
        expect(delete_btn).not_to_be_visible()

    @pytest.mark.permissions
    def test_developer_no_puede_asignar_tareas(self, developer_page: Page):
        """Developer no puede asignar tareas a otros usuarios."""
        developer_page.goto("/projects/sprint-q2/tasks")
        developer_page.get_by_text("Implementar login tests").click()

        assignee_select = developer_page.get_by_label("Asignar a")
        expect(assignee_select).to_be_disabled()

    @pytest.mark.permissions
    def test_developer_no_puede_cambiar_settings(self, developer_page: Page):
        """Developer no tiene acceso a la configuración del sistema."""
        developer_page.goto("/settings")
        settings = SettingsPage(developer_page)
        settings.assert_access_denied()


class TestPermisosProjectManager:
    """PM puede gestionar tareas y proyectos, pero no configuración global."""

    @pytest.mark.permissions
    def test_pm_puede_crear_proyecto(self, pm_page: Page):
        """PM puede crear proyectos."""
        pm_page.goto("/projects")
        btn = pm_page.get_by_role("button", name="Nuevo proyecto")
        expect(btn).to_be_visible()
        expect(btn).to_be_enabled()

    @pytest.mark.permissions
    def test_pm_puede_asignar_tareas(self, pm_page: Page):
        """PM puede asignar tareas a cualquier miembro."""
        pm_page.goto("/projects/sprint-q2/tasks")
        pm_page.get_by_text("Implementar login tests").click()

        assignee_select = pm_page.get_by_label("Asignar a")
        expect(assignee_select).to_be_enabled()

    @pytest.mark.permissions
    def test_pm_no_puede_cambiar_settings(self, pm_page: Page):
        """PM no tiene acceso a la configuración global del sistema."""
        pm_page.goto("/settings")
        settings = SettingsPage(pm_page)
        settings.assert_access_denied()

    @pytest.mark.permissions
    def test_pm_no_puede_eliminar_proyecto(self, pm_page: Page):
        """PM no puede eliminar proyectos (solo admin)."""
        pm_page.goto("/projects/sprint-q2")
        delete_btn = pm_page.get_by_role("button", name="Eliminar proyecto")
        expect(delete_btn).not_to_be_visible()


class TestPermisosAdmin:
    """Admin tiene todos los permisos."""

    @pytest.mark.permissions
    @pytest.mark.smoke
    def test_admin_puede_acceder_settings(self, admin_page: Page):
        """Admin puede acceder a la configuración del sistema."""
        admin_page.goto("/settings")
        settings = SettingsPage(admin_page)

        # No debe ver acceso denegado
        expect(
            admin_page.get_by_text("No tienes permisos")
        ).not_to_be_visible()

        # Debe poder cambiar configuración
        expect(admin_page.get_by_label("Zona horaria")).to_be_enabled()

    @pytest.mark.permissions
    def test_admin_puede_eliminar_proyecto(self, admin_page: Page):
        """Admin es el único que puede eliminar proyectos."""
        admin_page.goto("/projects/sprint-q2")
        delete_btn = admin_page.get_by_role("button", name="Eliminar proyecto")
        expect(delete_btn).to_be_visible()
        expect(delete_btn).to_be_enabled()

    @pytest.mark.permissions
    def test_admin_puede_gestionar_usuarios(self, admin_page: Page):
        """Admin puede acceder a la gestión de usuarios."""
        admin_page.goto("/admin/users")
        expect(
            admin_page.get_by_role("heading", name="Gestión de usuarios")
        ).to_be_visible()


class TestPermisosValidacionCruzada:
    """Validación cruzada: verificar roles contra la definición centralizada."""

    @pytest.mark.permissions
    def test_roles_definidos_correctamente(self):
        """Verifica la coherencia de la definición de roles."""
        # Admin tiene todos los permisos
        assert can_perform(ADMIN, "delete_project")
        assert can_perform(ADMIN, "change_settings")
        assert can_perform(ADMIN, "manage_users")

        # PM no puede eliminar ni cambiar settings
        assert can_perform(PROJECT_MANAGER, "create_project")
        assert can_perform(PROJECT_MANAGER, "assign_tasks")
        assert not can_perform(PROJECT_MANAGER, "delete_project")
        assert not can_perform(PROJECT_MANAGER, "change_settings")

        # Developer solo edita tareas
        assert can_perform(DEVELOPER, "edit_tasks")
        assert can_perform(DEVELOPER, "update_status")
        assert not can_perform(DEVELOPER, "delete_project")
        assert not can_perform(DEVELOPER, "assign_tasks")

        # Viewer solo ve
        assert can_perform(VIEWER, "view_reports")
        assert not can_perform(VIEWER, "edit_tasks")
        assert not can_perform(VIEWER, "create_project")
        assert not can_perform(VIEWER, "delete_project")</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// tests/test-permisos-por-rol.spec.ts
import { test, expect } from './fixtures';
import {
    ADMIN, PROJECT_MANAGER, DEVELOPER, VIEWER,
    canPerform,
} from '../helpers/roles';
import { ProjectsPage } from '../pages/projects-page';
import { TasksPage } from '../pages/tasks-page';
import { SettingsPage } from '../pages/settings-page';

test.describe('Permisos Viewer', () => {
    test('viewer no puede crear proyecto @permissions @smoke', async ({ viewerPage }) => {
        await viewerPage.goto('/projects');
        const btn = viewerPage.getByRole('button', { name: 'Nuevo proyecto' });
        await expect(btn).not.toBeVisible();
    });

    test('viewer no puede editar tarea @permissions', async ({ viewerPage }) => {
        await viewerPage.goto('/projects/sprint-q2/tasks');
        await viewerPage.getByText('Implementar login tests').click();

        const statusSelect = viewerPage.getByLabel('Estado');
        await expect(statusSelect).toBeDisabled();

        const saveBtn = viewerPage.getByRole('button', { name: 'Guardar' });
        await expect(saveBtn).not.toBeVisible();
    });

    test('viewer no puede eliminar @permissions', async ({ viewerPage }) => {
        await viewerPage.goto('/projects/sprint-q2');
        const deleteBtn = viewerPage.getByRole('button', { name: 'Eliminar proyecto' });
        await expect(deleteBtn).not.toBeVisible();
    });

    test('viewer puede ver reportes @permissions', async ({ viewerPage }) => {
        await viewerPage.goto('/reports');
        await expect(viewerPage.getByRole('heading', { name: 'Reportes' })).toBeVisible();
    });
});

test.describe('Permisos Developer', () => {
    test('developer puede actualizar estado @permissions', async ({ developerPage }) => {
        await developerPage.goto('/projects/sprint-q2/tasks');
        await developerPage.getByText('Implementar login tests').click();
        const statusSelect = developerPage.getByLabel('Estado');
        await expect(statusSelect).toBeEnabled();
    });

    test('developer no puede eliminar proyecto @permissions', async ({ developerPage }) => {
        await developerPage.goto('/projects/sprint-q2');
        const deleteBtn = developerPage.getByRole('button', { name: 'Eliminar proyecto' });
        await expect(deleteBtn).not.toBeVisible();
    });

    test('developer no puede asignar tareas @permissions', async ({ developerPage }) => {
        await developerPage.goto('/projects/sprint-q2/tasks');
        await developerPage.getByText('Implementar login tests').click();
        const assigneeSelect = developerPage.getByLabel('Asignar a');
        await expect(assigneeSelect).toBeDisabled();
    });

    test('developer no puede cambiar settings @permissions', async ({ developerPage }) => {
        await developerPage.goto('/settings');
        const settings = new SettingsPage(developerPage);
        await settings.assertAccessDenied();
    });
});

test.describe('Permisos Project Manager', () => {
    test('PM puede crear proyecto @permissions', async ({ pmPage }) => {
        await pmPage.goto('/projects');
        const btn = pmPage.getByRole('button', { name: 'Nuevo proyecto' });
        await expect(btn).toBeVisible();
        await expect(btn).toBeEnabled();
    });

    test('PM puede asignar tareas @permissions', async ({ pmPage }) => {
        await pmPage.goto('/projects/sprint-q2/tasks');
        await pmPage.getByText('Implementar login tests').click();
        const assigneeSelect = pmPage.getByLabel('Asignar a');
        await expect(assigneeSelect).toBeEnabled();
    });

    test('PM no puede cambiar settings @permissions', async ({ pmPage }) => {
        await pmPage.goto('/settings');
        const settings = new SettingsPage(pmPage);
        await settings.assertAccessDenied();
    });

    test('PM no puede eliminar proyecto @permissions', async ({ pmPage }) => {
        await pmPage.goto('/projects/sprint-q2');
        const deleteBtn = pmPage.getByRole('button', { name: 'Eliminar proyecto' });
        await expect(deleteBtn).not.toBeVisible();
    });
});

test.describe('Permisos Admin', () => {
    test('admin puede acceder settings @permissions @smoke', async ({ adminPage }) => {
        await adminPage.goto('/settings');
        await expect(adminPage.getByText('No tienes permisos')).not.toBeVisible();
        await expect(adminPage.getByLabel('Zona horaria')).toBeEnabled();
    });

    test('admin puede eliminar proyecto @permissions', async ({ adminPage }) => {
        await adminPage.goto('/projects/sprint-q2');
        const deleteBtn = adminPage.getByRole('button', { name: 'Eliminar proyecto' });
        await expect(deleteBtn).toBeVisible();
        await expect(deleteBtn).toBeEnabled();
    });

    test('admin puede gestionar usuarios @permissions', async ({ adminPage }) => {
        await adminPage.goto('/admin/users');
        await expect(
            adminPage.getByRole('heading', { name: 'Gestión de usuarios' })
        ).toBeVisible();
    });
});

test.describe('Validación Cruzada de Permisos', () => {
    test('roles definidos correctamente @permissions', async () => {
        // Admin tiene todos los permisos
        expect(canPerform(ADMIN, 'delete_project')).toBeTruthy();
        expect(canPerform(ADMIN, 'change_settings')).toBeTruthy();
        expect(canPerform(ADMIN, 'manage_users')).toBeTruthy();

        // PM no puede eliminar ni cambiar settings
        expect(canPerform(PROJECT_MANAGER, 'create_project')).toBeTruthy();
        expect(canPerform(PROJECT_MANAGER, 'assign_tasks')).toBeTruthy();
        expect(canPerform(PROJECT_MANAGER, 'delete_project')).toBeFalsy();
        expect(canPerform(PROJECT_MANAGER, 'change_settings')).toBeFalsy();

        // Developer solo edita tareas
        expect(canPerform(DEVELOPER, 'edit_tasks')).toBeTruthy();
        expect(canPerform(DEVELOPER, 'update_status')).toBeTruthy();
        expect(canPerform(DEVELOPER, 'delete_project')).toBeFalsy();
        expect(canPerform(DEVELOPER, 'assign_tasks')).toBeFalsy();

        // Viewer solo ve
        expect(canPerform(VIEWER, 'view_reports')).toBeTruthy();
        expect(canPerform(VIEWER, 'edit_tasks')).toBeFalsy();
        expect(canPerform(VIEWER, 'create_project')).toBeFalsy();
        expect(canPerform(VIEWER, 'delete_project')).toBeFalsy();
    });
});</code></pre>
        </div>
        </div>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚠️ Anti-patrón: Compartir contextos entre tests</h4>
            <div class="code-tabs" data-code-id="L092-11">
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
                <pre><code class="language-python"># ❌ MAL: Reutilizar el mismo contexto para diferentes tests
@pytest.fixture(scope="session")  # ← scope="session" es peligroso
def shared_admin_context(browser):
    ctx = browser.new_context(storage_state="admin_state.json")
    yield ctx
    ctx.close()

# Si un test modifica cookies o localStorage, TODOS los
# tests siguientes se ven afectados. Esto causa flaky tests.

# ✅ BIEN: Contexto nuevo por test (scope="function", el default)
@pytest.fixture  # scope="function" implícito
def admin_context(browser):
    ctx = browser.new_context(storage_state="admin_state.json")
    yield ctx
    ctx.close()

# Cada test tiene un contexto limpio y aislado.</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// ❌ MAL: Reutilizar el mismo contexto para diferentes tests
// En @playwright/test, NO hagas esto:
let sharedContext: BrowserContext; // Variable compartida

test.beforeAll(async ({ browser }) => {
    sharedContext = await browser.newContext({
        storageState: 'admin_state.json',
    });
});
// Si un test modifica cookies o localStorage, TODOS los
// tests siguientes se ven afectados. Esto causa flaky tests.

// ✅ BIEN: Contexto nuevo por test (comportamiento por defecto)
// En @playwright/test, cada test recibe su propio context:
const test = base.extend&lt;{ adminContext: BrowserContext }&gt;({
    adminContext: async ({ browser }, use) => {
        const ctx = await browser.newContext({
            storageState: 'admin_state.json',
        });
        await use(ctx);
        await ctx.close();
    },
});
// Cada test tiene un contexto limpio y aislado.</code></pre>
            </div>
            </div>
        </div>

        <h3>📱 Paso 10: test_crossbrowser_dispositivos.py — Mobile vs Desktop</h3>
        <p>Combinamos múltiples contextos con emulación de dispositivos para verificar
        que la plataforma funciona correctamente en diferentes configuraciones.</p>

        <div class="code-tabs" data-code-id="L092-12">
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
            <pre><code class="language-python"># tests/test_crossbrowser_dispositivos.py
"""
Tests cross-browser con emulación de dispositivos.
Verifica que la plataforma funciona en desktop y mobile.
"""
import pytest
from playwright.sync_api import Browser, BrowserContext, Page, expect

from helpers.roles import DEVELOPER, PROJECT_MANAGER


class TestCrossBrowserDispositivos:
    """Tests que combinan múltiples contextos con diferentes dispositivos."""

    @pytest.mark.crossbrowser
    @pytest.mark.smoke
    def test_desktop_vs_mobile_misma_sesion(self, browser: Browser):
        """
        Un mismo usuario puede ver el dashboard en desktop y mobile
        simultáneamente, con layouts diferentes pero datos consistentes.
        """
        # Contexto desktop
        desktop_ctx = browser.new_context(
            base_url="https://collab-platform.example.com",
            storage_state=DEVELOPER.storage_state_path,
            viewport={"width": 1920, "height": 1080},
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
            ),
        )
        desktop_page = desktop_ctx.new_page()

        # Contexto mobile (iPhone 14)
        mobile_ctx = browser.new_context(
            base_url="https://collab-platform.example.com",
            storage_state=DEVELOPER.storage_state_path,
            viewport={"width": 390, "height": 844},
            user_agent=(
                "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) "
                "AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1"
            ),
            is_mobile=True,
            has_touch=True,
        )
        mobile_page = mobile_ctx.new_page()

        try:
            # Ambos navegan al dashboard
            desktop_page.goto("/dashboard")
            mobile_page.goto("/dashboard")

            # Desktop: sidebar visible
            desktop_sidebar = desktop_page.locator("[data-testid='sidebar']")
            expect(desktop_sidebar).to_be_visible()

            # Mobile: sidebar oculta (hay menú hamburguesa)
            mobile_sidebar = mobile_page.locator("[data-testid='sidebar']")
            expect(mobile_sidebar).not_to_be_visible()

            hamburger = mobile_page.get_by_role("button", name="Menú")
            expect(hamburger).to_be_visible()

            # Ambos ven los mismos datos
            desktop_tasks_count = desktop_page.locator(
                "[data-testid='task-count']"
            ).text_content()
            mobile_tasks_count = mobile_page.locator(
                "[data-testid='task-count']"
            ).text_content()
            assert desktop_tasks_count == mobile_tasks_count, (
                "Desktop y mobile deben mostrar el mismo conteo de tareas"
            )

        finally:
            desktop_page.close()
            mobile_page.close()
            desktop_ctx.close()
            mobile_ctx.close()

    @pytest.mark.crossbrowser
    def test_tablet_layout_responsive(self, browser: Browser):
        """
        Verifica que el layout se adapta correctamente a una tablet.
        """
        tablet_ctx = browser.new_context(
            base_url="https://collab-platform.example.com",
            storage_state=PROJECT_MANAGER.storage_state_path,
            viewport={"width": 1024, "height": 768},  # iPad landscape
            user_agent=(
                "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) "
                "AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1"
            ),
            is_mobile=True,
            has_touch=True,
        )
        tablet_page = tablet_ctx.new_page()

        try:
            tablet_page.goto("/projects")

            # En tablet, el layout debería ser de 2 columnas (no 1 ni 3)
            project_grid = tablet_page.locator("[data-testid='project-grid']")
            expect(project_grid).to_be_visible()

            # Verificar que los proyectos son interactuables con touch
            first_project = project_grid.locator(".project-card").first
            first_project.tap()  # Usar tap() en vez de click() para mobile
            tablet_page.wait_for_load_state("networkidle")

        finally:
            tablet_page.close()
            tablet_ctx.close()

    @pytest.mark.crossbrowser
    def test_contextos_con_diferentes_locales(self, browser: Browser):
        """
        Verifica que la plataforma se adapta al idioma del contexto.
        Útil para plataformas multilingüe.
        """
        # Contexto en español
        ctx_es = browser.new_context(
            base_url="https://collab-platform.example.com",
            storage_state=DEVELOPER.storage_state_path,
            locale="es-CO",
            timezone_id="America/Bogota",
        )
        page_es = ctx_es.new_page()

        # Contexto en inglés
        ctx_en = browser.new_context(
            base_url="https://collab-platform.example.com",
            storage_state=DEVELOPER.storage_state_path,
            locale="en-US",
            timezone_id="America/New_York",
        )
        page_en = ctx_en.new_page()

        try:
            page_es.goto("/dashboard")
            page_en.goto("/dashboard")

            # Verificar que las fechas se formatean según el locale
            fecha_es = page_es.locator("[data-testid='current-date']").text_content()
            fecha_en = page_en.locator("[data-testid='current-date']").text_content()

            # El formato debe ser diferente
            assert fecha_es != fecha_en, (
                f"Las fechas deben ser diferentes por locale: "
                f"ES='{fecha_es}' vs EN='{fecha_en}'"
            )

        finally:
            page_es.close()
            page_en.close()
            ctx_es.close()
            ctx_en.close()

    @pytest.mark.crossbrowser
    def test_geolocation_y_permisos(self, browser: Browser):
        """
        Verifica el comportamiento con geolocalización.
        Útil para plataformas que adaptan contenido por ubicación.
        """
        # Contexto con ubicación en Colombia (Cali)
        ctx_co = browser.new_context(
            base_url="https://collab-platform.example.com",
            storage_state=DEVELOPER.storage_state_path,
            geolocation={"longitude": -76.5225, "latitude": 3.4516},
            permissions=["geolocation"],
            locale="es-CO",
            timezone_id="America/Bogota",
        )
        page_co = ctx_co.new_page()

        try:
            page_co.goto("/dashboard")

            # Verificar que la zona horaria se detecta correctamente
            timezone_display = page_co.locator(
                "[data-testid='user-timezone']"
            )
            expect(timezone_display).to_contain_text("Bogota")

        finally:
            page_co.close()
            ctx_co.close()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// tests/test-crossbrowser-dispositivos.spec.ts
import { test, expect } from './fixtures';
import { DEVELOPER, PROJECT_MANAGER } from '../helpers/roles';

test.describe('Cross-Browser y Dispositivos', () => {

    test('desktop vs mobile misma sesión @crossbrowser @smoke', async ({ browser }) => {
        // Contexto desktop
        const desktopCtx = await browser.newContext({
            baseURL: 'https://collab-platform.example.com',
            storageState: DEVELOPER.storageStatePath,
            viewport: { width: 1920, height: 1080 },
            userAgent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
                'AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        });
        const desktopPage = await desktopCtx.newPage();

        // Contexto mobile (iPhone 14)
        const mobileCtx = await browser.newContext({
            baseURL: 'https://collab-platform.example.com',
            storageState: DEVELOPER.storageStatePath,
            viewport: { width: 390, height: 844 },
            userAgent:
                'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) ' +
                'AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
            isMobile: true,
            hasTouch: true,
        });
        const mobilePage = await mobileCtx.newPage();

        try {
            // Ambos navegan al dashboard
            await desktopPage.goto('/dashboard');
            await mobilePage.goto('/dashboard');

            // Desktop: sidebar visible
            const desktopSidebar = desktopPage.locator('[data-testid="sidebar"]');
            await expect(desktopSidebar).toBeVisible();

            // Mobile: sidebar oculta (hay menú hamburguesa)
            const mobileSidebar = mobilePage.locator('[data-testid="sidebar"]');
            await expect(mobileSidebar).not.toBeVisible();

            const hamburger = mobilePage.getByRole('button', { name: 'Menú' });
            await expect(hamburger).toBeVisible();

            // Ambos ven los mismos datos
            const desktopTasksCount = await desktopPage
                .locator('[data-testid="task-count"]').textContent();
            const mobileTasksCount = await mobilePage
                .locator('[data-testid="task-count"]').textContent();
            expect(desktopTasksCount).toBe(mobileTasksCount);
        } finally {
            await desktopPage.close();
            await mobilePage.close();
            await desktopCtx.close();
            await mobileCtx.close();
        }
    });

    test('tablet layout responsive @crossbrowser', async ({ browser }) => {
        const tabletCtx = await browser.newContext({
            baseURL: 'https://collab-platform.example.com',
            storageState: PROJECT_MANAGER.storageStatePath,
            viewport: { width: 1024, height: 768 }, // iPad landscape
            userAgent:
                'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) ' +
                'AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
            isMobile: true,
            hasTouch: true,
        });
        const tabletPage = await tabletCtx.newPage();

        try {
            await tabletPage.goto('/projects');

            const projectGrid = tabletPage.locator('[data-testid="project-grid"]');
            await expect(projectGrid).toBeVisible();

            // Verificar que los proyectos son interactuables con touch
            const firstProject = projectGrid.locator('.project-card').first();
            await firstProject.tap(); // Usar tap() en vez de click() para mobile
            await tabletPage.waitForLoadState('networkidle');
        } finally {
            await tabletPage.close();
            await tabletCtx.close();
        }
    });

    test('contextos con diferentes locales @crossbrowser', async ({ browser }) => {
        // Contexto en español
        const ctxEs = await browser.newContext({
            baseURL: 'https://collab-platform.example.com',
            storageState: DEVELOPER.storageStatePath,
            locale: 'es-CO',
            timezoneId: 'America/Bogota',
        });
        const pageEs = await ctxEs.newPage();

        // Contexto en inglés
        const ctxEn = await browser.newContext({
            baseURL: 'https://collab-platform.example.com',
            storageState: DEVELOPER.storageStatePath,
            locale: 'en-US',
            timezoneId: 'America/New_York',
        });
        const pageEn = await ctxEn.newPage();

        try {
            await pageEs.goto('/dashboard');
            await pageEn.goto('/dashboard');

            // Verificar que las fechas se formatean según el locale
            const fechaEs = await pageEs
                .locator('[data-testid="current-date"]').textContent();
            const fechaEn = await pageEn
                .locator('[data-testid="current-date"]').textContent();

            expect(fechaEs).not.toBe(fechaEn);
        } finally {
            await pageEs.close();
            await pageEn.close();
            await ctxEs.close();
            await ctxEn.close();
        }
    });

    test('geolocation y permisos @crossbrowser', async ({ browser }) => {
        // Contexto con ubicación en Colombia (Cali)
        const ctxCo = await browser.newContext({
            baseURL: 'https://collab-platform.example.com',
            storageState: DEVELOPER.storageStatePath,
            geolocation: { longitude: -76.5225, latitude: 3.4516 },
            permissions: ['geolocation'],
            locale: 'es-CO',
            timezoneId: 'America/Bogota',
        });
        const pageCo = await ctxCo.newPage();

        try {
            await pageCo.goto('/dashboard');

            const timezoneDisplay = pageCo.locator(
                '[data-testid="user-timezone"]'
            );
            await expect(timezoneDisplay).toContainText('Bogota');
        } finally {
            await pageCo.close();
            await ctxCo.close();
        }
    });
});</code></pre>
        </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA: Emulación de dispositivos en ERP</h4>
            <p>Las aplicaciones empresariales de SIESA se usan tanto en desktop (oficina) como
            en tablets (bodega, producción). Crear contextos con diferentes viewports y touch
            permite verificar que los módulos críticos funcionan en todos los dispositivos
            <strong>sin necesidad de dispositivos físicos</strong>.</p>
        </div>

        <h3>▶️ Paso 11: Ejecutar la suite completa</h3>
        <pre><code class="bash"># 1. Generar los storage states (ejecutar una vez)
cd proyecto_multiusuario
python -m helpers.auth_setup

# 2. Ejecutar TODA la suite
pytest tests/ -v

# 3. Ejecutar por categoría
pytest tests/ -m multiuser -v        # Tests de colaboración
pytest tests/ -m notifications -v     # Tests de notificaciones
pytest tests/ -m permissions -v       # Tests de permisos
pytest tests/ -m crossbrowser -v      # Tests cross-browser
pytest tests/ -m smoke -v             # Smoke tests

# 4. Con traces para debugging
pytest tests/ -v --tracing=retain-on-failure

# 5. Ejecutar un test específico
pytest tests/test_permisos_por_rol.py::TestPermisosViewer -v

# 6. Ver el trace de un test fallido
playwright show-trace test-results/traces/test_nombre_rol.zip

# 7. Ejecutar con paralelismo (requiere pytest-xdist)
pip install pytest-xdist
pytest tests/ -v -n 4  # 4 workers en paralelo</code></pre>

        <h3>📊 Resumen de tests del proyecto</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📋 Mapa de cobertura</h4>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #c8e6c9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Archivo</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Concepto</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Tests</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Contextos</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>test_colaboracion_multiusuario.py</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Múltiples contexts, storage state, aislamiento</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">3</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">4 roles (secuencial + simultáneo)</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>test_notificaciones_tiempo_real.py</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Contextos paralelos, WebSocket/polling</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">3</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">2-4 roles simultáneos</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>test_permisos_por_rol.py</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Permisos, acceso denegado, validación cruzada</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">12</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">1 context por test (viewer, dev, PM, admin)</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>test_crossbrowser_dispositivos.py</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Emulación mobile/tablet, locale, geolocation</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">4</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">2-3 contexts con diferentes configs</td>
                </tr>
                <tr style="background: #c8e6c9; font-weight: bold;">
                    <td style="padding: 6px; border: 1px solid #ddd;">TOTAL</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Cobertura completa de Sección 13</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">22</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Todos los patrones</td>
                </tr>
            </table>
        </div>

        <h3>📊 Resumen de la Sección 13</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎉 Sección 13 Completada: Browser Contexts e Isolation</h4>
            <p>Has dominado el aislamiento y la gestión de múltiples contextos en Playwright:</p>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #c8e6c9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Lección</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Tema</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Tipo</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">088</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Browser vs Context vs Page</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Foundation</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">089</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Tests con múltiples contexts</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">090</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Storage state: reutilizar sesiones</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;">091</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Perfiles de navegador y configuración</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Standard</td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;">092</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Proyecto: Tests multi-usuario con aislamiento</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Integration</td>
                </tr>
            </table>
        </div>

        <h3>🏆 Habilidades adquiridas en la Sección 13</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <ul>
                <li><strong>Jerarquía Browser/Context/Page:</strong> Entender la relación y cuándo crear cada nivel</li>
                <li><strong>Múltiples contexts:</strong> Simular varios usuarios simultáneos en un mismo browser</li>
                <li><strong>Storage state:</strong> Guardar y reutilizar sesiones autenticadas para acelerar tests</li>
                <li><strong>Aislamiento:</strong> Cookies, localStorage y sessionStorage completamente independientes por contexto</li>
                <li><strong>Perfiles de navegador:</strong> Configurar viewport, locale, timezone, geolocation por contexto</li>
                <li><strong>Emulación de dispositivos:</strong> Mobile, tablet, desktop con user-agents reales</li>
                <li><strong>Tracing por contexto:</strong> Capturar traces independientes para cada rol</li>
                <li><strong>Fixtures multi-contexto:</strong> Patrones de conftest.py para manejar N contextos por test</li>
                <li><strong>Verificación de permisos:</strong> Tests sistemáticos de lo que cada rol puede y no puede hacer</li>
                <li><strong>Flujos colaborativos:</strong> Encadenar acciones de múltiples usuarios en secuencia</li>
            </ul>
        </div>

        <h3>🎯 Ejercicio final</h3>
        <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 15px 0;">
            <h4>🏋️ Extiende el proyecto con estos desafíos</h4>
            <ol>
                <li><strong>Nuevo rol "auditor":</strong> Agrega un rol que pueda ver todo (como admin) pero
                    no pueda modificar nada (como viewer). Crea su storage state, fixtures y al menos
                    3 tests de permisos.</li>
                <li><strong>Test de sesión expirada:</strong> Crea un test que modifique el storage state
                    para simular una sesión expirada y verifique que el usuario es redirigido al login:
                    <div class="code-tabs" data-code-id="L092-13">
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
                        <pre><code class="language-python"># Pista: modifica las cookies del contexto
context = browser.new_context(storage_state=ADMIN.storage_state_path)
# Limpiar cookies para simular expiración
context.clear_cookies()
page = context.new_page()
page.goto("/dashboard")
# Debería redirigir a /login
expect(page).to_have_url("**/login")</code></pre>
                    </div>
                    <div class="code-panel" data-lang="typescript">
                        <pre><code class="language-typescript">// Pista: modifica las cookies del contexto
const context = await browser.newContext({
    storageState: ADMIN.storageStatePath,
});
// Limpiar cookies para simular expiración
await context.clearCookies();
const page = await context.newPage();
await page.goto('/dashboard');
// Debería redirigir a /login
await expect(page).toHaveURL('**/login');</code></pre>
                    </div>
                    </div>
                </li>
                <li><strong>Test de concurrencia:</strong> Crea un test donde el admin y el PM intentan
                    editar la misma tarea simultáneamente. Verifica que la plataforma maneja el conflicto
                    (optimistic locking, last-write-wins, etc.).</li>
                <li><strong>Fixture parametrizada:</strong> Crea una fixture que acepte el rol como parámetro
                    para evitar duplicar código:
                    <div class="code-tabs" data-code-id="L092-14">
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
                        <pre><code class="language-python"># Pista: usar indirect fixtures
@pytest.fixture
def role_page(request, browser):
    """Fixture parametrizada que crea un contexto para cualquier rol."""
    role = request.param
    ctx = browser.new_context(
        base_url=BASE_URL,
        storage_state=role.storage_state_path,
    )
    page = ctx.new_page()
    yield page
    page.close()
    ctx.close()

@pytest.mark.parametrize("role_page", [ADMIN, PROJECT_MANAGER], indirect=True)
def test_puede_ver_dashboard(role_page):
    role_page.goto("/dashboard")
    expect(role_page.get_by_role("heading", name="Dashboard")).to_be_visible()</code></pre>
                    </div>
                    <div class="code-panel" data-lang="typescript">
                        <pre><code class="language-typescript">// Pista: usar array de roles + loop
import { ADMIN, PROJECT_MANAGER } from '../helpers/roles';

const rolesToTest = [ADMIN, PROJECT_MANAGER];

for (const role of rolesToTest) {
    test(\`\${role.name} puede ver dashboard\`, async ({ browser }) => {
        const ctx = await browser.newContext({
            baseURL: BASE_URL,
            storageState: role.storageStatePath,
        });
        const page = await ctx.newPage();
        await page.goto('/dashboard');
        await expect(
            page.getByRole('heading', { name: 'Dashboard' })
        ).toBeVisible();
        await page.close();
        await ctx.close();
    });
}</code></pre>
                    </div>
                    </div>
                </li>
                <li><strong>Reporte HTML:</strong> Genera un reporte con <code>pytest-html</code> que
                    incluya screenshots de cada contexto en caso de fallo:
                    <pre><code class="bash">pip install pytest-html
pytest tests/ -v --html=test-results/report.html --self-contained-html</code></pre>
                </li>
            </ol>

            <div style="background: #ffe0b2; padding: 10px; border-radius: 5px; margin-top: 10px;">
                <strong>Criterios de evaluación:</strong>
                <ul>
                    <li>Cada rol tiene su propio storage state generado por <code>auth_setup.py</code></li>
                    <li>Los tests de colaboración usan contextos secuenciales (un rol tras otro)</li>
                    <li>Los tests de notificaciones usan contextos simultáneos (varios roles al mismo tiempo)</li>
                    <li>Los tests de permisos verifican tanto acciones permitidas como denegadas</li>
                    <li>Los tests cross-browser usan emulación de dispositivos con viewports reales</li>
                    <li>El <code>conftest.py</code> no repite código: usa una función base para crear contextos</li>
                    <li>Cada contexto tiene tracing habilitado para facilitar el debugging</li>
                    <li>La suite completa pasa con <code>pytest tests/ -v</code></li>
                </ul>
            </div>
        </div>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Diseñar un framework multi-usuario con storage states por rol</li>
                <li>Crear fixtures que gestionan múltiples BrowserContexts simultáneos</li>
                <li>Implementar tests de colaboración secuencial (admin -> PM -> dev)</li>
                <li>Verificar notificaciones en tiempo real entre contextos</li>
                <li>Automatizar la verificación de permisos por rol de forma exhaustiva</li>
                <li>Combinar emulación de dispositivos con storage state</li>
                <li>Aplicar tracing por contexto para diagnóstico de fallos</li>
                <li>Integrar todos los conceptos de la Sección 13 en un proyecto cohesivo</li>
            </ul>
        </div>

        <h3>🚀 Siguiente: Sección 14 — Debugging: Inspector, Trace, Codegen</h3>
        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Con el dominio de Browser Contexts y aislamiento, estás listo para las
            <strong>herramientas de debugging de Playwright</strong>. En la Sección 14 aprenderás:</p>
            <ul>
                <li><strong>Playwright Inspector y PWDEBUG:</strong> Depuración interactiva paso a paso</li>
                <li><strong>Playwright Codegen:</strong> Generación automática de código a partir de acciones manuales</li>
                <li><strong>Trace Viewer:</strong> Grabación y análisis visual de ejecuciones</li>
                <li><strong>Debug avanzado:</strong> Breakpoints, integración con VS Code</li>
                <li><strong>Análisis de fallos:</strong> Screenshots, videos y diagnóstico sistemático</li>
                <li><strong>Proyecto integrador:</strong> Diagnosticar y corregir un test inestable</li>
            </ul>
            <p>Los traces que capturaste en este proyecto serán tu mejor aliado para entender
            qué pasó cuando un test multi-usuario falla. La Sección 14 te enseñará a leerlos como un experto.</p>
        </div>
    `,
    topics: ["proyecto", "multi-usuario", "aislamiento"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 10,
    difficulty: "medium",
    type: "integration"
};

if (typeof window !== 'undefined') {
    window.LESSON_092 = LESSON_092;
}
