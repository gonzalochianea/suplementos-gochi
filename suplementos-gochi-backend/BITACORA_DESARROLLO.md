# 📓 Bitácora de Aprendizaje y Desarrollo: Suplementos Gochi

**Trabajo Práctico Final - Backend Developer (UTN BA)**
**Autor:** Gonzalo  
**Stack Tecnológico:** Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt, Multer, Supabase Storage, Swagger UI.
**Convención de Código:** Estándar Corporativo Internacional (*Código e identificadores en Inglés + Mensajes HTTP y Comentarios en Español*).

---

## 🏛️ 1. Arquitectura General y Convención de Idioma del Proyecto

### 1.1 Separación en Capas (Responsabilidad Única)
Seguimos una **arquitectura en capas estricta** (separación de responsabilidades):

1. **Rutas (`src/routes/`)**: Definen los endpoints HTTP (`GET`, `POST`, `PUT`/`PATCH`, `DELETE`) y asocian middlewares y controladores.
2. **Controladores (`src/controllers/`)**: Capa delgada encargada exclusivamente de recibir `req` (`params`, `query`, `body`), invocar el servicio correspondiente y responder con el código HTTP adecuado (`res.status(...).json(...)`).
3. **Servicios (`src/services/`)**: Contienen **toda la lógica de negocio** y las interacciones con la base de datos a través de los modelos de Mongoose.
4. **Modelos (`src/models/`)**: Definen los Schemas de Mongoose, tipos de datos, validaciones de campo, índices únicos y hooks (como el hasheo de contraseñas con `bcrypt`).
5. **Separación de arranque**:
   - `src/app.js`: Ensambla la aplicación de Express, middlewares globales (CORS, JSON, parser, rutas y manejador de errores `errorHandler`). No inicia el servidor para facilitar pruebas y modularidad.
   - `src/index.js`: Punto de entrada que conecta a la base de datos (`connectDB()`) y levanta el servidor escuchando en el puerto configurado.

### 1.2 Estándar Corporativo Internacional (Código en Inglés + Mensajes/Comentarios en Español)
- **🧠 Decisión de Arquitectura adoptada desde el inicio del proyecto:**
  - En la ingeniería de software profesional existen dos convenciones válidas, pero una regla innegociable: **jamás mezclar idiomas (*Spanglish*) dentro de los identificadores de un mismo proyecto**.
  - Adoptamos el **Estándar Corporativo Internacional**: el 100% de los identificadores técnicos del código se escribe en **inglés**, mientras que todos los mensajes de error orientados al usuario final, las validaciones de Mongoose y los comentarios explicativos se mantienen en **español**:
    - **Modelos y Colecciones:** `User` (`users`), `Category` (`categories`), `Supplement` (`supplements`).
    - **Propiedades de Esquemas:** `name`, `description`, `price`, `stock`, `available`, `category`, `image`, `email`, `password`, `role` (`"admin"` | `"client"`).
    - **Rutas y Endpoints REST:** `/api/users/register`, `/api/users/login`, `/api/categories`, `/api/supplements`, `/api/supplements/:id/image`.
    - **Middlewares y Utilidades:** `connectDB`, `AppError`, `errorHandler`, `verifyToken`, `allowRoles`, `uploadImage`.

---

## 🚀 FASE 1: Inicialización del Proyecto

### Paso 1.1: Apertura de Terminal e Inicialización con `npm init -y`

- **Comando ejecutado:** `npm init -y`
- **¿Para qué sirve?**
  - Genera el archivo maestro de configuración del proyecto: `package.json`.
  - La bandera `-y` responde "yes" a todas las preguntas iniciales por defecto, creando un manifiesto limpio.

### Paso 1.2: Configuración de ES Modules (`"type": "module"`) y Scripts

- **Archivo editado:** `package.json`
- **Conceptos clave implementados:**
  1. `"type": "module"`: Le indica al entorno de Node.js que use el estándar moderno de JavaScript (ECMAScript Modules o ESM). Nos permite utilizar `import ... from ...` y `export`, además de `top-level await` (usar `await` directamente fuera de funciones `async`), dejando atrás el formato antiguo CommonJS (`require`).
  2. `"main": "src/index.js"`: Define la ruta oficial de entrada de la aplicación.
  3. `"scripts"`:
     - `"start": "node --watch src/index.js"`: Ejecuta la aplicación utilizando el observador nativo de Node.js (`--watch`), que reinicia el servidor en caliente cada vez que guardamos un archivo con `Ctrl + S`, sin necesidad de herramientas externas como `nodemon`.
     - `"seed": "node src/seed.js"`: Script que ejecutaremos para resetear y poblar la base de datos con categorías, suplementos y usuarios iniciales.

### Paso 1.3: Instalación de las Dependencias Oficiales

- **Comando ejecutado:** `npm install express mongoose dotenv cors bcrypt jsonwebtoken multer @supabase/supabase-js swagger-ui-express swagger-jsdoc`
- **¿Para qué sirve cada librería instalada?**
  1. `express`: Framework HTTP minimalista para manejar rutas, peticiones y respuestas.
  2. `mongoose`: Modelado de objetos para MongoDB (Schemas, validaciones y queries).
  3. `dotenv`: Carga de variables de entorno desde el archivo `.env` hacia `process.env`.
  4. `cors`: Habilita peticiones entre diferentes dominios/puertos (API y Frontend React).
  5. `bcrypt`: Hasheo criptográfico seguro de contraseñas de usuarios.
  6. `jsonwebtoken`: Generación y validación de tokens JWT para autenticación.
  7. `multer`: Manejo de peticiones `multipart/form-data` para recibir imágenes de suplementos.
  8. `@supabase/supabase-js`: SDK oficial para interactuar con Supabase Storage en la nube.
  9. `swagger-ui-express` y `swagger-jsdoc`: Generador e interfaz gráfica para la documentación OpenAPI 3.0 en `/api-docs`.

### Paso 1.4: Configuración del archivo `.gitignore`

- **Archivo creado:** `.gitignore`
- **Contenido y explicación detallada de cada línea ignorada:**
  1. `node_modules`: Carpeta pesada con todas las librerías de terceros descargadas por `npm install`. Jamás se sube a Git.
  2. `.env`: Archivo con secretos críticos (claves de base de datos, credenciales de Supabase y secreto de JWT). Ignorarlo evita filtraciones públicas de seguridad.
  3. `uploads`: Directorio local donde se guardan las fotos subidas durante el desarrollo cuando se usa `STORAGE=local`. Evita llenar el repositorio de archivos multimedia de prueba.
  4. `*.log`: Archivos de registro de errores y eventos generados automáticamente por Node o npm. El asterisco `*` es un comodín (_wildcard_) que atrapa cualquier archivo que termine con la extensión `.log`.
  5. `.DS_Store`: Archivo oculto generado automáticamente por el sistema operativo **macOS (Apple)** en el Finder para guardar preferencias de visualización de carpetas.
  6. `Thumbs.db`: Archivo de base de datos generado automáticamente por **Windows** para almacenar la caché de las miniaturas de imágenes en el explorador.

### Paso 1.5: Configuración de Variables de Entorno (`.env` y `.env.example`)

- **Archivos creados:** `.env` y `.env.example`
- **¿Para qué sirve cada variable de entorno?**
  - `PORT`: Puerto de red en el que escucha el servidor Express (por defecto `3000`).
  - `MONGO_URI`: Cadena de conexión a la base de datos MongoDB (en nuestro caso local: `mongodb://localhost:27017/suplementos_gochi`).
  - `JWT_SECRET`: Clave secreta criptográfica utilizada para firmar los tokens JWT. Garantiza que ningún cliente pueda falsificar tokens de autenticación.
  - `JWT_EXPIRES_IN`: Tiempo de expiración del token (ej: `2h` o `24h`), tras el cual el usuario debe volver a iniciar sesión.
  - `STORAGE`: Selector de almacenamiento de imágenes (`local` para guardar en disco o `supabase` para la nube).
  - `IMAGES_FOLDER`: Directorio o bucket donde se guardan las fotos subidas (por defecto `uploads`).
  - `API_URL`: URL base del servidor (`http://localhost:3000`), necesaria para generar URLs absolutas y accesibles de las imágenes locales.
  - `SUPABASE_URL` y `SUPABASE_KEY`: Credenciales de acceso al servicio de Supabase Storage en la nube.
- **Diferencia entre `.env` y `.env.example`:**
  - `.env`: Contiene las credenciales reales de tu máquina y está ignorado en Git para proteger secretos.
  - `.env.example`: Es una plantilla pública con datos de muestra (_placeholders_) que sí se sube a GitHub para que los profesores o evaluadores sepan qué variables necesita el proyecto para funcionar (requisito explícito del PDF del TP Final).

---

## 🏛️ FASE 2: Configuración Base del Servidor

### Paso 2.1: Estructura de Directorios en Capas (`src/`)

- **Comando ejecutado en Git Bash:**
  ```bash
  mkdir -p src/{utils,config,models,services,controllers,routes,middleware,docs}
  ```
- **Desglose técnico del comando:**
  - `mkdir`: Comando para crear directorios (_make directory_).
  - `-p` (_parents_): Flag fundamental que crea la carpeta padre `src` si no existía y previene errores si los directorios ya fueron creados.
  - `{utils,config,...}` (_brace expansion_ de Bash): Mecanismo que expande la lista separada por comas y genera todas las subcarpetas dentro de `src/` en una sola acción atómica.
- **Carpetas creadas y su responsabilidad arquitectónica:**
  - `src/utils/`: Constantes, configuración general (`config.js`) y clase `AppError.js`.
  - `src/config/`: Conectores a servicios externos (ej: cliente de Supabase).
  - `src/models/`: Schemas de Mongoose con validaciones y hooks de base de datos.
  - `src/services/`: Lógica de negocio pura y consultas directas a MongoDB.
  - `src/controllers/`: Controladores livianos encargados de recibir la petición HTTP y responder con status y JSON.
  - `src/routes/`: Enrutadores de Express (`express.Router()`) que conectan los verbos HTTP con sus controladores.
  - `src/middleware/`: Middlewares globales y de ruta (verificación de token, roles, subida de fotos y manejador de errores).
  - `src/docs/`: Configuración OpenAPI 3.0 / Swagger UI.

### Paso 2.2: Módulo Centralizado de Configuración (`src/utils/config.js`)

- **Archivo creado:** `src/utils/config.js`
- **¿Para qué sirve?**
  - Centraliza la lectura de `dotenv` en un único lugar. En lugar de importar `dotenv` y llamar a `process.env.VAR` por toda la aplicación, importamos las variables exportadas por este módulo.
  - Asigna valores por defecto (_fallbacks_): por ejemplo, si alguien borra o no tiene el `.env`, `PORT` no queda `undefined` (lo cual causaría que Express escuche en un puerto aleatorio sin avisar).
  - Incluye `dotenv.config({ quiet: true })` para silenciar mensajes innecesarios en consola durante el arranque y los tests.

