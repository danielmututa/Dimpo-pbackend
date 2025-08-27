




// import { FastifyInstance } from 'fastify';
// import * as productController from '../controllers/products/controller';
// import { productSchema } from '../models/products';
// import { zodToJsonSchema } from '../utils/schemas';
import fastify from 'fastify';

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

export default async (fastify: FastifyInstance) => {
  // Get all products
 fastify.get('/', productController.getProductsHandler);

  // Get single product by ID
  fastify.get('/:id', productController.getProductHandler);

  // Get all product images
  fastify.get('/images', productController.getProductImagesHandler);

  // Create new product
  fastify.post('/newproduct', {
    handler: productController.createProductHandler,
    // Remove schema validation for body to allow multipart/form-data
    // Validation is handled manually in createProductHandler
  });

  // Update product
  fastify.put('/:id', {
    handler: productController.updateProductHandler,
    schema: {
      body: zodToJsonSchema(productSchema.partial()),
    },
  });

  // Delete product
  fastify.delete('/:id', productController.deleteProductHandler);

  // Cart routes
  fastify.post('/cart', {
  handler: productController.addProductToCartHandler,
  schema: {
    body: {
      type: 'object',
      properties: {
        productId: { type: ['number', 'string'] }, // Allow both number and string
        quantity: { type: ['number', 'string'], minimum: 1 },
      },
      required: ['productId', 'quantity'],
    },
  },
});

  // Get user's cart (userId comes from session/auth)
fastify.get('/cart', productController.getUserCartHandler);

// Update cart item quantity (userId from session/auth)
fastify.put('/cart/:cartItemId', {
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

fastify.delete('/cart/:cartItemId', productController.deleteCartItemHandler);
};
