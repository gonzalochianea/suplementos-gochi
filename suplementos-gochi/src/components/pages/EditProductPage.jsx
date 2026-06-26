import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usePatchProduct from "../../hooks/products/usePatchProduct";
import useGetProductById from "../../hooks/products/useGetProductById";

const CATEGORIES = [
  { id: "proteinas", name: "Proteínas" },
  { id: "creatinas", name: "Creatinas" },
  { id: "pre-entrenos", name: "Pre-entrenos" },
  { id: "aminoacidos", name: "Aminoácidos" },
  { id: "vitaminas", name: "Vitaminas" },
  { id: "barritas", name: "Barritas" }
];

const EMPTY_FORM = {
  name: "",
  price: 0,
  description: "",
  type: "suplemento",
  category: "proteinas",
  highlighted: false,
  image: "",
  status: "AVAILABLE",
  profitRate: 1.21,
  quantity: 1,
};

function EditProductPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const { error, patchProduct } = usePatchProduct();
  const { error: getByIdError, getProductById } = useGetProductById();
  const { id } = useParams();
  const navigate = useNavigate();

  // Cargar los datos del producto al montar
  useEffect(() => {
    if (!id) return;
    const loadProduct = async () => {
      const product = await getProductById(id);
      if (product) {
        setForm({
          name: product.name ?? "",
          price: product.price ?? 0,
          description: product.description ?? "",
          type: product.type ?? "suplemento",
          category: product.category ?? "proteinas",
          highlighted: product.highlighted ?? false,
          image: product.image ?? "",
          status: product.status ?? "AVAILABLE",
          profitRate: product.profitRate ?? 1.21,
          quantity: product.quantity ?? 1,
        });
      }
    };
    loadProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? parseFloat(value) || 0
            : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const productData = { ...form };

    const success = await patchProduct(productData, id);
    if (success) {
      navigate("/products");
    }
  };

  const combinedError = error || getByIdError;

  return (
    <div className="admin-form-container">
      <h1 className="admin-form-title">Editar Producto</h1>

      <form className="admin-form" onSubmit={handleFormSubmit}>
        <div className="admin-form-grid">
          {/* Columna izquierda */}
          <div className="admin-form-col">

            <div className="form-group">
              <label className="form-label" htmlFor="name">Nombre del producto</label>
              <input
                className="form-input"
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="price">Precio ($)</label>
              <input
                className="form-input"
                type="number"
                id="price"
                name="price"
                value={form.price}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category">Categoría</label>
              <select className="form-select" id="category" name="category" value={form.category} onChange={handleInputChange}>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="quantity">Cantidad en stock</label>
              <input
                className="form-input"
                type="number"
                id="quantity"
                name="quantity"
                value={form.quantity}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">Descripción</label>
              <textarea
                className="form-textarea"
                id="description"
                name="description"
                value={form.description}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>

            <div className="form-toggle-group">
              <label className="form-toggle-label" htmlFor="highlighted">
                <input
                  className="form-toggle-input"
                  type="checkbox"
                  id="highlighted"
                  name="highlighted"
                  checked={form.highlighted}
                  onChange={handleInputChange}
                />
                <span className="form-toggle-text">Marcar como Destacado</span>
              </label>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="admin-form-col">
            <div className="form-group">
              <label className="form-label" htmlFor="image">URL de la imagen</label>
              <input
                className="form-input"
                type="text"
                id="image"
                name="image"
                value={form.image}
                onChange={handleInputChange}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="image-preview-box">
              {form.image ? (
                <img
                  className="image-preview-img"
                  src={form.image}
                  alt="Preview del producto"
                />
              ) : (
                <div className="image-preview-placeholder">
                  <span>🖼️</span>
                  <p>Ingresá la URL para ver una preview de la imagen</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {combinedError && (
          <p className="form-error">{combinedError.message || String(combinedError)}</p>
        )}

        <div className="form-actions">
          <button type="button" className="btn-form-cancel" onClick={() => navigate("/products")}>
            Cancelar
          </button>
          <button type="submit" className="btn-form-submit">
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProductPage;
