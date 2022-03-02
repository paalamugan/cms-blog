const express                   = require('express');
const Router                    = express.Router();
const { getParamsValidation }   = require('../helper/customValidation');
const { User, Post, Comment }   = require('../controllers');
const { ROLES, getSessionUser } = require('../common');
const { uploadPostImage }       = require('../helper/uploadImage');
const { authenticateRole, authModule } = require('../auth');

const getCurrentSession = (req, res, next) => {

    const id = req.user._id;

    authModule.getUser(id, (err, user) => {

        if (err) {
            return next(err);
        }

        if (!user) {
            return new Error("User doesn't exist!");
        }

        res.json(getSessionUser(req.user));

    });

}

// Session
Router
    .get('/session', getCurrentSession)
    .get('/users/me', User.me)
    .put('/users/me', User.updateLoginUser)
// Users
    .get('/users',  User.list)
    .post('/users', authenticateRole(ROLES.ADMIN), User.create)

    .all('/users/:id', getParamsValidation)
    .get('/users/:id', User.get)
    .put('/users/:id', authenticateRole(ROLES.ADMIN), User.update)
    .delete('/users/:id', authenticateRole(ROLES.ADMIN), User.delete)

// Posts
    .get('/posts', Post.list)
    .get('/posts/slug/:slug', Post.slug)
    
    .post('/posts', authenticateRole(ROLES.ADMIN), uploadPostImage, Post.create)
    
    .all('/posts/*', authenticateRole(ROLES.ADMIN))
    .all('/posts/:id', getParamsValidation)
    .get('/posts/:id', Post.get)
    .put('/posts/:id', uploadPostImage, Post.update)
    .delete('/posts/:id', Post.delete)

// Comments
    .get('/comments', Comment.list)
    .post('/comments', Comment.create)
    .all('/comments/:id', getParamsValidation)
    .get('/comments/:id', Comment.get)
    .put('/comments/:id', Comment.update)
    .delete('/comments/:id', Comment.delete);

module.exports = Router;