require('dotenv').config()
const pool = require('../../dbConfig').pool;
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const saltRounds = 10;

const loginUser = (req, response) => {
    const {username, password} = req.body;
    pool.query('SELECT * FROM users WHERE username = $1', [username], (error, result) => {
        if (error) {
            throw error
        }
        if (!result.rows.length){
            return response.status(400).json({"error": "Incorrect username or password."})
        }
        bcrypt.compare(password, result.rows[0].password, (err, res) => {
          if (err) throw err;
          if (res){
            const user = result.rows[0];
            const token = jwt.sign({username: user.username}, process.env.ACCESS_TOKEN);
            return response.status(200).json({token, username: user.username});
          }
          else{
            return response.status(400).json({"error": "Incorrect username or password."})
          }
        })
        

    })
}

const createUser = (req, res) => {
    const { username, password } = req.body
    pool.query('SELECT * FROM users WHERE username = $1', [username], (error, result) => {
      if (error) throw error;
      if (result.rows.length){
        return res.status(400).json({"error": "Username already in use"})
      }
      bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hash], (error, result) => {
            if (error) {
              throw error
            }
            const token = jwt.sign({username: username}, process.env.ACCESS_TOKEN);
            return res.status(200).json({token, username});
          })
        })
      })
    })
  
    
  }

module.exports = { createUser, loginUser }