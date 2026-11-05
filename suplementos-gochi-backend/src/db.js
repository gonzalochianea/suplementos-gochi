import mongoose from "mongoose"
import { MONGO_URI } from "./utils/config.js"

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log(`MongoDB conectado a la base: "${mongoose.connection.name}"`)
    } catch (error) {
        console.error(`Error al conectar con MongoDB: ${error.message}`)
        process.exit(1)
    }
}
