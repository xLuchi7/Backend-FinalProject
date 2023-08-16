import { usuariosService } from "../services/usuarioService.js"
import { validarQueSeanIguales } from "../utils/criptografia.js"
import { winstonLogger } from "../utils/winstonLogger.js"

export async function postSessionsController(req, res, next) {
    //res.status(201).json(req.user)
    //req.logger.info("en app.post adentro de funcion: "+ req.user)
    //console.log("en app.post adentro de funcion: ", req.user)
    try {
        let buscado = await usuariosService.buscarPorEmail(req.body.email)
        if(buscado == null){
            buscado = ""
        }
        let existe
        existe = validarQueSeanIguales(req.body.password, buscado.password)
        if (existe == true) {
            req.logIn(buscado, error => {
                res.status(201).json(req.user)
            })
            const nuevaData = await usuariosService.actualizarUltimoLogout(req.user)
            console.log(nuevaData)
        }
    } catch (error) {
        //res.status(404)
        winstonLogger.error("fallo el login de usuario")
        next(error)
    }
}

export function getCurrentSessionController(req, res, next) {
    // passport guarda la sesion directamente en ** req.user ** en lugar del campo session de la peticion !
    res.json(req.user)
}

export async function deleteCurrentSessionController(req, res, next) {
    //winstonLogger.info("usuario a deslogear: "+req.user.email)

    req.logOut(err => {
        res.sendStatus(200)
    })
}