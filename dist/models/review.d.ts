import { z } from "zod";
export declare const reviewSchema: z.ZodObject<{
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
}>;
