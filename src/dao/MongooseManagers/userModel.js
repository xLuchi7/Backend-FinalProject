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
    role: { type: String }
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
        const usuarioEncontrado = await this.#usersDB.findOne(usuario)
        const id = usuarioEncontrado._id
        return id
    }
}

export const UsersMongooseManager = new usersManager()
