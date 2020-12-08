//inside src/pokemon.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userTestSchema = new Schema({
   fullname: {
    type: String
   },
})
//Pokemon constant represents the entire collection of data
module.exports = mongoose.model('UserTest', userTestSchema);