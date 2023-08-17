import express from 'express';
import { engine } from 'express-handlebars';
import { Server as SocketIOServer } from 'socket.io';
import { apiRouter } from './routers/apiRouter.js';
import { conectar } from './config/mongooseDB.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { passportInitialize, passportSession } from './middlewares/passport.js';
import { viewsRouter } from './routers/viewsRouter.js';
import { productService } from './services/productService.js';
import { chatService } from './services/chatService.js';
import { Product } from './models/entidades/Product.js';
import { logger } from './middlewares/logger.js';
import { winstonLogger } from './utils/winstonLogger.js';
import { docsRouter } from './routers/documentacionRouter.js';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import Handlebars from "handlebars"
import { PORT } from './config/serverConfig.js';
import { jsonRouter } from './routers/jsonRouter/jsonRouter.js';

await conectar()

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

export const server = app.listen(PORT, () => {
    winstonLogger.info(`servidor escuchando en puerto ${PORT}`)
});

app.use('/api', apiRouter)
app.use('/', viewsRouter)
app.use('/', docsRouter)
app.use('/', jsonRouter)

//SOCKET SERVER

const io = new SocketIOServer(server)

io.on('connection', async clientSocket => {
    winstonLogger.info("nuevo cliente conectado "+clientSocket.id)
    clientSocket.on('nuevoProducto', async (product, callback) => {
        try {
            const producto = new Product(product)
            await productService.guardarProducto(producto)
            callback({ success: true })
        } catch (error) {
            callback({ success: false, error: "error al crear el producto" })
        }
    })

    io.sockets.emit('productos', await productService.obtenerProductos())
    io.sockets.emit('actualizarProductos', await productService.obtenerProductos())
})

io.on('connection', async clientSocket => {
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