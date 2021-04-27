'use strict'

const _                = require('lodash');
const mongoose         = require('mongoose');
const Schema           = mongoose.Schema;
const slug             = require('mongoose-slug-updater');
const CreateUpdatedAt  = require('mongoose-timestamp');
const marked           = require('marked');
const { CATEGORIES, 
        VISIBILITY, 
        POST_STATUS,
        sanitizeHtml } = require(global.rootPath + '/common');

var PostSchema = new Schema({

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

    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    
    imageUrl: {
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

});

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

PostSchema.methods.isDraft = function() {
    return this.status === POST_STATUS.DRAFT;
}

PostSchema.statics.get = function(id, cb) {
    this.findById(id).exec(cb);
}

PostSchema.statics.findBySlug = function(slug, cb) {
    this.findOne({
        slug: slug
    }, cb);
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
