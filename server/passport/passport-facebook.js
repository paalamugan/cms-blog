const FacebookStrategy = require('passport-facebook').Strategy;
const { facebookAuth } = require('../config');
const { passportOAuthCallback } = require('../auth');

module.exports = (passport) => {

    passport.use(new FacebookStrategy({
        clientID: facebookAuth.clientID,
        clientSecret: facebookAuth.clientSecret,
        callbackURL: facebookAuth.callbackURL,
        passReqToCallback: true
    }, passportOAuthCallback('facebook')));
}
