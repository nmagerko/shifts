var settings = require('../../config/settings');
var _ = require('lodash');
var models = require('../models');
var errors = require('../errors');
var jwt = require('jsonwebtoken');

module.exports = {
	authenticate : function(req, res, next){
		requiredParams = ['username', 'password'];
		params = _.pick(req.body, requiredParams);

		models.User.findOne({username: params.username }, function(err, user){
			if (err) 
				return res.status(400).json(errors.utils.throwRawError(err.name, err.message, errors.utils.formatRawError(err)));
			if (_.isEmpty(user)) 
				return res.status(404).json(errors.UserNotFoundError.throw({
                	username: "Could not find user identified by " + username
            	}));
			if (!user.passwordValidFor(params.password))
				return res.status(401).json(errors.AuthorizationError.throw({
					password: "Invalid password"
				}));

			req.user = user;
			return next();
		});
	},
	
	verify: function(req, res, next){
		token = req.headers.authorization;
		if(!token)
			return res.status(401).json(errors.AuthorizationError.throw({
				message: "Missing authorization header"
			}));

		jwt.verify(token, settings.secret, settings.jwt, function(err, decoded){
			if(err)
				return res.status(400).json(errors.utils.throwRawError(err.message, err.name, errors.utils.formatRawError(err)));

			models.User.findOne({ username: decoded.sub }, function(err, user){
				if (err) 
					return res.status(400).json(errors.utils.throwRawError(err.name, err.message, errors.utils.formatRawError(err)));

				req.user = user;
				return next();
			});
		});		
	}
}