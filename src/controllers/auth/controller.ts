



// src/controllers/auth/controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { 
  registerSchema, 
  loginSchema, 
  changePasswordSchema,
  resetPasswordSchema,
  forgotPasswordSchema
} from '../../utils/schemas';
import * as authService from '../../services/auth'; // Updated import path
import { generateToken } from '../../utils/jwt';
import { users } from '@prisma/client';

export const register = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const validatedData = registerSchema.parse(request.body);
    const user = await authService.registerUser(validatedData);
    
    const token = generateToken(user);
    
    reply.code(201).send({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error: any) {
    reply.code(400).send({
      success: false,
      error: error.message || 'Registration failed'
    });
  }
};

export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const validatedData = loginSchema.parse(request.body);
    const user = await authService.loginUser(validatedData);
    
    const token = generateToken(user);
    
    reply.code(200).send({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error: any) {
    reply.code(401).send({
      success: false,
      error: error.message || 'Login failed'
    });
  }
};

// export const changePassword = async (request: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const user = request.user as users;
//     const validatedData = changePasswordSchema.parse(request.body);
    
//     await authService.changePassword(user.id, validatedData);
    
//     reply.code(200).send({
//       success: true,
//       message: 'Password changed successfully'
//     });
//   } catch (error: any) {
//     reply.code(400).send({
//       success: false,
//       error: error.message || 'Password change failed'
//     });
//   }
// };

// src/controllers/auth/controller.ts
// ... (previous imports remain the same)

export const changePassword = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // Get authenticated user from request (added by your JWT middleware)
    const user = request.user as users;
    
    // Parse request body
    const { currentPassword, newPassword } = request.body as {
      currentPassword: string;
      newPassword: string;
    };

    // Call service to change password
    await authService.changePassword(
      user.id,
      currentPassword,
      newPassword
    );
    
    reply.code(200).send({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error: any) {
    reply.code(400).send({
      success: false,
      error: error.message || 'Password change failed'
    });
  }
};



export const forgotPassword = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const validatedData = forgotPasswordSchema.parse(request.body);
    await authService.forgotPassword(validatedData.email);
    
    reply.code(200).send({
      success: true,
      message: 'If an account with that email exists, a reset link has been sent'
    });
  } catch (error: any) {
    reply.code(400).send({
      success: false,
      error: error.message || 'Password reset failed'
    });
  }
};

export const resetPassword = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const validatedData = resetPasswordSchema.parse(request.body);
    await authService.resetPassword(validatedData);
    
    reply.code(200).send({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error: any) {
    reply.code(400).send({
      success: false,
      error: error.message || 'Password reset failed'
    });
  }
};

export const getUser = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // Explicitly type query to match the service's expected input
    const { username, email } = request.query as { username?: string | undefined; email?: string | undefined };

    if (!username && !email) {
      return reply.code(400).send({ success: false, error: 'Username or email required' });
    }

    // Pass the object as-is, TypeScript should now accept it
    const user = await authService.getUser({ username, email });
    if (!user) {
      return reply.code(404).send({ success: false, error: 'User not found' });
    }

    reply.code(200).send({
      success: true,
      data: user
    });
  } catch (error: any) {
    reply.code(500).send({
      success: false,
      error: error.message || 'Failed to fetch user'
    });
  }
};