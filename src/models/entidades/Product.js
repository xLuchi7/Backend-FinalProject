import { validarCodigo, validarPrecio, validarStock } from "../validations/validaciones.js";
import { randomUUID } from 'crypto';

export class Product{
    constructor({title, description, price, thumbnail, code, stock, id}) {
        this.title = title,
        this.description = description,
        this.price = validarPrecio(price),
        //this.price = price,
        this.thumbnail = thumbnail,
        this.code = validarCodigo(code),
        //this.code = code,
        this.stock = validarStock(stock),
        //this.stock = stock,
        this.id = randomUUID(id)
    }
}