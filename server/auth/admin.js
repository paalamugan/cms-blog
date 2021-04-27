const mongoose = require('mongoose');
const { adminCredentials } = require('../config');
const { ROLES, generateHash } = require('../common');

const adminUser = {
    _id: mongoose.Types.ObjectId().toString(),
    username: adminCredentials.username,
    password: adminCredentials.password,
    role: ROLES.ADMIN,
    gravatarHash: generateHash(adminCredentials.username)
};

exports.isAdminUser = (username) => {
    return (adminUser.username === username);
}

exports.getAdminUser = () => {
    return adminUser;
}