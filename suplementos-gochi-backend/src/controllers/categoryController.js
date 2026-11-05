import {
    getCategoriesService,
    getCategoryByIdService,
    createCategoryService,
    updateCategoryService,
    deleteCategoryService
} from "../services/categoryService.js"

// GET /api/categories
export const getCategoriesController = async (req, res) => {
    const categories = await getCategoriesService()
    res.status(200).json(categories)
}

// GET /api/categories/:id
export const getCategoryByIdController = async (req, res) => {
    const category = await getCategoryByIdService(req.params.id)
    if (!category) {
        return res.status(404).json({ error: "No existe esa categoría" })
    }
    res.status(200).json(category)
}

// POST /api/categories
export const createCategoryController = async (req, res) => {
    const newCategory = await createCategoryService(req.body)
    res.status(201).json(newCategory)
}

// PUT o PATCH /api/categories/:id
export const updateCategoryController = async (req, res) => {
    const updatedCategory = await updateCategoryService(req.params.id, req.body)
    if (!updatedCategory) {
        return res.status(404).json({ error: "No existe esa categoría" })
    }
    res.status(200).json(updatedCategory)
}

// DELETE /api/categories/:id
export const deleteCategoryController = async (req, res) => {
    const deletedCategory = await deleteCategoryService(req.params.id)
    if (!deletedCategory) {
        return res.status(404).json({ error: "No existe esa categoría" })
    }
    res.status(200).json({
        message: "Categoría eliminada con éxito",
        category: deletedCategory
    })
}

