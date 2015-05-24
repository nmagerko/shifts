var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var middleware = require('./app/middleware');
var controllers = require('./app/controllers');
var settings = require('./config/settings');

var app = express();
var router = express.Router();

// open mongodb connection
mongoose.connect('mongodb://' + settings.mongodb.host + '/' + settings.mongodb.database);

// define routes
router.post('/auth/authenticate', middleware.auth.authenticate, controllers.auth.authenticate);
router.get('/auth/test', middleware.auth.verify);

router.post('/users', controllers.users.create);
router.get('/users/:username', controllers.users.retrieve);
router.put('/users/:username', controllers.users.update);
router.delete('/users/:username', controllers.users.remove);

// configure app
app.use(bodyParser.json());
app.use('/api/v1', router);

app.listen(settings.port, settings.ipaddr, function() {
    console.log('Node server started on %s:%d ...', settings.ipaddr, settings.port);
});