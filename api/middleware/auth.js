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
                	username: "Could not find user identified by " + params.username
            	}));
			if (!user.passwordValidFor(params.password))
				return res.status(401).json(errors.AuthenticationError.throw({
					password: "Invalid password"
				}));

			req.user = user;
			return next();
		});
	},
	
	verify: function(req, res, next, required){
		token = req.headers.authorization;
		if(!token) {
			if(!required) 
				return next();
			return res.status(401).json(errors.AuthenticationError.throw({
				message: "Authentication required"
			}));
		}

		jwt.verify(token, settings.secret, settings.jwt, function(err, decoded){
			if(err)
				return res.status(400).json(errors.utils.throwRawError(err.message, err.name, errors.utils.formatRawError(err)));

			models.User.findOne({ username: decoded.sub }, function(err, user){
				if(err) 
					return res.status(400).json(errors.utils.throwRawError(err.name, err.message, errors.utils.formatRawError(err)));
				if(!user.isActive)
					return res.status(403).json(errors.InactiveUserError.throw({
						message: "Your account is inactive. Please contact your manager for assistance."
					}));

				req.user = user;
				return next();
			});
		});		
	},

	authorize: function(roles) {
		return function(req, res, next){
			error = errors.AuthorizationError.throw({
				message: "You are not authorized to access this resource"
			});

			if(_.isEmpty(req.user)) {
				return res.status(401).json(error);
			}
			if(_.contains(roles, req.user.role)){
				req.authorized = true;
				return next();
			} 
			if(_.contains(roles, "OWNER")){
				return next();
			}

			return res.status(401).json(error);
		}
	}
}