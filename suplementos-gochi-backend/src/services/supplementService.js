import Supplement from "../models/supplement.js"
import Category from "../models/category.js"
import { AppError } from "../utils/AppError.js"

// 1. Validar que la categoría exista antes de asociarla a un suplemento
export const verifyCategoryService = async (categoryId) => {
    if (!categoryId) return

    const exists = await Category.exists({ _id: categoryId })
    if (!exists) {
        throw new AppError(`No existe ninguna categoría con el ID ${categoryId}`, 400)
    }
}

// 2. Listar suplementos con filtros dinámicos y populate
export const getSupplementsService = async ({ name, category, available, minPrice, maxPrice, sort } = {}) => {
    const filter = {}

    // Búsqueda por texto parcial e insensible a mayúsculas/minúsculas
    if (name) {
        filter.name = { $regex: name, $options: "i" }
    }

    // Filtrar por ID de categoría
    if (category) {
        filter.category = category
    }

    // Filtrar por disponibilidad (true / false)
    if (available !== undefined) {
        filter.available = available === "true" || available === true
    }

    // Filtrar por rango de precio (mayor o igual / menor o igual)
    if (minPrice || maxPrice) {
        filter.price = {}
        if (minPrice) filter.price.$gte = Number(minPrice)
        if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    const direction = sort === "desc" || sort === "-1" ? -1 : 1

    return await Supplement.find(filter)
        .populate("category", "name description")
        .sort({ name: direction })
}

// 3. Obtener un suplemento por su ID con populate
export const getSupplementByIdService = async (id) => {
    return await Supplement.findById(id).populate("category", "name description")
}

// 4. Crear un suplemento
export const createSupplementService = async (data) => {
    // Validamos primero que la categoría exista
    await verifyCategoryService(data.category)

    const supplement = await Supplement.create(data)
    return await supplement.populate("category", "name description")
}

// 5. Actualizar un suplemento existente
export const updateSupplementService = async (id, data) => {
    // Si en los datos enviaron una categoría nueva, validamos que exista
    if (data.category) {
        await verifyCategoryService(data.category)
    }

    return await Supplement.findByIdAndUpdate(
        { _id: id },
        data,
        { returnDocument: "after", runValidators: true }
    ).populate("category", "name description")
}

// 6. Eliminar un suplemento por su ID
export const deleteSupplementService = async (id) => {
    return await Supplement.findByIdAndDelete(id)
}

