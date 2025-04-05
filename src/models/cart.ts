import { z } from "zod";

export const cartSchema = z.object({
  id: z.number(),
  user_id: z.number().nullable().optional(),
  product_id: z.number().nullable().optional(),
  quantity: z.number(),
  price: z.number(), // Prisma Decimal can be handled as number in Zod
  created_at: z.coerce.date().optional()
});
