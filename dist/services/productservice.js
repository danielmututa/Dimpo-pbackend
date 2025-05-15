"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProductImages = exports.deleteProduct = exports.updateProduct = exports.clearUserCart = exports.getUserCart = exports.deleteCartItem = exports.updateCartItemQuantity = exports.addProductToCart = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const client_1 = require("@prisma/client");
const products_1 = require("../models/products");
const prisma = new client_1.PrismaClient();
const getAllProducts = async () => {
    return await prisma.products.findMany({
        include: {
            categories: true,
            reviews: true,
            cart: true,
            order_items: true,
        },
    });
};
exports.getAllProducts = getAllProducts;
const getProductById = async (id) => {
    return await prisma.products.findUnique({
        where: { id },
        include: {
            categories: true,
            reviews: true,
            cart: true,
            order_items: true,
        },
    });
};
exports.getProductById = getProductById;
// export const createProduct = async (
//   data: z.infer<typeof productSchema>,
//   file?: { filename: string }
// ) => {
//   const validatedData = productSchema.parse(data);
//   const createData: Prisma.productsCreateInput = {
//     name: validatedData.name,
//     description: validatedData.description ?? null,
//     price: validatedData.price,
//     image_url: file ? `/Uploads/${file.filename}` : null,
//     stock_quantity: validatedData.stock_quantity ?? 0,
//     discount_percentage: validatedData.discount_percentage ?? 0,
//     views: validatedData.views ?? 0,
//     created_at: validatedData.created_at ?? new Date(),
//     updated_at: validatedData.updated_at ?? new Date(),
//   };
//   if (validatedData.category_name) {
//     createData.categories = {
//       connectOrCreate: {
//         where: { name: validatedData.category_name },
//         create: { name: validatedData.category_name },
//       },
//     };
//   }
//   if (validatedData.cart && validatedData.cart.length > 0) {
//     createData.cart = {
//       create: validatedData.cart.map((item) => ({
//         user_id: item.user_id,
//         quantity: item.quantity,
//         price: validatedData.price * item.quantity,
//         created_at: item.created_at ?? new Date(),
//       })),
//     };
//   }
//   if (validatedData.reviews && validatedData.reviews.length > 0) {
//     createData.reviews = {
//       create: validatedData.reviews.map((item) => ({
//         user_id: item.user_id ?? null,
//         rating: item.rating ?? null,
//         comment: item.comment ?? "",
//         created_at: item.created_at ?? new Date(),
//       })),
//     };
//   }
//   if (validatedData.order_items && validatedData.order_items.length > 0) {
//     createData.order_items = {
//       create: validatedData.order_items.map((item) => ({
//         order_id: item.order_id,
//         quantity: item.quantity,
//         price: validatedData.price,
//       })),
//     };
//   }
//   return await prisma.products.create({
//     data: createData,
//     include: {
//       categories: true,
//       reviews: true,
//       cart: true,
//       order_items: true,
//     },
//   });
// };
// Other functions (addProductToCart, updateCartItemQuantity, deleteCartItem, getUserCart, updateProduct, deleteProduct) remain unchanged
// ... (keep as provided in your original code)
const createProduct = async (data, file) => {
    const validatedData = products_1.productSchema.parse(data);
    const createData = {
        name: validatedData.name,
        description: validatedData.description ?? null,
        price: validatedData.price,
        image_url: file ? `/Uploads/${file.filename}` : null,
        stock_quantity: validatedData.stock_quantity ?? 0,
        discount_percentage: validatedData.discount_percentage ?? 0,
        views: validatedData.views ?? 0,
        created_at: validatedData.created_at ?? new Date(),
        updated_at: validatedData.updated_at ?? new Date(),
    };
    if (validatedData.category_name) {
        createData.categories = {
            connectOrCreate: {
                where: { name: validatedData.category_name },
                create: { name: validatedData.category_name },
            },
        };
    }
    if (validatedData.cart && validatedData.cart.length > 0) {
        createData.cart = {
            create: validatedData.cart.map((item) => ({
                user_id: item.user_id,
                quantity: item.quantity,
                price: validatedData.price * item.quantity,
                created_at: item.created_at ?? new Date(),
            })),
        };
    }
    if (validatedData.reviews && validatedData.reviews.length > 0) {
        createData.reviews = {
            create: validatedData.reviews.map((item) => ({
                user_id: item.user_id ?? null,
                rating: item.rating ?? null,
                comment: item.comment ?? "",
                created_at: item.created_at ?? new Date(),
            })),
        };
    }
    if (validatedData.order_items && validatedData.order_items.length > 0) {
        createData.order_items = {
            create: validatedData.order_items.map((item) => ({
                order_id: item.order_id,
                quantity: item.quantity,
                price: validatedData.price,
            })),
        };
    }
    return await prisma.products.create({
        data: createData,
        include: {
            categories: true,
            reviews: true,
            cart: true,
            order_items: true,
        },
    });
};
exports.createProduct = createProduct;
const addProductToCart = async (userId, productId, quantity, data = {} // Optional product data
) => {
    const validatedData = products_1.productSchema.partial().parse(data);
    if (!validatedData)
        throw new Error('Product not found');
    // Handle undefined/null stock quantity
    const stockQuantity = validatedData.stock_quantity ?? 0;
    if (stockQuantity < quantity) {
        throw new Error('Insufficient stock');
    }
    // Update product's stock quantity
    await prisma.products.update({
        where: { id: productId },
        data: {
            stock_quantity: {
                decrement: quantity
            },
            updated_at: new Date()
        }
    });
    const existingCartItem = await prisma.cart.findFirst({
        where: {
            product_id: productId,
            user_id: userId
        }
    });
    // Handle Decimal type for price calculations
    const productPrice = new client_1.Prisma.Decimal(validatedData.price ?? 0);
    if (existingCartItem) {
        const newQuantity = existingCartItem.quantity + quantity;
        return await prisma.cart.update({
            where: { id: existingCartItem.id },
            data: {
                quantity: newQuantity,
                price: productPrice.mul(newQuantity),
                updated_at: new Date()
            },
            include: {
                products: true
            }
        });
    }
    return await prisma.cart.create({
        data: {
            user_id: userId,
            product_id: productId,
            quantity,
            price: productPrice.mul(quantity),
            created_at: new Date(),
            updated_at: new Date()
        },
        include: {
            products: true
        }
    });
};
exports.addProductToCart = addProductToCart;
const updateCartItemQuantity = async (cartItemId, userId, newQuantity, data // Optional product data
) => {
    if (newQuantity <= 0) {
        return await (0, exports.deleteCartItem)(cartItemId, userId);
    }
    const cartItem = await prisma.cart.findFirst({
        where: {
            id: cartItemId,
            user_id: userId
        },
        include: {
            products: {
                select: {
                    id: true,
                    price: true,
                    stock_quantity: true
                }
            }
        }
    });
    if (!cartItem || !cartItem.products) {
        throw new Error('Cart item not found');
    }
    // Validate stock if product data is provided
    if (data) {
        const validatedData = products_1.productSchema.partial().parse(data);
        const stockQuantity = validatedData.stock_quantity ?? 0;
        if (stockQuantity < newQuantity) {
            throw new Error('Insufficient stock');
        }
    }
    // Handle Decimal type for price calculations
    const productPrice = new client_1.Prisma.Decimal(cartItem.products.price);
    return await prisma.cart.update({
        where: { id: cartItemId },
        data: {
            quantity: newQuantity,
            price: productPrice.mul(newQuantity),
            updated_at: new Date()
        },
        include: {
            products: true
        }
    });
};
exports.updateCartItemQuantity = updateCartItemQuantity;
// Remove item from cart
const deleteCartItem = async (cartItemId, userId, data // Optional product data
) => {
    const cartItem = await prisma.cart.findFirst({
        where: {
            id: cartItemId,
            user_id: userId
        },
        include: {
            products: {
                select: {
                    id: true,
                    stock_quantity: true
                }
            }
        }
    });
    if (!cartItem) {
        throw new Error('Cart item not found or does not belong to user');
    }
    // Restore product stock if product data is provided
    if (data && cartItem.products) {
        await prisma.products.update({
            where: { id: cartItem.products.id },
            data: {
                stock_quantity: {
                    increment: cartItem.quantity
                },
                updated_at: new Date()
            }
        });
    }
    return await prisma.cart.delete({
        where: { id: cartItemId }
    });
};
exports.deleteCartItem = deleteCartItem;
// Get user's cart
const getUserCart = async (userId) => {
    const cartItems = await prisma.cart.findMany({
        where: { user_id: userId },
        include: {
            products: {
                include: {
                    categories: true
                }
            }
        }
    });
    // Convert all prices to Decimal for safe calculations
    const subtotal = cartItems.reduce((sum, item) => {
        return sum.add(new client_1.Prisma.Decimal(item.price || 0));
    }, new client_1.Prisma.Decimal(0));
    const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    // Calculate discounts using Decimal
    const totalDiscount = cartItems.reduce((sum, item) => {
        const discount = item.products?.discount_percentage || 0;
        const itemPrice = new client_1.Prisma.Decimal(item.price || 0);
        return sum.add(itemPrice.mul(discount).div(100));
    }, new client_1.Prisma.Decimal(0));
    return {
        items: cartItems,
        subtotal: subtotal.toNumber(),
        totalItems,
        totalDiscount: totalDiscount.toNumber(),
        grandTotal: subtotal.minus(totalDiscount).toNumber()
    };
};
exports.getUserCart = getUserCart;
// Clear user's cart
const clearUserCart = async (userId) => {
    return await prisma.cart.deleteMany({
        where: { user_id: userId }
    });
};
exports.clearUserCart = clearUserCart;
// Update product
const updateProduct = async (id, data) => {
    const validatedData = products_1.productSchema.partial().parse(data);
    const updateData = {
        updated_at: new Date(),
    };
    if (validatedData.name !== undefined)
        updateData.name = validatedData.name;
    if (validatedData.description !== undefined)
        updateData.description = validatedData.description;
    if (validatedData.price !== undefined)
        updateData.price = validatedData.price;
    if (validatedData.stock_quantity !== undefined)
        updateData.stock_quantity = validatedData.stock_quantity;
    if (validatedData.image_url !== undefined)
        updateData.image_url = validatedData.image_url;
    if (validatedData.discount_percentage !== undefined)
        updateData.discount_percentage = validatedData.discount_percentage;
    if (validatedData.views !== undefined)
        updateData.views = validatedData.views;
    if (validatedData.category_name !== undefined) {
        updateData.categories = validatedData.category_name
            ? {
                connectOrCreate: {
                    where: { name: validatedData.category_name },
                    create: { name: validatedData.category_name },
                },
            }
            : { disconnect: true };
    }
    return await prisma.products.update({
        where: { id },
        data: updateData,
    });
};
exports.updateProduct = updateProduct;
// Delete product
const deleteProduct = async (id) => {
    return await prisma.products.delete({
        where: { id },
    });
};
exports.deleteProduct = deleteProduct;
const getAllProductImages = async () => {
    const products = await prisma.products.findMany({
        where: {
            image_url: {
                not: null, // Only include products with an image_url
            },
        },
        select: {
            image_url: true, // Only fetch the image_url field
        },
    });
    return products.map((product) => product.image_url); // Return an array of image URLs
};
exports.getAllProductImages = getAllProductImages;
//# sourceMappingURL=productservice.js.map