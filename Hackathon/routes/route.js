var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var User = require('../models/user.js');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser =  require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var user_controller = require("../controllers/user.js");
// var calendar_controller = require("../controllers/calendar.js");
var passport = require('passport');
var sanitize = require('mongo-sanitize');
var upload = require('../app.js');


const authenticationMiddleware = (req, res, next) => {
  if(!req.user)
  {
    res.redirect('/login')
  }
  else
  {
    next();
  }
}

router.get('/',function(req, res){
  res.redirect('/home')
});

router.get('/logout', user_controller.logout);

router.get('/home', user_controller.home);

router.get('/login', user_controller.login);

router.get('/register',user_controller.register_get);

router.post('/register',user_controller.register_post);

router.post('/login', passport.authenticate('local', {
  successRedirect: '/entry',
  failureRedirect: '/login',
}));


router.get(['/entry','/:user'],function(req,res){
  res.redirect('/'+req.user.username+'/menu');
});

router.get('/ajax/user',user_controller.userCheck);

router.get('/:user/menu',authenticationMiddleware,function(req, res){
  var matches ;
  var visit = true;

    User.findOne({username:req.user.username},(err,result)=>{
    User.find({gender:result.interestedin, lookingfor:result.lookingfor},(err,resul)=>{
      // matches =
      var goto = {};
      // resul.forEach((entry)=>{
      for(var i = 0; i<resul.length;++i)
      {
        entry = resul[i]
        console.log(entry.visit);
        if(entry.username!=req.user.username && entry.visit.indexOf(req.user._id)==-1)
        {
          goto = entry
          break
        }
      }
      // })
      console.log('goto',goto);
      res.render('test', {errors:[], publicname:result.name.toUpperCase(), profilepicture:result.profilepicture, aboutme:result.aboutme, lookingfor:result.lookingfor, interestedin:result.interestedin, match:goto, gender:result.gender})
    })
    })
});

router.get('/:user/profile',authenticationMiddleware,function(req,res){
  User.findOne({username:req.user.username},(err,result)=>{
    if (err) throw err;
      res.render('profile', {errors:[], publicname:result.name.toUpperCase(), profilepicture:result.profilepicture, aboutme:result.aboutme, lookingfor:result.lookingfor, interestedin:result.interestedin})
  })

})

router.post('/:user/profile',authenticationMiddleware,function(req,res){
  console.log(req.body);
  User.findOne({username:req.user.username},function(err,result){
   if(err) throw err;
   result.aboutme = req.body.aboutme;
   result.interestedin = req.body.interestedin;
   result.lookingfor =  req.body.lookingfor;
   result.save();
   res.redirect('/'+req.user.username+'/menu')
   });
})


router.post('/:user/addprofileimage',authenticationMiddleware,(req,res)=>{
  upload(req,res,function(err){
    if(err) throw err;
    if(req.file != undefined)
    {
       console.log("path:",req.file);
       User.findOne({username:req.user.username},function(err,result){
        if(err) throw err;
        result.profilepicture = (req.file.destination+req.file.filename);
        result.save();
      }).then(()=>{
          res.redirect('/'+req.user.username+'/profile')
      });
      };
    })
    res.redirect('/'+req.user.username+'/profile')
})

router.get('/ajax/:act/:id',authenticationMiddleware,(req,res)=>{
  console.log('parameters',req.params);
  if(req.params.act == 'cross')
  {
    User.findOne({_id:req.params.id},(err,result)=>{
      console.log('liked',result);
      result.visit.push(req.user._id);
      result.save();
      res.send('done')
    })
  }
  else if (req.params.act == 'heart')
  {
    User.findOne({username:req.user.username},(err,result)=>{
      console.log('heart click');
      result.likes.push(req.params.id);
      result.save();
    })
    User.findOne({_id:req.params.id},(err,result)=>{
      console.log('liked',result);
      result.visit.push(req.user._id);
      result.save();
      res.send('done')
    })
  }
})

router.get('/:user/match',authenticationMiddleware,(req,res)=>{
  // console.log('hey');

  User.findOne({username:req.user.username},(err, result)=>{
    var m = [];
    if(result.likes.length)
    {for(var i=0;i<result.likes.length;++i)
    {
      liked = result.likes[i];
      User.findOne({_id:liked},(err,resul)=>{
        if(resul.likes.indexOf(result._id)+1)
        {
          m.push(resul)
          console.log('hala');
        }
        console.log('m',m);

      }).then(()=>{
      if(i==(result.likes.length))
      {
        console.log('mout',m);
         res.render('match',{errors:[], publicname:result.name.toUpperCase(), profilepicture:result.profilepicture, aboutme:result.aboutme, lookingfor:result.lookingfor, interestedin:result.interestedin, gender:result.gender,matchedwith:m});
      }
      })
    }}
    else{
      res.render('match',{errors:[], publicname:result.name.toUpperCase(), profilepicture:result.profilepicture, aboutme:result.aboutme, lookingfor:result.lookingfor, interestedin:result.interestedin, gender:result.gender,matchedwith:[]});
    }
  })
})

module.exports = router;
