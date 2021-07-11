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

exports.me = (req, res, next) => {

    const id = req.user.id;

    if (!id) {
        return next(new Error("User Id is missing!"));
    }

    User.findById(id, { email: 1, username: 1, role: 1, provider: 1 }, (err, user) => {

        if (err) {
            return next(err);
        }

        res.json(user);
    });
}

exports.updateLoginUser = (req, res, next) => {

    const id = req.user._id || req.user.id;
    const body = req.body;

    if (!id) {
        return next(new Error("User Id is missing!"));
    }

    User.findByIdAndUpdate(id, { ...body }, { new: true, projection: { email: 1, username: 1, role: 1, provider: 1 } }, (err, user) => {

        if (err) {
            return next(err);
        }

        if (!body.password) {
            return res.json(user);
        }

        if (!body.newPassword) {
            return next(new Error("New Password doesn't empty!"));
        }

        if (body.newPassword !== body.repeatNewPassword) {
            return next(new Error("New Password doesn't match!"));
        }

        User.changePassword(id, body.password, body.newPassword, (err, user) => {
            if (err) {
                return next(err);
            }
            res.json(user);
        })

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