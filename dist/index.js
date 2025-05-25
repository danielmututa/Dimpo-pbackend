"use strict";
// import * as dotenv from 'dotenv';
// import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
// import cors from '@fastify/cors';
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
// import fs from 'fs';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// // Load environment variables from .env file
// dotenv.config();
// const app: FastifyInstance = fastify({
//   logger: true,
// });
// // app.register(cors, {
// //   origin: 'http://localhost:5173',
// //   credentials: true,
// //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// //   allowedHeaders: ['Content-Type', 'Authorization'],
// // });
// // Replace your current CORS configuration with this
// app.register(cors, {
//   origin: (origin, cb) => {
//     const allowedOrigins = [
//       'https://dimbop-digital-marketing-dashboard.vercel.app',
//       'http://localhost:5173',
//     ];
//     // f
//     if (!origin) {
//       cb(null, true);
//       return;
//     }
//     if (allowedOrigins.includes(origin)) {
//       // Return the actual requesting origin instead of just true
//       cb(null, origin);
//     } else {
//       console.error(`CORS blocked for origin: ${origin}`);
//       cb(new Error('Not allowed by CORS'), false);
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// });
// // Replace your current CORS configuration with this simplest version
// // app.register(cors, { 
// //   origin: true,  // Allow all origins temporarily to test
// //   credentials: true 
// // });
// app.get('/api/debug/cors', async (request, reply) => {
//   // Just for debugging
//   const requestOrigin = request.headers.origin;
//   return {
//     requestOrigin,
//     allowedOrigins: [
//       'https://dimbop-digital-marketing-dashboard.vercel.app',
//       'http://localhost:5173',
//     ],
//     wouldBeAllowed: [
//       'https://dimbop-digital-marketing-dashboard.vercel.app',
//       'http://localhost:5173',
//     ].includes(requestOrigin || '')
//   };
// });
// app.register(multipart);
// // Serve image uploads
// // app.register(fastifyStatic, {
// //   root: path.join(__dirname, './Uploads'),
// //   prefix: '/Uploads/',
// //   setHeaders: (res) => {
// //     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
// //     res.setHeader('Access-Control-Allow-Methods', 'GET');
// //   },
// // });
// app.register(fastifyStatic, {
//   root: path.join(__dirname, 'Uploads'),
//   prefix: '/Uploads/',
//   setHeaders: (res) => {
//     // Allow all origins or configure based on environment
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET');
//   },
// });
// const uploadsDir = path.join(__dirname, 'Uploads');
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }
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
// // app.get('/api/debug/env', async (request, reply) => {
// //   return {
// //     nodeEnv: process.env.NODE_ENV,
// //     port: process.env.PORT,
// //     host: process.env.HOST,
// //     databaseUrl: process.env.DATABASE_URL ? 'Set (value hidden)' : 'Not Set',
// //     uploadsDir: path.join(__dirname, 'Uploads'),
// //     uploadsExists: fs.existsSync(path.join(__dirname, 'Uploads')),
// //   };
// // });
// if (process.env.NODE_ENV !== 'production') {
//   app.get('/api/debug/env', async (request, reply) => {
//     return {
//       nodeEnv: process.env.NODE_ENV,
//       port: process.env.PORT,
//       host: process.env.HOST,
//       databaseUrl: process.env.DATABASE_URL ? 'Set (value hidden)' : 'Not Set',
//       uploadsDir: path.join(__dirname, 'Uploads'),
//       uploadsExists: fs.existsSync(path.join(__dirname, 'Uploads')),
//     };
//   });
// }
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
const dotenv = __importStar(require("dotenv"));
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
const static_1 = __importDefault(require("@fastify/static"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv.config();
const app = (0, fastify_1.default)({
    logger: true,
});
// CORS config with whitelist and preflight support
// app.register(cors, {
//   origin: (origin, cb) => {
//     const allowedOrigins = [
//       'https://dimbop-digital-marketing-dashboard-k0l3ky04b.vercel.app',
//       'https://dimbop-digital-dasboard.netlify.app',
//       'http://localhost:5173',
//     ];
//     if (!origin) {
//       // Allow requests with no origin like curl or server-to-server
//       cb(null, true);
//       return;
//     }
//     if (allowedOrigins.includes(origin)) {
//       cb(null, origin);
//     } else {
//       console.error(`CORS blocked for origin: ${origin}`);
//       cb(new Error('Not allowed by CORS'), false);
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
// });
// app.register(cors, {
//   origin: (origin, cb) => {
//     const allowedOrigins = [
//       'https://dimbop-digital-marketing-dashboard-k0l3ky04b.vercel.app',
//       'https://dimbop-digital-dasboard.netlify.app',  // Check spelling here
//       'http://localhost:5173',
//     ];
//     console.log(`Incoming request from origin: ${origin}`);
//     console.log(`Allowed origins:`, allowedOrigins);
//     if (!origin) {
//       console.log('No origin provided, allowing request');
//       cb(null, true);
//       return;
//     }
//     if (allowedOrigins.includes(origin)) {
//       console.log(`Origin ${origin} is allowed`);
//       cb(null, origin);
//     } else {
//       console.error(`CORS blocked for origin: ${origin}`);
//       cb(new Error('Not allowed by CORS'), false);
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
// });
// Replace your entire CORS config with this temporary solution
app.register(cors_1.default, {
    origin: true, // This will accept ALL origins (less secure but works immediately)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
});
app.register(multipart_1.default);
// Serve static uploads with proper CORS headers
app.register(static_1.default, {
    root: path_1.default.join(__dirname, 'Uploads'),
    prefix: '/Uploads/',
    setHeaders: (res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
    },
});
// Ensure Uploads directory exists
const uploadsDir = path_1.default.join(__dirname, 'Uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
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
// Register routes
app.register(auth_1.default, { prefix: '/api/auth' });
app.register(productroute_1.default, { prefix: '/api/products' });
app.register(blog_1.default, { prefix: '/api/blogs' });
app.register(analytics_1.default, { prefix: '/api/analytics' });
app.register(order_1.default, { prefix: '/api/order' });
// Health check endpoint  
// ...............here
app.get('/health', async () => {
    return { status: 'ok' };
});
// Debug env info in non-production only
if (process.env.NODE_ENV !== 'production') {
    app.get('/api/debug/env', async () => {
        return {
            nodeEnv: process.env.NODE_ENV,
            port: process.env.PORT,
            host: process.env.HOST,
            databaseUrl: process.env.DATABASE_URL ? 'Set (value hidden)' : 'Not Set',
            uploadsDir,
            uploadsExists: fs_1.default.existsSync(uploadsDir),
        };
    });
}
// JWT auth decorator
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
// $env:Path += ";C:\Program Files\PostgreSQL\17\bin"
// pg_dump -U postgres -d inventortest > inventortest_dump.sql 
// Get-Content inventortest_dump.sql | psql "postgresql://postgres:CEJtqVqKtvmApKPMuKAsCbrwXHoNuRtz@caboose.proxy.rlwy.net:29455/railway"
//# sourceMappingURL=index.js.map