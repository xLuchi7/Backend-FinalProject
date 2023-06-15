import bcrypt from 'bcrypt';
import { ErrorLogin } from '../models/errors/ErrorLogin.js';

export function hashear(frase){
    return bcrypt.hashSync(frase, bcrypt.genSaltSync(10))
}
export function validarQueSeanIguales(recibida, almacenada){
    if(almacenada == undefined){
        throw new ErrorLogin("Error al Iniciar Sesion")
    }
    const estado = bcrypt.compareSync(recibida, almacenada)
    if(estado == false){
        throw new ErrorLogin("Error al Iniciar Sesion")
    }
    return bcrypt.compareSync(recibida, almacenada)
}