const Balances = require('../models/Balances');
const Users = require('../models/User');
const Boom = require('@hapi/boom');

class ClassBalance {

    static async create(user, data){
        let newBalance;
        newBalance = new Balances({
            capital : 10530,
            balance :   11195,
            adiciones : 800,
            retiros : 250,
            rendimiento_aco_moneda : 645,
            rendimiento_aco_porcentaje : "6,29",
            date : "2022-08-09T06:48:12.548Z",
            id_user : "62f2032c5485bdcada68d6d1",
        });
        await newBalance.save();
        return { message: 'Se creo con exito el balance', status: 200 };
    };

    static async getAll(user){
            let balances = await Balances.find();
            if(balances.length === 0) throw Boom.notFound(`No hay balances`);
            return balances;
    };
    
    static async update(user, id, data){
        return
    };

    static async getById(user, id){
        let balance = await Balances.findById(id);
        if(balance) return { status: 200, balance };
        throw Boom.notFound(`No se encontro un balance con el ID: ${id}`);
    };
};

module.exports = ClassBalance;