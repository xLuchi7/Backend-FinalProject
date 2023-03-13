import express, { Router } from 'express';
import { randomUUID } from 'crypto';
import { CartManager } from './CartManager.js';
import { Cart } from './Cart.js';

export const cartRouter = Router();

const cartManager = new CartManager('./database/carrito.json', './database/products.json');

cartRouter.post('/cart', async (req, res, next) => { 
    try {
        const newCart = await cartManager.createCart()
        res.json(newCart)
    } catch (error) {
        res.status(404).json({ message: error.message })
    } 
})

cartRouter.get('/cart/:cid', async (req, res, next) => { 
    try {
        const products = await cartManager.getProducts(req.params.cid)
        res.json(products);
    } catch (error) {
        res.status(404).json({ message: error.message })
    } 
})

cartRouter.post('/cart/:cid/product/:pid', async (req, res, next) => { 
    try {
        const product = await cartManager.addProductToCart(req.params.cid, req.params.pid)
        res.send(product)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }  
})

cartRouter.delete('/cart', async (req, res, next) => { 
    try {
        
    } catch (error) {
        
    }  
})

// cartRouter.get('/cart', async (req, res, next) => { 
//     try {
//         const ver = await cartManager.verCarrito()
//         res.json(ver);
//     } catch (error) {
        
//     } 
// })