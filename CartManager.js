import fs from 'fs/promises';
import { randomUUID } from 'crypto';
import { Cart } from './Cart.js';

export class CartManager{

    #rutaCart
    #rutaProduct
    #carts
    #products

    constructor(rutaCart, rutaProduct){
        this.#rutaCart = rutaCart;
        this.#rutaProduct =  rutaProduct;
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

const cart = new CartManager('./database/carrito.json');
