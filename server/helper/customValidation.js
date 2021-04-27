
exports.getParamsValidation = (req, res, next) => {
    const id = req.params.id;
    
    if (!id) {
        return next(new Error("id is missing"));
    }

    next();
}