import { FastifyInstance } from 'fastify';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

export default async (app: FastifyInstance) => {
  app.post('/register', authController.register);
  app.post('/login', authController.login);
  
  // Protected routes
  app.post('/change-password', { preHandler: authenticate }, authController.changePassword);
  app.post('/forgot-password', authController.forgotPassword);
  app.post('/reset-password', authController.resetPassword);
};