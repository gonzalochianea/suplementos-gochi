import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCart from "../../hooks/cart/useCart";
import useGetProducts from "../../hooks/products/useGetProducts";
import useAuth from "../../hooks/user/useAuth";
import { WHATSAPP_NUMBER } from "../../config";
import { notifySuccess, notifyError, notifyInfo, confirmAction } from "../../utils/notify";
import "../../styles/CartPage.css";

function CartPage() {
  const { items, increment, decrement, removeItem, clearCart } = useCart();
  const { products, loading } = useGetProducts();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);

  // Cruce de cada item del carrito con su suplemento de MongoDB (_id)
  const detailedItems = items
    .map((item) => {
      const product = products.find((p) => String(p._id) === String(item.productId));
      return product ? { ...item, product } : null;
    })
    .filter(Boolean);

  const total = detailedItems.reduce(
    (acc, { product, quantity }) => acc + Number(product.price) * quantity,
    0
  );

  const handleClearCart = async () => {
    const confirmed = await confirmAction(
      "¿Vaciar el carrito?",
      "Se quitarán todos los suplementos seleccionados.",
      "Sí, vaciar"
    );
    if (confirmed) clearCart();
  };

  const handleCheckout = async () => {
    if (detailedItems.length === 0) {
      notifyInfo("El carrito está vacío");
      return;
    }

    // Validar stock disponible antes de armar el pedido
    const outOfStockItem = detailedItems.find(({ product, quantity }) => {
      return quantity > (product.stock ?? 0);
    });

    if (outOfStockItem) {
      notifyError(
        "Stock insuficiente",
        `"${outOfStockItem.product.name}" tiene solo ${outOfStockItem.product.stock} unidades en stock.`
      );
      return;
    }

    const formattedTotal = total.toLocaleString("es-AR");

    const confirmed = await confirmAction(
      "Confirmar pedido por WhatsApp",
      `Total a pagar: $${formattedTotal}. Te redirigiremos a WhatsApp con el resumen listo para enviar.`,
      "Enviar pedido por WhatsApp"
    );
    if (!confirmed) return;

    setProcessing(true);
    try {
      const productLines = detailedItems
        .map(
          ({ product, quantity }) =>
            `• ${quantity}x *${product.name}* ($${Number(product.price).toLocaleString("es-AR")} c/u) = *$${(Number(product.price) * quantity).toLocaleString("es-AR")}*`
        )
        .join("\n");

      const whatsappMessage = [
        "¡Hola *Suplementos Gochi*! 👋 Quiero realizar el siguiente pedido:",
        "",
        `👤 *Cliente:* ${user?.name || "Cliente"} (${user?.email || ""})`,
        "",
        "🛒 *Detalle del pedido:*",
        productLines,
        "",
        `💰 *TOTAL A PAGAR: $${formattedTotal}*`,
      ].join("\n");

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");

      clearCart();
      await notifySuccess(
        "¡Pedido generado con éxito!",
        `Se abrió WhatsApp con tu pedido por $${formattedTotal}.`
      );
      navigate("/");
    } catch (err) {
      console.error(err);
      notifyError("Error en el pedido", "Ocurrió un error al preparar tu pedido.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-error-screen">
        <h2>Cargando carrito...</h2>
        <img className="loading-gif" src="/loading.gif" alt="loading" />
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <h1>Mi Carrito</h1>

      {detailedItems.length === 0 ? (
        <p className="cart-empty-msg">
          Tu carrito está vacío. ¡Agregá suplementos desde el catálogo!
        </p>
      ) : (
        <>
          <div className="cart-table-wrapper">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Suplemento</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {detailedItems.map(({ product, quantity }, index) => (
                  <tr key={`${product._id}-${index}`}>
                    <td className="cart-font-500">{product.name}</td>
                    <td>${Number(product.price).toLocaleString("es-AR")}</td>
                    <td>
                      <div className="cart-qty-controls">
                        <button
                          className="qty-btn"
                          onClick={() => decrement(product._id)}
                        >
                          -
                        </button>
                        <span className="qty-number">{quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => increment(product._id)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="cart-font-600">
                      ${(Number(product.price) * quantity).toLocaleString("es-AR")}
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => removeItem(product._id)}
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cart-total-section">
            <h2 className="cart-total-title">
              Total:{" "}
              <span className="cart-total-value">
                ${total.toLocaleString("es-AR")}
              </span>
            </h2>
            <div className="cart-buttons-container">
              <button
                className="btn btn-success"
                onClick={handleCheckout}
                disabled={processing}
              >
                {processing ? "Procesando..." : "Finalizar compra por WhatsApp 💬"}
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={handleClearCart}
                disabled={processing}
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
