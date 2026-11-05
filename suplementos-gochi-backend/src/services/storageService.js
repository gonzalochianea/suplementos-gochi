import path from "path"
import { STORAGE } from "../utils/config.js"
import { saveLocalImage, deleteLocalImage } from "./storage/local.js"
import { saveSupabaseImage, deleteSupabaseImage } from "./storage/supabase.js"

export const saveImage = async (file) => {
    // 1. Extraemos la extensión (.jpg, .png, .webp) y creamos un nombre único con Date.now()
    const extension = path.extname(file.originalname)
    const fileName = `${Date.now()}${extension}`

    // 2. Patrón Strategy: delegamos según lo configurado en el .env
    if (STORAGE === "supabase") {
        return await saveSupabaseImage(file, fileName)
    }

    return await saveLocalImage(file, fileName)
}

export const deleteImage = async (imageUrl) => {
    if (!imageUrl) return

    if (STORAGE === "supabase") {
        await deleteSupabaseImage(imageUrl)
    } else {
        await deleteLocalImage(imageUrl)
    }
}
