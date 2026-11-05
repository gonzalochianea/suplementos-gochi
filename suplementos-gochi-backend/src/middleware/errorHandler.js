export const errorHandler = (error, req, res, next) => {
    // 1. Errores de negocio personalizados (creados con new AppError)
    if (error.name === "AppError") {
        return res.status(error.status).json({ error: error.message })
    }

    // 2. JSON mal formado en el body (ej: una coma de más en Postman)
    if (error.type === "entity.parse.failed") {
        return res.status(400).json({ error: "El cuerpo enviado no es un JSON válido" })
    }

    // 3. El ID de la URL no tiene formato válido de ObjectId de MongoDB
    if (error.name === "CastError") {
        return res.status(400).json({
            error: "El ID proporcionado no tiene un formato válido de MongoDB",
            received: error.value
        })
    }

    // 4. Se rompieron las reglas de validación del Schema de Mongoose
    if (error.name === "ValidationError") {
        return res.status(400).json({
            error: "Los datos enviados no son válidos",
            details: Object.values(error.errors).map(e => e.message)
        })
    }

    // 5. Clave única duplicada en MongoDB (ej: email o nombre de categoría repetido)
    if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyPattern)[0]
        return res.status(409).json({
            error: `Ya existe un registro con ese valor en el campo '${duplicateField}'`
        })
    }

    // 6. Errores de autenticación con JWT
    if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Token inválido o manipulado" })
    }
    if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "El token venció. Por favor, volvé a iniciar sesión" })
    }

    // 7. Errores de carga de archivos con Multer
    if (error.name === "MulterError") {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: "La imagen no puede pesar más de 4 MB" })
        }
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({ error: `Campo inesperado '${error.field}'. El campo debe llamarse 'image'` })
        }
        return res.status(400).json({ error: `Error al procesar el archivo: ${error.message}` })
    }

    // 8. Cualquier otro error no previsto (falla interna)
    console.error("❌ Error no controlado:", error)
    res.status(500).json({ error: "Error interno del servidor" })
}

