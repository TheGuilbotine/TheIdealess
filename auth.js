const express = require('express');
const { User } = require('./db/models');

const loginUser = (req, res, user) => {
    req.session.auth = {
        userId: user.id,
    };
};

const logoutUser = (req, res) => {
    delete req.session.auth
}

const requireAuth = (req, res, next) => { // need to import somewhere
    if(!res.locals.authenticated){
        return res.redirect('/users/login')
    }
    return next()
}


const restoreUser = async (req, res, next) => {
  // check if req.session.auth is empty, occurs after test logins
  if(JSON.stringify(req.session.auth) === '{}') logoutUser(req, res);
  
  if(req.session.auth) {
    const { userId } = req.session.auth
    try{
      const user = await User.findByPk(userId)
      if(user){
          res.locals.authenticated = true;
          res.locals.user = user
          return next()
      }
    } catch (err) {
    res.locals.authenticated = false
    return next(err)
    }
  } else {
    res.locals.authenticated = false;
    return next()
  }
}


module.exports = {
    loginUser,
    logoutUser,
    requireAuth,
    restoreUser
};
