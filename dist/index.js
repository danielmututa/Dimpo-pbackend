"use strict";
// // src/index.ts
// import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
// import cors from '@fastify/cors';
// import fastifyJwt from '@fastify/jwt'; // Note: Can use either 'jwt' or 'fastifyJwt' as import name
// import prisma from './config/db';
// import authRoutes from './routes/auth';
// import productRoutes from './routes/productroute';
// import blogRoutes from "./routes/blog"
// import analytics from  "./routes/analytics"
// import oderRoutes from "./routes/order"
// import { JwtUser } from './utils/jwt';
// import multipart from '@fastify/multipart';
// import fastifyStatic from '@fastify/static';
// import path from 'path';
// // import deviceTypePlugin from './plugins/plugins';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const app: FastifyInstance = fastify({
//   logger: true,
// });
// // 1. First register CORS
// // app.register(cors, {
// //   origin: '*',
// //   methods: ['GET', 'POST', 'PUT', 'DELETE'],
// // });
// app.register(cors, {
//   origin: 'http://localhost:5173', // Your frontend URL (replace if different)
//   credentials: true, // IMPORTANT - enables cookies/credentials
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Add OPTIONS
//   allowedHeaders: ['Content-Type', 'Authorization'],
// });
// app.register(multipart);
// // ✅ (Optional) Serve image uploads
// app.register(fastifyStatic, {
//   root: path.join(__dirname, '../uploads'),
//   prefix: '/uploads/',
// });
// // 
// // 2. Register JWT plugin (BEST PRACTICE VERSION)
// app.register(fastifyJwt, {
//   secret: process.env.JWT_SECRET || 'your-very-secure-secret',
//   cookie: {
//     cookieName: 'token',
//     signed: false
//   },
//   sign: {
//     expiresIn: '1d' // Token expires in 1 day
//   }
// });
// // Type augmentation must come AFTER jwt registration
// declare module '@fastify/jwt' {
//   interface FastifyJWT {
//     user: JwtUser; // Your custom user type
//   }
// }
// // 3. Register routes
// app.register(authRoutes, { prefix: '/api/auth' });
// app.register(productRoutes, {prefix: 'api/products'})
// app.register(blogRoutes, {prefix: 'api/blogs'})
// app.register(analytics, {prefix: '/api/analytics'})
// app.register(oderRoutes, {prefix: '/api/order'})
// // Health check endpoint
// app.get('/health', async () => {
//   return { status: 'ok' };
// });
// // Authentication decorator
// app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
//   try {
//     await request.jwtVerify();
//   } catch (err) {
//     reply.code(401).send({ success: false, error: 'Unauthorized' });
//   }
// });
// // Server startup
// const start = async () => {
//   try {
//     await prisma.$connect();
//     const address = await app.listen({
//       port: Number(process.env.PORT) || 3000,
//       host: process.env.HOST || '0.0.0.0'
//     });
//     console.log(`Server listening at ${address}`);
//   } catch (err) {
//     app.log.error(err);
//     process.exit(1);
//   }
// };
// // Graceful shutdown
// ['SIGTERM', 'SIGINT'].forEach(signal => {
//   process.on(signal, async () => {
//     await prisma.$disconnect();
//     await app.close();
//     process.exit(0);
//   });
// });
// start().catch(err => {
//   console.error(err);
//   process.exit(1);
// });
// // Fastify instance type extension
// declare module 'fastify' {
//   interface FastifyInstance {
//     authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
//   }
// }
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const db_1 = __importDefault(require("./config/db"));
const auth_1 = __importDefault(require("./routes/auth"));
const productroute_1 = __importDefault(require("./routes/productroute"));
const blog_1 = __importDefault(require("./routes/blog"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const order_1 = __importDefault(require("./routes/order"));
const multipart_1 = __importDefault(require("@fastify/multipart"));
const fastify_static_1 = __importDefault(require("fastify-static"));
const path_1 = __importDefault(require("path"));
const app = (0, fastify_1.default)({
    logger: true,
});
app.register(cors_1.default, {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
});
app.register(multipart_1.default);
// Serve image uploads
app.register(fastify_static_1.default, {
    root: path_1.default.join(__dirname, './Uploads'), // Ensure this matches upload path
    prefix: '/Uploads/',
    setHeaders: (res) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
    },
});
app.register(jwt_1.default, {
    secret: process.env.JWT_SECRET || 'your-very-secure-secret',
    cookie: {
        cookieName: 'token',
        signed: false,
    },
    sign: {
        expiresIn: '1d',
    },
});
app.register(auth_1.default, { prefix: '/api/auth' });
app.register(productroute_1.default, { prefix: '/api/products' });
app.register(blog_1.default, { prefix: '/api/blogs' });
app.register(analytics_1.default, { prefix: '/api/analytics' });
app.register(order_1.default, { prefix: '/api/order' });
app.get('/health', async () => {
    return { status: 'ok' };
});
app.decorate('authenticate', async (request, reply) => {
    try {
        await request.jwtVerify();
    }
    catch (err) {
        reply.code(401).send({ success: false, error: 'Unauthorized' });
    }
});
const start = async () => {
    try {
        await db_1.default.$connect();
        const address = await app.listen({
            port: Number(process.env.PORT) || 3000,
            host: process.env.HOST || '0.0.0.0',
        });
        console.log(`Server listening at ${address}`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
['SIGTERM', 'SIGINT'].forEach((signal) => {
    process.on(signal, async () => {
        await db_1.default.$disconnect();
        await app.close();
        process.exit(0);
    });
});
start().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map