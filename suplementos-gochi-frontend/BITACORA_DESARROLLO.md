# 📓 Bitácora de Desarrollo Paso a Paso — Suplementos Gochi (Frontend React)

Esta bitácora documenta **cronológicamente y desde cero** la construcción del Frontend de **Suplementos Gochi** (React 19 + Vite + React Router DOM v7).

Está organizada en **orden estricto de dependencias (de abajo hacia arriba)** para que puedas seguirla paso a paso como guía de estudio o reconstruir el proyecto sin que ningún `import` falle en el camino:
1. Primero configuramos las variables de entorno, utilidades y el contexto global de sesión (`AuthContext`).
2. Luego creamos los **Custom Hooks** que se comunican con nuestra API RESTful de Node.js + MongoDB.
3. Después construimos los **componentes reutilizables** y el **Layout** con protección de rutas (`ProtectedRoute`).
4. Luego armamos cada una de las **Páginas (Vistas)** del e-commerce.
5. Finalmente conectamos todo en el **Enrutador (`router.jsx`)** y el punto de entrada (`main.jsx`).

> **Convención de Código (Estándar Corporativo Internacional)**:
> - **Código en Inglés**: Todos los nombres de componentes, hooks, estados, funciones, propiedades y rutas están en inglés.
> - **Interfaz y Comentarios en Español**: Todos los textos visibles por el cliente, alertas de SweetAlert2 y comentarios explicativos están en español.

---

## 🏗️ Fase 1: Inicialización del Proyecto y Configuración Base

### Paso 1.1: Creación del proyecto con Vite e instalación de dependencias
En la terminal, creamos el proyecto React con Vite e instalamos las librerías necesarias:

```bash
npm create vite@latest suplementos-gochi-frontend -- --template react
cd suplementos-gochi-frontend
npm install react-router-dom sweetalert2 prop-types
```

**¿Por qué instalamos cada paquete?**
- `react-router-dom` (v7): Permite crear una **SPA (Single Page Application)** donde el usuario navega entre páginas (`/products`, `/cart`, `/admin`) sin que el navegador recargue toda la pantalla.
- `sweetalert2`: Reemplaza los rústicos `window.alert()` y `window.confirm()` del navegador por modales animados y notificaciones tipo *Toast*.
- `prop-types`: Documenta y valida qué tipos de propiedades (`props`) recibe cada componente reutilizable.

---

### Paso 1.2: Variables de Entorno (`.env` y `.env.example`)
Creamos el archivo `.env` en la raíz de `suplementos-gochi-frontend` apuntando a nuestro Backend de Node.js + Express:

```env
VITE_API_URL=http://localhost:3000/api/
```

> **Nota técnica de Vite**: A diferencia de Node.js (donde usamos `process.env`), Vite exige que toda variable de entorno pública comience con el prefijo `VITE_` y se lea mediante `import.meta.env.VITE_API_URL`.

---

### Paso 1.3: Archivo Central de Configuración (`src/config.js`)
Para no repetir `import.meta.env.VITE_API_URL` en cada hook, centralizamos la URL base del Backend (asegurando que siempre termine con `/`) y el número de WhatsApp de la tienda:

```javascript
const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/"

export const API_URL = rawUrl.endsWith("/") ? rawUrl : `${rawUrl}/`

export const WHATSAPP_NUMBER = "5491166818345"
```

---

### Paso 1.4: Utilidad de Notificaciones Visuales (`src/utils/notify.js`)
Creamos un módulo con funciones reutilizables de **SweetAlert2** adaptadas a la paleta verde esmeralda (`#0d817c`) de Suplementos Gochi:

```javascript
import Swal from "sweetalert2";

const THEME = {
  background: "#ffffff",
  color: "#1a1a1a",
  confirmButtonColor: "#0d817c",
  cancelButtonColor: "#ef4444",
};

export const notifySuccess = (title, text = "") =>
  Swal.fire({
    ...THEME,
    icon: "success",
    title,
    text,
    timer: 2000,
    showConfirmButton: false,
  });

export const notifyError = (title, text = "") =>
  Swal.fire({
    ...THEME,
    icon: "error",
    title,
    text,
  });

export const notifyInfo = (title, text = "") =>
  Swal.fire({
    ...THEME,
    icon: "info",
    title,
    text,
  });

export const notifyToast = (title, icon = "success") =>
  Swal.fire({
    ...THEME,
    toast: true,
    position: "top-end",
    icon,
    title,
    showConfirmButton: false,
    timer: 1800,
    timerProgressBar: true,
  });

export const confirmAction = async (
  title,
  text = "",
  confirmButtonText = "Sí, continuar"
) => {
  const result = await Swal.fire({
    ...THEME,
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: "Cancelar",
    reverseButtons: true,
  });
  return result.isConfirmed;
};
```

