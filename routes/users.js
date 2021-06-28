var express = require('express');
var router = express.Router();
const { loginUser } = require('../auth');
const db = require('../db/models');
const { User } = db;
const { csrfProtection, asyncHandler } = require('./utils')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', csrfProtection, asyncHandler( async(req, res, next) => {
  const {
    email,
    password
    // TODO verify we don't need username as well.
  } = req.body;

  const user = User.findOne({
    where: email
  });
  const passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString());
  if (passwordMatch) {
    loginUser(req, res, user);
    return res.redirect('/');  // TODO change to /account which is the users page
  }
}));

module.exports = router;
