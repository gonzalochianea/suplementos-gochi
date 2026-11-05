import express from "express"
import cors from "cors"
import { IMAGES_FOLDER } from "./utils/config.js"
import { errorHandler } from "./middleware/errorHandler.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import supplementRoutes from "./routes/supplementRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import swaggerUi from "swagger-ui-express"
import { specs } from "./docs/swagger.js"

const app = express()

// 1. CORS: Permite que un cliente de otro origen (ej: React en localhost:5173) consuma la API
app.use(cors())

// 2. express.json: Parsea los bodies que llegan en formato JSON y los deja listos en req.body
app.use(express.json())

// 3. Servir imágenes estáticas guardadas localmente (cuando STORAGE=local)
app.use(`/${IMAGES_FOLDER}`, express.static(IMAGES_FOLDER))

// 4. Ruta base de comprobación (Health check)
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Bienvenido a la API de Suplementos Gochi",
        status: "Servidor operativo",
        version: "1.0.0"
    })
})

// 5. Agrupadores de rutas de la API
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))
app.use("/api/categories", categoryRoutes)
app.use("/api/supplements", supplementRoutes)
app.use("/api/users", userRoutes)

// 6. Middleware para rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({ error: "Esa ruta no existe" })
})

// 7. Middleware global de manejo de errores (SIEMPRE AL FINAL)
app.use(errorHandler)

export default app
