const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

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
        if(!accountFound) throw Boom.notFound(`Password or email invalid`);
        
        const matchPassword = await User.comparePassword(password, accountFound.password);
        if(!matchPassword) throw Boom.badData(`Password or email invalid`);

        const token = jwt.sign({id: accountFound._id}, config.SECRET, { 
            expiresIn: 86400 
        })  
        
        accountFound.password = undefined;
        let response = accountFound;
        response.token = token
        await User.findOneAndUpdate({email:response.email}, {token: token});
        return {
            status: 200,
            message: "Welcome",
            response
        };
    }

    static async signUp(data) {
        let accountFound = await User.findOne({ email: data.email });
        if(accountFound) throw Boom.notFound(`Email already exist`);
            
        let newUser = new User({ 
            ...data,
            password : await User.encryptPassword(data.password),
        }); 
        
        await newUser.save();
        newUser.password = undefined;
        return {
            status: 200,
            message: "User registered",
            newUser
        };
    }
}
module.exports = { ClassAuth }
