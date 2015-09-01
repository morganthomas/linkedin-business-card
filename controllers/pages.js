var User = require('../models/user.js');

var pageController = {
	login: function(req, res) {
		res.render('login', { me: req.user || null });
	},

	me: function(req, res) {
		if (req.isAuthenticated()) {
			res.redirect('/view/' + req.user.id);
		} else {
			res.redirect('/login');
		}
	},

	view: function(req, res) {
		var show = function(user) {
			res.render('view', { me: JSON.stringify(req.user), user: JSON.stringify(user) });
		}

		if (req.user && req.params.userId === req.user.id) {
			show(req.user);
		} else {
			 User.findById(req.params.userId, function(err, user) {
				if (err) { return res.send("Database error: ", err); }
				if (!user) { return res.send("User not found!"); }
				show(user);
			});
		}
	}
};

module.exports = pageController;
