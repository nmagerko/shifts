var _         = require('lodash');
var models    = require('../models');
var utils     = require('./utils');

module.exports = {
  create: function(req, res, next) {
    var availableParams = ['username', 'email', 'password', 'confirmedPassword',
                           'firstName', 'lastName']
    var params = _.pick(req.body, availableParams);

    if(params.password !== params.confirmedPassword) {
      return res.status(400).send({
        errors: {
          title: 'User validation failed',
          status: 'PreSaveValidationError',
          detail: {
            password: "Passwords do not match"
          }
        }
      });
    }

    var newUser = models.User(params);
    newUser.hashPassword();

    return newUser.save(function(err) {
      if(err) {
        return res.status(400).send({
          errors: {
            title: err.message,
            status: err.name,
            detail: utils.formatErrors(err)
          }
        });
      } else {
        return res.status(200).send(newUser.serialize());
      }
    });
  }
};
