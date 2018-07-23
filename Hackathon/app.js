var express = require('express');
var path = require('path');
var bodyParser =  require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');
var cookieSession = require('cookie-session');
var helmet = require('helmet');
var User = require('./models/user.js');
var bcrypt = require('bcryptjs');
var expressSanitizer = require('express-sanitizer');
var multer = require('multer');




var app = express();

app.use(helmet());

app.set('view engine','ejs');

//storage engine setup
const storage = multer.diskStorage({
  destination : './public/uploads/',
  filename : function(req,file,callback){
      callback(null,file.fieldname+"-"+Date.now()+path.extname(file.originalname));
  }
});

//init uploads
const upload = multer({
  storage:storage,
  // limits:{filesize:10 }
}).single('myImage');
module.exports = upload;


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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public',express.static('public'));

app.use(cookieSession({
  maxAge: 24*60*60*1000,
  keys:['nimishthegreat']
}));

//passport init
app.use(passport.initialize());
app.use(passport.session());

// adding routes
var route = require("./routes/route.js");
app.use('/',route);

passport.use(new LocalStrategy(
function(username, password, done){
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
          return done(null, result);
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

passport.serializeUser(function(user,done){
   done(null, user.id);
 })

passport.deserializeUser(function(id, done){
   User.findById(id).then((user)=>{
     done(null,user);
   })
 })



// set up Mongoose Connection
const mongoose = require('mongoose');
// var Grid = require('gridfs-stream');
var db = mongoose.connection;

    mongoose.connect('mongodb://localhost/hackathon');
    db.once('open', function(){
        console.log('Connection has been made, now make fireworks...');
        // var gfs = Grid(db.db, mongoose.mongo);
    }).on('error', function(error){
        console.log('Connection error:', error);
    });

app.listen(3000,() => {
  console.log("app now listening for requests at port 3000");
});
