import express, { Router } from 'express';
import { productsRouter } from './productsRouter.js';
import { cartRouter } from './cartRouter.js';
import { autenticacionGithub, autenticacionGithub_CB, autenticacionUserPass, passportInitialize, passportSession } from '../middlewares/passport.js';
import { postSessionsController } from '../controllers/sessionController.js';
import { cartMongooseManager } from '../dao/MongooseManagers/CartManager.js';
import { User } from '../entidades/User.js';
import { usuarioModel } from '../dao/userModel.js';
import { validarRol } from '../utils/rol.js';
import { hashear } from '../utils/criptografia.js';
import { autenticacion } from '../utils/autenticacion.js';
import { usuariosService } from '../services/usuarioService.js';

export const apiRouter = Router();

apiRouter.use(passportInitialize, passportSession)

apiRouter.use((req, res, next) => {
    console.log("cargando api router")
    next()
})

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
apiRouter.post('/api/usuarios', async (req, res) => {
    // const id = await cartMongooseManager.createNewCart()

    // console.log("EL NUEVO ID DEL CARRITO ES: ", id);
    
    // let nuevoUsuario = new User({
    //     first_name: req.body.first_name,
    //     last_name: req.body.last_name,
    //     email: req.body.email,
    //     age: req.body.age,
    //     password: hashear(req.body.password),
    //     cartID: id,
    //     role: validarRol(req.body.email)
    // })
    // console.log("CON CONTRA HASHEADA: ", nuevoUsuario)
    // await usuarioModel.create(nuevoUsuario)

    // req.logIn(nuevoUsuario, error => {
    //     if(error){
    //         next(new Error("error al registrarse"))
    //     }else{
    //         res.status(201).json(req.user)
    //     }
    // })
    const nuevoUsuario = await usuariosService.registrar(req.body)

    req.logIn(nuevoUsuario, error => {
        if(error){
            next(new Error("error al registrarse"))
        }else{
            res.status(201).json(req.user)
        }
    })
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