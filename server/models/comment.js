'use strict'

const mongoose           = require('mongoose');
const Schema             = mongoose.Schema;
const CreateUpdatedAt    = require('mongoose-timestamp');
const { COMMENT_STATUS, sanitizeHtml } = require('../common');

const schemaOptions = {
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true }, // So `toObject()` output includes virtuals,
    versionKey: false // hide __v property
}

const CommentSchema = new Schema({

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
    }

}, schemaOptions);

CommentSchema.plugin(CreateUpdatedAt);

CommentSchema.pre('validate', function(next) {

    this.message = sanitizeHtml(this.message);

    next();
});

CommentSchema.post('save', function(doc, next) {
    doc.populate('user', 'username avatarUrl -_id')
    .execPopulate()
    .then(function() {
        next();
    });
})

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
        .populate('post', 'title')
        .populate('user', 'username')
        .exec(cb);
};

CommentSchema.statics.getPostComments = function(post, cb) {
    this.find({ post: post, status: COMMENT_STATUS.APPROVED })
        .sort({
            createdAt: -1
        })
        .populate('user', 'username avatarUrl -_id')
        .select({ status: 0, post: 0 })
        .exec(cb);
}

module.exports = mongoose.model('Comment', CommentSchema);
