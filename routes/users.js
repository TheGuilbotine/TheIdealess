const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { loginUser, logoutUser, requireAuth } = require('../auth');
const db = require('../db/models');
const { User } = db;
const { csrfProtection, asyncHandler, check, handleValidationErrors } = require('./utils');
const { validationResult } = require('express-validator');

const validateEmailAndPassword = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors,
]; //TODO add validators for special characters

const validateUsers = [
  check('username')
    .exists({checkFalsy: true})
    .withMessage('Please enter a username for your WhatsNext account')
    .isLength({ max: 25 })
    .withMessage('Please keep your username under 25 characters in length'),
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
            return Promise.reject('Sorry this email is already in use, perhaps you already have an account')
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
      handleValidationErrors,
];

/* GET users listing. */
router.get('/', requireAuth, (req, res) => {
  console.log(`bunch of nonsense`)
  const lilVariable = 'ah string'
  res.json({lilVariable})
 // res.send('respond with a resource');
});


router.get('/login',
  csrfProtection,
  asyncHandler( async(req, res, next) => {

  res.json({ csrfToken: req.csrfToken() })
  // res.render('login', {
    //   csrfToken: req.csrfToken(),
    // });
}));

router.post('/login',
// csrfProtection,
validateEmailAndPassword,
asyncHandler( async(req, res, next) => {
  console.log('Hello /users/login route');
  const {
    email,
    password
    // TODO verify we don't need username as well.
  } = req.body;

  const user = await User.findOne({
    where: {email}
  });
  const passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString());
  if (passwordMatch) {
    loginUser(req, res, user);
    // return res.redirect('/');  // TODO change to '/account' which is the users page
  }

  res.json({user, passwordMatch})
}));

router.get('/register',
  csrfProtection,
  asyncHandler( async (req, res) => {

    res.render('user-register', {
      csrfToken: req.csrfToken(),
    });
  }));


router.post('/register',
  validateUsers,
  csrfProtection,
  asyncHandler(async (req, res, next) => {

    const { username, firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.build({ username, firstName, lastName, email, hashedPassword });
    
    const validationErrors = validationResult(req);

    if (validationErrors.isEmpty()) {
      await user.save();
      loginUser(req, res, next);

      res.json({user});
      res.redirect('/');
    } else {
      console.log('You\'ve got Errs!!!!')
      const errors = validationErrors.array().map((error) => error.msg);

        res.render('user-register', {
          title: 'Register',
          username,
          firstName,
          lastName,
          email,
          errors,
          csrfToken: req.csrfToken(),
        });
      // res.json({csrfToken, username, firstName, lastName, email})
    }
  
    res.status(201).json({user});
}));

router.post('/logout', (req, res) => {
    logoutUser(req, res);
    // res.redirect('/');
    res.json({message: "Success"})
});

module.exports = router;
