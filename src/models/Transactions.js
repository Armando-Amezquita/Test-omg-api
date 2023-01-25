const { Schema, model } = require('mongoose');

const TransactionSchema = new Schema(
    {
        date: { type: String, required: true, trim: true },
        valor: { type: Number, required: true, trim: true },
        type_transactions: { type: String, required: true, trim: true }, // debito, retiro
        metodo_transactions: { type: String, required: true, trim: true }, // tranferencia o USDT wallet o ganacias del sistema
        moneda_transactions: { type: String, required: true, trim: true }, // tranferencia o USDT wallet o ganacias del sistema
        banco: { type: String, required: true, trim: true },
        data: { type: Object, trim: true },
        comprobante: { type: String, trim: true, default: ''}, 
        id_user: { type: Schema.Types.ObjectId, ref: "Users", required: true, trim: true },
        status: { type: String, required: true, trim: true, default: 'pending' },
        completed: { type: Boolean, required: true, trim: true, default: false },
        network: { type: String, trim: true, default: '' },
    },
    {
        timestamps: true,
        versionKey: false, 
    }
);


module.exports = model("Transactions", TransactionSchema);