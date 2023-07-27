import { cartMongooseManager } from "../dao/MongooseManagers/CartManager.js"
import { User } from "../models/entidades/User.js"
import { ErrorArgumentoInvalido } from "../models/errors/ArgumentoInvalidoError.js"
import { usuariosRepository } from "../repositories/userRepository.js"
import { hashear } from "../utils/criptografia.js"
import { validarRol } from "../utils/rol.js"

class UsuariosService{
    async registrar(datosUsuario){
        const id = await cartMongooseManager.createNewCart()
        let nuevoUsuario = new User({
            first_name: datosUsuario.first_name,
            last_name: datosUsuario.last_name,
            email: datosUsuario.email,
            age: datosUsuario.age,
            password: hashear(datosUsuario.password),
            cartID: id,
            role: validarRol(datosUsuario.email),
            last_connection: new Date().toLocaleString(),
            documents: undefined
        })
        await usuariosRepository.createUser(nuevoUsuario)
        return nuevoUsuario
    }

    async cambiarContra(contra, confirmar, id){
        let usuarioActualizado
        if(contra == confirmar){
            console.log("entre al usuarioService")
            usuarioActualizado =  await usuariosRepository.cambiarContra(contra, id)
        }else{
            throw new Error("Las contraseñas no coinciden")
        }
        return usuarioActualizado
    }

    async buscarIdDeUsuario(usuario){
        const id = await usuariosRepository.buscarIdDeUsuario(usuario)
        return id
    }

    async existeEmail(email){
        const usuario = await usuariosRepository.existeEmail(email)
        return usuario
    }

    async actualizarUltimoLogout(usuario){
        const usuarioActualizado = await usuariosRepository.actualizarUltimoLogout(usuario)
        return usuarioActualizado
    }

    async agregarDocumento(id, nombre, link){
        const usuarioActualizado = await usuariosRepository.agregarDocumento(id, nombre, link)
        return usuarioActualizado
    }
}

export const usuariosService = new UsuariosService()