# 🏋️‍♂️ Suplementos Gochi — E-Commerce Full Stack (Monorepo)

Trabajo Práctico Final Integrador — **UTN (Universidad Tecnológica Nacional)**  
**Autor:** Gonzalo Chianea

---

## 📂 Estructura del Monorepo

Este repositorio unifica el ecosistema completo de la tienda online **Suplementos Gochi**:

```text
suplementos-gochi/
├── suplementos-gochi-backend/    # API RESTful (Node.js, Express 5, MongoDB/Mongoose, JWT, Multer, Supabase, Swagger, Jest)
├── suplementos-gochi-frontend/   # Cliente Web SPA (React 19, Vite, React Router 7, Context API, SweetAlert2)
├── .gitignore                    # Reglas globales de exclusión de Git (node_modules, .env, uploads, dist)
└── README.md                     # Portada general del proyecto Full Stack
```

---

## 🚀 Stack Tecnológico

### 🛠️ Backend (`suplementos-gochi-backend`)
- **Entorno y Framework:** Node.js + Express 5 (ES Modules, arquitectura en capas: `routes`, `controllers`, `services`, `models`, `middleware`)
- **Base de Datos:** MongoDB + Mongoose 9 (Validaciones de esquema, integridad referencial y `.populate()`)
- **Seguridad y Autenticación:** JSON Web Tokens (`jsonwebtoken`), hasheo criptográfico con `bcrypt` y autorización por roles (`admin` / `client`)
- **Almacenamiento Multimedia:** `multer` + Patrón *Strategy* (`local` o **Supabase Storage** en la nube)
- **Documentación y Testing:** OpenAPI 3.0 (**Swagger UI** en `/api-docs`) + **Jest** y **Supertest**

### ⚡ Frontend (`suplementos-gochi-frontend`)
- **Librería y Bundler:** React 19 + Vite
- **Ruteo y Estado:** React Router DOM v7 + `AuthContext` con persistencia JWT
- **Funcionalidades:** Catálogo con filtros por categoría, buscador en tiempo real, ordenamiento dinámico, carrito de compras con cierre de pedido directo por WhatsApp y Panel de Administración completo (ABM de Categorías y Suplementos con subida de imágenes a Supabase).

---

## ⚙️ Instalación y Puesta en Marcha Local

### 1️⃣ Levantar el Backend (Puerto `3000`)
```bash
cd suplementos-gochi-backend
npm install
# Copiar .env.example a .env y configurar credenciales
npm run seed   # Carga los usuarios de prueba, las 6 categorías y los 271 suplementos en MongoDB
npm start      # Inicia el servidor en http://localhost:3000 (Swagger en http://localhost:3000/api-docs)
```

### 2️⃣ Levantar el Frontend (Puerto `5173`)
En una segunda terminal:
```bash
cd suplementos-gochi-frontend
npm install
# Verificar que .env contenga VITE_API_URL=http://localhost:3000/api/
npm run dev    # Inicia la aplicación React en http://localhost:5173
```

---

## 🔐 Credenciales de Prueba (Generadas por `npm run seed`)
- **Administrador:** `admin@gochi.com` | Contraseña: `Password123`
- **Cliente:** `cliente@gochi.com` | Contraseña: `Password123`

