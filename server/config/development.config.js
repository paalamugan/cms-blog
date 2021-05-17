"use strict";

module.exports = function (ROOT_PATH) {

    const config = {
        domain: `http://localhost:${process.env.PORT || 8000}`,
        root: ROOT_PATH,
        env: process.env.NODE_ENV || "development",
        port: process.env.PORT || 8000,
        mongodb: {
            url: process.env.MONGODB_URI || "mongodb://localhost/cms-blog",
        },
        cookieSecretKey: process.env.COOKIE_SECRET_KEY || "mycookiesecret",
        sessionSecretKey: process.env.SESSION_SECRET_KEY || "mysessionsecret",
        jwtSecretKey: process.env.JWT_SECRET_KEY || "myjwtsecret"
    }

    return config;
}