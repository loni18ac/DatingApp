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

//match-funktion: lav likes og matches attributer som tomme arrays til user klassen. Sammenlign to brugeres attributter og tilføj disse til hinandens arrays

//put alle funktioner der taler med klient og backend i controller mappen. Model-mappen taler sammen med databasen som et fjerde led