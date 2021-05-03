'use strict'

const _                = require('lodash');
const mongoose         = require('mongoose');
const Schema           = mongoose.Schema;
const slug             = require('mongoose-slug-updater');
const CreateUpdatedAt  = require('mongoose-timestamp');
const marked           = require('marked');
const { COMMENT_STATUS } = require('../common');
const { CATEGORIES, 
        VISIBILITY, 
        POST_STATUS,
        sanitizeHtml } = require(global.rootPath + '/common');

const schemaOptions = {
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true }, // So `toObject()` output includes virtuals,
    versionKey: false // hide __v property
}
    
const PostSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    
    description: {
        type: String
    },

    content: {
        type: String,
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    
    imageUrl: {
        type: String
    },

    defaultImageUrl: {
        type: String,
        default: "/assets/images/default-post.jpg"
    },

    isMarkdownContent: {
        type: Boolean,
        default: false
    },

    category: {
        type: String,
        enum: [
            CATEGORIES.GENERAL,
            CATEGORIES.DESIGN,
            CATEGORIES.UNCATEGORIZED
        ],
        default: CATEGORIES.GENERAL
    },
  
    visibility: {
        type: String,
        enum: [
            VISIBILITY.PUBLIC,
            VISIBILITY.PRIVATE
        ],
        default: VISIBILITY.PUBLIC
    },

    readability: {
        type: Boolean,
        default: true
    },

    tags: {
        type: [String]
    },

    status: {
        type: String,
        enum: [
            POST_STATUS.DRAFT,
            POST_STATUS.PUBLISH
        ],
        default: POST_STATUS.PUBLISH
    },

    slug: { 
        type: String, 
        slug: "title", 
        unique: true 
    }

}, schemaOptions);

PostSchema.plugin(slug);
PostSchema.plugin(CreateUpdatedAt);

PostSchema.pre('validate', function (next) {

    if (this.isMarkdownContent) {
        this.sanitizedHtml = sanitizeHtml(marked(this.content)); 
    } else {
        this.sanitizedHtml = sanitizeHtml(this.content);
    }

    next();
});

PostSchema.virtual('comments', {
    ref: 'Comment', // The model to use
    localField: '_id', // Find post where `localField`
    foreignField: 'post', // is equal to `foreignField`
    justOne: false,  // If `justOne` is true, 'comments' will be a single doc as opposed to an array. `justOne` is false by default.
    options: { sort: { createdAt: -1 } }, // Query options, see http://bit.ly/mongoose-query-options
    match: { status: COMMENT_STATUS.APPROVED },
    // count: true // And only get the number of docs
})

PostSchema.methods.isDraft = function() {
    return this.status === POST_STATUS.DRAFT;
}

PostSchema.statics.get = function(id, cb) {
    this.findById(id).exec(cb);
}

PostSchema.statics.findBySlug = function(slug, cb) {
    this.findOne({
        slug: slug
    })
    .populate({
        path: 'comments', 
        select: 'message user createdAt -post',
        populate: {
            path: 'user'
        } 
    })
    .exec(cb);
}

PostSchema.statics.list = function(options, cb) {
    options = options || {};

    this.find(options)
        .sort({
            'createdAt': -1
        })
        .exec(cb);
};

module.exports = mongoose.model('Post', PostSchema);
