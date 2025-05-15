import { FastifyRequest, FastifyReply } from 'fastify';
export declare const register: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
export declare const login: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
export declare const changePassword: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
export declare const forgotPassword: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
export declare const resetPassword: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
export declare const getUser: (request: FastifyRequest, reply: FastifyReply) => Promise<undefined>;
export declare const getAllUsers: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
export declare const deleteUser: (request: FastifyRequest, reply: FastifyReply) => Promise<undefined>;
