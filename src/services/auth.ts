import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '../utils/email';
import { 
  RegisterInput, 
  LoginInput,
  ChangePasswordInput,
  ResetPasswordInput
} from '../utils/types';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export const registerUser = async (data: RegisterInput): Promise<User> => {
  const { username, email, password } = data;
  
  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { username },
        { email }
      ]
    }
  });
  
  if (existingUser) {
    throw new Error('Username or email already in use');
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  
  // Create user
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password_hash: hashedPassword,
      role: 'user' // Default role
    }
  });
  
  return user;
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  
  if (!passwordMatch) {
    throw new Error('Invalid credentials');
  }
  
  return user;
};

export const changePassword = async (
  userId: number, 
  currentPassword: string, 
  newPassword: string
): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);
  
  if (!passwordMatch) {
    throw new Error('Current password is incorrect');
  }
  
  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  
  await prisma.user.update({
    where: { id: userId },
    data: { password_hash: hashedPassword }
  });
};

export const forgotPassword = async (email: string): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    // Don't reveal whether the email exists
    return;
  }
  
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now
  
  await prisma.passwordResets.create({
    data: {
      user_id: user.id,
      reset_token: token,
      created_at: expiresAt
    }
  });
  
  const resetLink = `http://yourfrontend.com/reset-password?token=${token}`;
  
  await sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html: `Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.`
  });
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  const resetRecord = await prisma.passwordResets.findFirst({
    where: { reset_token: token },
    orderBy: { created_at: 'desc' }
  });
  
  if (!resetRecord || new Date(resetRecord.created_at) < new Date()) {
    throw new Error('Invalid or expired token');
  }
  
  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  
  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetRecord.user_id },
      data: { password_hash: hashedPassword }
    }),
    prisma.passwordResets.deleteMany({
      where: { user_id: resetRecord.user_id }
    })
  ]);
};