const Transactions = require('../models/Transactions');
const Users = require('../models/User');
const Operations = require('../models/Operations');
const Notifications = require('../models/Notifications');
const Boom = require('@hapi/boom');
const fs = require('fs');
const moment = require('moment');


class ClassTransaction {

    static async notify(title,description,id_user,role){
        let data = {
            title: title,
            description: description,
            id_user: id_user,
            statusAmd: role === 'admin' ? false : true,
            statusUser: role === 'cliente' ? false : true,
            date: moment(new Date()).format()
        }
        
        let newNotifications = new Notifications(data);
        await newNotifications.save();
        
        if(role === 'admin'){
            let userCliente = await Users.findByIdAndUpdate(id_user, {
                notification : true, 
            }, { new: true})
            
        }else if(role === 'cliente'){
            let alladmin = await Users.find({
                "role": { $eq: 'admin'}, 
            });
            
            alladmin.map(async adm => {
                let userAdmin = await Users.findByIdAndUpdate(adm._id, {
                    notification : true, 
                }, { new: true})
            })
        }

    };

    static async create(user, data, file){
        if(file){
            fs.rename(`./uploads/${file.filename}`, `./uploads/comprobante/${data.id_user}_${file.filename}`, function(err) {
                if ( err ) console.log('ERROR: ' + err);
            });
            data.comprobante = `${data.id_user}_${file.filename}`;
        }
        let newTransaction;
        newTransaction = new Transactions(data);
        await newTransaction.save();

        await ClassTransaction.notify(`Solicitud de ${data.type_transactions}`,'Se creo un nueva solicitud',data.id_user, user.role)
        return { message: 'Se creo con exito el transaction', status: 200 };
    };

    static async loadbyUser(traID, data, user){

        if(data.completed){

            let transaccion = await Transactions.find({ 
                "status": { $eq: 'approved'}, 
                "completed": { $eq: false}, 
                "type_transactions": { $eq: 'deposito'}, 
                "moneda_transactions": { $eq: 'USDT'},
                "_id": { $eq : traID}
            });
    
            let operation = await Operations.find();
            operation = operation.filter(it => {
                let check = moment(it.date).format('MMMM');
                let checkToday = moment(new Date).format('MMMM');
                if(check === checkToday) return it
            })
    
            function sum(array, key) {
                return (array.reduce((a, b) => a + (b[key] || 0), 0))
            }
    
            transaccion.map(async item => {
                let userselect = await Users.findById(item.id_user);
    
                operation = operation.filter(it => {
                   if(moment(it.date) > moment(userselect.operation_date)) return it
                })
    
                let newwalletVal = userselect.wallet + item.valor;
                let porcentaje = (sum(operation, 'porcentaje')).toFixed(2);
                let rendimiento = (userselect.wallet * sum(operation, 'porcentaje')/100).toFixed(1);
                let newBackWin = Number(userselect.backup_win) + Number(rendimiento);
                let operation_date = moment(new Date()).format();
    
                //console.log(newwalletVal)
                //console.log(rendimiento)
                //console.log(newBackWin)

                let userWallet = await Users.findByIdAndUpdate(item.id_user, {
                    wallet : newwalletVal, 
                    operation_date: operation_date,  
                    backup_win: newBackWin, 
                    backup_porcentaje: porcentaje, 
                }, { new: true})
                let updateTrans = await Transactions.findByIdAndUpdate(item._id, {'completed': true}, { new: true});

                // notificacion
                await ClassTransaction.notify('Deposito aprobado',`Se cargo el deposito por $${item.valor} a su capital`,item.id_user,user.role)


            })
            return { message: 'Se actualizarón los saldos con exito', status: 200 };
        }
    };

