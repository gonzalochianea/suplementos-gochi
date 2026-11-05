import multer from "multer"
import { AppError } from "../utils/AppError.js"

// Tipos MIME de imágenes permitidos
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]

const upload = multer({
    // 1. Guardamos temporalmente el archivo en memoria RAM (req.file.buffer)
    storage: multer.memoryStorage(),

    // 2. Límite máximo de peso: 4 MB expresados en bytes
    limits: {
        fileSize: 4 * 1024 * 1024
    },

    // 3. Filtro de seguridad para aceptar únicamente imágenes válidas
    fileFilter: (req, file, cb) => {
        if (ALLOWED_TYPES.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new AppError("Formato no válido. Solo se permiten imágenes JPG, PNG o WEBP", 400), false)
        }
    }
})

// Middleware que procesa un único archivo enviado bajo el campo "image"
export const uploadImage = upload.single("image")

