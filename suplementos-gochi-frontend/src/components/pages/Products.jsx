import { useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import useGetProducts from "../../hooks/products/useGetProducts";
import ProductCard from "../ProductCard";
import "../../styles/Products.css";

const FALLBACK_CATEGORIES = [
  { _id: "Proteínas", name: "Proteínas" },
  { _id: "Creatinas", name: "Creatinas" },
  { _id: "Pre-entrenos", name: "Pre-entrenos" },
  { _id: "Aminoácidos", name: "Aminoácidos" },
  { _id: "Vitaminas", name: "Vitaminas" },
  { _id: "Barritas", name: "Barritas" },
];

function Products() {
  const { error, loading, products, categories, refetch } = useGetProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const initialState = location.state || {};
  const [activeCategory, setActiveCategory] = useState(initialState.category || "all");
  const [sortOrder, setSortOrder] = useState("default");

  const searchQuery = searchParams.get("search") || "";

  const handleClearSearch = () => {
    setSearchParams({});
  };

  if (error) {
    return (
      <div className="loading-error-screen">
        <h2>Error al cargar los suplementos</h2>
        <p>{error?.message || String(error)}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-error-screen">
        <h2>Cargando suplementos...</h2>
        <img className="loading-gif" src="/loading.gif" alt="loading" />
      </div>
    );
  }

  const displayedCategories = categories && categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  const getCountByCategory = (catName) =>
    products.filter(
      (p) => p.category?.name?.toLowerCase() === catName.toLowerCase()
    ).length;

  // Filtrado por categoría (soporta _id de MongoDB o nombre de categoría) + búsqueda
  const filteredProducts = products.filter((product) => {
    const catName = product.category?.name || "";
    const catId = product.category?._id || product.category || "";

    const matchesCategory =
      activeCategory === "all" ||
      catId === activeCategory ||
      catName.toLowerCase() === String(activeCategory).toLowerCase();

    const matchesSearch =
      !searchQuery.trim() ||
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      catName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Ordenamiento
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOrder) {
      case "az":
        return (a.name || "").localeCompare(b.name || "");
      case "za":
        return (b.name || "").localeCompare(a.name || "");
      case "lowest":
        return (a.price || 0) - (b.price || 0);
      case "highest":
        return (b.price || 0) - (a.price || 0);
      case "newest":
        return String(b._id).localeCompare(String(a._id));
      case "oldest":
        return String(a._id).localeCompare(String(b._id));
      default:
        return 0;
    }
  });

  return (
    <>
      <h1>Catálogo de Suplementos</h1>

      {/* ── Categorías con contador ── */}
      <div className="category-filter-bar">
        <button
          className={`filter-chip ${activeCategory === "all" ? "active" : ""}`}
          onClick={() => setActiveCategory("all")}
        >
          Todos ({products.length})
        </button>
        {displayedCategories.map((cat) => (
          <button
            key={cat._id}
            className={`filter-chip ${
              activeCategory === cat._id ||
              String(activeCategory).toLowerCase() === cat.name.toLowerCase()
                ? "active"
                : ""
            }`}
            onClick={() => setActiveCategory(cat.name)}
          >
            {cat.name} ({getCountByCategory(cat.name)})
          </button>
        ))}
      </div>

      {/* ── Indicador de búsqueda activa ── */}
      {searchQuery && (
        <div className="search-results-info">
          <p>
            Resultados para:{" "}
            <span className="search-results-query">&quot;{searchQuery}&quot;</span>
          </p>
          <button onClick={handleClearSearch} className="btn btn-outline-danger btn-clear-search">
            Limpiar búsqueda
          </button>
        </div>
      )}

      {/* ── Barra de Ordenamiento ── */}
      <div className="products-filter-wrapper">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="products-filter-select"
        >
          <option value="default">📌 Ordenar por...</option>
          <option value="az">A - Z</option>
          <option value="za">Z - A</option>
          <option value="lowest">Menor precio</option>
          <option value="highest">Mayor precio</option>
          <option value="newest">Lo más nuevo</option>
          <option value="oldest">Lo más viejo</option>
        </select>
      </div>

      {sortedProducts.length === 0 ? (
        <p className="no-results-msg">
          No se encontraron suplementos con los filtros seleccionados.
        </p>
      ) : (
        <ProductCard products={sortedProducts} onProductDeleted={refetch} />
      )}
    </>
  );
}

export default Products;
