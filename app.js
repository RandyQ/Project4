const express = require('express');
const path = require('path');

// Require Passport
const passport = require('passport');
// Require the database
require('./models/db.js');
// Require the strategy config
require('./config/passport');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set up sessions
const creds = require('./credentials');
const session = require('express-session');
app.use(session(creds.session));

// Handle form submissions
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Set port app will run on
app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public')));

// Initialize Passport 
app.use(passport.initialize());

// Require controllers
const main = require('./controllers/main');
const auth = require('./controllers/authentication');

// Flash scope middleware
app.use((req, res, next) => {
	res.locals.flash = req.session.flash;
	delete req.session.flash;
	next();
});

// Middleware function to restrict users from pages unless authenticated
function isAuthenticated(req, res, next) {
	if (req.session.authenticated === undefined) {
		req.session.authenticated = false;
		res.locals.auth = req.session.authenticated;
	}
	if (req.session.authenticated) {
		return next();
	} else {
		res.redirect('/login');
	}
};

// Home
app.get('/', isAuthenticated, main.home);

// Add new entry page
app.get('/add', isAuthenticated, main.addEntry);
app.post('/add', isAuthenticated, main.postEntry);

// View all entries page with edit and delete routes
app.get('/viewentries', isAuthenticated, main.viewEntries);
app.get('/edit', isAuthenticated, main.editEntry);
app.get('/delete', isAuthenticated, main.deleteEntry);

// Weight loss function routes
app.get('/functions', isAuthenticated, main.functions);
app.post('/calculateWeightLoss', isAuthenticated, main.calculateWeightLoss);
app.post('/calculateBMI', isAuthenticated, main.calculateBMI);

// Login and Register routes
app.get('/register', auth.registerPage);
app.get('/login', auth.loginPage);
app.post('/register', auth.register);
app.post('/login', auth.login);
app.get('/logout', auth.logout);

// 404 catch-all handler (middleware)
app.use(function (req, res, next) {
	res.status(404);
	res.render('404');
});

// 500 error handler (middleware)
app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function () {
	console.log('Express started on http://localhost:' +
		app.get('port') + '; press Ctrl-C to terminate.');
});
