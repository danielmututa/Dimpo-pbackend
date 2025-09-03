// import { z } from 'zod';

// // Input for AI query by users
// export const aiQuerySchema = z.object({
//   query: z.string().min(3).max(1000),
// });

// // Output AI response
// export const aiResponseSchema = z.object({
//   message: z.string(), // AI answer
//   report_type: z.enum(['sales', 'user_activity', 'inventory', 'revenue']).optional(),
//   start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
//   end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
// });








import { z } from 'zod';

export const aiQuerySchema = z.object({
  query: z.string().min(1, 'Query cannot be empty').max(1000, 'Query too long'),
  image_url: z.string().url().optional(),
  audio_url: z.string().url().optional(),
});

export const aiResponseSchema = z.object({
  message: z.string(),
  report_type: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  analysis_type: z.enum(['text', 'image', 'audio', 'multimodal']).optional(),
});

export const reportRequestSchema = z.object({
  report_type: z.enum([
    'products', 'product-sales', 'inventory',
    'users', 'user-activity', 'customers', 
    'blogs', 'content', 'articles',
    'sales', 'revenue', 'financial',
    'general', 'overview'
  ]),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export type AIQueryType = z.infer<typeof aiQuerySchema>;
export type AIResponseType = z.infer<typeof aiResponseSchema>;
export type ReportRequestType = z.infer<typeof reportRequestSchema>;