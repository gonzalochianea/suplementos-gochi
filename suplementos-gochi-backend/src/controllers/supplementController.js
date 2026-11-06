import {
    getSupplementsService,
    getSupplementByIdService,
    createSupplementService,
    updateSupplementService,
    deleteSupplementService
} from "../services/supplementService.js"
import { saveImage, deleteImage } from "../services/storageService.js"

// GET /api/supplements (con filtros opcionales por req.query)
export const getSupplementsController = async (req, res) => {
    const supplements = await getSupplementsService(req.query)
    res.status(200).json(supplements)
}

// GET /api/supplements/:id
export const getSupplementByIdController = async (req, res) => {
    const supplement = await getSupplementByIdService(req.params.id)
    if (!supplement) {
        return res.status(404).json({ error: "No existe ese suplemento" })
    }
    res.status(200).json(supplement)
}

// POST /api/supplements
export const createSupplementController = async (req, res) => {
    const newSupplement = await createSupplementService(req.body)
    res.status(201).json(newSupplement)
}

// PUT o PATCH /api/supplements/:id
export const updateSupplementController = async (req, res) => {
    const updatedSupplement = await updateSupplementService(req.params.id, req.body)
    if (!updatedSupplement) {
        return res.status(404).json({ error: "No existe ese suplemento" })
    }
    res.status(200).json(updatedSupplement)
}

// DELETE /api/supplements/:id
export const deleteSupplementController = async (req, res) => {
    const deletedSupplement = await deleteSupplementService(req.params.id)
    if (!deletedSupplement) {
        return res.status(404).json({ error: "No existe ese suplemento" })
    }
    if (deletedSupplement.image) {
        await deleteImage(deletedSupplement.image)
    }
    res.status(200).json({
        message: "Suplemento eliminado con éxito",
        supplement: deletedSupplement
    })
}

// PUT /api/supplements/:id/image
export const uploadSupplementImageController = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Debés enviar un archivo en el campo 'image'" })
    }

    const supplement = await getSupplementByIdService(req.params.id)
    if (!supplement) {
        return res.status(404).json({ error: "No existe ese suplemento" })
    }

    // Si ya tenía una imagen previa, la eliminamos para no dejar archivos huérfanos
    if (supplement.image) {
        await deleteImage(supplement.image)
    }

    const imageUrl = await saveImage(req.file)
    const updatedSupplement = await updateSupplementService(req.params.id, { image: imageUrl })

    res.status(200).json(updatedSupplement)
}

