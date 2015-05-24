var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('jwt-simple');
var controllers = require('./app/controllers');
var settings = require('./config/settings');

var app = express();
var router = express.Router();

// open mongodb connection
mongoose.connect('mongodb://' + settings.mongodb.host + '/' + settings.mongodb.database);

// initialize authorization
var LocalStrategy = require('passport-local').Strategy;
var JWTStrategy = require('passport-jwt').Strategy;
var User = require('./app/models').User;

passport.use(new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err)
      	return done(err);
      if (!user)
        return done(null, false, { message: 'Invalid username.' });
      
      if (!user.passwordValidFor(password))
        return done(null, false, { message: 'Invalid password.' });
      
      return done(null, user);
    });
  }
));

passport.use(new JWTStrategy(settings.passport.jwt, function(payload, done){
	// we expect the subject to be the user's username
	User.findOne({ username: payload.sub }, function(err, user){
		if(err)
			return done(err, false);
		if(user)
			done(null, user);
		else
			done(null, false);
	});
}));

// define routes
router.post('/auth/validate', passport.authenticate('local', {session: false}), function(req, res, next) {
	// just to get the endpoint working
	res.status(200).json(jwt.encode({ sub: req.username }, settings.passport.jwt.secretOrKey ));
});

router.post('/users', controllers.users.create);
router.get('/users/:username', controllers.users.retrieve);
router.put('/users/:username', controllers.users.update);
router.delete('/users/:username', controllers.users.remove);

// configure app
app.use(bodyParser.json());
app.use(passport.initialize());
app.use('/api/v1', router);

app.listen(settings.port, settings.ipaddr, function() {
    console.log('Node server started on %s:%d ...', settings.ipaddr, settings.port);
});