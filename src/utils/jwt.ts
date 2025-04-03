// import jwt, { JwtPayload } from 'jsonwebtoken';
// import { users } from '@prisma/client';

// // Ensure environment variables are properly typed
// const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || 'your-very-secure-secret';
// const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '1d';

// // Export the interface
// export interface CustomJwtPayload extends JwtPayload {
//   id: number;
//   email: string;
//   role: string;
// }

// export const generateToken = (user: users): string => {
//   const payload: CustomJwtPayload = {
//     id: user.id,
//     email: user.email,
//     role: user.role || 'user', // Provide default if null
//     exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 1 day expiration
//   };

//   return jwt.sign(payload, JWT_SECRET);
// };


// export const verifyToken = (token: string): CustomJwtPayload => {
//   const decoded = jwt.verify(token, JWT_SECRET);
//   return decoded as CustomJwtPayload;
// };






import jwt, { JwtPayload } from 'jsonwebtoken';
import { users } from '@prisma/client';

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || 'your-very-secure-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

// Export both the interface and type for consistency
export interface JwtUser extends JwtPayload {
  id: number;
  email: string;
  role: string;
}

export const generateToken = (user: users): string => {
  const payload: JwtUser = {
    id: user.id,
    email: user.email,
    role: user.role || 'user',
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 1 day expiration
  };

  return jwt.sign(payload, JWT_SECRET);
};

export const verifyToken = (token: string): JwtUser => {
  return jwt.verify(token, JWT_SECRET) as JwtUser;
};


