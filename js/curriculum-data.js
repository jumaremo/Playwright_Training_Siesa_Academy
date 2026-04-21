/**
 * Playwright Academy - Curriculum Data Configuration
 * 140 Lecciones Prácticas organizadas en 21 Secciones (~45 horas)
 * Version: 2026.1-v1.0
 */

window.PLAYWRIGHT_CURRICULUM = {
    config: {
        academyName: "Playwright Academy",
        tagline: "140 Lecciones Prácticas para QA Engineers (~45 horas)",
        totalLessons: 140,
        totalSections: 21,
        version: "2026.1-v1.0",
        lastUpdated: "2026-04-01",
        defaultLanguage: "es",
        supportedLanguages: ["es", "en"]
    },

    levels: {
        beginner: {
            name: "Básico",
            icon: "🟢",
            description: "Fundamentos de Playwright con Python (Lecciones 001-052)",
            range: [1, 52]
        },
        intermediate: {
            name: "Intermedio",
            icon: "🟡",
            description: "Técnicas avanzadas y patrones (Lecciones 053-098)",
            range: [53, 98]
        },
        advanced: {
            name: "Avanzado",
            icon: "🔴",
            description: "Enterprise, CI/CD y certificación (Lecciones 099-135)",
            range: [99, 135]
        }
    },

    sections: {
        "section-01": {
            id: 1,
            title: "Configuración del Entorno",
            icon: "⚙️",
            description: "Configuración completa del entorno de desarrollo para Playwright con Python",
            level: "beginner",
            order: 1,
            totalLessons: 10,
            estimatedHours: 1.5,
            status: "available",
            lessons: [
                { id: 1, title: "Introducción a Playwright con Python", duration: "8 min", level: "beginner", type: "foundation", section: "section-01", topics: ["playwright", "introducción", "python"], hasCode: true, hasExercise: true, estimatedTime: 8, difficulty: "easy" },
                { id: 2, title: "Instalación de Python y pip", duration: "5 min", level: "beginner", type: "standard", section: "section-01", topics: ["python", "instalación", "pip"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 3, title: "Instalación de Playwright y navegadores", duration: "8 min", level: "beginner", type: "foundation", section: "section-01", topics: ["playwright", "instalación", "navegadores"], hasCode: true, hasExercise: true, estimatedTime: 8, difficulty: "easy" },
                { id: 4, title: "Configuración de VS Code / PyCharm", duration: "5 min", level: "beginner", type: "standard", section: "section-01", topics: ["vscode", "pycharm", "configuración"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 5, title: "Primer test con Playwright", duration: "8 min", level: "beginner", type: "foundation", section: "section-01", topics: ["test", "pytest", "primer-test"], hasCode: true, hasExercise: true, estimatedTime: 8, difficulty: "easy" },
                { id: 6, title: "Estructura de un proyecto Playwright", duration: "5 min", level: "beginner", type: "standard", section: "section-01", topics: ["proyecto", "estructura", "organización"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 7, title: "Configuración pytest para Playwright", duration: "5 min", level: "beginner", type: "standard", section: "section-01", topics: ["pytest", "configuración", "conftest"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 8, title: "Ejecución y selectores de tests", duration: "5 min", level: "beginner", type: "standard", section: "section-01", topics: ["ejecución", "selectores", "pytest"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 9, title: "Git y control de versiones para QA", duration: "5 min", level: "beginner", type: "standard", section: "section-01", topics: ["git", "versiones", "qa"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 10, title: "Troubleshooting de instalación", duration: "8 min", level: "beginner", type: "integration", section: "section-01", topics: ["troubleshooting", "errores", "instalación"], hasCode: true, hasExercise: true, estimatedTime: 8, difficulty: "medium" }
            ]
        },
        "section-02": {
            id: 2,
            title: "Fundamentos de Playwright",
            icon: "🎭",
            description: "Conceptos fundamentales de testing con Playwright y pytest",
            level: "beginner",
            order: 2,
            totalLessons: 10,
            estimatedHours: 1.5,
            status: "available",
            lessons: [
                { id: 11, title: "Anatomía de un test Playwright", duration: "8 min", level: "beginner", type: "foundation", section: "section-02", topics: ["test", "anatomía", "estructura"], hasCode: true, hasExercise: true, estimatedTime: 8, difficulty: "easy" },
                { id: 12, title: "Navegación y páginas", duration: "5 min", level: "beginner", type: "standard", section: "section-02", topics: ["navegación", "páginas", "goto"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 13, title: "Assertions con expect()", duration: "8 min", level: "beginner", type: "foundation", section: "section-02", topics: ["assertions", "expect", "verificaciones"], hasCode: true, hasExercise: true, estimatedTime: 8, difficulty: "easy" },
                { id: 14, title: "Interacciones básicas: click, fill, type", duration: "5 min", level: "beginner", type: "standard", section: "section-02", topics: ["click", "fill", "type", "interacciones"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 15, title: "Capturas de pantalla y videos", duration: "5 min", level: "beginner", type: "standard", section: "section-02", topics: ["screenshots", "videos", "evidencias"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 16, title: "Setup y Teardown con pytest", duration: "5 min", level: "beginner", type: "standard", section: "section-02", topics: ["setup", "teardown", "fixtures"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 17, title: "Manejo de timeouts", duration: "5 min", level: "beginner", type: "standard", section: "section-02", topics: ["timeouts", "esperas", "configuración"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 18, title: "Logging y mensajes de debug", duration: "5 min", level: "beginner", type: "standard", section: "section-02", topics: ["logging", "debug", "mensajes"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 19, title: "Tags y marcadores pytest", duration: "5 min", level: "beginner", type: "standard", section: "section-02", topics: ["markers", "tags", "pytest"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 20, title: "Ejercicio integrador: primer test suite", duration: "10 min", level: "beginner", type: "integration", section: "section-02", topics: ["integración", "test-suite", "proyecto"], hasCode: true, hasExercise: true, estimatedTime: 10, difficulty: "medium" }
            ]
        },
        "section-03": {
            id: 3,
            title: "Python para Testers QA",
            icon: "🐍",
            description: "Python esencial para automatización de pruebas QA",
            level: "beginner",
            order: 3,
            totalLessons: 8,
            estimatedHours: 1.5,
            status: "available",
            lessons: [
                { id: 21, title: "Variables, tipos de datos y f-strings", duration: "5 min", level: "beginner", type: "standard", section: "section-03", topics: ["python", "variables", "f-strings", "tipos"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 22, title: "Funciones y módulos Python", duration: "5 min", level: "beginner", type: "standard", section: "section-03", topics: ["funciones", "módulos", "python"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 23, title: "Manejo de archivos y datos (JSON, YAML, CSV)", duration: "5 min", level: "beginner", type: "standard", section: "section-03", topics: ["archivos", "json", "yaml", "csv"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 24, title: "Clases y objetos para testing", duration: "5 min", level: "beginner", type: "standard", section: "section-03", topics: ["clases", "objetos", "oop"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 25, title: "Fixtures avanzadas de pytest", duration: "8 min", level: "beginner", type: "foundation", section: "section-03", topics: ["fixtures", "pytest", "avanzado"], hasCode: true, hasExercise: true, estimatedTime: 8, difficulty: "medium" },
                { id: 26, title: "Variables de entorno y configuración", duration: "5 min", level: "beginner", type: "standard", section: "section-03", topics: ["entorno", "variables", "configuración"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 27, title: "Manejo de excepciones en tests", duration: "5 min", level: "beginner", type: "standard", section: "section-03", topics: ["excepciones", "try-except", "errores"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 28, title: "Proyecto: Config multi-ambiente", duration: "10 min", level: "beginner", type: "integration", section: "section-03", topics: ["proyecto", "multi-ambiente", "configuración"], hasCode: true, hasExercise: true, estimatedTime: 10, difficulty: "medium" }
            ]
        },
        "section-04": {
            id: 4,
            title: "Interacciones Web Fundamentales",
            icon: "🌐",
            description: "Interacción con formularios, botones, tablas y elementos web",
            level: "beginner",
            order: 4,
            totalLessons: 8,
            estimatedHours: 1.5,
            status: "available",
            lessons: [
                { id: 29, title: "Formularios: fill, check, select", duration: "8 min", level: "beginner", type: "foundation", section: "section-04", topics: ["formularios", "fill", "check", "select"], hasCode: true, hasExercise: true, estimatedTime: 8, difficulty: "easy" },
                { id: 30, title: "Botones, links y navegación", duration: "5 min", level: "beginner", type: "standard", section: "section-04", topics: ["botones", "links", "navegación"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 31, title: "Tablas y listas HTML", duration: "5 min", level: "beginner", type: "standard", section: "section-04", topics: ["tablas", "listas", "html"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 32, title: "Dropdowns y componentes UI", duration: "5 min", level: "beginner", type: "standard", section: "section-04", topics: ["dropdowns", "componentes", "select"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 33, title: "Uploads y downloads de archivos", duration: "5 min", level: "beginner", type: "standard", section: "section-04", topics: ["uploads", "downloads", "archivos"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 34, title: "Iframes y ventanas múltiples", duration: "5 min", level: "beginner", type: "standard", section: "section-04", topics: ["iframes", "ventanas", "frames"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 35, title: "Dialogs: alert, confirm, prompt", duration: "5 min", level: "beginner", type: "standard", section: "section-04", topics: ["dialogs", "alert", "confirm", "prompt"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 36, title: "Proyecto: Automatización formulario completo", duration: "10 min", level: "beginner", type: "integration", section: "section-04", topics: ["proyecto", "formulario", "integración"], hasCode: true, hasExercise: true, estimatedTime: 10, difficulty: "medium" }
            ]
        },
        "section-05": {
            id: 5,
            title: "Localizadores y Selectores",
            icon: "🎯",
            description: "Dominar localizadores y selectores en Playwright",
            level: "beginner",
            order: 5,
            totalLessons: 8,
            estimatedHours: 1.5,
            status: "available",
            lessons: [
                { id: 37, title: "Localizadores built-in de Playwright", duration: "8 min", level: "beginner", type: "foundation", section: "section-05", topics: ["localizadores", "built-in", "playwright"], hasCode: true, hasExercise: true, estimatedTime: 8, difficulty: "easy" },
                { id: 38, title: "CSS Selectors en Playwright", duration: "5 min", level: "beginner", type: "standard", section: "section-05", topics: ["css", "selectores"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 39, title: "XPath cuando es necesario", duration: "5 min", level: "beginner", type: "standard", section: "section-05", topics: ["xpath", "selectores"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 40, title: "Localizadores semánticos y accesibilidad", duration: "15 min", level: "beginner", type: "standard", section: "section-05", topics: ["semánticos", "accesibilidad", "aria"], hasCode: true, hasExercise: true, estimatedTime: 15, difficulty: "easy" },
                { id: 41, title: "Filtrado y encadenamiento de locators", duration: "5 min", level: "beginner", type: "standard", section: "section-05", topics: ["filtrado", "encadenamiento", "locators"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 42, title: "Localizadores relativos y por layout", duration: "5 min", level: "beginner", type: "standard", section: "section-05", topics: ["relativos", "layout", "locators"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 43, title: "Estrategias de localizadores robustos", duration: "5 min", level: "beginner", type: "standard", section: "section-05", topics: ["estrategias", "robustos", "mantenimiento"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 44, title: "Proyecto: Localizadores resilientes", duration: "10 min", level: "beginner", type: "integration", section: "section-05", topics: ["proyecto", "localizadores", "resilientes"], hasCode: true, hasExercise: true, estimatedTime: 10, difficulty: "medium" }
            ]
        },
        "section-06": {
            id: 6,
            title: "Interacciones Web Avanzadas",
            icon: "⚡",
            description: "Interacciones avanzadas: JS execution, drag&drop, shadow DOM",
            level: "beginner",
            order: 6,
            totalLessons: 8,
            estimatedHours: 1.5,
            status: "available",
            lessons: [
                { id: 45, title: "JavaScript execution desde Playwright", duration: "8 min", level: "beginner", type: "foundation", section: "section-06", topics: ["javascript", "evaluate", "ejecución"], hasCode: true, hasExercise: true, estimatedTime: 8, difficulty: "medium" },
                { id: 46, title: "Drag and drop, hover, right-click", duration: "5 min", level: "beginner", type: "standard", section: "section-06", topics: ["drag-drop", "hover", "right-click"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 47, title: "Keyboard events avanzados", duration: "5 min", level: "beginner", type: "standard", section: "section-06", topics: ["keyboard", "teclas", "eventos"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 48, title: "Scroll y elementos virtualizados", duration: "5 min", level: "beginner", type: "standard", section: "section-06", topics: ["scroll", "virtualización", "lazy-loading"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 49, title: "Shadow DOM y Web Components", duration: "5 min", level: "beginner", type: "standard", section: "section-06", topics: ["shadow-dom", "web-components"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 50, title: "Storage y cookies", duration: "5 min", level: "beginner", type: "standard", section: "section-06", topics: ["storage", "cookies", "localStorage"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 51, title: "Geolocation, permissions, device emulation", duration: "5 min", level: "beginner", type: "standard", section: "section-06", topics: ["geolocation", "permisos", "emulación"], hasCode: true, hasExercise: true, estimatedTime: 5, difficulty: "easy" },
                { id: 52, title: "Proyecto: Interacciones complejas E2E", duration: "35 min", level: "beginner", type: "integration", section: "section-06", topics: ["proyecto", "e2e", "interacciones"], hasCode: true, hasExercise: true, estimatedTime: 35, difficulty: "medium" }
            ]
        },
        "section-07": {
            id: 7,
            title: "Page Object Model y Helpers",
            icon: "🏗️",
            description: "Patrón Page Object Model y helpers reutilizables",
            level: "intermediate",
            order: 7,
            totalLessons: 7,
            estimatedHours: 2,
            status: "available",
            lessons: [
                { id: 53, title: "Introducción al Page Object Model", duration: "8 min", level: "intermediate", type: "foundation", section: "section-07", topics: ["pom", "page-object", "introducción"], hasCode: true, hasExercise: true, estimatedTime: 8, difficulty: "medium" },
                { id: 54, title: "Implementación POM con Playwright", duration: "7 min", level: "intermediate", type: "standard", section: "section-07", topics: ["pom", "implementación", "playwright"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 55, title: "Components y fragmentos reutilizables", duration: "7 min", level: "intermediate", type: "standard", section: "section-07", topics: ["componentes", "reutilización", "fragmentos"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 56, title: "Helpers y utilidades de testing", duration: "7 min", level: "intermediate", type: "standard", section: "section-07", topics: ["helpers", "utilidades", "testing"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 57, title: "Fixtures integradas con POM", duration: "7 min", level: "intermediate", type: "standard", section: "section-07", topics: ["fixtures", "pom", "integración"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 58, title: "POM avanzado: Builder pattern y fluent API", duration: "7 min", level: "intermediate", type: "standard", section: "section-07", topics: ["builder-pattern", "fluent-api", "avanzado"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 59, title: "Proyecto: Framework POM completo", duration: "12 min", level: "intermediate", type: "integration", section: "section-07", topics: ["proyecto", "framework", "pom"], hasCode: true, hasExercise: true, estimatedTime: 12, difficulty: "medium" }
            ]
        },
        "section-08": {
            id: 8,
            title: "Auto-waiting y Actionability",
            icon: "⏳",
            description: "Auto-waiting y actionability: el game-changer de Playwright",
            level: "intermediate",
            order: 8,
            totalLessons: 5,
            estimatedHours: 2,
            status: "available",
            lessons: [
                { id: 60, title: "Concepto de Auto-waiting en Playwright", duration: "8 min", level: "intermediate", type: "foundation", section: "section-08", topics: ["auto-waiting", "concepto", "playwright"], hasCode: true, hasExercise: true, estimatedTime: 8, difficulty: "medium" },
                { id: 61, title: "Actionability: visible, enabled, stable", duration: "7 min", level: "intermediate", type: "standard", section: "section-08", topics: ["actionability", "visible", "enabled", "stable"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 62, title: "Wait strategies: expect vs manual waits", duration: "7 min", level: "intermediate", type: "standard", section: "section-08", topics: ["waits", "expect", "estrategias"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 63, title: "Esperando eventos y navegaciones", duration: "7 min", level: "intermediate", type: "standard", section: "section-08", topics: ["eventos", "navegación", "esperas"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 64, title: "Proyecto: Tests sin waits explícitos", duration: "10 min", level: "intermediate", type: "integration", section: "section-08", topics: ["proyecto", "auto-waiting", "sin-waits"], hasCode: true, hasExercise: true, estimatedTime: 10, difficulty: "medium" }
            ]
        },
        "section-09": {
            id: 9,
            title: "Network Interception y Mocking",
            icon: "🔌",
            description: "Interceptar y mockear peticiones de red",
            level: "intermediate",
            order: 9,
            totalLessons: 6,
            estimatedHours: 2,
            status: "available",
            lessons: [
                { id: 65, title: "Fundamentos de intercepción de red", duration: "8 min", level: "intermediate", type: "foundation", section: "section-09", topics: ["network", "intercepción", "fundamentos"], hasCode: true, hasExercise: true, estimatedTime: 8, difficulty: "medium" },
                { id: 66, title: "Mocking de API responses", duration: "7 min", level: "intermediate", type: "standard", section: "section-09", topics: ["mocking", "api", "responses"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 67, title: "Modificar requests en vuelo", duration: "7 min", level: "intermediate", type: "standard", section: "section-09", topics: ["requests", "modificar", "intercepción"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 68, title: "Bloquear recursos: imágenes, tracking", duration: "7 min", level: "intermediate", type: "standard", section: "section-09", topics: ["bloqueo", "recursos", "imágenes", "tracking"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 69, title: "Captura y validación de network traffic", duration: "7 min", level: "intermediate", type: "standard", section: "section-09", topics: ["captura", "validación", "traffic"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 70, title: "Proyecto: Tests con API completamente mockeada", duration: "10 min", level: "intermediate", type: "integration", section: "section-09", topics: ["proyecto", "mocking", "api"], hasCode: true, hasExercise: true, estimatedTime: 10, difficulty: "medium" }
            ]
        },
        "section-10": {
            id: 10,
            title: "API Testing con Playwright",
            icon: "🔗",
            description: "Testing de APIs REST con APIRequestContext",
            level: "intermediate",
            order: 10,
            totalLessons: 7,
            estimatedHours: 2,
            status: "available",
            lessons: [
                { id: 71, title: "APIRequestContext de Playwright", duration: "8 min", level: "intermediate", type: "foundation", section: "section-10", topics: ["api", "request-context", "playwright"], hasCode: true, hasExercise: true, estimatedTime: 8, difficulty: "medium" },
                { id: 72, title: "Testing REST APIs: CRUD completo", duration: "7 min", level: "intermediate", type: "standard", section: "section-10", topics: ["rest", "crud", "api"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 73, title: "Autenticación: tokens, OAuth, cookies", duration: "7 min", level: "intermediate", type: "standard", section: "section-10", topics: ["autenticación", "tokens", "oauth", "cookies"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 74, title: "Validación de schemas JSON", duration: "7 min", level: "intermediate", type: "standard", section: "section-10", topics: ["schemas", "json", "validación"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 75, title: "Combinando API + UI tests", duration: "7 min", level: "intermediate", type: "standard", section: "section-10", topics: ["api", "ui", "combinación"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 76, title: "API mocking para tests de UI", duration: "7 min", level: "intermediate", type: "standard", section: "section-10", topics: ["mocking", "api", "ui"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 77, title: "Proyecto: API testing suite completa", duration: "12 min", level: "intermediate", type: "integration", section: "section-10", topics: ["proyecto", "api", "suite"], hasCode: true, hasExercise: true, estimatedTime: 12, difficulty: "medium" }
            ]
        },
        "section-11": {
            id: 11,
            title: "Database Testing",
            icon: "🗄️",
            description: "Testing de bases de datos integrado con UI",
            level: "intermediate",
            order: 11,
            totalLessons: 5,
            estimatedHours: 2,
            status: "available",
            lessons: [
                { id: 78, title: "Conexión a bases de datos desde Python", duration: "8 min", level: "intermediate", type: "foundation", section: "section-11", topics: ["database", "conexión", "python"], hasCode: true, hasExercise: true, estimatedTime: 8, difficulty: "medium" },
                { id: 79, title: "Queries SQL en tests", duration: "7 min", level: "intermediate", type: "standard", section: "section-11", topics: ["sql", "queries", "tests"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 80, title: "Setup y cleanup de datos de prueba", duration: "7 min", level: "intermediate", type: "standard", section: "section-11", topics: ["setup", "cleanup", "datos-prueba"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 81, title: "Validación cruzada UI-DB", duration: "7 min", level: "intermediate", type: "standard", section: "section-11", topics: ["validación", "ui", "database"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 82, title: "Proyecto: Tests integrados UI + API + DB", duration: "10 min", level: "intermediate", type: "integration", section: "section-11", topics: ["proyecto", "integración", "ui-api-db"], hasCode: true, hasExercise: true, estimatedTime: 10, difficulty: "medium" }
            ]
        },
        "section-12": {
            id: 12,
            title: "Data-Driven Testing",
            icon: "📊",
            description: "Pruebas dirigidas por datos con pytest.parametrize",
            level: "intermediate",
            order: 12,
            totalLessons: 5,
            estimatedHours: 2,
            status: "available",
            lessons: [
                { id: 83, title: "pytest.mark.parametrize básico", duration: "8 min", level: "intermediate", type: "foundation", section: "section-12", topics: ["parametrize", "data-driven", "pytest"], hasCode: true, hasExercise: true, estimatedTime: 8, difficulty: "medium" },
                { id: 84, title: "Datos desde archivos externos", duration: "7 min", level: "intermediate", type: "standard", section: "section-12", topics: ["archivos", "datos", "externos"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 85, title: "Fixtures parametrizadas", duration: "7 min", level: "intermediate", type: "standard", section: "section-12", topics: ["fixtures", "parametrizadas", "pytest"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 86, title: "Combinaciones y matrices de prueba", duration: "7 min", level: "intermediate", type: "standard", section: "section-12", topics: ["combinaciones", "matrices", "prueba"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 87, title: "Proyecto: Suite data-driven completa", duration: "10 min", level: "intermediate", type: "integration", section: "section-12", topics: ["proyecto", "data-driven", "suite"], hasCode: true, hasExercise: true, estimatedTime: 10, difficulty: "medium" }
            ]
        },
        "section-13": {
            id: 13,
            title: "Browser Contexts e Isolation",
            icon: "🔒",
            description: "Aislamiento con Browser Contexts y storage state",
            level: "intermediate",
            order: 13,
            totalLessons: 5,
            estimatedHours: 2,
            status: "available",
            lessons: [
                { id: 88, title: "Browser vs Context vs Page", duration: "8 min", level: "intermediate", type: "foundation", section: "section-13", topics: ["browser", "context", "page", "jerarquía"], hasCode: true, hasExercise: true, estimatedTime: 8, difficulty: "medium" },
                { id: 89, title: "Tests con múltiples contexts", duration: "7 min", level: "intermediate", type: "standard", section: "section-13", topics: ["múltiples", "contexts", "aislamiento"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 90, title: "Storage state: reutilizar sesiones", duration: "7 min", level: "intermediate", type: "standard", section: "section-13", topics: ["storage-state", "sesiones", "reutilización"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 91, title: "Perfiles de navegador y configuración", duration: "7 min", level: "intermediate", type: "standard", section: "section-13", topics: ["perfiles", "navegador", "configuración"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 92, title: "Proyecto: Tests multi-usuario con aislamiento", duration: "10 min", level: "intermediate", type: "integration", section: "section-13", topics: ["proyecto", "multi-usuario", "aislamiento"], hasCode: true, hasExercise: true, estimatedTime: 10, difficulty: "medium" }
            ]
        },
        "section-14": {
            id: 14,
            title: "Debugging: Inspector, Trace, Codegen",
            icon: "🔍",
            description: "Herramientas de debugging: Inspector, Trace Viewer, Codegen",
            level: "intermediate",
            order: 14,
            totalLessons: 6,
            estimatedHours: 2,
            status: "available",
            lessons: [
                { id: 93, title: "Playwright Inspector y PWDEBUG", duration: "8 min", level: "intermediate", type: "foundation", section: "section-14", topics: ["inspector", "pwdebug", "debugging"], hasCode: true, hasExercise: true, estimatedTime: 8, difficulty: "medium" },
                { id: 94, title: "Playwright Codegen", duration: "7 min", level: "intermediate", type: "standard", section: "section-14", topics: ["codegen", "generación", "código"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 95, title: "Trace Viewer: grabación y análisis", duration: "7 min", level: "intermediate", type: "standard", section: "section-14", topics: ["trace-viewer", "grabación", "análisis"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 96, title: "Debug avanzado: breakpoints y VS Code", duration: "7 min", level: "intermediate", type: "standard", section: "section-14", topics: ["breakpoints", "vscode", "debug"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 97, title: "Análisis de fallos con screenshots y videos", duration: "7 min", level: "intermediate", type: "standard", section: "section-14", topics: ["fallos", "screenshots", "videos", "análisis"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 98, title: "Proyecto: Diagnosticar y corregir test inestable", duration: "10 min", level: "intermediate", type: "integration", section: "section-14", topics: ["proyecto", "diagnóstico", "flaky-test"], hasCode: true, hasExercise: true, estimatedTime: 10, difficulty: "medium" }
            ]
        },
        "section-15": {
            id: 15,
            title: "Visual Regression y Accessibility Testing",
            icon: "👁️",
            description: "Visual regression, accessibility y security testing",
            level: "advanced",
            order: 15,
            totalLessons: 6,
            estimatedHours: 2,
            status: "available",
            lessons: [
                { id: 99, title: "Screenshot comparison nativa", duration: "10 min", level: "advanced", type: "foundation", section: "section-15", topics: ["visual-regression", "screenshots", "comparación"], hasCode: true, hasExercise: true, estimatedTime: 10, difficulty: "medium" },
                { id: 100, title: "Masking y umbrales de comparación", duration: "18 min", level: "advanced", type: "standard", section: "section-15", topics: ["masking", "umbrales", "comparación"], hasCode: true, hasExercise: true, estimatedTime: 18, difficulty: "medium" },
                { id: 101, title: "Accessibility testing con axe-core", duration: "7 min", level: "advanced", type: "standard", section: "section-15", topics: ["accessibility", "axe-core", "a11y"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 102, title: "Auditorías de accesibilidad automatizadas", duration: "7 min", level: "advanced", type: "standard", section: "section-15", topics: ["auditorías", "accesibilidad", "automatización"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 103, title: "Security headers y HTTPS validation", duration: "7 min", level: "advanced", type: "standard", section: "section-15", topics: ["security", "headers", "https"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 104, title: "Proyecto: Suite visual + a11y + security", duration: "15 min", level: "advanced", type: "capstone", section: "section-15", topics: ["proyecto", "visual", "a11y", "security"], hasCode: true, hasExercise: true, estimatedTime: 15, difficulty: "hard" }
            ]
        },
        "section-16": {
            id: 16,
            title: "Reporting y Trace Viewer",
            icon: "📈",
            description: "Reportes HTML, Allure y Trace Viewer avanzado",
            level: "advanced",
            order: 16,
            totalLessons: 5,
            estimatedHours: 2,
            status: "available",
            lessons: [
                { id: 105, title: "Reportes HTML con pytest-html", duration: "10 min", level: "advanced", type: "foundation", section: "section-16", topics: ["reporting", "html", "pytest-html"], hasCode: true, hasExercise: true, estimatedTime: 10, difficulty: "medium" },
                { id: 106, title: "Allure reports para Playwright", duration: "7 min", level: "advanced", type: "standard", section: "section-16", topics: ["allure", "reports", "playwright"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 107, title: "Trace Viewer avanzado", duration: "7 min", level: "advanced", type: "standard", section: "section-16", topics: ["trace-viewer", "avanzado", "análisis"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 108, title: "Métricas y dashboards personalizados", duration: "7 min", level: "advanced", type: "standard", section: "section-16", topics: ["métricas", "dashboards", "personalización"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 109, title: "Proyecto: Pipeline de reporting completo", duration: "12 min", level: "advanced", type: "capstone", section: "section-16", topics: ["proyecto", "pipeline", "reporting"], hasCode: true, hasExercise: true, estimatedTime: 12, difficulty: "hard" }
            ]
        },
        "section-17": {
            id: 17,
            title: "CI/CD Integration",
            icon: "🚀",
            description: "Integración con CI/CD: Docker, GitHub Actions, Jenkins",
            level: "advanced",
            order: 17,
            totalLessons: 7,
            estimatedHours: 2,
            status: "available",
            lessons: [
                { id: 110, title: "Playwright en Docker", duration: "10 min", level: "advanced", type: "foundation", section: "section-17", topics: ["docker", "contenedores", "playwright"], hasCode: true, hasExercise: true, estimatedTime: 10, difficulty: "medium" },
                { id: 111, title: "GitHub Actions con Playwright", duration: "7 min", level: "advanced", type: "standard", section: "section-17", topics: ["github-actions", "ci", "playwright"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 112, title: "Jenkins y GitLab CI con Playwright", duration: "7 min", level: "advanced", type: "standard", section: "section-17", topics: ["jenkins", "gitlab-ci", "playwright"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 113, title: "Ejecución paralela y sharding", duration: "7 min", level: "advanced", type: "standard", section: "section-17", topics: ["paralelo", "sharding", "ejecución"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 114, title: "Retry y manejo de flaky tests", duration: "7 min", level: "advanced", type: "standard", section: "section-17", topics: ["retry", "flaky", "estabilidad"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 115, title: "Azure DevOps y pipelines Windows", duration: "20 min", level: "advanced", type: "standard", section: "section-17", topics: ["azure-devops", "windows", "pipelines"], hasCode: true, hasExercise: true, estimatedTime: 20, difficulty: "medium" },
                { id: 116, title: "Proyecto: Pipeline CI/CD completo", duration: "15 min", level: "advanced", type: "capstone", section: "section-17", topics: ["proyecto", "pipeline", "cicd"], hasCode: true, hasExercise: true, estimatedTime: 15, difficulty: "hard" }
            ]
        },
        "section-18": {
            id: 18,
            title: "Arquitecturas y Patrones Enterprise",
            icon: "🏢",
            description: "Arquitecturas enterprise y patrones de diseño",
            level: "advanced",
            order: 18,
            totalLessons: 7,
            estimatedHours: 2,
            status: "available",
            lessons: [
                { id: 117, title: "Arquitectura de framework scalable", duration: "10 min", level: "advanced", type: "foundation", section: "section-18", topics: ["arquitectura", "framework", "scalable"], hasCode: true, hasExercise: true, estimatedTime: 10, difficulty: "hard" },
                { id: 118, title: "Multi-proyecto y monorepo", duration: "7 min", level: "advanced", type: "standard", section: "section-18", topics: ["multi-proyecto", "monorepo", "organización"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 119, title: "Plugins y extensiones pytest", duration: "7 min", level: "advanced", type: "standard", section: "section-18", topics: ["plugins", "extensiones", "pytest"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 120, title: "Patrones de test: AAA, Builder, Factory", duration: "7 min", level: "advanced", type: "standard", section: "section-18", topics: ["patrones", "aaa", "builder", "factory"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 121, title: "Testing microservicios y APIs distribuidas", duration: "7 min", level: "advanced", type: "standard", section: "section-18", topics: ["microservicios", "apis", "distribuidas"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "hard" },
                { id: 122, title: "Performance y carga básica", duration: "7 min", level: "advanced", type: "standard", section: "section-18", topics: ["performance", "carga", "métricas"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 123, title: "Proyecto: Framework enterprise completo", duration: "15 min", level: "advanced", type: "capstone", section: "section-18", topics: ["proyecto", "framework", "enterprise"], hasCode: true, hasExercise: true, estimatedTime: 15, difficulty: "hard" }
            ]
        },
        "section-19": {
            id: 19,
            title: "Best Practices y Patrones",
            icon: "✨",
            description: "Best practices para tests mantenibles y estables",
            level: "advanced",
            order: 19,
            totalLessons: 5,
            estimatedHours: 2,
            status: "available",
            lessons: [
                { id: 124, title: "Principios de tests mantenibles", duration: "10 min", level: "advanced", type: "foundation", section: "section-19", topics: ["principios", "mantenibilidad", "tests"], hasCode: true, hasExercise: true, estimatedTime: 10, difficulty: "medium" },
                { id: 125, title: "Naming conventions y organización", duration: "7 min", level: "advanced", type: "standard", section: "section-19", topics: ["naming", "convenciones", "organización"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 126, title: "Manejo de datos de prueba", duration: "7 min", level: "advanced", type: "standard", section: "section-19", topics: ["datos-prueba", "manejo", "estrategias"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 127, title: "Test flakiness: prevención y diagnóstico", duration: "7 min", level: "advanced", type: "standard", section: "section-19", topics: ["flakiness", "prevención", "diagnóstico"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" },
                { id: 128, title: "Code review y estándares QA", duration: "7 min", level: "advanced", type: "standard", section: "section-19", topics: ["code-review", "estándares", "qa"], hasCode: true, hasExercise: true, estimatedTime: 7, difficulty: "medium" }
            ]
        },
        "section-20": {
            id: 20,
            title: "Proyectos Capstone",
            icon: "🏆",
            description: "Proyectos capstone integradores y certificación",
            level: "advanced",
            order: 20,
            totalLessons: 7,
            estimatedHours: 5,
            status: "available",
            lessons: [
                { id: 129, title: "E-commerce Testing Suite", duration: "20 min", level: "advanced", type: "capstone", section: "section-20", topics: ["e-commerce", "suite", "capstone"], hasCode: true, hasExercise: true, estimatedTime: 20, difficulty: "hard" },
                { id: 130, title: "API Microservices Testing", duration: "20 min", level: "advanced", type: "capstone", section: "section-20", topics: ["api", "microservicios", "capstone"], hasCode: true, hasExercise: true, estimatedTime: 20, difficulty: "hard" },
                { id: 131, title: "Multi-browser + Multi-device", duration: "20 min", level: "advanced", type: "capstone", section: "section-20", topics: ["multi-browser", "multi-device", "capstone"], hasCode: true, hasExercise: true, estimatedTime: 20, difficulty: "hard" },
                { id: 132, title: "CI/CD Pipeline Enterprise", duration: "20 min", level: "advanced", type: "capstone", section: "section-20", topics: ["cicd", "pipeline", "enterprise", "capstone"], hasCode: true, hasExercise: true, estimatedTime: 20, difficulty: "hard" },
                { id: 133, title: "Network Mocking + Visual Regression", duration: "20 min", level: "advanced", type: "capstone", section: "section-20", topics: ["mocking", "visual-regression", "capstone"], hasCode: true, hasExercise: true, estimatedTime: 20, difficulty: "hard" },
                { id: 134, title: "Accessibility + Security Audit", duration: "20 min", level: "advanced", type: "capstone", section: "section-20", topics: ["accessibility", "security", "audit", "capstone"], hasCode: true, hasExercise: true, estimatedTime: 20, difficulty: "hard" },
                { id: 135, title: "Proyecto Final: Certificación QA Playwright", duration: "25 min", level: "advanced", type: "capstone", section: "section-20", topics: ["certificación", "proyecto-final", "capstone"], hasCode: true, hasExercise: true, estimatedTime: 25, difficulty: "hard" }
            ]
        },
        "section-21": {
            id: 21,
            title: "Retos Abiertos y Recursos",
            icon: "🎯",
            description: "Challenges sin guía y recursos complementarios para seguir creciendo",
            level: "advanced",
            order: 21,
            totalLessons: 5,
            estimatedHours: 5,
            status: "available",
            lessons: [
                { id: 136, title: "Challenge: Automatiza sin guía (Básico)", duration: "60 min", level: "beginner", type: "challenge", section: "section-21", topics: ["challenge", "reto-abierto", "saucedemo", "básico"], hasCode: false, hasExercise: true, estimatedTime: 60, difficulty: "medium" },
                { id: 137, title: "Challenge: Diseña tu framework (Intermedio)", duration: "90 min", level: "intermediate", type: "challenge", section: "section-21", topics: ["challenge", "reto-abierto", "framework", "POM", "intermedio"], hasCode: false, hasExercise: true, estimatedTime: 90, difficulty: "hard" },
                { id: 138, title: "Challenge: Auditoría QA completa (Avanzado)", duration: "120 min", level: "advanced", type: "challenge", section: "section-21", topics: ["challenge", "reto-abierto", "auditoría", "E2E", "API", "accesibilidad", "CI/CD", "avanzado"], hasCode: false, hasExercise: true, estimatedTime: 120, difficulty: "hard" },
                { id: 139, title: "Glosario QA + Infraestructura Cloud", duration: "15 min", level: "beginner", type: "reference", section: "section-21", topics: ["glosario", "docker", "kubernetes", "GCP", "CI/CD", "referencia"], hasCode: false, hasExercise: false, estimatedTime: 15, difficulty: "easy" },
                { id: 140, title: "Recursos y rutas de aprendizaje complementarias", duration: "10 min", level: "beginner", type: "reference", section: "section-21", topics: ["recursos", "herramientas", "práctica", "comunidad", "referencia"], hasCode: false, hasExercise: false, estimatedTime: 10, difficulty: "easy" }
            ]
        }
    },

    utils: {
        getLessonById: function(id) {
            for (const section of Object.values(PLAYWRIGHT_CURRICULUM.sections)) {
                const lesson = section.lessons.find(l => l.id === id);
                if (lesson) return lesson;
            }
            return null;
        },
        searchLessons: function(query) {
            const results = [];
            const q = query.toLowerCase();
            Object.values(PLAYWRIGHT_CURRICULUM.sections).forEach(section => {
                section.lessons.forEach(lesson => {
                    if (lesson.title.toLowerCase().includes(q) ||
                        (lesson.topics && lesson.topics.some(t => t.toLowerCase().includes(q)))) {
                        results.push({...lesson, sectionTitle: section.title});
                    }
                });
            });
            return results;
        },
        getProgressStats: function(completedIds) {
            const total = PLAYWRIGHT_CURRICULUM.config.totalLessons;
            const completed = completedIds.length;
            return {
                total: total,
                completed: completed,
                percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
                levels: {
                    beginner: completedIds.filter(id => id >= 1 && id <= 52).length,
                    intermediate: completedIds.filter(id => id >= 53 && id <= 98).length,
                    advanced: completedIds.filter(id => id >= 99 && id <= 140).length
                }
            };
        }
    }
};
