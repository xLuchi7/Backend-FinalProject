import { Product } from "../src/models/entidades/Product.js";
import { faker } from '@faker-js/faker';

function randomNumbers(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function crearProductoMockValido(){
    return new Product({
        title: faker.lorem.words(1),
        description: faker.lorem.words(3),
        price: randomNumbers(1, 200000),
        thumbnail: faker.lorem.words(5),
        description: faker.lorem.words(4),
        code: randomNumbers(1, 999),
    })
}

export function entregarProductosValidos(){
    let products = []
    for (let i = 0; i < 10; i++) {
        products[i] = crearProductoMockValido()
    }
    return products
}

////////////////////////////////////////////////////////

function crearProductoMockInvalido(){
    return new Product({
        title: randomNumbers(1, 999),
        description: faker.lorem.words(20),
        price: randomNumbers(-100, 200000),
        thumbnail: faker.lorem.words(50),
        description: faker.lorem.words(20),
        code: randomNumbers(-500, 100),
    })
}

export function entregarProductosInvalidos(){
    let products = []
    for (let i = 0; i < 10; i++) {
        products[i] = crearProductoMockInvalido()
    }
    return products
}