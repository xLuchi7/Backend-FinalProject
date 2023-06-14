import { validarApellido, validarEdad, validarEmail, validarNombre } from "../validations/validaciones.js"

export class User {
    constructor({ password, first_name, last_name, age, email, cartID, role }) {
        this.password = password,
        this.first_name = validarNombre(first_name),
        this.last_name = validarApellido(last_name),
        this.age = validarEdad(age),
        this.email = validarEmail(email),
        this.cartID = cartID,
        this.role = role
    }
}