var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: {type:String, required:true},
    email: {type:String, required:true},
    time: {type:Number, required:true},
    level: {type:Number, required:true}
});

module.exports = mongoose.model('Leader',schema);