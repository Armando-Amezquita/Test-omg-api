const { Router } = require('express');
const express = require('express');

const { verifyToken, apikey, isUser } = require('../middlewares/AuthJWT');
const ClassUsers = require('../controllers/Users.controller');
const ClassNotification = require('../controllers/Notifications.controller');
const router = Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req,file,cb) {
        cb("",req.body.identification_number + '_' + Date.now() + '_' + file.originalname);
    }
});

let upload = multer({
    storage
});

router.use('/documents', express.static('./uploads/documentos'))

router.post('/', upload.single('document_file'), async (req, res, next) => {
    try {
        const response = await ClassUsers.create(req.user, req.body, req.file);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.get('/', verifyToken, apikey, isUser, async (req, res, next) =>{
    try {
        const response = await ClassUsers.getAll(req.user);
        res.status(200).json(response);
    } catch (error) {
        res.status(403);
        next(error);
    }
});

router.get('/notifications', verifyToken, apikey, isUser, async(req, res, next) => {
    try {
        const response = await ClassNotification.getAll(req.user);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', verifyToken, apikey, isUser, async(req, res, next) => {
    try {
        const response = await ClassUsers.getById(req.user, req.params.id);
        if(response === undefined)
            throw new Error('Error');

        if(Object.keys(response).length === 0)
            throw new Error('No se encontro un usuario con ese ID');
        
        return res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', verifyToken, apikey, isUser, async(req, res, next) => {
    try {
        const response = await ClassUsers.update(req.params.id, req.body, req.user);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});
router.delete('/:id', verifyToken, apikey, isUser, async(req, res, next) => {
    try {
        const response = await ClassUsers.delete(req.params.id, req.user);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

module.exports = router;