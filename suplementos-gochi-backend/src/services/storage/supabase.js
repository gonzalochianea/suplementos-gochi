import { supabase } from "../../config/supabase.js"
import { IMAGES_FOLDER } from "../../utils/config.js"
import { AppError } from "../../utils/AppError.js"

export const saveSupabaseImage = async (file, fileName) => {
    if (!supabase) {
        throw new AppError("Las credenciales de Supabase no están configuradas en el .env", 500)
    }

    // 1. Subimos el buffer al bucket de Supabase indicando su tipo MIME
    const { error } = await supabase.storage
        .from(IMAGES_FOLDER)
        .upload(fileName, file.buffer, { contentType: file.mimetype })

    if (error) {
        throw new AppError(`Error al subir imagen a Supabase: ${error.message}`, 500)
    }

    // 2. Obtenemos y devolvemos la URL pública del archivo en la nube
    const { data } = supabase.storage
        .from(IMAGES_FOLDER)
        .getPublicUrl(fileName)

    return data.publicUrl
}

export const deleteSupabaseImage = async (imageUrl) => {
    if (!supabase) return
    const fileName = imageUrl.split("/").pop()
    await supabase.storage.from(IMAGES_FOLDER).remove([fileName])
}
