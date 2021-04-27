const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { googleAuth } = require('../config');
const { passportOAuthCallback } = require('../auth');

module.exports = (passport) => {

    passport.use(new GoogleStrategy({
        clientID: googleAuth.clientID,
        clientSecret: googleAuth.clientSecret,
        callbackURL: googleAuth.callbackURL,
        passReqToCallback: true
    }, passportOAuthCallback('google')));
}
