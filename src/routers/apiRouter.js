import express, { Router } from 'express';
import { productsRouter } from './productsRouter.js';
import { cartRouter } from './cartRouter.js';

export const apiRouter = Router();

apiRouter.use((req, res, next) => {
    console.log("cargando api router")
    next()
})

apiRouter.use(express.json())
apiRouter.use(express.urlencoded({extended: true}))

apiRouter.use('/', productsRouter)
apiRouter.use('/', cartRouter)