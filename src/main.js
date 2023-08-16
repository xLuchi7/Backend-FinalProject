import express from 'express';
import { engine } from 'express-handlebars';
import { Server as SocketIOServer } from 'socket.io';
import { ProductManager } from './dao/LocalStorage/ProductManager.js';
import { randomUUID } from 'crypto';
import fs from 'fs';
import { apiRouter } from './routers/apiRouter.js';
import { ProductMongooseManager } from './dao/MongooseManagers/ProductMongooseManager.js';
import { MessagesMongooseManager } from './dao/MongooseManagers/MensajesManager.js';
import { conectar } from './config/mongooseDB.js';
import productModel from './dao/MongooseManagers/ProductMongooseManager.js';
import mongoosePaginate from "mongoose";
import { paginate } from 'mongoose-paginate-v2';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { autenticacion } from './utils/autenticacion.js';
import { redireccion } from './utils/redireccion.js';
import { yaLogueado } from './utils/yaLogueado.js';
import passport from 'passport'
import { hashear, validarQueSeanIguales } from './utils/criptografia.js';
import { autenticacionGithub, autenticacionGithub_CB, passportInitialize, passportSession } from './middlewares/passport.js';
import { autenticacionUserPass } from "./middlewares/passport.js";
import { postSessionsController } from "./controllers/sessionController.js";
import { validarRol } from './utils/rol.js';
import { cartMongooseManager } from './dao/MongooseManagers/CartManager.js';
import { viewsRouter } from './routers/viewsRouter.js';
import { productService } from './services/productService.js';
import { chatService } from './services/chatService.js';
import { ErrorHandler } from './middlewares/ErrorHandler.js';
import { Product } from './models/entidades/Product.js';
import { nextTick } from 'process';
import { logger } from './middlewares/logger.js';
import { winstonLogger } from './utils/winstonLogger.js';
import { docsRouter } from './routers/documentacionRouter.js';
import Swal from 'sweetalert2';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import Handlebars from "handlebars"

await conectar()
//conectar()

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "SESSION_SECRET",
    saveUninitialized: false,
    resave: false,
    //store: MongoStore.create({mongoUrl: 'mongodb://127.0.0.1:27017/ecommerce'}),
    store: MongoStore.create({mongoUrl: 'mongodb+srv://luciano:probando22@cluster0.r1ikgz0.mongodb.net/?retryWrites=true&w=majority'}),
}))

app.use(passportInitialize, passportSession)

app.use(logger)

app.engine('handlebars', engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}))
app.set('views', './views')
app.set('view engine', 'handlebars')

app.use(express.static('./public'))
app.use('/', express.static('./static/images'))

export const server = app.listen(8080);

const io = new SocketIOServer(server)

// app.use(session({
//     //store: MongoStore.create({mongoUrl: 'mongodb://127.0.0.1:27017/ecommerce'}),
//     store: MongoStore.create({mongoUrl: 'mongodb+srv://luciano:probando22@cluster0.r1ikgz0.mongodb.net/?retryWrites=true&w=majority'}),
//     saveUninitialized: false,
//     resave: false,
//     secret: "SESSION_SECRET"
// }))

//ACA IBA EL LOGIN CON GITHUB

io.on('connection', async clientSocket => {
    clientSocket.on('agregarAlCarrito', async datos => {
        //io.sockets.emit('actualizarProductos', await ProductMongooseManager.obtenerTodos())
    })

    //io.sockets.emit('productos', await ProductMongooseManager.obtenerTodos())
    //io.sockets.emit('actualizarProductos', await ProductMongooseManager.obtenerTodos())
})

//ACA IBA LOGIN

//ACA IBA LOGIN POST

//ACA IBA REGISTER

//ACA IBA REGISTER POST

//ACA IBA PROFILE

//ACA IBA PROFILE POST

//ACA IBA DELETE SESION

io.on('connection', async clientSocket => {
    winstonLogger.info("nuevo cliente conectado "+clientSocket.id)
    // clientSocket.on('nuevoProducto', async product => {
    //     try {
    //         const producto = new Product(product)
    //         await productService.guardarProducto(producto)
    //         io.sockets.emit('actualizarProductos', await productService.obtenerProductos())
    //     } catch (error) {
    //         //alert("No se pudo crear el producto")
    //         console.log("fallo agregar")
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Error',
    //             text: 'No se pudo crear el producto'
    //         })
    //         //ErrorHandler(error)
    //         //next(error)
    //     }
    // })
    clientSocket.on('nuevoProducto', async (product, callback) => {
        try {
            const producto = new Product(product)
            await productService.guardarProducto(producto)
            //io.sockets.emit('actualizarProductos', await productService.obtenerProductos())
            callback({ success: true })
        } catch (error) {
            callback({ success: false, error: "error al crear el producto" })
        }
    })

    io.sockets.emit('productos', await productService.obtenerProductos())
    io.sockets.emit('actualizarProductos', await productService.obtenerProductos())
})

//ACA IBA PRODUCTS

//ACA IBA REAL TIME PRODUCTS

io.on('connection', async clientSocket => {
    console.log("nuevo cliente conectado ", clientSocket.id)
    clientSocket.on("nuevoMensaje", async mensaje => {
        await chatService.guardarMensaje({
            fecha: new Date().toLocaleString(),
            ...mensaje
        })
        io.sockets.emit("actualizarMensajes", await chatService.obtenerMensajes())
    })

    clientSocket.on('nuevoUsuario', async nombreUsuario => {
        clientSocket.broadcast.emit('nuevoUsuario', nombreUsuario)
    })

    io.sockets.emit('actualizarMensajes', await chatService.obtenerMensajes())
})

//ACA IBA CHAT

app.use('/', apiRouter)
//app.use(ErrorHandler)
app.use('/', viewsRouter)
app.use('/', docsRouter)