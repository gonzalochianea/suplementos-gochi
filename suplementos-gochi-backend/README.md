# 🏋️‍♂️ Suplementos Gochi - Backend API REST
Trabajo Práctico Final — Diplomatura / Cátedra Backend Developer (UTN)

## 🚀 Stack Tecnológico
- Node.js + Express 5 (ES Modules, arquitectura en capas: Routes, Controllers, Services, Models)
- MongoDB + Mongoose 9 (Validaciones, referencias relacionales y populate)
- Seguridad: Autenticación JWT (jsonwebtoken), hashing con bcrypt y control de roles (`admin` / `client`)
- Almacenamiento de imágenes: Multer + Patrón Strategy (`local` o `supabase` Storage)
- Documentación y Testing: OpenAPI 3.0 (Swagger UI) + Jest y Supertest

## ⚙️ Instalación y Uso
1. Instalar dependencias: `npm install`
2. Copiar `.env.example` a `.env` y completar las variables de entorno.
3. Poblar la base de datos inicial (6 categorías y 271 suplementos): `npm run seed`
4. Iniciar servidor en desarrollo: `npm start`
5. Ejecutar suite de tests automatizados: `npm test`

## 📄 Documentación Interactiva (Swagger)
Con el servidor encendido, ingresar a: http://localhost:3000/api-docs

## 🔗 Endpoints Principales
- **Users:** `POST /api/users/register`, `POST /api/users/login`
- **Categories:** `GET /api/categories`, `GET /api/categories/:id`, `POST /api/categories`, `PATCH /api/categories/:id`, `DELETE /api/categories/:id`
- **Supplements:** `GET /api/supplements`, `GET /api/supplements/:id`, `POST /api/supplements`, `PATCH /api/supplements/:id`, `DELETE /api/supplements/:id`, `PUT /api/supplements/:id/image`

## 🔐 Credenciales de Prueba (generadas por el Seed)
- Admin: `admin@gochi.com` | Password: `Password123`
- Cliente: `cliente@gochi.com` | Password: `Password123`
