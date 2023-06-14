import express, { Router } from 'express';
import { productsRouter } from './productsRouter.js';
import { cartRouter } from './cartRouter.js';
import { autenticacionGithub, autenticacionGithub_CB, autenticacionUserPass, passportInitialize, passportSession } from '../middlewares/passport.js';
import { postSessionsController } from '../controllers/sessionController.js';
import { cartMongooseManager } from '../dao/MongooseManagers/CartManager.js';
import { User } from '../models/entidades/User.js';
import { usuarioModel } from '../dao/MongooseManagers/userModel.js';
import { validarRol } from '../utils/rol.js';
import { hashear } from '../utils/criptografia.js';
import { autenticacion } from '../utils/autenticacion.js';
import { usuariosService } from '../services/usuarioService.js';
import { ErrorHandler } from '../middlewares/ErrorHandler.js';

export const apiRouter = Router();

apiRouter.use(passportInitialize, passportSession)

// apiRouter.use((req, res, next) => {
//     console.log("cargando api router")
//     next()
// })

apiRouter.use(express.json())
apiRouter.use(express.urlencoded({extended: true}))

apiRouter.use('/', productsRouter)
apiRouter.use('/', cartRouter)

//login post
apiRouter.post('/api/sesiones', autenticacionUserPass, postSessionsController,  async (req, res) => {
    console.log("en app.post: ", req.user)
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
    console.log("usuario a destruir: ", req.user)

    req.logOut(err => {
        res.sendStatus(200)
    })
})

//login con github
apiRouter.get('/api/sessions/github', autenticacionGithub)
apiRouter.get('/api/sessions/githubcallback', autenticacionGithub_CB, (req, res, next) => { res.redirect('/products')})

apiRouter.use(ErrorHandler)