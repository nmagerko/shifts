var jwt = require('jsonwebtoken');
var settings = require('../../config/settings');

module.exports = {
	authenticate: function(req, res, next) {
		// just to get the endpoint working
		return res.status(200).json({
			token: jwt.sign({
				sub: req.user.username,
				email: req.user.email
			}, settings.secret, settings.jwt)
		});
	}
}