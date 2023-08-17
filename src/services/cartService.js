import { cartRepository } from "../repositories/cartRepository.js";
import { productRepository } from "../repositories/productRepository.js";
import { winstonLogger } from "../utils/winstonLogger.js";

class CartService{
    async obtenerCarrito(id){
        const carrito = await cartRepository.getProducts(id)
        return carrito
    }
    async agregarProductoACarrito(cid, pid){
        const cart = await cartRepository.addProductToCart(cid, pid)
        return cart
    }
    async borrarProductoDelCarrito(cid, pid){
        const cart = await cartRepository.deleteProduct(cid, pid)
        return cart
    }
    async obtenerProductosDeCarrito(cid){
        const carrito = await cartService.obtenerCarrito(cid)
        let productos = []
        for (let i = 0; i < carrito.products.length; i++) {
            productos[i] = await productRepository.obtenerSegunId(carrito.products[i]._id) 
            productos[i] = {
                ...productos[i],
                quantity: carrito.products[i].quantity
            }
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
        let productosComprados = []
        for (let i = 0; i < productos.length; i++) {
            let prodActual = await productRepository.obtenerSegunId(productos[i]._id)
            if(productos[i].quantity >= prodActual.stock){
                winstonLogger.info("La compra NO esta aprobada")
            }else{
                winstonLogger.info("La compra esta aprobada")
                prodActual.stock = prodActual.stock - productos[i].quantity
                productosComprados[i] = await productRepository.reemplzarProducto(prodActual._id, prodActual)
                productosComprados[i] = {
                    ...productosComprados[i],
                    quantity: productos[i].quantity
                }
                let productoBorrado = await cartRepository.deleteProduct(cid, prodActual._id)
            }
        }
        return productosComprados
    }
}

export const cartService = new CartService()