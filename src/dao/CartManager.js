import fs from 'fs/promises';
import { randomUUID } from 'crypto';
import { Cart } from '../Cart.js';
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
    async addProductToCartt(cid, pid){
        const carts = await this.#rutaCart.find().lean()
        const products = await this.#rutaProduct.find().lean()
        //await this.#leerCarrito()
        //await this.#leerProducts()
        const product = await this.#rutaProduct.findById(pid).lean()
        const cart = await this.#rutaCart.findById(cid).lean()

        console.log(product)
        console.log(cart)
        await cart.products.push({ id: product.id, quantity: 1 })
        console.log("cart despues", cart)
        
        return product
        // const index = this.#rutaCart[cart].products.findIndex((prod) => prod.id === pid)
        // if (index !== -1) {
        //     this.#rutaCart[cart].products.splice(index, 1, {...this.#rutaCart[cart].products[index], quantity: this.#rutaCart[cart].products[index].quantity + 1})
        //     //await this.#escribirCarrito()
        //     return this.#rutaCart[cart].products
        // }else{
        //     this.#rutaCart[cart].products.push({ id: product.id, quantity: 1 })
        //     //await this.#escribirCarrito()
        //     return this.#rutaCart[cart].products
        // }
        
    }

    async #leerProducts() {
        const json = await fs.readFile(this.#rutaProduct, 'utf-8');
        this.#products = JSON.parse(json);
    }

    async #leerCarrito() {
        const json = await fs.readFile(this.#rutaCart, 'utf-8');
        this.#carts = JSON.parse(json);
    }

    async #escribirCarrito() {
        const json = await JSON.stringify(this.#carts, null, 2);
        await fs.writeFile(this.#rutaCart, json);
    }

    async createCart(){
        await this.#leerCarrito();
        const newCart = new Cart({
            id: randomUUID(),
            products: []
        })
        this.#carts.push(newCart)
        await this.#escribirCarrito();
        return newCart
    }

    async getProducts(id){
        await this.#leerCarrito();
        const carrito = this.#carts.find((cart) => cart.id === id);
        return carrito.products
    }

    async verCarrito(){
        await this.#leerCarrito();
        return this.#carts;
    }

    async addProductToCart(cid, pid){
        await this.#leerCarrito()
        await this.#leerProducts()
        const product = this.#products.find((prod) => prod.id === pid)
        const cart = this.#carts.findIndex((cart) => cart.id === cid)
        console.log(this.#carts)
        const index = this.#carts[cart].products.findIndex((prod) => prod.id === pid)
        if (index !== -1) {
            this.#carts[cart].products.splice(index, 1, {...this.#carts[cart].products[index], quantity: this.#carts[cart].products[index].quantity + 1})
            await this.#escribirCarrito()
            return this.#carts[cart].products
        }else{
            this.#carts[cart].products.push({ id: product.id, quantity: 1 })
            await this.#escribirCarrito()
            return this.#carts[cart].products
        }
        
    }

}

export const cartMongooseManager = new CartManager();
