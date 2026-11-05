import { useState } from "react"
import { API_URL } from "../../config"

function usePostProduct() {
    const [error, setError] = useState(null)

    const postProduct = async (formData, imageFile = null) => {
        setError(null)
        const token = sessionStorage.getItem("token")

        try {
            const response = await fetch(`${API_URL}supplements`, {
                method: "POST",
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

            // Si el admin adjuntó un archivo de imagen físico, lo subimos a PUT /api/supplements/:id/image
            if (imageFile && data?._id) {
                const fileFormData = new FormData()
                fileFormData.append("image", imageFile)

                const imgRes = await fetch(`${API_URL}supplements/${data._id}/image`, {
                    method: "PUT",
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: fileFormData,
                })

                const imgData = await imgRes.json()
                if (!imgRes.ok) {
                    throw new Error(imgData?.error || "El suplemento se creó, pero falló la subida de la imagen")
                }
                return imgData
            }

            return data
        } catch (err) {
            console.error("Error al crear un nuevo suplemento:", err)
            setError(err)
            return null
        }
    }

    return { error, postProduct }
}

export default usePostProduct
