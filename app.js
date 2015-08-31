var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var passport = require('passport');
var LinkedInStrategy = require('passport-linkedin').Strategy;

var indexController = require('./controllers/index.js');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(methodOverride());
app.use(session({ secret: 'very secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

var PORT = 3002;
var MY_HOSTNAME = 'localhost:' + PORT;
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
		callbackURL: 'http://' + MY_HOSTNAME + '/auth/callback',
		profileFields: ['id', 'formatted-name', 'headline', 'location', 'specialties',
			'positions', 'picture-url', 'public-profile-url']
	},
	function(token, tokenSecret, profile, done) {
		process.nextTick(function() {
			done(null, profile);
		});
	}
));

app.get('/', indexController.index);

app.get('/auth',
	passport.authenticate('linkedin'),
	function(req, res) { });

app.get('/auth/callback',
  passport.authenticate('linkedin', { failureRedirect: '/' }),
	function(req,res) {
		res.redirect('/self');
	});

app.get('/self', function(req, res) {
	res.send(req.user);
});

var server = app.listen(PORT, function() {
	console.log('Express server listening on port ' + server.address().port);
});

var ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
