import { compararConHoraActual, decodificarHora } from "./hora.js"

export function validacionHora(req, res, next){
    const horaDecodificada = decodificarHora(parseInt(req.params.hora))
    const horaValida = compararConHoraActual(parseInt(req.params.hora))
    if(horaValida == true){
        next()
    }else{
        res.redirect('/products')
    }
}