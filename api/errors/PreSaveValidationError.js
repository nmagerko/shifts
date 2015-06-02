var utils = require('./utils');

var errorTitle = "User validation failed";
var errorStatus = "PreSaveValidationError";

module.exports = {
	throw: function(detail) {
		return utils.throwRawError(errorTitle, errorStatus, detail);
	}
}
