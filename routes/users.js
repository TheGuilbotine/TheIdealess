const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { loginUser, logoutUser, requireAuth } = require('../auth');
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
  csrfProtection, 
  asyncHandler( async (req, res) => {
    const { username, firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = User.build({ username, firstName, lastName, email, hashedPassword });
    
    if (user) {
      await user.save();
      res.json({user});
      res.redirect('/');
    } else {

      res.render('user-register', {
        username,
        firstName,
        lastName,
        email,
        csrfToken: req.csrfToken(),
      });
      // res.json({csrfToken, username, firstName, lastName, email})
    }
}));

router.post('/logout', (req, res) => {
    logoutUser(req, res);
    res.redirect('/');
});



module.exports = router;
