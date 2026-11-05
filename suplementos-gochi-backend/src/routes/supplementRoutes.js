import { Router } from "express"
import {
    getSupplementsController,
    getSupplementByIdController,
    createSupplementController,
    updateSupplementController,
    deleteSupplementController,
    uploadSupplementImageController
} from "../controllers/supplementController.js"
import { verifyToken } from "../middleware/verifyToken.js"
import { allowRoles } from "../middleware/allowRoles.js"
import { uploadImage } from "../middleware/uploadImage.js"

const router = Router()

/**
 * @swagger
 * /api/supplements:
 *   get:
 *     tags: [Supplements]
 *     summary: Listar suplementos (con filtros opcionales)
 *     parameters:
 *       - { in: query, name: name, schema: { type: string } }
 *       - { in: query, name: category, schema: { type: string } }
 *       - { in: query, name: minPrice, schema: { type: number } }
 *       - { in: query, name: maxPrice, schema: { type: number } }
 *     responses:
 *       200: { description: Lista de suplementos }
 *   post:
 *     tags: [Supplements]
 *     summary: Crear un suplemento (Solo Admin)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { example: { name: "BCAA 2000", price: 22000, stock: 30, category: "CATEGORY_ID" } }
 *     responses:
 *       201: { description: Suplemento creado }
 */

// Rutas base: /api/supplements
router.get("/", getSupplementsController)
router.post("/", verifyToken, allowRoles("admin"), createSupplementController)

/**
 * @swagger
 * /api/supplements/{id}:
 *   parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *   get:
 *     tags: [Supplements]
 *     summary: Obtener un suplemento por ID
 *     responses:
 *       200: { description: Suplemento encontrado }
 *   patch:
 *     tags: [Supplements]
 *     summary: Actualizar un suplemento (Solo Admin)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { example: { price: 39000, stock: 45 } }
 *     responses:
 *       200: { description: Suplemento actualizado }
 *   delete:
 *     tags: [Supplements]
 *     summary: Eliminar un suplemento (Solo Admin)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Suplemento eliminado }
 */

// Rutas individuales con parámetro de ruta: /api/supplements/:id
router.get("/:id", getSupplementByIdController)
router.patch("/:id", verifyToken, allowRoles("admin"), updateSupplementController)
router.put("/:id", verifyToken, allowRoles("admin"), updateSupplementController)
router.delete("/:id", verifyToken, allowRoles("admin"), deleteSupplementController)

/**
 * @swagger
 * /api/supplements/{id}/image:
 *   put:
 *     tags: [Supplements]
 *     summary: Subir o reemplazar la imagen de un suplemento (Solo Admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image: { type: string, format: binary }
 *     responses:
 *       200: { description: Imagen subida con éxito }
 */

// Ruta para subir o reemplazar la imagen de un suplemento
router.put("/:id/image", verifyToken, allowRoles("admin"), uploadImage, uploadSupplementImageController)

export default router

