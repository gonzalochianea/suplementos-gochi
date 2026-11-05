import {
    registerUserService,
    loginUserService
} from "../services/userService.js"

// POST /api/users/register
export const registerUserController = async (req, res) => {
    const user = await registerUserService(req.body)
    res.status(201).json(user)
}

// POST /api/users/login
export const loginUserController = async (req, res) => {
    const result = await loginUserService(req.body)
    res.status(200).json(result)
}

