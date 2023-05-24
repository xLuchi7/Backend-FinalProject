import { productsDao } from "../dao/daoFactory.js";
import { ProductMongooseManager } from "../dao/MongooseManagers/ProductMongooseManager.js";

class ProductRepository{
    constructor(dao){
        this.dao = dao
    }

    async guardar(datosProducts){
        return await this.dao.guardar(datosProducts)
    }
    async obtenerTodos(){
        return await this.dao.obtenerTodos()
    }
    async obtenerSegunId(id){
        return await this.dao.obtenerSegunId(id)
    }
    async getCantProducts(cant){
        return await this.dao.getCantProducts(cant)
    }
    async borrarProductoPorId(id){
        return await this.dao.borrarProductoPorId(id)
    }
    async reemplzarProducto(id, nuevoProducto){
        return await this.dao.reemplzarProducto(id, nuevoProducto)
    }
}

export const productRepository = new ProductRepository(productsDao)