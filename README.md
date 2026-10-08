# DE MENDIGO A EMPERADOR — Crónicas del Barro

**Versión 0.1.0 — Prólogo jugable.** Juego incremental medieval para ordenador y móvil. Todo el proyecto funciona sin servicios externos, cuentas ni backend. Está preparado para GitHub Pages.

## Jugar inmediatamente

Abre `index.html` en un navegador de escritorio, o publica el contenido del ZIP en GitHub Pages. El juego incluye un script tradicional `js/app.js` para que no necesites servidor local ni compilación: debería abrirse también mediante doble clic en `index.html` en navegadores que permitan archivos locales.

En iPhone, accede a la URL de GitHub Pages desde Safari. Puedes usar Compartir → Añadir a pantalla de inicio. El autoguardado permanece en el navegador y sitio de origen donde juegues.

## Publicar en GitHub Pages (sin instalar nada)

1. Crea un repositorio nuevo en GitHub, por ejemplo `mendigo-emperador`.
2. Sube **el contenido** de la carpeta `de-mendigo-a-emperador` a la raíz del repositorio. Deben verse `index.html`, `js/`, `css/`, `assets/`, `manifest.webmanifest` y `service-worker.js` directamente en la raíz. No subas una carpeta extra que encierre todo.
3. En el repositorio ve a **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**, la rama `main` y la carpeta `/ (root)`. Guarda la configuración.
5. Espera la publicación. La URL del proyecto normalmente tendrá el formato `https://TU-USUARIO.github.io/mendigo-emperador/`.
6. En Safari, abre esa URL y, si lo deseas, pulsa **Compartir → Añadir a pantalla de inicio**.

La URL de publicación dependerá del nombre exacto del repositorio y de la configuración de GitHub.

## Lo que funciona en 0.1

- Acciones manuales: mendigar, buscar comida, recoger madera, extraer piedra y realizar encargos.
- Energía, descanso con enfriamiento, saciedad y experiencia.
- 10 herramientas y construcciones: desde una manta hasta un puesto comercial.
- Ascenso de mendigo a trabajador y después a comerciante.
- Contratación de leñadores, recolectoras, canteros y vendedores automáticos; salarios y plazas limitadas.
- Mercado con precios cambiantes, compras y ventas, y un tablón de contratos periódicos.
- Siete objetivos con recompensas, nueve logros y cinco acontecimientos con decisiones.
- Autoguardado local, copia de respaldo, exportación e importación JSON.
- Producción offline limitada y aviso al regresar.
- Interfaz adaptable a móvil y PC y cacheado opcional para una PWA en HTTPS.

**La versión 0.1 termina en el primer puesto comercial.** Aún no hay talleres complejos, ciudad, nobleza ni conquista; eso llegará en versiones posteriores.

## Guardados y privacidad

La partida se guarda automáticamente en el almacenamiento de tu navegador. El juego intenta usar IndexedDB y conserva un espejo en localStorage. Periódicamente genera una copia de respaldo, y también puedes exportar un archivo desde **Crónica → Exportar partida**.

No hay sincronización en la nube: PC, Safari y la webapp instalada pueden tener almacenamientos separados según la configuración del navegador. Para mover la partida a otro dispositivo utiliza **Exportar** en el primero e **Importar** en el segundo. No borres los datos del navegador antes de exportar una copia.

Cuando se añadan nuevas versiones, se mantendrá el formato de partida o se crearán migraciones explícitas antes de publicarlas.

## Desarrollo y pruebas

La versión desplegable incluye `js/app.js` ya compilado, **sin dependencias en ejecución**. El código fuente editable está en `js/data.js`, `js/engine.js`, `js/storage.js` y `js/main.js`.

Si tienes Node.js, puedes reconstruir el bundle y ejecutar las pruebas:

```bash
npm run build
npm test
```

También se incluye un `tests/browser_check.py` opcional que utiliza Playwright y Chromium para revisar la interacción y el diseño responsive. Se ejecutó como prueba de integración inyectando los archivos localmente, porque el entorno de pruebas bloquea la navegación a URL locales; no es necesario para jugar ni publicar.

## Próximas iteraciones

- **0.2 — Comerciante:** talleres, cadenas de producción, tiendas, comercio por rutas y trabajadores especializados.
- **0.3 — Alcalde:** fundación de una aldea, vivienda, población, edificios, impuestos y bienestar.
- **0.4 — Noble:** mapa, provincias, diplomacia, personajes y campañas.
- **0.5 — Rey y emperador:** gestión de reinos, leyes, vasallos y crisis.
- **0.6 — Legado:** dinastías, prestigio, mundos alternativos y crónicas.
- **1.0:** equilibrio de todas las etapas, más eventos, controles de calidad y mejoras finales.

No hace falta abrir una partida nueva en cada versión si la actualización conserva el formato o incluye la correspondiente migración.
