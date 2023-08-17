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
import { entregarCarritosInvalidos, entregarCarritosValidos } from '../../test/testCarts.js';
import { entregarSesionesInvalidos, entregarSesionesValidos } from '../../test/testSessions.js';
import { validacionHora } from '../utils/validacionHora.js';
import { codificarHora, compararConHoraActual, decodificarHora } from '../utils/hora.js'
import { esAdministrador } from '../utils/esAdministrador.js';
import { verificarFecha } from '../utils/verificarFecha.js';
import { autenticacionGithub, autenticacionGithub_CB } from '../middlewares/passport.js';

export const viewsRouter = Router();

viewsRouter.use(express.json())
viewsRouter.use(express.urlencoded({extended: true}))

viewsRouter.get('/', (req, res, next) => {
    res.redirect('/products')
})

viewsRouter.get('/allUsers', async (req, res, next) => {
    const usuarios = await usuariosService.obtenerTodosLosUsuarios()

    res.render('usuarios', { 
        pageTitle: "Usuarios",
        usuarios
    })
})

viewsRouter.get('/products', async (req,res, next) => {
    try {
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
    } catch (error) {
        next(error)
    }
})

viewsRouter.get('/products/product/:pid', async (req, res, next) => { 
    try {
        const product = await productService.obtenerUnProducto(req.params.pid);
        let user = false
        let usuario = false
        if(req.user){
            user = req.user
            if(req.user.role == "user"){
                usuario = true
            }
            if(req.user.role == "premium"){
                usuario = true
            }
        }
        res.render('oneProduct', {
            pageTitle: 'Product',
            product,
            user,
            usuario
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

viewsRouter.get('/cart/product/:pid', autenticacion,  async (req, res) => { 
    const productoEliminar = await cartService.borrarProductoDelCarrito(req.user.cartID, req.params.pid)
    const productos = await cartService.obtenerProductosDeCarrito(req.user.cartID)
    const total = await cartService.obtenerTotal(productos)
    res.redirect("/cart")
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

viewsRouter.get('/profile', autenticacion, (req, res, next) => {
    res.render('profile', { 
        pageTitle: "Perfil", user: req.user
    })
})

viewsRouter.get('/api/sesiones/current', autenticacion, (req, res) => {
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
        const id = await usuariosService.buscarIdDeUsuario(req.user)
        const hora = new Date()
        const horaCodificada = codificarHora(hora)
        //await emailService.sendMail(mail, `http://localhost:8080/cambiarContrasenia/${id}/${horaCodificada}`)
        await emailService.sendMail(mail, `https://1ra-entrega-proyecto-final-production.up.railway.app/cambiarContrasenia/${id}/${horaCodificada}`)
        res.render('mailEnviadoRestablecer', { 
            pageTitle: "Restablecer Contraseña",
            email: mail
        })
    }else{
        res.render('mailEnviadoRestablecer', { 
            pageTitle: "Restablecer Contraseña",
            email: req.body
        })
    }
})

viewsRouter.get('/enviarEmailSinLogin/:email', async (req, res) => {
    const usuario = await usuariosService.existeEmail(req.params.email)
    if(usuario == false){
        res.sendStatus(404)
    }else{
        const hora = new Date()
        const horaCodificada = codificarHora(hora)
        //await emailService.sendMail(usuario.email, `http://localhost:8080/cambiarContrasenia/${usuario._id}/${horaCodificada}`)
        await emailService.sendMail(usuario.email, `https://1ra-entrega-proyecto-final-production.up.railway.app/cambiarContrasenia/${usuario._id}/${horaCodificada}`)
        res.sendStatus(200)
    }     
})

viewsRouter.get('/cambiarContrasenia/:uid/:hora', async (req, res, next) => {
    const horaDecodificada = decodificarHora(parseInt(req.params.hora))
    const esHoraValida = compararConHoraActual(parseInt(req.params.hora))
    res.render('contraNueva', { 
        pageTitle: "Cambio De Contraseña",
        idMandado: req.params.uid,
        valida: esHoraValida
    })
})

viewsRouter.get('/realtimeproducts', autenticacion, async (req,res) => {
    const productos = await productService.obtenerProductos()
    let admin = false
    let premium = false
    if(req.user.role == "admin"){
        admin = true
        premium = true
    }
    if(req.user.role == "premium"){
        premium = true
    }
    const idUsuario = await usuariosService.buscarIdDeUsuario(req.user)
    let productosDelOwner = []
    if(premium == true){
        const productos = await productService.obtenerProductos()
        let cont = 0
        for (let i = 0; i < productos.length; i++) {
            if(productos[i].owner == idUsuario){
                productosDelOwner[cont] = productos[i]
                cont++
            }
        }
    }

    res.render('realtimeproducts', { 
        pageTitle: 'RealTime',
        productos,
        admin,
        premium,
        productosDelOwner,
        idUsuario
    })
})

viewsRouter.get('/modificarUsuario/:uid', esAdministrador, async (req, res, next) => { 
    try {
        const usuario = await usuariosService.buscarUsuarioPorID(req.params.uid)
        
        let esUsuario = false
        if(usuario.role == "user"){
            esUsuario = true
        }
        const idUsuario = await usuariosService.buscarIdDeUsuario(usuario)
        
        res.render('modificarUsuario', { 
            pageTitle: 'Modificar Usuario',
            user: usuario,
            esUsuario,
            idUsuario
        })
    } catch (error) {
        res.redirect("/profile")
    }
})

//borrar usuarios que no se conectaron
viewsRouter.get('/borrarUsuarios', esAdministrador, async (req, res, next) => {
    const usuarios = await usuariosService.obtenerTodosLosUsuarios()
    let aBorrar = false
    let usuariosBorrados = []
    let cont = 0

    for (let i = 0; i < usuarios.length; i++) {
        aBorrar = verificarFecha(usuarios[i])
        if(aBorrar == true){
            await emailService.sendMail(usuarios[i].email, "Se elimino su cuenta debeido a la inactividad por mas de 2 dias.")
            usuariosBorrados[cont] =  await usuariosService.borrarUsuarioPorID(usuarios[i]._id)
            cont++
        }
    }

    res.render('usuariosBorrados', { 
        pageTitle: "Usuarios Borrados",
        usuariosBorrados
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

//login con github
viewsRouter.get('/github', autenticacionGithub)
viewsRouter.get('/githubcallback', autenticacionGithub_CB, (req, res, next) => { res.redirect('/products')})

viewsRouter.get('/mockingproducts', (req, res) => {
    const products = entregarProductosValidos()
    //const products = entregarProductosInvalidos()
    res.json(products)
})

viewsRouter.get('/mockingcarts', (req, res) => {
    const carritos = entregarCarritosValidos()
    //const carritos = entregarCarritosInvalidos()
    res.json(carritos)
})

viewsRouter.get('/mockingsessions', (req, res) => {
    const sesiones = entregarSesionesValidos()
    //const carritos = entregarSesionesInvalidos()
    res.json(sesiones)
})