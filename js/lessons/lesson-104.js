/**
 * Playwright Academy - Lección 104
 * Proyecto: Suite visual + a11y + security
 * Sección 15: Visual Regression y Accessibility Testing
 */

const LESSON_104 = {
    id: 104,
    title: "Proyecto: Suite visual + a11y + security",
    duration: "15 min",
    level: "advanced",
    section: "section-15",
    content: `
        <h2>🚀 Proyecto: Suite visual + a11y + security</h2>
        <p>En este proyecto capstone de la <strong>Sección 15</strong> construirás una <strong>suite de auditoría
        de calidad integral</strong> para un portal corporativo (similar a los módulos web de HCM o ERP de SIESA).
        Integrarás <strong>todas las técnicas</strong> aprendidas en esta sección: regresión visual con screenshots,
        masking de contenido dinámico, auditorías de accesibilidad con axe-core, navegación por teclado,
        validación de headers de seguridad, auditoría de cookies y detección de contenido mixto HTTPS.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🎯 Objetivo del proyecto</h4>
            <p>Crear una suite de testing completa con <strong>tres pilares de calidad</strong>: regresión visual
            (consistencia de UI), accesibilidad (inclusión WCAG 2.1 AA) y seguridad (headers, cookies, HTTPS).
            El proyecto incluye <strong>helpers reutilizables</strong>, fixtures centralizados, generación de reportes
            combinados y configuración lista para CI/CD con pytest markers.</p>
        </div>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🏢 Contexto SIESA</h4>
            <p>En SIESA, los equipos de QA deben validar que cada release de los módulos web de HCM y ERP
            mantenga <strong>consistencia visual</strong> (que las pantallas no cambien inesperadamente),
            <strong>accesibilidad</strong> (cumplimiento normativo y buenas prácticas) y <strong>seguridad</strong>
            (headers correctos, cookies seguras, sin contenido mixto). Este proyecto simula exactamente ese
            escenario de auditoría multi-dimensional que se ejecuta en cada sprint.</p>
        </div>

        <h3>🗂️ Paso 1: Estructura del proyecto</h3>
        <pre><code class="bash"># Crear la estructura completa del proyecto
mkdir -p suite_quality_audit/helpers
mkdir -p suite_quality_audit/pages
mkdir -p suite_quality_audit/tests
mkdir -p suite_quality_audit/baselines/screenshots
mkdir -p suite_quality_audit/reports/visual
mkdir -p suite_quality_audit/reports/a11y
mkdir -p suite_quality_audit/reports/security
mkdir -p suite_quality_audit/test-results

# Crear archivos base
touch suite_quality_audit/pytest.ini
touch suite_quality_audit/requirements.txt
touch suite_quality_audit/helpers/__init__.py
touch suite_quality_audit/helpers/visual_checker.py
touch suite_quality_audit/helpers/a11y_auditor.py
touch suite_quality_audit/helpers/security_checker.py
touch suite_quality_audit/helpers/report_generator.py
touch suite_quality_audit/pages/__init__.py
touch suite_quality_audit/pages/login_page.py
touch suite_quality_audit/pages/dashboard_page.py
touch suite_quality_audit/pages/reports_page.py
touch suite_quality_audit/pages/forms_page.py
touch suite_quality_audit/tests/__init__.py
touch suite_quality_audit/tests/conftest.py
touch suite_quality_audit/tests/test_visual_regression.py
touch suite_quality_audit/tests/test_accessibility.py
touch suite_quality_audit/tests/test_security.py</code></pre>

        <pre><code>suite_quality_audit/
├── pytest.ini                              # Config pytest con markers
├── requirements.txt                        # Dependencias del proyecto
├── helpers/
│   ├── __init__.py
│   ├── visual_checker.py                   # Clase VisualChecker
│   ├── a11y_auditor.py                     # Clase A11yAuditor
│   ├── security_checker.py                 # Clase SecurityChecker
│   └── report_generator.py                 # Generador de reporte combinado
├── pages/
│   ├── __init__.py
│   ├── login_page.py                       # Page Object: login
│   ├── dashboard_page.py                   # Page Object: dashboard
│   ├── reports_page.py                     # Page Object: reportes
│   └── forms_page.py                       # Page Object: formularios
├── tests/
│   ├── __init__.py
│   ├── conftest.py                         # Fixtures para visual, a11y, security
│   ├── test_visual_regression.py           # Tests de regresión visual
│   ├── test_accessibility.py               # Tests de accesibilidad
│   └── test_security.py                    # Tests de seguridad
├── baselines/
│   └── screenshots/                        # Screenshots de referencia
├── reports/
│   ├── visual/                             # Diffs visuales
│   ├── a11y/                               # Reportes de accesibilidad
│   └── security/                           # Reportes de seguridad
└── test-results/                           # Artefactos de ejecución</code></pre>

        <h3>📦 Paso 2: Dependencias del proyecto</h3>
        <pre><code class="python"># requirements.txt
playwright>=1.40.0
pytest>=7.4.0
pytest-playwright>=0.4.3
pytest-html>=4.0.0
axe-playwright-python>=0.1.3
Pillow>=10.0.0          # Para comparación de imágenes y generación de diffs
Jinja2>=3.1.0           # Para generar reportes HTML combinados
requests>=2.31.0        # Para validar headers HTTP directamente</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Consejo</h4>
            <p>Aunque Playwright tiene comparación visual nativa con <code>expect(page).to_have_screenshot()</code>,
            en este proyecto también implementamos una clase <code>VisualChecker</code> personalizada que ofrece
            mayor control sobre masking, umbrales por región y generación de reportes detallados. Esto es
            especialmente útil en entornos corporativos donde se necesita flexibilidad adicional.</p>
        </div>

        <h3>⚙️ Paso 3: Configuración de pytest</h3>
        <pre><code class="ini"># pytest.ini
[pytest]
markers =
    visual: Tests de regresión visual
    a11y: Tests de accesibilidad
    security: Tests de seguridad
    smoke: Subset rápido para CI
    full_audit: Auditoría completa

addopts =
    --html=reports/test-report.html
    --self-contained-html
    -v

testpaths = tests
filterwarnings =
    ignore::DeprecationWarning</code></pre>

        <h3>🏗️ Paso 4: Page Objects del portal corporativo</h3>
        <p>Definimos Page Objects para las cuatro páginas principales del portal que auditaremos.</p>

        <div class="code-tabs" data-code-id="L104-1">
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
"""Page Object para la página de login del portal corporativo."""
from playwright.sync_api import Page, expect


class LoginPage:
    URL = "https://portal-corporativo.example.com/login"

    def __init__(self, page: Page):
        self.page = page
        # Localizadores principales
        self.logo = page.get_by_role("img", name="Logo corporativo")
        self.username_input = page.get_by_label("Usuario")
        self.password_input = page.get_by_label("Contraseña")
        self.login_button = page.get_by_role("button", name="Iniciar sesión")
        self.forgot_password_link = page.get_by_role("link", name="¿Olvidó su contraseña?")
        self.error_message = page.locator("[data-testid='login-error']")
        self.remember_checkbox = page.get_by_label("Recordarme")

    def navigate(self):
        self.page.goto(self.URL)
        self.page.wait_for_load_state("networkidle")

    def login(self, username: str, password: str):
        self.username_input.fill(username)
        self.password_input.fill(password)
        self.login_button.click()

    def get_dynamic_elements_for_masking(self) -> list:
        """Retorna localizadores de elementos dinámicos para masking visual."""
        return [
            self.page.locator("[data-testid='current-time']"),
            self.page.locator("[data-testid='session-id']"),
        ]</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// pages/login-page.ts
import { type Page, type Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly URL = 'https://portal-corporativo.example.com/login';

    readonly page: Page;
    // Localizadores principales
    readonly logo: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly forgotPasswordLink: Locator;
    readonly errorMessage: Locator;
    readonly rememberCheckbox: Locator;

    constructor(page: Page) {
        this.page = page;
        this.logo = page.getByRole('img', { name: 'Logo corporativo' });
        this.usernameInput = page.getByLabel('Usuario');
        this.passwordInput = page.getByLabel('Contraseña');
        this.loginButton = page.getByRole('button', { name: 'Iniciar sesión' });
        this.forgotPasswordLink = page.getByRole('link', { name: '¿Olvidó su contraseña?' });
        this.errorMessage = page.locator('[data-testid="login-error"]');
        this.rememberCheckbox = page.getByLabel('Recordarme');
    }

    async navigate() {
        await this.page.goto(this.URL);
        await this.page.waitForLoadState('networkidle');
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    getDynamicElementsForMasking(): Locator[] {
        return [
            this.page.locator('[data-testid="current-time"]'),
            this.page.locator('[data-testid="session-id"]'),
        ];
    }
}</code></pre>
        </div>
        </div>

        <div class="code-tabs" data-code-id="L104-2">
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
            <pre><code class="language-python"># pages/dashboard_page.py
"""Page Object para el dashboard principal."""
from playwright.sync_api import Page, expect


class DashboardPage:
    URL = "https://portal-corporativo.example.com/dashboard"

    def __init__(self, page: Page):
        self.page = page
        # Navegación principal
        self.nav_menu = page.get_by_role("navigation", name="Menú principal")
        self.sidebar = page.locator("[data-testid='sidebar']")
        # Widgets del dashboard
        self.welcome_banner = page.locator("[data-testid='welcome-banner']")
        self.kpi_cards = page.locator("[data-testid='kpi-card']")
        self.recent_activity = page.locator("[data-testid='recent-activity']")
        self.notifications_badge = page.locator("[data-testid='notifications-badge']")
        self.user_avatar = page.locator("[data-testid='user-avatar']")
        self.chart_container = page.locator("[data-testid='chart-container']")

    def navigate(self):
        self.page.goto(self.URL)
        self.page.wait_for_load_state("networkidle")

    def get_dynamic_elements_for_masking(self) -> list:
        """Elementos que cambian entre ejecuciones y deben enmascararse."""
        return [
            self.notifications_badge,
            self.user_avatar,
            self.recent_activity,
            self.page.locator("[data-testid='timestamp']"),
            self.chart_container,  # Datos de gráficos cambian
        ]

    def get_keyboard_navigation_flow(self) -> list:
        """Define el flujo esperado de navegación por teclado."""
        return [
            {"element": "Menú principal", "key": "Tab", "role": "navigation"},
            {"element": "Inicio", "key": "Tab", "role": "link"},
            {"element": "Reportes", "key": "Tab", "role": "link"},
            {"element": "Formularios", "key": "Tab", "role": "link"},
            {"element": "Configuración", "key": "Tab", "role": "link"},
        ]</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// pages/dashboard-page.ts
import { type Page, type Locator, expect } from '@playwright/test';

export class DashboardPage {
    readonly URL = 'https://portal-corporativo.example.com/dashboard';

    readonly page: Page;
    // Navegación principal
    readonly navMenu: Locator;
    readonly sidebar: Locator;
    // Widgets del dashboard
    readonly welcomeBanner: Locator;
    readonly kpiCards: Locator;
    readonly recentActivity: Locator;
    readonly notificationsBadge: Locator;
    readonly userAvatar: Locator;
    readonly chartContainer: Locator;

    constructor(page: Page) {
        this.page = page;
        this.navMenu = page.getByRole('navigation', { name: 'Menú principal' });
        this.sidebar = page.locator('[data-testid="sidebar"]');
        this.welcomeBanner = page.locator('[data-testid="welcome-banner"]');
        this.kpiCards = page.locator('[data-testid="kpi-card"]');
        this.recentActivity = page.locator('[data-testid="recent-activity"]');
        this.notificationsBadge = page.locator('[data-testid="notifications-badge"]');
        this.userAvatar = page.locator('[data-testid="user-avatar"]');
        this.chartContainer = page.locator('[data-testid="chart-container"]');
    }

    async navigate() {
        await this.page.goto(this.URL);
        await this.page.waitForLoadState('networkidle');
    }

    getDynamicElementsForMasking(): Locator[] {
        return [
            this.notificationsBadge,
            this.userAvatar,
            this.recentActivity,
            this.page.locator('[data-testid="timestamp"]'),
            this.chartContainer, // Datos de gráficos cambian
        ];
    }

    getKeyboardNavigationFlow() {
        return [
            { element: 'Menú principal', key: 'Tab', role: 'navigation' },
            { element: 'Inicio', key: 'Tab', role: 'link' },
            { element: 'Reportes', key: 'Tab', role: 'link' },
            { element: 'Formularios', key: 'Tab', role: 'link' },
            { element: 'Configuración', key: 'Tab', role: 'link' },
        ];
    }
}</code></pre>
        </div>
        </div>

        <div class="code-tabs" data-code-id="L104-3">
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
            <pre><code class="language-python"># pages/reports_page.py
"""Page Object para la página de reportes."""
from playwright.sync_api import Page


class ReportsPage:
    URL = "https://portal-corporativo.example.com/reports"

    def __init__(self, page: Page):
        self.page = page
        self.report_list = page.locator("[data-testid='report-list']")
        self.filter_panel = page.locator("[data-testid='filter-panel']")
        self.date_picker = page.get_by_label("Fecha de reporte")
        self.export_button = page.get_by_role("button", name="Exportar")
        self.data_table = page.get_by_role("table", name="Datos del reporte")

    def navigate(self):
        self.page.goto(self.URL)
        self.page.wait_for_load_state("networkidle")

    def get_dynamic_elements_for_masking(self) -> list:
        return [
            self.page.locator("[data-testid='report-timestamp']"),
            self.page.locator("[data-testid='generated-by']"),
        ]</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// pages/reports-page.ts
import { type Page, type Locator } from '@playwright/test';

export class ReportsPage {
    readonly URL = 'https://portal-corporativo.example.com/reports';

    readonly page: Page;
    readonly reportList: Locator;
    readonly filterPanel: Locator;
    readonly datePicker: Locator;
    readonly exportButton: Locator;
    readonly dataTable: Locator;

    constructor(page: Page) {
        this.page = page;
        this.reportList = page.locator('[data-testid="report-list"]');
        this.filterPanel = page.locator('[data-testid="filter-panel"]');
        this.datePicker = page.getByLabel('Fecha de reporte');
        this.exportButton = page.getByRole('button', { name: 'Exportar' });
        this.dataTable = page.getByRole('table', { name: 'Datos del reporte' });
    }

    async navigate() {
        await this.page.goto(this.URL);
        await this.page.waitForLoadState('networkidle');
    }

    getDynamicElementsForMasking(): Locator[] {
        return [
            this.page.locator('[data-testid="report-timestamp"]'),
            this.page.locator('[data-testid="generated-by"]'),
        ];
    }
}</code></pre>
        </div>
        </div>

        <div class="code-tabs" data-code-id="L104-4">
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
            <pre><code class="language-python"># pages/forms_page.py
"""Page Object para la página de formularios."""
from playwright.sync_api import Page


class FormsPage:
    URL = "https://portal-corporativo.example.com/forms"

    def __init__(self, page: Page):
        self.page = page
        self.form_container = page.locator("[data-testid='form-container']")
        self.name_input = page.get_by_label("Nombre completo")
        self.email_input = page.get_by_label("Correo electrónico")
        self.department_select = page.get_by_label("Departamento")
        self.submit_button = page.get_by_role("button", name="Enviar")
        self.cancel_button = page.get_by_role("button", name="Cancelar")
        self.success_message = page.locator("[data-testid='success-msg']")
        self.error_summary = page.locator("[data-testid='error-summary']")

    def navigate(self):
        self.page.goto(self.URL)
        self.page.wait_for_load_state("networkidle")

    def get_dynamic_elements_for_masking(self) -> list:
        return [
            self.page.locator("[data-testid='form-timestamp']"),
            self.page.locator("[data-testid='csrf-token']"),
        ]</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// pages/forms-page.ts
import { type Page, type Locator } from '@playwright/test';

export class FormsPage {
    readonly URL = 'https://portal-corporativo.example.com/forms';

    readonly page: Page;
    readonly formContainer: Locator;
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly departmentSelect: Locator;
    readonly submitButton: Locator;
    readonly cancelButton: Locator;
    readonly successMessage: Locator;
    readonly errorSummary: Locator;

    constructor(page: Page) {
        this.page = page;
        this.formContainer = page.locator('[data-testid="form-container"]');
        this.nameInput = page.getByLabel('Nombre completo');
        this.emailInput = page.getByLabel('Correo electrónico');
        this.departmentSelect = page.getByLabel('Departamento');
        this.submitButton = page.getByRole('button', { name: 'Enviar' });
        this.cancelButton = page.getByRole('button', { name: 'Cancelar' });
        this.successMessage = page.locator('[data-testid="success-msg"]');
        this.errorSummary = page.locator('[data-testid="error-summary"]');
    }

    async navigate() {
        await this.page.goto(this.URL);
        await this.page.waitForLoadState('networkidle');
    }

    getDynamicElementsForMasking(): Locator[] {
        return [
            this.page.locator('[data-testid="form-timestamp"]'),
            this.page.locator('[data-testid="csrf-token"]'),
        ];
    }
}</code></pre>
        </div>
        </div>

        <h3>🎨 Paso 5: Helper — VisualChecker</h3>
        <p>Clase reutilizable para regresión visual con soporte de masking, umbrales configurables
        y generación de imágenes de diferencia.</p>

        <div class="code-tabs" data-code-id="L104-5">
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
            <pre><code class="language-python"># helpers/visual_checker.py
"""
VisualChecker — Clase helper para regresión visual avanzada.
Complementa la comparación nativa de Playwright con funcionalidades
adicionales: masking por regiones, umbrales por zona y diffs visuales.
"""
import os
from pathlib import Path
from typing import Optional
from dataclasses import dataclass, field
from playwright.sync_api import Page, Locator

try:
    from PIL import Image, ImageChops, ImageDraw
    HAS_PILLOW = True
except ImportError:
    HAS_PILLOW = False


@dataclass
class VisualResult:
    """Resultado de una comparación visual."""
    page_name: str
    passed: bool
    diff_percentage: float = 0.0
    baseline_path: str = ""
    actual_path: str = ""
    diff_path: str = ""
    masked_regions: list = field(default_factory=list)
    error: Optional[str] = None


class VisualChecker:
    """
    Checker de regresión visual con masking y reportes detallados.

    Uso:
        checker = VisualChecker(page, baselines_dir="baselines/screenshots")
        result = checker.compare("login", mask_locators=[page.locator(".timestamp")])
    """

    DEFAULT_THRESHOLD = 0.1  # 0.1% de diferencia permitida
    DEFAULT_MAX_DIFF_PIXELS = 100  # Máximo de píxeles diferentes

    def __init__(
        self,
        page: Page,
        baselines_dir: str = "baselines/screenshots",
        output_dir: str = "reports/visual",
        threshold: float = DEFAULT_THRESHOLD,
        max_diff_pixels: int = DEFAULT_MAX_DIFF_PIXELS,
    ):
        self.page = page
        self.baselines_dir = Path(baselines_dir)
        self.output_dir = Path(output_dir)
        self.threshold = threshold
        self.max_diff_pixels = max_diff_pixels
        self.results: list[VisualResult] = []

        # Crear directorios si no existen
        self.baselines_dir.mkdir(parents=True, exist_ok=True)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def compare(
        self,
        name: str,
        mask_locators: Optional[list[Locator]] = None,
        threshold: Optional[float] = None,
        full_page: bool = True,
        animations: str = "disabled",
    ) -> VisualResult:
        """
        Compara un screenshot actual con el baseline.

        Args:
            name: Nombre identificador de la página/vista
            mask_locators: Lista de localizadores a enmascarar
            threshold: Umbral de diferencia (override del default)
            full_page: Capturar página completa
            animations: "disabled" para detener animaciones CSS
        """
        current_threshold = threshold or self.threshold

        # Construir opciones de masking para Playwright nativo
        mask = mask_locators or []

        baseline_path = self.baselines_dir / f"{name}.png"
        actual_path = self.output_dir / f"{name}-actual.png"
        diff_path = self.output_dir / f"{name}-diff.png"

        try:
            # Capturar screenshot actual con masking nativo
            self.page.screenshot(
                path=str(actual_path),
                full_page=full_page,
                animations=animations,
                mask=mask,
                mask_color="#FF00FF",  # Magenta para regiones enmascaradas
            )

            # Si no existe baseline, crear uno y marcar como "nuevo"
            if not baseline_path.exists():
                self.page.screenshot(
                    path=str(baseline_path),
                    full_page=full_page,
                    animations=animations,
                    mask=mask,
                    mask_color="#FF00FF",
                )
                result = VisualResult(
                    page_name=name,
                    passed=True,
                    diff_percentage=0.0,
                    baseline_path=str(baseline_path),
                    actual_path=str(actual_path),
                    masked_regions=[str(m) for m in mask],
                    error="BASELINE_CREATED — Primera ejecución, baseline generado",
                )
                self.results.append(result)
                return result

            # Comparar con Pillow si está disponible
            if HAS_PILLOW:
                diff_pct = self._compare_with_pillow(
                    baseline_path, actual_path, diff_path
                )
            else:
                # Fallback: usar comparación nativa de Playwright
                diff_pct = self._compare_native(name, mask, full_page)

            passed = diff_pct <= current_threshold
            result = VisualResult(
                page_name=name,
                passed=passed,
                diff_percentage=diff_pct,
                baseline_path=str(baseline_path),
                actual_path=str(actual_path),
                diff_path=str(diff_path) if diff_path.exists() else "",
                masked_regions=[str(m) for m in mask],
            )

        except Exception as e:
            result = VisualResult(
                page_name=name,
                passed=False,
                error=str(e),
            )

        self.results.append(result)
        return result

    def _compare_with_pillow(
        self, baseline_path: Path, actual_path: Path, diff_path: Path
    ) -> float:
        """Compara dos imágenes usando Pillow y genera imagen de diferencia."""
        baseline_img = Image.open(baseline_path)
        actual_img = Image.open(actual_path)

        # Redimensionar si las resoluciones difieren
        if baseline_img.size != actual_img.size:
            actual_img = actual_img.resize(baseline_img.size, Image.LANCZOS)

        # Calcular diferencia
        diff_img = ImageChops.difference(baseline_img, actual_img)
        diff_pixels = sum(
            1 for pixel in diff_img.getdata()
            if any(channel > 10 for channel in pixel[:3])
        )
        total_pixels = baseline_img.size[0] * baseline_img.size[1]
        diff_percentage = (diff_pixels / total_pixels) * 100

        # Generar imagen de diff con resaltado
        if diff_percentage > 0:
            highlighted = actual_img.copy()
            draw = ImageDraw.Draw(highlighted)
            for x in range(diff_img.size[0]):
                for y in range(diff_img.size[1]):
                    pixel = diff_img.getpixel((x, y))
                    if any(channel > 10 for channel in pixel[:3]):
                        draw.point((x, y), fill=(255, 0, 0, 128))
            highlighted.save(diff_path)

        return round(diff_percentage, 4)

    def _compare_native(
        self, name: str, mask: list, full_page: bool
    ) -> float:
        """Fallback usando expect(page).to_have_screenshot() de Playwright."""
        try:
            from playwright.sync_api import expect
            expect(self.page).to_have_screenshot(
                name=f"{name}.png",
                full_page=full_page,
                mask=mask,
                max_diff_pixel_ratio=self.threshold / 100,
            )
            return 0.0
        except AssertionError:
            return self.threshold + 1  # Marcar como fallido

    def update_baseline(self, name: str, mask_locators: list = None):
        """Actualiza el baseline para una página específica."""
        baseline_path = self.baselines_dir / f"{name}.png"
        self.page.screenshot(
            path=str(baseline_path),
            full_page=True,
            animations="disabled",
            mask=mask_locators or [],
            mask_color="#FF00FF",
        )
        return str(baseline_path)

    def get_summary(self) -> dict:
        """Retorna resumen de todas las comparaciones realizadas."""
        total = len(self.results)
        passed = sum(1 for r in self.results if r.passed)
        failed = sum(1 for r in self.results if not r.passed)
        return {
            "total": total,
            "passed": passed,
            "failed": failed,
            "pass_rate": f"{(passed / total * 100):.1f}%" if total > 0 else "N/A",
            "results": self.results,
        }
</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// helpers/visual-checker.ts
/**
 * VisualChecker — Clase helper para regresión visual avanzada.
 * Complementa la comparación nativa de Playwright con funcionalidades
 * adicionales: masking por regiones, umbrales por zona y diffs visuales.
 */
import * as fs from 'fs';
import * as path from 'path';
import { type Page, type Locator, expect } from '@playwright/test';

// Nota: Para comparación con Pillow equivalente, usar 'pixelmatch' o 'sharp'
// npm install pixelmatch pngjs
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

interface VisualResult {
    pageName: string;
    passed: boolean;
    diffPercentage: number;
    baselinePath: string;
    actualPath: string;
    diffPath: string;
    maskedRegions: string[];
    error?: string;
}

export class VisualChecker {
    static readonly DEFAULT_THRESHOLD = 0.1;
    static readonly DEFAULT_MAX_DIFF_PIXELS = 100;

    private page: Page;
    private baselinesDir: string;
    private outputDir: string;
    readonly threshold: number;
    private maxDiffPixels: number;
    readonly results: VisualResult[] = [];

    constructor(
        page: Page,
        options: {
            baselinesDir?: string;
            outputDir?: string;
            threshold?: number;
            maxDiffPixels?: number;
        } = {}
    ) {
        this.page = page;
        this.baselinesDir = options.baselinesDir ?? 'baselines/screenshots';
        this.outputDir = options.outputDir ?? 'reports/visual';
        this.threshold = options.threshold ?? VisualChecker.DEFAULT_THRESHOLD;
        this.maxDiffPixels = options.maxDiffPixels ?? VisualChecker.DEFAULT_MAX_DIFF_PIXELS;

        // Crear directorios si no existen
        fs.mkdirSync(this.baselinesDir, { recursive: true });
        fs.mkdirSync(this.outputDir, { recursive: true });
    }

    async compare(
        name: string,
        options: {
            maskLocators?: Locator[];
            threshold?: number;
            fullPage?: boolean;
            animations?: 'disabled' | 'allow';
        } = {}
    ): Promise&lt;VisualResult&gt; {
        const currentThreshold = options.threshold ?? this.threshold;
        const mask = options.maskLocators ?? [];
        const fullPage = options.fullPage ?? true;
        const animations = options.animations ?? 'disabled';

        const baselinePath = path.join(this.baselinesDir, \`\${name}.png\`);
        const actualPath = path.join(this.outputDir, \`\${name}-actual.png\`);
        const diffPath = path.join(this.outputDir, \`\${name}-diff.png\`);

        try {
            // Capturar screenshot actual con masking nativo
            await this.page.screenshot({
                path: actualPath,
                fullPage,
                animations,
                mask,
                maskColor: '#FF00FF', // Magenta para regiones enmascaradas
            });

            // Si no existe baseline, crear uno y marcar como "nuevo"
            if (!fs.existsSync(baselinePath)) {
                await this.page.screenshot({
                    path: baselinePath,
                    fullPage,
                    animations,
                    mask,
                    maskColor: '#FF00FF',
                });
                const result: VisualResult = {
                    pageName: name,
                    passed: true,
                    diffPercentage: 0,
                    baselinePath,
                    actualPath,
                    diffPath: '',
                    maskedRegions: mask.map(String),
                    error: 'BASELINE_CREATED — Primera ejecución, baseline generado',
                };
                this.results.push(result);
                return result;
            }

            // Comparar con pixelmatch
            const diffPct = this.compareWithPixelmatch(
                baselinePath, actualPath, diffPath
            );

            const passed = diffPct &lt;= currentThreshold;
            const result: VisualResult = {
                pageName: name,
                passed,
                diffPercentage: diffPct,
                baselinePath,
                actualPath,
                diffPath: fs.existsSync(diffPath) ? diffPath : '',
                maskedRegions: mask.map(String),
            };
            this.results.push(result);
            return result;

        } catch (e) {
            const result: VisualResult = {
                pageName: name,
                passed: false,
                diffPercentage: 0,
                baselinePath: '',
                actualPath: '',
                diffPath: '',
                maskedRegions: [],
                error: String(e),
            };
            this.results.push(result);
            return result;
        }
    }

    private compareWithPixelmatch(
        baselinePath: string, actualPath: string, diffPath: string
    ): number {
        const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
        const actual = PNG.sync.read(fs.readFileSync(actualPath));
        const { width, height } = baseline;
        const diff = new PNG({ width, height });

        const diffPixels = pixelmatch(
            baseline.data, actual.data, diff.data, width, height,
            { threshold: 0.1 }
        );
        fs.writeFileSync(diffPath, PNG.sync.write(diff));

        const totalPixels = width * height;
        return Math.round(((diffPixels / totalPixels) * 100) * 10000) / 10000;
    }

    async updateBaseline(name: string, maskLocators: Locator[] = []) {
        const baselinePath = path.join(this.baselinesDir, \`\${name}.png\`);
        await this.page.screenshot({
            path: baselinePath,
            fullPage: true,
            animations: 'disabled',
            mask: maskLocators,
            maskColor: '#FF00FF',
        });
        return baselinePath;
    }

    getSummary() {
        const total = this.results.length;
        const passed = this.results.filter(r => r.passed).length;
        const failed = this.results.filter(r => !r.passed).length;
        return {
            total,
            passed,
            failed,
            passRate: total > 0
                ? \`\${((passed / total) * 100).toFixed(1)}%\`
                : 'N/A',
            results: this.results,
        };
    }
}</code></pre>
        </div>
        </div>

        <h3>♿ Paso 6: Helper — A11yAuditor</h3>
        <p>Clase para auditorías de accesibilidad con axe-core, verificación WCAG 2.1 AA y
        pruebas de navegación por teclado.</p>

        <div class="code-tabs" data-code-id="L104-6">
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
            <pre><code class="language-python"># helpers/a11y_auditor.py
"""
A11yAuditor — Clase helper para auditorías de accesibilidad.
Integra axe-core vía axe-playwright-python y pruebas de navegación por teclado.
"""
import json
from pathlib import Path
from dataclasses import dataclass, field
from typing import Optional
from playwright.sync_api import Page, expect


@dataclass
class A11yViolation:
    """Representa una violación de accesibilidad individual."""
    rule_id: str
    description: str
    impact: str  # "critical", "serious", "moderate", "minor"
    help_url: str
    affected_nodes: int
    wcag_tags: list = field(default_factory=list)
    html_snippet: str = ""


@dataclass
class A11yResult:
    """Resultado de una auditoría de accesibilidad."""
    page_name: str
    url: str
    passed: bool
    total_violations: int = 0
    critical_count: int = 0
    serious_count: int = 0
    moderate_count: int = 0
    minor_count: int = 0
    violations: list = field(default_factory=list)
    keyboard_issues: list = field(default_factory=list)
    wcag_level: str = "AA"
    error: Optional[str] = None


class A11yAuditor:
    """
    Auditor de accesibilidad con axe-core y pruebas de teclado.

    Uso:
        auditor = A11yAuditor(page, wcag_level="AA")
        result = auditor.audit("login")
        keyboard_result = auditor.test_keyboard_navigation(navigation_flow)
    """

    # Tags de axe-core para cada nivel WCAG
    WCAG_TAGS = {
        "A": ["wcag2a", "wcag21a"],
        "AA": ["wcag2a", "wcag21a", "wcag2aa", "wcag21aa"],
        "AAA": ["wcag2a", "wcag21a", "wcag2aa", "wcag21aa", "wcag2aaa", "wcag21aaa"],
    }

    # Violaciones que nunca deben pasar en un portal corporativo
    CRITICAL_RULES = [
        "color-contrast",
        "image-alt",
        "label",
        "link-name",
        "button-name",
        "document-title",
        "html-has-lang",
        "bypass",
        "aria-required-attr",
    ]

    def __init__(
        self,
        page: Page,
        output_dir: str = "reports/a11y",
        wcag_level: str = "AA",
        fail_on_impact: str = "serious",
    ):
        self.page = page
        self.output_dir = Path(output_dir)
        self.wcag_level = wcag_level
        self.fail_on_impact = fail_on_impact
        self.results: list[A11yResult] = []

        self.output_dir.mkdir(parents=True, exist_ok=True)

        # Mapa de severidad para comparaciones
        self._impact_severity = {
            "minor": 1, "moderate": 2, "serious": 3, "critical": 4
        }
        self._fail_threshold = self._impact_severity.get(fail_on_impact, 3)

    def audit(self, page_name: str) -> A11yResult:
        """
        Ejecuta auditoría axe-core en la página actual.

        Args:
            page_name: Nombre descriptivo de la página para el reporte
        """
        try:
            from axe_playwright_python.sync_playwright import Axe

            axe = Axe()
            axe_results = axe.run(self.page)

            # Procesar violaciones
            violations = []
            impact_counts = {"critical": 0, "serious": 0, "moderate": 0, "minor": 0}

            for violation in axe_results.response.get("violations", []):
                impact = violation.get("impact", "minor")
                impact_counts[impact] = impact_counts.get(impact, 0) + 1

                # Filtrar por tags WCAG del nivel configurado
                tags = violation.get("tags", [])
                wcag_tags = [t for t in tags if "wcag" in t]

                v = A11yViolation(
                    rule_id=violation["id"],
                    description=violation.get("description", ""),
                    impact=impact,
                    help_url=violation.get("helpUrl", ""),
                    affected_nodes=len(violation.get("nodes", [])),
                    wcag_tags=wcag_tags,
                    html_snippet=self._get_first_node_html(violation),
                )
                violations.append(v)

            # Determinar si pasa según umbral de impacto
            max_impact = max(
                (self._impact_severity.get(v.impact, 0) for v in violations),
                default=0
            )
            passed = max_impact < self._fail_threshold

            result = A11yResult(
                page_name=page_name,
                url=self.page.url,
                passed=passed,
                total_violations=len(violations),
                critical_count=impact_counts["critical"],
                serious_count=impact_counts["serious"],
                moderate_count=impact_counts["moderate"],
                minor_count=impact_counts["minor"],
                violations=violations,
                wcag_level=self.wcag_level,
            )

            # Guardar resultado JSON para reporte
            self._save_result(page_name, axe_results.response)

        except ImportError:
            result = A11yResult(
                page_name=page_name,
                url=self.page.url,
                passed=False,
                error="axe-playwright-python no está instalado. "
                      "Ejecuta: pip install axe-playwright-python",
            )
        except Exception as e:
            result = A11yResult(
                page_name=page_name,
                url=self.page.url,
                passed=False,
                error=str(e),
            )

        self.results.append(result)
        return result

    def test_keyboard_navigation(
        self, navigation_flow: list[dict], page_name: str = ""
    ) -> list[dict]:
        """
        Prueba navegación por teclado siguiendo un flujo definido.

        Args:
            navigation_flow: Lista de dicts con keys: element, key, role
                Ejemplo: [{"element": "Inicio", "key": "Tab", "role": "link"}]
            page_name: Nombre de la página para asociar resultados
        """
        keyboard_issues = []

        for i, step in enumerate(navigation_flow):
            # Presionar la tecla indicada
            key = step.get("key", "Tab")
            self.page.keyboard.press(key)

            # Verificar qué elemento tiene el foco
            focused_element = self.page.evaluate("""() => {
                const el = document.activeElement;
                return {
                    tagName: el.tagName,
                    role: el.getAttribute('role') || el.tagName.toLowerCase(),
                    text: el.textContent?.trim().substring(0, 50) || '',
                    ariaLabel: el.getAttribute('aria-label') || '',
                    tabIndex: el.tabIndex,
                    isVisible: el.offsetParent !== null,
                    outline: window.getComputedStyle(el).outline,
                };
            }""")

            expected_element = step.get("element", "")
            expected_role = step.get("role", "")

            # Verificar que el foco sea visible (focus indicator)
            if focused_element.get("outline", "").startswith("0px") or \
               focused_element.get("outline", "") == "none":
                keyboard_issues.append({
                    "step": i + 1,
                    "issue": "MISSING_FOCUS_INDICATOR",
                    "description": f"El elemento '{expected_element}' no tiene "
                                   f"indicador visual de foco (outline)",
                    "impact": "serious",
                    "wcag": "2.4.7 Focus Visible",
                    "element": focused_element,
                })

            # Verificar que el foco llegó al elemento esperado
            actual_text = focused_element.get("text", "") or \
                          focused_element.get("ariaLabel", "")
            if expected_element and expected_element.lower() not in actual_text.lower():
                keyboard_issues.append({
                    "step": i + 1,
                    "issue": "WRONG_FOCUS_ORDER",
                    "description": f"Se esperaba foco en '{expected_element}' pero "
                                   f"está en '{actual_text}'",
                    "impact": "serious",
                    "wcag": "2.4.3 Focus Order",
                    "element": focused_element,
                })

            # Verificar que el elemento enfocado sea visible
            if not focused_element.get("isVisible", True):
                keyboard_issues.append({
                    "step": i + 1,
                    "issue": "FOCUS_ON_HIDDEN_ELEMENT",
                    "description": f"El foco está en un elemento no visible",
                    "impact": "critical",
                    "wcag": "2.4.3 Focus Order",
                    "element": focused_element,
                })

        # Agregar issues de teclado al último resultado de la página
        for result in self.results:
            if result.page_name == page_name:
                result.keyboard_issues = keyboard_issues
                break

        return keyboard_issues

    def check_skip_navigation(self) -> bool:
        """Verifica que existe un enlace 'Saltar al contenido' (bypass block)."""
        skip_link = self.page.locator(
            "a[href='#main-content'], a[href='#content'], "
            "[role='link']:has-text('Saltar'), [role='link']:has-text('Skip')"
        )
        # El enlace puede estar oculto hasta recibir foco
        self.page.keyboard.press("Tab")
        return skip_link.count() > 0

    def _get_first_node_html(self, violation: dict) -> str:
        """Extrae HTML del primer nodo afectado por una violación."""
        nodes = violation.get("nodes", [])
        if nodes:
            return nodes[0].get("html", "")[:200]
        return ""

    def _save_result(self, page_name: str, axe_response: dict):
        """Guarda resultado completo de axe-core como JSON."""
        output_file = self.output_dir / f"{page_name}-axe.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(axe_response, f, indent=2, ensure_ascii=False)

    def get_summary(self) -> dict:
        """Retorna resumen de todas las auditorías realizadas."""
        total = len(self.results)
        passed = sum(1 for r in self.results if r.passed)
        total_violations = sum(r.total_violations for r in self.results)
        critical = sum(r.critical_count for r in self.results)
        serious = sum(r.serious_count for r in self.results)
        return {
            "total_pages": total,
            "passed": passed,
            "failed": total - passed,
            "total_violations": total_violations,
            "critical_violations": critical,
            "serious_violations": serious,
            "wcag_level": self.wcag_level,
            "results": self.results,
        }
</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// helpers/a11y-auditor.ts
/**
 * A11yAuditor — Clase helper para auditorías de accesibilidad.
 * Integra @axe-core/playwright y pruebas de navegación por teclado.
 */
import * as fs from 'fs';
import * as path from 'path';
import { type Page, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

interface A11yViolation {
    ruleId: string;
    description: string;
    impact: string; // "critical" | "serious" | "moderate" | "minor"
    helpUrl: string;
    affectedNodes: number;
    wcagTags: string[];
    htmlSnippet: string;
}

interface A11yResult {
    pageName: string;
    url: string;
    passed: boolean;
    totalViolations: number;
    criticalCount: number;
    seriousCount: number;
    moderateCount: number;
    minorCount: number;
    violations: A11yViolation[];
    keyboardIssues: any[];
    wcagLevel: string;
    error?: string;
}

export class A11yAuditor {
    static readonly WCAG_TAGS: Record&lt;string, string[]&gt; = {
        A: ['wcag2a', 'wcag21a'],
        AA: ['wcag2a', 'wcag21a', 'wcag2aa', 'wcag21aa'],
        AAA: ['wcag2a', 'wcag21a', 'wcag2aa', 'wcag21aa', 'wcag2aaa', 'wcag21aaa'],
    };

    static readonly CRITICAL_RULES = [
        'color-contrast', 'image-alt', 'label', 'link-name',
        'button-name', 'document-title', 'html-has-lang',
        'bypass', 'aria-required-attr',
    ];

    private page: Page;
    private outputDir: string;
    readonly wcagLevel: string;
    private failOnImpact: string;
    readonly results: A11yResult[] = [];
    private impactSeverity: Record&lt;string, number&gt; = {
        minor: 1, moderate: 2, serious: 3, critical: 4,
    };
    private failThreshold: number;

    constructor(
        page: Page,
        options: {
            outputDir?: string;
            wcagLevel?: string;
            failOnImpact?: string;
        } = {}
    ) {
        this.page = page;
        this.outputDir = options.outputDir ?? 'reports/a11y';
        this.wcagLevel = options.wcagLevel ?? 'AA';
        this.failOnImpact = options.failOnImpact ?? 'serious';
        this.failThreshold = this.impactSeverity[this.failOnImpact] ?? 3;
        fs.mkdirSync(this.outputDir, { recursive: true });
    }

    async audit(pageName: string): Promise&lt;A11yResult&gt; {
        try {
            const axeResults = await new AxeBuilder({ page: this.page })
                .withTags(A11yAuditor.WCAG_TAGS[this.wcagLevel] ?? [])
                .analyze();

            const violations: A11yViolation[] = [];
            const impactCounts = { critical: 0, serious: 0, moderate: 0, minor: 0 };

            for (const v of axeResults.violations) {
                const impact = v.impact ?? 'minor';
                impactCounts[impact] = (impactCounts[impact] ?? 0) + 1;
                const wcagTags = (v.tags ?? []).filter(t => t.includes('wcag'));

                violations.push({
                    ruleId: v.id,
                    description: v.description ?? '',
                    impact,
                    helpUrl: v.helpUrl ?? '',
                    affectedNodes: (v.nodes ?? []).length,
                    wcagTags,
                    htmlSnippet: v.nodes?.[0]?.html?.substring(0, 200) ?? '',
                });
            }

            const maxImpact = Math.max(
                ...violations.map(v => this.impactSeverity[v.impact] ?? 0), 0
            );
            const passed = maxImpact &lt; this.failThreshold;

            const result: A11yResult = {
                pageName, url: this.page.url(), passed,
                totalViolations: violations.length,
                criticalCount: impactCounts.critical,
                seriousCount: impactCounts.serious,
                moderateCount: impactCounts.moderate,
                minorCount: impactCounts.minor,
                violations, keyboardIssues: [], wcagLevel: this.wcagLevel,
            };

            // Guardar resultado JSON
            const outFile = path.join(this.outputDir, \`\${pageName}-axe.json\`);
            fs.writeFileSync(outFile, JSON.stringify(axeResults, null, 2));

            this.results.push(result);
            return result;

        } catch (e) {
            const result: A11yResult = {
                pageName, url: this.page.url(), passed: false,
                totalViolations: 0, criticalCount: 0, seriousCount: 0,
                moderateCount: 0, minorCount: 0,
                violations: [], keyboardIssues: [],
                wcagLevel: this.wcagLevel, error: String(e),
            };
            this.results.push(result);
            return result;
        }
    }

    async testKeyboardNavigation(
        navigationFlow: { element: string; key: string; role: string }[],
        pageName = ''
    ) {
        const keyboardIssues: any[] = [];

        for (let i = 0; i &lt; navigationFlow.length; i++) {
            const step = navigationFlow[i];
            await this.page.keyboard.press(step.key ?? 'Tab');

            const focusedElement = await this.page.evaluate(() => {
                const el = document.activeElement!;
                return {
                    tagName: el.tagName,
                    role: el.getAttribute('role') || el.tagName.toLowerCase(),
                    text: el.textContent?.trim().substring(0, 50) || '',
                    ariaLabel: el.getAttribute('aria-label') || '',
                    tabIndex: (el as HTMLElement).tabIndex,
                    isVisible: (el as HTMLElement).offsetParent !== null,
                    outline: window.getComputedStyle(el).outline,
                };
            });

            if (focusedElement.outline?.startsWith('0px') ||
                focusedElement.outline === 'none') {
                keyboardIssues.push({
                    step: i + 1, issue: 'MISSING_FOCUS_INDICATOR',
                    description: \`El elemento '\${step.element}' no tiene indicador visual de foco\`,
                    impact: 'serious', wcag: '2.4.7 Focus Visible',
                    element: focusedElement,
                });
            }

            const actualText = focusedElement.text || focusedElement.ariaLabel;
            if (step.element && !actualText.toLowerCase().includes(step.element.toLowerCase())) {
                keyboardIssues.push({
                    step: i + 1, issue: 'WRONG_FOCUS_ORDER',
                    description: \`Se esperaba foco en '\${step.element}' pero está en '\${actualText}'\`,
                    impact: 'serious', wcag: '2.4.3 Focus Order',
                    element: focusedElement,
                });
            }

            if (!focusedElement.isVisible) {
                keyboardIssues.push({
                    step: i + 1, issue: 'FOCUS_ON_HIDDEN_ELEMENT',
                    description: 'El foco está en un elemento no visible',
                    impact: 'critical', wcag: '2.4.3 Focus Order',
                    element: focusedElement,
                });
            }
        }

        for (const result of this.results) {
            if (result.pageName === pageName) {
                result.keyboardIssues = keyboardIssues;
                break;
            }
        }
        return keyboardIssues;
    }

    async checkSkipNavigation(): Promise&lt;boolean&gt; {
        const skipLink = this.page.locator(
            "a[href='#main-content'], a[href='#content'], " +
            "[role='link']:has-text('Saltar'), [role='link']:has-text('Skip')"
        );
        await this.page.keyboard.press('Tab');
        return await skipLink.count() > 0;
    }

    getSummary() {
        const total = this.results.length;
        const passed = this.results.filter(r => r.passed).length;
        const totalViolations = this.results.reduce((s, r) => s + r.totalViolations, 0);
        const critical = this.results.reduce((s, r) => s + r.criticalCount, 0);
        const serious = this.results.reduce((s, r) => s + r.seriousCount, 0);
        return {
            totalPages: total, passed, failed: total - passed,
            totalViolations, criticalViolations: critical,
            seriousViolations: serious, wcagLevel: this.wcagLevel,
            results: this.results,
        };
    }
}</code></pre>
        </div>
        </div>

        <h3>🔒 Paso 7: Helper — SecurityChecker</h3>
        <p>Clase para validación de headers de seguridad, auditoría de cookies y detección
        de contenido mixto HTTPS.</p>

        <pre><code class="python"># helpers/security_checker.py
"""
SecurityChecker — Clase helper para validaciones de seguridad web.
Cubre headers HTTP, cookies, HTTPS y contenido mixto.
"""
import re
from pathlib import Path
from dataclasses import dataclass, field
from typing import Optional
from playwright.sync_api import Page, Response


@dataclass
class SecurityFinding:
    """Hallazgo de seguridad individual."""
    category: str       # "header", "cookie", "https", "mixed-content"
    severity: str       # "critical", "high", "medium", "low", "info"
    title: str
    description: str
    recommendation: str
    url: str = ""
    details: dict = field(default_factory=dict)


@dataclass
class SecurityResult:
    """Resultado de auditoría de seguridad de una URL."""
    page_name: str
    url: str
    passed: bool
    findings: list = field(default_factory=list)
    headers_score: float = 0.0
    cookies_score: float = 0.0
    https_score: float = 0.0
    overall_score: float = 0.0
    error: Optional[str] = None


class SecurityChecker:
    """
    Checker de seguridad web con validación de headers, cookies y HTTPS.

    Uso:
        checker = SecurityChecker(page)
        result = checker.full_audit("login", "https://portal.example.com/login")
    """

    # Headers de seguridad esperados y su importancia
    REQUIRED_HEADERS = {
        "Strict-Transport-Security": {
            "severity": "critical",
            "expected_pattern": r"max-age=\\d+",
            "recommendation": "Agregar: Strict-Transport-Security: max-age=31536000; includeSubDomains",
        },
        "X-Content-Type-Options": {
            "severity": "high",
            "expected_value": "nosniff",
            "recommendation": "Agregar: X-Content-Type-Options: nosniff",
        },
        "X-Frame-Options": {
            "severity": "high",
            "expected_values": ["DENY", "SAMEORIGIN"],
            "recommendation": "Agregar: X-Frame-Options: DENY o SAMEORIGIN",
        },
        "Content-Security-Policy": {
            "severity": "critical",
            "expected_pattern": r".+",
            "recommendation": "Configurar Content-Security-Policy con directivas apropiadas",
        },
        "X-XSS-Protection": {
            "severity": "medium",
            "expected_value": "1; mode=block",
            "recommendation": "Agregar: X-XSS-Protection: 1; mode=block",
        },
        "Referrer-Policy": {
            "severity": "medium",
            "expected_values": [
                "no-referrer", "strict-origin",
                "strict-origin-when-cross-origin", "same-origin"
            ],
            "recommendation": "Agregar: Referrer-Policy: strict-origin-when-cross-origin",
        },
        "Permissions-Policy": {
            "severity": "medium",
            "expected_pattern": r".+",
            "recommendation": "Agregar Permissions-Policy para restringir APIs del navegador",
        },
    }

    # Headers que NO deben estar presentes (revelan información)
    FORBIDDEN_HEADERS = {
        "X-Powered-By": {
            "severity": "medium",
            "description": "Revela tecnología del servidor",
        },
        "Server": {
            "severity": "low",
            "description": "Puede revelar versión del servidor",
        },
        "X-AspNet-Version": {
            "severity": "medium",
            "description": "Revela versión de ASP.NET",
        },
    }

    def __init__(
        self,
        page: Page,
        output_dir: str = "reports/security",
        fail_on_severity: str = "high",
    ):
        self.page = page
        self.output_dir = Path(output_dir)
        self.fail_on_severity = fail_on_severity
        self.results: list[SecurityResult] = []
        self._intercepted_responses: list[dict] = []

        self.output_dir.mkdir(parents=True, exist_ok=True)

        self._severity_level = {
            "info": 0, "low": 1, "medium": 2, "high": 3, "critical": 4
        }
        self._fail_threshold = self._severity_level.get(fail_on_severity, 3)

    def full_audit(self, page_name: str, url: str) -> SecurityResult:
        """
        Ejecuta auditoría completa: headers + cookies + HTTPS + mixed content.

        Args:
            page_name: Nombre descriptivo para el reporte
            url: URL a auditar
        """
        findings = []

        # 1. Navegar y capturar la respuesta
        response = self.page.goto(url)
        self.page.wait_for_load_state("networkidle")

        if response is None:
            result = SecurityResult(
                page_name=page_name, url=url, passed=False,
                error="No se recibió respuesta del servidor",
            )
            self.results.append(result)
            return result

        # 2. Auditar headers de seguridad
        header_findings = self._check_security_headers(response, url)
        findings.extend(header_findings)

        # 3. Auditar cookies
        cookie_findings = self._check_cookies(url)
        findings.extend(cookie_findings)

        # 4. Verificar HTTPS
        https_findings = self._check_https(url)
        findings.extend(https_findings)

        # 5. Detectar contenido mixto
        mixed_findings = self._check_mixed_content()
        findings.extend(mixed_findings)

        # Calcular scores por categoría
        headers_score = self._calculate_category_score(
            findings, "header", len(self.REQUIRED_HEADERS)
        )
        cookies_score = self._calculate_category_score(findings, "cookie", 5)
        https_score = self._calculate_category_score(findings, "https", 3)
        overall_score = (headers_score + cookies_score + https_score) / 3

        # Determinar si pasa
        max_severity = max(
            (self._severity_level.get(f.severity, 0) for f in findings),
            default=0
        )
        passed = max_severity < self._fail_threshold

        result = SecurityResult(
            page_name=page_name,
            url=url,
            passed=passed,
            findings=findings,
            headers_score=round(headers_score, 1),
            cookies_score=round(cookies_score, 1),
            https_score=round(https_score, 1),
            overall_score=round(overall_score, 1),
        )
        self.results.append(result)
        return result

    def _check_security_headers(
        self, response: Response, url: str
    ) -> list[SecurityFinding]:
        """Valida presencia y configuración de headers de seguridad."""
        findings = []
        headers = response.headers

        # Verificar headers requeridos
        for header_name, config in self.REQUIRED_HEADERS.items():
            header_value = headers.get(header_name.lower(), "")

            if not header_value:
                findings.append(SecurityFinding(
                    category="header",
                    severity=config["severity"],
                    title=f"Header faltante: {header_name}",
                    description=f"El header {header_name} no está presente "
                                f"en la respuesta",
                    recommendation=config["recommendation"],
                    url=url,
                    details={"header": header_name, "status": "missing"},
                ))
            else:
                # Validar valor si hay patrón o valores esperados
                valid = True
                if "expected_value" in config:
                    valid = header_value == config["expected_value"]
                elif "expected_values" in config:
                    valid = header_value in config["expected_values"]
                elif "expected_pattern" in config:
                    valid = bool(re.match(config["expected_pattern"], header_value))

                if not valid:
                    findings.append(SecurityFinding(
                        category="header",
                        severity="medium",
                        title=f"Header mal configurado: {header_name}",
                        description=f"Valor actual: '{header_value}'",
                        recommendation=config["recommendation"],
                        url=url,
                        details={
                            "header": header_name,
                            "actual": header_value,
                            "status": "misconfigured",
                        },
                    ))

        # Verificar headers prohibidos
        for header_name, config in self.FORBIDDEN_HEADERS.items():
            header_value = headers.get(header_name.lower(), "")
            if header_value:
                findings.append(SecurityFinding(
                    category="header",
                    severity=config["severity"],
                    title=f"Header de información expuesto: {header_name}",
                    description=f"{config['description']}. Valor: '{header_value}'",
                    recommendation=f"Eliminar el header {header_name} de las respuestas",
                    url=url,
                    details={
                        "header": header_name,
                        "value": header_value,
                        "status": "exposed",
                    },
                ))

        return findings

    def _check_cookies(self, url: str) -> list[SecurityFinding]:
        """Audita la seguridad de las cookies del dominio."""
        findings = []
        cookies = self.page.context.cookies(url)

        for cookie in cookies:
            name = cookie.get("name", "unknown")

            # Verificar flag Secure
            if not cookie.get("secure", False):
                findings.append(SecurityFinding(
                    category="cookie",
                    severity="high",
                    title=f"Cookie sin flag Secure: {name}",
                    description=f"La cookie '{name}' se puede transmitir por HTTP",
                    recommendation=f"Agregar flag Secure a la cookie '{name}'",
                    url=url,
                    details={"cookie": name, "issue": "missing_secure"},
                ))

            # Verificar flag HttpOnly (para cookies de sesión)
            session_indicators = ["session", "token", "auth", "sid", "jwt"]
            is_session_cookie = any(
                ind in name.lower() for ind in session_indicators
            )
            if is_session_cookie and not cookie.get("httpOnly", False):
                findings.append(SecurityFinding(
                    category="cookie",
                    severity="critical",
                    title=f"Cookie de sesión sin HttpOnly: {name}",
                    description=f"La cookie de sesión '{name}' es accesible "
                                f"por JavaScript (vulnerable a XSS)",
                    recommendation=f"Agregar flag HttpOnly a la cookie '{name}'",
                    url=url,
                    details={"cookie": name, "issue": "missing_httponly"},
                ))

            # Verificar SameSite
            same_site = cookie.get("sameSite", "None")
            if same_site == "None" or not same_site:
                findings.append(SecurityFinding(
                    category="cookie",
                    severity="medium",
                    title=f"Cookie sin SameSite adecuado: {name}",
                    description=f"La cookie '{name}' tiene SameSite={same_site}",
                    recommendation=f"Configurar SameSite=Strict o Lax "
                                   f"para la cookie '{name}'",
                    url=url,
                    details={
                        "cookie": name,
                        "sameSite": same_site,
                        "issue": "weak_samesite",
                    },
                ))

        return findings

    def _check_https(self, url: str) -> list[SecurityFinding]:
        """Verifica la configuración HTTPS de la URL."""
        findings = []

        # Verificar que usa HTTPS
        if not url.startswith("https://"):
            findings.append(SecurityFinding(
                category="https",
                severity="critical",
                title="La página no usa HTTPS",
                description=f"La URL '{url}' usa HTTP sin cifrar",
                recommendation="Migrar a HTTPS y redirigir todo el tráfico HTTP",
                url=url,
            ))

        # Verificar redirección HTTP → HTTPS
        http_url = url.replace("https://", "http://")
        try:
            # Interceptar la respuesta para ver si redirige
            redirect_check = self.page.request.get(http_url, max_redirects=0)
            status = redirect_check.status
            location = redirect_check.headers.get("location", "")

            if status not in (301, 302, 307, 308):
                findings.append(SecurityFinding(
                    category="https",
                    severity="high",
                    title="Sin redirección HTTP a HTTPS",
                    description=f"La versión HTTP no redirige a HTTPS "
                                f"(status: {status})",
                    recommendation="Configurar redirección 301 de HTTP a HTTPS",
                    url=http_url,
                ))
            elif status != 301:
                findings.append(SecurityFinding(
                    category="https",
                    severity="low",
                    title=f"Redirección HTTP usa código {status} en vez de 301",
                    description="Se recomienda 301 (permanente) para SEO y caché",
                    recommendation="Cambiar la redirección HTTP→HTTPS a código 301",
                    url=http_url,
                ))
        except Exception:
            pass  # Si falla la verificación, no es un hallazgo

        return findings

    def _check_mixed_content(self) -> list[SecurityFinding]:
        """Detecta recursos cargados por HTTP en una página HTTPS."""
        findings = []

        # Ejecutar detección de mixed content en el navegador
        mixed_resources = self.page.evaluate("""() => {
            const resources = [];
            // Verificar imágenes
            document.querySelectorAll('img[src^="http://"]').forEach(el => {
                resources.push({type: 'img', url: el.src, tag: el.outerHTML.substring(0, 100)});
            });
            // Verificar scripts
            document.querySelectorAll('script[src^="http://"]').forEach(el => {
                resources.push({type: 'script', url: el.src, tag: el.outerHTML.substring(0, 100)});
            });
            // Verificar stylesheets
            document.querySelectorAll('link[href^="http://"]').forEach(el => {
                resources.push({type: 'stylesheet', url: el.href, tag: el.outerHTML.substring(0, 100)});
            });
            // Verificar iframes
            document.querySelectorAll('iframe[src^="http://"]').forEach(el => {
                resources.push({type: 'iframe', url: el.src, tag: el.outerHTML.substring(0, 100)});
            });
            // Verificar forms con action HTTP
            document.querySelectorAll('form[action^="http://"]').forEach(el => {
                resources.push({type: 'form', url: el.action, tag: el.outerHTML.substring(0, 100)});
            });
            return resources;
        }""")

        for resource in mixed_resources:
            severity = "critical" if resource["type"] in ("script", "form") else "high"
            findings.append(SecurityFinding(
                category="mixed-content",
                severity=severity,
                title=f"Contenido mixto: {resource['type']} cargado por HTTP",
                description=f"Recurso inseguro: {resource['url']}",
                recommendation=f"Cambiar a HTTPS: {resource['url'].replace('http://', 'https://')}",
                url=resource["url"],
                details={"resource_type": resource["type"], "html": resource["tag"]},
            ))

        return findings

    def _calculate_category_score(
        self, findings: list, category: str, max_items: int
    ) -> float:
        """Calcula score 0-100 para una categoría de seguridad."""
        category_findings = [f for f in findings if f.category == category]
        if not category_findings:
            return 100.0
        # Penalizar según severidad
        penalty = sum(
            self._severity_level.get(f.severity, 0) * 10
            for f in category_findings
        )
        return max(0.0, 100.0 - penalty)

    def get_summary(self) -> dict:
        """Retorna resumen de todas las auditorías de seguridad."""
        total = len(self.results)
        passed = sum(1 for r in self.results if r.passed)
        all_findings = [f for r in self.results for f in r.findings]
        avg_score = (
            sum(r.overall_score for r in self.results) / total
            if total > 0 else 0
        )
        return {
            "total_pages": total,
            "passed": passed,
            "failed": total - passed,
            "total_findings": len(all_findings),
            "critical_findings": sum(
                1 for f in all_findings if f.severity == "critical"
            ),
            "average_score": round(avg_score, 1),
            "results": self.results,
        }
</code></pre>

        <h3>🧪 Paso 8: conftest.py — Fixtures para los tres pilares</h3>
        <p>Fixtures centralizados que proveen instancias configuradas de cada helper y
        page objects pre-navegados.</p>

        <pre><code class="python"># tests/conftest.py
"""
Fixtures para la suite de auditoría de calidad.
Provee helpers (VisualChecker, A11yAuditor, SecurityChecker),
page objects y configuración compartida.
"""
import pytest
from playwright.sync_api import Page, BrowserContext

# Helpers
from helpers.visual_checker import VisualChecker
from helpers.a11y_auditor import A11yAuditor
from helpers.security_checker import SecurityChecker
from helpers.report_generator import ReportGenerator

# Page Objects
from pages.login_page import LoginPage
from pages.dashboard_page import DashboardPage
from pages.reports_page import ReportsPage
from pages.forms_page import FormsPage


# ============================================================
# URLs del portal corporativo
# ============================================================
PORTAL_BASE_URL = "https://portal-corporativo.example.com"
PORTAL_PAGES = {
    "login": f"{PORTAL_BASE_URL}/login",
    "dashboard": f"{PORTAL_BASE_URL}/dashboard",
    "reports": f"{PORTAL_BASE_URL}/reports",
    "forms": f"{PORTAL_BASE_URL}/forms",
}


# ============================================================
# Fixtures de configuración
# ============================================================

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    """Configura el contexto del navegador con viewport consistente."""
    return {
        **browser_context_args,
        "viewport": {"width": 1280, "height": 720},
        "locale": "es-CO",
        "timezone_id": "America/Bogota",
        "color_scheme": "light",
        "ignore_https_errors": False,  # No ignorar errores HTTPS en auditoría
    }


@pytest.fixture(scope="session")
def portal_urls():
    """URLs del portal para iterar en tests."""
    return PORTAL_PAGES


# ============================================================
# Fixtures de Page Objects
# ============================================================

@pytest.fixture
def login_page(page: Page) -> LoginPage:
    """Page Object del login, pre-navegado."""
    lp = LoginPage(page)
    lp.navigate()
    return lp


@pytest.fixture
def dashboard_page(page: Page) -> DashboardPage:
    """Page Object del dashboard, pre-navegado (requiere login)."""
    # Simular login antes de navegar al dashboard
    page.goto(f"{PORTAL_BASE_URL}/login")
    page.get_by_label("Usuario").fill("qa_auditor")
    page.get_by_label("Contraseña").fill("audit_2024!")
    page.get_by_role("button", name="Iniciar sesión").click()
    page.wait_for_url("**/dashboard**")
    dp = DashboardPage(page)
    return dp


@pytest.fixture
def reports_page(page: Page) -> ReportsPage:
    """Page Object de reportes, pre-navegado."""
    rp = ReportsPage(page)
    rp.navigate()
    return rp


@pytest.fixture
def forms_page(page: Page) -> FormsPage:
    """Page Object de formularios, pre-navegado."""
    fp = FormsPage(page)
    fp.navigate()
    return fp


# ============================================================
# Fixtures de Helpers
# ============================================================

@pytest.fixture
def visual_checker(page: Page) -> VisualChecker:
    """Instancia de VisualChecker con configuración por defecto."""
    return VisualChecker(
        page=page,
        baselines_dir="baselines/screenshots",
        output_dir="reports/visual",
        threshold=0.1,
    )


@pytest.fixture
def a11y_auditor(page: Page) -> A11yAuditor:
    """Instancia de A11yAuditor configurado para WCAG 2.1 AA."""
    return A11yAuditor(
        page=page,
        output_dir="reports/a11y",
        wcag_level="AA",
        fail_on_impact="serious",
    )


@pytest.fixture
def security_checker(page: Page) -> SecurityChecker:
    """Instancia de SecurityChecker con umbral alto."""
    return SecurityChecker(
        page=page,
        output_dir="reports/security",
        fail_on_severity="high",
    )


# ============================================================
# Fixture de reporte combinado (scope=session)
# ============================================================

@pytest.fixture(scope="session")
def report_generator():
    """Generador de reporte HTML combinado."""
    return ReportGenerator(output_dir="reports")


# ============================================================
# Hook de pytest: generar reporte al finalizar
# ============================================================

def pytest_sessionfinish(session, exitstatus):
    """Genera reporte combinado al finalizar la sesión de tests."""
    generator = ReportGenerator(output_dir="reports")
    generator.generate_combined_report()
    print(f"\\n📊 Reporte combinado generado en: reports/combined-report.html")
</code></pre>

        <h3>📸 Paso 9: Tests de regresión visual</h3>
        <p>Suite de tests que valida la consistencia visual de todas las páginas clave,
        con masking de contenido dinámico.</p>

        <pre><code class="python"># tests/test_visual_regression.py
"""
Tests de regresión visual para el portal corporativo.
Compara screenshots actuales contra baselines establecidos,
enmascarando contenido dinámico (timestamps, avatares, badges).
"""
import pytest
from playwright.sync_api import Page, expect

from pages.login_page import LoginPage
from pages.dashboard_page import DashboardPage
from pages.reports_page import ReportsPage
from pages.forms_page import FormsPage
from helpers.visual_checker import VisualChecker


@pytest.mark.visual
class TestVisualLogin:
    """Regresión visual de la página de login."""

    def test_login_page_visual(self, login_page: LoginPage,
                                visual_checker: VisualChecker):
        """Verifica que la página de login no cambió visualmente."""
        mask = login_page.get_dynamic_elements_for_masking()
        result = visual_checker.compare("login-page", mask_locators=mask)
        assert result.passed, (
            f"Regresión visual en login: {result.diff_percentage:.2f}% "
            f"de diferencia (umbral: {visual_checker.threshold}%)"
        )

    def test_login_error_state_visual(self, login_page: LoginPage,
                                       visual_checker: VisualChecker):
        """Verifica el estado visual del login con error."""
        login_page.login("usuario_invalido", "password_invalida")
        login_page.page.wait_for_selector("[data-testid='login-error']")
        mask = login_page.get_dynamic_elements_for_masking()
        result = visual_checker.compare("login-error-state", mask_locators=mask)
        assert result.passed, (
            f"Regresión visual en login (error): {result.diff_percentage:.2f}%"
        )

    def test_login_responsive_mobile(self, page: Page,
                                      visual_checker: VisualChecker):
        """Verifica el login en viewport móvil."""
        page.set_viewport_size({"width": 375, "height": 812})
        lp = LoginPage(page)
        lp.navigate()
        mask = lp.get_dynamic_elements_for_masking()
        result = visual_checker.compare("login-mobile", mask_locators=mask)
        assert result.passed


@pytest.mark.visual
class TestVisualDashboard:
    """Regresión visual del dashboard principal."""

    def test_dashboard_visual(self, dashboard_page: DashboardPage,
                               visual_checker: VisualChecker):
        """Verifica el dashboard completo con masking extensivo."""
        mask = dashboard_page.get_dynamic_elements_for_masking()
        result = visual_checker.compare(
            "dashboard-main",
            mask_locators=mask,
            threshold=0.2,  # Umbral más tolerante por widgets dinámicos
        )
        assert result.passed, (
            f"Regresión visual en dashboard: {result.diff_percentage:.2f}%"
        )

    def test_dashboard_sidebar_collapsed(self, dashboard_page: DashboardPage,
                                          visual_checker: VisualChecker):
        """Verifica el dashboard con sidebar colapsado."""
        dashboard_page.page.click("[data-testid='toggle-sidebar']")
        dashboard_page.page.wait_for_timeout(300)  # Esperar animación
        mask = dashboard_page.get_dynamic_elements_for_masking()
        result = visual_checker.compare("dashboard-collapsed", mask_locators=mask)
        assert result.passed


@pytest.mark.visual
class TestVisualReports:
    """Regresión visual de la página de reportes."""

    def test_reports_page_visual(self, reports_page: ReportsPage,
                                  visual_checker: VisualChecker):
        """Verifica la página de reportes."""
        mask = reports_page.get_dynamic_elements_for_masking()
        result = visual_checker.compare("reports-page", mask_locators=mask)
        assert result.passed

    def test_reports_with_filters(self, reports_page: ReportsPage,
                                   visual_checker: VisualChecker):
        """Verifica la vista con filtros aplicados."""
        reports_page.filter_panel.click()
        reports_page.page.wait_for_timeout(200)
        mask = reports_page.get_dynamic_elements_for_masking()
        result = visual_checker.compare("reports-filtered", mask_locators=mask)
        assert result.passed


@pytest.mark.visual
class TestVisualForms:
    """Regresión visual de la página de formularios."""

    def test_forms_page_visual(self, forms_page: FormsPage,
                                visual_checker: VisualChecker):
        """Verifica la página de formularios vacía."""
        mask = forms_page.get_dynamic_elements_for_masking()
        result = visual_checker.compare("forms-page", mask_locators=mask)
        assert result.passed

    def test_forms_validation_errors_visual(self, forms_page: FormsPage,
                                             visual_checker: VisualChecker):
        """Verifica la vista con errores de validación visibles."""
        forms_page.submit_button.click()  # Enviar vacío → errores
        forms_page.page.wait_for_selector("[data-testid='error-summary']")
        mask = forms_page.get_dynamic_elements_for_masking()
        result = visual_checker.compare("forms-validation-errors", mask_locators=mask)
        assert result.passed


@pytest.mark.visual
@pytest.mark.smoke
class TestVisualSmoke:
    """Subset rápido: un screenshot por página para CI."""

    @pytest.mark.parametrize("page_name,url", [
        ("login", "https://portal-corporativo.example.com/login"),
        ("dashboard", "https://portal-corporativo.example.com/dashboard"),
        ("reports", "https://portal-corporativo.example.com/reports"),
        ("forms", "https://portal-corporativo.example.com/forms"),
    ])
    def test_page_screenshot_smoke(self, page: Page,
                                    visual_checker: VisualChecker,
                                    page_name: str, url: str):
        """Smoke test visual: un screenshot por página."""
        page.goto(url)
        page.wait_for_load_state("networkidle")
        result = visual_checker.compare(
            f"smoke-{page_name}",
            threshold=0.5,  # Umbral relajado para smoke
        )
        assert result.passed
</code></pre>

        <h3>♿ Paso 10: Tests de accesibilidad</h3>
        <p>Suite de tests que ejecuta auditorías axe-core y pruebas de navegación por teclado
        para cumplimiento WCAG 2.1 AA.</p>

        <pre><code class="python"># tests/test_accessibility.py
"""
Tests de accesibilidad para el portal corporativo.
Auditoría axe-core (WCAG 2.1 AA) y navegación por teclado.
"""
import pytest
from playwright.sync_api import Page

from pages.login_page import LoginPage
from pages.dashboard_page import DashboardPage
from pages.reports_page import ReportsPage
from pages.forms_page import FormsPage
from helpers.a11y_auditor import A11yAuditor


@pytest.mark.a11y
class TestA11yAxeAudit:
    """Auditorías axe-core para todas las páginas públicas."""

    def test_login_accessibility(self, login_page: LoginPage,
                                  a11y_auditor: A11yAuditor):
        """Auditoría axe-core de la página de login."""
        result = a11y_auditor.audit("login")
        assert result.passed, (
            f"Accesibilidad login: {result.total_violations} violaciones "
            f"({result.critical_count} críticas, {result.serious_count} serias)"
        )

    def test_dashboard_accessibility(self, dashboard_page: DashboardPage,
                                      a11y_auditor: A11yAuditor):
        """Auditoría axe-core del dashboard."""
        result = a11y_auditor.audit("dashboard")
        assert result.passed, (
            f"Accesibilidad dashboard: {result.total_violations} violaciones "
            f"({result.critical_count} críticas, {result.serious_count} serias)"
        )

    def test_reports_accessibility(self, reports_page: ReportsPage,
                                    a11y_auditor: A11yAuditor):
        """Auditoría axe-core de la página de reportes."""
        result = a11y_auditor.audit("reports")
        assert result.passed, (
            f"Accesibilidad reportes: {result.total_violations} violaciones"
        )

    def test_forms_accessibility(self, forms_page: FormsPage,
                                  a11y_auditor: A11yAuditor):
        """Auditoría axe-core de la página de formularios."""
        result = a11y_auditor.audit("forms")
        assert result.passed, (
            f"Accesibilidad formularios: {result.total_violations} violaciones"
        )


@pytest.mark.a11y
class TestA11yCriticalRules:
    """Verifica reglas de accesibilidad críticas individualmente."""

    def test_all_images_have_alt(self, page: Page, portal_urls: dict):
        """Todas las imágenes deben tener atributo alt."""
        for name, url in portal_urls.items():
            page.goto(url)
            page.wait_for_load_state("networkidle")
            images_without_alt = page.evaluate("""() => {
                const imgs = document.querySelectorAll('img:not([alt])');
                return Array.from(imgs).map(img => ({
                    src: img.src,
                    html: img.outerHTML.substring(0, 100)
                }));
            }""")
            assert len(images_without_alt) == 0, (
                f"Página '{name}': {len(images_without_alt)} imágenes sin alt: "
                f"{images_without_alt}"
            )

    def test_all_forms_have_labels(self, page: Page, portal_urls: dict):
        """Todos los inputs de formulario deben tener labels asociados."""
        for name, url in portal_urls.items():
            page.goto(url)
            page.wait_for_load_state("networkidle")
            unlabeled_inputs = page.evaluate("""() => {
                const inputs = document.querySelectorAll(
                    'input:not([type="hidden"]):not([type="submit"]):not([type="button"])'
                );
                return Array.from(inputs).filter(input => {
                    const id = input.id;
                    const hasLabel = id && document.querySelector('label[for="' + id + '"]');
                    const hasAriaLabel = input.getAttribute('aria-label');
                    const hasAriaLabelledBy = input.getAttribute('aria-labelledby');
                    const isWrapped = input.closest('label') !== null;
                    return !hasLabel && !hasAriaLabel && !hasAriaLabelledBy && !isWrapped;
                }).map(input => ({
                    type: input.type,
                    name: input.name,
                    html: input.outerHTML.substring(0, 100)
                }));
            }""")
            assert len(unlabeled_inputs) == 0, (
                f"Página '{name}': {len(unlabeled_inputs)} inputs sin label"
            )

    def test_page_has_lang_attribute(self, page: Page, portal_urls: dict):
        """Cada página debe tener atributo lang en el html."""
        for name, url in portal_urls.items():
            page.goto(url)
            lang = page.evaluate("() => document.documentElement.lang")
            assert lang, f"Página '{name}' no tiene atributo lang en <html>"

    def test_page_has_title(self, page: Page, portal_urls: dict):
        """Cada página debe tener un título descriptivo."""
        for name, url in portal_urls.items():
            page.goto(url)
            title = page.title()
            assert title and len(title) > 3, (
                f"Página '{name}' tiene título vacío o muy corto: '{title}'"
            )

    def test_heading_hierarchy(self, page: Page, portal_urls: dict):
        """Verifica que la jerarquía de headings sea correcta (sin saltos)."""
        for name, url in portal_urls.items():
            page.goto(url)
            page.wait_for_load_state("networkidle")
            heading_issues = page.evaluate("""() => {
                const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
                const issues = [];
                let lastLevel = 0;
                headings.forEach(h => {
                    const level = parseInt(h.tagName[1]);
                    if (level > lastLevel + 1 && lastLevel > 0) {
                        issues.push({
                            from: 'h' + lastLevel,
                            to: h.tagName.toLowerCase(),
                            text: h.textContent.trim().substring(0, 50)
                        });
                    }
                    lastLevel = level;
                });
                return issues;
            }""")
            assert len(heading_issues) == 0, (
                f"Página '{name}': saltos en headings: {heading_issues}"
            )


@pytest.mark.a11y
class TestA11yKeyboardNavigation:
    """Tests de navegación por teclado para flujos críticos."""

    def test_login_keyboard_flow(self, login_page: LoginPage,
                                  a11y_auditor: A11yAuditor):
        """Verifica que el login sea completamente operable por teclado."""
        flow = [
            {"element": "Usuario", "key": "Tab", "role": "textbox"},
            {"element": "Contraseña", "key": "Tab", "role": "textbox"},
            {"element": "Recordarme", "key": "Tab", "role": "checkbox"},
            {"element": "Iniciar sesión", "key": "Tab", "role": "button"},
        ]
        issues = a11y_auditor.test_keyboard_navigation(flow, "login")
        assert len(issues) == 0, (
            f"Problemas de teclado en login: {[i['description'] for i in issues]}"
        )

    def test_dashboard_keyboard_navigation(self, dashboard_page: DashboardPage,
                                             a11y_auditor: A11yAuditor):
        """Verifica navegación por teclado del menú principal."""
        flow = dashboard_page.get_keyboard_navigation_flow()
        issues = a11y_auditor.test_keyboard_navigation(flow, "dashboard")
        critical_issues = [i for i in issues if i["impact"] in ("critical", "serious")]
        assert len(critical_issues) == 0, (
            f"Problemas críticos de teclado en dashboard: "
            f"{[i['description'] for i in critical_issues]}"
        )

    def test_skip_navigation_link(self, login_page: LoginPage,
                                   a11y_auditor: A11yAuditor):
        """Verifica que existe enlace 'Saltar al contenido'."""
        has_skip = a11y_auditor.check_skip_navigation()
        assert has_skip, (
            "No se encontró enlace 'Saltar al contenido' (bypass block). "
            "WCAG 2.4.1 requiere un mecanismo para saltar bloques repetitivos."
        )

    def test_form_keyboard_submission(self, forms_page: FormsPage):
        """Verifica que el formulario se puede enviar con Enter."""
        page = forms_page.page
        # Tab hasta el primer campo y llenar por teclado
        page.keyboard.press("Tab")
        page.keyboard.type("Juan Reina")
        page.keyboard.press("Tab")
        page.keyboard.type("jreina@siesa.com")
        page.keyboard.press("Tab")  # Foco en select
        page.keyboard.press("ArrowDown")  # Seleccionar opción
        page.keyboard.press("Tab")  # Foco en botón enviar
        page.keyboard.press("Enter")  # Enviar formulario
        # Verificar que se procesó
        forms_page.page.wait_for_selector(
            "[data-testid='success-msg'], [data-testid='error-summary']"
        )

    def test_focus_trap_in_modal(self, dashboard_page: DashboardPage):
        """Verifica que los modales atrapan el foco correctamente."""
        page = dashboard_page.page
        # Abrir un modal (ej: configuración)
        page.click("[data-testid='settings-button']")
        page.wait_for_selector("[role='dialog']")

        # Tabular varias veces — el foco no debe salir del modal
        for _ in range(20):
            page.keyboard.press("Tab")
            is_in_modal = page.evaluate("""() => {
                const focused = document.activeElement;
                const modal = document.querySelector('[role="dialog"]');
                return modal && modal.contains(focused);
            }""")
            assert is_in_modal, "El foco escapó del modal (focus trap roto)"

        # Escape debe cerrar el modal
        page.keyboard.press("Escape")
        page.wait_for_selector("[role='dialog']", state="hidden")
</code></pre>

        <h3>🔒 Paso 11: Tests de seguridad</h3>
        <p>Suite de tests que valida headers HTTP, cookies seguras, HTTPS y contenido mixto.</p>

        <pre><code class="python"># tests/test_security.py
"""
Tests de seguridad para el portal corporativo.
Headers HTTP, cookies, HTTPS y contenido mixto.
"""
import pytest
from playwright.sync_api import Page

from helpers.security_checker import SecurityChecker


PORTAL_BASE_URL = "https://portal-corporativo.example.com"
AUDIT_URLS = {
    "login": f"{PORTAL_BASE_URL}/login",
    "dashboard": f"{PORTAL_BASE_URL}/dashboard",
    "reports": f"{PORTAL_BASE_URL}/reports",
    "forms": f"{PORTAL_BASE_URL}/forms",
    "api-users": f"{PORTAL_BASE_URL}/api/v1/users",
    "api-reports": f"{PORTAL_BASE_URL}/api/v1/reports",
}


@pytest.mark.security
class TestSecurityHeaders:
    """Validación de headers de seguridad en todos los endpoints."""

    @pytest.mark.parametrize("page_name,url", [
        ("login", f"{PORTAL_BASE_URL}/login"),
        ("dashboard", f"{PORTAL_BASE_URL}/dashboard"),
        ("reports", f"{PORTAL_BASE_URL}/reports"),
        ("forms", f"{PORTAL_BASE_URL}/forms"),
    ])
    def test_security_headers_present(self, page: Page,
                                       security_checker: SecurityChecker,
                                       page_name: str, url: str):
        """Verifica headers de seguridad en cada página."""
        result = security_checker.full_audit(page_name, url)
        header_findings = [
            f for f in result.findings
            if f.category == "header" and f.severity in ("critical", "high")
        ]
        assert len(header_findings) == 0, (
            f"Headers faltantes en '{page_name}': "
            f"{[f.title for f in header_findings]}"
        )

    def test_strict_transport_security(self, page: Page):
        """Verifica HSTS con max-age >= 1 año."""
        response = page.goto(f"{PORTAL_BASE_URL}/login")
        hsts = response.headers.get("strict-transport-security", "")
        assert hsts, "Header Strict-Transport-Security no está presente"
        assert "max-age=" in hsts, "HSTS no tiene directiva max-age"
        # Extraer max-age y verificar >= 31536000 (1 año)
        import re
        match = re.search(r"max-age=(\\d+)", hsts)
        assert match, "No se pudo extraer max-age de HSTS"
        max_age = int(match.group(1))
        assert max_age >= 31536000, (
            f"HSTS max-age es {max_age} (mínimo recomendado: 31536000)"
        )

    def test_content_security_policy(self, page: Page):
        """Verifica que CSP no permita unsafe-inline ni unsafe-eval."""
        response = page.goto(f"{PORTAL_BASE_URL}/login")
        csp = response.headers.get("content-security-policy", "")
        assert csp, "Content-Security-Policy no está presente"
        assert "'unsafe-inline'" not in csp, (
            "CSP permite 'unsafe-inline' — riesgo de XSS"
        )
        assert "'unsafe-eval'" not in csp, (
            "CSP permite 'unsafe-eval' — riesgo de inyección de código"
        )

    def test_no_information_disclosure(self, page: Page):
        """Verifica que no se expongan headers con info del servidor."""
        response = page.goto(f"{PORTAL_BASE_URL}/login")
        dangerous_headers = ["x-powered-by", "x-aspnet-version"]
        exposed = {
            h: response.headers.get(h, "")
            for h in dangerous_headers
            if response.headers.get(h, "")
        }
        assert len(exposed) == 0, (
            f"Headers exponen info del servidor: {exposed}"
        )


@pytest.mark.security
class TestSecurityCookies:
    """Auditoría de seguridad de cookies."""

    def test_session_cookies_secure(self, page: Page):
        """Todas las cookies de sesión deben tener flags de seguridad."""
        page.goto(f"{PORTAL_BASE_URL}/login")
        # Simular login para obtener cookies de sesión
        page.get_by_label("Usuario").fill("qa_auditor")
        page.get_by_label("Contraseña").fill("audit_2024!")
        page.get_by_role("button", name="Iniciar sesión").click()
        page.wait_for_url("**/dashboard**")

        cookies = page.context.cookies()
        session_indicators = ["session", "token", "auth", "sid", "jwt"]

        for cookie in cookies:
            name = cookie.get("name", "")
            is_session = any(ind in name.lower() for ind in session_indicators)

            if is_session:
                assert cookie.get("secure"), (
                    f"Cookie de sesión '{name}' no tiene flag Secure"
                )
                assert cookie.get("httpOnly"), (
                    f"Cookie de sesión '{name}' no tiene flag HttpOnly — "
                    f"vulnerable a XSS"
                )
                same_site = cookie.get("sameSite", "None")
                assert same_site in ("Strict", "Lax"), (
                    f"Cookie de sesión '{name}' tiene SameSite={same_site}"
                )

    def test_no_sensitive_data_in_cookies(self, page: Page):
        """Verifica que no haya datos sensibles en valores de cookies."""
        page.goto(f"{PORTAL_BASE_URL}/login")
        cookies = page.context.cookies()
        sensitive_patterns = [
            "password", "passwd", "secret", "credit", "ssn", "cedula"
        ]
        for cookie in cookies:
            name = cookie.get("name", "").lower()
            value = cookie.get("value", "").lower()
            for pattern in sensitive_patterns:
                assert pattern not in name, (
                    f"Cookie con nombre sospechoso: '{cookie['name']}'"
                )
                assert pattern not in value, (
                    f"Cookie '{cookie['name']}' puede contener dato sensible"
                )

    def test_cookie_expiration(self, page: Page):
        """Las cookies de sesión no deben tener expiración excesiva."""
        page.goto(f"{PORTAL_BASE_URL}/login")
        cookies = page.context.cookies()
        import time
        max_session_seconds = 8 * 3600  # 8 horas máximo

        for cookie in cookies:
            expires = cookie.get("expires", -1)
            if expires > 0:
                remaining = expires - time.time()
                name = cookie.get("name", "")
                session_indicators = ["session", "token", "auth"]
                is_session = any(ind in name.lower() for ind in session_indicators)
                if is_session and remaining > max_session_seconds:
                    assert False, (
                        f"Cookie de sesión '{name}' expira en "
                        f"{remaining / 3600:.1f} horas (máximo: 8h)"
                    )


@pytest.mark.security
class TestSecurityHTTPS:
    """Verificación de HTTPS y contenido mixto."""

    @pytest.mark.parametrize("page_name,url", [
        ("login", f"{PORTAL_BASE_URL}/login"),
        ("dashboard", f"{PORTAL_BASE_URL}/dashboard"),
        ("reports", f"{PORTAL_BASE_URL}/reports"),
        ("forms", f"{PORTAL_BASE_URL}/forms"),
    ])
    def test_no_mixed_content(self, page: Page, security_checker: SecurityChecker,
                               page_name: str, url: str):
        """Verifica que no hay recursos HTTP en páginas HTTPS."""
        page.goto(url)
        page.wait_for_load_state("networkidle")
        mixed = page.evaluate("""() => {
            const mixed = [];
            document.querySelectorAll(
                'img[src^="http://"], script[src^="http://"], '
                + 'link[href^="http://"], iframe[src^="http://"]'
            ).forEach(el => {
                mixed.push({
                    tag: el.tagName,
                    url: el.src || el.href
                });
            });
            return mixed;
        }""")
        assert len(mixed) == 0, (
            f"Contenido mixto en '{page_name}': {mixed}"
        )

    def test_https_redirect(self, page: Page):
        """Verifica que HTTP redirige a HTTPS."""
        http_url = PORTAL_BASE_URL.replace("https://", "http://")
        response = page.request.get(f"{http_url}/login", max_redirects=0)
        assert response.status in (301, 302, 307, 308), (
            f"HTTP no redirige a HTTPS (status: {response.status})"
        )
        location = response.headers.get("location", "")
        assert location.startswith("https://"), (
            f"Redirección no apunta a HTTPS: {location}"
        )

    def test_no_http_form_actions(self, page: Page, portal_urls: dict):
        """Verifica que ningún formulario envía datos por HTTP."""
        for name, url in portal_urls.items():
            page.goto(url)
            page.wait_for_load_state("networkidle")
            http_forms = page.evaluate("""() => {
                return Array.from(document.querySelectorAll('form'))
                    .filter(f => f.action && f.action.startsWith('http://'))
                    .map(f => ({action: f.action, id: f.id}));
            }""")
            assert len(http_forms) == 0, (
                f"Formularios HTTP en '{name}': {http_forms}"
            )

    def test_api_endpoints_https_only(self, page: Page):
        """Verifica que los endpoints API solo responden por HTTPS."""
        api_endpoints = [
            f"{PORTAL_BASE_URL}/api/v1/users",
            f"{PORTAL_BASE_URL}/api/v1/reports",
            f"{PORTAL_BASE_URL}/api/v1/health",
        ]
        for endpoint in api_endpoints:
            response = page.request.get(endpoint)
            assert response.url.startswith("https://"), (
                f"API endpoint no usa HTTPS: {response.url}"
            )


@pytest.mark.security
@pytest.mark.smoke
class TestSecuritySmoke:
    """Subset rápido de seguridad para CI."""

    def test_critical_headers_all_pages(self, page: Page):
        """Verifica headers críticos en todas las páginas de un vistazo."""
        critical_headers = [
            "strict-transport-security",
            "content-security-policy",
            "x-content-type-options",
        ]
        for name, url in AUDIT_URLS.items():
            if "api" in name:
                continue  # Solo páginas web
            response = page.goto(url)
            missing = [
                h for h in critical_headers
                if not response.headers.get(h, "")
            ]
            assert len(missing) == 0, (
                f"Página '{name}' — headers críticos faltantes: {missing}"
            )
</code></pre>

        <h3>📊 Paso 12: Generador de reporte combinado</h3>
        <p>Clase que genera un reporte HTML unificado con resultados visuales, de accesibilidad
        y de seguridad.</p>

        <pre><code class="python"># helpers/report_generator.py
"""
ReportGenerator — Genera un reporte HTML combinado con los resultados
de las tres auditorías: visual, accesibilidad y seguridad.
"""
import json
from pathlib import Path
from datetime import datetime


class ReportGenerator:
    """
    Genera un reporte HTML combinado con resultados de auditoría.

    Uso:
        generator = ReportGenerator(output_dir="reports")
        generator.generate_combined_report()
    """

    def __init__(self, output_dir: str = "reports"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def generate_combined_report(self) -> str:
        """Genera el reporte HTML combinado leyendo resultados de cada auditoría."""
        visual_data = self._load_visual_results()
        a11y_data = self._load_a11y_results()
        security_data = self._load_security_results()

        html = self._render_html(visual_data, a11y_data, security_data)
        output_path = self.output_dir / "combined-report.html"

        with open(output_path, "w", encoding="utf-8") as f:
            f.write(html)

        return str(output_path)

    def _load_visual_results(self) -> list:
        """Lee resultados visuales de la carpeta reports/visual."""
        results = []
        visual_dir = self.output_dir / "visual"
        if visual_dir.exists():
            for img_file in visual_dir.glob("*-diff.png"):
                name = img_file.stem.replace("-diff", "")
                results.append({
                    "name": name,
                    "diff_image": str(img_file),
                    "actual_image": str(visual_dir / f"{name}-actual.png"),
                })
        return results

    def _load_a11y_results(self) -> list:
        """Lee resultados de accesibilidad de archivos JSON."""
        results = []
        a11y_dir = self.output_dir / "a11y"
        if a11y_dir.exists():
            for json_file in a11y_dir.glob("*-axe.json"):
                with open(json_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                name = json_file.stem.replace("-axe", "")
                results.append({
                    "name": name,
                    "violations": data.get("violations", []),
                    "passes": len(data.get("passes", [])),
                })
        return results

    def _load_security_results(self) -> list:
        """Lee resultados de seguridad del directorio de reportes."""
        results = []
        sec_dir = self.output_dir / "security"
        if sec_dir.exists():
            for json_file in sec_dir.glob("*.json"):
                with open(json_file, "r", encoding="utf-8") as f:
                    results.append(json.load(f))
        return results

    def _render_html(self, visual: list, a11y: list, security: list) -> str:
        """Renderiza el HTML del reporte combinado."""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Contadores
        visual_ok = sum(1 for v in visual if not v.get("diff_image"))
        a11y_violations = sum(
            len(a.get("violations", []))for a in a11y
        )
        sec_findings = sum(
            len(s.get("findings", [])) for s in security
        )

        html = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Auditoría de Calidad — Portal Corporativo</title>
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, sans-serif; margin: 20px; }}
        .header {{ background: #1a237e; color: white; padding: 20px; border-radius: 8px; }}
        .summary {{ display: flex; gap: 20px; margin: 20px 0; }}
        .card {{ flex: 1; padding: 20px; border-radius: 8px; text-align: center; }}
        .card-visual {{ background: #e3f2fd; border: 2px solid #1565c0; }}
        .card-a11y {{ background: #e8f5e9; border: 2px solid #2e7d32; }}
        .card-security {{ background: #fff3e0; border: 2px solid #ef6c00; }}
        .section {{ margin: 30px 0; }}
        table {{ width: 100%; border-collapse: collapse; margin: 15px 0; }}
        th {{ background: #37474f; color: white; padding: 10px; text-align: left; }}
        td {{ padding: 8px 10px; border-bottom: 1px solid #e0e0e0; }}
        tr:nth-child(even) {{ background: #f5f5f5; }}
        .severity-critical {{ color: #d32f2f; font-weight: bold; }}
        .severity-high {{ color: #ef6c00; font-weight: bold; }}
        .severity-medium {{ color: #f9a825; }}
        .severity-low {{ color: #558b2f; }}
        .pass {{ color: #2e7d32; }} .fail {{ color: #d32f2f; }}
        .timestamp {{ color: #757575; font-size: 0.9em; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>Reporte de Auditoría de Calidad</h1>
        <p>Portal Corporativo — Generado: {timestamp}</p>
    </div>
    <div class="summary">
        <div class="card card-visual">
            <h2>Visual</h2>
            <p>{len(visual)} páginas auditadas</p>
            <p>{visual_ok} sin diferencias</p>
        </div>
        <div class="card card-a11y">
            <h2>Accesibilidad</h2>
            <p>{len(a11y)} páginas auditadas</p>
            <p>{a11y_violations} violaciones</p>
        </div>
        <div class="card card-security">
            <h2>Seguridad</h2>
            <p>{len(security)} endpoints auditados</p>
            <p>{sec_findings} hallazgos</p>
        </div>
    </div>
</body>
</html>"""
        return html
</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Consejo SIESA</h4>
            <p>En los proyectos de SIESA, el equipo QA genera este tipo de reporte combinado después de
            cada release candidate. El reporte se adjunta al ticket de release en Jira y sirve como
            evidencia de que los tres pilares de calidad (visual, accesibilidad, seguridad) han sido
            verificados antes del despliegue a producción.</p>
        </div>

        <h3>🚀 Paso 13: Integración CI/CD con pytest markers</h3>
        <p>Configuración para ejecutar las auditorías selectivamente en diferentes etapas del pipeline.</p>

        <pre><code class="python"># Ejecutar solo tests visuales
pytest -m visual --headed

# Ejecutar solo tests de accesibilidad
pytest -m a11y

# Ejecutar solo tests de seguridad
pytest -m security

# Ejecutar smoke tests (rápido, para cada push)
pytest -m smoke

# Ejecutar auditoría completa (para release candidates)
pytest -m "visual or a11y or security" --html=reports/full-audit.html

# Actualizar baselines visuales (primera ejecución o cambio intencional)
UPDATE_BASELINES=true pytest -m visual

# Ejecutar con verbose y detalles de cada hallazgo
pytest -m "a11y or security" -v --tb=long</code></pre>

        <pre><code class="yaml"># .github/workflows/quality-audit.yml
name: Quality Audit Suite

on:
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: '0 6 * * 1'  # Lunes 6AM — auditoría semanal

jobs:
  visual-regression:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          playwright install chromium
      - name: Run visual regression tests
        run: pytest -m visual --html=reports/visual-report.html
      - name: Upload visual artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: visual-diffs
          path: reports/visual/

  accessibility-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          playwright install chromium
      - name: Run accessibility tests
        run: pytest -m a11y --html=reports/a11y-report.html
      - name: Upload a11y reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: a11y-reports
          path: reports/a11y/

  security-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          playwright install chromium
      - name: Run security tests
        run: pytest -m security --html=reports/security-report.html
      - name: Upload security reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: security-reports
          path: reports/security/

  combined-report:
    needs: [visual-regression, accessibility-audit, security-audit]
    runs-on: ubuntu-latest
    if: always()
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
      - name: Generate combined report
        run: python -c "
from helpers.report_generator import ReportGenerator;
ReportGenerator().generate_combined_report()
"
      - name: Upload combined report
        uses: actions/upload-artifact@v4
        with:
          name: combined-quality-report
          path: reports/combined-report.html</code></pre>

        <h3>📋 Paso 14: Resumen de todos los tests</h3>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📊 Tabla resumen de la suite completa</h4>
            <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
                <thead>
                    <tr style="background: #2e7d32; color: white;">
                        <th style="padding: 8px; text-align: left;">Archivo</th>
                        <th style="padding: 8px; text-align: left;">Clase</th>
                        <th style="padding: 8px; text-align: left;">Tests</th>
                        <th style="padding: 8px; text-align: center;">Marker</th>
                        <th style="padding: 8px; text-align: left;">Valida</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 6px 8px;" rowspan="5"><code>test_visual_regression.py</code></td>
                        <td style="padding: 6px 8px;"><code>TestVisualLogin</code></td>
                        <td style="padding: 6px 8px;">3</td>
                        <td style="padding: 6px 8px; text-align: center;">visual</td>
                        <td style="padding: 6px 8px;">Login: normal, error, mobile</td>
                    </tr>
                    <tr style="background: #f5f5f5;">
                        <td style="padding: 6px 8px;"><code>TestVisualDashboard</code></td>
                        <td style="padding: 6px 8px;">2</td>
                        <td style="padding: 6px 8px; text-align: center;">visual</td>
                        <td style="padding: 6px 8px;">Dashboard: normal, sidebar colapsado</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 8px;"><code>TestVisualReports</code></td>
                        <td style="padding: 6px 8px;">2</td>
                        <td style="padding: 6px 8px; text-align: center;">visual</td>
                        <td style="padding: 6px 8px;">Reportes: normal, filtros</td>
                    </tr>
                    <tr style="background: #f5f5f5;">
                        <td style="padding: 6px 8px;"><code>TestVisualForms</code></td>
                        <td style="padding: 6px 8px;">2</td>
                        <td style="padding: 6px 8px; text-align: center;">visual</td>
                        <td style="padding: 6px 8px;">Formularios: vacío, errores</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 8px;"><code>TestVisualSmoke</code></td>
                        <td style="padding: 6px 8px;">4</td>
                        <td style="padding: 6px 8px; text-align: center;">visual, smoke</td>
                        <td style="padding: 6px 8px;">Screenshot rápido de cada página</td>
                    </tr>
                    <tr style="background: #e8f5e9;">
                        <td style="padding: 6px 8px;" rowspan="3"><code>test_accessibility.py</code></td>
                        <td style="padding: 6px 8px;"><code>TestA11yAxeAudit</code></td>
                        <td style="padding: 6px 8px;">4</td>
                        <td style="padding: 6px 8px; text-align: center;">a11y</td>
                        <td style="padding: 6px 8px;">axe-core en 4 páginas</td>
                    </tr>
                    <tr style="background: #f5f5f5;">
                        <td style="padding: 6px 8px;"><code>TestA11yCriticalRules</code></td>
                        <td style="padding: 6px 8px;">5</td>
                        <td style="padding: 6px 8px; text-align: center;">a11y</td>
                        <td style="padding: 6px 8px;">alt, labels, lang, title, headings</td>
                    </tr>
                    <tr style="background: #e8f5e9;">
                        <td style="padding: 6px 8px;"><code>TestA11yKeyboardNavigation</code></td>
                        <td style="padding: 6px 8px;">5</td>
                        <td style="padding: 6px 8px; text-align: center;">a11y</td>
                        <td style="padding: 6px 8px;">Teclado: login, dashboard, skip, form, modal</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 8px;" rowspan="4"><code>test_security.py</code></td>
                        <td style="padding: 6px 8px;"><code>TestSecurityHeaders</code></td>
                        <td style="padding: 6px 8px;">7</td>
                        <td style="padding: 6px 8px; text-align: center;">security</td>
                        <td style="padding: 6px 8px;">Headers: HSTS, CSP, XCT, info disclosure</td>
                    </tr>
                    <tr style="background: #f5f5f5;">
                        <td style="padding: 6px 8px;"><code>TestSecurityCookies</code></td>
                        <td style="padding: 6px 8px;">3</td>
                        <td style="padding: 6px 8px; text-align: center;">security</td>
                        <td style="padding: 6px 8px;">Cookies: flags, datos sensibles, expiración</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 8px;"><code>TestSecurityHTTPS</code></td>
                        <td style="padding: 6px 8px;">7</td>
                        <td style="padding: 6px 8px; text-align: center;">security</td>
                        <td style="padding: 6px 8px;">HTTPS: mixed content, redirect, forms, APIs</td>
                    </tr>
                    <tr style="background: #f5f5f5;">
                        <td style="padding: 6px 8px;"><code>TestSecuritySmoke</code></td>
                        <td style="padding: 6px 8px;">1</td>
                        <td style="padding: 6px 8px; text-align: center;">security, smoke</td>
                        <td style="padding: 6px 8px;">Headers críticos en todas las páginas</td>
                    </tr>
                </tbody>
            </table>
            <p><strong>Total: 45 tests</strong> organizados en 11 clases, 3 archivos de test,
            3 helpers reutilizables, 4 page objects y 1 generador de reportes.</p>
        </div>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔑 Conceptos clave integrados en este proyecto</h4>
            <ul>
                <li><strong>Lección 099:</strong> Screenshot comparison nativa — base de <code>VisualChecker</code></li>
                <li><strong>Lección 100:</strong> Masking y umbrales — <code>mask_locators</code>, <code>threshold</code></li>
                <li><strong>Lección 101:</strong> axe-core — motor del <code>A11yAuditor</code></li>
                <li><strong>Lección 102:</strong> Auditorías WCAG — reglas críticas, keyboard tests</li>
                <li><strong>Lección 103:</strong> Security headers y HTTPS — <code>SecurityChecker</code> completo</li>
                <li><strong>Transversal:</strong> Page Objects, fixtures, markers, CI/CD, reportes</li>
            </ul>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🏋️ Ejercicio final</h4>
            <p>Extiende la suite de auditoría de calidad con las siguientes mejoras:</p>
            <ol>
                <li><strong>Dark mode:</strong> Agrega tests de regresión visual para el modo oscuro del portal.
                Modifica el <code>conftest.py</code> para crear un fixture <code>dark_mode_page</code> con
                <code>color_scheme: "dark"</code> y duplica los tests visuales clave para ambos temas.</li>

                <li><strong>Contraste de color mejorado:</strong> Crea un test que use <code>axe-core</code> exclusivamente
                para la regla <code>color-contrast</code> y que reporte el ratio de contraste real vs. el mínimo
                WCAG AA (4.5:1 para texto normal, 3:1 para texto grande).</li>

                <li><strong>CORS audit:</strong> Agrega al <code>SecurityChecker</code> un método
                <code>check_cors_headers()</code> que valide que los endpoints API tengan
                <code>Access-Control-Allow-Origin</code> configurado correctamente (no <code>*</code> en producción).</li>

                <li><strong>Performance budget:</strong> Crea un nuevo helper <code>PerformanceChecker</code> que mida
                tiempos de carga (LCP, FCP, TTI) usando <code>page.evaluate()</code> con la API
                <code>PerformanceObserver</code> y falle si superan un presupuesto definido.</li>

                <li><strong>Reporte PDF:</strong> Extiende el <code>ReportGenerator</code> para generar también
                una versión PDF del reporte combinado usando <code>weasyprint</code> o la función
                <code>page.pdf()</code> de Playwright sobre el HTML generado.</li>
            </ol>

            <div style="background: #e8f5e9; padding: 10px; border-radius: 5px; margin-top: 10px;">
                <strong>Criterios de éxito:</strong>
                <ul>
                    <li>Los tests de dark mode usan baselines separados (ej: <code>login-dark.png</code>)</li>
                    <li>El test de contraste reporta ratios específicos, no solo pass/fail</li>
                    <li>El check de CORS distingue entre endpoints públicos y privados</li>
                    <li>El performance budget es configurable via <code>pytest.ini</code> o variables de entorno</li>
                    <li>El reporte PDF incluye las mismas secciones que el HTML</li>
                    <li>Todos los nuevos tests tienen markers apropiados</li>
                    <li>La ejecución <code>pytest -m smoke</code> sigue siendo rápida (&lt; 30 segundos)</li>
                </ul>
            </div>
        </div>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Construir una suite de auditoría de calidad con tres pilares: visual, accesibilidad y seguridad</li>
                <li>Implementar clases helper reutilizables (VisualChecker, A11yAuditor, SecurityChecker)</li>
                <li>Aplicar masking de contenido dinámico para regresión visual estable</li>
                <li>Ejecutar auditorías axe-core con cumplimiento WCAG 2.1 AA</li>
                <li>Probar navegación por teclado para flujos críticos del portal</li>
                <li>Validar headers de seguridad, cookies y configuración HTTPS</li>
                <li>Detectar contenido mixto HTTP/HTTPS en páginas del portal</li>
                <li>Generar reportes HTML combinados con resultados de las tres auditorías</li>
                <li>Configurar CI/CD con pytest markers para ejecución selectiva</li>
                <li>Crear un conftest.py profesional con fixtures para los tres tipos de testing</li>
                <li>Integrar todas las técnicas de la Sección 15 en un proyecto cohesivo</li>
            </ul>
        </div>

        <h3>🚀 Siguiente: Sección 16 — Reporting y Trace Viewer</h3>
        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Has completado la Sección 15: Visual Regression y Accessibility Testing.</strong>
            Ahora dominas los tres pilares de auditoría de calidad: consistencia visual, accesibilidad
            y seguridad. En la <strong>Sección 16</strong> aprenderás a generar y personalizar reportes
            profesionales:</p>
            <ul>
                <li><strong>Reportes HTML con pytest-html:</strong> Personalización, screenshots embebidos y filtros</li>
                <li><strong>Allure reports:</strong> Reportes interactivos con historial de ejecuciones</li>
                <li><strong>Trace Viewer avanzado:</strong> Análisis profundo de traces, timeline y network</li>
                <li><strong>Métricas y dashboards:</strong> Dashboards personalizados con tendencias de calidad</li>
                <li><strong>Proyecto capstone:</strong> Pipeline de reporting completo con múltiples formatos</li>
            </ul>
            <p>Las suites de auditoría que construiste aquí generarán datos que en la Sección 16 aprenderás
            a presentar de forma profesional con reportes ricos, traces detallados y dashboards ejecutivos.</p>
        </div>
    `,
    topics: ["proyecto", "visual", "a11y", "security"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 15,
    difficulty: "hard",
    type: "capstone"
};

if (typeof window !== 'undefined') {
    window.LESSON_104 = LESSON_104;
}
