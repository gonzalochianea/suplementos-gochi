import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/user/useAuth";
import useGetProducts from "../../hooks/products/useGetProducts";
import "../../styles/Header.css";

function Header() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { products } = useGetProducts();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    // Muestra sugerencias a partir de 2 caracteres
    if (val.trim().length >= 2 && products) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5)); // Mostrar un máximo de 5 sugerencias
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (productName) => {
    navigate(`/products?search=${encodeURIComponent(productName)}`);
    setSearchQuery("");
    setSuggestions([]);
  };

  return (
    <header className="site-header">
      <div className="nav-container">
        
        {/* Lado izquierdo: Logo y Mensaje de Bienvenida */}
        <div className="header-left">
          <NavLink className="brand-link" to="/">
            SUPLEMENTOS <span className="brand-highlight">GOCHI</span>
          </NavLink>
          {user && (
            <div className="welcome-user-inline">
              Bienvenido, <span>{user.email}</span>
            </div>
          )}
        </div>

        {/* Centro: Buscador y Sugerencias */}
        <div className="search-container-wrapper">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={handleInputChange}
              className="search-input-header"
            />
            <button type="submit" className="search-button-header" aria-label="Buscar">
              🔍
            </button>
          </form>

          {/* Desplegable de Sugerencias de Autocompletado */}
          {suggestions.length > 0 && (
            <ul className="search-suggestions-list">
              {suggestions.map((product) => (
                <li
                  key={product.id}
                  onClick={() => handleSuggestionClick(product.name)}
                  className="search-suggestion-item"
                >
                  🏋️ {product.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Lado derecho: Navegación */}
        <nav className="main-nav">
          <button className="hamburger-btn" onClick={toggleMobileMenu} aria-label="Abrir menú">
            {isMobileMenuOpen ? "✖" : "☰"}
          </button>
          
          <ul className={`nav-menu ${isMobileMenuOpen ? "open" : ""}`}>
            <li>
              <NavLink className="nav-link" to="/" onClick={closeMobileMenu}>
                Inicio
              </NavLink>
            </li>
            <li>
              <NavLink className="nav-link" to="/products" onClick={closeMobileMenu}>
                Productos
              </NavLink>
            </li>
            <li>
              <NavLink className="nav-link" to="/contacto" onClick={closeMobileMenu}>
                Contacto
              </NavLink>
            </li>
            {!isAuthenticated && (
              <li>
                <NavLink className="nav-link" to="/user/register" onClick={closeMobileMenu}>
                  Registrarse
                </NavLink>
              </li>
            )}
            {!isAuthenticated && (
              <li>
                <NavLink className="nav-link" to="/user/login" onClick={closeMobileMenu}>
                  Ingresar
                </NavLink>
              </li>
            )}
            {/* Carrito: solo para usuarios autenticados */}
            {isAuthenticated && (
              <li>
                <NavLink className="nav-link" to="/cart" onClick={closeMobileMenu}>
                  Carrito
                </NavLink>
              </li>
            )}
            {/* Panel Admin: solo para administradores */}
            {isAdmin && (
              <li>
                <NavLink className="nav-link" to="/admin/users" onClick={closeMobileMenu}>
                  Panel Admin
                </NavLink>
              </li>
            )}
            {isAuthenticated && (
              <li>
                <button onClick={handleLogout} className="btn-logout">
                  Cerrar Sesión
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
