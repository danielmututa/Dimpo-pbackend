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


  app.get('/users', { preHandler: [authenticate] }, authController.getAllUsers); // Get all users (protected)
  // app.get('/users', authController.getAllUsers);
  app.delete('/users/:id', { preHandler: [authenticate] }, authController.deleteUser); // Delete user by ID (protected)

  // Example URLs:
  // Get user by username: http://localhost:3000/api/auth/user?username=testuser
  // Get user by email: http://localhost:3000/api/auth/user?email=test@example.com
  // Get all users: http://localhost:3000/api/auth/users
  // Delete user: http://localhost:3000/api/auth/users/123 (DELETE)
  
};