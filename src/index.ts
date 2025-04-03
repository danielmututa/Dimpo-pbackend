// src/index.ts
import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import prisma from './config/db'; // Importing PrismaClient

const app: FastifyInstance = fastify({
  logger: true,
});

app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

// Interface for user creation request body
interface UserRequestBody {
  username: string;
  email: string;
  password_hash: string; // In a real app, you'd hash this
}

// Route to create a user
app.post<{ Body: UserRequestBody }>('/users', async (request, reply) => {
  try {
    const { username, email, password_hash } = request.body;

    // Create a new user using Prisma
    const result = await prisma.users.create({
      data: {
        username,
        email,
        password_hash, // In production, hash this with bcrypt
        role: 'user', // Default role from your schema
      },
    });

    return reply.code(201).send({
      success: true,
      data: {
        id: result.id,
        username: result.username,
        email: result.email,
        role: result.role,
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    app.log.error(error.message);
    return reply.code(500).send({
      success: false,
      error: 'Failed to create user',
    });
  }
});

// Health check endpoint
app.get('/health', async () => {
  return { status: 'ok' };
});

const start = async () => {
  try {
    await prisma.$connect(); // Connect to the database
    const address = await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log(`Server listening at ${address}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};


console.log("Starting server...");
start().catch(err => {
  console.error(err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  await app.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  await app.close();
  process.exit(0);
});
