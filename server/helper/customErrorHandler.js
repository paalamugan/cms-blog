'use strict';

const auth   = require('../auth');

exports.logErrors = function (err, req, res, next) {
    
    if ((err.status !== 404) && err.stack) {
        console.error(err.stack);
    }
    next(err);
}

exports.respondError = function (err, req, res, next) {

    var status = err.status || 400;
    res.status(status);

    var orgMsg = err && err.message; // For debug

    // When node request library failed to connect to the URL.
    if (err && (err.code === 'ECONNREFUSED' || err.name === 'MongoError')) {
        err.message  = 'Oops, something breaks in our end. Try again!';
    }

    var message = err.message || err.customMessage;
    if (!message) {
        if (status === 404) {
            message = 'Not found!';
        } else if (status === 401) {
            message = 'Unauthorized!';
        } else if (status === 403) {
            message = 'Not allowed!';
        } else {
            message = 'Oops, there was a problem!';
        }
    }

    var accepted = req.accepts(['html', 'json']);

    if (accepted === 'json') {
        
        if (status === 401) {
            // console.log('Logging out from page: ', req.originalUrl, req.user && req.user.username); // For debug
            // console.log('Error Message: ', orgMsg); // For debug
            auth.logoutWithoutRedirect(req, res);
        }

        res.json({
            message: message
        });

    } else if (accepted === 'html') {
        if (status === 401) {
            auth.logout(req, res);
        } else {
            res.json({
                message: message
            });
        }

    }  else {
        res.type('txt').send(message + '\n');
    }
}

exports.handleNotFound = function(req, res, next) {
    res.status(404);

    var accepted = req.accepts(['html', 'json']);

    if (accepted === 'html') {
        res.json({
            message: 'Page Not Found!'
        });

    } else if (accepted === 'json') {
        res.json({
            message: 'URL Not Found!'
        });

    } else {
        res.type('txt').send('Not found!');
    }
}

