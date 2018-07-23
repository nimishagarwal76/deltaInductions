var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username:String,
    password: String,
    email : String,
    name : String,
    invites: []
});


var User = mongoose.model('users',userSchema);

module.exports = User;
