const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//vi får access til schema property af mongoose module

//vi laver ny instans af Schema for at sætte datatype for hver data
const accountSchema = new Schema({
    fullname: {
        type: String 
    },
    email: {
        type: String
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    },
    password: {
        type: String
    }
});

module.exports = mongoose.model('Account', accountSchema) //vi kan blot skrive accountSchema, da vi allerede
//har erklæret denne som en new Schema