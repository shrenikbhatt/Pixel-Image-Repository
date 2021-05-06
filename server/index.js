require('dotenv').config();
const express = require('express');
const db = require('./queries')
var multer  = require('multer')

var storage = multer.memoryStorage()
var upload = multer({ storage: storage })


// Express and port setup
const app = express();
const port = process.env.PORT;
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/users', db.getUsers);
app.post('/users',db.createUser);
app.post('/images', upload.single('demo-file'), db.createImage);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});