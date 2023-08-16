import express, { Router } from 'express';
import { autenticacionGithub, autenticacionGithub_CB, autenticacionUserPass, passportInitialize, passportSession } from '../middlewares/passport.js';
import { deleteCurrentSessionController, postSessionsController } from '../controllers/sessionController.js';
import { cartMongooseManager } from '../dao/MongooseManagers/CartManager.js';
import { User } from '../models/entidades/User.js';
import { UsersMongooseManager, usuarioModel } from '../dao/MongooseManagers/userModel.js';
import { validarRol } from '../utils/rol.js';
import { hashear, validarQueSeanIguales } from '../utils/criptografia.js';
import { autenticacion } from '../utils/autenticacion.js';
import { usuariosService } from '../services/usuarioService.js';
import { ErrorHandler } from '../middlewares/ErrorHandler.js';
import { emailService } from '../services/mailService.js';
import Swal from 'sweetalert2';
import { winstonLogger } from '../utils/winstonLogger.js';
import { productService } from '../services/productService.js';
import multer from 'multer';
import { jsonRouter } from './jsonRouter/jsonRouter.js';
import { cartService } from '../services/cartService.js';
import { verificarFecha } from '../utils/verificarFecha.js';
import { postRegisterController } from '../controllers/postRegisterController.js';
import { postProductToCart } from '../controllers/addProductToCartController.js';
import { postCambiarContraController } from '../controllers/cambiarContraController.js';
import { postDocumentsController } from '../controllers/postDocumentsController.js';
import { postModificarRol } from '../controllers/modificarRolController.js';
import { postEliminarUsuario } from '../controllers/eliminarUsuarioController.js';

export const apiRouter = Router();

//apiRouter.use(passportInitialize, passportSession)
//apiRouter.use(passportSession)

// apiRouter.use((req, res, next) => {
//     console.log("cargando api router")
//     next()
// })

apiRouter.use(express.json())
apiRouter.use(express.urlencoded({extended: true}))

apiRouter.use('/', jsonRouter)

//obtener todos los usuarios
apiRouter.get('/api/users', async (req, res, next) => {
    const usuarios = await usuariosService.obtenerTodosLosUsuarios()

    res.render('usuarios', { 
        pageTitle: "Usuarios",
        usuarios
    })
})

//login post
apiRouter.post('/api/sesiones', postSessionsController)
//apiRouter.post('/api/sesiones', autenticacionUserPass, postSessionsController)
// apiRouter.post('/api/sesiones', async (req, res, next) => {
//     try {
//         let buscado = await usuariosService.buscarPorEmail(req.body.email)
//         if(buscado == null){
//             buscado = ""
//         }
//         let existe
//         existe = validarQueSeanIguales(req.body.password, buscado.password)
//         if (existe == true) {
//             req.logIn(buscado, error => {
//                 res.status(201).json(req.user)
//             })
//             const nuevaData = await usuariosService.actualizarUltimoLogout(req.user)
//             console.log(nuevaData)
//         }
//     } catch (error) {
//         //res.status(404)
//         winstonLogger.error("fallo el login de usuario")
//         next(error)
//     }
// })

//register post
apiRouter.post('/api/usuarios', postRegisterController)
// apiRouter.post('/api/usuarios', async (req, res, next) => {
//     try {
//         const nuevoUsuario = await usuariosService.registrar(req.body)
//         req.logIn(nuevoUsuario, error => {
//             // if(error){
//             //     next(new Error("error al registrarse"))
//             // }else{
//             //     res.status(201).json(req.user)
//             // }
//             res.status(201).json(req.user)
//         })
//     } catch (error) {
//         winstonLogger.error("fallo el registro de usuario")
//         next(error)
//     }
// })

//delete sesion
apiRouter.delete('/api/sesiones', deleteCurrentSessionController)
// apiRouter.delete('/api/sesiones', async (req, res) => {
//     //console.log("entre")
//     winstonLogger.info("usuario a deslogear: "+req.user.email)

//     req.logOut(err => {
//         res.sendStatus(200)
//     })
// })
// apiRouter.delete('/api/sesiones', async (req, res, next) => {
//     try {
//         winstonLogger.info("usuario a deslogear: "+req.user.email)

//         const nuevaData = await usuariosService.actualizarUltimoLogout(req.user)
//         console.log(nuevaData)

//         req.logOut(err => {
//             res.status(200)
//         })
//     } catch (error) {
//         winstonLogger.error("fallo el logout")
//         next(error)
//     }
// })

