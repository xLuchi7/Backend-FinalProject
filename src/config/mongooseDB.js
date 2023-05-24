import mongoose from "mongoose";

export async function conectar(){
    await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
    console.log("base de datos conectada a ecommerce")
}