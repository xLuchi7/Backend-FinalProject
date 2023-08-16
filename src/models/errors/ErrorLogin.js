export class ErrorLogin extends Error {
    constructor(){
        super()
        this.tipo = "CREDENCIALES INVALIDAS"
    }
}