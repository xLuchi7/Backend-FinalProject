import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local'
import { hashear, validarQueSeanIguales } from "../utils/criptografia.js";
import { usuarioModel } from "../dao/MongooseManagers/userModel.js";
import { Strategy as GithubStrategy } from 'passport-github2';
import { githubCallbackUrl, githubClientSecret, githubClienteId } from "../config/authConfig.js";
import { ErrorHandler } from "./ErrorHandler.js";
import { usuariosService } from "../services/usuarioService.js";
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
    let user
    user = await usuariosService.buscarPorEmail(profile.username)
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
