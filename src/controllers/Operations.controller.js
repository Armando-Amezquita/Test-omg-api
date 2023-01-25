const Operations = require('../models/Operations');
const Transactions = require('../models/Transactions');
const Users = require('../models/User');
const Boom = require('@hapi/boom');
const moment = require('moment');

class ClassOperation {

    static async create(user, data){
        if(moment(data.date) > moment(new Date())){
            return { message: 'Error, la fecha es mayor a la actual', status: 200 };
        }else{
            let newOperation = new Operations(data);
            await newOperation.save();
            return { message: 'Se creo con exito el Operation', status: 200 };
        }
    };

    static async getAll(user){
            let operation = await Operations.find();
            if(operation.length === 0) throw Boom.notFound(`No hay operaciones`);
            return operation;
    };
    
    static async getAlltoday(id){
        let operation = await Operations.find();
        let transactions = await Transactions.find({id_user : id});
        let user = await Users.findById(id);

            /* transactions = transactions.filter(it => {
                let check = moment(it.date).format('MMMM');
                let checkToday = moment(new Date).format('MMMM');
                if(check === checkToday) return it
            }) */
            operation = operation.filter(it => {
                let check = moment(it.date).format('MMMM');
                let checkToday = moment(new Date).format('MMMM');
                if(check === checkToday) return it
            })
            if(operation.length === 0) return {operation, transactions, user};
            return {operation, transactions, user};
    };
    
    static async update(user, id, data){
        let updateItem = await Operations.findByIdAndUpdate(id, data, { new: true});
        if(updateItem){
            const response = { message: 'Se actualizó la operación', status:200}
            return response;
        }
    };

    static async getById(user, id){
        let operation = await Operations.findById(id);
        if(operation) return { status: 200, operation };
        throw Boom.notFound(`No se encontro una Operation con el ID: ${id}`);
    };
};

module.exports = ClassOperation;