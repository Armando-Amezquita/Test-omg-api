const { Schema, model } = require('mongoose');

const BalanceSchema = new Schema(
    {
        capital: { type: Number, required: true, trim: true },
        balance: { type: Number, required: true, trim: true },
        adiciones: { type: Number, required: true, trim: true },
        retiros: { type: Number, required: true, trim: true },
        rendimiento_aco_moneda: { type: Number, required: true, trim: true },
        rendimiento_aco_porcentaje: { type: String, required: true, trim: true },
        date: { type: String, required: true, trim: true },
        id_user: { type: Schema.Types.ObjectId, ref: "Users", required: true, trim: true },
        status: { type: String, required: true, trim: true, default: 'Pending' },
    },
    {
        timestamps: true,
        versionKey: false, 
    }
);


module.exports = model("Balances", BalanceSchema);