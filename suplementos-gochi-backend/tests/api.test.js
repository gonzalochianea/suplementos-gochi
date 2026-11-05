import request from "supertest"
import mongoose from "mongoose"
import app from "../src/app.js"
import User from "../src/models/user.js"
import Category from "../src/models/category.js"
import Supplement from "../src/models/supplement.js"

let adminToken = ""
let clientToken = ""
let categoryId = ""

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/suplementos_gochi_test")
    await Promise.all([User.deleteMany(), Category.deleteMany(), Supplement.deleteMany()])

    await User.create([
        { name: "Admin", email: "admin@test.com", password: "Password123", role: "admin" },
        { name: "Cliente", email: "cliente@test.com", password: "Password123", role: "client" }
    ])

    const resAdmin = await request(app).post("/api/users/login").send({ email: "admin@test.com", password: "Password123" })
    const resClient = await request(app).post("/api/users/login").send({ email: "cliente@test.com", password: "Password123" })
    adminToken = resAdmin.body.token
    clientToken = resClient.body.token
})

afterAll(async () => {
    await mongoose.disconnect()
})

describe("Pruebas de integración API Suplementos Gochi", () => {
    test("1. GET / debe responder 200 (Servidor operativo)", async () => {
        const res = await request(app).get("/")
        expect(res.statusCode).toBe(200)
    })

    test("2. POST /api/categories sin token debe rechazar con 401", async () => {
        const res = await request(app).post("/api/categories").send({ name: "Proteínas" })
        expect(res.statusCode).toBe(401)
    })

    test("3. POST /api/categories con rol client debe rechazar con 403", async () => {
        const res = await request(app).post("/api/categories")
            .set("Authorization", `Bearer ${clientToken}`)
            .send({ name: "Proteínas" })
        expect(res.statusCode).toBe(403)
    })

    test("4. POST /api/categories con rol admin debe crearla con 201", async () => {
        const res = await request(app).post("/api/categories")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ name: "Proteínas", description: "Suero de leche" })
        expect(res.statusCode).toBe(201)
        categoryId = res.body._id
    })

    test("5. Admin crea suplemento (201) y GET público lo lista (200)", async () => {
        const resCreate = await request(app).post("/api/supplements")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ name: "Whey 1kg", price: 35000, stock: 10, category: categoryId })
        expect(resCreate.statusCode).toBe(201)

        const resList = await request(app).get("/api/supplements")
        expect(resList.statusCode).toBe(200)
        expect(resList.body.length).toBe(1)
    })

    test("6. GET /api/supplements/id-invalido debe responder 400 (CastError)", async () => {
        const res = await request(app).get("/api/supplements/id-invalido")
        expect(res.statusCode).toBe(400)
    })
})
