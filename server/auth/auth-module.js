const validator = require('validator');
const passport = require('passport');
const async = require('async');
const crypto = require('crypto');
const { User } = require('../models');
const { COOKIE_TOKEN_NAME, ROLES } = require('../common');
const { isAdminUser, getAdminUser } = require('./admin');
const recaptcha = require('../helper/recaptcha');

const isUserExists = exports.isUserExists = (email, callback) => {

    if (isAdminUser(email)) {
        return callback(new Error("Already admin has this name. So you cannot use this username!"));
    }

    let err = null;

    User.findOne({
        '$or': [{ email: email }, { username: email }]
    }, function(error, user) {

        err = error;

        if (user) {
            let message = (validator.isEmail(email) ? "User with email " : "Username ") + `"${email}" already exist."`;
            err = new Error(message);
        }

        return callback(err);
    });
}

exports.getUser = (id, callback) => {

    let adminUser = getAdminUser();

    if (adminUser._id === id) {
        return callback(null, adminUser);
    }

    User.get(id, callback);

}

exports.createUser = (data, callback) => {

    data = data || {};

    if (!data.username) {
        return callback(new Error("Username is missing!"));
    }

    if (!data.email) {
        return callback(new Error("Email is missing!"));
    }

    if (!data.password) {
        return callback(new Error("Password is missing!"));
    }

    data.lastLogin = Date.now();

    isUserExists(data.email, (err) => {

        if (err) {
            return callback(err);
        }


        User.create(data, callback);
    });
}

exports.forgotPassword = (req, res, cb) => {
    let email = req.body.email,
        captcha = req.body.captcha;

    if (!captcha) {
        return cb(new Error('Missing ReCaptcha code. Please check \"I\'m not a robot\" checkbox!'));
    }

    async.waterfall([
        // Check recaptcha code
        function(callback) {
            recaptcha.validate(captcha, callback);
        },

        function(callback) {
            User.findOne({ email: email }, function(err, user) {

                if (err || !user) {
                    return callback(new Error("User with email '" + email + "' does not exist."));
                }

                return callback(null, user);
            });
        },

        function(user, callback) {

            crypto.randomBytes(30, (err, buffer) => {

                if (err) {
                    return callback(new Error('Problem in password reset token. Try again.'));
                }

                let token = buffer.toString('hex');
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 86400000; // 24 hour

                user.save((err) => {
                    if (err) {
                        return callback(new Error('Problem in password reset token. Try again.'));
                    }

                    callback(err, user);
                });
            });
        }

    ], function(err, user) {
        cb(err, user);
    });
}

exports.resetPassword = (req, res, callback) => {

    let password = req.body.password,
        passwordToken = req.body.passwordToken;

    User.findOne({
        resetPasswordToken: passwordToken,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }, function(error, user) {

        if (error || !user) {
            return callback(new Error('Password reset token is invalid or has expired.'));
        }

        user.set('password', password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err, result) {

            if (err) {
                return callback(new Error('Couldn\'t save changes with new password.'));
            }

            callback(err, result);
        });
    });
}

exports.changePassword = (req, res, callback) => {

    let currentPassword = req.body.currentPassword;
    let newPassword = req.body.newPassword;

    User.changePassword(req.user._id, currentPassword, newPassword, callback);
}

exports.authenticateLocal = (req, res, next) => {

    passport.authenticate('local', (err, user, info) => {

        if (err) {
            return next(err);
        }

        if (!user) {
            return next(new Error('Invalid email or password.'));
        }

        return next(null, user);

    })(req, res, next);
}

exports.authenticateJwt = passport.authenticate('jwt', { session: false });
exports.authenticateGoogle = passport.authenticate('google', { scope: ['profile', 'email'] });
exports.authenticateFacebook = passport.authenticate('facebook', { scope: ['email'] });

const oAuthCallback = (type) => {
    return passport.authenticate(type, { failureRedirect: '/login' })
}

exports.authenticateGoogleCallback = oAuthCallback('google');
exports.authenticateFacebookCallback = oAuthCallback('facebook');

exports.logout = (req, res) => {

    let isCookieToken = !!(req.cookies[COOKIE_TOKEN_NAME]);
    if (isCookieToken) {
        res.clearCookie(COOKIE_TOKEN_NAME);
    }
}