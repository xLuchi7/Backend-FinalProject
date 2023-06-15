export class ErrorLogin extends Error {
    constructor(descripcion){
        super()
        this.tipo = "CREDENCIALES INVALIDAS"
        this.descripcion = descripcion
    }
}