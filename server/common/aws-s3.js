'use strict';

const _ = require('lodash');
const S3 = require('aws-sdk/clients/s3');
const s3Stream = require('s3-upload-stream');
const config = require('../config');

const s3 = new S3(config.awsS3);

exports.checkBucketExists = function (bucketName, callback) {

    const options = {
        Bucket: bucketName,
    };

    s3.headBucket(options, function (err, result) {

        if (err) {
            return callback(new Error('S3 Bucket name Not found!. Please provide valid bucket name')); // Error statusCode will be 404 if the bucket does not exist.
        }

        callback(null, true);
    });
};

exports.getS3UploadStream = function (options, callback) {

    const upload = s3Stream(s3).upload(options);
    let receivedSize = null;
    let uploadedSize = null;

    // Optional configuration
    // upload.maxPartSize(20971520); // 20 MB
    // upload.concurrentParts(5);

    // Handle errors.
    upload.on('error', function (error) {
        callback(error);
    });

    /* Handle progress. Example details object:
       { ETag: '"f9ef956c83756a80ad62f54ae5e7d34b"',
         PartNumber: 1,
         receivedSize: 29671068,
         uploadedSize: 29671068 }
    */
    upload.on('part', function (details) {
        if (details.PartNumber === 1) {
            receivedSize = details.receivedSize;
            uploadedSize = details.uploadedSize;
        }
    });

    /* Handle upload completion. Example details object:
       { Location: 'https://bucketName.s3.amazonaws.com/filename.ext',
         Bucket: 'bucketName',
         Key: 'filename.ext',
         ETag: '"bf2acbedf84207d696c8da7dbb205b9f-5"' }
    */
    upload.on('uploaded', function (details) {

        if (details && uploadedSize) {
            details.fileSize = uploadedSize;
        }

        callback(null, details);
    });

    return upload;

}