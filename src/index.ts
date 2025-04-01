import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import pool from './config/db';



const app: FastifyInstance = fastify({
  logger: true
});


app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
});


interface TodoRequestBody {
  title: string;
  completed?: boolean;

}

app.post<{ Body: TodoRequestBody }>('/todos', async (request, reply) => {
  try {
    const { title, completed = false } = request.body;
    const result = await pool.query(
      'INSERT INTO todos (title, completed) VALUES ($1, $2) RETURNING *',
      [title, completed]
    );
    return reply.code(201).send({
      success: true,
      data: result.rows[0]
    });
  } catch (err: unknown) {
    const error = err as Error;
    app.log.error(error.message);
    return reply.code(500).send({
      success: false,
      error: 'Failed to create todo'
    });
  }
});


const start = async () => {
  try {
    const address = await app.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

console.log("10. Calling start()...");
start().catch(err => {
  process.exit(1);
});























// import fastify, { FastifyInstance } from 'fastify';
// import cors from '@fastify/cors';
// import authRoutes from './routes/auth.routes';
// import prisma from './config/db';

// const app: FastifyInstance = fastify({
//   logger: true
// });

// // Register CORS
// app.register(cors, {
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE']
// });

// // Register routes
// app.register(authRoutes, { prefix: '/api/auth' });

// // Health check endpoint
// app.get('/health', async () => {
//   return { status: 'ok' };
// });

// // Graceful shutdown
// const start = async () => {
//   try {
//     await prisma.$connect();
//     const address = await app.listen({ 
//       port: parseInt(process.env.PORT || '3000'), 
//       host: '0.0.0.0' 
//     });
//     console.log(`Server listening at ${address}`);
//   } catch (err) {
//     app.log.error(err);
//     process.exit(1);
//   }
// };

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

// start().catch(err => {
//   console.error(err);
//   process.exit(1);
// });