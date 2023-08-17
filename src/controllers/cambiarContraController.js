import { usuariosService } from "../services/usuarioService.js"

export async function postCambiarContraController(req, res, next) {
    try {
        const datos = req.body
        if(datos.contra != datos.confirmar){
            res.sendStatus(401)
        }
        const usuarioNew = await usuariosService.cambiarContra(datos.contra, datos.confirmar, req.params.uid)
        res.sendStatus(200)
    } catch (error) {
        next(error)
    }
}