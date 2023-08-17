export function verificarFecha(usuario){
    const fechaaLimite = new Date()
    fechaaLimite.setHours(fechaaLimite.getHours()-3)
    //fechaaLimite.setDate(fechaaLimite.getDate()-2)
    fechaaLimite.setDate(fechaaLimite.getDate()-2)
    //fechaaLimite.toLocaleDateString()
    console.log("limite: ", fechaaLimite)
    ///////////
    //console.log("UT: ", usuario.last_connection)
    const fechaConvertida = new Date(usuario.last_connection)
    //fechaConvertida.setHours(fechaConvertida.getHours()-3)
    //const fechaConvertida = usuario.last_connection
    //const fechaParseada = new Date(fechaConvertida)
    //console.log("fecha parseada" , fechaParseada)

    console.log("convertida: ", fechaConvertida)
    if(fechaaLimite >  fechaConvertida){
        console.log("este tiene q ser borrado")
        return true
        //return false
        
    }else{
        console.log("este NO tiene q ser borrado")
        return false
    }
}