import mongoose from "mongoose";
import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = 'products'

export const schemaProducts = new Schema({
    title: { type: String },
    description: { type: String },
    price: { type: Number },
    thumbnail: { type: String },
    code: { type: Number },
    stock: { type: Number },
    id: { type: String },
}, { versionKey: false })

schemaProducts.plugin(mongoosePaginate)
const productModel = model(productCollection, schemaProducts)

export default productModel

class productsManager{
    #productsDB

    constructor(){
        this.#productsDB = mongoose.model('products', schemaProducts)
    }

    async guardar(datosProducts){
        let productGuardado = await this.#productsDB.create(datosProducts)
        productGuardado = JSON.parse(JSON.stringify(productGuardado))
        return productGuardado
    }
    async obtenerTodos(){
        const products = await this.#productsDB.find().lean()
        return products
    }
    async obtenerSegunId(id){
        const product = await this.#productsDB.findById(id).lean()
        return product
    }
    async getCantProducts(cant){
        const products = await this.#productsDB.find().lean()
        return products.slice(0, cant)
    }
    async borrarProductoPorId(id){
        const product = await this.#productsDB.findById(id).lean()
        if (product) {
            await this.#productsDB.deleteOne(product)
        }else{
            throw new Error("id no encontrado")
        }
        return product
    }
    async reemplzarProducto(id, nuevoProducto){
        const product = await this.#productsDB.findById(id).lean()
        if (product) {
            await this.#productsDB.updateOne(product, nuevoProducto)
        }else{
            throw new Error("id no encontrado")
        }
        return nuevoProducto
    }
}

export const ProductMongooseManager = new productsManager()