/**
 * Playwright Academy - Leccion 118
 * Multi-proyecto y monorepo
 * Seccion 18: Arquitecturas y Patrones Enterprise
 */

const LESSON_118 = {
    id: 118,
    title: "Multi-proyecto y monorepo",
    duration: "7 min",
    level: "advanced",
    section: "section-18",
    content: `
        <h2>Multi-proyecto y monorepo</h2>
        <p>En organizaciones enterprise es comun tener multiples aplicaciones o microservicios
        que necesitan testing automatizado. La estrategia de <strong>monorepo</strong> — un unico
        repositorio que contiene los tests de todos los proyectos — ofrece ventajas significativas
        en compartir codigo, mantener consistencia y simplificar CI/CD. En esta leccion aprenderas
        a estructurar un monorepo de tests con Playwright para multiples proyectos.</p>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>En SIESA, el equipo de QA mantiene un monorepo de testing que cubre los modulos
            de Nomina, Contabilidad, Inventarios y CRM del ERP. Compartir Page Objects base,
            fixtures de autenticacion y utilidades entre modulos ha reducido la duplicacion
            de codigo en un 40% y el tiempo de onboarding de nuevos QAs de 2 semanas a 3 dias.</p>
        </div>

        <h3>Monorepo vs Multi-repo</h3>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Aspecto</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Monorepo</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Multi-repo</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Codigo compartido</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Directo (imports locales)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Via paquetes/submodulos</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Consistencia</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Alta (mismas versiones)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Requiere sincronizacion</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">CI/CD</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Pipeline unico, ejecucion selectiva</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Pipelines independientes</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Escalabilidad</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Puede crecer demasiado</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Natural por repositorio</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Autonomia</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Menor (cambios afectan a todos)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Alta (equipos independientes)</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Mejor para</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">1 equipo QA, multiples apps</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Equipos QA independientes</td>
                </tr>
            </table>
        </div>

        <h3>Estructura de monorepo para testing</h3>

        <pre><code class="text">qa-automation-monorepo/
├── shared/                        # Codigo compartido entre proyectos
│   ├── __init__.py
│   ├── pages/
│   │   ├── __init__.py
│   │   ├── base_page.py           # BasePage universal
│   │   └── components/
│   │       ├── navbar.py           # Navbar comun (SSO)
│   │       ├── data_table.py       # Tabla de datos reutilizable
│   │       └── modal.py            # Modal generico
│   ├── services/
│   │   ├── __init__.py
│   │   ├── api_client.py          # Cliente API base
│   │   └── auth_service.py        # Autenticacion SSO
│   ├── fixtures/
│   │   ├── __init__.py
│   │   ├── auth_fixtures.py       # Login compartido
│   │   └── browser_fixtures.py    # Config de browser
│   ├── utils/
│   │   ├── helpers.py
│   │   └── decorators.py
│   └── config/
│       ├── settings.py
│       └── environments.yaml
├── projects/
│   ├── erp-nomina/                # Proyecto: Modulo Nomina
│   │   ├── pages/
│   │   │   ├── __init__.py
│   │   │   ├── payroll_page.py
│   │   │   └── employee_page.py
│   │   ├── tests/
│   │   │   ├── conftest.py        # Fixtures locales + imports shared
│   │   │   ├── test_payroll.py
│   │   │   └── test_employees.py
│   │   └── data/
│   │       └── test_employees.json
│   ├── erp-inventarios/           # Proyecto: Modulo Inventarios
│   │   ├── pages/
│   │   │   ├── products_page.py
│   │   │   └── warehouse_page.py
│   │   ├── tests/
│   │   │   ├── conftest.py
│   │   │   ├── test_products.py
│   │   │   └── test_warehouse.py
│   │   └── data/
│   │       └── test_products.csv
│   └── erp-contabilidad/          # Proyecto: Modulo Contabilidad
│       ├── pages/
│       ├── tests/
│       └── data/
├── pyproject.toml                 # Config global
├── requirements.txt               # Dependencias unificadas
├── Makefile                       # Comandos por proyecto
└── .github/workflows/
    └── playwright.yml             # CI con ejecucion selectiva</code></pre>

        <h3>Configuracion de imports compartidos</h3>

        <div class="code-tabs" data-code-id="L118-1">
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
<pre><code class="language-python"># pyproject.toml - Configurar Python path para imports
[tool.pytest.ini_options]
pythonpath = ["."]  # Permite imports desde la raiz
testpaths = ["projects"]
python_files = ["test_*.py"]

# Esto permite hacer imports como:
# from shared.pages.base_page import BasePage
# from shared.services.auth_service import AuthService
# from shared.fixtures.auth_fixtures import *</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// playwright.config.ts - Configurar proyectos para imports
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Permite ejecutar tests por proyecto
  testDir: './projects',
  testMatch: '**/*.spec.ts',

  // Esto permite hacer imports como:
  // import { BasePage } from '../../shared/pages/base-page';
  // import { AuthService } from '../../shared/services/auth-service';
  // import { authFixtures } from '../../shared/fixtures/auth-fixtures';

  // tsconfig.json con paths simplifica los imports:
  // "paths": {
  //   "@shared/*": ["shared/*"],
  //   "@nomina/*": ["projects/erp-nomina/*"]
  // }
});</code></pre>
</div>
</div>

        <div class="code-tabs" data-code-id="L118-2">
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
<pre><code class="language-python"># projects/erp-nomina/tests/conftest.py
"""Conftest del proyecto Nomina - importa shared + fixtures locales."""

# Importar fixtures compartidos
from shared.fixtures.auth_fixtures import *
from shared.fixtures.browser_fixtures import *

# Fixtures locales del proyecto
import pytest

@pytest.fixture
def payroll_page(authenticated_page):
    """Pagina de nomina ya autenticada."""
    from projects.erp_nomina.pages.payroll_page import PayrollPage
    page = PayrollPage(authenticated_page)
    page.navigate()
    return page

@pytest.fixture
def test_employees():
    """Datos de empleados para testing."""
    import json
    from pathlib import Path
    data_file = Path(__file__).parent.parent / "data" / "test_employees.json"
    return json.loads(data_file.read_text())</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// projects/erp-nomina/tests/fixtures.ts
// Fixtures del proyecto Nomina - importa shared + fixtures locales

import { test as base, expect } from '@playwright/test';
import { authFixtures } from '../../../shared/fixtures/auth-fixtures';
import { PayrollPage } from '../pages/payroll-page';
import * as fs from 'fs';
import * as path from 'path';

// Extender fixtures base con autenticacion compartida
const test = authFixtures.extend<{
  payrollPage: PayrollPage;
  testEmployees: Record<string, unknown>[];
}>({
  // Fixture local: pagina de nomina ya autenticada
  payrollPage: async ({ authenticatedPage }, use) => {
    const payrollPage = new PayrollPage(authenticatedPage);
    await payrollPage.navigate();
    await use(payrollPage);
  },

  // Fixture local: datos de empleados para testing
  testEmployees: async ({}, use) => {
    const dataFile = path.join(__dirname, '..', 'data', 'test_employees.json');
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    await use(data);
  },
});

export { test, expect };</code></pre>
</div>
</div>

        <h3>Ejecucion selectiva por proyecto</h3>

        <div class="code-tabs" data-code-id="L118-3">
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
<pre><code class="language-python"># Ejecutar solo un proyecto
# pytest projects/erp-nomina/tests/ -v

# Ejecutar todos los proyectos
# pytest projects/ -v

# Ejecutar smoke tests de todos los proyectos
# pytest projects/ -m smoke -v

# Ejecutar por marcador de proyecto
# pytest projects/ -m nomina -v</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// Ejecutar solo un proyecto
// npx playwright test --project=erp-nomina

// Ejecutar todos los proyectos
// npx playwright test

// Ejecutar smoke tests de todos los proyectos
// npx playwright test --grep @smoke

// Ejecutar por tag de proyecto
// npx playwright test --grep @nomina

// Alternativa: usar config con proyectos definidos
// playwright.config.ts:
// projects: [
//   { name: 'erp-nomina', testDir: './projects/erp-nomina/tests' },
//   { name: 'erp-inventarios', testDir: './projects/erp-inventarios/tests' },
//   { name: 'erp-contabilidad', testDir: './projects/erp-contabilidad/tests' },
// ]</code></pre>
</div>
</div>

        <pre><code class="makefile"># Makefile - Comandos por proyecto
.PHONY: test-all test-nomina test-inventarios test-contabilidad

test-all:
	pytest projects/ -v --tb=short

test-nomina:
	pytest projects/erp-nomina/tests/ -v --tb=short

test-inventarios:
	pytest projects/erp-inventarios/tests/ -v --tb=short

test-contabilidad:
	pytest projects/erp-contabilidad/tests/ -v --tb=short

# Tests por tipo (cross-project)
smoke:
	pytest projects/ -m smoke -v --tb=short

regression:
	pytest projects/ -m regression -v --reruns 2</code></pre>

        <h3>CI/CD: Ejecucion selectiva por cambios</h3>
        <p>En un monorepo, no quieres ejecutar TODOS los tests cuando solo cambio un proyecto.
        Usa deteccion de cambios para ejecutar selectivamente:</p>

        <pre><code class="yaml"># .github/workflows/playwright.yml
name: Playwright Monorepo Tests

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      shared: \${{ steps.changes.outputs.shared }}
      nomina: \${{ steps.changes.outputs.nomina }}
      inventarios: \${{ steps.changes.outputs.inventarios }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v3
        id: changes
        with:
          filters: |
            shared:
              - 'shared/**'
            nomina:
              - 'projects/erp-nomina/**'
            inventarios:
              - 'projects/erp-inventarios/**'

  test-nomina:
    needs: detect-changes
    if: needs.detect-changes.outputs.nomina == 'true' || needs.detect-changes.outputs.shared == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt && playwright install chromium
      - run: pytest projects/erp-nomina/tests/ -v --junitxml=reports/nomina.xml

  test-inventarios:
    needs: detect-changes
    if: needs.detect-changes.outputs.inventarios == 'true' || needs.detect-changes.outputs.shared == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt && playwright install chromium
      - run: pytest projects/erp-inventarios/tests/ -v --junitxml=reports/inventarios.xml</code></pre>

        <div style="background: #fce4ec; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Importante: Cambios en shared/</h4>
            <p>Cuando se modifica codigo en <code>shared/</code>, TODOS los proyectos deben re-ejecutar
            sus tests, ya que el codigo compartido afecta a todos. Esto es una ventaja (deteccion temprana
            de regresiones) y una responsabilidad (mantener shared/ estable y bien testeado).</p>
        </div>

        <h3>Paquete compartido como libreria interna</h3>
        <p>Para monorepos mas grandes, puedes empaquetar <code>shared/</code> como un paquete instalable:</p>

        <div class="code-tabs" data-code-id="L118-4">
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
<pre><code class="language-python"># shared/setup.py (o shared/pyproject.toml)
from setuptools import setup, find_packages

setup(
    name="qa-shared",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "playwright>=1.42.0",
        "pytest>=8.0.0",
    ],
)

# Instalar en modo editable:
# pip install -e shared/

# Ahora puedes importar desde cualquier proyecto:
# from qa_shared.pages.base_page import BasePage</code></pre>
</div>
<div class="code-panel" data-lang="typescript">
<pre><code class="language-typescript">// shared/package.json - Paquete compartido como libreria interna
// {
//   "name": "@qa/shared",
//   "version": "1.0.0",
//   "main": "index.ts",
//   "dependencies": {
//     "@playwright/test": ">=1.42.0"
//   }
// }

// tsconfig.json - Configurar paths para imports limpios
// {
//   "compilerOptions": {
//     "baseUrl": ".",
//     "paths": {
//       "@shared/*": ["shared/*"],
//       "@nomina/*": ["projects/erp-nomina/*"],
//       "@inventarios/*": ["projects/erp-inventarios/*"]
//     }
//   }
// }

// Ahora puedes importar desde cualquier proyecto:
// import { BasePage } from '@shared/pages/base-page';

// Alternativa con npm workspaces (package.json raiz):
// {
//   "workspaces": ["shared", "projects/*"]
// }
// npm install  # vincula automaticamente los paquetes locales</code></pre>
</div>
</div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Ejercicio Practico</h4>
            <p>Configura un monorepo de testing para 2 aplicaciones:</p>
            <ol>
                <li>Crea la estructura de directorios con <code>shared/</code> y 2 proyectos</li>
                <li>Implementa <code>BasePage</code> en shared/ y usala en ambos proyectos</li>
                <li>Crea fixtures compartidos de autenticacion</li>
                <li>Configura <code>pyproject.toml</code> con pythonpath para imports</li>
                <li>Crea un Makefile con comandos para cada proyecto y para todos</li>
                <li>Configura CI con deteccion de cambios para ejecucion selectiva</li>
            </ol>
        </div>

        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>En la siguiente leccion</strong> exploraras los <strong>plugins y extensiones
            de pytest</strong>, aprendiendo a extender las capacidades de tu framework con plugins
            existentes y a crear tus propios plugins personalizados.</p>
        </div>
    `,
    topics: ["multi-proyecto", "monorepo", "organización"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_118 = LESSON_118;
}
