'use strict'

const mongoose           = require('mongoose');
const Schema             = mongoose.Schema;
const CreateUpdatedAt    = require('mongoose-timestamp');
const { sanitizeHtml } = require('../common');

const schemaOptions = {
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true }, // So `toObject()` output includes virtuals,
    versionKey: false // hide __v property
}

const ReplaySchema = new Schema({

    message: {
        type: String,
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'User'
    },

    post: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'Post'
    },

    comment: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Comment'
    }
    
}, schemaOptions);

ReplaySchema.plugin(CreateUpdatedAt);

ReplaySchema.pre('validate', function (next) {

    this.message = sanitizeHtml(this.message);

    next();
});

ReplaySchema.statics.get = function(id, cb) {
    this.findById(id).exec(cb);
}

ReplaySchema.statics.list = function(options, cb) {
    options = options || {};

    this.find(options)
        .sort({
            'createdAt': -1
        })
        .exec(cb);
};

module.exports = mongoose.model('Comment', ReplaySchema);
