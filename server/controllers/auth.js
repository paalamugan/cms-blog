const _        = require('lodash');
const async    = require('async');
const {
    isValidEmail,
    generateHash, 
    ROLES 
} = require('../common');
const { 
    logoutWithoutRedirect, 
    authenticateUser,
    authenticateJwtToken, 
    authModule 
} = require('../auth');
const { User } = require('../models');
const recaptcha = require('../helper/recaptcha');
const email = require('../email');
const { isDev } = require('../config');

exports.register = (req, res, next) => {

    let body = req.body,
        username = body.username = _.capitalize(_.trim(body.username || '').toLowerCase()),
        currentEmail = body.email = _.trim(body.email || '').toLowerCase(),
        password = body.password,
        captcha = body.captcha;

    if (!username) {
        return next(new Error('Missing user name!'));
    }
    if (!currentEmail) {
        return next(new Error('Missing email!'));
    }
    if (!password) {
        return next(new Error('Missing password!'));
    }
    if (password.length < 6) {
        return next(new Error('Password must be at least 6 characters long.'));
    }
    if (!captcha) {
        return next(new Error('Missing ReCaptcha code. Please check \"I\'m not a robot\" checkbox!'));
    }

    try {
        isValidEmail(currentEmail);
    } catch (err) {
        return next(err);
    }

    // Logout before creating user
    authModule.logout(req, res);
    req.logout();

    async.waterfall([

        // Check recaptcha code
        function (callback) {
            recaptcha.validate(captcha, callback);
        },

        // Check whether user is already exists
        function (callback) {
            authModule.isUserExists(currentEmail, callback);
        },

        // Assign role of user
        function (callback) {
            req.body.role = ROLES.ADMIN;
            req.body.verified = isDev();
            req.body.verifyToken = generateHash(currentEmail);
            return callback(null);
        },

        function (callback) {
            authModule.createUser(req.body, callback);
        },

    ], function (err, result) {

        if (err) {
            return next(err);
        }

        let auth_token = authenticateJwtToken(result);

        if (isDev()) {
            return res.json(auth_token);
        }

        let data = {
            username: result.username,
            email: result.email,
            token: result.verifyToken
        }

        email.send('account-verify', { to: data.email }, data)
        .then(() => {
            res.json(auth_token);
        }).catch(next);
    })
}

exports.login = (req, res, next) => {
    
    let email = req.body.email;
    let password = req.body.password;

    if (!email) {
        return next(new Error("Email is missing"));
    }

    if (!password) {
        return next(new Error("Password is missing"));
    }

    authenticateUser(email, password, (err, user) => {

        if (err) {
            return next(err);
        }

        if (user.save) {
            user.lastLogin = Date.now();
            user.save();
        }

        let auth_token = authenticateJwtToken(user);

        res.json(auth_token);
    })

}

exports.forgotPassword = (req, res, next) => {

    if (!req.body.email) {
        return next(new Error('Email is missing!'));
    }

    req.body.email = _.trim(req.body.email || '').toLowerCase();

    authModule.forgotPassword(req, res, (err, user) => {

        if (err) {
            return next(err);
        }

        // Send email for forget password change
        let data = {
            email: user.email,
            username: user.username,
            token: user.resetPasswordToken
        };

        email.send('forgot-password', { to: data.email }, data)
        .then(() => {
            res.json({ success: true });
        }).catch(next);
    });
}

exports.resetPassword = (req, res, next) => {

    let currentEmail = req.body.email,
        password = req.body.password,
        passwordToken = req.body.passwordToken;

    if (!currentEmail) {
        return next(new Error("Email is missing"));
    }

    if (!password || password.length < 6) {
        return next(new Error('Password must be at least 6 characters.'));
    }

    if (!passwordToken) {
        return next(new Error('Password reset token is missing.'));
    }

    authModule.resetPassword(req, res, (err, user) => {

        if (err) {
            return next(err);
        }

        // Send email for password change
        let data = {
            username: user.username,
            email: user.email
        };

        email.send('reset-password', { to: data.email }, data)
        .then(() => {
            res.json({ success: true });
        }).catch(next);

    });
}

exports.accountVerify = (req, res, next) => {

    if (req.isAuthenticated && req.isAuthenticated())
        return res.redirect("/");

    User
    .findOne({ verifyToken: req.params.token })
    .exec((err, user) => {
        if (err)
            return next(err);

        if (!user) {
            return next(new Error("Verification token is invalid!"));
        }

        user.verified = true;
        user.verifyToken = undefined;
        user.lastLogin = Date.now();

        user.save((err, user) => {

            if (err) {
                return next(err);
            }

            let auth_token = authenticateJwtToken(user);
            res.json(auth_token);

        });
    });
}

exports.logout = (req, res, next) => {
    logoutWithoutRedirect(req, res);
    res.json({});
}

exports.OAuthSuccess = (req, res, next) => {
    req.logIn(req.user, (err) => {

        if (err) {
            return next(err);
        }

        res.redirect('/');
    });
}

exports.OAuthUnlink = (type) => {
    
    return (req, res, next) => {

        let user = req.user;

        if (!user) {
            return next(new Error(`Your not connected with ${type}!`));
        }

        user[type + 'Id'] = null;

        user.save((err) => {

            if (err) {
                return next(err);
            }
                
            res.redirect('/');
        })
    }
}