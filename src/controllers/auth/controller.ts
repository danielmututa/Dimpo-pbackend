import { FastifyRequest, FastifyReply } from 'fastify';
import { 
  registerSchema, 
  loginSchema, 
  changePasswordSchema,
  resetPasswordSchema,
  forgotPasswordSchema
} from '../utils/schemas';
import * as authService from '../services/auth.service';
import { generateToken } from '../utils/jwt';
import { User } from '@prisma/client';

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
    const user = await authService.loginUser(validatedData.email, validatedData.password);
    
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

export const changePassword = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = request.user as User;
    const validatedData = changePasswordSchema.parse(request.body);
    
    await authService.changePassword(
      user.id,
      validatedData.currentPassword,
      validatedData.newPassword
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
    await authService.resetPassword(validatedData.token, validatedData.newPassword);
    
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