---

## 🔐 Fase 2: Contexto Global de Autenticación y Sesión JWT

En React, muchos componentes distantes (el `Header`, las tarjetas de producto `ProductCard`, el carrito `CartPage` y el guardián `ProtectedRoute`) necesitan saber al mismo tiempo:
1. ¿Hay un usuario logueado? (`isAuthenticated`)
2. ¿Cuál es su token JWT? (`token`)
3. ¿Tiene rol de administrador? (`isAdmin`)

Para evitar el *Prop Drilling* (pasar props manualmente por 5 niveles de componentes), usamos la **Context API de React** combinada con `sessionStorage`.

### Paso 2.1: Proveedor de Autenticación (`src/context/AuthContext.jsx`)
```jsx
import { createContext, useEffect, useState } from "react"

const SESSION_KEY = "user"
const TOKEN_KEY = "token"

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [error, setError] = useState(null)

    // Al recargar la pestaña, restauramos el usuario y el JWT desde sessionStorage
    useEffect(() => {
        const storedUser = sessionStorage.getItem(SESSION_KEY)
        const storedToken = sessionStorage.getItem(TOKEN_KEY)
        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser))
                setToken(storedToken)
            } catch (err) {
                console.error(err)
                setError(err)
            }
        }
    }, [])

    const login = (authData) => {
        const loggedUser = authData.user || authData
        const jwtToken = authData.token || null

        setUser(loggedUser)
        setToken(jwtToken)
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(loggedUser))
        if (jwtToken) {
            sessionStorage.setItem(TOKEN_KEY, jwtToken)
        }
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        sessionStorage.removeItem(SESSION_KEY)
        sessionStorage.removeItem(TOKEN_KEY)
    }

    const value = {
        user,
        token,
        login,
        logout,
        error,
        isAuthenticated: user !== null && Boolean(token),
        isAdmin: user?.role === "admin",
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
```

### Paso 2.2: Hook Consumidor de Autenticación (`src/hooks/user/useAuth.jsx`)
Creamos un Custom Hook para consumir el `AuthContext` de forma limpia desde cualquier componente con una sola línea (`const { user, isAdmin, logout } = useAuth()`):

```jsx
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"

function useAuth() {
    const context = useContext(AuthContext)

    if (context === null) {
        throw new Error("useAuth debe usarse dentro de un <AuthProvider>")
    }

    return context
}

export default useAuth
```

---

## 🪝 Fase 3: Custom Hooks de Comunicación con el Backend y Carrito

Separar las llamadas `fetch` en **Custom Hooks** dentro de `src/hooks/` es una de las mejores prácticas en React: mantiene los componentes visuales limpios y dedicados exclusivamente a renderizar JSX.

### Paso 3.1: Hooks de Usuarios (`useLoginUser.jsx` y `useRegisterUser.jsx`)

**1. `src/hooks/user/useLoginUser.jsx`** — Envía credenciales a `POST /api/users/login` y devuelve `{ token, user }`:
```jsx
import { useState } from "react"
import { API_URL } from "../../config"

function useLoginUser() {
    const [error, setError] = useState(null)

    const loginUser = async (email, password) => {
        setError(null)

        try {
            const response = await fetch(`${API_URL}users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                const message = data?.error || "Credenciales inválidas"
                setError(message)
                return null
            }

            // Devuelve { token, user: { _id, name, email, role } }
            return data
        } catch (err) {
            console.error("Error al iniciar sesión:", err)
            setError("No se pudo conectar con el servidor")
            return null
        }
    }

    return { error, loginUser }
}

