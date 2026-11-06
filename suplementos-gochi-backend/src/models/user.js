import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        trim: true,
        minlength: [2, "El nombre debe tener al menos 2 caracteres"],
        maxlength: [60, "El nombre no puede superar los 60 caracteres"]
    },
    email: {
        type: String,
        required: [true, "El email es obligatorio"],
        unique: true,
        trim: true,
        lowercase: true, // Guarda siempre en minúsculas para evitar duplicados como Test@test.com
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Por favor ingresá un email con formato válido"
        ]
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"],
        minlength: [8, "La contraseña debe tener al menos 8 caracteres"],
        match: [
            /[A-Z]/,
            "La contraseña debe contener al menos una letra mayúscula"
        ]
    },
    role: {
        type: String,
        enum: {
            values: ["admin", "client"],
            message: "{VALUE} no es un rol válido. Debe ser admin o client"
        },
        default: "client"
    }
}, {
    timestamps: true,
    versionKey: false
})

// Hook pre("save"): Hashea la contraseña automáticamente antes de guardar en la DB
userSchema.pre("save", async function () {
    // Si la contraseña no fue modificada ni es nueva, salimos sin hacer nada
    if (!this.isModified("password")) return
    // Generamos el hash seguro con 10 rondas de salt
    this.password = await bcrypt.hash(this.password, 10)
})

// Método de instancia para comparar la contraseña ingresada en el login con el hash de la DB
userSchema.methods.verifyPassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password)
}

export default mongoose.model("User", userSchema, "users")

