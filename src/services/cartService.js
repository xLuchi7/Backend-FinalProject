import { cartRepository } from "../repositories/cartRepository.js";
import { productRepository } from "../repositories/productRepository.js";

class CartService{
    async obtenerCarrito(id){
        const carrito = await cartRepository.getProducts(id)
        return carrito
    }
    async agregarProductoACarrito(cid, pid){
        const cart = await cartRepository.addProductToCart(cid, pid)
        return cart
    }
    async obtenerProductosDeCarrito(cid){
        const carrito = await cartService.obtenerCarrito(cid)
        let productos = []
        //let total = 0
        for (let i = 0; i < carrito.products.length; i++) {
            productos[i] = await productRepository.obtenerSegunId(carrito.products[i]._id) 
            productos[i] = {
                ...productos[i],
                quantity: carrito.products[i].quantity
            }
            //total = total + (productos[i].price * productos[i].quantity)
        }
        return productos
    }
    async obtenerTotal(productos){
        let total = 0
        for (let i = 0; i < productos.length; i++) {
            total = total + (productos[i].price * productos[i].quantity)
        }
        return total
    }
    async aprobarCompra(productos, cid){
        //let productosDB = await productRepository.obtenerTodos()
        let productosComprados = []
        for (let i = 0; i < productos.length; i++) {
            let prodActual = await productRepository.obtenerSegunId(productos[i]._id)
            if(productos[i].quantity >= prodActual.stock){
                console.log("LA COMPRA DE: ", productos[i].title, " NO esta aprobada. quantity: ",productos[i].quantity, " stock: ", prodActual.stock)
            }else{
                console.log("LA COMPRA DE: ", productos[i].title, " esta aprobada. quantity: ",productos[i].quantity, " stock: ", prodActual.stock)
                prodActual.stock = prodActual.stock - productos[i].quantity
                console.log("NUEVO STOCK: ", prodActual.stock)
                productosComprados[i] = await productRepository.reemplzarProducto(prodActual._id, prodActual)
                productosComprados[i] = {
                    ...productosComprados[i],
                    quantity: productos[i].quantity
                }
                let productoBorrado = await cartRepository.deleteProduct(cid, prodActual._id)
                console.log("BORRE DEL CARRITO: ", productoBorrado)
            }
        }
        //console.log("AAAA: ", productosComprados)
        return productosComprados
    }
}

export const cartService = new CartService()