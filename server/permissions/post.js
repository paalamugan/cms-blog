const { ROLES } = require("../common")

exports.canViewPosts = (user, posts) => {
    if (user.role === ROLES.ADMIN) return posts;
    return posts.filter(post => post.userId === user._id);
}

exports.canViewPost = (user, post) => {
    return (
        user.role === ROLES.ADMIN || 
        user._id === post.userId
    )
} 

exports.canDeletePost = (user, post) => {
    return user._id === post.userId;
} 