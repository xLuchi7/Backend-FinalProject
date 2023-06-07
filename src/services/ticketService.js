import { Ticket } from "../entidades/Ticket.js"
import { ticketsRepository } from "../repositories/ticketRepository.js"
import { randomUUID } from 'crypto';


class TicketsService{
    async crearTicket(datos){
        const ticket = new Ticket({
            code: randomUUID(),
            purchaseDateTime: new Date().toLocaleString(),
            amount: datos.amount,
            purchaser: datos.purchaser
        })
        return await ticketsRepository.crearTicket(ticket)
    }
}

export const ticketsService = new TicketsService()