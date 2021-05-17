const mongoose = require('mongoose');
const { adminCredentials } = require('../config');
const { ROLES } = require('../common');

const adminUser = {
    _id: '608ec3854814b740ea937c57' || mongoose.Types.ObjectId().toString(),
    username: adminCredentials.username,
    email: `${adminCredentials.username.toLowerCase()}@gmail.com`,
    password: adminCredentials.password,
    role: ROLES.ADMIN,
    verified: true,
    avatarUrl: '/assets/images/avatar.png'
};

exports.isAdminUser = (email) => (adminUser.username === email || adminUser.email === email);

exports.getAdminUser = () => adminUser;