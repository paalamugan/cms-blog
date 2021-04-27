const { isFacebookOAuth, isGoogleOAuth } = require('../config');
const { authModule } = require('../auth');

module.exports = (passport) => {
    
    // serialize sessions
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        authModule.getUser(id, (err, user) => {

            if (err) {
                err = new Error('Unauthorized!');
                // console.log('Unauthorized: ', id);
                err.status = 401;
                return done(err);
            }

            if (!user) {
                err = new Error('No user with id "' + id + '" found!');
                // console.log('No User found: ', id);
                err.status = 401;
                return done(err);
            }

            done(err, user);
        });

    });

    require("./passport-jwt")(passport);
    require("./passport-local")(passport);
    isFacebookOAuth && require("./passport-facebook")(passport);
    isGoogleOAuth && require("./passport-google")(passport);
    
}