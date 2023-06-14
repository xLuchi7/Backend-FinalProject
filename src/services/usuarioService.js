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
            role: validarRol(datosUsuario.email)
        })
        await usuariosRepository.createUser(nuevoUsuario)
        return nuevoUsuario
    }
}

export const usuariosService = new UsuariosService()