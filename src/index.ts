



// import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
// import cors from '@fastify/cors';
// // import cors from 'fastify-cors';

// import fastifyJwt from '@fastify/jwt';
// import prisma from './config/db';
// import authRoutes from './routes/auth';
// import productRoutes from './routes/productroute';
// import blogRoutes from './routes/blog';
// import analytics from './routes/analytics';
// import oderRoutes from './routes/order';
// import { JwtUser } from './utils/jwt';
// import multipart from '@fastify/multipart';
// import fastifyStatic from '@fastify/static';
// import path from 'path';

// const app: FastifyInstance = fastify({
//   logger: true,
// });

// app.register(cors, {
//   origin: 'http://localhost:5173',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// });

// app.register(multipart);

// // Serve image uploads
// app.register(fastifyStatic, {
//   root: path.join(__dirname, './Uploads'), // Ensure this matches upload path
//   prefix: '/Uploads/',
//   setHeaders: (res) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
//     res.setHeader('Access-Control-Allow-Methods', 'GET');
//   },
// });



// app.register(fastifyJwt, {
//   secret: process.env.JWT_SECRET || 'your-very-secure-secret',
//   cookie: {
//     cookieName: 'token',
//     signed: false,
//   },
//   sign: {
//     expiresIn: '1d',
//   },
// });

// declare module '@fastify/jwt' {
//   interface FastifyJWT {
//     user: JwtUser;
//   }
// }

// app.register(authRoutes, { prefix: '/api/auth' });
// app.register(productRoutes, { prefix: '/api/products' });
// app.register(blogRoutes, { prefix: '/api/blogs' });
// app.register(analytics, { prefix: '/api/analytics' });
// app.register(oderRoutes, { prefix: '/api/order' });

// app.get('/health', async () => {
//   return { status: 'ok' };
// });

// app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
//   try {
//     await request.jwtVerify();
//   } catch (err) {
//     reply.code(401).send({ success: false, error: 'Unauthorized' });
//   }
// });

// const start = async () => {
//   try {
//     await prisma.$connect();
//     const address = await app.listen({
//       port: Number(process.env.PORT) || 3000,
//       host: process.env.HOST || '0.0.0.0',
//     });
//     console.log(`Server listening at ${address}`);
//   } catch (err) {
//     app.log.error(err);
//     process.exit(1);
//   }
// };

// ['SIGTERM', 'SIGINT'].forEach((signal) => {
//   process.on(signal, async () => {
//     await prisma.$disconnect();
//     await app.close();
//     process.exit(0);
//   });
// });

// start().catch((err) => {
//   console.error(err);
//   process.exit(1);
// });

// declare module 'fastify' {
//   interface FastifyInstance {
//     authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
//   }
// }








import * as dotenv from 'dotenv';
import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import prisma from './config/db';
import authRoutes from './routes/auth';
import productRoutes from './routes/productroute';
import blogRoutes from './routes/blog';
import analytics from './routes/analytics';
import oderRoutes from './routes/order';
import { JwtUser } from './utils/jwt';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

const app: FastifyInstance = fastify({
  logger: true,
});

app.register(cors, {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

app.register(multipart);

// Serve image uploads
app.register(fastifyStatic, {
  root: path.join(__dirname, './Uploads'),
  prefix: '/Uploads/',
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
  },
});

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'your-very-secure-secret',
  cookie: {
    cookieName: 'token',
    signed: false,
  },
  sign: {
    expiresIn: '1d',
  },
});

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: JwtUser;
  }
}

app.register(authRoutes, { prefix: '/api/auth' });
app.register(productRoutes, { prefix: '/api/products' });
app.register(blogRoutes, { prefix: '/api/blogs' });
app.register(analytics, { prefix: '/api/analytics' });
app.register(oderRoutes, { prefix: '/api/order' });

app.get('/health', async () => {
  return { status: 'ok' };
});

app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ success: false, error: 'Unauthorized' });
  }
});

const start = async () => {
  try {
    await prisma.$connect();
    const address = await app.listen({
      port: Number(process.env.PORT) || 3000,
      host: process.env.HOST || '0.0.0.0',
    });
    console.log(`Server listening at ${address}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

['SIGTERM', 'SIGINT'].forEach((signal) => {
  process.on(signal, async () => {
    await prisma.$disconnect();
    await app.close();
    process.exit(0);
  });
});

start().catch((err) => {
  console.error(err);
  process.exit(1);
});

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}