import { useState } from "react"
import { useSearchParams, useLocation } from "react-router-dom"
import useGetProducts from "../../hooks/products/useGetProducts"
import ProductCard from "../ProductCard"
import "../../styles/Products.css";

// Categorías de Suplementos
const SUPP_CATS = [
  { id: "proteinas", name: "Proteínas" },
  { id: "creatinas", name: "Creatinas" },
  { id: "pre-entrenos", name: "Pre-entrenos" },
  { id: "aminoacidos", name: "Aminoácidos" },
  { id: "vitaminas", name: "Vitaminas" },
  { id: "barritas", name: "Barritas" },
]

function Products() {
  const { error, loading, products, refetch } = useGetProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()

  const initialState = location.state || {}

  const [activeCategory, setActiveCategory] = useState(initialState.category || "todos")

  // Nuevo estado para ordenamiento
  const [sortOrder, setSortOrder] = useState("default")

  const searchQuery = searchParams.get("search") || ""

  const handleClearSearch = () => {
    setSearchParams({})
  }

  if (error) {
    return (
      <div className="loading-error-screen">
        <h2>Error al cargar los productos</h2>
        <p>{error?.message || String(error)}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="loading-error-screen">
        <h2>Cargando productos...</h2>
        <img className="loading-gif" src="./loading.gif" alt="loading" />
      </div>
    )
  }

  // Lógica de filtrado combinada: subcategoría + buscador
  const filteredProducts = products.filter((product) => {
    // Subcategoría
    const matchesCategory =
      activeCategory === "todos" || product.category === activeCategory

    // Buscador
    const matchesSearch =
      !searchQuery.trim() ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  // Lógica de ordenamiento
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOrder) {
      case "az":
        return a.name.localeCompare(b.name);
      case "za":
        return b.name.localeCompare(a.name);
      case "menor":
        return a.price - b.price;
      case "mayor":
        return b.price - a.price;
      case "nuevo":
        return String(b.id).localeCompare(String(a.id), undefined, { numeric: true });
      case "viejo":
        return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
      default:
        return 0; // "default" mantiene el orden original
    }
  });

  return (
    <>
      <h1>Catálogo de Productos</h1>

      {/* ── Subcategorías ── */}
      <div className="category-filter-bar">
        <button
          className={`filter-chip ${activeCategory === "todos" ? "active" : ""}`}
          onClick={() => setActiveCategory("todos")}
        >
          Todos
        </button>
        {SUPP_CATS.map((cat) => (
          <button
            key={cat.id}
            className={`filter-chip ${activeCategory === cat.id ? "active" : ""}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* ── Indicador de búsqueda activa ── */}
      {searchQuery && (
        <div className="search-results-info">
          <p>
            Resultados para:{" "}
            <span className="search-results-query">"{searchQuery}"</span>
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
          <option value="menor">Menor precio</option>
          <option value="mayor">Mayor precio</option>
          <option value="nuevo">Lo más nuevo</option>
          <option value="viejo">Lo más viejo</option>
        </select>
      </div>

      {sortedProducts.length === 0 ? (
        <p className="no-results-msg">
          No se encontraron productos con los filtros seleccionados.
        </p>
      ) : (
        <ProductCard products={sortedProducts} onProductDeleted={refetch} />
      )}
    </>
  )
}

export default Products