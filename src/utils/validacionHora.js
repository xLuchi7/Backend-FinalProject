import { compararConHoraActual, decodificarHora } from "./hora.js"

export function validacionHora(req, res, next){
    const horaDecodificada = decodificarHora(parseInt(req.params.hora))
    console.log("decodificada:", horaDecodificada)
    const horaValida = compararConHoraActual(parseInt(req.params.hora))
    if(horaValida == true){
        next()
    }else{
        //alert("expiro el tiempo para cambiar la contraseña")
        res.redirect('/products')
    }
}