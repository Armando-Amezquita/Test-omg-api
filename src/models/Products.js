const { Schema, model } = require('mongoose');

const ProductsSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        value: { type: Number, required: true, trim: true },
        type: { type: String, required: true, trim: true },
        rating: { type: Number, required: true, trim: true },
        id_user: { type: Schema.Types.ObjectId, required: true, trim: true },
    },
    {
        timestamps: true,
        versionKey: false, 
    }
);


module.exports = model("Products", ProductsSchema);