const express = require('express');
const { csrfProtection, 
  check, 
  handleValidationErrors, 
  asyncHandler,
  validationResult,
} = require('./utils');
const { User } = require('../db/models');

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
  handleValidationErrors,
]; //TODO add validators for special characters

router.get('/', 
  csrfProtection,
  asyncHandler( async(req, res, next) => {

    res.render('login', {
      title: 'Login',
      csrfToken: req.csrfToken(),
    });
}));

router.post('/', 
  csrfProtection,
  validateEmailAndPassword,
  asyncHandler( async(req, res, next) => {
    const { email, password } = req.body; // TODO verify we don't need username as well.
    const user = await User.findOne({ where: { email } });
    
    const validationErrors = validationResult(req);

    if(validationErrors.isEmpty()) {


      
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString());
    if (passwordMatch) {
      loginUser(req, res, user);
      return res.redirect('/');  // TODO change to '/account' which is the users page
    } else {

      res.render('login', {
        title: 'Login',
        email,
        csrfToken: req.csrfToken(),
      });
    }

    // res.json({user, passwordMatch});
}));

    if (validationErrors.isEmpty()) {
      await user.save();
      loginUser(req, res, next);

      res.json({user});
      res.redirect('/');
    } else {
      console.log('You\'ve got Errs!!!!')
      const errors = validationErrors.array().map((error) => error.msg);

module.exports = router;