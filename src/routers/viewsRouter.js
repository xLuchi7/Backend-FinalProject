import express, { Router } from 'express';
import { MessagesMongooseManager } from '../dao/MongooseManagers/MensajesManager.js';
import productModel, { ProductMongooseManager } from '../dao/MongooseManagers/ProductMongooseManager.js';
import { chatService } from '../services/chatService.js';
import { productService } from '../services/productService.js';
import { autenticacion } from '../utils/autenticacion.js';
import { redireccion } from '../utils/redireccion.js';
import { yaLogueado } from '../utils/yaLogueado.js';

export const viewsRouter = Router();

viewsRouter.use(express.json())
viewsRouter.use(express.urlencoded({extended: true}))

viewsRouter.get('/products', async (req,res) => {

    // const sortValue = req.query.sort
    // let sortNumber

    // if (sortValue == 'asc') {
    //     sortNumber = 1
    // }
    // if (sortValue == 'desc') {
    //     sortNumber = -1
    // }

    // const criterioBusqueda = {}
    // const opcionesPaginacion = {
    //     sort: {price: sortNumber},
    //     lean: true,
    //     limit: req.query.limit ?? 4,
    //     page: req.query.page ?? 1,
    // }

    // const result = await productModel.paginate(criterioBusqueda, opcionesPaginacion)

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
        user: req.user
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

viewsRouter.get('/realtimeproducts', async (req,res) => {
    const productos = await productService.obtenerProductos()
    res.render('realtimeproducts', { 
        pageTitle: 'RealTime',
        productos
    })
})

viewsRouter.get('/chat', async (req,res) => {
    const mensajes = await chatService.obtenerMensajes()
    res.render('chat', { 
        pageTitle: 'chat',
        mensajes
    })
})