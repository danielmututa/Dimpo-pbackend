import { z } from "zod";
export declare const productSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodNumber;
    stock_quantity: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    image_url: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodDate>;
    updated_at: z.ZodOptional<z.ZodDate>;
    discount_percentage: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    views: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    cart: z.ZodOptional<z.ZodArray<z.ZodObject<{
        user_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        product_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        quantity: z.ZodNumber;
        created_at: z.ZodOptional<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
        quantity: number;
        created_at?: Date | undefined;
        user_id?: number | null | undefined;
        product_id?: number | null | undefined;
    }, {
        quantity: number;
        created_at?: Date | undefined;
        user_id?: number | null | undefined;
        product_id?: number | null | undefined;
    }>, "many">>;
    order_items: z.ZodOptional<z.ZodArray<z.ZodObject<{
        order_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        product_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        quantity: z.ZodNumber;
        price: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        quantity: number;
        price: number;
        product_id?: number | null | undefined;
        order_id?: number | null | undefined;
    }, {
        quantity: number;
        price: number;
        product_id?: number | null | undefined;
        order_id?: number | null | undefined;
    }>, "many">>;
    category_name: z.ZodOptional<z.ZodString>;
    reviews: z.ZodOptional<z.ZodArray<z.ZodObject<{
        user_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        product_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        rating: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        comment: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        created_at: z.ZodOptional<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
        created_at?: Date | undefined;
        user_id?: number | null | undefined;
        product_id?: number | null | undefined;
        rating?: number | null | undefined;
        comment?: string | null | undefined;
    }, {
        created_at?: Date | undefined;
        user_id?: number | null | undefined;
        product_id?: number | null | undefined;
        rating?: number | null | undefined;
        comment?: string | null | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    price: number;
    stock_quantity: number;
    discount_percentage: number;
    views: number;
    created_at?: Date | undefined;
    updated_at?: Date | undefined;
    cart?: {
        quantity: number;
        created_at?: Date | undefined;
        user_id?: number | null | undefined;
        product_id?: number | null | undefined;
    }[] | undefined;
    reviews?: {
        created_at?: Date | undefined;
        user_id?: number | null | undefined;
        product_id?: number | null | undefined;
        rating?: number | null | undefined;
        comment?: string | null | undefined;
    }[] | undefined;
    description?: string | undefined;
    order_items?: {
        quantity: number;
        price: number;
        product_id?: number | null | undefined;
        order_id?: number | null | undefined;
    }[] | undefined;
    image_url?: string | undefined;
    category_name?: string | undefined;
}, {
    name: string;
    price: number;
    created_at?: Date | undefined;
    updated_at?: Date | undefined;
    cart?: {
        quantity: number;
        created_at?: Date | undefined;
        user_id?: number | null | undefined;
        product_id?: number | null | undefined;
    }[] | undefined;
    reviews?: {
        created_at?: Date | undefined;
        user_id?: number | null | undefined;
        product_id?: number | null | undefined;
        rating?: number | null | undefined;
        comment?: string | null | undefined;
    }[] | undefined;
    description?: string | undefined;
    order_items?: {
        quantity: number;
        price: number;
        product_id?: number | null | undefined;
        order_id?: number | null | undefined;
    }[] | undefined;
    stock_quantity?: number | undefined;
    image_url?: string | undefined;
    discount_percentage?: number | undefined;
    views?: number | undefined;
    category_name?: string | undefined;
}>;
