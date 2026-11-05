import { useState } from "react"
import { API_URL } from "../../config"

function useRegisterUser() {
    const [error, setError] = useState(null)

    const registerUser = async (formData) => {
        setError(null)

        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role || "client",
            }

            const response = await fetch(`${API_URL}users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            const data = await response.json()

            if (!response.ok) {
                const message = data?.details
                    ? data.details.join(" | ")
                    : data?.error || "Error al registrar usuario"
                setError(message)
                return null
            }

            return data
        } catch (err) {
            console.error("Error al registrar usuario:", err)
            setError("No se pudo conectar con el servidor")
            return null
        }
    }

    return { error, registerUser }
}

export default useRegisterUser
