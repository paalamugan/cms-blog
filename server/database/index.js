"use strict";

const mongoose         = require("mongoose");
const bluebird         = require('bluebird');
const { mongodb }      = require('../config');

const connect = () => {
    const options = {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        promiseLibrary: bluebird,
        serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 10 seconds
        socketTimeoutMS: 45000 // Close sockets after 45 seconds of inactivity
    };
    
    mongoose.connect(mongodb.url, options)
    .then(() => {
        console.log('Database connection is successfully connected!');
    })
    .catch(err => {
        console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running. -> ' + err);
    });
}

connect();

// Reconnect when closed
mongoose.connection.on('disconnected', () => {
    connect();
});

module.exports = mongoose;