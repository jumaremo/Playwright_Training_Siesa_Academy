/**
 * Playwright Academy - Leccion 137
 * Challenge: Diseña tu framework (Intermedio)
 * Seccion 21: Retos Abiertos y Recursos
 */

const LESSON_137 = {
    id: 137,
    title: "Challenge: Diseña tu framework (Intermedio)",
    duration: "90 min",
    level: "intermediate",
    section: "section-21",
    content: `
        <h2>Challenge: Diseña tu framework (Intermedio)</h2>

        <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ff9800;">
            <h3 style="color: #e65100; margin: 0;">Modo Challenge — Sin codigo de referencia</h3>
            <p style="font-size: 1.1em;">Diseña e implementa un <strong>mini-framework de testing</strong> desde cero.
            No hay plantillas, no hay esqueleto pre-armado. Tu decides la arquitectura,
            los patrones y la organizacion.</p>
            <p><em>Este reto simula tu primer dia construyendo un framework para un equipo QA real.</em></p>
        </div>

        <h3>Tu mision</h3>
        <p>Construye un framework de automatizacion con <strong>Page Object Model</strong> para el sitio
        <strong>Automation Exercise</strong> (<code>https://automationexercise.com</code>).
        El framework debe ser reutilizable, mantenible y ejecutable con un solo comando.</p>

        <h3>Requisitos funcionales</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 10px; border: 1px solid #ddd;">#</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Requisito</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Detalle</th>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">1</td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>BasePage</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Una clase base con metodos comunes que todas las paginas hereden</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 10px; border: 1px solid #ddd;">2</td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>3+ Page Objects</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Paginas concretas que hereden de BasePage (tu decides cuales)</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">3</td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Fixtures compartidas</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Un conftest.py con fixtures reutilizables (browser, page, login, etc.)</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 10px; border: 1px solid #ddd;">4</td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>10+ tests</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Cubriendo al menos 3 flujos distintos del sitio</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">5</td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Data-driven</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Al menos 2 tests parametrizados con datos externos (JSON, CSV o YAML)</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 10px; border: 1px solid #ddd;">6</td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Reportes</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Genera reporte HTML al ejecutar (pytest-html o allure)</td>
                </tr>
            </table>
        </div>

        <h3>Requisitos de arquitectura</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <ul>
                <li><strong>Separacion clara</strong> — pages, tests, fixtures y datos en carpetas distintas</li>
                <li><strong>Sin logica de negocio en tests</strong> — los tests solo llaman metodos de Page Objects</li>
                <li><strong>Configuracion centralizada</strong> — URLs, timeouts y credenciales en un solo lugar</li>
                <li><strong>requirements.txt</strong> — cualquiera puede instalar y ejecutar con <code>pip install -r requirements.txt</code></li>
                <li><strong>Un comando para ejecutar</strong> — <code>pytest</code> debe correr todo sin configuracion extra</li>
            </ul>
        </div>

        <h3>Restricciones</h3>
        <div style="background: #fce4ec; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <ul>
                <li><strong>No copies codigo</strong> de lecciones anteriores ni de internet. Escribe todo tu.</li>
                <li><strong>No uses <code>time.sleep()</code></strong></li>
                <li><strong>No hardcodees datos</strong> directamente en los tests</li>
                <li><strong>Cada Page Object</strong> debe tener al menos 3 metodos propios</li>
                <li><strong>Sin comentarios tipo "TODO"</strong> — todo debe estar implementado</li>
            </ul>
        </div>

        <h3>Rubrica de evaluacion</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Criterio</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripcion</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Pts</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Arquitectura</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Estructura de carpetas clara, separacion de responsabilidades</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">20</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Page Objects</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">BasePage + 3 paginas con herencia correcta y metodos utiles</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">20</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Tests</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">10+ tests que pasan, cubren 3+ flujos, patron AAA</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">25</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Data-driven</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">2+ tests parametrizados con datos externos</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">15</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Fixtures</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">conftest.py con fixtures reutilizables y cleanup</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">10</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Ejecutabilidad</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Clonar, instalar y ejecutar funciona a la primera</td>
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
            <p>Un repositorio (local o GitHub) con tu framework completo. Estructura minima esperada:</p>
            <pre><code class="text">mi-framework/
├── pages/
│   ├── base_page.py
│   └── [tus page objects]
├── tests/
│   ├── conftest.py
│   └── [tus tests]
├── data/
│   └── [tus archivos de datos]
├── requirements.txt
└── pytest.ini o pyproject.toml</code></pre>
            <p><strong>Criterio de exito:</strong></p>
            <ol>
                <li><code>pip install -r requirements.txt</code> instala todo</li>
                <li><code>pytest -v</code> ejecuta 10+ tests y todos pasan</li>
                <li>Se genera un reporte HTML</li>
            </ol>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: center;">
            <p style="font-size: 1.1em;"><strong>Tu framework, tus decisiones, tu arquitectura.</strong></p>
            <p>Revisa las lecciones 53-98 si necesitas refrescar conceptos de nivel intermedio.</p>
        </div>
    `,
    topics: ["challenge", "reto-abierto", "framework", "POM", "intermedio"],
    hasCode: false,
    hasExercise: true,
    estimatedTime: 90,
    difficulty: "hard",
    type: "challenge"
};

if (typeof window !== 'undefined') {
    window.LESSON_137 = LESSON_137;
}
