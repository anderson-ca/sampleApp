const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = mongoose.model('users');

module.exports = function(passport) {
  passport.use(new LocalStrategy(({usernameField: 'email'}), (email, password, done) => {
    console.log(email);

    // match user
    User.findOne({
      email: email
    }).then(user => {
      if(!user) {
        return done(null, false, {message: 'User not found'});
      }

      // match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if(err) throw new error;

        if(isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {message: 'Password incorrect'});
        }
      })
    })
  }));

  // serialize and de-serialize user
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}
