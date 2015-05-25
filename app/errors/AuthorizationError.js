var utils = require('./utils');

var errorTitle = "Unauthorized";
var errorStatus = "AuthorizationError";

module.exports = {
	throw: function(detail) {
		return utils.throwRawError(errorTitle, errorStatus, detail);
	}
}
