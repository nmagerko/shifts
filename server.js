var express       = require('express');
var bodyParser    = require('body-parser');
var mongoose      = require('mongoose');
var controllers   = require('./app/controllers');
var settings      = require('./config/settings');

var app = express();
var router = express.Router();

// define routes
router.post('/users', controllers.users.create);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/v1', router)

mongoose.connect('mongodb://'+ settings.mongodb.host + '/' + settings.mongodb.database);

app.listen(settings.port, settings.ipaddr, function() {
  console.log('Node server started on %s:%d ...', settings.ipaddr, settings.port);
});
