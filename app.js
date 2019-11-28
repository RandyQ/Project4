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

// Custom middleware for authentication and authorization
const mware = require('./lib/middleware');

// Home
app.get('/', mware.isAuthenticated, main.home);

// Add new entry page
app.get('/add', mware.isAuthenticated, main.addEntry);
app.post('/add', mware.isAuthenticated, main.postEntry);

// View all entries page with edit and delete routes
app.get('/viewentries', mware.isAuthenticated, main.viewEntries);
app.get('/edit', mware.isAuthenticated, main.editEntry);
app.get('/delete', mware.requireAdmin, main.deleteEntry);

// Weight loss function routes
app.get('/functions', mware.isAuthenticated, main.functions);
app.post('/calculateWeightLoss', mware.isAuthenticated, main.calculateWeightLoss);
app.post('/calculateBMI', mware.isAuthenticated, main.calculateBMI);

// Login, logout, and Register routes
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
