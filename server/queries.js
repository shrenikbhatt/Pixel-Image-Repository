require('dotenv').config();
const Pool = require('pg').Pool

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'imagerepo',
  password: process.env.PG_PASS,
  port: 5432,
})

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY user_id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

const createUser = (request, response) => {
    const { username, password } = request.body
  
    pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password], (error, result) => {
      if (error) {
        throw error
      }
      response.status(201).send(`User added with ID: ${result.user_id}`)
    })
}

const createImage = (request, response) => {
    const {username, tags, name} = request.body;
    const data = request.file.buffer;
    pool.query('INSERT INTO images (username, name, tags, data) VALUES ($1, $2, $3, $4)', [username, name, JSON.parse(tags), data], (error, result) => {
        if (error) {
          throw error
        }
        response.status(201).send(`User added with ID: ${result.user_id}`)
      })
}

module.exports = {getUsers, createUser, createImage}