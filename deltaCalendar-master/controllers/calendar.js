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
var passport = require('passport');
var sanitize = require('mongo-sanitize');


exports.dashboard = function(req, res){
  if(req.params.user==req.user.username)
  {
    let year = Number(req.query.year);
    let month = Number(req.query.month);
    let days = daysInMonth(month, year);
    let date = Number(req.query.date);
    function daysInMonth (month, year) {
      return new Date(Number(year), Number(month)+1, 0).getDate();
    }

    var init = new Date(year, month, 1).getDay();
    var m;
    console.log('mo',month);
    switch (month) {
      case 0:
        m = 'JANUARY';
        break;
      case 1:
        m = 'FEBRUARY'
      break;
      case 2:
        m = 'MARCH';
        break;
      case 3:
        m = 'APRIL';
      break;
      case 4:
        m = 'MAY';
        break;
      case 5:
        m = 'JUNE';
      break;
      case 6:
        m = 'JULY';
        break;
      case 7:
        m = 'AUGUST';
      break;
      case 8:
        m = 'SEPTEMBER';
        break;
      case 9:
        m = 'OCTOBER';
      break;
      case 10:
        m = 'NOVEMBER';
        break;
      case 11:
        m = 'DECEMBER';
      break;

    }
    var nmonth = month + 1;
    var pmonth = month - 1;
    var nyear = year;
    var pyear =  year;
    if(nmonth > 11)
    {
      nmonth=0;
      nyear++;
    }
    if(pmonth < 0)
    {
      pmonth = 11;
      pyear--;
    }

    res.render('dashboard',{days: days, init: init, year: year, nmonth:nmonth,pmonth:pmonth, user:req.user.username, mname: m, month: month, nyear: nyear, pyear: pyear, date: date});
  }
  else
  {
    res.status(404).send("Invalid User");
  }

};

exports.get_appointment = function(req, res){
  let year = Number(req.query.year);
  let month = Number(req.query.month);
  let date = Number(req.query.date);

  Appointment.find({user : req.user.username, date : date, year : year, month : month},function(err, result){
    if(err) throw err;
    console.log(result);
    res.render('appointment',{year: year, user:req.user.username, month: month, date: date ,data: result, user : req.user.username });
  });

};

exports.post_appointment = function(req, res){
  console.log(req.body);
  var appointment = new Appointment({
    title: sanitize(req.body.title.toUpperCase()),
    description: sanitize(req.body.description) ,
    start : req.body.start,
    end : req.body.end,
    year :Number(req.query.year),
    month: Number(req.query.month),
    date :Number(req.query.date),
    user : req.user.username
  });
  appointment.save();
  res.redirect('/calendar'+req.url);
};

exports.post_invitation = function(req,res){
  // console.log(req.body);
  var date = req.body.date.split("-");
  console.log(date);

  var invite = new Invitation({
    title: sanitize(req.body.title.toUpperCase()),
    description: sanitize(req.body.description) ,
    start : req.body.start,
    end : req.body.end,
    year : Number(date[0]),
    month : Number(date[1])-1,
    date : Number(date[2]),
    user : sanitize(req.body.invite)
  });
  User.findOne({username : invite.user},function(err, result){
    if(result)
    {
      result.invites.push(invite._id);
      invite.save();
      result.save();
    }
  });
  // console.log('id:',invite._id);

  res.render('invites',{user : req.params.user});
};

exports.get_invitation = function(req,res){
  res.render('invites',{user:req.user.username});
};
