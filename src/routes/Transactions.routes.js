const { Router } = require('express');
const express = require('express');

const ClassTransaction = require('../controllers/Transactions.controller.js');
const { verifyToken, apikey, isUser } = require('../middlewares/AuthJWT');
const router = Router();
const Boom = require('@hapi/boom');
const { body, validationResult } = require('express-validator');
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

router.use('/mediafiles', express.static('./uploads/comprobante'))

router.post('/', verifyToken, apikey, isUser, upload.single('comprobante') , async(req, res, next) => {
    try {
        const response = await ClassTransaction.create(req.user, req.body, req.file);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.post('/load', verifyToken, apikey, isUser, async(req, res, next) => {
    try {
        const response = await ClassTransaction.load(req.user);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.post('/byuser/:id', verifyToken, apikey, isUser, async(req, res, next) => {
    try {
        const response = await ClassTransaction.loadbyUser(req.params.id, req.body,req.user);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.post('/liquidation', verifyToken, apikey, isUser, async(req, res, next) => {
    try {
        const response = await ClassTransaction.loadLiquidation();
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.get('/', verifyToken, apikey, isUser, async(req, res, next) => {
    try {
        const response = await ClassTransaction.getAll(req.user);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', verifyToken, apikey, isUser, async(req, res, next) => {
    try {
        const response = await ClassTransaction.getById(req.user, req.params.id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.put('/:id',verifyToken, apikey, isUser, upload.single('comprobante'), async(req, res, next) => {
    try {
        const response = await ClassTransaction.update(req.params.id, req.body, req.file, req.user);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.put('/usdt/:id', verifyToken, apikey, isUser, async(req, res, next) => {
    try {
        const response = await ClassTransaction.updateUSDT(req.params.id, req.body);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

module.exports = router;