import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local'
import { hashear, validarQueSeanIguales } from "../utils/criptografia.js";
import { usuarioModel } from "../dao/MongooseManagers/userModel.js";
import { Strategy as GithubStrategy } from 'passport-github2';
import { githubCallbackUrl, githubClientSecret, githubClienteId } from "../config/authConfig.js";
import { validarRol } from "../utils/rol.js";
import { ErrorHandler } from "./ErrorHandler.js";
import { ErrorLogin } from "../models/errors/ErrorLogin.js";

passport.use('local', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    let buscado = await usuarioModel.findOne({ email: email }).lean()
    if(buscado == null){
        buscado = ""
    }
    console.log("USUARIO: ", buscado)
    let existe
    try {
        existe = validarQueSeanIguales(password, buscado.password)
        if (existe == true) {
            console.log("ENTRE BIEN")
            buscado = {
                first_name: buscado.first_name,
                last_name: buscado.last_name,
                email: buscado.email,
                age: buscado.age,
                cartID: buscado.cartID,
                role: buscado.role,
            }
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
    console.log(profile.username)
    let user
    try {
        user = await usuarioModel.findOne({ email: profile.username }).lean()
        console.log("USUARIO YA ENCONTRADO: ", user)
    } catch (error) {
        user = {
            email: profile.username
        }
        await usuarioModel.create(user)
        console.log("NUEVO USUARIO: ", user)
    }
    done(null, user)
}))

passport.serializeUser((user, next) => { next(null, user) })
passport.deserializeUser((user, next) => { next(null, user) })

export const passportInitialize = passport.initialize()
export const passportSession = passport.session()

export const autenticacionUserPass = passport.authenticate('local', { failWithError: true })
export const autenticacionGithub = passport.authenticate('github', { scope: ['user: email'] })
export const autenticacionGithub_CB = passport.authenticate('github', { failWithError: true })
