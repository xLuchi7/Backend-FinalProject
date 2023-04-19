import mongoose from "mongoose";

const schemaMessages = new mongoose.Schema({
    fecha:  { type: String },
    autor: { type: String },
    mensaje: { type: String },
}, { versionKey: false })

class productsManager{
    #messagesDB

    constructor(){
        this.#messagesDB = mongoose.model('messages', schemaMessages)
    }

    async guardarMensaje(mensajeNuevo){
        let mensajeGuardado = await this.#messagesDB.create(mensajeNuevo)
        mensajeGuardado = JSON.parse(JSON.stringify(mensajeGuardado))
        return mensajeGuardado
    }
    async obtenerMensajes(){
        const mensajes = await this.#messagesDB.find().lean()
        return mensajes
    }
}

export const MessagesMongooseManager = new productsManager()