const express = require('express');
const exphbs = require('express-handlebars')
//Vi importerer express
const app = express();
//server sættes til at kalde på express
const port = 5000;
//vi vælger port 4000, vi kunne også vælge fx 5000
const bodyParser = require('body-parser');
//use bodyparser as middleware. Vi bruger to properties af body parser: URL encoded og json method
app.use(bodyParser.urlencoded({extended:false})) //vi vil kun have form data
app.use(bodyParser.json());

//vi sætter op view engine med to argumenter: navnet og det view den skal require
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');


const mongoose = require(mongoose);
// Load models
const Account = require('./Models/account')*/
//referer til Account collection, altså der hvor vi sætter datatypen

//vi loader mongoose module vba. require method og vi assigner den som et variabel kaldet mongoose


/*var router = require('./Routes/router');

app.use('/routes/router.js', router);*/

app.get('/', (req,res) => {
    res.render('home');
});

app.get('/createAccount', (req,res) => {
    res.render('createAccount');
});

//app.use(express.static('public'));
app.post('/createAccountHere', (req,res) => {
    console.log(req.body); //body/formen er objektet, som vi får ind. Vi skal installere body.parser, for at få det som JSON format
});

app.listen(port, () => {
 console.log(`Server running on http://localhost:${port}`)})

/*
/login controller nedenfor
function loginController(req, res) {
    //Normalt vil man kigge om password og brugernavn stemmer, men det springer vi over
    //normalt vil man gemme secret key et andet sted. 
    //Her laves en token, som dør om en time (no access)
    const token = jwt.sign({user}, 'my_secret', { expiresIn: '1h' })
    res.json({
        token: token
    })
    


module.exports = loginController*/
