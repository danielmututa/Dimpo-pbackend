import { FastifyInstance } from 'fastify';
import * as authController from '../controllers/auth/controller';
import { authenticate } from '../middlewares/auth';

export default async (app: FastifyInstance) => {
  app.post('/register', authController.register);
  app.post('/login', authController.login);
  
  // Protected routes
  app.post('/change-password', { preHandler: [authenticate] }, authController.changePassword); // Authorization Bearer
    
  app.post('/forgot-password', authController.forgotPassword);
  app.post('/reset-password', authController.resetPassword);

  // New route for getting a user by username or email
  app.get('/user', authController.getUser);
  // http://localhost:3000/api/auth/user?username=testuser
  
};