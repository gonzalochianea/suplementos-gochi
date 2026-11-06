import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useGetProducts from "../../hooks/products/useGetProducts";
import useDeleteProduct from "../../hooks/products/useDeleteProduct";
import { API_URL } from "../../config";
import { notifySuccess, notifyError, confirmAction } from "../../utils/notify";
import "../../styles/AdminPanelPage.css";

function AdminPanelPage() {
  const { products, categories, error, loading, refetch } = useGetProducts();
  const { deleteProduct } = useDeleteProduct();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [catName, setCatName] = useState("");
  const [catDescription, setCatDescription] = useState("");

  // Contar cuántos suplementos pertenecen a cada categoría
  const getCountByCategory = (catId, categoryName) =>
    products.filter(
      (p) =>
        p.category?._id === catId ||
        p.category?.name?.toLowerCase() === categoryName?.toLowerCase()
    ).length;

  // Filtrado combinado: pestaña de categoría activa + buscador de texto
  const term = search.trim().toLowerCase();
  const filteredProducts = products.filter((p) => {
    const matchesCat =
      selectedCategory === "all" ||
      p.category?._id === selectedCategory ||
      p.category?.name?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      !term ||
      p.name?.toLowerCase().includes(term) ||
      p.category?.name?.toLowerCase().includes(term);

    return matchesCat && matchesSearch;
  });

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) return;
    const token = sessionStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: catName.trim(),
          description: catDescription.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        notifyError("Error al crear categoría", data?.error || "Verificá los datos");
        return;
      }
      setCatName("");
      setCatDescription("");
      refetch();
      notifySuccess("Categoría creada", `"${data.name}" se agregó correctamente`);
    } catch {
      notifyError("Error de red", "No se pudo conectar con el servidor");
    }
  };

  const handleDeleteCategory = async (cat) => {
    const confirmed = await confirmAction(
      `¿Eliminar categoría "${cat.name}"?`,
      "Recordá que no debe tener suplementos asociados.",
      "Sí, eliminar"
    );
    if (!confirmed) return;

    const token = sessionStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}categories/${cat._id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (!res.ok) {
        notifyError("No se puede eliminar", data?.error || "Error al eliminar categoría");
        return;
      }
      if (selectedCategory === cat._id || selectedCategory === cat.name) {
        setSelectedCategory("all");
      }
      refetch();
      notifySuccess("Categoría eliminada", `"${cat.name}" fue eliminada`);
    } catch {
      notifyError("Error de red", "No se pudo conectar con el servidor");
    }
  };

  const handleDeleteProduct = async (product) => {
    const confirmed = await confirmAction(
      `¿Eliminar "${product.name}"?`,
      "El suplemento se borrará de la base de datos.",
      "Sí, eliminar"
    );
    if (confirmed) {
      const result = await deleteProduct(product._id);
      if (result) {
        refetch();
        notifySuccess("Suplemento eliminado", `"${product.name}" fue eliminado.`);
      } else {
        notifyError("Error al eliminar", "No se pudo eliminar el suplemento.");
      }
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar de navegación rápida */}
      <aside className="admin-sidebar-custom">
        <h2 className="admin-sidebar-title">Panel Admin</h2>
        <NavLink to="/admin" className="admin-sidebar-link">
          <span className="admin-icon">📊</span> Inventario y Categorías
        </NavLink>
        <NavLink to="/products" className="admin-sidebar-link">
          <span className="admin-icon">📦</span> Ver Catálogo
        </NavLink>
        <NavLink to="/products/create" className="admin-sidebar-link">
          <span className="admin-icon">➕</span> Crear Suplemento
        </NavLink>
        <NavLink to="/user/register" className="admin-sidebar-link">
          <span className="admin-icon">👤</span> Registrar Usuario
        </NavLink>
      </aside>

      {/* Contenido principal */}
      <div className="admin-main">
        <h1>Panel de Administración</h1>

        {/* 1. Tarjeta de Gestión de Categorías */}
        <section className="admin-section-card">
          <div className="admin-section-header">
            <h3>🏷️ Categorías ({categories.length})</h3>
          </div>

          <form onSubmit={handleCreateCategory} className="admin-cat-form">
            <input
              type="text"
              className="admin-cat-input"
              placeholder="Nueva categoría (ej: Combos)"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              required
              minLength={3}
            />
            <input
              type="text"
              className="admin-cat-input"
              placeholder="Descripción opcional..."
              value={catDescription}
              onChange={(e) => setCatDescription(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              + Crear Categoría
            </button>
          </form>

          <div className="admin-cat-pills">
            {categories.map((cat) => (
              <div key={cat._id} className="admin-cat-pill">
                <span>{cat.name}</span>
                <span className="admin-cat-count">
                  {getCountByCategory(cat._id, cat.name)}
                </span>
                <button
                  type="button"
                  className="admin-cat-delete-btn"
                  onClick={() => handleDeleteCategory(cat)}
                  title={`Eliminar categoría ${cat.name}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Tarjeta de Inventario de Suplementos separado por Categorías */}
        <section className="admin-section-card">
          <div className="admin-section-header">
            <h3>📦 Inventario de Suplementos ({filteredProducts.length})</h3>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/products/create")}
            >
              + Nuevo Suplemento
            </button>
          </div>

          <div className="admin-inventory-controls">
            {/* Pestañas para separar los suplementos por categoría */}
            <div className="admin-category-tabs">
              <button
                type="button"
                className={`admin-cat-tab ${selectedCategory === "all" ? "active" : ""}`}
                onClick={() => setSelectedCategory("all")}
              >
                Todos ({products.length})
              </button>
              {categories.map((cat) => {
                const count = getCountByCategory(cat._id, cat.name);
                const isActive =
                  selectedCategory === cat._id || selectedCategory === cat.name;
                return (
                  <button
                    key={cat._id}
                    type="button"
                    className={`admin-cat-tab ${isActive ? "active" : ""}`}
                    onClick={() => setSelectedCategory(cat.name)}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>

            {/* Buscador rápido */}
            <input
              type="text"
              className="admin-search-input"
              placeholder="🔍 Buscar suplemento por nombre en esta categoría..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading && <p>Cargando inventario...</p>}
          {error && <p className="text-danger">{error?.message || String(error)}</p>}

          {!loading && !error && (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Suplemento</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "2rem" }}>
                        No se encontraron suplementos en esta categoría.
                      </td>
                    </tr>
                  )}
                  {filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <div className="admin-product-cell">
                          <img
                            src={product.image || "/carousel/proteinas.webp"}
                            alt={product.name}
                            className="admin-product-thumb"
                          />
                          <span className="admin-product-name">{product.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="admin-cat-badge">
                          {product.category?.name || "Sin categoría"}
                        </span>
                      </td>
                      <td className="admin-price-cell">
                        ${Number(product.price).toLocaleString("es-AR")}
                      </td>
                      <td>{product.stock} u.</td>
                      <td>
                        <div className="admin-actions-cell">
                          <button
                            className="btn btn-outline-electric btn-sm"
                            onClick={() => navigate(`/products/edit/${product._id}`)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteProduct(product)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminPanelPage;
