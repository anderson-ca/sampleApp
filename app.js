//////////////////////////////////////
// -> inport libraries (dependencies)
//////////////////////////////////////
const express = require('express'); // -> import the express library
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');


//////////////////////////
// -> connect to mongoose
//////////////////////////
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/sampleApp').then(() => {
  console.log('connected to mongodb...');
}).catch((err) => console.log(err));

const app = express(); // -> use the initializer express function and assign it to app variable

const port = process.env.PORT || 5000; // -> declare port

/////////////////////////
// -> express middleware
/////////////////////////
app.use((req, res, next) => { // -> time stamp middleware
  console.log('Time stamp: ' + Date.now());
  next();
});
///////////////////////////
// -> handlebars middleware
///////////////////////////
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars')
////////////////////
// -> create routes
///////////////////
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
////////////////////////////////////////////////////////////
// -> tell the app to listen to specified port on localhost
////////////////////////////////////////////////////////////
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
