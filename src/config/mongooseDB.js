import mongoose from "mongoose";
import { winstonLogger } from "../utils/winstonLogger.js";

export async function conectar(){
    await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
    winstonLogger.info("base de datos conectada a ecommerce")
}