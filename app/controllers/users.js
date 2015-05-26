var _ = require('lodash');
var models = require('../models');
var errors = require('../errors');

function isOwnerVerified(req, res){
    return (req.authorized || req.user.username === req.params.username)
}

module.exports = {
    create: function(req, res, next) {
        var availableParams = ['username', 'password', 'confirmedPassword', 'firstName', 'lastName']
        if (req.user) {
            if (req.user.role === 'ADMINISTRATOR' || req.user.role === 'MANAGER') availableParams.push('isActive');
        }

        var params = _.pick(req.body, availableParams);
        if (params.password !== params.confirmedPassword) {
            return res.status(400).json(errors.PreSaveValidationError.throw({
                password: "Passwords do not match"
            }));
        }

        var newUser = models.User(params);
        if (req.user && req.user.role === 'ADMINISTRATOR' && req.body.role) newUser.role = req.body.role;
        else newUser.role = 'WORKER';
        newUser.hashPassword();
        return newUser.save(function(err) {
            if (err) return res.status(400).json(errors.utils.throwRawError(err.name, err.message, errors.utils.formatRawError(err)));
            return res.status(200).json(newUser.serialize());
        });
    },
    retrieve: function(req, res, next) {
        if (!isOwnerVerified(req, res))
            return res.status(401).json(errors.AuthorizationError.throw({
                message: "You are not authorized to access this resource"
            }));

        var username = req.params.username;
        models.User.findOne({ username: username }, function(err, user) {
            if (err) return res.status(400).json(errors.utils.throwRawError(err.name, err.message, errors.utils.formatRawError(err)));
            else if (_.isEmpty(user)) return res.status(404).json(errors.UserNotFoundError.throw({
                username: "Could not find user identified by " + username
            }));
            return res.status(200).json(user.serialize());
        });
    },
    update: function(req, res, next) {
        if (!isOwnerVerified(req, res))
            return res.status(401).json(errors.AuthorizationError.throw({
                message: "You are not authorized to access this resource"
            }));

        
        var availableParams = ['firstName', 'lastName']
        if(req.user.role === 'ADMINISTRATOR') availableParams.push('role', 'isActive');
        if(req.user.role === 'MANAGER') availableParams.push('isActive');
        var params = _.pick(req.body, availableParams);

        var username = req.params.username;
        models.User.findOneAndUpdate({ username: username }, params, { new: true }, function(err, user) {
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