export default useLoginUser
```

**2. `src/hooks/user/useRegisterUser.jsx`** — Registra una nueva cuenta en `POST /api/users/register`:
```jsx
import { useState } from "react"
import { API_URL } from "../../config"

function useRegisterUser() {
    const [error, setError] = useState(null)

    const registerUser = async (formData) => {
        setError(null)

        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role || "client",
            }

            const response = await fetch(`${API_URL}users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            const data = await response.json()

            if (!response.ok) {
                const message = data?.details
                    ? data.details.join(" | ")
                    : data?.error || "Error al registrar usuario"
                setError(message)
                return null
            }

            return data
        } catch (err) {
            console.error("Error al registrar usuario:", err)
            setError("No se pudo conectar con el servidor")
            return null
        }
    }

    return { error, registerUser }
}

export default useRegisterUser
```

---

### Paso 3.2: Hooks de Catálogo y Suplementos (`src/hooks/products/`)

**1. `src/hooks/products/useGetProducts.jsx`** — Descarga en paralelo (`Promise.all`) los suplementos (`GET /api/supplements`) y las categorías (`GET /api/categories`), exponiendo además una función `refetch()` para recargar datos tras crear o borrar:
```jsx
import { useEffect, useState, useCallback } from "react"
import { API_URL } from "../../config.js"

function useGetProducts() {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])

    const getProducts = useCallback(async (queryParams = "") => {
        try {
            setLoading(true)
            setError(null)

            const [suppRes, catRes] = await Promise.all([
                fetch(`${API_URL}supplements${queryParams}`),
                fetch(`${API_URL}categories`),
            ])

            if (!suppRes.ok) {
                throw new Error(`Error al traer suplementos (${suppRes.status})`)
            }

            const suppData = await suppRes.json()
            setProducts(suppData)

            if (catRes.ok) {
                const catData = await catRes.json()
                setCategories(catData)
            }
        } catch (err) {
            console.error(err)
            setError(err)
            setProducts([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        getProducts()
    }, [getProducts])

    const refetch = () => getProducts()

    return { products, categories, error, loading, refetch }
}

export default useGetProducts
```

**2. `src/hooks/products/useGetProductById.jsx`** — Obtiene un suplemento individual por su `_id` de MongoDB (`GET /api/supplements/:id`) para precargar el formulario de edición:
```jsx
import { useState, useCallback } from "react"
import { API_URL } from "../../config"

function useGetProductById() {
    const [error, setError] = useState(null)

    const getProductById = useCallback(async (productId) => {
        try {
            setError(null)
            const response = await fetch(`${API_URL}supplements/${productId}`)

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}))
                throw new Error(errData?.error || `Error al traer el suplemento (${response.status})`)
            }

            return await response.json()
        } catch (err) {
            console.error(err)
            setError(err)
            return null
        }
    }, [])

    return { getProductById, error }
}

export default useGetProductById
```

**3. `src/hooks/products/usePostProduct.jsx`** — Crea el suplemento (`POST /api/supplements`) enviando el token JWT en `Authorization: Bearer <token>`, y si el administrador adjuntó un archivo físico de imagen, lo sube inmediatamente con `FormData` a `PUT /api/supplements/:id/image`:
```jsx
import { useState } from "react"
import { API_URL } from "../../config"

function usePostProduct() {
    const [error, setError] = useState(null)

    const postProduct = async (formData, imageFile = null) => {
        setError(null)
        const token = sessionStorage.getItem("token")

        try {
            const response = await fetch(`${API_URL}supplements`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                const msg = data?.details ? data.details.join(" | ") : data?.error || `Error ${response.status}`
                throw new Error(msg)
            }

            // Si el admin adjuntó un archivo de imagen físico, lo subimos a PUT /api/supplements/:id/image
            if (imageFile && data?._id) {
                const fileFormData = new FormData()
                fileFormData.append("image", imageFile)

                const imgRes = await fetch(`${API_URL}supplements/${data._id}/image`, {
                    method: "PUT",
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: fileFormData,
                })

                const imgData = await imgRes.json()
                if (!imgRes.ok) {
                    throw new Error(imgData?.error || "El suplemento se creó, pero falló la subida de la imagen")
                }
                return imgData
            }

            return data
        } catch (err) {
            console.error("Error al crear un nuevo suplemento:", err)
            setError(err)
            return null
        }
    }

    return { error, postProduct }
}

export default usePostProduct
```

**4. `src/hooks/products/usePatchProduct.jsx`** — Actualiza parcialmente un suplemento (`PATCH /api/supplements/:id`) y, si se adjuntó una nueva imagen física, la sube a `PUT /api/supplements/:id/image`:
```jsx
import { useState } from "react"
import { API_URL } from "../../config"

function usePatchProduct() {
    const [error, setError] = useState(null)

    const patchProduct = async (formData, productId, imageFile = null) => {
        setError(null)
        const token = sessionStorage.getItem("token")

        try {
            const response = await fetch(`${API_URL}supplements/${productId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                const msg = data?.details ? data.details.join(" | ") : data?.error || `Error ${response.status}`
                throw new Error(msg)
            }

            // Si el admin seleccionó un nuevo archivo físico, lo subimos al endpoint Multer/Supabase
            if (imageFile) {
                const fileFormData = new FormData()
                fileFormData.append("image", imageFile)

                const imgRes = await fetch(`${API_URL}supplements/${productId}/image`, {
                    method: "PUT",
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: fileFormData,
                })

                const imgData = await imgRes.json()
                if (!imgRes.ok) {
                    throw new Error(imgData?.error || "Error al actualizar la imagen del suplemento")
                }
                return imgData
            }

            return data
        } catch (err) {
            console.error(err)
            setError(err)
            return null
        }
    }

    return { patchProduct, error }
}