    static async load(user){

        let transaccion = await Transactions.find({ 
            "status": { $eq: 'approved'}, 
            "completed": { $eq: false}, 
            "type_transactions": { $eq: 'deposito'}, 
            "moneda_transactions": { $eq: 'USDT'}
        });
        let operation = await Operations.find();
        operation = operation.filter(it => {
            let check = moment(it.date).format('MMMM');
            let checkToday = moment(new Date).format('MMMM');
            if(check === checkToday) return it
        })

        function sum(array, key) {
            return (array.reduce((a, b) => a + (b[key] || 0), 0))
        }

        transaccion.map(async item => {
            let userselect = await Users.findById(item.id_user);

            operation = operation.filter(it => {
               if(moment(it.date) > moment(userselect.operation_date)) return it
            })

            let newwalletVal = userselect.wallet + item.valor;
            let rendimiento = (userselect.wallet * sum(operation, 'porcentaje')/100).toFixed(0);
            let porcentaje = (sum(operation, 'porcentaje')).toFixed(2);
            let newBackWin = Number(userselect.backup_win) + Number(rendimiento);
            let operation_date = moment(new Date()).format();
            //console.log(operation)
            //console.log(rendimiento)
            //console.log(newBackWin)

            let userWallet = await Users.findByIdAndUpdate(item.id_user, {
                wallet : newwalletVal, 
                operation_date: operation_date,  
                backup_win: newBackWin, 
                backup_porcentaje: porcentaje, 
            }, { new: true})

            let updateTrans = await Transactions.findByIdAndUpdate(item._id, {'completed': true}, { new: true});

            // notificacion
            await ClassTransaction.notify('Deposito aprobado',`Se cargo el deposito por $${item.valor} a su capital`,item.id_user,user.role)
        })
        return { message: 'Se actualizarón los saldos con exito', status: 200 };
    };
    
    static async loadLiquidation(user){

        let alluser = await Users.find({
            "status": { $eq: 'active'}, 
        });

        function sum(array, key) {
            return (array.reduce((a, b) => a + (b[key] || 0), 0))
        }

        let operation = await Operations.find();
        operation = operation.filter(it => {
            let check = moment(it.date).format('MMMM');
            let checkToday = moment(new Date).format('MMMM');
            if(check === checkToday) return it
        })

        alluser.map( async userIt => {
            if(userIt.operation_date !== '' && userIt.wallet > 0){

                let op = operation.filter(it => {
                    if(moment(it.date) > moment(userIt.operation_date)) return it
                 })
                 let newBackWin = 0;
                 let porcentaje = 0;
                 let operation_date = moment(new Date()).format();
                 let rendimiento = (userIt.wallet * sum(op, 'porcentaje')/100).toFixed(0);

                 let newwalletVal = userIt.wallet + Number(userIt.backup_win) + Number(rendimiento);

                 let userWallet = await Users.findByIdAndUpdate(userIt._id, {
                    wallet : newwalletVal, 
                    operation_date: operation_date,  
                    backup_win: newBackWin, 
                    backup_porcentaje: porcentaje, 
                }, { new: true});

                if(userWallet){
                    let newTransaction;
                    newTransaction = new Transactions({
                        "date" : operation_date,
                        "valor" : (Number(userIt.backup_win) + Number(rendimiento)),
                        "type_transactions" : "deposito",
                        "metodo_transactions" : "plataforma",
                        "banco" : "N/A",
                        "id_user" : userIt._id,
                        "moneda_transactions" : "USDT",
                        "completed": true,
                        "status" : "approved"
                    });
                    await newTransaction.save();

                    // notificacion
                    await ClassTransaction.notify('Liquidación',`Se genero un deposito por $${(Number(userIt.backup_win) + Number(rendimiento))}`,userIt._id,user.role)
                }
            }
        })

        let userAdmin = await Users.findByIdAndUpdate('62f2967329fd4ba35d565da4', {
            wallet : 0, 
            operation_date: moment(new Date()).format(),  
            backup_win: 0, 
            backup_porcentaje: 0, 
        }, { new: true});

        return { message: 'Se liquido con exito', status: 200 };
    };

    static async getAll(user){
            let transaccion = await Transactions.aggregate(
                [
                    { 
                        $lookup: {
                            pipeline: [
                                {$project: {identification_number: 0, password: 0, createdAt: 0, updatedAt: 0, token: 0}},
                            ],
                            from: "users",
                            localField: "id_user",
                            foreignField: "_id",
                            as: "user"
                        }
                    },
                ]
            );
            if(transaccion.length === 0) throw Boom.notFound(`No hay transacciones`);
            return transaccion;
    };
    
    static async updateUSDT(id, data){
        let updateTran = await Transactions.findByIdAndUpdate(id, data, { new: true});
        if(updateTran){
            const response = { message: 'Se actualizó la transactions', status:200}
            return response;
        }
    };

