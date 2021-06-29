const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { loginUser, logoutUser, requireAuth } = require('../auth');
const { User } = require('../db/models');
const { csrfProtection, asyncHandler, check, handleValidationErrors, validationResult } = require('./utils');


/* GET users listing. */
router.get('/', requireAuth, (req, res) => {
  res.json({lilVariable})
 // res.send('respond with a resource');
});

router.post('/logout', (req, res) => {
    logoutUser(req, res);
    // res.redirect('/');
    res.json({message: "Success"})
});

module.exports = router;