### Paso 2.3: Conexión Asíncrona a MongoDB (`src/db.js`)

- **Archivo creado:** `src/db.js`
- **¿Para qué sirve?**
  - Encapsula la lógica de conexión a la base de datos MongoDB utilizando `mongoose.connect()` dentro de la función `connectDB`.
  - Muestra en consola el nombre de la base de datos activa mediante `mongoose.connection.name` para verificar a qué base estamos conectados en tiempo real.
  - Implementa un bloque `try/catch` de control crítico: si la base de datos no responde, imprime el error y ejecuta `process.exit(1)`, deteniendo el proceso de Node.js de inmediato para evitar que el servidor quede activo en un estado zombi o inconsistente.

### Paso 2.4: Ensamblado de la Aplicación Express (`src/app.js`)

- **Archivo creado:** `src/app.js`
- **¿Para qué sirve?**
  - Aplica la separación entre **ensamblado de Express** y **arranque de red**: `app.js` no conecta a la DB ni escucha en un puerto; únicamente configura la app y la exporta.
  - Configura `cors()` para autorizar peticiones desde otros dominios (el frontend de React).
  - Configura `express.json()` para parsear los cuerpos de las peticiones en formato JSON y dejarlos disponibles en `req.body`.
  - Configura `express.static()` para servir la carpeta local de imágenes subidas (`uploads/`).
  - Define una ruta raíz de comprobación de salud (_health check_) en `GET /` para validar el funcionamiento.
  - Incorpora el middleware final 404 para cualquier ruta no definida.
- **Regla de oro de ECMAScript Modules (ESM):** A diferencia de CommonJS o bundlers como Webpack, Node.js con `"type": "module"` exige obligatoriamente incluir la extensión `.js` en todos los imports relativos (ejemplo: `import ... from "./utils/config.js"`). Omitir el `.js` lanza un error `ERR_MODULE_NOT_FOUND`.

### Paso 2.5: Punto de Entrada y Arranque del Servidor (`src/index.js`)

- **Archivo creado:** `src/index.js`
- **¿Para qué sirve?**
  - Es el ejecutable principal que inicia la aplicación en producción y desarrollo (`node --watch src/index.js`).
  - Utiliza _top-level await_ (`await connectDB()`) para garantizar que la conexión con MongoDB esté 100% activa antes de abrir el puerto de red a los clientes.
  - Inicia la escucha con `app.listen(PORT, callback)` informando por consola la URL local de acceso (`http://localhost:3000`).

### Paso 2.6: Primer Arranque y Verificación Integral (Consola, Postman y Compass)

- **Comando ejecutado:** `npm start` (ejecuta en segundo plano `node --watch src/index.js`).
- **Verificación en consola:**
  1. Confirmación de base de datos activa: `MongoDB conectado a la base: "suplementos_gochi"`.
  2. Confirmación del servidor Express: `Servidor de Suplementos Gochi corriendo en http://localhost:3000`.
- **Verificación en Postman:**
  - Petición 1 (Ruta Raíz): `GET http://localhost:3000/` ➔ Retorna código `200 OK` con JSON `{ "message": "...", "status": "Servidor operativo", ... }`.
  - Petición 2 (Ruta 404): `GET http://localhost:3000/ruta-inexistente` ➔ Retorna código `404 Not Found` con `{ "error": "Esa ruta no existe" }`.
- **Verificación en MongoDB Compass:**
  - Conexión a la instancia local `mongodb://localhost:27017` para confirmar que el motor de base de datos está listo para recibir colecciones.
  - **Lección clave sobre Compass vs MongoDB:** Las conexiones guardadas en el panel izquierdo de Compass son accesos directos (_bookmarks_). Ambas conexiones locales apuntan al mismo motor `localhost:27017`. Borrar una base de datos desde un acceso directo la borra del disco real, mientras que _Remove connection_ solo elimina el atajo visual.

---

## 🛡️ FASE 3: Sistema de Manejo Centralizado de Errores

### Paso 3.1: Clase Personalizada de Errores de Negocio (`src/utils/AppError.js`)

- **Archivo creado:** `src/utils/AppError.js`
- **¿Para qué sirve?**
  - Hereda de la clase nativa de JavaScript `Error` (`class AppError extends Error`).
  - Permite instanciar errores que viajan con un mensaje descriptivo y un código de estado HTTP específico (`this.status = status`, por defecto 400).
  - Facilita el lanzamiento de errores de negocio en cualquier capa (servicios o controladores) mediante `throw new AppError("Mensaje", 404)` sin ensuciar el código con bloques `try/catch` repetitivos.
  - El middleware global de errores comprueba `if (error.name === "AppError")` y responde directamente al cliente con el status asignado.
- **Detalle de sintaxis (¿Por qué se tachaba `status` en VS Code?):**
  - Si en el constructor escribís `estatus` (con `e`) y abajo ponés `this.status = status` (sin `e`), JavaScript no encuentra la variable local y asume que te referís a la variable global obsoleta del navegador `window.status`. Al usar el parámetro `status` (en inglés), VS Code reconoce que es el argumento de la función y quita el tachado.

---

## 📋 Catálogo Completo de Errores Manejados en el Backend (Estándar UTN)

| Tipo de Error                   | Origen                            |          Código HTTP          | Significado y Cuándo Ocurre                                                                                                                                                                  |
| ------------------------------- | --------------------------------- | :---------------------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`AppError`**                  | Código propio / Reglas de negocio |  **400, 401, 403, 404, 409**  | Errores previstos por nosotros. Ejemplos: `404` si un producto no existe; `409` si intentás borrar una categoría que todavía tiene suplementos asociados; `403` si tu rol no tiene permisos. |
| **`entity.parse.failed`**       | Express (`express.json()`)        |      **400 Bad Request**      | El cuerpo enviado en Postman no es un JSON válido (ej: una coma de más, comillas sin cerrar o sintaxis rota).                                                                                |
| **`CastError`**                 | Mongoose                          |      **400 Bad Request**      | El `:id` enviado en la URL no tiene el formato válido de 24 caracteres hexadecimales de MongoDB (ej: `/api/supplements/123`).                                                                |
| **`ValidationError`**           | Mongoose                          |      **400 Bad Request**      | Se rompieron las reglas del Schema (ej: falta el campo obligatorio `name`, el precio es negativo o el nombre tiene menos de 3 letras). Devuelve un array `details` con cada falla.          |
| **`code: 11000`**               | MongoDB (Driver)                  |       **409 Conflict**        | Violación de clave única (_duplicate key_). Ejemplo: registrar un usuario con un email que ya está en la base de datos o una categoría con nombre duplicado.                                 |
| **`JsonWebTokenError`**         | `jsonwebtoken`                    |     **401 Unauthorized**      | El token JWT enviado en el header `Authorization: Bearer <token>` está corrupto o la firma no coincide.                                                                                      |
| **`TokenExpiredError`**         | `jsonwebtoken`                    |     **401 Unauthorized**      | El token JWT superó su tiempo de validez (`JWT_EXPIRES_IN`) y venció. El usuario debe volver a loguearse.                                                                                    |
| **`MulterError`**               | `multer`                          |      **400 Bad Request**      | El archivo subido excede el límite de peso configurado (ej: más de 4MB) o el nombre del campo en el formulario no es `"image"`.                                                              |
| **Filtro de formato**           | Multer / Validación nuestra       |      **400 Bad Request**      | Se intentó subir un archivo que no es una imagen permitida (ej: un `.pdf` o `.exe`).                                                                                                         |
| **Ruta no encontrada**          | Middleware 404 final              |       **404 Not Found**       | El cliente intentó consultar una URL que no existe en la API.                                                                                                                                |
| **Error Genérico / Inesperado** | Sistema / Bug no controlado       | **500 Internal Server Error** | Fallo no contemplado. El error completo se imprime en consola con `console.error` para los desarrolladores, y al cliente se le envía un mensaje genérico por seguridad.                      |

### Paso 3.2: Middleware Centralizado de Errores (`src/middleware/errorHandler.js`)

- **Archivo creado:** `src/middleware/errorHandler.js`
- **¿Para qué sirve?**
  - En Express, un middleware de error se distingue por recibir exactamente **4 parámetros**: `(error, req, res, next)`.
  - En Express 5, las funciones `async` que arrojan errores son capturadas automáticamente y enviadas a este middleware sin necesidad de escribir bloques `try/catch` manuales en cada controlador.
  - Examina el tipo o nombre del error (`error.name`, `error.type`, `error.code`) y traduce fallas técnicas del motor de base de datos o de librerías en respuestas HTTP claras, limpias y uniformes para el cliente.
  - Si ocurre un error desconocido, responde con código `500` protegiendo la seguridad del backend (los detalles técnicos van al `console.error` del servidor y no al cliente).
- **Desglose didáctico de sintaxis JavaScript avanzada usada en el middleware:**
  1. `Object.values(error.errors)`: Cuando Mongoose valida un documento y fallan varios campos (por ejemplo, falta el nombre y el precio es negativo), genera un objeto con clave-valor: `{ name: { message: "El nombre es obligatorio" }, price: { message: "El precio no puede ser negativo" } }`. La función de JavaScript `Object.values()` descarta las claves y extrae solo los objetos internos en un array (lista).
  2. `.map(e => e.message)`: El método `.map()` recorre cada elemento del array y lo transforma. En este caso, la función flecha `e => e.message` extrae exclusivamente el texto del mensaje de cada error, devolviendo una lista limpia: `["El nombre es obligatorio", "El precio no puede ser negativo"]`.
  3. `Object.keys(error.keyPattern)[0]`: Cuando MongoDB rebota un dato por clave duplicada (`code: 11000`), entrega un objeto como `{ email: 1 }`. Con `Object.keys()` extraemos los nombres de las claves (`["email"]`) y con `[0]` tomamos la primera (`duplicateField`) para armar el mensaje dinámico: `"Ya existe un registro con ese valor en el campo 'email'"`.
  4. `error.type === "entity.parse.failed"` (JSON roto): Quien genera este error es el middleware `express.json()` (basado en la librería `body-parser`). En la especificación HTTP, el cuerpo de una petición se denomina formalmente "entidad" (_entity_). Si el cliente manda un JSON con sintaxis rota (por ejemplo, una coma de más o comillas sin cerrar), `body-parser` le asigna la propiedad `.type = "entity.parse.failed"`. Al consultar `.type` en lugar de `.name` (que sería un genérico `SyntaxError`), tenemos la certeza absoluta de que falló el JSON enviado por el cliente y no una línea de nuestro propio código.
  5. Jerarquía interna de `MulterError`:
     - El `if (error.name === "MulterError")` actúa como filtro general: solo ingresa si el fallo provino de la subida de archivos de Multer.
     - Los `if` anidados examinan `error.code` para casos puntuales: `LIMIT_FILE_SIZE` (archivo mayor a 4MB) o `LIMIT_UNEXPECTED_FILE` (el campo del formulario no se llamaba `"image"`).
     - La palabra reservada `return` antes de `res.status(...).json(...)` es obligatoria para cortar la ejecución de la función de inmediato y evitar que Node intente enviar múltiples respuestas a una misma petición (_Cannot set headers after they are sent to the client_).

