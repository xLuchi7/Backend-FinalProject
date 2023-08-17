export function verificarFecha(usuario){
    const fechaaLimite = new Date()
    fechaaLimite.setHours(fechaaLimite.getHours()-3)
    //fechaaLimite.setDate(fechaaLimite.getDate()-2)
    fechaaLimite.setDate(fechaaLimite.getDate()-3)
    console.log("limite: ", fechaaLimite)
    ///////////
    console.log("UT: ", usuario.last_connection)
    const fechaConvertida = new Date(usuario.last_connection)

    console.log("convertida: ", fechaaLimite)
    if(fechaaLimite > fechaConvertida){
        console.log("este tiene q ser borrado")
        //return true
        return false
        
    }else{
        console.log("este NO tiene q ser borrado")
        return false
    }
}