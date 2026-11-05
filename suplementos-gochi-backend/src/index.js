import app from "./app.js"
import { connectDB } from "./db.js"
import { PORT } from "./utils/config.js"

// 1. Conectamos primero a MongoDB de forma asíncrona
await connectDB()

// 2. Levantamos la escucha en el puerto configurado (3000)
app.listen(PORT, () => {
    console.log(`Servidor de Suplementos Gochi corriendo en http://localhost:${PORT}`)
})
