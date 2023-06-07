import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    password: { type: String },
    cartID: { type: String, unique: true },
    role: { type: String }
}, { versionKey: false })

export const usuarioModel = mongoose.model('usuarios', usuarioSchema)
