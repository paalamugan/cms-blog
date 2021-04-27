"use strict";

require('dotenv').config();

const path  = require('path');

// Root path of the server
global.rootPath = path.resolve(__dirname);

const express = require('express');
const passport = require('passport');

// Load configuration
const config = require('./config');

// Custom template settings
require('lodash').templateSettings = {
    interpolate: /\{\{=(.+?)\}\}/g,
    evaluate: /\{\{(.+?)\}\}/g,
};

// Express server
const app = express();
app.config = config;

// Database connection
require('./database');

// Load Passport authentication
require('./passport')(passport);

// express settings
require('./express')(app, express, passport);

// Handle "unhandledRejection"
process.on('unhandledRejection', error => {});

// Set up our uncaught exception handler
process.on('uncaughtException', function(err) {
    console.error('UncaughtException: ' + (new Date).toUTCString());
    console.error(err.stack);
    setTimeout(function() {
        // cleanup and exit...
        process.exit(1);
    }, 1000);
});

app.listen(app.get('port'), () => {
    console.log(`Server listening on port ${app.get('port')} in ${app.get('env')} mode`);
})

module.exports = app;