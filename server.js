var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var _ = require('lodash');
var middleware = require('./app/middleware');
var controllers = require('./app/controllers');
var settings = require('./config/settings');

var app = express();
var router = express.Router();
var insecurePaths = ['/', '/users', '/auth/authenticate'];

// open mongodb connection
mongoose.connect('mongodb://' + settings.mongodb.host + '/' + settings.mongodb.database);

// define routes
// ensure that all are secure where necessary
router.all('*', function (req, res, next) {
	if(_.contains(insecurePaths, req.path)) return middleware.auth.verify(req, res, next, false);
	return middleware.auth.verify(req, res, next);
});

router.post('/auth/authenticate', middleware.auth.authenticate, controllers.auth.authenticate);
router.post('/auth/reset', middleware.auth.authorize(['ADMINISTRATOR']), controllers.auth.reset);

router.post('/users', controllers.users.create);
router.get('/users/:username', middleware.auth.authorize(['ADMINISTRATOR', 'MANAGER', 'OWNER']), controllers.users.retrieve);
router.put('/users/:username', middleware.auth.authorize(['ADMINISTRATOR', 'MANAGER', 'OWNER']), controllers.users.update);
router.delete('/users/:username', middleware.auth.authorize(['ADMINISTRATOR', 'MANAGER']), controllers.users.remove);

// configure app
app.use(bodyParser.json());
app.use('/api/v1', router);

app.listen(settings.port, settings.ipaddr, function() {
    console.log('Node server started on %s:%d ...', settings.ipaddr, settings.port);
});