'use strict'

const _                = require('lodash');
const mongoose         = require('mongoose');
const slug             = require('mongoose-slug-updater');
const CreateUpdatedAt  = require('mongoose-timestamp');
const bcrypt           = require('bcrypt');
const validator        = require('validator');
const { ROLES }        = require('../common');
const { getAdminUser } = require('../auth/admin');

var UserSchema = new mongoose.Schema({

    // firstName: String,
    // lastName: String,

    username: {
        type: String,
        // required: true,
        // index: { unique: true }
    },
    
    email: {
        type: String,
        lowercase: true,
        validator: (value) => {
            return validator.isEmail(value)
        }
    },

    salt: {
        type: String,
        // required: true
    },

    hash: {
        type: String,
        // required: true
    },

    role: {
        type: String,
        enum: [
            ROLES.ADMIN,
            ROLES.USER
        ],
        default: ROLES.USER
    },

    avatarUrl: {
        type: String,
        default: '/assets/images/avatar.png'
    },

    provider: {
        type: String,
        default: "jwt"
    },

    lastLogin: Date,
    gravatarHash: String,

    googleId: String,
    facebookId: String,

    // slug: { type: String, slug: ['firstName', 'lastName'], unique: true } 

}, { versionKey: false });

// UserSchema.plugin(slug);
UserSchema.plugin(CreateUpdatedAt);

UserSchema.virtual('password')
    .get(function() {
        return this._password;
    })
    .set(function(password) {
        this._password = password;
        var salt = this.salt = bcrypt.genSaltSync(10);
        this.hash = bcrypt.hashSync(password, salt);
    });

UserSchema.methods.verifyPassword = function(password, callback) {
    bcrypt.compare(password, this.get('hash'), callback);
}

UserSchema.statics.authenticate = function(username, password, callback) {

    this.findOne({
        username: username
    }, function(err, user) {
        if (err) {
            console.error('Authenticate - get user error:', err);
            return callback(err);
        }

        if (!user) {
            console.error('Username is not registered:', username);
            return callback(new Error('Username is not registered.'));
        }

        user.verifyPassword(password, function(err, passwordCorrect) {
            if (err) {
                console.error('Authenticate - verify password error:', err);
                return callback(err);
            }

            if (!passwordCorrect) {
                console.error('Invalid password:', username);
                return callback(new Error('Invalid username or password.'));
            }

            return callback(null, user);
        });
    });
}

UserSchema.statics.get = function(id, cb) {
    this.findById(id).exec(cb);
}

UserSchema.statics.list = function(options, cb) {
    options = options || {};

    this.find(options)
        .sort({
            'createdAt': -1
        })
        .select({ salt: 0, hash: 0, password: 0 })
        .exec(cb);
};

UserSchema.statics.changePassword = function(id, oldPassword, newPassword, callback) {

    this.findOne({
        _id: id
    }, function(err, user) {

        if (err) {
            return callback(err);
        }

        if (!user) {
            return callback(new Error('No User'));
        }

        user.verifyPassword(oldPassword, function(err, passwordCorrect) {
            if (err) {
                return callback(err);
            }

            if (!passwordCorrect) {
                return callback(new Error('Password did not match the current password.'));
            }

            user.set('password', newPassword);

            user.save(function(error, user) {
                if (error) {
                    return cb(new Error('Error saving new password:' + error));
                }

                return callback(null, user);
            });
        });
    });
}

module.exports = mongoose.model('User', UserSchema);
