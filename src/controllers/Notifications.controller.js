const Notifications = require('../models/Notifications');
const Boom = require('@hapi/boom');
const fs = require('fs');
const moment = require('moment');


class ClassNotification {

    static async getAll(user){

            let notifi = await Notifications.aggregate(
                [
                    { 
                        $lookup: {
                            from: "users",
                            localField: "id_user",
                            foreignField: "_id",
                            as: "user"
                        }
                    },
                ]
            );
            if(notifi.length === 0) throw Boom.notFound(`No hay noticaciones`);


            return notifi;
            
    };
    
};

module.exports = ClassNotification;