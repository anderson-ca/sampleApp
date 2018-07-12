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

/////////////////////////
// -> import idea/user routes
/////////////////////////
const ideas = require('./routes/ideas');
const users = require('./routes/users');
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

//////////////////////////////
// -> index and about routes
/////////////////////////////
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
/////////////////////////////////////////////////////
// -> redirect to ideas/users file containing routes
/////////////////////////////////////////////////////
app.use('/ideas', ideas);
app.use('/users', users);
////////////////////////////////////////////////////////////
// -> tell the app to listen to specified port on localhost
////////////////////////////////////////////////////////////
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
