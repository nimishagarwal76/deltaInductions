var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var invitationSchema = new Schema({
    title: String,
    description: String,
    start : String,
    end : String,
    year : Number,
    month : Number,
    date : Number,
    user : String
});


var Invitation = mongoose.model('invitations', invitationSchema);

module.exports = Invitation;
