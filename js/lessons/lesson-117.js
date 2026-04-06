/**
 * Playwright Academy - Leccion 117
 * Arquitectura de framework scalable
 * Seccion 18: Arquitecturas y Patrones Enterprise
 */

const LESSON_117 = {
    id: 117,
    title: "Arquitectura de framework scalable",
    duration: "10 min",
    level: "advanced",
    section: "section-18",
    content: `
        <h2>Arquitectura de framework scalable</h2>
        <p>Un framework de testing escalable no se improvisa — se <strong>diseña</strong>. A medida que
        una suite de tests crece de 50 a 500 o 5000 tests, las decisiones arquitectonicas iniciales
        determinan si el framework sera mantenible o se convertira en una carga. En esta leccion
        aprenderas los principios y patrones para diseñar frameworks de Playwright con Python que
        escalen para equipos enterprise.</p>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>El framework de automatizacion de SIESA gestiona mas de 1200 tests E2E distribuidos
            en 8 modulos del ERP. La arquitectura en capas que veras en esta leccion es la misma que
            permite a 5 QA engineers trabajar en paralelo sin conflictos, con tiempos de ejecucion
            menores a 45 minutos gracias al sharding y la modularizacion.</p>
        </div>

        <h3>Principios de arquitectura escalable</h3>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Principio</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripcion</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Beneficio</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Separacion de capas</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Tests, Page Objects, Servicios, Utilidades en capas independientes</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Cambios localizados, menor acoplamiento</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>DRY selectivo</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Reutilizar logica de negocio, no assertions ni setup</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Tests legibles sin abstracciones excesivas</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Configuracion externalizada</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Entornos, credenciales, URLs en archivos de config</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Mismo codigo, multiples entornos</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Independencia de tests</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Cada test puede ejecutarse solo, sin orden</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Paralelismo, debugging aislado</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Convention over config</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Nombres y ubicaciones predecibles</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Onboarding rapido, consistencia</td>
                </tr>
            </table>
        </div>

        <h3>Estructura de directorio enterprise</h3>

        <pre><code class="text">playwright-framework/
├── config/
│   ├── __init__.py
│   ├── settings.py           # Configuracion central
│   ├── environments.py       # URLs y datos por entorno
│   └── constants.py          # Constantes globales
├── pages/
│   ├── __init__.py
│   ├── base_page.py          # Clase base para todos los Page Objects
│   ├── components/           # Componentes reutilizables (navbar, footer, modal)
│   │   ├── __init__.py
│   │   ├── navbar.py
│   │   ├── sidebar.py
│   │   └── data_table.py
│   ├── auth/
│   │   ├── __init__.py
│   │   ├── login_page.py
│   │   └── register_page.py
│   ├── dashboard/
│   │   ├── __init__.py
│   │   └── dashboard_page.py
│   └── inventory/
│       ├── __init__.py
│       ├── products_page.py
│       └── product_detail_page.py
├── services/
│   ├── __init__.py
│   ├── api_client.py         # Cliente API base
│   ├── auth_service.py       # Autenticacion via API
│   └── data_service.py       # Gestion de datos de prueba
├── utils/
│   ├── __init__.py
│   ├── helpers.py            # Funciones de utilidad
│   ├── waits.py              # Custom waits
│   ├── reporters.py          # Reporteria personalizada
│   └── decorators.py         # Decoradores (retry, log, etc.)
├── fixtures/
│   ├── __init__.py
│   ├── conftest.py           # Fixtures globales
│   ├── auth_fixtures.py      # Fixtures de autenticacion
│   ├── data_fixtures.py      # Fixtures de datos
│   └── browser_fixtures.py   # Fixtures de browser/context
├── data/
│   ├── test_users.json       # Datos de usuarios
│   ├── products.csv          # Datos de productos
│   └── environments.yaml     # Config por entorno
├── tests/
│   ├── conftest.py           # Conftest de tests (importa fixtures/)
│   ├── smoke/                # Tests de smoke (< 5 min)
│   │   ├── test_login.py
│   │   └── test_dashboard.py
│   ├── regression/           # Tests de regresion completa
│   │   ├── auth/
│   │   │   ├── test_login_flows.py
│   │   │   └── test_registration.py
│   │   ├── inventory/
│   │   │   ├── test_products.py
│   │   │   └── test_search.py
│   │   └── checkout/
│   │       └── test_purchase_flow.py
│   └── visual/               # Tests de regresion visual
│       └── test_screenshots.py
├── reports/                  # Reportes generados
├── pyproject.toml
├── requirements.txt
└── Makefile                  # Comandos comunes</code></pre>

        <h3>Clase base: BasePage</h3>
        <p>La piedra angular del framework es la clase base que encapsula las interacciones comunes:</p>

        <pre><code class="python"># pages/base_page.py
from playwright.sync_api import Page, Locator, expect
import logging

logger = logging.getLogger(__name__)

class BasePage:
    """Clase base para todos los Page Objects."""

    def __init__(self, page: Page):
        self.page = page
        self._url = ""  # Subclases definen su URL

    # ---- Navegacion ----
    def navigate(self):
        """Navegar a la URL del page object."""
        logger.info(f"Navegando a {self._url}")
        self.page.goto(self._url)
        self.wait_for_page_load()
        return self

    def wait_for_page_load(self):
        """Esperar a que la pagina este completamente cargada."""
        self.page.wait_for_load_state("domcontentloaded")

    # ---- Locators helper ----
    def locator(self, selector: str) -> Locator:
        return self.page.locator(selector)

    def get_by_role(self, role: str, **kwargs) -> Locator:
        return self.page.get_by_role(role, **kwargs)

    def get_by_text(self, text: str, **kwargs) -> Locator:
        return self.page.get_by_text(text, **kwargs)

    def get_by_test_id(self, test_id: str) -> Locator:
        return self.page.get_by_test_id(test_id)

    # ---- Acciones comunes ----
    def click(self, selector: str):
        logger.debug(f"Click en: {selector}")
        self.locator(selector).click()

    def fill(self, selector: str, value: str):
        logger.debug(f"Fill '{selector}' con '{value[:20]}...'")
        self.locator(selector).fill(value)

    def get_text(self, selector: str) -> str:
        return self.locator(selector).text_content() or ""

    def is_visible(self, selector: str) -> bool:
        return self.locator(selector).is_visible()

    # ---- Assertions ----
    def should_have_title(self, title: str):
        expect(self.page).to_have_title(title)

    def should_have_url(self, url_pattern: str):
        expect(self.page).to_have_url(url_pattern)

    def should_be_visible(self, selector: str):
        expect(self.locator(selector)).to_be_visible()

    # ---- Screenshots ----
    def take_screenshot(self, name: str):
        self.page.screenshot(path=f"reports/screenshots/{name}.png")

    # ---- Representation ----
    def __repr__(self):
        return f"{self.__class__.__name__}(url={self._url})"</code></pre>

        <h3>Page Object concreto</h3>

        <pre><code class="python"># pages/auth/login_page.py
from pages.base_page import BasePage
from playwright.sync_api import expect

class LoginPage(BasePage):
    """Page Object para la pagina de login."""

    def __init__(self, page):
        super().__init__(page)
        self._url = "/auth/login"

        # Locators definidos como propiedades
        self._username = "[data-testid='username-input']"
        self._password = "[data-testid='password-input']"
        self._submit_btn = "[data-testid='login-button']"
        self._error_msg = "[data-testid='error-message']"
        self._remember_me = "[data-testid='remember-checkbox']"

    def login(self, username: str, password: str):
        """Realizar login con credenciales."""
        self.fill(self._username, username)
        self.fill(self._password, password)
        self.click(self._submit_btn)
        return self

    def login_and_wait(self, username: str, password: str):
        """Login y esperar redireccion al dashboard."""
        self.login(username, password)
        self.page.wait_for_url("**/dashboard")
        from pages.dashboard.dashboard_page import DashboardPage
        return DashboardPage(self.page)

    def check_remember_me(self):
        self.click(self._remember_me)
        return self

    def get_error_message(self) -> str:
        return self.get_text(self._error_msg)

    def should_show_error(self, message: str):
        expect(self.locator(self._error_msg)).to_have_text(message)</code></pre>

        <h3>Configuracion multi-entorno</h3>

        <pre><code class="python"># config/settings.py
import os
from dataclasses import dataclass
from typing import Optional

@dataclass
class Settings:
    """Configuracion centralizada del framework."""
    # Entorno
    environment: str = os.getenv("TEST_ENV", "local")
    base_url: str = ""
    api_url: str = ""

    # Browser
    browser: str = os.getenv("BROWSER", "chromium")
    headless: bool = os.getenv("HEADLESS", "true").lower() == "true"
    slow_mo: int = int(os.getenv("SLOW_MO", "0"))

    # Timeouts
    default_timeout: int = 30000
    navigation_timeout: int = 60000

    # Credenciales (de variables de entorno, NUNCA hardcoded)
    admin_user: str = os.getenv("ADMIN_USER", "admin@test.com")
    admin_pass: str = os.getenv("ADMIN_PASS", "test123")

    def __post_init__(self):
        env_urls = {
            "local": ("http://localhost:3000", "http://localhost:3001/api"),
            "staging": ("https://staging.app.com", "https://staging-api.app.com"),
            "production": ("https://app.com", "https://api.app.com"),
        }
        urls = env_urls.get(self.environment, env_urls["local"])
        self.base_url = os.getenv("BASE_URL", urls[0])
        self.api_url = os.getenv("API_URL", urls[1])

# Instancia global
settings = Settings()</code></pre>

        <h3>Servicio de autenticacion via API</h3>

        <pre><code class="python"># services/auth_service.py
from playwright.sync_api import APIRequestContext
from config.settings import settings
import json

class AuthService:
    """Servicio para autenticacion via API (bypass UI para setup)."""

    def __init__(self, api_context: APIRequestContext):
        self.api = api_context
        self.base = settings.api_url

    def get_auth_token(self, username: str, password: str) -> str:
        """Obtener token de autenticacion via API."""
        response = self.api.post(f"{self.base}/auth/login", data={
            "username": username,
            "password": password
        })
        assert response.ok, f"Login API fallo: {response.status}"
        return response.json()["token"]

    def get_auth_state(self, username: str, password: str) -> dict:
        """Obtener storage state para reutilizar sesion en browser."""
        token = self.get_auth_token(username, password)
        return {
            "cookies": [],
            "origins": [{
                "origin": settings.base_url,
                "localStorage": [
                    {"name": "auth_token", "value": token}
                ]
            }]
        }</code></pre>

        <h3>Fixtures organizados por responsabilidad</h3>

        <pre><code class="python"># fixtures/auth_fixtures.py
import pytest
import json
from pathlib import Path
from config.settings import settings
from services.auth_service import AuthService

@pytest.fixture(scope="session")
def admin_auth_state(playwright):
    """Storage state con sesion de admin (reutilizable en toda la sesion)."""
    api_context = playwright.request.new_context(base_url=settings.api_url)
    auth_service = AuthService(api_context)
    state = auth_service.get_auth_state(settings.admin_user, settings.admin_pass)
    api_context.dispose()

    # Guardar en archivo para reutilizar
    state_path = Path("test-results/.auth/admin.json")
    state_path.parent.mkdir(parents=True, exist_ok=True)
    state_path.write_text(json.dumps(state))
    return str(state_path)

@pytest.fixture
def authenticated_page(browser, admin_auth_state):
    """Pagina ya autenticada como admin."""
    context = browser.new_context(storage_state=admin_auth_state)
    page = context.new_page()
    yield page
    context.close()</code></pre>

        <pre><code class="python"># tests/conftest.py - Importar todos los fixtures
from fixtures.auth_fixtures import *
from fixtures.data_fixtures import *
from fixtures.browser_fixtures import *</code></pre>

        <h3>Makefile para comandos comunes</h3>

        <pre><code class="makefile"># Makefile
.PHONY: test smoke regression lint clean

test:
	pytest tests/ -v --tb=short

smoke:
	pytest tests/smoke/ -v --tb=short -m smoke

regression:
	pytest tests/regression/ -v --tb=short --reruns 2

lint:
	flake8 tests/ pages/ services/ utils/ --max-line-length=120
	black --check tests/ pages/ services/ utils/

clean:
	rm -rf reports/ test-results/ .pytest_cache/
	find . -name __pycache__ -exec rm -rf {} +

parallel:
	pytest tests/ -n auto --dist=loadscope -v</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Ejercicio Practico</h4>
            <p>Diseña la arquitectura de un framework escalable para una aplicacion web con:</p>
            <ol>
                <li>Crea la estructura de directorios completa</li>
                <li>Implementa <code>BasePage</code> con al menos 10 metodos comunes</li>
                <li>Crea 2 Page Objects concretos que extiendan BasePage</li>
                <li>Implementa <code>Settings</code> con configuracion multi-entorno</li>
                <li>Crea un <code>AuthService</code> para login via API</li>
                <li>Configura fixtures de autenticacion reutilizables</li>
                <li>Escribe un Makefile con los comandos: test, smoke, regression, lint, clean</li>
            </ol>
        </div>

        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>En la siguiente leccion</strong> exploraras estrategias de
            <strong>multi-proyecto y monorepo</strong>, aprendiendo a organizar suites de tests
            para multiples aplicaciones dentro de un mismo repositorio.</p>
        </div>
    `,
    topics: ["arquitectura", "framework", "scalable"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 10,
    difficulty: "hard",
    type: "foundation"
};

if (typeof window !== 'undefined') {
    window.LESSON_117 = LESSON_117;
}
