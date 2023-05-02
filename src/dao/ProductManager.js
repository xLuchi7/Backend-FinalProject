import fs from 'fs/promises';
import { randomUUID } from 'crypto';
import { Product } from '../entidades/Product.js';

export class ProductManager{

    #ruta
    #products

    constructor(ruta){
        this.#ruta = ruta;
        this.#products = []
    }

    async #leerProductos() {
        const json = await fs.readFile(this.#ruta, 'utf-8');
        this.#products = JSON.parse(json);
    }

    async #escribirProductos() {
        const json = await JSON.stringify(this.#products, null, 2);
        await fs.writeFile(this.#ruta, json);
    }

    async guardarProducto(producto){
        await this.#leerProductos();
        this.#products.push(producto);
        await this.#escribirProductos();
        return producto;
    }

    async buscarProductos(){
        await this.#leerProductos();
        return this.#products;
    }

    async getProductById(id){
        await this.#leerProductos()
        const product = this.#products.find((product) => product.id === id);
        if(!product){
            throw new Error("id no encontrado")
        }
        return product;
    }

    async reemplzarProducto(id, nuevoProducto){
        await this.#leerProductos();
        const indiceBuscado = this.#products.findIndex(c => c.id == id)
        if (indiceBuscado == -1) {
            throw new Error("id no encontrado")
        }
        this.#products[indiceBuscado] = nuevoProducto
        await this.#escribirProductos();
        return nuevoProducto
    }

    async getCantProducts(cant){
        await this.#leerProductos()
        return this.#products.slice(0, cant)
    }

    async addProduct(newProduct){

        const product = this.#products.find((product) => product.code === newProduct.code)

        if(product){

            throw new Error("id no encontrado")

        }else{

            this.#products.push(newProduct)

            //console.log("El producto se creo exitosamente: ");
            //console.log(newProduct);

            await this.#escribirProductos();

        }              

    }

    async borrarProductoPorId(id){
        await this.#leerProductos;
        const indiceBuscado = this.#products.findIndex(c => c.id == id)
        if (indiceBuscado == -1) {
            throw new Error("id no encontrado")
        }
        const [ borrado ] = this.#products.splice(indiceBuscado, 1)
        await this.#escribirProductos()
        return borrado;
    }
}


const products = new ProductManager('./database/products.json');

const product0 = await products.addProduct({
    title: "NoteBookHP",
    description: "Intel I7",
    price: 270000,
    thumbnail: "https://www.fullh4rd.com.ar/img/productos/Pics_Prod/monitor-gamer-27-benq-zowie-xl2731k-dark-grey-0.jpg",
    code: "1",
    stock: "8",
    id: 'dfb5fd4d-3c9d-4f57-b917-593f84dfd1dc'
})
//console.log(product0);

const product1 = await products.addProduct({
    title: "Monitor Gaming",
    description: "240hz 24 pulgadas",
    price: 170000,
    thumbnail: "https://www.fullh4rd.com.ar/img/productos/Pics_Prod/monitor-gamer-27-benq-zowie-xl2731k-dark-grey-0.jpg",
    code: "2",
    stock: "18",
    id: '75c67b27-fb1d-498b-8ff6-358a964cb8f3'
})
//console.log(product1);

const product2 = await products.addProduct({
    title: "Mouse Gaming",
    description: "Razer Viper Mini",
    price: 15000,
    thumbnail: "https://app.contabilium.com/files/explorer/7026/Productos-Servicios/concepto-3346007.jpg",
    code: "3",
    stock: "10",
    id: '67f7f35f-2a6b-492a-a6d7-f8cc8511426a'
})
//console.log(product2);

const product3 = await products.addProduct({
    title: "Mando PS4",
    description: "Control inalambrico",
    price: 12000,
    thumbnail: "https://arsonyb2c.vtexassets.com/arquivos/ids/292249/dualshockblack1.jpg?v=637105416256400000",
    code: "4",
    stock: "14",
    id: '05d6aec9-0f1a-45bc-98fc-899162473f24'
})
//console.log(product3);

const encontrado = await products.getProductById('dfb5fd4d-3c9d-4f57-b917-593f84dfd1dc');
//console.log("El producto fue encontrado y es: ", encontrado);