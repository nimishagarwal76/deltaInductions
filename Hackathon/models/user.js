var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username:String,
    password: String,
    email : String,
    name : String,
    aboutme :{
      type:String,
      default:''
    },
    interestedin : String,
    gender : String,
    lookingfor : {
      type:String,
      default:"relationship"
    },
    profilepicture : {
      type : String,
      default : undefined
    },
    photos : [String],
    likes:[String],
    visit:[String],
    phone:Number
});


var User = mongoose.model('users',userSchema);

module.exports = User;
