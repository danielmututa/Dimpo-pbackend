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

// export const registerUser = async (data: typeof registerSchema._type): Promise<users> => {
//   const { username, email, password } = registerSchema.parse(data); // Validate with Zod
  
//   // Check if user already exists
//   const existingUser = await prisma.users.findFirst({
//     where: {
//       OR: [
//         { username },
//         { email }
//       ]
//     }
//   });
  
//   if (existingUser) {
//     throw new Error('Username or email already in use');
//   }
  
//   // Hash password
//   const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  
//   // Create user
//   const user = await prisma.users.create({
//     data: {
//       username,
//       email,
//       password_hash: hashedPassword,
//       role: 'user' // Default role
//     }
//   });
  
//   return user;
// };


// src/services/authService.ts


// export const registerUser = async (data: typeof registerSchema._type): Promise<users> => {
//   const { username, email, password, phone } = registerSchema.parse(data); // Include phone
  
//   // Check if user already exists (add phone check)
//   const existingUser = await prisma.users.findFirst({
//     where: {
//       OR: [
//         { username },
//         { email },
//         { phone } // Check if phone already exists
//       ]
//     }
//   });
  
//   if (existingUser) {
//     if (existingUser.username === username) throw new Error('Username already in use');
//     if (existingUser.email === email) throw new Error('Email already in use');
//     if (existingUser.phone === phone) throw new Error('Phone number already in use');
//   }
  
//   // Hash password
//   const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  
//   // Create user with phone
//   const user = await prisma.users.create({
//     data: {
//       username,
//       email,
//       phone, // Add phone here
//       password_hash: hashedPassword,
//       role: 'user' // Default role
//     }
//   });
  
//   return user;
// };


// src/services/authService.ts
export const registerUser = async (data: typeof registerSchema._type): Promise<users> => {
   console.log('Registration data received:', data); // Add this
  const { username, email, password, phone, role } = registerSchema.parse(data); // Include role
    console.log('Role being used:', role); // Add this


  // Check if user already exists (add phone check)
  const existingUser = await prisma.users.findFirst({
    where: {
      OR: [
        { username },
        { email },
        { phone }
      ]
    }
  });
  
  if (existingUser) {
    if (existingUser.username === username) throw new Error('Username already in use');
    if (existingUser.email === email) throw new Error('Email already in use');
    if (existingUser.phone === phone) throw new Error('Phone number already in use');
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  
  // Create user with phone and role
  const user = await prisma.users.create({
    data: {
      username,
      email,
      phone,
      password_hash: hashedPassword,
      role: role, // Use the provided role instead of hardcoding 'user'
    }
  });
  
  return user;
};



// Update getUser function to handle nullable phone
export const getUser = async (identifier: { 
  username?: string | undefined; 
  email?: string | undefined;
  phone?: string | undefined; // Add phone option
}): Promise<{ username: string; email: string; phone: string | null } | null> => { // Change phone to string | null
  const user = await prisma.users.findFirst({
    where: {
      OR: [
        identifier.username !== undefined ? { username: identifier.username } : {},
        identifier.email !== undefined ? { email: identifier.email } : {},
        identifier.phone !== undefined ? { phone: identifier.phone } : {} // Add phone search
      ].filter(Boolean)
    },
    select: {
      username: true,
      email: true,
      phone: true // Include phone in response
    }
  });
  
  if (!user) {
    return null; 
  }
  
  return user;
};



// Update getAllUsers to include phone
export const getAllUsers = async (): Promise<Pick<users, 'id' | 'username' | 'email' | 'phone' | 'role' | 'created_at' | 'updated_at'>[]> => {
  const users = await prisma.users.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      phone: true, // Add phone
      role: true,
      created_at: true,
      updated_at: true
    },
    orderBy: {
      created_at: 'desc'
    }
  });
  
  return users;
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
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  if (!currentPassword || !newPassword) {
    throw new Error('Both current and new password are required');
  }

  if (currentPassword === newPassword) {
    throw new Error('New password must be different from current password');
  }

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
    return;
  }
  
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now
  // const expiresAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000; 
  
  await prisma.password_resets.create({
    data: {
      user_id: user.id,
      reset_token: token,
      created_at: expiresAt
    }
  });
  
  // Since sendEmail is removed, log the reset link for now
  const resetLink = `http://yourfrontend.com/reset-password?token=${token}`;

};



export const resetPassword = async (data: typeof resetPasswordSchema._type): Promise<void> => {

  const { token, newPassword } = resetPasswordSchema.parse(data);
  



// Add this to your resetPassword function
const tokenExists = await prisma.password_resets.findFirst({
  where: {
    reset_token: token,
    created_at: { gt: new Date(Date.now() - 3600000) } // 1 hour validity
  },
  include: { users: true }
});

if (!tokenExists) {
  throw new Error('Invalid or expired token');
}



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
// export const getUser = async (identifier: { username?: string | undefined; email?: string | undefined }): Promise<{ username: string; email: string } | null> => {
//   const user = await prisma.users.findFirst({
//     where: {
//       OR: [
//         identifier.username !== undefined ? { username: identifier.username } : {},
//         identifier.email !== undefined ? { email: identifier.email } : {}
//       ].filter(Boolean) as { username?: string }[] | { email?: string }[] // Ensure type safety
//     },
//     select: {
//       username: true,
//       email: true
//     }
//   });
  
//   if (!user) {
//     return null; 
//   }
  
//   return user;
// };




// export const getAllUsers = async (): Promise<Pick<users, 'id' | 'username' | 'email' | 'role' | 'created_at' | 'updated_at'>[]> => {
//   const users = await prisma.users.findMany({
//     select: {
//       id: true,
//       username: true,
//       email: true,
//       role: true,
//       created_at: true,
//       updated_at: true
//       // Explicitly exclude sensitive fields
//     },
//     orderBy: {
//       created_at: 'desc'
//     }
//   });
  
//   return users;
// };

export const deleteUser = async (userId: number): Promise<void> => {
  // First check if user exists
  const user = await prisma.users.findUnique({
    where: { id: userId }
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Use a transaction to ensure all related data is deleted
  await prisma.$transaction([
    // Delete any password reset tokens first
    prisma.password_resets.deleteMany({
      where: { user_id: userId }
    }),
    // Then delete the user
    prisma.users.delete({
      where: { id: userId }
    })
  ]);
};