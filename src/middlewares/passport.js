import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local'
import { hashear, validarQueSeanIguales } from "../utils/criptografia.js";
import { usuarioModel } from "../dao/MongooseManagers/userModel.js";
import { Strategy as GithubStrategy } from 'passport-github2';
import { githubCallbackUrl, githubClientSecret, githubClienteId } from "../config/authConfig.js";
import { validarRol } from "../utils/rol.js";
import { ErrorHandler } from "./ErrorHandler.js";
import { ErrorLogin } from "../models/errors/ErrorLogin.js";
import Swal from 'sweetalert2';
import { usuariosService } from "../services/usuarioService.js";
import { User } from "../models/entidades/User.js";
import { cartMongooseManager } from "../dao/MongooseManagers/CartManager.js";

passport.use('local', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    let buscado = await usuarioModel.findOne({ email: email })
    if(buscado == null){
        buscado = ""
    }
    let existe
    try {
        existe = validarQueSeanIguales(password, buscado.password)
        if (existe == true) {
            // buscado = {
            //     first_name: buscado.first_name,
            //     last_name: buscado.last_name,
            //     email: buscado.email,
            //     age: buscado.age,
            //     cartID: buscado.cartID,
            //     role: buscado.role,
            //     last_connection: buscado.last_connection,
            //     documents: buscado.documents
            // }
            done(null, buscado)
        }
    } catch (error) {
        ErrorHandler(error)
    }
}))

passport.use('github', new GithubStrategy({
    clientID: githubClienteId,
    clientSecret: githubClientSecret,
    callbackURL: githubCallbackUrl,
}, async (accessToken, refreshToken, profile, done) => {
    console.log("perfil: ", profile)
    let user
    // try {
    //     console.log("entre al try")
    //     //user = await usuarioModel.findOne({ email: profile.username })
    //     user = await usuariosService.buscarPorEmail(profile.username)
    //     console.log("usuario: ", user)
    // } catch (error) {
    //     console.log("entre al try")
    //     user = new User({
    //         //first_name: profile.username,
    //         email: profile.username
    //     })
    //     await usuarioModel.create(user)
    // }
    user = await usuariosService.buscarPorEmail(profile.username)
    console.log("usuario: ", user)
    if(user == null){
        const cartId = await cartMongooseManager.createNewCart()
        const date = new Date()
        date.setHours(date.getHours()-3)
        const dateToString = date.toLocaleString()
        user = {
            email: profile.username,
            cartID: cartId,
            role: "user",
            last_connection: dateToString,
        }
        await usuarioModel.create(user)
    }else{
        user = await usuariosService.actualizarUltimaConexionGithub(user)
        console.log("actualizado: ", user)
    }
    done(null, user)
}))

passport.serializeUser((user, next) => { next(null, user) })
passport.deserializeUser((user, next) => { next(null, user) })

export const passportInitialize = passport.initialize()
export const passportSession = passport.session()

export const autenticacionUserPass = passport.authenticate('local', { failWithError: true })
export const autenticacionGithub = passport.authenticate('github', { scope: ['user:email'] })
export const autenticacionGithub_CB = passport.authenticate('github', { failureRedirect: '/login' /*failWithError: true*/ })
