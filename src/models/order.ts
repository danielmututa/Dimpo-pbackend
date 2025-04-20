// import {z} from "zod"
// import { orderItemSchema } from "./orderitem";
// import {financialSchema} from "./finacial";
// import {paymentSchema} from "./payment";
// export const orderStatusEnum = z.enum([
//     "Pending",
//     "Processing",
//     "Shipped",
//     "Delivered",
//     "Cancelled"
//   ]);
  
//   export const orderSchema = z.object({
 
//     user_id: z.number().nullable().optional(),
//     total_price: z.number().positive("Total price must be positive"),
//     status: orderStatusEnum.default("Pending"),
//     created_at: z.date().optional(),
//     browser_used: z.string().optional(),
//     updated_at: z.date().optional(),
//     order_items: z.array(orderItemSchema).optional(),
//     financials: z.array( financialSchema).optional(), // Assuming financialSchema is defined in financial.ts
//     payments: z.array(paymentSchema).optional(), // Assuming paymentSchema is defined in payment.ts
//   });
  
  



import { z } from "zod";
import { orderItemSchema } from "./orderitem";
import { financialSchema } from "./finacial";
import { paymentSchema } from "./payment";

export const orderSchema = z.object({
  user_id: z.number().nullable().optional(),
  total_price: z.number().positive("Total price must be positive"),
  status: z.string().default("Pending"), // Replaced with a plain string type
  // created_at: z.coerce.date(),
 created_at: z.coerce.date().optional(),
  browser_used: z.string().optional(),
  updated_at: z.coerce.date().optional(),
  order_items: z.array(orderItemSchema).optional(),
  financials: z.array(financialSchema).optional(),
  payments: z.array(paymentSchema).optional(),
});









// {
//   "total_price": 100,
//   "status": "Pending",
//   "created_at": "2025-04-20T17:01:52.186Z",
//   "updated_at": "2025-04-20T17:01:52.186Z",
//   "browser_used": "Chrome",
//   "users": {
//     "connect": {
//       "id": 1
//     }
//   },
//   "financials": [
//     {
//       "amount": 100,
//       "type": "income",
//       "description": "Income for order",
//       "created_at": "2025-04-20T17:01:52.186Z"
//     }
//   ],
//   "payments": [
//     {
//       "transaction_id": "TX12345",
//       "status": "Completed",
//       "payment_method": "Credit Card",
//       "user_id": 1,
//       "created_at": "2025-04-20T17:01:52.186Z"
//     }
//   ],
//   "order_items": [
//     {
      
//       "quantity": 2,
//       "price": 50
//     }
//   ]
// }
