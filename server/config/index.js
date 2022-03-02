"use strict";

const path = require("path");
const util = require("util");

const rootPath = path.normalize(__dirname + "/..");
const env = (process.env.NODE_ENV || "development").trim();
const defaultConfig = require('./default.config');
const envConfig = require(path.join(__dirname + util.format("/%s.config.js", env)))(rootPath);

const config = { 
    ...defaultConfig, 
    ...envConfig 
};
config.env = env;

config.isDev = function () {
    return (config.env === "development");
}

config.isProd = function () {
    return (config.env === "production");
}

config.isAWS = function () {
    return !!config.awsS3.accessKeyId;
}

if (config.isDev()) {
    config.smtp = (config.mailtrap.auth.user ? config.mailtrap :
                   config.gmail.auth.user ? config.gmail : null);
} else {
    config.smtp = (config.sendgrid.auth.user ? config.sendgrid :
                   config.gmail.auth.user ? config.gmail : null);
}

config.isFacebookOAuth = !!(config.facebookAuth.clientID && config.facebookAuth.clientSecret);
config.isGoogleOAuth = !!(config.googleAuth.clientID && config.googleAuth.clientSecret);

const getAuthCallbackApi = (type) => {
    let path = `/auth/${type}/callback`;
    return (config.domain + path);
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