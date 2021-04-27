"use strict";

const jwt             = require('jsonwebtoken');
const crypto          = require('crypto');

const createDOMPurify = require('dompurify');
const { JSDOM }       = require('jsdom');
const dompurify       = createDOMPurify(new JSDOM().window);

const { jwtSecretKey } = require('../config');

exports.generateJwtToken = (user) => {

    if (!user) return user;

    const _id = user._id;

    const expiresIn = '1d';

    const payload = {
        sub: _id,
        iat: Date.now()
    }

    const token = jwt.sign(payload, jwtSecretKey, { expiresIn: expiresIn })

    return {
        token: token,
        expiresIn: expiresIn
    }
}

exports.generateHash = function(value) {
    return crypto.createHash("md5").update(value).digest("hex");
}

exports.sanitizeHtml = (html) => {
    return dompurify.sanitize(html);
}

exports.getSessionUser = (user = {}) => {

    let obj = {
        username: user.username, 
        role: user.role,
        avatarUrl: user.avatarUrl || `https://www.gravatar.com/avatar/${user.gravatarHash}?d=mm&r=pg&s=128`  
    }

    return obj;        
}
