const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { loginUser } = require('../auth');
const db = require('../db/models');
const { User } = db;
const { csrfProtection, asyncHandler, check, handleValidationErrors } = require('./utils');

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


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', 
  // csrfProtection,
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
  // if (passwordMatch) {
  //   loginUser(req, res, user);
  //   return res.redirect('/');  // TODO change to '/account' which is the users page
  // }

  res.json({user})
}));

module.exports = router;
