var _ = require('lodash');
var models = require('../models');
var errors = require('../errors');
module.exports = {
    create: function(req, res, next) {
        var availableParams = ['username', 'email', 'password', 'confirmedPassword', 'firstName', 'lastName', 'role']
        var params = _.pick(req.body, availableParams);
        if (params.password !== params.confirmedPassword) {
            return res.status(400).json(errors.PreSaveValidationError.throw({
                password: "Passwords do not match"
            }));
        }
        var newUser = models.User(params);
        newUser.hashPassword();
        return newUser.save(function(err) {
            if (err) return res.status(400).json(errors.utils.throwRawError(err.name, err.message, errors.utils.formatRawError(err)));
            return res.status(200).json(newUser.serialize());
        });
    },
    retrieve: function(req, res, next) {
        var username = req.params.username;
        models.User.findOne({
            username: username
        }, function(err, user) {
            if (err) return res.status(400).json(errors.utils.throwRawError(err.name, err.message, errors.utils.formatRawError(err)));
            else if (_.isEmpty(user)) return res.status(404).json(errors.UserNotFoundError.throw({
                username: "Could not find user identified by " + username
            }));
            return res.status(200).json(user.serialize());
        });
    },
    update: function(req, res, next) {
        var username = req.params.username;
        var availableParams = ['email', 'firstName', 'lastName']
        var params = _.pick(req.body, availableParams);
        models.User.findOneAndUpdate({
            username: username
        }, params, {
            new: true,
        }, function(err, user) {
            if (err) return res.status(400).json(errors.utils.throwRawError(err.name, err.message, errors.utils.formatRawError(err)));
            else if (_.isEmpty(user))
                return res.status(404).json(errors.UserNotFoundError.throw({
                        username: "Could not find user identified by " + username
                    }));
            return res.status(200).json(user.serialize());
          });
      },
    remove: function(req, res, next) {
        var username = req.params.username;
        models.User.findOneAndRemove({ username: username }, function(err, user){
          if (err) return res.status(400).json(errors.utils.throwRawError(err.name, err.message, errors.utils.formatRawError(err)));
            else if (_.isEmpty(user))
                return res.status(400).json(errors.UserNotFoundError.throw({
                        username: "Could not find user identified by " + username
                    }));
            return res.status(200).json({});
        })
    }
};