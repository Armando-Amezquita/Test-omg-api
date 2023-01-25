const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        lastname: { type: String, required: true, trim: true },
        type_identification_number: { type: String, required: true, trim: true },
        identification_number: { type: Number, required: true, trim: true, unique: true },
        email: { type: String, required: true, trim: true, unique: true },
        birthdate: { type: String, required: true, trim: true, unique: false },
        phone: { type: Number, required: true, trim: true },
        address: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true },
        password: { type: String, required: true, trim: true },
        role: { type: String, required: true, trim: true, default: 'seller' },
        wallet: { type: Number, trim: true, default: 0 },
        backup_win: { type: Number,required: true, trim: true, default: 0 },
        backup_porcentaje: { type: Number,required: true, trim: true, default: 0 },
        operation_date: { type: String, trim: true, default: '' },
        initial_date: { type: String, trim: true },
        token: { type: String, trim: true },
        document_file: { type: String, trim: true },
        status: { type: String, required: true, trim: true, default: "inactive" },
        notification: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        versionKey: false, 
    }
);

userSchema.statics.encryptPassword = async(password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}
userSchema.statics.comparePassword = async(password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword);
}
module.exports = model("Users", userSchema);