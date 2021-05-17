'use strict';

const https = require('https');
const config = require('../config');

const SECRET_KEY = config.recaptcha.secretKey;

// let  ERRORS = {
//     'request-error': 'Api request failed.',
//     'missing-input-secret': 'The secret parameter is missing.',
//     'invalid-input-secret': 'The secret parameter is invalid or malformed.',
//     'missing-input-response': 'The response parameter is missing.',
//     'invalid-input-response': 'The response parameter is invalid or malformed.'
//   };

// Helper function to make API call to recatpcha and check response
const verifyRecaptcha = (key, callback) => {

    https.get("https://www.google.com/recaptcha/api/siteverify?secret=" + SECRET_KEY + "&response=" + key, function(res) {

        let data = "";
        res.on('data', function (chunk) {
            data += chunk.toString();
        });
        res.on('end', function() {
            try {

                let parsedData = JSON.parse(data);

                if (parsedData.success) {
                    callback(null);
                } else {
                    // console.error(parsedData);
                    callback(new Error('Invalid Captcha! Please refresh the page and Try again!'));
                }

            } catch (e) {
                callback(e);
            }
        });
    });
}

exports.validate = (captcha, callback) => {
    verifyRecaptcha(captcha, callback);
};

