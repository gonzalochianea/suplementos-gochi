import { useState } from "react"
import { API_URL } from "../../config"

function usePatchProduct() {
    const [error, setError] = useState(null)

    const patchProduct = async (formData, productId, imageFile = null) => {
        setError(null)
        const token = sessionStorage.getItem("token")

        try {
            const response = await fetch(`${API_URL}supplements/${productId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                const msg = data?.details ? data.details.join(" | ") : data?.error || `Error ${response.status}`
                throw new Error(msg)
            }

            // Si el admin seleccionó un nuevo archivo físico, lo subimos al endpoint Multer/Supabase
            if (imageFile) {
                const fileFormData = new FormData()
                fileFormData.append("image", imageFile)

                const imgRes = await fetch(`${API_URL}supplements/${productId}/image`, {
                    method: "PUT",
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: fileFormData,
                })

                const imgData = await imgRes.json()
                if (!imgRes.ok) {
                    throw new Error(imgData?.error || "Error al actualizar la imagen del suplemento")
                }
                return imgData
            }

            return data
        } catch (err) {
            console.error(err)
            setError(err)
            return null
        }
    }

    return { patchProduct, error }
}

export default usePatchProduct
