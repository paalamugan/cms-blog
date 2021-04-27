'use strict'

const mongoose           = require('mongoose');
const Schema             = mongoose.Schema;
const CreateUpdatedAt    = require('mongoose-timestamp');
const { sanitizeHtml } = require('../common');

var ReplaySchema = new Schema({

    message: {
        type: String,
        required: true
    },

    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'User'
    },

    postId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'Post'
    },

    commentId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Comment'
    }
    
});

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
