//////////////////////////////////////
// -> inport libraries (dependencies)
//////////////////////////////////////
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router()
///////////////////////////////////
// -> connect to idea model Schema
///////////////////////////////////
require('../models/Idea');
const Idea = mongoose.model('ideas');
/////////////////////
// -> create routes
/////////////////////
router.get('/', (req, res) => { // -> ideas index page
  Idea.find({})
    .sort({
      date: 'desc'
    })
    .then((ideas) => {
      res.render('ideas/index', {
        ideas
      })
    });
});
router.get('/add', (req, res) => { // -> add ideas form
  res.render('ideas/add', {
    title: 'Add Ideas Page'
  });
});
router.get('/edit/:id', (req, res) => { // -> display edit form page with edit info
  Idea.findOne({
    _id: req.params.id
  }).then((idea) => {
    res.render('ideas/edit', {
      idea
    });
  });
});
router.post('/', (req, res) => { // -> proccess add ideas form
  let err = [];

  if (!req.body.title) {
    err.push({
      text: 'Please fill out the empty title.'
    });
  }
  if (!req.body.body) {
    err.push({
      text: 'Please fill out the empty body.'
    });
  }
  if (err.length > 0) {
    res.render('/add', {
      err,
      title: req.body.title,
      body: req.body.body
    })
  } else {
    let newUser = {
      title: req.body.title,
      body: req.body.body
    }

    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg', 'video added');
        res.redirect('/ideas');
      })
      .catch();
  }
});
router.put('/:id', (req, res) => { //  -> persist updated data to collection
  Idea.findOne({
    _id: req.params.id
  }).then((idea) => {
    idea.title = req.body.title;
    idea.body = req.body.body;

    idea.save().then(idea => {
      res.redirect('/ideas');
    });
  });
});
router.delete('/:id', (req, res) => { // -> delete idea
  Idea.remove({
    _id: req.params.id
  }).then(idea => {
    req.flash('success_msg', 'idea successfully deleted');
    res.redirect('/ideas');
  });
});
//////////////////////////////////////
// -> export libraries (dependencies)
//////////////////////////////////////
module.exports = router;
