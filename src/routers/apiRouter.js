import express, { Router } from 'express';
import { deleteCurrentSessionController, postSessionsController } from '../controllers/sessionController.js';
import { autenticacion } from '../utils/autenticacion.js';
import { ErrorHandler } from '../middlewares/ErrorHandler.js';
import { winstonLogger } from '../utils/winstonLogger.js';
import { productService } from '../services/productService.js';
import multer from 'multer';
import { postRegisterController } from '../controllers/postRegisterController.js';
import { postProductToCart } from '../controllers/addProductToCartController.js';
import { postCambiarContraController } from '../controllers/cambiarContraController.js';
import { postDocumentsController } from '../controllers/postDocumentsController.js';
import { postModificarRol } from '../controllers/modificarRolController.js';
import { postEliminarUsuario } from '../controllers/eliminarUsuarioController.js';

export const apiRouter = Router();

apiRouter.use(express.json())
apiRouter.use(express.urlencoded({extended: true}))

//login post
apiRouter.post('/sesiones', postSessionsController)

//register post
apiRouter.post('/usuarios', postRegisterController)

//delete sesion
apiRouter.delete('/sesiones', deleteCurrentSessionController)

//borrar producto
apiRouter.get('/deleteProduct/:pid', async (req, res) => {
    try {
        const productoBorrado = await productService.borrarProducto(req.params.pid)
        res.redirect('/realtimeproducts')
    } catch (error) {
        winstonLogger.info("error al borrar el producto")
    }
})

//agregar producto al carrito
apiRouter.post('/addProductToCart/:pid', autenticacion, postProductToCart)

//confirmar cambio de contra
apiRouter.post('/cambiarContrasenia/:uid', postCambiarContraController)

//post de documentos
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
apiRouter.post('/users/:uid/documents', extraerFoto, postDocumentsController)

//borrar un usuario
apiRouter.post('/eliminarUsuario/:uid', postEliminarUsuario) 

//modicar rol
apiRouter.post('/modificarRol/:uid', postModificarRol)

apiRouter.use(ErrorHandler)
