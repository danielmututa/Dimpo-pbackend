import { z } from 'zod';
export declare const chatSchema: z.ZodObject<{
    message: z.ZodString;
    user_id: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    message: string;
    user_id?: number | undefined;
}, {
    message: string;
    user_id?: number | undefined;
}>;
export type Chat = z.infer<typeof chatSchema>;
