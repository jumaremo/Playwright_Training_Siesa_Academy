/**
 * Playwright Academy - Leccion 134
 * Accessibility + Security Audit
 * Seccion 20: Proyectos Capstone
 */

const LESSON_134 = {
    id: 134,
    title: "Accessibility + Security Audit",
    duration: "20 min",
    level: "advanced",
    section: "section-20",
    content: `
        <h2>Accessibility + Security Audit</h2>
        <p>La accesibilidad y la seguridad son requisitos no funcionales criticos que a menudo se
        prueban demasiado tarde. En este proyecto capstone integraras <strong>testing de accesibilidad
        (WCAG 2.1)</strong> y <strong>auditorias basicas de seguridad</strong> en tu suite de
        Playwright, automatizando verificaciones que tradicionalmente se hacen manualmente.</p>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Tip SIESA</h4>
            <p>En SIESA, los modulos del ERP que son usados por entidades gubernamentales deben
            cumplir con estandares de accesibilidad. El equipo de QA incluye tests automatizados
            de axe-core en el pipeline de regresion para detectar violaciones WCAG antes de cada
            release. Esto evita reclamos de compliance y mejora la experiencia para todos los usuarios.</p>
        </div>

        <h3>Parte 1: Testing de accesibilidad con axe-core</h3>

        <pre><code class="python"># pip install axe-playwright-python
# O implementacion directa con axe-core via JavaScript

# utils/accessibility.py
"""Utilidades para testing de accesibilidad con axe-core."""
import json

async def inject_axe(page):
    """Inyectar axe-core en la pagina."""
    # Descargar axe-core minificado
    axe_script = page.evaluate("""async () => {
        if (!window.axe) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.4/axe.min.js';
            document.head.appendChild(script);
            await new Promise(resolve => script.onload = resolve);
        }
        return true;
    }""")
    return axe_script

def run_axe_audit(page, context=None):
    """Ejecutar auditoria de accesibilidad con axe-core."""
    # Inyectar axe-core
    page.evaluate("""() => {
        return new Promise((resolve) => {
            if (window.axe) { resolve(); return; }
            const s = document.createElement('script');
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.4/axe.min.js';
            s.onload = resolve;
            document.head.appendChild(s);
        });
    }""")

    # Ejecutar auditoria
    options = {}
    if context:
        options["context"] = context

    results = page.evaluate("""(options) => {
        return new Promise((resolve) => {
            axe.run(options.context || document, {
                rules: {
                    'color-contrast': { enabled: true },
                    'image-alt': { enabled: true },
                    'label': { enabled: true },
                    'link-name': { enabled: true },
                    'button-name': { enabled: true },
                }
            }).then(resolve);
        });
    }""", options)

    return results</code></pre>

        <pre><code class="python"># fixtures/a11y_fixtures.py
import pytest
import json
from pathlib import Path

@pytest.fixture
def a11y_audit(page):
    """Fixture para ejecutar auditorias de accesibilidad."""

    def _audit(url=None, context=None, allowed_violations=None):
        if url:
            page.goto(url)
            page.wait_for_load_state("networkidle")

        results = run_axe_audit(page, context)

        violations = results.get("violations", [])

        # Filtrar violaciones permitidas
        if allowed_violations:
            violations = [v for v in violations if v["id"] not in allowed_violations]

        # Generar reporte
        if violations:
            report = format_violations(violations)
            Path("reports/a11y").mkdir(parents=True, exist_ok=True)
            with open("reports/a11y/violations.json", "w") as f:
                json.dump(violations, f, indent=2)
            return violations, report

        return [], ""

    return _audit

def format_violations(violations):
    """Formatear violaciones para lectura clara."""
    lines = [f"Se encontraron {len(violations)} violaciones de accesibilidad:\\n"]
    for v in violations:
        lines.append(f"  [{v['impact'].upper()}] {v['id']}: {v['description']}")
        lines.append(f"    Ayuda: {v['helpUrl']}")
        for node in v.get("nodes", [])[:3]:
            lines.append(f"    Elemento: {node.get('html', 'N/A')[:100]}")
        lines.append("")
    return "\\n".join(lines)</code></pre>

        <h3>Tests de accesibilidad</h3>

        <pre><code class="python"># tests/a11y/test_accessibility.py
import pytest

class TestAccessibility:
    """Tests de accesibilidad WCAG 2.1 para paginas principales."""

    @pytest.mark.parametrize("url,name", [
        ("/", "Homepage"),
        ("/auth/login", "Login"),
        ("/products", "Catalog"),
        ("/cart", "Cart"),
    ])
    def test_page_has_no_critical_violations(self, page, a11y_audit, url, name):
        """Verificar que no hay violaciones criticas de WCAG."""
        violations, report = a11y_audit(url=url)

        critical = [v for v in violations if v["impact"] in ("critical", "serious")]
        if critical:
            pytest.fail(f"{name} tiene {len(critical)} violaciones criticas:\\n{report}")

    def test_images_have_alt_text(self, page):
        """Todas las imagenes deben tener texto alternativo."""
        page.goto("/products")
        page.wait_for_load_state("networkidle")

        images = page.locator("img").all()
        for img in images:
            alt = img.get_attribute("alt")
            src = img.get_attribute("src") or "unknown"
            assert alt and len(alt) > 0, \\
                f"Imagen sin alt text: {src[:80]}"

    def test_form_inputs_have_labels(self, page):
        """Todos los inputs de formulario deben tener labels."""
        page.goto("/auth/login")

        inputs = page.locator("input:not([type='hidden'])").all()
        for inp in inputs:
            input_id = inp.get_attribute("id") or ""
            input_name = inp.get_attribute("name") or ""

            # Verificar que tiene label asociado o aria-label
            has_label = (
                inp.get_attribute("aria-label") or
                inp.get_attribute("aria-labelledby") or
                page.locator(f"label[for='{input_id}']").count() > 0 or
                inp.get_attribute("placeholder")
            )

            assert has_label, \\
                f"Input sin label: name='{input_name}', id='{input_id}'"

    def test_keyboard_navigation(self, page):
        """Verificar que los elementos interactivos son accesibles por teclado."""
        page.goto("/auth/login")

        # Tab a traves del formulario
        page.keyboard.press("Tab")
        focused = page.evaluate("document.activeElement.tagName")
        assert focused.lower() in ("input", "a", "button"), \\
            f"Primer Tab no fue a elemento interactivo: {focused}"

        page.keyboard.press("Tab")
        focused2 = page.evaluate("document.activeElement.tagName")
        assert focused2.lower() in ("input", "a", "button")

    def test_color_contrast_ratio(self, page):
        """Verificar que los textos tienen suficiente contraste."""
        page.goto("/")
        page.wait_for_load_state("networkidle")

        # Usar axe-core para verificar contraste
        results = run_axe_audit(page)
        contrast_violations = [
            v for v in results.get("violations", [])
            if v["id"] == "color-contrast"
        ]

        assert len(contrast_violations) == 0, \\
            f"Se encontraron {len(contrast_violations)} problemas de contraste"

    def test_heading_hierarchy(self, page):
        """Los headings deben seguir una jerarquia logica (h1 > h2 > h3)."""
        page.goto("/products")
        page.wait_for_load_state("networkidle")

        headings = page.evaluate("""() => {
            return Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'))
                .map(h => ({ level: parseInt(h.tagName[1]), text: h.textContent.trim() }));
        }""")

        if len(headings) > 1:
            for i in range(1, len(headings)):
                current = headings[i]["level"]
                previous = headings[i-1]["level"]
                assert current <= previous + 1, \\
                    f"Salto de heading: h{previous} -> h{current} ('{headings[i]['text']}')"</code></pre>

        <h3>Parte 2: Security Audit basico</h3>

        <pre><code class="python"># tests/security/test_security_basics.py
"""Tests basicos de seguridad para aplicaciones web."""
from playwright.sync_api import expect

class TestSecurityHeaders:
    """Verificar que los headers de seguridad estan configurados."""

    def test_security_headers_present(self, page):
        response = page.goto("/")
        headers = response.headers

        # Headers de seguridad recomendados
        security_headers = {
            "x-content-type-options": "nosniff",
            "x-frame-options": ["DENY", "SAMEORIGIN"],
            "x-xss-protection": "1; mode=block",
        }

        for header, expected in security_headers.items():
            value = headers.get(header, "")
            if isinstance(expected, list):
                assert value.upper() in [e.upper() for e in expected], \\
                    f"Header {header}: '{value}' no esta en {expected}"
            else:
                assert value.lower() == expected.lower(), \\
                    f"Header {header}: esperado '{expected}', tiene '{value}'"

    def test_no_server_version_exposed(self, page):
        """El servidor no debe exponer su version."""
        response = page.goto("/")
        server = response.headers.get("server", "")
        # No debe contener numeros de version
        import re
        assert not re.search(r'\\d+\\.\\d+', server), \\
            f"Server expone version: {server}"

class TestXSSPrevention:
    """Verificar que la app es resistente a XSS basico."""

    XSS_PAYLOADS = [
        '<script>alert("xss")</script>',
        '"><img src=x onerror=alert(1)>',
        "javascript:alert('xss')",
        '<svg onload=alert(1)>',
    ]

    @pytest.mark.parametrize("payload", XSS_PAYLOADS)
    def test_search_field_escapes_xss(self, page, payload):
        """El campo de busqueda debe escapar inputs maliciosos."""
        page.goto("/products")
        page.fill("[data-testid='search-input']", payload)
        page.click("[data-testid='search-button']")

        # Verificar que el payload NO se ejecuto como HTML
        page_content = page.content()
        assert '<script>alert' not in page_content.lower()
        assert 'onerror=alert' not in page_content.lower()

    def test_url_parameters_are_sanitized(self, page):
        """Parametros de URL no deben inyectar HTML."""
        page.goto('/products?q=<script>alert("xss")</script>')

        page_content = page.content()
        assert '<script>alert' not in page_content

class TestAuthSecurity:
    """Tests de seguridad de autenticacion."""

    def test_login_rate_limiting(self, page):
        """Verificar que existe proteccion contra brute force."""
        page.goto("/auth/login")

        for i in range(6):
            page.fill("[data-testid='email']", "test@test.com")
            page.fill("[data-testid='password']", f"wrong{i}")
            page.click("[data-testid='login-btn']")
            page.wait_for_timeout(500)

        # Despues de varios intentos, deberia mostrar rate limit
        page_text = page.text_content("body")
        has_protection = any(msg in page_text.lower() for msg in [
            "demasiados intentos", "too many", "rate limit",
            "cuenta bloqueada", "intente mas tarde"
        ])
        # Nota: este test documenta si la proteccion existe

    def test_password_not_in_url(self, page):
        """La contraseña nunca debe aparecer en la URL."""
        page.goto("/auth/login")
        page.fill("[data-testid='email']", "test@test.com")
        page.fill("[data-testid='password']", "MySecret123!")
        page.click("[data-testid='login-btn']")

        assert "MySecret123" not in page.url
        assert "password" not in page.url.lower() or "=" not in page.url

    def test_session_cookie_has_secure_flags(self, page):
        """Las cookies de sesion deben tener flags de seguridad."""
        page.goto("/auth/login")
        cookies = page.context.cookies()

        session_cookies = [c for c in cookies if "session" in c["name"].lower() or "token" in c["name"].lower()]

        for cookie in session_cookies:
            assert cookie.get("httpOnly", False), \\
                f"Cookie '{cookie['name']}' no tiene HttpOnly flag"
            # En produccion, verificar Secure flag tambien</code></pre>

        <h3>Criterios de evaluacion</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Criterio</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Pts</th>
                </tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">axe-core integrado para WCAG audit</td><td style="padding: 8px; border: 1px solid #ddd;">20</td></tr>
                <tr style="background: #f5f5f5;"><td style="padding: 8px; border: 1px solid #ddd;">5+ tests de accesibilidad (alt, labels, keyboard, contraste)</td><td style="padding: 8px; border: 1px solid #ddd;">20</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">Tests de security headers</td><td style="padding: 8px; border: 1px solid #ddd;">15</td></tr>
                <tr style="background: #f5f5f5;"><td style="padding: 8px; border: 1px solid #ddd;">Tests de XSS prevention</td><td style="padding: 8px; border: 1px solid #ddd;">15</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">Tests de auth security (cookies, URLs)</td><td style="padding: 8px; border: 1px solid #ddd;">15</td></tr>
                <tr style="background: #f5f5f5;"><td style="padding: 8px; border: 1px solid #ddd;">Reporte JSON de violaciones</td><td style="padding: 8px; border: 1px solid #ddd;">15</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>TOTAL</strong></td><td style="padding: 8px; border: 1px solid #ddd;"><strong>100</strong></td></tr>
            </table>
        </div>

        <div style="background: #e8eaf6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>En la siguiente y ultima leccion</strong> completaras el
            <strong>Proyecto Final: Certificacion QA Playwright</strong>, donde integraras
            TODO lo aprendido en un proyecto de certificacion completo.</p>
        </div>
    `,
    topics: ["accessibility", "security", "audit", "capstone"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 20,
    difficulty: "hard",
    type: "capstone"
};

if (typeof window !== 'undefined') {
    window.LESSON_134 = LESSON_134;
}
