// schemas.ts
import { z } from 'zod';

// Input schema: what the AI query expects
export const aiQuerySchema = z.object({
  query: z.string().min(3).max(1000), // User's natural language query
  user_id: z.number().int().positive().optional(), // Optional user/admin ID
});

// Output schema: what the AI query handler returns
export const aiResponseSchema = z.object({
  report_type: z.enum(['sales', 'user_activity', 'inventory', 'revenue']).optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),  // Date in YYYY-MM-DD format
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),    // Date in YYYY-MM-DD format
  message: z.string(), // Report message or summary
});

