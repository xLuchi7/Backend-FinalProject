import mongoose from "mongoose";

const schemaTickets = new mongoose.Schema({
    code: { type: String },
    purchaseDateTime: { type: String },
    amount: { type: Number },
    purchaser: { type: String },
}, { versionKey: false })

class ticketsManager{
    #ticketsDB

    constructor(){
        this.#ticketsDB = mongoose.model('tickets', schemaTickets)
    }

    async crearTicket(datos){
        const ticketNuevo = await this.#ticketsDB.create(datos)
        return ticketNuevo
    }
}

export const TicketsManager = new ticketsManager()