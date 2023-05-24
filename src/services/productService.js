import productModel from "../dao/MongooseManagers/ProductMongooseManager.js"
import { productRepository } from "../repositories/productRepository.js"

class ProductService{
    async obtenerPaginado(query){
        let sortNumber
        if (query.sort == 'asc') {
            sortNumber = 1
        }
        if (query.sort == 'desc') {
            sortNumber = -1
        }

        const criterioBusqueda = {}
        const opcionesPaginacion = {
            sort: {price: sortNumber},
            lean: true,
            limit: query.limit ?? 4,
            page: query.page ?? 1,
        }
        const result = await productModel.paginate(criterioBusqueda, opcionesPaginacion)
        return result
    }
    async obtenerProductos(){
        const productos = await productRepository.obtenerTodos()
        return productos
    }
}

export const productService = new ProductService()