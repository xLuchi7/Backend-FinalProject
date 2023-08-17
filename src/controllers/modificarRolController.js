import { usuariosService } from "../services/usuarioService.js"

export async function postModificarRol(req, res, next) {
    try {
        const usuario = await usuariosService.buscarUsuarioPorID(req.params.uid)
        let usuarioActualizado
        if(usuario.role == "user"){
            usuarioActualizado = {
                first_name: usuario.first_name,
                last_name: usuario.last_name,
                email: usuario.email,
                age: usuario.age,
                password: usuario.password,
                cartID: usuario.cartID,
                role: "premium",
                last_connection: usuario.last_connection,
                documents: usuario.documents
            }
        }else{
            usuarioActualizado = {
                first_name: usuario.first_name,
                last_name: usuario.last_name,
                email: usuario.email,
                age: usuario.age,
                password: usuario.password,
                cartID: usuario.cartID,
                role: "user",
                last_connection: usuario.last_connection,
                documents: usuario.documents
            }
        }
        
        await usuariosService.modificarRol(usuario, usuarioActualizado)
        //console.log("usuario modificado: ", usuarioModificado)
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(404)
    }
}