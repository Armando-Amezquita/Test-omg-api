require('dotenv').config();

module.exports = {
    dev: process.env.NODE_ENV !== 'production',
    MONGO_DBA: process.env.MONGO_DBA,
    MONGO_DBA2: process.env.MONGO_DBA2,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    PORT: process.env.PORT || 3000,
    SECRET: process.env.SECRET,
    APIKEY: process.env.APIKEY
}