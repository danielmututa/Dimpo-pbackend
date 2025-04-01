"use strict";
// // db.js
// require('dotenv').config();
// const { Pool } = require('pg');
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const pool = new Pool({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   database: process.env.DB_DATABASE,
// });
// module.exports = pool;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const pool = new pg_1.Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT), // Ensure it's a number
    database: process.env.DB_DATABASE,
});
exports.default = pool;
//# sourceMappingURL=db.js.map