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

// VALIDATORS for registering user
const validateUsersRegister = [
  check('username')
    .exists({checkFalsy: true})
    .withMessage('Please enter a username for your WhatsNext account')
    .isLength({ max: 25 })
    .withMessage('Please keep your username under 25 characters in length')
    .custom((value) => {
      return User.findOne({
        where: { username: value }
      })
        .then((user) => {
          if (user) {
            return Promise.reject('Sorry this username or email is already in use')
          }
        });
    }),
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('Please enter your first name')
    .isLength({ max: 15 })
    .withMessage('My goodness you have a long name, please enter an abbreviation or your nickname'),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Please enter your last name')
    .isLength({ max: 30 })
    .withMessage('I\'m sorry that your name is so long, please provide the first 30 characters of your name'),
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please fill out the email field')
    .isLength({ max: 255 })
    .withMessage('Please don\'t tell us you really have an email that long')
    .isEmail()
    .withMessage('Email Address needs to be an actual email address, check you have a @ and a TLD i.e. .com, .org, .gov')
    .custom((value) => {
      return User.findOne({
        where: { email: value }
      })
        .then((user) => {
          if (user) {
            return Promise.reject('Sorry this username or email is already in use')
          }
        });
    }),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please enter a password')
      // TODO fix regex expression
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*^?&])[A-Za-z\d@$^!%*?&]{8,}$/, 'g')
      .withMessage(`Please create a password between 8 and 30 characters in length
                    with at least one lower case letter, one upper case letter,
                    one number, and one special character`),
    check('confirmPassword')
      .exists({ checkFalsy: true })
      .withMessage('Please fill out the confirm password field')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Your Confirm Password does not match your Password');
        }
        return true;
      }),
];

router.get('/',
  csrfProtection,
  asyncHandler( async (req, res) => {

    res.render('register', {
      title: 'Register',
      csrfToken: req.csrfToken(),
    });
  }));


router.post('/',
  validateUsersRegister,
  csrfProtection,
  asyncHandler(async (req, res, next) => {
    const { username, firstName, lastName, email, password } = req.body;

    const validationErrors = validationResult(req);

    if (validationErrors.isEmpty()) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.build({ username, firstName, lastName, email, hashedPassword});
      await user.save();

      loginUser(req, res, next);

      return res.redirect('/account');
    } else {
      const errors = validationErrors.array().map((error) => error.msg);

      res.render('register', {
        title: 'Register',
        username,
        firstName,
        lastName,
        email,
        errors,
        csrfToken: req.csrfToken(),
      });
    }

}));

module.exports = router;
