module.exports = {
	formatRawError: function(e) {
		var errorDetails = { };
	    for (var err in e.errors) {
	      errorDetails[err] = e.errors[err].message;
	    }

	    return errorDetails;
	},
  	
	throwRawError: function(title, status, detail) {
		return {
			errors: {
				title: title,
				status: status,
				detail: detail
			}
		}
	}
}
