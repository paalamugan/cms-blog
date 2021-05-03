const config              = require('../config');
const { uploadImageToS3 } = require('../common');

exports.uploadPostImage = (req, res, next) => {
    
    const file = req.file;

    if (!file) {
        return next();
    }

    if (config.isAWS()) {

        uploadImageToS3({ file }, (err, data) => {

            if (err) {
                return next(err);
            }

            if (data && data.Location) {
                req.body.imageUrl = data.Location;
            }

            next();
        });

    } else {

        if (file.buffer) {
            let base64 = file.buffer.toString('base64');
            req.body.imageUrl = `data:${file.mimetype};base64, ${base64}`;
        } else if (file.path) {
            req.body.imageUrl = file.path;
        }

        next();
    }
}