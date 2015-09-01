var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var session = require('express-session');
var mongoose = require('mongoose');

var hostname = require('./config/hostname.js');
var pageController = require('./controllers/pages.js');
var apiController = require('./controllers/api.js');

mongoose.connect('mongodb://' + hostname.DB_HOST + '/linkedInBusinessCard');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
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

app.get('/', pageController.me);
app.get('/login', pageController.login);
app.get('/me', pageController.me);
app.get('/view/:userId', pageController.view);
app.get('/angular-templates/:template', function(req, res) {
	res.render('angular-templates/' + req.params.template);
});
app.put('/api/save', apiController.save);

var server = app.listen(hostname.PORT, function() {
	console.log('Express server listening on port ' + server.address().port);
});
