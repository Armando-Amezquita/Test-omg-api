const { Router } = require('express');
const { ClassProducts } = require('../controllers/Products.controller');
const { verifyToken, apikey, isUser } = require('../middlewares/AuthJWT');
const routerProducts = Router();
const { body, validationResult } = require('express-validator');
const Boom = require('@hapi/boom');

routerProducts.post('/', 
    body('name').not().isEmpty().trim().isAlphanumeric(),
    body('value').not().isEmpty().trim().isNumeric(),
    body('type').not().isEmpty().trim().isAlphanumeric(),
    body('rating').not().isEmpty().trim().isNumeric(),
    verifyToken, apikey, isUser, async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            throw Boom.unauthorized(`The field ${errors.errors[0].param} is ${errors.errors[0].msg} `);
        }
        const response = await ClassProducts.create(req.user, req.body);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

routerProducts.get('/', verifyToken, apikey, isUser, async(req, res, next) => {
    try {
        const response = await ClassProducts.getAll(req.user);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

routerProducts.get('/:id', verifyToken, apikey, isUser, async(req, res, next) => {
    try {
        const response = await ClassProducts.getById(req.user, req.params.id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});


module.exports = {routerProducts};