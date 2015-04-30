var _ = require('lodash');

var template = {
    title: 'User validation failed',
    status: 'PreSaveValidationError',
}

module.exports = {
	throw: function(details) {
		return _.merge({ }, template, { detail: details });
	}
}
