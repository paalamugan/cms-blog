const path = require('path');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const errorHandler = require('errorhandler');
const helmet = require('helmet');
const multer = require('multer');
const cors = require('cors');
const compression = require('compression');
const customErrorHandler = require('./helper/customErrorHandler');

const buildPath = path.join(__dirname, '..', 'client', 'build');

module.exports = (app, express, passport) => {

    const { port, env } = app.config;

    app.set('env', env);
    app.set('port', port);
    app.enable('trust proxy'); // trust proxy
    app.disable('x-powered-by');
    
    // compress responses
    app.use(compression());

    // Express use middlewares
    app.use(cors());
    
    // Logging
    if (env === 'development') {
        app.use(morgan('dev',  {
            skip: function (req, res) {
                return req.path.indexOf('.') !== -1;
            }
        }));
    } else {
        // For production and staging
        app.use(morgan('[:date[iso]] :method :url :status :res[content-length] :response-time ms', {
            skip: function (req, res) {
                return req.path.indexOf('.') !== -1;
            },
            // stream: require('fs').createWriteStream(app.config.logging.apiAccessLog, {
            //     flags: 'a'
            // })
        }));
    };
    
    app.use(express.urlencoded({
        extended: true
    }));
    app.use(express.json());

    // Static files
    app.use(express.static(buildPath, {
        etag: true,
        maxAge: 12 * 60 * 60 * 1000, // use milliseconds for half day
        setHeaders: (res, path) => {
            if (path.indexOf('/assets/') !== -1) {
                res.set('Cache-Control', 'public, max-age=360000'); // Available options for public, private, no-cache, no-store, must-revalidate, proxy-revalidate, max-age=<seconds>, s-maxage=<seconds>
            }
        }
    }));

    app.use(multer({
        fileFilter: (req, file, cb) => {
            if (/^image\/(jpe?g|png|gif)$/i.test(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error("Invalid file type, only JPEG, PNG and GIF is allowed!"), false);
            }
        },
        limits: {
          fileSize: 52428800, // max file size (in bytes) 50 MB
          files: 1  // max number of file fields
        }
    }).single('image'));

    app.use(cookieParser(app.config.cookieSecretKey));
    app.use(session({
        secret: app.config.sessionSecretKey,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 30, // MONTH_IN_MILLISECONDS
        },
        store: MongoStore.create({
            mongoUrl: app.config.mongodb.url,
            ttl: 1 * 24 * 60 * 60 // 1 days
        })
    }));

    // use passport session
    app.use(passport.initialize());
    app.use(function(req, res, next) {

        let path = req.path;

        if ((req.method === 'GET') && (!(path.includes('/api/') || path.includes('/auth/')))) {
            return res.sendFile(`${buildPath}/index.html`); // Send to build react index.html file
        } else {
            passport.session()(req, res, next);  // Invoke passport session and its persistent login sessions
        }

    });

    // For production and staging, add security headers
    if (env !== 'development') {
        app.use(helmet.hsts({ maxAge: 31536000000 }));
        app.use(helmet.noSniff());
        app.use(helmet.ieNoOpen());
        app.use(helmet.frameguard('deny'));
        app.use(helmet.xssFilter());
    }
    
    app.get('/', (req, res) => {
        res.sendFile(path.join(buildPath, 'index.html'));
    });
    
    // Routes
    require('./routes')(app);

    app.use(customErrorHandler.logErrors);
    app.use(customErrorHandler.respondError);
    app.use(customErrorHandler.handleNotFound);

    if (env === 'development') {
        app.use(errorHandler({
            dumpExceptions: true,
            showStack: true
        }));
    };

}