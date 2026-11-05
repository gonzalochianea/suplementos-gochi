import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePostProduct from "../../hooks/products/usePostProduct";
import useGetProducts from "../../hooks/products/useGetProducts";
import { notifySuccess } from "../../utils/notify";

const INITIAL_FORM = {
  name: "",
  price: 0,
  stock: 10,
  description: "",
  category: "",
  available: true,
  image: "",
};

function CreateProductPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [localPreview, setLocalPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { error, postProduct } = usePostProduct();
  const { categories } = useGetProducts();

  useEffect(() => {
    if (categories.length > 0 && !form.category) {
      setForm((prev) => ({ ...prev, category: categories[0]._id }));
    }
  }, [categories, form.category]);

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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setLocalPreview(URL.createObjectURL(file));
    } else {
      setLocalPreview("");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Math.floor(Number(form.stock)),
      available: Boolean(form.available),
      category: form.category,
      image: form.image.trim() || null,
    };

    const created = await postProduct(payload, imageFile);
    setSubmitting(false);

    if (created) {
      await notifySuccess("Suplemento creado", `"${created.name}" se agregó al catálogo`);
      navigate("/products");
    }
  };

  const previewSrc = localPreview || form.image;

  return (
    <div className="admin-form-container">
      <h1 className="admin-form-title">Crear Suplemento</h1>

      <form className="admin-form" onSubmit={handleFormSubmit}>
        <div className="admin-form-grid">
          {/* Columna izquierda — datos del suplemento */}
          <div className="admin-form-col">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Nombre del suplemento</label>
              <input
                className="form-input"
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                maxLength={120}
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
              <select
                className="form-select"
                id="category"
                name="category"
                value={form.category}
                onChange={handleInputChange}
                required
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="stock">Cantidad en stock</label>
              <input
                className="form-input"
                type="number"
                id="stock"
                name="stock"
                value={form.stock}
                onChange={handleInputChange}
                min="0"
                step="1"
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
                maxLength={500}
                required
              />
            </div>

            <div className="form-toggle-group">
              <label className="form-toggle-label" htmlFor="available">
                <input
                  className="form-toggle-input"
                  type="checkbox"
                  id="available"
                  name="available"
                  checked={form.available}
                  onChange={handleInputChange}
                />
                <span className="form-toggle-text">Disponible para la venta</span>
              </label>
            </div>
          </div>

          {/* Columna derecha — subida de archivo o URL */}
          <div className="admin-form-col">
            <div className="form-group">
              <label className="form-label" htmlFor="imageFile">
                Subir archivo de imagen (JPG, PNG o WEBP - máx 4MB)
              </label>
              <input
                className="form-input"
                type="file"
                id="imageFile"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="image">
                O pegar URL de imagen externa
              </label>
              <input
                className="form-input"
                type="text"
                id="image"
                name="image"
                value={form.image}
                onChange={handleInputChange}
                placeholder="https://..."
              />
            </div>

            <div className="image-preview-box">
              {previewSrc ? (
                <img
                  className="image-preview-img"
                  src={previewSrc}
                  alt="Preview del suplemento"
                />
              ) : (
                <div className="image-preview-placeholder">
                  <span>🖼️</span>
                  <p>Seleccioná un archivo o ingresá una URL para ver la vista previa</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <p className="form-error">{error.message || String(error)}</p>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="btn-form-cancel"
            onClick={() => navigate("/products")}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-form-submit" disabled={submitting}>
            {submitting ? "Guardando..." : "Crear Suplemento"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateProductPage;
