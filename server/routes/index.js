const ApiRouter = require("./api");
const AuthRouter = require("./auth");

const { isAuthenticated } = require('../auth');

module.exports = (app) => {

    // Health check
    app.get('/api/health', (req, res, next) => {
        res.status(200).send('OK');
    });

    app.use('/auth', AuthRouter);
    app.use('/api', isAuthenticated, ApiRouter); // Protected routes
}