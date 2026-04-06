/**
 * Playwright Academy - Leccion 138
 * Challenge: Auditoria QA completa (Avanzado)
 * Seccion 21: Retos Abiertos y Recursos
 */

const LESSON_138 = {
    id: 138,
    title: "Challenge: Auditoría QA completa (Avanzado)",
    duration: "120 min",
    level: "advanced",
    section: "section-21",
    content: `
        <h2>Challenge: Auditoria QA completa (Avanzado)</h2>

        <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ff9800;">
            <h3 style="color: #e65100; margin: 0;">Modo Challenge — El reto definitivo</h3>
            <p style="font-size: 1.1em;">Este es el reto mas completo de la academia. Debes entregar una
            <strong>auditoria QA integral</strong>: tests E2E, tests de API, reporte de accesibilidad
            y pipeline de CI/CD. <strong>Sin codigo de ejemplo. Sin pistas. Sin guia.</strong></p>
            <p><em>Si completas este reto, estas listo para liderar automatizacion en cualquier equipo.</em></p>
        </div>

        <h3>Tu mision</h3>
        <p>Realiza una auditoria QA completa del sitio <strong>Demoblaze</strong>
        (<code>https://www.demoblaze.com</code>) — una tienda online con frontend, API REST y carrito de compras.</p>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Por que Demoblaze</h4>
            <p>Este sitio tiene API publica (AJAX calls visibles en DevTools), problemas reales de accesibilidad,
            y flujos complejos (signup, login, categorias, carrito, checkout con modal).
            Es un sitio imperfecto — como los que encontraras en produccion.</p>
        </div>

        <h3>Entregables requeridos</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 10px; border: 1px solid #ddd;">#</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Entregable</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Que debe incluir</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Pts</th>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">1</td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Suite E2E</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">15+ tests con POM cubriendo: signup, login, navegacion por categorias, agregar al carrito, checkout completo, y al menos 2 escenarios negativos</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">25</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 10px; border: 1px solid #ddd;">2</td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Tests de API</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">8+ tests validando las APIs del sitio (signup, login, listado de productos, agregar al carrito). Intercepta las llamadas reales del sitio con network interception o llama directamente a las APIs</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">20</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">3</td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Auditoria de accesibilidad</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Tests automatizados de accesibilidad en al menos 3 paginas. Genera un reporte con los hallazgos (violaciones WCAG encontradas)</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">20</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 10px; border: 1px solid #ddd;">4</td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Pipeline CI/CD</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Un archivo de GitHub Actions (o GitLab CI) que ejecute toda la suite automaticamente. Debe generar artefactos (reportes, screenshots de fallos)</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">15</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">5</td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Documento de hallazgos</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Un README.md con: resumen ejecutivo, bugs encontrados, hallazgos de accesibilidad, metricas de cobertura, y recomendaciones</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">10</td>
                </tr>
            </table>
        </div>

        <h3>Requisitos tecnicos</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <ul>
                <li><strong>Framework:</strong> Playwright con Python + pytest</li>
                <li><strong>Patron:</strong> Page Object Model con BasePage</li>
                <li><strong>Accesibilidad:</strong> axe-core via playwright-axe o evaluacion manual con Playwright</li>
                <li><strong>Reportes:</strong> pytest-html, allure o reporte custom</li>
                <li><strong>CI/CD:</strong> GitHub Actions (preferido) o GitLab CI</li>
                <li><strong>Datos:</strong> Al menos 1 test parametrizado con datos externos</li>
            </ul>
        </div>

        <h3>Restricciones</h3>
        <div style="background: #fce4ec; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <ul>
                <li><strong>No copies codigo</strong> de ninguna fuente. Todo debe ser tuyo.</li>
                <li><strong>No uses <code>time.sleep()</code></strong> — ni siquiera "solo por ahora"</li>
                <li><strong>No ignores tests fallidos</strong> — si un test falla por un bug real del sitio, documentalo en el README pero no lo skipees</li>
                <li><strong>El pipeline debe funcionar</strong> — no basta con que exista el archivo YAML, debe ejecutarse exitosamente</li>
                <li><strong>Los hallazgos de accesibilidad deben ser reales</strong> — ejecuta las herramientas contra el sitio real</li>
            </ul>
        </div>

        <h3>Rubrica de evaluacion</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Categoria</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Criterio</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Pts</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;" rowspan="2"><strong>E2E (25)</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">15+ tests funcionales con POM</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">15</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Cobertura de flujos criticos + escenarios negativos</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">10</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;" rowspan="2"><strong>API (20)</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">8+ tests de API con validacion de respuestas</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">12</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Uso correcto de network interception o API context</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">8</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Accesibilidad (20)</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Tests automatizados + reporte con hallazgos reales</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">20</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>CI/CD (15)</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Pipeline funcional con artefactos</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">15</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Documentacion (10)</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">README con hallazgos, metricas y recomendaciones</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">10</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Calidad (10)</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Codigo limpio, naming, sin sleep, sin hardcodes</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">10</td>
                </tr>
                <tr style="background: #bbdefb;">
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;" colspan="2">TOTAL</td>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">100</td>
                </tr>
            </table>
        </div>

        <h3>Entregable</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre><code class="text">auditoria-demoblaze/
├── pages/
├── tests/
│   ├── e2e/
│   ├── api/
│   └── accessibility/
├── data/
├── reports/
├── .github/workflows/playwright.yml
├── conftest.py
├── requirements.txt
├── pyproject.toml
└── README.md        ← Tu documento de hallazgos</code></pre>
            <p><strong>Criterio de exito:</strong></p>
            <ol>
                <li><code>pytest -v</code> ejecuta toda la suite (E2E + API + accesibilidad)</li>
                <li>El pipeline de CI/CD se ejecuta exitosamente en GitHub Actions</li>
                <li>El README documenta hallazgos reales con evidencia</li>
            </ol>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: center;">
            <p style="font-size: 1.1em;"><strong>Este es el reto que demuestra que eres un QA Engineer completo.</strong></p>
            <p>No hay atajos. No hay pistas. Demuestra todo lo que aprendiste en 140 lecciones.</p>
        </div>
    `,
    topics: ["challenge", "reto-abierto", "auditoría", "E2E", "API", "accesibilidad", "CI/CD", "avanzado"],
    hasCode: false,
    hasExercise: true,
    estimatedTime: 120,
    difficulty: "hard",
    type: "challenge"
};

if (typeof window !== 'undefined') {
    window.LESSON_138 = LESSON_138;
}
