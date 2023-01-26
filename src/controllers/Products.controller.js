const Products = require('../models/Products');
const Users = require('../models/User');
const Boom = require('@hapi/boom');
const moment = require('moment');

class ClassProducts {

    static async create(user, data){
        let newProduct = new Products({
            ...data,
            id_user: user._id
        });
        await newProduct.save();
        return { message: 'Product added', status: 200, newProduct };
        
    };

    static async getAll(user){
        let products = await Products.aggregate([
            {
                $match: { id_user: user._id}
            },
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
            { $unwind: "$user" },
            {
                $project: { id_user: 0, updatedAt: 0 }
            }
        ]);

        if(products.length === 0) throw Boom.notFound(`There aren't products`);
        return products;
    };
    
    static async getById(user, id){
        // let product = await Products.findById(id);
        let products = await Products.aggregate([
        //     {
        //         $match: {
        //           $expr: {
        //             $eq: [
        //               {
        //                 $toObjectId: "$id_user"
        //               },
        //               "$$user"
        //             ]
        //           }
        //         }
        //     },
            {
                $match: { id_user: user._id}
            },
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
            { $unwind: "$user" },
            {
                $project: { id_user: 0, updatedAt: 0 }
            }
        ]);

        if(products) return { status: 200, products };
        throw Boom.notFound(`There isn't product with that ID: ${id}`);
    };
};

module.exports = {ClassProducts};