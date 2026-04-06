/**
 * Playwright Academy - Lección 080
 * Setup y cleanup de datos de prueba
 * Sección 11: Database Testing
 */

const LESSON_080 = {
    id: 80,
    title: "Setup y cleanup de datos de prueba",
    duration: "7 min",
    level: "intermediate",
    section: "section-11",
    content: `
        <h2>🧹 Setup y cleanup de datos de prueba</h2>
        <p>El manejo correcto de datos de prueba es fundamental para tests
        <strong>confiables y reproducibles</strong>. Cada test debe empezar con un estado
        conocido y limpiar sus datos al terminar, sin afectar a otros tests.</p>

        <h3>🔄 Principios de manejo de datos de test</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <ol>
                <li><strong>Aislamiento:</strong> Cada test crea y limpia sus propios datos</li>
                <li><strong>Independencia:</strong> Los tests no dependen del orden de ejecución</li>
                <li><strong>Reproducibilidad:</strong> Datos predecibles, no random sin control</li>
                <li><strong>Limpieza garantizada:</strong> El cleanup se ejecuta incluso si el test falla</li>
            </ol>
        </div>

        <h3>🏗️ Setup con fixtures de pytest (yield)</h3>
        <pre><code class="python"># conftest.py — Setup + Cleanup con yield

@pytest.fixture
def test_user(db):
    """Crear usuario de prueba y eliminarlo después."""
    user_id = db.insert("users", {
        "name": "Test User",
        "email": "fixture@playwright-test.com",
        "role": "user",
        "active": True,
    })

    user = db.query_one("SELECT * FROM users WHERE id = %s", (user_id,))
    yield user  # ← El test recibe el usuario

    # CLEANUP — se ejecuta SIEMPRE (incluso si el test falla)
    db.delete("users", "id = %s", (user_id,))


@pytest.fixture
def test_products(db):
    """Crear 3 productos de prueba."""
    product_ids = []
    for i in range(3):
        pid = db.insert("products", {
            "name": f"Test Product {i+1}",
            "price": (i + 1) * 10000,
            "stock": 10,
            "category": "Testing",
        })
        product_ids.append(pid)

    products = db.query(
        "SELECT * FROM products WHERE id = ANY(%s)",
        (product_ids,)
    )
    yield products

    # Cleanup
    for pid in product_ids:
        db.delete("products", "id = %s", (pid,))


# Uso en test:
def test_usuario_puede_comprar(page, test_user, test_products):
    """El fixture provee usuario y productos ya creados."""
    # Login con el usuario de prueba
    page.goto("https://mi-app.com/login")
    page.fill("#email", test_user["email"])
    # ... el test usa los datos creados por las fixtures</code></pre>

        <h3>🔃 Transacciones con rollback (patrón más limpio)</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="python"># El patrón más limpio: ejecutar cada test dentro de una
# transacción y hacer ROLLBACK al final

@pytest.fixture(autouse=True)
def db_transaction(db_connection):
    """Envolver cada test en una transacción con rollback."""
    # Iniciar transacción
    db_connection.autocommit = False

    yield db_connection

    # Rollback — deshace TODO lo que hizo el test
    db_connection.rollback()

# Ventaja: no necesitas cleanup manual
# Desventaja: no funciona si el test necesita que la app lea los datos
# (la app tiene su propia conexión que no ve datos no commiteados)</code></pre>
        </div>

        <h3>🏭 Data Seeder — Poblar con datos base</h3>
        <pre><code class="python"># utils/data_seeder.py

class DataSeeder:
    """Poblar la base de datos con datos base para testing."""

    def __init__(self, db):
        self.db = db

    def seed_departments(self):
        """Insertar departamentos si no existen."""
        departments = ["I+D", "QA", "Comercial", "RRHH", "Contabilidad"]
        for dept in departments:
            self.db.execute(
                "INSERT INTO departments (name) VALUES (%s) "
                "ON CONFLICT (name) DO NOTHING",
                (dept,)
            )

    def seed_roles(self):
        """Insertar roles base."""
        roles = [
            ("admin", "Administrador"),
            ("editor", "Editor"),
            ("viewer", "Solo lectura"),
        ]
        for code, name in roles:
            self.db.execute(
                "INSERT INTO roles (code, name) VALUES (%s, %s) "
                "ON CONFLICT (code) DO NOTHING",
                (code, name)
            )

    def seed_test_users(self):
        """Insertar usuarios de prueba estándar."""
        users = [
            {"name": "Admin Test", "email": "admin@test.com",
             "role": "admin", "active": True},
            {"name": "Editor Test", "email": "editor@test.com",
             "role": "editor", "active": True},
            {"name": "Viewer Test", "email": "viewer@test.com",
             "role": "viewer", "active": True},
        ]
        for user in users:
            self.db.execute(
                "INSERT INTO users (name, email, role, active) "
                "VALUES (%(name)s, %(email)s, %(role)s, %(active)s) "
                "ON CONFLICT (email) DO NOTHING",
                user
            )

    def seed_all(self):
        """Ejecutar todos los seeds."""
        self.seed_departments()
        self.seed_roles()
        self.seed_test_users()

    def clean_test_data(self):
        """Eliminar solo datos de prueba (no seeds base)."""
        self.db.execute(
            "DELETE FROM users WHERE email LIKE %s",
            ("%@playwright-test.com",)
        )
        self.db.execute(
            "DELETE FROM products WHERE category = %s",
            ("Testing",)
        )
        self.db.execute(
            "DELETE FROM orders WHERE id IN ("
            "  SELECT o.id FROM orders o "
            "  JOIN users u ON o.user_id = u.id "
            "  WHERE u.email LIKE %s"
            ")",
            ("%@playwright-test.com",)
        )

# ── Fixtures ──
@pytest.fixture(scope="session")
def seeded_db(db):
    """BD con datos base (una vez por sesión)."""
    seeder = DataSeeder(db)
    seeder.seed_all()
    return db

@pytest.fixture(autouse=True)
def clean_after_test(db):
    """Limpiar datos de test después de cada test."""
    yield
    DataSeeder(db).clean_test_data()</code></pre>

        <h3>📋 Estrategias de cleanup comparadas</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #e65100; color: white;">
                        <th style="padding: 10px;">Estrategia</th>
                        <th style="padding: 10px;">Pros</th>
                        <th style="padding: 10px;">Contras</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #fff8e1;">
                        <td style="padding: 8px;"><strong>Fixture yield</strong></td>
                        <td style="padding: 8px;">Simple, claro, por test</td>
                        <td style="padding: 8px;">Hay que rastrear IDs</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>Transaction rollback</strong></td>
                        <td style="padding: 8px;">Automático, sin código</td>
                        <td style="padding: 8px;">No funciona cross-connection</td>
                    </tr>
                    <tr style="background: #fff8e1;">
                        <td style="padding: 8px;"><strong>Delete by marker</strong></td>
                        <td style="padding: 8px;">Limpieza global fácil</td>
                        <td style="padding: 8px;">Necesita campo marcador</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>Truncate tables</strong></td>
                        <td style="padding: 8px;">Limpieza total</td>
                        <td style="padding: 8px;">Elimina TODOS los datos</td>
                    </tr>
                    <tr style="background: #fff8e1;">
                        <td style="padding: 8px;"><strong>DB snapshot/restore</strong></td>
                        <td style="padding: 8px;">Estado perfecto</td>
                        <td style="padding: 8px;">Lento en BDs grandes</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>🧪 Ejemplo: Test con setup completo por BD</h3>
        <pre><code class="python">def test_empleado_aparece_en_departamento(db, page):
    """Setup por BD, verificar en UI."""
    # SETUP: crear departamento y empleados directamente en BD
    dept_id = db.insert("departments", {"name": "QA Testing"})
    emp1_id = db.insert("employees", {
        "name": "Carlos Díaz", "department_id": dept_id,
        "email": "carlos@playwright-test.com",
        "position": "QA Engineer", "status": "active"
    })
    emp2_id = db.insert("employees", {
        "name": "José Bravo", "department_id": dept_id,
        "email": "jose@playwright-test.com",
        "position": "QA Engineer", "status": "active"
    })

    # TEST: verificar en la UI
    page.goto(f"https://mi-app.com/departments/{dept_id}")
    expect(page.locator(".employee-row")).to_have_count(2)
    expect(page.locator(".employee-row").first).to_contain_text("Carlos")

    # CLEANUP se hace automáticamente por clean_after_test fixture</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #00bcd4;">
            <strong>💡 Tip:</strong> La estrategia más práctica es usar un
            <strong>email marker</strong> (como <code>@playwright-test.com</code>) en todos
            los datos de prueba. El cleanup simplemente elimina todo con ese dominio.
        </div>

        <h3>🎯 Ejercicio práctico</h3>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ejercicio:</strong> Implementa un sistema de setup/cleanup que:</p>
            <ol>
                <li>Tenga un <code>DataSeeder</code> con datos base (3 departamentos, 5 empleados)</li>
                <li>Fixture <code>seeded_db</code> que se ejecute una vez por sesión</li>
                <li>Fixture <code>test_employee</code> que cree un empleado y lo limpie</li>
                <li>Cleanup automático que elimine datos con email <code>@test.com</code></li>
            </ol>
        </div>
    `,
    topics: ["setup", "cleanup", "datos-prueba"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_080 = LESSON_080;
}
