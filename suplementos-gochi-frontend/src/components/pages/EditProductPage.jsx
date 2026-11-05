import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usePatchProduct from "../../hooks/products/usePatchProduct";
import useGetProductById from "../../hooks/products/useGetProductById";
import useGetProducts from "../../hooks/products/useGetProducts";
import { notifySuccess } from "../../utils/notify";

const EMPTY_FORM = {
  name: "",
  price: 0,
  stock: 1,
  description: "",
  category: "",
  available: true,
  image: "",
};

function EditProductPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [localPreview, setLocalPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { error, patchProduct } = usePatchProduct();
  const { error: getByIdError, getProductById } = useGetProductById();
  const { categories } = useGetProducts();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const loadProduct = async () => {
      const product = await getProductById(id);
      if (product) {
        setForm({
          name: product.name ?? "",
          price: product.price ?? 0,
          stock: product.stock ?? 0,
          description: product.description ?? "",
          category: product.category?._id ?? product.category ?? "",
          available: product.available ?? true,
          image: product.image ?? "",
        });
      }
    };
    loadProduct();
  }, [id, getProductById]);

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

    const updated = await patchProduct(payload, id, imageFile);
    setSubmitting(false);

    if (updated) {
      await notifySuccess("Cambios guardados", `"${updated.name}" se actualizó con éxito`);
      navigate("/products");
    }
  };

  const combinedError = error || getByIdError;
  const previewSrc = localPreview || form.image;

  return (
    <div className="admin-form-container">
      <h1 className="admin-form-title">Editar Suplemento</h1>

      <form className="admin-form" onSubmit={handleFormSubmit}>
        <div className="admin-form-grid">
          {/* Columna izquierda */}
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

          {/* Columna derecha */}
          <div className="admin-form-col">
            <div className="form-group">
              <label className="form-label" htmlFor="imageFile">
                Reemplazar imagen subiendo archivo (JPG, PNG o WEBP)
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
              <label className="form-label" htmlFor="image">URL de la imagen actual</label>
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

        {combinedError && (
          <p className="form-error">{combinedError.message || String(combinedError)}</p>
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
            {submitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProductPage;
