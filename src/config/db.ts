// // db.js
// require('dotenv').config();
// const { Pool } = require('pg');

// const pool = new Pool({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   database: process.env.DB_DATABASE,
// });

// module.exports = pool;



import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT), // Ensure it's a number
  database: process.env.DB_DATABASE,
});

export default pool;
