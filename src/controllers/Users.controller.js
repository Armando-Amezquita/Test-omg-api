const Users = require('../models/User');
const fs = require('fs');
const Boom = require('@hapi/boom');
const moment = require('moment');

class ClassUsers {

    static async create (user, data, file) {

        if(file){
            fs.rename(`./uploads/${file.filename}`, `./uploads/documentos/${data.identification_number}_${file.filename}`, function(err) {
                if ( err ) console.log('ERROR: ' + err);
            });
            data.document_file = `${data.identification_number}_${file.filename}`;
        }

        let newUser; 
        newUser = new Users( 
            { 
                name : data.name,
                lastname : data.lastname,
                type_identification_number : data.type_identification_number,
                identification_number : data.identification_number,
                email : data.email,
                birthdate : data.birthdate,
                phone : data.phone,
                address : data.address,
                city : data.city,
                state : data.state,
                country : data.country,
                password : await Users.encryptPassword(data.password) ,
                role : "cliente",
                wallet : 0,
                document_file : data.document_file,
                initial_date: moment().format(),
            }
         );  


        const savedUser = await newUser.save();
        return {
            statusCode: 200,
            message: "Creado con exito"
        };
    };
    static async renderUser(data){
        const user =  {
            _id: data._id,
            name: data.name,
            identification_number: data.identification_number,
            nickname: data.nickname,
            address: data.address,
            attach: data.attach,
            email: data.email,
            city: data.city,
            country: data.country,
            phone: data.phone,
            role: data.role,
            wallet: data.wallet,
            count: data.count,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            status: data.status,
            location: data.location,
        }
        return user;
    }
    static async getAll (user) {
        const users = await Users.find();
        return users;    
    }
    static async getById (user, id) {
        const userId = await Users.findById(id);
        return userId
    };
    static async update(id, data, user) {
        if(data.wallet || data.password || data.role){
            throw Boom.methodNotAllowed(`No se puede actualizar este campo`)
        }
        let updateUser = await Users.findByIdAndUpdate(id, data, { new: true});
        if(updateUser){
            const response = { message: 'Se actualizó el usuario', status:200 }
            return response;
        }
        else{
            throw Boom.notFound(`No se encontro un usuario con el ID: ${id}`); 
        }
    }
    static async delete(id, user) {

        let updateUser = await Users.deleteOne( {"_id": id});
        if(updateUser){
            const response = { message: 'Se elimino el usuario', status:200 }
            return response;
        }
        else{
            throw Boom.notFound(`No se encontro un usuario con el ID: ${id}`); 
        }
    }
    static async getByToken(token){
        let user = await Users.findOne({ token: token });
        if(!user) {
            throw Boom.notFound('Error')
        }else{
            return user;
        }
    }
}

module.exports = ClassUsers;
