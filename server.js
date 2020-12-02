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
const passportLocalMongoose = require("passport-local-mongoose");
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
const Match = require('./Server/Models/match');
//referer til Account collection, altså der hvor vi sætter datatypen
const flash = require('connect-flash');

const bcrypt = require('bcryptjs');

const LocalStrategy = require('./Server/Controllers/passport/local');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true})) //vi vil kun have form data


//vi tager altså værdien i keys-MongoDB, som er linket til MongoDB. 
//hvis det virker, udskrives 'Connected'
mongoose.connect(Keys.MongoDB, { useUnifiedTopology: true }, { useNewUrlParser: true }).then(() => {
    console.log('Connected bla bla');
}).catch((err) => {
    console.log(err);
});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
//mongoose.connect("mongodb://localhost/auth_demo_app");
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
/*passport.use(new LocalStrategy(passport.authenticate()));
passport.serializeUser(passport.serializeUser());
passport.deserializeUser(passport.deserializeUser());*/
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



app.get('/', ensureGuest,(req,res) => {
    res.render('home');
});
app.get('/createAccount', ensureGuest, (req,res) => {
    res.render('createAccount', {
        title: 'Sign up'
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
            res.render('myAccount', {
                title: 'Sign in',
                success: success
            });
        }
    })
});
//lav til JSON fil

app.post('/login', passport.authenticate('passport-local', {
    successRedirect:'/myAccount',
    failureRedirect: '/loginErrors'
}));
app.get('/loginErrors', (req,res) => {
    let errors = [];
    errors.push({text:'User not found or password/email incorrect'});
    res.render('myAccount', {
        errors:errors
    });
});

app.get('/myAccount', (req, res) => {
    User.findOne({_id:req.user.id})
    .then((user) => {
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
//Get route to match
app.get('/likeUser/:id', (req,res) => {
    const newMatch = {
        sender: req.user_id,
        receiver: req.params.id,
        senderSent: true
    }
    new Match(newMatch).save((err, match) => {
        if (err) {
            throw err;
        }
        if (match) {
        res.redirect(`/userProfile/${req.params.id}`);
        }
    })
})

//Get route til delete match
app.get('/deleteMatch/:id', requireLogin, (req, res) => {
    Match.deleteOne({receiver:req.params.id,sender:req.user._id})
    .then(() => {
        res.redirect(`/userProfile/${req.params.id}`);
    });
});
app.post('/updateProfile', (req, res) => {
    User.findById({_id:req.user._id})
    .then((user) => {
        user.about = req.body.about;
        user.save(() => {
            res.redirect('/myAccount');
        })
    });
})
app.get('/deleteAccount', (req,res) => {
    User.deleteOne({_id:req.user._id})
    .then(() => {
        res.render('accountDeleted', {
            title: 'Deleted'
        });
    });
})
app.get('/potentialPartners', (req,res) => {
    User.find({},)
    .then((potentialPartners) => {
        res.render('potentialPartners', {
            title: 'PotentialPartners',
            potentialPartners:potentialPartners
        })
    }).catch((err) => {
        console.log(err);
    });
});
app.get('/userProfile/:id', (req,res) => {
    User.findById({_id:req.params.id})
    .then((user) => {
        res.render(`/userProfile/${req.params.id}`, {
            randomUser: user
        })
    })
});


app.get('/logout', requireLogin, (req, res) => {
    User.findById({_id:req.user.id})
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