    static async update(id, data, file, user){

        if(file){
            fs.rename(`./uploads/${file.filename}`, `./uploads/comprobante/${user._id}_${file.filename}`, function(err) {
                if ( err ) console.log('ERROR: ' + err);
            });
            data.comprobante = `${user._id}_${file.filename}`;
            let updateTran = await Transactions.findByIdAndUpdate(id, data, { new: true});
            if(updateTran){
                const response = { message: 'Se actualizó la transactions', status:200}
                return response;
            }
        }else{
            let updateTran = await Transactions.findById(id);
            const userId = await Users.findById(updateTran.id_user);

            if(data.status === 'rejected' && updateTran.type_transactions === 'deposito' && updateTran.moneda_transactions === 'USDT'){
                
                let updateTrans = await Transactions.findByIdAndUpdate(id, data, { new: true});
                if(updateTrans){           
                    // notificacion         
                    await ClassTransaction.notify('Deposito rechazado',`Se rechazo el deposito por $${updateTran.valor}`,updateTran.id_user,user.role)

                    const response = { message: 'Se actualizó la transactions', status:200}
                    return response;
                }else{
                    throw Boom.notFound(`No se encontro una transactions`); 
                }
            }else if(data.status === 'approved' && updateTran.type_transactions === 'deposito' && updateTran.moneda_transactions === 'USDT'){

                let updateTrans = await Transactions.findByIdAndUpdate(id, data, { new: true});
                if(updateTrans){           
                    // notificacion         
                    await ClassTransaction.notify('Deposito verificado',`Se confirmo el deposito por $${updateTran.valor}`,updateTran.id_user,user.role)

                    const response = { message: 'Se actualizó la transactions', status:200}
                    return response;
                }else{
                    throw Boom.notFound(`No se encontro una transactions`); 
                }
            }else if(data.status === 'approved' && Number(userId.wallet) > Number(updateTran.valor) && updateTran.type_transactions === 'retiro'){

                
                function sum(array, key) {
                    return (array.reduce((a, b) => a + (b[key] || 0), 0))
                }

                let operation = await Operations.find();
                let transaccion = await Transactions.findById(id);

                operation = operation.filter(it => moment(it.date) > moment(userId.operation_date))

                let newwalletVal = Number(userId.wallet) - Number(transaccion.valor)
                let rendimiento = (userId.wallet * sum(operation, 'porcentaje')/100).toFixed(1);
                let porcentaje = (sum(operation, 'porcentaje')).toFixed(2);

                let newBackWin = Number(userId.backup_win) + Number(rendimiento);
                let operation_date = moment(new Date()).format();

                //console.log(newwalletVal)
                //console.log(newBackWin)
                //console.log(operation_date)

                let userWallet = await Users.findByIdAndUpdate(transaccion.id_user, {
                    wallet : newwalletVal, 
                    operation_date: operation_date,  
                    backup_win: newBackWin, 
                    backup_porcentaje: porcentaje, 
                }, { new: true})

                if(userWallet){
                    data.completed = true;
                    let updateTrans = await Transactions.findByIdAndUpdate(transaccion._id, data, { new: true});
                    
                    if(updateTrans){
                        // notificacion         
                        await ClassTransaction.notify('Retiro aprobado',`Se aprobo el retiro por $${updateTran.valor}`,updateTran.id_user,user.role)

                        const response = { message: 'Se actualizó la transactions', status:200}
                        return response;
                    }else{
                        throw Boom.notFound(`No se encontro una transactions`); 
                    }
                }else{
                    throw Boom.notFound(`Error`); 
                }      
                          
            }else if(data.status === 'approved' && Number(userId.wallet) < Number(updateTran.valor) && updateTran.type_transactions === 'retiro'){
                return { message: 'Saldo insuficiente', status:200}
            }else if(data.status === 'approved' && updateTran.type_transactions === 'deposito' && updateTran.moneda_transactions === 'COP'){
                return { message: 'Error, deposito en COP', status:406}
            }else{
                return { message: 'Error, deposito en COP', status:406}
            }
        }

    };

    static async getById(user, id){
        //let transaccion = await Transactions.find({id_user: id});
        let transaccion = await Transactions.aggregate(
            [
                { $match: { $expr : { $eq: [ '$id_user' , { $toObjectId: id } ] } } },
                { 
                    $lookup: {
                        pipeline: [
                            {$project: {identification_number: 0, password: 0, createdAt: 0, updatedAt: 0, token: 0}},
                        ],
                        from: "users",
                        localField: "id_user",
                        foreignField: "_id",
                        as: "user"
                    }
                },
            ]
        );
        if(transaccion) return { status: 200, transaccion };
        throw Boom.notFound(`No se encontro una transacción`);
    };
};

module.exports = ClassTransaction;