//borrar producto
apiRouter.get('/api/deleteProduct/:pid', async (req, res) => {
    try {
        const productoBorrado = await productService.borrarProducto(req.params.pid)
        res.redirect('/realtimeproducts')
    } catch (error) {
        console.log("error al borrar")
    }
})

//agregar producto al carrito
apiRouter.post('/api/addProductToCart/:pid', autenticacion, postProductToCart)
// apiRouter.post('/api/addProductToCart/:pid', autenticacion, async (req, res, next) => {
//     try {
//         console.log("llego el pid: ", req.params.pid)
//         const cart = await cartService.agregarProductoACarrito(req.user.cartID, req.params.pid)
//         console.log("salio todo bien")
//         res.sendStatus(200)
//     } catch (error) {
//         res.sendStatus(404)
//     }
// })

apiRouter.post('/api/cambiarContrasenia/:uid', postCambiarContraController)
// apiRouter.post('/api/cambiarContrasenia/:uid', async (req, res, next) => {
//     try {
//         const datos = req.body
//         //console.log("contra", datos.contra)
//         //console.log("confirmar", datos.confirmar)
//         console.log("llego el id: ", req.params.uid)
//         //const id =  await UsersMongooseManager.buscarIdDeUsuario(req.user)
//         //console.log("id: ", id)
//         //console.log("biennn")
//         if(datos.contra != datos.confirmar){
//             res.sendStatus(401)
//         }
//         const usuarioNew = await usuariosService.cambiarContra(datos.contra, datos.confirmar, req.params.uid)
//         res.sendStatus(200)
//     } catch (error) {
//         next(error)
//     }
// })

let nombreParaGuardarElArchivo
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './static/images')
    },
    filename: function(req, file, cb){
        nombreParaGuardarElArchivo = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname
        cb(null, nombreParaGuardarElArchivo)
    }
})

const extractor = multer({ storage })
const extraerFoto = extractor.single('document')

//post de documento
apiRouter.post('/users/:uid/documents', extraerFoto, postDocumentsController)
// apiRouter.post('/users/:uid/documents', extraerFoto, async (req, res, next) => {
//     console.log("nombre: ", req.file.originalname)
//     console.log("link: ", nombreParaGuardarElArchivo)
//     console.log("uid: ", req.params.uid)
//     const usuarioActualizado = await usuariosService.agregarDocumento(req.params.uid, req.file.originalname, nombreParaGuardarElArchivo)
//     console.log("actualizado: ", usuarioActualizado)
//     res.status(201).json(req.file)
// })

//borrar un usuario
apiRouter.post('/api/eliminarUsuario/:uid', postEliminarUsuario) 
// apiRouter.post('/api/eliminarUsuario/:uid', async (req, res, next) => {
//     try {
//         const usuarioBorrado = await usuariosService.borrarUsuarioPorID(req.params.uid)
//         res.sendStatus(200)
//     } catch (error) {
//         res.sendStatus(404)
//     }
// })

apiRouter.post('/api/modificarRol/:uid', postModificarRol)
// apiRouter.post('/api/modificarRol/:uid', async (req, res, next) => {
//     try {
//         const usuario = await usuariosService.buscarUsuarioPorID(req.params.uid)
//         let usuarioActualizado
//         if(usuario.role == "user"){
//             usuarioActualizado = {
//                 first_name: usuario.first_name,
//                 last_name: usuario.last_name,
//                 email: usuario.email,
//                 age: usuario.age,
//                 password: usuario.password,
//                 cartID: usuario.cartID,
//                 role: "Premium",
//                 last_connection: usuario.last_connection,
//                 documents: usuario.documents
//             }
//         }else{
//             usuarioActualizado = {
//                 first_name: usuario.first_name,
//                 last_name: usuario.last_name,
//                 email: usuario.email,
//                 age: usuario.age,
//                 password: usuario.password,
//                 cartID: usuario.cartID,
//                 role: "user",
//                 last_connection: usuario.last_connection,
//                 documents: usuario.documents
//             }
//         }
        
//         await usuariosService.modificarRol(usuario, usuarioActualizado)
//         //console.log("usuario modificado: ", usuarioModificado)
//         res.sendStatus(200)
//     } catch (error) {
//         res.sendStatus(404)
//     }
// })

//login con github
apiRouter.get('/github', autenticacionGithub)
//apiRouter.get('/githubcallback', autenticacionGithub_CB)
apiRouter.get('/githubcallback', autenticacionGithub_CB, (req, res, next) => { res.redirect('/products')})

apiRouter.use(ErrorHandler)
