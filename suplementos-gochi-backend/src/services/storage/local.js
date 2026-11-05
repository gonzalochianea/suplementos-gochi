import fs from "fs/promises"
import path from "path"
import { API_URL, IMAGES_FOLDER } from "../../utils/config.js"

export const saveLocalImage = async (file, fileName) => {
    // 1. Creamos la carpeta "uploads" si todavía no existe
    await fs.mkdir(IMAGES_FOLDER, { recursive: true })

    // 2. Unimos carpeta + nombre de archivo y guardamos el buffer en disco
    const destinationPath = path.join(IMAGES_FOLDER, fileName)
    await fs.writeFile(destinationPath, file.buffer)

    // 3. Devolvemos la URL pública para guardarla en MongoDB
    return `${API_URL}/${IMAGES_FOLDER}/${fileName}`
}

export const deleteLocalImage = async (imageUrl) => {
    try {
        const fileName = imageUrl.split("/").pop()
        const filePath = path.join(IMAGES_FOLDER, fileName)
        await fs.unlink(filePath)
    } catch {
        // Si el archivo físico ya no existía en disco, ignoramos el error
    }
}
