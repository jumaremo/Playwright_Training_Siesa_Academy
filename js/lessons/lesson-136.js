/**
 * Playwright Academy - Leccion 136
 * Challenge: Automatiza sin guia (Basico)
 * Seccion 21: Retos Abiertos y Recursos
 */

const LESSON_136 = {
    id: 136,
    title: "Challenge: Automatiza sin guía (Básico)",
    duration: "60 min",
    level: "beginner",
    section: "section-21",
    content: `
        <h2>Challenge: Automatiza sin guia (Basico)</h2>

        <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ff9800;">
            <h3 style="color: #e65100; margin: 0;">Modo Challenge — Sin codigo de referencia</h3>
            <p style="font-size: 1.1em;">Este es un reto <strong>100% abierto</strong>. No hay ejemplos de codigo,
            no hay paso a paso, no hay pistas. Solo tienes los <strong>requisitos</strong> y la <strong>rubrica</strong>.
            Tu decides como resolverlo.</p>
            <p><em>Asi es como funciona el mundo real del QA.</em></p>
        </div>

        <h3>Tu mision</h3>
        <p>Automatiza 5 escenarios de prueba para el sitio publico
        <strong>SauceDemo</strong> (<code>https://www.saucedemo.com</code>).</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Contexto del sitio</h4>
            <p>SauceDemo es una tienda online de pruebas. Tiene login, catalogo de productos,
            carrito de compras y checkout. Algunos usuarios tienen comportamientos especiales
            (bloqueados, lentos, con errores). <strong>Explora el sitio antes de empezar.</strong></p>
        </div>

        <h3>Escenarios a automatizar</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #e0e0e0;">
                    <th style="padding: 10px; border: 1px solid #ddd;">#</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Escenario</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Que debes validar</th>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">1</td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Login exitoso</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Que el usuario llega al inventario despues de loguearse</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 10px; border: 1px solid #ddd;">2</td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Login fallido</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Que aparece mensaje de error con credenciales invalidas</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">3</td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Agregar producto al carrito</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Que el badge del carrito se actualiza y el producto aparece en el carrito</td>
                </tr>
                <tr style="background: #fafafa;">
                    <td style="padding: 10px; border: 1px solid #ddd;">4</td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Flujo completo de compra</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Desde login hasta la pagina de confirmacion de orden</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">5</td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Ordenar productos</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Que el filtro de orden (A-Z, precio, etc.) realmente reordena los productos</td>
                </tr>
            </table>
        </div>

        <h3>Restricciones</h3>
        <div style="background: #fce4ec; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <ul>
                <li><strong>No uses <code>time.sleep()</code></strong> — usa los waits nativos de Playwright</li>
                <li><strong>No uses selectores fragiles</strong> — nada de XPath largos ni CSS por posicion</li>
                <li><strong>Cada test debe ser independiente</strong> — si ejecutas solo uno, debe funcionar</li>
                <li><strong>Naming descriptivo</strong> — el nombre del test debe decir que valida</li>
                <li><strong>Patron AAA</strong> — Arrange, Act, Assert claramente separados</li>
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
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Funcionalidad</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Los 5 tests pasan exitosamente con <code>pytest</code></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">30</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Selectores</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Usa selectores estables (data-test, role, text)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">20</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Assertions</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Assertions significativas (no solo "pagina carga")</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">20</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Independencia</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Cada test funciona solo, sin depender de otros</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">15</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Codigo limpio</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Naming, AAA, sin sleep, sin hardcodes innecesarios</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">15</td>
                </tr>
                <tr style="background: #bbdefb;">
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;" colspan="2">TOTAL</td>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">100</td>
                </tr>
            </table>
        </div>

        <h3>Entregable</h3>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>Un directorio con:</p>
            <ul>
                <li><code>tests/test_saucedemo.py</code> — tus 5 tests</li>
                <li><code>requirements.txt</code> — dependencias</li>
                <li><code>conftest.py</code> — fixtures si los necesitas (opcional)</li>
            </ul>
            <p><strong>Criterio de exito:</strong> <code>pytest tests/ -v</code> ejecuta y los 5 tests pasan en verde.</p>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: center;">
            <p style="font-size: 1.1em;"><strong>No hay pistas. No hay codigo de ejemplo. Tu puedes.</strong></p>
            <p>Revisa las lecciones 1-52 si necesitas refrescar algun concepto.</p>
        </div>
    `,
    topics: ["challenge", "reto-abierto", "saucedemo", "básico"],
    hasCode: false,
    hasExercise: true,
    estimatedTime: 60,
    difficulty: "medium",
    type: "challenge"
};

if (typeof window !== 'undefined') {
    window.LESSON_136 = LESSON_136;
}
