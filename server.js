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
const Keys = require('./database/keys');
//const passport = require('passport');
/*const cookieParser = require('cookie-parser');
const session = require('express-session');*/
//vi loader express session module med require og assigner den til session

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

app.get('/', (req,res) => {
    res.render('home');
});
app.get('/createAccount', (req,res) => {
    res.render('createAccount', {
        title: 'Contact'
    });
});
// Load models
//brugeren er logget ind så længe sessionen varer vba. cookie id
/*app.use(cookieParser);
app.use(session({
   secret: 'mySecret',
   resave: true,
   saveUninitialized: true 
}));*/
/*app.use(passport.initialize());
app.use(passport.session());

require('./Server/Controllers/passport/local');*/
//const flash = require('connect-flash');
//er brugerens login oplysninger korrekte?


const Account = require('./Server/Models/account.js')
const User = require('./Server/Models/User.js');
//referer til Account collection, altså der hvor vi sætter datatypen



/*var router = require('./Routes/router');

app.use('/routes/router.js', router);*/

/*app.use(flash());
app.use((req,res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
})*/
//vi laver ny success message for local variable success msg. Så hvis successfuld login = success_msg
//vi bruger flash method øverst og har nu stored disse messages i variablen flash

//vi sætter express static folder for at serve js og css files
//app.use(express.static('public'));
//vi laver user til et globalt objekt, så det kan bruges af alle funtioner
/*app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});
*/






app.post('/createAccountHere', (req,res) => {
    console.log(req.body); //body/formen er objektet, som vi får ind. Vi skal installere body.parser, for at få det som JSON format
    const newUser = {
        fullname: req.body.fullname,
        email: req.body.email,
        password:req.body.password
    }
    new User(newUser).save((err, user) => {
        if (err) {
            throw err;
        }
        if (user) {
            let success = [];
            success.push({text: 'You are logged in'});
            res.render('myAccount', {
                title: 'My Account',
                success: success
            });
        }
    })
});
//lav til JSON fil
/*app.post('/login', passport.authenticate('local', {
    successRedirect:'/myAccount',
    failurRedirect: '/loginErrors'
}));*/
app.get('/loginErrors', (req,res) => {
    let errors = [];
    errors.push({text:'User not found or password/email incorrect'});
    res.render('main', {
        errors:errors
    })
})

app.get('/myAccount', (req, res) => {
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

app.get('/logout', (req, res) => {
    User.findById({_id:req.user._id})
    .them((user) => {
        user.online = false;
        user.save((err, user) => {
            if (err) {
                throw err;
            }
            if (user) {
                req.logout();
                res.redirect('/');
            }       
        })
    })
    req.logout();
    res.redirect('/');
})
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