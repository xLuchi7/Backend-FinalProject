import express, { Router } from 'express';
import { randomUUID } from 'crypto';
import { CartManager } from '../dao/MongooseManagers/CartManager.js';
import { Cart } from '../entidades/Cart.js';
import { cartMongooseManager } from '../dao/MongooseManagers/CartManager.js';

export const cartRouter = Router();

const cartManager = new CartManager('./database/carrito.json', './database/products.json');

cartRouter.post('/cart', async (req, res, next) => { 
    try {
        const newCart = await cartMongooseManager.createNewCart()
        res.json(newCart)
    } catch (error) {
        res.status(404).json({ message: error.message })
    } 
})

cartRouter.get('/cart/:cid', async (req, res, next) => { 
    try {
        const products = await cartMongooseManager.getProducts(req.params.cid)
        res.json(products);
    } catch (error) {
        res.status(404).json({ message: error.message })
    } 
})

cartRouter.post('/cart/:cid/product/:pid', async (req, res, next) => { 
    try {
        const product = await cartMongooseManager.addProductToCart(req.params.cid, req.params.pid)
        res.send(product)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }  
})

cartRouter.delete('/cart/:cid/product/:pid', async (req, res, next) => { 
    try {
        const product = await cartMongooseManager.deleteProduct(req.params.cid, req.params.pid)
        res.send(product)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }  
})
cartRouter.delete('/cart/:cid', async (req, res, next) => { 
    try {
        const product = await cartMongooseManager.deleteCart(req.params.cid)
        res.send(product)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }  
})
cartRouter.put('/cart/:cid/product/:pid/:qty', async (req, res, next) => { 
    try {
        const product = await cartMongooseManager.updateQuantity(req.params.cid, req.params.pid, req.params.qty)
        res.send(product)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }  
})