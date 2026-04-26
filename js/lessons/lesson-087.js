/**
 * Playwright Academy - Lección 087
 * Proyecto: Suite data-driven completa
 * Sección 12: Data-Driven Testing
 */

const LESSON_087 = {
    id: 87,
    title: "Proyecto: Suite data-driven completa",
    duration: "10 min",
    level: "intermediate",
    section: "section-12",
    content: `
        <h2>🏆 Proyecto: Suite data-driven completa</h2>
        <p>En este proyecto construiremos una suite de tests data-driven para un sistema
        de facturación electrónica, combinando datos desde archivos externos, parametrize,
        fixtures parametrizadas y matrices de prueba.</p>

        <h3>🎯 Sistema: Facturación Electrónica</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Flujos a automatizar con data-driven testing:</p>
            <ul>
                <li><strong>Crear factura:</strong> Diferentes tipos (venta, servicio, exportación)</li>
                <li><strong>Calcular impuestos:</strong> IVA 19%, IVA 5%, exento, según producto</li>
                <li><strong>Validar campos:</strong> NIT, email, teléfono con múltiples inputs</li>
                <li><strong>Clientes:</strong> Persona natural, jurídica, internacional</li>
                <li><strong>Cross-browser:</strong> Chrome + Firefox para flujos críticos</li>
            </ul>
        </div>

        <h3>📁 Estructura del proyecto</h3>
        <pre><code class="text">facturacion-tests/
├── test-data/
│   ├── invoices.json           # Escenarios de factura
│   ├── tax_calculations.csv    # Datos de cálculo de impuestos
│   ├── validation_rules.json   # Datos de validación
│   └── clients.csv             # Tipos de cliente
├── utils/
│   ├── data_loader.py          # Cargador de datos
│   └── invoice_helper.py       # Helper de facturación
├── pages/
│   ├── invoice_form_page.py
│   └── invoice_list_page.py
├── tests/
│   ├── conftest.py
│   ├── test_create_invoice.py  # Parametrizado por tipo
│   ├── test_tax_calculation.py # Parametrizado desde CSV
│   ├── test_validation.py      # Parametrizado desde JSON
│   └── test_cross_browser.py   # Fixtures parametrizadas
└── pytest.ini</code></pre>

        <h3>📦 1. Archivos de datos</h3>
        <div class="code-tabs" data-code-id="L087-1">
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
            <pre><code class="language-python"># test-data/tax_calculations.csv
# producto,precio,tipo_iva,iva_esperado,total_esperado
# Laptop,2500000,19,475000,2975000
# Arroz 5kg,25000,5,1250,26250
# Libro educativo,45000,0,0,45000
# Consultoría,1000000,19,190000,1190000
# Leche 1L,4500,5,225,4725
# Exportación café,5000000,0,0,5000000

# test-data/invoices.json
# [
#   {
#     "id": "venta-standard",
#     "tipo": "Venta",
#     "cliente": {"nit": "900123456-7", "nombre": "Empresa Test SAS"},
#     "items": [
#       {"producto": "Laptop", "cantidad": 2, "precio": 2500000}
#     ],
#     "expected_total": 5950000
#   },
#   {
#     "id": "servicio-consultoria",
#     "tipo": "Servicio",
#     "cliente": {"nit": "800987654-3", "nombre": "Consultoría ABC"},
#     "items": [
#       {"producto": "Consultoría", "cantidad": 10, "precio": 500000}
#     ],
#     "expected_total": 5950000
#   }
# ]

# test-data/validation_rules.json
# {
#   "nit": [
#     {"input": "900123456-7", "valid": true},
#     {"input": "900123456", "valid": false, "error": "Falta dígito de verificación"},
#     {"input": "abc", "valid": false, "error": "NIT debe ser numérico"},
#     {"input": "", "valid": false, "error": "NIT es requerido"}
#   ],
#   "email": [
#     {"input": "factura@empresa.com", "valid": true},
#     {"input": "sin-arroba", "valid": false, "error": "Email inválido"},
#     {"input": "", "valid": false, "error": "Email es requerido"}
#   ]
# }</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// test-data/tax_calculations.csv
// producto,precio,tipo_iva,iva_esperado,total_esperado
// Laptop,2500000,19,475000,2975000
// Arroz 5kg,25000,5,1250,26250
// Libro educativo,45000,0,0,45000
// Consultoría,1000000,19,190000,1190000
// Leche 1L,4500,5,225,4725
// Exportación café,5000000,0,0,5000000

// test-data/invoices.json
// [
//   {
//     "id": "venta-standard",
//     "tipo": "Venta",
//     "cliente": {"nit": "900123456-7", "nombre": "Empresa Test SAS"},
//     "items": [
//       {"producto": "Laptop", "cantidad": 2, "precio": 2500000}
//     ],
//     "expected_total": 5950000
//   },
//   {
//     "id": "servicio-consultoria",
//     "tipo": "Servicio",
//     "cliente": {"nit": "800987654-3", "nombre": "Consultoría ABC"},
//     "items": [
//       {"producto": "Consultoría", "cantidad": 10, "precio": 500000}
//     ],
//     "expected_total": 5950000
//   }
// ]

// test-data/validation_rules.json
// {
//   "nit": [
//     {"input": "900123456-7", "valid": true},
//     {"input": "900123456", "valid": false, "error": "Falta dígito de verificación"},
//     {"input": "abc", "valid": false, "error": "NIT debe ser numérico"},
//     {"input": "", "valid": false, "error": "NIT es requerido"}
//   ],
//   "email": [
//     {"input": "factura@empresa.com", "valid": true},
//     {"input": "sin-arroba", "valid": false, "error": "Email inválido"},
//     {"input": "", "valid": false, "error": "Email es requerido"}
//   ]
// }</code></pre>
        </div>
        </div>

        <h3>⚙️ 2. Data Loader y Fixtures</h3>
        <div class="code-tabs" data-code-id="L087-2">
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
import pytest
import csv
import json
from pathlib import Path

DATA_DIR = Path("test-data")

def load_csv_data(filename):
    with open(DATA_DIR / filename, encoding="utf-8") as f:
        return list(csv.DictReader(f))

def load_json_data(filename):
    with open(DATA_DIR / filename, encoding="utf-8") as f:
        return json.load(f)

# ── Datos cargados una vez ──
TAX_DATA = load_csv_data("tax_calculations.csv")
INVOICE_SCENARIOS = load_json_data("invoices.json")
VALIDATION_RULES = load_json_data("validation_rules.json")

# ── Fixtures parametrizadas ──
@pytest.fixture(params=["chromium", "firefox"], ids=["chrome", "firefox"])
def cross_browser_page(request, playwright):
    browser = getattr(playwright, request.param).launch()
    context = browser.new_context()
    page = context.new_page()
    # Login
    page.goto("https://facturacion.com/login")
    page.fill("#email", "admin@test.com")
    page.fill("#password", "admin123")
    page.click("#login-btn")
    page.wait_for_url("**/dashboard")
    yield page
    context.close()
    browser.close()</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// tests/global-setup.ts
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const DATA_DIR = path.join(__dirname, '..', 'test-data');

export function loadCsvData(filename: string): Record&lt;string, string&gt;[] {
    const content = fs.readFileSync(
        path.join(DATA_DIR, filename), 'utf-8'
    );
    return parse(content, { columns: true, skip_empty_lines: true });
}

export function loadJsonData&lt;T = unknown&gt;(filename: string): T {
    const content = fs.readFileSync(
        path.join(DATA_DIR, filename), 'utf-8'
    );
    return JSON.parse(content) as T;
}

// ── Datos cargados una vez ──
export const TAX_DATA = loadCsvData('tax_calculations.csv');
export const INVOICE_SCENARIOS = loadJsonData&lt;InvoiceScenario[]&gt;('invoices.json');
export const VALIDATION_RULES = loadJsonData&lt;ValidationRules&gt;('validation_rules.json');

// ── Fixture parametrizada: cross-browser ──
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    projects: [
        { name: 'chrome', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    ],
    use: {
        baseURL: 'https://facturacion.com',
    },
});

// tests/auth.setup.ts — login compartido
import { test as setup, expect } from '@playwright/test';

setup('login', async ({ page }) => {
    await page.goto('https://facturacion.com/login');
    await page.fill('#email', 'admin@test.com');
    await page.fill('#password', 'admin123');
    await page.click('#login-btn');
    await page.waitForURL('**/dashboard');
    await page.context().storageState({ path: '.auth/state.json' });
});</code></pre>
        </div>
        </div>

        <h3>🧪 3. Tests de cálculo de impuestos (CSV)</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L087-3">
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
                <pre><code class="language-python"># tests/test_tax_calculation.py
import pytest
from playwright.sync_api import expect

@pytest.mark.parametrize("data", TAX_DATA,
    ids=[d["producto"] for d in TAX_DATA])
def test_calculo_iva(page, data):
    """Verificar cálculo de IVA para diferentes productos."""
    page.goto("https://facturacion.com/invoices/new")

    # Agregar item
    page.fill("[data-testid='item-name']", data["producto"])
    page.fill("[data-testid='item-price']", data["precio"])
    page.fill("[data-testid='item-qty']", "1")
    page.select_option("[data-testid='tax-type']",
                       label=f"IVA {data['tipo_iva']}%")
    page.click("[data-testid='add-item']")

    # Verificar cálculos
    expected_iva = float(data["iva_esperado"])
    expected_total = float(data["total_esperado"])

    iva_text = page.locator("[data-testid='total-iva']").text_content()
    total_text = page.locator("[data-testid='grand-total']").text_content()

    # Parsear moneda ($2,500,000)
    import re
    def parse_money(text):
        return float(re.sub(r'[^\\d.]', '', text.replace(",", "")))

    assert parse_money(iva_text) == expected_iva
    assert parse_money(total_text) == expected_total</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">// tests/test-tax-calculation.spec.ts
import { test, expect } from '@playwright/test';
import { TAX_DATA } from './global-setup';

for (const data of TAX_DATA) {
    test(\`cálculo IVA - \${data.producto}\`, async ({ page }) => {
        // Verificar cálculo de IVA para diferentes productos
        await page.goto('https://facturacion.com/invoices/new');

        // Agregar item
        await page.fill('[data-testid="item-name"]', data.producto);
        await page.fill('[data-testid="item-price"]', data.precio);
        await page.fill('[data-testid="item-qty"]', '1');
        await page.selectOption('[data-testid="tax-type"]',
            { label: \`IVA \${data.tipo_iva}%\` });
        await page.click('[data-testid="add-item"]');

        // Verificar cálculos
        const expectedIva = parseFloat(data.iva_esperado);
        const expectedTotal = parseFloat(data.total_esperado);

        const ivaText = await page.locator(
            '[data-testid="total-iva"]'
        ).textContent();
        const totalText = await page.locator(
            '[data-testid="grand-total"]'
        ).textContent();

        // Parsear moneda ($2,500,000)
        const parseMoney = (text: string | null): number =>
            parseFloat((text ?? '').replace(/[^\\d.]/g, ''));

        expect(parseMoney(ivaText)).toBe(expectedIva);
        expect(parseMoney(totalText)).toBe(expectedTotal);
    });
}</code></pre>
            </div>
            </div>
        </div>

        <h3>🧪 4. Tests de escenarios de factura (JSON)</h3>
        <pre><code class="python"># tests/test_create_invoice.py

@pytest.mark.parametrize("scenario", INVOICE_SCENARIOS,
    ids=[s["id"] for s in INVOICE_SCENARIOS])
def test_crear_factura(page, scenario):
    """Crear factura según escenario definido en JSON."""
    page.goto("https://facturacion.com/invoices/new")

    # Tipo de factura
    page.select_option("#invoice-type", label=scenario["tipo"])

    # Datos del cliente
    page.fill("#client-nit", scenario["cliente"]["nit"])
    page.fill("#client-name", scenario["cliente"]["nombre"])

    # Agregar items
    for item in scenario["items"]:
        page.fill("[data-testid='item-name']", item["producto"])
        page.fill("[data-testid='item-qty']", str(item["cantidad"]))
        page.fill("[data-testid='item-price']", str(item["precio"]))
        page.click("[data-testid='add-item']")

    # Guardar
    page.click("[data-testid='save-invoice']")
    expect(page.locator(".toast-success")).to_be_visible()

    # Verificar total
    import re
    total_text = page.locator("[data-testid='grand-total']").text_content()
    total = float(re.sub(r'[^\\d.]', '', total_text.replace(",", "")))
    assert total == scenario["expected_total"]</code></pre>

        <h3>🧪 5. Tests de validación (JSON con reglas)</h3>
        <pre><code class="python"># tests/test_validation.py

# Generar tests parametrizados para cada campo de validación
nit_rules = VALIDATION_RULES["nit"]
email_rules = VALIDATION_RULES["email"]

@pytest.mark.parametrize("rule", nit_rules,
    ids=[r["input"] or "empty" for r in nit_rules])
def test_validacion_nit(page, rule):
    """Validar campo NIT con múltiples inputs."""
    page.goto("https://facturacion.com/invoices/new")
    page.fill("#client-nit", rule["input"])
    page.press("#client-nit", "Tab")  # Trigger validación

    error_locator = page.locator("#nit-error")
    if rule["valid"]:
        expect(error_locator).to_be_hidden()
    else:
        expect(error_locator).to_be_visible()
        expect(error_locator).to_contain_text(rule["error"])


@pytest.mark.parametrize("rule", email_rules,
    ids=[r["input"] or "empty" for r in email_rules])
def test_validacion_email(page, rule):
    """Validar campo email con múltiples inputs."""
    page.goto("https://facturacion.com/invoices/new")
    page.fill("#client-email", rule["input"])
    page.press("#client-email", "Tab")

    error_locator = page.locator("#email-error")
    if rule["valid"]:
        expect(error_locator).to_be_hidden()
    else:
        expect(error_locator).to_be_visible()
        expect(error_locator).to_contain_text(rule["error"])</code></pre>

        <h3>🧪 6. Tests cross-browser</h3>
        <pre><code class="python"># tests/test_cross_browser.py

def test_factura_carga_en_multiples_browsers(cross_browser_page):
    """Verificar que el formulario de factura funciona en Chrome y Firefox."""
    page = cross_browser_page
    page.goto("https://facturacion.com/invoices/new")

    expect(page.locator("#invoice-form")).to_be_visible()
    expect(page.locator("#client-nit")).to_be_editable()
    expect(page.locator("[data-testid='save-invoice']")).to_be_enabled()

def test_lista_facturas_cross_browser(cross_browser_page):
    """Verificar lista de facturas en ambos browsers."""
    page = cross_browser_page
    page.goto("https://facturacion.com/invoices")

    expect(page.locator("table.invoices")).to_be_visible()
    expect(page.locator("tr.invoice-row")).not_to_have_count(0)</code></pre>

        <h3>📊 Resumen de la suite</h3>
        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #283593; color: white;">
                        <th style="padding: 10px;">Test file</th>
                        <th style="padding: 10px;">Fuente de datos</th>
                        <th style="padding: 10px;">Tests generados</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #e8eaf6;">
                        <td style="padding: 8px;">test_tax_calculation.py</td>
                        <td style="padding: 8px;">CSV (6 filas)</td>
                        <td style="padding: 8px;">6 tests</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">test_create_invoice.py</td>
                        <td style="padding: 8px;">JSON (escenarios)</td>
                        <td style="padding: 8px;">~4 tests</td>
                    </tr>
                    <tr style="background: #e8eaf6;">
                        <td style="padding: 8px;">test_validation.py</td>
                        <td style="padding: 8px;">JSON (reglas)</td>
                        <td style="padding: 8px;">~7 tests</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">test_cross_browser.py</td>
                        <td style="padding: 8px;">Fixture params</td>
                        <td style="padding: 8px;">4 tests (2×2)</td>
                    </tr>
                    <tr style="background: #e8eaf6;">
                        <td style="padding: 8px;"><strong>Total</strong></td>
                        <td style="padding: 8px;"></td>
                        <td style="padding: 8px;"><strong>~21 tests</strong></td>
                    </tr>
                </tbody>
            </table>
            <p style="margin-top: 10px;">Para agregar más escenarios, solo hay que editar los
            archivos CSV/JSON. <strong>Cero cambios en código.</strong></p>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip SIESA:</strong> En facturación electrónica, los cálculos de
            impuestos son críticos y auditables. Tener los casos de prueba en un CSV que
            el equipo contable puede revisar garantiza que las reglas de negocio están
            correctamente implementadas.
        </div>

        <h3>🎓 Sección 12 completada</h3>
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin: 15px 0; text-align: center;">
            <h3 style="color: white; margin-bottom: 10px;">🏆 ¡Felicitaciones!</h3>
            <p>Has completado la <strong>Sección 12: Data-Driven Testing</strong>.
            Ahora puedes crear suites de tests que se alimentan de datos externos,
            cubren combinaciones inteligentes y son fáciles de mantener.</p>
            <p style="font-size: 0.9em; margin-top: 10px;">
                <strong>Siguiente:</strong> Sección 13 — Browser Contexts y Aislamiento
            </p>
        </div>

        <h3>🎯 Ejercicio final</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Extiende la suite con:</p>
            <ol>
                <li>CSV con 5 tipos de cliente (nacional, extranjero, régimen simplificado, etc.)</li>
                <li>Test parametrizado que cree una factura para cada tipo de cliente</li>
                <li>Matriz pairwise de: tipo_factura × tipo_cliente × método_pago</li>
            </ol>
        </div>
    `,
    topics: ["proyecto", "data-driven", "suite"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 10,
    difficulty: "medium",
    type: "integration"
};

if (typeof window !== 'undefined') {
    window.LESSON_087 = LESSON_087;
}
