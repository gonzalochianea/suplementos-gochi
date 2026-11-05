import mongoose from "mongoose"
import { connectDB } from "./db.js"
import Category from "./models/category.js"
import Supplement from "./models/supplement.js"
import User from "./models/user.js"
import fs from "fs/promises"

await connectDB()
await Supplement.deleteMany()
await Category.deleteMany()
await User.deleteMany()

await User.create([
    { name: "Admin Gochi", email: "admin@gochi.com", password: "Password123", role: "admin" },
    { name: "Cliente Gochi", email: "cliente@gochi.com", password: "Password123", role: "client" }
])

const [proteins, creatines, preworkouts, aminoacids, vitamins, bars] = await Category.create([
    { name: "Proteínas", description: "Proteínas concentradas, aisladas y vegetales" },
    { name: "Creatinas", description: "Creatinas monohidratadas y micronizadas" },
    { name: "Pre-entrenos", description: "Fórmulas de energía, óxido nítrico y enfoque" },
    { name: "Aminoácidos", description: "BCAA, EAA y glutamina para recuperación muscular" },
    { name: "Vitaminas", description: "Multivitamínicos, colágeno, magnesio y omega 3" },
    { name: "Barritas", description: "Barras proteicas, pancakes y snacks saludables" }
])

const categoryMap = {
    proteinas: proteins._id,
    creatinas: creatines._id,
    "pre-entrenos": preworkouts._id,
    aminoacidos: aminoacids._id,
    vitaminas: vitamins._id,
    barritas: bars._id
}

const data = JSON.parse(await fs.readFile("./src/db.json", "utf-8"))

const supplements = data.products.map(p => ({
    name: p.name.slice(0, 120),
    description: p.description,
    price: p.price,
    stock: p.quantity,
    available: p.status === "AVAILABLE",
    image: p.image,
    category: categoryMap[p.category]
}))

await Supplement.create(supplements)

console.log(`Base de datos poblada con éxito (${supplements.length} suplementos)`)
await mongoose.disconnect()
