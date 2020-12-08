// //inside usersTest.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
   fullname: {
    type: String
   },
})
//Pokemon constant represents the entire collection of data
module.exports = mongoose.model('User', userSchema);