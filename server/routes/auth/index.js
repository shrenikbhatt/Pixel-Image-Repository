require('dotenv').config()
const pool = require('../../dbConfig').pool;
const jwt = require('jsonwebtoken')

const loginUser = (req, res) => {
    const {username, password} = req.body;
    pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password], (error, result) => {
        if (error) {
            throw error
        }
        // console.log(result.rows);
        // res.status(200).send(result.rows);
        if (!result.rows.length){
            return res.status(404).send("Incorrect username or password.")
        }
        const user = result.rows[0];
        const token = jwt.sign({username: user.username}, process.env.ACCESS_TOKEN);
        return res.status(200).json({token, username: user.username});

    })
}

const createUser = (req, res) => {
    const { username, password } = req.body
    pool.query('SELECT * FROM users WHERE username = $1', [username], (error, result) => {
      if (error) throw error;
      if (result.rows.length){
        return res.status(400).json({"Error": "Username already in use"})
      }
      pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password], (error, result) => {
        if (error) {
          throw error
        }
        const token = jwt.sign({username: username}, process.env.ACCESS_TOKEN);
        return res.status(200).json({token, username});
      })
    })
  
    
  }

module.exports = { createUser, loginUser }