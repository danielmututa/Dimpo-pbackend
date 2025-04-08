import { FastifyInstance } from 'fastify';
import * as productController from '../controllers/products/controller';
import { productSchema } from '../models/products';
import { zodToJsonSchema } from '../utils/schemas';


export default async (app: FastifyInstance) => {
  // Get all products
  app.get('/', productController.getProductsHandler);
  
 
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
 
 
 


 // Cart routes
 app.post('/:userId/cart', {
  handler: productController.addProductToCartHandler,
  schema: {
    body: {
      type: 'object',
      properties: {
        productId: { type: 'number' },
        quantity: { type: 'number', minimum: 1 }
      },
      required: ['productId', 'quantity']
    }
  }
});

app.get('/:userId/cart', productController.getUserCartHandler);

app.put('/:userId/cart/:cartItemId', {
  handler: productController.updateCartItemQuantityHandler,
  schema: {
    body: {
      type: 'object',
      properties: {
        quantity: { type: 'number', minimum: 1 }
      },
      required: ['quantity']
    }
  }
});

http://localhost:3000/api/products/:userId/cart/29



app.delete('/:userId/cart/:cartItemId', productController.deleteCartItemHandler);



  

};