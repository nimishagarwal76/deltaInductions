var express = require('express');
var User = require('../models/user.js');
var Appointment = require('../models/appointment.js');
var Invitation = require('../models/invitation.js');
var sanitize = require('mongo-sanitize');

exports.addEvent = function(req,res){
  console.log(req.query);
  let year = Number(req.query.year);
  let month = Number(req.query.month);
  // console.log(year,month);
  Appointment.find({year:year,month:month,user:req.user.username},function(err, result){
    if(err) throw err;
    res.send(JSON.stringify(result));
  });

};

exports.getInvites = function(req, res){
  console.log('query:',req.query);
  console.log('recieved');
  Invitation.find(req.query,function(err, result){
    if(err) throw err;
    console.log(result);
    res.send(JSON.stringify(result));
  });

};
