// src/services/authService.ts
import { PrismaClient, users } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { 
  registerSchema, 
  loginSchema, 
  changePasswordSchema, 
  resetPasswordSchema ,
  
} from '../utils/schemas'; // Adjust path based on your structure

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export const registerUser = async (data: typeof registerSchema._type): Promise<users> => {
  const { username, email, password } = registerSchema.parse(data); // Validate with Zod
  
  // Check if user already exists
  const existingUser = await prisma.users.findFirst({
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
  const user = await prisma.users.create({
    data: {
      username,
      email,
      password_hash: hashedPassword,
      role: 'user' // Default role
    }
  });
  
  return user;
};

export const loginUser = async (data: typeof loginSchema._type): Promise<users> => {
  const { email, password } = loginSchema.parse(data); // Validate with Zod
  
  const user = await prisma.users.findUnique({
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
  data: typeof changePasswordSchema._type
): Promise<void> => {
  const { currentPassword, newPassword } = changePasswordSchema.parse(data); // Validate with Zod
  
  const user = await prisma.users.findUnique({
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
  
  await prisma.users.update({
    where: { id: userId },
    data: { password_hash: hashedPassword }
  });
};

export const forgotPassword = async (email: string): Promise<void> => {
  const user = await prisma.users.findUnique({
    where: { email }
  });
  
  if (!user) {
    // Don't reveal whether the email exists
    return;
  }
  
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now
  
  await prisma.password_resets.create({
    data: {
      user_id: user.id,
      reset_token: token,
      created_at: expiresAt
    }
  });
  
  // Since sendEmail is removed, log the reset link for now
  const resetLink = `http://yourfrontend.com/reset-password?token=${token}`;
  console.log(`Password reset link: ${resetLink}`);
  // In a real app, you'd implement email sending logic here
};



export const resetPassword = async (data: typeof resetPasswordSchema._type): Promise<void> => {
  const { token, newPassword } = resetPasswordSchema.parse(data);
  
  // 1. Find the most recent reset record (including user relation)
  const resetRecord = await prisma.password_resets.findFirst({
    where: { reset_token: token },
    orderBy: { created_at: 'desc' },
    include: { users: true }
  });

  // 2. Comprehensive validation with proper null checks
  if (!resetRecord?.user_id || !resetRecord.created_at || !resetRecord.users) {
    if (resetRecord?.user_id) {
      // Clean up orphaned records if user_id exists but user doesn't
      await prisma.password_resets.deleteMany({ where: { user_id: resetRecord.user_id } });
    }
    throw new Error('Invalid or expired token');
  }

  // 3. Check token expiration (1 hour validity)
  const tokenExpiration = new Date(resetRecord.created_at.getTime() + 3600000);
  if (new Date() > tokenExpiration) {
    await prisma.password_resets.deleteMany({ where: { user_id: resetRecord.user_id } });
    throw new Error('Token has expired');
  }

  // 4. Update password and clean up all user's reset tokens
  await prisma.$transaction([
    prisma.users.update({
      where: { id: resetRecord.user_id },
      data: { 
        password_hash: await bcrypt.hash(newPassword, SALT_ROUNDS) 
      }
    }),
    prisma.password_resets.deleteMany({
      where: { user_id: resetRecord.user_id }
    })
  ]);
};

// Updated function to get a user by username or email
export const getUser = async (identifier: { username?: string | undefined; email?: string | undefined }): Promise<{ username: string; email: string } | null> => {
  const user = await prisma.users.findFirst({
    where: {
      OR: [
        identifier.username !== undefined ? { username: identifier.username } : {},
        identifier.email !== undefined ? { email: identifier.email } : {}
      ].filter(Boolean) as { username?: string }[] | { email?: string }[] // Ensure type safety
    },
    select: {
      username: true,
      email: true
    }
  });
  
  if (!user) {
    return null; 
  }
  
  return user;
};
