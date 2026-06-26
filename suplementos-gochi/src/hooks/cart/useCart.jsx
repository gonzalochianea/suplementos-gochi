import { useState } from "react"

// Lógica del carrito en el cliente. Persiste en sessionStorage con la
// estructura: [{ productId: Number, quantity: Number }].
const CART_KEY = "carrito"

function readCart() {
    try {
        return JSON.parse(sessionStorage.getItem(CART_KEY)) || []
    } catch {
        return []
    }
}

function useCart() {
    const [items, setItems] = useState(readCart)

    const persist = (next) => {
        sessionStorage.setItem(CART_KEY, JSON.stringify(next))
        setItems(next)
    }

    const changeQuantity = (productId, delta) => {
        const current = readCart()
        const isMatch = (i) => i.productId === productId
        
        const base = current.some(isMatch)
            ? current
            : [...current, { productId, quantity: 0 }]
            
        const next = base
            .map((i) =>
                isMatch(i) ? { ...i, quantity: i.quantity + delta } : i
            )
            .filter((i) => i.quantity > 0)
            
        persist(next)
    }

    const addToCart = (productId) => changeQuantity(productId, 1)
    const increment = (productId) => changeQuantity(productId, 1)
    const decrement = (productId) => changeQuantity(productId, -1)
    const removeItem = (productId) =>
        persist(readCart().filter((i) => i.productId !== productId))
    const clearCart = () => persist([])

    return { items, addToCart, increment, decrement, removeItem, clearCart }
}

export default useCart