### Paso 3.3: Integración del Middleware de Errores en `src/app.js`

- **Archivo editado:** `src/app.js`
- **Regla de orden en Express:** El middleware de errores `app.use(errorHandler)` **debe colocarse siempre al final de toda la cadena**, justo después de las rutas y del middleware 404. De lo contrario, no podrá capturar los errores emitidos por los controladores.
- **Validación práctica:** Se probó exitosamente la captura de errores verificando la respuesta con status `400 Bad Request` en Postman y la detección de JSON malformados.

---

## 🏷️ FASE 4: Módulo de Categorías (CRUD Completo)

Las categorías son la base estructural de "Suplementos Gochi" (ej: Proteínas, Creatinas, Aminoácidos, Pre-entrenos, Vitaminas, Barritas). Cada suplemento que creemos en la Fase 5 pertenecerá a una categoría mediante una referencia de `ObjectId`.

Seguiremos el flujo en capas de abajo hacia arriba:

1. **Paso 4.1**: Modelo Mongoose (`src/models/category.js`).
2. **Paso 4.2**: Capa de Servicios (`src/services/categoryService.js`).
3. **Paso 4.3**: Capa de Controladores (`src/controllers/categoryController.js`).
4. **Paso 4.4**: Enrutador de Express (`src/routes/categoryRoutes.js`).
5. **Paso 4.5**: Registro de la ruta en `src/app.js` (`/api/categories`).
6. **Paso 4.6**: Pruebas completas en Postman (POST, GET general, GET por ID, PUT/PATCH, DELETE) y visualización en MongoDB Compass.

### Paso 4.1: Modelo Mongoose de Categoría (`src/models/category.js`)

- **Archivo creado:** `src/models/category.js`
- **¿Para qué sirve?**
  - Define el esquema (`categorySchema`) de las categorías con campos `name` (único, obligatorio, longitud entre 3 y 60 caracteres) y `description`.
  - Configura `timestamps: true` para registrar automáticamente fechas de creación y actualización (`createdAt`, `updatedAt`).
  - Configura `versionKey: false` para no exponer el campo interno `__v` de Mongoose en las respuestas de la API.
  - Exporta el modelo `Category` vinculado a la colección `"categories"` en MongoDB.

### Paso 4.2: Capa de Servicios de Categorías (`src/services/categoryService.js`)

- **Archivo creado:** `src/services/categoryService.js`
- **¿Para qué sirve?**
  - Implementa los métodos de acceso a datos con Mongoose: `find()`, `findById()`, `create()`, `findByIdAndUpdate()` y `deleteOne()`.
  - En `updateCategoryService`, se aplican las opciones `{ returnDocument: "after", runValidators: true }` para devolver el documento con los cambios aplicados y obligar a Mongoose a validar las restricciones del Schema en operaciones de actualización.
  - En `deleteCategoryService`, se busca primero el recurso para validar la integridad referencial antes del borrado.

### Paso 4.3: Capa de Controladores de Categorías (`src/controllers/categoryController.js`)

- **Archivo creado:** `src/controllers/categoryController.js`
- **¿Para qué sirve?**
  - Actúa como la capa de transporte HTTP: recibe la petición del cliente (`req.params`, `req.body`), delega la operación a la capa de servicios y responde con los códigos de estado HTTP normalizados (`200 OK`, `201 Created`, `404 Not Found`).
  - No contiene lógica de negocio ni consultas directas a Mongoose (principio de responsabilidad única).

### Paso 4.4: Enrutador de Categorías (`src/routes/categoryRoutes.js`)

- **Archivo creado:** `src/routes/categoryRoutes.js`
- **¿Para qué sirve?**
  - Utiliza `express.Router()` para definir los endpoints específicos de la entidad y asociar cada verbo HTTP con su controlador:
    - `GET /` ➔ `getCategoriesController`
    - `GET /:id` ➔ `getCategoryByIdController`
    - `POST /` ➔ `createCategoryController`
    - `PATCH /:id` y `PUT /:id` ➔ `updateCategoryController`
    - `DELETE /:id` ➔ `deleteCategoryController`
  - La notación `:id` define un parámetro dinámico de ruta que Express captura y expone en `req.params.id`.

### Paso 4.5: Montaje de Rutas en `src/app.js`

- **Archivo editado:** `src/app.js`
- **¿Para qué sirve?**
  - Registra el enrutador bajo el prefijo `/api/categories` mediante `app.use("/api/categories", categoryRoutes)`.
  - Todas las rutas definidas en `categoryRoutes.js` quedan automáticamente prefijadas por `/api/categories`.

### Paso 4.6: Pruebas del CRUD de Categorías en Postman y Verificación en Compass

- **Flujo de pruebas ejecutado con éxito:**
  1. `POST /api/categories` ➔ Creó "Proteínas" con código `201 Created` y generó su `_id`.
  2. `POST /api/categories` repetido ➔ Comprobó el control de unicidad (`unique: true`), capturado por el middleware con código `409 Conflict`.
  3. `GET /api/categories` ➔ Retornó `200 OK` con el listado completo de categorías ordenadas por nombre.
  4. `GET /api/categories/:id` ➔ Retornó `200 OK` con la categoría puntual.
  5. `PATCH /api/categories/:id` ➔ Modificó la descripción y retornó `200 OK` con los datos actualizados gracias a `returnDocument: "after"`.
- **Verificación en MongoDB Compass:**
  - Se confirmó en vivo la creación automática de la base de datos `suplementos_gochi` y la colección `categories`.

---

## 💊 FASE 5: Módulo de Suplementos (Relaciones, Populate y Filtros Dinámicos)

En esta fase desarrollamos la entidad principal del e-commerce: **`Supplement`**. Cumplirá con todos los requisitos funcionales del TP Final de la UTN:

- **Relación con clave foránea**: Campo `category` de tipo `mongoose.Schema.Types.ObjectId` referenciando al modelo `"Category"`.
- **Población de datos (`.populate()`)**: En los métodos de lectura `GET`, Mongoose traerá automáticamente el nombre y descripción de la categoría asociada en lugar de mostrar un simple ID plano.
- **Filtros dinámicos por query string (`req.query`)**: Búsqueda por texto parcial (`$regex`), filtro por categoría, filtro por rango de precio (`minPrice`, `maxPrice`) y disponibilidad (`available`).
- **Validación de integridad referencial**:
  - Al crear o editar un suplemento, se valida que la categoría exista antes de guardar. Si no existe, lanza un `AppError` con código 400.
  - Al intentar borrar una categoría, se verifica que no tenga suplementos asociados. Si tiene, se bloquea la eliminación con código `409 Conflict`.

### Paso 5.1: Modelo Mongoose de Suplemento (`src/models/supplement.js`)

- **Archivo creado:** `src/models/supplement.js`
- **¿Para qué sirve?**
  - Define el esquema de datos (`supplementSchema`) con validaciones estrictas: `name`, `description`, `price` (positivo), `stock` (entero no negativo), `available`, `image` (string o null) y `category` (`ObjectId` con `ref: "Category"`).
  - Incluye `timestamps: true` y `versionKey: false`.
  - Exporta el modelo `Supplement` vinculado a la colección `"supplements"`.

### Paso 5.2: Capa de Servicios de Suplementos (`src/services/supplementService.js`)

- **Archivo creado:** `src/services/supplementService.js`
- **¿Para qué sirve?**
  - **Filtros dinámicos con `req.query`**: Construye un objeto `filter` combinable según los parámetros recibidos:
    - Búsqueda por texto en el nombre: `$regex` con `$options: "i"` (búsqueda parcial insensible a mayúsculas/minúsculas).
    - Filtro por categoría: por `_id` de la categoría (`category`).
    - Filtro por precio: rango con `$gte` (_greater than or equal_) y `$lte` (_less than or equal_) usando `minPrice` y `maxPrice`.
    - Filtro por disponibilidad: booleano `available`.
    - Ordenamiento dinámico: operador ternario `sort === "desc" || sort === "-1" ? -1 : 1` aplicado en `.sort({ name: direction })`.
  - **Población relacional (`.populate("category", "name description")`)**: Reemplaza el ID de la categoría por su objeto completo con nombre y descripción al devolver los datos al cliente.
  - **Integridad referencial (`verifyCategoryService`)**: Valida que la categoría exista en la base antes de guardar o modificar un suplemento. Si no existe, lanza un `AppError` con código 400.

### Paso 5.3: Integridad Referencial Cruzada en Categorías (`src/services/categoryService.js`)

- **Archivo editado:** `src/services/categoryService.js`
- **¿Para qué sirve?**
  - En `deleteCategoryService`, se utiliza `Supplement.countDocuments({ category: id })` para verificar si la categoría tiene productos asignados.
  - Si `supplementsCount > 0`, se lanza un `AppError` con código `409 Conflict`, impidiendo que los suplementos queden huérfanos sin categoría.

### Paso 5.4: Capa de Controladores de Suplementos (`src/controllers/supplementController.js`)

- **Archivo creado:** `src/controllers/supplementController.js`
- **¿Para qué sirve?**
  - Maneja las solicitudes HTTP para el catálogo:
    - `getSupplementsController`: Pasa `req.query` al servicio para habilitar filtros y responde `200 OK`.
    - `getSupplementByIdController`: Recibe `req.params.id`, responde `200 OK` o `404 Not Found`.
    - `createSupplementController`: Envía `req.body` al servicio y responde `201 Created`.
    - `updateSupplementController`: Envía `req.params.id` y `req.body`, responde `200 OK` o `404 Not Found`.
    - `deleteSupplementController`: Envía `req.params.id`, responde `200 OK` o `404 Not Found`.

### Paso 5.5: Enrutador de Suplementos (`src/routes/supplementRoutes.js`)

- **Archivo creado:** `src/routes/supplementRoutes.js`
- **¿Para qué sirve?**
  - Utiliza `express.Router()` para definir los endpoints específicos de la entidad `Supplement` y asociar cada verbo HTTP con su controlador:
    - `GET /` → `getSupplementsController`
    - `GET /:id` → `getSupplementByIdController`
    - `POST /` → `createSupplementController`
    - `PATCH /:id` y `PUT /:id` → `updateSupplementController`
    - `DELETE /:id` → `deleteSupplementController`
  - **¿Por qué es idéntica en estructura a `categoryRoutes.js`?** Porque la arquitectura CRUD es la misma para ambas entidades. Lo único que cambia es de qué controlador importamos las funciones. Esto demuestra la consistencia de la arquitectura en capas: cada módulo es autónomo e intercambiable.

