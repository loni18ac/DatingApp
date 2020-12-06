const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

    fistname: {
        type: String
    },
    lastname: {
        type: String
    },
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
    about: {
        type: String,
        default: 'I am looking for love'
    },

    online: {
        type: Boolean,
        default: false
    }, //vi sætter standard statusen til at brugeren ikke er online. 
    //den skal sættes til true, når brugeren er online.
    password: {
        type: String
    },/*
    matches: [{
        match: {
            type: Schema.Types.ObjectId,
            ref: 'User'
    },
        matchedUser: {
            type: Boolean,
            default: true
        }
     }]*/
});
/*

module.exports.getUserById = function(id,callback)
{
  User.findById(id,callback);
}*/
module.exports = mongoose.model('User', userSchema);
//userSchema har allerede nyt skema indkodet

/*class User {
    constructor(name, age, location) {
    this.name = name;
    this.age = age;
    this.location = location;
}
}
module.exports=User

//Moderklassen User har attributterne navn, alder og lokation*/

//test