import { DateTime } from "luxon";
import mongoose from "mongoose";
import { User } from "../../models/entidades/User.js";
import { hashear } from "../../utils/criptografia.js";

const usuarioSchema = new mongoose.Schema({
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    password: { type: String },
    cartID: { type: String, unique: true },
    role: { type: String },
    last_connection: { type: String },
    documents: { type: Array }
}, { versionKey: false })

export const usuarioModel = mongoose.model('usuarios', usuarioSchema)

class usersManager{
    #usersDB

    constructor(){
        this.#usersDB = mongoose.model('usuarios', usuarioSchema)
    }

    async crearUsuario(datosUsuario){
        let usuarioGuardado = await this.#usersDB.create(datosUsuario)
        usuarioGuardado = JSON.parse(JSON.stringify(usuarioGuardado))
        return usuarioGuardado
    }

    async cambiarContra(contra, id){
        //const user = await this.#usersDB.findById(id).lean()
        console.log("aaa: ", id)
        const userViejo = await this.#usersDB.findById(id).lean()
        console.log("usuario: ", userViejo)
        let newUser
        if (userViejo) {
            newUser = new User({
                first_name: userViejo.first_name,
                last_name: userViejo.last_name,
                email: userViejo.email,
                age: userViejo.age,
                password: hashear(contra),
                cartID: userViejo.cartID,
                role: userViejo.role,
                last_connection: userViejo.last_connection,
                documents: userViejo.documents
            })
            console.log("Nuevo usuario: ", newUser)
            if(newUser.password == userViejo.password){
                throw new Error("No podes ingresar tu contraseña actual")
            }else{
                //console.log("Nuevo usuario: ", newUser)
                await this.#usersDB.updateOne(userViejo, newUser)
            }
        }else{
            throw new Error("id no encontrado")
        }
        return newUser
    }
    async buscarIdDeUsuario(usuario){
        const usuarioEncontrado = await this.#usersDB.findOne({email: usuario.email}).lean()
        const id = usuarioEncontrado._id
        return id
    }
    async existeEmail(gmail){
        const usuario = await this.#usersDB.findOne({email: gmail}).lean()
        if(!usuario){
            return false
        }else{
            return usuario
        }
    }
    async actualizarUltimoLogout(usuario){
        // const currentDate = new Date()
        // const localTime = DateTime.fromJSDate(currentDate, { zone: 'local' })
        // console.log("localTime: ", localTime)
        // const formatDate = localTime.toFormat("yyyy-MM-dd hh:mm:ss a ZZZZ")
        // console.log("formatDate: ", formatDate)
        const date = new Date()
        date.getHours(date.setHours()-3)

        const nuevoUsuario = new User({
            first_name: usuario.first_name,
            last_name: usuario.last_name,
            email: usuario.email,
            age: usuario.age,
            password: usuario.password,
            cartID: usuario.cartID,
            role: usuario.role,
            last_connection: date,
            documents: usuario.documents
        })
        //
        await this.#usersDB.updateOne(usuario, nuevoUsuario)
        return nuevoUsuario
    }
    async agregarDocumento(id, nombre, link){
        const usuarioViejo = await this.#usersDB.findById(id).lean()
        let usuario = await this.#usersDB.findById(id).lean()
        if(usuario.documents){
            await usuario.documents.push({ name: nombre, reference: link })
        }else{
            usuario = {
                ...usuarioViejo,
                documents: {
                    name: nombre,
                    reference: link
                }
            }
        }
        await this.#usersDB.updateOne(usuarioViejo, usuario)
        return usuario
    }
    async buscarPorEmail(emailABuscar){
        const usuario = await this.#usersDB.findOne({email: emailABuscar}).lean()
        return usuario
    }
    async obtenerTodosLosUsuarios(){
        const usuarios = await this.#usersDB.find().lean()
        return usuarios
    }
    async borrarUsuarioPorID(id){
        const usuario = await this.#usersDB.findByIdAndRemove(id)
        return usuario
    }
    async buscarUsuarioPorID(id){
        const usuario = await this.#usersDB.findById(id).lean()
        console.log("fallo: ", usuario)
        return usuario
    }
    async modificarRol(usuarioViejo, usuarioActualizado){
        const usuario = await this.#usersDB.updateOne(usuarioViejo, usuarioActualizado).lean()
        console.log("adentro del model: ", usuario)
        return usuario
    }
    async actualizarUltimaConexionGithub(usuario){
        // const date = new Date()
        // console.log("date: ", date)
        // date.setHours(date.getHours()-3)
        // date.toLocaleString()
        // console.log("actualizada: ", date)
        const nuevoUsuario = {
            email: usuario.email,
            cartID: usuario.cartID,
            role: usuario.role,
            //last_connection: new Date().toLocaleString(),
            last_connection: new Date().toLocaleTimeString(),
            documents: usuario.documents
        }
        await this.#usersDB.updateOne(usuario, nuevoUsuario)
        return nuevoUsuario
    }
}

export const UsersMongooseManager = new usersManager()
