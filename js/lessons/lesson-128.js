/**
 * Playwright Academy - Leccion 128
 * Code review y estandares QA
 * Seccion 19: Best Practices y Patrones
 */

const LESSON_128 = {
    id: 128,
    title: "Code review y estándares QA",
    duration: "7 min",
    level: "advanced",
    section: "section-19",
    content: `
        <h2>Code review y estandares QA</h2>
        <p>El code review de codigo de tests es tan importante como el review del codigo de produccion.
        Tests mal escritos generan falsos positivos, falsos negativos y deuda tecnica que crece
        silenciosamente. En esta leccion estableceras <strong>checklists de review</strong>,
        <strong>quality gates</strong> automatizados y <strong>estandares</strong> que aseguran la
        calidad de tu suite de automatizacion.</p>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>En SIESA, todo PR que modifique tests pasa por un review obligatorio de al menos un
            QA senior. Ademas, el pipeline incluye quality gates automaticos: linting, verificacion
            de naming conventions, y cobertura minima de assertions. Esto ha reducido los defectos
            en la suite de tests en un 60% desde su implementacion.</p>
        </div>

        <h3>Checklist de code review para tests</h3>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Categoria</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Verificar</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;" rowspan="3"><strong>Naming</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Nombre del test describe accion + resultado esperado</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Archivo sigue convencion test_[feature].py</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Variables tienen nombres descriptivos (no x, temp, data)</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;" rowspan="3"><strong>Estructura</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Patron AAA claramente identificable</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Un test = una validacion (foco unico)</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Test independiente (no depende de orden)</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;" rowspan="3"><strong>Selectores</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Usa data-testid o roles (no CSS fragil)</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">No usa nth-child, XPath posicional</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Selectores definidos como constantes, no strings magicos</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;" rowspan="3"><strong>Waits</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">No usa sleep() ni wait_for_timeout()</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Usa expect() para assertions con retry</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Espera por condicion especifica, no por tiempo</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;" rowspan="2"><strong>Datos</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Test crea sus propios datos (no depende de estado previo)</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Cleanup configurado (fixture con yield o API delete)</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;" rowspan="2"><strong>Assertions</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Al menos una assertion significativa por test</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Assertions verifican comportamiento, no implementacion</td>
                </tr>
            </table>
        </div>

        <h3>Linting automatizado con flake8 y pylint</h3>

        <pre><code class="python"># pyproject.toml - Configuracion de linting
[tool.flake8]
max-line-length = 120
exclude = [".venv", "__pycache__", "reports", "test-results"]
per-file-ignores = [
    "conftest.py:F401,F811",  # Permitir imports no usados y redefinicion en conftest
]

[tool.pylint.messages_control]
disable = [
    "missing-module-docstring",   # No requerir docstrings en modulos de test
    "missing-class-docstring",
    "too-few-public-methods",     # Page Objects pueden tener pocos metodos
    "redefined-outer-name",       # Pytest fixtures redefinen nombres
]

[tool.pylint.format]
max-line-length = 120

# Ejecutar:
# flake8 tests/ pages/ services/
# pylint tests/ pages/ services/ --rcfile=pyproject.toml</code></pre>

        <h3>Pre-commit hooks para calidad</h3>

        <pre><code class="yaml"># .pre-commit-config.yaml
repos:
  - repo: https://github.com/psf/black
    rev: 24.3.0
    hooks:
      - id: black
        args: [--line-length=120]

  - repo: https://github.com/pycqa/isort
    rev: 5.13.2
    hooks:
      - id: isort
        args: [--profile=black, --line-length=120]

  - repo: https://github.com/pycqa/flake8
    rev: 7.0.0
    hooks:
      - id: flake8
        args: [--max-line-length=120]
        additional_dependencies: [flake8-bugbear]

  - repo: local
    hooks:
      - id: check-test-naming
        name: Verify test naming conventions
        entry: python scripts/check_test_names.py
        language: python
        files: test_.*\\.py$
        pass_filenames: true

# Instalar: pre-commit install
# Ejecutar manual: pre-commit run --all-files</code></pre>

        <h3>Script de verificacion de naming</h3>

        <pre><code class="python"># scripts/check_test_names.py
"""Pre-commit hook: verificar convenciones de nombres en tests."""
import ast
import sys

VALID_PREFIXES = ["test_"]
BANNED_NAMES = ["test_1", "test_2", "test_a", "test_b", "test_temp", "test_debug"]

def check_file(filepath):
    errors = []
    with open(filepath) as f:
        tree = ast.parse(f.read())

    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef) and node.name.startswith("test_"):
            name = node.name

            # Verificar longitud minima
            if len(name) < 15:
                errors.append(
                    f"  {filepath}:{node.lineno} - '{name}' es demasiado corto. "
                    f"Usa test_[accion]_[resultado]"
                )

            # Verificar nombres prohibidos
            if name in BANNED_NAMES:
                errors.append(
                    f"  {filepath}:{node.lineno} - '{name}' es un nombre generico prohibido"
                )

            # Verificar que no sea solo numeros despues de test_
            suffix = name.replace("test_", "", 1)
            if suffix.isdigit():
                errors.append(
                    f"  {filepath}:{node.lineno} - '{name}' usa numeros. "
                    f"Describe la funcionalidad"
                )

    return errors

if __name__ == "__main__":
    all_errors = []
    for filepath in sys.argv[1:]:
        all_errors.extend(check_file(filepath))

    if all_errors:
        print("Errores de naming convention:")
        for error in all_errors:
            print(error)
        sys.exit(1)

    sys.exit(0)</code></pre>

        <h3>Quality gates en CI</h3>

        <pre><code class="yaml"># .github/workflows/quality-gate.yml
name: QA Quality Gate

on: [pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install tools
        run: pip install flake8 black isort pylint

      - name: Code formatting (black)
        run: black --check tests/ pages/ services/ --line-length=120

      - name: Import order (isort)
        run: isort --check-only tests/ pages/ services/ --profile=black

      - name: Linting (flake8)
        run: flake8 tests/ pages/ services/ --max-line-length=120

      - name: Test naming conventions
        run: python scripts/check_test_names.py tests/**/*.py

      - name: No sleep() in tests
        run: |
          if grep -r "time.sleep\|wait_for_timeout" tests/; then
            echo "ERROR: Se encontraron sleep/wait_for_timeout en tests"
            exit 1
          fi

      - name: No hardcoded passwords
        run: |
          if grep -rn "password.*=.*['\"]" tests/ --include="*.py" | grep -v "data-testid\|placeholder\|fixture\|#"; then
            echo "WARNING: Posibles passwords hardcoded"
          fi</code></pre>

        <h3>Metricas de calidad de la suite</h3>

        <pre><code class="python"># scripts/suite_metrics.py
"""Calcular metricas de calidad de la suite de tests."""
import ast
import os
from pathlib import Path

def analyze_test_suite(tests_dir="tests"):
    metrics = {
        "total_files": 0,
        "total_tests": 0,
        "tests_with_docstring": 0,
        "tests_with_aaa_comments": 0,
        "avg_test_length": 0,
        "tests_using_sleep": 0,
        "tests_with_assertion": 0,
    }

    all_lengths = []

    for py_file in Path(tests_dir).rglob("test_*.py"):
        metrics["total_files"] += 1
        source = py_file.read_text()
        tree = ast.parse(source)

        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef) and node.name.startswith("test_"):
                metrics["total_tests"] += 1

                # Longitud del test
                end_line = node.end_lineno or node.lineno
                length = end_line - node.lineno
                all_lengths.append(length)

                # Tiene docstring?
                if (node.body and isinstance(node.body[0], ast.Expr)
                        and isinstance(node.body[0].value, ast.Constant)):
                    metrics["tests_with_docstring"] += 1

        # Buscar patrones en el source
        if "# ARRANGE" in source or "# Arrange" in source:
            metrics["tests_with_aaa_comments"] += source.count("# ARRANGE")
        if "time.sleep" in source or "wait_for_timeout" in source:
            metrics["tests_using_sleep"] += source.count("sleep")

    if all_lengths:
        metrics["avg_test_length"] = sum(all_lengths) / len(all_lengths)

    return metrics

if __name__ == "__main__":
    m = analyze_test_suite()
    print(f"Archivos de test: {m['total_files']}")
    print(f"Total tests: {m['total_tests']}")
    print(f"Con docstring: {m['tests_with_docstring']} ({m['tests_with_docstring']/max(m['total_tests'],1)*100:.0f}%)")
    print(f"Longitud promedio: {m['avg_test_length']:.0f} lineas")
    print(f"Usando sleep: {m['tests_using_sleep']} (objetivo: 0)")</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Ejercicio Practico</h4>
            <ol>
                <li>Crea un script <code>check_test_names.py</code> que verifique convenciones de naming</li>
                <li>Configura <code>.pre-commit-config.yaml</code> con black, isort, flake8 y tu hook personalizado</li>
                <li>Crea un quality gate en GitHub Actions que bloquee PRs con sleep() en tests</li>
                <li>Implementa <code>suite_metrics.py</code> que reporte metricas de la suite</li>
                <li>Documenta tu checklist de code review en un archivo compartido</li>
            </ol>
        </div>

        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Felicidades!</strong> Has completado la <strong>Seccion 19: Best Practices y
            Patrones</strong>. En la siguiente y ultima seccion pondras todo en practica con
            <strong>Proyectos Capstone</strong> que integran todos los conocimientos adquiridos
            a lo largo de las 135 lecciones de la Playwright Academy.</p>
        </div>
    `,
    topics: ["code-review", "estándares", "qa"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_128 = LESSON_128;
}
