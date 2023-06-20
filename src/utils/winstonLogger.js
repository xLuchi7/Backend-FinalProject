import fs from 'fs/promises'

class Logger {
  constructor(entorno, nivelDeImportancia) {
    this.entorno = entorno
    this.nivelDeImportancia = nivelDeImportancia
  }

  log(nivel, mensaje) {
    if (nivel <= this.nivelDeImportancia) {
      const lineaRegistro = `${new Date().toLocaleString()}: ${mensaje}` + '\n'
      if (this.entorno === 'development') {
        
      } else {
        fs.appendFile('eventos.log', lineaRegistro)
      }
    }
  }
}

export const logger = new Logger("development", 3)

// -----------------------------------

import winston from 'winston'

// const levels = {
//     fatal: 0,
//     error: 1,
//     warning: 2,
//     info: 3,
//     debug: 4,
// }

const winstonLoggerDev = winston.createLogger({
  // levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
    })
  ]
})

const winstonLoggerProd = winston.createLogger({
  // levels,
  transports: [
    new winston.transports.File({
      level: "http",
      filename: 'events.log'
    })
  ]
})

export let winstonLogger = winstonLoggerDev
// if (NODE_ENV === 'production') {
//   winstonLogger = winstonLoggerProd
// } else {
//   winstonLogger = winstonLoggerDev
// }