import { validarCodigo, validarPrecio, validarStock } from "../validations/validaciones.js";
import { randomUUID } from 'crypto';

export class Product{
    constructor({title, description, price, thumbnail, code, stock, owner, id}) {
        this.title = title,
        this.description = description,
        this.price = validarPrecio(price),
        this.thumbnail = thumbnail,
        this.code = validarCodigo(code),
        this.stock = validarStock(stock),
        this.owner = owner
        this.id = randomUUID(id)
    }
}