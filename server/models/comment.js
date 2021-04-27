'use strict'

const mongoose           = require('mongoose');
const Schema             = mongoose.Schema;
const CreateUpdatedAt    = require('mongoose-timestamp');
const { COMMENT_STATUS, sanitizeHtml } = require('../common');

var CommentSchema = new Schema({

    message: {
        type: String,
        required: true
    },

    status: {
        type: String,
        "enum": [
            COMMENT_STATUS.PENDING,
            COMMENT_STATUS.APPROVED,
            COMMENT_STATUS.DECLINED
        ],
        "default": COMMENT_STATUS.PENDING
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
    }

});

CommentSchema.plugin(CreateUpdatedAt);

CommentSchema.pre('validate', function (next) {

    this.message = sanitizeHtml(this.message);

    next();
});

CommentSchema.statics.get = function(id, cb) {
    this.findById(id).exec(cb);
}

CommentSchema.statics.list = function(options, cb) {
    options = options || {};

    this.find(options)
        .sort({
            status: -1,
            createdAt: -1
        })
        .populate('postId', 'title')
        .populate('userId', 'username')
        .exec(cb);
};

module.exports = mongoose.model('Comment', CommentSchema);
