const pool = require('../../dbConfig').pool;

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY user_id ASC', (error, results) => {
      if (error) {
        throw error
      }
      return response.status(200).json(results.rows)
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
    const username = request.user.username;
    const {tags, name} = request.body;
    const data = request.file.buffer;
    pool.query('INSERT INTO images (username, name, tags, data) VALUES ($1, $2, $3, $4)', [username, name, JSON.parse(tags), data], (error, result) => {
        if (error) {
          throw error
        }
        response.status(201).send(`User added with ID: ${result.user_id}`)
      })
  }
  
  const getImages = (request, response) => {
    const username = request.user.username;
    pool.query('SELECT * FROM images WHERE username = $1', [username], (err, res) => {
      if (err){
        throw err;
      }
      response.status(200).json(res.rows);
    })
  }
  
  module.exports = {getUsers, createUser, createImage, getImages}