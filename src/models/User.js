const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        identification_number: { type: Number, required: true, trim: true, unique: true },
        email: { type: String, required: true, trim: true, unique: true },
        phone: { type: Number, required: true, trim: true },
        password: { type: String, required: true, trim: true },
        role: { type: String, required: true, trim: true, default: 'user' },
        token: { type: String, trim: true },
        status: { type: String, required: true, trim: true, default: "active" },
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