require('dotenv').config();
const express = require('express');
const api = require('./routes/api')
const auth = require('./routes/auth')
var multer  = require('multer')

const authjwt = require('./middleware/auth').authjwt

var storage = multer.memoryStorage()
var upload = multer({ storage: storage })


// Express and port setup
const app = express();
const port = process.env.PORT;
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/users', authjwt, api.getUsers);
app.post('/users',api.createUser);

app.post('/login', auth.loginUser);

// Image routes
app.post('/images', authjwt, upload.single('demo-file'), api.createImage);
app.get('/images', authjwt, api.getImages)
app.delete('/images/:image_id', authjwt, api.deleteImage);
app.get('/images/:image_id', authjwt, api.getImage);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});