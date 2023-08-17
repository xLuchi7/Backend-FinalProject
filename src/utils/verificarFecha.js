export function verificarFecha(usuario){
    const fechaaLimite = new Date()
    fechaaLimite.setHours(fechaaLimite.getHours()-3)
    fechaaLimite.setDate(fechaaLimite.getDate()-2)
    const fechaConvertida = new Date(usuario.last_connection)

    if(fechaaLimite >  fechaConvertida){
        return true 
    }else{
        return false
    }
}