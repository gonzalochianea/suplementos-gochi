import jwt from "jsonwebtoken"
import { AppError } from "../utils/AppError.js"
import { JWT_SECRET } from "../utils/config.js"

export const verifyToken = (req, res, next) => {
    // 1. Obtener la cabecera Authorization
    const authHeader = req.headers["authorization"]

    // 2. Verificar que exista y comience con 'Bearer '
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError("No se proporcionó un token de autenticación válido", 401)
    }

    // 3. Extraer el token separando 'Bearer <token>' por el espacio
    const token = authHeader.split(" ")[1]

    if (!token) {
        throw new AppError("Token no proporcionado", 401)
    }

    // 4. Verificar la autenticidad y vigencia del token
    // Si el token fue manipulado o expiró, jwt.verify lanza un error que errorHandler captura automáticamente
    const decoded = jwt.verify(token, JWT_SECRET)

    // 5. Inyectamos los datos del usuario autenticado (id y role) en el objeto req
    req.user = decoded

    // 6. Damos paso al siguiente middleware o controlador
    next()
}