### Paso 5.6: Montaje de Rutas de Suplementos en `src/app.js`

- **Archivo editado:** `src/app.js`
- **¿Para qué sirve?**
  - Se agregaron dos líneas al archivo:
    1. `import supplementRoutes from "./routes/supplementRoutes.js"` → importa el enrutador de suplementos.
    2. `app.use("/api/supplements", supplementRoutes)` → monta todas las rutas del enrutador bajo el prefijo `/api/supplements`.
  - **Regla de orden en Express:** Las rutas se montan **antes** del middleware 404 y **antes** del middleware de errores `errorHandler`. Express procesa los middlewares en orden de declaración de arriba hacia abajo.

### Paso 5.7: Pruebas Completas del CRUD de Suplementos en Postman

Con el servidor corriendo (`npm start`), se probaron todas las operaciones:

| Operación              | Request                                                                        |                     Resultado esperado                     |
| ---------------------- | ------------------------------------------------------------------------------ | :--------------------------------------------------------: |
| Crear suplemento       | `POST /api/supplements` con body JSON (`name`, `price`, `stock`, `category`)   |       `201 Created` + objeto con `category` populado       |
| Listar todos           | `GET /api/supplements`                                                         | `200 OK` + array con campo `category` como objeto (no ID)  |
| Filtrar por nombre     | `GET /api/supplements?name=whey`                                               |    `200 OK` + solo los que coinciden (búsqueda parcial)    |
| Filtrar por precio     | `GET /api/supplements?minPrice=1000&maxPrice=5000`                             |          `200 OK` + suplementos dentro del rango           |
| Filtrar por categoría  | `GET /api/supplements?category=<ObjectId>`                                     |               `200 OK` + solo esa categoría                |
| Filtrar por disponible | `GET /api/supplements?available=true`                                          |              `200 OK` + solo los disponibles               |
| Ordenar Z-A            | `GET /api/supplements?sort=desc`                                               |          `200 OK` + listado en orden descendente           |
| Obtener por ID         | `GET /api/supplements/:id`                                                     |          `200 OK` + objeto con categoría populada          |
| Actualizar             | `PATCH /api/supplements/:id` con body parcial                                  |               `200 OK` + objeto actualizado                |
| Eliminar               | `DELETE /api/supplements/:id`                                                  |             `200 OK` + mensaje de confirmación             |
| Categoría inválida     | `POST` con `category` que no existe en DB                                      |        `400 Bad Request` con mensaje de `AppError`         |
| ID malformado          | `GET /api/supplements/123abc`                                                  |           `400 Bad Request` + CastError manejado           |

- **Concepto clave — `.populate()` en acción:** En lugar de recibir `"category": "6adcfafe569b82d15986a829"` (un ID plano), la API devuelve `"category": { "_id": "...", "name": "Proteínas", "description": "..." }`. Esto se logra porque Mongoose hace internamente una segunda consulta a la colección `categories` y reemplaza el ObjectId por el documento completo. Los campos `"name description"` en `.populate("category", "name description")` son una **proyección**: le decimos a Mongoose que solo traiga esos dos campos y deje el resto fuera de la respuesta.

