import { Router } from 'express';
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Ecommerce',
        description:
          'Un sitio web donde podes comprar productos',
      },
    },
    apis: ['./docs/**/*.yaml'],
}

const specs = swaggerJsdoc(options)

export const docsRouter = Router()

docsRouter.use('/documentacion', swaggerUi.serve, swaggerUi.setup(specs))