import express from 'express';
import { engine } from 'express-handlebars';
import { Server as SocketIOServer } from 'socket.io';
import { ProductManager } from './dao/ProductManager.js';
import { Product } from './entidades/Product.js';
import { randomUUID } from 'crypto';
import fs from 'fs';
import { apiRouter } from './routers/apiRouter.js';
import { ProductMongooseManager } from './dao/ProductMongooseManager.js';
import { MessagesMongooseManager } from './dao/MensajesManager.js';
import { conectar } from '../database/mongooseDB.js';
import productModel from './dao/ProductMongooseManager.js';
import mongoosePaginate from "mongoose";
import { paginate } from 'mongoose-paginate-v2';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { usuarioModel } from './dao/usuarioManager.js';
import { autenticacion } from './utils/autenticacion.js';
import { redireccion } from './utils/redireccion.js';
import { yaLogueado } from './utils/yaLogueado.js';
import passport from 'passport'
import { hashear, validarQueSeanIguales } from './utils/criptografia.js';
import { autenticacionGithub, autenticacionGithub_CB, passportInitialize, passportSession } from './middlewares/passport.js';
import { autenticacionUserPass } from "./middlewares/passport.js";
import { postSessionsController } from "./controllers/sessionController.js";
import { User } from './entidades/User.js';
import { validarRol } from './utils/rol.js';
import { cartMongooseManager } from './dao/CartManager.js';

await conectar()

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', engine())
app.set('views', './views')
app.set('view engine', 'handlebars')

app.use(express.static('./public'))

const server = app.listen(8080);

const io = new SocketIOServer(server)

app.use(session({
    store: MongoStore.create({mongoUrl: 'mongodb://127.0.0.1:27017/ecommerce'}),
    saveUninitialized: false,
    resave: false,
    secret: "SESSION_SECRET"
}))

app.use(passportInitialize, passportSession)

app.get('/api/sessions/github', autenticacionGithub)
app.get('/api/sessions/githubcallback', autenticacionGithub_CB, (req, res, next) => { res.redirect('/products')})
//app.get('/api/sessions/githubcallback', autenticacionGithub_CB)

io.on('connection', async clientSocket => {
    clientSocket.on('agregarAlCarrito', async datos => {
        console.log("JUAN")
        console.log("prodID:  ",datos.productID)
        console.log("CartID:  ",datos.cartID)
        //io.sockets.emit('actualizarProductos', await ProductMongooseManager.obtenerTodos())
    })

    //io.sockets.emit('productos', await ProductMongooseManager.obtenerTodos())
    //io.sockets.emit('actualizarProductos', await ProductMongooseManager.obtenerTodos())
})

app.get('/login', (req, res) => {
    res.render('login', { pageTitle: "Iniciar Sesion" })
    yaLogueado(req, res, req.user)
})

app.post('/api/sesiones', autenticacionUserPass, postSessionsController,  async (req, res) => {

    //console.log("ADENTRO")
    console.log("en app.post: ", req.user)

    // const usuarioEcontrado = await usuarioModel.findOne({ email: req.body.email }).lean()
    // if (!usuarioEcontrado) return res.sendStatus(401)

    // // if (usuarioEcontrado.password !== req.body.password) {
    // //     return res.sendStatus(401)
    // // }
    // const coinciden = validarQueSeanIguales(req.body.password, usuarioEcontrado.password)
    // console.log("COINCIDEN: ", coinciden)
    // if (coinciden == false) {
    //     return res.sendStatus(401)
    // }

    // req.session.user = {
    //     first_name: usuarioEcontrado.first_name,
    //     last_name: usuarioEcontrado.last_name,
    //     email: usuarioEcontrado.email,
    //     age: usuarioEcontrado.age,
    // }
    res.status(201).json(req.user)
})

app.get('/register', (req, res) => {
    res.render('register', { pageTitle: "Registro" })
    redireccion(req, res, req.user)
})

app.post('/api/usuarios', async (req, res) => {

    const id = await cartMongooseManager.createNewCart()

    console.log("EL NUEVO ID DEL CARRITO ES: ", id);
    
    let nuevoUsuario = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        age: req.body.age,
        password: hashear(req.body.password),
        cartID: id,
        role: validarRol(req.body.email)
    })
    console.log("CON CONTRA HASHEADA: ", nuevoUsuario)
    await usuarioModel.create(nuevoUsuario)

    req.logIn(nuevoUsuario, error => {
        if(error){
            next(new Error("error al registrarse"))
        }else{
            res.status(201).json(req.user)
        }
    })

    // req.session.user = {
    //     first_name: usuarioCreado.first_name,
    //     last_name: usuarioCreado.last_name,
    //     email: usuarioCreado.email,
    //     age: usuarioCreado.age,
    // }
    // //res.status(201).json(usuarioCreado)
    // res.sendStatus(201)
})

app.get('/profile', autenticacion, (req, res) => {
    res.render('profile', { 
        pageTitle: "Perfil", user: req.user
    })
})

app.get('/api/sesiones/current', autenticacion, (req, res) => {
    res.render('profile', { 
        pageTitle: "Perfil", user: req.user
    })
})

app.delete('/api/sesiones', async (req, res) => {
    console.log("usuario a destruir: ", req.user)

    req.logOut(err => {
        res.sendStatus(200)
    })

    // req.session.destroy(err => {
    //     res.sendStatus(200)
    // })
})

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

app.get('/products', async (req,res) => {

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
        sortValue,
        //user: req.session['user']
        user: req.user
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