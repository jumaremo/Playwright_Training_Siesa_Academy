/**
 * Playwright Academy - Lección 033
 * Uploads y downloads de archivos
 * Sección 4: Interacciones Web Fundamentales
 */

const LESSON_033 = {
    id: 33,
    title: "Uploads y downloads de archivos",
    duration: "5 min",
    level: "beginner",
    section: "section-04",
    content: `
        <h2>📂 Uploads y downloads de archivos</h2>
        <p>Subir y descargar archivos es una necesidad común en aplicaciones web. Playwright
        ofrece métodos dedicados para manejar ambas operaciones de forma sencilla y confiable,
        sin necesidad de herramientas externas como AutoIt o Robot.</p>

        <h3>📤 Upload con input[type="file"]</h3>
        <p>La forma más directa de subir archivos es mediante <code>set_input_files()</code>
        sobre un elemento <code>&lt;input type="file"&gt;</code>.</p>
        <pre><code class="python">from playwright.sync_api import Page, expect

def test_upload_archivo_unico(page: Page):
    """Subir un solo archivo usando set_input_files."""
    page.goto("https://the-internet.herokuapp.com/upload")

    # Localizar el input de archivo y asignar un archivo
    page.set_input_files("#file-upload", "datos/reporte.pdf")

    # Hacer clic en el botón de subir
    page.click("#file-submit")

    # Verificar que el archivo se subió correctamente
    expect(page.locator("#uploaded-files")).to_have_text("reporte.pdf")</code></pre>

        <h3>📁 Upload de múltiples archivos</h3>
        <pre><code class="python">def test_upload_multiples_archivos(page: Page):
    """Subir varios archivos a la vez."""
    page.goto("https://ejemplo.com/upload-multiple")

    # Pasar una lista de rutas de archivos
    page.set_input_files("#file-input", [
        "datos/imagen1.png",
        "datos/imagen2.jpg",
        "datos/documento.pdf"
    ])

    page.click("#btn-subir")
    expect(page.locator(".archivos-subidos")).to_contain_text("3 archivos")</code></pre>

        <h3>💾 Upload desde buffer (sin archivo en disco)</h3>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Caso de uso:</strong> Cuando necesitas generar un archivo dinámicamente
            en el test sin crearlo físicamente en disco.</p>
        </div>
        <pre><code class="python">def test_upload_desde_buffer(page: Page):
    """Subir un archivo generado en memoria."""
    page.goto("https://ejemplo.com/upload")

    # Crear archivo desde un buffer de bytes
    page.set_input_files("#file-input", {
        "name": "datos_test.csv",
        "mimeType": "text/csv",
        "buffer": b"nombre,edad\\nJuan,30\\nMaria,25"
    })

    page.click("#btn-subir")
    expect(page.locator(".estado")).to_contain_text("Subido exitosamente")</code></pre>

        <h3>🧹 Limpiar el input de archivos</h3>
        <pre><code class="python">def test_limpiar_input_archivos(page: Page):
    """Remover archivos seleccionados del input."""
    page.goto("https://ejemplo.com/upload")

    # Seleccionar un archivo
    page.set_input_files("#file-input", "datos/reporte.pdf")

    # Limpiar la selección (pasar lista vacía)
    page.set_input_files("#file-input", [])

    # Verificar que no hay archivos seleccionados
    input_value = page.input_value("#file-input")
    assert input_value == ""</code></pre>

        <h3>🗂️ Upload sin input: File Chooser</h3>
        <p>Algunos sitios usan botones personalizados que abren el diálogo del sistema operativo
        en lugar de un <code>&lt;input type="file"&gt;</code> visible. Para estos casos,
        Playwright ofrece <code>expect_file_chooser()</code>.</p>
        <pre><code class="python">def test_upload_con_file_chooser(page: Page):
    """Manejar uploads sin input visible (file chooser del OS)."""
    page.goto("https://ejemplo.com/upload-custom")

    # Esperar el diálogo de selección de archivos y hacer clic
    with page.expect_file_chooser() as fc_info:
        page.click("#btn-upload-custom")  # Botón que abre el file chooser

    file_chooser = fc_info.value

    # Verificar si acepta múltiples archivos
    print(f"Múltiples: {file_chooser.is_multiple()}")

    # Seleccionar archivos
    file_chooser.set_files("datos/imagen.png")

    expect(page.locator(".preview")).to_be_visible()</code></pre>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>⚠️ ¿Cuándo usar File Chooser vs set_input_files?</h4>
            <ul>
                <li><strong>set_input_files():</strong> Cuando existe un <code>&lt;input type="file"&gt;</code> en el DOM (aunque esté oculto)</li>
                <li><strong>expect_file_chooser():</strong> Cuando el upload se dispara mediante JavaScript/eventos personalizados sin input file</li>
            </ul>
        </div>

        <h3>📥 Descargar archivos</h3>
        <p>Para interceptar descargas, Playwright proporciona <code>expect_download()</code>
        que captura el evento de descarga del navegador.</p>
        <pre><code class="python">def test_descargar_archivo(page: Page):
    """Descargar un archivo y verificar su contenido."""
    page.goto("https://the-internet.herokuapp.com/download")

    # Esperar la descarga al hacer clic en el enlace
    with page.expect_download() as download_info:
        page.click("a[href*='some-file.txt']")

    download = download_info.value

    # Propiedades del objeto Download
    print(f"Nombre sugerido: {download.suggested_filename}")
    print(f"URL de origen: {download.url}")

    # Guardar el archivo en una ruta específica
    download.save_as(f"descargas/{download.suggested_filename}")

    # Obtener la ruta temporal del archivo
    ruta_temporal = download.path()
    print(f"Ruta temporal: {ruta_temporal}")</code></pre>

        <h3>📋 Verificar contenido del archivo descargado</h3>
        <pre><code class="python">import os

def test_verificar_contenido_descarga(page: Page):
    """Descargar un archivo y verificar su contenido."""
    page.goto("https://the-internet.herokuapp.com/download")

    with page.expect_download() as download_info:
        page.click("a[href*='some-file.txt']")

    download = download_info.value
    ruta = f"descargas/{download.suggested_filename}"
    download.save_as(ruta)

    # Leer y verificar contenido
    with open(ruta, "r") as f:
        contenido = f.read()
    assert "texto esperado" in contenido

    # Verificar tamaño del archivo
    tamaño = os.path.getsize(ruta)
    assert tamaño > 0, "El archivo descargado está vacío"

    # Limpieza
    os.remove(ruta)</code></pre>

        <h3>⚙️ Configurar directorio de descargas</h3>
        <pre><code class="python"># conftest.py — Configurar directorio de descargas en el contexto
import pytest
import os

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    """Configurar directorio de descargas personalizado."""
    download_dir = os.path.join(os.getcwd(), "test_downloads")
    os.makedirs(download_dir, exist_ok=True)

    return {
        **browser_context_args,
        "accept_downloads": True,  # Aceptar descargas automáticamente
    }</code></pre>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>💡 Tip: Esperar descarga completa</h4>
            <p>El objeto <code>download</code> tiene un método <code>path()</code> que
            espera automáticamente a que la descarga se complete. Si necesitas verificar
            el fallo de una descarga, usa <code>download.failure()</code> que retorna
            <code>None</code> si fue exitosa o un string con el error.</p>
            <pre><code class="python"># Verificar que la descarga fue exitosa
error = download.failure()
assert error is None, f"La descarga falló: {error}"</code></pre>
        </div>

        <h3>🔄 Ejemplo completo: Upload y Download</h3>
        <pre><code class="python">import os
import pytest
from playwright.sync_api import Page, expect

class TestArchivos:
    """Tests de upload y download en the-internet.herokuapp.com."""

    def test_upload_y_verificar(self, page: Page):
        """Subir un archivo y verificar que aparece."""
        page.goto("https://the-internet.herokuapp.com/upload")

        # Crear archivo temporal para el test
        ruta_archivo = "test_upload.txt"
        with open(ruta_archivo, "w") as f:
            f.write("Contenido de prueba para upload")

        try:
            # Subir el archivo
            page.set_input_files("#file-upload", ruta_archivo)
            page.click("#file-submit")

            # Verificar resultado
            expect(page.locator("#uploaded-files")).to_have_text("test_upload.txt")
        finally:
            os.remove(ruta_archivo)

    def test_descargar_y_verificar(self, page: Page):
        """Descargar un archivo y verificar que existe."""
        page.goto("https://the-internet.herokuapp.com/download")

        # Obtener el primer enlace de descarga
        primer_enlace = page.locator("a").first

        with page.expect_download() as download_info:
            primer_enlace.click()

        download = download_info.value
        ruta_destino = f"descargas/{download.suggested_filename}"

        # Guardar y verificar
        os.makedirs("descargas", exist_ok=True)
        download.save_as(ruta_destino)

        assert os.path.exists(ruta_destino), "El archivo no se descargó"
        assert os.path.getsize(ruta_destino) > 0, "El archivo está vacío"

        # Limpieza
        os.remove(ruta_destino)</code></pre>

        <h3>📊 Resumen de métodos de Upload y Download</h3>
        <table style="width:100%; border-collapse: collapse;">
            <tr style="background: #e3f2fd;">
                <th style="padding: 8px; border: 1px solid #ddd;">Operación</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Método</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Uso</th>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Upload único</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>set_input_files(selector, "ruta")</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Un solo archivo desde disco</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;">Upload múltiple</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>set_input_files(selector, [...])</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Lista de archivos</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Upload desde buffer</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>set_input_files(selector, {name, mimeType, buffer})</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Archivo generado en memoria</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;">Limpiar input</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>set_input_files(selector, [])</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Remover archivos seleccionados</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">File Chooser</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.expect_file_chooser()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Upload sin input visible</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;">Download</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>page.expect_download()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Interceptar descarga</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Guardar descarga</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>download.save_as(ruta)</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Guardar en ruta específica</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;">Nombre sugerido</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>download.suggested_filename</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Nombre original del archivo</td>
            </tr>
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd;">Ruta temporal</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>download.path()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">Ruta temporal (espera descarga)</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td style="padding: 6px; border: 1px solid #ddd;">Verificar fallo</td>
                <td style="padding: 6px; border: 1px solid #ddd;"><code>download.failure()</code></td>
                <td style="padding: 6px; border: 1px solid #ddd;">None si exitosa, string si error</td>
            </tr>
        </table>

        <h3>🎯 Ejercicio práctico</h3>
        <ol>
            <li>Navega a <code>https://the-internet.herokuapp.com/upload</code></li>
            <li>Crea un archivo de texto temporal con contenido de prueba</li>
            <li>Sube el archivo usando <code>set_input_files()</code></li>
            <li>Verifica que el nombre del archivo aparece en la página tras el upload</li>
            <li>Navega a <code>https://the-internet.herokuapp.com/download</code></li>
            <li>Descarga el primer archivo disponible usando <code>expect_download()</code></li>
            <li>Guarda el archivo con <code>save_as()</code> y verifica que existe y no está vacío</li>
            <li>Limpia los archivos temporales al finalizar</li>
        </ol>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>✅ Objetivos de esta lección:</h4>
            <ul>
                <li>Subir archivos individuales y múltiples con <code>set_input_files()</code></li>
                <li>Generar archivos en memoria con buffer para uploads dinámicos</li>
                <li>Manejar file choosers para uploads sin input visible</li>
                <li>Interceptar descargas con <code>expect_download()</code></li>
                <li>Verificar contenido y propiedades de archivos descargados</li>
            </ul>
        </div>
    `,
    topics: ["uploads", "downloads", "archivos"],
    hasCode: true,
    hasExercise: true,
    estimatedTime: 5,
    difficulty: "easy",
    type: "standard"
};

if (typeof window !== 'undefined') {
    window.LESSON_033 = LESSON_033;
}
