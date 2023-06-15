import { ErrorArgumentoInvalido } from "../models/errors/ArgumentoInvalidoError.js"
import { ErrorLogin } from "../models/errors/ErrorLogin.js"
import { ErrorProductoInvalido } from "../models/errors/ProductoInvalido.js"

export function ErrorHandler(error, req, res, next){
    if(error instanceof ErrorArgumentoInvalido){
        console.log("Error: ", error)
        res.status(400).json({ estado: "error", tipo: error.tipo, descripcion: error.descripcion })
    }
    if(error instanceof ErrorProductoInvalido){
        console.log("Error: ", error)
        //res.status(400)
    }
    if(error instanceof ErrorLogin){
        console.log("Error: ", error)
        //res.status(401).json({ estado: "error", tipo: error.tipo, descripcion: error.descripcion })
    }
    //res.json({ estado: "error", tipo: error.tipo, descripcion: error.descripcion })
}