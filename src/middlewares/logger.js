import { winstonLogger } from "../utils/winstonLogger.js"

export const logger = (req, res, next) => {
    req.logger = winstonLogger
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}