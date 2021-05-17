"use strict";

const fs              = require('fs');
const path            = require('path');
const validator       = require('validator');
const { Readable }    = require('stream');
const jwt             = require('jsonwebtoken');
const crypto          = require('crypto');
const disposableEmailDomains = require('disposable-email-domains');
const createDOMPurify = require('dompurify');
const { JSDOM }       = require('jsdom');
const dompurify       = createDOMPurify(new JSDOM().window);

const { jwtSecretKey, getS3UploadStream } = require('../config');
const customDisposableEmailDomains = require('../common/custom-disposable-email-domains');

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
        email: user.email, 
        role: user.role,
        verified: user.verified,
        avatarUrl: user.avatarUrl // 'https://www.gravatar.com/avatar/1234578803?d=mm&r=pg&s=128'  
    }

    return obj;        
}

const bufferToStream = exports.bufferToStream = (buffer) => {
    return new Readable({
        read() {
            this.push(buffer);
            this.push(null);
        }
    });

}

exports.uploadImageToS3 = (options = {}, callback) => {

    let fileStream;
    let { file, bucketName = 'cms-blog-image', Key } = options;

    if (!file || (!file.buffer && !file.path)) {
        return callback();
    }

    Key = Key ? Key : 'uploads/' + ('10000' + parseInt(Math.random() * 10000000) + path.extname(file.originalname));

    if (file.buffer) {
        fileStream = bufferToStream(file.buffer);
    } else if (file.path) {
        fileStream = fs.createReadStream(file.path);
    }

    if (!fileStream) {
        return callback();
    }

    const s3Options = {
        Bucket: bucketName,
        Key: Key,
        ACL: 'public-read', // avaliable options private, public-read, public-read-write, authenticated-read, aws-exec-read, bucket-owner-read, bucket-owner-full-control, log-delivery-write
        ContentEncoding: 'gzip', // compress and zip it with minimum size
        ContentType: 'application/octet-stream', // force download if it's accessed as a top location
        ContentDisposition: "attachment", // forces the browser to download the uploaded file instead of trying to open it.
    }

    const uploadStream = getS3UploadStream(s3Options, callback);

    // Pipe the incoming filestream through compression, and upload to S3.
    fileStream.pipe(uploadStream);
}

exports.isValidEmail = function (email) {

    if (!validator.isEmail(email)) {
        throw new Error('Email is invalid!');
    }

    var domain = email.substring(email.lastIndexOf("@") + 1);
    domain = (domain || '').toLowerCase();

    var regex = /(traz)/gi; // Ignore domain if it has these string inside the domain.


    if (disposableEmailDomains.indexOf(domain) !== -1 ||
        customDisposableEmailDomains.indexOf(domain) !== -1 ||
        domain.match(regex)) {
        throw new Error('Invalid email! Please use your professional(company) email address');
    }

}