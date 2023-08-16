const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {type:String , require: true}, 
    lastName: {type:String, require: true},
    username:{type:String || Number, require:true},
    email: {type:String , required:true, unique:true},
    password: {type:String, required:true},
    confirmPassword: {type:String},
},{timestamps:true} 
)

const model = mongoose.model('RegisterUsers' , userSchema);

module.exports = model;