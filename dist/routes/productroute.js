"use strict";
// import { FastifyInstance } from 'fastify';
// import * as productController from '../controllers/products/controller';
// import { productSchema } from '../models/products';
// import { zodToJsonSchema } from '../utils/schemas';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const productController = __importStar(require("../controllers/products/controller"));
const products_1 = require("../models/products");
const schemas_1 = require("../utils/schemas");
exports.default = async (app) => {
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
            body: (0, schemas_1.zodToJsonSchema)(products_1.productSchema.partial()),
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
//# sourceMappingURL=productroute.js.map