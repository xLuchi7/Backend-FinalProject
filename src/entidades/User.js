function soloLetras(palabra){
    return /[a-z]+/.test(palabra)
}

function esEmail(email){
    let validarEmail = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/
    return validarEmail.test(email)
    //return email.includes('@')
}

export class User {
    constructor({ password, first_name, last_name, age, email, cartID, role }) {
        
        if(typeof password != 'string'){
            throw new Error('la constraseña debe ser una cadena de caracteres')
        }
        if(!password){
            throw new Error('la contraseña no puede estar vacia')
        }

        if(typeof first_name != 'string'){
            throw new Error('el nombre debe ser una cadena de caracteres')
        }
        if(!first_name){
            throw new Error('el nombre no puede estar vacio')
        }
        if(!soloLetras(first_name)){
            throw new Error("el nombre puede contener letras unicamente")
        }

        if(typeof last_name != 'string'){
            throw new Error('el apellido debe ser una cadena de caracteres')
        }
        if(!last_name){
            throw new Error('el apellido no puede estar vacio')
        }
        if(!soloLetras(last_name)){
            throw new Error("el apellido puede contener letras unicamente")
        }

        // if(typeof age != 'number' || isNaN(age)){
        //     throw new Error('la edad debe ser un numero')
        // }
        if(age < 0){
            throw new Error('la edad debe ser un numero entero positivo')
        }

        if(!esEmail(email)){
            throw new Error("el email debe ser valido")
        }
        
        this.password = password,
        this.first_name = first_name,
        this.last_name = last_name,
        this.age = age,
        this.email = email,
        this.cartID = cartID,
        this.role = role
    }
}