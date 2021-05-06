require('dotenv').config();
const jwt = require('jsonwebtoken');

const authjwt = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader){
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
            if (err){
                return res.status(403).json({"Error": "Incorrect token"});
            }
            req.user = user;
            next();
        });
    }
    else{
        res.status(401).json({"Error": "No token provided"});
    }
}

module.exports = { authjwt }