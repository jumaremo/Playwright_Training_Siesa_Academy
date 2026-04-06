/**
 * Playwright Academy - Lección 035
 * Dialogs: alert, confirm, prompt
 * Sección 4: Interacciones Web Fundamentales
 */

const LESSON_035 = {
    id: 35,
    title: "Dialogs: alert, confirm, prompt",
    duration: "5 min",
    level: "beginner",
    section: "section-04",
    content: `
        <h2>💬 Dialogs: alert, confirm, prompt</h2>
        <p>Los diálogos nativos de JavaScript (<code>alert</code>, <code>confirm</code>, <code>prompt</code>)
        son ventanas modales del navegador que bloquean la interacción del usuario. Playwright proporciona
        una API elegante para interceptar y responder a estos diálogos de forma programática.</p>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚠️ Comportamiento por defecto</h4>
            <p>Playwright <strong>descarta automáticamente</strong> todos los diálogos si no configuras
            un listener. Los <code>alert</code> se aceptan, los <code>confirm</code> se rechazan
            y los <code>prompt</code> se descartan. Si necesitas interactuar con ellos,
            <strong>debes registrar un listener ANTES de que aparezca el diálogo</strong>.</p>
        </div>

        <h3>📋 Tipos de diálogos JavaScript</h3>
        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #e3f2fd;">
                <th style="padding: 8px; border: 1px solid #ddd;">Tipo</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Propósito</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Botones</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Retorna</th>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>alert()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Mostrar un mensaje informativo</td>
                <td style="padding: 6px; border: 1px solid #ddd;">OK</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>undefined</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>confirm()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Pedir confirmación (sí/no)</td>
                <td style="padding: 6px; border: 1px solid #ddd;">OK / Cancelar</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>true</code> / <code>false</code></td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>prompt()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Solicitar texto al usuario</td>
                <td style="padding: 6px; border: 1px solid #ddd;">OK / Cancelar + campo de texto</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>string</code> / <code>null</code></td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;"><code>beforeunload</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Confirmar antes de salir de la página</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Salir / Permanecer</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Controla la navegación</td>
            </tr>
        </table>

        <h3>🔧 El evento page.on("dialog")</h3>
        <p>Para interceptar diálogos, registras un listener con <code>page.on("dialog")</code>.
        El objeto <code>dialog</code> expone propiedades y métodos para interactuar con él.</p>
        <pre><code class="python">from playwright.sync_api import Page, Dialog

def test_interceptar_alert(page: Page):
    # Registrar listener ANTES de disparar el diálogo
    page.on("dialog", lambda dialog: dialog.accept())

    # Ahora disparar la acción que genera el alert
    page.goto("https://the-internet.herokuapp.com/javascript_alerts")
    page.click("button:text('Click for JS Alert')")

    # Verificar el resultado en la página
    resultado = page.locator("#result")
    assert resultado.text_content() == "You successfully clicked an alert"</code></pre>

        <h3>📖 Propiedades del objeto Dialog</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background: #bbdefb;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Propiedad / Método</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Descripción</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Ejemplo</th>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>dialog.type</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Tipo: "alert", "confirm", "prompt", "beforeunload"</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>assert dialog.type == "alert"</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>dialog.message</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Texto que muestra el diálogo</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>assert "seguro" in dialog.message</code></td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>dialog.default_value</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Valor por defecto del prompt</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>print(dialog.default_value)</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>dialog.accept()</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Acepta el diálogo (clic en OK)</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>dialog.accept()</code></td>
                </tr>
                <tr>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>dialog.accept("texto")</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Acepta prompt con texto ingresado</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>dialog.accept("Juan")</code></td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>dialog.dismiss()</code></td>
                    <td style="padding: 6px; border: 1px solid #ddd;">Rechaza/cancela el diálogo</td>
                    <td style="padding: 6px; border: 1px solid #ddd;"><code>dialog.dismiss()</code></td>
                </tr>
            </table>
        </div>

        <h3>✅ Manejo de alert</h3>
        <p>El diálogo <code>alert()</code> solo tiene un botón "OK". Se usa para mostrar información.</p>
        <pre><code class="python">from playwright.sync_api import Page, Dialog

def test_alert_con_verificacion(page: Page):
    mensajes_capturados = []

    def manejar_dialog(dialog: Dialog):
        # Verificar que es un alert
        assert dialog.type == "alert"
        # Capturar el mensaje
        mensajes_capturados.append(dialog.message)
        # Aceptar el diálogo
        dialog.accept()

    page.on("dialog", manejar_dialog)
    page.goto("https://the-internet.herokuapp.com/javascript_alerts")
    page.click("button:text('Click for JS Alert')")

    # Verificar que el mensaje fue el esperado
    assert mensajes_capturados[0] == "I am a JS Alert"
    assert page.locator("#result").text_content() == "You successfully clicked an alert"</code></pre>

        <h3>🔄 Manejo de confirm</h3>
        <p>El diálogo <code>confirm()</code> tiene dos botones: "OK" (aceptar) y "Cancelar" (rechazar).</p>
        <pre><code class="python">def test_confirm_aceptar(page: Page):
    """Aceptar un diálogo de confirmación."""
    page.on("dialog", lambda dialog: dialog.accept())

    page.goto("https://the-internet.herokuapp.com/javascript_alerts")
    page.click("button:text('Click for JS Confirm')")

    assert page.locator("#result").text_content() == "You clicked: Ok"


def test_confirm_rechazar(page: Page):
    """Rechazar un diálogo de confirmación."""
    page.on("dialog", lambda dialog: dialog.dismiss())

    page.goto("https://the-internet.herokuapp.com/javascript_alerts")
    page.click("button:text('Click for JS Confirm')")

    assert page.locator("#result").text_content() == "You clicked: Cancel"</code></pre>

        <h3>✏️ Manejo de prompt</h3>
        <p>El diálogo <code>prompt()</code> permite al usuario ingresar texto. Usa
        <code>dialog.accept("texto")</code> para enviarlo.</p>
        <pre><code class="python">def test_prompt_con_texto(page: Page):
    """Enviar texto a un diálogo prompt."""
    def manejar_prompt(dialog: Dialog):
        assert dialog.type == "prompt"
        assert dialog.message == "I am a JS prompt"
        # Enviar texto al prompt
        dialog.accept("Playwright es genial")

    page.on("dialog", manejar_prompt)
    page.goto("https://the-internet.herokuapp.com/javascript_alerts")
    page.click("button:text('Click for JS Prompt')")

    resultado = page.locator("#result").text_content()
    assert resultado == "You entered: Playwright es genial"


def test_prompt_cancelar(page: Page):
    """Cancelar un diálogo prompt (sin enviar texto)."""
    page.on("dialog", lambda dialog: dialog.dismiss())

    page.goto("https://the-internet.herokuapp.com/javascript_alerts")
    page.click("button:text('Click for JS Prompt')")

    assert page.locator("#result").text_content() == "You entered: null"</code></pre>

        <h3>⏳ Usando expect_event("dialog") para esperar</h3>
        <p>En lugar de usar <code>page.on()</code>, puedes usar <code>page.expect_event("dialog")</code>
        para esperar explícitamente la aparición de un diálogo. Esto es útil cuando necesitas
        sincronizar acciones.</p>
        <pre><code class="python">def test_expect_event_dialog(page: Page):
    page.goto("https://the-internet.herokuapp.com/javascript_alerts")

    # Esperar el diálogo y capturarlo
    with page.expect_event("dialog") as dialog_info:
        page.click("button:text('Click for JS Alert')")

    dialog = dialog_info.value
    assert dialog.type == "alert"
    assert dialog.message == "I am a JS Alert"

    # NOTA: con expect_event, el diálogo se acepta automáticamente
    # si no lo manejas explícitamente</code></pre>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 ¿page.on() vs expect_event()?</h4>
            <ul>
                <li><code>page.on("dialog")</code>: Escucha <strong>todos</strong> los diálogos durante
                la vida de la página. Ideal cuando hay múltiples diálogos.</li>
                <li><code>page.expect_event("dialog")</code>: Espera <strong>un solo</strong> diálogo
                y lo captura. Ideal para tests puntuales donde sabes exactamente cuándo aparece.</li>
            </ul>
        </div>

        <h3>🔁 Manejo de múltiples diálogos secuenciales</h3>
        <p>Cuando una acción genera varios diálogos consecutivos, puedes manejarlos con
        una cola o un contador.</p>
        <pre><code class="python">def test_multiples_dialogos(page: Page):
    """Manejar varios diálogos secuenciales."""
    respuestas = [
        ("alert", None),      # Primer diálogo: alert -> aceptar
        ("confirm", True),    # Segundo: confirm -> aceptar
        ("prompt", "Hola"),   # Tercero: prompt -> enviar texto
    ]
    indice = {"actual": 0}

    def manejar_secuencia(dialog: Dialog):
        tipo_esperado, accion = respuestas[indice["actual"]]
        assert dialog.type == tipo_esperado

        if accion is None:
            dialog.accept()
        elif accion is True:
            dialog.accept()
        elif accion is False:
            dialog.dismiss()
        elif isinstance(accion, str):
            dialog.accept(accion)

        indice["actual"] += 1

    page.on("dialog", manejar_secuencia)

    # Disparar acciones que generan cada diálogo
    page.goto("https://the-internet.herokuapp.com/javascript_alerts")
    page.click("button:text('Click for JS Alert')")
    page.click("button:text('Click for JS Confirm')")
    page.click("button:text('Click for JS Prompt')")

    assert indice["actual"] == 3  # Verificar que se manejaron todos</code></pre>

        <h3>🚪 Diálogos beforeunload</h3>
        <p>El evento <code>beforeunload</code> aparece cuando intentas salir de una página que tiene
        cambios sin guardar. Playwright también puede manejar este tipo.</p>
        <pre><code class="python">def test_beforeunload_dialog(page: Page):
    """Manejar diálogo beforeunload al navegar fuera."""
    page.goto("https://ejemplo.com/editor")

    # Simular cambios en un formulario
    page.fill("#contenido", "Texto sin guardar")

    # Registrar handler para beforeunload
    def manejar_beforeunload(dialog: Dialog):
        assert dialog.type == "beforeunload"
        # Aceptar = salir de la página
        dialog.accept()

    page.on("dialog", manejar_beforeunload)

    # Intentar navegar fuera (dispara beforeunload)
    page.goto("https://ejemplo.com/otra-pagina")</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚠️ Nota sobre beforeunload</h4>
            <p>Los diálogos <code>beforeunload</code> solo se disparan cuando la página tiene
            un listener de <code>beforeunload</code> registrado en JavaScript. No todos los sitios
            los implementan. Además, <code>dialog.message</code> puede estar vacío en navegadores
            modernos por razones de seguridad.</p>
        </div>

        <h3>🚫 Error común: olvidar registrar el listener antes de la acción</h3>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>❌ Incorrecto — listener después de la acción</h4>
            <pre><code class="python"># MAL: El diálogo aparece y se auto-descarta antes de registrar el handler
def test_dialog_mal(page: Page):
    page.goto("https://the-internet.herokuapp.com/javascript_alerts")
    page.click("button:text('Click for JS Alert')")

    # Demasiado tarde — el diálogo ya fue auto-descartado
    page.on("dialog", lambda d: d.accept())</code></pre>

            <h4>✅ Correcto — listener antes de la acción</h4>
            <pre><code class="python"># BIEN: Registrar el handler ANTES de la acción que dispara el diálogo
def test_dialog_bien(page: Page):
    page.goto("https://the-internet.herokuapp.com/javascript_alerts")

    # Primero: registrar el handler
    page.on("dialog", lambda d: d.accept())

    # Después: ejecutar la acción que dispara el diálogo
    page.click("button:text('Click for JS Alert')")</code></pre>
        </div>

        <h3>🧪 Ejemplo completo: testeando los 3 tipos en the-internet</h3>
        <pre><code class="python"># test_dialogs.py
"""
Test suite completo para diálogos JavaScript.
Sitio: https://the-internet.herokuapp.com/javascript_alerts
"""
import pytest
from playwright.sync_api import Page, Dialog, expect


class TestDialogs:
    """Tests para los 3 tipos de diálogos JavaScript."""

    URL = "https://the-internet.herokuapp.com/javascript_alerts"

    def test_alert_muestra_mensaje(self, page: Page):
        """Verificar que el alert muestra el mensaje correcto."""
        mensaje_capturado = []

        def capturar_alert(dialog: Dialog):
            assert dialog.type == "alert"
            mensaje_capturado.append(dialog.message)
            dialog.accept()

        page.on("dialog", capturar_alert)
        page.goto(self.URL)
        page.click("button:text('Click for JS Alert')")

        assert mensaje_capturado[0] == "I am a JS Alert"
        expect(page.locator("#result")).to_have_text(
            "You successfully clicked an alert"
        )

    def test_confirm_aceptar(self, page: Page):
        """Verificar resultado al aceptar confirm."""
        page.on("dialog", lambda d: d.accept())
        page.goto(self.URL)
        page.click("button:text('Click for JS Confirm')")

        expect(page.locator("#result")).to_have_text("You clicked: Ok")

    def test_confirm_cancelar(self, page: Page):
        """Verificar resultado al cancelar confirm."""
        page.on("dialog", lambda d: d.dismiss())
        page.goto(self.URL)
        page.click("button:text('Click for JS Confirm')")

        expect(page.locator("#result")).to_have_text("You clicked: Cancel")

    def test_prompt_enviar_texto(self, page: Page):
        """Verificar que el prompt recibe el texto enviado."""
        texto = "Automatizado con Playwright"

        def responder_prompt(dialog: Dialog):
            assert dialog.type == "prompt"
            dialog.accept(texto)

        page.on("dialog", responder_prompt)
        page.goto(self.URL)
        page.click("button:text('Click for JS Prompt')")

        expect(page.locator("#result")).to_have_text(
            f"You entered: {texto}"
        )

    def test_prompt_cancelar(self, page: Page):
        """Verificar resultado al cancelar prompt."""
        page.on("dialog", lambda d: d.dismiss())
        page.goto(self.URL)
        page.click("button:text('Click for JS Prompt')")

        expect(page.locator("#result")).to_have_text("You entered: null")

    def test_todos_los_dialogos_secuenciales(self, page: Page):
        """Probar los 3 diálogos en secuencia."""
        resultados = []

        def manejar_todos(dialog: Dialog):
            resultados.append({
                "tipo": dialog.type,
                "mensaje": dialog.message
            })
            if dialog.type == "prompt":
                dialog.accept("Test completo")
            else:
                dialog.accept()

        page.on("dialog", manejar_todos)
        page.goto(self.URL)

        # Alert
        page.click("button:text('Click for JS Alert')")
        # Confirm
        page.click("button:text('Click for JS Confirm')")
        # Prompt
        page.click("button:text('Click for JS Prompt')")

        assert len(resultados) == 3
        assert resultados[0]["tipo"] == "alert"
        assert resultados[1]["tipo"] == "confirm"
        assert resultados[2]["tipo"] == "prompt"</code></pre>

        <h3>📊 Resumen de manejo de diálogos</h3>
        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #e8f5e9;">
                <th style="padding: 8px; border: 1px solid #ddd;">Acción</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Código</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Cuándo usarlo</th>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Aceptar alert/confirm</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>dialog.accept()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Clic en "OK"</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;">Rechazar confirm</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>dialog.dismiss()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Clic en "Cancelar"</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Enviar texto a prompt</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>dialog.accept("texto")</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Escribir + clic "OK"</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;">Leer mensaje</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>dialog.message</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Verificar texto del diálogo</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Identificar tipo</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>dialog.type</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Manejar según tipo</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;">Esperar diálogo</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.expect_event("dialog")</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Capturar un diálogo puntual</td>
            </tr>
        </table>

        <h3>🎯 Ejercicio práctico</h3>
        <ol>
            <li>Navega a <code>https://the-internet.herokuapp.com/javascript_alerts</code></li>
            <li>Escribe un test que haga clic en "Click for JS Alert", capture el mensaje y verifique el resultado</li>
            <li>Escribe un test que acepte el confirm y otro que lo rechace, verificando ambos resultados</li>
            <li>Escribe un test que envíe tu nombre al prompt y verifique que aparece en <code>#result</code></li>
            <li>Crea un test que maneje los 3 diálogos en secuencia con un solo handler</li>
            <li>Usa <code>page.expect_event("dialog")</code> para capturar el objeto dialog y hacer assertions sobre él</li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Comprender los 3 tipos de diálogos JavaScript y sus diferencias</li>
                <li>Registrar handlers con <code>page.on("dialog")</code> antes de la acción</li>
                <li>Usar <code>dialog.accept()</code>, <code>dialog.dismiss()</code> y <code>dialog.accept("texto")</code></li>
                <li>Leer propiedades del diálogo: <code>type</code>, <code>message</code>, <code>default_value</code></li>
                <li>Manejar múltiples diálogos secuenciales y diálogos beforeunload</li>
            </ul>
        </div>
    `,
    topics: ["dialogs", "alert", "confirm", "prompt"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_035 = LESSON_035;
}
