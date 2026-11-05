import { AppError } from "../utils/AppError.js"

export const allowRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // 1. Verificamos que verifyToken haya inyectado el usuario previamente
        if (!req.user) {
            throw new AppError("Usuario no autenticado", 401)
        }
        // 2. Comprobamos si el rol del usuario está en la lista de roles autorizados
        if (!allowedRoles.includes(req.user.role)) {
            throw new AppError("No tenés permisos de administrador para realizar esta acción", 403)
        }
        // 3. Si tiene el rol adecuado, damos paso al controlador
        next()
    }
}

