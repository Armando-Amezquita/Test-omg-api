const { Router } = require('express');
const { ClassProducts } = require('../controllers/Products.controller');
const { verifyToken, apikey, isUser } = require('../middlewares/AuthJWT');
const routerProducts = Router();
const { body, validationResult } = require('express-validator');
const Boom = require('@hapi/boom');
const express = require('express');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req,file,cb) {
        cb("",Date.now() + '_' + file.originalname);
    }
});

let upload = multer({
    storage
});

routerProducts.use('/mediafiles', express.static('./uploads/'))

routerProducts.post('/', 
    verifyToken, apikey, isUser, upload.single('image'), async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            throw Boom.unauthorized(`The field ${errors.errors[0].param} is ${errors.errors[0].msg} `);
        }
        const response = await ClassProducts.create(req.user, req.body, req.file);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

routerProducts.get('/', verifyToken, apikey, isUser,  async(req, res, next) => {
    try {
        const response = await ClassProducts.getAll(req.user);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

routerProducts.get('/:id', verifyToken, apikey, isUser, async(req, res, next) => {
    try {
        const response = await ClassProducts.getById(req.params.id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

routerProducts.put('/:id', verifyToken, apikey, isUser, async(req, res, next) => {
    try {
        const response = await ClassProducts.update(req.params.id, req.body);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

routerProducts.delete('/:id', verifyToken, apikey, isUser, async(req, res, next) => {
    try {
        const response = await ClassProducts.delete(req.params.id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});


module.exports = {routerProducts};