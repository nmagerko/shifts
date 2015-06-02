var utils = require('./utils');

var errorTitle = "User not found";
var errorStatus = "UserNotFoundError";

module.exports = {
	throw: function(detail) {
		return utils.throwRawError(errorTitle, errorStatus, detail);
	}
}
