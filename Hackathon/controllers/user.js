var User = require('../models/user.js');
var passport = require('passport');
var bcrypt = require('bcryptjs');
var users;
var request = require('request');
var sanitize = require('mongo-sanitize');

// var LdapAuth = require('ldapauth');
// var options = {
//     url: 'http://10.0.0.39/'
// }  ;
// var auth = new LdapAuth(options);
// auth.authenticate('106117095@octa.edu',Ojan27111 , function(err, user) { console.log('user',user);});


exports.register_get = function(req, res){
  if(!req.user)
  {
    res.render('register',{errors:[]});
  }
  // else
  // {
  //     res.redirect('/'+req.user.username);
  // }
};

exports.register_post = function(req,res){
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  var gender = req.body.gender;
  console.log('gender', gender);
  var b;
   //express validation
  req.checkBody('name','Name is required').notEmpty();
  req.checkBody('email','Email is required').notEmpty();
  req.checkBody('email','Email is not valid').isEmail();
  req.checkBody('username','Username is required').notEmpty();
  req.checkBody('password','Password is required').notEmpty();
  req.checkBody('gender','Fill out the gender').notEmpty();
  req.checkBody('phone','Fill out the Phone Number').notEmpty();
  req.checkBody('password2','Passwords do not match').equals(req.body.password);
  var errors = req.validationErrors();

  const secretKey = '6LejVWEUAAAAANnXCIcs0kk5tj_uydZeK1uYt2T5';
  // req.connection.remoteAddress will provide IP address of connected user.
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body['g-recaptcha-response']}&remoteip=${req.connection.remoteAddress}`;
  request(verifyUrl, (err, response, body)=>{
    b = JSON.parse(body);
    console.log("aa",b);
    if(errors || !b.success)
    {
      if(!errors) errors=[];
      res.render('register',{errors:errors});
    }
    else
    {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
          password = hash;
          var interest;
          if(req.body.gender == 'boy') interest = 'girl';
          else if(req.body.gender == 'girl') interest = 'boy';
          var user = new User({
            username: sanitize(req.body.username),
            password: password ,
            email : sanitize(req.body.email),
            name : sanitize(req.body.name),
            gender : req.body.gender,
            interestedin : interest,
            phone : req.body.phone
          });
          user.save();
        });
      });
      res.redirect('/login');
    }

  })


};

exports.userCheck = function(req, res){
  console.log(req.query);
  console.log('users',users);
  User.find({},{username:1, _id:0},function(err, result){
    if(err) throw err;
    users = result;
    if(users)
    {
    var found = users.find(function(element) {
      return element.username == req.query.username;
    });
    if(found)
    {
      console.log('true');
      res.send(JSON.stringify(true));
    }
    else {
      console.log('false');
      res.send(JSON.stringify(false));
    }
    }
  });

};

exports.logout = function(req,res){
  req.logout();
  res.redirect('/home');
};

exports.home = function(req,res){
  if(!req.user)
  {
    res.render('home');
  }
  else
  {
    res.redirect(req.user.username);
  }
};

exports.login = function(req,res){
  if(!req.user)
  {
    res.render('login');
  }
  // else
  // {
  //     res.redirect('/'+req.user.username);
  // }
};
