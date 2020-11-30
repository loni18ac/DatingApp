const express = require('express');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
//Vi importerer express
const app = express();
//server sættes til at kalde på express
const port = 7000;
//vi vælger port 4000, vi kunne også vælge fx 5000
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

const bodyParser = require('body-parser');
//use bodyparser as middleware. Vi bruger to properties af body parser: URL encoded og json method
const mongoose = require('mongoose');
//vi loader mongoose module vba. require method og vi assigner den som et variabel kaldet mongoose

//vi loader databasen
const Keys = require('./database/keys');

//vi loader helpers (de to funktioner) og hvis user ikke er logget ind, viser vi ikke profilen
const {requireLogin, ensureGuest} = require('./helpers/auth');

const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
//vi loader express session module med require og assigner den til session
// Load models
const Account = require('./Server/Models/account')
const User = require('./Server/Models/User.js');
//referer til Account collection, altså der hvor vi sætter datatypen
const flash = require('connect-flash');

const bcrypt = require('bcryptjs');

app.use(bodyParser.urlencoded({extended:false})) //vi vil kun have form data
app.use(bodyParser.json());

//vi tager altså værdien i keys-MongoDB, som er linket til MongoDB. 
//hvis det virker, udskrives 'Connected'
mongoose.connect(Keys.MongoDB, { useUnifiedTopology: true }).then(() => {
    console.log('Connected bla bla');
}).catch((err) => {
    console.log(err);
})
//vi sætter op view engine med to argumenter: navnet og det view den skal require
app.engine('handlebars', exphbs({handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set('view engine', 'handlebars');


//brugeren er logget ind så længe sessionen varer vba. cookie id
app.use(cookieParser());
app.use(session({
   secret: 'mySecret',
   resave: true,
   saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req,res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})
//vi laver ny success message for local variable success msg. Så hvis successfuld login = success_msg
//vi bruger flash method øverst og har nu stored disse messages i variablen flash
//er brugerens login oplysninger korrekte?

//vi sætter express static folder for at serve js og css files
app.use(express.static('public'));
//vi laver user til et globalt objekt, så det kan bruges af alle funtioner
//access control: brugeren skal logge ind for at kunne logge ud.
//vi har dermed access til user objektet fra alle templates
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

/*var router = require('./Routes/router');

app.use('/routes/router.js', router);*/


require('./Server/Controllers/passport/local');


app.get('/', ensureGuest,(req,res) => {
    res.render('home');
});
app.get('/createAccount', ensureGuest, (req,res) => {
    res.render('createAccount', {
        title: 'Contact'
    });
});

app.post('/createdSuccessfully', (req,res) => {
    console.log(req.body); //body/formen er objektet, som vi får ind. Vi skal installere body.parser, for at få det som JSON format
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync("B4c0/\/", salt);
    const newUser = {
        fullname: req.body.fullname,
        age: req.body.age,
        gender: req.body.gender,
        email: req.body.email,
        password: hash
    };
    new User(newUser).save((err, user) => {
        if (err) {
            throw err;
        }
        if (user) {
            let success = [];
            success.push({text: 'You are logged in'});
            res.render('home', {
                title: 'Sign in',
                success: success
            });
        }
    })
});
//lav til JSON fil

app.post('/login', passport.authenticate('local', {
    successRedirect:'/myAccount',
    failurRedirect: '/loginErrors'
}));
app.get('/loginErrors', (req,res) => {
    let errors = [];
    errors.push({text:'User not found or password/email incorrect'});
    res.render('home', {
        errors:errors
    });
});

app.get('/myAccount', requireLogin, (req, res) => {
    User.findById({_id:req.user._id}).then((user) => {
        if (user) {
            user.online = true;
            user.save((err, user) => {
                if (err) {
                    throw err;
                }else {
                    res.render('myAccount', {
                    user:user
            });
        }
    });
}})});

app.post('/updateProfile', (req, res) => {
    User.findById({_id:req.user._id})
    .then((user) => {
        user.about = req.body.about;
        user.save(() => {
            res.redirect('/myAccount');
        })
    });
})

app.get('/logout', (req, res) => {
    User.findById({_id:req.user._id})
    .then((user) => {
        user.online = false;
        user.save((err, user) => {
            if (err) {
                throw err;
            }
            if (user) {
                req.logout();
                res.redirect('/');
            }       
        });
    });
    req.logout();
    res.redirect('/');
});
app.listen(port, () => {
 console.log(`Server running on http://localhost:${port}`)});

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