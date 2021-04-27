const express = require('express');
const Router = express.Router();
const { authModule } = require('../auth');
const { Auth } = require('../controllers');

Router

// Local login
    .post('/login', Auth.login)
    .get('/logout', Auth.logout)

// OAuth login (google and facebook)
    .get('/google', authModule.authenticateGoogle)
    .get('/facebook', authModule.authenticateFacebook)
    .get('/google/callback', authModule.authenticateGoogleCallback, Auth.OAuthSuccess)
    .get('/facebook/callback', authModule.authenticateFacebookCallback, Auth.OAuthSuccess)
    .get('/google/unlink', Auth.OAuthUnlink('google'))
    .get('/facebook/unlink', Auth.OAuthUnlink('facebook'));


module.exports = Router;