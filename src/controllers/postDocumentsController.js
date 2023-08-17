import multer from "multer";
import { usuariosService } from "../services/usuarioService.js";

export async function postDocumentsController(req, res, next) {
    try {
        const usuarioActualizado = await usuariosService.agregarDocumento(req.params.uid, req.file.originalname, nombreParaGuardarElArchivo)
        res.status(201).json(req.file)
    } catch (error) {
        res.status(400)
    }
}