const pool = require('../../dbConfig').pool;

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY user_id ASC', (error, results) => {
      if (error) {
        throw error
      }
      return response.status(200).json(results.rows)
    })
  }
  
  
  const createImage = (request, response) => {
    const username = request.user.username;
    const {tags, name} = request.body;
    const path = 'http://localhost:3000/' + request.file.filename; 
    pool.query('INSERT INTO images (username, name, tags, path) VALUES ($1, $2, $3, $4)', [username, name, JSON.parse(tags), path], (error, result) => {
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
      res.rows.forEach(item => {
        item.data = 'data:image/jpeg;base64,'+Buffer.from(new Uint8Array(item.data).reduce((data,byte) => data+ String.fromCharCode(byte), '')).toString('base64')
      })

      response.status(200).json(res.rows);
    })
  }

  const deleteImage = (request, response) => {
    const username = request.user.username;
    const image_id = parseInt(request.params.image_id);
    console.log(image_id, username)
    pool.query('DELETE FROM images WHERE image_id = $1 AND username = $2', [image_id, username], (err, res) => {
      if (err) throw err;
      response.status(200).send(`Image deleted with id: ${image_id}`);
    })
  }

  const getImage = (request, response) => {
    const username = request.user.username;
    const image_id = parseInt(request.params.image_id);
    pool.query('SELECT * FROM images WHERE image_id = $1 AND username = $2', [image_id, username], (err, res) => {
      if (err) throw err;
      response.status(200).json(res.rows[0]);
    })
  }

  const getTaggedImages = (request, response) => {
    const username = request.user.username;
    const {tag} = request.body
    console.log(tag, username)
    pool.query('SELECT * FROM images WHERE $1 = ANY (tags) AND username = $2', [tag, username], (err, res) => {
      if (err) throw err;
      response.status(200).json(res.rows);
    })
  }
  
  module.exports = {getUsers, createImage, getImages, deleteImage, getImage, getTaggedImages}