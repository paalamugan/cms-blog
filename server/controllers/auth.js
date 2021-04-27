const { generateJwtToken, getSessionUser } = require('../common');
const { logoutWithoutRedirect, authenticateUser } = require('../auth');

exports.login = (req, res, next) => {
    
    let username = req.body.username;
    let password = req.body.password;

    if (!username) {
        return next(new Error("Username is missing"));
    }

    if (!password) {
        return next(new Error("Password is missing"));
    }

    authenticateUser(username, password, (err, user) => {

        if (err) {
            return next(err);
        }

        if (user.save) {
            user.lastLogin = Date.now();
            user.save();
        }

        const auth_token = generateJwtToken(user);

        res.json({ user: getSessionUser(user), token: auth_token.token, expiresIn: auth_token.expiresIn });
    })

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