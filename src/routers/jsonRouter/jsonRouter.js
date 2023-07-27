import { Router } from 'express'
import { jsonCartRouter } from './jsonCartRouter.js'
import { jsonProductsRouter } from './jsonProductsRouter.js'

//Esto lo hicimos al principio de la cursada que solo devolvia json, lo deje aca para no borrarlo

export const jsonRouter = Router()

jsonRouter.use('/json', jsonCartRouter)
jsonRouter.use('/json', jsonProductsRouter)