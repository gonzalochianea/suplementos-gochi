import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCart from "../../hooks/cart/useCart";
import useGetProducts from "../../hooks/products/useGetProducts";
import usePatchProduct from "../../hooks/products/usePatchProduct";
import usePostOrder from "../../hooks/cart/usePostOrder";
import useAuth from "../../hooks/user/useAuth";
import { notifySuccess, notifyError, notifyInfo, confirmAction } from "../../utils/notify";
import "../../styles/CartPage.css";

// Vista del carrito (/cart), accesible solo a usuarios autenticados.
// Cruza los items del carrito (productId + size + quantity) con los datos completos
// del producto.
function CartPage() {
  const { items, increment, decrement, removeItem, clearCart } = useCart();
  const { products, loading } = useGetProducts();
  const { patchProduct } = usePatchProduct();
  const { postOrder } = usePostOrder();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);

  // Cruce de cada item con su producto correspondiente
  const detailedItems = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean);

  const total = detailedItems.reduce(
    (acc, { product, quantity }) => acc + product.price * quantity,
    0
  );

  const handleClearCart = async () => {
    const confirmed = await confirmAction(
      "¿Vaciar el carrito?",
      "Se quitarán todos los productos.",
      "Sí, vaciar"
    );
    if (confirmed) clearCart();
  };

  const handleCheckout = async () => {
    if (detailedItems.length === 0) {
      notifyInfo("El carrito está vacío");
      return;
    }

    // Validar stock disponible antes de comprar
    const sinStock = detailedItems.find(({ product, quantity }) => {
      return quantity > product.quantity;
    });

    if (sinStock) {
      const stockDisponible = sinStock.product.quantity;
      const nombreMostrar = sinStock.product.name;

      notifyError(
        "Stock insuficiente",
        `"${nombreMostrar}" tiene solo ${stockDisponible} en stock.`
      );
      return;
    }

    const confirmed = await confirmAction(
      "Confirmar compra",
      `Total a pagar: $${total}`,
      "Sí, comprar"
    );
    if (!confirmed) return;

    setProcessing(true);
    try {
      // Como puede haber múltiples items del mismo producto, agrupamos los cambios
      const stockUpdates = {};
      
      for (const { product, quantity } of detailedItems) {
        if (!stockUpdates[product.id]) {
          stockUpdates[product.id] = {
            quantity: product.quantity,
          };
        }
        stockUpdates[product.id].quantity -= quantity;
      }

      // Descontar stock (PATCH individuales)
      for (const productId of Object.keys(stockUpdates)) {
        const update = stockUpdates[productId];
        const patchData = { quantity: update.quantity };
          
        const result = await patchProduct(patchData, productId);
        if (!result) throw new Error(`Error al actualizar stock del producto ${productId}`);
      }

      // Registrar la orden de compra
      const order = {
        userId: user.id,
        items: items.map(({ productId, quantity }) => ({ productId, quantity })),
        total,
        createdAt: new Date().toISOString(),
      };
      
      const savedOrder = await postOrder(order);
      if (!savedOrder) throw new Error("Error al registrar la orden");

      clearCart();
      await notifySuccess("¡Compra realizada con éxito!", `Total: $${total}`);
      navigate("/");
    } catch (error) {
      console.error(error);
      notifyError("Error en la compra", "Ocurrió un error al procesar la compra. Intentá nuevamente.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-error-screen">
        <h2>Cargando carrito...</h2>
        <img className="loading-gif" src="./loading.gif" alt="loading" />
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <h1>Mi Carrito</h1>

      {detailedItems.length === 0 ? (
        <p className="cart-empty-msg">
          Tu carrito está vacío. ¡Agregá productos desde el catálogo!
        </p>
      ) : (
        <>
          <div className="cart-table-wrapper">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {detailedItems.map(({ product, quantity }, index) => (
                  <tr key={`${product.id}-${index}`}>
                    <td className="cart-font-500">
                      {product.name}
                    </td>
                    <td>${product.price}</td>
                    <td>
                      <div className="cart-qty-controls">
                        <button className="qty-btn" onClick={() => decrement(product.id)}>
                          -
                        </button>
                        <span className="qty-number">{quantity}</span>
                        <button className="qty-btn" onClick={() => increment(product.id)}>
                          +
                        </button>
                      </div>
                    </td>
                    <td className="cart-font-600">${product.price * quantity}</td>
                    <td>
                      <button className="btn btn-outline-danger" onClick={() => removeItem(product.id)}>
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
              Total: <span className="cart-total-value">${total}</span>
            </h2>
            <div className="cart-buttons-container">
              <button className="btn btn-success" onClick={handleCheckout} disabled={processing}>
                {processing ? "Procesando..." : "Finalizar compra"}
              </button>
              <button className="btn btn-outline-danger" onClick={handleClearCart} disabled={processing}>
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
