import { useState } from "react"
import { API_URL } from "../../config"

function useDeleteProduct() {
    const [error, setError] = useState(null)

    const deleteProduct = async (productId) => {
        setError(null)
        const token = sessionStorage.getItem("token")

        try {
            const response = await fetch(`${API_URL}supplements/${productId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data?.error || `Error al eliminar (${response.status})`)
            }

            return data
        } catch (err) {
            console.error(err)
            setError(err)
            return null
        }
    }

    return { error, deleteProduct }
}

export default useDeleteProduct
