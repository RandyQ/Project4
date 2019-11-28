const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

// Registers a new user and puts their info in the database
const register = function (req, res) {
    if (!req.body.name || !req.body.email || !req.body.password) {
        req.session.flash = {
            message: "All fields required"
        };
        return res.redirect(303, '/register');
    }
    // If passwords do not match
    if (req.body.password !== req.body.confirmPassword) {
        req.session.flash = {
            message: "Password entries do NOT match"
        };
        return res.redirect(303, '/register');
    }
    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    // Hashes and salts password
    user.setPassword(req.body.password);
    // Save to db
    user.save((err) => {
        if (err) {
            res.status(404).send(err); 
        } else {
            req.session.flash = {
                message: "You have been registered.  Try logging in now."
            };
            res.redirect('/login');
        }
    });
};

// Checks the input from the login and autheticates
const login = function (req, res) {
    if (!req.body.email || !req.body.password) {
        req.session.flash = {
            message: "All fields required."
        };
        return res.redirect(303, '/login');
    }
    // Using passport, ensure password and username match
    passport.authenticate('local', (err, user, info) => {
        let token;
        if (err) {
            return res.status(404); 
        } 
        if (user) {
            req.session.authenticated = true;
            req.session.user = user;
            res.redirect('/');
        } else {
            req.session.flash = {
                message: info.message
            };
            res.redirect(303, '/login');
        }
    }) (req, res);
};

// New user registration page
const registerPage = function (req, res) {
    res.render('registration', {
        title: "Registration"
    });
};

// Login page for authentication
const loginPage = function (req, res) {
    res.render('login', {
        title: "Login"
    });
};

const logout = function (req, res) {
    req.session.authenticated = false;
    req.session.flash = {
        message: "Log out successful"
    };
    res.redirect(303, '/login');
}

module.exports = {
    register,
    login,
    registerPage,
    loginPage,
    logout
};