import { ServerApiVersion } from "mongodb";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import { winstonLogger } from "../utils/winstonLogger.js";

export async function conectar(){
    const uri = "mongodb+srv://luciano:probando22@cluster0.r1ikgz0.mongodb.net/?retryWrites=true&w=majority"
    await mongoose.connect(uri)
    //await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
}