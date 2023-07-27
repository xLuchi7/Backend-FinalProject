import { usuarioDao } from "../dao/daoFactory.js";
import { usuarioModel } from "../dao/MongooseManagers/userModel.js";
import { User } from "../models/entidades/User.js";

class UsuariosRepository{
    constructor(dao){
        this.dao = dao
    }

    async createUser(datosUsuario){
        return await this.dao.crearUsuario(datosUsuario)
    }

    async cambiarContra(contra, id){
        return await this.dao.cambiarContra(contra, id)
    }

    async buscarIdDeUsuario(usuario){
        return await this.dao.buscarIdDeUsuario(usuario)
    }

    async existeEmail(email){
        return await this.dao.existeEmail(email)
    }

    async actualizarUltimoLogout(usuario){
        return await this.dao.actualizarUltimoLogout(usuario)
    }

    async agregarDocumento(id, nombre, link){
        const usuarioActualizado = await this.dao.agregarDocumento(id, nombre, link)
        return usuarioActualizado
    }
}

export const usuariosRepository = new UsuariosRepository(usuarioDao)
//export const usuariosRepository = new UsuariosRepository()