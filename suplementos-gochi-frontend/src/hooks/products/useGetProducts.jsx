import { useEffect, useState, useCallback } from "react"
import { API_URL } from "../../config.js"

function useGetProducts() {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])

    const getProducts = useCallback(async (queryParams = "") => {
        try {
            setLoading(true)
            setError(null)

            const [suppRes, catRes] = await Promise.all([
                fetch(`${API_URL}supplements${queryParams}`),
                fetch(`${API_URL}categories`),
            ])

            if (!suppRes.ok) {
                throw new Error(`Error al traer suplementos (${suppRes.status})`)
            }

            const suppData = await suppRes.json()
            setProducts(suppData)

            if (catRes.ok) {
                const catData = await catRes.json()
                setCategories(catData)
            }
        } catch (err) {
            console.error(err)
            setError(err)
            setProducts([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        getProducts()
    }, [getProducts])

    const refetch = () => getProducts()

    return { products, categories, error, loading, refetch }
}

export default useGetProducts
