const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const register = function (req, res) {
    if (!req.body.name || !req.body.email || !req.body.password) {
        req.session.flash = {
            message: "All fields required"
        };
        return res.redirect(303, '/register');
    }
    if (req.body.password !== req.body.confirmPassword) {
        req.session.flash = {
            message: "Password entries do NOT match"
        };
        return res.redirect(303, '/register');
    }
    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password);
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

const login = function (req, res) {
    if (!req.body.email || !req.body.password) {
        req.session.flash = {
            message: "All fields required."
        };
        return res.redirect(303, '/login');
    }
    passport.authenticate('local', (err, user, info) => {
        let token;
        if (err) {
            return res.status(404); 
        } 
        if (user) {
            req.session.authenticated = true;
            res.redirect('/');
        } else {
            req.session.flash = {
                message: info.message
            };
            res.redirect(303, '/login');
        }
    }) (req, res);
};

const registerPage = function (req, res) {
    res.render('registration', {
        title: "Registration"
    });
};

const loginPage = function (req, res) {
    res.render('login', {
        title: "Login"
    });
};

module.exports = {
    register,
    login,
    registerPage,
    loginPage
};