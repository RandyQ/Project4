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

// Middleware function to check if a user is admin
function requireAdmin(req, res, next) {
    if ((req.session.user && req.session.user.admin) || (req.session.user.name === req.query.name)) {
        next();
    } else {
        req.session.flash = {
            message: 'You cannot delete records other than your own...  ONLY ADMINS have those permissions'
        }
        res.redirect(303, '/viewentries');
    }
}

module.exports = {
    requireAdmin,
    isAuthenticated
}