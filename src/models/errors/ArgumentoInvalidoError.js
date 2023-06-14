export class ErrorArgumentoInvalido extends Error {
    constructor(descripcion){
        super()
        this.tipo = "ARGUMENTO INVALIDO"
        this.descripcion = descripcion
    }
}