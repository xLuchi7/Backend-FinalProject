import { ticketDao } from "../dao/daoFactory.js";
import { Ticket } from "../models/entidades/Ticket.js";

class TicketsRepository{
    constructor(dao){
        this.dao = dao
    }

    async crearTicket(datos){
        //const ticket = new Ticket(datos)
        return await this.dao.crearTicket(datos)
    }
}

export const ticketsRepository = new TicketsRepository(ticketDao)