import { useState, useCallback } from "react"
import { API_URL } from "../../config"

function useGetProductById() {
    const [error, setError] = useState(null)

    const getProductById = useCallback(async (productId) => {
        try {
            setError(null)
            const response = await fetch(`${API_URL}supplements/${productId}`)

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}))
                throw new Error(errData?.error || `Error al traer el suplemento (${response.status})`)
            }

            return await response.json()
        } catch (err) {
            console.error(err)
            setError(err)
            return null
        }
    }, [])

    return { getProductById, error }
}

export default useGetProductById
