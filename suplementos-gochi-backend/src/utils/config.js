import dotenv from "dotenv"

// quiet: true evita que dotenv imprima mensajes extra en cada arranque
dotenv.config({ quiet: true })

// Con valor por defecto: si no existe .env, PORT no queda undefined
export const PORT = process.env.PORT || 3000
export const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/suplementos_gochi"

// Secreto para firmar tokens JWT (quien lo tenga puede generar tokens válidos)
export const JWT_SECRET = process.env.JWT_SECRET || "secreto_suplementos_gochi_default"
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h"

// Configuración de almacenamiento de imágenes
export const STORAGE = process.env.STORAGE || "local"
export const IMAGES_FOLDER = process.env.IMAGES_FOLDER || "uploads"
export const API_URL = process.env.API_URL || `http://localhost:${PORT}`

// Credenciales para Supabase Storage
export const SUPABASE_URL = process.env.SUPABASE_URL
export const SUPABASE_KEY = process.env.SUPABASE_KEY
