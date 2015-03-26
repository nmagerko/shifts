module.exports = {

  formatErrors: function(e) {
    var errorDetails = { };
    for (var err in e.errors) {
      errorDetails[err] = e.errors[err].message;
    }

    return errorDetails;
  }
}
