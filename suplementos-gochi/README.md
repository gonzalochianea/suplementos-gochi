# 🏋️ Suplementos Gochi - E-commerce Frontend

Este es el frontend de **Suplementos Gochi**, un Trabajo Práctico (Proyecto Integrador) desarrollado con **React**, **Vite** y **Bootstrap 5**. Es una aplicación web moderna (Single Page Application - SPA) orientada a la venta de suplementos deportivos, que incluye autenticación de usuarios, gestión completa (CRUD) de productos, panel de administración y un diseño altamente responsivo.

---

## 🚀 Características Principales

* 🔐 **Autenticación y Sesiones**: 
  * Registro de nuevos usuarios y validación de credenciales (`/user/register`, `/user/login`).
  * Persistencia segura de sesión en `sessionStorage` gestionada con Custom Hooks.
  * Rutas protegidas que verifican el estado de autenticación (Admin / Usuario normal).

* 📦 **CRUD Completo de Productos**:
  * **Listado Interactivo**: Tarjetas de productos atractivas y filtrado/ordenamiento (`/products`).
  * **Administración Segura**: Creación (`/products/create`) y Edición (`/products/edit/:id`) protegidas solo para administradores.
  * **Eliminación**: Borrado de productos y usuarios con validaciones (SweetAlert o confirmaciones nativas).

* 🛒 **Sistema de Carrito de Compras**:
  * Interfaz para agregar, quitar y modificar cantidades de suplementos en el carrito de compras.

* 👥 **Panel de Administración (Dashboard)**:
  * Vista exclusiva para administradores donde pueden gestionar a todos los usuarios registrados (con permisos de Superadmin).
  * Modal detallado para visualizar la información de los clientes.

* ⚡ **Diseño y Rendimiento**:
  * Maquetado 100% responsivo (adaptable a celulares y tablets) utilizando **Bootstrap 5** y **Vanilla CSS**.
  * Carruseles rápidos, fluidos e interactivos en la página de inicio (Hero y Destacados).
  * Estilos altamente personalizados sin depender excesivamente de frameworks (arquitectura CSS customizada).

---

## 🛠️ Tecnologías y Librerías

El stack principal de desarrollo de la aplicación es:

* **[React](https://react.dev/) (v18+)**: Construcción de interfaces de usuario y componentización.
* **[Vite](https://vite.dev/)**: Servidor de desarrollo instantáneo y empaquetador ultrarrápido.
* **[React Router DOM](https://reactrouter.com/) (v7)**: Manejo del enrutamiento dinámico y protección de rutas (SPA).
* **[Bootstrap](https://getbootstrap.com/) (v5.3)**: Grilla responsiva, botones y layout estructural.
* **Vanilla CSS**: Sistema propio de variables CSS, gradientes, animaciones e interfaces personalizadas.
* **SweetAlert2** / Notificaciones custom: Para alertas y modales interactivos en la UX.

---

## 📁 Estructura del Proyecto

A continuación, la organización del repositorio:

```text
suplementos-gochi/
├── .env                  # Variables de entorno locales (URL de la API REST)
├── .env.example          # Plantilla para variables de entorno
├── index.html            # Punto de entrada HTML (Integra Google Fonts y Bootstrap)
├── package.json          # Dependencias y scripts
├── src/
│   ├── main.jsx          # Punto de entrada de React (montaje en el DOM)
│   ├── App.jsx           # Componente raíz y Layout principal
│   ├── App.css           # Estilos globales y tokens CSS (variables)
│   ├── router.jsx        # Configuración de las Rutas y protección de endpoints
│   ├── styles/           # 🎨 Arquitectura CSS modularizada por componente
│   │   ├── AdminPanelPage.css
│   │   ├── CartPage.css
│   │   ├── ContactPage.css
│   │   ├── FastCarousel.css
│   │   ├── Footer.css
│   │   ├── Gallery.css
│   │   ├── Header.css
│   │   ├── HeroAutoCarousel.css
│   │   ├── ProductCard.css
│   │   ├── Products.css
│   │   └── UserDetailModal.css
│   ├── hooks/            # Hooks personalizados (Custom Hooks para Lógica)
│   │   ├── products/     # Fetch, creación y borrado de productos
│   │   └── user/         # Hooks de Auth y manejo del estado de usuarios
│   └── components/       # Componentes de UI
│       ├── layout/       
│       │   ├── Footer.jsx
│       │   ├── Header.jsx
│       │   ├── Layout.jsx
│       │   └── ProtectedRoute.jsx
│       ├── pages/        
│       │   ├── AdminPanelPage.jsx
│       │   ├── CartPage.jsx
│       │   ├── ContactPage.jsx
│       │   ├── CreateProductPage.jsx
│       │   ├── EditProductPage.jsx
│       │   ├── Home.jsx
│       │   ├── LoginUserPage.jsx
│       │   ├── Products.jsx
│       │   └── RegisterUserPage.jsx
│       ├── Carousel.jsx
│       ├── FastCarousel.jsx
│       ├── Gallery.jsx
│       ├── HeroAutoCarousel.jsx
│       ├── Input.jsx
│       ├── ProductCard.jsx
│       └── UserDetailModal.jsx
```

---

## ⚙️ Configuración del Entorno (Local)

Para que el frontend funcione correctamente, necesitas conectarlo a tu backend (API REST con JSON-Server u otro).

1. Crea un archivo `.env` en la raíz del proyecto.
2. Añade la variable de entorno de tu API:

```env
VITE_API_URL="http://localhost:3000/"
```

---

## 🚦 Instalación y Ejecución

Sigue estos pasos para probar la aplicación en tu computadora:

1. **Instalar las dependencias** abriendo una terminal en la raíz de la carpeta:
```bash
npm install
```

2. **Ejecutar el servidor local** (Vite):
```bash
npm run dev
```

3. Abre el navegador en la URL indicada en consola (normalmente `http://localhost:5173/`).

---

## 🏆 Proyecto de Entrega (Trabajo Práctico)

Esta versión de **Suplementos Gochi** representa la entrega integradora del módulo de Frontend. Todo el código fue diseñado pensando en las buenas prácticas de React (componentización, separación de la lógica en custom hooks) y en proveer una experiencia de usuario (UX) moderna y llamativa.
