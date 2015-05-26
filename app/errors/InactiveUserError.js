var utils = require('./utils');

var errorTitle = "Inactive User";
var errorStatus = "InactiveUserError";

module.exports = {
	throw: function(detail) {
		return utils.throwRawError(errorTitle, errorStatus, detail);
	}
}
