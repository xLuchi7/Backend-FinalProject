import { cartDao } from "../dao/daoFactory.js";
import { cartMongooseManager } from "../dao/MongooseManagers/CartManager.js";

class CartRepository{
    constructor(dao){
        this.dao = dao
    }

    async createNewCart(){
        return await this.dao.createNewCart()
    }
    async addProductToCart(cid, pid){
        return await this.dao.addProductToCart(cid, pid)
    }
    async getProducts(id){
        return await this.dao.getProducts(id)
    }
    async deleteProduct(cid, pid){
        return await this.dao.deleteProduct(cid, pid)
    }
    async deleteCart(cid){
        return await this.dao.deleteCart(cid)
    }
    async updateQuantity(cid, pid, qty){
        return await this.dao.updateQuantity(cid, pid, qty)
    }
}

export const cartRepository = new CartRepository(cartDao)