import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre de la categoría es obligatorio"],
        unique: true,
        trim: true,
        minlength: [3, "El nombre debe tener al menos 3 caracteres"],
        maxlength: [60, "El nombre no puede tener más de 60 caracteres"]
    },
    description: {
        type: String,
        trim: true,
        maxlength: [200, "La descripción no puede superar los 200 caracteres"],
        default: ""
    }
}, {
    timestamps: true,
    versionKey: false // Oculta el campo __v que genera Mongoose por defecto
})

export default mongoose.model("Category", categorySchema, "categories")

