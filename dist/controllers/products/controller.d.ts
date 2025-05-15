import { FastifyRequest, FastifyReply } from 'fastify';
import { productSchema } from '../../models/products';
import { z } from 'zod';
type ProductParams = {
    id: string;
};
type ProductBody = z.infer<typeof productSchema>;
export declare const createProductHandler: (request: FastifyRequest, reply: FastifyReply) => Promise<undefined>;
export declare const getProductsHandler: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
export declare const getProductImagesHandler: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
export declare const getUserCartHandler: (request: FastifyRequest<{
    Params: {
        userId: string;
    };
}>, reply: FastifyReply) => Promise<void>;
export declare const deleteCartItemHandler: (request: FastifyRequest<{
    Params: {
        cartItemId: string;
        userId: string;
    };
}>, reply: FastifyReply) => Promise<void>;
export declare const addProductToCartHandler: (request: FastifyRequest<{
    Params: {
        userId: string;
    };
    Body: {
        productId: number;
        quantity: number;
    };
}>, reply: FastifyReply) => Promise<void>;
export declare const updateCartItemQuantityHandler: (request: FastifyRequest<{
    Params: {
        cartItemId: string;
        userId: string;
    };
    Body: {
        quantity: number;
    };
}>, reply: FastifyReply) => Promise<void>;
export declare const getProductHandler: (request: FastifyRequest<{
    Params: ProductParams;
}>, reply: FastifyReply) => Promise<void>;
export declare const updateProductHandler: (request: FastifyRequest<{
    Params: ProductParams;
    Body: Partial<ProductBody>;
}>, reply: FastifyReply) => Promise<void>;
export declare const deleteProductHandler: (request: FastifyRequest<{
    Params: ProductParams;
}>, reply: FastifyReply) => Promise<void>;
export {};
