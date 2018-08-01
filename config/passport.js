const LocalStrategy = requier('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = mongoose.model('users');

module.exports = function(passport) {
  
}
