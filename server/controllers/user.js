const { User, Comment, Post } = require('../models');
const { authModule } = require('../auth');

exports.list = (req, res, next) => {

    const options = {
        ownedBy: req.user.ownedBy || req.user._id
    };

    User.list(options, (err, users) => {

        if (err) {
            return next(err);
        }

        res.json(users);
    });
}

exports.get = (req, res, next) => {

    const id = req.params.id;

    User.get(id, (err, user) => {

        if (err) {
            return next(err);
        }

        res.json(user);
    });

}

exports.create = (req, res, next) => {

    req.body.ownedBy = req.user._id;

    authModule.createUser(req.body, (err, user) => {

        if (err) {
            return next(err);
        }

        res.json(user);
    });

}

exports.update = (req, res, next) => {

    const id = req.params.id;
    const body = req.body;

    User.findByIdAndUpdate(id, { ...body }, { new: true }, (err, user) => {

        if (err) {
            return next(err);
        }

        if (body.password) {
            user.set('password', body.password);
            user.save();
        }

        res.json(user);
    });

}

exports.delete = (req, res, next) => {

    const id = req.params.id;

    User.findByIdAndDelete(id).exec()
    .then(() => {
        return Post.deleteMany({ user: id }).exec();
    })
    .then(() => {
        return Comment.deleteMany({ user: id }).exec();
    })
    .then(() => {
        return res.json({});
    })
    .catch((err) => {
        return next(err);
    });

}