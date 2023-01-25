const mongoose = require('mongoose');
const { MONGO_DBA, DB_USER, DB_PASSWORD } = require('./config');

/* mongoose.connect(`mongodb://localhost:27017/${MONGO_DBA}`)
    .then(db => console.log('Db connected to ', db.connection.name))
    .catch(err => console.error('Failed ', err)); */

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.dgatyjh.mongodb.net/${MONGO_DBA}?retryWrites=true&w=majority`)
    .then(db => console.log('Db connected to ', db.connection.name))
    .catch(err => console.error('Failed ', err));