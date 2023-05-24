import { chatRepository } from "../repositories/chatRepository.js";

class ChatService{

    async guardarMensaje(msj){
        const mensaje = await chatRepository.guardarMensaje(msj)
        return mensaje
    }
    async obtenerMensajes(){
        const mensajes = await chatRepository.obtenerMensajes()
        return mensajes
    }
}

export const chatService = new ChatService()