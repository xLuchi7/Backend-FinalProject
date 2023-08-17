import { usuariosService } from "../services/usuarioService.js"
import { validarQueSeanIguales } from "../utils/criptografia.js"
import { winstonLogger } from "../utils/winstonLogger.js"

export async function postSessionsController(req, res, next) {
    try {
        let buscado = await usuariosService.buscarPorEmail(req.body.email)
        if(buscado == null){
            buscado = ""
        }
        let existe
        existe = validarQueSeanIguales(req.body.password, buscado.password)
        if (existe == true) {
            const nuevaData = await usuariosService.actualizarUltimoLogout(buscado)
            req.logIn(nuevaData, error => {
                res.status(201).json(req.user)
            })
        }
    } catch (error) {
        winstonLogger.error("fallo el login de usuario")
        next(error)
    }
}

export function getCurrentSessionController(req, res, next) {
    res.json(req.user)
}

export async function deleteCurrentSessionController(req, res, next) {
    req.logOut(err => {
        res.sendStatus(200)
    })
}