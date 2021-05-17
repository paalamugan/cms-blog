"use strict";

module.exports = {
    adminCredentials: {
        username: process.env.ADMIN_USERNAME || "admin",
        password: process.env.ADMIN_PASSWORD || "admin"
    },
    facebookAuth: {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    },
    googleAuth: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },
    awsS3: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    },
    recaptcha: {
        siteKey: process.env.RECAPTCHA_SITE_KEY,
        secretKey: process.env.RECAPTCHA_SECRET_KEY 
    },
    gmail: { // all emails are delivered to destination by gmail service (development)
        service: "gmail",
        auth: {
            user: process.env.APP_EMAIL, //youremail@gmail.com
            pass: process.env.APP_EMAIL_PASSWORD // Password
        },
        tls: {
            rejectUnauthorized: false,
        }
    },
    mailtrap: { // all emails are catched by mailtrap.io (development)
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASSWORD
        }
    }
}