import { mensajesDao } from "../dao/daoFactory.js";
import { MessagesMongooseManager } from "../dao/MongooseManagers/MensajesManager.js";

class ChatRepository{
    constructor(dao){
        this.dao = dao
    }

    async guardarMensaje(msj){
        const mensaje = await this.dao.guardarMensaje(msj)
        return mensaje
    }
    async obtenerMensajes(){
        const mensajes = await this.dao.obtenerMensajes()
        return mensajes
    }
}

export const chatRepository = new ChatRepository(mensajesDao)
