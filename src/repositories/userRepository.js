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

    async buscarPorEmail(email){
        const usuario = await this.dao.buscarPorEmail(email)
        return usuario
    }

    async obtenerTodosLosUsuarios(){
        const usuarios = await this.dao.obtenerTodosLosUsuarios()
        return usuarios
    }

    async borrarUsuarioPorID(id){
        const usuario = await this.dao.borrarUsuarioPorID(id)
        return usuario
    }

    async buscarUsuarioPorID(id){
        const usuario = await this.dao.buscarUsuarioPorID(id)
        return usuario
    }

    async modificarRol(usuarioViejo, usuarioActualizado){
        const usuario = await this.dao.modificarRol(usuarioViejo, usuarioActualizado)
        return usuario
    }

    async actualizarUltimaConexionGithub(usuario){
        const usuarioNuevo = await this.dao.actualizarUltimaConexionGithub(usuario)
        return usuarioNuevo
    }
}

export const usuariosRepository = new UsuariosRepository(usuarioDao)
//export const usuariosRepository = new UsuariosRepository()