/**
 * Playwright Academy - Lección 079
 * Queries SQL en tests
 * Sección 11: Database Testing
 */

const LESSON_079 = {
    id: 79,
    title: "Queries SQL en tests",
    duration: "7 min",
    level: "intermediate",
    section: "section-11",
    content: `
        <h2>📊 Queries SQL en tests</h2>
        <p>Saber escribir queries SQL efectivas en el contexto de testing permite
        <strong>verificaciones profundas</strong> que la UI y la API no pueden ofrecer:
        integridad de datos, triggers, valores calculados y auditoría.</p>

        <h3>🔍 Queries de verificación comunes</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python"># ── Verificar que un registro existe ──
def test_usuario_se_guarda_en_bd(db, page):
    page.goto("https://mi-app.com/register")
    page.fill("#name", "María Test")
    page.fill("#email", "maria@playwright-test.com")
    page.fill("#password", "Test@12345")
    page.click("#register-btn")

    # Verificar en BD
    user = db.query_one(
        "SELECT id, name, email, role, active, created_at "
        "FROM users WHERE email = %s",
        ("maria@playwright-test.com",)
    )

    assert user is not None, "Usuario no encontrado en BD"
    assert user["name"] == "María Test"
    assert user["role"] == "user"  # Rol por defecto
    assert user["active"] is True
    assert user["created_at"] is not None</code></pre>
        </div>

        <h3>📋 Verificar campos que la UI no muestra</h3>
        <pre><code class="python">def test_pedido_guarda_datos_internos(db, page):
    """Verificar campos que solo existen en BD (no en UI)."""
    # Crear pedido por UI
    page.goto("https://mi-app.com/checkout")
    # ... llenar formulario y enviar ...
    page.click("#place-order")

    # Verificar campos internos de BD
    order = db.query_one(
        "SELECT * FROM orders ORDER BY created_at DESC LIMIT 1"
    )

    # Campos visibles en UI
    assert order["status"] == "confirmed"

    # Campos que solo existen en BD
    assert order["payment_gateway_ref"] is not None  # Ref del gateway
    assert order["ip_address"] is not None            # IP del cliente
    assert order["user_agent"] is not None            # Browser
    assert order["tax_amount"] > 0                    # IVA calculado
    assert order["subtotal"] + order["tax_amount"] == order["total"]
    assert order["created_at"] is not None
    assert order["updated_at"] is not None</code></pre>

        <h3>🔗 Verificar relaciones entre tablas</h3>
        <pre><code class="python">def test_pedido_tiene_items_correctos(db, page):
    """Verificar que la relación order-items se guardó bien."""
    # Agregar 2 productos y hacer checkout por UI
    # ... (interacción con UI) ...

    # Verificar el pedido
    order = db.query_one(
        "SELECT * FROM orders ORDER BY id DESC LIMIT 1"
    )

    # Verificar los items del pedido (tabla relacionada)
    items = db.query(
        "SELECT oi.*, p.name as product_name "
        "FROM order_items oi "
        "JOIN products p ON oi.product_id = p.id "
        "WHERE oi.order_id = %s",
        (order["id"],)
    )

    assert len(items) == 2
    assert all(item["quantity"] > 0 for item in items)
    assert all(item["unit_price"] > 0 for item in items)

    # Verificar que el total cuadra
    calculated_total = sum(
        item["quantity"] * item["unit_price"] for item in items
    )
    assert order["subtotal"] == calculated_total</code></pre>

        <h3>📊 Queries de agregación para validaciones</h3>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python">def test_dashboard_muestra_totales_correctos(db, page):
    """Verificar que el dashboard muestra datos reales de BD."""

    # Obtener totales reales de la BD
    stats = db.query_one("""
        SELECT
            COUNT(*) as total_employees,
            COUNT(*) FILTER (WHERE status = 'active') as active_count,
            COUNT(DISTINCT department) as dept_count,
            AVG(salary)::numeric(12,2) as avg_salary
        FROM employees
    """)

    # Navegar al dashboard
    page.goto("https://mi-app.com/dashboard")

    # Comparar UI con BD
    ui_total = page.locator("[data-testid='total-employees']").text_content()
    assert str(stats["total_employees"]) in ui_total

    ui_active = page.locator("[data-testid='active-employees']").text_content()
    assert str(stats["active_count"]) in ui_active


def test_reporte_ventas_cuadra_con_bd(db, page):
    """Verificar que el reporte de ventas coincide con la BD."""

    ventas_bd = db.query_one("""
        SELECT
            COUNT(*) as total_orders,
            SUM(total) as total_revenue,
            AVG(total)::numeric(12,2) as avg_order
        FROM orders
        WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
        AND status = 'confirmed'
    """)

    page.goto("https://mi-app.com/reports/sales")

    # El reporte debe coincidir con la BD
    expect(page.locator("[data-testid='total-orders']")).to_contain_text(
        str(ventas_bd["total_orders"])
    )</code></pre>
        </div>

        <h3>🔒 Verificar integridad y constraints</h3>
        <pre><code class="python">def test_email_unico_en_bd(db):
    """Verificar que el constraint UNIQUE funciona."""
    # Insertar un usuario
    db.execute(
        "INSERT INTO users (name, email) VALUES (%s, %s)",
        ("Test User", "unique@test.com")
    )

    # Intentar insertar con el mismo email
    import psycopg2
    with pytest.raises(psycopg2.errors.UniqueViolation):
        db.execute(
            "INSERT INTO users (name, email) VALUES (%s, %s)",
            ("Other User", "unique@test.com")
        )


def test_cascade_delete(db):
    """Verificar que DELETE CASCADE funciona correctamente."""
    # Contar items del pedido
    items_before = db.count("order_items", "order_id = %s", (1,))
    assert items_before > 0

    # Eliminar el pedido
    db.execute("DELETE FROM orders WHERE id = %s", (1,))

    # Los items deben haberse eliminado también
    items_after = db.count("order_items", "order_id = %s", (1,))
    assert items_after == 0


def test_campo_not_null(db):
    """Verificar constraints NOT NULL."""
    import psycopg2
    with pytest.raises(psycopg2.errors.NotNullViolation):
        db.execute(
            "INSERT INTO employees (name, email) VALUES (%s, NULL)",
            ("Test",)
        )</code></pre>

        <h3>⏱️ Verificar timestamps y auditoría</h3>
        <pre><code class="python">from datetime import datetime, timedelta

def test_created_at_se_genera_automaticamente(db, page):
    """Verificar que created_at se genera al crear un registro."""
    before = datetime.utcnow()

    # Crear registro por UI
    page.goto("https://mi-app.com/tasks/new")
    page.fill("#title", "Task Timestamp Test")
    page.click("#save")

    after = datetime.utcnow()

    task = db.query_one(
        "SELECT * FROM tasks WHERE title = %s",
        ("Task Timestamp Test",)
    )

    # El timestamp debe estar en el rango
    created = task["created_at"]
    assert before - timedelta(seconds=5) <= created <= after + timedelta(seconds=5)


def test_updated_at_cambia_al_editar(db, page):
    """Verificar que updated_at se actualiza al modificar."""
    task = db.query_one("SELECT * FROM tasks LIMIT 1")
    original_updated = task["updated_at"]

    # Editar por UI
    page.goto(f"https://mi-app.com/tasks/{task['id']}/edit")
    page.fill("#title", "Título Modificado")
    page.click("#save")

    updated_task = db.query_one(
        "SELECT * FROM tasks WHERE id = %s", (task["id"],)
    )
    assert updated_task["updated_at"] > original_updated</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip:</strong> Siempre usa queries parametrizadas (<code>%s</code> o <code>?</code>)
            en lugar de f-strings para evitar SQL injection, incluso en tests.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Escribe queries de verificación para:</p>
            <ol>
                <li>Verificar que un producto creado tiene precio > 0 y stock >= 0</li>
                <li>Verificar que al eliminar un usuario, sus tareas se reasignan</li>
                <li>Verificar que el total de un pedido = SUM(items * precio)</li>
                <li>Verificar que un campo calculado (promedio) coincide con la UI</li>
            </ol>
        </div>
    `,
    topics: ["sql", "queries", "tests"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_079 = LESSON_079;
}
