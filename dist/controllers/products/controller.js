"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductHandler = exports.updateProductHandler = exports.getProductHandler = exports.updateCartItemQuantityHandler = exports.addProductToCartHandler = exports.deleteCartItemHandler = exports.getUserCartHandler = exports.getProductImagesHandler = exports.getProductsHandler = exports.createProductHandler = void 0;
const productservice_1 = require("../../services/productservice");
const products_1 = require("../../models/products");
const stream_1 = require("stream");
const util_1 = __importDefault(require("util"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pump = util_1.default.promisify(stream_1.pipeline);
const createProductHandler = async (request, reply) => {
    try {
        // Parse multipart form data
        const data = await request.file();
        if (!data) {
            return reply.status(400).send({ message: 'No file or form data provided' });
        }
        // Extract form fields
        const fields = data.fields;
        const formData = {};
        for (const key in fields) {
            const field = fields[key];
            if (field && 'value' in field && typeof field.value === 'string') {
                formData[key] = field.value;
            }
        }
        // Convert string fields to numbers for schema validation
        const convertedData = {
            ...formData,
            price: formData.price ? parseFloat(formData.price) : undefined,
            stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity, 10) : undefined,
            discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : undefined,
            views: formData.views ? parseInt(formData.views, 10) : undefined,
        };
        // Validate form fields against productSchema
        const validatedData = products_1.productSchema.parse(convertedData);
        // Handle file upload
        let fileInfo;
        if (data.file) {
            const filename = `${Date.now()}-${data.filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            const filePath = path_1.default.join(__dirname, '../../Uploads', filename);
            await pump(data.file, fs_1.default.createWriteStream(filePath));
            fileInfo = { filename };
        }
        // Create product with validated data and file info
        const product = await (0, productservice_1.createProduct)(validatedData, fileInfo);
        reply.status(201).send(product);
    }
    catch (error) {
        console.error('Error creating product:', error);
        reply.status(400).send({ message: 'Invalid product data', error: JSON.stringify(error, null, 2) });
    }
};
exports.createProductHandler = createProductHandler;
const getProductsHandler = async (request, reply) => {
    try {
        const products = await (0, productservice_1.getAllProducts)();
        reply.send(products);
    }
    catch (error) {
        reply.status(500).send({ message: 'Error fetching products' });
    }
};
exports.getProductsHandler = getProductsHandler;
const getProductImagesHandler = async (request, reply) => {
    try {
        const imageUrls = await (0, productservice_1.getAllProductImages)();
        reply.send(imageUrls);
    }
    catch (error) {
        console.error('Error fetching product images:', error);
        reply.status(500).send({ message: 'Error fetching product images' });
    }
};
exports.getProductImagesHandler = getProductImagesHandler;
const getUserCartHandler = async (request, reply) => {
    try {
        const { userId } = request.params;
        const cartItems = await (0, productservice_1.getUserCart)(parseInt(userId));
        if (!cartItems) {
            reply.status(404).send({ message: 'Cart not found' });
            return;
        }
        reply.send(cartItems);
    }
    catch (error) {
        reply.status(500).send({ message: 'Error fetching cart items' });
    }
};
exports.getUserCartHandler = getUserCartHandler;
const deleteCartItemHandler = async (request, reply) => {
    try {
        const { cartItemId, userId } = request.params;
        const deletedItem = await (0, productservice_1.deleteCartItem)(parseInt(cartItemId), parseInt(userId));
        if (!deletedItem) {
            reply.status(404).send({ message: 'Cart item not found' });
            return;
        }
        reply.send(deletedItem);
    }
    catch (error) {
        reply.status(500).send({ message: 'Error deleting cart item' });
    }
};
exports.deleteCartItemHandler = deleteCartItemHandler;
const addProductToCartHandler = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { productId, quantity } = request.body;
        const cartItem = await (0, productservice_1.addProductToCart)(parseInt(userId), productId, quantity, {});
        if (!cartItem) {
            reply.status(404).send({ message: 'Product not found' });
            return;
        }
        reply.send(cartItem);
    }
    catch (error) {
        reply.status(500).send({ message: 'Error adding product to cart', error: error.message });
    }
};
exports.addProductToCartHandler = addProductToCartHandler;
const updateCartItemQuantityHandler = async (request, reply) => {
    try {
        const { cartItemId, userId } = request.params;
        const { quantity } = request.body;
        const updatedItem = await (0, productservice_1.updateCartItemQuantity)(parseInt(cartItemId), parseInt(userId), quantity);
        if (!updatedItem) {
            reply.status(404).send({ message: 'Cart item not found' });
            return;
        }
        reply.send(updatedItem);
    }
    catch (error) {
        reply.status(500).send({ message: 'Error updating cart item quantity' });
    }
};
exports.updateCartItemQuantityHandler = updateCartItemQuantityHandler;
const getProductHandler = async (request, reply) => {
    try {
        const { id } = request.params;
        const product = await (0, productservice_1.getProductById)(parseInt(id));
        if (!product) {
            reply.status(404).send({ message: 'Product not found' });
            return;
        }
        reply.send(product);
    }
    catch (error) {
        reply.status(500).send({ message: 'Error fetching product' });
    }
};
exports.getProductHandler = getProductHandler;
const updateProductHandler = async (request, reply) => {
    try {
        const { id } = request.params;
        const updatedProduct = await (0, productservice_1.updateProduct)(parseInt(id), request.body);
        if (!updatedProduct) {
            reply.status(404).send({ message: 'Product not found' });
            return;
        }
        reply.send(updatedProduct);
    }
    catch (error) {
        reply.status(400).send({ message: 'Error updating product', error });
    }
};
exports.updateProductHandler = updateProductHandler;
const deleteProductHandler = async (request, reply) => {
    try {
        const { id } = request.params;
        await (0, productservice_1.deleteProduct)(parseInt(id));
        reply.status(204).send();
    }
    catch (error) {
        reply.status(500).send({ message: 'Error deleting product' });
    }
};
exports.deleteProductHandler = deleteProductHandler;
//# sourceMappingURL=controller.js.map