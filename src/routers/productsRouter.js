import express, { Router } from 'express';
import { ProductManager } from '../dao/LocalStorage/ProductManager.js';
import { Product } from '../entidades/Product.js';
import { randomUUID } from 'crypto';
import { ProductMongooseManager } from '../dao/MongooseManagers/ProductMongooseManager.js';
import { cartMongooseManager } from '../dao/MongooseManagers/CartManager.js';

export const productsRouter = Router();

const productsManager = new ProductManager('./database/products.json');

productsRouter.get('/productss', async (req, res, next) => { 
    try {
        const cantProducts = await ProductMongooseManager.getCantProducts(req.query.limit);
        res.json(cantProducts);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})
productsRouter.get('/productss/:pid', async (req, res, next) => { 
    try {
        const product = await ProductMongooseManager.obtenerSegunId(req.params.pid);
        res.json(product);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})
productsRouter.post('/products', async (req, res, next) => { 
    try {
        const product = new Product({
            title: "PC GAMER",
            description: "Intel I9 10700K",
            price: "470000",
            thumbnail: "https://www.fullh4rd.com.ar/img/productos/Pics_Prod/monitor-gamer-27-benq-zowie-xl2731k-dark-grey-0.jpg",
            code: "5",
            stock: "14",
            id: randomUUID()
        })
        const agregado = await ProductMongooseManager.guardar(product)
        res.json(agregado)
    } catch (error) {
        res.status(404).json({ message: error.message })
    } 
})
productsRouter.put('/products/:pid', async (req, res, next) => { 
    let productoNuevo
    try {
        productoNuevo = new Product({
            title: "PRODUCTO NUEVO",
            description: "Intel I9 10700K",
            price: "470000",
            thumbnail: "https://www.fullh4rd.com.ar/img/productos/Pics_Prod/monitor-gamer-27-benq-zowie-xl2731k-dark-grey-0.jpg",
            code: "5",
            stock: "7",
            id: req.params.pid
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
    try {
        const productoReemplazado = await ProductMongooseManager.reemplzarProducto(req.params.pid, productoNuevo)
        res.json(productoReemplazado);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})
productsRouter.delete('/products/:pid', async (req, res, next) => { 
    try {
        const borrado = await ProductMongooseManager.borrarProductoPorId(req.params.pid)
        res.json(borrado)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})
