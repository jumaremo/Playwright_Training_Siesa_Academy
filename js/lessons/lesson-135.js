/**
 * Playwright Academy - Leccion 135
 * Proyecto Final: Certificacion QA Playwright
 * Seccion 20: Proyectos Capstone
 */

const LESSON_135 = {
    id: 135,
    title: "Proyecto Final: Certificación QA Playwright",
    duration: "25 min",
    level: "advanced",
    section: "section-20",
    content: `
        <h2>Proyecto Final: Certificacion QA Playwright</h2>

        <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 15px 0; text-align: center;">
            <h3 style="color: #2e7d32; margin: 0;">Has llegado a la leccion 135 de 135</h3>
            <p style="font-size: 1.1em;">20 secciones. 135 lecciones. Cientos de ejemplos de codigo.
            Todo el conocimiento necesario para ser un <strong>QA Engineer experto en Playwright con Python</strong>.</p>
        </div>

        <p>Este proyecto final es tu <strong>certificacion</strong>. Integra TODO lo que has aprendido
        en un framework de testing completo y funcional. No es un ejercicio teorico — es un proyecto
        que podrias usar en un trabajo real.</p>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>Este proyecto de certificacion esta alineado con los estandares de calidad de SIESA.
            Los QA Engineers que completan este proyecto demuestran competencia en las mismas
            herramientas y patrones que utilizamos en produccion. Varios miembros del equipo de QA
            de SIESA han seguido un camino de aprendizaje similar.</p>
        </div>

        <h3>Resumen del viaje</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Nivel</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Secciones</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Temas clave</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Basico (1-6)</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Entorno, Fundamentos, Python, Interacciones, Localizadores, Avanzado</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Setup, navegacion, selectores, formularios, waits</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Intermedio (7-14)</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">POM, Auto-wait, Network, API, DB, Data-Driven, Contexts, Reporting</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Page Objects, mocking, API testing, data-driven</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Avanzado (15-20)</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Visual, Accessibility, CI/CD, Enterprise, Best Practices, Capstone</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Visual regression, CI/CD, arquitectura, patrones</td>
                </tr>
            </table>
        </div>

        <h3>Requisitos del proyecto de certificacion</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Construye un framework completo que incluya:</h4>
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">#</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Requisito</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Secciones relacionadas</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">1</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Arquitectura en capas</strong> (pages, services, fixtures, tests)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">7, 18</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">2</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Page Object Model</strong> con BasePage + 5 paginas concretas</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">7, 18</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">3</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>20+ tests E2E</strong> cubriendo flujos criticos</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">4, 5, 6</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">4</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>API testing</strong> con Playwright API context (10+ tests)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">10, 11</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">5</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Data-driven tests</strong> con parametrize y datos externos</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">12</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">6</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>CI/CD pipeline</strong> funcional con GitHub Actions</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">17</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">7</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Best practices</strong>: naming, AAA, selectores estables, no sleep</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">19</td>
                </tr>
            </table>
        </div>

        <h3>Estructura esperada del proyecto</h3>

        <pre><code class="text">playwright-certification-project/
├── config/
│   ├── settings.py              # Configuracion multi-entorno
│   └── environments.yaml        # URLs por entorno
├── pages/
│   ├── base_page.py             # 10+ metodos reutilizables
│   ├── components/              # Componentes compartidos
│   ├── login_page.py
│   ├── dashboard_page.py
│   ├── [3 paginas mas]
├── services/
│   ├── api_client.py            # Cliente API base
│   └── auth_service.py          # Login via API
├── builders/
│   └── user_builder.py          # Patron Builder
├── factories/
│   └── page_factory.py          # Patron Factory
├── fixtures/
│   ├── auth_fixtures.py
│   └── data_fixtures.py
├── data/
│   ├── test_users.json
│   └── performance_baselines.json
├── tests/
│   ├── conftest.py
│   ├── smoke/                   # 5+ smoke tests
│   ├── e2e/                     # 15+ tests E2E
│   ├── api/                     # 10+ tests API
│   └── performance/             # Tests de metricas
├── .github/workflows/
│   └── playwright.yml           # CI/CD pipeline
├── pyproject.toml               # Configuracion completa
├── requirements.txt
├── Makefile
└── README.md                    # Documentacion del proyecto</code></pre>

        <h3>Rubrica de evaluacion</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Categoria</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Criterio</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Pts</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;" rowspan="2"><strong>Arquitectura (20)</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Estructura de directorios correcta y logica</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">10</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Configuracion multi-entorno funcional</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">10</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;" rowspan="2"><strong>Page Objects (15)</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">BasePage con 10+ metodos reutilizables</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">8</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">5+ Page Objects concretos con herencia</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">7</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;" rowspan="2"><strong>Tests E2E (20)</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">20+ tests con patron AAA claro</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">12</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Naming conventions consistentes</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">8</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>API Tests (10)</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">10+ tests de API con validacion de schema</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">10</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Data-Driven (10)</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Tests parametrizados + datos externos</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">10</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>CI/CD (10)</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Pipeline funcional con lint + test + report</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">10</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Patrones (10)</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Builder, Factory, fixtures con cleanup</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">10</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Calidad (5)</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Sin sleep(), selectores estables, codigo limpio</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">5</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;" colspan="2">TOTAL</td>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">100</td>
                </tr>
            </table>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Escala de calificacion</h4>
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #ffe0b2;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Puntaje</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Nivel</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripcion</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">90 - 100</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Excepcional</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Framework de nivel senior, listo para produccion</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">80 - 89</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Aprobado</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Competencia solida demostrada</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">70 - 79</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Competente</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Buen nivel con areas de mejora</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">< 70</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>En desarrollo</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Revisar secciones debiles y reintentar</td>
                </tr>
            </table>
            <p><strong>Puntaje minimo para certificacion: 80/100</strong></p>
        </div>

        <h3>Checklist de entrega</h3>

        <pre><code class="python"># scripts/verify_certification.py
"""Script de verificacion para el proyecto de certificacion."""
import os
from pathlib import Path

def verify_project(project_dir="."):
    p = Path(project_dir)
    checks = []

    # 1. Estructura
    checks.append(("config/settings.py existe", (p / "config/settings.py").exists()))
    checks.append(("pages/base_page.py existe", (p / "pages/base_page.py").exists()))
    checks.append(("services/ existe", (p / "services").is_dir()))
    checks.append(("fixtures/ existe", (p / "fixtures").is_dir()))
    checks.append(("tests/ existe", (p / "tests").is_dir()))

    # 2. Page Objects
    page_files = list(p.glob("pages/**/*_page.py"))
    checks.append((f"5+ Page Objects ({len(page_files)} encontrados)", len(page_files) >= 5))

    # 3. Tests
    test_files = list(p.glob("tests/**/test_*.py"))
    checks.append((f"Test files ({len(test_files)} encontrados)", len(test_files) >= 5))

    # 4. CI/CD
    ci_exists = (p / ".github/workflows").exists() or (p / ".gitlab-ci.yml").exists()
    checks.append(("CI/CD configurado", ci_exists))

    # 5. Configuracion
    checks.append(("pyproject.toml existe", (p / "pyproject.toml").exists()))
    checks.append(("requirements.txt existe", (p / "requirements.txt").exists()))

    # 6. Calidad
    import subprocess
    result = subprocess.run(
        ["grep", "-r", "time.sleep", "tests/"],
        capture_output=True, text=True, cwd=project_dir
    )
    checks.append(("Sin sleep() en tests", result.returncode != 0))

    # Reporte
    print("\\n=== VERIFICACION DE CERTIFICACION ===\\n")
    passed = 0
    for description, result in checks:
        status = "PASS" if result else "FAIL"
        icon = "+" if result else "-"
        print(f"  [{icon}] {description}")
        if result:
            passed += 1

    total = len(checks)
    print(f"\\n  Resultado: {passed}/{total} checks pasaron")
    print(f"  {'LISTO PARA ENTREGAR' if passed == total else 'REVISAR ITEMS FALLIDOS'}")

if __name__ == "__main__":
    verify_project()</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Ejercicio Final: Autoevaluacion</h4>
            <p>Antes de entregar tu proyecto, verifica cada uno de estos items:</p>
            <ol>
                <li>Ejecuta <code>python scripts/verify_certification.py</code></li>
                <li>Ejecuta <code>make lint</code> — sin errores</li>
                <li>Ejecuta <code>make test</code> — todos los tests pasan</li>
                <li>Ejecuta <code>make smoke</code> — smoke tests pasan en < 2 min</li>
                <li>Verifica que puedes ejecutar tests en al menos 2 navegadores</li>
                <li>Verifica que el CI/CD pipeline esta configurado correctamente</li>
            </ol>
        </div>

        <h3>Recursos para seguir aprendiendo</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <ul>
                <li><strong>Documentacion oficial:</strong> playwright.dev (Python docs)</li>
                <li><strong>GitHub:</strong> microsoft/playwright-python</li>
                <li><strong>Community:</strong> Playwright Discord, Stack Overflow</li>
                <li><strong>pytest:</strong> docs.pytest.org</li>
                <li><strong>Conferencias:</strong> Playwright Conf (videos en YouTube)</li>
                <li><strong>Practica:</strong> demo.playwright.dev/todomvc, automationexercise.com</li>
            </ul>
        </div>

        <h3>Proximos pasos sugeridos</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Plazo</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Objetivo</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>1 mes</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Aplicar lo aprendido en un proyecto real de tu equipo</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>3 meses</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Tener un framework de testing en produccion con CI/CD</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>6 meses</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Liderar la estrategia de automatizacion de tu equipo</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>1 año</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Ser referente de Playwright y mentorear a otros QA</td>
                </tr>
            </table>
        </div>

        <div style="background: #e8f5e9; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center; border: 2px solid #4caf50;">
            <h3 style="color: #2e7d32; margin-top: 0;">Felicidades, has completado la Playwright Academy</h3>
            <p style="font-size: 1.15em; margin: 15px 0;">
                Has recorrido 20 secciones y 135 lecciones. Desde instalar Python y Playwright
                hasta diseñar frameworks enterprise con CI/CD.
            </p>
            <p style="font-size: 1.1em; margin: 15px 0;">
                Ahora tienes las herramientas, los patrones y la experiencia para
                <strong>automatizar cualquier aplicacion web con confianza</strong>.
            </p>
            <p style="font-size: 1em; color: #555; margin-top: 20px;">
                <em>"La calidad no es un acto, es un habito."</em> — Aristoteles
            </p>
            <p style="margin-top: 15px;">
                <strong>Playwright Academy</strong> — 135 Lecciones Practicas para QA Engineers<br>
                SIESA — I&D Equipo de Procesos y Calidad de Software
            </p>
        </div>
    `,
    topics: ["certificación", "proyecto-final", "capstone"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 25,
    difficulty: "hard",
    type: "capstone"
};

if (typeof window !== 'undefined') {
    window.LESSON_135 = LESSON_135;
}
