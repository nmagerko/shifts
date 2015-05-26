var jwt = require('jsonwebtoken');
var settings = require('../../config/settings');

module.exports = {
	authenticate: function(req, res, next) {
		return res.status(200).json({
			token: jwt.sign({
				sub: req.user.username,
				isActive: req.user.isActive
			}, settings.secret, settings.jwt)
		});
	}
}