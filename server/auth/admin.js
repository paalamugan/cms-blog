const mongoose = require('mongoose');
const { adminCredentials } = require('../config');
const { ROLES, generateHash } = require('../common');

const adminUser = {
    _id: '608ec3854814b740ea937c57' || mongoose.Types.ObjectId().toString(),
    username: adminCredentials.username,
    password: adminCredentials.password,
    role: ROLES.ADMIN,
    avatarUrl: '/assets/images/avatar.png'
};

exports.isAdminUser = (username) => {
    return (adminUser.username === username);
}

exports.getAdminUser = () => {
    return adminUser;
}