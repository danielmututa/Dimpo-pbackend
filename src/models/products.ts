import { z } from "zod";
import { cartSchema } from "./cart";
import { orderItemSchema } from "./orderitem";
// import { categorySchema } from "./category";
import { reviewSchema } from "./review";


export const productSchema = z.object({
//   id: z.number().int().positive(),
  name: z.string().max(255),
  description: z.string().optional(),
  price: z.number().min(0), 
  stock_quantity: z.number().optional().default(0),
  image_url: z.string().optional(),
  created_at: z.coerce.date().optional(), 
  updated_at: z.coerce.date().optional(),
  discount_percentage: z.number().optional().default(0),
  views: z.number().optional().default(0),
  cart: z.array(cartSchema).optional(),
  order_items: z.array(orderItemSchema).optional(), 
  category_name: z.string().optional(), 
  reviews: z.array(reviewSchema).optional(), 
});


