const { Schema, model } = require('mongoose');

const OperationSchema = new Schema(
    {
        date: { type: String, required: true, trim: true },
        coin: { type: String, required: true, trim: true },
        type: { type: String, required: true, trim: true },
        porcentaje: { type: Number, required: true, trim: true },
        status: { type: Boolean, required: true, trim: true, default: true },
    },
    {
        timestamps: true,
        versionKey: false, 
    }
);


module.exports = model("Operations", OperationSchema);