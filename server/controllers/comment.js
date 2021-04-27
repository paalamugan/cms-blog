const { Comment } = require('../models');

exports.list = (req, res, next) => {

    const options = {};

    Comment.list(options, (err, comments) => {

        if (err) {
            return next(err);
        }

        res.json(comments);
    });
}

exports.get = (req, res, next) => {

    const id = req.params.id;

    Comment.get(id, (err, comment) => {

        if (err) {
            return next(err);
        }

        res.json(comment);
    });

}

exports.create = (req, res, next) => {

    let body = req.body;
    body.userId = req.user._id;
    
    Comment.create(body, (err, comment) => {
        
        if (err) {
            return next(err);
        }

        res.json(comment);
    });

}

exports.update = (req, res, next) => {

    const id = req.params.id;
    const body = req.body;

    Comment.findByIdAndUpdate(id, { ...body }, { new: true }, (err, user) => {

        if (err) {
            return next(err);
        }

        res.json(user);
    });

}

exports.delete = (req, res, next) => {

    const id = req.params.id;

    Comment.findByIdAndDelete(id, (err) => {

        if (err) {
            return next(err)
        }

        res.json({});

    });
}