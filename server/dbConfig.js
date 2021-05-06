require('dotenv').config();
const Pool = require('pg').Pool

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'imagerepo',
  password: process.env.PG_PASS,
  port: 5432,
})

module.exports = { pool }