import { FastifyInstance } from 'fastify';
import * as productController from '../controllers/products/controller';
import { productSchema } from '../models/products';
import { zodToJsonSchema } from '../utils/schemas';


export default async (app: FastifyInstance) => {
  // Get all products
  app.get('/', productController.getProductsHandler);
  
  app.get('/products/:id/reviews', productController.getProductHandler);
  http://localhost:3000/api/products?page=1&limit=5&category_id=1

  // Get single product by ID
  app.get('/:id', productController.getProductHandler);
  
  http://localhost:3000/api/products/3
  // Create new product
  app.post('/newproduct', {
    handler: productController.createProductHandler,
    schema: {
      body:zodToJsonSchema( productSchema)
    }
  });
  
  // Update product
  app.put('/:id', {
    handler: productController.updateProductHandler,
    schema: {
      body:zodToJsonSchema( productSchema.partial())
    }
  });

  
  // Delete product
  app.delete('/:id', productController.deleteProductHandler);
 
 
 
  

};