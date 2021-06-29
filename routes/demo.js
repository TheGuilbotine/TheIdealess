const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { logoutUser, requireAuth, loginUser } = require('../auth');
const { User } = require('../db/models');
const { csrfProtection, asyncHandler, check, handleValidationErrors, validationResult } = require('./utils');

router.post('/', asyncHandler (async(req, res) => {
    const user = await User.findOne({ where: { username: 'DemoUser'}})
    loginUser(req, res, user)
    return res.redirect('/account')
}))

module.exports = router;
