const { Pool } = require('pg');
const fs = require('fs');
const db_pw = fs.readFileSync(process.env.DB_PASSWORD_FILE, 'utf-8');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: db_pw,
  port: process.env.DB_PORT,
});

module.exports = pool;