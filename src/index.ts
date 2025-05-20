



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
import fs from 'fs';


// Load environment variables from .env file




dotenv.config();

const app: FastifyInstance = fastify({
  logger: true,
});

// app.register(cors, {
//   origin: 'http://localhost:5173',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// });


// app.register(cors, {
//   origin: (origin, cb) => {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return cb(null, true);
//     // Allow all origins in production or specific ones in development
//     const allowedOrigins = [
//       'http://localhost:5173',
//             'https://dimbop-digital-marketing-dashboard.vercel.app',
//       // Add your production frontend URL here
//     ];
//     if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'production') {
//       return cb(null, true);
//     }
//     return cb(new Error('Not allowed by CORS'), false);
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// });


app.register(cors, {
  origin: (origin, cb) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://dimbop-digital-marketing-dashboard.vercel.app',
    ];

    if (!origin) {
      // Allow non-browser requests (like Postman)
      cb(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      console.error(`❌ CORS blocked for origin: ${origin}`);
      cb(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});


app.register(multipart);

// Serve image uploads
// app.register(fastifyStatic, {
//   root: path.join(__dirname, './Uploads'),
//   prefix: '/Uploads/',
//   setHeaders: (res) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
//     res.setHeader('Access-Control-Allow-Methods', 'GET');
//   },
// });

app.register(fastifyStatic, {
  root: path.join(__dirname, 'Uploads'),
  prefix: '/Uploads/',
  setHeaders: (res) => {
    // Allow all origins or configure based on environment
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
  },
});


const uploadsDir = path.join(__dirname, 'Uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}


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


// app.get('/api/debug/env', async (request, reply) => {
//   return {
//     nodeEnv: process.env.NODE_ENV,
//     port: process.env.PORT,
//     host: process.env.HOST,
//     databaseUrl: process.env.DATABASE_URL ? 'Set (value hidden)' : 'Not Set',
//     uploadsDir: path.join(__dirname, 'Uploads'),
//     uploadsExists: fs.existsSync(path.join(__dirname, 'Uploads')),
//   };
// });


if (process.env.NODE_ENV !== 'production') {
  app.get('/api/debug/env', async (request, reply) => {
    return {
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT,
      host: process.env.HOST,
      databaseUrl: process.env.DATABASE_URL ? 'Set (value hidden)' : 'Not Set',
      uploadsDir: path.join(__dirname, 'Uploads'),
      uploadsExists: fs.existsSync(path.join(__dirname, 'Uploads')),
    };
  });
}



// app.get('/api/debug/db', async (request, reply) => {
//   try {
//     const result = await prisma.$queryRaw`SELECT 1 as connection_test`;
//     return { dbConnection: 'Success', result };
//   } catch (error) {
//     reply.code(500);
//     return { dbConnection: 'Failed', error.message };
//   }
// });

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

















// {
//   "name": "server",
//   "version": "1.0.0",
//   "main": "dist/index.js",
//   "scripts": {
//     "build": "tsc",
//     "start": "node dist/index.js --omit=dev",
//     "dev": "nodemon --watch \"src/**/*\" --ext ts,json --exec \"ts-node\" src/index.ts",
//     "prisma:generate": "prisma generate",
//     "prisma:migrate": "prisma migrate dev",
//     "migrate": "npx prisma migrate deploy",
//     "deploy": "npm run migrate && npm run start"
//   },
//   "dependencies": {
//     "@fastify/autoload": "^6.2.0",
//     "@fastify/compress": "^8.0.1",
//     "@fastify/cors": "^11.0.1",
//     "@fastify/helmet": "^13.0.1",
//     "@fastify/jwt": "^9.1.0",
//     "@fastify/multipart": "^9.0.3",
//     "@fastify/rate-limit": "^10.2.2",
//     "@fastify/static": "^8.1.1",
//     "@fastify/swagger": "^9.4.2",
//     "@fastify/type-provider-typebox": "^5.1.0",
//     "@prisma/client": "^6.5.0",
//     "@types/bcryptjs": "^2.4.6",
//     "@types/uuid": "^10.0.0",
//     "argon2": "^0.30.0",
//     "bcryptjs": "^3.0.2",
//     "dotenv": "^16.4.7",
//     "fastify": "^5.3.3",
//     "fastify-multipart": "^5.3.1",
//     "jsonwebtoken": "^9.0.2",
//     "nodemailer": "^6.10.0",
//     "or": "^0.2.0",
//     "pg": "^8.14.1",
//     "rimraf": "^6.0.1",
//     "ua-parser-js": "^2.0.3",
//     "uuid": "^11.1.0",
//     "zod": "^3.24.4",
//     "zod-to-json-schema": "^3.24.5"
//   },
//   "devDependencies": {
//     "@types/jsonwebtoken": "^9.0.9",
//     "@types/node": "^22.15.17",
//     "@types/pg": "^8.11.11",
//     "nodemon": "^3.1.9",
//     "prisma": "^6.5.0",
//     "ts-node": "^10.9.2",
//     "typescript": "^5.8.2"
//   }
// }