const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { logoutUser, requireAuth } = require('../auth');
const { User } = require('../db/models');
const { csrfProtection, asyncHandler, check, handleValidationErrors, validationResult } = require('./utils');

router.get('/', requireAuth, asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;

    const user = await User.findByPk(userId)
    res.render('account', {
       title: user.username,
   })
}));

module.exports = router;
