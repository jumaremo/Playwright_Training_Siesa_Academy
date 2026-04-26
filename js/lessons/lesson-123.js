/**
 * Playwright Academy - Leccion 123
 * Proyecto: Framework enterprise completo
 * Seccion 18: Arquitecturas y Patrones Enterprise
 */

const LESSON_123 = {
    id: 123,
    title: "Proyecto: Framework enterprise completo",
    duration: "15 min",
    level: "advanced",
    section: "section-18",
    content: `
        <h2>Proyecto: Framework enterprise completo</h2>
        <p>Este proyecto capstone integra todos los conceptos de la Seccion 18: arquitectura escalable,
        monorepo, plugins pytest, patrones de diseño, microservicios y performance. Construiras un
        <strong>framework de testing enterprise</strong> completo que podrias usar en un proyecto real
        de gran escala.</p>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>El framework que construiras en este proyecto sigue la misma arquitectura que utiliza
            el equipo de QA de SIESA para automatizar los modulos del ERP. La separacion en capas,
            los patrones de diseño y la configuracion multi-entorno son exactamente los mismos
            principios que permiten gestionar +1200 tests con 5 QA engineers.</p>
        </div>

        <h3>Requisitos del proyecto</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tu framework debe incluir:</h4>
            <ol>
                <li><strong>Arquitectura en capas:</strong> pages/, services/, utils/, fixtures/, tests/</li>
                <li><strong>BasePage:</strong> Clase base con minimo 10 metodos reutilizables</li>
                <li><strong>Page Objects:</strong> Al menos 4 paginas concretas</li>
                <li><strong>Configuracion:</strong> Multi-entorno (local, staging, production)</li>
                <li><strong>Patrones:</strong> AAA en tests, Builder para datos, Factory para pages</li>
                <li><strong>Plugins:</strong> pytest-html, pytest-xdist, plugin personalizado</li>
                <li><strong>Performance:</strong> Baselines y deteccion de regresion</li>
                <li><strong>API Service:</strong> Login via API, setup de datos</li>
            </ol>
        </div>

        <h3>Paso 1: Estructura del proyecto</h3>

        <pre><code class="text">enterprise-framework/
├── config/
│   ├── __init__.py
│   ├── settings.py              # Configuracion multi-entorno
│   ├── constants.py             # Constantes globales
│   └── environments.yaml        # URLs por entorno
├── pages/
│   ├── __init__.py
│   ├── base_page.py             # Clase base universal
│   ├── components/
│   │   ├── __init__.py
│   │   ├── navbar.py
│   │   ├── sidebar.py
│   │   ├── data_table.py
│   │   └── modal.py
│   ├── auth/
│   │   ├── __init__.py
│   │   ├── login_page.py
│   │   └── register_page.py
│   ├── dashboard/
│   │   ├── __init__.py
│   │   └── dashboard_page.py
│   ├── inventory/
│   │   ├── __init__.py
│   │   ├── products_page.py
│   │   └── product_detail_page.py
│   └── orders/
│       ├── __init__.py
│       └── orders_page.py
├── services/
│   ├── __init__.py
│   ├── api_client.py
│   ├── auth_service.py
│   └── data_service.py
├── builders/
│   ├── __init__.py
│   ├── user_builder.py
│   └── order_builder.py
├── factories/
│   ├── __init__.py
│   └── page_factory.py
├── plugins/
│   ├── __init__.py
│   └── pytest_performance.py    # Plugin personalizado
├── utils/
│   ├── __init__.py
│   ├── helpers.py
│   ├── decorators.py
│   └── reporters.py
├── fixtures/
│   ├── __init__.py
│   ├── conftest.py
│   ├── auth_fixtures.py
│   ├── data_fixtures.py
│   └── browser_fixtures.py
├── data/
│   ├── test_users.json
│   ├── test_products.csv
│   └── performance_baselines.json
├── tests/
│   ├── conftest.py
│   ├── smoke/
│   │   ├── test_login.py
│   │   └── test_dashboard.py
│   ├── regression/
│   │   ├── auth/
│   │   │   └── test_auth_flows.py
│   │   ├── inventory/
│   │   │   └── test_products.py
│   │   └── orders/
│   │       └── test_order_flows.py
│   ├── api/
│   │   └── test_api_contracts.py
│   └── performance/
│       └── test_page_performance.py
├── reports/
├── pyproject.toml
├── requirements.txt
└── Makefile</code></pre>

        <h3>Paso 2: Configuracion centralizada</h3>

        <div class="code-tabs" data-code-id="L123-1">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># config/settings.py
import os
import yaml
from dataclasses import dataclass
from pathlib import Path

@dataclass
class FrameworkSettings:
    """Configuracion centralizada del framework enterprise."""

    # Entorno
    environment: str = os.getenv("TEST_ENV", "local")
    base_url: str = ""
    api_url: str = ""

    # Browser
    browser: str = os.getenv("BROWSER", "chromium")
    headless: bool = os.getenv("HEADLESS", "true").lower() == "true"
    slow_mo: int = int(os.getenv("SLOW_MO", "0"))
    viewport_width: int = 1920
    viewport_height: int = 1080

    # Timeouts (ms)
    default_timeout: int = 30000
    navigation_timeout: int = 60000
    assertion_timeout: int = 10000

    # Performance
    perf_enabled: bool = os.getenv("PERF_MONITORING", "false").lower() == "true"
    perf_threshold_multiplier: float = 1.2

    # Retry
    max_retries: int = int(os.getenv("MAX_RETRIES", "0"))

    def __post_init__(self):
        """Cargar URLs desde archivo de entornos."""
        envs_file = Path(__file__).parent / "environments.yaml"
        if envs_file.exists():
            with open(envs_file) as f:
                envs = yaml.safe_load(f)
            env_config = envs.get(self.environment, envs.get("local", {}))
            self.base_url = os.getenv("BASE_URL", env_config.get("base_url", ""))
            self.api_url = os.getenv("API_URL", env_config.get("api_url", ""))

settings = FrameworkSettings()</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// config/settings.ts
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

// Interfaz de configuracion del framework enterprise
interface FrameworkSettings {
    // Entorno
    environment: string;
    baseUrl: string;
    apiUrl: string;

    // Browser
    browser: string;
    headless: boolean;
    slowMo: number;
    viewportWidth: number;
    viewportHeight: number;

    // Timeouts (ms)
    defaultTimeout: number;
    navigationTimeout: number;
    assertionTimeout: number;

    // Performance
    perfEnabled: boolean;
    perfThresholdMultiplier: number;

    // Retry
    maxRetries: number;
}

function loadSettings(): FrameworkSettings {
    const environment = process.env.TEST_ENV || 'local';
    let baseUrl = '';
    let apiUrl = '';

    // Cargar URLs desde archivo de entornos
    const envsFile = path.join(__dirname, 'environments.yaml');
    if (fs.existsSync(envsFile)) {
        const envsContent = fs.readFileSync(envsFile, 'utf-8');
        const envs = yaml.load(envsContent) as Record&lt;string, any&gt;;
        const envConfig = envs[environment] || envs['local'] || {};
        baseUrl = process.env.BASE_URL || envConfig.base_url || '';
        apiUrl = process.env.API_URL || envConfig.api_url || '';
    }

    return {
        environment,
        baseUrl,
        apiUrl,
        browser: process.env.BROWSER || 'chromium',
        headless: (process.env.HEADLESS || 'true').toLowerCase() === 'true',
        slowMo: parseInt(process.env.SLOW_MO || '0', 10),
        viewportWidth: 1920,
        viewportHeight: 1080,
        defaultTimeout: 30000,
        navigationTimeout: 60000,
        assertionTimeout: 10000,
        perfEnabled: (process.env.PERF_MONITORING || 'false').toLowerCase() === 'true',
        perfThresholdMultiplier: 1.2,
        maxRetries: parseInt(process.env.MAX_RETRIES || '0', 10),
    };
}

export const settings = loadSettings();</code></pre>
</div>
</div>

        <pre><code class="yaml"># config/environments.yaml
local:
  base_url: "http://localhost:3000"
  api_url: "http://localhost:3001/api"

staging:
  base_url: "https://staging.app.siesa.com"
  api_url: "https://staging-api.app.siesa.com"

production:
  base_url: "https://app.siesa.com"
  api_url: "https://api.app.siesa.com"</code></pre>

        <h3>Paso 3: BasePage robusto</h3>

        <div class="code-tabs" data-code-id="L123-2">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># pages/base_page.py
from playwright.sync_api import Page, Locator, expect
from config.settings import settings
import logging

logger = logging.getLogger(__name__)

class BasePage:
    """Clase base con metodos reutilizables para todos los Page Objects."""

    def __init__(self, page: Page):
        self.page = page
        self._url = ""

    # ---- Navegacion ----
    def navigate(self):
        full_url = f"{settings.base_url}{self._url}"
        logger.info(f"Navegando a {full_url}")
        self.page.goto(full_url)
        self.wait_for_page_load()
        return self

    def wait_for_page_load(self):
        self.page.wait_for_load_state("domcontentloaded")

    def wait_for_network_idle(self):
        self.page.wait_for_load_state("networkidle")

    # ---- Locators ----
    def locator(self, selector: str) -> Locator:
        return self.page.locator(selector)

    def by_test_id(self, test_id: str) -> Locator:
        return self.page.get_by_test_id(test_id)

    def by_role(self, role: str, **kwargs) -> Locator:
        return self.page.get_by_role(role, **kwargs)

    def by_text(self, text: str) -> Locator:
        return self.page.get_by_text(text)

    # ---- Acciones ----
    def click(self, selector: str):
        self.locator(selector).click()

    def fill(self, selector: str, value: str):
        self.locator(selector).fill(value)

    def select_option(self, selector: str, value: str):
        self.locator(selector).select_option(value)

    def check(self, selector: str):
        self.locator(selector).check()

    # ---- Lectura ----
    def get_text(self, selector: str) -> str:
        return self.locator(selector).text_content() or ""

    def get_value(self, selector: str) -> str:
        return self.locator(selector).input_value()

    def is_visible(self, selector: str) -> bool:
        return self.locator(selector).is_visible()

    def count(self, selector: str) -> int:
        return self.locator(selector).count()

    # ---- Assertions ----
    def should_be_visible(self, selector: str):
        expect(self.locator(selector)).to_be_visible()

    def should_have_text(self, selector: str, text: str):
        expect(self.locator(selector)).to_have_text(text)

    def should_have_url(self, pattern: str):
        expect(self.page).to_have_url(pattern)

    # ---- Screenshots ----
    def screenshot(self, name: str):
        self.page.screenshot(path=f"reports/screenshots/{name}.png", full_page=True)</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// pages/base-page.ts
import { Page, Locator, expect } from '@playwright/test';
import { settings } from '../config/settings';

export class BasePage {
    // Clase base con metodos reutilizables para todos los Page Objects
    readonly page: Page;
    protected _url: string = '';

    constructor(page: Page) {
        this.page = page;
    }

    // ---- Navegacion ----
    async navigate(): Promise&lt;this&gt; {
        const fullUrl = \`\${settings.baseUrl}\${this._url}\`;
        console.log(\`Navegando a \${fullUrl}\`);
        await this.page.goto(fullUrl);
        await this.waitForPageLoad();
        return this;
    }

    async waitForPageLoad(): Promise&lt;void&gt; {
        await this.page.waitForLoadState('domcontentloaded');
    }

    async waitForNetworkIdle(): Promise&lt;void&gt; {
        await this.page.waitForLoadState('networkidle');
    }

    // ---- Locators ----
    locator(selector: string): Locator {
        return this.page.locator(selector);
    }

    byTestId(testId: string): Locator {
        return this.page.getByTestId(testId);
    }

    byRole(role: Parameters&lt;Page['getByRole']&gt;[0], options?: Parameters&lt;Page['getByRole']&gt;[1]): Locator {
        return this.page.getByRole(role, options);
    }

    byText(text: string): Locator {
        return this.page.getByText(text);
    }

    // ---- Acciones ----
    async click(selector: string): Promise&lt;void&gt; {
        await this.locator(selector).click();
    }

    async fill(selector: string, value: string): Promise&lt;void&gt; {
        await this.locator(selector).fill(value);
    }

    async selectOption(selector: string, value: string): Promise&lt;void&gt; {
        await this.locator(selector).selectOption(value);
    }

    async check(selector: string): Promise&lt;void&gt; {
        await this.locator(selector).check();
    }

    // ---- Lectura ----
    async getText(selector: string): Promise&lt;string&gt; {
        return (await this.locator(selector).textContent()) || '';
    }

    async getValue(selector: string): Promise&lt;string&gt; {
        return await this.locator(selector).inputValue();
    }

    async isVisible(selector: string): Promise&lt;boolean&gt; {
        return await this.locator(selector).isVisible();
    }

    async count(selector: string): Promise&lt;number&gt; {
        return await this.locator(selector).count();
    }

    // ---- Assertions ----
    async shouldBeVisible(selector: string): Promise&lt;void&gt; {
        await expect(this.locator(selector)).toBeVisible();
    }

    async shouldHaveText(selector: string, text: string): Promise&lt;void&gt; {
        await expect(this.locator(selector)).toHaveText(text);
    }

    async shouldHaveUrl(pattern: string): Promise&lt;void&gt; {
        await expect(this.page).toHaveURL(pattern);
    }

    // ---- Screenshots ----
    async screenshot(name: string): Promise&lt;void&gt; {
        await this.page.screenshot({ path: \`reports/screenshots/\${name}.png\`, fullPage: true });
    }
}</code></pre>
</div>
</div>

        <h3>Paso 4: Builders y Factory</h3>

        <div class="code-tabs" data-code-id="L123-3">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># builders/user_builder.py
from dataclasses import dataclass
import random, string

@dataclass
class User:
    email: str = ""
    password: str = ""
    first_name: str = ""
    last_name: str = ""
    role: str = "user"

class UserBuilder:
    def __init__(self):
        uid = ''.join(random.choices(string.ascii_lowercase, k=6))
        self._user = User(
            email=f"test_{uid}@siesa.com",
            password="Test1234!",
            first_name="Test", last_name="User", role="user"
        )
    def with_email(self, e): self._user.email = e; return self
    def with_name(self, f, l): self._user.first_name = f; self._user.last_name = l; return self
    def as_admin(self): self._user.role = "admin"; return self
    def build(self): return self._user</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// builders/user-builder.ts

// Interfaz para datos de usuario
interface User {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
}

// Genera un UID aleatorio de longitud dada
function randomUid(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    return Array.from({ length }, () =&gt; chars[Math.floor(Math.random() * chars.length)]).join('');
}

export class UserBuilder {
    private user: User;

    constructor() {
        const uid = randomUid(6);
        this.user = {
            email: \`test_\${uid}@siesa.com\`,
            password: 'Test1234!',
            firstName: 'Test',
            lastName: 'User',
            role: 'user',
        };
    }

    withEmail(e: string): this { this.user.email = e; return this; }
    withName(f: string, l: string): this { this.user.firstName = f; this.user.lastName = l; return this; }
    asAdmin(): this { this.user.role = 'admin'; return this; }
    build(): User { return { ...this.user }; }
}</code></pre>
</div>
</div>

        <div class="code-tabs" data-code-id="L123-4">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># factories/page_factory.py
from pages.auth.login_page import LoginPage
from pages.dashboard.dashboard_page import DashboardPage
from pages.inventory.products_page import ProductsPage
from pages.orders.orders_page import OrdersPage

class PageFactory:
    def __init__(self, page):
        self.page = page
    def login(self): return LoginPage(self.page)
    def dashboard(self): return DashboardPage(self.page)
    def products(self): return ProductsPage(self.page)
    def orders(self): return OrdersPage(self.page)
    def login_as(self, user, pwd):
        lp = self.login()
        lp.navigate()
        return lp.login_and_wait(user, pwd)</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// factories/page-factory.ts
import { Page } from '@playwright/test';
import { LoginPage } from '../pages/auth/login-page';
import { DashboardPage } from '../pages/dashboard/dashboard-page';
import { ProductsPage } from '../pages/inventory/products-page';
import { OrdersPage } from '../pages/orders/orders-page';

export class PageFactory {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    login(): LoginPage { return new LoginPage(this.page); }
    dashboard(): DashboardPage { return new DashboardPage(this.page); }
    products(): ProductsPage { return new ProductsPage(this.page); }
    orders(): OrdersPage { return new OrdersPage(this.page); }

    async loginAs(user: string, pwd: string): Promise&lt;DashboardPage&gt; {
        const lp = this.login();
        await lp.navigate();
        return await lp.loginAndWait(user, pwd);
    }
}</code></pre>
</div>
</div>

        <h3>Paso 5: Plugin personalizado</h3>

        <div class="code-tabs" data-code-id="L123-5">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># plugins/pytest_performance.py
"""Plugin que mide y reporta tiempos de ejecucion de tests."""
import pytest
import time
import json
import os

class PerformancePlugin:
    def __init__(self):
        self.timings = []

    @pytest.hookimpl(hookwrapper=True)
    def pytest_runtest_call(self, item):
        start = time.time()
        outcome = yield
        duration = (time.time() - start) * 1000  # ms
        self.timings.append({
            "test": item.nodeid,
            "duration_ms": round(duration, 1),
            "passed": not outcome.excinfo
        })

    def pytest_terminal_summary(self, terminalreporter):
        if not self.timings:
            return

        terminalreporter.write_sep("=", "PERFORMANCE REPORT")

        # Top 10 tests mas lentos
        sorted_tests = sorted(self.timings, key=lambda x: x["duration_ms"], reverse=True)
        terminalreporter.write_line("Top 10 tests mas lentos:")
        for t in sorted_tests[:10]:
            status = "PASS" if t["passed"] else "FAIL"
            terminalreporter.write_line(
                f"  {t['duration_ms']:>8.1f}ms [{status}] {t['test']}"
            )

        # Guardar JSON
        os.makedirs("reports", exist_ok=True)
        with open("reports/test-timings.json", "w") as f:
            json.dump(self.timings, f, indent=2)

def pytest_configure(config):
    config.pluginmanager.register(PerformancePlugin(), "performance-plugin")</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// plugins/performance-reporter.ts
// Reporter personalizado que mide y reporta tiempos de ejecucion de tests
import type { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

interface TestTiming {
    test: string;
    durationMs: number;
    passed: boolean;
}

class PerformanceReporter implements Reporter {
    private timings: TestTiming[] = [];

    onTestEnd(test: TestCase, result: TestResult): void {
        this.timings.push({
            test: test.titlePath().join(' &gt; '),
            durationMs: Math.round(result.duration * 10) / 10,
            passed: result.status === 'passed',
        });
    }

    onEnd(result: FullResult): void {
        if (this.timings.length === 0) return;

        console.log('='.repeat(60));
        console.log('PERFORMANCE REPORT');
        console.log('='.repeat(60));

        // Top 10 tests mas lentos
        const sorted = [...this.timings].sort((a, b) =&gt; b.durationMs - a.durationMs);
        console.log('Top 10 tests mas lentos:');
        for (const t of sorted.slice(0, 10)) {
            const status = t.passed ? 'PASS' : 'FAIL';
            console.log(\`  \${String(t.durationMs).padStart(8)}ms [\${status}] \${t.test}\`);
        }

        // Guardar JSON
        const reportsDir = path.join(process.cwd(), 'reports');
        fs.mkdirSync(reportsDir, { recursive: true });
        fs.writeFileSync(
            path.join(reportsDir, 'test-timings.json'),
            JSON.stringify(this.timings, null, 2)
        );
    }
}

export default PerformanceReporter;</code></pre>
</div>
</div>

        <h3>Paso 6: Tests de ejemplo usando todo el framework</h3>

        <div class="code-tabs" data-code-id="L123-6">
<div class="code-tabs-header">
    <button class="code-tab active" data-lang="python" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F40D;</span> Python
    </button>
    <button class="code-tab" data-lang="typescript" onclick="window.PWAcademy.switchTab(this)">
        <span class="code-tab-icon">&#x1F537;</span> TypeScript
    </button>
    <button class="code-copy-btn" onclick="window.PWAcademy.copyCode(this)" title="Copiar codigo">&#x1F4CB;</button>
</div>
<div class="code-panel active" data-lang="python">
<pre><code class="language-python"># tests/smoke/test_login.py
"""Smoke tests de login usando el framework enterprise."""
from builders.user_builder import UserBuilder
from playwright.sync_api import expect

def test_admin_login_successful(pages):
    # ARRANGE
    dashboard = pages.login_as("admin@siesa.com", "Admin1234!")

    # ACT (ya en dashboard)
    welcome = dashboard.get_welcome_message()

    # ASSERT
    assert "admin" in welcome.lower()
    dashboard.should_have_url("**/dashboard")

def test_invalid_credentials_shows_error(pages):
    # ARRANGE
    login_page = pages.login()
    login_page.navigate()

    # ACT
    login_page.login("invalid@test.com", "wrongpass")

    # ASSERT
    login_page.should_show_error("Credenciales invalidas")
    login_page.should_have_url("**/login")</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// tests/smoke/login.spec.ts
// Smoke tests de login usando el framework enterprise
import { test, expect } from '@playwright/test';
import { PageFactory } from '../../factories/page-factory';

// Fixture personalizada con PageFactory
const testWithPages = test.extend&lt;{ pages: PageFactory }&gt;({
    pages: async ({ page }, use) =&gt; {
        await use(new PageFactory(page));
    },
});

testWithPages('admin login exitoso', async ({ pages }) =&gt; {
    // ARRANGE
    const dashboard = await pages.loginAs('admin@siesa.com', 'Admin1234!');

    // ACT (ya en dashboard)
    const welcome = await dashboard.getWelcomeMessage();

    // ASSERT
    expect(welcome.toLowerCase()).toContain('admin');
    await dashboard.shouldHaveUrl('**/dashboard');
});

testWithPages('credenciales invalidas muestra error', async ({ pages }) =&gt; {
    // ARRANGE
    const loginPage = pages.login();
    await loginPage.navigate();

    // ACT
    await loginPage.login('invalid@test.com', 'wrongpass');

    // ASSERT
    await loginPage.shouldShowError('Credenciales invalidas');
    await loginPage.shouldHaveUrl('**/login');
});</code></pre>
</div>
</div>

        <h3>Criterios de evaluacion</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Criterio</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Puntos</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Detalle</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Estructura de directorios</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">10</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Separacion en capas correcta</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">BasePage + 4 Page Objects</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">20</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Herencia, 10+ metodos base</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Settings multi-entorno</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">10</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">local, staging, production</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Builder + Factory</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">15</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">UserBuilder fluido, PageFactory</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Plugin personalizado</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">10</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Plugin funcional con hooks</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Tests (smoke + regression)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">20</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Minimo 6 tests usando AAA</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Performance baselines</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">10</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Metricas + deteccion regresion</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">pyproject.toml + Makefile</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">5</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Config completa</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>TOTAL</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>100</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Minimo: 70</strong></td>
                </tr>
            </table>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Ejercicio Final</h4>
            <p>Construye el framework completo siguiendo la estructura y ejemplos anteriores.
            Verifica que puedes ejecutar:</p>
            <ul>
                <li><code>make test</code> — ejecuta todos los tests</li>
                <li><code>make smoke</code> — ejecuta solo smoke tests</li>
                <li><code>make lint</code> — verifica calidad del codigo</li>
                <li><code>pytest tests/ -n 2</code> — ejecucion paralela</li>
            </ul>
        </div>

        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Felicidades!</strong> Has completado la <strong>Seccion 18: Arquitecturas y
            Patrones Enterprise</strong>. En la siguiente seccion exploraras <strong>Best Practices
            y Patrones</strong> para escribir tests mantenibles y estables a largo plazo.</p>
        </div>
    `,
    topics: ["proyecto", "framework", "enterprise"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 15,
    difficulty: "hard",
    type: "capstone"
};

if (typeof window !== 'undefined') {
    window.LESSON_123 = LESSON_123;
}
