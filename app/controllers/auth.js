var _ = require('lodash');
var jwt = require('jsonwebtoken');
var models = require('../models');
var errors = require('../errors');
var settings = require('../../config/settings');

module.exports = {
	authenticate: function(req, res, next) {
		return res.status(200).json({
			token: jwt.sign({
				sub: req.user.username,
				isActive: req.user.isActive
			}, settings.secret, settings.jwt)
		});
	},

	reset: function(req, res, next) {
		requiredParams = ['username', 'newPassword', 'confirmedNewPassword']
		var params = _.pick(req.body, requiredParams);

		if (params.newPassword !== params.confirmedNewPassword) {
            return res.status(400).json(errors.PreSaveValidationError.throw({
                password: "Passwords do not match"
            }));
        }

        models.User.findOne({ username: params.username }, function(err, user) {
            if (err) return res.status(400).json(errors.utils.throwRawError(err.name, err.message, errors.utils.formatRawError(err)));
            else if (_.isEmpty(user)) return res.status(404).json(errors.UserNotFoundError.throw({
                username: "Could not find user identified by " + username
            }));

            user.password = params.newPassword;
            user.hashPassword();
            user.save(function(err) {
            	if (err) return res.status(400).json(errors.utils.throwRawError(err.name, err.message, errors.utils.formatRawError(err)));
            	return res.status(200).json({ message: "Password reset successfully" });
            });
        });
	}
}