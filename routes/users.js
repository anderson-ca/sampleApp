//////////////////////////////////////
// -> inport libraries (dependencies)
//////////////////////////////////////
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
///////////////////////////////////
// -> connect to user model Schema
///////////////////////////////////
/////////////////////
// -> create routes
/////////////////////
router.get('/login', (req, res) => {
  res.send('login page');
});
router.get('/register', (req, res) => {
  res.send('register page');
});
//////////////////////////////////////
// -> export libraries (dependencies)
//////////////////////////////////////
module.exports = router;
