//////////////////////////////////////
// -> inport libraries (dependencies)
//////////////////////////////////////
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
///////////////////////////////////
// -> connect to user model Schema
///////////////////////////////////
require('../models/User');
const User = mongoose.model('users');
/////////////////////
// -> create routes
/////////////////////
router.get('/login', (req, res) => { // -> show user login page
  res.render('users/login');
});
router.get('/register', (req, res) => { // -> user registration page
  res.render('users/register');
});
router.post('/login', (req, res, next) => { // -> login user
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});
router.post('/register', (req, res) => { // -> persist new user data to collection
  let err = [];

  if (req.body.password !== req.body.confirmPassword) {
    err.push({
      text: 'password and confirm-password fields must match'
    });
  }

  if (req.body.password.length < 3) {
    err.push({
      text: 'password must be at least 3 characters long'
    });
  }

  if (err.length > 0) {
    res.render('users/register', {
      err,
      username: req.body.username,
      email: req.body.email
    });
  } else {

    User.findOne({
      email: req.body.email
    }).then((user) => {
      if (user) {
        req.flash('error_msg', 'Email already in use');
        res.redirect('/users/register');
      } else {
        let newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw new error;
            newUser.password = hash;
            newUser.save()
              .then((user) => {
                req.flash('success_msg', 'Account created successfully');
                res.redirect('/users/login');
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    }).catch(err => console.log(err));

  }

});
//////////////////////////////////////
// -> export libraries (dependencies)
//////////////////////////////////////
module.exports = router;
