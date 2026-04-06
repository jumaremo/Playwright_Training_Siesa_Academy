/**
 * Playwright Academy - Lección 103
 * Security headers y HTTPS validation
 * Sección 15: Visual Regression y Accessibility Testing
 */

const LESSON_103 = {
    id: 103,
    title: "Security headers y HTTPS validation",
    duration: "7 min",
    level: "advanced",
    section: "section-15",
    content: `
        <h2>🔒 Security headers y HTTPS validation</h2>
        <p>Las pruebas de seguridad son un pilar fundamental en cualquier estrategia de QA madura.
        Los <strong>security headers HTTP</strong> son la primera línea de defensa de una aplicación web:
        indican al navegador cómo comportarse respecto a contenido, frames, scripts y conexiones.
        Con <strong>Playwright</strong> podemos automatizar la verificación de estos headers en cada
        despliegue, asegurando que la configuración de seguridad nunca se degrade.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📘 ¿Por qué importa la seguridad en testing?</h4>
            <p>Según OWASP, las <strong>configuraciones incorrectas de seguridad</strong> están entre
            los 10 riesgos más críticos de aplicaciones web. Muchas vulnerabilidades se previenen
            simplemente configurando los headers HTTP correctos. Automatizar estas verificaciones
            con Playwright garantiza que los headers se mantengan consistentes a lo largo del
            ciclo de vida del software.</p>
        </div>

        <h3>🛡️ Security headers HTTP: qué son y por qué importan</h3>
        <p>Los security headers son <strong>directivas enviadas por el servidor</strong> en las
        respuestas HTTP que instruyen al navegador sobre políticas de seguridad. Sin ellos, la
        aplicación queda expuesta a ataques como XSS, clickjacking, sniffing de contenido y más.</p>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Headers de seguridad esenciales</h4>
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                    <tr style="background: #c8e6c9;">
                        <th style="padding: 8px; border: 1px solid #a5d6a7; text-align: left;">Header</th>
                        <th style="padding: 8px; border: 1px solid #a5d6a7; text-align: left;">Protege contra</th>
                        <th style="padding: 8px; border: 1px solid #a5d6a7; text-align: left;">Valor recomendado</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;"><code>Content-Security-Policy</code></td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;">XSS, inyección de datos</td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;"><code>default-src 'self'</code></td>
                    </tr>
                    <tr style="background: #f1f8e9;">
                        <td style="padding: 8px; border: 1px solid #a5d6a7;"><code>X-Content-Type-Options</code></td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;">MIME-type sniffing</td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;"><code>nosniff</code></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;"><code>X-Frame-Options</code></td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;">Clickjacking</td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;"><code>DENY</code> o <code>SAMEORIGIN</code></td>
                    </tr>
                    <tr style="background: #f1f8e9;">
                        <td style="padding: 8px; border: 1px solid #a5d6a7;"><code>Strict-Transport-Security</code></td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;">Downgrade a HTTP</td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;"><code>max-age=31536000; includeSubDomains</code></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;"><code>Referrer-Policy</code></td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;">Fuga de información de URL</td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;"><code>strict-origin-when-cross-origin</code></td>
                    </tr>
                    <tr style="background: #f1f8e9;">
                        <td style="padding: 8px; border: 1px solid #a5d6a7;"><code>Permissions-Policy</code></td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;">Acceso a APIs del navegador</td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;"><code>camera=(), microphone=(), geolocation=()</code></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;"><code>X-XSS-Protection</code></td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;">XSS (legacy)</td>
                        <td style="padding: 8px; border: 1px solid #a5d6a7;"><code>1; mode=block</code></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>🔍 Verificar headers con Playwright</h3>
        <p>El método <code>page.goto()</code> de Playwright retorna un objeto <code>Response</code>
        que expone todos los headers de la respuesta HTTP. Esto lo convierte en una herramienta
        ideal para validar la configuración de seguridad.</p>

        <pre><code class="python"># test_security_headers_basic.py
"""
Verificación básica de security headers con Playwright.
page.goto() retorna un Response con acceso a todos los headers.
"""
from playwright.sync_api import sync_playwright, expect


def test_security_headers_presentes():
    """Verifica que los headers de seguridad esenciales están presentes."""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # page.goto() retorna un objeto Response
        response = page.goto("https://mi-aplicacion.com")

        # Obtener todos los headers de la respuesta
        headers = response.headers

        # Verificar Content-Security-Policy
        assert "content-security-policy" in headers, \\
            "Falta header Content-Security-Policy"

        # Verificar X-Content-Type-Options
        assert headers.get("x-content-type-options") == "nosniff", \\
            f"X-Content-Type-Options debería ser 'nosniff', " \\
            f"es '{headers.get('x-content-type-options')}'"

        # Verificar X-Frame-Options
        x_frame = headers.get("x-frame-options", "").upper()
        assert x_frame in ("DENY", "SAMEORIGIN"), \\
            f"X-Frame-Options debería ser DENY o SAMEORIGIN, es '{x_frame}'"

        # Verificar Strict-Transport-Security
        hsts = headers.get("strict-transport-security", "")
        assert "max-age=" in hsts, \\
            "Falta header Strict-Transport-Security con max-age"

        # Verificar Referrer-Policy
        assert "referrer-policy" in headers, \\
            "Falta header Referrer-Policy"

        print("✅ Todos los headers de seguridad esenciales están presentes")
        browser.close()</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>Los nombres de headers en Playwright siempre se devuelven en <strong>minúsculas</strong>.
            Aunque el servidor envíe <code>Content-Security-Policy</code>, en el diccionario
            <code>response.headers</code> lo encontrarás como <code>content-security-policy</code>.
            Tenlo en cuenta al escribir tus assertions.</p>
        </div>

        <h3>📋 Content-Security-Policy (CSP)</h3>
        <p>CSP es el header de seguridad más poderoso y complejo. Define qué fuentes de contenido
        están permitidas para scripts, estilos, imágenes, frames y más. Una CSP mal configurada
        puede dejar la puerta abierta a ataques XSS.</p>

        <pre><code class="python"># test_csp_validation.py
"""
Validación detallada de Content-Security-Policy.
Verifica que las directivas críticas estén correctamente configuradas.
"""
from playwright.sync_api import sync_playwright


def parse_csp(csp_value: str) -> dict:
    """Parsea un header CSP en un diccionario de directivas."""
    directivas = {}
    for parte in csp_value.split(";"):
        parte = parte.strip()
        if parte:
            tokens = parte.split()
            nombre = tokens[0]
            valores = tokens[1:] if len(tokens) > 1 else []
            directivas[nombre] = valores
    return directivas


def test_csp_directivas_criticas():
    """Verifica que CSP tenga directivas seguras configuradas."""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        response = page.goto("https://mi-aplicacion.com")
        headers = response.headers

        csp = headers.get("content-security-policy", "")
        assert csp, "El header Content-Security-Policy está vacío o ausente"

        directivas = parse_csp(csp)

        # Verificar que default-src está definido
        assert "default-src" in directivas, \\
            "CSP debe incluir directiva default-src"

        # Verificar que no se usa 'unsafe-inline' en script-src
        script_src = directivas.get("script-src", [])
        assert "'unsafe-inline'" not in script_src, \\
            "CSP script-src NO debe contener 'unsafe-inline'"

        # Verificar que no se usa 'unsafe-eval' en script-src
        assert "'unsafe-eval'" not in script_src, \\
            "CSP script-src NO debe contener 'unsafe-eval'"

        # Verificar que frame-ancestors está definido (protección anti-clickjacking)
        assert "frame-ancestors" in directivas, \\
            "CSP debe incluir frame-ancestors para proteger contra clickjacking"

        print("✅ CSP configurado correctamente")
        browser.close()</code></pre>

        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚠️ CSP con unsafe-inline o unsafe-eval</h4>
            <p>Si tu CSP contiene <code>'unsafe-inline'</code> o <code>'unsafe-eval'</code> en
            <code>script-src</code>, estás <strong>desactivando la protección contra XSS</strong>
            que CSP proporciona. Estas directivas permiten la ejecución de scripts inline y
            <code>eval()</code>, que son los vectores de ataque más comunes. Siempre repórtalas
            como hallazgo de seguridad.</p>
        </div>

        <h3>🔐 Strict-Transport-Security (HSTS)</h3>
        <p>HSTS indica al navegador que <strong>solo debe conectarse vía HTTPS</strong> durante
        un período de tiempo. Sin HSTS, un atacante podría interceptar la primera conexión HTTP
        y redirigir al usuario a un sitio falso (ataque de downgrade).</p>

        <pre><code class="python"># test_hsts.py
"""
Validación de Strict-Transport-Security (HSTS).
Verifica max-age adecuado e includeSubDomains.
"""
import re
from playwright.sync_api import sync_playwright


def test_hsts_configuracion():
    """Verifica que HSTS esté correctamente configurado."""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        response = page.goto("https://mi-aplicacion.com")
        headers = response.headers

        hsts = headers.get("strict-transport-security", "")
        assert hsts, "Falta header Strict-Transport-Security"

        # Extraer max-age
        match = re.search(r"max-age=(\\d+)", hsts)
        assert match, "HSTS debe incluir directiva max-age"

        max_age = int(match.group(1))
        # OWASP recomienda mínimo 1 año (31536000 segundos)
        assert max_age >= 31536000, \\
            f"HSTS max-age debería ser >= 31536000 (1 año), es {max_age}"

        # Verificar includeSubDomains
        assert "includesubdomains" in hsts.lower(), \\
            "HSTS debería incluir directiva includeSubDomains"

        print(f"✅ HSTS configurado: max-age={max_age}, includeSubDomains")
        browser.close()</code></pre>

        <h3>🌐 HTTPS validation y contenido mixto</h3>
        <p>Playwright permite verificar que una aplicación use HTTPS correctamente y detectar
        <strong>contenido mixto</strong> (recursos HTTP cargados desde una página HTTPS), lo cual
        degrada la seguridad y genera advertencias en el navegador.</p>

        <pre><code class="python"># test_https_validation.py
"""
Validación de HTTPS y detección de contenido mixto.
Intercepta solicitudes de red para identificar recursos inseguros.
"""
from playwright.sync_api import sync_playwright


def test_sin_contenido_mixto():
    """Verifica que no se carguen recursos HTTP desde una página HTTPS."""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Recopilar todas las solicitudes HTTP (no HTTPS)
        solicitudes_inseguras = []

        def capturar_request(request):
            if request.url.startswith("http://"):
                solicitudes_inseguras.append({
                    "url": request.url,
                    "tipo": request.resource_type
                })

        page.on("request", capturar_request)

        # Navegar a la página HTTPS
        response = page.goto("https://mi-aplicacion.com")

        # Verificar que la página principal es HTTPS
        assert response.url.startswith("https://"), \\
            f"La URL final debería ser HTTPS: {response.url}"

        # Esperar a que terminen de cargar todos los recursos
        page.wait_for_load_state("networkidle")

        # Reportar contenido mixto encontrado
        if solicitudes_inseguras:
            reporte = "\\n".join(
                f"  - [{r['tipo']}] {r['url']}"
                for r in solicitudes_inseguras
            )
            assert False, (
                f"Se detectaron {len(solicitudes_inseguras)} recursos "
                f"con contenido mixto (HTTP en página HTTPS):\\n{reporte}"
            )

        print("✅ Sin contenido mixto detectado")
        browser.close()


def test_https_redireccion():
    """Verifica que HTTP redirige correctamente a HTTPS."""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Intentar acceder vía HTTP
        response = page.goto("http://mi-aplicacion.com")

        # Verificar que la URL final es HTTPS
        assert page.url.startswith("https://"), \\
            f"HTTP debería redirigir a HTTPS. URL final: {page.url}"

        # Verificar código 200 después de redirección
        assert response.status == 200, \\
            f"Status después de redirección debería ser 200, es {response.status}"

        print("✅ Redirección HTTP → HTTPS funciona correctamente")
        browser.close()</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>En entornos de CI/CD, la detección de contenido mixto es crítica. Un solo recurso
            HTTP (una imagen, un script, un CSS) en una página HTTPS puede causar que el navegador
            muestre advertencias de seguridad o bloquee el recurso completamente. Automatizar
            esta verificación con Playwright previene regresiones silenciosas.</p>
        </div>

        <h3>🏗️ SecurityHeadersChecker: clase helper reutilizable</h3>
        <p>Para proyectos reales, conviene encapsular toda la lógica de verificación de seguridad
        en una clase helper que pueda reutilizarse en múltiples tests y configurarse según el
        nivel de exigencia del proyecto.</p>

        <pre><code class="python"># helpers/security_headers_checker.py
"""
Clase helper para validación de security headers y HTTPS.
Uso: instanciar con una respuesta de Playwright y verificar headers.
"""
import re
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class SecurityFinding:
    """Representa un hallazgo de seguridad."""
    severity: str       # "critical", "high", "medium", "low", "info"
    header: str         # Nombre del header
    message: str        # Descripción del problema
    recommendation: str # Recomendación de corrección


class SecurityHeadersChecker:
    """
    Verifica security headers HTTP y genera un reporte de hallazgos.

    Uso:
        response = page.goto("https://mi-app.com")
        checker = SecurityHeadersChecker(response)
        hallazgos = checker.verificar_todos()
        assert checker.es_seguro(), checker.reporte_texto()
    """

    HEADERS_REQUERIDOS = {
        "content-security-policy": {
            "severity": "high",
            "recommendation": "Configurar CSP con default-src 'self'"
        },
        "x-content-type-options": {
            "severity": "medium",
            "expected": "nosniff",
            "recommendation": "Agregar: X-Content-Type-Options: nosniff"
        },
        "x-frame-options": {
            "severity": "high",
            "expected_any": ["deny", "sameorigin"],
            "recommendation": "Agregar: X-Frame-Options: DENY"
        },
        "strict-transport-security": {
            "severity": "high",
            "recommendation": "Agregar: Strict-Transport-Security: "
                              "max-age=31536000; includeSubDomains"
        },
        "referrer-policy": {
            "severity": "medium",
            "recommendation": "Agregar: Referrer-Policy: "
                              "strict-origin-when-cross-origin"
        },
        "permissions-policy": {
            "severity": "medium",
            "recommendation": "Agregar: Permissions-Policy: "
                              "camera=(), microphone=(), geolocation=()"
        }
    }

    def __init__(self, response):
        """Inicializa con un objeto Response de Playwright."""
        self.response = response
        self.headers = response.headers
        self.url = response.url
        self.hallazgos: list[SecurityFinding] = []

    def verificar_todos(self) -> list[SecurityFinding]:
        """Ejecuta todas las verificaciones y retorna hallazgos."""
        self.hallazgos = []
        self._verificar_headers_presentes()
        self._verificar_csp()
        self._verificar_hsts()
        self._verificar_x_content_type()
        self._verificar_x_frame()
        self._verificar_referrer_policy()
        self._verificar_permissions_policy()
        return self.hallazgos

    def _verificar_headers_presentes(self):
        """Verifica que todos los headers requeridos estén presentes."""
        for header, config in self.HEADERS_REQUERIDOS.items():
            if header not in self.headers:
                self.hallazgos.append(SecurityFinding(
                    severity=config["severity"],
                    header=header,
                    message=f"Header '{header}' no encontrado",
                    recommendation=config["recommendation"]
                ))

    def _verificar_csp(self):
        """Verifica Content-Security-Policy en detalle."""
        csp = self.headers.get("content-security-policy", "")
        if not csp:
            return  # Ya reportado en _verificar_headers_presentes

        if "'unsafe-inline'" in csp:
            self.hallazgos.append(SecurityFinding(
                severity="high",
                header="content-security-policy",
                message="CSP contiene 'unsafe-inline'",
                recommendation="Eliminar 'unsafe-inline' y usar nonces o hashes"
            ))

        if "'unsafe-eval'" in csp:
            self.hallazgos.append(SecurityFinding(
                severity="critical",
                header="content-security-policy",
                message="CSP contiene 'unsafe-eval'",
                recommendation="Eliminar 'unsafe-eval', refactorizar código "
                               "que use eval()"
            ))

    def _verificar_hsts(self):
        """Verifica Strict-Transport-Security en detalle."""
        hsts = self.headers.get("strict-transport-security", "")
        if not hsts:
            return

        match = re.search(r"max-age=(\\d+)", hsts)
        if match:
            max_age = int(match.group(1))
            if max_age < 31536000:
                self.hallazgos.append(SecurityFinding(
                    severity="medium",
                    header="strict-transport-security",
                    message=f"HSTS max-age={max_age} es menor a 1 año",
                    recommendation="Usar max-age=31536000 (1 año) o superior"
                ))

        if "includesubdomains" not in hsts.lower():
            self.hallazgos.append(SecurityFinding(
                severity="low",
                header="strict-transport-security",
                message="HSTS no incluye directiva includeSubDomains",
                recommendation="Agregar includeSubDomains a HSTS"
            ))

    def _verificar_x_content_type(self):
        """Verifica X-Content-Type-Options."""
        valor = self.headers.get("x-content-type-options", "")
        if valor and valor.lower() != "nosniff":
            self.hallazgos.append(SecurityFinding(
                severity="medium",
                header="x-content-type-options",
                message=f"Valor incorrecto: '{valor}' (debería ser 'nosniff')",
                recommendation="Configurar: X-Content-Type-Options: nosniff"
            ))

    def _verificar_x_frame(self):
        """Verifica X-Frame-Options."""
        valor = self.headers.get("x-frame-options", "")
        if valor and valor.upper() not in ("DENY", "SAMEORIGIN"):
            self.hallazgos.append(SecurityFinding(
                severity="high",
                header="x-frame-options",
                message=f"Valor no seguro: '{valor}'",
                recommendation="Usar DENY o SAMEORIGIN"
            ))

    def _verificar_referrer_policy(self):
        """Verifica Referrer-Policy."""
        valor = self.headers.get("referrer-policy", "")
        politicas_inseguras = ["unsafe-url", "no-referrer-when-downgrade"]
        if valor and valor.lower() in politicas_inseguras:
            self.hallazgos.append(SecurityFinding(
                severity="medium",
                header="referrer-policy",
                message=f"Política insegura: '{valor}'",
                recommendation="Usar strict-origin-when-cross-origin o no-referrer"
            ))

    def _verificar_permissions_policy(self):
        """Verifica Permissions-Policy."""
        valor = self.headers.get("permissions-policy", "")
        if valor:
            apis_sensibles = ["camera", "microphone", "geolocation"]
            for api in apis_sensibles:
                if api not in valor:
                    self.hallazgos.append(SecurityFinding(
                        severity="low",
                        header="permissions-policy",
                        message=f"API '{api}' no restringida en Permissions-Policy",
                        recommendation=f"Agregar {api}=() para desactivar"
                    ))

    def es_seguro(self, max_severity: str = "medium") -> bool:
        """Retorna True si no hay hallazgos por encima del severity dado."""
        severities = ["info", "low", "medium", "high", "critical"]
        umbral = severities.index(max_severity)
        return not any(
            severities.index(h.severity) > umbral
            for h in self.hallazgos
        )

    def reporte_texto(self) -> str:
        """Genera un reporte de hallazgos en texto plano."""
        if not self.hallazgos:
            return f"✅ {self.url}: Sin hallazgos de seguridad"

        lineas = [f"🔒 Reporte de seguridad: {self.url}"]
        lineas.append(f"   Hallazgos: {len(self.hallazgos)}")
        lineas.append("")

        for i, h in enumerate(self.hallazgos, 1):
            icono = {"critical": "🔴", "high": "🟠",
                     "medium": "🟡", "low": "🔵",
                     "info": "⚪"}.get(h.severity, "⚪")
            lineas.append(f"   {i}. {icono} [{h.severity.upper()}] {h.header}")
            lineas.append(f"      {h.message}")
            lineas.append(f"      → {h.recommendation}")
            lineas.append("")

        return "\\n".join(lineas)</code></pre>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔬 Uso avanzado del SecurityHeadersChecker</h4>
            <p>La clase usa <code>@dataclass</code> para los hallazgos y permite configurar
            el umbral de severidad con <code>es_seguro(max_severity="medium")</code>. En CI/CD
            puedes fallar el pipeline solo en hallazgos <code>high</code> o <code>critical</code>,
            mientras que en auditorías manuales puedes revisar todos los niveles.</p>
        </div>

        <h3>🧪 Tests con SecurityHeadersChecker y pytest</h3>
        <p>Integremos el checker en una suite de tests con <code>pytest</code> y fixtures
        para verificar múltiples URLs de forma eficiente.</p>

        <pre><code class="python"># tests/test_security_suite.py
"""
Suite de tests de seguridad usando SecurityHeadersChecker.
Verifica headers en múltiples endpoints de la aplicación.
"""
import pytest
from playwright.sync_api import sync_playwright
from helpers.security_headers_checker import SecurityHeadersChecker


@pytest.fixture(scope="module")
def browser():
    """Fixture que proporciona un browser para toda la suite."""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        yield browser
        browser.close()


@pytest.fixture
def page(browser):
    """Fixture que proporciona una página limpia para cada test."""
    page = browser.new_page()
    yield page
    page.close()


# URLs críticas a verificar
URLS_CRITICAS = [
    "https://mi-aplicacion.com",
    "https://mi-aplicacion.com/login",
    "https://mi-aplicacion.com/api/health",
    "https://mi-aplicacion.com/dashboard",
]


@pytest.mark.parametrize("url", URLS_CRITICAS)
def test_security_headers_por_url(page, url):
    """Verifica security headers en cada URL crítica."""
    response = page.goto(url)
    checker = SecurityHeadersChecker(response)
    hallazgos = checker.verificar_todos()

    # Fallar si hay hallazgos high o critical
    assert checker.es_seguro(max_severity="medium"), \\
        f"\\n{checker.reporte_texto()}"


def test_csp_no_permite_unsafe(page):
    """Verifica que CSP no permita unsafe-inline ni unsafe-eval."""
    response = page.goto("https://mi-aplicacion.com")
    csp = response.headers.get("content-security-policy", "")

    assert "'unsafe-inline'" not in csp, \\
        "CSP contiene 'unsafe-inline' - riesgo de XSS"
    assert "'unsafe-eval'" not in csp, \\
        "CSP contiene 'unsafe-eval' - riesgo de inyección"</code></pre>

        <h3>🛡️ Vulnerabilidades comunes: open redirects y clickjacking</h3>
        <p>Playwright también permite detectar vulnerabilidades a nivel de comportamiento de la
        aplicación, no solo de headers.</p>

        <pre><code class="python"># test_vulnerabilidades_comunes.py
"""
Detección de vulnerabilidades comunes con Playwright.
Open redirects y clickjacking.
"""
from playwright.sync_api import sync_playwright


def test_open_redirect():
    """
    Verifica que la aplicación no sea vulnerable a open redirects.
    Un open redirect permite redirigir al usuario a un sitio externo
    manipulando un parámetro de URL.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Intentar inyectar una redirección a un sitio externo
        urls_maliciosas = [
            "https://mi-app.com/redirect?url=https://evil.com",
            "https://mi-app.com/login?next=https://evil.com",
            "https://mi-app.com/goto?target=//evil.com",
            "https://mi-app.com/redirect?url=http%3A%2F%2Fevil.com",
        ]

        for url in urls_maliciosas:
            response = page.goto(url)
            url_final = page.url

            # Verificar que NO se redirigió a un dominio externo
            assert "evil.com" not in url_final, \\
                f"Open redirect detectado: {url} → {url_final}"

        print("✅ Sin vulnerabilidades de open redirect")
        browser.close()


def test_clickjacking_proteccion():
    """
    Verifica protección contra clickjacking verificando
    X-Frame-Options y CSP frame-ancestors.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        response = page.goto("https://mi-aplicacion.com")
        headers = response.headers

        # Verificar X-Frame-Options
        x_frame = headers.get("x-frame-options", "").upper()
        tiene_x_frame = x_frame in ("DENY", "SAMEORIGIN")

        # Verificar CSP frame-ancestors
        csp = headers.get("content-security-policy", "")
        tiene_frame_ancestors = "frame-ancestors" in csp

        assert tiene_x_frame or tiene_frame_ancestors, \\
            "Sin protección contra clickjacking: falta X-Frame-Options " \\
            "Y CSP frame-ancestors"

        print("✅ Protección contra clickjacking activa")
        browser.close()</code></pre>

        <h3>🍪 Seguridad de cookies: Secure, HttpOnly, SameSite</h3>
        <p>Las cookies son otro vector de ataque importante. Una cookie de sesión sin los
        atributos correctos puede ser robada vía XSS o enviada en peticiones cross-site (CSRF).</p>

        <pre><code class="python"># test_cookie_security.py
"""
Verificación de atributos de seguridad en cookies.
Valida Secure, HttpOnly y SameSite en cookies sensibles.
"""
from playwright.sync_api import sync_playwright


def test_cookies_seguras():
    """Verifica que las cookies de sesión tengan atributos seguros."""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context()
        page = context.new_page()

        # Navegar y autenticarse para obtener cookies de sesión
        page.goto("https://mi-aplicacion.com/login")
        page.fill("#username", "test_user")
        page.fill("#password", "test_password")
        page.click("button[type='submit']")
        page.wait_for_url("**/dashboard")

        # Obtener todas las cookies del contexto
        cookies = context.cookies()

        # Cookies que DEBEN ser seguras
        cookies_sensibles = ["session_id", "auth_token", "csrf_token"]
        hallazgos = []

        for cookie in cookies:
            if cookie["name"] in cookies_sensibles:
                nombre = cookie["name"]

                # Verificar atributo Secure
                if not cookie.get("secure", False):
                    hallazgos.append(
                        f"Cookie '{nombre}' NO tiene atributo Secure"
                    )

                # Verificar atributo HttpOnly
                if not cookie.get("httpOnly", False):
                    hallazgos.append(
                        f"Cookie '{nombre}' NO tiene atributo HttpOnly"
                    )

                # Verificar atributo SameSite
                samesite = cookie.get("sameSite", "None")
                if samesite == "None":
                    hallazgos.append(
                        f"Cookie '{nombre}' tiene SameSite=None "
                        f"(vulnerable a CSRF)"
                    )

        if hallazgos:
            reporte = "\\n".join(f"  ⚠️ {h}" for h in hallazgos)
            assert False, f"Problemas de seguridad en cookies:\\n{reporte}"

        print("✅ Cookies de sesión correctamente configuradas")
        context.close()
        browser.close()</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Atributos de cookies seguros - Resumen</h4>
            <ul>
                <li><strong>Secure</strong>: La cookie solo se envía por HTTPS. Sin esto, un
                atacante en la red puede interceptarla.</li>
                <li><strong>HttpOnly</strong>: La cookie no es accesible vía JavaScript
                (<code>document.cookie</code>). Protege contra robo por XSS.</li>
                <li><strong>SameSite=Lax</strong> o <strong>Strict</strong>: La cookie no se
                envía en peticiones cross-site. Protege contra CSRF.</li>
            </ul>
        </div>

        <h3>🔄 X-XSS-Protection (legacy)</h3>
        <p>Aunque <code>X-XSS-Protection</code> es considerado un header <strong>legacy</strong>
        (los navegadores modernos lo han deprecado en favor de CSP), muchas auditorías de seguridad
        y herramientas de escaneo aún lo verifican. Es buena práctica incluirlo como capa adicional.</p>

        <pre><code class="python"># Verificación de X-XSS-Protection
def test_xss_protection_header(page):
    """Verifica X-XSS-Protection como capa de defensa adicional."""
    response = page.goto("https://mi-aplicacion.com")
    xss = response.headers.get("x-xss-protection", "")

    # Valor recomendado: "1; mode=block"
    if xss:
        assert "1" in xss, \\
            f"X-XSS-Protection debería estar habilitado: '{xss}'"
        assert "mode=block" in xss, \\
            "X-XSS-Protection debería incluir mode=block"
    else:
        # No es crítico si CSP está presente, pero reportar como info
        csp = response.headers.get("content-security-policy", "")
        if not csp:
            assert False, \\
                "Ni X-XSS-Protection ni CSP están presentes"</code></pre>

        <h3>📋 Permissions-Policy y Referrer-Policy</h3>
        <p>Estos headers controlan qué APIs del navegador puede usar la aplicación y cuánta
        información de referencia se comparte con sitios externos.</p>

        <pre><code class="python"># test_permissions_referrer.py
"""
Verificación de Permissions-Policy y Referrer-Policy.
"""
from playwright.sync_api import sync_playwright


def test_permissions_policy(page):
    """Verifica que Permissions-Policy restrinja APIs sensibles."""
    response = page.goto("https://mi-aplicacion.com")
    perms = response.headers.get("permissions-policy", "")

    if not perms:
        assert False, "Falta header Permissions-Policy"

    # APIs que normalmente deben estar restringidas
    apis_restringidas = {
        "camera": "Cámara",
        "microphone": "Micrófono",
        "geolocation": "Geolocalización",
        "payment": "API de pagos",
        "usb": "Dispositivos USB"
    }

    for api, nombre in apis_restringidas.items():
        # camera=() significa que está desactivada
        assert f"{api}=()" in perms or f"{api}=self" in perms, \\
            f"API de {nombre} ({api}) no está restringida"


def test_referrer_policy(page):
    """Verifica que Referrer-Policy sea segura."""
    response = page.goto("https://mi-aplicacion.com")
    referrer = response.headers.get("referrer-policy", "")

    politicas_seguras = [
        "no-referrer",
        "same-origin",
        "strict-origin",
        "strict-origin-when-cross-origin"
    ]

    assert referrer in politicas_seguras, \\
        f"Referrer-Policy '{referrer}' no es segura. " \\
        f"Usar una de: {', '.join(politicas_seguras)}"</code></pre>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA</h4>
            <p>En aplicaciones empresariales SIESA, es común que las APIs internas expongan
            información sensible a través del header <code>Referrer</code>. Tokens en URLs,
            IDs de sesión y rutas internas pueden filtrarse a terceros. Configurar
            <code>Referrer-Policy: strict-origin-when-cross-origin</code> mitiga este riesgo
            sin romper la funcionalidad de navegación dentro del mismo dominio.</p>
        </div>

        <h3>🏁 Resumen de conceptos clave</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>📝 Lo que aprendiste en esta lección</h4>
            <ul>
                <li><strong>page.goto()</strong> retorna un <code>Response</code> con acceso a headers HTTP</li>
                <li><strong>CSP</strong> protege contra XSS; evitar <code>unsafe-inline</code> y <code>unsafe-eval</code></li>
                <li><strong>HSTS</strong> fuerza HTTPS con <code>max-age</code> mínimo de 1 año</li>
                <li><strong>X-Frame-Options</strong> y <strong>CSP frame-ancestors</strong> protegen contra clickjacking</li>
                <li><strong>Contenido mixto</strong> se detecta interceptando requests HTTP en páginas HTTPS</li>
                <li><strong>SecurityHeadersChecker</strong> encapsula toda la lógica en una clase reutilizable</li>
                <li><strong>Cookies</strong> deben tener Secure, HttpOnly y SameSite adecuado</li>
                <li><strong>Open redirects</strong> se prueban inyectando URLs externas en parámetros de redirección</li>
            </ul>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🏋️ Ejercicio práctico</h4>
            <p>Crea una suite de seguridad completa que verifique los headers de <strong>3 sitios web
            públicos</strong> diferentes y genere un reporte comparativo.</p>
            <ol>
                <li>Usa <code>SecurityHeadersChecker</code> para verificar:
                    <ul>
                        <li><code>https://github.com</code></li>
                        <li><code>https://www.google.com</code></li>
                        <li><code>https://example.com</code></li>
                    </ul>
                </li>
                <li>Para cada sitio, ejecuta <code>verificar_todos()</code> y recopila los hallazgos</li>
                <li>Detecta contenido mixto en cada sitio interceptando requests HTTP</li>
                <li>Verifica los atributos de cookies de cada sitio</li>
                <li>Genera un reporte comparativo en formato tabla que muestre:
                    <ul>
                        <li>Qué headers tiene cada sitio</li>
                        <li>Cantidad de hallazgos por severidad</li>
                        <li>Puntuación de seguridad (0-100) basada en los headers presentes</li>
                    </ul>
                </li>
            </ol>
            <p><strong>Pista:</strong> Usa <code>pytest.mark.parametrize</code> para iterar sobre los
            sitios, y una fixture que recolecte los resultados en un diccionario compartido.</p>

            <pre><code class="python"># Esqueleto del ejercicio
import pytest
from playwright.sync_api import sync_playwright
from helpers.security_headers_checker import SecurityHeadersChecker

SITIOS = [
    "https://github.com",
    "https://www.google.com",
    "https://example.com",
]

@pytest.fixture(scope="module")
def resultados():
    """Diccionario compartido para recopilar resultados."""
    return {}

@pytest.mark.parametrize("url", SITIOS)
def test_security_audit(page, url, resultados):
    """Audita security headers de cada sitio."""
    response = page.goto(url)
    checker = SecurityHeadersChecker(response)
    hallazgos = checker.verificar_todos()
    resultados[url] = {
        "hallazgos": hallazgos,
        "headers": response.headers,
        "seguro": checker.es_seguro(),
        "reporte": checker.reporte_texto()
    }
    # TODO: Completar con verificación de cookies
    # TODO: Completar con detección de contenido mixto
    # TODO: Calcular puntuación de seguridad
    # TODO: Generar reporte comparativo al final</code></pre>
        </div>

        <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip SIESA - Integración en CI/CD</h4>
            <p>En SIESA integramos las verificaciones de security headers como un <strong>quality
            gate</strong> en el pipeline de CI/CD. El pipeline falla si se detectan hallazgos
            <code>critical</code> o <code>high</code>, mientras que los <code>medium</code>
            y <code>low</code> se registran como advertencias en el reporte. Esto asegura que
            nunca se despliega código con configuración de seguridad deficiente sin que el equipo
            lo revise explícitamente.</p>
        </div>
    `,
    topics: ["security", "headers", "https"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 7,
    difficulty: "medium",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_103 = LESSON_103;
}
