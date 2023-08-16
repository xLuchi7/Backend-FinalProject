import multer from "multer";
import { usuariosService } from "../services/usuarioService.js";

let nombreParaGuardarElArchivo
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './static/images')
    },
    filename: function(req, file, cb){
        nombreParaGuardarElArchivo = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname
        cb(null, nombreParaGuardarElArchivo)
    }
})
const extractor = multer({ storage })
const extraerFoto = extractor.single('document')

export async function postDocumentsController(req, res, next) {
    try {
        console.log("nombre: ", req.file.originalname)
        console.log("link: ", nombreParaGuardarElArchivo)
        console.log("uid: ", req.params.uid)
        const usuarioActualizado = await usuariosService.agregarDocumento(req.params.uid, req.file.originalname, nombreParaGuardarElArchivo)
        console.log("actualizado: ", usuarioActualizado)
        res.status(201).json(req.file)
    } catch (error) {
        res.status(400)
    }
}