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





