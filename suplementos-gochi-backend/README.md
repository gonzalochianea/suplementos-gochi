# 🏋️‍♂️ Suplementos Gochi — Backend API RESTful

**Trabajo Práctico Final — Curso de Backend Developer (Centro de e-Learning UTN BA)**  
**Autor:** Gonzalo Chianea

API RESTful robusta y modular para la gestión integral del e-commerce de nutrición deportiva **Suplementos Gochi**. Implementa operaciones CRUD completas, arquitectura en capas con **Capa de Servicios**, relaciones entre colecciones con `populate`, autenticación **JWT**, encriptación con **bcrypt**, subida de imágenes con **Multer + Supabase Storage**, documentación interactiva **Swagger (OpenAPI 3.0)** y pruebas de integración automatizadas con **Jest + Supertest**.

---

## 🛠️ 1. Listado de Tecnologías Utilizadas

- **Entorno de Ejecución:** Node.js (ES Modules `"type": "module"`)
- **Framework Web:** Express 5 (`^5.3.0`)
- **Base de Datos y ODM:** MongoDB + Mongoose 9 (`^9.11.4`)
- **Seguridad y Autenticación:**
  - `bcrypt`: Encriptación de contraseñas mediante *pre-save hook* de Mongoose.
  - `jsonwebtoken` (JWT): Emisión y verificación de tokens firmados con control de roles (`admin` / `client`).
  - `cors`: Habilitación de peticiones de origen cruzado para el Frontend en React.
  - `dotenv`: Gestión segura de variables de entorno.
- **Almacenamiento de Archivos:** `multer` + `@supabase/supabase-js` (Patrón *Strategy*: disco local o nube en Supabase Storage).
- **Documentación y Testing:** `swagger-ui-express`, `swagger-jsdoc`, `jest` y `supertest`.

---

## 🗄️ 2. Esquema de la Base de Datos (Estructura de las Colecciones)

La base de datos MongoDB (`suplementos_gochi`) está compuesta por **3 colecciones** relacionadas:

### A. Colección `categories` (Modelo `Category`)
| Campo | Tipo | Reglas y Validaciones |
| :--- | :--- | :--- |
| `_id` | `ObjectId` | Identificador único autogenerado por MongoDB. |
| `name` | `String` | **Obligatorio**, único (`unique`), `trim`, entre 3 y 60 caracteres. |
| `description` | `String` | Opcional, `trim`, máximo 200 caracteres (por defecto `""`). |
| `createdAt` / `updatedAt` | `Date` | Generados automáticamente (`timestamps: true`). |

### B. Colección `supplements` (Modelo `Supplement` — Entidad Productos)
| Campo | Tipo | Reglas y Validaciones |
| :--- | :--- | :--- |
| `_id` | `ObjectId` | Identificador único autogenerado por MongoDB. |
| `name` | `String` | **Obligatorio**, `trim`, entre 2 y 120 caracteres. |
| `description` | `String` | Opcional, `trim`, máximo 500 caracteres. |
| `price` | `Number` | **Obligatorio**, mínimo `0` (no admite valores negativos). |
| `stock` | `Number` | **Obligatorio**, entero (`Number.isInteger`), mínimo `0`. |
| `available` | `Boolean` | Por defecto `true`. |
| `category` | `ObjectId` | **Obligatorio**, referencia relacional (`ref: "Category"`), resuelta con `.populate("category", "name description")`. |
| `image` | `String` | URL de la imagen del suplemento (local o Supabase Storage), por defecto `null`. |
| `createdAt` / `updatedAt` | `Date` | Generados automáticamente (`timestamps: true`). |

### C. Colección `users` (Modelo `User`)
| Campo | Tipo | Reglas y Validaciones |
| :--- | :--- | :--- |
| `_id` | `ObjectId` | Identificador único autogenerado por MongoDB. |
| `name` | `String` | **Obligatorio**, `trim`, entre 2 y 60 caracteres. |
| `email` | `String` | **Obligatorio**, único (`unique`), `lowercase`, validación por expresión regular de email. |
| `password` | `String` | **Obligatorio**, mínimo 8 caracteres y al menos 1 letra mayúscula. Se almacena hasheada con `bcrypt` (10 rondas de *salt*). |
| `role` | `String` | Enumerado: `"admin"` o `"client"` (por defecto `"client"`). |
| `createdAt` / `updatedAt` | `Date` | Generados automáticamente (`timestamps: true`). |

---

## ⚙️ 3. Instrucciones de Instalación y Ejecución

### Paso 1: Clonar el repositorio e ingresar al Backend
```bash
git clone https://github.com/gonzalochianea/suplementos-gochi.git
cd suplementos-gochi/suplementos-gochi-backend
```

### Paso 2: Instalar las dependencias
```bash
npm install
```

### Paso 3: Configurar las Variables de Entorno (`.env`)
Copiar el archivo de ejemplo `.env.example` a `.env`:
```bash
cp .env.example .env
```
Contenido de `.env.example`:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/suplementos_gochi
JWT_SECRET=tu_clave_secreta_jwt
JWT_EXPIRES_IN=2h
STORAGE=local
IMAGES_FOLDER=uploads
API_URL=http://localhost:3000
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-anon-key-de-supabase
```

### Paso 4: Poblar la Base de Datos Inicial (Seed)
Carga automáticamente 2 usuarios de prueba, 6 categorías y 271 suplementos reales:
```bash
npm run seed
```
- **Admin de prueba:** `admin@gochi.com` | Contraseña: `Password123`
- **Cliente de prueba:** `cliente@gochi.com` | Contraseña: `Password123`

### Paso 5: Ejecutar el Servidor y los Tests
```bash
# Iniciar el servidor en modo desarrollo (http://localhost:3000)
npm start

