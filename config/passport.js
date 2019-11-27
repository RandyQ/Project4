const passport = require('passport');
// Using local strategy (own database)
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

// Retrieve user data from database to check user input of email and password
passport.use(new LocalStrategy({
    usernameField: 'email'
},
    (username, password, done) => {
        User.findOne({ email: username }, (err, user) => {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            } 
            // Call method in user schema that checks the hashed and salted password for authenticity 
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
            return done(null, user);
        });
    }
));