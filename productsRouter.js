import express, { Router } from 'express';
import { ProductManager } from './ProductManager.js';
import { Product } from './Product.js';
import { randomUUID } from 'crypto';

export const productsRouter = Router();

const productsManager = new ProductManager('./database/products.json');

productsRouter.get('/products', async (req, res, next) => { 
    try {
        const cantProducts = await productsManager.getCantProducts(req.query.limit);
        res.json(cantProducts);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})
productsRouter.get('/products/:pid', async (req, res, next) => { 
    try {
        const product = await productsManager.getProductById(req.params.pid);
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
        const agregado = await productsManager.guardarProducto(product)
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
        const productoReemplazado = await productsManager.reemplzarProducto(req.params.pid, productoNuevo)
        res.json(productoReemplazado);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})
productsRouter.delete('/products/:pid', async (req, res, next) => { 
    try {
        const borrado = await productsManager.borrarProductoPorId(req.params.pid)
        res.json(borrado)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})
