import express from 'express';
import { engine } from 'express-handlebars';
import { Server as SocketIOServer } from 'socket.io';
import { ProductManager } from './dao/ProductManager.js';
import { Product } from './Product.js';
import { randomUUID } from 'crypto';
import fs from 'fs';
import { apiRouter } from './routers/apiRouter.js';
import { ProductMongooseManager } from './dao/ProductMongooseManager.js';
import { MessagesMongooseManager } from './dao/MensajesManager.js';
import { conectar } from '../database/mongooseDB.js';
import productModel from './dao/ProductMongooseManager.js';
import mongoosePaginate from "mongoose";
import { paginate } from 'mongoose-paginate-v2';

await conectar()

const app = express();

app.engine('handlebars', engine())
app.set('views', './views')
app.set('view engine', 'handlebars')

app.use(express.static('./public'))

const server = app.listen(8080);

const io = new SocketIOServer(server)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.on('connection', async clientSocket => {
    console.log("nuevo cliente conectado ", clientSocket.id)
    clientSocket.on('nuevoProducto', async product => {
        console.log("soy el producto: ",product)
        await ProductMongooseManager.guardar(product)
        io.sockets.emit('actualizarProductos', await ProductMongooseManager.obtenerTodos())
    })

    io.sockets.emit('productos', await ProductMongooseManager.obtenerTodos())
    io.sockets.emit('actualizarProductos', await ProductMongooseManager.obtenerTodos())
})

app.get('/', async (req,res) => {

    const sortValue = req.query.sort
    let sortNumber

    if (sortValue == 'asc') {
        sortNumber = 1
    }
    if (sortValue == 'desc') {
        sortNumber = -1
    }

    const criterioBusqueda = {}
    const opcionesPaginacion = {
        sort: {price: sortNumber},
        lean: true,
        limit: req.query.limit ?? 4,
        page: req.query.page ?? 1,
    }

    const result = await productModel.paginate(criterioBusqueda, opcionesPaginacion)

    res.render('products', { 
        pageTitle: 'Products',
        hayArray: result.docs.length > 0,
        array: result.docs,
        limit: result.limit,
        page: result.page,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        nextPage: result.nextPage,
        hasPrevPage: result.hasPrevPage,
        prevPage: result.prevPage,
        pagingCounter: result.pagingCounter,
        sortValue
    })
})

app.get('/realtimeproducts', async (req,res) => {
    const productos = await ProductMongooseManager.obtenerTodos()
    res.render('realtimeproducts', { 
        pageTitle: 'RealTime',
        productos
    })
})

io.on('connection', async clientSocket => {
    console.log("nuevo cliente conectado ", clientSocket.id)
    clientSocket.on("nuevoMensaje", async mensaje => {
        console.log(mensaje)
        await MessagesMongooseManager.guardarMensaje({
            fecha: new Date().toLocaleString(),
            ...mensaje
        })
        io.sockets.emit("actualizarMensajes", await MessagesMongooseManager.obtenerMensajes())
    })

    clientSocket.on('nuevoUsuario', async nombreUsuario => {
        clientSocket.broadcast.emit('nuevoUsuario', nombreUsuario)
    })

    io.sockets.emit('actualizarMensajes', await MessagesMongooseManager.obtenerMensajes())
})

app.get('/chat', async (req,res) => {
    const productos = await ProductMongooseManager.obtenerTodos()
    res.render('chat', { 
        pageTitle: 'chat',
        productos
    })
})

app.use('/', apiRouter)

//const productsManager = new ProductManager('./database/products.json');

// app.get('/products', async (req, res) => {
//     try {
//         const cantProducts = await productsManager.getCantProducts(req.query.limit);
//         res.json(cantProducts);
//     } catch (error) {
//         res.status(404).json({ message: error.message })
//     }
// })

// app.get('/products/:pid', async (req, res) => {
//     try {
//         const product = await productsManager.getProductById(req.params.pid);
//         res.json(product);
//     } catch (error) {
//         res.status(404).json({ message: error.message })
//     }
// })