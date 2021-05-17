const { Post, Comment } = require('../models');

exports.list = (req, res, next) => {

    const options = {
        user: req.user.ownedBy || req.user._id
    };

    Post.list(options, (err, posts) => {

        if (err) {
            return next(err);
        }
        res.json(posts);
    });
}

exports.get = (req, res, next) => {

    const id = req.params.id;

    Post.get(id, (err, post) => {

        if (err) {
            return next(err);
        }

        res.json(post);
    });

}

exports.slug = (req, res, next) => {

    const slug = req.params.slug;

    if (!slug) {
        return next(new Error("slug is missing"));
    }

    Post.findBySlug(slug, (err, post) => {

        if (err) {
            return next(err);
        }

        res.json(post);
    })
}

exports.create = (req, res, next) => {

    let body = req.body;
    body.user = req.user._id;
    
    Post.create(body, (err, post) => {
        
        if (err) {
            return next(err);
        }
        
        res.json(post);
    });

}

exports.update = (req, res, next) => {

    const id = req.params.id;
    const body = req.body;

    Post.findByIdAndUpdate(id, { ...body }, { new: true }, (err, user) => {

        if (err) {
            return next(err);
        }

        res.json(user);
    });

}

exports.delete = (req, res, next) => {

    const id = req.params.id;

    Post.findByIdAndDelete(id).exec()
    .then(() => {
        return Comment.deleteMany({ post: id }).exec();
    })
    .then(() => {
        return res.json({});
    })
    .catch((err) => {
        return next(err);
    });
}