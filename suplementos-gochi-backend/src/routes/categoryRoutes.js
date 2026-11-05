import { Router } from "express"
import {
    getCategoriesController,
    getCategoryByIdController,
    createCategoryController,
    updateCategoryController,
    deleteCategoryController
} from "../controllers/categoryController.js"
import { verifyToken } from "../middleware/verifyToken.js"
import { allowRoles } from "../middleware/allowRoles.js"

const router = Router()

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: Listar todas las categorías
 *     responses:
 *       200: { description: Lista de categorías }
 *   post:
 *     tags: [Categories]
 *     summary: Crear una categoría (Solo Admin)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { example: { name: "Aminoácidos", description: "BCAA y EAA" } }
 *     responses:
 *       201: { description: Categoría creada }
 */

// Rutas base: /api/categories
router.get("/", getCategoriesController)
router.post("/", verifyToken, allowRoles("admin"), createCategoryController)

/**
 * @swagger
 * /api/categories/{id}:
 *   parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *   get:
 *     tags: [Categories]
 *     summary: Obtener una categoría por ID
 *     responses:
 *       200: { description: Categoría encontrada }
 *   patch:
 *     tags: [Categories]
 *     summary: Actualizar una categoría (Solo Admin)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { example: { description: "Descripción actualizada" } }
 *     responses:
 *       200: { description: Categoría actualizada }
 *   delete:
 *     tags: [Categories]
 *     summary: Eliminar una categoría (Solo Admin)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Categoría eliminada }
 */

// Rutas individuales con parámetro de ruta: /api/categories/:id
router.get("/:id", getCategoryByIdController)
router.patch("/:id", verifyToken, allowRoles("admin"), updateCategoryController)
router.put("/:id", verifyToken, allowRoles("admin"), updateCategoryController)
router.delete("/:id", verifyToken, allowRoles("admin"), deleteCategoryController)

export default router

