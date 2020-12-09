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
    }, //Standard-status sættes til at brugeren ikke er online.  
    //Når han logger ind, ændres status i controlleren til online ved: user.online = true. 
    password: {
        type: String
    },
    matches: [{
        match: {
            type: Schema.Types.ObjectId, //path til at populate
            ref: 'User' //det indlejrede array connectes med denne User model
    },
        matchedUser: {
            type: Boolean,
            default: false //som default har den likede bruger, ikke liket tilbage
        }                  //Ændres til true, når den likede bruger liker tilbage
     }]
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