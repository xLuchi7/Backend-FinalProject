import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import { User } from '../src/models/entidades/User.js';

function randomNumbers(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomEmail() {
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var email = '';
  
    for (var i = 0; i < 10; i++) {
      email += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    email += '@example.com';
  
    return email;
}


function crearSesionMockValido(){
    return new User({
        password: faker.lorem.words(1),
        first_name: faker.lorem.words(1),
        last_name: faker.lorem.words(1),
        age: randomNumbers(1, 120),
        email: generateRandomEmail(),
        cartID: randomUUID(),
        role: faker.lorem.words(1)
    })
}

export function entregarSesionesValidos(){
    let sesiones = []
    for (let i = 0; i < 10; i++) {
        sesiones[i] = crearSesionMockValido()
    }
    return sesiones
}

////////////////////////////////////////////////////////

function crearSesionMockInvalido(){
    return new User({
        password: randomNumbers(1, 120),
        first_name: randomNumbers(1, 120),
        last_name: randomNumbers(1, 120),
        age: faker.lorem.words(1),
        email: generateRandomEmail(),
        cartID: randomUUID(),
        role: faker.lorem.words(1)
    })
}

export function entregarSesionesInvalidos(){
    let sesiones = []
    for (let i = 0; i < 10; i++) {
        sesiones[i] = crearSesionMockInvalido()
    }
    return sesiones
}