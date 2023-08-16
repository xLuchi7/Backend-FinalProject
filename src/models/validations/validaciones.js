import { ErrorArgumentoInvalido } from "../errors/ArgumentoInvalidoError.js"
import { ErrorProductoInvalido } from "../errors/ProductoInvalido.js"

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
  const esValido = validarEmail.test(email)
  if(esValido == false){
    throw new ErrorArgumentoInvalido("el campo debe ser un email valido")
  }
  return email
}

export function validarPrecio(precio){
  const esNumero = soloNumeros(precio)
  if(esNumero == false){
    throw new ErrorProductoInvalido("el precio debe ser un numero")
  }
  if(precio < 1){
    throw new ErrorProductoInvalido("el precio debe ser mayor que 0")
  }
  return precio
}

export function validarStock(stock){
  if(stock < 0){
    throw new ErrorProductoInvalido("el stock debe ser mayor o igual que 0")
  }
  return stock
}

export function validarCodigo(codigo){
  if(codigo < 0){
    throw new ErrorProductoInvalido("el codigo debe ser mayor o igual que 0")
  }
  return codigo
}