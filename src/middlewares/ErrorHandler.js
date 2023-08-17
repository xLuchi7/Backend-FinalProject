import { ErrorArgumentoInvalido } from "../models/errors/ArgumentoInvalidoError.js"
import { ErrorLogin } from "../models/errors/ErrorLogin.js"
import { ErrorProductoInvalido } from "../models/errors/ProductoInvalido.js"
import { winstonLogger } from "../utils/winstonLogger.js"

export function ErrorHandler(error, req, res, next){
    if(error instanceof ErrorArgumentoInvalido){
        winstonLogger.error(error)
        res.status(400).json({ estado: "error", tipo: error.tipo, descripcion: error.descripcion })
    }
    if(error instanceof ErrorProductoInvalido){
        winstonLogger.error(error)
    }
    if(error instanceof ErrorLogin){
        winstonLogger.error(error)
        res.status(400).json({ estado: "error", tipo: error.tipo })
    }
}