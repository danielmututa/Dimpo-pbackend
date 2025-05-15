import { Prisma } from "@prisma/client";
import { productSchema } from "../models/products";
import { z } from "zod";
export declare const getAllProducts: () => Promise<({
    cart: {
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        user_id: number | null;
        product_id: number | null;
        quantity: number;
        price: Prisma.Decimal;
    }[];
    reviews: {
        id: number;
        created_at: Date | null;
        user_id: number | null;
        product_id: number | null;
        rating: number | null;
        comment: string | null;
    }[];
    order_items: {
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        product_id: number | null;
        quantity: number;
        order_id: number | null;
        price: Prisma.Decimal;
    }[];
    categories: {
        name: string;
        id: number;
    } | null;
} & {
    name: string;
    id: number;
    created_at: Date | null;
    updated_at: Date | null;
    price: Prisma.Decimal;
    description: string | null;
    stock_quantity: number | null;
    image_url: string | null;
    discount_percentage: number | null;
    views: number | null;
    category_id: number | null;
})[]>;
export declare const getProductById: (id: number) => Promise<({
    cart: {
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        user_id: number | null;
        product_id: number | null;
        quantity: number;
        price: Prisma.Decimal;
    }[];
    reviews: {
        id: number;
        created_at: Date | null;
        user_id: number | null;
        product_id: number | null;
        rating: number | null;
        comment: string | null;
    }[];
    order_items: {
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        product_id: number | null;
        quantity: number;
        order_id: number | null;
        price: Prisma.Decimal;
    }[];
    categories: {
        name: string;
        id: number;
    } | null;
} & {
    name: string;
    id: number;
    created_at: Date | null;
    updated_at: Date | null;
    price: Prisma.Decimal;
    description: string | null;
    stock_quantity: number | null;
    image_url: string | null;
    discount_percentage: number | null;
    views: number | null;
    category_id: number | null;
}) | null>;
export declare const createProduct: (data: z.infer<typeof productSchema>, file?: {
    filename: string;
}) => Promise<{
    cart: {
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        user_id: number | null;
        product_id: number | null;
        quantity: number;
        price: Prisma.Decimal;
    }[];
    reviews: {
        id: number;
        created_at: Date | null;
        user_id: number | null;
        product_id: number | null;
        rating: number | null;
        comment: string | null;
    }[];
    order_items: {
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        product_id: number | null;
        quantity: number;
        order_id: number | null;
        price: Prisma.Decimal;
    }[];
    categories: {
        name: string;
        id: number;
    } | null;
} & {
    name: string;
    id: number;
    created_at: Date | null;
    updated_at: Date | null;
    price: Prisma.Decimal;
    description: string | null;
    stock_quantity: number | null;
    image_url: string | null;
    discount_percentage: number | null;
    views: number | null;
    category_id: number | null;
}>;
export declare const addProductToCart: (userId: number, productId: number, quantity: number, data?: Partial<z.infer<typeof productSchema>>) => Promise<{
    products: {
        name: string;
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        price: Prisma.Decimal;
        description: string | null;
        stock_quantity: number | null;
        image_url: string | null;
        discount_percentage: number | null;
        views: number | null;
        category_id: number | null;
    } | null;
} & {
    id: number;
    created_at: Date | null;
    updated_at: Date | null;
    user_id: number | null;
    product_id: number | null;
    quantity: number;
    price: Prisma.Decimal;
}>;
export declare const updateCartItemQuantity: (cartItemId: number, userId: number, newQuantity: number, data?: Partial<z.infer<typeof productSchema>>) => Promise<{
    id: number;
    created_at: Date | null;
    updated_at: Date | null;
    user_id: number | null;
    product_id: number | null;
    quantity: number;
    price: Prisma.Decimal;
}>;
export declare const deleteCartItem: (cartItemId: number, userId: number, data?: Partial<z.infer<typeof productSchema>>) => Promise<{
    id: number;
    created_at: Date | null;
    updated_at: Date | null;
    user_id: number | null;
    product_id: number | null;
    quantity: number;
    price: Prisma.Decimal;
}>;
export declare const getUserCart: (userId: number) => Promise<{
    items: ({
        products: ({
            categories: {
                name: string;
                id: number;
            } | null;
        } & {
            name: string;
            id: number;
            created_at: Date | null;
            updated_at: Date | null;
            price: Prisma.Decimal;
            description: string | null;
            stock_quantity: number | null;
            image_url: string | null;
            discount_percentage: number | null;
            views: number | null;
            category_id: number | null;
        }) | null;
    } & {
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        user_id: number | null;
        product_id: number | null;
        quantity: number;
        price: Prisma.Decimal;
    })[];
    subtotal: number;
    totalItems: number;
    totalDiscount: number;
    grandTotal: number;
}>;
export declare const clearUserCart: (userId: number) => Promise<Prisma.BatchPayload>;
export declare const updateProduct: (id: number, data: Partial<z.infer<typeof productSchema>>) => Promise<{
    name: string;
    id: number;
    created_at: Date | null;
    updated_at: Date | null;
    price: Prisma.Decimal;
    description: string | null;
    stock_quantity: number | null;
    image_url: string | null;
    discount_percentage: number | null;
    views: number | null;
    category_id: number | null;
}>;
export declare const deleteProduct: (id: number) => Promise<{
    name: string;
    id: number;
    created_at: Date | null;
    updated_at: Date | null;
    price: Prisma.Decimal;
    description: string | null;
    stock_quantity: number | null;
    image_url: string | null;
    discount_percentage: number | null;
    views: number | null;
    category_id: number | null;
}>;
export declare const getAllProductImages: () => Promise<(string | null)[]>;
