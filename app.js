var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var passport = require('passport');
var LinkedInStrategy = require('passport-linkedin').Strategy;

var hostname = require('./config/hostname.js');
var pageController = require('./controllers/pages.js');

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

var passportConfig = require('./config/passport.js');

app.get('/auth',
	passport.authenticate('linkedin'),
	// This won't get called because the linkedin middleware will redirect to the linkedin
	// login page.
	function(req, res) { });

app.get('/auth/callback',
  passport.authenticate('linkedin', { failureRedirect: '/login' }),
	function(req,res) {
		res.redirect('/me');
	});

app.get('/', pageController.index);
app.get('/login', pageController.login);
app.get('/me', passportConfig.ensureAuthenticated, pageController.me);

var server = app.listen(hostname.PORT, function() {
	console.log('Express server listening on port ' + server.address().port);
});
