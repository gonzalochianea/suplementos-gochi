import { useState } from "react"
import { API_URL } from "../../config"

function useLoginUser() {
    const [error, setError] = useState(null)

    const loginUser = async (email, password) => {
        setError(null)

        try {
            const response = await fetch(`${API_URL}users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                const message = data?.error || "Credenciales inválidas"
                setError(message)
                return null
            }

            // Devuelve { token, user: { _id, name, email, role } }
            return data
        } catch (err) {
            console.error("Error al iniciar sesión:", err)
            setError("No se pudo conectar con el servidor")
            return null
        }
    }

    return { error, loginUser }
}

export default useLoginUser
