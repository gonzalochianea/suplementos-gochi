import jwt from "jsonwebtoken"
import User from "../models/user.js"
import { AppError } from "../utils/AppError.js"
import { JWT_SECRET, JWT_EXPIRES_IN } from "../utils/config.js"

// 1. Servicio para registrar un nuevo usuario
export const registerUserService = async (data) => {
    // Creamos el usuario en MongoDB
    // El hook pre("save") del modelo se encargará automáticamente de hashear la contraseña
    const newUser = await User.create(data)

    // Convertimos a objeto plano de JS y eliminamos la contraseña para no exponer el hash
    const userResponse = newUser.toObject()
    delete userResponse.password

    return userResponse
}

// 2. Servicio para iniciar sesión y generar el JWT
export const loginUserService = async ({ email, password }) => {
    // Validamos que vengan ambos campos
    if (!email || !password) {
        throw new AppError("Email y contraseña son obligatorios", 400)
    }

    // Buscamos al usuario por su email
    const user = await User.findOne({ email })
    if (!user) {
        throw new AppError("Credenciales inválidas", 401)
    }

    // Comparamos la contraseña en texto plano contra el hash guardado en la DB
    const isValidPassword = await user.verifyPassword(password)
    if (!isValidPassword) {
        throw new AppError("Credenciales inválidas", 401)
    }

    // Generamos el token JWT firmado con el ID y el ROLE del usuario
    const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    )

    // Preparamos los datos del usuario sin el hash
    const userResponse = user.toObject()
    delete userResponse.password

    // Retornamos el token firmado y la información del usuario
    return {
        token,
        user: userResponse
    }
}

