"use strict";

const path = require("path");
const util = require("util");

const rootPath = path.normalize(__dirname + "/..");
const env = process.env.NODE_ENV || "development";
const defaultConfig = require('./default.config');
const envConfig = require(__dirname + util.format("/%s.config.js", env))(rootPath);

const config = { 
    ...defaultConfig, 
    ...envConfig 
};
config.env = env;

config.isDev = function () {
    return (this.env === "development");
}

config.isProd = function () {
    return (this.env === "production");
}

config.isAWS = function () {
    return !!this.awsS3.accessKeyId;
}

config.isFacebookOAuth = !!(config.facebookAuth.clientID && config.facebookAuth.clientSecret);
config.isGoogleOAuth = !!(config.googleAuth.clientID && config.googleAuth.clientSecret);

const getAuthCallbackApi = (type) => {
    let path = `/auth/${type}/callback`;
    let domain = config.domain;
    if (domain) {
        domain = config.isDev() ? `http://localhost:${config.port}` : `https://localhost:${config.port}`;
    }
    return  domain + path;
}

config.facebookAuth.callbackURL = getAuthCallbackApi('facebook');
config.googleAuth.callbackURL = getAuthCallbackApi('google');

// Validate configurations
if (!(config.port && 
      config.mongodb.url && 
      config.jwtSecretKey &&
      config.cookieSecretKey &&
      config.sessionSecretKey)) {
    console.error('Some configurations are missing. Please check and fix it!');
    process.exit(1);
}

module.exports = config;