export default usePatchProduct
```

**5. `src/hooks/products/useDeleteProduct.jsx`** — Elimina un suplemento (`DELETE /api/supplements/:id`) enviando el token JWT de administrador:
```jsx
import { useState } from "react"
import { API_URL } from "../../config"

function useDeleteProduct() {
    const [error, setError] = useState(null)

    const deleteProduct = async (productId) => {
        setError(null)
        const token = sessionStorage.getItem("token")

        try {
            const response = await fetch(`${API_URL}supplements/${productId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data?.error || `Error al eliminar (${response.status})`)
            }

            return data
        } catch (err) {
            console.error(err)
            setError(err)
            return null
        }
    }

    return { error, deleteProduct }
}

export default useDeleteProduct
```

---

### Paso 3.3: Hook del Carrito de Compras (`src/hooks/cart/useCart.jsx`)
Gestiona los ítems agregados por el cliente (`[{ productId, quantity }]`) persistiendo automáticamente en `sessionStorage`:

```jsx
import { useState } from "react"

// Lógica del carrito en el cliente. Persiste en sessionStorage con la
// estructura: [{ productId: String (ObjectId de MongoDB), quantity: Number }].
const CART_KEY = "cart"

function readCart() {
    try {
        return JSON.parse(sessionStorage.getItem(CART_KEY)) || []
    } catch {
        return []
    }
}

function useCart() {
    const [items, setItems] = useState(readCart)

    const persist = (next) => {
        sessionStorage.setItem(CART_KEY, JSON.stringify(next))
        setItems(next)
    }

    const changeQuantity = (productId, delta) => {
        const current = readCart()
        const isMatch = (i) => String(i.productId) === String(productId)

        const base = current.some(isMatch)
            ? current
            : [...current, { productId: String(productId), quantity: 0 }]

        const next = base
            .map((i) =>
                isMatch(i) ? { ...i, quantity: i.quantity + delta } : i
            )
            .filter((i) => i.quantity > 0)

        persist(next)
    }

    const addToCart = (productId) => changeQuantity(productId, 1)
    const increment = (productId) => changeQuantity(productId, 1)
    const decrement = (productId) => changeQuantity(productId, -1)
    const removeItem = (productId) =>
        persist(readCart().filter((i) => String(i.productId) !== String(productId)))
    const clearCart = () => persist([])

    return { items, addToCart, increment, decrement, removeItem, clearCart }
}

export default useCart
```

---

## 🧩 Fase 4: Componentes Visuales Reutilizables

### Paso 4.1: Campo de Formulario Controlado (`src/components/Input.jsx`)
```jsx
import PropTypes from "prop-types";

// Enfoque reutilizable de campos de formulario estilizados
function Input({ label, value, onChange, labelId, type = "text", isRequired = false, placeholder = "" }) {
  return (
    <div className="form-group">
      <label htmlFor={labelId}>{label}</label>
      <input
        required={isRequired}
        type={type}
        value={value}
        onChange={onChange}
        id={labelId}
        name={labelId}
        placeholder={placeholder}
        className="form-input"
      />
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  labelId: PropTypes.string.isRequired,
  type: PropTypes.string,
  isRequired: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default Input;
```

### Paso 4.2: Portada Principal (`src/components/HeroAutoCarousel.jsx`)
Renderiza el Hero Banner de bienvenida con llamado a la acción hacia `/products`:
```jsx
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import "../styles/HeroAutoCarousel.css";

function HeroAutoCarousel({ imgSrc, altText = "Banner Principal" }) {
  if (!imgSrc) return null;

  return (
    <div className="hero-auto-carousel">
      <div className="hero-slide active">
        <img src={imgSrc} alt={altText} className="hero-img" />
        <div className="hero-overlay">
          <h2>SUPLEMENTOS GOCHI</h2>
          <p>Potenciá tu entrenamiento al máximo nivel</p>
          <NavLink to="/products" className="btn btn-primary hero-btn">
            Ver Catálogo
          </NavLink>
        </div>
      </div>
    </div>
  );
}

HeroAutoCarousel.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  altText: PropTypes.string,
};

export default HeroAutoCarousel;
```

### Paso 4.3: Carrusel Interactivo de Categorías (`src/components/FastCarousel.jsx`)
Implementa un carrusel infinito con soporte de arrastre con el mouse (*drag-to-scroll*) que al hacer clic navega a `/products` filtrando automáticamente por la categoría elegida:
```jsx
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "../styles/FastCarousel.css";

function FastCarousel({ categories }) {
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);

  const extendedCategories = [
    ...categories,
    ...categories,
    ...categories,
    ...categories,
  ];

  // ... manejo de eventos de mouse y flechas laterales ...
  const handleCategoryClick = (categoryId) => {
    if (dragDistance > 10) return; // Si fue un arrastre, no navegar
    navigate("/products", { state: { category: categoryId } });
  };
  // ...
}
```

### Paso 4.4: Tarjeta de Suplemento (`src/components/ProductCard.jsx`)
Muestra cada suplemento del catálogo con su imagen, insignia de categoría, precio formateado en pesos argentinos (`es-AR`), stock disponible y botones condicionales según el rol del usuario (`Agregar al carrito` para usuarios autenticados, `Editar` y `Borrar` para administradores):
```jsx
import { useNavigate } from "react-router-dom";
import useDeleteProduct from "../hooks/products/useDeleteProduct";
import useAuth from "../hooks/user/useAuth";
import useCart from "../hooks/cart/useCart";
import { notifyToast, notifyError, confirmAction } from "../utils/notify";
import PropTypes from "prop-types";
import "../styles/ProductCard.css";

function ProductCard({ products, onProductDeleted }) {
  const navigate = useNavigate();
  const { deleteProduct, error } = useDeleteProduct();
  const { isAdmin, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  // ...
}
```

---

## 🧭 Fase 5: Estructura de Layout y Protección de Rutas

### Paso 5.1: Guardián de Rutas (`src/components/layout/ProtectedRoute.jsx`)
Componente de orden superior que protege las páginas privadas (`/cart`) y las páginas exclusivas de administrador (`/admin`, `/products/create`, `/products/edit/:id`):

```jsx
import { Navigate } from "react-router-dom"
import PropTypes from "prop-types"
import useAuth from "../../hooks/user/useAuth"

function ProtectedRoute({ children, requireAdmin = false }) {
    const { isAuthenticated, isAdmin } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to="/user/login" replace />
    }

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/" replace />
    }

    return children
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    requireAdmin: PropTypes.bool,
}

export default ProtectedRoute
```

### Paso 5.2: Cabecera (`Header.jsx`), Pie de Página (`Footer.jsx`) y Contenedor (`Layout.jsx`)
- **`src/components/layout/Header.jsx`**: Incluye el logo, saludo personalizado al usuario logueado (`Hola, Gonzalo`), buscador en tiempo real con autocompletado de sugerencias y menú hamburguesa adaptable a celulares.
- **`src/components/layout/Footer.jsx`**: Enlaces rápidos e íconos de Instagram y WhatsApp conectados a `WHATSAPP_NUMBER`.
- **`src/components/layout/Layout.jsx`**: Envuelve todas las vistas manteniendo el `Header` arriba y el `Footer` abajo.

---

## 📄 Fase 6: Vistas Públicas y de Autenticación (`src/components/pages/`)

1. **`Home.jsx` (`/`)**: Renderiza el `HeroAutoCarousel`, el `FastCarousel` con las 6 categorías principales (`Proteínas`, `Creatinas`, `Pre-entrenos`, `Aminoácidos`, `Vitaminas`, `Barritas`) y la sección institucional *"¿Por qué elegirnos?"*.
2. **`Products.jsx` (`/products`)**:
   - Consume `useGetProducts()`.
   - Permite filtrar por categoría (mostrando la cantidad de suplementos en cada chip), buscar por texto mediante Query Params (`?search=...`) y ordenar por nombre (`A-Z`, `Z-A`), precio (`Menor precio`, `Mayor precio`) o antigüedad.
3. **`ContactPage.jsx` (`/contact`)**: Formulario controlado reutilizando el componente `<Input />`, con estado en inglés (`firstName`, `lastName`, `email`, `phone`, `reason`, `isClient`, `message`) y confirmación visual mediante `notifySuccess`.
4. **`RegisterUserPage.jsx` (`/user/register`)**: Formulario de alta de usuarios conectado a `useRegisterUser()`. Si quien está creando el usuario es un `admin`, habilita un selector adicional para elegir el rol (`client` o `admin`).
5. **`LoginUserPage.jsx` (`/user/login`)**: Autentica al usuario con `useLoginUser()`, guarda el token JWT en el `AuthContext` mediante `login(data)` y redirige al inicio.

---

## 🛠️ Fase 7: Vistas Privadas y Panel de Administración

1. **`CartPage.jsx` (`/cart`)**:
   - Cruza los `items` guardados en `sessionStorage` con los suplementos reales de MongoDB (`_id`).
   - Calcula subtotales y el total general.
   - Valida que la cantidad solicitada no supere el `stock` disponible antes de permitir la compra.
   - Genera un mensaje detallado y abre automáticamente **WhatsApp Web / App** listo para enviar el pedido a la tienda.
2. **`CreateProductPage.jsx` (`/products/create`) y `EditProductPage.jsx` (`/products/edit/:id`)**:
   - Formularios exclusivos para administradores con vista previa instantánea de imagen (`URL.createObjectURL(file)`).
   - Permiten tanto subir un archivo físico (`JPG`, `PNG`, `WEBP` hacia Multer/Supabase) como pegar una URL externa.
3. **`AdminPanelPage.jsx` (`/admin`)**:
   - Dashboard integral dividido en dos tarjetas principales:
     - **Gestión de Categorías**: Permite crear nuevas categorías (`POST /api/categories`) y eliminar categorías sin suplementos asociados (`DELETE /api/categories/:id`).
     - **Inventario de Suplementos**: Tabla con miniatura, categoría, precio, stock, pestañas de filtro rápido por categoría y buscador en tiempo real.

---

## 🚦 Fase 8: Enrutador Principal y Punto de Entrada

### Paso 8.1: Componente Raíz (`src/App.jsx`)
Envuelve toda la aplicación dentro de `<AuthProvider>` y `<Layout>`, utilizando `<Outlet />` de React Router para inyectar la página activa según la URL:

```jsx
import "./App.css";
import Layout from "./components/layout/Layout";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Outlet />
      </Layout>
    </AuthProvider>
  );
}

export default App;
```

### Paso 8.2: Mapa de Rutas (`src/router.jsx`)
Configura todas las rutas públicas, protegidas y de administrador mediante `createBrowserRouter`:

```jsx
import { createBrowserRouter, NavLink } from "react-router-dom";
import App from "./App";
import Home from "./components/pages/Home";
import Products from "./components/pages/Products";
import CreateProductPage from "./components/pages/CreateProductPage";
import EditProductPage from "./components/pages/EditProductPage";
import RegisterUserPage from "./components/pages/RegisterUserPage";
import LoginUserPage from "./components/pages/LoginUserPage";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AdminPanelPage from "./components/pages/AdminPanelPage";
import CartPage from "./components/pages/CartPage";
import ContactPage from "./components/pages/ContactPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "/products", element: <Products /> },
      {
        path: "/products/create",
        element: (
          <ProtectedRoute requireAdmin>
            <CreateProductPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/products/edit/:id",
        element: (
          <ProtectedRoute requireAdmin>
            <EditProductPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute requireAdmin>
            <AdminPanelPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/cart",
        element: (
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      { path: "/contact", element: <ContactPage /> },
      { path: "/user/register", element: <RegisterUserPage /> },
      { path: "/user/login", element: <LoginUserPage /> },
      {
        path: "*",
        element: (
          <div className="loading-error-screen">
            <h1>Error 404</h1>
            <p>La página que buscás no existe.</p>
            <NavLink to="/" className="btn btn-primary">
              Volver al Inicio
            </NavLink>
          </div>
        ),
      },
    ],
  },
]);
```

### Paso 8.3: Punto de Entrada (`src/main.jsx`)
Monta la aplicación React en el nodo `#root` del `index.html`:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
```

---

## 🎓 Fase 9: Preguntas Frecuentes para Defensa Oral (UTN)

1. **¿Cómo se comunican el Frontend y el Backend para las rutas protegidas?**
   - Cuando el usuario inicia sesión en `LoginUserPage`, el Backend valida las credenciales con `bcrypt` y devuelve un **token JWT** firmado. El Frontend lo guarda en `sessionStorage` a través del `AuthContext`. Luego, cada vez que un administrador crea, edita o elimina un suplemento o categoría, nuestros Custom Hooks adjuntan la cabecera `Authorization: Bearer <token>` en la petición `fetch`.
2. **¿Por qué usamos `ProtectedRoute` en el Frontend si el Backend ya tiene `verifyToken` y `allowRoles`?**
   - **En el Backend** la validación es por **seguridad real** (nadie puede alterar la base de datos sin un JWT válido de admin).
   - **En el Frontend** `ProtectedRoute` es por **experiencia de usuario (UX)**: evita que un visitante o cliente vea pantallas administrativas vacías o formularios que no tiene permiso de usar, redirigiéndolo automáticamente al login o al inicio.
3. **¿Cómo funciona la subida de imágenes desde el formulario de React?**
   - En `CreateProductPage` y `EditProductPage`, primero enviamos los datos JSON del suplemento (`name`, `price`, `stock`, `category`). Si el administrador seleccionó un archivo físico en el `<input type="file">`, empaquetamos ese archivo en un objeto `new FormData()` bajo la clave `"image"` y hacemos una segunda petición `PUT /api/supplements/:id/image`, donde el Backend la procesa con **Multer** y la almacena localmente o en **Supabase Storage**.

---

## ☁️ Fase 10: Despliegue en Producción en Vercel

### Paso 10.1: Configuración de Rewrites para SPA (`vercel.json`)
En una **Single Page Application (SPA)** con `react-router-dom`, las rutas como `/products`, `/cart` o `/admin` existen en memoria gracias a JavaScript, pero no son archivos físicos en el servidor. Para evitar que Vercel devuelva un error `404 Not Found` cuando un usuario recarga la página (`F5`) en una ruta interna, creamos `vercel.json` en la raíz de `suplementos-gochi-frontend`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Paso 10.2: Configuración del Proyecto y Variables de Entorno en Vercel
- **Root Directory:** `suplementos-gochi-frontend`
- **Framework Preset:** `Vite`
- **Variable de Entorno de Producción:**
  ```env
  VITE_API_URL=https://suplementos-gochi-backend.onrender.com/api/
  ```
- **Enlaces finales del ecosistema Full Stack en Producción:**
  - **Frontend en Vercel:** [https://suplementos-gochi.vercel.app/](https://suplementos-gochi.vercel.app/)
  - **Backend en Render:** [https://suplementos-gochi-backend.onrender.com/](https://suplementos-gochi-backend.onrender.com/)
  - **Swagger UI en Vivo:** [https://suplementos-gochi-backend.onrender.com/api-docs](https://suplementos-gochi-backend.onrender.com/api-docs)


