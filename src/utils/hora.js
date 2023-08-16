export function codificarHora(hora) {
    return hora.getTime()
}

export function decodificarHora(horaCodificada) {
    return new Date(horaCodificada)
}

export function compararConHoraActual(horaCodificada) {
    const horaDecodificada = decodificarHora(horaCodificada);
    const horaActual = new Date();
    console.log("click usuario: ", horaDecodificada)
    console.log("hora actual: ", horaActual)
    const horaLimite = new Date(horaDecodificada)
    horaLimite.setMinutes(horaLimite.getMinutes()+30)
    console.log("click usuario mas 30: ", horaLimite)
  
    if (horaActual > horaLimite) {
      console.log("exipiro el tiempo para cambiar la contra")
      return false
    } else if (horaLimite > horaActual) {
      console.log("Puede cambiar la contra")
      return true
    } else {
      console.log("Puede cambiar la contra")
      return true
    }
}