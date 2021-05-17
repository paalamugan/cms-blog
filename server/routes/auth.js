const express = require('express');
const Router = express.Router();
const { authModule } = require('../auth');
const { Auth } = require('../controllers');

Router

// Local login
    .post('/signup', Auth.register)
    .post('/login', Auth.login)
    .post('/forgot-password', Auth.forgotPassword)
    .post('/reset-password', Auth.resetPassword)
    .get('/logout', Auth.logout)
    .get("/verify/:token", Auth.accountVerify)
        
// OAuth login (google and facebook)
    .get('/google', authModule.authenticateGoogle)
    .get('/facebook', authModule.authenticateFacebook)
    .get('/google/callback', authModule.authenticateGoogleCallback, Auth.OAuthSuccess)
    .get('/facebook/callback', authModule.authenticateFacebookCallback, Auth.OAuthSuccess)
    .get('/google/unlink', Auth.OAuthUnlink('google'))
    .get('/facebook/unlink', Auth.OAuthUnlink('facebook'));


module.exports = Router;