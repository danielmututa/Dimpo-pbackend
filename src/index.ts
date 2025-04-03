// // src/index.ts
// import fastify, { FastifyInstance } from 'fastify';
// import cors from '@fastify/cors';
// import jwt from '@fastify/jwt';
// import prisma from './config/db';
// import authRoutes from './routes/auth'; // Your routes file

// const app: FastifyInstance = fastify({
//   logger: true,
// });

// app.register(cors, {
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
// });

// // Register JWT plugin
// app.register(jwt, {
//   secret: process.env.JWT_SECRET || 'supersecretkey', // Add JWT_SECRET to your .env
// });

// // Register auth routes with /api/auth prefix
// app.register(authRoutes, { prefix: '/api/auth' });

// // Health check endpoint
// app.get('/health', async () => {
//   return { status: 'ok' };
// });

// // Add JWT authentication decorator
// app.decorate('authenticate', async (request: any, reply: any) => {
//   try {
//     await request.jwtVerify();
//   } catch (err) {
//     reply.code(401).send({ success: false, error: 'Unauthorized' });
//   }
// });

// const start = async () => {
//   try {
//     await prisma.$connect(); // Connect to the database
//     const address = await app.listen({ port: 3000, host: '0.0.0.0' });
//     console.log(`Server listening at ${address}`);
//   } catch (err) {
//     app.log.error(err);
//     process.exit(1);
//   }
// };

// console.log("Starting server...");
// start().catch(err => {
//   console.error(err);
//   process.exit(1);
// });

// // Graceful shutdown
// process.on('SIGTERM', async () => {
//   await prisma.$disconnect();
//   await app.close();
//   process.exit(0);
// });

// process.on('SIGINT', async () => {
//   await prisma.$disconnect();
//   await app.close();
//   process.exit(0);
// });

// // Declare module augmentation for FastifyInstance
// declare module 'fastify' {
//   interface FastifyInstance {
//     authenticate: (request: any, reply: any) => Promise<void>;
//   }
// }




// src/index.ts
import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt'; // Note: Can use either 'jwt' or 'fastifyJwt' as import name
import prisma from './config/db';
import authRoutes from './routes/auth';
import { JwtUser } from './utils/jwt';

const app: FastifyInstance = fastify({
  logger: true,
});

// 1. First register CORS
app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

// 2. Register JWT plugin (BEST PRACTICE VERSION)
app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'your-very-secure-secret',
  cookie: {
    cookieName: 'token',
    signed: false
  },
  sign: {
    expiresIn: '1d' // Token expires in 1 day
  }
});

// Type augmentation must come AFTER jwt registration
declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: JwtUser; // Your custom user type
  }
}

// 3. Register routes
app.register(authRoutes, { prefix: '/api/auth' });

// Health check endpoint
app.get('/health', async () => {
  return { status: 'ok' };
});

// Authentication decorator
app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ success: false, error: 'Unauthorized' });
  }
});

// Server startup
const start = async () => {
  try {
    await prisma.$connect();
    const address = await app.listen({
      port: Number(process.env.PORT) || 3000,
      host: process.env.HOST || '0.0.0.0'
    });
    console.log(`Server listening at ${address}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

// Graceful shutdown
['SIGTERM', 'SIGINT'].forEach(signal => {
  process.on(signal, async () => {
    await prisma.$disconnect();
    await app.close();
    process.exit(0);
  });
});

start().catch(err => {
  console.error(err);
  process.exit(1);
});

// Fastify instance type extension
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}