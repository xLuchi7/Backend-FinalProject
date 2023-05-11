import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local'
import { User } from "../entidades/User.js";
import { hashear, validarQueSeanIguales } from "../utils/criptografia.js";
import { usuarioModel } from "../dao/usuarioManager.js";
import { Strategy as GithubStrategy } from 'passport-github2';
import { githubCallbackUrl, githubClientSecret, githubClienteId } from "../utils/authConfig.js";
import { validarRol } from "../utils/rol.js";

passport.use('local', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    let buscado = await usuarioModel.findOne({ email: email }).lean()
    console.log("USUARIO: ", buscado)
    const existe = validarQueSeanIguales(password, buscado.password)
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
}))

passport.use('github', new GithubStrategy({
    clientID: githubClienteId,
    clientSecret: githubClientSecret,
    callbackURL: githubCallbackUrl,
}, async (accessToken, refreshToken, profile, done) => {
    console.log(profile.username)
    let user
    // let user = {
    //     email: profile.username
    // }
    // console.log("USUARIO: ", user)
    // let creado = await usuarioModel.create(user)
    // console.log("CREADO: ", creado)
    try {
        // let user = {
        //     email: profile.username
        // }
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
