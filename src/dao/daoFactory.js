import { TIPO_PERSISTENCIA } from "../config/dbConfig.js";
import { TicketsManager } from "./MongooseManagers/TicketManager.js";
import { usuarioModel } from "./MongooseManagers/userModel.js";

let cartDao
let mensajesDao
let productsDao
let usuarioDao
let ticketDao

if(TIPO_PERSISTENCIA == 'mongoose'){
    console.log("VOY A USAR MONGOOSE")
    const { cartMongooseManager } = await import('../dao/MongooseManagers/CartManager.js')
    const { MessagesMongooseManager } = await import('../dao/MongooseManagers/MensajesManager.js')
    const { ProductMongooseManager } = await import('../dao/MongooseManagers/ProductMongooseManager.js')
    const { usuarioModel } = await import('./MongooseManagers/userModel.js')
    cartDao = cartMongooseManager
    mensajesDao = MessagesMongooseManager
    productsDao = ProductMongooseManager
    usuarioDao = usuarioModel
    ticketDao = TicketsManager
}else{
    console.log("VOY A USAR MEMORIA")
    const { ProductMemoriaMJ } = await import('../dao/LocalStorage/ProductManager.js')
    productsDao = ProductMemoriaMJ
}
export { cartDao }
export { mensajesDao }
export { productsDao }
export { usuarioDao }
export { ticketDao }