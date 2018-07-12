//////////////////////////////////////
// -> inport libraries (dependencies)
//////////////////////////////////////
const express = require('express'); // -> import the express library
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');

///////////////////////////////////
// -> connect to idea model Schema
///////////////////////////////////
require('./models/Idea');
const Idea = mongoose.model('ideas');

//////////////////////////
// -> connect to mongoose
//////////////////////////
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/sampleApp').then(() => {
  console.log('connected to mongodb...');
}).catch((err) => console.log(err));

const app = express(); // -> use the initializer express function and assign it to app variable

const port = process.env.PORT || 5000; // -> declare port
/////////////////////////////////
// -> express session middleware
/////////////////////////////////
app.use(session({
  secret: 'segredo',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());
/////////////////////////
// -> express middleware
/////////////////////////
app.use((req, res, next) => { // -> time stamp middleware
  console.log('Time stamp: ' + Date.now());
  next();
});
app.use(function (req, res, next) { // -> set up global variables
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
///////////////////////////
// -> handlebars middleware
///////////////////////////
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars')
/////////////////////////////
// -> body-parser middleware
/////////////////////////////
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json());
//////////////////////////////////
// -> method override middleware
//////////////////////////////////
app.use(methodOverride('_method'));
/////////////////////
// -> create routes
/////////////////////
app.get('/ideas', (req, res) => { // -> ideas index page
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
app.get('/', (req, res) => { // -> index page route
  res.render('index', {
    title: 'Index Page'
  })
});
app.get('/about', (req, res) => { // -> about page route
  res.render('about', {
    title: 'About Page'
  });
})
app.get('/ideas/add', (req, res) => { // -> add ideas form
  res.render('ideas/add', {
    title: 'Add Ideas Page'
  });
});
app.get('/ideas/:id', (req, res) => { // -> display edit form page with edit info
  Idea.findOne({
    _id: req.params.id
  }).then((idea) => {
    res.render('ideas/edit', {
      idea
    });
  });
});
app.post('/ideas', (req, res) => { // -> proccess add ideas form
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
    res.render('ideas/add', {
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
app.put('/ideas/:id', (req, res) => { //  -> persist updated data to collection
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
app.delete('/ideas/:id', (req, res) => { // -> delete idea
  Idea.remove({
    _id: req.params.id
  }).then(idea => {
    req.flash('success_msg', 'idea successfully deleted');
    res.redirect('/ideas');
  });
});
app.get('/users/login', (req, res) => {
  res.send('login page');
});
app.get('/users/register', (req, res) => {
  res.send('register page');
});
////////////////////////////////////////////////////////////
// -> tell the app to listen to specified port on localhost
////////////////////////////////////////////////////////////
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
