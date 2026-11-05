import Category from "../models/category.js"
import Supplement from "../models/supplement.js"
import { AppError } from "../utils/AppError.js"

// 1. Obtener todas las categorías ordenadas por nombre
export const getCategoriesService = async () => {
    return await Category.find().sort({ name: 1 })
}

// 2. Obtener una categoría por su ID
export const getCategoryByIdService = async (id) => {
    return await Category.findById(id)
}

// 3. Crear una nueva categoría
export const createCategoryService = async (data) => {
    return await Category.create(data)
}

// 4. Actualizar una categoría existente
export const updateCategoryService = async (id, data) => {
    return await Category.findByIdAndUpdate(
        { _id: id },
        data,
        { returnDocument: "after", runValidators: true }
    )
}

// 5. Eliminar una categoría por su ID
export const deleteCategoryService = async (id) => {
    const category = await Category.findById(id)
    if (!category) {
        return null
    }

    // Verificamos si hay suplementos que usen esta categoría
    const supplementsCount = await Supplement.countDocuments({ category: id })

    if (supplementsCount > 0) {
        throw new AppError(`No se puede eliminar la categoría: tiene ${supplementsCount} suplemento(s) asociado(s)`, 409)
    }

    await category.deleteOne()
    return category
}

