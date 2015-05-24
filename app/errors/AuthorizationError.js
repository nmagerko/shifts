var utils = require('./utils');

var errorTitle = "Invalid credentials";
var errorStatus = "AuthorizationError";

module.exports = {
	throw: function(detail) {
		return utils.throwRawError(errorTitle, errorStatus, detail);
	}
}
