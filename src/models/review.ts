import { z } from "zod";

export const reviewSchema = z.object({
    // id: z.number(),
    user_id: z.number().nullable().optional(),
    product_id: z.number().nullable().optional(),
    rating: z.number().nullable().optional(),
    comment: z.string().nullable().optional(),
    created_at: z.coerce.date().optional()
  });
  