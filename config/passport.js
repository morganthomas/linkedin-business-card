var passport = require('passport');
var LinkedInStrategy = require('passport-linkedin').Strategy;
var User = require('../models/user');

var hostname = require('./hostname.js');

var LINKEDIN_API_KEY = '782fe19gudzl1u';
var LINKEDIN_API_SECRET = 'lVQdRR0H4u71OBhf';

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user){
    done(err, user);
  });
});

passport.use(new LinkedInStrategy({
		consumerKey: LINKEDIN_API_KEY,
		consumerSecret: LINKEDIN_API_SECRET,
		callbackURL: 'http://' + hostname.HOSTNAME + '/auth/callback',
		profileFields: ['id', 'formatted-name', 'headline', 'location', 'specialties',
			'positions', 'picture-url', 'public-profile-url']
	},

  // Verify function: finds the User object for the given user, creating an account if
  // necessary, and calls the callback with the User object.
	function(token, tokenSecret, profile, done) {
    User.findOne({ linkedInId: profile.id }, function(err, user) {
      if (err) { return done(err, null); }
      if (user) { return done(null, user); }

      // User doesn't exist, so create them.
      var positions = profile._json.positions._total === 0 ? [] :
        profile._json.positions.values.map(function(position) {
          return {
            title: position.title,
            company: position.company.name
          };
        });

      user = new User({
        linkedInId: profile.id,
        name: profile._json.formattedName,
        headline: profile._json.headline || '',
        location: profile._json.location ? profile._json.location.name : '',
        specialties: profile._json.specialties || '',
        positions: positions,
        pictureUrl: profile._json.pictureUrl || '',
        linkedInUrl: profile._json.publicProfileUrl
      });

      user.save(function(err) {
        if (err) { return done(err, null); }

        return done(null, user);
      });
    });
	}
));

var ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}

module.exports = {
  ensureAuthenticated: ensureAuthenticated
};
