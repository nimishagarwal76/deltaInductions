var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var appointmentSchema = new Schema({
    title: String,
    description: String,
    start : String,
    end : String,
    year : Number,
    month : Number,
    date : Number,
    user : String 
});


var Appointment = mongoose.model('appointments', appointmentSchema);

module.exports = Appointment;
