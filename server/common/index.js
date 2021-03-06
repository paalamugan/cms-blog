const constant = require('./constant');
const utils = require('./utils');
const awsS3 = require('./aws-s3');
const customDisposableEmailDomains = require('./custom-disposable-email-domains');

module.exports = {
    customDisposableEmailDomains,
    ...constant,
    ...utils,
    ...awsS3
}