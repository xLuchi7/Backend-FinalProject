import { ErrorArgumentoInvalido } from "../errors/ArgumentoInvalidoError.js"

function soloLetras(palabra){
  return /^[A-Za-z]+$/.test(palabra)
}

function soloNumeros(numero){
  return /^[0-9]+$/.test(numero)
} 

export function validarNombre(valor) {
  const string = soloLetras(valor)
  if(string == false){
    throw new ErrorArgumentoInvalido(`el campo nombre debe contener letras unicamente`)
  }
  return valor
}

export function validarApellido(valor) {
  const string = soloLetras(valor)
  if(string == false){
    throw new ErrorArgumentoInvalido(`el campo apellido debe contener letras unicamente`)
  }
  return valor
}

export function validarEdad(edad){
  const esNum = soloNumeros(edad)
  if(esNum == false){
    throw new ErrorArgumentoInvalido("el campo edad debe ser un numero")
  }
  if(edad < 0){
    throw new ErrorArgumentoInvalido("el campo edad debe ser un numero entero positivo")
  }
  return edad
}

export function validarEmail(email){
  const validarEmail = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/
  //const validarEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const esValido = validarEmail.test(email)
  if(esValido == false){
    throw new ErrorArgumentoInvalido("el campo debe ser un email valido")
  }
  return email
}