- **🧠 Duda clave de desarrollo: ¿De dónde sale el mensaje `"No existe ninguna categoría con el ID ..."`?**
  - **Ubicación en el código:** [`src/services/supplementService.js`](file:///c:/Users/Gonza/OneDrive/Desktop/Programaci%C3%B3n/Backend/tp-final-suplementos/src/services/supplementService.js#L6-L13) dentro de la función `verifyCategoryService`.
  - **El circuito completo a través de las capas:**
    1. **Ruta (`supplementRoutes.js`)**: Recibe la petición `POST /api/supplements` y la delega a `createSupplementController`.
    2. **Controlador (`supplementController.js`)**: Extrae `req.body` y llama a `createSupplementService(req.body)`.
    3. **Servicio (`supplementService.js`)**: Antes de crear el suplemento en la base de datos, llama a `await verifyCategoryService(data.category)`.
    4. **Consulta a MongoDB (`Category.exists`)**: Verifica de forma ultra-rápida (sin traer todo el documento) si existe una categoría con ese `_id`. Al no encontrarla, retorna `null`.
    5. **Lanzamiento de Excepción (`AppError`)**: Al ser `null`, se ejecuta:
       ```js
       throw new AppError(
         `No existe ninguna categoría con el ID ${categoryId}`,
         400,
       );
       ```
    6. **Captura Global (`errorHandler.js`)**: En Express 5, las promesas rechazadas en controladores pasan automáticamente al middleware de errores. Allí, la regla `if (error.name === "AppError")` captura el objeto, toma el status `400` y el `message`, respondiendo en Postman:
       ```json
       { "error": "No existe ninguna categoría con el ID ..." }
       ```

---

## 👤 FASE 6: Módulo de Usuarios (Registro, Login y JWT)

En esta fase incorporamos el sistema de autenticación y autorización basado en **JSON Web Tokens (JWT)**. Los usuarios podrán registrarse con email y contraseña (que se hashea con **bcrypt** antes de guardar) e iniciar sesión para recibir un token firmado que usarán en las peticiones protegidas.

### Paso 6.1: Modelo Mongoose de Usuario (`src/models/user.js`)

- **Archivo creado:** `src/models/user.js`
- **Campos del Schema (`userSchema`):**
  - `name`: String obligatorio (2–60 caracteres). Representa el nombre real del cliente/usuario, por lo cual **no lleva `unique: true`** (múltiples usuarios pueden compartir el mismo nombre de pila o apellido).
  - `email`: String único (`unique: true`), obligatorio, `lowercase: true` y con validación de formato mediante expresión regular `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`. Es el identificador unívoco de la cuenta.
  - `password`: String obligatorio con validación estricta: mínimo 8 caracteres (`minLength: 8`) y al menos una letra mayúscula (`match: /[A-Z]/`). **Nunca se guarda en texto plano.**
  - `role`: String con `enum: ["admin", "client"]` y `default: "client"`. Los dos roles posibles del sistema.
- **Hook `pre("save")`:** La lógica más importante del modelo. Antes de guardar un documento en MongoDB, Mongoose ejecuta automáticamente este hook. En él:
  - Se verifica si el campo `password` fue modificado con `this.isModified("password")`.
  - Si fue modificado, se reemplaza el texto plano por su hash criptográfico: `this.password = await bcrypt.hash(this.password, 10)`. El `10` es el "salt rounds" — cuántas veces el algoritmo aplica la función de hasheo.
  - Si no fue modificado (por ejemplo, en un `PATCH` que solo cambia el nombre), el hook no toca la contraseña.
- **Método de instancia `verifyPassword(inputPassword)`:** Método personalizado que se agrega al prototipo del Schema (`userSchema.methods.verifyPassword`). Compara el texto plano enviado por el usuario en el login contra el hash guardado en la base usando `bcrypt.compare()`. Devuelve `true` o `false`.
- **🧠 Duda clave de desarrollo: ¿Por qué VS Code muestra 3 puntitos debajo de `await` en `await bcrypt.hash(...)`?**
  - Es un aviso informativo (_type hint_) de TypeScript/IntelliSense. Al ser `bcrypt` una librería nativa con enlaces en C++, VS Code no encuentra las definiciones de tipos exactas y advierte que `await` podría no tener efecto sobre el tipo. En tiempo de ejecución en Node.js, `bcrypt.hash` devuelve una Promesa perfectamente válida, por lo que el `await` funciona correctamente y el aviso puede ignorarse con total tranquilidad.

### Paso 6.2: Capa de Servicios de Usuarios (`src/services/userService.js`)

- **Archivo creado:** `src/services/userService.js`
- **`registerUserService(data)`:**
  - Crea el usuario con `User.create(data)`. El hook `pre("save")` del modelo hashea la contraseña automáticamente antes de impactar en MongoDB.
  - Convierte el documento de Mongoose a objeto plano con `newUser.toObject()` y elimina el campo `password` con `delete userResponse.password` antes de retornarlo.
- **🧠 Duda clave de desarrollo: ¿Por qué usamos `.toObject()` y `delete userResponse.password`?**
  - **Documento Mongoose vs Objeto Plano:** `User.create()` no devuelve un objeto JavaScript simple, sino un **Mongoose Document** lleno de métodos internos (`.save()`, getters/setters, hooks). En ese documento protegido, Mongoose no permite modificar propiedades arbitrariamente con operadores nativos. Con `.toObject()`, extraemos únicamente un objeto JavaScript estándar (POJO) con los datos limpios.
  - **¿Qué hace el operador `delete`?** Es una "tijera" en memoria: quita la clave `password` exclusivamente de la variable `userResponse`.
  - **¿Borra la contraseña de la base de datos? ¡NO!** En MongoDB la contraseña ya quedó guardada y protegida con su hash Bcrypt. Lo único que hace `delete` es evitar que viaje en la respuesta HTTP hacia el cliente (Postman o Frontend).
  - **¿Por qué no debemos mandar el hash al cliente?** Porque si un atacante intercepta el tráfico o mira las respuestas de la red, podría llevarse el hash e intentar descifrarlo fuera de línea (_offline brute-force attack_). El hash jamás debe salir del servidor.
- **`loginUserService({ email, password })`:**
  1. Busca al usuario por email. Si no existe, lanza `AppError("Credenciales inválidas", 401)`.
  2. Llama a `user.verifyPassword(password)`. Si no coincide, lanza `AppError("Credenciales inválidas", 401)`.
  3. **¿Por qué el mismo mensaje para ambos casos?** Por seguridad. Si distinguiéramos "email no encontrado" de "contraseña incorrecta", un atacante podría usar esa diferencia para descubrir qué emails están registrados (_user enumeration_).
  4. Genera el token JWT con `jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })`. El payload incluye el `_id` y el `role` para que los middlewares de protección puedan identificar al usuario y verificar sus permisos sin consultar la base de datos en cada petición.
  5. Devuelve el token y los datos del usuario (sin password): `{ token, user: userResponse }`.
- **🧠 Duda clave de desarrollo: ¿Cómo funciona exactamente `jwt.sign(...)`?**
  - **Metáfora del boliche y la pulsera VIP:** El login es la entrada del boliche donde mostrás tu DNI (email y password). Si está todo en orden, el boliche no te pide el DNI cada vez que vas a la barra a pedir un trago; en su lugar, te pone una **pulsera sellada (el JWT)**. En cada trago posterior (peticiones protegidas), el guardia solo mira la pulsera y su sello intacto para dejarte pasar.
  - **Los 3 argumentos de `jwt.sign(payload, secret, options)`:**
    1. **Payload (Datos visibles):** `{ id: user._id, role: user.role }`. Información clave del usuario en Base64. Permite que en las siguientes peticiones el middleware sepa quién sos y si sos `"admin"` sin tener que hacer una consulta lenta a MongoDB.
    2. **Secret (Firma criptográfica):** `JWT_SECRET`. La llave secreta con la que el servidor estampa su sello digital irreproducible.
    3. **Options (Opciones):** `{ expiresIn: JWT_EXPIRES_IN }` (ej: `"2h"`). Marca la validez temporal del pase para obligar a reautenticar si se vence.

### Paso 6.3: Capa de Controladores de Usuarios (`src/controllers/userController.js`)

- **Archivo creado:** `src/controllers/userController.js`
- **`registerUserController`:** Recibe `req.body`, llama al servicio y responde `201 Created`.
- **`loginUserController`:** Recibe `req.body`, llama al servicio y responde `200 OK` con el token JWT y los datos del usuario.

### Paso 6.4: Enrutador de Usuarios (`src/routes/userRoutes.js`)

- **Archivo creado:** `src/routes/userRoutes.js`
- Define dos rutas públicas (sin protección de token):
  - `POST /register` → `registerUserController`
  - `POST /login` → `loginUserController`
- Montado en `app.js` bajo el prefijo `/api/users`.

### Paso 6.5: Pruebas de Registro y Login en Postman

| Operación             | Endpoint / Método          | Body enviado                                                                                        |                     Resultado esperado                     |
| --------------------- | -------------------------- | --------------------------------------------------------------------------------------------------- | :--------------------------------------------------------: |
| **Registro exitoso**  | `POST /api/users/register` | `{ "name": "Admin Gochi", "email": "admin@gochi.com", "password": "Password123", "role": "admin" }` | `201 Created` + objeto de usuario (sin el campo `password`) |
| **Password inválida** | `POST /api/users/register` | `{ "name": "Test", "email": "test@gochi.com", "password": "corta" }`                                |      `400 Bad Request` (falla minLength / mayúscula)       |
| **Email duplicado**   | `POST /api/users/register` | Repetir `admin@gochi.com`                                                                           |       `409 Conflict` (atrapado por error.code 11000)       |
| **Login exitoso**     | `POST /api/users/login`    | `{ "email": "admin@gochi.com", "password": "Password123" }`                                         |      `200 OK` + `token` JWT firmado + objeto `user`        |
| **Password errónea**  | `POST /api/users/login`    | `{ "email": "admin@gochi.com", "password": "Password999" }`                                         |       `401 Unauthorized` ("Credenciales inválidas")        |
| **Email inexistente** | `POST /api/users/login`    | `{ "email": "nadie@gochi.com", "password": "Password123" }`                                         |       `401 Unauthorized` ("Credenciales inválidas")        |

---

## 🔐 FASE 7: Middlewares de Autenticación y Autorización

### Paso 7.1: Middleware de Verificación de Token (`src/middleware/verifyToken.js`)

- **Archivo creado:** `src/middleware/verifyToken.js`
- **Desglose anatómico línea por línea:**
  1. **`export const verifyToken = (req, res, next) => {`**: Todo middleware en Express recibe siempre estos tres parámetros: `req` (la petición entrante), `res` (la respuesta) y `next` (la función para dar paso al siguiente eslabón).
  2. **`const authHeader = req.headers["authorization"]`**: Express guarda todas las cabeceras HTTP que manda el cliente (Postman o el navegador) dentro del diccionario `req.headers` (todo en minúsculas).
  3. **`if (!authHeader || !authHeader.startsWith("Bearer "))`**: Validación defensiva doble. Primero comprueba si no mandaron cabecera (`!authHeader`), y segundo verifica con el método nativo de strings `.startsWith("Bearer ")` que cumpla el estándar internacional (`Bearer <token>`). Si falla cualquiera de las dos, lanza un `AppError` con status `401 Unauthorized`.
  4. **`const token = authHeader.split(" ")[1]`**: El método `.split(" ")` corta el texto `"Bearer eyJhbG..."` donde hay un espacio y genera un array de dos posiciones: `["Bearer", "eyJhbG..."]`. Al pedir el índice `[1]`, nos quedamos únicamente con el token limpio.
  5. **`const decoded = jwt.verify(token, JWT_SECRET)`**: El corazón de la seguridad. `jwt.verify` hace dos comprobaciones matemáticas con nuestra clave secreta:
     - Verifica que la firma no haya sido adulterada (nadie falsificó su rol).
     - Verifica que la fecha de expiración (`exp`) no haya vencido.
     - Si todo es legítimo, devuelve el **payload original** que guardamos en el login (`{ id, role, iat, exp }`). Si algo falla, lanza automáticamente `JsonWebTokenError` o `TokenExpiredError` que nuestro `errorHandler.js` ya sabe atajar.
  6. **`req.user = decoded`**: "Mochila de datos". Le agregamos una propiedad nueva `.user` al objeto `req` para que el siguiente middleware (`allowRoles`) o el controlador sepan quién es el usuario y qué rol tiene sin tener que ir a buscarlo a MongoDB.
  7. **`next()`**: "¡Todo en orden, podés pasar!". Le ordena a Express avanzar al siguiente middleware de la fila.

### Paso 7.2: Middleware de Autorización por Roles (`src/middleware/allowRoles.js`)

- **Archivo creado:** `src/middleware/allowRoles.js`
- **Desglose anatómico línea por línea:**
  1. **`export const allowRoles = (...allowedRoles) => {`**:
     - **¿Por qué usamos una función que devuelve otra función (Función de Orden Superior / _Higher-Order Function_)?** Porque un middleware normal de Express siempre recibe obligatoriamente `(req, res, next)`. Si quisiéramos pasarle un parámetro propio en la ruta —como `allowRoles("admin")`—, Express ejecutaría la función en el momento en que arranca el servidor en vez de esperar a que llegue una petición. Al envolver el middleware dentro de otra función externa, `allowRoles("admin")` se ejecuta al iniciar y **fabricamos a medida** el middleware `(req, res, next)` que recuerda qué roles le pasaste gracias al concepto de **Closure** (clausura).
     - **¿Qué hace el operador Rest `...allowedRoles`?** Esos tres puntitos agrupan todos los argumentos sueltos que le pasemos entre paréntesis y los mete automáticamente dentro de un **array**.
       - Si llamás a `allowRoles("admin")`, entonces `allowedRoles` vale `["admin"]`.
       - Si mañana tuvieras más roles y llamaras a `allowRoles("admin", "seller")`, entonces `allowedRoles` valdría `["admin", "seller"]`. Esto hace que el middleware sea 100% reutilizable y escalable.
  2. **`return (req, res, next) => {`**: Esta es la función middleware real que Express ejecutará cada vez que un usuario intente entrar a la ruta protegida.
  3. **`if (!req.user) { throw new AppError("Usuario no autenticado", 401) }`**:
     - **Red de seguridad (Programación defensiva):** Este middleware asume que **antes** en la fila de la ruta se ejecutó `verifyToken`, quien dejó cargada la "mochila" `req.user = { id, role }`. Si por algún descuido un programador pusiera `allowRoles` en una ruta olvidándose de poner `verifyToken` primero, `req.user` sería `undefined` y al intentar leer `req.user.role` en la línea siguiente la aplicación tiraría un error inesperado (`TypeError: Cannot read properties of undefined`). Con este `if`, frenamos con un `401 Unauthorized` prolijo.
  4. **`if (!allowedRoles.includes(req.user.role))`**:
     - El método `.includes(...)` de los arrays pregunta: _"¿Dentro de la lista de roles autorizados (`["admin"]`) está incluido el rol que trae este usuario en su token (`req.user.role`)?"_.
     - Si el usuario es `"client"`, `["admin"].includes("client")` da `false`. Con el signo `!` adelante (`!false` = `true`), entra al `if` y bloquea el paso.
  5. **`throw new AppError("No tenés permisos de administrador para realizar esta acción", 403)`**:
     - **Diferencia fundamental de examen entre `401` y `403`:**
       - **`401 Unauthorized` (Falla Autenticación):** _"No sé quién sos"_. No mandaste token, está mal formado o venció.
       - **`403 Forbidden` (Falla Autorización):** _"Sé perfectamente quién sos (tu token es válido y estás logueado como client), pero tu rango no te alcanza para entrar a esta zona exclusiva de administradores"_.
  6. **`next()`**: Si sobrevivió a los dos guardias (está autenticado y su rol está en la lista permitida), abre la barrera y deja pasar la petición hacia el controlador final.
- **Uso en las rutas:** Se encadena siempre **después** de `verifyToken`:
  ```js
  router.post(
    "/",
    verifyToken,
    allowRoles("admin"),
    createSupplementController,
  );
  ```

### Paso 7.3: Protección de Rutas en Suplementos y Categorías

- **Archivos editados:** `src/routes/categoryRoutes.js` y `src/routes/supplementRoutes.js`
- **Criterio de negocio (E-Commerce):**
  - **Rutas de lectura (`GET /` y `GET /:id`):** Quedan **100% públicas**. Cualquier visitante que entre a la tienda online "Suplementos Gochi" tiene que poder ver el catálogo de productos y las categorías sin estar obligado a crearse una cuenta ni iniciar sesión.
  - **Rutas de escritura (`POST /`, `PATCH /:id`, `PUT /:id`, `DELETE /:id`):** Quedan **blindadas**. Solo un usuario autenticado (`verifyToken`) y con rango de administrador (`allowRoles("admin")`) puede crear, modificar precios/stock o eliminar productos y categorías.
- **¿Cómo funciona la cadena de ejecución (Pipeline) en Express?**
  ```js
  router.post(
    "/",
    verifyToken,
    allowRoles("admin"),
    createCategoryController,
  );
  ```
  Express ejecuta los argumentos de izquierda a derecha como postas de control:
  1. **Posta 1 (`verifyToken` — sin paréntesis):** Se pasa la referencia directa a la función middleware. Extrae el header `Authorization: Bearer <token>`, comprueba la firma con `JWT_SECRET`, inyecta `req.user = { id, role }` y llama a `next()`. Si falla, corta el camino con `401 Unauthorized`.
  2. **Posta 2 (`allowRoles("admin")` — con paréntesis):** Se invoca la función de orden superior pasándole `"admin"`, lo cual devuelve el middleware `(req, res, next)` configurado para exigir ese rol. Lee `req.user.role`, comprueba que sea `"admin"` y llama a `next()`. Si es `"client"`, corta el camino con `403 Forbidden`.
  3. **Posta 3 (`createCategoryController`):** Solo se ejecuta si las dos postas anteriores llamaron a `next()`.
- **Matriz de pruebas de permisos en Postman:**

| Prueba               | Endpoint / Método      | Header `Authorization`     |                        Resultado esperado                        |
| -------------------- | ---------------------- | -------------------------- | :--------------------------------------------------------------: |
| **Catálogo público** | `GET /api/supplements` | Sin token (`No Auth`)      |             `200 OK` (devuelve la lista normalmente)             |
| **Sin token**        | `POST /api/categories` | Sin token (`No Auth`)      | `401 Unauthorized` ("No se proporcionó un token de autenticación válido") |
| **Token de Cliente** | `POST /api/categories` | `Bearer <client_token>`    |    `403 Forbidden` ("No tenés permisos de administrador...")     |
| **Token de Admin**   | `POST /api/categories` | `Bearer <admin_token>`     |          `201 Created` (crea la categoría exitosamente)          |

---

## 🖼️ FASE 8: Subida y Almacenamiento de Imágenes (Multer + Estrategia Local / Supabase Storage)

### Paso 8.1: Middleware de Multer para Recepción de Imágenes (`src/middleware/uploadImage.js`)

- **Archivo creado:** `src/middleware/uploadImage.js`
- **¿Por qué necesitamos Multer?**
  - Express por defecto solo sabe leer texto en formato JSON (`express.json()`). Cuando un usuario sube una foto desde un formulario o Postman, los datos viajan como **binarios** bajo el formato `multipart/form-data`. Multer intercepta esos bytes, los valida y los deja listos en `req.file`.
- **Desglose anatómico línea por línea:**
  1. **`const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]`**: Lista blanca (_whitelist_) de **MIME types** seguros. Evita que alguien intente subir un archivo ejecutable (`.exe`), un script (`.js`) o un PDF disfrazado.
  2. **`storage: multer.memoryStorage()`**:
     - **¿Por qué en memoria RAM y no directo en disco (`diskStorage`)?** Porque nuestra arquitectura soporta dos motores de almacenamiento intercambiables (`STORAGE=local` o `STORAGE=supabase`). Al usar `memoryStorage()`, Multer guarda los bytes de la foto temporalmente en `req.file.buffer` (en la memoria RAM) y le delega la decisión final al servicio de almacenamiento (`storageService.js`).
  3. **`limits: { fileSize: 4 * 1024 * 1024 }`**:
     - Multer mide el peso en **bytes**: `1024 bytes = 1 KB`, `1024 * 1024 = 1 MB`, y multiplicado por `4` equivale exactamente a **4 MB (4.194.304 bytes)**.
     - Si el archivo supera ese peso, Multer lanza automáticamente un `MulterError` con código `"LIMIT_FILE_SIZE"`, que nuestro `errorHandler.js` atrapa y convierte en un `400 Bad Request ("La imagen no puede pesar más de 4 MB")`.
  4. **`fileFilter: (req, file, cb) => { ... }`**:
     - Función aduanera que examina el archivo antes de aceptarlo. Recibe `cb` (_callback_), una función de Multer cuyo primer argumento es el error (`null` si no hay error) y el segundo un booleano (`true` = dejar pasar, `false` = rechazar).
     - Si `file.mimetype` está en `ALLOWED_TYPES`, ejecutamos `cb(null, true)`.
     - Si no está, ejecutamos `cb(new AppError("Formato no válido...", 400), false)`.
  5. **`export const uploadImage = upload.single("image")`**:
     - `.single("image")` genera el middleware que espera recibir **1 solo archivo** en el campo llamado exactamente `"image"`. Si en Postman alguien llama al campo `"foto"`, Multer lanza `LIMIT_UNEXPECTED_FILE` y nuestro `errorHandler.js` le avisa que el campo debe llamarse `"image"`.

### Paso 8.2: Configuración del Cliente de Supabase (`src/config/supabase.js`)

- **Archivo creado:** `src/config/supabase.js`
- **Desglose anatómico línea por línea:**
  1. **`import { createClient } from "@supabase/supabase-js"`**: Importa la función constructora oficial del SDK de Supabase.
  2. **`import { SUPABASE_URL, SUPABASE_KEY } from "../utils/config.js"`**: Trae las credenciales desde nuestro archivo centralizado de variables de entorno.
  3. **`export const supabase = (SUPABASE_URL && SUPABASE_KEY) ? createClient(SUPABASE_URL, SUPABASE_KEY) : null`**:
     - **¿Por qué usamos este operador ternario (`? :`) en lugar de llamar a `createClient` directo?**
     - Si llamáramos a `createClient(SUPABASE_URL, SUPABASE_KEY)` a secas y un evaluador corre el proyecto en modo `STORAGE=local` sin haber completado las variables de Supabase en su `.env`, `createClient(undefined, undefined)` haría crashear el servidor al arrancar con el error `supabaseUrl is required`.
     - Al validar primero `(SUPABASE_URL && SUPABASE_KEY)`, garantizamos que si no hay credenciales configuradas exporte `null` de forma segura y el servidor arranque sin problemas en modo local.

### Paso 8.3: Adaptadores de Storage (`src/services/storage/local.js` y `supabase.js`)

- **Archivos creados:** `src/services/storage/local.js` y `src/services/storage/supabase.js`
- **1. Adaptador Local (`local.js`):**
  - **`saveLocalImage(file, fileName)`**:
    - `await fs.mkdir(IMAGES_FOLDER, { recursive: true })`: Crea la carpeta `uploads/` si no existe; gracias a `{ recursive: true }`, no lanza error si ya estaba creada.
    - `await fs.writeFile(destinationPath, file.buffer)`: Toma los bytes en crudo desde la memoria RAM (`file.buffer`) y los escribe en el disco duro.
    - Devuelve la URL pública `${API_URL}/${IMAGES_FOLDER}/${fileName}` servida por `express.static`.
  - **`deleteLocalImage(imageUrl)`**:
    - `imageUrl.split("/").pop()`: Corta la URL por cada barra `/` y con `.pop()` extrae el último elemento (el nombre del archivo).
    - `await fs.unlink(filePath)`: Elimina el archivo físico del disco dentro de un `try/catch` silencioso por si ya había sido borrado manualmente.
- **2. Adaptador en la Nube (`supabase.js`):**
  - **`saveSupabaseImage(file, fileName)`**:
    - Verifica primero que el cliente `supabase` exista (`if (!supabase) throw new AppError(...)`).
    - `supabase.storage.from(IMAGES_FOLDER).upload(fileName, file.buffer, { contentType: file.mimetype })`: Sube el buffer al _bucket_ de Supabase e informa el `contentType` para que el navegador sepa renderizar la imagen en vez de descargarla.
    - `getPublicUrl(fileName)`: Obtiene y devuelve la URL pública (`data.publicUrl`) alojada en los servidores CDN de Supabase.
  - **`deleteSupabaseImage(imageUrl)`**:
    - Extrae el nombre del archivo con `.split("/").pop()` y lo borra del bucket con `.remove([fileName])`.

### Paso 8.4: Servicio Orquestador de Storage (`src/services/storageService.js`)

- **Archivo creado:** `src/services/storageService.js`
- **¿Por qué usamos el Patrón de Diseño _Strategy_ (Estrategia)?**
  - Si el controlador llamara directamente a `fs.writeFile`, el día que quisiéramos pasar a la nube tendríamos que reescribir el controlador. Con `storageService.js`, el controlador solo pide `saveImage(req.file)` o `deleteImage(url)` sin importarle si por detrás va al disco duro local o a Supabase. Basta con cambiar `STORAGE=local` por `STORAGE=supabase` en el `.env`.
- **Desglose anatómico línea por línea:**
  1. **`const extension = path.extname(file.originalname)`**: Extrae únicamente la extensión del nombre original que tenía la foto en la computadora del usuario (por ejemplo, de `"mi foto creatina.webp"` saca `".webp"`).
  2. **`const fileName = `${Date.now()}${extension}``**:
     - `Date.now()` devuelve el _timestamp_ actual en milisegundos (ej: `1730660000123`).
     - **¿Por qué renombramos el archivo con `Date.now()`?** Por dos motivos críticos:
       1. Evita colisiones: si dos administradores suben distintos productos cuyas fotos se llamaban `"imagen.png"`, no se pisan entre sí.
       2. Evita caracteres conflictivos en las URLs (espacios, tildes o eñes del nombre original).
  3. **`if (STORAGE === "supabase") return await saveSupabaseImage(...)`**: Si la variable de entorno indica `"supabase"`, delega al adaptador de la nube; en caso contrario, delega a `saveLocalImage(...)`.
  4. **`deleteImage(imageUrl)`**: Primero verifica `if (!imageUrl) return` (si el suplemento todavía tenía `image: null`, no hay nada que borrar) y luego delega el borrado físico al adaptador activo.

### Paso 8.5: Endpoint de Subida de Imagen en Suplementos (`PUT /api/supplements/:id/image`)

- **Archivos editados:** `src/controllers/supplementController.js` y `src/routes/supplementRoutes.js`
- **Desglose paso a paso de `uploadSupplementImageController`:**
  1. **`if (!req.file)`**: Verifica que Multer haya recibido efectivamente un archivo en el campo `"image"`. Si el usuario envió el formulario vacío, responde `400 Bad Request`.
  2. **`const supplement = await getSupplementByIdService(req.params.id)`**:
     - **¿Por qué buscamos el suplemento en MongoDB ANTES de guardar la foto en disco/Supabase?**
     - Porque si nos mandan un `:id` de un suplemento que no existe, cortamos rápido con `404 Not Found` sin haber guardado una foto huérfana en `uploads/` ni en Supabase.
  3. **`if (supplement.image) await deleteImage(supplement.image)`**: Si el suplemento ya tenía una imagen anterior (no era `null`), la borramos físicamente antes de subir la nueva para no acumular basura en el servidor.
  4. **`const imageUrl = await saveImage(req.file)`**: Guarda la nueva imagen y obtiene su URL pública (`http://localhost:3000/uploads/...` o la URL de Supabase).
  5. **`await updateSupplementService(req.params.id, { image: imageUrl })`**: Actualiza el campo `image` del documento en MongoDB y devuelve el suplemento completo con su nueva URL.
- **Cadena de middlewares en `src/routes/supplementRoutes.js`:**
  ```js
  router.put(
    "/:id/image",
    verifyToken,
    allowRoles("admin"),
    uploadImage,
    uploadSupplementImageController,
  );
  ```
  - **Orden lógico de los guardias:** Primero autenticamos (`verifyToken`) y autorizamos (`allowRoles("admin")`) **antes** de ejecutar `uploadImage` (Multer). Así evitamos que un usuario sin permisos ni siquiera pueda procesar un archivo en la memoria RAM del servidor.
- **Prueba en Postman (`multipart/form-data`):**
  1. Método `PUT` → `http://localhost:3000/api/supplements/<ID_DEL_SUPLEMENTO>/image`
  2. Pestaña **Authorization** → `Bearer Token` (Token de Admin).
  3. Pestaña **Body** → seleccionar **`form-data`** (no `raw`).
  4. En la columna **Key**, escribir `image`, cambiar el selector desplegable de la derecha de `Text` a **`File`**, y en **Value** hacer clic en _Select Files_ para elegir una foto `.jpg`, `.png` o `.webp`.

### Paso 8.6: Configuración del Bucket Público en la Nube con Supabase Storage

- **Configuración en el panel de Supabase (`https://supabase.com/dashboard`):**
  1. Ir al menú lateral **Storage** → **New bucket**.
  2. Nombre del bucket: **`uploads`** (debe coincidir exactamente con `IMAGES_FOLDER=uploads` del `.env`).
  3. Activar el interruptor **Public bucket** (para que las URLs generadas por `getPublicUrl` sean visibles desde el navegador y el Frontend sin requerir token de lectura).
  4. **Credenciales (`Project Settings` → `API` o `Data API` / `API Keys`):**
     - `SUPABASE_URL`: La URL del proyecto (`https://xxxx.supabase.co`).
     - `SUPABASE_KEY`: En un Backend seguro (donde el `.env` jamás se expone al navegador), se recomienda utilizar la clave **`service_role` (secret)** porque tiene permisos administrativos completos sobre el Storage sin ser bloqueada por políticas RLS (*Row Level Security*). Si se utiliza la clave `anon` (`public`), se debe agregar una política en *Storage → Policies* habilitando `SELECT`, `INSERT`, `UPDATE` y `DELETE` para el bucket `uploads`.
- **Cambio de estrategia en `.env`:**
  - Al cambiar `STORAGE=local` por `STORAGE=supabase`, el servicio `storageService.js` conmuta automáticamente al adaptador `src/services/storage/supabase.js` sin tocar una sola línea de los controladores ni de las rutas.

---

## 🌱 FASE 9: Población Masiva de Datos (ETL con `src/db.json` y `src/seed.js`)

### Paso 9.1: Incorporación del Dataset Base (`src/db.json`) al Backend
- **Estructura del dataset (`src/db.json`):**
  - Contiene **271 suplementos reales** con sus precios, descripciones y URLs de imágenes, clasificados en **6 categorías**:
    1. `barritas` → **Barritas** (42 productos)
    2. `proteinas` → **Proteínas** (50 productos)
    3. `creatinas` → **Creatinas** (50 productos)
    4. `aminoacidos` → **Aminoácidos** (49 productos)
    5. `vitaminas` → **Vitaminas** (50 productos)
    6. `pre-entrenos` → **Pre-entrenos** (30 productos)
- **¿Por qué alojamos `src/db.json` dentro del repositorio del Backend?**
  - Para garantizar que el script `npm run seed` sea **100% autónomo** y no dependa de carpetas externas, funcionando tanto en el entorno local como al clonar el repositorio desde GitHub o desplegarlo en un servidor en la nube.

### Paso 9.2: Script de Seed y Proceso ETL (`src/seed.js`)
- **Archivo creado:** `src/seed.js`
- **Comando de ejecución:** `npm run seed` (definido en `package.json` como `"node src/seed.js"`).
- **Desglose anatómico del proceso ETL (*Extract, Transform, Load*) y decisiones técnicas:**
  1. **Limpieza inicial (`deleteMany()`):**
     - Ejecutamos `Supplement.deleteMany()`, `Category.deleteMany()` y `User.deleteMany()` para vaciar las colecciones antes de insertar. Esto hace que el script sea **idempotente**: podés correr `npm run seed` 10 veces seguidas sin que tire error `11000` de emails o nombres de categoría duplicados.
  2. **¿Por qué usamos `User.create([...])` en vez de `User.insertMany([...])`? (Pregunta clásica de examen):**
     - `insertMany()` manda una inserción masiva directa al motor de MongoDB salteándose el middleware `.pre("save")` de Mongoose. Si usáramos `insertMany`, las contraseñas `"Password123"` se guardarían en texto plano sin hashear y el login fallaría siempre.
     - En cambio, `.create([...])` instancia cada documento y ejecuta internamente `.save()`, disparando nuestro hook `userSchema.pre("save")` para que `bcrypt.hash` encripte las contraseñas automáticamente.
  3. **Creación de las 6 categorías y diccionario `categoryMap`:**
     - Primero insertamos las 6 categorías en MongoDB con `Category.create([...])` y usamos **desestructuración de arrays** (`const [proteins, creatines, preworkouts, aminoacids, vitamins, bars] = ...`) para obtener sus `ObjectId` reales (`_id`).
     - Armamos el objeto diccionario `categoryMap` que traduce el identificador en texto del archivo JSON (ej: `"pre-entrenos"`, que va entre comillas por tener un guion medio) al `ObjectId` real de MongoDB (`preworkouts._id`).
  4. **Lectura asíncrona con `fs/promises` (*Extract*):**
     - `JSON.parse(await fs.readFile("./src/db.json", "utf-8"))` lee el archivo como texto UTF-8 y lo convierte en un objeto JavaScript en memoria.
  5. **Mapeo y sanitización de campos con `.map()` (*Transform*):**
     - Mapeamos cada elemento de `data.products` al esquema de nuestro modelo Mongoose `Supplement` (`name`, `description`, `price`, `stock`, `available`, `image`, `category`).
     - **Sanitización defensiva (`p.name.slice(0, 120)`):** Al inspeccionar los 271 registros, detectamos un suplemento cuyo nombre tenía **125 caracteres**, lo que provocaría un `ValidationError` frente a la regla `maxlength: 120` de nuestro Schema. Con `.slice(0, 120)` aseguramos que todos los documentos cumplan las restricciones antes de impactar en la base.
  6. **Inserción en MongoDB (*Load*) y cierre de conexión (`mongoose.disconnect()`):**
     - `await Supplement.create(supplements)` valida e inserta los 271 documentos relacionados con sus respectivas categorías.
     - Finalmente, `await mongoose.disconnect()` cierra el puente con MongoDB para que el proceso termine limpiamente y devuelva el control a la terminal.
- **🧠 Duda clave de arquitectura: ¿Es mejor práctica leer un `.json` aparte de forma asíncrona o pegar los 271 suplementos directo adentro de `seed.js`?**
  - **Respuesta profesional:** Mantener los datos en un archivo `.json` separado y leerlo de forma asíncrona desde `src/seed.js` es **100% la mejor práctica de la industria** (conocida como patrón de *Fixtures* o *Separación de Datos y Lógica*), por 4 motivos fundamentales:
    1. **Principio de Responsabilidad Única (SRP):** `src/seed.js` contiene únicamente **lógica de ejecución** (~50 líneas limpias y legibles), mientras que `src/db.json` almacena el **dataset estático** (más de 3.800 líneas). Pegar 3.800 líneas de objetos dentro de un archivo `.js` ensucia el código y oculta la lógica.
    2. **Evaluación académica (UTN):** Cuando el docente abre `src/seed.js`, puede evaluar en una sola pantalla cómo conectás a MongoDB, cómo hasheás usuarios, cómo relacionás `ObjectId` de categorías y cómo insertás documentos, sin tener que hacer scroll por miles de líneas.
    3. **Demostración técnica de Node.js (Proceso ETL):** Leer un archivo con el módulo nativo `fs/promises` (`fs.readFile`), parsearlo con `JSON.parse` y normalizar sus campos con `.map()` demuestra dominio real de un flujo **ETL (*Extract, Transform, Load*)** muy común en entornos de trabajo reales.
    4. **Mantenibilidad:** Si el día de mañana se actualiza el catálogo desde un sistema externo, basta con reemplazar el archivo `.json` sin tocar ni arriesgar el código JavaScript del script.

---

## 📄 FASE 10: Documentación con Swagger / OpenAPI 3.0

### Paso 10.1: Configuración de Swagger (`src/docs/swagger.js`)

- **Archivo creado:** `src/docs/swagger.js`
- **Desglose anatómico línea por línea:**
  1. **`openapi: "3.0.0"`**: Declara que usamos la versión 3.0.0 del estándar internacional **OpenAPI** para documentar APIs REST.
  2. **`info: { title, version, description }`**: Define el encabezado visual que aparece arriba del todo cuando abrís la página de documentación.
  3. **`servers: [{ url: API_URL }]`**: Configura la URL base (`http://localhost:3000`) hacia donde Swagger enviará las peticiones cuando apretemos el botón _"Try it out"_.
  4. **`components.securitySchemes.bearerAuth`**:
     - Habilita el famoso botón verde **"Authorize 🔒"** arriba a la derecha en la interfaz de Swagger.
     - Al indicarle `type: "http"`, `scheme: "bearer"` y `bearerFormat: "JWT"`, nos permite pegar nuestro token de Admin una sola vez y que Swagger lo inyecte automáticamente como `Authorization: Bearer <token>` en todas las rutas privadas.
  5. **`apis: ["./src/routes/*.js"]`**: Usa el comodín `*.js` para indicarle a `swagger-jsdoc` que escanee todos los archivos dentro de `src/routes/` buscando comentarios con la etiqueta `@swagger`.
  6. **`export const specs = swaggerJSDoc(options)`**: Compila toda esa configuración junto con los comentarios de las rutas y exporta el objeto `specs` listo para montar en `app.js`.

### Paso 10.2: Montaje de Swagger UI en `src/app.js`

- **Archivo editado:** `src/app.js`
- **Líneas agregadas:**
  ```js
  import swaggerUi from "swagger-ui-express";
  import { specs } from "./docs/swagger.js";
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  ```
- **Desglose técnico:**
  - **`swaggerUi.serve`**: Middleware que sirve los archivos estáticos (HTML, CSS y JS) propios de la interfaz visual de Swagger.
  - **`swaggerUi.setup(specs)`**: Inicializa esa interfaz inyectándole nuestras especificaciones (`specs` exportadas desde `src/docs/swagger.js`).
  - **Ubicación estratégica en `app.js`**: Debe colocarse **siempre antes** del middleware `404 ("Esa ruta no existe")`. Si se pusiera debajo del 404, Express cortaría la petición antes de llegar a `/api-docs`.
  - La documentación interactiva queda disponible en `http://localhost:3000/api-docs`.

### Paso 10.3: Anotaciones JSDoc (`@swagger`) en las Rutas

- **Archivos editados:** `src/routes/userRoutes.js`, `src/routes/categoryRoutes.js` y `src/routes/supplementRoutes.js`.
- **Conceptos clave de OpenAPI 3.0 utilizados en los comentarios `@swagger`:**
  1. **`tags: [Users | Categories | Supplements]`**: Agrupa visualmente los endpoints en secciones desplegables dentro de Swagger UI.
  2. **`security: [{ bearerAuth: [] }]`**: Se coloca únicamente en las rutas protegidas (`post`, `patch`, `put`, `delete`). Dibuja el candado en el endpoint e inyecta automáticamente el header `Authorization: Bearer <token>` cargado en el botón verde _Authorize_.
  3. **Parámetros `in: path` vs `in: query`:**
     - `in: path`: Parámetros obligatorios que forman parte de la URL, como `/{id}` (en OpenAPI se escriben con llaves `{id}` en lugar de dos puntos `:id`).
     - `in: query`: Filtros opcionales que viajan después del signo `?` en `GET /api/supplements` (`name`, `category`, `minPrice`, `maxPrice`).
  4. **Subida de archivos binarios (`multipart/form-data` + `format: binary`):**
     - En `PUT /api/supplements/{id}/image`, reemplazamos `application/json` por `multipart/form-data` y definimos la propiedad `image: { type: string, format: binary }`. Esto hace que Swagger UI dibuje un botón real de **"Seleccionar archivo"** para subir una foto desde el navegador.

---

## 🧪 FASE 11: Testing Automatizado de Integración (Jest + Supertest)

### Paso 11.1: Instalación de Dependencias de Desarrollo y Configuración ESM en `package.json`
- **Comando ejecutado:** `npm install -D jest supertest`
- **¿Por qué usamos la bandera `-D` (`devDependencies`)?**
  - Porque `jest` (el corredor de pruebas y aserciones) y `supertest` (el simulador de peticiones HTTP sobre Express) solo se utilizan durante el desarrollo y la verificación de calidad. Cuando el servidor se despliega en producción, no hace falta instalar estas librerías.
- **Script configurado en `package.json`:**
  ```json
  "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand"
  ```
  - **¿Qué hace `--experimental-vm-modules`?** Habilita en Node.js el soporte nativo para **ES Modules (`"type": "module"`)** dentro de Jest, permitiéndonos usar `import` y `export` en nuestros archivos `.test.js` sin necesidad de transpiradores como Babel.
  - **¿Qué hace `--runInBand`?** Le ordena a Jest ejecutar las pruebas **en serie (una detrás de otra)** en lugar de en paralelo. Esto es fundamental cuando testeamos contra una base de datos MongoDB real, para que dos pruebas simultáneas no se pisen ni borren colecciones al mismo tiempo.

### Paso 11.2: Suite de Pruebas de Integración (`tests/api.test.js`)
- **Archivo creado:** `tests/api.test.js`
- **Anatomía del archivo de pruebas:**
  1. **Base de datos aislada (`suplementos_gochi_test`):**
     - En `beforeAll`, nos conectamos a `mongodb://localhost:27017/suplementos_gochi_test` y limpiamos las colecciones con `.deleteMany()`. Así nunca tocamos ni borramos los datos de la base de desarrollo `suplementos_gochi`.
  2. **Preparación de tokens (`adminToken` y `clientToken`):**
     - Siempre dentro de `beforeAll`, creamos un usuario `"admin"` y uno `"client"` y los logueamos con `request(app).post("/api/users/login")` para capturar sus tokens JWT reales.
  3. **Los 6 casos de prueba verificados con `expect(...).toBe(...)`:**
     - **Test 1 (`200 OK`):** Comprueba que el Health Check (`GET /`) responda correctamente.
     - **Test 2 (`401 Unauthorized`):** Comprueba que `verifyToken` rechace peticiones sin header `Authorization`.
     - **Test 3 (`403 Forbidden`):** Comprueba que `allowRoles("admin")` rechace a un usuario con rol `"client"` usando `.set("Authorization", "Bearer " + clientToken)`.
     - **Test 4 (`201 Created`):** Comprueba que el `"admin"` pueda crear una categoría y guarda su `_id` en `categoryId`.
     - **Test 5 (`201 Created` + `200 OK`):** Comprueba que el `"admin"` pueda crear un suplemento asociado a `categoryId` y que el listado público `GET /api/supplements` devuelva un array con 1 elemento.
     - **Test 6 (`400 Bad Request`):** Comprueba que enviar un ID mal formado (`/api/supplements/id-invalido`) sea atrapado por `errorHandler.js` (`CastError`).
  4. **Cierre limpio (`afterAll`):**
     - Ejecuta `await mongoose.disconnect()` para cerrar la conexión con MongoDB al finalizar la suite.

---

## 🔗 FASE 12: Contrato de Integración de la API con un Cliente HTTP

### Paso 12.1: Cómo un Cliente Web / Frontend consume nuestro Backend
- **Habilitación de CORS (`app.use(cors())` en `src/app.js`):**
  - Permite que clientes web que corren en otros orígenes/puertos (ej: `http://localhost:5173` en desarrollo o un dominio en Vercel en producción) puedan consumir nuestra API en `http://localhost:3000/api` sin ser bloqueados por la política *Same-Origin* del navegador.
- **Contrato de Autenticación y Autorización Stateless (JWT):**
  1. El cliente envía credenciales por `POST /api/users/login` (`Content-Type: application/json`) y el Backend responde con `{ token, user }`.
  2. Para consumir cualquier endpoint protegido de administración (`POST`, `PATCH`, `PUT`, `DELETE` en `/api/supplements` o `/api/categories`), el cliente debe incluir la cabecera estándar:
     `Authorization: Bearer <token>`
  3. Nuestros middlewares `verifyToken` y `allowRoles("admin")` validan la firma criptográfica, la vigencia del token y el rol antes de ejecutar el controlador.
- **Contrato de Subida de Archivos (`PUT /api/supplements/:id/image`):**
  - A diferencia del resto de los endpoints que reciben JSON (`application/json`), este endpoint recibe un cuerpo `multipart/form-data` (construido con un objeto `FormData` en el cliente) cuyo campo de archivo debe llamarse exactamente `"image"`.
- **🧠 Duda clave de arquitectura: ¿Cómo conviven en el Backend las imágenes del catálogo inicial (`src/db.json`) con Supabase Storage?**
  - **En el modelo `Supplement` de MongoDB, el campo `image` almacena siempre una URL pública (`String`):**
    1. **Imágenes de catálogo externo (`src/db.json`):** Los 271 suplementos iniciales guardan directamente su URL pública de CDN externo (`https://acdn-us.mitiendanube.com/...`), lo que permite servir el catálogo inicial sin consumir cuota de almacenamiento en nuestro bucket.
    2. **Imágenes subidas a través de nuestro Backend (`PUT /api/supplements/:id/image`):** Cuando se envía un archivo físico `.jpg`, `.png` o `.webp` a este endpoint, Multer (`uploadImage.js`) lo recibe en memoria RAM (`req.file.buffer`) y `storageService.js` lo sube al bucket público `uploads` de **Supabase Storage** (cuando `STORAGE=supabase`), actualizando el campo `image` en MongoDB con la URL pública generada por Supabase (`https://<proyecto>.supabase.co/storage/v1/object/public/uploads/...`).

---

## 🐙 FASE 13: Portada `README.md`, Estructura Monorepo y Control de Versiones con Git / GitHub

### Paso 13.1: Creación de la Portada del Repositorio (`README.md`) y Estructura Monorepo
- **Archivos creados:** `README.md` (en el Backend y en la raíz del Monorepo `suplementos-gochi/`) y `.gitignore` raíz.
- **🧠 Duda clave de arquitectura: ¿Cómo se organiza un *Monorepo* frente a repositorios separados (*Multi-repo*)?**
  - Un **Monorepo** aloja en un único repositorio de GitHub (`suplementos-gochi`) tanto el Backend (`suplementos-gochi-backend/`) como el Frontend (`suplementos-gochi-frontend/`).
  - **Regla técnica crítica de Git en un Monorepo:** Las subcarpetas (`suplementos-gochi-backend` y `suplementos-gochi-frontend`) **no deben tener carpetas `.git` ocultas propias en su interior**; debe existir **un único `.git` en la carpeta raíz `suplementos-gochi/`**. Si quedara un `.git` dentro de una subcarpeta, Git la interpretaría como un *submódulo* desconectado y en GitHub aparecería como una carpeta bloqueada (con ícono de flecha gris) sin subir su código fuente.

### Paso 13.2: Inicialización de Git en la Raíz del Monorepo y Subida a GitHub
- **Comandos ejecutados desde `suplementos-gochi/` y su significado técnico:**
  1. **`git init`**: Inicializa el repositorio local en la carpeta padre `suplementos-gochi/` creando la única carpeta oculta `.git`.
  2. **`git add .`**: Pasa todos los archivos de ambas carpetas (`suplementos-gochi-backend` y `suplementos-gochi-frontend`) al área de preparación (*Staging Area*), respetando las exclusiones de `.gitignore` (por lo que `node_modules`, `.env`, `uploads` y `dist` quedan protegidos y no se suben).
  3. **`git commit -m "feat: monorepo full stack Suplementos Gochi (backend + frontend)"`**: Toma una "foto" inmutable del estado actual del proyecto siguiendo el estándar *Conventional Commits*.
  4. **`git branch -M main`**: Renombra la rama principal a `main` (el estándar moderno de GitHub).
     - **🧠 Duda clave de desarrollo: ¿Qué son `main` y `master` y qué diferencia hay entre ellas?**
       - **¿Qué es una rama (*branch*)?** Es una "línea de tiempo" donde se guardan tus commits. Todo proyecto tiene una rama troncal o principal donde vive la versión oficial del código que va a producción.
       - **¿Hay alguna diferencia técnica entre `master` y `main`?** **Ninguna.** Ambas funcionan exactamente igual; es simplemente el nombre de etiqueta que lleva la rama principal.
       - **¿Por qué existen los dos nombres?** Históricamente (desde que Linus Torvalds creó Git en 2005 hasta 2020), el comando `git init` llamaba por defecto `master` a la rama inicial. A partir de **2020**, GitHub, GitLab, Vercel y toda la industria del software adoptaron **`main`** (*"principal"*) como el nuevo estándar universal.
       - **¿Por qué ejecutamos `git branch -M main`?** Porque muchas versiones de Git instaladas en Windows siguen creando la rama local con el nombre antiguo `master` al hacer `git init`. Si subieras `master` cuando GitHub y las plataformas de deploy (como Vercel o Render) esperan `main`, podrías terminar con dos ramas distintas (`master` y `main`) desincronizadas. La bandera `-M` (*move/rename forzado*) le cambia el nombre a `main` en un instante para mantener todo unificado.
  5. **`git remote add origin <URL_DEL_REPO>`**: Conecta el repositorio local de tu computadora con el repositorio remoto vacío creado en GitHub.
  6. **`git push -u origin main`**: Sube los commits a la nube de GitHub y deja vinculada (`-u` / `--set-upstream`) la rama local `main` con `origin/main` para que los próximos envíos solo requieran escribir `git push`.

---

_(Esta bitácora se irá actualizando paso a paso a lo largo de todo el desarrollo)._
