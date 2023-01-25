const jwt = require('jsonwebtoken'),
    config = require('../config'),
    User = require('../models/User');

const Boom = require('@hapi/boom');
    

class ClassAuth {

    /**
     * Recibe los parametros por body y se hace la validación para el ingreso.
     * Si los datos ingresados son validos, se genera un token que se le asocia al usuario para la correcta navegación por la app.
     * El token tiene un tiempo limite de expiración de un día, despues de ese tiempo se debe volver a ingresar para obtener un nuevo token.
     * @param {string} email
     * @param {string} password
     * @returns 
     */
    static async login(email, password) {
        let accountFound = await User.findOne({ email });
        if(!accountFound) throw Boom.notFound(`La cuenta ingresada no existe`);
        console.log(accountFound.status)
        if(accountFound.status !== 'active') throw Boom.notFound(`La cuenta ingresada no se encuentra activa`);
        
        const matchPassword = await User.comparePassword(password, accountFound.password);
        if(!matchPassword) throw Boom.badData(`Password invalido`);

        const token = jwt.sign({id: accountFound._id}, config.SECRET, { 
            expiresIn: 86400 
        })  
        
        accountFound.password = undefined;
        let response = accountFound;
        response.token = token
        await User.findOneAndUpdate({email:response.email}, {token: token})
        return response;
    }
}
module.exports = ClassAuth
