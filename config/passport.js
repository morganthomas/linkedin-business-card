var passport = require('passport');
var LinkedInStrategy = require('passport-linkedin').Strategy;

var hostname = require('./hostname.js');

var LINKEDIN_API_KEY = '782fe19gudzl1u';
var LINKEDIN_API_SECRET = 'lVQdRR0H4u71OBhf';

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

passport.use(new LinkedInStrategy({
		consumerKey: LINKEDIN_API_KEY,
		consumerSecret: LINKEDIN_API_SECRET,
		callbackURL: 'http://' + hostname.HOSTNAME + '/auth/callback',
		profileFields: ['id', 'formatted-name', 'headline', 'location', 'specialties',
			'positions', 'picture-url', 'public-profile-url']
	},
	function(token, tokenSecret, profile, done) {
		process.nextTick(function() {
			done(null, profile);
		});
	}
));

var ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

module.exports = {
  ensureAuthenticated: ensureAuthenticated
};
