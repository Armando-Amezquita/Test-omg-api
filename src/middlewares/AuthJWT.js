const jwt = require('jsonwebtoken'),
    config =  require('../config'),
    User = require('../controllers/Users.controller')
    Boom = require('@hapi/boom');

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
        const apikey = req.header("apikey");
        if (apikey == null) throw Error()
        if(apikey != Buffer.from(config.APIKEY).toString('base64')) throw Error('Invalid ApiKey')
        // if(apikey != config.APIKEY) return res.status(500).send({message: "Invalid ApiKey"});
        next();
    } catch (error) {
        next(Boom.unauthorized(error));
    }
    
}

const isAdmin = async(req, res, next) => {
    let user = await User.getByToken(req.header('token'));
    if(user.role == 'seller') return res.status(401).json({
        message: "No Authorized"
    });
    req.user = user
    next();
}

const isUser = async(req, res, next) => {
    try {
        let user = await User.getByToken(req.header('token'));
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
    isAdmin,
    isUser
}