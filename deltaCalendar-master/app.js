var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser =  require('body-parser');
var multer = require('multer');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');
var cookieSession = require('cookie-session');
// Helmet helps you secure your Express apps by setting various HTTP headers.
var helmet = require('helmet');
var MongoDBStore = require('connect-mongodb-session')(session);
var User = require('./models/user.js');
var bcrypt = require('bcryptjs');
var expressSanitizer = require('express-sanitizer');


var app = express();
app.use(helmet());

// view engine setup
app.set('view engine','ejs');


// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// bodyParser.urlencoded(): Parses the text as URL encoded data (which is how browsers tend to
// send form data from regular forms set to POST) and exposes the resulting
// object (containing the keys and values) on req.body. For comparison;
// bodyParser.json(): Parses the text as JSON and exposes the resulting object on req.body.


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public',express.static('public'));

//express session

// var store = new MongoDBStore({
//   uri: 'mongodb://localhost:27017/calendar',
//   collection: 'mySessions'
// });
//
// store.on('connected', function() {
//   store.client; // The underlying MongoClient object from the MongoDB driver
// });
//


app.use(cookieSession({
  maxAge: 24*60*60*1000,
  keys:['nimishthegreat']
}));

//passport init
app.use(passport.initialize());
app.use(passport.session());

// adding routes
var route = require("./routes/route.js");
app.use('/calendar',route);

//like express middleware telling passport to use local Strategy
passport.use(new LocalStrategy(
function(username, password, done){
  // console.log(username);
  // this function is fired when post request is made in login page
  // a middle passpoert.authenticate() in route file accounts for firing of this function
  // console.log("=> function fired");

  // done function is called when we are done with this function
  // after done function user is serialized in the cookie
  let query = {
    username : username,
  }
  User.findOne(query).then(function(result){
    console.log(result);

    if (result == null)
    {
      return done(null, false);
    }
    else
    {
      console.log(result.password);
      bcrypt.compare(password,result.password,function(err, response){
        if(response === true)
        {
          console.log('done');
          return done(null, result);// passing on the data in the cookie (to serialize)
        }
        else
        {
              return done(null, false);
        }
      })

    }
  });
}
));

// takes up a piece of information from our record and pass it on to stuff in
// a coookie and sends the cookie to the server
 passport.serializeUser(function(user,done){
  // user.id is the id stored for useer in mongodb database
   done(null, user.id);//null refers we are passing no error
 })


// when we recieve the cookie ar server we need to deserialize it so to grab the
// info stored in it
 passport.deserializeUser(function(id, done){
   // second parameter of done function attatches the value to req of route POST
   // so we can access it there
   User.findById(id).then((user)=>{
     done(null,user);
   })
 })



// set up Mongoose Connection
const mongoose = require('mongoose');
var db = mongoose.connection;

    mongoose.connect('mongodb://localhost/calendar');
    db.once('open', function(){
        console.log('Connection has been made, now make fireworks...');
    }).on('error', function(error){
        console.log('Connection error:', error);
    });

app.listen(3000,() => {
  console.log("app now listening for requests at port 3000");
});
