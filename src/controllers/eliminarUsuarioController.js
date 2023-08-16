import { usuariosService } from "../services/usuarioService.js"

export async function postEliminarUsuario(req, res, next) {
    try {
        const usuarioBorrado = await usuariosService.borrarUsuarioPorID(req.params.uid)
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(404)
    }
}