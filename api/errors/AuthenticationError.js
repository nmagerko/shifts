var utils = require('./utils');

var errorTitle = "Invalid credentials";
var errorStatus = "AuthenticationError";

module.exports = {
	throw: function(detail) {
		return utils.throwRawError(errorTitle, errorStatus, detail);
	}
}
