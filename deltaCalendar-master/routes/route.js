var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var User = require('../models/user.js');
var Appointment = require('../models/appointment.js');
var Invitation = require('../models/invitation.js');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser =  require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var user_controller = require("../controllers/user.js");
var calendar_controller = require("../controllers/calendar.js");
var ajax_controller = require("../controllers/ajax.js");
var passport = require('passport');
var sanitize = require('mongo-sanitize');


const authenticationMiddleware = (req, res, next) => {
  if(!req.user)
  {
    // if user is not logged in
    res.redirect('/calendar/login')
  }
  else
  {
    next();
  }
}

router.get('/',function(req, res){
  res.redirect('/calendar/home')
});

router.get('/logout', user_controller.logout);

router.get('/home', user_controller.home);

router.get('/login', user_controller.login);

router.get('/register',user_controller.register_get);

router.post('/register',user_controller.register_post);

// When the login operation completes, user will be assigned to req.user.
// if authentication fails user is set to false

router.post('/login', passport.authenticate('local', {
  successRedirect: '/calendar/entry',
  failureRedirect: '/calendar/login',
}));


router.get(['/entry','/:user'],function(req,res){
  var d = new Date();
  let month = d.getMonth();
  let year = d.getFullYear();
  res.redirect('/calendar/'+req.user.username + '/date?'+'year='+year+'&month='+month);
});


router.get('/:user/appointment/date',authenticationMiddleware, calendar_controller.get_appointment);

router.post('/:user/appointment/date',authenticationMiddleware, calendar_controller.post_appointment);

router.get('/ajax/events',authenticationMiddleware,ajax_controller.addEvent);

router.get('/ajax/user',user_controller.userCheck);
// router.get('/ajax/invite',user_controller.userCheck);
router.get('/ajax/inv',authenticationMiddleware, ajax_controller.getInvites);

router.get('/:user/date',authenticationMiddleware, calendar_controller.dashboard);

router.get('/:user/invites',authenticationMiddleware,calendar_controller.get_invitation);

router.post('/:user/invites',calendar_controller.post_invitation);

router.get('/:user/home',function(req, res){
  let d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth();
  res.redirect('/calendar/'+req.params.user+'/date?year='+year+'&month='+month);
});

router.get('/ajax/add',function(req, res){
  console.log(req.query);
  // User.findOne({username:req.user.username},function(err, result){
  //   if(err) throw err;
    // var temp = result.invites.toString().split(',');
    // console.log('temp', result.invites[2]);
    // result.invites.splice(1,1);
    // result.invites = temp.fiter(function(element){
    //   return element != req.query.id;
    // });
    // delete result.invites[1];

    // for(i = 0;result.invites[i] != undefined; ++i)
    // {
      // if(result.invites[i] == req.query.id)
      // {
        // result.invites.splice(i,1);
      // }
    // }
    // console.log('ss',result.invites.toString().split(',')[0]))
    // result.save();
    // result.user = req.user.username;

    // console.log('rr',result);
  // });
  // console.log(req.query.id);
    // var appointment = new Appointment({
    //
    // })
    Invitation.findOne({_id:req.query.id},function(err, result){
      // result.user = req.user.username;
      // var app = new Appointment(result);
      var appointment = new Appointment({
        title: result.title,
        description: result.description ,
        start : result.start,
        end : result.end,
        year : result.year,
        month : result.month,
        date : result.date,
        user : result.user
      });
      appointment.save();
      console.log('added');
      Invitation.deleteOne({_id:req.query.id},function(err, obj){
        console.log('deleted');
      });
    });



});


module.exports = router;
