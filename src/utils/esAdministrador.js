import { usuariosService } from "../services/usuarioService.js"

// export async function esAdministrador(req, res, next){
//     try {
//         const usuario = await usuariosService.buscarUsuarioPorID(req.params.uid)
//         if(req.user.role == "admin"){
//             next()
//         }else{
//             res.redirect('/products')
//         }
//     } catch (error) {
//         res.redirect('/products')
//     }
//     // if (req.user.role == "admin") {
//     //     try {
//     //         const usuario = await usuariosService.buscarUsuarioPorID(req.params.uid)
//     //     } catch (error) {
            
//     //     }
//     //    next() 
//     // }else{
//     //     res.redirect('/products')
//     // }
// }
export  function esAdministrador(req, res, next){
    if(req.user){
        if (req.user.role == "admin") {
            next() 
        }else{
            res.redirect('/products')
        }
    }else{
        res.redirect('/products')
    }
}