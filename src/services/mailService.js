import { createTransport } from "nodemailer";
import { winstonLogger } from "../utils/winstonLogger";

const CREDENCIALES_MAIL = {
    user: 'sessaregoluchi7@gmail.com',
    pass: 'bewclugwuhyunktd'
}

class EmailService{
    #clientNodemailer

    constructor(credenciales){
        this.#clientNodemailer = createTransport({
            service: "gmail",
            //port: 587,
            auth: credenciales
        })
    }

    async sendMail(destinatario, mensaje){
        const mailConfig = {
            from: "sessaregoluchi7@gmail.com",
            to: destinatario,
            subject: "Venta Gamer",
            text: mensaje
        }
        try {
            const info = await this.#clientNodemailer.sendMail(mailConfig)
            return info
        } catch (error) {
            winstonLogger.info("error al mandar el mail a: ", destinatario)
        }
    }
}

export const emailService = new EmailService(CREDENCIALES_MAIL)