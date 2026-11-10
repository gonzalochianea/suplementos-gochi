# 🏋️‍♂️ Suplementos Gochi — E-Commerce Full Stack & API RESTful

**Trabajo Práctico Integrador Final — Curso de Backend Developer (Centro de e-Learning UTN BA)**  
**Autor:** Gonzalo Chianea

API RESTful robusta y modular desarrollada con **Node.js, Express 5 y MongoDB (Mongoose)** aplicando arquitectura en capas con **Capa de Servicios**, relaciones con `.populate()`, autenticación **JWT**, encriptación con **bcrypt**, subida de imágenes con **Multer + Supabase Storage**, documentación **Swagger UI (`/api-docs`)** y tests automatizados con **Jest + Supertest**, integrada en un Monorepo junto a su cliente web SPA en **React 19 + Vite**.

---

## 🌐 Enlaces de Producción (Deploy en Vivo)

| Recurso | Plataforma | URL en Producción |
| :--- | :--- | :--- |
| **🛒 Tienda Online (Frontend SPA)** | **Vercel** | [https://suplementos-gochi.vercel.app/](https://suplementos-gochi.vercel.app/) |
| **⚙️ API RESTful (Backend)** | **Render** | [https://suplementos-gochi-backend.onrender.com/](https://suplementos-gochi-backend.onrender.com/) |
| **📄 Documentación Interactiva Swagger UI** | **Render** | [https://suplementos-gochi-backend.onrender.com/api-docs](https://suplementos-gochi-backend.onrender.com/api-docs) |
| **🗄️ Base de Datos y Storage Cloud** | **Atlas + Supabase** | MongoDB Atlas (`suplementos_gochi`) + Supabase Storage (`uploads`) |

---

## 📂 Estructura del Monorepo

```text
suplementos-gochi/
├── suplementos-gochi-backend/    # API RESTful (Node.js, Express 5, MongoDB/Mongoose, JWT, Multer, Supabase, Swagger, Jest)
│   ├── src/
│   │   ├── config/               # Cliente de Supabase Storage
│   │   ├── controllers/          # Controladores HTTP livianos (Product/Supplement, Category, User)
│   │   ├── docs/                 # Configuración OpenAPI 3.0 / Swagger UI
│   │   ├── middleware/           # verifyToken (JWT), allowRoles, uploadImage (Multer), errorHandler
│   │   ├── models/               # Schemas de Mongoose (Supplement, Category, User con pre-save bcrypt)
│   │   ├── routes/               # Enrutadores de Express (/api/supplements, /api/categories, /api/users)
│   │   ├── services/             # Capa de Servicios (Lógica de negocio, populate, filtros y Storage Strategy)
│   │   ├── utils/                # Configuración de variables de entorno (dotenv) y clase AppError
│   │   ├── app.js                # Configuración de Express, CORS, JSON, rutas y manejo de errores
│   │   ├── db.js                 # Conexión asíncrona a MongoDB con Mongoose
│   │   ├── index.js              # Punto de entrada del servidor
│   │   └── seed.js               # Script de población inicial (6 categorías, 271 suplementos y 2 usuarios)
│   ├── tests/                    # Pruebas de integración con Jest y Supertest
│   ├── .env.example              # Plantilla de variables de entorno con placeholders
│   ├── BITACORA_DESARROLLO.md    # Bitácora técnica paso a paso del Backend
│   └── README.md                 # Documentación detallada del Backend
└── suplementos-gochi-frontend/   # Cliente Web SPA (React 19, Vite, React Router v7, Context API, SweetAlert2)
    ├── BITACORA_DESARROLLO.md    # Bitácora técnica paso a paso del Frontend
    └── README.md                 # Documentación detallada del Frontend
```

---

## 🛠️ 1. Listado de Tecnologías Utilizadas

### Backend (`suplementos-gochi-backend`)
- **Entorno de Ejecución:** Node.js (ES Modules `"type": "module"`)
- **Framework Web:** Express 5 (`^5.3.0`)
- **Base de Datos y ODM:** MongoDB Atlas + Mongoose 9 (`^9.11.4`)
- **Seguridad y Configuración:**
  - `bcrypt`: Encriptación de contraseñas mediante *pre-save hook* de Mongoose.
  - `jsonwebtoken` (JWT): Emisión de tokens en login y protección de rutas sensibles (`verifyToken` + `allowRoles`).
  - `dotenv`: Gestión de variables de entorno sensibles (`MONGO_URI`, `JWT_SECRET`, credenciales de Supabase).
  - `cors`: Habilitación de peticiones de origen cruzado en `app.js`.
- **Almacenamiento de Imágenes:** `multer` + `@supabase/supabase-js` (Patrón *Strategy*: disco local o Supabase Storage).
- **Documentación y Testing:** `swagger-ui-express`, `swagger-jsdoc`, `jest` y `supertest`.

### Frontend (`suplementos-gochi-frontend`)
- **React 19 + Vite 8 + React Router DOM v7**
- **Context API (`AuthContext` con JWT)**, **Custom Hooks**, **SweetAlert2** y **CSS3 Modular**.

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
| `password` | `String` | **Obligatorio**, mínimo 8 caracteres y al menos 1 letra mayúscula. Se almacena hasheada con `bcrypt` (10 rondas de *salt* mediante `pre("save")`). |
| `role` | `String` | Enumerado: `"admin"` o `"client"` (por defecto `"client"`). |
| `createdAt` / `updatedAt` | `Date` | Generados automáticamente (`timestamps: true`). |

---

## ⚙️ 3. Instrucciones de Instalación y Ejecución

### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/gonzalochianea/suplementos-gochi.git
cd suplementos-gochi
```

### Paso 2: Configurar y ejecutar el Backend (`suplementos-gochi-backend`)
```bash
cd suplementos-gochi-backend
npm install
cp .env.example .env
```
Configurar las variables en `.env` (ver `.env.example`):
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
Poblar la base de datos e iniciar el servidor:
```bash
# Carga 2 usuarios de prueba, 6 categorías y 271 suplementos
npm run seed

# Inicia el servidor en http://localhost:3000 (Swagger UI en http://localhost:3000/api-docs)
npm start

# Ejecuta los tests de integración con Jest y Supertest
npm test
```

### Paso 3: Configurar y ejecutar el Frontend (`suplementos-gochi-frontend`)
En otra terminal:
```bash
cd suplementos-gochi-frontend
npm install
cp .env.example .env
npm run dev
```
- **Admin de prueba:** `admin@gochi.com` | Contraseña: `Password123`
- **Cliente de prueba:** `cliente@gochi.com` | Contraseña: `Password123`

---

## 🔗 4. Listado Completo de Endpoints Disponibles (CRUD y Login)

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

## 📦 5. Ejemplos de Datos Mock (JSON) para Todas las Solicitudes

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
> Header requerido: `Authorization: Bearer <TOKEN_JWT_ADMIN>`
```json
{
  "name": "Creatinas",
  "description": "Creatinas monohidratadas y micronizadas de alta pureza"
}
```

### 4. Crear Suplemento (`POST /api/supplements`)
> Header requerido: `Authorization: Bearer <TOKEN_JWT_ADMIN>`
```json
{
  "name": "Creatina Micronizada 300g Star Nutrition",
  "description": "100% pura creatina monohidrato ultramicronizada para fuerza y potencia muscular.",
  "price": 32500,
  "stock": 25,
  "available": true,
  "category": "6af3328299a1506ca3aa7c2e"
}
```

### 5. Actualizar Suplemento (`PATCH /api/supplements/:id`)
> Header requerido: `Authorization: Bearer <TOKEN_JWT_ADMIN>`
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
- [x] CRUD completo de Suplementos (Productos) y Categorías con integridad referencial.
- [x] Relaciones en MongoDB resueltas mediante `.populate("category", "name description")`.
- [x] Filtros dinámicos combinables por nombre (`$regex`), categoría, disponibilidad, rango de precios (`$gte`, `$lte`) y ordenamiento.
- [x] Registro e inicio de sesión con hasheo `bcrypt` (`pre("save")`) y protección de rutas mediante `verifyToken` (JWT) y `allowRoles("admin")`.
- [x] Subida de imágenes `multipart/form-data` con Multer y soporte dual Local / Supabase Storage (Patrón Strategy).
- [x] Manejo centralizado de errores (`errorHandler.js` + clase `AppError`).
- [x] Documentación interactiva en `/api-docs` (Swagger) y suite de tests con Jest + Supertest.
- [x] Cliente Web SPA completo en React 19 desplegado en Vercel y conectado al Backend en Render.

### Funcionalidades a Futuro (Roadmap)
- [ ] Pasarela de pagos online integrada con **Mercado Pago Checkout Pro** (actualmente el checkout genera el pedido estructurado directo hacia WhatsApp).
- [ ] Persistencia de órdenes de compra (`Order` model) en MongoDB con historial de pedidos por cliente y descuento automático de stock al confirmar pago.
- [ ] Recuperación de contraseña por correo electrónico mediante *Nodemailer* y tokens temporales.
- [ ] Paginación en el servidor (`page` y `limit`) para catálogos que superen los 1.000 productos.
