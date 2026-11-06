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
    // App actúa como el contenedor raíz que provee el contexto y el Layout general
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/products/create",
        element: (
          <ProtectedRoute requireAdmin>
            <CreateProductPage />
          </ProtectedRoute>
        ),
      },
      {
        // Parámetro dinámico :id del suplemento en MongoDB
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
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/user/register",
        element: <RegisterUserPage />,
      },
      {
        path: "/user/login",
        element: <LoginUserPage />,
      },
      {
        // Ruta comodín para páginas no encontradas (404)
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
