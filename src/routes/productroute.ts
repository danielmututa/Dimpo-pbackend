




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
import { 
  ReviewController, 
  ReviewLikeController, 
  ReviewCommentController, 
  ProductViewController 
} from '../controllers/products/controller';

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

// llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll
    // ------------------- REVIEWS -------------------
// fastify.post('/:id/reviews', productController.addReviewHandler);

// fastify.get('/:id/reviews', productController.getReviewsHandler);



  // ------------------- REVIEWS -------------------
  fastify.post('/:id/reviews', ReviewController.addReview);
  fastify.get('/:id/reviews', ReviewController.getReviews);
  fastify.delete('/reviews/:reviewId', ReviewController.deleteReview);

  // ------------------- REVIEW LIKES -------------------
  fastify.post('/reviews/:reviewId/like', ReviewLikeController.toggleLike);
  fastify.get('/reviews/:reviewId/like-status', ReviewLikeController.getLikeStatus);

  // ------------------- REVIEW COMMENTS -------------------
  fastify.post('/reviews/:reviewId/comments', ReviewCommentController.addComment);
  fastify.get('/reviews/:reviewId/comments', ReviewCommentController.getComments);
  fastify.delete('/review-comments/:commentId', ReviewCommentController.deleteComment);

  // ------------------- PRODUCT VIEWS -------------------
  fastify.post('/:id/view', ProductViewController.trackView);
  fastify.get('/:id/views', ProductViewController.getViewStats);
  fastify.get('/:id/with-views', ProductViewController.getProductWithViews);
  fastify.get('/most-viewed', ProductViewController.getMostViewed);

// lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll


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
  fastify.post('/:userId/cart', {
    handler: productController.addProductToCartHandler,
    schema: {
      params: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
        },
        required: ['userId'],
      },
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

  fastify.get('/:userId/cart', productController.getUserCartHandler);

  fastify.put('/:userId/cart/:cartItemId', {
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

  fastify.delete('/:userId/cart/:cartItemId', productController.deleteCartItemHandler);
};







