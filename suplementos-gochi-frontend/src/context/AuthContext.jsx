import { createContext, useEffect, useState } from "react"

const SESSION_KEY = "user"
const TOKEN_KEY = "token"

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const storedUser = sessionStorage.getItem(SESSION_KEY)
        const storedToken = sessionStorage.getItem(TOKEN_KEY)
        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser))
                setToken(storedToken)
            } catch (err) {
                console.error(err)
                setError(err)
            }
        }
    }, [])

    const login = (authData) => {
        const loggedUser = authData.user || authData
        const jwtToken = authData.token || null

        setUser(loggedUser)
        setToken(jwtToken)
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(loggedUser))
        if (jwtToken) {
            sessionStorage.setItem(TOKEN_KEY, jwtToken)
        }
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        sessionStorage.removeItem(SESSION_KEY)
        sessionStorage.removeItem(TOKEN_KEY)
    }

    const value = {
        user,
        token,
        login,
        logout,
        error,
        isAuthenticated: user !== null && Boolean(token),
        isAdmin: user?.role === "admin",
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
