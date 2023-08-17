import { TIPO_PERSISTENCIA } from "../config/dbConfig.js";
import { TicketsManager } from "./MongooseManagers/TicketManager.js";

let cartDao
let mensajesDao
let productsDao
let usuarioDao
let ticketDao

if(TIPO_PERSISTENCIA == 'mongoose'){
    const { cartMongooseManager } = await import('../dao/MongooseManagers/CartManager.js')
    const { MessagesMongooseManager } = await import('../dao/MongooseManagers/MensajesManager.js')
    const { ProductMongooseManager } = await import('../dao/MongooseManagers/ProductMongooseManager.js')
    const { UsersMongooseManager } = await import('./MongooseManagers/userModel.js')
    cartDao = cartMongooseManager
    mensajesDao = MessagesMongooseManager
    productsDao = ProductMongooseManager
    usuarioDao = UsersMongooseManager
    ticketDao = TicketsManager
}else{
    const { ProductMemoriaMJ } = await import('../dao/LocalStorage/ProductManager.js')
    productsDao = ProductMemoriaMJ
}
export { cartDao }
export { mensajesDao }
export { productsDao }
export { usuarioDao }
export { ticketDao }