# Ejecutar pruebas automatizadas de integración (Jest + Supertest)
npm test
```

### Documentación Interactiva (Swagger UI)
Con el servidor encendido, abrir en el navegador: **`http://localhost:3000/api-docs`**

---

## 🔗 4. Listado Completo de Endpoints Disponibles

### Autenticación y Usuarios (`/api/users`)
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/register` | Público | Registra un nuevo usuario (hashea contraseña con `bcrypt`). |
| `POST` | `/api/users/login` | Público | Valida credenciales y retorna el token **JWT** + datos del usuario. |

### Categorías (`/api/categories`)
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Público | Lista todas las categorías ordenadas alfabéticamente. |
| `GET` | `/api/categories/:id` | Público | Obtiene el detalle de una categoría por su ID. |
| `POST` | `/api/categories` | 🔒 Admin (JWT) | Crea una nueva categoría. |
| `PATCH` / `PUT` | `/api/categories/:id` | 🔒 Admin (JWT) | Actualiza el nombre o descripción de una categoría. |
| `DELETE` | `/api/categories/:id` | 🔒 Admin (JWT) | Elimina una categoría (verifica antes que no tenga suplementos asociados). |

### Suplementos / Productos (`/api/supplements`)
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/supplements` | Público | Lista suplementos con `.populate("category")`. Soporta filtros por query: `?name=`, `?category=`, `?available=`, `?minPrice=`, `?maxPrice=`, `?sort=asc\|desc`. |
| `GET` | `/api/supplements/:id` | Público | Obtiene un suplemento por su ID con los datos completos de su categoría. |
| `POST` | `/api/supplements` | 🔒 Admin (JWT) | Crea un nuevo suplemento validando previamente que la categoría exista. |
| `PATCH` / `PUT` | `/api/supplements/:id` | 🔒 Admin (JWT) | Actualiza cualquier campo de un suplemento existente. |
| `DELETE` | `/api/supplements/:id` | 🔒 Admin (JWT) | Elimina un suplemento y limpia su imagen asociada. |
| `PUT` | `/api/supplements/:id/image` | 🔒 Admin (JWT) | Sube o reemplaza la imagen física del suplemento (`multipart/form-data`, campo `image`). |

---

## 📦 5. Ejemplos de Datos Mock (JSON) para las Solicitudes

### 1. Registro de Usuario (`POST /api/users/register`)
```json
{
  "name": "Gonzalo Chianea",
  "email": "gonzalo@gochi.com",
  "password": "Password123",
  "role": "client"
}
```

### 2. Inicio de Sesión (`POST /api/users/login`)
```json
{
  "email": "admin@gochi.com",
  "password": "Password123"
}
```

### 3. Crear Categoría (`POST /api/categories`)
> Requiere Header: `Authorization: Bearer <TOKEN_JWT_ADMIN>`
```json
{
  "name": "Creatinas",
  "description": "Creatinas monohidratadas y micronizadas de alta pureza"
}
```

### 4. Crear Suplemento (`POST /api/supplements`)
> Requiere Header: `Authorization: Bearer <TOKEN_JWT_ADMIN>`
```json
{
  "name": "Creatina Micronizada 300g Star Nutrition",
  "description": "100% pura creatina monohidrato ultramicronizada para fuerza y potencia muscular.",
  "price": 32500,
  "stock": 25,
  "available": true,
  "category": "672a8f4e9c1b2a3d4e5f6a7b"
}
```

### 5. Actualizar Precio o Stock de un Suplemento (`PATCH /api/supplements/:id`)
> Requiere Header: `Authorization: Bearer <TOKEN_JWT_ADMIN>`
```json
{
  "price": 34900,
  "stock": 40
}
```

---

## ✅ 6. Funcionalidades Implementadas y Funcionalidades a Futuro

### Funcionalidades Implementadas
- [x] Arquitectura modular en capas estrictas (`routes`, `controllers`, `services`, `models`, `middleware`).
- [x] CRUD completo de Suplementos y Categorías con integridad referencial (impide borrar categorías con suplementos activos).
- [x] Relaciones en MongoDB resueltas mediante `.populate("category", "name description")`.
- [x] Filtros dinámicos combinables por nombre (`$regex`), categoría, disponibilidad, rango de precios (`$gte`, `$lte`) y ordenamiento.
- [x] Registro e inicio de sesión con hasheo `bcrypt` (`pre("save")`) y protección de rutas mediante `verifyToken` (JWT) y `allowRoles("admin")`.
- [x] Subida de imágenes `multipart/form-data` con Multer y soporte dual Local / Supabase Storage (Patrón Strategy).
- [x] Manejo centralizado de errores (`errorHandler.js` + clase `AppError`).
- [x] Documentación interactiva en `/api-docs` (Swagger) y suite de tests con Jest + Supertest.
- [x] Integración completa con Frontend React (`suplementos-gochi-frontend`) dentro del mismo Monorepo.

### Funcionalidades a Futuro (Roadmap)
- [ ] Pasarela de pagos online integrada con **Mercado Pago Checkout Pro** (actualmente el checkout genera el pedido estructurado directo hacia WhatsApp).
- [ ] Persistencia de órdenes de compra (`Order` model) en MongoDB con historial de pedidos por cliente y descuento automático de stock al confirmar pago.
- [ ] Recuperación de contraseña por correo electrónico mediante *Nodemailer* y tokens temporales.
- [ ] Paginación en el servidor (`page` y `limit`) para catálogos que superen los 1.000 productos.
