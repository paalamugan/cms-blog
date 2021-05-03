const validator = require('validator');
const passport = require('passport');
const { User } = require('../models');
const { COOKIE_TOKEN_NAME, ROLES } = require('../common');
const { isAdminUser, getAdminUser } = require('./admin');

const isUserExists = exports.isUserExists = (username, callback) => {

    if (isAdminUser(username)) {
        return callback(new Error("Already admin has this name. So you cannot use this username!"));
    }

    let err = null;

    User.findOne({
        '$or': [{ username: username }, { email: username }]
    }, function(error, user) {

        err = error;

        if (user) {
            let message = (validator.isEmail(username) ? "User with email " : "Username ") + `"${username}" already exist."`;
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

exports.createUser = function(data, callback) {

    data = data || {};

    if (!data.username) {
        return callback(new Error("Username is missing!"));
    }

    if (!data.password) {
        return callback(new Error("Password is missing!"));
    }

    const username = data.username;

    const userObj = {
        username: username,
        password: data.password,
        role: data.role || ROLES.USER,
        lastLogin: Date.now()
    };

    if (data.email) {
        userObj.email = data.email;
    }

    isUserExists(username, (err) => {
        
        if (err) {
            return callback(err);
        }

        
        User.create(userObj, callback);
    });
}

exports.authenticateLocal = (req, res, next) => {

    passport.authenticate('local', (err, user, info) => {

        if (err) {
            return next(err);
        }

        if (!user) {
            return next(new Error('Invalid username or password.'));
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

// GET /auth/logout
exports.logout = (req, res) => {

    var isCookieToken = !!(req.cookies[COOKIE_TOKEN_NAME]);
    if (isCookieToken) {
        res.clearCookie(COOKIE_TOKEN_NAME);
    }
}