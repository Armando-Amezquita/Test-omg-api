const Products = require('../models/Products');
const fs = require('fs');
const Boom = require('@hapi/boom');


class ClassProducts {

    static async create(user, data, file){
        if(file){
            fs.rename(`./uploads/${file.filename}`, `./uploads/${user._id}_${file.filename}`, function(err) {
                if ( err ) console.log('ERROR: ' + err);
            });
            data.url_image = `${user._id}_${file.filename}`;
        }

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

        for (const ele of products) {
            ele.createdAt = ele.createdAt.toLocaleDateString();
        }

        if(products.length === 0) throw Boom.notFound(`There aren't products`);
        return { message: 'Products', status: 200, products };
    };
    
    static async getById(id){
        let product = await Products.findById(id);

        if(product) return { status: 200, product };
        throw Boom.notFound(`There isn't product with that ID: ${id}`);
    };

    static async update( id, data ){
        let product = await Products.findByIdAndUpdate(id, data, { new: true });

        if(product) return { status: 200, product };
        throw Boom.notFound(`There isn't product with that ID: ${id}`);
    };
    
    static async delete( id ){
        let product = await Products.findByIdAndDelete(id);

        if(product) return { status: 200, product };
        throw Boom.notFound(`There isn't product with that ID: ${id}`);
    };
};

module.exports = {ClassProducts};