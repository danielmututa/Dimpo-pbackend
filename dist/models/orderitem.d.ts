import { z } from "zod";
export declare const orderItemSchema: z.ZodObject<{
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
}>;
