const passport = require('passport');
const authModule = require('./auth-module');
const admin = require('./admin');
const { User } = require('../models');
const { COOKIE_TOKEN_NAME } = require('../common');

exports.authModule = authModule;
exports.admin = admin;

exports.isAuthenticated = (req, res, next) => {

    // To avoid calling of multiple times.
    if (req.alreadyAuthorized) {
        return next();
    } else {
        req.alreadyAuthorized = true;
    }

    let authorization = req.headers.authorization;

    if (authorization) {
        return authModule.authenticateJwt(req, res, next);
    }

    if (!req.isAuthenticated() || !req.user) {
        let error = new Error("Unauthorized");
        error.status = 401;
        return next(error);
    }

    return next();
    // authModule.getUser(req.user._id, (err) => {

    //     if (err) {
    //         return next(err);
    //     }

    //     return next();
    // });

}

exports.authenticateUser = (username, password, callback) => {

    let adminUser = admin.getAdminUser();
    
    if (admin.isAdminUser(username)) {

        if (adminUser.password !== password) {
            return callback(new Error("admin password is incorrect"));
        }

        return callback(null, adminUser);
    }

    User.authenticate(username, password, callback);
    
}

exports.authenticateRole = (role) => {
    
    return (req, res, next) => {
        if (req.user.role !== role) {
            let error = new Error("Only Admin can add, edit and delete operations!");
            error.status = 403;
            return next(error);
        }

        next();
    }
}

// GET /auth/logout
exports.logout = (req, res) => {
    authModule.logout(req, res);
    req.logout();

    // Remove auth_token and expireIn information from cookies
    res.clearCookie(COOKIE_TOKEN_NAME);
    res.clearCookie(`${COOKIE_TOKEN_NAME}_expiresIn`);
    res.redirect(req.query.redirect || '/');

}

exports.logoutWithoutRedirect = (req, res) => {
    authModule.logout(req, res);
    req.logout();
}

exports.passportOAuthCallback = (type) => {

    return (req, accessToken, refreshToken, profile, done) => {

        let property = type + 'Id'; 

        // google OAuth profile response
        // {
        //     id: '1144767226546136',
        //     displayName: 'paal mugan',
        //     name: { familyName: 'mugan', givenName: 'paal' },
        //     photos: [
        //       {
        //         value: 'https://lh3.googleusercontent.com/a-/AOh14GhkZYRhdUD1tFqWAT6qb6GU9gU--OBv68WlTH8u=s96-c'
        //       }
        //     ],
        //     provider: 'google',
        //     _raw: '{\n' +
        //       '  "sub": "1144767226546136",\n' +
        //       '  "name": "paal mugan",\n' +
        //       '  "given_name": "paal",\n' +
        //       '  "family_name": "mugan",\n' +
        //       '  "picture": "https://lh3.googleusercontent.com/a-/AOh14GhkZYRhdUD1tFqWAT6qb6GU9gU--OBv68WlTH8u\\u003ds96-c",\n' +
        //       '  "locale": "en"\n' +
        //       '}',
        //     _json: {
        //       sub: '1144767226546136',
        //       name: 'paal mugan',
        //       given_name: 'paal',
        //       family_name: 'mugan'
        //       picture: 'https://lh3.googleusercontent.com/a-/AOh14GhkZYRhdUD1tFqWAT6qb6GU9gU--OBv68WlTH8u=s96-c'
        //       locale: 'en'
        //     }
        // }

        // facebook OAuth profile response
        // {
        //     id: '17881803320',
        //     username: undefined,
        //     displayName: 'Paalan',
        //     name: {
        //       familyName: undefined,
        //       givenName: undefined,
        //       middleName: undefined
        //     },
        //     gender: undefined,
        //     profileUrl: undefined,
        //     provider: 'facebook',
        //     _raw: '{"name":"Paalan","id":"17881803320"}',
        //     _json: { name: 'Paalan', id: '17881803320' }
        // }
          
        User.findOne({ [property]: profile.id }, (err, user) => {

            if (err) return done(err);

            let obj = {
                username: profile.displayName,
                provider: type
            }

            obj.avatarUrl = (type === "google") ? profile.photos[0].value : 
                            (type === "facebook") ? profile.profileUrl : '';
            
            if (user) {

                if(!user[property]) {
                    
                    user.username = obj.username;
                    user.provider = obj.type;
                    user.avatarUrl = obj.avatarUrl;

                    user[property] = profile.id;
                    user.save(done);
                }

                return done(null, user);

            }


            let newUser = new User(obj);
            newUser[property] = profile.id;

            newUser.save(done);
        });
            
    }
}