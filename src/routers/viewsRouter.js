import express, { Router } from 'express';
import { entregarProductosInvalidos, entregarProductosValidos } from '../../test/testProducts.js';
import { MessagesMongooseManager } from '../dao/MongooseManagers/MensajesManager.js';
import productModel, { ProductMongooseManager } from '../dao/MongooseManagers/ProductMongooseManager.js';
import { ErrorHandler } from '../middlewares/ErrorHandler.js';
import { Ticket } from '../models/entidades/Ticket.js';
import { cartService } from '../services/cartService.js';
import { chatService } from '../services/chatService.js';
import { emailService } from '../services/mailService.js';
import { productService } from '../services/productService.js';
import { ticketsService } from '../services/ticketService.js';
import { usuariosService } from '../services/usuarioService.js';
import { autenticacion } from '../utils/autenticacion.js';
import { redireccion } from '../utils/redireccion.js';
import { yaLogueado } from '../utils/yaLogueado.js';
import { randomUUID } from 'crypto';

export const viewsRouter = Router();

viewsRouter.use(express.json())
viewsRouter.use(express.urlencoded({extended: true}))

viewsRouter.get('/products', async (req,res) => {
    const result = await productService.obtenerPaginado(req.query)

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
        sortValue: req.query.sort,
        user: req.user,
    })
})

viewsRouter.get('/products/product/:pid', async (req, res, next) => { 
    try {
        const product = await productService.obtenerUnProducto(req.params.pid);
        let usuario
        if(req.user.role == "user"){
            usuario = true
        }else{
            usuario = false
        }
        res.render('oneProduct', {
            pageTitle: 'Product',
            product,
            user: req.user,
            usuario
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

viewsRouter.get('/carrito/:cid/producto/:pid', async (req, res) => { 
    const product = await productService.obtenerUnProducto(req.params.pid)
    const cart = await cartService.agregarProductoACarrito(req.params.cid, req.params.pid)
    let usuario
    if(req.user.role == "user"){
        usuario = true
    }else{
        usuario = false
    }
    res.render('oneProduct', {
        pageTitle: 'Product',
        product,
        user: req.user,
        usuario
    })
})

viewsRouter.get('/cart/product/:pid', autenticacion,  async (req, res) => { 
    const productoEliminar = await cartService.borrarProductoDelCarrito(req.user.cartID, req.params.pid)
    //console.log("id de producto a elimiar: ", req.params.pid)
   // console.log("cart id: ", req.user.cartID)
    const productos = await cartService.obtenerProductosDeCarrito(req.user.cartID)
    const total = await cartService.obtenerTotal(productos)

    res.render('cart', { 
        pageTitle: "Carrito",
        user: req.user,
        productos,
        total
    })
})

viewsRouter.get('/cart', autenticacion, async (req, res) => {
    const productos = await cartService.obtenerProductosDeCarrito(req.user.cartID)
    const total = await cartService.obtenerTotal(productos)

    res.render('cart', { 
        pageTitle: "Carrito",
        user: req.user,
        productos,
        total
    })
    //yaLogueado(req, res, req.user)
})

viewsRouter.get('/:cid/purchase', async (req, res) => {
    const productos = await cartService.obtenerProductosDeCarrito(req.user.cartID)
    const total = await cartService.obtenerTotal(productos)

    const datosTicket = new Ticket({
        amount: total,
        purchaser: req.user.email
    })
    const ticket = await ticketsService.crearTicket(datosTicket)
    const productosComprados = await cartService.aprobarCompra(productos, req.user.cartID)

    res.render('purchase', { 
        pageTitle: "Comprar Carrito",
        productosComprados,
        total
    })
})

viewsRouter.get('/login', (req, res) => {
    res.render('login', { pageTitle: "Iniciar Sesion" })
    yaLogueado(req, res, req.user)
})

viewsRouter.get('/register', (req, res) => {
    res.render('register', { pageTitle: "Registro" })
    redireccion(req, res, req.user)
})

viewsRouter.get('/profile', autenticacion, (req, res) => {
    //const mail = await emailService.sendMail("sessaregoluchi@gmail.com", "prueba")
    //console.log(mail)
    res.render('profile', { 
        pageTitle: "Perfil", user: req.user
    })
})

viewsRouter.get('/ingresarMail', async (req, res) => {
    res.render('ingresarMail', { 
        pageTitle: "Restablecer Contraseña",
    })
})

viewsRouter.get('/mailEnviado', async (req, res) => {
    if(req.user){
        const mail = req.user.email
        // const numero= Math.floor(Math.random() * 1000000)
        // const numeroRandom = String(numero).padStart(6, "0")
        // const string = "Los digitos son: "+ numeroRandom
        // console.log(string)
        //await emailService.sendMail("sessaregoluchi@gmail.com", string)
        const id = await usuariosService.buscarIdDeUsuario(req.user)
        console.log("el id es: ", id)
        await emailService.sendMail(mail, `http://localhost:8080/cambiarContrasenia/${id}`)
        res.render('mailEnviadoRestablecer', { 
            pageTitle: "Restablecer Contraseña",
            email: mail
        })
    }else{
        console.log("llego el mail: ", req.body)
        res.render('mailEnviadoRestablecer', { 
            pageTitle: "Restablecer Contraseña",
            email: req.body
        })
    }
})

viewsRouter.get('/enviarEmailSinLogin/:email', async (req, res) => {
    console.log("llego el mail: ", req.params.email)
    const usuario = await usuariosService.existeEmail(req.params.email)
    console.log("usuario completo: ", usuario)
    if(usuario == false){
       // alert("No se encontro ese email")
        res.sendStatus(404)
    }else{
        //const id = await usuariosService.buscarIdDeUsuario(usuario)
        console.log("el id es: ", usuario._id)
        await emailService.sendMail(usuario.email, `http://localhost:8080/cambiarContrasenia/${usuario._id}`)
        res.sendStatus(200)
        //alert("Se envio un mail a:"+ req.params.email +"para restablecer la contraseña")
    }
    //res.sendStatus(200)

    // res.render('mailEnviadoRestablecer', { 
    //     pageTitle: "Restablecer Contraseña",
    //     email: req.params.email
    // })      
})

viewsRouter.get('/cambiarContrasenia/:uid', async (req, res) => {
    console.log("necesito: ", req.params.uid)

    res.render('contraNueva', { 
        pageTitle: "Cambio De Contraseña",
        idMandado: req.params.uid
    })
})

viewsRouter.get('/realtimeproducts', autenticacion, async (req,res) => {
    const productos = await productService.obtenerProductos()
    let usuario
    if(req.user.role == "admin" || req.user.role == "premium"){
        usuario = true
    }else{
        usuario = false
    }
    const idUsuario = await usuariosService.buscarIdDeUsuario(req.user)
    res.render('realtimeproducts', { 
        pageTitle: 'RealTime',
        productos,
        usuario,
        idUsuario
    })
})

viewsRouter.get('/chat', autenticacion, async (req,res) => {
    const mensajes = await chatService.obtenerMensajes()
    let usuario
    if(req.user.role == "user"){
        usuario = true
    }else{
        usuario = false
    }

    res.render('chat', { 
        pageTitle: 'chat',
        mensajes,
        usuario
    })
})

viewsRouter.get('/mockingproducts', (req, res) => {
    const products = entregarProductosValidos()
    //const products = entregarProductosInvalidos()
    res.json(products)
})