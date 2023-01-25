const { Schema, model } = require('mongoose');

const NotificationSchema = new Schema(
    {
        date: { type: String, required: true, trim: true },
        title: { type: String, required: true, trim: true }, // debito, retiro
        description: { type: String, required: true, trim: true }, // tranferencia o USDT wallet o ganacias del sistema
        id_user: { type: Schema.Types.ObjectId, ref: "Users", required: true, trim: true },
        statusAmd: { type: Boolean, required: true, trim: true, default: true },
        statusUser: { type: Boolean, required: true, trim: true, default: true },
    },
    {
        timestamps: true,
        versionKey: false, 
    }
);


module.exports = model("Notifications", NotificationSchema);