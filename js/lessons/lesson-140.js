/**
 * Playwright Academy - Leccion 140
 * Recursos y rutas de aprendizaje complementarias
 * Seccion 21: Retos Abiertos y Recursos
 */

const LESSON_140 = {
    id: 140,
    title: "Recursos y rutas de aprendizaje complementarias",
    duration: "10 min",
    level: "beginner",
    section: "section-21",
    content: `
        <h2>Recursos y rutas de aprendizaje complementarias</h2>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Esta leccion es tu <strong>mapa de recursos</strong>. Aqui encontraras las mejores fuentes
            para seguir aprendiendo, donde practicar, y como profundizar en los temas del curso.
            Todos los recursos son <strong>gratuitos</strong> salvo que se indique lo contrario.</p>
        </div>

        <h3>Donde practicar</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #c8e6c9;">
                    <th style="padding: 10px; border: 1px solid #ddd;">Herramienta</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Descripcion</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Ideal para</th>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>VS Code + Playwright Extension</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Editor gratuito con autocomplete, ejecucion y debugging integrado. Instala con <code>pip install playwright</code> y la extension "Playwright Test for VS Code"</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Uso diario (recomendado)</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>GitHub Codespaces</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">VS Code en el navegador con entorno pre-configurado. 60 horas/mes gratis. Un clic y estas programando sin instalar nada</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Si no quieres instalar nada</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Try Playwright</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Playground oficial de Playwright en el navegador. Solo soporta JavaScript/TypeScript (no Python)</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Experimentos rapidos en JS</td>
                </tr>
            </table>

            <div style="background: #fff3e0; padding: 10px; border-radius: 6px; margin-top: 12px;">
                <strong>Recomendacion:</strong> VS Code local es la mejor opcion porque <strong>asi es como trabajaras en el mundo real</strong>.
                Codespaces es un excelente plan B si tienes restricciones en tu maquina.
            </div>
        </div>

        <h3>Sitios de practica (aplicaciones reales para testear)</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #e0e0e0;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Sitio</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">URL</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Que puedes practicar</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>SauceDemo</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>saucedemo.com</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Login, e-commerce, carrito, checkout</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Automation Exercise</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>automationexercise.com</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Registro, productos, carrito, API, formularios</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>The Internet</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>the-internet.herokuapp.com</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Elementos UI individuales: checkboxes, dropdowns, drag&drop, iframes</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Demoblaze</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>demoblaze.com</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">E-commerce con API AJAX, categorias, modales</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>TodoMVC</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>demo.playwright.dev/todomvc</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">App minima para practicar CRUD basico</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>ReqRes</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>reqres.in</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">API REST publica para practicar API testing</td>
                </tr>
            </table>
        </div>

        <h3>Documentacion oficial</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Recurso</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">URL</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Para que</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Playwright Python docs</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>playwright.dev/python</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Referencia completa de la API de Playwright con Python</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Playwright GitHub</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>github.com/microsoft/playwright-python</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Codigo fuente, issues, ejemplos</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>pytest docs</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>docs.pytest.org</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Fixtures, parametrize, plugins, configuracion</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Python docs</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>docs.python.org/3</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Referencia del lenguaje Python</td>
                </tr>
            </table>
        </div>

        <h3>Docker y Kubernetes</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Recurso</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">URL</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Nivel</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Docker Getting Started</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>docs.docker.com/get-started</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Principiante — 30 min</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Kubernetes Basics</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>kubernetes.io/docs/tutorials/kubernetes-basics</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Principiante — tutorial interactivo</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>GKE Quickstart</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>cloud.google.com/kubernetes-engine/docs/quickstart</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Intermedio — K8s en GCP</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Cloud Build CI/CD</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>cloud.google.com/build/docs</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Intermedio — CI/CD en GCP</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Playwright Docker image</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>playwright.dev/python/docs/docker</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Referencia — imagen oficial para CI</td>
                </tr>
            </table>
        </div>

        <h3>Comunidad y aprendizaje continuo</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Recurso</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripcion</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Playwright Discord</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Comunidad oficial. Canal activo con desarrolladores de Microsoft respondiendo preguntas</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Stack Overflow [playwright]</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Tag de Playwright en SO. Preguntas y respuestas de la comunidad</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Playwright Conf (YouTube)</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Conferencia anual de Playwright. Videos gratuitos con las novedades y casos de uso reales</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Testing Library / Ministry of Testing</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Comunidades generales de QA con articulos, webinars y foros</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Playwright release notes</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><code>github.com/microsoft/playwright/releases</code> — revisa cada release para conocer nuevas features</td>
                </tr>
            </table>
        </div>

        <h3>Templates y repositorios de referencia</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #e0e0e0;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Repo</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripcion</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>playwright-learn-codespaces</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Template oficial para aprender Playwright en GitHub Codespaces — un clic y estas practicando</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>playwright-python-testing</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Template con Page Object Pattern pre-configurado para Python</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>playwright-sandbox</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Repositorio de experimentacion con ejemplos feature-rich para E2E testing</td>
                </tr>
            </table>
        </div>

        <h3>Ruta de aprendizaje sugerida post-curso</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #c8e6c9;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Semana</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Objetivo</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Recursos</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>1-2</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Completa los 3 Challenges (lecciones 136-138)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">SauceDemo, Automation Exercise, Demoblaze</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>3-4</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Dockeriza tu framework del Challenge 137</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Docker Getting Started + leccion 110</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>5-6</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Despliega tus tests en un pipeline real</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">GitHub Actions o Cloud Build</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>7-8</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Aplica todo en un proyecto real de tu equipo</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Tu aplicacion, tu framework, tu pipeline</td>
                </tr>
            </table>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>El equipo de QA de SIESA mantiene una cultura de aprendizaje continuo. Compartimos hallazgos,
            hacemos code reviews de tests, y actualizamos nuestros frameworks con cada release de Playwright.
            La clave no es saberlo todo — es saber <strong>donde buscar</strong> y <strong>como aplicarlo</strong>.</p>
        </div>

        <div style="background: #e8f5e9; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center; border: 2px solid #4caf50;">
            <h3 style="color: #2e7d32; margin-top: 0;">Has completado la Playwright Academy</h3>
            <p style="font-size: 1.15em; margin: 15px 0;">
                21 secciones. 140 lecciones. Desde "que es Playwright" hasta auditorias QA completas
                con CI/CD en la nube.
            </p>
            <p style="font-size: 1.1em; margin: 15px 0;">
                Ahora tienes el conocimiento, las herramientas y los recursos para
                <strong>crecer como QA Engineer</strong>.
            </p>
            <p style="font-size: 1em; color: #555; margin-top: 20px;">
                <em>"La calidad no es un acto, es un habito."</em> — Aristoteles
            </p>
            <p style="margin-top: 15px;">
                <strong>Playwright Academy</strong> — 140 Lecciones Practicas para QA Engineers<br>
                SIESA — I&D Equipo de Procesos y Calidad de Software
            </p>
        </div>
    `,
    topics: ["recursos", "herramientas", "práctica", "comunidad", "referencia"],
    hasCode: false,
    hasExercise: false,
    estimatedTime: 10,
    difficulty: "easy",
    type: "reference"
};

if (typeof window !== 'undefined') {
    window.LESSON_140 = LESSON_140;
}
