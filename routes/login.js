const express = require('express');
const bcrypt = require('bcryptjs');
const { csrfProtection,
  check,
  asyncHandler,
  validationResult,
} = require('./utils');
const { User } = require('../db/models');
const { loginUser } = require('../auth');

const router = express.Router();

// VALIDATORS for email and password
const validateEmailAndPassword = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
];

router.get('/',
  csrfProtection,
  asyncHandler( async(req, res, next) => {
    if (req.session.auth) {
     return res.redirect('/account')
    }
    res.render('login', {
      title: 'Login',
      csrfToken: req.csrfToken(),
    });
}));

router.post('/',
  csrfProtection,
  validateEmailAndPassword,
  asyncHandler( async(req, res, next) => {
    const { email, password } = req.body;
    // TODO verify we don't need username as well.

    let errors = [];
    const validationErrors = validationResult(req);

    if (validationErrors.isEmpty()) {
      const user = await User.findOne({ where: { email } });

      if (user !== null) {

        const passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString());
        if (passwordMatch) {
          loginUser(req, res, user);
          return res.redirect('/account');
        }
      }

      errors.push('Login failed for the provided email and password.')
    } else {
      errors = validationErrors.array().map((error) => error.msg);
    }

    res.render('login', {
      title: 'Login',
      email,
      errors,
      csrfToken: req.csrfToken(),
    });

}));

module.exports = router;
