export class ErrorLogin extends Error {
    constructor(descripcion){
        super()
        this.tipo = "ERROR AL INICIAR SESION"
        this.descripcion = descripcion
    }
}