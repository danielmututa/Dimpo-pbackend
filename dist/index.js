"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const db_1 = __importDefault(require("./config/db"));
// Initialize Fastify with TypeScript support
const app = (0, fastify_1.default)({
    logger: true
});
// Register CORS with TypeScript
app.register(cors_1.default, {
    origin: '*', // Adjust based on your security requirements
    methods: ['GET', 'POST', 'PUT', 'DELETE']
});
// POST /todos with TypeScript typing
app.post('/todos', async (request, reply) => {
    try {
        const { title, completed = false } = request.body;
        // Example database operation
        const result = await db_1.default.query('INSERT INTO todos (title, completed) VALUES ($1, $2) RETURNING *', [title, completed]);
        return reply.code(201).send({
            success: true,
            data: result.rows[0]
        });
    }
    catch (err) {
        const error = err;
        app.log.error(error.message);
        return reply.code(500).send({
            success: false,
            error: 'Failed to create todo'
        });
    }
});
// Start server with proper typing
const start = async () => {
    try {
        await app.listen({
            port: 3000,
            host: '0.0.0.0'
        });
        console.log(`Server listening on http://localhost:3000`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=index.js.map