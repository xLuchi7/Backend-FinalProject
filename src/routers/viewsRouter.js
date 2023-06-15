import express, { Router } from 'express';
import { entregarProductosInvalidos, entregarProductosValidos } from '../../test/testProducts.js';
import { MessagesMongooseManager } from '../dao/MongooseManagers/MensajesManager.js';
import productModel, { ProductMongooseManager } from '../dao/MongooseManagers/ProductMongooseManager.js';
import { ErrorHandler } from '../middlewares/ErrorHandler.js';
import { Ticket } from '../models/entidades/Ticket.js';
import { cartService } from '../services/cartService.js';
import { chatService } from '../services/chatService.js';
import { productService } from '../services/productService.js';
import { ticketsService } from '../services/ticketService.js';
import { autenticacion } from '../utils/autenticacion.js';
import { redireccion } from '../utils/redireccion.js';
import { yaLogueado } from '../utils/yaLogueado.js';

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
        console.log("PROD: ", product)
        let usuario
        if(req.user.role == "user"){
            usuario = true
        }else{
            usuario = false
        }
        console.log("EL USER ESTA: ", usuario)
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
    console.log("EL USER ESTA: ", usuario)
    res.render('oneProduct', {
        pageTitle: 'Product',
        product,
        user: req.user,
        usuario
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

    console.log("total: ", productos)
    const datosTicket = new Ticket({
        amount: total,
        purchaser: req.user.email
    })
    const ticket = await ticketsService.crearTicket(datosTicket)
    const productosComprados = await cartService.aprobarCompra(productos, req.user.cartID)
    console.log("COMPRADOS: ", productosComprados)

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
    res.render('profile', { 
        pageTitle: "Perfil", user: req.user
    })
})

viewsRouter.get('/realtimeproducts', autenticacion, async (req,res) => {
    const productos = await productService.obtenerProductos()
    let usuario
    if(req.user.role == "admin"){
        usuario = true
    }else{
        usuario = false
    }
    res.render('realtimeproducts', { 
        pageTitle: 'RealTime',
        productos,
        usuario
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
    console.log("EL USER ESTA: ", usuario)

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