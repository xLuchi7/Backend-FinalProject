import { faker } from '@faker-js/faker';
import { Cart } from "../src/models/entidades/Cart.js";
import { randomUUID } from 'crypto';
import { productService } from '../src/services/productService.js';

function randomNumbers(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function crearCarritoMockValido(){
    return new Cart({
        id: randomUUID(),
        products: {_id: randomUUID(), quantity: randomNumbers(1, 10)}
    })
}

export function entregarCarritosValidos(){
    let carritos = []
    for (let i = 0; i < 10; i++) {
        carritos[i] = crearCarritoMockValido()
    }
    return carritos
}

////////////////////////////////////////////////////////

async function validarProducto(){
    const idd = randomUUID()
    const producto = await productService.obtenerUnProducto(idd)
    if(producto){
        return idd
    }else{
        return false
    }
}

async function crearCarritoMockInvalido(){
    const validacion = await validarProducto()
    if(validacion == false){
        throw new Error("Error, El producto no fue encontrado")
    }else{
        return new Cart({
            id: randomUUID(),
            products: {_id: validarProducto(), quantity: randomNumbers(1, 10)}
        })
    }
}

export function entregarCarritosInvalidos(){
    let carritos = []
    for (let i = 0; i < 10; i++) {
        carritos[i] = crearCarritoMockInvalido()
    }
    return carritos
}