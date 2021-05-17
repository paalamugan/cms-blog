'use strict';

const LocalStrategy = require('passport-local').Strategy;
const { authenticateUser } = require("../auth")

module.exports = function(passport) {

    // use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {

            authenticateUser(email, password, function(err, user) {

                if (err) {
                    return done(null, false, {
                        message: err.message
                    });
                }

                if (!user) {
                    return done(null, false, {
                        message: 'Invalid email or password.'
                    });
                }

                return done(null, user);
            });
        }
    ));

}
