const csrf = require('csurf');
const { validationResult, check } = require('express-validator');

const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);

const csrfProtection = csrf({cookie: true});

const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array().map((error) => error.msg);
        console.log(errors);

        const err = Error('Error Error Will Robinson');
        err.status = 400;
        err.title = 'Bad Robot.';
        err.errors = errors;
        console.log(err);
        next(err);
    }
    next();
};


module.exports = {
    csrfProtection,
    asyncHandler,
    handleValidationErrors,
    check,
    validationResult,
};
