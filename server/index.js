require('dotenv').config();
var path = require('path');
const express = require('express');
const api = require('./routes/api')
const auth = require('./routes/auth')
var multer  = require('multer')

const cors = require('cors')

const authjwt = require('./middleware/auth').authjwt

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
     },
    filename: function (req, file, cb) {
        cb(null , req.body.name + '.' + file.originalname.split('.').pop());
        
    }
});
var upload = multer({ storage: storage })


// Express and port setup
const app = express();
const port = process.env.PORT;
var dir = path.join(__dirname, 'uploads');
app.use(express.static(dir));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors())

// app.get('/users', authjwt, api.getUsers);
app.post('/users', auth.createUser);

app.post('/login', auth.loginUser);

// Image routes
app.post('/images', authjwt, upload.single('demo-file'), api.createImage);
app.get('/images', authjwt, api.getImages)
app.delete('/images/:image_id', authjwt, api.deleteImage);
app.get('/images/:image_id', authjwt, api.getImage);
app.post('/images/tag', authjwt, api.getTaggedImages);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});