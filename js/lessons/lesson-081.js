/**
 * Playwright Academy - Lección 081
 * Validación cruzada UI-DB
 * Sección 11: Database Testing
 */

const LESSON_081 = {
    id: 81,
    title: "Validación cruzada UI-DB",
    duration: "7 min",
    level: "intermediate",
    section: "section-11",
    content: `
        <h2>🔄 Validación cruzada UI-DB</h2>
        <p>La <strong>validación cruzada</strong> consiste en verificar que los datos
        mostrados en la UI coinciden con los datos almacenados en la base de datos.
        Esto detecta bugs de mapeo, formateo, cálculos incorrectos y datos cacheados.</p>

        <h3>🎯 ¿Qué validar cruzadamente?</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #1565c0; color: white;">
                        <th style="padding: 10px;">Categoría</th>
                        <th style="padding: 10px;">Ejemplo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><strong>Datos textuales</strong></td>
                        <td style="padding: 8px;">Nombre, email, descripción</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>Valores numéricos</strong></td>
                        <td style="padding: 8px;">Precios, totales, cantidades</td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><strong>Cálculos</strong></td>
                        <td style="padding: 8px;">Subtotales, impuestos, promedios</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>Conteos</strong></td>
                        <td style="padding: 8px;">"Mostrando 25 de 150 resultados"</td>
                    </tr>
                    <tr style="background: #e3f2fd;">
                        <td style="padding: 8px;"><strong>Estados</strong></td>
                        <td style="padding: 8px;">Activo/Inactivo, badges de status</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>Fechas</strong></td>
                        <td style="padding: 8px;">Formato correcto, zona horaria</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>📊 Patrón: Leer BD → Comparar con UI</h3>
        <div class="code-tabs" data-code-id="L081-1">
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
            <pre><code class="language-python">from playwright.sync_api import expect
import re

def test_tabla_empleados_coincide_con_bd(db, page):
    """Verificar que la tabla de la UI muestra los datos correctos de BD."""

    # 1. Obtener datos reales de la BD
    employees_db = db.query(
        "SELECT name, email, department, status "
        "FROM employees "
        "WHERE status = 'active' "
        "ORDER BY name "
        "LIMIT 10"
    )

    # 2. Navegar a la UI
    page.goto("https://mi-app.com/employees")
    expect(page.locator("tr.employee-row")).to_have_count(len(employees_db))

    # 3. Comparar fila por fila
    rows = page.locator("tr.employee-row")
    for i, emp_db in enumerate(employees_db):
        row = rows.nth(i)
        expect(row.locator(".col-name")).to_have_text(emp_db["name"])
        expect(row.locator(".col-email")).to_have_text(emp_db["email"])
        expect(row.locator(".col-dept")).to_have_text(emp_db["department"])</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">import { test, expect } from '@playwright/test';

test('tabla empleados coincide con BD', async ({ db, page }) => {
    // 1. Obtener datos reales de la BD
    const employeesDb = await db.query(
        'SELECT name, email, department, status ' +
        'FROM employees ' +
        "WHERE status = 'active' " +
        'ORDER BY name ' +
        'LIMIT 10'
    );

    // 2. Navegar a la UI
    await page.goto('https://mi-app.com/employees');
    await expect(page.locator('tr.employee-row')).toHaveCount(employeesDb.length);

    // 3. Comparar fila por fila
    const rows = page.locator('tr.employee-row');
    for (let i = 0; i < employeesDb.length; i++) {
        const row = rows.nth(i);
        await expect(row.locator('.col-name')).toHaveText(employeesDb[i].name);
        await expect(row.locator('.col-email')).toHaveText(employeesDb[i].email);
        await expect(row.locator('.col-dept')).toHaveText(employeesDb[i].department);
    }
});</code></pre>
        </div>
        </div>

        <h3>💰 Validar cálculos financieros</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div class="code-tabs" data-code-id="L081-2">
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
                <pre><code class="language-python">def test_totales_pedido_coinciden(db, page, test_order):
    """Verificar que los totales mostrados coinciden con BD."""
    order_id = test_order["id"]

    # Datos de BD
    order_db = db.query_one(
        "SELECT subtotal, tax_amount, shipping_cost, total "
        "FROM orders WHERE id = %s",
        (order_id,)
    )
    items_db = db.query(
        "SELECT quantity, unit_price, "
        "       (quantity * unit_price) as line_total "
        "FROM order_items WHERE order_id = %s",
        (order_id,)
    )

    # Verificar cálculos en BD
    subtotal_calculado = sum(item["line_total"] for item in items_db)
    assert order_db["subtotal"] == subtotal_calculado
    assert order_db["total"] == (
        order_db["subtotal"] + order_db["tax_amount"] + order_db["shipping_cost"]
    )

    # Navegar al detalle del pedido
    page.goto(f"https://mi-app.com/orders/{order_id}")

    # Comparar UI con BD
    def parse_money(text):
        return float(re.sub(r'[^\\d.]', '', text.replace(",", "")))

    ui_subtotal = parse_money(
        page.locator("[data-testid='subtotal']").text_content()
    )
    ui_tax = parse_money(
        page.locator("[data-testid='tax']").text_content()
    )
    ui_total = parse_money(
        page.locator("[data-testid='total']").text_content()
    )

    assert ui_subtotal == float(order_db["subtotal"])
    assert ui_tax == float(order_db["tax_amount"])
    assert ui_total == float(order_db["total"])</code></pre>
            </div>
            <div class="code-panel" data-lang="typescript">
                <pre><code class="language-typescript">test('totales pedido coinciden', async ({ db, page }) => {
    const orderId = testOrder.id;

    // Datos de BD
    const orderDb = await db.queryOne(
        'SELECT subtotal, tax_amount, shipping_cost, total ' +
        'FROM orders WHERE id = $1',
        [orderId]
    );
    const itemsDb = await db.query(
        'SELECT quantity, unit_price, ' +
        '       (quantity * unit_price) as line_total ' +
        'FROM order_items WHERE order_id = $1',
        [orderId]
    );

    // Verificar cálculos en BD
    const subtotalCalculado = itemsDb.reduce(
        (sum: number, item: any) => sum + Number(item.line_total), 0
    );
    expect(Number(orderDb.subtotal)).toBe(subtotalCalculado);
    expect(Number(orderDb.total)).toBe(
        Number(orderDb.subtotal) + Number(orderDb.tax_amount) + Number(orderDb.shipping_cost)
    );

    // Navegar al detalle del pedido
    await page.goto(\`https://mi-app.com/orders/\${orderId}\`);

    // Comparar UI con BD
    function parseMoney(text: string): number {
        return parseFloat(text.replace(/[^\\d.]/g, ''));
    }

    const uiSubtotal = parseMoney(
        await page.locator('[data-testid="subtotal"]').textContent() ?? ''
    );
    const uiTax = parseMoney(
        await page.locator('[data-testid="tax"]').textContent() ?? ''
    );
    const uiTotal = parseMoney(
        await page.locator('[data-testid="total"]').textContent() ?? ''
    );

    expect(uiSubtotal).toBe(Number(orderDb.subtotal));
    expect(uiTax).toBe(Number(orderDb.tax_amount));
    expect(uiTotal).toBe(Number(orderDb.total));
});</code></pre>
            </div>
            </div>
        </div>

        <h3>📈 Validar dashboards y reportes</h3>
        <div class="code-tabs" data-code-id="L081-3">
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
            <pre><code class="language-python">def test_dashboard_kpis_coinciden_con_bd(db, page):
    """Los KPIs del dashboard deben reflejar datos reales."""

    # Calcular KPIs desde la BD
    kpis = db.query_one("""
        SELECT
            (SELECT COUNT(*) FROM employees WHERE status = 'active')
                as active_employees,
            (SELECT COUNT(*) FROM orders
             WHERE created_at >= DATE_TRUNC('month', NOW())
             AND status = 'confirmed')
                as monthly_orders,
            (SELECT COALESCE(SUM(total), 0) FROM orders
             WHERE created_at >= DATE_TRUNC('month', NOW())
             AND status = 'confirmed')
                as monthly_revenue
    """)

    page.goto("https://mi-app.com/dashboard")

    # Comparar cada KPI
    ui_employees = page.locator("[data-testid='kpi-employees']").text_content()
    assert str(kpis["active_employees"]) in ui_employees

    ui_orders = page.locator("[data-testid='kpi-orders']").text_content()
    assert str(kpis["monthly_orders"]) in ui_orders


def test_reporte_paginado_total_correcto(db, page):
    """El conteo 'Mostrando X de Y' debe coincidir con BD."""

    total_bd = db.count("products", "active = true")

    page.goto("https://mi-app.com/products")

    # Extraer "Mostrando 1-20 de 150 resultados"
    pagination_text = page.locator(".pagination-info").text_content()
    match = re.search(r'de (\\d+)', pagination_text)
    total_ui = int(match.group(1))

    assert total_ui == total_bd</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">test('dashboard KPIs coinciden con BD', async ({ db, page }) => {
    // Calcular KPIs desde la BD
    const kpis = await db.queryOne(
        "SELECT " +
        "  (SELECT COUNT(*) FROM employees WHERE status = 'active') as active_employees, " +
        "  (SELECT COUNT(*) FROM orders " +
        "   WHERE created_at >= DATE_TRUNC('month', NOW()) " +
        "   AND status = 'confirmed') as monthly_orders, " +
        "  (SELECT COALESCE(SUM(total), 0) FROM orders " +
        "   WHERE created_at >= DATE_TRUNC('month', NOW()) " +
        "   AND status = 'confirmed') as monthly_revenue"
    );

    await page.goto('https://mi-app.com/dashboard');

    // Comparar cada KPI
    const uiEmployees = await page.locator('[data-testid="kpi-employees"]').textContent();
    expect(uiEmployees).toContain(String(kpis.active_employees));

    const uiOrders = await page.locator('[data-testid="kpi-orders"]').textContent();
    expect(uiOrders).toContain(String(kpis.monthly_orders));
});

test('reporte paginado total correcto', async ({ db, page }) => {
    // El conteo 'Mostrando X de Y' debe coincidir con BD
    const totalBd = await db.count('products', 'active = true');

    await page.goto('https://mi-app.com/products');

    // Extraer "Mostrando 1-20 de 150 resultados"
    const paginationText = await page.locator('.pagination-info').textContent();
    const match = paginationText?.match(/de (\\d+)/);
    const totalUi = match ? parseInt(match[1]) : 0;

    expect(totalUi).toBe(totalBd);
});</code></pre>
        </div>
        </div>

        <h3>🔧 Helper de validación cruzada</h3>
        <div class="code-tabs" data-code-id="L081-4">
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
            <pre><code class="language-python"># utils/cross_validator.py

class CrossValidator:
    """Helper para validaciones cruzadas UI-DB."""

    def __init__(self, db, page):
        self.db = db
        self.page = page

    def validate_table(self, table_selector, query, column_map):
        """Validar que una tabla HTML coincide con datos de BD.

        Args:
            table_selector: CSS selector de las filas
            query: SQL query que retorna los datos esperados
            column_map: dict {css_selector: db_column}
        """
        db_data = self.db.query(query)
        rows = self.page.locator(table_selector)

        assert rows.count() == len(db_data), (
            f"UI tiene {rows.count()} filas, BD tiene {len(db_data)}"
        )

        for i, db_row in enumerate(db_data):
            ui_row = rows.nth(i)
            for css, col in column_map.items():
                expected = str(db_row[col])
                actual = ui_row.locator(css).text_content().strip()
                assert expected in actual, (
                    f"Fila {i}, columna {col}: "
                    f"BD='{expected}', UI='{actual}'"
                )

    def validate_count(self, selector, query):
        """Validar que un conteo en UI coincide con BD."""
        db_count = self.db.query_one(query)["total"]
        ui_text = self.page.locator(selector).text_content()
        assert str(db_count) in ui_text

# Uso:
def test_tabla_productos(db, page):
    cv = CrossValidator(db, page)
    page.goto("https://mi-app.com/products")
    cv.validate_table(
        "tr.product-row",
        "SELECT name, price, stock FROM products ORDER BY name LIMIT 10",
        {".col-name": "name", ".col-price": "price", ".col-stock": "stock"}
    )</code></pre>
        </div>
        <div class="code-panel" data-lang="typescript">
            <pre><code class="language-typescript">// utils/crossValidator.ts
import { Page, Locator, expect } from '@playwright/test';

class CrossValidator {
    /** Helper para validaciones cruzadas UI-DB. */
    constructor(private db: any, private page: Page) {}

    async validateTable(
        tableSelector: string,
        query: string,
        columnMap: Record&lt;string, string&gt;
    ): Promise&lt;void&gt; {
        /** Validar que una tabla HTML coincide con datos de BD. */
        const dbData = await this.db.query(query);
        const rows = this.page.locator(tableSelector);

        await expect(rows).toHaveCount(dbData.length);

        for (let i = 0; i &lt; dbData.length; i++) {
            const uiRow = rows.nth(i);
            for (const [css, col] of Object.entries(columnMap)) {
                const expected = String(dbData[i][col]);
                const actual = (await uiRow.locator(css).textContent())?.trim();
                expect(actual).toContain(expected);
            }
        }
    }

    async validateCount(selector: string, query: string): Promise&lt;void&gt; {
        /** Validar que un conteo en UI coincide con BD. */
        const dbCount = (await this.db.queryOne(query)).total;
        const uiText = await this.page.locator(selector).textContent();
        expect(uiText).toContain(String(dbCount));
    }
}

// Uso:
test('tabla productos', async ({ db, page }) => {
    const cv = new CrossValidator(db, page);
    await page.goto('https://mi-app.com/products');
    await cv.validateTable(
        'tr.product-row',
        'SELECT name, price, stock FROM products ORDER BY name LIMIT 10',
        { '.col-name': 'name', '.col-price': 'price', '.col-stock': 'stock' }
    );
});</code></pre>
        </div>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip SIESA:</strong> La validación cruzada UI-DB es crítica en
            sistemas financieros. En el ERP verificamos que los saldos contables en la
            UI coincidan exactamente con los registros en la BD al centavo.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Implementa validaciones cruzadas para:</p>
            <ol>
                <li>Tabla de productos: nombre, precio y stock UI vs BD</li>
                <li>Dashboard: conteo de usuarios activos UI vs BD</li>
                <li>Detalle de pedido: subtotal, impuestos y total UI vs BD</li>
                <li>Un <code>CrossValidator</code> reutilizable con los 3 métodos anteriores</li>
            </ol>
        </div>
    `,
    topics: ["validación", "ui", "database"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_081 = LESSON_081;
}
