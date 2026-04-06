/**
 * Playwright Academy - Leccion 139
 * Glosario QA + Infraestructura Cloud
 * Seccion 21: Retos Abiertos y Recursos
 */

const LESSON_139 = {
    id: 139,
    title: "Glosario QA + Infraestructura Cloud",
    duration: "15 min",
    level: "beginner",
    section: "section-21",
    content: `
        <h2>Glosario QA + Infraestructura Cloud</h2>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Este glosario es tu <strong>referencia rapida</strong> para los terminos que aparecen
            a lo largo del curso y que encontraras en el dia a dia como QA Engineer.
            Incluye conceptos de testing, Docker, Kubernetes, GCP y CI/CD.</p>
            <p><em>Guardalo como referencia. No necesitas memorizar todo — solo saber donde encontrarlo.</em></p>
        </div>

        <h3>Testing y QA</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #e0e0e0;">
                    <th style="padding: 8px; border: 1px solid #ddd; width: 25%;">Termino</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Definicion</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>E2E (End-to-End)</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Test que valida un flujo completo del usuario, desde la interfaz hasta la base de datos y de regreso</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>POM (Page Object Model)</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Patron de diseño donde cada pagina de la aplicacion es una clase con metodos que representan acciones del usuario</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Fixture</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Funcion que prepara el entorno antes de un test y limpia despues (setup/teardown). En pytest se usa el decorador <code>@pytest.fixture</code></td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>AAA (Arrange-Act-Assert)</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Patron para estructurar tests: preparar datos, ejecutar la accion, verificar el resultado</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Shift-left testing</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Practica de mover las actividades de QA al inicio del ciclo de desarrollo, no al final</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Contract testing</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Validar que la interfaz (contrato) entre dos servicios se respeta — por ejemplo, que una API devuelve los campos esperados</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Test flakiness</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Test que a veces pasa y a veces falla sin cambios en el codigo. Causas comunes: timing, datos compartidos, dependencias externas</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Smoke test</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Suite minima y rapida que verifica que la aplicacion funciona a nivel basico despues de un deploy</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Regression test</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Suite que verifica que funcionalidades existentes no se rompieron despues de un cambio</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Visual regression</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Comparar screenshots de la UI antes y despues de un cambio para detectar diferencias visuales no intencionales</td>
                </tr>
            </table>
        </div>

        <h3>Docker</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #e0e0e0;">
                    <th style="padding: 8px; border: 1px solid #ddd; width: 25%;">Termino</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Definicion</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Imagen</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Plantilla de solo lectura con todo lo necesario para ejecutar una aplicacion (codigo, runtime, librerias). Se construye con un <code>Dockerfile</code></td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Contenedor</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Instancia en ejecucion de una imagen. Es aislado, ligero y efimero — se crea, se usa y se destruye</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Dockerfile</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Archivo de texto con instrucciones paso a paso para construir una imagen Docker</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Volume</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Mecanismo para persistir datos fuera del contenedor. Util para extraer reportes de tests</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Docker Compose</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Herramienta para definir y ejecutar multiples contenedores con un solo archivo <code>docker-compose.yml</code></td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Registry</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Repositorio de imagenes Docker. Docker Hub es el publico; las empresas usan registries privados (GCP Artifact Registry, AWS ECR)</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Layer (capa)</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Cada instruccion del Dockerfile crea una capa. Docker cachea capas para acelerar builds</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Multi-stage build</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Tecnica para crear imagenes mas pequeñas usando multiples etapas de build, descartando lo que no se necesita en la imagen final</td>
                </tr>
            </table>
        </div>

        <h3>Kubernetes (K8s)</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #e0e0e0;">
                    <th style="padding: 8px; border: 1px solid #ddd; width: 25%;">Termino</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Definicion</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Cluster</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Conjunto de maquinas (nodos) que ejecutan aplicaciones containerizadas gestionadas por Kubernetes</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Pod</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Unidad minima en K8s. Uno o mas contenedores que comparten red y almacenamiento. Analogia: un Pod es como un "mini servidor"</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Node</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Maquina (fisica o virtual) dentro del cluster que ejecuta Pods</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Deployment</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Recurso que define cuantas replicas de un Pod deben ejecutarse y como actualizarlas</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Service</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Punto de acceso estable para un grupo de Pods. Los Pods cambian, pero el Service mantiene una IP/DNS fija</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Ingress</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Reglas para exponer servicios al exterior (rutas HTTP, TLS, balanceo de carga)</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Namespace</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Division logica del cluster para aislar recursos (ej: namespace "qa", "staging", "produccion")</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Helm</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Gestor de paquetes para K8s. Permite instalar aplicaciones complejas con un solo comando usando "charts"</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>ConfigMap / Secret</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Recursos para inyectar configuracion (ConfigMap) o datos sensibles (Secret) en los Pods sin hardcodear</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>CronJob</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Recurso que ejecuta Pods en un horario programado. Util para ejecutar suites de regression tests periodicamente</td>
                </tr>
            </table>
        </div>

        <h3>Google Cloud Platform (GCP)</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #e0e0e0;">
                    <th style="padding: 8px; border: 1px solid #ddd; width: 25%;">Servicio</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Que es y como se relaciona con QA</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>GKE (Google Kubernetes Engine)</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Kubernetes administrado por Google. Es donde corren las aplicaciones que testeas. Tambien puedes ejecutar tus tests en Pods de GKE</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Cloud Run</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Ejecuta contenedores sin gestionar infraestructura (serverless). Ideal para correr suites de tests bajo demanda</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Cloud Build</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Servicio de CI/CD nativo de GCP. Construye imagenes, ejecuta tests y despliega — similar a GitHub Actions pero integrado con GCP</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Artifact Registry</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Registry privado para imagenes Docker en GCP. Aqui se almacenan las imagenes de tus tests containerizados</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Cloud Storage</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Almacenamiento de objetos. Util para guardar reportes de tests, screenshots y artefactos de CI/CD</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>IAM (Identity and Access Management)</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Sistema de permisos de GCP. Define quien puede hacer que. Como QA necesitas permisos para acceder a ambientes de testing</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Cloud Logging / Monitoring</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Herramientas para ver logs y metricas. Como QA las usas para investigar fallos en ambientes de staging/QA</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Secret Manager</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Almacena credenciales y API keys de forma segura. Tus tests en CI/CD obtienen credenciales de aqui, no de archivos .env</td>
                </tr>
            </table>
        </div>

        <h3>CI/CD y DevOps</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #e0e0e0;">
                    <th style="padding: 8px; border: 1px solid #ddd; width: 25%;">Termino</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Definicion</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Pipeline</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Secuencia automatizada de pasos: build → test → deploy. Se ejecuta al hacer push o merge</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Stage / Job</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Un Stage agrupa Jobs relacionados. Un Job es una tarea especifica (ej: "ejecutar tests E2E")</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Runner / Agent</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Maquina que ejecuta los Jobs del pipeline. Puede ser propia (self-hosted) o en la nube</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Artifact</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Archivo generado por el pipeline que se guarda para uso posterior: reportes HTML, screenshots, binarios</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Canary deploy</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Desplegar una nueva version solo al 5-10% de los usuarios. Si no hay errores, se expande al 100%</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Blue-green deploy</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Tener dos ambientes identicos (blue y green). Desplegar en green, verificar, y redirigir trafico. Rollback instantaneo si falla</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Chaos testing</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Introducir fallos controlados (matar Pods, cortar red) para validar que el sistema se recupera correctamente</td>
                </tr>
            </table>
        </div>

        <h3>Networking</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #e0e0e0;">
                    <th style="padding: 8px; border: 1px solid #ddd; width: 25%;">Termino</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Definicion</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>API Gateway</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Punto de entrada unico para multiples APIs/microservicios. Maneja autenticacion, rate limiting y ruteo</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Load Balancer</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Distribuye trafico entre multiples instancias de una aplicacion para evitar sobrecargas</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>DNS</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Sistema que traduce nombres (app.siesa.com) a direcciones IP. Relevante para configurar ambientes de testing</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>TLS/SSL</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Protocolo de encriptacion para HTTPS. Los tests deben validar que los certificados estan configurados correctamente</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>CORS</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Cross-Origin Resource Sharing. Reglas del navegador que controlan que dominios pueden hacer requests a tu API</td>
                </tr>
            </table>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>En SIESA utilizamos <strong>GKE + Cloud Build</strong> para ejecutar nuestras suites de automatizacion.
            Los tests corren en contenedores dentro de Kubernetes, los reportes se almacenan en Cloud Storage,
            y las credenciales se gestionan con Secret Manager. Entender estos conceptos te permite
            colaborar mejor con el equipo de DevOps y diseñar tests que funcionen en la infraestructura real.</p>
        </div>
    `,
    topics: ["glosario", "docker", "kubernetes", "GCP", "CI/CD", "networking", "referencia"],
    hasCode: false,
    hasExercise: false,
    estimatedTime: 15,
    difficulty: "easy",
    type: "reference"
};

if (typeof window !== 'undefined') {
    window.LESSON_139 = LESSON_139;
}
