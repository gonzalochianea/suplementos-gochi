import mongoose from "mongoose"

const supplementSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre del suplemento es obligatorio"],
        trim: true,
        minlength: [2, "El nombre debe tener al menos 2 caracteres"],
        maxlength: [120, "El nombre no puede superar los 120 caracteres"]
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, "La descripción no puede superar los 500 caracteres"],
        default: ""
    },
    price: {
        type: Number,
        required: [true, "El precio es obligatorio"],
        min: [0, "El precio no puede ser negativo"]
    },
    stock: {
        type: Number,
        required: [true, "El stock es obligatorio"],
        min: [0, "El stock no puede ser negativo"],
        validate: {
            validator: Number.isInteger,
            message: "El stock debe ser un número entero"
        }
    },
    available: {
        type: Boolean,
        default: true
    },
    // Referencia relacional a la colección de Categories
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "La categoría es obligatoria"]
    },
    // Campo para la foto (almacenamiento local o Supabase Storage)
    image: {
        type: String,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false
})

export default mongoose.model("Supplement", supplementSchema, "supplements")

