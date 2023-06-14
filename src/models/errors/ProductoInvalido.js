export class ErrorProductoInvalido extends Error {
    constructor(descripcion){
        super()
        this.tipo = "PRODUCTO INVALIDO"
        this.descripcion = descripcion
    }
}