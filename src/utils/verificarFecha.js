export function verificarFecha(usuario){
    const fechaaLimite = new Date()
    fechaaLimite.setHours(fechaaLimite.getHours()-3)
    //fechaaLimite.setDate(fechaaLimite.getDate()-2)
    fechaaLimite.setDate(fechaaLimite.getDate()-3)
    console.log("limite: ", fechaaLimite)
    ///////////
    //const lastConnection = usuario.last_connection
    //console.log("UT: ", lastConnection)
    //const fechaConvertida = new Date(usuario.last_connection)
    const localizedDateString = usuario.last_connection // Example localized date string

    const dateParts = localizedDateString.match(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+) (AM|PM)/);
    let parsedDate
    if (dateParts) {
    const [, month, day, year, hours, minutes, seconds, ampm] = dateParts;

    let parsedHours = parseInt(hours);
    if (ampm === "PM" && parsedHours !== 12) {
        parsedHours += 12;
    } else if (ampm === "AM" && parsedHours === 12) {
        parsedHours = 0;
    }

        parsedDate = new Date(year, month - 1, day, parsedHours, parseInt(minutes), parseInt(seconds));

        console.log(parsedDate); // Outputs: Wed Aug 16 2023 20:31:19 GMT+0000 (Coordinated Universal Time)
    } else {
        console.log("Could not parse the date string.");
    }

    console.log("convertida: ", parsedDate)
    if(fechaaLimite > fechaConvertida){
        console.log("este tiene q ser borrado")
        return true
        //return false
        
    }else{
        console.log("este NO tiene q ser borrado")
        return false
    }
}