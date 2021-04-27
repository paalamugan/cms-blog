const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { jwtSecretKey } = require('../config');
const { authModule } = require("../auth");
const { getSessionUser } = require("../common");

const options = {
    secretOrKey: jwtSecretKey,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

module.exports = (passport) => {

    passport.use(new JwtStrategy(options, function(payload, done) {

        authModule.getUser(payload.sub, function(err, user) {

            if (err) {
                return done(err, false);
            }

            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }

        });

    }));
}
