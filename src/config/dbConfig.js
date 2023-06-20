import { winstonLogger } from "../utils/winstonLogger.js"

export const TIPO_PERSISTENCIA = process.argv[3] || 'mongoose'
winstonLogger.info("TIPO DE PERSISTENCIA: "+ TIPO_PERSISTENCIA)
