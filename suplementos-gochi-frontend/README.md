# 🏋️ Suplementos Gochi — Frontend (React 19 + Vite)

Aplicación Web SPA (**Single Page Application**) del e-commerce **Suplementos Gochi**, desarrollada con **React 19**, **Vite** y **React Router DOM v7**, integrada al 100% con nuestra API RESTful en Node.js + Express 5 + MongoDB.

---

## 🚀 Tecnologías Utilizadas

- **React 19**: Biblioteca principal basada en componentes funcionales y Custom Hooks.
- **Vite 8**: Entorno de empaquetado ultrarrápido con Hot Module Replacement (HMR).
- **React Router DOM v7**: Enrutamiento declarativo (`createBrowserRouter`), rutas anidadas (`<Outlet />`) y protección de rutas por rol (`<ProtectedRoute />`).
- **Context API + `sessionStorage`**: Gestión global de sesión de usuario y token **JWT** (`AuthContext`).
- **SweetAlert2**: Alertas modales de confirmación y notificaciones tipo *Toast* (`src/utils/notify.js`).
- **CSS3 Modular con Variables Nativas**: Diseño responsivo *Mobile-First* sin dependencia de frameworks pesados.
- **PropTypes**: Validación de tipos en las propiedades de componentes reutilizables.

---

## 📂 Arquitectura del Proyecto (`Estándar Corporativo Internacional`)

Siguiendo las mejores prácticas profesionales de la industria:
- **100% del código fuente** (nombres de componentes, hooks, variables, estados, funciones y rutas) está escrito en **Inglés**.
- **100% de la interfaz de usuario (UI)**, alertas, textos visibles y comentarios explicativos están en **Español**.

```text
suplementos-gochi-frontend/
├── public/
│   └── carousel/                        # Banners y portadas WebP de las categorías
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx               # Barra de navegación con autocompletado y menú móvil
│   │   │   ├── Footer.jsx               # Pie de página institucional y redes sociales
│   │   │   ├── Layout.jsx               # Estructura base (Header + Main + Footer)
│   │   │   └── ProtectedRoute.jsx       # Guardián de rutas privadas y de administrador
│   │   ├── pages/
│   │   │   ├── Home.jsx                 # Inicio con Hero Banner, carrusel de categorías y beneficios
│   │   │   ├── Products.jsx             # Catálogo con filtros por categoría, búsqueda y ordenamiento
│   │   │   ├── CreateProductPage.jsx    # Formulario de alta de suplemento con subida de imagen (Admin)
│   │   │   ├── EditProductPage.jsx      # Formulario de edición de suplemento e imagen (Admin)
│   │   │   ├── AdminPanelPage.jsx       # Dashboard de gestión de categorías e inventario (Admin)
│   │   │   ├── CartPage.jsx             # Carrito de compras con validación de stock y checkout por WhatsApp
│   │   │   ├── ContactPage.jsx          # Formulario de contacto y asesoramiento
│   │   │   ├── LoginUserPage.jsx        # Inicio de sesión contra POST /api/users/login
│   │   │   └── RegisterUserPage.jsx     # Registro de cuenta contra POST /api/users/register
│   │   ├── FastCarousel.jsx             # Carrusel interactivo (drag-to-scroll) de categorías
│   │   ├── HeroAutoCarousel.jsx         # Portada principal animada
│   │   ├── Input.jsx                    # Campo de formulario controlado reutilizable
│   │   └── ProductCard.jsx              # Tarjeta de suplemento del catálogo
│   ├── context/
│   │   └── AuthContext.jsx              # Estado global de autenticación (user, token, isAdmin)
│   ├── hooks/
│   │   ├── cart/
│   │   │   └── useCart.jsx              # Persistencia y operaciones del carrito en sessionStorage
│   │   ├── products/
│   │   │   ├── useGetProducts.jsx       # Carga paralela (Promise.all) de suplementos y categorías
│   │   │   ├── useGetProductById.jsx    # Obtención del detalle de un suplemento por su ObjectId
│   │   │   ├── usePostProduct.jsx       # Creación de suplemento + subida multipart de imagen
│   │   │   ├── usePatchProduct.jsx      # Edición parcial de suplemento + reemplazo de imagen
│   │   │   └── useDeleteProduct.jsx     # Eliminación de suplemento con token JWT
│   │   └── user/
│   │       ├── useAuth.jsx              # Hook consumidor del AuthContext
│   │       ├── useLoginUser.jsx         # Petición de login y recepción de token JWT
│   │       └── useRegisterUser.jsx      # Petición de registro de usuario
│   ├── styles/                          # Hojas de estilo modulares por componente/página
│   ├── utils/
│   │   └── notify.js                    # Helpers reutilizables de SweetAlert2
│   ├── App.css                          # Variables CSS globales (:root) y reset
│   ├── App.jsx                          # Componente raíz con AuthProvider y Layout
│   ├── config.js                        # Configuración centralizada (API_URL y WHATSAPP_NUMBER)
│   ├── main.jsx                         # Punto de entrada con RouterProvider
│   └── router.jsx                       # Definición de rutas de la SPA
├── .env.example                         # Plantilla de variables de entorno
├── BITACORA_DESARROLLO.md               # Guía de estudio paso a paso de la construcción del Frontend
└── package.json
```

---

## ⚙️ Instalación y Puesta en Marcha

### 1. Requisitos Previos
- **Node.js** v18 o superior.
- Tener el servidor **Backend (`suplementos-gochi-backend`)** corriendo en `http://localhost:3000`.

### 2. Instalar Dependencias
```bash
cd suplementos-gochi-frontend
npm install
```

### 3. Configurar Variables de Entorno
Crear un archivo `.env` en la raíz de `suplementos-gochi-frontend` (podés copiar `.env.example`):
```env
VITE_API_URL=http://localhost:3000/api/
```

### 4. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.

---

## 🔐 Roles y Permisos en la Interfaz

| Funcionalidad | Visitante | Cliente (`client`) | Administrador (`admin`) |
| :--- | :---: | :---: | :---: |
| Explorar catálogo, buscar y filtrar por categoría | ✅ | ✅ | ✅ |
| Formulario de contacto | ✅ | ✅ | ✅ |
| Registro e inicio de sesión | ✅ | ✅ | ✅ |
| Agregar al carrito y finalizar pedido por WhatsApp | ❌ | ✅ | ✅ |
| Crear, editar y eliminar suplementos y subir imágenes | ❌ | ❌ | ✅ |
| Acceder al Panel Admin (`/admin`) y gestionar categorías | ❌ | ❌ | ✅ |

---

## 📖 Bitácora de Estudio
Revisá el archivo [`BITACORA_DESARROLLO.md`](./BITACORA_DESARROLLO.md) para estudiar el paso a paso cronológico de cómo se construyó cada capa del Frontend desde cero.
