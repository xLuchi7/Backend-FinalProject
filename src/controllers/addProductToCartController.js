import { cartService } from "../services/cartService.js"

export async function postProductToCart(req, res, next) {
    try {
        console.log("llego el pid: ", req.params.pid)
        const cart = await cartService.agregarProductoACarrito(req.user.cartID, req.params.pid)
        console.log("salio todo bien")
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(404)
    }
}