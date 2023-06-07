import { usuarioDao } from "../dao/daoFactory.js";
import { usuarioModel } from "../dao/MongooseManagers/userModel.js";
import { User } from "../entidades/User.js";

class UsuariosRepository{
    constructor(dao){
        this.dao = dao
    }

    async createUser(datosUsuario){
        let nuevoUsuario = new User(datosUsuario)
        //return usuarioModel.create(nuevoUsuario)
        return await this.dao.create(nuevoUsuario)
    }
}

export const usuariosRepository = new UsuariosRepository(usuarioDao)
//export const usuariosRepository = new UsuariosRepository()