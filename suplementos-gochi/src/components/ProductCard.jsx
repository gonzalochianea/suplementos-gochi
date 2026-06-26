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

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product.id, null);
    notifyToast("Producto agregado al carrito");
  };

  const handleEditProduct = (e, productId) => {
    e.stopPropagation();
    navigate(`/products/edit/${productId}`);
  };

  const handleDeleteProduct = async (e, productId) => {
    e.stopPropagation();
    const confirmed = await confirmAction(
      "¿Eliminar producto?",
      "Esta acción no se puede deshacer.",
      "Sí, eliminar"
    );
    if (confirmed) {
      const response = await deleteProduct(productId);
      if (response) {
        onProductDeleted?.();
      } else {
        notifyError("No se pudo eliminar", "Ocurrió un error al borrar el producto");
      }
    }
  };

  if (error) {
    return (
      <div className="loading-error-screen">
        <h2> Error al borrar el producto </h2>
        <p> {error?.message || String(error)} </p>
      </div>
    );
  }

  return (
    <section className="products-grid">
      {products.map((product) => {
        const totalStock = product.quantity || 0;
        const isOutOfStock = totalStock === 0;

        return (
          <div className="product-card" key={product.id}>
            <div className="product-card-img-wrapper">
              <img
                className="product-card-img"
                src={product.image}
                alt={product.name}
              />
              {product.highlighted && (
                <span className="product-badge">Destacado</span>
              )}
            </div>

            <div className="product-card-body">
              <h2 className="product-title">{product.name}</h2>
              <p className="product-desc">{product.description}</p>
              <p className="product-price"> ${product.price} </p>

              <p className="product-stock">Stock disponible: {totalStock}</p>

              {isOutOfStock && (
                <p className="out-of-stock-text">Sin stock disponible</p>
              )}

              <div className="product-actions">
                {/* Agregar al carrito: solo para usuarios autenticados */}
                {isAuthenticated && !isOutOfStock && (
                  <button
                    className="btn btn-primary"
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    Agregar al carrito
                  </button>
                )}

                {/* Editar / Borrar solo visibles para administradores */}
                {isAdmin && (
                  <div className="admin-actions">
                    <button
                      className="btn btn-outline-electric"
                      onClick={(e) => handleEditProduct(e, product.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={(e) => handleDeleteProduct(e, product.id)}
                    >
                      Borrar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

ProductCard.propTypes = {
  products: PropTypes.array.isRequired,
  onProductDeleted: PropTypes.func.isRequired,
};

export default ProductCard;
