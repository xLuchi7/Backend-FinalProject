import { usuariosService } from "../services/usuarioService.js"

export async function postCambiarContraController(req, res, next) {
    try {
        const datos = req.body
        //console.log("contra", datos.contra)
        //console.log("confirmar", datos.confirmar)
        console.log("llego el id: ", req.params.uid)
        //const id =  await UsersMongooseManager.buscarIdDeUsuario(req.user)
        //console.log("id: ", id)
        //console.log("biennn")
        if(datos.contra != datos.confirmar){
            res.sendStatus(401)
        }
        const usuarioNew = await usuariosService.cambiarContra(datos.contra, datos.confirmar, req.params.uid)
        res.sendStatus(200)
    } catch (error) {
        next(error)
    }
}