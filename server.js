//kilde: https://www.udemy.com/course/build-online-dating-website-from-scratch-till-deployment/learn/lecture/14191570#overview
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

//const passport = require('passport');

const session = require('express-session');
//vi loader express session module med require og assigner den til session
// Load models
const User = require('./Server/Models/User.js');
//const Match = require('./Server/Models/match');
//referer til Account collection, altså der hvor vi sætter datatypen
//const flash = require('connect-flash');
//flash til senere brug
const SESS_NAME = 'DatingCookie'
const SESS_LIFETIME = 1000 * 60 * 60 * 2
const bcrypt = require('bcryptjs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true})) //vi vil kun have form data


//vi tager altså værdien i keys-MongoDB, som er linket til MongoDB. 
//hvis det virker, udskrives 'Connected'
mongoose.connect(Keys.MongoDB, { useUnifiedTopology: true }, { useNewUrlParser: true }).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
})
//vi sætter op view engine med to argumenter: navnet og det view den skal require
app.engine('handlebars', exphbs({handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set('view engine', 'handlebars');


//brugeren er logget ind så længe sessionen varer vba. cookie id
//app.use(cookieParser());
app.use(session({
    name: SESS_NAME,
    secret: 'mySecret',
    resave: false, //resaves session after every change: https://morioh.com/p/33f73e7c1040
    saveUninitialized: false, //saves uninitialized objects in session, when they are assigned to the session
    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true
    }
}));
//Til senere brug (local strategy, passport):
/*app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req,res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})*/
//vi laver ny success message for local variable success msg. Så hvis successfuld login = success_msg
//vi bruger flash method øverst og har nu stored disse messages i variablen flash

//vi laver user til et globalt objekt, så det kan bruges af alle funtioner
//vi har dermed access til user objektet fra alle templates
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

require('./Server/Controllers/passport/local');


app.get('/', ensureGuest,(req,res) => {
    res.render('home');
});
app.get('/createAccount', ensureGuest, (req,res) => {
    res.render('createAccount', {
        title: 'Sign up'
    });
});

app.post('/createdSuccessfully', (req,res) => {
    console.log(req.body);  //body er objektet, som vi får ind. 
                            //Vi skal installere body.parser, for at få det som JSON format
    var salt = bcrypt.genSaltSync(10); //safety first - forebygger attack
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
            let success = []; //hermed kan vi injecte data i .hbs-{{each}}
            success.push({text: 'Account was created successfully!'});
            res.render('home', {
                success: success
            });
        }
    })
});
//Kunne være blevet lavet til løs JSON fil

app.get('/myAccount',  (req, res) => {
    User.findOne({email: 'testPerson@mail.dk'})
    .then((user) => {
        if (user.online != true) {
            return res.status(401).send();
        }else{
            //user.online = true;
                    res.render('myAccount', {
                    user:user
            });
    }});
});

app.post('/login', (req, res) => {
    const { email, password } = req.body
    User.findOne({email: 'testPerson@mail.dk'})
    .then((user) => {
        if (user) {
            user.email === email && user.password === password;    
            user.online = true;     //vi ændrer online boolean til true
            req.session.user = user //Cookie ID: bruger forbliver logget ind   
            console.log(user)     //i løbet af sessionens maxAge = 2 timer 
            user.save((err, user) => {
                if (err) {
                    throw err;
                } else {
                    res.render('myAccount', {
                    user:user
                    });
                }});
        }else{
            res.redirect('/createAccount')
        }
    });
});                                    


//Get route to match
app.get('/likeUser/:id', (req,res) => {
    //User.findOne({email:req.params.email})
    User.findOne({email: 'isla@gmail.com'}) //modtager account
            .then((user) => {
                let newLikeSent = {
                    match: 'thomas@mail.dk'   //sender account, matchedUser: false
                }
                user.matches.push(newLikeSent)
                //ikke liked back endnu
                user.save((err, user) => {
                    if (err) {
                        throw err;
                    }
                    if (user) {
                        res.render('matches/likeUser', {
                            title: 'Like',
                            newLike: user
                        })
                    }
                });
            });
});   
app.get('/showLike/:id', (req,res) => {
    User.findOne({_id:req.params.id})
    .then((showLike) => {
        res.render('match/showLike', {
            newFriend:showLike
        })
    })
});
//Like back -> MATCH route
app.get('/likeBack/:id', (req,res) => { //specificerer User med generisk værdi, ID
    User.findById({_id:req.user._id}) //finder den aktuelle bruger
    .populate('matches.match') //vi populater denne brugers match array, for at få adgang til match objektets ID
    .then((user) => { //den aktuelle bruger
        user.matches.filter((match) => { //vi finder ét match i DB i User's match array
            if (match._id = req.params._id) { //hvis dette match's ID = ID i URL
                match.matchedUser = true; //så finder vi modtagerens match-array og laver match boolean om til true
                user.save() //vi gemmer brugeren med save() metoden
                .then(() => { //callback funktion sender teksten = MATCH
                    res.send('You hve a new match! This user liked you too')
                })
            }else {
                console.log('Unable to like user')
            }
        })
    }).catch((err) => { //vi fanger error
        console.log(err);
    })
})

//My matches
app.get('/myMatches', (req,res) => {
    User.findById({_id:req.user._id})
    .populate({
        path: "matches", //populate matches
        populate: {
            path: "match" //i matches array, populate match
        }
    })
    .then((user) => {
        console.log('vi er nået til myMatches')
        res.render('matches/myMatches', {
            title: 'Matches',
            userMatches: user
        })
    })
});
    

//Get route til delete match
app.get('/deleteMatch/:id', requireLogin, (req, res) => {
    Match.deleteOne({receiver:req.params.id,sender:req.user._id})
    .then(() => {
        res.redirect(`/userProfile/${req.params.id}`);
    });
});
app.post('/updateProfile', (req, res) => {
    User.findOne({email: 'yr@mail.dk'})
    .then((user) => {
        if (user.online != true) {
        return res.status(404).send();
     }else{
        user.about = req.body.about;
        user.save(() => {
            res.json("Your description has been updated, please go back and refresh the page");
     })
    }});
});
app.get('/deleteAccount', (req,res) => {
    User.deleteOne({email: 'd@mail.dk'})
    .then(() => {
        res.render('accountDeleted');
    }).catch((err) => {
        console.log(err);
    });
});

// FJERN SENERE!
app.get('/testSession', (req, res) => {
    console.log("req.session.user")
    console.log(req.session.user)
    console.log("req.session.user")
})

app.get('/potentialMatches', (req,res) => {
    User.find({},)
    .then((potentialMatches) => {
       /* if (user.online != true) {
            return res.status(404).send() //udkommenteret da err=user kan ikke læses
        }else{*/
        res.render('potentialMatches', {
            title: 'PotentialMatches',
            potentialMatches:potentialMatches
        });
     }).catch((err) => {
        console.log(err);
    });
});

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
//like brugere route
/*
app.get('/likeUser/:id', requireLogin, (req,res) => {
    User.findById({})
} )*/
app.get('/profile', (req,res) => {
        res.render('profile')

});


app.get('/logout', (req, res) => {
    /*const { email, password } = req.body
    console.log(email)
    console.log(password)*/
    User.findOne({email: 'yr@mail.dk'})
    .then((user) => {
            user.online = false;
            req.session.destroy();
            console.log(user)
        user.save((err, user) => {
            if (err) {
                throw err;
            }
            if (user) {
                req.logout();
                res.render('logout');
            }       
        });
    });
});
app.listen(port, () => {
 console.log(`Server running on http://localhost:${port}`)});

