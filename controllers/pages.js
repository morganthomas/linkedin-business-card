var pageController = {
	index: function(req, res) {
		if (req.isAuthenticated()) {
			res.redirect('/me');
		} else {
			res.redirect('/login');
		}
	},

	login: function(req, res) {
		res.render('login');
	},

	me: function(req, res) {
		res.send(req.user);
	}
};

module.exports = pageController;
