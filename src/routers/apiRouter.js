import express, { Router } from 'express';
import { autenticacionGithub, autenticacionGithub_CB, autenticacionUserPass, passportInitialize, passportSession } from '../middlewares/passport.js';
import { postSessionsController } from '../controllers/sessionController.js';
import { cartMongooseManager } from '../dao/MongooseManagers/CartManager.js';
import { User } from '../models/entidades/User.js';
import { UsersMongooseManager, usuarioModel } from '../dao/MongooseManagers/userModel.js';
import { validarRol } from '../utils/rol.js';
import { hashear } from '../utils/criptografia.js';
import { autenticacion } from '../utils/autenticacion.js';
import { usuariosService } from '../services/usuarioService.js';
import { ErrorHandler } from '../middlewares/ErrorHandler.js';
import { emailService } from '../services/mailService.js';
import Swal from 'sweetalert2';
import { winstonLogger } from '../utils/winstonLogger.js';
import { productService } from '../services/productService.js';
import multer from 'multer';
import { jsonRouter } from './jsonRouter/jsonRouter.js';

export const apiRouter = Router();

apiRouter.use(passportInitialize, passportSession)

// apiRouter.use((req, res, next) => {
//     console.log("cargando api router")
//     next()
// })

apiRouter.use(express.json())
apiRouter.use(express.urlencoded({extended: true}))

apiRouter.use('/', jsonRouter)

//login post
apiRouter.post('/api/sesiones', autenticacionUserPass, postSessionsController,  async (req, res) => {
    winstonLogger.info("usuario: "+req.user)
    res.status(201).json(req.user)
})

//register post
apiRouter.post('/api/usuarios', async (req, res, next) => {
    try {
        const nuevoUsuario = await usuariosService.registrar(req.body)
        req.logIn(nuevoUsuario, error => {
            // if(error){
            //     next(new Error("error al registrarse"))
            // }else{
            //     res.status(201).json(req.user)
            // }
            res.status(201).json(req.user)
        })
    } catch (error) {
        winstonLogger.error("fallo el registro de usuario")
        next(error)
    }
})

//profile post
apiRouter.get('/api/sesiones/current', autenticacion, (req, res) => {
    res.render('profile', { 
        pageTitle: "Perfil", user: req.user
    })
})

//delete sesion
apiRouter.delete('/api/sesiones', async (req, res) => {
    //console.log("entre")
    winstonLogger.info("usuario a deslogear: "+req.user.email)

    const nuevaData = await usuariosService.actualizarUltimoLogout(req.user)
    console.log(nuevaData)

    req.logOut(err => {
        res.sendStatus(200)
    })
})

//borrar producto
apiRouter.get('/api/deleteProduct/:pid', async (req, res) => {
    const productoBorrado = await productService.borrarProducto(req.params.pid)
    console.log("prodcuto borrado: ", productoBorrado)
    res.redirect('/realtimeproducts')
})

apiRouter.post('/api/cambiarContrasenia/:uid', async (req, res, next) => {
    try {
        const datos = req.body
        //console.log("contra", datos.contra)
        //console.log("confirmar", datos.confirmar)
        console.log("llego el id: ", req.params.uid)
        const id =  await UsersMongooseManager.buscarIdDeUsuario(req.user)
        //console.log("id: ", id)
        //console.log("biennn")
        const usuarioNew = await usuariosService.cambiarContra(datos.contra, datos.confirmar, req.params.uid)
        //console.log(usuarioNew)
        res.sendStatus(200)
        // Swal.fire(
        //     'The Internet?',
        //     'That thing is still around?',
        //     'question'
        // )
        //res.redirect('/profile')
    } catch (error) {
        next(error)
    }
})

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
apiRouter.post('/users/:uid/documents', extraerFoto, async (req, res, next) => {
    console.log("nombre: ", req.file.originalname)
    console.log("link: ", nombreParaGuardarElArchivo)
    console.log("uid: ", req.params.uid)
    const usuarioActualizado = await usuariosService.agregarDocumento(req.params.uid, req.file.originalname, nombreParaGuardarElArchivo)
    console.log("actualizado: ", usuarioActualizado)
    res.status(201).json(req.file)
})

//login con github
apiRouter.get('/api/sessions/github', autenticacionGithub)
apiRouter.get('/api/sessions/githubcallback', autenticacionGithub_CB, (req, res, next) => { res.redirect('/products')})

apiRouter.use(ErrorHandler)