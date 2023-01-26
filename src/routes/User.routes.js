const { Router } = require('express');
const { verifyToken, apikey, isUser } = require('../middlewares/AuthJWT');
const { ClassUsers } = require('../controllers/Users.controller');
const routerUsers = Router();


routerUsers.post('/', async (req, res, next) => {
    try {
        const response = await ClassUsers.create( req.body );
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

routerUsers.get('/', verifyToken, apikey, isUser,  async (req, res, next) =>{
    try {
        const response = await ClassUsers.getAll();
        res.status(200).json(response);
    } catch (error) {
        res.status(403);
        next(error);
    }
});

routerUsers.get('/:id' , verifyToken, apikey, isUser , async(req, res, next) => {
    try {
        const response = await ClassUsers.getById(req.params.id);
        if(response === undefined)
            throw new Error('Error');

        if(Object.keys(response).length === 0)
            throw new Error('No se encontro un usuario con ese ID');
        
        return res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});


module.exports = { routerUsers };