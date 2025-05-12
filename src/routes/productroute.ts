




// import { FastifyInstance } from 'fastify';
// import * as productController from '../controllers/products/controller';
// import { productSchema } from '../models/products';
// import { zodToJsonSchema } from '../utils/schemas';

// export default async (app: FastifyInstance) => {
//   // Get all products
//   app.get('/', productController.getProductsHandler);

//   // Get single product by ID
//   app.get('/:id', productController.getProductHandler);

//   // Create new product
//   app.post('/newproduct', {
//     handler: productController.createProductHandler,
//     // Remove schema validation for body to allow multipart/form-data
//     // Validation is handled manually in createProductHandler
//   });

//   // Update product
//   app.put('/:id', {
//     handler: productController.updateProductHandler,
//     schema: {
//       body: zodToJsonSchema(productSchema.partial()),
//     },
//   });

//   // Delete product
//   app.delete('/:id', productController.deleteProductHandler);

//   // Cart routes
//   app.post('/:userId/cart', {
//     handler: productController.addProductToCartHandler,
//     schema: {
//       body: {
//         type: 'object',
//         properties: {
//           productId: { type: 'number' },
//           quantity: { type: 'number', minimum: 1 },
//         },
//         required: ['productId', 'quantity'],
//       },
//     },
//   });

//   app.get('/:userId/cart', productController.getUserCartHandler);

//   app.put('/:userId/cart/:cartItemId', {
//     handler: productController.updateCartItemQuantityHandler,
//     schema: {
//       body: {
//         type: 'object',
//         properties: {
//           quantity: { type: 'number', minimum: 1 },
//         },
//         required: ['quantity'],
//       },
//     },
//   });

//   app.delete('/:userId/cart/:cartItemId', productController.deleteCartItemHandler);
// };








// import { FastifyInstance } from 'fastify';
// import * as productController from '../controllers/products/controller';
// import { productSchema } from '../models/products';
// import { zodToJsonSchema } from '../utils/schemas';

// export default async (app: FastifyInstance) => {
//   // Get all products
//   app.get('/', productController.getProductsHandler);

//   // Get single product by ID
//   app.get('/:id', productController.getProductHandler);

//   // Get all product images
//   app.get('/images', productController.getProductImagesHandler);

//   // Create new product
//   app.post('/newproduct', {
//     handler: productController.createProductHandler,
//     // Remove schema validation for body to allow multipart/form-data
//     // Validation is handled manually in createProductHandler
//   });

//   // Update product
//   app.put('/:id', {
//     handler: productController.updateProductHandler,
//     schema: {
//       body: zodToJsonSchema(productSchema.partial()),
//     },
//   });

//   // Delete product
//   app.delete('/:id', productController.deleteProductHandler);

//   // Cart routes
//   app.post('/:userId/cart', {
//     handler: productController.addProductToCartHandler,
//     schema: {
//       body: {
//         type: 'object',
//         properties: {
//           productId: { type: 'number' },
//           quantity: { type: 'number', minimum: 1 },
//         },
//         required: ['productId', 'quantity'],
//       },
//     },
//   });

//   app.get('/:userId/cart', productController.getUserCartHandler);

//   app.put('/:userId/cart/:cartItemId', {
//     handler: productController.updateCartItemQuantityHandler,
//     schema: {
//       body: {
//         type: 'object',
//         properties: {
//           quantity: { type: 'number', minimum: 1 },
//         },
//         required: ['quantity'],
//       },
//     },
//   });

//   app.delete('/:userId/cart/:cartItemId', productController.deleteCartItemHandler);
// };





import { FastifyInstance } from 'fastify';
import * as productController from '../controllers/products/controller';
import { productSchema } from '../models/products';
import { zodToJsonSchema } from '../utils/schemas';

export default async (app: FastifyInstance) => {
  // Get all products
  app.get('/', productController.getProductsHandler);

  // Get single product by ID
  app.get('/:id', productController.getProductHandler);

  // Get all product images
  app.get('/images', productController.getProductImagesHandler);

  // Create new product
  app.post('/newproduct', {
    handler: productController.createProductHandler,
    // Remove schema validation for body to allow multipart/form-data
    // Validation is handled manually in createProductHandler
  });

  // Update product
  app.put('/:id', {
    handler: productController.updateProductHandler,
    schema: {
      body: zodToJsonSchema(productSchema.partial()),
    },
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
          quantity: { type: 'number', minimum: 1 },
        },
        required: ['productId', 'quantity'],
      },
    },
  });

  app.get('/:userId/cart', productController.getUserCartHandler);

  app.put('/:userId/cart/:cartItemId', {
    handler: productController.updateCartItemQuantityHandler,
    schema: {
      body: {
        type: 'object',
        properties: {
          quantity: { type: 'number', minimum: 1 },
        },
        required: ['quantity'],
      },
    },
  });

  app.delete('/:userId/cart/:cartItemId', productController.deleteCartItemHandler);
};
