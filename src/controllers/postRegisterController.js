import { usuariosService } from "../services/usuarioService.js"
import { winstonLogger } from "../utils/winstonLogger.js"

export async function postRegisterController(req, res, next) {
    try {
        const nuevoUsuario = await usuariosService.registrar(req.body)
        req.logIn(nuevoUsuario, error => {
            // if(error){
            //     next(new Error("error al registrarse"))
            // }else{
            //     res.status(201).json(req.user)
            // }
            res.status(201).json(req.user)
        })
    } catch (error) {
        winstonLogger.error("fallo el registro de usuario")
        next(error)
    }
}