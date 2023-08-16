export function verificarFecha(usuario){
    const fechaaLimite = new Date()
    fechaaLimite.setHours(fechaaLimite.getHours()-3)
    //fechaaLimite.setDate(fechaaLimite.getDate()-2)
    fechaaLimite.setDate(fechaaLimite.getDate()-3)
    console.log("limite: ", fechaaLimite)
    //console.log("last connection: ", usuario.last_connection)
    //const fechaParaComparar = fechaaLimite.toLocaleString()
    //console.log("la fecha limite es: ", fechaParaComparar)
    const fechaConvertida = new Date(usuario.last_connection)
    fechaConvertida.setHours(fechaConvertida.getHours()-3)
    console.log("convertida: ", fechaConvertida)
    if(fechaaLimite > fechaConvertida){
        console.log("este tiene q ser borrado")
        return true
        //return false
        
    }else{
        console.log("este NO tiene q ser borrado")
        return false
    }
}