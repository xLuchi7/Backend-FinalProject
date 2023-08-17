import { cartService } from "../services/cartService.js"

export async function postProductToCart(req, res, next) {
    try {
        const cart = await cartService.agregarProductoACarrito(req.user.cartID, req.params.pid)
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(404)
    }
}