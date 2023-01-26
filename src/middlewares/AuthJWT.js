const jwt = require('jsonwebtoken');
const config =  require('../config');
const { ClassUsers } = require('../controllers/Users.controller');
const Boom = require('@hapi/boom');

const verifyToken = async(req, res, next) => {
    try {
        const token = req.headers['token'];
        if(!token) throw new Error('Token no enviado');
        const decoded = jwt.verify(token, config.SECRET );
        req.accountId = decoded.id;
        next();
    } catch (error) {
        next(Boom.badData(error));
    }
}

const apikey = async(req, res, next) => {
    try {
        const apikeyencoded = req.header("apikey");
        if (apikey == null) throw Error()
        next();
    } catch (error) {
        next(Boom.unauthorized(error));
    }
    
}

const isUser = async(req, res, next) => {
    try {
        let user = await ClassUsers.getByToken(req.header('token'));
        req.user = user
        next();
        
    } catch (error) {
        return res.status(401).json({
            message: "No Authorized"
        });
    }
}

module.exports = {
    verifyToken, 
    apikey,
    isUser
}