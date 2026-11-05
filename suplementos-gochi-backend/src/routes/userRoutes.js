import { Router } from "express"
import {
    registerUserController,
    loginUserController
} from "../controllers/userController.js"

const router = Router()

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags: [Users]
 *     summary: Registrar un nuevo usuario
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { example: { name: "Juan", email: "juan@gochi.com", password: "Password123" } }
 *     responses:
 *       201: { description: Usuario registrado con éxito }
 * /api/users/login:
 *   post:
 *     tags: [Users]
 *     summary: Iniciar sesión y obtener token JWT
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { example: { email: "admin@gochi.com", password: "Password123" } }
 *     responses:
 *       200: { description: Login exitoso (devuelve el token JWT) }
 */

// Rutas públicas de autenticación
router.post("/register", registerUserController)
router.post("/login", loginUserController)

export default router

