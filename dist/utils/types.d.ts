import { z } from 'zod';
import { registerSchema, loginSchema, changePasswordSchema, resetPasswordSchema } from './schemas';
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
