import fs from 'fs/promises';
import { randomUUID } from 'crypto';
import { Cart } from '../entidades/Cart.js';
import mongoose from "mongoose";
import { Schema, model } from 'mongoose';
import { schemaProducts } from './ProductMongooseManager.js';

const schemaCart = new Schema({
    id: { type: String },
    products: { type: Array }
}, { versionKey:false })

export class CartManager{

    #rutaCart
    #rutaProduct
    #carts
    #products

    constructor(){
        this.#rutaCart = mongoose.model('cart', schemaCart)
        this.#rutaProduct =  mongoose.model('products', schemaProducts)
    }

    async createNewCart(){
        const newCart = new Cart({
            products: []
        })
        let nuevoCarrito = await this.#rutaCart.create(newCart)
        nuevoCarrito = JSON.parse(JSON.stringify(nuevoCarrito))
        return nuevoCarrito
    }
    async addProductToCart(cid, pid){
        const product = await this.#rutaProduct.findById(pid).lean()
        const cart = await this.#rutaCart.findById(cid).lean()
        const carritoViejo = await this.#rutaCart.findById(cid).lean()
        let bandera = false;

        for (let i = 0; i < cart.products.length; i++) {
            if (cart.products[i]._id == pid) {
                cart.products[i].quantity++
                await this.#rutaCart.updateOne(carritoViejo, cart)
                bandera = true
            }
        }
        if (bandera == false) {
            await cart.products.push({ _id: product._id, quantity: 1 })
            await this.#rutaCart.updateOne(carritoViejo, cart)
        }
        return cart
    }
    async getProducts(id){
        const carrito = await this.#rutaCart.findById(id).lean()
        return carrito
    }
    async deleteProduct(cid, pid){
        const product = await this.#rutaProduct.findById(pid).lean()
        const cart = await this.#rutaCart.findById(cid).lean()
        const carritoViejo = await this.#rutaCart.findById(cid).lean()
        const products = cart.products
        const aString = product._id.toString()
        const index = products.findIndex(product => product._id.toString() === aString);
        cart.products.splice(index, 1)
        if (product) {
            await this.#rutaCart.updateOne(carritoViejo, cart)
        }else{
            throw new Error("el id o carrito no fue encontrado")
        }
        return cart
    }
    async deleteCart(cid){
        const cart = await this.#rutaCart.findById(cid).lean()
        if (cart) {
            await this.#rutaCart.deleteOne(cart)
        }else{
            throw new Error("el carrito no fue encontrado")
        }
       
        return cart
    }
    async updateQuantity(cid, pid, qty){
        const carritoViejo = await this.#rutaCart.findById(cid).lean()
        const cart = await this.#rutaCart.findById(cid).lean()
        const product = await this.#rutaProduct.findById(pid).lean()
        const products = cart.products
        const aString = product._id.toString()
        const index = products.findIndex(product => product._id.toString() === aString);
        cart.products.splice(index, 1)
        const entero = parseInt(qty)
        await cart.products.push({ _id: product._id, quantity: entero })

        if (cart) {
            await this.#rutaCart.updateOne(carritoViejo, cart)
        }else{
            throw new Error("el carrito no fue encontrado")
        }

        return cart
    }
}

export const cartMongooseManager = new CartManager();
