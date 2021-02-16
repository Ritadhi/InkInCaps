var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
 
var connection = mongoose.createConnection("mongodb://localhost/demo", { useFindAndModify: false, useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
 
autoIncrement.initialize(connection);

var schema = new Schema({
    studentName: {type:String, required:true},
    fatherName: {type:String, required:true},
    dob: {type:String, required:true},
    gender: {type:String, required:true},
    course: {type:String, required:true},
    mobile: {type:Number, required:true},
    email: {type:String, required:true},
    address: {type:String, required:true},
    photo: {type:String},
    createdAt: {type:Date, required:true}
});

schema.plugin(autoIncrement.plugin, {
    model: 'Student',
    field: 'student_id',
    startAt: 1,
    incrementBy: 1
});

module.exports = mongoose.model('Student',schema);