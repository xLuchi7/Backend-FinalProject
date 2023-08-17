export function codificarHora(hora) {
    return hora.getTime()
}

export function decodificarHora(horaCodificada) {
    return new Date(horaCodificada)
}

export function compararConHoraActual(horaCodificada) {
    const horaDecodificada = decodificarHora(horaCodificada);
    const horaActual = new Date();
    const horaLimite = new Date(horaDecodificada)
    horaLimite.setMinutes(horaLimite.getMinutes()+30)
  
    if (horaActual > horaLimite) {
      return false
    } else if (horaLimite > horaActual) {
      return true
    } else {
      return true
    }
}