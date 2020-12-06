const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../../Models/User');
const bcrypt = require('bcryptjs');

passport.serializeUser((user, done) => {
    done(null,user.id);
});
//user forbliver logget ind i løbet af sessionen. User ID bruges i browser
//finder user i current user og tager id af user objekt

passport.deserializeUser((id, done) => {
    User.findById(id,(err,user) => {
        done(err,user);
    });
});
//vi bruger vores User klasse/model. hvis ingen err, returneres user objekt
//finder user id og genererer cookie id


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => {
    User.findOne({email:email})
    .then((user) => {
        if (!user) {
            return done(null,false);
        }
        bcrypt.compare(password, user.password, function (err, isMatch) {
            if (err) {
         throw err;
        }
        if (isMatch) {
            return done(null, user);
        }else{
            return done(null, false)
        } 
        }).catch((err) => {
            console.log(err);
        })
    })
 }));      