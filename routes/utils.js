const csrf = require('csurf');
const { validationResult, check } = require('express-validator');

const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);
const csrfProtection = csrf({cookie: true});
const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);
    next();
};


module.exports = {
    csrfProtection,
    asyncHandler,
    handleValidationErrors,
    check,
};
